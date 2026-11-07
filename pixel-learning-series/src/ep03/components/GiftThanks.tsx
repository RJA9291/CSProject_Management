import React from 'react';
import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {AVATAR_LOOKS, avatarSprite} from '../../assets/characters/people';
import {Host} from '../../components/PixelCharacter/Host';
import {CAKE, HEART, Icon, SPARKLE} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SpeechBubble} from '../../components/SpeechBubble';
import type {SfxCue} from '../../config/scenes';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {useEpisode, useTiming} from '../../lib/episode';
import {Confetti, Reactions} from '../../series/Particles';
import type {Supporter} from '../config/supporters';
import {Entrance, Reveal} from './Cards';

// Card entrances cycle: slide in, pop up, slide in from the other side.
const ENTRANCES: Entrance[] = ['slideLeft', 'pop', 'slideRight'];

const Avatar: React.FC<{s: Supporter; size: number}> = ({s, size}) =>
  s.image ? (
    <Img src={staticFile(s.image)} style={{width: size, height: size, imageRendering: 'pixelated', border: `6px solid ${COLORS.text}`}} />
  ) : (
    <div style={{background: '#DDEFFB', border: `6px solid ${COLORS.text}`, width: size, height: size, overflow: 'hidden', display: 'flex', justifyContent: 'center'}}>
      <PixelSprite sprite={avatarSprite(AVATAR_LOOKS[s.avatar] ?? AVATAR_LOOKS['boy-blue'])} px={Math.max(3, Math.floor(size / 26))} />
    </div>
  );

// Beating pixel heart.
const Beat: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - start);
  const s = 1 + (Math.floor(t / 8) % 2 ? 0.18 : 0);
  return (
    <div style={{transform: `scale(${s})`}}>
      <PixelSprite sprite={HEART} px={5} />
    </div>
  );
};

// Episode 03 Gift Kek thank-you: one card per supporter (any count), each entering as its name
// is read, then the Gift Kek and the full set together with hearts and confetti.
export const GiftThanks: React.FC<{index: number; supporters: Supporter[]}> = ({index, supporters}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cfg = useEpisode().scenes[index];
  const {cueAt, voEnd} = useTiming();
  const n = Math.max(1, supporters.length);
  const starts = supporters.map((s, i) => Math.round(cueAt(index, s.handle, 4 + i * 1.2) * fps) - 4);
  const last = starts[starts.length - 1] ?? 0;
  const cakeAt = last + 26;
  const allAt = Math.min(Math.round(voEnd(index) * fps) - 10, cakeAt + 30);
  // Cards share the band between the heading and the host: one column up to 3 supporters,
  // two columns beyond that (an odd last card is centred).
  const top = 560;
  const band = 520;
  const cols = n > 3 ? 2 : 1;
  const rows = Math.ceil(n / cols);
  const gap = rows > 3 ? 10 : 18;
  const h = Math.min(160, Math.floor((band - gap * (rows - 1)) / rows));
  const width = cols === 1 ? 860 : 490;
  const colGap = 20;
  const slot = (i: number): [number, number] => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const lastAlone = cols === 2 && i === n - 1 && n % 2 === 1;
    const left = cols === 1 || lastAlone ? (1080 - width) / 2 : (1080 - 2 * width - colGap) / 2 + c * (width + colGap);
    return [left, top + r * (h + gap)];
  };
  const sfx: SfxCue[] = [
    ...starts.map((f, i) => ({at: f / fps, sfx: ENTRANCES[i % 3] === 'pop' ? ('pop' as const) : ('whoosh' as const)})),
    {at: cakeAt / fps, sfx: 'coin'},
    {at: allAt / fps, sfx: 'success'},
  ];
  const pill = pop(frame, fps, 14, 10);
  const together = frame >= allAt;
  const cake = pop(frame, fps, cakeAt, 8);
  return (
    <SceneFrame index={index} extraSfx={sfx}>
      <SpeechBubble delay={2} tail="left" tailOffset={420} style={{position: 'absolute', left: 90, top: 170, width: 900}}>
        <PixelText text={cfg.text.headline} size={104} effect="pop" delay={6} stagger={6} />
      </SpeechBubble>
      <div style={{position: 'absolute', top: 455, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${pill})`}}>
        <PixelBox bg={COLORS.orange} border={COLORS.text} padding="6px 28px" shadow={false}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <PixelSprite sprite={CAKE} px={2} />
            <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, color: COLORS.white, letterSpacing: 1}}>{cfg.text.sub}</div>
          </div>
        </PixelBox>
      </div>
      {supporters.map((s, i) => {
        const d = starts[i];
        const active = frame >= d && (i === supporters.length - 1 ? frame < cakeAt : frame < starts[i + 1]);
        const glow = together && Math.floor((frame - allAt) / 10) % supporters.length === i;
        const handleSize = cols === 1 ? Math.min(54, Math.floor((width - h - 200) / ((s.handle.length + 1) * 0.6))) : Math.min(38, Math.floor(250 / ((s.handle.length + 1) * 0.6)));
        return (
          <Reveal key={s.handle} delay={d} mode={ENTRANCES[i % 3]} style={{left: slot(i)[0], top: slot(i)[1], width, height: h}}>
            <PixelBox bg={COLORS.white} border={active || glow ? COLORS.red : COLORS.text} padding={cols === 1 ? '10px 22px' : '10px 14px'} style={{height: '100%'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: cols === 1 ? 22 : 12, height: '100%'}}>
                <Avatar s={s} size={cols === 1 ? h - 52 : h - 72} />
                <div style={{display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0}}>
                  <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: handleSize, color: COLORS.text, whiteSpace: 'nowrap', lineHeight: 1}}>@{s.handle}</div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                    <PixelSprite sprite={CAKE} px={2} />
                    <div style={{fontFamily: FONTS.pixel, fontSize: 26, color: COLORS.red}}>GIFT KEK</div>
                  </div>
                </div>
                <Beat start={d} />
              </div>
            </PixelBox>
          </Reveal>
        );
      })}
      {/* The Gift Kek arrives after the last name, either side of the host. */}
      <div style={{position: 'absolute', left: 40, top: 1180, transform: `scale(${cake})`, opacity: frame >= cakeAt ? 1 : 0}}>
        <PixelSprite sprite={CAKE} px={11} />
      </div>
      <div style={{position: 'absolute', left: 820, top: 1180, transform: `scale(${cake})`, opacity: frame >= cakeAt ? 1 : 0}}>
        <PixelSprite sprite={CAKE} px={11} />
      </div>
      <Icon sprite={SPARKLE} x={250} y={1110} px={8} delay={cakeAt} bob={6} />
      <Icon sprite={SPARKLE} x={790} y={1120} px={8} delay={cakeAt + 4} bob={6} phase={20} />
      <Reactions start={starts[0] ?? 0} x={60} width={960} bottom={1500} rise={460} count={6} thumbs={false} />
      <Host scene={index} x={276} y={1080} pose={frame >= allAt ? 'celebrate' : frame >= starts[0] ? 'thanks' : 'wave'} step={8} />
      <Confetti start={allAt} />
    </SceneFrame>
  );
};
