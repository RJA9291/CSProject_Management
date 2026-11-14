// Motion-comic toolkit: page, panels (pop-in + slow push-in), halftone, speech bubbles,
// narration boxes and big SFX lettering. Panel content is drawn in the panel's own pixel space.
import React from 'react';
import {interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {look} from './look';

export const INK = '#141414';
const FONT = 'Rubik, Inter, sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const ComicDefs: React.FC = () => (
  <defs>
    <filter id="pp-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="5" dy="9" stdDeviation="5" floodColor="#3a2a1a" floodOpacity="0.32" />
    </filter>
    <filter id="pp-card" x="-10%" y="-10%" width="125%" height="125%">
      <feDropShadow dx="10" dy="16" stdDeviation="10" floodColor="#3a2a1a" floodOpacity="0.35" />
    </filter>
    <filter id="pp-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="5" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <pattern id="ht-dark" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
      <circle cx="7" cy="7" r="2.6" fill={look.paper ? '#3a2a1a' : INK} opacity={look.paper ? 0.12 : 0.55} />
    </pattern>
    <pattern id="ht-light" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
      <circle cx="8" cy="8" r="2.2" fill="#ffffff" opacity="0.5" />
    </pattern>
    <pattern id="ht-red" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
      <circle cx="9" cy="9" r="3.4" fill={look.paper ? '#c9a06a' : '#e0483a'} opacity={look.paper ? 0.5 : 1} />
    </pattern>
  </defs>
);

export type PanelDef = {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
  at: number; // frame it appears
  tilt?: number;
  draw: (f: number, w: number, h: number) => React.ReactNode; // f = frames since appearance
};

const Panel: React.FC<{p: PanelDef}> = ({p}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < p.at) return null;
  const raw = frame - p.at;
  // Paper look animates "on fours" like stop motion.
  const f = look.paper ? Math.floor(raw / 4) * 4 : raw;
  const s = spring({frame: f, fps, config: {damping: 13, stiffness: 180, mass: 0.7}});
  const push = 1 + Math.min(f, 240) * 0.00025;
  const cx = p.x + p.w / 2;
  const cy = p.y + p.h / 2;
  if (look.paper) {
    // A paper card glued on the page: white border, soft shadow, a slight hand-placed tilt.
    const tilt = (p.tilt ?? 0) + (((p.key.charCodeAt(0) * 7) % 5) - 2) * 0.5 + Math.sin(Math.floor(raw / 4)) * 0.15;
    const drop = interpolate(raw, [0, 10], [-60, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
    return (
      <g transform={`translate(0 ${drop}) translate(${cx} ${cy}) rotate(${tilt}) translate(${-cx} ${-cy})`} opacity={Math.min(1, raw / 6)} filter="url(#pp-card)">
        <rect x={p.x - 14} y={p.y - 14} width={p.w + 28} height={p.h + 28} rx={10} fill="#fffdf6" />
        <svg x={p.x} y={p.y} width={p.w} height={p.h} viewBox={`0 0 ${p.w} ${p.h}`} overflow="hidden">
          <ComicDefs />
          <g transform={`translate(${p.w / 2} ${p.h / 2}) scale(${push}) translate(${-p.w / 2} ${-p.h / 2})`}>{p.draw(f, p.w, p.h)}</g>
          <image href={staticFile('textures/paper-grain.png')} width={p.w} height={p.h} preserveAspectRatio="none" opacity={0.18} style={{mixBlendMode: 'multiply'}} />
        </svg>
      </g>
    );
  }
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${p.tilt ?? 0}) scale(${0.7 + 0.3 * s}) translate(${-cx} ${-cy})`} opacity={Math.min(1, s * 1.5)}>
      <rect x={p.x + 12} y={p.y + 14} width={p.w} height={p.h} fill={INK} />
      <svg x={p.x} y={p.y} width={p.w} height={p.h} viewBox={`0 0 ${p.w} ${p.h}`} overflow="hidden">
        <ComicDefs />
        <g transform={`translate(${p.w / 2} ${p.h / 2}) scale(${push}) translate(${-p.w / 2} ${-p.h / 2})`}>{p.draw(f, p.w, p.h)}</g>
      </svg>
      <rect x={p.x} y={p.y} width={p.w} height={p.h} fill="none" stroke={INK} strokeWidth={10} />
    </g>
  );
};

// A comic page with a coloured paper background; slides in at the start of the shot.
export const Page: React.FC<{panels: PanelDef[]; bg?: string; children?: React.ReactNode}> = ({panels, bg = '#fff6e0', children}) => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [0, 10], [140, 0], {...clamp, easing: (v) => 1 - Math.pow(1 - v, 3)});
  return (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <ComicDefs />
      <g transform={`translate(${slide} 0)`}>
        <rect width={1080} height={1920} fill={look.paper ? '#efe3c8' : bg} />
        {look.paper ? (
          <>
            <image href={staticFile('textures/paper-grain.png')} width={1080} height={1920} preserveAspectRatio="none" opacity={0.25} style={{mixBlendMode: 'multiply'}} />
            <rect x={530} y={0} width={20} height={1920} fill="#d9c9a6" opacity={0.6} />
          </>
        ) : (
          <rect width={1080} height={1920} fill="url(#ht-red)" opacity={0.08} />
        )}
        {panels.map((p) => (
          <Panel key={p.key} p={p} />
        ))}
        {children}
      </g>
    </svg>
  );
};

// Speech bubble (oval) with a tail pointing at (tx, ty). Coordinates in the current SVG space.
export const Speech: React.FC<{x: number; y: number; w: number; h: number; tx: number; ty: number; text: string; size?: number; shout?: boolean; show?: boolean}> = ({x, y, w, h, tx, ty, text, size = 34, shout, show = true}) => {
  if (!show) return null;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const lines = text.split('\n');
  const edge = look.paper ? '#fff' : INK;
  return (
    <g filter={look.paper ? 'url(#pp-shadow)' : undefined}>
      <polygon points={`${cx - w * 0.12},${cy + h * 0.3} ${tx},${ty} ${cx + w * 0.05},${cy + h * 0.38}`} fill="#fff" stroke={edge} strokeWidth={5} strokeLinejoin="round" />
      {shout ? (
        <polygon
          points={Array.from({length: 22}, (_, i) => {
            const a = (i / 22) * Math.PI * 2;
            const r = i % 2 ? 1 : 1.16;
            return `${cx + Math.cos(a) * (w / 2) * r},${cy + Math.sin(a) * (h / 2) * r}`;
          }).join(' ')}
          fill="#fff"
          stroke={edge}
          strokeWidth={5}
        />
      ) : (
        <ellipse cx={cx} cy={cy} rx={w / 2} ry={h / 2} fill="#fff" stroke={edge} strokeWidth={5} />
      )}
      {lines.map((l, i) => (
        <text key={i} x={cx} y={cy + (i - (lines.length - 1) / 2) * size * 1.1 + size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={look.paper ? '#4a3320' : INK}>
          {l}
        </text>
      ))}
    </g>
  );
};

// Yellow narration box.
export const Narr: React.FC<{x: number; y: number; w: number; text: string; size?: number; show?: boolean; bg?: string}> = ({x, y, w, text, size = 30, show = true, bg = '#ffd23f'}) => {
  if (!show) return null;
  const lines = text.split('\n');
  const h = lines.length * size * 1.15 + 26;
  if (look.paper) {
    const fill = bg === '#ffd23f' ? '#fff3c4' : bg;
    return (
      <g filter="url(#pp-shadow)" transform={`rotate(-1.5 ${x} ${y})`}>
        <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} stroke="#ffffff" strokeWidth={6} />
        <rect x={x + w / 2 - 40} y={y - 14} width={80} height={26} fill="#e9dcb8" opacity={0.85} transform={`rotate(-4 ${x + w / 2} ${y})`} />
        {lines.map((l, i) => (
          <text key={i} x={x + 18} y={y + 13 + size * 0.92 + i * size * 1.15} fontFamily={FONT} fontWeight={900} fontSize={size} fill="#4a3320">
            {l}
          </text>
        ))}
      </g>
    );
  }
  return (
    <g>
      <rect x={x + 6} y={y + 7} width={w} height={h} fill={INK} />
      <rect x={x} y={y} width={w} height={h} fill={bg} stroke={INK} strokeWidth={5} />
      {lines.map((l, i) => (
        <text key={i} x={x + 18} y={y + 13 + size * 0.92 + i * size * 1.15} fontFamily={FONT} fontWeight={900} fontSize={size} fill={INK}>
          {l}
        </text>
      ))}
    </g>
  );
};

// Big SFX lettering (outlined, skewed) that pops.
export const Sfx: React.FC<{x: number; y: number; text: string; f: number; size?: number; color?: string; rot?: number}> = ({x, y, text, f, size = 110, color = '#ffd23f', rot = -10}) => {
  if (f < 0) return null;
  const s = Math.min(1.15, 0.3 + f * 0.12) - Math.max(0, f - 6) * 0.01;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${Math.max(1, s)})`} filter={look.paper ? 'url(#pp-shadow)' : undefined}>
      <text textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} fill={look.paper && color === '#ffffff' ? '#e0483a' : color} stroke={look.paper ? '#ffffff' : INK} strokeWidth={size * 0.09} paintOrder="stroke" letterSpacing={2}>
        {text}
      </text>
    </g>
  );
};

// Radiating speed lines behind a focal point.
export const SpeedLines: React.FC<{cx: number; cy: number; w: number; h: number; f: number}> = ({cx, cy, w, h, f}) => (
  <g opacity={look.paper ? 0.35 : 0.5}>
    {Array.from({length: 28}, (_, i) => {
      const a = (i / 28) * Math.PI * 2 + (f % 4) * 0.02;
      const r1 = 120 + (i % 3) * 30;
      const r2 = Math.max(w, h);
      return <line key={i} x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1} x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2} stroke={look.paper ? '#ffffff' : INK} strokeWidth={i % 2 ? 4 : 8} />;
    })}
  </g>
);
