// Low-poly cars and the deterministic traffic model shared by every shot.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {random} from 'remotion';
import {ROAD} from './World';

const CAR_COLORS = ['#e8edf2', '#d94b4b', '#3d7bd9', '#f2c14e', '#5bb07a', '#9a6ad8', '#f08a4b', '#2d3446', '#bfc6d1'];

const Wheel: React.FC<{x: number; z: number}> = ({x, z}) => (
  <mesh position={[x, 0.38, z]} rotation={[0, 0, Math.PI / 2]}>
    <cylinderGeometry args={[0.38, 0.38, 0.3, 10]} />
    <meshLambertMaterial color="#1c1f26" />
  </mesh>
);

// Generic hatchback facing -z. `glow` lights the brake lights (slow traffic).
export const Car: React.FC<{color: string; brake?: boolean}> = ({color, brake = false}) => {
  const body = useMemo(() => new THREE.MeshLambertMaterial({color, flatShading: true}), [color]);
  return (
    <group>
      <mesh material={body} position={[0, 0.72, 0]}>
        <boxGeometry args={[1.9, 0.62, 4.2]} />
      </mesh>
      <mesh position={[0, 1.28, 0.35]}>
        <boxGeometry args={[1.66, 0.55, 2.3]} />
        <meshLambertMaterial color="#2b3a55" flatShading />
      </mesh>
      <mesh material={body} position={[0, 1.58, 0.35]}>
        <boxGeometry args={[1.7, 0.08, 2.1]} />
      </mesh>
      {[-0.65, 0.65].map((x) => (
        <React.Fragment key={x}>
          <mesh position={[x, 0.82, -2.11]}>
            <boxGeometry args={[0.42, 0.16, 0.04]} />
            <meshBasicMaterial color="#fff6d6" />
          </mesh>
          <mesh position={[x, 0.85, 2.11]}>
            <boxGeometry args={[0.42, 0.16, 0.04]} />
            <meshBasicMaterial color={brake ? '#ff3030' : '#9e2a2a'} />
          </mesh>
        </React.Fragment>
      ))}
      <Wheel x={-0.92} z={-1.35} />
      <Wheel x={0.92} z={-1.35} />
      <Wheel x={-0.92} z={1.35} />
      <Wheel x={0.92} z={1.35} />
    </group>
  );
};

// ---- Traffic ----
// The jam: a queue of cars crawling through z = JAM.from..JAM.to. Free-flowing cars elsewhere.
export const JAM = {from: -260, to: -430, speed: 2.6};
export type Vehicle = {id: number; x: number; z: number; color: string; slow: boolean; beacon: boolean};

const JAM_CARS = Array.from({length: 33}, (_, i) => ({
  id: i,
  lane: ROAD.lanes[i % 3],
  z0: JAM.from - Math.floor(i / 3) * 15 - random(`jz${i}`) * 5,
  color: CAR_COLORS[Math.floor(random(`jc${i}`) * CAR_COLORS.length)],
}));
const FREE_CARS = Array.from({length: 10}, (_, i) => ({
  id: 100 + i,
  lane: ROAD.lanes[1 + (i % 2)], // the left lane stays clear for the hero car
  z0: 40 - i * 26 - random(`fz${i}`) * 8,
  speed: 22 + random(`fs${i}`) * 4,
  color: CAR_COLORS[Math.floor(random(`fc${i}`) * CAR_COLORS.length)],
}));

// Queue slot of each free car within its lane (0 = closest to the jam).
const SLOT = FREE_CARS.map((c) => FREE_CARS.filter((o) => o.lane === c.lane && o.z0 < c.z0).length);

// Positions at time t (seconds, global). Free cars catch up with the back of the queue and slow down there.
export const traffic = (t: number): Vehicle[] => {
  const tail = JAM.from - JAM.speed * t;
  const jam = JAM_CARS.map((c) => ({id: c.id, x: c.lane, z: c.z0 - JAM.speed * t, color: c.color, slow: true, beacon: true}));
  const free = FREE_CARS.map((c, i) => {
    const raw = c.z0 - c.speed * t;
    const stop = tail + 12 + SLOT[i] * 9;
    return {id: c.id, x: c.lane, z: Math.max(raw, stop), color: c.color, slow: raw <= stop, beacon: true};
  });
  return [...jam, ...free];
};

export const Traffic: React.FC<{t: number; skip?: number}> = ({t, skip}) => (
  <>
    {traffic(t).map((v) =>
      v.id === skip ? null : (
        <group key={v.id} position={[v.x, 0, v.z]}>
          <Car color={v.color} brake={v.slow} />
        </group>
      ),
    )}
  </>
);
