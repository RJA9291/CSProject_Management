import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Grid, mirror, PixelSprite, Sprite} from '../../components/PixelSprite';
import {snap} from '../../lib/anim';

// Original pixel-art Linux penguin used as Episode 05's guide. One builder, so every scene
// shares the same proportions: black body, white belly, yellow beak and feet.
export type TuxPose = 'idle' | 'wave' | 'point' | 'celebrate';

export const TUX_W = 24;
export const TUX_H = 28;

const oval = (g: Grid, cx: number, cy: number, rx: number, ry: number, c: string) => {
  for (let y = -ry; y <= ry; y++)
    for (let x = -rx; x <= rx; x++) if ((x * x) / (rx * rx + 0.6) + (y * y) / (ry * ry + 0.6) <= 1) g.set(cx + x, cy + y, c);
};

const cache = new Map<string, Sprite>();

export const buildTux = (pose: TuxPose, frame = 0, blink = false): Sprite => {
  const key = `${pose}-${frame % 2}-${blink}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const g = new Grid(TUX_W, TUX_H);
  const alt = frame % 2 === 1;
  // Flippers drawn behind the body.
  const flipper = (x0: number, y0: number, x1: number, y1: number) => {
    g.line(x0, y0, x1, y1, 1, 'K');
  };
  if (pose === 'celebrate') {
    flipper(6, 13, alt ? 1 : 2, alt ? 5 : 6);
    flipper(17, 13, alt ? 22 : 21, alt ? 5 : 6);
  } else if (pose === 'wave') {
    flipper(5, 13, 3, 20);
    flipper(17, 12, alt ? 22 : 21, alt ? 4 : 6);
  } else if (pose === 'point') {
    flipper(5, 13, 3, 20);
    flipper(17, 13, 23, 12);
  } else {
    flipper(5, 13, 3, 20);
    flipper(18, 13, 20, 20);
  }
  // Body and belly.
  oval(g, 11, 16, 7, 9, 'K');
  oval(g, 11, 17, 5, 7, 'W');
  oval(g, 11, 17, 4, 6, 'w');
  oval(g, 11, 17, 3, 5, 'W');
  // Head.
  oval(g, 11, 6, 6, 5, 'K');
  g.rect(8, 4, 3, 3, 'W');
  g.rect(12, 4, 3, 3, 'W');
  if (blink) {
    g.rect(8, 4, 3, 3, 'K');
    g.rect(12, 4, 3, 3, 'K');
    g.rect(8, 5, 3, 1, 'W');
    g.rect(12, 5, 3, 1, 'W');
  } else {
    g.rect(9, 5, 1, 2, 'K');
    g.rect(13, 5, 1, 2, 'K');
  }
  // Beak (open while celebrating).
  g.rect(9, 8, 5, 1, 'O');
  g.rect(10, 9, 3, 1, pose === 'celebrate' ? 'R' : 'Y');
  g.rect(10, 10, 3, 1, 'O');
  // Feet.
  g.rect(5, 25, 6, 2, 'O');
  g.rect(13, 25, 6, 2, 'O');
  g.rect(5, 27, 6, 1, 'Y');
  g.rect(13, 27, 6, 1, 'Y');
  const s = g.toSprite();
  cache.set(key, s);
  return s;
};

type Props = {
  x: number;
  y: number;
  px?: number;
  pose?: TuxPose;
  // Face left instead of right.
  flip?: boolean;
  // Slide in from a side at frame `enterAt`.
  enter?: 'left' | 'right' | 'none';
  enterAt?: number;
  // Hop on the spot (celebrations) from this frame.
  hopFrom?: number;
  hopUntil?: number;
};

// Positioned, animated Tux: waddles while sliding in, blinks, hops when celebrating.
export const Tux: React.FC<Props> = ({x, y, px = 8, pose = 'idle', flip = false, enter = 'none', enterAt = 0, hopFrom = Infinity, hopUntil = Infinity}) => {
  const frame = useCurrentFrame();
  const p = enter === 'none' ? 0 : interpolate(frame, [enterAt, enterAt + 18], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  if (enter !== 'none' && frame < enterAt) return null;
  const dx = enter === 'left' ? -600 * p : enter === 'right' ? 600 * p : 0;
  const waddle = p > 0 ? (Math.floor(frame / 4) % 2 ? -1 : 1) * 3 : 0;
  const hopping = frame >= hopFrom && frame < hopUntil;
  const hop = hopping ? -Math.abs(Math.sin(((frame - hopFrom) / 10) * Math.PI)) * 4 * px : 0;
  const blink = frame % 90 > 84;
  const sprite = buildTux(hopping ? 'celebrate' : pose, Math.floor(frame / 8), blink);
  return (
    <div style={{position: 'absolute', left: snap(x + dx, px), top: snap(y + hop, 4), transform: `rotate(${waddle}deg)`, transformOrigin: '50% 100%'}}>
      <PixelSprite sprite={flip ? mirror(sprite) : sprite} px={px} />
    </div>
  );
};
