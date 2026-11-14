import React from 'react';
import {Composition, Folder} from 'remotion';
import {loadFonts} from './fonts';
import {FPS, SHOTS, TOTAL_FRAMES} from './waze/timeline';
import {WazeShot, WazeVideo} from './waze/Video';
import {MahsuriShot, MahsuriVideo, SHOTS as MAHSURI_SHOTS, TOTAL_FRAMES as MAHSURI_FRAMES} from './mahsuri/Story';
import {BatuShot, BatuVideo, SHOTS as BATU_SHOTS, TOTAL_FRAMES as BATU_FRAMES} from './batubelah/Story';
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
  <Folder name="Legenda-BatuBelah">
    <Composition id="BatuBelah" component={BatuVideo} width={1080} height={1920} fps={FPS} durationInFrames={BATU_FRAMES} />
    <Folder name="BatuBelah-Shots">
      {BATU_SHOTS.map((s, i) => (
        <Composition key={s.id} id={`BatuBelah-${s.id}`} component={BatuShot} defaultProps={{index: i}} width={1080} height={1920} fps={FPS} durationInFrames={s.frames} />
      ))}
    </Folder>
  </Folder>
  <Folder name="Legenda-Mahsuri">
    <Composition id="Mahsuri" component={MahsuriVideo} width={1080} height={1920} fps={FPS} durationInFrames={MAHSURI_FRAMES} />
    <Folder name="Mahsuri-Shots">
      {MAHSURI_SHOTS.map((s, i) => (
        <Composition key={s.id} id={`Mahsuri-${s.id}`} component={MahsuriShot} defaultProps={{index: i}} width={1080} height={1920} fps={FPS} durationInFrames={s.frames} />
      ))}
    </Folder>
  </Folder>
  </>
);
