import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {CHECK, GEAR} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite, Sprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop, snap} from '../../lib/anim';
import {Banner, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {MAGNIFIER, WARNING} from '../../ep03/assets/icons';
import {MONITOR, TECH_LOOK} from '../assets/icons';
import {SCENES} from '../config/scenes';
import {EP06_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 5;
const NODE_COLORS = [EP06_THEME.red, EP06_THEME.orange, EP06_THEME.blue, EP06_THEME.green];

export const Ep06Scene06Troubleshooting: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const cfg = SCENES[I];
  const labels = cfg.list ?? [];
  const nodeAt = [8, f('punca', 2.0) - 2, f('menguji', 3.2) - 2, f('penyelesaian', 4.6) - 2];
  const solved = frame >= nodeAt[3] + 8;
  const icons: Sprite[] = [WARNING, MAGNIFIER, GEAR, CHECK];
  // Magnifier sweeps across the faulty monitor while the cause is investigated.
  const sweep = interpolate(frame, [nodeAt[1], nodeAt[3]], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const mx = 560 + Math.sin(sweep * Math.PI * 3) * 140;
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={4} navyUntil={nodeAt[3]} tone="tech" />}
      extraSfx={[...nodeAt.map((n) => ({at: n / fps, sfx: 'blip' as const})), {at: (nodeAt[3] + 8) / fps, sfx: 'success'}]}
    >
      <TitleCard text={cfg.text.headline} size={84} />
      <Banner text={cfg.text.sub} top={330} delay={10} bg={EP06_THEME.navy} size={34} />
      <div style={{position: 'absolute', left: 390, top: 430}}>
        <PixelSprite sprite={MONITOR(solved ? 'ok' : 'error')} px={13} />
      </div>
      {frame >= nodeAt[1] && !solved ? (
        <div style={{position: 'absolute', left: snap(mx, 4), top: 500}}>
          <PixelSprite sprite={MAGNIFIER} px={8} />
        </div>
      ) : null}
      {/* Problem -> cause -> test -> solution */}
      {labels.map((l, i) => {
        const s = pop(frame, fps, nodeAt[i], 10);
        return (
          <React.Fragment key={l}>
            <div style={{position: 'absolute', left: 30 + i * 260, top: 790, width: 240, transform: `scale(${s})`, opacity: frame >= nodeAt[i] ? 1 : 0}}>
              <PixelBox bg={COLORS.white} border={NODE_COLORS[i]} padding="10px 6px" borderWidth={6} shadow={false}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
                  <PixelSprite sprite={icons[i]} px={i === 3 ? 7 : 5} />
                  <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: l.length > 8 ? 26 : 32, color: NODE_COLORS[i]}}>{l}</div>
                </div>
              </PixelBox>
            </div>
            {i > 0 && frame >= nodeAt[i] ? (
              <div style={{position: 'absolute', left: 30 + i * 260 - 26, top: 840, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 40, color: COLORS.text}}>›</div>
            ) : null}
          </React.Fragment>
        );
      })}
      <Host scene={I} x={-40} y={1080} look={TECH_LOOK} pose={frame >= end - 4 ? 'thumbsUp' : frame >= nodeAt[1] ? 'think' : 'explain'} />
      {frame >= nodeAt[1] && frame < end - 4 ? (
        <div style={{position: 'absolute', left: -40 + 15 * 12, top: 1080 + 18 * 12}}>
          <PixelSprite sprite={MAGNIFIER} px={6} />
        </div>
      ) : null}
    </SceneFrame>
  );
};
