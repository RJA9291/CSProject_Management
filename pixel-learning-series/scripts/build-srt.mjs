// Writes an .srt for an episode from its word timings and the real scene offsets of the full video.
// Usage: node scripts/build-srt.mjs [ep01|ep02|ep03]
import {bundle} from '@remotion/bundler';
import {selectComposition} from '@remotion/renderer';
import {build} from 'esbuild';
import {mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import path from 'node:path';

const EPISODES = {
  ep01: {file: './src/config/episode.ts', name: 'EP01', comp: 'LFCAVideo', out: 'out/lfca-roadmap.srt'},
  ep02: {file: './src/ep02/config/episode.ts', name: 'EP02', comp: 'CloudVideo', out: 'out/ep02-cloud-computing.srt'},
  ep03: {file: './src/ep03/config/episode.ts', name: 'EP03', comp: 'CyberVideo', out: 'out/ep03-cybersecurity-basics.srt'},
  ep04: {file: './src/ep04/config/episode.ts', name: 'EP04', comp: 'NetworkVideo', out: 'out/ep04-computer-networking.srt'},
  ep05: {file: './src/ep05/config/episode.ts', name: 'EP05', comp: 'LinuxVideo', out: 'out/ep05-introduction-to-linux.srt'},
};
const id = process.argv[2] ?? 'ep01';
const ep = EPISODES[id];
if (!ep) throw new Error(`Unknown episode "${id}"`);

// Same word grouping as the on-screen Subtitles component.
const result = await build({
  stdin: {
    contents: `import {${ep.name} as ep} from '${ep.file}'; import {makeTiming} from './src/lib/episode';
      import {chunkWords} from './src/components/Subtitles';
      const t = makeTiming(ep);
      export default {transition: ep.transitionFrames, scenes: ep.scenes.map((s, i) => chunkWords(t.sceneWords(i)))};`,
    resolveDir: path.resolve('.'),
    loader: 'tsx',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  external: ['remotion', '@remotion/*', 'react', 'react-dom'],
  logLevel: 'error',
});
// Written next to node_modules so the external imports resolve.
const tmp = path.resolve('scripts/.srt-data.mjs');
writeFileSync(tmp, result.outputFiles[0].text);
const {default: data} = await import(pathToFileURL(tmp).href);
rmSync(tmp);

const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
// Behind an HTTPS proxy (cloud sessions) the browser needs this to load Google Fonts.
const chromiumOptions = process.env.https_proxy ? {ignoreCertificateErrors: true} : {};
const comp = await selectComposition({serveUrl, id: ep.comp, browserExecutable, chromiumOptions});
const durations = comp.props.durations;

const fmt = (t) => {
  const ms = Math.round(t * 1000);
  const p = (n, w = 2) => String(n).padStart(w, '0');
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

const cues = [];
let start = 0;
data.scenes.forEach((chunks, i) => {
  const offset = start / comp.fps;
  chunks.forEach((c) => cues.push({a: offset + c.start, b: offset + c.end, text: c.text}));
  start += durations[i] - data.transition;
});
mkdirSync('out', {recursive: true});
writeFileSync(ep.out, cues.map((c, i) => `${i + 1}\n${fmt(c.a)} --> ${fmt(Math.min(c.b + 0.2, cues[i + 1]?.a ?? Infinity))}\n${c.text}\n`).join('\n'));
console.log(`Wrote ${ep.out} (${cues.length} cues)`);
