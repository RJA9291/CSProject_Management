// Modern automotive plant interior (Malaysia), stylised-realistic, built in Three.js.
// Production hall with a robotic body-in-white welding line, conveyor, high-bay
// lighting, ventilation ducting, electrical panels and a maintenance workshop corner.
import React from 'react';

type V3 = [number, number, number];

const M: React.FC<{c: string; r?: number; m?: number; e?: string; ei?: number}> = ({c, r = 0.7, m = 0, e, ei = 0}) => (
  <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? '#000000'} emissiveIntensity={ei} />
);
const B: React.FC<{p: V3; s: V3; c: string; rot?: V3; r?: number; m?: number; e?: string; ei?: number}> = ({p, s, c, rot = [0, 0, 0], r, m, e, ei}) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow>
    <boxGeometry args={s} />
    <M c={c} r={r} m={m} e={e} ei={ei} />
  </mesh>
);
const Cyl: React.FC<{p: V3; r: number; h: number; c: string; rot?: V3; m?: number; rough?: number; e?: string; ei?: number}> = ({p, r, h, c, rot = [0, 0, 0], m, rough, e, ei}) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow>
    <cylinderGeometry args={[r, r, h, 24]} />
    <M c={c} m={m} r={rough} e={e} ei={ei} />
  </mesh>
);

/** Six-axis industrial robot (stylised) with animated joints. */
export const Robot: React.FC<{p: V3; rotY?: number; t: number; phase?: number; color?: string}> = ({p, rotY = 0, t, phase = 0, color = '#e8771e'}) => {
  const a = Math.sin(t * 1.4 + phase);
  const j1 = 0.5 * Math.sin(t * 0.7 + phase);
  const j2 = -0.4 + 0.25 * a;
  const j3 = 1.1 + 0.3 * Math.sin(t * 1.4 + phase + 1);
  const j5 = 0.4 * Math.sin(t * 2 + phase);
  return (
    <group position={p} rotation={[0, rotY, 0]}>
      <Cyl p={[0, 0.15, 0]} r={0.42} h={0.3} c="#3a3f47" m={0.5} rough={0.5} />
      <group rotation={[0, j1, 0]}>
        <Cyl p={[0, 0.45, 0]} r={0.32} h={0.35} c={color} rough={0.45} />
        <group position={[0, 0.7, 0]} rotation={[0, 0, j2]}>
          <B p={[0, 0.65, 0]} s={[0.28, 1.3, 0.3]} c={color} r={0.45} />
          <Cyl p={[0, 0, 0]} r={0.2} h={0.42} c="#3a3f47" rot={[Math.PI / 2, 0, 0]} m={0.5} />
          <group position={[0, 1.3, 0]} rotation={[0, 0, j3]}>
            <Cyl p={[0, 0, 0]} r={0.16} h={0.36} c="#3a3f47" rot={[Math.PI / 2, 0, 0]} m={0.5} />
            <B p={[0.55, 0, 0]} s={[1.1, 0.22, 0.24]} c={color} r={0.45} />
            <group position={[1.1, 0, 0]} rotation={[0, 0, j5]}>
              <Cyl p={[0, 0, 0]} r={0.1} h={0.26} c="#3a3f47" rot={[Math.PI / 2, 0, 0]} m={0.5} />
              {/* spot-welding gun */}
              <B p={[0.2, -0.05, 0]} s={[0.25, 0.08, 0.12]} c="#5a606a" m={0.6} r={0.4} />
              <B p={[0.32, -0.18, 0]} s={[0.05, 0.25, 0.05]} c="#b08d57" m={0.7} r={0.3} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

/** Body-in-white car shell (stylised). */
export const CarBody: React.FC<{p: V3; rotY?: number; c?: string}> = ({p, rotY = 0, c = '#c9ced6'}) => (
  <group position={p} rotation={[0, rotY, 0]}>
    <B p={[0, 0.55, 0]} s={[4.3, 0.55, 1.75]} c={c} m={0.55} r={0.35} />
    <B p={[-0.15, 1.0, 0]} s={[2.3, 0.45, 1.6]} c={c} m={0.55} r={0.35} />
    {/* window openings */}
    <B p={[-0.15, 1.0, 0.805]} s={[2.0, 0.32, 0.01]} c="#2b3440" />
    <B p={[-0.15, 1.0, -0.805]} s={[2.0, 0.32, 0.01]} c="#2b3440" />
    {/* wheel arches */}
    {[-1.35, 1.35].map((x) => (
      <B key={x} p={[x, 0.32, 0]} s={[0.75, 0.3, 1.78]} c="#20262e" />
    ))}
  </group>
);

/** Electrical distribution board with indicator lamps. */
export const DistributionBoard: React.FC<{p: V3; rotY?: number; open?: number; t: number}> = ({p, rotY = 0, open = 0, t}) => (
  <group position={p} rotation={[0, rotY, 0]}>
    <B p={[0, 1.0, 0]} s={[1.2, 2.0, 0.45]} c="#c8ccd2" r={0.5} m={0.2} />
    {/* internals visible when door opens */}
    <B p={[0, 1.05, 0.2]} s={[1.05, 1.8, 0.02]} c="#2a2f37" />
    {Array.from({length: 4}, (_, row) =>
      Array.from({length: 5}, (_, i) => <B key={`${row}-${i}`} p={[-0.4 + i * 0.2, 1.55 - row * 0.32, 0.22]} s={[0.12, 0.22, 0.05]} c="#e9ecf0" />),
    )}
    {[0, 1, 2].map((i) => (
      <B key={i} p={[-0.25 + i * 0.25, 1.85, 0.225]} s={[0.07, 0.07, 0.02]} c={['#ff4b4b', '#3ddc84', '#ffb238'][i]} e={['#ff4b4b', '#3ddc84', '#ffb238'][i]} ei={i === 2 ? 0.6 + 0.6 * Math.sin(t * 6) : 1} />
    ))}
    {/* door hinged on the left */}
    <group position={[-0.6, 1.0, 0.23]} rotation={[0, -open * 1.6, 0]}>
      <B p={[0.6, 0, 0]} s={[1.2, 2.0, 0.03]} c="#cdd1d7" r={0.45} m={0.2} />
      <B p={[0.6, 0.55, 0.02]} s={[0.3, 0.2, 0.01]} c="#f2c230" />
    </group>
  </group>
);

/** CNC / press-type machine block. */
export const Machine: React.FC<{p: V3; rotY?: number; t: number; alarm?: boolean}> = ({p, rotY = 0, t, alarm = false}) => (
  <group position={p} rotation={[0, rotY, 0]}>
    <B p={[0, 1.1, 0]} s={[2.4, 2.2, 1.8]} c="#d9dde2" r={0.5} m={0.2} />
    <B p={[0, 1.2, 0.905]} s={[1.3, 0.9, 0.02]} c="#26303c" r={0.1} m={0.3} />
    <B p={[0.9, 1.5, 0.92]} s={[0.35, 0.25, 0.04]} c="#0d1622" e="#2f8cff" ei={0.6} />
    <B p={[0, 0.1, 0]} s={[2.5, 0.2, 1.9]} c="#3a3f47" />
    <Cyl p={[0, 2.35 + 0.05 * Math.sin(t * 3), 0]} r={0.25} h={0.2} c="#e8771e" />
    {/* signal tower (beacon): amber flashes when alarm */}
    <Cyl p={[0.95, 2.5, 0.6]} r={0.05} h={0.5} c="#3a3f47" />
    <Cyl p={[0.95, 2.82, 0.6]} r={0.08} h={0.14} c="#3ddc84" e="#3ddc84" ei={alarm ? 0.2 : 1.2} />
    <Cyl p={[0.95, 2.97, 0.6]} r={0.08} h={0.14} c="#ffb238" e="#ffb238" ei={alarm ? (Math.sin(t * 12) > 0 ? 4 : 0.2) : 0.1} />
    {alarm && Math.sin(t * 12) > 0 && <pointLight position={[0.95, 3.0, 0.8]} color="#ffb238" intensity={8} distance={6} />}
  </group>
);

/** The production hall; `t` is time in seconds for animation. */
export const Factory: React.FC<{t: number; lights?: number; cutaway?: boolean; dbOpen?: number; alarm?: boolean; lineT?: number; stop?: {x: number; t: number}}> = ({t, lights = 1, cutaway = false, dbOpen = 0, alarm = false, lineT, stop}) => {
  const conveyor = ((lineT ?? t) * 0.6) % 7;
  return (
    <group>
      {/* floor: epoxy grey with walkway lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[90, 70]} />
        <M c="#6d747d" r={0.55} m={0.05} />
      </mesh>
      {[-3.2, 3.2].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, z]}>
          <planeGeometry args={[80, 0.12]} />
          <M c="#f2c230" r={0.6} />
        </mesh>
      ))}
      {[9, -9].map((z) => (
        <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, z]}>
          <planeGeometry args={[80, 1.6]} />
          <M c="#4f7a5a" r={0.7} />
        </mesh>
      ))}

      {/* columns + roof trusses */}
      {Array.from({length: 9}, (_, i) => -32 + i * 8).map((x) =>
        [-14, 14].map((z) => <B key={`${x}${z}`} p={[x, 5, z]} s={[0.5, 10, 0.5]} c="#9aa3ad" m={0.4} r={0.5} />),
      )}
      {Array.from({length: 9}, (_, i) => -32 + i * 8).map((x) => (
        <group key={x}>
          <B p={[x, 10.2, 0]} s={[0.3, 0.5, 28.5]} c="#8b949e" m={0.4} />
          <B p={[x, 9.4, 0]} s={[0.12, 0.12, 28]} c="#8b949e" m={0.4} />
        </group>
      ))}
      {/* roof + walls */}
      {!cutaway && <B p={[0, 10.8, 0]} s={[80, 0.2, 30]} c="#c9ced4" r={0.9} />}
      <B p={[0, 5, -15]} s={[80, 10, 0.2]} c="#b9c0c8" r={0.9} />
      <B p={[-40, 5, 0]} s={[0.2, 10, 30]} c="#b9c0c8" r={0.9} />

      {/* high-bay lights */}
      {Array.from({length: 8}, (_, i) => -28 + i * 8).map((x) =>
        [-8, 0, 8].map((z) => (
          <group key={`${x}${z}`} position={[x, 9.2, z]}>
            <Cyl p={[0, 0, 0]} r={0.45} h={0.25} c="#2b3038" />
            <Cyl p={[0, -0.14, 0]} r={0.4} h={0.03} c="#fff6e0" e="#fff1cf" ei={2.2 * lights} />
          </group>
        )),
      )}

      {/* ventilation ducting */}
      {[-6, 6].map((z) => (
        <group key={z}>
          <Cyl p={[0, 8.6, z]} r={0.55} h={78} c="#b7bec6" rot={[0, 0, Math.PI / 2]} m={0.6} rough={0.35} />
          {Array.from({length: 9}, (_, i) => -32 + i * 8).map((x) => (
            <Cyl key={x} p={[x + 3, 8.6, z]} r={0.62} h={0.12} c="#9aa3ad" rot={[0, 0, Math.PI / 2]} m={0.6} />
          ))}
        </group>
      ))}

      {/* production line: conveyor + car bodies + robots */}
      <B p={[0, 0.25, 0]} s={[60, 0.5, 2.4]} c="#3a3f47" m={0.4} r={0.5} />
      {Array.from({length: 40}, (_, i) => (
        <B key={i} p={[-30 + i * 1.5 + (conveyor % 1.5), 0.52, 0]} s={[0.08, 0.04, 2.2]} c="#5a606a" m={0.5} />
      ))}
      {[-21, -14, -7, 0, 7, 14, 21].map((x) => (
        <CarBody key={x} p={[x + conveyor - 3.5, 0.55, 0]} />
      ))}
      {[-17.5, -10.5, -3.5, 3.5, 10.5, 17.5].map((x, i) => (
        <React.Fragment key={x}>
          <Robot p={[x, 0, 2.3]} rotY={Math.PI / 2 + 0.3} t={stop && stop.x === x ? stop.t : t} phase={i * 1.3} />
          <Robot p={[x + 1.2, 0, -2.3]} rotY={-Math.PI / 2 - 0.3} t={t} phase={i * 1.1 + 2} />
        </React.Fragment>
      ))}
      {/* safety fencing */}
      {[-4.2, 4.2].map((z) =>
        Array.from({length: 24}, (_, i) => -23 + i * 2).map((x) => (
          <group key={`${z}${x}`}>
            <B p={[x, 1, z]} s={[0.06, 2, 0.06]} c="#f2c230" />
            <mesh position={[x + 1, 1.1, z]}>
              <boxGeometry args={[1.94, 1.6, 0.02]} />
              <meshStandardMaterial color="#9fb3c8" transparent opacity={0.18} roughness={0.3} />
            </mesh>
            <B p={[x + 1, 1.9, z]} s={[1.94, 0.04, 0.04]} c="#f2c230" />
          </group>
        )),
      )}

      {/* side bays: machines, electrical room wall, workshop */}
      {[-24, -16].map((x) => (
        <Machine key={x} p={[x, 0, -11]} t={t} alarm={alarm && x === -16} />
      ))}
      {[10, 11.5, 13, 14.5].map((x) => (
        <DistributionBoard key={x} p={[x, 0, -14.6]} t={t} open={x === 11.5 ? dbOpen : 0} />
      ))}
      {/* workshop corner: workbench + racks */}
      <group position={[24, 0, -11.5]}>
        <B p={[0, 0.9, 0]} s={[3.2, 0.08, 1.0]} c="#7a5a3a" />
        {[-1.5, 1.5].map((x) => (
          <B key={x} p={[x, 0.45, 0]} s={[0.08, 0.9, 0.9]} c="#4a5058" />
        ))}
        <B p={[0, 1.8, -0.45]} s={[3.2, 1.6, 0.05]} c="#3a4048" />
        {Array.from({length: 10}, (_, i) => (
          <B key={i} p={[-1.3 + i * 0.29, 1.8, -0.4]} s={[0.04, 0.35, 0.03]} c="#aab2bc" m={0.7} />
        ))}
        <B p={[3.2, 1.2, 0]} s={[1.0, 2.4, 0.9]} c="#e8771e" />
      </group>
    </group>
  );
};
