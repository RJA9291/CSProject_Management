import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import type {Expression, Eyes, Look, Pose} from '../../assets/characters/host';
import {snap} from '../../lib/anim';
import {useTiming} from '../../lib/episode';
import {PixelCharacter} from '.';

type Props = {
  // Scene index; the host lip-syncs to that scene's voice-over.
  scene: number;
  x: number;
  y: number;
  pose: Pose;
  expression?: Expression;
  eyes?: Eyes;
  enter?: 'bottom' | 'left' | 'right' | 'none';
  enterFrames?: number;
  step?: number;
  look?: Look;
  // Disable lip-sync (e.g. for a supporting character who is not narrating).
  silent?: boolean;
};

// The on-screen presenter, placed and animated into a scene.
export const Host: React.FC<Props> = ({scene, x, y, pose, expression, eyes, enter = 'none', enterFrames = 16, step, look, silent}) => {
  const frame = useCurrentFrame();
  const {speakingRanges} = useTiming();
  const p = interpolate(frame, [0, enterFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const eased = p * p;
  const dx = enter === 'left' ? -700 * eased : enter === 'right' ? 700 * eased : 0;
  const dy = enter === 'bottom' ? 900 * eased : 0;
  // While sliding in from a side the host walks; a small hop lands it.
  const walking = (enter === 'left' || enter === 'right') && p > 0;
  const hop = enter === 'bottom' && p === 0 ? snap(Math.max(0, 1 - (frame - enterFrames) / 8) * -24) : 0;
  return (
    <div style={{position: 'absolute', left: snap(x + dx), top: snap(y + dy) + hop}}>
      <PixelCharacter
        pose={walking ? 'walk' : pose}
        expression={expression}
        eyes={eyes}
        speaking={silent ? undefined : speakingRanges(scene)}
        look={look}
        step={walking ? 5 : step}
      />
    </div>
  );
};
