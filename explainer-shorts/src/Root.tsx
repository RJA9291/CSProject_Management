import React from 'react';
import {Composition, Folder} from 'remotion';
import {loadFonts} from './fonts';
import {FPS, SHOTS, TOTAL_FRAMES} from './waze/timeline';
import {WazeShot, WazeVideo} from './waze/Video';

loadFonts();

export const RemotionRoot: React.FC = () => (
  <Folder name="Waze-Jem">
    <Composition id="WazeJem" component={WazeVideo} width={1080} height={1920} fps={FPS} durationInFrames={TOTAL_FRAMES} />
    <Folder name="Waze-Shots">
      {SHOTS.map((s, i) => (
        <Composition key={s.id} id={`Waze-${s.id}`} component={WazeShot} defaultProps={{index: i}} width={1080} height={1920} fps={FPS} durationInFrames={s.frames} />
      ))}
    </Folder>
  </Folder>
);
