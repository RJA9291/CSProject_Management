import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {COMPUTER, LAPTOP} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {snap} from '../../lib/anim';
import {PACKET, PHONE} from '../../ep02/assets/icons';
import {Reveal, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {CITY, GLOBE} from '../assets/icons';
import {routerSprite, switchSprite, wifiSprite} from '../components/Net';
import {NET_TYPES, SCENES} from '../config/scenes';
import {EP04_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 4;
const CARD_COLORS = [EP04_THEME.blue, EP04_THEME.navy, EP04_THEME.teal];
const ART_W = 330;
const ART_H = 200;

const abs = (x: number, y: number, child: React.ReactNode) => <div style={{position: 'absolute', left: x, top: y}}>{child}</div>;

// Small animated illustration per network type.
const Art: React.FC<{i: number; start: number}> = ({i, start}) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - start);
  if (i === 0) {
    // Three PCs on one switch inside a building outline.
    return (
      <div style={{position: 'relative', width: ART_W, height: ART_H, border: `6px dashed ${EP04_THEME.blue}`, boxSizing: 'border-box'}}>
        {[0, 1, 2].map((k) => abs(18 + k * 100, 14, <PixelSprite sprite={COMPUTER} px={4} />))}
        {[0, 1, 2].map((k) => (
          <div key={k} style={{position: 'absolute', left: 52 + k * 100, top: 86, width: 6, height: 44, background: t > 6 + k * 3 ? EP04_THEME.green : COLORS.text}} />
        ))}
        {abs(70, 128, <PixelSprite sprite={switchSprite(frame)} px={7} />)}
        <div style={{position: 'absolute', right: 6, bottom: 2, fontFamily: FONTS.pixel, fontSize: 18, color: EP04_THEME.blue}}>PEJABAT</div>
      </div>
    );
  }
  if (i === 1) {
    // Two cities linked across a long distance.
    const x = 70 + ((t * 6) % 190);
    return (
      <div style={{position: 'relative', width: ART_W, height: ART_H}}>
        {abs(0, 70, <PixelSprite sprite={CITY('U')} px={5} />)}
        {abs(240, 70, <PixelSprite sprite={CITY('V')} px={5} />)}
        <div style={{position: 'absolute', left: 80, top: 100, width: 170, height: 6, background: `repeating-linear-gradient(90deg, ${EP04_THEME.blue} 0 12px, transparent 12px 20px)`}} />
        {abs(140, 0, <PixelSprite sprite={GLOBE} px={3} />)}
        {abs(snap(x, 4), 92, <PixelSprite sprite={PACKET} px={4} />)}
        <div style={{position: 'absolute', left: 0, bottom: 4, fontFamily: FONTS.pixel, fontSize: 18, color: EP04_THEME.navy}}>KL</div>
        <div style={{position: 'absolute', right: 0, bottom: 4, fontFamily: FONTS.pixel, fontSize: 18, color: EP04_THEME.navy}}>PENANG</div>
      </div>
    );
  }
  return (
    <div style={{position: 'relative', width: ART_W, height: ART_H}}>
      {abs(110, 70, <PixelSprite sprite={routerSprite(frame)} px={6} />)}
      {abs(124, 0, <PixelSprite sprite={wifiSprite(frame, start)} px={5} />)}
      {abs(0, 110, <PixelSprite sprite={LAPTOP} px={4} />)}
      {abs(270, 90, <PixelSprite sprite={PHONE} px={5} />)}
    </div>
  );
};

export const Ep04Scene05Types: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const starts = NET_TYPES.map((n, i) => f(n.cue, 2.5 + i * 2.5) - 4);
  return (
    <SceneFrame index={I} background={<CyberBackground navyFrom={Infinity} />} extraSfx={starts.map((s) => ({at: s / fps, sfx: 'link' as const}))}>
      <TitleCard text={cfg.text.headline} size={78} />
      {NET_TYPES.map((n, i) => (
        <Reveal key={n.title} delay={starts[i]} mode={i % 2 ? 'slideRight' : 'slideLeft'} style={{left: 40, top: 330 + i * 245, width: 1000, height: 230}}>
          <PixelBox bg={COLORS.white} border={CARD_COLORS[i]} padding="10px 18px" style={{height: '100%'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 20, height: '100%'}}>
              <Art i={i} start={starts[i]} />
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 70, color: CARD_COLORS[i], lineHeight: 0.95}}>{n.title}</div>
                <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: EP04_THEME.red, lineHeight: 1.1}}>{n.full}</div>
                <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 26, color: COLORS.text, lineHeight: 1.12, marginTop: 6}}>{n.desc}</div>
              </div>
            </div>
          </PixelBox>
        </Reveal>
      ))}
      <Host scene={I} x={-40} y={1080} pose={frame >= starts[2] ? 'pointRight' : 'explain'} />
    </SceneFrame>
  );
};
