import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon, QUESTION, SERVER, SPARKLE} from '../../components/PixelIcons';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SpeechBubble} from '../../components/SpeechBubble';
import {pop} from '../../lib/anim';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {DESKTOP} from '../assets/icons';
import {Terminal} from '../components/Terminal';
import {Tux} from '../components/Tux';
import {SCENES} from '../config/scenes';
import {useCues} from '../lib/cues';

const I = 0;

export const Ep05Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const linuxAt = f('Linux', 3.4) - 4;
  const tahuAt = f('Tahukah', 5.2) - 2;
  const serverAt = f('server', 8.2) - 2;
  const desk = pop(frame, fps, 10, 10);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[{at: 10 / fps, sfx: 'pop'}, {at: linuxAt / fps, sfx: 'jump'}, {at: tahuAt / fps, sfx: 'blip'}, {at: serverAt / fps, sfx: 'success'}]}
    >
      <SpeechBubble delay={3} tail="left" tailOffset={160} style={{position: 'absolute', left: 70, top: 180, width: 940}}>
        <PixelText text={cfg.text.line1} size={64} effect="zoom" delay={8} />
        <PixelText text={cfg.text.line2} size={64} effect="zoom" delay={linuxAt} style={{marginTop: 8}} />
        <PixelText text={cfg.text.line3} size={62} effect="pop" delay={tahuAt} stagger={5} style={{marginTop: 8}} />
      </SpeechBubble>
      <div style={{position: 'absolute', left: 560, top: 700, transform: `scale(${desk})`, opacity: frame >= 10 ? 1 : 0}}>
        <PixelSprite sprite={DESKTOP()} px={18} />
      </div>
      <Terminal
        x={520}
        y={780}
        w={520}
        h={260}
        size={40}
        delay={tahuAt}
        steps={[{cmd: 'uname -s', dir: '~', output: ['Linux'], at: tahuAt + 10}]}
      />
      <Icon sprite={QUESTION} x={400} y={760} px={10} delay={linuxAt} bob={10} />
      <Icon sprite={SERVER} x={600} y={1120} px={6} delay={serverAt} bob={4} />
      <Icon sprite={SPARKLE} x={540} y={1090} px={6} delay={serverAt + 4} bob={6} />
      <Tux x={820} y={1150} px={8} pose={frame >= serverAt ? 'celebrate' : 'wave'} flip enter="right" enterAt={linuxAt} />
      <Host
        scene={I}
        x={-40}
        y={1080}
        pose={frame >= tahuAt ? 'explain' : frame >= linuxAt ? 'think' : 'pointRight'}
        expression={frame >= linuxAt && frame < tahuAt ? 'confused' : undefined}
        enter="bottom"
        enterFrames={16}
      />
    </SceneFrame>
  );
};
