// Stylised-realistic 3D worker built from primitives (Three.js / react-three-fiber).
// Proportions are adult and realistic (no chibi / cartoon heads); detail comes from
// PPE, uniform panels and role accessories defined in specs.ts.
import React from 'react';
import {CharacterSpec} from './specs';

type V3 = [number, number, number];

const Mat: React.FC<{c: string; r?: number; m?: number; e?: string; ei?: number}> = ({c, r = 0.75, m = 0, e, ei = 0}) => (
  <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? '#000000'} emissiveIntensity={ei} />
);

const Box: React.FC<{p: V3; s: V3; c: string; rot?: V3; r?: number; m?: number; e?: string; ei?: number}> = ({p, s, c, rot = [0, 0, 0], r, m, e, ei}) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow>
    <boxGeometry args={s} />
    <Mat c={c} r={r} m={m} e={e} ei={ei} />
  </mesh>
);

const Capsule: React.FC<{p: V3; r: number; l: number; c: string; rot?: V3; sx?: number; sz?: number}> = ({p, r, l, c, rot = [0, 0, 0], sx = 1, sz = 1}) => (
  <mesh position={p} rotation={rot} scale={[sx, 1, sz]} castShadow receiveShadow>
    <capsuleGeometry args={[r, l, 8, 16]} />
    <Mat c={c} />
  </mesh>
);

const Sphere: React.FC<{p: V3; r: number; c: string; s?: V3; rough?: number}> = ({p, r, c, s = [1, 1, 1], rough}) => (
  <mesh position={p} scale={s} castShadow>
    <sphereGeometry args={[r, 24, 18]} />
    <Mat c={c} r={rough} />
  </mesh>
);

/** An arm: upper arm + forearm + hand, from the shoulder, with two joint angles (radians). */
const Arm: React.FC<{side: 1 | -1; shoulder: V3; upper: number; fore: number; out?: number; sleeve: string; skin: string; glove?: string; children?: React.ReactNode}> = ({
  side,
  shoulder,
  upper,
  fore,
  out = 0.08,
  sleeve,
  skin,
  glove,
  children,
}) => (
  <group position={shoulder} rotation={[upper, 0, side * out]}>
    <Capsule p={[0, -0.15, 0]} r={0.052} l={0.22} c={sleeve} />
    <group position={[0, -0.3, 0]} rotation={[fore, 0, 0]}>
      <Capsule p={[0, -0.13, 0]} r={0.043} l={0.2} c={sleeve} />
      <Sphere p={[0, -0.29, 0]} r={glove ? 0.058 : 0.048} c={glove ?? skin} s={[1, 1.15, 0.8]} />
      <group position={[0, -0.3, 0]}>{children}</group>
    </group>
  </group>
);

export const Character: React.FC<{spec: CharacterSpec; position?: V3; rotationY?: number; t?: number; holdTablet?: boolean}> = ({spec, position = [0, 0, 0], rotationY = 0, t = 0}) => {
  const k = spec.height / 1.72;
  const b = spec.build;
  const has = (a: string) => spec.accessories.includes(a as never);
  const glove = has('insulatedGloves') ? '#e0581c' : has('workGloves') ? (spec.id === 'welding' ? '#8a5a32' : '#6d7178') : undefined;
  const breathe = Math.sin(t * 1.6) * 0.004;

  // pose → arm angles
  const poses: Record<CharacterSpec['pose'], {l: [number, number]; r: [number, number]}> = {
    leader: {l: [-0.25, -1.05], r: [0.05, -0.1]},
    tablet: {l: [-0.35, -1.15], r: [-0.3, -1.05]},
    clipboard: {l: [-0.3, -1.2], r: [-0.15, -0.6]},
    tool: {l: [0.05, -0.15], r: [-0.2, -0.75]},
    weld: {l: [0.08, -0.2], r: [0.02, -0.25]},
  };
  const pose = poses[spec.pose];
  const sleeve = spec.shirt;
  const shoulderY = 1.42;

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={[k * b, k, k * (0.92 + 0.08 * b)]}>
      {/* safety shoes */}
      {[-1, 1].map((s) => (
        <Box key={s} p={[s * 0.1, 0.045, 0.035]} s={[0.12, 0.09, 0.28]} c="#15171b" r={0.5} />
      ))}
      {/* legs */}
      {[-1, 1].map((s) => (
        <Capsule key={s} p={[s * 0.1, 0.5, 0]} r={0.068} l={0.72} c={spec.trousers} />
      ))}
      {/* hips */}
      <Box p={[0, 0.9, 0]} s={[0.34, 0.16, 0.2]} c={spec.trousers} />

      {/* torso */}
      <group position={[0, breathe, 0]}>
        <mesh position={[0, 1.17, 0]} scale={[1, 1, 0.62]} castShadow>
          <capsuleGeometry args={[0.17, 0.3, 8, 18]} />
          <Mat c={spec.shirt} r={0.85} />
        </mesh>
        {/* shoulder yoke / accent */}
        <mesh position={[0, 1.36, 0]} scale={[1.05, 0.42, 0.66]} castShadow>
          <sphereGeometry args={[0.18, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Mat c={spec.shirtAccent} r={0.8} />
        </mesh>
        {/* reflective stripes (department uniform only) */}
        {spec.id !== 'manager' &&
          [1.05, 1.2].map((y) => (
            <mesh key={y} position={[0, y, 0]} scale={[1.005, 1, 0.625]}>
              <cylinderGeometry args={[0.172, 0.172, 0.022, 28, 1, true]} />
              <Mat c={'#d9dde3'} r={0.3} m={0.2} e={'#9aa3ad'} ei={0.15} />
            </mesh>
          ))}
        {/* department badge (logo PLACEHOLDER) */}
        <Box p={[-0.075, 1.27, 0.107]} s={[0.05, 0.035, 0.006]} c={'#e8771e'} />
        {/* manager: tie + collar */}
        {spec.id === 'manager' && (
          <>
            <Box p={[0, 1.22, 0.108]} s={[0.035, 0.22, 0.006]} c={'#1f3a5f'} />
            <Box p={[0, 1.36, 0.1]} s={[0.12, 0.03, 0.02]} c={'#f2f6fb'} />
          </>
        )}
        {/* lanyard + ID card */}
        {has('lanyard') && (
          <>
            <mesh position={[0, 1.3, 0.1]} rotation={[0.1, 0, 0]}>
              <torusGeometry args={[0.075, 0.006, 6, 24, Math.PI]} />
              <Mat c={'#e8771e'} />
            </mesh>
            <Box p={[0, 1.2, 0.112]} s={[0.055, 0.075, 0.004]} c={'#f4f6f8'} />
          </>
        )}
        {/* tool belt */}
        {has('toolBelt') && (
          <>
            <mesh position={[0, 0.95, 0]} scale={[1, 1, 0.66]}>
              <cylinderGeometry args={[0.185, 0.185, 0.05, 28]} />
              <Mat c={'#3b2c1f'} r={0.6} />
            </mesh>
            <Box p={[0.17, 0.89, 0.04]} s={[0.07, 0.12, 0.08]} c={'#4a3826'} />
            <Box p={[-0.17, 0.89, 0.04]} s={[0.07, 0.12, 0.08]} c={'#4a3826'} />
            {has('multimeter') && <Box p={[-0.17, 0.94, 0.09]} s={[0.05, 0.08, 0.02]} c={'#f2c230'} />}
          </>
        )}
        {/* leather apron (welding) */}
        {has('leatherApron') && <Box p={[0, 0.95, 0.11]} s={[0.32, 0.62, 0.02]} c={'#7a4f2c'} r={0.9} />}
      </group>

      {/* arms */}
      <Arm side={-1} shoulder={[-0.215, shoulderY, 0]} upper={pose.l[0]} fore={pose.l[1]} sleeve={sleeve} skin={spec.skin} glove={glove}>
        {has('tablet') && (
          <group rotation={[0.9, 0, 0]} position={[0.06, -0.02, 0.06]}>
            <Box p={[0, 0, 0]} s={[0.2, 0.012, 0.28]} c={'#14171c'} r={0.4} />
            <Box p={[0, 0.007, 0]} s={[0.18, 0.002, 0.25]} c={'#2f8cff'} e={'#2f8cff'} ei={0.9} />
          </group>
        )}
        {has('clipboard') && (
          <group rotation={[0.95, 0, 0]} position={[0.06, -0.02, 0.06]}>
            <Box p={[0, 0, 0]} s={[0.2, 0.01, 0.29]} c={'#8b6a46'} />
            <Box p={[0, 0.007, 0.01]} s={[0.17, 0.003, 0.22]} c={'#f4f4ef'} />
            <Box p={[0, 0.012, -0.12]} s={[0.07, 0.01, 0.025]} c={'#9aa3ad'} m={0.6} />
          </group>
        )}
      </Arm>
      <Arm side={1} shoulder={[0.215, shoulderY, 0]} upper={pose.r[0]} fore={pose.r[1]} sleeve={sleeve} skin={spec.skin} glove={glove}>
        {has('drawingRoll') && (
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.02]}>
            <cylinderGeometry args={[0.025, 0.025, 0.42, 16]} />
            <Mat c={'#e9edf2'} />
          </mesh>
        )}
        {has('multimeter') && !has('toolBelt') && <Box p={[0, -0.02, 0.03]} s={[0.07, 0.12, 0.03]} c={'#f2c230'} />}
        {has('multimeter') && spec.pose === 'tool' && (
          <group position={[0, -0.03, 0.04]}>
            <Box p={[0, 0, 0]} s={[0.075, 0.13, 0.03]} c={'#f2c230'} />
            <Box p={[0, 0.03, 0.017]} s={[0.055, 0.04, 0.004]} c={'#9fd8a0'} e={'#9fd8a0'} ei={0.5} />
          </group>
        )}
        {has('wrench') && (
          <group rotation={[0.2, 0, 0.1]} position={[0, -0.05, 0.03]}>
            <Box p={[0, -0.1, 0]} s={[0.025, 0.26, 0.012]} c={'#aab2bc'} m={0.8} r={0.3} />
            <mesh position={[0, -0.25, 0]}>
              <torusGeometry args={[0.035, 0.012, 8, 16, Math.PI * 1.5]} />
              <Mat c={'#aab2bc'} m={0.8} r={0.3} />
            </mesh>
          </group>
        )}
        {spec.id === 'welding' && (
          // MIG torch
          <group rotation={[0.6, 0, 0]} position={[0, -0.04, 0.04]}>
            <mesh>
              <cylinderGeometry args={[0.022, 0.026, 0.2, 12]} />
              <Mat c={'#2a2d33'} />
            </mesh>
            <mesh position={[0, -0.14, 0.02]} rotation={[0.5, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.014, 0.1, 10]} />
              <Mat c={'#b08d57'} m={0.7} />
            </mesh>
          </group>
        )}
        {spec.pose === 'leader' && has('file') && <Box p={[0, -0.03, 0.03]} s={[0.04, 0.3, 0.22]} c={'#1f3a5f'} />}
      </Arm>

      {/* neck + head */}
      <Capsule p={[0, 1.5, 0]} r={0.045} l={0.05} c={spec.skin} />
      <group position={[0, 1.64, 0.005]}>
        <Sphere p={[0, 0, 0]} r={0.105} c={spec.skin} s={[0.92, 1.1, 1]} rough={0.6} />
        {/* ears */}
        {spec.hair !== 'tudung' &&
          [-1, 1].map((s) => <Sphere key={s} p={[s * 0.096, -0.005, -0.005]} r={0.022} c={spec.skin} s={[0.5, 1, 0.8]} />)}
        {/* eyes + brows */}
        {[-1, 1].map((s) => (
          <group key={s}>
            <Sphere p={[s * 0.035, 0.018, 0.093]} r={0.011} c={'#1a1410'} />
            <Box p={[s * 0.036, 0.042, 0.094]} s={[0.032, 0.007, 0.006]} c={spec.hairColor} />
          </group>
        ))}
        {/* nose */}
        <mesh position={[0, -0.005, 0.104]} rotation={[0.2, 0, 0]}>
          <coneGeometry args={[0.014, 0.04, 10]} />
          <Mat c={spec.skin} r={0.6} />
        </mesh>
        {/* mouth */}
        <Box p={[0, -0.05, 0.094]} s={[0.035, 0.006, 0.006]} c={'#5b3426'} />
        {spec.moustache && <Box p={[0, -0.033, 0.098]} s={[0.05, 0.012, 0.01]} c={spec.hairColor} />}
        {spec.beard && (
          <mesh position={[0, -0.06, 0.02]} scale={[0.9, 0.55, 0.9]}>
            <sphereGeometry args={[0.1, 20, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
            <Mat c={spec.hairColor} r={0.95} />
          </mesh>
        )}
        {/* hair */}
        {spec.hair === 'bob' && (
          <mesh position={[0, 0.0, -0.01]} scale={[1.02, 1.08, 1.04]}>
            <sphereGeometry args={[0.108, 24, 16, Math.PI * 0.2, Math.PI * 1.6, 0, Math.PI * 0.7]} />
            <Mat c={spec.hairColor} r={0.9} />
          </mesh>
        )}
        {(spec.hair === 'short' || spec.hair === 'crew') && (
          <mesh position={[0, 0.012, -0.006]} scale={[0.95, spec.hair === 'crew' ? 1.0 : 1.04, 1.02]}>
            <sphereGeometry args={[0.104, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
            <Mat c={spec.hairColor} r={0.95} />
          </mesh>
        )}
        {spec.hair === 'tudung' && (
          <>
            <mesh position={[0, 0.0, -0.005]} scale={[1.02, 1.12, 1.05]}>
              <sphereGeometry args={[0.11, 24, 16, Math.PI * 0.62, Math.PI * 1.76, 0, Math.PI * 0.95]} />
              <Mat c={spec.tudungColor ?? '#24364f'} r={0.9} />
            </mesh>
            {/* drape over shoulders */}
            <mesh position={[0, -0.16, -0.005]}>
              <coneGeometry args={[0.17, 0.2, 24, 1, true]} />
              <Mat c={spec.tudungColor ?? '#24364f'} r={0.9} />
            </mesh>
          </>
        )}
        {/* glasses */}
        {(has('glasses') || has('safetyGlasses')) && (
          <group position={[0, 0.018, 0.1]}>
            {has('safetyGlasses') ? (
              <Box p={[0, 0, 0]} s={[0.15, 0.035, 0.01]} c={'#9fc9e8'} r={0.1} m={0.1} />
            ) : (
              [-1, 1].map((s) => (
                <mesh key={s} position={[s * 0.036, 0, 0]}>
                  <torusGeometry args={[0.02, 0.003, 6, 18]} />
                  <Mat c={'#222'} />
                </mesh>
              ))
            )}
          </group>
        )}
        {/* safety helmet */}
        <group position={[0, 0.06, -0.005]}>
          <mesh scale={[1, 0.82, 1.08]} castShadow>
            <sphereGeometry args={[0.125, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Mat c={spec.helmet} r={0.35} />
          </mesh>
          <mesh position={[0, 0.0, 0.03]} scale={[1, 1, 1.18]}>
            <cylinderGeometry args={[0.142, 0.142, 0.012, 28]} />
            <Mat c={spec.helmet} r={0.35} />
          </mesh>
          <Box p={[0, 0.07, 0]} s={[0.025, 0.035, 0.24]} c={spec.helmet} r={0.35} />
          {/* welding shield, flipped up */}
          {has('weldingShield') && (
            <group position={[0, 0.03, 0.1]} rotation={[-1.1, 0, 0]}>
              <Box p={[0, 0.08, 0]} s={[0.2, 0.2, 0.02]} c={'#23262b'} r={0.5} />
              <Box p={[0, 0.1, 0.011]} s={[0.1, 0.045, 0.004]} c={'#1c4a3a'} r={0.1} m={0.3} />
            </group>
          )}
        </group>
      </group>
    </group>
  );
};
