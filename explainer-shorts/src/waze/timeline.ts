import {cue, FPS, makeTimeline, ScriptShot, Shot, Timing} from '../lib/timeline';
import script from './script.json';
import timings from './timings.json';

export {cue, FPS};
export type {Shot};

export const {SHOTS, TOTAL_FRAMES} = makeTimeline(script.shots as ScriptShot[], timings as Record<string, Timing>, 'audio/waze/vo');
export const shotById = (id: string) => SHOTS.find((s) => s.id === id)!;
