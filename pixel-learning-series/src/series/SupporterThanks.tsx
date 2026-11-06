import React from 'react';
import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AVATAR_LOOKS, avatarSprite} from '../assets/characters/people';
import {CAKE, HEART, Icon, SPARKLE} from '../components/PixelIcons';
import {Host} from '../components/PixelCharacter/Host';
import {PixelBox} from '../components/PixelBox';
import {PixelSprite} from '../components/PixelSprite';
import {PixelText} from '../components/PixelText';
import {SceneFrame} from '../components/SceneFrame';
import {SpeechBubble} from '../components/SpeechBubble';
import type {SfxCue} from '../config/scenes';
import {COLORS, FONTS} from '../config/theme';
import {pop} from '../lib/anim';
import {useEpisode, useTiming} from '../lib/episode';
import {Confetti, Reactions} from './Particles';

export type SupporterInfo = {handle: string; avatar: string; image?: string};

const CARD_W = 470;
const CARD_H = 210;
const POS: [number, number][] = [
  [50, 560],
  [560, 560],
  [50, 795],
  [560, 795],
];

const Avatar: React.FC<{s: SupporterInfo}> = ({s}) =>
  s.image ? (
    <Img src={staticFile(s.image)} style={{width: 132, height: 132, imageRendering: 'pixelated', border: `6px solid ${COLORS.text}`}} />
  ) : (
    <div style={{background: '#DDEFFB', border: `6px solid ${COLORS.text}`, width: 132, height: 132, overflow: 'hidden'}}>
      <PixelSprite sprite={avatarSprite(AVATAR_LOOKS[s.avatar] ?? AVATAR_LOOKS['boy-blue'])} px={5} />
    </div>
  );

// Series-standard Gift Kek thank-you: one card per supporter, each popping in as the narrator says the name.
export const SupporterThanks: React.FC<{index: number; supporters: SupporterInfo[]}> = ({index, supporters}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cfg = useEpisode().scenes[index];
  const {cueAt} = useTiming();
  const starts = supporters.map((s, i) => Math.round(cueAt(index, s.handle, 3 + i * 0.8) * fps) - 3);
  const last = starts[starts.length - 1] ?? 0;
  const sfx: SfxCue[] = [...starts.map((f) => ({at: f / fps, sfx: 'pop' as const})), {at: (last + 20) / fps, sfx: 'success'}];
  const pill = pop(frame, fps, 14, 10);
  return (
    <SceneFrame index={index} extraSfx={sfx}>
      <SpeechBubble delay={2} tail="left" tailOffset={420} style={{position: 'absolute', left: 90, top: 170, width: 900}}>
        <PixelText text={cfg.text.headline} size={96} effect="pop" delay={6} stagger={6} />
      </SpeechBubble>
      <div style={{position: 'absolute', top: 470, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${pill})`}}>
        <PixelBox bg={COLORS.orange} border={COLORS.text} padding="6px 28px" shadow={false}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, color: COLORS.white, letterSpacing: 1}}>{cfg.text.sub}</div>
        </PixelBox>
      </div>
      {supporters.map((s, i) => {
        const d = starts[i];
        const sc = pop(frame, fps, d, 9);
        // The newest card glows until the next name is read.
        const active = frame >= d && (i === supporters.length - 1 ? frame < d + 40 : frame < starts[i + 1]);
        return (
          <div key={s.handle} style={{position: 'absolute', left: POS[i][0], top: POS[i][1], width: CARD_W, height: CARD_H, transform: `scale(${sc})`, opacity: frame >= d ? 1 : 0}}>
            <PixelBox bg={COLORS.white} border={active ? COLORS.red : COLORS.text} padding="18px 18px" style={{height: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 16, height: '100%'}}>
                <Avatar s={s} />
                <div style={{display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0}}>
                  <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: Math.min(38, Math.floor(262 / ((s.handle.length + 1) * 0.6))), color: COLORS.text, whiteSpace: 'nowrap'}}>@{s.handle}</div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                    <PixelSprite sprite={CAKE} px={3} />
                    <div style={{fontFamily: FONTS.pixel, fontSize: 24, color: COLORS.red}}>GIFT KEK</div>
                    <PixelSprite sprite={HEART} px={4} />
                  </div>
                </div>
              </div>
            </PixelBox>
          </div>
        );
      })}
      <Icon sprite={CAKE} x={40} y={1180} px={11} delay={10} bob={6} />
      <Icon sprite={CAKE} x={820} y={1180} px={11} delay={14} bob={6} phase={30} />
      <Icon sprite={SPARKLE} x={260} y={1090} px={8} delay={last} bob={6} />
      <Icon sprite={SPARKLE} x={780} y={1110} px={8} delay={last + 4} bob={6} phase={20} />
      <Reactions start={starts[0] ?? 0} x={60} width={960} bottom={1500} rise={500} count={6} thumbs={false} />
      <Host scene={index} x={276} y={1060} pose={frame >= last + 20 ? 'celebrate' : 'thanks'} step={8} />
      <Confetti start={last + 20} />
    </SceneFrame>
  );
};
