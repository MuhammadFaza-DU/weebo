# Integrasi Sponsor

Dokumen ini mencatat **bagaimana** sponsor technology dipakai di Weebo, di mana panggilannya berada di
kode, dan bukti bahwa integrasi itu nyata.

Aturan lomba: integrasi harus benar-benar dipanggil saat runtime — sebuah import, entry point, atau
config agent/MCP yang dimuat. Menyebut nama di README tidak cukup.

Status saat ini: **belum ada kode**. Setiap bagian di bawah akan diisi dengan bukti nyata saat fase
terkait selesai. Bagian yang belum terverifikasi ditandai eksplisit.

---

## 1. Zetaris — data harness

| Item | Isi |
|---|---|
| Peran di Weebo | Jalur akses data: query lintas sumber tanpa penyalinan |
| Lokasi kode | `packages/zetaris/` |
| Cara akses | MCP server Zetaris (utama), REST API (cadangan) |
| Dipanggil oleh | `packages/core` lewat `packages/connectors` |
| Status | **Belum diimplementasikan** |

**Rencana panggilan:**

1. `packages/zetaris` menyediakan `createZetarisClient(config)` yang mengembalikan client typed.
2. Client mendaftarkan tool MCP ke registry: pencarian sumber, eksekusi query, ambil metadata.
3. `packages/core` memilih tool tersebut saat intent pengguna membutuhkan data.
4. Hasil query dikembalikan bersama metadata sumber agar bisa dikutip.

**Bukti yang akan dikumpulkan:**

- Cuplikan kode yang benar-benar memanggil client (bukan mock).
- Transkrip query nyata ke lingkungan Zetaris.
- Tangkapan layar hasil di UI.
- Catatan bagian mana yang memerlukan workaround.

---

## 2. Meterless — context layer

| Item | Isi |
|---|---|
| Peran di Weebo | Memori persisten, world model, kompresi reasoning, deteksi intent |
| Lokasi kode | `packages/meterless/` (adapter), `vendor/` (engine, tidak diedit) |
| Engine yang dipakai | H-MEM (memori) — Store, Mining, Retrieval, TrustLedger untuk demo |
| Cara pakai | Vendor engine resmi (Apache-2.0) + adapter embedding sendiri |
| Status | **Ter-vendor dan terverifikasi 2026-10-20 (P0 T0.6)**; adapter embedding menyusul di P3 |

**Hasil verifikasi T0.6 — 2026-10-20.** Sumber: `github.com/Meterless/Meterless`, commit
`1742dec56a66e58eef9dda2d2b865823758ca8cd` (clone `--depth 1`, branch `main`).

| Item | Hasil terukur |
|---|---|
| Lokasi vendored | `vendor/hmem/reference/` + `vendor/hmem/conformance/` + `vendor/hmem/LICENSE` |
| Ukuran `reference/src` (10 file) | **43.725 byte** |
| `npm install` di `vendor/hmem/reference` | 47 paket, 5 detik |
| `npm test` (vitest) | **10/10 test lulus**, 967 ms |
| Conformance suite | **13/13 checks passed**, exit code 0 |
| Runtime dependencies | **nol** — hanya `tsx` + `vitest` sebagai devDependencies |
| Jalan tanpa Node penuh | Ya — Node 24 + `tsx`, tanpa layanan eksternal, tanpa API key |

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

**Koreksi terhadap ADR-012.** ADR-012 mencatat ukuran engine **≈42,6 KB**; hasil ukur hari ini
**43.725 byte**. Selisih ini karena ADR-012 mengukur tanpa SHA yang dipin (lihat catatan
reproduksibilitas di ADR itu). Angka yang mengikat sekarang adalah 43.725 byte pada commit
`1742dec`. Konfirmasi lain dari ADR-012 tetap benar: zero runtime dependencies, embedder mock
FNV-1a 64 dimensi, storage JSON.

**Catatan penting yang ditemukan saat vendoring.** `AGENTS.md` di dalam repo Meterless menyatakan
*"The engines are AGENTS.md-driven specs, not runtime libraries."* Artinya `reference/` memang
dimaksudkan sebagai implementasi rujukan dari spesifikasi, bukan pustaka produksi — persis yang
sudah diasumsikan ADR-012. Tidak ada perubahan rencana.

**Yang belum diverifikasi:** adapter embedding kita (`packages/meterless/src`) belum ada, jadi
conformance **belum** dijalankan terhadap kode kita. Run kedua dijadwalkan di P3 setelah adapter
dipasang (`docs/phases/P0-preflight.md` T0.6).

**Demo cold-vs-warm dijalankan 2026-10-20 — berhasil.** Bukan sekadar klaim: output nyata, tanpa API
key, memakai mock LLM + engine asli.

```text
3. Same 12-step task, twice
   cold run:  12 chunks, status=completed
   warm run:  8 chunks, status=completed

4. Comparison  (tokens estimated, chars/4)
                             | cold      | warm
   chunks                    | 12        | 8
   prompt tokens (estimated) | 1840      | 1365
   output tokens (estimated) | 1230      | 891

   memory saved 814 estimated tokens and 4 chunks on this run.
```

Recall hybrid ranking juga terbukti bekerja: koreksi sesi-2 (`sqlite`, `mem-4`, skor 0.152) menang
atas klaim sesi-1 yang sudah di-*supersede* (`IndexedDB`) — tepat seperti yang dijanjikan formula
`−0.20·superseded`.

**Batas demo ini, dinyatakan jujur:** demo membutuhkan **dua** engine — `hmem` **dan** `markovian`
(untuk chain chunking + kompresi carryover). Yang kita vendor hanya `hmem`. Jadi angka 12→8 chunk
**bukan** hasil engine kita; ia bukti bahwa konsepnya bekerja, bukan bukti produk kita sudah
menghemat token. Di submission, angka ini hanya boleh dikutip dengan kalimat itu.

Konsekuensi untuk P3: jika kita ingin efek compounding ini muncul di produk (dan di video), kita
perlu memutuskan apakah `engines/markovian/reference` juga di-vendor. Belum diputuskan — dicatat
sebagai pertanyaan terbuka di `CHECKPOINT.md`.

**Rencana panggilan:**

1. Engine sudah di-*vendor* dari `engines/hmem/reference` (lihat tabel hasil di atas; langkah setup
   tercatat di `docs/SETUP-SPONSORS.md` §4). `LICENSE` dan atribusi Apache-2.0 dipertahankan;
   `vendor/` tidak diedit.
2. `packages/meterless/src` menyediakan adapter yang mengimplementasikan `MemoryPort` dari
   `packages/core`.
3. **Embedding diganti.** Engine referensi memakai mock FNV-1a 64 dimensi tanpa makna semantik;
   adapter memakai NVIDIA Nemotron-3-Embed-1B (2048 dimensi, konteks 32.768 token, mendukung bahasa
   Indonesia). Ini penggunaan yang dimaksudkan oleh penulis spesifikasi.
4. `packages/core` memanggil adapter pada tahap recall dan write-memory. Core tidak pernah mengimpor
   `vendor/` secara langsung.
5. Setiap memori yang dipakai dalam jawaban dirujuk lewat id agar bisa diaudit.

**Bukti yang akan dikumpulkan:**

- Perintah setup vendor yang benar-benar dijalankan.
- **Scorecard conformance suite Meterless** (dijalankan dari `vendor/hmem/conformance`) — bukti
  objektif kepatuhan kontrak.
- Test yang menunjukkan memori bertahan lintas sesi.
- Transkrip `audit` sebuah memori.
- Bukti embedding nyata: perbandingan relevansi antara mock dan Nemotron pada query yang sama.

**Catatan jujur untuk submission:** memory engine adalah dependensi Apache-2.0, bukan karya tim.
Yang ditulis tim adalah adapter embedding, integrasi ke agent loop, dan seluruh harness di sekitarnya.
Implementasi sendiri menjadi item backlog berprioritas 5, bergantung pada P3 selesai dan `MemoryPort`
stabil (ADR-012).

---

## 3. NVIDIA Nemotron — model

| Item | Isi |
|---|---|
| Peran di Weebo | Jalur model gratis tanpa setup untuk user baru + embedding memori |
| Cara akses | NVIDIA NIM, endpoint kompatibel Chat Completions, `https://integrate.api.nvidia.com/v1` |
| Model chat | Nemotron (katalog di `packages/core/src/models/`) |
| Model embedding | `nemotron-3-embed-1b` — 2048 dimensi, konteks 32.768 token |
| Lokasi kode | `packages/core/src/models/`, `packages/gateway/`, `packages/meterless/src/embedding` |
| Status | **Belum diimplementasikan** |

**Rencana panggilan:**

1. Katalog model mencantumkan model Nemotron yang tersedia beserta konteks dan tier.
2. Jalur free tier meneruskan permintaan lewat gateway yang memegang key NIM.
3. Jalur BYOK memakai key user ke endpoint yang sama.
4. Model dipilih per langkah bila menguntungkan (mis. model kecil untuk klasifikasi intent, model
   besar untuk penalaran).
5. **Embedding** memakai `nemotron-3-embed-1b` untuk seluruh memori H-MEM, menggantikan mock
   FNV-1a 64 dimensi dari engine referensi.

**Bukti yang akan dikumpulkan:**

- Respons nyata dari endpoint NIM, untuk chat maupun embedding.
- Bukti bahwa gateway menegakkan kuota per IP.
- Perbandingan relevansi retrieval: mock vs Nemotron pada query yang sama.
- Catatan dimensi vektor dan dampaknya ke ukuran penyimpanan.

---

## 4. Cursor — alat review

| Item | Isi |
|---|---|
| Peran di Weebo | **Review kode**, bukan menulis kode |
| Dipakai untuk | Membaca, menelusuri, dan mereview perubahan dari agent harness lain |
| Tidak dipakai untuk | Menulis atau membangun kode |
| Log | `docs/CURSOR-LOG.md`, diisi setiap penutupan fase |
| Status | **Belum dipakai** |

**Tuntutan aturan:** `docs/RULES.md` §5.1 (pemakaian Cursor wajib) dan §6.4 (wajib menjelaskan
pemakaiannya). Kutipan verbatim tidak diulang di sini (§21.7).

**Kenapa review, bukan build:** tim memakai agent harness masing-masing untuk menulis kode. Cursor
berperan sebagai permukaan review — tempat perubahan dibaca ulang, dinavigasi, dan diperiksa
konsistensinya terhadap arsitektur.

**Penilaian risiko (jujur):** posisi review-only **defensibel tetapi lebih lemah** daripada memakai
Cursor untuk menulis kode. "Development" secara wajar mencakup review, tetapi juri bisa membaca lebih
ketat.

**Dua mitigasi yang tersedia — perlu keputusan sebelum P8:**

1. **Perkuat klaim:** gunakan Cursor untuk sebagian pekerjaan nyata (refactor, perbaikan bug, atau
   penulisan satu modul), lalu catat di `docs/CURSOR-LOG.md`. Klaim jadi lebih kuat dan tetap jujur.
2. **Tetap review-only:** jelaskan eksplisit di submission bagaimana Cursor dipakai, dan jangan
   mengklaim lebih dari kenyataan. Risiko: dianggap kurang memenuhi §5.1.

**Jangan menulis** bahwa kode ditulis di Cursor jika tidak. Itu pelanggaran kejujuran, dan §10.2
menyatakan diskualifikasi bersifat final.

---

## 5. Prinsip kejujuran

- Bagian yang belum jalan ditandai **belum diimplementasikan**.
- Tidak ada transkrip, tangkapan layar, atau angka yang dibuat-buat.
- Jika sebuah integrasi gagal dan diganti pendekatan lain, kegagalan itu dicatat, bukan dihapus.
- Dokumen ini diperbarui bersamaan dengan kode, bukan setelah submission.
