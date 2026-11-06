import type {Episode} from '../../lib/episode-types';
import {SCENES, TRANSITION_FRAMES} from './scenes';
import {SUPPORTERS} from './supporters';
import {EP03_THEME} from './theme';
import timings from './vo-timings.json';

// Episode 03 – Cybersecurity Basics: Protect Yourself in the Digital World.
export const EP03: Episode = {
  id: 'ep03',
  scenes: SCENES,
  timings: timings as Episode['timings'],
  voDir: 'public/audio/ep03/vo',
  timingsPath: 'src/ep03/config/vo-timings.json',
  music: 'audio/music/bgm-ep03.wav',
  transitionFrames: TRANSITION_FRAMES,
  transitionColors: [EP03_THEME.navy, EP03_THEME.blue, EP03_THEME.cyan, EP03_THEME.white],
  // How the Malay TTS should pronounce English terms and supporter handles.
  say: {
    MFA: 'M.F.A.',
    OTP: 'O.T.P.',
    NSRC: 'N.S.R.C.',
    '997': 'sembilan sembilan tujuh',
    ...Object.fromEntries(SUPPORTERS.map((s) => [`@${s.handle}`, s.spoken])),
  },
};
