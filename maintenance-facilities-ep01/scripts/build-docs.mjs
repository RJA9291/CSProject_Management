// Builds output/DI_SEBALIK_OPERASI_KILANG_EP01.srt and output/skrip_narasi.txt from the
// same timing data the video uses.  Usage: node scripts/build-docs.mjs
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';

const EP = process.argv.includes('--ep') ? process.argv[process.argv.indexOf('--ep') + 1] : '';
const read = (p) => JSON.parse(readFileSync(new URL(`../src/data/${EP ? EP + '/' : ''}${p}`, import.meta.url), 'utf8'));
const tl = read('timeline.json');
const dur = read('vo-durations.json');
const {lines} = read('narration.json');
const FPS = tl.fps;
const HOLD = 8;
mkdirSync(new URL('../output/', import.meta.url), {recursive: true});
const out = (n, s) => writeFileSync(new URL(`../output/${n}`, import.meta.url), s);

const ts = (fr) => {
  const t = Math.round((fr / FPS) * 1000);
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(t / 3600000))}:${p(Math.floor(t / 60000) % 60)}:${p(Math.floor(t / 1000) % 60)},${p(t % 1000, 3)}`;
};
const wrap = (text, max = 46) => {
  if (text.length <= max) return text;
  let best = -1;
  for (let k = 0; k < text.length; k++) if (text[k] === ' ' && (best < 0 || Math.max(k, text.length - k - 1) < Math.max(best, text.length - best - 1))) best = k;
  return `${text.slice(0, best)}\n${text.slice(best + 1)}`;
};
const split = (text, max = 80) => {
  if (text.length <= max) return [text];
  const mid = text.length / 2;
  let best = -1;
  for (const m of text.matchAll(/[,.?] /g)) {
    if (m.index < 28 || text.length - m.index < 28) continue;
    if (best < 0 || Math.abs(m.index - mid) < Math.abs(best - mid)) best = m.index;
  }
  if (best < 0) {
    const sp = text.lastIndexOf(' ', mid);
    return [...split(text.slice(0, sp)), ...split(text.slice(sp + 1))];
  }
  return [...split(text.slice(0, best + 1)), ...split(text.slice(best + 2))];
};

const cues = [];
lines.forEach((l, i) => {
  const from = tl.vo[l.id];
  const speechEnd = from + Math.ceil(dur[l.id] * FPS);
  const next = lines[i + 1] ? tl.vo[lines[i + 1].id] : Infinity;
  const end = Math.min(speechEnd + HOLD, next);
  const parts = split(l.sub);
  const total = parts.reduce((a, p) => a + p.length, 0);
  let t = from;
  parts.forEach((p, k) => {
    const e = k === parts.length - 1 ? end : Math.round(t + ((speechEnd - from) * p.length) / total);
    cues.push({from: t, end: e, text: p});
    t = e;
  });
});
out(EP ? 'DI_SEBALIK_OPERASI_KILANG_EP02.srt' : 'DI_SEBALIK_OPERASI_KILANG_EP01.srt', cues.map((c, i) => `${i + 1}\n${ts(c.from)} --> ${ts(c.end)}\n${wrap(c.text)}\n`).join('\n'));

const mmss = (f) => `${String(Math.floor(f / FPS / 60)).padStart(2, '0')}:${((f / FPS) % 60).toFixed(1).padStart(4, '0')}`;
let txt = `DI SEBALIK OPERASI KILANG
${EP ? 'Episode 02 – Struktur Organisasi Kilang' : 'Episode 01 – Mengenali Department Maintenance & Facilities'}
Skrip narasi (Bahasa Melayu) · Durasi ${mmss(tl.total)}
Istilah jawatan dan nama jabatan rasmi dikekalkan dalam bahasa Inggeris seperti dalam brief.
`;
for (const s of tl.scenes) {
  txt += `\nSCENE ${String(s.id).padStart(2, '0')} – ${s.name.toUpperCase()}  [${mmss(s.from)}–${mmss(s.from + s.len)}]\n`;
  for (const l of lines.filter((x) => x.scene === s.id)) txt += `[${mmss(tl.vo[l.id])}] ${l.sub}\n`;
}
out(EP ? 'skrip_narasi_ep02.txt' : 'skrip_narasi.txt', txt);
console.log(`srt: ${cues.length} cues; skrip_narasi.txt`);
