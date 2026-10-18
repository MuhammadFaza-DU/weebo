# CHECKPOINT

Sumber kebenaran status kerja. Wajib dibaca di awal setiap sesi dan diperbarui setiap ada perubahan
bermakna.

**Terakhir diperbarui:** 2026-10-18

---

## Status saat ini

| Item | Nilai |
|---|---|
| Fase aktif | **P0 — Preflight** (belum dimulai) |
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
- Undangan kolaborator terkirim dengan izin **write**: `slamsmart`, `Manzera-Azb`
  (**status: menunggu diterima**, belum menjadi collaborator sampai mereka klik accept).
- Topics repo: `agent-harness`, `ai-agent`, `llm`, `mcp`, `open-source`, `pwa`, `typescript`.
- Scaffolding dokumentasi: `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`,
  `CODEOWNERS`, `PREEXISTING.md`, `.gitattributes`, `.github/` (CI + template issue/PR).
- `docs/`: `ARCHITECTURE.md`, `DECISIONS.md` (ADR-001…ADR-014), `CONTEXT.md`, `SPONSORS.md`,
  `SETUP-SPONSORS.md`, `REFERENCES.md`, `PHASES.md` (termasuk panduan pecah task, 3 opsi pembagian
  lapisan, dan backlog berbasis dependensi), `SUBMISSION.md`, `CURSOR-LOG.md`, **`RULES.md`**
  (transkripsi terverifikasi §01–§10 aturan lomba), **`PRD.md`** (problem, user primer/adopter,
  16 user story dengan acceptance criteria, non-goals, **5 KPI terukur**, **evaluation strategy**),
  `phases/P0-preflight.md`, `phases/P1-walking-skeleton.md`.
- `AGENTS.md` §1.1: urutan baca wajib untuk agent baru (9 dokumen).
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
  penegakan policy 100%, recall memori ≥80%. Semuanya **target, belum diukur**.
- **Evaluation strategy ditetapkan** (`docs/PRD.md` §3.2): dataset sintetis ~3 tabel/200 baris, golden
  set 30 entri (20 bisa dijawab + 10 tidak), rubrik biner, runner `npm run eval`, dijalankan di keluar
  P1 (smoke 5), P3, P5, dan P8. Golden set **dibekukan sebelum P3** dengan `eval/CHANGELOG.md`.
- **Batas eval dinyatakan**: N=30 dan dataset sintetis berarti ini **smoke eval, bukan benchmark**.
  Dilarang menyebutnya benchmark di submission.

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

- Akses Zetaris (trial 30 hari) — belum didaftarkan. → T0.2
- Apakah Zetaris bisa dipanggil dari browser — belum diuji. → T0.3
- Akses NVIDIA NIM + rate limit sebenarnya — belum didaftarkan/diukur. → T0.4
- Cursor: plan Free terverifikasi ada, tapi cukup atau tidak untuk 6 hari **belum diuji**. → T0.5
- Meterless: conformance suite belum dijalankan di lingkungan kita. → T0.6
- Registrasi lomba: akun platform ada, **tim belum dibentuk di platform**. → T0.1
- Kedua kolaborator belum menerima undangan (status pending di GitHub).
- Pembagian pemilik lapisan — belum diputuskan (dipilih di awal P1).
- **Bagaimana ponsel/tablet mencapai runtime di `localhost`** — belum diputuskan. Memblokir demo PWA
  di ponsel (P5). Dijawab di **P0 · T0.7**. Lihat `docs/ARCHITECTURE.md` §2.2.
- **Apakah Zetaris benar-benar menyediakan akses data ter-governance yang bisa didemokan** — belum
  diverifikasi. Jika tidak, klaim "governed" di PRD §2.1 dan README harus diturunkan menjadi "akses
  data tersebar" sebelum masuk submission. Lihat `docs/PRD.md` §5.3.
- **Belum satu pun KPI diukur** — K1 akurasi sitasi, K2 fabrikasi, K3 kelengkapan jejak, K4 penegakan
  policy, K5 recall memori. Semuanya target. Pengukuran pertama (smoke 5 pertanyaan) baru di P1 T1.8.
- **Belum ada dataset demo, golden set, atau runner eval.** Protokolnya ditetapkan di P0 T0.8, diwujudkan
  di P1 T1.8.

## Risiko dan blocker

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Registrasi tutup 22 Okt 23:59 UTC | Tidak bisa submit | Bentuk tim di platform sebelum tanggal itu |
| Trial Zetaris 30 hari | Akses bisa kedaluwarsa | Daftarkan mendekati build window, bukan jauh sebelumnya |
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
