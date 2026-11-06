import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {STUDENT_LOOK} from '../../assets/characters/people';
import {Icon} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {BIG_CLOUD, FILE, HOUSE, UNIVERSITY} from '../assets/icons';
import {Chip, TitleCard} from '../components/Cards';
import {DataFlow} from '../components/DataFlow';
import {SkyBackground} from '../components/SkyBackground';
import {Traveller} from '../components/TwoPlaces';
import {SCENES} from '../config/scenes';
import {EP02_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 5;

export const Ep02Scene06Everyday: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f} = useCues(I);
  const cfg = SCENES[I];
  const steps = cfg.list ?? [];
  const save = f('simpan', 1.6) - 4;
  const stored = f('Google', 2.6) - 4;
  const home = f('Balik', 5.0) - 2;
  const phone = f('telefon', 6.4) - 2;
  const ending = f('cloud', 9.0) - 2;
  const stepAt = [save, stored, home, phone];
  const flowScale = pop(frame, fps, 8, 10);
  return (
    <SceneFrame
      index={I}
      background={<SkyBackground />}
      extraSfx={[...stepAt.map((s) => ({at: s / fps, sfx: 'blip' as const})), {at: ending / fps, sfx: 'success'}]}
    >
      {frame < ending ? (
        <TitleCard text={cfg.text.headline} size={70} emphasis={EP02_THEME.blue} />
      ) : (
        <TitleCard text={cfg.text.ending} size={78} emphasis={EP02_THEME.blue} delay={ending} />
      )}
      <div style={{position: 'absolute', top: 410, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${flowScale})`}}>
        <PixelBox bg={EP02_THEME.navy} border={EP02_THEME.text} padding="6px 24px" shadow={false}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, color: EP02_THEME.white}}>{cfg.text.flow}</div>
        </PixelBox>
      </div>
      <div style={{position: 'absolute', left: 380, top: 520}}>
        <PixelSprite sprite={BIG_CLOUD} px={8} />
        {frame >= stored + 20 ? (
          <div style={{position: 'absolute', left: 135, top: 70, transform: `scale(${pop(frame, fps, stored + 20, 9)})`}}>
            <PixelSprite sprite={FILE} px={5} />
          </div>
        ) : null}
      </div>
      <Icon sprite={UNIVERSITY} x={30} y={760} px={9} delay={4} bob={0} />
      <Chip label={cfg.text.placeA} x={60} y={700} delay={6} bg={EP02_THEME.blue} size={28} font="pixel" />
      <Icon sprite={HOUSE} x={840} y={780} px={10} delay={home - 4} bob={0} />
      <Chip label={cfg.text.placeB} x={870} y={720} delay={home - 2} bg={EP02_THEME.blue} size={28} font="pixel" />
      {/* Laptop at university -> cloud, then cloud -> phone at home. */}
      <DataFlow points={[[230, 1150], [230, 740], [460, 640]]} start={save + 6} end={home} travel={26} every={9} sprite={FILE} px={3} track={EP02_THEME.white} />
      <DataFlow points={[[700, 640], [880, 740], [880, 1100]]} start={phone + 6} travel={26} every={9} sprite={FILE} px={3} track={EP02_THEME.white} />
      <Traveller look={STUDENT_LOOK} moveAt={home} fromX={40} toX={640} y={1000} />
      <div style={{position: 'absolute', left: 40, top: 1370, width: 1000, display: 'flex', gap: 10}}>
        {steps.map((s, i) => {
          const on = frame >= stepAt[i];
          return (
            <div key={s} style={{flex: 1, transform: `scale(${on ? pop(frame, fps, stepAt[i], 10) : 1})`, opacity: on ? 1 : 0.35}}>
              <PixelBox bg={on ? EP02_THEME.white : EP02_THEME.paleSky} border={on ? EP02_THEME.blue : EP02_THEME.navy} padding="8px 8px" shadow={false} borderWidth={6} step={6}>
                <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: COLORS.text, textAlign: 'center', lineHeight: 1.1, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {i + 1}. {s}
                </div>
              </PixelBox>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
