import {sceneRange, vo, wordAt} from './timeline';

export type Cue = {sfx: string; at: number; volume: number; loop?: number};

const s = (k: Parameters<typeof sceneRange>[0]) => sceneRange(k).from;

export const CUES: Cue[] = [
  // 1 · intro
  {sfx: 'impact', at: 4, volume: 0.35},
  {sfx: 'shimmer', at: 8, volume: 0.35},
  {sfx: 'whoosh', at: vo('s1_4') - 40, volume: 0.35},
  {sfx: 'hum', at: vo('s1_4') - 30, volume: 0.25},

  // 2 · hidden risks
  {sfx: 'hum', at: s('2'), volume: 0.3},
  {sfx: 'whoosh', at: vo('s2_2') - 12, volume: 0.3},
  {sfx: 'hum', at: vo('s2_2'), volume: 0.35},
  {sfx: 'whoosh', at: vo('s2_3') - 12, volume: 0.3},
  {sfx: 'click', at: wordAt('s2_3', 'not operate'), volume: 0.6},
  {sfx: 'beep', at: wordAt('s2_3', 'not operate') + 4, volume: 0.35},
  {sfx: 'beep', at: vo('s2_4') + 10, volume: 0.3},
  {sfx: 'beep', at: vo('s2_4') + 70, volume: 0.25},
  {sfx: 'whoosh', at: vo('s2_5') - 20, volume: 0.35},
  {sfx: 'impact', at: wordAt('s2_5', 'e-hazop') - 4, volume: 0.5},

  // 3 · what is E-HAZOP
  {sfx: 'shimmer', at: vo('s3_1') + 20, volume: 0.3},
  {sfx: 'tick', at: wordAt('s3_2', 'potential hazards'), volume: 0.5},
  {sfx: 'tick', at: wordAt('s3_2', 'operational'), volume: 0.5},
  {sfx: 'tick', at: wordAt('s3_2', 'deviations'), volume: 0.5},
  {sfx: 'whoosh', at: vo('s3_3') - 16, volume: 0.3},
  {sfx: 'whoosh', at: vo('s3_4') - 14, volume: 0.3},
  {sfx: 'tick', at: wordAt('s3_5', 'identify'), volume: 0.45},
  {sfx: 'tick', at: wordAt('s3_5', 'assess'), volume: 0.45},
  {sfx: 'tick', at: wordAt('s3_5', 'recommend'), volume: 0.45},

  // 4 · how it works
  {sfx: 'whoosh', at: s('4'), volume: 0.3},
  ...[14, 20, 26, 32, 38].map((d) => ({sfx: 'tick', at: s('4') + d, volume: 0.35})),
  ...(['s4_2', 's4_3', 's4_4', 's4_6', 's4_7'] as const).map((id) => ({sfx: 'whoosh', at: vo(id) - 14, volume: 0.22})),
  ...['over', 'under', 'spike', 'dip', 'fault'].map((w) => ({sfx: 'tick', at: wordAt('s4_5', w), volume: 0.4})),
  {sfx: 'click', at: vo('s4_7') + 10, volume: 0.3},

  // 5 · transformer overvoltage example
  {sfx: 'hum', at: s('5'), volume: 0.35},
  {sfx: 'whoosh', at: vo('s5_2') - 12, volume: 0.3},
  {sfx: 'hum', at: vo('s5_2'), volume: 0.4},
  {sfx: 'rise', at: vo('s5_2') + 30, volume: 0.35},
  {sfx: 'beep', at: vo('s5_3') + 4, volume: 0.35},
  {sfx: 'click', at: vo('s5_3') + 2, volume: 0.5},
  {sfx: 'hum', at: vo('s5_4'), volume: 0.45},
  {sfx: 'crackle', at: vo('s5_4') + 34, volume: 0.35},
  {sfx: 'crackle', at: vo('s5_4') + 100, volume: 0.3},
  {sfx: 'whoosh', at: vo('s5_5') - 12, volume: 0.3},
  ...['causes', 'consequences', 'protection'].map((w) => ({sfx: 'tick', at: wordAt('s5_5', w), volume: 0.4})),

  // 6 · why it matters
  {sfx: 'hum', at: s('6'), volume: 0.25},
  {sfx: 'whoosh', at: vo('s6_2') - 12, volume: 0.3},
  ...['personnel', 'equipment', 'design weak', 'business'].map((w) => ({sfx: 'tick', at: wordAt('s6_2', w), volume: 0.45})),
  {sfx: 'whoosh', at: vo('s6_3') - 12, volume: 0.25},
  {sfx: 'whoosh', at: vo('s6_4') - 12, volume: 0.25},

  // 7 · conclusion
  {sfx: 'hum', at: s('7'), volume: 0.25},
  {sfx: 'impact', at: vo('s7_2') + 0, volume: 0.45},
  {sfx: 'shimmer', at: vo('s7_2') + 4, volume: 0.35},
];
