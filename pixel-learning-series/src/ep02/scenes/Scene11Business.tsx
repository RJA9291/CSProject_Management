import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {OWNER_LOOK} from '../../assets/characters/people';
import {Icon} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {BIG_CLOUD, CAR, PACKET_BACK, SHOP} from '../assets/icons';
import {Chip, TitleCard} from '../components/Cards';
import {DataFlow} from '../components/DataFlow';
import {SkyBackground} from '../components/SkyBackground';
import {Traveller} from '../components/TwoPlaces';
import {SCENES} from '../config/scenes';
import {EP02_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 10;
const CHIPS: [number, number][] = [
  [50, 450],
  [50, 540],
  [800, 450],
  [800, 540],
];

// The same numbers on laptop and phone show the records are synced through the cloud.
const SyncPanel: React.FC<{x: number; y: number; delay: number}> = ({x, y, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 10);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s})`, opacity: frame >= delay ? 1 : 0}}>
      <PixelBox bg={EP02_THEME.white} border={EP02_THEME.navy} padding="6px 14px" shadow={false} borderWidth={6} step={6}>
        <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 24, color: EP02_THEME.navy, lineHeight: 1.3}}>
          STOK: 120
          <br />
          JUALAN: RM850
        </div>
      </PixelBox>
    </div>
  );
};

export const Ep02Scene11Business: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const cfg = SCENES[I];
  const chips = cfg.list ?? [];
  const check = f('stok', 1.4) - 4;
  const phone = f('telefon', 3.8) - 6;
  const anywhere = f('luar', 4.4);
  const caveat = f('selagi', 5) - 2;
  const banner = pop(frame, fps, anywhere, 10);
  return (
    <SceneFrame index={I} background={<SkyBackground />} extraSfx={[{at: anywhere / fps, sfx: 'success'}, {at: caveat / fps, sfx: 'pop'}]}>
      <TitleCard text={cfg.text.headline} size={70} />
      <div style={{position: 'absolute', left: 380, top: 430}}>
        <PixelSprite sprite={BIG_CLOUD} px={8} />
      </div>
      {chips.map((c, i) => (
        <Chip key={c} label={c} x={CHIPS[i][0]} y={CHIPS[i][1]} delay={check + i * 5} bg={[EP02_THEME.blue, EP02_THEME.navy, EP02_THEME.teal, EP02_THEME.purple][i]} size={32} />
      ))}
      <Icon sprite={SHOP} x={40} y={700} px={9} delay={4} bob={0}>
        <div style={{position: 'absolute', left: 30, top: 8 * 9, fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 24, color: EP02_THEME.navy}}>{cfg.text.shop}</div>
      </Icon>
      <Icon sprite={CAR} x={820} y={820} px={9} delay={phone} bob={0} />
      <DataFlow points={[[260, 1060], [260, 700], [460, 600]]} start={check} end={phone} travel={24} every={10} px={5} track={EP02_THEME.white} />
      <DataFlow points={[[470, 620], [260, 700], [260, 1060]]} start={check + 12} end={phone} travel={24} every={10} sprite={PACKET_BACK} px={5} />
      <DataFlow points={[[640, 600], [860, 700], [860, 1060]]} start={phone + 30} end={end} travel={24} every={10} sprite={PACKET_BACK} px={5} track={EP02_THEME.white} />
      <SyncPanel x={250} y={900} delay={check + 8} />
      <SyncPanel x={780} y={940} delay={phone + 36} />
      <Traveller look={OWNER_LOOK} moveAt={phone} fromX={60} toX={590} y={1000} />
      <div style={{position: 'absolute', left: 60, top: 1360, width: 960, transform: `scale(${banner})`, opacity: frame >= anywhere ? 1 : 0}}>
        <PixelBox bg={EP02_THEME.navy} border={EP02_THEME.text} padding="10px 16px" shadow={false}>
          <PixelText text={cfg.text.banner} size={50} color={EP02_THEME.white} emphasis="#FFD36B" effect="none" shadow={false} />
        </PixelBox>
      </div>
      <Chip label={`! ${cfg.text.caveat}`} x={200} y={1480} delay={caveat} bg={EP02_THEME.orange} size={30} />
    </SceneFrame>
  );
};
