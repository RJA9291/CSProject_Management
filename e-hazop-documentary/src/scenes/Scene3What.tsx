import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {HazopBridge, SLD, SldPart} from '../components/Diagrams';
import {clamp, pop, progress} from '../components/motion';
import {Heading, SceneLabel} from '../components/Typography';
import {sceneRange, vo, wordAt} from '../data/timeline';
import {C, F} from '../theme';
import {Blueprint, Shot} from './common';

const S = sceneRange('3');
const L = (abs: number) => abs - S.from;
const END = S.to - S.from;

const Chip: React.FC<{text: string; at: number; color?: string}> = ({text, at, color = C.blueLight}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(f, fps, at, 15);
  return (
    <div style={{padding: '22px 40px', borderRadius: 14, border: `2px solid ${color}`, background: 'rgba(15,29,51,0.85)', fontFamily: F.sans, fontSize: 38, fontWeight: 700, color: C.white, letterSpacing: 1, opacity: f >= at ? Math.min(1, p * 1.4) : 0, transform: `translateY(${(1 - p) * 30}px)`}}>
      {text}
    </div>
  );
};

/** Term reveal: E-HAZOP expands into its full name with the acronym letters lit. */
const TermReveal: React.FC<{at: number; compact: number}> = ({at, compact}) => {
  const f = useCurrentFrame();
  const words = [
    ['E', 'LECTRICAL'],
    ['HAZ', 'ARD AND'],
    ['OP', 'ERABILITY'],
    ['', 'STUDY'],
  ];
  const open = progress(f, at + 20, 30);
  const y = interpolate(compact, [0, 1], [400, 150]);
  const s = interpolate(compact, [0, 1], [1, 0.62]);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: F.sans, transform: `scale(${s})`, transformOrigin: 'center top'}}>
      <div style={{fontSize: 120, fontWeight: 800, color: C.white, letterSpacing: 8, opacity: progress(f, at, 14) * (1 - open * 0.75), height: interpolate(open, [0, 1], [150, 0], clamp), overflow: 'hidden'}}>E-HAZOP</div>
      <div style={{fontSize: 76, fontWeight: 300, letterSpacing: 4, color: C.ice, opacity: open}}>
        {words.map(([a, b], i) => (
          <span key={i} style={{marginRight: 26}}>
            <b style={{fontWeight: 800, color: C.amber}}>{a}</b>
            {b}
          </span>
        ))}
      </div>
    </div>
  );
};

export const Scene3What: React.FC = () => {
  const f = useCurrentFrame();
  const t2 = L(vo('s3_2'));
  const t3 = L(vo('s3_3'));
  const t4 = L(vo('s3_4'));
  const t5 = L(vo('s3_5'));
  // cycle SLD highlights through the system while "how components interact" is spoken
  const parts: SldPart[] = ['grid', 'tx', 'bus', 'swgr', 'dist'];
  const hlStart = L(wordAt('s3_4', 'examines'));
  const step = 32;
  const k = Math.floor((f - hlStart) / step);
  const hl = f >= hlStart && k >= 0 && k < parts.length ? parts[k] : null;
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <Blueprint />
      <Shot from={0} to={t3 - 10} fin={0}>
        <TermReveal at={L(vo('s3_1'))} compact={progress(f, t2 - 6, 24)} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 520, display: 'flex', justifyContent: 'center', gap: 36}}>
          <Chip text="POTENTIAL HAZARDS" at={L(wordAt('s3_2', 'potential hazards'))} color={C.red} />
          <Chip text="OPERATIONAL PROBLEMS" at={L(wordAt('s3_2', 'operational'))} color={C.amber} />
          <Chip text="DEVIATIONS" at={L(wordAt('s3_2', 'deviations'))} color={C.blueLight} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', fontFamily: F.mono, fontSize: 26, letterSpacing: 4, color: C.grey, opacity: progress(f, L(wordAt('s3_2', 'systematic')), 15)}}>
          SYSTEMATIC · STRUCTURED · TEAM-BASED
        </div>
      </Shot>
      <Shot from={t3 - 10} to={t4 - 6}>
        <Heading text="HAZOP PRINCIPLES APPLIED TO ELECTRICAL DESIGNS" at={t3} y={150} size={48} />
        <HazopBridge at={t3 + 6} />
      </Shot>
      <Shot from={t4 - 6} to={END} fout={0}>
        <SLD draw={progress(f, t4, 50)} highlight={hl} highlightAt={hlStart + k * step} x={260} y={150} scale={0.875} />
        <div style={{position: 'absolute', right: 120, top: 120, textAlign: 'right', fontFamily: F.sans, opacity: progress(f, L(wordAt('s3_4', 'rather')), 14) * (1 - progress(f, t5 - 10, 10))}}>
          <div style={{fontSize: 26, color: C.grey, textDecoration: 'line-through'}}>Individual equipment inspection</div>
          <div style={{fontSize: 34, fontWeight: 800, color: C.white, marginTop: 8}}>Whole-system design study</div>
        </div>
        {/* objective strip */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, background: `rgba(6,10,18,${0.7 * progress(f, t5 - 6, 14)})`}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 380, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30}}>
          {[
            ['IDENTIFY', 'problems early', L(wordAt('s3_5', 'identify'))],
            ['ASSESS', 'consequences', L(wordAt('s3_5', 'assess'))],
            ['RECOMMEND', 'safeguards', L(wordAt('s3_5', 'recommend'))],
          ].map(([a, b, at], i) => (
            <React.Fragment key={a as string}>
              {i > 0 && <div style={{fontSize: 60, color: C.blueLight, opacity: progress(f, at as number, 10)}}>→</div>}
              <div style={{width: 420, padding: '36px 30px', borderRadius: 18, background: 'rgba(15,29,51,0.92)', border: `2px solid ${i === 2 ? C.green : C.blueLight}`, textAlign: 'center', fontFamily: F.sans, opacity: progress(f, at as number, 12), transform: `translateY(${(1 - progress(f, at as number, 12)) * 30}px)`}}>
                <div style={{fontSize: 44, fontWeight: 800, color: i === 2 ? C.green : C.white, letterSpacing: 2}}>{a}</div>
                <div style={{fontSize: 30, fontWeight: 300, color: C.ice, marginTop: 8}}>{b}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </Shot>
      <SceneLabel n={3} title="WHAT IS E-HAZOP?" at={10} out={END} />
    </AbsoluteFill>
  );
};
