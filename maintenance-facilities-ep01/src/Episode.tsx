// Episode 01 assembly: the eight scenes in sequence (Phase 3: picture only).
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {SCENES} from './data/timeline';
import {loadFonts} from './fonts';
import {Scene04, Scene06, Scene07} from './scenes/DigitalScenes';
import {Scene01, Scene02, Scene03, Scene05, Scene08} from './scenes/PlantScenes';

loadFonts();

export const SCENE_COMPONENTS: Record<number, React.FC> = {
  1: Scene01,
  2: Scene02,
  3: Scene03,
  4: Scene04,
  5: Scene05,
  6: Scene06,
  7: Scene07,
  8: Scene08,
};

export const Episode01: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {SCENES.map((s) => {
      const C = SCENE_COMPONENTS[s.id];
      return (
        <Sequence key={s.id} name={`${String(s.id).padStart(2, '0')} · ${s.name}`} from={s.from} durationInFrames={s.len}>
          <C />
        </Sequence>
      );
    })}
  </AbsoluteFill>
);

/** One scene on its own (for separate rendering / review). */
export const SingleScene: React.FC<{id: number}> = ({id}) => {
  loadFonts();
  const C = SCENE_COMPONENTS[id];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <C />
    </AbsoluteFill>
  );
};
