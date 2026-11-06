import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon, LAPTOP, SERVER, SPARKLE} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {BIG_CLOUD, PHONE} from '../assets/icons';
import {DataFlow} from '../components/DataFlow';
import {SkyBackground} from '../components/SkyBackground';
import {SCENES} from '../config/scenes';
import {EP02_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 3;

export const Ep02Scene04Topic: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f} = useCues(I);
  const cfg = SCENES[I];
  // The beige world turns into the blue pixel sky at the start of the topic.
  const reveal = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  const title = f('Cloud', 1.4) - 6;
  const devices = f('teknologi', 2.8) - 4;
  const label = pop(frame, fps, 6, 10);
  const titleScale = pop(frame, fps, title, 9);
  const cloud = pop(frame, fps, 14, 12);
  return (
    <SceneFrame index={I} background={<SkyBackground reveal={reveal} />} extraSfx={[{at: title / fps, sfx: 'success'}, {at: devices / fps, sfx: 'sparkle'}]}>
      <div style={{position: 'absolute', top: 170, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${label})`}}>
        <PixelBox bg={EP02_THEME.navy} border={EP02_THEME.text} padding="6px 30px" shadow={false}>
          <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 44, color: EP02_THEME.white, letterSpacing: 4}}>{cfg.text.label}</div>
        </PixelBox>
      </div>
      <div style={{position: 'absolute', top: 280, left: 90, width: 900, transform: `scale(${titleScale})`, opacity: frame >= title ? 1 : 0}}>
        <PixelBox bg={EP02_THEME.white} border={EP02_THEME.navy} padding="18px 20px">
          <PixelText text={cfg.text.headline} size={132} effect="none" emphasis={EP02_THEME.blue} shadow={false} />
          <PixelText text={cfg.text.sub} size={38} effect="type" delay={title + 8} color={EP02_THEME.navy} weight={700} shadow={false} style={{marginTop: 10}} />
        </PixelBox>
      </div>
      <div style={{position: 'absolute', left: 470, top: 830, transform: `scale(${cloud})`, transformOrigin: '50% 100%'}}>
        <PixelSprite sprite={BIG_CLOUD} px={13} />
      </div>
      <DataFlow points={[[640, 1250], [700, 1100]]} start={devices + 10} travel={20} every={12} px={5} />
      <DataFlow points={[[960, 1230], [880, 1100]]} start={devices + 14} travel={20} every={12} px={5} />
      <Icon sprite={SERVER} x={460} y={1180} px={7} delay={devices} bob={0} />
      <Icon sprite={LAPTOP} x={600} y={1270} px={8} delay={devices + 4} bob={0} />
      <Icon sprite={PHONE} x={900} y={1230} px={8} delay={devices + 8} bob={6} />
      <Icon sprite={SPARKLE} x={460} y={860} px={8} delay={title + 4} bob={6} />
      <Host scene={I} x={-40} y={1060} pose="pointRight" />
    </SceneFrame>
  );
};
