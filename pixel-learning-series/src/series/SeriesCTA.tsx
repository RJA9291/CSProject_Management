import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CAKE, GLYPH_FOLLOW, GLYPH_LIKE, GLYPH_SHARE, HEART} from '../components/PixelIcons';
import {Host} from '../components/PixelCharacter/Host';
import {PixelBox} from '../components/PixelBox';
import {PixelSprite} from '../components/PixelSprite';
import {PixelText, RichLine} from '../components/PixelText';
import {SceneFrame} from '../components/SceneFrame';
import {SpeechBubble} from '../components/SpeechBubble';
import type {SfxCue} from '../config/scenes';
import {COLORS, FONTS} from '../config/theme';
import {pop} from '../lib/anim';
import {useEpisode, useTiming} from '../lib/episode';
import {Reactions} from './Particles';

const BUTTONS = [
  {glyph: GLYPH_LIKE, color: COLORS.red, word: 'Like'},
  {glyph: GLYPH_SHARE, color: COLORS.blue, word: 'Share'},
  {glyph: GLYPH_FOLLOW, color: COLORS.orange, word: 'Follow'},
];

// Series-standard closing: thank you, Like/Share/Follow, Gift Kek support line, "jumpa lagi".
// Text keys: headline, gift, footer; list = button labels.
export const SeriesCTA: React.FC<{index: number; background?: React.ReactNode}> = ({index, background}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cfg = useEpisode().scenes[index];
  const {cueAt} = useTiming();
  const starts = BUTTONS.map((b, i) => Math.round(cueAt(index, b.word, 3 + i * 0.6) * fps));
  const gift = Math.round(cueAt(index, 'Gift', 6) * fps) - 4;
  const jumpa = Math.round(cueAt(index, 'Jumpa', 9) * fps);
  const showFooter = frame >= jumpa - 4;
  const sfx: SfxCue[] = [
    ...starts.map((f) => ({at: f / fps, sfx: 'pop' as const})),
    ...starts.map((f) => ({at: (f + 14) / fps, sfx: 'click' as const})),
    {at: gift / fps, sfx: 'coin'},
    {at: (jumpa - 4) / fps, sfx: 'success'},
  ];
  const giftScale = pop(frame, fps, gift, 9);
  return (
    <SceneFrame index={index} extraSfx={sfx} background={background}>
      <SpeechBubble delay={2} tail="left" tailOffset={190} style={{position: 'absolute', left: 70, top: 200, width: 940}}>
        {showFooter ? (
          <PixelText text={cfg.text.footer} size={84} effect="pop" delay={jumpa - 4} stagger={4} />
        ) : (
          <PixelText text={cfg.text.headline} size={84} effect="pop" delay={6} stagger={6} />
        )}
      </SpeechBubble>
      <Reactions start={starts[0]} x={560} width={440} bottom={1300} />
      <Host scene={index} x={-30} y={1040} pose="goodbye" step={8} />
      {BUTTONS.map((b, i) => {
        const s = pop(frame, fps, starts[i], 8);
        const pressed = frame >= starts[i] + 14 && frame < starts[i] + 20;
        return (
          <div
            key={b.word}
            style={{position: 'absolute', left: 580, top: 860 + i * 140, width: 430, transform: `scale(${s * (pressed ? 0.92 : 1)})`, opacity: frame >= starts[i] ? 1 : 0}}
          >
            <PixelBox bg={b.color} border={COLORS.text} padding="10px 26px">
              <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
                <PixelSprite sprite={b.glyph} px={7} />
                <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 62, color: COLORS.white, letterSpacing: 2}}>{cfg.list?.[i]}</div>
              </div>
            </PixelBox>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 520, top: 1300, width: 520, transform: `scale(${giftScale})`, opacity: frame >= gift ? 1 : 0}}>
        <PixelBox bg={COLORS.white} border={COLORS.red} padding="12px 18px">
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <PixelSprite sprite={CAKE} px={4} />
            <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 38, color: COLORS.text, lineHeight: 1.05, flex: 1}}>
              <RichLine line={cfg.text.gift} />
            </div>
            <PixelSprite sprite={HEART} px={6} />
          </div>
        </PixelBox>
      </div>
    </SceneFrame>
  );
};
