// Episode 05 palette (Linux Pixel World). Shared tokens (beige background, text, fonts) come from config/theme.ts.
import {loadFont as loadVT323} from '@remotion/google-fonts/VT323';

const vt = loadVT323('normal', {weights: ['400'], subsets: ['latin']});

export const EP05_THEME = {
  bg: '#F3EFE6',
  navy: '#102F69',
  blue: '#1265C8',
  cyan: '#65C7F4',
  green: '#39B86B',
  red: '#C93434',
  white: '#FFFFFF',
  text: '#171717',
  orange: '#F4A51C',
  purple: '#7B4FC9',
  // Terminal colours.
  term: '#0B1220',
  termBar: '#1C2740',
  termText: '#D8E2F0',
};

// Pixel terminal font (keeps lowercase commands readable).
export const TERM_FONT = vt.fontFamily;
