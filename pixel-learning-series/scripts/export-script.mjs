// Exports an episode's voice-over lines (display text + TTS text) for generate-voiceover.py.
// Usage: node scripts/export-script.mjs ep01|ep02|ep03  -> scripts/script-<ep>.json
import {build} from 'esbuild';
import {writeFileSync} from 'node:fs';
import path from 'node:path';

const EPISODES = {
  ep01: {file: './src/config/episode.ts', name: 'EP01'},
  ep02: {file: './src/ep02/config/episode.ts', name: 'EP02'},
  ep03: {file: './src/ep03/config/episode.ts', name: 'EP03'},
  ep04: {file: './src/ep04/config/episode.ts', name: 'EP04'},
  ep05: {file: './src/ep05/config/episode.ts', name: 'EP05'},
  ep06: {file: './src/ep06/config/episode.ts', name: 'EP06'},
};
const id = process.argv[2] ?? 'ep01';
const ep = EPISODES[id];
if (!ep) throw new Error(`Unknown episode "${id}". Known: ${Object.keys(EPISODES).join(', ')}`);

const result = await build({
  stdin: {
    contents: `import {${ep.name} as ep} from '${ep.file}'; import {ttsText} from './src/lib/episode';
      export default {voDir: ep.voDir, timingsPath: ep.timingsPath,
        lines: ep.scenes.map((s, i) => ({scene: i + 1, vo: s.vo, tts: ttsText(ep, i)}))};`,
    resolveDir: path.resolve('.'),
    loader: 'ts',
  },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  logLevel: 'error',
});
const mod = await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
const out = path.resolve(`scripts/script-${id}.json`);
writeFileSync(out, JSON.stringify(mod.default, null, 2));
console.log(`Exported ${mod.default.lines.length} voice-over lines to ${path.relative('.', out)}`);
