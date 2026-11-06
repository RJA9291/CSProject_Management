import type {SceneConfig} from '../../config/scenes';
import {supporterCountWords, supporterList, SUPPORTERS} from './supporters';

// Episode 03 – Cybersecurity Basics. Same rules as Episodes 01–02:
// *asterisks* = red highlight, \n = line break, sfx = fixed-time cues (word-synced cues live in scenes).
// Edit `vo` to change narration (then re-run `npm run audio:vo:ep03`), `text`/`list` to change on-screen copy.

const vo = (n: number) => `audio/ep03/vo/scene${String(n).padStart(2, '0')}.mp3`;

export const SCENES: SceneConfig[] = [
  {
    id: 'Ep03Scene01Hook',
    name: 'Hook',
    minSeconds: 6,
    padSeconds: 0.5,
    voDelay: 0.6,
    vo: 'Pernah tak terima SMS daripada bank yang suruh kita klik pautan untuk elakkan akaun disekat? Hati-hati! Mungkin itu scam!',
    voFile: vo(1),
    text: {
      line1: 'TERIMA *SMS BANK?*',
      line2: 'PAUTAN *MENCURIGAKAN?*',
      line3: 'JANGAN TERUS KLIK!',
      sender: 'BANK MALAYSIA',
      sms: 'Akaun anda akan DISEKAT hari ini! Klik pautan untuk elak sekatan:',
      link: 'bank-malaysia-verify.contoh',
      fiction: 'CONTOH FIKSYEN',
    },
    sfx: [{at: 0.1, sfx: 'whoosh'}],
  },
  {
    id: 'Ep03Scene02Greeting',
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
    id: 'Ep03Scene03Supporters',
    name: 'Terima Kasih Gift Kek',
    minSeconds: 8,
    padSeconds: 0.6,
    voDelay: 0.3,
    vo: `Sebelum kita mula, terima kasih kepada ${supporterCountWords()} yang sudi belanja Gift Kek! Terima kasih ${supporterList()}. Sokongan anda membuatkan saya lebih bersemangat untuk terus berkongsi ilmu!`,
    voFile: vo(3),
    text: {headline: '*TERIMA KASIH!*', sub: `${SUPPORTERS.length} PENYUMBANG GIFT KEK`},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep03Scene04WhatIs',
    name: 'Apa Itu Cybersecurity',
    minSeconds: 8,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Cybersecurity ialah usaha melindungi sistem, rangkaian dan data daripada ancaman atau serangan digital.',
    voFile: vo(4),
    text: {
      headline: 'APA ITU\n*CYBERSECURITY?*',
      sub: 'Protect Systems, Data & Digital Accounts',
      threat: 'ANCAMAN DIGITAL',
    },
    list: ['SISTEM', 'RANGKAIAN', 'DATA'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep03Scene05Threats',
    name: '3 Ancaman Siber',
    minSeconds: 7,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Ada tiga ancaman yang kita perlu kenal. Phishing, iaitu cubaan mencuri maklumat. Malware, iaitu perisian berbahaya. Dan ransomware, yang boleh mengunci data serta menuntut bayaran tebusan.',
    voFile: vo(5),
    text: {headline: 'KENALI *3 ANCAMAN*\nSIBER'},
    sfx: [{at: 0.2, sfx: 'alert'}],
  },
  {
    id: 'Ep03Scene06Phishing',
    name: 'Contoh Phishing',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Bayangkan anda menerima mesej seperti ini. Kononnya akaun bank akan disekat jika tidak mengemas kini maklumat. Ini ialah contoh phishing. Scammer cuba membuatkan kita panik supaya kita bertindak tanpa berfikir.',
    voFile: vo(6),
    text: {
      headline: 'BAYANGKAN ANDA\nTERIMA *MESEJ INI...*',
      reveal: 'INI CONTOH\n*PHISHING!*',
      sender: 'BANK MALAYSIA',
      sms: 'BANK MALAYSIA:\nAkaun anda akan disekat.\nSila kemas kini maklumat sekarang.',
      link: 'bank-malaysia-verify.contoh',
      button: 'KLIK DI SINI',
      fiction: 'CONTOH FIKSYEN • JANGAN KLIK',
      panic: 'SEGERA!',
    },
    sfx: [{at: 0.4, sfx: 'notify'}],
  },
  {
    id: 'Ep03Scene07StopCheckVerify',
    name: 'Berhenti Semak Sahkan',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Jadi, apa yang perlu kita buat? Pertama, berhenti. Jangan terus klik. Kedua, semak pengirim dan alamat laman web. Ketiga, sahkan maklumat melalui saluran rasmi bank atau organisasi berkenaan.',
    voFile: vo(7),
    text: {headline: 'BERHENTI • SEMAK • SAHKAN'},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep03Scene08PasswordMFA',
    name: 'Password & MFA',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Untuk melindungi akaun pula, gunakan password yang kuat dan berbeza bagi setiap akaun. Aktifkan Multi-Factor Authentication atau MFA. Dan ingat, jangan sesekali kongsi OTP atau PIN dengan orang lain.',
    voFile: vo(8),
    text: {headline: 'PASSWORD UNIK *+ MFA*', warning: 'JANGAN KONGSI *OTP / PIN!*'},
    list: ['Password *kuat & unik*', 'Jangan guna semula', 'Guna password manager', 'Aktifkan *MFA*', 'Jangan kongsi *OTP / PIN*'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep03Scene09Hygiene',
    name: 'Amalan Harian',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Amalkan keselamatan siber setiap hari. Sentiasa kemas kini perisian, buat backup, muat turun aplikasi daripada sumber rasmi dan pastikan peranti anda dilindungi.',
    voFile: vo(9),
    text: {headline: 'AMALAN KESELAMATAN\n*SIBER HARIAN*'},
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
  {
    id: 'Ep03Scene10Victim',
    name: 'Jika Jadi Mangsa',
    minSeconds: 10,
    padSeconds: 0.6,
    voDelay: 0.3,
    vo: 'Kalau anda sudah menjadi mangsa scam, jangan tunggu. Hubungi bank dengan segera, hubungi NSRC melalui talian 997, buat laporan polis dan simpan semua bukti transaksi atau mesej.',
    voFile: vo(10),
    text: {
      headline: 'SUDAH TERKENA *SCAM?*',
      sub: 'INI TINDAKAN SEGERA!',
      alert: 'TRANSAKSI TIDAK DIKENALI',
      amount: '- RM 2,500.00',
      note: 'Semak maklumat terkini di\nlaman rasmi NSRC / PDRM / BNM',
    },
    sfx: [{at: 0.3, sfx: 'alert'}],
  },
  {
    id: 'Ep03Scene11Recap',
    name: 'Recap',
    minSeconds: 10,
    padSeconds: 0.5,
    voDelay: 0.3,
    vo: 'Jom kita recap! Kenali phishing, jangan kongsi OTP, gunakan MFA dan sentiasa kemas kini peranti anda. Ingat, keselamatan digital bermula dengan tindakan kita sendiri.',
    voFile: vo(11),
    text: {headline: "JOM RECAP!"},
    list: ['Lindungi sistem & data', 'Elak pautan mencurigakan', 'Guna password kuat', 'Kemas kini aplikasi', 'Sahkan melalui saluran rasmi'],
    sfx: [{at: 0.1, sfx: 'pop'}],
  },
  {
    id: 'Ep03Scene12CTA',
    name: 'Penutup & CTA',
    minSeconds: 15,
    padSeconds: 1.6,
    voDelay: 0.3,
    vo: 'Terima kasih kerana belajar bersama saya! Kalau perkongsian ini bermanfaat, jangan lupa Like, Share dan Follow untuk lebih banyak video pembelajaran menarik selepas ini. Dan kepada yang ingin menyokong perkongsian ilmu ini dengan Gift Kek, sokongan anda amatlah dihargai. Jumpa lagi!',
    voFile: vo(12),
    text: {
      headline: 'TERIMA KASIH\nKERANA BELAJAR\n*BERSAMA SAYA!*',
      gift: '*GIFT KEK* AMAT DIHARGAI',
      footer: 'JUMPA LAGI DALAM\n*VIDEO SETERUSNYA!*',
    },
    list: ['LIKE', 'SHARE', 'FOLLOW'],
    sfx: [{at: 0.2, sfx: 'pop'}],
  },
];

// Threat cards (Scene 05).
export const THREATS = [
  {cue: 'Phishing', title: 'PHISHING', desc: 'Cubaan mencuri maklumat\n(social engineering)'},
  {cue: 'Malware', title: 'MALWARE', desc: 'Perisian berbahaya\n(virus, spyware, trojan)'},
  {cue: 'ransomware', title: 'RANSOMWARE', desc: 'Kunci data & sistem,\ntuntut bayaran tebusan'},
];

// Stop / Check / Verify cards (Scene 07).
export const STEPS = [
  {cue: 'berhenti', title: 'BERHENTI', desc: 'Jangan terus klik pautan\nyang mencurigakan.'},
  {cue: 'semak', title: 'SEMAK', desc: 'Semak pengirim dan\nalamat laman web.'},
  {cue: 'sahkan', title: 'SAHKAN', desc: 'Hubungi organisasi melalui\nsaluran rasmi sahaja.'},
];

// Daily hygiene cards (Scene 09).
export const HYGIENE = [
  {cue: 'kemas', title: 'UPDATE', desc: 'Kemas kini perisian\n& aplikasi'},
  {cue: 'backup', title: 'BACKUP', desc: 'Simpan salinan\ndata penting'},
  {cue: 'muat', title: 'OFFICIAL DOWNLOAD', desc: 'Muat turun daripada\nsumber rasmi'},
  {cue: 'peranti', title: 'DEVICE SECURITY', desc: 'Kunci skrin\n& biometrik'},
];

// Victim response actions (Scene 10). Verified Nov 2026: NSRC hotline 997 (PDRM-led, with BNM).
export const ACTIONS = [
  {cue: 'bank', title: 'HUBUNGI BANK SEGERA', desc: 'Minta bank sekat akaun / kad'},
  {cue: 'NSRC', title: 'HUBUNGI NSRC', desc: 'National Scam Response Centre', big: '997'},
  {cue: 'laporan', title: 'BUAT LAPORAN POLIS', desc: 'Di balai polis berdekatan'},
  {cue: 'simpan', title: 'SIMPAN BUKTI', desc: 'Screenshot, resit & mesej'},
];

// Recap cards (Scene 11).
export const RECAP = [
  {cue: 'Kenali', title: 'KENALI PHISHING'},
  {cue: 'OTP', title: 'JANGAN KONGSI OTP'},
  {cue: 'MFA', title: 'GUNA MFA & UPDATE'},
];

export const TRANSITION_FRAMES = 12;
