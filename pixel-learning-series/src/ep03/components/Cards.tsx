import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {PixelBox} from '../../components/PixelBox';
import {RichLine} from '../../components/PixelText';
import {COLORS, FONTS} from '../../config/theme';
import {pop, slide} from '../../lib/anim';
import {EP03_THEME} from '../config/theme';

export {Chip, TitleCard} from '../../ep02/components/Cards';

export type Entrance = 'slideLeft' | 'slideRight' | 'pop' | 'rise';

// Positioned wrapper that brings its content in at `delay` with the chosen entrance.
export const Reveal: React.FC<{delay: number; mode?: Entrance; style?: React.CSSProperties; children: React.ReactNode}> = ({delay, mode = 'pop', style, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  let transform = 'none';
  if (mode === 'pop') transform = `scale(${pop(frame, fps, delay, 10)})`;
  if (mode === 'slideLeft') transform = `translateX(${slide(frame, delay, 14, -1200)}px)`;
  if (mode === 'slideRight') transform = `translateX(${slide(frame, delay, 14, 1200)}px)`;
  if (mode === 'rise') transform = `translateY(${slide(frame, delay, 12, 500)}px)`;
  return <div style={{position: 'absolute', transform, opacity: frame >= delay ? 1 : 0, ...style}}>{children}</div>;
};

// Centered pill label (e.g. "INI TINDAKAN SEGERA!").
export const Banner: React.FC<{text: string; top: number; delay: number; bg?: string; size?: number; color?: string}> = ({text, top, delay, bg = EP03_THEME.red, size = 44, color = COLORS.white}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 10);
  return (
    <div style={{position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${s})`, opacity: frame >= delay ? 1 : 0}}>
      <PixelBox bg={bg} border={COLORS.text} padding="6px 28px" shadow={false} borderWidth={6} step={6}>
        <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, color, whiteSpace: 'nowrap'}}>
          <RichLine line={text} emphasis={EP03_THEME.yellow} />
        </div>
      </PixelBox>
    </div>
  );
};

type RowProps = {
  color: string;
  icon: React.ReactNode;
  title: string;
  desc?: string;
  number?: string;
  height: number;
  titleSize?: number;
  descSize?: number;
  border?: string;
  right?: React.ReactNode;
};

// Horizontal info card: coloured icon block, title + description, optional right-hand extra.
export const InfoRow: React.FC<RowProps> = ({color, icon, title, desc, number, height, titleSize = 52, descSize = 32, border, right}) => (
  <PixelBox bg={COLORS.white} border={border ?? color} padding="0" borderWidth={8} style={{height}}>
    <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
      <div style={{width: height - 16, minWidth: height - 16, height: '100%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
        {icon}
        {number ? (
          <div style={{position: 'absolute', left: 6, top: 4, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.white}}>{number}</div>
        ) : null}
      </div>
      <div style={{padding: '0 22px', flex: 1, minWidth: 0}}>
        <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: titleSize, color, lineHeight: 1}}>{title}</div>
        {desc ? (
          <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: descSize, color: COLORS.text, lineHeight: 1.1, marginTop: 6, whiteSpace: 'pre-line'}}>{desc}</div>
        ) : null}
      </div>
      {right}
    </div>
  </PixelBox>
);
