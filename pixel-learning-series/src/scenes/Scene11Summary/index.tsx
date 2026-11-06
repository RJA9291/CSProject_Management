import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {LfcaBadge} from '../../components/Badge';
import {Connector} from '../../components/Connector';
import {CheckList} from '../../components/InfographicCard';
import {Host} from '../../components/PixelCharacter/Host';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {SpeechBubble} from '../../components/SpeechBubble';
import {SCENES} from '../../config/scenes';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {cueAt} from '../../lib/timing';
import {PATHS} from '../Scene07Roadmap';

const I = 10;
const SHORT = ['Systems &\nInfra', 'Network &\nSecurity', 'Software\nDev'];
const CARD_X = [40, 380, 720];

export const Scene11Summary: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cfg = SCENES[I];
  const lines = cfg.list ?? [];
  const lineStarts = [
    Math.round(cueAt(I, 'mulakan', 0.9) * fps),
    Math.round(cueAt(I, 'kenali', 2.4) * fps),
    Math.round(cueAt(I, 'bina', 3.4) * fps),
  ];
  const banner = pop(frame, fps, 2, 9);
  const badge = pop(frame, fps, 10, 9);
  return (
    <SceneFrame index={I} extraSfx={lineStarts.map((f) => ({at: f / fps, sfx: 'blip' as const}))}>
      <div style={{position: 'absolute', top: 180, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${banner})`}}>
        <PixelBox bg={COLORS.red} border={COLORS.text} padding="10px 46px">
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 92, color: COLORS.white}}>{cfg.text.headline}</div>
        </PixelBox>
      </div>
      <div style={{position: 'absolute', left: 423, top: 380, transform: `scale(${badge})`}}>
        <LfcaBadge px={9} />
      </div>
      {PATHS.map((p, i) => {
        const d = 16 + i * 6;
        const progress = interpolate(frame, [d, d + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const cx = CARD_X[i] + 160;
        return <Connector key={`c${i}`} points={[[540, 640], [540, 680], [cx, 680], [cx, 740]]} progress={progress} color={p.color} march={frame * 0.6} />;
      })}
      {PATHS.map((p, i) => {
        const s = pop(frame, fps, 24 + i * 6, 10);
        return (
          <div key={i} style={{position: 'absolute', left: CARD_X[i], top: 750, width: 320, transform: `scale(${s})`}}>
            <PixelBox bg={p.color} border={p.dark} padding="18px 10px">
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10}}>
                <PixelSprite sprite={p.icon} px={p.iconPx} />
                <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.white, textAlign: 'center', lineHeight: 1.05, whiteSpace: 'pre-line'}}>
                  {SHORT[i]}
                </div>
              </div>
            </PixelBox>
          </div>
        );
      })}
      <Host scene={I} x={-40} y={1060} pose="thumbsUp" />
      <SpeechBubble delay={lineStarts[0] - 6} tail="left" tailOffset={40} style={{position: 'absolute', left: 470, top: 1100, width: 580}} padding="22px 26px">
        <CheckList items={lines} starts={lineStarts} size={40} gap={10} />
      </SpeechBubble>
    </SceneFrame>
  );
};
