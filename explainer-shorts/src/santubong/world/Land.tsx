// Low-poly legend world for "Kenapa Puteri Santubong Bertukar Menjadi Gunung?":
// sky (day / dusk / night / storm), sea, beach, coconut palms, two villages, Gunung Santubong
// (a reclining-princess silhouette with a scar on the "cheek"), islands, moon, stars, Kayangan.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {random} from 'remotion';

export type Mood = 'day' | 'dusk' | 'night' | 'storm';

const SKIES: Record<Mood, {top: string; horizon: string; fog: string; sun: string; sunI: number; hemi: number; sea: string}> = {
  day: {top: '#5b8fe0', horizon: '#ffd9b0', fog: '#ffd9b0', sun: '#fff1d6', sunI: 1.5, hemi: 1.1, sea: '#2f8fc8'},
  dusk: {top: '#4a4f9c', horizon: '#ff9f7a', fog: '#f7a888', sun: '#ffc79a', sunI: 1.2, hemi: 0.9, sea: '#3d6ea8'},
  night: {top: '#0d1640', horizon: '#3b4a8a', fog: '#2a356d', sun: '#b9c8ff', sunI: 0.7, hemi: 0.55, sea: '#1b3a6b'},
  storm: {top: '#2a1c48', horizon: '#6a5a8a', fog: '#54487a', sun: '#d9ccff', sunI: 0.8, hemi: 0.7, sea: '#2e3a6a'},
};

const flat = (color: string) => new THREE.MeshLambertMaterial({color, flatShading: true});

const Sky: React.FC<{mood: Mood}> = ({mood}) => {
  const s = SKIES[mood];
  const geo = useMemo(() => {
    const g = new THREE.SphereGeometry(1800, 24, 16);
    const top = new THREE.Color(s.top);
    const hor = new THREE.Color(s.horizon);
    const colors: number[] = [];
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) / 1800;
      const c = hor.clone().lerp(top, Math.min(1, Math.max(0, y * 2.4)));
      colors.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, [s.top, s.horizon]);
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial vertexColors side={THREE.BackSide} fog={false} />
    </mesh>
  );
};

const Stars: React.FC<{t: number}> = ({t}) => {
  const pts = useMemo(() => Array.from({length: 140}, (_, i) => {
    const a = random(`sa${i}`) * Math.PI * 2;
    const e = 0.15 + random(`se${i}`) * 1.2;
    return [Math.cos(a) * Math.cos(e) * 1500, Math.sin(e) * 1500, Math.sin(a) * Math.cos(e) * 1500] as [number, number, number];
  }), []);
  return (
    <>
      {pts.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[2.2 + (Math.sin(t * 3 + i) + 1) * 0.8, 4, 3]} />
          <meshBasicMaterial color="#fff6d8" fog={false} />
        </mesh>
      ))}
    </>
  );
};

// Animated low-poly sea: a grid whose vertices bob with time.
const Sea: React.FC<{t: number; color: string}> = ({t, color}) => {
  const geo = useMemo(() => new THREE.PlaneGeometry(4000, 4000, 60, 60), []);
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, Math.sin(x * 0.03 + t * 1.2) * 1.2 + Math.cos(y * 0.025 + t * 0.9) * 1.0);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, 2014]}>
      <meshLambertMaterial color={color} flatShading />
    </mesh>
  );
};

export const Palm: React.FC<{x: number; z: number; s?: number; t: number}> = ({x, z, s = 1, t}) => {
  const trunk = useMemo(() => flat('#8a6a46'), []);
  const leaf = useMemo(() => flat('#3f9a4f'), []);
  const sway = Math.sin(t * 1.4 + x) * 0.06;
  return (
    <group position={[x, 0, z]} scale={s} rotation={[0, 0, sway]}>
      {[0, 1, 2, 3].map((k) => (
        <mesh key={k} material={trunk} position={[k * 0.25, 1.1 + k * 2.1, 0]} rotation={[0, 0, -0.12]}>
          <cylinderGeometry args={[0.32 - k * 0.04, 0.38 - k * 0.04, 2.3, 6]} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4, 5].map((k) => (
        <mesh key={`l${k}`} material={leaf} position={[1 + Math.cos((k / 6) * Math.PI * 2) * 2, 8.6, Math.sin((k / 6) * Math.PI * 2) * 2]} rotation={[Math.sin((k / 6) * Math.PI * 2) * 0.6, (k / 6) * Math.PI * 2, -Math.cos((k / 6) * Math.PI * 2) * 0.6]}>
          <boxGeometry args={[4.2, 0.15, 1.1]} />
        </mesh>
      ))}
      <mesh material={trunk} position={[0.9, 8.2, 0]}>
        <icosahedronGeometry args={[0.5, 0]} />
      </mesh>
    </group>
  );
};

// Kampung house on stilts with an attap roof.
export const Hut: React.FC<{x: number; z: number; rot?: number; wall?: string; s?: number}> = ({x, z, rot = 0, wall = '#c9a06a', s = 1}) => {
  const wood = useMemo(() => flat(wall), [wall]);
  const roof = useMemo(() => flat('#8c6b3c'), []);
  const post = useMemo(() => flat('#6b4a2c'), []);
  return (
    <group position={[x, 0, z]} rotation={[0, rot, 0]} scale={s}>
      {[[-2, -1.6], [2, -1.6], [-2, 1.6], [2, 1.6]].map(([px, pz], i) => (
        <mesh key={i} material={post} position={[px, 1, pz]}>
          <boxGeometry args={[0.3, 2, 0.3]} />
        </mesh>
      ))}
      <mesh material={wood} position={[0, 3.2, 0]}>
        <boxGeometry args={[4.6, 2.4, 3.8]} />
      </mesh>
      <mesh material={roof} position={[0, 5.4, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[4.2, 2.6, 4]} />
      </mesh>
      <mesh position={[0, 3, 1.92]}>
        <boxGeometry args={[1, 1.6, 0.05]} />
        <meshLambertMaterial color="#4a3320" />
      </mesh>
    </group>
  );
};

const Beach: React.FC<{t: number}> = ({t}) => {
  const palms = useMemo(() => Array.from({length: 18}, (_, i) => ({x: -170 + i * 20 + random(`px${i}`) * 8, z: -14 - random(`pz${i}`) * 18, s: 0.9 + random(`ps${i}`) * 0.5})), []);
  return (
    <>
      <mesh position={[0, -1.6, 4]}>
        <boxGeometry args={[4000, 3.2, 24]} />
        <meshLambertMaterial color="#f1dca6" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -900]}>
        <planeGeometry args={[4000, 1800]} />
        <meshLambertMaterial color="#6fa45e" />
      </mesh>
      {palms.map((p, i) => (
        <Palm key={i} x={p.x} z={p.z} s={p.s} t={t} />
      ))}
    </>
  );
};

// Pasir Puteh (left, pale walls) and Pasir Kuning (right, yellow walls).
export const Villages: React.FC = () => (
  <>
    {[-9, -16, -24].map((x, i) => (
      <Hut key={`p${i}`} x={x} z={-14 - (i % 2) * 7} rot={0.35} wall="#efe6d6" />
    ))}
    {[9, 16, 24].map((x, i) => (
      <Hut key={`k${i}`} x={x} z={-14 - (i % 2) * 7} rot={-0.35} wall="#f2c14e" />
    ))}
  </>
);

// Reclining-princess ridge (head on the right, then neck, chest, waist, knees, legs, feet),
// turned at an angle to the sea so the profile reads in a portrait frame. `grow` 0..1 raises it.
export const MOUNTAIN_POS: [number, number, number] = [0, 0, -260];
export const MOUNTAIN_ROT = -0.8;
const HEAD_LOCAL: [number, number, number] = [150, 34, 0];
// World position of the head (for cameras).
export const MOUNTAIN_HEAD: [number, number, number] = [
  MOUNTAIN_POS[0] + HEAD_LOCAL[0] * Math.cos(MOUNTAIN_ROT),
  HEAD_LOCAL[1],
  MOUNTAIN_POS[2] - HEAD_LOCAL[0] * Math.sin(MOUNTAIN_ROT),
];
export const Mountain: React.FC<{grow?: number; scarGlow?: number}> = ({grow = 1, scarGlow = 0}) => {
  const rock = useMemo(() => flat('#4c8a5a'), []);
  const rock2 = useMemo(() => flat('#558f5c'), []);
  const scar = useMemo(() => new THREE.MeshBasicMaterial({color: '#24362a'}), []);
  if (grow <= 0) return null;
  // x, y, rx, ry, rz
  const parts: [number, number, number, number, number][] = [
    [150, 34, 44, 44, 46], // head
    [190, 40, 14, 12, 16], // nose
    [110, 18, 34, 22, 40], // neck
    [55, 36, 62, 46, 52], // chest
    [-20, 26, 72, 32, 54], // waist
    [-95, 40, 50, 42, 48], // knees
    [-165, 22, 62, 24, 46], // legs
    [-228, 18, 26, 24, 34], // feet
  ];
  return (
    <group position={MOUNTAIN_POS} rotation={[0, MOUNTAIN_ROT, 0]} scale={[1, grow, 1]}>
      {parts.map(([x, y, rx, ry, rz], i) => (
        <mesh key={i} material={i % 2 ? rock2 : rock} position={[x, y * 0.6, 0]} scale={[rx, ry, rz]}>
          <icosahedronGeometry args={[1, 2]} />
        </mesh>
      ))}
      {/* the "scar" on the cheek */}
      <mesh material={scar} position={[150, 30, 44]} rotation={[0, 0, -0.75]}>
        <boxGeometry args={[34, 2.6, 2]} />
      </mesh>
      {scarGlow > 0 ? (
        <mesh position={[150, 30, 45.5]} rotation={[0, 0, -0.75]}>
          <boxGeometry args={[37, 4.4, 1]} />
          <meshBasicMaterial color="#ff5a5a" transparent opacity={scarGlow * 0.8} />
        </mesh>
      ) : null}
    </group>
  );
};

export const ISLANDS: [number, number, number][] = [
  [70, 0, 120],
  [120, 0, 170],
  [30, 0, 210],
  [160, 0, 110],
];
export const Islands: React.FC<{rise: number}> = ({rise}) => {
  const mat = useMemo(() => flat('#5a9a5e'), []);
  const sand = useMemo(() => flat('#e9d39a'), []);
  if (rise <= 0) return null;
  return (
    <>
      {ISLANDS.map(([x, , z], i) => (
        <group key={i} position={[x, -1, z]} scale={[1, Math.min(1, rise * (1.4 - i * 0.1)), 1]}>
          <mesh material={sand}>
            <cylinderGeometry args={[10 + i * 2, 12 + i * 2, 1.5, 9]} />
          </mesh>
          <mesh material={mat} position={[0, 2, 0]} scale={[8 + i * 2, 6 + i, 8 + i * 2]}>
            <icosahedronGeometry args={[1, 0]} />
          </mesh>
        </group>
      ))}
    </>
  );
};

// Kayangan: a golden palace on clouds high above, with a glowing crown for Raja Kayangan.
export const KAYANGAN: [number, number, number] = [0, 150, -120];
export const Kayangan: React.FC<{t: number; glow?: number}> = ({t, glow = 0.6}) => {
  const cloud = useMemo(() => new THREE.MeshLambertMaterial({color: '#ffffff', flatShading: true}), []);
  const gold = useMemo(() => new THREE.MeshLambertMaterial({color: '#f4c430', emissive: '#7a5a00', emissiveIntensity: 0.6, flatShading: true}), []);
  const wall = useMemo(() => flat('#fff3dc'), []);
  return (
    <group position={KAYANGAN}>
      {[[0, 0, 0, 22], [-24, -3, 4, 16], [24, -3, 2, 17], [-12, 6, -6, 15], [14, 5, -5, 14], [-40, -6, 8, 11], [40, -6, 6, 12]].map(([x, y, z, r], i) => (
        <mesh key={i} material={cloud} position={[x, y, z]} scale={[r, r * 0.55, r]}>
          <icosahedronGeometry args={[1, 1]} />
        </mesh>
      ))}
      <group position={[0, 14, -4]}>
        <mesh material={wall} position={[0, 4, 0]}>
          <boxGeometry args={[22, 8, 10]} />
        </mesh>
        <mesh material={gold} position={[0, 11, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[14, 7, 4]} />
        </mesh>
        {[-13, 13].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh material={wall} position={[0, 6, 0]}>
              <boxGeometry args={[5, 12, 5]} />
            </mesh>
            <mesh material={gold} position={[0, 14, 0]} rotation={[0, Math.PI / 4, 0]}>
              <coneGeometry args={[4, 5, 4]} />
            </mesh>
          </group>
        ))}
      </group>
      {/* Raja Kayangan: a floating crown with rays */}
      <group position={[0, 36 + Math.sin(t * 1.5) * 1.2, 4]} rotation={[0, t * 0.4, 0]}>
        <mesh material={gold}>
          <cylinderGeometry args={[5, 5.5, 3, 10, 1, true]} />
        </mesh>
        {Array.from({length: 6}, (_, k) => (
          <mesh key={k} material={gold} position={[Math.cos((k / 6) * Math.PI * 2) * 5, 3, Math.sin((k / 6) * Math.PI * 2) * 5]}>
            <coneGeometry args={[1.1, 3.4, 4]} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 36, 4]}>
        <sphereGeometry args={[12, 16, 12]} />
        <meshBasicMaterial color="#fff2a8" transparent opacity={0.22 * glow} />
      </mesh>
    </group>
  );
};

// `coast` = false hides the sea and beach (for inland sets such as swamps and forests).
export const Land: React.FC<{mood: Mood; t: number; flash?: number; far?: boolean; coast?: boolean}> = ({mood, t, flash = 0, far = false, coast = true}) => {
  const s = SKIES[mood];
  return (
    <>
      <Sky mood={mood} />
      {mood === 'night' || mood === 'storm' ? <Stars t={t} /> : null}
      {mood === 'night' ? (
        <mesh position={[-500, 520, -1400]}>
          <sphereGeometry args={[70, 20, 14]} />
          <meshBasicMaterial color="#fff4cc" fog={false} />
        </mesh>
      ) : null}
      <fog attach="fog" args={[s.fog, far ? 700 : 260, far ? 3200 : 1500]} />
      <hemisphereLight args={['#e6eeff', '#7a9a6a', s.hemi + flash * 2]} />
      <directionalLight position={[-120, 200, 160]} intensity={s.sunI + flash * 3} color={s.sun} />
      <directionalLight position={[140, 80, 200]} intensity={0.5} color="#ffe2c8" />
      <ambientLight intensity={0.2 + flash * 1.5} />
      {coast ? <Sea t={t} color={s.sea} /> : null}
      {coast ? <Beach t={t} /> : null}
    </>
  );
};
