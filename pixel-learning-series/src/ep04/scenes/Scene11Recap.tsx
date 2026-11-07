import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon, SPARKLE} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop, slide} from '../../lib/anim';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {wifiSprite} from '../components/Net';
import {RECAP, SCENES} from '../config/scenes';
import {EP04_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 10;
const CARD_COLORS = [EP04_THEME.blue, EP04_THEME.navy, EP04_THEME.teal, EP04_THEME.purple, EP04_THEME.orange];

export const Ep04Scene11Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const cfg = SCENES[I];
  const starts = RECAP.map((r, i) => f(r.cue, 1.5 + i * 3) - 4);
  const banner = pop(frame, fps, 2, 9);
  return (
    <SceneFrame index={I} background={<CyberBackground navyFrom={Infinity} />} extraSfx={[...starts.map((s) => ({at: s / fps, sfx: 'blip' as const})), {at: (end - 4) / fps, sfx: 'success'}]}>
      <div style={{position: 'absolute', top: 170, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${banner})`}}>
        <PixelBox bg={COLORS.red} border={COLORS.text} padding="8px 46px">
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 92, color: COLORS.white}}>{cfg.text.headline}</div>
        </PixelBox>
      </div>
      {RECAP.map((r, i) => {
        const x = slide(frame, starts[i], 12, -1100);
        return (
          <div key={r.title} style={{position: 'absolute', left: 50, top: 350 + i * 140, width: 980, height: 124, transform: `translateX(${x}px)`}}>
            <PixelBox bg={COLORS.white} border={CARD_COLORS[i]} padding="0" borderWidth={8} style={{height: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                <div style={{width: 110, height: '100%', background: CARD_COLORS[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, color: COLORS.white}}>
                  {i + 1}
                </div>
                <div style={{padding: '0 22px', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: CARD_COLORS[i], lineHeight: 1, whiteSpace: 'nowrap'}}>{r.title}</div>
              </div>
            </PixelBox>
          </div>
        );
      })}
      <Host scene={I} x={-40} y={1080} pose={frame >= end - 4 ? 'celebrate' : 'thumbsUp'} />
      <Icon sprite={wifiSprite(frame, 6)} x={660} y={1130} px={12} delay={6} bob={10} />
      <Icon sprite={SPARKLE} x={600} y={1080} px={8} delay={starts[4]} bob={6} />
      <Icon sprite={SPARKLE} x={960} y={1300} px={8} delay={starts[4] + 6} bob={6} phase={20} />
    </SceneFrame>
  );
};
