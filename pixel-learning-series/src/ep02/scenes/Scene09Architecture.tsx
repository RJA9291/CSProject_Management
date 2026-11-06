import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {LAPTOP, SERVER, SHIELD} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite, Sprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {APP, BROWSER, DATABASE, FILE, PACKET, PACKET_BACK, PHONE, VM} from '../assets/icons';
import {TitleCard} from '../components/Cards';
import {DataFlow} from '../components/DataFlow';
import {SkyBackground} from '../components/SkyBackground';
import {ARCHITECTURE, SCENES} from '../config/scenes';
import {EP02_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 8;
const FRONT_ICONS: [Sprite, number][] = [
  [LAPTOP, 6],
  [PHONE, 6],
  [BROWSER, 6],
  [APP, 8],
];
const BACK_ICONS: [Sprite, number][] = [
  [SERVER, 4],
  [FILE, 7],
  [DATABASE, 5],
  [VM, 6],
  [SHIELD, 4],
];

const Tile: React.FC<{sprite: Sprite; px: number; label: string; delay: number; dark?: boolean}> = ({sprite, px, label, delay, dark}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 10);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, transform: `scale(${s})`, opacity: frame >= delay ? 1 : 0}}>
      <div style={{height: 110, display: 'flex', alignItems: 'flex-end'}}>
        <PixelSprite sprite={sprite} px={px} />
      </div>
      <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: dark ? EP02_THEME.white : EP02_THEME.navy}}>{label}</div>
    </div>
  );
};

export const Ep02Scene09Architecture: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const cfg = SCENES[I];
  const front = f('Front', 1.8) - 4;
  const frontItems = [f('laptop', 3), front + 14, f('browser', 3.8), front + 20];
  const back = f('Back', 5) - 4;
  const backWords = ['server', 'storage', 'database', 'database', 'keselamatan'];
  const backItems = backWords.map((w, i) => (i === 3 ? f('database', 7) + 8 : f(w, 6 + i * 0.5)) - 2);
  const panel = (d: number) => pop(frame, fps, d, 11);
  return (
    <SceneFrame index={I} background={<SkyBackground />} extraSfx={[{at: front / fps, sfx: 'whoosh'}, {at: back / fps, sfx: 'whoosh'}]}>
      <TitleCard text={cfg.text.headline} size={64} />
      <div style={{position: 'absolute', left: 40, top: 330, width: 1000, transform: `scale(${panel(front)})`, opacity: frame >= front ? 1 : 0}}>
        <PixelBox bg={EP02_THEME.white} border={EP02_THEME.blue} padding="14px 20px">
          <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 32, color: EP02_THEME.blue, textAlign: 'center'}}>{cfg.text.front}</div>
          <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 10}}>
            {FRONT_ICONS.map(([s, px], i) => (
              <Tile key={i} sprite={s} px={px} label={ARCHITECTURE.front[i]} delay={frontItems[i]} />
            ))}
          </div>
        </PixelBox>
      </div>
      <div style={{position: 'absolute', left: 420, top: 790, width: 620, transform: `scale(${panel(back)})`, opacity: frame >= back ? 1 : 0}}>
        <PixelBox bg={EP02_THEME.navy} border={EP02_THEME.text} padding="16px 18px">
          <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 30, color: EP02_THEME.sky, textAlign: 'center'}}>{cfg.text.back}</div>
          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', rowGap: 18, marginTop: 14}}>
            {BACK_ICONS.map(([s, px], i) => (
              <div key={i} style={{width: 180}}>
                <Tile sprite={s} px={px} label={ARCHITECTURE.back[i]} delay={backItems[i]} dark />
              </div>
            ))}
          </div>
        </PixelBox>
      </div>
      {/* Request goes down to the cloud, the result comes back up. */}
      <DataFlow points={[[200, 640], [200, 740], [600, 740], [600, 900]]} start={back + 10} end={end} travel={30} every={20} sprite={PACKET} px={6} track={EP02_THEME.orange} />
      <DataFlow points={[[700, 900], [700, 760], [300, 760], [300, 640]]} start={back + 25} end={end} travel={30} every={20} sprite={PACKET_BACK} px={6} />
      <Host scene={I} x={-90} y={1080} pose="explain" />
    </SceneFrame>
  );
};
