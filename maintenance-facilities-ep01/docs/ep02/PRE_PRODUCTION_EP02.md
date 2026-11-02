# DI SEBALIK OPERASI KILANG
## Episode 02 – Struktur Organisasi Kilang
### Pre-production (dikemas kini mengikut struktur organisasi yang disahkan)

| Perkara | Butiran |
|---|---|
| Format | 1920 × 1080, 16:9, 30 fps |
| Durasi | **3:08** |
| Bahasa | Bahasa Melayu (narasi, sari kata, teks di skrin). Nama jabatan rasmi kekal dalam bahasa Inggeris |
| Pendekatan cerita | Perjalanan seorang **technician baharu** mengenali kilang, dengan scenario **mesin rosak** untuk menunjukkan kerjasama antara jabatan |
| Rujukan visual induk | **Episode 01**: rig watak, kilang, pencahayaan, palet, gaya kamera, sari kata dan muzik yang sama |

Rujukan visual: `01_cast_sheet_ep02.png` (watak sokongan) dan `02_org_chart.png` (carta organisasi seperti dalam video).

---

## 1. Struktur organisasi (disahkan)

```
KEPIMPINAN
  Managing Director – Modular
  Plant Head  (mengetuai kilang)

KILANG · JABATAN OPERASI UTAMA                         FUNGSI SOKONGAN
  ┌────────────┬─────────┬───────────┬─────┬─────────────┬──────────────────────────┐   ┆  Safety
  │ Production │ Quality │ Logistics │ PPC │ Engineering │ Maintenance & Facilities │ ┄┄┆  QMS
  └────────────┴─────────┴───────────┴─────┴─────────────┴──────────────────────────┘   ┆
                                                         (menyokong keseluruhan operasi kilang)
```

**Cara paparan dalam video (Scene 02):**
- **Kepimpinan:** kad *Managing Director – Modular* di peringkat atas, dan kad *Plant Head* ("Mengetuai kilang") di bawahnya.
- **Kilang:** bingkai bercahaya berlabel *KILANG · JABATAN OPERASI UTAMA* mengandungi enam kad jabatan, setiap satu dengan
  ikon dan aktiviti ringkas.
- **Fungsi sokongan:** panel berasingan di sisi kanan, di luar bingkai jabatan operasi utama, mengandungi *Safety* dan *QMS*.
  Garis putus-putus berwarna oren bertanda "menyokong keseluruhan operasi kilang".
- **Tiada garis laporan** dilukis antara kepimpinan dan jabatan, atau antara jabatan. Hubungan laporan belum disahkan, jadi
  carta hanya menunjukkan **tingkat** dan **kumpulan**.
- **Tiada ketua jabatan, nama individu atau watak 3D** untuk kepimpinan. Jawatan kepimpinan dipaparkan sebagai kad sahaja,
  supaya rupa individu sebenar tidak direka-reka.

---

## 2. Peraturan kesinambungan visual (Episode 01 = rujukan induk)

| Elemen | Episode 02 |
|---|---|
| Watak | Rig, kadar badan, wajah, uniform, PPE dan animasi yang sama (`src/characters/`). Watak Ep01 digunakan semula **tanpa perubahan** |
| Watak baharu | Dibina dengan rig dan gaya bahan yang sama. Hanya warna uniform jabatan, aksesori dan aksi yang berbeza |
| Persekitaran | Dunia kilang Ep01 yang sama. Set baharu ditambah dengan bahan, palet dan pencahayaan yang sama |
| Cahaya dan warna | Kelabu industrial neutral, biru dan aksen oren. *Key light* hangat, *fill* biru, kabus atmosfera |
| Kamera | Spline kamera yang sama (dolly, tracking, orbit, crane, push-in), pemotongan dengan *dip* gelap dan *flash* ke ruang digital |
| Grafik | Ruang digital biru yang sama, kad bercahaya, label bawah-kiri, sari kata dengan highlight dan tajuk akhir |
| Audio | Suara narator, palet muzik dan perpustakaan SFX yang sama |

---

## 3. Watak

**Daripada Episode 01 (tanpa perubahan):** Manager, Engineer, Assistant Engineer (pemandu lawatan), Electrical, Mechanical
dan Welding Technician (Maintenance & Facilities).

**Watak sokongan baharu** (lihat `01_cast_sheet_ep02.png`). Tiada nama; jawatan sahaja:

| Watak | Jabatan | Rupa (warna = PLACEHOLDER) | Aktiviti di skrin |
|---|---|---|---|
| Technician baharu | Maintenance & Facilities | Uniform M&F biru tua/oren, helmet kuning, muda, tanpa janggut | Watak utama perjalanan. Memerhati, kemudian membantu pembaikan |
| Operator Production (2) | Production | Kelabu dengan aksen hijau, helmet hijau | Memasang di stesen awal line. Melaporkan kerosakan (menunjuk ke andon) |
| Quality | Quality | Biru muda, helmet biru muda, tablet | Pemeriksaan dalam *light tunnel*. Memeriksa produk terjejas (papan HOLD) |
| Logistics | Logistics | Kelabu, vest hi-vis oren, helmet oren | Memandu forklift dengan bahan dan alat ganti |
| PPC | PPC | Pakaian pejabat, tudung maroon. Tanpa helmet di pejabat | Menerangkan jadual pengeluaran di skrin. Menyelaraskan jadual |
| Engineering | Engineering | Kelabu gelap, aksen biru, helmet putih, cermin mata | Kajian proses di sel robot. Analisis teknikal pada tablet |
| Safety | Safety (sokongan) | Vest hi-vis hijau limau, helmet merah | Semakan PPE. Pengasingan mesin (lockout/tagout) |
| QMS | QMS (sokongan) | Pakaian pejabat, cermin mata. Tanpa helmet di pejabat | Semakan rekod dan prosedur. Dokumentasi tindakan pembetulan |

**Peraturan PPE:** watak pejabat (PPC, QMS) **memakai helmet bila berada di lantai kilang**. Ini dikuatkuasakan dalam kod
melalui `onFloor()` dalam `src/ep02/World.tsx`. Aksi setiap watak dikunci ikut jawatan (`ROLE_ACTIONS`).

---

## 4. Persekitaran baharu (dalam dunia kilang Ep01)

| Set | Lokasi | Kandungan |
|---|---|---|
| Pintu masuk kilang | Fasad hadapan | Pintu kaca, kanopi, laluan dari tempat letak kereta |
| Stesen awal Production | Permulaan line | Body-in-white di stesen pemasangan |
| Stesen pemeriksaan Quality | Hujung kiri hall | *Light tunnel* (lengkung lampu putih), meja pemeriksaan |
| Kawasan Logistics | Hadapan kanan | Rak palet (3 aras) dan laluan forklift |
| Sudut PPC | Dinding kiri | Meja, monitor, skrin dinding *JADUAL PENGELUARAN* (keadaan biasa / diselaraskan) |
| Sel robot (scenario rosak) | Tengah line | Menara andon (hijau/merah), panel kawalan dengan padlock dan tag LOTO, papan HOLD |
| Papan keselamatan | Walkway | "UTAMAKAN KESELAMATAN", piktogram PPE |
| Ruang digital | — | Carta organisasi (Scene 02), rajah kerjasama lapan pasukan (Scene 06) |

---

## 5. Storyboard

| Scene | Masa | Syot dan kamera | Aksi utama | Teks di skrin |
|---|---|---|---|---|
| **01 Hari pertama** | 0:00–0:20 | Tracking di belakang technician baharu dari tempat letak kereta ke pintu masuk, kemudian orbit di walkway dengan barisan robot di belakang, kemudian close-up wajah | Technician baharu memerhati kilang. Assistant Engineer (Ep01) datang sebagai pemandu lawatan | Kad tajuk: DI SEBALIK OPERASI KILANG · EPISODE 02, **STRUKTUR ORGANISASI KILANG** |
| **02 Gambaran besar** | 0:20–0:53 | Ruang digital: push-in ke kepimpinan, kemudian bingkai kilang, kemudian tracking sepanjang enam kad jabatan, kemudian pan ke fungsi sokongan, kemudian pull-back | Kad muncul tepat ketika setiap nama disebut | Carta organisasi seperti di Bahagian 1 |
| **03 Lawatan jabatan** | 0:53–1:41 | Tracking di walkway, kemudian enam syot jabatan (dolly perlahan). AE dan technician baharu sebagai pemerhati dalam setiap syot | Production memasang · Quality memeriksa dalam light tunnel · Logistics forklift · PPC skrin jadual · Engineering di sel robot · Maintenance & Facilities di stesen kerja (DB, gearbox, kimpalan) | Label jabatan dan aktiviti di bawah-kiri |
| **04 Fungsi sokongan** | 1:41–2:01 | Two-shot di papan keselamatan, kemudian pejabat | Safety menyemak PPE technician baharu · QMS menyemak rekod | SAFETY / QMS: "Fungsi sokongan · …" |
| **05 Mesin rosak** | 2:01–2:46 | Lapan syot mengikut urutan narasi | Robot sel berhenti, andon merah · Operator Production melaporkan · Safety lockout/tagout · Technician M&F dan technician baharu membaiki, Engineering menganalisis · Quality: papan HOLD · PPC: jadual diselaraskan · Logistics: forklift membawa alat ganti · Line pulih (andon hijau), QMS merekod | Label jabatan bagi setiap tindakan |
| **06 Satu kilang, satu pasukan** | 2:46–3:08 | Rajah kerjasama digital, kemudian kumpulan semua watak di walkway, kemudian pull-back dan crane-up | Lapan pasukan dalam satu rajah, kemudian semua watak bersama | **SATU KILANG. SATU PASUKAN.** · DI SEBALIK OPERASI KILANG · EPISODE 02 |

---

## 6. Skrip narasi

Skrip lengkap dengan masa: `output/skrip_narasi_ep02.txt`. Sumber: `src/data/ep02/narration.json`, dengan sebutan Inggeris
dalam `{kurungan}`. Isi dan urutan narasi mengikut Bahagian 5.

Pernyataan peranan jabatan ditulis secara **umum** (fungsi lazim setiap jabatan). Narasi tidak menyatakan prosedur
syarikat, KPI atau hubungan laporan yang belum disahkan.

---

## 7. Scene prompts (arahan produksi setiap scene)

Gaya untuk semua scene: animasi 3D sinematik "realistic stylized" seperti Episode 01, palet kelabu industrial dan biru dengan aksen oren, *key light* hangat dan *fill* biru,
kabus atmosfera, kamera bergerak berterusan, watak daripada character bible Ep01 dan Ep02 tanpa sebarang perubahan rupa.

1. **Hari pertama.** Pagi di luar kilang automotif Malaysia. Technician baharu Maintenance & Facilities (uniform biru tua/oren,
   helmet kuning) berjalan dari tempat letak kereta ke pintu masuk kaca, kamera mengikut dari belakang. Di dalam, dia berdiri di
   walkway hijau sambil kamera mengorbit perlahan, dengan barisan robot spot-weld bergerak di belakang. Close-up wajahnya yang
   tertanya-tanya, kemudian Assistant Engineer (helmet biru, clipboard) masuk ke frame.
2. **Gambaran besar.** Ruang digital biru gelap dengan grid bercahaya. Kad *Managing Director – Modular* dan *Plant Head* muncul
   di peringkat atas. Bingkai bercahaya "KILANG · JABATAN OPERASI UTAMA" terbina, dan enam kad jabatan muncul satu demi satu.
   Panel "FUNGSI SOKONGAN" (Safety, QMS) di sisi, dengan garis putus-putus oren "menyokong keseluruhan operasi kilang".
   Tiada anak panah laporan.
3. **Lawatan jabatan.** Enam syot dolly perlahan. Operator Production (helmet hijau) memasang body-in-white di stesen awal line.
   Pemeriksa Quality dalam light tunnel. Forklift Logistics di rak palet. Perancang PPC menerangkan skrin *JADUAL PENGELUARAN*.
   Jurutera Engineering menyemak sel robot dengan tablet. Pasukan M&F di distribution board, gearbox keratan rentas dan bilik
   kimpalan. AE dan technician baharu memerhati di tepi setiap syot.
4. **Fungsi sokongan.** Pegawai Safety (vest hijau limau, helmet merah) menyemak PPE technician baharu di sebelah papan
   "UTAMAKAN KESELAMATAN". Pegawai QMS (pakaian pejabat) menyemak rekod pada tablet di pejabat.
5. **Mesin rosak.** Robot sel berhenti dan menara andon bertukar merah berkelip. Operator menunjuk ke andon. Safety memasang
   padlock dan tag "BAHAYA – JANGAN HIDUPKAN" pada panel. Technician M&F dan technician baharu membaiki di pangkal robot, dengan
   Engineering menganalisis pada tablet. Quality di sebelah papan merah "HOLD". Skrin PPC bertukar "JADUAL DISELARASKAN".
   Forklift membawa kotak alat ganti biru. Andon kembali hijau, robot bergerak semula, dan QMS merekod di hadapan pasukan.
6. **Satu kilang, satu pasukan.** Rajah digital: "MESIN ROSAK" di tengah dengan lapan kad pasukan terhubung, kemudian bertukar kepada
   "OPERASI DIPULIHKAN". Di walkway, semua watak berdiri bersama. Kamera berundur dan naik, kemudian tajuk "SATU KILANG. SATU PASUKAN."

---

## 8. Placeholder dan perkara untuk disahkan

1. **Warna uniform dan helmet jabatan lain** (Production, Quality, Logistics, PPC, Engineering, Safety, QMS). Semuanya cadangan;
   boleh ditukar dalam satu tempat, `CAST_EP02` dalam `src/characters/specs.ts`.
2. **Hubungan laporan** antara kepimpinan dan jabatan tidak dilukis. Jika disahkan, garis carta boleh ditambah.
3. **Kandungan skrin** (jadual pengeluaran, label "Line A/B", "Sel Robot") ialah ilustrasi umum.
4. **Prosedur LOTO dan HOLD** dipaparkan sebagai amalan lazim. Sahkan istilah dan warna tag mengikut prosedur syarikat.
5. **Voice-over** masih TTS sementara (seperti Episode 01). Disyorkan rakaman suara manusia untuk versi akhir.
