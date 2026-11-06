import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {PathwayScene} from '../../components/PathwayScene';
import {GEAR, Icon, LAPTOP} from '../../components/PixelIcons';
import {PixelSprite} from '../../components/PixelSprite';
import {COLORS, FONTS} from '../../config/theme';
import {snap} from '../../lib/anim';
import {cueAt} from '../../lib/timing';

const I = 9;
const TOKENS = ['</>', '{ }', '( )', ';', '=>', '[ ]'];
const TOKEN_COLORS = [COLORS.purple, COLORS.blue, COLORS.green, COLORS.red, COLORS.orange, COLORS.navy];

// Code symbols rise out of the laptop screen.
const CodeTokens: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  return (
    <>
      {TOKENS.map((tok, i) => {
        const life = 66;
        const t = ((frame - start + i * 11) % life) / life;
        return (
          <div
            key={tok}
            style={{
              position: 'absolute',
              left: 620 + ((i * 67) % 300),
              top: snap(1260 - t * 260, 4),
              opacity: t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85,
              fontFamily: FONTS.pixel,
              fontWeight: 700,
              fontSize: 44,
              color: COLORS.white,
              background: TOKEN_COLORS[i],
              padding: '2px 12px',
              border: `4px solid ${COLORS.text}`,
            }}
          >
            {tok}
          </div>
        );
      })}
    </>
  );
};

export const Scene10Software: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const coding = Math.round(cueAt(I, 'coding', 3.4) * fps) - 6;
  const apps = Math.round(cueAt(I, 'aplikasi', 4.4) * fps) - 6;
  // Gear turns in coarse steps, like a sprite animation.
  const gearRot = (Math.floor(frame / 8) % 4) * 22.5;
  return (
    <PathwayScene index={I} color={COLORS.purple} dark="#4A2C85" pose="explain" listCue="Kalau">
      <CodeTokens start={coding + 10} />
      <Icon sprite={LAPTOP} x={600} y={1300} px={14} delay={coding} bob={0} />
      <Icon sprite={GEAR} x={930} y={1180} px={9} delay={apps} bob={6} rotate={gearRot} />
      <div style={{position: 'absolute', left: 960, top: 1440, opacity: frame >= apps + 6 ? 1 : 0, transform: `rotate(${-gearRot}deg)`}}>
        <PixelSprite sprite={GEAR} px={6} palette={{B: COLORS.purple}} />
      </div>
    </PathwayScene>
  );
};
