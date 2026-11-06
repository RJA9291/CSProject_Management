import React, {useMemo} from 'react';
import {PALETTE, PX} from '../../config/theme';
import type {Sprite} from './grid';

type Props = {
  sprite: Sprite;
  px?: number;
  style?: React.CSSProperties;
  palette?: Record<string, string>;
};

export const PixelSprite: React.FC<Props> = ({sprite, px = PX, style, palette}) => {
  const w = Math.max(...sprite.map((r) => r.length));
  const h = sprite.length;
  const rects = useMemo(() => {
    const out: React.ReactNode[] = [];
    sprite.forEach((row, y) => {
      let x = 0;
      while (x < row.length) {
        const c = row[x];
        let run = 1;
        while (row[x + run] === c) run++;
        if (c !== '.' && c !== ' ') {
          const fill = palette?.[c] ?? PALETTE[c];
          out.push(<rect key={`${x}-${y}`} x={x} y={y} width={run} height={1} fill={fill} />);
        }
        x += run;
      }
    });
    return out;
  }, [sprite, palette]);
  return (
    <svg
      width={w * px}
      height={h * px}
      viewBox={`0 0 ${w} ${h}`}
      shapeRendering="crispEdges"
      style={{display: 'block', overflow: 'visible', ...style}}
    >
      {rects}
    </svg>
  );
};

export * from './grid';
