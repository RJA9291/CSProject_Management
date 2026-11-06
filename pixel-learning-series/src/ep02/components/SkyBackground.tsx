import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {CLOUD} from '../../assets/icons/icons';
import {office, PACKET} from '../assets/icons';
import {PixelSprite} from '../../components/PixelSprite';
import {COLORS} from '../../config/theme';
import {EP02_THEME} from '../config/theme';

// Stepped sky bands (pale at the top, sky blue lower down) keep the gradient pixel-like.
const BANDS = ['#D8F2FD', '#CDEEFC', '#BFE9FB', '#B0E3FA', '#A0DDF9', '#90D6F8', '#80D0F6', '#72CBF5', '#65C7F4'];

const CLOUDS = Array.from({length: 7}, (_, i) => ({
  y: 120 + random(`cy${i}`) * 1200,
  x: random(`cx${i}`) * 1300,
  px: [6, 8, 10][i % 3],
  speed: 0.25 + random(`cs${i}`) * 0.35,
  opacity: 0.55 + random(`co${i}`) * 0.3,
}));

const SKYLINE = [
  {x: 0, w: 14, h: 22},
  {x: 150, w: 12, h: 30},
  {x: 280, w: 16, h: 18},
  {x: 440, w: 12, h: 26},
  {x: 570, w: 16, h: 34},
  {x: 740, w: 12, h: 20},
  {x: 870, w: 16, h: 28},
];

type Props = {
  // 0..1 portion of the sky revealed (top to bottom, in pixel bands) over the beige world.
  reveal?: number;
};

// Episode 02 "Blue Pixel World": sky bands, drifting pixel clouds, server skyline with live links.
export const SkyBackground: React.FC<Props> = ({reveal = 1}) => {
  const frame = useCurrentFrame();
  const bandH = 1920 / BANDS.length;
  const shown = Math.ceil(reveal * BANDS.length * 2) / 2;
  const skylineY = 1920 - 200;
  return (
    <AbsoluteFill style={{background: COLORS.bg}}>
      {BANDS.map((c, i) =>
        i < shown ? <div key={c} style={{position: 'absolute', left: 0, top: i * bandH, width: 1080, height: bandH + 1, background: c}} /> : null,
      )}
      <AbsoluteFill style={{opacity: reveal}}>
        <svg width="1080" height="1920" style={{position: 'absolute'}} shapeRendering="crispEdges">
          <defs>
            <pattern id="skydots" width="48" height="48" patternUnits="userSpaceOnUse">
              <rect x="20" y="20" width="6" height="6" fill="#FFFFFF" opacity="0.35" />
            </pattern>
          </defs>
          <rect width="1080" height="1920" fill="url(#skydots)" />
        </svg>
        {CLOUDS.map((c, i) => {
          const x = ((((c.x + frame * c.speed) % 1400) + 1400) % 1400) - 250;
          return (
            <div key={i} style={{position: 'absolute', left: Math.round(x / 4) * 4, top: c.y, opacity: c.opacity}}>
              <PixelSprite sprite={CLOUD} px={c.px} />
            </div>
          );
        })}
        {/* Data links between skyline buildings */}
        <div style={{position: 'absolute', left: 0, top: skylineY - 40, width: 1080, height: 8, background: `repeating-linear-gradient(90deg, ${EP02_THEME.white} 0 12px, transparent 12px 24px)`, opacity: 0.6}} />
        {[0, 1, 2].map((k) => {
          const x = ((frame * 6 + k * 360) % 1200) - 60;
          return (
            <div key={k} style={{position: 'absolute', left: Math.round(x / 4) * 4, top: skylineY - 48}}>
              <PixelSprite sprite={PACKET} px={4} />
            </div>
          );
        })}
        {SKYLINE.map((b, i) => (
          <div key={i} style={{position: 'absolute', left: b.x + 20, top: 1920 - b.h * 8, opacity: 0.9}}>
            <PixelSprite
              sprite={office(i % 2 ? 'U' : 'V', 'u', b.w, b.h)}
              px={8}
              palette={Math.floor(frame / 15 + i) % 3 === 0 ? {Z: '#F4C430'} : undefined}
            />
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
