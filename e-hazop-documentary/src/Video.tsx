import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {FilmGrain, Vignette} from './components/Effects';
import {ReferencesCard, Subtitles} from './components/Typography';
import {CUES} from './data/audioCues';
import {REF_FOOTER, REFERENCES} from './data/content';
import {LINES, sceneRange, SceneKey, TL} from './data/timeline';
import {loadFonts} from './fonts';
import {Scene1Intro} from './scenes/Scene1Intro';
import {Scene2Risks} from './scenes/Scene2Risks';
import {Scene3What} from './scenes/Scene3What';
import {Scene4How} from './scenes/Scene4How';
import {Scene5Example} from './scenes/Scene5Example';
import {Scene6Why} from './scenes/Scene6Why';
import {Scene7Conclusion} from './scenes/Scene7Conclusion';
import {C} from './theme';

loadFonts();

export type DocProps = {showSubtitles: boolean; musicVolume: number; voVolume: number; sfxVolume: number};

const len = (k: SceneKey) => sceneRange(k).to - sceneRange(k).from;

/** Music ducks under the narration so the voice always leads. */
const duck = (f: number) => {
  let d = Infinity;
  for (const l of LINES) {
    if (f >= l.from && f <= l.to) return 0.32;
    d = Math.min(d, Math.abs(f - l.from), Math.abs(f - l.to));
  }
  return interpolate(d, [0, 14], [0.32, 1], {extrapolateRight: 'clamp'});
};

const SCENES: [SceneKey, string, React.FC][] = [
  ['1', '1 · Introduction', Scene1Intro],
  ['2', '2 · Hidden risks', Scene2Risks],
  ['3', '3 · What is E-HAZOP?', Scene3What],
  ['4', '4 · How it works', Scene4How],
  ['5', '5 · Transformer example', Scene5Example],
  ['6', '6 · Why it matters', Scene6Why],
  ['7', '7 · Conclusion', Scene7Conclusion],
];

export const EHazopDocumentary: React.FC<DocProps> = ({showSubtitles, musicVolume, voVolume, sfxVolume}) => {
  const refs = sceneRange('refs');
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {SCENES.map(([k, name, Comp]) => (
        <Sequence key={k} name={name} from={sceneRange(k).from} durationInFrames={len(k)}>
          <Comp />
        </Sequence>
      ))}
      <Sequence name="References" from={refs.from} durationInFrames={refs.to - refs.from}>
        <ReferencesCard at={0} refs={REFERENCES} footer={REF_FOOTER} />
      </Sequence>

      {showSubtitles && <Subtitles />}
      <FilmGrain opacity={0.05} />
      <Vignette strength={0.55} />

      <Audio src={staticFile('audio/music/score.flac')} volume={(f) => musicVolume * duck(f)} />
      {LINES.map((l) => (
        <Sequence key={l.id} name={`VO ${l.id}`} from={TL.vo[l.id]} layout="none">
          <Audio src={staticFile(`audio/vo/${l.id}.wav`)} volume={voVolume} />
        </Sequence>
      ))}
      {CUES.map((c, i) => (
        <Sequence key={i} name={`SFX ${c.sfx}`} from={Math.max(0, Math.round(c.at))} layout="none">
          <Audio src={staticFile(`audio/sfx/${c.sfx}.wav`)} volume={c.volume * sfxVolume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
