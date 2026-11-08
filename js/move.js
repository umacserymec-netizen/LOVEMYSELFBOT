/* ============================================================
   Running, GPS, workout timer and treats
   ============================================================ */

/* ----------------------------------- run ---------------------------------- */
LM.screens.run = function () {
  const today = U.todayKey();
  const stats = Store.runStats();
  const plan = DATA.RUN_PLAN[U.clamp((S.settings.runWeek || 1) - 1, 0, 11)];
  const rd = Store.readiness();
  const runsThisWeek = stats.runs.filter(function (r) {
    return r.date >= U.weekStart(today) && r.date <= today;
  }).length;

  const badges = DATA.BADGES.map(function (b) {
    const earned = Store.badgeEarned(b.id, stats);
    return '<div class="badge' + (earned ? '' : ' locked') + '">' +
      '<span class="b-emoji">' + b.emoji + '</span>' +
      '<span class="b-name">' + esc(b.name) + '</span>' +
    '</div>';
  }).join('');

  const recent = stats.runs.slice().reverse().slice(0, 6).map(function (r) {
    return '<div class="swap-item"><span style="font-size:20px">👟</span>' +
      '<span class="grow"><span class="swap-name">' + esc(U.fmtDate(r.date, { weekday: 'short', day: 'numeric', month: 'short' })) +
        ' · ' + r.distance.toFixed(2) + ' km</span>' +
        '<span class="swap-note" style="display:block;margin-top:2px">' + U.fmtDuration(r.duration) + ' · ' + U.fmtPace(r.pace) + ' /km' +
        (r.jogMin ? ' · ' + r.jogMin + ' min non-stop' : (r.nonstop ? ' · non-stop' : '')) +
        (r.note ? ' · ' + esc(r.note) : '') + (r.mood ? ' ' + r.mood : '') + '</span></span>' +
      '<button class="btn btn-sm btn-ghost" data-action="run-edit" data-id="' + r.id + '" aria-label="Edit run">✏️</button>' +
      '<button class="sheet-close" data-action="run-delete" data-id="' + r.id + '" aria-label="Delete run">✕</button>' +
    '</div>';
  }).join('');

  const goalCard = S.acceptedGoal
    ? '<div class="card soft">' +
        '<div class="between"><div><div class="card-title">🎯 Your next milestone</div>' +
          '<div class="card-sub">You chose this. It can change whenever.</div></div>' +
          '<span class="pill mint">' + Number(S.acceptedGoal.km).toFixed(1) + ' km</span></div>' +
        '<div class="bar mt-s"><span style="width:' + Math.min(100, Math.round(U.pct(stats.longest, S.acceptedGoal.km) * 100)) + '%"></span></div>' +
        '<p class="small muted mt-s">Longest so far: ' + stats.longest.toFixed(2) + ' km. Slow build, no deadline.</p>' +
        '<button class="btn btn-sm btn-ghost mt-s" data-action="readiness-change">Change goal</button>' +
      '</div>'
    : (rd.show
      ? '<div class="care-card" style="background:linear-gradient(145deg,#E7F8FF,#EFE7FF 55%,#FFEAF3)">' +
          '<h3>You look ready 🏔️</h3>' +
          '<p>Everything lines up for <b>' + esc(rd.suggested) + '</b>. Here’s the proof:</p>' +
          '<ul class="small" style="margin:10px 0 0 18px;color:var(--ink-soft);font-weight:700;display:grid;gap:5px">' +
            '<li>' + S.settings.readiness.runsPerWeek + ' runs a week for ' + S.settings.readiness.minRunWeeks + ' weeks in a row ✓</li>' +
            '<li>' + S.streak.current + '-day streak ✓</li>' +
            '<li>Longest non-stop jog ' + Math.round(rd.longestJogMin) + ' min ✓</li>' +
            '<li>Pace steady or improving ✓</li>' +
            '<li>Run moods mostly positive ✓</li>' +
          '</ul>' +
          '<div class="btn-row mt">' +
            '<button class="btn btn-sm btn-primary" data-action="readiness-accept">Accept it</button>' +
            '<button class="btn btn-sm btn-soft" data-action="readiness-change">Change it</button>' +
            '<button class="btn btn-sm btn-ghost" data-action="readiness-notyet">Not yet</button>' +
          '</div>' +
        '</div>'
      : '');

  return '' +
    '<section class="greet" style="padding-bottom:4px">' +
      '<p class="eyebrow">Run-walk · week ' + plan.week + ' of 12</p>' +
      '<h1>One step at a time 🏃‍♀️</h1>' +
      '<p class="sub">Jog easy enough to talk. Walk breaks are part of the plan, not failure.</p>' +
    '</section>' +

    '<div class="card run-hero">' +
      '<div class="between"><span class="pill sky">Week ' + plan.week + '</span>' +
        '<span class="pill">' + runsThisWeek + ' run' + (runsThisWeek === 1 ? '' : 's') + ' this week</span></div>' +
      runPatternHTML(plan) +
      '<p class="small muted mt-s">' + esc(plan.note) + '</p>' +
      '<div class="run-tracker">' +
        '<div class="run-stat"><div class="big" id="rt-dist">0.00</div><div class="lbl">km</div></div>' +
        '<div class="run-stat"><div class="big" id="rt-time">0:00</div><div class="lbl">time</div></div>' +
        '<div class="run-stat"><div class="big" id="rt-pace">—</div><div class="lbl">min / km</div></div>' +
      '</div>' +
      '<div id="run-controls">' + runControlsHTML() + '</div>' +
      '<p class="tiny muted center" style="margin-top:10px" id="rt-status">GPS tracks distance while the screen is on. Allow location when asked.</p>' +
      '<button class="btn btn-sm btn-ghost btn-block" style="margin-top:10px" data-action="run-manual">Add a run manually</button>' +
    '</div>' +

    goalCard +

    '<div class="stat-grid mt">' +
      '<div class="stat"><div class="big">' + stats.thisWeek.toFixed(1) + ' km</div><div class="lbl">this week</div></div>' +
      '<div class="stat"><div class="big">' + stats.thisMonth.toFixed(1) + ' km</div><div class="lbl">this month</div></div>' +
      '<div class="stat"><div class="big">' + stats.longest.toFixed(1) + ' km</div><div class="lbl">longest run</div></div>' +
      '<div class="stat"><div class="big">' + (isFinite(stats.bestPace) ? U.fmtPace(stats.bestPace) : '—') + '</div><div class="lbl">best pace /km</div></div>' +
    '</div>' +

    '<div class="card mt">' +
      '<div class="card-head"><div><div class="card-title">Weekly distance</div><div class="card-sub">Last 8 weeks · bars, not judgements</div></div></div>' +
      runChart() +
    '</div>' +

    '<div class="card">' +
      '<div class="card-head"><div><div class="card-title">Badges</div><div class="card-sub">Collected quietly along the way</div></div>' +
        '<span class="pill">' + DATA.BADGES.filter(function (b) { return Store.badgeEarned(b.id, stats); }).length + '/' + DATA.BADGES.length + '</span></div>' +
      '<div class="badge-grid">' + badges + '</div>' +
    '</div>' +

    '<div class="card">' +
      '<div class="card-title">🏃‍♀️ Pre-run routine</div>' +
      '<ul class="mt-s small" style="padding-left:18px;color:var(--ink-soft);font-weight:600;display:grid;gap:6px">' +
        '<li>250–300 ml water, 30–60 min before.</li>' +
        '<li>Hungry? Banana, 4–5 dates or peanut-butter toast, 45–60 min before.</li>' +
        '<li>After a full meal, wait about 2 hours.</li>' +
        '<li>5–8 min dynamic warm-up: brisk walk, leg swings, high knees, butt kicks, walking lunges, ankle + hip circles, glute bridges.</li>' +
      '</ul>' +
    '</div>' +

    '<div class="card">' +
      '<div class="card-title">🌿 Post-run routine</div>' +
      '<ul class="mt-s small" style="padding-left:18px;color:var(--ink-soft);font-weight:600;display:grid;gap:6px">' +
        '<li>5 min cool-down walk until breathing settles.</li>' +
        '<li>30 sec each side: calves, hamstrings, quads, hip flexors, glutes (figure-4), child’s pose.</li>' +
        '<li>300–500 ml water within 30 min.</li>' +
        '<li>20–25 g protein within an hour: whey + banana, curd + fruit, paneer sandwich or sprouts chaat.</li>' +
      '</ul>' +
    '</div>' +

    '<h2 class="section-title">Recent runs</h2>' +
    (recent ? '<div class="stack">' + recent + '</div>' : emptyHTML('👟', 'Your first run will show up here. A walk counts as a start.')) +

    '<p class="tiny muted center" style="margin-top:16px">No fixed goal on day one. The app only suggests a milestone when your own proof says you’re ready.</p>';
};

/* ------------------------------ run tracker ------------------------------- */
function runControlsHTML() {
  const r = ui.run;
  if (!r) return '<button class="btn btn-primary btn-lg btn-block" data-action="run-start">▶ Start run</button>';
  if (r.paused) {
    return '<div class="btn-row"><button class="btn btn-mint grow" data-action="run-pause">▶ Resume</button>' +
      '<button class="btn btn-dark grow" data-action="run-stop">Finish</button></div>';
  }
  return '<div class="btn-row"><button class="btn btn-soft grow" data-action="run-pause">⏸ Pause</button>' +
    '<button class="btn btn-dark grow" data-action="run-stop">Finish</button></div>';
}

function runElapsedSec() {
  const r = ui.run;
  if (!r) return 0;
  let ms = r.elapsed;
  if (!r.paused && r.segStart) ms += Date.now() - r.segStart;
  return ms / 1000;
}

function updateRunUI() {
  const distEl = document.getElementById('rt-dist');
  if (!distEl) return;
  const r = ui.run;
  const secs = runElapsedSec();
  const km = r ? r.distance / 1000 : 0;
  distEl.textContent = km.toFixed(2);
  const timeEl = document.getElementById('rt-time');
  const paceEl = document.getElementById('rt-pace');
  if (timeEl) timeEl.textContent = U.fmtDuration(secs);
  if (paceEl) paceEl.textContent = km > 0.03 ? U.fmtPace(secs / km) : '—';
  const status = document.getElementById('rt-status');
  if (status) {
    if (!r) status.textContent = 'GPS tracks distance while the screen is on. Allow location when asked.';
    else if (r.error) status.textContent = r.error;
    else if (r.paused) status.textContent = 'Paused. Breathe. Resume when you’re ready.';
    else if (r.accuracy) status.textContent = 'Tracking · GPS ±' + Math.round(r.accuracy) + ' m';
    else status.textContent = 'Finding GPS… keep the phone with you.';
  }
  const ctrl = document.getElementById('run-controls');
  if (ctrl) ctrl.innerHTML = runControlsHTML();
}

function onPosition(pos) {
  const r = ui.run;
  if (!r) return;
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;
  const acc = pos.coords.accuracy;
  r.accuracy = acc;
  r.error = null;
  if (acc && acc > 60) { updateRunUI(); return; }
  if (r.paused) { r.lastPos = { latitude: lat, longitude: lon }; updateRunUI(); return; }
  if (r.lastPos) {
    const d = U.haversine(r.lastPos, { latitude: lat, longitude: lon });
    if (d >= 1.5 && d < 80) {
      r.distance += d;
      r.lastPos = { latitude: lat, longitude: lon };
    } else if (d >= 80) {
      r.lastPos = { latitude: lat, longitude: lon };
    }
  } else {
    r.lastPos = { latitude: lat, longitude: lon };
  }
  updateRunUI();
}

function onGeoError(err) {
  const r = ui.run;
  if (!r) return;
  r.error = err && err.code === 1
    ? 'Location is blocked. Allow it in your browser settings, or add the run manually.'
    : 'GPS signal is patchy — keep moving, I’ll reconnect.';
  updateRunUI();
}

function startRun() {
  if (ui.run) return;
  if (!('geolocation' in navigator)) {
    toast('GPS isn’t available here. Add the run manually instead.');
    return;
  }
  ui.run = {
    paused: false, elapsed: 0, segStart: Date.now(), distance: 0,
    lastPos: null, watchId: null, accuracy: null, error: null, timer: null
  };
  try {
    ui.run.watchId = navigator.geolocation.watchPosition(onPosition, onGeoError, {
      enableHighAccuracy: true, maximumAge: 2000, timeout: 20000
    });
  } catch (e) {
    ui.run.error = 'Could not start GPS. Add the run manually instead.';
  }
  ui.run.timer = setInterval(updateRunUI, 500);
  keepAwake();
  updateRunUI();
  toast('Run started. You’ve got this 👟');
}

function pauseRun() {
  const r = ui.run;
  if (!r) return;
  if (r.paused) {
    r.paused = false;
    r.segStart = Date.now();
    keepAwake();
  } else {
    r.elapsed += Date.now() - r.segStart;
    r.segStart = null;
    r.paused = true;
    if (r.lastPos) r.lastPos = null;
  }
  updateRunUI();
}

function stopRun() {
  const r = ui.run;
  if (!r) return;
  let secs = r.elapsed;
  if (!r.paused && r.segStart) secs += Date.now() - r.segStart;
  if (r.timer) clearInterval(r.timer);
  if (r.watchId != null) {
    try { navigator.geolocation.clearWatch(r.watchId); } catch (e) {}
  }
  releaseWakeLock();
  ui.run = null;
  const km = U.round(r.distance / 1000, 2);
  const mins = U.round(Math.max(0.1, secs / 60), 1);
  const plan = DATA.RUN_PLAN[U.clamp((S.settings.runWeek || 1) - 1, 0, 11)];
  render();
  openRunSheet({
    distance: km || '', minutes: mins, date: U.todayKey(),
    jogMin: plan && !plan.walk ? mins : '',
    nonstop: !!(plan && !plan.walk)
  });
}

function openRunSheet(prefill, editId) {
  const p = prefill || {};
  const editing = !!editId;
  openSheet(
    '<div class="sheet-head"><h3>' + (editing ? 'Edit this run ✏️' : (p.distance ? 'Finish this run 🏁' : 'Add a run')) + '</h3>' +
      '<button class="sheet-close" data-action="close-sheet" aria-label="Close">✕</button></div>' +
    '<form data-form="run-save">' +
      (editing ? '<input type="hidden" name="editId" value="' + esc(editId) + '">' : '') +
      '<div class="field-row">' +
        '<div class="field"><label>Distance (km)</label><input type="number" name="distance" step="0.01" min="0.1" max="100" value="' + (p.distance || '') + '" required></div>' +
        '<div class="field"><label>Time (minutes)</label><input type="number" name="minutes" step="0.1" min="1" max="600" value="' + (p.minutes || '') + '" required></div>' +
      '</div>' +
      '<div class="field"><label>Date</label><input type="date" name="date" value="' + (p.date || U.todayKey()) + '" max="' + U.todayKey() + '"></div>' +
      '<div class="field-row">' +
        '<div class="field"><label>Longest non-stop jog (min)</label><input type="number" name="jogMin" step="0.5" min="0" max="600" value="' + (p.jogMin != null ? p.jogMin : '') + '" placeholder="optional"></div>' +
        '<div class="field"><label>Walk breaks?</label><label class="inline-check"><input type="checkbox" name="nonstop" ' + (p.nonstop ? 'checked' : '') + '> No walk breaks</label></div>' +
      '</div>' +
      '<div class="field"><label>How did it feel? (optional)</label>' +
        '<select name="mood"><option value="">Pick a mood</option>' +
          MOODS.map(function (m) {
            return '<option value="' + m.emoji + '"' + (p.mood === m.emoji ? ' selected' : '') + '>' + m.emoji + ' ' + m.label + '</option>';
          }).join('') +
        '</select></div>' +
      '<div class="field"><label>Note (optional)</label><input type="text" name="note" maxlength="120" placeholder="e.g. easy 3k, felt strong" value="' + esc(p.note || '') + '"></div>' +
      '<button class="btn btn-primary btn-block">' + (editing ? 'Save changes' : 'Save run') + '</button>' +
    '</form>' +
    '<p class="tiny muted center" style="margin-top:10px">A finished run counts as today’s movement. Pace is worked out for you. Add the longest jog you did without walking so readiness stays honest.</p>'
  );
}

/* -------------------------------- readiness ------------------------------- */
function openGoalSheet() {
  const rd = Store.readiness();
  const suggested = parseFloat(String(rd.suggested).replace(/[^0-9.]/g, '')) || 5;
  openSheet(
    '<div class="sheet-head"><h3>Your next milestone</h3>' +
      '<button class="sheet-close" data-action="close-sheet" aria-label="Close">✕</button></div>' +
    '<form data-form="accept-goal">' +
      '<p class="small muted" style="margin-bottom:12px">Pick a distance that feels exciting, not scary. You can change it any time.</p>' +
      '<div class="field"><label>Distance (km)</label><input type="number" name="km" step="0.5" min="1" max="42" value="' + suggested + '" required></div>' +
      '<button class="btn btn-primary btn-block">Set my milestone</button>' +
    '</form>'
  );
}

/* ---------------------------------- treat --------------------------------- */
LM.screens.treat = function () {
  if (!Store.isTreatUnlocked()) return '';
  const ideas = S.settings.treatIdeas && S.settings.treatIdeas.length ? S.settings.treatIdeas : DATA.TREAT_IDEAS;
  if (!S.treatPicks || !S.treatPicks.length) {
    S.treatPicks = U.pick(ideas, 3);
    Store.save();
  }
  const picks = S.treatPicks;
  const daysLeft = Store.treatDaysLeft();

  const history = S.treats.history.slice(0, 8).map(function (t) {
    return '<div class="swap-item"><span>🍰</span>' +
      '<span class="swap-name">' + esc(t.name) + '</span>' +
      '<span class="swap-note">' + esc(U.fmtDate(t.date, { day: 'numeric', month: 'short' })) + '</span></div>';
  }).join('');

  return '' +
    '<section class="greet" style="padding-bottom:4px">' +
      '<p class="eyebrow">Treat unlocked</p>' +
      '<h1>You earned this 🍰</h1>' +
      '<p class="sub">15 days of showing up. Eat it slowly, enjoy it fully, log it if you want. No guilt.</p>' +
    '</section>' +

    '<div class="card" style="background:linear-gradient(145deg,#FFE8F2,#FFEFDD 55%,#EFE7FF)">' +
      '<div class="between"><span class="pill peach">Unlocked today</span>' +
        '<span class="pill">' + daysLeft + ' day' + (daysLeft === 1 ? '' : 's') + ' to use it</span></div>' +
      '<p class="small muted mt-s">If you don’t feel like it, it waits 3 days then quietly rolls over. No pressure, no extra notifications.</p>' +
    '</div>' +

    '<h2 class="section-title">Pick your treat</h2>' +
    '<div class="stack">' +
      picks.map(function (name) {
        return '<div class="card" style="padding:14px 16px">' +
          '<div class="row"><span style="font-size:26px">🍰</span>' +
            '<span class="grow bold" style="font-size:15px">' + esc(name) + '</span>' +
            '<button class="btn btn-sm btn-primary" data-action="treat-take" data-name="' + esc(name) + '">Treat taken</button>' +
          '</div></div>';
      }).join('') +
    '</div>' +

    '<div class="btn-row mt">' +
      '<button class="btn btn-soft grow" data-action="treat-surprise">Surprise me 🎲</button>' +
      '<button class="btn btn-ghost grow" data-action="treat-shuffle">Show me 3 more</button>' +
    '</div>' +

    '<div class="card mt">' +
      '<div class="card-title">Treat history</div>' +
      (history ? '<div class="stack mt-s">' + history + '</div>' : '<p class="small muted mt-s">Nothing yet. The first one is always special.</p>') +
    '</div>' +

    '<p class="tiny muted center" style="margin-top:16px">A treat never breaks your streak. Today still counts. Enjoyment is part of the plan.</p>';
};

/* ------------------------------- workout timer ---------------------------- */
function beep() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.7);
    o.start();
    o.stop(ctx.currentTime + 0.75);
  } catch (e) { /* silence is fine */ }
}

function openTimerSheet(name, seconds, emoji) {
  openSheet(
    '<div class="sheet-head"><h3>' + emoji + ' ' + esc(name) + '</h3>' +
      '<button class="sheet-close" data-action="close-sheet" aria-label="Close">✕</button></div>' +
    '<div class="center" style="padding:8px 0 4px">' +
      '<div id="timer-display" style="font-size:58px;font-weight:900;letter-spacing:-2px">' + U.fmtDuration(seconds) + '</div>' +
      '<p class="small muted" style="margin-top:4px">Form first. Speed later.</p>' +
    '</div>' +
    '<div class="btn-row" style="justify-content:center;margin-top:14px">' +
      '<button class="btn btn-primary" id="timer-toggle">Start</button>' +
      '<button class="btn btn-ghost" id="timer-reset">Reset</button>' +
    '</div>' +
    '<button class="btn btn-soft btn-block" data-action="close-sheet">Done</button>'
  );

  let remaining = seconds;
  let running = false;
  let endAt = 0;
  const display = document.getElementById('timer-display');
  const toggle = document.getElementById('timer-toggle');
  const reset = document.getElementById('timer-reset');
  if (!display || !toggle || !reset) return;

  function paint() { display.textContent = U.fmtDuration(remaining); }

  function tick() {
    remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    paint();
    if (remaining <= 0) {
      clearInterval(ui.timerInterval);
      ui.timerInterval = null;
      running = false;
      toggle.textContent = 'Start';
      display.textContent = 'Done ✓';
      beep();
      if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
    }
  }

  toggle.addEventListener('click', function () {
    if (running) {
      clearInterval(ui.timerInterval);
      ui.timerInterval = null;
      remaining = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      running = false;
      toggle.textContent = 'Resume';
    } else {
      endAt = Date.now() + remaining * 1000;
      running = true;
      toggle.textContent = 'Pause';
      ui.timerInterval = setInterval(tick, 250);
    }
  });

  reset.addEventListener('click', function () {
    clearInterval(ui.timerInterval);
    ui.timerInterval = null;
    remaining = seconds;
    running = false;
    toggle.textContent = 'Start';
    paint();
  });

  paint();
}

/* --------------------------------- actions -------------------------------- */
LM.actions['timer'] = function (el) {
  openTimerSheet(el.dataset.name || 'Timer', Number(el.dataset.sec) || 30, el.dataset.emoji || '⏱');
};

LM.actions['run-start'] = startRun;
LM.actions['run-pause'] = pauseRun;
LM.actions['run-stop'] = stopRun;
LM.actions['run-manual'] = function () { openRunSheet({}); };

LM.actions['run-edit'] = function (el) {
  const run = S.runs.find(function (r) { return r.id === el.dataset.id; });
  if (!run) return;
  openRunSheet({
    distance: run.distance,
    minutes: U.round(run.duration / 60, 1),
    date: run.date,
    mood: run.mood,
    note: run.note,
    jogMin: run.jogMin,
    nonstop: run.nonstop
  }, run.id);
};

LM.actions['run-delete'] = function (el) {
  const id = el.dataset.id;
  const run = S.runs.find(function (r) { return r.id === id; });
  S.runs = S.runs.filter(function (r) { return r.id !== id; });
  if (run && S.days[run.date] && S.days[run.date].runId === id) {
    S.days[run.date].runId = null;
    S.days[run.date].workout = false;
    S.days[run.date].workoutLabel = '';
  }
  Store.save();
  render();
  toast('Run removed. No drama.');
};

LM.actions['readiness-accept'] = openGoalSheet;
LM.actions['readiness-change'] = openGoalSheet;
LM.actions['readiness-notyet'] = function () {
  S.goalSnoozeUntil = U.addDays(U.todayKey(), 7);
  Store.save();
  render();
  toast('Not yet is a valid answer. I’ll ask again in a week 🌱');
};

LM.actions['treat-shuffle'] = function () {
  const ideas = S.settings.treatIdeas && S.settings.treatIdeas.length ? S.settings.treatIdeas : DATA.TREAT_IDEAS;
  S.treatPicks = U.pick(ideas, 3);
  Store.save();
  render();
};

LM.actions['treat-surprise'] = function () {
  const ideas = S.settings.treatIdeas && S.settings.treatIdeas.length ? S.settings.treatIdeas : DATA.TREAT_IDEAS;
  S.treatPicks = U.pick(ideas, 1);
  Store.save();
  render();
  toast('The universe has chosen 🎲');
};

LM.actions['treat-take'] = function (el) {
  const name = el.dataset.name;
  Store.takeTreat(name);
  S = Store.get();
  render();
  confetti();
  openSheet(
    '<div class="sheet-head"><h3>Enjoy it, no guilt 🍰</h3>' +
      '<button class="sheet-close" data-action="close-sheet" aria-label="Close">✕</button></div>' +
    '<div class="center" style="padding:4px 4px 8px">' +
      '<div style="font-size:56px">🍰</div>' +
      '<p class="bold" style="font-size:17px;margin-top:10px">' + esc(name) + '</p>' +
      '<p class="small muted" style="margin-top:8px">Earned, not stolen. Your streak is safe. The counter starts again from zero.</p>' +
    '</div>' +
    '<button class="btn btn-primary btn-block" data-action="close-sheet">Love that for me</button>'
  );
};

/* ---------------------------------- forms --------------------------------- */
LM.forms['run-save'] = function (form) {
  const els = form.elements;
  const distance = Number(els['distance'].value);
  const minutes = Number(els['minutes'].value);
  if (!distance || !minutes) { toast('Need a distance and a time 💗'); return; }
  const duration = Math.round(minutes * 60);
  const date = els['date'].value || U.todayKey();
  const editId = els['editId'] ? els['editId'].value : '';
  const jogMin = els['jogMin'] && els['jogMin'].value ? U.round(Number(els['jogMin'].value), 1) : null;
  const nonstop = !!(els['nonstop'] && els['nonstop'].checked);
  const run = {
    id: editId || U.uid(),
    date: date,
    distance: U.round(distance, 2),
    duration: duration,
    pace: duration / distance,
    note: (els['note'].value || '').trim().slice(0, 120),
    mood: els['mood'].value || null,
    jogMin: jogMin,
    nonstop: nonstop
  };

  let oldRun = null;
  if (editId) {
    const i = S.runs.findIndex(function (r) { return r.id === editId; });
    if (i >= 0) { oldRun = S.runs[i]; S.runs[i] = run; }
    else S.runs.push(run);
  } else {
    S.runs.push(run);
  }

  if (oldRun && oldRun.date !== date && S.days[oldRun.date] && S.days[oldRun.date].runId === editId) {
    S.days[oldRun.date].runId = null;
    S.days[oldRun.date].workout = false;
    S.days[oldRun.date].workoutLabel = '';
  }

  const d = Store.day(date);
  d.workout = true;
  d.workoutLabel = 'Run';
  d.runId = run.id;
  Store.save();
  closeSheet();
  render();
  toast(editId ? 'Run updated. Still yours 👟' : 'Run saved. ' + run.distance.toFixed(2) + ' km, gently done 👟');
};

LM.forms['accept-goal'] = function (form) {
  const km = Number(form.elements['km'].value);
  if (!km) return;
  S.acceptedGoal = { km: U.round(km, 1), date: U.todayKey() };
  Store.save();
  closeSheet();
  render();
  toast('Milestone set: ' + km + ' km. No deadline, just direction 🎯');
};

LM.changes['run-week'] = function (el) {
  S.settings.runWeek = U.clamp(Number(el.value) || 1, 1, 12);
  Store.save();
  render();
};
