import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {CHECK} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {Reveal, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {DESKTOP, TERMINAL_SCREEN} from '../assets/icons';
import {Tux} from '../components/Tux';
import {COMPARE, SCENES} from '../config/scenes';
import {EP05_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 4;
const COL_W = 490;
const TOP = 330;
const H = 600;

const Points: React.FC<{items: string[]; starts: number[]; color: string}> = ({items, starts, color}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
      {items.map((p, i) => (
        <div key={p} style={{display: 'flex', alignItems: 'center', gap: 10, opacity: frame >= starts[i] ? 1 : 0, transform: `scale(${pop(frame, fps, starts[i], 12)})`, transformOrigin: 'left center'}}>
          <PixelSprite sprite={CHECK} px={4} palette={{E: color}} />
          <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 31, color: COLORS.text, lineHeight: 1.05}}>{p}</div>
        </div>
      ))}
    </div>
  );
};

export const Ep05Scene05LinuxVsWindows: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const flexAt = f('fleksibiliti', 4);
  const distroAt = f('distribution', 5);
  const serverAt = f('server', 6);
  const winAt = f('Windows', 7.5, 1) - 4;
  const pcAt = f('peribadi', 9);
  const bizAt = f('perniagaan', 10.5);
  const linuxStarts = [12, distroAt, serverAt, flexAt, serverAt + 15];
  const winStarts = [winAt + 6, pcAt, bizAt, bizAt + 15];
  const vs = pop(frame, fps, 14, 8);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[...linuxStarts.map((s) => ({at: s / fps, sfx: 'blip' as const})), ...winStarts.map((s) => ({at: s / fps, sfx: 'blip' as const}))]}
    >
      <TitleCard text={SCENES[I].text.headline} size={80} />
      <Reveal delay={6} mode="slideLeft" style={{left: 40, top: TOP, width: COL_W, height: H}}>
        <PixelBox bg={COLORS.white} border={EP05_THEME.green} padding="14px 18px" style={{height: '100%'}}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: EP05_THEME.green, textAlign: 'center'}}>LINUX</div>
          <div style={{display: 'flex', justifyContent: 'center', height: 230, alignItems: 'center'}}>
            <PixelSprite sprite={TERMINAL_SCREEN} px={10} />
          </div>
          <Points items={COMPARE.linux} starts={linuxStarts} color={EP05_THEME.green} />
        </PixelBox>
      </Reveal>
      <Reveal delay={10} mode="slideRight" style={{left: 550, top: TOP, width: COL_W, height: H}}>
        <PixelBox bg={COLORS.white} border={EP05_THEME.blue} padding="14px 18px" style={{height: '100%'}}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: EP05_THEME.blue, textAlign: 'center'}}>WINDOWS</div>
          <div style={{display: 'flex', justifyContent: 'center', height: 230, alignItems: 'center'}}>
            <PixelSprite sprite={DESKTOP()} px={10} />
          </div>
          <Points items={COMPARE.windows} starts={winStarts} color={EP05_THEME.blue} />
        </PixelBox>
      </Reveal>
      <div style={{position: 'absolute', left: 488, top: 560, transform: `scale(${vs})`, opacity: frame >= 14 ? 1 : 0}}>
        <PixelBox bg={EP05_THEME.red} border={COLORS.text} padding="4px 10px" shadow={false} borderWidth={6} step={6}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.white}}>VS</div>
        </PixelBox>
      </div>
      <Tux x={60} y={1150} px={7} pose={frame < winAt ? 'wave' : 'idle'} />
      <Host scene={I} x={276} y={1080} pose={frame >= end - 6 ? 'thumbsUp' : frame >= winAt ? 'pointRight' : 'explain'} />
    </SceneFrame>
  );
};
