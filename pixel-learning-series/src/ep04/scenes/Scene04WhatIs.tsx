import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {COMPUTER, LAPTOP} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {RichLine} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {FILE} from '../../ep02/assets/icons';
import {DataFlow} from '../../ep02/components/DataFlow';
import {TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {PRINTER} from '../assets/icons';
import {Device, NetLink, switchSprite} from '../components/Net';
import {SCENES} from '../config/scenes';
import {EP04_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 3;
// Device anchor points (where cables attach).
const PC1: [number, number] = [190, 720];
const PC2: [number, number] = [890, 720];
const SW: [number, number] = [540, 830];
const PRN: [number, number] = [860, 960];
const LAP: [number, number] = [610, 1000];

export const Ep04Scene04WhatIs: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f} = useCues(I);
  const cfg = SCENES[I];
  const defAt = f('sistem', 1.4) - 4;
  const cableAt = f('menghubungkan', 2.0);
  const swAt = f('berkomunikasi', 3.6) - 4;
  const dataAt = f('data', 4.6);
  const prnAt = f('printer', 6.4) - 4;
  const fileAt = f('fail', 7.2);
  const def = pop(frame, fps, defAt, 10);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[
        {at: defAt / fps, sfx: 'pop'},
        {at: cableAt / fps, sfx: 'link'},
        {at: swAt / fps, sfx: 'link'},
        {at: dataAt / fps, sfx: 'blip'},
        {at: prnAt / fps, sfx: 'link'},
        {at: fileAt / fps, sfx: 'success'},
      ]}
    >
      <TitleCard text={cfg.text.headline} size={62} />
      <div style={{position: 'absolute', left: 40, top: 360, width: 1000, transform: `scale(${def})`, opacity: frame >= defAt ? 1 : 0}}>
        <PixelBox bg={COLORS.white} border={EP04_THEME.blue} padding="12px 22px" shadow={false}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: COLORS.text, lineHeight: 1.1, textAlign: 'center', whiteSpace: 'pre-line'}}>
            {cfg.text.definition.split('\n').map((l) => (
              <div key={l}>
                <RichLine line={l} />
              </div>
            ))}
          </div>
          <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 27, color: EP04_THEME.navy, lineHeight: 1.15, textAlign: 'center', marginTop: 8}}>{cfg.text.malay}</div>
        </PixelBox>
      </div>
      {/* Two PCs joined directly, then a switch lets more devices join. */}
      <NetLink a={PC1} b={PC2} start={cableAt} dur={14} until={swAt} packets="both" every={14} />
      <NetLink a={PC1} b={SW} start={swAt} okAt={dataAt} packets="both" />
      <NetLink a={PC2} b={SW} start={swAt + 4} okAt={dataAt} packets="both" />
      <NetLink a={LAP} b={SW} start={swAt + 10} okAt={dataAt} />
      <NetLink a={PRN} b={SW} start={prnAt} okAt={prnAt + 12} />
      <DataFlow points={[PC1, SW, PRN]} start={prnAt + 14} every={18} travel={34} sprite={FILE} px={4} />
      <DataFlow points={[PC2, SW, LAP]} start={fileAt} every={18} travel={34} sprite={FILE} px={4} />
      <Device sprite={COMPUTER} x={PC1[0] - 108} y={PC1[1] - 110} px={6} label="PC 1" delay={8} />
      <Device sprite={COMPUTER} x={PC2[0] - 54} y={PC2[1] - 110} px={6} label="PC 2" delay={12} />
      <Device sprite={switchSprite(frame)} x={SW[0] - 104} y={SW[1] - 36} px={8} label="SWITCH" delay={swAt} />
      <Device sprite={LAPTOP} x={LAP[0] - 66} y={LAP[1] - 40} px={6} label="LAPTOP" delay={swAt + 10} />
      <Device sprite={PRINTER} x={PRN[0] - 54} y={PRN[1] - 40} px={6} label="PRINTER" delay={prnAt} />
      <Host scene={I} x={-60} y={1090} pose={frame >= fileAt ? 'thumbsUp' : 'pointRight'} />
    </SceneFrame>
  );
};
