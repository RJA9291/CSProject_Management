import React from 'react';
import {Composition, Folder} from 'remotion';
import {loadFonts} from './fonts';
import {FPS, SHOTS, TOTAL_FRAMES} from './waze/timeline';
import {WazeShot, WazeVideo} from './waze/Video';
import {SantubongShot, SantubongVideo, SHOTS as SANTUBONG_SHOTS, TOTAL_FRAMES as SANTUBONG_FRAMES} from './santubong/Story';

loadFonts();

export const RemotionRoot: React.FC = () => (
  <>
  <Folder name="Waze-Jem">
    <Composition id="WazeJem" component={WazeVideo} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} />
    <Folder name="Waze-Shots">
      {SHOTS.map((s, i) => (
        <Composition key={s.id} id={`Waze-${s.id}`} component={WazeShot} defaultProps={{index: i}} width={1080} height={1920} fps={FPS} durationInFrames={s.frames} />
      ))}
    </Folder>
  </Folder>
  <Folder name="Legenda-Santubong">
    <Composition id="Santubong" component={SantubongVideo} width={1080} height={1920} fps={FPS} durationInFrames={SANTUBONG_FRAMES} />
    <Folder name="Santubong-Shots">
      {SANTUBONG_SHOTS.map((s, i) => (
        <Composition key={s.id} id={`Santubong-${s.id}`} component={SantubongShot} defaultProps={{index: i}} width={1080} height={1920} fps={FPS} durationInFrames={s.frames} />
      ))}
    </Folder>
  </Folder>
  </>
);
