// Scene ranges (frames @30 fps). Phase 3 uses the timings proposed in pre-production;
// Phase 4 re-times them to the recorded / generated narration.
export const FPS = 30;
export const SCENES = [
  {id: 1, name: 'Kilang yang tidak pernah berhenti', from: 0, len: 450},
  {id: 2, name: 'Pasukan di sebalik operasi', from: 450, len: 540},
  {id: 3, name: 'Mengenali department', from: 990, len: 360},
  {id: 4, name: 'Struktur organisasi', from: 1350, len: 810},
  {id: 5, name: 'Keperluan kemahiran yang berbeza', from: 2160, len: 570},
  {id: 6, name: 'Bukan sekadar kerja teknikal', from: 2730, len: 780},
  {id: 7, name: 'Dokumentasi dan pematuhan', from: 3510, len: 540},
  {id: 8, name: 'Satu pasukan, satu matlamat', from: 4050, len: 450},
] as const;
export const TOTAL = 4500;
