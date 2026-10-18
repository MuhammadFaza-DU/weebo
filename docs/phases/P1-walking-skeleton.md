# P1 — Walking Skeleton

**Tujuan:** membuktikan seluruh pipa tersambung, walau jelek.

Satu alur tipis: user mengirim pertanyaan dari **terminal** → intent terdeteksi → memori dipanggil →
model menjawab → data diambil dari Zetaris → jawaban tampil beserta sumbernya.

**Syarat lulus:** alur di atas bisa didemokan dalam 30 detik, memakai data nyata dari lingkungan
Zetaris, bukan mock. **Plus:** smoke eval 5 pertanyaan dijalankan dan hasilnya dilampirkan apa adanya
(T1.8) — bukan untuk mengukur kualitas, tetapi membuktikan jawaban menyebut sumber sama sekali.

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
- [ ] T0.8 selesai — protokol evaluasi dan bentuk dataset demo ditetapkan (T1.8 bergantung pada ini)

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

### T1.8 — Dataset demo, golden set, dan runner evaluasi

Bentuk dataset dan rubrik sudah ditetapkan di **P0 T0.8**. Task ini mewujudkannya.

- [ ] Buat dataset sintetis di `eval/dataset/` sesuai bentuk yang diputuskan di T0.8 (~3 tabel, ~200 baris)
- [ ] Tulis `eval/golden/` berisi **30 entri**: 20 bisa dijawab (5 lookup, 5 lintas tabel, 5 agregasi, 3 rentang waktu, 2 butuh memori) + 10 tidak bisa dijawab
- [ ] Setiap entri memuat: pertanyaan, jawaban harapan, sumber harapan, kategori, penanda butuh-memori
- [ ] Buat `npm run eval` yang menjalankan golden set lewat **jalur yang sama dengan CLI**, bukan jalur khusus
- [ ] Hasil ditulis ke `eval/results/<tanggal>-p1.json` dengan field wajib termasuk nama dan versi model
- [ ] Suhu 0
- [ ] Tulis `eval/README.md`: cara menjalankan, arti setiap kolom, dan batasnya (N=30, dataset sintetis — **bukan benchmark**)
- [ ] Jalankan **smoke: 5 pertanyaan** dan lampirkan hasilnya di `docs/SPONSORS.md`
- [ ] Bekukan golden set: buat `eval/CHANGELOG.md` dan catat tanggal pembekuan

**Kriteria selesai:** `npm run eval` berjalan dan menghasilkan file hasil; 5 pertanyaan smoke dijalankan
dan hasilnya dilampirkan apa adanya, termasuk jika ada yang gagal.

> **Jangan menyempurnakan golden set agar hasilnya bagus.** Kalau pertanyaan gagal dijawab, itu temuan
> yang benar dan berharga. Setelah dibekukan, perubahan hanya lewat `eval/CHANGELOG.md` dengan alasan.

> Catatan: K1/K2/K5 baru bermakna setelah memori masuk (P3). Di P1 cukup dibuktikan bahwa pipa
> menghasilkan sitasi sama sekali — bukan bahwa sitasinya akurat.

### T1.9 — Catat bukti

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
