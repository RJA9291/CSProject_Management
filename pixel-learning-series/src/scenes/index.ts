import type React from 'react';
import {Scene01Hook} from './Scene01Hook';
import {Scene02Problem} from './Scene02Problem';
import {Scene03Greeting} from './Scene03Greeting';
import {Scene04Gift} from './Scene04Gift';
import {Scene05Introduction} from './Scene05Introduction';
import {Scene06LFCA} from './Scene06LFCA';
import {Scene07Roadmap} from './Scene07Roadmap';
import {Scene08Systems} from './Scene08Systems';
import {Scene09Network} from './Scene09Network';
import {Scene10Software} from './Scene10Software';
import {Scene11Summary} from './Scene11Summary';
import {Scene12Closing} from './Scene12Closing';

// Order must match SCENES in config/scenes.ts.
export const SCENE_COMPONENTS: React.FC[] = [
  Scene01Hook,
  Scene02Problem,
  Scene03Greeting,
  Scene04Gift,
  Scene05Introduction,
  Scene06LFCA,
  Scene07Roadmap,
  Scene08Systems,
  Scene09Network,
  Scene10Software,
  Scene11Summary,
  Scene12Closing,
];
