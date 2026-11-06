import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon, LAPTOP, QUESTION, SPARKLE} from '../../components/PixelIcons';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SpeechBubble} from '../../components/SpeechBubble';
import {BIG_CLOUD, FILE} from '../assets/icons';
import {DataFlow} from '../components/DataFlow';
import {SCENES} from '../config/scenes';
import {useCues} from '../lib/cues';

const I = 0;

export const Ep02Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const cloudAt = f('Google', 1.0) - 4;
  const ask = f('Tahu', 3.6) - 2;
  // The cloud expands from a small puff to full size.
  const grow = interpolate(frame, [cloudAt, cloudAt + 16], [0.2, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <SceneFrame index={I} extraSfx={[{at: cloudAt / fps, sfx: 'jump'}, {at: ask / fps, sfx: 'pop'}]}>
      <SpeechBubble delay={3} tail="left" tailOffset={200} style={{position: 'absolute', left: 80, top: 200, width: 920}}>
        {frame < ask ? (
          <PixelText text={cfg.text.headline} size={104} effect="zoom" delay={8} stagger={6} />
        ) : (
          <PixelText text={cfg.text.question} size={84} effect="pop" delay={ask} stagger={5} />
        )}
      </SpeechBubble>
      <div style={{position: 'absolute', left: 600, top: 840, transform: `scale(${grow})`, transformOrigin: '50% 100%', opacity: frame >= cloudAt ? 1 : 0}}>
        <PixelSprite sprite={BIG_CLOUD} px={11} />
      </div>
      <DataFlow points={[[810, 1300], [810, 1080]]} start={cloudAt + 12} travel={24} every={9} sprite={FILE} px={4} track="#1265C8" />
      <Icon sprite={LAPTOP} x={690} y={1300} px={11} delay={14} bob={0} />
      <Icon sprite={QUESTION} x={420} y={880} px={10} delay={ask} bob={10} />
      <Icon sprite={SPARKLE} x={1000} y={900} px={8} delay={cloudAt + 10} bob={6} />
      <Host scene={I} x={0} y={1060} pose={frame < ask ? 'pointRight' : 'think'} enter="bottom" enterFrames={18} />
    </SceneFrame>
  );
};
