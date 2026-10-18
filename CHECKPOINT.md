# CHECKPOINT

Sumber kebenaran status kerja. Wajib dibaca di awal setiap sesi dan diperbarui setiap ada perubahan
bermakna.

**Terakhir diperbarui:** 2026-10-18

---

## Status saat ini

| Item | Nilai |
|---|---|
| Fase aktif | **Pra-window** — scaffolding dan riset |
| Build window | 22–27 Okt 2026 UTC (belum dibuka) |
| Track | Track 03 — Reasoning Architecture |
| Kode produk | Belum ada (sesuai aturan eligibilitas) |

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
- `docs/`: `ARCHITECTURE.md`, `DECISIONS.md` (ADR-001…ADR-010), `SPONSORS.md`, `SETUP-SPONSORS.md`,
  `REFERENCES.md`, `PHASES.md`, `SUBMISSION.md`, `phases/P1-walking-skeleton.md`.
- Catatan belajar lokal (enam folder referensi) dibuat. Diabaikan lewat `.git/info/exclude` (lokal,
  tidak terlihat di repo); terverifikasi tidak ada di GitHub.

## Keputusan yang mengikat

Lihat `docs/DECISIONS.md`. Ringkasnya:

- Stack: monorepo TypeScript, core isomorphic, PWA untuk lomba; **Electron** (bukan Tauri) sebagai
  target desktop jangka panjang, Capacitor untuk mobile.
- Connector: **MCP + OAuth 2.1** sebagai fondasi; Composio hanya acuan pola, bukan dependensi.
- Free tier: katalog model + gateway Cloudflare Worker yang memegang key NVIDIA NIM, kuota per IP.
- Merge: hanya `@MuhammadFaza-DU`.
- Catatan belajar pribadi disimpan di luar repo dan tidak pernah di-commit.

## Belum terverifikasi

- Akses Zetaris (trial 30 hari) — belum didaftarkan.
- Akses NVIDIA NIM — belum didaftarkan.
- Akun Cursor — belum dikonfirmasi.
- Meterless: belum di-*vendor* dan belum dijalankan lokal.
- Registrasi lomba: akun platform ada, **tim belum dibentuk di platform**.
- Kedua kolaborator belum menerima undangan (status pending di GitHub).

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

## Next action

1. Selesaikan pendaftaran akun sponsor (`docs/SETUP-SPONSORS.md`).
2. Bentuk tim di platform genai.works.
3. Mulai mempelajari arsitektur Hermes sebagai acuan (catatan lokal, tidak masuk repo).
4. Susun task P1 di `docs/phases/P1-walking-skeleton.md` sebelum window dibuka.

## Log checkpoint

| Tanggal | Peristiwa |
|---|---|
| 2026-10-18 | Repo dibuat, scaffolding dokumentasi masuk, keputusan produk dicatat |
