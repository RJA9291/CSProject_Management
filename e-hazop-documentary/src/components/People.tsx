// Stylised engineers (with PPE) and a top-down HAZOP review meeting.
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, F} from '../theme';

type Pose = 'tablet' | 'point' | 'stand';

/**
 * Front-facing engineer silhouette with hard hat and high-visibility vest.
 * Lit as a dark figure so it sits in the documentary palette.
 */
export const Engineer: React.FC<{x: number; y: number; s?: number; hat?: string; pose?: Pose; skin?: string; seed?: number; rim?: string}> = ({
  x,
  y,
  s = 1,
  hat = '#f2f4f7',
  pose = 'stand',
  skin = '#8a5a3c',
  seed = 0,
  rim = C.blueLight,
}) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 40 + seed) * 2;
  return (
    <g transform={`translate(${x} ${y + sway}) scale(${s})`}>
      {/* legs */}
      <rect x={-34} y={-180} width={30} height={180} rx={10} fill="#1b2433" />
      <rect x={4} y={-180} width={30} height={180} rx={10} fill="#1b2433" />
      <rect x={-40} y={-10} width={38} height={14} rx={5} fill="#0c0f14" />
      <rect x={2} y={-10} width={38} height={14} rx={5} fill="#0c0f14" />
      {/* torso: coverall + hi-vis vest */}
      <path d="M-58 -190 L-50 -330 Q0 -350 50 -330 L58 -190 Z" fill="#22406a" />
      <path d="M-54 -200 L-46 -322 Q-20 -334 -10 -334 L-10 -200 Z" fill="#ff8a1f" />
      <path d="M54 -200 L46 -322 Q20 -334 10 -334 L10 -200 Z" fill="#ff8a1f" />
      <rect x={-52} y={-262} width={42} height={8} fill="#e8edf3" opacity={0.9} />
      <rect x={10} y={-262} width={42} height={8} fill="#e8edf3" opacity={0.9} />
      <rect x={-52} y={-232} width={42} height={8} fill="#e8edf3" opacity={0.9} />
      <rect x={10} y={-232} width={42} height={8} fill="#e8edf3" opacity={0.9} />
      {/* arms */}
      {pose === 'point' ? (
        <>
          <path d="M-50 -320 L-70 -220 L-58 -214 L-40 -300 Z" fill="#22406a" />
          <path d="M50 -320 L130 -350 L134 -336 L56 -300 Z" fill="#22406a" />
          <circle cx={138} cy={-344} r={9} fill={skin} />
        </>
      ) : pose === 'tablet' ? (
        <>
          <path d="M-50 -320 L-60 -240 L-20 -232 L-14 -246 L-44 -252 L-38 -310 Z" fill="#22406a" />
          <path d="M50 -320 L60 -240 L20 -232 L14 -246 L44 -252 L38 -310 Z" fill="#22406a" />
          <rect x={-34} y={-268} width={68} height={46} rx={4} fill="#0d1622" stroke="#3a4a5e" strokeWidth={2} />
          <rect x={-28} y={-262} width={56} height={34} fill="#2e7fd9" opacity={0.6} />
        </>
      ) : (
        <>
          <path d="M-50 -320 L-66 -200 L-52 -196 L-38 -300 Z" fill="#22406a" />
          <path d="M50 -320 L66 -200 L52 -196 L38 -300 Z" fill="#22406a" />
        </>
      )}
      {/* head */}
      <rect x={-12} y={-356} width={24} height={20} fill={skin} />
      <ellipse cx={0} cy={-392} rx={34} ry={40} fill={skin} />
      {/* safety glasses */}
      <rect x={-28} y={-400} width={56} height={12} rx={5} fill="#0e1622" opacity={0.85} />
      {/* hard hat */}
      <path d="M-40 -408 Q-38 -456 0 -460 Q38 -456 40 -408 Z" fill={hat} />
      <rect x={-48} y={-412} width={96} height={9} rx={4} fill={hat} />
      <rect x={-4} y={-458} width={8} height={46} fill="#000" opacity={0.08} />
      {/* rim light */}
      <path d="M40 -408 Q38 -456 0 -460" stroke={rim} strokeWidth={2} fill="none" opacity={0.6} />
      <path d="M58 -190 L50 -330" stroke={rim} strokeWidth={2} opacity={0.4} />
    </g>
  );
};

/** Top-down view of an engineering team reviewing a single-line diagram. */
export const MeetingTopDown: React.FC<{focus?: number; labels?: boolean}> = ({focus = 0, labels = false}) => {
  const frame = useCurrentFrame();
  const people = [
    {x: 560, y: 330, a: 90, c: '#2f4f7a', role: 'Electrical'},
    {x: 960, y: 280, a: 90, c: '#5a4632', role: 'Facilitator'},
    {x: 1360, y: 330, a: 90, c: '#2f5a4a', role: 'Operations'},
    {x: 560, y: 760, a: -90, c: '#4a3a5a', role: 'Maintenance'},
    {x: 960, y: 810, a: -90, c: '#3a4a5a', role: 'Protection'},
    {x: 1360, y: 760, a: -90, c: '#5a3a3a', role: 'Scribe'},
  ];
  return (
    <svg width="1920" height="1080" style={{position: 'absolute'}}>
      <defs>
        <radialGradient id="tablelight" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1920" height="1080" fill="#0b1018" />
      {/* table */}
      <rect x={380} y={380} width={1160} height={330} rx={40} fill="#2a2420" />
      <rect x={380} y={380} width={1160} height={330} rx={40} fill="url(#tablelight)" />
      {/* drawing sheet with SLD */}
      <g transform="translate(760 420)">
        <rect width={400} height={250} fill="#e9eef4" />
        <rect x={6} y={6} width={388} height={238} fill="none" stroke="#9aa6b5" />
        <g stroke="#1d3c66" strokeWidth={2.5} fill="none">
          <line x1={200} y1={20} x2={200} y2={60} />
          <circle cx={190} cy={75} r={15} />
          <circle cx={210} cy={75} r={15} />
          <line x1={200} y1={90} x2={200} y2={120} />
          <line x1={60} y1={120} x2={340} y2={120} strokeWidth={5} />
          {[90, 160, 240, 310].map((fx) => (
            <g key={fx}>
              <line x1={fx} y1={120} x2={fx} y2={200} />
              <rect x={fx - 8} y={145} width={16} height={16} />
            </g>
          ))}
          {/* highlighted node boundary */}
          <rect x={150} y={40} width={100} height={70} strokeDasharray="6 5" stroke={C.red} opacity={focus} strokeWidth={3} />
        </g>
        <text x={360} y={238} fontFamily="Inter" fontSize={10} fill="#5a6676">SLD-001</text>
      </g>
      {/* laptops, pens, mugs */}
      <rect x={470} y={470} width={150} height={100} rx={6} fill="#151b24" />
      <rect x={480} y={478} width={130} height={84} fill="#1e4b80" opacity={0.7} />
      <rect x={1300} y={470} width={150} height={100} rx={6} fill="#151b24" />
      <rect x={1310} y={478} width={130} height={84} fill="#1e4b80" opacity={0.7} />
      <circle cx={700} cy={640} r={18} fill="#d9d2c8" />
      <circle cx={700} cy={640} r={12} fill="#3b2416" />
      <circle cx={1220} cy={450} r={18} fill="#d9d2c8" />
      <circle cx={1220} cy={450} r={12} fill="#3b2416" />
      <rect x={880} y={690} width={120} height={8} rx={4} fill="#c23b3b" transform="rotate(-14 940 694)" />
      {/* people (top-down) */}
      {people.map((p, i) => {
        const bob = Math.sin(frame / 30 + i * 1.7) * 3;
        const lean = i === 1 || i === 4 ? Math.sin(frame / 45 + i) * 6 : 0;
        return (
          <g key={i} transform={`translate(${p.x} ${p.y + bob + (p.a > 0 ? lean : -lean)})`}>
            <ellipse cx={0} cy={0} rx={95} ry={52} fill={p.c} />
            <ellipse cx={0} cy={0} rx={95} ry={52} fill="none" stroke="#000" strokeOpacity={0.25} strokeWidth={6} />
            <circle cx={0} cy={p.a > 0 ? 6 : -6} r={34} fill="#1a120c" />
            {/* arms reaching to the table */}
            <path d={`M-70 ${p.a > 0 ? 20 : -20} L-55 ${p.a > 0 ? 85 : -85}`} stroke={p.c} strokeWidth={22} strokeLinecap="round" />
            <path d={`M70 ${p.a > 0 ? 20 : -20} L55 ${p.a > 0 ? 85 : -85}`} stroke={p.c} strokeWidth={22} strokeLinecap="round" />
            {labels && (
              <text x={0} y={p.a > 0 ? -72 : 92} textAnchor="middle" fontFamily={F.sans} fontWeight={600} fontSize={22} fill="#c9d6e6">
                {p.role}
              </text>
            )}
          </g>
        );
      })}
      {/* pointer hand on the drawing */}
      <circle cx={960 + Math.sin(frame / 25) * 30} cy={470 + Math.cos(frame / 30) * 12} r={13} fill="#8a5a3c" opacity={0.95} />
    </svg>
  );
};
