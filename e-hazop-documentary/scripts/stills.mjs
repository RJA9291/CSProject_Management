// QA helper: renders a set of frames and a contact sheet for quick review.
// Usage: node scripts/stills.mjs <outDir> 30 120 450 ...
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import {mkdirSync} from 'node:fs';

const [outDir, ...frames] = process.argv.slice(2);
mkdirSync(outDir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
const composition = await selectComposition({serveUrl, id: 'EHazopDocumentary', browserExecutable});
for (const f of frames) {
  const output = path.join(outDir, `f${String(f).padStart(4, '0')}.png`);
  await renderStill({serveUrl, composition, frame: Number(f), output, browserExecutable, chromiumOptions: {gl: 'swiftshader'}});
  console.log('rendered', output);
}
