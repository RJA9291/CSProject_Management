import type {SceneConfig} from '../../config/scenes';
import {supporterList} from './supporters';

// Episode 02 – Cloud Computing. Same rules as Episode 01:
// *asterisks* = red highlight, \n = line break, sfx = fixed-time cues (word-synced cues live in scenes).

const vo = (n: number) => `audio/ep02/vo/scene${String(n).padStart(2, '0')}.mp3`;

export const SCENES: SceneConfig[] = [
  {
    id: 'Ep02Scene01Hook',
    name: 'Hook',
    minSeconds: 5,
    padSeconds: 0.5,
    voDelay: 0.5,
    vo: 'Pernah guna Google Drive, Gmail atau Netflix? Tahu tak, data anda sebenarnya disimpan di mana?',
    voFile: vo(1),
    text: {
      headline: 'PERNAH GUNA\n*GOOGLE DRIVE?*',
      question: 'TAHU TAK *DATA* ANDA\n*DISIMPAN* DI MANA?',
    },
    sfx: [{at: 0.1, sfx: 'whoosh'}],
  },
  {
    id: 'Ep02Scene02Greeting',
    name: 'Salam',
    minSeconds: 5,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Assalamualaikum dan hai semua! Jom, mari sama-sama belajar!',
    voFile: vo(2),
    text: {headline: 'ASSALAMUALAIKUM!', sub: 'MARI SAMA-SAMA\n*BELAJAR!*'},
    sfx: [
      {at: 0.2, sfx: 'pop'},
      {at: 1.2, sfx: 'sparkle'},
    ],
  },
  {
    id: 'Ep02Scene03Supporters',
    name: 'Terima Kasih Supporters',
    minSeconds: 9,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: `Terima kasih istimewa kepada empat supporters yang belanja Gift Kek: ${supporterList()}! Sokongan anda buat saya lebih bersemangat berkongsi ilmu.`,
    voFile: vo(3),
    text: {headline: '*TERIMA KASIH*\nSUPPORTERS!', sub: '4 GIFT KEK CONTRIBUTORS'},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep02Scene04Topic',
    name: 'Topik Hari Ini',
    minSeconds: 5,
    padSeconds: 0.5,
    voDelay: 0.5,
    vo: 'Hari ini kita belajar tentang Cloud Computing, teknologi yang kita guna hampir setiap hari!',
    voFile: vo(4),
    text: {
      label: "TODAY'S TOPIC",
      headline: '*CLOUD*\nCOMPUTING',
      sub: 'Understanding the Technology\nBehind Everyday Applications',
    },
    sfx: [{at: 0.1, sfx: 'whoosh'}],
  },
  {
    id: 'Ep02Scene05WhatIs',
    name: 'Apa Itu Cloud Computing',
    minSeconds: 7,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Cloud Computing ialah penggunaan perkhidmatan seperti server, storage, database dan software melalui internet, tanpa perlu miliki server sendiri.',
    voFile: vo(5),
    text: {
      headline: 'WHAT IS\n*CLOUD COMPUTING?*',
      definition: 'Computing services delivered\nover the *internet*.',
      malay: 'Penggunaan sumber pengkomputeran melalui internet tanpa perlu memiliki semua infrastruktur sendiri.',
    },
    list: ['Server', 'Storage', 'Database', 'Software'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep02Scene06Everyday',
    name: 'Contoh Harian',
    minSeconds: 9,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Contohnya, seorang pelajar simpan assignment dalam Google Drive guna laptop di universiti. Balik rumah, dia sambung guna telefon, sebab fail itu disimpan dalam cloud.',
    voFile: vo(6),
    text: {
      headline: 'CONTOH DALAM\n*KEHIDUPAN HARIAN*',
      flow: 'Save → Cloud → Access Anywhere',
      ending: 'ONE FILE.\n*MULTIPLE DEVICES.*',
      placeA: 'UNIVERSITI',
      placeB: 'RUMAH',
    },
    list: ['Simpan di laptop', 'Disimpan dalam cloud', 'Balik rumah', 'Sambung guna telefon'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep02Scene07ServiceModels',
    name: 'IaaS PaaS SaaS',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Ada tiga model perkhidmatan. IaaS, sewa infrastruktur seperti server dan storage. PaaS, platform untuk bina aplikasi. SaaS, software sedia guna seperti Gmail dan Microsoft 365.',
    voFile: vo(7),
    text: {headline: '3 MODEL\n*PERKHIDMATAN*'},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep02Scene08Deployment',
    name: 'Deployment Models',
    minSeconds: 7,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Dari segi deployment, ada empat model: Public, Private, Hybrid dan Community Cloud, ikut keperluan masing-masing.',
    voFile: vo(8),
    text: {headline: '4 MODEL\n*DEPLOYMENT*', note: 'Keperluan berbeza,\n*model berbeza.*'},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep02Scene09Architecture',
    name: 'Front End & Back End',
    minSeconds: 8,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Cloud ada dua bahagian. Front End ialah bahagian pengguna, seperti laptop dan browser. Back End pula menguruskan server, storage, database dan keselamatan.',
    voFile: vo(9),
    text: {
      headline: '*FRONT END* + *BACK END*',
      front: 'FRONT END – CLIENT SIDE',
      back: 'BACK END – CLOUD SIDE',
    },
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep02Scene10Security',
    name: 'Keselamatan Cloud',
    minSeconds: 7,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Adakah cloud selamat? Tak automatik! Kita perlu password yang kuat, Multi-Factor Authentication, encryption dan access control.',
    voFile: vo(10),
    text: {headline: 'IS CLOUD\n*SECURE?*', warning: 'Tak automatik selamat!'},
    list: [
      'Strong passwords',
      'Multi-Factor Authentication',
      'Data encryption',
      'Access control',
      'Regular backups',
      'Security monitoring',
      'Timely updates',
    ],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep02Scene11Business',
    name: 'Perniagaan Kecil',
    minSeconds: 8,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Peniaga kecil pula boleh semak stok dan jualan guna laptop di kedai atau telefon di luar, selagi ada internet dan servis cloud berfungsi.',
    voFile: vo(11),
    text: {
      headline: 'CONTOH:\n*PERNIAGAAN KECIL*',
      banner: 'Manage Your Business *Anywhere*',
      shop: 'KEDAI',
      caveat: 'Perlu internet + servis aktif',
    },
    list: ['Inventori', 'Database', 'Storage', 'Akaun'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep02Scene12Recap',
    name: 'Recap',
    minSeconds: 7,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Jom recap! Cloud Computing ialah servis pengkomputeran melalui internet. IaaS infrastruktur, PaaS platform, SaaS software, dan empat deployment models.',
    voFile: vo(12),
    text: {headline: "LET'S RECAP!"},
    sfx: [{at: 0.1, sfx: 'pop'}],
  },
  {
    id: 'Ep02Scene13Closing',
    name: 'Mesej Penutup',
    minSeconds: 5,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Semoga anda lebih faham asas Cloud Computing. Teruskan belajar sedikit demi sedikit!',
    voFile: vo(13),
    text: {line1: 'LEARN *TODAY*...', line2: 'BUILD *TOMORROW*...'},
    sfx: [{at: 0.2, sfx: 'sparkle'}],
  },
  {
    id: 'Ep02Scene14CTA',
    name: 'Penutup & CTA',
    minSeconds: 8,
    padSeconds: 1.6,
    voDelay: 0.3,
    vo: 'Terima kasih kerana menonton! Jangan lupa Like, Share dan Follow. Nak sokong dengan Gift Kek? Sokongan anda amat dihargai. Jumpa lagi!',
    voFile: vo(14),
    text: {
      headline: 'TERIMA KASIH KERANA\n*BELAJAR BERSAMA!*',
      gift: 'SUPPORT DENGAN *GIFT KEK*',
      footer: 'JUMPA LAGI DALAM\n*VIDEO SETERUSNYA!*',
    },
    list: ['LIKE', 'SHARE', 'FOLLOW'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
];

// IaaS / PaaS / SaaS cards (Scene 07).
export const SERVICE_MODELS = [
  {short: 'IaaS', long: 'INFRASTRUCTURE\nAS A SERVICE', malay: 'Sewa infrastruktur IT.', example: 'Contoh: Amazon EC2'},
  {short: 'PaaS', long: 'PLATFORM\nAS A SERVICE', malay: 'Platform untuk membangunkan aplikasi.', example: 'Contoh: Google App Engine'},
  {short: 'SaaS', long: 'SOFTWARE\nAS A SERVICE', malay: 'Software yang terus boleh digunakan.', example: 'Contoh: Gmail, Microsoft 365'},
];

// Deployment model cards (Scene 08).
export const DEPLOYMENT_MODELS = [
  {name: 'PUBLIC CLOUD', desc: 'Infrastruktur provider dikongsi ramai pengguna.', example: 'Cth: AWS, Microsoft Azure'},
  {name: 'PRIVATE CLOUD', desc: 'Khusus untuk satu organisasi sahaja.', example: ''},
  {name: 'HYBRID CLOUD', desc: 'Gabungan public dan private cloud.', example: ''},
  {name: 'COMMUNITY CLOUD', desc: 'Dikongsi organisasi dengan keperluan sama.', example: ''},
];

// Front-end / back-end labels (Scene 09).
export const ARCHITECTURE = {
  front: ['Laptop', 'Smartphone', 'Browser', 'Apps'],
  back: ['Server', 'Storage', 'Database', 'Virtualization', 'Security'],
};

// Recap cards (Scene 12).
export const RECAP = [
  {title: 'CLOUD COMPUTING', desc: 'Computing services over the internet'},
  {title: 'IaaS', desc: 'Infrastructure'},
  {title: 'PaaS', desc: 'Development platform'},
  {title: 'SaaS', desc: 'Ready-to-use software'},
  {title: 'DEPLOYMENT MODELS', desc: 'Public, Private, Hybrid, Community'},
];

export const TRANSITION_FRAMES = 12;
