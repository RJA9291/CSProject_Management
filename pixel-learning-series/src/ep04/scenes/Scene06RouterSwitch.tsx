import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {CHECK, COMPUTER} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop, snap} from '../../lib/anim';
import {BIG_CLOUD, HOUSE, PACKET_BACK} from '../../ep02/assets/icons';
import {DataFlow} from '../../ep02/components/DataFlow';
import {Reveal, TitleCard} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {NetLink, routerSprite, switchSprite} from '../components/Net';
import {ROUTER_SWITCH, SCENES} from '../config/scenes';
import {EP04_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 5;
const CARD_W = 490;
const CARD_TOP = 330;
const CARD_H = 700;
const LEFT = 40;
const RIGHT = 550;

const Points: React.FC<{items: string[]; starts: number[]; color: string}> = ({items, starts, color}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
      {items.map((p, i) => (
        <div key={p} style={{display: 'flex', alignItems: 'center', gap: 12, opacity: frame >= starts[i] ? 1 : 0, transform: `scale(${pop(frame, fps, starts[i], 12)})`, transformOrigin: 'left center'}}>
          <PixelSprite sprite={CHECK} px={4} palette={{E: color}} />
          <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 30, color: COLORS.text, lineHeight: 1.08}}>{p}</div>
        </div>
      ))}
    </div>
  );
};

export const Ep04Scene06RouterSwitch: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {f} = useCues(I);
  const cfg = SCENES[I];
  const rAt = 6;
  const rLinks = f('menghubungkan', 1.0);
  const rRoute = f('mengarahkan', 2.6) - 2;
  const sAt = f('Switch', 5.2) - 4;
  const sLinks = f('banyak', 6.2) - 2;
  const sTalk = f('berkomunikasi', 8.0) - 2;
  const rPts = [rLinks, rRoute, rRoute + 20];
  const sPts = [sLinks, sTalk];
  // Diagram anchors inside the cards (absolute screen coords).
  const R: [number, number] = [LEFT + 245, CARD_TOP + 300];
  const CLOUD: [number, number] = [LEFT + 245, CARD_TOP + 150];
  const HOME: [number, number] = [LEFT + 245, CARD_TOP + 430];
  const S: [number, number] = [RIGHT + 245, CARD_TOP + 200];
  const PCS: [number, number][] = [0, 1, 2, 3].map((k) => [RIGHT + 70 + k * 117, CARD_TOP + 340]);
  const vs = pop(frame, fps, sAt, 8);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[{at: rLinks / fps, sfx: 'link'}, {at: rRoute / fps, sfx: 'blip'}, {at: sAt / fps, sfx: 'pop'}, {at: sLinks / fps, sfx: 'link'}, {at: sTalk / fps, sfx: 'success'}]}
    >
      <TitleCard text={cfg.text.headline} size={80} />
      <Reveal delay={rAt} mode="slideLeft" style={{left: LEFT, top: CARD_TOP, width: CARD_W, height: CARD_H}}>
        <PixelBox bg={COLORS.white} border={EP04_THEME.blue} padding="14px 18px" style={{height: '100%'}}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 56, color: EP04_THEME.blue, textAlign: 'center'}}>{ROUTER_SWITCH.router.title}</div>
          <div style={{position: 'absolute', left: 30, right: 30, top: 470}}>
            <Points items={ROUTER_SWITCH.router.points} starts={rPts} color={EP04_THEME.blue} />
          </div>
        </PixelBox>
      </Reveal>
      <Reveal delay={sAt} mode="slideRight" style={{left: RIGHT, top: CARD_TOP, width: CARD_W, height: CARD_H}}>
        <PixelBox bg={COLORS.white} border={EP04_THEME.teal} padding="14px 18px" style={{height: '100%'}}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 56, color: EP04_THEME.teal, textAlign: 'center'}}>{ROUTER_SWITCH.switch.title}</div>
          <div style={{position: 'absolute', left: 30, right: 30, top: 470}}>
            <Points items={ROUTER_SWITCH.switch.points} starts={sPts} color={EP04_THEME.teal} />
          </div>
        </PixelBox>
      </Reveal>
      {/* Router: internet cloud above, home LAN below, traffic routed both ways. */}
      {frame >= rAt + 10 ? (
        <>
          <NetLink a={CLOUD} b={R} start={rLinks} okAt={rRoute} packets="both" every={14} travel={20} />
          <NetLink a={R} b={HOME} start={rLinks + 6} okAt={rRoute} packets="both" every={14} travel={20} />
          <div style={{position: 'absolute', left: CLOUD[0] - 80, top: CLOUD[1] - 70}}>
            <PixelSprite sprite={BIG_CLOUD} px={4} />
            <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 20, color: EP04_THEME.navy}}>INTERNET</div>
          </div>
          <div style={{position: 'absolute', left: R[0] - 54, top: R[1] - 50}}>
            <PixelSprite sprite={routerSprite(frame)} px={6} />
          </div>
          <div style={{position: 'absolute', left: HOME[0] - 50, top: HOME[1] - 30, display: 'flex', alignItems: 'center', gap: 8}}>
            <PixelSprite sprite={HOUSE} px={4} />
            <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 20, color: EP04_THEME.blue}}>LAN</div>
          </div>
        </>
      ) : null}
      {/* Switch: four PCs on the same LAN. */}
      {frame >= sAt + 10 ? (
        <>
          {PCS.map((p, k) => (
            <NetLink key={k} a={S} b={[p[0], p[1] - 40]} start={sLinks + k * 4} okAt={sTalk} width={6} />
          ))}
          {frame >= sTalk ? (
            <>
              <DataFlow points={[[PCS[0][0], PCS[0][1] - 40], S, [PCS[3][0], PCS[3][1] - 40]]} start={sTalk} every={16} travel={30} px={4} />
              <DataFlow points={[[PCS[2][0], PCS[2][1] - 40], S, [PCS[1][0], PCS[1][1] - 40]]} start={sTalk + 8} every={16} travel={30} sprite={PACKET_BACK} px={4} />
            </>
          ) : null}
          <div style={{position: 'absolute', left: S[0] - 104, top: S[1] - 36}}>
            <PixelSprite sprite={switchSprite(frame)} px={8} />
          </div>
          {PCS.map((p, k) => (
            <div key={k} style={{position: 'absolute', left: snap(p[0] - 36, 4), top: p[1] - 40}}>
              <PixelSprite sprite={COMPUTER} px={4} />
            </div>
          ))}
        </>
      ) : null}
      <div style={{position: 'absolute', left: 490, top: 640, transform: `scale(${vs})`, opacity: frame >= sAt ? 1 : 0}}>
        <PixelBox bg={EP04_THEME.red} border={COLORS.text} padding="4px 10px" shadow={false} borderWidth={6} step={6}>
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, color: COLORS.white}}>≠</div>
        </PixelBox>
      </div>
      <Host scene={I} x={276} y={1080} pose={frame >= sAt ? 'pointRight' : 'hold'} />
      {frame < sAt && frame >= 4 ? (
        <div style={{position: 'absolute', left: 276 + 13 * 12, top: 1080 + 24 * 12}}>
          <PixelSprite sprite={routerSprite(frame)} px={5} />
        </div>
      ) : null}
    </SceneFrame>
  );
};
