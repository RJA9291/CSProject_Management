// "Siri Barang Dapur": technical-documentary reel (E-HAZOP look, vertical). Ep 01: periuk nasi elektrik.
import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {cue, FPS, makeTimeline, ScriptShot, Shot, Timing} from '../lib/timeline';
import {Cooker} from './Cooker';
import script from './script.json';
import {D} from './theme';
import timings from './timings.json';

export const {SHOTS, TOTAL_FRAMES} = makeTimeline(script.shots as ScriptShot[], timings as Record<string, Timing>, 'audio/dapur/vo', script.say as Record<string, string>);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const fade = (f: number, at: number, len = 12) => interpolate(f, [at, at + len], [0, 1], {...clamp, easing: ease});

// ---------- shared pieces ----------

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `radial-gradient(120% 70% at 50% 38%, ${D.navy2} 0%, ${D.navy} 45%, ${D.bg} 100%)`}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 13}, (_, i) => (
          <line key={`v${i}`} x1={i * 90} y1={0} x2={i * 90} y2={1920} stroke={D.blueLight} strokeOpacity={0.035} />
        ))}
        {Array.from({length: 22}, (_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 90} x2={1080} y2={i * 90} stroke={D.blueLight} strokeOpacity={0.035} />
        ))}
        {/* drifting dust */}
        {Array.from({length: 26}, (_, i) => (
          <circle key={i} cx={(i * 211 + f * (0.2 + (i % 5) * 0.08)) % 1080} cy={(i * 347 + f * 0.15 * (i % 3)) % 1920} r={1.5 + (i % 3)} fill={D.ice} opacity={0.08 + (i % 4) * 0.03} />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const Chapter: React.FC<{n: string; title: string}> = ({n, title}) => {
  const f = useCurrentFrame();
  const o = fade(f, 2, 14);
  const w = interpolate(f, [4, 24], [0, 90], {...clamp, easing: ease});
  return (
    <div style={{position: 'absolute', left: 70, top: 120, opacity: o, fontFamily: D.font}}>
      <div style={{fontSize: 24, fontWeight: 600, letterSpacing: 6, color: D.grey}}>SIRI BARANG DAPUR · EP 01</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 14}}>
        <span style={{fontSize: 30, fontWeight: 700, color: D.blueLight, letterSpacing: 4}}>{n}</span>
        <span style={{width: w, height: 2, background: D.blueLight, display: 'inline-block'}} />
        <span style={{fontSize: 30, fontWeight: 700, color: D.white, letterSpacing: 4}}>{title}</span>
      </div>
    </div>
  );
};

// Sentence subtitles in a dark box, keywords in amber (documentary style).
const Subtitles: React.FC<{shot: Shot}> = ({shot}) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const sentences: {words: typeof shot.words; start: number; end: number}[] = [];
  let cur: typeof shot.words = [];
  shot.words.forEach((w, i) => {
    cur.push(w);
    if (/[.?!]$/.test(w.text) || i === shot.words.length - 1) {
      sentences.push({words: cur, start: cur[0].start, end: shot.words[i + 1]?.start ?? w.end + 1});
      cur = [];
    }
  });
  const s = sentences.find((x) => t >= x.start - 0.05 && t < x.end);
  if (!s) return null;
  const o = interpolate(t, [s.start - 0.05, s.start + 0.12], [0, 1], clamp);
  const hl = new Set(shot.highlight);
  return (
    <div style={{position: 'absolute', left: 60, right: 60, top: 1540, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{background: 'rgba(6,10,18,0.78)', border: `1px solid ${D.steel}`, borderRadius: 18, padding: '22px 30px', fontFamily: D.font, fontWeight: 600, fontSize: 44, lineHeight: 1.3, color: D.white, textAlign: 'center'}}>
        {s.words.map((w, i) => (
          <span key={i} style={{color: hl.has(w.text) ? D.amber : D.white}}>
            {w.text}
            {i < s.words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

const Card: React.FC<{x: number; y: number; w: number; h?: number; o?: number; accent?: string; children: React.ReactNode}> = ({x, y, w, h, o = 1, accent = D.steel, children}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      opacity: o,
      transform: `translateY(${(1 - o) * 24}px)`,
      background: 'rgba(15,29,51,0.82)',
      border: `1.5px solid ${accent}`,
      borderRadius: 18,
      padding: '22px 26px',
      boxSizing: 'border-box',
      fontFamily: D.font,
      color: D.white,
    }}
  >
    {children}
  </div>
);

const Small: React.FC<{c?: string; children: React.ReactNode}> = ({c = D.grey, children}) => <div style={{fontSize: 22, fontWeight: 600, letterSpacing: 4, color: c}}>{children}</div>;

// Callout: a dot on the part, a line to an underlined label that starts at lx.
const Callout: React.FC<{px: number; py: number; lx: number; ly: number; n: string; text: string; o: number}> = ({px, py, lx, ly, n, text, o}) => {
  const end = px > lx + 170 ? lx + 340 : lx;
  return (
    <g opacity={o}>
      <circle cx={px} cy={py} r={9} fill={D.amber} />
      <circle cx={px} cy={py} r={18} fill="none" stroke={D.amber} strokeOpacity={0.5} strokeWidth={2} />
      <line x1={px} y1={py} x2={end} y2={ly} stroke={D.amber} strokeWidth={2.5} />
      <line x1={lx} y1={ly} x2={lx + 340} y2={ly} stroke={D.amber} strokeWidth={2.5} />
      <text x={lx} y={ly - 52} fontFamily={D.font} fontWeight={700} fontSize={24} fill={D.blueLight} letterSpacing={3}>
        {n}
      </text>
      <text x={lx} y={ly - 14} fontFamily={D.font} fontWeight={700} fontSize={34} fill={D.white}>
        {text}
      </text>
    </g>
  );
};

// Temperature-vs-time graph. upto = how much of the curve is drawn (0..1).
const curve = (u: number) => {
  if (u < 0.28) return 30 + (u / 0.28) * 70;
  if (u < 0.7) return 100;
  if (u < 0.8) return 100 + ((u - 0.7) / 0.1) * 12;
  return 112 - ((u - 0.8) / 0.2) * 40;
};
const TempGraph: React.FC<{x: number; y: number; w: number; h: number; upto: number; o: number; notes: {u: number; text: string; c: string; show: boolean; below?: boolean}[]}> = ({x, y, w, h, upto, o, notes}) => {
  const px = (u: number) => 80 + u * (w - 120);
  const py = (T: number) => h - 70 - ((T - 20) / 100) * (h - 130);
  const pts: string[] = [];
  for (let u = 0; u <= upto; u += 0.005) pts.push(`${px(u)},${py(curve(u))}`);
  const head = Math.min(upto, 1);
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect width={w} height={h} rx={18} fill="rgba(15,29,51,0.82)" stroke={D.steel} strokeWidth={1.5} />
      <text x={28} y={44} fontFamily={D.font} fontWeight={600} fontSize={22} letterSpacing={4} fill={D.grey}>
        SUHU DASAR PERIUK (°C)
      </text>
      <line x1={80} y1={h - 70} x2={w - 40} y2={h - 70} stroke={D.steelLight} strokeWidth={2} />
      <line x1={80} y1={70} x2={80} y2={h - 70} stroke={D.steelLight} strokeWidth={2} />
      <line x1={80} y1={py(100)} x2={w - 40} y2={py(100)} stroke={D.blueLight} strokeOpacity={0.6} strokeWidth={2} strokeDasharray="10 8" />
      <text x={70} y={py(100) + 8} textAnchor="end" fontFamily={D.font} fontWeight={700} fontSize={24} fill={D.blueLight}>
        100
      </text>
      <text x={w - 44} y={h - 30} textAnchor="end" fontFamily={D.font} fontWeight={600} fontSize={20} fill={D.grey} letterSpacing={3}>
        MASA →
      </text>
      <polyline points={pts.join(' ')} fill="none" stroke={D.amber} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
      {upto > 0 ? <circle cx={px(head)} cy={py(curve(head))} r={11} fill={D.amber} /> : null}
      {notes.map((n) =>
        n.show ? (
          <g key={n.text}>
            <circle cx={px(n.u)} cy={py(curve(n.u))} r={8} fill="none" stroke={n.c} strokeWidth={3} />
            <text x={Math.min(w - 30, Math.max(100, px(n.u)))} y={py(curve(n.u)) + (n.below ? 46 : -26)} textAnchor={px(n.u) > w * 0.6 ? 'end' : 'middle'} fontFamily={D.font} fontWeight={700} fontSize={24} fill={n.c}>
              {n.text}
            </text>
          </g>
        ) : null,
      )}
    </g>
  );
};

// ---------- scenes ----------

const Scene: React.FC<{i: number; shot: Shot}> = ({i, shot}) => {
  const f = useCurrentFrame();
  const c = (w: string, fb: number, nth = 0) => cue(shot, w, fb, nth);
  const push = interpolate(f, [0, shot.frames], [1, 1.05]);
  const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <g transform={`translate(540 960) scale(${push}) translate(-540 -960)`}>{children}</g>
    </svg>
  );

  switch (i) {
    case 0: {
      // Hero: the cooker in a beam of light, title, the question.
      const rise = interpolate(f, [0, 30], [80, 0], {...clamp, easing: ease});
      const sweep = interpolate(f, [10, 70], [-400, 1400], clamp);
      const q = c('macam', 4);
      return (
        <>
          <Stage>
            <defs>
              <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={D.ice} stopOpacity={0.18} />
                <stop offset="1" stopColor={D.ice} stopOpacity={0} />
              </linearGradient>
            </defs>
            <polygon points="440,0 640,0 900,1400 180,1400" fill="url(#beam)" />
            <rect x={0} y={1290} width={1080} height={4} fill={D.steelLight} opacity={0.6} />
            <g transform={`translate(540 ${1290 + rise}) scale(1.25)`}>
              <Cooker f={f} steam={fade(f, 20, 30)} lever={1} />
            </g>
            <rect x={sweep} y={600} width={120} height={720} fill={D.ice} opacity={0.06} transform={`skewX(-18)`} />
          </Stage>
          <div style={{position: 'absolute', left: 70, right: 70, top: 200, fontFamily: D.font, textAlign: 'left', opacity: fade(f, c('Periuk', 0.6) - 2, 14)}}>
            <Small c={D.blueLight}>SIRI BARANG DAPUR · EP 01</Small>
            <div style={{fontSize: 92, fontWeight: 700, color: D.white, lineHeight: 1.02, marginTop: 18}}>PERIUK NASI ELEKTRIK</div>
            <div style={{fontSize: 44, fontWeight: 600, color: D.amber, marginTop: 26, opacity: fade(f, q, 12)}}>Macam mana ia tahu nasi dah masak?</div>
          </div>
        </>
      );
    }
    case 1: {
      // Anatomy: x-ray cutaway + exploded parts with callouts.
      const xr = interpolate(f, [6, 36], [0, 1], {...clamp, easing: ease});
      const ex = interpolate(f, [c('Periuk', 4) - 6, c('Periuk', 4) + 24], [0, 1], {...clamp, easing: ease});
      const cx = 540;
      const by = 1330;
      const s = 1.15;
      const P = (x: number, y: number) => [cx + x * s, by + y * s] as const;
      const potY = -210 - 150 * ex;
      return (
        <>
          <Chapter n="01" title="ANATOMI" />
          <Stage>
            <g transform={`translate(${cx} ${by}) scale(${s})`}>
              <Cooker f={f} xray={xr} explode={ex} lever={1} />
            </g>
            <Callout px={P(-150, potY)[0]} py={P(-150, potY)[1]} lx={60} ly={470} n="01" text="Periuk dalam" o={fade(f, c('Periuk', 4))} />
            <Callout px={P(-160, -78)[0]} py={P(-160, -78)[1]} lx={60} ly={1470} n="02" text="Plat pemanas" o={fade(f, c('Plat', 6))} />
            <Callout px={P(0, -92)[0]} py={P(0, -92)[1]} lx={680} ly={700} n="03" text="Termostat bermagnet" o={fade(f, c('Termostat', 8))} />
            <Callout px={P(200, -55)[0]} py={P(200, -55)[1]} lx={680} ly={1470} n="04" text="Suis tuil" o={fade(f, c('suis', 10))} />
          </Stage>
        </>
      );
    }
    case 2: {
      // Boiling: heat on, water boils, the graph climbs to a 100 °C plateau.
      const on = c('ditekan', 1.5);
      const heat = fade(f, on, 20);
      const boil = c('mendidih', 4);
      const upto = interpolate(f, [on, boil, shot.frames], [0, 0.3, 0.62], clamp);
      const temp = Math.round(curve(upto));
      return (
        <>
          <Chapter n="02" title="PROSES MEMASAK" />
          <Stage>
            <g transform="translate(540 1080) scale(0.95)">
              <Cooker f={f} xray={1} heat={heat} water={0.8} rice={0.5} bubbles={fade(f, boil, 20)} steam={fade(f, boil, 30)} lever={1} />
            </g>
            <TempGraph
              x={60}
              y={1130}
              w={960}
              h={360}
              upto={upto}
              o={fade(f, on - 4)}
              notes={[{u: 0.45, text: 'AIR MENDIDIH ≈ 100 °C', c: D.blueLight, show: f >= c('kekal', 9) - 6, below: true}]}
            />
          </Stage>
          <Card x={700} y={300} w={320} o={fade(f, on)} accent={temp >= 100 ? D.amber : D.steel}>
            <Small>SUHU</Small>
            <div style={{fontSize: 84, fontWeight: 700, color: temp >= 100 ? D.amber : D.white, marginTop: 6}}>{temp}°C</div>
          </Card>
        </>
      );
    }
    case 3: {
      // The magnet: water gone, temperature rises past 100, magnet releases, switch flips to warm.
      const gone = c('habis', 2);
      const hot = c('melepasi', 4);
      const release = c('hilang', 7);
      const click = c('terlepas', 9);
      const water = interpolate(f, [gone - 6, gone + 30], [0.8, 0], clamp);
      const upto = interpolate(f, [0, hot, click, shot.frames], [0.62, 0.72, 0.8, 0.95], clamp);
      const gap = interpolate(f, [click - 4, click + 6], [0, 26], {...clamp, easing: Easing.in(Easing.quad)});
      const warm = f >= click;
      const temp = Math.round(curve(upto));
      return (
        <>
          <Chapter n="03" title="RAHSIA MAGNET" />
          <Stage>
            <g transform="translate(330 900) scale(0.72)">
              <Cooker f={f} xray={1} heat={warm ? 0.15 : 1} water={water} rice={0.62} bubbles={water > 0.1 ? 1 : 0} steam={warm ? 0.3 : 1} lever={warm ? 0 : 1} warm={warm} magnetGap={gap} />
            </g>
            {/* zoomed thermostat inset */}
            <g transform="translate(790 700)" opacity={fade(f, release - 10)}>
              <circle r={210} fill="rgba(15,29,51,0.92)" stroke={warm ? D.green : D.amber} strokeWidth={3} />
              <line x1={-405} y1={140} x2={-200} y2={60} stroke={D.amber} strokeOpacity={0.6} strokeWidth={2} strokeDasharray="8 6" />
              <rect x={-150} y={-120} width={300} height={34} rx={6} fill="#6b7686" />
              <text x={0} y={-130} textAnchor="middle" fontFamily={D.font} fontWeight={600} fontSize={18} fill={D.grey} letterSpacing={3}>
                DASAR PERIUK
              </text>
              <g transform={`translate(0 ${gap * 3})`}>
                <rect x={-70} y={-86} width={140} height={60} rx={10} fill="#d64550" />
                <rect x={-70} y={-86} width={70} height={60} rx={10} fill="#2e7fd9" />
                <text x={0} y={-46} textAnchor="middle" fontFamily={D.font} fontWeight={700} fontSize={26} fill="#fff">
                  MAGNET
                </text>
                <path d="M -40 120 l 80 -18 l -80 -18 l 80 -18 l -80 -18 l 80 -18 l -80 -18" fill="none" stroke="#8d9aae" strokeWidth={8} />
              </g>
              {!warm ? (
                <g opacity={0.6 + Math.sin(f / 4) * 0.3}>
                  <path d="M -100 -82 q 0 -14 0 -30 M 100 -82 q 0 -14 0 -30 M 0 -82 q 0 -14 0 -30" stroke={D.blueLight} strokeWidth={4} strokeDasharray="4 6" />
                </g>
              ) : null}
              <text x={0} y={-170} textAnchor="middle" fontFamily={D.font} fontWeight={700} fontSize={26} fill={warm ? D.green : D.amber}>
                {warm ? 'TERLEPAS!' : f >= release ? 'DAYA TARIKAN HILANG' : 'MAGNET MELEKAT'}
              </text>
            </g>
            {f >= click && f < click + 24 ? (
              <text x={540} y={1060} textAnchor="middle" fontFamily={D.font} fontWeight={700} fontSize={120} fill={D.white} opacity={interpolate(f, [click, click + 24], [1, 0])}>
                KLIK!
              </text>
            ) : null}
            <TempGraph
              x={60}
              y={1130}
              w={960}
              h={360}
              upto={upto}
              o={1}
              notes={[
                {u: 0.45, text: 'AIR MENDIDIH ≈ 100 °C', c: D.blueLight, show: true, below: true},
                {u: 0.78, text: 'AIR HABIS → SUHU NAIK', c: D.amber, show: f >= hot},
                {u: 0.93, text: 'MOD PANAS', c: D.green, show: warm, below: true},
              ]}
            />
          </Stage>
          <Card x={60} y={300} w={300} o={1} accent={warm ? D.green : temp > 100 ? D.red : D.amber}>
            <Small>SUHU</Small>
            <div style={{fontSize: 76, fontWeight: 700, color: warm ? D.green : temp > 100 ? D.red : D.amber, marginTop: 6}}>{temp > 100 && !warm ? '>100' : temp}°C</div>
          </Card>
        </>
      );
    }
    case 4: {
      // What can go wrong: a small hazard register (deviation → cause → consequence).
      const rows: {at: number; dev: string; cause: string; cons: string}[] = [
        {at: c('basah', 3), dev: 'Dasar periuk basah', cause: 'Dimasukkan tanpa dilap', cons: 'Plat pemanas rosak'},
        {at: c('tersumbat', 7), dev: 'Lubang wap tersumbat', cause: 'Kotoran / ditutup kain', cons: 'Air melimpah, tumpah'},
        {at: c('plag', 10), dev: 'Arus berlebihan', cause: 'Banyak plag satu soket', cons: 'Wayar jadi panas'},
      ];
      return (
        <>
          <Chapter n="04" title="APA BOLEH JADI SALAH?" />
          <Stage>
            <g transform="translate(540 760) scale(0.62)" opacity={0.9}>
              <Cooker f={f} lever={1} steam={0.6} />
            </g>
            <g transform="translate(700 330)" opacity={fade(f, 6)}>
              <polygon points="0,-70 70,50 -70,50" fill="none" stroke={D.amber} strokeWidth={8} strokeLinejoin="round" />
              <text y={36} textAnchor="middle" fontFamily={D.font} fontWeight={700} fontSize={80} fill={D.amber}>
                !
              </text>
            </g>
          </Stage>
          <div style={{position: 'absolute', left: 50, right: 50, top: 860, fontFamily: D.font}}>
            <div style={{display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 10, padding: '0 6px 12px', opacity: fade(f, 4)}}>
              {['PENYIMPANGAN', 'PUNCA', 'AKIBAT'].map((h, k) => (
                <div key={h} style={{fontSize: 22, fontWeight: 700, letterSpacing: 4, color: k === 2 ? D.red : D.blueLight}}>
                  {h}
                </div>
              ))}
            </div>
            {rows.map((r) => {
              const o = fade(f, r.at - 4);
              return (
                <div key={r.dev} style={{display: 'grid', gridTemplateColumns: '1.1fr 1fr 1fr', gap: 10, alignItems: 'center', background: 'rgba(15,29,51,0.85)', border: `1.5px solid ${D.steel}`, borderLeft: `6px solid ${D.amber}`, borderRadius: 14, padding: '20px 18px', marginBottom: 14, opacity: o, transform: `translateX(${(1 - o) * 40}px)`}}>
                  <div style={{fontSize: 32, fontWeight: 700, color: D.white, lineHeight: 1.15}}>{r.dev}</div>
                  <div style={{fontSize: 27, fontWeight: 600, color: D.grey, lineHeight: 1.2}}>{r.cause}</div>
                  <div style={{fontSize: 27, fontWeight: 700, color: '#ff8a8a', lineHeight: 1.2}}>{r.cons}</div>
                </div>
              );
            })}
          </div>
        </>
      );
    }
    case 5: {
      // Safe use checklist.
      const items: {at: number; text: string; sub: string}[] = [
        {at: c('lap', 1), text: 'Lap kering dasar periuk', sub: 'sebelum dimasukkan'},
        {at: c('Jangan', 4), text: 'Jangan tutup lubang wap', sub: 'biar wap keluar bebas'},
        {at: c('Cabut', 6), text: 'Cabut plag sebelum cuci', sub: 'jangan rendam badan periuk'},
        {at: c('Nasi', 10), text: 'Nasi lebih? Peti sejuk', sub: 'jangan biar lama pada suhu bilik'},
      ];
      return (
        <>
          <Chapter n="05" title="GUNA DENGAN SELAMAT" />
          <div style={{position: 'absolute', left: 60, right: 60, top: 330, fontFamily: D.font}}>
            {items.map((it, k) => {
              const o = fade(f, it.at - 4);
              const done = f >= it.at + 10;
              return (
                <div key={it.text} style={{display: 'flex', alignItems: 'center', gap: 30, background: 'rgba(15,29,51,0.85)', border: `1.5px solid ${done ? D.green : D.steel}`, borderRadius: 20, padding: '30px 30px', marginBottom: 26, opacity: o, transform: `translateY(${(1 - o) * 30}px)`}}>
                  <div style={{width: 84, height: 84, borderRadius: 42, border: `4px solid ${done ? D.green : D.steelLight}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, background: done ? 'rgba(61,220,132,0.12)' : 'transparent'}}>
                    <svg width={46} height={46} viewBox="0 0 46 46">
                      <path d="M 8 24 l 10 10 l 20 -22" fill="none" stroke={D.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={interpolate(f, [it.at + 4, it.at + 14], [60, 0], clamp)} />
                    </svg>
                  </div>
                  <div>
                    <div style={{fontSize: 22, fontWeight: 700, color: D.blueLight, letterSpacing: 4}}>0{k + 1}</div>
                    <div style={{fontSize: 44, fontWeight: 700, color: D.white, lineHeight: 1.1, marginTop: 4}}>{it.text}</div>
                    <div style={{fontSize: 30, fontWeight: 600, color: D.grey, marginTop: 6}}>{it.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    }
    default: {
      // Close: cooker resting on warm, the three words, the question to viewers.
      const ask = c('apa', 9);
      return (
        <>
          <Stage>
            <rect x={0} y={1290} width={1080} height={4} fill={D.steelLight} opacity={0.6} />
            <g transform="translate(540 1290) scale(1.1)">
              <Cooker f={f} warm lever={0} steam={0.4} />
            </g>
          </Stage>
          <div style={{position: 'absolute', left: 70, right: 70, top: 230, fontFamily: D.font}}>
            {['FAHAM.', 'GUNA.', 'SELAMAT.'].map((w, k) => (
              <div key={w} style={{fontSize: 96, fontWeight: 700, lineHeight: 1.05, color: k === 2 ? D.green : D.white, opacity: fade(f, c(k === 2 ? 'selamat' : 'faham', 2 + k) + k * 6)}}>
                {w}
              </div>
            ))}
            <div style={{marginTop: 40, opacity: fade(f, ask)}}>
              <div style={{background: 'rgba(15,29,51,0.82)', border: `1.5px solid ${D.amber}`, borderRadius: 18, padding: '24px 28px', color: D.white}}>
                <Small c={D.amber}>EPISOD SETERUSNYA?</Small>
                <div style={{fontSize: 40, fontWeight: 700, marginTop: 8}}>Komen barang dapur yang korang nak kami bedah.</div>
              </div>
            </div>
          </div>
        </>
      );
    }
  }
};

const SFX: Record<number, [string, number, string, number][]> = {
  0: [['Periuk', 0.6, 'impact', 0.45], ['macam', 4, 'shimmer', 0.3]],
  1: [['Periuk', 4, 'whoosh', 0.35], ['Plat', 6, 'tick', 0.5], ['Termostat', 8, 'tick', 0.5], ['suis', 10, 'tick', 0.5]],
  2: [['ditekan', 1.5, 'click', 0.6], ['ditekan', 1.6, 'hum', 0.25], ['mendidih', 4, 'rise', 0.25]],
  3: [['melepasi', 4, 'rise', 0.3], ['terlepas', 9, 'click', 0.8], ['panas.', 11, 'beep', 0.35]],
  4: [['salah', 1, 'impact', 0.35], ['basah', 3, 'tick', 0.5], ['tersumbat', 7, 'tick', 0.5], ['plag', 10, 'crackle', 0.3]],
  5: [['lap', 1, 'tick', 0.5], ['Jangan', 4, 'tick', 0.5], ['Cabut', 6, 'tick', 0.5], ['Nasi', 10, 'tick', 0.5]],
  6: [['selamat', 5, 'shimmer', 0.35], ['Komen', 10, 'beep', 0.3]],
};

const ShotView: React.FC<{index: number}> = ({index}) => {
  const f = useCurrentFrame();
  const shot = SHOTS[index];
  return (
    <AbsoluteFill style={{background: D.bg}}>
      <Backdrop />
      <Scene i={index} shot={shot} />
      <Subtitles shot={shot} />
      {index > 0 ? <AbsoluteFill style={{background: D.bg, opacity: interpolate(f, [0, 8], [1, 0], clamp)}} /> : null}
      {shot.audio.map((a, k) => (
        <Sequence key={`vo${k}`} from={a.from} name="VO">
          <Audio src={staticFile(a.src)} />
        </Sequence>
      ))}
      {index > 0 ? (
        <Sequence from={0} durationInFrames={FPS} name="SFX scene">
          <Audio src={staticFile('audio/sfx-doc/whoosh.wav')} volume={0.2} />
        </Sequence>
      ) : null}
      {(SFX[index] ?? []).map(([w, fb, name, vol], k) => (
        <Sequence key={k} from={Math.max(0, cue(shot, w, fb))} durationInFrames={FPS * 3} name={`SFX ${name}`}>
          <Audio src={staticFile(`audio/sfx-doc/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const DapurShot: React.FC<{index: number}> = ({index}) => <ShotView index={index} />;

export const DapurVideo: React.FC = () => {
  const music = (f: number) => interpolate(f, [0, 20, TOTAL_FRAMES - 60, TOTAL_FRAMES], [0, 0.22, 0.22, 0], clamp);
  return (
    <AbsoluteFill>
      {SHOTS.map((s, i) => (
        <Sequence key={s.id} from={s.start} durationInFrames={s.frames} name={s.id}>
          <ShotView index={i} />
        </Sequence>
      ))}
      <Audio src={staticFile('audio/music/doc-score.flac')} volume={music} />
    </AbsoluteFill>
  );
};
