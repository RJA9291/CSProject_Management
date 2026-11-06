// Episode 01 timing helpers (Episode 01 scenes import these directly).
import {EP01} from '../config/episode';
import {makeTiming} from './episode';

export type {Word} from './episode-types';
export {cleanWord} from './episode';

export const {sceneWords, speakingRanges, cueAt, voEnd} = makeTiming(EP01);
