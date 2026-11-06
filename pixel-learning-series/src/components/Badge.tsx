import React from 'react';
import {COLORS, FONTS} from '../config/theme';
import {BADGE} from '../assets/icons/icons';
import {PixelSprite} from './PixelSprite';

// LFCA certification badge: pixel shield with the acronym set in the pixel font.
export const LfcaBadge: React.FC<{px?: number; label?: string}> = ({px = 12, label = 'LFCA'}) => (
  <div style={{position: 'relative', width: 26 * px, height: 28 * px}}>
    <PixelSprite sprite={BADGE} px={px} />
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 5 * px,
        textAlign: 'center',
        fontFamily: FONTS.pixel,
        fontWeight: 700,
        fontSize: px * 6.2,
        color: COLORS.white,
        lineHeight: 1,
      }}
    >
      {label}
    </div>
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 12.5 * px,
        textAlign: 'center',
        fontFamily: FONTS.pixel,
        fontSize: px * 2.3,
        color: COLORS.orange,
        lineHeight: 1.1,
      }}
    >
      CERTIFIED
      <br />
      IT ASSOCIATE
    </div>
  </div>
);
