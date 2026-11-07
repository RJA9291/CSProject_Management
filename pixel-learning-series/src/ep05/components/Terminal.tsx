import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {PixelBox} from '../../components/PixelBox';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import type {SfxCue} from '../../config/scenes';
import {EP05_THEME, TERM_FONT} from '../config/theme';

// A simulated shell session for teaching: it only draws text, nothing is executed.
export type TermStep = {cmd: string; dir: string; output: string[]; at: number};

export const TYPE_FRAMES = 2; // frames per typed character
export const OUTPUT_GAP = 6; // pause after Enter before output
export const LINE_FRAMES = 3; // frames per output line

// Frame when a step's command is fully typed and Enter is pressed.
export const enterFrame = (s: TermStep) => s.at + s.cmd.length * TYPE_FRAMES + 4;
// Frame when a step's output has finished printing.
export const doneFrame = (s: TermStep) => enterFrame(s) + OUTPUT_GAP + s.output.length * LINE_FRAMES;

// Key clicks while typing, an Enter click, and a confirmation blip when output appears.
export const terminalSfx = (steps: TermStep[], fps: number): SfxCue[] =>
  steps.flatMap((s) => [
    ...Array.from({length: Math.ceil(s.cmd.length / 2)}, (_, k) => ({at: (s.at + k * 2 * TYPE_FRAMES) / fps, sfx: 'key' as const})),
    {at: enterFrame(s) / fps, sfx: 'click' as const},
    {at: (enterFrame(s) + OUTPUT_GAP) / fps, sfx: 'blip' as const},
  ]);

type Props = {
  x: number;
  y: number;
  w: number;
  h: number;
  steps: TermStep[];
  user?: string;
  host?: string;
  title?: string;
  delay?: number;
  size?: number;
  // Lines shown before the first prompt (e.g. a login banner).
  banner?: {text: string; at: number; color?: string}[];
  // Directory shown in the idle prompt after the last step.
  finalDir?: string;
  // Highlights the step currently being explained.
  focus?: number;
  // 'windows' draws a Command Prompt style prompt: `<dir>>` (dir like C:\\Users\\staff).
  shell?: 'unix' | 'windows';
};

type Line = {kind: 'prompt' | 'out' | 'banner'; dir?: string; text: string; color?: string; active?: boolean};

// Pixel terminal window that types commands one by one, then prints their output.
export const Terminal: React.FC<Props> = ({x, y, w, h, steps, user = 'student', host = 'linux', title, delay = 0, size = 44, banner = [], finalDir, focus, shell = 'unix'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 11);
  const lines: Line[] = [];
  banner.forEach((b) => frame >= b.at && lines.push({kind: 'banner', text: b.text, color: b.color}));
  let cursorOn: number | null = null;
  steps.forEach((st, i) => {
    if (frame < st.at) return;
    const typed = Math.min(st.cmd.length, Math.floor((frame - st.at) / TYPE_FRAMES));
    lines.push({kind: 'prompt', dir: st.dir, text: st.cmd.slice(0, typed), active: focus === i});
    if (frame < enterFrame(st)) cursorOn = lines.length - 1;
    const shown = Math.max(0, Math.floor((frame - enterFrame(st) - OUTPUT_GAP) / LINE_FRAMES) + 1);
    st.output.slice(0, frame >= enterFrame(st) + OUTPUT_GAP ? shown : 0).forEach((o) => lines.push({kind: 'out', text: o}));
  });
  // Idle prompt waiting for the next command.
  const last = steps.filter((st) => frame >= st.at).pop();
  const nextStep = steps.find((st) => frame < st.at);
  if (frame >= delay + 6 && (!last || frame >= doneFrame(last))) {
    const dir = nextStep?.dir ?? finalDir ?? last?.dir ?? '~';
    lines.push({kind: 'prompt', dir, text: ''});
    cursorOn = lines.length - 1;
  }
  const lineH = Math.round(size * 1.05);
  const maxLines = Math.floor((h - 70) / lineH);
  const visible = lines.slice(-maxLines);
  const offset = lines.length - visible.length;
  const blink = Math.floor(frame / 8) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: h, transform: `scale(${s})`, opacity: frame >= delay ? 1 : 0}}>
      <PixelBox bg={EP05_THEME.term} border={COLORS.text} padding={0} step={8} style={{height: '100%'}}>
        <div style={{height: 46, background: EP05_THEME.termBar, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px'}}>
          {[EP05_THEME.red, EP05_THEME.orange, EP05_THEME.green].map((c) => (
            <div key={c} style={{width: 16, height: 16, background: c}} />
          ))}
          <div style={{flex: 1, textAlign: 'center', fontFamily: FONTS.pixel, fontSize: 20, color: EP05_THEME.termText}}>{title ?? `${user}@${host}: terminal`}</div>
        </div>
        <div style={{padding: '10px 18px', fontFamily: TERM_FONT, fontSize: size, lineHeight: `${lineH}px`, color: EP05_THEME.termText}}>
          {visible.map((l, i) => {
            const idx = i + offset;
            const cursor = cursorOn === idx && blink ? <span style={{background: EP05_THEME.green, color: EP05_THEME.green}}>_</span> : null;
            if (l.kind === 'prompt' && shell === 'windows')
              return (
                <div key={idx} style={{whiteSpace: 'pre', background: l.active ? 'rgba(57,184,107,0.16)' : undefined}}>
                  <span style={{color: EP05_THEME.termText}}>{l.dir}&gt;</span>
                  <span style={{color: COLORS.white}}>{l.text}</span>
                  {cursor}
                </div>
              );
            if (l.kind === 'prompt')
              return (
                <div key={idx} style={{whiteSpace: 'pre', background: l.active ? 'rgba(57,184,107,0.16)' : undefined}}>
                  <span style={{color: EP05_THEME.green}}>
                    {user}@{host}
                  </span>
                  <span style={{color: EP05_THEME.termText}}>:</span>
                  <span style={{color: EP05_THEME.cyan}}>{l.dir}</span>
                  <span style={{color: EP05_THEME.termText}}>$ </span>
                  <span style={{color: COLORS.white}}>{l.text}</span>
                  {cursor}
                </div>
              );
            return (
              <div key={idx} style={{whiteSpace: 'pre', color: l.color ?? (l.kind === 'out' ? '#9FE8B8' : EP05_THEME.termText)}}>
                {l.text}
              </div>
            );
          })}
        </div>
      </PixelBox>
    </div>
  );
};
