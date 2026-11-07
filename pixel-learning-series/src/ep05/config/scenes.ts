import type {SceneConfig} from '../../config/scenes';
import {supporterCountWords, supporterList, SUPPORTERS} from './supporters';

// Episode 05 – Introduction to Linux. Same rules as Episodes 01–04:
// *asterisks* = red highlight, \n = line break, sfx = fixed-time cues (word-synced cues live in scenes).
// Edit `vo` to change narration (then re-run `npm run audio:vo:ep05`), `text`/`list` for on-screen copy,
// `minSeconds` / `padSeconds` for scene length (a scene always stretches to fit its voice-over).

const vo = (n: number) => `audio/ep05/vo/scene${String(n).padStart(2, '0')}.mp3`;

export const SCENES: SceneConfig[] = [
  {
    id: 'Ep05Scene01Hook',
    name: 'Hook',
    minSeconds: 6,
    padSeconds: 0.5,
    voDelay: 0.5,
    vo: 'Windows mungkin sistem operasi yang selalu kita guna. Tapi pernah dengar Linux? Tahukah anda, Linux memainkan peranan penting dalam dunia server dan teknologi!',
    voFile: vo(1),
    text: {line1: 'WINDOWS *SELALU GUNA?*', line2: 'PERNAH DENGAR *LINUX?*', line3: 'APA YANG MENARIK\nTENTANG *LINUX?*'},
    sfx: [{at: 0.1, sfx: 'whoosh'}],
  },
  {
    id: 'Ep05Scene02Greeting',
    name: 'Salam',
    minSeconds: 6,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Assalamualaikum dan hai semua! Selamat kembali. Jom, mari sama-sama belajar!',
    voFile: vo(2),
    text: {headline: 'ASSALAMUALAIKUM!', sub: 'MARI SAMA-SAMA\n*BELAJAR!*'},
    sfx: [
      {at: 0.2, sfx: 'pop'},
      {at: 1.2, sfx: 'sparkle'},
    ],
  },
  {
    id: 'Ep05Scene03Supporters',
    name: 'Terima Kasih Gift Kek',
    minSeconds: 11,
    padSeconds: 0.6,
    voDelay: 0.3,
    vo: `Sebelum kita mula, saya nak ucapkan terima kasih kepada ${supporterCountWords()} yang sudi belanja Gift Kek! Terima kasih ${supporterList()}! Sokongan anda semua membuatkan saya lebih bersemangat untuk terus berkongsi ilmu. Terima kasih banyak-banyak!`,
    voFile: vo(3),
    text: {headline: '*TERIMA KASIH!*', sub: `${SUPPORTERS.length} PENYUMBANG GIFT KEK`},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep05Scene04WhatIs',
    name: 'Apa Itu Linux',
    minSeconds: 9,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Linux sebenarnya merujuk kepada kernel sumber terbuka yang menjadi asas kepada banyak sistem operasi. Sistem berasaskan Linux digunakan dalam pelbagai peranti dan persekitaran teknologi.',
    voFile: vo(4),
    text: {
      headline: 'WHAT IS *LINUX?*',
      sub: 'AN OPEN-SOURCE OPERATING SYSTEM *KERNEL*',
      malay: 'Linux ialah kernel sumber terbuka yang menjadi asas kepada banyak sistem operasi.',
    },
    list: ['SERVER', 'TELEFON', 'ROUTER', 'CLOUD', 'DESKTOP'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep05Scene05LinuxVsWindows',
    name: 'Linux vs Windows',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Linux dan Windows kedua-duanya digunakan sebagai sistem operasi. Linux terkenal dengan fleksibiliti, pilihan distribution dan penggunaannya dalam server. Windows pula sangat popular untuk komputer peribadi dan persekitaran perniagaan.',
    voFile: vo(5),
    text: {headline: 'LINUX *vs* WINDOWS'},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep05Scene06Kernel',
    name: 'Linux Kernel',
    minSeconds: 8,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Kernel ialah bahagian teras sistem operasi. Ia menguruskan proses, memori, peranti dan sumber komputer supaya software boleh berkomunikasi dengan hardware.',
    voFile: vo(6),
    text: {headline: 'THE LINUX *KERNEL*', flow: 'APPLICATIONS → *KERNEL* → HARDWARE'},
    list: ['Process management', 'Memory management', 'Device management', 'System resources'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep05Scene07Distros',
    name: 'Distribusi Linux',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Linux mempunyai pelbagai distribution atau distro. Antaranya Ubuntu, Debian, Fedora dan Red Hat Enterprise Linux. Setiap distro mempunyai pendekatan, pakej dan kegunaan yang berbeza.',
    voFile: vo(7),
    text: {headline: 'WHAT IS A\n*LINUX DISTRIBUTION?*', sub: 'DIFFERENT FLAVOURS OF LINUX', formula: 'KERNEL + SOFTWARE = *DISTRO*'},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep05Scene08GuiCli',
    name: 'GUI vs CLI',
    minSeconds: 8,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'GUI membolehkan kita berinteraksi menggunakan ikon, menu dan mouse. CLI pula membolehkan kita memberikan arahan melalui command line atau terminal.',
    voFile: vo(8),
    text: {headline: 'GUI *vs* CLI', sub: 'CLICK OR *TYPE?*', gui: 'Graphical User Interface', cli: 'Command Line Interface'},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep05Scene09Commands',
    name: 'Command Asas Linux',
    minSeconds: 14,
    padSeconds: 1.0,
    voDelay: 0.3,
    vo: 'Jom cuba beberapa command asas Linux! PWD untuk melihat lokasi folder semasa. LS untuk melihat senarai fail dan folder. CD untuk masuk ke folder lain. MKDIR untuk mencipta folder baharu. Dan WHOAMI untuk mengetahui pengguna yang sedang login.',
    voFile: vo(9),
    text: {headline: "LET'S TRY\n*LINUX COMMANDS!*", sim: 'TERMINAL SIMULASI'},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep05Scene10Server',
    name: 'IT Server Administrator',
    minSeconds: 14,
    padSeconds: 0.8,
    voDelay: 0.3,
    vo: 'Bayangkan anda bekerja sebagai IT administrator. Anda perlu menguruskan server syarikat. Dengan menggunakan Linux terminal, anda boleh menyemak fail, mengurus folder dan menjalankan pelbagai arahan. Inilah antara kemahiran asas yang berguna dalam pengurusan sistem dan server.',
    voFile: vo(10),
    text: {
      headline: 'LINUX IN *REAL LIFE*',
      sub: 'MANAGE YOUR SERVER USING TERMINAL',
      more: 'Asas sahaja: pentadbir sebenar juga urus\nuser, permission, service, log & keselamatan.',
    },
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep05Scene11Recap',
    name: 'Recap',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Jom kita recap! Linux kernel ialah teras sistem operasi. Ubuntu, Debian dan Fedora ialah contoh distribution. GUI menggunakan grafik, CLI menggunakan arahan terminal. Dan jangan lupa lima command asas yang kita belajar tadi!',
    voFile: vo(11),
    text: {headline: "LET'S RECAP!"},
    sfx: [{at: 0.1, sfx: 'pop'}],
  },
  {
    id: 'Ep05Scene12CTA',
    name: 'Penutup & CTA',
    minSeconds: 12,
    padSeconds: 1.6,
    voDelay: 0.3,
    vo: 'Terima kasih kerana belajar bersama saya! Kalau perkongsian ini bermanfaat, jangan lupa Like, Share dan Follow untuk lebih banyak video pembelajaran menarik selepas ini. Dan kepada yang ingin menyokong perkongsian ilmu ini dengan Gift Kek, sokongan anda amatlah dihargai. Jumpa lagi!',
    voFile: vo(12),
    text: {
      headline: 'TERIMA KASIH\nKERANA BELAJAR\n*BERSAMA SAYA!*',
      gift: 'SUPPORT DENGAN *GIFT KEK*',
      footer: 'JUMPA LAGI DALAM\n*VIDEO SETERUSNYA!*',
    },
    list: ['LIKE', 'SHARE', 'FOLLOW'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
];

// Linux vs Windows comparison (Scene 05). Neither side is "free" or "CLI-less" by definition.
export const COMPARE = {
  linux: ['Open-source kernel', 'Banyak distribution', 'Meluas dalam server', 'Fleksibel untuk ubah suai', 'GUI dan CLI'],
  windows: ['Sistem operasi proprietari', 'Meluas di komputer peribadi', 'Ekosistem software komersial', 'GUI dan CLI'],
};

// Distribution cards (Scene 07): text labels with original pixel art, no official logos.
export const DISTROS = [
  {cue: 'Ubuntu', name: 'UBUNTU', note: 'Mesra pemula, desktop & cloud', color: '#E95420'},
  {cue: 'Debian', name: 'DEBIAN', note: 'Stabil, asas banyak distro lain', color: '#A80030'},
  {cue: 'Fedora', name: 'FEDORA', note: 'Komuniti, teknologi terkini', color: '#1265C8'},
  {cue: 'Red', name: 'RED HAT ENTERPRISE LINUX', note: 'Enterprise, langganan berbayar', color: '#C93434'},
];

// Simulated terminal session (Scene 09). Prompt changes after `cd`, like a real shell.
export const COMMANDS = [
  {cue: 'PWD', cmd: 'pwd', dir: '~', output: ['/home/student'], explain: 'Papar lokasi folder semasa'},
  {cue: 'LS', cmd: 'ls', dir: '~', output: ['Documents  Downloads  Pictures'], explain: 'Senarai fail & folder'},
  {cue: 'CD', cmd: 'cd Documents', dir: '~', output: [], explain: 'Masuk ke folder lain'},
  {cue: 'MKDIR', cmd: 'mkdir LinuxPractice', dir: '~/Documents', output: [], explain: 'Cipta folder baharu'},
  {cue: 'WHOAMI', cmd: 'whoami', dir: '~/Documents', output: ['student'], explain: 'Nama pengguna semasa'},
];

// Server session (Scene 10), paced across the narration.
export const SERVER_SESSION = [
  {cmd: 'pwd', dir: '~', output: ['/home/admin']},
  {cmd: 'ls', dir: '~', output: ['backup  logs  reports']},
  {cmd: 'cd reports', dir: '~', output: []},
  {cmd: 'mkdir 2026-Q4', dir: '~/reports', output: []},
  {cmd: 'whoami', dir: '~/reports', output: ['admin']},
];

// Recap cards (Scene 11).
export const RECAP = [
  {cue: 'kernel', title: 'LINUX KERNEL', desc: 'Teras sistem operasi'},
  {cue: 'Ubuntu', title: 'DISTRIBUTIONS', desc: 'Ubuntu, Debian, Fedora, RHEL'},
  {cue: 'GUI', title: 'GUI', desc: 'Antara muka grafik'},
  {cue: 'CLI', title: 'CLI', desc: 'Antara muka baris arahan'},
  {cue: 'lima', title: 'BASIC COMMANDS', desc: 'pwd, ls, cd, mkdir, whoami'},
  {cue: 'tadi', title: 'REAL-WORLD USE', desc: 'Server & infrastruktur IT'},
];

export const TRANSITION_FRAMES = 12;
