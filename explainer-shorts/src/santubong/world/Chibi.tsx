// Big-head 3D chibi characters for the legend: princesses, the prince and villagers.
// Faces look towards +z (the camera side).
import React, {useMemo} from 'react';
import * as THREE from 'three';

export type Face = 'calm' | 'happy' | 'angry' | 'shock' | 'sad' | 'love' | 'hurt';
export type Pose = 'idle' | 'weave' | 'pound' | 'swingAlu' | 'swingPlank' | 'point' | 'cheer' | 'angry' | 'fall' | 'kneel' | 'wave' | 'bow';

export type Look = {
  skin: string;
  hair: string;
  outfit: string;
  trim: string;
  long?: boolean; // long hair (princesses)
  crown?: 'tiara' | 'tengkolok' | null;
  skirt?: boolean;
  scale?: number;
};

export const LOOKS: Record<string, Look> = {
  santubong: {skin: '#f2c29b', hair: '#1a1416', outfit: '#f4f1ea', trim: '#1fa38a', long: true, crown: 'tiara', skirt: true},
  sejinjang: {skin: '#efbd92', hair: '#2a1a14', outfit: '#f4a51c', trim: '#c93434', long: true, crown: 'tiara', skirt: true},
  serapi: {skin: '#e9b78c', hair: '#141414', outfit: '#1265c8', trim: '#f4c430', crown: 'tengkolok'},
  villagerA: {skin: '#d9a47a', hair: '#1b1b1b', outfit: '#7b4fc9', trim: '#f4c430', scale: 0.8},
  villagerB: {skin: '#e3b088', hair: '#1b1b1b', outfit: '#c93434', trim: '#ffffff', scale: 0.8, long: true, skirt: true},
  villagerC: {skin: '#cf9a70', hair: '#222', outfit: '#36a86b', trim: '#f4f1ea', scale: 0.8},
};

const mat = (c: string, flat = true) => new THREE.MeshLambertMaterial({color: c, flatShading: flat});

type Props = {look: Look; face?: Face; pose?: Pose; t: number; talking?: boolean; cheekMark?: boolean; hearts?: boolean};

// Arm from shoulder angle: rotation about z (sideways) and x (forward).
const Arm: React.FC<{side: 1 | -1; rx: number; rz: number; skin: THREE.Material; sleeve: THREE.Material; children?: React.ReactNode}> = ({side, rx, rz, skin, sleeve, children}) => (
  <group position={[side * 0.42, 1.55, 0]} rotation={[rx, 0, side * rz]}>
    <mesh material={sleeve} position={[0, -0.22, 0]}>
      <cylinderGeometry args={[0.11, 0.1, 0.44, 6]} />
    </mesh>
    <mesh material={skin} position={[0, -0.55, 0]}>
      <cylinderGeometry args={[0.085, 0.08, 0.3, 6]} />
    </mesh>
    <mesh material={skin} position={[0, -0.74, 0]}>
      <sphereGeometry args={[0.1, 8, 6]} />
    </mesh>
    <group position={[0, -0.76, 0]}>{children}</group>
  </group>
);

export const Chibi: React.FC<Props & {holdLeft?: React.ReactNode; holdRight?: React.ReactNode}> = ({look, face = 'calm', pose = 'idle', t, talking = false, cheekMark = false, hearts = false, holdLeft, holdRight}) => {
  const skin = useMemo(() => new THREE.MeshLambertMaterial({color: look.skin, emissive: '#5a3a22', emissiveIntensity: 0.3}), [look.skin]);
  const hair = useMemo(() => mat(look.hair), [look.hair]);
  const outfit = useMemo(() => mat(look.outfit), [look.outfit]);
  const trim = useMemo(() => mat(look.trim), [look.trim]);
  const black = useMemo(() => mat('#15161a'), []);
  const white = useMemo(() => new THREE.MeshBasicMaterial({color: '#ffffff'}), []);
  const blush = useMemo(() => new THREE.MeshBasicMaterial({color: '#f29a8f'}), []);
  const gold = useMemo(() => new THREE.MeshLambertMaterial({color: '#f4c430', emissive: '#6a4a00', emissiveIntensity: 0.5, flatShading: true}), []);
  const red = useMemo(() => new THREE.MeshBasicMaterial({color: '#d43a3a'}), []);

  // Arm angles per pose (rx forward, rz outward) for left (-1) and right (+1).
  const w = Math.sin(t * 9);
  let L = {rx: 0, rz: 0.15};
  let R = {rx: 0, rz: 0.15};
  let bodyRot = 0;
  let lean = 0;
  if (pose === 'weave') {
    L = {rx: -1.1 + w * 0.15, rz: 0.1};
    R = {rx: -1.1 - w * 0.15, rz: 0.1};
  } else if (pose === 'pound') {
    const up = (Math.sin(t * 7) + 1) / 2;
    L = {rx: -2.3 + up * 1.3, rz: 0.05};
    R = {rx: -2.3 + up * 1.3, rz: 0.05};
  } else if (pose === 'swingAlu' || pose === 'swingPlank') {
    L = {rx: -1.6, rz: -0.2};
    R = {rx: -1.6, rz: -0.2};
    bodyRot = -0.5;
  } else if (pose === 'point') {
    R = {rx: -1.5, rz: 0.2};
  } else if (pose === 'cheer') {
    L = {rx: 0, rz: 2.6 + w * 0.1};
    R = {rx: 0, rz: 2.6 - w * 0.1};
  } else if (pose === 'angry') {
    L = {rx: -0.4, rz: 0.7 + w * 0.2};
    R = {rx: -0.4, rz: 0.7 - w * 0.2};
    lean = -0.12;
  } else if (pose === 'wave') {
    R = {rx: 0, rz: 2.4 + Math.sin(t * 8) * 0.3};
  } else if (pose === 'bow' || pose === 'kneel') {
    L = {rx: -1.2, rz: -0.3};
    R = {rx: -1.2, rz: -0.3};
    lean = 0.35;
  }

  const shock = face === 'shock';
  const happy = face === 'happy' || face === 'love';
  const angry = face === 'angry';
  const sad = face === 'sad' || face === 'hurt';
  const eyeY = shock ? 1.3 : happy ? 0.45 : angry ? 0.75 : 1;
  const mouth = talking ? 0.5 + 0.5 * Math.abs(Math.sin(t * 16)) : 0;
  const bob = pose === 'idle' || pose === 'weave' ? Math.sin(t * 2.4) * 0.02 : 0;
  const s = look.scale ?? 1;
  const kneel = pose === 'kneel' ? -0.45 : 0;

  return (
    <group scale={s} position={[0, kneel, 0]}>
      <group rotation={[lean, bodyRot, 0]}>
        {/* legs / skirt */}
        {look.skirt ? (
          <mesh material={outfit} position={[0, 0.55, 0]}>
            <coneGeometry args={[0.55, 1.1, 8]} />
          </mesh>
        ) : (
          <>
            {[-0.16, 0.16].map((x) => (
              <mesh key={x} material={trim} position={[x, 0.42, 0]}>
                <cylinderGeometry args={[0.13, 0.13, 0.84, 6]} />
              </mesh>
            ))}
            <mesh material={trim} position={[0, 0.82, 0]}>
              <cylinderGeometry args={[0.36, 0.38, 0.3, 8]} />
            </mesh>
          </>
        )}
        {/* torso */}
        <mesh material={outfit} position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.34, 0.4, 0.7, 8]} />
        </mesh>
        <mesh material={trim} position={[0, 1.02, 0]}>
          <cylinderGeometry args={[0.41, 0.41, 0.12, 8]} />
        </mesh>
        <Arm side={-1} rx={L.rx} rz={L.rz} skin={skin} sleeve={outfit}>
          {holdLeft}
        </Arm>
        <Arm side={1} rx={R.rx} rz={R.rz} skin={skin} sleeve={outfit}>
          {holdRight}
        </Arm>
        {/* head */}
        <group position={[0, 2.2 + bob, 0]} rotation={[0, 0, sad ? 0.12 : 0]}>
          <mesh material={skin}>
            <sphereGeometry args={[0.62, 20, 16]} />
          </mesh>
          <mesh material={hair} position={[0, 0.16, -0.06]} scale={[1.07, 0.9, 1.07]}>
            <sphereGeometry args={[0.62, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2.05]} />
          </mesh>
          {look.long ? (
            <>
              <mesh material={hair} position={[0, -0.35, -0.38]} scale={[1, 1.4, 0.55]}>
                <sphereGeometry args={[0.55, 12, 10]} />
              </mesh>
              <mesh material={hair} position={[0, 0.62, -0.3]}>
                <sphereGeometry args={[0.24, 10, 8]} />
              </mesh>
            </>
          ) : null}
          {look.crown === 'tiara' ? (
            <group position={[0, 0.52, 0.18]} rotation={[-0.35, 0, 0]}>
              <mesh material={gold}>
                <torusGeometry args={[0.36, 0.035, 6, 16, Math.PI]} />
              </mesh>
              <mesh material={gold} position={[0, 0.36, 0]}>
                <octahedronGeometry args={[0.09, 0]} />
              </mesh>
            </group>
          ) : null}
          {look.crown === 'tengkolok' ? (
            <mesh material={gold} position={[0, 0.5, 0]} rotation={[-0.1, 0, 0]}>
              <cylinderGeometry args={[0.52, 0.6, 0.28, 8]} />
            </mesh>
          ) : null}
          {/* eyes */}
          {[-1, 1].map((sd) => (
            <group key={sd} position={[sd * 0.22, 0.02, 0.53]}>
              <mesh material={white} scale={[1, eyeY, 0.4]}>
                <sphereGeometry args={[0.12, 10, 8]} />
              </mesh>
              {face === 'love' ? (
                <mesh material={red} position={[0, 0, 0.04]} rotation={[0, 0, Math.PI / 4]}>
                  <boxGeometry args={[0.12, 0.12, 0.02]} />
                </mesh>
              ) : (
                <mesh material={black} position={[0, -0.01, 0.04]} scale={[1, happy ? 0.35 : 1, 0.5]}>
                  <sphereGeometry args={[shock ? 0.045 : 0.065, 8, 6]} />
                </mesh>
              )}
              <mesh material={hair} position={[0, angry ? 0.18 : shock ? 0.27 : sad ? 0.2 : 0.22, 0.02]} rotation={[0, 0, sd * (angry ? 0.45 : sad ? -0.35 : shock ? -0.2 : 0.05)]}>
                <boxGeometry args={[0.2, 0.04, 0.03]} />
              </mesh>
              <mesh material={blush} position={[sd * 0.08, -0.2, 0.0]} scale={[1, 0.55, 0.3]}>
                <sphereGeometry args={[0.08, 8, 6]} />
              </mesh>
            </group>
          ))}
          {cheekMark ? (
            <mesh material={red} position={[0.36, -0.12, 0.45]} rotation={[0, 0.6, -0.6]}>
              <boxGeometry args={[0.26, 0.05, 0.03]} />
            </mesh>
          ) : null}
          {/* mouth */}
          {shock || mouth > 0.55 ? (
            <mesh material={black} position={[0, -0.27, 0.56]} scale={[shock ? 0.8 : 1, shock ? 1 : mouth * 0.6, 0.3]}>
              <sphereGeometry args={[0.09, 10, 8]} />
            </mesh>
          ) : angry || sad ? (
            <mesh material={black} position={[0, -0.3, 0.57]}>
              <torusGeometry args={[0.07, 0.018, 4, 10, Math.PI]} />
            </mesh>
          ) : (
            <mesh material={black} position={[0, -0.24, 0.57]} rotation={[0, 0, Math.PI]}>
              <torusGeometry args={[happy ? 0.11 : 0.08, 0.018, 4, 10, Math.PI]} />
            </mesh>
          )}
        </group>
        {hearts
          ? [0, 1, 2].map((k) => {
              const p = ((t * 0.7 + k / 3) % 1);
              return (
                <mesh key={k} material={red} position={[(k - 1) * 0.5, 3.1 + p * 1.4, 0.3]} rotation={[0, 0, Math.PI / 4]} scale={1 - p * 0.5}>
                  <boxGeometry args={[0.22, 0.22, 0.06]} />
                </mesh>
              );
            })
          : null}
      </group>
    </group>
  );
};

// ---- Props ----
export const Alu: React.FC = () => (
  <mesh position={[0, -0.2, 0.2]} rotation={[0, 0, 0]}>
    <cylinderGeometry args={[0.07, 0.07, 2.4, 6]} />
    <meshLambertMaterial color="#8a5a34" flatShading />
  </mesh>
);
export const Plank: React.FC = () => (
  <mesh position={[0, -0.6, 0.2]}>
    <boxGeometry args={[0.16, 1.4, 0.05]} />
    <meshLambertMaterial color="#b07a52" flatShading />
  </mesh>
);
export const Lesung: React.FC = () => (
  <group>
    <mesh position={[0, 0.45, 0]}>
      <cylinderGeometry args={[0.55, 0.45, 0.9, 10]} />
      <meshLambertMaterial color="#6b4a2c" flatShading />
    </mesh>
    <mesh position={[0, 0.91, 0]}>
      <cylinderGeometry args={[0.4, 0.4, 0.04, 10]} />
      <meshLambertMaterial color="#f1e4c0" />
    </mesh>
  </group>
);
// Backstrap-style loom with a striped cloth that grows as she weaves.
export const Loom: React.FC<{t: number}> = ({t}) => {
  const wood = useMemo(() => mat('#7a5236'), []);
  const colors = ['#c93434', '#f4c430', '#1fa38a', '#102f69'];
  const rows = 6 + Math.floor((t * 2) % 6);
  return (
    <group>
      {[-0.9, 0.9].map((x) => (
        <mesh key={x} material={wood} position={[x, 0.7, 0]}>
          <boxGeometry args={[0.1, 1.4, 0.1]} />
        </mesh>
      ))}
      <mesh material={wood} position={[0, 1.38, 0]}>
        <boxGeometry args={[1.95, 0.1, 0.1]} />
      </mesh>
      <mesh material={wood} position={[0, 0.3, 0]}>
        <boxGeometry args={[1.95, 0.1, 0.1]} />
      </mesh>
      {Array.from({length: rows}, (_, i) => (
        <mesh key={i} position={[0, 1.28 - i * 0.08, 0.02]}>
          <boxGeometry args={[1.7, 0.075, 0.02]} />
          <meshLambertMaterial color={colors[i % 4]} />
        </mesh>
      ))}
      <mesh position={[Math.sin(t * 5) * 0.8, 1.28 - rows * 0.08, 0.08]}>
        <boxGeometry args={[0.3, 0.06, 0.06]} />
        <meshLambertMaterial color="#f4f1ea" />
      </mesh>
    </group>
  );
};
