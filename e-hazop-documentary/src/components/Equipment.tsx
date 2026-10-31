// Close-up illustrations: power transformer, MV switchgear line-up, control room.
import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {C, F} from '../theme';
import {rand} from './motion';
import {Insulator, Transformer} from './Substation';

// ------------------------------------------------------------ transformer hero

/** Dramatically lit close-up of a power transformer. */
export const TransformerHero: React.FC<{stress?: number; sparks?: number; label?: string; ox?: number}> = ({stress = 0, sparks = 0, label = 'TX-01', ox = 0}) => {
  const frame = useCurrentFrame();
  const flick = 0.85 + 0.15 * noise2D('tx', frame / 10, 0);
  return (
    <AbsoluteFill style={{background: `radial-gradient(ellipse at 55% 35%, #17263d 0%, #0a1220 45%, ${C.bg} 80%)`}}>
      {/* back wall / sky */}
      <svg width="1920" height="1080" style={{position: 'absolute'}}>
        <defs>
          <radialGradient id="txglow" cx="0.5" cy="0.55" r="0.6">
            <stop offset="0" stopColor="#ff6a3d" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ff2d2d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="spot" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#bcd7ff" stopOpacity="0.35" />
            <stop offset="1" stopColor="#bcd7ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`${1380 + ox},0 ${1460 + ox},0 ${1700 + ox},1080 ${1050 + ox},1080`} fill="url(#spot)" opacity={0.5 * flick} />
        <rect y={1000} width={1920} height={80} fill="#080b11" />
        <g transform={`translate(${960 + ox} 960) scale(2)`}>
          <Transformer x={0} y={0} glow={stress} label={label} />
        </g>
      </svg>
      {/* corona / partial-discharge sparks at bushing tops (illustrative) */}
      {sparks > 0 && (
        <svg width="1920" height="1080" style={{position: 'absolute'}}>
          {[-60, 20, 100].map((bx, i) => {
            const x = 960 + ox + 2 * bx;
            const y = 960 - 2 * 372;
            const on = rand(Math.floor(frame / 2) + i * 13) < sparks;
            if (!on) return null;
            const pts = Array.from({length: 6}, (_, k) => `${x + (rand(frame + k + i) - 0.5) * 60},${y + (rand(frame * 2 + k + i) - 0.5) * 60}`).join(' ');
            return (
              <g key={i}>
                <circle cx={x} cy={y} r={34} fill="#9fd4ff" opacity={0.25} />
                <polyline points={pts} stroke="#e7f4ff" strokeWidth={2} fill="none" opacity={0.9} />
              </g>
            );
          })}
        </svg>
      )}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ switchgear

const PANELS = ['INCOMER 1', 'FDR 01', 'FDR 02', 'BUS COUPLER', 'FDR 03', 'INCOMER 2'];

/** Front view of a metal-clad MV switchgear line-up with protection relays. */
export const Switchgear: React.FC<{alarmPanel?: number; alarm?: number; relayText?: string}> = ({alarmPanel = -1, alarm = 0, relayText = 'ALARM'}) => {
  const frame = useCurrentFrame();
  const pw = 270;
  const x0 = (1920 - pw * PANELS.length) / 2;
  const blink = Math.sin(frame / 4) > 0 ? 1 : 0.25;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0c121c 0%, #121a26 60%, #0a0d13 100%)'}}>
      {/* ceiling light strip */}
      <div style={{position: 'absolute', top: 40, left: 200, right: 200, height: 6, background: '#dfe9f7', opacity: 0.5, boxShadow: '0 0 60px 18px rgba(200,220,255,0.25)'}} />
      <svg width="1920" height="1080" style={{position: 'absolute'}}>
        <rect y={930} width={1920} height={150} fill="#1a2028" />
        <rect y={930} width={1920} height={4} fill="#2c3542" />
        {PANELS.map((name, i) => {
          const x = x0 + i * pw;
          const isAlarm = i === alarmPanel && alarm > 0;
          const closed = name !== 'BUS COUPLER';
          return (
            <g key={name}>
              <rect x={x + 4} y={130} width={pw - 8} height={800} fill="#c4ccd6" />
              <rect x={x + 4} y={130} width={pw - 8} height={800} fill="url(#panelShade)" />
              {/* LV / relay compartment */}
              <rect x={x + 18} y={150} width={pw - 36} height={250} rx={4} fill="#b3bcc8" stroke="#8d97a5" />
              {/* relay HMI */}
              <rect x={x + 40} y={175} width={130} height={86} rx={4} fill="#0d1622" />
              <text x={x + 105} y={202} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={13} fill={isAlarm ? C.amber : '#7fd6ff'}>
                {isAlarm ? (blink > 0.5 ? relayText : '') : 'P-RELAY'}
              </text>
              <text x={x + 105} y={226} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={14} fill={isAlarm ? C.amber : '#9fb3c8'}>
                {isAlarm ? 'U> 1.12 pu' : '11.0 kV'}
              </text>
              <text x={x + 105} y={248} textAnchor="middle" fontFamily="JetBrains Mono" fontSize={12} fill="#6c7c90">
                {isAlarm ? 'STAGE 1' : '412 A'}
              </text>
              {/* lamps: red = closed, green = open, amber = alarm */}
              <circle cx={x + 200} cy={190} r={11} fill={closed ? '#ff4b4b' : '#4a1d1d'} />
              <circle cx={x + 200} cy={222} r={11} fill={closed ? '#1d3b2a' : '#3ddc84'} />
              <circle cx={x + 200} cy={254} r={11} fill={isAlarm ? C.amber : '#3b301a'} opacity={isAlarm ? blink : 1} />
              {isAlarm && <circle cx={x + 200} cy={254} r={30} fill={C.amber} opacity={0.3 * blink} />}
              {/* label */}
              <rect x={x + 40} y={290} width={pw - 80} height={30} rx={3} fill="#1f2a38" />
              <text x={x + pw / 2} y={311} textAnchor="middle" fontFamily="Inter" fontWeight={700} fontSize={15} fill="#e8eef6">
                {name}
              </text>
              {/* mimic */}
              <line x1={x + pw / 2} y1={340} x2={x + pw / 2} y2={392} stroke="#1f2a38" strokeWidth={5} />
              <rect x={x + pw / 2 - 14} y={352} width={28} height={28} fill={closed ? '#d23c3c' : '#2f9e5e'} />
              {/* breaker compartment */}
              <rect x={x + 18} y={420} width={pw - 36} height={340} rx={4} fill="#b9c2ce" stroke="#8d97a5" />
              <circle cx={x + pw / 2} cy={560} r={34} fill="#9aa4b2" stroke="#7d8796" strokeWidth={3} />
              <rect x={x + pw / 2 - 6} y={530} width={12} height={60} rx={4} fill="#2a3442" transform={`rotate(${closed ? 0 : 90} ${x + pw / 2} ${560})`} />
              <rect x={x + 40} y={680} width={pw - 80} height={20} rx={3} fill="#e7c13a" />
              <text x={x + pw / 2} y={695} textAnchor="middle" fontFamily="Inter" fontWeight={800} fontSize={12} fill="#1b1b1b">
                DANGER 11 kV
              </text>
              {/* cable compartment */}
              <rect x={x + 18} y={780} width={pw - 36} height={130} rx={4} fill="#b3bcc8" stroke="#8d97a5" />
              {Array.from({length: 6}, (_, k) => (
                <rect key={k} x={x + 50 + k * 30} y={830} width={16} height={4} fill="#8d97a5" />
              ))}
              {isAlarm && <rect x={x + 4} y={130} width={pw - 8} height={800} fill={C.amber} opacity={0.08 * blink} />}
            </g>
          );
        })}
        <defs>
          <linearGradient id="panelShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.35" />
            <stop offset="0.5" stopColor="#000" stopOpacity="0.05" />
            <stop offset="1" stopColor="#000" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
      {/* cinematic grade: darken the room */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,10,18,0.55), rgba(6,10,18,0.15) 40%, rgba(6,10,18,0.6))'}} />
      <AbsoluteFill style={{background: `rgba(255,178,56,${alarm * 0.06})`, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ control room

/** Electrical control room with SCADA screens and operator silhouettes. */
export const ControlRoom: React.FC<{alarm?: number}> = ({alarm = 0}) => {
  const frame = useCurrentFrame();
  const screens = [
    {x: 220, y: 170, w: 460, h: 270},
    {x: 730, y: 140, w: 460, h: 300},
    {x: 1240, y: 170, w: 460, h: 270},
  ];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, #13233b 0%, #0a1220 50%, #05080d 90%)'}}>
      <svg width="1920" height="1080" style={{position: 'absolute'}}>
        {screens.map((s, i) => (
          <g key={i}>
            <rect x={s.x - 10} y={s.y - 10} width={s.w + 20} height={s.h + 20} rx={6} fill="#05080d" />
            <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="#081626" />
            <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="#2e7fd9" opacity={0.07} />
            {i === 1 ? (
              // mini single-line diagram
              <g stroke="#7fd6ff" strokeWidth={3} fill="none">
                <line x1={s.x + 60} y1={s.y + 150} x2={s.x + s.w - 60} y2={s.y + 150} strokeWidth={6} />
                {[0, 1, 2, 3, 4].map((k) => {
                  const fx = s.x + 90 + k * 70;
                  return (
                    <g key={k}>
                      <line x1={fx} y1={s.y + 150} x2={fx} y2={s.y + 240} />
                      <rect x={fx - 10} y={s.y + 180} width={20} height={20} fill={k === 2 && alarm > 0 ? C.amber : '#7fd6ff'} stroke="none" />
                    </g>
                  );
                })}
                <circle cx={s.x + s.w / 2 - 14} cy={s.y + 85} r={24} />
                <circle cx={s.x + s.w / 2 + 14} cy={s.y + 85} r={24} />
                <line x1={s.x + s.w / 2} y1={s.y + 20} x2={s.x + s.w / 2} y2={s.y + 61} />
                <line x1={s.x + s.w / 2} y1={s.y + 109} x2={s.x + s.w / 2} y2={s.y + 150} />
              </g>
            ) : (
              // trend
              <g>
                {[0, 1, 2, 3].map((k) => (
                  <line key={k} x1={s.x + 20} x2={s.x + s.w - 20} y1={s.y + 50 + k * 55} y2={s.y + 50 + k * 55} stroke="#18304d" />
                ))}
                <polyline
                  fill="none"
                  stroke={i === 0 ? '#3ddc84' : '#7fd6ff'}
                  strokeWidth={3}
                  points={Array.from({length: 40}, (_, k) => {
                    const px = s.x + 20 + k * ((s.w - 40) / 39);
                    const py = s.y + s.h / 2 + Math.sin(k / 3 + frame / 20 + i) * 30 + noise2D('tr' + i, k / 6, frame / 60) * 18;
                    return `${px},${py}`;
                  }).join(' ')}
                />
              </g>
            )}
          </g>
        ))}
        {/* desk */}
        <path d="M0 760 L1920 760 L1920 1080 L0 1080 Z" fill="#0b0f16" />
        <rect y={750} width={1920} height={14} fill="#1a2230" />
        {/* operators (back view silhouettes) */}
        {[620, 1300].map((ox, i) => (
          <g key={ox} transform={`translate(${ox} ${720 + Math.sin(frame / 50 + i) * 2})`}>
            <path d="M-120 360 C-120 230 -90 170 0 160 C90 170 120 230 120 360 Z" fill="#04060a" />
            <circle cx={0} cy={110} r={62} fill="#04060a" />
            <path d="M-62 100 A62 62 0 0 1 62 100" stroke="#6fb2ff" strokeWidth={3} fill="none" opacity={0.35} />
          </g>
        ))}
      </svg>
      <AbsoluteFill style={{background: `rgba(255,75,75,${alarm * 0.08})`, mixBlendMode: 'screen'}} />
    </AbsoluteFill>
  );
};

/** Animated hum / energy waveform strip (used as a subtle accent). */
export const Waveform: React.FC<{color?: string; amp?: number; y?: number; opacity?: number}> = ({color = C.cyan, amp = 30, y = 540, opacity = 0.5}) => {
  const frame = useCurrentFrame();
  const pts = Array.from({length: 200}, (_, i) => {
    const x = (i / 199) * 1920;
    return `${x},${y + Math.sin(i / 6 - frame / 4) * amp * interpolate(Math.abs(i - 100), [0, 100], [1, 0.2])}`;
  }).join(' ');
  return (
    <svg width="1920" height="1080" style={{position: 'absolute', opacity}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2.5} />
    </svg>
  );
};

export {Insulator};
export const fontStack = F;
