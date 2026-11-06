import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONTS, LAYOUT} from '../../config/theme';
import type {Word} from '../../lib/timing';

export type Chunk = {text: string; start: number; end: number};

// Groups words into short caption lines, breaking on punctuation or length.
export const chunkWords = (words: Word[], maxWords = 5, maxChars = 30): Chunk[] => {
  const out: Chunk[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (!cur.length) return;
    out.push({text: cur.map((w) => w.text).join(' '), start: cur[0].start, end: cur[cur.length - 1].end});
    cur = [];
  };
  for (const w of words) {
    const len = cur.map((x) => x.text).join(' ').length + w.text.length + 1;
    if (cur.length >= maxWords || len > maxChars) flush();
    cur.push(w);
    if (/[,.!?]$/.test(w.text)) flush();
  }
  flush();
  return out;
};

export const Subtitles: React.FC<{words: Word[]}> = ({words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const chunks = chunkWords(words);
  const idx = chunks.findIndex((c, i) => t >= c.start - 0.05 && t < (chunks[i + 1]?.start ?? c.end + 0.5));
  if (idx < 0) return null;
  const chunk = chunks[idx];
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: LAYOUT.subtitleY, display: 'flex', justifyContent: 'center'}}>
      <div
        style={{
          fontFamily: FONTS.heading,
          fontWeight: 700,
          fontSize: 46,
          color: COLORS.white,
          background: 'rgba(23,23,23,0.82)',
          padding: '10px 26px 12px',
          maxWidth: 940,
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {chunk.text}
      </div>
    </div>
  );
};
