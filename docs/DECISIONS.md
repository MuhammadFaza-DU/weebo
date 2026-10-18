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
PWA. Native (Tauri/Capacitor) ditunda sampai setelah lomba.

**Konsekuensi.**

- Nol setup Rust di tiga mesin, risiko build gagal turun drastis.
- Engine Meterless bisa dipakai langsung sebagai dependency, bukan di-porting.
- PWA bisa di-install di Android dan desktop tanpa store.
- Butuh disiplin menjaga `packages/core` bebas API Node-only.

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
- Memory (Meterless H-MEM) dan reasoning compression (Markovian) mendapat porsi besar.
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
pemakaian. Riset menemukan NVIDIA NIM menyediakan endpoint gratis ([OI]-compatible, ~40 RPM) untuk
prototipe, cocok sebagai sumber tunggal. Model gratis OpenCode Zen diikat ke fingerprint client resmi
mereka; meniru mekanisme itu berarti mengakali pembatasan pihak lain dan tidak akan dilakukan.

**Keputusan.** Dua komponen terpisah:

1. **Katalog model** — file JSON di repo, tanpa server. User melihat daftar model, tier, dan konteks.
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

## ADR-006 — Workspace riset terpisah, gitignored

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** Tim ingin mempelajari produk pembanding secara mendalam (Hermes, Grok Bot, Composio,
OpenCode, Zetaris, Meterless) untuk mengambil pola terbaik. Sebagian open source (MIT/Apache-2.0),
sebagian closed source.

**Keputusan.** Workspace `rea/` di root project, masuk `.gitignore`, tidak pernah di-commit atau
di-push. Boleh memuat cuplikan referensi untuk belajar, ditandai `REFERENCE ONLY`. Kode produk Weebo
seluruhnya ditulis sendiri. Tidak ada penyalinan kode, aset, atau teks ke repo.

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
menjadi task kecil (≤ 2 jam) yang dicatat di `docs/phases/`. Fase ditutup hanya setelah lima syarat
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

## ADR-009 — Landing page adalah deliverable jangka panjang

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** Project ini tidak berhenti di lomba. Landing page dibutuhkan sebagai wajah produk untuk
keberlanjutan, dan menulisnya memaksa kejelasan posisi sebelum koding.

**Keputusan.** Landing page dibangun dengan Astro di `apps/landing`, punya fase sendiri (P7), dan
boleh berjalan paralel dengan fase UI. Hosting awal di subdomain gratis; domain sendiri menyusul saat
ada anggaran. Setiap kemampuan diberi badge `live` atau `roadmap`.

**Konsekuensi.**

- Narasi produk terkunci lebih awal.
- Perlu audit klaim di akhir agar badge sesuai kenyataan.
- Live demo URL (PWA ter-deploy) bersifat opsional dan dikerjakan hanya jika ada sisa waktu.

---

## ADR-010 — Native menyusul setelah lomba

**Tanggal:** 2026-10-18
**Status:** Diterima

**Konteks.** Cakupan native penuh (PWA + desktop + APK) menarik tetapi berisiko menghabiskan waktu
pada toolchain, bukan pada agent.

**Keputusan.** Untuk lomba, kirim PWA. Migrasi bertahap ke Tauri (desktop) dan Capacitor (Android)
di atas monorepo yang sama setelah submission.

**Konsekuensi.**

- Tidak ada instalasi Rust/Android SDK yang memblokir build window.
- Klaim "tersedia di desktop dan Android" harus disampaikan sebagai PWA installable, bukan installer
  native, sampai migrasi selesai.
