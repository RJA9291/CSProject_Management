// Low-poly highway world: sky dome, ground, 3-lane road, barriers, street lights, trees, hills, mountains.
import React, {useMemo} from 'react';
import * as THREE from 'three';
import {random} from 'remotion';

export const ROAD = {zNear: 80, zFar: -1000, width: 13, lanes: [-3.6, 0, 3.6]};
export const PALETTE = {
  skyTop: '#5d8fdc',
  skyHorizon: '#f6c9a6',
  ground: '#7fb36b',
  groundFar: '#6c9e64',
  road: '#3c4150',
  line: '#f4f4f0',
  edge: '#f4c430',
  barrier: '#d4d8e0',
  tree: ['#3f8a4c', '#4f9a52', '#2f7a46'],
  trunk: '#7a5236',
  hill: ['#6aa66a', '#5d9862', '#78b06f'],
  mountain: ['#7f8fb8', '#8c9cc4', '#6f80ad'],
};

const flat = (color: string) => new THREE.MeshLambertMaterial({color, flatShading: true});

// Gradient sky dome (vertex colours) so the horizon glows like a soft sunset.
const Sky: React.FC = () => {
  const geo = useMemo(() => {
    const g = new THREE.SphereGeometry(1400, 24, 16);
    const top = new THREE.Color(PALETTE.skyTop);
    const hor = new THREE.Color(PALETTE.skyHorizon);
    const colors: number[] = [];
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) / 1400;
      const c = hor.clone().lerp(top, Math.min(1, Math.max(0, y * 2.2)));
      colors.push(c.r, c.g, c.b);
    }
    g.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, []);
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial vertexColors side={THREE.BackSide} fog={false} />
    </mesh>
  );
};

const Trees: React.FC = () => {
  const items = useMemo(() => {
    const out: {x: number; z: number; s: number; c: number; kind: number}[] = [];
    for (let z = ROAD.zNear; z > ROAD.zFar; z -= 9) {
      for (const side of [-1, 1]) {
        const k = `${z}-${side}`;
        if (random(`t${k}`) < 0.25) continue;
        out.push({x: side * (13 + random(`tx${k}`) * 26), z: z + random(`tz${k}`) * 6, s: 0.8 + random(`ts${k}`) * 0.9, c: Math.floor(random(`tc${k}`) * 3), kind: random(`tk${k}`) < 0.5 ? 0 : 1});
      }
    }
    return out;
  }, []);
  const mats = useMemo(() => PALETTE.tree.map(flat), []);
  const trunk = useMemo(() => flat(PALETTE.trunk), []);
  const cone = useMemo(() => new THREE.ConeGeometry(1.6, 4, 6), []);
  const ball = useMemo(() => new THREE.IcosahedronGeometry(1.9, 0), []);
  const stem = useMemo(() => new THREE.CylinderGeometry(0.25, 0.3, 1.6, 5), []);
  return (
    <>
      {items.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.s}>
          <mesh geometry={stem} material={trunk} position={[0, 0.8, 0]} />
          <mesh geometry={t.kind ? ball : cone} material={mats[t.c]} position={[0, t.kind ? 3.2 : 3.4, 0]} />
        </group>
      ))}
    </>
  );
};

const Hills: React.FC = () => {
  const items = useMemo(() => {
    const out: {x: number; z: number; r: number; h: number; c: number}[] = [];
    for (let z = ROAD.zNear; z > ROAD.zFar; z -= 55) {
      for (const side of [-1, 1]) {
        const k = `${z}-${side}`;
        out.push({x: side * (60 + random(`hx${k}`) * 50), z: z + random(`hz${k}`) * 30, r: 18 + random(`hr${k}`) * 16, h: 0.35 + random(`hh${k}`) * 0.35, c: Math.floor(random(`hc${k}`) * 3)});
      }
    }
    return out;
  }, []);
  const geo = useMemo(() => new THREE.IcosahedronGeometry(1, 1), []);
  const mats = useMemo(() => PALETTE.hill.map(flat), []);
  const mountains = useMemo(() => PALETTE.mountain.map(flat), []);
  const peak = useMemo(() => new THREE.ConeGeometry(1, 1, 7), []);
  return (
    <>
      {items.map((h, i) => (
        <mesh key={i} geometry={geo} material={mats[h.c]} position={[h.x, 0, h.z]} scale={[h.r, h.r * h.h, h.r]} />
      ))}
      {Array.from({length: 14}, (_, i) => {
        const side = i % 2 ? 1 : -1;
        return <mesh key={`m${i}`} geometry={peak} material={mountains[i % 3]} position={[side * (170 + random(`mx${i}`) * 80), 0, 40 - i * 80]} scale={[90 + random(`mr${i}`) * 50, 70 + random(`mh${i}`) * 60, 90]} />;
      })}
    </>
  );
};

const Road: React.FC = () => {
  const len = ROAD.zNear - ROAD.zFar;
  const mid = (ROAD.zNear + ROAD.zFar) / 2;
  const dashes = useMemo(() => {
    const out: [number, number][] = [];
    for (let z = ROAD.zNear; z > ROAD.zFar; z -= 12) for (const x of [-1.8, 1.8]) out.push([x, z]);
    return out;
  }, []);
  const dashGeo = useMemo(() => new THREE.PlaneGeometry(0.18, 4), []);
  const dashMat = useMemo(() => new THREE.MeshBasicMaterial({color: PALETTE.line}), []);
  const lights = useMemo(() => {
    const out: number[] = [];
    for (let z = ROAD.zNear; z > ROAD.zFar; z -= 45) out.push(z);
    return out;
  }, []);
  const poleMat = useMemo(() => flat('#8a90a0'), []);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, mid]}>
        <planeGeometry args={[3000, 3000]} />
        <meshLambertMaterial color={PALETTE.ground} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, mid]}>
        <planeGeometry args={[ROAD.width, len]} />
        <meshLambertMaterial color={PALETTE.road} />
      </mesh>
      {/* edge lines */}
      {[-5.6, 5.6].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.012, mid]}>
          <planeGeometry args={[0.2, len]} />
          <meshBasicMaterial color={x < 0 ? PALETTE.edge : PALETTE.line} />
        </mesh>
      ))}
      {dashes.map(([x, z], i) => (
        <mesh key={i} geometry={dashGeo} material={dashMat} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.012, z]} />
      ))}
      {/* concrete barriers */}
      {[-7, 7].map((x) => (
        <mesh key={x} position={[x, 0.45, mid]}>
          <boxGeometry args={[0.5, 0.9, len]} />
          <meshLambertMaterial color={PALETTE.barrier} flatShading />
        </mesh>
      ))}
      {lights.map((z) => (
        <group key={z} position={[7, 0, z]}>
          <mesh material={poleMat} position={[0, 4, 0]}>
            <cylinderGeometry args={[0.12, 0.16, 8, 6]} />
          </mesh>
          <mesh material={poleMat} position={[-1.2, 7.9, 0]}>
            <boxGeometry args={[2.4, 0.18, 0.25]} />
          </mesh>
          <mesh position={[-2.2, 7.75, 0]}>
            <boxGeometry args={[0.6, 0.15, 0.4]} />
            <meshBasicMaterial color="#fff3c4" />
          </mesh>
        </group>
      ))}
    </>
  );
};

export const World: React.FC = () => (
  <>
    <Sky />
    <fog attach="fog" args={[PALETTE.skyHorizon, 120, 700]} />
    <hemisphereLight args={['#dfe9ff', '#6f8f5e', 1.1]} />
    <directionalLight position={[-60, 90, 40]} intensity={1.4} color="#fff0d8" />
    {/* front fill so faces looking towards -z (the driver close-ups) stay bright */}
    <directionalLight position={[30, 40, -90]} intensity={1.0} color="#ffe9d6" />
    <ambientLight intensity={0.25} />
    <Road />
    <Trees />
    <Hills />
  </>
);
