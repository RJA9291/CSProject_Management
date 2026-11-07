import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {LAPTOP} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {Banner, Reveal, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {NIC} from '../assets/icons';
import {Device, NetLink} from '../components/Net';
import {ADDRESSES, SCENES} from '../config/scenes';
import {EP04_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 6;
const COLS = [EP04_THEME.blue, EP04_THEME.teal];
const CARD_X = [40, 550];
const CARD_TOP = 660;

export const Ep04Scene07IPMAC: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const starts = ADDRESSES.map((a, i) => f(a.cue, 1 + i * 4.5) - 4);
  const nicAt = f('interface', 7.2) - 4;
  const bothAt = f('Senang', 9.6) - 2;
  // Typed-out address examples.
  const typed = (text: string, from: number) => text.slice(0, Math.max(0, Math.floor((frame - from) / 1.5)));
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[...starts.map((s) => ({at: s / fps, sfx: 'pop' as const})), {at: nicAt / fps, sfx: 'blip'}, {at: bothAt / fps, sfx: 'success'}]}
    >
      <TitleCard text={cfg.text.headline} size={72} />
      <Device sprite={LAPTOP} x={410} y={400} px={12} delay={6} />
      <Device sprite={NIC} x={810} y={470} px={6} label="NIC" delay={nicAt} labelColor={EP04_THEME.teal} />
      <NetLink a={[480, 600]} b={[CARD_X[0] + 245, CARD_TOP]} start={starts[0]} color={COLS[0]} />
      <NetLink a={[860, 560]} b={[CARD_X[1] + 245, CARD_TOP]} start={starts[1]} color={COLS[1]} />
      {ADDRESSES.map((a, i) => (
        <Reveal key={a.title} delay={starts[i]} mode="pop" style={{left: CARD_X[i], top: CARD_TOP, width: 490, height: 340}}>
          <PixelBox bg={COLORS.white} border={COLS[i]} padding="14px 18px" style={{height: '100%'}}>
            <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 48, color: COLS[i], lineHeight: 1}}>{a.title}</div>
            <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: COLORS.text, marginTop: 8, lineHeight: 1.1}}>{a.what}</div>
            <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 24, color: '#6B7480', marginTop: 4}}>{a.layer}</div>
            <div style={{marginTop: 14, background: EP04_THEME.navy, padding: '10px 12px'}}>
              <div style={{fontFamily: FONTS.pixel, fontSize: 18, color: EP04_THEME.cyan}}>CONTOH</div>
              <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: i === 0 ? 40 : 30, color: COLORS.white, whiteSpace: 'nowrap', height: 46}}>{typed(a.example, starts[i] + 10)}</div>
            </div>
          </PixelBox>
        </Reveal>
      ))}
      <Banner text={cfg.text.both} top={1020} delay={bothAt} bg={EP04_THEME.navy} size={40} />
      <Host scene={I} x={276} y={1100} pose={frame >= bothAt ? 'thumbsUp' : frame >= starts[1] ? 'pointRight' : 'pointLeft'} />
    </SceneFrame>
  );
};
