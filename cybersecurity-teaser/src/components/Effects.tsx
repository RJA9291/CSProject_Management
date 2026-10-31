import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {COLORS} from '../theme';

/** Animated film grain: cycles pre-rendered noise tiles (scripts/generate_grain.py). */
export const FilmGrain: React.FC<{opacity?: number}> = ({opacity = 0.09}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <Img src={staticFile(`images/grain/grain_${frame % 8}.png`)} style={{width: '100%', height: '100%', imageRendering: 'pixelated'}} />
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number; color?: string}> = ({strength = 0.85, color = '0,0,0'}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 75% 60% at 50% 48%, rgba(${color},0) 40%, rgba(${color},${strength}) 100%)`,
    }}
  />
);

export const ScanLines: React.FC<{opacity?: number}> = ({opacity = 0.06}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        opacity,
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 2px, transparent 5px)',
        backgroundPositionY: frame * 0.7,
      }}
    />
  );
};

/** Soft anamorphic light streak, used on reveals. */
export const LightStreak: React.FC<{y?: number; opacity: number; color?: string; width?: number}> = ({
  y = 960,
  opacity,
  color = COLORS.cyan,
  width = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: -200,
      right: -200,
      top: y - 3,
      height: 6,
      opacity,
      transform: `scaleX(${width})`,
      background: `linear-gradient(90deg, transparent, ${color} 30%, white 50%, ${color} 70%, transparent)`,
      boxShadow: `0 0 40px 12px ${color}`,
      filter: 'blur(1px)',
      mixBlendMode: 'screen',
    }}
  />
);

/** Full-frame flash used for hard cuts. */
export const Flash: React.FC<{at: number; dur?: number; color?: string; peak?: number}> = ({
  at,
  dur = 6,
  color = '#ffffff',
  peak = 0.85,
}) => {
  const frame = useCurrentFrame();
  const d = frame - at;
  if (d < 0 || d > dur) return null;
  const o = peak * (1 - d / dur) ** 2;
  return <AbsoluteFill style={{background: color, opacity: o, mixBlendMode: 'screen', pointerEvents: 'none'}} />;
};

/** Grid floor / backdrop for digital scenes. */
export const DigitalGrid: React.FC<{color?: string; opacity?: number; speed?: number}> = ({
  color = COLORS.blue,
  opacity = 0.25,
  speed = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{perspective: 900, overflow: 'hidden', opacity}}>
      <div
        style={{
          position: 'absolute',
          left: '-60%',
          right: '-60%',
          top: '55%',
          height: '120%',
          transform: 'rotateX(72deg)',
          transformOrigin: 'top center',
          backgroundImage: `linear-gradient(${color} 2px, transparent 2px), linear-gradient(90deg, ${color} 2px, transparent 2px)`,
          backgroundSize: '90px 90px',
          backgroundPositionY: frame * 2.2 * speed,
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 70%)',
        }}
      />
    </AbsoluteFill>
  );
};
