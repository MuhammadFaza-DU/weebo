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
- Gateway adalah item backlog **prioritas 3**, dependensi **P1–P5 lulus**. Jika tidak dikerjakan, alasan
  teknisnya ditulis di `docs/DECISIONS.md`, bukan dibiarkan implisit.
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
boleh berjalan paralel dengan fase UI. Hosting awal di subdomain gratis. Domain sendiri masuk backlog
**prioritas 11**, dependensi **P8 selesai** (karena butuh anggaran, bukan karena tanggal).
Setiap kemampuan diberi badge `live` atau `roadmap`.

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
implementasinya dari spesifikasi. Pengukuran terhadap repo Meterless (`github.com/Meterless/Meterless`,
branch `main`, diakses 2026-10-18) memberi data:

- Engine referensi `engines/hmem/reference/src/` berukuran **≈42,6 KB** (~1.200–1.500 baris TypeScript)
  dalam 10 file.
- `engines/hmem/reference/package.json` menyatakan **zero runtime dependencies** (hanya `tsx` dan
  `vitest` sebagai devDeps).
- `engines/hmem/reference/README.md` menyatakan sendiri: *"What it is NOT: a production library. The
  embedder is a deterministic hash mock, storage is a JSON file, and there is no network code. Your
  implementation replaces every piece of this with your stack; the contracts stay the same."*
  (Sitasi: file `README.md` di dalam folder `reference/`, bukan README utama repo.)
- `embeddings.ts` memakai FNV-1a hash ke vektor 64 dimensi — **tidak punya makna semantik**.
- Conformance suite berada di `engines/hmem/conformance/` (**saudara** `reference/`, bukan di dalamnya)
  dan memeriksa kontrak secara ketat.

> Catatan reproduksibilitas: angka di atas diukur pada commit `main` tanggal 2026-10-18 tanpa SHA
> yang dipin. Saat vendoring di P0, **catat SHA commit Meterless** yang dipakai di `PREEXISTING.md`
> agar angka ini bisa direproduksi.

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

---

## ADR-014 — Cursor dipakai untuk review; hadiah Cursor tidak dikejar

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** Aturan lomba mewajibkan tim memakai Cursor selama pengembangan dan menjelaskan
pemakaiannya di submission. Di sisi lain, tim memakai agent harness masing-masing untuk menulis kode,
dan tidak ada anggota tim yang membangun di dalam Cursor. Lomba juga menawarkan hadiah in-kind
"Best use of Cursor-built product" senilai $2.301.

**Keputusan.**

1. Cursor dipakai sebagai **permukaan review** — membaca, menelusuri, dan memeriksa perubahan. Bukan
   untuk menulis kode. Aturan lengkap: `AGENTS.md` §20.
2. Pemakaiannya dicatat per fase di `docs/CURSOR-LOG.md`, termasuk jika tidak ada review pada fase itu.
3. Submission menjelaskan pemakaian Cursor **apa adanya**, termasuk bagian *"what needs work"*.
4. Hadiah **"Best use of Cursor-built product" tidak dikejar**. Alasannya: hadiah itu mensyaratkan
   produk dibangun dengan Cursor, dan tim tidak membangun dengan Cursor. Mengejarnya berarti membuat
   klaim yang tidak benar.

**Konsekuensi.**

- Memenuhi syarat lomba tanpa kebohongan.
- Hadiah $2.301 dilewati secara sadar, bukan karena terlewat.
- Bagian Product Feedback tetap bisa diisi dengan pengalaman nyata (kuota Free, batasan plan), dan itu
  punya nilai tersendiri di penilaian.
- Jika di masa depan tim benar-benar membangun dengan Cursor, ADR ini perlu diganti.

---

## ADR-015 — Protokol evaluasi, dataset demo, dan penilaian K1/K2

**Tanggal:** 2026-10-20
**Status:** Diterima — menutup P0 T0.8. **§1 (dataset) dan §2 (kategori golden set) DIGANTIKAN oleh
ADR-019** setelah produk digeser ke bentuk keputusan (ADR-018). Sisa isinya tetap berlaku.

**Konteks.** `docs/PRD.md` §3.2 menetapkan kerangka evaluasi (dataset, golden set, rubrik, runner,
batas), tetapi masih menyisakan pilihan konkret yang harus diputuskan sebelum task T1.8 bisa
dikerjakan: tabel dan kolom apa, siapa menulis jawaban harapan, siapa menilai K1/K2, field apa yang
wajib ada di file hasil, dan bentuk run baseline. Tanpa keputusan ini, T1.8 akan dikerjakan sambil
menebak — dan tebakan di bagian evaluasi berarti angka yang tidak bisa dipercaya.

**Keputusan.**

1. **Dataset demo** — sintetis, domain **merchant payments**, 3 tabel, total **~200 baris**, disimpan
   di `eval/dataset/`. Skema:

   | Tabel | Baris | Kolom |
   |---|---|---|
   | `merchants` | 40 | `merchant_key`, `trading_name`, `mcc`, `channel` (ECOM/POS/MOTO), `risk_tier`, `status`, `group_key`, `onboarded_date` |
   | `transactions` | 120 | `txn_id`, `merchant_key`, `occurred_at`, `amount`, `currency`, `status` (settled/failed/refunded), `payment_method`, `channel` |
   | `settlement_breaks` | 40 | `break_id`, `merchant_key`, `reporting_month`, `break_type` (missing/late/duplicate), `amount`, `resolved` |

   Seluruh nilai fiktif. Tidak ada data nyata milik siapa pun di repo.

2. **Golden set** — 30 entri, komposisi mengikuti `docs/PRD.md` §3.2 (5 lookup, 5 lintas tabel,
   5 agregasi, 3 rentang waktu, 2 butuh memori, 10 tidak bisa dijawab), satu berkas per kategori di
   `eval/golden/`.

3. **Pembagian penulisan** — tiga anggota masing-masing menulis **10 entri** beserta jawaban harapan
   dan sumber harapan. Penulis sebuah entri **tidak boleh** menilai entri itu.

4. **Penilaian K1/K2** — setiap entri dinilai **dua orang yang bukan penulisnya**, independen, tanpa
   melihat penilaian orang lain. Selisih pendapat **dicatat apa adanya**, tidak dirata-ratakan dan
   tidak dipaksa menjadi sepakat. Konsekuensi: setiap orang membaca 20 dari 30 jawaban, dan klaim
   "dinilai dua orang secara independen" di `docs/PRD.md` §3.2 tetap benar tanpa perlu diubah.

5. **Field wajib file hasil** — `eval/results/<YYYY-MM-DD>-<fase>.json`:

   ```text
   run_id, tanggal_utc, fase, mode ("baseline" | "penuh"),
   model { id, versi }, temperature (0), golden_set_version,
   entries[] { id, kategori, butuh_memori, jawaban_agent, sumber_dikutip[],
               verdict_k1, verdict_k2, penilai[] },
   ringkasan { k1_pct, k2_violations, k3_pct, k4_pct, k5_pct },
   catatan
   ```

   K3, K4, K5 dihitung otomatis oleh runner. K1 dan K2 diisi manusia.

6. **Asal angka target** — K1 ≥90% dan K5 ≥80% dipilih **tanpa dasar empiris** dan berstatus
   `provisional`. K2 = 0 bukan target yang boleh dikalibrasi turun; ia syarat kejujuran.

7. **Kalibrasi target** — ditinjau di keluar P3 setelah run 30 penuh pertama. Boleh naik maupun turun.
   Setiap perubahan wajib tercatat di `eval/CHANGELOG.md` dengan angka lama, angka baru, alasan,
   tanggal, dan penyetuju.

8. **Baseline** — mode `baseline` = model + Zetaris **tanpa memori** (tanpa recall, tanpa store).
   Dijalankan pertama kali di P3, berdampingan dengan mode `penuh`, pada golden set dan model yang
   sama. Yang dibandingkan: K1, K2, K5.

9. **Larangan penyebutan** — hasil ini tidak boleh disebut *benchmark*. N=30 dan dataset sintetis
   tidak mendukung klaim generalisasi.

**Konsekuensi.**

- T1.8 dapat dikerjakan tanpa menebak bentuk dataset maupun rubrik.
- Setiap anggota membaca 20 jawaban pada run final, bukan 30 — hemat waktu di P8 tanpa mengurangi
  independensi penilaian.
- Golden set wajib dibekukan sebelum P3; setelah itu perubahan hanya lewat `eval/CHANGELOG.md`.
- Dataset domain merchant payments dipilih karena mendukung keempat kategori yang bisa dijawab
  (lookup, join, agregasi, rentang waktu) tanpa menyerupai data nyata siapa pun.

---

## ADR-016 — Perangkat mencapai runtime lewat LAN bind + pairing token

**Tanggal:** 2026-10-20
**Status:** Diterima — menutup P0 T0.7

**Konteks.** Runtime mendengarkan di `localhost`, dan `localhost` di ponsel menunjuk ke ponsel itu
sendiri. Tanpa keputusan ini, syarat lulus P5 ("jalan di layar HP") tidak bisa dipenuhi dan demo video
kehilangan bagian penutupnya. Empat opsi dipertimbangkan (`docs/ARCHITECTURE.md` §2.2): bind ke LAN,
tunnel, pairing + token, dan Electron-only.

**Keputusan.**

1. **Bind ke LAN** sebagai jalur utama. Runtime mendengarkan di `0.0.0.0` **hanya ketika mode LAN
   diaktifkan eksplisit oleh user**; default tetap `127.0.0.1`.
2. **Autentikasi wajib.** Runtime menerbitkan **pairing token sekali pakai** berumur pendek,
   ditampilkan di terminal saat start. Client menukarnya menjadi session token. Tanpa token, tidak ada
   permintaan yang dilayani. Runtime **tidak diizinkan** mendengarkan di jaringan tanpa auth.
3. **PWA menyimpan endpoint dan session token** di storage lokal, bukan di URL.
4. **Tunnel bukan jalur utama.** Hanya dipakai sebagai *workaround* demo jika LAN gagal, dan
   workaround itu dicatat di `docs/SPONSORS.md`.

**Batasan yang dinyatakan — ini mengubah cara demo, bukan sekadar detail teknis.**

HTTP polos di alamat LAN **bukan secure context**. Akibatnya:

- service worker tidak mendaftar, sehingga PWA **tidak installable** di `http://<ip-laptop>:<port>`;
- yang bisa didemokan lewat LAN adalah PWA **berjalan di browser ponsel**, bukan PWA ter-install.

Untuk memenuhi AC US-12 dalam bentuk "installable", dibutuhkan secure context: tunnel HTTPS
(`cloudflared`) atau localhost-forwarding. Karena itu tunnel tetap disiapkan sebagai jalur demo
installability, walaupun jalur konektivitas utamanya LAN.

Jaringan harus sama. Tanpa internet, LAN tetap bekerja; installability tidak.

**Konsekuensi.**

- `apps/runtime` wajib punya konfigurasi bind + auth sejak **P2** (saat protokol dibangun), bukan
  ditambal di P5.
- ADR-011 tetap berlaku: tidak ada mode standalone. Ponsel tetap client yang butuh runtime hidup.
- Klaim "installable di ponsel" hanya boleh ditulis di README dan submission **setelah** diuji lewat
  secure context. Sebelum itu, yang benar: "berjalan di browser ponsel".
- Risiko Demo (15 poin) tercatat: kalau tunnel tidak siap, demo ponsel turun menjadi browser-only.

---

## ADR-017 — Loop penalaran berbatas dan tangga pengetahuan L0–L4

**Tanggal:** 2026-10-20
**Status:** Diterima — design: `docs/superpowers/specs/2026-10-20-reasoning-loop-design.md`

**Konteks.** `docs/ARCHITECTURE.md` §3 mendefinisikan satu permintaan sebagai urutan linear 9 langkah.
Welcome Guide HackOS §3 menyebut bentuk itu **desain lemah** secara eksplisit: *"This is a pipeline, not
an agent system"*, *"There are no feedback loops"*, *"Nothing shows how the system reached its output"*.
Yang diminta sebagai gantinya: loop `Planner ↔ Executor ↔ Evaluator`, retry, branching, dan trace yang
bisa diperiksa. Penilaian yang terdampak: Technical (20), Innovation (15), Demo (15), dan kecocokan
dengan Track 03.

**Keputusan.**

1. **Loop berbatas menggantikan alur linear.** `Plan → Execute → Evaluate` berulang, maksimum **3
   iterasi** per pertanyaan. Satu iterasi boleh memuat maksimum **5 panggilan tool**.
2. **Evaluator mengembalikan `Verdict` tertutup**, bukan teks bebas: `no_evidence_needed`,
   `sufficient`, `needs_access`, `found_elsewhere`, `exhausted`, `budget_exhausted`, `retry`. Hanya
   `retry` yang memutar loop.
3. **Tangga pengetahuan L0–L4** menentukan bentuk jawaban: L0 (tidak menyentuh data), L1 (data cukup,
   wajib sitasi), L2 (ada tapi butuh akses), L3 (tidak ada di sini, ada petunjuk tempat lain), L4
   (mentok — abstain atau analisis berlabel).
4. **`budget_exhausted` selalu memetakan ke L4(a)**, tidak pernah L4(b). Tekanan anggaran tidak boleh
   memproduksi tebakan berlabel.
5. **Sesi = satu percakapan**, ditegakkan di runtime. Anggaran sesi habis → berhenti jujur, bukan
   menurunkan kualitas diam-diam.
6. **Klarifikasi mengakhiri giliran** (`awaiting_clarification`). Runtime headless dan runner eval
   **dilarang** bertanya; keduanya memetakan kerancuan ke L4(a).
7. **Dilarang berasumsi. Rancu wajib bertanya.** Rancu = dua tafsir menghasilkan hasil berbeda dan
   salah pilih berarti jawaban salah. Bukan-rancu = pilihan bisa dibalik tanpa biaya → pilih sendiri.
8. **L4(b) lulus K2 tanpa mengubah rubrik**, dengan tiga syarat struktural: memuat pernyataan data
   tidak tersedia, angka berlabel estimasi, dan field sitasi kosong. Ketiganya ditegakkan di tipe.
9. **Hasil eval wajib memuat `level_breakdown`** (jumlah jawaban per tingkat), terpisah dari skor K2.
10. **Single loop adalah default**; `ExecutionStrategy` disiapkan sebagai seam di P2, tetapi strategi
    `"fanout"` masuk backlog dengan dependensi P2 selesai + single loop terbukti di eval.
11. **P1 hanya membangun L0, L1, L4(a)** — tanpa loop. Alasannya: K2 diukur di P1, dan tanpa pemisahan
    L1/L4(a) K2 tidak bisa diukur sama sekali.

**Konsekuensi.**

- `docs/ARCHITECTURE.md` §3 diganti; bentuk 9 langkah linear tidak lagi berlaku.
- Biaya per pertanyaan menjadi terukur dan berbatas — prasyarat untuk mematuhi rate limit NIM (ADR-004).
- Trace menjadi deliverable, bukan efek samping: K3 diperiksa otomatis dari field trace.
- P2 bertambah satu deliverable (Evaluator + Verdict + trace terstruktur) di atas rencana semula.
- Angka 3 iterasi dan 5 tool/iterasi **belum diukur**; keduanya dapat dikalibrasi tanpa mengubah bentuk
  loop, dengan alasan tertulis.
- Fan-out tidak dikerjakan sekarang; jika dikerjakan, ia menambah 1–2 hari dan berisiko 429 saat demo.

---

## ADR-018 — Produk menghasilkan KEPUTUSAN, bukan jawaban; policy menentukan, memory membandingkan

**Tanggal:** 2026-10-20
**Status:** Diterima — **merevisi sebagian ADR-015** (dataset dan kategori golden set)

**Konteks.** `docs/PRD.md` v2 dirancang sebagai agent yang **menjawab pertanyaan dengan sitasi**. Setelah
membaca panduan resmi `How to APPROACH Solutioning` §6, ternyata bentuk itu adalah **contoh Track 02**
(*"producing a cited recommendation that shows the evidence behind each conclusion"*), bukan Track 03.

Track 03 menuntut tiga hal yang tidak kita punya:

| Yang diminta Track 03 | Keadaan sebelum ADR ini |
|---|---|
| Data: *"operational records, **rules or policies**, and the state or **memory of prior decisions**"* | Hanya operational records; tanpa policy, tanpa riwayat keputusan |
| Output: *"reliable **decisions and actions**"* (contoh resmi: *"prioritised booking list with the reasoning for each decision"*) | Jawaban + sitasi |
| Bentuk: *"Define the **decision and the action first**, then the data, knowledge, and memory"* | Dimulai dari pertanyaan, bukan dari keputusan |

Impact bernilai **30 poin** dengan kriteria *"Consistency with the challenge statements"*. Membiarkan
bentuk lama berarti mempertaruhkan kriteria terbesar pada ketidakcocokan track.

**Keputusan.**

1. **Output produk adalah keputusan, bukan jawaban.** Satu jenis keputusan: **"merchant mana yang harus
   masuk review compliance periode ini, dan apa tindakannya"**. Ini menyempitkan produk, dan penyempitan
   itu disengaja — panduan resmi §8 mencontohkannya: *"Memory of everything, forever → One decision type,
   with memory of prior decisions."*

2. **Policy adalah penentu keputusan, dan bersifat deterministik.** Tidak ada asumsi di jalur penentuan.
   Policy dinyatakan sebagai aturan eksplisit dengan ambang angka (lihat ADR-019).

3. **Memory wajib dibandingkan dan wajib ditampilkan — tetapi tidak boleh membatalkan policy.**
   Alasannya, dan ini alasan user secara eksplisit: *"kalo memory, agent/AI itu sering membuat asumsi."*
   Memory yang membatalkan policy berarti agent menyimpulkan *"kali ini kasusnya sama seperti dulu"* —
   itu asumsi, dan asumsi dilarang.

4. **Konflik policy vs memory tidak diselesaikan agent.** Bila policy masih terpicu sementara memory
   memuat keputusan lalu yang menyatakan merchant itu sudah aman, agent **menandai konflik**, menaikkan
   prioritas, dan **meminta konfirmasi manusia**. Agent tidak memilih salah satu. Ini penerapan aturan
   *"dilarang asumsi, kalau rancu wajib bertanya"* (ADR-017 §8).

5. **Memory dipakai untuk tiga hal, semuanya tanpa asumsi:**
   - **Mencegah pengulangan buta** — menandai merchant yang sudah di-review pada periode yang sama;
   - **Mendeteksi bahwa review sebelumnya gagal** — policy masih terpicu setelah di-review berarti
     masalahnya belum selesai, dan itu justru alasan **eskalasi**;
   - **Menyediakan preseden** — ditampilkan ke manusia, bukan dipakai agent untuk membatalkan policy.

6. **Setiap keputusan wajib bisa ditelusuri ke tiga sumber:** policy mana yang terpicu, data mana yang
   mendukung, dan memori mana yang relevan. Keputusan tanpa ketiganya ditolak sebelum keluar.

7. **Dataset direvisi** (menggantikan daftar tabel di ADR-015 §1): `merchants`, `transactions`,
   `settlement_breaks` **tetap**, ditambah `policies` dan `decisions`. Rincian di ADR-019.

8. **Kategori golden set direvisi** (menggantikan ADR-015 §2): dari berbasis pertanyaan menjadi berbasis
   keputusan. Rincian di ADR-019.

**Konsekuensi.**

- **Meterless menjadi load-bearing, bukan hiasan.** Tanpa memory, agent akan mengulang review yang sudah
  dilakukan dan tidak bisa mendeteksi review yang gagal. Ini membuat Sponsor Tech (10 poin) nyata.
- **Evaluator menjadi bermakna.** Ia menilai *"apakah keputusan ini didukung policy + data + memori"*,
  bukan sekadar *"apakah jawaban ini cukup"*. Verdict ADR-017 tetap dipakai, dengan `sufficient` berarti
  "keputusan lengkap dengan tiga sumber".
- **K1 berubah makna.** Akurasi sitasi kini berarti: policy yang dikutip benar-benar ada dan benar-benar
  terpicu oleh data yang dikutip. Bukan sekadar "sumber ada".
- **K2 tetap 0.** Policy deterministik justru membuat abstention lebih mudah dipertahankan: kalau data
  tidak cukup untuk mengevaluasi policy, agent tidak boleh menyimpulkan apa pun.
- **User primer tidak berubah** (`docs/PRD.md` §2.1), tetapi permintaannya berubah dari "jawab pertanyaan
  ini" menjadi "putuskan ini".
- **Risiko baru:** policy yang terlalu sederhana membuat keputusan terasa mekanis. Mitigasi: konflik
  policy-vs-memory dan kasus data-kurang sengaja dimasukkan ke golden set.

---

## ADR-019 — Skema dataset keputusan dan golden set berbasis keputusan

**Tanggal:** 2026-10-20
**Status:** Diterima — **menggantikan ADR-015 §1 dan §2**

**Konteks.** ADR-018 mengubah output produk dari jawaban menjadi keputusan. Dataset dan golden set di
ADR-015 dirancang untuk pertanyaan lookup/agregasi, sehingga tidak bisa menguji keputusan.

**Keputusan.**

### 1. Dataset — 5 tabel, total ~240 baris, sintetis

| Tabel | Baris | Kolom | Peran |
|---|---|---|---|
| `merchants` | 40 | `merchant_key`, `trading_name`, `mcc`, `channel`, `risk_tier`, `status`, `group_key`, `onboarded_date` | Data operasional |
| `transactions` | 120 | `txn_id`, `merchant_key`, `occurred_at`, `amount`, `currency`, `status`, `payment_method`, `channel` | Data operasional |
| `settlement_breaks` | 40 | `break_id`, `merchant_key`, `reporting_month`, `break_type`, `amount`, `resolved` | Data operasional |
| **`policies`** | **10** | `policy_id`, `nama`, `kondisi`, `ambang`, `periode_evaluasi`, `aksi`, `prioritas`, `berlaku_sejak` | **Aturan penentu** |
| **`decisions`** | **30** | `decision_id`, `merchant_key`, `tanggal`, `periode`, `policy_dipakai[]`, `keputusan`, `alasan`, `oleh` | **Memori keputusan lalu** |

Contoh isi `policies`:

```text
CB-001  chargeback_ratio > 1.5% dalam 1 bulan             -> PANTAU        prioritas 3
CB-002  chargeback_ratio > 2.0% selama 2 bulan berturut  -> REVIEW        prioritas 1
SB-001  settlement break unresolved > 30 hari            -> ESKALASI      prioritas 1
SB-002  settlement break unresolved 3 bulan berturut     -> ESKALASI      prioritas 1
KYB-001 merchant tanpa dokumen KYB lengkap               -> REVIEW        prioritas 2
VOL-001 volume turun > 60% dibanding rata-rata 3 bulan   -> PANTAU        prioritas 4
...
```

Contoh isi `decisions`:

```text
D-014  M-023  2026-09-12  periode 2026-08  policy [CB-002]
       keputusan REVIEW_SELESAI  alasan "lonjakan dari satu insiden fraud terisolasi, sudah ditangani"
       oleh analyst:1
```

### 2. Tingkat keputusan

Setiap merchant dievaluasi menghasilkan tepat satu:

| Tingkat | Arti |
|---|---|
| **ESKALASI** | Policy prioritas 1 terpicu, atau policy masih terpicu setelah pernah di-review |
| **REVIEW** | Policy prioritas 1–2 terpicu, belum pernah di-review pada periode ini |
| **PANTAU** | Policy prioritas 3–4 terpicu saja |
| **LEWATI** | Tidak ada policy terpicu |
| **KONFLIK** | Policy terpicu, tetapi memory memuat keputusan lalu yang menyatakan aman → **minta konfirmasi manusia**, agent tidak memutuskan |
| **DATA_KURANG** | Data tidak cukup untuk mengevaluasi policy → agent tidak menyimpulkan apa pun |

`KONFLIK` dan `DATA_KURANG` bukan kegagalan — keduanya adalah hasil yang sah, dan keduanya mencegah
fabrikasi.

### 3. Golden set — 30 entri berbasis keputusan

| Kategori | Jumlah | Isi |
|---|---|---|
| Keputusan satu policy | 5 | Satu policy terpicu, hasil jelas |
| Keputusan multi-policy | 5 | Dua policy atau lebih terpicu; prioritas menentukan tingkat akhir |
| Keputusan butuh memory | 4 | Hasil benar hanya jika riwayat keputusan diperhitungkan |
| Kasus konflik (policy vs memory) | 3 | Harus menghasilkan `KONFLIK`, **bukan** keputusan sendiri |
| Kasus harus dilewati (false positive) | 3 | Terlihat mencurigakan tetapi tidak ada policy yang terpicu → `LEWATI` |
| **Data kurang** | **0** | *dipindah ke kategori di bawah* |
| **Tidak bisa diputuskan** | **10** | Data tidak ada / tabel tidak ada / periode kosong → `DATA_KURANG`, tanpa angka, tanpa sitasi |

Total: 5+5+4+3+3+10 = **30**.

**Kenapa 10 entri "tidak bisa diputuskan" tetap 10.** Ini yang menopang K2. Tanpa kasus yang memang
tidak punya jawaban, "fabrikasi = 0" tidak bisa dibuktikan — hanya diasumsikan.

### 4. Yang tidak berubah dari ADR-015

Field wajib file hasil, aturan kalibrasi target, bentuk run baseline, pembagian penulisan (3 orang ×
10 entri), penilaian dua non-penulis per entri, dan larangan menyebut hasil ini *benchmark* — semuanya
tetap berlaku. Ditambah satu field dari ADR-017: `level_breakdown`.

**Konsekuensi.**

- Dataset bertambah dari ~200 menjadi ~240 baris; tetap kecil dan bisa diperiksa tangan.
- `policies` sengaja hanya 10 baris supaya setiap aturan bisa dibaca manusia dan diverifikasi di demo.
- Golden set wajib dibekukan sebelum P3 (tidak berubah dari ADR-015).
- Enam tingkat keputusan harus muncul di `level_breakdown`, sehingga pembaca bisa melihat berapa banyak
  keputusan yang benar-benar diambil vs yang dieskalasi ke manusia.
