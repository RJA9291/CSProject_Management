import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {snap} from '../../lib/anim';
import {Banner, Reveal, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {DESKTOP, POINTER} from '../assets/icons';
import {Terminal} from '../components/Terminal';
import {Tux} from '../components/Tux';
import {SCENES} from '../config/scenes';
import {EP05_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 7;

// Mouse pointer gliding between desktop icons, with a click flash on arrival.
const Pointer: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const path: [number, number][] = [
    [380, 900],
    [150, 610],
    [330, 700],
    [140, 760],
  ];
  const t = (frame - start) / 22;
  const seg = Math.min(path.length - 2, Math.floor(t) % (path.length - 1));
  const k = Math.min(1, t - Math.floor(t));
  const [a, b] = [path[seg], path[seg + 1]];
  const x = interpolate(k, [0, 1], [a[0], b[0]]);
  const y = interpolate(k, [0, 1], [a[1], b[1]]);
  const click = k > 0.85;
  return (
    <>
      {click ? <div style={{position: 'absolute', left: snap(b[0] - 20), top: snap(b[1] - 20), width: 40, height: 40, border: `6px solid ${EP05_THEME.orange}`}} /> : null}
      <div style={{position: 'absolute', left: snap(x, 4), top: snap(y, 4)}}>
        <PixelSprite sprite={POINTER} px={6} />
      </div>
    </>
  );
};

export const Ep05Scene08GuiCli: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const guiAt = 8;
  const mouseAt = f('ikon', 1.6) - 4;
  const cliAt = f('CLI', 4.4) - 4;
  const typeAt = f('arahan', 5.6);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[{at: guiAt / fps, sfx: 'pop'}, {at: (mouseAt + 22) / fps, sfx: 'click'}, {at: (mouseAt + 44) / fps, sfx: 'click'}, {at: cliAt / fps, sfx: 'pop'}]}
    >
      <TitleCard text={cfg.text.headline} size={84} />
      <Banner text={cfg.text.sub} top={340} delay={6} bg={EP05_THEME.navy} size={40} />
      <Reveal delay={guiAt} mode="slideLeft" style={{left: 40, top: 440, width: 490, height: 560}}>
        <PixelBox bg={COLORS.white} border={EP05_THEME.blue} padding="12px 16px" style={{height: '100%'}}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 56, color: EP05_THEME.blue, textAlign: 'center', lineHeight: 1}}>GUI</div>
          <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 26, color: COLORS.text, textAlign: 'center'}}>{cfg.text.gui}</div>
          <div style={{display: 'flex', justifyContent: 'center', marginTop: 16}}>
            <PixelSprite sprite={DESKTOP()} px={16} />
          </div>
          <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 26, color: EP05_THEME.navy, textAlign: 'center', marginTop: 10}}>Ikon • Menu • Mouse</div>
        </PixelBox>
      </Reveal>
      <Pointer start={mouseAt} />
      <Reveal delay={cliAt} mode="slideRight" style={{left: 550, top: 440, width: 490, height: 560}}>
        <PixelBox bg={COLORS.white} border={EP05_THEME.green} padding="12px 16px" style={{height: '100%'}}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 56, color: EP05_THEME.green, textAlign: 'center', lineHeight: 1}}>CLI</div>
          <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 26, color: COLORS.text, textAlign: 'center'}}>{cfg.text.cli}</div>
        </PixelBox>
      </Reveal>
      {frame >= cliAt + 8 ? (
        <Terminal x={570} y={580} w={450} h={340} size={38} delay={cliAt + 8} steps={[{cmd: 'ls', dir: '~', output: ['Documents  Pictures'], at: typeAt}]} />
      ) : null}
      {frame >= cliAt + 8 ? (
        <div style={{position: 'absolute', left: 550, top: 940, width: 490, textAlign: 'center', fontFamily: FONTS.heading, fontWeight: 700, fontSize: 26, color: EP05_THEME.navy}}>Taip arahan • Enter</div>
      ) : null}
      <Tux x={830} y={1140} px={7} pose={frame >= cliAt ? 'point' : 'idle'} flip />
      <Host scene={I} x={-40} y={1080} pose={frame >= cliAt ? 'pointRight' : 'explain'} />
    </SceneFrame>
  );
};
