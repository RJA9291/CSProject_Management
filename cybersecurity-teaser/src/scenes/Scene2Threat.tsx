import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';
import {Camera} from '../components/Camera';
import {Bokeh} from '../components/City';
import {Flash, ScanLines} from '../components/Effects';
import {Glitch, glitchAt} from '../components/Glitch';
import {clamp, ease, pop, progress} from '../components/motion';
import {DataBurst} from '../components/Particles';
import {Phone, Touch} from '../components/Phone';
import {Banner, ChatScreen, IncomingCall, PhishPage} from '../components/Screens';
import {TeaserContent} from '../data/content';
import {beat, scene} from '../data/timeline';
import {COLORS, FONTS} from '../theme';

const S = scene('threat');
const L = (abs: number) => abs - S.from;

const B = {
  msg: L(beat('msgArrive')),
  call: L(beat('callArrive')),
  tap: L(beat('clickTap')),
  parcel: L(beat('parcelArrive')),
  bank: L(beat('bankLink')),
  hesitate: L(beat('hesitate')),
  headline: L(beat('oneClickText')),
  exposed: L(beat('exposed')),
  end: S.to - S.from,
};

const RedPulse: React.FC<{strength: number}> = ({strength}) => {
  const f = useCurrentFrame();
  const beatPulse = Math.max(0, Math.sin(f / 4.5)) ** 6;
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        boxShadow: `inset 0 0 ${200 + beatPulse * 160}px ${60 + beatPulse * 60}px rgba(255,45,61,${0.35 * strength + beatPulse * 0.25 * strength})`,
      }}
    />
  );
};

export const Scene2Threat: React.FC<{content: TeaserContent}> = ({content}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const c = content.threat;
  const tension = interpolate(f, [0, B.exposed], [0.2, 1], clamp);
  const g = glitchAt(f, [0, B.call, B.tap, B.parcel, B.hesitate], 6, 0.7) + glitchAt(f, [B.exposed, B.exposed + 6, B.exposed + 14], 10, 1);
  const vibrate = f >= B.call && f < B.tap ? noise2D('vib', f * 0.9, 0) * 9 : 0;

  const scam = [{from: 'them' as const, text: c.scamMessage, link: c.scamLink, at: B.msg + 4}];

  return (
    <AbsoluteFill style={{background: COLORS.black}}>
      <Glitch intensity={Math.min(1, g)} seed={2}>
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${tension > 0.6 ? '#22060b' : COLORS.navyMid}, ${COLORS.black} 75%)`}}>
          <Bokeh opacity={0.35} blur={26} tint={['#ff2d3d', '#2f8cff', '#8a0b16', '#4fd8ff']} />
        </AbsoluteFill>

        {/* A – suspicious message */}
        {f < B.call && (
          <Camera dur={B.call} zoom={[1.0, 1.12]} rotate={[2, -1]} shake={4} seed="t1">
            <Phone y={-40} scale={0.8} rotateY={-8} rotateX={8} glow={COLORS.blue}>
              <ChatScreen title={c.scamSender} subtitle="Bukan dalam kenalan anda" unknown messages={scam} />
              <Banner app="Mesej" letter="M" color="#25a366" title={c.scamSender} text={c.scamMessage} p={progress(f, B.msg, 8) * (1 - progress(f, B.msg + 14, 8))} />
            </Phone>
          </Camera>
        )}

        {/* B – unknown incoming call */}
        {f >= B.call && f < B.tap && (
          <Camera from={B.call} dur={B.tap - B.call} zoom={[1.18, 1.1]} shake={6} seed="t2">
            <Phone y={-40} x={vibrate} scale={0.8} rotateZ={vibrate * 0.15} glow={COLORS.red}>
              <IncomingCall label={c.callerLabel} number={c.callerNumber} at={B.call} />
            </Phone>
          </Camera>
        )}

        {/* C – one click on the link */}
        {f >= B.tap && f < B.parcel && (
          <Camera from={B.tap} dur={B.parcel - B.tap} zoom={[1.3, 1.45]} y={[120, 160]} shake={3} seed="t3">
            <Phone y={-40} scale={0.8} rotateY={6} glow={COLORS.blue}
              overlay={<Touch x={170} y={322} press={progress(f, B.tap, 10)} visible={1} />}
            >
              <ChatScreen title={c.scamSender} subtitle="Bukan dalam kenalan anda" unknown messages={scam.map((m) => ({...m, at: -100}))} linkHighlight={progress(f, B.tap, 4)} />
            </Phone>
          </Camera>
        )}

        {/* D – parcel + bank notifications stack up */}
        {f >= B.parcel && f < B.hesitate && (
          <Camera from={B.parcel} dur={B.hesitate - B.parcel} zoom={[1.0, 1.1]} rotate={[-2, 1]} shake={4} seed="t4">
            <Phone y={-40} scale={0.8} rotateX={10} rotateY={-10} glow={COLORS.red}>
              <AbsoluteFill style={{background: 'linear-gradient(160deg, #0c1a33, #050811 60%, #1a0710)'}}>
                <div style={{position: 'absolute', top: 210, width: '100%', textAlign: 'center', fontFamily: FONTS.body, color: 'white'}}>
                  <div style={{fontSize: 120, fontWeight: 300, letterSpacing: -3}}>11:48</div>
                  <div style={{fontSize: 26, opacity: 0.8}}>Sabtu, 31 Oktober</div>
                </div>
              </AbsoluteFill>
              <Banner app={c.parcelApp} letter="P" color="#f5a623" title="Penghantaran Gagal" text={c.parcelMessage} p={pop(f, fps, B.parcel)} top={470} />
              <Banner app={c.bankApp} letter="B" color="linear-gradient(135deg,#1e6bff,#00c2ff)" title="AMARAN KESELAMATAN" text={`${c.bankMessage} ${c.bankLink}`} p={pop(f, fps, B.bank)} top={700} danger />
            </Phone>
          </Camera>
        )}

        {/* E – hesitation: slow-motion push-in on the "verify now" button */}
        {f >= B.hesitate && f < B.exposed && (
          <AbsoluteFill>
            {content.footage.hesitationCloseUp ? (
              <Camera from={B.hesitate} dur={B.exposed - B.hesitate} zoom={[1.0, 1.15]} shake={1}>
                <OffthreadVideo src={staticFile(content.footage.hesitationCloseUp)} muted playbackRate={0.6} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </Camera>
            ) : (
              <Camera from={B.hesitate} dur={B.exposed - B.hesitate} zoom={[1.05, 1.5]} y={[60, -260]} shake={1.5} seed="t5">
                <Phone y={40} scale={0.8} rotateX={12} glow={COLORS.red} glowStrength={1.3}
                  overlay={
                    <Touch
                      x={282 + Math.sin(f / 9) * 14}
                      y={1010 + Math.cos(f / 11) * 10}
                      press={0}
                      visible={progress(f, B.hesitate + 10, 12)}
                    />
                  }
                >
                  <PhishPage url={c.bankLink} bank={c.bankApp} message={c.bankMessage} button={c.bankButton} hover={0.4 + 0.6 * Math.abs(Math.sin(f / 5))} press={0} />
                </Phone>
              </Camera>
            )}
            {/* depth-of-field: darken + blur top and bottom so the headline reads */}
            <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(2,4,10,0.92) 0%, rgba(2,4,10,0.55) 32%, rgba(2,4,10,0) 50%, rgba(2,4,10,0.6) 85%)'}} />
            <Headline words={c.headline} start={B.headline} />
          </AbsoluteFill>
        )}

        {/* F – exposed */}
        {f >= B.exposed && (
          <AbsoluteFill>
            <Camera from={B.exposed} dur={B.end - B.exposed} zoom={[1.1, 1.3]} shake={14} seed="t6">
              <Phone y={-30} scale={0.8} glow={COLORS.red} glowStrength={2}>
                <AbsoluteFill style={{background: `radial-gradient(circle, ${COLORS.red}, #2a0006 70%)`}}>
                  <svg width="564" height="1204" style={{position: 'absolute'}}>
                    {[
                      'M282 600 L120 300 L60 120',
                      'M282 600 L460 380 L540 260',
                      'M282 600 L400 900 L520 1150',
                      'M282 600 L140 860 L30 1000',
                      'M282 600 L560 640',
                      'M282 600 L0 560',
                    ].map((d, i) => (
                      <path key={i} d={d} stroke="white" strokeWidth="3" fill="none" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - progress(f, B.exposed, 6)} opacity="0.85" />
                    ))}
                  </svg>
                  <div style={{position: 'absolute', top: 520, width: '100%', textAlign: 'center', fontFamily: FONTS.mono, fontWeight: 700, fontSize: 44, color: 'white', letterSpacing: 4}}>
                    {f % 6 < 4 ? 'DATA EXPOSED' : ''}
                  </div>
                </AbsoluteFill>
              </Phone>
            </Camera>
            <DataBurst at={B.exposed} labels={c.exposedLabels} cy={900} />
          </AbsoluteFill>
        )}

        <RedPulse strength={tension} />
        <ScanLines opacity={0.05 + tension * 0.05} />
      </Glitch>

      <Flash at={B.call} peak={0.4} color={COLORS.red} />
      <Flash at={B.tap} peak={0.6} color="#ffffff" />
      <Flash at={B.parcel} peak={0.3} />
      <Flash at={B.hesitate} peak={0.3} color={COLORS.red} />
      <Flash at={B.exposed} peak={0.9} color={COLORS.red} dur={10} />
    </AbsoluteFill>
  );
};

/** "ONE / CLICK / CAN CHANGE / EVERYTHING." stacked and revealed word by word. */
const Headline: React.FC<{words: string[]; start: number}> = ({words, start}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sizes = [150, 230, 120, 150];
  return (
    <div style={{position: 'absolute', top: 250, left: 0, right: 0, textAlign: 'center', fontFamily: FONTS.display, lineHeight: 0.92}}>
      {words.map((w, i) => {
        const at = start + i * 13;
        const s = pop(f, fps, at, 15, 0.5);
        const red = i === 1;
        return (
          <div
            key={w}
            style={{
              fontSize: sizes[i] ?? 140,
              color: red ? COLORS.red : COLORS.white,
              opacity: f >= at ? Math.min(1, s * 1.5) : 0,
              transform: `scale(${interpolate(s, [0, 1], [1.5, 1])})`,
              filter: `blur(${interpolate(f, [at, at + 5], [12, 0], clamp)}px)`,
              letterSpacing: `${interpolate(f, [at, at + 30], [0.2, 0.04], {...clamp, easing: ease.out})}em`,
              textShadow: red ? `0 0 40px ${COLORS.red}, 0 0 90px ${COLORS.red}` : `0 0 30px rgba(0,0,0,0.9)`,
            }}
          >
            {w}
          </div>
        );
      })}
    </div>
  );
};
