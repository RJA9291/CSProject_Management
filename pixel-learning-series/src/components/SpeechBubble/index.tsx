import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {PixelBox} from '../PixelBox';
import {mirror, PixelSprite, Sprite} from '../PixelSprite';

const TAIL: Sprite = ['KWWWWWWK', 'KWWWWWK.', 'KWWWWK..', 'KWWWK...', 'KWWK....', 'KWK.....', 'KK......'];

type Props = {
  children: React.ReactNode;
  tail?: 'left' | 'right' | 'none';
  // Horizontal tail position inside the bubble (px from the chosen side).
  tailOffset?: number;
  delay?: number;
  width?: number | string;
  padding?: number | string;
  style?: React.CSSProperties;
};

export const SpeechBubble: React.FC<Props> = ({children, tail = 'left', tailOffset = 120, delay = 0, width, padding = '28px 36px', style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay);
  return (
    <div
      style={{
        position: 'relative',
        width,
        transform: `scale(${s})`,
        transformOrigin: tail === 'right' ? '80% 100%' : '20% 100%',
        opacity: frame >= delay ? 1 : 0,
        ...style,
      }}
    >
      <PixelBox bg={COLORS.white} padding={padding}>
        {children}
      </PixelBox>
      {tail !== 'none' ? (
        <div style={{position: 'absolute', bottom: -48, [tail]: tailOffset}}>
          <PixelSprite sprite={tail === 'right' ? mirror(TAIL) : TAIL} px={8} />
        </div>
      ) : null}
    </div>
  );
};
