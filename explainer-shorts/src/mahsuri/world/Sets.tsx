// Sets and props for "Kenapa Mahsuri Dikatakan Menyumpah Langkawi?".
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {random} from 'remotion';

const flat = (c: string) => new THREE.MeshLambertMaterial({color: c, flatShading: true});

// Green island hills behind the beach (Langkawi's hilly skyline).
export const IslandHills: React.FC = () => {
  const mats = useMemo(() => ['#3f7f4c', '#4a8b52', '#356f43'].map(flat), []);
  const hills = useMemo(
    () => Array.from({length: 14}, (_, i) => ({x: -320 + i * 48 + random(`hx${i}`) * 20, z: -90 - random(`hz${i}`) * 140, r: 30 + random(`hr${i}`) * 40, h: 0.7 + random(`hh${i}`) * 0.9})),
    [],
  );
  return (
    <>
      {hills.map((h, i) => (
        <mesh key={i} material={mats[i % 3]} position={[h.x, 0, h.z]} scale={[h.r, h.r * h.h, h.r * 0.8]}>
          <icosahedronGeometry args={[1, 1]} />
        </mesh>
      ))}
    </>
  );
};

// The chief's house: a bigger raised house with a two-tier roof.
export const ChiefHouse: React.FC<{x: number; z: number}> = ({x, z}) => {
  const wood = useMemo(() => flat('#a87a4a'), []);
  const roof = useMemo(() => flat('#6b4a2c'), []);
  const post = useMemo(() => flat('#5b3e24'), []);
  return (
    <group position={[x, 0, z]}>
      {[[-3.5, -2.5], [3.5, -2.5], [-3.5, 2.5], [3.5, 2.5], [0, 2.5], [0, -2.5]].map(([px, pz], i) => (
        <mesh key={i} material={post} position={[px, 1.2, pz]}>
          <boxGeometry args={[0.35, 2.4, 0.35]} />
        </mesh>
      ))}
      <mesh material={wood} position={[0, 3.8, 0]}>
        <boxGeometry args={[8, 2.8, 5.6]} />
      </mesh>
      <mesh material={roof} position={[0, 6.3, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1.45, 1, 1]}>
        <coneGeometry args={[5.4, 2.4, 4]} />
      </mesh>
      <mesh material={roof} position={[0, 7.8, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.6, 1.6, 4]} />
      </mesh>
      <mesh position={[0, 3.4, 2.82]}>
        <boxGeometry args={[1.4, 2, 0.05]} />
        <meshLambertMaterial color="#3e2a18" />
      </mesh>
    </group>
  );
};

// Big old tree in the open field.
export const BigTree: React.FC<{x: number; z: number}> = ({x, z}) => {
  const trunk = useMemo(() => flat('#5b4330'), []);
  const leaf = useMemo(() => flat('#2f6b3c'), []);
  return (
    <group position={[x, 0, z]}>
      <mesh material={trunk} position={[0, 2.6, 0]}>
        <cylinderGeometry args={[0.55, 0.85, 5.2, 7]} />
      </mesh>
      {[[0, 6.6, 0, 3.4], [-2, 5.8, 0.4, 2.2], [2.2, 6, -0.3, 2.4]].map(([lx, ly, lz, r], i) => (
        <mesh key={i} material={leaf} position={[lx, ly, lz]} scale={[r, r * 0.75, r]}>
          <icosahedronGeometry args={[1, 0]} />
        </mesh>
      ))}
    </group>
  );
};

// Open field ringed by trees (for the judgement scene).
export const Field: React.FC = () => {
  const trees = useMemo(() => Array.from({length: 26}, (_, i) => {
    const a = (i / 26) * Math.PI * 2;
    const r = 22 + random(`fr${i}`) * 16;
    return {x: Math.cos(a) * r, z: -6 + Math.sin(a) * r, s: 0.8 + random(`fs${i}`) * 0.7};
  }).filter((t) => t.z < 6), []);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -60]}>
        <planeGeometry args={[600, 400]} />
        <meshLambertMaterial color="#6f9a52" />
      </mesh>
      {trees.map((t, i) => (
        <BigTree key={i} x={t.x} z={t.z} />
      ))}
    </>
  );
};

// Padi field with a granary that can burn (`fire` 0..1) and smoke.
export const PadiField: React.FC<{t: number; fire: number}> = ({t, fire}) => {
  const rows = useMemo(() => Array.from({length: 18}, (_, i) => i), []);
  const padi = useMemo(() => flat('#c9b84a'), []);
  const flame = useMemo(() => new THREE.MeshBasicMaterial({color: '#ff8a2a'}), []);
  const flame2 = useMemo(() => new THREE.MeshBasicMaterial({color: '#ffd23f'}), []);
  const smoke = useMemo(() => new THREE.MeshLambertMaterial({color: '#4a4a52', transparent: true, opacity: 0.55}), []);
  const wood = useMemo(() => flat(fire > 0.5 ? '#3a2a20' : '#a87a4a'), [fire]);
  const roof = useMemo(() => flat(fire > 0.5 ? '#2a2018' : '#6b4a2c'), [fire]);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -60]}>
        <planeGeometry args={[600, 400]} />
        <meshLambertMaterial color="#8fae4a" />
      </mesh>
      {rows.map((r) => (
        <mesh key={r} material={padi} position={[-18 + r * 2.1, 0.45, -6]} scale={[0.6, 0.9, 30]}>
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      ))}
      {/* granary (jelapang) */}
      <group position={[0, 0, -2]}>
        {[[-1.6, -1.2], [1.6, -1.2], [-1.6, 1.2], [1.6, 1.2]].map(([px, pz], i) => (
          <mesh key={i} material={wood} position={[px, 0.8, pz]}>
            <boxGeometry args={[0.3, 1.6, 0.3]} />
          </mesh>
        ))}
        <mesh material={wood} position={[0, 2.6, 0]}>
          <boxGeometry args={[3.6, 2, 3]} />
        </mesh>
        <mesh material={roof} position={[0, 4.4, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[3.2, 1.8, 4]} />
        </mesh>
        {fire > 0
          ? Array.from({length: 9}, (_, i) => {
              const h = (0.8 + 0.5 * Math.abs(Math.sin(t * 9 + i * 1.7))) * fire;
              return (
                <mesh key={i} material={i % 2 ? flame : flame2} position={[-1.5 + (i % 3) * 1.5, 3 + h, -0.8 + Math.floor(i / 3) * 0.8]} scale={[0.5, h * 1.6, 0.5]}>
                  <coneGeometry args={[1, 1.4, 5]} />
                </mesh>
              );
            })
          : null}
        {fire > 0
          ? Array.from({length: 6}, (_, i) => {
              const p = ((t * 0.35 + i / 6) % 1);
              return (
                <mesh key={`s${i}`} material={smoke} position={[Math.sin(i * 2) * 1.2 + p * 2, 5 + p * 12, Math.cos(i) * 0.8]} scale={(1 + p * 2.5) * fire}>
                  <icosahedronGeometry args={[1, 0]} />
                </mesh>
              );
            })
          : null}
      </group>
    </>
  );
};

// Modern Langkawi: a few resort blocks and boats on the sea.
export const Modern: React.FC<{t: number}> = ({t}) => {
  const wall = useMemo(() => flat('#f4f1ea'), []);
  const roof = useMemo(() => flat('#1265c8'), []);
  const hull = useMemo(() => flat('#ffffff'), []);
  const stripe = useMemo(() => flat('#c93434'), []);
  return (
    <>
      {[-40, -22, 22, 40].map((x, i) => (
        <group key={x} position={[x, 0, -24 - (i % 2) * 6]}>
          <mesh material={wall} position={[0, 4, 0]}>
            <boxGeometry args={[12, 8, 6]} />
          </mesh>
          <mesh material={roof} position={[0, 8.6, 0]}>
            <boxGeometry args={[12.6, 1.2, 6.6]} />
          </mesh>
          {[0, 1, 2].map((r) => (
            <mesh key={r} position={[0, 2 + r * 2.2, 3.02]}>
              <boxGeometry args={[10, 0.9, 0.05]} />
              <meshLambertMaterial color="#65c7f4" />
            </mesh>
          ))}
        </group>
      ))}
      {[[-18, 40], [10, 60], [30, 36]].map(([x, z], i) => (
        <group key={i} position={[x + Math.sin(t * 0.3 + i) * 2, -1 + Math.sin(t * 2 + i) * 0.2, z]} rotation={[0, 0.4 + i, 0]}>
          <mesh material={hull} scale={[1.6, 0.8, 5]}>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
          <mesh material={stripe} position={[0, 0.2, 0]} scale={[1.65, 0.2, 5.05]}>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
          <mesh material={hull} position={[0, 0.9, -0.6]} scale={[1.2, 0.8, 1.6]}>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
        </group>
      ))}
    </>
  );
};

// Simplified white tomb with a low fence, standing for Makam Mahsuri.
export const Makam: React.FC<{x: number; z: number}> = ({x, z}) => {
  const white = useMemo(() => flat('#f4f1ea'), []);
  const fence = useMemo(() => flat('#d9b76a'), []);
  return (
    <group position={[x, 0, z]}>
      <mesh material={white} position={[0, 0.3, 0]}>
        <boxGeometry args={[2.2, 0.6, 3.6]} />
      </mesh>
      {[-1.3, 1.3].map((zz) => (
        <mesh key={zz} material={white} position={[0, 1.1, zz]}>
          <boxGeometry args={[0.6, 1.0, 0.25]} />
        </mesh>
      ))}
      {Array.from({length: 10}, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <mesh key={i} material={fence} position={[Math.cos(a) * 3, 0.5, Math.sin(a) * 3.4]}>
            <boxGeometry args={[0.15, 1, 0.15]} />
          </mesh>
        );
      })}
    </group>
  );
};

// Keris held in the hand.
export const Keris: React.FC = () => (
  <group position={[0, -0.25, 0.2]}>
    <mesh position={[0, -0.45, 0]}>
      <boxGeometry args={[0.07, 0.8, 0.02]} />
      <meshLambertMaterial color="#c9ced6" />
    </mesh>
    <mesh position={[0, 0.05, 0]}>
      <boxGeometry args={[0.1, 0.22, 0.1]} />
      <meshLambertMaterial color="#c9a020" />
    </mesh>
  </group>
);

// Soft white light rising around a character (the "darah putih" sign, shown symbolically).
export const WhiteLight: React.FC<{pos: [number, number, number]; v: number; t: number}> = ({pos, v, t}) => {
  if (v <= 0) return null;
  return (
    <group position={pos}>
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[1.1, 1.4, 6, 16, 1, true]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.35 * v} side={THREE.DoubleSide} />
      </mesh>
      {Array.from({length: 12}, (_, i) => {
        const p = ((t * 0.5 + i / 12) % 1);
        return (
          <mesh key={i} position={[Math.cos(i * 2.1) * 1.1, p * 6, Math.sin(i * 2.1) * 1.1]}>
            <octahedronGeometry args={[0.12, 0]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={(1 - p) * v} />
          </mesh>
        );
      })}
    </group>
  );
};

// Baby bundle carried in the arms.
export const Baby: React.FC = () => (
  <group position={[0, -0.15, 0.25]}>
    <mesh scale={[0.3, 0.22, 0.22]}>
      <sphereGeometry args={[1, 10, 8]} />
      <meshLambertMaterial color="#f4f1ea" />
    </mesh>
    <mesh position={[0.18, 0.08, 0.05]}>
      <sphereGeometry args={[0.12, 10, 8]} />
      <meshLambertMaterial color="#f2c29b" />
    </mesh>
  </group>
);
