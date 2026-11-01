// Re-times the episode to the narration. Each scene keeps its Phase 3 choreography but is
// uniformly stretched by k (its "scene clock") so the voice-over fits; lines are placed at
// their design targets × k, never overlapping. Writes src/data/timeline.json.
// Usage: node scripts/build-timeline.mjs
import {readFileSync, writeFileSync} from 'node:fs';

const read = (p) => JSON.parse(readFileSync(new URL(`../src/data/${p}`, import.meta.url), 'utf8'));
const {lines} = read('narration.json');
const dur = read('vo-durations.json');
const FPS = 30;
const DESIGN = [
  {id: 1, name: 'Kilang yang tidak pernah berhenti', from: 0, len: 450},
  {id: 2, name: 'Pasukan di sebalik operasi', from: 450, len: 540},
  {id: 3, name: 'Mengenali department', from: 990, len: 360},
  {id: 4, name: 'Struktur organisasi', from: 1350, len: 810},
  {id: 5, name: 'Keperluan kemahiran yang berbeza', from: 2160, len: 570},
  {id: 6, name: 'Bukan sekadar kerja teknikal', from: 2730, len: 780},
  {id: 7, name: 'Dokumentasi dan pematuhan', from: 3510, len: 540},
  {id: 8, name: 'Satu pasukan, satu matlamat', from: 4050, len: 450},
];
const GAP = Math.round(0.25 * FPS);
const TAIL = {1: 10, 2: 10, 3: 10, 4: 12, 5: 12, 6: 10, 7: 12, 8: 60};

const scenes = [];
const vo = {};
let cursor = 0;
for (const s of DESIGN) {
  const ls = lines.filter((l) => l.scene === s.id);
  const pack = (k) => {
    let prevEnd = 0;
    const starts = ls.map((l) => {
      const target = l.at ? (l.at - s.from) * k : 0;
      const st = Math.max(Math.round(target), prevEnd + (prevEnd ? GAP : 0));
      prevEnd = st + Math.ceil(dur[l.id] * FPS);
      return st;
    });
    return {starts, end: prevEnd + TAIL[s.id]};
  };
  let k = 0.92;
  for (let i = 0; i < 20; i++) {
    const need = pack(k).end / s.len;
    if (need <= k + 1e-4) break;
    k = need;
  }
  const {starts} = pack(k);
  const len = Math.round(s.len * k);
  ls.forEach((l, i) => (vo[l.id] = cursor + starts[i]));
  scenes.push({id: s.id, name: s.name, from: cursor, len, designLen: s.len, k: Math.round((len / s.len) * 10000) / 10000});
  cursor += len;
}
writeFileSync(new URL('../src/data/timeline.json', import.meta.url), JSON.stringify({fps: FPS, total: cursor, scenes, vo}, null, 2) + '\n');
const mmss = (f) => `${Math.floor(f / FPS / 60)}:${String(Math.floor((f / FPS) % 60)).padStart(2, '0')}`;
for (const s of scenes) console.log(`scene ${s.id}: ${mmss(s.from)}–${mmss(s.from + s.len)}  k=${s.k}`);
console.log('total', mmss(cursor), `(${(cursor / FPS).toFixed(1)} s)`);
