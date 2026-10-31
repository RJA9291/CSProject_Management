import timeline from './timeline.json';
import durations from './vo-durations.json';
import narration from './narration.json';

export const TL = timeline;
export const FPS = timeline.fps;
export type VoId = keyof typeof timeline.vo;
export type SceneKey = keyof typeof timeline.scenes;

export const sceneRange = (k: SceneKey) => timeline.scenes[k];

const DUR = durations as Record<string, number>;
const SAY = Object.fromEntries(narration.lines.map((l) => [l.id, l.say]));

/** Start frame of a narration line. */
export const vo = (id: VoId) => timeline.vo[id];
/** End frame of a narration line. */
export const voEnd = (id: VoId) => timeline.vo[id] + Math.ceil(DUR[id] * timeline.fps);
/**
 * Approximate frame at which `word` is spoken inside a line (by character
 * position in the spoken text). Good enough to sync captions/graphics.
 */
export const wordAt = (id: VoId, word: string, nth = 0) => {
  const s = SAY[id].toLowerCase();
  let idx = -1;
  for (let i = 0; i <= nth; i++) idx = s.indexOf(word.toLowerCase(), idx + 1);
  const frac = idx < 0 ? 0 : idx / s.length;
  return Math.round(vo(id) + frac * DUR[id] * timeline.fps);
};

export type Line = {id: VoId; scene: number; sub: string; from: number; to: number};
export const LINES: Line[] = narration.lines.map((l) => ({
  id: l.id as VoId,
  scene: l.scene,
  sub: l.sub,
  from: vo(l.id as VoId),
  to: voEnd(l.id as VoId),
}));
