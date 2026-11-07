import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {PADLOCK} from '../../ep02/assets/icons';
import {Reveal, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {WARNING, X_MARK} from '../../ep03/assets/icons';
import {PRINTER, WIFI} from '../../ep04/assets/icons';
import {MONITOR} from '../assets/icons';
import {PROBLEMS, SCENES} from '../config/scenes';
import {EP06_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 4;

// Small animated "symptom" per problem card.
const Symptom: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 6) % 2 === 0;
  if (i === 0) return <PixelSprite sprite={MONITOR('loading', Math.floor(frame / 3))} px={4} />;
  if (i === 1)
    return (
      <div style={{position: 'relative'}}>
        <PixelSprite sprite={WIFI(0, 'U', 'g')} px={6} />
        <div style={{position: 'absolute', left: 50, top: 26, opacity: blink ? 1 : 0.4}}>
          <PixelSprite sprite={X_MARK} px={4} />
        </div>
      </div>
    );
  if (i === 2)
    return (
      <div style={{position: 'relative'}}>
        <PixelSprite sprite={PRINTER} px={5} />
        <div style={{position: 'absolute', left: 64, top: -14, opacity: blink ? 1 : 0}}>
          <PixelSprite sprite={WARNING} px={3} />
        </div>
      </div>
    );
  if (i === 3)
    return (
      <div style={{width: 104, background: COLORS.white, border: `5px solid ${COLORS.text}`, transform: `rotate(${blink ? -3 : 3}deg)`}}>
        <div style={{height: 16, background: EP06_THEME.red, display: 'flex', justifyContent: 'flex-end', paddingRight: 4, fontFamily: FONTS.pixel, fontSize: 14, color: COLORS.white, lineHeight: '16px'}}>x</div>
        <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 16, color: EP06_THEME.red, textAlign: 'center', padding: '8px 0'}}>CRASH!</div>
      </div>
    );
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
      <PixelSprite sprite={PADLOCK(false)} px={4} />
      <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 22, color: blink ? EP06_THEME.red : COLORS.text}}>****</div>
    </div>
  );
};

export const Ep06Scene05Problems: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const starts = PROBLEMS.map((p, i) => f(p.cue, 2 + i * 1.1) - 4);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={0} alarmFrom={4} alarmUntil={22} />}
      extraSfx={starts.map((s) => ({at: s / fps, sfx: 'buzz' as const}))}
    >
      <TitleCard text={SCENES[I].text.headline} size={68} />
      {PROBLEMS.map((p, i) => (
        <Reveal key={p.title} delay={starts[i]} mode={i % 2 ? 'slideRight' : 'slideLeft'} style={{left: 40, top: 330 + i * 146, width: 1000, height: 132}}>
          <PixelBox bg={COLORS.white} border={EP06_THEME.red} padding="0" borderWidth={7} style={{height: '100%'}}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
              <div style={{width: 170, height: '100%', background: '#FBE3E3', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Symptom i={i} />
              </div>
              <div style={{padding: '0 24px'}}>
                <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, color: EP06_THEME.red, lineHeight: 1}}>{p.title}</div>
                <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 30, color: COLORS.text}}>{p.malay}</div>
              </div>
            </div>
          </PixelBox>
        </Reveal>
      ))}
      <Host scene={I} x={-40} y={1090} pose={frame >= starts[2] ? 'think' : 'warn'} expression="confused" />
    </SceneFrame>
  );
};
