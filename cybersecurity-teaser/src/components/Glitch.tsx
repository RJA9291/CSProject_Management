import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {rand} from './motion';

/**
 * Wraps content and, while `intensity` > 0, adds an RGB channel split and
 * displaced horizontal slices. Intensity 0 renders the children untouched.
 */
export const Glitch: React.FC<{intensity: number; children: React.ReactNode; seed?: number}> = ({
  intensity,
  children,
  seed = 1,
}) => {
  const frame = useCurrentFrame();
  if (intensity <= 0.001) return <AbsoluteFill>{children}</AbsoluteFill>;
  const k = Math.floor(frame / 2) + seed * 100;
  const off = 4 + intensity * 26 * rand(k);
  const slices = Array.from({length: 5}, (_, i) => {
    const top = rand(k + i * 3.1) * 100;
    const h = 1.5 + rand(k + i * 7.7) * 7 * intensity;
    const dx = (rand(k + i * 1.3) - 0.5) * 160 * intensity;
    return {top, h, dx};
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${-off}px)`, filter: 'url(#glitch-r)', mixBlendMode: 'screen'}}>
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${off}px)`, filter: 'url(#glitch-gb)', mixBlendMode: 'screen'}}>
        {children}
      </AbsoluteFill>
      {slices.map((s, i) => (
        <AbsoluteFill
          key={i}
          style={{
            clipPath: `inset(${s.top}% 0 ${Math.max(0, 100 - s.top - s.h)}% 0)`,
            transform: `translateX(${s.dx}px)`,
          }}
        >
          {children}
        </AbsoluteFill>
      ))}
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <filter id="glitch-r">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
        </filter>
        <filter id="glitch-gb">
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>
      </svg>
    </AbsoluteFill>
  );
};

/** Short decaying glitch envelope around a set of hit frames. */
export const glitchAt = (frame: number, hits: number[], dur = 8, peak = 1) => {
  let v = 0;
  for (const h of hits) {
    const d = frame - h;
    if (d >= 0 && d < dur) v = Math.max(v, peak * (1 - d / dur) * (rand(frame) > 0.25 ? 1 : 0.2));
  }
  return v;
};
