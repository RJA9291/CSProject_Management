import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AUDIO} from '../config/audio';
import type {SfxCue} from '../config/scenes';
import {useTiming} from '../lib/episode';
import {PixelBackground} from './PixelBackground';
import {SceneAudio} from './SceneAudio';
import {Subtitles} from './Subtitles';

type Props = {
  index: number;
  tint?: string;
  // Replaces the default dotted beige background.
  background?: React.ReactNode;
  extraSfx?: SfxCue[];
  children: React.ReactNode;
};

// Common wrapper for every scene: background, content, voice-over/SFX and subtitles.
export const SceneFrame: React.FC<Props> = ({index, tint, background, extraSfx, children}) => {
  const {sceneWords} = useTiming();
  return (
    <AbsoluteFill>
      {background ?? <PixelBackground tint={tint} />}
      <AbsoluteFill>{children}</AbsoluteFill>
      {AUDIO.showSubtitles ? <Subtitles words={sceneWords(index)} /> : null}
      <SceneAudio index={index} extraSfx={extraSfx} />
    </AbsoluteFill>
  );
};
