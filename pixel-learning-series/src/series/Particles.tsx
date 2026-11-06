import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {HEART, THUMB} from '../assets/icons/icons';
import {PixelSprite} from '../components/PixelSprite';
import {snap} from '../lib/anim';

const CONFETTI = ['#C93434', '#F4A51C', '#39A86B', '#2586C7', '#65C7F4', '#7B4FC9'];

// Hearts / thumbs-up drifting upward inside a region (series-wide celebration effect).
export const Reactions: React.FC<{start: number; x: number; width: number; bottom: number; rise?: number; count?: number; thumbs?: boolean}> = ({
  start,
  x,
  width,
  bottom,
  rise = 600,
  count = 8,
  thumbs = true,
}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  return (
    <>
      {Array.from({length: count}, (_, i) => {
        const life = 80;
        const t = ((frame - start + i * 10) % life) / life;
        return (
          <div key={i} style={{position: 'absolute', left: snap(x + random(`rx${i}`) * width, 4), top: snap(bottom - t * rise, 4), opacity: 1 - t * t}}>
            <PixelSprite sprite={thumbs && i % 2 === 0 ? THUMB : HEART} px={i % 3 === 0 ? 7 : 5} />
          </div>
        );
      })}
    </>
  );
};

// Pixel confetti falling from the top of the screen.
export const Confetti: React.FC<{start: number; count?: number}> = ({start, count = 40}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const t = frame - start;
  return (
    <>
      {Array.from({length: count}, (_, i) => {
        const speed = 7 + random(`cf${i}`) * 6;
        const y = -40 + t * speed - random(`cd${i}`) * 500;
        if (y < -40 || y > 1600) return null;
        const x = random(`cx${i}`) * 1060 + Math.sin((t + i * 7) / 9) * 20;
        const size = i % 3 === 0 ? 16 : 10;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: snap(x, 4),
              top: snap(y, 4),
              width: size,
              height: Math.floor(t / 4 + i) % 2 ? size : size / 2,
              background: CONFETTI[i % CONFETTI.length],
            }}
          />
        );
      })}
    </>
  );
};
