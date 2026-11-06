import React from 'react';
import {useVideoConfig} from 'remotion';
import {BOOK, Icon, SPARKLE} from '../components/PixelIcons';
import {Host} from '../components/PixelCharacter/Host';
import {PixelText} from '../components/PixelText';
import {SceneFrame} from '../components/SceneFrame';
import {SpeechBubble} from '../components/SpeechBubble';
import {useEpisode, useTiming} from '../lib/episode';

type Props = {
  index: number;
  // Episode-specific prop floating beside the host (e.g. a cloud for Episode 02).
  accent?: React.ReactNode;
};

// Series-standard greeting: "Assalamualaikum! Mari sama-sama belajar!" with a wave and an open book.
export const SeriesGreeting: React.FC<Props> = ({index, accent}) => {
  const {fps} = useVideoConfig();
  const cfg = useEpisode().scenes[index];
  const {cueAt} = useTiming();
  const jom = Math.round(cueAt(index, 'Jom', 2.2) * fps);
  const book = Math.round(cueAt(index, 'belajar', 3.4) * fps);
  return (
    <SceneFrame index={index}>
      <SpeechBubble delay={2} tail="left" tailOffset={190} style={{position: 'absolute', left: 70, top: 220, width: 940}}>
        <PixelText text={cfg.text.headline} size={74} effect="zoom" delay={6} />
        <PixelText text={cfg.text.sub} size={84} effect="pop" delay={jom} stagger={6} style={{marginTop: 18}} />
      </SpeechBubble>
      <Host scene={index} x={0} y={1030} pose="wave" step={8} />
      <Icon sprite={SPARKLE} x={600} y={1000} px={10} delay={8} bob={8} />
      <Icon sprite={SPARKLE} x={940} y={1180} px={8} delay={14} bob={8} phase={25} />
      <Icon sprite={BOOK} x={600} y={1230} px={18} delay={book} bob={10} phase={10} />
      {accent}
    </SceneFrame>
  );
};
