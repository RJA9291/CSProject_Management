// QC: renders every scene at given relative moments, then tiles them into out/stills/qc-NN.png.
// Usage: node scripts/render-stills.mjs 0.35,0.85
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

// Usage: node scripts/render-stills.mjs <moments> [ep01|ep02]
const moments = (process.argv[2] ?? '0.35,0.85').split(',').map(Number);
const episode = process.argv[3] ?? 'ep01';
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
const EP01_IDS = [
  'Scene01Hook', 'Scene02Problem', 'Scene03Greeting', 'Scene04Gift', 'Scene05Introduction', 'Scene06LFCA',
  'Scene07Roadmap', 'Scene08Systems', 'Scene09Network', 'Scene10Software', 'Scene11Summary', 'Scene12Closing',
];
const EP02_IDS = [
  'Ep02Scene01Hook', 'Ep02Scene02Greeting', 'Ep02Scene03Supporters', 'Ep02Scene04Topic', 'Ep02Scene05WhatIs',
  'Ep02Scene06Everyday', 'Ep02Scene07ServiceModels', 'Ep02Scene08Deployment', 'Ep02Scene09Architecture',
  'Ep02Scene10Security', 'Ep02Scene11Business', 'Ep02Scene12Recap', 'Ep02Scene13Closing', 'Ep02Scene14CTA',
];
const ids = episode === 'ep02' ? EP02_IDS : EP01_IDS;
mkdirSync('public/qc', {recursive: true});
let serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const results = {};
for (const at of moments) {
  const tag = `${episode}-qc-${Math.round(at * 100)}`;
  results[tag] = [];
  for (const [i, id] of ids.entries()) {
    const composition = await selectComposition({serveUrl, id, browserExecutable});
    const frame = Math.min(composition.durationInFrames - 1, Math.round(composition.durationInFrames * at));
    results[tag].push(frame);
    await renderStill({composition, serveUrl, frame, scale: 0.3, browserExecutable, output: path.resolve(`public/qc/${tag}-${String(i + 1).padStart(2, '0')}.png`)});
  }
}
// Re-bundle so the freshly written public/qc images are included.
serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
for (const [tag, frames] of Object.entries(results)) {
  const inputProps = {tag, frames, names: ids.map((id) => id.replace(/^(Ep02)?Scene\d+/, ''))};
  const composition = await selectComposition({serveUrl, id: 'QCSheet', inputProps, browserExecutable});
  const output = path.resolve(`out/stills/${tag}.png`);
  await renderStill({composition, serveUrl, output, inputProps, browserExecutable});
  console.log('Wrote', output);
}
