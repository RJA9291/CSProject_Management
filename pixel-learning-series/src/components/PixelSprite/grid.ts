// A sprite is a list of equal-length rows; each char is a PALETTE key and '.' is transparent.
export type Sprite = string[];

export class Grid {
  cells: string[][];
  constructor(public w: number, public h: number) {
    this.cells = Array.from({length: h}, () => Array(w).fill('.'));
  }
  set(x: number, y: number, c: string) {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.cells[y][x] = c;
  }
  get(x: number, y: number) {
    return this.cells[y]?.[x] ?? '.';
  }
  rect(x: number, y: number, w: number, h: number, c: string) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }
  // Square brush keeps diagonal strokes chunky, like hand-placed pixels.
  brush(x: number, y: number, r: number, c: string) {
    for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) this.set(x + i, y + j, c);
  }
  line(x0: number, y0: number, x1: number, y1: number, r: number, c: string) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let s = 0; s <= steps; s++) {
      this.brush(x0 + ((x1 - x0) * s) / steps, y0 + ((y1 - y0) * s) / steps, r, c);
    }
  }
  stamp(sprite: Sprite, x: number, y: number) {
    sprite.forEach((row, j) => [...row].forEach((c, i) => c !== '.' && this.set(x + i, y + j, c)));
  }
  toSprite(): Sprite {
    return this.cells.map((r) => r.join(''));
  }
}

export const mirror = (s: Sprite): Sprite => s.map((r) => [...r].reverse().join(''));

// Replaces palette keys, e.g. recolour one icon for another theme.
export const recolor = (s: Sprite, map: Record<string, string>): Sprite =>
  s.map((r) => [...r].map((c) => map[c] ?? c).join(''));
