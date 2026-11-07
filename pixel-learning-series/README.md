# Siri video pembelajaran pixel-art

- **Episod 01:** LFCA – Your IT Career Roadmap (`LFCAVideo`, `npm run render`)
- **Episod 02:** Cloud Computing – Blue Pixel World (`CloudVideo`, `npm run render:ep02`)
- **Episod 03:** Cybersecurity Basics – Protect Yourself in the Digital World (`CyberVideo`, `npm run render:ep03`)
- **Episod 04:** Computer Networking Basics – How Computers Connect & How the Internet Works (`NetworkVideo`, `npm run render:ep04`)
- **Episod 05:** Introduction to Linux – Discover the Operating System Behind the Digital World (`LinuxVideo`, `npm run render:ep05`)

> Video siap render (MP4 + SRT) dan helaian QC ada dalam folder `output/`. Render baharu ditulis ke `out/` (tidak di-commit).

# Episod 01 – LFCA

Video menegak 1080×1920 @ 30fps, dibina dengan Remotion + React. Semua grafik (watak, ikon, butang, latar) ialah pixel art yang dilukis dalam kod, jadi gayanya konsisten.

## Mula

```bash
npm install
npm run dev          # Remotion Studio di browser: pratonton penuh + scene satu-satu
npm run render       # out/lfca-roadmap.mp4 (H.264)
```

Dalam Studio:
- **Video / LFCAVideo**: video penuh.
- **Scenes / Scene01Hook … Scene12Closing**: pratonton setiap scene.
- **Assets / CharacterSheet**: master sprite sheet watak.

> **Windows:** jika render gagal dengan `Failed to launch the browser process … ENOENT`, punca biasanya laluan folder melebihi 260 aksara. Salin `node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/` ke folder pendek, kemudian set `REMOTION_BROWSER_EXECUTABLE` kepada `chrome-headless-shell.exe` dalam folder itu.

## Aliran kerja produksi

1. **Sunting skrip.** Fail: `src/config/scenes.ts`.
   - `text` ialah teks atas skrin. `*perkataan*` jadi merah, `\n` ialah baris baru.
   - `vo` ialah teks voice-over dan sari kata.
   - `tts` ialah ejaan khas untuk sebutan TTS, contohnya `I.T.`.
   - `list` mengandungi senarai kerjaya atau label.
2. **Jana semula atau ganti suara.**
   - Untuk TTS Melayu (perlukan internet, guna edge-tts), jalankan `npm run audio:vo`. Untuk suara wanita, tambah `-- --voice ms-MY-YasminNeural`.
   - Untuk rakaman sendiri, simpan `public/audio/vo/sceneNN.mp3` dengan nama fail yang sama. Kemudian buang entri scene itu dalam `src/config/vo-timings.json`, supaya mulut watak dan sari kata diagih ikut panjang audio.
3. **Laraskan masa.** Panjang scene dikira secara automatik: max(`minSeconds`, `voDelay` + panjang audio + `padSeconds`). Ubah tiga nilai itu dalam `scenes.ts`. Animasi yang disegerakkan dengan perkataan (contohnya kad muncul tepat pada perkataan "server") mengikut masa perkataan secara automatik.
4. **Audio lain.** Fail: `src/config/audio.ts`. Di situ anda boleh ubah:
   - kekuatan muzik, muzik semasa narasi (ducking) dan SFX;
   - sari kata on/off (`showSubtitles`).

   Muzik dan SFX asal dijana oleh `npm run audio:sfx`. Untuk menggantinya, letak fail lain dengan nama yang sama dalam `public/audio/`.
5. **Pratonton**: `npm run dev`.
6. **Render**:
   - `npm run render` menghasilkan MP4.
   - `npm run srt` menghasilkan `out/lfca-roadmap.srt`.
   - `npm run stills` menghasilkan helaian QC dalam `out/stills/`.

## Struktur

```
src/
  assets/characters/host.ts   MASTER watak (kepala, cermin mata, baju, 10 pose)
  assets/icons/icons.ts       semua ikon pixel
  components/                 PixelSprite, PixelCharacter, PixelText, PixelBox, SpeechBubble,
                              InfographicCard, Connector, Transition, Subtitles, SceneAudio …
  scenes/Scene01Hook … Scene12Closing
  config/scenes.ts            skrip, teks, masa, SFX
  config/theme.ts             palet warna, fon, saiz piksel
  config/audio.ts             muzik, SFX, kelantangan
public/audio/                 vo/, sfx/, music/
scripts/                      jana suara, jana SFX/muzik, SRT, stills QC
```

## Nota kandungan

- Senarai kerjaya diambil daripada infografik "Your IT Career Roadmap" (Linux Foundation Training & Certification).
- Logo rasmi Linux Foundation tidak digunakan. Lencana "LFCA" dan penguin ialah lukisan pixel asal.
- Skrip tidak membuat dakwaan jaminan kerja.

## Episod 02 – Cloud Computing

Struktur: `src/ep02/`:
- `config/scenes.ts`: skrip, teks atas skrin, kad IaaS/PaaS/SaaS, model deployment, recap.
- `config/supporters.ts`: **4 nama supporter Gift Kek**. Nama sekarang ialah PLACEHOLDER; tukar sebelum publish. Setiap supporter ada `handle`, `spoken` (sebutan), `avatar` dan pilihan `image` (PNG sendiri).
- `config/episode.ts`: sebutan TTS (`say`), muzik dan warna peralihan.
- `config/theme.ts`: palet biru episod ini.
- `scenes/`: 14 scene. Scene 2, 3 dan 14 guna komponen siri dalam `src/series/`.

Aliran kerja:

```bash
npm run audio:vo:ep02   # jana semula suara (perlu bila skrip atau nama supporter berubah)
npm run render:ep02     # out/ep02-cloud-computing.mp4
npm run srt:ep02        # out/ep02-cloud-computing.srt
node scripts/render-stills.mjs 0.45,0.92 ep02   # helaian QC
```

## Episod 03 – Cybersecurity Basics

Struktur: `src/ep03/`:
- `config/scenes.ts`: skrip VO (12 scene), teks atas skrin, kad ancaman, Berhenti/Semak/Sahkan, amalan harian, tindakan mangsa (NSRC 997), recap.
- `config/supporters.ts`: **senarai supporter Gift Kek** (sekarang 3 nama PLACEHOLDER fiksyen: @HafizITMY, @AidaSofea88, @RazmanTech). Tukar di sini sahaja: bilangan kad, tajuk "N PENYUMBANG" dan narasi ikut senarai ini. Jalankan semula `npm run audio:vo:ep03` selepas tukar.
- `config/episode.ts`: sebutan TTS (`say`), muzik `bgm-ep03.wav`, warna peralihan.
- `components/`: `CyberBackground` (latar navy "ancaman" + amaran merah), `Phone` (SMS fiksyen), `GiftThanks` (kad supporter ikut bilangan), `Cards`.
- `assets/icons.ts`: ikon pixel siber (amaran, cangkuk, bug, tangan berhenti, kanta, bank, polis, folder bukti, dll).
- Pose host baru `warn` (dua tapak tangan diangkat) ditambah dalam `src/assets/characters/host.ts`; pose lama tidak berubah.
- SFX baru: `alert`, `notify`, `buzz` (`npm run audio:ep03` jana fail Ep03 sahaja).

Semua contoh scam ialah **fiksyen** (pautan `.contoh` tidak berfungsi, berlabel "CONTOH FIKSYEN"). Talian NSRC 997 disemak pada Nov 2026 (malaysia.gov.my, PDRM, The Star); semak semula sebelum publish.

```bash
npm run audio:vo:ep03   # suara ms-MY-OsmanNeural (+15%)
npm run render:ep03     # out/ep03-cybersecurity-basics.mp4
npm run srt:ep03        # out/ep03-cybersecurity-basics.srt
node scripts/render-stills.mjs 0.45,0.92 ep03   # helaian QC
```

Dalam cloud session (di belakang proxy), tambah `--ignore-certificate-errors` pada render dan set `https_proxy=$HTTPS_PROXY` supaya Google Fonts boleh dimuatkan.

## Episod 04 – Computer Networking Basics

Struktur: `src/ep04/`:
- `config/scenes.ts`: skrip VO (12 scene), teks atas skrin, `minSeconds`/`padSeconds` (durasi), kad LAN/WAN/WLAN, router vs switch, IP vs MAC, recap.
- `config/supporters.ts`: **5 supporter Gift Kek** (nama contoh fiksyen; tukar sebelum publish). Kad Gift Kek (`ep03/components/GiftThanks`) guna 2 lajur bila lebih 3 orang.
- `config/theme.ts`: palet; `config/episode.ts`: sebutan TTS, muzik `bgm-ep04.wav`, warna peralihan.
- `components/Net.tsx`: kabel beranimasi (`NetLink`), peranti berlabel, router/switch berkelip, Wi-Fi beranimasi.
- `assets/icons.ts`: switch, Wi-Fi, printer, kilang, NIC, glob, buku DNS, bandar.
- SFX baru `link` (`npm run audio:ep04`).

Contoh IP untuk DNS guna julat dokumentasi `203.0.113.x` (RFC 5737) dan domain `example.com`.

```bash
npm run audio:vo:ep04
npm run render:ep04     # out/ep04-computer-networking.mp4
npm run srt:ep04
node scripts/render-stills.mjs 0.5,0.93 ep04
```

## Episod 05 – Introduction to Linux

Struktur: `src/ep05/`:
- `config/scenes.ts`: skrip VO (12 scene), teks, perbandingan Linux/Windows, kad distro, sesi terminal (`COMMANDS`, `SERVER_SESSION`), recap.
- `config/supporters.ts`: **6 supporter Gift Kek** (nama placeholder fiksyen; tukar sebelum publish). Siri ini simpan config setiap episod dalam `src/epNN/config/`, jadi fail ini di situ (bukan `src/config/`, yang milik Ep01).
- `components/Tux.tsx`: penguin Linux pixel asal (pose idle/wave/point/celebrate, kelip mata, lompat).
- `components/Terminal.tsx`: terminal **simulasi** (taip huruf demi huruf, kursor berkelip, output baris demi baris, prompt berubah selepas `cd`). Ia hanya melukis teks; tiada arahan sebenar dijalankan.
- `components/ServerRoom.tsx`: latar pusat data dengan rak server berkelip.
- Pose host baru `type` (menaip) dalam `src/assets/characters/host.ts`; SFX baru `key` (`npm run audio:ep05`); font terminal VT323.
- Distro ditunjuk dengan label teks dan kotak pakej pixel asal, tanpa logo rasmi.

```bash
npm run audio:vo:ep05
npm run render:ep05     # out/ep05-introduction-to-linux.mp4
npm run srt:ep05
node scripts/render-stills.mjs 0.55,0.93 ep05
```

## Format siri (untuk episod akan datang)

Intro, penghargaan Gift Kek dan penutup dikongsi oleh semua episod. Komponennya dalam `src/series/`:
- `SeriesGreeting`: "Assalamualaikum! Mari sama-sama belajar!"
- `SupporterThanks`: kad supporter muncul satu-satu ikut nama yang disebut.
- `SeriesCTA`: Like/Share/Follow, Gift Kek dan "Jumpa lagi".

Episod baru hanya perlu folder `src/epNN/` dengan config dan scene topiknya, kemudian didaftarkan dalam `src/Root.tsx`, `scripts/export-script.mjs`, `scripts/render-stills.mjs` dan `scripts/build-srt.mjs`.
