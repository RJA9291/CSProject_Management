import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ROUTER} from '../../components/PixelIcons';
import {PixelSprite, Sprite} from '../../components/PixelSprite';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {PACKET, PACKET_BACK} from '../../ep02/assets/icons';
import {DataFlow} from '../../ep02/components/DataFlow';
import {SWITCH, WIFI} from '../assets/icons';
import {EP04_THEME} from '../config/theme';

type Pt = [number, number];

type LinkProps = {
  a: Pt;
  b: Pt;
  // Frame the cable starts drawing from a to b.
  start: number;
  dur?: number;
  color?: string;
  width?: number;
  // Turns green once connected (frame), e.g. when a device is online.
  okAt?: number;
  // Packets travelling a -> b (and optionally back) once drawn.
  packets?: 'none' | 'forward' | 'both';
  every?: number;
  travel?: number;
  // Wireless links are dotted.
  wireless?: boolean;
  until?: number;
};

// Network cable that draws itself, with marching dashes and optional data packets.
export const NetLink: React.FC<LinkProps> = ({a, b, start, dur = 12, color = EP04_THEME.blue, width = 8, okAt, packets = 'none', every = 16, travel = 26, wireless = false, until = Infinity}) => {
  const frame = useCurrentFrame();
  if (frame < start || frame >= until) return null;
  const p = interpolate(frame, [start, start + dur], [0, 1], {extrapolateRight: 'clamp'});
  const x2 = a[0] + (b[0] - a[0]) * p;
  const y2 = a[1] + (b[1] - a[1]) * p;
  const c = okAt !== undefined && frame >= okAt ? EP04_THEME.green : color;
  const drawn = start + dur;
  return (
    <>
      <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} shapeRendering="crispEdges">
        <line x1={a[0]} y1={a[1]} x2={x2} y2={y2} stroke={COLORS.text} strokeWidth={width + 6} strokeDasharray={wireless ? '10 14' : undefined} strokeDashoffset={-frame * 2} />
        <line x1={a[0]} y1={a[1]} x2={x2} y2={y2} stroke={c} strokeWidth={width} strokeDasharray={wireless ? '10 14' : '16 8'} strokeDashoffset={-frame * 2} />
      </svg>
      {packets !== 'none' ? <DataFlow points={[a, b]} start={drawn} end={until} every={every} travel={travel} sprite={PACKET} px={4} /> : null}
      {packets === 'both' ? <DataFlow points={[b, a]} start={drawn + Math.round(every / 2)} end={until} every={every} travel={travel} sprite={PACKET_BACK} px={4} /> : null}
    </>
  );
};

type DeviceProps = {
  sprite: Sprite;
  x: number;
  y: number;
  px?: number;
  label?: string;
  delay: number;
  labelColor?: string;
  labelSize?: number;
  dark?: boolean;
  palette?: Record<string, string>;
};

// Device icon that pops in with a label underneath.
export const Device: React.FC<DeviceProps> = ({sprite, x, y, px = 6, label, delay, labelColor = COLORS.text, labelSize = 30, dark = false, palette}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 10);
  const w = (sprite[0]?.length ?? 0) * px;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, transform: `scale(${s})`, opacity: frame >= delay ? 1 : 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <PixelSprite sprite={sprite} px={px} palette={palette} />
      {label ? (
        <div
          style={{
            marginTop: 8,
            fontFamily: FONTS.heading,
            fontWeight: 900,
            fontSize: labelSize,
            color: dark ? COLORS.white : labelColor,
            whiteSpace: 'nowrap',
            background: dark ? 'rgba(10,31,74,0.85)' : 'rgba(243,239,230,0.9)',
            padding: '0 8px',
          }}
        >
          {label}
        </div>
      ) : null}
    </div>
  );
};

// Router with blinking indicator lights.
export const routerSprite = (frame: number): Sprite => {
  const k = Math.floor(frame / 5) % 3;
  return ROUTER.map((row, y) => (y === 10 ? row.replace(/E/g, k === 0 ? 'E' : 'e').replace(/O/g, k === 1 ? 'O' : 'o') : row));
};

// Switch with port LEDs chasing.
export const switchSprite = (frame: number): Sprite => SWITCH(Math.floor(frame / 5));

// Wi-Fi symbol whose bars cycle like a live signal.
export const wifiSprite = (frame: number, start = 0): Sprite => WIFI(frame < start ? 0 : Math.min(3, Math.floor((frame - start) / 5)) === 3 ? 1 + (Math.floor(frame / 10) % 3) : Math.min(3, Math.floor((frame - start) / 5)));
