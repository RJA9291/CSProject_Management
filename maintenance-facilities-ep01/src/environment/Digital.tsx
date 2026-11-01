// Digital spaces: glowing grid world, org-chart platforms, admin-system panels,
// documents and compliance icons. All text is drawn with the project fonts.
import React from 'react';
import {FONT, MONO, TexPlane} from '../lib/text';

type V3 = [number, number, number];
const BLUE = '#2f8cff';
const CYAN = '#7fd6ff';
const ORANGE = '#e8771e';
const rnd = (s: number) => {
  const x = Math.sin(s * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

/** Dark space with a glowing floor grid and floating particles. */
export const DigitalWorld: React.FC<{t: number}> = ({t}) => (
  <group>
    <color attach="background" args={['#06101f']} />
    <fog attach="fog" args={['#06101f', 12, 45]} />
    <gridHelper args={[120, 120, '#1f5fb8', '#123a6e']} position={[0, 0, 0]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[200, 200]} />
      <meshStandardMaterial color="#071528" roughness={0.4} metalness={0.3} />
    </mesh>
    {Array.from({length: 120}, (_, i) => {
      const y = ((rnd(i * 3) * 12 + t * (0.15 + rnd(i) * 0.3)) % 12) + 0.2;
      return (
        <mesh key={i} position={[(rnd(i * 7) - 0.5) * 40, y, (rnd(i * 11) - 0.5) * 30 - 4]}>
          <sphereGeometry args={[0.02 + rnd(i * 5) * 0.03, 6, 4]} />
          <meshBasicMaterial color={i % 4 ? CYAN : ORANGE} transparent opacity={0.6} />
        </mesh>
      );
    })}
    <hemisphereLight args={['#9cc8ff', '#0a1424', 0.9]} />
    <directionalLight position={[4, 10, 8]} intensity={1.8} color="#ffe2bf" />
    <pointLight position={[0, 6, 6]} intensity={30} distance={30} color="#4f9dff" />
  </group>
);

/** Circular glowing platform. `p` 0..1 build-in. */
export const Platform: React.FC<{pos: V3; r?: number; p: number; color?: string}> = ({pos, r = 0.9, p, color = BLUE}) => (
  <group position={pos} scale={[p, 1, p]}>
    <mesh position={[0, -0.06, 0]} receiveShadow>
      <cylinderGeometry args={[r, r * 1.05, 0.12, 48]} />
      <meshStandardMaterial color="#0f2340" metalness={0.5} roughness={0.35} />
    </mesh>
    <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[r * 0.93, r, 64]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
    <mesh position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[r * 1.02, r * 1.12, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} toneMapped={false} />
    </mesh>
  </group>
);

/** Glowing connector between two points (builds from a to b with p). */
export const Beam: React.FC<{a: V3; b: V3; p: number; color?: string}> = ({a, b, p, color = CYAN}) => {
  if (p <= 0) return null;
  const end: V3 = [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p];
  const mid: V3 = [(a[0] + end[0]) / 2, (a[1] + end[1]) / 2, (a[2] + end[2]) / 2];
  const len = Math.hypot(end[0] - a[0], end[1] - a[1], end[2] - a[2]);
  const yaw = Math.atan2(end[0] - a[0], end[2] - a[2]);
  const pitch = Math.acos((end[1] - a[1]) / (len || 1));
  return (
    <mesh position={mid} rotation={[pitch, yaw, 0, 'YXZ']}>
      <cylinderGeometry args={[0.018, 0.018, len, 8]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};

// ------------------------------------------------------------ admin-system panels

export const MODULES = [
  {key: 'wo', title: 'Work Order Management', ms: 'Pengurusan arahan kerja'},
  {key: 'dmr', title: 'Daily Maintenance Report', ms: 'Laporan penyelenggaraan harian'},
  {key: 'pm', title: 'Preventive Maintenance Schedule', ms: 'Jadual penyelenggaraan pencegahan'},
  {key: 'inv', title: 'Spare Parts & Inventory', ms: 'Alat ganti & inventori'},
  {key: 'con', title: 'Contractor Coordination', ms: 'Koordinasi kontraktor'},
  {key: 'kpi', title: 'KPI Monitoring', ms: 'Pemantauan prestasi'},
];

const drawModule = (key: string, title: string, ms: string) => (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#0e2a52');
  g.addColorStop(1, '#081a33');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = '#3d8cff';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, w - 6, h - 6);
  ctx.fillStyle = ORANGE;
  ctx.fillRect(0, 0, w, 10);
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${Math.round(h * 0.085)}px ${FONT}`;
  ctx.fillText(title, 34, h * 0.15);
  ctx.fillStyle = '#9fc4ff';
  ctx.font = `600 ${Math.round(h * 0.058)}px ${FONT}`;
  ctx.fillText(ms, 34, h * 0.24);
  const x0 = 34;
  const y0 = h * 0.32;
  const W = w - 68;
  const H = h * 0.6;
  ctx.font = `700 ${Math.round(h * 0.045)}px ${MONO}`;
  if (key === 'wo') {
    const st = [
      ['WO-0001', 'Conveyor C2', 'SELESAI', '#3ddc84'],
      ['WO-0002', 'AHU-01', 'DALAM PROSES', '#ffb238'],
      ['WO-0003', 'Robot R4', 'BARU', '#7fd6ff'],
      ['WO-0004', 'Kompresor', 'SELESAI', '#3ddc84'],
    ];
    st.forEach((r, i) => {
      const y = y0 + i * (H / 4);
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(x0, y, W, H / 4 - 12);
      ctx.fillStyle = '#cfe0f2';
      ctx.fillText(r[0], x0 + 16, y + H / 8 + 6);
      ctx.fillText(r[1], x0 + W * 0.3, y + H / 8 + 6);
      ctx.fillStyle = r[3];
      ctx.fillText(r[2], x0 + W * 0.64, y + H / 8 + 6);
    });
  } else if (key === 'dmr') {
    for (let i = 0; i < 7; i++) {
      const y = y0 + i * (H / 7);
      ctx.fillStyle = '#3ddc84';
      ctx.fillRect(x0, y + 10, 26, 26);
      ctx.fillStyle = 'rgba(207,224,242,0.7)';
      ctx.fillRect(x0 + 44, y + 16, W * (0.4 + rnd(i) * 0.5), 14);
    }
  } else if (key === 'pm') {
    const cols = 7;
    const rows = 5;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const cx = x0 + c * (W / cols);
        const cy = y0 + r * (H / rows);
        ctx.strokeStyle = '#2a5a99';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx, cy, W / cols - 6, H / rows - 6);
        if (rnd(r * 9 + c * 3) > 0.6) {
          ctx.fillStyle = rnd(c + r) > 0.35 ? '#2f8cff' : ORANGE;
          ctx.fillRect(cx + 6, cy + 6, W / cols - 18, H / rows - 18);
        }
      }
  } else if (key === 'inv') {
    ['Bearing 6205', 'Tali sawat V', 'Fius 32A', 'Penapis udara', 'Gris'].forEach((n, i) => {
      const y = y0 + i * (H / 5);
      const lvl = 0.25 + rnd(i * 4) * 0.7;
      ctx.fillStyle = '#cfe0f2';
      ctx.fillText(n, x0, y + 30);
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(x0 + W * 0.45, y + 10, W * 0.5, 26);
      ctx.fillStyle = lvl < 0.35 ? ORANGE : '#3ddc84';
      ctx.fillRect(x0 + W * 0.45, y + 10, W * 0.5 * lvl, 26);
    });
  } else if (key === 'con') {
    ['Kontraktor A', 'Kontraktor B', 'Kontraktor C'].forEach((n, i) => {
      const y = y0 + i * (H / 3);
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(x0, y, W, H / 3 - 14);
      ctx.fillStyle = '#cfe0f2';
      ctx.fillText(n, x0 + 16, y + 44);
      ctx.fillStyle = ['#3ddc84', '#ffb238', '#7fd6ff'][i];
      ctx.fillText(['PERMIT LULUS', 'TAKLIMAT K3', 'DIJADUALKAN'][i], x0 + W * 0.5, y + 44);
    });
  } else if (key === 'kpi') {
    // generic gauges (no real figures; KPI definitions to be confirmed)
    [0, 1, 2].forEach((i) => {
      const cx = x0 + W * (0.17 + i * 0.33);
      const cy = y0 + H * 0.55;
      const r = W * 0.12;
      ctx.lineWidth = 18;
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
      ctx.stroke();
      ctx.strokeStyle = ['#3ddc84', '#2f8cff', ORANGE][i];
      ctx.beginPath();
      ctx.arc(cx, cy, r, Math.PI, Math.PI + Math.PI * (0.55 + rnd(i * 5) * 0.35));
      ctx.stroke();
      ctx.fillStyle = '#9fc4ff';
      ctx.fillText(`KPI ${i + 1}`, cx - r * 0.5, cy + 50);
    });
  }
};

export const ModulePanel: React.FC<{i: number; pos: V3; rotY?: number; p: number; active: number}> = ({i, pos, rotY = 0, p, active}) => {
  const m = MODULES[i];
  if (p <= 0.001) return null;
  return (
    <group position={[pos[0], pos[1] - (1 - p) * 0.6, pos[2]]} rotation={[0, rotY, 0]} scale={[1, p, 1]}>
      <TexPlane id={`mod-${m.key}`} w={2.6} h={1.6} px={420} emissive={0.55 + active * 0.6} draw={drawModule(m.key, m.title, m.ms)} />
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[2.75, 1.75]} />
        <meshBasicMaterial color={active > 0.5 ? ORANGE : BLUE} transparent opacity={0.25 + active * 0.4} toneMapped={false} />
      </mesh>
    </group>
  );
};

// ------------------------------------------------------------ documents + compliance

export const DOCS = ['Rekod Preventive Maintenance', 'Checklist Pemeriksaan', 'Laporan Pemeriksaan', 'Rekod Audit'];

const drawDoc = (title: string, n: number) => (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.fillStyle = '#f6f7f4';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#1f3a5f';
  ctx.fillRect(0, 0, w, h * 0.1);
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${Math.round(h * 0.045)}px ${FONT}`;
  ctx.fillText(title, 24, h * 0.066);
  for (let i = 0; i < 14; i++) {
    const y = h * 0.16 + i * h * 0.055;
    if (n % 2 === 1) {
      ctx.strokeStyle = '#1f3a5f';
      ctx.lineWidth = 3;
      ctx.strokeRect(24, y - 18, 22, 22);
      if (rnd(i + n * 7) > 0.25) {
        ctx.strokeStyle = '#2e9e5a';
        ctx.beginPath();
        ctx.moveTo(28, y - 7);
        ctx.lineTo(34, y);
        ctx.lineTo(44, y - 16);
        ctx.stroke();
      }
    }
    ctx.fillStyle = '#9aa6b5';
    ctx.fillRect(n % 2 ? 60 : 24, y - 10, (w - 90) * (0.5 + rnd(i * 3 + n) * 0.45), 8);
  }
  ctx.strokeStyle = '#1f3a5f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.6, h * 0.93);
  ctx.bezierCurveTo(w * 0.7, h * 0.88, w * 0.75, h * 0.97, w * 0.9, h * 0.91);
  ctx.stroke();
};

export const DocSheet: React.FC<{i: number; pos: V3; rot: V3; s?: number}> = ({i, pos, rot, s = 1}) => (
  <group position={pos} rotation={rot} scale={s}>
    <TexPlane id={`doc-${i}`} w={0.84} h={1.18} px={500} emissive={0.25} draw={drawDoc(DOCS[i % DOCS.length], i)} />
  </group>
);

export const COMPLIANCE = [
  {key: 'q', label: 'KUALITI', color: '#2f8cff'},
  {key: 'e', label: 'ALAM SEKITAR', color: '#3ddc84'},
  {key: 's', label: 'KESELAMATAN PEKERJAAN', color: '#ffb238'},
  {key: 'c', label: 'PEMATUHAN', color: '#e8771e'},
];

const drawIcon = (key: string, color: string) => (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  ctx.clearRect(0, 0, w, h);
  const cx = w / 2;
  const cy = h / 2;
  const R = w * 0.46;
  ctx.fillStyle = '#0b1d36';
  ctx.beginPath();
  ctx.arc(cx, cy, R, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = w * 0.035;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = w * 0.045;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const s = w * 0.2;
  ctx.beginPath();
  if (key === 'q') {
    // rosette + check
    ctx.arc(cx, cy - s * 0.2, s * 0.9, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.45, cy - s * 0.2);
    ctx.lineTo(cx - s * 0.1, cy + s * 0.15);
    ctx.lineTo(cx + s * 0.5, cy - s * 0.55);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - s * 0.5, cy + s * 0.6);
    ctx.lineTo(cx - s * 0.7, cy + s * 1.3);
    ctx.moveTo(cx + s * 0.5, cy + s * 0.6);
    ctx.lineTo(cx + s * 0.7, cy + s * 1.3);
  } else if (key === 'e') {
    // leaf
    ctx.moveTo(cx - s, cy + s);
    ctx.quadraticCurveTo(cx - s, cy - s, cx + s, cy - s);
    ctx.quadraticCurveTo(cx + s, cy + s, cx - s, cy + s);
    ctx.moveTo(cx - s, cy + s);
    ctx.lineTo(cx + s * 0.4, cy - s * 0.4);
  } else if (key === 's') {
    // hard hat
    ctx.arc(cx, cy + s * 0.3, s, Math.PI, 2 * Math.PI);
    ctx.moveTo(cx - s * 1.35, cy + s * 0.3);
    ctx.lineTo(cx + s * 1.35, cy + s * 0.3);
    ctx.moveTo(cx, cy - s * 0.7);
    ctx.lineTo(cx, cy - s * 0.15);
  } else {
    // shield + check
    ctx.moveTo(cx, cy - s * 1.2);
    ctx.lineTo(cx + s, cy - s * 0.75);
    ctx.lineTo(cx + s * 0.9, cy + s * 0.3);
    ctx.quadraticCurveTo(cx + s * 0.6, cy + s * 1.0, cx, cy + s * 1.25);
    ctx.quadraticCurveTo(cx - s * 0.6, cy + s * 1.0, cx - s * 0.9, cy + s * 0.3);
    ctx.lineTo(cx - s, cy - s * 0.75);
    ctx.closePath();
    ctx.moveTo(cx - s * 0.4, cy);
    ctx.lineTo(cx - s * 0.05, cy + s * 0.35);
    ctx.lineTo(cx + s * 0.45, cy - s * 0.3);
  }
  ctx.stroke();
};

export const ComplianceIcon: React.FC<{i: number; pos: V3; p: number; t: number}> = ({i, pos, p, t}) => {
  const c = COMPLIANCE[i];
  if (p <= 0.001) return null;
  return (
    <group position={[pos[0], pos[1] + Math.sin(t * 1.5 + i) * 0.05, pos[2]]} scale={p} rotation={[0, (1 - p) * 2.5, 0]}>
      <TexPlane id={`icon-${c.key}`} w={1.2} h={1.2} px={400} emissive={1} alpha draw={drawIcon(c.key, c.color)} />
      <mesh position={[0, 0, -0.04]}>
        <circleGeometry args={[0.64, 48]} />
        <meshBasicMaterial color={c.color} transparent opacity={0.35} toneMapped={false} />
      </mesh>
    </group>
  );
};
