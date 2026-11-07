import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {PixelBox} from '../../components/PixelBox';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop, slide} from '../../lib/anim';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {Tux} from '../components/Tux';
import {RECAP, SCENES} from '../config/scenes';
import {EP05_THEME, TERM_FONT} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 10;
const CARD_COLORS = [EP05_THEME.green, EP05_THEME.blue, EP05_THEME.purple, EP05_THEME.navy, EP05_THEME.orange, EP05_THEME.red];

export const Ep05Scene11Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const cfg = SCENES[I];
  const starts = RECAP.map((r, i) => f(r.cue, 1.5 + i * 2.2) - 4);
  const banner = pop(frame, fps, 2, 9);
  return (
    <SceneFrame index={I} background={<CyberBackground navyFrom={Infinity} />} extraSfx={[...starts.map((s) => ({at: s / fps, sfx: 'blip' as const})), {at: (end - 4) / fps, sfx: 'success'}]}>
      <div style={{position: 'absolute', top: 170, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${banner})`}}>
        <PixelBox bg={COLORS.red} border={COLORS.text} padding="8px 46px">
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 92, color: COLORS.white}}>{cfg.text.headline}</div>
        </PixelBox>
      </div>
      {RECAP.map((r, i) => {
        const x = slide(frame, starts[i], 12, i % 2 ? 1100 : -1100);
        const mono = r.title === 'BASIC COMMANDS';
        return (
          <div key={r.title} style={{position: 'absolute', left: 50, top: 340 + i * 118, width: 980, height: 108, transform: `translateX(${x}px)`}}>
            <PixelBox bg={COLORS.white} border={CARD_COLORS[i]} padding="0" borderWidth={7} style={{height: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                <div style={{width: 92, height: '100%', background: CARD_COLORS[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: COLORS.white}}>{i + 1}</div>
                <div style={{padding: '0 20px'}}>
                  <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, color: CARD_COLORS[i], lineHeight: 1}}>{r.title}</div>
                  <div style={{fontFamily: mono ? TERM_FONT : FONTS.heading, fontWeight: 700, fontSize: mono ? 36 : 27, color: COLORS.text, lineHeight: 1.05}}>{r.desc}</div>
                </div>
              </div>
            </PixelBox>
          </div>
        );
      })}
      <Tux x={110} y={1150} px={7} pose={frame >= starts[4] ? 'celebrate' : 'wave'} hopFrom={starts[5]} hopUntil={starts[5] + 30} />
      <Host scene={I} x={500} y={1080} pose={frame >= end - 4 ? 'celebrate' : 'thumbsUp'} />
    </SceneFrame>
  );
};
