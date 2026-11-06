import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {PHONE} from '../../ep02/assets/icons';
import {BANK, FOLDER, HANDSET, POLICE, WARNING} from '../assets/icons';
import {Banner, InfoRow, Reveal, TitleCard} from '../components/Cards';
import {CyberBackground} from '../components/CyberBackground';
import {ACTIONS, SCENES} from '../config/scenes';
import {EP03_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 9;
const ICONS = [BANK, HANDSET, POLICE, FOLDER];
const ROW_COLORS = [EP03_THEME.blue, EP03_THEME.red, EP03_THEME.navy, EP03_THEME.orange];

export const Ep03Scene10Victim: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const cfg = SCENES[I];
  const subAt = f('jangan', 2.2) - 2;
  const starts = ACTIONS.map((a, i) => f(a.cue, 3.5 + i * 2) - 4);
  const alertScale = pop(frame, fps, 8, 10);
  // The unknown-transaction alert gives way to the action list.
  const alertGone = frame >= starts[0] - 2;
  const flash = Math.floor(frame / 6) % 2 === 0;
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={0} navyUntil={starts[0]} alarmFrom={6} alarmUntil={starts[0] - 4} />}
      extraSfx={[{at: 8 / fps, sfx: 'notify'}, {at: subAt / fps, sfx: 'pop'}, ...starts.map((s) => ({at: s / fps, sfx: 'blip' as const})), {at: (end - 4) / fps, sfx: 'success'}]}
    >
      <TitleCard text={cfg.text.headline} size={70} />
      <Banner text={cfg.text.sub} top={330} delay={subAt} />
      {!alertGone ? (
        <div style={{position: 'absolute', left: 120, top: 470, width: 840, transform: `scale(${alertScale})`, opacity: frame >= 8 ? 1 : 0}}>
          <PixelBox bg={COLORS.white} border={EP03_THEME.red} padding="20px 24px">
            <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
              <PixelSprite sprite={PHONE} px={7} />
              <div>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <PixelSprite sprite={WARNING} px={3} />
                  <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 26, color: EP03_THEME.red}}>{cfg.text.alert}</div>
                </div>
                <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, color: flash ? EP03_THEME.red : COLORS.text, lineHeight: 1.1}}>{cfg.text.amount}</div>
                <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 30, color: '#6B7480'}}>Contoh fiksyen • Akaun simpanan</div>
              </div>
            </div>
          </PixelBox>
        </div>
      ) : null}
      {ACTIONS.map((a, i) => (
        <Reveal key={a.title} delay={starts[i]} mode="slideLeft" style={{left: 40, top: 430 + i * 160, width: 1000}}>
          <InfoRow
            color={ROW_COLORS[i]}
            height={146}
            number={String(i + 1)}
            icon={<PixelSprite sprite={ICONS[i]} px={5} />}
            title={a.title}
            desc={a.desc}
            titleSize={46}
            descSize={28}
            right={
              a.big ? (
                <div style={{marginRight: 18, padding: '0 16px', background: EP03_THEME.red, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 84, color: COLORS.white, lineHeight: 1.1, transform: `scale(${pop(frame, fps, starts[i] + 8, 8)})`}}>
                  {a.big}
                </div>
              ) : null
            }
          />
        </Reveal>
      ))}
      <div style={{position: 'absolute', left: 560, top: 1110, width: 480, opacity: frame >= starts[3] + 10 ? 1 : 0}}>
        <PixelBox bg={COLORS.white} border={EP03_THEME.navy} padding="10px 16px" shadow={false} borderWidth={6}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 28, color: COLORS.text, lineHeight: 1.15, whiteSpace: 'pre-line'}}>{cfg.text.note}</div>
        </PixelBox>
      </div>
      {!alertGone ? <Icon sprite={WARNING} x={850} y={420} px={6} delay={10} bob={8} /> : null}
      <Host
        scene={I}
        x={-40}
        y={1080}
        pose={frame >= starts[0] ? 'pointRight' : 'think'}
        expression={frame >= starts[0] ? undefined : 'confused'}
      />
    </SceneFrame>
  );
};
