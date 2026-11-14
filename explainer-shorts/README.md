# Macam Mana? – 3D cartoon explainer shorts

Video pendek 9:16 (1080×1920, 30 fps) gaya kartun 3D low-poly yang menjawab soalan "macam mana?".
Dibina dengan Remotion + Three.js. Bahasa Melayu, suara `ms-MY-OsmanNeural` (edge-tts).

## Video 1: Macam Mana Waze Tahu Jalan Sesak? (`WazeJem`)

| Shot | Isi |
|---|---|
| s1-hook | Kereta laju (89 km/j), telefon tunjuk "Sesak di hadapan" |
| s2-macam-mana | Close-up pemandu terkejut: "MACAM MANA DIA TAHU?" |
| s3-telefon | Kamera naik ke udara: setiap kereta ada telefon (sensor), data lokasi + kelajuan tanpa nama naik ke cloud |
| s4-merah | Ramai kereta perlahan → purata kelajuan → jalan jadi merah |
| s5-report | Pin laporan (kemalangan, halangan, polis) + data lama untuk ramal masa sampai |
| s6-tolong | Laluan alternatif hijau, pemandu gembira, CTA "Komen bawah!" |

Pemandu ialah presenter siri pixel (rambut hitam, cermin mata hitam, baju-T hitam) dalam versi chibi 3D. Watak asal; skrin aplikasi navigasi ialah reka bentuk generik tanpa logo.

## Video 2: Kenapa Puteri Santubong Bertukar Menjadi Gunung? (`Santubong`)

Legenda rakyat Sarawak, versi ringkas (~2 minit), 12 shot: gunung berbentuk puteri berbaring → dua kampung bergaduh → Raja Kayangan hantar Puteri Santubong (menenun) & Puteri Sejinjang (menumbuk padi) → janji → aman → Putera Serapi datang → cemburu → pukulan alu & belidak → sumpahan: kepala Sejinjang pecah jadi pulau-pulau, Santubong jadi gunung berparut → pengajaran.

- `src/santubong/script.json`: narasi; shot boleh ada beberapa `parts` dengan suara sendiri (dialog puteri guna `ms-MY-YasminNeural`, Raja Kayangan guna suara lebih garau).
- `src/santubong/world/`: `Land` (laut, pantai, kampung, Gunung Santubong, pulau, Kayangan, langit siang/senja/malam/ribut), `Chibi` (watak & prop: kek tenun, lesung, alu, belidak).
- `src/santubong/Story.tsx`: pengarah shot + kapsyen + SFX.
- Kapsyen akhir menyatakan ini legenda rakyat, bukan fakta sejarah.

```bash
python scripts/generate-vo.py santubong
REMOTION_BROWSER_EXECUTABLE=... npm run render:santubong
PREFIX=Santubong- node scripts/render-stills.mjs 0.3,0.8
```

## Fail utama

- `src/waze/script.json`: skrip VO setiap shot, perkataan yang ditonjol kuning (`highlight`), sebutan TTS (`say`).
- `src/waze/timings.json`: dijana; tempoh + masa setiap perkataan (kapsyen & potongan ikut suara).
- `src/waze/Video.tsx`: pengarah shot (kamera, emosi pemandu, kesan data) + lapisan 2D + audio.
- `src/waze/world/`: `World` (lebuh raya, pokok, bukit, langit), `Car` (kereta + model trafik deterministik), `Hero` (kereta hero + pemandu chibi), `Data` (beacon telefon, paket, cloud server, warna jalan, pin).
- `src/waze/ui/Overlays.tsx`: kapsyen gaya short-video, punch line, speedometer, chip, telefon peta.

## Aliran kerja

```bash
npm ci
npm run vo          # jana semula suara selepas ubah script.json (perlu internet)
npm run audio       # jana SFX + muzik bgm-shorts.wav
npm run studio      # preview dalam browser (folder Waze-Jem: video penuh + setiap shot)
REMOTION_BROWSER_EXECUTABLE=... npm run render:waze   # out/waze-jem.mp4
node scripts/render-stills.mjs 0.35,0.85            # QC stills setiap shot
```

Tukar fail audio dalam `public/audio/` (nama sama) untuk ganti muzik/SFX. Fon: Rubik & Inter (OFL), disimpan setempat.
