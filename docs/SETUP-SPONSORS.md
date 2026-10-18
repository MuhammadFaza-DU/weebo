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

Rencana: endpoint gratis, [OI]-compatible, tanpa credits.

- [ ] Buat akun NVIDIA (verifikasi telepon mungkin diperlukan)
- [ ] Buka `build.nvidia.com`, pilih model Nemotron
- [ ] Generate API key (format `nvapi-...`)
- [ ] Simpan key di `.env` lokal (gitignored) atau secret manager
- [ ] Uji satu request ke `https://integrate.api.nvidia.com/v1`
- [ ] Catat model yang tersedia dan konteksnya
- [ ] Catat rate limit yang teramati: ______________

**Yang harus dibuktikan:** satu respons sukses dari endpoint.

---

## 4. Meterless

Rencana: engine open source, di-*vendor* lewat `npx degit`.

- [ ] Clone atau baca `github.com/Meterless/Meterless`
- [ ] Jalankan demo cold-vs-warm (`npx tsx examples/memory-compounding-research/index.ts`)
- [ ] Catat: demo berjalan / gagal (jika gagal, catat error)
- [ ] Tentukan engine yang dipakai: H-MEM, Markovian, Scout Intent
- [ ] Uji `npx degit meterless/meterless/engines/hmem` ke folder sementara
- [ ] Catat ukuran dan dependensi engine

**Yang harus dibuktikan:** demo memory jalan lokal tanpa API key.

---

## 5. Cursor

Rencana: dipakai selama build window (syarat lomba).

- [ ] Konfirmasi akun Cursor aktif untuk ketiga anggota, atau minimal satu yang dipakai bersama
- [ ] Catat paket yang dipakai: ______________
- [ ] Uji membuka repo ini di Cursor
- [ ] Catat jika ada batasan (kuota, model)

---

## 6. Model lokal (opsional, gratis sejati)

- [ ] Pasang Ollama atau LM Studio
- [ ] Tarik satu model yang layak untuk tool calling
- [ ] Uji endpoint [OI]-compatible lokal
- [ ] Catat RAM yang dibutuhkan dan kecepatan

---

## 7. Ringkasan verifikasi

Isi setelah semua dicek:

| Layanan | Status | Bukti | Catatan |
|---|---|---|---|
| Registrasi lomba | | | |
| Tim di platform | | | |
| Zetaris | | | |
| NVIDIA NIM | | | |
| Meterless | | | |
| Cursor | | | |
| Model lokal | | | |

Status yang sah: `terverifikasi`, `terdaftar belum diuji`, `belum`, `gagal`.
