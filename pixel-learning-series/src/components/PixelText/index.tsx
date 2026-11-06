import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';

type Effect = 'pop' | 'zoom' | 'type' | 'slide' | 'none';

type Props = {
  text: string;
  size?: number;
  color?: string;
  emphasis?: string;
  align?: 'left' | 'center' | 'right';
  font?: 'heading' | 'pixel';
  weight?: number;
  effect?: Effect;
  delay?: number;
  // Frames between successive lines.
  stagger?: number;
  lineHeight?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
};

// Renders "*red* words" with the emphasis colour; visibleChars supports the typewriter effect.
export const RichLine: React.FC<{line: string; emphasis?: string; visibleChars?: number}> = ({
  line,
  emphasis = COLORS.red,
  visibleChars,
}) => {
  let shown = 0;
  return (
    <>
      {line.split('*').map((part, i) => {
        let text = part;
        if (visibleChars !== undefined) {
          text = part.slice(0, Math.max(0, visibleChars - shown));
          shown += part.length;
        }
        return (
          <span key={i} style={{color: i % 2 === 1 ? emphasis : undefined}}>
            {text}
          </span>
        );
      })}
    </>
  );
};

export const PixelText: React.FC<Props> = ({
  text,
  size = 96,
  color = COLORS.text,
  emphasis = COLORS.red,
  align = 'center',
  font = 'heading',
  weight = 900,
  effect = 'pop',
  delay = 0,
  stagger = 5,
  lineHeight = 1.05,
  shadow = true,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lines = text.split('\n');
  return (
    <div
      style={{
        fontFamily: font === 'heading' ? FONTS.heading : FONTS.pixel,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        color,
        textAlign: align,
        letterSpacing: font === 'heading' ? -1 : 1,
        textShadow: shadow ? `0 ${Math.round(size / 16)}px 0 rgba(23,23,23,0.12)` : undefined,
        ...style,
      }}
    >
      {lines.map((line, i) => {
        const d = delay + i * stagger;
        const s = pop(frame, fps, d);
        let transform = 'none';
        let opacity = 1;
        let visibleChars: number | undefined;
        if (effect === 'pop') {
          transform = `scale(${s})`;
          opacity = frame >= d ? 1 : 0;
        } else if (effect === 'zoom') {
          transform = `scale(${0.3 + 0.7 * s})`;
          opacity = Math.min(1, Math.max(0, (frame - d) / 6));
        } else if (effect === 'slide') {
          transform = `translateX(${(1 - s) * -200}px)`;
          opacity = Math.min(1, Math.max(0, (frame - d) / 6));
        } else if (effect === 'type') {
          visibleChars = Math.max(0, Math.floor((frame - d) * 1.2));
        }
        return (
          <div key={i} style={{transform, opacity, transformOrigin: 'center'}}>
            <RichLine line={line} emphasis={emphasis} visibleChars={visibleChars} />
          </div>
        );
      })}
    </div>
  );
};
