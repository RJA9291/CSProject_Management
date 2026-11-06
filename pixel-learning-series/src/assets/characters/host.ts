// MASTER CHARACTER ASSET. Every scene draws the host only through buildHost(), so the
// face, hair, glasses, outfit and proportions are identical everywhere.
import {Grid, Sprite} from '../../components/PixelSprite/grid';

export const HOST_W = 44;
export const HOST_H = 44;

// 22 x 21 head: spiky black hair, black rectangular glasses, friendly face.
const HEAD: Sprite = [
  '......K....K...K......',
  '...K..KK..KKK..KK.K...',
  '...KKKKKKKKKKKKKKKKK..',
  '..KKKhKKKKKhhKKKKKKKK.',
  '.KKKhhKKKKhhKKKKKhhKKK',
  'KKKKKKKKKKKKKKKKKKKKKK',
  'KKKKKKKKKKKKKKKKKKKKKK',
  'KKKKSKKKKSSKKKKSKKKKKK',
  'KKKSSSKKSSSSKKSSSSKKKK',
  'KKSSSSSSSSSSSSSSSSSSKK',
  'KSSKKKKKKKKKKKKKKKKSSK',
  'KSSKwSSSSKSSKwSSSSKSSK',
  'KSSKSSSSSKSSKSSSSSKSSK',
  'KSSKSSSSSKSSKSSSSSKSSK',
  'KSSKKKKKKKSSKKKKKKKSSK',
  'KSrrSSSSSSSSSSSSSSrrSK',
  'KSSSSSSSSSSSSSSSSSSSSK',
  'KSSSSSSSSSSSSSSSSSSSSK',
  '.KSSSSSSSSSSSSSSSSSSK.',
  '..KKSSSSSSSSSSSSSSKK..',
  '....KKKKKKKKKKKKKK....',
];
const HEAD_X = 11;

// A look swaps head and outfit colours while every body, pose and animation stays shared.
export type Look = {
  id: string;
  head: Sprite;
  // Palette keys: shirt fill, optional chest print, sleeve length.
  shirt: string;
  print?: string;
  longSleeves?: boolean;
  pants: [string, string];
  shoeAccent: string;
  // Drawn over the torso (e.g. a hijab drape), positioned like the head.
  drape?: Sprite;
};

export const HOST_LOOK: Look = {id: 'host', head: HEAD, shirt: 'k', print: 'G', pants: ['J', 'j'], shoeAccent: 'R'};

export type Eyes = 'center' | 'left' | 'right' | 'closed' | 'happy';
export type Mouth = 'neutral' | 'smile' | 'open' | 'confused' | 'grin';
export type Expression = 'neutral' | 'smile' | 'confused' | 'happy';

export const EXPRESSIONS: Record<Expression, {eyes: Eyes; mouth: Mouth}> = {
  neutral: {eyes: 'center', mouth: 'smile'},
  smile: {eyes: 'center', mouth: 'grin'},
  confused: {eyes: 'center', mouth: 'confused'},
  happy: {eyes: 'happy', mouth: 'grin'},
};

const drawFace = (g: Grid, eyes: Eyes, mouth: Mouth) => {
  const X = HEAD_X;
  // Lens interiors: left cols 4..8, right cols 13..17, rows 12..13.
  for (const y of [12, 13]) for (const x of [4, 5, 6, 7, 8, 13, 14, 15, 16, 17]) g.set(X + x, y, 'S');
  const eye = (cols: number[]) => cols.forEach((x) => [12, 13].forEach((y) => g.set(X + x, y, 'K')));
  if (eyes === 'center') eye([6, 7, 14, 15]);
  if (eyes === 'left') eye([4, 5, 13, 14]);
  if (eyes === 'right') eye([7, 8, 16, 17]);
  if (eyes === 'closed') [5, 6, 7, 14, 15, 16].forEach((x) => g.set(X + x, 13, 'K'));
  if (eyes === 'happy') {
    [6, 7, 14, 15].forEach((x) => g.set(X + x, 12, 'K'));
    [5, 8, 13, 16].forEach((x) => g.set(X + x, 13, 'K'));
  }
  const m = (x: number, y: number, c = 'K') => g.set(X + x, y, c);
  if (mouth === 'neutral') [9, 10, 11, 12].forEach((x) => m(x, 16));
  if (mouth === 'smile') {
    m(8, 16);
    m(13, 16);
    [9, 10, 11, 12].forEach((x) => m(x, 17));
  }
  if (mouth === 'grin') {
    [8, 9, 10, 11, 12, 13].forEach((x) => m(x, 16));
    m(9, 17);
    m(10, 17, 'W');
    m(11, 17, 'W');
    m(12, 17);
    m(10, 18);
    m(11, 18);
  }
  if (mouth === 'open') {
    [9, 10, 11, 12].forEach((x) => m(x, 16));
    m(9, 17);
    m(10, 17, 'R');
    m(11, 17, 'R');
    m(12, 17);
    m(10, 18);
    m(11, 18);
  }
  if (mouth === 'confused') {
    m(12, 16);
    m(13, 16);
    [9, 10, 11].forEach((x) => m(x, 17));
  }
};

// Torso x 15..28, shoulders at y 22.
const SHOULDER_L = {x: 13, y: 23};
const SHOULDER_R = {x: 30, y: 23};

type Pt = {x: number; y: number};
type Arm = {elbow: Pt; hand: Pt; finger?: Pt; thumbUp?: boolean; front?: boolean; open?: boolean};

const drawArm = (g: Grid, shoulder: Pt, a: Arm, pass: 'outline' | 'fill', look: Look) => {
  const {elbow, hand} = a;
  if (pass === 'outline') {
    g.line(shoulder.x, shoulder.y, elbow.x, elbow.y, 2, 'K');
    g.line(elbow.x, elbow.y, hand.x, hand.y, 2, 'K');
    g.brush(hand.x, hand.y, a.open ? 3 : 2, 'K');
    if (a.finger) g.line(hand.x, hand.y, a.finger.x, a.finger.y, 1, 'K');
    if (a.thumbUp) g.line(hand.x, hand.y, hand.x, hand.y - 4, 1, 'K');
    return;
  }
  g.line(elbow.x, elbow.y, hand.x, hand.y, 1, 'S');
  g.line(shoulder.x, shoulder.y, elbow.x, elbow.y, 1, 'S');
  // Sleeve covers the upper arm (short) or the whole arm up to the wrist (long).
  const sx = shoulder.x + (elbow.x - shoulder.x) * 0.55;
  const sy = shoulder.y + (elbow.y - shoulder.y) * 0.55;
  g.line(shoulder.x, shoulder.y, sx, sy, 1, look.shirt);
  if (look.longSleeves) {
    g.line(shoulder.x, shoulder.y, elbow.x, elbow.y, 1, look.shirt);
    g.line(elbow.x, elbow.y, elbow.x + (hand.x - elbow.x) * 0.6, elbow.y + (hand.y - elbow.y) * 0.6, 1, look.shirt);
  }
  g.brush(hand.x, hand.y, a.open ? 2 : 1, 'S');
  if (a.finger) g.line(hand.x, hand.y, a.finger.x, a.finger.y, 0, 'S');
  if (a.thumbUp) g.line(hand.x, hand.y - 1, hand.x, hand.y - 3, 0, 'S');
  if (!a.open && !a.finger && !a.thumbUp) g.set(hand.x, hand.y + 1, 's');
};

type Legs = 'stand' | 'stepA' | 'stepB';

const drawLegs = (g: Grid, legs: Legs, look: Look) => {
  // Per-row x shift for left/right leg (rows 33..38) gives a stride.
  const shifts: Record<Legs, [number[], number[]]> = {
    stand: [[0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]],
    stepA: [[0, 0, -1, -1, -2, -2], [0, 0, 1, 1, 2, 2]],
    stepB: [[0, 0, 1, 1, 1, 1], [0, 0, -1, -1, -1, -1]],
  };
  const [ls, rs] = shifts[legs];
  g.rect(15, 31, 14, 2, 'K');
  g.rect(16, 31, 12, 2, look.pants[0]);
  const leg = (x0: number, sh: number[], lift: number) => {
    sh.forEach((s, i) => {
      const y = 33 + i - (i >= 4 ? lift : 0);
      g.rect(x0 + s, y, 6, 1, 'K');
      g.rect(x0 + s + 1, y, 4, 1, i % 3 === 2 ? look.pants[1] : look.pants[0]);
    });
    const s = sh[sh.length - 1];
    const y = 39 - lift;
    g.rect(x0 + s - 1, y, 8, 1, 'K');
    g.rect(x0 + s, y, 6, 1, 'W');
    g.rect(x0 + s - 1, y + 1, 8, 1, 'K');
    g.rect(x0 + s, y + 1, 6, 1, 'W');
    g.rect(x0 + s + 1, y + 1, 3, 1, look.shoeAccent);
    g.rect(x0 + s - 1, y + 2, 8, 1, 'K');
  };
  leg(15, ls, legs === 'stepB' ? 1 : 0);
  leg(23, rs, legs === 'stepA' ? 1 : 0);
};

const drawTorso = (g: Grid, look: Look) => {
  g.rect(15, 21, 14, 11, 'K');
  g.rect(16, 22, 12, 9, look.shirt);
  // Collar showing the neck.
  g.rect(20, 21, 4, 1, 'S');
  g.rect(21, 22, 2, 1, 'S');
  g.set(19, 21, 'K');
  g.set(24, 21, 'K');
  // Small chest print for silhouette readability.
  if (look.print) g.rect(18, 25, 3, 1, look.print);
};

export type Pose =
  | 'neutral'
  | 'wave'
  | 'pointLeft'
  | 'pointRight'
  | 'think'
  | 'explain'
  | 'thumbsUp'
  | 'celebrate'
  | 'walk'
  | 'goodbye'
  | 'thanks'
  | 'hold'
  | 'warn';

export const POSES: Pose[] = ['neutral', 'wave', 'pointLeft', 'pointRight', 'think', 'explain', 'thumbsUp', 'celebrate', 'walk', 'goodbye', 'thanks', 'hold', 'warn'];

const ARM_DOWN_L: Arm = {elbow: {x: 12, y: 27}, hand: {x: 12, y: 31}};
const ARM_DOWN_R: Arm = {elbow: {x: 31, y: 27}, hand: {x: 31, y: 31}};

type Frame = {l: Arm; r: Arm; legs: Legs; bodyDy?: number; defaultExpr?: Expression};

// Each pose lists its animation frames; the component cycles through them.
const POSE_FRAMES: Record<Pose, Frame[]> = {
  neutral: [{l: ARM_DOWN_L, r: ARM_DOWN_R, legs: 'stand'}],
  wave: [
    {l: ARM_DOWN_L, r: {elbow: {x: 35, y: 21}, hand: {x: 36, y: 13}, open: true}, legs: 'stand', defaultExpr: 'smile'},
    {l: ARM_DOWN_L, r: {elbow: {x: 35, y: 21}, hand: {x: 39, y: 15}, open: true}, legs: 'stand', defaultExpr: 'smile'},
  ],
  pointLeft: [
    {l: {elbow: {x: 8, y: 23}, hand: {x: 4, y: 21}, finger: {x: 1, y: 20}}, r: ARM_DOWN_R, legs: 'stand'},
  ],
  pointRight: [
    {l: ARM_DOWN_L, r: {elbow: {x: 35, y: 23}, hand: {x: 39, y: 21}, finger: {x: 42, y: 20}}, legs: 'stand'},
  ],
  think: [
    {
      l: {elbow: {x: 16, y: 28}, hand: {x: 18, y: 21}, front: true},
      r: {elbow: {x: 30, y: 28}, hand: {x: 20, y: 28}},
      legs: 'stand',
      defaultExpr: 'confused',
    },
  ],
  explain: [
    {l: ARM_DOWN_L, r: {elbow: {x: 35, y: 24}, hand: {x: 37, y: 16}, open: true}, legs: 'stand'},
    {l: ARM_DOWN_L, r: {elbow: {x: 35, y: 24}, hand: {x: 38, y: 17}, open: true}, legs: 'stand'},
  ],
  thumbsUp: [
    {l: ARM_DOWN_L, r: {elbow: {x: 34, y: 28}, hand: {x: 35, y: 22}, thumbUp: true}, legs: 'stand', defaultExpr: 'smile'},
  ],
  celebrate: [
    {l: {elbow: {x: 9, y: 18}, hand: {x: 7, y: 11}, open: true}, r: {elbow: {x: 34, y: 18}, hand: {x: 36, y: 11}, open: true}, legs: 'stand', defaultExpr: 'happy'},
    {l: {elbow: {x: 9, y: 17}, hand: {x: 8, y: 10}, open: true}, r: {elbow: {x: 34, y: 17}, hand: {x: 35, y: 10}, open: true}, legs: 'stand', defaultExpr: 'happy'},
  ],
  walk: [
    {l: {elbow: {x: 11, y: 27}, hand: {x: 10, y: 30}}, r: {elbow: {x: 32, y: 27}, hand: {x: 33, y: 30}}, legs: 'stepA'},
    {l: ARM_DOWN_L, r: ARM_DOWN_R, legs: 'stand', bodyDy: -1},
    {l: {elbow: {x: 13, y: 27}, hand: {x: 14, y: 31}}, r: {elbow: {x: 30, y: 27}, hand: {x: 29, y: 31}}, legs: 'stepB'},
    {l: ARM_DOWN_L, r: ARM_DOWN_R, legs: 'stand', bodyDy: -1},
  ],
  // Hands together at the chest: the "terima kasih" gesture.
  thanks: [
    {l: {elbow: {x: 14, y: 29}, hand: {x: 20, y: 26}, front: true}, r: {elbow: {x: 30, y: 29}, hand: {x: 23, y: 26}, front: true}, legs: 'stand', defaultExpr: 'happy'},
  ],
  // Both hands forward, for holding a phone or laptop drawn by the scene.
  hold: [
    {l: {elbow: {x: 13, y: 29}, hand: {x: 18, y: 29}, front: true}, r: {elbow: {x: 30, y: 29}, hand: {x: 25, y: 29}, front: true}, legs: 'stand'},
  ],
  // Both open palms raised in front: the "hati-hati / berhenti" warning gesture (Episode 03).
  warn: [
    {l: {elbow: {x: 9, y: 25}, hand: {x: 8, y: 18}, open: true}, r: {elbow: {x: 34, y: 25}, hand: {x: 35, y: 18}, open: true}, legs: 'stand', defaultExpr: 'confused'},
    {l: {elbow: {x: 9, y: 25}, hand: {x: 7, y: 19}, open: true}, r: {elbow: {x: 34, y: 25}, hand: {x: 36, y: 19}, open: true}, legs: 'stand', defaultExpr: 'confused'},
  ],
  goodbye: [
    {l: ARM_DOWN_L, r: {elbow: {x: 35, y: 21}, hand: {x: 36, y: 12}, open: true}, legs: 'stand', defaultExpr: 'happy'},
    {l: ARM_DOWN_L, r: {elbow: {x: 35, y: 21}, hand: {x: 39, y: 14}, open: true}, legs: 'stand', defaultExpr: 'happy'},
  ],
};

export const poseFrameCount = (pose: Pose) => POSE_FRAMES[pose].length;
export const poseDefaultExpression = (pose: Pose): Expression => POSE_FRAMES[pose][0].defaultExpr ?? 'neutral';

export type HostOptions = {
  pose: Pose;
  frame?: number;
  expression?: Expression;
  eyes?: Eyes;
  blink?: boolean;
  talking?: boolean;
  bob?: number;
  look?: Look;
};

const cache = new Map<string, Sprite>();

export const buildHost = (o: HostOptions): Sprite => {
  const look = o.look ?? HOST_LOOK;
  const key = JSON.stringify({...o, look: look.id});
  const hit = cache.get(key);
  if (hit) return hit;
  const frames = POSE_FRAMES[o.pose];
  const f = frames[(o.frame ?? 0) % frames.length];
  const expr = EXPRESSIONS[o.expression ?? f.defaultExpr ?? 'neutral'];
  const dy = (f.bodyDy ?? 0) + (o.bob ?? 0);

  const body = new Grid(HOST_W, HOST_H);
  drawLegs(body, f.legs, look);
  const upper = new Grid(HOST_W, HOST_H);
  const back = [f.l, f.r].filter((a) => !a.front);
  const front = [f.l, f.r].filter((a) => a.front);
  const sh = (a: Arm) => (a === f.l ? SHOULDER_L : SHOULDER_R);
  drawTorso(upper, look);
  back.forEach((a) => drawArm(upper, sh(a), a, 'outline', look));
  back.forEach((a) => drawArm(upper, sh(a), a, 'fill', look));
  if (look.drape) upper.stamp(look.drape, HEAD_X, 0);
  upper.stamp(look.head, HEAD_X, 0);
  let eyes = o.eyes ?? expr.eyes;
  if (o.blink) eyes = 'closed';
  const mouth = o.talking ? 'open' : expr.mouth;
  drawFace(upper, eyes, mouth);
  front.forEach((a) => drawArm(upper, sh(a), a, 'outline', look));
  front.forEach((a) => drawArm(upper, sh(a), a, 'fill', look));

  // Upper body bobs over fixed legs; everything shifts down 1 row so a lift never clips the hair.
  const out = new Grid(HOST_W, HOST_H);
  body.cells.forEach((row, y) => row.forEach((c, x) => c !== '.' && out.set(x, y + 1, c)));
  upper.cells.forEach((row, y) => row.forEach((c, x) => c !== '.' && out.set(x, y + 1 + dy, c)));
  const s = out.toSprite();
  cache.set(key, s);
  return s;
};
