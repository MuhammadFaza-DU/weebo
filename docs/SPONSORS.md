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
| Engine yang dipakai | H-MEM (memori), Markovian (reasoning), Scout Intent (intent) |
| Cara pakai | `npx degit meterless/meterless/engines/<nama>` lalu di-*vendor* |
| Status | **Belum diimplementasikan** |

**Rencana panggilan:**

1. Engine di-*vendor* lewat langkah setup yang tercatat di README.
2. `packages/meterless` membungkus service engine: mining, retrieval, audit, consolidation.
3. `packages/core` memanggil adapter pada tahap recall dan write-memory.
4. Setiap memori yang dipakai dalam jawaban dirujuk lewat id agar bisa diaudit.

**Catatan penting:** engine di `vendor/` tidak boleh dimodifikasi. Semua penyesuaian berada di adapter.

**Bukti yang akan dikumpulkan:**

- Perintah setup vendor yang benar-benar dijalankan.
- Test yang menunjukkan memori bertahan lintas sesi.
- Transkrip `audit` sebuah memori.
- Catatan engine mana yang dipakai di tahap apa.

---

## 3. NVIDIA Nemotron — model

| Item | Isi |
|---|---|
| Peran di Weebo | Jalur model gratis tanpa setup untuk user baru |
| Cara akses | NVIDIA NIM, endpoint [OI]-compatible, `https://integrate.api.nvidia.com/v1` |
| Lokasi kode | `packages/core/src/models/`, `packages/gateway/` |
| Status | **Belum diimplementasikan** |

**Rencana panggilan:**

1. Katalog model mencantumkan model Nemotron yang tersedia beserta konteks dan tier.
2. Jalur free tier meneruskan permintaan lewat gateway yang memegang key NIM.
3. Jalur BYOK memakai key user ke endpoint yang sama.
4. Model dipilih per langkah bila menguntungkan (mis. model kecil untuk klasifikasi intent, model
   besar untuk penalaran).

**Bukti yang akan dikumpulkan:**

- Respons nyata dari endpoint NIM.
- Bukti bahwa gateway menegakkan kuota per IP.
- Perbandingan model pada satu tugas yang sama (jika relevan).

---

## 4. Cursor — lingkungan pengembangan

| Item | Isi |
|---|---|
| Peran | Lingkungan pengembangan tim selama build window |
| Status | **Belum dikonfirmasi** — akses akun belum diverifikasi |

Bagian ini akan diisi dengan catatan nyata: bagaimana Cursor dipakai, bagian mana yang terbantu, dan
bagian mana yang kurang. Bukan testimoni kosong.

---

## 5. Prinsip kejujuran

- Bagian yang belum jalan ditandai **belum diimplementasikan**.
- Tidak ada transkrip, tangkapan layar, atau angka yang dibuat-buat.
- Jika sebuah integrasi gagal dan diganti pendekatan lain, kegagalan itu dicatat, bukan dihapus.
- Dokumen ini diperbarui bersamaan dengan kode, bukan setelah submission.
