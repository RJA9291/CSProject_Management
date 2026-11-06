// Episode 03 pixel icons (cybersecurity). Same palette keys and pixel density as assets/icons.
import {Grid, Sprite} from '../../components/PixelSprite/grid';

const draw = (w: number, h: number, fn: (g: Grid) => void): Sprite => {
  const g = new Grid(w, h);
  fn(g);
  return g.toSprite();
};

// Filled circle / ring helpers on the pixel grid.
const disk = (g: Grid, cx: number, cy: number, r: number, c: string) => {
  for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * 0.6) g.set(cx + x, cy + y, c);
};

// Yellow warning triangle with "!".
export const WARNING: Sprite = draw(17, 15, (g) => {
  for (let y = 0; y < 15; y++) {
    const half = Math.floor((y * 8) / 14);
    g.rect(8 - half, y, half * 2 + 1, 1, 'K');
    if (y > 1 && y < 14) g.rect(8 - half + 1, y, Math.max(0, half * 2 - 1), 1, 'Y');
  }
  g.rect(1, 13, 15, 1, 'Y');
  g.rect(0, 14, 17, 1, 'K');
  g.rect(8, 4, 1, 6, 'K');
  g.rect(8, 11, 1, 2, 'K');
});

// Envelope (email / SMS).
export const ENVELOPE: Sprite = draw(18, 13, (g) => {
  g.rect(0, 0, 18, 13, 'K');
  g.rect(1, 1, 16, 11, 'W');
  for (let i = 0; i < 8; i++) {
    g.set(1 + i, 1 + i * 0.75, 'K');
    g.set(16 - i, 1 + i * 0.75, 'K');
  }
  g.rect(1, 11, 16, 1, 'w');
});

// Fishing hook (phishing).
export const HOOK: Sprite = draw(10, 16, (g) => {
  g.rect(6, 0, 2, 2, 'K');
  g.rect(6, 2, 2, 9, 'g');
  g.rect(5, 2, 1, 9, 'K');
  g.rect(8, 2, 1, 9, 'K');
  g.rect(1, 11, 8, 2, 'g');
  g.rect(0, 11, 1, 3, 'K');
  g.rect(1, 13, 8, 1, 'K');
  g.rect(8, 11, 1, 2, 'K');
  g.rect(0, 7, 3, 4, 'g');
  g.rect(0, 6, 3, 1, 'K');
  g.rect(3, 7, 1, 4, 'K');
  g.rect(1, 14, 7, 1, 'K');
});

// ID card (personal information).
export const IDCARD: Sprite = draw(18, 12, (g) => {
  g.rect(0, 0, 18, 12, 'K');
  g.rect(1, 1, 16, 10, 'Z');
  g.rect(1, 1, 16, 2, 'U');
  g.rect(2, 4, 5, 6, 'K');
  g.rect(3, 5, 3, 2, 'S');
  g.rect(3, 7, 3, 2, 'k');
  g.rect(8, 5, 8, 1, 'V');
  g.rect(8, 7, 6, 1, 'u');
  g.rect(8, 9, 7, 1, 'u');
});

// Virus / malware bug.
export const BUG: Sprite = draw(16, 15, (g) => {
  // legs
  for (const y of [5, 8, 11]) {
    g.rect(0, y, 3, 1, 'K');
    g.rect(13, y, 3, 1, 'K');
  }
  g.rect(5, 0, 1, 2, 'K');
  g.rect(10, 0, 1, 2, 'K');
  disk(g, 8, 8, 6, 'K');
  disk(g, 8, 8, 5, 'R');
  g.rect(8, 3, 1, 11, 'K');
  g.rect(5, 6, 2, 2, 'W');
  g.rect(10, 6, 2, 2, 'W');
  g.rect(5, 6, 1, 1, 'K');
  g.rect(11, 6, 1, 1, 'K');
  g.rect(4, 10, 2, 2, 'r');
  g.rect(11, 10, 2, 2, 'r');
});

// Dangerous app tile with a skull.
export const BAD_APP: Sprite = draw(14, 14, (g) => {
  g.rect(1, 0, 12, 14, 'K');
  g.rect(0, 1, 14, 12, 'K');
  g.rect(1, 1, 12, 12, 'P');
  g.rect(3, 3, 8, 6, 'W');
  g.rect(4, 9, 6, 2, 'W');
  g.rect(4, 5, 2, 2, 'K');
  g.rect(8, 5, 2, 2, 'K');
  g.rect(6, 7, 2, 1, 'K');
  g.rect(5, 10, 1, 1, 'K');
  g.rect(8, 10, 1, 1, 'K');
});

// Red octagon with a raised white palm.
export const STOP_HAND: Sprite = draw(18, 18, (g) => {
  for (let y = 0; y < 18; y++) {
    const inset = y < 5 ? 5 - y : y > 12 ? y - 12 : 0;
    g.rect(inset, y, 18 - inset * 2, 1, 'K');
    if (y > 0 && y < 17) g.rect(inset + 1, y, 16 - inset * 2, 1, 'R');
  }
  // palm
  for (const x of [5, 7, 9, 11]) g.rect(x, 4, 2, 6, 'W');
  g.rect(5, 9, 8, 5, 'W');
  g.rect(3, 9, 2, 3, 'W');
});

// Magnifying glass.
export const MAGNIFIER: Sprite = draw(16, 16, (g) => {
  disk(g, 6, 6, 6, 'K');
  disk(g, 6, 6, 4, 'u');
  g.rect(3, 3, 2, 2, 'W');
  g.line(10, 10, 14, 14, 1, 'K');
  g.line(11, 11, 14, 14, 0, 'T');
});

// Big green tick in a circle (verified).
export const VERIFIED: Sprite = draw(16, 16, (g) => {
  disk(g, 8, 8, 7, 'K');
  disk(g, 8, 8, 6, 'E');
  g.line(4, 8, 7, 11, 1, 'W');
  g.line(7, 11, 12, 5, 1, 'W');
});

// Red X.
export const X_MARK: Sprite = draw(11, 11, (g) => {
  g.line(1, 1, 9, 9, 1, 'K');
  g.line(9, 1, 1, 9, 1, 'K');
  g.line(1, 1, 9, 9, 0, 'R');
  g.line(9, 1, 1, 9, 0, 'R');
});

// Bank building.
export const BANK: Sprite = draw(20, 17, (g) => {
  for (let i = 0; i < 5; i++) g.rect(9 - i * 2, i, 2 + i * 4, 1, 'K');
  g.rect(2, 3, 16, 2, 'U');
  g.rect(8, 2, 4, 1, 'Y');
  g.rect(0, 5, 20, 1, 'K');
  for (const x of [2, 6, 11, 15]) {
    g.rect(x, 6, 3, 8, 'K');
    g.rect(x + 1, 6, 1, 8, 'w');
  }
  g.rect(1, 14, 18, 1, 'K');
  g.rect(0, 15, 20, 2, 'K');
  g.rect(1, 15, 18, 1, 'g');
});

// Police badge (star on a shield).
export const POLICE: Sprite = draw(16, 18, (g) => {
  for (let y = 0; y < 18; y++) {
    const inset = y < 12 ? 0 : y - 11;
    g.rect(inset, y, 16 - inset * 2, 1, 'K');
    if (y > 0 && y < 17) g.rect(inset + 1, y, 14 - inset * 2, 1, 'V');
  }
  g.rect(1, 1, 14, 2, 'U');
  // star
  g.rect(7, 4, 2, 9, 'Y');
  g.rect(4, 7, 8, 3, 'Y');
  g.rect(5, 10, 2, 3, 'Y');
  g.rect(9, 10, 2, 3, 'Y');
  g.rect(7, 7, 2, 2, 'o');
});

// Evidence folder with a document.
export const FOLDER: Sprite = draw(20, 15, (g) => {
  g.rect(0, 1, 8, 2, 'K');
  g.rect(1, 2, 6, 1, 'O');
  g.rect(0, 3, 20, 12, 'K');
  g.rect(3, 0, 13, 8, 'K');
  g.rect(4, 1, 11, 7, 'W');
  g.rect(5, 2, 7, 1, 'g');
  g.rect(5, 4, 9, 1, 'g');
  g.rect(1, 6, 18, 8, 'O');
  g.rect(1, 6, 18, 1, 'o');
  g.rect(7, 9, 6, 2, 'K');
  g.rect(8, 9, 4, 1, 'W');
});

// Telephone handset.
export const HANDSET: Sprite = draw(14, 14, (g) => {
  g.line(2, 2, 2, 7, 1, 'K');
  g.line(2, 7, 7, 12, 1, 'K');
  g.line(7, 12, 12, 12, 1, 'K');
  g.rect(1, 0, 4, 4, 'K');
  g.rect(2, 1, 2, 2, 'E');
  g.rect(10, 10, 4, 4, 'K');
  g.rect(11, 11, 2, 2, 'E');
  g.line(2, 4, 2, 7, 0, 'E');
  g.line(3, 8, 7, 11, 0, 'E');
});

// Circular "update" arrows.
export const UPDATE: Sprite = draw(16, 16, (g) => {
  disk(g, 8, 8, 7, 'K');
  disk(g, 8, 8, 6, 'U');
  disk(g, 8, 8, 3, 'K');
  disk(g, 8, 8, 2, '.');
  g.rect(0, 0, 8, 6, '.');
  g.rect(8, 10, 8, 6, '.');
  // arrow heads
  g.rect(6, 1, 5, 1, 'K');
  g.rect(7, 2, 3, 1, 'u');
  g.rect(8, 3, 1, 1, 'u');
  g.rect(5, 14, 5, 1, 'K');
  g.rect(6, 13, 3, 1, 'u');
  g.rect(7, 12, 1, 1, 'u');
});

// Up arrow (backup / upload).
export const ARROW_UP: Sprite = draw(11, 12, (g) => {
  for (let i = 0; i < 6; i++) g.rect(5 - i, i, i * 2 + 1, 1, 'K');
  for (let i = 1; i < 5; i++) g.rect(6 - i, i, i * 2 - 1, 1, 'E');
  g.rect(3, 6, 5, 6, 'K');
  g.rect(4, 5, 3, 6, 'E');
});

// Download tray with a down arrow.
export const DOWNLOAD: Sprite = draw(16, 16, (g) => {
  g.rect(6, 0, 4, 7, 'K');
  g.rect(7, 0, 2, 7, 'U');
  for (let i = 0; i < 5; i++) g.rect(3 + i, 6 + i, 10 - i * 2, 1, 'K');
  for (let i = 0; i < 4; i++) g.rect(4 + i, 6 + i, 8 - i * 2, 1, 'U');
  g.rect(0, 10, 2, 6, 'K');
  g.rect(14, 10, 2, 6, 'K');
  g.rect(0, 14, 16, 2, 'K');
  g.rect(2, 14, 12, 1, 'g');
});

// Fingerprint (biometric).
export const FINGERPRINT: Sprite = draw(13, 15, (g) => {
  for (const r of [6, 4, 2]) {
    for (let a = 0; a <= 180; a += 6) {
      const rad = (a * Math.PI) / 180;
      g.set(6 + Math.cos(rad) * r, 7 - Math.sin(rad) * r, 'E');
    }
    g.rect(6 - r, 7, 1, 7 - (6 - r), 'E');
    g.rect(6 + r, 7, 1, 5, 'E');
  }
  g.rect(6, 6, 1, 8, 'E');
});

// Credit card.
export const CARD: Sprite = draw(18, 12, (g) => {
  g.rect(0, 0, 18, 12, 'K');
  g.rect(1, 1, 16, 10, 'O');
  g.rect(1, 3, 16, 2, 'K');
  g.rect(2, 7, 4, 3, 'Y');
  g.rect(8, 8, 8, 1, 'T');
});

// Binary characters shown drifting in the threat background.
export const BITS = ['0', '1', '1', '0', '1', '0', '0', '1'];
