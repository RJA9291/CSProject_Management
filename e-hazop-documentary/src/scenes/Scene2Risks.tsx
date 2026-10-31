import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Camera} from '../components/Camera';
import {ControlRoom, Switchgear, TransformerHero} from '../components/Equipment';
import {clamp, progress} from '../components/motion';
import {SubstationScene} from '../components/Substation';
import {SceneLabel} from '../components/Typography';
import {sceneRange, vo, wordAt} from '../data/timeline';
import {C, F} from '../theme';
import {Shot} from './common';

const S = sceneRange('2');
const L = (abs: number) => abs - S.from;
const END = S.to - S.from;

export const Scene2Risks: React.FC = () => {
  const f = useCurrentFrame();
  const a = L(vo('s2_2'));
  const b = L(vo('s2_3'));
  const c = L(vo('s2_4'));
  const d = L(vo('s2_5')) - 8;
  const alarmOn = L(wordAt('s2_3', 'not operate'));
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {/* high, wide establishing shot */}
      <Shot from={0} to={a} fin={0}>
        <Camera dur={a} zoom={[1.22, 1.06]} y={[-90, 0]} shake={1}>
          <SubstationScene parallax={f * -0.3} night={0.4} />
        </Camera>
      </Shot>
      {/* transformer close-up */}
      <Shot from={a} to={b}>
        <Camera from={a} dur={b - a} zoom={[1.0, 1.1]} x={[30, -30]} shake={1}>
          <TransformerHero />
        </Camera>
      </Shot>
      {/* switchgear with warning indicator */}
      <Shot from={b} to={c}>
        <Camera from={b} dur={c - b} zoom={[1.05, 1.35]} x={[0, 220]} y={[0, 120]} shake={1}>
          <Switchgear alarmPanel={2} alarm={progress(f, alarmOn, 6)} relayText="ALARM" />
        </Camera>
      </Shot>
      {/* control room alarm */}
      <Shot from={c} to={d}>
        <Camera from={c} dur={d - c} zoom={[1.12, 1.0]} shake={1}>
          <ControlRoom alarm={0.5 + 0.5 * Math.sin(f / 5)} />
        </Camera>
      </Shot>
      {/* "This is where E-HAZOP comes in." */}
      <Shot from={d} to={END} fout={0}>
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, ${C.navy2}, ${C.bg} 70%)`}} />
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.sans}}>
          <div
            style={{
              fontSize: 150,
              fontWeight: 800,
              color: C.white,
              letterSpacing: interpolate(f, [d, d + 60], [40, 10], clamp),
              opacity: progress(f, L(wordAt('s2_5', 'e-hazop')) - 4, 12),
              textShadow: `0 0 60px ${C.blue}`,
            }}
          >
            E-HAZOP
          </div>
        </div>
      </Shot>
      <SceneLabel n={2} title="THE HIDDEN RISKS OF ELECTRICAL SYSTEMS" at={10} out={d} />
    </AbsoluteFill>
  );
};
