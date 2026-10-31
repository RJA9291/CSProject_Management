import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Camera} from '../components/Camera';
import {Benefits, TeamTriad} from '../components/Diagrams';
import {progress} from '../components/motion';
import {Engineer, MeetingTopDown} from '../components/People';
import {SubstationScene} from '../components/Substation';
import {Heading, SceneLabel} from '../components/Typography';
import {sceneRange, vo, wordAt} from '../data/timeline';
import {C, F} from '../theme';
import {Blueprint, Scrim, Shot} from './common';

const S = sceneRange('6');
const L = (abs: number) => abs - S.from;
const END = S.to - S.from;

export const Scene6Why: React.FC = () => {
  const f = useCurrentFrame();
  const t = {s2: L(vo('s6_2')), s3: L(vo('s6_3')), s4: L(vo('s6_4'))};
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {/* engineers in PPE inspecting the yard */}
      <Shot from={0} to={t.s2 - 4} fin={0}>
        <Camera dur={t.s2} zoom={[1.08, 1.0]} shake={1}>
          <SubstationScene night={0.3} parallax={f * 0.2} />
          <svg width="1920" height="1080" style={{position: 'absolute'}}>
            <Engineer x={520} y={1040} s={1.15} pose="tablet" hat="#f2f4f7" seed={0} />
            <Engineer x={760} y={1060} s={1.2} pose="point" hat="#ffd23f" seed={2} skin="#6b4630" />
            <Engineer x={1480} y={1050} s={1.1} pose="stand" hat="#f2f4f7" seed={4} skin="#a4785a" />
          </svg>
        </Camera>
        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(6,10,18,0.75), rgba(6,10,18,0) 35%)'}} />
        <Heading text="WHY IS E-HAZOP IMPORTANT?" at={10} y={150} size={58} />
      </Shot>
      {/* four benefits */}
      <Shot from={t.s2 - 4} to={t.s3 - 4}>
        <Blueprint />
        <Heading text="KEY BENEFITS" at={t.s2} y={170} size={44} color={C.ice} />
        <Benefits at={[L(wordAt('s6_2', 'personnel')), L(wordAt('s6_2', 'equipment')), L(wordAt('s6_2', 'design weak')), L(wordAt('s6_2', 'business'))]} y={330} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: F.sans, fontSize: 24, color: C.grey, opacity: progress(f, t.s2 + 60, 15)}}>
          E-HAZOP reduces risk. It does not guarantee zero incidents.
        </div>
      </Shot>
      {/* when to apply */}
      <Shot from={t.s3 - 4} to={t.s4 - 4}>
        <Blueprint />
        <Heading text="WHEN IS IT MOST VALUABLE?" at={t.s3} y={190} size={48} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 420, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30}}>
          {[
            ['DESIGN STAGE', L(wordAt('s6_3', 'design stage'))],
            ['MODIFICATIONS', L(wordAt('s6_3', 'modifications'))],
            ['MAJOR UPGRADES', L(wordAt('s6_3', 'upgrades'))],
          ].map(([txt, at], i) => (
            <React.Fragment key={txt as string}>
              {i > 0 && <div style={{width: 80, height: 3, background: C.blueLight, opacity: progress(f, at as number, 10)}} />}
              <div style={{padding: '34px 46px', borderRadius: 18, background: 'rgba(15,29,51,0.9)', border: `2px solid ${i === 0 ? C.amber : C.blueLight}`, fontFamily: F.sans, fontSize: 40, fontWeight: 800, letterSpacing: 2, color: C.white, opacity: progress(f, at as number, 12), transform: `scale(${0.9 + 0.1 * progress(f, at as number, 12)})`}}>
                {txt}
              </div>
            </React.Fragment>
          ))}
        </div>
      </Shot>
      {/* multidisciplinary team */}
      <Shot from={t.s4 - 4} to={END} fout={0}>
        <MeetingTopDown labels />
        <Scrim o={0.35} />
        <TeamTriad at={[L(wordAt('s6_4', 'engineering')), L(wordAt('s6_4', 'operations')), L(wordAt('s6_4', 'maintenance'))]} y={64} />
      </Shot>
      <SceneLabel n={6} title="WHY IS E-HAZOP IMPORTANT?" at={6} out={t.s2} />
    </AbsoluteFill>
  );
};
