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
| Status | **Belum diimplementasikan** |

**Rencana panggilan:**

1. Engine di-*vendor* dari `engines/hmem/reference` lewat langkah setup yang tercatat di
   `docs/SETUP-SPONSORS.md` §4 (perintah vendor akan ditambahkan ke README saat kode produk ada).
   `LICENSE` dan atribusi Apache-2.0 dipertahankan; `vendor/` tidak diedit.
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
- **Scorecard conformance suite Meterless** (`HMEM_IMPL=... npx tsx conformance/runner.ts`) — bukti
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

**Kenapa review, bukan build:** tim memakai agent harness masing-masing untuk menulis kode. Cursor
berperan sebagai permukaan review — tempat perubahan dibaca ulang, dinavigasi, dan diperiksa
konsistensinya terhadap arsitektur.

**Yang dicatat di submission:** apa yang benar-benar di-review, dan apa yang kurang dari plan yang
dipakai. Termasuk bagian *"what needs work"* — pengalaman nyata dengan kuota Free adalah feedback yang
sah dan berharga bagi penyelenggara.

**Jangan menulis** bahwa kode ditulis di Cursor. Itu tidak benar dan tidak perlu.

---

## 5. Prinsip kejujuran

- Bagian yang belum jalan ditandai **belum diimplementasikan**.
- Tidak ada transkrip, tangkapan layar, atau angka yang dibuat-buat.
- Jika sebuah integrasi gagal dan diganti pendekatan lain, kegagalan itu dicatat, bukan dihapus.
- Dokumen ini diperbarui bersamaan dengan kode, bukan setelah submission.
