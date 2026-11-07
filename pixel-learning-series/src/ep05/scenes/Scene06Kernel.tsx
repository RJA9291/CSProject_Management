import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {APP, PACKET, PACKET_BACK} from '../../ep02/assets/icons';
import {DataFlow} from '../../ep02/components/DataFlow';
import {Banner, Reveal, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {CPU, DISK, RAM} from '../assets/icons';
import {buildTux} from '../components/Tux';
import {SCENES} from '../config/scenes';
import {EP05_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 5;
const LX = 40;
const LW = 600;
const LAYERS = [
  {title: 'APPLICATIONS', sub: 'Software & aplikasi', y: 440, bg: EP05_THEME.blue},
  {title: 'LINUX KERNEL', sub: 'Teras sistem operasi', y: 650, bg: EP05_THEME.green},
  {title: 'HARDWARE', sub: 'CPU, memori, storan', y: 860, bg: '#5F666D'},
];

export const Ep05Scene06Kernel: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const cfg = SCENES[I];
  const points = cfg.list ?? [];
  const layerAt = [8, f('Kernel', 0.4) + 4, 16];
  const flowAt = f('software', 6.2) - 6;
  const pointAt = [f('proses', 2.6), f('memori', 3.2), f('peranti', 3.8), f('sumber', 4.4)].map((x) => x - 2);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={0} tone="tech" />}
      extraSfx={[...pointAt.map((p) => ({at: p / fps, sfx: 'blip' as const})), {at: flowAt / fps, sfx: 'link'}, {at: (end - 4) / fps, sfx: 'success'}]}
    >
      <TitleCard text={cfg.text.headline} size={80} />
      <Banner text={cfg.text.flow} top={330} delay={flowAt} bg={EP05_THEME.navy} size={38} />
      {/* Instructions down (yellow) and results back up (green) through the kernel. */}
      <DataFlow points={[[200, 560], [200, 960]]} start={flowAt} every={10} travel={36} sprite={PACKET} px={5} />
      <DataFlow points={[[480, 960], [480, 560]]} start={flowAt + 5} every={10} travel={36} sprite={PACKET_BACK} px={5} />
      {LAYERS.map((l, i) => (
        <Reveal key={l.title} delay={layerAt[i]} mode="pop" style={{left: LX, top: l.y, width: LW, height: 170}}>
          <PixelBox bg={l.bg} border={COLORS.text} padding="14px 20px" style={{height: '100%'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 18, height: '100%'}}>
              <div style={{flex: 1}}>
                <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 46, color: COLORS.white, lineHeight: 1}}>{l.title}</div>
                <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 26, color: '#E6F2FF', marginTop: 6}}>{l.sub}</div>
              </div>
              {i === 0 ? [0, 1, 2].map((k) => <PixelSprite key={k} sprite={APP} px={4} />) : null}
              {i === 1 ? <PixelSprite sprite={buildTux('idle', 0, frame % 90 > 84)} px={4} /> : null}
              {i === 2 ? (
                <>
                  <PixelSprite sprite={CPU} px={5} />
                  <PixelSprite sprite={RAM} px={4} />
                  <PixelSprite sprite={DISK} px={4} />
                </>
              ) : null}
            </div>
          </PixelBox>
        </Reveal>
      ))}
      {points.map((p, i) => {
        const s = pop(frame, fps, pointAt[i], 10);
        return (
          <div key={p} style={{position: 'absolute', left: 670, top: 450 + i * 150, width: 370, transform: `scale(${s})`, opacity: frame >= pointAt[i] ? 1 : 0}}>
            <PixelBox bg={COLORS.white} border={EP05_THEME.green} padding="12px 16px" shadow={false} borderWidth={6}>
              <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: EP05_THEME.navy, lineHeight: 1.1}}>{p}</div>
            </PixelBox>
          </div>
        );
      })}
      <Host scene={I} x={560} y={1080} pose={frame >= end - 4 ? 'thumbsUp' : 'pointLeft'} />
    </SceneFrame>
  );
};
