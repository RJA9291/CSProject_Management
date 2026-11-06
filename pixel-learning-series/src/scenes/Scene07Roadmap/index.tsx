import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {LfcaBadge} from '../../components/Badge';
import {Connector} from '../../components/Connector';
import {CardHeader} from '../../components/InfographicCard';
import {LAPTOP, SERVER, SHIELD} from '../../components/PixelIcons';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SCENES} from '../../config/scenes';
import {COLORS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {cueAt} from '../../lib/timing';

const I = 6;

export const PATHS = [
  {color: COLORS.blue, dark: COLORS.navy, icon: SERVER, iconPx: 5},
  {color: COLORS.green, dark: '#1F6B43', icon: SHIELD, iconPx: 6},
  {color: COLORS.purple, dark: '#4A2C85', icon: LAPTOP, iconPx: 6},
];

const CARD_Y = [830, 1060, 1290];

export const Scene07Roadmap: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cfg = SCENES[I];
  const labels = cfg.list ?? [];
  const tiga = cueAt(I, 'tiga', 2.0);
  const starts = PATHS.map((_, i) => Math.round((tiga - 0.3 + i * 0.6) * fps));
  const badge = pop(frame, fps, 6, 9);
  return (
    <SceneFrame index={I} extraSfx={starts.map((f) => ({at: f / fps, sfx: 'blip' as const}))}>
      <PixelText text={cfg.text.headline} size={104} effect="pop" delay={2} stagger={6} style={{position: 'absolute', top: 190, left: 0, right: 0}} />
      <div style={{position: 'absolute', left: 405, top: 430, transform: `scale(${badge})`}}>
        <LfcaBadge px={10} />
      </div>
      {PATHS.map((p, i) => {
        const progress = interpolate(frame, [starts[i] - 14, starts[i]], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        const y = CARD_Y[i] + 70;
        return <Connector key={i} points={[[540, 700], [540, 760], [130, 760], [130, y], [200, y]]} progress={progress} color={p.color} march={frame * 0.6} />;
      })}
      {PATHS.map((p, i) => (
        <CardHeader
          key={i}
          title={labels[i]}
          color={p.color}
          dark={p.dark}
          delay={starts[i]}
          size={56}
          icon={<PixelSprite sprite={p.icon} px={p.iconPx} />}
          style={{position: 'absolute', left: 200, top: CARD_Y[i], width: 820}}
        />
      ))}
    </SceneFrame>
  );
};
