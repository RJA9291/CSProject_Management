import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {cue, FPS, makeTimeline, ScriptShot, Shot, Timing} from '../lib/timeline';
import {Captions} from '../waze/ui/Overlays';
import {Badge, Dragon, Fish, Fog, Fountain, Hills, Hut, Jungle, Lotus, Moon, Person, QMark, Sky, Stick, Stump, SunkenCity, TwelveLakes, Water} from './art';
import {INK, Narr, Page, PanelDef, Sfx, Speech, SpeedLines} from './comic';
import {setLook} from './look';
import script from './script.json';
import timings from './timings.json';

export const {SHOTS, TOTAL_FRAMES} = makeTimeline(script.shots as ScriptShot[], timings as Record<string, Timing>, 'audio/chini/vo', script.say as Record<string, string>);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const JAKUN = ['#c0504d', '#3d7bd9', '#f4a51c', '#36a86b'];

// Giant hand reaching in (the "real monster" is human damage).
const Hand: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-50} y={-400} width={100} height={260} fill="#d9a47a" stroke={INK} strokeWidth={6} />
    <rect x={-70} y={-160} width={140} height={110} rx={30} fill="#d9a47a" stroke={INK} strokeWidth={6} />
    {[-52, -18, 16, 50].map((fx) => (
      <rect key={fx} x={fx - 14} y={-70} width={28} height={70} rx={14} fill="#d9a47a" stroke={INK} strokeWidth={6} />
    ))}
  </g>
);

const pages = (i: number, shot: Shot): {panels: PanelDef[]; bg?: string} => {
  const c = (w: string, fb: number, nth = 0) => cue(shot, w, fb, nth);
  switch (i) {
    case 0:
      return {
        bg: '#2a1e3a',
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 1260, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#2b1d52" bottom="#f08a5d" id="p1" />
                <Moon x={760} y={220} r={70} />
                <Hills w={w} y={640} color="#1f4a3a" />
                <Jungle w={w} y={760} n={8} s={0.9} />
                <Water w={w} h={h} y={760} f={f} color="#1d4f86" />
                <Dragon x={560} water={900} s={1.1} f={f} rise={0.55} dim />
                <Fog w={w} y={830} f={f} />
                <QMark x={170} y={430} f={f} size={130} />
                <Sfx x={500} y={520} text="NAGA?!" f={f - (c('naga', 3) - 4)} size={150} />
                <Narr x={40} y={40} w={520} text={'TASIK CHINI, PAHANG'} size={40} show={f >= c('Chini', 5) - 4} />
              </>
            ),
          },
        ],
      };
    case 1:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 560, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#7cc3ee" bottom="#e6f6ff" id="p2a" />
                <Hills w={w} y={260} />
                <Jungle w={w} y={340} n={7} s={0.8} />
                <Water w={w} h={h} y={340} f={f} />
                <Lotus x={300} y={440} s={0.9} />
                <Lotus x={700} y={470} s={0.7} />
                <Narr x={30} y={30} w={560} text={'DAERAH PEKAN, PAHANG'} size={38} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 740, w: 480, h: 680, at: c('dua', 3) - 4,
            draw: (f, w) => (
              <>
                <rect width={w} height={680} fill="#e6f6ff" />
                <rect width={w} height={680} fill="url(#ht-light)" />
                <TwelveLakes cx={w / 2} cy={360} f={f} s={0.95} />
                <Narr x={20} y={20} w={440} text={'12 KAWASAN AIR\nBERSAMBUNG'} size={34} />
                <text x={w / 2} y={650} textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={800} fontSize={20} fill={INK}>
                  (ilustrasi, bukan skala sebenar)
                </text>
              </>
            ),
          },
          {
            key: 'c', x: 560, y: 740, w: 480, h: 680, at: c('2009', 6) - 4,
            draw: (f, w) => (
              <>
                <rect width={w} height={680} fill="#fff2b8" />
                <rect width={w} height={680} fill="url(#ht-red)" opacity={0.12} />
                <Badge x={w / 2} y={330} year="2009" label="RIZAB BIOSFERA" f={f} />
                <Narr x={20} y={520} w={440} text={'DIIKTIRAF UNESCO:\nRIZAB BIOSFERA\nPERTAMA DI MALAYSIA'} size={30} bg="#ffffff" />
              </>
            ),
          },
        ],
      };
    case 2:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 760, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#ffcf8a" bottom="#fff2d8" id="p3" />
                <Jungle w={w} y={420} n={7} s={0.9} />
                <Water w={w} h={h} y={560} f={f} />
                <Hut x={180} y={560} s={1.1} />
                <Hut x={820} y={560} s={0.9} />
                <Person x={430} y={720} f={f} cloth="#8c5a3c" elder pose="talk" face="happy" />
                <Person x={600} y={730} s={0.62} f={f} cloth={JAKUN[0]} face="happy" flip />
                <Person x={700} y={735} s={0.58} f={f} cloth={JAKUN[1]} woman face="happy" flip />
                <Speech x={440} y={150} w={360} h={140} tx={470} ty={420} text={'Dulu-dulu...'} size={44} />
                <Narr x={30} y={30} w={380} text={'ORANG ASLI JAKUN'} size={36} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 940, w: 1000, h: 480, at: c('mulut', 6) - 4,
            draw: (f, w) => (
              <>
                <rect width={w} height={480} fill="#fff6e0" />
                {[180, 500, 820].map((px, k) => (
                  <g key={px}>
                    <Person x={px} y={450} s={0.85} f={f + k * 7} cloth={JAKUN[k + 1]} woman={k === 1} elder={k === 0} pose="talk" face="happy" />
                    {k < 2 ? <path d={`M ${px + 70} 210 q 90 -60 180 0`} fill="none" stroke={INK} strokeWidth={6} strokeDasharray="14 10" /> : null}
                  </g>
                ))}
                <Narr x={30} y={24} w={560} text={'DARI MULUT KE MULUT'} size={36} />
              </>
            ),
          },
        ],
      };
    case 3: {
      const nenek = c('nenek', 7);
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 620, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#8fd0f0" bottom="#e6f6ff" id="p4a" />
                <rect y={420} width={w} height={200} fill="#c9a06a" stroke={INK} strokeWidth={5} />
                <Jungle w={w} y={430} n={5} s={0.9} />
                <Person x={330} y={590} f={f} cloth={JAKUN[0]} pose="chop" />
                <Person x={640} y={590} f={f + 5} cloth={JAKUN[1]} pose="chop" flip />
                <Sfx x={500} y={200} text="TAK! TAK!" f={f % 18} size={90} color="#ffffff" />
                <Narr x={30} y={30} w={520} text={'DAHULU: TANAH KERING'} size={34} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 800, w: 1000, h: 620, at: nenek - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#e8f4d8" />
                <rect width={w} height={h} fill="url(#ht-red)" opacity={0.1} />
                <Person x={300} y={590} f={f} cloth="#6b5a7a" woman elder pose="point" face="angry" />
                <Person x={700} y={590} f={f} cloth={JAKUN[0]} pose="scared" face="shock" flip />
                <Person x={860} y={595} s={0.9} f={f} cloth={JAKUN[1]} pose="scared" face="shock" flip />
                <Speech x={380} y={60} w={460} h={170} tx={350} ty={300} text={'Tanah ini\nmilik aku!'} size={44} shout />
              </>
            ),
          },
        ],
      };
    }
    case 4:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 480, h: 700, at: 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#e8f4d8" />
                <Person x={170} y={660} s={0.9} f={f} cloth={JAKUN[0]} pose="bow" face="sad" />
                <Person x={330} y={665} s={0.85} f={f} cloth={JAKUN[1]} pose="bow" face="sad" />
                <Speech x={60} y={80} w={360} h={140} tx={170} ty={360} text={'Maaf, nek!'} size={42} />
              </>
            ),
          },
          {
            key: 'b', x: 560, y: 150, w: 480, h: 700, at: c('mencucuk', 3) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#ffe08a" />
                <SpeedLines cx={w / 2} cy={480} w={w} h={h} f={f} />
                <rect y={560} width={w} height={140} fill="#c9a06a" stroke={INK} strokeWidth={5} />
                <Stick x={w / 2} y={580} lift={Math.max(0, 80 - f * 12)} />
                <Sfx x={w / 2} y={170} text="TUK!" f={f - 6} size={110} color="#ffffff" />
              </>
            ),
          },
          {
            key: 'c', x: 40, y: 880, w: 1000, h: 540, at: c('Jangan', 6) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#d9c4ff" />
                <rect width={w} height={h} fill="url(#ht-dark)" opacity={0.2} />
                <g transform="translate(260 520) scale(1.9)">
                  <Person x={0} y={0} f={f} cloth="#6b5a7a" woman elder face="calm" />
                </g>
                <Speech x={430} y={90} w={520} h={240} tx={330} ty={250} text={'Jangan sesekali\ncabut tongkat ini.'} size={42} />
              </>
            ),
          },
        ],
      };
    case 5: {
      const pull = c('tercabut', 4);
      const burst = c('memancut', 5);
      const lake = c('terbentuklah', 8);
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 420, at: 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#cfe8b8" />
                <Stick x={500} y={380} />
                {Array.from({length: 9}, (_, k) => (
                  <path key={k} d={`M ${430 + k * 16} 380 l 6 -${30 + (k % 3) * 14}`} stroke="#3f8a4c" strokeWidth={6} />
                ))}
                <Narr x={30} y={30} w={520} text={'PESANAN DILUPAKAN...'} size={36} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 600, w: 480, h: 820, at: pull - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#ffe08a" />
                <rect y={640} width={w} height={180} fill="#c9a06a" stroke={INK} strokeWidth={5} />
                <Stick x={300} y={660} lift={Math.min(160, f * 10)} />
                <Person x={200} y={780} f={f} cloth={JAKUN[2]} pose="pull" face="shock" />
                <Sfx x={w / 2} y={190} text="PLUP!" f={f - 4} size={120} />
              </>
            ),
          },
          {
            key: 'c', x: 560, y: 600, w: 480, h: 820, at: burst - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#bfe6ff" />
                <SpeedLines cx={w / 2} cy={560} w={w} h={h} f={f} />
                <rect y={640} width={w} height={180} fill="#c9a06a" stroke={INK} strokeWidth={5} />
                <Fountain x={w / 2} y={650} f={f} power={Math.min(1.6, 0.4 + f * 0.05)} />
                <Sfx x={w / 2} y={170} text="SPLAAASH!" f={f - 2} size={62} color="#65c7f4" />
              </>
            ),
          },
          {
            key: 'd', x: 40, y: 150, w: 1000, h: 420, at: lake - 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#7cc3ee" bottom="#e6f6ff" id="p6d" />
                <Jungle w={w} y={200} n={7} s={0.75} />
                <Water w={w} h={h} y={200 - Math.min(40, f)} f={f} />
                <Lotus x={300} y={330} s={0.8} />
                <Lotus x={720} y={350} s={0.65} />
                <Narr x={30} y={30} w={460} text={'TERBENTUK TASIK!'} size={38} />
              </>
            ),
          },
        ],
      };
    }
    case 6: {
      const naga = c('Naga', 2.5);
      const gelora = c('bergelora', 10);
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 900, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#4a6fb0" bottom="#bfe6ff" id="p7" />
                <Hills w={w} y={420} />
                <Jungle w={w} y={520} n={8} s={0.8} />
                <Water w={w} h={h} y={520} f={f} />
                {f >= naga - 4 ? <SpeedLines cx={620} cy={420} w={w} h={h} f={f} /> : null}
                {f >= naga - 4 ? <Dragon x={560} water={700} s={1.25} f={f} rise={Math.min(1, (f - naga + 4) / 24)} /> : null}
                <Narr x={30} y={30} w={560} text={'NAGA SERI GUMUM'} size={44} show={f >= naga} />
                <Narr x={30} y={110} w={560} text={'"PENJAGA TASIK"'} size={34} bg="#ffffff" show={f >= c('penjaga', 5)} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 1080, w: 1000, h: 340, at: gelora - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#bfe6ff" />
                <Water w={w} h={h} y={120} f={f * 3} rough={4} />
                <Person x={120} y={300} s={0.6} f={f} cloth={JAKUN[0]} pose="scared" face="shock" />
                <Person x={220} y={305} s={0.55} f={f} cloth={JAKUN[3]} woman pose="scared" face="shock" />
                <Sfx x={640} y={110} text="GELORA!" f={f - 2} size={96} color="#ffffff" />
              </>
            ),
          },
        ],
      };
    }
    case 7:
      return {
        bg: '#1b1530',
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 1260, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#0e1640" bottom="#3b4a8a" id="p8" />
                <Moon x={780} y={200} r={60} />
                <Hills w={w} y={560} color="#16304a" />
                <Jungle w={w} y={700} n={9} s={0.85} />
                <Water w={w} h={h} y={700} f={f} color="#183a6a" />
                <path d="M -20 1000 C 300 900 200 1150 520 1060 S 900 1200 1040 1080" fill="none" stroke="#2b5a8a" strokeWidth={40} opacity={0.7} />
                <Fog w={w} y={760} f={f} />
                <Fog w={w} y={980} f={f + 120} />
                <QMark x={860} y={520} f={f} size={120} />
                <Narr x={30} y={30} w={640} text={'SEBAB 1:\nLUAS, BERLIKU, BERKABUS'} size={38} show={f >= c('Pertama', 3) - 4} />
              </>
            ),
          },
        ],
      };
    case 8:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 400, at: 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#bfe6ff" />
                <Water w={w} h={h} y={140} f={f * 3} rough={f + 4 >= c('ombak', 4) ? 4 : 1} />
                <Narr x={30} y={24} w={600} text={'SEBAB 2: PERKARA\nYANG TAK DIFAHAMI'} size={36} show={f + 4 < c('ombak', 4)} />
                <Sfx x={500} y={120} text="OMBAK TIBA-TIBA?" f={f + 4 - c('ombak', 4) - 2} size={70} color="#ffffff" rot={-4} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 580, w: 480, h: 500, at: c('bunyi', 5) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#e8f4d8" />
                <Person x={240} y={470} s={0.95} f={f} cloth={JAKUN[2]} pose="scared" face="shock" />
                <Sfx x={w / 2} y={120} text="BLUP?" f={f - 2} size={110} />
              </>
            ),
          },
          {
            key: 'c', x: 560, y: 580, w: 480, h: 500, at: c('bayang', 6) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#2b7fc4" />
                <rect width={w} height={h} fill="url(#ht-dark)" opacity={0.5} />
                <path d={`M 40 ${300 + Math.sin(f / 10) * 10} C 140 220 240 380 340 300 S 440 240 460 280`} fill="none" stroke="#0e2230" strokeWidth={50} strokeLinecap="round" opacity={0.85} />
                <QMark x={360} y={150} f={f} size={100} />
                <Narr x={20} y={20} w={300} text={'BAYANG?'} size={36} bg="#ffffff" />
              </>
            ),
          },
          {
            key: 'd', x: 40, y: 1110, w: 1000, h: 310, at: c('Naga', 9) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#ffd23f" />
                <rect width={w} height={h} fill="url(#ht-red)" opacity={0.15} />
                <text x={w / 2} y={180} textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={64} fill={INK}>
                  SEBAB 2: "NAGA" = JAWAPAN
                </text>
              </>
            ),
          },
        ],
      };
    case 9:
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 1260, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#8fd0f0" bottom="#fff2d8" id="p10" />
                <Hills w={w} y={420} />
                <Jungle w={w} y={520} n={7} s={0.85} />
                <Water w={w} h={h} y={700} f={f} />
                <Lotus x={260} y={860} />
                <Lotus x={640} y={920} s={0.8} />
                <Lotus x={840} y={820} s={0.7} />
                <Person x={300} y={690} s={0.8} f={f} cloth={JAKUN[1]} pose="cheer" face="happy" />
                <Person x={460} y={692} s={0.75} f={f} cloth={JAKUN[3]} woman pose="cheer" face="happy" />
                <path d="M 760 380 c -40 -60 -120 -20 -80 40 l 80 70 l 80 -70 c 40 -60 -40 -100 -80 -40 z" fill="#e0483a" stroke={INK} strokeWidth={6} transform={`scale(${1 + Math.sin(f / 6) * 0.04})`} />
                <Narr x={30} y={30} w={560} text={'SEBAB 3:\nHORMATI TASIK & ALAM'} size={38} show={f >= c('Ketiga', 1) - 4} />
              </>
            ),
          },
        ],
      };
    case 10: {
      const notProven = c('bukan', 9);
      return {
        bg: '#0e2230',
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 1260, at: 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#1d4f86" />
                <rect width={w} height={h} fill="url(#ht-dark)" opacity={0.4} />
                <rect y={1100} width={w} height={160} fill="#3a3a2a" stroke={INK} strokeWidth={5} />
                <SunkenCity x={w / 2} y={1100} s={1.2} f={f} />
                <Fish x={220} y={420} f={f} />
                <Fish x={760} y={620} f={f + 30} c="#ffb3cf" />
                <QMark x={500} y={360} f={f} size={140} />
                <Narr x={30} y={30} w={620} text={'LEGENDA LAIN:\nKOTA PURBA DI DASAR?'} size={38} />
                {f >= notProven - 4 ? (
                  <g transform={`translate(${w / 2} 760) rotate(-14) scale(${Math.min(1, (f - notProven + 4) / 6)})`}>
                    <rect x={-330} y={-70} width={660} height={140} fill="none" stroke="#e0483a" strokeWidth={14} />
                    <text textAnchor="middle" y={22} fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={60} fill="#e0483a">
                      BELUM TERBUKTI
                    </text>
                  </g>
                ) : null}
              </>
            ),
          },
        ],
      };
    }
    case 11: {
      const flora = c('flora', 6);
      const harm = c('terjejas', 11);
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 380, at: 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#ffffff" />
                <rect width={w} height={h} fill="url(#ht-red)" opacity={0.1} />
                <text x={w / 2} y={150} textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={70} fill={INK}>
                  FAKTA:
                </text>
                <text x={w / 2} y={250} textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={54} fill="#e0483a">
                  TIADA BUKTI SAINTIFIK NAGA
                </text>
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 560, w: 480, h: 860, at: flora - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#bfe6ff" />
                <Water w={w} h={h} y={260} f={f} />
                <Lotus x={140} y={330} s={1.1} />
                <Lotus x={340} y={380} s={0.9} />
                <Fish x={200} y={600} f={f} />
                <Fish x={320} y={720} f={f + 40} c="#36a86b" />
                <Narr x={20} y={20} w={440} text={'FLORA & FAUNA\nTERATAI TERKENAL'} size={32} />
              </>
            ),
          },
          {
            key: 'c', x: 560, y: 560, w: 480, h: 860, at: harm - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#c9a06a" />
                <Water w={w} h={h} y={420} f={f} color="#8a6a3a" />
                <Stump x={110} y={400} />
                <Stump x={250} y={410} s={0.9} />
                <Stump x={380} y={400} s={1.1} />
                <Narr x={20} y={20} w={440} text={'TERJEJAS:\nLOMBONG & BALAK'} size={32} bg="#ff8a8a" />
              </>
            ),
          },
        ],
      };
    }
    default: {
      const hand = c('tangan', 6);
      const ask = c('Korang', 9);
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 820, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#f08a5d" bottom="#ffe0b0" id="p13" />
                <Hills w={w} y={360} />
                <Jungle w={w} y={460} n={7} s={0.8} />
                <Water w={w} h={h} y={460} f={f} />
                <Lotus x={240} y={600} />
                <Lotus x={720} y={640} s={0.8} />
                <Dragon x={620} water={560} s={0.8} f={f} rise={0.35} dim />
                {f >= hand - 4 ? <Hand x={820} y={interpolate(f, [hand - 4, hand + 10], [-50, 360], clamp)} s={1.1} /> : null}
                <Narr x={30} y={30} w={560} text={'KHAZANAH YANG\nPERLU DIJAGA'} size={38} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 1000, w: 1000, h: 420, at: ask - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#ffd23f" />
                <rect width={w} height={h} fill="url(#ht-red)" opacity={0.15} />
                <text x={w / 2} y={150} textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={64} fill={INK}>
                  KORANG PERCAYA?
                </text>
                <Sfx x={w / 2} y={320} text="KOMEN BAWAH!" f={f - (c('Komen', 12) - ask)} size={96} color="#ffffff" rot={-4} />
              </>
            ),
          },
        ],
      };
    }
  }
};

const SFX_MAP: Record<number, [string, number, string][]> = {
  0: [['naga', 3, 'jump']],
  1: [['dua', 3, 'pop'], ['2009', 6, 'success']],
  3: [['nenek', 7, 'alert']],
  4: [['mencucuk', 3, 'click'], ['Jangan', 6, 'sparkle']],
  5: [['tercabut', 4, 'pop'], ['memancut', 5, 'smash'], ['terbentuklah', 8, 'whoosh']],
  6: [['Naga', 2.5, 'thunder'], ['bergelora', 10, 'smash']],
  8: [['ombak', 4, 'whoosh'], ['bunyi', 5, 'blip']],
  10: [['bukan', 9, 'buzz']],
  11: [['terjejas', 11, 'alert']],
  12: [['Komen', 12, 'coin']],
};

const ShotView: React.FC<{index: number; paper?: boolean}> = ({index, paper = true}) => {
  // Paper storybook is the default look; the comic look is kept as an alternative composition.
  setLook(paper);
  const frame = useCurrentFrame();
  const shot = SHOTS[index];
  const page = pages(index, shot);
  const extra = SFX_MAP[index] ?? [];
  return (
    <AbsoluteFill style={{background: paper ? '#efe3c8' : '#fff6e0'}}>
      <Page panels={page.panels} bg={page.bg} />
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

export const ChiniShot: React.FC<{index: number; paper?: boolean}> = ({index, paper = true}) => <ShotView index={index} paper={paper} />;

export const ChiniVideo: React.FC<{paper?: boolean}> = ({paper = true}) => {
  const music = (f: number) => interpolate(f, [0, 15, TOTAL_FRAMES - 45, TOTAL_FRAMES], [0, 0.09, 0.09, 0], clamp);
  return (
    <AbsoluteFill>
      {SHOTS.map((s, i) => (
        <Sequence key={s.id} from={s.start} durationInFrames={s.frames} name={s.id}>
          <ShotView index={i} paper={paper} />
        </Sequence>
      ))}
      <Audio src={staticFile('audio/music/bgm-legend.wav')} loop volume={music} />
    </AbsoluteFill>
  );
};
