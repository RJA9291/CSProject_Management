import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';
import {rand} from './motion';

/** Out-of-focus city lights (bokeh) – the night view behind the phone. */
export const Bokeh: React.FC<{count?: number; tint?: string[]; blur?: number; drift?: number; opacity?: number}> = ({
  count = 34,
  tint = ['#2f8cff', '#4fd8ff', '#ffb020', '#ff5a66', '#cfe9ff'],
  blur = 14,
  drift = 0.25,
  opacity = 0.75,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity}}>
      {Array.from({length: count}, (_, i) => {
        const size = 40 + rand(i * 3.3) * 160;
        const x = rand(i * 1.7) * 1180 - 50 + Math.sin(frame / 90 + i) * 10 + frame * drift * (rand(i) - 0.5);
        const y = rand(i * 9.1) * 1920;
        const c = tint[i % tint.length];
        const tw = 0.55 + 0.45 * Math.sin(frame / (20 + rand(i) * 30) + i);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${c}aa 0%, ${c}66 35%, ${c}22 60%, ${c}00 71%)`,
              
              opacity: tw * (0.35 + rand(i * 2.2) * 0.6),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Kuala Lumpur night skyline silhouette (Twin Towers + KL Tower + city blocks). */
export const KLSkyline: React.FC<{y?: number; scale?: number; lit?: number}> = ({y = 1100, scale = 1, lit = 1}) => {
  const frame = useCurrentFrame();
  const blocks = Array.from({length: 26}, (_, i) => ({
    x: i * 46 - 40,
    w: 38 + rand(i * 4.1) * 30,
    h: 90 + rand(i * 2.7) * 260,
  }));
  const tower = (cx: number) => (
    <g>
      <path
        d={`M${cx - 34} 700 L${cx - 34} 260 L${cx - 28} 250 L${cx - 28} 170 L${cx - 20} 160 L${cx - 20} 100 L${cx - 12} 90 L${cx - 12} 40 L${cx - 5} 30 L${cx - 2} -60 L${cx + 2} -60 L${cx + 5} 30 L${cx + 12} 40 L${cx + 12} 90 L${cx + 20} 100 L${cx + 20} 160 L${cx + 28} 170 L${cx + 28} 250 L${cx + 34} 260 L${cx + 34} 700 Z`}
        fill="#070d1c"
        stroke="#2f8cff"
        strokeOpacity={0.35 * lit}
        strokeWidth="2"
      />
      {Array.from({length: 22}, (_, r) => (
        <rect key={r} x={cx - 26} y={280 + r * 19} width="52" height="3" fill="#9fd0ff" opacity={(0.12 + 0.15 * rand(r + cx)) * lit} />
      ))}
    </g>
  );
  return (
    <svg
      viewBox="0 -120 1080 820"
      width={1080 * scale}
      height={820 * scale}
      style={{position: 'absolute', left: (1080 - 1080 * scale) / 2, top: y - 700 * scale}}
    >
      <defs>
        <linearGradient id="skyfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1630" stopOpacity="0" />
          <stop offset="1" stopColor="#02040a" stopOpacity="1" />
        </linearGradient>
      </defs>
      {blocks.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={700 - b.h} width={b.w} height={b.h} fill="#060b17" />
          {Array.from({length: Math.floor(b.h / 26)}, (_, r) =>
            Array.from({length: 3}, (_, c) => {
              const on = rand(i * 31 + r * 7 + c) > 0.62;
              const flick = rand(i + r + c + Math.floor(frame / 40)) > 0.97 ? 0.2 : 1;
              return on ? (
                <rect key={`${r}-${c}`} x={b.x + 6 + c * (b.w / 3.2)} y={700 - b.h + 10 + r * 26} width="6" height="9" fill={rand(i + r) > 0.7 ? '#ffcf7a' : '#7fb8ff'} opacity={0.55 * lit * flick} />
              ) : null;
            }),
          )}
        </g>
      ))}
      {/* KL Tower */}
      <g>
        <rect x="796" y="170" width="14" height="530" fill="#070d1c" />
        <ellipse cx="803" cy="170" rx="40" ry="26" fill="#070d1c" stroke="#4fd8ff" strokeOpacity={0.35 * lit} strokeWidth="2" />
        <rect x="801" y="40" width="4" height="110" fill="#070d1c" />
        <circle cx="803" cy="38" r="5" fill={COLORS.red} opacity={0.4 + 0.6 * Math.abs(Math.sin(frame / 12))} />
      </g>
      {tower(410)}
      {tower(530)}
      <rect x="440" y="420" width="60" height="10" fill="#0b1630" stroke="#2f8cff" strokeOpacity={0.4 * lit} />
      <circle cx="410" cy="-62" r="4" fill={COLORS.red} opacity={0.4 + 0.6 * Math.abs(Math.sin(frame / 10))} />
      <circle cx="530" cy="-62" r="4" fill={COLORS.red} opacity={0.4 + 0.6 * Math.abs(Math.sin(frame / 10 + 1))} />
      <rect x="0" y="400" width="1080" height="300" fill="url(#skyfade)" />
    </svg>
  );
};

/** Rain streaks on window glass. */
export const Rain: React.FC<{opacity?: number}> = ({opacity = 0.35}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity}}>
      {Array.from({length: 70}, (_, i) => {
        const x = rand(i * 2.1) * 1080;
        const speed = 18 + rand(i) * 26;
        const len = 40 + rand(i * 3) * 90;
        const y = ((rand(i * 5.5) * 2200 + frame * speed) % 2200) - 200;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 2,
              height: len,
              background: 'linear-gradient(to bottom, transparent, rgba(180,210,255,0.7))',
              transform: 'rotate(8deg)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
