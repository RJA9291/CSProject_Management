import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CheckList} from '../../components/InfographicCard';
import {Host} from '../../components/PixelCharacter/Host';
import {CHECK} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop, snap} from '../../lib/anim';
import {Banner, Chip, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {WARNING} from '../../ep03/assets/icons';
import {PRINTER} from '../../ep04/assets/icons';
import {PAPER, TECH_LOOK} from '../assets/icons';
import {SCENES} from '../config/scenes';
import {EP06_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 8;
const PX = 18;
const P_X = 560;
const P_Y = 520;

export const Ep06Scene09Printer: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f, end} = useCues(I);
  const cfg = SCENES[I];
  const items = cfg.list ?? [];
  const checks = [f('kuasa', 1.6), f('kertas', 2.2), f('toner', 2.8), f('sambungan', 3.4), f('queue', 6.0), f('test', 8.6)];
  const jamOut = checks[1] + 6;
  const queueCleared = checks[4] + 30;
  const testAt = checks[5];
  const fixed = frame >= testAt;
  const blink = Math.floor(frame / 6) % 2 === 0;
  // The jammed sheet is eased out of the front tray (printer off, no tools).
  const jamY = interpolate(frame, [jamOut, jamOut + 16], [0, 140], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const jamFade = interpolate(frame, [jamOut + 16, jamOut + 26], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Test page feeds out at the end.
  const testY = interpolate(frame, [testAt + 6, testAt + 30], [0, 200], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={0} navyUntil={testAt} alarmFrom={4} alarmUntil={30} />}
      extraSfx={[...checks.map((c) => ({at: c / fps, sfx: 'blip' as const})), {at: jamOut / fps, sfx: 'whoosh'}, {at: queueCleared / fps, sfx: 'click'}, {at: (testAt + 6) / fps, sfx: 'print'}, {at: (testAt + 30) / fps, sfx: 'success'}]}
    >
      <TitleCard text={cfg.text.headline} size={62} />
      <Banner text={cfg.text.sub} top={320} delay={8} bg={EP06_THEME.navy} size={34} />
      {/* Printer with jam warning, then a test page */}
      {frame >= jamOut && jamFade > 0 ? (
        <div style={{position: 'absolute', left: P_X + 70, top: snap(P_Y + 150 + jamY, 4), opacity: jamFade, transform: 'rotate(-8deg)'}}>
          <PixelSprite sprite={PAPER(false)} px={8} palette={{W: '#EDE6D6'}} />
        </div>
      ) : null}
      {fixed ? (
        <div style={{position: 'absolute', left: P_X + 106, top: snap(P_Y + 180 + testY, 4)}}>
          <PixelSprite sprite={PAPER(true)} px={9} />
          <div style={{position: 'absolute', left: 6, top: 20, width: 96, textAlign: 'center', fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 16, color: EP06_THEME.green}}>{cfg.text.testPage}</div>
        </div>
      ) : null}
      <div style={{position: 'absolute', left: P_X, top: P_Y}}>
        <PixelSprite sprite={PRINTER} px={PX} palette={fixed ? undefined : {E: blink ? '#C93434' : '#5F666D'}} />
      </div>
      {!fixed ? (
        <div style={{position: 'absolute', left: P_X + 40, top: P_Y - 70, display: 'flex', alignItems: 'center', gap: 8, opacity: frame < checks[1] + 20 ? 1 : 0.0}}>
          <PixelSprite sprite={WARNING} px={4} />
          <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 30, color: blink ? EP06_THEME.red : COLORS.white, background: EP06_THEME.navy, padding: '2px 8px'}}>{cfg.text.jam}</div>
        </div>
      ) : (
        <div style={{position: 'absolute', left: P_X + 260, top: P_Y - 60, transform: `scale(${pop(frame, fps, testAt + 30, 9)})`}}>
          <PixelSprite sprite={CHECK} px={9} />
        </div>
      )}
      {frame >= checks[1] ? <Chip label={cfg.text.safety} x={560} y={900} delay={checks[1]} bg={EP06_THEME.orange} color={COLORS.text} size={22} /> : null}
      {/* Print queue window */}
      <div style={{position: 'absolute', left: 40, top: 430, width: 480, transform: `scale(${pop(frame, fps, checks[4] - 4, 10)})`, opacity: frame >= checks[4] - 4 ? 1 : 0}}>
        <PixelBox bg={COLORS.white} border={EP06_THEME.blue} padding="0" borderWidth={6} shadow={false}>
          <div style={{background: EP06_THEME.blue, padding: '4px 12px', fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 22, color: COLORS.white}}>{cfg.text.queueTitle}</div>
          <div style={{padding: '10px 12px', fontFamily: FONTS.heading, fontWeight: 700, fontSize: 26, color: COLORS.text, minHeight: 40}}>
            {frame < queueCleared ? (
              <span>
                {cfg.text.doc} <span style={{color: EP06_THEME.red}}>• Error</span>
              </span>
            ) : (
              <span style={{color: EP06_THEME.green}}>Tiada dokumen tersangkut ✓</span>
            )}
          </div>
        </PixelBox>
      </div>
      <div style={{position: 'absolute', left: 40, top: 600, width: 480}}>
        <PixelBox bg={COLORS.white} border={EP06_THEME.green} padding="12px 16px" shadow={false} borderWidth={6}>
          <CheckList items={items} starts={checks} size={30} gap={6} />
        </PixelBox>
      </div>
      <Host scene={I} x={-40} y={1090} look={TECH_LOOK} pose={frame >= end - 4 ? 'thumbsUp' : frame >= checks[0] ? 'pointRight' : 'think'} />
    </SceneFrame>
  );
};
