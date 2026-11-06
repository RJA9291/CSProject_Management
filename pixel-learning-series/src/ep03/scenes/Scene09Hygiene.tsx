import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {CHECK, CLOUD, Icon, SPARKLE} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {PADLOCK, PHONE} from '../../ep02/assets/icons';
import {ARROW_UP, DOWNLOAD, FINGERPRINT, UPDATE} from '../assets/icons';
import {TitleCard} from '../components/Cards';
import {CyberBackground} from '../components/CyberBackground';
import {HYGIENE, SCENES} from '../config/scenes';
import {EP03_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 8;
const POS: [number, number][] = [
  [40, 420],
  [555, 420],
  [40, 745],
  [555, 745],
];
const COLORS4 = [EP03_THEME.blue, EP03_THEME.green, EP03_THEME.navy, '#7B4FC9'];

const Art: React.FC<{i: number; start: number}> = ({i, start}) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - start);
  if (i === 0) {
    // Update arrows turn in 90° steps with a progress bar.
    return (
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{transform: `rotate(${Math.floor(t / 6) * 90}deg)`}}>
          <PixelSprite sprite={UPDATE} px={6} />
        </div>
        <div style={{width: 120, height: 22, background: '#DCE3EA'}}>
          <div style={{height: '100%', width: `${Math.min(100, Math.floor(t / 3) * 10)}%`, background: EP03_THEME.green}} />
        </div>
      </div>
    );
  }
  if (i === 1) {
    const dy = -((Math.floor(t / 3) * 6) % 36);
    return (
      <div style={{position: 'relative', width: 200, height: 100}}>
        <div style={{position: 'absolute', left: 30, top: 0}}><PixelSprite sprite={CLOUD} px={7} /></div>
        <div style={{position: 'absolute', left: 84, top: 50 + dy}}><PixelSprite sprite={ARROW_UP} px={4} /></div>
      </div>
    );
  }
  if (i === 2) {
    const dy = (Math.floor(t / 3) * 4) % 16;
    return (
      <div style={{transform: `translateY(${dy}px)`}}>
        <PixelSprite sprite={DOWNLOAD} px={6} />
      </div>
    );
  }
  const ok = t > 18;
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
      <PixelSprite sprite={PHONE} px={5} />
      <PixelSprite sprite={FINGERPRINT} px={5} palette={ok ? undefined : {E: '#9AA0A6'}} />
      <PixelSprite sprite={PADLOCK(!ok)} px={4} />
    </div>
  );
};

export const Ep03Scene09Hygiene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const cfg = SCENES[I];
  const starts = HYGIENE.map((h, i) => f(h.cue, 2 + i * 1.6) - 4);
  return (
    <SceneFrame index={I} background={<CyberBackground navyFrom={Infinity} />} extraSfx={[...starts.map((s) => ({at: s / fps, sfx: 'pop' as const})), {at: (end - 6) / fps, sfx: 'success'}]}>
      <TitleCard text={cfg.text.headline} size={70} />
      {HYGIENE.map((h, i) => {
        const d = starts[i];
        const s = pop(frame, fps, d, 10);
        return (
          <div key={h.title} style={{position: 'absolute', left: POS[i][0], top: POS[i][1], width: 485, height: 305, transform: `scale(${s})`, opacity: frame >= d ? 1 : 0}}>
            <PixelBox bg={COLORS.white} border={COLORS4[i]} padding="14px 18px" style={{height: '100%'}}>
              <div style={{display: 'flex', flexDirection: 'column', height: '100%', gap: 8}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                  <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 34, color: COLORS.white, background: COLORS4[i], padding: '0 12px'}}>{i + 1}</div>
                  <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: h.title.length > 12 ? 30 : 38, color: COLORS4[i], whiteSpace: 'nowrap', lineHeight: 1}}>{h.title}</div>
                </div>
                <div style={{height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Art i={i} start={d} />
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                  <PixelSprite sprite={CHECK} px={4} />
                  <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 30, color: COLORS.text, lineHeight: 1.05, whiteSpace: 'pre-line'}}>{h.desc}</div>
                </div>
              </div>
            </PixelBox>
          </div>
        );
      })}
      <Icon sprite={SPARKLE} x={140} y={1200} px={8} delay={end - 6} bob={6} />
      <Icon sprite={SPARKLE} x={880} y={1240} px={8} delay={end - 2} bob={6} phase={20} />
      <Host scene={I} x={276} y={1080} pose={frame >= end - 6 ? 'thumbsUp' : 'explain'} />
    </SceneFrame>
  );
};
