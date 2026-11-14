// Flat comic art for Tasik Chini, inked with thick outlines. All sizes in panel pixels.
import React from 'react';
import {INK} from './comic';
import {look, OUT, SH} from './look';

// Outline props, read at render time so the same art can be inked (comic) or white-edged (paper).
const S = {
  get stroke() {
    return look.ink;
  },
  get strokeWidth() {
    return look.sw;
  },
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};

export const Sky: React.FC<{w: number; h: number; top: string; bottom: string; id: string}> = ({w, h, top, bottom, id}) => (
  <>
    <defs>
      <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
    </defs>
    <rect width={w} height={h} fill={`url(#sky-${id})`} />
  </>
);

export const Moon: React.FC<{x: number; y: number; r: number}> = ({x, y, r}) => <circle cx={x} cy={y} r={r} fill="#fff4c8" {...S} filter={SH()} />;

export const Hills: React.FC<{w: number; y: number; color?: string; seed?: number}> = ({w, y, color = '#2f6b4a', seed = 0}) => {
  const pts: string[] = [`0,${y + 60}`];
  for (let x = 0; x <= w; x += w / 6) pts.push(`${x},${y + Math.sin((x / w) * 7 + seed) * 40}`);
  pts.push(`${w},${y + 60}`);
  return <polygon points={pts.join(' ')} fill={color} {...S} filter={SH()} />;
};

export const Tree: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = '#3f8a4c'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-8} y={-60} width={16} height={60} fill="#6b4a2c" {...S} />
    <circle cx={0} cy={-90} r={46} fill={c} {...S} />
    <circle cx={-34} cy={-66} r={30} fill={c} {...S} />
    <circle cx={34} cy={-66} r={30} fill={c} {...S} />
    <circle cx={-10} cy={-100} r={14} fill="url(#ht-light)" />
  </g>
);

export const Jungle: React.FC<{w: number; y: number; n?: number; s?: number}> = ({w, y, n = 7, s = 1}) => (
  // One shadow for the whole tree line (cheaper than one per tree).
  <g filter={SH()}>
    {Array.from({length: n}, (_, i) => (
      <Tree key={i} x={(i + 0.5) * (w / n) + (i % 2 ? 12 : -12)} y={y + (i % 3) * 8} s={s * (0.85 + (i % 3) * 0.12)} c={['#3f8a4c', '#2f7a46', '#4f9a52'][i % 3]} />
    ))}
  </g>
);

export const Water: React.FC<{w: number; h: number; y: number; f: number; color?: string; rough?: number}> = ({w, h, y, f, color = '#2b7fc4', rough = 1}) => (
  <g>
    <rect x={0} y={y} width={w} height={h - y} fill={color} stroke={OUT()} strokeWidth={5} />
    <rect x={0} y={y + (h - y) * 0.45} width={w} height={(h - y) * 0.55} fill="url(#ht-dark)" opacity={0.5} />
    {Array.from({length: 6}, (_, i) => {
      const yy = y + 30 + i * ((h - y) / 6);
      const off = ((f * 2 + i * 70) % 160) - 80;
      const a = 10 * rough;
      return <path key={i} d={`M ${40 + off + (i % 2) * 120} ${yy} q 40 ${-a} 80 0 t 80 0`} fill="none" stroke="#bfe6ff" strokeWidth={5} strokeLinecap="round" />;
    })}
  </g>
);

export const Lotus: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter={SH()}>
    <ellipse cx={0} cy={10} rx={46} ry={14} fill="#4f9a52" {...S} />
    {[-28, -12, 0, 12, 28].map((a, i) => (
      <ellipse key={i} cx={a * 0.5} cy={-10} rx={10} ry={26} fill={i === 2 ? '#ff8fb8' : '#ffb3cf'} {...S} transform={`rotate(${a} ${a * 0.5} 6)`} />
    ))}
    <circle cx={0} cy={-6} r={6} fill="#ffd23f" {...S} />
  </g>
);

export const Hut: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter={SH()}>
    {[-50, 50].map((px) => (
      <rect key={px} x={px - 5} y={-40} width={10} height={40} fill="#6b4a2c" {...S} />
    ))}
    <rect x={-70} y={-110} width={140} height={70} fill="#c9a06a" {...S} />
    <polygon points="-90,-108 0,-170 90,-108" fill="#8c6b3c" {...S} />
    <rect x={-16} y={-96} width={32} height={56} fill="#4a3320" {...S} />
  </g>
);

export type Pose = 'idle' | 'chop' | 'bow' | 'point' | 'scared' | 'talk' | 'pull' | 'cheer';
export type Face = 'calm' | 'happy' | 'shock' | 'angry' | 'sad';

// Comic person. (x, y) = feet. elder = white hair, hunched, stick in hand.
export const Person: React.FC<{x: number; y: number; s?: number; f: number; cloth: string; skin?: string; hair?: string; woman?: boolean; elder?: boolean; pose?: Pose; face?: Face; flip?: boolean}> = ({
  x,
  y,
  s = 1,
  f,
  cloth,
  skin = '#d9a47a',
  hair = '#1b1b1b',
  woman = false,
  elder = false,
  pose = 'idle',
  face = 'calm',
  flip = false,
}) => {
  const h = 200;
  const hunch = elder ? 12 : 0;
  const headY = -h + 34 + hunch;
  const sw = Math.sin(f / 3);
  let arm: [number, number][] = [
    [-34, -95],
    [34, -95],
  ];
  if (pose === 'chop') arm = [[-20, -170 + sw * 30], [24, -150 + sw * 30]];
  if (pose === 'point') arm = [[-30, -95], [80, -140]];
  if (pose === 'scared') arm = [[-60, -170], [60, -170]];
  if (pose === 'talk') arm = [[-34, -95], [60, -120 + sw * 6]];
  if (pose === 'pull') arm = [[40, -150], [52, -140]];
  if (pose === 'cheer') arm = [[-56, -180 + sw * 6], [56, -180 - sw * 6]];
  if (pose === 'bow') arm = [[-10, -60], [10, -60]];
  const lean = pose === 'bow' ? 28 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} filter={SH()}>
      <g transform={`rotate(${lean} 0 -60)`}>
        {woman ? (
          <polygon points={`-26,${-140 + hunch} 26,${-140 + hunch} 50,0 -50,0`} fill={cloth} {...S} />
        ) : (
          <>
            <rect x={-24} y={-62} width={18} height={62} fill="#2b3a55" {...S} />
            <rect x={6} y={-62} width={18} height={62} fill="#2b3a55" {...S} />
            <polygon points={`-30,${-140 + hunch} 30,${-140 + hunch} 34,-58 -34,-58`} fill={cloth} {...S} />
          </>
        )}
        {arm.map(([ax, ay], i) => (
          <g key={i}>
            <line x1={i ? 20 : -20} y1={-130 + hunch} x2={ax} y2={ay} stroke={OUT()} strokeWidth={18} strokeLinecap="round" />
            <line x1={i ? 20 : -20} y1={-130 + hunch} x2={ax} y2={ay} stroke={cloth} strokeWidth={10} strokeLinecap="round" />
            <circle cx={ax} cy={ay} r={9} fill={skin} {...S} strokeWidth={4} />
          </g>
        ))}
        {pose === 'chop' ? <path d={`M ${arm[1][0]} ${arm[1][1]} l 36 -40 l 18 14 l -10 18 z`} fill="#9aa0a6" {...S} /> : null}
        {elder ? <line x1={arm[1][0]} y1={arm[1][1]} x2={arm[1][0] + 16} y2={0} stroke="#7a5236" strokeWidth={9} {...{strokeLinecap: 'round' as const}} /> : null}
        <circle cx={0} cy={headY} r={34} fill={skin} {...S} />
        <path d={`M -36 ${headY - 2} A 36 36 0 0 1 36 ${headY - 2} L 30 ${headY - 14} L -30 ${headY - 14} Z`} fill={elder ? '#e8e8e8' : hair} {...S} strokeWidth={4} />
        {woman ? <path d={`M -34 ${headY} q -8 40 6 56 M 34 ${headY} q 8 40 -6 56`} fill="none" stroke={elder ? '#e8e8e8' : hair} strokeWidth={10} strokeLinecap="round" /> : null}
        {/* face */}
        <ellipse cx={-12} cy={headY + 2} rx={face === 'shock' ? 7 : 4.5} ry={face === 'happy' ? 2.5 : face === 'shock' ? 8 : 5} fill={INK} />
        <ellipse cx={12} cy={headY + 2} rx={face === 'shock' ? 7 : 4.5} ry={face === 'happy' ? 2.5 : face === 'shock' ? 8 : 5} fill={INK} />
        {face === 'angry' ? (
          <path d={`M -20 ${headY - 12} l 14 6 M 20 ${headY - 12} l -14 6`} stroke={INK} strokeWidth={4} />
        ) : null}
        {face === 'shock' ? (
          <ellipse cx={0} cy={headY + 20} rx={7} ry={9} fill={INK} />
        ) : face === 'sad' || face === 'angry' ? (
          <path d={`M -10 ${headY + 22} q 10 -8 20 0`} fill="none" stroke={INK} strokeWidth={4} />
        ) : (
          <path d={`M -10 ${headY + 16} q 10 10 20 0`} fill="none" stroke={INK} strokeWidth={4} />
        )}
        {elder ? <path d={`M -12 ${headY + 12} q -6 6 0 10 M 12 ${headY + 12} q 6 6 0 10`} fill="none" stroke={INK} strokeWidth={2} /> : null}
      </g>
    </g>
  );
};

// Walking stick planted in the ground.
export const Stick: React.FC<{x: number; y: number; lift?: number}> = ({x, y, lift = 0}) => (
  <g transform={`translate(${x} ${y - lift})`} filter={SH()}>
    <rect x={-7} y={-150} width={14} height={160} rx={6} fill="#7a5236" {...S} />
    <path d="M -7 -150 q -20 -10 -10 -30 q 14 -8 24 6" fill="none" stroke="#7a5236" strokeWidth={12} strokeLinecap="round" />
    <path d="M -7 -150 q -20 -10 -10 -30 q 14 -8 24 6" fill="none" stroke={OUT()} strokeWidth={3} />
  </g>
);

// Water bursting out of the ground.
export const Fountain: React.FC<{x: number; y: number; f: number; power?: number}> = ({x, y, f, power = 1}) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M -30 0 C -40 ${-200 * power} 40 ${-200 * power} 30 0 Z`} fill="#65c7f4" {...S} />
    {Array.from({length: 10}, (_, i) => {
      const q = ((f * 0.06 + i / 10) % 1);
      const a = -Math.PI / 2 + (i - 4.5) * 0.22;
      return <circle key={i} cx={Math.cos(a) * q * 260 * power} cy={-q * 200 * power + q * q * 200 * power + Math.sin(a) * q * 60} r={10 - q * 5} fill="#bfe6ff" {...S} strokeWidth={3} />;
    })}
  </g>
);

// Naga Seri Gumum: humps of a long serpent body + horned head rising out of the water line.
export const Dragon: React.FC<{x: number; water: number; s?: number; f: number; rise?: number; flip?: boolean; dim?: boolean}> = ({x, water, s = 1, f, rise = 1, flip = false, dim = false}) => {
  const body = dim ? '#1b3a4a' : '#2fa36b';
  const belly = dim ? '#24485a' : '#bfe68a';
  const segs = Array.from({length: 14}, (_, i) => {
    const t = i / 13;
    const px = -420 + t * 520;
    const py = -Math.max(0, Math.sin(t * Math.PI * 2.2 + f * 0.08)) * 90 * rise + 20;
    return [px, py, 34 - t * 6] as const;
  });
  const hy = -170 * rise + Math.sin(f * 0.1) * 8;
  return (
    <g transform={`translate(${x} ${water}) scale(${flip ? -s : s} ${s})`} filter={SH()}>
      <clipPath id={`above-${x}`}>
        <rect x={-600} y={-600} width={1400} height={600} />
      </clipPath>
      <g clipPath={`url(#above-${x})`}>
        {segs.map(([px, py, r], i) => (
          <g key={i}>
            <circle cx={px} cy={py} r={r} fill={body} {...S} />
            <path d={`M ${px - r * 0.6} ${py - r * 0.2} q ${r * 0.6} ${-r * 0.5} ${r * 1.2} 0`} fill="none" stroke={belly} strokeWidth={5} />
          </g>
        ))}
        {/* neck + head */}
        <path d={`M 90 20 C 110 ${hy + 120} 150 ${hy + 60} 160 ${hy + 20}`} fill="none" stroke={OUT()} strokeWidth={66} strokeLinecap="round" />
        <path d={`M 90 20 C 110 ${hy + 120} 150 ${hy + 60} 160 ${hy + 20}`} fill="none" stroke={body} strokeWidth={54} strokeLinecap="round" />
        <g transform={`translate(170 ${hy})`}>
          <polygon points="-40,10 60,-6 96,18 60,40 -30,46" fill={body} {...S} />
          <polygon points="-20,-6 -46,-60 -6,-14" fill="#ffd23f" {...S} />
          <polygon points="10,-10 0,-66 30,-14" fill="#ffd23f" {...S} />
          <circle cx={30} cy={10} r={11} fill="#fff" {...S} strokeWidth={4} />
          <circle cx={33} cy={10} r={5} fill={dim ? '#ffdd55' : INK} />
          <path d={`M 90 22 q 40 ${10 + Math.sin(f * 0.15) * 10} 70 -10 M 86 30 q 30 ${30 + Math.sin(f * 0.15) * 10} 64 20`} fill="none" stroke={INK} strokeWidth={4} />
          <path d="M 60 34 l 30 -4" stroke={INK} strokeWidth={4} />
        </g>
      </g>
      {/* splash rings at the water line */}
      {[-300, -120, 90].map((px, i) => (
        <ellipse key={i} cx={px} cy={22} rx={60 + (f % 20) * 2} ry={12} fill="none" stroke="#bfe6ff" strokeWidth={5} opacity={1 - (f % 20) / 20} />
      ))}
    </g>
  );
};

// Stylised map of 12 linked water bodies (not to scale).
export const TwelveLakes: React.FC<{cx: number; cy: number; f: number; s?: number}> = ({cx, cy, f, s = 1}) => {
  const spots: [number, number, number][] = [
    [-160, -90, 40], [-90, -120, 34], [-20, -80, 46], [60, -110, 36], [130, -60, 42], [180, 20, 34],
    [110, 70, 44], [30, 40, 38], [-50, 80, 42], [-130, 40, 36], [-190, 0, 30], [0, 0, 30],
  ];
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      {spots.map(([x, y, r], i) => {
        const on = f >= i * 3;
        const next = spots[(i + 1) % spots.length];
        return (
          <g key={i} opacity={on ? 1 : 0}>
            {i < spots.length - 1 ? <line x1={x} y1={y} x2={next[0]} y2={next[1]} stroke="#2b7fc4" strokeWidth={14} /> : null}
            <ellipse cx={x} cy={y} rx={r} ry={r * 0.7} fill="#65c7f4" {...S} />
            <text x={x} y={y + 10} textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={26} fill={INK}>
              {i + 1}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// Generic recognition badge (no logos): year + label.
export const Badge: React.FC<{x: number; y: number; year: string; label: string; f: number}> = ({x, y, year, label, f}) => (
  <g transform={`translate(${x} ${y}) rotate(${Math.sin(f / 20) * 3}) scale(${Math.min(1, f / 8)})`} filter={SH()}>
    {Array.from({length: 16}, (_, i) => {
      const a = (i / 16) * Math.PI * 2;
      return <circle key={i} cx={Math.cos(a) * 110} cy={Math.sin(a) * 110} r={22} fill="#36a86b" {...S} />;
    })}
    <circle r={108} fill="#36a86b" {...S} />
    <circle r={84} fill="#fff" {...S} />
    <text y={-6} textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={58} fill={INK}>
      {year}
    </text>
    <text y={34} textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={20} fill="#2f6b4a">
      {label}
    </text>
  </g>
);

// Silhouetted ancient city under water (legend only).
export const SunkenCity: React.FC<{x: number; y: number; s?: number; f: number}> = ({x, y, s = 1, f}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={0.75}>
    {[-200, 0, 200].map((px, i) => (
      <g key={i} transform={`translate(${px} 0)`}>
        <polygon points={`-90,0 90,0 70,-50 50,-50 40,-100 20,-100 10,-${170 + i * 20} -10,-${170 + i * 20} -20,-100 -40,-100 -50,-50 -70,-50`} fill="#1b3a4a" stroke="#0e2230" strokeWidth={5} />
      </g>
    ))}
    {Array.from({length: 8}, (_, i) => {
      const q = ((f * 0.02 + i / 8) % 1);
      return <circle key={i} cx={-220 + i * 60} cy={-q * 300} r={6 + (i % 3) * 3} fill="none" stroke="#bfe6ff" strokeWidth={3} opacity={1 - q} />;
    })}
  </g>
);

export const Stump: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter={SH()}>
    <polygon points="-34,0 34,0 26,-40 -26,-40" fill="#8a5a34" {...S} />
    <ellipse cx={0} cy={-40} rx={26} ry={9} fill="#d9b48a" {...S} />
  </g>
);

export const Fish: React.FC<{x: number; y: number; f: number; c?: string}> = ({x, y, f, c = '#f4a51c'}) => (
  <g transform={`translate(${x + Math.sin(f / 10) * 20} ${y})`} filter={SH()}>
    <ellipse cx={0} cy={0} rx={34} ry={16} fill={c} {...S} />
    <polygon points="30,0 56,-16 56,16" fill={c} {...S} />
    <circle cx={-16} cy={-4} r={4} fill={INK} />
  </g>
);

export const Fog: React.FC<{w: number; y: number; f: number}> = ({w, y, f}) => (
  <g opacity={0.55}>
    {Array.from({length: 5}, (_, i) => (
      <ellipse key={i} cx={((i * 260 + f * 1.2) % (w + 300)) - 150} cy={y + (i % 2) * 40} rx={200} ry={34} fill="#ffffff" />
    ))}
  </g>
);

export const QMark: React.FC<{x: number; y: number; f: number; size?: number}> = ({x, y, f, size = 90}) => (
  <text x={x} y={y + Math.sin(f / 8) * 8} textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={size} fill="#ffd23f" stroke={OUT()} strokeWidth={size * 0.08} paintOrder="stroke">
    ?
  </text>
);
