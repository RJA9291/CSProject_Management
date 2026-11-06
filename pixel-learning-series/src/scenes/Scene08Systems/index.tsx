import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {PathwayScene} from '../../components/PathwayScene';
import {CLOUD, COMPUTER, Icon, SERVER} from '../../components/PixelIcons';
import {COLORS} from '../../config/theme';
import {cueAt} from '../../lib/timing';

const I = 7;

export const Scene08Systems: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const server = Math.round(cueAt(I, 'server', 3.0) * fps) - 4;
  const cloud = Math.round(cueAt(I, 'cloud', 3.6) * fps) - 4;
  const db = Math.round(cueAt(I, 'database', 4.6) * fps) - 4;
  // Server LEDs blink by swapping palette entries.
  const blink = Math.floor(frame / 6) % 2 === 0;
  const leds = blink ? {E: '#39A86B', O: '#F4A51C'} : {E: '#1F6B43', O: '#F4C430'};
  return (
    <PathwayScene index={I} color={COLORS.blue} dark={COLORS.navy} pose="pointRight" listCue="Kalau">
      <Icon sprite={CLOUD} x={660} y={1090} px={14} delay={cloud} bob={12} />
      <Icon sprite={SERVER} x={590} y={1290} px={11} delay={server} bob={0} palette={leds} />
      <Icon sprite={SERVER} x={770} y={1290} px={11} delay={server + 5} bob={0} palette={blink ? {E: '#1F6B43'} : undefined} />
      <Icon sprite={COMPUTER} x={920} y={1390} px={7} delay={db} bob={6} />
    </PathwayScene>
  );
};
