# FASA 3 · SCENE GENERATION

Lapan scene dibina dalam 3D sebenar (Three.js / Remotion) mengikut storyboard Fasa 1, dengan watak Fasa 2.

| Hasil | Fail |
|---|---|
| Pratonton penuh tanpa bunyi (2:30) | `output/episode01_phase3_preview.mp4` |
| Klip setiap scene | `output/scenes/scene01.mp4` … `scene08.mp4` |
| Komposisi berasingan (boleh dirender sendiri) | `Scene01` … `Scene08`, `Episode01` dalam Remotion Studio |

## Dunia 3D

- **Satu dunia kilang** yang dikongsi oleh Scene 01, 02, 03, 05, 06 (pembukaan), 07 (pembukaan) dan 08. Ia merangkumi
  luar bangunan (tempat letak kereta, jalan, pokok), barisan robot body-in-white, mesin dengan lampu isyarat, electrical room,
  **pejabat department** (dinding kaca, papan tanda, papan jadual PM, skrin KPI), **kawasan facility** (pemampat udara, tangki
  udara, AHU, chiller, paip) dan **stesen technician** (distribution board, gearbox keratan rentas, bilik kimpalan).
- **Ruang digital** untuk carta organisasi (Scene 04), sistem pentadbiran (Scene 06) serta dokumentasi dan pematuhan (Scene 07).

## Senarai syot yang dilaksanakan

| Scene | Masa | Syot dan pergerakan kamera |
|---|---|---|
| 01 | 0:00–0:15 | Aerial senja, kemudian kamera menjunam sementara bumbung hilang (*cutaway*), fly-through di atas barisan robot, dolly sepanjang barisan, push-in ke mesin dengan lampu amaran oren berkelip |
| 02 | 0:15–0:33 | Tracking di belakang Mechanical Technician → close-up kerja hands-on di mesin → Electrical Technician mengukur di DB (pintu terbuka) → crane-up ke kawasan facility → Assistant Engineer memantau dengan tablet. Kata kunci MEMANTAU · MEMERIKSA · MENYELENGGARA |
| 03 | 0:33–0:45 | Dari lantai kilang menembusi dinding kaca ke pejabat → orbit mesyuarat pasukan (Manager memimpin, Engineer menerangkan, AE menanda checklist, Technician mendengar) → papan tanda **MAINTENANCE & FACILITIES DEPARTMENT** menyala |
| 04 | 0:45–1:12 | Ruang digital: carta organisasi 3D terbina tingkat demi tingkat (Manager → Engineer → Assistant Engineer → tiga Technician), setiap watak muncul dalam tiang cahaya dengan label jawatan, kemudian pull-back ke carta penuh |
| 05 | 1:12–1:31 | Electrical Technician membuka DB dan mengukur → gearbox keratan rentas (gear dan bearing berputar) bersama Mechanical Technician → Welding Technician mengimpal (arka biru, percikan) → panorama ketiga-tiga stesen |
| 06 | 1:31–1:57 | Dari atas bahu Engineer masuk ke skrin tablet → ruang digital: enam panel sistem pentadbiran menyala satu demi satu (Work Order, Daily Report, PM Schedule, Spare Parts, Contractor, KPI) → pull-back, "SISTEMATIK" |
| 07 | 1:57–2:15 | Engineer menyemak dokumen di pejabat → dokumen (rekod PM, checklist, laporan pemeriksaan, audit) tersusun di ruang digital → ikon KUALITI · ALAM SEKITAR · KESELAMATAN PEKERJAAN · PEMATUHAN |
| 08 | 2:15–2:30 | Enam watak berjalan bersama ke arah kamera di walkway → pull-back dan crane-up dengan kilang beroperasi → tajuk akhir dan slogan |

## Peraturan watak yang dipatuhi

- Assistant Engineer sentiasa memegang clipboard (atau tablet) dan tidak pernah memegang alat atau membuat pembaikan. Aksi ini
  dikunci oleh `ROLE_ACTIONS`.
- Setiap jawatan dipaparkan oleh **satu** watak. Tiada watak tambahan yang mengelirukan struktur organisasi. Scene 01 tidak
  memaparkan pekerja produksi lain; yang kelihatan hanya Mechanical Technician yang sedang membuat rondaan.
- Uniform, wajah dan aksesori datang daripada fail spesifikasi yang sama dengan Fasa 2.

## Kandungan placeholder

- **Panel sistem:** kandungan ialah contoh ilustrasi, bukan data sebenar. Contohnya "WO-0001 Conveyor C2", "Kontraktor A" dan
  gauge "KPI 1–3" (KPI sebenar belum disahkan).
- **Pejabat:** skrin KPI dan papan jadual PM adalah ilustrasi.
- Tiada logo atau nama syarikat dipaparkan.

## Had

- Gaya 3D stylized (geometri asas), seperti yang dipersetujui dalam Pilihan A.
- Masa scene masih ikut cadangan Fasa 1. **Fasa 4** akan menjana VO (TTS sementara) dan menyelaraskan semula masa setiap scene.
