// Character bible – the single source of truth for every character's look.
// Every scene renders characters from these specs, so faces, uniforms, body shape
// and accessories cannot drift between scenes.
//
// Items marked PLACEHOLDER need confirmation from the organisation
// (uniform colours, helmet colour code, logo).

export type Accessory =
  | 'tablet'
  | 'clipboard'
  | 'file'
  | 'drawingRoll'
  | 'lanyard'
  | 'toolBelt'
  | 'multimeter'
  | 'insulatedGloves'
  | 'wrench'
  | 'workGloves'
  | 'weldingShield'
  | 'leatherApron'
  | 'safetyGlasses'
  | 'glasses';

export type Hair = 'short' | 'bob' | 'tudung' | 'crew';

export type CharacterSpec = {
  id: string;
  role: string; // on-screen role title
  roleMs: string; // short Malay description
  skin: string;
  hair: Hair;
  hairColor: string;
  moustache?: boolean;
  beard?: boolean;
  build: number; // 1 = average, >1 broader
  height: number; // metres
  shirt: string;
  shirtAccent: string; // yoke / accent panel
  trousers: string;
  helmet: string;
  tudungColor?: string;
  accessories: Accessory[];
  pose: 'leader' | 'tablet' | 'clipboard' | 'tool' | 'weld';
};

// ---- department palette (PLACEHOLDER – confirm against actual uniform)
export const UNIFORM = {
  navy: '#1f3a5f', // department work shirt
  navyDark: '#18222f', // trousers
  orange: '#e8771e', // accent yoke
  reflective: '#d9dde3',
  corporateShirt: '#d6e4f2', // manager corporate shirt
};

// ---- helmet colour code (PLACEHOLDER – many plants use their own code)
export const HELMET = {
  management: '#f4f5f7', // white – Manager, Engineer
  assistant: '#2f6fd6', // blue – Assistant Engineer
  technician: '#f2c230', // yellow – Technicians
};

export const CHARACTERS: CharacterSpec[] = [
  {
    id: 'manager',
    role: 'MANAGER',
    roleMs: 'Mengetuai department · hala tuju, sumber & prestasi',
    skin: '#b9825c',
    hair: 'short',
    hairColor: '#1b1612',
    moustache: true,
    build: 1.08,
    height: 1.74,
    shirt: UNIFORM.corporateShirt,
    shirtAccent: UNIFORM.navy,
    trousers: '#232b36',
    helmet: HELMET.management,
    accessories: ['tablet', 'glasses', 'lanyard'],
    pose: 'leader',
  },
  {
    id: 'engineer',
    role: 'ENGINEER',
    roleMs: 'Menyelaras aktiviti teknikal, strategi & penambahbaikan',
    skin: '#e2b896',
    hair: 'bob',
    hairColor: '#120f0d',
    build: 0.92,
    height: 1.63,
    shirt: UNIFORM.navy,
    shirtAccent: UNIFORM.orange,
    trousers: UNIFORM.navyDark,
    helmet: HELMET.management,
    accessories: ['tablet', 'drawingRoll', 'lanyard', 'safetyGlasses'],
    pose: 'tablet',
  },
  {
    id: 'assistant',
    role: 'ASSISTANT ENGINEER',
    roleMs: 'Pemeriksaan, pemantauan, koordinasi & dokumentasi',
    skin: '#c99470',
    hair: 'tudung',
    hairColor: '#111',
    tudungColor: '#24364f',
    build: 0.9,
    height: 1.6,
    shirt: UNIFORM.navy,
    shirtAccent: UNIFORM.orange,
    trousers: UNIFORM.navyDark,
    helmet: HELMET.assistant,
    accessories: ['clipboard', 'lanyard', 'safetyGlasses'],
    pose: 'clipboard',
  },
  {
    id: 'electrical',
    role: 'ELECTRICAL TECHNICIAN',
    roleMs: 'Sistem elektrik, pendawaian & distribution board',
    skin: '#7a4b32',
    hair: 'short',
    hairColor: '#0e0b09',
    moustache: true,
    build: 1.0,
    height: 1.72,
    shirt: UNIFORM.navy,
    shirtAccent: UNIFORM.orange,
    trousers: UNIFORM.navyDark,
    helmet: HELMET.technician,
    accessories: ['toolBelt', 'multimeter', 'insulatedGloves', 'safetyGlasses'],
    pose: 'tool',
  },
  {
    id: 'mechanical',
    role: 'MECHANICAL TECHNICIAN',
    roleMs: 'Mesin, komponen mekanikal & troubleshooting',
    skin: '#a8714c',
    hair: 'crew',
    hairColor: '#1a1410',
    beard: true,
    build: 1.05,
    height: 1.7,
    shirt: UNIFORM.navy,
    shirtAccent: UNIFORM.orange,
    trousers: UNIFORM.navyDark,
    helmet: HELMET.technician,
    accessories: ['toolBelt', 'wrench', 'workGloves', 'safetyGlasses'],
    pose: 'tool',
  },
  {
    id: 'welding',
    role: 'WELDING TECHNICIAN',
    roleMs: 'Kerja fabrikasi & welding',
    skin: '#9a6545',
    hair: 'short',
    hairColor: '#15100c',
    build: 1.15,
    height: 1.73,
    shirt: UNIFORM.navy,
    shirtAccent: UNIFORM.orange,
    trousers: UNIFORM.navyDark,
    helmet: HELMET.technician,
    accessories: ['toolBelt', 'weldingShield', 'leatherApron', 'workGloves'],
    pose: 'weld',
  },
];

export const byId = (id: string) => {
  const c = CHARACTERS.find((x) => x.id === id);
  if (!c) throw new Error(`unknown character ${id}`);
  return c;
};
