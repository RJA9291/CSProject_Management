import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {Expression, Pose} from '../../assets/characters/host';
import {AVATAR_LOOKS} from '../../assets/characters/people';
import {PixelCharacter} from '../../components/PixelCharacter';
import {snap} from '../../lib/anim';

// A supporting office/factory user built from the series' avatar looks (same body as the host).
export const User: React.FC<{look: string; x: number; y: number; px?: number; pose?: Pose; expression?: Expression; walkFrom?: number; walkAt?: number}> = ({
  look,
  x,
  y,
  px = 8,
  pose = 'neutral',
  expression,
  walkFrom,
  walkAt = 0,
}) => {
  const frame = useCurrentFrame();
  const walking = walkFrom !== undefined && frame >= walkAt && frame < walkAt + 24;
  if (walkFrom !== undefined && frame < walkAt) return null;
  const cx = walkFrom === undefined ? x : interpolate(frame, [walkAt, walkAt + 24], [walkFrom, x], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: snap(cx, px), top: y}}>
      <PixelCharacter pose={walking ? 'walk' : pose} look={AVATAR_LOOKS[look]} px={px} step={5} expression={expression} />
    </div>
  );
};
