import type {SceneConfig} from '../../config/scenes';
import {supporterCountWords, supporterList, SUPPORTERS} from './supporters';

// Episode 06 – IT Support & Troubleshooting Basics. Same rules as Episodes 01–05:
// *asterisks* = red highlight, \n = line break, sfx = fixed-time cues (word-synced cues live in scenes).
// Edit `vo` to change narration (then re-run `npm run audio:vo:ep06`), `text`/`list` for on-screen copy,
// `minSeconds` / `padSeconds` for scene length (a scene always stretches to fit its voice-over).

const vo = (n: number) => `audio/ep06/vo/scene${String(n).padStart(2, '0')}.mp3`;

export const SCENES: SceneConfig[] = [
  {
    id: 'Ep06Scene01Hook',
    name: 'Hook',
    minSeconds: 6,
    padSeconds: 0.5,
    voDelay: 0.5,
    vo: 'Pernah tak komputer tiba-tiba tak boleh guna, internet terputus atau printer tak mahu print? Siapa yang kita panggil? IT Support!',
    voFile: vo(1),
    text: {
      line1: 'COMPUTER TIBA-TIBA\n*TAK BOLEH GUNA?*',
      line2: '*INTERNET* DOWN?',
      line3: '*PRINTER* ROSAK?',
      error: 'Aplikasi tidak bertindak balas',
      call: 'IT SUPPORT!',
    },
    sfx: [{at: 0.1, sfx: 'whoosh'}],
  },
  {
    id: 'Ep06Scene02Greeting',
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
    id: 'Ep06Scene03Supporters',
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
    id: 'Ep06Scene04WhatIs',
    name: 'Apa Itu IT Support',
    minSeconds: 9,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'IT Support ialah fungsi yang membantu pengguna menyelesaikan masalah berkaitan komputer, software, hardware dan rangkaian supaya kerja dapat berjalan dengan lancar.',
    voFile: vo(4),
    text: {
      headline: 'WHAT IS *IT SUPPORT?*',
      sub: 'HELP USERS SOLVE *TECHNOLOGY PROBLEMS*',
      malay: 'IT Support membantu pengguna menyelesaikan masalah berkaitan komputer, software, hardware dan rangkaian.',
      ticket: 'TIKET #1024',
      issue: 'Laptop: aplikasi tidak boleh dibuka',
    },
    list: ['KOMPUTER', 'SOFTWARE', 'HARDWARE', 'RANGKAIAN'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep06Scene05Problems',
    name: 'Masalah Biasa',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Antara masalah biasa yang dihadapi pengguna ialah komputer perlahan, tiada internet, printer tidak berfungsi, software error dan masalah login.',
    voFile: vo(5),
    text: {headline: 'COMMON *IT PROBLEMS*'},
    sfx: [{at: 0.2, sfx: 'alert'}],
  },
  {
    id: 'Ep06Scene06Troubleshooting',
    name: 'Apa Itu Troubleshooting',
    minSeconds: 8,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Troubleshooting ialah proses mengenal pasti punca masalah, menguji kemungkinan penyebab dan melaksanakan penyelesaian yang sesuai.',
    voFile: vo(6),
    text: {headline: '*TROUBLESHOOTING*', sub: 'FIND THE ROOT CAUSE. *SOLVE THE PROBLEM.*'},
    list: ['MASALAH', 'PUNCA', 'UJI', 'PENYELESAIAN'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep06Scene07Steps',
    name: '5 Langkah Troubleshoot',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Untuk menyelesaikan masalah, ikut lima langkah. Kenal pasti masalah, periksa punca, buat ujian, laksanakan penyelesaian dan akhirnya sahkan masalah sudah selesai.',
    voFile: vo(7),
    text: {headline: '*5 STEPS* TO TROUBLESHOOT'},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep06Scene08Internet',
    name: 'Demo: Tiada Internet',
    minSeconds: 14,
    padSeconds: 0.8,
    voDelay: 0.3,
    vo: 'Bayangkan pengguna mengadu komputer tidak boleh connect ke internet. Mula-mula, periksa kabel atau Wi-Fi. Kemudian, semak konfigurasi IP dan cuba ping gateway untuk melihat sama ada sambungan ke router berfungsi. Jika masih gagal, teruskan pemeriksaan dan escalate kepada Network Engineer jika masalah melibatkan rangkaian yang lebih besar.',
    voFile: vo(8),
    text: {
      headline: 'NO *INTERNET?*',
      sub: 'CHECK → TEST → *FIX*',
      complaint: '"Saya tak boleh\nmasuk internet!"',
      gatewayNote: '* 192.168.1.1 hanya contoh: guna gateway sebenar rangkaian anda',
      escalate: 'ESCALATE → NETWORK ENGINEER',
    },
    list: ['Kabel / Wi-Fi bersambung?', 'Airplane mode OFF?', 'Semak IP (ipconfig)', 'Ping gateway', 'Uji akses internet', 'Escalate jika lebih besar'],
    sfx: [{at: 0.2, sfx: 'alert'}],
  },
  {
    id: 'Ep06Scene09Printer',
    name: 'Demo: Printer',
    minSeconds: 10,
    padSeconds: 0.8,
    voDelay: 0.3,
    vo: 'Kalau printer tak boleh print, periksa bekalan kuasa, kertas, toner dan sambungan network atau USB. Semak juga print queue untuk memastikan tiada dokumen yang tersangkut. Selepas itu, cuba buat test print.',
    voFile: vo(9),
    text: {
      headline: 'PRINTER *NOT WORKING?*',
      sub: 'CHECK PAPER → CONNECTION → *QUEUE*',
      jam: 'PAPER JAM',
      safety: 'Matikan printer & ikut manual pengeluar',
      queueTitle: 'PRINT QUEUE',
      doc: 'Laporan_QA.pdf',
      testPage: 'TEST PAGE',
    },
    list: ['Bekalan kuasa', 'Kertas', 'Toner', 'Network / USB', 'Print queue', 'Test print'],
    sfx: [{at: 0.2, sfx: 'alert'}],
  },
  {
    id: 'Ep06Scene10Factory',
    name: 'IT Support di Kilang',
    minSeconds: 14,
    padSeconds: 0.8,
    voDelay: 0.3,
    vo: 'Bayangkan anda bekerja sebagai IT Support di sebuah kilang. Production tak boleh akses sistem, manakala QA pula menghadapi masalah printer. IT Support perlu menyiasat masalah, mengenal pasti punca dan menyelesaikannya. Jika masalah memerlukan kepakaran lain, ia perlu diescalate kepada Network Engineer atau System Administrator.',
    voFile: vo(10),
    text: {headline: 'IT SUPPORT IN A\n*REAL FACTORY*', a: 'A • PRODUCTION: TAK BOLEH AKSES SISTEM', b: 'B • QA: TAK BOLEH PRINT LAPORAN'},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep06Scene11Recap',
    name: 'Recap',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Jom kita recap! IT Support membantu pengguna menyelesaikan masalah teknologi. Ingat lima langkah troubleshooting: Identify, Check, Test, Fix dan Verify. Dan jangan lupa, escalate masalah jika memerlukan kepakaran yang lebih khusus.',
    voFile: vo(11),
    text: {headline: "LET'S RECAP!"},
    sfx: [{at: 0.1, sfx: 'pop'}],
  },
  {
    id: 'Ep06Scene12CTA',
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

// Common problem cards (Scene 05).
export const PROBLEMS = [
  {cue: 'perlahan', title: 'COMPUTER SLOW', malay: 'Komputer perlahan'},
  {cue: 'internet', title: 'NO INTERNET', malay: 'Tiada sambungan'},
  {cue: 'printer', title: 'PRINTER NOT WORKING', malay: 'Printer tak berfungsi'},
  {cue: 'software', title: 'SOFTWARE ERROR', malay: 'Aplikasi crash'},
  {cue: 'login', title: 'LOGIN PROBLEM', malay: 'Tak boleh log masuk'},
];

// Five troubleshooting steps (Scene 07).
export const STEPS = [
  {cue: 'Kenal', title: 'IDENTIFY', desc: 'Fahami masalah pengguna'},
  {cue: 'periksa', title: 'CHECK', desc: 'Periksa hardware, software & sambungan'},
  {cue: 'ujian', title: 'TEST', desc: 'Buat ujian diagnostik yang sesuai'},
  {cue: 'laksanakan', title: 'FIX', desc: 'Laksanakan penyelesaian'},
  {cue: 'sahkan', title: 'VERIFY', desc: 'Sahkan masalah sudah selesai'},
];

// Simulated Windows Command Prompt session (Scene 08). Output trimmed to the relevant lines.
export const NET_COMMANDS = [
  {cmd: 'ipconfig', output: ['Ethernet adapter Ethernet:', '  IPv4 Address. . : 192.168.1.25', '  Subnet Mask . . : 255.255.255.0', '  Default Gateway : 192.168.1.1']},
  {cmd: 'ipconfig /all', output: ['  DHCP Enabled. . : Yes', '  DNS Servers . . : 192.168.1.1']},
  {cmd: 'ping 192.168.1.1', output: ['Reply from 192.168.1.1: bytes=32 time=1ms TTL=64', 'Reply from 192.168.1.1: bytes=32 time=1ms TTL=64', 'Packets: Sent = 4, Received = 4, Lost = 0']},
];

// Factory scenarios (Scene 10).
export const SCENARIO_A = ['TIKET', 'SIASAT', 'SEMAK PC & RANGKAIAN', 'LOKAL ATAU LUAS?', 'ESCALATE'];
export const SCENARIO_B = ['LAPOR', 'STATUS PRINTER', 'SAMBUNGAN & QUEUE', 'TEST PRINT', 'SELESAI'];

// Recap cards (Scene 11).
export const RECAP = [
  {cue: 'membantu', title: 'IT SUPPORT', desc: 'Bantu pengguna selesaikan masalah teknologi'},
  {cue: 'teknologi', title: 'COMMON ISSUES', desc: 'Komputer, internet, printer & software'},
  {cue: 'troubleshooting', title: 'TROUBLESHOOTING', desc: 'Kenal pasti punca sebenar'},
  {cue: 'Identify', title: 'FIVE STEPS', desc: 'Identify • Check • Test • Fix • Verify'},
  {cue: 'escalate', title: 'ESCALATION', desc: 'Rujuk masalah kompleks kepada pakar'},
];

export const TRANSITION_FRAMES = 12;
