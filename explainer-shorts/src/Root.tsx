import React from 'react';
import {Composition, Folder} from 'remotion';
import {loadFonts} from './fonts';
import {FPS, SHOTS, TOTAL_FRAMES} from './waze/timeline';
import {WazeShot, WazeVideo} from './waze/Video';
import {DapurShot, DapurVideo, SHOTS as DAPUR_SHOTS, TOTAL_FRAMES as DAPUR_FRAMES} from './dapur/Story';
import {BawangShot, BawangVideo, SHOTS as BAWANG_SHOTS, TOTAL_FRAMES as BAWANG_FRAMES} from './bawang/Story';
import {ChiniShot, ChiniVideo, SHOTS as CHINI_SHOTS, TOTAL_FRAMES as CHINI_FRAMES} from './chini/Story';
import {StylesShot, StylesVideo, SHOTS as STYLES_SHOTS, TOTAL_FRAMES as STYLES_FRAMES} from './styles/Styles';
import {TanggangShot, TanggangVideo, SHOTS as TANGGANG_SHOTS, TOTAL_FRAMES as TANGGANG_FRAMES} from './tanggang/Story';
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
  <Folder name="Legenda-Tanggang">
    <Composition id="Tanggang" component={TanggangVideo} width={1080} height={1920} fps={FPS} durationInFrames={TANGGANG_FRAMES} />
    <Folder name="Tanggang-Shots">
      {TANGGANG_SHOTS.map((s, i) => (
        <Composition key={s.id} id={`Tanggang-${s.id}`} component={TanggangShot} defaultProps={{index: i}} width={1080} height={1920} fps={FPS} durationInFrames={s.frames} />
      ))}
    </Folder>
  </Folder>
  <Folder name="Perbandingan-Gaya">
    <Composition id="GayaVideo" component={StylesVideo} width={1080} height={1920} fps={FPS} durationInFrames={STYLES_FRAMES} />
    <Folder name="Gaya-Segmen">
      {STYLES_SHOTS.map((s, i) => (
        <Composition key={s.id} id={`Gaya-${s.id}`} component={StylesShot} defaultProps={{index: i}} width={1080} height={1920} fps={FPS} durationInFrames={s.frames} />
      ))}
    </Folder>
  </Folder>
  <Folder name="Siri-BarangDapur">
    <Composition id="DapurPeriukNasi" component={DapurVideo} width={1080} height={1920} fps={FPS} durationInFrames={DAPUR_FRAMES} />
    <Folder name="Dapur-Scenes">
      {DAPUR_SHOTS.map((s, i) => (
        <Composition key={s.id} id={`Dapur-${s.id}`} component={DapurShot} defaultProps={{index: i}} width={1080} height={1920} fps={FPS} durationInFrames={s.frames} />
      ))}
    </Folder>
  </Folder>
  <Folder name="Legenda-BawangPutih">
    <Composition id="BawangPutih" component={BawangVideo} width={1080} height={1920} fps={FPS} durationInFrames={BAWANG_FRAMES} />
    <Folder name="BawangPutih-Pages">
      {BAWANG_SHOTS.map((s, i) => (
        <Composition key={s.id} id={`Bawang-${s.id}`} component={BawangShot} defaultProps={{index: i}} width={1080} height={1920} fps={FPS} durationInFrames={s.frames} />
      ))}
    </Folder>
  </Folder>
  <Folder name="Legenda-TasikChini">
    <Composition id="TasikChini" component={ChiniVideo} width={1080} height={1920} fps={FPS} durationInFrames={CHINI_FRAMES} />
    <Composition id="TasikChiniKomik" component={ChiniVideo} defaultProps={{paper: false}} width={1080} height={1920} fps={FPS} durationInFrames={CHINI_FRAMES} />
    <Folder name="TasikChini-Pages">
      {CHINI_SHOTS.map((s, i) => (
        <Composition key={s.id} id={`Chini-${s.id}`} component={ChiniShot} defaultProps={{index: i}} width={1080} height={1920} fps={FPS} durationInFrames={s.frames} />
      ))}
    </Folder>
  </Folder>
  </>
);
