import React from 'react';
import {Icon} from '../../components/PixelIcons';
import {Confetti} from '../../series/Particles';
import {SeriesCTA} from '../../series/SeriesCTA';
import {SeriesGreeting} from '../../series/SeriesGreeting';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {GiftThanks} from '../../ep03/components/GiftThanks';
import {WIFI} from '../assets/icons';
import {SUPPORTERS} from '../config/supporters';
import {useCues} from '../lib/cues';
import {Ep04Scene01Hook} from './Scene01Hook';
import {Ep04Scene04WhatIs} from './Scene04WhatIs';
import {Ep04Scene05Types} from './Scene05Types';
import {Ep04Scene06RouterSwitch} from './Scene06RouterSwitch';
import {Ep04Scene07IPMAC} from './Scene07IPMAC';
import {Ep04Scene08DNSDHCP} from './Scene08DNSDHCP';
import {Ep04Scene09DataFlow} from './Scene09DataFlow';
import {Ep04Scene10Factory} from './Scene10Factory';
import {Ep04Scene11Recap} from './Scene11Recap';

// Series-standard scenes, specialised for this episode.
const Ep04Scene02Greeting: React.FC = () => <SeriesGreeting index={1} accent={<Icon sprite={WIFI(3)} x={800} y={1010} px={10} delay={10} bob={12} />} />;
// Same Gift Kek component as Episode 03; the card layout adapts to the number of supporters.
const Ep04Scene03Supporters: React.FC = () => <GiftThanks index={2} supporters={SUPPORTERS} />;

// Closing: series CTA over the dotted background, with pixel confetti from "Gift Kek".
const CtaBackground: React.FC = () => {
  const {f} = useCues(11);
  return (
    <>
      <CyberBackground navyFrom={Infinity} />
      <Confetti start={f('Gift', 10) - 4} count={30} />
    </>
  );
};
const Ep04Scene12CTA: React.FC = () => <SeriesCTA index={11} background={<CtaBackground />} />;

// Order must match SCENES in ep04/config/scenes.ts.
export const EP04_SCENES: React.FC[] = [
  Ep04Scene01Hook,
  Ep04Scene02Greeting,
  Ep04Scene03Supporters,
  Ep04Scene04WhatIs,
  Ep04Scene05Types,
  Ep04Scene06RouterSwitch,
  Ep04Scene07IPMAC,
  Ep04Scene08DNSDHCP,
  Ep04Scene09DataFlow,
  Ep04Scene10Factory,
  Ep04Scene11Recap,
  Ep04Scene12CTA,
];
