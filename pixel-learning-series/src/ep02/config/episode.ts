import type {Episode} from '../../lib/episode-types';
import {SCENES, TRANSITION_FRAMES} from './scenes';
import {SUPPORTERS} from './supporters';
import {EP02_THEME} from './theme';
import timings from './vo-timings.json';

// Episode 02 – Cloud Computing: Blue Pixel World.
export const EP02: Episode = {
  id: 'ep02',
  scenes: SCENES,
  timings: timings as Episode['timings'],
  voDir: 'public/audio/ep02/vo',
  timingsPath: 'src/ep02/config/vo-timings.json',
  music: 'audio/music/bgm-ep02.wav',
  transitionFrames: TRANSITION_FRAMES,
  transitionColors: [EP02_THEME.navy, EP02_THEME.blue, EP02_THEME.sky, EP02_THEME.white],
  // How the Malay TTS should pronounce English terms and supporter handles.
  say: {
    IaaS: 'Ai-as',
    PaaS: 'Pas',
    SaaS: 'Sas',
    '365': 'three six five',
    ...Object.fromEntries(SUPPORTERS.map((s) => [s.handle, s.spoken])),
  },
};
