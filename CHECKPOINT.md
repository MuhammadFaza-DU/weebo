# CHECKPOINT

Sumber kebenaran status kerja. Wajib dibaca di awal setiap sesi dan diperbarui setiap ada perubahan
bermakna.

**Terakhir diperbarui:** 2026-10-21

---

## Status saat ini

| Item | Nilai |
|---|---|
| Arah produk | **BELUM DITETAPKAN** — ide sebelumnya dibatalkan 2026-10-21 |
| Fase aktif | Belum ada fase. Menunggu arah produk |
| Build window | 22 Okt 2026 00:00 UTC → 27 Okt 2026 23:45 UTC (**buka besok**) |
| Registrasi tutup | 22 Okt 2026 23:45 UTC |
| Track | **Belum dipilih.** Dipilih saat membuat submission (`docs/RULES.md` §3.2–3.3) |
| Kode produk | Tidak ada (sesuai aturan eligibilitas) |

## Reset 2026-10-21 — apa yang terjadi

Seluruh ide produk Weebo dihapus dari repo atas instruksi user. Alasannya: ide itu dibangun sebagai
*"penyempurna harness yang sudah ada"*, dan bentuk itu tidak bisa menang melawan produk yang sudah
matang. Arah produk akan dibrainstorm ulang dari nol.

**Yang dihapus** (`git rm`, masih ada di riwayat + tag `stable-2026-10-21-v1`):

- `docs/PRD.md` — definisi produk, user story, KPI
- `docs/DECISIONS.md` — seluruh catatan keputusan (19 ADR)
- `docs/ARCHITECTURE.md` — arsitektur monorepo
- `docs/REFERENCES.md` — analisis produk pembanding
- `docs/superpowers/specs/2026-10-20-reasoning-loop-design.md` — design loop penalaran
- `docs/phases/P0-preflight.md`, `docs/phases/P1-walking-skeleton.md` — rencana fase

**Yang disimpan karena bukan ide produk:**

| Berkas | Alasan |
|---|---|
| `docs/RULES.md` | Transkripsi terverifikasi aturan resmi lomba |
| `vendor/hmem/` | Engine Meterless Apache-2.0 — **dependensi sponsor wajib lomba**, bukan ide kita |
| `scripts/check-docs.mjs` + selftest | Tooling pemeriksa konsistensi dokumen |
| `.github/`, `LICENSE`, `CODEOWNERS`, `.gitignore`, `.gitattributes` | Kerangka repo yang disyaratkan |
| `docs/CURSOR-LOG.md` | Kewajiban log Cursor |

**Yang ditulis ulang** — dibersihkan dari ide produk, isi lomba dipertahankan:

`AGENTS.md`, `README.md`, `CONTRIBUTING.md`, `CHECKPOINT.md`, `PREEXISTING.md`, `docs/CONTEXT.md`,
`docs/PHASES.md`, `docs/SPONSORS.md`, `docs/SETUP-SPONSORS.md`, `docs/SUBMISSION.md`.

## Realita tim — dinyatakan user 2026-10-20

Ini **fakta**, bukan asumsi, dan mengubah dasar perencanaan:

| Hal | Kenyataan |
|---|---|
| Anggota terdaftar di platform | 3 orang |
| Anggota yang **dapat diandalkan** | **2 orang** (user + 1) |
| Anggota ke-3 | **Tidak dapat diandalkan**; tidak diketahui akan berkontribusi atau tidak |
| Anggota ke-2 | Sedang bekerja; **tingkat kontribusi belum diketahui** |
| Asumsi perencanaan yang dipakai | **Bangun seolah hanya 1 orang (user) yang bekerja**, tanpa menggantungkan diri pada anggota lain |

**Konsekuensi:** rencana kerja harus **tidak gagal bila kontribusi luar nol**. Pembagian kerja per
orang belum ditetapkan.

**Usulan arah eksekusi dari user (belum disetujui):**

- Memakai beberapa sesi agent paralel dengan satu Lead yang mengatur.
- User berperan sebagai **pemberi akses** saat ada yang butuh login (mis. Zetaris).
- Bentuk pipeline yang disukai: **V-shaped** — banyak fase yang bisa berjalan sendiri-sendiri, lalu
  satu fase integrasi di ujung sebagai penggabung, agar anggota lain bisa mengambil fase mana pun
  tanpa mengganggu yang lain.

Status: **sedang dibrainstorm**, belum menjadi keputusan.

## Yang sudah selesai (masih berlaku)

- Repo publik: `https://github.com/MuhammadFaza-DU/weebo` — lisensi **MIT**, branch default `main`.
- CI hijau: `Lint, typecheck, test` (termasuk `node scripts/check-docs.mjs` + selftest).
- Proteksi `main` aktif dan terverifikasi: wajib PR, wajib 1 approval, wajib review CODEOWNERS, CI
  wajib hijau, stale review gugur otomatis, semua diskusi wajib resolved, force push ditolak,
  penghapusan branch ditolak. `enforce_admins=false` sehingga maintainer bisa bypass saat mendesak.
- Kolaborator aktif (terverifikasi 2026-10-19): `slamsmart` dan `Manzera-Azb` dengan izin `write`.
- Topics repo: `agent-harness`, `ai-agent`, `llm`, `mcp`, `open-source`, `pwa`, `typescript`.
- `vendor/hmem/` — engine Meterless H-MEM (Apache-2.0), commit `1742dec`, **conformance 13/13 checks
  passed**, `npm test` 10/10, juga lulus dari clone bersih. Bukti: `docs/SPONSORS.md` §2.
- `scripts/check-docs.mjs` + selftest — 9 kelas pemeriksaan, tanpa dependensi.
- `AGENTS.md` §21 — aturan sinkronisasi lintas dokumen.

## Belum dikerjakan / blocker

- **Arah produk** — belum ada. Ini blocker untuk semua pekerjaan produk.
- **Akses Zetaris** — belum terdaftar. Cara akses: **HackOS → Resources → folder sponsor Zetaris**
  (FAQ §5), lalu channel `Help Zetaris`, lalu mentor office hours. Detail: `docs/SETUP-SPONSORS.md` §2.
  Status: `belum` sampai ada bukti query nyata.
- **NVIDIA NIM** — belum didaftarkan, belum diuji.
- **Cursor** — belum dipakai untuk review.
- **Track** — belum dipilih. Tidak mendesak: bisa diganti sampai tenggat (`docs/RULES.md` §3.3).
- **Participant onboarding** — 21 Okt 12:00–13:30 UTC (hari ini). Checklist-nya memuat *"Verify your
  access to Zetaris, Meterless and Cursor"*.
- **Dokumen `docs/DECISIONS.md`** — belum ada. Dibuat ulang saat ADR pertama yang baru disepakati.

## Belum terverifikasi

- Zetaris: apakah folder sponsor memberi akses **tanpa akun cloud sendiri**. Belum ada query nyata.
- Rate limit NVIDIA NIM yang sebenarnya. Belum diukur.
- Apakah Cursor plan Free cukup untuk 6 hari kerja.

## Next action

1. **Brainstorm arah produk baru** — satu keputusan, lalu dikunci. Build window buka besok.
2. Setelah arah jelas: tulis `docs/DECISIONS.md` (ADR baru) + `docs/PRD.md` (definisi produk).
3. Susun fase + file task fase pertama.
4. Tetapkan pembagian kerja yang tidak bergantung pada kontribusi luar.

---

## Log checkpoint

| Tanggal | Peristiwa |
|---|---|
| 2026-10-18 | Repo dibuat, scaffolding 22 file, CI hijau, proteksi `main` aktif |
| 2026-10-19 | Kolaborator terverifikasi, transkripsi aturan lomba |
| 2026-10-20 | Enam dokumen HackOS diserap; `vendor/hmem` masuk; lima ADR baru ditulis |
| 2026-10-21 | **Reset.** Seluruh ide produk dihapus atas instruksi user. Repo kini berisi aturan lomba + infrastruktur saja |
