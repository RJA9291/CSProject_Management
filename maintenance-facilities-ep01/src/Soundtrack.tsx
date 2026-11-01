// Audio: narration, ducked music bed and scene-synced sound effects.
import React from 'react';
import {Audio, interpolate, Sequence, staticFile} from 'remotion';
import {dF, LINES, scene, wordAt} from './data/timeline';
import {COMP_AT, MOD_AT, ORG_AT} from './scenes/DigitalScenes';

/** Global frame of a scene's design frame (applies that scene's clock). */
const gF = (sceneId: number, designFrame: number) => {
  const s = scene(sceneId);
  return Math.round(s.from + designFrame * s.k);
};

type Cue = {sfx: string; at: number; v: number};
const c = (sceneId: number, designFrame: number, sfx: string, v: number): Cue => ({sfx, at: gF(sceneId, designFrame), v});
const titleAt = dF(8, wordAt('s8_3', 'maintenance')) - 4;
const sistematikAt = dF(6, wordAt('s6_4', 'sistematik')) - 12;

export const CUES: Cue[] = [
  // 01 · plant never stops
  c(1, 0, 'wind', 0.35),
  c(1, 120, 'machine_hum', 0.3),
  c(1, 160, 'conveyor', 0.25),
  c(1, 190, 'servo', 0.25),
  c(1, 230, 'spot_weld', 0.22),
  c(1, 275, 'spot_weld', 0.2),
  c(1, 300, 'servo', 0.2),
  c(1, 330, 'spot_weld', 0.2),
  c(1, 385, 'alarm', 0.28),
  // 02 · team behind the operation
  c(2, 0, 'machine_hum', 0.22),
  c(2, 0, 'footsteps', 0.4),
  c(2, 118, 'whoosh', 0.18),
  c(2, 140, 'ratchet', 0.45),
  c(2, 195, 'ratchet', 0.4),
  c(2, 238, 'whoosh', 0.18),
  c(2, 244, 'click', 0.4),
  c(2, 250, 'elec_buzz', 0.28),
  c(2, 292, 'beep', 0.32),
  c(2, 343, 'whoosh', 0.18),
  c(2, 345, 'machine_hum', 0.3),
  c(2, 448, 'whoosh', 0.18),
  c(2, 460, 'ui', 0.3),
  // 03 · meet the department
  c(3, 0, 'whoosh', 0.22),
  c(3, 270, 'impact', 0.3),
  c(3, 272, 'shimmer', 0.3),
  // 04 · organisation chart
  c(4, 0, 'whoosh', 0.35),
  c(4, 4, 'shimmer', 0.3),
  c(4, ORG_AT.manager, 'impact', 0.22),
  c(4, ORG_AT.manager, 'ui', 0.35),
  c(4, ORG_AT.engineer, 'ui', 0.35),
  c(4, ORG_AT.assistant, 'ui', 0.35),
  c(4, ORG_AT.techs, 'ui', 0.35),
  c(4, ORG_AT.techs + 8, 'ui', 0.25),
  c(4, ORG_AT.techs + 16, 'ui', 0.25),
  // 05 · different skills
  c(5, 4, 'panel_open', 0.45),
  c(5, 20, 'elec_buzz', 0.3),
  c(5, 80, 'beep', 0.3),
  c(5, 148, 'whoosh', 0.2),
  c(5, 160, 'gear', 0.4),
  c(5, 220, 'ratchet', 0.35),
  c(5, 298, 'whoosh', 0.2),
  c(5, 320, 'weld_arc', 0.5),
  c(5, 470, 'weld_arc', 0.32),
  // 06 · not just technical work
  c(6, 20, 'ui', 0.3),
  c(6, 92, 'whoosh', 0.4),
  c(6, 100, 'shimmer', 0.3),
  ...[0, 1, 2, 3, 4, 5].map((i) => c(6, MOD_AT(i), 'ui', 0.35)),
  c(6, sistematikAt, 'impact', 0.28),
  // 07 · documentation & compliance
  c(7, 40, 'click', 0.3),
  c(7, 150, 'whoosh', 0.35),
  ...[0, 1, 2, 3].map((i) => c(7, 165 + i * 22, 'ui', 0.22)),
  ...[0, 1, 2, 3].map((i) => c(7, COMP_AT(i), 'ui', 0.38)),
  // 08 · one team
  c(8, 0, 'footsteps', 0.45),
  c(8, 0, 'machine_hum', 0.2),
  c(8, titleAt, 'impact', 0.42),
  c(8, titleAt + 2, 'shimmer', 0.35),
];

/** Music ducks ~10 dB under the narration with short ramps. */
const duck = (f: number) => {
  let d = Infinity;
  for (const l of LINES) {
    if (f >= l.from && f <= l.to) return 0.3;
    d = Math.min(d, Math.abs(f - l.from), Math.abs(f - l.to));
  }
  return interpolate(d, [0, 12], [0.3, 1], {extrapolateRight: 'clamp'});
};

export const Soundtrack: React.FC<{music?: number; voice?: number; sfx?: number}> = ({music = 0.55, voice = 1, sfx = 0.7}) => (
  <>
    <Audio src={staticFile('audio/music/score.flac')} volume={(f) => music * duck(f)} />
    {LINES.map((l) => (
      <Sequence key={l.id} name={`VO ${l.id}`} from={l.from} layout="none">
        <Audio src={staticFile(`audio/vo/${l.id}.wav`)} volume={voice} />
      </Sequence>
    ))}
    {CUES.map((q, i) => (
      <Sequence key={i} name={`SFX ${q.sfx}`} from={Math.max(0, q.at)} layout="none">
        <Audio src={staticFile(`audio/sfx/${q.sfx}.wav`)} volume={q.v * sfx} />
      </Sequence>
    ))}
  </>
);
