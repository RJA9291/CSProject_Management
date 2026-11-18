// Technical illustration of a conventional electric rice cooker (local coords: centre-bottom at 0,0, ~560 wide).
import React from 'react';
import {D} from './theme';

export type CookerProps = {
  xray?: number; // 0 = solid body, 1 = see-through cutaway
  explode?: number; // 0..1 lifts lid and inner pot apart
  heat?: number; // 0..1 heating plate glow
  water?: number; // 0..1 water level in the inner pot
  rice?: number; // 0..1 rice level
  bubbles?: number; // 0..1 boiling intensity
  steam?: number; // 0..1 steam from the vent
  warm?: boolean; // lamp state
  lever?: number; // 0 = up (warm), 1 = pressed down (cook)
  magnetGap?: number; // px gap between magnet and pot base (thermostat released)
  f: number;
};

export const Cooker: React.FC<CookerProps> = ({xray = 0, explode = 0, heat = 0, water = 0, rice = 0, bubbles = 0, steam = 0, warm = false, lever = 1, magnetGap = 0, f}) => {
  const lidLift = explode * 300;
  const potLift = explode * 150;
  const bodyOpacity = 1 - xray * 0.82;
  const glow = heat * (0.85 + Math.sin(f / 5) * 0.15);
  return (
    <g>
      <defs>
        <linearGradient id="ck-body" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#b9c6d6" />
          <stop offset="0.35" stopColor="#f3f6fa" />
          <stop offset="0.7" stopColor="#dbe4ee" />
          <stop offset="1" stopColor="#8d9aae" />
        </linearGradient>
        <linearGradient id="ck-pot" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6b7686" />
          <stop offset="0.4" stopColor="#c9d2dc" />
          <stop offset="1" stopColor="#566173" />
        </linearGradient>
        <radialGradient id="ck-heat" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffdd88" />
          <stop offset="0.5" stopColor="#ff7a2a" />
          <stop offset="1" stopColor="#ff4b4b" stopOpacity="0" />
        </radialGradient>
        <filter id="ck-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id="ck-soft" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* floor shadow */}
      <ellipse cx={0} cy={6} rx={300} ry={26} fill="#000" opacity={0.45} filter="url(#ck-soft)" />

      {/* heating plate + thermostat (inside, visible with x-ray) */}
      <g opacity={Math.max(xray, explode)}>
        <ellipse cx={0} cy={-78} rx={200} ry={34} fill="#3a1a12" stroke="#ff7a2a" strokeOpacity={0.4 + glow * 0.6} strokeWidth={4} />
        <ellipse cx={0} cy={-78} rx={240} ry={70} fill="url(#ck-heat)" opacity={glow} filter="url(#ck-blur)" />
        {[150, 110, 70].map((r) => (
          <ellipse key={r} cx={0} cy={-78} rx={r} ry={r * 0.17} fill="none" stroke={glow > 0.05 ? '#ffb238' : '#7a4a30'} strokeOpacity={0.4 + glow * 0.6} strokeWidth={6} />
        ))}
        {/* thermostat: spring + magnet in the centre of the plate */}
        <g transform={`translate(0 ${-92 + magnetGap})`}>
          <path d="M -14 40 l 28 -8 l -28 -8 l 28 -8 l -28 -8 l 28 -8" fill="none" stroke="#8d9aae" strokeWidth={5} />
          <rect x={-26} y={-14} width={52} height={22} rx={5} fill="#d64550" stroke="#ffffff" strokeOpacity={0.6} strokeWidth={2} />
          <rect x={-26} y={-14} width={26} height={22} rx={5} fill="#2e7fd9" />
        </g>
        {/* linkage to the lever */}
        <path d={`M 0 -40 L 0 -20 L 200 -20 L 200 ${-40 + lever * 14}`} fill="none" stroke="#6fb2ff" strokeOpacity={0.55} strokeWidth={4} strokeDasharray="10 8" />
      </g>

      {/* inner pot */}
      <g transform={`translate(0 ${-potLift})`} opacity={Math.max(xray, explode)}>
        <path d="M -200 -330 L -200 -110 Q -200 -92 -180 -92 L 180 -92 Q 200 -92 200 -110 L 200 -330 Z" fill="url(#ck-pot)" stroke="#dbe9f7" strokeOpacity={0.5} strokeWidth={3} />
        <ellipse cx={0} cy={-330} rx={200} ry={30} fill="#1f2a38" stroke="#dbe9f7" strokeOpacity={0.6} strokeWidth={3} />
        {/* contents */}
        {rice > 0 ? <rect x={-194} y={-100 - rice * 150} width={388} height={rice * 150} rx={10} fill="#f3eee2" opacity={0.92} /> : null}
        {water > 0 ? <rect x={-194} y={-100 - water * 200} width={388} height={water * 200} rx={10} fill="#6fb2ff" opacity={0.45} /> : null}
        {bubbles > 0 && water > 0
          ? Array.from({length: 14}, (_, k) => {
              const t = ((f * (1.5 + (k % 3) * 0.6) + k * 23) % 60) / 60;
              return <circle key={k} cx={-170 + ((k * 61) % 340)} cy={-100 - t * water * 200} r={4 + (k % 3) * 3} fill="#dbe9f7" opacity={bubbles * (1 - t) * 0.9} />;
            })
          : null}
      </g>

      {/* body */}
      <g opacity={bodyOpacity}>
        <path d="M -270 -350 Q -280 -60 -240 -20 L 240 -20 Q 280 -60 270 -350 Z" fill="url(#ck-body)" />
        <rect x={-250} y={-24} width={500} height={24} rx={10} fill="#2a3442" />
      </g>
      <path d="M -270 -350 Q -280 -60 -240 -20 L 240 -20 Q 280 -60 270 -350 Z" fill="none" stroke="#dbe9f7" strokeOpacity={0.35 + xray * 0.4} strokeWidth={3} strokeDasharray={xray > 0.5 ? '12 10' : undefined} />

      {/* control panel + lamps + lever (always solid) */}
      <g>
        <rect x={-120} y={-230} width={240} height={120} rx={22} fill="#14181f" stroke="#4a5868" strokeWidth={3} />
        <circle cx={-56} cy={-186} r={14} fill={warm ? '#3a2a12' : '#ffb238'} />
        {!warm ? <circle cx={-56} cy={-186} r={30} fill="#ffb238" opacity={0.45} filter="url(#ck-soft)" /> : null}
        <circle cx={56} cy={-186} r={14} fill={warm ? '#3ddc84' : '#12301f'} />
        {warm ? <circle cx={56} cy={-186} r={30} fill="#3ddc84" opacity={0.45} filter="url(#ck-soft)" /> : null}
        <text x={-56} y={-140} textAnchor="middle" fontFamily={D.font} fontWeight={600} fontSize={20} fill="#8d9aae" letterSpacing={2}>
          MASAK
        </text>
        <text x={56} y={-140} textAnchor="middle" fontFamily={D.font} fontWeight={600} fontSize={20} fill="#8d9aae" letterSpacing={2}>
          PANAS
        </text>
        <rect x={170} y={-70 + lever * 14} width={60} height={30} rx={8} fill="#2a3442" stroke="#8d9aae" strokeWidth={3} />
      </g>

      {/* lid */}
      <g transform={`translate(0 ${-lidLift})`}>
        <path d="M -280 -350 Q -270 -470 0 -480 Q 270 -470 280 -350 Z" fill="url(#ck-body)" opacity={1 - xray * 0.5} />
        <path d="M -280 -350 Q -270 -470 0 -480 Q 270 -470 280 -350 Z" fill="none" stroke="#dbe9f7" strokeOpacity={0.5} strokeWidth={3} />
        <rect x={-70} y={-512} width={140} height={34} rx={14} fill="#2a3442" />
        <ellipse cx={130} cy={-458} rx={24} ry={9} fill="#14181f" stroke="#8d9aae" strokeWidth={2} />
        {steam > 0
          ? Array.from({length: 6}, (_, k) => {
              const t = ((f + k * 17) % 90) / 90;
              return <circle key={k} cx={130 + Math.sin(t * 6 + k) * 30} cy={-470 - t * 260} r={14 + t * 40} fill="#dbe9f7" opacity={steam * (1 - t) * 0.35} filter="url(#ck-soft)" />;
            })
          : null}
      </g>
    </g>
  );
};
