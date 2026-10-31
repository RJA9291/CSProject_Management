import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Camera} from '../components/Camera';
import {DigitalGrid, Flash, LightStreak} from '../components/Effects';
import {Glitch, glitchAt} from '../components/Glitch';
import {DecodeText} from '../components/KineticText';
import {clamp, ease, pop, progress} from '../components/motion';
import {Particles} from '../components/Particles';
import {NodeSphere, PillarIcon, Shield} from '../components/ShieldNetwork';
import {TeaserContent} from '../data/content';
import {beat, scene, TL} from '../data/timeline';
import {COLORS, FONTS, SAFE} from '../theme';

// This scene starts at the "blueTurn" beat so it can wipe over the end of Scene 3.
export const INTRO_FROM = beat('blueTurn');
export const INTRO_TO = scene('cliffhanger').from + 30;
const L = (abs: number) => abs - INTRO_FROM;

const B = {
  wipe: 0,
  welcome: L(TL.vo.s4_1) + 4,
  title: L(beat('cyberWord')),
  notJust: L(TL.vo.s4_2),
  shield: L(TL.vo.s4_3) - 6,
  pillars: [L(beat('identity')), L(beat('data')), L(beat('money')), L(beat('digitalLife'))],
  out: INTRO_TO - INTRO_FROM,
};

export const Scene4Intro: React.FC<{content: TeaserContent}> = ({content}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = content.intro;

  const wipe = interpolate(f, [0, 26], [0, 160], {...clamp, easing: ease.inOut});
  const titlePop = pop(f, fps, B.title, 15, 0.7);
  const titleUp = interpolate(f, [B.shield - 10, B.shield + 14], [0, 1], {...clamp, easing: ease.inOut});
  const fadeOut = interpolate(f, [B.out - 36, B.out], [1, 0], clamp);
  const g = glitchAt(f, [B.title], 5, 0.5);

  return (
    <AbsoluteFill style={{clipPath: `circle(${wipe}% at 50% 50%)`, opacity: fadeOut}}>
      <Glitch intensity={g} seed={4}>
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 42%, #0d2a5c 0%, ${COLORS.navy} 45%, ${COLORS.black} 85%)`}} />
        <DigitalGrid color={COLORS.blue} opacity={0.35} speed={0.6} />
        <Particles count={90} color={COLORS.cyan} speed={0.6} opacity={0.6} size={3} />

        <Camera dur={B.out} zoom={[1.15, 1.0]} shake={2} seed="intro">
          <AbsoluteFill style={{opacity: interpolate(f, [B.shield, B.shield + 20], [1, 0.55], clamp)}}>
            <NodeSphere start={10} radius={430} cy={interpolate(titleUp, [0, 1], [900, 760])} />
          </AbsoluteFill>
        </Camera>

        {/* "WELCOME TO THE WORLD OF" + CYBERSECURITY */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: interpolate(titleUp, [0, 1], [760, SAFE.top + 10]),
            textAlign: 'center',
            transform: `scale(${interpolate(titleUp, [0, 1], [1, 0.62])})`,
            transformOrigin: 'center top',
          }}
        >
          <div style={{opacity: progress(f, B.welcome, 8) * (1 - titleUp)}}>
            <DecodeText text={c.welcome} at={B.welcome} dur={22} style={{fontFamily: FONTS.mono, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: COLORS.ice}} />
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: FONTS.display,
              fontSize: 168,
              lineHeight: 1,
              letterSpacing: `${interpolate(f, [B.title, B.title + 50], [0.3, 0.05], {...clamp, easing: ease.out})}em`,
              color: COLORS.white,
              opacity: f >= B.title ? Math.min(1, titlePop * 1.5) : 0,
              transform: `scale(${interpolate(titlePop, [0, 1], [1.3, 1])})`,
              filter: `blur(${interpolate(f, [B.title, B.title + 6], [16, 0], clamp)}px)`,
              textShadow: `0 0 30px ${COLORS.blue}, 0 0 90px ${COLORS.cyan}`,
            }}
          >
            {c.title}
          </div>
          <div
            style={{
              marginTop: 18,
              fontFamily: FONTS.mono,
              fontWeight: 700,
              fontSize: 30,
              letterSpacing: 5,
              color: COLORS.grey,
              opacity: progress(f, B.notJust, 8) * (1 - titleUp),
            }}
          >
            {c.notJust}
          </div>
        </div>
        <LightStreak y={880} opacity={interpolate(f, [B.title, B.title + 4, B.title + 26], [0, 1, 0], clamp)} width={interpolate(f, [B.title, B.title + 26], [0.3, 1.4], clamp)} />

        {/* shield */}
        {f >= B.shield && (
          <div style={{position: 'absolute', left: 540 - 190, top: 520, opacity: progress(f, B.shield, 10)}}>
            <Shield at={B.shield} size={380} />
          </div>
        )}

        {/* pillars, one by one */}
        <div style={{position: 'absolute', left: SAFE.side + 60, right: SAFE.side, top: 960}}>
          {c.pillars.map((p, i) => {
            const at = B.pillars[i];
            const s = pop(f, fps, at, 14, 0.6);
            const last = i === c.pillars.length - 1;
            return (
              <div
                key={p}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 26,
                  height: 96,
                  opacity: f >= at ? Math.min(1, s * 1.4) : 0,
                  transform: `translateX(${(1 - s) * -80}px)`,
                }}
              >
                <PillarIcon kind={i} color={last ? COLORS.cyan : COLORS.ice} size={74} />
                <div
                  style={{
                    fontFamily: FONTS.display,
                    fontSize: 92,
                    letterSpacing: '0.04em',
                    color: last ? COLORS.cyan : COLORS.white,
                    textShadow: `0 0 26px ${COLORS.blue}`,
                  }}
                >
                  {p}
                </div>
              </div>
            );
          })}
        </div>
      </Glitch>
      {/* the wipe's leading edge */}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          opacity: interpolate(f, [0, 4, 26, 32], [0, 1, 1, 0], clamp),
          background: `radial-gradient(circle at 50% 50%, transparent ${Math.max(0, wipe * 0.62 - 4)}%, ${COLORS.cyan} ${wipe * 0.62}%, transparent ${wipe * 0.62 + 3}%)`,
          mixBlendMode: 'screen',
        }}
      />
      <Flash at={B.title} peak={0.45} color={COLORS.cyan} dur={8} />
      {B.pillars.map((p) => (
        <Flash key={p} at={p} peak={0.12} color={COLORS.cyan} dur={5} />
      ))}
    </AbsoluteFill>
  );
};
