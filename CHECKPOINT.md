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

- Repo `weebo` dibuat: public, MIT, `main` diproteksi, kolaborator diundang.
- Scaffolding dokumentasi: `README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`,
  `CODEOWNERS`, `PREEXISTING.md`.
- `docs/`: `ARCHITECTURE.md`, `DECISIONS.md`, `SPONSORS.md`, `SETUP-SPONSORS.md`, `REFERENCES.md`,
  `PHASES.md`, `SUBMISSION.md`, `phases/`.
- Keputusan produk dan teknis dicatat di `docs/DECISIONS.md` (ADR-001 … ADR-0xx).

## Keputusan yang mengikat

Lihat `docs/DECISIONS.md`. Ringkasnya:

- Stack: monorepo TypeScript, core isomorphic, PWA dulu; native menyusul.
- Free tier: katalog model + gateway Cloudflare Worker yang memegang key NVIDIA NIM, kuota per IP.
- Merge: hanya `@MuhammadFaza-DU`.
- REA: workspace `rea/` gitignored, hasil tidak pernah di-push, kode produk ditulis sendiri.

## Belum terverifikasi

- Akses Zetaris (trial 30 hari) — belum didaftarkan.
- Akses NVIDIA NIM — belum didaftarkan.
- Akun Cursor — belum dikonfirmasi.
- Meterless: belum di-*vendor* dan belum dijalankan lokal.
- Registrasi lomba: akun platform ada, **tim belum dibentuk di platform**.

## Risiko dan blocker

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Registrasi tutup 22 Okt 23:59 UTC | Tidak bisa submit | Bentuk tim di platform sebelum tanggal itu |
| Trial Zetaris 30 hari | Akses bisa kedaluwarsa | Daftarkan mendekati build window, bukan jauh sebelumnya |
| Sponsor access belum ada semua | P1 terblokir | Selesaikan `docs/SETUP-SPONSORS.md` sebelum 22 Okt |
| Scope melebar (connector, gateway, landing) | Spine tidak selesai | Gateway = stretch; landing punya track paralel |

## Next action

1. Selesaikan pendaftaran akun sponsor (`docs/SETUP-SPONSORS.md`).
2. Bentuk tim di platform genai.works.
3. Mulai REA Hermes di `rea/hermes/`.
4. Susun task P1 di `docs/phases/P1-walking-skeleton.md` sebelum window dibuka.

## Log checkpoint

| Tanggal | Peristiwa |
|---|---|
| 2026-10-18 | Repo dibuat, scaffolding dokumentasi masuk, keputusan produk dicatat |
