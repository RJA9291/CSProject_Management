import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Camera} from '../components/Camera';
import {progress} from '../components/motion';
import {SubstationScene} from '../components/Substation';
import {TitleCard} from '../components/Typography';
import {STUDENT} from '../data/content';
import {sceneRange, vo, wordAt} from '../data/timeline';
import {C, F} from '../theme';
import {Blueprint, Shot} from './common';

const S = sceneRange('1');
const L = (abs: number) => abs - S.from;

export const Scene1Intro: React.FC = () => {
  const f = useCurrentFrame();
  const toSub = L(vo('s1_4')) - 30;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Shot from={0} to={toSub} fin={20} fout={30}>
        <Blueprint />
        <TitleCard at={6} {...STUDENT} />
        {/* slow light sweep */}
        <div style={{position: 'absolute', top: 0, bottom: 0, width: 500, left: -600 + (f % 600) * 5, background: 'linear-gradient(90deg, transparent, rgba(111,178,255,0.05), transparent)'}} />
      </Shot>
      <Shot from={toSub} to={S.to - S.from} fin={30} fout={0}>
        <Camera dur={S.to - S.from - toSub} from={toSub} zoom={[1.04, 1.12]} x={[40, -40]} shake={1.5}>
          <SubstationScene parallax={(f - toSub) * -0.25} night={0.25} />
        </Camera>
        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(6,10,18,0.85), rgba(6,10,18,0) 45%)'}} />
        <div style={{position: 'absolute', left: 120, bottom: 220, fontFamily: F.sans, opacity: progress(f, L(wordAt('s1_4', 'electrical')), 18)}}>
          <div style={{fontSize: 30, fontWeight: 300, color: C.ice, letterSpacing: 2}}>Electrical Hazard and Operability Study</div>
          <div style={{fontSize: 96, fontWeight: 800, color: C.white, letterSpacing: 4, opacity: progress(f, L(wordAt('s1_4', 'e-hazop')), 14)}}>E-HAZOP</div>
        </div>
      </Shot>
    </AbsoluteFill>
  );
};
