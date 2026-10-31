import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {CITY_POINTS, MALAYSIA_PATH, MAP_HEIGHT, MAP_WIDTH, NEIGHBOUR_PATHS} from '../assets/malaysiaMap';
import {COLORS} from '../theme';
import {clamp, ease, rand} from './motion';

const CITIES = Object.entries(CITY_POINTS);
const ARCS: [string, string][] = [
  ['Kuala Lumpur', 'Kota Kinabalu'],
  ['Kuala Lumpur', 'Kuching'],
  ['Johor Bahru', 'George Town'],
  ['Kuala Lumpur', 'Kota Bharu'],
  ['Shah Alam', 'Sandakan'],
  ['Ipoh', 'Miri'],
  ['Melaka', 'Kuantan'],
  ['Kuala Lumpur', 'Tawau'],
];

/** Animated map of Malaysia with pulsing incident points and data arcs. */
export const MalaysiaMap: React.FC<{start: number; heat: number; width?: number}> = ({start, heat, width = 1000}) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  const draw = interpolate(t, [0, 40], [0, 1], {...clamp, easing: ease.inOut});
  const fill = interpolate(t, [20, 60], [0, 1], clamp);
  const red = COLORS.red;
  return (
    <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} width={width} height={(width / MAP_WIDTH) * MAP_HEIGHT} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="mapfill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0f2a5a" />
          <stop offset="1" stopColor="#081633" />
        </linearGradient>
        <pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.4" fill={COLORS.cyan} opacity="0.55" />
        </pattern>
        <filter id="mapglow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {NEIGHBOUR_PATHS.map((d, i) => (
        <path key={i} d={d} fill="#0a1224" stroke="#1d2c4a" strokeWidth="1.2" opacity={0.6 * fill} />
      ))}
      <path d={MALAYSIA_PATH} fill="url(#mapfill)" opacity={fill} />
      <path d={MALAYSIA_PATH} fill="url(#dots)" opacity={fill * 0.8} />
      <path d={MALAYSIA_PATH} fill={red} opacity={fill * heat * 0.28} />
      <path
        d={MALAYSIA_PATH}
        fill="none"
        stroke={heat > 0.5 ? '#ff6b75' : COLORS.cyan}
        strokeWidth="2.6"
        pathLength={1}
        strokeDasharray="1"
        strokeDashoffset={1 - draw}
        filter="url(#mapglow)"
      />
      {ARCS.map(([a, b], i) => {
        const [x1, y1] = CITY_POINTS[a];
        const [x2, y2] = CITY_POINTS[b];
        const mx = (x1 + x2) / 2;
        const my = Math.min(y1, y2) - 90 - i * 8;
        const s = 50 + i * 14;
        const p = interpolate(t, [s, s + 30], [0, 1], {...clamp, easing: ease.inOut});
        const dot = ((t - s) % 45) / 45;
        const d = `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
        const qx = (1 - dot) ** 2 * x1 + 2 * (1 - dot) * dot * mx + dot ** 2 * x2;
        const qy = (1 - dot) ** 2 * y1 + 2 * (1 - dot) * dot * my + dot ** 2 * y2;
        return (
          <g key={i} opacity={p > 0 ? 1 : 0}>
            <path d={d} fill="none" stroke={red} strokeWidth="1.8" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} opacity={0.75} />
            {p >= 1 && <circle cx={qx} cy={qy} r="4" fill="#fff" filter="url(#mapglow)" />}
          </g>
        );
      })}
      {CITIES.map(([name, [x, y]], i) => {
        const s = 30 + rand(i * 3.3) * 60;
        const o = interpolate(t, [s, s + 8], [0, 1], clamp);
        const ph = ((t + i * 7) % 40) / 40;
        return (
          <g key={name} opacity={o}>
            <circle cx={x} cy={y} r={6 + ph * 26} fill="none" stroke={red} strokeWidth="2" opacity={(1 - ph) * 0.9} />
            <circle cx={x} cy={y} r="5.5" fill={red} filter="url(#mapglow)" />
            <circle cx={x} cy={y} r="2.2" fill="#fff" />
          </g>
        );
      })}
    </svg>
  );
};
