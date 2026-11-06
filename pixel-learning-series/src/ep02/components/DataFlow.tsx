import React from 'react';
import {useCurrentFrame} from 'remotion';
import {PixelSprite, Sprite} from '../../components/PixelSprite';
import {snap} from '../../lib/anim';
import {PACKET} from '../assets/icons';

type Pt = [number, number];

type Props = {
  points: Pt[];
  start: number;
  // Stop spawning new packets after this frame (packets in flight finish).
  end?: number;
  // Frames for one packet to travel the whole path.
  travel?: number;
  // Frames between packets.
  every?: number;
  sprite?: Sprite;
  px?: number;
  // Draw the dotted track the packets follow.
  track?: string;
};

const along = (points: Pt[], t: number): Pt => {
  const segs = points.slice(1).map((p, i) => ({a: points[i], b: p, len: Math.hypot(p[0] - points[i][0], p[1] - points[i][1])}));
  const total = segs.reduce((s, x) => s + x.len, 0);
  let d = t * total;
  for (const s of segs) {
    if (d <= s.len) return [s.a[0] + ((s.b[0] - s.a[0]) * d) / s.len, s.a[1] + ((s.b[1] - s.a[1]) * d) / s.len];
    d -= s.len;
  }
  return points[points.length - 1];
};

// Data packets travelling along a path (laptop -> cloud, cloud -> phone, request/response...).
export const DataFlow: React.FC<Props> = ({points, start, end = Infinity, travel = 30, every = 10, sprite = PACKET, px = 6, track}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;
  const w = (sprite[0]?.length ?? 0) * px;
  const h = sprite.length * px;
  const packets: Pt[] = [];
  for (let s = start; s <= Math.min(frame, end); s += every) {
    const t = (frame - s) / travel;
    if (t >= 0 && t <= 1) packets.push(along(points, t));
  }
  const dots: Pt[] = [];
  if (track) {
    const total = points.slice(1).reduce((acc, p, i) => acc + Math.hypot(p[0] - points[i][0], p[1] - points[i][1]), 0);
    for (let d = 0; d < total; d += 24) dots.push(along(points, d / total));
  }
  return (
    <>
      {dots.map(([x, y], i) => (
        <div key={`d${i}`} style={{position: 'absolute', left: snap(x - 4, 2), top: snap(y - 4, 2), width: 8, height: 8, background: track, opacity: 0.7}} />
      ))}
      {packets.map(([x, y], i) => (
        <div key={i} style={{position: 'absolute', left: snap(x - w / 2, 4), top: snap(y - h / 2, 4)}}>
          <PixelSprite sprite={sprite} px={px} />
        </div>
      ))}
    </>
  );
};
