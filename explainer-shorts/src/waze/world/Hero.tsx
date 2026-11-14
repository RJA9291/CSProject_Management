// The hero car (open cabin so the camera can look in through the windshield) and its driver:
// the series presenter as a 3D chibi (big round head, black hair, black glasses, black T-shirt).
import React, {useMemo} from 'react';
import * as THREE from 'three';

export type Mood = 'calm' | 'shock' | 'happy' | 'think';

const SKIN = '#f2c29b';
const lambert = (color: string) => new THREE.MeshLambertMaterial({color, flatShading: true});

export const Driver: React.FC<{mood: Mood; t: number; talking?: boolean}> = ({mood, t, talking = false}) => {
  // Smooth (not faceted) skin with a little warmth so the face reads well in close-ups.
  const skin = useMemo(() => new THREE.MeshLambertMaterial({color: SKIN, emissive: '#5a3a22', emissiveIntensity: 0.35}), []);
  const black = useMemo(() => lambert('#15161a'), []);
  const shirt = useMemo(() => lambert('#1f2025'), []);
  const white = useMemo(() => new THREE.MeshBasicMaterial({color: '#ffffff'}), []);
  const blush = useMemo(() => new THREE.MeshBasicMaterial({color: '#f29a8f'}), []);
  const shock = mood === 'shock';
  const happy = mood === 'happy';
  // Head bob while driving, a jolt when shocked.
  const bob = Math.sin(t * 6) * 0.012 + (shock ? Math.max(0, Math.sin(t * 30)) * 0.01 : 0);
  const tilt = mood === 'think' ? 0.18 : Math.sin(t * 1.7) * 0.04;
  const mouthOpen = talking ? 0.5 + 0.5 * Math.abs(Math.sin(t * 16)) : 0;
  const eyeScale = shock ? 1.35 : happy ? 0.45 : 1;
  return (
    <group>
      {/* torso + arms to the wheel */}
      <mesh material={shirt} position={[0, 0.72, 0]}>
        <boxGeometry args={[0.62, 0.62, 0.36]} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh material={shirt} position={[s * 0.36, 0.86, -0.12]} rotation={[1.0, 0, -s * 0.25]}>
            <cylinderGeometry args={[0.08, 0.08, 0.36, 6]} />
          </mesh>
          <mesh material={skin} position={[s * 0.25, 0.86 + Math.sin(t * 2 + s) * 0.01, -0.42]} rotation={[1.3, 0, 0]}>
            <cylinderGeometry args={[0.065, 0.065, 0.34, 6]} />
          </mesh>
          <mesh material={skin} position={[s * 0.2, 0.9, -0.58]}>
            <sphereGeometry args={[0.08, 8, 6]} />
          </mesh>
        </group>
      ))}
      {/* head */}
      <group position={[0, 1.32 + bob, 0]} rotation={[0, 0, tilt]}>
        <mesh material={skin}>
          <sphereGeometry args={[0.36, 18, 14]} />
        </mesh>
        {/* hair: cap + spikes */}
        <mesh material={black} position={[0, 0.1, 0.04]} scale={[1.06, 0.82, 1.06]}>
          <sphereGeometry args={[0.36, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2.1]} />
        </mesh>
        {[-0.2, -0.07, 0.07, 0.2].map((x, i) => (
          <mesh key={i} material={black} position={[x, 0.32, -0.12 + (i % 2) * 0.05]} rotation={[-0.5, 0, x * 1.5]}>
            <coneGeometry args={[0.07, 0.16, 4]} />
          </mesh>
        ))}
        <mesh material={black} position={[0, 0.2, -0.26]} scale={[1, 0.35, 0.4]}>
          <sphereGeometry args={[0.3, 10, 6]} />
        </mesh>
        {/* eyes (behind the glasses) */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.13, 0.02, -0.31]}>
            <mesh material={white} scale={[1, eyeScale, 0.4]}>
              <sphereGeometry args={[0.07, 10, 8]} />
            </mesh>
            <mesh material={black} position={[0, 0, -0.03]} scale={[1, happy ? 0.4 : 1, 0.5]}>
              <sphereGeometry args={[shock ? 0.03 : 0.038, 8, 6]} />
            </mesh>
            {/* glasses frame */}
            <mesh material={black} position={[0, 0, -0.035]} rotation={[0, 0, Math.PI / 4]}>
              <torusGeometry args={[0.105, 0.017, 6, 4, Math.PI * 2]} />
            </mesh>
            {/* eyebrows */}
            <mesh material={black} position={[0, shock ? 0.19 : 0.15, -0.01]} rotation={[0, 0, s * (shock ? -0.25 : mood === 'think' ? 0.2 : 0.05)]}>
              <boxGeometry args={[0.12, 0.025, 0.02]} />
            </mesh>
            <mesh material={blush} position={[s * 0.06, -0.13, 0.02]} scale={[1, 0.55, 0.3]}>
              <sphereGeometry args={[0.045, 8, 6]} />
            </mesh>
          </group>
        ))}
        <mesh material={black} position={[0, 0.02, -0.345]}>
          <boxGeometry args={[0.07, 0.016, 0.016]} />
        </mesh>
        {/* mouth */}
        {shock ? (
          <mesh material={black} position={[0, -0.17, -0.33]} scale={[0.75, 1, 0.3]}>
            <sphereGeometry args={[0.06, 10, 8]} />
          </mesh>
        ) : mouthOpen > 0.55 ? (
          <mesh material={black} position={[0, -0.16, -0.33]} scale={[1, mouthOpen * 0.6, 0.3]}>
            <sphereGeometry args={[0.06, 10, 8]} />
          </mesh>
        ) : (
          <mesh material={black} position={[0, -0.14, -0.335]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[happy ? 0.07 : 0.05, 0.012, 4, 10, Math.PI]} />
          </mesh>
        )}
      </group>
    </group>
  );
};

// Hero hatchback with an open cabin: hood, dashboard, wheel, pillars, roof and a clear windshield.
export const HeroCar: React.FC<{mood: Mood; t: number; talking?: boolean; phoneGlow?: string}> = ({mood, t, talking, phoneGlow = '#4fb06a'}) => {
  const body = useMemo(() => lambert('#e8edf2'), []);
  const dark = useMemo(() => lambert('#2a2f3a'), []);
  const glass = useMemo(() => new THREE.MeshLambertMaterial({color: '#9cc3ff', transparent: true, opacity: 0.12}), []);
  return (
    <group>
      <mesh material={body} position={[0, 0.66, -0.2]}>
        <boxGeometry args={[1.9, 0.5, 4.3]} />
      </mesh>
      <mesh material={body} position={[0, 0.95, -1.75]}>
        <boxGeometry args={[1.86, 0.12, 1.2]} />
      </mesh>
      {/* dashboard + steering wheel + phone mount */}
      <mesh material={dark} position={[0, 1.05, -0.95]}>
        <boxGeometry args={[1.7, 0.22, 0.4]} />
      </mesh>
      <mesh material={dark} position={[0.4, 1.08, -0.62]} rotation={[-0.5, 0, 0]}>
        <torusGeometry args={[0.2, 0.03, 6, 14]} />
      </mesh>
      <group position={[-0.35, 1.2, -0.95]} rotation={[0.25, 0.25, 0]} scale={0.6}>
        <mesh material={dark}>
          <boxGeometry args={[0.2, 0.36, 0.03]} />
        </mesh>
        <mesh position={[0, 0, -0.017]}>
          <planeGeometry args={[0.17, 0.31]} />
          <meshBasicMaterial color={phoneGlow} side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* pillars + roof */}
      {[-0.9, 0.9].map((x) => (
        <React.Fragment key={x}>
          <mesh material={body} position={[x, 1.42, -0.7]} rotation={[0.45, 0, 0]}>
            <boxGeometry args={[0.1, 0.8, 0.1]} />
          </mesh>
          <mesh material={body} position={[x, 1.32, 1.3]}>
            <boxGeometry args={[0.1, 0.8, 0.1]} />
          </mesh>
        </React.Fragment>
      ))}
      <mesh material={body} position={[0, 1.76, 0.35]}>
        <boxGeometry args={[1.86, 0.1, 2.0]} />
      </mesh>
      {/* rear window + tailgate so the car looks solid from behind */}
      <mesh position={[0, 1.32, 1.36]}>
        <boxGeometry args={[1.72, 0.7, 0.06]} />
        <meshLambertMaterial color="#2b3a55" flatShading />
      </mesh>
      {[-0.65, 0.65].map((x) => (
        <mesh key={`t${x}`} position={[x, 0.8, 1.92]}>
          <boxGeometry args={[0.42, 0.16, 0.04]} />
          <meshBasicMaterial color="#9e2a2a" />
        </mesh>
      ))}
      <mesh material={glass} position={[0, 1.42, -0.72]} rotation={[0.45, 0, 0]}>
        <planeGeometry args={[1.72, 0.82]} />
      </mesh>
      {/* seats */}
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} material={dark} position={[x, 1.05, 0.38]}>
          <boxGeometry args={[0.6, 0.9, 0.18]} />
        </mesh>
      ))}
      <group position={[0.4, 0.15, 0.05]}>
        <Driver mood={mood} t={t} talking={talking} />
      </group>
      {[-0.65, 0.65].map((x) => (
        <mesh key={x} position={[x, 0.78, -2.36]}>
          <boxGeometry args={[0.42, 0.16, 0.04]} />
          <meshBasicMaterial color="#fff6d6" />
        </mesh>
      ))}
      {[
        [-0.92, -1.45],
        [0.92, -1.45],
        [-0.92, 1.25],
        [0.92, 1.25],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.38, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.38, 0.38, 0.3, 10]} />
          <meshLambertMaterial color="#1c1f26" />
        </mesh>
      ))}
    </group>
  );
};
