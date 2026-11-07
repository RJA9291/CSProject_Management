import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {Banner, TitleCard} from '../../ep03/components/Cards';
import {KEYBOARD} from '../assets/icons';
import {ServerRoom} from '../components/ServerRoom';
import {doneFrame, enterFrame, Terminal, terminalSfx, TermStep} from '../components/Terminal';
import {Tux} from '../components/Tux';
import {SCENES, SERVER_SESSION} from '../config/scenes';
import {EP05_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 9;

export const Ep05Scene10Server: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const cfg = SCENES[I];
  const loginAt = f('administrator', 1.6) - 4;
  const welcomeAt = f('server', 3.4);
  // Commands follow the narration: check files, manage folders, run commands.
  const cues = [f('terminal', 5.4), f('menyemak', 6.2), f('mengurus', 7.2, 1), f('folder', 7.8), f('menjalankan', 8.6)];
  const steps: TermStep[] = [];
  SERVER_SESSION.forEach((s, i) => {
    const prev = steps[i - 1];
    steps.push({...s, at: prev ? Math.max(cues[i], doneFrame(prev) + 4) : Math.max(cues[i], welcomeAt + 12)});
  });
  const current = steps.filter((s) => frame >= s.at).length - 1;
  const typing = (current >= 0 && frame < enterFrame(steps[current])) || (frame >= loginAt && frame < welcomeAt);
  const lastDone = doneFrame(steps[steps.length - 1]);
  const noteAt = f('Inilah', 12.6) - 2;
  const note = pop(frame, fps, noteAt, 10);
  const pw = '*'.repeat(Math.max(0, Math.min(8, Math.floor((frame - loginAt - 14) / 2))));
  return (
    <SceneFrame
      index={I}
      background={<ServerRoom />}
      extraSfx={[{at: loginAt / fps, sfx: 'key'}, {at: welcomeAt / fps, sfx: 'success'}, ...terminalSfx(steps, fps), {at: noteAt / fps, sfx: 'pop'}]}
    >
      <TitleCard text={cfg.text.headline} size={80} />
      <Banner text={cfg.text.sub} top={330} delay={8} bg={EP05_THEME.green} size={36} />
      <Terminal
        x={40}
        y={430}
        w={1000}
        h={600}
        size={42}
        user="admin"
        host="company-server"
        title="admin@company-server (SIMULASI)"
        delay={loginAt - 6}
        steps={steps}
        banner={[
          {text: 'login: admin', at: loginAt},
          {text: `Password: ${pw}`, at: loginAt + 14},
          {text: 'Welcome to company-server (Linux)', at: welcomeAt, color: EP05_THEME.cyan},
        ]}
      />
      <div style={{position: 'absolute', left: 470, top: 1050, width: 570, transform: `scale(${note})`, opacity: frame >= noteAt ? 1 : 0}}>
        <PixelBox bg={COLORS.white} border={EP05_THEME.orange} padding="10px 16px" borderWidth={6} shadow={false}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 25, color: COLORS.text, lineHeight: 1.15, whiteSpace: 'pre-line'}}>{cfg.text.more}</div>
        </PixelBox>
      </div>
      <Tux x={840} y={1250} px={6} pose={frame >= lastDone ? 'celebrate' : 'point'} flip hopFrom={lastDone + 2} hopUntil={lastDone + 30} />
      <Host scene={I} x={-60} y={1090} pose={typing ? 'type' : frame >= end - 6 ? 'thumbsUp' : 'neutral'} eyes={typing ? 'right' : undefined} step={4} />
      {frame < end - 6 ? (
        <div style={{position: 'absolute', left: 120, top: 1432}}>
          <PixelSprite sprite={KEYBOARD} px={8} />
        </div>
      ) : null}
    </SceneFrame>
  );
};
