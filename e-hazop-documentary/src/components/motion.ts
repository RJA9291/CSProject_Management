import {Easing, interpolate, spring} from 'remotion';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const ease = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.7, 0, 0.84, 0),
};

/** 0 -> 1 over [from, from+dur] with easing. */
export const progress = (frame: number, from: number, dur: number, easing = ease.out) =>
  interpolate(frame, [from, from + dur], [0, 1], {...clamp, easing});

/** Fade in at `from`, fade out ending at `to`. */
export const inOut = (frame: number, from: number, to: number, fin = 8, fout = 8) =>
  Math.min(progress(frame, from, fin, ease.out), 1 - progress(frame, to - fout, fout, ease.in));

export const pop = (frame: number, fps: number, delay = 0, damping = 14, mass = 0.6) =>
  spring({frame: frame - delay, fps, config: {damping, mass, stiffness: 180}});

/** Deterministic pseudo random in [0,1). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
