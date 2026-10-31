import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {GuidewordMatrix, HazardRegister, SLD, Workflow} from '../components/Diagrams';
import {progress} from '../components/motion';
import {MeetingTopDown} from '../components/People';
import {Heading, SceneLabel} from '../components/Typography';
import {sceneRange, vo, wordAt} from '../data/timeline';
import {C, F} from '../theme';
import {Blueprint, Scrim, Shot} from './common';

const S = sceneRange('4');
const L = (abs: number) => abs - S.from;
const END = S.to - S.from;

/** Causes → Deviation → Consequences, with safeguards underneath. */
const CauseChain: React.FC<{at: number[]}> = ({at}) => {
  const f = useCurrentFrame();
  const box = (title: string, body: string, color: string, t: number) => (
    <div style={{width: 400, padding: '30px 30px', borderRadius: 16, background: 'rgba(15,29,51,0.92)', border: `2px solid ${color}`, fontFamily: F.sans, opacity: progress(f, t, 12), transform: `translateY(${(1 - progress(f, t, 12)) * 30}px)`}}>
      <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color}}>{title}</div>
      <div style={{fontSize: 28, color: C.white, marginTop: 12, lineHeight: 1.3}}>{body}</div>
    </div>
  );
  const arrow = (t: number) => <div style={{fontSize: 56, color: C.grey, opacity: progress(f, t, 10)}}>→</div>;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 360, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
        {box('CAUSES', 'Why could the deviation happen?', C.blueLight, at[0])}
        {arrow(at[0])}
        {box('DEVIATION', 'Guideword + parameter', C.amber, at[0] - 10)}
        {arrow(at[1])}
        {box('CONSEQUENCES', 'What harm or failure could result?', C.red, at[1])}
      </div>
      <div style={{width: 1000, padding: '24px 30px', borderRadius: 16, background: 'rgba(15,29,51,0.92)', border: `2px solid ${C.green}`, fontFamily: F.sans, textAlign: 'center', opacity: progress(f, at[2], 12)}}>
        <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.green}}>EXISTING SAFEGUARDS</span>
        <span style={{fontSize: 28, color: C.white, marginLeft: 22}}>Are current protections adequate?</span>
      </div>
    </div>
  );
};

export const Scene4How: React.FC = () => {
  const f = useCurrentFrame();
  const t = {
    s1: L(vo('s4_1')),
    s2: L(vo('s4_2')),
    s3: L(vo('s4_3')),
    s4: L(vo('s4_4')),
    s5: L(vo('s4_5')),
    s6: L(vo('s4_6')),
    s7: L(vo('s4_7')),
  };
  const active = f < t.s2 ? -1 : f < t.s3 ? 0 : f < t.s4 ? 1 : f < t.s6 ? 2 : f < t.s7 ? 3 : 4;
  const overview = t.s2 - 4;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Blueprint />
      {/* overview of all five steps */}
      <Shot from={0} to={overview} fin={0}>
        <Heading text="HOW DOES E-HAZOP WORK?" at={6} y={190} size={60} />
        <Workflow appear={[14, 20, 26, 32, 38]} active={-1} y={400} />
      </Shot>

      {/* step 1: team reviews design documents */}
      <Shot from={overview} to={t.s3 - 6}>
        <MeetingTopDown focus={progress(f, L(wordAt('s4_2', 'single-line')), 15)} />
        <Scrim o={0.25} />
      </Shot>
      {/* step 2: nodes */}
      <Shot from={t.s3 - 6} to={t.s4 - 6}>
        <SLD draw={1} nodes={progress(f, L(wordAt('s4_3', 'divided')), 70)} x={336} y={300} scale={0.78} />
      </Shot>
      {/* step 3: parameters and guidewords */}
      <Shot from={t.s4 - 6} to={t.s6 - 6}>
        <GuidewordMatrix
          paramsAt={['voltage', 'current', 'power', 'frequency', 'earthing'].map((w) => L(wordAt('s4_4', w)))}
          wordsAt={[...['over', 'under', 'spike', 'dip', 'fault'].map((w) => L(wordAt('s4_5', w))), L(wordAt('s4_5', 'fault')) + 8]}
          cellsAt={L(wordAt('s4_5', 'help'))}
        />
      </Shot>
      {/* step 4: causes, consequences, safeguards */}
      <Shot from={t.s6 - 6} to={t.s7 - 6}>
        <CauseChain at={[L(wordAt('s4_6', 'causes')), L(wordAt('s4_6', 'consequences')), L(wordAt('s4_6', 'existing'))]} />
      </Shot>
      {/* step 5: hazard register */}
      <Shot from={t.s7 - 6} to={END} fout={0}>
        <HazardRegister at={t.s7 + 4} y={340} />
      </Shot>

      {/* persistent compact workflow tracker */}
      {f >= overview && (
        <div style={{opacity: progress(f, overview, 14)}}>
          <Workflow appear={[overview, overview, overview, overview, overview]} active={active} y={120} compact />
        </div>
      )}
      <SceneLabel n={4} title="HOW DOES E-HAZOP WORK?" at={6} out={overview} />
    </AbsoluteFill>
  );
};
