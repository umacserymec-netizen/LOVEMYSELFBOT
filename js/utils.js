/* Love Myself — tiny helpers shared by the app */
window.U = (function () {
  const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const pad = (n) => String(n).padStart(2, '0');

  function dateKey(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  // Noon avoids daylight-saving edge cases when adding days.
  function parseKey(key) {
    const p = String(key).split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2], 12, 0, 0, 0);
  }

  function todayKey() { return dateKey(new Date()); }

  function addDays(key, n) {
    const d = parseKey(key);
    d.setDate(d.getDate() + n);
    return dateKey(d);
  }

  function daysBetween(a, b) {
    return Math.round((parseKey(b) - parseKey(a)) / 86400000);
  }

  // Monday = 0 ... Sunday = 6
  function weekdayIndex(key) {
    return (parseKey(key).getDay() + 6) % 7;
  }

  function weekStart(key) {
    return addDays(key, -weekdayIndex(key));
  }

  function weekDates(key) {
    const s = weekStart(key);
    return Array.from({ length: 7 }, (_, i) => addDays(s, i));
  }

  function fmtDate(key, opts) {
    return parseKey(key).toLocaleDateString('en-IN', opts || { weekday: 'short', day: 'numeric', month: 'short' });
  }

  function fmtLong(key) {
    return parseKey(key).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  function monthKey(key) { return String(key).slice(0, 7); }

  function monthLabel(mk) {
    const [y, m] = mk.split('-').map(Number);
    return MONTHS_SHORT[m - 1] + ' ' + y;
  }

  function prettyDay(key) {
    const t = todayKey();
    if (key === t) return 'Today';
    if (key === addDays(t, -1)) return 'Yesterday';
    if (key === addDays(t, 1)) return 'Tomorrow';
    return fmtDate(key, { weekday: 'long', day: 'numeric', month: 'short' });
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

  function haversine(a, b) {
    const R = 6371000;
    const toRad = (x) => (x * Math.PI) / 180;
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const la1 = toRad(a.latitude);
    const la2 = toRad(b.latitude);
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function pick(arr, n) { return shuffle(arr).slice(0, n); }

  function pct(value, target) {
    if (!target) return 0;
    return clamp(value / target, 0, 1);
  }

  function hhmmToMins(t) {
    const [h, m] = String(t || '0:0').split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  }

  function nowMins() {
    const d = new Date();
    return d.getHours() * 60 + d.getMinutes();
  }

  function fmtDuration(sec) {
    sec = Math.max(0, Math.round(sec));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h) return h + 'h ' + pad(m) + 'm';
    return m + ':' + pad(s);
  }

  function fmtPace(secPerKm) {
    if (!isFinite(secPerKm) || secPerKm <= 0) return '—';
    let m = Math.floor(secPerKm / 60);
    let s = Math.round(secPerKm % 60);
    if (s === 60) { m += 1; s = 0; }
    return m + ':' + pad(s);
  }

  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return Math.abs(h);
  }

  function round(n, d) {
    const p = Math.pow(10, d || 0);
    return Math.round(n * p) / p;
  }

  function sum(arr) { return arr.reduce((a, b) => a + (Number(b) || 0), 0); }

  function mean(arr) { return arr.length ? sum(arr) / arr.length : 0; }

  function todayLabel() {
    return fmtLong(todayKey());
  }

  return {
    DAY_SHORT, DAY_FULL, MONTHS, MONTHS_SHORT,
    pad, dateKey, parseKey, todayKey, addDays, daysBetween,
    weekdayIndex, weekStart, weekDates, fmtDate, fmtLong,
    monthKey, monthLabel, prettyDay, esc, uid, clamp, haversine,
    shuffle, pick, pct, hhmmToMins, nowMins, fmtDuration, fmtPace,
    hash, round, sum, mean, todayLabel
  };
})();
