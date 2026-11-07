// Gift Kek supporters thanked in Scene 03.
// FICTIONAL SAMPLE usernames for the storyboard (not verified real contributors): replace before publishing.
// Edit this list only: cards (layout adapts to the count), the "N PENYUMBANG" heading and the narration follow it.
// handle: shown on screen (without @)
// spoken: how the narrator says it (re-run `npm run audio:vo:ep04` after changing)
// avatar: one of boy-blue, boy-cap, boy-glasses, hijab-pink, hijab-teal, hijab-purple (pixel avatar, never a photo)
import type {Supporter} from '../../ep03/config/supporters';

export type {Supporter};

export const SUPPORTERS: Supporter[] = [
  {handle: 'HafizITMY', spoken: 'Hafiz I.T. M.Y.', avatar: 'boy-glasses'},
  {handle: 'AidaSofea88', spoken: 'Aida Sofea lapan lapan', avatar: 'hijab-teal'},
  {handle: 'RazmanTech', spoken: 'Razman Tech', avatar: 'boy-cap'},
  {handle: 'ZulFikriMY', spoken: 'Zul Fikri M.Y.', avatar: 'boy-blue'},
  {handle: 'SyafiqahIT', spoken: 'Syafiqah I.T.', avatar: 'hijab-purple'},
];

// "@A, @B, @C, @D dan @E" for narration and subtitles.
export const supporterList = () => {
  const h = SUPPORTERS.map((s) => `@${s.handle}`);
  return h.length > 1 ? `${h.slice(0, -1).join(', ')} dan ${h[h.length - 1]}` : h.join('');
};

const MALAY_COUNT = ['kosong', 'seorang', 'dua orang', 'tiga orang', 'empat orang', 'lima orang', 'enam orang', 'tujuh orang', 'lapan orang', 'sembilan orang', 'sepuluh orang'];
export const supporterCountWords = () => MALAY_COUNT[SUPPORTERS.length] ?? `${SUPPORTERS.length} orang`;
