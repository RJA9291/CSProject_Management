import type {SfxName} from './audio';

// Words wrapped in *asterisks* render in highlight red.
// `sfx` cues are fixed times; cues tied to narration words are added inside each scene.
export type SfxCue = {at: number; sfx: SfxName};

export type SceneConfig = {
  id: string;
  name: string;
  // Storyboard length; the scene stretches if its voice-over runs longer.
  minSeconds: number;
  // Silence kept after the voice-over ends (must exceed the transition length).
  padSeconds: number;
  // Delay before the voice-over starts.
  voDelay: number;
  vo: string;
  // Optional respelling sent to the TTS engine when pronunciation needs help.
  tts?: string;
  voFile: string;
  text: Record<string, string>;
  list?: string[];
  sfx: SfxCue[];
};

const vo = (n: number) => `audio/vo/scene${String(n).padStart(2, '0')}.mp3`;

export const SCENES: SceneConfig[] = [
  {
    id: 'Scene01Hook',
    name: 'Hook',
    minSeconds: 5,
    padSeconds: 1.2,
    voDelay: 0.6,
    vo: 'Minat nak ceburi bidang IT?',
    tts: 'Minat nak ceburi bidang I.T.?',
    voFile: vo(1),
    text: {headline: 'MINAT\nBIDANG *IT?*'},
    sfx: [
      {at: 0.1, sfx: 'whoosh'},
      {at: 0.9, sfx: 'pop'},
      {at: 1.4, sfx: 'blip'},
    ],
  },
  {
    id: 'Scene02Problem',
    name: 'Masalah',
    minSeconds: 5,
    padSeconds: 0.9,
    voDelay: 0.3,
    vo: 'Tapi tak tahu nak mula dari mana?',
    voFile: vo(2),
    text: {headline: 'TAPI TAK TAHU\nNAK MULA\n*DARI MANA?*'},
    list: ['Networking?', 'Security?', 'Developer?'],
    sfx: [
      {at: 1.0, sfx: 'pop'},
      {at: 1.6, sfx: 'pop'},
      {at: 2.2, sfx: 'pop'},
    ],
  },
  {
    id: 'Scene03Greeting',
    name: 'Salam',
    minSeconds: 5,
    padSeconds: 0.8,
    voDelay: 0.3,
    vo: 'Assalamualaikum dan hai semua! Jom, mari sama-sama belajar!',
    voFile: vo(3),
    text: {headline: 'ASSALAMUALAIKUM!', sub: 'MARI SAMA-SAMA\n*BELAJAR!*'},
    sfx: [
      {at: 0.2, sfx: 'pop'},
      {at: 1.2, sfx: 'sparkle'},
      {at: 2.4, sfx: 'pop'},
    ],
  },
  {
    id: 'Scene04Gift',
    name: 'Penghargaan',
    minSeconds: 5,
    padSeconds: 0.8,
    voDelay: 0.3,
    vo: 'Sebelum kita mula, terima kasih kepada semua yang sudi belanja Gift Kek. Gift anda membuatkan saya lebih bersemangat untuk terus berkongsi ilmu!',
    voFile: vo(4),
    text: {headline: '*TERIMA KASIH*\nKEPADA YANG BELANJA\n*GIFT KEK!*'},
    sfx: [
      {at: 0.4, sfx: 'pop'},
      {at: 1.2, sfx: 'sparkle'},
    ],
  },
  {
    id: 'Scene05Introduction',
    name: 'Pengenalan Topik',
    minSeconds: 8,
    padSeconds: 0.8,
    voDelay: 0.4,
    vo: 'Hari ini kita nak kenali satu roadmap kerjaya IT yang menarik, iaitu Linux Foundation Certified IT Associate atau LFCA.',
    tts: 'Hari ini kita nak kenali satu roadmap kerjaya I.T. yang menarik, iaitu Linux Foundation Certified I.T. Associate, atau L.F.C.A.',
    voFile: vo(5),
    text: {
      headline: 'YOUR *IT*\n*CAREER*\n*ROADMAP*',
      sub: 'LFCA – Linux Foundation\nCertified IT Associate',
    },
    sfx: [
      {at: 0.1, sfx: 'whoosh'},
    ],
  },
  {
    id: 'Scene06LFCA',
    name: 'Apa Itu LFCA',
    minSeconds: 7,
    padSeconds: 0.8,
    voDelay: 0.3,
    vo: 'LFCA ialah pensijilan asas yang membantu kita memahami asas-asas penting dalam dunia teknologi maklumat.',
    tts: 'L.F.C.A. ialah pensijilan asas yang membantu kita memahami asas-asas penting dalam dunia teknologi maklumat.',
    voFile: vo(6),
    text: {
      headline: 'APA ITU *LFCA?*',
      sub: 'Linux Foundation\nCertified IT Associate',
      note: 'Pensijilan *asas* untuk\nmula dalam bidang IT',
    },
    sfx: [
      {at: 0.2, sfx: 'pop'},
      {at: 1.2, sfx: 'whoosh'},
      {at: 2.2, sfx: 'sparkle'},
    ],
  },
  {
    id: 'Scene07Roadmap',
    name: 'Tiga Laluan',
    minSeconds: 7,
    padSeconds: 0.8,
    voDelay: 0.3,
    vo: 'Daripada asas ini, kita boleh meneroka tiga bidang utama dalam dunia IT.',
    tts: 'Daripada asas ini, kita boleh meneroka tiga bidang utama dalam dunia I.T.',
    voFile: vo(7),
    text: {headline: '*3 LALUAN* UTAMA\nKERJAYA IT'},
    list: ['SYSTEMS &\nINFRASTRUCTURE', 'NETWORK &\nSECURITY', 'SOFTWARE\nDEVELOPMENT'],
    sfx: [
      {at: 0.3, sfx: 'pop'},
    ],
  },
  {
    id: 'Scene08Systems',
    name: 'Systems & Infrastructure',
    minSeconds: 10,
    padSeconds: 0.8,
    voDelay: 0.3,
    vo: 'Pertama, Systems and Infrastructure. Kalau korang minat server, cloud computing, database dan pengurusan sistem, ini antara laluan yang boleh diterokai.',
    voFile: vo(8),
    text: {number: '1', title: 'SYSTEMS &\nINFRASTRUCTURE'},
    list: [
      'Big Data Engineer',
      'Cloud Architect',
      'Data Analyst',
      'Database Admin',
      'Site Reliability Engineer',
      'System Administrator',
      'DevOps Engineer',
    ],
    sfx: [{at: 0.2, sfx: 'whoosh'}],
  },
  {
    id: 'Scene09Network',
    name: 'Network & Security',
    minSeconds: 10,
    padSeconds: 0.8,
    voDelay: 0.3,
    vo: 'Kedua, Network and Security. Kalau korang berminat dengan rangkaian komputer, keselamatan sistem dan cybersecurity, bidang ini mungkin sesuai.',
    voFile: vo(9),
    text: {number: '2', title: 'NETWORK &\nSECURITY'},
    list: [
      'Cybersecurity Analyst',
      'DevSecOps Admin',
      'Information Analyst',
      'Network Administrator',
      'NOC Support',
      'Security Engineer',
      'Tester',
    ],
    sfx: [{at: 0.2, sfx: 'whoosh'}],
  },
  {
    id: 'Scene10Software',
    name: 'Software Development',
    minSeconds: 10,
    padSeconds: 0.8,
    voDelay: 0.3,
    vo: 'Ketiga, Software Development. Kalau korang suka coding, membina aplikasi dan menghasilkan sistem, ini laluan yang boleh diterokai.',
    voFile: vo(10),
    text: {number: '3', title: 'SOFTWARE\nDEVELOPMENT'},
    list: [
      'Backend Developer',
      'Data Scientist',
      'Frontend Developer',
      'Fullstack Developer',
      'Mobile Apps Developer',
      'Project Manager',
      'Web Developer',
    ],
    sfx: [{at: 0.2, sfx: 'whoosh'}],
  },
  {
    id: 'Scene11Summary',
    name: 'Ringkasan',
    minSeconds: 8,
    padSeconds: 0.8,
    voDelay: 0.3,
    vo: 'Jadi, mulakan dengan asas, kenali minat dan bina kemahiran sedikit demi sedikit.',
    voFile: vo(11),
    text: {headline: 'RINGKASNYA...'},
    list: ['Mulakan dengan *LFCA*.', 'Kenali *minat* anda.', 'Pilih *laluan* kerjaya.'],
    sfx: [
      {at: 0.1, sfx: 'pop'},
      {at: 0.8, sfx: 'whoosh'},
    ],
  },
  {
    id: 'Scene12Closing',
    name: 'Penutup',
    minSeconds: 10,
    padSeconds: 1.6,
    voDelay: 0.3,
    vo: 'Terima kasih kerana belajar bersama saya! Kalau perkongsian ini bermanfaat, jangan lupa Like, Share dan Follow untuk lebih banyak video pembelajaran menarik selepas ini. Jumpa lagi!',
    voFile: vo(12),
    text: {
      headline: 'TERIMA KASIH\nKERANA BELAJAR\n*BERSAMA SAYA!*',
      footer: 'Jumpa lagi dalam video\npembelajaran seterusnya!',
    },
    list: ['LIKE', 'SHARE', 'FOLLOW'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
];

export const TRANSITION_FRAMES = 12;
