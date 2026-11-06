import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {LfcaBadge} from '../../components/Badge';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon, PENGUIN, SPARKLE} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SCENES} from '../../config/scenes';
import {COLORS, FONTS} from '../../config/theme';
import {pop, slide, snap} from '../../lib/anim';
import {cueAt} from '../../lib/timing';

const I = 4;

export const Scene05Introduction: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cfg = SCENES[I];
  const roadmap = Math.round(cueAt(I, 'roadmap', 2.2) * fps);
  const linux = Math.round(cueAt(I, 'Linux', 4.2) * fps);
  const lfca = Math.round(cueAt(I, 'LFCA', 7.2) * fps);
  // Penguin waddles in from the left, rocking on each step.
  const tuxStart = roadmap;
  const tuxX = interpolate(frame, [tuxStart, tuxStart + 36], [-320, 70], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const walking = frame >= tuxStart && frame < tuxStart + 36;
  const rock = walking ? (Math.floor(frame / 5) % 2 ? 6 : -6) : 0;
  const bannerX = slide(frame, linux - 6, 14, 1200);
  const badgeScale = pop(frame, fps, lfca - 8, 8);
  return (
    <SceneFrame
      index={I}
      extraSfx={[
        {at: tuxStart / fps, sfx: 'jump'},
        {at: (linux - 6) / fps, sfx: 'whoosh'},
        {at: (lfca - 8) / fps, sfx: 'success'},
      ]}
    >
      <PixelText text={cfg.text.headline} size={128} effect="zoom" delay={4} stagger={7} style={{position: 'absolute', top: 190, left: 0, right: 0}} />
      <div style={{position: 'absolute', top: 630, left: 50, right: 50, transform: `translateX(${bannerX}px)`}}>
        <PixelBox bg={COLORS.orange} border={COLORS.text} padding="18px 24px">
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 54, color: COLORS.navy, textAlign: 'center', lineHeight: 1.1, whiteSpace: 'pre-line'}}>
            {cfg.text.sub}
          </div>
        </PixelBox>
      </div>
      <div style={{position: 'absolute', left: snap(tuxX), top: 1170, transform: `rotate(${rock}deg)`, transformOrigin: '50% 100%'}}>
        <PixelSprite sprite={PENGUIN} px={16} />
      </div>
      <div style={{position: 'absolute', left: 360, top: 880, transform: `scale(${badgeScale})`, opacity: frame >= lfca - 8 ? 1 : 0}}>
        <LfcaBadge px={11} />
      </div>
      <Icon sprite={SPARKLE} x={330} y={860} px={8} delay={lfca} bob={6} />
      <Icon sprite={SPARKLE} x={600} y={1150} px={10} delay={lfca + 6} bob={6} phase={30} />
      <Host scene={I} x={560} y={1040} pose="pointLeft" enter="right" enterFrames={20} />
    </SceneFrame>
  );
};
