import React from 'react';
import {Icon, LAPTOP} from '../../components/PixelIcons';
import {Confetti} from '../../series/Particles';
import {SeriesCTA} from '../../series/SeriesCTA';
import {SeriesGreeting} from '../../series/SeriesGreeting';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {GiftThanks} from '../../ep03/components/GiftThanks';
import {TOOLBOX} from '../assets/icons';
import {SUPPORTERS} from '../config/supporters';
import {useCues} from '../lib/cues';
import {Ep06Scene01Hook} from './Scene01Hook';
import {Ep06Scene04WhatIs} from './Scene04WhatIs';
import {Ep06Scene05Problems} from './Scene05Problems';
import {Ep06Scene06Troubleshooting} from './Scene06Troubleshooting';
import {Ep06Scene07Steps} from './Scene07Steps';
import {Ep06Scene08Internet} from './Scene08Internet';
import {Ep06Scene09Printer} from './Scene09Printer';
import {Ep06Scene10Factory} from './Scene10Factory';
import {Ep06Scene11Recap} from './Scene11Recap';

// Series-standard scenes, specialised for this episode (laptop + toolbox beside the host).
const Ep06Scene02Greeting: React.FC = () => (
  <SeriesGreeting
    index={1}
    accent={
      <>
        <Icon sprite={TOOLBOX} x={820} y={1060} px={9} delay={10} bob={10} />
        <Icon sprite={LAPTOP} x={830} y={1250} px={7} delay={16} bob={8} phase={20} />
      </>
    }
  />
);
// Same Gift Kek component as Episodes 03–05; seven cards use two columns and four rows.
const Ep06Scene03Supporters: React.FC = () => <GiftThanks index={2} supporters={SUPPORTERS} />;

// Closing: series CTA with confetti from "Gift Kek".
const CtaBackground: React.FC = () => {
  const {f} = useCues(11);
  return (
    <>
      <CyberBackground navyFrom={Infinity} />
      <Confetti start={f('Gift', 10) - 4} count={30} />
    </>
  );
};
const Ep06Scene12CTA: React.FC = () => <SeriesCTA index={11} background={<CtaBackground />} />;

// Order must match SCENES in ep06/config/scenes.ts.
export const EP06_SCENES: React.FC[] = [
  Ep06Scene01Hook,
  Ep06Scene02Greeting,
  Ep06Scene03Supporters,
  Ep06Scene04WhatIs,
  Ep06Scene05Problems,
  Ep06Scene06Troubleshooting,
  Ep06Scene07Steps,
  Ep06Scene08Internet,
  Ep06Scene09Printer,
  Ep06Scene10Factory,
  Ep06Scene11Recap,
  Ep06Scene12CTA,
];
