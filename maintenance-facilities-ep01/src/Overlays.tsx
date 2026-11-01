// Episode-level overlays on the global timeline: opening title card and Malay subtitles.
import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {LINES} from './data/timeline';
import {FONT, MONO} from './lib/text';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** DI SEBALIK OPERASI KILANG – shown over the opening aerial. */
export const OpeningTitle: React.FC<{from?: number; to?: number}> = ({from = 20, to = 150}) => {
  const f = useCurrentFrame();
  const o = Math.min(interpolate(f, [from, from + 18], [0, 1], clamp), interpolate(f, [to - 18, to], [1, 0], clamp));
  if (o <= 0) return null;
  const p = interpolate(f, [from, from + 30], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 120, top: 360, opacity: o, fontFamily: FONT}}>
      <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: 8, color: '#e8771e'}}>EPISODE 01</div>
      <div style={{width: 90 * p, height: 5, background: '#e8771e', margin: '16px 0 20px'}} />
      <div style={{fontSize: 92, fontWeight: 800, color: '#fff', letterSpacing: 4 + 6 * (1 - p), lineHeight: 1, textShadow: '0 6px 30px rgba(0,0,0,0.55)'}}>
        DI SEBALIK
        <br />
        OPERASI KILANG
      </div>
      <div style={{fontSize: 32, fontWeight: 600, color: '#e3ebf4', marginTop: 22, textShadow: '0 3px 14px rgba(0,0,0,0.6)'}}>Mengenali Department Maintenance &amp; Facilities</div>
    </div>
  );
};

// Highlighted key words (and their verb forms) in the subtitles.
const KEY = /(penyelenggaraan|menyelenggara|pemantauan|memantau|keselamatan|prestasi|pematuhan)/gi;
const isKey = (s: string) => /^(penyelenggaraan|menyelenggara|pemantauan|memantau|keselamatan|prestasi|pematuhan)$/i.test(s);

/** Bahasa Melayu subtitles following the narration, with key words highlighted. */
export const Subtitles: React.FC<{hold?: number}> = ({hold = 8}) => {
  const f = useCurrentFrame();
  const i = LINES.findIndex((l, k) => {
    const next = LINES[k + 1];
    return f >= l.from && f < Math.min(l.to + hold, next ? next.from : Infinity);
  });
  if (i < 0) return null;
  const l = LINES[i];
  const next = LINES[i + 1];
  const end = Math.min(l.to + hold, next ? next.from : Infinity);
  const o = Math.min(interpolate(f, [l.from, l.from + 4], [0, 1], clamp), interpolate(f, [end - 4, end], [1, 0], clamp));
  const parts = l.sub.split(KEY);
  return (
    <div style={{position: 'absolute', left: 240, right: 240, bottom: 64, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{fontFamily: FONT, fontSize: 36, fontWeight: 600, lineHeight: 1.35, color: '#fff', textAlign: 'center', padding: '10px 26px', borderRadius: 10, background: 'rgba(6,10,18,0.6)', textShadow: '0 2px 6px rgba(0,0,0,0.8)'}}>
        {parts.map((p, k) =>
          isKey(p) ? (
            <span key={k} style={{color: '#ffb066', fontWeight: 800}}>
              {p.toUpperCase()}
            </span>
          ) : (
            <React.Fragment key={k}>{p}</React.Fragment>
          ),
        )}
      </div>
    </div>
  );
};
