/* Love Myself — state, local storage and all the kind rules */
window.Store = (function () {
  const KEY = 'loveMyself.v1';

  let state = null;

  function newDay() {
    return {
      water: 0, protein: 0, fiber: 0,
      workout: false, workoutLabel: '',
      mood: null, note: '',
      proteinItems: [], fiberItems: [],
      customProtein: [], customFiber: [],
      period: false, frozen: false, runId: null
    };
  }

  function defaults() {
    const today = U.todayKey();
    return {
      version: 1,
      createdAt: today,
      onboarded: false,
      profile: { name: '', startWeight: 85.5, heightCm: 155, why: '' },
      settings: {
        targets: { protein: 95, fiber: 27, water: 2750, walkMin: 35, calories: 1500, sleep: 8 },
        easyTargets: { protein: 80, fiber: 22, water: 2000 },
        easyDays: [6],
        periodDays: [],
        reminders: {
          water: { on: true, start: 8, end: 20, every: 2 },
          quote: { on: true, time: '08:00' },
          meals: { on: true, breakfast: '08:30', lunch: '13:30', dinner: '19:30' },
          workout: { on: true, time: '07:30' },
          checkin: { on: true, time: '21:00' },
          quiet: { on: true, start: '22:00', end: '07:30' }
        },
        runWeek: 1,
        treatIdeas: DATA.TREAT_IDEAS.slice(),
        readiness: {
          enabled: true, minStreak: 14, minJogMin: 15, minRunWeeks: 3,
          runsPerWeek: 3, steadyPacePct: 5, positiveMood: true
        }
      },
      days: {},
      streak: {
        current: 0, best: 0, freezes: {}, seenMilestones: [],
        pendingMilestone: null, seenBadges: [], pendingBadge: null, pendingFreeze: false
      },
      treats: {
        counter: 0, lastCounted: null, unlockedAt: null, held: false, heldAt: null,
        resetAt: null, history: [], pendingUnlock: false
      },
      runs: [],
      weights: [],
      swaps: {},
      savedDishes: [],
      notifFired: {},
      treatPicks: [],
      acceptedGoal: null,
      goalSnoozeUntil: null,
      snoozeUntil: null,
      lastBackup: null
    };
  }

  function merge(base, over) {
    if (Array.isArray(base)) return Array.isArray(over) ? over : base;
    if (base && typeof base === 'object') {
      const out = Object.assign({}, base);
      if (over && typeof over === 'object') {
        Object.keys(over).forEach((k) => { out[k] = merge(base[k], over[k]); });
      }
      return out;
    }
    return over === undefined ? base : over;
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      state = raw ? merge(defaults(), JSON.parse(raw)) : defaults();
    } catch (e) {
      console.warn('Could not read local data, starting fresh.', e);
      state = defaults();
    }
    if (!state.createdAt) state.createdAt = U.todayKey();
    if (!state.settings.reminders) state.settings.reminders = defaults().settings.reminders;
    if (!state.settings.reminders.quiet) state.settings.reminders.quiet = defaults().settings.reminders.quiet;
    if (state.snoozeUntil === undefined) state.snoozeUntil = null;
    if (state.lastBackup === undefined) state.lastBackup = null;
    if (!Array.isArray(state.savedDishes)) state.savedDishes = [];
    if (!state.treats) state.treats = defaults().treats;
    const tr = state.treats;
    if (!tr.resetAt) {
      tr.resetAt = tr.history && tr.history.length
        ? U.addDays(tr.history[0].date, 1)
        : state.createdAt;
    }
    if (tr.heldAt === undefined) tr.heldAt = null;
    return state;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      console.warn('Could not save.', e);
      return false;
    }
  }

  function get() { return state; }

  function day(key, create) {
    if (!state.days[key] && create !== false) state.days[key] = newDay();
    return state.days[key];
  }

  function isEasy(key) {
    const d = state.days[key];
    if (d && d.period) return true;
    if ((state.settings.periodDays || []).indexOf(key) >= 0) return true;
    const dow = U.weekdayIndex(key);
    return state.settings.easyDays.includes(dow);
  }

  function targets(key) {
    const s = state.settings;
    if (isEasy(key)) {
      return {
        protein: s.easyTargets.protein,
        fiber: s.easyTargets.fiber,
        water: s.easyTargets.water,
        walkMin: s.targets.walkMin,
        calories: s.targets.calories,
        sleep: s.targets.sleep,
        easy: true
      };
    }
    return Object.assign({ easy: false }, s.targets);
  }

  function recalc(key) {
    const d = day(key);
    let p = 0;
    let f = 0;
    d.proteinItems.forEach((id) => {
      const it = DATA.PROTEIN.find((x) => x.id === id);
      if (it) p += it.g;
    });
    d.customProtein.forEach((x) => { p += Number(x.g) || 0; });
    d.fiberItems.forEach((id) => {
      const it = DATA.FIBER.find((x) => x.id === id);
      if (it) f += it.g;
    });
    d.customFiber.forEach((x) => { f += Number(x.g) || 0; });
    d.protein = Math.round(p);
    d.fiber = Math.round(f);
    return d;
  }

  function goals(key) {
    const d = day(key, false) || newDay();
    const t = targets(key);
    const easy = t.easy;
    const list = [
      { id: 'protein', label: 'Protein', emoji: '🥛', value: d.protein, target: t.protein, unit: 'g', met: d.protein >= t.protein },
      { id: 'fiber', label: 'Fiber', emoji: '🌾', value: d.fiber, target: t.fiber, unit: 'g', met: d.fiber >= t.fiber },
      { id: 'water', label: 'Water', emoji: '💧', value: d.water, target: t.water, unit: 'ml', met: d.water >= t.water },
      { id: 'workout', label: 'Move', emoji: '👟', value: d.workout ? 1 : 0, target: 1, unit: '', met: !!d.workout }
    ];
    const need = easy ? 2 : 3;
    const metCount = list.filter((g) => g.met).length;
    return { list, need, metCount, qualifies: metCount >= need, easy };
  }

  function freezesLeft(monthKey) {
    const mk = monthKey || U.monthKey(U.todayKey());
    return Math.max(0, 2 - (state.streak.freezes[mk] || 0));
  }

  /* A freeze can only bridge a missed day that sits directly after a real
     streak day (or another frozen day). This stops a gap from being frozen
     just because there was a streak somewhere in the last week. */
  function hasStreakBefore(key) {
    const prev = U.addDays(key, -1);
    if (prev < state.createdAt) return false;
    const log = state.days[prev];
    if (log && log.frozen) return true;
    return goals(prev).qualifies;
  }

  /* Rebuild the 15-day treat counter from the last reset. Easy days and
     frozen days both count. While a treat is waiting, the counter is held. */
  function recountTreatCounter() {
    const t = state.treats;
    if (t.unlockedAt || t.held) {
      t.counter = Math.max(Number(t.counter) || 0, 15);
      return;
    }
    const today = U.todayKey();
    let cursor = t.resetAt || state.createdAt;
    if (cursor < state.createdAt) cursor = state.createdAt;
    let count = 0;
    let guard = 0;
    while (cursor <= today && guard++ < 1200) {
      const log = state.days[cursor];
      if ((log && log.frozen) || goals(cursor).qualifies) count++;
      cursor = U.addDays(cursor, 1);
    }
    t.counter = count;
  }

  /* The heart of the app: recompute streak, freezes, treats and badges. */
  function evaluate() {
    const s = state;
    const today = U.todayKey();
    const events = { freezeUsed: false, milestone: null, treatUnlocked: false, badge: null };

    /* ---- streak ---- */
    let cur = 0;
    if (goals(today).qualifies) cur++;

    let d = U.addDays(today, -1);
    let guard = 0;
    while (d >= s.createdAt && guard++ < 1200) {
      const log = s.days[d];
      if (log && log.frozen) { cur++; d = U.addDays(d, -1); continue; }
      if (goals(d).qualifies) { cur++; d = U.addDays(d, -1); continue; }

      const mk = U.monthKey(d);
      const used = s.streak.freezes[mk] || 0;
      const canFreeze = used < 2 && hasStreakBefore(d);
      if (canFreeze) {
        const rec = day(d);
        rec.frozen = true;
        s.streak.freezes[mk] = used + 1;
        s.streak.pendingFreeze = true;
        events.freezeUsed = true;
        cur++;
      } else {
        break;
      }
      d = U.addDays(d, -1);
    }

    s.streak.current = cur;
    if (cur > s.streak.best) s.streak.best = cur;

    /* ---- milestones ---- */
    [3, 7, 14, 30, 60, 100].forEach((m) => {
      if (cur >= m && !s.streak.seenMilestones.includes(m)) {
        s.streak.seenMilestones.push(m);
        s.streak.pendingMilestone = m;
        events.milestone = m;
      }
    });

    /* ---- treat counter ---- */
    const t = s.treats;

    /* If a treat sat unused for 3 days, roll it over quietly. The counter
       stays held at 15 so it is ready again, but no second notification. */
    if (t.unlockedAt && U.daysBetween(t.unlockedAt, today) >= 3) {
      t.unlockedAt = null;
      t.held = true;
      t.heldAt = today;
      t.counter = 15;
      s.treatPicks = [];
    }

    recountTreatCounter();

    if (!t.unlockedAt && (t.held || t.counter >= 15)) {
      const silent = !!t.held;
      t.unlockedAt = today;
      t.held = false;
      t.heldAt = null;
      t.counter = 15;
      if (!silent) {
        t.pendingUnlock = true;
        events.treatUnlocked = true;
      }
    }

    /* ---- badges ---- */
    const stats = runStats();
    DATA.BADGES.forEach((b) => {
      if (badgeEarned(b.id, stats) && !s.streak.seenBadges.includes(b.id)) {
        s.streak.seenBadges.push(b.id);
        s.streak.pendingBadge = b.id;
        events.badge = b.id;
      }
    });

    save();
    return events;
  }

  /* ---- treat actions ---- */
  function takeTreat(name) {
    const t = state.treats;
    t.history.unshift({ date: U.todayKey(), name });
    t.counter = 0;
    t.unlockedAt = null;
    t.held = false;
    t.heldAt = null;
    t.pendingUnlock = false;
    t.resetAt = U.addDays(U.todayKey(), 1);
    state.treatPicks = [];
    save();
  }

  function isTreatUnlocked() {
    return !!state.treats.unlockedAt;
  }

  function treatDaysLeft() {
    if (!state.treats.unlockedAt) return 0;
    return Math.max(0, 3 - U.daysBetween(state.treats.unlockedAt, U.todayKey()));
  }

  /* ---- running ---- */
  function runStats() {
    const runs = state.runs.slice().sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    const totalKm = U.sum(runs.map((r) => r.distance));
    const longest = runs.length ? Math.max.apply(null, runs.map((r) => r.distance)) : 0;
    const bestPace = runs.length ? Math.min.apply(null, runs.map((r) => r.pace || Infinity)) : Infinity;
    const longestJogMin = runs.length
      ? Math.max.apply(null, runs.map((r) => Number(r.jogMin) || (r.nonstop ? r.duration / 60 : 0)))
      : 0;
    const longestNonstopKm = runs.length
      ? Math.max.apply(null, runs.map((r) => (r.nonstop ? r.distance : 0)))
      : 0;
    const today = U.todayKey();
    const ws = U.weekStart(today);
    const thisWeek = U.sum(runs.filter((r) => r.date >= ws && r.date <= today).map((r) => r.distance));
    const mk = U.monthKey(today);
    const thisMonth = U.sum(runs.filter((r) => U.monthKey(r.date) === mk).map((r) => r.distance));
    const weeks = [];
    for (let i = 7; i >= 0; i--) {
      const start = U.addDays(ws, -7 * i);
      const end = U.addDays(start, 6);
      weeks.push({
        start,
        km: U.sum(runs.filter((r) => r.date >= start && r.date <= end).map((r) => r.distance))
      });
    }
    return { runs, totalKm, longest, longestJogMin, longestNonstopKm, bestPace, thisWeek, thisMonth, weeks, count: runs.length };
  }

  function badgeEarned(id, stats) {
    const s = stats || runStats();
    switch (id) {
      case 'first': return s.count >= 1;
      case 'onek': return s.longestNonstopKm >= 1;
      case 'fivetotal': return s.totalKm >= 5;
      case 'tentotal': return s.totalKm >= 10;
      case 'fivesingle': return s.longest >= 5;
      case 'tenruns': return s.count >= 10;
      case 'twentyfive': return s.totalKm >= 25;
      case 'fifty': return s.totalKm >= 50;
      default: return false;
    }
  }

  function runsPerWeekMap() {
    const map = {};
    state.runs.forEach((r) => {
      const ws = U.weekStart(r.date);
      map[ws] = (map[ws] || 0) + 1;
    });
    return map;
  }

  function readiness() {
    const cfg = state.settings.readiness;
    const stats = runStats();
    const map = runsPerWeekMap();
    const thisWeek = U.weekStart(U.todayKey());
    const weeks = [];
    for (let i = 1; i <= cfg.minRunWeeks; i++) weeks.push(U.addDays(thisWeek, -7 * i));
    const threeWeeks = weeks.length > 0 && weeks.every((w) => (map[w] || 0) >= cfg.runsPerWeek);
    const streakOk = state.streak.current >= cfg.minStreak;
    const longestJogMin = stats.longestJogMin || 0;
    const jogOk = longestJogMin >= cfg.minJogMin;
    const last3 = stats.runs.slice(-3);
    let paceOk = false;
    if (last3.length === 3) {
      const first = last3[0].pace;
      const last = last3[2].pace;
      paceOk = isFinite(first) && isFinite(last) && last <= first * (1 + cfg.steadyPacePct / 100);
    }
    const moodRuns = stats.runs.slice(-5).map((r) => r.mood).filter(Boolean);
    const lowMoods = moodRuns.filter((m) => m === '😔' || m === '😣').length;
    let lowRun = 0;
    let maxLowRun = 0;
    moodRuns.forEach((m) => {
      lowRun = (m === '😔' || m === '😣') ? lowRun + 1 : 0;
      if (lowRun > maxLowRun) maxLowRun = lowRun;
    });
    const moodOk = !cfg.positiveMood || moodRuns.length === 0 ||
      (maxLowRun < 3 && lowMoods < Math.ceil(moodRuns.length / 2));
    const all = threeWeeks && streakOk && jogOk && paceOk && moodOk;
    let suggested = 'first 2 km';
    if (stats.longest >= 4.5) suggested = 'first 10 km';
    else if (stats.longest >= 3.5) suggested = 'first 5 km';
    else if (stats.longest >= 2) suggested = 'first 3 km';
    const snoozed = state.goalSnoozeUntil && state.goalSnoozeUntil > U.todayKey();
    return {
      all, threeWeeks, streakOk, jogOk, paceOk, moodOk,
      longestJogMin, suggested, snoozed,
      show: cfg.enabled && all && !snoozed && !state.acceptedGoal,
      weeks
    };
  }

  /* ---- progress ---- */
  function weekSummary() {
    const today = U.todayKey();
    const dates = U.weekDates(today).filter((d) => d <= today);
    let streakDays = 0;
    dates.forEach((d) => {
      const log = state.days[d];
      if ((log && log.frozen) || goals(d).qualifies) streakDays++;
    });
    const waters = dates.map((d) => (state.days[d] ? state.days[d].water : 0));
    const proteinHits = dates.filter((d) => {
      const log = state.days[d];
      return log && log.protein >= targets(d).protein;
    }).length;
    const moods = dates.map((d) => (state.days[d] ? state.days[d].mood : null)).filter(Boolean);
    return {
      dates, streakDays,
      avgWater: Math.round(U.mean(waters)),
      proteinHits,
      moods,
      loggedDays: dates.filter((d) => state.days[d] && (state.days[d].water || state.days[d].mood || state.days[d].protein)).length
    };
  }

  function latestWeight() {
    if (!state.weights.length) return null;
    const sorted = state.weights.slice().sort((a, b) => (a.date < b.date ? -1 : 1));
    return sorted[sorted.length - 1];
  }

  function saveWeight(entry) {
    const i = state.weights.findIndex((w) => w.date === entry.date);
    if (i >= 0) state.weights[i] = entry;
    else state.weights.push(entry);
    save();
  }

  function saveDish(dish) {
    if (!Array.isArray(state.savedDishes)) state.savedDishes = [];
    state.savedDishes.unshift(dish);
    if (state.savedDishes.length > 60) state.savedDishes.length = 60;
    save();
  }

  function lowMoodDays() {
    let count = 0;
    let d = U.todayKey();
    const todayLog = state.days[d];
    if (!todayLog || !todayLog.mood) d = U.addDays(d, -1);
    for (let i = 0; i < 3; i++) {
      const log = state.days[d];
      if (log && (log.mood === '😔' || log.mood === '😣')) { count++; d = U.addDays(d, -1); }
      else break;
    }
    return count;
  }

  function reset() {
    state = defaults();
    save();
  }

  function exportJSON() {
    return JSON.stringify(state, null, 2);
  }

  function importJSON(text) {
    const parsed = JSON.parse(text);
    state = merge(defaults(), parsed);
    save();
  }

  return {
    KEY, load, save, get, day, newDay, isEasy, targets, recalc, goals,
    freezesLeft, evaluate, takeTreat, isTreatUnlocked, treatDaysLeft,
    runStats, badgeEarned, readiness, weekSummary, latestWeight, saveWeight,
    saveDish, lowMoodDays, reset, exportJSON, importJSON, runsPerWeekMap
  };
})();
