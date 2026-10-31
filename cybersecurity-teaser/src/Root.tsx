import React from 'react';
import {Composition} from 'remotion';
import {DEFAULT_CONTENT} from './data/content';
import {TL} from './data/timeline';
import {CyberTeaser, TeaserProps} from './Video';

const defaults: TeaserProps = {
  content: DEFAULT_CONTENT,
  showSubtitles: true,
  musicVolume: 0.6,
  voVolume: 1,
  sfxVolume: 0.75,
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="CyberTeaser01"
      component={CyberTeaser}
      durationInFrames={TL.durationInFrames}
      fps={TL.fps}
      width={TL.width}
      height={TL.height}
      defaultProps={defaults}
    />
    {/* Clean version without burned-in subtitles (use the .srt instead) */}
    <Composition
      id="CyberTeaser01-NoSubs"
      component={CyberTeaser}
      durationInFrames={TL.durationInFrames}
      fps={TL.fps}
      width={TL.width}
      height={TL.height}
      defaultProps={{...defaults, showSubtitles: false}}
    />
  </>
);
