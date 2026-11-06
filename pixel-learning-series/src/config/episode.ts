import type {Episode} from '../lib/episode-types';
import {AUDIO} from './audio';
import {SCENES, TRANSITION_FRAMES} from './scenes';
import timings from './vo-timings.json';

// Episode 01 – LFCA: Your IT Career Roadmap.
export const EP01: Episode = {
  id: 'ep01',
  scenes: SCENES,
  timings: timings as Episode['timings'],
  voDir: 'public/audio/vo',
  timingsPath: 'src/config/vo-timings.json',
  music: AUDIO.music,
  transitionFrames: TRANSITION_FRAMES,
  transitionColors: ['#17375E', '#17375E', '#2586C7', '#171717'],
};
