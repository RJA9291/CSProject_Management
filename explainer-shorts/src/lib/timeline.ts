// Generic shot timeline for a short: each shot lasts its voice-over (one or more parts, each
// with its own voice) plus a delay before and a pad after. Words drive captions and cues.
export const FPS = 30;

export type Word = {text: string; start: number; end: number};
export type Part = {vo: string; voice?: string; pitch?: string; rate?: string};
export type ScriptShot = {id: string; vo?: string; parts?: Part[]; highlight: string[]; voDelay: number; pad: number};
export type TimingPart = {file: string; start: number; duration: number};
export type Timing = {duration: number; words: Word[]; parts?: TimingPart[]};

export type Shot = {
  id: string;
  vo: string;
  highlight: string[];
  voDelay: number;
  pad: number;
  start: number; // global start frame
  frames: number;
  words: Word[]; // display words, seconds relative to the shot start (voDelay included)
  audio: {src: string; from: number}[]; // audio parts, `from` in frames relative to the shot
};

const bare = (w: string) => w.replace(/^[^\p{L}\p{N}@]+|[^\p{L}\p{N}]+$/gu, '');

// `say` respellings (e.g. "1821" -> "lapan belas dua puluh satu") make one display word span several TTS words.
export const makeTimeline = (shots: ScriptShot[], timings: Record<string, Timing>, audioDir: string, say: Record<string, string> = {}) => {
  let start = 0;
  const SHOTS: Shot[] = shots.map((s) => {
    const t = timings[s.id] ?? {duration: 3, words: []};
    const vo = s.vo ?? (s.parts ?? []).map((p) => p.vo).join(' ');
    const display = vo.split(/\s+/);
    const spans = display.map((w) => {
      const key = Object.keys(say).find((k) => bare(w) === k);
      return key ? say[key].split(/\s+/).length : 1;
    });
    const spanTotal = spans.reduce((x, y) => x + y, 0);
    let k = 0;
    const words =
      spanTotal !== display.length && t.words.length === spanTotal
        ? display.map((text, i) => {
            const first = t.words[k];
            const last = t.words[k + spans[i] - 1];
            k += spans[i];
            return {text, start: first.start + s.voDelay, end: last.end + s.voDelay};
          })
        : t.words.length === display.length
        ? t.words.map((w, i) => ({text: display[i], start: w.start + s.voDelay, end: w.end + s.voDelay}))
        : display.map((text, i) => ({text, start: s.voDelay + (t.duration * i) / display.length, end: s.voDelay + (t.duration * (i + 0.9)) / display.length}));
    const parts = t.parts ?? [{file: `${s.id}.mp3`, start: 0, duration: t.duration}];
    const audio = parts.map((p) => ({src: `${audioDir}/${p.file}`, from: Math.round((s.voDelay + p.start) * FPS)}));
    const frames = Math.ceil((s.voDelay + t.duration + s.pad) * FPS);
    const shot: Shot = {id: s.id, vo, highlight: s.highlight, voDelay: s.voDelay, pad: s.pad, start, frames, words, audio};
    start += frames;
    return shot;
  });
  return {SHOTS, TOTAL_FRAMES: start};
};

// Frame (relative to the shot) where the nth word containing `needle` starts.
export const cue = (shot: Shot, needle: string, fallback: number, nth = 0) => {
  const hits = shot.words.filter((w) => w.text.toLowerCase().includes(needle.toLowerCase()));
  return Math.round((hits[nth]?.start ?? fallback) * FPS);
};
