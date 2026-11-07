// Episode 04 pixel icons (networking). Same palette keys and pixel density as assets/icons.
import {Grid, Sprite} from '../../components/PixelSprite/grid';

const draw = (w: number, h: number, fn: (g: Grid) => void): Sprite => {
  const g = new Grid(w, h);
  fn(g);
  return g.toSprite();
};

// Network switch: wide box with a row of ports; `lit` picks which port LEDs blink on.
export const SWITCH = (lit = 0): Sprite =>
  draw(26, 9, (g) => {
    g.rect(0, 0, 26, 9, 'K');
    g.rect(1, 1, 24, 7, 'V');
    g.rect(1, 1, 24, 1, 'U');
    for (let i = 0; i < 8; i++) {
      const x = 2 + i * 3;
      g.rect(x, 4, 2, 3, 'K');
      g.rect(x, 3, 2, 1, (i + lit) % 3 === 0 ? 'E' : (i + lit) % 3 === 1 ? 'o' : 'G');
    }
  });

// Wi-Fi fan with `level` 0..3 bars lit.
export const WIFI = (level = 3, on = 'U', off = 'w'): Sprite =>
  draw(15, 11, (g) => {
    const arcs = [
      {r: 7, y: 8},
      {r: 5, y: 8},
      {r: 3, y: 8},
    ];
    arcs.forEach((a, i) => {
      const c = 3 - i <= level ? on : off;
      for (let deg = 40; deg <= 140; deg += 4) {
        const rad = (deg * Math.PI) / 180;
        g.brush(7 + Math.cos(rad) * a.r, a.y - Math.sin(rad) * a.r, 0, c);
        g.set(7 + Math.cos(rad) * a.r, a.y + 1 - Math.sin(rad) * a.r, c);
      }
    });
    g.rect(6, 8, 3, 3, level >= 0 ? on : off);
  });

// Printer.
export const PRINTER: Sprite = draw(18, 15, (g) => {
  g.rect(4, 0, 10, 5, 'K');
  g.rect(5, 1, 8, 4, 'W');
  g.rect(0, 4, 18, 8, 'K');
  g.rect(1, 5, 16, 6, 'g');
  g.rect(1, 5, 16, 1, 'w');
  g.rect(13, 7, 2, 1, 'E');
  g.rect(3, 9, 12, 2, 'G');
  g.rect(4, 11, 10, 4, 'K');
  g.rect(5, 11, 8, 3, 'W');
  g.rect(6, 12, 6, 1, 'g');
});

// Factory building with saw-tooth roof and chimney.
export const FACTORY: Sprite = draw(34, 20, (g) => {
  g.rect(27, 0, 4, 10, 'K');
  g.rect(28, 1, 2, 9, 'R');
  for (let k = 0; k < 3; k++) {
    const x0 = k * 9;
    for (let i = 0; i < 6; i++) g.rect(x0 + i, 6 - i, 1, i + 1, 'K');
    for (let i = 0; i < 5; i++) g.rect(x0 + 1 + i, 7 - i, 1, i, 'g');
    g.rect(x0 + 6, 1, 3, 7, 'K');
    g.rect(x0 + 6, 2, 2, 6, 'u');
  }
  g.rect(0, 7, 34, 13, 'K');
  g.rect(1, 8, 32, 11, 'L');
  for (let x = 3; x < 30; x += 6) {
    g.rect(x, 10, 4, 3, 'K');
    g.rect(x + 1, 11, 2, 1, 'Z');
  }
  g.rect(14, 14, 6, 6, 'K');
  g.rect(15, 15, 4, 5, 'T');
});

// Network interface card (where the MAC address lives).
export const NIC: Sprite = draw(20, 12, (g) => {
  g.rect(0, 0, 18, 9, 'K');
  g.rect(1, 1, 16, 7, 'E');
  g.rect(3, 2, 5, 4, 'K');
  g.rect(4, 3, 3, 2, 'G');
  g.rect(10, 2, 2, 2, 'K');
  g.rect(13, 2, 2, 2, 'K');
  g.rect(10, 5, 5, 1, 'o');
  g.rect(18, 1, 2, 7, 'K');
  g.rect(18, 2, 1, 5, 'g');
  for (let x = 2; x < 16; x += 2) g.rect(x, 9, 1, 3, 'Y');
});

// Ethernet plug (RJ45).
export const PLUG: Sprite = draw(8, 12, (g) => {
  g.rect(0, 0, 8, 8, 'K');
  g.rect(1, 1, 6, 6, 'b');
  for (let x = 1; x < 7; x += 2) g.rect(x, 1, 1, 2, 'Y');
  g.rect(2, 8, 4, 4, 'K');
  g.rect(3, 8, 2, 4, 'U');
});

// Globe (the internet).
export const GLOBE: Sprite = draw(16, 16, (g) => {
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const d = (x - 7.5) ** 2 + (y - 7.5) ** 2;
      if (d <= 64) g.set(x, y, 'K');
      if (d <= 49) g.set(x, y, 'u');
    }
  g.rect(3, 4, 4, 3, 'E');
  g.rect(4, 7, 3, 4, 'E');
  g.rect(9, 3, 4, 2, 'E');
  g.rect(9, 8, 3, 5, 'E');
  g.rect(1, 7, 14, 1, 'U');
  g.rect(7, 1, 1, 14, 'U');
});

// Speech-style "?" query and a lookup book for DNS.
export const ADDRESS_BOOK: Sprite = draw(14, 16, (g) => {
  g.rect(0, 0, 14, 16, 'K');
  g.rect(1, 1, 12, 14, 'U');
  g.rect(1, 1, 2, 14, 'V');
  g.rect(5, 3, 6, 4, 'W');
  g.rect(6, 4, 4, 1, 'K');
  g.rect(6, 5, 3, 1, 'g');
  for (let y = 9; y < 14; y += 2) g.rect(5, y, 6, 1, 'u');
});

// Small city skyline for the WAN card (key = building colour).
export const CITY = (body = 'U'): Sprite =>
  draw(18, 14, (g) => {
    const blds = [
      [0, 5, 5, 9],
      [5, 0, 6, 14],
      [11, 3, 7, 11],
    ];
    blds.forEach(([x, y, w, h]) => {
      g.rect(x, y, w, h, 'K');
      g.rect(x + 1, y + 1, w - 2, h - 1, body);
      for (let yy = y + 2; yy < y + h - 1; yy += 2) for (let xx = x + 2; xx < x + w - 1; xx += 2) g.set(xx, yy, 'Z');
    });
  });
