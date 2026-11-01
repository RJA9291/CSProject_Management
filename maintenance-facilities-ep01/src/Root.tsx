import React from 'react';
import {Composition, Still} from 'remotion';
import {CharacterLineup, FactoryLookdev} from './Lookdev';

export const RemotionRoot: React.FC = () => (
  <>
    <Still id="CharacterSheet" component={CharacterLineup} width={1920} height={1080} />
    <Still id="EnvWide" component={FactoryLookdev} width={1920} height={1080} defaultProps={{cam: 'wide' as const}} />
    <Still id="EnvAerial" component={FactoryLookdev} width={1920} height={1080} defaultProps={{cam: 'aerial' as const}} />
    <Still id="EnvWorkshop" component={FactoryLookdev} width={1920} height={1080} defaultProps={{cam: 'workshop' as const}} />
    <Composition id="LookdevMotion" component={FactoryLookdev} durationInFrames={120} fps={30} width={1920} height={1080} defaultProps={{cam: 'wide' as const}} />
  </>
);
