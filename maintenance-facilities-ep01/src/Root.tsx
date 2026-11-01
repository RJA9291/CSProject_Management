import React from 'react';
import {Composition, Still} from 'remotion';
import {CharacterLineup, FactoryLookdev} from './Lookdev';
import {AeVsTechnician, CharacterSheetPage, Turntable} from './Sheets';
import {CHARACTERS} from './characters/specs';
import {Episode01, SingleScene} from './Episode';
import {FPS, SCENES, TOTAL} from './data/timeline';

export const RemotionRoot: React.FC = () => (
  <>
    <Still id="CharacterSheet" component={CharacterLineup} width={1920} height={1080} />
    <Still id="EnvWide" component={FactoryLookdev} width={1920} height={1080} defaultProps={{cam: 'wide' as const}} />
    <Still id="EnvAerial" component={FactoryLookdev} width={1920} height={1080} defaultProps={{cam: 'aerial' as const}} />
    <Still id="EnvWorkshop" component={FactoryLookdev} width={1920} height={1080} defaultProps={{cam: 'workshop' as const}} />
    {CHARACTERS.map((c) => (
      <Still key={c.id} id={`Sheet-${c.id}`} component={CharacterSheetPage} width={1920} height={1080} defaultProps={{id: c.id}} />
    ))}
    <Still id="AeVsTechnician" component={AeVsTechnician} width={1920} height={1080} />
    <Composition id="Turntable" component={Turntable} durationInFrames={240} fps={30} width={1920} height={1080} />
    <Composition id="Episode01" component={Episode01} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} defaultProps={{audio: true, subtitles: true}} />
    <Composition id="Episode01-NoSubs" component={Episode01} durationInFrames={TOTAL} fps={FPS} width={1920} height={1080} defaultProps={{audio: true, subtitles: false}} />
    {SCENES.map((sc) => (
      <Composition key={sc.id} id={`Scene0${sc.id}`} component={SingleScene} durationInFrames={sc.len} fps={FPS} width={1920} height={1080} defaultProps={{id: sc.id}} />
    ))}
    <Composition id="LookdevMotion" component={FactoryLookdev} durationInFrames={120} fps={30} width={1920} height={1080} defaultProps={{cam: 'wide' as const}} />
  </>
);
