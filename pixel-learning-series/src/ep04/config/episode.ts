import type {Episode} from '../../lib/episode-types';
import {SCENES, TRANSITION_FRAMES} from './scenes';
import {SUPPORTERS} from './supporters';
import {EP04_THEME} from './theme';
import timings from './vo-timings.json';

// Episode 04 – Computer Networking Basics: How Computers Connect & How the Internet Works.
export const EP04: Episode = {
  id: 'ep04',
  scenes: SCENES,
  timings: timings as Episode['timings'],
  voDir: 'public/audio/ep04/vo',
  timingsPath: 'src/ep04/config/vo-timings.json',
  // Replace this file (same name) to swap the music.
  music: 'audio/music/bgm-ep04.wav',
  transitionFrames: TRANSITION_FRAMES,
  transitionColors: [EP04_THEME.navy, EP04_THEME.blue, EP04_THEME.cyan, EP04_THEME.white],
  // How the Malay TTS should pronounce English terms and supporter handles.
  say: {
    WLAN: 'W-LAN',
    IP: 'I.P.',
    DNS: 'D.N.S.',
    DHCP: 'D.H.C.P.',
    ...Object.fromEntries(SUPPORTERS.map((s) => [`@${s.handle}`, s.spoken])),
  },
};
