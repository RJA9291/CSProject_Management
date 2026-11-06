import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CLOUD} from '../../components/PixelIcons';
import {Host} from '../../components/PixelCharacter/Host';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SpeechBubble} from '../../components/SpeechBubble';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {HOUSE, office, PADLOCK} from '../assets/icons';
import {TitleCard} from '../components/Cards';
import {SkyBackground} from '../components/SkyBackground';
import {DEPLOYMENT_MODELS, SCENES} from '../config/scenes';
import {EP02_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 7;
const CARD_COLORS = [EP02_THEME.blue, EP02_THEME.green, EP02_THEME.orange, EP02_THEME.purple];
const CUE_WORDS = ['Public', 'Private', 'Hybrid', 'Community'];
const POS: [number, number][] = [
  [40, 400],
  [550, 400],
  [40, 750],
  [550, 750],
];

// Small pixel scene per deployment model.
const Scene: React.FC<{i: number}> = ({i}) => {
  const row = (children: React.ReactNode) => <div style={{display: 'flex', alignItems: 'flex-end', gap: 6, height: 120}}>{children}</div>;
  if (i === 0)
    return row(
      <>
        <PixelSprite sprite={office('U', 'u', 14, 22)} px={5} />
        <div style={{marginBottom: 50}}>
          <PixelSprite sprite={CLOUD} px={5} />
        </div>
        <PixelSprite sprite={office('V', 'u', 12, 16)} px={5} />
      </>,
    );
  if (i === 1)
    return row(
      <>
        <PixelSprite sprite={office('E', 'e', 14, 22)} px={5} />
        <PixelSprite sprite={PADLOCK(false)} px={5} />
      </>,
    );
  if (i === 2)
    return row(
      <>
        <PixelSprite sprite={office('U', 'u', 12, 20)} px={5} />
        <div style={{width: 50, height: 10, marginBottom: 50, background: `repeating-linear-gradient(90deg, ${COLORS.text} 0 10px, transparent 10px 16px)`}} />
        <PixelSprite sprite={office('E', 'e', 12, 20)} px={5} />
      </>,
    );
  return row(
    <>
      <PixelSprite sprite={HOUSE} px={3} />
      <PixelSprite sprite={office('P', 'p', 10, 16)} px={5} />
      <PixelSprite sprite={HOUSE} px={3} />
    </>,
  );
};

export const Ep02Scene08Deployment: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f} = useCues(I);
  const cfg = SCENES[I];
  const starts = CUE_WORDS.map((w, i) => f(w, 2 + i * 0.8) - 4);
  const note = f('keperluan', 5.6) - 4;
  return (
    <SceneFrame index={I} background={<SkyBackground />} extraSfx={starts.map((s) => ({at: s / fps, sfx: 'pop' as const}))}>
      <TitleCard text={cfg.text.headline} size={70} />
      {DEPLOYMENT_MODELS.map((m, i) => {
        const s = pop(frame, fps, starts[i], 9);
        return (
          <div key={m.name} style={{position: 'absolute', left: POS[i][0], top: POS[i][1], width: 490, height: 330, transform: `scale(${s})`, opacity: frame >= starts[i] ? 1 : 0}}>
            <PixelBox bg={EP02_THEME.white} border={CARD_COLORS[i]} padding="0" borderWidth={10} style={{height: '100%'}}>
              <div style={{background: CARD_COLORS[i], padding: '8px 16px', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 36, color: EP02_THEME.white, whiteSpace: 'nowrap'}}>
                {i + 1}. {m.name}
              </div>
              <div style={{padding: '10px 18px', display: 'flex', flexDirection: 'column', gap: 6}}>
                <Scene i={i} />
                <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 28, color: COLORS.text, lineHeight: 1.15}}>{m.desc}</div>
                {m.example ? <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 26, color: COLORS.red}}>{m.example}</div> : null}
              </div>
            </PixelBox>
          </div>
        );
      })}
      <Host scene={I} x={-40} y={1100} pose="pointRight" />
      <SpeechBubble delay={note} tail="left" tailOffset={30} style={{position: 'absolute', left: 480, top: 1190, width: 560}} padding="16px 20px">
        <PixelText text={cfg.text.note} size={44} effect="none" shadow={false} />
      </SpeechBubble>
    </SceneFrame>
  );
};
