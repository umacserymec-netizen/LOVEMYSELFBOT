/* ============================================================
   Settings and onboarding
   ============================================================ */

function setPath(obj, path, value) {
  const parts = path.split('.');
  let o = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!o[parts[i]] || typeof o[parts[i]] !== 'object') o[parts[i]] = {};
    o = o[parts[i]];
  }
  o[parts[parts.length - 1]] = value;
}

function switchRow(label, sub, path, checked) {
  return '<div class="toggle-row"><div><div class="t-name">' + label + '</div>' +
    (sub ? '<div class="t-sub">' + sub + '</div>' : '') + '</div>' +
    '<label class="switch"><input type="checkbox" data-change="setting" data-path="' + path + '" ' + (checked ? 'checked' : '') + '>' +
    '<span class="track"></span><span class="thumb"></span></label></div>';
}

function numSetting(label, path, value, attrs, kind) {
  return '<div class="field"><label>' + label + '</label>' +
    '<input type="number" data-change="setting" data-path="' + path + '"' + (kind ? ' data-kind="' + kind + '"' : '') +
    ' value="' + value + '" ' + (attrs || '') + '></div>';
}

function timeSetting(label, path, value) {
  return '<div class="field"><label>' + label + '</label>' +
    '<input type="time" data-change="setting" data-path="' + path + '" value="' + value + '"></div>';
}

/* -------------------------------- settings -------------------------------- */
LM.screens.settings = function () {
  const s = S.settings;
  const t = s.targets;
  const e = s.easyTargets;
  const r = s.reminders;
  const today = U.todayKey();
  const perm = ('Notification' in window) ? Notification.permission : 'unsupported';
  const permLabel = perm === 'granted' ? 'On ✓' : perm === 'denied' ? 'Blocked in browser settings' : perm === 'default' ? 'Not asked yet' : 'Not supported';
  const periods = Array.from(new Set([].concat(s.periodDays || [], Object.keys(S.days).filter(function (k) { return S.days[k].period; })))).sort().reverse();
  const everHadTreat = S.treats.history.length > 0 || !!S.treats.unlockedAt || !!S.treats.held;
  const freezesLeft = Store.freezesLeft();
  const backupDays = S.lastBackup ? U.daysBetween(S.lastBackup, today) : null;
  const backupAge = backupDays == null ? U.daysBetween(S.createdAt || today, today) : backupDays;
  const backupDue = backupAge >= 14;
  const backupLabel = S.lastBackup ? U.fmtDate(S.lastBackup, { day: 'numeric', month: 'short', year: 'numeric' }) : 'never';
  const snoozeActive = S.snoozeUntil && Date.now() < S.snoozeUntil;
  const snoozeLabel = snoozeActive
    ? new Date(S.snoozeUntil).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
    : '';

  return '' +
    '<section class="greet" style="padding-bottom:4px">' +
      '<p class="eyebrow">Make it yours</p>' +
      '<h1>Settings, softly ⚙️</h1>' +
      '<p class="sub">Everything is editable. Nothing here is a rule you can fail.</p>' +
    '</section>' +

    '<form class="card" data-form="profile">' +
      '<div class="card-title">💗 You</div>' +
      '<div class="field"><label>Name</label><input type="text" name="name" maxlength="30" value="' + esc(S.profile.name) + '" placeholder="Your name"></div>' +
      '<div class="field-row">' +
        '<div class="field"><label>Start weight (kg)</label><input type="number" name="startWeight" step="0.1" min="25" max="300" value="' + S.profile.startWeight + '"></div>' +
        '<div class="field"><label>Height (cm)</label><input type="number" name="heightCm" step="1" min="100" max="230" value="' + S.profile.heightCm + '"></div>' +
      '</div>' +
      '<div class="field"><label>Why you’re here (optional)</label><textarea name="why" maxlength="240" placeholder="Because I deserve to feel good in my body.">' + esc(S.profile.why) + '</textarea></div>' +
      '<button class="btn btn-primary btn-block">Save my details</button>' +
    '</form>' +

    '<div class="card">' +
      '<div class="card-title">🎯 Daily targets</div>' +
      '<p class="card-sub">Reference only. Kindness is the real target.</p>' +
      '<div class="field-row">' +
        numSetting('Protein (g)', 'targets.protein', t.protein, 'min="40" max="200"') +
        numSetting('Fiber (g)', 'targets.fiber', t.fiber, 'min="10" max="60"') +
      '</div>' +
      '<div class="field-row">' +
        numSetting('Water (L)', 'targets.water', (t.water / 1000).toFixed(1), 'min="0.5" max="6" step="0.1"', 'liters') +
        numSetting('Calories (ref)', 'targets.calories', t.calories, 'min="800" max="4000" step="10"') +
      '</div>' +
      '<div class="field-row">' +
        numSetting('Walk (min)', 'targets.walkMin', t.walkMin, 'min="5" max="120"') +
        numSetting('Sleep (hours)', 'targets.sleep', t.sleep, 'min="4" max="12" step="0.5"') +
      '</div>' +
    '</div>' +

    '<div class="card">' +
      '<div class="card-title">🌸 Easy mode</div>' +
      '<p class="card-sub">Auto-on for Sundays and period days. Lower targets, softer everything.</p>' +
      '<div class="field-row">' +
        numSetting('Easy protein (g)', 'easyTargets.protein', e.protein, 'min="30" max="150"') +
        numSetting('Easy fiber (g)', 'easyTargets.fiber', e.fiber, 'min="5" max="50"') +
      '</div>' +
      numSetting('Easy water (L)', 'easyTargets.water', (e.water / 1000).toFixed(1), 'min="0.5" max="5" step="0.1"', 'liters') +
      '<div class="field" style="margin-top:16px"><label>Gentle days</label>' +
        '<div class="chips">' +
          U.DAY_SHORT.map(function (d, i) {
            return '<button class="chip' + (s.easyDays.indexOf(i) >= 0 ? ' on' : '') + '" data-action="toggle-easy-day" data-day="' + i + '">' + d + '</button>';
          }).join('') +
        '</div>' +
        '<p class="hint">Sundays are on by default. Tap to add or remove.</p>' +
      '</div>' +
      '<div class="divider"></div>' +
      '<div class="toggle-row" style="border:0;padding-top:0">' +
        '<div><div class="t-name">Period today 🩸</div><div class="t-sub">Turns on easy mode for today</div></div>' +
        '<label class="switch"><input type="checkbox" data-change="period" ' + ((S.days[today] && S.days[today].period) || (s.periodDays || []).indexOf(today) >= 0 ? 'checked' : '') + '>' +
        '<span class="track"></span><span class="thumb"></span></label>' +
      '</div>' +
      '<form class="field-row" data-form="add-period" style="margin-top:8px">' +
        '<div class="field"><label>Add a period day</label><input type="date" name="date" value="' + today + '" max="' + today + '"></div>' +
        '<div class="field" style="display:flex;align-items:flex-end"><button class="btn btn-soft btn-block">Add date</button></div>' +
      '</form>' +
      (periods.length
        ? '<div class="chips mt-s">' + periods.map(function (d) {
            return '<span class="chip on">' + esc(U.fmtDate(d, { day: 'numeric', month: 'short' })) +
              ' <button data-action="remove-period" data-date="' + d + '" aria-label="Remove" style="background:none;padding:0 0 0 2px;font-weight:900;color:inherit">✕</button></span>';
          }).join('') + '</div>'
        : '<p class="tiny muted mt-s">No extra period days saved. You can add them any time.</p>') +
    '</div>' +

    '<div class="card">' +
      '<div class="card-title">🔥 Streaks + freezes</div>' +
      '<p class="card-sub">A missed day never has to break everything.</p>' +
      '<div class="stat-grid mt-s">' +
        '<div class="stat"><div class="big">' + S.streak.current + '</div><div class="lbl">current streak</div></div>' +
        '<div class="stat"><div class="big">' + S.streak.best + '</div><div class="lbl">best streak</div></div>' +
      '</div>' +
      '<p class="small muted mt-s">❄️ ' + freezesLeft + ' of 2 freezes left this month. They’re used automatically on a missed day, so your streak bends instead of breaking.</p>' +
    '</div>' +

    '<div class="card">' +
      '<div class="card-title">🔔 Reminders</div>' +
      '<p class="card-sub">All optional. All editable. All off-able.</p>' +
      switchRow('💧 Water', 'Every ' + r.water.every + 'h between ' + r.water.start + ':00 and ' + r.water.end + ':00', 'reminders.water.on', r.water.on) +
      '<div class="field-row three">' +
        numSetting('Start (h)', 'reminders.water.start', r.water.start, 'min="0" max="23"') +
        numSetting('End (h)', 'reminders.water.end', r.water.end, 'min="1" max="24"') +
        numSetting('Every (h)', 'reminders.water.every', r.water.every, 'min="1" max="6"') +
      '</div>' +
      '<div class="divider"></div>' +
      switchRow('✨ Morning quote', 'A little make-my-day at your chosen time', 'reminders.quote.on', r.quote.on) +
      timeSetting('Quote time', 'reminders.quote.time', r.quote.time) +
      '<div class="divider"></div>' +
      switchRow('🍽️ Meal nudges', 'Breakfast, lunch and dinner', 'reminders.meals.on', r.meals.on) +
      '<div class="field-row three">' +
        timeSetting('Breakfast', 'reminders.meals.breakfast', r.meals.breakfast) +
        timeSetting('Lunch', 'reminders.meals.lunch', r.meals.lunch) +
        timeSetting('Dinner', 'reminders.meals.dinner', r.meals.dinner) +
      '</div>' +
      '<div class="divider"></div>' +
      switchRow('👟 Workout nudge', 'A gentle nudge, never a demand', 'reminders.workout.on', r.workout.on) +
      timeSetting('Workout time', 'reminders.workout.time', r.workout.time) +
      '<div class="divider"></div>' +
      switchRow('🌙 Evening check-in', 'Mood + tick-off at the end of the day', 'reminders.checkin.on', r.checkin.on) +
      timeSetting('Check-in time', 'reminders.checkin.time', r.checkin.time) +
      '<div class="divider"></div>' +
      switchRow('🌙 Quiet hours', 'No nudges during these hours', 'reminders.quiet.on', r.quiet.on) +
      '<div class="field-row">' +
        timeSetting('Quiet from', 'reminders.quiet.start', r.quiet.start) +
        timeSetting('Quiet until', 'reminders.quiet.end', r.quiet.end) +
      '</div>' +
      '<div class="divider"></div>' +
      '<div class="between"><div><div class="t-name">Snooze reminders</div><div class="t-sub">' +
        (snoozeActive ? 'Paused until ' + snoozeLabel : 'Pause everything for a bit') + '</div></div>' +
        '<div class="btn-row">' +
          '<button class="btn btn-sm btn-soft" data-action="snooze-reminders" data-hours="2">2 h</button>' +
          '<button class="btn btn-sm btn-ghost" data-action="snooze-reminders" data-hours="morning">Until 8 am</button>' +
          (snoozeActive ? '<button class="btn btn-sm btn-ghost" data-action="unsnooze-reminders">Wake</button>' : '') +
        '</div>' +
      '</div>' +
      '<div class="divider"></div>' +
      '<div class="between"><div><div class="t-name">Notification permission</div><div class="t-sub">' + permLabel + '</div></div>' +
        '<button class="btn btn-sm btn-soft" data-action="notif-permission">' + (perm === 'granted' ? 'Re-ask' : 'Turn on') + '</button></div>' +
      '<div class="btn-row mt-s"><button class="btn btn-sm btn-ghost" data-action="notif-test">Send a test 🔔</button></div>' +
      '<p class="hint">Reminders arrive while the app is open or running in the background. Browsers can’t wake a fully closed app without push servers, so for now this stays local and private.</p>' +
    '</div>' +

    '<div class="card">' +
      '<div class="card-title">🏃‍♀️ Running</div>' +
      '<p class="card-sub">The plan never pushes you forward. You choose.</p>' +
      '<div class="field"><label>Current run-walk week</label>' +
        '<select data-change="run-week">' +
          DATA.RUN_PLAN.map(function (p) {
            return '<option value="' + p.week + '"' + (s.runWeek === p.week ? ' selected' : '') + '>Week ' + p.week + ' · ' +
              (p.walk ? 'jog ' + p.jog + ' / walk ' + p.walk + ' × ' + p.reps : 'jog ' + p.jog + ' min non-stop') + '</option>';
          }).join('') +
        '</select></div>' +
      '<div class="divider"></div>' +
      switchRow('Milestone readiness', 'Only suggest a goal when your proof says you’re ready', 'readiness.enabled', s.readiness.enabled) +
      '<div class="field-row">' +
        numSetting('Min streak (days)', 'readiness.minStreak', s.readiness.minStreak, 'min="1" max="365"') +
        numSetting('Min longest jog (min)', 'readiness.minJogMin', s.readiness.minJogMin, 'min="1" max="180"') +
      '</div>' +
      '<div class="field-row">' +
        numSetting('Run weeks in a row', 'readiness.minRunWeeks', s.readiness.minRunWeeks, 'min="1" max="12"') +
        numSetting('Runs per week', 'readiness.runsPerWeek', s.readiness.runsPerWeek, 'min="1" max="7"') +
      '</div>' +
      numSetting('Pace steadiness (%)', 'readiness.steadyPacePct', s.readiness.steadyPacePct, 'min="0" max="30"') +
      switchRow('Positive run moods', 'Hold back suggestions if low moods stack up', 'readiness.positiveMood', s.readiness.positiveMood) +
    '</div>' +

    (everHadTreat
      ? '<div class="card">' +
          '<div class="card-title">🍰 Treat ideas</div>' +
          '<p class="card-sub">Your guilt-free list. Edit it whenever.</p>' +
          '<div class="stack mt-s">' +
            s.treatIdeas.map(function (idea, i) {
              return '<div class="swap-item"><span>🍰</span><span class="swap-name">' + esc(idea) + '</span>' +
                '<button class="sheet-close" data-action="remove-treat-idea" data-idx="' + i + '" aria-label="Remove">✕</button></div>';
            }).join('') +
          '</div>' +
          '<button class="btn btn-sm btn-ghost mt-s" data-action="add-treat-idea">+ Add a treat</button>' +
        '</div>'
      : '') +

    '<div class="card">' +
      '<div class="card-title">💾 Your data</div>' +
      '<p class="card-sub">Everything lives on this phone. No account, no cloud, no one else.</p>' +
      '<div class="between mt-s">' +
        '<div><div class="t-name">Last backup</div><div class="t-sub">' + backupLabel + '</div></div>' +
        (backupDue ? '<span class="pill peach">gentle reminder</span>' : '<span class="pill mint">recent ✓</span>') +
      '</div>' +
      (backupDue
        ? '<p class="small muted" style="margin-top:8px">' +
            (!S.lastBackup
              ? 'A backup keeps your streak safe if you change phones. Whenever you have a minute.'
              : 'It’s been ' + backupDays + ' days since your last backup. A quick download keeps your data safe.') +
          '</p>'
        : '') +
      '<div class="btn-row mt-s">' +
        '<button class="btn btn-sm btn-soft" data-action="export-data">Download backup</button>' +
        '<button class="btn btn-sm btn-ghost" data-action="import-data">Restore backup</button>' +
        '<button class="btn btn-sm btn-pink" data-action="reset-data">Start fresh</button>' +
      '</div>' +
      '<input type="file" id="import-file" accept="application/json,.json" data-change="import" class="hide">' +
      '<p class="hint">A backup is a small JSON file. Keep it somewhere safe if you change phones.</p>' +
    '</div>' +

    '<div class="card">' +
      '<div class="card-title">💗 About Love Myself</div>' +
      '<p class="small muted mt-s">Built for one person, with a lot of care. Slow fat loss, kind habits, no shame. This app is a companion, not a doctor — if something hurts or feels wrong, talk to someone qualified.</p>' +
      '<p class="tiny muted mt-s">Version 1.0 · made with OpenCode · works offline once installed.</p>' +
    '</div>' +

    '<p class="tiny muted center" style="margin-top:16px">Your body is not a problem to solve. It’s a home to take care of. 🏡</p>';
};

/* -------------------------------- onboarding ------------------------------ */
function obInit() {
  if (ui.ob) return;
  ui.ob = {
    step: 0,
    draft: {
      name: '',
      why: '',
      startWeight: 85.5,
      targets: { protein: 95, fiber: 27, water: 2750, calories: 1500 },
      easyDays: [6]
    }
  };
}

function obRead() {
  const g = function (id) { return document.getElementById(id); };
  const name = g('ob-name');
  if (name) ui.ob.draft.name = name.value.trim().slice(0, 30);
  const why = g('ob-why');
  if (why) ui.ob.draft.why = why.value.trim().slice(0, 240);
  const weight = g('ob-weight');
  if (weight) ui.ob.draft.startWeight = Number(weight.value) || ui.ob.draft.startWeight;
  const protein = g('ob-protein');
  if (protein) ui.ob.draft.targets.protein = Number(protein.value) || 95;
  const fiber = g('ob-fiber');
  if (fiber) ui.ob.draft.targets.fiber = Number(fiber.value) || 27;
  const water = g('ob-water');
  if (water) ui.ob.draft.targets.water = Math.round((Number(water.value) || 2.75) * 1000);
  const calories = g('ob-calories');
  if (calories) ui.ob.draft.targets.calories = Number(calories.value) || 1500;
}

LM.screens.onboarding = function () {
  obInit();
  const step = ui.ob.step;
  const d = ui.ob.draft;
  const perm = ('Notification' in window) ? Notification.permission : 'unsupported';

  let title = 'Hi, love 💗';
  let sub = 'A kind little companion for slow fat loss, good food and a softer head. No login. No judgement.';
  let body = '';

  if (step === 0) {
    body =
      '<div class="field"><label for="ob-name">What should I call you?</label>' +
        '<input type="text" id="ob-name" maxlength="30" placeholder="Your name" value="' + esc(d.name) + '"></div>' +
      '<div class="field"><label for="ob-why">Why are you here? (optional)</label>' +
        '<textarea id="ob-why" maxlength="240" placeholder="I want to feel good in my body, without hating it.">' + esc(d.why) + '</textarea></div>' +
      '<div class="field"><label for="ob-weight">Starting weight (kg, optional)</label>' +
        '<input type="number" id="ob-weight" step="0.1" min="25" max="300" value="' + d.startWeight + '"></div>';
  } else if (step === 1) {
    title = 'Your daily targets 🎯';
    sub = 'Reference points, not rules. You can change every single one later.';
    body =
      '<div class="field-row">' +
        '<div class="field"><label for="ob-protein">Protein (g)</label><input type="number" id="ob-protein" min="40" max="200" value="' + d.targets.protein + '"></div>' +
        '<div class="field"><label for="ob-fiber">Fiber (g)</label><input type="number" id="ob-fiber" min="10" max="60" value="' + d.targets.fiber + '"></div>' +
      '</div>' +
      '<div class="field-row">' +
        '<div class="field"><label for="ob-water">Water (L)</label><input type="number" id="ob-water" min="0.5" max="6" step="0.1" value="' + (d.targets.water / 1000).toFixed(1) + '"></div>' +
        '<div class="field"><label for="ob-calories">Calories (ref)</label><input type="number" id="ob-calories" min="800" max="4000" step="10" value="' + d.targets.calories + '"></div>' +
      '</div>' +
      '<p class="hint">Defaults: about 1,500 kcal, 95 g protein, 27 g fiber, 2.75 L water. Slow loss is the goal — roughly 0.4–0.5 kg a week.</p>';
  } else {
    title = 'Make it gentle 🌸';
    sub = 'Sundays and period days are easy by default. You can change this any time.';
    body =
      '<div class="field"><label>Gentle days</label>' +
        '<div class="chips">' +
          U.DAY_SHORT.map(function (day, i) {
            return '<button class="chip' + (d.easyDays.indexOf(i) >= 0 ? ' on' : '') + '" data-action="ob-easy-day" data-day="' + i + '">' + day + '</button>';
          }).join('') +
        '</div>' +
        '<p class="hint">Easy days need just 2 of 4 goals. Period days are added on Home with one tap.</p>' +
      '</div>' +
      '<div class="divider"></div>' +
      '<div class="between"><div><div class="t-name">Gentle reminders</div>' +
        '<div class="t-sub">Water, meals, quotes and check-ins</div></div>' +
        '<button class="btn btn-sm ' + (perm === 'granted' ? 'btn-mint' : 'btn-soft') + '" data-action="notif-permission">' +
          (perm === 'granted' ? 'On ✓' : 'Turn on') + '</button></div>' +
      '<div class="divider"></div>' +
      '<p class="small muted">Everything stays on this phone. No account, no cloud, no one else. You can export a backup any time.</p>' +
      '<div class="chips mt-s">' +
        '<span class="pill pink">' + d.targets.protein + 'g protein</span>' +
        '<span class="pill mint">' + d.targets.fiber + 'g fiber</span>' +
        '<span class="pill sky">' + (d.targets.water / 1000).toFixed(1) + 'L water</span>' +
      '</div>';
  }

  return '<div class="onboarding">' +
    '<div class="ob-dots">' + [0, 1, 2].map(function (i) {
      return '<span class="ob-dot' + (i === step ? ' on' : '') + '"></span>';
    }).join('') + '</div>' +
    '<div class="ob-heart">💗</div>' +
    '<h1>' + title + '</h1>' +
    '<p class="ob-sub">' + sub + '</p>' +
    '<div class="ob-body"><div class="ob-card">' + body + '</div></div>' +
    '<div class="ob-footer">' +
      (step > 0 ? '<button class="btn btn-ghost" data-action="ob-back">Back</button>' : '') +
      '<button class="btn btn-primary grow" data-action="ob-next">' + (step === 2 ? 'Start loving myself 💗' : 'Continue →') + '</button>' +
    '</div>' +
  '</div>';
};

/* --------------------------------- actions -------------------------------- */
LM.actions['toggle-easy-day'] = function (el) {
  const day = Number(el.dataset.day);
  const i = S.settings.easyDays.indexOf(day);
  if (i >= 0) S.settings.easyDays.splice(i, 1);
  else S.settings.easyDays.push(day);
  Store.save();
  render();
};

LM.actions['remove-period'] = function (el) {
  const date = el.dataset.date;
  S.settings.periodDays = (S.settings.periodDays || []).filter(function (d) { return d !== date; });
  if (S.days[date]) S.days[date].period = false;
  Store.save();
  render();
};

LM.actions['notif-permission'] = requestNotifPermission;
LM.actions['notif-test'] = testNotification;

LM.actions['snooze-reminders'] = function (el) {
  const hours = el.dataset.hours;
  if (hours === 'morning') {
    const now = new Date();
    const target = new Date(now);
    target.setHours(8, 0, 0, 0);
    if (target <= now) target.setDate(target.getDate() + 1);
    S.snoozeUntil = target.getTime();
  } else {
    S.snoozeUntil = Date.now() + (Number(hours) || 2) * 3600000;
  }
  Store.save();
  render();
  toast('Reminders snoozed. Quiet is kind too 🌙');
};

LM.actions['unsnooze-reminders'] = function () {
  S.snoozeUntil = null;
  Store.save();
  render();
  toast('Reminders back on 🔔');
};

LM.actions['export-data'] = function () {
  const blob = new Blob([Store.exportJSON()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'love-myself-backup-' + U.todayKey() + '.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000);
  S.lastBackup = U.todayKey();
  Store.save();
  render();
  toast('Backup downloaded 💾');
};

LM.actions['import-data'] = function () {
  const input = document.getElementById('import-file');
  if (input) input.click();
};

LM.actions['reset-data'] = function () {
  openSheet(
    '<div class="sheet-head"><h3>Start fresh?</h3><button class="sheet-close" data-action="close-sheet" aria-label="Close">✕</button></div>' +
    '<p class="small muted">This deletes every log, streak, run and setting on this phone. There’s no undo. Download a backup first if you’re unsure.</p>' +
    '<div class="btn-row mt">' +
      '<button class="btn btn-ghost grow" data-action="close-sheet">Keep my data</button>' +
      '<button class="btn btn-pink grow" data-action="reset-confirm">Yes, start fresh</button>' +
    '</div>'
  );
};

LM.actions['reset-confirm'] = function () {
  Store.reset();
  S = Store.get();
  ui.ob = null;
  ui.quoteSeed = null;
  closeSheet();
  history.replaceState(null, '', '#/onboarding');
  renderOnboarding();
  toast('Fresh start. Be gentle with yourself 🌱');
};

LM.actions['add-treat-idea'] = function () {
  openSheet(
    '<div class="sheet-head"><h3>Add a treat</h3><button class="sheet-close" data-action="close-sheet" aria-label="Close">✕</button></div>' +
    '<form data-form="add-treat-idea">' +
      '<div class="field"><label>Something delicious</label><input type="text" name="idea" maxlength="60" placeholder="e.g. a warm brownie" required></div>' +
      '<button class="btn btn-primary btn-block">Add to the list</button>' +
    '</form>'
  );
};

LM.actions['remove-treat-idea'] = function (el) {
  const i = Number(el.dataset.idx);
  if (S.settings.treatIdeas.length <= 1) { toast('Keep at least one treat on the list 💗'); return; }
  S.settings.treatIdeas.splice(i, 1);
  Store.save();
  render();
};

LM.actions['ob-next'] = function () {
  obRead();
  if (ui.ob.step === 0 && !ui.ob.draft.name) {
    toast('What should I call you? 💗');
    return;
  }
  if (ui.ob.step >= 2) { obFinish(); return; }
  ui.ob.step += 1;
  renderOnboarding();
};

LM.actions['ob-back'] = function () {
  obRead();
  ui.ob.step = Math.max(0, ui.ob.step - 1);
  renderOnboarding();
};

LM.actions['ob-easy-day'] = function (el) {
  const day = Number(el.dataset.day);
  const i = ui.ob.draft.easyDays.indexOf(day);
  if (i >= 0) ui.ob.draft.easyDays.splice(i, 1);
  else ui.ob.draft.easyDays.push(day);
  renderOnboarding();
};

function obFinish() {
  obRead();
  const d = ui.ob.draft;
  S.profile.name = d.name || 'love';
  S.profile.why = d.why || '';
  S.profile.startWeight = Number(d.startWeight) || 85.5;
  S.settings.targets.protein = Number(d.targets.protein) || 95;
  S.settings.targets.fiber = Number(d.targets.fiber) || 27;
  S.settings.targets.water = Number(d.targets.water) || 2750;
  S.settings.targets.calories = Number(d.targets.calories) || 1500;
  S.settings.easyDays = d.easyDays.slice();
  S.createdAt = U.todayKey();
  S.onboarded = true;
  if (!S.weights.length) {
    S.weights.push({ date: U.todayKey(), weight: S.profile.startWeight, waist: null });
  }
  Store.save();
  S = Store.get();
  ui.ob = null;
  document.body.classList.remove('ob-mode');
  history.replaceState(null, '', '#/home');
  render();
  confetti();
  toast('Welcome, ' + S.profile.name + '. Let’s be gentle 💗');
}

/* ---------------------------------- forms --------------------------------- */
LM.forms['profile'] = function (form) {
  const els = form.elements;
  S.profile.name = (els['name'].value || '').trim().slice(0, 30) || 'love';
  S.profile.startWeight = Number(els['startWeight'].value) || S.profile.startWeight;
  S.profile.heightCm = Number(els['heightCm'].value) || S.profile.heightCm;
  S.profile.why = (els['why'].value || '').trim().slice(0, 240);
  Store.save();
  render();
  toast('Saved. Looking after you 💗');
};

LM.forms['add-period'] = function (form) {
  const date = form.elements['date'].value;
  if (!date) return;
  S.settings.periodDays = S.settings.periodDays || [];
  if (S.settings.periodDays.indexOf(date) < 0) S.settings.periodDays.push(date);
  if (date === U.todayKey()) Store.day(date).period = true;
  Store.save();
  render();
  toast('Period day added. Easy mode on that day 🌸');
};

LM.forms['add-treat-idea'] = function (form) {
  const idea = (form.elements['idea'].value || '').trim();
  if (!idea) return;
  S.settings.treatIdeas.push(idea.slice(0, 60));
  Store.save();
  closeSheet();
  render();
  toast('Added to your treat list 🍰');
};

/* --------------------------------- changes -------------------------------- */
LM.changes['setting'] = function (el) {
  const path = el.dataset.path;
  let value;
  if (el.type === 'checkbox') value = el.checked;
  else if (el.dataset.kind === 'liters') value = Math.round((Number(el.value) || 0) * 1000);
  else if (el.type === 'number') value = Number(el.value);
  else value = el.value;
  if (path === 'reminders.water.start') value = U.clamp(value, 0, 23);
  if (path === 'reminders.water.end') value = U.clamp(value, 1, 24);
  if (path === 'reminders.water.every') value = U.clamp(value, 1, 6);
  if (path === 'targets.water' && value < 500) value = 500;
  if (path === 'easyTargets.water' && value < 500) value = 500;
  setPath(S.settings, path, value);
  Store.save();
  render();
};

LM.changes['period'] = function (el) {
  const today = U.todayKey();
  const d = Store.day(today);
  d.period = el.checked;
  S.settings.periodDays = S.settings.periodDays || [];
  const i = S.settings.periodDays.indexOf(today);
  if (el.checked && i < 0) S.settings.periodDays.push(today);
  if (!el.checked && i >= 0) S.settings.periodDays.splice(i, 1);
  Store.save();
  render();
  toast(el.checked ? 'Easy mode on. Be gentle today 🌸' : 'Period mode off. Thanks for checking in.');
};

LM.changes['import'] = function (el) {
  const file = el.files && el.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    try {
      Store.importJSON(reader.result);
      S = Store.get();
      render();
      toast('Backup restored 💗');
    } catch (e) {
      toast('That file didn’t look like a Love Myself backup.');
    }
  };
  reader.readAsText(file);
};
