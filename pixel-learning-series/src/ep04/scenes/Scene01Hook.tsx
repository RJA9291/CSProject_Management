import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Host} from '../../components/PixelCharacter/Host';
import {Icon, LAPTOP, QUESTION, SPARKLE} from '../../components/PixelIcons';
import {PixelSprite} from '../../components/PixelSprite';
import {PixelText} from '../../components/PixelText';
import {SceneFrame} from '../../components/SceneFrame';
import {SpeechBubble} from '../../components/SpeechBubble';
import {snap} from '../../lib/anim';
import {PACKET, PACKET_BACK, PHONE} from '../../ep02/assets/icons';
import {DataFlow} from '../../ep02/components/DataFlow';
import {Chip} from '../../ep03/components/Cards';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {SCENES} from '../config/scenes';
import {EP04_THEME} from '../config/theme';
import {useCues} from '../lib/cues';
import {wifiSprite} from '../components/Net';

const I = 0;
const HOST_X = -40;
const HOST_Y = 1080;
const PHONE_AT: [number, number] = [HOST_X + 21 * 12 + 30, HOST_Y + 26 * 12];
const WIFI_AT: [number, number] = [540, 760];
const LAPTOP_AT: [number, number] = [860, 1180];

export const Ep04Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {f, fps} = useCues(I);
  const cfg = SCENES[I];
  const laptopAt = f('telefon', 1.0) + 6;
  const wifiAt = f('connect', 1.6) - 2;
  const chatAt = f('mesej', 2.6) - 2;
  const webAt = f('website', 3.4) - 2;
  const jomAt = f('Jom', 4.6);
  return (
    <SceneFrame
      index={I}
      background={<CyberBackground navyFrom={Infinity} />}
      extraSfx={[
        {at: laptopAt / fps, sfx: 'pop'},
        {at: wifiAt / fps, sfx: 'link'},
        {at: chatAt / fps, sfx: 'notify'},
        {at: webAt / fps, sfx: 'blip'},
        {at: jomAt / fps, sfx: 'sparkle'},
      ]}
    >
      <SpeechBubble delay={3} tail="left" tailOffset={160} style={{position: 'absolute', left: 70, top: 180, width: 940}}>
        <PixelText text={cfg.text.line1} size={82} effect="zoom" delay={8} stagger={5} />
        <PixelText text={cfg.text.line2} size={70} effect="pop" delay={chatAt} stagger={5} style={{marginTop: 12}} />
      </SpeechBubble>
      <Icon sprite={wifiSprite(frame, wifiAt)} x={WIFI_AT[0] - 90} y={WIFI_AT[1] - 70} px={12} delay={wifiAt} bob={6} />
      <DataFlow points={[PHONE_AT, WIFI_AT, LAPTOP_AT]} start={wifiAt + 8} every={12} travel={40} sprite={PACKET} px={5} track={EP04_THEME.cyan} />
      <DataFlow points={[LAPTOP_AT, WIFI_AT, PHONE_AT]} start={chatAt} every={14} travel={40} sprite={PACKET_BACK} px={5} />
      <Icon sprite={LAPTOP} x={LAPTOP_AT[0] - 132} y={LAPTOP_AT[1] - 60} px={12} delay={laptopAt} bob={0} />
      <Chip label="CHAT" x={720} y={620} delay={chatAt} bg={EP04_THEME.green} size={40} />
      <Chip label="STREAM" x={760} y={880} delay={chatAt + 8} bg={EP04_THEME.red} size={40} />
      <Chip label="WEBSITE" x={300} y={940} delay={webAt} bg={EP04_THEME.blue} size={40} />
      <Icon sprite={QUESTION} x={150} y={930} px={8} delay={12} bob={10} />
      <Icon sprite={SPARKLE} x={980} y={1060} px={7} delay={jomAt} bob={6} />
      <Host scene={I} x={HOST_X} y={HOST_Y} pose={frame >= jomAt ? 'thumbsUp' : 'hold'} enter="bottom" enterFrames={16} />
      {frame < jomAt && frame >= 16 ? (
        <div style={{position: 'absolute', left: snap(PHONE_AT[0] - 40), top: snap(PHONE_AT[1] - 60)}}>
          <PixelSprite sprite={PHONE} px={7} />
        </div>
      ) : null}
    </SceneFrame>
  );
};
