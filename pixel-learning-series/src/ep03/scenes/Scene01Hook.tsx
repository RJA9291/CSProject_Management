import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon, QUESTION} from '../../components/PixelIcons';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SpeechBubble} from '../../components/SpeechBubble';
import {WARNING} from '../assets/icons';
import {CyberBackground} from '../components/CyberBackground';
import {FakeLink, FictionTag, Phone, SenderBar, SmsBubble} from '../components/Phone';
import {SCENES} from '../config/scenes';
import {EP03_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 0;

export const Ep03Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const phoneAt = f('SMS', 1.2) - 6;
  const smsAt = phoneAt + 12;
  const linkAt = f('pautan', 3.2) - 2;
  const warnAt = f('Hati-hati', 5.6) - 2;
  const scamAt = f('scam', 7.2);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={warnAt} alarmFrom={warnAt} alarmUntil={warnAt + 36} />}
      extraSfx={[
        {at: phoneAt / fps, sfx: 'pop'},
        {at: smsAt / fps, sfx: 'notify'},
        {at: linkAt / fps, sfx: 'blip'},
        {at: warnAt / fps, sfx: 'alert'},
        {at: scamAt / fps, sfx: 'buzz'},
      ]}
    >
      <SpeechBubble delay={3} tail="left" tailOffset={160} style={{position: 'absolute', left: 70, top: 180, width: 940}}>
        <PixelText text={cfg.text.line1} size={80} effect="zoom" delay={8} />
        <PixelText text={cfg.text.line2} size={64} effect="pop" delay={linkAt} style={{marginTop: 10}} />
        <PixelText text={cfg.text.line3} size={76} color={EP03_THEME.red} effect="pop" delay={warnAt} style={{marginTop: 10}} />
      </SpeechBubble>
      <Phone x={560} y={600} w={470} h={640} delay={phoneAt} shake={frame >= warnAt && frame < warnAt + 16 ? 6 : 0}>
        {frame >= smsAt ? (
          <>
            <SenderBar name={cfg.text.sender} />
            <SmsBubble text={cfg.text.sms} chars={Math.floor((frame - smsAt) * 2.4)} size={28} />
            {frame >= linkAt ? <FakeLink text={cfg.text.link} alert={frame >= linkAt + 6} size={22} /> : null}
          </>
        ) : null}
      </Phone>
      <FictionTag label={cfg.text.fiction} x={600} y={1250} delay={smsAt + 8} rotate={-4} />
      {frame >= warnAt ? (
        <>
          <Icon sprite={WARNING} x={900} y={540} px={7} delay={warnAt} bob={8} />
          <Icon sprite={WARNING} x={470} y={700} px={5} delay={warnAt + 4} bob={8} phase={20} />
        </>
      ) : (
        <Icon sprite={QUESTION} x={440} y={760} px={9} delay={linkAt} bob={10} />
      )}
      <Host
        scene={I}
        x={-40}
        y={1080}
        pose={frame >= warnAt ? 'warn' : frame >= phoneAt ? 'pointRight' : 'neutral'}
        expression={frame >= warnAt ? 'confused' : undefined}
        enter="bottom"
        enterFrames={16}
      />
    </SceneFrame>
  );
};
