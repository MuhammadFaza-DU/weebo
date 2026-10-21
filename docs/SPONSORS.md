# Integrasi Sponsor

Dokumen ini mencatat **bagaimana** sponsor technology dipakai, di mana panggilannya berada di kode, dan
bukti bahwa integrasi itu nyata.

Aturan lomba: integrasi harus benar-benar dipanggil saat runtime — sebuah import, entry point, atau
config agent/MCP yang dimuat. Menyebut nama di README tidak cukup.

**Status saat ini: belum ada kode produk.** Arah produk belum ditetapkan (lihat `CHECKPOINT.md`).
Bagian rencana di bawah akan diisi dengan bukti nyata saat fase terkait selesai. Bagian yang belum
terverifikasi ditandai eksplisit.

---

## 1. Zetaris — wajib

| Item | Isi |
|---|---|
| Kewajiban | **Wajib** diintegrasikan di setiap submission (`docs/RULES.md` §5.1) |
| Peran | Jalur akses data |
| Cara akses | Belum diputuskan: MCP server Zetaris (utama) atau REST API (cadangan) |
| Status | **Belum diimplementasikan.** Akses peserta belum terverifikasi |

**Cara mendapat akses:** HackOS → Resources → folder sponsor Zetaris, lalu channel `Help Zetaris` bila
perlu. Detail dan langkah konkret: `docs/SETUP-SPONSORS.md` §2.

**Yang harus dibuktikan:** satu query nyata ke lingkungan Zetaris yang mengembalikan data, plus
cuplikan kode yang benar-benar memanggil client (bukan mock).

---

## 2. Meterless — wajib

| Item | Isi |
|---|---|
| Kewajiban | **Wajib** diintegrasikan di setiap submission (`docs/RULES.md` §5.1) |
| Lokasi engine | `vendor/hmem/` (pihak ketiga, Apache-2.0, **tidak boleh diedit**) |
| Status | **Ter-vendor dan terverifikasi 2026-10-20** |

### Hasil verifikasi vendoring — 2026-10-20

Sumber: `github.com/Meterless/Meterless`, commit `1742dec56a66e58eef9dda2d2b865823758ca8cd`
(clone `--depth 1`, branch `main`).

| Item | Hasil terukur |
|---|---|
| Lokasi vendored | `vendor/hmem/reference/` + `vendor/hmem/conformance/` + `vendor/hmem/LICENSE` |
| Ukuran `reference/src` (10 file) | **43.725 byte** |
| `npm install` di `vendor/hmem/reference` | 47 paket, 5 detik |
| `npm test` (vitest) | **10/10 test lulus**, 967 ms |
| Conformance suite | **13/13 checks passed**, exit code 0 |
| Runtime dependencies | **nol** — hanya `tsx` + `vitest` sebagai devDependencies |
| Jalan tanpa layanan eksternal | Ya — Node 24 + `tsx`, tanpa API key |
| Lulus dari **clone bersih** (berkas LF) | **Ya — 13/13 checks passed, exit 0** |

Transkrip conformance apa adanya:

```text
H-MEM conformance: implementation = .../vendor/hmem/reference/src/index.ts

  record-validation
    PASS rv-001 a record with no source is rejected by construction
    PASS rv-002 a record with a source is accepted
  feedback-deltas
    PASS fd-001 helpful adds exactly +0.05 confidence and +1 accessCount
    PASS fd-002 not_helpful subtracts exactly 0.03
    PASS fd-003 wrong subtracts exactly 0.20 and adds the review tag
    PASS fd-004 confidence clamps at 0 (wrong at 0.1)
    PASS fd-005 confidence clamps at 1 (helpful at 0.98)
  ranking-order
    PASS ro-001 superseded penalty dominates: a superseded record ranks below a fresh one
             with identical content relevance
    PASS ro-002 confidence multiplies the whole score: identical records rank by confidence
  sleep-guardrails
    PASS sg-001 old low-access plain record archives; dream-derived record with identical
             age does not
  conflict-gate
    PASS cg-001 auto-resolve marks the loser supersededBy and deletes nothing
  ledger-audit
    PASS la-001 create then feedback reconstructs: actions in order, previous and new
             confidence present
  dream-boundary
    PASS db-001 dream proposals never materialize before approval; approval creates a
             long_term record with lineage

  13/13 checks passed
```

**Catatan line ending.** `.gitattributes` menormalkan berkas ke LF saat masuk git, sehingga isi
`vendor/` berbeda dari sumber upstream dalam hal akhir baris (CRLF → LF). Ini perubahan whitespace,
bukan logika. Terverifikasi aman: dijalankan ulang dari clone bersih, tetap 13/13 lulus.

**Catatan dari repo Meterless.** `AGENTS.md` di dalam repo mereka menyatakan *"The engines are
AGENTS.md-driven specs, not runtime libraries."* Artinya `reference/` memang implementasi rujukan dari
spesifikasi, bukan pustaka produksi. `README.md` di folder `reference/` menyatakan sendiri: *"What it
is NOT: a production library. The embedder is a deterministic hash mock, storage is a JSON file, and
there is no network code."*

**Yang belum diverifikasi:** bagaimana engine ini akan dipakai oleh produk — bergantung pada arah
produk yang belum ditetapkan.

**Catatan jujur untuk submission:** engine memory adalah dependensi Apache-2.0, **bukan karya tim**.
Ini juga dinyatakan di `PREEXISTING.md`.

---

## 3. NVIDIA Nemotron — sangat dianjurkan

| Item | Isi |
|---|---|
| Kewajiban | **Tidak wajib.** *"Integrate NVIDIA technology wherever it contributes"* |
| Dinilai pada | **Sponsor Tech (10 poin)**, bukan syarat kelulusan |
| Cara akses | NVIDIA NIM, `https://integrate.api.nvidia.com/v1` |
| Status | **Belum didaftarkan, belum diuji** |

**Yang harus dibuktikan:** respons nyata dari endpoint NIM, dan penjelasan di mana teknologi ini
berkontribusi nyata — bukan sekadar dipanggil.

---

## 4. Cursor — wajib dipakai

| Item | Isi |
|---|---|
| Kewajiban | Tim **wajib memakai Cursor** selama pengembangan (`docs/RULES.md` §5.1), dan menjelaskan pemakaiannya (§6.4) |
| Cara tim memakai | **Review** — membaca, menelusuri, memeriksa perubahan. **Bukan** menulis kode |
| Log | `docs/CURSOR-LOG.md`, diisi setiap penutupan fase |
| Status | **Belum dipakai** |

**Kenapa review, bukan build:** tim memakai agent harness lain untuk menulis kode. Cursor berperan
sebagai permukaan review.

**Penilaian risiko (jujur):** posisi review-only **defensibel tetapi lebih lemah** daripada memakai
Cursor untuk menulis kode. "Development" secara wajar mencakup review, tetapi juri bisa membaca lebih
ketat.

**Mitigasi yang tersedia — perlu keputusan sebelum submission:**

1. **Perkuat klaim:** gunakan Cursor untuk sebagian pekerjaan nyata (refactor, perbaikan bug, atau
   penulisan satu modul), lalu catat di `docs/CURSOR-LOG.md`.
2. **Tetap review-only:** jelaskan eksplisit di submission, jangan mengklaim lebih dari kenyataan.

**Jangan menulis** bahwa kode ditulis di Cursor jika tidak. Itu pelanggaran kejujuran, dan `docs/RULES.md`
§10.2 menyatakan diskualifikasi bersifat final.

---

## 5. Prinsip kejujuran

- Bagian yang belum jalan ditandai **belum diimplementasikan**.
- Tidak ada transkrip, tangkapan layar, atau angka yang dibuat-buat.
- Jika sebuah integrasi gagal dan diganti pendekatan lain, kegagalan itu dicatat, bukan dihapus.
- Dokumen ini diperbarui bersamaan dengan kode, bukan setelah submission.
