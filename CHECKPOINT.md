# CHECKPOINT

Sumber kebenaran status kerja. Wajib dibaca di awal setiap sesi dan diperbarui setiap ada perubahan
bermakna.

**Terakhir diperbarui:** 2026-10-20

---

## Status saat ini

| Item | Nilai |
|---|---|
| Fase aktif | **P0 — Preflight** (berjalan sejak 2026-10-20) |
| Build window | 22–27 Okt 2026 UTC (belum dibuka) |
| Track | Track 03 — Reasoning Architecture |
| Kode produk | Belum ada (sesuai aturan eligibilitas) |

## Pembagian lapisan

**Belum ditetapkan.** Dipilih di awal P1 dan dicatat di sini. Tiga opsi ada di `docs/PHASES.md`
bagian "Pembagian pemilik lapisan". `CODEOWNERS` tetap hanya `@MuhammadFaza-DU` sampai itu berubah.

## Yang sudah selesai

- Repo dibuat: `https://github.com/MuhammadFaza-DU/weebo` — **public**, lisensi **MIT terdeteksi** di
  halaman repo, branch default `main`.
- Commit awal `a8ba3dc` berisi 22 file scaffolding. **CI hijau** (run 39107601114).
- Proteksi `main` aktif dan terverifikasi: wajib PR, wajib 1 approval, wajib review CODEOWNERS,
  **CI `Lint, typecheck, test` wajib hijau**, stale review otomatis gugur, semua diskusi wajib
  resolved, force push ditolak, penghapusan branch ditolak.
  `enforce_admins=false` sehingga maintainer bisa bypass saat mendesak.
- Batasi-dismiss-review **per-user** tidak bisa dipasang: API menolak dengan 422 *"Only organization
  repositories can have users and team restrictions"* — pesan itu merujuk pada `restrictions` (siapa
  yang boleh push), yang memang hanya tersedia untuk repo Organization. Perlu repo milik Organization.
  **Catatan koreksi:** `dismiss_stale_reviews` sendiri **aktif** (`true`); yang tidak bisa dipasang
  adalah pembatasan siapa yang boleh melakukan dismiss.
- **Kolaborator aktif (terverifikasi 2026-10-19):** `slamsmart` dan `Manzera-Azb` sudah **menerima
  undangan** dengan izin **write**. Dua bukti yang saling mendukung: `GET /repos/.../collaborators`
  mengembalikan keduanya dengan `role: write` (plus `MuhammadFaza-DU` sebagai `admin`), dan
  `GET /repos/.../invitations` mengembalikan daftar **kosong** (tidak ada undangan pending).
- Topics repo: `agent-harness`, `ai-agent`, `llm`, `mcp`, `open-source`, `pwa`, `typescript`.
- Scaffolding dokumentasi: `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`,
  `CODEOWNERS`, `PREEXISTING.md`, `.gitattributes`, `.github/` (CI + template issue/PR).
- `docs/`: `ARCHITECTURE.md`, `DECISIONS.md` (ADR-001…ADR-016), `CONTEXT.md`, `SPONSORS.md`,
  `SETUP-SPONSORS.md`, `REFERENCES.md`, `PHASES.md` (termasuk panduan pecah task, 3 opsi pembagian
  lapisan, dan backlog berbasis dependensi), `SUBMISSION.md`, `CURSOR-LOG.md`, **`RULES.md`**
  (transkripsi terverifikasi §01–§10 aturan lomba), **`PRD.md`** (problem, user primer/adopter,
  16 user story dengan acceptance criteria, non-goals, **5 KPI terukur**, **evaluation strategy**),
  `phases/P0-preflight.md`, `phases/P1-walking-skeleton.md`.
- `AGENTS.md` §1.1: urutan baca wajib untuk agent baru (9 dokumen).
- `AGENTS.md` §21: **aturan sinkronisasi lintas dokumen** — larangan duplikasi fakta turunan, pemicu
  kewajiban sync, peta dampak (file mana memengaruhi file mana), dan kewajiban menjalankan pemeriksa
  sebelum commit.
- `scripts/check-docs.mjs`: pemeriksa konsistensi dokumen tanpa dependensi (9 kelas pemeriksaan,
  termasuk **detektor kontradiksi `wajib` vs `opsional`** untuk Zetaris/Meterless/Cursor/NVIDIA).
  `scripts/check-docs.selftest.mjs`: selftest 20 kasus yang menyuntik kerusakan untuk membuktikan
  pemeriksa masih bekerja. Keduanya berjalan di CI pada setiap push dan PR.
- `AGENTS.md` §21.7: **review makna wajib** saat peta dampak §21.3 terpicu — karena pemeriksa tidak
  bisa membaca makna. Dua larangan eksplisit: (a) dilarang menyeragamkan kata tanpa alasan,
  (b) dilarang menyalin ulang fakta yang sudah punya sumber — ganti dengan rujukan.
- Keluaran pemeriksa diubah: dari `"tidak ada inkonsistensi"` menjadi **`"tidak ada kerusakan BENTUK"`**
  disertai daftar hal yang **tidak** diperiksa. Ini mencegah `LULUS` disalahartikan sebagai "isi benar".
- **Pemeriksa memakai `git ls-files`, bukan menelusuri disk.** Ditemukan dari selisih lokal (23 berkas)
  vs CI (22 berkas): `rea.md` adalah catatan lokal yang di-exclude. Tanpa perbaikan ini, pemeriksa
  bisa gagal di mesin lokal karena berkas yang tidak akan pernah masuk repo.
- **Pemeriksa menangkap satu bug nyata pada eksekusi pertamanya:** baris tabel `docs/CONTEXT.md` §5
  (NVIDIA + Groq tergabung dalam satu baris). Sudah diperbaiki. Bug serupa di `PREEXISTING.md`
  (baris 7 + 8 tergabung) ditemukan **manual** di sesi yang sama, sebelum pemeriksa ada — itulah yang
  memicu aturan §21 dibuat.
- `AGENTS.md` §1: `docs/PRD.md` ditetapkan sebagai sumber kebenaran "apa dan untuk siapa", dengan
  batas peran tegas — tidak mengatur urutan kerja (file fase) dan tidak mengatur pilihan teknis (ADR).
- `AGENTS.md` §8.1: penundaan berbasis dependensi, dilarang memakai gate tanggal — dengan satu
  pengecualian sah: larangan commit kode produk sebelum 22 Okt 2026 00:00 UTC.
- Catatan belajar lokal (enam folder referensi) dibuat. Diabaikan lewat `.git/info/exclude` (lokal,
  tidak terlihat di repo); terverifikasi tidak ada di GitHub.

## Keputusan produk yang sudah ditetapkan

Dicatat di `docs/PRD.md`, ringkasnya:

- **User primer: knowledge worker di tim kecil** (analis/operations/PM, 3–30 orang, tidak menulis
  kode). Ia penerima manfaat sebenarnya dan paling membutuhkan penjelasan "kenapa" — selaras dengan
  Track 03.
- **Adopter: developer/IT di tim yang sama.** Ia yang memasang dan merawat, bukan yang mendapat
  manfaat dari jawaban agent. Dipisah supaya narasi Impact tidak jatuh menjadi "alat untuk developer".
- **Bukan user:** tim enterprise dengan tata kelola formal, pengguna layanan hosted, non-teknis tanpa
  siapa pun untuk memasang runtime.
- 16 user story berprioritas Must/Should/Could dengan acceptance criteria. Must = submission tidak
  jujur tanpa ini.
- **5 KPI terukur** (`docs/PRD.md` §1.3): akurasi sitasi ≥90%, fabrikasi = 0, kelengkapan jejak 100%,
  penegakan policy 100%, recall memori ≥80%. **Nol pengukuran per 2026-10-18 — semuanya target.**
- **Asal angka target dinyatakan terbuka:** 90% dan 80% **dipilih tanpa dasar empiris** — bukan dari
  data, benchmark, atau studi. Berstatus `provisional`.
- **Aturan kalibrasi target** (`docs/PRD.md` §1.3): ditinjau di keluar P3 setelah eval 30 penuh
  pertama; boleh **naik maupun turun**; wajib lewat `eval/CHANGELOG.md` dengan angka lama/baru +
  alasan + tanggal + penyetuju; **K2 (fabrikasi) tidak boleh dikalibrasi turun** karena itu syarat
  kejujuran, bukan target.
- **Baseline pembanding ditetapkan** (`docs/PRD.md` §3.2): setiap run penuh dijalankan dua mode —
  baseline (tanpa memori) dan penuh (dengan memori) — pada golden set dan model yang sama. Yang
  dibandingkan K1, K2, K5. Tujuannya membuktikan memori benar-benar memberi nilai, bukan diasumsikan.
- **Evaluation strategy ditetapkan** (`docs/PRD.md` §3.2): dataset sintetis ~3 tabel/200 baris, golden
  set 30 entri (20 bisa dijawab + 10 tidak), rubrik biner, runner `npm run eval`, dijalankan di keluar
  P1 (smoke 5), P3, P5, dan P8. Golden set **dibekukan sebelum P3** dengan `eval/CHANGELOG.md`.
- **Batas eval dinyatakan**: N=30 dan dataset sintetis berarti ini **smoke eval, bukan benchmark**.
  Dilarang menyebutnya benchmark di submission.
- **Aturan angka di submission** (`docs/SUBMISSION.md`): hanya angka yang **sudah diukur** boleh muncul
  di README, slide, dan video. Target tidak boleh tampil sendirian tanpa pasangan hasilnya.
- **Panjang PRD diterima apa adanya** — 168 → 325 (v2) → 383 baris (v2.1) karena schema `prd`
  mewajibkan KPI terukur dan evaluation strategy, ditambah bagian kejujuran angka. Tidak dipecah ke
  dokumen terpisah, tidak dipangkas. Risikonya (lebih jarang dibaca ulang) dinyatakan di header PRD,
  dengan mitigasi: §3.2 hanya dibaca utuh di P0 T0.8, P1 T1.8, P3, dan P8.

## Keputusan yang mengikat

Lihat `docs/DECISIONS.md`. Ringkasnya:

- Stack: monorepo TypeScript, satu runtime + banyak client (CLI, PWA, Electron). Runtime adalah
  server lokal; client bicara lewat `packages/protocol`. PWA sebagai jalur kirim utama;
  **Electron** (bukan Tauri) untuk desktop dan Capacitor untuk mobile, dimulai saat dependensinya
  terpenuhi (P5 untuk keduanya, P2 untuk Electron).
- Connector: **MCP + OAuth 2.1** sebagai fondasi; Composio hanya acuan pola, bukan dependensi.
- Meterless: **vendor engine resmi + adapter embedding sendiri** (`MemoryPort`). Tulis ulang dari
  spec menjadi item backlog berprioritas 5 (bergantung pada P3 + `MemoryPort` stabil), bukan "pasca-lomba".
  Embedding memakai NVIDIA `nemotron-3-embed-1b`.
- Free tier: katalog model + gateway Cloudflare Worker yang memegang key NVIDIA NIM, kuota per IP.
- Merge: hanya `@MuhammadFaza-DU`.
- Catatan belajar pribadi disimpan di luar repo dan tidak pernah di-commit.
- **Cursor dipakai untuk review, bukan menulis kode.** Log-nya di `docs/CURSOR-LOG.md`, diisi setiap
  penutupan fase. Jangan mengarang entri log atau mengklaim kode ditulis di Cursor (AGENTS.md §20).

## Belum terverifikasi

Semua item di bawah **dijawab di P0** (`docs/phases/P0-preflight.md`):

- Akses Zetaris — belum didaftarkan. → T0.2. **Ditemukan 2026-10-20:** halaman `zetaris.com`
  menampilkan Hobby $0 free-forever dengan model BYOC (*"you pay your cloud provider for compute"*)
  dan **tidak menampilkan trial 30 hari** seperti yang diasumsikan `docs/SETUP-SPONSORS.md` §2. Jalur
  gratis bisa berarti akun cloud sendiri + compute berbayar. **Belum terverifikasi** — periksa
  instruksi peserta di platform lomba lebih dulu (T0.1).
- Apakah Zetaris bisa dipanggil dari browser — belum diuji. → T0.3
- Akses NVIDIA NIM + rate limit sebenarnya — belum didaftarkan/diukur. → T0.4
- Cursor: plan Free terverifikasi ada, tapi cukup atau tidak untuk 6 hari **belum diuji**. → T0.5
- Meterless: conformance suite belum dijalankan di lingkungan kita. → T0.6
- Registrasi lomba: akun platform ada, **tim belum dibentuk di platform**. → T0.1
- Pembagian pemilik lapisan — belum diputuskan (dipilih di awal P1).
- **Bagaimana ponsel/tablet mencapai runtime di `localhost`** — **terjawab 2026-10-20 (ADR-016)**:
  LAN bind + pairing token. Sisa risiko yang belum diuji: HTTP polos di LAN bukan secure context,
  sehingga PWA tidak installable lewat LAN. Uji nyata menyusul di P5.
- **Apakah Zetaris benar-benar menyediakan akses data ter-governance yang bisa didemokan** — belum
  diverifikasi. Jika tidak, klaim "governed" di PRD §2.1 dan README harus diturunkan menjadi "akses
  data tersebar" sebelum masuk submission. Lihat `docs/PRD.md` §5.3.
- **Belum satu pun KPI diukur** — K1 akurasi sitasi, K2 fabrikasi, K3 kelengkapan jejak, K4 penegakan
  policy, K5 recall memori. Semuanya target `provisional` tanpa dasar empiris. Pengukuran pertama
  (smoke 5 pertanyaan) baru di P1 T1.8, dan smoke **bukan** pengukuran kualitas.
- **Belum ada satu pun artefak eval.** `eval/dataset/`, `eval/golden/` (30 entri), `npm run eval`,
  `eval/CHANGELOG.md`, `eval/results/`, dan mode baseline — **nol semua**. Dibuat di P1 T1.8, baseline
  di P3. Selama itu, §3.2 PRD adalah janji tanpa bukti.
- **Ditemukan saat review makna 2026-10-18 — klaim "materi submission wajib Bahasa Inggris" tidak
  punya dasar di `docs/RULES.md`.** Klaim itu muncul di `AGENTS.md` §1 (Bahasa dokumen), `AGENTS.md`
  §2, dan `docs/PRD.md` baris 4 — tetapi transkripsi aturan **tidak memuat kewajiban bahasa sama
  sekali**. §5.3 justru menyebut *"Any language, framework, model or cloud"* (soal stack, bukan
  bahasa submission). **Belum diperbaiki — menunggu keputusan user.** Pilihan: (a) turunkan statusnya
  dari "syarat wajib lomba" menjadi keputusan tim, atau (b) hapus kewajibannya.

## Risiko dan blocker

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Registrasi tutup 22 Okt 23:59 UTC | Tidak bisa submit | Bentuk tim di platform sebelum tanggal itu |
| Zetaris hanya terjangkau lewat BYOC (compute dibayar di akun cloud sendiri) | Jalur gratis hilang; klaim "governed" melemah | Periksa credits peserta di platform lomba (T0.1); jika tidak ada, turunkan klaim ke "akses data tersebar" (`docs/PRD.md` §5.3) |
| Sponsor access belum ada semua | P1 terblokir | Selesaikan `docs/SETUP-SPONSORS.md` sebelum 22 Okt |
| Scope melebar (connector, gateway, landing) | Spine tidak selesai | Gateway = stretch; landing punya track paralel |

## Belum dikerjakan — berbasis dependensi, bukan tanggal

Aturan lengkap: `AGENTS.md` §8.1. Penundaan **tidak boleh** beralasan tanggal. Syarat mulai: dependensi
terpenuhi · deliverable wajib lomba aman · user setuju.

| Prioritas | Item | Dependensi | Catatan |
|---|---|---|---|
| 1 | Live demo URL (PWA ter-deploy) | P5 selesai | Effort kecil, dampak skor Demo + Product&UX |
| 2 | Desktop native — **Electron** (bukan Tauri) | P5 + P2 selesai | Shell atas UI yang sama; tanpa Rust (ADR-010) |
| 3 | Gateway kuota gratis per IP | P1–P5 lulus | Cloudflare Worker + uji kuota (ADR-004) |
| 4 | APK Android — Capacitor | P5 selesai | Android SDK terpasang |
| 5 | Implementasi engine memori sendiri | P3 + `MemoryPort` stabil | ADR-012 |
| 6 | Landing page polish | P7 selesai | Badge status sudah akurat |
| 7 | Connector katalog luas | MCP + Zetaris stabil | Minimal satu connector eksternal berjalan |
| 8 | Auto-generate skills | P3 + evaluasi kualitas | Butuh set data evaluasi |
| 9 | Cloud sync penyimpanan | P5 + storage runtime stabil | Desain penyimpanan diputuskan dulu |
| 10 | Pindah repo ke GitHub Organization | P8 selesai | Hanya jika kontrol akses dirasa kurang |
| 11 | Domain kustom untuk landing page | P8 selesai | Butuh keputusan anggaran |

Daftar lengkap dengan syarat mulai: `docs/PHASES.md` §"Backlog lintas fase".

## Next action

1. **Jalankan P0** — mulai dari T0.1 (bentuk tim di platform) karena itu blocker paling keras.
2. Selesaikan T0.2–T0.6 (akses sponsor + uji asumsi), catat bukti di `docs/SETUP-SPONSORS.md` §7.
3. Selesaikan T0.8 (protokol evaluasi + bentuk dataset demo) — tanpa ini, K1–K5 di `docs/PRD.md`
   §1.3 tidak bisa diukur, dan T1.8 tidak bisa dimulai.
4. Pilih pembagian lapisan di awal P1, catat di bagian "Pembagian lapisan" di atas.
5. Setelah P0 lulus, mulai P1 (`docs/phases/P1-walking-skeleton.md`).

## Log checkpoint

| Tanggal | Peristiwa |
|---|---|
| 2026-10-18 | Repo dibuat, scaffolding dokumentasi masuk, keputusan produk dicatat |
| 2026-10-19 | Kolaborator `slamsmart` + `Manzera-Azb` terverifikasi **sudah menerima undangan** (izin write); tidak ada undangan pending. Bukan lagi blocker. |
| 2026-10-20 | **P0 dimulai.** T0.7 dan T0.8 ditutup sebagai keputusan: ADR-016 (transport LAN bind + pairing token) dan ADR-015 (protokol evaluasi, dataset merchant payments, penilaian K1/K2 oleh 2 non-penulis per entri). Ditemukan: halaman `zetaris.com` tidak menampilkan trial 30 hari, hanya Hobby BYOC — T0.2 menunggu T0.1. |
