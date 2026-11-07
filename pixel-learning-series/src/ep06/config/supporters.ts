// Gift Kek supporters thanked in Scene 03.
// FICTIONAL SAMPLE usernames (not verified real contributors): replace before publishing.
// Edit this list only: cards (layout adapts to the count), the "N PENYUMBANG" heading and the narration follow it.
// handle: shown on screen (without @)
// spoken: how the narrator says it (re-run `npm run audio:vo:ep06` after changing)
// avatar: one of boy-blue, boy-cap, boy-glasses, hijab-pink, hijab-teal, hijab-purple (pixel avatar, never a photo)
import type {Supporter} from '../../ep03/config/supporters';

export type {Supporter};

export const SUPPORTERS: Supporter[] = [
  {handle: 'HakimTechMY', spoken: 'Hakim Tech M.Y.', avatar: 'boy-glasses'},
  {handle: 'FarahDigital88', spoken: 'Farah Digital lapan lapan', avatar: 'hijab-pink'},
  {handle: 'AmirulIT', spoken: 'Amirul I.T.', avatar: 'boy-blue'},
  {handle: 'NabilaOnline', spoken: 'Nabila Online', avatar: 'hijab-teal'},
  {handle: 'DanialTech', spoken: 'Danial Tech', avatar: 'boy-cap'},
  {handle: 'AinaBelajar', spoken: 'Aina Belajar', avatar: 'hijab-purple'},
  {handle: 'SyafiqMY', spoken: 'Syafiq M.Y.', avatar: 'boy-glasses'},
];

// "@A, @B, ... dan @G" for narration and subtitles.
export const supporterList = () => {
  const h = SUPPORTERS.map((s) => `@${s.handle}`);
  return h.length > 1 ? `${h.slice(0, -1).join(', ')} dan ${h[h.length - 1]}` : h.join('');
};

const MALAY_COUNT = ['kosong', 'seorang', 'dua orang', 'tiga orang', 'empat orang', 'lima orang', 'enam orang', 'tujuh orang', 'lapan orang', 'sembilan orang', 'sepuluh orang'];
export const supporterCountWords = () => MALAY_COUNT[SUPPORTERS.length] ?? `${SUPPORTERS.length} orang`;
