// Keyframed camera along a Catmull-Rom spline (position, target and fov), so moves
// are continuous fly-throughs rather than stop-start tweens.
import React from 'react';
import {useThree} from '@react-three/fiber';
import {PerspectiveCamera} from 'three';

export type V3 = [number, number, number];
export type CamKey = {f: number; pos: V3; look: V3; fov?: number};

const cr = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);

const smooth = (t: number) => t * t * (3 - 2 * t);

/** Sample a camera path at frame f. `ease` softens the start and end of the whole path. */
export const sampleCam = (keys: CamKey[], f: number, ease = true) => {
  if (f <= keys[0].f) return {pos: keys[0].pos, look: keys[0].look, fov: keys[0].fov ?? 40};
  const last = keys[keys.length - 1];
  if (f >= last.f) return {pos: last.pos, look: last.look, fov: last.fov ?? 40};
  // optional global ease: remap f inside [first, last]
  const span = last.f - keys[0].f;
  const gf = ease ? keys[0].f + smooth((f - keys[0].f) / span) * span : f;
  let i = 0;
  while (i < keys.length - 2 && gf > keys[i + 1].f) i++;
  const k0 = keys[Math.max(0, i - 1)];
  const k1 = keys[i];
  const k2 = keys[i + 1];
  const k3 = keys[Math.min(keys.length - 1, i + 2)];
  const t = (gf - k1.f) / (k2.f - k1.f);
  const v = (a: V3, b: V3, c: V3, d: V3) => [0, 1, 2].map((j) => cr(a[j], b[j], c[j], d[j], t)) as V3;
  return {
    pos: v(k0.pos, k1.pos, k2.pos, k3.pos),
    look: v(k0.look, k1.look, k2.look, k3.look),
    fov: cr(k0.fov ?? 40, k1.fov ?? 40, k2.fov ?? 40, k3.fov ?? 40, t),
  };
};

export const PathCamera: React.FC<{keys: CamKey[]; frame: number; ease?: boolean; shake?: number}> = ({keys, frame, ease = true, shake = 0}) => {
  const {camera} = useThree();
  const c = sampleCam(keys, frame, ease);
  const sx = shake ? Math.sin(frame * 0.37) * shake + Math.sin(frame * 0.11) * shake * 0.6 : 0;
  const sy = shake ? Math.cos(frame * 0.29) * shake * 0.6 : 0;
  camera.position.set(c.pos[0] + sx, c.pos[1] + sy, c.pos[2]);
  (camera as PerspectiveCamera).fov = c.fov;
  (camera as PerspectiveCamera).near = 0.05;
  (camera as PerspectiveCamera).far = 600;
  (camera as PerspectiveCamera).updateProjectionMatrix();
  camera.lookAt(c.look[0], c.look[1], c.look[2]);
  return null;
};

/** Interpolate a position along waypoints by frame (linear, for walking characters). */
export const along = (pts: {f: number; p: V3}[], f: number): {p: V3; heading: number; moving: boolean} => {
  if (f <= pts[0].f) return {p: pts[0].p, heading: heading(pts[0].p, pts[1].p), moving: false};
  const last = pts[pts.length - 1];
  if (f >= last.f) return {p: last.p, heading: heading(pts[pts.length - 2].p, last.p), moving: false};
  let i = 0;
  while (i < pts.length - 2 && f > pts[i + 1].f) i++;
  const a = pts[i];
  const b = pts[i + 1];
  const t = (f - a.f) / (b.f - a.f);
  return {p: [0, 1, 2].map((j) => a.p[j] + (b.p[j] - a.p[j]) * t) as V3, heading: heading(a.p, b.p), moving: true};
};

const heading = (a: V3, b: V3) => Math.atan2(b[0] - a[0], b[2] - a[2]);
