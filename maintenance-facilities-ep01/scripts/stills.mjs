// QA helper: render selected frames of a composition.
// Usage: node scripts/stills.mjs <compositionId> <outDir> <frame> [frame...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import {mkdirSync} from 'node:fs';

const [id, outDir, ...frames] = process.argv.slice(2);
mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
const composition = await selectComposition({serveUrl, id, browserExecutable, chromiumOptions: {gl: 'swangle'}});
for (const f of frames) {
  const output = path.join(outDir, `f${String(f).padStart(4, '0')}.png`);
  await renderStill({serveUrl, composition, frame: Number(f), output, browserExecutable, chromiumOptions: {gl: 'swangle'}, timeoutInMilliseconds: 120000});
  console.log('rendered', output);
}
