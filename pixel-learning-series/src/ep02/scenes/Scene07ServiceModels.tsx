import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {GEAR, LAPTOP, ROUTER, SERVER} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop, slide} from '../../lib/anim';
import {APP, BROWSER, DATABASE} from '../assets/icons';
import {TitleCard} from '../components/Cards';
import {SkyBackground} from '../components/SkyBackground';
import {SCENES, SERVICE_MODELS} from '../config/scenes';
import {EP02_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 6;
const COLORS3 = [EP02_THEME.blue, EP02_THEME.teal, EP02_THEME.purple];
const CARD_Y = [400, 775, 1150];

// Pixel illustration for each model: rented hardware / developer platform / ready app.
const Illustration: React.FC<{i: number}> = ({i}) => {
  if (i === 0)
    return (
      <div style={{display: 'flex', alignItems: 'flex-end', gap: 8}}>
        <PixelSprite sprite={SERVER} px={6} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          <PixelSprite sprite={DATABASE} px={5} />
          <PixelSprite sprite={ROUTER} px={4} />
        </div>
      </div>
    );
  if (i === 1)
    return (
      <div style={{position: 'relative'}}>
        <PixelSprite sprite={BROWSER} px={10} />
        <div style={{position: 'absolute', right: -20, bottom: -20}}>
          <PixelSprite sprite={GEAR} px={6} />
        </div>
        <div style={{position: 'absolute', left: 30, top: 60, fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 34, color: EP02_THEME.blue}}>{'</>'}</div>
      </div>
    );
  return (
    <div style={{position: 'relative'}}>
      <PixelSprite sprite={LAPTOP} px={10} />
      <div style={{position: 'absolute', left: 74, top: 26}}>
        <PixelSprite sprite={APP} px={7} />
      </div>
    </div>
  );
};

export const Ep02Scene07ServiceModels: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f} = useCues(I);
  const cfg = SCENES[I];
  const starts = SERVICE_MODELS.map((m, i) => f(m.short, 2 + i * 3) - 4);
  return (
    <SceneFrame index={I} background={<SkyBackground />} extraSfx={starts.map((s) => ({at: s / fps, sfx: 'whoosh' as const}))}>
      <TitleCard text={cfg.text.headline} size={70} />
      {SERVICE_MODELS.map((m, i) => {
        const d = starts[i];
        const x = slide(frame, d, 14, 1100);
        const s = pop(frame, fps, d + 6, 10);
        return (
          <div key={m.short} style={{position: 'absolute', left: 40, top: CARD_Y[i], width: 1000, height: 350, transform: `translateX(${x}px)`}}>
            <PixelBox bg={EP02_THEME.white} border={COLORS3[i]} padding="0" style={{height: '100%'}} borderWidth={10}>
              <div style={{display: 'flex', height: '100%'}}>
                <div style={{width: 330, background: COLORS3[i], display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`}}>
                  <Illustration i={i} />
                </div>
                <div style={{flex: 1, padding: '20px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6}}>
                  <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, color: COLORS3[i], lineHeight: 1}}>{m.short}</div>
                  <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: EP02_THEME.navy, lineHeight: 1.05, whiteSpace: 'pre-line'}}>{m.long}</div>
                  <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 32, color: COLORS.text, lineHeight: 1.15}}>{m.malay}</div>
                  <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 28, color: COLORS.red}}>{m.example}</div>
                </div>
              </div>
            </PixelBox>
          </div>
        );
      })}
    </SceneFrame>
  );
};
