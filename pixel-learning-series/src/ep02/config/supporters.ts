// Gift Kek supporters thanked in Scene 03 and the closing. PLACEHOLDER names: replace before publishing.
// handle: shown on screen (without @)
// spoken: how the narrator says it (re-run `npm run audio:vo:ep02` after changing)
// avatar: one of boy-blue, boy-cap, boy-glasses, hijab-pink, hijab-teal, hijab-purple
// image: optional square PNG in public/ (e.g. 'avatars/ahmad.png') used instead of the pixel avatar
export type Supporter = {handle: string; spoken: string; avatar: string; image?: string};

export const SUPPORTERS: Supporter[] = [
  {handle: 'AhmadFitri89', spoken: 'Ahmad Fitri', avatar: 'boy-blue'},
  {handle: 'SitiAisyahMY', spoken: 'Siti Aisyah', avatar: 'hijab-pink'},
  {handle: 'KamarulTech', spoken: 'Kamarul Tech', avatar: 'boy-cap'},
  {handle: 'NurulHuda92', spoken: 'Nurul Huda', avatar: 'hijab-teal'},
];

// "A, B, C dan D" for narration and subtitles.
export const supporterList = () => {
  const h = SUPPORTERS.map((s) => s.handle);
  return h.length > 1 ? `${h.slice(0, -1).join(', ')} dan ${h[h.length - 1]}` : h.join('');
};
