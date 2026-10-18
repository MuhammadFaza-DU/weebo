# Catatan Keputusan (ADR)

Setiap keputusan yang mengubah arah produk, arsitektur, atau proses dicatat di sini. Format ringkas:
konteks → keputusan → konsekuensi.

Aturan: jika kode bertentangan dengan dokumen ini, kode yang salah — kecuali ada ADR baru yang
menggantikannya.

---

## ADR-001 — Stack: monorepo TypeScript dengan core isomorphic

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** Weebo harus berjalan di desktop, tablet, dan ponsel. Dua kandidat utama: Tauri v2
(satu codebase untuk desktop + Android) dan web-first PWA. Pemeriksaan mesin kerja menunjukkan Rust
dan MSVC Build Tools **tidak terpasang**, sementara Node v24 dan Java 17 tersedia. Meterless adalah
library TypeScript, sehingga memilih Flutter akan memutus akses langsung ke engine yang wajib
diintegrasikan.

**Keputusan.** Monorepo TypeScript. Core agent isomorphic (Node + browser). UI React + Vite sebagai
PWA (jalur kirim utama). Target desktop: **Electron** (lihat ADR-010), mobile native: Capacitor.
Keduanya dimulai saat dependensinya terpenuhi, bukan pada tanggal tertentu.

**Konsekuensi.**

- Nol setup Rust di tiga mesin, risiko build gagal turun drastis.
- Engine Meterless bisa dipakai langsung sebagai dependency, bukan di-porting.
- PWA bisa di-install di Android dan desktop tanpa store.
- Butuh disiplin menjaga `packages/core` bebas API Node-only.
- Butuh adapter boundary eksplisit agar Electron bisa ditambahkan tanpa penulisan ulang.

---

## ADR-002 — Track lomba: Track 03 Reasoning Architecture

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** Lomba punya tiga track plus satu wildcard. Track 01 menekankan penemuan data
terfragmentasi, Track 02 menekankan investigasi dengan bukti, Track 03 menekankan mengubah data,
pengetahuan, memori, dan reasoning menjadi keputusan serta aksi yang bisa dipercaya.

**Keputusan.** Track 03.

**Konsekuensi.**

- Fitur "menjelaskan kenapa" (jejak langkah + sumber) menjadi inti, bukan tambahan.
- Memory (Meterless H-MEM) dan reasoning yang dapat dijelaskan mendapat porsi besar.
- Track 01 dan 02 tetap terlayani sebagian, tetapi tidak dikejar sebagai target penilaian.

---

## ADR-003 — Posisi produk: kanal personal + data governed

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** Produk pembanding (Hermes, Grok Bot) sudah kuat pada kanal personal: WhatsApp, Telegram,
Discord, memory, scheduling. Meniru itu saja membuat Weebo tidak punya alasan untuk dipilih.

**Keputusan.** Weebo membawa kanal personal setara produk terkemuka **plus** akses ke data kerja yang
governed lewat Zetaris. Kanal personal dianggap harga tiket masuk, bukan pembeda.

**Konsekuensi.**

- Connector Zetaris masuk jalur kritis (P1), bukan fitur belakangan.
- Pemasaran menonjolkan satu diferensiasi ini, bukan empat sekaligus.
- Fitur kanal personal tetap dibangun secukupnya agar tidak kehilangan kredibilitas.

---

## ADR-004 — Free tier: katalog model + gateway kuota per IP

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** Ide awal meniru OpenCode: menyediakan kuota gratis harian untuk model tertentu,
dibatasi per IP. Menyediakan ini berarti project harus memegang API key sendiri dan menanggung
pemakaian. Riset menemukan NVIDIA NIM menyediakan endpoint gratis (kompatibel Chat Completions,
~40 RPM) untuk
prototipe, cocok sebagai sumber tunggal. Model gratis OpenCode Zen diikat ke fingerprint client resmi
mereka; meniru mekanisme itu berarti mengakali pembatasan pihak lain dan tidak akan dilakukan.

**Keputusan.** Dua komponen terpisah:

1. **Katalog model** — data statis di `packages/core/src/models/catalog.ts` (modul TypeScript, bukan
   file JSON terpisah, agar tipenya ikut `typecheck` dan bisa dipakai langsung oleh `core`), tanpa
   server. User melihat daftar model, tier, dan konteks.
2. **Gateway** — Cloudflare Worker yang memegang key NVIDIA NIM, membatasi N request per IP per hari,
   hanya meneruskan ke model gratis.

BYOK dan model lokal tetap tersedia sebagai jalur setara.

**Konsekuensi.**

- User pemula bisa langsung memakai Weebo tanpa menyiapkan key.
- Gateway adalah **stretch goal** setelah spine selesai; jika tidak sempat, masuk roadmap dengan
  alasan teknis tertulis.
- Gateway wajib berlabel jelas sebagai jalur demo, bukan janji layanan permanen.
- Tidak ada key berbayar di gateway.

---

## ADR-005 — Hak merge terpusat pada maintainer

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** Tim tiga orang, deadline enam hari. Perlu keseimbangan antara kecepatan dan kendali
kualitas.

**Keputusan.** `main` diproteksi. Semua perubahan lewat PR. Hanya `@MuhammadFaza-DU` yang merge.
`CODEOWNERS` menunjuk maintainer untuk semua path.

**Konsekuensi.**

- Kualitas dan konsistensi terjaga; tidak ada kode yang masuk tanpa ditinjau.
- Maintainer menjadi bottleneck; harus responsif atau kerja tertahan.
- Riwayat PR menjadi bukti kontribusi tim yang bisa dilihat juri.

---

## ADR-006 — Catatan belajar disimpan di luar repo

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** Tim ingin mempelajari produk pembanding secara mendalam (Hermes, Grok Bot, Composio,
OpenCode, Zetaris, Meterless) untuk mengambil pola terbaik. Sebagian open source (MIT/Apache-2.0),
sebagian closed source.

**Keputusan.** Catatan belajar disimpan **di luar repo**, di mesin lokal, diabaikan lewat
`.git/info/exclude`. Boleh memuat cuplikan referensi untuk pemahaman, ditandai `REFERENCE ONLY`.
Kode produk Weebo seluruhnya ditulis sendiri. Tidak ada penyalinan kode, aset, atau teks ke repo.

**Konsekuensi.**

- Klaim "original work" pada submission tetap sah dan bisa dipertahankan.
- Pengetahuan dari riset tetap bisa dipakai; hanya bahannya yang tidak dibawa.
- Tim tidak perlu menyebut metodologi riset di submission, dan tidak ada yang perlu disembunyikan.

---

## ADR-007 — Fase berbasis deliverable, tanpa timebox

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** Timebox per fase terbukti membuat rencana kaku dan mendorong pelanggaran jadwal saat
satu fase melebar.

**Keputusan.** Fase didefinisikan oleh **deliverable dan syarat lulus**, bukan durasi. Fase dipecah
menjadi task kecil (≤ 2 jam) yang dicatat di `docs/phases/`. Fase ditutup hanya setelah enam syarat
protokol keluar fase terpenuhi.

**Konsekuensi.**

- Fase tidak bisa "selesai karena waktu habis".
- Task menjadi unit eksekusi agent, sehingga progres terlihat granular.
- Butuh disiplin memindahkan task yang tidak selesai ke backlog, bukan menghapusnya.

---

## ADR-008 — Urutan kerja risk-first

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** Risiko terbesar bukan UI yang belum jadi, melainkan integrasi wajib (Zetaris, Meterless)
yang gagal di hari terakhir sehingga submission tidak memenuhi syarat.

**Keputusan.** Urutan fase menempatkan pembuktian integrasi sponsor di depan (P1 walking skeleton),
bukan di belakang.

**Konsekuensi.**

- Kegagalan integrasi terdeteksi saat masih ada waktu untuk pivot.
- UI dibangun setelah pipa terbukti, sehingga desain tidak mengunci asumsi yang salah.
- Demo 30 detik bisa dihasilkan sejak fase pertama.

---

## ADR-009 — Landing page adalah deliverable produk, bukan tempelan

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** Project ini bukan proyek sekali pakai. Landing page dibutuhkan sebagai wajah produk untuk
keberlanjutan, dan menulisnya memaksa kejelasan posisi sebelum koding.

**Keputusan.** Landing page dibangun dengan Astro di `apps/landing`, punya fase sendiri (P7), dan
boleh berjalan paralel dengan fase UI. Hosting awal di subdomain gratis; domain sendiri menyusul saat
ada anggaran. Setiap kemampuan diberi badge `live` atau `roadmap`.

**Konsekuensi.**

- Narasi produk terkunci lebih awal.
- Perlu audit klaim di akhir agar badge sesuai kenyataan.
- Live demo URL (PWA ter-deploy) adalah item backlog **prioritas 1**, dependensi **P5 selesai**.
  Bukan "opsional jika ada sisa waktu" — aturan penundaan: `AGENTS.md` §8.1.

---

## ADR-010 — Target native: Electron, dimulai setelah dependensi terpenuhi


**Tanggal:** 2026-10-18
**Status:** Diterima (merevisi versi awal ADR ini)

**Konteks.** Harness agent modern yang diperiksa semuanya native atau Electron-based: Hermes memakai
Electron (`apps/desktop/electron/`), Cursor memakai Electron, Grok Bot memakai aplikasi desktop native,
Meterless mendistribusikan installer desktop. Alasannya struktural: agent butuh akses filesystem,
spawn proses, eksekusi di background, keychain OS, dan auto-start — semuanya di luar jangkauan PWA.
Awalnya Tauri dipertimbangkan, tetapi Tauri menuntut Rust + MSVC Build Tools yang tidak tersedia di
mesin tim, sementara Electron hanya menuntut Node.

**Keputusan.**

- Jalur kirim utama: **PWA** (installable, responsif di HP dan desktop). Video demo menampilkan PWA.
- Target desktop: **Electron**, bukan Tauri.
- Target mobile native: **Capacitor**.
- Tauri menjadi opsi yang dipertimbangkan hanya jika ukuran aplikasi menjadi masalah nyata.
- `apps/runtime` dirancang sejak sekarang agar dapat berjalan sebagai proses Node mandiri **dan** di
  dalam main process Electron.
- **Kapan Electron/Capacitor dimulai:** berbasis dependensi, bukan tanggal. Dependensi keduanya adalah
  **P5 selesai** (client PWA ada) dan, untuk Electron, **P2 selesai** (protokol runtime–client ada).
  Syarat mulai lengkap ada di `AGENTS.md` §8.1.

**Konsekuensi.**

- Tidak ada instalasi Rust/MSVC yang memblokir pekerjaan awal.
- Menambah Electron adalah penambahan *shell* di atas UI yang sama, bukan penulisan ulang.
- Ukuran aplikasi desktop akan lebih besar (Electron ±120–250 MB vs Tauri 5–15 MB). Diterima sebagai
  pertukaran atas hilangnya risiko toolchain.
- Adapter boundary harus ditegakkan sejak kode pertama; kalau dilanggar, Electron menjadi pekerjaan
  ulang.
- Klaim "tersedia di desktop dan Android" sampai migrasi selesai harus disampaikan sebagai PWA
  installable, bukan installer native.
- Electron dan Capacitor **boleh dimulai lebih awal** jika dependensinya terpenuhi dan tiga syarat di
  `AGENTS.md` §8.1 terpenuhi. Jangan menunggu tanggal apa pun.

---

## ADR-011 — Runtime sebagai server lokal; CLI dan PWA adalah client

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** PWA punya keterbatasan struktural untuk sebuah agent harness: tidak bisa menjalankan tugas
di latar saat tab ditutup, tidak punya akses filesystem luas, dan tidak punya keychain OS. Keterbatasan
ini nyata dan menjadi keberatan utama terhadap PWA sebagai satu-satunya bentuk aplikasi. Sementara itu,
proyek pembanding memakai pola yang konsisten: Hermes menjalankan `hermes serve` yang mengekspos
`tui_gateway` (JSON-RPC/WebSocket), lalu desktop Electron, browser dashboard, dan CLI semuanya menjadi
client ke runtime yang sama.

**Keputusan.**

1. `apps/runtime` adalah **server lokal**: satu-satunya proses yang menyentuh kapabilitas platform
   (filesystem, proses, scheduler, secret, MCP stdio).
2. Semua surface adalah **client** yang berkomunikasi lewat `packages/protocol` (JSON-RPC + WebSocket
   di localhost): `apps/cli`, `apps/web`, dan `apps/desktop` (Electron, nanti).
3. **CLI adalah surface resmi**, diposisikan untuk developer dan scripting:
   `npx weebo` untuk chat, `npx weebo serve` untuk menjalankan runtime.
4. PWA memakai **satu mode**: selalu terhubung ke runtime. Tidak ada mode standalone.
5. Runtime harus bisa berjalan **headless** tanpa client mana pun, karena scheduler tetap bekerja.

**Konsekuensi.**

- Kelemahan PWA sebagian besar hilang tanpa menunggu Electron: scheduler, filesystem, dan secret
  ditangani runtime.
- Electron nanti menjadi client tambahan, bukan penulisan ulang.
- `packages/core` tidak dipanggil langsung oleh client mana pun; menambah surface baru tidak menyentuh
  core.
- Perlu kontrak protokol yang berversi sejak awal (`packages/protocol`).
- Menambah satu app (`apps/cli`) dan satu package (`packages/protocol`) di monorepo.
- Demo lomba harus menjalankan runtime lebih dulu. Ini dicatat di README dan naskah video.
- CLI berisiko menggeser positioning "ramah pemula" bila dijadikan wajah utama; karena itu CLI
  diposisikan untuk developer, sementara PWA tetap wajah produk.

---

## ADR-012 — Meterless: vendor engine resmi + adapter embedding sendiri

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** Meterless H-MEM adalah syarat wajib lomba dan menjadi tulang punggung memori Weebo.
Dua pendekatan dipertimbangkan: (a) memakai engine resmi sebagai dependensi, (b) menulis ulang
implementasinya dari spesifikasi. Pengukuran langsung terhadap repo Meterless memberi data:

- Engine referensi `engines/hmem/reference/src/` berukuran **≈42,6 KB** (~1.200–1.500 baris TypeScript)
  dalam 10 file.
- `package.json` menyatakan **zero runtime dependencies** (hanya `tsx` dan `vitest` sebagai devDeps).
- README mereka menyatakan sendiri: *"What it is NOT: a production library. The embedder is a
  deterministic hash mock, storage is a JSON file, and there is no network code. Your implementation
  replaces every piece of this with your stack; the contracts stay the same."*
- `embeddings.ts` memakai FNV-1a hash ke vektor 64 dimensi — **tidak punya makna semantik**.
- Conformance suite (`conformance/runner.ts` + `vectors/`) memeriksa kontrak secara ketat dan
  **sudah lulus terhadap engine referensi**.

**Keputusan.**

1. **Vendor engine resmi** Meterless (Apache-2.0) ke `vendor/`, dengan `LICENSE` dan atribusi
   dipertahankan. Ini dependensi, bukan penyalinan yang diklaim sebagai karya sendiri.
2. **Tulis adapter embedding sendiri** di `packages/meterless/src`, menggantikan mock FNV-1a dengan
   embedding nyata. Ini memang penggunaan yang dimaksudkan oleh penulis spesifikasi.
3. **Tulis `MemoryPort`** sebagai interface di `packages/core`, sehingga implementasi engine dapat
   ditukar tanpa menyentuh core.
4. Demo memakai **4 service inti**: Store, Mining, Retrieval, TrustLedger. Dreaming, SleepCycle, dan
   ConflictDetection tetap tersedia di kode tetapi tidak didemokan.
5. Menulis ulang engine dari spesifikasi (opsi "implementasi sendiri") **tidak dikerjakan sekarang**.
   Ia menjadi item backlog **prioritas 5**, dengan dependensi **P3 selesai + `MemoryPort` stabil**.
   `MemoryPort` adalah titik tukarnya. Aturan penundaan: `AGENTS.md` §8.1.

**Konsekuensi.**

- Waktu P3 turun dari ±1,5–2 hari menjadi ±3–5 jam, sehingga P4–P6 mendapat waktu.
- Conformance suite dapat dijalankan sebagai bukti objektif untuk penilaian sponsor tech.
- Kualitas retrieval menjadi nyata, bukan palsu — penting karena `semantic` adalah komponen terbesar
  (0,35) dalam formula ranking H-MEM.
- Klaim "original work" tetap sah: engine adalah dependensi Apache-2.0, seluruh kode harness,
  connector, runtime, adapter, dan UI ditulis sendiri.
- Tim **tidak** memiliki memory system sendiri pada saat submission. Ini dicatat jujur di README dan
  submission, dan menjadi item backlog berprioritas 5 (bergantung pada P3 + `MemoryPort` stabil).
- `MemoryPort` wajib ditegakkan sejak awal; kalau core memanggil engine langsung, penukaran nanti
  menjadi penulisan ulang.

**Catatan keputusan terkait:** embedding memakai NVIDIA Nemotron-3-Embed-1B (`nemotron-3-embed-1b`),
vektor 2048 dimensi, konteks 32.768 token, mendukung bahasa Indonesia. Dapat dipotong ke 1024/512
dimensi untuk menghemat penyimpanan, dengan normalisasi L2 ulang.

---

## ADR-013 — Pengecualian sementara: CLI boleh memanggil core langsung di P1

**Tanggal:** 2026-10-18
**Status:** Diterima, berlaku hanya untuk P1

**Konteks.** ADR-011 menetapkan semua surface adalah client yang bicara lewat `packages/protocol`.
Namun P1 bertujuan membuktikan pipeline (intent → memory → model → Zetaris → jawaban) dalam waktu
sesingkat mungkin. Membangun protokol berversi + server WebSocket lebih dulu menambah satu lapisan
yang bisa gagal sebelum pipeline terbukti.

**Keputusan.** Pada **P1 saja**, `apps/cli` boleh memanggil `packages/core` langsung di proses yang
sama. Pemisahan client–server lewat `packages/protocol` menjadi **syarat keluar P2**, dan pengecualian
ini berakhir di sana.

**Konsekuensi.**

- P1 lebih cepat dan risikonya lebih kecil.
- Ada satu titik di mana arsitektur menyimpang dari ADR-011. Penyimpangan ini dicatat, bukan
  disembunyikan.
- P2 **wajib** menutup penyimpangan itu, dan syarat lulus P2 sudah mencantumkannya
  (`AGENTS.md` §8, `docs/PHASES.md`). Jika tidak, ADR-011 kehilangan makna dan Electron nanti
  menjadi penulisan ulang.
- Pengecualian ini tidak boleh diperluas ke `apps/web`.

---
