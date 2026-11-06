// Episode 02 pixel icons (cloud world). Same palette keys and pixel density as assets/icons.
import {Grid, Sprite} from '../../components/PixelSprite/grid';

const outlined = (w: number, h: number, draw: (g: Grid) => void): Sprite => {
  const g = new Grid(w, h);
  draw(g);
  return g.toSprite();
};

export const PHONE: Sprite = outlined(11, 18, (g) => {
  g.rect(0, 0, 11, 18, 'K');
  g.rect(1, 1, 9, 16, 'V');
  g.rect(2, 3, 7, 11, 'Z');
  g.rect(3, 4, 5, 1, 'U');
  g.rect(3, 6, 4, 1, 'u');
  g.rect(3, 8, 5, 1, 'u');
  g.rect(3, 10, 3, 1, 'u');
  g.rect(4, 1, 3, 1, 'G');
  g.rect(4, 15, 3, 1, 'g');
});

// Tall office building; body/trim keys let one sprite serve several cloud types.
export const office = (body: string, trim: string, w = 16, h = 24): Sprite =>
  outlined(w, h, (g) => {
    g.rect(0, 2, w, h - 2, 'K');
    g.rect(1, 3, w - 2, h - 4, body);
    g.rect(1, 3, w - 2, 1, trim);
    g.rect(3, 0, w - 6, 3, 'K');
    g.rect(4, 1, w - 8, 2, trim);
    for (let y = 6; y < h - 6; y += 3) for (let x = 3; x < w - 3; x += 3) g.rect(x, y, 2, 2, 'Z');
    g.rect(Math.floor(w / 2) - 2, h - 5, 4, 4, 'V');
  });

export const HOUSE: Sprite = outlined(20, 17, (g) => {
  for (let i = 0; i < 7; i++) {
    g.rect(9 - i - 1, i, (i + 1) * 2 + 2, 1, 'K');
    if (i > 0) g.rect(9 - i, i, i * 2 + 2, 1, 'R');
  }
  g.rect(1, 7, 18, 10, 'K');
  g.rect(2, 7, 16, 9, 'L');
  g.rect(4, 9, 4, 4, 'K');
  g.rect(5, 10, 2, 2, 'u');
  g.rect(12, 10, 4, 7, 'K');
  g.rect(13, 11, 2, 5, 'T');
});

export const UNIVERSITY: Sprite = outlined(26, 19, (g) => {
  g.rect(12, 0, 1, 3, 'K');
  g.rect(13, 0, 3, 2, 'R');
  for (let i = 0; i < 5; i++) {
    g.rect(12 - i * 2 - 1, 3 + i, i * 4 + 4, 1, 'K');
    if (i > 0) g.rect(12 - i * 2, 3 + i, i * 4 + 2, 1, 'w');
  }
  g.rect(1, 8, 24, 2, 'K');
  g.rect(2, 8, 22, 1, 'g');
  g.rect(2, 10, 22, 7, 'w');
  for (let x = 3; x < 23; x += 4) {
    g.rect(x, 10, 2, 7, 'g');
  }
  g.rect(0, 17, 26, 2, 'K');
  g.rect(1, 17, 24, 1, 'G');
  g.rect(11, 12, 4, 5, 'V');
});

export const SHOP: Sprite = outlined(24, 19, (g) => {
  g.rect(0, 0, 24, 6, 'K');
  for (let x = 1; x < 23; x += 2) {
    g.rect(x, 1, 1, 4, 'R');
    g.rect(x + 1, 1, 1, 4, 'W');
  }
  g.rect(1, 5, 22, 1, 'K');
  g.rect(1, 6, 22, 12, 'K');
  g.rect(2, 6, 20, 11, 'o');
  g.rect(3, 8, 9, 6, 'K');
  g.rect(4, 9, 7, 4, 'Z');
  g.rect(14, 8, 6, 10, 'K');
  g.rect(15, 9, 4, 8, 'T');
  g.rect(0, 18, 24, 1, 'K');
});

export const CAR: Sprite = outlined(22, 11, (g) => {
  g.rect(5, 0, 11, 4, 'K');
  g.rect(6, 1, 9, 3, 'Z');
  g.rect(10, 1, 1, 3, 'K');
  g.rect(0, 3, 22, 6, 'K');
  g.rect(1, 4, 20, 4, 'U');
  g.rect(19, 5, 2, 1, 'o');
  g.rect(3, 7, 5, 4, 'K');
  g.rect(14, 7, 5, 4, 'K');
  g.rect(4, 8, 3, 2, 'G');
  g.rect(15, 8, 3, 2, 'G');
});

export const FILE: Sprite = [
  'KKKKKKK...',
  'KWWWWWKK..',
  'KWWWWWKwK.',
  'KWWWWWKKKK',
  'KWUUUUUUWK',
  'KWWWWWWWWK',
  'KWuuuuuWWK',
  'KWWWWWWWWK',
  'KWuuuuuuWK',
  'KWWWWWWWWK',
  'KKKKKKKKKK',
];

export const DATABASE: Sprite = outlined(14, 16, (g) => {
  for (const y0 of [0, 5, 10]) {
    g.rect(1, y0, 12, 1, 'K');
    g.rect(0, y0 + 1, 14, 5, 'K');
    g.rect(1, y0 + 1, 12, 4, y0 === 0 ? 'u' : 'U');
    g.rect(2, y0 + 1, 10, 1, y0 === 0 ? 'Z' : 'u');
    g.rect(10, y0 + 3, 2, 1, 'e');
  }
  g.rect(1, 15, 12, 1, 'K');
});

export const BROWSER: Sprite = outlined(20, 15, (g) => {
  g.rect(0, 0, 20, 15, 'K');
  g.rect(1, 1, 18, 3, 'V');
  g.set(2, 2, 'R');
  g.set(4, 2, 'O');
  g.set(6, 2, 'E');
  g.rect(8, 2, 10, 1, 'Z');
  g.rect(1, 4, 18, 10, 'W');
  g.rect(3, 6, 8, 2, 'U');
  g.rect(3, 9, 14, 1, 'g');
  g.rect(3, 11, 10, 1, 'g');
  g.rect(13, 6, 4, 2, 'u');
});

export const APP: Sprite = outlined(12, 12, (g) => {
  g.rect(0, 0, 12, 12, 'K');
  g.rect(1, 1, 10, 10, 'U');
  g.rect(3, 3, 2, 2, 'W');
  g.rect(7, 3, 2, 2, 'o');
  g.rect(3, 7, 2, 2, 'e');
  g.rect(7, 7, 2, 2, 'r');
});

// Virtual machines: stacked windows on one host.
export const VM: Sprite = outlined(16, 14, (g) => {
  for (const [x, y, c] of [[0, 0, 'p'], [3, 3, 'u'], [6, 6, 'e']] as const) {
    g.rect(x, y, 10, 8, 'K');
    g.rect(x + 1, y + 1, 8, 2, 'V');
    g.rect(x + 1, y + 3, 8, 4, c);
  }
});

export const PADLOCK = (open: boolean): Sprite =>
  outlined(12, 17, (g) => {
    // Shackle: lifted and unhooked on the right when open.
    const top = open ? 0 : 2;
    g.rect(2, top, 8, 2, 'K');
    g.rect(2, top, 2, 8 - top, 'K');
    g.rect(8, top, 2, open ? 3 : 6, 'K');
    g.rect(0, 8, 12, 9, 'K');
    g.rect(1, 9, 10, 7, 'o');
    g.rect(1, 9, 10, 1, 'Y');
    g.rect(5, 11, 2, 3, 'K');
  });

// Small data packet travelling along connections.
export const PACKET: Sprite = ['KKKKKK', 'KoooYK', 'KoYYoK', 'KKKKKK'];
export const PACKET_BACK: Sprite = ['KKKKKK', 'KeeEEK', 'KeEEeK', 'KKKKKK'];

// Big cloud used as the hub of the cloud world (scaled with px).
export const BIG_CLOUD: Sprite = outlined(40, 22, (g) => {
  const blobs: [number, number, number][] = [
    [11, 12, 8],
    [20, 8, 9],
    [29, 12, 8],
    [6, 16, 5],
    [34, 16, 5],
  ];
  const inside = (x: number, y: number) => blobs.some(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 <= r * r) || (y >= 12 && y <= 20 && x >= 3 && x <= 36);
  for (let y = 0; y < 22; y++) for (let x = 0; x < 40; x++) if (inside(x, y)) g.set(x, y, 'W');
  // Outline + soft underside shading.
  const cells = g.toSprite();
  for (let y = 0; y < 22; y++) {
    for (let x = 0; x < 40; x++) {
      if (cells[y][x] !== 'W') continue;
      const edge = [cells[y - 1]?.[x], cells[y + 1]?.[x], cells[y][x - 1], cells[y][x + 1]].some((c) => c === undefined || c === '.');
      if (edge) g.set(x, y, 'V');
      else if (y >= 18) g.set(x, y, 'Z');
    }
  }
});

// Password field dots and the MFA code are drawn as text; this is the key glyph.
export const KEY: Sprite = ['.KKK......', 'KoYoK.....', 'KY.YKKKKKK', 'KoYoKoooYK', '.KKK.KYKYK', '......K.K.'];

export const CONFETTI_COLORS = ['#C93434', '#F4A51C', '#39A86B', '#1265C8', '#65C7F4', '#7B4FC9'];
