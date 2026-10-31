import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';
import {clamp, ease} from './motion';

const N = 90;
const SPHERE = Array.from({length: N}, (_, i) => {
  const y = 1 - (i / (N - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const th = i * 2.399963;
  return [Math.cos(th) * r, y, Math.sin(th) * r] as const;
});
const EDGES: [number, number][] = [];
for (let i = 0; i < N; i++) {
  for (let j = i + 1; j < N; j++) {
    const [a, b, c] = SPHERE[i];
    const [d, e, f] = SPHERE[j];
    if ((a - d) ** 2 + (b - e) ** 2 + (c - f) ** 2 < 0.13) EDGES.push([i, j]);
  }
}

/** Rotating 3D node network (a protected digital world). */
export const NodeSphere: React.FC<{start: number; radius?: number; cy?: number; color?: string}> = ({
  start,
  radius = 420,
  cy = 820,
  color = COLORS.cyan,
}) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  const grow = interpolate(t, [0, 40], [0.2, 1], {...clamp, easing: ease.out});
  const rot = t / 140;
  const pts = SPHERE.map(([x, y, z]) => {
    const cx = x * Math.cos(rot) - z * Math.sin(rot);
    const cz = x * Math.sin(rot) + z * Math.cos(rot);
    const tilt = 0.35;
    const cy2 = y * Math.cos(tilt) - cz * Math.sin(tilt);
    const cz2 = y * Math.sin(tilt) + cz * Math.cos(tilt);
    const persp = 1 / (1.8 - cz2 * 0.6);
    return {x: 540 + cx * radius * grow * persp * 1.4, y: cy + cy2 * radius * grow * persp * 1.4, z: cz2};
  });
  return (
    <AbsoluteFill>
      <svg width="1080" height="1920">
        {EDGES.map(([i, j], k) => {
          const a = pts[i];
          const b = pts[j];
          const depth = (a.z + b.z + 2) / 4;
          return <line key={k} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={0.8 + depth} opacity={0.08 + depth * 0.35} />;
        })}
        {pts.map((p, i) => {
          const depth = (p.z + 1) / 2;
          const pulse = i % 11 === Math.floor(t / 6) % 11;
          return <circle key={i} cx={p.x} cy={p.y} r={2 + depth * 4 + (pulse ? 4 : 0)} fill={pulse ? '#fff' : color} opacity={0.3 + depth * 0.7} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Shield emblem that draws itself, with hex texture and a lock. */
export const Shield: React.FC<{at: number; size?: number; color?: string}> = ({at, size = 420, color = COLORS.cyan}) => {
  const frame = useCurrentFrame();
  const t = frame - at;
  const draw = interpolate(t, [0, 30], [0, 1], {...clamp, easing: ease.inOut});
  const fill = interpolate(t, [18, 40], [0, 1], clamp);
  const lock = interpolate(t, [30, 44], [0, 1], {...clamp, easing: ease.out});
  const shine = interpolate(t, [40, 70], [-1, 2], clamp);
  const d = 'M200 20 L360 80 C360 220 320 330 200 400 C80 330 40 220 40 80 Z';
  return (
    <svg viewBox="0 0 400 420" width={size} height={size * 1.05} style={{overflow: 'visible'}}>
      <defs>
        <pattern id="hex" width="28" height="48" patternUnits="userSpaceOnUse" patternTransform="scale(0.8)">
          <path d="M14 0 L28 8 L28 24 L14 32 L0 24 L0 8 Z M14 32 L14 48" fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" />
        </pattern>
        <linearGradient id="shieldfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#123a7a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#050b1a" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
          <stop offset={Math.max(0, shine - 0.15)} stopColor="white" stopOpacity="0" />
          <stop offset={Math.min(1, Math.max(0, shine))} stopColor="white" stopOpacity="0.5" />
          <stop offset={Math.min(1, Math.max(0, shine + 0.15))} stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id="sglow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="sclip">
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill="url(#shieldfill)" opacity={fill} />
      <rect x="0" y="0" width="400" height="420" fill="url(#hex)" clipPath="url(#sclip)" opacity={fill} />
      <path d={d} fill="none" stroke={color} strokeWidth="7" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} filter="url(#sglow)" />
      <g transform={`translate(200 220) scale(${0.6 + lock * 0.4})`} opacity={lock}>
        <path d="M-38 -10 L-38 -40 A38 38 0 0 1 38 -40 L38 -10" fill="none" stroke="white" strokeWidth="14" strokeLinecap="round" />
        <rect x="-60" y="-14" width="120" height="96" rx="16" fill="white" />
        <circle cx="0" cy="24" r="12" fill="#0a1630" />
        <rect x="-5" y="26" width="10" height="28" rx="4" fill="#0a1630" />
      </g>
      <rect x="0" y="0" width="400" height="420" fill="url(#shine)" clipPath="url(#sclip)" />
    </svg>
  );
};

/** Simple line icons for the four pillars. */
export const PillarIcon: React.FC<{kind: number; color: string; size?: number}> = ({kind, color, size = 96}) => {
  const s = {fill: 'none', stroke: color, strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      {kind === 0 && (
        <g {...s}>
          <path d="M14 34c0-8 4-14 10-14s10 6 10 14" />
          <path d="M18 34c0-6 2.5-10 6-10s6 4 6 10" />
          <path d="M22 34c0-4 1-6 2-6s2 2 2 6" />
          <path d="M10 26c2-8 7-12 14-12s12 4 14 12" />
          <path d="M14 14c3-3 6-4 10-4s7 1 10 4" />
        </g>
      )}
      {kind === 1 && (
        <g {...s}>
          <ellipse cx="24" cy="12" rx="14" ry="5" />
          <path d="M10 12v24c0 3 6 5 14 5s14-2 14-5V12" />
          <path d="M10 24c0 3 6 5 14 5s14-2 14-5" />
        </g>
      )}
      {kind === 2 && (
        <g {...s}>
          <rect x="7" y="13" width="34" height="24" rx="4" />
          <path d="M7 19h34" />
          <text x="24" y="33" textAnchor="middle" fontSize="10" fontWeight="800" fill={color} stroke="none" fontFamily="Inter">RM</text>
        </g>
      )}
      {kind === 3 && (
        <g {...s}>
          <rect x="15" y="5" width="18" height="38" rx="4" />
          <path d="M21 9h6" />
          <circle cx="24" cy="24" r="6" />
          <path d="M18 24h12M24 18c-2 2-2 10 0 12M24 18c2 2 2 10 0 12" />
        </g>
      )}
    </svg>
  );
};
