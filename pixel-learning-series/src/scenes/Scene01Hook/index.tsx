import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {COMPUTER, Icon, QUESTION, SPARKLE} from '../../components/PixelIcons';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SpeechBubble} from '../../components/SpeechBubble';
import {SCENES} from '../../config/scenes';

const I = 0;

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cfg = SCENES[I];
  // Host glances at the computer, then back at the viewer.
  const eyes = frame > 1.6 * fps && frame < 2.8 * fps ? 'right' : 'center';
  return (
    <SceneFrame index={I}>
      <SpeechBubble delay={4} tail="left" tailOffset={180} style={{position: 'absolute', left: 110, top: 230, width: 860}}>
        <PixelText text={cfg.text.headline} size={150} effect="zoom" delay={10} stagger={6} />
      </SpeechBubble>
      <Host scene={I} x={30} y={1010} pose="think" eyes={eyes} enter="bottom" enterFrames={18} />
      <Icon sprite={QUESTION} x={470} y={850} px={14} delay={Math.round(0.9 * fps)} bob={14} />
      <Icon sprite={SPARKLE} x={640} y={900} px={10} delay={Math.round(1.0 * fps)} bob={6} phase={20} />
      <Icon sprite={COMPUTER} x={640} y={1150} px={16} delay={Math.round(1.4 * fps)} bob={8} phase={35} />
      <Icon sprite={SPARKLE} x={960} y={1110} px={8} delay={Math.round(1.6 * fps)} bob={6} phase={10} />
    </SceneFrame>
  );
};
