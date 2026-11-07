import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {CHECK, GEAR} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite, Sprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {Reveal, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {MAGNIFIER, VERIFIED} from '../../ep03/assets/icons';
import {TECH_LOOK, TICKET, TOOLBOX} from '../assets/icons';
import {SCENES, STEPS} from '../config/scenes';
import {EP06_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 6;
const COLORS5 = [EP06_THEME.blue, EP06_THEME.purple, EP06_THEME.orange, EP06_THEME.teal, EP06_THEME.green];
const ICONS: Sprite[] = [TICKET, MAGNIFIER, GEAR, TOOLBOX, VERIFIED];

export const Ep06Scene07Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, end, fps} = useCues(I);
  const starts = STEPS.map((s, i) => f(s.cue, 2 + i * 1.5) - 4);
  const current = starts.filter((s) => frame >= s).length - 1;
  return (
    <SceneFrame index={I} background={<CyberBackground navyFrom={Infinity} />} extraSfx={[...starts.map((s) => ({at: s / fps, sfx: 'pop' as const})), {at: (end - 2) / fps, sfx: 'success'}]}>
      <TitleCard text={SCENES[I].text.headline} size={54} />
      {STEPS.map((s, i) => (
        <Reveal key={s.title} delay={starts[i]} mode="slideLeft" style={{left: 40, top: 330 + i * 146, width: 1000, height: 132}}>
          <PixelBox bg={COLORS.white} border={current === i ? EP06_THEME.red : COLORS5[i]} padding="0" borderWidth={7} style={{height: '100%'}}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
              <div style={{width: 100, height: '100%', background: COLORS5[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 60, color: COLORS.white}}>{i + 1}</div>
              <div style={{width: 110, display: 'flex', justifyContent: 'center'}}>
                <PixelSprite sprite={ICONS[i]} px={5} />
              </div>
              <div style={{flex: 1}}>
                <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 48, color: COLORS5[i], lineHeight: 1}}>{s.title}</div>
                <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 28, color: COLORS.text}}>{s.desc}</div>
              </div>
              {frame >= (starts[i + 1] ?? end) ? (
                <div style={{marginRight: 20}}>
                  <PixelSprite sprite={CHECK} px={5} />
                </div>
              ) : null}
            </div>
          </PixelBox>
        </Reveal>
      ))}
      <Host scene={I} x={500} y={1080} look={TECH_LOOK} pose={frame >= end - 2 ? 'thumbsUp' : 'pointLeft'} />
    </SceneFrame>
  );
};
