import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Flash, LightStreak} from '../components/Effects';
import {Glitch, glitchAt} from '../components/Glitch';
import {DecodeText} from '../components/KineticText';
import {clamp, ease, pop, progress} from '../components/motion';
import {Particles} from '../components/Particles';
import {Shield} from '../components/ShieldNetwork';
import {TeaserContent} from '../data/content';
import {beat, scene, TL} from '../data/timeline';
import {COLORS, FONTS} from '../theme';

const S = scene('cliffhanger');
const L = (abs: number) => abs - S.from;

const B = {
  question: L(TL.vo.s5_2),
  questionOut: L(beat('titleReveal')) - 10,
  title: L(beat('titleReveal')),
  ready: L(beat('readyIn')),
  soon: L(beat('soonIn')),
  glitchOut: L(beat('glitchOut')),
  silence: L(beat('silence')),
};

/** Heartbeat monitor line that pulses on each beat, turning from blue to red. */
const Ecg: React.FC<{start: number; end: number}> = ({start, end}) => {
  const f = useCurrentFrame();
  const o = Math.min(progress(f, start, 20), 1 - progress(f, end - 12, 12));
  if (o <= 0) return null;
  const w = 1080;
  const head = ((f - start) * 14) % (w + 300);
  const pts: string[] = [];
  for (let x = 0; x <= w; x += 6) {
    const k = (x % 360) - 180;
    let y = 0;
    if (k > -20 && k < -10) y = -14;
    else if (k >= -10 && k < 0) y = 70;
    else if (k >= 0 && k < 8) y = -150;
    else if (k >= 8 && k < 16) y = 40;
    else if (k > 50 && k < 80) y = -22 * Math.sin(((k - 50) / 30) * Math.PI);
    pts.push(`${x},${960 + y}`);
  }
  const red = interpolate(f, [start, end], [0, 1], clamp);
  const color = red > 0.5 ? COLORS.red : COLORS.cyan;
  return (
    <svg width="1080" height="1920" style={{position: 'absolute', opacity: o}}>
      <defs>
        <linearGradient id="ecgmask" x1="0" x2="1" y1="0" y2="0">
          <stop offset={Math.max(0, (head - 300) / w)} stopColor="white" stopOpacity="0" />
          <stop offset={Math.min(1, Math.max(0, head / w))} stopColor="white" stopOpacity="1" />
          <stop offset={Math.min(1, Math.max(0, head / w + 0.001))} stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="ecgm">
          <rect width="1080" height="1920" fill="url(#ecgmask)" />
        </mask>
        <filter id="ecgglow">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="4" mask="url(#ecgm)" filter="url(#ecgglow)" />
    </svg>
  );
};

export const Scene5Cliffhanger: React.FC<{content: TeaserContent}> = ({content}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = content.cliffhanger;

  const tp = pop(f, fps, B.title, 18, 0.9);
  const g = glitchAt(f, [B.question, B.questionOut, B.title, B.title + 4, B.ready], 7, 0.9) + glitchAt(f, [B.glitchOut, B.glitchOut + 3, B.glitchOut + 7], 6, 1);
  const finalFade = interpolate(f, [B.glitchOut + 2, B.silence], [1, 0], {...clamp, easing: ease.in});
  const qOpacity = Math.min(progress(f, B.question, 6), 1 - progress(f, B.questionOut, 6));

  return (
    <AbsoluteFill style={{background: COLORS.black}}>
      <Glitch intensity={Math.min(1, g)} seed={5}>
        <AbsoluteFill style={{opacity: finalFade}}>
          <Particles count={40} color={f > B.title ? COLORS.cyan : '#5a6a88'} speed={0.3} opacity={0.35} size={2.5} />
          <Ecg start={0} end={B.title - 4} />

          {/* the question */}
          <div style={{position: 'absolute', top: 700, left: 60, right: 60, textAlign: 'center', opacity: qOpacity}}>
            <DecodeText
              text={c.question}
              at={B.question}
              dur={20}
              style={{fontFamily: FONTS.display, fontSize: 110, lineHeight: 1, letterSpacing: '0.04em', color: COLORS.white, textShadow: `0 0 30px ${COLORS.red}`}}
            />
          </div>

          {/* title card */}
          {f >= B.title && (
            <AbsoluteFill>
              <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 46%, #0b2550 0%, ${COLORS.black} 60%)`, opacity: progress(f, B.title, 20)}} />
              <div style={{position: 'absolute', left: 540 - 80, top: 560, opacity: progress(f, B.title + 6, 14)}}>
                <Shield at={B.title + 4} size={160} />
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 780,
                  textAlign: 'center',
                  fontFamily: FONTS.display,
                  fontSize: 150,
                  lineHeight: 1,
                  color: COLORS.white,
                  letterSpacing: `${interpolate(f, [B.title, B.title + 80], [0.16, 0.04], {...clamp, easing: ease.out})}em`,
                  transform: `scale(${interpolate(tp, [0, 1], [1.6, 1]) * interpolate(f, [B.title, B.glitchOut], [1, 1.05], clamp)})`,
                  opacity: Math.min(1, tp * 1.4),
                  filter: `blur(${interpolate(f, [B.title, B.title + 8], [20, 0], clamp)}px)`,
                  textShadow: `0 0 30px ${COLORS.blue}, 0 0 110px ${COLORS.cyan}`,
                }}
              >
                {c.title}
              </div>
              <LightStreak y={870} opacity={interpolate(f, [B.title, B.title + 3, B.title + 40], [0, 1, 0.15], clamp)} width={interpolate(f, [B.title, B.title + 40], [0.2, 1.5], clamp)} />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 1000,
                  textAlign: 'center',
                  fontFamily: FONTS.display,
                  fontSize: 104,
                  letterSpacing: '0.08em',
                  color: COLORS.red,
                  textShadow: `0 0 34px ${COLORS.red}`,
                  opacity: f >= B.ready ? Math.min(1, pop(f, fps, B.ready, 15, 0.6) * 1.4) : 0,
                  transform: `translateY(${(1 - pop(f, fps, B.ready, 15, 0.6)) * 40}px)`,
                }}
              >
                {c.ready}
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, top: 1170, textAlign: 'center', opacity: progress(f, B.soon, 12)}}>
                <DecodeText text={c.soon} at={B.soon} dur={16} style={{fontFamily: FONTS.mono, fontWeight: 700, fontSize: 46, letterSpacing: 14, color: COLORS.white}} />
                <div style={{marginTop: 26, fontFamily: FONTS.body, fontWeight: 600, fontSize: 24, letterSpacing: 3, color: COLORS.grey, opacity: progress(f, B.soon + 12, 12)}}>{c.series}</div>
              </div>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      </Glitch>
      <Flash at={B.title} peak={0.9} color="#ffffff" dur={10} />
      <Flash at={B.glitchOut} peak={0.4} color={COLORS.red} dur={5} />
    </AbsoluteFill>
  );
};
