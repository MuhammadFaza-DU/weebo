# AGENTS.md — Aturan Project

Dokumen ini adalah aturan kerja khusus repo ini. Ia **melengkapi** `AGENTS.md` global milik user, tidak
menggantikannya.

Berlaku untuk semua yang bekerja di repo ini: manusia maupun agent AI.

**Status arah produk: BELUM DITETAPKAN.** Ide produk sebelumnya sudah dibatalkan dan dihapus pada
2026-10-21. Yang tersisa di repo ini adalah aturan lomba, kerangka kerja, dan infrastruktur. Bagian §6
dan §7 sengaja dibiarkan kosong sampai arah baru disepakati — jangan mengisinya dengan asumsi.

---

## 1. Otoritas

1. Instruksi langsung user menang atas semua dokumen.
2. `AGENTS.md` global user adalah aturan utama.
3. `AGENTS.md` project ini berlaku untuk pekerjaan di folder project ini dan hanya boleh mengalahkan
   aturan global jika lebih spesifik untuk project ini.
4. `docs/RULES.md` adalah transkripsi terverifikasi aturan resmi lomba. Jika dokumen lain bertentangan
   dengan file ini soal kewajiban lomba, `docs/RULES.md` yang menang.
5. `CHECKPOINT.md` adalah sumber kebenaran status kerja, keputusan, risiko, dan next action.
6. `PREEXISTING.md` adalah sumber kebenaran deklarasi eligibilitas lomba.
7. `docs/CONTEXT.md` memuat pengetahuan kerja: bobot penilaian lomba, batasan tim, dan fakta lingkungan.
8. `docs/SUBMISSION.md` memuat deliverable dan tenggat yang mengikat.

Jika ada konflik antar dokumen, hentikan pekerjaan yang berisiko dan minta keputusan user.

### 1.1 Urutan baca wajib di awal sesi

Agent yang baru masuk **wajib** membaca berurutan sebelum mengubah apa pun:

1. `CHECKPOINT.md` — status sekarang, risiko, next action.
2. `docs/RULES.md` — aturan resmi lomba, terverifikasi.
3. `docs/CONTEXT.md` — bobot penilaian, batasan tim, fakta lingkungan.
4. `docs/SUBMISSION.md` — deliverable dan tenggat yang mengikat.
5. `docs/PHASES.md` — kerangka fase, timeline resmi, protokol keluar fase.
6. `docs/SPONSORS.md` — kewajiban integrasi sponsor.
7. `docs/SETUP-SPONSORS.md` — jalur akses sponsor dan status verifikasi.
8. `PREEXISTING.md` — aturan eligibilitas yang mengikat.

Tanpa kedelapannya, agent berisiko mengusulkan ulang hal yang sudah diputuskan atau melanggar batasan
yang sudah dihitung.

**Bahasa dokumen.** Dokumen internal (file ini, `CHECKPOINT.md`, `docs/*`) ditulis dalam Bahasa
Indonesia sebagai dokumen kerja. Materi submission ditulis dalam **Bahasa Inggris** — README, video,
slide deck, dan penjelasan integrasi sponsor. Ini **keputusan tim, bukan syarat lomba**: `docs/RULES.md`
tidak memuat kewajiban bahasa sama sekali. Alasannya praktis: juri dan sponsor berbahasa Inggris.

## 2. Konteks lomba (mengikat)

Project ini dikerjakan untuk **Open Agent Hackathon 2026** (GenAI.Works).

| Item | Nilai |
|---|---|
| Build window | 22 Okt 2026 00:00 UTC → 27 Okt 2026 23:45 UTC (144 jam) |
| Registrasi tutup | 22 Okt 2026 23:45 UTC (hard deadline) |
| Tim | Maksimum 5 orang |
| Track | **Belum dipilih.** Dipilih saat membuat submission, bisa diganti sampai tenggat |

**Syarat wajib yang tidak boleh dilanggar:**

- Integrasi **Zetaris** dan **Meterless** harus benar-benar dipanggil saat runtime di kode — bukan
  hanya disebut di README.
- Pengembangan memakai **Cursor** (syarat lomba). Cara tim memakainya: **review**, bukan menulis kode —
  lihat §20.
- Deliverable: repo GitHub dengan README (setup, usage, dependencies), video demo 1–4 menit, slide
  deck, penjelasan integrasi sponsor, pemilihan track, dan deklarasi pre-existing. Daftar lengkap:
  `docs/SUBMISSION.md`.
- Semua materi submission berbahasa Inggris.

> **Sumber kewajiban di atas:** `docs/RULES.md` §5.1 dan §6.1–§6.4. Kutipan verbatim tidak diulang di
> sini (§21.7) — `docs/RULES.md` adalah satu-satunya sumbernya.

**Sangat dianjurkan, bukan syarat diskualifikasi:**

- **NVIDIA Nemotron** diintegrasikan di tempat ia memberi nilai nyata. Aturan lomba menyebut
  *"Integrate NVIDIA technology wherever it contributes"* — ini dinilai pada kriteria **Sponsor tech
  (10 dari 100 poin)**, bukan syarat kelulusan.

**Aturan eligibilitas:** pekerjaan yang di-commit sebelum build window dibuka tidak dihitung, kecuali
komponen pre-existing yang dideklarasikan. Setiap penambahan pre-existing wajib dicatat di
`PREEXISTING.md` pada commit yang sama.

**Larangan mutlak:** jangan men-commit kode produk (`apps/`, `packages/`) sebelum **22 Okt 2026 00:00
UTC**. Ini satu-satunya gate tanggal yang sah (lihat §8.1).

> **Sumber aturan:** transkripsi lengkap §01–§10 ada di `docs/RULES.md`, terverifikasi dari tangkapan
> layar halaman resmi (2026-10-18). Jangan mengutip aturan dari sumber sekunder — beberapa artikel dan
> ringkasan AI memuat klaim yang salah.

## 3. Kejujuran dan originalitas

- Semua kode yang masuk repo ini adalah **karya tim sendiri**. Tidak ada penyalinan kode, aset visual,
  ikon, atau teks milik pihak lain.
- Referensi eksternal dipelajari sebagai **pengetahuan**, bukan bahan salin.
- Dependensi open source dipakai sebagaimana mestinya, dengan lisensi dan atribusi otomatis lewat
  `package.json` dan `LICENSE`.
- Jangan mengklaim fitur sudah jalan kalau belum. Status di README dan landing page wajib sesuai
  kenyataan (`live` vs `roadmap`).
- Jangan mengarang hasil test, angka benchmark, atau transkrip integrasi.

## 4. Batas folder dan file

- Root project: `D:\Progamming\Project dan SourceCode\Lomba\Weebo-Hackaton`.
- Semua hasil kerja, termasuk scratch, cache, dan hasil riset, berada di dalam root project.
- Gunakan `.cache/` untuk scratch yang tidak boleh masuk commit.
- Catatan belajar pribadi tidak disimpan di dalam repo. Jika ada di mesin lokal, pastikan diabaikan
  oleh Git dan tidak pernah di-commit.
- Jangan menulis ke `%TEMP%`, home directory, atau folder lain di luar project tanpa persetujuan.
- Jangan pernah men-commit secret: `.env`, key, token, atau kredensial provider.

## 5. Aturan biaya

- **Utamakan gratis.** Semua layanan yang dipakai harus punya jalur free tier yang terverifikasi.
- Berbayar diperbolehkan **hanya jika benar-benar dibutuhkan** dan setelah user menyetujui.
- Jangan mengaktifkan layanan yang menimbulkan biaya tersembunyi.
- Jangan menyimpan key provider berbayar di repo atau di gateway publik.
- Verifikasi syarat free tier sebelum mengklaim sesuatu "gratis".

## 6. Arah produk dan posisi

**BELUM DITETAPKAN.** Ide sebelumnya sudah dibatalkan pada 2026-10-21 dan dihapus dari repo.

Jangan menulis definisi produk di sini sampai user menyetujuinya secara eksplisit. Setiap usulan arah
baru wajib melewati `brainstorming` lebih dulu, lalu dicatat sebagai ADR di `docs/DECISIONS.md`
(berkas itu dibuat ulang saat ADR pertama yang baru disepakati).

## 7. Arsitektur

**BELUM DITETAPKAN.** Struktur folder, stack, dan bentuk runtime dibahas setelah arah produk jelas.

Yang **sudah** mengikat dan tidak bergantung pada arah produk:

- Tidak ada kode produk yang di-commit sebelum 22 Okt 2026 00:00 UTC (§8.1).
- Setiap pemanggilan tool harus melewati lapisan policy (allow/deny + audit log).
- Secret dibaca dari environment atau keychain OS, tidak pernah dari kode atau client.

## 8. Workflow fase

Fase adalah **gate hasil**, bukan durasi. Tidak ada timebox. Fase ditutup hanya jika deliverable dan
syarat lulusnya terpenuhi.

Setiap fase punya file sendiri di `docs/phases/` berisi daftar task kecil (≤ 2 jam) dengan kriteria
selesai. Task dicentang satu per satu; agent mengeksekusi per task, bukan per fase.

**Fase tidak boleh dimulai tanpa file task-nya dibuat lebih dulu.** Panduan memecah fase menjadi task
ada di `docs/PHASES.md`.

### 8.1 Penundaan berbasis dependensi — dilarang memakai gate tanggal

Fase dan pekerjaan ditunda karena **dependensi belum terpenuhi**, bukan karena tanggal. Dilarang
menulis "setelah lomba", "pasca-lomba", "after the hackathon", atau padanannya sebagai alasan
penundaan.

**Pengecualian tunggal: build window lomba.** Ada **satu** gate tanggal yang sah dan wajib dipatuhi,
karena berasal dari aturan lomba: **tidak ada kode produk yang boleh di-commit sebelum 22 Okt 2026
00:00 UTC.**

Pekerjaan yang boleh dilakukan sebelum window: dokumen, rencana, setup akun, uji kelayakan, dan
pembuktian integrasi yang **tidak di-commit** ke repo.

Pengecualian ini **bukan** preseden untuk gate tanggal lain. Semua penundaan lain tetap berbasis
dependensi.

**Cara yang benar:** setiap item yang ditunda wajib punya tiga hal:

| Kolom | Isi |
|---|---|
| **Dependensi** | Apa yang harus selesai lebih dulu agar item ini bisa dimulai |
| **Syarat mulai** | Kondisi yang harus benar saat memulai |
| **Prioritas** | Urutan jika waktu tersisa |

**Syarat mulai — ketiganya wajib:**

1. Dependensi item tersebut sudah terpenuhi.
2. Deliverable wajib lomba sudah aman: repo bisa dijalankan dari clone bersih, video demo siap,
   slide deck siap, README lengkap.
3. User menyetujui secara eksplisit untuk memulai.

Agent **wajib menawarkan** item berikutnya saat ketiga syarat terpenuhi — bukan menunggu diminta, dan
bukan memutuskan sendiri.

### 8.2 Protokol keluar fase

Ini satu-satunya salinan yang mengikat. `docs/PHASES.md` memuat ringkasan; jika berbeda, dokumen ini
yang berlaku.

**Wajib, keenam-enamnya:**

1. Deliverable bisa didemokan.
2. `CHECKPOINT.md` diperbarui.
3. Commit dibuat dan tag `stable-YYYY-MM-DD-vN` ditawarkan.
4. Approval eksplisit user diminta dan diterima.
5. Laporan verifikasi disampaikan, termasuk apa yang belum terverifikasi.
6. `docs/CURSOR-LOG.md` diperbarui — agent **wajib menanyakan** apakah ada review di Cursor pada fase
   ini, lalu mencatat jawabannya apa adanya, termasuk "tidak ada".

Jangan memulai fase berikutnya sebelum keenam hal ini selesai.

**Tentang Cursor (lihat §20).** Cursor dipakai untuk **review**, bukan menulis kode. Jangan pernah
menulis di dokumen mana pun bahwa kode ditulis di Cursor.

## 9. Task

- Fase dipecah menjadi task berukuran kecil (≤ 2 jam) dengan kriteria selesai yang jelas.
- Task dicatat di `docs/phases/Pn-<nama>.md` dan dicentang satu per satu.
- Agent mengeksekusi per task, bukan mengklaim "fase selesai" tanpa bukti.
- Task yang tidak selesai dipindahkan ke backlog, bukan dihapus diam-diam.

## 10. Subagent

- **Default:** satu implementer per fase, wajib diikuti reviewer read-only yang tidak mengedit file.
  Reviewer dijalankan lewat `subagent` dengan agent `explore`, diberi daftar file yang berubah, dan
  mengembalikan laporan temuan. Reviewer tidak menulis file.
- Implementer bekerja di folder project yang sama, bukan worktree di luar project kecuali disetujui.
- Implementer tidak boleh membuat subagent tambahan.
- Jika kuota subagent habis, kerja boleh dilanjutkan di sesi utama, tetapi reviewer read-only tetap
  wajib sebelum fase dinyatakan selesai.
- **Fleksibel:** sebelum memakai subagent, tanyakan ke user apakah ia ingin dikerjakan native di sesi
  utama atau lewat subagent. Jangan mengasumsikan preferensi.

## 11. Protokol desain

- Design System dikerjakan di canvas sebelum kode UI ditulis.
- **Tool:** Pen (pen.dev) lewat MCP `pencil`. Dokumen `.pen` diakses **hanya** melalui MCP Pen, jangan
  lewat tool file biasa.
- Sebelum mengedit canvas, panggil `get_app_state()` dan pastikan dokumen aktif benar.
- Cakupan: layar utama, responsive behavior (ponsel, tablet, desktop), dan state penting (kosong,
  memuat, error, tanpa koneksi runtime).
- **Paket review** yang diajukan sebelum HALT berisi: tangkapan layar setiap layar, daftar state yang
  tercakup, dan daftar token (warna, tipe, spacing) yang dipakai.
- Setelah canvas selesai, ajukan paket review dan **berhenti total**.
- **HALT** berarti: agent berhenti, tidak menulis kode UI, tidak melanjutkan ke task berikutnya, dan
  menunggu kata kunci approval. Ini bukan jeda sementara — agent benar-benar berhenti sampai
  dijawab.
- Kode UI tidak boleh dimulai sampai user mengetik `APPROVE`, `SETUJU`, atau `LANJUT`.
- "bagus", "ok", atau "lanjutkan saja" **bukan** approval.
- Arah visual mengikuti keputusan user; jangan menetapkan sendiri tanpa persetujuan.

## 12. Merge, review, dan git

- `main` diproteksi. Semua perubahan lewat Pull Request.
- **Hanya user (`@MuhammadFaza-DU`) yang berhak merge ke `main`.** Kontributor lain membuka PR.
- Minimal satu review disetujui sebelum merge, dan **wajib dari code owner** (hanya user).
- **CI wajib hijau** sebelum PR bisa di-merge (`Lint, typecheck, test` — termasuk pemeriksa
  konsistensi dokumen §21.4).
- `CODEOWNERS` menunjuk user untuk semua path.
- Review yang sudah diberikan otomatis gugur jika ada commit baru di PR (dismiss stale reviews).
- Semua diskusi di PR wajib resolved sebelum merge.
- Jangan force push ke `main`. Jangan hapus branch `main`.
- Jangan merge PR yang gagal CI.

## 13. Commit, tag, dan aksi destruktif

- Jangan commit, tag, push, atau merge tanpa persetujuan eksplisit user.
- Setiap titik stabil, **tawarkan** commit dan tag.
- Konvensi tag: `stable-YYYY-MM-DD-vN`.
- Konvensi pesan commit: conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`).
- Jangan memakai `git reset --hard`, `git clean -fdx`, atau aksi destruktif lain tanpa persetujuan.
- Jangan menghapus file user yang tidak terkait pekerjaan yang sedang disetujui.

## 14. CHECKPOINT.md

- Wajib dibaca di awal setiap sesi.
- Wajib diperbarui ketika ada perubahan bermakna (lihat §18), dan sebelum mengakhiri pekerjaan atau
  sebelum konteks berpotensi hilang.
- Ditulis langsung di working tree. Commit hanya setelah user menyetujui checkpoint.
- Perubahan mekanis kecil tidak wajib dicatat satu per satu; cukup diringkas di pembaruan berikutnya.

## 15. PREEXISTING.md

- Mencatat setiap komponen yang dibuat **sebelum** build window dibuka.
- Wajib diperbarui pada commit yang sama saat komponen pre-existing ditambahkan.
- Isinya harus bisa dibuktikan dari riwayat commit, bukan klaim.
- Tujuannya agar deklarasi ke juri akurat dan submission tidak berisiko didiskualifikasi.

## 16. Verifikasi dan kejujuran

- Jangan mengklaim sesuatu selesai tanpa menjalankan verifikasi yang relevan.
- Laporkan hasil test, build, typecheck, dan lint apa adanya.
- Jika belum dijalankan atau belum bisa diverifikasi, tulis eksplisit **belum terverifikasi**.
- Setelah mengubah kode, jalankan pemeriksaan yang relevan (`npm run lint`, `npm run typecheck`,
  `npm test`) dan laporkan hasilnya.
- Setelah mengubah **dokumen**, jalankan `node scripts/check-docs.mjs` dan laporkan hasilnya (§21.4).
- Security scan ditawarkan terpisah sebelum deploy publik, tidak dijalankan otomatis.

## 17. Skill dan laporan

- Gunakan skill yang relevan sesuai konteks.
- Di akhir pekerjaan, laporkan: skill yang dipakai, keputusan penting, hasil verifikasi, dan hal yang
  belum terverifikasi.
- Sebelum commit yang menyentuh dokumen, jalankan `node scripts/check-docs.mjs` (§21.4).
- Jika commit menyentuh dokumen di peta dampak §21.3, lakukan **review makna** dan nyatakan hasilnya
  dalam satu baris (§21.7). Keluaran `LULUS` **bukan** pengganti review makna.
- Untuk pekerjaan UI, ikuti protokol canvas-first, approval gate, dan pemeriksaan kualitas visual.
- Untuk pekerjaan data atau backend, ikuti prinsip test-first, contract-first, validasi input, dan
  verifikasi yang dapat diulang.

## 18. Definisi perubahan bermakna

Perubahan yang memengaruhi setidaknya satu dari:

- status fase;
- scope produk;
- keputusan atau ruling;
- struktur data, schema, atau kontrak;
- file atau aset yang menjadi deliverable;
- hasil verifikasi;
- risiko atau blocker;
- commit, tag, atau next action;
- isi `PREEXISTING.md`;
- **fakta turunan** (angka, daftar, hitungan, nomor section, nama berkas) — lihat §21.

Perubahan bermakna memicu kewajiban sinkronisasi lintas dokumen (§21.2).

## 19. Saat instruksi tidak jelas

- Ajukan pertanyaan melalui popup jika tool tersedia.
- Jangan menebak jika keputusan dapat mengubah scope, biaya, keamanan, atau arah produk.
- Jangan membuat asumsi yang tidak bisa diverifikasi; nyatakan ketidakpastian secara eksplisit.

## 20. Cursor — cara pakai yang benar

Aturan lomba mewajibkan tim memakai Cursor dan menjelaskan pemakaiannya di submission.

**Cara tim ini memakai Cursor: untuk review, bukan menulis kode.**

- Seluruh penulisan kode dilakukan dengan agent harness lain.
- Cursor dipakai untuk membaca, menelusuri, dan mereview perubahan.
- Tim tidak membangun di dalam Cursor. Jangan menulis sebaliknya di dokumen mana pun.

**Kewajiban agent:**

1. Pada setiap penutupan fase, **tanyakan** apakah ada review di Cursor pada fase itu.
2. Catat jawabannya di `docs/CURSOR-LOG.md` apa adanya, **termasuk "tidak ada"**.
3. Jangan mengarang entri log. Log kosong lebih baik daripada log palsu.
4. Jangan menulis klaim "kode ditulis di Cursor" dalam bentuk apa pun.

**Yang dilarang:**

- Membuat entri log untuk pekerjaan yang tidak terjadi.
- Menyarankan mengambil tangkapan layar Cursor untuk pekerjaan yang dikerjakan di alat lain.
- Menulis di submission bahwa Cursor dipakai untuk menulis kode.

**Yang sah dan dianjurkan:**

- Memakai Cursor untuk review nyata, lalu mencatat apa yang di-review.
- Menulis bagian *"what needs work"* pada Product Feedback berdasarkan pengalaman nyata.

## 21. Sinkronisasi dan konsistensi lintas dokumen

Aturan ini ada karena inkonsistensi paling sering lahir dari **satu fakta yang ditulis di banyak
tempat**, bukan dari kelalaian. Satu fakta berubah, tiga dokumen jadi salah, dan tidak ada yang tahu
ketiganya terkait.

### 21.1 Penyebab utama: duplikasi fakta turunan

**Fakta turunan** adalah fakta yang punya satu sumber kebenaran tetapi ditulis ulang di tempat lain.
Contoh: jumlah dokumen pada urutan baca §1.1, daftar berkas di `docs/`, jumlah ADR, jumlah user story.

**Aturan:**

1. **Jangan menduplikasi fakta turunan.** Jika sebuah dokumen butuh fakta itu, **tunjuk sumbernya**
   (contoh: *"lihat `AGENTS.md` §1.1"*), jangan tulis ulang angkanya.
2. Duplikasi **hanya boleh** terjadi bila salah satu benar:
   - fakta itu **diperiksa otomatis** oleh `scripts/check-docs.mjs`; atau
   - fakta itu tidak mungkin ditautkan (mis. angka di tengah kalimat prosa yang dibaca manusia).
3. Duplikasi yang diizinkan **wajib** diperbarui pada commit yang sama saat sumbernya berubah.

### 21.2 Pemicu kewajiban sinkronisasi

Sinkronisasi wajib ketika terjadi salah satu dari:

- **fakta turunan berubah** (angka, daftar, hitungan, nomor section, nama berkas); atau
- **perubahan bermakna** menurut §18.

Perbaikan typo, penyempurnaan kalimat, dan penyesuaian format **tidak** memicu kewajiban ini.

### 21.3 Peta dampak

Tabel ini menjawab *"kalau saya ubah X, apa lagi yang harus diperiksa?"*. Bukan daftar lengkap —
peta ini mencatat **kaitan yang sudah terbukti**, bukan menebak semua kemungkinan.

| Kalau kamu mengubah… | Wajib periksa dan sinkronkan |
|---|---|
| `AGENTS.md` §1.1 (menambah/menghapus butir urutan baca) | Penutup §1.1 (ordinalnya), `README.md` (jumlah dokumen), `CHECKPOINT.md` (jumlah dokumen), `CONTRIBUTING.md` |
| `docs/RULES.md` (aturan lomba) | `AGENTS.md` §2, `docs/CONTEXT.md`, `docs/SUBMISSION.md`, `PREEXISTING.md` |
| Menambah atau menghapus berkas di `docs/` | Daftar `docs/` di `CHECKPOINT.md`, `README.md`, `CONTRIBUTING.md`, `AGENTS.md` §1.1 bila masuk urutan baca, `PREEXISTING.md` |
| Nomor atau judul section mana pun | Semua yang merujuk `berkas.md` §N — dijalankan otomatis oleh `scripts/check-docs.mjs` |
| Status verifikasi (sesuatu jadi terverifikasi atau gagal) | `CHECKPOINT.md` bagian "Belum terverifikasi", `docs/CONTEXT.md`, `docs/SETUP-SPONSORS.md` §7 |
| Task di berkas fase | `docs/PHASES.md` bila syarat lulus berubah, `CHECKPOINT.md` next action |
| Deliverable submission | `docs/SUBMISSION.md`, `CHECKPOINT.md`, `PREEXISTING.md` bila perlu |
| Komponen pre-existing | `PREEXISTING.md` **pada commit yang sama** (§15) |
| Arah produk atau arsitektur (ADR baru) | `docs/CONTEXT.md`, `CHECKPOINT.md`, `README.md` |

### 21.4 Verifikasi — wajib dijalankan, bukan opsional

Sebelum commit yang menyentuh dokumen, **wajib** menjalankan:

```
node scripts/check-docs.mjs
```

Pemeriksa ini menangkap: tautan internal rusak, rujukan `berkas.md` §N yang tidak ada, rujukan ADR /
user story / task yang tidak ada, **tabel Markdown yang kolomnya tidak konsisten**, jumlah urutan baca
yang tidak cocok, dan karakter rusak (U+FFFD / mojibake).

**Cakupannya adalah isi repo, bukan seluruh disk.** Pemeriksa memakai `git ls-files` (ditambah berkas
baru yang belum di-ignore), sehingga berkas yang di-exclude tidak diperiksa. Ini disengaja: tanpa itu,
hasil di mesin lokal berbeda dari CI.

**Keluaran `LULUS` berbunyi "tidak ada kerusakan BENTUK", bukan "isi dokumen benar".** Jangan
meringkasnya menjadi "dokumen sudah konsisten" — itu klaim yang tidak didukung pemeriksa (§21.5, §21.7).

CI menjalankan pemeriksa yang sama pada setiap push dan pull request. **Jangan mengakali pemeriksa**
dengan melemahkan pola atau menambahkan pengecualian tanpa alasan tertulis.

Selftest `node scripts/check-docs.selftest.mjs` membuktikan pemeriksa masih menangkap setiap kelas
kesalahan. Jalankan bila `check-docs.mjs` diubah.

### 21.5 Batas yang harus dinyatakan

**Pemeriksa hanya memeriksa bentuk yang bisa dibaca mesin.**

Ia **tidak** tahu apakah:

- dua dokumen menyatakan hal yang saling bertentangan dengan kata berbeda
  (`"wajib"` vs `"harus"` vs `"must"` vs `"required"`);
- sebuah kalimat masih sesuai kenyataan;
- angka di dalam prosa masih benar (hanya bentuk terdaftar yang diperiksa, mis. jumlah urutan baca §1.1);
- tanggal atau nilai yang diulang di beberapa berkas cocok;
- sebuah klaim sudah tidak berlaku karena keadaan berubah.

**Karena itu: `LULUS` bukan bukti dokumen benar.** Ia hanya bukti tidak ada kerusakan struktural.

### 21.6 Kalau sinkronisasi tidak bisa dilakukan sekarang

Kadang dokumen tujuan belum ada (mis. berkas fase yang belum dibuat). Dalam kasus itu:

1. Jangan menulis fakta itu ke dokumen yang belum ada.
2. **Catat utangnya** di `CHECKPOINT.md` bagian "Belum dikerjakan", dengan menyebut dokumen tujuan.
3. Jangan menghapus kewajiban itu diam-diam.

Utang yang tercatat boleh menunggu. Utang yang tidak tercatat akan hilang.

### 21.7 Review makna — kewajiban yang tidak bisa diotomatiskan

Pemeriksa menjawab *"apakah bentuknya rusak?"*. Ia tidak menjawab *"apakah isinya masih benar?"*.
Pertanyaan kedua **wajib dijawab manusia atau agent dengan membaca**, dan hasilnya **wajib dinyatakan**.

**Kapan wajib:** setiap kali sebuah commit menyentuh dokumen yang muncul di peta dampak §21.3. Tidak
perlu untuk typo atau perubahan format.

**Apa yang dilakukan:**

1. **Baca kedua sisi.** Dokumen yang diubah, dan dokumen yang tercantum di kolom kanan peta dampak.
2. **Bandingkan klaimnya, bukan pilihan katanya.** `"wajib"` dan `"harus"` dan `"must"` adalah klaim
   yang sama. Itu **bukan** inkonsistensi.
3. **Nyatakan hasilnya dalam satu baris** di laporan akhir, menyebut apa yang dibandingkan:

   ```
   Review makna: AGENTS.md §2 dibandingkan dengan docs/RULES.md §5.1 — klaim sama.
   ```

   Jika berbeda, tulis bedanya dan **jangan perbaiki sendiri** — laporkan ke user, karena perbedaan
   klaim bisa berarti keputusan berubah, bukan kesalahan penulisan.

**Dua larangan:**

**1. Dilarang menyeragamkan kata tanpa alasan.** Menemukan `"wajib"` di satu tempat dan `"harus"` di
tempat lain **bukan** alasan menyunting apa pun. Yang berbahaya adalah dua **klaim** yang berbeda.

**2. Dilarang menyalin ulang fakta yang sudah punya sumber.** Jika menemukan fakta yang sama ditulis di
beberapa tempat (§21.1), **ganti salinannya dengan rujukan** ke sumber.

**Yang harus dinyatakan jujur:** jika review makna **tidak** dilakukan, tulis itu apa adanya di
laporan: *"review makna belum dilakukan untuk perubahan ini"*. Jangan menutupinya dengan keluaran
`LULUS`.
