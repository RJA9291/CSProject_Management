// Episode 02 timing: scenes are authored to the narration directly (k = 1). Each line starts
// after its 'pre' pause; each scene ends with a tail. Writes src/data/ep02/timeline.json.
import {readFileSync, writeFileSync} from 'node:fs';

const read = (p) => JSON.parse(readFileSync(new URL(`../src/data/ep02/${p}`, import.meta.url), 'utf8'));
const {lines} = read('narration.json');
const dur = read('vo-durations.json');
const FPS = 30;
const NAMES = {1: 'Hari pertama', 2: 'Gambaran besar organisasi', 3: 'Lawatan setiap jabatan', 4: 'Fungsi sokongan', 5: 'Mesin rosak', 6: 'Satu kilang, satu pasukan'};
const TAIL = {1: 0.8, 2: 2.2, 3: 1.0, 4: 1.0, 5: 1.2, 6: 4.2};
const scenes = [];
const vo = {};
let cursor = 0;
for (const id of [1, 2, 3, 4, 5, 6]) {
  let t = 0;
  for (const l of lines.filter((x) => x.scene === id)) {
    t += l.pre ?? 0.3;
    vo[l.id] = cursor + Math.round(t * FPS);
    t += dur[l.id];
  }
  const len = Math.round((t + TAIL[id]) * FPS);
  scenes.push({id, name: NAMES[id], from: cursor, len, designLen: len, k: 1});
  cursor += len;
}
writeFileSync(new URL('../src/data/ep02/timeline.json', import.meta.url), JSON.stringify({fps: FPS, total: cursor, scenes, vo}, null, 2) + '\n');
const mmss = (f) => `${Math.floor(f / FPS / 60)}:${String(Math.floor((f / FPS) % 60)).padStart(2, '0')}`;
for (const s of scenes) console.log(`scene ${s.id}: ${mmss(s.from)}–${mmss(s.from + s.len)} (${(s.len / FPS).toFixed(1)}s)`);
console.log('total', mmss(cursor));
