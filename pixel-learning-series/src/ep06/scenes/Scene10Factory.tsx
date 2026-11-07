import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {CHECK, COMPUTER, SERVER} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {FACTORY, PRINTER} from '../../ep04/assets/icons';
import {NetLink, switchSprite} from '../../ep04/components/Net';
import {ESCALATE, TECH_LOOK} from '../assets/icons';
import {User} from '../components/People';
import {SCENARIO_A, SCENARIO_B, SCENES} from '../config/scenes';
import {EP06_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 9;
type Pt = [number, number];
const DEPTS = [
  {name: 'PRODUCTION', x: 40, color: EP06_THEME.blue},
  {name: 'QA', x: 300, color: EP06_THEME.green},
  {name: 'MAINTENANCE', x: 560, color: EP06_THEME.orange},
];
const SW: Pt = [540, 620];

// One scenario lane: title plus five steps that tick off in turn.
const Lane: React.FC<{title: string; steps: string[]; times: number[]; y: number; color: string; startAt: number; last: 'escalate' | 'done'}> = ({title, steps, times, y, color, startAt, last}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, startAt, 10);
  return (
    <div style={{position: 'absolute', left: 40, top: y, width: 1000, transform: `scale(${s})`, opacity: frame >= startAt ? 1 : 0}}>
      <PixelBox bg={COLORS.white} border={color} padding="10px 14px" borderWidth={6}>
        <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color, marginBottom: 8}}>{title}</div>
        <div style={{display: 'flex', gap: 8}}>
          {steps.map((st, i) => {
            const on = frame >= times[i];
            const final = i === steps.length - 1;
            const bg = !on ? '#E4E0D6' : final ? (last === 'escalate' ? EP06_THEME.orange : EP06_THEME.green) : color;
            return (
              <div key={st} style={{flex: 1, minHeight: 92, background: bg, padding: '6px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, transform: `scale(${on ? pop(frame, fps, times[i], 10) : 1})`}}>
                {on && final ? <PixelSprite sprite={last === 'escalate' ? ESCALATE : CHECK} px={3} palette={last === 'done' ? {E: '#FFFFFF', e: '#FFFFFF'} : undefined} /> : null}
                <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 21, color: on ? COLORS.white : '#8E8A80', textAlign: 'center', lineHeight: 1.05}}>{st}</div>
              </div>
            );
          })}
        </div>
      </PixelBox>
    </div>
  );
};

export const Ep06Scene10Factory: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const cfg = SCENES[I];
  const aAt = f('Production', 2.4) - 4;
  const bAt = f('QA', 4.4) - 4;
  const invAt = f('menyiasat', 6.6);
  const causeAt = f('punca', 7.6);
  const solveAt = f('menyelesaikannya', 8.6);
  const escAt = f('diescalate', 11.6) - 2;
  const timesA = [aAt + 10, invAt, invAt + 18, causeAt, escAt];
  const timesB = [bAt + 10, invAt + 8, causeAt, solveAt, solveAt + 24];
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[
        {at: aAt / fps, sfx: 'notify'},
        {at: bAt / fps, sfx: 'notify'},
        ...[...timesA.slice(1, 4), ...timesB.slice(1, 4)].map((t) => ({at: t / fps, sfx: 'blip' as const})),
        {at: (solveAt + 6) / fps, sfx: 'print'},
        {at: (solveAt + 24) / fps, sfx: 'success'},
        {at: escAt / fps, sfx: 'link'},
      ]}
    >
      <TitleCard text={cfg.text.headline} size={66} />
      {/* Simplified factory LAN */}
      <div style={{position: 'absolute', left: 40, top: 390, width: 1000, height: 330, border: `6px dashed ${EP06_THEME.navy}`, boxSizing: 'border-box'}}>
        <div style={{position: 'absolute', right: 10, top: 6}}>
          <PixelSprite sprite={FACTORY} px={3} />
        </div>
      </div>
      {DEPTS.map((d, i) => (
        <NetLink key={d.name} a={[d.x + 110, 520]} b={SW} start={8 + i * 4} okAt={i === 0 ? Infinity : i === 1 ? solveAt : 0} color={i === 0 && frame >= aAt ? EP06_THEME.red : EP06_THEME.blue} width={6} />
      ))}
      <NetLink a={SW} b={[900, 620]} start={16} width={6} packets={frame >= invAt ? 'both' : 'none'} />
      <NetLink a={SW} b={[300, 640]} start={20} width={6} okAt={solveAt} packets={frame >= solveAt ? 'forward' : 'none'} />
      {DEPTS.map((d, i) => {
        const alert = (i === 0 && frame >= aAt && frame < escAt) || (i === 1 && frame >= bAt && frame < solveAt + 24);
        const blink = Math.floor(frame / 6) % 2 === 0;
        return (
          <div key={d.name} style={{position: 'absolute', left: d.x + 20, top: 410, width: 220, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: d.name.length > 8 ? 24 : 28, color: alert && blink ? EP06_THEME.red : d.color}}>{d.name}</div>
            <PixelSprite sprite={COMPUTER} px={4} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: SW[0] - 91, top: SW[1] - 32}}>
        <PixelSprite sprite={switchSprite(frame)} px={7} />
      </div>
      <div style={{position: 'absolute', left: 860, top: 550, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <PixelSprite sprite={SERVER} px={5} />
        <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 18, color: EP06_THEME.navy}}>SERVER</div>
      </div>
      <div style={{position: 'absolute', left: 210, top: 600, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <PixelSprite sprite={PRINTER} px={5} />
        <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 18, color: EP06_THEME.navy}}>PRINTER</div>
      </div>
      <Lane title={cfg.text.a} steps={SCENARIO_A} times={timesA} y={740} color={EP06_THEME.blue} startAt={aAt} last="escalate" />
      <Lane title={cfg.text.b} steps={SCENARIO_B} times={timesB} y={920} color={EP06_THEME.green} startAt={bAt} last="done" />
      {frame >= escAt ? (
        <div style={{position: 'absolute', left: 560, top: 1110, transform: `scale(${pop(frame, fps, escAt, 9)})`}}>
          <PixelBox bg={EP06_THEME.orange} border={COLORS.text} padding="6px 12px" shadow={false} borderWidth={5} step={6}>
            <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 24, color: COLORS.text, lineHeight: 1.1}}>
              NETWORK ENGINEER /<br />
              SYSTEM ADMINISTRATOR
            </div>
          </PixelBox>
        </div>
      ) : null}
      <User look="hijab-teal" x={800} y={1250} px={6} pose={frame >= solveAt + 24 ? 'thumbsUp' : 'neutral'} expression={frame >= solveAt + 24 ? 'happy' : 'confused'} />
      <Host scene={I} x={-60} y={1090} look={TECH_LOOK} pose={frame >= end - 6 ? 'thumbsUp' : frame >= invAt ? 'type' : 'explain'} step={4} />
    </SceneFrame>
  );
};
