import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {cue, FPS, makeTimeline, ScriptShot, Shot, Timing} from '../lib/timeline';
import {Captions} from '../waze/ui/Overlays';
import {Fish, Hills, Hut, Jungle, Moon, Person, Sky, Water} from '../chini/art';
import {INK, Narr, Page, PanelDef, Sfx, Speech, SpeedLines} from '../chini/comic';
import {setLook} from '../chini/look';
import {Basket, Broom, Bundle, Crown, Flames, Flower, Heart, Mirror, Mound, Notes, Palace, Plate, Stamp, SwingTree} from './props';
import script from './script.json';
import timings from './timings.json';

export const {SHOTS, TOTAL_FRAMES} = makeTimeline(script.shots as ScriptShot[], timings as Record<string, Timing>, 'audio/bawang/vo', script.say as Record<string, string>);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

type P = Omit<React.ComponentProps<typeof Person>, 'cloth'>;
// Cast: Bawang Putih (cream), Bawang Merah (red), ibu tiri (purple), ayah (brown), putera (blue + crown).
const Putih: React.FC<P> = (p) => <Person cloth="#f2e2b0" hair="#2a1a10" woman {...p} />;
const Merah: React.FC<P> = (p) => <Person cloth="#d64550" hair="#3a1a10" woman {...p} />;
const Ibu: React.FC<P> = (p) => <Person cloth="#6b3a7a" hair="#1b1b1b" woman {...p} />;
const Ayah: React.FC<P> = (p) => <Person cloth="#8c5a3c" {...p} />;
const Mak: React.FC<P> = (p) => <Person cloth="#5fb85a" woman {...p} />;
const Putera: React.FC<P & {crown?: boolean}> = ({crown = true, ...p}) => (
  <>
    <Person cloth="#2a4fa0" {...p} />
    {crown ? <Crown x={p.x} y={p.y - 205 * (p.s ?? 1)} s={0.7 * (p.s ?? 1)} /> : null}
  </>
);

const Ground: React.FC<{w: number; y: number; h?: number; c?: string}> = ({w, y, h = 400, c = '#c9a06a'}) => <rect y={y} width={w} height={h} fill={c} stroke={INK} strokeWidth={5} />;

const Title: React.FC<{w: number; y: number; text: string; size?: number; c?: string}> = ({w, y, text, size = 60, c = INK}) => (
  <text x={w / 2} y={y} textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={size} fill={c}>
    {text}
  </text>
);

const pages = (i: number, shot: Shot): {panels: PanelDef[]} => {
  const c = (w: string, fb: number, nth = 0) => cue(shot, w, fb, nth);
  switch (i) {
    case 0:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 1260, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#f6b26b" bottom="#fff2d8" id="b1" />
                <Hills w={w} y={560} />
                <Jungle w={w} y={660} n={7} s={0.85} />
                <Ground w={w} y={760} h={500} />
                <Hut x={820} y={760} s={1.2} />
                <Putih x={500} y={1080} s={1.5} f={f} face="sad" pose="bow" />
                <Broom x={600} y={1080} f={f} />
                {f >= c('Merah', 5) - 4 ? <Merah x={230} y={1100} s={1.3} f={f} face="angry" pose="point" /> : null}
                {f >= c('ibu', 6) - 4 ? <Ibu x={800} y={1110} s={1.4} f={f} face="angry" pose="point" flip /> : null}
                <Narr x={30} y={30} w={760} text={'BAWANG PUTIH & BAWANG MERAH'} size={40} />
                <Sfx x={500} y={420} text="KENAPA?!" f={f - (c('kekejaman', 4) - 4)} size={150} />
              </>
            ),
          },
        ],
      };
    case 1:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 680, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#7cc3ee" bottom="#e6f6ff" id="b2a" />
                <Jungle w={w} y={360} n={7} s={0.8} />
                <Ground w={w} y={440} h={240} c="#9ccf6a" />
                <Hut x={200} y={460} s={1.1} />
                <Mak x={560} y={630} f={f} face="happy" />
                <Putih x={680} y={640} s={0.65} f={f} face="happy" pose="cheer" />
                <Narr x={30} y={30} w={520} text={'PADA ZAMAN DAHULU...'} size={36} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 860, w: 1000, h: 560, at: c('meninggal', 5) - 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#1b2350" bottom="#3b4a8a" id="b2b" />
                <Moon x={840} y={120} r={56} />
                <Ground w={w} y={430} h={140} c="#4a5a3a" />
                <Putih x={380} y={500} s={0.75} f={f} face="sad" />
                <Flower x={560} y={440} />
                <Narr x={30} y={30} w={520} text={'IBUNYA TELAH TIADA...'} size={34} />
              </>
            ),
          },
        ],
      };
    case 2:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 640, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#ffcf8a" bottom="#fff2d8" id="b3a" />
                <Ground w={w} y={480} h={160} />
                <Ayah x={380} y={590} f={f} face="happy" pose="talk" />
                {f >= c('balu', 4) - 4 ? <Ibu x={620} y={590} f={f} face="happy" flip /> : null}
                {f >= c('berkahwin', 2.5) - 4 ? <Heart x={500} y={180} s={0.9} f={f} /> : null}
                <Narr x={30} y={30} w={520} text={'AYAH KAHWIN LAIN'} size={36} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 820, w: 1000, h: 600, at: c('Merah', 6) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#ffe0e4" />
                <Merah x={340} y={540} s={1.1} f={f} face="happy" pose="cheer" />
                <Putih x={700} y={540} s={1.0} f={f} face="happy" pose="talk" flip />
                <Narr x={30} y={30} w={420} text={'BAWANG MERAH'} size={40} bg="#ffb3bd" />
                <Speech x={560} y={110} w={360} h={130} tx={680} ty={310} text={'Hai, adik!'} size={40} />
              </>
            ),
          },
        ],
      };
    case 3:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 520, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#7cc3ee" bottom="#e6f6ff" id="b4a" />
                <Hills w={w} y={300} />
                <Ground w={w} y={380} h={140} c="#9ccf6a" />
                <g transform={`translate(${Math.min(260, Math.max(0, f - c('berniaga', 4)) * 3)} 0)`}>
                  <Ayah x={520} y={500} s={0.9} f={f} face="happy" />
                  <Bundle x={560} y={350} />
                </g>
                <Narr x={30} y={30} w={460} text={'BERNIAGA JAUH...'} size={36} show={f >= c('berniaga', 4) - 4} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 700, w: 480, h: 720, at: c('perangai', 6) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#e8d4f4" />
                <SpeedLines cx={w / 2} cy={360} w={w} h={h} f={f} />
                <Ibu x={240} y={640} s={1.5} f={f} face="angry" pose="point" />
                <Sfx x={w / 2} y={150} text="HMPH!" f={f - 4} size={110} color="#ffffff" />
              </>
            ),
          },
          {
            key: 'c', x: 560, y: 700, w: 480, h: 720, at: c('meninggal', 10) - 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#1b2350" bottom="#3b4a8a" id="b4c" />
                <Ground w={w} y={560} h={160} c="#4a5a3a" />
                <Putih x={200} y={640} s={0.9} f={f} face="sad" />
                <Flower x={340} y={570} />
                <Flower x={390} y={580} s={0.8} c="#ffffff" />
                <Narr x={20} y={20} w={440} text={'AYAH PULA PERGI...'} size={32} />
              </>
            ),
          },
        ],
      };
    case 4:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 640, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#8fd0f0" bottom="#fff2d8" id="b5a" />
                <Ground w={w} y={460} h={180} c="#9ccf6a" />
                <Putih x={300} y={600} f={f} face="happy" pose="talk" />
                <Broom x={400} y={600} f={f} />
                {f >= c('suka', 9) - 4 ? (
                  <>
                    <Person x={680} y={600} s={0.85} f={f} cloth="#3d7bd9" face="happy" pose="cheer" flip />
                    <Person x={840} y={605} s={0.8} f={f} cloth="#f4a51c" woman face="happy" pose="cheer" flip />
                    <Heart x={600} y={180} s={0.7} f={f} />
                    <Heart x={760} y={140} s={0.5} f={f + 20} />
                  </>
                ) : null}
                <Narr x={30} y={30} w={500} text={'SEBAB 1: CEMBURU'} size={40} show={f >= c('cemburu', 4) - 4} />
                <Narr x={30} y={110} w={560} text={'CANTIK, LEMBUT, RAJIN'} size={32} bg="#ffffff" show={f >= c('cantik', 6) - 4} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 820, w: 1000, h: 600, at: c('memuji', 11) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#ffb3a0" />
                <SpeedLines cx={w / 2} cy={330} w={w} h={h} f={f} />
                <Flames x={330} y={560} f={f} s={1.6} />
                <Flames x={680} y={560} f={f + 5} s={1.6} />
                <Merah x={330} y={540} s={1.1} f={f} face="angry" />
                <Ibu x={680} y={540} s={1.2} f={f} face="angry" flip />
                <Sfx x={w / 2} y={150} text="PANAS!" f={f - (c('panas', 13) - c('memuji', 11))} size={120} color="#ffffff" />
              </>
            ),
          },
        ],
      };
    case 5:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 560, at: 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#f4e7c8" />
                <Ground w={w} y={430} h={130} c="#c9a06a" />
                <Putih x={300} y={520} s={0.95} f={f} face="sad" pose="bow" />
                <Broom x={390} y={520} f={f} />
                <Basket x={700} y={520} s={1.1} />
                <Narr x={30} y={30} w={560} text={'SEBAB 2: PILIH KASIH'} size={40} />
                <Narr x={30} y={110} w={420} text={'JADI ORANG GAJI'} size={32} bg="#ffffff" show={f >= c('gaji', 6) - 4} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 740, w: 480, h: 680, at: c('Pergi', 9) - 8,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#e8d4f4" />
                <rect width={w} height={h} fill="url(#ht-dark)" opacity={0.2} />
                <Ibu x={180} y={640} s={1.3} f={f} face="angry" pose="point" />
                <Speech x={120} y={50} w={340} h={200} tx={200} ty={330} text={'Pergi basuh\nkain di\nsungai!'} size={36} shout />
              </>
            ),
          },
          {
            key: 'c', x: 560, y: 740, w: 480, h: 680, at: c('bersolek', 14) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#ffe0e4" />
                <Merah x={180} y={620} s={1.1} f={f} face="happy" />
                <Mirror x={340} y={420} f={f} />
                <Sfx x={w / 2} y={140} text="LA LA LA~" f={f - 2} size={70} color="#ffb3bd" />
              </>
            ),
          },
        ],
      };
    case 6:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 1260, at: 4,
            draw: (f, w, h) => {
              const big = c('bebas', 9);
              return (
                <>
                  <Sky w={w} h={h} top="#5a6a8a" bottom="#b8c4d8" id="b7" />
                  <Ground w={w} y={980} h={280} c="#7a8a6a" />
                  {Array.from({length: 26}, (_, k) => (
                    <line key={k} x1={(k * 83 + f * 9) % w} y1={((k * 137 + f * 26) % 900)} x2={((k * 83 + f * 9) % w) - 10} y2={((k * 137 + f * 26) % 900) + 40} stroke="#ffffff" strokeWidth={4} opacity={0.6} />
                  ))}
                  <Putih x={500} y={1100} s={0.9} f={f} face="sad" />
                  {f >= big - 4 ? (
                    <g opacity={Math.min(0.9, (f - big + 4) / 10)}>
                      <Merah x={220} y={1180} s={2.4} f={f} face="happy" pose="cheer" />
                      <Ibu x={800} y={1190} s={2.6} f={f} face="happy" pose="cheer" flip />
                    </g>
                  ) : null}
                  <Narr x={30} y={30} w={720} text={'SEBAB 3: TIADA TEMPAT BERGANTUNG'} size={36} />
                  <Sfx x={500} y={420} text="HA HA HA!" f={f - big} size={120} color="#ffffff" />
                </>
              );
            },
          },
        ],
      };
    case 7:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 480, h: 1260, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#bfe6ff" bottom="#fff6e0" id="b8a" />
                <Ground w={w} y={980} h={280} c="#9ccf6a" />
                <Putih x={240} y={1100} s={1.3} f={f} face="calm" />
                <Heart x={240} y={560} s={1} f={f} c="#ffffff" />
                <Narr x={20} y={30} w={440} text={'BAWANG PUTIH'} size={36} />
                <Narr x={20} y={110} w={440} text={'SABAR & IKHLAS'} size={32} bg="#ffffff" show={f >= c('ikhlas', 6) - 4} />
              </>
            ),
          },
          {
            key: 'b', x: 560, y: 150, w: 480, h: 1260, at: c('Merah', 7) - 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#ffb3bd" bottom="#fff0f0" id="b8b" />
                <Ground w={w} y={980} h={280} c="#d9a07a" />
                <g transform="rotate(-6 240 1100)">
                  <Merah x={240} y={1100} s={1.3} f={f} face="happy" pose="cheer" />
                </g>
                <Crown x={240} y={790} s={0.8} />
                <Narr x={20} y={30} w={440} text={'BAWANG MERAH'} size={36} bg="#ffb3bd" />
                <Narr x={20} y={110} w={440} text={'MANJA & SOMBONG'} size={32} bg="#ffffff" show={f >= c('sombong', 8) - 4} />
              </>
            ),
          },
        ],
      };
    case 8:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 640, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#8fd0f0" bottom="#e6f6ff" id="b9a" />
                <Jungle w={w} y={260} n={7} s={0.75} />
                <Ground w={w} y={300} h={120} c="#9ccf6a" />
                <Water w={w} h={h} y={420} f={f} />
                <Putih x={400} y={420} s={0.95} f={f} face="sad" pose="bow" />
                <Basket x={620} y={420} s={0.9} />
                {f >= c('menangis', 3) - 4 ? (
                  <>
                    <circle cx={385} cy={232 + ((f * 3) % 40)} r={7} fill="#7ac8f4" />
                    <circle cx={418} cy={238 + ((f * 3 + 20) % 40)} r={7} fill="#7ac8f4" />
                  </>
                ) : null}
                <Narr x={30} y={30} w={500} text={'DI TEPI SUNGAI...'} size={36} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 820, w: 1000, h: 600, at: c('kaloi', 6) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#2b7fc4" />
                <rect width={w} height={h} fill="url(#ht-light)" opacity={0.3} />
                <g transform="translate(500 330) scale(4)">
                  <Fish x={0} y={0} f={f} c="#b8c4d0" />
                </g>
                {[0, 1, 2, 3].map((k) => (
                  <text key={k} x={200 + k * 200} y={160 + Math.sin(f / 6 + k) * 20} fontSize={50} fill="#ffd23f">
                    ✦
                  </text>
                ))}
                <Narr x={30} y={30} w={420} text={'IKAN KALOI'} size={40} />
                <Narr x={500} y={480} w={460} text={'JELMAAN IBUNYA?'} size={36} bg="#ffffff" show={f >= c('jelmaan', 10) - 4} />
              </>
            ),
          },
        ],
      };
    case 9:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 480, h: 640, at: 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#e8d4f4" />
                <Water w={w} h={h} y={460} f={f} />
                <Ibu x={200} y={470} s={1.1} f={f} face="angry" pose="pull" />
                <g transform={`translate(340 ${Math.max(300, 520 - f * 4)}) scale(2)`}>
                  <Fish x={0} y={0} f={0} c="#b8c4d0" />
                </g>
                <Sfx x={w / 2} y={130} text="TANGKAP!" f={f - (c('menangkap', 2) - 4)} size={80} color="#ffffff" />
              </>
            ),
          },
          {
            key: 'b', x: 560, y: 150, w: 480, h: 640, at: c('memasaknya', 4) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#ffe08a" />
                <Plate x={w / 2} y={380} bones={f > 40} />
                {[0, 1, 2].map((k) => (
                  <path key={k} d={`M ${180 + k * 60} ${300 - ((f * 2 + k * 20) % 80)} q 14 -20 0 -40`} fill="none" stroke="#ffffff" strokeWidth={6} opacity={0.8} />
                ))}
                <Narr x={20} y={20} w={360} text={'DIMASAK...'} size={34} />
              </>
            ),
          },
          {
            key: 'c', x: 40, y: 820, w: 1000, h: 600, at: c('sedih', 6) - 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#f6b26b" bottom="#fff2d8" id="b10c" />
                <Ground w={w} y={440} h={160} c="#9ccf6a" />
                <Hut x={150} y={440} s={0.9} />
                <Putih x={480} y={520} s={0.95} f={f} face="sad" pose="bow" />
                {f >= c('menanamnya', 9) - c('sedih', 6) ? <Mound x={700} y={500} /> : null}
                <Narr x={30} y={30} w={620} text={'TULANG DITANAM DI TEPI RUMAH'} size={32} show={f >= c('tulang', 7) - c('sedih', 6)} />
              </>
            ),
          },
        ],
      };
    case 10:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 1260, at: 4,
            draw: (f, w, h) => {
              const grow = interpolate(f, [4, 40], [0.2, 1], clamp);
              const sing = c('menyanyi', 6);
              const angle = f >= sing - 4 ? Math.sin((f - sing) / 14) * 16 : 0;
              return (
                <>
                  <Sky w={w} h={h} top="#8fd0f0" bottom="#fff2d8" id="b11" />
                  <Hills w={w} y={760} />
                  <Ground w={w} y={1080} h={180} c="#9ccf6a" />
                  <Hut x={860} y={1080} s={0.9} />
                  <SwingTree x={260} y={1100} s={1.15} grow={grow} angle={angle}>
                    {f >= c('buaian', 4) - 4 ? <Putih x={0} y={0} s={0.8} f={f} face="happy" /> : null}
                  </SwingTree>
                  {f >= sing - 4 ? <Notes x={620} y={420} f={f} /> : null}
                  <Narr x={30} y={30} w={520} text={'BUAIAN AJAIB'} size={44} show={f >= c('buaian', 4) - 4} />
                  <Sfx x={720} y={260} text="✦ AJAIB ✦" f={f - 6} size={60} color="#ffd23f" rot={-6} />
                </>
              );
            },
          },
        ],
      };
    case 11:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 600, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#8fd0f0" bottom="#fff2d8" id="b12a" />
                <Jungle w={w} y={420} n={6} s={0.85} />
                <Ground w={w} y={470} h={130} c="#9ccf6a" />
                <Putera x={560} y={560} f={f} face="happy" pose="talk" />
                <Notes x={160} y={300} f={f} />
                <Narr x={30} y={30} w={460} text={'PUTERA RAJA'} size={40} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 780, w: 1000, h: 640, at: c('menipu', 6) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#ffe0e4" />
                <Ground w={w} y={560} h={80} c="#9ccf6a" />
                <SwingTree x={160} y={600} s={0.75} angle={0}>
                  {f >= c('Merah', 8) - c('menipu', 6) ? <Merah x={0} y={0} s={0.8} f={f} face={f >= c('bergerak', 10) - c('menipu', 6) ? 'shock' : 'happy'} /> : null}
                </SwingTree>
                <Ibu x={820} y={600} s={0.9} f={f} face="happy" pose="point" flip />
                <Sfx x={640} y={180} text="TAK GERAK!" f={f - (c('bergerak', 10) - c('menipu', 6))} size={90} color="#ffffff" />
                <Stamp x={620} y={380} text="TERBONGKAR!" f={f - (c('terbongkar', 12) - c('menipu', 6))} />
              </>
            ),
          },
        ],
      };
    case 12:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 820, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#f6b26b" bottom="#fff2d8" id="b13" />
                <Ground w={w} y={640} h={180} c="#9ccf6a" />
                <Palace x={500} y={640} s={1.1} />
                <Putera x={400} y={780} s={0.95} f={f} face="happy" />
                <Putih x={600} y={780} s={0.95} f={f} face="happy" flip />
                <Crown x={600} y={585} s={0.5} />
                <Heart x={500} y={150} s={0.8} f={f} />
                <Narr x={30} y={30} w={420} text={'DI ISTANA'} size={40} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 1000, w: 1000, h: 420, at: c('berdendam', 7) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#fff3c4" />
                <Putih x={300} y={380} s={0.9} f={f} face="happy" pose="talk" />
                <Merah x={620} y={380} s={0.85} f={f} face="sad" pose="bow" flip />
                <Ibu x={800} y={385} s={0.9} f={f} face="sad" pose="bow" flip />
                <Narr x={20} y={20} w={480} text={'TAK BERDENDAM'} size={34} />
                <Narr x={20} y={90} w={480} text={'MEMAAFKAN'} size={34} bg="#ffffff" show={f >= c('memaafkan', 9) - c('berdendam', 7)} />
              </>
            ),
          },
        ],
      };
    default:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 520, at: 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#fff3c4" />
                <Heart x={190} y={300} s={1.4} f={f} />
                <Title w={w + 260} y={260} text="KEBAIKAN HATI" size={58} />
                <Title w={w + 260} y={340} text="AKAN DIBALAS" size={58} c="#c0504d" />
                <Narr x={30} y={30} w={440} text={'PENGAJARAN'} size={44} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 700, w: 480, h: 720, at: c('cemburu', 5) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#ffb3a0" />
                <Flames x={w / 2} y={500} f={f} s={1.2} />
                <Merah x={w / 2} y={480} s={0.9} f={f} face="sad" />
                <Narr x={20} y={20} w={440} text={'CEMBURU &\nPILIH KASIH\n= MALU'} size={34} bg="#ffffff" />
              </>
            ),
          },
          {
            key: 'c', x: 560, y: 700, w: 480, h: 720, at: c('memilih', 9) - 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#8fd0f0" bottom="#fff2d8" id="b14c" />
                <Ground w={w} y={560} h={160} c="#9ccf6a" />
                <Putih x={w / 2} y={640} s={1} f={f} face="happy" pose="cheer" />
                <Heart x={w / 2} y={260} s={0.7} f={f} />
                <Narr x={20} y={20} w={440} text={'PILIH UNTUK\nJADI BAIK'} size={36} />
              </>
            ),
          },
        ],
      };
  }
};

const SFX_MAP: Record<number, [string, number, string][]> = {
  0: [['kekejaman', 4, 'jump']],
  1: [['meninggal', 5, 'blip']],
  2: [['berkahwin', 2.5, 'sparkle'], ['Merah', 6, 'pop']],
  3: [['perangai', 6, 'alert']],
  4: [['suka', 9, 'sparkle'], ['panas', 13, 'smash']],
  5: [['Pergi', 9, 'alert'], ['bersolek', 14, 'sparkle']],
  6: [['bebas', 9, 'buzz']],
  8: [['kaloi', 6, 'sparkle']],
  9: [['menangkap', 2, 'smash'], ['menanamnya', 9, 'pop']],
  10: [['buaian', 4, 'sparkle'], ['menyanyi', 6, 'whoosh']],
  11: [['bergerak', 10, 'buzz'], ['terbongkar', 12, 'thunder']],
  12: [['istana', 2, 'success']],
  13: [['baik', 12, 'coin']],
};

const ShotView: React.FC<{index: number}> = ({index}) => {
  setLook(true);
  const frame = useCurrentFrame();
  const shot = SHOTS[index];
  const page = pages(index, shot);
  const extra = SFX_MAP[index] ?? [];
  return (
    <AbsoluteFill style={{background: '#efe3c8'}}>
      <Page panels={page.panels} />
      <Captions shot={shot} y={1520} />
      {index > 0 ? <AbsoluteFill style={{background: '#fff', opacity: interpolate(frame, [0, 5], [0.5, 0], clamp)}} /> : null}
      {shot.audio.map((a, k) => (
        <Sequence key={`vo${k}`} from={a.from} name="VO">
          <Audio src={staticFile(a.src)} />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={FPS} name="SFX page">
        <Audio src={staticFile('audio/sfx/whoosh.wav')} volume={0.28} />
      </Sequence>
      {extra.map(([w, fb, name], k) => (
        <Sequence key={k} from={Math.max(0, cue(shot, w, fb))} durationInFrames={FPS * 2} name={`SFX ${name}`}>
          <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={name === 'thunder' || name === 'smash' ? 0.38 : 0.3} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const BawangShot: React.FC<{index: number}> = ({index}) => <ShotView index={index} />;

export const BawangVideo: React.FC = () => {
  const music = (f: number) => interpolate(f, [0, 15, TOTAL_FRAMES - 45, TOTAL_FRAMES], [0, 0.09, 0.09, 0], clamp);
  return (
    <AbsoluteFill>
      {SHOTS.map((s, i) => (
        <Sequence key={s.id} from={s.start} durationInFrames={s.frames} name={s.id}>
          <ShotView index={i} />
        </Sequence>
      ))}
      <Audio src={staticFile('audio/music/bgm-legend.wav')} loop volume={music} />
    </AbsoluteFill>
  );
};
