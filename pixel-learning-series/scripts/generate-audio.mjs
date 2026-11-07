// Synthesizes the original chiptune music loop and retro sound effects as 16-bit WAV files.
import {mkdirSync, writeFileSync} from 'node:fs';

const RATE = 44100;
const root = new URL('../public/audio/', import.meta.url);
// Optional filter: `node scripts/generate-audio.mjs alert notify buzz bgm-ep03` writes only those files.
const only = new Set(process.argv.slice(2));
const wanted = (name) => only.size === 0 || only.has(name);

const writeWav = (path, samples) => {
  if (!wanted(path.replace(/^.*\//, '').replace(/\.wav$/, ''))) return;
  const data = Buffer.alloc(samples.length * 2);
  let peak = 0;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  const norm = peak > 0.95 ? 0.95 / peak : 1;
  samples.forEach((s, i) => data.writeInt16LE(Math.round(s * norm * 32767), i * 2));
  const h = Buffer.alloc(44);
  h.write('RIFF', 0);
  h.writeUInt32LE(36 + data.length, 4);
  h.write('WAVEfmt ', 8);
  h.writeUInt32LE(16, 16);
  h.writeUInt16LE(1, 20);
  h.writeUInt16LE(1, 22);
  h.writeUInt32LE(RATE, 24);
  h.writeUInt32LE(RATE * 2, 28);
  h.writeUInt16LE(2, 32);
  h.writeUInt16LE(16, 34);
  h.write('data', 36);
  h.writeUInt32LE(data.length, 40);
  writeFileSync(new URL(path, root), Buffer.concat([h, data]));
};

const osc = {
  square: (p, duty = 0.5) => ((p % 1) < duty ? 1 : -1),
  tri: (p) => 1 - 4 * Math.abs((p % 1) - 0.5),
  sine: (p) => Math.sin(2 * Math.PI * p),
};
let seed = 7;
const noise = () => {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return (seed / 0x3fffffff) - 1;
};
const midi = (n) => 440 * 2 ** ((n - 69) / 12);

// Renders a tone whose frequency follows freqFn(t) and amplitude follows envFn(t).
const tone = (dur, freqFn, envFn, wave = 'square', duty = 0.5) => {
  const n = Math.floor(dur * RATE);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    phase += freqFn(t) / RATE;
    out[i] = osc[wave](phase, duty) * envFn(t);
  }
  return out;
};
const mix = (dur, parts) => {
  const out = new Float32Array(Math.floor(dur * RATE));
  for (const [offset, buf, gain = 1] of parts) {
    const o = Math.floor(offset * RATE);
    for (let i = 0; i < buf.length && o + i < out.length; i++) out[o + i] += buf[i] * gain;
  }
  return out;
};
const decay = (dur, a = 0.004) => (t) => Math.min(1, t / a) * Math.max(0, 1 - t / dur) ** 2;

mkdirSync(new URL('sfx/', root), {recursive: true});
mkdirSync(new URL('music/', root), {recursive: true});

const sfx = {
  pop: tone(0.11, (t) => 720 - 4200 * t, decay(0.11), 'sine'),
  blip: tone(0.07, () => 1320, decay(0.07), 'square', 0.25),
  click: mix(0.04, [[0, tone(0.04, () => 2400, decay(0.03), 'square', 0.5), 0.6]]),
  jump: tone(0.22, (t) => 300 + 2600 * t, decay(0.22), 'square', 0.25),
  coin: mix(0.42, [
    [0, tone(0.08, () => midi(83), () => 1, 'square', 0.5), 0.5],
    [0.08, tone(0.34, () => midi(88), decay(0.34), 'square', 0.5), 0.5],
  ]),
  sparkle: mix(0.5, [76, 83, 88, 91, 95].map((n, i) => [i * 0.07, tone(0.18, () => midi(n), decay(0.18), 'tri'), 0.7])),
  success: mix(0.7, [60, 64, 67, 72].map((n, i) => [i * 0.09, tone(i === 3 ? 0.4 : 0.12, () => midi(n + 12), decay(i === 3 ? 0.4 : 0.12), 'square', 0.25), 0.45])),
  whoosh: (() => {
    const dur = 0.42;
    const n = Math.floor(dur * RATE);
    const out = new Float32Array(n);
    let lp = 0;
    for (let i = 0; i < n; i++) {
      const t = i / RATE;
      const k = 0.02 + 0.25 * Math.sin(Math.PI * t / dur);
      lp += k * (noise() - lp);
      out[i] = lp * Math.sin(Math.PI * t / dur) * 1.6;
    }
    return out;
  })(),
  transition: mix(0.32, [
    [0, tone(0.3, (t) => 900 - 2200 * t, decay(0.3), 'square', 0.125), 0.35],
    [0, tone(0.3, (t) => 600 - 1200 * t, decay(0.3), 'tri'), 0.4],
  ]),
  // Episode 03 (Cybersecurity): warning beeps, phone notification, wrong-answer buzz.
  alert: mix(0.62, [0, 1, 2].map((k) => [k * 0.2, tone(0.16, () => (k % 2 ? 660 : 880), decay(0.16, 0.002), 'square', 0.5), 0.5])),
  notify: mix(0.5, [
    [0, tone(0.14, () => midi(88), decay(0.14), 'sine'), 0.8],
    [0.12, tone(0.34, () => midi(93), decay(0.34), 'sine'), 0.8],
  ]),
  // Episode 04 (Networking): rising "connected" chirp.
  link: mix(0.36, [60, 67, 72].map((n, i) => [i * 0.07, tone(0.14, () => midi(n + 24), decay(0.14), 'square', 0.25), 0.45])),
  buzz: tone(0.28, (t) => 150 - 60 * t, decay(0.28, 0.003), 'square', 0.5),
};
for (const [name, buf] of Object.entries(sfx)) writeWav(`sfx/${name}.wav`, buf);

// Renders an 8-bar chiptune loop (bass, off-beat chord stabs, hi-hat, lead) that loops seamlessly.
const song = (file, {bpm, chords, melody, lead = 'square', leadDuty = 0.25, leadGain = 0.16}) => {
  const beat = 60 / bpm;
  const bars = melody.length;
  const dur = bars * 4 * beat;
  const parts = [];
  for (let bar = 0; bar < bars; bar++) {
    const [bass, triad] = chords[bar % chords.length];
    const t0 = bar * 4 * beat;
    for (let b = 0; b < 4; b++) {
      parts.push([t0 + b * beat, tone(beat * 0.9, () => midi(b % 2 ? bass + 12 : bass), decay(beat * 1.1, 0.01), 'tri'), 0.55]);
      triad.forEach((n, k) => parts.push([t0 + b * beat + beat / 2 + k * 0.03, tone(beat * 0.35, () => midi(n), decay(beat * 0.35), 'square', 0.125), 0.07]));
      const hat = new Float32Array(Math.floor(0.03 * RATE)).map((_, i) => noise() * (1 - i / (0.03 * RATE)));
      parts.push([t0 + b * beat + beat / 2, hat, 0.08]);
    }
    melody[bar].forEach((n, k) => {
      if (n === null) return;
      const f = midi(n);
      parts.push([t0 + (k * beat) / 2, tone(beat * 0.45, (t) => f * (1 + 0.004 * Math.sin(2 * Math.PI * 5 * t)), decay(beat * 0.6, 0.01), lead, leadDuty), leadGain]);
    });
  }
  const music = mix(dur + 1, parts);
  // Fold the tail past the loop point back onto the start so the loop has no click.
  const loopLen = Math.floor(dur * RATE);
  for (let i = loopLen; i < music.length; i++) music[i - loopLen] += music[i];
  writeWav(file, music.slice(0, loopLen));
  return dur;
};

// Episode 01: 100 BPM, I–vi–IV–V.
const dur = song('music/bgm.wav', {
  bpm: 100,
  chords: [
    [48, [60, 64, 67]],
    [45, [57, 60, 64]],
    [41, [57, 60, 65]],
    [43, [59, 62, 67]],
  ],
  melody: [
    [72, 74, 76, 79, 76, 74, 72, null],
    [69, 72, 76, 74, 72, null, 69, 67],
    [69, 72, 74, 72, 77, 76, 74, null],
    [71, 74, 79, 77, 74, 72, 71, 74],
    [72, 76, 79, 81, 79, 76, 74, 76],
    [72, 69, 72, 76, 74, null, 72, 69],
    [65, 69, 72, 74, 72, 69, 72, 74],
    [74, 71, 67, 71, 74, 79, null, null],
  ],
});

// Episode 02 (Blue Pixel World): airier 92 BPM, IV–V–vi–iii with a softer triangle lead.
song('music/bgm-ep02.wav', {
  bpm: 92,
  chords: [
    [41, [57, 60, 64]],
    [43, [59, 62, 65]],
    [45, [57, 60, 64]],
    [40, [55, 59, 62]],
  ],
  melody: [
    [76, null, 79, 81, 79, null, 76, 74],
    [74, null, 77, 79, 77, 74, 71, null],
    [72, 76, 79, null, 84, 81, 79, null],
    [79, null, 76, 74, 71, null, 67, null],
    [81, null, 79, 76, 79, null, 84, 81],
    [79, 77, 74, null, 77, 79, 81, null],
    [84, null, 81, 79, 76, 79, 81, null],
    [79, 76, 74, null, 71, 74, null, null],
  ],
  lead: 'tri',
  leadGain: 0.3,
});

// Episode 03 (Cybersecurity): 100 BPM minor i–VI–III–VII, alert-but-friendly square lead.
song('music/bgm-ep03.wav', {
  bpm: 100,
  chords: [
    [45, [57, 60, 64]],
    [41, [57, 60, 65]],
    [48, [55, 60, 64]],
    [43, [55, 59, 62]],
  ],
  melody: [
    [76, null, 72, 76, 79, null, 76, 74],
    [72, null, 69, 72, 77, 76, 72, null],
    [72, 76, 79, null, 84, 79, 76, null],
    [74, null, 71, 74, 79, null, 74, null],
    [81, null, 76, 79, 81, 84, 81, null],
    [77, 76, 72, null, 69, 72, 77, null],
    [79, null, 76, 72, 76, 79, 84, null],
    [83, 79, 74, null, 71, 74, null, null],
  ],
  lead: 'square',
  leadDuty: 0.125,
  leadGain: 0.13,
});

// Episode 04 (Networking): bright 108 BPM I–V–vi–IV with a pulse lead.
song('music/bgm-ep04.wav', {
  bpm: 108,
  chords: [
    [43, [55, 59, 62]],
    [38, [54, 57, 62]],
    [40, [55, 59, 64]],
    [36, [55, 60, 64]],
  ],
  melody: [
    [79, null, 74, 79, 83, null, 81, 79],
    [78, null, 74, 78, 81, 79, 78, null],
    [76, 79, 83, null, 86, 83, 79, null],
    [76, null, 72, 76, 79, null, 76, null],
    [79, 83, 86, null, 83, 81, 79, null],
    [78, 81, 86, null, 81, 78, 74, null],
    [76, null, 79, 83, 88, 86, 83, null],
    [84, 83, 79, null, 76, 79, null, null],
  ],
  lead: 'square',
  leadDuty: 0.25,
  leadGain: 0.12,
});

console.log(`Wrote ${Object.keys(sfx).length} SFX and music loops (Ep01 ${dur.toFixed(1)}s, Ep02)`);
