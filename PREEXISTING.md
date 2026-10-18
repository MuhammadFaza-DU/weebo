# PREEXISTING — Deklarasi Eligibilitas

Aturan lomba: *"Work committed before the window opens is not eligible, except for clearly declared
pre-existing components."*

File ini mencatat **setiap komponen yang dibuat sebelum build window dibuka** (22 Okt 2026 00:00 UTC),
supaya bisa dideklarasikan secara akurat di form submission.

**Aturan pemakaian:**

- Setiap komponen pre-existing dicatat **pada commit yang sama** saat ia ditambahkan.
- Catatan harus bisa dibuktikan dari riwayat commit (`git log --before="2026-10-22T00:00:00Z"`).
- Yang dicatat di sini adalah **struktur dan dokumentasi**, bukan fitur produk.
- Tidak boleh ada kode produk yang diklaim sebagai hasil build window padahal dibuat sebelumnya, dan
  sebaliknya.

---

## Dideklarasikan pre-existing

| # | Komponen | Sifat | Tanggal | Bukti |
|---|---|---|---|---|
| 1 | `README.md`, `LICENSE`, `.gitignore` | Dokumentasi dan metadata repo | 2026-10-18 | commit awal |
| 2 | `AGENTS.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `CODEOWNERS` | Aturan kerja dan tata kelola | 2026-10-18 | commit awal |
| 3 | `CHECKPOINT.md`, `PREEXISTING.md` | Dokumen status dan eligibilitas | 2026-10-18 | commit awal |
| 4 | `docs/ARCHITECTURE.md`, `docs/DECISIONS.md` | Arsitektur dan catatan keputusan | 2026-10-18 | commit awal |
| 5 | `docs/SPONSORS.md`, `docs/SETUP-SPONSORS.md`, `docs/REFERENCES.md` | Riset integrasi sponsor dan referensi | 2026-10-18 | commit awal |
| 6 | `docs/PHASES.md`, `docs/phases/*`, `docs/SUBMISSION.md` | Kerangka kerja dan checklist submission | 2026-10-18 | commit awal |
| 7 | `.github/` (CI, template issue dan PR) | Konfigurasi repositori | 2026-10-18 | commit awal |

## Tidak dideklarasikan (dibangun di dalam window)

Semua hal berikut dibangun **di dalam** build window dan tidak diklaim sebagai pre-existing:

- `apps/` dan `packages/` — seluruh kode produk.
- Integrasi Zetaris dan Meterless pada kode.
- Gateway kuota gratis.
- Landing page beserta kontennya.
- Video demo dan slide deck.

## Catatan untuk form submission

Kalimat yang akan dipakai di submission, menyesuaikan hasil akhir:

> Before the build window we created only repository scaffolding: documentation, architecture notes,
> decision records, and project governance files. All product code — the agent core, sponsor
> integrations, application surface, and landing page — was written during the build window.
> The full commit history is available in this repository.

Perbarui kalimat ini jika kenyataannya berbeda. Jangan mengirim klaim yang tidak sesuai riwayat commit.
