import React from 'react';

type Pt = [number, number];

type Props = {
  points: Pt[];
  // 0..1 portion of the path that is drawn.
  progress: number;
  color: string;
  dot?: number;
  spacing?: number;
  // Marching offset in px so the dashes look alive.
  march?: number;
};

// Dotted pixel path: square dots placed along a polyline, revealed by `progress`.
export const Connector: React.FC<Props> = ({points, progress, color, dot = 14, spacing = 26, march = 0}) => {
  const segs = points.slice(1).map((p, i) => {
    const a = points[i];
    return {a, b: p, len: Math.hypot(p[0] - a[0], p[1] - a[1])};
  });
  const total = segs.reduce((s, x) => s + x.len, 0);
  const shownLen = total * Math.max(0, Math.min(1, progress));
  const dots: Pt[] = [];
  for (let d = march % spacing; d <= shownLen; d += spacing) {
    let rest = d;
    for (const s of segs) {
      if (rest <= s.len) {
        const t = s.len === 0 ? 0 : rest / s.len;
        dots.push([s.a[0] + (s.b[0] - s.a[0]) * t, s.a[1] + (s.b[1] - s.a[1]) * t]);
        break;
      }
      rest -= s.len;
    }
  }
  return (
    <>
      {dots.map(([x, y], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: Math.round((x - dot / 2) / 2) * 2,
            top: Math.round((y - dot / 2) / 2) * 2,
            width: dot,
            height: dot,
            background: color,
          }}
        />
      ))}
    </>
  );
};
