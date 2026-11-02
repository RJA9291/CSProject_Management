// Episode 02 additions to the shared plant world (same materials, palette and lighting as Ep01).
import React from 'react';
import {FONT, MONO, TexPlane} from '../lib/text';
import {CarBody} from './Factory';

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
const Cyl: React.FC<{p: V3; r: number; h: number; c: string; rot?: V3; m?: number; rough?: number; e?: string; ei?: number}> = ({p, r, h, c, rot = [0, 0, 0], m = 0, rough = 0.6, e, ei = 0}) => (
  <mesh position={p} rotation={rot} castShadow receiveShadow>
    <cylinderGeometry args={[r, r, h, 24]} />
    <meshStandardMaterial color={c} metalness={m} roughness={rough} emissive={e ?? '#000'} emissiveIntensity={ei} />
  </mesh>
);

// ------------------------------------------------------------ robot cell (breakdown scenario)

export const CELL = {robotX: -3.5, andon: [-3.5, 0, 4.75] as V3, panel: [-1.6, 0, 4.75] as V3, hold: [-6.2, 0, 4.9] as V3};

/** Andon signal tower above the robot cell. state: 'green' | 'amber' | 'red'. */
export const Andon: React.FC<{state: 'green' | 'amber' | 'red'; t: number}> = ({state, t}) => {
  const blink = Math.sin(t * 10) > 0;
  const lamp = (y: number, c: string, on: boolean) => <Cyl p={[0, y, 0]} r={0.11} h={0.2} c={c} e={c} ei={on ? 3 : 0.08} />;
  return (
    <group position={CELL.andon}>
      <Cyl p={[0, 1.6, 0]} r={0.04} h={3.2} c="#3a3f47" m={0.5} />
      {lamp(3.3, '#3ddc84', state === 'green')}
      {lamp(3.52, '#ffb238', state === 'amber')}
      {lamp(3.74, '#ff3b3b', state === 'red' && blink)}
      {state === 'red' && blink && <pointLight position={[0, 3.74, 0.3]} color="#ff3b3b" intensity={14} distance={9} />}
    </group>
  );
};

/** Robot-cell control panel; `locked` shows lockout/tagout padlock and danger tag. */
export const CellPanel: React.FC<{locked: number}> = ({locked}) => (
  <group position={CELL.panel}>
    <B p={[0, 0.85, 0]} s={[0.7, 1.7, 0.35]} c="#c8ccd2" r={0.5} m={0.2} />
    <B p={[0, 1.35, 0.18]} s={[0.4, 0.25, 0.02]} c="#0d1622" e="#2f8cff" ei={0.5} />
    <Cyl p={[0.18, 0.95, 0.19]} r={0.06} h={0.03} c="#d93636" rot={[Math.PI / 2, 0, 0]} />
    {/* isolator handle */}
    <B p={[-0.18, 0.95, 0.2]} s={[0.12, 0.12, 0.04]} c="#f2c230" />
    <B p={[-0.18, 0.95, 0.24]} s={[0.04, 0.16, 0.04]} c="#d93636" rot={[0, 0, locked > 0.5 ? Math.PI / 2 : 0]} />
    {locked > 0 && (
      <group position={[-0.18, 0.82, 0.25]} scale={locked}>
        {/* padlock */}
        <B p={[0, -0.05, 0]} s={[0.07, 0.06, 0.03]} c="#d93636" />
        <mesh position={[0, 0.0, 0]}>
          <torusGeometry args={[0.025, 0.007, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#aab2bc" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* danger tag */}
        <group position={[0, -0.2, 0.01]}>
          <TexPlane
            id="loto-tag"
            w={0.13}
            h={0.22}
            px={1400}
            draw={(ctx, w, h) => {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, w, h);
              ctx.fillStyle = '#d93636';
              ctx.fillRect(0, 0, w, h * 0.32);
              ctx.fillStyle = '#ffffff';
              ctx.font = `800 ${Math.round(h * 0.12)}px ${FONT}`;
              ctx.textAlign = 'center';
              ctx.fillText('BAHAYA', w / 2, h * 0.21);
              ctx.fillStyle = '#111';
              ctx.font = `800 ${Math.round(h * 0.085)}px ${FONT}`;
              ctx.fillText('JANGAN', w / 2, h * 0.5);
              ctx.fillText('HIDUPKAN', w / 2, h * 0.62);
            }}
          />
        </group>
      </group>
    )}
  </group>
);

/** Quarantine stand: products on hold for Quality inspection. */
export const HoldSign: React.FC<{p: number}> = ({p}) =>
  p <= 0 ? null : (
    <group position={CELL.hold} scale={[1, p, 1]}>
      <Cyl p={[0, 0.6, 0]} r={0.03} h={1.2} c="#3a3f47" />
      <B p={[0, 0.02, 0]} s={[0.4, 0.04, 0.4]} c="#3a3f47" />
      <group position={[0, 1.35, 0.02]}>
        <TexPlane
          id="hold-sign"
          w={0.7}
          h={0.42}
          px={600}
          emissive={0.3}
          draw={(ctx, w, h) => {
            ctx.fillStyle = '#d93636';
            ctx.fillRect(0, 0, w, h);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 10;
            ctx.strokeRect(12, 12, w - 24, h - 24);
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.font = `800 ${Math.round(h * 0.38)}px ${FONT}`;
            ctx.fillText('HOLD', w / 2, h * 0.52);
            ctx.font = `700 ${Math.round(h * 0.14)}px ${FONT}`;
            ctx.fillText('TAHAN · PEMERIKSAAN QUALITY', w / 2, h * 0.8);
          }}
        />
      </group>
    </group>
  );

// ------------------------------------------------------------ Quality inspection station

export const QUALITY_AT: V3 = [-34.5, 0, -1.2];

export const QualityStation: React.FC = () => (
  <group position={QUALITY_AT}>
    <B p={[0, 0.06, 0]} s={[6.2, 0.12, 3.2]} c="#59626c" />
    <CarBody p={[0, 0.12, 0]} c="#d7dbe0" />
    {/* light tunnel: arches of white light bars */}
    {[-2.4, -1.2, 0, 1.2, 2.4].map((x) => (
      <group key={x} position={[x, 0, 0]}>
        {[-1.55, 1.55].map((z) => (
          <B key={z} p={[0, 1.4, z]} s={[0.08, 2.8, 0.08]} c="#2a2f37" />
        ))}
        <B p={[0, 2.82, 0]} s={[0.08, 0.08, 3.18]} c="#2a2f37" />
        <B p={[0.06, 2.75, 0]} s={[0.04, 0.05, 2.9]} c="#ffffff" e="#ffffff" ei={2.5} />
        {[-1.5, 1.5].map((z) => (
          <B key={`l${z}`} p={[0.06, 1.4, z]} s={[0.04, 2.4, 0.05]} c="#ffffff" e="#ffffff" ei={2.2} />
        ))}
      </group>
    ))}
    <pointLight position={[0, 2.4, 0]} color="#f4f8ff" intensity={18} distance={7} />
    {/* inspection table */}
    <B p={[0, 0.85, 2.4]} s={[1.4, 0.06, 0.6]} c="#d6d9dd" />
    <B p={[0, 0.42, 2.4]} s={[0.08, 0.84, 0.5]} c="#3a3f47" />
  </group>
);

// ------------------------------------------------------------ Logistics area

export const LOGISTICS = {racksZ: 12.9, driveZ: 10.9, x0: 8, x1: 21};

const PalletBoxes: React.FC<{p: V3; seed: number}> = ({p, seed}) => (
  <group position={p}>
    <B p={[0, 0.06, 0]} s={[1.2, 0.12, 1.0]} c="#9b7a4f" />
    {[0, 1, 2, 3].map((i) =>
      rnd(seed * 7 + i) > 0.15 ? (
        <B key={i} p={[(i % 2) * 0.58 - 0.29, 0.12 + 0.25 + Math.floor(i / 2) * 0.0, (Math.floor(i / 2) * 0.48) - 0.24]} s={[0.55, 0.5, 0.45]} c={rnd(seed + i) > 0.5 ? '#c49a6c' : '#b0875a'} r={0.9} />
      ) : null,
    )}
  </group>
);

export const LogisticsArea: React.FC = () => {
  const {racksZ, x0, x1} = LOGISTICS;
  const bays = Math.floor((x1 - x0) / 2.8);
  return (
    <group>
      {/* floor zone */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(x0 + x1) / 2, 0.006, racksZ - 1.6]}>
        <planeGeometry args={[x1 - x0 + 1, 4.2]} />
        <meshStandardMaterial color="#5d6670" roughness={0.65} />
      </mesh>
      {Array.from({length: bays + 1}, (_, i) => x0 + i * 2.8).map((x) => (
        <group key={x}>
          {[-0.55, 0.55].map((dz) => (
            <B key={dz} p={[x, 2.1, racksZ + dz]} s={[0.1, 4.2, 0.1]} c="#2f6fd6" />
          ))}
        </group>
      ))}
      {[0.02, 1.45, 2.85].map((y, li) => (
        <group key={y}>
          {[-0.55, 0.55].map((dz) => (
            <B key={dz} p={[(x0 + x1) / 2, y + 0.06, racksZ + dz]} s={[x1 - x0, 0.1, 0.08]} c="#e8771e" />
          ))}
          {Array.from({length: bays}, (_, i) => (
            <PalletBoxes key={i} p={[x0 + 1.4 + i * 2.8, y + 0.11, racksZ]} seed={i * 5 + li * 31} />
          ))}
        </group>
      ))}
    </group>
  );
};

/** Counterbalance forklift. `carry` shows a box of spare parts on the forks. */
export const Forklift: React.FC<{p: V3; rotY?: number; carry?: boolean; forkH?: number}> = ({p, rotY = 0, carry = false, forkH = 0.15}) => (
  <group position={p} rotation={[0, rotY, 0]}>
    {/* chassis + counterweight */}
    <B p={[0, 0.55, -0.1]} s={[1.1, 0.7, 1.7]} c="#f2c230" r={0.45} />
    <B p={[0, 0.7, -0.95]} s={[1.1, 0.75, 0.35]} c="#3a3f47" />
    {/* seat */}
    <B p={[0, 1.0, -0.35]} s={[0.5, 0.12, 0.45]} c="#20242a" />
    <B p={[0, 1.28, -0.58]} s={[0.5, 0.45, 0.1]} c="#20242a" />
    {/* steering wheel */}
    <mesh position={[0, 1.25, 0.18]} rotation={[-1.0, 0, 0]}>
      <torusGeometry args={[0.15, 0.02, 8, 20]} />
      <meshStandardMaterial color="#1a1c20" />
    </mesh>
    {/* overhead guard */}
    {[-0.48, 0.48].map((x) =>
      [-0.7, 0.45].map((z) => <B key={`${x}${z}`} p={[x, 1.55, z]} s={[0.06, 1.3, 0.06]} c="#2a2f37" />),
    )}
    <B p={[0, 2.2, -0.12]} s={[1.05, 0.06, 1.25]} c="#2a2f37" />
    {/* mast + forks */}
    {[-0.32, 0.32].map((x) => (
      <B key={x} p={[x, 1.25, 0.82]} s={[0.08, 2.5, 0.1]} c="#3a3f47" m={0.4} />
    ))}
    {[-0.25, 0.25].map((x) => (
      <B key={x} p={[x, forkH, 1.35]} s={[0.1, 0.05, 1.0]} c="#5a6068" m={0.6} />
    ))}
    {carry && (
      <group position={[0, forkH + 0.03, 1.35]}>
        <B p={[0, 0.06, 0]} s={[1.0, 0.12, 0.9]} c="#9b7a4f" />
        <B p={[0, 0.42, 0]} s={[0.8, 0.6, 0.7]} c="#2f6fd6" r={0.6} />
        <B p={[0, 0.43, 0.351]} s={[0.4, 0.18, 0.005]} c="#ffffff" />
      </group>
    )}
    {/* wheels */}
    {[-0.5, 0.5].map((x) =>
      [-0.7, 0.55].map((z) => (
        <mesh key={`${x}${z}`} position={[x, 0.25, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 18]} />
          <meshStandardMaterial color="#15171b" roughness={0.9} />
        </mesh>
      )),
    )}
    {/* beacon */}
    <Cyl p={[0, 2.3, -0.5]} r={0.06} h={0.1} c="#ffb238" e="#ffb238" ei={1.5} />
  </group>
);

// ------------------------------------------------------------ PPC planning corner

export const PPC_AT: V3 = [-37.4, 0, -6.2];

const drawSchedule = (replanned: boolean) => (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#0b1a2e';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${Math.round(h * 0.07)}px ${FONT}`;
  ctx.fillText('JADUAL PENGELUARAN', 34, h * 0.1);
  ctx.fillStyle = '#9fc4ff';
  ctx.font = `600 ${Math.round(h * 0.045)}px ${MONO}`;
  ctx.fillText('PPC · PRODUCTION PLANNING & CONTROL', 34, h * 0.16);
  const rows = ['Line A', 'Line B', 'Sel Robot', 'Inspection', 'Penghantaran'];
  const x0 = w * 0.2;
  const x1 = w - 34;
  for (let c = 0; c <= 8; c++) {
    ctx.strokeStyle = 'rgba(159,196,255,0.15)';
    ctx.beginPath();
    ctx.moveTo(x0 + ((x1 - x0) * c) / 8, h * 0.22);
    ctx.lineTo(x0 + ((x1 - x0) * c) / 8, h * 0.92);
    ctx.stroke();
  }
  rows.forEach((r, i) => {
    const y = h * 0.26 + i * h * 0.13;
    ctx.fillStyle = '#cfe0f2';
    ctx.font = `600 ${Math.round(h * 0.045)}px ${FONT}`;
    ctx.fillText(r, 34, y + h * 0.06);
    const start = 0.05 + rnd(i * 3) * 0.2;
    const len = 0.45 + rnd(i * 7) * 0.3;
    const shift = replanned && i >= 2 ? 0.12 : 0;
    ctx.fillStyle = i === 2 && replanned ? '#ffb238' : '#2f8cff';
    ctx.fillRect(x0 + (x1 - x0) * (start + shift), y + h * 0.015, (x1 - x0) * len * 0.9, h * 0.07);
  });
  if (replanned) {
    ctx.fillStyle = '#ffb238';
    ctx.font = `800 ${Math.round(h * 0.055)}px ${FONT}`;
    ctx.fillText('JADUAL DISELARASKAN', w * 0.55, h * 0.1);
  }
};

export const PPCCorner: React.FC<{replanned: boolean}> = ({replanned}) => (
  <group position={PPC_AT}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.6, 0.007, 0]}>
      <planeGeometry args={[4.6, 5]} />
      <meshStandardMaterial color="#8a8f96" roughness={0.6} />
    </mesh>
    {/* desk + monitors */}
    <B p={[0.9, 0.74, 0]} s={[0.8, 0.05, 1.8]} c="#d6d9dd" />
    <B p={[0.9, 0.37, 0]} s={[0.06, 0.74, 1.6]} c="#3a3f47" />
    {[-0.45, 0.45].map((z) => (
      <B key={z} p={[0.7, 1.08, z]} s={[0.04, 0.4, 0.62]} c="#14171c" e="#1d6fe0" ei={0.35} />
    ))}
    {/* wall screen (hall wall at x = -40) */}
    <group position={[-2.38, 2.25, 0]} rotation={[0, Math.PI / 2, 0]}>
      <B p={[0, 0, -0.04]} s={[3.8, 2.2, 0.06]} c="#111" />
      <TexPlane id={`ppc-screen-${replanned ? 1 : 0}`} w={3.6} h={2.0} px={300} emissive={0.85} draw={drawSchedule(replanned)} />
    </group>
    <pointLight position={[0, 2.6, 0]} intensity={8} distance={7} color="#ffe9cc" />
  </group>
);

// ------------------------------------------------------------ safety signboard + entrance

export const SafetyBoard: React.FC<{p: V3; rotY?: number}> = ({p, rotY = 0}) => (
  <group position={p} rotation={[0, rotY, 0]}>
    {[-0.75, 0.75].map((x) => (
      <B key={x} p={[x, 0.9, 0]} s={[0.06, 1.8, 0.06]} c="#3a3f47" />
    ))}
    <group position={[0, 1.55, 0.04]}>
      <TexPlane
        id="safety-board"
        w={1.7}
        h={1.0}
        px={500}
        emissive={0.25}
        draw={(ctx, w, h) => {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
          ctx.fillStyle = '#2e9e5a';
          ctx.fillRect(0, 0, w, h * 0.28);
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.font = `800 ${Math.round(h * 0.13)}px ${FONT}`;
          ctx.fillText('UTAMAKAN KESELAMATAN', w / 2, h * 0.19);
          // PPE pictograms: helmet, glasses, gloves, boots
          const labels = ['HELMET', 'CERMIN MATA', 'SARUNG TANGAN', 'KASUT'];
          labels.forEach((lab, i) => {
            const cx = w * (0.14 + i * 0.24);
            const cy = h * 0.55;
            ctx.fillStyle = '#1f5fbf';
            ctx.beginPath();
            ctx.arc(cx, cy, h * 0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 8;
            const s = h * 0.07;
            ctx.beginPath();
            if (i === 0) {
              ctx.arc(cx, cy + s * 0.4, s, Math.PI, 0);
              ctx.fill();
              ctx.fillRect(cx - s * 1.3, cy + s * 0.3, s * 2.6, s * 0.3);
            } else if (i === 1) {
              ctx.arc(cx - s * 0.6, cy, s * 0.5, 0, Math.PI * 2);
              ctx.moveTo(cx + s * 1.1, cy);
              ctx.arc(cx + s * 0.6, cy, s * 0.5, 0, Math.PI * 2);
              ctx.stroke();
            } else if (i === 2) {
              ctx.fillRect(cx - s * 0.6, cy - s * 0.4, s * 1.2, s * 1.3);
              for (let k = 0; k < 4; k++) ctx.fillRect(cx - s * 0.6 + k * s * 0.32, cy - s * 1.1, s * 0.24, s * 0.8);
            } else {
              ctx.fillRect(cx - s * 0.5, cy - s, s * 0.8, s * 1.5);
              ctx.fillRect(cx - s * 0.5, cy + s * 0.3, s * 1.5, s * 0.5);
            }
            ctx.fillStyle = '#1f3a5f';
            ctx.font = `700 ${Math.round(h * 0.055)}px ${FONT}`;
            ctx.fillText(lab, cx, h * 0.84);
          });
          ctx.fillStyle = '#d93636';
          ctx.font = `800 ${Math.round(h * 0.065)}px ${FONT}`;
          ctx.fillText('PPE WAJIB DI KAWASAN INI', w / 2, h * 0.96);
        }}
      />
    </group>
  </group>
);

/** Main entrance on the front facade (exterior shots). */
export const Entrance: React.FC = () => (
  <group position={[-30, 0, 15.5]}>
    <B p={[0, 1.4, 0.06]} s={[3.2, 2.8, 0.1]} c="#9fc4e8" o={0.5} r={0.05} />
    <B p={[0, 1.4, 0.1]} s={[0.06, 2.8, 0.06]} c="#3a3f47" />
    <B p={[0, 3.1, 1.0]} s={[4.2, 0.18, 2.2]} c="#1f3a5f" />
    {[-1.9, 1.9].map((x) => (
      <B key={x} p={[x, 1.5, 1.9]} s={[0.12, 3.0, 0.12]} c="#5a6068" />
    ))}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 3.5]}>
      <planeGeometry args={[2.2, 7]} />
      <meshStandardMaterial color="#8a8f96" roughness={0.7} />
    </mesh>
  </group>
);
