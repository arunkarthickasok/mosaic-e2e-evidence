// Contrast audit for Mosaic tokens. Checks every pair the usage notes promise.
const fs = require('fs');
const path = require('path');
const T = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tokens', 'tokens.json'), 'utf8'));
const themes = T.color.themes.map(t => t.id);
const map = {};
for (const t of T.color.tokens) map[t.name] = t.value;

function val(name, theme) {
  const v = map[name];
  if (v === undefined) throw new Error('missing token ' + name);
  return typeof v === 'string' ? v : (v[theme] ?? v[themes[0]]);
}
function rgba(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (h.length === 4) h = h.split('').map(c => c + c).join('');
  const n = parseInt(h.slice(0, 6), 16);
  const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, a];
}
function over(fg, bg) { // composite fg (with alpha) over opaque bg
  const a = fg[3];
  return [0, 1, 2].map(i => fg[i] * a + bg[i] * (1 - a)).concat([1]);
}
function lum(c) {
  const f = x => { x /= 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
}
function ratio(fgName, bgName, theme) {
  const bg = rgba(val(bgName, theme));
  const fg = over(rgba(val(fgName, theme)), bg);
  const a = lum(fg), b = lum(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const GROUNDS = ['surface', 'surface-sunken', 'surface-raised', 'surface-hover', 'surface-selected'];
const SUBTLE = ['brand-subtle', 'data-subtle', 'success-subtle', 'attention-subtle', 'danger-subtle', 'info-subtle'];

const checks = [];
const need = (fg, bg, min, why) => checks.push({ fg, bg, min, why });

// Body text
for (const g of GROUNDS.concat(SUBTLE)) need('ink', g, 4.5, 'primary text');
for (const g of GROUNDS) need('ink-muted', g, 4.5, 'secondary text');
need('ink-subtle', 'surface', 4.5, 'placeholder');
need('ink-subtle', 'surface-sunken', 4.5, 'placeholder');
// Accent text on its own subtle ground
need('brand', 'brand-subtle', 4.5, 'brand text on brand-subtle');
need('data', 'data-subtle', 4.5, 'data text on data-subtle');
need('success', 'success-subtle', 4.5, 'status text');
need('attention', 'attention-subtle', 4.5, 'status text');
need('danger', 'danger-subtle', 4.5, 'status text');
need('info', 'info-subtle', 4.5, 'status text');
// Accent text directly on surface (link / inline status)
for (const a of ['brand', 'brand-strong', 'data', 'success', 'attention', 'danger', 'info'])
  for (const g of ['surface', 'surface-sunken']) need(a, g, 4.5, 'accent text on panel');
// Text on solid fills
need('on-brand', 'brand', 4.5, 'label on brand fill');
need('on-brand', 'brand-strong', 4.5, 'label on brand hover fill');
need('on-data', 'data', 4.5, 'label on data fill');
// Non-text: control borders and focus ring (3:1)
for (const g of GROUNDS) need('line-strong', g, 3, 'control border');
for (const g of GROUNDS.concat(['canvas']).concat(SUBTLE)) need('focus', g, 3, 'focus ring');
// The ring never sits directly on a brand fill: it is drawn with a 2px `surface` offset, so `surface` is its ground there.
need('focus', 'surface', 3, 'focus ring over a brand fill, via its 2px surface offset');
for (const g of ['surface', 'canvas']) need('brand', g, 3, 'selection outline / drop indicator');

let fails = 0;
const rows = [];
for (const c of checks) {
  for (const th of themes) {
    const r = ratio(c.fg, c.bg, th);
    const ok = r >= c.min;
    if (!ok) fails++;
    if (!ok || process.env.ALL) rows.push(`${ok ? 'PASS' : 'FAIL'} ${th.padEnd(5)} ${c.fg} on ${c.bg} = ${r.toFixed(2)}:1 (need ${c.min}) — ${c.why}`);
  }
}
console.log(rows.join('\n') || 'all pairs pass');
console.log(`\n${checks.length * themes.length} pairs checked, ${fails} failing`);
