import React, {useMemo} from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Object3D} from 'three';
import {Exterior} from '../environment/Exterior';
import {Factory} from '../environment/Factory';
import {FacilityBay, Office, Workstations} from '../environment/Sets';
import {FONT, MONO} from '../lib/text';

export type V3 = [number, number, number];
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);

/** Key light whose shadow frustum follows the action (`center`). */
export const ShotLights: React.FC<{center: V3; warm?: number; cool?: number}> = ({center, warm = 1, cool = 1}) => {
  const target = useMemo(() => new Object3D(), []);
  target.position.set(...center);
  target.updateMatrixWorld();
  return (
    <>
      <hemisphereLight args={['#b9d4ff', '#2a2f37', 0.85 * cool]} />
      <primitive object={target} />
      <directionalLight
        position={[center[0] + 8, center[1] + 16, center[2] + 10]}
        target={target}
        intensity={2.1 * warm}
        color="#ffe2bf"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[center[0] - 8, center[1] + 6, center[2] - 10]} intensity={1.2 * cool} color="#6fa8ff" />
    </>
  );
};

/** The plant world shared by the location scenes. */
export const PlantWorld: React.FC<{
  t: number;
  roof?: number;
  exterior?: boolean;
  dbOpen?: number;
  alarm?: boolean;
  signGlow?: number;
  stations?: {dbOpen: number; gearReveal: number; arc: boolean};
  sky?: string;
}> = ({t, roof = 0, exterior = false, dbOpen = 0, alarm = false, signGlow = 0.6, stations, sky = '#1e2a3c'}) => (
  <>
    <color attach="background" args={[sky]} />
    <fog attach="fog" args={[sky, exterior ? 80 : 22, exterior ? 320 : 75]} />
    <Factory t={t} cutaway dbOpen={dbOpen} alarm={alarm} />
    {exterior && <Exterior roof={roof} />}
    <Office signGlow={signGlow} />
    <FacilityBay t={t} />
    <Workstations t={t} dbOpen={stations?.dbOpen ?? 0} gearReveal={stations?.gearReveal ?? 0} arc={stations?.arc ?? false} />
  </>
);

/** Full-frame 3D canvas. */
export const Stage: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {width, height} = useVideoConfig();
  return (
    <ThreeCanvas width={width} height={height} shadows gl={{antialias: true}}>
      {children}
    </ThreeCanvas>
  );
};

// ------------------------------------------------------------ 2D overlays

/** Role / location label, lower-left. */
export const Label: React.FC<{title: string; sub?: string; from: number; to: number; color?: string}> = ({title, sub, from, to, color = '#e8771e'}) => {
  const f = useCurrentFrame();
  const o = Math.min(ramp(f, from, from + 10), 1 - ramp(f, to - 10, to));
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 110, bottom: 190, opacity: o, transform: `translateX(${(1 - ramp(f, from, from + 14)) * -30}px)`, fontFamily: FONT}}>
      <div style={{width: 60 * o, height: 4, background: color, marginBottom: 12}} />
      <div style={{fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: 1, textShadow: '0 3px 16px rgba(0,0,0,0.6)'}}>{title}</div>
      {sub && <div style={{fontSize: 24, fontWeight: 600, color: '#d6e2ef', marginTop: 4, textShadow: '0 2px 10px rgba(0,0,0,0.7)'}}>{sub}</div>}
    </div>
  );
};

/** Big keywords appearing one by one (centred). */
export const Keywords: React.FC<{words: {t: string; at: number}[]; out: number; y?: number}> = ({words, out, y = 820}) => {
  const f = useCurrentFrame();
  const o = 1 - ramp(f, out - 12, out);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', gap: 46, fontFamily: FONT, opacity: o}}>
      {words.map((w) => {
        const p = ramp(f, w.at, w.at + 10);
        return (
          <div key={w.t} style={{fontSize: 46, fontWeight: 800, letterSpacing: 4, color: '#fff', opacity: p, transform: `translateY(${(1 - p) * 20}px)`, textShadow: '0 3px 18px rgba(0,0,0,0.7)'}}>
            {w.t}
          </div>
        );
      })}
    </div>
  );
};

/** Fade from/to black at the scene edges. */
export const EdgeFade: React.FC<{len: number; fin?: number; fout?: number; color?: string}> = ({len, fin = 10, fout = 10, color = '#000'}) => {
  const f = useCurrentFrame();
  const o = Math.max(1 - ramp(f, 0, fin), ramp(f, len - fout, len));
  if (o <= 0) return null;
  return <AbsoluteFill style={{background: color, opacity: o}} />;
};

export const Flash: React.FC<{at: number; dur?: number; color?: string}> = ({at, dur = 12, color = '#cfe6ff'}) => {
  const f = useCurrentFrame();
  const d = f - at;
  if (d < -dur / 2 || d > dur) return null;
  const o = d < 0 ? 1 + d / (dur / 2) : 1 - d / dur;
  return <AbsoluteFill style={{background: color, opacity: Math.max(0, o)}} />;
};

export const SceneTag: React.FC<{n: number; title: string; len: number}> = ({n, title, len}) => {
  const f = useCurrentFrame();
  const o = Math.min(ramp(f, 12, 24), 1 - ramp(f, 80, 96));
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 110, top: 80, opacity: o, fontFamily: MONO, fontSize: 18, letterSpacing: 5, color: '#e8771e'}}>
      {String(n).padStart(2, '0')} · <span style={{color: '#dfe7f0'}}>{title.toUpperCase()}</span>
    </div>
  );
};
