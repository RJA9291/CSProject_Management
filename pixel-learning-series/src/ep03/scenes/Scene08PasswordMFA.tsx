import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckList} from '../../components/InfographicCard';
import {Host} from '../../components/PixelCharacter/Host';
import {CHECK, Icon, SHIELD} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {RichLine} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {KEY, PHONE} from '../../ep02/assets/icons';
import {SkyBackground} from '../../ep02/components/SkyBackground';
import {X_MARK} from '../assets/icons';
import {TitleCard} from '../components/Cards';
import {SCENES} from '../config/scenes';
import {EP03_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 7;
const ACCOUNTS = [
  {name: 'E-MEL', pw: 'Kucing#Biru27'},
  {name: 'BANK', pw: 'R1mau!Lari88'},
  {name: 'SOSIAL', pw: 'Teh_Tarik@93'},
];

export const Ep03Scene08PasswordMFA: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const cfg = SCENES[I];
  const items = cfg.list ?? [];
  const pwAt = f('password', 1.6) - 6;
  const strongAt = f('kuat', 2.4);
  const uniqueAt = f('berbeza', 3.0);
  const mfaAt = f('Multi', 4.6) - 4;
  const otpAt = f('OTP', 8.4) - 4;
  const starts = [strongAt, uniqueAt, Math.round((uniqueAt + mfaAt) / 2), mfaAt, otpAt];
  const typed = Math.max(0, Math.min(10, Math.floor((frame - pwAt) / 2)));
  // Strength meter fills red -> green.
  const strength = interpolate(frame, [pwAt, strongAt + 10], [0.15, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const meterColor = strength < 0.5 ? EP03_THEME.red : strength < 0.85 ? EP03_THEME.orange : EP03_THEME.green;
  const mfa = pop(frame, fps, mfaAt, 10);
  const verified = frame >= mfaAt + 24;
  const warn = pop(frame, fps, otpAt, 9);
  return (
    <SceneFrame
      index={I}
      background={<SkyBackground />}
      extraSfx={[
        ...starts.map((s) => ({at: s / fps, sfx: 'blip' as const})),
        {at: mfaAt / fps, sfx: 'notify'},
        {at: (mfaAt + 24) / fps, sfx: 'success'},
        {at: otpAt / fps, sfx: 'alert'},
      ]}
    >
      <TitleCard text={cfg.text.headline} size={66} />
      {/* Login panel */}
      <div style={{position: 'absolute', left: 40, top: 360, width: 500, opacity: frame >= pwAt - 6 ? 1 : 0}}>
        <PixelBox bg={EP03_THEME.white} border={EP03_THEME.navy} padding="14px 18px">
          <div style={{fontFamily: FONTS.pixel, fontSize: 24, color: EP03_THEME.navy}}>PASSWORD</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, height: 50}}>
            <PixelSprite sprite={KEY} px={4} />
            <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 36, color: COLORS.text, letterSpacing: 1}}>{'*'.repeat(typed)}</div>
          </div>
          <div style={{height: 22, background: '#DCE3EA', marginTop: 8}}>
            <div style={{height: '100%', width: `${Math.round(strength * 10) * 10}%`, background: meterColor}} />
          </div>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: meterColor, marginTop: 4}}>{strength < 0.5 ? 'LEMAH' : strength < 0.85 ? 'SEDERHANA' : 'KUAT ✓'}</div>
        </PixelBox>
      </div>
      {/* One different password per account */}
      {ACCOUNTS.map((a, i) => {
        const d = uniqueAt + i * 6;
        return (
          <div key={a.name} style={{position: 'absolute', left: 40, top: 610 + i * 74, width: 500, transform: `scale(${pop(frame, fps, d, 10)})`, opacity: frame >= d ? 1 : 0}}>
            <PixelBox bg={EP03_THEME.white} border={EP03_THEME.blue} padding="6px 14px" shadow={false} borderWidth={5} step={6}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28}}>
                <span style={{color: EP03_THEME.blue}}>{a.name}</span>
                <span style={{fontFamily: FONTS.pixel, fontWeight: 700, color: COLORS.text, fontSize: 24}}>{a.pw}</span>
              </div>
            </PixelBox>
          </div>
        );
      })}
      {/* MFA phone */}
      <div style={{position: 'absolute', left: 60, top: 850, display: 'flex', alignItems: 'center', gap: 16, transform: `scale(${mfa})`, opacity: frame >= mfaAt ? 1 : 0}}>
        <PixelSprite sprite={PHONE} px={7} />
        <PixelBox bg={EP03_THEME.white} border={EP03_THEME.green} padding="8px 14px" shadow={false} borderWidth={6}>
          <div style={{fontFamily: FONTS.pixel, fontSize: 22, color: EP03_THEME.navy}}>KOD MFA</div>
          <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 38, color: COLORS.text}}>482 913</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, opacity: verified ? 1 : 0}}>
            <PixelSprite sprite={CHECK} px={4} />
            <span style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: EP03_THEME.green}}>DISAHKAN</span>
          </div>
        </PixelBox>
      </div>
      {/* Checklist */}
      <div style={{position: 'absolute', left: 570, top: 360, width: 470}}>
        <PixelBox bg={EP03_THEME.white} border={EP03_THEME.blue} padding="16px 18px" shadow={false}>
          <CheckList items={items} starts={starts} size={31} gap={14} />
        </PixelBox>
      </div>
      <Icon sprite={SHIELD} x={760} y={760} px={10} delay={mfaAt + 24} bob={8} />
      {/* Never share OTP / PIN */}
      <div style={{position: 'absolute', left: 560, top: 1110, width: 480, transform: `scale(${warn})`, opacity: frame >= otpAt ? 1 : 0}}>
        <PixelBox bg={EP03_THEME.red} border={COLORS.text} padding="12px 16px">
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <PixelSprite sprite={X_MARK} px={6} palette={{R: '#FFFFFF'}} />
            <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.white, lineHeight: 1.05}}>
              <RichLine line={cfg.text.warning} emphasis={EP03_THEME.yellow} />
            </div>
          </div>
        </PixelBox>
      </div>
      <Host scene={I} x={-40} y={1080} pose={frame >= otpAt ? 'warn' : frame >= mfaAt + 24 ? 'thumbsUp' : 'explain'} expression={frame >= otpAt && frame < end ? 'confused' : undefined} />
    </SceneFrame>
  );
};
