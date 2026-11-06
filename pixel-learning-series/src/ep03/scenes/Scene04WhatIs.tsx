import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon, LAPTOP, ROUTER, SHIELD, SPARKLE} from '../../components/PixelIcons';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {FONTS} from '../../config/theme';
import {snap} from '../../lib/anim';
import {DATABASE, PADLOCK} from '../../ep02/assets/icons';
import {DataFlow} from '../../ep02/components/DataFlow';
import {BUG} from '../assets/icons';
import {Banner, TitleCard} from '../components/Cards';
import {CyberBackground} from '../components/CyberBackground';
import {SCENES} from '../config/scenes';
import {EP03_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 3;
const SHIELD_C: [number, number] = [540, 640];
const DEVICES = [
  {sprite: LAPTOP, x: 90, px: 9, cue: 'sistem'},
  {sprite: ROUTER, x: 420, px: 9, cue: 'rangkaian'},
  {sprite: DATABASE, x: 790, px: 10, cue: 'data'},
];
// Bugs fly at the shield from off-screen and bounce away.
const BUGS = [
  {from: [-120, 470], dir: 1},
  {from: [1180, 520], dir: -1},
  {from: [1180, 380], dir: -1},
];

const Bugs: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  return (
    <>
      {BUGS.map((b, i) => {
        const t0 = start + i * 8;
        const p = interpolate(frame, [t0, t0 + 18], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const back = interpolate(frame, [t0 + 18, t0 + 34], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const hitX = SHIELD_C[0] - b.dir * 200;
        const x = b.from[0] + (hitX - b.from[0]) * p - b.dir * back * 500;
        const y = b.from[1] + (SHIELD_C[1] - 60 - b.from[1]) * p - back * 260;
        return frame < t0 ? null : (
          <div key={i} style={{position: 'absolute', left: snap(x - 48, 4), top: snap(y, 4), opacity: 1 - back, transform: `rotate(${back * 180 * b.dir}deg)`}}>
            <PixelSprite sprite={BUG} px={6} />
          </div>
        );
      })}
    </>
  );
};

export const Ep03Scene04WhatIs: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const labels = cfg.list ?? [];
  const shieldAt = f('melindungi', 1.2) - 4;
  const locks = DEVICES.map((d, i) => f(d.cue, 2 + i * 0.6));
  const threatAt = f('ancaman', 3.8);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[{at: shieldAt / fps, sfx: 'sparkle'}, ...locks.map((l) => ({at: l / fps, sfx: 'click' as const})), {at: (threatAt + 18) / fps, sfx: 'buzz'}]}
    >
      <TitleCard text={cfg.text.headline} size={84} />
      <Banner text={cfg.text.sub} top={420} delay={10} bg={EP03_THEME.blue} size={36} />
      <Icon sprite={SHIELD} x={SHIELD_C[0] - 120} y={520} px={15} delay={shieldAt} bob={6} />
      {DEVICES.map((d, i) => (
        <DataFlow key={i} points={[[SHIELD_C[0], 820], [d.x + 90, 880]]} start={locks[i]} travel={20} every={14} px={4} track={EP03_THEME.blue} />
      ))}
      {DEVICES.map((d, i) => (
        <React.Fragment key={d.cue}>
          <Icon sprite={d.sprite} x={d.x} y={860} px={d.px} delay={6 + i * 4} bob={0} />
          <div style={{position: 'absolute', left: d.x + 100, top: 840, opacity: frame >= locks[i] ? 1 : 0}}>
            <PixelSprite sprite={PADLOCK(frame < locks[i] + 6)} px={5} />
          </div>
          <div style={{position: 'absolute', left: d.x - 30, width: 240, top: 1010, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: frame >= locks[i] ? EP03_THEME.green : '#8E8A80'}}>{labels[i]}</div>
        </React.Fragment>
      ))}
      <Bugs start={threatAt} />
      <Icon sprite={SPARKLE} x={360} y={560} px={7} delay={shieldAt + 8} bob={6} />
      <Icon sprite={SPARKLE} x={700} y={600} px={6} delay={shieldAt + 12} bob={6} phase={20} />
      <Host scene={I} x={-40} y={1080} pose={frame >= threatAt + 30 ? 'thumbsUp' : 'pointRight'} />
    </SceneFrame>
  );
};
