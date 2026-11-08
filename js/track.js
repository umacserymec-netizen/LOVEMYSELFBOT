/* ============================================================
   Track, mood, progress and quotes
   ============================================================ */

const MOOD_COLORS = { '😄': '#DFF8EC', '😊': '#E3F3FF', '😐': '#F1EAFF', '😔': '#FFEBDC', '😣': '#FFE4F0' };

/* ---------------------------------- track --------------------------------- */
LM.screens.track = function () {
  const today = U.todayKey();
  const d = Store.day(today);
  const t = Store.targets(today);
  const g = Store.goals(today);
  const easy = Store.isEasy(today);
  const pPct = Math.round(U.pct(d.protein, t.protein) * 100);
  const fPct = Math.round(U.pct(d.fiber, t.fiber) * 100);
  const wPct = Math.round(U.pct(d.water, t.water) * 100);
  const left = g.need - g.metCount;

  function customList(type) {
    const arr = type === 'protein' ? d.customProtein : d.customFiber;
    if (!arr.length) return '';
    return arr.map(function (c, i) {
      return '<div class="swap-item" style="margin-top:6px"><span>✏️</span>' +
        '<span class="swap-name">' + esc(c.name) + '</span>' +
        '<span class="swap-note">' + c.g + ' g</span>' +
        '<button class="sheet-close" data-action="custom-remove" data-type="' + type + '" data-idx="' + i + '" aria-label="Remove">✕</button></div>';
    }).join('');
  }

  return '' +
    '<section class="greet" style="padding-bottom:4px">' +
      '<p class="eyebrow">' + esc(U.fmtLong(today)) + '</p>' +
      '<h1>Tick, sip, done ✅</h1>' +
      '<p class="sub">' + (easy ? 'Easy day targets are on. Two of four counts. 🌸' : 'Aim for 3 of 4: protein, fiber, water, movement.') + '</p>' +
    '</section>' +

    '<div class="card ' + (g.qualifies ? 'soft' : '') + '">' +
      '<div class="between">' +
        '<div><div class="card-title">' + (g.qualifies ? 'Today counts ✓' : 'Building today') + '</div>' +
          '<div class="card-sub">' + (g.qualifies ? 'You’ve done enough. Anything else is a bonus.' : left + ' more of the four to make today a streak day.') + '</div></div>' +
        '<span class="pill ' + (g.qualifies ? 'mint' : 'pink') + '">' + g.metCount + '/' + g.need + '</span>' +
      '</div>' +
    '</div>' +

    '<div class="card mt">' +
      '<div class="card-head">' +
        '<div><div class="card-title">🥛 Protein</div>' +
          '<div class="card-sub">' + d.protein + ' g of ' + t.protein + ' g · ' + (d.protein >= t.protein ? 'goal hit, beautiful 🎉' : (t.protein - d.protein) + ' g to go') + '</div></div>' +
        '<span class="pill pink">' + pPct + '%</span>' +
      '</div>' +
      '<div class="bar' + (d.protein >= t.protein ? ' done' : '') + '"><span style="width:' + pPct + '%"></span></div>' +
      '<div class="check-grid">' + checklistHTML('protein', d) + '</div>' +
      customList('protein') +
      '<button class="btn btn-sm btn-ghost mt-s" data-action="custom-add" data-type="protein">+ Add custom protein</button>' +
    '</div>' +

    '<div class="card">' +
      '<div class="card-head">' +
        '<div><div class="card-title">🌾 Fiber</div>' +
          '<div class="card-sub">' + d.fiber + ' g of ' + t.fiber + ' g · ' + (d.fiber >= t.fiber ? 'goal hit, happy gut 🌿' : (t.fiber - d.fiber) + ' g to go') + '</div></div>' +
        '<span class="pill mint">' + fPct + '%</span>' +
      '</div>' +
      '<div class="bar' + (d.fiber >= t.fiber ? ' done' : '') + '"><span style="width:' + fPct + '%"></span></div>' +
      '<div class="check-grid">' + checklistHTML('fiber', d) + '</div>' +
      customList('fiber') +
      '<button class="btn btn-sm btn-ghost mt-s" data-action="custom-add" data-type="fiber">+ Add custom fiber</button>' +
    '</div>' +

    '<div class="card">' +
      '<div class="card-head">' +
        '<div><div class="card-title">💧 Water</div>' +
          '<div class="card-sub">' + (d.water / 1000).toFixed(2) + ' L of ' + (t.water / 1000).toFixed(1) + ' L · ' +
            (d.water >= t.water ? 'fully hydrated 💦' : 'about ' + Math.ceil((t.water - d.water) / 250) + ' glasses to go') + '</div></div>' +
        '<span class="pill sky">' + wPct + '%</span>' +
      '</div>' +
      '<div class="bar' + (d.water >= t.water ? ' done' : '') + '"><span style="width:' + wPct + '%"></span></div>' +
      '<div class="glasses">' + glassHTML(d.water, t.water) + '</div>' +
      '<div class="btn-row mt-s">' +
        '<button class="btn btn-sm btn-soft" data-action="water-add" data-ml="250">+ 250 ml</button>' +
        '<button class="btn btn-sm btn-ghost" data-action="water-add" data-ml="-250">− 250 ml</button>' +
        '<button class="btn btn-sm btn-ghost" data-action="water-add" data-ml="500">+ 500 ml</button>' +
      '</div>' +
    '</div>' +

    '<p class="tiny muted center" style="margin-top:16px">Tapping a glass sets your water level. Tap a lower glass to undo. No perfect days required.</p>';
};

/* ---------------------------------- mood ---------------------------------- */
LM.screens.mood = function () {
  const today = U.todayKey();
  const d = Store.day(today);
  const week = U.weekDates(today);
  const low = Store.lowMoodDays();
  const colors = { '😄': '#DFF8EC', '😊': '#E3F3FF', '😐': '#F1EAFF', '😔': '#FFEBDC', '😣': '#FFE4F0' };

  const weekHTML = week.map(function (dt, i) {
    const log = S.days[dt];
    const mood = log && log.mood;
    const isFuture = dt > today;
    return '<div class="mood-day">' +
      '<span class="m-lbl">' + U.DAY_SHORT[i].slice(0, 2) + '</span>' +
      '<span class="m-dot" style="background:' + (mood ? colors[mood] : '#F5F0F9') + '">' + (isFuture ? '' : (mood || '·')) + '</span>' +
      '<span class="m-lbl">' + U.parseKey(dt).getDate() + '</span>' +
    '</div>';
  }).join('');

  const history = Object.keys(S.days)
    .filter(function (k) { return S.days[k].mood || S.days[k].note; })
    .sort().reverse().slice(0, 12)
    .map(function (k) {
      const log = S.days[k];
      return '<div class="swap-item" style="align-items:flex-start">' +
        '<span style="font-size:20px">' + (log.mood || '📝') + '</span>' +
        '<span class="grow"><span class="swap-name">' + esc(U.fmtDate(k, { weekday: 'short', day: 'numeric', month: 'short' })) + '</span>' +
          (log.note ? '<span class="swap-note" style="display:block;margin-top:2px">' + esc(log.note) + '</span>' : '') +
        '</span>' +
      '</div>';
    }).join('');

  return '' +
    '<section class="greet" style="padding-bottom:4px">' +
      '<p class="eyebrow">Mood + journal</p>' +
      '<h1>How’s your heart? 💗</h1>' +
      '<p class="sub">One tap is enough. You never have to explain yourself.</p>' +
    '</section>' +

    '<div class="card">' +
      '<div class="card-title">Today, honestly</div>' +
      '<div class="mood-big">' +
        MOODS.map(function (m) {
          return '<button class="mood-big-btn' + (d.mood === m.emoji ? ' active' : '') + '" data-action="mood" data-mood="' + m.emoji + '">' +
            m.emoji + '<span>' + m.label + '</span></button>';
        }).join('') +
      '</div>' +
      '<div class="field" style="margin-top:16px">' +
        '<label for="mood-note">A line about why (optional)</label>' +
        '<textarea id="mood-note" placeholder="Today felt…">' + esc(d.note) + '</textarea>' +
      '</div>' +
      '<button class="btn btn-primary btn-block" data-action="save-note">Save my check-in</button>' +
    '</div>' +

    (low >= 3
      ? '<div class="care-card">' +
          '<h3>Three low days in a row 🫂</h3>' +
          '<p>That’s a lot to carry, and it makes sense that things feel heavy. No fixing required right now — just one small kind thing. This isn’t a diagnosis, just a nudge from an app that likes you.</p>' +
          '<div class="care-idea">' +
            '<span class="pill peach">🚶 A 10-min walk</span>' +
            '<span class="pill sky">📞 Call a friend</span>' +
            '<span class="pill mint">🛏️ Rest without guilt</span>' +
            '<span class="pill pink">💧 Water + a snack</span>' +
          '</div>' +
          '<p class="tiny muted" style="margin-top:10px">If low days keep stacking, talking to someone you trust — or a professional — is a strong, kind move.</p>' +
        '</div>'
      : '') +

    '<div class="card mt">' +
      '<div class="card-head"><div><div class="card-title">This week</div><div class="card-sub">Little dots of feelings</div></div>' +
        '<span class="pill">' + week.filter(function (dt) { return S.days[dt] && S.days[dt].mood; }).length + '/7</span></div>' +
      '<div class="mood-week">' + weekHTML + '</div>' +
    '</div>' +

    '<h2 class="section-title">Journal history</h2>' +
    (history ? '<div class="stack">' + history + '</div>' : emptyHTML('🌙', 'Your check-ins will live here. One tap starts it.'));
};

/* --------------------------------- progress -------------------------------- */
LM.screens.progress = function () {
  const today = U.todayKey();
  const sum = Store.weekSummary();
  const latest = Store.latestWeight();
  const startW = Number(S.profile.startWeight) || null;
  const diff = latest && startW ? latest.weight - startW : null;
  const stats = Store.runStats();
  const moods = sum.moods;
  const lastMood = moods.length ? moods[moods.length - 1] : '—';
  const sorted = S.weights.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });

  const history = sorted.slice().reverse().slice(0, 6).map(function (w) {
    return '<div class="swap-item"><span>⚖️</span>' +
      '<span class="swap-name">' + esc(U.fmtDate(w.date, { weekday: 'short', day: 'numeric', month: 'short' })) + '</span>' +
      '<span class="swap-note">' + w.weight.toFixed(1) + ' kg' + (w.waist ? ' · ' + w.waist + ' cm' : '') + '</span>' +
      '<button class="sheet-close" data-action="weight-delete" data-date="' + w.date + '" aria-label="Delete">✕</button></div>';
  }).join('');

  return '' +
    '<section class="greet" style="padding-bottom:4px">' +
      '<p class="eyebrow">Progress, not pressure</p>' +
      '<h1>Slow and steady 📈</h1>' +
      '<p class="sub">Weekly check-ins only. Bodies fluctuate. Trends are the truth.</p>' +
    '</section>' +

    '<div class="card soft">' +
      '<div class="card-head"><div><div class="card-title">This week’s summary</div>' +
        '<div class="card-sub">' + esc(U.fmtDate(sum.dates[0], { day: 'numeric', month: 'short' })) + ' → today</div></div>' +
        '<span class="pill mint">' + sum.streakDays + ' streak day' + (sum.streakDays === 1 ? '' : 's') + '</span></div>' +
      '<div class="stat-grid">' +
        '<div class="stat"><div class="big">' + (sum.avgWater / 1000).toFixed(1) + ' L</div><div class="lbl">avg water</div><div class="sub">daily average</div></div>' +
        '<div class="stat"><div class="big">' + sum.proteinHits + ' / ' + sum.dates.length + '</div><div class="lbl">protein hits</div><div class="sub">days at goal</div></div>' +
        '<div class="stat"><div class="big">' + lastMood + '</div><div class="lbl">mood lately</div><div class="sub">' + moods.length + ' check-ins</div></div>' +
        '<div class="stat"><div class="big">' + sum.loggedDays + '</div><div class="lbl">days logged</div><div class="sub">showing up</div></div>' +
      '</div>' +
      '<div class="mood-trend mt-s">' +
        sum.dates.map(function (dt) {
          const log = S.days[dt];
          const mood = log && log.mood;
          return '<span class="trend-day">' +
            '<span class="trend-dot" style="background:' + (mood ? MOOD_COLORS[mood] : '#F5F0F9') + '">' + (mood || '·') + '</span>' +
            '<span class="trend-lbl">' + U.DAY_SHORT[U.weekdayIndex(dt)].slice(0, 1) + '</span>' +
          '</span>';
        }).join('') +
      '</div>' +
      '<p class="tiny muted center" style="margin-top:6px">Mood trend this week</p>' +
    '</div>' +

    '<div class="card">' +
      '<div class="card-head"><div><div class="card-title">Weekly check-in</div>' +
        '<div class="card-sub">Optional. Skip it whenever you like.</div></div>' +
        (latest ? '<span class="pill">' + latest.weight.toFixed(1) + ' kg</span>' : '') + '</div>' +
      (diff != null
        ? '<p class="small ' + (diff <= 0 ? 'bold' : 'muted') + '" style="margin-bottom:12px">' +
            (diff === 0 ? 'Same as your start weight — steady is fine 💗'
              : diff < 0 ? 'Down ' + Math.abs(diff).toFixed(1) + ' kg since you started. Slow is the whole point 🌱'
              : 'Up ' + diff.toFixed(1) + ' kg since you started. Bodies fluctuate — this is information, not a verdict 💗') +
          '</p>'
        : '<p class="small muted" style="margin-bottom:12px">No weigh-in yet. Whenever you’re ready, not before.</p>') +
      '<form data-form="weight">' +
        '<div class="field-row">' +
          '<div class="field"><label>Date</label><input type="date" name="date" value="' + today + '" max="' + today + '" required></div>' +
          '<div class="field"><label>Weight (kg)</label><input type="number" name="weight" step="0.1" min="25" max="300" value="' + (latest ? latest.weight : startW || '') + '" required></div>' +
        '</div>' +
        '<div class="field"><label>Waist (cm, optional)</label><input type="number" name="waist" step="0.5" min="30" max="200" value="' + (latest && latest.waist ? latest.waist : '') + '" placeholder="optional"></div>' +
        '<button class="btn btn-primary btn-block">Save check-in</button>' +
      '</form>' +
    '</div>' +

    '<div class="card">' +
      '<div class="card-head"><div><div class="card-title">Weight trend</div><div class="card-sub">A gentle line, not a judge</div></div>' +
        '<span class="pill">' + sorted.length + ' point' + (sorted.length === 1 ? '' : 's') + '</span></div>' +
      weightChart() +
      (history ? '<div class="stack mt">' + history + '</div>' : '') +
    '</div>' +

    '<div class="card">' +
      '<div class="between"><div><div class="card-title">🏃‍♀️ Running</div>' +
        '<div class="card-sub">' + stats.thisWeek.toFixed(1) + ' km this week · ' + stats.thisMonth.toFixed(1) + ' km this month</div></div>' +
        '<a class="btn btn-sm btn-soft" href="#/run">Open →</a></div>' +
      '<div class="stat-grid mt-s">' +
        '<div class="stat"><div class="big">' + stats.longest.toFixed(1) + ' km</div><div class="lbl">longest run</div></div>' +
        '<div class="stat"><div class="big">' + (isFinite(stats.bestPace) ? U.fmtPace(stats.bestPace) : '—') + '</div><div class="lbl">best pace /km</div></div>' +
      '</div>' +
    '</div>' +

    '<p class="tiny muted center" style="margin-top:16px">Success looks like showing up, not shrinking. You’re allowed to be exactly this size and still want to feel stronger.</p>';
};

/* ---------------------------------- quotes --------------------------------- */
LM.screens.quotes = function () {
  const tags = ['all', 'morning', 'workout', 'low-day', 'streak', 'easy-day'];
  const random = ui.quoteRandom != null ? DATA.QUOTES[ui.quoteRandom % DATA.QUOTES.length] : dailyQuote();
  const list = DATA.QUOTES.filter(function (q) { return ui.quoteTag === 'all' || q.tag === ui.quoteTag; });

  return '' +
    '<section class="greet" style="padding-bottom:4px">' +
      '<p class="eyebrow">The quote library</p>' +
      '<h1>Make my day ✨</h1>' +
      '<p class="sub">' + DATA.QUOTES.length + ' little reminders. Tap for a new one.</p>' +
    '</section>' +

    '<section class="card quote-card">' +
      '<div class="between"><span class="pill pink">✨ ' + esc(random.tag.replace('-', ' ')) + '</span>' +
        '<span class="small bold" style="opacity:.55">right now</span></div>' +
      '<p class="quote-text">' + esc(random.t) + '</p>' +
      '<div class="quote-actions"><button class="btn btn-sm btn-dark" data-action="new-quote">Another one ✨</button></div>' +
    '</section>' +

    '<div class="chips mt">' +
      tags.map(function (tag) {
        return '<button class="chip' + (ui.quoteTag === tag ? ' on' : '') + '" data-action="quote-tag" data-tag="' + tag + '">' +
          (tag === 'all' ? 'all' : tag.replace('-', ' ')) + '</button>';
      }).join('') +
    '</div>' +

    '<div class="quote-grid mt">' +
      list.map(function (q) {
        return '<div class="card quote-mini">' +
          '<span class="pill ' + (q.tag === 'low-day' ? 'peach' : q.tag === 'workout' ? 'sky' : q.tag === 'streak' ? 'mint' : 'pink') + '">' + esc(q.tag.replace('-', ' ')) + '</span>' +
          '<p>' + esc(q.t) + '</p>' +
        '</div>';
      }).join('') +
    '</div>' +
    '<p class="tiny muted center" style="margin-top:16px">' + list.length + ' quotes in this mood.</p>';
};

/* --------------------------------- actions -------------------------------- */
LM.actions['water-add'] = function (el) {
  const d = Store.day(U.todayKey());
  const ml = Number(el.dataset.ml) || 0;
  d.water = U.clamp(d.water + ml, 0, 12000);
  Store.save();
  render();
};

LM.actions['water-set'] = function (el) {
  const d = Store.day(U.todayKey());
  const ml = Number(el.dataset.ml) || 0;
  d.water = d.water >= ml ? Math.max(0, ml - 250) : ml;
  Store.save();
  render();
};

LM.actions['toggle-protein'] = function (el) {
  const d = Store.day(U.todayKey());
  const id = el.dataset.id;
  const i = d.proteinItems.indexOf(id);
  if (i >= 0) d.proteinItems.splice(i, 1);
  else d.proteinItems.push(id);
  Store.recalc(U.todayKey());
  Store.save();
  render();
};

LM.actions['toggle-fiber'] = function (el) {
  const d = Store.day(U.todayKey());
  const id = el.dataset.id;
  const i = d.fiberItems.indexOf(id);
  if (i >= 0) d.fiberItems.splice(i, 1);
  else d.fiberItems.push(id);
  Store.recalc(U.todayKey());
  Store.save();
  render();
};

LM.actions['custom-add'] = function (el) {
  const type = el.dataset.type;
  openSheet(
    '<div class="sheet-head"><h3>Add ' + (type === 'protein' ? 'protein' : 'fiber') + '</h3>' +
      '<button class="sheet-close" data-action="close-sheet" aria-label="Close">✕</button></div>' +
    '<form data-form="custom-add" data-type="' + type + '">' +
      '<div class="field"><label>What did you have?</label>' +
        '<input type="text" name="name" placeholder="' + (type === 'protein' ? 'e.g. paneer salad' : 'e.g. extra salad') + '" required></div>' +
      '<div class="field"><label>' + (type === 'protein' ? 'Protein' : 'Fiber') + ' (g)</label>' +
        '<input type="number" name="g" min="1" max="200" step="1" placeholder="e.g. 12" required></div>' +
      '<button class="btn btn-primary btn-block">Add it</button>' +
    '</form>'
  );
};

LM.actions['custom-remove'] = function (el) {
  const d = Store.day(U.todayKey());
  const arr = el.dataset.type === 'protein' ? d.customProtein : d.customFiber;
  arr.splice(Number(el.dataset.idx), 1);
  Store.recalc(U.todayKey());
  Store.save();
  render();
};

LM.actions['mood'] = function (el) {
  const d = Store.day(U.todayKey());
  d.mood = el.dataset.mood;
  Store.save();
  render();
  toast(d.mood === '😄' || d.mood === '😊' ? 'Love that for you 💗' : d.mood === '😐' ? 'Neutral is a valid place to be 🌤️' : 'Thanks for being honest. Be extra gentle today 🫂');
};

LM.actions['save-note'] = function () {
  const d = Store.day(U.todayKey());
  const el = document.getElementById('mood-note');
  d.note = el ? el.value.trim().slice(0, 280) : '';
  Store.save();
  render();
  toast('Check-in saved. Your heart is on the record 💗');
};

LM.actions['quote-tag'] = function (el) {
  ui.quoteTag = el.dataset.tag;
  render();
};

LM.actions['weight-delete'] = function (el) {
  const date = el.dataset.date;
  S.weights = S.weights.filter(function (w) { return w.date !== date; });
  Store.save();
  render();
  toast('Check-in removed. No drama.');
};

/* ---------------------------------- forms --------------------------------- */
LM.forms['custom-add'] = function (form) {
  const type = form.dataset.type;
  const els = form.elements;
  const name = els['name'].value.trim();
  const g = Number(els['g'].value);
  if (!name || !g) return;
  const d = Store.day(U.todayKey());
  if (type === 'protein') d.customProtein.push({ name: name.slice(0, 60), g: g });
  else d.customFiber.push({ name: name.slice(0, 60), g: g });
  Store.recalc(U.todayKey());
  Store.save();
  closeSheet();
  render();
  toast('+' + g + ' g ' + type + ' added 💗');
};

LM.forms['weight'] = function (form) {
  const date = form.date.value || U.todayKey();
  const weight = Number(form.weight.value);
  const waist = form.waist.value ? Number(form.waist.value) : null;
  if (!weight) return;
  Store.saveWeight({ date: date, weight: U.round(weight, 1), waist: waist });
  S = Store.get();
  render();
  toast('Check-in saved. Trends, not days 💗');
};
