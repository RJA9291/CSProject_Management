import type {SceneConfig} from '../../config/scenes';
import {supporterCountWords, supporterList, SUPPORTERS} from './supporters';

// Episode 04 – Computer Networking Basics. Same rules as Episodes 01–03:
// *asterisks* = red highlight, \n = line break, sfx = fixed-time cues (word-synced cues live in scenes).
// Edit `vo` to change narration (then re-run `npm run audio:vo:ep04`), `text`/`list` for on-screen copy,
// `minSeconds` / `padSeconds` for scene length (a scene always stretches to fit its voice-over).

const vo = (n: number) => `audio/ep04/vo/scene${String(n).padStart(2, '0')}.mp3`;

export const SCENES: SceneConfig[] = [
  {
    id: 'Ep04Scene01Hook',
    name: 'Hook',
    minSeconds: 6,
    padSeconds: 0.5,
    voDelay: 0.5,
    vo: 'Pernah terfikir macam mana telefon kita boleh connect ke internet, hantar mesej dan akses website? Jom kita fahami!',
    voFile: vo(1),
    text: {line1: 'MACAM MANA KITA\nBOLEH *ONLINE?*', line2: 'CHAT, STREAM\n& GUNA *CLOUD?*'},
    sfx: [{at: 0.1, sfx: 'whoosh'}],
  },
  {
    id: 'Ep04Scene02Greeting',
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
    id: 'Ep04Scene03Supporters',
    name: 'Terima Kasih Gift Kek',
    minSeconds: 8,
    padSeconds: 0.6,
    voDelay: 0.3,
    vo: `Sebelum kita mula, saya nak ucapkan terima kasih kepada ${supporterCountWords()} yang sudi belanja Gift Kek! Terima kasih ${supporterList()}! Sokongan anda semua membuatkan saya lebih bersemangat untuk terus berkongsi ilmu. Terima kasih banyak-banyak!`,
    voFile: vo(3),
    text: {headline: '*TERIMA KASIH!*', sub: `${SUPPORTERS.length} PENYUMBANG GIFT KEK`},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep04Scene04WhatIs',
    name: 'Apa Itu Networking',
    minSeconds: 8,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Computer Networking ialah sistem yang menghubungkan beberapa peranti supaya boleh berkomunikasi, bertukar data dan berkongsi sumber seperti printer dan fail.',
    voFile: vo(4),
    text: {
      headline: 'APA ITU\n*COMPUTER NETWORKING?*',
      definition: 'A system that connects devices to\ncommunicate and *share resources.*',
      malay: 'Sistem yang menghubungkan beberapa peranti supaya boleh berkomunikasi dan berkongsi maklumat serta sumber.',
    },
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep04Scene05Types',
    name: 'LAN WAN WLAN',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Ada beberapa jenis rangkaian yang kita perlu tahu. LAN untuk kawasan setempat, WAN untuk kawasan yang lebih luas dan WLAN pula menggunakan sambungan tanpa wayar seperti Wi-Fi.',
    voFile: vo(5),
    text: {headline: 'JENIS *RANGKAIAN*'},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep04Scene06RouterSwitch',
    name: 'Router vs Switch',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Router berfungsi menghubungkan rangkaian yang berbeza dan mengarahkan trafik data antara rangkaian. Switch pula menghubungkan banyak peranti dalam rangkaian LAN supaya boleh berkomunikasi.',
    voFile: vo(6),
    text: {headline: 'ROUTER *vs* SWITCH'},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep04Scene07IPMAC',
    name: 'IP vs MAC Address',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'IP Address ialah alamat logik yang digunakan untuk mengenal pasti peranti dalam rangkaian. MAC Address pula ialah alamat yang dikaitkan dengan network interface peranti. Senang cerita, kedua-duanya memainkan peranan berbeza dalam komunikasi rangkaian.',
    voFile: vo(7),
    text: {headline: 'IP ADDRESS *vs*\nMAC ADDRESS', both: 'PERANAN BERBEZA, *SAMA PENTING*'},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep04Scene08DNSDHCP',
    name: 'DNS & DHCP',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'DNS membantu menukar nama domain seperti website kepada alamat IP. DHCP pula membantu memberikan konfigurasi rangkaian seperti IP Address kepada peranti secara automatik.',
    voFile: vo(8),
    text: {
      dns: 'DNS = *FIND THE IP ADDRESS*',
      dhcp: 'DHCP = *GET THE NETWORK SETTINGS*',
      domain: 'www.example.com',
      ip: '203.0.113.10',
      dnsNote: 'Translates domain names into IP addresses',
      dhcpNote: 'Automatically assigns network configuration',
    },
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep04Scene09DataFlow',
    name: 'Perjalanan Data',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Apabila kita membuka sesuatu website, peranti akan menghantar permintaan melalui rangkaian. Data akan melalui peranti rangkaian seperti switch dan router sebelum sampai ke server destinasi. Server memproses permintaan dan menghantar respons semula kepada pengguna.',
    voFile: vo(9),
    text: {headline: 'HOW DOES\n*DATA TRAVEL?*', request: 'PERMINTAAN', response: 'RESPONS', note: 'Laluan sebenar boleh berbeza'},
    list: ['PERANTI', 'SWITCH / AP', 'ROUTER', 'INTERNET', 'SERVER'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep04Scene10Factory',
    name: 'Contoh Kilang',
    minSeconds: 10,
    padSeconds: 0.6,
    voDelay: 0.3,
    vo: 'Bayangkan sebuah kilang yang mempunyai bahagian Production, QA dan Maintenance. Setiap bahagian mempunyai komputer yang disambungkan kepada rangkaian syarikat. Mereka boleh mengakses sistem dalaman, berkongsi printer dan mendapatkan maklumat daripada server. Inilah contoh penggunaan computer networking dalam operasi sesebuah organisasi.',
    voFile: vo(10),
    text: {
      headline: 'CONTOH NETWORKING\n*DI KILANG*',
      access: 'Akses ikut kebenaran jabatan',
    },
    list: ['PRODUCTION', 'QA', 'MAINTENANCE'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep04Scene11Recap',
    name: 'Recap',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Jom kita recap! LAN, WAN dan WLAN ialah jenis rangkaian. Router menghubungkan rangkaian, switch menghubungkan peranti dalam LAN. IP dan MAC Address membantu komunikasi rangkaian. DNS mencari alamat IP melalui nama domain, manakala DHCP membantu memberikan konfigurasi rangkaian.',
    voFile: vo(11),
    text: {headline: "LET'S RECAP!"},
    sfx: [{at: 0.1, sfx: 'pop'}],
  },
  {
    id: 'Ep04Scene12CTA',
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

// Network type cards (Scene 05).
export const NET_TYPES = [
  {cue: 'LAN', title: 'LAN', full: 'Local Area Network', desc: 'Rangkaian dalam kawasan terhad seperti pejabat, rumah atau sekolah.'},
  {cue: 'WAN', title: 'WAN', full: 'Wide Area Network', desc: 'Rangkaian yang menghubungkan kawasan geografi yang luas.'},
  {cue: 'WLAN', title: 'WLAN', full: 'Wireless Local Area Network', desc: 'Rangkaian kawasan setempat menggunakan sambungan tanpa wayar.'},
];

// Router vs switch (Scene 06).
export const ROUTER_SWITCH = {
  router: {title: 'ROUTER', points: ['Hubungkan rangkaian berbeza', 'Hala data antara rangkaian', 'Biasanya: LAN ↔ Internet']},
  switch: {title: 'SWITCH', points: ['Hubungkan peranti dalam LAN', 'Hantar frame guna MAC address']},
};

// IP vs MAC (Scene 07).
export const ADDRESSES = [
  {cue: 'IP', title: 'IP ADDRESS', what: 'Logical network address', layer: 'Network layer (Layer 3)', example: '192.168.1.10'},
  {cue: 'MAC', title: 'MAC ADDRESS', what: 'Hardware network interface address', layer: 'Data-link layer (Layer 2)', example: '00:1A:2B:3C:4D:5E'},
];

// Recap cards (Scene 11).
export const RECAP = [
  {cue: 'WLAN', title: 'LAN / WAN / WLAN'},
  {cue: 'Router', title: 'ROUTER = CONNECT NETWORKS'},
  {cue: 'switch', title: 'SWITCH = CONNECT DEVICES IN LAN'},
  {cue: 'MAC', title: 'IP & MAC ADDRESS'},
  {cue: 'DNS', title: 'DNS & DHCP'},
];

export const TRANSITION_FRAMES = 12;
