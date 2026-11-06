import type React from 'react';
import {Icon} from '../../components/PixelIcons';
import {CLOUD} from '../../assets/icons/icons';
import {SeriesCTA} from '../../series/SeriesCTA';
import {SeriesGreeting} from '../../series/SeriesGreeting';
import {SupporterThanks} from '../../series/SupporterThanks';
import {SUPPORTERS} from '../config/supporters';
import {Ep02Scene01Hook} from './Scene01Hook';
import {Ep02Scene04Topic} from './Scene04Topic';
import {Ep02Scene05WhatIs} from './Scene05WhatIs';
import {Ep02Scene06Everyday} from './Scene06Everyday';
import {Ep02Scene07ServiceModels} from './Scene07ServiceModels';
import {Ep02Scene08Deployment} from './Scene08Deployment';
import {Ep02Scene09Architecture} from './Scene09Architecture';
import {Ep02Scene10Security} from './Scene10Security';
import {Ep02Scene11Business} from './Scene11Business';
import {Ep02Scene12Recap} from './Scene12Recap';
import {Ep02Scene13Closing} from './Scene13Closing';

// Series-standard scenes, specialised for this episode.
const Ep02Scene02Greeting: React.FC = () => <SeriesGreeting index={1} accent={<Icon sprite={CLOUD} x={800} y={1000} px={9} delay={10} bob={12} />} />;
const Ep02Scene03Supporters: React.FC = () => <SupporterThanks index={2} supporters={SUPPORTERS} />;
const Ep02Scene14CTA: React.FC = () => <SeriesCTA index={13} />;

// Order must match SCENES in ep02/config/scenes.ts.
export const EP02_SCENES: React.FC[] = [
  Ep02Scene01Hook,
  Ep02Scene02Greeting,
  Ep02Scene03Supporters,
  Ep02Scene04Topic,
  Ep02Scene05WhatIs,
  Ep02Scene06Everyday,
  Ep02Scene07ServiceModels,
  Ep02Scene08Deployment,
  Ep02Scene09Architecture,
  Ep02Scene10Security,
  Ep02Scene11Business,
  Ep02Scene12Recap,
  Ep02Scene13Closing,
  Ep02Scene14CTA,
];
