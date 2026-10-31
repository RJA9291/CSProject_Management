import {beat, scene, TL} from './timeline';

export type Cue = {sfx: string; at: number; volume: number};

const vo = TL.vo;

// Heartbeats speed up while the viewer hesitates over the link.
const hesitationBeats = (() => {
  const out: number[] = [];
  let t = beat('hesitate') + 4;
  let gap = 24;
  while (t < beat('exposed') - 8) {
    out.push(t);
    t += gap;
    gap = Math.max(13, gap - 2);
  }
  return out;
})();

const cliffBeats = (() => {
  const out: number[] = [];
  for (let t = scene('cliffhanger').from + 14; t < beat('titleReveal') - 20; t += 27) out.push(t);
  return out;
})();

export const CUES: Cue[] = [
  // Scene 1 – hook
  {sfx: 'boom', at: 0, volume: 0.9},
  {sfx: 'glitch', at: 0, volume: 0.55},
  {sfx: 'click', at: vo.s1_1 + 14, volume: 0.7},
  {sfx: 'notify', at: vo.s1_1 + 20, volume: 0.35},
  {sfx: 'whoosh_up', at: vo.s1_2 - 6, volume: 0.45},
  {sfx: 'whoosh_down', at: vo.s1_3 - 6, volume: 0.4},
  {sfx: 'click', at: vo.s1_3 + 12, volume: 0.6},
  {sfx: 'whoosh_up', at: vo.s1_4 - 6, volume: 0.4},
  {sfx: 'chime', at: vo.s1_4 + 16, volume: 0.35},
  {sfx: 'whoosh_down', at: vo.s1_5 - 6, volume: 0.4},
  {sfx: 'typing', at: vo.s1_5 + 6, volume: 0.35},
  {sfx: 'notify', at: vo.s1_5 + 2, volume: 0.3},
  {sfx: 'glitch_short', at: vo.s1_6, volume: 0.45},
  {sfx: 'heartbeat', at: vo.s1_6 + 2, volume: 0.8},
  {sfx: 'impact', at: beat('safeText'), volume: 0.85},
  {sfx: 'glitch', at: beat('safeText'), volume: 0.4},

  // Scene 2 – threat
  {sfx: 'whoosh_down', at: scene('threat').from - 8, volume: 0.45},
  {sfx: 'alert', at: beat('msgArrive'), volume: 0.6},
  {sfx: 'vibrate', at: beat('callArrive'), volume: 0.55},
  {sfx: 'glitch_short', at: beat('callArrive'), volume: 0.35},
  {sfx: 'click', at: beat('clickTap'), volume: 0.9},
  {sfx: 'impact', at: beat('clickTap'), volume: 0.45},
  {sfx: 'alert', at: beat('parcelArrive'), volume: 0.5},
  {sfx: 'alert', at: beat('bankLink'), volume: 0.6},
  {sfx: 'glitch_short', at: beat('hesitate'), volume: 0.35},
  ...hesitationBeats.map((at) => ({sfx: 'heartbeat', at, volume: 0.85})),
  {sfx: 'riser', at: beat('exposed') - 90, volume: 0.35},
  {sfx: 'tick', at: beat('oneClickText'), volume: 0.5},
  {sfx: 'impact', at: beat('oneClickText') + 13, volume: 0.6},
  {sfx: 'tick', at: beat('oneClickText') + 26, volume: 0.5},
  {sfx: 'tick', at: beat('oneClickText') + 39, volume: 0.5},
  {sfx: 'boom', at: beat('exposed'), volume: 1.0},
  {sfx: 'glitch_long', at: beat('exposed'), volume: 0.65},

  // Scene 3 – Malaysian reality check
  {sfx: 'whoosh_down', at: scene('reality').from - 6, volume: 0.45},
  {sfx: 'scan', at: beat('mapIn') + 4, volume: 0.45},
  {sfx: 'impact', at: beat('casesIn'), volume: 0.95},
  {sfx: 'counter', at: beat('casesIn'), volume: 0.4},
  {sfx: 'impact', at: beat('lossesIn'), volume: 0.8},
  {sfx: 'glitch_short', at: beat('lossesIn'), volume: 0.3},
  {sfx: 'impact', at: beat('ageIn'), volume: 0.85},
  {sfx: 'scan', at: beat('ageIn') + 8, volume: 0.35},
  {sfx: 'riser', at: beat('blueTurn') - 88, volume: 0.45},

  // Scene 4 – introducing cybersecurity
  {sfx: 'whoosh_up', at: beat('blueTurn') - 4, volume: 0.6},
  {sfx: 'shimmer', at: beat('blueTurn') + 2, volume: 0.45},
  {sfx: 'impact', at: beat('cyberWord'), volume: 0.6},
  {sfx: 'shimmer', at: beat('cyberWord'), volume: 0.4},
  {sfx: 'scan', at: vo.s4_3 - 6, volume: 0.4},
  {sfx: 'tick', at: beat('identity'), volume: 0.6},
  {sfx: 'tick', at: beat('data'), volume: 0.6},
  {sfx: 'tick', at: beat('money'), volume: 0.6},
  {sfx: 'impact', at: beat('digitalLife'), volume: 0.45},

  // Scene 5 – cliffhanger
  {sfx: 'whoosh_down', at: beat('fadeDark') - 6, volume: 0.4},
  ...cliffBeats.map((at) => ({sfx: 'heartbeat', at, volume: 0.75})),
  {sfx: 'glitch_short', at: vo.s5_2, volume: 0.35},
  {sfx: 'riser', at: beat('titleReveal') - 90, volume: 0.6},
  {sfx: 'boom', at: beat('titleReveal'), volume: 1.0},
  {sfx: 'glitch', at: beat('titleReveal'), volume: 0.5},
  {sfx: 'impact', at: beat('readyIn'), volume: 0.5},
  {sfx: 'typing', at: beat('soonIn'), volume: 0.3},
  {sfx: 'glitch_long', at: beat('glitchOut'), volume: 0.55},
];
