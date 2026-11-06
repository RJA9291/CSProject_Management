import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckList} from '../../components/InfographicCard';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon, SHIELD, SPARKLE} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop, slide} from '../../lib/anim';
import {PHONE} from '../../ep02/assets/icons';
import {HOOK, VERIFIED, X_MARK} from '../assets/icons';
import {CyberBackground} from '../components/CyberBackground';
import {RECAP, SCENES} from '../config/scenes';
import {EP03_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 10;
const CARD_COLORS = [EP03_THEME.red, EP03_THEME.navy, EP03_THEME.green];

const CardIcon: React.FC<{i: number}> = ({i}) => {
  if (i === 0) return <PixelSprite sprite={HOOK} px={6} />;
  if (i === 1)
    return (
      <div style={{position: 'relative'}}>
        <PixelSprite sprite={PHONE} px={5} />
        <div style={{position: 'absolute', left: 6, top: 26}}>
          <PixelSprite sprite={X_MARK} px={4} />
        </div>
      </div>
    );
  return <PixelSprite sprite={VERIFIED} px={5} />;
};

export const Ep03Scene11Recap: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f} = useCues(I);
  const cfg = SCENES[I];
  const items = cfg.list ?? [];
  const starts = RECAP.map((r, i) => f(r.cue, 1.6 + i * 1.4) - 4);
  const ingat = f('Ingat', 6.4) - 2;
  const listStarts = items.map((_, i) => ingat + i * 9);
  const banner = pop(frame, fps, 2, 9);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[...starts.map((s) => ({at: s / fps, sfx: 'blip' as const})), ...listStarts.map((s) => ({at: s / fps, sfx: 'click' as const})), {at: (listStarts[listStarts.length - 1] + 10) / fps, sfx: 'success'}]}
    >
      <div style={{position: 'absolute', top: 170, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${banner})`}}>
        <PixelBox bg={COLORS.red} border={COLORS.text} padding="8px 46px">
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 92, color: COLORS.white}}>{cfg.text.headline}</div>
        </PixelBox>
      </div>
      {RECAP.map((r, i) => {
        const x = slide(frame, starts[i], 12, -1100);
        return (
          <div key={r.title} style={{position: 'absolute', left: 50, top: 350 + i * 150, width: 980, height: 132, transform: `translateX(${x}px)`}}>
            <PixelBox bg={COLORS.white} border={CARD_COLORS[i]} padding="0" borderWidth={8} style={{height: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
                <div style={{width: 116, height: '100%', background: CARD_COLORS[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, color: COLORS.white}}>
                  {i + 1}
                </div>
                <div style={{padding: '0 24px', flex: 1, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: CARD_COLORS[i], lineHeight: 1}}>{r.title}</div>
                <div style={{marginRight: 24}}>
                  <CardIcon i={i} />
                </div>
              </div>
            </PixelBox>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 50, top: 810, width: 980, opacity: frame >= ingat - 4 ? 1 : 0}}>
        <PixelBox bg={COLORS.white} border={EP03_THEME.blue} padding="14px 24px" shadow={false}>
          <CheckList items={items} starts={listStarts} size={34} gap={6} />
        </PixelBox>
      </div>
      <Host scene={I} x={500} y={1080} pose={frame >= ingat ? 'thumbsUp' : 'explain'} />
      <Icon sprite={SHIELD} x={130} y={1150} px={11} delay={ingat} bob={8} />
      <Icon sprite={SPARKLE} x={80} y={1110} px={7} delay={ingat + 6} bob={6} />
      <Icon sprite={SPARKLE} x={360} y={1350} px={7} delay={ingat + 10} bob={6} phase={20} />
    </SceneFrame>
  );
};
