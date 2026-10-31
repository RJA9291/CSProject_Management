import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {FilmGrain, Vignette} from './components/Effects';
import {Subtitles} from './components/Subtitles';
import {CUES} from './data/audioCues';
import {TeaserContent} from './data/content';
import {LINES, scene, TL} from './data/timeline';
import {loadFonts} from './fonts';
import {Scene1Hook} from './scenes/Scene1Hook';
import {Scene2Threat} from './scenes/Scene2Threat';
import {Scene3Reality} from './scenes/Scene3Reality';
import {INTRO_FROM, INTRO_TO, Scene4Intro} from './scenes/Scene4Intro';
import {Scene5Cliffhanger} from './scenes/Scene5Cliffhanger';
import {COLORS} from './theme';

loadFonts();

export type TeaserProps = {
  content: TeaserContent;
  showSubtitles: boolean;
  musicVolume: number;
  voVolume: number;
  sfxVolume: number;
};

const len = (k: Parameters<typeof scene>[0]) => scene(k).to - scene(k).from;

/** Music ducks under the narration (sidechain-style) so the voice always leads. */
const duck = (f: number) => {
  let d = Infinity;
  for (const l of LINES) {
    if (f >= l.from && f <= l.to) return 0.38;
    d = Math.min(d, Math.abs(f - l.from), Math.abs(f - l.to));
  }
  return interpolate(d, [0, 10], [0.38, 1], {extrapolateRight: 'clamp'});
};

export const CyberTeaser: React.FC<TeaserProps> = ({content, showSubtitles, musicVolume, voVolume, sfxVolume}) => {
  return (
    <AbsoluteFill style={{background: COLORS.black}}>
      <Sequence name="1 Hook" from={scene('hook').from} durationInFrames={len('hook')}>
        <Scene1Hook content={content} />
      </Sequence>
      <Sequence name="2 Threat" from={scene('threat').from} durationInFrames={len('threat')}>
        <Scene2Threat content={content} />
      </Sequence>
      <Sequence name="3 Reality check" from={scene('reality').from} durationInFrames={len('reality')}>
        <Scene3Reality content={content} />
      </Sequence>
      <Sequence name="5 Cliffhanger" from={scene('cliffhanger').from} durationInFrames={len('cliffhanger')}>
        <Scene5Cliffhanger content={content} />
      </Sequence>
      {/* Scene 4 overlaps 3 and 5 so it can wipe in and fade out over them */}
      <Sequence name="4 Cybersecurity" from={INTRO_FROM} durationInFrames={INTRO_TO - INTRO_FROM}>
        <Scene4Intro content={content} />
      </Sequence>

      {showSubtitles && <Subtitles />}
      <FilmGrain opacity={0.08} />
      <Vignette strength={0.7} />

      {/* ---- audio ---- */}
      <Audio src={staticFile('audio/music/score.wav')} volume={(f) => musicVolume * duck(f)} />
      {LINES.map((l) => (
        <Sequence key={l.id} name={`VO ${l.id}`} from={TL.vo[l.id]} layout="none">
          <Audio src={staticFile(`audio/vo/${l.id}.wav`)} volume={voVolume} />
        </Sequence>
      ))}
      {CUES.map((c, i) => (
        <Sequence key={i} name={`SFX ${c.sfx}`} from={Math.max(0, c.at)} layout="none">
          <Audio src={staticFile(`audio/sfx/${c.sfx}.wav`)} volume={c.volume * sfxVolume} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
