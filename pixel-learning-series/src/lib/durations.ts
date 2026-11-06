import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {staticFile} from 'remotion';
import {EP01} from '../config/episode';
import {VIDEO} from '../config/theme';
import type {Episode} from './episode-types';

// Scene length = storyboard minimum, stretched to fit the voice-over plus padding.
export const episodeSceneFrames = async (ep: Episode, index: number): Promise<number> => {
  const s = ep.scenes[index];
  let vo = 0;
  try {
    vo = await getAudioDurationInSeconds(staticFile(s.voFile));
  } catch {
    vo = 0;
  }
  return Math.ceil(Math.max(s.minSeconds, s.voDelay + vo + s.padSeconds) * VIDEO.fps);
};

export const episodeAllFrames = (ep: Episode) => Promise.all(ep.scenes.map((_, i) => episodeSceneFrames(ep, i)));

export const episodeStarts = (ep: Episode, durations: number[]) =>
  durations.map((_, i) => durations.slice(0, i).reduce((a, b) => a + b, 0) - i * ep.transitionFrames);

export const episodeTotal = (ep: Episode, durations: number[]) =>
  durations.reduce((a, b) => a + b, 0) - Math.max(0, durations.length - 1) * ep.transitionFrames;

export const sceneFrames = (index: number) => episodeSceneFrames(EP01, index);
export const allSceneFrames = () => episodeAllFrames(EP01);
export const sceneStarts = (durations: number[]) => episodeStarts(EP01, durations);
export const totalFrames = (durations: number[]) => episodeTotal(EP01, durations);
