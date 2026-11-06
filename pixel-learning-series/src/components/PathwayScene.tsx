import React from 'react';
import {useVideoConfig} from 'remotion';
import type {Pose} from '../assets/characters/host';
import type {SfxCue} from '../config/scenes';
import {SCENES} from '../config/scenes';
import {cueAt, voEnd} from '../lib/timing';
import {CardHeader, CheckList} from './InfographicCard';
import {Host} from './PixelCharacter/Host';
import {PixelBox} from './PixelBox';
import {SceneFrame} from './SceneFrame';

type Props = {
  index: number;
  color: string;
  dark: string;
  pose: Pose;
  // Word in the narration after which the career list starts ticking in.
  listCue: string;
  // Scene-specific illustration in the lower-right stage.
  children: React.ReactNode;
};

// Shared layout for the three pathway scenes (08–10): title plate, career checklist, host and props.
export const PathwayScene: React.FC<Props> = ({index, color, dark, pose, listCue, children}) => {
  const {fps} = useVideoConfig();
  const cfg = SCENES[index];
  const items = cfg.list ?? [];
  const startT = cueAt(index, listCue, 2.5);
  const endT = Math.max(startT + 3, voEnd(index) - 0.8);
  const starts = items.map((_, i) => Math.round((startT + ((endT - startT) * i) / items.length) * fps));
  const blips: SfxCue[] = starts.map((f) => ({at: f / fps, sfx: 'blip'}));
  return (
    <SceneFrame index={index} tint={color} extraSfx={blips}>
      <CardHeader
        number={cfg.text.number}
        title={cfg.text.title}
        color={color}
        dark={dark}
        delay={4}
        size={72}
        style={{position: 'absolute', left: 60, top: 190, width: 960}}
      />
      <div style={{position: 'absolute', left: 60, top: 470, width: 960}}>
        <PixelBox bg="rgba(255,255,255,0.92)" border={dark} padding="28px 40px" shadow={false}>
          <CheckList items={items} starts={starts} size={52} gap={12} />
        </PixelBox>
      </div>
      <Host scene={index} x={-30} y={1060} pose={pose} />
      {children}
    </SceneFrame>
  );
};
