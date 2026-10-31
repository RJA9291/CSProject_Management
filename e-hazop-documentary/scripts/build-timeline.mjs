// Lays out the documentary from the measured narration durations.
// Writes src/data/timeline.json (fps, total length, scene ranges, VO start frames).
// Usage: node scripts/build-timeline.mjs
import {readFileSync, writeFileSync} from 'node:fs';

const read = (p) => JSON.parse(readFileSync(new URL(`../src/data/${p}`, import.meta.url), 'utf8'));
const {lines} = read('narration.json');
const dur = read('vo-durations.json');

const FPS = 30;
const LEAD_IN = 1.4;      // s of title music before the first word
const LINE_GAP = 0.28;    // s between lines in a scene
const SCENE_GAP = 0.85;   // s breathing room between scenes (transition)
const EXTRA = {s1_3: 0.4, s2_1: 0.5, s2_5: 0.3, s3_1: 0.2, s4_1: 0.3, s5_2: 0.35, s7_2: 0.5}; // s added before a line
const CLOSE_HOLD = 3.2;   // s on the closing card after "Thank you"
const REFS = 7;           // s reference end card

const f = (s) => Math.round(s * FPS);
let t = LEAD_IN;
const vo = {};
const scenes = {};
let prevScene = 1;
let sceneStart = 0;
lines.forEach((l, i) => {
  if (i > 0) t += l.scene !== prevScene ? SCENE_GAP : LINE_GAP;
  if (l.scene !== prevScene) {
    scenes[prevScene] = {from: f(sceneStart), to: f(t - SCENE_GAP / 2)};
    sceneStart = t - SCENE_GAP / 2;
    prevScene = l.scene;
  }
  t += EXTRA[l.id] ?? 0;
  vo[l.id] = f(t);
  t += dur[l.id];
});
const closeEnd = t + CLOSE_HOLD;
scenes[prevScene] = {from: f(sceneStart), to: f(closeEnd)};
scenes.refs = {from: f(closeEnd), to: f(closeEnd + REFS)};

const tl = {fps: FPS, width: 1920, height: 1080, durationInFrames: f(closeEnd + REFS), scenes, vo};
writeFileSync(new URL('../src/data/timeline.json', import.meta.url), JSON.stringify(tl, null, 2) + '\n');
const mmss = (fr) => `${Math.floor(fr / FPS / 60)}:${String(Math.floor((fr / FPS) % 60)).padStart(2, '0')}`;
for (const [k, v] of Object.entries(scenes)) console.log(`scene ${k}: ${mmss(v.from)}–${mmss(v.to)}`);
console.log('total', mmss(tl.durationInFrames), `(${(tl.durationInFrames / FPS).toFixed(1)} s)`);
