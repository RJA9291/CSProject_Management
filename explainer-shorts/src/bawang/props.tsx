// Extra storybook props for Bawang Merah Bawang Putih. Same paper/comic look as the Tasik Chini art.
import React from 'react';
import {S} from '../chini/art';
import {INK} from '../chini/comic';
import {OUT, SH} from '../chini/look';

export const Crown: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter={SH()}>
    <polygon points="-34,0 34,0 40,-40 18,-18 0,-46 -18,-18 -40,-40" fill="#ffd23f" {...S} />
    <circle cx={0} cy={-14} r={6} fill="#e0483a" />
  </g>
);

export const Broom: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => (
  <g transform={`translate(${x} ${y}) rotate(${-20 + Math.sin(f / 3) * 14})`} filter={SH()}>
    <line x1={0} y1={-170} x2={0} y2={-30} stroke="#7a5236" strokeWidth={10} strokeLinecap="round" />
    <polygon points="-26,0 26,0 12,-36 -12,-36" fill="#e6c36a" {...S} />
  </g>
);

export const Basket: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter={SH()}>
    <path d="M -60 -70 q 0 -40 60 -40 q 60 0 60 40" fill="none" stroke="#e8d6a8" strokeWidth={10} />
    <rect x={-26} y={-96} width={30} height={30} fill="#7ab8e8" {...S} strokeWidth={3} />
    <rect x={2} y={-92} width={30} height={26} fill="#f2a0b0" {...S} strokeWidth={3} />
    <polygon points="-64,-70 64,-70 50,0 -50,0" fill="#c9a06a" {...S} />
    {[-40, -14, 12, 38].map((lx) => (
      <line key={lx} x1={lx} y1={-64} x2={lx * 0.9} y2={-6} stroke="#9a7444" strokeWidth={4} />
    ))}
  </g>
);

export const Mirror: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => (
  <g transform={`translate(${x} ${y})`} filter={SH()}>
    <line x1={0} y1={0} x2={0} y2={70} stroke="#7a5236" strokeWidth={14} strokeLinecap="round" />
    <ellipse cx={0} cy={-40} rx={46} ry={56} fill="#cfe8ff" {...S} />
    <path d={`M -20 ${-70 + (f % 30)} l 24 -18`} stroke="#ffffff" strokeWidth={8} strokeLinecap="round" />
  </g>
);

export const Heart: React.FC<{x: number; y: number; s?: number; f?: number; c?: string}> = ({x, y, s = 1, f = 0, c = '#e0483a'}) => (
  <g transform={`translate(${x} ${y + Math.sin(f / 8) * 6}) scale(${s * (1 + Math.sin(f / 6) * 0.05)})`} filter={SH()}>
    <path d="M 0 -20 c -20 -40 -80 -20 -60 20 l 60 50 l 60 -50 c 20 -40 -40 -60 -60 -20 z" fill={c} {...S} />
  </g>
);

export const Notes: React.FC<{x: number; y: number; f: number}> = ({x, y, f}) => (
  <g>
    {[0, 1, 2].map((k) => {
      const t = ((f + k * 20) % 60) / 60;
      return (
        <text key={k} x={x + k * 50 + Math.sin(t * 6) * 14} y={y - t * 120} fontSize={64} fontWeight={900} fill="#4a3320" opacity={1 - t} stroke="#ffffff" strokeWidth={5} paintOrder="stroke">
          {k % 2 ? '♫' : '♪'}
        </text>
      );
    })}
  </g>
);

export const Flames: React.FC<{x: number; y: number; f: number; s?: number}> = ({x, y, f, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter={SH()}>
    {[-40, 0, 40].map((fx, k) => (
      <path key={fx} d={`M ${fx - 22} 0 q 0 ${-60 - Math.sin(f / 2 + k) * 16} 22 ${-90 - Math.sin(f / 2 + k) * 20} q 22 30 22 90 z`} fill={k === 1 ? '#ffd23f' : '#ff7a3a'} {...S} />
    ))}
  </g>
);

// A grave-free, gentle "gone" marker: a flower on the ground.
export const Flower: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = '#f2a0b0'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter={SH()}>
    <line x1={0} y1={0} x2={0} y2={-70} stroke="#3f8a4c" strokeWidth={8} />
    {[0, 72, 144, 216, 288].map((a) => (
      <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 18} cy={-80 + Math.sin((a * Math.PI) / 180) * 18} r={14} fill={c} {...S} strokeWidth={3} />
    ))}
    <circle cx={0} cy={-80} r={10} fill="#ffd23f" />
  </g>
);

export const Bundle: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`} filter={SH()}>
    <line x1={-60} y1={40} x2={40} y2={-40} stroke="#7a5236" strokeWidth={8} />
    <circle cx={40} cy={-50} r={34} fill="#d9b48a" {...S} />
  </g>
);

export const Plate: React.FC<{x: number; y: number; bones?: boolean}> = ({x, y, bones}) => (
  <g transform={`translate(${x} ${y})`} filter={SH()}>
    <ellipse cx={0} cy={0} rx={120} ry={36} fill="#ffffff" {...S} />
    {bones ? (
      <g stroke="#e8e0d0" strokeWidth={6}>
        <line x1={-60} y1={-6} x2={60} y2={-6} stroke={OUT()} strokeWidth={10} />
        <line x1={-60} y1={-6} x2={60} y2={-6} />
        {[-40, -20, 0, 20, 40].map((bx) => (
          <line key={bx} x1={bx} y1={-24} x2={bx} y2={12} />
        ))}
        <polygon points="60,-6 84,-22 84,10" fill="#e8e0d0" />
      </g>
    ) : (
      <ellipse cx={0} cy={-10} rx={70} ry={20} fill="#c97a3a" {...S} />
    )}
  </g>
);

export const Mound: React.FC<{x: number; y: number; sprout?: number}> = ({x, y, sprout = 0}) => (
  <g transform={`translate(${x} ${y})`} filter={SH()}>
    <path d="M -110 0 q 110 -80 220 0 z" fill="#8a5a34" {...S} />
    {sprout > 0 ? (
      <g transform={`scale(${sprout})`}>
        <line x1={0} y1={-40} x2={0} y2={-110} stroke="#3f8a4c" strokeWidth={8} />
        <ellipse cx={-22} cy={-100} rx={22} ry={10} fill="#5fb85a" {...S} strokeWidth={3} />
        <ellipse cx={22} cy={-112} rx={22} ry={10} fill="#5fb85a" {...S} strokeWidth={3} />
      </g>
    ) : null}
  </g>
);

// Big magical tree with a swing. grow 0..1 scales the tree in; swing angle in degrees.
export const SwingTree: React.FC<{x: number; y: number; s?: number; grow?: number; angle?: number; children?: React.ReactNode}> = ({x, y, s = 1, grow = 1, angle = 0, children}) => (
  <g transform={`translate(${x} ${y}) scale(${s * grow})`}>
    <g filter={SH()}>
      <path d="M -40 0 q 10 -200 -10 -380 l 60 0 q -20 180 30 380 z" fill="#7a5236" {...S} />
      <path d="M 0 -340 q 120 -20 260 -10" fill="none" stroke={OUT()} strokeWidth={42} strokeLinecap="round" />
      <path d="M 0 -340 q 120 -20 260 -10" fill="none" stroke="#7a5236" strokeWidth={30} strokeLinecap="round" />
      {[
        [-60, -470, 130],
        [100, -500, 140],
        [250, -440, 120],
        [20, -560, 110],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}`} cx={cx} cy={cy} r={r} fill="#4f9a52" {...S} />
      ))}
      {[
        [-80, -470],
        [120, -520],
        [260, -430],
        [40, -590],
        [180, -440],
      ].map(([cx, cy]) => (
        <circle key={`f${cx}`} cx={cx} cy={cy} r={12} fill="#f2a0b0" />
      ))}
    </g>
    <g transform={`translate(180 -345) rotate(${angle})`}>
      <line x1={-50} y1={0} x2={-50} y2={250} stroke="#e8d6a8" strokeWidth={6} />
      <line x1={50} y1={0} x2={50} y2={250} stroke="#e8d6a8" strokeWidth={6} />
      <rect x={-70} y={244} width={140} height={20} rx={6} fill="#c97a3a" {...S} />
      <g transform="translate(0 250)">{children}</g>
    </g>
  </g>
);

export const Palace: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter={SH()}>
    <rect x={-260} y={-220} width={520} height={220} fill="#f6e2b0" {...S} />
    <polygon points="-300,-220 300,-220 200,-330 -200,-330" fill="#c0504d" {...S} />
    <polygon points="-140,-330 140,-330 60,-420 -60,-420" fill="#c0504d" {...S} />
    <circle cx={0} cy={-436} r={16} fill="#ffd23f" {...S} />
    <rect x={-40} y={-120} width={80} height={120} rx={40} fill="#7a5236" {...S} />
    {[-190, -110, 110, 190].map((wx) => (
      <rect key={wx} x={wx - 22} y={-170} width={44} height={60} rx={20} fill="#3b4a8a" {...S} />
    ))}
  </g>
);

export const Stamp: React.FC<{x: number; y: number; text: string; f: number; c?: string}> = ({x, y, text, f, c = '#e0483a'}) =>
  f < 0 ? null : (
    <g transform={`translate(${x} ${y}) rotate(-12) scale(${Math.max(1, 1.6 - f * 0.1)})`} opacity={Math.min(1, f / 3)}>
      <rect x={-text.length * 22 - 30} y={-60} width={text.length * 44 + 60} height={120} rx={10} fill="#ffffff" fillOpacity={0.6} stroke={c} strokeWidth={12} />
      <text textAnchor="middle" y={22} fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={64} fill={c}>
        {text}
      </text>
    </g>
  );

export {INK};
