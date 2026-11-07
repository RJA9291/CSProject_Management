import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SpeechBubble} from '../../components/SpeechBubble';
import {COLORS, FONTS} from '../../config/theme';
import {Chip} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {WARNING, X_MARK} from '../../ep03/assets/icons';
import {PRINTER, WIFI} from '../../ep04/assets/icons';
import {KEYBOARD} from '../../ep05/assets/icons';
import {MONITOR, TECH_LOOK, TOOLBOX} from '../assets/icons';
import {SCENES} from '../config/scenes';
import {EP06_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 0;

export const Ep06Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const errAt = f('komputer', 0.8) + 4;
  const netAt = f('internet', 2.4) - 2;
  const prnAt = f('printer', 3.4) - 2;
  const callAt = f('Siapa', 5.0);
  const supportAt = f('Support', 6.4) - 4;
  const flash = Math.floor(frame / 6) % 2 === 0;
  const solved = frame >= supportAt;
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={errAt} navyUntil={supportAt} alarmFrom={errAt} alarmUntil={callAt} />}
      extraSfx={[{at: errAt / fps, sfx: 'buzz'}, {at: netAt / fps, sfx: 'alert'}, {at: prnAt / fps, sfx: 'alert'}, {at: callAt / fps, sfx: 'notify'}, {at: supportAt / fps, sfx: 'success'}]}
    >
      <SpeechBubble delay={3} tail="left" tailOffset={160} style={{position: 'absolute', left: 70, top: 180, width: 940}}>
        <PixelText text={cfg.text.line1} size={66} effect="zoom" delay={8} stagger={5} />
        <PixelText text={cfg.text.line2} size={62} effect="pop" delay={netAt} style={{marginTop: 8}} />
        <PixelText text={cfg.text.line3} size={62} effect="pop" delay={prnAt} style={{marginTop: 6}} />
      </SpeechBubble>
      {/* Desk: monitor errors out, Wi-Fi drops, printer warns. */}
      <div style={{position: 'absolute', left: 520, top: 640}}>
        <PixelSprite sprite={MONITOR(solved ? 'ok' : frame >= errAt ? 'error' : 'normal')} px={18} />
      </div>
      {frame >= errAt && !solved ? (
        <div style={{position: 'absolute', left: 560, top: 680, width: 390, opacity: flash ? 1 : 0.85}}>
          <PixelBox bg={COLORS.white} border={COLORS.text} padding="8px 12px" shadow={false} borderWidth={5} step={6}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <PixelSprite sprite={WARNING} px={3} />
              <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: EP06_THEME.red, lineHeight: 1.05}}>ERROR</div>
            </div>
            <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 22, color: COLORS.text}}>{cfg.text.error}</div>
          </PixelBox>
        </div>
      ) : null}
      {frame >= netAt ? (
        <div style={{position: 'absolute', left: 560, top: 1060}}>
          <PixelSprite sprite={WIFI(solved ? 3 : 0, solved ? 'E' : 'U', 'g')} px={8} />
          {!solved ? (
            <div style={{position: 'absolute', left: 70, top: 40}}>
              <PixelSprite sprite={X_MARK} px={6} />
            </div>
          ) : null}
        </div>
      ) : null}
      {frame >= prnAt ? (
        <div style={{position: 'absolute', left: 820, top: 1060}}>
          <PixelSprite sprite={PRINTER} px={9} />
          {!solved ? <div style={{position: 'absolute', left: 110, top: -30, opacity: flash ? 1 : 0}}><PixelSprite sprite={WARNING} px={4} /></div> : null}
        </div>
      ) : null}
      {solved ? <Chip label={cfg.text.call} x={560} y={1240} delay={supportAt} bg={EP06_THEME.green} size={56} /> : null}
      {solved ? <Icon sprite={TOOLBOX} x={820} y={1380} px={8} delay={supportAt + 4} bob={6} /> : null}
      <Host
        scene={I}
        x={-40}
        y={1080}
        look={solved ? TECH_LOOK : undefined}
        pose={solved ? 'thumbsUp' : frame >= errAt ? 'warn' : 'type'}
        expression={frame >= errAt && !solved ? 'confused' : undefined}
        step={4}
      />
      {frame < errAt ? (
        <div style={{position: 'absolute', left: 140, top: 1432}}>
          <PixelSprite sprite={KEYBOARD} px={8} />
        </div>
      ) : null}
    </SceneFrame>
  );
};
