import React from 'react';
import {Icon, SHIELD} from '../../components/PixelIcons';
import {Confetti} from '../../series/Particles';
import {SeriesCTA} from '../../series/SeriesCTA';
import {SeriesGreeting} from '../../series/SeriesGreeting';
import {GiftThanks} from '../components/GiftThanks';
import {CyberBackground} from '../components/CyberBackground';
import {SUPPORTERS} from '../config/supporters';
import {useCues} from '../lib/cues';
import {Ep03Scene01Hook} from './Scene01Hook';
import {Ep03Scene04WhatIs} from './Scene04WhatIs';
import {Ep03Scene05Threats} from './Scene05Threats';
import {Ep03Scene06Phishing} from './Scene06Phishing';
import {Ep03Scene07StopCheckVerify} from './Scene07StopCheckVerify';
import {Ep03Scene08PasswordMFA} from './Scene08PasswordMFA';
import {Ep03Scene09Hygiene} from './Scene09Hygiene';
import {Ep03Scene10Victim} from './Scene10Victim';
import {Ep03Scene11Recap} from './Scene11Recap';

// Series-standard scenes, specialised for this episode.
const Ep03Scene02Greeting: React.FC = () => <SeriesGreeting index={1} accent={<Icon sprite={SHIELD} x={800} y={1000} px={9} delay={10} bob={12} />} />;
const Ep03Scene03Supporters: React.FC = () => <GiftThanks index={2} supporters={SUPPORTERS} />;

// Closing: series CTA over the dotted background, with pixel confetti on "Jumpa lagi".
const CtaBackground: React.FC = () => {
  const {f} = useCues(11);
  return (
    <>
      <CyberBackground navyFrom={Infinity} />
      <Confetti start={f('Gift', 10) - 4} count={30} />
    </>
  );
};
const Ep03Scene12CTA: React.FC = () => <SeriesCTA index={11} background={<CtaBackground />} />;

// Order must match SCENES in ep03/config/scenes.ts.
export const EP03_SCENES: React.FC[] = [
  Ep03Scene01Hook,
  Ep03Scene02Greeting,
  Ep03Scene03Supporters,
  Ep03Scene04WhatIs,
  Ep03Scene05Threats,
  Ep03Scene06Phishing,
  Ep03Scene07StopCheckVerify,
  Ep03Scene08PasswordMFA,
  Ep03Scene09Hygiene,
  Ep03Scene10Victim,
  Ep03Scene11Recap,
  Ep03Scene12CTA,
];
