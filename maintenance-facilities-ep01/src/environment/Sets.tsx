// Additional sets inside the plant world: department office, facility (utilities) bay,
// technician workstations (distribution board, gearbox cross-section, welding bay).
import React from 'react';
import {FONT, MONO, TexPlane} from '../lib/text';
import {DistributionBoard} from './Factory';

type V3 = [number, number, number];
const rnd = (s: number) => {
  const x = Math.sin(s * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
const B: React.FC<{p: V3; s: V3; c: string; rot?: V3; r?: number; m?: number; e?: string; ei?: number; o?: number}> = ({p, s, c, rot = [0, 0, 0], r = 0.7, m = 0, e, ei = 0, o = 1}) => (
  <mesh position={p} rotation={rot} castShadow={o >= 1} receiveShadow>
    <boxGeometry args={s} />
    <meshStandardMaterial color={c} roughness={r} metalness={m} emissive={e ?? '#000'} emissiveIntensity={ei} transparent={o < 1} opacity={o} depthWrite={o >= 0.99} />
  </mesh>
);
const Cyl: React.FC<{p: V3; r: number; h: number; c: string; rot?: V3; m?: number; rough?: number; seg?: number}> = ({p, r, h, c, rot = [0, 0, 0], m = 0, rough = 0.6, seg = 24}) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow>
    <cylinderGeometry args={[r, r, h, seg]} />
    <meshStandardMaterial color={c} metalness={m} roughness={rough} />
  </mesh>
);

// ------------------------------------------------------------ department office

export const OFFICE = {center: [-32, 0, 8] as V3};

export const Office: React.FC<{signGlow?: number}> = ({signGlow = 1}) => {
  const [cx, , cz] = OFFICE.center;
  return (
    <group>
      {/* floor + ceiling panel lights */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[cx, 0.01, cz]} receiveShadow>
        <planeGeometry args={[11.8, 9]} />
        <meshStandardMaterial color="#8a8f96" roughness={0.6} />
      </mesh>
      <B p={[cx, 3.2, cz]} s={[11.8, 0.1, 9]} c="#d9dde2" />
      {[-3, 0, 3].map((dx) => (
        <B key={dx} p={[cx + dx, 3.14, cz]} s={[1.6, 0.03, 0.6]} c="#fff7e6" e="#fff4dc" ei={2} />
      ))}
      <pointLight position={[cx, 2.9, cz]} intensity={14} distance={12} color="#ffe9cc" />
      {/* glass walls (front z=3.5, side x=-26.1) with mullions */}
      <B p={[cx, 1.6, cz - 4.5]} s={[11.8, 3.2, 0.04]} c="#a9cbe6" o={0.16} r={0.05} />
      <B p={[cx + 5.9, 1.6, cz]} s={[0.04, 3.2, 9]} c="#a9cbe6" o={0.16} r={0.05} />
      {Array.from({length: 7}, (_, i) => (
        <B key={i} p={[cx - 5.9 + i * 1.97, 1.6, cz - 4.5]} s={[0.06, 3.2, 0.08]} c="#5a6068" m={0.5} />
      ))}
      {Array.from({length: 5}, (_, i) => (
        <B key={`s${i}`} p={[cx + 5.9, 1.6, cz - 4.5 + i * 2.25]} s={[0.08, 3.2, 0.06]} c="#5a6068" m={0.5} />
      ))}
      {/* back wall (the hall wall is at x=-40) and partition z=12.5 */}
      <B p={[cx, 1.6, cz + 4.5]} s={[11.8, 3.2, 0.12]} c="#dfe3e7" />
      {/* department sign on the back wall (x = -39.85 faces +x) */}
      <group position={[-39.78, 2.25, cz]} rotation={[0, Math.PI / 2, 0]}>
        <B p={[0, 0, -0.04]} s={[5.4, 1.1, 0.06]} c="#1f3a5f" />
        <TexPlane
          id="sign"
          w={5.2}
          h={0.95}
          px={300}
          emissive={signGlow}
          draw={(ctx, w, h) => {
            ctx.fillStyle = '#1f3a5f';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#e8771e';
            ctx.fillRect(0, h - 14, w, 14);
            ctx.fillStyle = '#ffffff';
            ctx.font = `800 ${Math.round(h * 0.34)}px ${FONT}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('MAINTENANCE & FACILITIES', w / 2, h * 0.38);
            ctx.font = `600 ${Math.round(h * 0.2)}px ${FONT}`;
            ctx.fillStyle = '#cfe0f2';
            ctx.fillText('DEPARTMENT', w / 2, h * 0.74);
          }}
        />
      </group>
      {/* PM planning board on the partition wall */}
      <group position={[cx - 1.5, 1.7, cz + 4.43]} rotation={[0, Math.PI, 0]}>
        <TexPlane
          id="pmboard"
          w={3.2}
          h={1.4}
          px={260}
          draw={(ctx, w, h) => {
            ctx.fillStyle = '#f4f6f8';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#1f3a5f';
            ctx.font = `800 ${Math.round(h * 0.09)}px ${FONT}`;
            ctx.fillText('JADUAL PREVENTIVE MAINTENANCE', 24, h * 0.12);
            const cols = 12;
            const rows = 6;
            const gx = 24;
            const gy = h * 0.2;
            const cw = (w - 48) / cols;
            const rh = (h * 0.74) / rows;
            for (let r = 0; r < rows; r++)
              for (let c = 0; c < cols; c++) {
                ctx.strokeStyle = '#c7ced6';
                ctx.strokeRect(gx + c * cw, gy + r * rh, cw, rh);
                if (rnd(r * 13 + c) > 0.62) {
                  ctx.fillStyle = rnd(r + c * 7) > 0.3 ? '#3d8b5a' : '#e8771e';
                  ctx.fillRect(gx + c * cw + 4, gy + r * rh + 4, cw - 8, rh - 8);
                }
              }
          }}
        />
      </group>
      {/* KPI screen (generic, no real figures) */}
      <group position={[cx + 2.3, 1.75, cz + 4.43]} rotation={[0, Math.PI, 0]}>
        <B p={[0, 0, 0.03]} s={[2.1, 1.25, 0.05]} c="#111" />
        <TexPlane
          id="kpiscreen"
          w={2.0}
          h={1.15}
          px={260}
          emissive={0.8}
          draw={(ctx, w, h) => {
            ctx.fillStyle = '#0c1a2e';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = '#9fc4ff';
            ctx.font = `700 ${Math.round(h * 0.1)}px ${MONO}`;
            ctx.fillText('KPI', 20, h * 0.14);
            for (let i = 0; i < 8; i++) {
              const bh = h * (0.25 + rnd(i * 3) * 0.45);
              ctx.fillStyle = i % 3 === 2 ? '#e8771e' : '#2f8cff';
              ctx.fillRect(30 + i * ((w - 60) / 8), h * 0.9 - bh, (w - 60) / 8 - 14, bh);
            }
          }}
        />
      </group>
      {/* meeting table + chairs */}
      <B p={[cx, 0.74, cz]} s={[1.3, 0.06, 3.0]} c="#6b5038" r={0.5} />
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => <B key={`${sx}${sz}`} p={[cx + sx * 0.55, 0.37, cz + sz * 1.35]} s={[0.06, 0.72, 0.06]} c="#3a3f47" m={0.5} />),
      )}
      {/* documents + laptop on the table */}
      <B p={[cx - 0.2, 0.78, cz - 0.4]} s={[0.3, 0.01, 0.42]} c="#f2f2ee" />
      <B p={[cx + 0.25, 0.78, cz + 0.5]} s={[0.36, 0.02, 0.26]} c="#20242a" />
      <B p={[cx + 0.25, 0.9, cz + 0.62]} s={[0.36, 0.24, 0.015]} c="#20242a" rot={[-0.3, 0, 0]} />
      {/* desks along the side */}
      {[0, 1, 2].map((i) => (
        <group key={i} position={[cx - 4.6, 0, cz - 2.5 + i * 2.2]}>
          <B p={[0, 0.74, 0]} s={[1.4, 0.05, 0.75]} c="#d6d9dd" />
          <B p={[-0.2, 1.05, -0.2]} s={[0.55, 0.34, 0.03]} c="#14171c" e="#1d6fe0" ei={0.3} />
        </group>
      ))}
    </group>
  );
};

// ------------------------------------------------------------ facility (utilities) bay

export const FacilityBay: React.FC<{t: number}> = ({t}) => (
  <group position={[32, 0, 8]}>
    {/* floor marking */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
      <planeGeometry args={[10, 8]} />
      <meshStandardMaterial color="#59626c" roughness={0.6} />
    </mesh>
    {/* air compressor package */}
    <group position={[-3, 0, -1.5]}>
      <B p={[0, 0.9, 0]} s={[1.8, 1.8, 1.2]} c="#2f6fd6" r={0.45} />
      <B p={[0.91, 0.9, 0]} s={[0.02, 1.2, 0.9]} c="#1a1f26" />
      {Array.from({length: 8}, (_, i) => (
        <B key={i} p={[0.925, 0.45 + i * 0.13, 0]} s={[0.01, 0.04, 0.85]} c="#5a6068" />
      ))}
      <B p={[-0.4, 1.4, 0.61]} s={[0.4, 0.3, 0.02]} c="#0d1622" e="#3ddc84" ei={0.6} />
    </group>
    {/* air receiver tank */}
    <group position={[-0.8, 0, -2]}>
      <Cyl p={[0, 1.3, 0]} r={0.55} h={2.0} c="#d7dbe0" m={0.4} rough={0.4} />
      <mesh position={[0, 2.3, 0]}>
        <sphereGeometry args={[0.55, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#d7dbe0" metalness={0.4} roughness={0.4} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <Cyl key={i} p={[Math.cos(i * 2.1) * 0.4, 0.15, Math.sin(i * 2.1) * 0.4]} r={0.05} h={0.3} c="#3a3f47" />
      ))}
    </group>
    {/* air handling unit */}
    <group position={[2.2, 0, -2]}>
      <B p={[0, 1.1, 0]} s={[3.6, 2.2, 1.6]} c="#c3c9d0" r={0.5} m={0.2} />
      <mesh position={[1.81, 1.1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial color="#1c2026" />
      </mesh>
      <group position={[1.82, 1.1, 0]} rotation={[t * 6, 0, 0]}>
        {[0, 1, 2, 3].map((i) => (
          <B key={i} p={[0, 0, 0]} s={[0.02, 1.0, 0.18]} c="#8b949e" rot={[(i * Math.PI) / 4, 0, 0]} />
        ))}
      </group>
      <Cyl p={[-1.2, 2.6, 0]} r={0.35} h={1.0} c="#b7bec6" m={0.6} rough={0.35} />
    </group>
    {/* chiller with fans */}
    <group position={[0, 0, 2]}>
      <B p={[0, 0.9, 0]} s={[4, 1.8, 1.8]} c="#e2e6ea" r={0.5} />
      {[-1.3, 0, 1.3].map((x) => (
        <group key={x} position={[x, 1.82, 0]}>
          <Cyl p={[0, 0, 0]} r={0.55} h={0.05} c="#2a2f37" />
          <group rotation={[0, t * 8 + x, 0]}>
            {[0, 1, 2].map((i) => (
              <B key={i} p={[0, 0.04, 0]} s={[0.9, 0.02, 0.14]} c="#8b949e" rot={[0, (i * Math.PI) / 3, 0]} />
            ))}
          </group>
        </group>
      ))}
    </group>
    {/* pipework: blue (compressed air), green (chilled water) */}
    <Cyl p={[0.6, 2.8, -2]} r={0.08} h={3.2} c="#2f6fd6" rot={[0, 0, Math.PI / 2]} m={0.3} />
    <Cyl p={[-0.8, 2.8, -0.2]} r={0.1} h={4.2} c="#3d8b5a" rot={[Math.PI / 2, 0, 0]} m={0.3} />
  </group>
);

// ------------------------------------------------------------ technician workstations

export const STATIONS = {
  db: [20, 0, -13.9] as V3,
  gearbox: [24.4, 0, -9.4] as V3,
  weld: [30.2, 0, -11.8] as V3,
};

/** Gearbox on a stand with a cut-away housing showing rotating gears and bearings. */
export const GearboxCutaway: React.FC<{t: number; reveal?: number}> = ({t, reveal = 1}) => {
  const gear = (r: number, teeth: number, w: number, color: string, rot: number) => (
    <group rotation={[0, 0, rot]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r, r, w, 32]} />
        <meshStandardMaterial color={color} metalness={0.75} roughness={0.3} />
      </mesh>
      {Array.from({length: teeth}, (_, i) => {
        const a = (i / teeth) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * (r + 0.025), Math.sin(a) * (r + 0.025), 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.05, 0.035, w]} />
            <meshStandardMaterial color={color} metalness={0.75} roughness={0.3} />
          </mesh>
        );
      })}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.04, w + 0.3, 16]} />
        <meshStandardMaterial color="#9aa3ad" metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  );
  return (
    <group>
      {/* stand */}
      <B p={[0, 0.45, 0]} s={[1.2, 0.9, 0.8]} c="#3a4048" m={0.3} />
      <group position={[0, 1.25, 0]}>
        {/* housing: back + bottom + top shells; front face removed (cross-section) */}
        <B p={[0, 0, -0.22]} s={[1.0, 0.7, 0.04]} c="#7d97b3" m={0.4} r={0.45} />
        <B p={[0, -0.35, 0]} s={[1.0, 0.04, 0.48]} c="#7d97b3" m={0.4} r={0.45} />
        <B p={[0, 0.35, 0]} s={[1.0, 0.04, 0.48]} c="#7d97b3" m={0.4} r={0.45} o={1 - reveal * 0.7} />
        <B p={[0, 0, 0.22]} s={[1.0, 0.7, 0.04]} c="#7d97b3" m={0.4} r={0.45} o={1 - reveal} />
        <group position={[-0.2, 0.02, 0]}>{gear(0.22, 22, 0.12, '#c9a14a', t * 1.5)}</group>
        <group position={[0.22, -0.05, 0]}>{gear(0.15, 15, 0.12, '#b8c0ca', -t * 1.5 * (22 / 15) + 0.1)}</group>
        {/* bearings */}
        {[-0.2, 0.22].map((x) => (
          <mesh key={x} position={[x, x < 0 ? 0.02 : -0.05, -0.17]}>
            <torusGeometry args={[0.07, 0.022, 10, 24]} />
            <meshStandardMaterial color="#e8771e" emissive="#e8771e" emissiveIntensity={0.25 * reveal} metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
        {/* motor */}
        <Cyl p={[-0.85, 0.02, 0]} r={0.2} h={0.5} c="#2f6fd6" rot={[0, 0, Math.PI / 2]} rough={0.45} />
      </group>
    </group>
  );
};

/** Welding bay: bench, steel workpiece, arc light and sparks while `arc` is on. */
export const WeldBay: React.FC<{t: number; arc: boolean}> = ({t, arc}) => {
  const flick = 0.6 + 0.4 * Math.abs(Math.sin(t * 37)) * Math.abs(Math.sin(t * 11));
  return (
    <group>
      {/* welding screens (curtains) */}
      {[-1.4, 1.4].map((x) => (
        <B key={x} p={[x, 1.0, -0.6]} s={[0.04, 2.0, 1.6]} c="#9a3a24" o={0.55} />
      ))}
      <B p={[0, 1.0, -1.4]} s={[2.8, 2.0, 0.04]} c="#9a3a24" o={0.55} />
      {/* bench + workpiece */}
      <B p={[0, 0.42, -0.4]} s={[1.6, 0.06, 0.8]} c="#5a6068" m={0.6} r={0.4} />
      {[-0.7, 0.7].map((x) => (
        <B key={x} p={[x, 0.2, -0.4]} s={[0.06, 0.4, 0.7]} c="#3a3f47" />
      ))}
      <B p={[0, 0.5, -0.35]} s={[0.9, 0.08, 0.3]} c="#8a9099" m={0.7} r={0.35} />
      <B p={[0.1, 0.62, -0.35]} s={[0.08, 0.2, 0.3]} c="#8a9099" m={0.7} r={0.35} />
      {/* weld bead glow */}
      <B p={[0.05, 0.55, -0.35]} s={[0.04, 0.02, 0.22]} c="#ffb070" e="#ff8a3d" ei={arc ? 2.5 : 0.4} />
      {arc && (
        <>
          <pointLight position={[0.05, 0.6, -0.25]} color="#a8d8ff" intensity={30 * flick} distance={8} />
          <mesh position={[0.05, 0.6, -0.3]}>
            <sphereGeometry args={[0.03, 12, 10]} />
            <meshBasicMaterial color="#e8f6ff" />
          </mesh>
          {/* sparks */}
          {Array.from({length: 40}, (_, i) => {
            const life = 0.6 + rnd(i) * 0.5;
            const age = (t + rnd(i * 3) * life) % life;
            const ang = rnd(i * 7) * Math.PI * 2;
            const sp = 1.2 + rnd(i * 11) * 1.8;
            const x = 0.05 + Math.cos(ang) * sp * age;
            const z = -0.3 + Math.sin(ang) * sp * age * 0.6;
            const y = 0.6 + 1.6 * age - 4.9 * age * age;
            if (y < 0.02) return null;
            return (
              <mesh key={i} position={[x, y, z]}>
                <sphereGeometry args={[0.008, 6, 4]} />
                <meshBasicMaterial color={age < life * 0.4 ? '#fff4c2' : '#ff9a3d'} />
              </mesh>
            );
          })}
        </>
      )}
    </group>
  );
};

/** All three technician stations together (used in Scene 05). */
export const Workstations: React.FC<{t: number; dbOpen: number; gearReveal: number; arc: boolean}> = ({t, dbOpen, gearReveal, arc}) => (
  <group>
    <DistributionBoard p={STATIONS.db} t={t} open={dbOpen} />
    <group position={STATIONS.gearbox}>
      <GearboxCutaway t={t} reveal={gearReveal} />
    </group>
    <group position={STATIONS.weld}>
      <WeldBay t={t} arc={arc} />
    </group>
  </group>
);
