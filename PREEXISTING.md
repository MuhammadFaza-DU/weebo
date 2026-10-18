# PREEXISTING — Deklarasi Eligibilitas

Aturan lomba: *"Work committed before the window opens is not eligible, except for clearly declared
pre-existing components."*

File ini mencatat **setiap komponen yang dibuat sebelum build window dibuka** (22 Okt 2026 00:00 UTC),
supaya bisa dideklarasikan secara akurat di form submission.

**Aturan pemakaian:**

- Setiap komponen pre-existing dicatat **pada commit yang sama** saat ia ditambahkan.
- Catatan harus bisa dibuktikan dari riwayat commit.
- Yang dicatat di sini adalah **struktur dan dokumentasi**, bukan fitur produk.
- Tidak boleh ada kode produk yang diklaim sebagai hasil build window padahal dibuat sebelumnya, dan
  sebaliknya.

**Cara memverifikasi:**

```bash
git log --diff-filter=A --format="%h %ad %s" --date=short -- <path>
git log --before="2026-10-22T00:00:00Z" --oneline
```

---

## Dideklarasikan pre-existing

Semua file di bawah ditambahkan **sebelum build window dibuka**. Dibuktikan dengan commit yang
tercantum.

| # | Komponen | Commit | Tanggal | Sifat |
|---|---|---|---|---|
| 1 | `LICENSE`, `.gitignore`, `.gitattributes` | `a8ba3dc` | 2026-10-18 | Metadata repo |
| 2 | `README.md` | `a8ba3dc` | 2026-10-18 | Dokumentasi publik |
| 3 | `AGENTS.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `CODEOWNERS` | `a8ba3dc` | 2026-10-18 | Aturan kerja dan tata kelola |
| 4 | `CHECKPOINT.md`, `PREEXISTING.md` | `a8ba3dc` | 2026-10-18 | Dokumen status dan eligibilitas |
| 5 | `docs/ARCHITECTURE.md`, `docs/DECISIONS.md` | `a8ba3dc` | 2026-10-18 | Arsitektur dan catatan keputusan (ADR-001…ADR-014) |
| 6 | `docs/SPONSORS.md`, `docs/SETUP-SPONSORS.md`, `docs/REFERENCES.md` | `a8ba3dc` | 2026-10-18 | Rencana integrasi sponsor dan referensi |
| 7 | `docs/PHASES.md`, `docs/SUBMISSION.md`, `docs/phases/P1-walking-skeleton.md` | `a8ba3dc` | 2026-10-18 | Kerangka kerja dan checklist submission |
| 8 | `.github/` (CI, template issue dan PR) | `a8ba3dc` | 2026-10-18 | Konfigurasi repositori |
| 9 | `docs/CONTEXT.md` | `79a05d9` | 2026-10-18 | Pengetahuan kerja: bobot penilaian, batasan tim, angka terukur |
| 10 | `docs/phases/P0-preflight.md` | `4f1aa8d` | 2026-10-18 | Rencana fase preflight |
| 11 | `docs/CURSOR-LOG.md` | `4cb8fca` | 2026-10-18 | Template log pemakaian Cursor |

---

## Komponen pihak ketiga yang di-vendor

**Wajib dideklarasikan** — ini kode pihak ketiga yang masuk ke repo sebelum window dibuka.

| Komponen | Lisensi | Kapan | Status |
|---|---|---|---|
| Meterless H-MEM reference (`vendor/hmem`) | Apache-2.0 | Direncanakan di P0 (T0.6), **sebelum** window | **belum di-vendor** |

Jika `vendor/hmem` di-vendor sebelum 22 Okt, ia **wajib** masuk daftar ini. Jika di-vendor setelah
window dibuka, ia tetap bukan karya tim dan harus disebut di submission sebagai dependensi
pihak ketiga.

---

## Tidak dideklarasikan (dibangun di dalam window)

Semua hal berikut dibangun **di dalam** build window dan tidak diklaim sebagai pre-existing:

- `apps/` dan `packages/` — seluruh kode produk.
- Integrasi Zetaris dan Meterless pada kode.
- Gateway kuota gratis.
- Landing page beserta kontennya.
- Video demo dan slide deck.

---

## Catatan untuk form submission

Kalimat yang akan dipakai, menyesuaikan hasil akhir:

> Before the build window we created only repository scaffolding: documentation, architecture notes,
> decision records, and project governance files. All product code — the agent core, sponsor
> integrations, application surface, and landing page — was written during the build window.
> The Meterless H-MEM engine is a third-party Apache-2.0 dependency (declared alongside its LICENSE
> once vendored), not our work.
> The full commit history is available in this repository.

Perbarui kalimat ini jika kenyataannya berbeda. Jangan mengirim klaim yang tidak sesuai riwayat commit.
