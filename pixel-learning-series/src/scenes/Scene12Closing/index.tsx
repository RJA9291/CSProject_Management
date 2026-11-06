import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {GLYPH_FOLLOW, GLYPH_LIKE, GLYPH_SHARE, HEART, THUMB} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SpeechBubble} from '../../components/SpeechBubble';
import type {SfxCue} from '../../config/scenes';
import {SCENES} from '../../config/scenes';
import {COLORS, FONTS} from '../../config/theme';
import {pop, snap} from '../../lib/anim';
import {cueAt} from '../../lib/timing';

const I = 11;
const BUTTONS = [
  {glyph: GLYPH_LIKE, color: COLORS.red, word: 'Like'},
  {glyph: GLYPH_SHARE, color: COLORS.blue, word: 'Share'},
  {glyph: GLYPH_FOLLOW, color: COLORS.orange, word: 'Follow'},
];

// Thumbs-up and hearts float up behind the buttons once the call to action starts.
const Reactions: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  return (
    <>
      {Array.from({length: 8}, (_, i) => {
        const life = 80;
        const t = ((frame - start + i * 10) % life) / life;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: snap(560 + random(`rx${i}`) * 440, 4),
              top: snap(1480 - t * 620, 4),
              opacity: 1 - t * t,
            }}
          >
            <PixelSprite sprite={i % 2 ? HEART : THUMB} px={i % 3 === 0 ? 7 : 5} />
          </div>
        );
      })}
    </>
  );
};

export const Scene12Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cfg = SCENES[I];
  const starts = BUTTONS.map((b, i) => Math.round(cueAt(I, b.word, 5 + i * 0.6) * fps));
  const jumpa = Math.round(cueAt(I, 'Jumpa', 10) * fps);
  const showFooter = frame >= jumpa - 4;
  const sfx: SfxCue[] = [
    ...starts.map((f) => ({at: f / fps, sfx: 'pop' as const})),
    ...starts.map((f) => ({at: (f + 14) / fps, sfx: 'click' as const})),
    {at: (jumpa - 4) / fps, sfx: 'success'},
  ];
  return (
    <SceneFrame index={I} extraSfx={sfx}>
      <SpeechBubble delay={2} tail="left" tailOffset={190} style={{position: 'absolute', left: 70, top: 200, width: 940}}>
        {showFooter ? (
          <PixelText text={cfg.text.footer} size={78} effect="pop" delay={jumpa - 4} stagger={4} />
        ) : (
          <PixelText text={cfg.text.headline} size={100} effect="pop" delay={6} stagger={6} />
        )}
      </SpeechBubble>
      <Reactions start={starts[0]} />
      <Host scene={I} x={-30} y={1040} pose="goodbye" step={8} />
      {BUTTONS.map((b, i) => {
        const s = pop(frame, fps, starts[i], 8);
        // A quick "press" dip after each button lands.
        const pressed = frame >= starts[i] + 14 && frame < starts[i] + 20;
        return (
          <div
            key={b.word}
            style={{
              position: 'absolute',
              left: 580,
              top: 940 + i * 160,
              width: 430,
              transform: `scale(${s * (pressed ? 0.92 : 1)})`,
              opacity: frame >= starts[i] ? 1 : 0,
            }}
          >
            <PixelBox bg={b.color} border={COLORS.text} padding="14px 26px">
              <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
                <PixelSprite sprite={b.glyph} px={7} />
                <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 66, color: COLORS.white, letterSpacing: 2}}>
                  {cfg.list?.[i]}
                </div>
              </div>
            </PixelBox>
          </div>
        );
      })}
    </SceneFrame>
  );
};
