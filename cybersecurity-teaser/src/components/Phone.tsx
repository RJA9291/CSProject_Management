import React from 'react';
import {COLORS, FONTS} from '../theme';

export const SCREEN_W = 564;
export const SCREEN_H = 1204;

type Props = {
  x?: number;
  y?: number;
  scale?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  glow?: string;
  glowStrength?: number;
  time?: string;
  children: React.ReactNode;
  overlay?: React.ReactNode; // drawn above the screen glass (thumb, ripples)
};

/** Stylised modern smartphone. Screen content is laid out in a 564x1204 box. */
export const Phone: React.FC<Props> = ({
  x = 0,
  y = 0,
  scale = 1,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  glow = COLORS.blue,
  glowStrength = 1,
  time = '11:47',
  children,
  overlay,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 600,
        height: 1240,
        marginLeft: -300,
        marginTop: -620,
        transform: `perspective(2200px) translate(${x}px, ${y}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* screen light spilling into the scene */}
      <div
        style={{
          position: 'absolute',
          inset: -260,
          borderRadius: '50%',
          background: `radial-gradient(closest-side, ${glow}55, transparent 70%)`,
          opacity: 0.7 * glowStrength,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 86,
          background: 'linear-gradient(145deg, #3a4050 0%, #12151c 35%, #0b0d12 60%, #2b303b 100%)',
          boxShadow: `0 40px 120px rgba(0,0,0,0.8), inset 0 0 0 2px rgba(255,255,255,0.08), 0 0 60px ${glow}33`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 18,
          top: 18,
          width: SCREEN_W,
          height: SCREEN_H,
          borderRadius: 68,
          overflow: 'hidden',
          background: '#05070d',
        }}
      >
        {children}
        <StatusBar time={time} />
        {/* dynamic island */}
        <div
          style={{
            position: 'absolute',
            top: 22,
            left: '50%',
            width: 150,
            height: 44,
            marginLeft: -75,
            borderRadius: 22,
            background: '#000',
          }}
        />
        {/* glass reflection */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.05) 100%)',
            pointerEvents: 'none',
          }}
        />
        {overlay}
      </div>
    </div>
  );
};

const StatusBar: React.FC<{time: string}> = ({time}) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 88,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 46px 0 54px',
      fontFamily: FONTS.body,
      fontWeight: 600,
      fontSize: 24,
      color: 'white',
      zIndex: 5,
    }}
  >
    <span>{time}</span>
    <svg width="110" height="24" viewBox="0 0 110 24">
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 9} y={16 - i * 4} width="6" height={6 + i * 4} rx="1.5" fill="white" />
      ))}
      <path d="M50 9 a14 14 0 0 1 20 0 l-3 3 a10 10 0 0 0 -14 0z M54 13 a8 8 0 0 1 12 0 l-6 6z" fill="white" />
      <rect x="78" y="5" width="28" height="14" rx="4" fill="none" stroke="white" strokeWidth="2" />
      <rect x="81" y="8" width="18" height="8" rx="2" fill="white" />
    </svg>
  </div>
);

/** Touch ripple + abstract fingertip used to show taps / scrolls. */
export const Touch: React.FC<{x: number; y: number; press: number; visible: number}> = ({x, y, press, visible}) => (
  <div style={{position: 'absolute', left: x, top: y, opacity: visible, pointerEvents: 'none', zIndex: 20}}>
    <div
      style={{
        position: 'absolute',
        width: 70 + press * 90,
        height: 70 + press * 90,
        left: -(35 + press * 45),
        top: -(35 + press * 45),
        borderRadius: '50%',
        border: `3px solid rgba(255,255,255,${0.7 * (1 - press)})`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: 64,
        height: 64,
        left: -32,
        top: -32,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.55), rgba(255,255,255,0.12) 60%, transparent 70%)',
        transform: `scale(${1 - press * 0.2})`,
      }}
    />
  </div>
);
