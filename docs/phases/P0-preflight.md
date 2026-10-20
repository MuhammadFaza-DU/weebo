# P0 — Preflight dan Verifikasi Asumsi

**Tujuan:** menutup semua blocker dan menjawab semua asumsi **sebelum satu baris kode produk ditulis**.

**Syarat lulus:** setiap item di bawah punya status yang bisa dibuktikan. Tidak boleh ada yang
berstatus "sepertinya bisa".

**Batas fase ini — dinyatakan di depan:** P0 **tidak mengukur KPI apa pun**. Kelima KPI di
`docs/PRD.md` §1.3 berstatus `provisional` dan **nol pengukuran** sampai P1 T1.8 dijalankan. Yang
dihasilkan P0 hanyalah *protokol* pengukurannya (T0.8), bukan angkanya. Jangan keluar dari fase ini
dengan klaim bahwa kualitas jawaban sudah terukur.

**Status yang sah** (definisi tunggal, dipakai juga di `docs/SETUP-SPONSORS.md` §7):

| Status | Arti |
|---|---|
| `terverifikasi` | Sudah diuji, hasilnya sesuai harapan, ada bukti |
| `terdaftar belum diuji` | Akun/akses ada, tapi belum dibuktikan bekerja |
| `belum` | Belum dikerjakan sama sekali |
| `gagal` | Sudah diuji, tidak berhasil |
| `diterima sebagai risiko` | Diketahui gagal/tidak tersedia, dan tim memutuskan melanjutkan tanpa itu |

Item yang masih `belum` atau `terdaftar belum diuji` **wajib** diselesaikan sebelum P1.

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

### T0.3 — Uji Zetaris dari browser (menentukan desain client, bukan arsitektur P1)

- [ ] Ambil endpoint Zetaris (MCP atau REST)
- [ ] Coba satu request dari console browser di halaman lokal
- [ ] Catat: berhasil / gagal karena CORS / gagal karena auth
- [ ] Simpulkan: **PWA bisa memanggil Zetaris langsung** atau **wajib lewat runtime**

**Kriteria selesai:** kesimpulan tertulis di `docs/SPONSORS.md` beserta bukti (pesan error atau
respons sukses).

**Apa yang hasilnya ubah dan tidak ubah:**

- **Tidak mengubah** arsitektur client–runtime. ADR-011 sudah menetapkan semua client lewat
  `packages/protocol`; itu berlaku apa pun hasilnya.
- **Mengubah** desain `packages/zetaris`: kalau browser tidak bisa memanggil langsung, semua akses
  Zetaris **wajib** lewat runtime, dan PWA tidak boleh punya jalur langsung sama sekali.

**Kenapa tetap diuji di P0:** kalau ternyata browser bisa memanggil langsung, tim mungkin tergoda
menambah jalur pintas di PWA. Keputusan itu harus diambil sadar, bukan ditemukan saat koding.

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
- [ ] Tentukan **kapan** review di Cursor dilakukan dalam alur kerja (mis. setiap penutupan fase)
- [ ] Tentukan siapa yang melakukan review

**Kriteria selesai:** keputusan tertulis tentang cara memenuhi syarat "use Cursor for development",
beserta catatan jujur tentang batasannya.

**Batas tegas (AGENTS.md §20):** Cursor dipakai untuk **review**, bukan menulis kode. Jangan
merencanakan pekerjaan yang "dikerjakan di Cursor".

**Fakta terverifikasi (2026-10-18):** plan Free ada, $0, tanpa kartu kredit, tidak kedaluwarsa.
Isinya Agent + Chat + Tab dengan kuota terbatas yang **angkanya tidak dipublikasikan Cursor**. Model
pihak ketiga (Claude/GPT/Gemini) tidak termasuk. Klaim pihak ketiga bahwa MCP/skills tidak tersedia di
Free **belum terverifikasi** — jangan dijadikan patokan.

---

### T0.6 — Vendor Meterless + uji conformance (validasi awal)

**Struktur penting:** conformance suite berada di `engines/hmem/conformance/` — **saudara** dari
`reference/`, bukan di dalamnya. Jadi vendoring harus mengambil **dua** folder.

- [x] Vendor `engines/hmem/reference` ke `vendor/hmem/reference`, pertahankan `LICENSE` (Apache-2.0)
- [x] Vendor `engines/hmem/conformance` ke `vendor/hmem/conformance`
- [x] `npm install && npm test` di dalam `vendor/hmem/reference`
- [x] Jalankan dari `vendor/hmem/conformance`:
      `HMEM_IMPL=<abs>/vendor/hmem/reference/src/index.ts npx tsx runner.ts`
- [x] Catat scorecard: lulus / gagal, lampirkan output apa adanya
- [x] Catat apakah suite bisa jalan tanpa Node penuh (relevan untuk CI)
- [x] **Perbarui `PREEXISTING.md` pada commit yang sama** — `vendor/hmem` adalah komponen pihak ketiga
      yang masuk sebelum window, jadi wajib dideklarasikan

**Kriteria selesai:** scorecard conformance ditempel di `docs/SPONSORS.md`, dan `PREEXISTING.md`
mencatat `vendor/hmem` pada commit yang sama.

**DITUTUP 2026-10-20 — lulus.** Commit sumber `1742dec`, `npm test` 10/10 lulus, conformance
**13/13 checks passed** exit 0. Ukuran engine terukur 43.725 byte. Demo cold-vs-warm juga berhasil
(cold 12 chunk → warm 8 chunk). Bukti di `docs/SPONSORS.md` §2. Catatan: `vendor/hmem/H-MEM-SPEC.md`
(salinan `engines/hmem/AGENTS.md`) ikut di-vendor sebagai rujukan spesifikasi yang mengikat
implementasi adapter kita.

**Temuan yang harus dibawa ke P3:** demo cold-vs-warm membutuhkan **dua** engine — `hmem` **dan**
`markovian`. Yang di-vendor baru `hmem`. Keputusan apakah `markovian` ikut di-vendor belum diambil;
dicatat sebagai pertanyaan terbuka di `CHECKPOINT.md`.

**Kenapa di P0, bukan P3:** kalau engine tidak bisa jalan di lingkungan kita, seluruh rencana memori
berubah — dan itu harus diketahui sebelum P1, bukan setelah.

> Conformance dijalankan **dua kali**: di P0 untuk validasi awal, dan di P3 setelah adapter embedding
> dipasang, untuk membuktikan adaptasi kita masih mematuhi kontrak.

---

### T0.7 — Putuskan bagaimana ponsel/tablet mencapai runtime

**Ini blocker P5.** Runtime mendengarkan di `localhost`; `localhost` di ponsel menunjuk ke ponsel itu
sendiri, bukan ke laptop. Tanpa keputusan ini, syarat lulus P5 ("jalan di layar HP") tidak bisa
dipenuhi dan demo video kehilangan bagian penutupnya.

- [x] Baca `docs/ARCHITECTURE.md` §2.2 (empat opsi: LAN bind, tunnel, pairing+token, Electron-only)
- [x] Pilih satu opsi, tulis alasannya
- [x] Tulis keputusan sebagai ADR baru di `docs/DECISIONS.md`
- [x] Tetapkan model autentikasi (token/pairing) — runtime tanpa token berarti proses lokal mana pun
      bisa mengendalikan agent
- [x] Catat di `docs/CONTEXT.md` §10 sebagai terjawab

**Kriteria selesai:** ADR tertulis, opsi terpilih, model auth disebut. Tidak perlu implementasi —
hanya keputusan. **DITUTUP 2026-10-20 → ADR-016** (LAN bind + pairing token; installability butuh
secure context).

**Kenapa di P0:** keputusan ini memengaruhi desain `apps/runtime` (bind address, auth) dan PWA (cara
menyimpan endpoint). Menemukannya di P5 berarti menulis ulang keduanya.

---

### T0.8 — Tetapkan protokol evaluasi dan bentuk dataset demo

**Ini keputusan, bukan kode.** Tanpa protokol yang ditetapkan sekarang, "agent menjawab dengan benar"
akan selamanya jadi klaim yang tidak bisa dibuktikan — dan itu melubangi K1, K2, K3, K4, K5 di
`docs/PRD.md` §1.3.

- [x] Baca `docs/PRD.md` §3.2 (dataset, golden set, rubrik, runner, batas)
- [x] Tetapkan bentuk dataset demo: tabel apa saja, kolom apa, berapa baris. Target ~3 tabel, ~200 baris
- [x] Pastikan dataset **sintetis** dan tidak memuat data nyata milik siapa pun
- [x] Tetapkan siapa yang menulis jawaban harapan di golden set (penulis ≠ penilai akhir, jika bisa)
- [x] Tetapkan dua orang penilai K1/K2 untuk run final. Jika hanya satu yang tersedia, catat itu sebagai keterbatasan
- [x] Tetapkan bentuk file hasil eval (`eval/results/<tanggal>-<fase>.json`) dan field wajibnya, termasuk nama + versi model **dan penanda mode (baseline / penuh)**
- [x] **Catat asal angka target K1–K5 secara terbuka:** dipilih tanpa dasar empiris, berstatus `provisional`
- [x] **Tetapkan aturan kalibrasi** di ADR: ditinjau di keluar P3, boleh naik maupun turun, wajib lewat `eval/CHANGELOG.md` dengan angka lama/baru + alasan + tanggal + penyetuju, dan **K2 tidak boleh dikalibrasi turun**
- [x] Tetapkan bentuk run baseline (mode tanpa memori) dan cara penandaannya di file hasil
- [x] Catat keputusan di `docs/DECISIONS.md` sebagai ADR baru

**Kriteria selesai:** ADR tertulis yang menyebut bentuk dataset, rubrik, penilai, field hasil, **asal
angka target, aturan kalibrasi, dan bentuk baseline**. Golden set belum ditulis di sini — itu P1 (T1.8).
**DITUTUP 2026-10-20 → ADR-015.** Dataset: merchant payments, 3 tabel / ~200 baris. Penilaian: setiap
entri dinilai dua orang yang bukan penulisnya, selisih dicatat apa adanya.

**Kenapa asal angka target wajib dicatat di sini:** angka 90% dan 80% tidak berasal dari data apa pun.
Kalau asalnya tidak ditulis, enam hari kemudian angka itu akan tampak seperti hasil pengukuran — dan
tidak ada yang berani mengubahnya karena dikira punya dasar. Mencatatnya sekarang mencegah itu.

**Kenapa di P0, bukan P1:** bentuk dataset menentukan apa yang bisa ditanyakan di golden set. Kalau
dataset dibuat sambil menulis pertanyaan, pertanyaan akan menyesuaikan diri dengan data yang kebetulan
ada — dan eval kehilangan kemampuan menemukan kelemahan.

---

### T0.9 — Ringkasan status akses

- [ ] Isi tabel verifikasi di `docs/SETUP-SPONSORS.md` §7
- [ ] Perbarui `docs/CONTEXT.md` §10 (asumsi yang sudah terjawab)
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
