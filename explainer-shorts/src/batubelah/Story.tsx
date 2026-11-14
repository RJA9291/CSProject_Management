import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {cue, FPS, makeTimeline, ScriptShot, Shot, Timing} from '../lib/timeline';
import {Captions, Chip, Punch} from '../waze/ui/Overlays';
import {Chibi, Face, Look, Pose} from '../santubong/world/Chibi';
import {Hut, Land, Mood} from '../santubong/world/Land';
import script from './script.json';
import timings from './timings.json';
import {Basket, BatuBelah, Hair, Jungle, RoeBowl, ROCK_POS, Swamp, Tears} from './world/Sets';

export const {SHOTS, TOTAL_FRAMES} = makeTimeline(script.shots as ScriptShot[], timings as Record<string, Timing>, 'audio/batubelah/vo');

type V3 = [number, number, number];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const ramp = (f: number, a: number, b: number) => ease(interpolate(f, [a, b], [0, 1], clamp));

// Original characters (same chibi rig as the Santubong video).
const MAK: Look = {skin: '#e3b088', hair: '#2a2420', outfit: '#8c5a3c', trim: '#d9b76a', long: true, crown: null, skirt: true};
const MELUR: Look = {skin: '#efbd92', hair: '#1a1416', outfit: '#d9578a', trim: '#ffffff', long: true, crown: null, skirt: true, scale: 0.72};
const PEKAN: Look = {skin: '#f2c29b', hair: '#1a1416', outfit: '#65c7f4', trim: '#1265c8', crown: null, scale: 0.55};

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

type Actor = {key: string; look: Look; pos: V3; rotY?: number; face?: Face; pose?: Pose; talking?: boolean; tears?: boolean; basket?: boolean; walk?: boolean; scale?: number; hidden?: boolean};
type Plan = {
  mood: Mood;
  set: 'kampung' | 'swamp' | 'jungle';
  pos: V3;
  target: V3;
  fov?: number;
  actors: Actor[];
  bowl?: {pos: V3; left: number};
  rockOpen: number;
  rockGlow: number;
  hair: boolean;
};
const BASE: Plan = {mood: 'day', set: 'kampung', pos: [0, 3.5, 14], target: [0, 2, 0], actors: [], rockOpen: 0, rockGlow: 0, hair: false};

const MAK_AT: V3 = [0, 0, 1];
const MELUR_AT: V3 = [-2.1, 0, 1.6];
const PEKAN_AT: V3 = [2, 0, 1.8];

const plan = (i: number, shot: Shot, f: number): Plan => {
  const t = (shot.start + f) / FPS;
  const c = (w: string, fb: number, nth = 0) => cue(shot, w, fb, nth);
  const k = ramp(f, 0, shot.frames);
  switch (i) {
    case 0: {
      const breathe = (Math.sin(t * 1.3) + 1) / 2;
      return {...BASE, mood: 'dusk', set: 'jungle', pos: lerp3([0, 6, 30], [0, 4.2, 17], k), target: [0, 3, ROCK_POS[2]], fov: 46, rockOpen: f >= c('terbuka', 3) ? breathe : 0, rockGlow: f >= c('terbuka', 3) ? breathe : 0};
    }
    case 1:
      return {...BASE, mood: 'dusk', set: 'jungle', pos: lerp3([6, 4, 12], [3, 3.4, 9], k), target: [0, 3, ROCK_POS[2]], fov: 44, rockOpen: 0.15 + 0.1 * Math.sin(t * 2), rockGlow: 0.5};
    case 2:
      return {
        ...BASE,
        mood: 'day',
        pos: lerp3([0, 4.5, 18], [0, 3.4, 12], k),
        target: [0, 2.1, 0],
        fov: 46,
        actors: [
          {key: 'mak', look: MAK, pos: MAK_AT, face: 'calm', hidden: f < c('Tanjung', 2) - 6},
          {key: 'melur', look: MELUR, pos: MELUR_AT, face: 'happy', rotY: 0.2, hidden: f < c('Melur', 6) - 6},
          {key: 'pekan', look: PEKAN, pos: PEKAN_AT, face: 'happy', rotY: -0.2, hidden: f < c('Pekan', 8) - 6},
        ],
      };
    case 3: {
      const x = -6 + k * 12;
      return {...BASE, mood: 'day', set: 'swamp', pos: [x * 0.6, 3.4, 11], target: [x, 1.8, 0], fov: 48, actors: [{key: 'mak', look: MAK, pos: [x, 0, 0], rotY: Math.PI / 2 - 0.5, face: 'sad', walk: true, basket: true}]};
    }
    case 4: {
      const fish = c('tembakul', 2.6);
      const glad = c('gembira', 11);
      const camK = ramp(f, glad - 30, glad);
      return {
        ...BASE,
        mood: 'day',
        set: 'swamp',
        pos: f < fish ? [0, 3.6, 12] : lerp3([0, 1.1, 8], [0, 3.2, 9], camK),
        target: f < fish ? [0, 2, 0] : lerp3([0, 0.4, 3], [0, 2, 0], camK),
        fov: 46,
        actors: [{key: 'mak', look: MAK, pos: [0, 0, -0.5], face: f >= glad ? 'happy' : 'calm', basket: f < c('Telurnya', 7)}],
        bowl: f >= c('Telurnya', 7) ? {pos: [0.6, 0, 1.2], left: 1} : undefined,
      };
    }
    case 5: {
      const mak = c('Melur,', 2.5);
      const nod = c('mengangguk', 11);
      return {
        ...BASE,
        mood: 'day',
        pos: [0.2, 3.2, 10],
        target: [-0.6, 2, 0.8],
        fov: 44,
        actors: [
          {key: 'mak', look: MAK, pos: [0.8, 0, 0.8], rotY: -0.5, face: 'calm', talking: f >= mak && f < nod - 6},
          {key: 'melur', look: MELUR, pos: [-1.6, 0, 1.4], rotY: 0.5, face: f >= nod ? 'happy' : 'calm'},
        ],
        bowl: {pos: [-0.4, 0, 2.4], left: 1},
      };
    }
    case 6: {
      const s1 = c('sedikit', 9);
      const s2 = c('lagi', 12);
      const s3 = c('lagi', 14, 1);
      const left = f < s1 ? 1 : f < s2 ? 0.7 : f < s3 ? 0.45 : 0.25;
      return {
        ...BASE,
        mood: 'day',
        pos: [0, 2.4, 7.5],
        target: [0, 1.4, 1],
        fov: 44,
        actors: [
          {key: 'melur', look: MELUR, pos: [-1.1, 0, 1.2], rotY: 0.4, face: 'sad'},
          {key: 'pekan', look: PEKAN, pos: [1, 0, 1.5], rotY: -0.3, face: f >= s1 ? 'happy' : 'sad', tears: f < s1, talking: f < s1},
        ],
        bowl: {pos: [0, 0, 2.4], left},
      };
    }
    case 7:
      return {
        ...BASE,
        mood: 'day',
        pos: [0, 2.6, 6.4],
        target: [0, 1.0, 2],
        fov: 42,
        actors: [
          {key: 'melur', look: MELUR, pos: [-1.1, 0, 1.2], rotY: 0.4, face: 'shock'},
          {key: 'pekan', look: PEKAN, pos: [1, 0, 1.5], rotY: -0.3, face: 'happy'},
        ],
        bowl: {pos: [0, 0, 2.4], left: 0},
      };
    case 8: {
      const walk = ramp(f, 0, c('mencari', 3));
      const found = c('habis', 6);
      return {
        ...BASE,
        mood: 'dusk',
        pos: [0, 3, 11],
        target: [0, 1.8, 1],
        fov: 46,
        actors: [
          {key: 'mak', look: MAK, pos: [-7 + walk * 6.4, 0, 1.4], rotY: walk < 1 ? Math.PI / 2 : 0.2, face: f >= found ? 'shock' : 'sad', walk: walk < 1, basket: true},
          {key: 'melur', look: MELUR, pos: [2.2, 0, 1.2], rotY: -0.4, face: 'sad'},
          {key: 'pekan', look: PEKAN, pos: [3.6, 0, 1.6], rotY: -0.4, face: 'sad'},
        ],
        bowl: {pos: [0.6, 0, 2.6], left: 0},
      };
    }
    case 9:
      return {
        ...BASE,
        mood: f > shot.frames * 0.5 ? 'night' : 'dusk',
        pos: lerp3([0, 3, 10], [0, 2.6, 6.2], k),
        target: [0, 2, 1],
        fov: 44,
        actors: [
          {key: 'mak', look: MAK, pos: MAK_AT, face: 'sad', tears: true},
          {key: 'melur', look: MELUR, pos: [-3, 0, -1], face: 'sad', rotY: 0.4},
          {key: 'pekan', look: PEKAN, pos: [3, 0, -1], face: 'sad', rotY: -0.4},
        ],
      };
    case 10: {
      const call = c('belah', 12, 1);
      const walk = ramp(f, 0, Math.max(30, call - 10));
      return {
        ...BASE,
        mood: 'night',
        set: 'jungle',
        pos: lerp3([7, 4, 16], [5, 3.4, 11], k),
        target: [0, 2.4, 0],
        fov: 46,
        rockGlow: f >= call ? Math.min(1, (f - call) / 20) : 0,
        actors: [{key: 'mak', look: MAK, pos: [0, 0, 8 - walk * 6], rotY: Math.PI, face: 'sad', walk: walk < 1, tears: f >= call - 10, talking: f >= call}],
      };
    }
    case 11: {
      const open = c('terbuka', 1);
      const masuk = c('masuk', 2.6);
      const tutup = c('tertutup', 4.6);
      const opening = interpolate(f, [open, open + 16], [0, 1], clamp) * (1 - interpolate(f, [tutup, tutup + 10], [0, 1], clamp));
      const inK = ramp(f, masuk, masuk + 28);
      return {
        ...BASE,
        mood: 'night',
        set: 'jungle',
        pos: [3, 3.4, 11],
        target: [0, 2.6, ROCK_POS[2] + 1],
        fov: 44,
        rockOpen: opening,
        rockGlow: f < tutup + 10 ? 1 : 0,
        actors: [{key: 'mak', look: MAK, pos: [0, 0, 2 - inK * 7], rotY: Math.PI, face: 'sad', walk: inK > 0 && inK < 1, scale: 1 - inK * 0.4, hidden: inK >= 0.98}],
      };
    }
    case 12: {
      const run = ramp(f, 0, c('terlambat', 5));
      const hair = c('rambut', 8);
      return {
        ...BASE,
        mood: 'night',
        set: 'jungle',
        pos: f < hair - 4 ? [0.5, 2.6, 11] : [0.8, 2.0, ROCK_POS[2] + 7.5],
        target: f < hair - 4 ? [0, 1.8, ROCK_POS[2] + 2] : [0, 1.3, ROCK_POS[2] + 2.85],
        fov: 44,
        hair: true,
        actors: [
          {key: 'melur', look: MELUR, pos: [-1, 0, 9 - run * 6.2], face: 'sad', tears: true, talking: true, walk: run < 1},
          {key: 'pekan', look: PEKAN, pos: [1, 0, 9.5 - run * 6.2], face: 'sad', tears: true, talking: true, walk: run < 1},
        ],
      };
    }
    case 13: {
      const a = 0.4 - k * 0.8;
      return {...BASE, mood: 'dusk', set: 'jungle', pos: [Math.sin(a) * 15, 4.5, ROCK_POS[2] + Math.cos(a) * 15], target: [0, 3, ROCK_POS[2]], fov: 46, rockOpen: f >= c('diseru', 8) && f < c('sesuka', 13) ? 0.4 : 0, rockGlow: f >= c('diseru', 8) ? 0.8 : 0.3};
    }
    case 14:
      return {...BASE, mood: 'night', pos: lerp3([0, 3.4, 12], [0, 2.4, 6], k), target: [0, 0.8, 2], fov: 44, bowl: {pos: [0, 0, 2.4], left: 0}};
    default: {
      return {
        ...BASE,
        mood: 'day',
        pos: lerp3([0, 3.4, 12], [0, 4.5, 18], k),
        target: [0, 2, 0],
        fov: 46,
        actors: [
          {key: 'melur', look: MELUR, pos: [-0.8, 0, 1.4], rotY: 0.2, face: 'calm'},
          {key: 'pekan', look: PEKAN, pos: [0.8, 0, 1.6], rotY: -0.2, face: 'calm'},
        ],
      };
    }
  }
};

const Scene3D: React.FC<{index: number}> = ({index}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const shot = SHOTS[index];
  const p = plan(index, shot, frame);
  const t = (shot.start + frame) / FPS;
  return (
    <ThreeCanvas width={width} height={height}>
      <CameraRig pos={p.pos} target={p.target} fov={p.fov} />
      <Land mood={p.mood} t={t} coast={p.set === 'kampung'} />
      {p.set === 'kampung' ? (
        <>
          <Hut x={0} z={-9} wall="#c9a06a" />
          <Hut x={-14} z={-16} rot={0.4} wall="#b8935e" />
          <Hut x={14} z={-17} rot={-0.4} wall="#c7a271" />
        </>
      ) : null}
      {p.set === 'swamp' ? <Swamp t={t} /> : null}
      {p.set === 'jungle' ? (
        <>
          <Jungle />
          <BatuBelah open={p.rockOpen} glow={p.rockGlow} t={t} />
          {p.hair ? <Hair /> : null}
        </>
      ) : null}
      {p.bowl ? (
        <group position={p.bowl.pos}>
          <RoeBowl left={p.bowl.left} />
        </group>
      ) : null}
      {p.actors.map((a) => {
        if (a.hidden) return null;
        const s = (a.scale ?? 1) * (a.look.scale ?? 1);
        const bob = a.walk ? Math.abs(Math.sin(t * 8)) * 0.08 : 0;
        const head: V3 = [a.pos[0], a.pos[1] + 2.2 * s + bob, a.pos[2]];
        return (
          <React.Fragment key={a.key}>
            <group position={[a.pos[0], a.pos[1] + bob, a.pos[2]]} rotation={[0, a.rotY ?? 0, a.walk ? Math.sin(t * 8) * 0.04 : 0]} scale={a.scale ?? 1}>
              <Chibi look={a.look} t={t} face={a.face} pose={a.pose} talking={a.talking} holdRight={a.basket ? <Basket /> : undefined} />
            </group>
            {a.tears ? <Tears head={head} t={t} scale={s} /> : null}
          </React.Fragment>
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
          <Punch text={'KENAPA BATU BELAH\nBATU BERTANGKUP\nMENELAN MANUSIA?'} at={6} y={220} size={84} />
          {caps}
        </>
      );
    case 1:
      return (
        <>
          <Punch text="KENAPA?" at={c('kenapa', 1)} y={300} size={140} color="#ffffff" />
          {caps}
        </>
      );
    case 2:
      return (
        <>
          <Chip text="MAK TANJUNG • IBU" at={c('Tanjung', 2)} x={60} y={260} bg="#ffd23f" dot="#8c5a3c" size={38} />
          <Chip text="MELUR • ANAK SULUNG" at={c('Melur', 6)} x={60} y={350} bg="#ffffff" dot="#d9578a" size={38} />
          <Chip text="PEKAN • ADIK KECIL" at={c('Pekan', 8)} x={60} y={440} bg="#9cc3ff" dot="#1265c8" size={38} />
          {caps}
        </>
      );
    case 4:
      return (
        <>
          <Chip text="IKAN TEMBAKUL" at={c('tembakul', 2.6)} x={60} y={260} bg="#ffd23f" dot="#8a7a5a" size={40} />
          <Chip text="PAYA BAKAU BERLUMPUR" at={c('paya', 6)} x={60} y={350} bg="#ffffff" dot="#3e7d45" size={38} />
          <Chip text="TELUR IKAN • JARANG DAPAT" at={c('Telurnya', 7)} x={60} y={440} bg="#ffb36b" dot="#f08a2b" size={38} />
          {caps}
        </>
      );
    case 7:
      return (
        <>
          <Punch text="HABIS!" at={c('habis', 2)} y={300} size={170} color="#ffffff" />
          {caps}
        </>
      );
    case 9:
      return (
        <>
          <Chip text="PENAT" at={c('bersusah', 8)} x={60} y={260} bg="#ffffff" dot="#7b4fc9" size={40} />
          <Chip text="TAK DIHARGAI" at={c('dihargai', 6)} x={60} y={350} bg="#ffd23f" dot="#c93434" size={40} />
          <Chip text="LAMA DIPENDAM" at={c('dipendam', 12)} x={60} y={440} bg="#9cc3ff" dot="#102f69" size={40} />
          {caps}
        </>
      );
    case 13:
      return (
        <>
          <Chip text="BATU AJAIB (LEGENDA)" at={c('ajaib', 4)} x={60} y={260} bg="#ffffff" dot="#7b4fc9" size={38} />
          <Chip text="TERBUKA BILA DISERU" at={c('diseru', 8)} x={60} y={350} bg="#ffd23f" dot="#f4a51c" size={38} />
          <Chip text="BUKAN SESUKA HATI" at={c('sesuka', 13)} x={60} y={440} bg="#9cc3ff" dot="#1265c8" size={38} />
          {caps}
        </>
      );
    case 14:
      return (
        <>
          <Chip text="PENAT" at={8} x={60} y={260} bg="#ffffff" dot="#7b4fc9" size={40} />
          <Chip text="SUSAH HIDUP" at={14} x={60} y={350} bg="#ffffff" dot="#7b4fc9" size={40} />
          <Chip text="KECEWA" at={c('kecewa', 3)} x={60} y={440} bg="#ffffff" dot="#7b4fc9" size={40} />
          <Chip text="+ TELUR IKAN = TITIK TERAKHIR" at={c('titik', 6)} x={60} y={540} bg="#ffb36b" dot="#c93434" size={36} />
          {caps}
        </>
      );
    case 15: {
      const lesson = c('hargai', 3);
      const help = c('Jangan', 15);
      return (
        <>
          <Chip text="LEGENDA RAKYAT • BUKAN FAKTA SEJARAH" at={6} x={60} y={250} bg="#ffffff" dot="#7b4fc9" size={32} />
          {frame >= lesson && frame < help + 10 ? caps : null}
          {frame >= help + 10 ? (
            <div style={{position: 'absolute', left: 60, right: 60, top: 1150, background: '#ffffff', border: '6px solid #111', borderRadius: 36, padding: '26px 30px', boxShadow: '0 10px 0 rgba(0,0,0,0.25)', fontFamily: 'Rubik, Inter, sans-serif', textAlign: 'center', opacity: interpolate(frame, [help + 10, help + 20], [0, 1], clamp)}}>
              <div style={{fontWeight: 900, fontSize: 46, color: '#111'}}>Rasa terlalu sedih? Luahkan.</div>
              <div style={{fontWeight: 800, fontSize: 38, color: '#102f69', marginTop: 12}}>Talian HEAL 15555 (8 pagi – 12 malam)</div>
              <div style={{fontWeight: 800, fontSize: 38, color: '#102f69'}}>Befrienders KL 03-7627 2929 (24 jam)</div>
            </div>
          ) : null}
          {frame < lesson ? caps : null}
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
  if (index === 0) list.push([6, 'sparkle'], [c('terbuka', 3), 'thunder']);
  if (index === 1) list.push([c('kenapa', 1), 'jump']);
  if (index === 4) list.push([c('gembira', 11), 'success']);
  if (index === 7) list.push([c('habis', 2), 'buzz']);
  if (index === 8) list.push([c('habis', 6), 'jump']);
  if (index === 10) list.push([c('belah', 12, 1), 'sparkle']);
  if (index === 11) list.push([c('terbuka', 1), 'thunder'], [c('tertutup', 4.6), 'smash']);
  if (index === 13) list.push([c('diseru', 8), 'sparkle']);
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

export const BatuShot: React.FC<{index: number}> = ({index}) => <ShotView index={index} />;

export const BatuVideo: React.FC = () => {
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
