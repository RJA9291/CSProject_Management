import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {cue, FPS, makeTimeline, ScriptShot, Shot, Timing} from '../lib/timeline';
import {Captions, Chip, Punch} from '../waze/ui/Overlays';
import {Alu, Chibi, Face, Look, LOOKS, Pose} from '../santubong/world/Chibi';
import {Hut, Land, Mood} from '../santubong/world/Land';
import script from './script.json';
import timings from './timings.json';
import {Baby, BigTree, ChiefHouse, Field, IslandHills, Keris, Makam, Modern, PadiField, WhiteLight} from './world/Sets';

export const {SHOTS, TOTAL_FRAMES} = makeTimeline(script.shots as ScriptShot[], timings as Record<string, Timing>, 'audio/mahsuri/vo', script.say as Record<string, string>);

type V3 = [number, number, number];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const ramp = (f: number, a: number, b: number) => ease(interpolate(f, [a, b], [0, 1], clamp));

// Original characters on the shared chibi rig.
const MAHSURI: Look = {skin: '#f2c29b', hair: '#1a1416', outfit: '#f4f1ea', trim: '#65c7f4', long: true, crown: null, skirt: true};
const DARUS: Look = {skin: '#e3b088', hair: '#141414', outfit: '#102f69', trim: '#f4c430', crown: 'tengkolok'};
const DATUK: Look = {skin: '#d9a47a', hair: '#2a2a2a', outfit: '#7a1f2b', trim: '#f4c430', crown: 'tengkolok', scale: 1.05};
const MAHORA: Look = {skin: '#e9b78c', hair: '#1a1416', outfit: '#7b4fc9', trim: '#f4c430', long: true, crown: null, skirt: true};
const DERAMANG: Look = {skin: '#d9a47a', hair: '#1b1b1b', outfit: '#36a86b', trim: '#c9a06a', crown: null};
const AYAH: Look = {...LOOKS.villagerC, scale: 0.95};
const IBU: Look = {...LOOKS.villagerB, scale: 0.95};

const CameraRig: React.FC<{pos: V3; target: V3; fov?: number}> = ({pos, target, fov = 45}) => {
  const {camera} = useThree();
  camera.position.set(...pos);
  camera.lookAt(...target);
  const cam = camera as unknown as {fov: number; far: number; near: number; updateProjectionMatrix: () => void};
  cam.fov = fov;
  cam.far = 4000;
  cam.near = 0.1;
  cam.updateProjectionMatrix();
  return null;
};

type Hold = 'baby' | 'spear' | 'keris';
type Actor = {key: string; look: Look; pos: V3; rotY?: number; face?: Face; pose?: Pose; talking?: boolean; hearts?: boolean; hold?: Hold; walk?: boolean; hidden?: boolean};
type Plan = {
  mood: Mood;
  set: 'island' | 'kampung' | 'chief' | 'field' | 'padi' | 'modern';
  pos: V3;
  target: V3;
  fov?: number;
  far?: boolean;
  actors: Actor[];
  light?: {pos: V3; v: number};
  fire?: number;
  flash?: number;
};
const BASE: Plan = {mood: 'day', set: 'kampung', pos: [0, 3.5, 14], target: [0, 2, 0], actors: []};

const VILLAGERS = (face: Face, pose: Pose = 'idle', rot = 0): Actor[] => [
  {key: 'v1', look: LOOKS.villagerA, pos: [-5, 0, 3.5], rotY: 0.5 + rot, face, pose},
  {key: 'v2', look: LOOKS.villagerB, pos: [-6.5, 0, 1], rotY: 0.6 + rot, face, pose},
  {key: 'v3', look: LOOKS.villagerC, pos: [5, 0, 3.5], rotY: -0.5 - rot, face, pose},
  {key: 'v4', look: LOOKS.villagerA, pos: [6.5, 0, 1], rotY: -0.6 - rot, face, pose},
];

const strike = (f: number, at: number) => (f >= at ? Math.exp(-(f - at) / 4) : 0);

const plan = (i: number, shot: Shot, f: number): Plan => {
  const t = (shot.start + f) / FPS;
  const c = (w: string, fb: number, nth = 0) => cue(shot, w, fb, nth);
  const k = ramp(f, 0, shot.frames);
  switch (i) {
    case 0:
      return {...BASE, mood: 'dusk', set: 'island', far: true, pos: lerp3([-30, 34, 240], [0, 24, 160], k), target: [0, 16, -80], fov: 46};
    case 1:
      return {
        ...BASE,
        pos: lerp3([0, 4.4, 17], [0, 3.4, 11], k),
        target: [0, 2.1, 0],
        actors: [
          {key: 'mahsuri', look: MAHSURI, pos: [0, 0, 1.2], face: 'happy'},
          {key: 'ayah', look: AYAH, pos: [-2.4, 0, 0.6], rotY: 0.3, face: 'happy', hidden: f < c('Keluarganya', 4)},
          {key: 'ibu', look: IBU, pos: [2.4, 0, 0.6], rotY: -0.3, face: 'happy', hidden: f < c('Keluarganya', 4)},
        ],
      };
    case 2:
      return {
        ...BASE,
        set: 'chief',
        pos: [0, 3.6, 13],
        target: [0, 2.4, 0],
        actors: [
          {key: 'mahsuri', look: MAHSURI, pos: [-1.2, 0, 2], rotY: 0.3, face: 'love', hearts: true},
          {key: 'darus', look: DARUS, pos: [1.2, 0, 2], rotY: -0.3, face: 'love', hearts: true},
          {key: 'datuk', look: DATUK, pos: [3.6, 0, -0.8], rotY: -0.4, face: 'happy', hidden: f < c('Datuk', 2.5)},
        ],
      };
    case 3: {
      const close = c('cemburu', 6);
      return {
        ...BASE,
        set: 'chief',
        pos: f < close - 4 ? [0, 3.6, 13] : [3.2, 2.7, 6.6],
        target: f < close - 4 ? [0, 2.4, 0] : [2.4, 2.3, 1.5],
        actors: [
          {key: 'mahsuri', look: MAHSURI, pos: [-2.2, 0, 0.8], face: 'happy'},
          {key: 'v1', look: LOOKS.villagerA, pos: [-4, 0, 2], rotY: -0.6, face: 'happy'},
          {key: 'v2', look: LOOKS.villagerC, pos: [-0.4, 0, 2.6], rotY: 0.5, face: 'happy'},
          {key: 'mahora', look: MAHORA, pos: [2.4, 0, 1.5], rotY: -0.5, face: f >= close - 10 ? 'angry' : 'calm', pose: f >= close ? 'angry' : 'idle'},
        ],
      };
    }
    case 4: {
      const go = ramp(f, c('pergi', 1.4), c('Mahsuri', 4) + 10);
      return {
        ...BASE,
        pos: [0, 3.4, 12],
        target: [0.5, 2.2, 0],
        actors: [
          {key: 'darus', look: DARUS, pos: [1.2 + go * 10, 0, 1.6], rotY: go > 0 && go < 1 ? Math.PI / 2 : -0.3, face: 'sad', hold: 'spear', walk: go > 0 && go < 1, hidden: go >= 1},
          {key: 'mahsuri', look: MAHSURI, pos: [-1.2, 0, 1.6], rotY: 0.3, face: 'sad', hold: 'baby'},
        ],
      };
    }
    case 5: {
      const comes = ramp(f, c('pengembara', 1.6) - 10, c('pengembara', 1.6) + 30);
      return {
        ...BASE,
        pos: [0, 3.5, 13],
        target: [0, 2.2, 0],
        actors: [
          {key: 'deramang', look: DERAMANG, pos: [-10 + comes * 7.6, 0, 1.6], rotY: comes < 1 ? Math.PI / 2 : 0.3, face: 'happy', walk: comes < 1, talking: f >= c('bersyair', 4) && f < c('Dia', 5)},
          {key: 'mahsuri', look: MAHSURI, pos: [0.8, 0, 1.6], rotY: -0.3, face: 'happy', pose: f >= c('melayannya', 7) ? 'wave' : 'idle'},
          {key: 'ayah', look: AYAH, pos: [2.8, 0, 0.4], rotY: -0.4, face: 'happy'},
          {key: 'ibu', look: IBU, pos: [4.4, 0, 0.8], rotY: -0.5, face: 'happy'},
        ],
      };
    }
    case 6:
      return {
        ...BASE,
        mood: 'dusk',
        pos: [0, 3.8, 14],
        target: [0, 2.2, 1],
        actors: [
          {key: 'mahora', look: MAHORA, pos: [0, 0, 1.6], face: 'angry', talking: true, pose: 'point'},
          ...VILLAGERS(f >= c('curang', 3) ? 'shock' : 'calm', 'idle', 0.3).map((v) => ({...v, pos: [v.pos[0] * 0.6, 0, v.pos[2]] as V3})),
        ],
      };
    case 7:
      return {
        ...BASE,
        set: 'chief',
        mood: 'dusk',
        pos: [4.5, 3.6, 12],
        target: [0, 2, 0.8],
        actors: [
          {key: 'datuk', look: DATUK, pos: [1.6, 0, -0.5], rotY: -0.7, face: 'angry', pose: 'point'},
          {key: 'mahsuri', look: MAHSURI, pos: [-1.6, 0, 2.2], rotY: 0.9, face: 'sad', pose: f >= c('bersumpah', 6) ? 'idle' : 'kneel'},
          ...VILLAGERS('shock'),
        ],
      };
    case 8: {
      const lut = c('lut', 2.4);
      const keris = c('kerisnya', 6);
      return {
        ...BASE,
        set: 'field',
        mood: 'dusk',
        pos: [0, 3.2, 10],
        target: [0, 2.3, -1],
        flash: strike(f, lut) * 0.5,
        actors: [
          {key: 'mahsuri', look: MAHSURI, pos: [0, 0, -1.2], face: 'sad', hold: f >= keris ? 'keris' : undefined},
          {key: 'g1', look: LOOKS.villagerA, pos: [-2.6, 0, 1], rotY: 0.7, face: f >= lut ? 'shock' : 'angry', hold: 'spear'},
          {key: 'g2', look: LOOKS.villagerC, pos: [2.6, 0, 1], rotY: -0.7, face: f >= lut ? 'shock' : 'angry', hold: 'spear'},
        ],
      };
    }
    case 9: {
      const white = c('darah', 1.8);
      return {
        ...BASE,
        set: 'field',
        mood: 'dusk',
        pos: lerp3([0, 3.2, 10], [0, 3, 8], k),
        target: [0, 2.3, -1],
        light: {pos: [0, 0, -1.2], v: f >= white ? Math.min(1, (f - white) / 15) : 0},
        flash: strike(f, white) * 0.6,
        actors: [
          {key: 'mahsuri', look: MAHSURI, pos: [0, 0, -1.2], face: 'sad'},
          {key: 'g1', look: LOOKS.villagerA, pos: [-2.6, 0, 1], rotY: 0.7, face: f >= white ? 'shock' : 'calm'},
          {key: 'g2', look: LOOKS.villagerC, pos: [2.6, 0, 1], rotY: -0.7, face: f >= white ? 'shock' : 'calm'},
          {key: 'g3', look: LOOKS.villagerB, pos: [-4, 0, 3], rotY: 0.6, face: f >= white ? 'shock' : 'calm'},
          {key: 'g4', look: LOOKS.villagerA, pos: [4, 0, 3], rotY: -0.6, face: f >= white ? 'shock' : 'calm'},
        ],
      };
    }
    case 10: {
      const curse = c('Langkawi', 4);
      return {
        ...BASE,
        set: 'field',
        mood: 'storm',
        pos: f < curse ? [0, 3, 9] : [0, 2.6, 5.6],
        target: [0, 2.3, -1.2],
        light: {pos: [0, 0, -1.2], v: 0.8},
        flash: Math.max(strike(f, 4), strike(f, curse)) * 0.8,
        actors: [{key: 'mahsuri', look: MAHSURI, pos: [0, 0, -1.2], face: f >= curse ? 'angry' : 'sad', talking: f >= curse}],
      };
    }
    case 11: {
      const burn = interpolate(f, [c('membakar', 4.5), c('membakar', 4.5) + 20], [0, 1], clamp);
      return {...BASE, set: 'padi', mood: burn > 0 ? 'dusk' : 'day', pos: lerp3([0, 6, 22], [0, 4.5, 14], k), target: [0, 3, -2], fire: burn};
    }
    case 12:
      return {...BASE, mood: 'dusk', pos: lerp3([0, 3.4, 14], [0, 5, 20], k), target: [0, 2, 0], actors: VILLAGERS('sad').map((v) => ({...v, pos: [v.pos[0] * 0.7, 0, v.pos[2] - 1] as V3}))};
    case 13:
      return {...BASE, mood: 'day', set: 'modern', pos: f < c('Makam', 13) - 4 ? lerp3([0, 14, 70], [0, 10, 48], k) : [3, 3.4, 9], target: f < c('Makam', 13) - 4 ? [0, 4, -10] : [0, 0.8, 0]};
    default:
      return {
        ...BASE,
        mood: 'day',
        pos: lerp3([0, 3.5, 12], [0, 4.5, 17], k),
        target: [0, 2.2, 0],
        actors: [{key: 'mahsuri', look: MAHSURI, pos: [0, 0, 0.8], face: 'calm'}, ...VILLAGERS('calm').map((v) => ({...v, pos: [v.pos[0] * 0.6, 0, v.pos[2]] as V3}))],
      };
  }
};

const holdProp = (h?: Hold) => (h === 'baby' ? <Baby /> : h === 'spear' ? <Alu /> : h === 'keris' ? <Keris /> : undefined);

const Scene3D: React.FC<{index: number}> = ({index}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const shot = SHOTS[index];
  const p = plan(index, shot, frame);
  const t = (shot.start + frame) / FPS;
  const coast = p.set === 'island' || p.set === 'kampung' || p.set === 'chief' || p.set === 'modern';
  return (
    <ThreeCanvas width={width} height={height}>
      <CameraRig pos={p.pos} target={p.target} fov={p.fov} />
      <Land mood={p.mood} t={t} coast={coast} far={p.far} flash={p.flash ?? 0} />
      {p.set === 'island' || p.set === 'modern' ? <IslandHills /> : null}
      {p.set === 'kampung' ? (
        <>
          <Hut x={0} z={-9} wall="#c9a06a" />
          <Hut x={-13} z={-15} rot={0.4} wall="#b8935e" />
          <Hut x={13} z={-16} rot={-0.4} wall="#c7a271" />
        </>
      ) : null}
      {p.set === 'chief' ? <ChiefHouse x={0} z={-9} /> : null}
      {p.set === 'field' ? (
        <>
          <Field />
          <BigTree x={0} z={-3.2} />
        </>
      ) : null}
      {p.set === 'padi' ? <PadiField t={t} fire={p.fire ?? 0} /> : null}
      {p.set === 'modern' ? (
        <>
          <Modern t={t} />
          <Makam x={0} z={0} />
        </>
      ) : null}
      {p.light ? <WhiteLight pos={p.light.pos} v={p.light.v} t={t} /> : null}
      {p.actors.map((a) => {
        if (a.hidden) return null;
        const bob = a.walk ? Math.abs(Math.sin(t * 8)) * 0.08 : 0;
        return (
          <group key={a.key} position={[a.pos[0], a.pos[1] + bob, a.pos[2]]} rotation={[0, a.rotY ?? 0, a.walk ? Math.sin(t * 8) * 0.04 : 0]}>
            <Chibi look={a.look} t={t} face={a.face} pose={a.pose} talking={a.talking} hearts={a.hearts} holdRight={holdProp(a.hold)} />
          </group>
        );
      })}
    </ThreeCanvas>
  );
};

const Overlay: React.FC<{index: number}> = ({index}) => {
  const frame = useCurrentFrame();
  const shot = SHOTS[index];
  const c = (w: string, fb: number, nth = 0) => cue(shot, w, fb, nth);
  const caps = <Captions shot={shot} y={1250} />;
  switch (index) {
    case 0:
      return (
        <>
          <Punch text={'KENAPA MAHSURI\nDIKATAKAN MENYUMPAH\nLANGKAWI?'} at={6} y={220} size={80} />
          {caps}
        </>
      );
    case 1:
      return (
        <>
          <Chip text="MAHSURI" at={c('Mahsuri', 0.6)} x={60} y={260} bg="#ffffff" dot="#65c7f4" size={40} />
          <Chip text="KELUARGA DARI PHUKET" at={c('Phuket', 5)} x={60} y={350} bg="#ffd23f" dot="#f4a51c" size={38} />
          {caps}
        </>
      );
    case 2:
      return (
        <>
          <Chip text="WAN DARUS • SUAMI" at={c('Wan', 0.8)} x={60} y={260} bg="#9cc3ff" dot="#102f69" size={38} />
          <Chip text="DATUK PEKERMA JAYA • PEMBESAR" at={c('Datuk', 2.5)} x={60} y={350} bg="#ffd23f" dot="#7a1f2b" size={34} />
          {caps}
        </>
      );
    case 3:
      return (
        <>
          <Chip text="WAN MAHORA • CEMBURU" at={c('Mahora', 2)} x={60} y={260} bg="#d9c4ff" dot="#7b4fc9" size={38} />
          {caps}
        </>
      );
    case 4:
      return (
        <>
          <Chip text="PERANG MELAWAN SIAM" at={c('berperang', 1.4)} x={60} y={260} bg="#ff8a8a" dot="#c93434" size={38} />
          {caps}
        </>
      );
    case 5:
      return (
        <>
          <Chip text="DERAMANG • PENGEMBARA" at={c('Deramang', 2)} x={60} y={260} bg="#b8f0c8" dot="#36a86b" size={38} />
          <Chip text="TETAMU DILAYAN BAIK" at={c('tetamu', 8)} x={60} y={350} bg="#ffffff" dot="#36a86b" size={38} />
          {caps}
        </>
      );
    case 6: {
      const tint = interpolate(frame, [0, 20], [0, 0.6], clamp);
      return (
        <>
          <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 40%, rgba(201,52,52,1) 125%)', opacity: tint}} />
          <Punch text="FITNAH!" at={c('fitnah', 1)} y={300} size={150} color="#ffffff" />
          {caps}
        </>
      );
    }
    case 7:
      return (
        <>
          <Chip text="TANPA SIASATAN ADIL" at={c('adil', 1.4)} x={60} y={260} bg="#ff8a8a" dot="#c93434" size={38} />
          {caps}
        </>
      );
    case 8:
      return (
        <>
          <Chip text="TIDAK LUT (LEGENDA)" at={c('lut', 2.4)} x={60} y={260} bg="#ffffff" dot="#7b4fc9" size={38} />
          <Chip text="KERISNYA SENDIRI" at={c('kerisnya', 6)} x={60} y={350} bg="#ffd23f" dot="#c9a020" size={38} />
          {caps}
        </>
      );
    case 9:
      return (
        <>
          <Chip text="DARAH PUTIH = TIDAK BERSALAH" at={c('putih', 2)} x={60} y={260} bg="#ffffff" dot="#65c7f4" size={36} />
          {caps}
        </>
      );
    case 10: {
      const curse = c('Langkawi', 4);
      return frame < curse ? caps : <Punch text={'"TUJUH\nKETURUNAN!"'} at={curse} y={1180} size={120} color="#ffd23f" />;
    }
    case 11:
      return (
        <>
          <Chip text="SIAM MENYERANG KEDAH" at={c('Siam', 1)} x={60} y={260} bg="#ff8a8a" dot="#c93434" size={38} />
          <Chip text="PADANG MAT SIRAT" at={c('Padang', 5)} x={60} y={350} bg="#ffd23f" dot="#8fae4a" size={38} />
          <Chip text="BERAS TERBAKAR (CERITA RAKYAT)" at={c('beras', 9)} x={60} y={440} bg="#ffffff" dot="#3a2a20" size={34} />
          {caps}
        </>
      );
    case 12:
      return (
        <>
          <Chip text="PERANG" at={c('perang', 4)} x={60} y={260} bg="#ffffff" dot="#c93434" size={40} />
          <Chip text="KEMUSNAHAN" at={c('kemusnahan', 5)} x={60} y={350} bg="#ffffff" dot="#c93434" size={40} />
          <Chip text="LAMBAT MAJU" at={c('maju', 6)} x={60} y={440} bg="#ffffff" dot="#c93434" size={40} />
          <Chip text="= DILIHAT SEBAGAI BUKTI SUMPAHAN" at={c('bukti', 8)} x={60} y={540} bg="#ffd23f" dot="#7b4fc9" size={32} />
          {caps}
        </>
      );
    case 13:
      return (
        <>
          <Chip text="FAKTA SEJARAH" at={6} x={60} y={250} bg="#b8f0c8" dot="#36a86b" size={40} />
          <Chip text="1821 • SIAM SERANG KEDAH" at={c('1821', 4)} x={60} y={340} bg="#ffffff" dot="#c93434" size={36} />
          <Chip text="1987 • PULAU BEBAS CUKAI" at={c('1987', 10)} x={60} y={430} bg="#ffffff" dot="#1265c8" size={36} />
          <Chip text="MAKAM MAHSURI, LANGKAWI" at={c('Makam', 13)} x={60} y={520} bg="#ffffff" dot="#d9b76a" size={36} />
          {caps}
        </>
      );
    case 14: {
      const lesson = c('Pengajarannya', 3);
      return (
        <>
          <Chip text="LEGENDA • BUKAN FAKTA SEJARAH" at={6} x={60} y={250} bg="#ffffff" dot="#7b4fc9" size={36} />
          {frame >= lesson + 20 ? <Punch text={'JANGAN SEBAR\nFITNAH!'} at={lesson + 20} y={330} size={110} color="#ffd23f" /> : null}
          {caps}
        </>
      );
    }
    default:
      return caps;
  }
};

const SFX: React.FC<{index: number}> = ({index}) => {
  const shot = SHOTS[index];
  const c = (w: string, fb: number, nth = 0) => cue(shot, w, fb, nth);
  const list: [number, string][] = [[0, 'whoosh']];
  if (index === 0) list.push([6, 'sparkle']);
  if (index === 2) list.push([c('Wan', 0.8), 'sparkle']);
  if (index === 3) list.push([c('cemburu', 6), 'buzz']);
  if (index === 6) list.push([c('fitnah', 1), 'alert']);
  if (index === 8) list.push([c('lut', 2.4), 'jump']);
  if (index === 9) list.push([c('darah', 1.8), 'sparkle']);
  if (index === 10) list.push([4, 'thunder'], [c('Langkawi', 4), 'thunder']);
  if (index === 11) list.push([c('membakar', 4.5), 'smash']);
  if (index === 13) list.push([6, 'success']);
  if (index === 14) list.push([c('Pengajarannya', 3) + 20, 'pop']);
  return (
    <>
      {shot.audio.map((a, k) => (
        <Sequence key={`vo${k}`} from={a.from} name="VO">
          <Audio src={staticFile(a.src)} />
        </Sequence>
      ))}
      {list.map(([f, name], k) => (
        <Sequence key={k} from={Math.max(0, f)} durationInFrames={FPS * 2} name={`SFX ${name}`}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={name === 'thunder' || name === 'smash' ? 0.4 : 0.3} />
        </Sequence>
      ))}
    </>
  );
};

const ShotView: React.FC<{index: number}> = ({index}) => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 5], [0.5, 0], clamp);
  return (
    <AbsoluteFill style={{background: '#4a4f9c'}}>
      <Scene3D index={index} />
      <AbsoluteFill>
        <Overlay index={index} />
      </AbsoluteFill>
      {index > 0 ? <AbsoluteFill style={{background: '#fff', opacity: flash}} /> : null}
      <SFX index={index} />
    </AbsoluteFill>
  );
};

export const MahsuriShot: React.FC<{index: number}> = ({index}) => <ShotView index={index} />;

export const MahsuriVideo: React.FC = () => {
  const music = (f: number) => interpolate(f, [0, 15, TOTAL_FRAMES - 45, TOTAL_FRAMES], [0, 0.09, 0.09, 0], clamp);
  return (
    <AbsoluteFill>
      {SHOTS.map((s, i) => (
        <Sequence key={s.id} from={s.start} durationInFrames={s.frames} name={s.id}>
          <ShotView index={i} />
        </Sequence>
      ))}
      <Audio src={staticFile('audio/music/bgm-legend.wav')} loop volume={music} />
    </AbsoluteFill>
  );
};
