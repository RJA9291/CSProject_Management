import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckList} from '../../components/InfographicCard';
import {Host} from '../../components/PixelCharacter/Host';
import {COMPUTER} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {Banner, Chip, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {X_MARK} from '../../ep03/assets/icons';
import {GLOBE, PLUG, WIFI} from '../../ep04/assets/icons';
import {Device, NetLink, routerSprite} from '../../ep04/components/Net';
import {doneFrame, Terminal, terminalSfx, TermStep} from '../../ep05/components/Terminal';
import {ESCALATE, TECH_LOOK} from '../assets/icons';
import {NET_COMMANDS, SCENES} from '../config/scenes';
import {EP06_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 7;
const PC: [number, number] = [150, 560];
const RT: [number, number] = [540, 560];
const NET: [number, number] = [910, 560];
const CWD = 'C:\\Users\\staff';

export const Ep06Scene08Internet: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const cfg = SCENES[I];
  const items = cfg.list ?? [];
  const cableAt = f('kabel', 2.6) - 2;
  const ipAt = f('konfigurasi', 4.6) - 2;
  const pingAt = f('ping', 6.0);
  const failAt = f('gagal', 9.8) - 2;
  const escAt = f('escalate', 11.4) - 2;
  // Commands start as the narration reaches them, one after another.
  const steps: TermStep[] = [];
  const startAt = [ipAt, ipAt + 1, pingAt];
  NET_COMMANDS.forEach((c, i) => {
    const prev = steps[i - 1];
    steps.push({cmd: c.cmd, dir: CWD, output: c.output, at: prev ? Math.max(startAt[i], doneFrame(prev) + 6) : startAt[i]});
  });
  const ipDone = doneFrame(steps[1]);
  const pingDone = doneFrame(steps[2]);
  const gatewayOk = frame >= pingDone;
  const checks = [cableAt + 6, cableAt + 22, ipDone, pingDone, pingDone + 20, escAt];
  const complaint = pop(frame, fps, 8, 10);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={0} navyUntil={pingDone} tone="tech" alarmFrom={4} alarmUntil={24} />}
      extraSfx={[...terminalSfx(steps, fps), {at: cableAt / fps, sfx: 'click'}, {at: pingDone / fps, sfx: 'link'}, {at: (pingDone + 20) / fps, sfx: 'success'}, {at: escAt / fps, sfx: 'notify'}]}
    >
      <TitleCard text={cfg.text.headline} size={80} />
      <Banner text={cfg.text.sub} top={300} delay={8} bg={EP06_THEME.navy} size={36} />
      {/* PC -> router (gateway) -> internet; links turn green as each hop is proven. */}
      <NetLink a={PC} b={RT} start={4} color={EP06_THEME.red} okAt={gatewayOk ? pingDone : Infinity} packets={gatewayOk ? 'both' : 'none'} />
      <NetLink a={RT} b={NET} start={4} color={EP06_THEME.red} wireless okAt={pingDone + 20} packets={frame >= pingDone + 20 ? 'forward' : 'none'} />
      <Device sprite={COMPUTER} x={PC[0] - 54} y={PC[1] - 60} px={6} label="PC PENGGUNA" delay={4} dark labelSize={24} />
      <Device sprite={routerSprite(frame)} x={RT[0] - 54} y={RT[1] - 40} px={6} label="ROUTER (GATEWAY)" delay={6} dark labelSize={24} />
      <Device sprite={GLOBE} x={NET[0] - 48} y={NET[1] - 48} px={6} label="INTERNET" delay={8} dark labelSize={24} />
      {!gatewayOk ? (
        <div style={{position: 'absolute', left: RT[0] - 120, top: RT[1] - 120}}>
          <PixelSprite sprite={WIFI(0, 'U', 'g')} px={5} />
          <div style={{position: 'absolute', left: 30, top: 20}}>
            <PixelSprite sprite={X_MARK} px={4} />
          </div>
        </div>
      ) : (
        <div style={{position: 'absolute', left: RT[0] - 120, top: RT[1] - 120}}>
          <PixelSprite sprite={WIFI(3, 'E', 'g')} px={5} />
        </div>
      )}
      {frame >= cableAt ? (
        <div style={{position: 'absolute', left: PC[0] + 90, top: PC[1] + 30, transform: `scale(${pop(frame, fps, cableAt, 9)})`}}>
          <PixelSprite sprite={PLUG} px={5} />
        </div>
      ) : null}
      <div style={{position: 'absolute', left: 560, top: 380, transform: `scale(${complaint})`, opacity: frame >= 8 && frame < cableAt + 30 ? 1 : 0}}>
        <PixelBox bg={COLORS.white} border={EP06_THEME.red} padding="6px 14px" shadow={false} borderWidth={5} step={6}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 26, color: EP06_THEME.red, whiteSpace: 'pre-line', lineHeight: 1.05}}>{cfg.text.complaint}</div>
        </PixelBox>
      </div>
      <Terminal
        x={40}
        y={680}
        w={1000}
        h={420}
        size={32}
        shell="windows"
        title="Command Prompt (Windows) • SIMULASI"
        delay={ipAt - 8}
        steps={steps}
        finalDir={CWD}
      />
      <div style={{position: 'absolute', left: 470, top: 1106, width: 570, fontFamily: FONTS.heading, fontWeight: 700, fontSize: 22, lineHeight: 1.1, color: EP06_THEME.cyan, opacity: frame >= steps[2].at ? 1 : 0}}>{cfg.text.gatewayNote}</div>
      <div style={{position: 'absolute', left: 470, top: 1170, width: 570}}>
        <PixelBox bg={COLORS.white} border={EP06_THEME.blue} padding="10px 14px" shadow={false} borderWidth={6}>
          <CheckList items={items} starts={checks} size={25} gap={2} />
        </PixelBox>
      </div>
      {frame >= escAt ? (
        <div style={{position: 'absolute', left: 470, top: 1478, display: 'flex', alignItems: 'center', gap: 8}}>
          <PixelSprite sprite={ESCALATE} px={4} />
          <Chip label={cfg.text.escalate} x={60} y={0} delay={escAt} bg={EP06_THEME.orange} color={COLORS.text} size={26} />
        </div>
      ) : null}
      <Host
        scene={I}
        x={-80}
        y={1100}
        look={TECH_LOOK}
        pose={frame >= end - 6 ? 'thumbsUp' : frame >= ipAt ? 'type' : frame >= cableAt ? 'hold' : 'think'}
        expression={frame >= failAt && frame < escAt ? 'confused' : undefined}
        step={4}
      />
    </SceneFrame>
  );
};
