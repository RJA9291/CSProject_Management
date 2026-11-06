import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {PixelBox} from '../../components/PixelBox';
import {PixelText} from '../../components/PixelText';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {EP02_THEME} from '../config/theme';

type TitleProps = {
  text: string;
  size?: number;
  top?: number;
  delay?: number;
  emphasis?: string;
  width?: number;
};

// White title plate used on the blue sky so headlines stay readable.
export const TitleCard: React.FC<TitleProps> = ({text, size = 76, top = 170, delay = 2, emphasis = COLORS.red, width = 940}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 10);
  return (
    <div style={{position: 'absolute', top, left: (1080 - width) / 2, width, transform: `scale(${s})`}}>
      <PixelBox bg={EP02_THEME.white} border={EP02_THEME.navy} padding="18px 24px">
        <PixelText text={text} size={size} effect="none" emphasis={emphasis} shadow={false} />
      </PixelBox>
    </div>
  );
};

type ChipProps = {
  label: string;
  x: number;
  y: number;
  delay: number;
  bg?: string;
  color?: string;
  size?: number;
  font?: 'heading' | 'pixel';
};

// Small pop-in label.
export const Chip: React.FC<ChipProps> = ({label, x, y, delay, bg = EP02_THEME.navy, color = EP02_THEME.white, size = 34, font = 'heading'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 9);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s})`, opacity: frame >= delay ? 1 : 0}}>
      <PixelBox bg={bg} border={COLORS.text} padding="6px 18px" shadow={false} step={6} borderWidth={6}>
        <div style={{fontFamily: font === 'heading' ? FONTS.heading : FONTS.pixel, fontWeight: 900, fontSize: size, color, whiteSpace: 'nowrap'}}>{label}</div>
      </PixelBox>
    </div>
  );
};
