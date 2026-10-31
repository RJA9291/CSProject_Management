import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONTS} from '../theme';
import {clamp, ease, pop} from './motion';

type SlamProps = {
  text: string;
  at: number;
  out?: number;
  size?: number;
  color?: string;
  glow?: string;
  y?: number;
  font?: string;
  tracking?: number;
};

/** A word that slams in (scale + blur + tracking collapse) and fades out. */
export const SlamWord: React.FC<SlamProps> = ({
  text,
  at,
  out,
  size = 200,
  color = COLORS.white,
  glow = COLORS.blue,
  y = 0,
  font = FONTS.display,
  tracking = 0.04,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at || (out !== undefined && frame > out + 10)) return null;
  const s = pop(frame, fps, at, 16, 0.5);
  const scale = interpolate(s, [0, 1], [1.7, 1]);
  const blur = interpolate(frame, [at, at + 6], [18, 0], clamp);
  const fadeOut = out !== undefined ? interpolate(frame, [out, out + 8], [1, 0], clamp) : 1;
  const spread = interpolate(frame, [at, at + 40], [tracking + 0.18, tracking], {...clamp, easing: ease.out});
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: '50%',
        transform: `translateY(calc(-50% + ${y}px)) scale(${scale})`,
        textAlign: 'center',
        fontFamily: font,
        fontSize: size,
        lineHeight: 0.95,
        color,
        letterSpacing: `${spread}em`,
        opacity: Math.min(1, s * 1.4) * fadeOut,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
        textShadow: `0 0 30px ${glow}, 0 0 80px ${glow}`,
        whiteSpace: 'pre-line',
      }}
    >
      {text}
    </div>
  );
};

/** Characters decode from random glyphs into the final word (techno reveal). */
export const DecodeText: React.FC<{
  text: string;
  at: number;
  dur?: number;
  style?: React.CSSProperties;
}> = ({text, at, dur = 18, style}) => {
  const frame = useCurrentFrame();
  const glyphs = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$';
  const p = interpolate(frame, [at, at + dur], [0, 1], clamp);
  const shown = text
    .split('')
    .map((ch, i) => {
      if (ch === ' ' || ch === '.' || ch === ',') return ch;
      const t = i / Math.max(text.length - 1, 1);
      if (p >= t * 0.8 + 0.2) return ch;
      if (frame < at) return '';
      return glyphs[(i * 7 + Math.floor(frame * 1.7)) % glyphs.length];
    })
    .join('');
  return <span style={style}>{shown}</span>;
};
