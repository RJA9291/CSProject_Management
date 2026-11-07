import React from 'react';
import {Confetti} from '../../series/Particles';
import {SeriesCTA} from '../../series/SeriesCTA';
import {SeriesGreeting} from '../../series/SeriesGreeting';
import {CyberBackground} from '../../ep03/components/CyberBackground';
import {GiftThanks} from '../../ep03/components/GiftThanks';
import {Tux} from '../components/Tux';
import {SUPPORTERS} from '../config/supporters';
import {useCues} from '../lib/cues';
import {Ep05Scene01Hook} from './Scene01Hook';
import {Ep05Scene04WhatIs} from './Scene04WhatIs';
import {Ep05Scene05LinuxVsWindows} from './Scene05LinuxVsWindows';
import {Ep05Scene06Kernel} from './Scene06Kernel';
import {Ep05Scene07Distros} from './Scene07Distros';
import {Ep05Scene08GuiCli} from './Scene08GuiCli';
import {Ep05Scene09Commands} from './Scene09Commands';
import {Ep05Scene10Server} from './Scene10Server';
import {Ep05Scene11Recap} from './Scene11Recap';

// Series-standard scenes, specialised for this episode with Tux alongside the host.
const Ep05Scene02Greeting: React.FC = () => <SeriesGreeting index={1} accent={<Tux x={820} y={1120} px={7} pose="wave" flip enter="right" enterAt={6} />} />;

const GiftTux: React.FC = () => {
  const {f, end} = useCues(2);
  return <Tux x={880} y={1430} px={5} pose="wave" flip hopFrom={end - 30} hopUntil={end + 60} enter="right" enterAt={f('terima', 1)} />;
};
// Same Gift Kek component as Episodes 03–04; six cards use the two-column layout.
const Ep05Scene03Supporters: React.FC = () => <GiftThanks index={2} supporters={SUPPORTERS} extra={<GiftTux />} />;

// Closing: series CTA with confetti from "Gift Kek" and Tux waving goodbye.
const CtaBackground: React.FC = () => {
  const {f} = useCues(11);
  return (
    <>
      <CyberBackground navyFrom={Infinity} />
      <Confetti start={f('Gift', 10) - 4} count={30} />
      <Tux x={890} y={1430} px={5} pose="wave" flip enter="right" enterAt={10} />
    </>
  );
};
const Ep05Scene12CTA: React.FC = () => <SeriesCTA index={11} background={<CtaBackground />} />;

// Order must match SCENES in ep05/config/scenes.ts.
export const EP05_SCENES: React.FC[] = [
  Ep05Scene01Hook,
  Ep05Scene02Greeting,
  Ep05Scene03Supporters,
  Ep05Scene04WhatIs,
  Ep05Scene05LinuxVsWindows,
  Ep05Scene06Kernel,
  Ep05Scene07Distros,
  Ep05Scene08GuiCli,
  Ep05Scene09Commands,
  Ep05Scene10Server,
  Ep05Scene11Recap,
  Ep05Scene12CTA,
];
