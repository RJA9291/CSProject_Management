import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {CERTIFICATE, Icon, SPARKLE} from '../../components/PixelIcons';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SpeechBubble} from '../../components/SpeechBubble';
import {SCENES} from '../../config/scenes';
import {COLORS, FONTS} from '../../config/theme';
import {cueAt} from '../../lib/timing';

const I = 5;
const CERT_PX = 18;

export const Scene06LFCA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cfg = SCENES[I];
  const cert = Math.round(cueAt(I, 'pensijilan', 1.2) * fps) - 4;
  const asas = Math.round(cueAt(I, 'asas', 1.8) * fps);
  // Highlight frame around "LFCA" on the certificate blinks in pixel steps.
  const glow = frame > asas && Math.floor(frame / 8) % 2 === 0;
  return (
    <SceneFrame index={I}>
      <PixelText text={cfg.text.headline} size={124} effect="pop" delay={3} style={{position: 'absolute', top: 200, left: 0, right: 0}} />
      <PixelText
        text={cfg.text.sub}
        size={60}
        color={COLORS.navy}
        effect="type"
        delay={14}
        weight={900}
        style={{position: 'absolute', top: 370, left: 0, right: 0}}
      />
      <SpeechBubble delay={asas} tail="left" tailOffset={150} style={{position: 'absolute', left: 120, top: 590, width: 840}}>
        <PixelText text={cfg.text.note} size={62} effect="none" shadow={false} />
      </SpeechBubble>
      <Host scene={I} x={-30} y={1050} pose="pointRight" />
      <Icon sprite={CERTIFICATE} x={570} y={1010} px={CERT_PX} delay={cert} bob={8}>
        <div
          style={{
            position: 'absolute',
            left: 3 * CERT_PX,
            top: 2.6 * CERT_PX,
            width: 16 * CERT_PX,
            textAlign: 'center',
            fontFamily: FONTS.heading,
            fontWeight: 900,
            fontSize: 100,
            color: COLORS.navy,
            outline: glow ? `8px solid ${COLORS.orange}` : '8px solid transparent',
            outlineOffset: 2,
          }}
        >
          LFCA
        </div>
      </Icon>
      <Icon sprite={SPARKLE} x={560} y={960} px={10} delay={asas + 4} bob={6} />
      <Icon sprite={SPARKLE} x={970} y={1300} px={8} delay={asas + 10} bob={6} phase={30} />
    </SceneFrame>
  );
};
