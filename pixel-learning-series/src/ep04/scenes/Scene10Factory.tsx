import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {CHECK, COMPUTER, SERVER} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {BIG_CLOUD, FILE, PADLOCK} from '../../ep02/assets/icons';
import {DataFlow} from '../../ep02/components/DataFlow';
import {Chip, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {FACTORY, PRINTER} from '../assets/icons';
import {Device, NetLink, routerSprite, switchSprite} from '../components/Net';
import {SCENES} from '../config/scenes';
import {EP04_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 9;
type Pt = [number, number];
const DEPT_COLORS = [EP04_THEME.blue, EP04_THEME.green, EP04_THEME.orange];
const DEPT_X = [60, 395, 730];
const DEPT_Y = 450;
const DEPT_PORT: Pt[] = DEPT_X.map((x) => [x + 145, DEPT_Y + 190]);
const SW: Pt = [540, 760];
const PRN: Pt = [190, 790];
const SRV: Pt = [890, 780];
const RT: Pt = [540, 930];
const NET: Pt = [880, 1230];

export const Ep04Scene10Factory: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f} = useCues(I);
  const cfg = SCENES[I];
  const depts = cfg.list ?? [];
  const deptAt = [f('Production', 2), f('QA', 2.8), f('Maintenance', 3.4)].map((d) => d - 4);
  const linkAt = f('disambungkan', 5.6) - 4;
  const accessAt = f('mengakses', 8.4) - 2;
  const printAt = f('printer', 9.6) - 4;
  const srvAt = f('server', 11.2) - 4;
  const orgAt = f('organisasi', 15) - 8;
  const factory = pop(frame, fps, 4, 10);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[
        ...deptAt.map((d) => ({at: d / fps, sfx: 'pop' as const})),
        {at: linkAt / fps, sfx: 'link'},
        {at: accessAt / fps, sfx: 'click'},
        {at: printAt / fps, sfx: 'blip'},
        {at: srvAt / fps, sfx: 'notify'},
        {at: orgAt / fps, sfx: 'success'},
      ]}
    >
      <TitleCard text={cfg.text.headline} size={64} />
      {/* Factory site outline */}
      <div style={{position: 'absolute', left: 30, top: 380, width: 1020, height: 680, border: `6px dashed ${EP04_THEME.navy}`, boxSizing: 'border-box', transform: `scale(${factory})`, opacity: frame >= 4 ? 1 : 0}}>
        <div style={{position: 'absolute', right: 12, top: 6, display: 'flex', alignItems: 'center', gap: 10}}>
          <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 22, color: EP04_THEME.navy}}>RANGKAIAN KILANG (LAN)</div>
          <PixelSprite sprite={FACTORY} px={3} />
        </div>
      </div>
      {/* Department PCs -> switch */}
      {DEPT_PORT.map((p, i) => (
        <NetLink key={i} a={p} b={SW} start={linkAt + i * 5} okAt={linkAt + 20} packets={frame >= srvAt ? 'both' : 'none'} every={18} />
      ))}
      <NetLink a={PRN} b={SW} start={printAt - 6} okAt={printAt + 10} />
      <NetLink a={SRV} b={SW} start={linkAt + 18} okAt={srvAt} />
      <NetLink a={SW} b={RT} start={linkAt + 22} okAt={orgAt} />
      <NetLink a={RT} b={NET} start={orgAt - 4} okAt={orgAt + 12} packets="both" every={14} />
      <DataFlow points={[DEPT_PORT[1], SW, PRN]} start={printAt + 8} every={20} travel={34} sprite={FILE} px={4} />
      <DataFlow points={[SRV, SW, DEPT_PORT[2]]} start={srvAt + 8} every={20} travel={34} sprite={FILE} px={4} />
      {depts.map((d, i) => (
        <div key={d} style={{position: 'absolute', left: DEPT_X[i], top: DEPT_Y, width: 290, transform: `scale(${pop(frame, fps, deptAt[i], 10)})`, opacity: frame >= deptAt[i] ? 1 : 0}}>
          <PixelBox bg={COLORS.white} border={DEPT_COLORS[i]} padding="8px 10px" shadow={false} borderWidth={6}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4}}>
              <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: d.length > 10 ? 30 : 34, color: DEPT_COLORS[i]}}>{d}</div>
              <PixelSprite sprite={COMPUTER} px={5} />
            </div>
          </PixelBox>
        </div>
      ))}
      <Device sprite={switchSprite(frame)} x={SW[0] - 104} y={SW[1] - 36} px={8} label="SWITCH" delay={linkAt} />
      <Device sprite={PRINTER} x={PRN[0] - 54} y={PRN[1] - 40} px={6} label="PRINTER" delay={printAt - 6} />
      <Device sprite={SERVER} x={SRV[0] - 49} y={SRV[1] - 80} px={7} label="SERVER" delay={linkAt + 18} />
      <Device sprite={routerSprite(frame)} x={RT[0] - 54} y={RT[1] - 40} px={6} label="ROUTER" delay={linkAt + 22} />
      <Device sprite={BIG_CLOUD} x={NET[0] - 120} y={NET[1] - 66} px={6} label="INTERNET" delay={orgAt - 6} labelColor={EP04_THEME.blue} />
      {/* Access follows each department's permissions (not everyone sees everything). */}
      <div style={{position: 'absolute', left: 560, top: 1080, opacity: frame >= accessAt ? 1 : 0, transform: `scale(${pop(frame, fps, accessAt, 10)})`}}>
        <PixelBox bg={COLORS.white} border={EP04_THEME.navy} padding="6px 14px" shadow={false} borderWidth={5} step={6}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <PixelSprite sprite={PADLOCK(false)} px={3} />
            <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 26, color: COLORS.text}}>{cfg.text.access}</div>
          </div>
        </PixelBox>
      </div>
      {frame >= orgAt + 12 ? (
        <div style={{position: 'absolute', left: 620, top: 1380}}>
          <PixelSprite sprite={CHECK} px={8} />
        </div>
      ) : null}
      {frame >= orgAt ? <Chip label="LAN ↔ INTERNET" x={60} y={960} delay={orgAt} bg={EP04_THEME.blue} size={30} /> : null}
      <Host scene={I} x={-60} y={1090} pose={frame >= orgAt + 12 ? 'thumbsUp' : frame >= linkAt ? 'pointRight' : 'explain'} />
    </SceneFrame>
  );
};
