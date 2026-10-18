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
- Batasi-dismiss-review **tidak bisa dipasang**: API menolak dengan 422 *"Only organization
  repositories can have users and team restrictions"*. Perlu repo milik Organization.
- Undangan kolaborator terkirim dengan izin **write**: `slamsmart`, `Manzera-Azb`
  (**status: menunggu diterima**, belum menjadi collaborator sampai mereka klik accept).
- Topics repo: `agent-harness`, `ai-agent`, `llm`, `mcp`, `open-source`, `pwa`, `typescript`.
- Scaffolding dokumentasi: `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`,
  `CODEOWNERS`, `PREEXISTING.md`, `.gitattributes`, `.github/` (CI + template issue/PR).
- `docs/`: `ARCHITECTURE.md`, `DECISIONS.md` (ADR-001…ADR-012), `CONTEXT.md`, `SPONSORS.md`,
  `SETUP-SPONSORS.md`, `REFERENCES.md`, `PHASES.md` (termasuk panduan pecah task + 3 opsi pembagian
  lapisan), `SUBMISSION.md`, `phases/P0-preflight.md`, `phases/P1-walking-skeleton.md`.
- `AGENTS.md` §1.1: urutan baca wajib untuk agent baru (CHECKPOINT → DECISIONS → CONTEXT → fase).
- Catatan belajar lokal (enam folder referensi) dibuat. Diabaikan lewat `.git/info/exclude` (lokal,
  tidak terlihat di repo); terverifikasi tidak ada di GitHub.

## Keputusan yang mengikat

Lihat `docs/DECISIONS.md`. Ringkasnya:

- Stack: monorepo TypeScript, satu runtime + banyak client (CLI, PWA, Electron). Runtime adalah
  server lokal; client bicara lewat `packages/protocol`. PWA untuk lomba, **Electron** (bukan Tauri)
  untuk desktop jangka panjang, Capacitor untuk mobile.
- Connector: **MCP + OAuth 2.1** sebagai fondasi; Composio hanya acuan pola, bukan dependensi.
- Meterless: **vendor engine resmi + adapter embedding sendiri** (`MemoryPort`). Tulis ulang dari
  spec ditunda pasca-lomba. Embedding memakai NVIDIA `nemotron-3-embed-1b`.
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

## Risiko dan blocker

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Registrasi tutup 22 Okt 23:59 UTC | Tidak bisa submit | Bentuk tim di platform sebelum tanggal itu |
| Trial Zetaris 30 hari | Akses bisa kedaluwarsa | Daftarkan mendekati build window, bukan jauh sebelumnya |
| Sponsor access belum ada semua | P1 terblokir | Selesaikan `docs/SETUP-SPONSORS.md` sebelum 22 Okt |
| Scope melebar (connector, gateway, landing) | Spine tidak selesai | Gateway = stretch; landing punya track paralel |

## Ditunda (keputusan sadar, bukan terlupa)

| Item | Alasan | Kapan ditinjau |
|---|---|---|
| Pindah repo ke GitHub Organization | Hanya perlu jika ingin membatasi siapa yang boleh dismiss review. Repo personal ditolak API (422: *only organization repositories can have users and team restrictions*). URL git tetap sama | Jika kontrol akses dirasa kurang, atau setelah lomba |
| Live demo URL (PWA ter-deploy) | Opsional; dikerjakan hanya jika spine selesai dan ada sisa waktu | Setelah P6 |
| Desktop native — **Electron** (bukan Tauri) | Shell atas UI yang sama; tanpa Rust. Fase pertama setelah submission (ADR-010) | Setelah P8 |
| APK Android — Capacitor | Butuh Android SDK | Setelah submission |
| Gateway kuota gratis per IP | Stretch; butuh Cloudflare Worker + pengujian kuota | Setelah P1–P5 lulus |
| Implementasi engine memori sendiri | Memakai engine Meterless sebagai dependensi untuk lomba. `MemoryPort` disiapkan agar bisa ditukar (ADR-012) | Pasca-lomba |

## Next action

1. **Jalankan P0** — mulai dari T0.1 (bentuk tim di platform) karena itu blocker paling keras.
2. Selesaikan T0.2–T0.6 (akses sponsor + uji asumsi), catat bukti di `docs/SETUP-SPONSORS.md` §7.
3. Pilih pembagian lapisan di awal P1, catat di bagian "Pembagian lapisan" di atas.
4. Setelah P0 lulus, mulai P1 (`docs/phases/P1-walking-skeleton.md`).

## Log checkpoint

| Tanggal | Peristiwa |
|---|---|
| 2026-10-18 | Repo dibuat, scaffolding dokumentasi masuk, keputusan produk dicatat |
