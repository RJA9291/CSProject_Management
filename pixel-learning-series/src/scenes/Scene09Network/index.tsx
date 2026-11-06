import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Connector} from '../../components/Connector';
import {PathwayScene} from '../../components/PathwayScene';
import {Icon, MINI_PC, ROUTER, SHIELD} from '../../components/PixelIcons';
import {COLORS} from '../../config/theme';
import {cueAt} from '../../lib/timing';

const I = 8;

// Network nodes around the router, linked by marching dotted cables.
const NODES: [number, number][] = [
  [590, 1110],
  [930, 1110],
  [960, 1460],
];
const HUB: [number, number] = [790, 1420];

export const Scene09Network: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const net = Math.round(cueAt(I, 'rangkaian', 3.2) * fps) - 6;
  const shield = Math.round(cueAt(I, 'keselamatan', 4.4) * fps) - 6;
  // Wi-Fi arcs pulse between bright and pale blue.
  const wifi: Record<string, string> = Math.floor(frame / 8) % 2 === 0 ? {} : {B: '#7CC3EE'};
  return (
    <PathwayScene index={I} color={COLORS.green} dark="#1F6B43" pose="pointRight" listCue="Kalau">
      {NODES.map((n, i) => (
        <Connector
          key={i}
          points={[[n[0] + 30, n[1] + 30], HUB]}
          progress={interpolate(frame, [net + i * 4, net + i * 4 + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
          color={COLORS.green}
          dot={10}
          spacing={22}
          march={frame * 1.5}
        />
      ))}
      {NODES.map((n, i) => (
        <Icon key={i} sprite={MINI_PC} x={n[0]} y={n[1]} px={7} delay={net + i * 4} bob={0} />
      ))}
      <Icon sprite={ROUTER} x={HUB[0] - 90} y={HUB[1] - 70} px={10} delay={net} bob={0} palette={wifi} />
      <Icon sprite={SHIELD} x={700} y={1080} px={12} delay={shield} bob={10} />
    </PathwayScene>
  );
};
