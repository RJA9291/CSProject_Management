import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {CLOUD, Icon, ROUTER, SERVER} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {PHONE} from '../../ep02/assets/icons';
import {Banner, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {DESKTOP, TERMINAL_SCREEN} from '../assets/icons';
import {Tux} from '../components/Tux';
import {SCENES} from '../config/scenes';
import {EP05_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 3;
const DEVICES = [SERVER, PHONE, ROUTER, CLOUD, DESKTOP()];
const DEVICE_PX = [5, 5, 5, 5, 4];

export const Ep05Scene04WhatIs: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f} = useCues(I);
  const cfg = SCENES[I];
  const labels = cfg.list ?? [];
  const subAt = 8;
  const kernelAt = f('kernel', 1.4) - 2;
  const osAt = f('sistem', 4.0) - 2;
  const devAt = f('peranti', 6.8) - 4;
  const devStarts = DEVICES.map((_, i) => devAt + i * 6);
  const malay = pop(frame, fps, kernelAt + 10, 10);
  const stack = (d: number) => pop(frame, fps, d, 10);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[{at: kernelAt / fps, sfx: 'sparkle'}, {at: osAt / fps, sfx: 'pop'}, ...devStarts.map((d) => ({at: d / fps, sfx: 'blip' as const}))]}
    >
      <TitleCard text={cfg.text.headline} size={84} />
      <Banner text={cfg.text.sub} top={330} delay={subAt} bg={EP05_THEME.navy} size={34} />
      <div style={{position: 'absolute', left: 40, top: 420, width: 1000, transform: `scale(${malay})`, opacity: frame >= kernelAt + 10 ? 1 : 0}}>
        <PixelBox bg={COLORS.white} border={EP05_THEME.green} padding="10px 20px" shadow={false} borderWidth={6}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 30, color: COLORS.text, textAlign: 'center', lineHeight: 1.15}}>{cfg.text.malay}</div>
        </PixelBox>
      </div>
      <Icon sprite={TERMINAL_SCREEN} x={300} y={560} px={11} delay={4} bob={0} />
      {/* Kernel vs operating system: the kernel is the base layer under the full OS. */}
      <div style={{position: 'absolute', left: 620, top: 590, width: 420, transform: `scale(${stack(osAt)})`, opacity: frame >= osAt ? 1 : 0}}>
        <PixelBox bg={EP05_THEME.blue} border={COLORS.text} padding="8px 12px" shadow={false} borderWidth={6}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.white, textAlign: 'center', lineHeight: 1.1}}>SISTEM OPERASI</div>
          <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 22, color: '#DCEBFF', textAlign: 'center'}}>(kernel + software lain)</div>
        </PixelBox>
      </div>
      <div style={{position: 'absolute', left: 620, top: 700, width: 420, transform: `scale(${stack(kernelAt)})`, opacity: frame >= kernelAt ? 1 : 0}}>
        <PixelBox bg={EP05_THEME.green} border={COLORS.text} padding="10px 12px" shadow={false} borderWidth={6}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.white, textAlign: 'center'}}>KERNEL LINUX</div>
        </PixelBox>
      </div>
      {DEVICES.map((d, i) => (
        <div key={i} style={{position: 'absolute', left: 40 + i * 205, top: 880, width: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${pop(frame, fps, devStarts[i], 10)})`, opacity: frame >= devStarts[i] ? 1 : 0}}>
          <div style={{height: 110, display: 'flex', alignItems: 'flex-end'}}>
            <PixelSprite sprite={d} px={DEVICE_PX[i]} />
          </div>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: EP05_THEME.navy, marginTop: 6}}>{labels[i]}</div>
        </div>
      ))}
      <Tux x={110} y={600} px={7} pose={frame >= devAt ? 'celebrate' : 'point'} enter="left" enterAt={6} />
      <Host scene={I} x={-40} y={1080} pose={frame >= devAt ? 'thumbsUp' : 'explain'} />
    </SceneFrame>
  );
};
