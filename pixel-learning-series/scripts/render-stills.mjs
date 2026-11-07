// QC: renders every scene at given relative moments, then tiles them into out/stills/qc-NN.png.
// Usage: node scripts/render-stills.mjs 0.35,0.85
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

// Usage: node scripts/render-stills.mjs <moments> [ep01|ep02|ep03]
const moments = (process.argv[2] ?? '0.35,0.85').split(',').map(Number);
const episode = process.argv[3] ?? 'ep01';
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE ?? null;
// Behind an HTTPS proxy (cloud sessions) the browser needs this to load Google Fonts.
const chromiumOptions = process.env.https_proxy ? {ignoreCertificateErrors: true} : {};
const EP01_IDS = [
  'Scene01Hook', 'Scene02Problem', 'Scene03Greeting', 'Scene04Gift', 'Scene05Introduction', 'Scene06LFCA',
  'Scene07Roadmap', 'Scene08Systems', 'Scene09Network', 'Scene10Software', 'Scene11Summary', 'Scene12Closing',
];
const EP02_IDS = [
  'Ep02Scene01Hook', 'Ep02Scene02Greeting', 'Ep02Scene03Supporters', 'Ep02Scene04Topic', 'Ep02Scene05WhatIs',
  'Ep02Scene06Everyday', 'Ep02Scene07ServiceModels', 'Ep02Scene08Deployment', 'Ep02Scene09Architecture',
  'Ep02Scene10Security', 'Ep02Scene11Business', 'Ep02Scene12Recap', 'Ep02Scene13Closing', 'Ep02Scene14CTA',
];
const EP03_IDS = [
  'Ep03Scene01Hook', 'Ep03Scene02Greeting', 'Ep03Scene03Supporters', 'Ep03Scene04WhatIs', 'Ep03Scene05Threats',
  'Ep03Scene06Phishing', 'Ep03Scene07StopCheckVerify', 'Ep03Scene08PasswordMFA', 'Ep03Scene09Hygiene',
  'Ep03Scene10Victim', 'Ep03Scene11Recap', 'Ep03Scene12CTA',
];
const EP04_IDS = [
  'Ep04Scene01Hook', 'Ep04Scene02Greeting', 'Ep04Scene03Supporters', 'Ep04Scene04WhatIs', 'Ep04Scene05Types',
  'Ep04Scene06RouterSwitch', 'Ep04Scene07IPMAC', 'Ep04Scene08DNSDHCP', 'Ep04Scene09DataFlow',
  'Ep04Scene10Factory', 'Ep04Scene11Recap', 'Ep04Scene12CTA',
];
const EP05_IDS = [
  'Ep05Scene01Hook', 'Ep05Scene02Greeting', 'Ep05Scene03Supporters', 'Ep05Scene04WhatIs', 'Ep05Scene05LinuxVsWindows',
  'Ep05Scene06Kernel', 'Ep05Scene07Distros', 'Ep05Scene08GuiCli', 'Ep05Scene09Commands',
  'Ep05Scene10Server', 'Ep05Scene11Recap', 'Ep05Scene12CTA',
];
const EP06_IDS = [
  'Ep06Scene01Hook', 'Ep06Scene02Greeting', 'Ep06Scene03Supporters', 'Ep06Scene04WhatIs', 'Ep06Scene05Problems',
  'Ep06Scene06Troubleshooting', 'Ep06Scene07Steps', 'Ep06Scene08Internet', 'Ep06Scene09Printer',
  'Ep06Scene10Factory', 'Ep06Scene11Recap', 'Ep06Scene12CTA',
];
const ids = episode === 'ep06' ? EP06_IDS : episode === 'ep05' ? EP05_IDS : episode === 'ep04' ? EP04_IDS : episode === 'ep03' ? EP03_IDS : episode === 'ep02' ? EP02_IDS : EP01_IDS;
mkdirSync('public/qc', {recursive: true});
let serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const results = {};
for (const at of moments) {
  const tag = `${episode}-qc-${Math.round(at * 100)}`;
  results[tag] = [];
  for (const [i, id] of ids.entries()) {
    const composition = await selectComposition({serveUrl, id, browserExecutable, chromiumOptions});
    const frame = Math.min(composition.durationInFrames - 1, Math.round(composition.durationInFrames * at));
    results[tag].push(frame);
    await renderStill({composition, serveUrl, frame, scale: 0.3, browserExecutable, chromiumOptions, output: path.resolve(`public/qc/${tag}-${String(i + 1).padStart(2, '0')}.png`)});
  }
}
// Re-bundle so the freshly written public/qc images are included.
serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
for (const [tag, frames] of Object.entries(results)) {
  const inputProps = {tag, frames, names: ids.map((id) => id.replace(/^(Ep0[2-6])?Scene\d+/, ''))};
  const composition = await selectComposition({serveUrl, id: 'QCSheet', inputProps, browserExecutable, chromiumOptions});
  const output = path.resolve(`out/stills/${tag}.png`);
  await renderStill({composition, serveUrl, output, inputProps, browserExecutable, chromiumOptions});
  console.log('Wrote', output);
}
