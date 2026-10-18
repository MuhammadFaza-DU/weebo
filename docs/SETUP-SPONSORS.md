# Checklist Setup Akun Sponsor

Dokumen kerja: apa yang harus didaftarkan **sebelum** build window dibuka, dan bagaimana memverifikasi
bahwa aksesnya benar-benar bekerja.

Aturan: centang hanya setelah diverifikasi. Jika belum, biarkan kosong dan tulis apa yang menghalangi.

**Tenggat praktis:** 22 Okt 2026 23:59 UTC (registrasi lomba tutup). Setup sponsor sebaiknya selesai
sehari sebelumnya.

---

## 1. Registrasi lomba (blocker paling keras)

- [ ] Punya akun di platform GenAI.Works
- [ ] Sudah klik Register pada event Open Agent Hackathon 2026
- [ ] **Tim sudah dibentuk di platform** (bukan hanya kesepakatan di chat)
- [ ] Ketiga anggota sudah tergabung
- [ ] Track dipilih: **Track 03 — Reasoning Architecture**
- [ ] Catat URL workspace tim: ______________________

> Catatan: komposisi tim terkunci saat submission pertama dibuat. Bentuk tim sebelum mulai submit.

---

## 2. Zetaris

Rencana: **trial 30 hari, tanpa kartu kredit**, full platform.

- [ ] Daftar di halaman trial Zetaris Cloud
- [ ] Verifikasi email
- [ ] Masuk ke console
- [ ] Buat satu data source percobaan
- [ ] Jalankan satu query berhasil
- [ ] Catat: Org ID = ______________
- [ ] Buat API key, simpan di tempat aman (bukan di repo)
- [ ] Verifikasi akses MCP (baca dokumentasi MCP Connection)
- [ ] Catat tanggal mulai trial: ______________ (trial 30 hari — jangan daftar terlalu awal)

**Yang harus dibuktikan:** satu query nyata mengembalikan data.

**Risiko:** jika memilih paket Hobby (gratis permanen), compute dibayar di cloud sendiri. Untuk lomba,
gunakan trial.

---

## 3. NVIDIA NIM

Rencana: endpoint gratis, kompatibel Chat Completions, tanpa credits.

- [ ] Buat akun NVIDIA (verifikasi telepon mungkin diperlukan)
- [ ] Buka `build.nvidia.com`, pilih model Nemotron
- [ ] Generate API key (format `nvapi-...`)
- [ ] Simpan key di `.env` lokal (gitignored) atau secret manager
- [ ] Uji satu request ke `https://integrate.api.nvidia.com/v1`
- [ ] Catat model yang tersedia dan konteksnya
- [ ] Uji endpoint embedding `nemotron-3-embed-1b`, catat dimensi vektor yang dikembalikan
- [ ] Catat rate limit yang teramati: ______________

**Yang harus dibuktikan:** satu respons sukses dari endpoint chat **dan** endpoint embedding.

---

## 4. Meterless

Rencana: engine open source, di-*vendor* lewat `npx degit`.

- [ ] Clone atau baca `github.com/Meterless/Meterless`
- [ ] Jalankan demo cold-vs-warm (`npx tsx examples/memory-compounding-research/index.ts`)
- [ ] Catat: demo berjalan / gagal (jika gagal, catat error)
- [ ] Vendor `engines/hmem/reference` **dan** `engines/hmem/conformance` (dua folder bersaudara)
- [ ] `npm install && npm test` di dalam `vendor/hmem/reference`
- [ ] Jalankan conformance dari `vendor/hmem/conformance`:
      `HMEM_IMPL=<abs>/vendor/hmem/reference/src/index.ts npx tsx runner.ts`
- [ ] Catat scorecard: lulus / gagal (lampirkan output)
- [ ] Catat ukuran engine: ____ file, ____ KB
- [ ] Perbarui `PREEXISTING.md` pada commit yang sama (vendor adalah komponen pihak ketiga)

**Yang harus dibuktikan:** demo memory jalan lokal tanpa API key, dan conformance suite hijau.

---

## 5. Cursor

Rencana: dipakai untuk **review**, bukan menulis kode. Seluruh penulisan kode memakai agent harness lain.

**Aturan lomba:** lihat `docs/RULES.md` §5.1 (kewajiban Zetaris, Meterless, dan Cursor) dan §6.4
(kewajiban menjelaskan pemakaian Cursor). Kutipan verbatim tidak diulang di sini (§21.7).

**Fakta terverifikasi 2026-10-18 (dari halaman resmi Cursor):**

| Item | Fakta |
|---|---|
| Plan Free | Ada, $0/bulan, tanpa kartu kredit, tidak kedaluwarsa |
| Isi | Agent + Chat + Tab dengan kuota terbatas |
| Angka pasti | **Tidak dipublikasikan** Cursor. Artikel yang menyebut angka memakai era harga lama |
| Model pihak ketiga | Tidak termasuk di Free (hanya model Cursor) |

- [ ] Konfirmasi plan yang dipakai: ______________
- [ ] Pasang Cursor, buka repo ini
- [ ] Lakukan satu review nyata pada kode hasil fase berjalan
- [ ] Catat batasan yang teramati (kuota, model)
- [ ] Isi `docs/CURSOR-LOG.md` setiap penutupan fase

**Yang harus dibuktikan:** log review nyata di `docs/CURSOR-LOG.md`, bukan klaim.

> Aturan lengkap: `AGENTS.md` §20. Jangan menulis di dokumen mana pun bahwa kode **ditulis** di
> Cursor — kode ditulis di alat lain, Cursor dipakai untuk review.

---

## 6. Model lokal (opsional, gratis sejati)

- [ ] Pasang Ollama atau LM Studio
- [ ] Tarik satu model yang layak untuk tool calling
- [ ] Uji endpoint kompatibel Chat Completions secara lokal
- [ ] Catat RAM yang dibutuhkan dan kecepatan

---

## 7. Ringkasan verifikasi

Isi setelah semua dicek:

| Layanan | Status | Bukti | Catatan |
|---|---|---|---|
| Registrasi lomba | | | |
| Tim di platform | | | |
| Zetaris | | | |
| Zetaris dari browser (T0.3) | | | menentukan arsitektur |
| NVIDIA NIM chat | | | |
| NVIDIA NIM embedding | | | |
| NVIDIA NIM rate limit | | | hasil pengukuran sendiri |
| Meterless conformance (T0.6) | | | scorecard |
| Cursor | | | |
| Model lokal | | | |

Status yang sah: `terverifikasi`, `terdaftar belum diuji`, `belum`, `gagal`.
