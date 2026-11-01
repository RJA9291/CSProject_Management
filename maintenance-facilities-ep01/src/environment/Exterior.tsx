// Outside the plant: building shell, roof (fades for the cutaway reveal), car park,
// trees, road, street lights. Dusk lighting.
import React from 'react';

type V3 = [number, number, number];
const rnd = (s: number) => {
  const x = Math.sin(s * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const T: React.FC<{p: V3; s: V3; c: string; o?: number; e?: string; ei?: number; r?: number}> = ({p, s, c, o = 1, e, ei = 0, r = 0.8}) => (
  <mesh position={p} castShadow={o >= 1} receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={r} transparent={o < 1} opacity={o} emissive={e ?? '#000'} emissiveIntensity={ei} depthWrite={o >= 0.99} />
  </mesh>
);

export const Exterior: React.FC<{roof: number; walls?: number}> = ({roof, walls = 1}) => (
  <group>
    {/* ground: asphalt + grass verges */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
      <planeGeometry args={[400, 400]} />
      <meshStandardMaterial color="#3d4248" roughness={0.95} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, -60]} receiveShadow>
      <planeGeometry args={[400, 60]} />
      <meshStandardMaterial color="#3e5a3a" roughness={1} />
    </mesh>
    {/* road */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 45]}>
      <planeGeometry args={[400, 12]} />
      <meshStandardMaterial color="#2c3036" roughness={0.9} />
    </mesh>
    {Array.from({length: 30}, (_, i) => (
      <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-150 + i * 10, -0.015, 45]}>
        <planeGeometry args={[4, 0.25]} />
        <meshStandardMaterial color="#e9e9e2" />
      </mesh>
    ))}
    {/* car park: bays + cars */}
    {Array.from({length: 18}, (_, i) => (
      <group key={i}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-34 + i * 4, -0.015, 26]}>
          <planeGeometry args={[0.12, 5]} />
          <meshStandardMaterial color="#e9e9e2" />
        </mesh>
        {rnd(i) > 0.3 && (
          <group position={[-32 + i * 4, 0, 26]}>
            <T p={[0, 0.45, 0]} s={[1.8, 0.6, 4.2]} c={['#c8ccd2', '#2c3e57', '#8a1f1f', '#e9ecef', '#3a3f46'][i % 5]} r={0.35} />
            <T p={[0, 0.95, -0.2]} s={[1.6, 0.45, 2.2]} c="#20262e" r={0.2} />
          </group>
        )}
      </group>
    ))}
    {/* trees */}
    {Array.from({length: 40}, (_, i) => {
      const x = -120 + rnd(i * 3) * 240;
      const z = rnd(i * 7) > 0.5 ? 34 + rnd(i) * 6 : -30 - rnd(i * 2) * 40;
      const h = 4 + rnd(i * 5) * 4;
      if (Math.abs(x) < 44 && z > -22 && z < 22) return null;
      return (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, h * 0.25, 0]}>
            <cylinderGeometry args={[0.18, 0.25, h * 0.5, 8]} />
            <meshStandardMaterial color="#4a3a2a" />
          </mesh>
          <mesh position={[0, h * 0.7, 0]} castShadow>
            <sphereGeometry args={[h * 0.32, 12, 10]} />
            <meshStandardMaterial color={rnd(i) > 0.5 ? '#2f5a35' : '#3b6b3f'} roughness={1} />
          </mesh>
        </group>
      );
    })}
    {/* street lights */}
    {Array.from({length: 8}, (_, i) => (
      <group key={i} position={[-42 + i * 12, 0, 38]}>
        <mesh position={[0, 3.5, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 7, 8]} />
          <meshStandardMaterial color="#5a6068" metalness={0.5} />
        </mesh>
        <T p={[0, 7.05, -0.5]} s={[0.35, 0.15, 1.1]} c="#fff1cf" e="#fff1cf" ei={3} />
      </group>
    ))}
    {/* building shell (walls are slightly outside the interior hall) */}
    <T p={[0, 5.5, 15.25]} s={[80.8, 11, 0.4]} c="#d3d8de" o={walls} />
    <T p={[40.25, 5.5, 0]} s={[0.4, 11, 30.5]} c="#c9ced4" o={walls} />
    <T p={[0, 5.5, -15.25]} s={[80.8, 11, 0.4]} c="#c9ced4" o={walls} />
    <T p={[-40.25, 5.5, 0]} s={[0.4, 11, 30.5]} c="#c9ced4" o={walls} />
    {/* facade: blue band + window strip + loading docks */}
    <T p={[0, 9.5, 15.5]} s={[80.8, 1.2, 0.1]} c="#1f3a5f" o={walls} />
    <T p={[0, 6.4, 15.5]} s={[70, 0.9, 0.08]} c="#9fc4e8" e="#ffd9a0" ei={0.6} o={walls} />
    {[-20, -10, 0, 10, 20].map((x) => (
      <T key={x} p={[x, 2, 15.5]} s={[4, 4, 0.1]} c="#7d858f" o={walls} />
    ))}
    {/* roof with ridge lines (fades out for the cutaway) */}
    {roof > 0.01 && (
      <>
        <T p={[0, 11.1, 0]} s={[81, 0.3, 31]} c="#b8bfc7" o={roof} />
        {Array.from({length: 14}, (_, i) => (
          <T key={i} p={[-37 + i * 5.7, 11.3, 0]} s={[0.25, 0.15, 31]} c="#9aa3ad" o={roof} />
        ))}
        {Array.from({length: 6}, (_, i) => (
          <T key={`v${i}`} p={[-30 + i * 12, 11.6, -4]} s={[2.4, 0.8, 2.4]} c="#8b949e" o={roof} />
        ))}
      </>
    )}
  </group>
);
