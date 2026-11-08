/* ============================================================
   Love Myself — core shell, helpers and shared UI
   ============================================================ */
var S = Store.load();
var ui = {
  ob: null,
  quoteSeed: null,
  quoteTag: 'all',
  quoteRandom: null,
  swapOptions: {},
  grocery: {},
  invent: { mealType: null, protein: null, loading: false, result: null, error: '', notice: '' },
  timerInterval: null,
  run: null,
  wakeLock: null
};

var app = document.getElementById('app');
var topbar = document.getElementById('topbar');
var tabbar = document.getElementById('tabbar');
var overlay = document.getElementById('overlay');
var toastBox = document.getElementById('toasts');
var confettiCanvas = document.getElementById('confetti');

var MOODS = [
  { emoji: '😄', label: 'great' },
  { emoji: '😊', label: 'good' },
  { emoji: '😐', label: 'okay' },
  { emoji: '😔', label: 'low' },
  { emoji: '😣', label: 'rough' }
];

var TABS = [
  { name: 'home', label: 'Today', emoji: '🏡', href: '#/home' },
  { name: 'meals', label: 'Meals', emoji: '🍲', href: '#/meals' },
  { name: 'workouts', label: 'Move', emoji: '🏃‍♀️', href: '#/workouts' },
  { name: 'track', label: 'Track', emoji: '✅', href: '#/track' },
  { name: 'progress', label: 'Progress', emoji: '📈', href: '#/progress' }
];

var LM = window.LM = { screens: {}, actions: {}, forms: {}, changes: {} };

/* --------------------------------- routing -------------------------------- */
function route() {
  const raw = (location.hash || '').replace(/^#\/?/, '');
  const parts = raw.split('/').filter(Boolean);
  return { name: parts[0] || 'home', param: parts[1] };
}

function render() {
  S = Store.get();
  if (!S.onboarded) { renderOnboarding(); return; }
  const events = Store.evaluate();
  S = Store.get();

  const r = route();
  if (r.name === 'treat' && !Store.isTreatUnlocked()) {
    location.hash = '#/home';
    return;
  }

  document.body.classList.remove('ob-mode');
  document.body.classList.toggle('easy-mode', Store.isEasy(U.todayKey()));
  app.style.padding = '';
  renderTopbar();
  renderTabbar(r.name);

  const fn = LM.screens[r.name] || LM.screens.home;
  app.innerHTML = '<div class="screen">' + fn(r.param) + '</div>';

  handleEvents(events);
  if (r.name === 'run' && ui.run) updateRunUI();
}

function renderOnboarding() {
  document.body.classList.add('ob-mode');
  document.body.classList.remove('easy-mode');
  topbar.style.display = 'none';
  tabbar.style.display = 'none';
  app.style.padding = '0';
  app.innerHTML = LM.screens.onboarding ? LM.screens.onboarding() : '';
}

function renderTopbar() {
  topbar.style.display = '';
  topbar.innerHTML =
    '<div class="topbar-inner">' +
      '<a class="brand" href="#/home"><span class="brand-heart">💗</span><span>Love Myself</span></a>' +
      '<div class="topbar-actions">' +
        '<a class="icon-btn" href="#/quotes" aria-label="Quote library">✨</a>' +
        '<a class="icon-btn" href="#/settings" aria-label="Settings">⚙️</a>' +
      '</div>' +
    '</div>';
}

function renderTabbar(name) {
  tabbar.style.display = '';
  const active = name === 'run' ? 'workouts' : name;
  tabbar.innerHTML = TABS.map(function (t) {
    return '<a class="nav-item' + (active === t.name ? ' active' : '') + '" href="' + t.href + '">' +
      '<span class="nav-emoji">' + t.emoji + '</span><span>' + t.label + '</span></a>';
  }).join('');
}

/* --------------------------------- helpers -------------------------------- */
var esc = U.esc;

function emptyHTML(emoji, text) {
  return '<div class="empty"><span class="e-emoji">' + emoji + '</span>' + esc(text) + '</div>';
}

function dailyQuote() {
  const qs = DATA.QUOTES;
  if (ui.quoteSeed != null) return qs[ui.quoteSeed % qs.length];
  return qs[U.hash(U.todayKey() + '|quote') % qs.length];
}

function quoteCardHTML() {
  const q = dailyQuote();
  return '<section class="card quote-card">' +
    '<div class="between"><span class="pill pink">✨ ' + esc(q.tag.replace('-', ' ')) + '</span><span class="small bold" style="opacity:.55">make my day</span></div>' +
    '<p class="quote-text">' + esc(q.t) + '</p>' +
    '<div class="quote-actions">' +
      '<button class="btn btn-sm btn-dark" data-action="new-quote">Another one ✨</button>' +
      '<a class="btn btn-sm" href="#/quotes">Quote library</a>' +
    '</div>' +
  '</section>';
}

var RING_COLORS = { protein: '#EF5F9F', fiber: '#D6952A', water: '#2F9FDB', workout: '#2FC287' };

function ringsHTML(key) {
  const g = Store.goals(key);
  return g.list.map(function (goal) {
    const p = goal.id === 'workout' ? (goal.met ? 1 : 0) : U.pct(goal.value, goal.target);
    const r = 22;
    const c = 2 * Math.PI * r;
    const val = (goal.id === 'protein' || goal.id === 'fiber')
      ? goal.value + 'g'
      : goal.id === 'water' ? (goal.value / 1000).toFixed(1) + 'L'
      : (goal.met ? '✓' : '—');
    return '<div class="ring-wrap">' +
      '<div class="ring-box">' +
        '<svg class="ring" viewBox="0 0 54 54" aria-hidden="true">' +
          '<circle class="track" cx="27" cy="27" r="' + r + '"></circle>' +
          '<circle class="value" cx="27" cy="27" r="' + r + '" stroke="' + RING_COLORS[goal.id] + '" ' +
            'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + (c * (1 - p)).toFixed(1) + '"></circle>' +
        '</svg>' +
        '<span class="ring-emoji">' + goal.emoji + '</span>' +
      '</div>' +
      '<span class="ring-label">' + goal.label + '</span>' +
      '<span class="ring-val">' + val + '</span>' +
    '</div>';
  }).join('');
}

function glassHTML(water, target) {
  const n = Math.max(1, Math.ceil(target / 250));
  let out = '';
  for (let i = 1; i <= n; i++) {
    const on = water >= i * 250;
    out += '<button class="glass' + (on ? ' full' : '') + '" data-action="water-set" data-ml="' + (i * 250) + '" ' +
      'aria-label="Set water to ' + (i * 250) + ' millilitres"></button>';
  }
  return out;
}

function checklistHTML(type, d) {
  const items = type === 'protein' ? DATA.PROTEIN : DATA.FIBER;
  const key = type === 'protein' ? 'proteinItems' : 'fiberItems';
  return items.map(function (it) {
    const on = d[key].indexOf(it.id) >= 0;
    return '<button class="check-item' + (on ? ' on' : '') + '" data-action="toggle-' + type + '" data-id="' + it.id + '">' +
      '<span class="check-emoji">' + it.emoji + '</span>' +
      '<span class="check-body"><span class="check-name">' + esc(it.name) + '</span><span class="check-qty">' + esc(it.qty) + '</span></span>' +
      '<span class="check-g">+' + it.g + 'g</span>' +
    '</button>';
  }).join('');
}

/* A tiny inline SVG demo for every strength move — no external GIFs needed. */
function exerciseDemo(name) {
  const n = String(name || '').toLowerCase();
  let kind = 'stand';
  if (n.indexOf('side plank') >= 0) kind = 'sideplank';
  else if (n.indexOf('bridge') >= 0) kind = 'bridge';
  else if (n.indexOf('push') >= 0) kind = 'push';
  else if (n.indexOf('plank') >= 0) kind = 'plank';
  else if (n.indexOf('lunge') >= 0) kind = 'lunge';
  else if (n.indexOf('row') >= 0) kind = 'row';
  else if (n.indexOf('squat') >= 0) kind = 'squat';
  else if (n.indexOf('dead bug') >= 0) kind = 'deadbug';
  else if (n.indexOf('bird dog') >= 0) kind = 'birddog';
  else if (n.indexOf('step') >= 0) kind = 'step';

  const figures = {
    stand: '<circle cx="60" cy="18" r="6"/><path d="M60 24v24M60 30l-15 10M60 30l15 10M60 48l-10 20M60 48l10 20"/>',
    squat: '<circle cx="58" cy="23" r="6"/><path d="M58 29v19M58 34l20-4M58 38l20-4M58 48l-10 10 2 10M58 48l10 10-2 10"/>',
    bridge: '<circle cx="26" cy="56" r="6"/><path d="M33 55l27-11M60 44l16 18h10M46 52l-10 14"/>',
    push: '<circle cx="32" cy="38" r="6"/><path d="M38 42l30 14M38 42l-2 22M45 46l-2 20M68 56l24 10"/>',
    plank: '<circle cx="30" cy="42" r="6"/><path d="M37 45l35 7M37 45l-2 21M74 52l20 10"/>',
    sideplank: '<circle cx="34" cy="38" r="6"/><path d="M40 44l26 10M40 44l4 20M66 54l24 8"/>',
    lunge: '<circle cx="60" cy="18" r="6"/><path d="M60 24v22M60 30l-15 10M60 30l15 10M60 46l-14 12-2 10M60 46l18 12 2 10"/>',
    row: '<circle cx="48" cy="26" r="6"/><path d="M53 31l17 15M60 35l-12 11M70 46v22M70 46l8 22"/>',
    deadbug: '<circle cx="26" cy="60" r="6"/><path d="M33 59l25-3M40 58l2-18M58 56l12-18M58 56l14 6"/>',
    birddog: '<circle cx="30" cy="40" r="6"/><path d="M37 44l25 4M37 44l-2 20M62 48l2 16M44 46l-18-8M62 48l22-8"/>',
    step: '<circle cx="58" cy="18" r="6"/><path d="M58 24v22M58 30l-14 8M58 30l14 8M58 46l-8 14v8M58 46l12 8v10"/><rect x="68" y="58" width="18" height="10" rx="2"/>'
  };

  return '<svg class="ex-demo-svg" viewBox="0 0 120 80" role="img" aria-label="' + esc(name) + ' demo">' +
    '<ellipse class="demo-floor" cx="60" cy="71" rx="42" ry="4"></ellipse>' +
    '<g class="demo-figure">' + figures[kind] + '</g>' +
  '</svg>';
}

function runPatternHTML(plan) {
  const pattern = plan.walk
    ? 'Jog ' + plan.jog + ' <small>min</small> · Walk ' + plan.walk + ' <small>min</small>'
    : 'Jog ' + plan.jog + ' <small>min non-stop</small>';
  const total = 5 + plan.reps * (plan.jog + plan.walk);
  return '<div class="run-pattern">' + pattern + '</div>' +
    '<p class="small muted">× ' + plan.reps + ' round' + (plan.reps > 1 ? 's' : '') + ' · about ' + total + ' min with warm-up</p>';
}

function runPlanCardHTML() {
  const plan = DATA.RUN_PLAN[U.clamp((S.settings.runWeek || 1) - 1, 0, 11)];
  return '<div class="card run-hero">' +
    '<div class="between"><span class="pill sky">🏃‍♀️ Run-walk plan</span><span class="pill">Week ' + plan.week + ' / 12</span></div>' +
    runPatternHTML(plan) +
    '<p class="small muted mt-s">' + esc(plan.note) + '</p>' +
    '<div class="btn-row mt">' +
      '<button class="btn btn-sm btn-soft" data-action="run-week-repeat">Repeat this week</button>' +
      '<button class="btn btn-sm btn-ghost" data-action="run-week-next">Next week →</button>' +
      '<a class="btn btn-sm btn-primary" href="#/run">Run tracker</a>' +
    '</div>' +
  '</div>';
}

function weightChart() {
  const ws = S.weights.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  if (ws.length < 2) return emptyHTML('📉', 'Add two check-ins and your gentle little line appears here.');
  const vals = ws.map(function (w) { return w.weight; });
  const min = Math.min.apply(null, vals) - 0.7;
  const max = Math.max.apply(null, vals) + 0.7;
  const W = 320, H = 150, padX = 22, padY = 20;
  const x = function (i) { return padX + i * (W - 2 * padX) / (ws.length - 1); };
  const y = function (v) { return H - padY - ((v - min) / (max - min || 1)) * (H - 2 * padY); };
  const pts = ws.map(function (w, i) { return x(i).toFixed(1) + ',' + y(w.weight).toFixed(1); }).join(' ');
  const dots = ws.map(function (w, i) {
    return '<circle class="dot" cx="' + x(i).toFixed(1) + '" cy="' + y(w.weight).toFixed(1) + '" r="3.6"></circle>';
  }).join('');
  const first = ws[0], last = ws[ws.length - 1];
  return '<svg class="chart" viewBox="0 0 320 150" role="img" aria-label="Weight trend">' +
    '<line class="axis" x1="' + padX + '" y1="' + (H - padY) + '" x2="' + (W - padX) + '" y2="' + (H - padY) + '"></line>' +
    '<line class="axis" x1="' + padX + '" y1="' + padY + '" x2="' + padX + '" y2="' + (H - padY) + '"></line>' +
    '<polyline class="line" points="' + pts + '"></polyline>' + dots +
    '<text x="' + padX + '" y="' + (H - 5) + '">' + esc(U.fmtDate(first.date, { day: 'numeric', month: 'short' })) + '</text>' +
    '<text x="' + (W - padX) + '" y="' + (H - 5) + '" text-anchor="end">' + esc(U.fmtDate(last.date, { day: 'numeric', month: 'short' })) + '</text>' +
    '<text x="' + padX + '" y="12">' + max.toFixed(1) + ' kg</text>' +
  '</svg>';
}

function runChart() {
  const weeks = Store.runStats().weeks;
  const max = Math.max(1, Math.max.apply(null, weeks.map(function (w) { return w.km; })));
  const W = 320, H = 140, pad = 18;
  const bw = (W - pad * 2) / weeks.length - 8;
  const bars = weeks.map(function (w, i) {
    const h = (w.km / max) * (H - pad * 2 - 12);
    const x = pad + i * ((W - pad * 2) / weeks.length) + 4;
    const y = H - pad - h;
    return '<rect class="bar" x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(0, h).toFixed(1) + '" rx="5" fill="#C6B2FF"></rect>' +
      '<text x="' + (x + bw / 2).toFixed(1) + '" y="' + (H - 4) + '" text-anchor="middle">' + (i === weeks.length - 1 ? 'now' : '-' + (weeks.length - 1 - i)) + '</text>';
  }).join('');
  return '<svg class="chart" viewBox="0 0 320 140" role="img" aria-label="Weekly distance">' +
    '<line class="axis" x1="' + pad + '" y1="' + (H - pad) + '" x2="' + (W - pad) + '" y2="' + (H - pad) + '"></line>' + bars + '</svg>';
}

function treatCardHTML() {
  if (!Store.isTreatUnlocked()) return '';
  return '<a class="card treat-card" href="#/treat">' +
    '<div class="between"><span class="pill peach">🍰 Treat unlocked</span><span class="pill">' + Store.treatDaysLeft() + ' day' + (Store.treatDaysLeft() === 1 ? '' : 's') + ' left</span></div>' +
    '<h3>You earned a treat</h3>' +
    '<p>15 days of showing up. Pick something delicious — no guilt, no streak damage.</p>' +
    '<span class="btn btn-sm btn-dark mt-s">Choose my treat →</span>' +
  '</a>';
}

/* --------------------------------- toasts --------------------------------- */
function toast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  toastBox.appendChild(el);
  setTimeout(function () {
    el.classList.add('leaving');
    setTimeout(function () { el.remove(); }, 280);
  }, 2700);
  while (toastBox.children.length > 3) toastBox.firstChild.remove();
}

/* --------------------------------- sheets --------------------------------- */
function clearTimer() {
  if (ui.timerInterval) { clearInterval(ui.timerInterval); ui.timerInterval = null; }
}

function openSheet(html) {
  clearTimer();
  overlay.innerHTML = '<div class="sheet-backdrop" data-action="close-sheet"></div>' +
    '<div class="sheet" role="dialog" aria-modal="true">' +
      (html.indexOf('sheet-grab') >= 0 ? '' : '<div class="sheet-grab" aria-hidden="true"></div>') +
      html +
    '</div>';
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const first = overlay.querySelector('input, textarea, select') || overlay.querySelector('button');
  if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 80);
}

function closeSheet() {
  clearTimer();
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '';
  document.body.style.overflow = '';
}

LM.actions['close-sheet'] = closeSheet;

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeSheet();
});

/* -------------------------------- confetti -------------------------------- */
function confetti() {
  const canvas = confettiCanvas;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const w = window.innerWidth, h = window.innerHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const colors = ['#FF9EC6', '#B79BFF', '#6FE0B6', '#FFC98A', '#8ED8FF', '#FFE27A'];
  const parts = [];
  for (let i = 0; i < 130; i++) {
    parts.push({
      x: w / 2 + (Math.random() - 0.5) * 180,
      y: h * 0.3 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 10,
      vy: -Math.random() * 12 - 2,
      g: 0.28 + Math.random() * 0.22,
      size: 5 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 6,
      vr: (Math.random() - 0.5) * 0.35
    });
  }
  const start = performance.now();
  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    let alive = false;
    const fade = Math.max(0, 1 - (t - start) / 3000);
    parts.forEach(function (p) {
      p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if (p.y < h + 40) alive = true;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = fade;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });
    if (alive && t - start < 3000) requestAnimationFrame(frame);
    else ctx.clearRect(0, 0, w, h);
  }
  requestAnimationFrame(frame);
}

function showMilestone(n) {
  const msgs = {
    3: 'Three days of choosing yourself. That is not small.',
    7: 'A whole week of showing up. Your future self is clapping.',
    14: 'Fourteen days. This is a habit now, not a fluke.',
    30: 'Thirty days of quiet consistency. Genuinely iconic.',
    60: 'Sixty days. Look at the life you are building.',
    100: 'One hundred days. Legend behaviour, softly.'
  };
  confetti();
  openSheet(
    '<div class="sheet-head"><h3>' + n + '-day streak 🎉</h3><button class="sheet-close" data-action="close-sheet" aria-label="Close">✕</button></div>' +
    '<div class="center" style="padding:6px 4px 10px">' +
      '<div style="font-size:64px;line-height:1">🔥</div>' +
      '<p class="bold" style="font-size:17px;margin-top:10px;letter-spacing:-.2px">' + esc(msgs[n] || 'You keep showing up.') + '</p>' +
      '<p class="muted small" style="margin-top:8px">No pressure for tomorrow. Just this one, gently.</p>' +
    '</div>' +
    '<button class="btn btn-primary btn-block" data-action="close-sheet">Keep going, kindly</button>'
  );
}

function handleEvents(events) {
  if (!events) return;
  if (events.milestone) setTimeout(function () { showMilestone(events.milestone); }, 400);
  if (events.treatUnlocked) {
    confetti();
    toast('A treat just unlocked 🍰');
    if (!notificationsMuted()) {
      notify('You earned a treat 🍰', '15 days of showing up. Open Love Myself to pick one.', 'treat-unlock');
    }
  }
  if (events.badge) {
    const b = DATA.BADGES.find(function (x) { return x.id === events.badge; });
    if (b) toast('Badge unlocked: ' + b.emoji + ' ' + b.name);
  }
  if (events.freezeUsed) toast('A streak freeze kept your streak safe ❄️');
}

/* ------------------------------- notifications ------------------------------ */
function reminderSlots() {
  const r = S.settings.reminders;
  const out = [];
  if (r.water.on) {
    const every = Math.max(1, Number(r.water.every) || 2);
    for (let m = r.water.start * 60; m <= r.water.end * 60; m += every * 60) {
      out.push({
        type: 'water', mins: m, title: 'Sip sip hooray 💧',
        body: DATA.REMINDER_LINES[(m / 60) % DATA.REMINDER_LINES.length | 0]
      });
    }
  }
  if (r.quote.on) out.push({ type: 'quote', mins: U.hhmmToMins(r.quote.time), title: 'Your quote for today ✨', body: dailyQuote().t });
  if (r.meals.on) {
    out.push({ type: 'breakfast', mins: U.hhmmToMins(r.meals.breakfast), title: 'Breakfast o’clock 🍳', body: 'Something with protein, love. You’ll feel it later.' });
    out.push({ type: 'lunch', mins: U.hhmmToMins(r.meals.lunch), title: 'Lunch time 🍲', body: 'Half veggies, quarter protein, quarter carbs. Roughly. Kindly.' });
    out.push({ type: 'dinner', mins: U.hhmmToMins(r.meals.dinner), title: 'Dinner time 🥘', body: 'Warm, simple, enough. No perfection required.' });
  }
  if (r.workout.on) out.push({ type: 'workout', mins: U.hhmmToMins(r.workout.time), title: 'Move o’clock 👟', body: 'A walk counts. Ten minutes counts. You count.' });
  if (r.checkin.on) out.push({ type: 'checkin', mins: U.hhmmToMins(r.checkin.time), title: 'Evening check-in 🌙', body: 'How was today, really? Tap your mood and tick off what you did.' });
  return out;
}

async function notify(title, body, tag) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg && reg.showNotification) {
      await reg.showNotification(title, {
        body: body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: tag || 'love-myself'
      });
    } else {
      new Notification(title, { body: body, icon: 'icons/icon-192.png', tag: tag || 'love-myself' });
    }
  } catch (e) {
    console.warn('Notification failed', e);
  }
}

function inQuietHours() {
  const q = S && S.settings && S.settings.reminders ? S.settings.reminders.quiet : null;
  if (!q || !q.on) return false;
  const start = U.hhmmToMins(q.start);
  const end = U.hhmmToMins(q.end);
  if (start === end) return false;
  const now = U.nowMins();
  return start < end ? (now >= start && now < end) : (now >= start || now < end);
}

function notificationsMuted() {
  if (S && S.snoozeUntil && Date.now() < S.snoozeUntil) return true;
  return inQuietHours();
}

function checkReminders() {
  if (!S || !S.onboarded) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (notificationsMuted()) return;
  const today = U.todayKey();
  const now = U.nowMins();
  reminderSlots().forEach(function (slot) {
    const key = slot.type + '|' + today + '|' + slot.mins;
    if (S.notifFired[key]) return;
    if (now >= slot.mins && now - slot.mins <= 2) {
      S.notifFired[key] = true;
      notify(slot.title, slot.body, key);
    }
  });
  Object.keys(S.notifFired).forEach(function (k) {
    const d = k.split('|')[1];
    if (d && d < U.addDays(today, -3)) delete S.notifFired[k];
  });
  Store.save();
}

async function requestNotifPermission() {
  if (!('Notification' in window)) { toast('This browser doesn’t support notifications.'); return; }
  const p = await Notification.requestPermission();
  toast(p === 'granted' ? 'Reminders on 🔔' : 'No worries — you can turn them on later.');
  render();
}

function testNotification() {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    toast('Turn notifications on first 🔔');
    return;
  }
  notify('Sip sip hooray 💧', 'This is what a gentle nudge looks like.', 'test');
  toast('Sent! Check your notifications 🔔');
}

function registerSW() {
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    navigator.serviceWorker.register('sw.js').catch(function (e) {
      console.warn('Service worker not registered', e);
    });
  }
}

/* -------------------------------- wake lock ------------------------------- */
async function keepAwake() {
  try {
    if ('wakeLock' in navigator && !ui.wakeLock) {
      ui.wakeLock = await navigator.wakeLock.request('screen');
      ui.wakeLock.addEventListener('release', function () { ui.wakeLock = null; });
    }
  } catch (e) { /* not fatal */ }
}

function releaseWakeLock() {
  if (ui.wakeLock) { try { ui.wakeLock.release(); } catch (e) {} ui.wakeLock = null; }
}

/* ------------------------------ event wiring ------------------------------ */
document.addEventListener('click', function (e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const fn = LM.actions[el.dataset.action];
  if (!fn) return;
  e.preventDefault();
  fn(el, e);
});

document.addEventListener('submit', function (e) {
  const form = e.target.closest('[data-form]');
  if (!form) return;
  const fn = LM.forms[form.dataset.form];
  if (!fn) return;
  e.preventDefault();
  fn(form, e);
});

document.addEventListener('change', function (e) {
  const el = e.target.closest('[data-change]');
  if (!el) return;
  const fn = LM.changes[el.dataset.change];
  if (fn) fn(el, e);
});

/* ---------------------------------- boot ---------------------------------- */
function boot() {
  window.addEventListener('hashchange', function () {
    window.scrollTo({ top: 0, behavior: 'auto' });
    render();
  });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      if (ui.run && !ui.run.paused) keepAwake();
      checkReminders();
    }
  });
  registerSW();
  setInterval(checkReminders, 30000);
  setTimeout(checkReminders, 2500);

  if (!S.onboarded) {
    if (location.hash !== '#/onboarding') history.replaceState(null, '', '#/onboarding');
    renderOnboarding();
  } else {
    if (!location.hash || location.hash === '#/onboarding') history.replaceState(null, '', '#/home');
    render();
  }
}

document.addEventListener('DOMContentLoaded', boot);
