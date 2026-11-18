// Siri Barang Dapur EP02: cerek elektrik. Same documentary structure as EP01, bright cheerful palette.
import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {cue, FPS, makeTimeline, ScriptShot, Shot, Timing} from '../lib/timeline';
import {Kettle} from './Kettle';
import script from './script.json';
import {B} from './theme';
import timings from './timings.json';

export const {SHOTS, TOTAL_FRAMES} = makeTimeline(script.shots as ScriptShot[], timings as Record<string, Timing>, 'audio/cerek/vo', script.say as Record<string, string>);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const fade = (f: number, at: number, len = 12) => interpolate(f, [at, at + len], [0, 1], {...clamp, easing: ease});
const shadow = '0 14px 34px rgba(199,107,79,0.18)';

// ---------- shared pieces ----------

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const blobs: [number, number, number, string][] = [
    [140, 380, 260, B.yellow],
    [960, 640, 300, B.pink],
    [120, 1300, 280, B.sky],
    [980, 1600, 240, B.teal],
  ];
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${B.bgTop} 0%, ${B.bgBottom} 100%)`}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="bk-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="60" />
          </filter>
        </defs>
        {blobs.map(([x, y, r, c], i) => (
          <circle key={i} cx={x + Math.sin(f / 60 + i) * 30} cy={y + Math.cos(f / 70 + i) * 30} r={r} fill={c} opacity={0.22} filter="url(#bk-blur)" />
        ))}
        {Array.from({length: 12}, (_, i) =>
          Array.from({length: 22}, (_, j) => <circle key={`${i}-${j}`} cx={45 + i * 90} cy={45 + j * 90} r={2.4} fill={B.coral} opacity={0.12} />),
        )}
      </svg>
    </AbsoluteFill>
  );
};

const Chapter: React.FC<{n: string; title: string; c?: string}> = ({n, title, c = B.teal}) => {
  const f = useCurrentFrame();
  const o = fade(f, 2, 14);
  return (
    <div style={{position: 'absolute', left: 60, top: 110, opacity: o, transform: `translateY(${(1 - o) * -20}px)`, fontFamily: B.font}}>
      <div style={{fontSize: 24, fontWeight: 700, letterSpacing: 6, color: B.sub}}>SIRI BARANG DAPUR · EP 02</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 14}}>
        <span style={{background: c, color: '#fff', fontSize: 30, fontWeight: 700, padding: '8px 18px', borderRadius: 999}}>{n}</span>
        <span style={{fontSize: 36, fontWeight: 700, color: B.ink, letterSpacing: 2}}>{title}</span>
      </div>
    </div>
  );
};

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
    <div style={{position: 'absolute', left: 50, right: 50, top: 1560, display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{background: '#ffffff', borderRadius: 26, padding: '22px 30px', boxShadow: shadow, border: `3px solid ${B.line}`, fontFamily: B.font, fontWeight: 700, fontSize: 44, lineHeight: 1.3, color: B.ink, textAlign: 'center'}}>
        {s.words.map((w, i) => (
          <span key={i} style={{color: hl.has(w.text) ? B.coral : B.ink}}>
            {w.text}
            {i < s.words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </div>
  );
};

const Callout: React.FC<{px: number; py: number; lx: number; ly: number; n: string; text: string; o: number; c: string}> = ({px, py, lx, ly, n, text, o, c}) => {
  const end = px > lx + 150 ? lx + 300 : lx;
  return (
    <g opacity={o}>
      <circle cx={px} cy={py} r={11} fill={c} stroke="#fff" strokeWidth={4} />
      <circle cx={px} cy={py} r={22} fill="none" stroke={c} strokeOpacity={0.5} strokeWidth={3} />
      <line x1={px} y1={py} x2={end} y2={ly} stroke={c} strokeWidth={4} strokeLinecap="round" />
      <line x1={lx} y1={ly} x2={lx + 300} y2={ly} stroke={c} strokeWidth={4} strokeLinecap="round" />
      <rect x={lx} y={ly - 92} width={54} height={34} rx={17} fill={c} />
      <text x={lx + 27} y={ly - 67} textAnchor="middle" fontFamily={B.font} fontWeight={700} fontSize={22} fill="#fff">
        {n}
      </text>
      <text x={lx} y={ly - 16} fontFamily={B.font} fontWeight={700} fontSize={36} fill={B.ink}>
        {text}
      </text>
    </g>
  );
};

// Temperature curve: heats to 100, holds briefly, switch off, cools slowly.
const curve = (u: number) => {
  if (u < 0.6) return 25 + (u / 0.6) * 75;
  if (u < 0.72) return 100;
  return 100 - ((u - 0.72) / 0.28) * 12;
};
const TempGraph: React.FC<{x: number; y: number; w: number; h: number; upto: number; o: number; notes: {u: number; text: string; c: string; show: boolean; below?: boolean}[]}> = ({x, y, w, h, upto, o, notes}) => {
  const px = (u: number) => 80 + u * (w - 120);
  const py = (T: number) => h - 70 - ((T - 20) / 90) * (h - 130);
  const pts: string[] = [];
  for (let u = 0; u <= upto; u += 0.005) pts.push(`${px(u)},${py(curve(u))}`);
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect width={w} height={h} rx={28} fill="#ffffff" stroke={B.line} strokeWidth={3} />
      <text x={30} y={48} fontFamily={B.font} fontWeight={700} fontSize={22} letterSpacing={4} fill={B.sub}>
        SUHU AIR (°C)
      </text>
      <line x1={80} y1={h - 70} x2={w - 40} y2={h - 70} stroke="#e2e8f0" strokeWidth={3} />
      <line x1={80} y1={70} x2={80} y2={h - 70} stroke="#e2e8f0" strokeWidth={3} />
      <line x1={80} y1={py(100)} x2={w - 40} y2={py(100)} stroke={B.sky} strokeWidth={3} strokeDasharray="10 8" />
      <text x={70} y={py(100) + 8} textAnchor="end" fontFamily={B.font} fontWeight={700} fontSize={24} fill={B.sky}>
        100
      </text>
      <text x={w - 44} y={h - 30} textAnchor="end" fontFamily={B.font} fontWeight={700} fontSize={20} fill={B.sub} letterSpacing={3}>
        MASA →
      </text>
      <polyline points={pts.join(' ')} fill="none" stroke={B.coral} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
      {upto > 0 ? <circle cx={px(upto)} cy={py(curve(upto))} r={13} fill={B.coral} stroke="#fff" strokeWidth={4} /> : null}
      {notes.map((n) =>
        n.show ? (
          <g key={n.text}>
            <circle cx={px(n.u)} cy={py(curve(n.u))} r={9} fill="#fff" stroke={n.c} strokeWidth={4} />
            <text x={px(n.u)} y={py(curve(n.u)) + (n.below ? 48 : -26)} textAnchor="middle" fontFamily={B.font} fontWeight={700} fontSize={24} fill={n.c}>
              {n.text}
            </text>
          </g>
        ) : null,
      )}
    </g>
  );
};

const Pill: React.FC<{text: string; c: string; o?: number}> = ({text, c, o = 1}) => (
  <span style={{display: 'inline-block', background: c, color: '#fff', fontFamily: B.font, fontWeight: 700, fontSize: 30, padding: '10px 22px', borderRadius: 999, opacity: o, boxShadow: shadow}}>{text}</span>
);

// ---------- scenes ----------

const Scene: React.FC<{i: number; shot: Shot}> = ({i, shot}) => {
  const f = useCurrentFrame();
  const c = (w: string, fb: number, nth = 0) => cue(shot, w, fb, nth);
  const push = interpolate(f, [0, shot.frames], [1, 1.04]);
  const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
    <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{position: 'absolute', inset: 0}}>
      <g transform={`translate(540 960) scale(${push}) translate(-540 -960)`}>{children}</g>
    </svg>
  );

  switch (i) {
    case 0: {
      const pop = interpolate(f, [0, 24], [0.6, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
      const off = c('padam', 4);
      const q = c('Macam', 6);
      return (
        <>
          <Stage>
            <circle cx={540} cy={1060} r={420} fill="#ffffff" opacity={0.7} />
            <circle cx={540} cy={1060} r={420} fill="none" stroke={B.yellow} strokeWidth={10} strokeDasharray="30 22" strokeDashoffset={-f * 1.5} />
            <g transform={`translate(560 1330) scale(${1.25 * pop})`}>
              <Kettle f={f} water={0.6} on={f < off} steam={f < off ? fade(f, 14, 30) : 0.3} />
            </g>
            {f >= off && f < off + 26 ? (
              <text x={830} y={1230} textAnchor="middle" fontFamily={B.font} fontWeight={700} fontSize={84} fill={B.coral} opacity={interpolate(f, [off, off + 26], [1, 0])} transform={`rotate(-8 830 1230)`}>
                KLIK!
              </text>
            ) : null}
          </Stage>
          <div style={{position: 'absolute', left: 60, right: 60, top: 170, fontFamily: B.font}}>
            <Pill text="SIRI BARANG DAPUR · EP 02" c={B.teal} o={fade(f, 4)} />
            <div style={{fontSize: 104, fontWeight: 700, color: B.ink, lineHeight: 1.0, marginTop: 26, opacity: fade(f, 8)}}>
              CEREK <span style={{color: B.coral}}>ELEKTRIK</span>
            </div>
            <div style={{fontSize: 46, fontWeight: 700, color: B.tealDark, marginTop: 24, opacity: fade(f, q, 12)}}>Macam mana ia tahu air dah mendidih?</div>
          </div>
        </>
      );
    }
    case 1: {
      const xr = interpolate(f, [6, 36], [0, 1], {...clamp, easing: ease});
      const lift = interpolate(f, [c('Tapak', 6) - 6, c('Tapak', 6) + 20], [0, 70], {...clamp, easing: ease});
      const cx = 400;
      const by = 1330;
      const s = 1.0;
      const P = (x: number, y: number, l = 0) => [cx + x * s, by + (y - l) * s] as const;
      return (
        <>
          <Chapter n="01" title="ANATOMI" c={B.teal} />
          <Stage>
            <g transform={`translate(${cx} ${by}) scale(${s})`}>
              <Kettle f={f} xray={xr} water={0.5} lift={lift} />
            </g>
            <Callout px={P(-60, -64, lift)[0]} py={P(-60, -64, lift)[1]} lx={60} ly={1490} n="01" text="Elemen pemanas" o={fade(f, c('Elemen', 3))} c={B.coral} />
            <Callout px={P(120, -24)[0]} py={P(120, -24)[1]} lx={720} ly={1490} n="02" text="Tapak kuasa" o={fade(f, c('Tapak', 6))} c={B.purple} />
            <Callout px={P(262, -300, lift)[0]} py={P(262, -300, lift)[1]} lx={720} ly={520} n="03" text="Penderia wap" o={fade(f, c('Penderia', 8))} c={B.sky} />
            <Callout px={P(298, -140, lift)[0]} py={P(298, -140, lift)[1]} lx={720} ly={1010} n="04" text="Suis" o={fade(f, c('suis', 10))} c={B.yellow} />
          </Stage>
        </>
      );
    }
    case 2: {
      const on = c('dihidupkan', 1.5);
      const heat = fade(f, on, 18);
      const conv = c('naik', 5);
      const upto = interpolate(f, [on, shot.frames - 10], [0, 0.6], clamp);
      const temp = Math.round(curve(upto));
      return (
        <>
          <Chapter n="02" title="PROSES MENDIDIH" c={B.coral} />
          <Stage>
            <g transform="translate(500 1060) scale(1.0)">
              <Kettle f={f} xray={1} heat={heat} water={0.7} on={f >= on} convection={fade(f, conv - 4, 16)} boil={interpolate(upto, [0.45, 0.6], [0, 1], clamp)} steam={interpolate(upto, [0.5, 0.6], [0, 0.8], clamp)} />
            </g>
            <TempGraph x={60} y={1130} w={960} h={370} upto={upto} o={fade(f, on - 4)} notes={[{u: 0.6, text: 'MENDIDIH ≈ 100 °C', c: B.sky, show: upto >= 0.59, below: true}]} />
          </Stage>
          <div style={{position: 'absolute', left: 700, top: 290, opacity: fade(f, on)}}>
            <div style={{background: '#fff', borderRadius: 28, padding: '18px 28px', boxShadow: shadow, border: `3px solid ${temp >= 100 ? B.coral : B.line}`, fontFamily: B.font}}>
              <div style={{fontSize: 22, fontWeight: 700, letterSpacing: 4, color: B.sub}}>SUHU</div>
              <div style={{fontSize: 80, fontWeight: 700, color: temp >= 100 ? B.coral : B.ink}}>{temp}°C</div>
            </div>
          </div>
          <div style={{position: 'absolute', left: 60, top: 300, display: 'flex', flexDirection: 'column', gap: 16, opacity: fade(f, conv)}}>
            <Pill text="↑ Air panas naik" c={B.coral} />
            <Pill text="↓ Air sejuk turun" c={B.sky} o={fade(f, c('turun', 7))} />
          </div>
        </>
      );
    }
    case 3: {
      const flow = c('mengalir', 2);
      const metal = c('dwi-logam', 5);
      const bendAt = c('melengkung', 10);
      const click = c('klik', 12);
      const bend = interpolate(f, [bendAt - 4, click], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
      const off = f >= click;
      const upto = interpolate(f, [0, click, shot.frames], [0.6, 0.72, 0.85], clamp);
      return (
        <>
          <Chapter n="03" title="RAHSIA DWI-LOGAM" c={B.purple} />
          <Stage>
            <g transform="translate(330 960) scale(0.78)">
              <Kettle f={f} xray={1} heat={off ? 0 : 1} water={0.7} boil={off ? interpolate(f, [click, click + 40], [1, 0], clamp) : 1} steam={off ? 0.4 : 1} on={!off} tubeSteam={fade(f, flow, 14) * (off ? 0.3 : 1)} bend={bend} />
            </g>
            {/* bimetal close-up */}
            <g transform="translate(800 640)" opacity={fade(f, metal - 6)}>
              <circle r={220} fill="#ffffff" stroke={off ? B.green : B.purple} strokeWidth={6} />
              <line x1={-470} y1={150} x2={-215} y2={50} stroke={B.purple} strokeOpacity={0.5} strokeWidth={4} strokeDasharray="10 8" />
              <text y={-120} textAnchor="middle" fontFamily={B.font} fontWeight={700} fontSize={22} fill={B.sub} letterSpacing={2}>
                KEPINGAN DWI-LOGAM
              </text>
              <g transform="translate(0 10)">
                <path d={`M -150 -14 Q 0 ${-14 - bend * 90} 150 -14`} fill="none" stroke="#f59e0b" strokeWidth={26} strokeLinecap="round" />
                <path d={`M -150 14 Q 0 ${14 - bend * 90} 150 14`} fill="none" stroke="#94a3b8" strokeWidth={26} strokeLinecap="round" />
              </g>
              <text x={-150} y={90} fontFamily={B.font} fontWeight={700} fontSize={22} fill="#d97706">
                Logam A: kembang lebih
              </text>
              <text x={-150} y={124} fontFamily={B.font} fontWeight={700} fontSize={22} fill="#64748b">
                Logam B: kembang kurang
              </text>
              <text y={180} textAnchor="middle" fontFamily={B.font} fontWeight={700} fontSize={34} fill={off ? B.green : bend > 0.1 ? B.coral : B.ink}>
                {off ? 'PADAM!' : bend > 0.1 ? 'MELENGKUNG...' : 'LURUS (SEJUK)'}
              </text>
            </g>
            {f >= click && f < click + 24 ? (
              <text x={540} y={1080} textAnchor="middle" fontFamily={B.font} fontWeight={700} fontSize={130} fill={B.coral} opacity={interpolate(f, [click, click + 24], [1, 0])} transform="rotate(-6 540 1080)">
                KLIK!
              </text>
            ) : null}
            <TempGraph
              x={60}
              y={1130}
              w={960}
              h={370}
              upto={upto}
              o={1}
              notes={[
                {u: 0.6, text: 'MENDIDIH', c: B.sky, show: true, below: true},
                {u: 0.72, text: 'PADAM', c: B.green, show: off},
              ]}
            />
          </Stage>
          <div style={{position: 'absolute', left: 60, top: 290, opacity: fade(f, flow)}}>
            <Pill text="Wap → saluran → penderia" c={B.purple} />
          </div>
        </>
      );
    }
    case 4: {
      const rows: {at: number; dev: string; cause: string; cons: string; c: string}[] = [
        {at: c('maksimum', 4), dev: 'Air terlalu penuh', cause: 'Melebihi paras MAX', cons: 'Air panas memercik', c: B.coral},
        {at: c('tanpa', 7), dev: 'Cerek kosong', cause: 'Dihidupkan tanpa air', cons: 'Elemen terlalu panas', c: B.yellow},
        {at: c('kerak', 11), dev: 'Kerak kapur', cause: 'Mineral air liat', cons: 'Lambat mendidih', c: B.purple},
      ];
      return (
        <>
          <Chapter n="04" title="APA BOLEH JADI SALAH?" c={B.red} />
          <Stage>
            <g transform="translate(540 790) scale(0.66)">
              <Kettle f={f} water={0.6} steam={0.5} scale={fade(f, c('kerak', 11), 20)} xray={fade(f, c('kerak', 11) - 10, 20)} />
            </g>
            <g transform="translate(800 330)" opacity={fade(f, 6)}>
              <polygon points="0,-74 74,52 -74,52" fill={B.yellow} stroke="#fff" strokeWidth={8} strokeLinejoin="round" />
              <text y={36} textAnchor="middle" fontFamily={B.font} fontWeight={700} fontSize={84} fill={B.ink}>
                !
              </text>
            </g>
          </Stage>
          <div style={{position: 'absolute', left: 44, right: 44, top: 880, fontFamily: B.font}}>
            <div style={{display: 'grid', gridTemplateColumns: '1.05fr 1fr 1fr', gap: 10, padding: '0 10px 12px', opacity: fade(f, 4)}}>
              {[
                ['PENYIMPANGAN', B.tealDark],
                ['PUNCA', B.tealDark],
                ['AKIBAT', B.red],
              ].map(([h, col]) => (
                <div key={h} style={{fontSize: 22, fontWeight: 700, letterSpacing: 4, color: col}}>
                  {h}
                </div>
              ))}
            </div>
            {rows.map((r) => {
              const o = fade(f, r.at - 4);
              return (
                <div key={r.dev} style={{display: 'grid', gridTemplateColumns: '1.05fr 1fr 1fr', gap: 10, alignItems: 'center', background: '#fff', boxShadow: shadow, borderLeft: `10px solid ${r.c}`, borderRadius: 20, padding: '22px 18px', marginBottom: 16, opacity: o, transform: `translateX(${(1 - o) * 40}px)`}}>
                  <div style={{fontSize: 33, fontWeight: 700, color: B.ink, lineHeight: 1.15}}>{r.dev}</div>
                  <div style={{fontSize: 27, fontWeight: 600, color: B.sub, lineHeight: 1.2}}>{r.cause}</div>
                  <div style={{fontSize: 27, fontWeight: 700, color: B.red, lineHeight: 1.2}}>{r.cons}</div>
                </div>
              );
            })}
          </div>
        </>
      );
    }
    case 5: {
      const items: {at: number; text: string; sub: string; c: string}[] = [
        {at: c('isi', 1), text: 'Isi antara MIN dan MAX', sub: 'jangan terlalu penuh, jangan kosong', c: B.sky},
        {at: c('Tutup', 4), text: 'Tutup penutup rapat', sub: 'supaya wap sampai ke penderia', c: B.teal},
        {at: c('Jauhkan', 6), text: 'Jauhkan wayar dari tepi meja', sub: 'elak tersangkut atau ditarik budak', c: B.purple},
        {at: c('bersihkan', 9), text: 'Buang kerak kapur', sub: 'guna cuka atau asid sitrik', c: B.coral},
      ];
      return (
        <>
          <Chapter n="05" title="GUNA DENGAN SELAMAT" c={B.green} />
          <div style={{position: 'absolute', left: 54, right: 54, top: 320, fontFamily: B.font}}>
            {items.map((it, k) => {
              const o = fade(f, it.at - 4);
              const done = f >= it.at + 10;
              return (
                <div key={it.text} style={{display: 'flex', alignItems: 'center', gap: 28, background: '#fff', boxShadow: shadow, borderRadius: 28, padding: '28px 28px', marginBottom: 24, opacity: o, transform: `translateY(${(1 - o) * 30}px) scale(${0.96 + o * 0.04})`}}>
                  <div style={{width: 92, height: 92, borderRadius: 46, background: done ? it.c : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                    <svg width={50} height={50} viewBox="0 0 46 46">
                      <path d="M 8 24 l 10 10 l 20 -22" fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={interpolate(f, [it.at + 4, it.at + 14], [60, 0], clamp)} />
                    </svg>
                  </div>
                  <div>
                    <div style={{fontSize: 22, fontWeight: 700, color: it.c, letterSpacing: 4}}>0{k + 1}</div>
                    <div style={{fontSize: 44, fontWeight: 700, color: B.ink, lineHeight: 1.1, marginTop: 4}}>{it.text}</div>
                    <div style={{fontSize: 30, fontWeight: 600, color: B.sub, marginTop: 6}}>{it.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      );
    }
    default: {
      const ask = c('apa', 9);
      const words: [string, string, number][] = [
        ['FAHAM.', B.teal, c('faham', 3)],
        ['GUNA.', B.coral, c('guna', 4)],
        ['SELAMAT.', B.green, c('selamat', 5)],
      ];
      return (
        <>
          <Stage>
            <circle cx={560} cy={1150} r={330} fill="#ffffff" opacity={0.75} />
            <g transform="translate(560 1360) scale(1.05)">
              <Kettle f={f} water={0.6} steam={0.35} />
            </g>
          </Stage>
          <div style={{position: 'absolute', left: 60, right: 60, top: 200, fontFamily: B.font}}>
            {words.map(([w, col, at]) => (
              <div key={w} style={{fontSize: 100, fontWeight: 700, lineHeight: 1.04, color: col, opacity: fade(f, at), transform: `translateX(${(1 - fade(f, at)) * -40}px)`}}>
                {w}
              </div>
            ))}
            <div style={{marginTop: 36, opacity: fade(f, ask), background: '#fff', borderRadius: 28, padding: '24px 30px', boxShadow: shadow, border: `3px solid ${B.yellow}`}}>
              <div style={{fontSize: 22, fontWeight: 700, letterSpacing: 4, color: '#d97706'}}>EPISOD SETERUSNYA?</div>
              <div style={{fontSize: 40, fontWeight: 700, color: B.ink, marginTop: 8}}>Komen barang dapur yang korang nak kami bedah.</div>
            </div>
          </div>
        </>
      );
    }
  }
};

const SFX: Record<number, [string, number, string, number][]> = {
  0: [['Cerek', 0.6, 'shimmer', 0.35], ['padam', 4, 'click', 0.8]],
  1: [['Elemen', 3, 'tick', 0.5], ['Tapak', 6, 'whoosh', 0.3], ['Penderia', 8, 'tick', 0.5], ['suis', 10, 'tick', 0.5]],
  2: [['dihidupkan', 1.5, 'click', 0.6], ['dihidupkan', 1.6, 'hum', 0.2], ['mendidih', 10, 'rise', 0.25]],
  3: [['mengalir', 2, 'whoosh', 0.3], ['melengkung', 10, 'rise', 0.3], ['klik', 12, 'click', 0.9], ['padam.', 13, 'beep', 0.3]],
  4: [['salah', 1, 'impact', 0.3], ['maksimum', 4, 'tick', 0.5], ['tanpa', 7, 'tick', 0.5], ['kerak', 11, 'tick', 0.5]],
  5: [['isi', 1, 'tick', 0.5], ['Tutup', 4, 'tick', 0.5], ['Jauhkan', 6, 'tick', 0.5], ['bersihkan', 9, 'tick', 0.5]],
  6: [['selamat', 5, 'shimmer', 0.35], ['Komen', 10, 'beep', 0.3]],
};

const ShotView: React.FC<{index: number}> = ({index}) => {
  const f = useCurrentFrame();
  const shot = SHOTS[index];
  return (
    <AbsoluteFill style={{background: B.bgTop}}>
      <Backdrop />
      <Scene i={index} shot={shot} />
      <Subtitles shot={shot} />
      {index > 0 ? <AbsoluteFill style={{background: '#ffffff', opacity: interpolate(f, [0, 8], [0.9, 0], clamp)}} /> : null}
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

export const CerekShot: React.FC<{index: number}> = ({index}) => <ShotView index={index} />;

export const CerekVideo: React.FC = () => {
  const music = (f: number) => interpolate(f, [0, 20, TOTAL_FRAMES - 60, TOTAL_FRAMES], [0, 0.1, 0.1, 0], clamp);
  return (
    <AbsoluteFill>
      {SHOTS.map((s, i) => (
        <Sequence key={s.id} from={s.start} durationInFrames={s.frames} name={s.id}>
          <ShotView index={i} />
        </Sequence>
      ))}
      <Audio src={staticFile('audio/music/bgm-shorts.wav')} loop volume={music} />
    </AbsoluteFill>
  );
};
