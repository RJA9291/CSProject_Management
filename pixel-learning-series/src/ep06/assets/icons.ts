// Episode 06 pixel icons (IT Support). Same palette keys and pixel density as assets/icons.
import {HOST_LOOK, Look} from '../../assets/characters/host';
import {Grid, Sprite} from '../../components/PixelSprite/grid';

const draw = (w: number, h: number, fn: (g: Grid) => void): Sprite => {
  const g = new Grid(w, h);
  fn(g);
  return g.toSprite();
};

// The SAME presenter (face, hair, glasses, outfit) wearing an IT-support headset:
// a band over the hair, ear cups and a small boom mic, stamped onto the existing head sprite.
const withHeadset = (head: Sprite): Sprite => {
  const g = new Grid(head[0].length, head.length);
  g.stamp(head, 0, 0);
  // Band across the top of the hair.
  g.rect(2, 2, 18, 1, 'G');
  g.rect(1, 3, 1, 5, 'G');
  g.rect(20, 3, 1, 5, 'G');
  // Ear cups.
  g.rect(0, 8, 2, 6, 'K');
  g.rect(20, 8, 2, 6, 'K');
  g.rect(0, 9, 1, 4, 'U');
  g.rect(21, 9, 1, 4, 'U');
  // Boom mic towards the mouth.
  g.rect(1, 14, 1, 3, 'G');
  g.rect(2, 17, 4, 1, 'G');
  g.rect(6, 17, 2, 1, 'K');
  return g.toSprite();
};

export const TECH_LOOK: Look = {...HOST_LOOK, id: 'host-headset', head: withHeadset(HOST_LOOK.head)};

// Monitor with a coloured screen: 'error' (red with !), 'ok' (green tick), 'loading' (spinner), 'normal'.
export const MONITOR = (state: 'error' | 'ok' | 'loading' | 'normal', tick = 0): Sprite =>
  draw(26, 21, (g) => {
    g.rect(0, 0, 26, 17, 'K');
    const screen = state === 'error' ? 'R' : state === 'ok' ? 'E' : state === 'loading' ? 'V' : 'b';
    g.rect(1, 1, 24, 15, screen);
    if (state === 'error') {
      g.rect(12, 4, 2, 6, 'W');
      g.rect(12, 11, 2, 2, 'W');
    }
    if (state === 'ok') {
      g.line(8, 9, 11, 12, 1, 'W');
      g.line(11, 12, 17, 5, 1, 'W');
    }
    if (state === 'loading') {
      const dots: [number, number][] = [
        [13, 4],
        [16, 5],
        [17, 8],
        [16, 11],
        [13, 12],
        [10, 11],
        [9, 8],
        [10, 5],
      ];
      dots.forEach(([x, y], i) => g.rect(x - 1, y - 1, 2, 2, (i + tick) % 8 < 3 ? 'W' : 'N'));
    }
    if (state === 'normal') {
      g.rect(3, 3, 10, 7, 'W');
      g.rect(3, 3, 10, 1, 'U');
      g.rect(1, 14, 24, 2, 'N');
    }
    g.rect(11, 17, 4, 2, 'K');
    g.rect(7, 19, 12, 2, 'K');
    g.rect(8, 19, 10, 1, 'g');
  });

// Toolbox.
export const TOOLBOX: Sprite = draw(22, 15, (g) => {
  g.rect(7, 0, 8, 2, 'K');
  g.rect(7, 2, 2, 3, 'K');
  g.rect(13, 2, 2, 3, 'K');
  g.rect(0, 4, 22, 11, 'K');
  g.rect(1, 5, 20, 9, 'R');
  g.rect(1, 5, 20, 2, 'r');
  g.rect(0, 8, 22, 1, 'K');
  g.rect(9, 7, 4, 3, 'Y');
});

// Sheet of paper (printer output / paper jam).
export const PAPER = (lines = true): Sprite =>
  draw(12, 15, (g) => {
    g.rect(0, 0, 12, 15, 'K');
    g.rect(1, 1, 10, 13, 'W');
    if (lines) for (let y = 3; y < 13; y += 2) g.rect(2, y, y === 3 ? 5 : 8, 1, 'g');
  });

// Support ticket.
export const TICKET: Sprite = draw(16, 12, (g) => {
  g.rect(0, 0, 16, 12, 'K');
  g.rect(1, 1, 14, 10, 'o');
  g.rect(1, 1, 14, 2, 'O');
  g.rect(3, 5, 8, 1, 'T');
  g.rect(3, 7, 10, 1, 'T');
  g.rect(3, 9, 6, 1, 'T');
});

// Up-arrow escalation badge.
export const ESCALATE: Sprite = draw(12, 14, (g) => {
  for (let i = 0; i < 6; i++) g.rect(6 - i, i, i * 2, 1, 'K');
  for (let i = 1; i < 5; i++) g.rect(7 - i, i + 1, i * 2 - 2, 1, 'O');
  g.rect(3, 6, 6, 8, 'K');
  g.rect(4, 6, 4, 7, 'O');
});
