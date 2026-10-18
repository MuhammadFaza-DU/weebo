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

Tanpa keempatnya, agent berisiko mengusulkan ulang hal yang sudah diputuskan atau melanggar
batasan yang sudah dihitung.

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
  hanya disebut di README.
- Pengembangan menggunakan **Cursor**.
- **NVIDIA Nemotron** diintegrasikan di tempat ia memberi nilai nyata.
- Deliverable: repo GitHub dengan README (setup, usage, dependencies), video demo 1–4 menit, dan
  slide deck.
- Semua materi submission berbahasa Inggris.

**Aturan eligibilitas:** pekerjaan yang di-commit sebelum build window dibuka tidak dihitung, kecuali
komponen pre-existing yang dideklarasikan. Setiap penambahan pre-existing wajib dicatat di
`PREEXISTING.md` pada commit yang sama.

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
- Aplikasi tersedia untuk desktop, tablet, dan ponsel dari satu codebase. Untuk lomba: PWA dulu,
  native menyusul.
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
packages/meterless  Adapter Meterless (vendored, jangan diedit langsung)
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
- Setiap pemanggilan tool melewati policy layer di `packages/core` (allow/deny + audit log).
- Secret dibaca dari environment atau keychain OS di runtime, tidak pernah dari kode atau client.

Detail: `docs/ARCHITECTURE.md`.

## 8. Workflow fase

Fase adalah **gate hasil**, bukan durasi. Tidak ada timebox. Fase ditutup hanya jika deliverable dan
syarat lulusnya terpenuhi.

| Fase | Deliverable | Syarat lulus |
|---|---|---|
| P1 Walking Skeleton | Satu alur tipis **lewat CLI**: prompt → intent → memory → model → Zetaris → jawaban | Bisa didemokan 30 detik di terminal |
| P2 Agent Core | Loop, tool registry, policy allow/deny, audit log, protokol runtime–client | Tool call tercatat dan bisa ditolak |
| P3 Memory & Reasoning | H-MEM mining/retrieval/audit, embedding nyata, jejak "kenapa" | Mengingat lintas sesi dan menjelaskan sumber |
| P4 Design System | Token + komponen dasar di canvas | HALT + approval eksplisit user |
| P5 Surfaces | **PWA** sebagai client runtime: chat, tasks, connectors, settings BYOK, responsif | Jalan di layar HP dan desktop |
| P6 Autonomy | Scheduler headless, channel bridge, jalur model | Tugas berjalan tanpa client terhubung |
| P7 Landing Page | Astro: narasi, fitur + badge status, CTA | Bisa dibuka publik |
| P8 Submission | Video script, slide deck, README, PREEXISTING, audit klaim | Semua deliverable lomba lengkap |

P4 dan P7 boleh berjalan paralel oleh orang berbeda.

File task per fase dibuat saat fase itu dimulai. Saat ini baru `docs/phases/P1-walking-skeleton.md`
yang ada; P2–P8 menyusul. Jangan menganggap fase tanpa file sudah punya rencana task.

**Protokol keluar fase (wajib, lima-limanya):**

1. Deliverable bisa didemokan.
2. `CHECKPOINT.md` diperbarui.
3. Commit dibuat dan tag `stable-YYYY-MM-DD-vN` ditawarkan.
4. Approval eksplisit user diminta dan diterima.
5. Laporan verifikasi disampaikan, termasuk apa yang belum terverifikasi.

Jangan memulai fase berikutnya sebelum kelima hal ini selesai.

## 9. Task

- Fase dipecah menjadi task berukuran kecil (≤ 2 jam) dengan kriteria selesai yang jelas.
- Task dicatat di `docs/phases/Pn-<nama>.md` dan dicentang satu per satu.
- Agent mengeksekusi per task, bukan mengklaim "fase selesai" tanpa bukti.
- Task yang tidak selesai dipindahkan ke backlog, bukan dihapus diam-diam.

## 10. Subagent

- **Default:** satu implementer per fase, wajib diikuti reviewer read-only yang tidak mengedit file.
- Implementer bekerja di folder project yang sama, bukan worktree di luar project kecuali disetujui.
- Implementer tidak boleh membuat subagent tambahan.
- Jika kuota subagent habis, kerja boleh dilanjutkan di sesi utama, tetapi reviewer read-only tetap
  wajib sebelum fase dinyatakan selesai.
- **Fleksibel:** sebelum memakai subagent, tanyakan ke user apakah ia ingin dikerjakan native di sesi
  utama atau lewat subagent. Jangan mengasumsikan preferensi.
- Fase Design System dikerjakan di sesi utama, tanpa subagent.

## 11. Protokol desain

- Design System dikerjakan di canvas sebelum kode UI ditulis.
- Cakupan: layar utama, responsive behavior, dan state penting.
- Sebelum mengedit canvas, panggil `get_app_state()` dan pastikan dokumen aktif benar.
- Setelah canvas selesai, ajukan paket review dan **berhenti total**.
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
