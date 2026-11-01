// Stylised-realistic 3D worker (v2) with a jointed rig driven by poses.ts.
// Adult proportions (≈7.3 heads tall), department uniform details, role PPE and
// accessories from specs.ts. The same component is used in every scene, so a
// character always looks identical.
import React from 'react';
import {Action, ArmPose, LegPose, poseFor, ROLE_ACTIONS} from './poses';
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
const Cap: React.FC<{p: V3; r: number; l: number; c: string; rot?: V3; s?: V3; rough?: number}> = ({p, r, l, c, rot = [0, 0, 0], s = [1, 1, 1], rough}) => (
  <mesh position={p} rotation={rot} scale={s} castShadow receiveShadow>
    <capsuleGeometry args={[r, l, 8, 18]} />
    <Mat c={c} r={rough} />
  </mesh>
);
const Ball: React.FC<{p: V3; r: number; c: string; s?: V3; rough?: number; m?: number}> = ({p, r, c, s = [1, 1, 1], rough, m}) => (
  <mesh position={p} scale={s} castShadow>
    <sphereGeometry args={[r, 28, 20]} />
    <Mat c={c} r={rough} m={m} />
  </mesh>
);

const darken = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `#${[(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => f(v).toString(16).padStart(2, '0')).join('')}`;
};

// ------------------------------------------------------------ limbs

const Hand: React.FC<{skin: string; glove?: string; side: 1 | -1}> = ({skin, glove, side}) => {
  const c = glove ?? skin;
  return (
    <group>
      <Ball p={[0, -0.045, 0]} r={0.042} c={c} s={[0.85, 1.25, 0.55]} rough={glove ? 0.9 : 0.6} />
      <Cap p={[side * 0.03, -0.035, 0.022]} r={0.012} l={0.035} c={c} rot={[0.5, 0, side * 0.6]} />
      {glove && <Cap p={[0, 0.005, 0]} r={0.047} l={0.03} c={darken(glove, 0.85)} />}
    </group>
  );
};

const Arm: React.FC<{side: 1 | -1; pose: ArmPose; sleeve: string; cuff: string; skin: string; glove?: string; children?: React.ReactNode}> = ({side, pose, sleeve, cuff, skin, glove, children}) => (
  <group position={[side * 0.205, 0.46, 0]} rotation={[pose.pitch, 0, side * pose.roll]}>
    <Ball p={[0, 0, 0]} r={0.062} c={sleeve} />
    <Cap p={[0, -0.14, 0]} r={0.05} l={0.2} c={sleeve} />
    <group position={[0, -0.29, 0]} rotation={[pose.elbow, 0, 0]}>
      <Ball p={[0, 0, 0]} r={0.046} c={sleeve} />
      <Cap p={[0, -0.12, 0]} r={0.042} l={0.17} c={sleeve} />
      <Cap p={[0, -0.235, 0]} r={0.044} l={0.012} c={cuff} />
      <group position={[0, -0.255, 0]}>
        <Hand skin={skin} glove={glove} side={side} />
        <group position={[0, -0.07, 0.01]}>{children}</group>
      </group>
    </group>
  </group>
);

const Leg: React.FC<{side: 1 | -1; pose: LegPose; trousers: string}> = ({side, pose, trousers}) => (
  <group position={[side * 0.095, 0, 0]} rotation={[pose.hip, 0, 0]}>
    <Cap p={[0, -0.2, 0]} r={0.074} l={0.3} c={trousers} rough={0.85} />
    <group position={[0, -0.44, 0]} rotation={[pose.knee, 0, 0]}>
      <Ball p={[0, 0, 0]} r={0.066} c={trousers} rough={0.85} />
      <Cap p={[0, -0.2, 0]} r={0.06} l={0.3} c={trousers} rough={0.85} />
      {/* safety boot */}
      <group position={[0, -0.43, 0.035]} rotation={[-pose.hip - pose.knee, 0, 0]}>
        <Cap p={[0, -0.005, 0.02]} r={0.055} l={0.14} c="#1a1c20" rot={[Math.PI / 2, 0, 0]} s={[1.05, 1, 0.9]} rough={0.55} />
        <Box p={[0, -0.05, 0.02]} s={[0.115, 0.022, 0.27]} c="#0d0e10" r={0.9} />
        <Ball p={[0, -0.01, 0.105]} r={0.05} c="#22252a" s={[1.05, 0.75, 1]} rough={0.4} m={0.2} />
      </group>
    </group>
  </group>
);

// ------------------------------------------------------------ head

const Head: React.FC<{spec: CharacterSpec; pitch: number; yaw: number; has: (a: string) => boolean; shieldDown: boolean}> = ({spec, pitch, yaw, has, shieldDown}) => {
  const lip = darken(spec.skin, 0.72);
  const tud = spec.tudungColor ?? '#24364f';
  return (
    <group position={[0, 0.6, 0.0]} rotation={[pitch, yaw, 0]}>
      {/* neck */}
      <Cap p={[0, -0.06, 0]} r={0.046} l={0.06} c={spec.skin} />
      <group position={[0, 0.07, 0.008]}>
        {/* skull + jaw */}
        <Ball p={[0, 0.0, 0]} r={0.1} c={spec.skin} s={[0.9, 1.08, 1.0]} rough={0.55} />
        <Ball p={[0, -0.05, 0.02]} r={0.075} c={spec.skin} s={[0.95, 0.85, 1.0]} rough={0.55} />
        {/* ears */}
        {spec.hair !== 'tudung' && [-1, 1].map((s) => <Ball key={s} p={[s * 0.09, -0.005, -0.005]} r={0.022} c={darken(spec.skin, 0.95)} s={[0.45, 1, 0.75]} />)}
        {/* eyes */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.034, 0.012, 0.083]}>
            <Ball p={[0, 0, 0]} r={0.0135} c="#f2efe9" s={[1.2, 0.85, 0.6]} rough={0.3} />
            <Ball p={[0, 0, 0.006]} r={0.0075} c="#2a1c14" rough={0.2} />
            <Ball p={[0.002, 0.002, 0.0115]} r={0.0022} c="#ffffff" rough={0.1} />
            {/* upper lid */}
            <Cap p={[0, 0.009, 0.004]} r={0.004} l={0.022} c={darken(spec.skin, 0.85)} rot={[0, 0, Math.PI / 2]} />
          </group>
        ))}
        {/* brows */}
        {[-1, 1].map((s) => (
          <Cap key={s} p={[s * 0.035, 0.036, 0.088]} r={0.0045} l={0.024} c={spec.hairColor} rot={[0, 0, Math.PI / 2 + s * 0.12]} />
        ))}
        {/* nose */}
        <Ball p={[0, -0.012, 0.098]} r={0.016} c={darken(spec.skin, 0.97)} s={[1, 0.9, 0.9]} rough={0.55} />
        <Cap p={[0, 0.006, 0.096]} r={0.009} l={0.02} c={spec.skin} />
        {/* lips */}
        <Cap p={[0, -0.046, 0.088]} r={0.0065} l={0.026} c={lip} rot={[0, 0, Math.PI / 2]} />
        <Cap p={[0, -0.055, 0.086]} r={0.0075} l={0.022} c={darken(lip, 1.08)} rot={[0, 0, Math.PI / 2]} />
        {spec.moustache && <Cap p={[0, -0.034, 0.093]} r={0.008} l={0.035} c={spec.hairColor} rot={[0, 0, Math.PI / 2]} rough={0.95} />}
        {spec.beard && (
          <mesh position={[0, -0.055, 0.02]} scale={[0.95, 0.7, 1.0]}>
            <sphereGeometry args={[0.085, 24, 14, 0, Math.PI * 2, Math.PI * 0.45, Math.PI * 0.55]} />
            <Mat c={spec.hairColor} r={0.95} />
          </mesh>
        )}

        {/* hair */}
        {(spec.hair === 'short' || spec.hair === 'crew') && (
          <mesh position={[0, 0.012, -0.004]} scale={[0.94, spec.hair === 'crew' ? 1.0 : 1.05, 1.03]}>
            <sphereGeometry args={[0.1, 28, 14, 0, Math.PI * 2, 0, Math.PI * 0.42]} />
            <Mat c={spec.hairColor} r={0.95} />
          </mesh>
        )}
        {spec.hair === 'bob' && (
          <>
            <mesh position={[0, 0.005, -0.008]} scale={[1.0, 1.08, 1.05]}>
              <sphereGeometry args={[0.105, 28, 18, Math.PI * 0.82, Math.PI * 1.36, 0, Math.PI * 0.62]} />
              <Mat c={spec.hairColor} r={0.9} />
            </mesh>
            {[-1, 1].map((s) => (
              <Ball key={s} p={[s * 0.085, -0.045, -0.01]} r={0.04} c={spec.hairColor} s={[0.6, 1.2, 1]} rough={0.9} />
            ))}
          </>
        )}
        {spec.hair === 'tudung' && (
          <>
            {/* wraps the head, leaving the face open */}
            <mesh position={[0, 0.0, -0.004]} scale={[1.03, 1.12, 1.06]}>
              <sphereGeometry args={[0.106, 32, 20, Math.PI * 0.66, Math.PI * 1.68, 0, Math.PI * 0.86]} />
              <Mat c={tud} r={0.92} />
            </mesh>
            {/* chin / neck wrap */}
            <mesh position={[0, -0.095, 0.0]} rotation={[0.12, 0, 0]}>
              <cylinderGeometry args={[0.07, 0.1, 0.11, 28, 1, true]} />
              <Mat c={tud} r={0.92} />
            </mesh>
            {/* drape over shoulders */}
            <mesh position={[0, -0.2, -0.01]}>
              <coneGeometry args={[0.2, 0.18, 32, 1, true]} />
              <Mat c={tud} r={0.92} />
            </mesh>
          </>
        )}

        {/* eyewear */}
        {has('safetyGlasses') && !shieldDown && (
          <group position={[0, 0.013, 0.095]}>
            <mesh position={[0, 0, -0.004]}>
              <boxGeometry args={[0.13, 0.032, 0.004]} />
              <meshStandardMaterial color="#cfe8f8" transparent opacity={0.28} roughness={0.05} metalness={0.2} />
            </mesh>
            <Box p={[0, 0.017, -0.004]} s={[0.13, 0.004, 0.006]} c="#2a2f37" />
          </group>
        )}
        {has('glasses') && (
          <group position={[0, 0.012, 0.094]}>
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.034, 0, 0]}>
                <torusGeometry args={[0.018, 0.0028, 8, 20]} />
                <Mat c="#1d1d1f" />
              </mesh>
            ))}
            <Box p={[0, 0.003, 0]} s={[0.03, 0.003, 0.003]} c="#1d1d1f" />
          </group>
        )}

        {/* safety helmet */}
        <group position={[0, 0.05, -0.004]}>
          <mesh scale={[1, 0.8, 1.1]} castShadow>
            <sphereGeometry args={[0.122, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <Mat c={spec.helmet} r={0.32} />
          </mesh>
          <mesh position={[0, 0.002, 0.012]} scale={[1, 1, 1.12]}>
            <cylinderGeometry args={[0.135, 0.135, 0.01, 32]} />
            <Mat c={spec.helmet} r={0.32} />
          </mesh>
          {/* front peak */}
          <mesh position={[0, 0.004, 0.13]} rotation={[0.18, 0, 0]} scale={[1, 1, 0.5]}>
            <cylinderGeometry args={[0.08, 0.08, 0.008, 24, 1, false, -Math.PI / 2, Math.PI]} />
            <Mat c={spec.helmet} r={0.32} />
          </mesh>
          <Box p={[0, 0.088, -0.005]} s={[0.022, 0.03, 0.22]} c={darken(spec.helmet, 0.92)} r={0.32} />
          {/* department sticker (PLACEHOLDER logo) */}
          <Box p={[0, 0.06, 0.11]} s={[0.04, 0.022, 0.004]} rot={[-0.6, 0, 0]} c="#e8771e" />
          {has('weldingShield') && (
            <group position={[0, 0.03, 0.02]} rotation={[shieldDown ? 0 : -0.95, 0, 0]}>
              {/* curved shell, hinged at the helmet sides */}
              <mesh position={[0, -0.09, 0.0]}>
                <cylinderGeometry args={[0.13, 0.12, 0.23, 28, 1, true, -Math.PI * 0.42, Math.PI * 0.84]} />
                <meshStandardMaterial color="#24272c" roughness={0.45} side={2} />
              </mesh>
              <Box p={[0, -0.06, 0.128]} s={[0.1, 0.045, 0.006]} c="#1f5a46" r={0.1} m={0.3} />
              {[-1, 1].map((s) => (
                <Ball key={s} p={[s * 0.125, 0.0, 0]} r={0.016} c="#3a3f47" />
              ))}
            </group>
          )}
        </group>
      </group>
    </group>
  );
};

// ------------------------------------------------------------ props in hand

const LeftItem: React.FC<{spec: CharacterSpec; walking: boolean}> = ({spec, walking}) => {
  const has = (a: string) => spec.accessories.includes(a as never);
  const rot: V3 = walking ? [0.1, 0, 0] : [1.0, 0, 0];
  if (has('tablet'))
    return (
      <group rotation={rot} position={[0.05, -0.02, 0.06]}>
        <Box p={[0, 0, 0]} s={[0.2, 0.011, 0.28]} c="#15181d" r={0.35} m={0.3} />
        <Box p={[0, 0.0065, 0]} s={[0.18, 0.002, 0.25]} c="#1d6fe0" e="#3d8cff" ei={0.9} />
        <Box p={[0, 0.008, -0.06]} s={[0.15, 0.001, 0.02]} c="#ffffff" e="#ffffff" ei={0.6} />
        <Box p={[0.03, 0.008, 0.02]} s={[0.09, 0.001, 0.08]} c="#9be0ff" e="#9be0ff" ei={0.4} />
      </group>
    );
  if (has('clipboard'))
    return (
      <group rotation={rot} position={[0.05, -0.02, 0.06]}>
        <Box p={[0, 0, 0]} s={[0.2, 0.01, 0.29]} c="#8b6a46" />
        <Box p={[0, 0.007, 0.012]} s={[0.17, 0.003, 0.23]} c="#f6f6f1" />
        {[0, 1, 2, 3, 4].map((i) => (
          <Box key={i} p={[0.01, 0.0095, -0.07 + i * 0.04]} s={[0.12, 0.001, 0.006]} c="#8a94a3" />
        ))}
        <Box p={[0, 0.013, -0.125]} s={[0.07, 0.012, 0.025]} c="#aeb6c0" m={0.7} r={0.3} />
      </group>
    );
  return null;
};

const RightItem: React.FC<{spec: CharacterSpec; action: Action}> = ({spec, action}) => {
  const has = (a: string) => spec.accessories.includes(a as never);
  if (spec.id === 'assistant' && action === 'clipboard')
    return <Cap p={[0, -0.03, 0.03]} r={0.006} l={0.12} c="#1f3a5f" rot={[1.2, 0, 0]} />; // pen
  if (has('drawingRoll') && action !== 'present')
    return (
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0.02]}>
        <cylinderGeometry args={[0.024, 0.024, 0.42, 18]} />
        <Mat c="#eef1f5" />
      </mesh>
    );
  if (has('multimeter'))
    return (
      <group position={[0, -0.02, 0.04]} rotation={[0.3, 0, 0]}>
        <Box p={[0, 0, 0]} s={[0.075, 0.13, 0.032]} c="#f2c230" r={0.5} />
        <Box p={[0, 0.03, 0.017]} s={[0.055, 0.035, 0.004]} c="#a6e3a6" e="#a6e3a6" ei={0.5} />
        <mesh position={[0, -0.02, 0.018]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 0.006, 16]} />
          <Mat c="#2a2d33" />
        </mesh>
      </group>
    );
  if (has('wrench'))
    return (
      <group rotation={[0.4, 0, 0.1]} position={[0, -0.03, 0.03]}>
        <Box p={[0, -0.1, 0]} s={[0.026, 0.26, 0.012]} c="#aab2bc" m={0.85} r={0.25} />
        <mesh position={[0, -0.25, 0]}>
          <torusGeometry args={[0.034, 0.012, 8, 18, Math.PI * 1.5]} />
          <Mat c="#aab2bc" m={0.85} r={0.25} />
        </mesh>
      </group>
    );
  if (spec.id === 'welding')
    return (
      <group rotation={[0.7, 0, 0]} position={[0, -0.03, 0.04]}>
        <mesh>
          <cylinderGeometry args={[0.022, 0.026, 0.2, 14]} />
          <Mat c="#2a2d33" />
        </mesh>
        <mesh position={[0, -0.14, 0.02]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.015, 0.1, 12]} />
          <Mat c="#b08d57" m={0.75} r={0.3} />
        </mesh>
      </group>
    );
  return null;
};

// ------------------------------------------------------------ character

export const Character: React.FC<{spec: CharacterSpec; action?: Action; t?: number; position?: V3; rotationY?: number}> = ({
  spec,
  action = 'idle',
  t = 0,
  position = [0, 0, 0],
  rotationY = 0,
}) => {
  // role guard: never show a role performing an action it does not do
  const allowed = ROLE_ACTIONS[spec.id] ?? ['idle'];
  const act: Action = allowed.includes(action) ? action : 'idle';
  const pose = poseFor(act, t);
  const has = (a: string) => spec.accessories.includes(a as never);
  const glove = has('insulatedGloves') ? '#e0581c' : has('workGloves') ? (spec.id === 'welding' ? '#8a5a32' : '#6d7178') : undefined;
  const k = spec.height / 1.72;
  const b = spec.build;
  const cuff = spec.id === 'manager' ? '#eef3f8' : darken(spec.shirt, 0.8);
  const breathe = Math.sin(t * 1.7) * 0.003;
  const isUniform = spec.id !== 'manager';

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={[k * b, k, k * (0.93 + 0.07 * b)]}>
      <group position={[0, 0.95 - pose.drop, 0]}>
        {/* legs */}
        <Leg side={-1} pose={pose.ll} trousers={spec.trousers} />
        <Leg side={1} pose={pose.rl} trousers={spec.trousers} />
        {/* pelvis + belt */}
        <Box p={[0, 0.0, 0]} s={[0.33, 0.15, 0.2]} c={spec.trousers} r={0.85} />
        <mesh position={[0, 0.07, 0]} scale={[1, 1, 0.62]}>
          <cylinderGeometry args={[0.172, 0.172, 0.035, 32]} />
          <Mat c="#17191d" r={0.5} />
        </mesh>
        <Box p={[0, 0.07, 0.108]} s={[0.05, 0.03, 0.01]} c="#9aa3ad" m={0.8} r={0.3} />

        {/* torso (spine pivot at waist) */}
        <group position={[0, 0.06, 0]} rotation={[pose.spine, pose.twist, 0]}>
          <group position={[0, breathe, 0]}>
            <mesh position={[0, 0.23, 0]} scale={[1, 1, 0.6]} castShadow>
              <capsuleGeometry args={[0.172, 0.27, 10, 24]} />
              <Mat c={spec.shirt} r={0.85} />
            </mesh>
            {/* shoulder yoke */}
            <mesh position={[0, 0.39, 0]} scale={[1.04, 0.45, 0.64]} castShadow>
              <sphereGeometry args={[0.182, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <Mat c={spec.shirtAccent} r={0.8} />
            </mesh>
            {/* collar */}
            <mesh position={[0, 0.47, 0.0]} rotation={[0.25, 0, 0]}>
              <torusGeometry args={[0.062, 0.016, 8, 24, Math.PI * 1.25]} />
              <Mat c={spec.id === 'manager' ? '#f4f7fb' : darken(spec.shirt, 0.85)} r={0.85} />
            </mesh>
            {/* placket + buttons */}
            <Box p={[0, 0.25, 0.104]} s={[0.022, 0.36, 0.004]} c={darken(spec.shirt, 0.9)} />
            {[0.12, 0.2, 0.28, 0.36].map((y) => (
              <Ball key={y} p={[0, y, 0.107]} r={0.006} c="#e9edf2" />
            ))}
            {/* chest pockets */}
            {[-1, 1].map((s) => (
              <group key={s}>
                <Box p={[s * 0.075, 0.3, 0.1]} s={[0.07, 0.075, 0.006]} c={darken(spec.shirt, 0.92)} />
                <Box p={[s * 0.075, 0.338, 0.103]} s={[0.074, 0.016, 0.006]} c={darken(spec.shirt, 0.85)} />
              </group>
            ))}
            {/* department badge (logo PLACEHOLDER) on left chest pocket */}
            <Box p={[-0.075, 0.3, 0.105]} s={[0.045, 0.03, 0.003]} c="#e8771e" />
            {/* reflective stripes on department uniform */}
            {isUniform &&
              [0.12, 0.2].map((y) => (
                <mesh key={y} position={[0, y, 0]} scale={[1.005, 1, 0.605]}>
                  <cylinderGeometry args={[0.174, 0.174, 0.02, 32, 1, true]} />
                  <Mat c="#dfe3e8" r={0.25} m={0.25} e="#a7b0ba" ei={0.18} />
                </mesh>
              ))}
            {/* manager tie */}
            {spec.id === 'manager' && (
              <>
                <Box p={[0, 0.27, 0.106]} s={[0.034, 0.26, 0.005]} c="#1f3a5f" />
                <Box p={[0, 0.42, 0.105]} s={[0.03, 0.03, 0.01]} c="#1f3a5f" />
              </>
            )}
            {/* lanyard + ID */}
            {has('lanyard') && (
              <>
                <mesh position={[0, 0.39, 0.08]} rotation={[0.25, 0, Math.PI]}>
                  <torusGeometry args={[0.07, 0.005, 6, 24, Math.PI]} />
                  <Mat c="#e8771e" />
                </mesh>
                <Box p={[0, 0.305, 0.112]} s={[0.052, 0.072, 0.004]} c="#f4f6f8" />
                <Box p={[0, 0.318, 0.1145]} s={[0.022, 0.026, 0.001]} c="#9aa3ad" />
              </>
            )}
            {/* tool belt */}
            {has('toolBelt') && (
              <group position={[0, 0.02, 0]}>
                <mesh scale={[1, 1, 0.64]}>
                  <cylinderGeometry args={[0.188, 0.188, 0.05, 32]} />
                  <Mat c="#3b2c1f" r={0.6} />
                </mesh>
                {[-1, 1].map((s) => (
                  <group key={s}>
                    <Box p={[s * 0.165, -0.06, 0.05]} s={[0.075, 0.13, 0.085]} c="#4a3826" r={0.8} />
                    <Box p={[s * 0.165, 0.0, 0.05]} s={[0.012, 0.06, 0.012]} c="#aab2bc" m={0.8} r={0.3} />
                  </group>
                ))}
                {has('multimeter') && <Box p={[-0.12, -0.05, 0.12]} s={[0.012, 0.09, 0.012]} c="#c23b3b" />}
              </group>
            )}
            {/* leather apron */}
            {has('leatherApron') && (
              <>
                <Box p={[0, 0.06, 0.112]} s={[0.31, 0.6, 0.018]} c="#7a4f2c" r={0.95} />
                <Box p={[0, 0.355, 0.112]} s={[0.16, 0.04, 0.02]} c="#6a4326" r={0.95} />
              </>
            )}

            {/* arms */}
            <Arm side={-1} pose={pose.l} sleeve={spec.shirt} cuff={cuff} skin={spec.skin} glove={glove}>
              <LeftItem spec={spec} walking={act === 'walk'} />
            </Arm>
            <Arm side={1} pose={pose.r} sleeve={spec.shirt} cuff={cuff} skin={spec.skin} glove={glove}>
              <RightItem spec={spec} action={act} />
            </Arm>

            {/* head */}
            <Head spec={spec} pitch={pose.headPitch} yaw={pose.headYaw} has={has} shieldDown={!!pose.shieldDown} />
          </group>
        </group>
      </group>
    </group>
  );
};
