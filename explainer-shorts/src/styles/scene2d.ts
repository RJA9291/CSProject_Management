// One 2D description of the Si Tanggang beat (mother rows to the ship, Tanggang denies her),
// as plain shapes with semantic roles. Each style renders the same shapes its own way.
export type Pt = [number, number];
export type Role =
  | 'sky'
  | 'sun'
  | 'hill'
  | 'sea'
  | 'wave'
  | 'hull'
  | 'deck'
  | 'mast'
  | 'sail'
  | 'flag'
  | 'boat'
  | 'paddle'
  | 'skin'
  | 'hair'
  | 'gold'
  | 'tanggang'
  | 'wife'
  | 'mother'
  | 'eye'
  | 'mouth'
  | 'tear'
  | 'bubble';

export type Prim =
  | {t: 'rect'; role: Role; x: number; y: number; w: number; h: number; id: string}
  | {t: 'circle'; role: Role; cx: number; cy: number; r: number; id: string}
  | {t: 'poly'; role: Role; pts: Pt[]; id: string}
  | {t: 'line'; role: Role; pts: Pt[]; w: number; id: string};

export type Beat = {prims: Prim[]; bubble: {x: number; y: number; w: number; h: number; tail: Pt; text: string} | null; hands: Pt[]; focus: {mother: Pt; tanggang: Pt}};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (v: number) => (v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2);

type FigOpts = {id: string; x: number; feet: number; h: number; cloth: Role; woman: boolean; crown?: boolean; pose: 'idle' | 'point' | 'row' | 'sad'; sad?: boolean; t: number};

// Simple human figure: dress or torso+legs, arms, head, hair, eyes, mouth, optional headdress.
const figure = (o: FigOpts): {prims: Prim[]; hands: Pt[]; face: Pt} => {
  const {x, feet, h} = o;
  const r = h * 0.17;
  const headY = feet - h + r;
  const neck = headY + r;
  const shoulder: Pt = [x, neck + h * 0.06];
  const prims: Prim[] = [];
  if (o.woman) {
    prims.push({t: 'poly', role: o.cloth, id: `${o.id}-dress`, pts: [[x - h * 0.13, neck], [x + h * 0.13, neck], [x + h * 0.27, feet], [x - h * 0.27, feet]]});
  } else {
    prims.push({t: 'rect', role: 'hair', id: `${o.id}-legL`, x: x - h * 0.12, y: feet - h * 0.34, w: h * 0.09, h: h * 0.34});
    prims.push({t: 'rect', role: 'hair', id: `${o.id}-legR`, x: x + h * 0.03, y: feet - h * 0.34, w: h * 0.09, h: h * 0.34});
    prims.push({t: 'poly', role: o.cloth, id: `${o.id}-torso`, pts: [[x - h * 0.15, neck], [x + h * 0.15, neck], [x + h * 0.18, feet - h * 0.3], [x - h * 0.18, feet - h * 0.3]]});
  }
  // Arms.
  const sway = Math.sin(o.t * 6) * h * 0.04;
  let handL: Pt = [x - h * 0.2, neck + h * 0.33];
  let handR: Pt = [x + h * 0.2, neck + h * 0.33];
  if (o.pose === 'point') handL = [x - h * 0.55, neck + h * 0.02];
  if (o.pose === 'row') {
    handL = [x + h * 0.28, neck + h * 0.22 + sway];
    handR = [x + h * 0.36, neck + h * 0.28 + sway];
  }
  if (o.pose === 'sad') {
    handL = [x - h * 0.05, headY + r * 0.6];
    handR = [x + h * 0.05, headY + r * 0.6];
  }
  prims.push({t: 'line', role: o.cloth, id: `${o.id}-armL`, pts: [[x - h * 0.1, shoulder[1]], handL], w: h * 0.07});
  prims.push({t: 'line', role: o.cloth, id: `${o.id}-armR`, pts: [[x + h * 0.1, shoulder[1]], handR], w: h * 0.07});
  prims.push({t: 'circle', role: 'skin', id: `${o.id}-handL`, cx: handL[0], cy: handL[1], r: h * 0.04});
  prims.push({t: 'circle', role: 'skin', id: `${o.id}-handR`, cx: handR[0], cy: handR[1], r: h * 0.04});
  // Head.
  prims.push({t: 'circle', role: 'skin', id: `${o.id}-head`, cx: x, cy: headY, r});
  const hairPts: Pt[] = [];
  for (let a = 0; a <= 12; a++) {
    const ang = Math.PI + (a / 12) * Math.PI;
    hairPts.push([x + Math.cos(ang) * r * 1.05, headY + Math.sin(ang) * r * 1.05]);
  }
  if (o.woman) hairPts.push([x + r * 1.1, headY + r * 0.6], [x - r * 1.1, headY + r * 0.6]);
  prims.push({t: 'poly', role: 'hair', id: `${o.id}-hair`, pts: hairPts});
  if (o.crown) prims.push({t: 'poly', role: 'gold', id: `${o.id}-crown`, pts: [[x - r * 0.95, headY - r * 0.55], [x + r * 0.95, headY - r * 0.55], [x + r * 0.7, headY - r * 1.25], [x - r * 0.7, headY - r * 1.25]]});
  // Face.
  prims.push({t: 'circle', role: 'eye', id: `${o.id}-eyeL`, cx: x - r * 0.38, cy: headY + r * 0.05, r: r * 0.12});
  prims.push({t: 'circle', role: 'eye', id: `${o.id}-eyeR`, cx: x + r * 0.38, cy: headY + r * 0.05, r: r * 0.12});
  const my = headY + r * 0.5;
  prims.push({t: 'line', role: 'mouth', id: `${o.id}-mouth`, pts: o.sad ? [[x - r * 0.25, my + r * 0.08], [x, my - r * 0.04], [x + r * 0.25, my + r * 0.08]] : [[x - r * 0.25, my - r * 0.04], [x, my + r * 0.08], [x + r * 0.25, my - r * 0.04]], w: r * 0.09});
  return {prims, hands: [handL, handR], face: [x, headY]};
};

// p = 0..1 progress through the beat; t = seconds (for small loops).
export const beat = (p: number, t: number): Beat => {
  const prims: Prim[] = [];
  prims.push({t: 'rect', role: 'sky', id: 'sky', x: 0, y: 0, w: 1080, h: 1920});
  prims.push({t: 'circle', role: 'sun', id: 'sun', cx: 820, cy: 600, r: 90});
  prims.push({t: 'poly', role: 'hill', id: 'hill', pts: [[0, 1090], [140, 980], [300, 1040], [460, 960], [620, 1050], [0, 1060]]});
  // Sea with a gently moving wave top.
  const sea: Pt[] = [];
  for (let x = 0; x <= 1080; x += 60) sea.push([x, 1090 + Math.sin(x * 0.02 + t * 2) * 10]);
  sea.push([1080, 1920], [0, 1920]);
  prims.push({t: 'poly', role: 'sea', id: 'sea', pts: sea});
  for (let k = 0; k < 4; k++) {
    const y = 1260 + k * 110;
    const off = ((t * 40 + k * 90) % 200) - 100;
    prims.push({t: 'line', role: 'wave', id: `wave${k}`, pts: [[80 + off, y], [200 + off, y - 12], [320 + off, y]], w: 8});
  }
  // Ship (right).
  const bob = Math.sin(t * 1.6) * 6;
  prims.push({t: 'rect', role: 'mast', id: 'mast1', x: 700, y: 720 + bob, w: 16, h: 340});
  prims.push({t: 'rect', role: 'mast', id: 'mast2', x: 910, y: 760 + bob, w: 16, h: 300});
  prims.push({t: 'poly', role: 'sail', id: 'sail1', pts: [[716, 740 + bob], [860, 770 + bob], [860, 980 + bob], [716, 1000 + bob]]});
  prims.push({t: 'poly', role: 'sail', id: 'sail2', pts: [[926, 780 + bob], [1040, 800 + bob], [1040, 990 + bob], [926, 1010 + bob]]});
  prims.push({t: 'poly', role: 'flag', id: 'flag', pts: [[716, 720 + bob], [780, 732 + bob], [716, 746 + bob]]});
  const tg = figure({id: 'tg', x: 760, feet: 1062 + bob, h: 220, cloth: 'tanggang', woman: false, crown: true, pose: p > 0.48 ? 'point' : 'idle', t});
  const wf = figure({id: 'wf', x: 890, feet: 1062 + bob, h: 200, cloth: 'wife', woman: true, crown: true, pose: 'idle', t});
  prims.push(...tg.prims, ...wf.prims);
  prims.push({t: 'poly', role: 'hull', id: 'hull', pts: [[500, 1060 + bob], [1070, 1060 + bob], [1010, 1190 + bob], [570, 1190 + bob]]});
  prims.push({t: 'rect', role: 'gold', id: 'hullTrim', x: 520, y: 1080 + bob, w: 530, h: 14});
  // Sampan with the mother rowing in from the left.
  const sx = 40 + ease(clamp01(p / 0.45)) * 300;
  const sb = Math.sin(t * 2.2) * 5;
  const sad = p > 0.62;
  const mo = figure({id: 'mo', x: sx + 120, feet: 1205 + sb, h: 190, cloth: 'mother', woman: true, pose: sad ? 'sad' : 'row', sad, t});
  prims.push(...mo.prims);
  prims.push({t: 'line', role: 'paddle', id: 'paddle', pts: [[sx + 170, 1110 + sb], [sx + 250, 1290 + sb]], w: 10});
  prims.push({t: 'poly', role: 'boat', id: 'boat', pts: [[sx, 1200 + sb], [sx + 280, 1200 + sb], [sx + 240, 1250 + sb], [sx + 40, 1250 + sb]]});
  if (sad) {
    for (let k = 0; k < 2; k++) {
      const q = ((t * 1.5 + k * 0.5) % 1);
      prims.push({t: 'circle', role: 'tear', id: `tear${k}`, cx: mo.face[0] + (k ? 14 : -14), cy: mo.face[1] + 10 + q * 50, r: 6});
    }
  }
  const bubble = p > 0.5 ? {x: 380, y: 560, w: 520, h: 120, tail: [700, 720] as Pt, text: 'BUKAN IBU AKU!'} : null;
  return {prims, bubble, hands: [...tg.hands, ...mo.hands], focus: {mother: mo.face, tanggang: tg.face}};
};

// --- Rasteriser for the pixel-art style ---
const inPoly = (x: number, y: number, pts: Pt[]) => {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const [xi, yi] = pts[i];
    const [xj, yj] = pts[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
};
const segDist = (x: number, y: number, a: Pt, b: Pt) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const l = dx * dx + dy * dy || 1;
  const k = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / l));
  return Math.hypot(x - (a[0] + k * dx), y - (a[1] + k * dy));
};
export const hit = (pr: Prim, x: number, y: number): boolean => {
  if (pr.t === 'rect') return x >= pr.x && x <= pr.x + pr.w && y >= pr.y && y <= pr.y + pr.h;
  if (pr.t === 'circle') return (x - pr.cx) ** 2 + (y - pr.cy) ** 2 <= pr.r * pr.r;
  if (pr.t === 'poly') return inPoly(x, y, pr.pts);
  for (let i = 1; i < pr.pts.length; i++) if (segDist(x, y, pr.pts[i - 1], pr.pts[i]) <= Math.max(pr.w / 2, 5)) return true;
  return false;
};

// Rasterises the shapes to a cols x rows grid of roles (topmost shape wins).
export const rasterise = (prims: Prim[], cols: number, rows: number): (Role | null)[][] => {
  const cw = 1080 / cols;
  const ch = 1920 / rows;
  const out: (Role | null)[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: (Role | null)[] = [];
    const y = (r + 0.5) * ch;
    for (let c = 0; c < cols; c++) {
      const x = (c + 0.5) * cw;
      let role: Role | null = null;
      for (let i = prims.length - 1; i >= 0; i--) {
        if (hit(prims[i], x, y)) {
          role = prims[i].role;
          break;
        }
      }
      row.push(role);
    }
    out.push(row);
  }
  return out;
};
