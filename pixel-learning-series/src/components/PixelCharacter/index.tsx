import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {buildHost, Expression, Eyes, Look, Pose, poseFrameCount} from '../../assets/characters/host';
import {PX} from '../../config/theme';
import {PixelSprite} from '../PixelSprite';

type Props = {
  pose: Pose;
  expression?: Expression;
  eyes?: Eyes;
  flip?: boolean;
  px?: number;
  // Seconds ranges (scene-relative) when the host is speaking; drives the mouth.
  speaking?: [number, number][];
  // Frames per animation step; higher = slower gestures.
  step?: number;
  style?: React.CSSProperties;
  // Supporting characters reuse the host body with a different look.
  look?: Look;
};

export const PixelCharacter: React.FC<Props> = ({pose, expression, eyes, flip, px = PX, speaking, step = 7, style, look}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const anim = Math.floor(frame / step) % poseFrameCount(pose);
  const blink = frame % 96 >= 90;
  const bob = pose === 'walk' || pose === 'celebrate' ? 0 : Math.floor(frame / 20) % 2 === 1 ? 1 : 0;
  const inWord = speaking?.some(([a, b]) => t >= a && t <= b) ?? false;
  const talking = inWord && Math.floor(frame / 4) % 2 === 0;
  const sprite = buildHost({pose, frame: anim, expression, eyes, blink, talking, bob, look});
  return (
    <div style={{transform: flip ? 'scaleX(-1)' : undefined, ...style}}>
      <PixelSprite sprite={sprite} px={px} />
    </div>
  );
};
