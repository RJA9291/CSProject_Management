import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon} from '../../components/PixelIcons';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {FONTS} from '../../config/theme';
import {float} from '../../lib/anim';
import {FILE, PADLOCK} from '../../ep02/assets/icons';
import {BAD_APP, BUG, ENVELOPE, HOOK, IDCARD, WARNING} from '../assets/icons';
import {InfoRow, Reveal, TitleCard} from '../components/Cards';
import {CyberBackground} from '../components/CyberBackground';
import {SCENES, THREATS} from '../config/scenes';
import {EP03_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 4;

// Each threat's little animated illustration inside its card.
const Art: React.FC<{i: number; start: number}> = ({i, start}) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  const bob = float(frame, 6, 40, i * 10);
  if (i === 0) {
    // Hook dips onto the envelope and lifts the ID card away.
    const lift = t > 20 ? Math.min(40, (t - 20) * 3) : 0;
    return (
      <div style={{position: 'relative', width: 170, height: 170}}>
        <div style={{position: 'absolute', left: 14, top: 86}}><PixelSprite sprite={ENVELOPE} px={5} /></div>
        <div style={{position: 'absolute', left: 92, top: 8 - lift + bob}}><PixelSprite sprite={HOOK} px={5} /></div>
        <div style={{position: 'absolute', left: 64, top: 74 - lift, opacity: t > 20 ? 1 : 0}}><PixelSprite sprite={IDCARD} px={3} /></div>
      </div>
    );
  }
  if (i === 1) {
    return (
      <div style={{position: 'relative', width: 170, height: 170}}>
        <div style={{position: 'absolute', left: 20, top: 70}}><PixelSprite sprite={BAD_APP} px={6} /></div>
        <div style={{position: 'absolute', left: 80, top: 14 + bob}}><PixelSprite sprite={BUG} px={5} /></div>
      </div>
    );
  }
  const locked = t > 14;
  return (
    <div style={{position: 'relative', width: 170, height: 170}}>
      <div style={{position: 'absolute', left: 14, top: 40}}><PixelSprite sprite={FILE} px={8} /></div>
      <div style={{position: 'absolute', left: 92, top: 70}}><PixelSprite sprite={PADLOCK(!locked)} px={5} /></div>
    </div>
  );
};

// Ransom note flashing on the ransomware card.
const Ransom: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  if (frame < start + 14) return null;
  const on = Math.floor((frame - start) / 8) % 2 === 0;
  return (
    <div style={{marginRight: 20, padding: '8px 12px', background: on ? EP03_THEME.red : EP03_THEME.navy, fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 26, color: EP03_THEME.white, textAlign: 'center', lineHeight: 1.1}}>
      BAYAR
      <br />
      TEBUSAN!
    </div>
  );
};

export const Ep03Scene05Threats: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const starts = THREATS.map((t, i) => f(t.cue, 2 + i * 3) - 4);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={0} alarmFrom={4} alarmUntil={28} />}
      extraSfx={[...starts.map((s) => ({at: s / fps, sfx: 'whoosh' as const})), ...starts.map((s) => ({at: (s + 14) / fps, sfx: 'alert' as const}))]}
    >
      <TitleCard text={cfg.text.headline} size={80} />
      {THREATS.map((t, i) => (
        <Reveal key={t.title} delay={starts[i]} mode={i % 2 ? 'slideRight' : 'slideLeft'} style={{left: 40, top: 430 + i * 215, width: 1000}}>
          <InfoRow
            color={EP03_THEME.red}
            border={EP03_THEME.red}
            height={196}
            icon={<Art i={i} start={starts[i]} />}
            title={t.title}
            desc={t.desc}
            titleSize={56}
            descSize={30}
            right={i === 2 ? <Ransom start={starts[i]} /> : null}
          />
        </Reveal>
      ))}
      <Icon sprite={WARNING} x={720} y={1180} px={10} delay={starts[0]} bob={10} />
      <Icon sprite={WARNING} x={930} y={1300} px={6} delay={starts[1]} bob={10} phase={30} />
      <Host scene={I} x={-40} y={1080} pose={frame >= starts[0] ? 'warn' : 'explain'} expression="confused" />
    </SceneFrame>
  );
};
