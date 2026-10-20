# PRD — Weebo

**Status:** v2, disusun sebelum build window dibuka. Dokumen kerja, berbahasa Indonesia.
Materi submission ditulis dalam Bahasa Inggris — keputusan tim, bukan syarat lomba (`AGENTS.md` §1.1).

**Untuk apa dokumen ini.** Menjawab **apa yang dibangun dan untuk siapa**. Tidak menjawab
bagaimana (itu `docs/PHASES.md` + file fase) dan tidak menjawab kenapa begitu (itu
`docs/DECISIONS.md`).

| Dokumen | Menjawab | Kalau bentrok |
|---|---|---|
| `docs/PRD.md` (ini) | Apa, untuk siapa, dan bagaimana kualitasnya diukur | PRD menang soal definisi user, prioritas fitur, dan target kualitas |
| `docs/PHASES.md` + `docs/phases/` | Bagaimana dan kapan | File fase menang soal urutan dan pembagian task |
| `docs/DECISIONS.md` | Kenapa begitu | ADR menang soal pilihan teknis |
| `docs/RULES.md` | Kewajiban lomba | RULES menang atas semuanya soal kewajiban lomba |

**Larangan.** PRD tidak boleh memuat task, estimasi waktu, atau nama file kode. Kalau mulai memuat
itu, isinya sudah salah tempat.

**Catatan versi.** v1 tidak memuat Executive Summary terukur dan tidak memuat Evaluation Strategy —
dua bagian yang diwajibkan skill `prd`. v2 menambahkan keduanya dan menata ulang mengikuti schema.

**Konsekuensi ukuran, dicatat sadar.** Dokumen ini tumbuh dari **168 baris (v1) → 325 baris (v2) →
524 baris (snapshot 2026-10-20, termasuk baris kosong)**. Pertambahan v2.1 berasal dari bagian yang
mencatat kejujuran angka: asal target, aturan kalibrasi, baseline pembanding, dan daftar artefak yang
belum ada. Angka ini akan bergeser setiap dokumen disunting; yang penting adalah arahnya, bukan angka
tepatnya.

Keputusan yang diambil: **diterima apa adanya** — §3.2 tidak dipecah ke dokumen terpisah dan tidak
dipangkas. Alasannya, bagian yang membuat dokumen memanjang justru bagian yang menentukan apakah
jawaban agent bisa dipercaya. Memindahkannya ke dokumen lain akan membuat PRD terlihat ringkas tetapi
memutus keterkaitan antara "apa yang dijanjikan" dan "bagaimana dibuktikan".

**Risiko dari keputusan itu, dinyatakan terbuka:** dokumen sepanjang ini lebih jarang dibaca ulang
daripada dokumen 168 baris. Mitigasinya — §3.2 hanya perlu dibaca utuh saat P0 T0.8, P1 T1.8, P3, dan
P8. Di luar itu, tabel KPI di §1.3 sudah cukup.

---

## 1. Executive Summary

### 1.1 Problem Statement

Pertanyaan kerja tersebar di banyak sistem — database, spreadsheet, API partner — sehingga
seseorang harus menunggu tim data untuk mendapat jawaban, dan jawaban yang datang tidak bisa ia
periksa sendiri. Agent percakapan tidak menutup celah ini: ia tidak mencapai data itu, tidak
mengingat konteks antar sesi, dan tidak menjelaskan dari mana jawabannya berasal.

### 1.2 Proposed Solution

Weebo adalah agent harness open source self-hosted yang menyatukan tiga hal: **mencapai** data
tersebar lewat Zetaris, **mengingat** konteks kerja lewat Meterless H-MEM, dan **menjelaskan** alasan
di balik setiap jawaban beserta sumbernya. Satu runtime, banyak client, BYOK, tanpa layanan hosted.

### 1.3 Success Criteria

Target, **bukan** hasil pengukuran. Belum satu pun diukur. Cara ukurnya ada di §3.2.

| # | KPI | Definisi | Target | Kapan diukur |
|---|---|---|---|---|
| **K1** | Akurasi sitasi | Dari jawaban yang menyebut sumber, persentase di mana sumber itu **ada** dan **benar-benar memuat** fakta yang diklaim | **≥ 90%** | P1 (smoke), P3, P5, P8 |
| **K2** | Tingkat fabrikasi | Dari pertanyaan yang datanya **tidak ada**, jumlah jawaban yang mengarang sumber atau angka | **0** | P1, P3, P5, P8 |
| **K3** | Kelengkapan jejak | Persentase jawaban dengan jejak penuh: tool, argumen, ringkasan hasil | **100%** | P2, P3, P5 |
| **K4** | Penegakan policy | Persentase tool terlarang yang ditolak **sebelum** dieksekusi | **100%** | P2 |
| **K5** | Recall memori | Dari 10 fakta yang disemai, persentase terpanggil benar di sesi berbeda | **≥ 80%** | P3, P5 |

**Kenapa lima ini, bukan "pengguna aktif" atau "waktu hemat".** Dalam build window tidak akan ada
pemakaian nyata, jadi metrik adopsi tidak bisa diklaim tanpa berbohong. Lima KPI di atas adalah
kemampuan yang **bisa dibuktikan hari itu juga**, dengan hasil yang bisa diperiksa ulang orang lain.

#### Status dan asal angka target

**Nol pengukuran per 2026-10-18.** Kelima KPI di atas seluruhnya **target**, bukan hasil. Tidak ada
satu pun angka yang sudah diukur.

**Asal angka target: dipilih tanpa dasar empiris.** Angka 90% dan 80% ditetapkan berdasarkan penilaian
kualitatif, bukan dari data, benchmark, atau pengukuran pendahuluan. Tidak ada studi yang mendasari
angka itu. Ini dinyatakan terbuka supaya tidak ada yang mengira angka tersebut punya otoritas
empiris — dan supaya tidak dipertahankan hanya karena sudah tertulis.

**Karena itu target berstatus `provisional`.** Aturan kalibrasinya:

| Item | Aturan |
|---|---|
| Kapan ditinjau | Setelah eval 30 penuh **pertama**, yaitu keluar P3 |
| Siapa yang memutuskan | User. Agent hanya mengusulkan beserta alasannya |
| Arah perubahan | Boleh **naik maupun turun**. Menurunkan target bukan pelanggaran — mempertahankan target yang terbukti tidak masuk akal justru lebih buruk |
| Syarat formal | Setiap perubahan wajib tercatat di `eval/CHANGELOG.md` dengan: angka lama, angka baru, alasan, tanggal, dan siapa yang menyetujui |
| Larangan | Mengubah target **tanpa** alasan tertulis. Mengubah target agar hasil yang buruk terlihat baik |
| Yang tidak boleh berubah | K2 (fabrikasi) tetap **0**. Itu bukan target yang bisa dikalibrasi turun — ia syarat kejujuran |

**Yang tetap berlaku setelah kalibrasi:** angka target lama tidak dihapus dari changelog. Riwayatnya
harus terbaca, supaya terlihat kalau target pernah diturunkan dan mengapa.

**Metrik pendukung, bukan KPI:** waktu jawab p50 < 30 detik pada dataset demo. Tidak dijadikan KPI
karena bergantung pada model pihak ketiga yang latensinya di luar kendali kita.

**Aturan pelaporan KPI.** Jika target tidak tercapai, laporkan **angka sebenarnya**. Dilarang menulis
"jarang berhalusinasi", "cukup akurat", atau "cukup cepat" tanpa angka. K2 yang tidak nol adalah
temuan, bukan alasan menghapus KPI-nya.

## 2. User Experience & Functionality

### 2.1 User primer — knowledge worker di tim kecil

**Siapa:** analis, operations, atau product manager di tim 3–30 orang. Tidak menulis kode. Sudah
terbiasa dengan spreadsheet dan dashboard, tetapi tidak punya akses langsung ke database.

**Yang ia kerjakan:** menjawab pertanyaan operasional yang butuh data dari lebih dari satu sistem.

**Rasa sakitnya:** bergantung pada antrean tim data untuk pertanyaan yang seharusnya selesai dalam
hitungan menit. Dan ketika jawaban datang, ia tidak bisa memeriksa dari mana asalnya.

**Kenapa ia yang primer:** ia penerima manfaat sebenarnya, kerugiannya terukur, dan ia yang paling
membutuhkan penjelasan *"kenapa"* — sehingga selaras dengan track yang dipilih (Reasoning
Architecture).

### 2.2 Adopter — developer atau IT di tim yang sama

**Siapa:** orang teknis yang memasang dan merawat Weebo. Paham Node, API key, dan MCP.

**Yang ia pedulikan:** kendali. Data tidak keluar dari infrastruktur sendiri, model bisa diganti
(BYOK), setiap tool call tercatat, dan tidak ada tagihan per kursi.

**Kenapa ia bukan user primer:** ia bukan yang mendapat manfaat dari jawaban agent. Ia yang
memungkinkan user primer mendapatkannya. Kalau kita menyebut dia primer, narasi Impact jatuh ke
"alat untuk developer" — pasar yang sudah padat dan sulit dibedakan.

### 2.3 Bukan user

Sengaja dinyatakan supaya tidak menjadi scope creep:

- Tim enterprise dengan kebutuhan tata kelola formal (SOC 2, audit regulator).
- Pengguna yang ingin mengunggah data ke layanan hosted milik kami — Weebo self-hosted, tidak ada
  layanan hosted.
- Pengguna non-teknis yang tidak punya siapa pun untuk memasang runtime.

### 2.4 User story dan acceptance criteria

Prioritas: **Must** = submission tidak jujur tanpa ini. **Should** = sangat diinginkan.
**Could** = kalau waktu tersisa. Fase merujuk ke `docs/PHASES.md`.

#### Mencapai data (pilar *bertindak*)

| ID | Story | Prioritas | Fase |
|---|---|---|---|
| US-01 | Sebagai user primer, aku bertanya dalam bahasa natural dan mendapat jawaban yang menyebut sumber datanya | Must | P1 |
| US-02 | Sebagai user primer, aku bisa melihat langkah yang diambil agent sebelum menjawab | Must | P1, P2 |
| US-03 | Sebagai adopter, aku bisa membatasi tool apa yang boleh dipanggil agent | Must | P2 |
| US-04 | Sebagai adopter, aku bisa meninjau catatan setiap tool call yang terjadi | Must | P2 |
| US-05 | Sebagai user primer, aku bisa menghubungkan sumber data baru tanpa mengubah kode | Should | P2 |

**AC US-01**
- Jawaban mengutip minimal satu sumber nyata (nama tabel, file, atau endpoint).
- Jika sumber tidak dapat diakses, agent menyatakan tidak tahu. Tidak mengarang.
- Waktu jawab di bawah 30 detik pada dataset demo.

**AC US-02**
- Setiap jawaban menyertakan jejak: tool apa dipanggil, argumen apa, ringkasan hasil.
- Jejak dapat dibuka dan ditutup di PWA.
- Jejak tersimpan di audit log, bukan hanya ditampilkan lalu hilang.

**AC US-03**
- Tool yang tidak diizinkan ditolak sebelum dieksekusi, bukan setelah.
- Penolakan tercatat beserta alasannya.
- Tidak ada jalur yang melewati policy layer.

**AC US-04**
- Audit log memuat waktu, tool, argumen, hasil, dan keputusan allow/deny.
- Log dapat dibaca ulang setelah runtime restart.

**AC US-05**
- Connector baru dapat didaftarkan lewat konfigurasi, tanpa perubahan kode inti.
- Connector yang gagal terhubung melaporkan penyebabnya, bukan gagal diam-diam.

#### Mengingat (pilar *memory*)

| ID | Story | Prioritas | Fase |
|---|---|---|---|
| US-06 | Sebagai user primer, agent mengingat konteks dari sesi sebelumnya | Must | P3 |
| US-07 | Sebagai user primer, aku bisa melihat memori mana yang dipakai untuk sebuah jawaban | Must | P3 |
| US-08 | Sebagai user primer, aku bisa menghapus memori tertentu | Should | P3 |

**AC US-06**
- Fakta yang relevan dari sesi lama tersedia di sesi baru tanpa diulang oleh user.
- Memori tidak bocor antar workspace.

**AC US-07**
- Jawaban yang memakai memori menautkan entri memori yang dipakai.
- Entri dapat ditelusuri sampai ke sesi asalnya.

**AC US-08**
- Penghapusan bersifat permanen dan tidak muncul lagi di retrieval berikutnya.

#### Menjelaskan (pilar *reasoning*)

| ID | Story | Prioritas | Fase |
|---|---|---|---|
| US-09 | Sebagai user primer, aku bisa memahami mengapa agent mengambil kesimpulan tertentu | Must | P1, P3 |
| US-10 | Sebagai adopter, aku bisa mengganti model tanpa mengubah kode | Must | P2 |

**AC US-09**
- Penjelasan memuat urutan langkah, bukan hanya kesimpulan akhir.
- Penjelasan menyebut sumber data yang dipakai di setiap langkah yang mengutip data.

**AC US-10**
- Model dipilih lewat konfigurasi, bukan tertanam di kode.
- Mengganti model tidak memerlukan perubahan pada client.

#### Permukaan dan operasi

| ID | Story | Prioritas | Fase |
|---|---|---|---|
| US-11 | Sebagai adopter, aku bisa memasukkan API key sendiri dan key itu tidak bocor | Must | P5 |
| US-12 | Sebagai user primer, aku memakai Weebo di ponsel dan desktop dengan kemampuan setara | Must | P5 |
| US-13 | Sebagai user primer, tugas terjadwal berjalan tanpa client terhubung | Should | P6 |
| US-14 | Sebagai adopter, aku bisa menjalankan Weebo dari terminal untuk scripting | Should | P1 |
| US-15 | Sebagai adopter, aku mendapat aplikasi desktop dari codebase yang sama | Could | — |
| US-16 | Sebagai calon pengguna, aku memahami produk ini dari halaman publik | Could | P7 |

**AC US-11**
- Key tersimpan di keychain OS atau environment, tidak di client.
- Key tidak muncul di log, pesan error, atau bundle yang dikirim ke browser.
- Key dapat diganti tanpa restart penuh.

**AC US-12**
- Tata letak berfungsi pada lebar 375px dan 1440px.
- Tidak ada scroll horizontal pada kedua lebar itu.
- Target sentuh minimal 44px di ponsel.
- Fitur inti (bertanya, melihat jejak, melihat memori) tersedia di kedua ukuran.

**AC US-13**
- Tugas berjalan sesuai jadwal tanpa client terhubung.
- Hasil tugas dapat dilihat setelah client tersambung kembali.

**AC US-14**
- Alur utama dapat diselesaikan dari terminal tanpa membuka PWA.

### 2.5 Non-goals

Dinyatakan tegas supaya tidak menjadi perdebatan di tengah fase.

- **Bukan chatbot.** Setiap fitur harus lolos pertanyaan: apakah ini membuat agent melakukan pekerjaan
  nyata?
- **Bukan layanan hosted.** Tidak ada akun, langganan, atau tagihan per kursi.
- **Bukan platform tata kelola enterprise.** Zetaris menangani akses data; kita tidak membangun
  lapisan kepatuhan sendiri.
- **Bukan pelatihan atau fine-tuning model.** Kita memakai model yang ada.
- **Bukan alat kolaborasi tim.** Satu instalasi untuk satu pengguna atau satu workspace kecil.
- **Bukan pembangun workflow visual.** Tool dipilih oleh agent, bukan dirangkai manual oleh user.
- **Bukan aplikasi native lebih dulu.** PWA adalah jalur kirim utama; Electron dan Capacitor menyusul
  saat dependensinya terpenuhi (ADR-010).

## 3. AI System Requirements

### 3.1 Tool requirements

| Tool | Dipakai untuk | Sumber | Batasan |
|---|---|---|---|
| `zetaris.query` | Menjalankan query baca ke sumber data terhubung | Zetaris (MCP atau REST, diputuskan P0 T0.3) | **Read-only.** Tidak ada operasi tulis di build window. Hasil membawa metadata sumber untuk sitasi (L1) |
| `zetaris.schema` | Membaca daftar tabel dan kolom yang tersedia | Zetaris | Read-only. Juga dipakai mendeteksi L2 (tabel ada, akses kurang) |
| `memory.store` | Menyimpan fakta dan konteks sesi | Meterless H-MEM via `MemoryPort` | Tidak boleh menyimpan secret |
| `memory.recall` | Mengambil memori relevan untuk sebuah giliran | Meterless H-MEM via `MemoryPort` | Hasil selalu disertai id entri |
| `model.chat` | Menghasilkan jawaban dan rencana tool | NVIDIA NIM | Kena rate limit; perlu fallback model kedua |
| `model.embed` | Embedding untuk memori | NVIDIA `nemotron-3-embed-1b` | 2048 dimensi; kuota gratis terbatas |

Setiap giliran berakhir di tepat satu tingkat pengetahuan (L0–L4) sesuai ADR-017, dan tingkat itu
tercatat di trace. Semua tool melewati **policy layer** (`packages/core`). Tidak ada jalur yang
melewatinya — ini diverifikasi oleh K4.

### 3.2 Evaluation strategy

**Ini bagian yang menentukan apakah klaim kita bisa dipercaya.** Tanpa ini, "agent menjelaskan kenapa"
hanya klaim pemasaran.

#### Dataset demo

- Dibangun **oleh kita**, sintetis, disimpan di `eval/dataset/` di dalam repo.
- Skala kecil supaya bisa diperiksa tangan: sekitar **3 tabel, total ~200 baris**.
- Wajib dinyatakan **sintetis** di README dan di submission. Jangan pernah memasukkan data nyata
  milik siapa pun ke repo.
- Alasan sintetis: data enterprise nyata bukan milik kita untuk dipublikasikan, dan hasil eval harus
  bisa direproduksi orang lain dari clone bersih.

#### Golden set

Tersimpan di `eval/golden/`, satu file per kategori. Total **30 entri**.

| Kategori | Jumlah | Isi |
|---|---|---|
| Lookup satu tabel | 5 | Jawaban ada di satu tabel, satu filter |
| Lintas tabel | 5 | Butuh join atau korelasi dua tabel |
| Agregasi | 5 | Hitung, rata-rata, atau tren |
| Rentang waktu | 3 | Filter berdasarkan periode |
| Butuh memori | 2 | Hanya bisa dijawab jika konteks sesi sebelumnya diingat |
| **Tidak bisa dijawab** | **10** | Data tidak ada, tabel tidak ada, atau periode kosong |

Setiap entri memuat: pertanyaan, jawaban yang diharapkan (ditulis manusia), sumber yang diharapkan,
kategori, dan penanda apakah butuh memori.

**Bekukan sebelum P3.** Setelah dibekukan, perubahan hanya boleh terjadi dengan alasan tertulis di
`eval/CHANGELOG.md`. Tanpa aturan ini, golden set akan diam-diam disesuaikan dengan implementasi — dan
eval kehilangan seluruh maknanya.

#### Rubrik penilaian

**K1 — akurasi sitasi.** Tiga pemeriksaan, semuanya harus lulus. Tidak ada nilai sebagian.

1. Sumber yang dikutip benar-benar ada di dataset?
2. Sumber itu benar-benar memuat nilai atau fakta yang diklaim?
3. Angka atau pernyataan di jawaban cocok dengan isi sumber?

**K2 — abstention.** Hanya ada lulus atau gagal.

- **Lulus:** menyatakan tidak punya datanya, dan **tidak** mengutip sumber apa pun.
- **Gagal:** mengutip sumber, atau menyatakan angka sebagai fakta.
- **Gagal berat:** mengutip sumber nyata tetapi menempelkan fakta yang tidak ada di dalamnya.

**K3 — kelengkapan jejak.** Diperiksa otomatis: ada tool, ada argumen, ada ringkasan hasil. Tidak ada
penilaian manusia.

**K4 — penegakan policy.** Test otomatis: panggil tool terlarang, pastikan ditolak sebelum eksekusi
dan penolakan tercatat.

**K5 — recall memori.** Skenario otomatis: semai 10 fakta di sesi A, mulai sesi B, hitung berapa yang
terpanggil benar.

#### Runner

- `npm run eval` menjalankan golden set lewat **jalur yang sama dengan CLI** — bukan jalur khusus
  eval, karena jalur khusus akan mengukur hal yang berbeda dari yang dipakai user.
- Hasil ditulis ke `eval/results/<tanggal>-<fase>.json` plus ringkasan yang bisa dibaca manusia.
- Model yang dipakai **dicatat di hasil** (nama dan versi). Mengganti model membuat hasil lama tidak
  bisa dibandingkan.
- Suhu 0. Jika model tidak mendukung determinisme penuh, catat itu sebagai keterbatasan.
- Hasil di-commit setiap kali eval dijalankan, supaya jejaknya terlihat.

#### Kapan dijalankan

| Titik | Cakupan | Alasan |
|---|---|---|
| Keluar P1 | **5 pertanyaan** (smoke) | Membuktikan pipa menghasilkan sitasi sama sekali, bukan mengukur kualitas |
| Keluar P3 | **30 penuh + baseline** | Memori sudah masuk; K1, K2, K5 baru bermakna di sini. Titik kalibrasi target |
| Keluar P5 | **30 penuh lewat PWA** | Membuktikan jalur PWA setara dengan CLI, bukan hanya UI-nya jalan |
| P8 sebelum submit | **30 penuh, final** | Angka inilah yang dikutip di submission |

#### Baseline pembanding

**Masalahnya:** angka "akurasi sitasi 90%" tidak bermakna tanpa pembanding. Juri tidak bisa tahu apakah
itu bagus, dan kita sendiri tidak bisa tahu apakah memori dan Zetaris benar-benar memberi nilai.

**Karena itu setiap run penuh dijalankan dalam dua mode**, pada golden set yang sama, dengan model
yang sama, pada waktu yang berdekatan:

| Mode | Yang aktif | Yang dimatikan |
|---|---|---|
| **Baseline** | Model + Zetaris | Memori (tidak ada recall, tidak ada store) |
| **Penuh** | Model + Zetaris + memori | — |

**Yang dibandingkan:** K1, K2, dan K5. K3 dan K4 tidak dibandingkan karena keduanya soal
infrastruktur, bukan kualitas jawaban.

**Dua pertanyaan yang dijawab baseline:**

1. Apakah memori menaikkan K1 dan K5? Jika tidak, pilar memory tidak memberi nilai terukur — dan itu
   temuan yang harus dinyatakan, bukan disembunyikan.
2. Apakah memori menurunkan K2 (fabrikasi)? Jika memori justru membuat agent mengarang lebih yakin,
   itu risiko yang harus terlihat.

**Baseline tidak membandingkan Zetaris vs tanpa Zetaris.** Tanpa Zetaris, agent tidak punya data sama
sekali, sehingga hampir semua pertanyaan akan dijawab "tidak tahu" — itu membandingkan ada-tidaknya
data, bukan kualitas reasoning. Yang dibandingkan hanya ada-tidaknya memori.

**Hasil baseline di-commit bersama hasil penuh** di `eval/results/`, dengan penanda mode di dalam file.

#### Siapa menilai

- **K1 dan K2 dinilai dua orang secara independen** pada run final. Selisih pendapat dicatat apa
  adanya, tidak dirata-ratakan menjadi satu angka yang menyembunyikan perbedaan.
- Jika hanya satu orang tersedia, tulis di submission bahwa penilaian dilakukan satu orang. Itu
  keterbatasan yang jujur, bukan yang perlu disembunyikan.
- K3, K4, K5 otomatis — tidak ada penilaian manusia.

#### Batas yang harus dinyatakan

Dilarang menyebut hasil ini sebagai *benchmark*.

- **N = 30 terlalu kecil** untuk klaim generalisasi. Ini smoke eval, bukan benchmark.
- **Dataset sintetis** tidak mewakili data enterprise nyata. Hasil tidak bisa dipindahkan.
- **Satu model, satu pasangan bahasa.** Tidak ada klaim lintas model.
- **Dibuat oleh orang yang juga menulis implementasi.** Bias ada. Mitigasi: golden set dibekukan
  sebelum P3, dan rubriknya biner sehingga sulit ditafsirkan longgar.

#### Belum ada — status per 2026-10-18

Ini rencana, bukan sesuatu yang sudah berdiri. Jangan merujuk ke bagian ini seolah artefaknya ada.

| Artefak | Status | Dibuat di |
|---|---|---|
| `eval/dataset/` (dataset sintetis) | **belum ada** | P1 T1.8 |
| `eval/golden/` (30 entri) | **belum ada** | P1 T1.8 |
| `npm run eval` (runner) | **belum ada** | P1 T1.8 |
| `eval/CHANGELOG.md` | **belum ada** | P1 T1.8 (dibuat saat pembekuan) |
| `eval/results/` (hasil run) | **belum ada** | P1 T1.8 (run smoke pertama) |
| Mode baseline | **belum ada** | P3 (run penuh pertama) |
| Angka K1–K5 | **belum ada satu pun** | P1 (smoke, bukan pengukuran kualitas) |

**Konsekuensi yang harus diingat:** selama P1 T1.8 belum selesai, seluruh §3.2 ini adalah janji tanpa
bukti. Jangan mengutip "kami mengevaluasi kualitas jawaban" di dokumen mana pun sebelum runner benar-
benar berjalan dan hasilnya ada di `eval/results/`.

### 3.3 Model requirements

| Kebutuhan | Nilai | Status |
|---|---|---|
| Model chat | NVIDIA NIM, model yang tersedia di akun kita | belum terverifikasi (P0 T0.4) |
| Model fallback | Minimal satu model kedua di katalog | harus ada — rate limit saat demo adalah risiko nyata |
| Embedding | `nemotron-3-embed-1b`, 2048 dimensi | belum terverifikasi (P0 T0.4) |
| Penggantian model | Lewat konfigurasi, bukan kode (US-10) | syarat arsitektur |
| Suhu untuk eval | 0 | syarat evaluasi |

## 4. Technical Specifications

### 4.1 Architecture overview

Monorepo TypeScript. Satu runtime, banyak client. Runtime adalah satu-satunya yang menyentuh
kapabilitas platform; client hanya berbicara lewat `packages/protocol`.

```
apps/runtime    Server lokal: agent loop, scheduler, MCP, secret (Node)
apps/cli        Client terminal
apps/web        Client PWA (React + Vite)
packages/core   Agent loop (intent → memory → plan → tool → verify), isomorphic
packages/protocol  Kontrak runtime–client, berversi
packages/meterless Adapter Meterless (engine pihak ketiga di vendor/hmem)
packages/zetaris   Client Zetaris (MCP/REST, typed)
```

Detail alur data dan batas modul: `docs/ARCHITECTURE.md`. Alasan pilihan: `docs/DECISIONS.md`
(ADR-001 … ADR-017). PRD tidak mengulang keduanya.

### 4.2 Integration points

| Titik integrasi | Bentuk | Auth | Status |
|---|---|---|---|
| Zetaris | MCP atau REST (diputuskan P0 T0.3) | API key per organisasi | belum terverifikasi |
| NVIDIA NIM | Chat Completions + embeddings, `https://integrate.api.nvidia.com/v1` | `nvapi-...` | belum terverifikasi |
| Meterless H-MEM | Pustaka TypeScript, di-vendor | — | belum di-vendor (P0 T0.6) |
| Connector MCP | MCP + OAuth 2.1 | OAuth 2.1 | direncanakan, P2 |
| Keychain OS | Penyimpanan secret | — | direncanakan, P5 |

### 4.3 Security and privacy

**Secret.**

- API key disimpan di keychain OS atau environment. **Tidak pernah** di client, kode, atau repo.
- Key tidak boleh muncul di log, pesan error, jejak audit, atau bundle browser. Ini AC US-11 dan
  diperiksa pada K4.
- `.env` masuk `.gitignore`. Riwayat commit diaudit sebelum submit.

**Data.**

- Weebo **self-hosted**: tidak ada telemetri, tidak ada akun, tidak ada server kami.
- Dataset demo **sintetis**. Tidak pernah ada data nyata milik siapa pun di repo.
- Audit log tersimpan **lokal**, berisi tool, argumen, dan hasil. Argumen bisa memuat potongan data —
  karena itu log lokal, tidak pernah dikirim ke mana pun.

**Data yang tetap keluar dari mesin pengguna.** Ini harus dinyatakan jujur, bukan disembunyikan:

| Ke mana | Apa | Kapan |
|---|---|---|
| NVIDIA NIM | Prompt dan konteks yang diperlukan untuk menjawab | Setiap giliran |
| Zetaris | Query dan parameter filter | Setiap pemanggilan tool data |

Klaim "data tidak pernah keluar" akan salah. Yang benar: **data tidak disimpan atau dipusatkan oleh
Weebo**, tetapi pertanyaan dan query tetap dikirim ke dua layanan itu. Ini harus tertulis di README
dan di submission.

**Batas yang dinyatakan.** Weebo bukan alat kepatuhan. Ia tidak memberi jaminan SOC 2, tidak
menyamarkan PII, dan tidak menegakkan kebijakan retensi. Itu di luar cakupan (§2.5).

## 5. Risks & Roadmap

### 5.1 Phased rollout

| Tahap | Isi | Fase | Syarat |
|---|---|---|---|
| **MVP** | CLI + PWA, Zetaris + Meterless, policy + audit, jejak alasan | P1–P5 | K1, K2, K3, K4, K5 terukur |
| **v1.1** | Autonomy (scheduler, channel), aplikasi desktop, gateway kuota | P6 + backlog 2–3 | MVP lulus |
| **v2.0** | Engine memori sendiri, katalog connector luas, cloud sync opsional | Backlog 5, 7, 9 | v1.1 lulus |

Tahap tidak ditunda karena tanggal, melainkan karena dependensi (`AGENTS.md` §8.1). Daftar lengkap:
`docs/PHASES.md` §"Backlog lintas fase".

### 5.2 Technical risks

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Rate limit NIM saat demo | Demo gagal di depan juri | Model fallback di katalog + cache respons (risiko P1) |
| Zetaris tidak menyediakan governance yang bisa didemokan | Klaim Impact melemah | Turunkan ke "akses data tersebar" (§5.3) |
| Meterless tidak bisa dijalankan dari Node | Pilar memory hilang | Uji di P0 T0.6 sebelum kode ditulis |
| Transport ponsel → runtime tidak selesai | Demo US-12 hilang | Putuskan di P0 T0.7; demo desktop jika gagal |
| Golden set disesuaikan dengan implementasi | Eval jadi tidak bermakna | Dibekukan sebelum P3 + `eval/CHANGELOG.md` |
| Target KPI tidak tercapai | Klaim jujur jadi lemah | Laporkan angka sebenarnya; itu temuan, bukan kegagalan yang disembunyikan |
| Scope melebar (connector, gateway, landing) | Spine tidak selesai | Non-goals §2.5 + backlog berbasis dependensi |

### 5.3 Asumsi yang belum terverifikasi

Wajib diselesaikan atau diturunkan klaimnya di P0. Jangan menulisnya sebagai fakta di submission
sebelum terbukti.

| # | Asumsi | Kalau salah |
|---|---|---|
| 1 | Zetaris menyediakan akses data ter-governance yang bisa didemokan | Kata "governed" diturunkan menjadi "akses data tersebar". Klaim Impact disesuaikan |
| 2 | Meterless H-MEM dapat di-vendor dan dijalankan dari Node | Cari jalur integrasi lain, atau turunkan pilar memory |
| 3 | NVIDIA Nemotron embedding dapat dipakai dalam kuota gratis | Pakai embedding alternatif; pilar memory tetap, kualitas turun |
| 4 | Transport ponsel → runtime dapat diselesaikan (P0 T0.7) | Demo US-12 hanya di desktop, dan itu dinyatakan jujur |
| 5 | Dataset sintetis cukup mewakili pola pertanyaan nyata | Eval mengukur pipa, bukan kegunaan nyata — dan itu harus dinyatakan |

## 6. Rujukan

- Kewajiban lomba: `docs/RULES.md` §5.1 (Zetaris, Meterless, Cursor), §6.1–§6.4 (deliverable).
- Pilihan teknis: `docs/DECISIONS.md` ADR-001 … ADR-017.
- Arsitektur: `docs/ARCHITECTURE.md`.
- Urutan pengerjaan: `docs/PHASES.md` dan file fase di `docs/phases/`.
- Batasan tim dan bobot penilaian: `docs/CONTEXT.md`.
