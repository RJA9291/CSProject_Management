// Every on-screen text overlay lives here so it can be edited in one place
// (or live in Remotion Studio's props panel) without touching scene code.

export type TeaserContent = {
  hook: {words: string[]; question: string; questionAccent: string};
  threat: {
    scamSender: string;
    scamMessage: string;
    scamLink: string;
    callerLabel: string;
    callerNumber: string;
    parcelApp: string;
    parcelMessage: string;
    bankApp: string;
    bankMessage: string;
    bankLink: string;
    bankButton: string;
    headline: string[];
    exposedLabels: string[];
  };
  reality: {
    cases: number;
    casesLabel: string;
    casesLabelMs: string;
    losses: string;
    lossesLabel: string;
    ageGroup: string;
    ageLabel: string;
    ageBars: {label: string; value: number}[];
    period: string;
    source: string;
    note: string;
  };
  intro: {
    welcome: string;
    title: string;
    notJust: string;
    pillars: string[];
  };
  cliffhanger: {
    question: string;
    title: string;
    ready: string;
    soon: string;
    series: string;
  };
  // Optional real footage (paths relative to /public). Leave empty to use the
  // built-in motion-graphics versions of each shot. See docs/ASSET_CHECKLIST.md.
  footage: {
    heroScrolling: string;
    hesitationCloseUp: string;
  };
};

export const DEFAULT_CONTENT: TeaserContent = {
  hook: {
    words: ['CLICK.', 'SCROLL.', 'SHOP.', 'TRANSFER.', 'SHARE.'],
    question: 'BUT... ARE YOU',
    questionAccent: 'REALLY SAFE?',
  },
  threat: {
    scamSender: '+60 11-2•••• ••87',
    scamMessage: 'Tahniah! Anda layak menerima baucar tunai RM500. Tuntut dalam 24 jam:',
    scamLink: 'hxxp://baucar-rm500[.]example',
    callerLabel: 'Nombor Tidak Dikenali',
    callerNumber: '+60 3-•••• ••19',
    parcelApp: 'ParcelGo MY',
    parcelMessage: 'Bungkusan anda TERTAHAN. Bayar caj RM1.99 untuk penghantaran semula.',
    bankApp: 'BankKita',
    bankMessage: 'Akaun anda DISEKAT sementara. Sahkan identiti anda segera:',
    bankLink: 'hxxps://bankkita-verify[.]example',
    bankButton: 'SAHKAN SEKARANG',
    headline: ['ONE', 'CLICK', 'CAN CHANGE', 'EVERYTHING.'],
    exposedLabels: ['IC NUMBER', 'PASSWORD', 'OTP', 'BANK ACCOUNT', 'PHOTOS', 'CONTACTS', 'ADDRESS', 'E-WALLET'],
  },
  reality: {
    cases: 28698,
    casesLabel: 'TELECOMMUNICATION CRIME CASES',
    casesLabelMs: 'kes jenayah telekomunikasi',
    losses: 'RM715 MILLION',
    lossesLabel: 'IN LOSSES',
    ageGroup: '21–30',
    ageLabel: 'AGE GROUP WITH THE MOST VICTIMS',
    ageBars: [
      {label: '21–30', value: 8789},
      {label: '31–40', value: 6825},
    ],
    period: 'JAN – NOV 2025',
    source: 'Source: Royal Malaysia Police (PDRM), Commercial Crime Investigation Dept., January–November 2025.',
    note: 'Reported telecommunication crime only — not all cybercrime.',
  },
  intro: {
    welcome: 'WELCOME TO THE WORLD OF',
    title: 'CYBERSECURITY',
    notJust: "IT'S NOT JUST ABOUT HACKERS",
    pillars: ['YOUR IDENTITY.', 'YOUR DATA.', 'YOUR MONEY.', 'YOUR DIGITAL LIFE.'],
  },
  cliffhanger: {
    question: 'ARE YOU REALLY PROTECTED?',
    title: 'CYBERSECURITY',
    ready: 'ARE YOU READY?',
    soon: 'COMING SOON.',
    series: 'EPISODE 01  •  SIRI KESEDARAN KESELAMATAN SIBER',
  },
  footage: {
    heroScrolling: '',
    hesitationCloseUp: '',
  },
};
