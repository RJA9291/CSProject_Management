import type {SceneConfig} from '../config/scenes';

export type Word = {text: string; start: number; end: number};

export type Episode = {
  id: string;
  scenes: SceneConfig[];
  timings: Record<string, Word[]>;
  // Where generate-voiceover.py writes MP3s and word timings (repo-relative).
  voDir: string;
  timingsPath: string;
  music: string;
  transitionFrames: number;
  transitionColors: string[];
  // Pronunciation respellings: display word -> what the TTS should say.
  say?: Record<string, string>;
};
