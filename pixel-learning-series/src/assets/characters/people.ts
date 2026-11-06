// Supporting characters and avatar looks. They share the host's body, poses and pixel scale;
// only the head and outfit colours change.
import {Grid, Sprite} from '../../components/PixelSprite/grid';
import {buildHost, HOST_LOOK, Look} from './host';

// Adds a 1px black outline around every non-transparent, non-outline pixel.
const outline = (g: Grid) => {
  const add: [number, number][] = [];
  for (let y = 0; y < g.h; y++) {
    for (let x = 0; x < g.w; x++) {
      if (g.get(x, y) !== '.') continue;
      const n = [g.get(x - 1, y), g.get(x + 1, y), g.get(x, y - 1), g.get(x, y + 1)];
      if (n.some((c) => c !== '.' && c !== 'K')) add.push([x, y]);
    }
  }
  add.forEach(([x, y]) => g.set(x, y, 'K'));
};

// Host head without glasses: lens frames become skin, with short eyebrows.
const noGlasses = (head: Sprite): Sprite => {
  const g = new Grid(22, head.length);
  g.stamp(head, 0, 0);
  for (let y = 10; y <= 14; y++) for (let x = 3; x <= 18; x++) if ('Kw'.includes(g.get(x, y))) g.set(x, y, 'S');
  [5, 6, 7, 14, 15, 16].forEach((x) => g.set(x, 10, 'K'));
  return g.toSprite();
};

// Baseball cap over the host hairline (colour = palette key).
const withCap = (head: Sprite, c: string): Sprite => [
  '......................',
  '......KKKKKKKKKK......',
  `....KK${c.repeat(10)}KK....`,
  `...K${c.repeat(14)}K...`,
  `..K${c.repeat(5)}WW${c.repeat(9)}K..`,
  `.K${c.repeat(18)}K.`,
  'KKKKKKKKKKKKKKKKKKKKKK',
  ...head.slice(7),
];

// Hijab framing the face; `c`/`hi` are fill and highlight keys.
const hijabHead = (c: string, hi: string): Sprite => {
  const g = new Grid(22, 21);
  const hw = [6, 8, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
  hw.forEach((w, y) => g.rect(11 - w, y, w * 2, 1, c));
  const face: [number, number][] = [[4, 17], [3, 18], [3, 18], [3, 18], [3, 18], [3, 18], [3, 18], [3, 18], [3, 18], [3, 18], [4, 17], [5, 16]];
  face.forEach(([a, b], i) => g.rect(a, 8 + i, b - a + 1, 1, 'S'));
  g.rect(6, 2, 4, 1, hi);
  g.rect(5, 3, 3, 1, hi);
  [5, 6, 7, 14, 15, 16].forEach((x) => g.set(x, 10, 'K'));
  g.rect(3, 15, 2, 1, 'r');
  g.rect(17, 15, 2, 1, 'r');
  // Outline only the outer silhouette: draw into a padded grid, then crop.
  const pad = new Grid(24, 23);
  pad.stamp(g.toSprite(), 1, 1);
  outline(pad);
  return pad.toSprite().slice(1, 22).map((r) => r.slice(1, 23));
};

// Hijab drape over the shoulders, stamped under the head.
const hijabDrape = (c: string): Sprite => {
  const pad = new Grid(24, 30);
  [10, 10, 10, 11, 11, 10, 9, 7].forEach((w, i) => pad.rect(12 - w, 18 + i + 1, w * 2, 1, c));
  outline(pad);
  return pad.toSprite().slice(1, 30).map((r) => r.slice(1, 23));
};

const HOST_HEAD = HOST_LOOK.head;

export const STUDENT_LOOK: Look = {
  id: 'student',
  head: hijabHead('M', 'm'),
  drape: hijabDrape('M'),
  shirt: 'L',
  longSleeves: true,
  pants: ['N', 'V'],
  shoeAccent: 'M',
};

export const OWNER_LOOK: Look = {
  id: 'owner',
  head: withCap(noGlasses(HOST_HEAD), 'O'),
  shirt: 'E',
  print: 'W',
  pants: ['T', 't'],
  shoeAccent: 'O',
};

// Avatar looks selectable from config (src/ep02/config/supporters.ts).
export const AVATAR_LOOKS: Record<string, Look> = {
  'boy-blue': {id: 'boy-blue', head: noGlasses(HOST_HEAD), shirt: 'U', print: 'W', pants: ['N', 'V'], shoeAccent: 'R'},
  'boy-cap': {id: 'boy-cap', head: withCap(noGlasses(HOST_HEAD), 'R'), shirt: 'O', print: 'W', pants: ['J', 'j'], shoeAccent: 'R'},
  'boy-glasses': {id: 'boy-glasses', head: HOST_HEAD, shirt: 'E', print: 'W', pants: ['J', 'j'], shoeAccent: 'R'},
  'hijab-pink': {id: 'hijab-pink', head: hijabHead('M', 'm'), drape: hijabDrape('M'), shirt: 'L', longSleeves: true, pants: ['N', 'V'], shoeAccent: 'M'},
  'hijab-teal': {id: 'hijab-teal', head: hijabHead('A', 'a'), drape: hijabDrape('A'), shirt: 'L', longSleeves: true, pants: ['N', 'V'], shoeAccent: 'A'},
  'hijab-purple': {id: 'hijab-purple', head: hijabHead('P', 'p'), drape: hijabDrape('P'), shirt: 'L', longSleeves: true, pants: ['N', 'V'], shoeAccent: 'P'},
};

// Head-and-shoulders crop of a look, for profile pictures.
export const avatarSprite = (look: Look): Sprite =>
  buildHost({pose: 'neutral', expression: 'smile', look})
    .slice(0, 30)
    .map((r) => r.slice(9, 35));
