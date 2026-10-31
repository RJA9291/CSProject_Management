import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

export const FilmGrain: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <Img src={staticFile(`images/grain/grain_${frame % 8}.png`)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.6}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** Cross-dissolve helper: opacity for a layer living in [from, to] with fades. */
export const useFade = (from: number, to: number, fin = 15, fout = 15) => {
  const f = useCurrentFrame();
  return Math.min(
    interpolate(f, [from, from + fin], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(f, [to - fout, to], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );
};

/** Fades a block in/out by absolute (sequence-local) frame. */
export const Fade: React.FC<{from: number; to: number; fin?: number; fout?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  from,
  to,
  fin = 15,
  fout = 15,
  children,
  style,
}) => {
  const f = useCurrentFrame();
  const o = useFade(from, to, fin, fout);
  if (f < from || f > to) return null;
  return <AbsoluteFill style={{opacity: o, ...style}}>{children}</AbsoluteFill>;
};
