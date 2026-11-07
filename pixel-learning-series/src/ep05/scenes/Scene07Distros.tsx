import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {Banner, Reveal, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {PACKAGE} from '../assets/icons';
import {Tux} from '../components/Tux';
import {DISTROS, SCENES} from '../config/scenes';
import {EP05_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 6;
const POS: [number, number][] = [
  [40, 560],
  [555, 560],
  [40, 800],
  [555, 800],
];

export const Ep05Scene07Distros: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const subAt = 10;
  const formulaAt = f('distro', 2.4) - 2;
  const starts = DISTROS.map((d, i) => f(d.cue, 3.5 + i * 1.2) - 4);
  const current = starts.filter((s) => frame >= s).length - 1;
  // Tux stands under the grid and points at the newest card.
  const tuxFlip = current === 0 || current === 2;
  const differ = f('Setiap', 8.6);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[{at: formulaAt / fps, sfx: 'pop'}, ...starts.map((s) => ({at: s / fps, sfx: 'jump' as const})), {at: differ / fps, sfx: 'success'}]}
    >
      <TitleCard text={cfg.text.headline} size={64} />
      <Banner text={cfg.text.sub} top={385} delay={subAt} bg={EP05_THEME.navy} size={36} />
      <Banner text={cfg.text.formula} top={465} delay={formulaAt} bg={EP05_THEME.green} size={36} />
      {DISTROS.map((d, i) => (
        <Reveal key={d.name} delay={starts[i]} mode="pop" style={{left: POS[i][0], top: POS[i][1], width: 485, height: 225}}>
          <PixelBox bg={COLORS.white} border={current === i ? EP05_THEME.red : d.color} padding="12px 16px" style={{height: '100%'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, height: '100%'}}>
              <PixelSprite sprite={PACKAGE('Q')} px={6} palette={{Q: d.color}} />
              <div style={{flex: 1, minWidth: 0}}>
                <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: d.name.length > 10 ? 30 : 42, color: d.color, lineHeight: 1.02}}>{d.name}</div>
                <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 25, color: COLORS.text, lineHeight: 1.1, marginTop: 6}}>{d.note}</div>
              </div>
            </div>
          </PixelBox>
        </Reveal>
      ))}
      <Tux x={tuxFlip ? 560 : 800} y={1120} px={7} pose={frame >= differ ? 'celebrate' : current >= 0 ? 'point' : 'idle'} flip={tuxFlip} enter="right" enterAt={6} />
      <Host scene={I} x={-40} y={1080} pose={frame >= differ ? 'thumbsUp' : 'explain'} />
    </SceneFrame>
  );
};
