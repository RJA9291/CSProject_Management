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
  helmet: string; // '' = no helmet (office roles)
  corporate?: boolean; // office shirt: no reflective stripes, white collar/cuffs
  tie?: boolean;
  vest?: string; // hi-vis vest colour
  badge?: string; // department badge / helmet sticker colour (default M&F orange)
  dept?: string; // department (Episode 02+); default Maintenance & Facilities
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
    corporate: true,
    tie: true,
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

// ---- Episode 02 supporting cast (other departments). Department uniform and helmet
// colours are PLACEHOLDERS until confirmed; they are chosen to read clearly against the
// Maintenance & Facilities navy/orange uniform. No names; roles only.
const GREY = '#5f6b78';
export const CAST_EP02: CharacterSpec[] = [
  {id: 'newtech', role: 'TECHNICIAN BAHARU', roleMs: 'Technician Maintenance & Facilities yang baru menyertai kilang', skin: '#b07a55', hair: 'crew', hairColor: '#17110c', build: 0.98, height: 1.7,
    shirt: UNIFORM.navy, shirtAccent: UNIFORM.orange, trousers: UNIFORM.navyDark, helmet: HELMET.technician, accessories: ['toolBelt', 'safetyGlasses', 'workGloves'], pose: 'tool'},
  {id: 'operator1', role: 'OPERATOR PRODUCTION', roleMs: 'Pemasangan & pengeluaran', skin: '#9a6a48', hair: 'short', hairColor: '#120d0a', build: 1.0, height: 1.71, dept: 'Production',
    shirt: GREY, shirtAccent: '#3d9b5a', trousers: '#2b3038', helmet: '#3d9b5a', badge: '#3d9b5a', accessories: ['workGloves', 'safetyGlasses'], pose: 'tool'},
  {id: 'operator2', role: 'OPERATOR PRODUCTION', roleMs: 'Pemasangan & pengeluaran', skin: '#c99470', hair: 'tudung', hairColor: '#111', tudungColor: '#2e4f3b', build: 0.9, height: 1.6, dept: 'Production',
    shirt: GREY, shirtAccent: '#3d9b5a', trousers: '#2b3038', helmet: '#3d9b5a', badge: '#3d9b5a', accessories: ['workGloves', 'safetyGlasses'], pose: 'tool'},
  {id: 'quality', role: 'QUALITY', roleMs: 'Pemeriksaan & pengesahan produk', skin: '#d9ab86', hair: 'short', hairColor: '#0f0c0a', build: 0.96, height: 1.69, dept: 'Quality',
    shirt: '#cfdbe8', shirtAccent: '#2f6fd6', trousers: '#2b3038', helmet: '#8fc7ff', badge: '#2f6fd6', accessories: ['tablet', 'lanyard', 'safetyGlasses'], pose: 'tablet'},
  {id: 'logistics', role: 'LOGISTICS', roleMs: 'Pergerakan bahan, alat ganti & produk', skin: '#8a5a3c', hair: 'short', hairColor: '#0e0b09', moustache: true, build: 1.06, height: 1.72, dept: 'Logistics',
    shirt: GREY, shirtAccent: '#ff7a1a', trousers: '#2b3038', helmet: '#ff8c1a', vest: '#ff7a1a', badge: '#ff7a1a', accessories: ['workGloves'], pose: 'tool'},
  {id: 'ppc', role: 'PPC', roleMs: 'Perancangan & kawalan pengeluaran', skin: '#c48f6a', hair: 'tudung', hairColor: '#111', tudungColor: '#6b2a3a', build: 0.9, height: 1.6, dept: 'PPC',
    shirt: '#e4ebf3', shirtAccent: '#6b2a3a', trousers: '#2a2f38', helmet: '', corporate: true, badge: '#6b2a3a', accessories: ['tablet', 'lanyard'], pose: 'tablet'},
  {id: 'engineering', role: 'ENGINEERING', roleMs: 'Pembangunan & penambahbaikan proses', skin: '#e0b592', hair: 'short', hairColor: '#0d0b0a', build: 0.97, height: 1.73, dept: 'Engineering',
    shirt: '#3b4350', shirtAccent: '#7fd6ff', trousers: '#22272f', helmet: HELMET.management, badge: '#7fd6ff', accessories: ['tablet', 'drawingRoll', 'lanyard', 'glasses'], pose: 'tablet'},
  {id: 'safety', role: 'SAFETY', roleMs: 'Kerja selamat, PPE & prosedur', skin: '#a8714c', hair: 'short', hairColor: '#120e0b', beard: true, build: 1.02, height: 1.74, dept: 'Safety',
    shirt: '#2c3440', shirtAccent: '#c6f432', trousers: '#22272f', helmet: '#d93636', vest: '#c6f432', badge: '#d93636', accessories: ['clipboard', 'lanyard', 'safetyGlasses'], pose: 'clipboard'},
  {id: 'qms', role: 'QMS', roleMs: 'Sistem pengurusan kualiti: prosedur, dokumentasi & audit', skin: '#bd8763', hair: 'short', hairColor: '#15100c', build: 0.98, height: 1.7, dept: 'QMS',
    shirt: '#dfe7ef', shirtAccent: '#2a4a6a', trousers: '#2a2f38', helmet: '', corporate: true, badge: '#2a4a6a', accessories: ['tablet', 'lanyard', 'glasses'], pose: 'tablet'},
];

export const byId = (id: string) => {
  const c = CHARACTERS.find((x) => x.id === id) ?? CAST_EP02.find((x) => x.id === id);
  if (!c) throw new Error(`unknown character ${id}`);
  return c;
};
