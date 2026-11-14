import script from './script.json';
import timings from './timings.json';

export const FPS = 30;

export type Word = {text: string; start: number; end: number};
export type Shot = {
  id: string;
  vo: string;
  highlight: string[];
  voDelay: number;
  pad: number;
  // Filled from timings.json.
  start: number; // frame where the shot begins (global)
  frames: number;
  words: Word[]; // display words, seconds relative to the shot start (voDelay included)
  audio: string;
};

const T = timings as Record<string, {duration: number; words: Word[]}>;

// Each shot lasts its voice-over plus the delay before and the pad after.
export const SHOTS: Shot[] = (() => {
  let start = 0;
  return script.shots.map((s) => {
    const t = T[s.id] ?? {duration: 3, words: []};
    const display = s.vo.split(/\s+/);
    const words = t.words.length === display.length ? t.words.map((w, i) => ({text: display[i], start: w.start + s.voDelay, end: w.end + s.voDelay})) : display.map((text, i) => ({text, start: s.voDelay + (t.duration * i) / display.length, end: s.voDelay + (t.duration * (i + 0.9)) / display.length}));
    const frames = Math.ceil((s.voDelay + t.duration + s.pad) * FPS);
    const shot: Shot = {...s, start, frames, words, audio: `audio/waze/vo/${s.id}.mp3`};
    start += frames;
    return shot;
  });
})();

export const TOTAL_FRAMES = SHOTS.reduce((a, s) => a + s.frames, 0);
export const shotById = (id: string) => SHOTS.find((s) => s.id === id)!;

// Frame (relative to the shot) where the nth word containing `needle` starts.
export const cue = (shot: Shot, needle: string, fallback: number, nth = 0) => {
  const hits = shot.words.filter((w) => w.text.toLowerCase().includes(needle.toLowerCase()));
  return Math.round((hits[nth]?.start ?? fallback) * FPS);
};
