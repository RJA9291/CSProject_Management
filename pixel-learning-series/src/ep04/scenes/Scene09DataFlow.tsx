import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {LAPTOP, SERVER} from '../../components/PixelIcons';
import {SceneFrame} from '../../components/SceneFrame';
import {FONTS} from '../../config/theme';
import {BIG_CLOUD, PACKET, PACKET_BACK} from '../../ep02/assets/icons';
import {DataFlow} from '../../ep02/components/DataFlow';
import {Chip, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {Device, NetLink, routerSprite, switchSprite} from '../components/Net';
import {SCENES} from '../config/scenes';
import {EP04_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 8;
type Pt = [number, number];
// Snake layout: device -> switch/AP -> router (top row), internet -> server (bottom row).
const NODES: Pt[] = [
  [170, 560],
  [540, 560],
  [900, 560],
  [900, 880],
  [470, 880],
];

export const Ep04Scene09DataFlow: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const labels = cfg.list ?? [];
  const pAt = f('peranti', 1.6) - 4;
  const reqAt = f('menghantar', 2.4) - 2;
  const swAt = f('switch', 5.2) - 4;
  const rAt = f('router', 5.8) - 4;
  const netAt = f('sebelum', 6.4) - 4;
  const srvAt = f('server', 7.4) - 4;
  const procAt = f('memproses', 8.6);
  const respAt = f('respons', 9.8) - 4;
  const appear = [pAt, swAt, rAt, netAt, srvAt];
  const busy = frame >= procAt && frame < respAt;
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={0} tone="tech" />}
      extraSfx={[...appear.map((a) => ({at: a / fps, sfx: 'pop' as const})), {at: reqAt / fps, sfx: 'link'}, {at: procAt / fps, sfx: 'blip'}, {at: respAt / fps, sfx: 'success'}]}
    >
      <TitleCard text={cfg.text.headline} size={72} />
      {NODES.slice(1).map((n, i) => (
        <NetLink key={i} a={NODES[i]} b={n} start={appear[i + 1]} color={EP04_THEME.cyan} />
      ))}
      {/* Request out (yellow) hop by hop, response back (green) once the server answers. */}
      <DataFlow points={NODES.slice(0, 2)} start={Math.max(reqAt, swAt + 12)} every={12} travel={18} sprite={PACKET} px={5} />
      <DataFlow points={NODES.slice(1, 3)} start={rAt + 12} every={12} travel={18} sprite={PACKET} px={5} />
      <DataFlow points={NODES.slice(2, 4)} start={netAt + 12} every={12} travel={18} sprite={PACKET} px={5} />
      <DataFlow points={NODES.slice(3, 5)} start={srvAt + 12} end={respAt} every={12} travel={18} sprite={PACKET} px={5} />
      <DataFlow points={[...NODES].reverse()} start={respAt} every={10} travel={60} sprite={PACKET_BACK} px={5} />
      <Device sprite={LAPTOP} x={NODES[0][0] - 99} y={NODES[0][1] - 70} px={9} label={labels[0]} delay={appear[0]} dark />
      <Device sprite={switchSprite(frame)} x={NODES[1][0] - 104} y={NODES[1][1] - 36} px={8} label={labels[1]} delay={appear[1]} dark />
      <Device sprite={routerSprite(frame)} x={NODES[2][0] - 81} y={NODES[2][1] - 70} px={9} label={labels[2]} delay={appear[2]} dark />
      <Device sprite={BIG_CLOUD} x={NODES[3][0] - 120} y={NODES[3][1] - 66} px={6} label={labels[3]} delay={appear[3]} dark />
      <Device
        sprite={SERVER}
        x={NODES[4][0] - 63}
        y={NODES[4][1] - 90}
        px={9}
        label={labels[4]}
        delay={appear[4]}
        dark
        palette={busy && Math.floor(frame / 4) % 2 ? {E: '#F4A51C', O: '#36A86B'} : undefined}
      />
      <Chip label={`${cfg.text.request} →`} x={60} y={700} delay={reqAt} bg="#F4A51C" color="#171717" size={34} font="pixel" />
      <Chip label={`← ${cfg.text.response}`} x={620} y={1060} delay={respAt} bg={EP04_THEME.green} size={34} font="pixel" />
      <div style={{position: 'absolute', left: 560, top: 1180, width: 480, textAlign: 'right', fontFamily: FONTS.heading, fontWeight: 700, fontSize: 26, color: EP04_THEME.cyan, opacity: frame >= respAt ? 1 : 0}}>
        * {cfg.text.note}
      </div>
      <Host scene={I} x={-60} y={1090} pose={frame >= respAt ? 'thumbsUp' : 'explain'} />
    </SceneFrame>
  );
};
