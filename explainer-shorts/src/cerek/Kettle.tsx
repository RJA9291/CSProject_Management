// Bright, friendly technical illustration of an electric kettle on its power base.
// Local coords: centre-bottom of the base at (0, 0), about 560 wide and 560 tall.
import React from 'react';
import {B} from './theme';

export type KettleProps = {
  f: number;
  xray?: number; // 0 solid, 1 see-through
  heat?: number; // element glow 0..1
  water?: number; // 0..1 fill level (0.85 = MAX mark)
  boil?: number; // bubble intensity
  steam?: number; // steam from the spout
  convection?: number; // circulation arrows
  on?: boolean; // switch lamp
  bend?: number; // bimetal bend 0..1
  tubeSteam?: number; // steam moving through the tube to the sensor
  scale?: number; // 0..1 limescale on the element
  lift?: number; // lifts the kettle off its base (anatomy)
};

const BODY = 'M -190 -60 Q -196 -300 -150 -470 Q -148 -486 -130 -488 L 130 -488 Q 148 -486 150 -470 Q 196 -300 190 -60 Q 186 -46 170 -46 L -170 -46 Q -186 -46 -190 -60 Z';

export const Kettle: React.FC<KettleProps> = ({f, xray = 0, heat = 0, water = 0, boil = 0, steam = 0, convection = 0, on = false, bend = 0, tubeSteam = 0, scale = 0, lift = 0}) => {
  const glow = heat * (0.85 + Math.sin(f / 5) * 0.15);
  const top = -60 - water * 420; // water surface y
  const bodyO = 1 - xray * 0.78;
  return (
    <g>
      <defs>
        <linearGradient id="kt-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#14b8a6" />
          <stop offset="0.35" stopColor="#5eead4" />
          <stop offset="0.75" stopColor="#2dd4bf" />
          <stop offset="1" stopColor="#0f9488" />
        </linearGradient>
        <linearGradient id="kt-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
        <radialGradient id="kt-heat" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff3b0" />
          <stop offset="0.5" stopColor="#ff8a3d" />
          <stop offset="1" stopColor="#ff6b5b" stopOpacity="0" />
        </radialGradient>
        <clipPath id="kt-clip">
          <path d={BODY} />
        </clipPath>
        <filter id="kt-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="kt-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      {/* soft floor shadow */}
      <ellipse cx={0} cy={8} rx={290} ry={24} fill="#c76b4f" opacity={0.18} filter="url(#kt-soft)" />

      {/* power base */}
      <rect x={-230} y={-44} width={460} height={44} rx={22} fill="#ffffff" stroke="#f3c9b8" strokeWidth={3} />
      <rect x={-60} y={-52} width={120} height={14} rx={7} fill="#e2e8f0" />
      <circle cx={-170} cy={-22} r={8} fill={on ? B.coral : '#e2e8f0'} />
      {on ? <circle cx={-170} cy={-22} r={20} fill={B.coral} opacity={0.4} filter="url(#kt-soft)" /> : null}
      <path d="M 230 -22 q 60 0 80 30" fill="none" stroke="#94a3b8" strokeWidth={10} strokeLinecap="round" />

      <g transform={`translate(0 ${-lift})`}>
        {/* handle */}
        <path d="M 160 -440 Q 300 -440 300 -300 L 300 -150 Q 300 -96 210 -96" fill="none" stroke="#0f766e" strokeWidth={56} strokeLinecap="round" opacity={bodyO * 0.9 + 0.1} />
        <path d="M 160 -440 Q 300 -440 300 -300 L 300 -150 Q 300 -96 210 -96" fill="none" stroke="#2dd4bf" strokeWidth={34} strokeLinecap="round" opacity={bodyO * 0.9 + 0.1} />

        {/* spout */}
        <path d="M -150 -460 L -250 -510 L -262 -486 L -170 -420 Z" fill="url(#kt-body)" opacity={bodyO * 0.9 + 0.1} />

        {/* body */}
        <path d={BODY} fill="url(#kt-body)" opacity={bodyO} />

        {/* inside (visible with x-ray, water also through the window) */}
        <g clipPath="url(#kt-clip)">
          <g opacity={Math.max(xray, 0)}>
            <rect x={-200} y={-500} width={400} height={460} fill="#ecfeff" opacity={0.55} />
          </g>
          {water > 0 ? (
            <g opacity={0.35 + xray * 0.65}>
              <rect x={-200} y={top} width={400} height={-60 - top + 20} fill="url(#kt-water)" opacity={0.85} />
              <path d={`M -200 ${top} q 50 ${-8 - boil * 10 * Math.sin(f / 3)} 100 0 t 100 0 t 100 0 t 100 0`} fill="none" stroke="#e0f2fe" strokeWidth={4} />
            </g>
          ) : null}
          {/* element plate */}
          <g opacity={Math.max(xray, 0.0)}>
            <rect x={-170} y={-74} width={340} height={20} rx={8} fill={glow > 0.05 ? '#fb923c' : '#94a3b8'} />
            <ellipse cx={0} cy={-64} rx={220} ry={50} fill="url(#kt-heat)" opacity={glow} filter="url(#kt-blur)" />
            {scale > 0
              ? Array.from({length: 18}, (_, k) => <circle key={k} cx={-160 + k * 19} cy={-78 - ((k * 7) % 10)} r={5 + (k % 3) * 3} fill="#f8fafc" stroke="#cbd5e1" strokeWidth={2} opacity={scale} />)
              : null}
          </g>
          {/* bubbles */}
          {boil > 0 && water > 0
            ? Array.from({length: 18}, (_, k) => {
                const t = ((f * (1.4 + (k % 3) * 0.5) + k * 19) % 60) / 60;
                return <circle key={k} cx={-160 + ((k * 53) % 320)} cy={-80 - t * (-80 - top)} r={4 + (k % 3) * 3} fill="#ffffff" opacity={boil * (1 - t) * 0.9} />;
              })
            : null}
          {/* convection loops */}
          {convection > 0 && water > 0
            ? [-1, 1].map((side) => (
                <g key={side} opacity={convection}>
                  <ellipse cx={side * 85} cy={(top - 70) / 2} rx={70} ry={Math.max(30, (-70 - top) / 2 - 20)} fill="none" stroke={B.coral} strokeWidth={6} strokeDasharray="22 16" strokeDashoffset={side * f * 3} />
                  <ellipse cx={side * 85} cy={(top - 70) / 2} rx={70} ry={Math.max(30, (-70 - top) / 2 - 20)} fill="none" stroke={B.sky} strokeWidth={6} strokeDasharray="22 16" strokeDashoffset={side * f * 3 + 19} opacity={0.9} />
                </g>
              ))
            : null}
        </g>

        {/* steam tube + bimetal sensor (x-ray) */}
        <g opacity={xray}>
          <path d="M 120 -470 Q 250 -470 262 -360 L 262 -200" fill="none" stroke="#ffffff" strokeWidth={14} strokeLinecap="round" />
          <path d="M 120 -470 Q 250 -470 262 -360 L 262 -200" fill="none" stroke={B.purple} strokeWidth={6} strokeLinecap="round" strokeDasharray="4 10" />
          {tubeSteam > 0
            ? Array.from({length: 5}, (_, k) => {
                const t = ((f * 2 + k * 18) % 90) / 90;
                const y = -470 + t * 270;
                const x = t < 0.4 ? 120 + (t / 0.4) * 142 : 262;
                return <circle key={k} cx={x} cy={y} r={9} fill="#ffffff" opacity={tubeSteam * 0.9} />;
              })
            : null}
          <g transform="translate(262 -180)">
            <path d={`M -34 0 Q 0 ${-bend * 26} 34 0`} fill="none" stroke="#f59e0b" strokeWidth={8} />
            <path d={`M -34 8 Q 0 ${8 - bend * 26} 34 8`} fill="none" stroke="#94a3b8" strokeWidth={8} />
          </g>
        </g>

        {/* water window with MIN / MAX */}
        <g opacity={1 - xray * 0.6}>
          <rect x={-140} y={-440} width={44} height={370} rx={22} fill="#e0f2fe" stroke="#ffffff" strokeWidth={4} />
          {water > 0 ? <rect x={-136} y={Math.max(-436, top)} width={36} height={Math.min(362, -74 - Math.max(-436, top))} rx={18} fill="url(#kt-water)" /> : null}
          <line x1={-96} y1={-417} x2={-76} y2={-417} stroke="#0f766e" strokeWidth={4} />
          <text x={-70} y={-410} fontFamily={B.font} fontWeight={700} fontSize={18} fill="#0f766e">
            MAX
          </text>
          <line x1={-96} y1={-150} x2={-76} y2={-150} stroke="#0f766e" strokeWidth={4} />
          <text x={-70} y={-143} fontFamily={B.font} fontWeight={700} fontSize={18} fill="#0f766e">
            MIN
          </text>
        </g>

        {/* lid */}
        <path d="M -140 -488 Q 0 -540 140 -488 Z" fill="#ffffff" stroke="#f3c9b8" strokeWidth={3} />
        <rect x={-46} y={-534} width={92} height={22} rx={11} fill={B.yellow} />

        {/* switch at the bottom of the handle */}
        <rect x={276} y={-170} width={44} height={60} rx={12} fill={on ? B.coral : '#ffffff'} stroke="#0f766e" strokeWidth={4} transform={`rotate(${on ? -10 : 10} 298 -140)`} />
        {on ? <circle cx={298} cy={-140} r={38} fill={B.coral} opacity={0.35} filter="url(#kt-soft)" /> : null}

        {/* steam from the spout */}
        {steam > 0
          ? Array.from({length: 7}, (_, k) => {
              const t = ((f + k * 13) % 90) / 90;
              return <circle key={k} cx={-262 - t * 60 + Math.sin(t * 6 + k) * 20} cy={-500 - t * 260} r={14 + t * 40} fill="#ffffff" opacity={steam * (1 - t) * 0.75} filter="url(#kt-soft)" />;
            })
          : null}
      </g>
    </g>
  );
};
