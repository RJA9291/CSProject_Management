import React from 'react';
import {Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import {AUDIO, SFX} from '../../config/audio';
import type {SfxCue} from '../../config/scenes';
import {useEpisode} from '../../lib/episode';

// Voice-over plus sound-effect cues for one scene (times are scene-relative seconds).
export const SceneAudio: React.FC<{index: number; extraSfx?: SfxCue[]}> = ({index, extraSfx = []}) => {
  const {fps} = useVideoConfig();
  const scene = useEpisode().scenes[index];
  const cues = [...scene.sfx, ...extraSfx];
  return (
    <>
      <Sequence from={Math.round(scene.voDelay * fps)} name="Voice-over">
        <Audio src={staticFile(scene.voFile)} volume={AUDIO.voVolume} />
      </Sequence>
      {cues.map((c, i) => (
        <Sequence key={i} from={Math.round(c.at * fps)} durationInFrames={fps} name={`SFX ${c.sfx}`}>
          <Audio src={staticFile(SFX[c.sfx])} volume={AUDIO.sfxVolume} />
        </Sequence>
      ))}
    </>
  );
};
