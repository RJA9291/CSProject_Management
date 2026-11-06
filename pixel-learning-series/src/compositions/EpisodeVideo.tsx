import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useVideoConfig} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {pixelBlocks} from '../components/Transition';
import {AUDIO, SFX} from '../config/audio';
import {episodeStarts} from '../lib/durations';
import {EpisodeContext, makeTiming} from '../lib/episode';
import type {Episode} from '../lib/episode-types';

export type EpisodeVideoProps = {durations: number[]};

// Full episode: scenes joined by pixel-block transitions, music ducked under the narration.
export const makeEpisodeVideo = (ep: Episode, scenes: React.FC[]): React.FC<EpisodeVideoProps> => {
  const {voEnd} = makeTiming(ep);
  const EpisodeVideo: React.FC<EpisodeVideoProps> = ({durations}) => {
    const {fps, durationInFrames} = useVideoConfig();
    const starts = episodeStarts(ep, durations);
    const voWindows = ep.scenes.map((s, i) => [starts[i] + s.voDelay * fps, starts[i] + voEnd(i) * fps]);
    const musicVolume = (f: number) => {
      const dist = Math.min(...voWindows.map(([a, b]) => (f < a ? a - f : f > b ? f - b : 0)));
      const duck = interpolate(dist, [0, 10], [AUDIO.musicDuckedVolume, AUDIO.musicVolume], {extrapolateRight: 'clamp'});
      const fadeIn = interpolate(f, [0, 15], [0, 1], {extrapolateRight: 'clamp'});
      const fadeOut = interpolate(f, [durationInFrames - 50, durationInFrames - 1], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      return duck * fadeIn * fadeOut;
    };
    return (
      <EpisodeContext.Provider value={ep}>
        <AbsoluteFill style={{background: '#F3EFE6'}}>
          <TransitionSeries>
            {scenes.map((Scene, i) => (
              <React.Fragment key={ep.scenes[i].id}>
                {i > 0 ? (
                  <TransitionSeries.Transition presentation={pixelBlocks(ep.transitionColors)} timing={linearTiming({durationInFrames: ep.transitionFrames})} />
                ) : null}
                <TransitionSeries.Sequence durationInFrames={durations[i]} name={`${String(i + 1).padStart(2, '0')} ${ep.scenes[i].name}`}>
                  <Scene />
                </TransitionSeries.Sequence>
              </React.Fragment>
            ))}
          </TransitionSeries>
          <Audio src={staticFile(ep.music)} loop volume={musicVolume} />
          {AUDIO.transitionSfx
            ? starts.slice(1).map((s, i) => (
                <Sequence key={i} from={s} durationInFrames={fps} name="SFX transition">
                  <Audio src={staticFile(SFX.transition)} volume={AUDIO.sfxVolume * 0.8} />
                </Sequence>
              ))
            : null}
        </AbsoluteFill>
      </EpisodeContext.Provider>
    );
  };
  return EpisodeVideo;
};

// Wraps a single scene so it previews with its own episode's narration and timings.
export const withEpisode = (ep: Episode, Scene: React.FC): React.FC => {
  const Wrapped: React.FC = () => (
    <EpisodeContext.Provider value={ep}>
      <Scene />
    </EpisodeContext.Provider>
  );
  return Wrapped;
};
