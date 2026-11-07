import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {CHECK, LAPTOP} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {Banner, Chip, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {TECH_LOOK, TICKET} from '../assets/icons';
import {User} from '../components/People';
import {SCENES} from '../config/scenes';
import {EP06_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 3;
const CHIP_COLORS = [EP06_THEME.blue, EP06_THEME.purple, EP06_THEME.orange, EP06_THEME.teal];

export const Ep06Scene04WhatIs: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f} = useCues(I);
  const cfg = SCENES[I];
  const cats = cfg.list ?? [];
  const userAt = 10;
  const ticketAt = f('membantu', 1.6) - 4;
  const catAt = [f('komputer', 3.4), f('software', 4.0), f('hardware', 4.6), f('rangkaian', 5.2)].map((c) => c - 2);
  const doneAt = f('lancar', 7.2);
  const resolved = frame >= doneAt;
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[{at: ticketAt / fps, sfx: 'notify'}, ...catAt.map((c) => ({at: c / fps, sfx: 'blip' as const})), {at: doneAt / fps, sfx: 'success'}]}
    >
      <TitleCard text={cfg.text.headline} size={78} />
      <Banner text={cfg.text.sub} top={320} delay={8} bg={EP06_THEME.navy} size={36} />
      <div style={{position: 'absolute', left: 40, top: 410, width: 1000, transform: `scale(${pop(frame, fps, 14, 10)})`}}>
        <PixelBox bg={COLORS.white} border={EP06_THEME.blue} padding="10px 20px" shadow={false} borderWidth={6}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 29, color: COLORS.text, textAlign: 'center', lineHeight: 1.15}}>{cfg.text.malay}</div>
        </PixelBox>
      </div>
      {/* Helpdesk ticket */}
      <div style={{position: 'absolute', left: 520, top: 560, width: 520, transform: `scale(${pop(frame, fps, ticketAt, 10)})`, opacity: frame >= ticketAt ? 1 : 0}}>
        <PixelBox bg={COLORS.white} border={resolved ? EP06_THEME.green : EP06_THEME.orange} padding="12px 16px" borderWidth={6}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <PixelSprite sprite={TICKET} px={4} />
            <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 32, color: EP06_THEME.navy}}>{cfg.text.ticket}</div>
          </div>
          <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 26, color: COLORS.text, marginTop: 6}}>{cfg.text.issue}</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 8}}>
            {resolved ? <PixelSprite sprite={CHECK} px={4} /> : null}
            <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 24, color: COLORS.white, background: resolved ? EP06_THEME.green : EP06_THEME.orange, padding: '2px 10px'}}>
              {resolved ? 'SELESAI' : 'DALAM SIASATAN'}
            </div>
          </div>
        </PixelBox>
      </div>
      {cats.map((c, i) => (
        <Chip key={c} label={c} x={40 + (i % 2) * 230} y={580 + Math.floor(i / 2) * 90} delay={catAt[i]} bg={CHIP_COLORS[i]} size={30} />
      ))}
      <User look="hijab-pink" x={620} y={1080} px={10} pose="hold" expression={resolved ? 'happy' : 'confused'} walkFrom={1100} walkAt={userAt} />
      {frame >= userAt + 24 ? (
        <div style={{position: 'absolute', left: 620 + 12 * 10, top: 1080 + 26 * 10}}>
          <PixelSprite sprite={LAPTOP} px={5} />
        </div>
      ) : null}
      <Host scene={I} x={-60} y={1080} look={TECH_LOOK} pose={resolved ? 'thumbsUp' : frame >= ticketAt ? 'pointRight' : 'explain'} />
    </SceneFrame>
  );
};
