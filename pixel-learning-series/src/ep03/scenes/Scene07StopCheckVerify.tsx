import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon, SHIELD} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {float, pop} from '../../lib/anim';
import {MAGNIFIER, STOP_HAND, VERIFIED} from '../assets/icons';
import {InfoRow, Reveal} from '../components/Cards';
import {CyberBackground} from '../components/CyberBackground';
import {SCENES, STEPS} from '../config/scenes';
import {EP03_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 6;
const COLORS3 = [EP03_THEME.red, EP03_THEME.blue, EP03_THEME.green];
const ICONS = [STOP_HAND, MAGNIFIER, VERIFIED];

const StepIcon: React.FC<{i: number; start: number}> = ({i, start}) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  // Stop hand pulses, the magnifier scans, the tick pops.
  const dx = i === 1 ? Math.round(Math.sin(t / 6) * 3) * 4 : 0;
  const s = i === 0 ? 1 + (Math.floor(t / 10) % 2 ? 0.08 : 0) : 1;
  return (
    <div style={{transform: `translateX(${dx}px) scale(${s})`}}>
      <PixelSprite sprite={ICONS[i]} px={8} />
    </div>
  );
};

export const Ep03Scene07StopCheckVerify: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f} = useCues(I);
  const words = SCENES[I].text.headline.split('•').map((w) => w.trim());
  const starts = STEPS.map((s, i) => f(s.cue, 2.5 + i * 3.5) - 4);
  const done = f('rasmi', starts[2] / fps + 2);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[
        ...starts.map((s, i) => ({at: s / fps, sfx: (i === 0 ? 'buzz' : i === 1 ? 'blip' : 'success') as 'buzz' | 'blip' | 'success'})),
      ]}
    >
      {/* Heading: each word lights up in its colour as the step is named. */}
      <div style={{position: 'absolute', top: 170, left: 40, width: 1000, transform: `scale(${pop(frame, fps, 2, 10)})`}}>
        <PixelBox bg={COLORS.white} border={EP03_THEME.navy} padding="18px 10px">
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 58, whiteSpace: 'nowrap'}}>
            {words.map((w, i) => (
              <React.Fragment key={w}>
                {i > 0 ? <span style={{color: COLORS.text}}>•</span> : null}
                <span style={{color: frame >= starts[i] ? COLORS3[i] : '#B8B2A6', transform: `scale(${frame >= starts[i] ? pop(frame, fps, starts[i], 8) : 1})`, display: 'inline-block'}}>{w}</span>
              </React.Fragment>
            ))}
          </div>
        </PixelBox>
      </div>
      {STEPS.map((s, i) => (
        <Reveal key={s.title} delay={starts[i]} mode="pop" style={{left: 40, top: 370 + i * 228, width: 1000}}>
          <InfoRow
            color={COLORS3[i]}
            height={208}
            number={String(i + 1)}
            icon={<StepIcon i={i} start={starts[i]} />}
            title={s.title}
            desc={s.desc}
            titleSize={64}
            descSize={34}
          />
        </Reveal>
      ))}
      <Icon sprite={SHIELD} x={110} y={1160 + float(frame, 6, 50)} px={11} delay={done} bob={0} />
      <Host scene={I} x={500} y={1080} pose={frame >= done ? 'thumbsUp' : frame >= starts[0] ? 'pointLeft' : 'explain'} />
    </SceneFrame>
  );
};
