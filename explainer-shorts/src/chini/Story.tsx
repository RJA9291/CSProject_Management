import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {cue, FPS, makeTimeline, ScriptShot, Shot, Timing} from '../lib/timeline';
import {Captions} from '../waze/ui/Overlays';
import {Dragon, Fish, Fog, Fountain, Hills, Hut, Jungle, Lotus, Moon, Person, QMark, Sky, Stick, SunkenCity, Water} from './art';
import {INK, Narr, Page, PanelDef, Sfx, Speech, SpeedLines} from './comic';
import {setLook} from './look';
import script from './script.json';
import timings from './timings.json';

export const {SHOTS, TOTAL_FRAMES} = makeTimeline(script.shots as ScriptShot[], timings as Record<string, Timing>, 'audio/chini/vo', script.say as Record<string, string>);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const JAKUN = ['#c0504d', '#3d7bd9', '#f4a51c', '#36a86b'];

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
            key: 'a', x: 40, y: 150, w: 1000, h: 640, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#7cc3ee" bottom="#e6f6ff" id="p2a" />
                <Hills w={w} y={300} />
                <Jungle w={w} y={380} n={7} s={0.8} />
                <rect y={440} width={w} height={200} fill="#9ccf6a" stroke={INK} strokeWidth={5} />
                <Narr x={30} y={30} w={560} text={'PADA ZAMAN DAHULU KALA...'} size={36} />
                <Narr x={520} y={520} w={450} text={'BELUM ADA TASIK'} size={34} bg="#ffffff" show={f >= c('belum', 3) - 4} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 820, w: 480, h: 600, at: c('Burung', 6) - 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#ffcf8a" bottom="#fff2d8" id="p2b" />
                <Jungle w={w} y={380} n={4} s={0.9} />
                <rect y={440} width={w} height={160} fill="#9ccf6a" />
                {[0, 1, 2].map((k) => (
                  <path key={k} d={`M ${120 + k * 110} ${200 + Math.sin(f / 5 + k) * 14} q 18 -18 36 0 q 18 -18 36 0`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
                ))}
                <Sfx x={w / 2} y={130} text="CIP! CIP!" f={f - 2} size={70} />
              </>
            ),
          },
          {
            key: 'c', x: 560, y: 820, w: 480, h: 600, at: c('angin', 8) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#cfe8b8" />
                {Array.from({length: 14}, (_, k) => (
                  <path key={k} d={`M ${30 + k * 32} 560 q ${10 + Math.sin(f / 6 + k) * 18} -80 ${24 + Math.sin(f / 6 + k) * 30} -150`} fill="none" stroke="#3f8a4c" strokeWidth={8} strokeLinecap="round" />
                ))}
                {[0, 1].map((k) => (
                  <path key={k} d={`M ${60 + ((f * 6 + k * 200) % 420)} ${180 + k * 90} q 40 -30 80 0 t 80 0`} fill="none" stroke="#ffffff" strokeWidth={8} strokeLinecap="round" />
                ))}
                <Sfx x={w / 2} y={120} text="WUSHH..." f={f - 2} size={80} color="#ffffff" />
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
                <rect y={560} width={w} height={200} fill="#c9a06a" stroke={INK} strokeWidth={5} />
                <Hut x={180} y={560} s={1.1} />
                <Hut x={820} y={560} s={0.9} />
                <Person x={430} y={720} f={f} cloth="#8c5a3c" elder pose="talk" face="happy" />
                <Person x={600} y={730} s={0.62} f={f} cloth={JAKUN[0]} face="happy" flip />
                <Person x={700} y={735} s={0.58} f={f} cloth={JAKUN[1]} woman face="happy" flip />
                <Speech x={440} y={150} w={360} h={140} tx={470} ty={420} text={'Hidup aman...'} size={44} />
                <Narr x={30} y={30} w={560} text={'KAMPUNG DI PINGGIR HUTAN'} size={34} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 940, w: 1000, h: 480, at: c('bercerita', 6) - 4,
            draw: (f, w) => (
              <>
                <rect width={w} height={480} fill="#1b2350" />
                <Moon x={880} y={110} r={50} />
                {[180, 500, 820].map((px, k) => (
                  <g key={px}>
                    <Person x={px} y={450} s={0.85} f={f + k * 7} cloth={JAKUN[k + 1]} woman={k === 1} elder={k === 0} pose="talk" face="happy" />
                    {k < 2 ? <path d={`M ${px + 70} 210 q 90 -60 180 0`} fill="none" stroke={INK} strokeWidth={6} strokeDasharray="14 10" /> : null}
                  </g>
                ))}
                <Narr x={30} y={24} w={560} text={'SETIAP MALAM...'} size={36} />
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
                <Narr x={30} y={30} w={520} text={'MEMBUKA LADANG BARU'} size={34} />
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
                <Speech x={380} y={60} w={460} h={170} tx={350} ty={300} text={'Siapa benarkan\nkamu tebang?!'} size={40} shout />
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
                <Speech x={430} y={90} w={520} h={240} tx={330} ty={250} text={'Jangan sesekali\ncabut tongkat ini!'} size={42} />
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
            key: 'b', x: 40, y: 600, w: 480, h: 820, at: c('pemuda', 3) - 4,
            draw: (f, w, h) => {
              const t = f - (pull - c('pemuda', 3));
              return (
              <>
                <rect width={w} height={h} fill="#ffe08a" />
                <rect y={640} width={w} height={180} fill="#c9a06a" stroke={INK} strokeWidth={5} />
                <Stick x={300} y={660} lift={Math.max(0, Math.min(160, t * 10))} />
                <Person x={200} y={780} f={f} cloth={JAKUN[2]} pose={t >= -20 ? 'pull' : 'point'} face={t >= 0 ? 'shock' : 'happy'} />
                <Sfx x={w / 2} y={190} text="PLUP!" f={t} size={120} />
              </>
              );
            },
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
                <Narr x={30} y={30} w={560} text={'NAGA SERI GUMUM'} size={44} show={f >= c('Seri', 4) - 4} />
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
                <Dragon x={620} water={1000} s={0.9} f={f} rise={interpolate(f, [c('meronda', 7) - 4, c('meronda', 7) + 30], [0, 0.45], clamp)} dim />
                <Narr x={30} y={30} w={640} text={'BILA MALAM BERKABUS...'} size={38} show={f >= c('kabus', 3) - 4} />
                <Narr x={30} y={110} w={640} text={'NAGA KELUAR MERONDA'} size={34} bg="#ffffff" show={f >= c('meronda', 7) - 4} />
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
                <Water w={w} h={h} y={140} f={f * 3} rough={f + 4 >= c('berombak', 3) ? 4 : 1} />
                <Narr x={30} y={24} w={600} text={'TANDA-TANDA\nNAGA LALU...'} size={36} show={f + 4 < c('berombak', 3)} />
                <Sfx x={500} y={120} text="AIR BEROMBAK!" f={f + 4 - c('berombak', 3) - 2} size={70} color="#ffffff" rot={-4} />
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
            key: 'd', x: 40, y: 1110, w: 1000, h: 310, at: c('berbisik', 9) - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#ffd23f" />
                <rect width={w} height={h} fill="url(#ht-red)" opacity={0.15} />
                <text x={w / 2} y={180} textAnchor="middle" fontFamily="Rubik, sans-serif" fontWeight={900} fontSize={64} fill={INK}>
                  "ITU NAGA SEDANG LALU..."
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
                <Narr x={30} y={30} w={560} text={'HORMATI TASIK'} size={40} show={f >= c('menghormati', 2) - 4} />
              </>
            ),
          },
        ],
      };
    case 10: {
      const guard = c('menjaganya', 8);
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
                <Narr x={30} y={30} w={620} text={'KOTA LAMA\nDI DASAR TASIK'} size={38} />
                {f >= guard - 4 ? (
                  <g opacity={Math.min(1, (f - guard + 4) / 12)}>
                    <path d={`M -40 ${560 + Math.sin(f / 12) * 20} C 200 420 380 700 620 560 S 900 460 1080 ${600 + Math.sin(f / 12) * 20}`} fill="none" stroke="#2f8a5a" strokeWidth={70} strokeLinecap="round" />
                    <circle cx={1000} cy={560} r={10} fill="#ffd23f" />
                  </g>
                ) : null}
                <Narr x={520} y={1150} w={460} text={'DIJAGA SIANG & MALAM'} size={30} bg="#ffffff" show={f >= guard} />
              </>
            ),
          },
        ],
      };
    }
    case 11: {
      const janji = c('janji', 6);
      return {
        panels: [
          {
            key: 'a', x: 40, y: 150, w: 1000, h: 760, at: 4,
            draw: (f, w, h) => (
              <>
                <Sky w={w} h={h} top="#f6b26b" bottom="#fff2d8" id="p12" />
                <Hills w={w} y={360} />
                <Jungle w={w} y={440} n={7} s={0.8} />
                <Water w={w} h={h} y={440} f={f} />
                <Lotus x={260} y={600} />
                <Lotus x={760} y={640} s={0.8} />
                <Narr x={30} y={30} w={520} text={'PENGAJARAN'} size={44} show={f >= c('Pengajarannya', 4) - 4} />
                <Narr x={30} y={120} w={620} text={'PESANAN ORANG TUA\nJANGAN DIPANDANG RINGAN'} size={32} bg="#ffffff" show={f >= c('pesanan', 5) - 4} />
              </>
            ),
          },
          {
            key: 'b', x: 40, y: 940, w: 1000, h: 480, at: janji - 4,
            draw: (f, w, h) => (
              <>
                <rect width={w} height={h} fill="#ffe08a" />
                <rect y={360} width={w} height={120} fill="#c9a06a" stroke={INK} strokeWidth={5} />
                <Stick x={w / 2} y={380} lift={Math.min(120, f * 6)} />
                <QMark x={780} y={190} f={f} size={110} />
                <Narr x={30} y={24} w={560} text={'SATU JANJI DILUPAKAN...'} size={34} />
              </>
            ),
          },
        ],
      };
    }
    default: {
      const ask = c('percaya', 6);
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
                <Stick x={300} y={580} />
                <Narr x={30} y={30} w={560} text={'BERANI CABUT TAK?'} size={40} show={f >= c('berani', 3) - 4} />
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
                  NAGA MASIH ADA?
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
  1: [['Burung', 6, 'pop'], ['angin', 8, 'whoosh']],
  3: [['nenek', 7, 'alert']],
  4: [['mencucuk', 3, 'click'], ['Jangan', 6, 'sparkle']],
  5: [['tercabut', 4, 'pop'], ['memancut', 5, 'smash'], ['terbentuklah', 8, 'whoosh']],
  6: [['naga', 2.5, 'thunder'], ['bergelora', 10, 'smash']],
  7: [['meronda', 7, 'whoosh']],
  8: [['berombak', 3, 'whoosh'], ['bunyi', 5, 'blip']],
  10: [['menjaganya', 8, 'sparkle']],
  11: [['janji', 6, 'alert']],
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
