import React from 'react';
import {Composition} from 'remotion';
import {TL} from './data/timeline';
import {DocProps, EHazopDocumentary} from './Video';

const defaults: DocProps = {showSubtitles: true, musicVolume: 0.5, voVolume: 1, sfxVolume: 0.7};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="EHazopDocumentary" component={EHazopDocumentary} durationInFrames={TL.durationInFrames} fps={TL.fps} width={TL.width} height={TL.height} defaultProps={defaults} />
    <Composition id="EHazopDocumentary-NoSubs" component={EHazopDocumentary} durationInFrames={TL.durationInFrames} fps={TL.fps} width={TL.width} height={TL.height} defaultProps={{...defaults, showSubtitles: false}} />
  </>
);
