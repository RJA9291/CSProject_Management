import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Camera} from '../components/Camera';
import {Counter} from '../components/Counter';
import {DigitalGrid, Flash, LightStreak, ScanLines} from '../components/Effects';
import {Glitch, glitchAt} from '../components/Glitch';
import {DecodeText} from '../components/KineticText';
import {MalaysiaMap} from '../components/MalaysiaMap';
import {clamp, ease, pop, progress} from '../components/motion';
import {Particles} from '../components/Particles';
import {TeaserContent} from '../data/content';
import {beat, scene} from '../data/timeline';
import {COLORS, FONTS, SAFE} from '../theme';

const S = scene('reality');
const L = (abs: number) => abs - S.from;

const B = {
  map: L(beat('mapIn')),
  cases: L(beat('casesIn')),
  source: L(beat('sourceIn')),
  losses: L(beat('lossesIn')),
  age: L(beat('ageIn')),
  blue: L(beat('blueTurn')),
};

const label: React.CSSProperties = {fontFamily: FONTS.mono, fontWeight: 700, letterSpacing: 3, color: COLORS.grey};

export const Scene3Reality: React.FC<{content: TeaserContent}> = ({content}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const r = content.reality;

  const heat = interpolate(f, [B.cases, B.cases + 30], [0, 1], clamp);
  const g = glitchAt(f, [0, B.cases, B.losses, B.age], 6, 0.6);
  const casesPop = pop(f, fps, B.cases, 13, 0.7);
  const lossPop = pop(f, fps, B.losses, 13, 0.7);
  const agePop = pop(f, fps, B.age, 14, 0.7);
  // when the age group arrives, cases + losses compact into a row
  const compact = interpolate(f, [B.age - 14, B.age + 4], [0, 1], {...clamp, easing: ease.inOut});
  const bump = (at: number) => interpolate(f, [at, at + 3, at + 14], [1, 1.06, 1], clamp);

  return (
    <AbsoluteFill style={{background: COLORS.black}}>
      <Glitch intensity={g} seed={3}>
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 30%, ${heat > 0.5 ? '#1a0a14' : COLORS.navyMid}, ${COLORS.black} 70%)`}} />
        <DigitalGrid color={heat > 0.5 ? '#ff2d3d' : COLORS.blue} opacity={0.18} />
        <Particles count={70} color={heat > 0.5 ? '#ff6b75' : COLORS.cyan} speed={0.8} opacity={0.5} size={3} />

        {/* Map */}
        <Camera dur={150} zoom={[1.3, 0.94]} y={[120, -10]} shake={2} seed="map">
          <div style={{position: 'absolute', top: 350, left: 40, width: 1000}}>
            <MalaysiaMap start={B.map} heat={heat} width={1000} />
          </div>
        </Camera>

        {/* header */}
        <div style={{position: 'absolute', top: SAFE.top - 20, left: 0, right: 0, textAlign: 'center', opacity: progress(f, B.map + 10, 12)}}>
          <DecodeText text={`MALAYSIA  •  ${r.period}`} at={B.map + 10} style={{...label, fontSize: 30, color: COLORS.ice}} />
        </div>

        {/* stats block */}
        <div style={{position: 'absolute', top: 830, left: SAFE.side, right: SAFE.side, height: 520}}>
          {/* cases */}
          <div
            style={{
              position: 'absolute',
              left: interpolate(compact, [0, 1], [0, 0]),
              width: interpolate(compact, [0, 1], [936, 460]),
              top: interpolate(compact, [0, 1], [0, -40]),
              textAlign: compact > 0.5 ? 'left' : 'center',
              opacity: f >= B.cases ? Math.min(1, casesPop * 1.4) : 0,
              transform: `scale(${interpolate(casesPop, [0, 1], [1.4, 1]) * bump(B.cases + 45)})`,
              transformOrigin: compact > 0.5 ? 'left top' : 'center top',
            }}
          >
            <div
              style={{
                fontFamily: FONTS.display,
                fontSize: interpolate(compact, [0, 1], [250, 120]),
                lineHeight: 0.9,
                color: COLORS.white,
                textShadow: `0 0 40px ${COLORS.red}, 0 0 100px ${COLORS.red}88`,
              }}
            >
              <Counter to={r.cases} at={B.cases} dur={45} />
            </div>
            <div style={{...label, fontSize: interpolate(compact, [0, 1], [34, 22]), color: COLORS.red, marginTop: 6}}>
              CASES
            </div>
            <div style={{...label, fontSize: interpolate(compact, [0, 1], [24, 18]), marginTop: 6, color: COLORS.ice, opacity: 1 - compact * 0.3}}>
              {compact > 0.5 ? 'TELECOM CRIME' : r.casesLabel}
            </div>
          </div>

          {/* losses */}
          <div
            style={{
              position: 'absolute',
              left: interpolate(compact, [0, 1], [0, 476]),
              width: interpolate(compact, [0, 1], [936, 460]),
              top: interpolate(compact, [0, 1], [345, -40]),
              textAlign: compact > 0.5 ? 'left' : 'center',
              opacity: f >= B.losses ? Math.min(1, lossPop * 1.4) : 0,
              transform: `translateY(${(1 - lossPop) * 60}px)`,
            }}
          >
            <div style={{fontFamily: FONTS.display, fontSize: interpolate(compact, [0, 1], [136, 120]), lineHeight: 0.9, color: COLORS.white, textShadow: `0 0 30px ${COLORS.amber}88`}}>
              {compact > 0.5 ? 'RM715 MIL' : r.losses}
            </div>
            <div style={{...label, fontSize: interpolate(compact, [0, 1], [30, 22]), color: COLORS.amber, marginTop: 6}}>{r.lossesLabel}</div>
          </div>

          {/* age group */}
          {f >= B.age - 2 && (
            <div style={{position: 'absolute', top: 150, left: 0, right: 0, opacity: Math.min(1, agePop * 1.5), transform: `translateY(${(1 - agePop) * 80}px)`}}>
              <div style={{height: 2, background: `linear-gradient(90deg, transparent, ${COLORS.red}, transparent)`, marginBottom: 26}} />
              <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
                <div>
                  <div style={{...label, fontSize: 24, color: COLORS.ice}}>AGE GROUP</div>
                  <div style={{fontFamily: FONTS.display, fontSize: 190, lineHeight: 0.9, color: COLORS.red, textShadow: `0 0 50px ${COLORS.red}`}}>{r.ageGroup}</div>
                </div>
                <div style={{...label, fontSize: 22, textAlign: 'right', maxWidth: 380, lineHeight: 1.4, color: COLORS.ice}}>{r.ageLabel}</div>
              </div>
              <div style={{marginTop: 22}}>
                {r.ageBars.map((b, i) => {
                  const max = Math.max(...r.ageBars.map((x) => x.value));
                  const grow = progress(f, B.age + 8 + i * 8, 24, ease.out);
                  return (
                    <div key={b.label} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 12}}>
                      <div style={{...label, width: 120, fontSize: 24, color: i === 0 ? COLORS.white : COLORS.grey}}>{b.label}</div>
                      <div style={{flex: 1, height: 34, background: 'rgba(255,255,255,0.06)', borderRadius: 4}}>
                        <div style={{width: `${(b.value / max) * 100 * grow}%`, height: '100%', borderRadius: 4, background: i === 0 ? `linear-gradient(90deg, ${COLORS.redDeep}, ${COLORS.red})` : COLORS.greyDark, boxShadow: i === 0 ? `0 0 24px ${COLORS.red}` : 'none'}} />
                      </div>
                      <div style={{...label, width: 130, textAlign: 'right', fontSize: 24, color: i === 0 ? COLORS.white : COLORS.grey}}>
                        {Math.round(b.value * grow).toLocaleString('en-US')}
                      </div>
                    </div>
                  );
                })}
                <div style={{...label, fontSize: 18, marginTop: 10, textAlign: 'right'}}>VICTIMS</div>
              </div>
            </div>
          )}
        </div>

        <LightStreak y={1000} opacity={interpolate(f, [B.cases, B.cases + 3, B.cases + 22], [0, 0.9, 0], clamp)} color={COLORS.red} />

        {/* source citation */}
        <div
          style={{
            position: 'absolute',
            left: SAFE.side,
            right: SAFE.side,
            top: SAFE.top + 34,
            textAlign: 'center',
            fontFamily: FONTS.body,
            fontSize: 20,
            lineHeight: 1.35,
            color: '#8fa0bd',
            opacity: progress(f, B.source, 15),
          }}
        >
          {r.source}
          <br />
          <span style={{color: '#6b7a94'}}>{r.note}</span>
        </div>
        <ScanLines opacity={0.05} />
      </Glitch>
      <Flash at={B.cases} peak={0.55} color={COLORS.red} dur={8} />
      <Flash at={B.losses} peak={0.35} color={COLORS.amber} dur={6} />
      <Flash at={B.age} peak={0.45} color={COLORS.red} dur={8} />
    </AbsoluteFill>
  );
};
