import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {CHECK} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {Chip, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {KEYBOARD} from '../assets/icons';
import {doneFrame, enterFrame, Terminal, terminalSfx, TermStep} from '../components/Terminal';
import {Tux} from '../components/Tux';
import {COMMANDS, SCENES} from '../config/scenes';
import {EP05_THEME, TERM_FONT} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 8;

export const Ep05Scene09Commands: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f} = useCues(I);
  const cfg = SCENES[I];
  // Each command starts typing as the narrator names it (never before the previous one finishes).
  const steps: TermStep[] = [];
  COMMANDS.forEach((c, i) => {
    const said = f(c.cue, 2 + i * 3) - 2;
    const prev = steps[i - 1];
    steps.push({cmd: c.cmd, dir: c.dir, output: c.output, at: prev ? Math.max(said, doneFrame(prev) + 8) : said});
  });
  const current = steps.filter((s) => frame >= s.at).length - 1;
  const typing = current >= 0 && frame < enterFrame(steps[current]);
  const done = steps.map((s) => doneFrame(s) + 2);
  const lastDone = done.filter((d) => frame >= d).pop();
  const celebrating = lastDone !== undefined && frame < lastDone + 22;
  const c = current >= 0 ? COMMANDS[current] : null;
  const card = c ? pop(frame, fps, steps[current].at, 10) : 0;
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={0} tone="tech" />}
      extraSfx={[...terminalSfx(steps, fps), ...done.map((d) => ({at: d / fps, sfx: 'success' as const}))]}
    >
      <TitleCard text={cfg.text.headline} size={54} />
      <Terminal x={40} y={360} w={1000} h={620} size={50} steps={steps} delay={4} focus={current} />
      <Chip label={cfg.text.sim} x={720} y={336} delay={8} bg={EP05_THEME.orange} color={COLORS.text} size={24} font="pixel" />
      {/* What the current command does */}
      {c ? (
        <div style={{position: 'absolute', left: 470, top: 1000, width: 570, transform: `scale(${card})`}}>
          <PixelBox bg={COLORS.white} border={EP05_THEME.green} padding="12px 18px" borderWidth={6}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
              <div style={{fontFamily: TERM_FONT, fontSize: 52, color: COLORS.white, background: EP05_THEME.term, padding: '0 12px', whiteSpace: 'nowrap'}}>{c.cmd.split(' ')[0]}</div>
              <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: EP05_THEME.navy, lineHeight: 1.05}}>{c.explain}</div>
            </div>
          </PixelBox>
        </div>
      ) : null}
      {/* Progress: one tick per command that has run */}
      <div style={{position: 'absolute', left: 470, top: 1150, display: 'flex', gap: 10}}>
        {COMMANDS.map((cm, i) => (
          <div key={cm.cmd} style={{display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: frame >= done[i] ? EP05_THEME.green : '#24365E', fontFamily: TERM_FONT, fontSize: 30, color: COLORS.white}}>
            {frame >= done[i] ? <PixelSprite sprite={CHECK} px={2} palette={{E: '#FFFFFF', e: '#FFFFFF'}} /> : null}
            {cm.cmd.split(' ')[0]}
          </div>
        ))}
      </div>
      <Tux x={820} y={1220} px={7} pose={celebrating ? 'celebrate' : 'point'} flip hopFrom={lastDone ?? Infinity} hopUntil={(lastDone ?? 0) + 22} />
      <Host scene={I} x={-60} y={1090} pose={typing ? 'type' : 'neutral'} eyes="right" step={4} />
      <div style={{position: 'absolute', left: 120, top: 1432}}>
        <PixelSprite sprite={KEYBOARD} px={8} />
      </div>
    </SceneFrame>
  );
};
