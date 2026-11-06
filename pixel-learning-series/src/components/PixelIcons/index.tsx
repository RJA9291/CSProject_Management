import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {PX} from '../../config/theme';
import {float, pop} from '../../lib/anim';
import {PixelSprite, Sprite} from '../PixelSprite';

export * from '../../assets/icons/icons';

type Props = {
  sprite: Sprite;
  x: number;
  y: number;
  px?: number;
  delay?: number;
  // Float amplitude in px (0 = still).
  bob?: number;
  phase?: number;
  palette?: Record<string, string>;
  rotate?: number;
  children?: React.ReactNode;
};

// Positioned pixel icon that pops in at `delay` and then floats gently.
export const Icon: React.FC<Props> = ({sprite, x, y, px = PX, delay = 0, bob = 10, phase = 0, palette, rotate = 0, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay);
  const dy = bob ? float(frame, bob, 70, phase) : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y + dy,
        transform: `scale(${s}) rotate(${rotate}deg)`,
        opacity: frame >= delay ? 1 : 0,
      }}
    >
      <PixelSprite sprite={sprite} px={px} palette={palette} />
      {children}
    </div>
  );
};
