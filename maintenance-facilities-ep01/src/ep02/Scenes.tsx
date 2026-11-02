// Episode 02 – "Struktur Organisasi Kilang". Six scenes, authored to the narration (k = 1).
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Character} from '../characters/Character';
import {byId} from '../characters/specs';
import {along, CamKey, PathCamera, sampleCam} from '../lib/camera';
import {DigitalWorld} from '../environment/Digital';
import {Card, CollabRing, DEPTS, FloatLabel, Frame, SUPPORT} from '../environment/Ep02Digital';
import {CELL, LOGISTICS, PPC_AT, QUALITY_AT} from '../environment/Ep02Sets';
import {STATIONS} from '../environment/Sets';
import {EdgeFade, Flash, Label, ramp, ShotLights, Stage} from '../scenes/common';
import {FONT, MONO} from '../lib/text';
import {lw, scene} from './timeline';
import {Person, World02} from './World';

type V3 = [number, number, number];
const PI = Math.PI;
const useT = (sceneId: number) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return {f, t: (f + scene(sceneId).from) / fps};
};
type Shot = {from: number; to: number; keys: CamKey[]; center: V3};
const pick = (shots: Shot[], f: number) => shots.find((s) => f >= s.from && f < s.to) ?? shots[shots.length - 1];
const pop = (f: number, at: number, d = 14) => Math.max(0, Math.min(1, 1 - Math.pow(1 - Math.max(0, Math.min(1, (f - at) / d)), 3)));

// =================================================================== SCENE 1 – Hari pertama
export const E2S1: React.FC = () => {
  const {f, t} = useT(1);
  const len = scene(1).len;
  const walk = along([{f: 0, p: [-31, 0, 27.5]}, {f: 205, p: [-30, 0, 17.6]}], f);
  const ae = along([{f: 440, p: [-6.2, 0, 6.6]}, {f: 545, p: [-10.9, 0, 6.6]}], f);
  const shots: Shot[] = [
    {from: 0, to: 220, keys: [{f: 0, pos: [-26.5, 1.8, 33.5], look: [-30.5, 1.4, 24], fov: 42}, {f: 220, pos: [-28.7, 1.7, 22.6], look: [-30, 2.0, 15.4], fov: 42}], center: [-30, 0, 20]},
    {from: 220, to: 425, keys: [{f: 220, pos: [-8.8, 1.6, 9.6], look: [-12, 1.5, 6.8], fov: 42}, {f: 425, pos: [-15.6, 1.9, 9.4], look: [-11, 1.6, 4], fov: 44}], center: [-12, 0, 5]},
    {from: 425, to: len, keys: [{f: 425, pos: [-12.25, 1.66, 5.55], look: [-12, 1.58, 6.8], fov: 34}, {f: len, pos: [-12.9, 1.75, 4.9], look: [-11.4, 1.5, 6.8], fov: 40}], center: [-11, 0, 6]},
  ];
  const s = pick(shots, f);
  const outside = f < 220;
  return (
    <AbsoluteFill>
      <Stage>
        <PathCamera keys={s.keys} frame={f} ease={false} />
        <ShotLights center={s.center} warm={outside ? 1.1 : 0.9} />
        <World02 t={t} exterior={outside} sky={outside ? '#41597d' : '#1e2a3c'} />
        {outside ? (
          <Person id="newtech" action={walk.moving ? 'walk' : 'idle'} t={t} p={walk.p} r={walk.heading} />
        ) : (
          <>
            <Person id="newtech" action="idle" t={t} p={[-12, 0, 6.8]} r={PI} />
            {f >= 440 && <Character spec={byId('assistant')} action={ae.moving ? 'walk' : 'clipboard'} t={t} position={ae.p} rotationY={ae.moving ? ae.heading : -PI / 2 - 0.4} />}
          </>
        )}
      </Stage>
      <EdgeFade len={len} fin={14} fout={6} />
    </AbsoluteFill>
  );
};

// =================================================================== SCENE 2 – Gambaran besar organisasi
const DEPT_X = (i: number) => -6.4 + i * 2.05;
const DEPT_WORDS = ['production', 'quality', 'logistics', 'p. p. c.', 'engineering', 'maintenance'];

export const E2S2: React.FC = () => {
  const {f, t} = useT(2);
  const len = scene(2).len;
  const md = lw(2, 's2_2') + 10;
  const ph = lw(2, 's2_3') + 4;
  const frame = lw(2, 's2_4');
  const dept = DEPT_WORDS.map((w) => lw(2, 's2_4', w) - 4);
  const sup = lw(2, 's2_5');
  const safety = lw(2, 's2_5', 'safety') - 4;
  const qms = lw(2, 's2_5', 'q. m. s.') - 4;
  const bracket = lw(2, 's2_5', 'menyokong');
  const keys: CamKey[] = [
    {f: 0, pos: [-1.2, 4.2, 17], look: [-1.2, 3.0, 0], fov: 44},
    {f: md, pos: [-1.2, 4.75, 6.8], look: [-1.2, 4.35, 0], fov: 42},
    {f: ph, pos: [-1.2, 4.1, 7.2], look: [-1.2, 3.7, 0], fov: 42},
    {f: frame, pos: [-1.2, 2.9, 11.5], look: [-1.2, 2.1, 0], fov: 44},
    ...dept.map((d, i) => ({f: d + 10, pos: [DEPT_X(i) * 0.75, 2.2, 6.8] as V3, look: [DEPT_X(i), 1.95, 0] as V3, fov: 42})),
    {f: sup, pos: [3.8, 2.4, 8.6], look: [6.4, 2.0, 0], fov: 42},
    {f: qms + 20, pos: [5.6, 2.1, 6.4], look: [6.8, 1.9, 0], fov: 42},
    {f: len - 30, pos: [0, 3.0, 13.6], look: [0, 2.55, 0], fov: 46},
  ];
  const glowFor = (at: number) => Math.max(0, 1 - Math.abs(f - at - 10) / 30);
  return (
    <AbsoluteFill>
      <Stage>
        <PathCamera keys={keys} frame={f} ease={false} />
        <DigitalWorld t={t} />
        <FloatLabel id="lead" text="KEPIMPINAN" pos={[-8.6, 4.65, 0]} w={2.6} h={0.28} p={pop(f, md - 10)} />
        <Card id="md" name="MANAGING DIRECTOR – MODULAR" ms="Peringkat kepimpinan organisasi" color="#dfe9f5" icon={null} pos={[-1.2, 4.6, 0]} w={3.6} h={0.78} p={pop(f, md - 4)} glow={glowFor(md)} />
        <Card id="ph" name="PLANT HEAD" ms="Mengetuai kilang" color="#9fc4ff" icon={null} pos={[-1.2, 3.62, 0]} w={3.0} h={0.72} p={pop(f, ph - 4)} glow={glowFor(ph)} />
        <Frame x0={-7.45} x1={4.95} y0={0.95} y1={3.08} p={ramp(f, frame, frame + 40)} />
        <FloatLabel id="plant" text="KILANG · JABATAN OPERASI UTAMA" pos={[-7.4, 3.3, 0]} w={4.6} h={0.24} p={ramp(f, frame + 10, frame + 30)} />
        {DEPTS.map((d, i) => (
          <Card key={d.key} id={`d-${d.key}`} name={d.name} ms={d.ms} color={d.color} icon={d.key} pos={[DEPT_X(i), 1.98, 0]} w={1.86} h={1.62} p={pop(f, dept[i])} glow={glowFor(dept[i])} />
        ))}
        <FloatLabel id="support" text="FUNGSI SOKONGAN" pos={[5.95, 3.3, 0]} w={3.0} h={0.24} p={ramp(f, sup, sup + 18)} color="#ffb066" />
        {SUPPORT.map((d, i) => (
          <Card key={d.key} id={`s-${d.key}`} name={d.name} ms={d.ms} color={d.color} icon={d.key} pos={[7.0, 2.45 - i * 1.0, 0]} w={1.95} h={0.86} p={pop(f, i ? qms : safety)} glow={glowFor(i ? qms : safety)} />
        ))}
        <Frame x0={5.35} x1={5.36} y0={0.95} y1={3.08} p={ramp(f, bracket, bracket + 25)} color="#ffb066" dashed />
        <Frame x0={5.36} x1={6.02} y0={2.45} y1={2.451} p={ramp(f, bracket + 15, bracket + 30)} color="#ffb066" dashed />
        <Frame x0={5.36} x1={6.02} y0={1.45} y1={1.451} p={ramp(f, bracket + 15, bracket + 30)} color="#ffb066" dashed />
        <FloatLabel id="supnote" text="menyokong keseluruhan operasi kilang" pos={[5.4, 0.7, 0]} w={3.4} h={0.2} p={ramp(f, bracket + 20, bracket + 40)} color="#ffb066" />
      </Stage>
      <Flash at={0} dur={14} />
      <EdgeFade len={len} fin={2} fout={8} />
    </AbsoluteFill>
  );
};

// =================================================================== SCENE 3 – Lawatan setiap jabatan
export const E2S3: React.FC = () => {
  const {f, t} = useT(3);
  const len = scene(3).len;
  const b = ['s3_2', 's3_3', 's3_4', 's3_5', 's3_6', 's3_7'].map((id) => lw(3, id as 's3_2') - 12);
  const walkA = along([{f: 0, p: [-15.5, 0, 6.6]}, {f: b[0], p: [-21.5, 0, 6.6]}], f);
  const [qx, , qz] = QUALITY_AT;
  const fk = along([{f: b[2], p: [22, 0, LOGISTICS.driveZ]}, {f: b[2] + 170, p: [13.5, 0, LOGISTICS.driveZ]}], f);
  const [px, , pz] = PPC_AT;
  const shots: Shot[] = [
    {from: 0, to: b[0], keys: [{f: 0, pos: [-23.5, 1.6, 8.6], look: [-16, 1.4, 6.6], fov: 40}, {f: b[0], pos: [-24.6, 1.7, 8.9], look: [-20, 1.3, 6.4], fov: 40}], center: [-19, 0, 6]},
    {from: b[0], to: b[1], keys: [{f: b[0], pos: [-31.6, 1.9, 4.2], look: [-27.8, 1.1, 0.2], fov: 42}, {f: b[1], pos: [-30.9, 1.7, 3.4], look: [-27.8, 1.1, 0.2], fov: 40}], center: [-27, 0, 1]},
    {from: b[1], to: b[2], keys: [{f: b[1], pos: [qx - 2.4, 1.8, qz + 3.6], look: [qx + 0.4, 1.1, qz + 0.2], fov: 42}, {f: b[2], pos: [qx - 1.8, 1.6, qz + 3.0], look: [qx + 0.4, 1.1, qz + 0.2], fov: 40}], center: [qx, 0, qz]},
    {from: b[2], to: b[3], keys: [{f: b[2], pos: [9.4, 1.6, 8.0], look: [16, 1.3, 11.6], fov: 44}, {f: b[3], pos: [10.4, 1.8, 7.6], look: [15, 1.4, 11.6], fov: 44}], center: [15, 0, 11]},
    {from: b[3], to: b[4], keys: [{f: b[3], pos: [px + 2.4, 1.8, pz + 2.6], look: [px - 2.2, 2.0, pz - 0.2], fov: 44}, {f: b[4], pos: [px + 1.8, 1.7, pz + 2.0], look: [px - 2.2, 2.0, pz - 0.2], fov: 42}], center: [px, 0, pz]},
    {from: b[4], to: b[5], keys: [{f: b[4], pos: [8.0, 1.7, 7.6], look: [10.6, 1.4, 3.4], fov: 42}, {f: b[5], pos: [8.6, 1.6, 7.0], look: [10.6, 1.4, 3.4], fov: 40}], center: [10, 0, 5]},
    {from: b[5], to: len, keys: [{f: b[5], pos: [25, 3.0, -3.4], look: [25, 1.0, -12], fov: 50}, {f: len, pos: [25, 2.6, -4.6], look: [25, 1.0, -12], fov: 50}], center: [25, 0, -10]},
  ];
  const s = pick(shots, f);
  // the guide and the new technician appear as observers in each department
  const obs: V3[][] = [
    [walkA.p, [walkA.p[0] + 0.1, 0, walkA.p[2] + 0.85]],
    [[-25.4, 0, 4.4], [-24.5, 0, 5.0]],
    [[qx + 2.6, 0, qz + 2.6], [qx + 3.3, 0, qz + 3.1]],
    [[12, 0, 8.4], [12.9, 0, 8.0]],
    [[px + 1.4, 0, pz + 1.0], [px + 2.1, 0, pz + 1.6]],
    [[12.5, 0, 6.4], [13.3, 0, 6.9]],
    [[25.6, 0, -6.6], [24.6, 0, -6.4]],
  ];
  const si = Math.max(0, [0, ...b].findIndex((x, i, arr) => f >= x && (i === arr.length - 1 || f < arr[i + 1])));
  const o = obs[si];
  const obsRot = [-PI / 2, -2.4, PI * 0.75, 0.1, -PI / 2 - 0.4, -PI * 0.75, PI][si];
  return (
    <AbsoluteFill>
      <Stage>
        <PathCamera keys={s.keys} frame={f} ease={false} />
        <ShotLights center={s.center} />
        <World02 t={t} forklift={f >= b[2] && f < b[3] ? {p: fk.p, rotY: -PI / 2, carry: true} : null} stations={{dbOpen: 1, gearReveal: 1, arc: true}} />
        <Character spec={byId('assistant')} action={si === 0 ? 'walk' : 'clipboard'} t={t} position={o[0]} rotationY={obsRot} />
        <Person id="newtech" action={si === 0 ? 'walk' : 'idle'} t={t + 0.3} p={o[1]} r={obsRot} />
        {/* department activities */}
        <Person id="operator1" action="toolWork" t={t} p={[-27.2, 0, 1.55]} r={PI} />
        <Person id="operator2" action="toolWork" t={t + 0.7} p={[-28.7, 0, -1.55]} r={0} />
        <Person id="quality" action="inspect" t={t} p={[qx + 0.9, 0, qz + 1.25]} r={PI} />
        <Person id="ppc" floor={false} action="present" t={t} p={[px - 0.8, 0, pz + 0.6]} r={-PI / 2} />
        <Person id="engineering" action={f < b[4] + 70 ? 'tablet' : 'present'} t={t} p={[10.5, 0, 5.4]} r={PI} />
        <Character spec={byId('electrical')} action="measure" t={t} position={[STATIONS.db[0], 0, STATIONS.db[2] + 1.05]} rotationY={PI} />
        <Character spec={byId('mechanical')} action="toolWork" t={t} position={[STATIONS.gearbox[0] - 0.72, 0, STATIONS.gearbox[2] + 0.5]} rotationY={2.2} />
        <Character spec={byId('welding')} action="weld" t={t} position={[STATIONS.weld[0] + 0.05, 0, STATIONS.weld[2] + 0.55]} rotationY={PI} />
      </Stage>
      <Label title="PRODUCTION" sub="Memasang & menghasilkan produk" from={b[0] + 14} to={b[1] - 2} color="#3d9b5a" />
      <Label title="QUALITY" sub="Memeriksa & mengesahkan produk" from={b[1] + 14} to={b[2] - 2} color="#2f6fd6" />
      <Label title="LOGISTICS" sub="Pergerakan bahan, alat ganti & produk" from={b[2] + 14} to={b[3] - 2} color="#ff7a1a" />
      <Label title="PPC" sub="Merancang & mengawal jadual pengeluaran" from={b[3] + 14} to={b[4] - 2} color="#b0476a" />
      <Label title="ENGINEERING" sub="Membangun & menambah baik proses" from={b[4] + 14} to={b[5] - 2} color="#7fd6ff" />
      <Label title="MAINTENANCE & FACILITIES" sub="Mesin, peralatan & kemudahan sentiasa sedia" from={b[5] + 14} to={len - 6} color="#e8771e" />
      <EdgeFade len={len} fin={6} fout={6} />
    </AbsoluteFill>
  );
};

// =================================================================== SCENE 4 – Fungsi sokongan
export const E2S4: React.FC = () => {
  const {f, t} = useT(4);
  const len = scene(4).len;
  const q = lw(4, 's4_3') - 12;
  const shots: Shot[] = [
    {from: 0, to: q, keys: [{f: 0, pos: [-6.2, 1.75, 4.8], look: [-8.6, 1.5, 7.2], fov: 42}, {f: q, pos: [-6.9, 1.6, 5.1], look: [-8.7, 1.5, 7.3], fov: 38}], center: [-8.5, 0, 7]},
    {from: q, to: len, keys: [{f: q, pos: [-33.6, 1.65, 8.4], look: [-35.9, 1.3, 10.0], fov: 38}, {f: len, pos: [-34.1, 1.55, 8.8], look: [-35.9, 1.3, 10.1], fov: 34}], center: [-35, 0, 9]},
  ];
  const s = pick(shots, f);
  return (
    <AbsoluteFill>
      <Stage>
        <PathCamera keys={s.keys} frame={f} ease={false} />
        <ShotLights center={s.center} warm={0.9} />
        <World02 t={t} />
        <Person id="safety" action="inspect" t={t} p={[-9.05, 0, 6.65]} r={PI / 2} />
        <Person id="newtech" action="idle" t={t} p={[-8.0, 0, 6.6]} r={-PI / 2} />
        <Character spec={byId('assistant')} action="clipboard" t={t} position={[-7.5, 0, 7.6]} rotationY={-PI / 2 - 0.5} />
        <Person id="qms" floor={false} action="tablet" t={t} p={[-35.8, 0, 9.9]} r={-PI / 2 + 0.25} />
      </Stage>
      <Label title="SAFETY" sub="Fungsi sokongan · kerja selamat, PPE & prosedur" from={lw(4, 's4_2') - 4} to={q - 2} color="#d93636" />
      <Label title="QMS" sub="Fungsi sokongan · prosedur, dokumentasi & audit" from={q + 14} to={len - 6} color="#2a9ab0" />
      <EdgeFade len={len} fin={6} fout={6} />
    </AbsoluteFill>
  );
};

// =================================================================== SCENE 5 – Mesin rosak
export const E2S5: React.FC = () => {
  const {f, t} = useT(5);
  const len = scene(5).len;
  const st = (id: string) => lw(5, id as 's5_1') - 10;
  const stopAt = lw(5, 's5_1', 'berhenti') - 6;
  const restart = st('s5_8') + 40;
  const down = f >= stopAt && f < restart;
  const t0 = scene(5).from / 30;
  const frozenT = t0 + stopAt / 30;
  const lineT = !down ? (f < stopAt ? t : t - (restart - stopAt) / 30) : frozenT;
  const fkA = st('s5_7');
  const fk = along([{f: fkA, p: [6.5, 0, 6.7]}, {f: fkA + 120, p: [0.2, 0, 6.7]}], f);
  const [px, , pz] = PPC_AT;
  const [cx] = [CELL.robotX];
  const shots: Shot[] = [
    {from: 0, to: st('s5_2'), keys: [{f: 0, pos: [-9.2, 2.5, 8.6], look: [-3.5, 1.6, 2.3], fov: 44}, {f: st('s5_2'), pos: [-7.6, 2.1, 7.6], look: [-3.5, 1.9, 2.8], fov: 40}], center: [-4, 0, 4]},
    {from: st('s5_2'), to: st('s5_3'), keys: [{f: st('s5_2'), pos: [-6.9, 1.35, 7.5], look: [-4.4, 2.1, 4.9], fov: 42}, {f: st('s5_3'), pos: [-6.5, 1.3, 7.2], look: [-4.2, 2.2, 4.9], fov: 40}], center: [-4.5, 0, 5]},
    {from: st('s5_3'), to: st('s5_4'), keys: [{f: st('s5_3'), pos: [-3.0, 1.5, 6.6], look: [-1.55, 1.0, 4.95], fov: 40}, {f: st('s5_4'), pos: [-2.6, 1.35, 6.2], look: [-1.6, 0.95, 4.95], fov: 34}], center: [-1.6, 0, 5]},
    {from: st('s5_4'), to: st('s5_5'), keys: [{f: st('s5_4'), pos: [-5.8, 1.8, 6.7], look: [-2.8, 1.0, 3.2], fov: 42}, {f: st('s5_5'), pos: [-5.3, 1.65, 6.3], look: [-2.8, 1.0, 3.2], fov: 38}], center: [-3, 0, 4]},
    {from: st('s5_5'), to: st('s5_6'), keys: [{f: st('s5_5'), pos: [-8.8, 1.6, 7.0], look: [-6.4, 1.3, 4.6], fov: 42}, {f: st('s5_6'), pos: [-8.4, 1.5, 6.6], look: [-6.4, 1.3, 4.6], fov: 40}], center: [-6.5, 0, 5]},
    {from: st('s5_6'), to: st('s5_7'), keys: [{f: st('s5_6'), pos: [px + 2.4, 1.8, pz + 2.4], look: [px - 2.2, 2.1, pz - 0.1], fov: 44}, {f: st('s5_7'), pos: [px + 1.9, 1.7, pz + 1.9], look: [px - 2.2, 2.1, pz - 0.1], fov: 42}], center: [px, 0, pz]},
    {from: st('s5_7'), to: st('s5_8'), keys: [{f: st('s5_7'), pos: [-2.6, 1.5, 8.7], look: [2.4, 1.2, 6.4], fov: 44}, {f: st('s5_8'), pos: [-2.2, 1.6, 8.9], look: [0.8, 1.2, 6.4], fov: 44}], center: [1, 0, 6]},
    {from: st('s5_8'), to: len, keys: [{f: st('s5_8'), pos: [-3.2, 1.65, 10.4], look: [-3.3, 1.6, 4.0], fov: 42}, {f: len, pos: [-3.2, 1.9, 11.4], look: [-3.3, 1.7, 4.0], fov: 44}], center: [-3, 0, 5]},
  ];
  const s = pick(shots, f);
  const repairing = f >= st('s5_4') && f < restart;
  const restored = f >= st('s5_8');
  return (
    <AbsoluteFill>
      <Stage>
        <PathCamera keys={s.keys} frame={f} ease={false} />
        <ShotLights center={s.center} />
        <World02
          t={t}
          lineT={lineT}
          robotStopT={down ? frozenT : null}
          andon={down ? 'red' : 'green'}
          locked={f >= restart - 20 ? 0 : ramp(f, st('s5_3') + 50, st('s5_3') + 62)}
          hold={f >= restart ? 0 : ramp(f, st('s5_5') + 6, st('s5_5') + 18)}
          replanned={f >= st('s5_6') + 30}
          forklift={f >= fkA && f < st('s5_8') ? {p: fk.p, rotY: -PI / 2, carry: true} : null}
        />
        <Person id="operator1" action={f >= st('s5_2') && f < st('s5_3') + 30 ? 'report' : 'idle'} t={t} p={restored ? [-6.0, 0, 5.8] : f >= st('s5_4') - 10 ? [-7.6, 0, 5.7] : [-5.2, 0, 5.4]} r={restored ? 0.2 : PI + 0.4} />
        {f >= st('s5_3') && <Person id="safety" action={f < st('s5_4') ? 'inspect' : 'idle'} t={t} p={f < st('s5_4') ? [-0.85, 0, 5.45] : [0.7, 0, 5.9]} r={f < st('s5_4') ? PI + 0.55 : restored ? 0 : -0.6} />}
        {f >= st('s5_4') - 20 && (
          <>
            <Character spec={byId('mechanical')} action={repairing ? 'toolWork' : 'idle'} t={t} position={repairing ? [cx + 0.9, 0, 3.35] : [cx - 0.6, 0, 6.2]} rotationY={repairing ? PI + 0.5 : 0} />
            <Person id="newtech" action={repairing ? 'inspect' : 'idle'} t={t} p={repairing ? [cx + 1.6, 0, 3.75] : [cx + 1.3, 0, 6.3]} r={repairing ? PI + 0.2 : 0} />
            <Person id="engineering" action={restored ? 'idle' : 'tablet'} t={t} p={restored ? [cx - 1.4, 0, 6.0] : [cx + 1.3, 0, 5.4]} r={restored ? 0 : PI + 0.3} />
          </>
        )}
        {f >= st('s5_5') - 10 && <Person id="quality" action={restored ? 'idle' : 'inspect'} t={t} p={restored ? [-5.1, 0, 5.6] : [-6.85, 0, 5.35]} r={restored ? 0.1 : PI - 0.2} />}
        <Person id="ppc" floor={false} action="present" t={t} p={[px - 0.8, 0, pz + 0.6]} r={-PI / 2} />
        {f >= st('s5_8') && <Person id="qms" action="tablet" t={t} p={[cx + 0.25, 0, 6.8]} r={0} />}
      </Stage>
      <Label title="PRODUCTION" sub="Melaporkan kerosakan" from={st('s5_2') + 10} to={st('s5_3') - 2} color="#3d9b5a" />
      <Label title="SAFETY" sub="Pengasingan mesin (lockout / tagout)" from={st('s5_3') + 10} to={st('s5_4') - 2} color="#d93636" />
      <Label title="MAINTENANCE & FACILITIES" sub="Troubleshooting & pembaikan · dibantu Engineering" from={st('s5_4') + 10} to={st('s5_5') - 2} color="#e8771e" />
      <Label title="QUALITY" sub="Memeriksa produk terjejas" from={st('s5_5') + 10} to={st('s5_6') - 2} color="#2f6fd6" />
      <Label title="PPC" sub="Menyelaraskan semula jadual" from={st('s5_6') + 10} to={st('s5_7') - 2} color="#b0476a" />
      <Label title="LOGISTICS" sub="Alat ganti & bahan tepat pada masanya" from={st('s5_7') + 10} to={st('s5_8') - 2} color="#ff7a1a" />
      <Label title="QMS" sub="Rekod & tindakan pembetulan" from={st('s5_8') + 40} to={len - 6} color="#2a9ab0" />
      <EdgeFade len={len} fin={6} fout={6} />
    </AbsoluteFill>
  );
};

// =================================================================== SCENE 6 – Satu kilang, satu pasukan
const GROUP: {id: string; ep1?: boolean; x: number; z: number}[] = [
  {id: 'newtech', x: -6.0, z: 7.6},
  {id: 'assistant', ep1: true, x: -6.9, z: 7.5},
  {id: 'mechanical', ep1: true, x: -5.1, z: 7.5},
  {id: 'operator1', x: -7.8, z: 7.3},
  {id: 'quality', x: -4.2, z: 7.3},
  {id: 'engineer', ep1: true, x: -6.45, z: 6.7},
  {id: 'electrical', ep1: true, x: -5.55, z: 6.7},
  {id: 'logistics', x: -7.35, z: 6.6},
  {id: 'ppc', x: -4.65, z: 6.6},
  {id: 'manager', ep1: true, x: -8.25, z: 6.5},
  {id: 'engineering', x: -3.75, z: 6.5},
  {id: 'safety', x: -6.0, z: 5.9},
  {id: 'qms', x: -5.1, z: 5.85},
  {id: 'welding', ep1: true, x: -6.9, z: 5.85},
];

export const E2S6: React.FC = () => {
  const {f, t} = useT(6);
  const len = scene(6).len;
  const ringEnd = lw(6, 's6_2') - 8;
  const ringAt = Array.from({length: 8}, (_, i) => 18 + i * 12);
  const title = lw(6, 's6_3') + 70;
  const keys: CamKey[] = [
    {f: ringEnd, pos: [-6, 1.55, 11.6], look: [-6, 1.35, 6.6], fov: 40},
    {f: title - 40, pos: [-6, 2.3, 14.2], look: [-6, 1.5, 6.4], fov: 42},
    {f: len, pos: [-2.5, 6.8, 19.5], look: [-6, 1.5, 4.2], fov: 44},
  ];
  const cam = sampleCam(keys, f);
  return (
    <AbsoluteFill>
      <Stage>
        {f < ringEnd ? (
          <>
            <PathCamera keys={[{f: 0, pos: [0, 3.5, 15.0], look: [0, 3.4, 0], fov: 46}, {f: ringEnd, pos: [0, 3.45, 13.6], look: [0, 3.4, 0], fov: 46}]} frame={f} ease={false} />
            <DigitalWorld t={t} />
            <CollabRing at={ringAt} f={f} restored={ramp(f, ringAt[7] + 18, ringAt[7] + 20)} />
          </>
        ) : (
          <>
            <PathCamera keys={keys} frame={f} />
            <ShotLights center={[cam.look[0], 0, cam.look[2]]} />
            <World02 t={t} />
            {GROUP.map((m, i) => (m.ep1 ? <Character key={m.id} spec={byId(m.id)} action="idle" t={t + i * 0.4} position={[m.x, 0, m.z]} rotationY={0} /> : <Person key={m.id} id={m.id} action="idle" t={t + i * 0.4} p={[m.x, 0, m.z]} r={0} />))}
          </>
        )}
      </Stage>
      <Flash at={ringEnd} dur={12} />
      <EndTitle from={title} />
      <EdgeFade len={len} fin={2} fout={20} />
    </AbsoluteFill>
  );
};

const EndTitle: React.FC<{from: number}> = ({from}) => {
  const f = useCurrentFrame();
  const p = ramp(f, from, from + 24);
  const q = ramp(f, from + 45, from + 70);
  if (p <= 0) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', fontFamily: FONT}}>
      <AbsoluteFill style={{background: `rgba(8,12,20,${0.45 * p})`}} />
      <div style={{textAlign: 'center', transform: `translateY(${(1 - p) * 20}px)`}}>
        <div style={{width: 120 * p, height: 5, background: '#e8771e', margin: '0 auto 26px'}} />
        <div style={{fontSize: 100, fontWeight: 800, letterSpacing: 6 + 10 * (1 - p), color: '#fff', opacity: p, textShadow: '0 6px 30px rgba(0,0,0,0.6)'}}>SATU KILANG. SATU PASUKAN.</div>
        <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: 6, color: '#e3ebf4', opacity: q, marginTop: 26}}>DI SEBALIK OPERASI KILANG · EPISODE 02 · STRUKTUR ORGANISASI KILANG</div>
      </div>
    </AbsoluteFill>
  );
};
