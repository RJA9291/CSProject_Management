import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {cue, FPS, makeTimeline, ScriptShot, Timing} from '../lib/timeline';
import {Captions, Chip, outline, Punch} from '../waze/ui/Overlays';
import {TanggangScene3D} from '../tanggang/Story';
import {beat, Beat, Prim, rasterise, Role} from './scene2d';
import script from './script.json';
import timings from './timings.json';

export const {SHOTS, TOTAL_FRAMES} = makeTimeline(script.shots as ScriptShot[], timings as Record<string, Timing>, 'audio/styles/vo', script.say as Record<string, string>);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const FONT = 'Rubik, Inter, sans-serif';

export type Style2D = 'wayang' | 'paper' | 'pixel' | 'comic' | 'line' | 'batik';

type Palette = Record<Role, string>;
const BASE_PAL: Palette = {
  sky: '#9cd3f0', sun: '#ffd23f', hill: '#7fb36b', sea: '#2f8fc8', wave: '#bfe6ff', hull: '#7a4e2c', deck: '#b08050', mast: '#5b3e24', sail: '#f4ecd8', flag: '#c93434',
  boat: '#8a5a34', paddle: '#6b4a2c', skin: '#e3b088', hair: '#1b1b1b', gold: '#f4c430', tanggang: '#7a1f2b', wife: '#d9578a', mother: '#7a6a5a', eye: '#1b1b1b', mouth: '#1b1b1b', tear: '#7cc3ee', bubble: '#ffffff',
};
const PAPER_PAL: Palette = {...BASE_PAL, sky: '#cfe6ef', sun: '#ffcf70', hill: '#9cc78a', sea: '#6fb0d0', wave: '#e6f4fa', hull: '#b07a52', sail: '#fff6e6', tanggang: '#c0504d', wife: '#f29bbb', mother: '#a88c6e', boat: '#c08a5a'};
const PIXEL_PAL: Palette = {...BASE_PAL, sky: '#65c7f4', sea: '#1265c8', wave: '#bfe9fb', hill: '#39a86b', hull: '#8a5a34', tanggang: '#c93434', mother: '#8c7a5a'};
const COMIC_PAL: Palette = {...BASE_PAL, sky: '#ffe08a', sun: '#ff8a2a', sea: '#2a7fd4', hill: '#5bbf6a', tanggang: '#e03c3c', wife: '#ff6fae', mother: '#9a7a5a', hull: '#8a4a24', sail: '#ffffff'};
const BATIK_PAL: Palette = {...BASE_PAL, sky: '#f3e3c3', sun: '#c9a020', hill: '#2f5a4a', sea: '#1f3d6b', wave: '#c9a020', hull: '#6b1f1f', sail: '#f3e3c3', flag: '#c9a020', tanggang: '#7a1f2b', wife: '#2f5a4a', mother: '#8c5a3c', boat: '#6b1f1f', skin: '#d9a47a'};

const pts = (p: [number, number][]) => p.map(([x, y]) => `${x},${y}`).join(' ');
const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 997, 7) / 997;
const center = (pr: Prim): [number, number] =>
  pr.t === 'rect' ? [pr.x + pr.w / 2, pr.y + pr.h / 2] : pr.t === 'circle' ? [pr.cx, pr.cy] : [pr.pts.reduce((a, p) => a + p[0], 0) / pr.pts.length, pr.pts.reduce((a, p) => a + p[1], 0) / pr.pts.length];

type DrawOpts = {fill: string; stroke?: string; sw?: number; extra?: React.SVGProps<SVGElement>; key: string};
const shape = (pr: Prim, o: DrawOpts): React.ReactNode => {
  const common = {fill: o.fill, stroke: o.stroke, strokeWidth: o.sw, strokeLinejoin: 'round' as const, ...(o.extra as object)};
  if (pr.t === 'rect') return <rect key={o.key} x={pr.x} y={pr.y} width={pr.w} height={pr.h} {...common} />;
  if (pr.t === 'circle') return <circle key={o.key} cx={pr.cx} cy={pr.cy} r={pr.r} {...common} />;
  if (pr.t === 'poly') return <polygon key={o.key} points={pts(pr.pts)} {...common} />;
  return <polyline key={o.key} points={pts(pr.pts)} fill="none" stroke={o.stroke ?? o.fill} strokeWidth={(o.sw ?? 0) + pr.w} strokeLinecap="round" strokeLinejoin="round" {...(o.extra as object)} />;
};

const Bubble: React.FC<{b: NonNullable<Beat['bubble']>; fill: string; stroke: string; sw: number; font?: string; color?: string; size?: number}> = ({b, fill, stroke, sw, font = FONT, color = '#111', size = 56}) => (
  <g>
    <polygon points={pts([[b.x + b.w * 0.55, b.y + b.h - 4], [b.tail[0], b.tail[1]], [b.x + b.w * 0.75, b.y + b.h - 4]])} fill={fill} stroke={stroke} strokeWidth={sw} />
    <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={40} fill={fill} stroke={stroke} strokeWidth={sw} />
    <text x={b.x + b.w / 2} y={b.y + b.h / 2 + size * 0.36} textAnchor="middle" fontFamily={font} fontWeight={900} fontSize={size} fill={color}>
      {b.text}
    </text>
  </g>
);

// ---------- Renderers ----------
const Wayang: React.FC<{b: Beat; f: number}> = ({b, f}) => {
  const flicker = 0.85 + 0.15 * Math.sin(f * 0.9) * Math.sin(f * 0.37);
  const sway = Math.sin(f / 18) * 0.8;
  const skip: Role[] = ['sky', 'sun', 'hill', 'wave', 'tear', 'mouth'];
  const gunungan = interpolate(f, [0, 10, 30], [1, 1, 0], clamp);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <defs>
        <radialGradient id="wy-screen" cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor="#ffe2a0" />
          <stop offset="45%" stopColor="#f39a3a" />
          <stop offset="100%" stopColor="#5a1e08" />
        </radialGradient>
        <pattern id="wy-perf" width="26" height="26" patternUnits="userSpaceOnUse">
          <rect width="26" height="26" fill="#120a06" />
          <circle cx="13" cy="13" r="4.2" fill="#f7b45a" />
          <circle cx="0" cy="0" r="2.4" fill="#f7b45a" />
          <circle cx="26" cy="26" r="2.4" fill="#f7b45a" />
        </pattern>
      </defs>
      <rect width={1080} height={1920} fill="url(#wy-screen)" opacity={flicker} />
      <g transform={`translate(540 1080) scale(1.18) translate(-555 -1020) rotate(${sway} 555 1500)`}>
        {b.prims.filter((p) => !skip.includes(p.role)).map((p) =>
          shape(p, {key: p.id, fill: p.role === 'eye' ? '#f7b45a' : ['tanggang', 'wife', 'mother', 'sail', 'hull'].includes(p.role) ? 'url(#wy-perf)' : p.role === 'sea' ? '#1a0c05' : '#120a06'}),
        )}
        {b.hands.map((h, i) => (
          <line key={i} x1={h[0]} y1={h[1]} x2={h[0] + (i % 2 ? 40 : -40)} y2={1920} stroke="#2a1408" strokeWidth={5} />
        ))}
      </g>
      {gunungan > 0 ? (
        <g opacity={gunungan}>
          <path d="M540 520 C 780 800, 820 1180, 540 1420 C 260 1180, 300 800, 540 520 Z" fill="url(#wy-perf)" />
        </g>
      ) : null}
      <rect width={1080} height={1920} fill="none" stroke="#3a1a0a" strokeWidth={40} />
    </svg>
  );
};

const Paper: React.FC<{b: Beat; step: number}> = ({b, step}) => (
  <svg width={1080} height={1920} viewBox="0 0 1080 1920">
    <defs>
      <filter id="pp-shadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="6" dy="10" stdDeviation="6" floodColor="#2a2a2a" floodOpacity="0.35" />
      </filter>
      <filter id="pp-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
    </defs>
    {b.prims.map((p) => {
      const [cx, cy] = center(p);
      const jit = (hash(p.id + step) - 0.5) * 2.4;
      const flatRole = p.role === 'sky' || p.role === 'eye' || p.role === 'mouth';
      return (
        <g key={p.id} transform={flatRole ? undefined : `rotate(${jit} ${cx} ${cy})`} filter={flatRole ? undefined : 'url(#pp-shadow)'}>
          {shape(p, {key: p.id, fill: PAPER_PAL[p.role], stroke: flatRole ? undefined : '#ffffff', sw: flatRole ? 0 : 7})}
        </g>
      );
    })}
    {b.bubble ? (
      <g filter="url(#pp-shadow)">
        <Bubble b={b.bubble} fill="#fffaf0" stroke="#ffffff" sw={8} />
      </g>
    ) : null}
    <rect width={1080} height={1920} filter="url(#pp-grain)" opacity={0.18} />
  </svg>
);

const Pixel: React.FC<{b: Beat}> = ({b}) => {
  const cols = 72;
  const rows = 128;
  const grid = rasterise(b.prims, cols, rows);
  const cw = 1080 / cols;
  const ch = 1920 / rows;
  const rects: React.ReactNode[] = [];
  grid.forEach((row, r) => {
    let c = 0;
    while (c < cols) {
      const role = row[c];
      let run = 1;
      while (c + run < cols && row[c + run] === role) run++;
      if (role) rects.push(<rect key={`${r}-${c}`} x={c * cw} y={r * ch} width={run * cw + 0.5} height={ch + 0.5} fill={PIXEL_PAL[role]} />);
      c += run;
    }
  });
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" shapeRendering="crispEdges">
      {rects}
      {b.bubble ? (
        <g>
          <rect x={b.bubble.x} y={b.bubble.y} width={b.bubble.w} height={b.bubble.h} fill="#ffffff" stroke="#171717" strokeWidth={12} />
          <rect x={b.bubble.tail[0] - 15} y={b.bubble.y + b.bubble.h} width={30} height={30} fill="#171717" />
          <text x={b.bubble.x + b.bubble.w / 2} y={b.bubble.y + b.bubble.h / 2 + 20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={54} fill="#171717">
            {b.bubble.text}
          </text>
        </g>
      ) : null}
    </svg>
  );
};

// Shared flat-vector scene (used by the comic panels).
const FlatScene: React.FC<{b: Beat; pal: Palette; stroke?: string; sw?: number; halftone?: boolean}> = ({b, pal, stroke, sw = 0, halftone}) => (
  <>
    {b.prims.map((p) => shape(p, {key: p.id, fill: pal[p.role], stroke: p.role === 'sky' ? undefined : stroke, sw: p.role === 'sky' ? 0 : sw, extra: {vectorEffect: 'non-scaling-stroke'} as React.SVGProps<SVGElement>}))}
    {halftone ? <rect width={1080} height={1090} fill="url(#cm-dots)" opacity={0.35} /> : null}
  </>
);

const Comic: React.FC<{b: Beat; p: number; f: number}> = ({b, p, f}) => {
  const panel = (x: number, y: number, w: number, h: number, vb: string, show: number, children: React.ReactNode, key: string) => {
    const s = interpolate(f, [show, show + 8], [0.6, 1], clamp);
    return (
      <g key={key} opacity={f >= show ? 1 : 0} transform={`translate(${x + w / 2} ${y + h / 2}) scale(${s}) translate(${-(x + w / 2)} ${-(y + h / 2)})`}>
        <rect x={x + 10} y={y + 12} width={w} height={h} fill="#111" />
        <svg x={x} y={y} width={w} height={h} viewBox={vb} preserveAspectRatio="xMidYMid slice">
          {children}
        </svg>
        <rect x={x} y={y} width={w} height={h} fill="none" stroke="#111" strokeWidth={10} />
      </g>
    );
  };
  const mo = b.focus.mother;
  const tg = b.focus.tanggang;
  const showB = Math.round(SEG2D * 0.28 * FPS);
  const showC = Math.round(SEG2D * 0.5 * FPS);
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <defs>
        <pattern id="cm-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="3" fill="#d1452f" />
        </pattern>
      </defs>
      <rect width={1080} height={1920} fill="#fff4dc" />
      {panel(40, 360, 1000, 520, '0 560 1080 760', 0, <FlatScene b={b} pal={COMIC_PAL} stroke="#111" sw={5} halftone />, 'A')}
      {panel(40, 910, 480, 560, `${mo[0] - 200} ${mo[1] - 170} 400 470`, showB, <FlatScene b={b} pal={COMIC_PAL} stroke="#111" sw={5} />, 'B')}
      {panel(560, 910, 480, 560, `${tg[0] - 210} ${tg[1] - 260} 420 490`, showC, (
        <>
          <FlatScene b={b} pal={COMIC_PAL} stroke="#111" sw={5} />
          {b.bubble ? <Bubble b={{...b.bubble, x: tg[0] - 205, y: tg[1] - 250, w: 410, h: 90, tail: [tg[0] - 20, tg[1] - 120]}} fill="#ffffff" stroke="#111" sw={5} size={40} /> : null}
        </>
      ), 'C')}
      {p > 0.55 ? (
        <text x={880} y={1000} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill="#ffd23f" stroke="#111" strokeWidth={8} paintOrder="stroke" transform={`rotate(-12 880 1000)`}>
          !!
        </text>
      ) : null}
    </svg>
  );
};

const LineArt: React.FC<{b: Beat; f: number}> = ({b, f}) => {
  const drawP = interpolate(f, [0, SEG2D * FPS * 0.55], [0, 1], clamp);
  const items = b.prims.filter((p) => p.role !== 'sky');
  const n = items.length;
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <defs>
        <pattern id="ln-grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M60 0 L0 0 0 60" fill="none" stroke="#e6edf2" strokeWidth="2" />
        </pattern>
      </defs>
      <rect width={1080} height={1920} fill="#fdfdfb" />
      <rect width={1080} height={1920} fill="url(#ln-grid)" />
      {items.map((p, i) => {
        const frac = Math.max(0, Math.min(1, drawP * n * 1.15 - i));
        if (frac <= 0) return null;
        const solid = p.role === 'eye' || p.role === 'tear';
        return shape(p, {
          key: p.id,
          fill: solid ? (p.role === 'tear' ? '#7cc3ee' : '#222') : 'none',
          stroke: '#222',
          sw: p.t === 'line' ? 0 : 6,
          extra: {pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - frac, ...(p.t === 'line' ? {stroke: '#222', strokeWidth: 6} : {})} as React.SVGProps<SVGElement>,
        });
      })}
      {b.bubble ? (
        <g>
          <rect x={b.bubble.x} y={b.bubble.y} width={b.bubble.w} height={b.bubble.h} rx={40} fill="#fff" stroke="#222" strokeWidth={6} />
          <text x={b.bubble.x + b.bubble.w / 2} y={b.bubble.y + b.bubble.h / 2 + 20} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={56} fill="#222">
            {b.bubble.text}
          </text>
        </g>
      ) : null}
    </svg>
  );
};

const Batik: React.FC<{b: Beat}> = ({b}) => {
  const patterned: Role[] = ['tanggang', 'wife', 'mother', 'sail', 'sea', 'hull'];
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920">
      <defs>
        {patterned.map((r) => (
          <pattern key={r} id={`bt-${r}`} width="54" height="54" patternUnits="userSpaceOnUse">
            <rect width="54" height="54" fill={BATIK_PAL[r]} />
            <circle cx="27" cy="27" r="9" fill="none" stroke={r === 'sail' ? '#7a1f2b' : '#e9c46a'} strokeWidth="3" />
            {[0, 1, 2, 3].map((k) => (
              <ellipse key={k} cx={27 + Math.cos((k * Math.PI) / 2) * 17} cy={27 + Math.sin((k * Math.PI) / 2) * 17} rx="6" ry="3" fill={r === 'sail' ? '#c9a020' : '#e9c46a'} transform={`rotate(${k * 90} ${27 + Math.cos((k * Math.PI) / 2) * 17} ${27 + Math.sin((k * Math.PI) / 2) * 17})`} />
            ))}
          </pattern>
        ))}
        <pattern id="bt-border" width="60" height="60" patternUnits="userSpaceOnUse">
          <rect width="60" height="60" fill="#6b1f1f" />
          <polygon points="30,6 54,30 30,54 6,30" fill="#c9a020" />
          <polygon points="30,18 42,30 30,42 18,30" fill="#6b1f1f" />
        </pattern>
      </defs>
      {b.prims.map((p) => shape(p, {key: p.id, fill: patterned.includes(p.role) ? `url(#bt-${p.role})` : BATIK_PAL[p.role]}))}
      {b.bubble ? <Bubble b={b.bubble} fill="#f3e3c3" stroke="#c9a020" sw={8} color="#6b1f1f" /> : null}
      <rect x={18} y={18} width={1044} height={1884} fill="none" stroke="url(#bt-border)" strokeWidth={60} />
    </svg>
  );
};

// The 2D beat lasts this long in every style segment (seconds).
const SEG2D = 10;

export const Scene2D: React.FC<{style: Style2D; frameOffset?: number}> = ({style, frameOffset = 0}) => {
  const frame = useCurrentFrame() + frameOffset;
  const step = style === 'paper' ? Math.floor(frame / 4) * 4 : frame; // stop-motion on 4s for paper
  const t = step / FPS;
  const p = Math.min(1, t / SEG2D);
  const b = beat(p, t);
  if (style === 'wayang') return <Wayang b={b} f={frame} />;
  if (style === 'paper') return <Paper b={b} step={Math.floor(frame / 4)} />;
  if (style === 'pixel') return <Pixel b={beat(p, Math.floor(frame / 3) * 3 / FPS)} />;
  if (style === 'comic') return <Comic b={b} p={p} f={frame} />;
  if (style === 'line') return <LineArt b={b} f={frame} />;
  return <Batik b={b} />;
};

// ---------- Segments ----------
type Seg = {kind: '3d-lowpoly' | '3d-cinema' | Style2D | 'intro' | 'outro'; num?: number; name: string; tags: string[]};
const SEGS: Seg[] = [
  {kind: 'intro', name: '', tags: []},
  {kind: '3d-lowpoly', num: 1, name: 'KARTUN 3D LOW-POLY', tags: ['WATAK CHIBI', 'DUNIA 3D BERSEGI', 'KAMERA BERGERAK']},
  {kind: '3d-cinema', num: 2, name: '3D SINEMATIK', tags: ['CAHAYA SENJA', 'COLOR GRADING', 'BINGKAI FILEM']},
  {kind: 'wayang', num: 3, name: 'WAYANG KULIT', tags: ['BAYANG BERUKIR', 'KAIN BERCAHAYA', 'GAYA TOK DALANG']},
  {kind: 'paper', num: 4, name: 'BUKU CERITA KERTAS', tags: ['KERTAS BERLAPIS', 'BAYANG LEMBUT', 'STOP MOTION']},
  {kind: 'pixel', num: 5, name: 'PIXEL ART', tags: ['RETRO GAME', 'PIKSEL BESAR', 'SIRI PEMBELAJARAN']},
  {kind: 'comic', num: 6, name: 'KOMIK BERGERAK', tags: ['PANEL KOMIK', 'BELON DIALOG', 'KESAN BUNYI']},
  {kind: 'line', num: 7, name: 'LUKISAN TANGAN', tags: ['GARISAN DILAKAR', 'KERTAS PUTIH', 'GAYA BERCERITA']},
  {kind: 'batik', num: 8, name: 'FLAT 2D BATIK', tags: ['CORAK BATIK', 'BINGKAI SONGKET', 'WARNA TRADISIONAL']},
  {kind: 'outro', name: '', tags: []},
];

const CYCLE: Style2D[] = ['wayang', 'paper', 'pixel', 'comic', 'line', 'batik'];

const Title: React.FC<{seg: Seg}> = ({seg}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{position: 'absolute', left: 50, top: 150, display: 'flex', alignItems: 'center', gap: 18, transform: `scale(${interpolate(frame, [0, 8], [0.6, 1], clamp)})`, transformOrigin: 'left center'}}>
        <div style={{background: '#ffd23f', border: '6px solid #111', borderRadius: 24, padding: '4px 22px', fontFamily: FONT, fontWeight: 900, fontSize: 64, color: '#111'}}>{seg.num}</div>
        <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 62, color: '#fff', ...outline(12)}}>{seg.name}</div>
      </div>
      {seg.tags.map((tg, i) => (
        <Chip key={tg} text={tg} at={14 + i * 12} x={50} y={270 + i * 82} bg={['#ffffff', '#9cc3ff', '#b8f0c8'][i]} dot="#111" size={32} />
      ))}
    </>
  );
};

const Segment: React.FC<{index: number}> = ({index}) => {
  const frame = useCurrentFrame();
  const shot = SHOTS[index];
  const seg = SEGS[index];
  const caps = <Captions shot={shot} y={1500} />;
  let visual: React.ReactNode;
  if (seg.kind === '3d-lowpoly') visual = <TanggangScene3D index={8} />;
  else if (seg.kind === '3d-cinema')
    visual = (
      <AbsoluteFill>
        <AbsoluteFill style={{filter: 'contrast(1.18) saturate(1.3) brightness(0.92) sepia(0.18)'}}>
          <TanggangScene3D index={7} />
        </AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,140,60,0.25), rgba(80,30,90,0.25))', mixBlendMode: 'soft-light'}} />
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.65) 100%)'}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120, background: '#000'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 120, background: '#000'}} />
      </AbsoluteFill>
    );
  else if (seg.kind === 'intro' || seg.kind === 'outro') {
    const st = CYCLE[Math.floor(frame / 14) % CYCLE.length];
    visual = (
      <AbsoluteFill>
        <Scene2D style={st} frameOffset={200} />
        <AbsoluteFill style={{background: 'rgba(10,10,30,0.45)'}} />
      </AbsoluteFill>
    );
  } else visual = <Scene2D style={seg.kind} />;
  return (
    <AbsoluteFill style={{background: '#111'}}>
      {visual}
      {seg.kind === 'intro' ? (
        <>
          <Punch text={'SATU CERITA,\n8 GAYA VIDEO'} at={6} y={300} size={120} />
          <Punch text="SI TANGGANG" at={cue(shot, 'Tanggang', 4)} y={640} size={90} color="#ffffff" />
          {caps}
        </>
      ) : seg.kind === 'outro' ? (
        <>
          <div style={{position: 'absolute', left: 60, right: 60, top: 220, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
            {SEGS.filter((s) => s.num).map((s, i) => (
              <div key={s.name} style={{background: '#fff', border: '6px solid #111', borderRadius: 26, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, opacity: frame >= 6 + i * 5 ? 1 : 0}}>
                <div style={{background: '#ffd23f', borderRadius: 14, padding: '0 14px', fontFamily: FONT, fontWeight: 900, fontSize: 46}}>{s.num}</div>
                <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 30, color: '#111', lineHeight: 1.05}}>{s.name}</div>
              </div>
            ))}
          </div>
          <Punch text={'KOMEN NOMBOR\nGAYA PILIHAN!'} at={cue(shot, 'Komen', 3)} y={1060} size={104} />
          {caps}
        </>
      ) : (
        <>
          <Title seg={seg} />
          {caps}
        </>
      )}
      {index > 0 ? <AbsoluteFill style={{background: '#fff', opacity: interpolate(frame, [0, 6], [0.6, 0], clamp)}} /> : null}
      {shot.audio.map((a, k) => (
        <Sequence key={`vo${k}`} from={a.from} name="VO">
          <Audio src={staticFile(a.src)} />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={FPS} name="SFX whoosh">
        <Audio src={staticFile('audio/sfx/whoosh.wav')} volume={0.3} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const StylesShot: React.FC<{index: number}> = ({index}) => <Segment index={index} />;

export const StylesVideo: React.FC = () => {
  const {durationInFrames} = useVideoConfig();
  const music = (f: number) => interpolate(f, [0, 15, durationInFrames - 45, durationInFrames], [0, 0.09, 0.09, 0], clamp);
  return (
    <AbsoluteFill>
      {SHOTS.map((s, i) => (
        <Sequence key={s.id} from={s.start} durationInFrames={s.frames} name={s.id}>
          <Segment index={i} />
        </Sequence>
      ))}
      <Audio src={staticFile('audio/music/bgm-shorts.wav')} loop volume={music} />
    </AbsoluteFill>
  );
};
