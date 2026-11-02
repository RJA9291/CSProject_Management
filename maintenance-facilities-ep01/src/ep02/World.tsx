// Episode 02 plant world: the Ep01 world (same factory, office, facility bay, workstations,
// lighting and fog) plus the Episode 02 sets.
import React from 'react';
import {Character} from '../characters/Character';
import {Action} from '../characters/poses';
import {byId, CharacterSpec, HELMET} from '../characters/specs';
import {Exterior} from '../environment/Exterior';
import {Factory} from '../environment/Factory';
import {FacilityBay, Office, Workstations} from '../environment/Sets';
import {Andon, CellPanel, CELL, Entrance, Forklift, HoldSign, LogisticsArea, PPCCorner, QualityStation, SafetyBoard} from '../environment/Ep02Sets';
import {CarBody} from '../environment/Factory';

type V3 = [number, number, number];

export type World02Props = {
  t: number;
  exterior?: boolean;
  sky?: string;
  lineT?: number;
  robotStopT?: number | null; // freeze the cell robot at this time
  andon?: 'green' | 'amber' | 'red';
  locked?: number;
  hold?: number;
  replanned?: boolean;
  forklift?: {p: V3; rotY: number; carry?: boolean} | null;
  stations?: {dbOpen: number; gearReveal: number; arc: boolean};
};

export const World02: React.FC<World02Props> = ({t, exterior = false, sky = '#1e2a3c', lineT, robotStopT = null, andon = 'green', locked = 0, hold = 0, replanned = false, forklift = null, stations}) => (
  <>
    <color attach="background" args={[sky]} />
    <fog attach="fog" args={[sky, exterior ? 80 : 22, exterior ? 320 : 75]} />
    <Factory t={t} cutaway lineT={lineT} stop={robotStopT !== null ? {x: CELL.robotX, t: robotStopT} : undefined} />
    {exterior && (
      <>
        <Exterior roof={1} />
        <Entrance />
      </>
    )}
    <Office signGlow={0.6} />
    <FacilityBay t={t} />
    <Workstations t={t} dbOpen={stations?.dbOpen ?? 0} gearReveal={stations?.gearReveal ?? 0} arc={stations?.arc ?? false} />
    <QualityStation />
    <LogisticsArea />
    <PPCCorner replanned={replanned} />
    <SafetyBoard p={[-9.6, 0, 7.95]} rotY={Math.PI} />
    <Andon state={andon} t={t} />
    <CellPanel locked={locked} />
    <HoldSign p={hold} />
    {/* production pre-assembly station at the start of the line */}
    <CarBody p={[-27.8, 0.55, 0]} c="#c9ced6" />
    {forklift && (
      <>
        <Forklift p={forklift.p} rotY={forklift.rotY} carry={forklift.carry} />
        <Character spec={byId('logistics')} action="sit" t={t} position={offset(forklift.p, forklift.rotY, [0, 0.58, -0.38])} rotationY={forklift.rotY} />
      </>
    )}
  </>
);

/** World position of a point given in an object's local frame. */
export const offset = (p: V3, rotY: number, local: V3): V3 => [
  p[0] + local[0] * Math.cos(rotY) + local[2] * Math.sin(rotY),
  p[1] + local[1],
  p[2] - local[0] * Math.sin(rotY) + local[2] * Math.cos(rotY),
];

/** Office roles wear a helmet whenever they are on the production floor. */
export const onFloor = (id: string): CharacterSpec => {
  const s = byId(id);
  return s.helmet ? s : {...s, helmet: HELMET.management};
};

export const Person: React.FC<{id: string; floor?: boolean; action?: Action; t: number; p: V3; r?: number}> = ({id, floor = true, action = 'idle', t, p, r = 0}) => (
  <Character spec={floor ? onFloor(id) : byId(id)} action={action} t={t} position={p} rotationY={r} />
);
