# FASA 4 · AUDIO PRODUCTION

## Keputusan dan pendekatan

- **Voice-over:** TTS sementara (Kokoro, suara `am_michael`). Bahasa Melayu disebut dengan peraturan sebutan Melayu (espeak-ng `ms`); istilah dalam `{kurungan}` dalam `src/data/narration.json` disebut dengan sebutan Inggeris (contohnya Department, Maintenance & Facilities, Manager, Engineer, troubleshooting, work order).
- **Had:** suara ini berloghat Inggeris kerana tiada model suara Bahasa Melayu asli dalam persekitaran ini. Untuk versi akhir, disyorkan rakaman suara manusia: rakam setiap baris di bawah sebagai `public/audio/vo/<id>.wav`, kemudian jalankan `python scripts/generate_vo.py --measure-only`, `node scripts/build-timeline.mjs`, `python scripts/generate_audio.py` dan render semula. Visual akan menyelaras sendiri.
- **Kadar narasi:** ~110 perkataan/minit.
- **Penyelarasan semula masa:** setiap scene diregangkan secara seragam (faktor *k*) supaya narasi muat. Pergerakan kamera dan rentak Fasa 3 dikekalkan, dan rentak penting dikunci pada perkataan narasi (watak carta organisasi, kata kunci, panel sistem, ikon pematuhan, tajuk akhir).
- **Durasi baharu: 02:40.4** (sasaran asal 2:30; lebihan disebabkan kadar suara TTS).
- **Muzik:** asli dan dijana secara prosedural, oleh itu bebas royalti. Ia bermula dengan intro sinematik, diikuti rentak dokumentari, arpeggio digital dan perkusi industri dalam scene kepakaran, dan berakhir dengan penutup inspirasi (C major).
- **Bunyi kesan (18):** dengung mesin, servo robot, spot-weld, konveyor, dengung elektrik, klik, bip multimeter, ratchet, gear, arka kimpalan, antara muka digital, whoosh, impact, shimmer, amaran, langkah kaki, panel dibuka dan angin.
- **Mixing:** muzik direndahkan ~10 dB ketika narator bercakap. Master akhir pada -16 LUFS dan -1.5 dBTP.

## Skrip voice-over dan masa

| ID | Scene | Masuk | Panjang | Ayat |
|---|---|---|---|---|
| s1_1 | 1 | 00:00.6 | 3.4 s | Setiap hari, sebuah kilang beroperasi tanpa henti. |
| s1_2 | 1 | 00:04.3 | 6.1 s | Mesin bergerak, barisan pengeluaran berjalan dan pelbagai sistem bekerja secara berterusan. |
| s1_3 | 1 | 00:10.6 | 5.6 s | Tetapi pernahkah kita terfikir, siapakah yang memastikan semuanya terus berfungsi? |
| s2_1 | 2 | 00:17.2 | 9.9 s | Di sebalik setiap mesin yang beroperasi, setiap sistem yang berfungsi dan setiap kemudahan yang digunakan, terdapat satu pasukan yang memainkan peranan penting. |
| s2_2 | 2 | 00:27.5 | 7.2 s | Mereka memantau, memeriksa, menyelenggara dan memastikan persekitaran kerja sentiasa berada dalam keadaan baik. |
| s3_1 | 3 | 00:35.5 | 2.6 s | Inilah Department Maintenance & Facilities. |
| s3_2 | 3 | 00:38.4 | 8.7 s | Department yang bertanggungjawab menyokong kebolehpercayaan peralatan, penyelenggaraan kemudahan dan kelancaran operasi persekitaran kerja. |
| s4_1 | 4 | 00:48.0 | 6.2 s | Setiap department memerlukan kepimpinan, perancangan dan pembahagian tanggungjawab yang jelas. |
| s4_2 | 4 | 00:54.5 | 5.9 s | Manager mengetuai department serta memantau hala tuju, sumber dan prestasi keseluruhan. |
| s4_3 | 4 | 01:00.7 | 5.9 s | Engineer menyelaras aktiviti teknikal, strategi penyelenggaraan dan inisiatif penambahbaikan. |
| s4_4 | 4 | 01:06.9 | 6.2 s | Assistant Engineer menyokong perancangan, pemeriksaan, pemantauan dan penyelarasan operasi harian. |
| s4_5 | 4 | 01:13.3 | 6.0 s | Manakala Technician melaksanakan kerja-kerja teknikal mengikut bidang kepakaran masing-masing. |
| s5_1 | 5 | 01:20.3 | 7.1 s | Daripada sistem elektrik kepada peralatan mekanikal, daripada troubleshooting kepada kerja fabrikasi. |
| s5_2 | 5 | 01:27.7 | 3.1 s | Setiap kepakaran mempunyai peranan tersendiri. |
| s5_3 | 5 | 01:31.5 | 4.6 s | Setiap pemeriksaan penting. Setiap pembaikan membawa perbezaan. |
| s6_1 | 6 | 01:37.6 | 4.5 s | Namun, tugas Maintenance & Facilities bukan sekadar membaiki kerosakan. |
| s6_2 | 6 | 01:42.4 | 6.2 s | Di sebalik setiap kerja yang dilaksanakan, terdapat sistem pentadbiran yang menyokong operasi department. |
| s6_3 | 6 | 01:48.9 | 7.6 s | Work order diuruskan, penyelenggaraan dirancang, laporan direkodkan, alat ganti dipantau dan prestasi kerja dinilai. |
| s6_4 | 6 | 01:56.8 | 6.9 s | Kerana penyelenggaraan yang baik bukan sekadar menyelesaikan masalah, tetapi mengurusnya secara sistematik. |
| s7_1 | 7 | 02:04.6 | 7.4 s | Setiap aktiviti juga perlu disokong dengan dokumentasi, pemantauan dan pematuhan kepada keperluan organisasi. |
| s7_2 | 7 | 02:12.3 | 10.5 s | Melalui rekod penyelenggaraan dan pelaksanaan kerja yang sistematik, department turut menyokong aspek kualiti, alam sekitar, keselamatan pekerjaan dan keperluan audit. |
| s8_1 | 8 | 02:23.5 | 5.3 s | Berbeza kemahiran. Berbeza tanggungjawab. Namun berkongsi satu matlamat. |
| s8_2 | 8 | 02:29.1 | 6.3 s | Menyelenggara kemudahan, menyokong warga kerja dan memastikan operasi kilang terus berjalan. |
| s8_3 | 8 | 02:35.6 | 2.8 s | Inilah kami. Maintenance & Facilities. |

## Masa scene baharu

| Scene | Mula | Tamat | k |
|---|---|---|---|
| 01 · Kilang yang tidak pernah berhenti | 00:00.0 | 00:16.5 | 1.1022 |
| 02 · Pasukan di sebalik operasi | 00:16.5 | 00:35.0 | 1.0278 |
| 03 · Mengenali department | 00:35.0 | 00:47.4 | 1.0333 |
| 04 · Struktur organisasi | 00:47.4 | 01:19.7 | 1.1951 |
| 05 · Keperluan kemahiran yang berbeza | 01:19.7 | 01:37.2 | 0.9193 |
| 06 · Bukan sekadar kerja teknikal | 01:37.2 | 02:04.1 | 1.0346 |
| 07 · Dokumentasi dan pematuhan | 02:04.1 | 02:23.2 | 1.063 |
| 08 · Satu pasukan, satu matlamat | 02:23.2 | 02:40.4 | 1.1467 |
