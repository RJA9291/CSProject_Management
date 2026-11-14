import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {cue, FPS, makeTimeline, ScriptShot, Shot, Timing} from '../lib/timeline';
import {Captions, Chip, Punch} from '../waze/ui/Overlays';
import {Chibi, Face, Look, LOOKS, Pose} from '../santubong/world/Chibi';
import {Hut, Land, Mood} from '../santubong/world/Land';
import {Basket, Tears} from '../batubelah/world/Sets';
import script from './script.json';
import timings from './timings.json';
import {Sampan, Ship, stoneLook} from './world/Sets';

export const {SHOTS, TOTAL_FRAMES} = makeTimeline(script.shots as ScriptShot[], timings as Record<string, Timing>, 'audio/tanggang/vo', script.say as Record<string, string>);

type V3 = [number, number, number];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const ramp = (f: number, a: number, b: number) => ease(interpolate(f, [a, b], [0, 1], clamp));

// Original characters on the shared chibi rig.
const TANGGANG_POOR: Look = {skin: '#d9a47a', hair: '#1b1b1b', outfit: '#9a8a6a', trim: '#6b5a40', crown: null};
const TANGGANG_RICH: Look = {skin: '#d9a47a', hair: '#1b1b1b', outfit: '#7a1f2b', trim: '#f4c430', crown: 'tengkolok'};
const ISTERI: Look = {skin: '#f2c29b', hair: '#1a1416', outfit: '#d9578a', trim: '#f4c430', long: true, crown: 'tiara', skirt: true};
const MAK: Look = {skin: '#d9a47a', hair: '#5a5550', outfit: '#7a6a5a', trim: '#5a4a3a', long: true, crown: null, skirt: true};
const AYAH: Look = {skin: '#cf9a70', hair: '#6a6560', outfit: '#6b5a40', trim: '#4a3a2a', crown: null};
const CREW: Look = {...LOOKS.villagerA, scale: 0.85};

// Ship sits on the sea; its deck is at world y ≈ 0.
const SHIP_POS: V3 = [0, -2.5, 34];
const DECK = (x: number, z = 0): V3 => [SHIP_POS[0] + x, 0, SHIP_POS[2] + z];

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

type Actor = {key: string; look: Look; pos: V3; rotY?: number; face?: Face; pose?: Pose; talking?: boolean; tears?: boolean; basket?: boolean; walk?: boolean; hidden?: boolean};
type Plan = {
  mood: Mood;
  pos: V3;
  target: V3;
  fov?: number;
  actors: Actor[];
  ship?: {pos: V3; stone: boolean; grand: boolean};
  sampan?: V3;
  huts: boolean;
  flash?: number;
};
const BASE: Plan = {mood: 'day', pos: [0, 3.5, 14], target: [0, 2, 0], actors: [], huts: true};

const strike = (f: number, at: number) => (f >= at ? Math.exp(-(f - at) / 4) : 0);
const stoned = (a: Actor[]): Actor[] => a.map((x) => ({...x, look: stoneLook(x.look), face: 'calm', pose: x.pose, talking: false, tears: false}));

const deckCrew = (rich = true): Actor[] => [
  {key: 'tanggang', look: rich ? TANGGANG_RICH : TANGGANG_POOR, pos: DECK(0.5, -1), rotY: Math.PI + 0.3, face: 'happy', pose: rich ? 'idle' : 'pound'},
  {key: 'isteri', look: ISTERI, pos: DECK(-1.8, -1), rotY: Math.PI - 0.3, face: 'happy', hidden: !rich},
  {key: 'c1', look: CREW, pos: DECK(3.4, 0), rotY: Math.PI + 0.5, face: 'happy'},
  {key: 'c2', look: {...LOOKS.villagerC, scale: 0.85}, pos: DECK(-4.2, 0), rotY: Math.PI - 0.5, face: 'happy'},
];

const plan = (i: number, shot: Shot, f: number): Plan => {
  const t = (shot.start + f) / FPS;
  const c = (w: string, fb: number, nth = 0) => cue(shot, w, fb, nth);
  const k = ramp(f, 0, shot.frames);
  switch (i) {
    case 0:
      return {...BASE, mood: 'dusk', huts: false, pos: lerp3([-18, 7, 8], [-10, 5, 16], k), target: [0, 1, SHIP_POS[2]], fov: 46, ship: {pos: SHIP_POS, stone: true, grand: true}, actors: stoned(deckCrew())};
    case 1:
      return {
        ...BASE,
        pos: lerp3([0, 4.4, 17], [0, 3.4, 11], k),
        target: [0, 2.1, 0],
        actors: [
          {key: 'tanggang', look: TANGGANG_POOR, pos: [0, 0, 1.6], face: 'calm'},
          {key: 'mak', look: MAK, pos: [-2.3, 0, 0.8], rotY: 0.3, face: 'calm'},
          {key: 'ayah', look: AYAH, pos: [2.3, 0, 0.8], rotY: -0.3, face: 'calm'},
        ],
      };
    case 2: {
      const sx = -40 + k * 80;
      return {...BASE, huts: false, pos: [1.5, 2.8, -3.5], target: [0, 2, 30], fov: 50, ship: {pos: [sx, -2.5, 46], stone: false, grand: false}, actors: [{key: 'tanggang', look: TANGGANG_POOR, pos: [0, 0, 4], rotY: Math.PI, face: 'happy'}]};
    }
    case 3:
      return {
        ...BASE,
        pos: [2.5, 3.4, -6],
        target: [-1, 2, 8],
        fov: 50,
        ship: {pos: SHIP_POS, stone: false, grand: false},
        actors: [
          {key: 'tanggang', look: TANGGANG_POOR, pos: [0, 0, 4], rotY: Math.PI * 0.5, face: 'happy', talking: f >= c('izin', 3)},
          {key: 'mak', look: MAK, pos: [-2.4, 0, 3.6], rotY: Math.PI * 0.4, face: 'sad'},
          {key: 'ayah', look: AYAH, pos: [-2.4, 0, 5.6], rotY: Math.PI * 0.55, face: 'calm'},
        ],
      };
    case 4: {
      const go = ramp(f, c('Jangan', 3) + 30, shot.frames);
      return {
        ...BASE,
        pos: [0, 3.2, 10.5],
        target: [0, 2.1, 2],
        actors: [
          {key: 'mak', look: MAK, pos: [-1.4, 0, 2], rotY: 0.4, face: 'sad', talking: f >= c('Jangan', 3), tears: f >= c('Jangan', 3)},
          {key: 'tanggang', look: TANGGANG_POOR, pos: [1.4 + go * 6, 0, 2 + go * 4], rotY: go > 0 ? Math.PI * 0.75 : -0.4, face: 'happy', walk: go > 0 && go < 1},
        ],
      };
    }
    case 5: {
      const rich = f >= c('nakhoda', 5);
      return {...BASE, huts: false, pos: [DECK(0)[0] + 2, 3, DECK(0)[2] - 9], target: [DECK(0)[0], 1.8, DECK(0)[2]], fov: 46, ship: {pos: SHIP_POS, stone: false, grand: rich}, actors: deckCrew(rich).map((a) => (a.key === 'isteri' ? {...a, hidden: f < c('puteri', 8)} : a))};
    }
    case 6: {
      const arrive = ramp(f, 0, c('berlabuh', 3) + 10);
      return {
        ...BASE,
        pos: [-4, 3.6, -2],
        target: [0, 2, 30],
        fov: 50,
        ship: {pos: [SHIP_POS[0] + 40 * (1 - arrive), SHIP_POS[1], SHIP_POS[2]], stone: false, grand: true},
        actors: [
          {key: 'mak', look: MAK, pos: [-1.2, 0, 4], rotY: Math.PI, face: f >= c('Berita', 5) ? 'happy' : 'calm'},
          {key: 'ayah', look: AYAH, pos: [1.2, 0, 4], rotY: Math.PI, face: f >= c('Berita', 5) ? 'happy' : 'calm', pose: f >= c('Berita', 5) ? 'point' : 'idle'},
        ],
      };
    }
    case 7: {
      const row = ramp(f, 0, shot.frames);
      const sp: V3 = [-16 + row * 10, -2.3, 26];
      return {...BASE, huts: false, pos: [sp[0] + 2, 2.4, sp[2] - 8], target: [sp[0] + 1, 0.2, sp[2] + 2], fov: 48, ship: {pos: SHIP_POS, stone: false, grand: true}, sampan: sp, actors: [{key: 'mak', look: MAK, pos: [sp[0], sp[1] + 0.5, sp[2]], rotY: Math.PI / 2, face: 'happy', basket: true}]};
    }
    case 8: {
      const deny = c('Perempuan', 8);
      const sp: V3 = [-6, -2.3, 28.4];
      return {
        ...BASE,
        huts: false,
        pos: f < deny ? [-2, 3.2, 22] : [3, 2.6, 26],
        target: f < deny ? [-3, 0.6, 30] : DECK(0.5, 1),
        fov: 46,
        ship: {pos: SHIP_POS, stone: false, grand: true},
        sampan: sp,
        actors: [
          {key: 'mak', look: MAK, pos: [sp[0], sp[1] + 0.5, sp[2]], rotY: Math.PI * 0.3, face: f >= deny ? 'shock' : 'happy', basket: true},
          {key: 'tanggang', look: TANGGANG_RICH, pos: DECK(-1.5, -1.6), rotY: Math.PI * 0.85, face: f >= c('malu', 4) ? 'angry' : 'calm', pose: f >= deny ? 'point' : 'idle', talking: f >= deny},
          {key: 'isteri', look: ISTERI, pos: DECK(0.8, -0.6), rotY: Math.PI * 0.9, face: f >= deny ? 'shock' : 'calm'},
        ],
      };
    }
    case 9: {
      const back = ramp(f, 0, shot.frames);
      const sp: V3 = [-6 - back * 8, -2.3, 28.4 - back * 3];
      return {...BASE, huts: false, mood: 'dusk', pos: [sp[0] + 1.5, 1.4, sp[2] + 4.8], target: [sp[0], 0.6, sp[2]], fov: 46, ship: {pos: SHIP_POS, stone: false, grand: true}, sampan: sp, actors: [{key: 'mak', look: MAK, pos: [sp[0], sp[1] + 0.5, sp[2]], face: 'sad', tears: true}]};
    }
    case 10: {
      const pray = c('Tuhan', 2);
      const sp: V3 = [-14, -2.3, 25.4];
      return {...BASE, huts: false, mood: f >= pray ? 'storm' : 'dusk', pos: [sp[0] + 1.2, 1.3, sp[2] + 4.2], target: [sp[0], 0.7, sp[2]], fov: 46, flash: strike(f, pray) * 0.5, ship: {pos: SHIP_POS, stone: false, grand: true}, sampan: sp, actors: [{key: 'mak', look: MAK, pos: [sp[0], sp[1] + 0.5, sp[2]], face: 'sad', tears: true, talking: f >= pray, pose: f >= pray ? 'cheer' : 'idle'}]};
    }
    case 11: {
      const batu = c('batu', 8);
      const stone = f >= batu;
      const crew = deckCrew().map((a) => (a.key === 'tanggang' ? {...a, face: 'shock' as Face} : {...a, face: 'shock' as Face}));
      return {
        ...BASE,
        huts: false,
        mood: stone ? 'dusk' : 'storm',
        pos: lerp3([-12, 6, 18], [-16, 7, 12], k),
        target: [0, 1, SHIP_POS[2]],
        fov: 48,
        flash: Math.max(strike(f, 4), strike(f, c('petir', 3)), strike(f, batu)) * 0.9,
        ship: {pos: SHIP_POS, stone, grand: true},
        actors: stone ? stoned(crew) : crew,
      };
    }
    case 12:
      return {...BASE, huts: false, mood: 'dusk', pos: lerp3([-10, 5, 16], [-6, 4, 20], k), target: [0, 1, SHIP_POS[2]], fov: 46, ship: {pos: SHIP_POS, stone: true, grand: true}, actors: stoned(deckCrew())};
    case 13:
      return {...BASE, huts: false, mood: 'day', pos: lerp3([14, 6, 12], [6, 5, 8], k), target: [0, 1, SHIP_POS[2]], fov: 46, ship: {pos: SHIP_POS, stone: true, grand: true}, actors: stoned(deckCrew())};
    default:
      return {
        ...BASE,
        mood: 'day',
        pos: lerp3([0, 3.4, 11], [0, 4.4, 16], k),
        target: [0, 2.1, 0],
        actors: [
          {key: 'mak', look: MAK, pos: [-1.2, 0, 1.4], rotY: 0.2, face: 'happy'},
          {key: 'ayah', look: AYAH, pos: [1.2, 0, 1.4], rotY: -0.2, face: 'happy'},
        ],
      };
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
      <Land mood={p.mood} t={t} flash={p.flash ?? 0} />
      {p.huts ? (
        <>
          <Hut x={0} z={-9} wall="#8a6a46" />
          <Hut x={-13} z={-15} rot={0.4} wall="#b8935e" />
          <Hut x={13} z={-16} rot={-0.4} wall="#c7a271" />
        </>
      ) : null}
      {p.ship ? (
        <group position={p.ship.pos}>
          <Ship t={t} stone={p.ship.stone} grand={p.ship.grand} />
        </group>
      ) : null}
      {p.sampan ? (
        <group position={p.sampan}>
          <Sampan t={t} />
        </group>
      ) : null}
      {p.actors.map((a) => {
        if (a.hidden) return null;
        const s = a.look.scale ?? 1;
        const bob = a.walk ? Math.abs(Math.sin(t * 8)) * 0.08 : 0;
        return (
          <React.Fragment key={a.key}>
            <group position={[a.pos[0], a.pos[1] + bob, a.pos[2]]} rotation={[0, a.rotY ?? 0, a.walk ? Math.sin(t * 8) * 0.04 : 0]}>
              <Chibi look={a.look} t={t} face={a.face} pose={a.pose} talking={a.talking} holdRight={a.basket ? <Basket /> : undefined} />
            </group>
            {a.tears ? <Tears head={[a.pos[0], a.pos[1] + 2.2 * s, a.pos[2]]} t={t} scale={s} /> : null}
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
          <Punch text={'KENAPA SI TANGGANG\nBERTUKAR\nMENJADI BATU?'} at={6} y={220} size={86} />
          {caps}
        </>
      );
    case 1:
      return (
        <>
          <Chip text="SI TANGGANG" at={c('Tanggang', 1)} x={60} y={260} bg="#ffffff" dot="#9a8a6a" size={40} />
          <Chip text="HIDUP MISKIN" at={c('miskin', 2)} x={60} y={350} bg="#ffd23f" dot="#6b5a40" size={40} />
          {caps}
        </>
      );
    case 2:
      return (
        <>
          <Chip text="MIMPI JADI KAYA" at={c('bermimpi', 1.5)} x={60} y={260} bg="#ffd23f" dot="#f4a51c" size={40} />
          {caps}
        </>
      );
    case 3:
      return (
        <>
          <Chip text="MERANTAU" at={c('merantau', 5)} x={60} y={260} bg="#9cc3ff" dot="#1265c8" size={40} />
          {caps}
        </>
      );
    case 4: {
      const p = c('Jangan', 3);
      return frame < p ? caps : <Punch text={'"JANGAN LUPAKAN\nMAK DAN AYAH, NAK."'} at={p} y={1180} size={84} color="#ffffff" />;
    }
    case 5:
      return (
        <>
          <Chip text="BEKERJA KERAS" at={c('bekerja', 1.4)} x={60} y={260} bg="#ffffff" dot="#36a86b" size={38} />
          <Chip text="NAKHODA KAYA RAYA" at={c('nakhoda', 5)} x={60} y={350} bg="#ffd23f" dot="#f4c430" size={38} />
          <Chip text="BERKAHWIN DENGAN PUTERI" at={c('puteri', 8)} x={60} y={440} bg="#ffc2d8" dot="#d9578a" size={36} />
          {caps}
        </>
      );
    case 6:
      return (
        <>
          <Chip text="BERTAHUN-TAHUN KEMUDIAN" at={6} x={60} y={260} bg="#ffffff" dot="#7b4fc9" size={38} />
          {caps}
        </>
      );
    case 8: {
      const deny = c('Perempuan', 8);
      return frame < deny ? caps : <Punch text={'"BUKAN IBU AKU!\nHALAU DIA PERGI!"'} at={deny} y={1180} size={90} color="#ff8a8a" />;
    }
    case 10: {
      const pray = c('Tuhan', 2);
      return frame < pray ? caps : <Punch text={'"TUNJUKKANLAH\nKEKUASAAN-MU."'} at={pray} y={1180} size={90} color="#ffffff" />;
    }
    case 11:
      return (
        <>
          {frame >= c('batu', 8) ? <Punch text="BATU!" at={c('batu', 8)} y={330} size={170} color="#ffffff" /> : null}
          {caps}
        </>
      );
    case 12:
      return (
        <>
          <Chip text="MENDERHAKA" at={c('menderhaka', 5)} x={60} y={260} bg="#ff8a8a" dot="#c93434" size={40} />
          <Chip text="MENAFIKAN IBU SENDIRI" at={c('menafikan', 6.5)} x={60} y={350} bg="#ffffff" dot="#c93434" size={38} />
          <Chip text="MALU DENGAN KEMISKINAN" at={c('malu', 8.5)} x={60} y={440} bg="#ffd23f" dot="#c93434" size={36} />
          {caps}
        </>
      );
    case 13:
      return (
        <>
          <Chip text="LEGENDA RAKYAT • BUKAN FAKTA" at={6} x={60} y={250} bg="#ffffff" dot="#7b4fc9" size={36} />
          <Chip text="SERUPA: MALIN KUNDANG (SUMATERA BARAT)" at={c('Malin', 6)} x={60} y={340} bg="#ffd23f" dot="#f4a51c" size={30} />
          <Chip text="BATU = KEPERCAYAAN, BUKAN BUKTI" at={c('kepercayaan', 11)} x={60} y={430} bg="#9cc3ff" dot="#1265c8" size={32} />
          {caps}
        </>
      );
    case 14: {
      const p = c('jangan', 3);
      return (
        <>
          {frame >= p + 20 ? <Punch text={'JANGAN LUPA\nIBU BAPA!'} at={p + 20} y={300} size={120} color="#ffd23f" /> : null}
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
  if (index === 5) list.push([c('nakhoda', 5), 'coin']);
  if (index === 6) list.push([c('berlabuh', 3), 'success']);
  if (index === 8) list.push([c('Perempuan', 8), 'buzz']);
  if (index === 10) list.push([c('Tuhan', 2), 'thunder']);
  if (index === 11) list.push([4, 'thunder'], [c('petir', 3), 'thunder'], [c('batu', 8), 'smash']);
  if (index === 14) list.push([c('jangan', 3) + 20, 'pop']);
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

export const TanggangShot: React.FC<{index: number}> = ({index}) => <ShotView index={index} />;

export const TanggangVideo: React.FC = () => {
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

// Re-used by the style-comparison video.
export const TanggangScene3D = Scene3D;
