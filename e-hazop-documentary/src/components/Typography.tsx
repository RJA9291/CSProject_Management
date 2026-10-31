import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {LINES} from '../data/timeline';
import {C, F, SAFE} from '../theme';
import {clamp, ease, progress} from './motion';

/** Academic title block (Scene 1). */
export const TitleCard: React.FC<{
  at: number;
  name: string;
  matric: string;
  code: string;
  subject: string;
  assignment: string;
  topic: string;
}> = ({at, name, matric, code, subject, assignment, topic}) => {
  const frame = useCurrentFrame();
  const row = (i: number) => {
    const p = progress(frame, at + 8 + i * 7, 18);
    return {opacity: p, transform: `translateY(${(1 - p) * 18}px)`};
  };
  const line = progress(frame, at, 30, ease.inOut);
  return (
    <AbsoluteFill style={{fontFamily: F.sans, color: C.white}}>
      <div style={{position: 'absolute', left: 200, top: 210, width: 6, height: 660 * line, background: `linear-gradient(${C.blueLight}, ${C.blue} 60%, transparent)`}} />
      <div style={{position: 'absolute', left: 250, top: 200}}>
        <div style={{...row(0), fontFamily: F.mono, fontSize: 22, letterSpacing: 6, color: C.blueLight}}>{assignment}</div>
        <div style={{...row(1), fontSize: 84, fontWeight: 800, letterSpacing: 1, marginTop: 26, lineHeight: 1}}>{name}</div>
        <div style={{...row(2), fontSize: 34, fontWeight: 300, marginTop: 18, color: C.ice}}>
          Matric No.: <span style={{fontWeight: 600, fontFamily: F.mono}}>{matric}</span>
        </div>
        <div style={{...row(3), width: 900, height: 1, background: 'rgba(219,233,247,0.2)', marginTop: 44}} />
        <div style={{...row(4), marginTop: 40, fontFamily: F.mono, fontSize: 30, fontWeight: 700, color: C.blueLight}}>{code}</div>
        <div style={{...row(5), fontSize: 38, fontWeight: 600, marginTop: 8, letterSpacing: 1}}>{subject}</div>
        <div style={{...row(6), marginTop: 56, display: 'inline-flex', alignItems: 'center', gap: 22, padding: '18px 30px', borderRadius: 12, background: 'rgba(46,127,217,0.14)', border: '1.5px solid rgba(111,178,255,0.35)'}}>
          <span style={{fontFamily: F.mono, fontSize: 22, letterSpacing: 4, color: C.grey}}>TOPIC</span>
          <span style={{fontSize: 36, fontWeight: 800, letterSpacing: 1}}>{topic}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Scene chapter label, top-left (e.g. "02 · THE HIDDEN RISKS"). */
export const SceneLabel: React.FC<{n: number; title: string; at: number; out: number}> = ({n, title, at, out}) => {
  const frame = useCurrentFrame();
  const o = Math.min(progress(frame, at, 14), 1 - progress(frame, out - 14, 14));
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: SAFE.x, top: SAFE.top - 10, display: 'flex', alignItems: 'center', gap: 18, opacity: o, fontFamily: F.sans}}>
      <span style={{fontFamily: F.mono, fontWeight: 700, fontSize: 22, color: C.blueLight}}>{String(n).padStart(2, '0')}</span>
      <span style={{width: 60 * o, height: 2, background: C.blueLight}} />
      <span style={{fontWeight: 600, fontSize: 22, letterSpacing: 5, color: C.ice}}>{title}</span>
    </div>
  );
};

/** Large centred heading with optional sub-line. */
export const Heading: React.FC<{text: string; sub?: string; at: number; out?: number; y?: number; size?: number; color?: string}> = ({
  text,
  sub,
  at,
  out = 1e9,
  y = 140,
  size = 64,
  color = C.white,
}) => {
  const frame = useCurrentFrame();
  const p = progress(frame, at, 18);
  const o = Math.min(p, 1 - progress(frame, out - 12, 12));
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: F.sans, opacity: o, transform: `translateY(${(1 - p) * 20}px)`}}>
      <div style={{fontSize: size, fontWeight: 800, letterSpacing: 1.5, color}}>{text}</div>
      {sub && <div style={{fontSize: 26, fontWeight: 300, color: C.grey, marginTop: 10, letterSpacing: 1}}>{sub}</div>}
    </div>
  );
};

/** "ILLUSTRATIVE SCENARIO" badge – makes clear the example is not a real incident. */
export const IllustrativeBadge: React.FC<{at: number; out: number; text?: string}> = ({at, out, text = 'ILLUSTRATIVE SCENARIO · NOT A RECORDED INCIDENT'}) => {
  const frame = useCurrentFrame();
  const o = Math.min(progress(frame, at, 12), 1 - progress(frame, out - 12, 12));
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', right: SAFE.x, top: SAFE.top - 14, padding: '10px 18px', borderRadius: 8, border: `1.5px solid ${C.amber}`, color: C.amber, fontFamily: F.mono, fontWeight: 700, fontSize: 18, letterSpacing: 2, background: 'rgba(40,28,6,0.7)', opacity: o}}>
      {text}
    </div>
  );
};

/** Closing statement lines (Scene 7). */
export const ClosingStatement: React.FC<{title: string; lines: string[]; at: number[]}> = ({title, lines, at}) => {
  const frame = useCurrentFrame();
  const t = progress(frame, at[0], 24);
  return (
    <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', fontFamily: F.sans}}>
      <div style={{textAlign: 'center', marginTop: -60}}>
        <div style={{fontSize: 150, fontWeight: 800, letterSpacing: interpolate(t, [0, 1], [30, 8]), color: C.white, opacity: t, textShadow: `0 0 60px ${C.blue}`}}>{title}</div>
        <div style={{width: 520 * t, height: 2, background: `linear-gradient(90deg, transparent, ${C.blueLight}, transparent)`, margin: '20px auto 36px'}} />
        {lines.map((l, i) => {
          const p = progress(frame, at[i + 1], 18);
          return (
            <div key={l} style={{fontSize: 46, fontWeight: i === lines.length - 1 ? 800 : 600, letterSpacing: 3, color: i === lines.length - 1 ? C.amber : C.ice, opacity: p, transform: `translateY(${(1 - p) * 16}px)`, marginTop: 14}}>
              {l}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/** Reference end card. */
export const ReferencesCard: React.FC<{at: number; refs: {title: string; org: string; url: string}[]; footer: string}> = ({at, refs, footer}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.bg, fontFamily: F.sans, padding: '80px 140px', boxSizing: 'border-box', opacity: progress(frame, at, 15)}}>
      <div style={{fontFamily: F.mono, fontSize: 22, letterSpacing: 6, color: C.blueLight}}>REFERENCES</div>
      <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 18}}>
        {refs.map((r, i) => (
          <div key={r.url} style={{display: 'flex', gap: 22, opacity: progress(frame, at + 4 + i * 3, 10)}}>
            <div style={{fontFamily: F.mono, fontSize: 20, color: C.greyDark, width: 34}}>{i + 1}.</div>
            <div>
              <div style={{fontSize: 27, fontWeight: 600, color: C.white}}>
                {r.org} — <span style={{fontWeight: 400, color: C.ice}}>{r.title}</span>
              </div>
              {r.url && <div style={{fontFamily: F.mono, fontSize: 19, color: C.blueLight, marginTop: 4}}>{r.url}</div>}
            </div>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', left: 140, right: 140, bottom: 56, fontSize: 21, color: C.grey, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 18}}>{footer}</div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------ subtitles

const TERMS = ['E-HAZOP', 'HAZOP', 'Electrical Hazard and Operability Study', 'nodes', 'guidewords', 'deviations', 'deviation', 'safeguards', 'hazard register', 'single-line diagrams', 'overvoltage', 'multidisciplinary team', 'insulation'];
const termRe = new RegExp(`(${TERMS.map((t) => t.replace(/[-]/g, '\\-')).join('|')})`, 'gi');

/** Burned-in English subtitles with key technical terms highlighted. */
export const Subtitles: React.FC<{hold?: number}> = ({hold = 8}) => {
  const frame = useCurrentFrame();
  const idx = LINES.findIndex((l, i) => {
    const next = LINES[i + 1];
    return frame >= l.from && frame < Math.min(l.to + hold, next ? next.from : Infinity);
  });
  if (idx < 0) return null;
  const l = LINES[idx];
  const next = LINES[idx + 1];
  const end = Math.min(l.to + hold, next ? next.from : Infinity);
  const o = Math.min(interpolate(frame, [l.from, l.from + 4], [0, 1], clamp), interpolate(frame, [end - 4, end], [1, 0], clamp));
  const parts = l.sub.split(termRe);
  return (
    <div style={{position: 'absolute', left: 260, right: 260, bottom: SAFE.bottom, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div
        style={{
          fontFamily: F.sans,
          fontSize: 36,
          fontWeight: 600,
          lineHeight: 1.35,
          color: C.white,
          textAlign: 'center',
          padding: '10px 26px',
          borderRadius: 10,
          background: 'rgba(4,8,14,0.62)',
          textShadow: '0 2px 6px rgba(0,0,0,0.8)',
        }}
      >
        {parts.map((p, i) => (TERMS.some((t) => t.toLowerCase() === p.toLowerCase()) ? <span key={i} style={{color: '#ffd27a'}}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>))}
      </div>
    </div>
  );
};
