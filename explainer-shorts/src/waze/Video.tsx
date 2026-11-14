import React from 'react';
import {AbsoluteFill, Audio, interpolate, Easing, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {JAM, Traffic} from './world/Car';
import {Beacons, CloudServer, Packets, Pins, RoadStatus} from './world/Data';
import {HeroCar, Mood} from './world/Hero';
import {World} from './world/World';
import {Captions, Chip, Punch, PhoneMap, Speedo} from './ui/Overlays';
import {cue, FPS, Shot, SHOTS, TOTAL_FRAMES} from './timeline';

type V3 = [number, number, number];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

const CameraRig: React.FC<{pos: V3; target: V3; fov?: number}> = ({pos, target, fov = 50}) => {
  const {camera} = useThree();
  camera.position.set(...pos);
  camera.lookAt(...target);
  const cam = camera as unknown as {fov: number; far: number; updateProjectionMatrix: () => void};
  cam.fov = fov;
  cam.far = 3000;
  cam.updateProjectionMatrix();
  return null;
};

const HERO_X = -3.6;
const HERO_SPEED = 24.7; // 89 km/h in m/s
// The hero drives in the clear left lane until it reaches the back of the queue.
const heroZ = (z0: number, t: number, globalT: number) => Math.max(z0 - HERO_SPEED * t, JAM.from - JAM.speed * globalT + 12);

type Plan = {
  pos: V3;
  target: V3;
  fov?: number;
  heroZ: number | null;
  mood: Mood;
  talking: boolean;
  beaconsOn: number; // global seconds
  packetsOn: number;
  level: number;
  pins: {x: number; z: number; color: string; at: number}[];
  server: boolean;
  phoneGlow: string;
};

// Camera, hero and data state for one shot at local frame `f`.
const plan = (index: number, shot: Shot, f: number): Plan => {
  const t = f / FPS;
  const g = shot.start / FPS + t;
  const never = 1e9;
  const base: Plan = {pos: [0, 0, 0], target: [0, 0, 0], heroZ: null, mood: 'calm', talking: false, beaconsOn: never, packetsOn: never, level: 0, pins: [], server: false, phoneGlow: '#e03c3c'};
  if (index === 0) {
    const z = heroZ(0, t, g);
    return {...base, heroZ: z, pos: [HERO_X + 1.4, 4.0, z + 10.5], target: [HERO_X + 0.4, 1.4, z - 16], fov: 55};
  }
  if (index === 1 || index === 5) {
    const z = heroZ(120, t, g);
    const macam = cue(shot, 'Macam', 3.2);
    const drift = Math.sin(t * 0.8) * 0.06;
    const push = index === 1 ? interpolate(f, [macam - 4, macam + 8], [0, 0.6], clamp) : 0;
    const mood: Mood = index === 1 ? (f >= macam ? 'shock' : 'calm') : f < cue(shot, 'tolong', 3) ? 'think' : 'happy';
    const talking = index === 1 && f < macam - 2;
    return {...base, heroZ: z, mood, talking, pos: [HERO_X + 0.4 + drift, 1.66, z - 4.3 + push], target: [HERO_X + 0.4, 1.38, z + 0.2], fov: 40, phoneGlow: index === 5 ? '#36a86b' : '#e03c3c'};
  }
  if (index === 2) {
    const z = heroZ(-124, t, g);
    const k = ease(interpolate(t, [0.2, 2.6], [0, 1], clamp));
    const from: V3 = [HERO_X + 2.4, 3.6, z + 9];
    const to: V3 = [38, 72, -215];
    const tFrom: V3 = [HERO_X, 1.2, z - 12];
    const tTo: V3 = [0, 4, -345];
    return {
      ...base,
      heroZ: z,
      pos: lerp3(from, to, k),
      target: lerp3(tFrom, tTo, k),
      fov: 52,
      beaconsOn: shot.start / FPS + cue(shot, 'telefon', 1.2) / FPS,
      packetsOn: shot.start / FPS + cue(shot, 'hantar', 5.0) / FPS,
      server: true,
    };
  }
  if (index === 3) {
    const a = -0.5 + t * 0.06;
    const lv = f < cue(shot, 'ramai', 0.6) ? 0 : f < cue(shot, 'perlahan', 1.4) ? 0.5 : f < cue(shot, 'merah', 6) ? 1.5 : 2.5;
    return {...base, heroZ: heroZ(-124, t + 8, g), pos: [Math.sin(a) * 60, 64, -330 + Math.cos(a) * 75], target: [0, 2, -345], fov: 50, beaconsOn: 0, packetsOn: 0, level: lv, server: true};
  }
  // index 4: reports
  const at = shot.start / FPS;
  return {
    ...base,
    heroZ: null,
    pos: [-30 + t * 2, 34, -270],
    target: [0, 2, -345],
    fov: 50,
    beaconsOn: 0,
    packetsOn: 1e9,
    level: 2.5,
    server: false,
    pins: [
      {x: 3.6, z: -362, color: '#e03c3c', at: at + cue(shot, 'kemalangan', 2.2) / FPS},
      {x: -3.6, z: -395, color: '#f4a51c', at: at + cue(shot, 'halangan', 3.2) / FPS},
      {x: 0, z: -330, color: '#1265c8', at: at + cue(shot, 'halangan', 3.2) / FPS + 0.5},
    ],
  };
};

const Scene3D: React.FC<{index: number}> = ({index}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const shot = SHOTS[index];
  const p = plan(index, shot, frame);
  const t = frame / FPS;
  const g = shot.start / FPS + t;
  return (
    <ThreeCanvas width={width} height={height}>
      <CameraRig pos={p.pos} target={p.target} fov={p.fov} />
      <World />
      <Traffic t={g} />
      {p.heroZ !== null ? (
        <group position={[HERO_X, 0, p.heroZ]}>
          <HeroCar mood={p.mood} t={g} talking={p.talking} phoneGlow={p.phoneGlow} />
        </group>
      ) : null}
      <RoadStatus level={p.level} />
      <Beacons t={g} on={p.beaconsOn} />
      <Packets t={g} on={p.packetsOn} />
      {p.server ? <CloudServer t={g} /> : null}
      <Pins t={g} pins={p.pins} />
    </ThreeCanvas>
  );
};

// 2D layer for each shot: captions, punch lines, phone map, chips, HUD.
const Overlay: React.FC<{index: number}> = ({index}) => {
  const frame = useCurrentFrame();
  const shot = SHOTS[index];
  if (index === 0) {
    const wazeAt = cue(shot, 'Waze', 2.0) - 4;
    const kmh = 89 + Math.sin(frame / 9) * 1.2;
    return (
      <>
        <Speedo kmh={kmh} />
        <PhoneMap at={wazeAt} x={590} y={230} level={2.5} banner="Sesak di hadapan • +12 min" scale={0.95} />
        <Captions shot={shot} y={1240} />
      </>
    );
  }
  if (index === 1) {
    const macam = cue(shot, 'Macam', 3.2);
    return frame < macam ? <Captions shot={shot} y={1300} /> : <Punch text={'MACAM MANA\nDIA TAHU?'} at={macam} y={1200} />;
  }
  if (index === 2) {
    return (
      <>
        <Chip text="SETIAP TELEFON = SENSOR" at={cue(shot, 'telefon', 1.2) + 10} x={60} y={250} bg="#65c7f4" dot="#1265c8" size={42} />
        <Chip text="LOKASI + KELAJUAN" at={cue(shot, 'hantar', 5)} x={60} y={350} bg="#ffd23f" dot="#f4a51c" size={42} />
        <Chip text="TANPA NAMA" at={cue(shot, 'tanpa', 7)} x={60} y={450} bg="#ffffff" dot="#36a86b" size={42} />
        <Captions shot={shot} y={1240} />
      </>
    );
  }
  if (index === 3) {
    return (
      <>
        <Chip text="PURATA: 9 km/j" at={cue(shot, 'purata', 4)} x={60} y={250} bg="#ffd23f" dot="#f4a51c" size={44} />
        <Chip text="JALAN SESAK!" at={cue(shot, 'merah', 6)} x={60} y={350} bg="#ff8a8a" dot="#e03c3c" size={44} />
        <Captions shot={shot} y={1240} />
      </>
    );
  }
  if (index === 4) {
    return (
      <>
        <Chip text="KEMALANGAN" at={cue(shot, 'kemalangan', 2.2)} x={60} y={250} bg="#ff8a8a" dot="#e03c3c" />
        <Chip text="HALANGAN" at={cue(shot, 'halangan', 3.2)} x={60} y={340} bg="#ffd27a" dot="#f4a51c" />
        <Chip text="POLIS" at={cue(shot, 'halangan', 3.2) + 15} x={60} y={430} bg="#9cc3ff" dot="#1265c8" />
        <Chip text="DATA LAMA → RAMAL MASA SAMPAI" at={cue(shot, 'Data', 4.4)} x={60} y={540} bg="#ffffff" dot="#7b4fc9" size={34} />
        <Captions shot={shot} y={1240} />
      </>
    );
  }
  const komen = cue(shot, 'Komen', 7.6);
  const korang = cue(shot, 'Korang', 5.6);
  return (
    <>
      <PhoneMap at={6} x={600} y={220} level={2.5} reroute={cue(shot, 'tolong', 3)} banner="Sesak di hadapan • +12 min" scale={0.85} />
      {frame < korang ? <Captions shot={shot} y={1300} /> : null}
      {frame >= korang && frame < komen ? <Punch text={'KORANG SELALU\nJEM KAT MANA?'} at={korang} y={1220} color="#ffffff" size={86} /> : null}
      <Punch text="KOMEN BAWAH!" at={komen} y={1240} size={100} />
    </>
  );
};

const SFX: React.FC<{index: number}> = ({index}) => {
  const shot = SHOTS[index];
  const cues: [number, string][] = [[0, 'whoosh']];
  if (index === 0) cues.push([cue(shot, 'Waze', 2) - 4, 'notify']);
  if (index === 1) cues.push([cue(shot, 'Macam', 3.2), 'jump']);
  if (index === 2) cues.push([cue(shot, 'telefon', 1.2), 'link'], [cue(shot, 'hantar', 5), 'blip']);
  if (index === 3) cues.push([cue(shot, 'merah', 6), 'alert']);
  if (index === 4) cues.push([cue(shot, 'kemalangan', 2.2), 'pop'], [cue(shot, 'halangan', 3.2), 'pop']);
  if (index === 5) cues.push([cue(shot, 'tolong', 3), 'success'], [cue(shot, 'Komen', 7.6), 'coin']);
  return (
    <>
      {shot.audio.map((a, i) => (
        <Sequence key={`vo${i}`} from={a.from} name="VO">
          <Audio src={staticFile(a.src)} />
        </Sequence>
      ))}
      {cues.map(([f, name], i) => (
        <Sequence key={i} from={Math.max(0, f)} durationInFrames={FPS} name={`SFX ${name}`}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={0.35} />
        </Sequence>
      ))}
    </>
  );
};

const ShotView: React.FC<{index: number}> = ({index}) => {
  const frame = useCurrentFrame();
  // Quick white flash at each cut, like the reference edit.
  const flash = interpolate(frame, [0, 5], [0.6, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#9cc3ff'}}>
      <Scene3D index={index} />
      <AbsoluteFill>
        <Overlay index={index} />
      </AbsoluteFill>
      {index > 0 ? <AbsoluteFill style={{background: '#fff', opacity: flash}} /> : null}
      <SFX index={index} />
    </AbsoluteFill>
  );
};

export const WazeShot: React.FC<{index: number}> = ({index}) => <ShotView index={index} />;

export const WazeVideo: React.FC = () => {
  const music = (f: number) =>
    interpolate(f, [0, 10, TOTAL_FRAMES - 40, TOTAL_FRAMES], [0, 0.11, 0.11, 0], clamp);
  return (
    <AbsoluteFill>
      {SHOTS.map((s, i) => (
        <Sequence key={s.id} from={s.start} durationInFrames={s.frames} name={s.id}>
          <ShotView index={i} />
        </Sequence>
      ))}
      <Audio src={staticFile('audio/music/bgm-shorts.wav')} loop volume={music} />
    </AbsoluteFill>
  );
};
