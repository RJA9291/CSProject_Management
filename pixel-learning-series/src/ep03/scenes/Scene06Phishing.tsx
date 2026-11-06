import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ARROW_DOWN} from '../../assets/icons/icons';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon, QUESTION} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {float} from '../../lib/anim';
import {HOOK, WARNING} from '../assets/icons';
import {CyberBackground} from '../components/CyberBackground';
import {FakeLink, FictionTag, Phone, SenderBar, SmsBubble} from '../components/Phone';
import {SCENES} from '../config/scenes';
import {EP03_THEME} from '../config/theme';
import {useCues} from '../lib/cues';
import {Chip} from '../components/Cards';

const I = 5;

export const Ep03Scene06Phishing: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const smsAt = f('mesej', 1.4) - 4;
  const claimAt = f('Kononnya', 3.2);
  const phishAt = f('phishing', 6.6) - 4;
  const panicAt = f('panik', 9.6) - 2;
  const pressed = frame >= panicAt + 20 && frame < panicAt + 26;
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={phishAt} alarmFrom={phishAt} alarmUntil={phishAt + 30} />}
      extraSfx={[
        {at: smsAt / fps, sfx: 'notify'},
        {at: claimAt / fps, sfx: 'blip'},
        {at: phishAt / fps, sfx: 'alert'},
        {at: panicAt / fps, sfx: 'buzz'},
      ]}
    >
      <div style={{position: 'absolute', left: 70, top: 170, width: 940}}>
        <PixelBox bg={COLORS.white} padding="20px 24px">
          {frame < phishAt ? (
            <PixelText text={cfg.text.headline} size={70} effect="pop" delay={4} stagger={5} shadow={false} />
          ) : (
            <PixelText text={cfg.text.reveal} size={84} effect="zoom" delay={phishAt} stagger={4} shadow={false} />
          )}
        </PixelBox>
      </div>
      <Phone x={470} y={450} w={570} h={800} delay={6} shake={frame >= phishAt && frame < phishAt + 14 ? 6 : 0}>
        {frame >= smsAt ? (
          <>
            <SenderBar name={cfg.text.sender} />
            <SmsBubble text={cfg.text.sms} chars={Math.floor((frame - smsAt) * 2.2)} size={32} />
            {frame >= claimAt ? <FakeLink text={cfg.text.link} alert={frame >= phishAt} size={28} /> : null}
            {frame >= claimAt + 10 ? (
              <div style={{margin: '18px 16px 0', alignSelf: 'center', transform: pressed ? 'scale(0.92)' : 'none'}}>
                <PixelBox bg={EP03_THEME.red} border={COLORS.text} padding="10px 30px" shadow={false} borderWidth={6} step={6}>
                  <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.white}}>{cfg.text.button}</div>
                </PixelBox>
              </div>
            ) : null}
          </>
        ) : null}
      </Phone>
      {/* A hook dangles over the fake button once it is called phishing. */}
      {frame >= phishAt ? (
        <div style={{position: 'absolute', left: 960, top: 1060 + float(frame, 10, 40)}}>
          <PixelSprite sprite={HOOK} px={6} />
        </div>
      ) : null}
      {frame >= phishAt ? (
        <div style={{position: 'absolute', left: 420, top: 820 + float(frame, 8, 20)}}>
          <PixelSprite sprite={ARROW_DOWN} px={9} style={{transform: 'rotate(-90deg)'}} />
        </div>
      ) : null}
      <FictionTag label={cfg.text.fiction} x={500} y={1270} delay={smsAt + 6} rotate={-3} />
      {frame >= panicAt ? (
        <>
          <Chip label={cfg.text.panic} x={40} y={600} delay={panicAt} bg={EP03_THEME.red} size={48} />
          <Chip label="!!" x={330} y={720} delay={panicAt + 6} bg={EP03_THEME.yellow} color={COLORS.text} size={48} />
          <Icon sprite={WARNING} x={60} y={760} px={7} delay={panicAt + 3} bob={8} />
        </>
      ) : (
        <Icon sprite={QUESTION} x={330} y={760} px={9} delay={claimAt} bob={10} />
      )}
      <Host
        scene={I}
        x={-80}
        y={1080}
        pose={frame >= panicAt ? 'warn' : frame >= claimAt ? 'think' : 'pointRight'}
        expression={frame >= claimAt ? 'confused' : undefined}
      />
    </SceneFrame>
  );
};
