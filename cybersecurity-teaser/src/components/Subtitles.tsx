import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {LINES} from '../data/timeline';
import {FONTS, SAFE} from '../theme';
import {clamp} from './motion';

/**
 * Burned-in bilingual subtitles: the spoken line (EN or BM) on top, the
 * translation underneath. Same timing data as the exported .srt files.
 */
export const Subtitles: React.FC<{hold?: number}> = ({hold = 10}) => {
  const frame = useCurrentFrame();
  const line = LINES.find((l, i) => {
    const next = LINES[i + 1];
    const end = Math.min(l.to + hold, next ? next.from : Infinity);
    return frame >= l.from && frame < end;
  });
  if (!line) return null;
  const idx = LINES.indexOf(line);
  const next = LINES[idx + 1];
  const end = Math.min(line.to + hold, next ? next.from : Infinity);
  const o = Math.min(interpolate(frame, [line.from, line.from + 4], [0, 1], clamp), interpolate(frame, [end - 4, end], [1, 0], clamp));
  return (
    <div
      style={{
        position: 'absolute',
        left: SAFE.side,
        right: SAFE.side,
        bottom: SAFE.bottom - 110,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        opacity: o,
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontFamily: FONTS.body,
          fontWeight: 800,
          fontSize: 44,
          lineHeight: 1.22,
          color: '#ffffff',
          textShadow: '0 2px 4px rgba(0,0,0,0.95), 0 0 24px rgba(0,0,0,0.9)',
          padding: '6px 18px',
          background: 'rgba(2,4,10,0.45)',
          borderRadius: 12,
        }}
      >
        {line.sub}
      </div>
      <div
        style={{
          fontFamily: FONTS.body,
          fontWeight: 600,
          fontStyle: 'italic',
          fontSize: 32,
          lineHeight: 1.25,
          color: '#b9d6ff',
          textShadow: '0 2px 4px rgba(0,0,0,0.95), 0 0 18px rgba(0,0,0,0.9)',
        }}
      >
        {line.tr}
      </div>
    </div>
  );
};
