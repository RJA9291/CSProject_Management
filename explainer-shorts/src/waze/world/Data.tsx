// Data-story effects: phone beacons on every car, packets flying to a cloud server,
// the road segment turning green -> orange -> red, and user report pins.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {interpolate} from 'remotion';
import {JAM, traffic} from './Car';

export const SERVER_POS: [number, number, number] = [0, 46, -330];

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// A floating phone + pulsing ring above each car once phones are "switched on" (from `on`, seconds).
export const Beacons: React.FC<{t: number; on: number}> = ({t, on}) => {
  const phone = useMemo(() => new THREE.MeshBasicMaterial({color: '#1265c8'}), []);
  const screen = useMemo(() => new THREE.MeshBasicMaterial({color: '#65c7f4'}), []);
  if (t < on) return null;
  return (
    <>
      {traffic(t).map((v, i) => {
        const appear = interpolate(t, [on + (i % 12) * 0.05, on + (i % 12) * 0.05 + 0.3], [0, 1], clamp);
        const pulse = ((t * 1.2 + i * 0.37) % 1);
        return (
          <group key={v.id} position={[v.x, 0, v.z]}>
            <group position={[0, 3.2 + Math.sin(t * 3 + i) * 0.15, 0]} scale={appear}>
              <mesh material={phone}>
                <boxGeometry args={[0.9, 1.5, 0.15]} />
              </mesh>
              <mesh material={screen} position={[0, 0.05, 0.08]}>
                <boxGeometry args={[0.7, 1.15, 0.02]} />
              </mesh>
            </group>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} scale={(1 + pulse * 2.6) * appear}>
              <ringGeometry args={[1.6, 1.85, 24]} />
              <meshBasicMaterial color="#65c7f4" transparent opacity={(1 - pulse) * 0.8} />
            </mesh>
          </group>
        );
      })}
    </>
  );
};

// Small glowing packets rising from each car to the cloud server (from `on`, seconds).
export const Packets: React.FC<{t: number; on: number}> = ({t, on}) => {
  const mat = useMemo(() => new THREE.MeshBasicMaterial({color: '#ffd84d'}), []);
  if (t < on) return null;
  const cars = traffic(t);
  return (
    <>
      {cars.map((v, i) => {
        const p = ((t - on) * 0.55 + (i * 0.173) % 1) % 1;
        const x = v.x + (SERVER_POS[0] - v.x) * p;
        const y = 4 + (SERVER_POS[1] - 4) * p + Math.sin(p * Math.PI) * 6;
        const z = v.z + (SERVER_POS[2] - v.z) * p;
        return (
          <mesh key={v.id} material={mat} position={[x, y, z]} rotation={[t * 2, t * 3, 0]}>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
          </mesh>
        );
      })}
    </>
  );
};

// Low-poly cloud with a little server rack whose lights blink.
export const CloudServer: React.FC<{t: number; scale?: number}> = ({t, scale = 1}) => {
  const white = useMemo(() => new THREE.MeshLambertMaterial({color: '#ffffff', flatShading: true}), []);
  const rack = useMemo(() => new THREE.MeshLambertMaterial({color: '#102f69', flatShading: true}), []);
  const puffs: [number, number, number, number][] = [
    [0, 0, 0, 7],
    [-7, -1.5, 1, 5],
    [7, -1.5, 0.5, 5.5],
    [-3.5, 3, -1, 5],
    [4, 2.5, -1, 4.5],
  ];
  return (
    <group position={SERVER_POS} scale={scale}>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} material={white} position={[x, y, z]}>
          <icosahedronGeometry args={[r, 1]} />
        </mesh>
      ))}
      <group position={[0, -2, 6.5]}>
        <mesh material={rack}>
          <boxGeometry args={[4.4, 5.4, 1.2]} />
        </mesh>
        {[0, 1, 2].map((k) => (
          <mesh key={k} position={[-1.3, 1.6 - k * 1.6, 0.62]}>
            <boxGeometry args={[0.5, 0.5, 0.05]} />
            <meshBasicMaterial color={Math.floor(t * 6 + k) % 2 ? '#39d36f' : '#ffd84d'} />
          </mesh>
        ))}
        {[0, 1, 2].map((k) => (
          <mesh key={`b${k}`} position={[0.6, 1.6 - k * 1.6, 0.62]}>
            <boxGeometry args={[2.2, 0.25, 0.05]} />
            <meshBasicMaterial color="#65c7f4" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Transparent overlay on the jam segment: grey -> green -> orange -> red as data arrives.
export const RoadStatus: React.FC<{level: number}> = ({level}) => {
  if (level <= 0) return null;
  const color = level < 1 ? '#36a86b' : level < 2 ? '#f4a51c' : '#e03c3c';
  const len = JAM.from - JAM.to + 60;
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, (JAM.from + JAM.to) / 2 - 20]}>
      <planeGeometry args={[12, len]} />
      <meshBasicMaterial color={color} transparent opacity={0.45} />
    </mesh>
  );
};

// Map-style report pins dropping onto the road.
export type Pin = {x: number; z: number; color: string; at: number};
export const Pins: React.FC<{t: number; pins: Pin[]}> = ({t, pins}) => (
  <>
    {pins.map((p, i) => {
      if (t < p.at) return null;
      const k = Math.min(1, (t - p.at) / 0.45);
      const bounce = k < 1 ? (1 - k) * 20 : Math.max(0, Math.sin((t - p.at - 0.45) * 14)) * 0.6 * Math.exp(-(t - p.at) * 3);
      return (
        <group key={i} position={[p.x, 6 + bounce, p.z]} scale={2.2}>
          <mesh position={[0, 0.9, 0]}>
            <sphereGeometry args={[0.9, 14, 10]} />
            <meshLambertMaterial color={p.color} />
          </mesh>
          <mesh position={[0, 0.9, 0.5]}>
            <circleGeometry args={[0.42, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, -0.35, 0]} rotation={[Math.PI, 0, 0]}>
            <coneGeometry args={[0.55, 1.6, 12]} />
            <meshLambertMaterial color={p.color} />
          </mesh>
        </group>
      );
    })}
  </>
);
