# P0 — Preflight dan Verifikasi Asumsi

**Tujuan:** menutup semua blocker dan menjawab semua asumsi **sebelum satu baris kode produk ditulis**.

**Syarat lulus:** setiap item di bawah punya status yang bisa dibuktikan — `terverifikasi`, `gagal`,
atau `diterima sebagai risiko`. Tidak boleh ada yang berstatus "sepertinya bisa".

**Kenapa fase ini ada:** P1 bergantung pada tiga hal yang saat ini **belum ada satu pun**: akses
Zetaris, akses NVIDIA NIM, dan bentuk tim di platform lomba. Selain itu ada empat asumsi arsitektur
yang, kalau salah, membuat P1 harus diulang. Lebih murah menguji sekarang daripada memperbaiki nanti.

Fase ini **tidak menghasilkan fitur**. Ia menghasilkan kepastian.

---

## Task

### T0.1 — Registrasi lomba dan tim

- [ ] Pastikan akun platform GenAI.Works aktif
- [ ] Bentuk tim di platform (bukan hanya kesepakatan di chat)
- [ ] Undang kedua anggota, pastikan tergabung
- [ ] Pilih track: **Track 03 — Reasoning Architecture**
- [ ] Catat URL workspace tim

**Kriteria selesai:** tangkapan layar atau URL workspace yang menunjukkan 3 anggota tergabung.

> Catatan: komposisi tim terkunci saat submission pertama dibuat. Ini harus selesai sebelum tenggat
> registrasi (22 Okt 2026 23:59 UTC).

---

### T0.2 — Akun Zetaris + uji akses

- [ ] Daftar trial 30 hari (tanpa kartu kredit)
- [ ] Verifikasi email, masuk console
- [ ] Buat satu data source percobaan
- [ ] Jalankan satu query, catat hasilnya
- [ ] Catat Org ID dan buat API key (simpan di `.env`, jangan di repo)
- [ ] Baca dokumentasi MCP Connection, catat bentuk endpoint
- [ ] **Catat tanggal mulai trial** — trial 30 hari, jangan sampai kedaluwarsa sebelum submission

**Kriteria selesai:** satu query nyata mengembalikan data, output ditempel di `docs/SPONSORS.md`.

---

### T0.3 — Uji Zetaris dari browser (menentukan arsitektur)

**Ini pertanyaan arsitektur, bukan sekadar uji coba.** Hasilnya menentukan apakah PWA bisa memanggil
Zetaris langsung atau wajib lewat runtime.

- [ ] Ambil endpoint Zetaris (MCP atau REST)
- [ ] Coba satu request dari console browser di halaman lokal
- [ ] Catat: berhasil / gagal karena CORS / gagal karena auth
- [ ] Simpulkan: **PWA bisa langsung** atau **wajib lewat runtime**

**Kriteria selesai:** kesimpulan tertulis di `docs/SPONSORS.md` beserta bukti (pesan error atau
respons sukses).

**Kenapa di P0:** kalau ternyata wajib lewat runtime, itu memperkuat ADR-011 dan tidak mengubah
rencana. Kalau ternyata bisa langsung, kita punya opsi tambahan. Yang berbahaya adalah menemukannya
di tengah P1.

---

### T0.4 — Akun NVIDIA NIM + ukur rate limit

- [ ] Buat akun NVIDIA (verifikasi telepon mungkin diperlukan)
- [ ] Generate API key (`nvapi-...`), simpan di `.env`
- [ ] Uji satu request chat ke `https://integrate.api.nvidia.com/v1`
- [ ] Uji satu request embedding ke `nemotron-3-embed-1b`, catat dimensi vektor
- [ ] **Ukur rate limit sebenarnya**: kirim request berulang sampai kena 429, catat jumlah dan waktu
- [ ] Catat model mana yang tersedia dan konteksnya

**Kriteria selesai:** respons sukses untuk chat dan embedding, plus angka rate limit hasil pengukuran
sendiri (bukan kutipan dokumentasi), dicatat di `docs/CONTEXT.md` §4.

> Angka ~40 RPM yang tercatat sekarang berasal dari dokumentasi, **belum diukur**. Ganti dengan hasil
> pengukuran.

---

### T0.5 — Cursor

- [ ] Konfirmasi plan yang dipakai (Free / Plus / lain)
- [ ] Pasang Cursor, buka repo ini
- [ ] Catat batasan yang teramati (kuota, model yang tersedia)
- [ ] Tentukan pembagian: bagian mana yang dikerjakan di Cursor

**Kriteria selesai:** keputusan tertulis tentang cara memenuhi syarat "use Cursor for development",
beserta catatan jujur tentang batasannya.

**Fakta terverifikasi (2026-10-18):** plan Free ada, $0, tanpa kartu kredit, tidak kedaluwarsa.
Isinya Agent + Chat + Tab dengan kuota terbatas yang **angkanya tidak dipublikasikan Cursor**. Model
pihak ketiga (Claude/GPT/Gemini) tidak termasuk. Klaim pihak ketiga bahwa MCP/skills tidak tersedia di
Free **belum terverifikasi** — jangan dijadikan patokan.

---

### T0.6 — Vendor Meterless + uji conformance (validasi awal)

- [ ] Vendor `engines/hmem/reference` ke `vendor/hmem`, pertahankan `LICENSE` (Apache-2.0)
- [ ] `npm install && npm test` di dalam `vendor/hmem`
- [ ] Jalankan conformance: `HMEM_IMPL=... npx tsx conformance/runner.ts`
- [ ] Catat scorecard: lulus / gagal, lampirkan output
- [ ] Catat apakah suite bisa jalan tanpa Node penuh (relevan untuk CI)

**Kriteria selesai:** scorecard conformance ditempel di `docs/SPONSORS.md`.

**Kenapa di P0, bukan P3:** kalau engine tidak bisa jalan di lingkungan kita, seluruh rencana memori
berubah — dan itu harus diketahui sebelum P1, bukan setelah.

> Conformance dijalankan **dua kali**: di P0 untuk validasi awal, dan di P3 setelah adapter embedding
> dipasang, untuk membuktikan adaptasi kita masih mematuhi kontrak.

---

### T0.7 — Ringkasan status akses

- [ ] Isi tabel verifikasi di `docs/SETUP-SPONSORS.md` §7
- [ ] Perbarui `docs/CONTEXT.md` §9 (asumsi yang sudah terjawab)
- [ ] Perbarui `CHECKPOINT.md`
- [ ] Tawarkan commit + tag

**Kriteria selesai:** tidak ada item berstatus "belum" yang masih menghalangi P1.

---

## Aturan fase ini

- **Jangan menulis kode produk** sebelum T0.1–T0.4 selesai.
- Boleh menulis skrip uji sekali pakai di `.cache/`, tidak di-commit.
- Setiap hasil uji dicatat dengan bukti (output, pesan error, tangkapan layar), bukan ingatan.
- Jika sesuatu gagal, catat **kegagalannya**, jangan dihapus.

---

## Risiko

| Risiko | Tanda | Tindakan |
|---|---|---|
| Zetaris butuh persetujuan manual | Console tidak bisa diakses setelah daftar | Hubungi support; sementara pakai data contoh resmi, catat sebagai workaround |
| NIM menolak verifikasi telepon | Tidak bisa generate key | Coba provider gratis lain (Groq/GitHub Models) untuk sementara, catat |
| Trial Zetaris kedaluwarsa sebelum submission | 30 hari dari pendaftaran | Daftar sedekat mungkin dengan build window, bukan jauh sebelumnya |
| Cursor Free kehabisan kuota di tengah | Agent request ditolak | Catat kapan terjadi; putuskan upgrade atau bagi tugas |
| Conformance gagal di lingkungan kita | Scorecard merah | Catat error spesifik; evaluasi apakah masalah lingkungan atau engine |
