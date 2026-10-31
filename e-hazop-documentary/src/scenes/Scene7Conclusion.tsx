import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Camera} from '../components/Camera';
import {ClosingStatement} from '../components/Typography';
import {SubstationScene} from '../components/Substation';
import {CLOSING} from '../data/content';
import {sceneRange, vo} from '../data/timeline';
import {C} from '../theme';
import {Blueprint, Shot} from './common';

const S = sceneRange('7');
const L = (abs: number) => abs - S.from;
const END = S.to - S.from;

export const Scene7Conclusion: React.FC = () => {
  const f = useCurrentFrame();
  const card = L(vo('s7_2')) - 10;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Shot from={0} to={card} fin={0} fout={30}>
        <Camera dur={card + 30} zoom={[1.25, 1.0]} y={[-60, 0]} shake={1}>
          <SubstationScene night={0.6} parallax={f * -0.15} />
        </Camera>
      </Shot>
      <Shot from={card} to={END} fin={30} fout={0}>
        <Blueprint opacity={0.8} />
        <ClosingStatement title={CLOSING.title} lines={CLOSING.lines} at={[card + 10, card + 45, card + 75, card + 105]} />
      </Shot>
      {/* fade to black before the reference card */}
      <AbsoluteFill style={{background: 'black', opacity: Math.max(0, (f - (END - 18)) / 18)}} />
    </AbsoluteFill>
  );
};
