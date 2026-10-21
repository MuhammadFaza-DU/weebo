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

### Realita tim — dinyatakan user 2026-10-20

Ini **fakta**, bukan asumsi, dan mengubah dasar perencanaan:

| Hal | Kenyataan |
|---|---|
| Anggota terdaftar di platform | 3 orang |
| Anggota yang **dapat diandalkan** | **2 orang** (user + 1) |
| Anggota ke-3 | **Tidak dapat diandalkan**; tidak diketahui akan berkontribusi atau tidak |
| Anggota ke-2 | Sedang bekerja; **tingkat kontribusi belum diketahui** |
| Asumsi perencanaan yang dipakai | **Bangun seolah hanya 1 orang (user) yang bekerja**, tanpa menggantungkan diri pada anggota lain |

**Konsekuensi langsung:** rencana pembagian lapisan per-orang di `docs/PHASES.md` (opsi A/B/C) **tidak
bisa dipakai apa adanya**, karena semuanya mengasumsikan tiga kontributor aktif. Pembagian kerja harus
dirancang agar **tidak gagal bila kontribusi luar nol**.

**Usulan arah dari user (2026-10-20, belum disetujui):**
- Eksekusi memakai **4 sesi agent**: 1 Lead + 3 worker. Lead mengatur agar kerja terstruktur.
- User berperan sebagai **pemberi akses** saat ada yang butuh login (mis. Zetaris).
- Bentuk pipeline yang disukai: **V-shaped** — banyak fase yang bisa berjalan sendiri-sendiri, lalu satu
  **fase integrasi** di ujung sebagai penggabung. Tujuannya agar anggota lain bisa mengambil fase mana
  pun tanpa mengganggu yang lain.

Status usulan ini: **sedang di-brainstorm**, belum menjadi ADR. Jangan dianggap keputusan.

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
- `docs/`: `ARCHITECTURE.md`, `DECISIONS.md` (ADR-001…ADR-019), `CONTEXT.md`, `SPONSORS.md`,
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
- **Output produk adalah KEPUTUSAN, bukan jawaban** (ADR-018): satu jenis keputusan — merchant mana yang
  harus masuk review compliance periode ini, dan apa tindakannya. **Policy menentukan secara
  deterministik; memory selalu dibandingkan dan ditampilkan tetapi tidak membatalkan policy; konflik
  policy-vs-memory diminta konfirmasi ke manusia, tidak diputuskan agent.**
- **Dataset 5 tabel / ~240 baris** (ADR-019): `merchants`, `transactions`, `settlement_breaks`,
  `policies` (10 aturan), `decisions` (30 riwayat keputusan). Golden set 30 entri berbasis keputusan.
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
- **Panjang PRD diterima apa adanya** — tumbuh dari 168 baris (v1) ke beberapa ratus baris (v2.1) karena
  schema `prd` mewajibkan KPI terukur dan evaluation strategy, ditambah bagian kejujuran angka. Angka
  baris tepatnya **tidak diulang di sini**; lihat header `docs/PRD.md` yang mencatatnya (AGENTS.md
  §21.1: fakta turunan cukup ditunjuk sumbernya). Tidak dipecah ke
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
  **Cara akses SUDAH TERJAWAB (FAQ §5, 2026-10-20):** *"Access instructions and setup steps are in each
  sponsor's folder in Resources on HackOS."* Jadi **bukan** lewat trial di situs Zetaris — jalur peserta
  berbeda. Langkah: buka **Resources → folder Zetaris**, lalu `Help Zetaris` bila perlu, lalu mentor
  office hours. Discord **bukan** kanal support. Detail: `docs/SETUP-SPONSORS.md` §2.
  **Yang masih terbuka:** apakah folder itu memberi akses **tanpa akun cloud sendiri**. Status T0.2
  tetap `belum` sampai ada bukti query nyata.
- Apakah Zetaris bisa dipanggil dari browser — belum diuji. → T0.3
- Akses NVIDIA NIM + rate limit sebenarnya — belum didaftarkan/diukur. → T0.4
- Cursor: plan Free terverifikasi ada, tapi cukup atau tidak untuk 6 hari **belum diuji**. → T0.5
- Meterless: conformance suite **terverifikasi 2026-10-20** — 13/13 lulus di lingkungan kita (Node 24 +
  tsx, tanpa API key). `vendor/hmem` sudah masuk repo dan tercatat di `PREEXISTING.md`. → T0.6 selesai
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
- **Apakah `engines/markovian` perlu ikut di-vendor** — belum diputuskan. Demo cold-vs-warm Meterless
  (12 chunk → 8 chunk) bergantung pada `markovian` untuk chain chunking + kompresi carryover, dan kita
  baru mem-vendor `hmem`. Tanpa `markovian`, efek compounding itu tidak bisa muncul di produk maupun
  di video. Keputusan diambil sebelum P3; bukti demo ada di `docs/SPONSORS.md` §2.
- **TERJAWAB 2026-10-20 — klaim "materi submission wajib Bahasa Inggris" tidak punya dasar di
  `docs/RULES.md`.** Klaim itu muncul di `AGENTS.md` §1, `AGENTS.md` §2, `docs/PRD.md`, dan
  `docs/SUBMISSION.md`, padahal transkripsi aturan tidak memuat kewajiban bahasa sama sekali. **Sudah
  diperbaiki atas keputusan user:** statusnya diturunkan dari "syarat wajib lomba" menjadi **keputusan
  tim**, dengan alasan praktis (juri dan sponsor berbahasa Inggris). Keempat dokumen sudah disinkronkan.

## Risiko dan blocker

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Registrasi tutup 22 Okt 23:59 UTC | Tidak bisa submit | Bentuk tim di platform sebelum tanggal itu |
| Zetaris hanya terjangkau lewat BYOC (compute dibayar di akun cloud sendiri) | Jalur gratis hilang; klaim "governed" melemah | Periksa credits peserta di platform lomba (T0.1); jika tidak ada, turunkan klaim ke "akses data tersebar" (`docs/PRD.md` §5.3) |
| Sponsor access belum ada semua | P1 terblokir | Selesaikan `docs/SETUP-SPONSORS.md` sebelum 22 Okt |
| Scope melebar (connector, gateway, landing) | Spine tidak selesai | Gateway = stretch; landing punya track paralel |
| **Ritme build resmi hanya 6 hari dan tidak mengalokasikan hari untuk P4/P5/P6/P7** | Empat fase berisiko tidak selesai atau dikerjakan terburu-buru | **Tinjau rencana fase sebelum 22 Okt.** Ritme resmi (Participant Journey Map §5.4): 22 = Zetaris+Meterless+loop dasar; 23–24 = evaluator/retry/memory/log; 25 = dataset+tool+retrieval; **26 = README+slide+rekam video**; 27 = final check+submit. P4 dan P7 boleh paralel, tetapi P5 (PWA) dan P6 (autonomy) harus diputuskan: dikerjakan atau dipindah ke backlog |
| **Juri menghindari "single-agent systems presented as agent systems"** (Hackathon Overview §14) | ADR-017 memakai single loop — berisiko dibaca sebagai single-agent | Bedanya harus **terlihat di demo**: minimal satu skenario wajib memaksa ≥2 iterasi, sehingga interaksi Planner↔Executor↔Evaluator terbukti terjadi lebih dari sekali. Satu iterasi saja = terbaca sebagai pipeline |
| **Track 03 butuh rules/policies + memory of prior decisions + output KEPUTUSAN; kita punya data lookup + output jawaban** (APPROACH §6) | Impact (30 poin) menilai *"consistency with the challenge statements"* — risiko dinilai sebagai track yang salah | **SUDAH DIPUTUSKAN 2026-10-20 → ADR-018/ADR-019:** produk digeser ke bentuk keputusan, tetap Track 03. Dataset jadi 5 tabel (+`policies`, +`decisions`) |
| **P5 (PWA) opsional menurut FAQ §5** | *"Should I build a user interface? Only if it makes the output usable."* Product & UX 10 poin tetap menilai kegunaan | **Menunggu keputusan user.** Ritme resmi tidak mengalokasikan hari untuk P5. Pilihan: (a) PWA minimal di P5, (b) CLI + output tabel saja, PWA ke backlog |
| **AC US-01 "<30 detik" lebih ketat dari budget resmi** (APPROACH §11: total 5–10 menit, refinement loop 1–3 menit) | Batas sendiri bisa memotong loop yang justru dinilai | Tinjau AC US-01 sebelum P1; angka 30 detik belum punya dasar |
| **`SAMPLE_MODE=true` belum ada** (APPROACH §5, §7, §11) | Red flag §18 *"system cannot run without internet"* / *"fails if an external API is unavailable"* | Tambah ke rencana P2: fallback deterministik saat Zetaris/NIM tidak tersedia |

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

## Self-scoring use case — alat resmi, dijalankan 2026-10-20

Hackathon Overview §13 menyediakan worksheet 10 pertanyaan (0–2, total 16–20 = kandidat kuat).
Ini penilaian jujur atas keadaan **hari ini**, bukan setelah dibangun:

| # | Pertanyaan | Skor | Alasan |
|---|---|---|---|
| 1 | Bisa jelaskan masalah dalam 30 detik? | 2 | `docs/PRD.md` §1.1 jelas |
| 2 | Tahu siapa usernya? | 2 | §2.1 dan §2.2 dipisah tegas |
| 3 | **Data bisa diakses?** | **0** | **Zetaris belum terdaftar (T0.2 terblokir)** |
| 4 | Bisa dibangun dalam 144 jam? | 1 | 8 fase, ritme resmi tidak mengalokasikan hari untuk P4–P7 |
| 5 | Jalan cepat dan terprediksi? | 1 | belum ada kode |
| 6 | Zetaris & Meterless berperan nyata? | 2 | jalur kritis P1, bukan tempelan |
| 7 | Agent berinteraksi lebih dari sekali? | 2 | loop ADR-017 dengan `retry` |
| 8 | Ada critique/validasi/retry? | 2 | Evaluator + `Verdict` |
| 9 | Bisa tunjukkan output berguna dalam 1–4 menit? | 2 | ya, dengan CLI lalu PWA |
| 10 | Bisa dokumentasikan batasan? | 2 | dokumentasi kita paling kuat di sini |
| | **Total** | **16 / 20** | "kandidat kuat" — **tetapi** |

**Yang harus dibaca dari angka ini:** 16 hanya tercapai karena enam pertanyaan dinilai atas **rencana**,
bukan hasil. Satu-satunya yang dinilai **0** adalah pertanyaan yang paling menentukan: **akses data**.
Dokumen resmi menutup dengan aturan: *"If any answer is 'no,' reduce scope before you build."*

Artinya: skor ini **belum boleh dipakai sebagai bukti kelayakan** sampai T0.2 selesai. Setelah Zetaris
terverifikasi, pertanyaan #3 berubah menjadi 2 dan total menjadi 18 — baru saat itu angka ini bermakna.

## Next action

0. **HADIRI participant onboarding 21 Okt 2026, 12:00–13:30 UTC (besok).** Segmen "Sponsor technology"
   dan Q&A adalah kesempatan terbaik menanyakan akses Zetaris sebelum build window dibuka. Datang
   dengan daftar pertanyaan tertulis. Sumber jadwal: Welcome Guide HackOS (`.cache/platform-notes/`).
   **Checklist resmi onboarding memuat "Verify your access to Zetaris, Meterless and Cursor"** — jadi
   verifikasi akses memang dijadwalkan di sesi itu, bukan seharusnya sudah beres sebelumnya.
0b. **Periksa Announcements di HackOS hari ini dan setiap hari.** Event Calendar §9 menetapkan
   Announcements sebagai **sumber resmi** untuk tanggal workshop, jadwal mentor office hours, dan
   ketersediaan submission form. Lima dokumen yang sudah dibaca tidak satu pun menyebut cara
   memperoleh akses Zetaris — jawabannya ada di Announcements, folder sponsor di Resources, atau
   channel `Help Zetaris`, bukan di dokumen teks.
1. **Jalankan P0** — mulai dari T0.1 (bentuk tim di platform) karena itu blocker paling keras.
2. Selesaikan T0.2–T0.6 (akses sponsor + uji asumsi), catat bukti di `docs/SETUP-SPONSORS.md` §7.
3. **T0.8 sudah selesai** (ADR-015, direvisi ADR-018/ADR-019). Yang belum: artefak eval itu sendiri —
   dataset, golden set, runner. Itu pekerjaan P1 T1.8, bukan P0.
4. Pilih pembagian lapisan di awal P1, catat di bagian "Pembagian lapisan" di atas.
5. Setelah P0 lulus, mulai P1 (`docs/phases/P1-walking-skeleton.md`).

## Konflik sumber yang belum diselesaikan

Dua sumber resmi menyatakan angka berbeda. Dicatat, **tidak** diperbaiki sendiri, karena perbedaan
klaim bisa berarti sumbernya diperbarui — bukan salah tulis.

| Item | `docs/RULES.md` / halaman event | HackOS (Welcome Guide + Overview + Journey Map) | Dampak bagi kita |
|---|---|---|---|
| Registrasi tutup | 22 Okt **23:59** UTC | 22 Okt **23:45** UTC | Nol — kita daftar jauh lebih awal |
| Judging opens | 27 Okt 00:00 UTC (halaman event) | **28 Okt**, setelah submission tutup | Nol |
| Hadiah tunai total | **$13.000** (+ $7.000 in-kind) | **$15.000** (+ $5.000 in-kind) | Nol — tidak memengaruhi kerja |
| Hadiah Track 03 (1/2/3) | $1.500 / $1.200 / $900 | **$2.000 / $1.300 / $1.000** | Nol — tidak memengaruhi kerja |

**Catatan penting soal hadiah:** `docs/RULES.md` §8.1–§8.3 **konsisten secara internal** (rincian per-track
di §8.2 berjumlah $13.000; NVIDIA $4.699 + Cursor $2.301 = $7.000). Ketiga dokumen HackOS konsisten satu
sama lain ($15.000 + $5.000; per-track berjumlah $15.000). Jadi ini **bukan salah tulis** — kemungkinan
besar hadiah dinaikkan setelah `docs/RULES.md` ditranskripsi (2026-10-18). Yang mengikat untuk keputusan
adalah HackOS (paling baru), tetapi keduanya tidak memengaruhi satu pun keputusan kerja kita. Tidak ada
tindakan sampai ada keputusan user.

## Log checkpoint

| Tanggal | Peristiwa |
|---|---|
| 2026-10-18 | Repo dibuat, scaffolding dokumentasi masuk, keputusan produk dicatat |
| 2026-10-19 | Kolaborator `slamsmart` + `Manzera-Azb` terverifikasi **sudah menerima undangan** (izin write); tidak ada undangan pending. Bukan lagi blocker. |
| 2026-10-20 | **P0 dimulai.** T0.7 dan T0.8 ditutup sebagai keputusan: ADR-016 (transport LAN bind + pairing token) dan ADR-015 (protokol evaluasi, dataset merchant payments, penilaian K1/K2 oleh 2 non-penulis per entri). Ditemukan: halaman `zetaris.com` tidak menampilkan trial 30 hari, hanya Hobby BYOC — T0.2 menunggu T0.1. |
| 2026-10-20 | **T0.6 ditutup — lulus.** `vendor/hmem` (reference + conformance + LICENSE + spec) di-vendor dari commit `1742dec`. `npm test` 10/10, conformance **13/13 checks passed** exit 0, ukuran engine 43.725 byte. Tercatat di `PREEXISTING.md` pada commit yang sama. |
| 2026-10-20 | **Arsitektur dirombak: ADR-017.** Welcome Guide HackOS §3 menyebut alur linear kita sebagai *"a pipeline, not an agent system"*. Design disetujui user: loop berbatas 3 iterasi (maks 5 tool/iterasi), `Verdict` tertutup, tangga pengetahuan L0–L4, klarifikasi mengakhiri giliran, single loop default dengan fan-out di backlog. Design: `docs/superpowers/specs/2026-10-20-reasoning-loop-design.md`. `docs/ARCHITECTURE.md` §3, `docs/PRD.md` §3.1, `docs/PHASES.md` P1/P2 disinkronkan. |
| 2026-10-20 | **Produk digeser ke bentuk KEPUTUSAN: ADR-018 + ADR-019.** Panduan resmi APPROACH §6 menunjukkan bentuk "jawaban + sitasi" adalah Track 02, bukan Track 03. Track 03 menuntut rules/policies + memory of prior decisions + output keputusan. Keputusan user: tetap Track 03, geser produk. **Policy menentukan (deterministik); memory selalu dibandingkan dan ditampilkan tetapi tidak membatalkan policy; konflik → minta konfirmasi manusia.** Dataset jadi 5 tabel/~240 baris (+`policies`, +`decisions`); golden set jadi 30 entri berbasis keputusan. AC US-01 dinaikkan <30s → **<60s** (budget resmi 5–10 menit/run). |
| 2026-10-20 | **Enam dokumen HackOS diserap** (Welcome Guide, Journey Map, Overview, APPROACH, Event Calendar, FAQ). Bahan mentah di `.cache/platform-notes/` (gitignored), ekstraksi di `docs/`. **Temuan kunci: FAQ §5 menjawab cara akses sponsor** — *"Access instructions and setup steps are in each sponsor's folder in Resources on HackOS"*. Ini mengoreksi asumsi lama "daftar trial 30 hari di situs Zetaris". Ditambahkan juga `SAMPLE_MODE` wajib (FAQ §5, APPROACH §5/§7/§11). Status T0.2 tetap `belum` sampai ada bukti query nyata. |
