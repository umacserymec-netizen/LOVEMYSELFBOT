/* ============================================================
   Love Myself — POST /api/generate-meal

   Vercel serverless function. Calls an OpenAI-compatible chat
   API (Groq by default) and returns one vegetarian dish as JSON.

   Required environment variables:
     AI_API_KEY   secret API key (never sent to the browser)
     AI_PASSCODE  the passcode the app asks for before generating

   Optional:
     AI_API_URL   default https://api.groq.com/openai/v1/chat/completions
     AI_MODEL     default llama-3.3-70b-versatile
   ============================================================ */

const crypto = require('crypto');

const DAILY_LIMIT = 10;
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
const DEFAULT_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

/* Best-effort in-memory counter. Serverless instances are short-lived,
   so this is a speed bump, not a billing guarantee. The browser also
   keeps its own 10-a-day count. */
const buckets = globalThis.__lmMealBuckets || (globalThis.__lmMealBuckets = new Map());

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

function fail(res, status, message) {
  send(res, status, { error: message });
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function clientIp(req) {
  const forwarded = req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip']);
  if (forwarded) return String(forwarded).split(',')[0].trim();
  return 'unknown';
}

function samePasscode(given, expected) {
  const a = Buffer.from(String(given || ''));
  const b = Buffer.from(String(expected || ''));
  if (!a.length || a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function readBody(req) {
  if (!req.body) return null;
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (e) { return null; }
  }
  return typeof req.body === 'object' ? req.body : null;
}

function numberFrom(value) {
  const n = parseFloat(String(value == null ? '' : value).replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : NaN;
}

function clamp(n, lo, hi) {
  return Math.min(hi, Math.max(lo, n));
}

function cleanList(value, maxItems, maxLength) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item == null ? '' : item).replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, maxItems)
    .map((item) => item.slice(0, maxLength));
}

function extractJson(text) {
  if (typeof text !== 'string') throw new Error('empty response');
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('no json object');
  return JSON.parse(cleaned.slice(start, end + 1));
}

function validateDish(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('bad dish');
  const name = String(raw.name == null ? '' : raw.name).replace(/\s+/g, ' ').trim().slice(0, 90);
  const protein = numberFrom(raw.protein);
  const fiber = numberFrom(raw.fiber);
  const ingredients = cleanList(raw.ingredients, 20, 120);
  const steps = cleanList(raw.steps, 5, 220);

  if (name.length < 3) throw new Error('bad name');
  if (!Number.isFinite(protein) || protein < 0 || protein > 100) throw new Error('bad protein');
  if (!Number.isFinite(fiber) || fiber < 0 || fiber > 60) throw new Error('bad fiber');
  if (ingredients.length < 2) throw new Error('bad ingredients');
  if (steps.length < 4) throw new Error('bad steps');

  return {
    name: name,
    protein: Math.round(protein),
    fiber: Math.round(fiber),
    ingredients: ingredients,
    steps: steps
  };
}

function promptFor(mealType, protein) {
  return [
    'Invent one simple vegetarian Indian-friendly ' + mealType + ' with about ' + protein + ' g of protein.',
    'It must be vegetarian (eggs are okay, no meat, no fish).',
    'Use everyday ingredients and a balanced plate: vegetables, protein, a little carb, a little healthy fat.',
    'It should take 15-20 minutes and be realistic for one person cooking at home.',
    'Return ONLY a compact JSON object with exactly these keys:',
    '{"name":"dish name","protein":number,"fiber":number,"ingredients":["short ingredient with quantity"],"steps":["short step","short step","short step","short step"]}',
    'Use 4 or 5 steps. Numbers for protein and fiber are approximate grams. No markdown, no extra text.'
  ].join(' ');
}

async function callModel(mealType, protein) {
  const url = process.env.AI_API_URL || DEFAULT_URL;
  const model = process.env.AI_MODEL || DEFAULT_MODEL;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.AI_API_KEY
      },
      body: JSON.stringify({
        model: model,
        temperature: 0.8,
        max_tokens: 700,
        messages: [
          {
            role: 'system',
            content: 'You are a kind, practical vegetarian home-cooking assistant. You always answer with valid JSON only.'
          },
          { role: 'user', content: promptFor(mealType, protein) }
        ]
      }),
      signal: controller.signal
    });

    if (!response.ok) {
      const err = new Error('upstream ' + response.status);
      err.status = response.status;
      throw err;
    }

    const data = await response.json();
    const content = data && data.choices && data.choices[0] &&
      data.choices[0].message && data.choices[0].message.content;
    return validateDish(extractJson(content));
  } finally {
    clearTimeout(timer);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'Use POST to invent a dish.');
  }

  const key = process.env.AI_API_KEY;
  const passcode = process.env.AI_PASSCODE;

  if (!key) return fail(res, 503, 'The AI kitchen is not set up yet. Add AI_API_KEY in Vercel.');
  if (!passcode) return fail(res, 503, 'The AI kitchen needs a passcode. Set AI_PASSCODE in Vercel.');

  const body = readBody(req);
  if (!body) return fail(res, 400, 'That request was a little empty. Try again.');

  if (!samePasscode(body.passcode, passcode)) {
    return fail(res, 401, "That passcode didn't match. Check the one set in AI_PASSCODE.");
  }

  const mealType = String(body.mealType || '').toLowerCase();
  const protein = Math.round(numberFrom(body.protein));
  if (MEAL_TYPES.indexOf(mealType) < 0) {
    return fail(res, 400, 'Pick breakfast, lunch, dinner or snack first.');
  }
  if (!Number.isFinite(protein) || protein < 5 || protein > 100) {
    return fail(res, 400, 'Pick a protein target between 5 and 100 g.');
  }
  if (body.vegetarian !== true) {
    return fail(res, 400, 'This kitchen only invents vegetarian dishes.');
  }

  const bucket = clientIp(req) + '|' + todayKey();
  const used = buckets.get(bucket) || 0;
  if (used >= DAILY_LIMIT) {
    return fail(res, 429, "Today's 10 inventions are used up. They reset tomorrow.");
  }
  buckets.set(bucket, used + 1);

  if (buckets.size > 500) {
    const today = todayKey();
    for (const k of buckets.keys()) {
      if (!k.endsWith('|' + today)) buckets.delete(k);
    }
  }

  let success = false;
  try {
    const dish = await callModel(mealType, protein);
    success = true;
    return send(res, 200, dish);
  } catch (err) {
    const status = err && err.status;
    if (status === 401 || status === 403) {
      return fail(res, 503, "The AI key wasn't accepted. Check AI_API_KEY in Vercel.");
    }
    if (status === 429) {
      return fail(res, 503, 'The kitchen is a little busy right now. Try again in a minute.');
    }
    if (err && err.name === 'AbortError') {
      return fail(res, 504, 'The kitchen took too long. Try again in a moment.');
    }
    if (status) {
      return fail(res, 503, "The kitchen couldn't cook that one. Try again in a moment.");
    }
    return fail(res, 502, 'The kitchen sent something unexpected. Try another.');
  } finally {
    if (!success) {
      const left = Math.max(0, (buckets.get(bucket) || 1) - 1);
      buckets.set(bucket, left);
    }
  }
};
