// Episode 01 assembly: the eight scenes in sequence, each on its own scene clock.
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {SCENES} from './data/timeline';
import {loadFonts} from './fonts';
import {SceneClock} from './lib/clock';
import {Scene04, Scene06, Scene07} from './scenes/DigitalScenes';
import {Scene01, Scene02, Scene03, Scene05, Scene08} from './scenes/PlantScenes';
import {Soundtrack} from './Soundtrack';
import {OpeningTitle, Subtitles} from './Overlays';

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

export type EpisodeProps = {audio: boolean; subtitles?: boolean};

export const Episode01: React.FC<EpisodeProps> = ({audio, subtitles = true}) => (
  <AbsoluteFill style={{background: '#000'}}>
    {SCENES.map((s) => {
      const C = SCENE_COMPONENTS[s.id];
      return (
        <Sequence key={s.id} name={`${String(s.id).padStart(2, '0')} · ${s.name}`} from={s.from} durationInFrames={s.len}>
          <SceneClock k={s.k}>
            <C />
          </SceneClock>
        </Sequence>
      );
    })}
    <OpeningTitle />
    {subtitles && <Subtitles />}
    {audio && <Soundtrack />}
  </AbsoluteFill>
);

/** One scene on its own (for separate rendering / review). */
export const SingleScene: React.FC<{id: number}> = ({id}) => {
  const C = SCENE_COMPONENTS[id];
  const s = SCENES.find((x) => x.id === id)!;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SceneClock k={s.k}>
        <C />
      </SceneClock>
    </AbsoluteFill>
  );
};
