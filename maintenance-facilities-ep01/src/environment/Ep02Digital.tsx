// Episode 02 digital graphics: plant organisation chart and the breakdown collaboration ring.
// Reporting lines are intentionally NOT drawn: only the confirmed structure is shown
// (leadership tier, six main operating departments inside the plant, two supporting functions).
import React from 'react';
import {FONT, MONO, TexPlane} from '../lib/text';

type V3 = [number, number, number];

export const DEPTS = [
  {key: 'production', name: 'Production', ms: 'Pemasangan & pengeluaran', color: '#3d9b5a'},
  {key: 'quality', name: 'Quality', ms: 'Pemeriksaan & pengesahan', color: '#2f6fd6'},
  {key: 'logistics', name: 'Logistics', ms: 'Bahan, alat ganti & produk', color: '#ff7a1a'},
  {key: 'ppc', name: 'PPC', ms: 'Production Planning & Control', color: '#b0476a'},
  {key: 'engineering', name: 'Engineering', ms: 'Proses & penambahbaikan', color: '#7fd6ff'},
  {key: 'mf', name: 'Maintenance & Facilities', ms: 'Mesin, peralatan & kemudahan', color: '#e8771e'},
];
export const SUPPORT = [
  {key: 'safety', name: 'Safety', ms: 'Keselamatan pekerjaan', color: '#d93636'},
  {key: 'qms', name: 'QMS', ms: 'Sistem pengurusan kualiti', color: '#2a9ab0'},
];

const glyph = (ctx: CanvasRenderingContext2D, key: string, cx: number, cy: number, s: number) => {
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = s * 0.14;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  switch (key) {
    case 'production': // gear
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ctx.moveTo(cx + Math.cos(a) * s * 0.6, cy + Math.sin(a) * s * 0.6);
        ctx.lineTo(cx + Math.cos(a) * s * 0.95, cy + Math.sin(a) * s * 0.95);
      }
      ctx.moveTo(cx + s * 0.6, cy);
      ctx.arc(cx, cy, s * 0.6, 0, Math.PI * 2);
      ctx.moveTo(cx + s * 0.22, cy);
      ctx.arc(cx, cy, s * 0.22, 0, Math.PI * 2);
      break;
    case 'quality': // magnifier + check
      ctx.arc(cx - s * 0.15, cy - s * 0.15, s * 0.55, 0, Math.PI * 2);
      ctx.moveTo(cx + s * 0.25, cy + s * 0.25);
      ctx.lineTo(cx + s * 0.85, cy + s * 0.85);
      ctx.moveTo(cx - s * 0.45, cy - s * 0.15);
      ctx.lineTo(cx - s * 0.2, cy + s * 0.1);
      ctx.lineTo(cx + s * 0.15, cy - s * 0.4);
      break;
    case 'logistics': // truck
      ctx.rect(cx - s * 0.95, cy - s * 0.45, s * 1.15, s * 0.8);
      ctx.moveTo(cx + s * 0.2, cy - s * 0.15);
      ctx.lineTo(cx + s * 0.65, cy - s * 0.15);
      ctx.lineTo(cx + s * 0.9, cy + s * 0.1);
      ctx.lineTo(cx + s * 0.9, cy + s * 0.35);
      ctx.lineTo(cx + s * 0.2, cy + s * 0.35);
      ctx.moveTo(cx - s * 0.45, cy + s * 0.6);
      ctx.arc(cx - s * 0.55, cy + s * 0.6, s * 0.12, 0, Math.PI * 2);
      ctx.moveTo(cx + s * 0.65, cy + s * 0.6);
      ctx.arc(cx + s * 0.55, cy + s * 0.6, s * 0.12, 0, Math.PI * 2);
      break;
    case 'ppc': // calendar / schedule
      ctx.rect(cx - s * 0.8, cy - s * 0.65, s * 1.6, s * 1.35);
      ctx.moveTo(cx - s * 0.8, cy - s * 0.3);
      ctx.lineTo(cx + s * 0.8, cy - s * 0.3);
      ctx.moveTo(cx - s * 0.5, cy + s * 0.05);
      ctx.lineTo(cx + s * 0.1, cy + s * 0.05);
      ctx.moveTo(cx - s * 0.2, cy + s * 0.38);
      ctx.lineTo(cx + s * 0.5, cy + s * 0.38);
      break;
    case 'engineering': // drafting compass
      ctx.moveTo(cx, cy - s * 0.85);
      ctx.lineTo(cx - s * 0.6, cy + s * 0.85);
      ctx.moveTo(cx, cy - s * 0.85);
      ctx.lineTo(cx + s * 0.6, cy + s * 0.85);
      ctx.moveTo(cx - s * 0.4, cy + s * 0.3);
      ctx.quadraticCurveTo(cx, cy + s * 0.55, cx + s * 0.4, cy + s * 0.3);
      break;
    case 'mf': // wrench
      ctx.moveTo(cx - s * 0.65, cy + s * 0.65);
      ctx.lineTo(cx + s * 0.2, cy - s * 0.2);
      ctx.moveTo(cx + s * 0.75, cy - s * 0.25);
      ctx.arc(cx + s * 0.4, cy - s * 0.4, s * 0.38, 0.3, Math.PI * 1.7);
      break;
    case 'safety': // hard hat
      ctx.arc(cx, cy + s * 0.2, s * 0.65, Math.PI, 0);
      ctx.moveTo(cx - s * 0.95, cy + s * 0.25);
      ctx.lineTo(cx + s * 0.95, cy + s * 0.25);
      ctx.moveTo(cx, cy - s * 0.45);
      ctx.lineTo(cx, cy - s * 0.1);
      break;
    case 'qms': // document + check
      ctx.rect(cx - s * 0.6, cy - s * 0.8, s * 1.2, s * 1.6);
      ctx.moveTo(cx - s * 0.35, cy - s * 0.4);
      ctx.lineTo(cx + s * 0.35, cy - s * 0.4);
      ctx.moveTo(cx - s * 0.35, cy - s * 0.1);
      ctx.lineTo(cx + s * 0.35, cy - s * 0.1);
      ctx.moveTo(cx - s * 0.3, cy + s * 0.3);
      ctx.lineTo(cx - s * 0.05, cy + s * 0.55);
      ctx.lineTo(cx + s * 0.4, cy + s * 0.15);
      break;
  }
  ctx.stroke();
};

const drawCard = (name: string, ms: string, color: string, key: string | null) => (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, '#10284a');
  g.addColorStop(1, '#0a1a31');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, w, h * 0.06);
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, w - 6, h - 6);
  const iconH = key ? h * 0.42 : 0;
  if (key) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.3, h * 0.16, 0, Math.PI * 2);
    ctx.fill();
    glyph(ctx, key, w / 2, h * 0.3, h * 0.1);
  }
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  let size = Math.round(h * (key ? 0.13 : 0.24));
  ctx.font = `800 ${size}px ${FONT}`;
  while (ctx.measureText(name).width > w * 0.9 && size > 10) {
    size -= 2;
    ctx.font = `800 ${size}px ${FONT}`;
  }
  ctx.fillText(name, w / 2, key ? h * 0.6 + iconH * 0.08 : h * 0.5);
  ctx.fillStyle = '#a9c4e4';
  let s2 = Math.round(h * (key ? 0.075 : 0.12));
  ctx.font = `600 ${s2}px ${FONT}`;
  while (ctx.measureText(ms).width > w * 0.9 && s2 > 8) {
    s2 -= 1;
    ctx.font = `600 ${s2}px ${FONT}`;
  }
  ctx.fillText(ms, w / 2, key ? h * 0.78 : h * 0.78);
};

export const Card: React.FC<{id: string; name: string; ms: string; color: string; icon: string | null; pos: V3; w: number; h: number; p: number; glow?: number}> = ({id, name, ms, color, icon, pos, w, h, p, glow = 0}) => {
  if (p <= 0.001) return null;
  return (
    <group position={[pos[0], pos[1] - (1 - p) * 0.4, pos[2]]} scale={[1, p, 1]}>
      <TexPlane id={`card-${id}`} w={w} h={h} px={360} emissive={0.6 + glow * 0.5} draw={drawCard(name, ms, color, icon)} />
      <mesh position={[0, 0, -0.03]}>
        <planeGeometry args={[w + 0.1, h + 0.1]} />
        <meshBasicMaterial color={color} transparent opacity={0.2 + glow * 0.5} toneMapped={false} />
      </mesh>
    </group>
  );
};

/** Thin glowing frame (rectangle) drawn progressively with p. */
export const Frame: React.FC<{x0: number; x1: number; y0: number; y1: number; z?: number; p: number; color?: string; dashed?: boolean}> = ({x0, x1, y0, y1, z = -0.05, p, color = '#3d8cff', dashed}) => {
  if (p <= 0) return null;
  const segs: [V3, V3][] = [
    [[x0, y1, z], [x1, y1, z]],
    [[x1, y1, z], [x1, y0, z]],
    [[x1, y0, z], [x0, y0, z]],
    [[x0, y0, z], [x0, y1, z]],
  ];
  const lens = segs.map(([a, b]) => Math.hypot(b[0] - a[0], b[1] - a[1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let budget = p * total;
  return (
    <group>
      {segs.map(([a, b], i) => {
        const L = Math.min(lens[i], Math.max(0, budget));
        budget -= lens[i];
        if (L <= 0) return null;
        const t = L / lens[i];
        const e: V3 = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, z];
        const horiz = Math.abs(b[1] - a[1]) < 1e-6;
        const mid: V3 = [(a[0] + e[0]) / 2, (a[1] + e[1]) / 2, z];
        const n = dashed ? Math.max(1, Math.floor(L / 0.25)) : 1;
        return Array.from({length: n}, (_, k) => {
          const seg = L / n;
          const len = dashed ? seg * 0.55 : L;
          const c: V3 = dashed
            ? [a[0] + ((b[0] - a[0]) / lens[i]) * (seg * k + seg * 0.3), a[1] + ((b[1] - a[1]) / lens[i]) * (seg * k + seg * 0.3), z]
            : mid;
          return (
            <mesh key={`${i}-${k}`} position={c}>
              <boxGeometry args={horiz ? [len, 0.035, 0.02] : [0.035, len, 0.02]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
          );
        });
      })}
    </group>
  );
};

/** Text label floating in the digital space. */
export const FloatLabel: React.FC<{id: string; text: string; pos: V3; w: number; h: number; p: number; color?: string; align?: 'left' | 'center'}> = ({id, text, pos, w, h, p, color = '#9fc4ff', align = 'left'}) => {
  if (p <= 0.001) return null;
  return (
    <group position={pos}>
      <TexPlane
        id={`fl-${id}`}
        w={w}
        h={h}
        px={420}
        emissive={1}
        alpha
        opacity={p}
        draw={(ctx, cw, ch) => {
          ctx.clearRect(0, 0, cw, ch);
          ctx.fillStyle = color;
          ctx.font = `700 ${Math.round(ch * 0.62)}px ${MONO}`;
          ctx.textAlign = align;
          ctx.textBaseline = 'middle';
          ctx.fillText(text, align === 'left' ? 4 : cw / 2, ch / 2);
        }}
      />
    </group>
  );
};

// ------------------------------------------------------------ collaboration ring

export const RING = [
  {key: 'production', name: 'Production', ms: 'Laporkan kerosakan', color: '#3d9b5a'},
  {key: 'safety', name: 'Safety', ms: 'Pengasingan selamat', color: '#d93636'},
  {key: 'mf', name: 'Maintenance & Facilities', ms: 'Troubleshooting & pembaikan', color: '#e8771e'},
  {key: 'engineering', name: 'Engineering', ms: 'Analisis teknikal', color: '#7fd6ff'},
  {key: 'quality', name: 'Quality', ms: 'Periksa produk terjejas', color: '#2f6fd6'},
  {key: 'ppc', name: 'PPC', ms: 'Selaraskan jadual', color: '#b0476a'},
  {key: 'logistics', name: 'Logistics', ms: 'Alat ganti & bahan', color: '#ff7a1a'},
  {key: 'qms', name: 'QMS', ms: 'Rekod & tindakan pembetulan', color: '#2a9ab0'},
];

export const CollabRing: React.FC<{at: number[]; f: number; restored: number}> = ({at, f, restored}) => {
  const R = 3.3;
  const pop = (a: number) => Math.max(0, Math.min(1, (f - a) / 14));
  return (
    <group position={[0, 3.4, 0]}>
      {/* centre */}
      <Card
        id={`ring-centre-${restored > 0.5 ? 'ok' : 'down'}`}
        name={restored > 0.5 ? 'OPERASI DIPULIHKAN' : 'MESIN ROSAK'}
        ms={restored > 0.5 ? 'Line kembali beroperasi' : 'Robot sel berhenti'}
        color={restored > 0.5 ? '#3ddc84' : '#ff3b3b'}
        icon={null}
        pos={[0, 0, 0]}
        w={2.4}
        h={0.9}
        p={1}
        glow={0.6}
      />
      {RING.map((d, i) => {
        const a = -Math.PI / 2 + (i / RING.length) * Math.PI * 2;
        const x = Math.cos(a) * R * 1.45;
        const y = -Math.sin(a) * R * 0.78;
        const p = pop(at[i]);
        const link = Math.max(0, Math.min(1, (f - at[i] + 10) / 12));
        return (
          <group key={d.key}>
            {link > 0 && (
              <mesh position={[(x * link) / 2, (y * link) / 2, -0.06]} rotation={[0, 0, Math.atan2(y, x)]}>
                <boxGeometry args={[Math.hypot(x, y) * link, 0.03, 0.02]} />
                <meshBasicMaterial color={d.color} toneMapped={false} />
              </mesh>
            )}
            <Card id={`ring-${d.key}`} name={d.name} ms={d.ms} color={d.color} icon={d.key} pos={[x, y, 0]} w={2.1} h={1.3} p={p} glow={p > 0.99 && f - at[i] < 40 ? 1 : 0} />
          </group>
        );
      })}
    </group>
  );
};
