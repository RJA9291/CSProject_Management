import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

const faces: [string, string, string][] = [
  ['Inter', 'inter-latin-300-normal.woff2', '300'],
  ['Inter', 'inter-latin-400-normal.woff2', '400'],
  ['Inter', 'inter-latin-600-normal.woff2', '600'],
  ['Inter', 'inter-latin-700-normal.woff2', '700'],
  ['Inter', 'inter-latin-800-normal.woff2', '800'],
  ['JetBrains Mono', 'jetbrains-mono-latin-400-normal.woff2', '400'],
  ['JetBrains Mono', 'jetbrains-mono-latin-700-normal.woff2', '700'],
];

let loaded = false;
export const loadFonts = () => {
  if (loaded) return;
  loaded = true;
  for (const [family, file, weight] of faces) {
    loadFont({family, url: staticFile(`fonts/${file}`), weight, format: 'woff2'});
  }
};
