// Digital-space scenes: 04 (org chart), 06 (admin systems), 07 (documentation & compliance).
import React from 'react';
import {useSceneFrame} from '../lib/clock';
import {AbsoluteFill, interpolate, useVideoConfig} from 'remotion';
import {Character} from '../characters/Character';
import {Action} from '../characters/poses';
import {byId} from '../characters/specs';
import {CamKey, PathCamera} from '../lib/camera';
import {FONT, MONO, TexPlane} from '../lib/text';
import {Beam, COMPLIANCE, ComplianceIcon, DigitalWorld, DocSheet, ModulePanel, MODULES, Platform} from '../environment/Digital';
import {dF, wordAt} from '../data/timeline';
import {clamp, EdgeFade, Flash, Label, PlantWorld, ramp, ShotLights, Stage, V3} from './common';

const PI = Math.PI;
const pop = (f: number, at: number, d = 14) => interpolate(f, [at, at + d], [0, 1], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3)});

/** A character that materialises on a platform: light column + scale-in. */
const Materialise: React.FC<{id: string; at: number; f: number; t: number; pos: V3; rot?: number; action: Action}> = ({id, at, f, t, pos, rot = 0, action}) => {
  const p = pop(f, at, 18);
  if (p <= 0) return null;
  const beam = Math.max(0, 1 - Math.abs((f - at - 10) / 18));
  return (
    <group>
      <group position={pos} scale={[1, 0.6 + 0.4 * p, 1]}>
        <Character spec={byId(id)} action={action} t={t} rotationY={rot} />
      </group>
      {beam > 0 && (
        <mesh position={[pos[0], pos[1] + 1.2, pos[2]]}>
          <cylinderGeometry args={[0.55, 0.55, 2.4, 32, 1, true]} />
          <meshBasicMaterial color="#7fd6ff" transparent opacity={0.35 * beam} side={2} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
};

// =================================================================== SCENE 04
const TIER = {
  manager: [0, 3.2, -3] as V3,
  engineer: [0, 2.1, -1] as V3,
  assistant: [0, 1.05, 1] as V3,
  techs: [[-1.7, 0, 3], [0, 0, 3.2], [1.7, 0, 3]] as V3[],
};
// each role appears as its narration line begins
export const ORG_AT = {
  manager: dF(4, wordAt('s4_2', 'manager')) - 6,
  engineer: dF(4, wordAt('s4_3', 'engineer')) - 6,
  assistant: dF(4, wordAt('s4_4', 'assistant')) - 6,
  techs: dF(4, wordAt('s4_5', 'technician')) - 6,
};

export const Scene04: React.FC = () => {
  const f = useSceneFrame();
  const {fps} = useVideoConfig();
  const t = (f + 1350) / fps;
  const keys: CamKey[] = [
    {f: 0, pos: [0, 5.2, 7], look: [0, 3.0, -3], fov: 42},
    {f: ORG_AT.manager, pos: [0.6, 4.4, 1.2], look: [0, 4.0, -3], fov: 40},
    {f: ORG_AT.engineer, pos: [-0.6, 3.2, 2.9], look: [0, 2.9, -1], fov: 40},
    {f: ORG_AT.assistant, pos: [0.6, 2.1, 4.7], look: [0, 1.9, 1], fov: 40},
    {f: ORG_AT.techs, pos: [0, 1.7, 8.2], look: [0, 1.0, 3], fov: 42},
    {f: 810, pos: [3.5, 4.6, 12.5], look: [0, 1.6, 0], fov: 44},
  ];
  const plat = (at: number) => pop(f, at - 20, 20);
  return (
    <AbsoluteFill>
      <Stage>
        <PathCamera keys={keys} frame={f} />
        <DigitalWorld t={t} />
        <Platform pos={TIER.manager} p={plat(ORG_AT.manager)} color="#e8771e" />
        <Platform pos={TIER.engineer} p={plat(ORG_AT.engineer)} />
        <Platform pos={TIER.assistant} p={plat(ORG_AT.assistant)} />
        {TIER.techs.map((p, i) => (
          <Platform key={i} pos={p} p={plat(ORG_AT.techs + i * 8)} color="#f2c230" />
        ))}
        <Beam a={[0, 3.14, -2.1]} b={[0, 2.16, -1.9]} p={ramp(f, ORG_AT.engineer - 30, ORG_AT.engineer - 5)} />
        <Beam a={[0, 2.04, -0.1]} b={[0, 1.1, 0.1]} p={ramp(f, ORG_AT.assistant - 30, ORG_AT.assistant - 5)} />
        {TIER.techs.map((p, i) => (
          <Beam key={i} a={[0, 0.99, 1.9]} b={[p[0], 0.05, p[2] - 0.9]} p={ramp(f, ORG_AT.techs - 30 + i * 6, ORG_AT.techs - 5 + i * 6)} />
        ))}
        <Materialise id="manager" at={ORG_AT.manager} f={f} t={t} pos={TIER.manager} action="lead" />
        <Materialise id="engineer" at={ORG_AT.engineer} f={f} t={t} pos={TIER.engineer} action="present" rot={-0.2} />
        <Materialise id="assistant" at={ORG_AT.assistant} f={f} t={t} pos={TIER.assistant} action="clipboard" rot={0.15} />
        <Materialise id="electrical" at={ORG_AT.techs} f={f} t={t} pos={TIER.techs[0]} action="idle" rot={0.25} />
        <Materialise id="mechanical" at={ORG_AT.techs + 8} f={f} t={t} pos={TIER.techs[1]} action="idle" />
        <Materialise id="welding" at={ORG_AT.techs + 16} f={f} t={t} pos={TIER.techs[2]} action="idle" rot={-0.25} />
      </Stage>
      <Label title="MANAGER" sub="Hala tuju, sumber & prestasi keseluruhan" from={ORG_AT.manager + 10} to={ORG_AT.engineer - 5} />
      <Label title="ENGINEER" sub="Aktiviti teknikal, strategi penyelenggaraan & penambahbaikan" from={ORG_AT.engineer + 10} to={ORG_AT.assistant - 5} color="#7fd6ff" />
      <Label title="ASSISTANT ENGINEER" sub="Perancangan, pemeriksaan, pemantauan & penyelarasan harian" from={ORG_AT.assistant + 10} to={ORG_AT.techs - 5} color="#6fa8ff" />
      <Label title="TECHNICIAN" sub="Electrical · Mechanical · Welding" from={ORG_AT.techs + 20} to={790} color="#f2c230" />
      <OrgLegend from={700} />
      <Flash at={0} dur={16} />
      <EdgeFade len={810} fin={2} fout={8} />
    </AbsoluteFill>
  );
};

const OrgLegend: React.FC<{from: number}> = ({from}) => {
  const f = useSceneFrame();
  const o = ramp(f, from, from + 16) * (1 - ramp(f, 795, 810));
  if (o <= 0) return null;
  const rows = [
    ['MANAGER', '#e8771e'],
    ['ENGINEER', '#7fd6ff'],
    ['ASSISTANT ENGINEER', '#6fa8ff'],
    ['TECHNICIAN', '#f2c230'],
  ];
  return (
    <div style={{position: 'absolute', right: 110, top: 300, opacity: o, fontFamily: FONT}}>
      {rows.map(([r, c], i) => (
        <div key={r} style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: i < 3 ? 6 : 0}}>
          <div style={{width: 14, height: 14, borderRadius: 7, background: c}} />
          <div style={{fontSize: 24, fontWeight: 700, color: '#fff'}}>{r}</div>
          {i < 3 && <div style={{position: 'absolute'}} />}
        </div>
      ))}
      <div style={{fontFamily: MONO, fontSize: 14, color: '#9fb6d0', marginTop: 12, letterSpacing: 2}}>STRUKTUR ORGANISASI</div>
    </div>
  );
};

// =================================================================== SCENE 06
const PANEL_X = (i: number) => i * 3.3;
// modules light up as they are named in line s6_3 (contractor sits between inventory and KPI)
const MOD_WORDS = ['work order', 'penyelenggaraan', 'laporan', 'alat ganti', '', 'prestasi'];
const modWord = (w: string) => dF(6, wordAt('s6_3', w)) - 4;
export const MOD_AT = (i: number) => (MOD_WORDS[i] ? modWord(MOD_WORDS[i]) : (modWord('alat ganti') + modWord('prestasi')) / 2);

export const Scene06: React.FC = () => {
  const f = useSceneFrame();
  const {fps} = useVideoConfig();
  const t = (f + 2730) / fps;
  const office = f < 100;
  const officeKeys: CamKey[] = [
    {f: 0, pos: [-30.2, 1.95, 8.0], look: [-31.2, 1.1, 8.4], fov: 40},
    {f: 100, pos: [-30.95, 1.3, 8.33], look: [-31.25, 1.02, 8.4], fov: 34},
  ];
  const digiKeys: CamKey[] = [
    {f: 100, pos: [-2.5, 1.9, 6.5], look: [0, 1.9, 0], fov: 44},
    ...MODULES.map((_, i) => ({f: MOD_AT(i) + 30, pos: [PANEL_X(i) + 0.4, 1.95, 3.7] as V3, look: [PANEL_X(i), 1.9, 0] as V3, fov: 42})),
    {f: 780, pos: [8.25, 3.6, 13.5], look: [8.25, 1.9, 0], fov: 46},
  ];
  return (
    <AbsoluteFill>
      <Stage>
        {office ? (
          <>
            <PathCamera keys={officeKeys} frame={f} />
            <ShotLights center={[-32, 0, 8]} warm={0.8} />
            <PlantWorld t={t} />
            <Character spec={byId('engineer')} action="tablet" t={t} position={[-30.85, 0, 8.6]} rotationY={-PI / 2} />
            <Character spec={byId('assistant')} action="clipboard" t={t} position={[-30.85, 0, 7.25]} rotationY={-PI / 2} />
          </>
        ) : (
          <>
            <PathCamera keys={digiKeys} frame={f} ease={false} />
            <DigitalWorld t={t} />
            {MODULES.map((_, i) => {
              const at = MOD_AT(i);
              const last = i === MODULES.length - 1;
              const next = last ? 0 : MOD_AT(i + 1);
              const active = last ? ramp(f, at, at + 8) : Math.min(ramp(f, at, at + 8), 1 - ramp(f, next, next + 8));
              return <ModulePanel key={i} i={i} pos={[PANEL_X(i), 1.9, 0]} rotY={0} p={pop(f, at - 24, 16)} active={active} />;
            })}
          </>
        )}
      </Stage>
      <Flash at={100} dur={14} />
      {f > dF(6, wordAt('s6_4', 'sistematik')) - 20 && <Sistematik from={dF(6, wordAt('s6_4', 'sistematik')) - 12} />}
      <EdgeFade len={780} fin={6} fout={6} />
    </AbsoluteFill>
  );
};

const Sistematik: React.FC<{from: number}> = ({from}) => {
  const f = useSceneFrame();
  const p = ramp(f, from, from + 16);
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 240, textAlign: 'center', fontFamily: FONT, opacity: p}}>
      <div style={{fontSize: 30, fontWeight: 600, color: '#cfe0f2', letterSpacing: 2}}>PENYELENGGARAAN YANG DIURUS SECARA</div>
      <div style={{fontSize: 64, fontWeight: 800, color: '#fff', letterSpacing: 10, marginTop: 6}}>SISTEMATIK</div>
    </div>
  );
};

// =================================================================== SCENE 07
const COMP_WORDS = ['kualiti', 'alam sekitar', 'keselamatan', 'audit'];
export const COMP_AT = (i: number) => dF(7, wordAt('s7_2', COMP_WORDS[i])) - 4;

export const Scene07: React.FC = () => {
  const f = useSceneFrame();
  const {fps} = useVideoConfig();
  const t = (f + 3510) / fps;
  const office = f < 150;
  const officeKeys: CamKey[] = [
    {f: 0, pos: [-34.4, 1.65, 9.2], look: [-36.2, 1.25, 7.6], fov: 36},
    {f: 150, pos: [-34.9, 1.55, 8.6], look: [-36.2, 1.2, 7.6], fov: 32},
  ];
  const digiKeys: CamKey[] = [
    {f: 150, pos: [0, 2.1, 3.6], look: [0, 1.95, 0], fov: 42},
    {f: 330, pos: [0.8, 2.0, 3.2], look: [0, 1.95, 0], fov: 42},
    {f: 540, pos: [0, 2.0, 6.8], look: [0, 1.7, 0], fov: 44},
  ];
  // documents fly into a fan, then step back for the compliance icons
  const docs = [0, 1, 2, 3].map((i) => {
    const p = pop(f, 165 + i * 22, 34);
    const back = ramp(f, 320, 360);
    const from: V3 = [(i - 1.5) * 4, 4 + i, -6];
    const to: V3 = [(i - 1.5) * 1.15, 1.95 + Math.abs(i - 1.5) * -0.08, 0];
    const pos: V3 = [from[0] + (to[0] - from[0]) * p, from[1] + (to[1] - from[1]) * p + back * 4, from[2] + (to[2] - from[2]) * p - back * 6];
    const rot: V3 = [(1 - p) * 1.2, (1 - p) * 2, (i - 1.5) * -0.06 * p];
    return {pos, rot};
  });
  return (
    <AbsoluteFill>
      <Stage>
        {office ? (
          <>
            <PathCamera keys={officeKeys} frame={f} />
            <ShotLights center={[-35, 0, 8]} warm={0.8} />
            <PlantWorld t={t} />
            <Character spec={byId('engineer')} action="tablet" t={t} position={[-35.8, 0, 7.7]} rotationY={-PI / 2 + 0.3} />
          </>
        ) : (
          <>
            <PathCamera keys={digiKeys} frame={f} ease={false} />
            <DigitalWorld t={t} />
            {ramp(f, 320, 360) < 1 &&
              docs.map((d, i) => (
                <DocSheet key={i} i={i} pos={d.pos} rot={d.rot} />
              ))}
            {COMPLIANCE.map((c, i) => {
              const p = pop(f, COMP_AT(i), 16);
              return (
                <group key={c.key}>
                  <ComplianceIcon i={i} pos={[(i - 1.5) * 1.75, 2.05, 0.6]} p={p} t={t} />
                  {p > 0.01 && (
                    <group position={[(i - 1.5) * 1.75, 1.15, 0.6]} scale={p}>
                      <TexPlane
                        id={`clabel-${c.key}`}
                        w={1.7}
                        h={0.32}
                        px={420}
                        emissive={1}
                        alpha
                        draw={(ctx, w, h) => {
                          ctx.clearRect(0, 0, w, h);
                          ctx.fillStyle = '#ffffff';
                          ctx.font = `800 ${Math.round(h * (c.label.length > 14 ? 0.3 : 0.42))}px ${FONT}`;
                          ctx.textAlign = 'center';
                          ctx.textBaseline = 'middle';
                          ctx.fillText(c.label, w / 2, h / 2);
                        }}
                      />
                    </group>
                  )}
                </group>
              );
            })}
          </>
        )}
      </Stage>
      <Flash at={150} dur={14} />
      <EdgeFade len={540} fin={6} fout={8} />
    </AbsoluteFill>
  );
};
