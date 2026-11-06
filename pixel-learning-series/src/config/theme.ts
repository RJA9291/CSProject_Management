import {loadFont as loadRubik} from '@remotion/google-fonts/Rubik';
import {loadFont as loadSilkscreen} from '@remotion/google-fonts/Silkscreen';

const rubik = loadRubik('normal', {weights: ['700', '900'], subsets: ['latin']});
const silk = loadSilkscreen('normal', {weights: ['400', '700'], subsets: ['latin']});

export const VIDEO = {width: 1080, height: 1920, fps: 30};

export const COLORS = {
  bg: '#F3EFE6',
  dot: '#DCD5C4',
  text: '#171717',
  red: '#C93434',
  navy: '#17375E',
  blue: '#2586C7',
  green: '#39A86B',
  orange: '#F4A51C',
  white: '#FFFFFF',
  purple: '#7B4FC9',
  teal: '#1FA38A',
};

// Every sprite pixel colour comes from this table; sprites reference single-char keys.
export const PALETTE: Record<string, string> = {
  K: '#171717', // outline / hair / tee
  k: '#2E2E2E', // tee shading
  h: '#3A3A3A', // hair highlight
  S: '#F2C29B', // skin
  s: '#D99B72', // skin shade
  W: '#FFFFFF',
  w: '#E6E1D6', // off-white / glass glint
  g: '#9AA0A6', // grey
  G: '#5F666D', // dark grey
  J: '#2B4C7E', // jeans
  j: '#1E3657', // jeans shade
  R: '#C93434',
  r: '#E35D5D', // light red
  N: '#17375E',
  B: '#2586C7',
  b: '#7CC3EE', // light blue
  E: '#39A86B',
  e: '#7FD3A0', // light green
  O: '#F4A51C',
  o: '#FFD36B', // light orange / yellow
  P: '#7B4FC9',
  p: '#B394EC', // light purple
  C: '#F7B6C8', // pink icing
  c: '#E58AA6',
  T: '#8A5A3B', // brown
  t: '#B07A52',
  Y: '#F4C430', // gold
  // Episode 02 (Cloud Computing) blues and supporting-character colours.
  U: '#1265C8', // primary blue
  V: '#102F69', // dark navy
  u: '#65C7F4', // sky blue
  Z: '#BFE9FB', // pale sky
  M: '#D9578A', // hijab pink
  m: '#F29BBB',
  A: '#2FA59A', // hijab teal
  a: '#7BD3C9',
  L: '#F1E6CF', // light top
};

export const FONTS = {
  heading: rubik.fontFamily,
  pixel: silk.fontFamily,
};

// Vertical layout bands (px) keep text clear of the platform UI and subtitles.
export const LAYOUT = {
  safeTop: 170,
  safeBottom: 300,
  subtitleY: 1590,
  sidePad: 70,
};

// Sprite pixels are drawn at this many screen pixels so every asset shares one pixel density.
export const PX = 12;
