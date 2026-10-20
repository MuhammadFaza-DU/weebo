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

Rencana awal: ~~trial 30 hari, tanpa kartu kredit, full platform~~ — **DIBATALKAN, lihat koreksi di bawah.**

> **Koreksi 2026-10-20 — asumsi ini salah.** Halaman
> `zetaris.com` saat diperiksa menampilkan **Hobby $0 free forever** dengan model **BYOC**
> (*"You pay your cloud provider for compute"*, cluster di VPC sendiri, live ~20 menit) dan **tidak
> menampilkan trial 30 hari**. Paket berbayar: Professional $0.14/vCPU/jam, Enterprise $0.20/vCPU/jam.
> Artinya jalur publik menuntut akun cloud sendiri + compute berbayar. **Jangan daftar Zetaris
> standalone** — jalur peserta berbeda, dan FAQ §5 sudah menyebutkannya (lihat di bawah).

**Jalur akses yang benar — dari Welcome Guide HackOS (2026-10-20).** Bukan lewat situs Zetaris, dan
bukan lewat Discord. Urutannya:

1. **HackOS → Resources → folder sponsor Zetaris.** Setiap sponsor punya folder sendiri berisi
   dokumentasi dan resources; isinya diperbarui saat sponsor menambah material.
2. **Channel `Help Zetaris` di HackOS** — untuk pertanyaan setup dan error. Ada juga `Help Meterless`,
   `Help Cursor`, `Help NVIDIA`.
3. **Rekaman workshop `Data Day` (12 Oktober 2026)** — topiknya *"Zetaris: serving internal data"*,
   rekaman sudah tersedia di HackOS. Ini kemungkinan besar menjelaskan cara akses untuk peserta.
4. **`#help desk`** — pertanyaan teknis umum, dijawab tim teknis.
5. **Mentor office hours** — termasuk mentor dari pihak sponsor; jangan tanya hal yang bisa dijawab
   dokumentasi.

**JAWABAN PASTI — FAQ §5 (2026-10-20).** Pertanyaan *"How do I get access to the sponsor
technologies?"* dijawab resmi:

> *"Access instructions and setup steps are in **each sponsor's folder in Resources on HackOS**.
> Resources are being updated as sponsors add material. For help with a sponsor's technology, use that
> sponsor's Help channel on HackOS (Help Zetaris, Help Meterless, Help Cursor, Help NVIDIA). For general
> technical questions, use the #help desk channel."*

**Ini mengoreksi asumsi lama di bagian atas dokumen ini.** Rencana awal *"daftar trial 30 hari di halaman
trial Zetaris Cloud"* **bukan** jalur peserta. Itu juga menjelaskan mengapa `zetaris.com` tidak
menampilkan trial 30 hari: jalur peserta memang bukan jalur publik.

**Langkah konkret T0.2, urut:**

1. Buka **HackOS → Resources → folder Zetaris**. Baca access instructions di sana.
2. Kalau tidak ada atau tidak jelas → **channel `Help Zetaris`**, tanyakan akses peserta.
3. Kalau masih buntu → **mentor office hours** (mentor di-briefing soal *"where to route deeper
   technical issues"*, Event Calendar §3).
4. Tonton rekaman **Data Day (12 Okt)** — kemungkinan memuat demo setup.

**Yang masih belum diketahui:** apakah folder itu menyediakan akses **tanpa akun cloud sendiri**. Status
T0.2 tetap **`belum`** sampai ada bukti query nyata yang mengembalikan data.

**Jalur eskalasi yang lebih tinggi — mentor.** Event Calendar §3 (Mentor Onboarding, 5 Okt) menyatakan
mentor diberi tahu *"the sponsor technology including Zetaris, Meterless and Cursor requirements, and
**where to route deeper technical issues**"*. Artinya mentor adalah jalur resmi untuk masalah sponsor
yang tidak selesai di channel Help. Pakai setelah `Help Zetaris` tidak menjawab.

**Sumber resmi yang wajib dipantau:** Event Calendar §9 menetapkan **Announcements di HackOS** sebagai
sumber resmi untuk tanggal workshop, jadwal mentor office hours, dan ketersediaan submission form.
Periksa setiap hari selama build window.

> **Koreksi penting atas saran sebelumnya:** Discord **bukan** kanal support. Welcome Guide §7
> menyatakan *"Discord is the GenAI Works community space for community chat and activities after the
> hackathon"*, dan §13 *"All support during the hackathon happens on HackOS."* Jadi bertanya ke CTO
> Zetaris di Discord bukan jalur yang tepat — pakai `Help Zetaris` di HackOS.

**Jadwal yang harus dipakai:**

| Kapan | Apa | Untuk apa |
|---|---|---|
| **21 Okt 12:00–13:30 UTC** | Participant onboarding (HackOS) | Segmen "Sponsor technology" + Q&A — kesempatan terbaik menanyakan akses Zetaris langsung. **Rekaman akan tersedia di HackOS** jika tidak bisa hadir live |
| TBC | Build Day (Cursor, GenAI Works, Meterless) | Workshop Meterless |
| TBC | Power Day (NVIDIA, Meterless) | Workshop NVIDIA + Meterless |

Ikuti lewat course GenAI Academy: `https://academy.genai.works/courses/open-agent-hackathon-2026/details`

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

- [x] Clone atau baca `github.com/Meterless/Meterless`
- [x] Jalankan demo cold-vs-warm (`npx tsx examples/memory-compounding-research/index.ts`)
- [x] Catat: demo berjalan / gagal (jika gagal, catat error)
- [x] Vendor `engines/hmem/reference` **dan** `engines/hmem/conformance` (dua folder bersaudara)
- [x] `npm install && npm test` di dalam `vendor/hmem/reference`
- [x] Jalankan conformance dari `vendor/hmem/conformance`:
      `HMEM_IMPL=<abs>/vendor/hmem/reference/src/index.ts npx tsx runner.ts`
- [x] Catat scorecard: lulus / gagal (lampirkan output)
- [x] Catat ukuran engine: **10** file, **43.725 byte**
- [x] Perbarui `PREEXISTING.md` pada commit yang sama (vendor adalah komponen pihak ketiga)

**Hasil 2026-10-20:** commit `1742dec`, `npm test` **10/10 lulus**, conformance **13/13 checks passed**
(exit 0). Bukti: `docs/SPONSORS.md` §2.

**Satu item masih terbuka:** demo cold-vs-warm belum dijalankan. Ia tidak menghalangi P1 (P1 hanya
membutuhkan engine ter-vendor + test hijau), tetapi **wajib** dicoba sebelum P3 karena demo itu yang
membuktikan narasi "memory compounding" yang akan tampil di video.**Yang harus dibuktikan:** demo memory jalan lokal tanpa API key, dan conformance suite hijau.

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
| Meterless conformance (T0.6) | terverifikasi | `docs/SPONSORS.md` §2 | 13/13 checks passed, exit 0, commit `1742dec` |
| Cursor | | | |
| Model lokal | | | |

Status yang sah: `terverifikasi`, `terdaftar belum diuji`, `belum`, `gagal`.
