import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';
import {rand} from './motion';

/** Slow-floating digital dust / data particles. */
export const Particles: React.FC<{count?: number; color?: string; speed?: number; opacity?: number; size?: number}> = ({
  count = 80,
  color = COLORS.cyan,
  speed = 1,
  opacity = 0.7,
  size = 4,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity}}>
      {Array.from({length: count}, (_, i) => {
        const x = rand(i * 1.1) * 1080 + Math.sin(frame / 50 + i) * 20;
        const y = (((rand(i * 2.3) * 2100 - frame * speed * (0.6 + rand(i * 4.4) * 1.8)) % 2100) + 2100) % 2100 - 90;
        const s = size * (0.4 + rand(i * 7.7) * 1.2);
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(frame / 15 + i));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: s,
              height: s,
              borderRadius: i % 5 === 0 ? 1 : '50%',
              background: color,
              boxShadow: `0 0 ${s * 3}px ${color}`,
              opacity: tw,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Labels and fragments bursting outward from a point (data being exposed). */
export const DataBurst: React.FC<{at: number; labels: string[]; cx?: number; cy?: number; color?: string}> = ({
  at,
  labels,
  cx = 540,
  cy = 900,
  color = COLORS.red,
}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0) return null;
  const items = [...labels, ...Array.from({length: 40}, () => '')];
  return (
    <AbsoluteFill>
      {items.map((label, i) => {
        const ang = rand(i * 3.7) * Math.PI * 2;
        const v = label ? 14 + rand(i) * 8 : 18 + rand(i * 2) * 30;
        const d = v * t * (1 - Math.min(t, 40) / 90);
        const x = cx + Math.cos(ang) * d;
        const y = cy + Math.sin(ang) * d * (label ? 1.25 : 1);
        const o = Math.max(0, 1 - t / (label ? 36 : 24));
        if (!label) {
          const s = 4 + rand(i * 9) * 10;
          return <div key={i} style={{position: 'absolute', left: x, top: y, width: s, height: s, background: i % 3 ? color : '#fff', opacity: o, boxShadow: `0 0 12px ${color}`}} />;
        }
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%,-50%) scale(${0.8 + Math.min(t, 10) / 25})`,
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 700,
              fontSize: 30,
              color: '#fff',
              padding: '8px 16px',
              border: `2px solid ${color}`,
              background: 'rgba(60,0,8,0.75)',
              boxShadow: `0 0 24px ${color}`,
              opacity: o,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
