import {createContext, useContext, useMemo} from 'react';
import {EP01} from '../config/episode';
import type {Episode, Word} from './episode-types';

export type {Episode, Word} from './episode-types';

// TTS acronyms ("I.T.", "L.F.C.A.") are shown as written in the script ("IT", "LFCA").
export const cleanWord = (w: string) => w.replace(/([A-Z])\./g, '$1');

const bare = (w: string) => w.replace(/^[^\p{L}\p{N}@]+|[^\p{L}\p{N}]+$/gu, '');

// Text sent to the TTS engine: explicit `tts`, else the script with `say` respellings applied.
export const ttsText = (ep: Episode, index: number) => {
  const s = ep.scenes[index];
  if (s.tts) return s.tts;
  if (!ep.say) return s.vo;
  return s.vo
    .split(/\s+/)
    .map((w) => {
      const b = bare(w);
      return ep.say?.[b] ? w.replace(b, ep.say[b]) : w;
    })
    .join(' ');
};

export const makeTiming = (ep: Episode) => {
  // Word timings in scene-relative seconds (voice-over delay included). If a scene's audio was
  // replaced and has no timings entry, words are spread evenly across the given voice length.
  const sceneWords = (index: number, voSeconds?: number): Word[] => {
    const scene = ep.scenes[index];
    const raw = ep.timings[String(index + 1)];
    const words = scene.vo.split(/\s+/);
    const shift = (w: Word, text: string): Word => ({text, start: w.start + scene.voDelay, end: w.end + scene.voDelay});
    if (raw?.length) {
      // A display word may be spoken as several TTS tokens (e.g. "AhmadFitri89" -> "Ahmad Fitri").
      const spans = words.map((w) => (ep.say?.[bare(w)] ? ep.say[bare(w)].split(/\s+/).length : 1));
      if (spans.reduce((a, b) => a + b, 0) === raw.length) {
        let k = 0;
        return words.map((text, i) => {
          const first = raw[k];
          const last = raw[k + spans[i] - 1];
          k += spans[i];
          return shift({text, start: first.start, end: last.end}, text);
        });
      }
      if (raw.length === words.length) return raw.map((w, i) => shift(w, words[i]));
      return raw.map((w) => shift(w, cleanWord(w.text)));
    }
    const len = voSeconds ?? words.length * 0.38;
    return words.map((text, i) => ({
      text,
      start: scene.voDelay + (len * i) / words.length,
      end: scene.voDelay + (len * (i + 0.85)) / words.length,
    }));
  };
  const speakingRanges = (index: number): [number, number][] => sceneWords(index).map((w) => [w.start, w.end + 0.05]);
  // Start time (scene seconds) of the nth word containing `needle`, so visuals land on the narration.
  const cueAt = (index: number, needle: string, fallback: number, nth = 0): number => {
    const n = needle.toLowerCase();
    const hits = sceneWords(index).filter((x) => x.text.toLowerCase().includes(n));
    return hits[nth]?.start ?? fallback;
  };
  const voEnd = (index: number) => {
    const w = sceneWords(index);
    return w.length ? w[w.length - 1].end : ep.scenes[index].voDelay;
  };
  return {sceneWords, speakingRanges, cueAt, voEnd};
};

// Episode 01 is the default so its scenes need no provider.
export const EpisodeContext = createContext<Episode>(EP01);
export const useEpisode = () => useContext(EpisodeContext);
export const useTiming = () => {
  const ep = useEpisode();
  return useMemo(() => makeTiming(ep), [ep]);
};
