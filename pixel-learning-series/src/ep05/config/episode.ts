import type {Episode} from '../../lib/episode-types';
import {SCENES, TRANSITION_FRAMES} from './scenes';
import {SUPPORTERS} from './supporters';
import {EP05_THEME} from './theme';
import timings from './vo-timings.json';

// Episode 05 – Introduction to Linux: Discover the Operating System Behind the Digital World.
export const EP05: Episode = {
  id: 'ep05',
  scenes: SCENES,
  timings: timings as Episode['timings'],
  voDir: 'public/audio/ep05/vo',
  timingsPath: 'src/ep05/config/vo-timings.json',
  // Replace this file (same name) to swap the music.
  music: 'audio/music/bgm-ep05.wav',
  transitionFrames: TRANSITION_FRAMES,
  transitionColors: [EP05_THEME.navy, EP05_THEME.blue, EP05_THEME.green, EP05_THEME.white],
  // How the Malay TTS should pronounce commands, acronyms and supporter handles.
  say: {
    PWD: 'P.W.D.',
    LS: 'L.S.',
    CD: 'C.D.',
    MKDIR: 'make dir',
    WHOAMI: 'who am I',
    GUI: 'G.U.I.',
    CLI: 'C.L.I.',
    ...Object.fromEntries(SUPPORTERS.map((s) => [`@${s.handle}`, s.spoken])),
  },
};
