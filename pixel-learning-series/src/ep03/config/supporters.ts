// Gift Kek supporters thanked in Scene 03.
// FICTIONAL PLACEHOLDER usernames (not verified real contributors): replace before publishing.
// Edit this list only: cards, card count, the heading number and the narration all follow it.
// handle: shown on screen (without @)
// spoken: how the narrator says it (re-run `npm run audio:vo:ep03` after changing)
// avatar: one of boy-blue, boy-cap, boy-glasses, hijab-pink, hijab-teal, hijab-purple (pixel avatar, never a photo)
export type Supporter = {handle: string; spoken: string; avatar: string; image?: string};

export const SUPPORTERS: Supporter[] = [
  {handle: 'HafizITMY', spoken: 'Hafiz I.T. M.Y.', avatar: 'boy-glasses'},
  {handle: 'AidaSofea88', spoken: 'Aida Sofea lapan lapan', avatar: 'hijab-teal'},
  {handle: 'RazmanTech', spoken: 'Razman Tech', avatar: 'boy-cap'},
];

// "@A, @B dan @C" for narration and subtitles.
export const supporterList = () => {
  const h = SUPPORTERS.map((s) => `@${s.handle}`);
  return h.length > 1 ? `${h.slice(0, -1).join(', ')} dan ${h[h.length - 1]}` : h.join('');
};

const MALAY_COUNT = ['kosong', 'seorang', 'dua orang', 'tiga orang', 'empat orang', 'lima orang', 'enam orang', 'tujuh orang', 'lapan orang', 'sembilan orang', 'sepuluh orang'];
// "tiga orang" for the narration (falls back to the digit for large lists).
export const supporterCountWords = () => MALAY_COUNT[SUPPORTERS.length] ?? `${SUPPORTERS.length} orang`;
