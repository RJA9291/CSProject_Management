import React from 'react';
import {useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {BOOK, Icon, SPARKLE} from '../../components/PixelIcons';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SpeechBubble} from '../../components/SpeechBubble';
import {SCENES} from '../../config/scenes';
import {cueAt} from '../../lib/timing';

const I = 2;

export const Scene03Greeting: React.FC = () => {
  const {fps} = useVideoConfig();
  const cfg = SCENES[I];
  const jom = Math.round(cueAt(I, 'Jom', 2.2) * fps);
  const book = Math.round(cueAt(I, 'belajar', 3.4) * fps);
  return (
    <SceneFrame index={I}>
      <SpeechBubble delay={2} tail="left" tailOffset={190} style={{position: 'absolute', left: 70, top: 220, width: 940}}>
        <PixelText text={cfg.text.headline} size={74} effect="zoom" delay={6} />
        <PixelText text={cfg.text.sub} size={84} effect="pop" delay={jom} stagger={6} style={{marginTop: 18}} />
      </SpeechBubble>
      <Host scene={I} x={0} y={1030} pose="wave" step={8} />
      <Icon sprite={SPARKLE} x={600} y={1000} px={10} delay={8} bob={8} />
      <Icon sprite={SPARKLE} x={940} y={1180} px={8} delay={14} bob={8} phase={25} />
      <Icon sprite={BOOK} x={600} y={1230} px={18} delay={book} bob={10} phase={10} />
    </SceneFrame>
  );
};
