import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Shot} from '../../lib/timeline';

const FONT = 'Rubik, Inter, sans-serif';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Thick black outline + drop shadow, like short-video captions.
export const outline = (px: number): React.CSSProperties => ({
  WebkitTextStroke: `${px}px #111`,
  paintOrder: 'stroke fill',
  textShadow: `0 ${Math.round(px * 0.6)}px 0 rgba(0,0,0,0.55)`,
});

const bare = (w: string) => w.replace(/[^\p{L}\p{N}?!]/gu, '').toLowerCase();

// Groups the shot's words into 2–4 word chunks (breaking on punctuation) shown as they are spoken.
const chunks = (shot: Shot) => {
  const out: {words: string[]; start: number; end: number}[] = [];
  let cur: string[] = [];
  let start = 0;
  shot.words.forEach((w, i) => {
    if (!cur.length) start = w.start;
    cur.push(w.text);
    const brk = /[.,!?]$/.test(w.text) || cur.length >= 4 || cur.join(' ').length > 18;
    if (brk || i === shot.words.length - 1) {
      out.push({words: cur, start, end: shot.words[i + 1]?.start ?? w.end + 0.6});
      cur = [];
    }
  });
  return out;
};

export const Captions: React.FC<{shot: Shot; y?: number}> = ({shot, y = 1180}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const list = chunks(shot);
  const c = list.find((k) => t >= k.start - 0.03 && t < k.end);
  if (!c) return null;
  const hl = new Set(shot.highlight.map(bare));
  const s = spring({frame: frame - Math.round(c.start * fps), fps, config: {damping: 12, stiffness: 220, mass: 0.6}});
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: y, textAlign: 'center', transform: `scale(${0.7 + 0.3 * s})`}}>
      <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 84, lineHeight: 1.05, color: '#fff', textTransform: 'uppercase', ...outline(14)}}>
        {c.words.map((w, i) => (
          <span key={i} style={{color: hl.has(bare(w)) ? '#ffd23f' : '#fff'}}>
            {w.replace(/[,.]$/, '')}
            {i < c.words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </span>
    </div>
  );
};

// Big punch caption (e.g. "MACAM MANA DIA TAHU?").
export const Punch: React.FC<{text: string; at: number; y: number; color?: string; size?: number}> = ({text, at, y, color = '#ffd23f', size = 110}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const s = spring({frame: frame - at, fps, config: {damping: 9, stiffness: 200, mass: 0.7}});
  const wobble = Math.sin((frame - at) / 4) * 2 * Math.exp(-(frame - at) / 20);
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: y, textAlign: 'center', transform: `scale(${s}) rotate(${wobble}deg)`}}>
      <span style={{fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1, color, whiteSpace: 'pre-line', ...outline(16)}}>{text}</span>
    </div>
  );
};

// Speedometer readout in the corner, like a dash-cam HUD.
export const Speedo: React.FC<{kmh: number}> = ({kmh}) => (
  <div style={{position: 'absolute', left: 50, top: 980, display: 'flex', alignItems: 'baseline', gap: 10, color: '#fff'}}>
    <div style={{width: 8, height: 92, background: '#fff', marginRight: 8, alignSelf: 'center'}} />
    <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 104, ...outline(8)}}>{Math.round(kmh)}</span>
    <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 36, ...outline(6)}}>km/j</span>
  </div>
);

// Small rounded label chip (notifications, legend).
export const Chip: React.FC<{text: string; at: number; x: number; y: number; bg: string; dot?: string; size?: number}> = ({text, at, x, y, bg, dot, size = 40}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const s = spring({frame: frame - at, fps, config: {damping: 11, stiffness: 220, mass: 0.6}});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s})`, transformOrigin: 'left center', display: 'flex', alignItems: 'center', gap: 12, background: bg, borderRadius: 999, padding: '10px 26px', boxShadow: '0 8px 0 rgba(0,0,0,0.25)', border: '5px solid #111'}}>
      {dot ? <div style={{width: 22, height: 22, borderRadius: 999, background: dot, border: '3px solid #111'}} /> : null}
      <span style={{fontFamily: FONT, fontWeight: 900, fontSize: size, color: '#111', whiteSpace: 'nowrap'}}>{text}</span>
    </div>
  );
};

// Generic navigation app on a phone (no real app branding): route line coloured by traffic level.
export const PhoneMap: React.FC<{at: number; x: number; y: number; level: number; reroute?: number; banner?: string; bannerColor?: string; scale?: number}> = ({
  at,
  x,
  y,
  level,
  reroute,
  banner,
  bannerColor = '#e03c3c',
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const s = spring({frame: frame - at, fps, config: {damping: 12, stiffness: 180, mass: 0.7}});
  const jamColor = level < 1 ? '#36a86b' : level < 2 ? '#f4a51c' : '#e03c3c';
  const alt = reroute !== undefined && frame >= reroute;
  const altDraw = alt ? interpolate(frame, [reroute!, reroute! + 20], [0, 1], clamp) : 0;
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 420, height: 760, transform: `scale(${s * scale}) rotate(${-4 + (1 - s) * 10}deg)`, transformOrigin: 'center'}}>
      <div style={{position: 'absolute', inset: 0, background: '#15171c', borderRadius: 56, boxShadow: '0 18px 0 rgba(0,0,0,0.3)', border: '6px solid #0a0b0e'}} />
      <div style={{position: 'absolute', left: 18, top: 18, right: 18, bottom: 18, borderRadius: 42, overflow: 'hidden', background: '#e9eef3'}}>
        <svg width="384" height="724" viewBox="0 0 384 724">
          {/* blocks + parks */}
          <rect width="384" height="724" fill="#e9eef3" />
          {[[30, 60, 120, 140], [230, 40, 120, 170], [40, 300, 110, 150], [240, 330, 110, 120], [30, 520, 130, 150], [240, 520, 120, 160]].map(([bx, by, bw, bh], i) => (
            <rect key={i} x={bx} y={by} width={bw} height={bh} rx="14" fill={i % 3 === 1 ? '#cfe8c8' : '#dde3ea'} />
          ))}
          {/* roads */}
          <path d="M192 724 L192 0" stroke="#ffffff" strokeWidth="34" />
          <path d="M0 250 L384 250" stroke="#ffffff" strokeWidth="26" />
          <path d="M0 480 L384 480" stroke="#ffffff" strokeWidth="26" />
          <path d="M330 724 L330 0" stroke="#ffffff" strokeWidth="22" />
          {/* route: clear part then the jam ahead */}
          <path d="M192 640 L192 480" stroke="#3a86f0" strokeWidth="18" strokeLinecap="round" />
          <path d="M192 480 L192 120" stroke={alt ? '#9aa4b2' : jamColor} strokeWidth="18" strokeLinecap="round" strokeDasharray={level >= 2 && blink && !alt ? '30 10' : undefined} />
          {alt ? (
            <path d="M192 480 L330 480 L330 120" stroke="#36a86b" strokeWidth="18" strokeLinecap="round" fill="none" pathLength={1} strokeDasharray={`${altDraw} 1`} />
          ) : null}
          {/* car arrow */}
          <g transform="translate(192 640)">
            <circle r="26" fill="#ffffff" stroke="#3a86f0" strokeWidth="6" />
            <path d="M0 -14 L11 12 L0 6 L-11 12 Z" fill="#3a86f0" />
          </g>
        </svg>
        {banner ? (
          <div style={{position: 'absolute', left: 16, right: 16, top: 22, background: alt ? '#36a86b' : bannerColor, borderRadius: 22, padding: '14px 18px', fontFamily: FONT, fontWeight: 900, fontSize: 30, color: '#fff', textAlign: 'center', lineHeight: 1.1}}>
            {alt ? 'Laluan lebih cepat ditemui!' : banner}
          </div>
        ) : null}
      </div>
    </div>
  );
};
