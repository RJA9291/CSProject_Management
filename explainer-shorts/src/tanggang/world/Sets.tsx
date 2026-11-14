// Sets and props for "Kenapa Si Tanggang Bertukar Menjadi Batu?": a merchant ship (wood or stone),
// a small sampan, and a stone version of any look.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import type {Look} from '../../santubong/world/Chibi';

const flat = (c: string) => new THREE.MeshLambertMaterial({color: c, flatShading: true});
const STONE = '#8d8a86';

// Turns a character look into grey stone.
export const stoneLook = (l: Look): Look => ({...l, skin: '#9a9792', hair: '#77736e', outfit: STONE, trim: '#7d7a75'});

// Low-poly merchant ship facing +x. `stone` turns everything grey and still; `t` rocks it on the water.
export const Ship: React.FC<{t: number; stone?: boolean; grand?: boolean}> = ({t, stone = false, grand = false}) => {
  const hull = useMemo(() => flat(stone ? STONE : '#7a4e2c'), [stone]);
  const deck = useMemo(() => flat(stone ? '#9a9792' : '#b08050'), [stone]);
  const trim = useMemo(() => flat(stone ? '#7d7a75' : grand ? '#f4c430' : '#c93434'), [stone, grand]);
  const sail = useMemo(() => flat(stone ? '#a5a29d' : '#f4ecd8'), [stone]);
  const mast = useMemo(() => flat(stone ? '#7d7a75' : '#5b3e24'), [stone]);
  const rock = stone ? 0 : Math.sin(t * 1.2) * 0.04;
  const bob = stone ? 0 : Math.sin(t * 1.6) * 0.15;
  return (
    <group rotation={[rock, 0, rock * 0.5]} position={[0, bob, 0]}>
      <mesh material={hull} position={[0, 1.2, 0]} scale={[16, 2.4, 5]}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh material={hull} position={[8.6, 1.6, 0]} rotation={[0, 0, -0.5]} scale={[3, 2.2, 4.6]}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh material={hull} position={[-8.3, 2.2, 0]} scale={[2.4, 3.6, 5]}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh material={deck} position={[0, 2.45, 0]} scale={[15.6, 0.1, 4.6]}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh material={trim} position={[0, 2.2, 2.52]} scale={[16, 0.3, 0.05]}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      {[-3, 3.5].map((x, i) => (
        <group key={x} position={[x, 2.4, 0]}>
          <mesh material={mast} position={[0, 5, 0]}>
            <cylinderGeometry args={[0.18, 0.24, 10, 6]} />
          </mesh>
          <mesh material={sail} position={[0, 5.6 - i * 0.4, 0.2]} scale={[4.4 - i * 0.6, 5.4 - i * 0.6, 0.12]}>
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
          {grand && !stone ? (
            <mesh position={[0, 10.4, 0]}>
              <boxGeometry args={[1.2, 0.7, 0.05]} />
              <meshLambertMaterial color="#c93434" />
            </mesh>
          ) : null}
        </group>
      ))}
    </group>
  );
};

// Small rowing boat facing +x.
export const Sampan: React.FC<{t: number}> = ({t}) => {
  const wood = useMemo(() => flat('#8a5a34'), []);
  return (
    <group position={[0, Math.sin(t * 2) * 0.08, 0]} rotation={[0, 0, Math.sin(t * 1.5) * 0.03]}>
      <mesh material={wood} position={[0, 0.25, 0]} scale={[3.2, 0.5, 1.1]}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh material={wood} position={[1.8, 0.4, 0]} rotation={[0, 0, -0.5]} scale={[0.8, 0.5, 1]}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>
      <mesh material={wood} position={[0.4, 0.9, 0.7]} rotation={[0.9, 0, Math.sin(t * 3) * 0.5]}>
        <cylinderGeometry args={[0.05, 0.05, 2.2, 5]} />
      </mesh>
    </group>
  );
};
