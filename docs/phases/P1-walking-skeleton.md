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

- [ ] Akses Zetaris terverifikasi (`docs/SETUP-SPONSORS.md` §2)
- [ ] Akses NVIDIA NIM terverifikasi (`docs/SETUP-SPONSORS.md` §3)
- [ ] Meterless engine bisa di-vendor dan demo lokalnya jalan (`docs/SETUP-SPONSORS.md` §4)

Jika salah satu belum, **jangan mulai task kode** — selesaikan prasyaratnya dulu.

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

- [ ] Implementasi pemanggilan [OI]-compatible ke endpoint NIM
- [ ] Tangani error: timeout, 429, 401
- [ ] Verifikasi: satu request nyata berhasil, output dicatat di `docs/SPONSORS.md`

### T1.4 — Vendor Meterless + adapter tipis

- [ ] Jalankan langkah vendor engine H-MEM
- [ ] Buat `packages/meterless/src` sebagai pembungkus (jangan edit `vendor/`)
- [ ] Verifikasi: simpan satu memori, ambil kembali, tampilkan id-nya

### T1.5 — Client Zetaris minimal

- [ ] Implementasi koneksi (MCP atau REST, mana yang lebih cepat terbukti)
- [ ] Satu fungsi: jalankan query, kembalikan hasil + metadata sumber
- [ ] Verifikasi: satu query nyata berhasil, output dicatat di `docs/SPONSORS.md`

### T1.6 — Alur tipis di core

- [ ] `runTurn(input)` yang memanggil: intent → memory recall → model → tool Zetaris → compose
- [ ] Tidak perlu policy layer lengkap; cukup jalur lurus
- [ ] Verifikasi: satu pemanggilan menghasilkan jawaban yang menyebut sumber data

### T1.7 — CLI minimum

- [ ] `apps/cli` dengan dua perintah: `weebo` (chat) dan `weebo serve` (runtime)
- [ ] Untuk P1, chat boleh memanggil core langsung di proses yang sama; pemisahan client–server
      diselesaikan di P2 bersama `packages/protocol`
- [ ] Tampilkan jawaban + daftar sumber di terminal
- [ ] Verifikasi: `npx weebo "pertanyaan"` mengembalikan jawaban dengan sumber

> Catatan: P1 sengaja memakai CLI, bukan UI. Tujuannya membuktikan pipa, bukan tampilan. Pemisahan
> client–server (ADR-011) baru diwajibkan di P2.

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
