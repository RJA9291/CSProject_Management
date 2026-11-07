import type {Episode} from '../../lib/episode-types';
import {SCENES, TRANSITION_FRAMES} from './scenes';
import {SUPPORTERS} from './supporters';
import {EP06_THEME} from './theme';
import timings from './vo-timings.json';

// Episode 06 – IT Support & Troubleshooting Basics.
export const EP06: Episode = {
  id: 'ep06',
  scenes: SCENES,
  timings: timings as Episode['timings'],
  voDir: 'public/audio/ep06/vo',
  timingsPath: 'src/ep06/config/vo-timings.json',
  // Replace this file (same name) to swap the music.
  music: 'audio/music/bgm-ep06.wav',
  transitionFrames: TRANSITION_FRAMES,
  transitionColors: [EP06_THEME.navy, EP06_THEME.blue, EP06_THEME.green, EP06_THEME.white],
  // How the Malay TTS should pronounce acronyms and supporter handles.
  say: {
    IT: 'I.T.',
    IP: 'I.P.',
    QA: 'Q.A.',
    USB: 'U.S.B.',
    ...Object.fromEntries(SUPPORTERS.map((s) => [`@${s.handle}`, s.spoken])),
  },
};
