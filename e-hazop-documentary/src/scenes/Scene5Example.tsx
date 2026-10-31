import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Camera} from '../components/Camera';
import {CdcsTable, VoltageTrend} from '../components/Diagrams';
import {Switchgear, TransformerHero} from '../components/Equipment';
import {clamp, progress} from '../components/motion';
import {Engineer} from '../components/People';
import {SubstationScene} from '../components/Substation';
import {Heading, IllustrativeBadge, SceneLabel} from '../components/Typography';
import {sceneRange, vo, wordAt} from '../data/timeline';
import {C, F} from '../theme';
import {Blueprint, Scrim, Shot} from './common';

const S = sceneRange('5');
const L = (abs: number) => abs - S.from;
const END = S.to - S.from;

const Callout: React.FC<{text: string; at: number; x: number; y: number; color?: string}> = ({text, at, x, y, color = C.amber}) => {
  const f = useCurrentFrame();
  const p = progress(f, at, 12);
  return (
    <div style={{position: 'absolute', left: x, top: y, padding: '16px 24px', borderRadius: 12, background: 'rgba(10,16,28,0.9)', borderLeft: `5px solid ${color}`, fontFamily: F.sans, fontSize: 30, fontWeight: 600, color: C.white, opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
      {text}
    </div>
  );
};

export const Scene5Example: React.FC = () => {
  const f = useCurrentFrame();
  const t = {s2: L(vo('s5_2')), s3: L(vo('s5_3')), s4: L(vo('s5_4')), s5: L(vo('s5_5')), s6: L(vo('s5_6'))};
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {/* push in on TX-01 */}
      <Shot from={0} to={t.s2 - 4} fin={0}>
        <Camera dur={t.s2} zoom={[1.0, 1.9]} x={[0, 380]} y={[0, -330]} shake={1}>
          <SubstationScene night={0.35} parallax={f * -0.2} />
        </Camera>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,10,18,0.85), rgba(6,10,18,0) 40%)'}} />
        <Heading text="PRACTICAL EXAMPLE" sub="Transformer overvoltage" at={8} out={t.s2} y={150} size={56} />
      </Shot>
      {/* transformer + rising voltage */}
      <Shot from={t.s2 - 4} to={t.s3 - 4}>
        <TransformerHero ox={-430} stress={interpolate(f, [t.s2 + 50, t.s3], [0, 0.35], clamp)} />
        <VoltageTrend start={t.s2 + 4} rise={1} x={1060} y={230} />
      </Shot>
      {/* possible causes at the protection relay */}
      <Shot from={t.s3 - 4} to={t.s4 - 4}>
        <Camera from={t.s3} dur={t.s4 - t.s3} zoom={[1.15, 1.25]} x={[260, 300]} y={[60, 80]} shake={1}>
          <Switchgear alarmPanel={0} alarm={1} relayText="U> ALARM" />
        </Camera>
        <Scrim o={0.25} />
        <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(6,10,18,0) 35%, rgba(6,10,18,0.88) 55%)'}} />
        <Callout text="Incorrect protection settings" at={L(wordAt('s5_3', 'incorrect'))} x={1080} y={360} color={C.blueLight} />
        <Callout text="Disturbance in the electrical network" at={L(wordAt('s5_3', 'disturbances'))} x={1080} y={470} color={C.blueLight} />
        <div style={{position: 'absolute', left: 1080, top: 290, fontFamily: F.mono, fontSize: 22, letterSpacing: 3, color: C.grey, opacity: progress(f, t.s3, 12)}}>POSSIBLE CAUSES</div>
      </Shot>
      {/* consequence: insulation stress */}
      <Shot from={t.s4 - 4} to={t.s5 - 4}>
        <Camera from={t.s4} dur={t.s5 - t.s4} zoom={[1.0, 1.08]} shake={2}>
          <TransformerHero ox={-380} stress={interpolate(f, [t.s4, t.s4 + 60], [0.35, 0.85], clamp)} sparks={interpolate(f, [t.s4 + 30, t.s4 + 80], [0, 0.45], clamp)} />
        </Camera>
        <div style={{position: 'absolute', left: 1080, top: 290, fontFamily: F.mono, fontSize: 22, letterSpacing: 3, color: C.grey, opacity: progress(f, t.s4, 12)}}>POSSIBLE CONSEQUENCES</div>
        <Callout text="Stress on insulation" at={L(wordAt('s5_4', 'stress'))} x={1080} y={360} color={C.red} />
        <Callout text="Potential equipment damage" at={L(wordAt('s5_4', 'damage'))} x={1080} y={470} color={C.red} />
      </Shot>
      {/* the team reviews causes, consequences and safeguards */}
      <Shot from={t.s5 - 4} to={END} fout={0}>
        <Blueprint />
        <svg width="1920" height="1080" style={{position: 'absolute', opacity: 0.9}}>
          <Engineer x={210} y={1000} s={1.25} pose="tablet" hat="#f2f4f7" seed={1} />
        </svg>
        <CdcsTable
          rowsAt={[t.s5 + 6, L(wordAt('s5_5', 'causes')), L(wordAt('s5_5', 'consequences')), L(wordAt('s5_5', 'protection'))]}
          x={480}
          y={250}
          w={1300}
        />
        <div
          style={{
            position: 'absolute',
            left: 508,
            top: 830,
            fontFamily: F.sans,
            fontSize: 30,
            fontWeight: 700,
            color: C.green,
            opacity: progress(f, L(wordAt('s5_6', 'recommend')), 12),
          }}
        >
          → Recommend additional safeguards or corrective actions where necessary
        </div>
      </Shot>
      <SceneLabel n={5} title="PRACTICAL EXAMPLE: TRANSFORMER OVERVOLTAGE" at={6} out={END} />
      <IllustrativeBadge at={20} out={END} />
    </AbsoluteFill>
  );
};
