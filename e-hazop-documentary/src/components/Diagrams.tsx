// Technical graphics: single-line diagram, HAZOP bridge, workflow, guideword matrix,
// hazard register, voltage trend, cause–consequence table, benefits, team.
import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from '../theme';
import {clamp, ease, pop, progress} from './motion';

const glowFilter = (
  <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="4" result="b" />
    <feMerge>
      <feMergeNode in="b" />
      <feMergeNode in="SourceGraphic" />
    </feMerge>
  </filter>
);

// ------------------------------------------------------------ single-line diagram

export type SldPart = 'grid' | 'tx' | 'bus' | 'swgr' | 'dist';

/**
 * Simplified single-line diagram (132/11 kV substation feeding distribution).
 * `draw` reveals it top-to-bottom; `highlight` glows a part; `nodes` shows HAZOP
 * node boundaries; `fault` marks TX-01 in red.
 */
export const SLD: React.FC<{
  draw: number;
  highlight?: SldPart | null;
  highlightAt?: number;
  nodes?: number; // 0..1 reveal of node boundaries
  fault?: number;
  x?: number;
  y?: number;
  scale?: number;
}> = ({draw, highlight = null, highlightAt = 0, nodes = 0, fault = 0, x = 160, y = 110, scale = 1}) => {
  const frame = useCurrentFrame();
  const hl = (p: SldPart) => (highlight === p ? progress(frame, highlightAt, 10) : 0);
  const col = (p: SldPart) => (highlight === p ? C.amber : C.blueLight);
  const sw = 3.2;
  const label = (tx: number, ty: number, t: string, anchor: 'start' | 'middle' | 'end' = 'start', size = 20, color = C.ice) => (
    <text x={tx} y={ty} textAnchor={anchor} fontFamily={F.mono} fontSize={size} fill={color}>
      {t}
    </text>
  );
  const cb = (cx: number, cy: number, p: SldPart) => <rect x={cx - 13} y={cy - 13} width={26} height={26} fill="none" stroke={col(p)} strokeWidth={sw} />;
  const txSym = (cx: number, cy: number, p: SldPart, red = 0) => (
    <g>
      <circle cx={cx} cy={cy - 20} r={28} fill="none" stroke={red > 0 ? C.red : col(p)} strokeWidth={sw} />
      <circle cx={cx} cy={cy + 20} r={28} fill="none" stroke={red > 0 ? C.red : col(p)} strokeWidth={sw} />
    </g>
  );
  const earth = (cx: number, cy: number) => (
    <g stroke={C.grey} strokeWidth={2.5}>
      <line x1={cx} y1={cy} x2={cx} y2={cy + 16} />
      <line x1={cx - 16} y1={cy + 16} x2={cx + 16} y2={cy + 16} />
      <line x1={cx - 10} y1={cy + 23} x2={cx + 10} y2={cy + 23} />
      <line x1={cx - 4} y1={cy + 30} x2={cx + 4} y2={cy + 30} />
    </g>
  );
  const W = 1600;
  const H = 820;
  const reveal = interpolate(draw, [0, 1], [0, H + 40]);
  return (
    <svg width={W * scale} height={H * scale} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
      <defs>
        {glowFilter}
        <clipPath id="sldreveal">
          <rect x={-50} y={-50} width={W + 100} height={reveal} />
        </clipPath>
      </defs>
      <g clipPath="url(#sldreveal)" fill="none" strokeLinecap="round">
        {/* highlight halos */}
        {(['grid', 'tx', 'bus', 'swgr', 'dist'] as SldPart[]).map((p) => {
          const o = hl(p);
          if (!o) return null;
          const box = {grid: [600, 0, 400, 150], tx: [360, 170, 880, 210], bus: [120, 400, 1360, 60], swgr: [120, 470, 1360, 110], dist: [120, 590, 1360, 210]}[p];
          return <rect key={p} x={box[0]} y={box[1]} width={box[2]} height={box[3]} rx={14} fill={C.amber} opacity={0.1 * o} stroke={C.amber} strokeOpacity={0.6 * o} strokeWidth={2} />;
        })}

        {/* grid supply */}
        <g stroke={col('grid')} strokeWidth={sw} filter={highlight === 'grid' ? 'url(#glow)' : undefined}>
          <circle cx={800} cy={50} r={30} />
          <path d="M786 50 q7 -12 14 0 t14 0" />
          <line x1={500} y1={110} x2={1100} y2={110} strokeWidth={6} />
          <line x1={800} y1={80} x2={800} y2={110} />
        </g>
        {label(840, 44, '132 kV GRID SUPPLY')}

        {/* two incomers: CB + transformer */}
        {[560, 1040].map((ix, i) => (
          <g key={ix}>
            <g stroke={col('tx')} strokeWidth={sw} filter={highlight === 'tx' ? 'url(#glow)' : undefined}>
              <line x1={ix} y1={110} x2={ix} y2={178} />
              {cb(ix, 191, 'tx')}
              <line x1={ix} y1={204} x2={ix} y2={232} />
              {txSym(ix, 280, 'tx', i === 0 ? fault : 0)}
              <line x1={ix} y1={328} x2={ix} y2={360} />
              {cb(ix, 373, 'tx')}
              <line x1={ix} y1={386} x2={ix} y2={430} />
            </g>
            <line x1={ix + 28} y1={300} x2={ix + 60} y2={300} stroke={C.grey} strokeWidth={2.5} />
            {earth(ix + 60, 300)}
            {label(ix - 50, 286, i === 0 ? 'TX-01' : 'TX-02', 'end', 22, i === 0 && fault > 0 ? C.red : C.ice)}
            {label(ix - 50, 312, '132/11 kV', 'end', 17, C.grey)}
          </g>
        ))}

        {/* 11 kV busbar with bus coupler */}
        <g stroke={col('bus')} strokeWidth={sw} filter={highlight === 'bus' ? 'url(#glow)' : undefined}>
          <line x1={150} y1={430} x2={770} y2={430} strokeWidth={8} />
          <line x1={830} y1={430} x2={1450} y2={430} strokeWidth={8} />
          <rect x={787} y={417} width={26} height={26} />
          <line x1={770} y1={430} x2={787} y2={430} />
          <line x1={813} y1={430} x2={830} y2={430} />
        </g>
        {label(150, 410, '11 kV BUSBAR A')}
        {label(1450, 410, '11 kV BUSBAR B', 'end')}

        {/* outgoing feeders */}
        {[
          {fx: 230, t: 'MOTOR'},
          {fx: 470, t: 'LV TX'},
          {fx: 700, t: 'MCC'},
          {fx: 900, t: 'CAP BANK'},
          {fx: 1130, t: 'LV TX'},
          {fx: 1370, t: 'STANDBY GEN'},
        ].map(({fx, t}, i) => (
          <g key={fx}>
            <g stroke={col('swgr')} strokeWidth={sw} filter={highlight === 'swgr' ? 'url(#glow)' : undefined}>
              <line x1={fx} y1={430} x2={fx} y2={500} />
              {cb(fx, 513, 'swgr')}
              <line x1={fx} y1={526} x2={fx} y2={600} />
            </g>
            <g stroke={col('dist')} strokeWidth={sw} filter={highlight === 'dist' ? 'url(#glow)' : undefined}>
              {t === 'MOTOR' && (
                <>
                  <circle cx={fx} cy={640} r={36} />
                  <text x={fx} y={652} textAnchor="middle" fontFamily={F.sans} fontWeight={700} fontSize={30} fill={col('dist')} stroke="none">
                    M
                  </text>
                  <line x1={fx} y1={600} x2={fx} y2={604} />
                </>
              )}
              {t === 'LV TX' && (
                <>
                  <circle cx={fx} cy={622} r={22} />
                  <circle cx={fx} cy={652} r={22} />
                  <line x1={fx} y1={674} x2={fx} y2={720} />
                  <line x1={fx - 60} y1={720} x2={fx + 60} y2={720} strokeWidth={5} />
                  {[-40, 0, 40].map((d) => (
                    <path key={d} d={`M${fx + d} 720 L${fx + d} 760 M${fx + d - 8} 750 L${fx + d} 762 L${fx + d + 8} 750`} />
                  ))}
                </>
              )}
              {t === 'MCC' && (
                <>
                  <rect x={fx - 50} y={600} width={100} height={70} />
                  <text x={fx} y={644} textAnchor="middle" fontFamily={F.sans} fontWeight={700} fontSize={22} fill={col('dist')} stroke="none">
                    MCC
                  </text>
                </>
              )}
              {t === 'CAP BANK' && (
                <>
                  <line x1={fx - 26} y1={620} x2={fx + 26} y2={620} />
                  <line x1={fx - 26} y1={636} x2={fx + 26} y2={636} />
                  <line x1={fx} y1={600} x2={fx} y2={620} />
                  <line x1={fx} y1={636} x2={fx} y2={660} />
                </>
              )}
              {t === 'STANDBY GEN' && (
                <>
                  <circle cx={fx} cy={640} r={36} />
                  <text x={fx} y={652} textAnchor="middle" fontFamily={F.sans} fontWeight={700} fontSize={30} fill={col('dist')} stroke="none">
                    G
                  </text>
                  <line x1={fx} y1={600} x2={fx} y2={604} />
                </>
              )}
            </g>
            {label(fx, 800, t, 'middle', 16, C.grey)}
            {label(fx + 22, 490, `F${i + 1}`, 'start', 15, C.greyDark)}
          </g>
        ))}

        {/* HAZOP node boundaries */}
        {nodes > 0 &&
          [
            {r: [470, 150, 660, 270], t: 'NODE 1 · INCOMING SUPPLY & TRANSFORMERS'},
            {r: [130, 395, 1340, 150], t: 'NODE 2 · 11 kV SWITCHBOARD'},
            {r: [130, 580, 1340, 200], t: 'NODE 3 · OUTGOING FEEDERS & LOADS'},
          ].map((n, i) => {
            const o = interpolate(nodes, [i / 3, i / 3 + 0.33], [0, 1], clamp);
            return (
              <g key={i} opacity={o}>
                <rect x={n.r[0]} y={n.r[1]} width={n.r[2]} height={n.r[3]} rx={12} stroke={C.amber} strokeWidth={3} strokeDasharray="14 10" />
                <rect x={n.r[0] + 14} y={n.r[1] - 16} width={n.t.length * 12.4 + 20} height={32} rx={6} fill="#2a1f08" stroke={C.amber} strokeWidth={1.5} />
                <text x={n.r[0] + 24} y={n.r[1] + 6} fontFamily={F.mono} fontWeight={700} fontSize={19} fill={C.amber}>
                  {n.t}
                </text>
              </g>
            );
          })}
      </g>
      {/* drawing head */}
      {draw > 0 && draw < 1 && <line x1={-30} y1={reveal - 50} x2={W + 30} y2={reveal - 50} stroke={C.cyan} strokeWidth={2} opacity={0.6} filter="url(#glow)" />}
    </svg>
  );
};

// ------------------------------------------------------------ HAZOP → E-HAZOP bridge

export const HazopBridge: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = pop(frame, fps, at, 16);
  const b = pop(frame, fps, at + 22, 16);
  const arrow = progress(frame, at + 12, 18);
  const card = (title: string, sub: string, params: string[], words: string[], accent: string, s: number, x: number) => (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: 270,
        width: 660,
        padding: '34px 40px',
        borderRadius: 18,
        background: 'rgba(15,29,51,0.88)',
        border: `1.5px solid ${accent}55`,
        boxShadow: `0 30px 80px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.03)`,
        opacity: s,
        transform: `translateY(${(1 - s) * 40}px)`,
        fontFamily: F.sans,
        color: C.white,
      }}
    >
      <div style={{fontSize: 46, fontWeight: 800, letterSpacing: 1, color: accent}}>{title}</div>
      <div style={{fontSize: 22, color: C.grey, marginTop: 6}}>{sub}</div>
      <div style={{marginTop: 28, fontSize: 18, fontFamily: F.mono, color: C.greyDark, letterSpacing: 2}}>PARAMETERS</div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10}}>
        {params.map((p) => (
          <span key={p} style={{fontSize: 24, padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.06)'}}>
            {p}
          </span>
        ))}
      </div>
      <div style={{marginTop: 24, fontSize: 18, fontFamily: F.mono, color: C.greyDark, letterSpacing: 2}}>GUIDEWORDS (EXAMPLES)</div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 10}}>
        {words.map((w) => (
          <span key={w} style={{fontSize: 22, fontFamily: F.mono, fontWeight: 700, padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${accent}88`, color: accent}}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <>
      {card('HAZOP', 'Process systems · IEC 61882 method', ['Flow', 'Pressure', 'Temperature', 'Level'], ['NO', 'MORE', 'LESS', 'REVERSE'], C.blueLight, a, 170)}
      {card('E-HAZOP', 'Electrical systems · same structured approach', ['Voltage', 'Current', 'Power', 'Frequency', 'Earthing'], ['OVER', 'UNDER', 'SPIKE', 'DIP', 'FAULT'], C.amber, b, 1090)}
      <svg width="1920" height="1080" style={{position: 'absolute'}}>
        <defs>{glowFilter}</defs>
        <path d="M860 560 L1060 560" stroke={C.cyan} strokeWidth={4} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - arrow} filter="url(#glow)" />
        <path d="M1040 542 L1064 560 L1040 578" stroke={C.cyan} strokeWidth={4} fill="none" opacity={arrow > 0.95 ? 1 : 0} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 800,
          textAlign: 'center',
          fontFamily: F.sans,
          fontSize: 34,
          fontWeight: 300,
          color: C.ice,
          opacity: progress(frame, at + 40, 15),
        }}
      >
        <b style={{fontWeight: 700, color: C.amber}}>Guideword</b> + <b style={{fontWeight: 700, color: C.blueLight}}>Parameter</b> = <b style={{fontWeight: 700, color: C.white}}>Deviation</b>
      </div>
    </>
  );
};

// ------------------------------------------------------------ five-step workflow

export const STEPS = ['REVIEW DESIGN DOCUMENTS', 'DIVIDE THE SYSTEM INTO NODES', 'APPLY GUIDEWORDS AND PARAMETERS', 'IDENTIFY CAUSES AND CONSEQUENCES', 'RECOMMEND SAFEGUARDS AND ACTIONS'];

const StepIcon: React.FC<{i: number; color: string}> = ({i, color}) => {
  const s = {fill: 'none', stroke: color, strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width="64" height="64" viewBox="0 0 48 48">
      {i === 0 && (
        <g {...s}>
          <path d="M12 6h18l8 8v28H12z" />
          <path d="M30 6v8h8M18 24h14M18 30h14M18 36h8" />
        </g>
      )}
      {i === 1 && (
        <g {...s}>
          <rect x="6" y="6" width="15" height="15" rx="2" strokeDasharray="4 3" />
          <rect x="27" y="6" width="15" height="15" rx="2" strokeDasharray="4 3" />
          <rect x="6" y="27" width="15" height="15" rx="2" strokeDasharray="4 3" />
          <rect x="27" y="27" width="15" height="15" rx="2" />
        </g>
      )}
      {i === 2 && (
        <g {...s}>
          <path d="M8 34l10-12 8 8 14-16" />
          <path d="M32 14h8v8" />
          <path d="M6 42h36" />
        </g>
      )}
      {i === 3 && (
        <g {...s}>
          <circle cx="12" cy="24" r="6" />
          <circle cx="36" cy="12" r="6" />
          <circle cx="36" cy="36" r="6" />
          <path d="M18 22l12-7M18 26l12 7" />
        </g>
      )}
      {i === 4 && (
        <g {...s}>
          <path d="M24 5l15 6v11c0 10-7 17-15 21C16 39 9 32 9 22V11z" />
          <path d="M17 24l5 5 9-10" />
        </g>
      )}
    </svg>
  );
};

/** Horizontal five-step workflow; `active` (0-4) is highlighted, steps appear at their frames. */
export const Workflow: React.FC<{appear: number[]; active: number; y?: number; compact?: boolean}> = ({appear, active, y = 360, compact = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const w = 300;
  const gap = 34;
  const x0 = (1920 - (w * 5 + gap * 4)) / 2;
  return (
    <div style={{position: 'absolute', left: 0, top: y, width: 1920, height: compact ? 170 : 320}}>
      {STEPS.map((s, i) => {
        const p = pop(frame, fps, appear[i], 15);
        const on = i === active;
        const done = i < active;
        const color = on ? C.amber : done ? C.blueLight : C.grey;
        return (
          <div
            key={s}
            style={{
              position: 'absolute',
              left: x0 + i * (w + gap),
              top: 0,
              width: w,
              height: compact ? 150 : 290,
              borderRadius: 16,
              padding: compact ? '16px 20px' : '26px 26px',
              boxSizing: 'border-box',
              background: on ? 'rgba(60,40,8,0.75)' : 'rgba(15,29,51,0.82)',
              border: `2px solid ${on ? C.amber : 'rgba(111,178,255,0.18)'}`,
              boxShadow: on ? `0 0 40px rgba(255,178,56,0.25)` : '0 20px 50px rgba(0,0,0,0.4)',
              opacity: frame >= appear[i] ? Math.min(1, p * 1.4) * (on || done || compact ? 1 : 0.8) : 0,
              transform: `translateY(${(1 - p) * 40}px) scale(${on ? 1.04 : 1})`,
              fontFamily: F.sans,
            }}
          >
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: compact ? 34 : 54, color}}>{String(i + 1).padStart(2, '0')}</div>
              {!compact && <StepIcon i={i} color={color} />}
            </div>
            <div style={{marginTop: compact ? 8 : 26, fontSize: compact ? 19 : 25, fontWeight: 700, lineHeight: 1.25, color: on ? C.white : C.ice}}>{s}</div>
          </div>
        );
      })}
      {/* connector */}
      <div style={{position: 'absolute', left: x0, top: compact ? 160 : 305, height: 3, width: (w * 5 + gap * 4) * Math.min(1, (active + 1) / 5), background: `linear-gradient(90deg, ${C.blueLight}, ${C.amber})`, borderRadius: 2}} />
    </div>
  );
};

// ------------------------------------------------------------ guideword × parameter matrix

export const PARAMS = ['VOLTAGE', 'CURRENT', 'POWER', 'FREQUENCY', 'EARTHING'];
export const GUIDEWORDS = ['OVER', 'UNDER', 'SPIKE', 'DIP', 'FAULT', 'BLACKOUT'];
// Credible example deviations (illustrative, not exhaustive)
const DEV: Record<string, string> = {
  'VOLTAGE-OVER': 'Overvoltage',
  'VOLTAGE-UNDER': 'Undervoltage',
  'VOLTAGE-SPIKE': 'Transient surge',
  'VOLTAGE-DIP': 'Voltage dip',
  'VOLTAGE-BLACKOUT': 'Loss of supply',
  'CURRENT-OVER': 'Overload',
  'CURRENT-FAULT': 'Short circuit',
  'CURRENT-SPIKE': 'Inrush',
  'POWER-OVER': 'Over-demand',
  'POWER-UNDER': 'Generation shortfall',
  'POWER-BLACKOUT': 'Total outage',
  'FREQUENCY-OVER': 'Over-frequency',
  'FREQUENCY-UNDER': 'Under-frequency',
  'EARTHING-FAULT': 'Earth fault',
  'EARTHING-UNDER': 'High earth resistance',
};

export const GuidewordMatrix: React.FC<{paramsAt: number[]; wordsAt: number[]; cellsAt: number; focus?: string; y?: number}> = ({paramsAt, wordsAt, cellsAt, focus = 'VOLTAGE-OVER', y = 330}) => {
  const frame = useCurrentFrame();
  const x0 = 360;
  const y0 = y;
  const cw = 222;
  const ch = 86;
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: F.sans}}>
      <div style={{position: 'absolute', left: 120, top: y0 + 8, width: 220, fontFamily: F.mono, fontSize: 16, lineHeight: 1.4, letterSpacing: 2, color: C.grey}}>GUIDEWORD →<br />PARAMETER ↓</div>
      {GUIDEWORDS.map((g, j) => {
        const o = progress(frame, wordsAt[j] ?? wordsAt[wordsAt.length - 1], 10);
        return (
          <div key={g} style={{position: 'absolute', left: x0 + j * cw, top: y0, width: cw - 12, height: 64, borderRadius: 10, background: 'rgba(255,178,56,0.12)', border: `1.5px solid ${C.amber}88`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontWeight: 700, fontSize: 26, color: C.amber, opacity: o, transform: `translateY(${(1 - o) * -20}px)`}}>
            {g}
          </div>
        );
      })}
      {PARAMS.map((p, i) => {
        const o = progress(frame, paramsAt[i], 10);
        return (
          <div key={p} style={{position: 'absolute', left: 120, top: y0 + 80 + i * ch, width: 220, height: ch - 14, borderRadius: 10, background: 'rgba(111,178,255,0.12)', border: `1.5px solid ${C.blueLight}88`, display: 'flex', alignItems: 'center', paddingLeft: 22, fontWeight: 700, fontSize: 25, color: C.blueLight, opacity: o, transform: `translateX(${(1 - o) * -30}px)`}}>
            {p}
          </div>
        );
      })}
      {PARAMS.map((p, i) =>
        GUIDEWORDS.map((g, j) => {
          const key = `${p}-${g}`;
          const d = DEV[key];
          const o = progress(frame, cellsAt + (i + j) * 2, 12);
          const isFocus = key === focus;
          const pulse = isFocus ? 0.5 + 0.5 * Math.sin(frame / 6) : 0;
          return (
            <div
              key={key}
              style={{
                position: 'absolute',
                left: x0 + j * cw,
                top: y0 + 80 + i * ch,
                width: cw - 12,
                height: ch - 14,
                borderRadius: 10,
                background: d ? (isFocus ? `rgba(255,75,75,${0.25 + pulse * 0.15})` : 'rgba(255,255,255,0.05)') : 'rgba(255,255,255,0.015)',
                border: isFocus ? `2px solid ${C.red}` : '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                fontWeight: isFocus ? 800 : 600,
                color: isFocus ? C.white : C.ice,
                opacity: o,
                textAlign: 'center',
                lineHeight: 1.15,
                padding: '0 8px',
              }}
            >
              {d ?? <span style={{color: C.greyDark}}>—</span>}
            </div>
          );
        }),
      )}
      <div style={{position: 'absolute', left: 120, top: y0 + 80 + 5 * ch + 8, fontSize: 19, color: C.grey, opacity: progress(frame, cellsAt + 20, 15)}}>
        Each meaningful combination is a deviation to examine. Examples are illustrative; guidewords are tailored to each design.
      </div>
    </div>
  );
};

// ------------------------------------------------------------ hazard register

const REG_COLS = ['NODE', 'DEVIATION', 'POSSIBLE CAUSES', 'CONSEQUENCES', 'EXISTING SAFEGUARDS', 'RECOMMENDATION'];
const REG_W = [150, 200, 330, 300, 320, 380];
export const REG_ROW = ['1 · TX-01', 'Overvoltage', 'Incorrect settings; network disturbance', 'Insulation stress; equipment damage', 'Overvoltage relay; voltage monitoring', 'Review settings; verify alarm & trip'];

export const HazardRegister: React.FC<{at: number; y?: number}> = ({at, y = 300}) => {
  const frame = useCurrentFrame();
  const total = REG_W.reduce((a, b) => a + b, 0);
  const x0 = (1920 - total) / 2;
  return (
    <div style={{position: 'absolute', left: x0, top: y, width: total, fontFamily: F.sans, opacity: progress(frame, at, 12)}}>
      <div style={{fontFamily: F.mono, fontSize: 20, letterSpacing: 3, color: C.grey, marginBottom: 14}}>HAZARD REGISTER · E-HAZOP WORKSHEET (ILLUSTRATIVE)</div>
      <div style={{display: 'flex', background: '#16263f', borderRadius: '10px 10px 0 0'}}>
        {REG_COLS.map((c, i) => (
          <div key={c} style={{width: REG_W[i], padding: '16px 14px', fontFamily: F.mono, fontWeight: 700, fontSize: 16, color: C.blueLight, letterSpacing: 1, boxSizing: 'border-box'}}>
            {c}
          </div>
        ))}
      </div>
      {[0, 1, 2].map((r) => (
        <div key={r} style={{display: 'flex', background: r % 2 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.06)', minHeight: 96}}>
          {REG_ROW.map((cell, i) => {
            const t0 = at + 10 + i * 9;
            const n = Math.floor(interpolate(frame, [t0, t0 + 16], [0, cell.length], clamp));
            return (
              <div key={i} style={{width: REG_W[i], padding: '16px 14px', fontSize: 21, lineHeight: 1.3, color: r === 0 ? (i === 1 ? C.amber : C.white) : 'transparent', boxSizing: 'border-box', borderTop: '1px solid rgba(255,255,255,0.06)'}}>
                {r === 0 ? cell.slice(0, n) : '·'}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// ------------------------------------------------------------ voltage trend

export const VoltageTrend: React.FC<{start: number; rise: number; x?: number; y?: number; w?: number; h?: number}> = ({start, rise, x = 1040, y = 200, w = 760, h = 470}) => {
  const frame = useCurrentFrame();
  const pad = 70;
  const vmin = 0.85;
  const vmax = 1.25;
  const yv = (v: number) => h - pad - ((v - vmin) / (vmax - vmin)) * (h - pad * 1.6);
  const n = 120;
  const t = frame - start;
  const shown = Math.min(n, Math.max(0, Math.floor(t * 1.4)));
  const riseIdx = 55;
  const v = (i: number) => {
    const base = 1.0 + Math.sin(i / 5) * 0.008 + Math.sin(i / 1.7) * 0.004;
    if (i < riseIdx || rise <= 0) return base;
    return base + Math.min(1, (i - riseIdx) / 30) * 0.17 * rise;
  };
  const pts = Array.from({length: shown}, (_, i) => `${pad + (i / (n - 1)) * (w - pad - 30)},${yv(v(i))}`).join(' ');
  const last = shown > 0 ? v(shown - 1) : 1;
  const over = last > 1.1;
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: x, top: y, overflow: 'visible', opacity: progress(frame, start - 10, 12)}}>
      <defs>{glowFilter}</defs>
      <rect width={w} height={h} rx={16} fill="rgba(10,20,36,0.85)" stroke="rgba(111,178,255,0.2)" />
      <text x={pad} y={42} fontFamily={F.mono} fontSize={18} fill={C.grey} letterSpacing={2}>
        TX-01 SECONDARY VOLTAGE (p.u.) · ILLUSTRATIVE
      </text>
      {/* normal band */}
      <rect x={pad} y={yv(1.05)} width={w - pad - 30} height={yv(0.95) - yv(1.05)} fill={C.green} opacity={0.08} />
      <text x={w - 36} y={yv(1.0) + 6} textAnchor="end" fontFamily={F.mono} fontSize={15} fill={C.green} opacity={0.8}>
        NORMAL ±5%
      </text>
      {/* limit */}
      <line x1={pad} x2={w - 30} y1={yv(1.1)} y2={yv(1.1)} stroke={C.red} strokeWidth={2} strokeDasharray="10 8" />
      <text x={w - 36} y={yv(1.1) - 10} textAnchor="end" fontFamily={F.mono} fontSize={15} fill={C.red}>
        ALARM LIMIT 1.10
      </text>
      {[0.9, 1.0, 1.1, 1.2].map((g) => (
        <g key={g}>
          <line x1={pad} x2={w - 30} y1={yv(g)} y2={yv(g)} stroke="#1c3150" />
          <text x={pad - 12} y={yv(g) + 5} textAnchor="end" fontFamily={F.mono} fontSize={15} fill={C.greyDark}>
            {g.toFixed(2)}
          </text>
        </g>
      ))}
      <polyline points={pts} fill="none" stroke={over ? C.red : C.cyan} strokeWidth={3.5} filter="url(#glow)" />
      {shown > 0 && (
        <g>
          <circle cx={pad + ((shown - 1) / (n - 1)) * (w - pad - 30)} cy={yv(last)} r={7} fill={over ? C.red : C.cyan} />
          <text x={pad + ((shown - 1) / (n - 1)) * (w - pad - 30) - 14} y={yv(last) - 18} textAnchor="end" fontFamily={F.mono} fontWeight={700} fontSize={22} fill={over ? C.red : C.ice}>
            {last.toFixed(2)} pu{over ? '  OVERVOLTAGE' : ''}
          </text>
        </g>
      )}
    </svg>
  );
};

// ------------------------------------------------------------ cause–deviation–consequence–safeguard

export const CDCS_ROWS: [string, string][] = [
  ['Deviation', 'Overvoltage'],
  ['Possible causes', 'Incorrect settings or system disturbance'],
  ['Possible consequences', 'Insulation stress and equipment damage'],
  ['Safeguards to examine', 'Protection relays and voltage monitoring'],
];

export const CdcsTable: React.FC<{rowsAt: number[]; x?: number; y?: number; w?: number}> = ({rowsAt, x = 960 - 620, y = 250, w = 1240}) => {
  const frame = useCurrentFrame();
  const colors = [C.amber, C.blueLight, C.red, C.green];
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, fontFamily: F.sans}}>
      <div style={{display: 'flex', fontFamily: F.mono, fontSize: 18, letterSpacing: 3, color: C.grey, padding: '0 28px 14px'}}>
        <div style={{width: 380}}>ELEMENT</div>
        <div>EXAMPLE</div>
      </div>
      {CDCS_ROWS.map(([k, v], i) => {
        const p = progress(frame, rowsAt[i], 14);
        return (
          <div
            key={k}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '26px 28px',
              marginBottom: 14,
              borderRadius: 14,
              background: 'rgba(15,29,51,0.88)',
              borderLeft: `6px solid ${colors[i]}`,
              opacity: p,
              transform: `translateX(${(1 - p) * 60}px)`,
            }}
          >
            <div style={{width: 380, fontSize: 30, fontWeight: 700, color: colors[i]}}>{k}</div>
            <div style={{fontSize: 32, fontWeight: 400, color: C.white}}>{v}</div>
          </div>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------ benefits & team

export const BENEFITS = ['PERSONNEL SAFETY', 'EQUIPMENT PROTECTION', 'SYSTEM RELIABILITY', 'BUSINESS CONTINUITY'];

const BenefitIcon: React.FC<{i: number; color: string}> = ({i, color}) => {
  const s = {fill: 'none', stroke: color, strokeWidth: 2.2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  return (
    <svg width="96" height="96" viewBox="0 0 48 48">
      {i === 0 && (
        <g {...s}>
          <path d="M24 4l16 6v12c0 10-7 18-16 22C15 40 8 32 8 22V10z" />
          <circle cx="24" cy="19" r="5" />
          <path d="M15 34c2-5 5-7 9-7s7 2 9 7" />
        </g>
      )}
      {i === 1 && (
        <g {...s}>
          <rect x="10" y="16" width="28" height="22" rx="2" />
          <path d="M16 16V8M24 16V6M32 16V8" />
          <path d="M6 20v14M42 20v14" />
          <path d="M18 27l4 4 8-8" />
        </g>
      )}
      {i === 2 && (
        <g {...s}>
          <path d="M4 26h8l4-10 6 20 6-16 4 6h12" />
          <circle cx="24" cy="24" r="20" opacity="0.4" />
        </g>
      )}
      {i === 3 && (
        <g {...s}>
          <path d="M6 40V20l10 6v-6l10 6v-6l10 6V8h6v32z" />
          <path d="M12 34h4M22 34h4M32 34h4" />
        </g>
      )}
    </svg>
  );
};

export const Benefits: React.FC<{at: number[]; y?: number}> = ({at, y = 300}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const w = 360;
  const gap = 40;
  const x0 = (1920 - (w * 4 + gap * 3)) / 2;
  return (
    <>
      {BENEFITS.map((b, i) => {
        const p = pop(frame, fps, at[i], 15);
        return (
          <div
            key={b}
            style={{
              position: 'absolute',
              left: x0 + i * (w + gap),
              top: y,
              width: w,
              height: 300,
              borderRadius: 18,
              background: 'rgba(15,29,51,0.86)',
              border: '1.5px solid rgba(111,178,255,0.2)',
              boxShadow: '0 30px 70px rgba(0,0,0,0.45)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 26,
              opacity: frame >= at[i] ? Math.min(1, p * 1.4) : 0,
              transform: `translateY(${(1 - p) * 50}px)`,
            }}
          >
            <BenefitIcon i={i} color={C.cyan} />
            <div style={{fontFamily: F.sans, fontWeight: 800, fontSize: 28, letterSpacing: 1, textAlign: 'center', color: C.white, lineHeight: 1.2}}>{b}</div>
            <div style={{fontFamily: F.mono, fontSize: 18, color: C.greyDark}}>0{i + 1}</div>
          </div>
        );
      })}
    </>
  );
};

export const TeamTriad: React.FC<{at: number[]; y?: number}> = ({at, y = 760}) => {
  const frame = useCurrentFrame();
  const roles = ['ENGINEERING', 'OPERATIONS', 'MAINTENANCE'];
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 28, fontFamily: F.sans}}>
      {roles.map((r, i) => (
        <React.Fragment key={r}>
          {i > 0 && <div style={{fontSize: 40, color: C.greyDark, opacity: progress(frame, at[i], 10)}}>+</div>}
          <div
            style={{
              padding: '18px 34px',
              borderRadius: 40,
              border: `2px solid ${C.blueLight}`,
              color: C.white,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: 2,
              background: 'rgba(46,127,217,0.15)',
              opacity: progress(frame, at[i], 12),
              transform: `scale(${interpolate(progress(frame, at[i], 12, ease.out), [0, 1], [0.8, 1])})`,
            }}
          >
            {r}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
