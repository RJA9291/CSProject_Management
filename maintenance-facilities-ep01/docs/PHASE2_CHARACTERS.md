# FASA 2 · CHARACTER DEVELOPMENT

Keputusan Fasa 1: **Pilihan A** (3D dalam projek ini), **TTS sementara** untuk voice-over.

## Hasil

| Fail | Kandungan |
|---|---|
| `characters/01_manager.png` | Manager: turnaround, wajah, aksi khas, spesifikasi |
| `characters/02_engineer.png` | Engineer |
| `characters/03_assistant.png` | Assistant Engineer |
| `characters/04_electrical.png` | Electrical Technician |
| `characters/05_mechanical.png` | Mechanical Technician |
| `characters/06_welding.png` | Welding Technician |
| `characters/07_ae_vs_technician.png` | Perbandingan Assistant Engineer dan Technician |
| `characters/08_turntable.mp4` | Turntable 8 saat bagi seluruh pasukan dalam aksi khas masing-masing |
| `preproduction/01_character_sheet.png` | Barisan watak (dikemas kini kepada model v2) |

## Penambahbaikan model (v2)

- **Rangka bersendi:** pinggul, lutut, tulang belakang, bahu, siku, kepala (pitch/yaw) dan crouch. Ini membolehkan aksi berjalan,
  membongkok dan mengimpal dalam Fasa 3.
- **Anatomi:** kadar badan dewasa (≈7.3 kepala), kasut keselamatan berbentuk but dengan sole dan *toe cap*, tangan dengan ibu jari.
- **Uniform:** kolar, *placket* dan butang, dua poket dada, lencana department (logo placeholder), tali pinggang, jalur reflektif,
  dan *yoke* oren.
- **Wajah:** mata (putih, iris, kilauan), kelopak, kening, hidung, bibir, misai, janggut, rambut bob dan tudung (wajah terbuka).
- **PPE:** helmet dengan *peak* hadapan dan pelekat department. Cermin mata keselamatan lutsinar. Perisai kimpalan melengkung yang
  boleh diangkat atau diturunkan.

## Perpustakaan aksi (dikunci ikut jawatan)

| Watak | Aksi dibenarkan | Aksi khas |
|---|---|---|
| Manager | Berdiri, berjalan, memimpin, menerangkan, menyemak tablet | Memimpin |
| Engineer | Berdiri, berjalan, menyemak tablet, menerangkan, pemeriksaan visual | Menerangkan / menunjuk |
| Assistant Engineer | Berdiri, berjalan, menanda checklist, menyemak tablet, pemeriksaan visual | Menanda checklist |
| Electrical Technician | Berdiri, berjalan, pengukuran elektrik, kerja hands-on, pemeriksaan | Pengukuran elektrik |
| Mechanical Technician | Berdiri, berjalan, kerja hands-on, pemeriksaan | Kerja hands-on |
| Welding Technician | Berdiri, berjalan, kimpalan, kerja hands-on | Kimpalan (perisai diturunkan) |

`src/characters/poses.ts → ROLE_ACTIONS` menguatkuasakan peraturan ini. Jika sesuatu scene meminta aksi yang tidak dibenarkan
(contohnya Assistant Engineer membuat kerja hands-on), watak itu kembali kepada pose berdiri.

## Masih placeholder (belum disahkan)

Warna uniform (biru tua dan oren), kod helmet (putih, biru, kuning), logo department, serta cadangan jantina dan bangsa watak.
Semua boleh ditukar dalam satu fail, `src/characters/specs.ts`, dan perubahan akan berkuat kuasa dalam setiap scene.

## Fasa seterusnya

**FASA 3: Scene generation.** Membina lapan scene mengikut storyboard dengan pergerakan kamera, aksi watak dan persekitaran
(pejabat department, bilik facility, ruang digital carta organisasi, panel sistem pentadbiran, ikon pematuhan).
