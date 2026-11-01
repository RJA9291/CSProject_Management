# Di Sebalik Operasi Kilang · Episode 01: Mengenali Department Maintenance & Facilities

Dokumentari animasi 3D sinematik untuk onboarding pekerja baharu: 1920 × 1080, 30 fps, **2:40**, Bahasa Melayu.
Dibina dengan **Remotion + Three.js (react-three-fiber)** dan dimaster dengan **FFmpeg**.

## Hasil akhir

| Fail | Kandungan |
|---|---|
| `output/DI_SEBALIK_OPERASI_KILANG_EP01.mp4` | **Video akhir**: VO, muzik, bunyi kesan, sari kata BM, -16 LUFS |
| `output/DI_SEBALIK_OPERASI_KILANG_EP01.srt` | Sari kata Bahasa Melayu (berasingan) |
| `output/skrip_narasi.txt` | Skrip narasi lengkap dengan masa |
| `docs/PRE_PRODUCTION.md` | Fasa 1: konsep, storyboard, watak, persekitaran, perkara untuk disahkan |
| `docs/PHASE2_CHARACTERS.md`, `docs/characters/` | Fasa 2: helaian rujukan watak dan turntable |
| `docs/PHASE3_SCENES.md`, `output/scenes/` | Fasa 3: senarai syot dan klip setiap scene (pratonton tanpa bunyi) |
| `docs/PHASE4_AUDIO.md` | Fasa 4: skrip VO dan masa, muzik, bunyi kesan, mixing |

## Struktur

| Folder / fail | Kandungan |
|---|---|
| `src/characters/specs.ts` | **Character bible**: sumber tunggal rupa setiap watak |
| `src/characters/poses.ts` | Perpustakaan aksi dan `ROLE_ACTIONS` (aksi dikunci ikut jawatan) |
| `src/environment/` | Kilang, luar bangunan, pejabat, facility, stesen kerja, ruang digital |
| `src/scenes/` | Scene 01–08 (`PlantScenes.tsx`, `DigitalScenes.tsx`) |
| `src/Episode.tsx`, `src/Overlays.tsx`, `src/Soundtrack.tsx` | Gabungan episod, tajuk dan sari kata, audio |
| `src/data/narration.json` | Skrip narasi (sebutan BM dan `{Inggeris}`) dan sasaran masa |
| `src/data/timeline.json` | Masa scene dan VO (dijana) |
| `scripts/` | VO, masa, muzik dan SFX, SRT, mastering, still QA |

## Render semula

```bash
npm install
export REMOTION_BROWSER_EXECUTABLE=/path/to/chrome-headless-shell   # jika perlu
npx remotion render src/index.ts Episode01 output/render_raw.mp4 --codec=h264 --crf=20 --audio-bitrate=320k
bash scripts/master.sh output/render_raw.mp4 output/DI_SEBALIK_OPERASI_KILANG_EP01.mp4
node scripts/build-docs.mjs
```
`Episode01-NoSubs` menghasilkan versi tanpa sari kata. WebGL tanpa GPU guna renderer `swangle` (sudah ditetapkan).
Render penuh mengambil masa ~45 minit pada 4 teras CPU.

## Menukar voice-over kepada suara manusia

1. Rakam setiap baris dalam `output/skrip_narasi.txt` sebagai `public/audio/vo/<id>.wav` (ID dalam `src/data/narration.json`).
2. `python scripts/generate_vo.py --measure-only`, kemudian `node scripts/build-timeline.mjs`, `python scripts/generate_audio.py` dan `node scripts/build-docs.mjs`.
3. Render semula. Masa scene dan rentak visual akan menyelaras sendiri dengan rakaman baharu.

## Placeholder (belum disahkan)

Warna uniform dan kod helmet, logo dan nama syarikat (tidak dipaparkan), KPI sebenar (panel guna "KPI 1–3" generik), nama
sistem work order, standard ISO, dan kandungan panel sistem (contoh ilustrasi). Semua boleh ditukar dalam `specs.ts`,
`Digital.tsx` dan `Sets.tsx`.
