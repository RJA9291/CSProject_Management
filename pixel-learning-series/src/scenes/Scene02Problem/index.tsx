import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon, QUESTION} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SpeechBubble} from '../../components/SpeechBubble';
import {SCENES} from '../../config/scenes';
import {COLORS, FONTS} from '../../config/theme';
import {pop, float} from '../../lib/anim';

const I = 1;
const BOARD_COLORS = [COLORS.blue, COLORS.orange, COLORS.green];
const BOARD_TIMES = [1.0, 1.6, 2.2];

export const Scene02Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cfg = SCENES[I];
  const labels = cfg.list ?? [];
  // Host looks left, right, then at the signpost.
  const look = Math.floor(frame / 18) % 4;
  const eyes = (['left', 'right', 'left', 'right'] as const)[look];
  return (
    <SceneFrame index={I}>
      <SpeechBubble delay={2} tail="left" tailOffset={200} style={{position: 'absolute', left: 90, top: 210, width: 900}}>
        <PixelText text={cfg.text.headline} size={96} effect="pop" delay={6} stagger={5} />
      </SpeechBubble>
      <Host scene={I} x={-10} y={1030} pose="neutral" expression="confused" eyes={eyes} />
      <Icon sprite={QUESTION} x={190} y={880} px={9} delay={12} bob={10} />
      <Icon sprite={QUESTION} x={400} y={900} px={7} delay={20} bob={10} phase={30} />
      {/* Signpost pole */}
      <div style={{position: 'absolute', left: 792, top: 980, width: 36, height: 580, background: '#8A5A3B', borderLeft: '8px solid #171717', borderRight: '8px solid #171717'}} />
      {labels.map((label, i) => {
        const d = Math.round(BOARD_TIMES[i] * fps);
        const s = pop(frame, fps, d, 9);
        const tilt = i % 2 === 0 ? -4 : 4;
        return (
          <div
            key={label}
            style={{
              position: 'absolute',
              left: 540,
              top: 1010 + i * 160 + float(frame, 6, 50, i * 15),
              transform: `scale(${s}) rotate(${tilt}deg)`,
              opacity: frame >= d ? 1 : 0,
            }}
          >
            <PixelBox bg={BOARD_COLORS[i]} padding="16px 30px" style={{width: 480}}>
              <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, color: COLORS.white, textAlign: 'center'}}>{label}</div>
            </PixelBox>
          </div>
        );
      })}
    </SceneFrame>
  );
};
