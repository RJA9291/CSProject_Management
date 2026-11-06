import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon, SPARKLE} from '../../components/PixelIcons';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {BIG_CLOUD} from '../assets/icons';
import {SkyBackground} from '../components/SkyBackground';
import {SCENES} from '../config/scenes';
import {EP02_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 12;

export const Ep02Scene13Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const second = f('Teruskan', 3) - 6;
  // Soft, slow expansion of the cloud behind the host.
  const grow = interpolate(frame, [0, 20, 200], [0.6, 1, 1.08], {extrapolateRight: 'clamp'});
  return (
    <SceneFrame index={I} background={<SkyBackground />} extraSfx={[{at: second / fps, sfx: 'sparkle'}]}>
      <div style={{position: 'absolute', left: 120, top: 300, transform: `scale(${grow})`, transformOrigin: '50% 60%'}}>
        <PixelSprite sprite={BIG_CLOUD} px={21} />
      </div>
      <PixelText text={cfg.text.line1} size={80} effect="zoom" delay={8} emphasis={EP02_THEME.blue} style={{position: 'absolute', top: 480, left: 0, right: 0}} />
      <PixelText text={cfg.text.line2} size={80} effect="zoom" delay={second} emphasis={EP02_THEME.red} style={{position: 'absolute', top: 610, left: 0, right: 0}} />
      <Icon sprite={SPARKLE} x={140} y={330} px={10} delay={10} bob={8} />
      <Icon sprite={SPARKLE} x={900} y={420} px={8} delay={second} bob={8} phase={20} />
      <Icon sprite={SPARKLE} x={820} y={1120} px={10} delay={second + 6} bob={8} phase={40} />
      <Host scene={I} x={276} y={1050} pose="thumbsUp" />
    </SceneFrame>
  );
};
