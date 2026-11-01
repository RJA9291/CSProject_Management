// Location scenes in the shared plant world: 01, 02, 03, 05, 08.
import React from 'react';
import {useSceneFrame} from '../lib/clock';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {Character} from '../characters/Character';
import {Action} from '../characters/poses';
import {byId} from '../characters/specs';
import {along, CamKey, PathCamera, sampleCam} from '../lib/camera';
import {FONT} from '../lib/text';
import {STATIONS} from '../environment/Sets';
import {dF, wordAt} from '../data/timeline';
import {EdgeFade, Keywords, Label, PlantWorld, ramp, SceneTag, ShotLights, Stage, V3} from './common';

const PI = Math.PI;

/** Renders one camera shot only while the frame is inside [from, to). */
const inShot = (f: number, from: number, to: number) => f >= from && f < to;

// =================================================================== SCENE 01
export const Scene01: React.FC = () => {
  const f = useSceneFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const keys: CamKey[] = [
    {f: 0, pos: [-95, 58, 95], look: [0, 0, 0], fov: 40},
    {f: 150, pos: [-30, 24, 28], look: [-6, 2, 0], fov: 42},
    {f: 250, pos: [-3, 6.2, 8.5], look: [-12, 1.5, 0], fov: 46},
    {f: 360, pos: [-10.5, 3.1, 6.2], look: [-20, 1.4, -2.5], fov: 45},
    {f: 450, pos: [-12.4, 2.5, -5.2], look: [-15.3, 2.4, -10.6], fov: 38},
  ];
  const cam = sampleCam(keys, f);
  const roof = 1 - ramp(f, 70, 160);
  // a technician on his rounds, seen from above (ties into Scene 02)
  const walk = along([{f: 0, p: [-30, 0, -6]}, {f: 450, p: [-22, 0, -7.5]}], f);
  return (
    <AbsoluteFill>
      <Stage>
        <PathCamera keys={keys} frame={f} />
        <ShotLights center={[cam.look[0], 0, cam.look[2]]} warm={0.9} />
        <PlantWorld t={t} exterior roof={roof} alarm={f > 380} sky={f < 160 ? '#2b3c58' : '#1e2a3c'} />
        <Character spec={byId('mechanical')} action="walk" t={t} position={walk.p} rotationY={walk.heading} />
      </Stage>
      <EdgeFade len={450} fin={14} fout={6} />
    </AbsoluteFill>
  );
};

// =================================================================== SCENE 02
export const Scene02: React.FC = () => {
  const f = useSceneFrame();
  const {fps} = useVideoConfig();
  const t = (f + 450) / fps;
  // shot A: tracking behind the mechanical technician
  const walk = along([{f: 0, p: [-30.5, 0, -6.2]}, {f: 112, p: [-24.3, 0, -9.4]}], f);
  const fwd: V3 = [Math.sin(walk.heading), 0, Math.cos(walk.heading)];
  const camA: CamKey[] = [0, 60, 120].map((k) => {
    const w = along([{f: 0, p: [-30.5, 0, -6.2]}, {f: 112, p: [-24.3, 0, -9.4]}], k);
    const h = w.heading;
    return {f: k, pos: [w.p[0] - Math.sin(h) * 2.6 + Math.cos(h) * 0.7, 1.75, w.p[2] - Math.cos(h) * 2.6 - Math.sin(h) * 0.7], look: [w.p[0] + Math.sin(h) * 3, 1.2, w.p[2] + Math.cos(h) * 3], fov: 42};
  });
  const shots: {from: number; to: number; keys: CamKey[]; center: V3}[] = [
    {from: 0, to: 120, keys: camA, center: [-27, 0, -8]},
    {from: 120, to: 240, keys: [{f: 120, pos: [-21.9, 1.65, -7.9], look: [-24.2, 1.1, -10.1], fov: 40}, {f: 240, pos: [-22.3, 1.45, -7.8], look: [-24.2, 1.05, -10.1], fov: 36}], center: [-24, 0, -10]},
    {from: 240, to: 345, keys: [{f: 240, pos: [12.9, 1.6, -12.1], look: [11.4, 1.35, -14.4], fov: 36}, {f: 345, pos: [12.4, 1.45, -12.0], look: [11.4, 1.3, -14.4], fov: 31}], center: [11.5, 0, -13.5]},
    {from: 345, to: 450, keys: [{f: 345, pos: [25, 1.4, 1.2], look: [31, 1.4, 7], fov: 45}, {f: 450, pos: [23.8, 6.8, 0.2], look: [32, 1.0, 8], fov: 45}], center: [31, 0, 7]},
    {from: 450, to: 540, keys: [{f: 450, pos: [-8.6, 2.0, 10.6], look: [-3, 1.3, 4.5], fov: 40}, {f: 540, pos: [-7.3, 1.8, 9.7], look: [-3, 1.3, 4.5], fov: 38}], center: [-4, 0, 6]},
  ];
  const shot = shots.find((s) => inShot(f, s.from, s.to)) ?? shots[shots.length - 1];
  const mechAction: Action = f < 120 ? (walk.moving ? 'walk' : 'idle') : 'toolWork';
  const mechPos: V3 = f < 120 ? walk.p : [-24.3, 0, -9.55];
  const mechRot = f < 120 ? walk.heading : PI;
  void fwd;
  return (
    <AbsoluteFill>
      <Stage>
        <PathCamera keys={shot.keys} frame={f} ease={false} />
        <ShotLights center={shot.center} />
        <PlantWorld t={t} dbOpen={1} />
        <Character spec={byId('mechanical')} action={mechAction} t={t} position={mechPos} rotationY={mechRot} />
        <Character spec={byId('electrical')} action="measure" t={t} position={[11.5, 0, -13.55]} rotationY={PI} />
        <Character spec={byId('assistant')} action="tablet" t={t} position={[-4, 0, 6.6]} rotationY={PI + 0.2} />
      </Stage>
      <Keywords
        words={[
          {t: 'MEMANTAU', at: dF(2, wordAt('s2_2', 'memantau')) - 3},
          {t: 'MEMERIKSA', at: dF(2, wordAt('s2_2', 'memeriksa')) - 3},
          {t: 'MENYELENGGARA', at: dF(2, wordAt('s2_2', 'menyelenggara')) - 3},
        ]}
        out={530}
      />
      <EdgeFade len={540} fin={6} fout={6} />
    </AbsoluteFill>
  );
};

// =================================================================== SCENE 03
const TEAM_OFFICE: {id: string; p: V3; r: number; a: Action}[] = [
  {id: 'manager', p: [-32, 0, 10.25], r: PI, a: 'lead'},
  {id: 'engineer', p: [-30.85, 0, 8.6], r: -PI / 2, a: 'present'},
  {id: 'assistant', p: [-30.85, 0, 7.25], r: -PI / 2, a: 'clipboard'},
  {id: 'electrical', p: [-33.15, 0, 9.0], r: PI / 2, a: 'idle'},
  {id: 'mechanical', p: [-33.15, 0, 7.9], r: PI / 2, a: 'idle'},
  {id: 'welding', p: [-33.15, 0, 6.8], r: PI / 2, a: 'idle'},
];

export const Scene03: React.FC = () => {
  const f = useSceneFrame();
  const {fps} = useVideoConfig();
  const t = (f + 990) / fps;
  const keys: CamKey[] = [
    {f: 0, pos: [-21.5, 1.7, 1.2], look: [-31, 1.4, 7], fov: 42},
    {f: 110, pos: [-27.4, 1.65, 4.4], look: [-32, 1.3, 8], fov: 42},
    {f: 220, pos: [-29.0, 1.95, 11.4], look: [-32, 1.1, 8], fov: 40},
    {f: 290, pos: [-34.2, 2.0, 10.9], look: [-38, 2.1, 8.2], fov: 40},
    {f: 360, pos: [-35.4, 2.15, 8.4], look: [-39.8, 2.25, 8], fov: 42},
  ];
  return (
    <AbsoluteFill>
      <Stage>
        <PathCamera keys={keys} frame={f} />
        <ShotLights center={[-32, 0, 8]} warm={0.8} />
        <PlantWorld t={t} signGlow={0.35 + 1.1 * ramp(f, 270, 320)} />
        {TEAM_OFFICE.map((m, i) => (
          <Character key={m.id} spec={byId(m.id)} action={m.a} t={t + i * 0.7} position={m.p} rotationY={m.r} />
        ))}
      </Stage>
      <EdgeFade len={360} fin={6} fout={8} />
    </AbsoluteFill>
  );
};

// =================================================================== SCENE 05
export const Scene05: React.FC = () => {
  const f = useSceneFrame();
  const {fps} = useVideoConfig();
  const t = (f + 2160) / fps;
  const [dx, , dz] = STATIONS.db;
  const [gx, , gz] = STATIONS.gearbox;
  const [wx, , wz] = STATIONS.weld;
  const shots: {from: number; to: number; keys: CamKey[]; center: V3}[] = [
    {from: 0, to: 150, keys: [{f: 0, pos: [dx + 1.4, 1.6, dz + 2.3], look: [dx, 1.35, dz + 0.1], fov: 38}, {f: 150, pos: [dx + 0.8, 1.5, dz + 2.0], look: [dx, 1.3, dz], fov: 33}], center: [dx, 0, dz]},
    {from: 150, to: 300, keys: [{f: 150, pos: [gx + 1.0, 1.55, gz + 1.45], look: [gx - 0.1, 1.2, gz], fov: 38}, {f: 300, pos: [gx + 0.75, 1.45, gz + 1.2], look: [gx - 0.1, 1.2, gz], fov: 34}], center: [gx, 0, gz]},
    {from: 300, to: 450, keys: [{f: 300, pos: [wx + 1.55, 1.0, wz + 0.45], look: [wx, 0.62, wz - 0.1], fov: 36}, {f: 450, pos: [wx + 1.3, 0.92, wz + 0.35], look: [wx, 0.6, wz - 0.1], fov: 33}], center: [wx, 0, wz]},
    {from: 450, to: 570, keys: [{f: 450, pos: [25, 3.2, -4.2], look: [25, 1.0, -12.5], fov: 50}, {f: 570, pos: [25, 2.7, -5.4], look: [25, 1.0, -12.5], fov: 50}], center: [25, 0, -12]},
  ];
  const shot = shots.find((s) => inShot(f, s.from, s.to)) ?? shots[shots.length - 1];
  return (
    <AbsoluteFill>
      <Stage>
        <PathCamera keys={shot.keys} frame={f} ease={false} />
        <ShotLights center={shot.center} warm={0.9} />
        <PlantWorld t={t} stations={{dbOpen: ramp(f, 4, 44), gearReveal: f < 150 ? 0 : ramp(f, 165, 225), arc: (f >= 320 && f < 450) || f >= 470}} />
        <Character spec={byId('electrical')} action="measure" t={t} position={[dx, 0, dz + 1.05]} rotationY={PI} />
        <Character spec={byId('mechanical')} action="toolWork" t={t} position={[gx - 0.72, 0, gz + 0.5]} rotationY={2.2} />
        <Character spec={byId('welding')} action="weld" t={t} position={[wx + 0.05, 0, wz + 0.55]} rotationY={PI} />
      </Stage>
      <Label title="ELECTRICAL TECHNICIAN" sub="Sistem elektrik & pendawaian" from={20} to={148} />
      <Label title="MECHANICAL TECHNICIAN" sub="Mesin & komponen mekanikal" from={170} to={298} />
      <Label title="WELDING TECHNICIAN" sub="Fabrikasi & kimpalan" from={320} to={448} />
      <EdgeFade len={570} fin={6} fout={6} />
    </AbsoluteFill>
  );
};

// =================================================================== SCENE 08
const FORMATION: {id: string; dx: number; dz: number}[] = [
  {id: 'manager', dx: 0, dz: 0},
  {id: 'engineer', dx: -0.4, dz: -1.0},
  {id: 'assistant', dx: -0.4, dz: 1.0},
  {id: 'electrical', dx: -1.5, dz: -1.5},
  {id: 'mechanical', dx: -1.6, dz: 0.0},
  {id: 'welding', dx: -1.5, dz: 1.5},
];

export const Scene08: React.FC = () => {
  const f = useSceneFrame();
  const {fps} = useVideoConfig();
  const t = (f + 4050) / fps;
  const lead = along([{f: 0, p: [-15, 0, 6.6]}, {f: 190, p: [-6.5, 0, 6.6]}], f);
  const keys: CamKey[] = [
    {f: 0, pos: [-3.2, 1.45, 7.1], look: [-12, 1.35, 6.6], fov: 38},
    {f: 190, pos: [-1.6, 1.7, 7.3], look: [-7, 1.35, 6.6], fov: 40},
    {f: 450, pos: [5.5, 8.2, 15.5], look: [-6, 1.4, 4.0], fov: 44},
  ];
  return (
    <AbsoluteFill>
      <Stage>
        <PathCamera keys={keys} frame={f} />
        <ShotLights center={[-6, 0, 5]} warm={1.0} />
        <PlantWorld t={t} />
        {FORMATION.map((m, i) => (
          <Character
            key={m.id}
            spec={byId(m.id)}
            action={lead.moving ? 'walk' : 'idle'}
            t={t + i * 0.13}
            position={[lead.p[0] + m.dx, 0, lead.p[2] + m.dz]}
            rotationY={PI / 2}
          />
        ))}
      </Stage>
      <FinalTitle from={dF(8, wordAt('s8_3', 'maintenance')) - 4} tag={dF(8, wordAt('s8_3', 'maintenance')) + 40} />
      <EdgeFade len={450} fin={6} fout={18} />
    </AbsoluteFill>
  );
};

const FinalTitle: React.FC<{from: number; tag: number}> = ({from, tag}) => {
  const f = useSceneFrame();
  const p = ramp(f, from, from + 24);
  const q = ramp(f, tag, tag + 24);
  if (p <= 0) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: FONT}}>
      <AbsoluteFill style={{background: `rgba(8,12,20,${0.45 * p})`}} />
      <div style={{textAlign: 'center', transform: `translateY(${(1 - p) * 20}px)`}}>
        <div style={{width: 120 * p, height: 5, background: '#e8771e', margin: '0 auto 26px'}} />
        <div style={{fontSize: 104, fontWeight: 800, letterSpacing: 6 + 10 * (1 - p), color: '#fff', opacity: p, textShadow: '0 6px 30px rgba(0,0,0,0.6)'}}>MAINTENANCE &amp; FACILITIES</div>
        <div style={{fontSize: 32, fontWeight: 600, letterSpacing: 2, color: '#e3ebf4', opacity: q, marginTop: 26, maxWidth: 1300, lineHeight: 1.4, transform: `translateY(${(1 - q) * 12}px)`}}>
          DI SEBALIK SETIAP OPERASI, ADA PASUKAN YANG MEMASTIKANNYA TERUS BERJALAN.
        </div>
      </div>
    </AbsoluteFill>
  );
};

export {SceneTag};
