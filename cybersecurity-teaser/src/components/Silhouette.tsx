import React from 'react';
import {COLORS} from '../theme';

/**
 * Side-profile silhouette of a young adult looking down at a phone, rim-lit by
 * the screen. Placeholder for real footage (see docs/ASSET_CHECKLIST.md, V01).
 */
export const ProfileSilhouette: React.FC<{glow: number; x?: number; y?: number; scale?: number; color?: string}> = ({
  glow,
  x = 0,
  y = 0,
  scale = 1,
  color = COLORS.cyan,
}) => {
  // head tilted down toward a phone held low-right
  const profile =
    'M300 120 C380 90 470 110 520 170 C560 220 572 280 566 330 C590 360 612 392 622 420 C628 436 618 446 600 448 L590 450 C596 470 594 486 584 494 C592 506 590 522 578 532 C572 560 556 588 526 600 C500 610 470 610 446 606 L446 700 C520 720 640 760 720 820 C800 880 840 960 860 1080 L860 1400 L0 1400 L0 980 C40 900 120 840 200 800 L230 690 C180 640 150 560 150 470 C150 330 200 170 300 120 Z';
  return (
    <svg
      viewBox="0 0 900 1400"
      width={900 * scale}
      height={1400 * scale}
      style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}
    >
      <defs>
        <filter id="rim" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <linearGradient id="skin" x1="1" y1="0.5" x2="0" y2="0.5">
          <stop offset="0" stopColor="#1b2a44" />
          <stop offset="0.25" stopColor="#0a101d" />
          <stop offset="1" stopColor="#03060c" />
        </linearGradient>
        <radialGradient id="facelight" cx="0.75" cy="0.42" r="0.35">
          <stop offset="0" stopColor={color} stopOpacity={0.35 * glow} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={profile} fill="url(#skin)" />
      <path d={profile} fill="url(#facelight)" />
      {/* rim light along the face edge */}
      <path
        d="M520 170 C560 220 572 280 566 330 C590 360 612 392 622 420 C628 436 618 446 600 448 L590 450 C596 470 594 486 584 494 C592 506 590 522 578 532 C572 560 556 588 526 600"
        fill="none"
        stroke={color}
        strokeWidth="5"
        opacity={0.9 * glow}
        filter="url(#rim)"
      />
      <path
        d="M520 170 C560 220 572 280 566 330 C590 360 612 392 622 420 C628 436 618 446 600 448 L590 450 C596 470 594 486 584 494 C592 506 590 522 578 532 C572 560 556 588 526 600"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        opacity={0.55 * glow}
      />
      {/* hair volume */}
      <path d="M300 120 C380 80 490 100 530 180 C470 150 380 150 320 190 C260 230 220 300 210 380 C190 300 220 170 300 120 Z" fill="#02040a" />
    </svg>
  );
};
