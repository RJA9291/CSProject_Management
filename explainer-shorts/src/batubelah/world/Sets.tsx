// Sets and props for "Kenapa Batu Belah Batu Bertangkup Menelan Manusia?":
// mangrove mudflat with mudskippers (ikan tembakul), a jungle clearing with the opening rock,
// a bowl of fish roe, a basket, tears and the strands of hair left at the rock.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {random} from 'remotion';

const flat = (c: string) => new THREE.MeshLambertMaterial({color: c, flatShading: true});

// ---- Mangrove mudflat ----
const Mangrove: React.FC<{x: number; z: number; s?: number}> = ({x, z, s = 1}) => {
  const bark = useMemo(() => flat('#6b5236'), []);
  const leaf = useMemo(() => flat('#3e7d45'), []);
  return (
    <group position={[x, 0, z]} scale={s}>
      {[0, 1, 2, 3, 4].map((k) => {
        const a = (k / 5) * Math.PI * 2;
        return (
          <mesh key={k} material={bark} position={[Math.cos(a) * 0.9, 0.7, Math.sin(a) * 0.9]} rotation={[Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6]}>
            <cylinderGeometry args={[0.08, 0.12, 1.8, 5]} />
          </mesh>
        );
      })}
      <mesh material={bark} position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.2, 0.28, 2.6, 6]} />
      </mesh>
      {[[0, 4.4, 0, 2.2], [-1.2, 3.9, 0.4, 1.5], [1.2, 4.0, -0.3, 1.6]].map(([lx, ly, lz, r], i) => (
        <mesh key={i} material={leaf} position={[lx, ly, lz]} scale={[r, r * 0.7, r]}>
          <icosahedronGeometry args={[1, 0]} />
        </mesh>
      ))}
    </group>
  );
};

// Ikan tembakul: big eyes on top, hopping on the mud.
export const Mudskipper: React.FC<{x: number; z: number; t: number; phase: number; rot?: number}> = ({x, z, t, phase, rot = 0}) => {
  const body = useMemo(() => flat('#8a7a5a'), []);
  const fin = useMemo(() => flat('#5f9ad0'), []);
  const hop = Math.max(0, Math.sin(t * 5 + phase)) * 0.35;
  return (
    <group position={[x, 0.18 + hop, z]} rotation={[0, rot, 0]}>
      <mesh material={body} scale={[0.22, 0.18, 0.5]}>
        <sphereGeometry args={[1, 10, 8]} />
      </mesh>
      <mesh material={body} position={[0, 0, 0.55]} scale={[0.04, 0.15, 0.22]}>
        <sphereGeometry args={[1, 6, 4]} />
      </mesh>
      <mesh material={fin} position={[0, 0.2, 0.05]} scale={[0.03, 0.12, 0.25]}>
        <sphereGeometry args={[1, 6, 4]} />
      </mesh>
      {[-0.08, 0.08].map((ex) => (
        <group key={ex} position={[ex, 0.18, -0.3]}>
          <mesh>
            <sphereGeometry args={[0.07, 8, 6]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0.02, -0.05]}>
            <sphereGeometry args={[0.035, 6, 4]} />
            <meshBasicMaterial color="#111111" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const Swamp: React.FC<{t: number}> = ({t}) => {
  const trees = useMemo(() => Array.from({length: 26}, (_, i) => ({x: -40 + random(`mx${i}`) * 80, z: -6 - random(`mz${i}`) * 50, s: 0.9 + random(`ms${i}`) * 0.7})), []);
  const puddles = useMemo(() => Array.from({length: 9}, (_, i) => ({x: -16 + random(`wx${i}`) * 32, z: -12 + random(`wz${i}`) * 12, r: 0.8 + random(`wr${i}`) * 1.2})), []);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -100]}>
        <planeGeometry args={[600, 400]} />
        <meshLambertMaterial color="#6e5a40" />
      </mesh>
      {puddles.map((p, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[p.x, 0.02, p.z]}>
          <circleGeometry args={[p.r, 10]} />
          <meshLambertMaterial color="#4f5f5a" />
        </mesh>
      ))}
      {trees.map((m, i) => (
        <Mangrove key={i} x={m.x} z={m.z} s={m.s} />
      ))}
      {Array.from({length: 7}, (_, i) => (
        <Mudskipper key={i} x={-4.5 + i * 1.5} z={1.6 + (i % 3) * 0.7} t={t} phase={i * 1.7} rot={i * 0.9} />
      ))}
    </>
  );
};

// ---- Jungle clearing with the rock ----
const JungleTree: React.FC<{x: number; z: number; s: number; c: string}> = ({x, z, s, c}) => {
  const trunk = useMemo(() => flat('#5b4330'), []);
  const leaf = useMemo(() => flat(c), [c]);
  return (
    <group position={[x, 0, z]} scale={s}>
      <mesh material={trunk} position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.35, 0.5, 5, 6]} />
      </mesh>
      <mesh material={leaf} position={[0, 6.2, 0]} scale={[3, 2.4, 3]}>
        <icosahedronGeometry args={[1, 0]} />
      </mesh>
      <mesh material={leaf} position={[1.2, 5.2, 0.6]} scale={[1.8, 1.5, 1.8]}>
        <icosahedronGeometry args={[1, 0]} />
      </mesh>
    </group>
  );
};

export const ROCK_POS: [number, number, number] = [0, 0, -6];

// Two half-boulders hinged at the base. `open` 0..1 swings the halves apart; `glow` lights the gap.
export const BatuBelah: React.FC<{open: number; glow?: number; t: number}> = ({open, glow = 0, t}) => {
  const rock = useMemo(() => flat('#6f6a72'), []);
  const rock2 = useMemo(() => flat('#5e5963'), []);
  const moss = useMemo(() => flat('#4f7a4a'), []);
  const inside = useMemo(() => new THREE.MeshBasicMaterial({color: '#140f1c'}), []);
  const a = open * 0.55;
  return (
    <group position={ROCK_POS}>
      {/* dark inner cavity, seen when it opens */}
      <mesh material={inside} position={[0, 2.6, -0.4]} scale={[1.6, 2.4, 1.2]}>
        <sphereGeometry args={[1, 10, 8]} />
      </mesh>
      {glow > 0 ? (
        <mesh position={[0, 2.6, 0.2]} scale={[1.2 + open, 2.6, 0.2]}>
          <sphereGeometry args={[1, 10, 8]} />
          <meshBasicMaterial color="#b9a8ff" transparent opacity={glow * (0.35 + 0.15 * Math.sin(t * 6))} />
        </mesh>
      ) : null}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.05, 0, 0]} rotation={[0, 0, -side * a]}>
          <group position={[side * 2.1, 3, 0]}>
            <mesh material={side < 0 ? rock : rock2} scale={[2.1, 3.1, 2.6]}>
              <icosahedronGeometry args={[1, 1]} />
            </mesh>
            <mesh material={moss} position={[side * 0.4, 2.3, 0.6]} scale={[1.2, 0.5, 1.2]}>
              <icosahedronGeometry args={[1, 0]} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

export const Jungle: React.FC = () => {
  const trees = useMemo(() => {
    const out: {x: number; z: number; s: number; c: string}[] = [];
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * Math.PI * 2;
      const r = 18 + random(`jr${i}`) * 22;
      const z = -6 + Math.sin(a) * r;
      if (z > 8) continue; // keep the camera side open
      out.push({x: Math.cos(a) * r, z, s: 0.9 + random(`js${i}`) * 0.8, c: ['#2f6b3c', '#3d7d45', '#285e36'][i % 3]});
    }
    return out;
  }, []);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -60]}>
        <planeGeometry args={[600, 400]} />
        <meshLambertMaterial color="#4f7d44" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[12, 16]} />
        <meshLambertMaterial color="#8a7a58" />
      </mesh>
      {trees.map((t, i) => (
        <JungleTree key={i} {...t} />
      ))}
    </>
  );
};

// ---- Props ----
// Bowl of orange fish roe; `left` 0..1 is how much is still in it.
export const RoeBowl: React.FC<{left: number}> = ({left}) => {
  const n = Math.round(left * 14);
  return (
    <group>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.42, 0.26, 0.36, 12, 1, true]} />
        <meshLambertMaterial color="#a0623a" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.26, 0.26, 0.02, 12]} />
        <meshLambertMaterial color="#a0623a" />
      </mesh>
      {Array.from({length: n}, (_, i) => {
        const a = i * 2.4;
        const r = (i % 5) * 0.06;
        return (
          <mesh key={i} position={[Math.cos(a) * r, 0.22 + Math.floor(i / 5) * 0.06, Math.sin(a) * r]}>
            <sphereGeometry args={[0.07, 6, 5]} />
            <meshLambertMaterial color="#f08a2b" emissive="#7a3a00" emissiveIntensity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
};

export const Basket: React.FC = () => (
  <group position={[0, -0.25, 0.15]}>
    <mesh>
      <cylinderGeometry args={[0.32, 0.24, 0.4, 8, 1, true]} />
      <meshLambertMaterial color="#c9a06a" side={THREE.DoubleSide} flatShading />
    </mesh>
    <mesh position={[0, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[0.3, 0.03, 4, 10, Math.PI]} />
      <meshLambertMaterial color="#8c6b3c" />
    </mesh>
  </group>
);

// Tears falling from both eyes of a character whose head centre is at `head`.
export const Tears: React.FC<{head: [number, number, number]; t: number; scale?: number}> = ({head, t, scale = 1}) => (
  <>
    {[-1, 1].flatMap((side) =>
      [0, 1].map((k) => {
        const p = (t * 1.6 + k * 0.5 + (side > 0 ? 0.25 : 0)) % 1;
        return (
          <mesh key={`${side}${k}`} position={[head[0] + side * 0.24 * scale, head[1] - (0.1 + p * 0.9) * scale, head[2] + 0.58 * scale]} scale={(1 - p * 0.4) * scale}>
            <sphereGeometry args={[0.055, 6, 5]} />
            <meshBasicMaterial color="#7cc3ee" transparent opacity={1 - p} />
          </mesh>
        );
      }),
    )}
  </>
);

// A few strands of hair left in the crack of the closed rock.
export const Hair: React.FC = () => (
  <group position={[ROCK_POS[0], 1.6, ROCK_POS[2] + 2.85]}>
    {[-0.12, 0, 0.12].map((x, i) => (
      <mesh key={i} position={[x, -0.4, 0.02]} rotation={[0, 0, x * 2]}>
        <boxGeometry args={[0.03, 1.1, 0.02]} />
        <meshBasicMaterial color="#141014" />
      </mesh>
    ))}
  </group>
);
