import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {CAKE, HEART, Icon, SPARKLE} from '../../components/PixelIcons';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SpeechBubble} from '../../components/SpeechBubble';
import {SCENES} from '../../config/scenes';
import {snap} from '../../lib/anim';
import {cueAt} from '../../lib/timing';

const I = 3;

// Hearts drift upward from the cake on a loop.
const FloatingHearts: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  return (
    <>
      {Array.from({length: 6}, (_, i) => {
        const life = 70;
        const t = ((frame - start + i * 12) % life) / life;
        const x = 640 + random(`hx${i}`) * 360;
        const y = 1260 - t * 420;
        return (
          <div key={i} style={{position: 'absolute', left: snap(x + Math.sin(t * 6 + i) * 20, 4), top: snap(y, 4), opacity: 1 - t * t}}>
            <PixelSprite sprite={HEART} px={i % 2 ? 6 : 8} />
          </div>
        );
      })}
    </>
  );
};

export const Scene04Gift: React.FC = () => {
  const {fps} = useVideoConfig();
  const cfg = SCENES[I];
  const cake = Math.round(cueAt(I, 'Gift', 2.6) * fps) - 6;
  return (
    <SceneFrame index={I} extraSfx={[{at: cake / fps, sfx: 'coin'}]}>
      <SpeechBubble delay={2} tail="left" tailOffset={200} style={{position: 'absolute', left: 70, top: 220, width: 940}}>
        <PixelText text={cfg.text.headline} size={92} effect="pop" delay={6} stagger={6} />
      </SpeechBubble>
      <Host scene={I} x={0} y={1030} pose="thumbsUp" />
      <Icon sprite={CAKE} x={640} y={1150} px={18} delay={cake} bob={6} />
      <Icon sprite={SPARKLE} x={600} y={1080} px={10} delay={cake + 8} bob={8} phase={10} />
      <Icon sprite={SPARKLE} x={980} y={1250} px={8} delay={cake + 14} bob={8} phase={40} />
      <FloatingHearts start={cake + 10} />
    </SceneFrame>
  );
};
