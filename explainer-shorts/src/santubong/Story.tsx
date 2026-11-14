import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {cue, FPS, makeTimeline, ScriptShot, Shot, Timing} from '../lib/timeline';
import {Captions, Chip, Punch} from '../waze/ui/Overlays';
import script from './script.json';
import timings from './timings.json';
import {Alu, Chibi, Face, Lesung, Loom, LOOKS, Plank, Pose} from './world/Chibi';
import {ISLANDS, Islands, Kayangan, KAYANGAN, Land, Mood, Mountain, MOUNTAIN_HEAD, MOUNTAIN_POS, Villages} from './world/Land';

export const {SHOTS, TOTAL_FRAMES} = makeTimeline(script.shots as ScriptShot[], timings as Record<string, Timing>, 'audio/santubong/vo');

type V3 = [number, number, number];
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);
const lerp3 = (a: V3, b: V3, k: number): V3 => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
const ramp = (f: number, a: number, b: number) => ease(interpolate(f, [a, b], [0, 1], clamp));

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

type Actor = {key: string; look: keyof typeof LOOKS; pos: V3; rotY?: number; face?: Face; pose?: Pose; talking?: boolean; cheekMark?: boolean; hearts?: boolean; holdRight?: 'alu' | 'plank'; fall?: number; scale?: number; hidden?: boolean};

type Plan = {
  mood: Mood;
  pos: V3;
  target: V3;
  fov?: number;
  mountain: number;
  scarGlow: number;
  islands: number;
  villages: boolean;
  kayangan: boolean;
  kayanganGlow: number;
  actors: Actor[];
  loomAt?: V3;
  lesungAt?: V3;
  aluY?: number; // world-space alu for pounding (null = held)
  beams: number; // 0..1 light beams from the sky
  flash: number;
  shake: number;
  shards: number; // 0..1 Sejinjang's shattering head flying to the islands
  villagersAngry: boolean;
  villagers: boolean;
  far: boolean; // long-distance fog for mountain views
};

const BASE: Plan = {mood: 'day', pos: [0, 5, 20], target: [0, 2, 0], mountain: 0, scarGlow: 0, islands: 0, villages: true, kayangan: false, kayanganGlow: 0.6, actors: [], beams: 0, flash: 0, shake: 0, shards: 0, villagersAngry: false, villagers: false, far: false};

const SAN: V3 = [-4, 0, 2];
const SEJ: V3 = [4, 0, 2];

// Lightning flash envelope: quick spike then decay at each strike frame.
const strike = (f: number, at: number) => (f >= at ? Math.exp(-(f - at) / 4) : 0);

const plan = (i: number, shot: Shot, f: number): Plan => {
  const t = (shot.start + f) / FPS;
  const c = (w: string, fb: number, nth = 0) => cue(shot, w, fb, nth);
  if (i === 0) {
    const k = ramp(f, 0, shot.frames);
    return {...BASE, mood: 'dusk', far: true, villages: false, mountain: 1, islands: 1, pos: lerp3([-120, 40, 640], [-60, 34, 470], k), target: [20, 34, -210], fov: 40, scarGlow: f >= c('parut', 5) ? 0.5 + 0.5 * Math.sin(f / 4) : 0};
  }
  if (i === 1) {
    const k = ramp(f, 0, shot.frames);
    const head: V3 = [MOUNTAIN_HEAD[0], 24, MOUNTAIN_HEAD[2]];
    return {...BASE, mood: 'dusk', far: true, villages: false, mountain: 1, islands: 1, pos: lerp3([-40, 44, 230], [10, 36, 110], k), target: head, fov: 40, scarGlow: f >= c('parut', 3) ? 0.6 + 0.4 * Math.sin(f / 3) : 0};
  }
  if (i === 2) {
    const raja = c('Raja', 4.5);
    const down = ramp(f, c('menghantar', 5.5), c('mendamaikan', 8));
    const camK = ramp(f, raja - 10, raja + 20);
    const actors: Actor[] = [
      {key: 'san', look: 'santubong', pos: [SAN[0], 40 * (1 - down), SAN[2]], face: 'calm', hidden: f < raja},
      {key: 'sej', look: 'sejinjang', pos: [SEJ[0], 40 * (1 - down), SEJ[2]], face: 'calm', hidden: f < raja},
    ];
    return {...BASE, mood: 'day', villagers: true, villagersAngry: true, pos: lerp3([0, 6, 30], [0, 14, 44], camK), target: lerp3([0, 3, -6], [0, 11, -6], camK), fov: 52, beams: f >= raja ? Math.min(1, (f - raja) / 10) * (1 - interpolate(f, [shot.frames - 20, shot.frames], [0, 1], clamp)) : 0, actors};
  }
  if (i === 3) {
    const sej = c('Sejinjang', 3);
    const k = ramp(f, sej - 8, sej + 12);
    return {
      ...BASE,
      mood: 'day',
      pos: lerp3([-4.5, 3.6, 10], [4.5, 3.6, 10], k),
      target: lerp3([-4, 2, 1.5], [4, 2, 1.5], k),
      fov: 42,
      loomAt: [SAN[0] - 1.6, 0, SAN[2] + 1],
      lesungAt: [SEJ[0], 0, SEJ[2] + 1],
      aluY: 1.4 + ((Math.sin(t * 7) + 1) / 2) * 1.1,
      actors: [
        {key: 'san', look: 'santubong', pos: SAN, face: 'happy', pose: 'weave', rotY: -0.4},
        {key: 'sej', look: 'sejinjang', pos: SEJ, face: 'happy', pose: 'pound'},
      ],
    };
  }
  if (i === 4) {
    const promise = c('Kedua-dua', 6);
    const cloudTop: V3 = [KAYANGAN[0], KAYANGAN[1] + 10, KAYANGAN[2] + 20];
    return {
      ...BASE,
      mood: 'day',
      villages: false,
      kayangan: true,
      kayanganGlow: f < promise ? 0.8 + 0.4 * Math.sin(f / 3) : 0.6,
      pos: [0, cloudTop[1] + 6, cloudTop[2] + 20],
      target: [0, cloudTop[1] + 13, KAYANGAN[2]],
      fov: 58,
      actors: [
        {key: 'san', look: 'santubong', pos: [cloudTop[0] - 3, cloudTop[1], cloudTop[2]], face: f < promise ? 'calm' : 'happy', pose: f < promise ? 'kneel' : 'bow', scale: 1.8},
        {key: 'sej', look: 'sejinjang', pos: [cloudTop[0] + 3, cloudTop[1], cloudTop[2]], face: f < promise ? 'calm' : 'happy', pose: f < promise ? 'kneel' : 'bow', scale: 1.8},
      ],
    };
  }
  if (i === 5) {
    const k = ramp(f, 0, shot.frames);
    const friends = c('sahabat', 6);
    const together = f >= friends;
    return {
      ...BASE,
      mood: 'night',
      villagers: true,
      pos: lerp3([0, 7, 34], [0, 4.5, 16], k),
      target: [0, 2.4, 0],
      fov: 45,
      loomAt: together ? undefined : [SAN[0] - 1.6, 0, SAN[2] + 1],
      lesungAt: together ? undefined : [SEJ[0], 0, SEJ[2] + 1],
      aluY: 1.4 + ((Math.sin(t * 7) + 1) / 2) * 1.1,
      actors: together
        ? [
            {key: 'san', look: 'santubong', pos: [-1.3, 0, 3], face: 'happy', pose: 'cheer'},
            {key: 'sej', look: 'sejinjang', pos: [1.3, 0, 3], face: 'happy', pose: 'cheer'},
          ]
        : [
            {key: 'san', look: 'santubong', pos: SAN, face: 'happy', pose: 'weave', rotY: -0.4},
            {key: 'sej', look: 'sejinjang', pos: SEJ, face: 'happy', pose: 'pound'},
          ],
    };
  }
  if (i === 6) {
    const comes = c('datang', 1.6);
    const walk = ramp(f, comes - 6, comes + 30);
    const sanLove = f >= c('tenunan', 6);
    const sejLove = f >= c('tumbukan', 8);
    const both = f >= c('jatuh', 11);
    return {
      ...BASE,
      mood: 'day',
      pos: [0, 4.2, 19],
      target: [0, 2.3, 0],
      fov: 46,
      actors: [
        {key: 'san', look: 'santubong', pos: [-3.6, 0, 2], face: sanLove || both ? 'love' : 'calm', hearts: sanLove || both, rotY: 0.3},
        {key: 'sej', look: 'sejinjang', pos: [-1.2, 0, 2], face: sejLove || both ? 'love' : 'calm', hearts: sejLove || both, rotY: 0.3},
        {key: 'serapi', look: 'serapi', pos: [14 - walk * 11.6, 0, 3], rotY: walk < 1 ? -Math.PI / 2 : -0.5, face: 'happy', pose: walk >= 1 ? 'wave' : 'idle', scale: 1.08},
      ],
    };
  }
  if (i === 7) {
    const night = c('malam', 6);
    const p1 = c('perampas', 9);
    const p2 = c('cemburu', 11, 1);
    const close: V3 = f >= p2 ? [-3.2, 2.6, 6.5] : f >= p1 ? [3.2, 2.6, 6.5] : [0, 3.6, 13];
    const tgt: V3 = f >= p2 ? [-2.4, 2.3, 2] : f >= p1 ? [2.4, 2.3, 2] : [0, 2.2, 2];
    return {
      ...BASE,
      mood: f >= night ? 'night' : 'dusk',
      pos: close,
      target: tgt,
      fov: 44,
      shake: f >= p1 && f < p1 + 8 ? 0.06 : f >= p2 && f < p2 + 8 ? 0.06 : 0,
      actors: [
        {key: 'san', look: 'santubong', pos: [-2.4, 0, 2], rotY: 0.5, face: f >= c('Cemburu', 4) ? 'angry' : 'sad', pose: f >= p2 ? 'angry' : 'idle', talking: f >= p2},
        {key: 'sej', look: 'sejinjang', pos: [2.4, 0, 2], rotY: -0.5, face: f >= c('Cemburu', 4) ? 'angry' : 'sad', pose: f >= p1 && f < p2 ? 'point' : f >= p2 ? 'angry' : 'idle', talking: f >= p1 && f < p2 - 4},
      ],
    };
  }
  if (i === 8) {
    const swing1 = c('menghayun', 0.8);
    const hit1 = c('pipi', 2.2);
    const swing2 = c('membalas', 4.2);
    const hit2 = c('kepala', 6.2);
    const flash = Math.max(strike(f, hit1), strike(f, hit2)) * 0.7;
    const shake = (f >= hit1 && f < hit1 + 10) || (f >= hit2 && f < hit2 + 10) ? 0.12 : 0;
    return {
      ...BASE,
      mood: 'night',
      pos: [0.2, 2.8, 8.5],
      target: [0, 2.2, 1.5],
      fov: 46,
      flash,
      shake,
      actors: [
        {key: 'san', look: 'santubong', pos: [-1.5, 0, 1.5], rotY: Math.PI / 2 - 0.5, face: f >= hit1 ? (f >= swing2 ? 'angry' : 'hurt') : 'angry', pose: f >= swing2 && f < hit2 + 20 ? 'swingPlank' : 'angry', cheekMark: f >= hit1, holdRight: f >= swing2 ? 'plank' : undefined},
        {key: 'sej', look: 'sejinjang', pos: [1.5, 0, 1.5], rotY: -Math.PI / 2 + 0.5, face: f >= hit2 ? 'shock' : 'angry', pose: f >= swing1 && f < hit1 + 20 ? 'swingAlu' : 'angry', holdRight: f < swing2 ? 'alu' : undefined},
      ],
    };
  }
  if (i === 9) {
    const murka = c('murka', 2.4);
    const pecah = c('pecah', 6);
    const flash = Math.max(strike(f, 6), strike(f, murka), strike(f, pecah)) * 0.9;
    const shards = interpolate(f, [pecah, pecah + 30], [0, 1], clamp);
    const islands = interpolate(f, [pecah + 24, pecah + 54], [0, 1], clamp);
    const camK = ramp(f, pecah - 6, pecah + 30);
    return {
      ...BASE,
      mood: 'storm',
      kayangan: true,
      kayanganGlow: f >= murka ? 1.4 : 0.8,
      pos: lerp3([2, 6, 16], [-70, 60, 170], camK),
      target: lerp3([2, 3, 1.5], [60, 2, 90], camK),
      fov: 48,
      flash,
      shake: f >= pecah && f < pecah + 12 ? 0.2 : 0,
      shards,
      islands,
      actors: [
        {key: 'san', look: 'santubong', pos: [-1.5, 0, 1.5], rotY: 0.3, face: 'shock', cheekMark: true},
        {key: 'sej', look: 'sejinjang', pos: [1.5, 0, 1.5], rotY: -0.3, face: 'shock', hidden: f >= pecah},
      ],
    };
  }
  if (i === 10) {
    const rebah = c('rebah', 1.0);
    const gunung = c('gunung', 2.2);
    const fall = interpolate(f, [rebah, rebah + 14], [0, 1], clamp);
    const grow = interpolate(f, [gunung, gunung + 50], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
    const camK = ramp(f, gunung - 4, shot.frames - 6);
    return {
      ...BASE,
      mood: f >= gunung + 30 ? 'dusk' : 'storm',
      villages: false,
      islands: 1,
      mountain: grow,
      scarGlow: f >= c('parut', 4) ? 0.6 + 0.4 * Math.sin(f / 3) : 0,
      flash: strike(f, gunung) * 0.8,
      far: camK > 0.2,
      pos: lerp3([-2, 4, 12], [-60, 34, 470], camK),
      target: lerp3([-1.5, 1.4, 1.5], [20, 34, -210], camK),
      fov: 44,
      actors: [{key: 'san', look: 'santubong', pos: [-1.5, 0, 1.5], rotY: 0.3, face: 'sad', cheekMark: true, fall, scale: 1 - grow * 0.98, hidden: grow > 0.6}],
    };
  }
  // i === 11: ending
  const k = ramp(f, 0, shot.frames);
  return {...BASE, mood: 'night', far: true, villages: false, mountain: 1, islands: 1, scarGlow: 0.35, pos: lerp3([20, 40, 560], [-100, 46, 600], k), target: [20, 30, -210], fov: 42};
};

// Glowing shards of Sejinjang's head flying from the beach to the island spots.
const Shards: React.FC<{p: number}> = ({p}) => {
  if (p <= 0 || p >= 1) return null;
  return (
    <>
      {ISLANDS.map(([x, , z], i) => {
        const k = Math.min(1, p * (1 + i * 0.08));
        const px = 1.5 + (x - 1.5) * k;
        const pz = 1.5 + (z - 1.5) * k;
        const py = 2.4 + Math.sin(k * Math.PI) * (40 + i * 8);
        return (
          <mesh key={i} position={[px, py, pz]} rotation={[p * 9, p * 7, 0]}>
            <icosahedronGeometry args={[1.4, 0]} />
            <meshBasicMaterial color="#ffd27a" />
          </mesh>
        );
      })}
    </>
  );
};

const Beams: React.FC<{v: number}> = ({v}) => {
  if (v <= 0) return null;
  return (
    <>
      {[SAN, SEJ].map((p, i) => (
        <mesh key={i} position={[p[0], 45, p[2]]}>
          <cylinderGeometry args={[2.2, 2.2, 90, 16, 1, true]} />
          <meshBasicMaterial color="#fff2a8" transparent opacity={0.35 * v} side={2} />
        </mesh>
      ))}
    </>
  );
};

const Villagers: React.FC<{t: number; angry: boolean}> = ({t, angry}) => {
  const spots: [number, number, keyof typeof LOOKS, number][] = [
    [-9, 4, 'villagerA', 0.7],
    [-7, 7, 'villagerB', 0.9],
    [-12, 6, 'villagerC', 0.6],
    [9, 4, 'villagerC', -0.7],
    [7, 7, 'villagerA', -0.9],
    [12, 6, 'villagerB', -0.6],
  ];
  return (
    <>
      {spots.map(([x, z, look, r], i) => (
        <group key={i} position={[x, 0, z]} rotation={[0, angry ? r : r * 0.3, 0]}>
          <Chibi look={LOOKS[look]} t={t + i} face={angry ? 'angry' : 'happy'} pose={angry ? 'angry' : 'cheer'} />
        </group>
      ))}
    </>
  );
};

const Scene3D: React.FC<{index: number}> = ({index}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const shot = SHOTS[index];
  const p = plan(index, shot, frame);
  const t = (shot.start + frame) / FPS;
  const sh = p.shake ? [Math.sin(frame * 2.3) * p.shake * 10, Math.cos(frame * 3.1) * p.shake * 6, 0] : [0, 0, 0];
  const pos: V3 = [p.pos[0] + sh[0] * 0.1, p.pos[1] + sh[1] * 0.1, p.pos[2]];
  return (
    <ThreeCanvas width={width} height={height}>
      <CameraRig pos={pos} target={p.target} fov={p.fov} />
      <Land mood={p.mood} t={t} flash={p.flash} far={p.far} />
      {p.villages ? <Villages /> : null}
      {p.villagers ? <Villagers t={t} angry={p.villagersAngry} /> : null}
      <Mountain grow={p.mountain} scarGlow={p.scarGlow} />
      <Islands rise={p.islands} />
      {p.kayangan ? <Kayangan t={t} glow={p.kayanganGlow} /> : null}
      <Beams v={p.beams} />
      <Shards p={p.shards} />
      {p.loomAt ? (
        <group position={p.loomAt} rotation={[0, 0.5, 0]}>
          <Loom t={t} />
        </group>
      ) : null}
      {p.lesungAt ? (
        <group position={p.lesungAt}>
          <Lesung />
          <group position={[0, (p.aluY ?? 1.6) - p.lesungAt[1], 0]}>
            <mesh>
              <cylinderGeometry args={[0.07, 0.07, 2.4, 6]} />
              <meshLambertMaterial color="#8a5a34" flatShading />
            </mesh>
          </group>
        </group>
      ) : null}
      {p.actors.map((a) =>
        a.hidden ? null : (
          <group key={a.key} position={a.pos} rotation={[a.fall ? (-Math.PI / 2) * a.fall : 0, a.rotY ?? 0, 0]} scale={a.scale ?? 1}>
            <Chibi
              look={LOOKS[a.look]}
              t={t}
              face={a.face}
              pose={a.pose}
              talking={a.talking}
              cheekMark={a.cheekMark}
              hearts={a.hearts}
              holdRight={a.holdRight === 'alu' ? <Alu /> : a.holdRight === 'plank' ? <Plank /> : undefined}
            />
          </group>
        ),
      )}
    </ThreeCanvas>
  );
};

// Zig-zag lightning bolt drawn in 2D over storm shots.
const Bolt: React.FC<{at: number; x: number}> = ({at, x}) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > at + 7) return null;
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      <polyline points={`${x},0 ${x - 60},300 ${x + 30},320 ${x - 80},700 ${x},720 ${x - 120},1100`} fill="none" stroke="#fff6c8" strokeWidth={14} strokeLinejoin="bevel" />
    </svg>
  );
};

const Overlay: React.FC<{index: number}> = ({index}) => {
  const frame = useCurrentFrame();
  const shot = SHOTS[index];
  const c = (w: string, fb: number, nth = 0) => cue(shot, w, fb, nth);
  const caps = <Captions shot={shot} y={1250} />;
  if (index === 0) {
    return (
      <>
        <Punch text={'KENAPA PUTERI\nSANTUBONG JADI\nGUNUNG?'} at={6} y={230} size={92} />
        {caps}
      </>
    );
  }
  if (index === 1) {
    return (
      <>
        <Chip text="GUNUNG SANTUBONG, SARAWAK" at={c('Santubong', 0.6)} x={60} y={260} bg="#ffffff" dot="#36a86b" size={38} />
        <Chip text="KATA ORANG TUA-TUA..." at={c('Kata', 2.6)} x={60} y={350} bg="#ffd23f" dot="#f4a51c" size={38} />
        {caps}
      </>
    );
  }
  if (index === 2) {
    return (
      <>
        <Chip text="PASIR PUTEH" at={c('Puteh', 1.4)} x={60} y={260} bg="#ffffff" dot="#bfc6d1" size={38} />
        <Chip text="PASIR KUNING" at={c('Kuning', 2.2)} x={560} y={260} bg="#ffd23f" dot="#f4a51c" size={38} />
        {caps}
      </>
    );
  }
  if (index === 3) {
    return (
      <>
        <Chip text="PUTERI SANTUBONG • MENENUN" at={c('Santubong', 0.4)} x={60} y={260} bg="#ffffff" dot="#1fa38a" size={36} />
        <Chip text="PUTERI SEJINJANG • MENUMBUK PADI" at={c('Sejinjang', 3)} x={60} y={350} bg="#ffd23f" dot="#c93434" size={36} />
        {caps}
      </>
    );
  }
  if (index === 4) {
    const promise = c('Kedua-dua', 6);
    return frame < promise ? (
      <>
        <Chip text="RAJA KAYANGAN" at={6} x={60} y={260} bg="#ffd23f" dot="#f4a51c" size={40} />
        <Punch text={'"JANGAN\nBERGADUH!"'} at={c('Jangan', 2)} y={1150} size={104} />
      </>
    ) : (
      <Punch text="JANJI!" at={promise} y={1200} size={150} color="#ffffff" />
    );
  }
  if (index === 7) {
    const p1 = c('perampas', 9);
    const p2 = c('cemburu', 11, 1);
    const tint = interpolate(frame, [c('Cemburu', 4), c('Cemburu', 4) + 20], [0, 0.22], clamp);
    return (
      <>
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 40%, rgba(201,52,52,1) 120%)', opacity: tint * 3}} />
        {frame < p1 ? caps : null}
        {frame >= p1 && frame < p2 ? <Punch text={'"KAU\nPERAMPAS!"'} at={p1} y={1180} size={120} color="#ffd23f" /> : null}
        {frame >= p2 ? <Punch text={'"KAU YANG\nCEMBURU!"'} at={p2} y={1180} size={120} color="#ffffff" /> : null}
      </>
    );
  }
  if (index === 8) {
    return (
      <>
        <Punch text="PAK!" at={c('pipi', 2.2)} y={380} size={170} color="#ffffff" />
        {frame >= c('kepala', 6.2) ? <Punch text="PRANG!" at={c('kepala', 6.2)} y={560} size={170} color="#ffd23f" /> : null}
        {caps}
      </>
    );
  }
  if (index === 9) {
    return (
      <>
        <Bolt at={6} x={760} />
        <Bolt at={c('murka', 2.4)} x={300} />
        <Bolt at={c('pecah', 6)} x={620} />
        {caps}
      </>
    );
  }
  if (index === 11) {
    return (
      <>
        <Chip text="LEGENDA RAKYAT SARAWAK" at={c('legenda', 10)} x={60} y={260} bg="#ffffff" dot="#7b4fc9" size={40} />
        <Chip text="BUKAN FAKTA SEJARAH" at={c('fakta', 11)} x={60} y={350} bg="#ffd23f" dot="#c93434" size={40} />
        {caps}
      </>
    );
  }
  return caps;
};

const SFX: React.FC<{index: number}> = ({index}) => {
  const shot = SHOTS[index];
  const c = (w: string, fb: number, nth = 0) => cue(shot, w, fb, nth);
  const list: [number, string][] = [[0, 'whoosh']];
  if (index === 0) list.push([6, 'sparkle']);
  if (index === 2) list.push([c('Raja', 4.5), 'sparkle']);
  if (index === 3) list.push([c('menenun', 1.4), 'key'], [c('menumbuk', 4), 'click']);
  if (index === 4) list.push([c('Jangan', 2), 'alert'], [c('berjanji', 7), 'success']);
  if (index === 6) list.push([c('jatuh', 11), 'sparkle']);
  if (index === 7) list.push([c('perampas', 9), 'buzz'], [c('cemburu', 11, 1), 'buzz']);
  if (index === 8) list.push([c('pipi', 2.2), 'jump'], [c('kepala', 6.2), 'jump']);
  if (index === 9) list.push([6, 'thunder'], [c('murka', 2.4), 'thunder'], [c('pecah', 6), 'smash']);
  if (index === 10) list.push([c('gunung', 2.2), 'thunder']);
  if (index === 11) list.push([c('janji', 8), 'success']);
  return (
    <>
      {shot.audio.map((a, k) => (
        <Sequence key={`vo${k}`} from={a.from} name="VO">
          <Audio src={staticFile(a.src)} />
        </Sequence>
      ))}
      {list.map(([f, name], k) => (
        <Sequence key={k} from={Math.max(0, f)} durationInFrames={FPS * 2} name={`SFX ${name}`}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={name === 'thunder' || name === 'smash' ? 0.55 : 0.32} />
        </Sequence>
      ))}
    </>
  );
};

const ShotView: React.FC<{index: number}> = ({index}) => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 5], [0.55, 0], clamp);
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

export const SantubongShot: React.FC<{index: number}> = ({index}) => <ShotView index={index} />;

export const SantubongVideo: React.FC = () => {
  const music = (f: number) => interpolate(f, [0, 15, TOTAL_FRAMES - 45, TOTAL_FRAMES], [0, 0.1, 0.1, 0], clamp);
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
