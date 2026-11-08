# Love Myself 💗

A soft, colourful, offline-first wellness PWA built for one person. Slow fat loss, good food, gentle movement, a kinder head — no login, no cloud, no shame.

Everything personal lives in your phone's `localStorage`. There is no account, no analytics and no database. The optional AI dish inventor uses one serverless endpoint and only sends the meal type, protein target, vegetarian flag and passcode — never your profile, logs or backup.

## What's inside

- **Today** — greeting, mood check-in, daily quote, streak hero with protein / fiber / water / movement rings, today's meals, movement, water glasses, period-day switch and treat card.
- **Streaks with freezes** — a missed day bends the streak instead of breaking it. Two automatic freezes per month.
- **Meals** — a 7-day vegetarian meal plan with 4 meals a day, recipes for both the original and swapped meals, 10 swaps per meal type and a tappable grocery list.
- **Invent a new dish (v2)** — ask the optional AI kitchen for one vegetarian dish with approx protein and fiber, ingredients and 4–5 short steps. Save it to your own cookbook; saved dishes appear in Swap meal and the grocery list. Up to 10 generations a day.
- **Move** — 7 home workouts (strength, yoga, walk, run-walk) with inline exercise demo illustrations, timers, plus a 12-week run-walk plan.
- **Track** — protein and fiber checklists, custom entries, water glasses and gentle progress bars.
- **Mood + journal** — one-tap moods, an optional note, a weekly mood strip, a 7-day trend in Progress and a low-day care card.
- **Progress** — weekly summary with streak days, water, protein and mood trend, weight / waist check-ins, a gentle weight trend and run stats.
- **Quotes** — 105 original reminders across morning, workout, low-day, streak and easy-day moods.
- **Run tracker** — live GPS distance, time and pace, wake-lock support, manual add / edit, longest non-stop jog, badges and readiness-based milestone suggestions.
- **Treats** — unlocked after 15 counted days; if unused for 3 days it rolls over quietly with the counter held at 15, so it never pops up early or notifies twice.
- **Easy mode** — automatically on Sundays and period days. Lower targets, softer colours and copy, 2 of 4 goals, and runs swap to a gentle walk or stretch.
- **Reminders** — optional water, quote, meal, movement and evening check-in nudges while the app is open or running in the background, with quiet hours and a snooze button.
- **Settings** — profile, targets, easy days, period dates, reminders, quiet hours / snooze, run week, readiness rules, treat ideas, last backup date, export / restore backup and start fresh.
- **PWA** — installable on Android (and desktop), works offline after the first visit, service worker caches the app shell.

## Run it locally

Any static server works. From this folder:

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Then open <http://127.0.0.1:5173/>.

> Opening `index.html` directly with `file://` works for most of the app, but the service worker and install prompt need `http://` or `https://`.

## Deploy to Vercel

1. Push this folder to a Git repository (or drag it into Vercel).
2. Import the project in Vercel. No build command and no framework preset are needed.
3. Add the AI environment variables in **Project → Settings → Environment Variables** (see below).
4. Deploy. `vercel.json` sets the service-worker cache headers and the manifest content type.

The app shell is static: `index.html`, `css/`, `js/`, `icons/`, `manifest.webmanifest` and `sw.js`. The only server code is `api/generate-meal.js`.

## AI dish inventor setup

The Meals screen has an optional **Invent me a new dish** card. It calls `/api/generate-meal`, which runs on Vercel and keeps the API key on the server. Nothing is sent to the AI except the meal type, protein target, `vegetarian: true` and your passcode.

Set these environment variables in Vercel (Production, Preview and Development):

| Variable | Required | What it is |
|---|---|---|
| `AI_API_KEY` | Yes | Secret API key. Never put this in `js/` or any client file. |
| `AI_PASSCODE` | Yes | A short passcode you choose. The app asks for it before generating. |
| `AI_API_URL` | No | OpenAI-compatible chat endpoint. Defaults to Groq: `https://api.groq.com/openai/v1/chat/completions`. |
| `AI_MODEL` | No | Model name. Defaults to `llama-3.3-70b-versatile`. |

This build defaults to **Groq** because it uses the OpenAI-compatible chat format. You can point `AI_API_URL` and `AI_MODEL` at another OpenAI-compatible provider. Gemini and Claude's native APIs use different request shapes and would need a small adapter in `api/generate-meal.js`.

After adding or changing variables, redeploy so the function picks them up.

To run the API locally, use the Vercel CLI instead of a plain static server:

```powershell
npm i -g vercel
vercel dev
```

A plain `python -m http.server` still runs the app, but `/api/generate-meal` will not exist there. The app handles that kindly with an inline message, not a failure screen.

Basic protection: the browser keeps a 10-per-day counter, and the function also limits each IP to 10 successful generations per day. The server limit is in-memory and best-effort because Vercel functions can be short-lived; it is a speed bump, not a billing guarantee. The passcode is checked on the server with a constant-time comparison.

> Keep the key out of Git. `.env` files are ignored; only `.env.example` is committed.

## Install on Android

1. Open the deployed URL in Chrome.
2. Tap the three-dot menu → **Add to Home screen** / **Install app**.
3. Open it from the home screen. After the first load it opens offline.

## Your data

- Stored under the key `loveMyself.v1` in `localStorage`.
- Invented dishes are saved in the same state under `savedDishes`, so they are included in the backup JSON.
- **Settings → Your data → Download backup** saves a JSON file and records the last backup date.
- Settings shows the last backup date and a gentle reminder if it has been 14 days or more.
- **Restore backup** reads that file back, including your invented dishes.
- **Start fresh** clears everything on this device (there is no undo).
- The AI passcode is kept only in `sessionStorage` for the current tab. It is not in the backup.

Clearing browser data or uninstalling the browser will remove the local data, so keep a backup if you change phones.

## Reminder caveat

Reminders are local. They fire while the app is open or alive in the background and notifications are allowed. A fully closed web app cannot be woken without a push server, which this app deliberately does not use. Quiet hours and the snooze button pause reminders (and treat notifications) without changing your data. This is explained in Settings.

## Tech

- Plain HTML, CSS and JavaScript. No build step, no framework, no npm dependencies.
- Classic scripts sharing a small `LM` namespace.
- `localStorage` state, a service worker for offline shell caching, the Geolocation API for runs and the Wake Lock API to keep the screen on while tracking.
- One Vercel serverless function (`api/generate-meal.js`) for the optional AI dish inventor. It uses built-in `fetch` and `crypto`.
- Fonts: Nunito from Google Fonts with system fallbacks.

## A note

This app is a companion, not a doctor. If something hurts, feels wrong, or low days keep stacking, talk to someone qualified. You deserve real support, not just an app. 💗
