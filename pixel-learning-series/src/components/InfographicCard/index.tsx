import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CHECK} from '../../assets/icons/icons';
import {COLORS, FONTS} from '../../config/theme';
import {pop, slide} from '../../lib/anim';
import {PixelBox} from '../PixelBox';
import {PixelSprite} from '../PixelSprite';
import {RichLine} from '../PixelText';

type HeaderProps = {
  number?: string;
  title: string;
  color: string;
  dark: string;
  delay?: number;
  size?: number;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
};

// Coloured title plate: "1. SYSTEMS & INFRASTRUCTURE".
export const CardHeader: React.FC<HeaderProps> = ({number, title, color, dark, delay = 0, size = 64, icon, style}) => {
  const frame = useCurrentFrame();
  const x = slide(frame, delay, 14, -1200);
  return (
    <div style={{transform: `translateX(${x}px)`, ...style}}>
      <PixelBox bg={color} border={dark} padding="22px 30px" shadow="rgba(23,23,23,0.25)">
        <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
          {number ? (
            <div
              style={{
                fontFamily: FONTS.heading,
                fontWeight: 900,
                fontSize: size * 1.5,
                color: COLORS.white,
                background: dark,
                minWidth: size * 1.6,
                textAlign: 'center',
                lineHeight: 1.15,
              }}
            >
              {number}
            </div>
          ) : null}
          {icon}
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: size, color: COLORS.white, lineHeight: 1.02, whiteSpace: 'pre-line'}}>
            {title}
          </div>
        </div>
      </PixelBox>
    </div>
  );
};

type ListProps = {
  items: string[];
  // Frame at which each item appears.
  starts: number[];
  size?: number;
  gap?: number;
  style?: React.CSSProperties;
};

export const CheckList: React.FC<ListProps> = ({items, starts, size = 50, gap = 14, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap, ...style}}>
      {items.map((item, i) => {
        const d = starts[i] ?? 0;
        const s = pop(frame, fps, d, 13);
        const x = slide(frame, d, 10, 160);
        return (
          <div
            key={item}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              opacity: frame >= d ? 1 : 0,
              transform: `translateX(${x}px)`,
            }}
          >
            <div style={{transform: `scale(${s})`}}>
              <PixelSprite sprite={CHECK} px={6} />
            </div>
            <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: size, color: COLORS.text}}>
              <RichLine line={item} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
