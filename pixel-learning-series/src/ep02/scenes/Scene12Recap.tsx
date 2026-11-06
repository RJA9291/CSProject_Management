import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {CLOUD, Icon, SPARKLE} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop, slide} from '../../lib/anim';
import {RECAP, SCENES} from '../config/scenes';
import {EP02_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 11;
const CUES: [string, number][] = [
  ['Cloud', 0],
  ['IaaS', 0],
  ['PaaS', 0],
  ['SaaS', 0],
  ['deployment', 0],
];
const CARD_COLORS = [EP02_THEME.blue, EP02_THEME.navy, EP02_THEME.teal, EP02_THEME.purple, EP02_THEME.orange];

export const Ep02Scene12Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f} = useCues(I);
  const cfg = SCENES[I];
  const starts = CUES.map(([w, nth], i) => f(w, 1.5 + i * 1.6, nth) - 4);
  const banner = pop(frame, fps, 2, 9);
  return (
    <SceneFrame index={I} extraSfx={starts.map((s) => ({at: s / fps, sfx: 'blip' as const}))}>
      <div style={{position: 'absolute', top: 170, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${banner})`}}>
        <PixelBox bg={COLORS.red} border={COLORS.text} padding="8px 46px">
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 92, color: COLORS.white}}>{cfg.text.headline}</div>
        </PixelBox>
      </div>
      {RECAP.map((r, i) => {
        const x = slide(frame, starts[i], 12, -1100);
        return (
          <div key={r.title} style={{position: 'absolute', left: 50, top: 340 + i * 140, width: 980, height: 124, transform: `translateX(${x}px)`}}>
            <PixelBox bg={COLORS.white} border={CARD_COLORS[i]} padding="0" borderWidth={8} style={{height: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                <div style={{width: 110, height: '100%', background: CARD_COLORS[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, color: COLORS.white}}>
                  {i + 1}
                </div>
                <div style={{padding: '0 24px'}}>
                  <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, color: CARD_COLORS[i], lineHeight: 1}}>{r.title}</div>
                  <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 34, color: COLORS.text}}>{r.desc}</div>
                </div>
              </div>
            </PixelBox>
          </div>
        );
      })}
      <Host scene={I} x={-40} y={1060} pose="thumbsUp" />
      <Icon sprite={CLOUD} x={620} y={1170} px={12} delay={6} bob={12} />
      <Icon sprite={SPARKLE} x={560} y={1120} px={8} delay={starts[4]} bob={6} />
      <Icon sprite={SPARKLE} x={960} y={1300} px={8} delay={starts[4] + 6} bob={6} phase={20} />
    </SceneFrame>
  );
};
