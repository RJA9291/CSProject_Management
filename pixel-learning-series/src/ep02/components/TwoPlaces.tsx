import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {Look} from '../../assets/characters/host';
import {LAPTOP} from '../../components/PixelIcons';
import {PixelCharacter} from '../../components/PixelCharacter';
import {PixelSprite, Sprite} from '../../components/PixelSprite';
import {snap} from '../../lib/anim';
import {PHONE} from '../assets/icons';

type Props = {
  look: Look;
  // Frame the character starts walking from the left place to the right place.
  moveAt: number;
  fromX: number;
  toX: number;
  y: number;
};

const WALK = 30;

// A supporting character using a laptop at one place, then a phone at another (data follows via the cloud).
export const Traveller: React.FC<Props> = ({look, moveAt, fromX, toX, y}) => {
  const frame = useCurrentFrame();
  const x = interpolate(frame, [moveAt, moveAt + WALK], [fromX, toX], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const walking = frame >= moveAt && frame < moveAt + WALK;
  const arrived = frame >= moveAt + WALK;
  const px = 8;
  const device: Sprite = arrived ? PHONE : LAPTOP;
  return (
    <div style={{position: 'absolute', left: snap(x, px), top: y}}>
      <PixelCharacter pose={walking ? 'walk' : 'hold'} look={look} px={px} step={5} expression="smile" />
      {walking ? null : (
        <div style={{position: 'absolute', left: arrived ? 19 * px : 12 * px, top: arrived ? 22 * px : 27 * px}}>
          <PixelSprite sprite={device} px={arrived ? 5 : 5} />
        </div>
      )}
    </div>
  );
};
