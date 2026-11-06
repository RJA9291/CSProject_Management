import {Easing, interpolate, spring} from 'remotion';

// Spring-in scale for pop/bounce entrances; `delay` in frames.
export const pop = (frame: number, fps: number, delay = 0, damping = 11) =>
  spring({frame: frame - delay, fps, config: {damping, stiffness: 180, mass: 0.7}});

export const slide = (frame: number, delay: number, dur: number, from: number, to = 0) =>
  interpolate(frame - delay, [0, dur], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.4)),
  });

export const fade = (frame: number, delay: number, dur = 8) =>
  interpolate(frame - delay, [0, dur], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// Rounds motion to whole sprite pixels so movement stays on the pixel grid.
export const snap = (v: number, px = 12) => Math.round(v / px) * px;

// Gentle floating offset for icons.
export const float = (frame: number, amp = 12, period = 60, phase = 0) =>
  snap(Math.sin(((frame + phase) / period) * Math.PI * 2) * amp, 4);
