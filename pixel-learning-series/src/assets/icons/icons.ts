// Pixel icon library. Keys map to PALETTE in config/theme.ts; '.' is transparent.
import {Grid, Sprite} from '../../components/PixelSprite/grid';

const SCREEN_CODE: Sprite = [
  'BBBBBBBBBBBBBB',
  'BBBBBBBBWBBBBB',
  'BBBWBBBWBBBWBB',
  'BBWBBBBWBBBBWB',
  'BBBWBBWBBBBWBB',
  'BBBBBBWBBBBBBB',
  'BBBBBBBBBBBBBB',
  'bbbbbbbbbbbbbb',
];

const SCREEN_EDITOR: Sprite = [
  'NNNNNNNNNNNNNN',
  'NEEENooooNNNNN',
  'NNNbbbbNbbNNNN',
  'NNNWWWNRRRRNNN',
  'NNNNNbbbNNNNNN',
  'NEEEENNNNNNNNN',
  'NNNbbbNWWWWNNN',
  'NNNNNNNNNNNNNN',
];

const framed = (screen: Sprite, border = 'N'): Sprite => [
  'K'.repeat(18),
  'K' + border.repeat(16) + 'K',
  ...screen.map((r) => 'K' + border + r + border + 'K'),
  'K' + border.repeat(16) + 'K',
  'K'.repeat(18),
];

export const COMPUTER: Sprite = [
  ...framed(SCREEN_CODE),
  '.......KNNK.......',
  '.....KKKKKKKK.....',
  '.....KggggggK.....',
  '.....KKKKKKKK.....',
];

export const LAPTOP: Sprite = [
  ...framed(SCREEN_EDITOR, 'G').map((r) => '..' + r + '..'),
  'KKKKKKKKKKKKKKKKKKKKKK',
  'KggggggggggggggggggggK',
  'KgGGGGGGGGGGGGGGGGGGgK',
  'KKKKKKKKKKKKKKKKKKKKKK',
];

const serverUnit = (lights: string): Sprite => [
  'KNggggggggggNK',
  `KNg${lights}gGGGGgNK`,
  'KNggggggggggNK',
  'KNNNNNNNNNNNNK',
];

export const SERVER: Sprite = [
  'KKKKKKKKKKKKKK',
  'KNNNNNNNNNNNNK',
  ...serverUnit('EgO'),
  ...serverUnit('EgE'),
  ...serverUnit('OgE'),
  ...serverUnit('EgE'),
  'KKKKKKKKKKKKKK',
  '.KK........KK.',
];

export const CLOUD: Sprite = [
  '........KKKKK.......',
  '......KKWWWWWKK.....',
  '..KKKKWWWWWWWWWK....',
  '.KWWWWWWWWWWWWWKKK..',
  'KWWWWWWWWWWWWWWWWWK.',
  'KWWWWWWWWWWWWWWWWWWK',
  'KWWWWWWWWWWWWWWWWWWK',
  'KbWWWWWWWWWWWWWWWWbK',
  '.KbbbbbbbbbbbbbbbbK.',
  '..KKKKKKKKKKKKKKKK..',
];

export const SHIELD: Sprite = [
  '......KKKK......',
  '...KKKeeeeKKK...',
  '.KKeeeEEEEeeeKK.',
  'KeeEEEEEEEEEEeeK',
  'KeEEEEEKKEEEEEeK',
  'KeEEEEKEEKEEEEeK',
  'KeEEEEKEEKEEEEeK',
  'KeEEEKKKKKKEEEeK',
  'KeEEEKooooKEEEeK',
  'KeEEEKoKKoKEEEeK',
  'KeEEEKooooKEEEeK',
  'KeEEEKKKKKKEEEeK',
  '.KeEEEEEEEEEEeK.',
  '.KeeEEEEEEEEeeK.',
  '..KeeEEEEEEeeK..',
  '...KKeeEEeeKK...',
  '.....KKeeKK.....',
  '.......KK.......',
];

export const ROUTER: Sprite = [
  '.....BBBBBBBB.....',
  '...BB........BB...',
  '..B...BBBBBB...B..',
  '.....B......B.....',
  '........BB........',
  '........BB........',
  '........KK........',
  '........KK........',
  'KKKKKKKKKKKKKKKKKK',
  'KNNNNNNNNNNNNNNNNK',
  'KNENONENNNNNNNNNNK',
  'KNNNNNNNNNNNNNNNNK',
  'KKKKKKKKKKKKKKKKKK',
  '.KK............KK.',
];

export const GEAR: Sprite = [
  '.....KKK.....',
  '..KK.KBK.KK..',
  '.KBBKKBKKBBK.',
  '.KBBBBBBBBBK.',
  '..KBBKKKBBK..',
  'KKKBK...KBKKK',
  'KBBBK...KBBBK',
  'KKKBK...KBKKK',
  '..KBBKKKBBK..',
  '.KBBBBBBBBBK.',
  '.KBBKKBKKBBK.',
  '..KK.KBK.KK..',
  '.....KKK.....',
];

export const BOOK: Sprite = [
  '..KKKKKK......KKKKKK..',
  '.KWWWWWWKK..KKWWWWWWK.',
  'KWWWWWWWWWKKWWWWWWWWWK',
  'KWbbbbbbbWKKWbbbbbbbWK',
  'KWWWWWWWWWKKWWWWWWWWWK',
  'KWbbbbbWWWKKWbbbbbbWWK',
  'KWWWWWWWWWKKWWWWWWWWWK',
  'KWbbbbbbWWKKWbbbbbWWWK',
  'KWWWWWWWWWKKWWWWWWWWWK',
  'KWWWWWWWWWKKWWWWWWWWWK',
  'KKKKKKWWWWKKWWWWKKKKKK',
  'KBBBBBKKKKBBKKKKBBBBBK',
  '.KKKKKKKKKKKKKKKKKKKK.',
];

export const CERTIFICATE: Sprite = [
  'KKKKKKKKKKKKKKKKKKKKKK',
  'KBBBBBBBBBBBBBBBBBBBBK',
  ...Array(8).fill('KBWWWWWWWWWWWWWWWWWWBK'),
  'KBWbbbbbbbbbbWWWWWWWBK',
  'KBWbbbbbbbWWWWWYYYWWBK',
  'KBWWWWWWWWWWWWYoooYWBK',
  'KBBBBBBBBBBBBBYoooYBBK',
  'KKKKKKKKKKKKKKKYYYKKKK',
  '..............RR.RR...',
  '..............RR.RR...',
  '..............R...R...',
];

// Original penguin mascot drawn for this video.
export const PENGUIN: Sprite = [
  '......KKKKKK......',
  '.....KKKKKKKK.....',
  '....KKKKKKKKKK....',
  '....KKWWKKWWKK....',
  '....KKWKKKWKKK....',
  '....KKOOOOOOKK....',
  '...KKKKOOOOKKKK...',
  '...KKWWWWWWWWKK...',
  '..KKWWWWWWWWWWKK..',
  '.KKKWWWWWWWWWWKKK.',
  'KKKWWWWWWWWWWWWKKK',
  'KK.KWWWWWWWWWWK.KK',
  'K..KWWWWWWWWWWK..K',
  '...KWWWWWWWWWWK...',
  '...KWWWWWWWWWWK...',
  '...KKWWWWWWWWKK...',
  '....KKWWWWWWKK....',
  '..OOOOOKKKKOOOOO..',
  '.OOOOOO....OOOOOO.',
];

export const CAKE: Sprite = [
  '.........o..........',
  '........oOo.........',
  '.........K..........',
  '........KRK.........',
  '........KWK.........',
  '........KRK.........',
  '....KKKKKKKKKKKK....',
  '...KCCCCCCCCCCCCK...',
  '...KCcCCcCCcCCcCK...',
  '...KttttttttttttK...',
  '...KttttttttttttK...',
  '.KKKKKKKKKKKKKKKKKK.',
  'KCCCCCCCCCCCCCCCCCCK',
  'KCcCCcCCcCCcCCcCCcCK',
  'KttttttKKKKKKttttttK',
  'KttttttKRWRRKttttttK',
  'KttttttKRWWRKttttttK',
  'KttttttKRWRRKttttttK',
  'KttttttKKKKKKttttttK',
  'KTTTTTTTTTTTTTTTTTTK',
  'KKKKKKKKKKKKKKKKKKKK',
  '.gggggggggggggggggg.',
];

export const HEART: Sprite = [
  '.KKK.KKK.',
  'KRrRKRRRK',
  'KrRRRRRRK',
  'KRRRRRRRK',
  '.KRRRRRK.',
  '..KRRRK..',
  '...KRK...',
  '....K....',
];

export const SPARKLE: Sprite = [
  '...Y...',
  '...Y...',
  '..YoY..',
  'YYoWoYY',
  '..YoY..',
  '...Y...',
  '...Y...',
];

export const QUESTION: Sprite = [
  '..KKKKKK..',
  '.KRRRRRRK.',
  'KRRKKKKRRK',
  'KRRK..KRRK',
  'KKKK..KRRK',
  '.....KRRK.',
  '....KRRK..',
  '...KRRK...',
  '...KRRK...',
  '...KKKK...',
  '..........',
  '...KKKK...',
  '...KRRK...',
  '...KRRK...',
  '...KKKK...',
];

export const CHECK: Sprite = [
  '..KKKKK..',
  '.KEEEEEK.',
  'KEEEEEWEK',
  'KEEEEWWEK',
  'KEWEWWEEK',
  'KEWWWEEEK',
  '.KEWEEEK.',
  '..KKKKK..',
];

export const MINI_PC: Sprite = [
  'KKKKKKKKKK',
  'KbbbbbbbbK',
  'KbBBBBBBbK',
  'KbBBBBBBbK',
  'KbbbbbbbbK',
  'KKKKKKKKKK',
  '...KKKK...',
  '..KKKKKK..',
];

export const GLYPH_LIKE: Sprite = [
  '....W.....',
  '...WW.....',
  '...WW.....',
  '..WWWWWWW.',
  'WW.WWWWWWW',
  'WW.WWWWWW.',
  'WW.WWWWWWW',
  'WW.WWWWWW.',
  'WW..WWWWW.',
];

export const GLYPH_SHARE: Sprite = [
  '......W...',
  '......WW..',
  'WWWWWWWWW.',
  'WWWWWWWWWW',
  'WW....WWW.',
  'WW....WW..',
  'WW....W...',
  'WW........',
];

export const GLYPH_FOLLOW: Sprite = [
  '..WWW.....',
  '.WWWWW....',
  '.WWWWW..W.',
  '..WWW..WWW',
  '........W.',
  '.WWWWW....',
  'WWWWWWW...',
  'WWWWWWW...',
];

// Big thumbs-up particle (skin hand with outline).
export const THUMB: Sprite = [
  '....KK.....',
  '...KSSK....',
  '...KSSK....',
  '..KSSSKKKKK',
  'KKKSSSSSSSK',
  'KBKSSSSSKKK',
  'KBKSSSSSSSK',
  'KBKSSSSSKKK',
  'KBKSSSSSSSK',
  'KKKKKKKKKKK',
];

// LFCA badge: stepped navy shield with orange rim and red ribbon tails; text is overlaid.
export const BADGE: Sprite = (() => {
  const W = 26;
  const H = 28;
  const g = new Grid(W, H);
  const half = (y: number) => {
    if (y < 3) return 8 + y * 2;
    if (y < 18) return 13;
    return Math.max(1, 13 - (y - 17) * 2);
  };
  for (let y = 19; y < H; y++) {
    const off = y - 19;
    g.rect(3 + Math.floor(off / 2), y, 4, 1, 'K');
    g.rect(4 + Math.floor(off / 2), y, 2, 1, 'R');
    g.rect(19 - Math.floor(off / 2), y, 4, 1, 'K');
    g.rect(20 - Math.floor(off / 2), y, 2, 1, 'R');
  }
  for (let y = 0; y < 24; y++) {
    const h = half(y);
    g.rect(13 - h, y, h * 2, 1, 'K');
    if (h > 1) g.rect(13 - h + 1, y, h * 2 - 2, 1, 'O');
    if (y >= 2 && y <= 21 && h > 3) g.rect(13 - h + 3, y, h * 2 - 6, 1, 'N');
  }
  return g.toSprite();
})();

// Small pixel arrow used in signposts and connectors.
export const ARROW_DOWN: Sprite = ['.KKK.', '.KRK.', 'KKRKK', 'KRRRK', '.KRK.', '..K..'];
