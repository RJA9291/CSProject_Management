import React, {useMemo} from 'react';
import {AbsoluteFill, random} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {COLORS} from '../../config/theme';

const BLOCK = 120;
const COLS = 9;
const ROWS = 16;
const DEFAULT_COLORS = [COLORS.navy, COLORS.navy, COLORS.blue, COLORS.text];

type BlockProps = {colors: string[]};

// Pixel-block wipe: blocks fill in over the outgoing scene, then clear to reveal the next one.
const PixelBlocks: React.FC<TransitionPresentationComponentProps<BlockProps>> = ({
  children,
  passedProps,
  presentationDirection,
  presentationProgress,
}) => {
  const blocks = useMemo(
    () =>
      Array.from({length: COLS * ROWS}, (_, i) => ({
        x: (i % COLS) * BLOCK,
        y: Math.floor(i / COLS) * BLOCK,
        // Diagonal sweep with jitter so the wipe has a direction but still feels pixelated.
        t: 0.75 * (((i % COLS) / COLS + Math.floor(i / COLS) / ROWS) / 2) + 0.25 * random(`blk${i}`),
        c: passedProps.colors[Math.floor(random(`blc${i}`) * passedProps.colors.length)],
      })),
    [passedProps.colors],
  );
  if (presentationDirection === 'exiting') return <AbsoluteFill>{children}</AbsoluteFill>;
  const p = presentationProgress;
  const covering = p < 0.5;
  const k = covering ? p * 2 : (p - 0.5) * 2;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{opacity: covering ? 0 : 1}}>{children}</AbsoluteFill>
      {blocks.map((b, i) => {
        const on = covering ? b.t < k : b.t >= k;
        return on ? (
          <div key={i} style={{position: 'absolute', left: b.x, top: b.y, width: BLOCK, height: BLOCK, background: b.c}} />
        ) : null;
      })}
    </AbsoluteFill>
  );
};

export const pixelBlocks = (colors: string[] = DEFAULT_COLORS): TransitionPresentation<BlockProps> => ({
  component: PixelBlocks,
  props: {colors},
});
