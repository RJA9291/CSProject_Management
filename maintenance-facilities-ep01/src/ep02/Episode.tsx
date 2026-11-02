// Episode 02 – Struktur Organisasi Kilang (same visual identity as Episode 01).
import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {loadFonts} from '../fonts';
import {OpeningTitle, Subtitles} from '../Overlays';
import {E2S1, E2S2, E2S3, E2S4, E2S5, E2S6} from './Scenes';
import {Soundtrack02} from './Soundtrack';
import {LINES, SCENES} from './timeline';

loadFonts();

const COMPS: Record<number, React.FC> = {1: E2S1, 2: E2S2, 3: E2S3, 4: E2S4, 5: E2S5, 6: E2S6};

export const Episode02: React.FC<{audio: boolean; subtitles?: boolean}> = ({audio, subtitles = true}) => (
  <AbsoluteFill style={{background: '#000'}}>
    {SCENES.map((s) => {
      const C = COMPS[s.id];
      return (
        <Sequence key={s.id} name={`E2 ${String(s.id).padStart(2, '0')} · ${s.name}`} from={s.from} durationInFrames={s.len}>
          <C />
        </Sequence>
      );
    })}
    <OpeningTitle from={24} to={200} kicker="DI SEBALIK OPERASI KILANG · EPISODE 02" title={['STRUKTUR', 'ORGANISASI KILANG']} sub="Perjalanan seorang technician baharu mengenali setiap jabatan" />
    {subtitles && <Subtitles lines={LINES} />}
    {audio && <Soundtrack02 />}
  </AbsoluteFill>
);

export const Episode02Scene: React.FC<{id: number}> = ({id}) => {
  const C = COMPS[id];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <C />
    </AbsoluteFill>
  );
};
