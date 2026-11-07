import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {CHECK, LAPTOP} from '../../components/PixelIcons';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {RichLine} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {DataFlow} from '../../ep02/components/DataFlow';
import {Reveal} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {ADDRESS_BOOK} from '../assets/icons';
import {Device, NetLink, routerSprite, wifiSprite} from '../components/Net';
import {SCENES} from '../config/scenes';
import {EP04_THEME} from '../config/theme';
import {useCues} from '../lib/cues';

const I = 7;

const Header: React.FC<{text: string; top: number; delay: number; color: string}> = ({text, top, delay, color}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: 40, top, width: 1000, transform: `scale(${pop(frame, fps, delay, 10)})`, opacity: frame >= delay ? 1 : 0}}>
      <PixelBox bg={color} border={COLORS.text} padding="8px 20px" shadow={false} borderWidth={6}>
        <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 44, color: COLORS.white, textAlign: 'center', whiteSpace: 'nowrap'}}>
          <RichLine line={text} emphasis={EP04_THEME.cyan} />
        </div>
      </PixelBox>
    </div>
  );
};

const Arrow: React.FC<{x: number; y: number; delay: number}> = ({x, y, delay}) => {
  const frame = useCurrentFrame();
  if (frame < delay) return null;
  const dx = Math.floor((frame - delay) / 4) % 3 * 6;
  return (
    <div style={{position: 'absolute', left: x + dx, top: y, fontFamily: FONTS.heading, fontWeight: 900, fontSize: 64, color: EP04_THEME.red, lineHeight: 1}}>→</div>
  );
};

export const Ep04Scene08DNSDHCP: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const typeAt = 10;
  const lookAt = f('menukar', 1.0) - 2;
  const ipAt = f('alamat', 3.0) - 2;
  const dhcpAt = f('DHCP', 4.4) - 6;
  const joinAt = f('memberikan', 5.4) - 4;
  const cfgAt = f('konfigurasi', 6.2) - 2;
  const autoAt = f('automatik', 8.6) - 2;
  const domain = cfg.text.domain.slice(0, Math.max(0, Math.floor((frame - typeAt) / 1.6)));
  const caret = Math.floor(frame / 8) % 2 === 0 ? '▌' : ' ';
  const settings = ['IP      192.168.1.23', 'MASK    255.255.255.0', 'GATEWAY 192.168.1.1', 'DNS     192.168.1.1'];
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[
        {at: typeAt / fps, sfx: 'click'},
        {at: lookAt / fps, sfx: 'blip'},
        {at: ipAt / fps, sfx: 'success'},
        {at: dhcpAt / fps, sfx: 'pop'},
        {at: joinAt / fps, sfx: 'link'},
        {at: cfgAt / fps, sfx: 'notify'},
        {at: autoAt / fps, sfx: 'success'},
      ]}
    >
      {/* DNS: domain name -> DNS -> IP address */}
      <Header text={cfg.text.dns} top={170} delay={2} color={EP04_THEME.navy} />
      <div style={{position: 'absolute', left: 40, top: 300, width: 1000}}>
        <PixelBox bg={COLORS.white} border={EP04_THEME.blue} padding="10px 16px" shadow={false} borderWidth={6}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{display: 'flex', gap: 6}}>
              {['R', 'O', 'E'].map((c) => (
                <div key={c} style={{width: 16, height: 16, background: c === 'R' ? EP04_THEME.red : c === 'O' ? EP04_THEME.orange : EP04_THEME.green}} />
              ))}
            </div>
            <div style={{flex: 1, background: '#EEF3F8', padding: '6px 12px', fontFamily: FONTS.heading, fontWeight: 700, fontSize: 38, color: COLORS.text}}>
              {domain}
              {frame < lookAt ? caret : ''}
            </div>
          </div>
        </PixelBox>
      </div>
      <Reveal delay={lookAt - 8} mode="pop" style={{left: 70, top: 430}}>
        <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: EP04_THEME.blue, textAlign: 'center', width: 260}}>NAMA DOMAIN</div>
      </Reveal>
      <Arrow x={330} y={470} delay={lookAt} />
      <Device sprite={ADDRESS_BOOK} x={440} y={420} px={7} label="DNS" delay={lookAt} labelColor={EP04_THEME.navy} />
      <Arrow x={570} y={470} delay={ipAt - 6} />
      <Reveal delay={ipAt} mode="pop" style={{left: 670, top: 450}}>
        <PixelBox bg={EP04_THEME.green} border={COLORS.text} padding="8px 16px" shadow={false} borderWidth={6}>
          <div style={{fontFamily: FONTS.pixel, fontSize: 18, color: COLORS.white}}>ALAMAT IP (CONTOH)</div>
          <div style={{fontFamily: FONTS.pixel, fontWeight: 700, fontSize: 34, color: COLORS.white}}>{cfg.text.ip}</div>
        </PixelBox>
      </Reveal>
      <Reveal delay={ipAt + 6} mode="pop" style={{left: 40, top: 590, width: 1000}}>
        <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: 30, color: EP04_THEME.navy, textAlign: 'center'}}>{cfg.text.dnsNote}</div>
      </Reveal>
      {/* DHCP: a new laptop joins Wi-Fi and receives its settings automatically */}
      <Header text={cfg.text.dhcp} top={660} delay={dhcpAt} color={EP04_THEME.teal} />
      {frame >= dhcpAt ? (
        <>
          <Device sprite={LAPTOP} x={560} y={800} px={6} label="LAPTOP BARU" delay={dhcpAt + 4} labelSize={24} />
          <Device sprite={routerSprite(frame)} x={860} y={820} px={6} label="DHCP" delay={dhcpAt + 8} labelSize={24} labelColor={EP04_THEME.teal} />
          <div style={{position: 'absolute', left: 870, top: 760}}>
            <PixelSprite sprite={wifiSprite(frame, joinAt)} px={6} />
          </div>
          <NetLink a={[700, 860]} b={[900, 860]} start={joinAt} wireless okAt={autoAt} />
          <DataFlow points={[[900, 880], [700, 880]]} start={cfgAt} every={14} travel={20} px={4} />
        </>
      ) : null}
      <Reveal delay={cfgAt} mode="slideRight" style={{left: 520, top: 960, width: 520}}>
        <PixelBox bg={EP04_THEME.navy} border={COLORS.text} padding="10px 16px" shadow={false} borderWidth={6}>
          {settings.map((s, i) => (
            <div key={s} style={{fontFamily: FONTS.pixel, fontSize: 24, color: COLORS.white, whiteSpace: 'pre', opacity: frame >= cfgAt + 6 + i * 6 ? 1 : 0}}>
              {s}
            </div>
          ))}
          <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 6, opacity: frame >= autoAt ? 1 : 0}}>
            <PixelSprite sprite={CHECK} px={4} />
            <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: EP04_THEME.cyan}}>DIBERI SECARA AUTOMATIK</div>
          </div>
        </PixelBox>
      </Reveal>
      <Host scene={I} x={-60} y={1090} pose={frame >= autoAt ? 'thumbsUp' : frame >= dhcpAt ? 'pointRight' : 'explain'} />
    </SceneFrame>
  );
};
