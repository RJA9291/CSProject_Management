import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {PixelBackground} from '../../components/PixelBackground';
import {FONTS} from '../../config/theme';
import {snap} from '../../lib/anim';
import {EP03_THEME} from '../config/theme';

type Props = {
  // Frame where the dark-navy "threat mode" starts (0 = from the start, Infinity = never).
  navyFrom?: number;
  // Frame where it fades back to the safe beige world.
  navyUntil?: number;
  // Frame where the red pixel alarm frame starts flashing; alarmUntil stops it.
  alarmFrom?: number;
  alarmUntil?: number;
  // 'tech' keeps the navy world calm (blue/cyan only) for non-threat technology scenes.
  tone?: 'threat' | 'tech';
};

const BITS = Array.from({length: 16}, (_, i) => ({
  x: 30 + random(`bx${i}`) * 1020,
  y: random(`by${i}`) * 1920,
  speed: 1.2 + random(`bs${i}`) * 1.6,
  size: [22, 28, 34][i % 3],
  red: i % 5 === 0,
}));

const GLINTS = Array.from({length: 12}, (_, i) => ({
  x: random(`gx${i}`) * 1080,
  y: random(`gy${i}`) * 1920,
  size: [8, 12, 16][i % 3],
  speed: 0.3 + random(`gv${i}`) * 0.5,
  color: [EP03_THEME.cyan, EP03_THEME.red, EP03_THEME.blue][i % 3],
}));

// Episode 03 world: the series' dotted beige background, switching to a dark-navy cyber-threat
// mode (binary rain, red/cyan pixels, optional flashing alarm frame) when a threat is on screen.
export const CyberBackground: React.FC<Props> = ({navyFrom = 0, navyUntil = Infinity, alarmFrom = Infinity, alarmUntil = Infinity, tone = 'threat'}) => {
  const frame = useCurrentFrame();
  // interpolate() needs finite ranges: "never" becomes a frame far past any scene.
  const NEVER = 1e6;
  navyFrom = Math.min(navyFrom, NEVER);
  navyUntil = Math.min(navyUntil, NEVER);
  const on = interpolate(frame, [navyFrom, navyFrom + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const off = interpolate(frame, [navyUntil, navyUntil + 10], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Stepped opacity keeps the fade pixel-like.
  const level = Math.round(on * off * 5) / 5;
  const alarm = frame >= alarmFrom && frame < alarmUntil && Math.floor((frame - alarmFrom) / 6) % 2 === 0;
  const drift = (frame * 0.4) % 48;
  return (
    <AbsoluteFill>
      {level < 1 ? <PixelBackground /> : null}
      {level > 0 ? (
        <AbsoluteFill style={{opacity: level, background: EP03_THEME.navy}}>
          <svg width="1080" height="1920" style={{position: 'absolute'}} shapeRendering="crispEdges">
            <defs>
              <pattern id="navydots" width="48" height="48" patternUnits="userSpaceOnUse" patternTransform={`translate(${drift} ${drift})`}>
                <rect x="20" y="20" width="6" height="6" fill="#24498F" />
              </pattern>
            </defs>
            <rect width="1080" height="1920" fill="url(#navydots)" />
          </svg>
          {BITS.map((b, i) => {
            const y = ((b.y + frame * b.speed * 3) % 2000) - 80;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: snap(b.x, 4),
                  top: snap(y, 4),
                  fontFamily: FONTS.pixel,
                  fontWeight: 700,
                  fontSize: b.size,
                  color: b.red && tone === 'threat' ? EP03_THEME.red : tone === 'tech' && b.red ? EP03_THEME.cyan : EP03_THEME.blue,
                  opacity: 0.45,
                  lineHeight: 1,
                }}
              >
                {Math.floor((frame + i * 7) / 9) % 2 ? '1' : '0'}
                <br />
                {Math.floor((frame + i * 3) / 11) % 2 ? '0' : '1'}
              </div>
            );
          })}
          {GLINTS.map((p, i) => {
            const y = (((p.y - frame * p.speed * 2) % 1920) + 1920) % 1920;
            return <div key={i} style={{position: 'absolute', left: snap(p.x, 4), top: snap(y, 4), width: p.size, height: p.size, background: tone === 'tech' && p.color === EP03_THEME.red ? EP03_THEME.green : p.color, opacity: 0.35}} />;
          })}
        </AbsoluteFill>
      ) : null}
      {alarm ? (
        <AbsoluteFill style={{boxShadow: `inset 0 0 0 24px ${EP03_THEME.red}`, background: 'rgba(201,52,52,0.10)'}}>
          {/* stepped inner corners */}
          {[
            [24, 24],
            [1032, 24],
            [24, 1872],
            [1032, 1872],
          ].map(([x, y], i) => (
            <div key={i} style={{position: 'absolute', left: x, top: y, width: 24, height: 24, background: EP03_THEME.red}} />
          ))}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
