import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {PixelBox} from '../../components/PixelBox';
import {PixelSprite} from '../../components/PixelSprite';
import {RichLine} from '../../components/PixelText';
import {COLORS, FONTS} from '../../config/theme';
import {pop} from '../../lib/anim';
import {WARNING} from '../assets/icons';
import {EP03_THEME} from '../config/theme';

type PhoneProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  delay?: number;
  // Optional shake (px) e.g. when a scam message arrives.
  shake?: number;
  children?: React.ReactNode;
};

// Large pixel smartphone used to stage fictional messages.
export const Phone: React.FC<PhoneProps> = ({x, y, w, h, delay = 0, shake = 0, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 10);
  const dx = shake ? (Math.floor(frame / 2) % 2 ? shake : -shake) : 0;
  return (
    <div style={{position: 'absolute', left: x + dx, top: y, width: w, height: h, transform: `scale(${s})`, opacity: frame >= delay ? 1 : 0}}>
      <PixelBox bg="#24272C" border={COLORS.text} padding={14} step={12} style={{height: '100%'}}>
        <div style={{position: 'relative', height: '100%', background: '#EEF3F8', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
          <div style={{height: 40, background: EP03_THEME.navy, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontFamily: FONTS.pixel, fontSize: 22, color: EP03_THEME.white}}>
            <span>9:41</span>
            <span style={{width: 70, height: 14, background: '#24272C'}} />
            <span>▮▮▮</span>
          </div>
          {children}
        </div>
      </PixelBox>
    </div>
  );
};

// Header showing who the message claims to be from.
export const SenderBar: React.FC<{name: string}> = ({name}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: EP03_THEME.white, borderBottom: `4px solid #C9D3DE`}}>
    <div style={{width: 52, height: 52, background: EP03_THEME.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: EP03_THEME.white}}>B</div>
    <div>
      <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 30, color: COLORS.text, lineHeight: 1}}>{name}</div>
      <div style={{fontFamily: FONTS.pixel, fontSize: 18, color: '#6B7480'}}>SMS • baru sahaja</div>
    </div>
  </div>
);

// Grey incoming-message bubble; `chars` reveals the text like typing.
export const SmsBubble: React.FC<{text: string; chars?: number; size?: number}> = ({text, chars, size = 30}) => {
  const shown = chars === undefined ? text : text.slice(0, Math.max(0, chars));
  return (
    <div style={{margin: '16px 16px 0', alignSelf: 'flex-start', maxWidth: '90%'}}>
      <PixelBox bg={EP03_THEME.white} border="#9AA6B4" borderWidth={4} step={6} padding="12px 16px" shadow={false}>
        <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: size, color: COLORS.text, lineHeight: 1.15, whiteSpace: 'pre-line'}}>{shown}</div>
      </PixelBox>
    </div>
  );
};

// Suspicious link line, flashing red when `alert` is on.
export const FakeLink: React.FC<{text: string; alert: boolean; size?: number}> = ({text, alert, size = 26}) => {
  const frame = useCurrentFrame();
  const flash = alert && Math.floor(frame / 6) % 2 === 0;
  return (
    <div style={{margin: '10px 16px 0', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: alert ? (flash ? EP03_THEME.red : '#F7D6D6') : 'transparent', outline: alert ? `4px solid ${EP03_THEME.red}` : 'none'}}>
      <div style={{fontFamily: FONTS.heading, fontWeight: 700, fontSize: size, color: alert && flash ? EP03_THEME.white : EP03_THEME.blue, textDecoration: 'underline', wordBreak: 'break-all'}}>{text}</div>
    </div>
  );
};

// Red stamp that marks every scam demo as fictional.
export const FictionTag: React.FC<{label: string; x: number; y: number; delay?: number; rotate?: number}> = ({label, x, y, delay = 0, rotate = -6}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(frame, fps, delay, 9);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rotate}deg) scale(${s})`, opacity: frame >= delay ? 1 : 0}}>
      <PixelBox bg={EP03_THEME.red} border={COLORS.text} padding="6px 18px" shadow={false} step={6} borderWidth={6}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <PixelSprite sprite={WARNING} px={2} />
          <div style={{fontFamily: FONTS.heading, fontWeight: 900, fontSize: 28, color: EP03_THEME.white, whiteSpace: 'nowrap'}}>
            <RichLine line={label} />
          </div>
        </div>
      </PixelBox>
    </div>
  );
};
