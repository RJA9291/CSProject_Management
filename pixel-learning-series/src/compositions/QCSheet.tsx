import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {COLORS, FONTS} from '../config/theme';

export type QCSheetProps = {tag: string; frames: number[]; names: string[]};

export const QC_COLS = 6;
export const qcHeight = (n: number) => 12 + Math.ceil(n / QC_COLS) * (606 + 12);

// Quality-control contact sheet built from per-scene stills written by scripts/render-stills.mjs.
export const QCSheet: React.FC<QCSheetProps> = ({tag, frames, names}) => (
  <AbsoluteFill style={{background: '#999', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 12}}>
    {names.map((name, i) => (
      <div key={name} style={{width: 324, height: 606}}>
        <div style={{fontFamily: FONTS.pixel, fontSize: 20, color: COLORS.white, height: 30, whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {String(i + 1).padStart(2, '0')} {name} @{frames[i]}
        </div>
        <Img src={staticFile(`qc/${tag}-${String(i + 1).padStart(2, '0')}.png`)} style={{width: 324, height: 576}} />
      </div>
    ))}
  </AbsoluteFill>
);
