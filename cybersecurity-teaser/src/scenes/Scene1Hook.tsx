import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame} from 'remotion';
import {Camera} from '../components/Camera';
import {Bokeh, KLSkyline, Rain} from '../components/City';
import {Flash, LightStreak} from '../components/Effects';
import {Glitch, glitchAt} from '../components/Glitch';
import {SlamWord} from '../components/KineticText';
import {clamp, ease, progress} from '../components/motion';
import {Phone, Touch} from '../components/Phone';
import {BankTransfer, ChatScreen, ShopScreen, SocialFeed} from '../components/Screens';
import {ProfileSilhouette} from '../components/Silhouette';
import {TeaserContent} from '../data/content';
import {beat, scene, TL} from '../data/timeline';
import {COLORS} from '../theme';

const S = scene('hook');
const L = (abs: number) => abs - S.from;
const vo = TL.vo;

// Shot boundaries follow the narration ("click / scroll / shop / transfer / share").
const SHOTS = {
  click: [L(0), L(vo.s1_2)],
  scroll: [L(vo.s1_2), L(vo.s1_3)],
  shop: [L(vo.s1_3), L(vo.s1_4)],
  transfer: [L(vo.s1_4), L(vo.s1_5)],
  share: [L(vo.s1_5), L(vo.s1_6)],
  question: [L(vo.s1_6), S.to - S.from],
} as const;

const inShot = (f: number, k: keyof typeof SHOTS) => f >= SHOTS[k][0] && f < SHOTS[k][1];

const WORD_Y = -640; // kinetic words sit in the upper third, clear of the phone

const Backdrop: React.FC<{tint?: string}> = ({tint = COLORS.navy}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 40%, ${tint}, ${COLORS.black} 75%)`}}>
    <Bokeh opacity={0.55} blur={22} />
  </AbsoluteFill>
);

export const Scene1Hook: React.FC<{content: TeaserContent}> = ({content}) => {
  const f = useCurrentFrame();
  const words = content.hook.words;
  const g = glitchAt(f, [0, 2, SHOTS.scroll[0], SHOTS.shop[0], SHOTS.transfer[0], SHOTS.share[0], SHOTS.question[0], L(beat('safeText'))], 6, 0.8);

  return (
    <AbsoluteFill style={{background: COLORS.black}}>
      <Glitch intensity={g} seed={1}>
        {/* SHOT 1 – silhouette at night, phone light on face */}
        {inShot(f, 'click') && (
          <AbsoluteFill>
            {content.footage.heroScrolling ? (
              <Camera dur={44} zoom={[1.15, 1.05]} shake={2}>
                <OffthreadVideo src={staticFile(content.footage.heroScrolling)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,11,26,0.5), rgba(2,4,10,0.75))'}} />
              </Camera>
            ) : (
              <Camera dur={44} zoom={[1.18, 1.05]} x={[30, -10]} shake={3}>
                <AbsoluteFill style={{background: `linear-gradient(180deg, #071226 0%, ${COLORS.black} 70%)`}} />
                <KLSkyline y={1180} scale={1.15} />
                <Bokeh count={22} opacity={0.45} blur={18} />
                <Rain opacity={0.22} />
                <ProfileSilhouette glow={0.7 + 0.3 * Math.sin(f / 4)} x={-260} y={520} scale={1.05} />
                {/* phone glow under the face */}
                <div
                  style={{
                    position: 'absolute',
                    left: 520,
                    top: 1250,
                    width: 520,
                    height: 340,
                    borderRadius: '50%',
                    background: `radial-gradient(closest-side, ${COLORS.cyan}aa, ${COLORS.blue}33 60%, transparent)`,
                    opacity: 0.8 + 0.2 * Math.sin(f / 3),
                  }}
                />
                <div style={{position: 'absolute', left: 660, top: 1290, width: 150, height: 290, borderRadius: 26, background: '#0b0f18', border: '3px solid #2b3240', transform: 'perspective(800px) rotateX(58deg) rotateZ(-28deg)', boxShadow: `0 -30px 90px 20px ${COLORS.cyan}66`}}>
                  <div style={{position: 'absolute', inset: 6, borderRadius: 20, background: `linear-gradient(160deg, #e6f4ff, ${COLORS.cyan} 60%, ${COLORS.blue})`, opacity: 0.85 + 0.15 * Math.sin(f / 3)}} />
                </div>
              </Camera>
            )}
            <SlamWord text={words[0]} at={L(vo.s1_1) + 14} out={SHOTS.click[1] - 6} y={WORD_Y} size={210} />
          </AbsoluteFill>
        )}

        {/* SHOT 2 – scroll */}
        {inShot(f, 'scroll') && (
          <AbsoluteFill>
            <Backdrop />
            <Camera from={SHOTS.scroll[0]} dur={30} zoom={[1.0, 1.08]} rotate={[-3, -1]} shake={5} seed="s2">
              <Phone y={-30} scale={0.8} rotateY={-14} rotateX={8}
                overlay={<Touch x={290} y={interpolate(f, [SHOTS.scroll[0], SHOTS.scroll[1]], [900, 400], clamp)} press={0.2} visible={1} />}
              >
                <SocialFeed scroll={interpolate(f, [SHOTS.scroll[0], SHOTS.scroll[1]], [200, 1700], {...clamp, easing: ease.inOut})} />
              </Phone>
            </Camera>
            <SlamWord text={words[1]} at={SHOTS.scroll[0] + 2} y={WORD_Y} size={210} />
          </AbsoluteFill>
        )}

        {/* SHOT 3 – shop */}
        {inShot(f, 'shop') && (
          <AbsoluteFill>
            <Backdrop tint="#1a0f0a" />
            <Camera from={SHOTS.shop[0]} dur={28} zoom={[1.12, 1.0]} rotate={[2, 0]} shake={5} seed="s3">
              <Phone y={-30} scale={0.8} rotateY={12} rotateX={6} glow="#ff7a18"
                overlay={<Touch x={282} y={1080} press={progress(f, SHOTS.shop[0] + 12, 10)} visible={f > SHOTS.shop[0] + 8 ? 1 : 0} />}
              >
                <ShopScreen added={progress(f, SHOTS.shop[0] + 12, 12)} scroll={interpolate(f, [SHOTS.shop[0], SHOTS.shop[1]], [0, 60], clamp)} />
              </Phone>
            </Camera>
            <SlamWord text={words[2]} at={SHOTS.shop[0] + 2} y={WORD_Y} size={210} glow="#ff7a18" />
          </AbsoluteFill>
        )}

        {/* SHOT 4 – transfer money */}
        {inShot(f, 'transfer') && (
          <AbsoluteFill>
            <Backdrop tint="#06173a" />
            <Camera from={SHOTS.transfer[0]} dur={40} zoom={[1.0, 1.1]} y={[0, -20]} shake={4} seed="s4">
              <Phone y={-30} scale={0.8} rotateX={10} rotateY={-6}>
                <BankTransfer p={progress(f, SHOTS.transfer[0], 34, ease.inOut)} />
              </Phone>
            </Camera>
            <SlamWord text={words[3]} at={SHOTS.transfer[0] + 2} y={WORD_Y} size={190} />
          </AbsoluteFill>
        )}

        {/* SHOT 5 – share personal information */}
        {inShot(f, 'share') && (
          <AbsoluteFill>
            <Backdrop />
            <Camera from={SHOTS.share[0]} dur={70} zoom={[1.0, 1.14]} rotate={[-2, 1]} shake={4} seed="s5">
              <Phone y={-30} scale={0.8} rotateY={10} rotateX={6}>
                <ChatScreen
                  title="Encik Firdaus (Ejen)"
                  subtitle="dalam talian"
                  avatar="#2b5876"
                  messages={[
                    {from: 'them', text: 'Boleh share No. IC dan alamat untuk borang?', at: SHOTS.share[0] + 2},
                    {from: 'me', text: 'IC: 95••••-10-••••', at: SHOTS.share[0] + 18},
                    {from: 'me', text: 'No. 12, Jalan •••••, Shah Alam', at: SHOTS.share[0] + 34},
                  ]}
                  typingAt={SHOTS.share[0] + 50}
                />
              </Phone>
            </Camera>
            <SlamWord text={words[4]} at={SHOTS.share[0] + 2} y={WORD_Y} size={210} />
          </AbsoluteFill>
        )}

        {/* SHOT 6 – the question */}
        {inShot(f, 'question') && (
          <AbsoluteFill>
            <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 55%, #1a0508, ${COLORS.black} 70%)`}} />
            <Camera from={SHOTS.question[0]} dur={52} zoom={[1.0, 1.12]} shake={2} seed="s6">
              <Phone y={260} scale={0.62} rotateX={14} glow={COLORS.red} glowStrength={1.4}>
                <AbsoluteFill style={{background: '#0b0306'}}>
                  <div style={{position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 45%, ${COLORS.red}66, transparent 60%)`, opacity: 0.6 + 0.4 * Math.sin(f / 2)}} />
                </AbsoluteFill>
              </Phone>
            </Camera>
            <SlamWord text={content.hook.question} at={SHOTS.question[0] + 2} y={-420} size={130} glow={COLORS.blue} />
            <SlamWord text={content.hook.questionAccent} at={L(beat('safeText'))} y={-270} size={175} color={COLORS.white} glow={COLORS.red} />
            <LightStreak y={960 - 270 + 90} opacity={interpolate(f, [L(beat('safeText')), L(beat('safeText')) + 4, L(beat('safeText')) + 20], [0, 1, 0], clamp)} color={COLORS.red} />
          </AbsoluteFill>
        )}
      </Glitch>

      <Flash at={0} dur={5} peak={0.9} color={COLORS.cyan} />
      <Flash at={SHOTS.scroll[0]} peak={0.35} />
      <Flash at={SHOTS.shop[0]} peak={0.35} />
      <Flash at={SHOTS.transfer[0]} peak={0.35} />
      <Flash at={SHOTS.share[0]} peak={0.35} />
      <Flash at={L(beat('safeText'))} peak={0.5} color={COLORS.red} dur={8} />
      {/* fade from black to grab attention on frame 0 */}
      <AbsoluteFill style={{background: 'black', opacity: interpolate(f, [0, 3], [1, 0], clamp), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
