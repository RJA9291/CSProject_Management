import {EP01} from '../config/episode';
import {SCENE_COMPONENTS} from '../scenes';
import {EpisodeVideoProps, makeEpisodeVideo} from './EpisodeVideo';

export type LFCAVideoProps = EpisodeVideoProps;

// Episode 01 – LFCA: Your IT Career Roadmap.
export const LFCAVideo = makeEpisodeVideo(EP01, SCENE_COMPONENTS);
