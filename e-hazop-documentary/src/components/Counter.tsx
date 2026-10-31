import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, ease} from './motion';

export const Counter: React.FC<{to: number; at: number; dur?: number; style?: React.CSSProperties}> = ({to, at, dur = 45, style}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [at, at + dur], [0, to], {...clamp, easing: ease.out});
  return <span style={{fontVariantNumeric: 'tabular-nums', ...style}}>{Math.round(v).toLocaleString('en-US')}</span>;
};
