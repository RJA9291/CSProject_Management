import React from 'react';
import {Composition, Folder, Still} from 'remotion';
import {CharacterSheet} from './compositions/CharacterSheet';
import {EpisodeVideoProps, makeEpisodeVideo, withEpisode} from './compositions/EpisodeVideo';
import {LFCAVideo} from './compositions/LFCAVideo';
import {QC_COLS, qcHeight, QCSheet, QCSheetProps} from './compositions/QCSheet';
import {EP01} from './config/episode';
import {VIDEO} from './config/theme';
import {EP02} from './ep02/config/episode';
import {EP02_SCENES} from './ep02/scenes';
import {EP03} from './ep03/config/episode';
import {EP03_SCENES} from './ep03/scenes';
import {EP04} from './ep04/config/episode';
import {EP04_SCENES} from './ep04/scenes';
import {EP05} from './ep05/config/episode';
import {EP05_SCENES} from './ep05/scenes';
import {EP06} from './ep06/config/episode';
import {EP06_SCENES} from './ep06/scenes';
import {episodeAllFrames, episodeSceneFrames, episodeTotal} from './lib/durations';
import type {Episode} from './lib/episode-types';
import {SCENE_COMPONENTS} from './scenes';

const CloudVideo = makeEpisodeVideo(EP02, EP02_SCENES);
// Scene previews need their episode's narration context.
const EP02_PREVIEWS = EP02_SCENES.map((s) => withEpisode(EP02, s));
const CyberVideo = makeEpisodeVideo(EP03, EP03_SCENES);
const EP03_PREVIEWS = EP03_SCENES.map((s) => withEpisode(EP03, s));
const NetworkVideo = makeEpisodeVideo(EP04, EP04_SCENES);
const EP04_PREVIEWS = EP04_SCENES.map((s) => withEpisode(EP04, s));
const LinuxVideo = makeEpisodeVideo(EP05, EP05_SCENES);
const EP05_PREVIEWS = EP05_SCENES.map((s) => withEpisode(EP05, s));
const SupportVideo = makeEpisodeVideo(EP06, EP06_SCENES);
const EP06_PREVIEWS = EP06_SCENES.map((s) => withEpisode(EP06, s));

// One folder per episode: the full video plus every scene on its own for preview.
const EpisodeFolder: React.FC<{name: string; videoId: string; ep: Episode; video: React.FC<EpisodeVideoProps>; scenes: React.FC[]}> = ({name, videoId, ep, video, scenes}) => (
  <Folder name={name}>
    <Composition
      id={videoId}
      component={video}
      width={VIDEO.width}
      height={VIDEO.height}
      fps={VIDEO.fps}
      durationInFrames={VIDEO.fps * 90}
      defaultProps={{durations: ep.scenes.map((s) => s.minSeconds * VIDEO.fps)} as EpisodeVideoProps}
      calculateMetadata={async () => {
        const durations = await episodeAllFrames(ep);
        return {durationInFrames: episodeTotal(ep, durations), props: {durations}};
      }}
    />
    <Folder name={`${name}-Scenes`}>
      {scenes.map((Scene, i) => (
        <Composition
          key={ep.scenes[i].id}
          id={ep.scenes[i].id}
          component={Scene}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={ep.scenes[i].minSeconds * VIDEO.fps}
          calculateMetadata={async () => ({durationInFrames: await episodeSceneFrames(ep, i)})}
        />
      ))}
    </Folder>
  </Folder>
);

export const RemotionRoot: React.FC = () => (
  <>
    <EpisodeFolder name="Ep01-LFCA" videoId="LFCAVideo" ep={EP01} video={LFCAVideo} scenes={SCENE_COMPONENTS} />
    <EpisodeFolder name="Ep02-Cloud" videoId="CloudVideo" ep={EP02} video={CloudVideo} scenes={EP02_PREVIEWS} />
    <EpisodeFolder name="Ep03-Cyber" videoId="CyberVideo" ep={EP03} video={CyberVideo} scenes={EP03_PREVIEWS} />
    <EpisodeFolder name="Ep04-Network" videoId="NetworkVideo" ep={EP04} video={NetworkVideo} scenes={EP04_PREVIEWS} />
    <EpisodeFolder name="Ep05-Linux" videoId="LinuxVideo" ep={EP05} video={LinuxVideo} scenes={EP05_PREVIEWS} />
    <EpisodeFolder name="Ep06-ITSupport" videoId="SupportVideo" ep={EP06} video={SupportVideo} scenes={EP06_PREVIEWS} />
    <Folder name="Assets">
      <Still id="CharacterSheet" component={CharacterSheet} width={1800} height={1700} />
      <Still
        id="QCSheet"
        component={QCSheet}
        width={12 + QC_COLS * (324 + 12)}
        height={qcHeight(12)}
        defaultProps={{tag: 'qc-85', frames: [], names: []} as QCSheetProps}
        calculateMetadata={({props}) => ({height: qcHeight(props.names.length || 12)})}
      />
    </Folder>
  </>
);
