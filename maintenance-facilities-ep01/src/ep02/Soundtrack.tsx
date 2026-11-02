// Episode 02 audio: narration, ducked score (same palette as Ep01) and scene-synced SFX.
import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import {LINES, lw, scene} from './timeline';

const g = (sceneId: number, local: number) => Math.round(scene(sceneId).from + local);
type Cue = {sfx: string; at: number; v: number};
const c = (s: number, local: number, sfx: string, v: number): Cue => ({sfx, at: g(s, local), v});
const st5 = (id: string) => lw(5, id as 's5_1') - 10;

export const CUES: Cue[] = [
  // 1 · first day
  c(1, 0, 'wind', 0.35),
  c(1, 10, 'footsteps', 0.35),
  c(1, 215, 'whoosh', 0.25),
  c(1, 220, 'machine_hum', 0.3),
  c(1, 230, 'conveyor', 0.22),
  c(1, 260, 'servo', 0.22),
  c(1, 300, 'spot_weld', 0.2),
  c(1, 360, 'spot_weld', 0.18),
  c(1, 440, 'footsteps', 0.3),
  // 2 · organisation overview
  c(2, 0, 'whoosh', 0.35),
  c(2, 4, 'shimmer', 0.3),
  c(2, lw(2, 's2_2', 'managing') - 4, 'ui', 0.35),
  c(2, lw(2, 's2_3', 'plant') - 4, 'ui', 0.35),
  ...['production', 'quality', 'logistics', 'p. p. c.', 'engineering', 'maintenance'].map((w) => c(2, lw(2, 's2_4', w) - 4, 'ui', 0.3)),
  c(2, lw(2, 's2_5', 'safety') - 4, 'ui', 0.35),
  c(2, lw(2, 's2_5', 'q. m. s.') - 4, 'ui', 0.35),
  // 3 · department tour
  c(3, 0, 'machine_hum', 0.22),
  c(3, 0, 'footsteps', 0.3),
  ...['s3_2', 's3_3', 's3_4', 's3_5', 's3_6', 's3_7'].map((id) => c(3, lw(3, id as 's3_2') - 14, 'whoosh', 0.16)),
  c(3, lw(3, 's3_2') + 20, 'ratchet', 0.3),
  c(3, lw(3, 's3_3') + 30, 'beep', 0.25),
  c(3, lw(3, 's3_4') - 10, 'machine_hum', 0.25),
  c(3, lw(3, 's3_5') + 20, 'ui', 0.25),
  c(3, lw(3, 's3_6') + 40, 'ui', 0.22),
  c(3, lw(3, 's3_7') - 8, 'weld_arc', 0.3),
  c(3, lw(3, 's3_7') + 60, 'gear', 0.25),
  // 4 · supporting functions
  c(4, 0, 'machine_hum', 0.2),
  c(4, lw(4, 's4_3') - 14, 'whoosh', 0.2),
  c(4, lw(4, 's4_3') + 30, 'ui', 0.25),
  // 5 · breakdown
  c(5, 0, 'machine_hum', 0.25),
  c(5, 0, 'conveyor', 0.25),
  c(5, 30, 'servo', 0.25),
  c(5, lw(5, 's5_1', 'berhenti') - 6, 'impact', 0.35),
  c(5, lw(5, 's5_1', 'berhenti') - 4, 'alarm', 0.35),
  c(5, st5('s5_2') + 20, 'alarm', 0.22),
  c(5, st5('s5_3') + 50, 'click', 0.5),
  c(5, st5('s5_4') + 20, 'ratchet', 0.4),
  c(5, st5('s5_4') + 90, 'ratchet', 0.35),
  c(5, st5('s5_4') + 140, 'ui', 0.25),
  c(5, st5('s5_5') + 8, 'click', 0.3),
  c(5, st5('s5_6') + 30, 'ui', 0.3),
  c(5, st5('s5_7'), 'machine_hum', 0.3),
  c(5, st5('s5_8') + 40, 'servo', 0.3),
  c(5, st5('s5_8') + 44, 'shimmer', 0.25),
  c(5, st5('s5_8') + 70, 'ui', 0.25),
  // 6 · one plant, one team
  c(6, 0, 'whoosh', 0.3),
  ...Array.from({length: 8}, (_, i) => c(6, 18 + i * 12, 'ui', 0.28)),
  c(6, lw(6, 's6_2') - 8, 'whoosh', 0.25),
  c(6, lw(6, 's6_3') + 70, 'impact', 0.42),
  c(6, lw(6, 's6_3') + 72, 'shimmer', 0.35),
];

const duck = (f: number) => {
  let d = Infinity;
  for (const l of LINES) {
    if (f >= l.from && f <= l.to) return 0.3;
    d = Math.min(d, Math.abs(f - l.from), Math.abs(f - l.to));
  }
  return interpolate(d, [0, 12], [0.3, 1], {extrapolateRight: 'clamp'});
};

export const Soundtrack02: React.FC<{music?: number; voice?: number; sfx?: number}> = ({music = 0.55, voice = 1, sfx = 0.7}) => (
  <>
    <Audio src={staticFile('audio/ep02/music/score.flac')} volume={(f) => music * duck(f)} />
    {LINES.map((l) => (
      <Sequence key={l.id} name={`VO ${l.id}`} from={l.from} layout="none">
        <Audio src={staticFile(`audio/ep02/vo/${l.id}.wav`)} volume={voice} />
      </Sequence>
    ))}
    {CUES.map((q, i) => (
      <Sequence key={i} name={`SFX ${q.sfx}`} from={Math.max(0, q.at)} layout="none">
        <Audio src={staticFile(`audio/sfx/${q.sfx}.wav`)} volume={q.v * sfx} />
      </Sequence>
    ))}
  </>
);
