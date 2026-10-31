import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';
import {clamp} from '../components/motion';

/** Shot: renders children between [from, to) with a cross-dissolve at both ends. */
export const Shot: React.FC<{from: number; to: number; fin?: number; fout?: number; children: React.ReactNode}> = ({from, to, fin = 14, fout = 14, children}) => {
  const f = useCurrentFrame();
  if (f > to + fout) return null;
  if (f < from) return null;
  const a = fin > 0 ? interpolate(f, [from, from + fin], [0, 1], clamp) : 1;
  const b = fout > 0 ? interpolate(f, [to, to + fout], [1, 0], clamp) : f < to ? 1 : 0;
  return <AbsoluteFill style={{opacity: Math.min(a, b)}}>{children}</AbsoluteFill>;
};

/** Dark technical backdrop with a faint blueprint grid. */
export const Blueprint: React.FC<{opacity?: number}> = ({opacity = 1}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${C.navy2} 0%, ${C.navy} 45%, ${C.bg} 90%)`}} />
      <AbsoluteFill
        style={{
          opacity: 0.35,
          backgroundImage: 'linear-gradient(rgba(111,178,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(111,178,255,0.08) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          backgroundPosition: `${f * 0.2}px ${f * 0.1}px`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Darkening scrim so overlaid graphics stay readable over illustrations. */
export const Scrim: React.FC<{o?: number}> = ({o = 0.6}) => <AbsoluteFill style={{background: `rgba(6,10,18,${o})`}} />;
