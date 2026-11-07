import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PixelSprite} from '../../components/PixelSprite';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {RACK} from '../assets/icons';

// Data-centre backdrop: calm navy tech world with a row of blinking server racks and floor tiles.
export const ServerRoom: React.FC = () => {
  const frame = useCurrentFrame();
  const tick = Math.floor(frame / 6);
  return (
    <AbsoluteFill>
      <CyberBackground navyFrom={0} tone="tech" />
      <div style={{position: 'absolute', left: 0, top: 1500, width: 1080, height: 420, background: 'repeating-linear-gradient(90deg, #0A1F4A 0 96px, #0E2758 96px 192px)', opacity: 0.9}} />
      {Array.from({length: 7}, (_, i) => (
        <div key={i} style={{position: 'absolute', left: 8 + i * 154, top: 1140, opacity: 0.55}}>
          <PixelSprite sprite={RACK(tick + i)} px={8} />
        </div>
      ))}
    </AbsoluteFill>
  );
};
