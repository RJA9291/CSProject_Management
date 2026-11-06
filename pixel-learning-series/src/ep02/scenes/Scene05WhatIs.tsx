import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon, LAPTOP, SERVER} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {BIG_CLOUD, DATABASE} from '../assets/icons';
import {Chip, TitleCard} from '../components/Cards';
import {DataFlow} from '../components/DataFlow';
import {SkyBackground} from '../components/SkyBackground';
import {SCENES} from '../config/scenes';
import {EP02_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 4;
const CHIP_POS: [number, number][] = [
  [470, 770],
  [800, 760],
  [450, 1080],
  [820, 1070],
];
const CHIP_COLORS = [EP02_THEME.blue, EP02_THEME.navy, EP02_THEME.teal, EP02_THEME.purple];

export const Ep02Scene05WhatIs: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f} = useCues(I);
  const cfg = SCENES[I];
  const words = cfg.list ?? [];
  const chipAt = words.map((w, i) => f(w.toLowerCase(), 2 + i * 0.6) - 2);
  const def = f('perkhidmatan', 1.0) - 4;
  const malay = f('tanpa', 5.5) - 4;
  const net = f('internet', 4.5) - 4;
  const defScale = pop(frame, fps, def, 10);
  const malayScale = pop(frame, fps, malay, 10);
  const cloud = pop(frame, fps, 10, 12);
  return (
    <SceneFrame
      index={I}
      background={<SkyBackground />}
      extraSfx={[...chipAt.map((c) => ({at: c / fps, sfx: 'blip' as const})), {at: net / fps, sfx: 'whoosh'}]}
    >
      <TitleCard text={cfg.text.headline} size={74} emphasis={EP02_THEME.blue} />
      <div style={{position: 'absolute', top: 410, left: 70, width: 940, transform: `scale(${defScale})`, opacity: frame >= def ? 1 : 0}}>
        <PixelBox bg={EP02_THEME.navy} border={EP02_THEME.text} padding="14px 20px" shadow={false}>
          <PixelText text={cfg.text.definition} size={46} color={EP02_THEME.white} emphasis="#FFD36B" effect="none" weight={900} shadow={false} />
        </PixelBox>
      </div>
      <div style={{position: 'absolute', top: 570, left: 70, width: 940, transform: `scale(${malayScale})`, opacity: frame >= malay ? 1 : 0}}>
        <PixelBox bg={EP02_THEME.white} border={EP02_THEME.blue} padding="12px 22px" shadow={false}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 36, color: EP02_THEME.text, textAlign: 'center', lineHeight: 1.2}}>{cfg.text.malay}</div>
        </PixelBox>
      </div>
      <div style={{position: 'absolute', left: 520, top: 800, transform: `scale(${cloud})`, transformOrigin: '50% 100%'}}>
        <PixelSprite sprite={BIG_CLOUD} px={11} />
        <div style={{position: 'absolute', left: 120, top: 80, display: 'flex', gap: 20}}>
          <PixelSprite sprite={SERVER} px={5} />
          <PixelSprite sprite={DATABASE} px={6} />
        </div>
      </div>
      {words.map((w, i) => (
        <Chip key={w} label={w} x={CHIP_POS[i][0]} y={CHIP_POS[i][1]} delay={chipAt[i]} bg={CHIP_COLORS[i]} />
      ))}
      <DataFlow points={[[700, 1300], [700, 1190], [740, 1060]]} start={net} travel={22} every={8} px={5} track={EP02_THEME.white} />
      <Chip label="INTERNET" x={730} y={1180} delay={net} bg={EP02_THEME.orange} size={26} font="pixel" />
      <Icon sprite={LAPTOP} x={560} y={1290} px={10} delay={net - 6} bob={0} />
      <Host scene={I} x={-50} y={1060} pose="explain" />
    </SceneFrame>
  );
};
