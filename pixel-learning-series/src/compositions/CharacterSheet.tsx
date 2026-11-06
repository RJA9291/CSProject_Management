import React from 'react';
import {AbsoluteFill} from 'remotion';
import {buildHost, POSES, poseFrameCount} from '../assets/characters/host';
import {AVATAR_LOOKS, avatarSprite, OWNER_LOOK, STUDENT_LOOK} from '../assets/characters/people';
import {COLORS, FONTS} from '../config/theme';
import {PixelSprite} from '../components/PixelSprite';

// Master sprite sheet: every pose and frame of the host, rendered from the single source asset.
export const CharacterSheet: React.FC = () => {
  const cells = POSES.flatMap((pose) =>
    Array.from({length: poseFrameCount(pose)}, (_, frame) => ({pose, frame})),
  );
  return (
    <AbsoluteFill style={{background: COLORS.bg, padding: 40, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 24, alignContent: 'flex-start'}}>
      {cells.map(({pose, frame}) => (
        <div key={`${pose}-${frame}`} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <PixelSprite sprite={buildHost({pose, frame})} px={6} />
          <div style={{fontFamily: FONTS.pixel, fontSize: 22, color: COLORS.text}}>
            {pose} {poseFrameCount(pose) > 1 ? frame + 1 : ''}
          </div>
        </div>
      ))}
      {(['neutral', 'smile', 'confused', 'happy'] as const).map((expression) => (
        <div key={expression} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <PixelSprite sprite={buildHost({pose: 'neutral', expression})} px={6} />
          <div style={{fontFamily: FONTS.pixel, fontSize: 22, color: COLORS.text}}>face: {expression}</div>
        </div>
      ))}
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <PixelSprite sprite={buildHost({pose: 'neutral', talking: true})} px={6} />
        <div style={{fontFamily: FONTS.pixel, fontSize: 22, color: COLORS.text}}>face: talking</div>
      </div>
      {[STUDENT_LOOK, OWNER_LOOK].map((look) => (
        <div key={look.id} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <PixelSprite sprite={buildHost({pose: 'hold', look})} px={6} />
          <div style={{fontFamily: FONTS.pixel, fontSize: 22, color: COLORS.text}}>{look.id}</div>
        </div>
      ))}
      {Object.values(AVATAR_LOOKS).map((look) => (
        <div key={look.id} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <PixelSprite sprite={avatarSprite(look)} px={6} />
          <div style={{fontFamily: FONTS.pixel, fontSize: 22, color: COLORS.text}}>{look.id}</div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
