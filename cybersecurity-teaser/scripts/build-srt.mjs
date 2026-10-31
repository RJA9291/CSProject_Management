// Builds .srt subtitle files from the same timing data the video uses.
// Usage: node scripts/build-srt.mjs
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';

const read = (p) => JSON.parse(readFileSync(new URL(`../src/data/${p}`, import.meta.url), 'utf8'));
const tl = read('timeline.json');
const dur = read('vo-durations.json');
const {lines} = read('narration.json');
const HOLD = 10; // frames, matches <Subtitles hold>

const ts = (frame) => {
  const ms = Math.round((frame / tl.fps) * 1000);
  const h = String(Math.floor(ms / 3600000)).padStart(2, '0');
  const m = String(Math.floor(ms / 60000) % 60).padStart(2, '0');
  const s = String(Math.floor(ms / 1000) % 60).padStart(2, '0');
  return `${h}:${m}:${s},${String(ms % 1000).padStart(3, '0')}`;
};

const cues = lines.map((l, i) => {
  const from = tl.vo[l.id];
  const to = from + Math.ceil(dur[l.id] * tl.fps);
  const next = lines[i + 1] ? tl.vo[lines[i + 1].id] : Infinity;
  return {...l, from, end: Math.min(to + HOLD, next)};
});

const build = (pick) =>
  cues.map((c, i) => `${i + 1}\n${ts(c.from)} --> ${ts(c.end)}\n${pick(c)}\n`).join('\n');

mkdirSync(new URL('../output/', import.meta.url), {recursive: true});
const out = (name, txt) => writeFileSync(new URL(`../output/${name}`, import.meta.url), txt);
// Bilingual: spoken line + translation (what is burned into the video)
out('cybersecurity_teaser_01.srt', build((c) => `${c.sub}\n${c.tr}`));
// English-only and Bahasa Melayu-only tracks for platforms that support multiple captions
out('cybersecurity_teaser_01.en.srt', build((c) => (c.lang === 'en' ? c.sub : c.tr)));
out('cybersecurity_teaser_01.ms.srt', build((c) => (c.lang === 'ms' ? c.sub : c.tr)));
console.log(`wrote ${cues.length} cues x 3 files`);
