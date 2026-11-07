// Episode 05 pixel icons (Linux Pixel World). Same palette keys and pixel density as assets/icons.
// No official OS or distro logos: generic, original pixel art plus text labels.
import {Grid, Sprite} from '../../components/PixelSprite/grid';

const draw = (w: number, h: number, fn: (g: Grid) => void): Sprite => {
  const g = new Grid(w, h);
  fn(g);
  return g.toSprite();
};

// Generic desktop monitor: wallpaper colour, two app windows and a taskbar.
export const DESKTOP = (wall = 'b', bar = 'N'): Sprite =>
  draw(26, 21, (g) => {
    g.rect(0, 0, 26, 17, 'K');
    g.rect(1, 1, 24, 15, wall);
    g.rect(3, 3, 9, 7, 'K');
    g.rect(4, 4, 7, 5, 'W');
    g.rect(4, 4, 7, 1, 'U');
    g.rect(13, 6, 9, 7, 'K');
    g.rect(14, 7, 7, 5, 'W');
    g.rect(14, 7, 7, 1, 'E');
    for (const [x, y] of [
      [2, 11],
      [2, 13],
    ])
      g.rect(x, y, 2, 1, 'o');
    g.rect(1, 14, 24, 2, bar);
    g.rect(2, 14, 3, 2, 'u');
    g.rect(11, 17, 4, 2, 'K');
    g.rect(7, 19, 12, 2, 'K');
    g.rect(8, 19, 10, 1, 'g');
  });

// Monitor showing a terminal prompt.
export const TERMINAL_SCREEN: Sprite = draw(26, 21, (g) => {
  g.rect(0, 0, 26, 17, 'K');
  g.rect(1, 1, 24, 15, 'V');
  g.rect(1, 1, 24, 2, 'N');
  g.rect(3, 5, 2, 1, 'E');
  g.rect(6, 5, 8, 1, 'W');
  g.rect(3, 8, 12, 1, 'e');
  g.rect(3, 11, 2, 1, 'E');
  g.rect(6, 11, 2, 2, 'E');
  g.rect(11, 17, 4, 2, 'K');
  g.rect(7, 19, 12, 2, 'K');
  g.rect(8, 19, 10, 1, 'g');
});

// CPU chip.
export const CPU: Sprite = draw(14, 14, (g) => {
  for (let i = 3; i < 11; i += 2) {
    g.rect(i, 0, 1, 2, 'g');
    g.rect(i, 12, 1, 2, 'g');
    g.rect(0, i, 2, 1, 'g');
    g.rect(12, i, 2, 1, 'g');
  }
  g.rect(2, 2, 10, 10, 'K');
  g.rect(3, 3, 8, 8, 'G');
  g.rect(5, 5, 4, 4, 'u');
});

// Memory stick.
export const RAM: Sprite = draw(20, 8, (g) => {
  g.rect(0, 0, 20, 6, 'K');
  g.rect(1, 1, 18, 4, 'E');
  for (let x = 2; x < 18; x += 4) g.rect(x, 2, 3, 2, 'K');
  for (let x = 1; x < 19; x += 2) g.rect(x, 6, 1, 2, 'Y');
});

// Hard disk.
export const DISK: Sprite = draw(16, 12, (g) => {
  g.rect(0, 0, 16, 12, 'K');
  g.rect(1, 1, 14, 10, 'g');
  for (let y = 0; y < 7; y++)
    for (let x = 0; x < 7; x++) if ((x - 3) ** 2 + (y - 3) ** 2 <= 10) g.set(3 + x, 2 + y, 'w');
  g.rect(6, 5, 1, 1, 'K');
  g.rect(11, 8, 3, 2, 'E');
});

// Software package box (distros, apps).
export const PACKAGE = (body: string): Sprite =>
  draw(16, 15, (g) => {
    g.rect(0, 3, 16, 12, 'K');
    g.rect(1, 4, 14, 10, body);
    g.rect(2, 0, 12, 4, 'K');
    g.rect(3, 1, 10, 3, body);
    g.rect(7, 0, 2, 15, 'K');
    g.rect(7, 1, 2, 13, 'o');
    g.rect(1, 4, 14, 1, 'K');
  });

// Keyboard.
export const KEYBOARD: Sprite = draw(30, 8, (g) => {
  g.rect(0, 0, 30, 8, 'K');
  g.rect(1, 1, 28, 6, 'G');
  for (let y = 1; y < 6; y += 2) for (let x = 2; x < 28; x += 3) g.rect(x, y + 0, 2, 1, 'w');
  g.rect(8, 6, 14, 1, 'w');
});

// Mouse pointer.
export const POINTER: Sprite = [
  'K.......',
  'KK......',
  'KWK.....',
  'KWWK....',
  'KWWWK...',
  'KWWWWK..',
  'KWWWWWK.',
  'KWWKKKKK',
  'KWK.KWK.',
  'KK..KWK.',
  'K....KWK',
  '.....KK.',
];

// Server rack with rows of status lights; `tick` animates them.
export const RACK = (tick = 0): Sprite =>
  draw(16, 30, (g) => {
    g.rect(0, 0, 16, 30, 'K');
    g.rect(1, 1, 14, 28, 'V');
    for (let r = 0; r < 6; r++) {
      const y = 2 + r * 4;
      g.rect(2, y, 12, 3, 'N');
      g.rect(3, y + 1, 1, 1, (r + tick) % 3 === 0 ? 'E' : 'e');
      g.rect(5, y + 1, 1, 1, (r + tick) % 4 === 1 ? 'O' : 'G');
      g.rect(8, y + 1, 5, 1, 'G');
    }
  });
