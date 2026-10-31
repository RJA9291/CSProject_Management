import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {clamp, ease} from './motion';

type Props = {
  from?: number; // local frame where the move starts
  dur: number;
  zoom?: [number, number];
  x?: [number, number];
  y?: [number, number];
  rotate?: [number, number];
  shake?: number; // px amplitude of handheld drift
  seed?: string;
  children: React.ReactNode;
};

/** Virtual camera: slow push-ins, pans and handheld micro-shake. */
export const Camera: React.FC<Props> = ({
  from = 0,
  dur,
  zoom = [1, 1.08],
  x = [0, 0],
  y = [0, 0],
  rotate = [0, 0],
  shake = 4,
  seed = 'cam',
  children,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [from, from + dur], [0, 1], {...clamp, easing: ease.inOut});
  const s = zoom[0] + (zoom[1] - zoom[0]) * p;
  const sx = noise2D(seed + 'x', frame / 45, 0) * shake;
  const sy = noise2D(seed + 'y', 0, frame / 45) * shake;
  const tx = x[0] + (x[1] - x[0]) * p + sx;
  const ty = y[0] + (y[1] - y[0]) * p + sy;
  const r = rotate[0] + (rotate[1] - rotate[0]) * p + noise2D(seed + 'r', frame / 80, 1) * shake * 0.04;
  return (
    <AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${s}) rotate(${r}deg)`}}>{children}</AbsoluteFill>
  );
};
