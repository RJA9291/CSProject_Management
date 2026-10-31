// Illustrated high-voltage substation at dusk, drawn in SVG with parallax layers.
// Stands in for live-action substation footage (see docs/ASSET_CHECKLIST.md).
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {C} from '../theme';
import {rand} from './motion';

const W = 2400;
const H = 1350;
const HORIZON = 760;

// ------------------------------------------------------------ primitives

/** Lattice transmission tower (front elevation). */
export const LatticeTower: React.FC<{x: number; base: number; h: number; color?: string; light?: boolean; stroke?: number}> = ({
  x,
  base,
  h,
  color = '#0d1626',
  light,
  stroke = 2,
}) => {
  const frame = useCurrentFrame();
  const w = h * 0.32;
  const top = base - h;
  const waist = top + h * 0.28;
  const legs = (t: number) => {
    // half width at height fraction t (0 = base, 1 = top)
    if (t > 0.72) return w * 0.12;
    return w / 2 - (w / 2 - w * 0.12) * (t / 0.72);
  };
  const levels = 9;
  const pts = Array.from({length: levels + 1}, (_, i) => {
    const t = (i / levels) * 0.72;
    return {y: base - t * h, hw: legs(t)};
  });
  const arms = [top + h * 0.06, top + h * 0.17, top + h * 0.28];
  return (
    <g stroke={color} strokeWidth={stroke} fill="none" strokeLinejoin="round">
      <path d={`M${x - w / 2} ${base} L${x - w * 0.12} ${waist} L${x - w * 0.12} ${top} L${x + w * 0.12} ${top} L${x + w * 0.12} ${waist} L${x + w / 2} ${base}`} strokeWidth={stroke * 1.6} />
      {pts.slice(0, -1).map((p, i) => {
        const q = pts[i + 1];
        return (
          <g key={i}>
            <line x1={x - p.hw} y1={p.y} x2={x + q.hw} y2={q.y} />
            <line x1={x + p.hw} y1={p.y} x2={x - q.hw} y2={q.y} />
            <line x1={x - q.hw} y1={q.y} x2={x + q.hw} y2={q.y} />
          </g>
        );
      })}
      {arms.map((ay, i) => {
        const aw = w * (i === 1 ? 1.25 : 0.95);
        return (
          <g key={i}>
            <path d={`M${x - aw} ${ay} L${x + aw} ${ay} L${x + w * 0.12} ${ay + h * 0.035} L${x - w * 0.12} ${ay + h * 0.035} Z`} strokeWidth={stroke * 1.2} />
            <line x1={x - aw} y1={ay} x2={x - aw} y2={ay + h * 0.05} strokeWidth={stroke * 0.8} />
            <line x1={x + aw} y1={ay} x2={x + aw} y2={ay + h * 0.05} strokeWidth={stroke * 0.8} />
          </g>
        );
      })}
      {light && <circle cx={x} cy={top - 6} r={5} fill={C.red} stroke="none" opacity={0.35 + 0.65 * (Math.sin(frame / 9) > 0.2 ? 1 : 0.15)} />}
    </g>
  );
};

/** Conductor between two points with catenary-like sag. */
const Wire: React.FC<{x1: number; y1: number; x2: number; y2: number; sag?: number; color?: string; w?: number; flow?: boolean}> = ({
  x1,
  y1,
  x2,
  y2,
  sag = 40,
  color = '#1a2638',
  w = 1.6,
  flow,
}) => {
  const frame = useCurrentFrame();
  const d = `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.max(y1, y2) + sag} ${x2} ${y2}`;
  return (
    <g>
      <path d={d} stroke={color} strokeWidth={w} fill="none" />
      {flow && <path d={d} stroke={C.cyan} strokeWidth={w * 1.2} fill="none" strokeDasharray="14 420" strokeDashoffset={-frame * 9} opacity={0.5} />}
    </g>
  );
};

/** Stack of insulator sheds (post insulator / bushing). */
export const Insulator: React.FC<{x: number; y: number; h: number; w?: number; sheds?: number; color?: string; rim?: string}> = ({
  x,
  y,
  h,
  w = 18,
  sheds = 8,
  color = '#5d6b7e',
  rim = C.blueLight,
}) => (
  <g>
    <rect x={x - w * 0.18} y={y - h} width={w * 0.36} height={h} fill={color} />
    {Array.from({length: sheds}, (_, i) => {
      const sy = y - h + (i + 0.5) * (h / sheds);
      return <ellipse key={i} cx={x} cy={sy} rx={w / 2} ry={w * 0.13} fill={color} stroke={rim} strokeOpacity={0.25} strokeWidth={1} />;
    })}
  </g>
);

/** Power transformer (side-on) with radiators, conservator and bushings. */
export const Transformer: React.FC<{x: number; y: number; s?: number; glow?: number; label?: string}> = ({x, y, s = 1, glow = 0, label}) => {
  const tankW = 300;
  const tankH = 210;
  const body = '#1d2633';
  const edge = '#3a4a5e';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* plinth */}
      <rect x={-tankW / 2 - 70} y={0} width={tankW + 140} height={22} fill="#141a22" />
      {/* radiator bank left */}
      {Array.from({length: 9}, (_, i) => (
        <rect key={`l${i}`} x={-tankW / 2 - 64 + i * 7} y={-tankH + 30} width={5} height={tankH - 40} fill={i % 2 ? '#222c3a' : '#2a3646'} />
      ))}
      {Array.from({length: 9}, (_, i) => (
        <rect key={`r${i}`} x={tankW / 2 + 2 + i * 7} y={-tankH + 30} width={5} height={tankH - 40} fill={i % 2 ? '#222c3a' : '#2a3646'} />
      ))}
      <rect x={-tankW / 2 - 66} y={-tankH + 24} width={66} height={8} fill="#2a3646" />
      <rect x={tankW / 2} y={-tankH + 24} width={66} height={8} fill="#2a3646" />
      {/* tank */}
      <rect x={-tankW / 2} y={-tankH} width={tankW} height={tankH} rx={6} fill={body} stroke={edge} strokeWidth={2} />
      {Array.from({length: 7}, (_, i) => (
        <rect key={i} x={-tankW / 2 + 20 + i * 40} y={-tankH + 8} width={6} height={tankH - 16} fill="#253041" />
      ))}
      <rect x={-tankW / 2} y={-tankH} width={tankW} height={14} fill="#28344a" />
      {/* nameplate */}
      <rect x={-40} y={-90} width={80} height={46} rx={3} fill="#c9d3df" opacity={0.85} />
      {label && (
        <text x={0} y={-62} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1d2633" fontFamily="Inter">
          {label}
        </text>
      )}
      {/* thermal / insulation-stress glow */}
      {glow > 0 && (
        <rect x={-tankW / 2} y={-tankH} width={tankW} height={tankH} rx={6} fill="url(#txglow)" opacity={glow} />
      )}
      {/* conservator */}
      <rect x={-tankW / 2 + 10} y={-tankH - 92} width={150} height={44} rx={22} fill="#243042" stroke={edge} strokeWidth={2} />
      <rect x={-tankW / 2 + 60} y={-tankH - 50} width={8} height={50} fill="#243042" />
      {/* HV bushings */}
      {[-90, -10, 70].map((bx) => (
        <g key={bx}>
          <rect x={bx + 30 - 14} y={-tankH - 16} width={28} height={16} fill="#2c3848" />
          <Insulator x={bx + 30} y={-tankH - 16} h={130} w={24} sheds={11} color="#8a6a52" rim="#ffd2a8" />
          <rect x={bx + 30 - 4} y={-tankH - 160} width={8} height={18} fill="#9aa7b6" />
        </g>
      ))}
      {/* LV bushings */}
      {[110, 130].map((bx) => (
        <Insulator key={bx} x={bx} y={-tankH} h={46} w={14} sheds={5} color="#8a6a52" rim="#ffd2a8" />
      ))}
      {/* rim light */}
      <rect x={tankW / 2 - 3} y={-tankH} width={3} height={tankH} fill={C.blueLight} opacity={0.45} />
    </g>
  );
};

/** Live-tank circuit breaker / disconnector column. */
const Breaker: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-20} y={-30} width={40} height={30} fill="#1a2230" />
    <rect x={-4} y={-120} width={8} height={90} fill="#2a3544" />
    <Insulator x={0} y={-120} h={110} w={22} sheds={9} color="#7d8a9a" />
    <rect x={-26} y={-262} width={52} height={34} rx={4} fill="#3a4757" />
  </g>
);

/** Portal gantry (two lattice columns and a beam). */
const Gantry: React.FC<{x: number; y: number; w: number; h: number; color?: string}> = ({x, y, w, h, color = '#121c2c'}) => (
  <g stroke={color} strokeWidth={3} fill="none">
    {[x, x + w].map((cx) => (
      <g key={cx}>
        <line x1={cx - 10} y1={y} x2={cx - 10} y2={y - h} />
        <line x1={cx + 10} y1={y} x2={cx + 10} y2={y - h} />
        {Array.from({length: 8}, (_, i) => (
          <line key={i} x1={cx - 10} y1={y - (i * h) / 8} x2={cx + 10} y2={y - ((i + 1) * h) / 8} strokeWidth={1.5} />
        ))}
      </g>
    ))}
    <line x1={x - 10} y1={y - h} x2={x + w + 10} y2={y - h} strokeWidth={4} />
    <line x1={x - 10} y1={y - h + 22} x2={x + w + 10} y2={y - h + 22} strokeWidth={3} />
    {Array.from({length: Math.floor(w / 30)}, (_, i) => (
      <line key={i} x1={x + i * 30} y1={y - h} x2={x + (i + 1) * 30} y2={y - h + 22} strokeWidth={1.5} />
    ))}
  </g>
);

const FloodLight: React.FC<{x: number; y: number; h: number; flicker?: number}> = ({x, y, h, flicker = 1}) => (
  <g>
    <polygon points={`${x - 8},${y - h} ${x + 8},${y - h} ${x + 260},${y + 40} ${x - 260},${y + 40}`} fill="url(#beam)" opacity={0.22 * flicker} />
    <rect x={x - 3} y={y - h} width={6} height={h} fill="#0e1520" />
    <rect x={x - 16} y={y - h - 8} width={32} height={10} rx={2} fill="#fff4d6" opacity={0.9 * flicker} />
    <circle cx={x} cy={y - h - 3} r={40} fill="url(#lampglow)" opacity={flicker} />
  </g>
);

// ------------------------------------------------------------ scene

export const SubstationScene: React.FC<{
  energised?: boolean;
  alarm?: number; // 0..1 red alarm tint
  night?: number; // 0 dusk .. 1 night
  parallax?: number; // camera x offset in px (applied with depth)
  txGlow?: number;
}> = ({energised = true, alarm = 0, night = 0.3, parallax = 0, txGlow = 0}) => {
  const frame = useCurrentFrame();
  const flick = 0.9 + 0.1 * noise2D('fl', frame / 12, 0);
  const layer = (depth: number): React.CSSProperties => ({transform: `translateX(${parallax * depth}px)`});
  const skyTop = interpolate(night, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{position: 'absolute', left: (1920 - W) / 2, top: (1080 - H) / 2}}>
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={skyTop > 0.5 ? '#03060c' : '#060b16'} />
            <stop offset="0.45" stopColor="#0c1a30" />
            <stop offset="0.62" stopColor="#1b3352" />
            <stop offset="0.7" stopColor="#3b5677" />
            <stop offset="0.75" stopColor="#5d6f86" />
          </linearGradient>
          <radialGradient id="horizonGlow" cx="0.62" cy="0.56" r="0.5">
            <stop offset="0" stopColor="#c98b5a" stopOpacity={0.35 * (1 - night)} />
            <stop offset="1" stopColor="#c98b5a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#141b26" />
            <stop offset="1" stopColor="#07090e" />
          </linearGradient>
          <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#5d7390" stopOpacity="0" />
            <stop offset="0.5" stopColor="#5d7390" stopOpacity="0.28" />
            <stop offset="1" stopColor="#5d7390" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff1c9" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff1c9" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="lampglow">
            <stop offset="0" stopColor="#fff1c9" stopOpacity="0.8" />
            <stop offset="1" stopColor="#fff1c9" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="txglow" cx="0.5" cy="0.55" r="0.6">
            <stop offset="0" stopColor="#ff6a3d" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ff2d2d" stopOpacity="0" />
          </radialGradient>
          <pattern id="chain" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="22" height="22" fill="none" stroke="#2a3443" strokeWidth="1.4" />
          </pattern>
        </defs>

        {/* sky */}
        <rect width={W} height={HORIZON + 40} fill="url(#sky)" />
        <rect width={W} height={HORIZON + 40} fill="url(#horizonGlow)" />
        {Array.from({length: 90}, (_, i) => (
          <circle key={i} cx={rand(i * 3.1) * W} cy={rand(i * 7.3) * HORIZON * 0.55} r={0.6 + rand(i) * 1.3} fill="#dbe9f7" opacity={(0.15 + rand(i * 2) * 0.5) * (0.4 + night)} />
        ))}

        {/* far hills + far towers */}
        <g style={layer(0.15)}>
          <path d={`M0 ${HORIZON - 30} Q300 ${HORIZON - 110} 620 ${HORIZON - 50} T1300 ${HORIZON - 70} T2000 ${HORIZON - 40} T2400 ${HORIZON - 80} L2400 ${HORIZON + 60} L0 ${HORIZON + 60}Z`} fill="#0b1422" />
          {[180, 520, 860, 1200, 1540, 1880, 2220].map((tx, i) => (
            <LatticeTower key={tx} x={tx} base={HORIZON + 10 - (i % 2) * 6} h={92} color="#14223a" stroke={1} light={i === 3} />
          ))}
          {[0, 1, 2].map((k) =>
            [180, 520, 860, 1200, 1540, 1880].map((tx, i) => (
              <Wire key={`${k}-${tx}`} x1={tx + (k - 1) * 30} y1={HORIZON - 72 + k * 2} x2={tx + 340 + (k - 1) * 30} y2={HORIZON - 72 + k * 2} sag={18} color="#16233a" w={1} />
            )),
          )}
        </g>

        {/* ground */}
        <rect y={HORIZON + 30} width={W} height={H - HORIZON} fill="url(#ground)" />

        {/* mid: big transmission tower bringing lines into the yard */}
        <g style={layer(0.35)}>
          <LatticeTower x={360} base={HORIZON + 120} h={620} color="#0c1524" stroke={3} light />
          {[0, 1, 2].map((k) => (
            <Wire key={k} x1={360 - 230 + k * 230} y1={HORIZON + 120 - 620 + 37 + k * 2} x2={980 + k * 140} y2={HORIZON - 168} sag={70} color="#1b2840" w={2.2} flow={energised} />
          ))}
          {[0, 1, 2].map((k) => (
            <Wire key={`b${k}`} x1={-200 + k * 120} y1={HORIZON - 260} x2={360 - 230 + k * 230} y2={HORIZON + 120 - 620 + 37 + k * 2} sag={50} color="#1b2840" w={2.2} flow={energised} />
          ))}
        </g>

        {/* yard structures */}
        <g style={layer(0.55)}>
          <Gantry x={900} y={HORIZON + 140} w={520} h={300} />
          <Gantry x={1500} y={HORIZON + 140} w={520} h={300} />
          {/* tubular busbars */}
          {[0, 1, 2].map((k) => (
            <g key={k}>
              <line x1={860} y1={HORIZON - 30 + k * 16} x2={2120} y2={HORIZON - 30 + k * 16} stroke="#8796a8" strokeWidth={4} />
              {energised && <line x1={860} y1={HORIZON - 30 + k * 16} x2={2120} y2={HORIZON - 30 + k * 16} stroke={C.cyan} strokeWidth={4} strokeDasharray="30 500" strokeDashoffset={-frame * 12 - k * 60} opacity={0.35} />}
            </g>
          ))}
          {[920, 1080, 1240, 1400, 1560, 1720, 1880, 2040].map((px) => (
            <Insulator key={px} x={px} y={HORIZON + 120} h={140} w={20} sheds={10} />
          ))}
          {/* droppers */}
          {[0, 1, 2].map((k) => (
            <Wire key={k} x1={980 + k * 140} y1={HORIZON - 168} x2={1010 + k * 40} y2={HORIZON - 30 + k * 16} sag={10} color="#2b3a52" w={2} />
          ))}
          {/* breakers row */}
          {[1000, 1110, 1220, 1640, 1750, 1860].map((bx) => (
            <Breaker key={bx} x={bx} y={HORIZON + 230} s={0.9} />
          ))}
        </g>

        {/* control building */}
        <g style={layer(0.5)}>
          <rect x={1880} y={HORIZON + 30} width={300} height={170} fill="#121a26" />
          <rect x={1870} y={HORIZON + 20} width={320} height={16} fill="#1b2533" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={1905 + i * 68} y={HORIZON + 70} width={46} height={34} fill="#ffcf8a" opacity={(i === 2 ? 0.25 : 0.75) * (0.85 + 0.15 * flick)} />
          ))}
          <rect x={1920} y={HORIZON + 140} width={40} height={60} fill="#0a0f16" />
        </g>

        {/* transformers */}
        <g style={layer(0.75)}>
          <Transformer x={1180} y={HORIZON + 420} s={1.05} glow={txGlow} label="TX-01" />
          <Transformer x={1760} y={HORIZON + 420} s={1.05} label="TX-02" />
          {[0, 1, 2].map((k) => (
            <Wire key={k} x1={1180 - 63 + k * 84} y1={HORIZON + 420 - 400} x2={1000 + k * 110} y2={HORIZON + 230 - 262} sag={14} color="#33445c" w={2.4} />
          ))}
          {[0, 1, 2].map((k) => (
            <Wire key={`t2${k}`} x1={1760 - 63 + k * 84} y1={HORIZON + 420 - 400} x2={1640 + k * 110} y2={HORIZON + 230 - 262} sag={14} color="#33445c" w={2.4} />
          ))}
        </g>

        {/* haze band */}
        <rect y={HORIZON - 120} width={W} height={360} fill="url(#haze)" opacity={0.8} />

        {/* floodlights + fence (foreground) */}
        <g style={layer(1)}>
          <FloodLight x={720} y={HORIZON + 470} h={420} flicker={flick} />
          <FloodLight x={2010} y={HORIZON + 470} h={420} flicker={flick} />
          <rect x={0} y={HORIZON + 330} width={W} height={260} fill="url(#chain)" opacity={0.85} />
          <rect x={0} y={HORIZON + 326} width={W} height={5} fill="#1e2632" />
          {Array.from({length: 13}, (_, i) => (
            <rect key={i} x={i * 200} y={HORIZON + 300} width={10} height={300} fill="#141b25" />
          ))}
          <rect y={HORIZON + 560} width={W} height={60} fill="#06080c" />
        </g>

        {/* alarm wash */}
        {alarm > 0 && <rect width={W} height={H} fill={C.red} opacity={alarm * 0.18} style={{mixBlendMode: 'screen'}} />}
      </svg>
      {/* drifting mist */}
      <AbsoluteFill style={{pointerEvents: 'none'}}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: -400 + ((frame * (0.6 + i * 0.25) + i * 700) % 2700) - 300,
              top: 560 + i * 60,
              width: 1100,
              height: 260,
              borderRadius: '50%',
              background: 'radial-gradient(closest-side, rgba(120,145,175,0.10), transparent)',
            }}
          />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
