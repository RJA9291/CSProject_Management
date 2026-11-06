import React from 'react';
import {COLORS} from '../../config/theme';

// Stepped-corner outline so boxes read as pixel art rather than rounded vector UI.
const stepped = (s: number) =>
  `polygon(${[
    [`${2 * s}px`, '0'],
    [`calc(100% - ${2 * s}px)`, '0'],
    [`calc(100% - ${2 * s}px)`, `${s}px`],
    [`calc(100% - ${s}px)`, `${s}px`],
    [`calc(100% - ${s}px)`, `${2 * s}px`],
    ['100%', `${2 * s}px`],
    ['100%', `calc(100% - ${2 * s}px)`],
    [`calc(100% - ${s}px)`, `calc(100% - ${2 * s}px)`],
    [`calc(100% - ${s}px)`, `calc(100% - ${s}px)`],
    [`calc(100% - ${2 * s}px)`, `calc(100% - ${s}px)`],
    [`calc(100% - ${2 * s}px)`, '100%'],
    [`${2 * s}px`, '100%'],
    [`${2 * s}px`, `calc(100% - ${s}px)`],
    [`${s}px`, `calc(100% - ${s}px)`],
    [`${s}px`, `calc(100% - ${2 * s}px)`],
    ['0', `calc(100% - ${2 * s}px)`],
    ['0', `${2 * s}px`],
    [`${s}px`, `${2 * s}px`],
    [`${s}px`, `${s}px`],
    [`${2 * s}px`, `${s}px`],
  ]
    .map(([x, y]) => `${x} ${y}`)
    .join(', ')})`;

type Props = {
  bg?: string;
  border?: string;
  borderWidth?: number;
  shadow?: string | false;
  step?: number;
  padding?: number | string;
  style?: React.CSSProperties;
  innerStyle?: React.CSSProperties;
  children?: React.ReactNode;
};

export const PixelBox: React.FC<Props> = ({
  bg = COLORS.white,
  border = COLORS.text,
  borderWidth = 8,
  shadow = 'rgba(23,23,23,0.22)',
  step = 8,
  padding = 24,
  style,
  innerStyle,
  children,
}) => (
  <div style={{position: 'relative', ...style}}>
    {shadow ? (
      <div style={{position: 'absolute', inset: 0, transform: 'translate(12px, 12px)', background: shadow, clipPath: stepped(step)}} />
    ) : null}
    <div style={{position: 'relative', background: border, clipPath: stepped(step), padding: borderWidth, height: '100%', boxSizing: 'border-box'}}>
      <div style={{background: bg, clipPath: stepped(Math.max(4, step - 4)), padding, height: '100%', boxSizing: 'border-box', ...innerStyle}}>
        {children}
      </div>
    </div>
  </div>
);
