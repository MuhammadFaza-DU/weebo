# P1 — Walking Skeleton

**Tujuan:** membuktikan seluruh pipa tersambung, walau jelek.

Satu alur tipis: user mengirim pertanyaan dari **terminal** → intent terdeteksi → memori dipanggil →
model menjawab → data diambil dari Zetaris → jawaban tampil beserta sumbernya.

**Syarat lulus:** alur di atas bisa didemokan dalam 30 detik, memakai data nyata dari lingkungan
Zetaris, bukan mock.

**Kenapa CLI, bukan UI:** tujuannya membuktikan pipa, bukan tampilan. CLI menghapus seluruh risiko UI
dan membuat kegagalan integrasi terlihat jelas di terminal. PWA masuk di P5 sebagai client runtime.

**Kenapa fase ini ada:** integrasi Zetaris dan Meterless adalah syarat wajib lomba. Jika keduanya
gagal, submission tidak memenuhi syarat. Karena itu keduanya dibuktikan lebih dulu, sebelum UI
diperindah atau fitur ditambah.

---

## Prasyarat

**Fase P0 harus lulus lebih dulu** (`docs/phases/P0-preflight.md`). Secara spesifik:

- [ ] T0.1 selesai — tim sudah dibentuk di platform
- [ ] T0.2 selesai — akses Zetaris terverifikasi dengan satu query nyata
- [ ] T0.3 selesai — sudah diketahui apakah Zetaris bisa dipanggil dari browser
- [ ] T0.4 selesai — akses NVIDIA NIM terverifikasi (chat + embedding)
- [ ] T0.6 selesai — Meterless engine ter-vendor dan conformance suite hijau

Jika salah satu belum, **jangan mulai task kode** — selesaikan P0 dulu.

---

## Task

### T1.1 — Inisialisasi workspace

- [ ] Buat `package.json` root dengan npm workspaces
- [ ] Buat `tsconfig.base.json` (strict)
- [ ] Buat struktur folder `apps/` dan `packages/` sesuai `docs/ARCHITECTURE.md`
- [ ] Tambah script `lint`, `typecheck`, `test`, `dev`
- [ ] Verifikasi: `npm install` sukses, `npm run typecheck` jalan (walau kosong)

### T1.2 — Katalog model

- [ ] Definisikan `ModelEntry` (id, provider, tier, context, label)
- [ ] Isi katalog awal dengan model Nemotron dari NVIDIA NIM
- [ ] Verifikasi: satu unit test membaca katalog dan memvalidasi bentuknya

### T1.3 — Client model minimal

- [ ] Implementasi pemanggilan ke endpoint NIM (kompatibel Chat Completions)
- [ ] Tangani error: timeout, 429, 401
- [ ] Verifikasi: satu request nyata berhasil, output dicatat di `docs/SPONSORS.md`

### T1.4 — Adapter Meterless (vendor sudah dilakukan di P0)

Vendoring **sudah selesai di P0 (T0.6)**. Task ini hanya membungkusnya.

- [ ] Pastikan `vendor/hmem` ada dan test-nya hijau (hasil T0.6)
- [ ] Buat `packages/meterless/src` sebagai adapter yang mengimplementasikan `MemoryPort`
- [ ] **Jangan** edit `vendor/hmem` — adapter kita ada di `packages/meterless/src`
- [ ] Verifikasi: simpan satu memori, ambil kembali, tampilkan id-nya

> Catatan: untuk P1, embedding masih boleh memakai mock bawaan engine. Penggantian ke
> Nemotron-3-Embed-1B adalah tugas P3, bukan P1. Tujuannya agar P1 tetap ringan.

### T1.5 — Client Zetaris minimal

- [ ] Implementasi koneksi (MCP atau REST, mana yang lebih cepat terbukti)
- [ ] Satu fungsi: jalankan query, kembalikan hasil + metadata sumber
- [ ] Verifikasi: satu query nyata berhasil, output dicatat di `docs/SPONSORS.md`

### T1.6 — Alur tipis di core

- [ ] `runTurn(input)` yang memanggil: intent → memory recall → model → tool Zetaris → compose
- [ ] Tidak perlu policy layer lengkap; cukup jalur lurus
- [ ] Verifikasi: satu pemanggilan menghasilkan jawaban yang menyebut sumber data

### T1.7 — CLI minimum

- [ ] `apps/cli` dengan satu perintah: `weebo "<pertanyaan>"` (chat)
- [ ] Untuk P1, chat memanggil core langsung di proses yang sama (ADR-013). Perintah `weebo serve`
      **belum** dibuat di P1 — ia butuh `packages/protocol`, yang baru ada di P2.
- [ ] Tampilkan jawaban + daftar sumber di terminal
- [ ] Verifikasi: `npx weebo "pertanyaan"` mengembalikan jawaban dengan sumber

> Catatan: P1 sengaja memakai CLI, bukan UI. Tujuannya membuktikan pipa, bukan tampilan. Pemisahan
> client–server (ADR-011) beserta perintah `serve` diwajibkan di P2 (ADR-013).

### T1.8 — Catat bukti

- [ ] Isi `docs/SPONSORS.md` dengan transkrip nyata (Zetaris, NIM, Meterless)
- [ ] Perbarui `CHECKPOINT.md`
- [ ] Tawarkan commit + tag

---

## Yang sengaja belum dikerjakan

- Policy allow/deny dan audit lengkap (P2)
- Memory mining otomatis dan consolidation (P3)
- Desain visual (P4, P5)
- Scheduler dan channel (P6)
- Gateway kuota gratis (backlog)

---

## Risiko

| Risiko | Tanda | Tindakan |
|---|---|---|
| Akses Zetaris lambat/tidak disetujui | Console tidak bisa masuk | Gunakan REST + data contoh resmi sementara, catat sebagai workaround |
| MCP Zetaris tidak tersedia di lingkungan uji | Handshake gagal | Pakai jalur REST, catat perbedaannya |
| Model NIM kena rate limit saat demo | 429 berulang | Siapkan model kedua di katalog + cache respons |
| Engine Meterless butuh langkah vendor manual | `vendor/` kosong | Catat di README sebagai langkah setup wajib |
