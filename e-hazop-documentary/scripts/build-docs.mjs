// Generates the written deliverables from the same data the video uses:
//   output/E-HAZOP_Basic_Concept_MET264016.srt   English subtitles
//   output/narration_script.txt                  complete narration script
//   output/timing_sheet.md                        scene-by-scene timing sheet
//   output/references.md                          reference list
// Usage: node scripts/build-docs.mjs
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';

const read = (p) => JSON.parse(readFileSync(new URL(`../src/data/${p}`, import.meta.url), 'utf8'));
const tl = read('timeline.json');
const dur = read('vo-durations.json');
const {lines} = read('narration.json');
const HOLD = 8; // frames, matches <Subtitles hold>
const out = (name, txt) => writeFileSync(new URL(`../output/${name}`, import.meta.url), txt);
mkdirSync(new URL('../output/', import.meta.url), {recursive: true});

const ms = (fr) => Math.round((fr / tl.fps) * 1000);
const srtTs = (fr) => {
  const t = ms(fr);
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(t / 3600000))}:${p(Math.floor(t / 60000) % 60)}:${p(Math.floor(t / 1000) % 60)},${p(t % 1000, 3)}`;
};
const mmss = (fr) => {
  const s = fr / tl.fps;
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${(s % 60).toFixed(1).padStart(4, '0')}`;
};

// --- SRT (wrap to max 2 lines of ~46 chars)
const wrap = (text, max = 46) => {
  if (text.length <= max) return text;
  // two balanced lines: choose the space that minimises the longer line
  let best = -1;
  for (let k = 0; k < text.length; k++) {
    if (text[k] !== ' ') continue;
    if (best < 0 || Math.max(k, text.length - k - 1) < Math.max(best, text.length - best - 1)) best = k;
  }
  return `${text.slice(0, best)}\n${text.slice(best + 1)}`;
};
const cues = lines.map((l, i) => {
  const from = tl.vo[l.id];
  const to = from + Math.ceil(dur[l.id] * tl.fps);
  const next = lines[i + 1] ? tl.vo[lines[i + 1].id] : Infinity;
  return {...l, from, end: Math.min(to + HOLD, next)};
});
// split long lines at clause boundaries; time shared in proportion to length
const split = (text, max = 80) => {
  if (text.length <= max) return [text];
  const mid = text.length / 2;
  let best = -1;
  for (const m of text.matchAll(/[,.?] /g)) {
    if (m.index < 28 || text.length - m.index < 28) continue; // avoid tiny fragments
    if (best < 0 || Math.abs(m.index - mid) < Math.abs(best - mid)) best = m.index;
  }
  if (best < 0) {
    best = text.lastIndexOf(' ', mid);
    return [...split(text.slice(0, best)), ...split(text.slice(best + 1))];
  }
  return [...split(text.slice(0, best + 1)), ...split(text.slice(best + 2))];
};
const srtCues = [];
for (const c of cues) {
  const parts = split(c.sub);
  const speechEnd = c.from + Math.ceil(dur[c.id] * tl.fps);
  const total = parts.reduce((a, p) => a + p.length, 0);
  let t = c.from;
  parts.forEach((p, k) => {
    const last = k === parts.length - 1;
    const end = last ? c.end : Math.round(t + ((speechEnd - c.from) * p.length) / total);
    srtCues.push({from: t, end, text: p});
    t = end;
  });
}
out('E-HAZOP_Basic_Concept_MET264016.srt', srtCues.map((c, i) => `${i + 1}\n${srtTs(c.from)} --> ${srtTs(c.end)}\n${wrap(c.text)}\n`).join('\n'));

// --- narration script
const SCENES = {
  1: ['SCENE 1 – PERSONAL INTRODUCTION', 'Academic title card, then an illustrated electrical substation at dusk.'],
  2: ['SCENE 2 – THE HIDDEN RISKS OF ELECTRICAL SYSTEMS', 'Wide substation, transformer close-up, switchgear warning lamp, control-room alarm.'],
  3: ['SCENE 3 – WHAT IS E-HAZOP?', 'Full-term reveal, HAZOP-to-E-HAZOP bridge (IEC 61882), animated single-line diagram.'],
  4: ['SCENE 4 – HOW DOES E-HAZOP WORK?', 'Five-step workflow, team review of the SLD, nodes, guideword × parameter matrix, hazard register.'],
  5: ['SCENE 5 – PRACTICAL EXAMPLE: TRANSFORMER OVERVOLTAGE (ILLUSTRATIVE)', 'Transformer, rising-voltage trend, relay alarm, insulation stress, cause–consequence–safeguard table.'],
  6: ['SCENE 6 – WHY IS E-HAZOP IMPORTANT?', 'Engineers in PPE, four benefits, when to apply, multidisciplinary team.'],
  7: ['SCENE 7 – CONCLUSION', 'Wide substation, closing message: Identify the deviation. Understand the risk. Strengthen the safeguards.'],
};
const sceneTimes = (n) => `${mmss(tl.scenes[n].from)}–${mmss(tl.scenes[n].to)}`;
let txt = `EXPLANATION OF THE BASIC CONCEPT OF E-HAZOP – NARRATION SCRIPT
Abdul Rahman bin Japry · MET264016
METE1153-51 Occupational Safety for Energy System · Individual Assignment 4
Language: British English · Total running time ${mmss(tl.durationInFrames)} (mm:ss)

`;
for (const n of [1, 2, 3, 4, 5, 6, 7]) {
  txt += `\n${SCENES[n][0]}  [${sceneTimes(n)}]\nVisuals: ${SCENES[n][1]}\n\n`;
  for (const l of lines.filter((x) => x.scene === n)) txt += `[${mmss(tl.vo[l.id])}] ${l.sub}\n`;
}
txt += `\nREFERENCES END CARD  [${mmss(tl.scenes.refs.from)}–${mmss(tl.scenes.refs.to)}]\n`;
out('narration_script.txt', txt);

// --- timing sheet
let ts = `# Scene-by-scene timing sheet

Video: 1920 × 1080, 30 fps, total **${mmss(tl.durationInFrames)}** (${tl.durationInFrames} frames).
Times are mm:ss.s from the start of the video.

| Scene | Start | End | Length | Content |
|---|---|---|---|---|
`;
for (const n of [1, 2, 3, 4, 5, 6, 7]) {
  const s = tl.scenes[n];
  ts += `| ${SCENES[n][0].replace(/^SCENE \d – /, `${n} · `)} | ${mmss(s.from)} | ${mmss(s.to)} | ${((s.to - s.from) / tl.fps).toFixed(1)} s | ${SCENES[n][1]} |\n`;
}
ts += `| References end card | ${mmss(tl.scenes.refs.from)} | ${mmss(tl.scenes.refs.to)} | ${((tl.scenes.refs.to - tl.scenes.refs.from) / tl.fps).toFixed(1)} s | Seven references with full URLs. |\n\n`;
ts += `## Narration cues\n\n| # | Scene | In | Out | Line |\n|---|---|---|---|---|\n`;
cues.forEach((c, i) => (ts += `| ${i + 1} | ${c.scene} | ${mmss(c.from)} | ${mmss(c.from + Math.ceil(dur[c.id] * tl.fps))} | ${c.sub} |\n`));
out('timing_sheet.md', ts);

// --- references (parsed from content.ts to stay in sync)
const content = readFileSync(new URL('../src/data/content.ts', import.meta.url), 'utf8');
const refs = [...content.matchAll(/\{org: '([^']+)', title: '([^']+)', url: '([^']*)'\}/g)];
let rf = `# References used in the video\n\n`;
refs.forEach((m, i) => (rf += `${i + 1}. **${m[1]}**: ${m[2]}.${m[3] ? ` <${m[3]}>` : ''}\n`));
rf += `
## Notes

- No publication dates or authors are listed because none were confirmed.
- IEC 61882:2016 (Edition 2.0) is the current edition of the IEC HAZOP application guide and replaced the 2001 first edition.
  The video cites it as the reference for the HAZOP study method.
- The video does not present SAFAN, SYSOP and OPTAN as mandatory stages. They are one provider's study structure (reference 4)
  and are listed only as a reference.
- The guidewords shown (over, under, spike, dip, fault, blackout) come from published E-HAZOP guideword lists. Guidewords are
  tailored to each design.
- The transformer overvoltage case is a hypothetical teaching example, not a documented incident.
`;
out('references.md', rf);
console.log(`wrote srt (${srtCues.length} cues), narration_script.txt, timing_sheet.md, references.md`);
