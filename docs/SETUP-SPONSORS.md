# Checklist Setup Akun Sponsor

Dokumen kerja: apa yang harus didaftarkan **sebelum** build window dibuka, dan bagaimana memverifikasi
bahwa aksesnya benar-benar bekerja.

Aturan: centang hanya setelah diverifikasi. Jika belum, biarkan kosong dan tulis apa yang menghalangi.

**Tenggat praktis:** 22 Okt 2026 23:45 UTC (registrasi lomba tutup).

---

## 1. Registrasi lomba (blocker paling keras)

- [ ] Punya akun di platform GenAI.Works
- [ ] Sudah klik Register pada event Open Agent Hackathon 2026
- [ ] **Tim sudah dibentuk di platform** (bukan hanya kesepakatan di chat)
- [ ] Track dipilih: ______________ (bisa diganti sampai tenggat — `docs/RULES.md` §3.3)
- [ ] Catat URL workspace tim: ______________________

> Catatan: **komposisi tim terkunci saat submission pertama dibuat**, bukan saat track dipilih
> (FAQ §3). Bentuk tim sebelum mulai submit.

---

## 2. Zetaris — wajib

**Jawaban resmi cara akses — FAQ §5 (2026-10-20):**

> *"Access instructions and setup steps are in **each sponsor's folder in Resources on HackOS**.
> Resources are being updated as sponsors add material. For help with a sponsor's technology, use that
> sponsor's Help channel on HackOS (Help Zetaris, Help Meterless, Help Cursor, Help NVIDIA). For general
> technical questions, use the #help desk channel."*

**Ini mengoreksi asumsi lama.** Rencana awal *"daftar trial 30 hari di halaman trial Zetaris Cloud"*
**bukan** jalur peserta. Halaman `zetaris.com` saat diperiksa (2026-10-20) menampilkan **Hobby $0 free
forever** dengan model **BYOC** (*"You pay your cloud provider for compute"*) dan **tidak menampilkan
trial 30 hari**. Paket berbayar: Professional $0.14/vCPU/jam, Enterprise $0.20/vCPU/jam. **Jangan daftar
Zetaris standalone** — jalur peserta berbeda.

**Langkah konkret, urut:**

1. Buka **HackOS → Resources → folder Zetaris**. Baca access instructions di sana.
2. Kalau tidak ada atau tidak jelas → **channel `Help Zetaris`**, tanyakan akses peserta.
3. Kalau masih buntu → **mentor office hours** (mentor di-briefing soal *"where to route deeper
   technical issues"*, Event Calendar §3).
4. Tonton rekaman **Data Day (12 Okt)** — topiknya *"Zetaris: serving internal data"*.

**Checklist verifikasi:**

- [ ] Access instructions dari folder Zetaris dibaca
- [ ] Kredensial/akses diperoleh
- [ ] Satu query berhasil mengembalikan data
- [ ] Catat: Org ID / endpoint = ______________
- [ ] API key disimpan di `.env` lokal (gitignored), **bukan** di repo
- [ ] Akses MCP diverifikasi (baca dokumentasi MCP Connection)
- [ ] Catat cara memanggilnya dari kode (MCP / REST / lainnya)

**Yang harus dibuktikan:** satu query nyata mengembalikan data.

**Yang masih belum diketahui:** apakah folder itu menyediakan akses **tanpa akun cloud sendiri**.
Status tetap **`belum`** sampai ada bukti query nyata.

> **Koreksi penting:** Discord **bukan** kanal support. Welcome Guide §7 menyatakan *"Discord is the
> GenAI Works community space for community chat and activities after the hackathon"*, dan §13 *"All
> support during the hackathon happens on HackOS."*

**Sumber resmi yang wajib dipantau:** Event Calendar §9 menetapkan **Announcements di HackOS** sebagai
sumber resmi untuk tanggal workshop, jadwal mentor office hours, dan ketersediaan submission form.
Periksa setiap hari selama build window.

**Jadwal yang harus dipakai:**

| Kapan | Apa | Untuk apa |
|---|---|---|
| **21 Okt 12:00–13:30 UTC** | Participant onboarding (HackOS) | Segmen "Sponsor technology" + Q&A — kesempatan terbaik menanyakan akses Zetaris. **Rekaman tersedia di HackOS** jika tidak bisa hadir live |
| TBC | Build Day (Cursor, GenAI Works, Meterless) | Workshop Meterless |
| TBC | Power Day (NVIDIA, Meterless) | Workshop NVIDIA + Meterless |

Ikuti lewat course GenAI Academy: `https://academy.genai.works/courses/open-agent-hackathon-2026/details`

---

## 3. NVIDIA NIM — sangat dianjurkan

- [ ] Buat akun NVIDIA (verifikasi telepon mungkin diperlukan)
- [ ] Buka `build.nvidia.com`, pilih model Nemotron
- [ ] Generate API key (format `nvapi-...`)
- [ ] Simpan key di `.env` lokal (gitignored), **bukan** di repo
- [ ] Uji satu request ke `https://integrate.api.nvidia.com/v1`
- [ ] Catat model yang tersedia dan konteksnya
- [ ] Catat rate limit yang teramati: ______________

**Yang harus dibuktikan:** satu respons sukses dari endpoint chat.

---

## 4. Meterless — wajib

- [x] Clone atau baca `github.com/Meterless/Meterless`
- [x] Vendor `engines/hmem/reference` **dan** `engines/hmem/conformance` (dua folder bersaudara)
- [x] `npm install && npm test` di dalam `vendor/hmem/reference`
- [x] Jalankan conformance dari `vendor/hmem/conformance`:
      `HMEM_IMPL=<abs>/vendor/hmem/reference/src/index.ts npx tsx runner.ts`
- [x] Catat scorecard: lulus / gagal (lampirkan output)
- [x] Catat ukuran engine: **10** file, **43.725 byte**
- [x] Perbarui `PREEXISTING.md` pada commit yang sama (vendor adalah komponen pihak ketiga)

**Hasil 2026-10-20:** commit `1742dec`, `npm test` **10/10 lulus**, conformance **13/13 checks passed**
(exit 0). Bukti: `docs/SPONSORS.md` §2.

---

## 5. Cursor — wajib

Rencana: dipakai untuk **review**, bukan menulis kode. Seluruh penulisan kode memakai agent harness lain.

**Aturan lomba:** lihat `docs/RULES.md` §5.1 (kewajiban Zetaris, Meterless, dan Cursor) dan §6.4
(kewajiban menjelaskan pemakaian Cursor). Kutipan verbatim tidak diulang di sini (`AGENTS.md` §21.7).

**Fakta terverifikasi 2026-10-18 (dari halaman resmi Cursor):**

| Item | Fakta |
|---|---|
| Plan Free | Ada, $0/bulan, tanpa kartu kredit, tidak kedaluwarsa |
| Isi | Agent + Chat + Tab dengan kuota terbatas |
| Angka pasti | **Tidak dipublikasikan** Cursor |
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

| Layanan | Status | Bukti | Catatan |
|---|---|---|---|
| Registrasi lomba | | | |
| Tim di platform | | | |
| Zetaris | | | |
| Zetaris dari browser | | | menentukan arsitektur |
| NVIDIA NIM chat | | | |
| NVIDIA NIM rate limit | | | hasil pengukuran sendiri |
| Meterless conformance | **terverifikasi** | `docs/SPONSORS.md` §2 | 13/13 checks passed, exit 0, commit `1742dec` |
| Cursor | | | |
| Model lokal | | | |

Status yang sah: `terverifikasi`, `terdaftar belum diuji`, `belum`, `gagal`.
