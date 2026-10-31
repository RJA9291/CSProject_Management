import timeline from './timeline.json';
import durations from './vo-durations.json';
import narration from './narration.json';

export const TL = timeline;
export const FPS = timeline.fps;
export type SceneKey = keyof typeof timeline.scenes;
export type VoId = keyof typeof timeline.vo;
export type BeatKey = keyof typeof timeline.beats;

export const scene = (k: SceneKey) => timeline.scenes[k];
export const beat = (k: BeatKey) => timeline.beats[k];

export type Line = {
  id: VoId;
  scene: number;
  lang: 'en' | 'ms';
  sub: string;
  tr: string;
  from: number;
  to: number;
};

export const LINES: Line[] = narration.lines.map((l) => {
  const id = l.id as VoId;
  const from = timeline.vo[id];
  const dur = (durations as Record<string, number>)[id];
  return {
    id,
    scene: l.scene,
    lang: l.lang as 'en' | 'ms',
    sub: l.sub,
    tr: l.tr,
    from,
    to: from + Math.ceil(dur * timeline.fps),
  };
});
