import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckList} from '../../components/InfographicCard';
import {Host} from '../../components/PixelCharacter/Host';
import {CHECK, SHIELD} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop, snap} from '../../lib/anim';
import {BIG_CLOUD, PADLOCK, PHONE} from '../assets/icons';
import {Chip, TitleCard} from '../components/Cards';
import {SkyBackground} from '../components/SkyBackground';
import {SCENES} from '../config/scenes';
import {EP02_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 9;
const GLYPHS = ['#', '%', '01', '&', '*', '10', '@', '$'];

// Scrambled characters orbiting the cloud = encrypted data.
const Encrypted: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  return (
    <>
      {GLYPHS.map((g, i) => {
        const a = (frame - start) / 40 + (i / GLYPHS.length) * Math.PI * 2;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: snap(540 + Math.cos(a) * 330 - 20, 4),
              top: snap(640 + Math.sin(a) * 130, 4),
              fontFamily: FONTS.pixel,
              fontWeight: 700,
              fontSize: 34,
              color: random(`g${i}`) > 0.5 ? EP02_THEME.navy : EP02_THEME.white,
            }}
          >
            {Math.floor((frame + i * 3) / 6) % 2 ? g : GLYPHS[(i + 3) % GLYPHS.length]}
          </div>
        );
      })}
    </>
  );
};

export const Ep02Scene10Security: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const cfg = SCENES[I];
  const items = cfg.list ?? [];
  const warn = f('automatik', 1.6) - 2;
  const said = [f('password', 3), f('Multi', 4), f('encryption', 5.4), f('access', 6.2)];
  const starts = [...said, ...[0, 1, 2].map((k) => Math.max(said[3], end - 40) + 14 + k * 10)];
  const locked = frame >= f('control', 6.8);
  const typed = Math.max(0, Math.min(10, Math.floor((frame - said[0]) / 2)));
  const mfa = pop(frame, fps, said[1], 10);
  return (
    <SceneFrame
      index={I}
      background={<SkyBackground />}
      extraSfx={[...starts.map((s) => ({at: s / fps, sfx: 'blip' as const})), {at: f('control', 6.8) / fps, sfx: 'click'}]}
    >
      <TitleCard text={cfg.text.headline} size={78} />
      <Chip label={cfg.text.warning} x={300} y={420} delay={warn} bg={COLORS.red} size={40} />
      <div style={{position: 'absolute', left: 380, top: 540}}>
        <PixelSprite sprite={BIG_CLOUD} px={8} />
        <div style={{position: 'absolute', left: 112, top: 24}}>
          <PixelSprite sprite={SHIELD} px={6} />
        </div>
        <div style={{position: 'absolute', left: 230, top: 90}}>
          <PixelSprite sprite={PADLOCK(!locked)} px={5} />
        </div>
      </div>
      <Encrypted start={said[2]} />
      {/* Password field + MFA phone */}
      <div style={{position: 'absolute', left: 50, top: 800, width: 420, opacity: frame >= said[0] - 4 ? 1 : 0}}>
        <PixelBox bg={EP02_THEME.white} border={EP02_THEME.navy} padding="10px 16px" shadow={false} borderWidth={6}>
          <div style={{fontFamily: FONTS.pixel, fontSize: 24, color: EP02_THEME.navy}}>PASSWORD</div>
          <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 40, color: COLORS.text, height: 46, letterSpacing: 4}}>{'*'.repeat(typed)}</div>
        </PixelBox>
      </div>
      <div style={{position: 'absolute', left: 60, top: 960, display: 'flex', alignItems: 'center', gap: 14, transform: `scale(${mfa})`, opacity: frame >= said[1] ? 1 : 0}}>
        <PixelSprite sprite={PHONE} px={6} />
        <div>
          <div style={{fontFamily: FONTS.pixel, fontSize: 24, color: EP02_THEME.navy}}>KOD MFA</div>
          <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 40, color: COLORS.text}}>482 913</div>
          {frame >= said[1] + 16 ? <PixelSprite sprite={CHECK} px={5} /> : null}
        </div>
      </div>
      <div style={{position: 'absolute', left: 500, top: 790, width: 540}}>
        <PixelBox bg={EP02_THEME.white} border={EP02_THEME.blue} padding="16px 20px" shadow={false}>
          <CheckList items={items} starts={starts} size={34} gap={8} />
        </PixelBox>
      </div>
      <Host scene={I} x={-60} y={1090} pose="pointRight" />
    </SceneFrame>
  );
};
