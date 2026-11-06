import {useVideoConfig} from 'remotion';
import {useTiming} from '../../lib/episode';

// Frame helpers for one scene: f('word', fallbackSeconds) = frame where that word is spoken.
export const useCues = (index: number) => {
  const {fps} = useVideoConfig();
  const {cueAt, voEnd} = useTiming();
  return {
    f: (needle: string, fallback: number, nth = 0) => Math.round(cueAt(index, needle, fallback, nth) * fps),
    end: Math.round(voEnd(index) * fps),
    fps,
  };
};
