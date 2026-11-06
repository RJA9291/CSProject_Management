import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {COLORS} from '../../config/theme';

const PARTICLES = Array.from({length: 14}, (_, i) => ({
  x: random(`px${i}`) * 1080,
  y: random(`py${i}`) * 1920,
  size: [8, 12, 16][Math.floor(random(`ps${i}`) * 3)],
  speed: 0.3 + random(`pv${i}`) * 0.5,
  color: [COLORS.orange, COLORS.blue, COLORS.green, COLORS.red][i % 4],
}));

export const PixelBackground: React.FC<{tint?: string}> = ({tint}) => {
  const frame = useCurrentFrame();
  const drift = (frame * 0.4) % 48;
  return (
    <AbsoluteFill style={{background: COLORS.bg}}>
      <svg width="1080" height="1920" style={{position: 'absolute'}} shapeRendering="crispEdges">
        <defs>
          <pattern id="dots" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform={`translate(${drift} ${drift})`}>
            <rect x="20" y="20" width="6" height="6" fill={COLORS.dot} />
          </pattern>
        </defs>
        <rect width="1080" height="1920" fill="url(#dots)" />
      </svg>
      {tint ? <AbsoluteFill style={{background: tint, opacity: 0.06}} /> : null}
      {PARTICLES.map((p, i) => {
        const y = (((p.y - frame * p.speed * 2) % 1920) + 1920) % 1920;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: Math.round(p.x / 4) * 4,
              top: Math.round(y / 4) * 4,
              width: p.size,
              height: p.size,
              background: p.color,
              opacity: 0.18,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
