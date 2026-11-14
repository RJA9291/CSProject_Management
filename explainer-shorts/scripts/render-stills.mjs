// QC: renders each shot at the given relative moments into out/stills/<shot>-<pct>.png
// Usage: node scripts/render-stills.mjs 0.3,0.8 [scale]
import {bundle} from '@remotion/bundler';
import {getCompositions, renderStill} from '@remotion/renderer';
import path from 'node:path';

const moments = (process.argv[2] ?? '0.3,0.8').split(',').map(Number);
const scale = Number(process.argv[3] ?? 0.35);
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
const chromiumOptions = {gl: 'swangle'};
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const comps = (await getCompositions(serveUrl, {browserExecutable, chromiumOptions})).filter((c) => c.id.startsWith('Waze-'));
for (const c of comps) {
  for (const m of moments) {
    const frame = Math.min(c.durationInFrames - 1, Math.round(c.durationInFrames * m));
    const output = path.resolve(`out/stills/${c.id}-${Math.round(m * 100)}.png`);
    await renderStill({composition: c, serveUrl, frame, output, scale, browserExecutable, chromiumOptions});
    console.log('Wrote', output);
  }
}
