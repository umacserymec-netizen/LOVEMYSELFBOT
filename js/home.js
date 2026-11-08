/* ============================================================
   Home, meals and workouts
   ============================================================ */

/* ---------------------------------- home ---------------------------------- */
LM.screens.home = function () {
  const today = U.todayKey();
  const d = Store.day(today);
  const t = Store.targets(today);
  const g = Store.goals(today);
  const easy = Store.isEasy(today);
  const dow = U.weekdayIndex(today);
  const meals = DATA.MEALS[dow];
  const w = DATA.WORKOUTS[dow];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const name = S.profile.name ? esc(S.profile.name) : 'love';
  const nextM = [3, 7, 14, 30, 60, 100].find(function (m) { return m > S.streak.current; });
  const streakDoneToday = g.qualifies;

  return '' +
    '<section class="greet">' +
      '<p class="eyebrow">' + esc(U.fmtLong(today)) + '</p>' +
      '<h1>' + greeting + ', ' + name + ' ' + (hour < 12 ? '☀️' : hour < 17 ? '🌤️' : '🌙') + '</h1>' +
      '<p class="sub">' + (easy ? 'Easy day. Nothing to prove — just a little care. 🌸' : 'Small steps, soft heart. Let’s do today gently.') + '</p>' +
    '</section>' +

    '<section class="card mood-strip">' +
      '<div class="between"><span class="card-title" style="font-size:14px">How are you feeling?</span><a class="link" href="#/mood">Journal →</a></div>' +
      '<div class="mood-row">' +
        MOODS.map(function (m) {
          return '<button class="mood-btn' + (d.mood === m.emoji ? ' active' : '') + '" data-action="mood" data-mood="' + m.emoji + '" ' +
            'aria-label="Feeling ' + m.label + '" title="' + m.label + '">' + m.emoji + '</button>';
        }).join('') +
      '</div>' +
    '</section>' +

    '<div class="mt">' + quoteCardHTML() + '</div>' +

    '<section class="streak-hero">' +
      '<div class="streak-top">' +
        '<div class="streak-badge">' +
          '<div class="streak-flame">🔥</div>' +
          '<div>' +
            '<div class="streak-num">' + S.streak.current + '<small> day' + (S.streak.current === 1 ? '' : 's') + ' streak</small></div>' +
            '<div class="streak-meta">Best ' + S.streak.best + ' · ' + Store.freezesLeft() + ' freeze' + (Store.freezesLeft() === 1 ? '' : 's') + ' left</div>' +
          '</div>' +
        '</div>' +
        (streakDoneToday
          ? '<span class="pill mint">today counts ✓</span>'
          : '<span class="pill">' + g.metCount + '/' + g.need + ' today</span>') +
      '</div>' +
      '<div class="rings">' + ringsHTML(today) + '</div>' +
      (nextM
        ? '<p class="tiny bold" style="position:relative;z-index:1;margin-top:12px;color:#5E4A70">Next milestone: ' + nextM + ' days ' + (nextM - S.streak.current) + ' to go 🌱</p>'
        : '<p class="tiny bold" style="position:relative;z-index:1;margin-top:12px;color:#5E4A70">You’ve hit every milestone. Still showing up. Iconic. 💗</p>') +
    '</section>' +

    '<h2 class="section-title">Today’s meals <a href="#/meals/' + dow + '">Week plan →</a></h2>' +
    '<div class="meal-list">' +
      meals.map(function (meal, i) {
        const m = S.swaps[today + '|' + i] || meal;
        return '<a class="meal-mini" href="#/meals/' + dow + '">' +
          '<span class="meal-mini-emoji">' + m.emoji + '</span>' +
          '<span class="meal-mini-body">' +
            '<span class="meal-mini-type">' + meal.type + (m !== meal ? ' · swapped' : '') + '</span>' +
            '<span class="meal-mini-name">' + esc(m.name) + '</span>' +
            '<span class="meal-mini-meta">' +
              '<span class="pill pink">' + m.protein + 'g protein</span>' +
              '<span class="pill mint">' + m.fiber + 'g fiber</span>' +
            '</span>' +
          '</span>' +
          '<span class="meal-mini-arrow">›</span>' +
        '</a>';
      }).join('') +
    '</div>' +

    '<h2 class="section-title">Move <a href="#/workouts">Week plan →</a></h2>' +
    '<div class="workout-card">' +
      '<a class="workout-emoji" href="#/workouts/' + dow + '">' + (easy && w.type !== 'easy' ? '🌷' : w.emoji) + '</a>' +
      '<a class="grow" href="#/workouts/' + dow + '">' +
        '<h3>' + esc(easy && w.type !== 'easy' ? 'Gentle walk or stretch' : w.title) + '</h3>' +
        '<p>' + esc(easy && w.type !== 'easy' ? 'Easy mode: 20–30 min, nothing to prove' : w.subtitle) + '</p>' +
        '<div class="meal-meta">' +
          '<span class="pill ' + (d.workout ? 'mint' : 'plain') + '">' + (d.workout ? 'Done ✓' : 'Not ticked yet') + '</span>' +
          (easy && w.type !== 'easy' ? '<span class="pill peach">easy mode</span>' : w.type === 'run' ? '<span class="pill sky">run-walk</span>' : '') +
        '</div>' +
      '</a>' +
      '<button class="btn btn-sm ' + (d.workout ? 'btn-mint' : 'btn-soft') + '" data-action="workout-toggle" data-date="' + today + '">' +
        (d.workout ? '✓' : 'Tick') + '</button>' +
    '</div>' +

    '<div class="card mt">' +
      '<div class="card-head">' +
        '<div><div class="card-title">💧 Water</div><div class="card-sub">' + (d.water / 1000).toFixed(2) + ' L of ' + (t.water / 1000).toFixed(1) + ' L</div></div>' +
        '<span class="pill sky">' + Math.round(U.pct(d.water, t.water) * 100) + '%</span>' +
      '</div>' +
      '<div class="glasses">' + glassHTML(d.water, t.water) + '</div>' +
      '<div class="btn-row mt-s">' +
        '<button class="btn btn-sm btn-soft" data-action="water-add" data-ml="250">+ 250 ml</button>' +
        '<button class="btn btn-sm btn-ghost" data-action="water-add" data-ml="-250">Undo</button>' +
        '<a class="btn btn-sm btn-ghost" href="#/track">Full tracker</a>' +
      '</div>' +
    '</div>' +

    '<div class="card mt" style="padding:6px 16px">' +
      '<div class="toggle-row" style="border:0">' +
        '<div><div class="t-name">Period today 🩸</div><div class="t-sub">Easy mode, kinder targets, zero pressure</div></div>' +
        '<label class="switch"><input type="checkbox" data-change="period" ' + (d.period ? 'checked' : '') + ' aria-label="Period today">' +
          '<span class="track"></span><span class="thumb"></span></label>' +
      '</div>' +
    '</div>' +

    treatCardHTML();
};

/* ------------------------------ invent a dish ----------------------------- */
var INVENT_KEY = 'loveMyself.invent.v1';
var INVENT_PASS_KEY = 'loveMyself.invent.pass';
var INVENT_LIMIT = 10;
var INVENT_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];
var INVENT_EMOJI = { breakfast: '🥣', lunch: '🍛', dinner: '🍲', snack: '🍎' };

function inventTodayCount() {
  try {
    const raw = JSON.parse(localStorage.getItem(INVENT_KEY) || 'null');
    if (!raw || raw.date !== U.todayKey()) return 0;
    return U.clamp(Number(raw.count) || 0, 0, INVENT_LIMIT);
  } catch (e) {
    return 0;
  }
}

function setInventTodayCount(n) {
  try {
    localStorage.setItem(INVENT_KEY, JSON.stringify({
      date: U.todayKey(),
      count: U.clamp(Number(n) || 0, 0, INVENT_LIMIT)
    }));
  } catch (e) { /* private mode is okay, the server still counts */ }
}

function bumpInventTodayCount() {
  const next = Math.min(INVENT_LIMIT, inventTodayCount() + 1);
  setInventTodayCount(next);
  return next;
}

function inventPasscode() {
  try { return sessionStorage.getItem(INVENT_PASS_KEY) || ''; } catch (e) { return ''; }
}

function rememberInventPasscode(passcode) {
  try { sessionStorage.setItem(INVENT_PASS_KEY, passcode); } catch (e) { /* no problem */ }
}

function inventDefaultType() {
  const hour = new Date().getHours();
  if (hour < 11) return 'breakfast';
  if (hour < 16) return 'lunch';
  if (hour < 20) return 'dinner';
  return 'snack';
}

function inventResultHTML(r) {
  return '<div class="invent-result" id="invent-result">' +
    '<div class="meal-top">' +
      '<div class="meal-emoji">' + (r.emoji || INVENT_EMOJI[r.mealType] || '🍲') + '</div>' +
      '<div class="grow">' +
        '<div class="meal-type">Invented ' + esc(r.mealType || 'dish') + ' · 15–20 min</div>' +
        '<div class="meal-name">' + esc(r.name) + '</div>' +
        '<div class="meal-meta">' +
          '<span class="pill pink">approx ' + r.protein + ' g protein</span>' +
          '<span class="pill mint">approx ' + r.fiber + ' g fiber</span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<h4>Ingredients</h4>' +
    '<ul>' + r.ingredients.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
    '<h4>How · 15–20 min</h4>' +
    '<ol>' + r.steps.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
    '<p class="tiny muted mt-s">Nutrition is approximate. Close enough is a lovely place to be.</p>' +
    '<div class="btn-row mt-s">' +
      '<button class="btn btn-sm btn-mint" data-action="save-invent"' + (r.saved ? ' disabled' : '') + '>' +
        (r.saved ? 'Saved 💗' : 'Save dish') + '</button>' +
      '<button class="btn btn-sm btn-soft" data-action="retry-invent">Try another 🔁</button>' +
    '</div>' +
  '</div>';
}

function inventCardHTML() {
  const count = inventTodayCount();
  const left = Math.max(0, INVENT_LIMIT - count);
  const inv = ui.invent;
  const pass = inventPasscode();
  const loading = inv.loading;
  const selected = inv.mealType || inventDefaultType();
  const protein = inv.protein || 25;
  const note = loading
    ? 'Thinking of something warm and good… 🍲'
    : (inv.error || inv.notice || '');

  return '<section class="card invent-card" id="invent-card">' +
    '<div class="card-head">' +
      '<div><div class="card-title">✨ Invent me a new dish</div>' +
        '<div class="card-sub">A little kitchen helper for days when you want something new.</div></div>' +
      '<span class="pill peach">v2</span>' +
    '</div>' +
    '<p class="small muted">Tell it what you feel like. It will invent one vegetarian dish with approx protein and fiber, then you can save it to your own little cookbook.</p>' +
    '<form data-form="invent-meal">' +
      '<div class="field-row">' +
        '<div class="field"><label for="invent-type">Meal</label>' +
          '<select id="invent-type" name="mealType">' +
            INVENT_TYPES.map(function (t) {
              return '<option value="' + t + '"' + (t === selected ? ' selected' : '') + '>' +
                t.charAt(0).toUpperCase() + t.slice(1) + '</option>';
            }).join('') +
          '</select></div>' +
        '<div class="field"><label for="invent-protein">Protein target (g)</label>' +
          '<input id="invent-protein" type="number" name="protein" min="5" max="100" step="1" value="' + protein + '">' +
        '</div>' +
      '</div>' +
      '<div class="field"><label for="invent-pass">Passcode</label>' +
        '<input id="invent-pass" type="password" name="passcode" value="' + esc(pass) + '" autocomplete="off" placeholder="The one set in AI_PASSCODE">' +
        '<div class="hint">Kept only for this tab. The key itself never touches the app.</div>' +
      '</div>' +
      (note ? '<p class="invent-note" role="status">' + esc(note) + '</p>' : '') +
      '<div class="btn-row mt-s">' +
        '<button class="btn btn-primary" type="submit"' + (loading || left <= 0 ? ' disabled' : '') + '>' +
          (loading ? 'Inventing…' : 'Invent a dish ✨') + '</button>' +
        '<span class="tiny muted">' + (left > 0 ? left + ' of ' + INVENT_LIMIT + ' left today' : 'Today’s 10 are used. Back tomorrow.') + '</span>' +
      '</div>' +
    '</form>' +
    (inv.result ? inventResultHTML(inv.result) : '') +
  '</section>';
}

async function generateInventedDish(params) {
  if (ui.invent.loading) return;
  const passcode = String(params.passcode || '').trim();
  const protein = Math.round(Number(params.protein));
  const mealType = INVENT_TYPES.indexOf(params.mealType) >= 0 ? params.mealType : inventDefaultType();

  if (!passcode) {
    ui.invent.error = 'Enter the passcode you set in AI_PASSCODE first.';
    ui.invent.notice = '';
    render();
    return;
  }
  if (!Number.isFinite(protein) || protein < 5 || protein > 100) {
    ui.invent.error = 'Pick a protein target between 5 and 100 g.';
    ui.invent.notice = '';
    render();
    return;
  }
  if (inventTodayCount() >= INVENT_LIMIT) {
    ui.invent.error = 'Today’s 10 inventions are used up. They reset tomorrow.';
    ui.invent.notice = '';
    render();
    return;
  }

  rememberInventPasscode(passcode);
  ui.invent.mealType = mealType;
  ui.invent.protein = protein;
  ui.invent.loading = true;
  ui.invent.error = '';
  ui.invent.notice = '';
  ui.invent.result = null;
  render();

  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, 35000);
  let data = null;

  try {
    const response = await fetch('/api/generate-meal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mealType: mealType,
        protein: protein,
        vegetarian: true,
        passcode: passcode
      }),
      signal: controller.signal
    });

    try { data = await response.json(); } catch (e) { data = null; }

    if (!response.ok) {
      const message = data && typeof data.error === 'string' && data.error.length < 220
        ? data.error
        : response.status === 429
          ? 'Today’s 10 inventions are used up. They reset tomorrow.'
          : response.status === 401
            ? "That passcode didn't match. Check the one set in AI_PASSCODE."
            : 'The kitchen is taking a little break. Try again in a moment.';
      if (response.status === 429) setInventTodayCount(INVENT_LIMIT);
      ui.invent.error = message;
      return;
    }

    if (!data || !data.name || !Array.isArray(data.ingredients) || !Array.isArray(data.steps)) {
      ui.invent.error = 'The kitchen sent something a little unexpected. Try another.';
      return;
    }

    bumpInventTodayCount();
    ui.invent.result = {
      name: String(data.name).slice(0, 90),
      protein: Math.round(Number(data.protein) || 0),
      fiber: Math.round(Number(data.fiber) || 0),
      ingredients: data.ingredients.map(function (x) { return String(x); }),
      steps: data.steps.map(function (x) { return String(x); }),
      mealType: mealType,
      emoji: INVENT_EMOJI[mealType] || '🍲',
      time: '15–20',
      saved: false
    };
    ui.invent.notice = 'Fresh from the kitchen. Nutrition is approximate.';
  } catch (err) {
    if (err && err.name === 'AbortError') {
      ui.invent.error = 'The kitchen took a little too long. Try again in a moment.';
    } else if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      ui.invent.error = 'You’re offline right now. Your saved dishes and meal plan are still here.';
    } else {
      ui.invent.error = 'Couldn’t reach the kitchen just now. Your plan is still here — try again in a bit.';
    }
  } finally {
    clearTimeout(timer);
    ui.invent.loading = false;
    render();
  }
}

/* ---------------------------------- meals --------------------------------- */
LM.screens.meals = function (param) {
  const today = U.todayKey();
  const week = U.weekDates(today);
  let sel = param != null ? parseInt(param, 10) : U.weekdayIndex(today);
  if (isNaN(sel)) sel = U.weekdayIndex(today);
  sel = U.clamp(sel, 0, 6);
  const date = week[sel];
  const meals = DATA.MEALS[sel];
  const easy = Store.isEasy(date);

  const strip = week.map(function (dt, i) {
    const log = S.days[dt];
    const done = (log && log.frozen) || Store.goals(dt).qualifies;
    return '<a class="day-chip' + (i === sel ? ' active' : '') + (dt === today ? ' today' : '') +
      (done ? ' done' : '') + (Store.isEasy(dt) ? ' easy' : '') + '" href="#/meals/' + i + '">' +
      '<span>' + U.DAY_SHORT[i] + '</span>' +
      '<span class="num">' + U.parseKey(dt).getDate() + '</span>' +
      '<span class="dot"></span></a>';
  }).join('');

  const cards = meals.map(function (meal, i) {
    const key = date + '|' + i;
    const swap = S.swaps[key];
    const m = swap || meal;
    const opts = ui.swapOptions[key];
    const recipe = (m.ingredients && m.steps) ? m : meal;
    return '<div class="card meal-card">' +
      '<div class="meal-top">' +
        '<div class="meal-emoji">' + m.emoji + '</div>' +
        '<div class="grow">' +
          '<div class="meal-type">' + meal.type + (swap ? ' · swapped' : '') + '</div>' +
          '<div class="meal-name">' + esc(m.name) + '</div>' +
          '<div class="meal-meta">' +
            '<span class="pill pink">' + m.protein + ' g protein</span>' +
            '<span class="pill mint">' + m.fiber + ' g fiber</span>' +
            (m.kcal ? '<span class="pill plain">' + m.kcal + ' kcal</span>' : '') +
            ((m.time || meal.time) ? '<span class="pill sky">' + (m.time || meal.time) + ' min</span>' : '') +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="meal-actions">' +
        '<button class="btn btn-sm btn-soft" data-action="swap-meal" data-key="' + key + '" data-type="' + meal.type + '" data-protein="' + meal.protein + '">🔁 Swap meal</button>' +
        (swap ? '<button class="btn btn-sm btn-ghost" data-action="reset-swap" data-key="' + key + '">Reset</button>' : '') +
      '</div>' +
      (swap
        ? '<p class="tiny muted mt-s">Swapped for similar protein. Your original plan is still saved.</p>'
        : '') +
      '<details class="recipe"><summary>' + (swap ? 'Quick recipe + ingredients' : 'Recipe + ingredients') + '</summary>' +
        '<h4>Ingredients</h4><ul>' + recipe.ingredients.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>' +
        '<h4>How</h4><ol>' + recipe.steps.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ol>' +
      '</details>' +
      (opts && opts.length
        ? '<div class="swap-list">' + opts.map(function (o, idx) {
            return '<div class="swap-item"><span>' + o.emoji + '</span>' +
              '<span class="swap-name">' + esc(o.name) + '</span>' +
              '<span class="swap-note">' + o.protein + 'g P · ' + o.fiber + 'g F</span>' +
              '<button class="btn btn-sm btn-soft" data-action="use-swap" data-key="' + key + '" data-idx="' + idx + '">Use</button></div>';
          }).join('') + '</div>'
        : '') +
    '</div>';
  }).join('');

  const savedDishItems = [];
  (S.savedDishes || []).forEach(function (dish) {
    (dish.ingredients || []).forEach(function (item) {
      const clean = String(item).trim();
      if (clean && !savedDishItems.some(function (x) { return x.toLowerCase() === clean.toLowerCase(); })) {
        savedDishItems.push(clean);
      }
    });
  });

  const grocery = '<details class="card meal-card" style="margin-top:14px">' +
    '<summary class="card-title" style="cursor:pointer;list-style:none;justify-content:space-between">🧺 Weekly grocery list <span class="pill">tap to open</span></summary>' +
    DATA.GROCERY.map(function (grp) {
      return '<div class="block"><div class="block-name">' + grp.emoji + ' ' + grp.group + '</div>' +
        '<div class="chips">' + grp.items.map(function (item) {
          return '<button class="chip' + (ui.grocery[item] ? ' on' : '') + '" data-action="grocery-toggle" data-item="' + esc(item) + '">' + esc(item) + '</button>';
        }).join('') + '</div></div>';
    }).join('') +
    (savedDishItems.length
      ? '<div class="block"><div class="block-name">✨ From your dishes</div>' +
          '<div class="chips">' + savedDishItems.map(function (item) {
            return '<button class="chip' + (ui.grocery[item] ? ' on' : '') + '" data-action="grocery-toggle" data-item="' + esc(item) + '">' + esc(item) + '</button>';
          }).join('') + '</div></div>'
      : '') +
    '<p class="tiny muted mt-s">Tap items as you shop. It resets when you close the app — no pressure.</p>' +
  '</details>';

  return '' +
    '<section class="greet" style="padding-bottom:4px">' +
      '<p class="eyebrow">Weekly veg meal plan</p>' +
      '<h1>What’s cooking? 🍲</h1>' +
      '<p class="sub">Half plate veggies, quarter protein, quarter carbs, a little healthy fat.</p>' +
    '</section>' +
    '<div class="weekstrip">' + strip + '</div>' +
    '<div class="between" style="margin:0 2px 10px">' +
      '<div><div class="bold" style="font-size:16px">' + esc(U.prettyDay(date)) + '</div>' +
        '<div class="small muted">' + esc(U.fmtDate(date, { weekday: 'long', day: 'numeric', month: 'short' })) + (easy ? ' · easy day 🌸' : '') + '</div></div>' +
      '<span class="pill peach">' + meals.reduce(function (a, m) { return a + m.protein; }, 0) + 'g protein planned</span>' +
    '</div>' +
    cards +
    inventCardHTML() +
    grocery +
    '<p class="tiny muted center" style="margin-top:16px">Plans are flexible. Swap anything. Food is not a test.</p>';
};

/* -------------------------------- workouts -------------------------------- */
LM.screens.workouts = function (param) {
  if (param != null) return workoutDetail(param);
  const today = U.todayKey();
  const week = U.weekDates(today);
  const dow = U.weekdayIndex(today);
  const w = DATA.WORKOUTS[dow];
  const log = Store.day(today);
  const easy = Store.isEasy(today);

  const rows = DATA.WORKOUTS.map(function (wk, i) {
    const dt = week[i];
    const done = !!(S.days[dt] && S.days[dt].workout);
    return '<a class="workout-row' + (i === dow ? ' today' : '') + (done ? ' done' : '') + '" href="#/workouts/' + i + '">' +
      '<span class="wr-emoji">' + wk.emoji + '</span>' +
      '<span class="grow"><h4>' + esc(wk.title) + '</h4><p>' + U.DAY_SHORT[i] + ' · ' + esc(wk.subtitle) + '</p></span>' +
      (done ? '<span class="pill mint">✓</span>' : '<span class="meal-mini-arrow">›</span>') +
    '</a>';
  }).join('');

  return '' +
    '<section class="greet" style="padding-bottom:4px">' +
      '<p class="eyebrow">Move, gently</p>' +
      '<h1>Strong + soft 🏃‍♀️</h1>' +
      '<p class="sub">Home workouts, no equipment, 25–40 minutes. Walking absolutely counts.</p>' +
    '</section>' +

    '<div class="card soft-pink">' +
      '<div class="between"><span class="pill pink">Today’s move</span>' +
        (log.workout ? '<span class="pill mint">Done ✓</span>' : '<span class="pill">not yet</span>') + '</div>' +
      '<div class="row mt-s">' +
        '<div class="workout-emoji">' + w.emoji + '</div>' +
        '<div class="grow"><h3 style="font-size:17px;font-weight:900">' + esc(w.title) + '</h3>' +
          '<p class="small muted">' + esc(w.subtitle) + '</p></div>' +
      '</div>' +
      '<div class="btn-row mt">' +
        '<a class="btn btn-primary" href="#/workouts/' + dow + '">Open workout →</a>' +
        '<button class="btn ' + (log.workout ? 'btn-mint' : 'btn-ghost') + '" data-action="workout-toggle" data-date="' + today + '">' +
          (log.workout ? 'Undo tick' : 'Mark done') + '</button>' +
      '</div>' +
    '</div>' +

    (easy ? '<div class="care-card"><h3>Easy day 🌸</h3><p>Strength is swapped for a walk, yoga or stretching. Two of four goals still counts today. Nothing to prove.</p></div>' : '') +

    '<div class="mt">' + runPlanCardHTML() + '</div>' +

    '<h2 class="section-title">This week’s plan</h2>' +
    '<div class="workout-list">' + rows + '</div>' +

    '<div class="card mt">' +
      '<div class="card-title">🎒 No equipment needed</div>' +
      '<p class="small muted mt-s">A sturdy wall, a chair, a water bottle and a bit of floor. That’s the whole gym. Every strength move has a gentler version — take it whenever you like.</p>' +
    '</div>';
};

function workoutDetail(param) {
  const today = U.todayKey();
  const week = U.weekDates(today);
  let idx = parseInt(param, 10);
  if (isNaN(idx)) idx = U.weekdayIndex(today);
  idx = U.clamp(idx, 0, 6);
  const w = DATA.WORKOUTS[idx];
  const date = week[idx];
  const log = S.days[date] || Store.newDay();
  const easy = Store.isEasy(date);
  const gentle = easy && w.type !== 'easy';

  const blocks = w.blocks.map(function (block) {
    if (block.exercises) {
      return '<div class="block"><div class="block-name">' + esc(block.name) + '</div>' +
        block.exercises.map(function (ex) {
          return '<div class="exercise">' +
            '<div class="ex-demo">' + exerciseDemo(ex.name) + '<span class="ex-demo-emoji">' + ex.emoji + '</span></div>' +
            '<div class="ex-body"><div class="ex-name">' + esc(ex.name) + '</div>' +
              '<div class="ex-reps">' + esc(ex.reps) + '</div>' +
              '<div class="ex-cue">' + esc(ex.cue) + '</div></div>' +
            '<button class="btn btn-sm btn-soft ex-timer" data-action="timer" data-name="' + esc(ex.name) + '" data-sec="' + ex.seconds + '" data-emoji="' + ex.emoji + '">⏱ ' + ex.seconds + 's</button>' +
          '</div>';
        }).join('') +
      '</div>';
    }
    return '<div class="block"><div class="block-name">' + esc(block.name) + '</div><ul>' +
      block.items.map(function (i) { return '<li>' + esc(i) + '</li>'; }).join('') + '</ul></div>';
  }).join('');

  const runExtras = w.type === 'run'
    ? '<div class="mt">' + runPlanCardHTML() + '</div>' +
      '<details class="card mt"><summary class="card-title" style="cursor:pointer;list-style:none">🏃‍♀️ Pre-run routine (10 min)</summary>' +
        '<ul class="mt-s small" style="padding-left:18px;color:var(--ink-soft);font-weight:600;display:grid;gap:6px">' +
          '<li>250–300 ml water, 30–60 min before.</li>' +
          '<li>Hungry? Banana, 4–5 dates or peanut-butter toast, 45–60 min before.</li>' +
          '<li>After a full meal, wait about 2 hours.</li>' +
          '<li>Dynamic warm-up: 3 min brisk walk, 10 leg swings each, 20 sec high knees, 20 sec butt kicks, 8 walking lunges each, ankle + hip circles, 10 glute bridges.</li>' +
        '</ul></details>' +
      '<details class="card mt"><summary class="card-title" style="cursor:pointer;list-style:none">🌿 Post-run routine (15 min)</summary>' +
        '<ul class="mt-s small" style="padding-left:18px;color:var(--ink-soft);font-weight:600;display:grid;gap:6px">' +
          '<li>5 min cool-down walk until breathing settles.</li>' +
          '<li>30 sec each side: calves, hamstrings, quads, hip flexors, glutes (figure-4), child’s pose.</li>' +
          '<li>300–500 ml water within 30 min.</li>' +
          '<li>20–25 g protein within an hour: whey + banana, curd + fruit, paneer sandwich or sprouts chaat.</li>' +
        '</ul></details>'
    : '';

  return '' +
    '<a class="link" href="#/workouts">← All workouts</a>' +
    '<section class="greet" style="padding-top:10px">' +
      '<p class="eyebrow">' + U.DAY_SHORT[idx] + ' · ' + esc(U.fmtDate(date, { day: 'numeric', month: 'short' })) + (easy ? ' · easy day' : '') + '</p>' +
      '<h1>' + w.emoji + ' ' + esc(w.title) + '</h1>' +
      '<p class="sub">' + esc(w.subtitle) + '</p>' +
    '</section>' +

    '<div class="card soft">' +
      '<div class="between">' +
        '<div><div class="card-title">' + (log.workout ? 'Done ✓' : 'Ready when you are') + '</div>' +
          '<div class="card-sub">' + (log.workout ? 'Ticked for ' + esc(U.prettyDay(date)) + '. Proud of you.' : 'Tap done whenever — even if you only did half.') + '</div></div>' +
        '<button class="btn ' + (log.workout ? 'btn-mint' : 'btn-primary') + '" data-action="workout-toggle" data-date="' + date + '">' +
          (log.workout ? 'Undo' : 'Mark done') + '</button>' +
      '</div>' +
    '</div>' +

    (gentle
      ? '<div class="care-card"><h3>Easy mode is on 🌸</h3>' +
          '<p>' + (w.type === 'run'
            ? 'Today’s run is swapped for a gentle walk, some yoga, or a good stretch. That is the whole workout.'
            : 'Today’s strength session is swapped for something gentler. Pick a 20–30 min walk, some yoga, or a good stretch. That is the whole workout.') + '</p>' +
          '<div class="btn-row mt"><button class="btn btn-sm btn-mint" data-action="workout-easy-done" data-date="' + date + '">Mark gentle movement done</button></div>' +
        '</div>' +
        '<details class="card mt"><summary class="card-title" style="cursor:pointer;list-style:none">View the ' + (w.type === 'run' ? 'run' : 'strength') + ' plan anyway</summary>' + blocks + '</details>'
      : blocks) +

    runExtras +

    '<p class="tiny muted center" style="margin-top:18px">Form first, speed later. Rest is part of the workout.</p>';
}

/* --------------------------------- actions -------------------------------- */
LM.actions['new-quote'] = function () {
  ui.quoteSeed = Math.floor(Math.random() * DATA.QUOTES.length);
  if (route().name === 'quotes') ui.quoteRandom = ui.quoteSeed;
  render();
};

LM.actions['swap-meal'] = function (el) {
  const key = el.dataset.key;
  const type = el.dataset.type;
  const base = Number(el.dataset.protein) || 0;
  const pool = DATA.SWAPS[type] || [];
  const sorted = pool.slice().sort(function (a, b) {
    return Math.abs(a.protein - base) - Math.abs(b.protein - base);
  });
  const saved = (S.savedDishes || []).filter(function (d) {
    return String(d.mealType || '').toLowerCase() === String(type || '').toLowerCase();
  });
  let picks = saved.slice(0, 3);
  if (picks.length < 3) picks = picks.concat(U.pick(sorted.slice(0, 7), 3 - picks.length));
  ui.swapOptions[key] = picks;
  render();
};

LM.actions['use-swap'] = function (el) {
  const key = el.dataset.key;
  const opts = ui.swapOptions[key] || [];
  const opt = opts[Number(el.dataset.idx)];
  if (!opt) return;
  S.swaps[key] = opt;
  Store.save();
  delete ui.swapOptions[key];
  render();
  toast('Swapped. Still balanced, still yours 💗');
};

LM.actions['reset-swap'] = function (el) {
  delete S.swaps[el.dataset.key];
  Store.save();
  render();
  toast('Back to the original plan 🌷');
};

LM.actions['save-invent'] = function () {
  const r = ui.invent.result;
  if (!r || r.saved) return;
  Store.saveDish({
    id: U.uid(),
    name: r.name,
    emoji: r.emoji,
    protein: r.protein,
    fiber: r.fiber,
    ingredients: r.ingredients.slice(),
    steps: r.steps.slice(),
    time: r.time,
    mealType: r.mealType,
    source: 'invented',
    createdAt: U.todayKey()
  });
  r.saved = true;
  render();
  toast('Saved to your dishes. It can appear in Swap meal and groceries 💗');
};

LM.actions['retry-invent'] = function () {
  generateInventedDish({
    mealType: ui.invent.mealType,
    protein: ui.invent.protein,
    passcode: inventPasscode()
  });
};

LM.actions['grocery-toggle'] = function (el) {
  const item = el.dataset.item;
  ui.grocery[item] = !ui.grocery[item];
  render();
};

LM.actions['workout-toggle'] = function (el) {
  const date = el.dataset.date || U.todayKey();
  const d = Store.day(date);
  d.workout = !d.workout;
  d.workoutLabel = d.workout
    ? (d.runId ? 'Run' : (Store.isEasy(date) ? 'Gentle movement' : 'Workout'))
    : '';
  Store.save();
  render();
  if (d.workout) toast('Movement logged. That counts 🫶');
};

LM.actions['workout-easy-done'] = function (el) {
  const d = Store.day(el.dataset.date);
  d.workout = true;
  d.workoutLabel = 'Gentle walk / stretch';
  Store.save();
  render();
  toast('Gentle movement logged 🌸');
};

LM.actions['run-week-repeat'] = function () {
  toast('Staying on week ' + S.settings.runWeek + '. Repeating is smart, not slow 💗');
};

LM.actions['run-week-next'] = function () {
  if (S.settings.runWeek >= 12) {
    toast('You’re on the last week. Repeat it as long as it feels good.');
    return;
  }
  S.settings.runWeek += 1;
  Store.save();
  render();
  toast('Week ' + S.settings.runWeek + ' unlocked. Only if it feels right 👟');
};

/* ---------------------------------- forms --------------------------------- */
LM.forms['invent-meal'] = function (form) {
  const els = form.elements;
  generateInventedDish({
    mealType: els['mealType'].value,
    protein: Number(els['protein'].value),
    passcode: (els['passcode'].value || '').trim()
  });
};
