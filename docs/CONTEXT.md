# Konteks Kerja — Pengetahuan yang Tidak Boleh Hilang

Dokumen ini menangkap pengetahuan yang **tidak tersimpan di tempat lain**: bobot penilaian lomba,
batasan tim, fakta aturan yang mengubah strategi, dan cara kerja yang disepakati.

**Status:** setelah reset 2026-10-21, dokumen ini **tidak lagi memuat keputusan produk**. Arah produk
belum ditetapkan. Isi di sini hanya fakta lomba dan metode kerja.

**Baca dokumen ini sebelum mengusulkan perubahan arah.**

---

## 1. Bobot penilaian lomba

Open Agent Hackathon 2026 — skor 100 poin:

| Kriteria | Bobot | Yang dicari juri |
|---|---|---|
| **Impact** | **30** | Konsistensi dengan challenge statement: seberapa efektif solusi menjawab masalah nyata bagi user yang dituju |
| Technical | 20 | Kualitas implementasi, keandalan, arsitektur |
| Innovation | 15 | Orisinalitas dan kreativitas pendekatan |
| Demo | 15 | Kejelasan demo: fungsi dan nilai bagi user |
| Product & UX | 10 | Intuitif, aksesibel, mudah dipakai |
| Sponsor Tech | 10 | Seberapa efektif teknologi sponsor dipakai untuk menjawab masalah |

**Implikasi praktis:** Impact dan Demo bersama bernilai **45 poin**. Kedalaman teknis yang tidak
terlihat di demo nilainya kecil. Setiap keputusan prioritas harus menjawab: *"apakah ini menaikkan
Impact atau Demo?"*

### Yang juri hargai dan yang juri abaikan

| Dihargai | Diabaikan |
|---|---|
| Masalah dan user yang jelas | UI rapi tanpa kedalaman |
| Agent yang **melakukan** kerja, bukan menjelaskannya | Sistem single-agent yang dipresentasikan sebagai agent system |
| Critique dan recovery, bukan pipeline tetap | **Hardcoded demo paths** |
| Eksekusi yang andal | Konsep luas dengan implementasi lemah |
| Pemakaian teknologi sponsor yang efektif | Klaim nilai tanpa bukti |
| Output yang bisa dipakai | |
| Demo yang menjelaskan solusi dengan jelas | |

Sumber: FAQ §8, Hackathon Overview.

## 2. Fakta aturan yang mengubah strategi

| Fakta | Section | Konsekuensi |
|---|---|---|
| **Tie-break pakai Impact, lalu timestamp submission** | §7.3 | **Submit jauh sebelum tenggat.** Kalau Impact sama, yang lebih awal menang |
| Track boleh diganti kapan saja sebelum deadline | §3.3 | Tidak ada gunanya memilih track di awal; pilih saat tahu bentuk akhirnya |
| Track dipilih **saat membuat submission**, bukan saat membuat tim | §3.2 | Membuat tim tidak mengunci track |
| Komposisi tim terkunci saat **submission pertama** dibuat | FAQ §3 | Bentuk tim sebelum mulai submit |
| Hadiah dibagi rata kecuali tim menulis pembagian berbeda | §8.5 | Perlu kesepakatan **tertulis** jika ingin pembagian lain |
| Kode hasil AI sah dan diharapkan | §5.5 | Tidak perlu menyembunyikan pemakaian AI; yang dinilai hasil dan tanggung jawab |
| Cross-track tidak dinilai dua kali | §3.4 | Jangan mencoba memainkan dua track sekaligus |
| Satu akun per peserta; akun ganda mendiskualifikasi seluruh tim | FAQ §2 | |
| Tim 1–5 orang; solo boleh dan bersaing di pool yang sama | FAQ §3 | |
| Submission bisa diperbarui sampai tenggat | FAQ §7 | Tidak harus sempurna sekali kirim |
| Submission yang tidak bisa dijalankan **tidak bisa dinilai** | FAQ §7 | Uji clean setup dari nol sebelum submit |

Transkripsi lengkap: `docs/RULES.md`.

## 3. Track yang tersedia

| # | Track | Yang dibangun |
|---|---|---|
| 1 | Solving Fragmented Intelligence | Kemampuan menemukan dan bekerja lintas sumber data terfragmentasi |
| 2 | The Agent That Can Explain Why | Investigasi lintas sumber, hubungkan temuan, hasilkan jawaban/rekomendasi berbukti |
| 3 | Reasoning Architecture | Mengubah data, pengetahuan, memori, dan penalaran menjadi **keputusan dan aksi** yang andal |
| Bonus | Wildcard [Tinkerer] | Bawa proyek yang sudah ada, kembangkan dengan Zetaris + Meterless. Dinilai dari kerja **baru** |

**Tidak ada track yang "paling mudah"** — tidak ada rating kesulitan. Ambisi build lebih penting
daripada pilihan track. Solusi fokus yang jalan mengalahkan solusi luas yang tidak jalan.

Track boleh berubah sampai tenggat, jadi keputusan ini **tidak mendesak**.

## 4. Hadiah

| Item | Nilai |
|---|---|
| Total prize pool | hingga $20.000 ($15.000 tunai + $5.000 in-kind) |
| Track 1 / 2 1st | $2.000 |
| Track 3 1st | $2.000 |
| Wildcard 1st | $1.000 |

**Hadiah in-kind (terpisah dari skor):**

| Hadiah | Nilai | Catatan |
|---|---|---|
| Best use of NVIDIA Nemotron | NVIDIA DGX Spark (Founder's Edition), $4.699 | Syarat: integrasi NVIDIA yang benar-benar berkontribusi |
| Best use of Cursor-built product | SpaceX Cursor API credits, $2.301 | Mensyaratkan produk **dibangun dengan Cursor**. Kalau tim tidak membangun di Cursor, hadiah ini **tidak boleh** dikejar |

Hadiah tambahan akan diumumkan di participant onboarding 21 Okt.

## 5. Batasan tim — paralelisasi tidak linear

**Realita tim (dinyatakan user 2026-10-20):** 3 orang terdaftar, tetapi hanya **2 yang dapat
diandalkan**, dan anggota ke-2 sedang bekerja sehingga kontribusinya belum diketahui. Asumsi
perencanaan yang dipakai: **bangun seolah hanya 1 orang yang bekerja**.

Ini berarti **3 orang ≠ 3× lebih cepat**, dan rencana harus bertahan bila kontribusi luar nol.

Alasan teknis tambahan: pekerjaan pada satu codebase dengan tipe bersama dan kontrak presisi
memiliki paralelisasi realistis jauh di bawah jumlah orang. **Jangan mengusulkan "kerjakan paralel
semua" tanpa menghitung apa yang berhenti.**

## 6. Peringatan etis dan legal — jangan dilanggar

Ini bukan formalitas. Aturan lomba mensyaratkan submission sebagai *"original work product"* dan
*"solely owned by you"*.

| Jangan | Alasan |
|---|---|
| Menyalin kode/aset/ikon/teks pihak lain ke repo | Melanggar originalitas; risiko **diskualifikasi**, bukan pengurangan nilai |
| Meniru mekanisme fingerprint client pihak lain | Mengakali pembatasan pihak lain; berisiko key diblokir |
| Membongkar binary produk closed source untuk dipakai | Legalitas abu-abu dan tidak diperlukan |
| Menyebut fitur sebagai "live" padahal belum jalan | Juri membandingkan video dengan repo |
| Menyimpan key berbayar di gateway publik | Biaya tak terkendali + pelanggaran ToS provider |
| Men-commit API key | FAQ §7: *"Never."* Gunakan `.env` (gitignored) + `.env.example` berisi placeholder |

**Yang sah:** mempelajari pola arsitektur, memakai dependensi open source dengan atribusi, menulis
sendiri seluruh kode produk.

Catatan penting: **engine Meterless di `vendor/hmem` adalah dependensi Apache-2.0, bukan karya tim.**
Ini sudah dinyatakan terbuka di `docs/SPONSORS.md` dan `PREEXISTING.md`. Jangan mengubahnya menjadi
klaim kepemilikan.

## 7. Fakta teknis lingkungan

| Item | Status |
|---|---|
| Node | v24.16.0 |
| npm | 11.13.0 |
| pnpm | **tidak terpasang** |
| Rust / cargo | **tidak terpasang** |
| Java | 17 |
| MCP TypeScript SDK | 1.32.1 tersedia |
| Meterless di npm | **tidak ada** — harus di-vendor |

Angka ini akan berubah; **verifikasi ulang sebelum dipakai** sebagai dasar keputusan.

## 8. Cara kerja yang disepakati

| Hal | Aturan |
|---|---|
| Fase | Gate hasil, bukan durasi. Tanpa timebox |
| **Penundaan** | **Berbasis dependensi, bukan tanggal.** Dilarang menulis "setelah lomba" sebagai alasan. Syarat mulai: dependensi + submission aman + izin user (`AGENTS.md` §8.1) |
| Task | ≤ 2 jam, kriteria selesai objektif, dicatat di `docs/phases/` |
| Keluar fase | 6 syarat: demo-able, CHECKPOINT, commit+tag, approval, laporan verifikasi, **log Cursor** (`AGENTS.md` §8.2) |
| Subagent | Default implementer + reviewer read-only; **tanya user dulu** native atau subagent |
| Merge | Hanya `@MuhammadFaza-DU`; CI wajib hijau; review code owner wajib |
| Desain | Canvas penuh + HALT sebelum kode UI (`AGENTS.md` §11) |
| Bahasa | Dokumen internal Indonesia, materi publik Inggris |
| Cursor | Dipakai untuk **review**, bukan menulis kode. Log diisi agent setiap fase (`AGENTS.md` §20) |
| **`SAMPLE_MODE`** | Kalau produk memanggil API eksternal, wajib ada fallback sehingga sistem tetap jalan tanpa internet. FAQ §5: *"include a fallback mode so your solution still runs if an external API is unavailable"* |
| **Eval tidak boleh hardcoded** | *"Hardcoded demo paths"* ada di daftar yang dihindari juri. Kalau ada runner evaluasi, ia wajib menjalankan jalur yang sama dengan produk |
| **Etos kerja agent** | **Maksimal, tapi tidak memaksa.** Cari sampai habis sebelum menyerah. Kalau sudah maksimal dan tetap tidak ketemu: katakan jujur, lalu ganti dengan analisis mendalam sendiri yang **diberi label sebagai analisis**, bukan data. Sejalan dengan `AGENTS.md` global §1.1c |

## 9. Dukungan selama lomba

| Butuh bantuan soal | Ke mana |
|---|---|
| Scope dan ekspektasi track | Challenge pages di HackOS |
| Setup dan error teknologi sponsor | Folder sponsor di Resources, lalu channel `Help <Sponsor>` |
| Pertanyaan teknis umum | `#help desk` di HackOS |
| Desain agent, framework, debugging | Mentor office hours |
| Pertanyaan aturan | `hackathons@genai.works` (dijawab dalam 1 hari kerja) |
| Cari rekan tim | Team-finding di HackOS |
| Update resmi | **Announcements di HackOS** |

**Discord BUKAN kanal support.** Welcome Guide §13: *"All support during the hackathon happens on
HackOS."* Discord hanya untuk komunitas setelah lomba.

**Mentor tidak membangun project.** Mentor membantu memahami track, navigasi HackOS, dan teknologi
sponsor; masalah teknis mendalam dieskalasi ke support sponsor.

## 10. Asumsi terbuka

| Asumsi | Status |
|---|---|
| Apakah Zetaris bisa dipanggil dari browser, atau wajib lewat server | belum diuji |
| Bagaimana ponsel/tablet mencapai runtime di `localhost` | belum diuji — bergantung pada bentuk produk |
| Akses Zetaris peserta: apakah memberi akses tanpa akun cloud sendiri | belum terverifikasi |
| Rate limit NVIDIA NIM yang sebenarnya | belum diukur |
| Apakah plan Cursor Free cukup untuk 6 hari kerja | belum diuji |
| Pembagian kerja per orang | belum diputuskan |

**Fakta terverifikasi yang tidak perlu diuji ulang:**

- Cursor plan Free **ada**: $0, tanpa kartu kredit, tidak kedaluwarsa. Isi: Agent + Chat + Tab dengan
  kuota terbatas yang **angkanya tidak dipublikasikan Cursor**. Model pihak ketiga tidak termasuk.
- Engine Meterless H-MEM: `vendor/hmem`, Apache-2.0, commit `1742dec`, conformance **13/13 checks
  passed** (exit 0), `npm test` 10/10. Bukti: `docs/SPONSORS.md` §2.

Jika sebuah asumsi menjadi penghalang, **uji dulu**, jangan menebak.
