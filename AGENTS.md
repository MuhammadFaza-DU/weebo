# AGENTS.md — Aturan Project Weebo

Dokumen ini adalah aturan kerja khusus project `weebo`. Dokumen ini **melengkapi** `AGENTS.md` global
milik user, tidak menggantikannya.

Berlaku untuk semua yang bekerja di repo ini: manusia maupun agent AI.

---

## 1. Otoritas

1. Instruksi langsung user menang atas semua dokumen.
2. `AGENTS.md` global user adalah aturan utama.
3. `AGENTS.md` project ini berlaku untuk pekerjaan di folder project `weebo` dan hanya boleh
   mengalahkan aturan global jika lebih spesifik untuk project ini.
4. `CHECKPOINT.md` adalah sumber kebenaran status kerja, keputusan, risiko, dan next action.
5. `PREEXISTING.md` adalah sumber kebenaran deklarasi eligibilitas lomba.
6. `docs/DECISIONS.md` adalah catatan keputusan yang sudah disepakati. Jika kode bertentangan dengan
   dokumen itu, kode yang salah — kecuali ada keputusan baru yang dicatat.
7. `docs/CONTEXT.md` memuat pengetahuan kerja yang tidak ada di ADR: bobot penilaian lomba, batasan
   tim, angka yang sudah diukur, dan hal-hal yang sengaja ditolak.

Jika ada konflik antar dokumen, hentikan pekerjaan yang berisiko dan minta keputusan user.

### 1.1 Urutan baca wajib di awal sesi

Agent yang baru masuk **wajib** membaca berurutan sebelum mengubah apa pun:

1. `CHECKPOINT.md` — status sekarang, risiko, next action.
2. `docs/DECISIONS.md` — keputusan yang mengikat (ADR-001 … terbaru).
3. `docs/CONTEXT.md` — bobot penilaian, batasan tim, angka terukur, daftar yang sudah ditolak.
4. `docs/PHASES.md` dan file fase aktif di `docs/phases/`.
5. `docs/SUBMISSION.md` — deliverable dan tenggat yang mengikat.
6. `docs/SPONSORS.md` — bukti integrasi yang harus dikumpulkan.
7. `PREEXISTING.md` — aturan eligibilitas yang mengikat.

Tanpa ketujuhnya, agent berisiko mengusulkan ulang hal yang sudah diputuskan atau melanggar
batasan yang sudah dihitung.

**Bahasa dokumen.** Dokumen internal (`AGENTS.md`, `CHECKPOINT.md`, `docs/*` dalam Bahasa Indonesia)
adalah dokumen kerja. Materi submission **wajib Bahasa Inggris**: README, video, slide deck, dan
penjelasan integrasi sponsor. Saat menyusun materi submission, terjemahkan — jangan menyalin dokumen
internal apa adanya.

## 2. Konteks lomba (mengikat)

Project ini dikerjakan untuk **Open Agent Hackathon 2026** (GenAI.Works).

| Item | Nilai |
|---|---|
| Build window | 22 Okt 2026 00:00 UTC → 27 Okt 2026 23:45 UTC |
| Registrasi tutup | 22 Okt 2026 23:59 UTC (hard deadline) |
| Track | **Track 03 — Reasoning Architecture** |
| Tim | 3 orang, maksimum 5 |

**Syarat wajib yang tidak boleh dilanggar:**

- Integrasi **Zetaris** dan **Meterless** harus benar-benar dipanggil saat runtime di kode — bukan
  hanya disebut di README. *(Kutipan aturan: "Every submission must integrate Zetaris and Meterless.")*
- Pengembangan memakai **Cursor** (syarat lomba). Cara tim memakainya: **review**, bukan menulis kode
  — lihat §20. *(Kutipan aturan: "teams must use Cursor for development.")*
- Deliverable: repo GitHub dengan README (setup, usage, dependencies), video demo 1–4 menit, slide
  deck, penjelasan integrasi sponsor, pemilihan track, dan deklarasi pre-existing. Daftar lengkap:
  `docs/SUBMISSION.md`.
- Semua materi submission berbahasa Inggris.

**Sangat dianjurkan, bukan syarat diskualifikasi:**

- **NVIDIA Nemotron** diintegrasikan di tempat ia memberi nilai nyata. Aturan lomba menyebut
  *"Integrate NVIDIA technology wherever it contributes"* — ini dinilai pada kriteria **Sponsor tech
  (10 dari 100 poin)**, bukan syarat kelulusan. Tetap dikerjakan karena nilainya besar, tetapi jangan
  sampai mengorbankan Zetaris/Meterless.

**Aturan eligibilitas:** pekerjaan yang di-commit sebelum build window dibuka tidak dihitung, kecuali
komponen pre-existing yang dideklarasikan. Setiap penambahan pre-existing wajib dicatat di
`PREEXISTING.md` pada commit yang sama.

**Larangan mutlak:** jangan men-commit kode produk (`apps/`, `packages/`, `vendor/`) sebelum
**22 Okt 2026 00:00 UTC**. Ini satu-satunya gate tanggal yang sah (lihat §8.1). Konsekuensinya jika
dilanggar: karya tidak dihitung, dan deklarasi di `PREEXISTING.md` menjadi tidak benar.

> Catatan sumber: teks aturan lengkap berada di halaman resmi lomba yang dirender sebagai accordion.
> **Simpan tangkapan layar §04–§07 ke `docs/` sebelum mengandalkan kutipan mana pun.** Jika sebuah
> kutipan tidak bisa diverifikasi, tulis sebagai parafrase, bukan sebagai kutipan.

## 3. Kejujuran dan originalitas

- Semua kode yang masuk repo ini adalah **karya tim sendiri**. Tidak ada penyalinan kode, aset
  visual, ikon, atau teks milik pihak lain.
- Referensi eksternal dipelajari sebagai **pengetahuan**, bukan bahan salin.
- Dependensi open source dipakai sebagaimana mestinya, dengan lisensi dan atribusi otomatis lewat
  `package.json` dan `LICENSE`.
- Catatan belajar pribadi disimpan di luar repo dan tidak pernah di-commit. Cuplikan referensi hanya
  untuk pemahaman, tidak boleh dipindahkan ke kode produk.
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

- Weebo adalah **agent harness open source**, self-hosted, BYOK.
- Posisi: **kanal personal setara produk terkemuka + akses ke data kerja yang governed.**
- Tiga pilar: **mengingat** (memory), **bertindak** (tools dan connector), **menjelaskan** (alasan
  di balik jawaban).
- Weebo bukan chatbot. Setiap fitur harus lolos pertanyaan: "apakah ini membuat agent melakukan
  pekerjaan nyata?"
- Aplikasi tersedia untuk desktop, tablet, dan ponsel dari satu codebase. Jalur kirim utama: PWA.
  Electron dan Capacitor dimulai saat dependensinya terpenuhi (ADR-010, §8.1).
- **CLI adalah surface resmi**, diposisikan untuk developer dan scripting, bukan wajah utama produk.
  Wajah produk tetap PWA.

## 7. Arsitektur

Monorepo TypeScript. Satu runtime, banyak client. Runtime adalah satu-satunya yang menyentuh
kapabilitas platform; client hanya berbicara lewat protokol.

```
apps/runtime    Server lokal: agent loop, scheduler, MCP, secret (Node)
apps/cli        Client terminal: `npx weebo`, `npx weebo serve`
apps/web        Client PWA (React + Vite)
apps/landing    Astro marketing site
packages/core   Agent loop (intent → memory → plan → tool → verify), isomorphic
packages/protocol  Kontrak runtime–client, berversi
packages/meterless  Adapter Meterless (kita tulis sendiri; engine pihak ketiga di vendor/hmem)
packages/zetaris    Client Zetaris (MCP/REST, typed)
packages/connectors Registry connector MCP
packages/gateway    Gateway kuota gratis (Cloudflare Worker)
```

Aturan arsitektur:

- `packages/core` tidak boleh bergantung pada API Node-only. Jika butuh kapabilitas platform,
  gunakan adapter di `apps/runtime`.
- Client (`apps/cli`, `apps/web`) **tidak** memanggil `packages/core` langsung. Semua lewat
  `packages/protocol`.
- `vendor/` milik Meterless tidak boleh diedit. Semua penyesuaian lewat `packages/meterless/src`.
- Lokasi engine: `vendor/hmem/` di root repo. `packages/meterless/src` adalah adapter yang **kita
  tulis** dan boleh diedit.
- Setiap pemanggilan tool melewati policy layer di `packages/core` (allow/deny + audit log).
- Secret dibaca dari environment atau keychain OS di runtime, tidak pernah dari kode atau client.

Detail: `docs/ARCHITECTURE.md`.

## 8. Workflow fase

Fase adalah **gate hasil**, bukan durasi. Tidak ada timebox. Fase ditutup hanya jika deliverable dan
syarat lulusnya terpenuhi.

| Fase | Deliverable | Syarat lulus |
|---|---|---|
| **P0 Preflight** | Semua akses terverifikasi, asumsi arsitektur terjawab | Tidak ada blocker tersisa; setiap asumsi berstatus terjawab |
| P1 Walking Skeleton | Satu alur tipis **lewat CLI**: prompt → intent → memory → model → Zetaris → jawaban | Bisa didemokan 30 detik di terminal |
| P2 Agent Core | Loop, tool registry, policy allow/deny, audit log, **protokol runtime–client selesai** | Tool call tercatat dan bisa ditolak; CLI bicara ke runtime lewat `packages/protocol`, bukan memanggil core langsung |
| P3 Memory & Reasoning | H-MEM mining/retrieval/audit, embedding nyata, jejak "kenapa" | Mengingat lintas sesi dan menjelaskan sumber |
| P4 Design System | Token + komponen dasar di canvas | HALT + approval eksplisit user |
| P5 Surfaces | **PWA** sebagai client runtime: chat, tasks, connectors, settings BYOK, responsif | Jalan di layar HP dan desktop |
| P6 Autonomy | Scheduler headless, channel bridge, jalur model | Tugas berjalan tanpa client terhubung |
| P7 Landing Page | Astro: narasi, fitur + badge status, CTA | Bisa dibuka publik |
| P8 Submission | **Video jadi (1–4 menit)**, slide deck, README, PREEXISTING, audit klaim | Semua deliverable lomba lengkap |

P4 dan P7 boleh berjalan paralel oleh orang berbeda.

File task per fase dibuat saat fase itu dimulai. Saat ini baru `docs/phases/P0-preflight.md` dan
`docs/phases/P1-walking-skeleton.md` yang ada; P2–P8 menyusul. Jangan menganggap fase tanpa file sudah
punya rencana task. **Fase tidak boleh dimulai tanpa file task-nya dibuat lebih dulu.**

Panduan memecah fase menjadi task (ukuran, format, kriteria selesai yang baik vs buruk, larangan):
lihat `docs/PHASES.md`.

### 8.1 Penundaan berbasis dependensi — dilarang memakai gate tanggal

Fase dan pekerjaan ditunda karena **dependensi belum terpenuhi**, bukan karena tanggal. Dilarang
menulis "setelah lomba", "pasca-lomba", "after the hackathon", atau padanannya sebagai alasan
penundaan.

**Alasan:** ADR-007 menetapkan fase adalah gate hasil, bukan durasi. Gate tanggal bertentangan dengan
itu dan menghapus opsionalitas — pekerjaan yang sebenarnya bisa dimulai lebih awal menjadi tidak
mungkin dimulai.

#### Pengecualian tunggal: build window lomba

Ada **satu** gate tanggal yang sah dan wajib dipatuhi, karena berasal dari aturan lomba, bukan dari
kita: **tidak ada kode produk yang boleh di-commit sebelum 22 Okt 2026 00:00 UTC.**

Pekerjaan yang boleh dilakukan sebelum window: dokumen, rencana, setup akun, uji kelayakan (P0), dan
pembuktian integrasi yang **tidak di-commit** ke repo. Kode produk (`apps/`, `packages/`) masuk
setelah window dibuka, atau tidak dihitung sebagai karya lomba.

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
- Fase Design System dikerjakan di sesi utama, tanpa subagent.

## 11. Protokol desain

- Design System dikerjakan di canvas sebelum kode UI ditulis.
- **Tool:** Pen (pen.dev) lewat MCP `pencil`. Dokumen `.pen` diakses **hanya** melalui MCP Pen, jangan
  lewat tool file biasa.
- Sebelum mengedit canvas, panggil `get_app_state()` dan pastikan dokumen aktif benar.
- Cakupan: layar utama (chat, tasks/cron, connectors, settings BYOK), responsive behavior (ponsel,
  tablet, desktop), dan state penting (kosong, memuat, error, tanpa koneksi runtime).
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
- **CI wajib hijau** sebelum PR bisa di-merge (`Lint, typecheck, test`).
- `CODEOWNERS` menunjuk user untuk semua path.
- Review yang sudah diberikan otomatis gugur jika ada commit baru di PR (dismiss stale reviews).
- Semua diskusi di PR wajib resolved sebelum merge.
- Jangan force push ke `main`. Jangan hapus branch `main`.
- Jangan merge PR yang gagal CI.

Kontributor tetap bebas bekerja: membuat branch, push, membuka PR, dan berdiskusi. Yang dijaga bukan
kebebasan berkarya, melainkan isi `main`.

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
- Security scan ditawarkan terpisah sebelum deploy publik, tidak dijalankan otomatis.

## 17. Skill dan laporan

- Gunakan skill yang relevan sesuai konteks.
- Di akhir pekerjaan, laporkan: skill yang dipakai, keputusan penting, hasil verifikasi, dan hal yang
  belum terverifikasi.
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
- isi `PREEXISTING.md`.

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
- Menulis bagian *"what needs work"* pada Product Feedback berdasarkan pengalaman nyata dengan plan
  yang dipakai.
