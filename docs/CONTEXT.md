# Konteks Kerja — Pengetahuan yang Tidak Boleh Hilang

Dokumen ini menangkap pengetahuan yang **tidak tersimpan di ADR**: bobot penilaian, batasan tim,
angka yang sudah diukur, dan hal-hal yang sengaja tidak dilakukan.

ADR menjawab *"apa yang diputuskan"*. Dokumen ini menjawab *"apa yang sudah dicoba, apa yang diukur,
dan apa yang berbahaya untuk diulang"*.

**Baca dokumen ini sebelum mengusulkan perubahan arah.**

---

## 1. Bentuk produk dan arsitektur (ringkas)

Wajib dipahami sebelum mengusulkan perubahan apa pun.

**Satu runtime, banyak client.** `apps/runtime` adalah server lokal (Node) — satu-satunya yang menyentuh
filesystem, scheduler, secret, dan MCP. Semua surface adalah client yang bicara lewat
`packages/protocol`.

| Surface | Peran | Kapan |
|---|---|---|
| `apps/cli` | `npx weebo`, `npx weebo serve` — untuk developer dan scripting | P1 |
| `apps/web` | PWA, wajah produk untuk pengguna | P5 |
| `apps/desktop` | Electron (bukan Tauri) | Setelah P5 (UI ada) + P2 (protokol) |

**Konsekuensi yang sering salah dipahami:**

- **P1 memakai CLI, bukan UI.** Tujuannya membuktikan pipeline, bukan tampilan.
- **PWA tidak punya mode standalone.** Selalu terhubung ke runtime. Kalau runtime mati, PWA mati.
- **Demo lomba wajib menjalankan `npx weebo serve` lebih dulu.**
- `packages/core` tidak dipanggil langsung oleh client mana pun, **kecuali pengecualian sementara P1**
  (ADR-013): di P1 saja CLI boleh memanggil core langsung; wajib ditutup di P2.
- CLI diposisikan untuk developer; **wajah produk tetap PWA**.

**Memori:** engine Meterless di-*vendor* (Apache-2.0) + adapter embedding sendiri lewat `MemoryPort`.
Embedding memakai NVIDIA `nemotron-3-embed-1b`.

---

## 2. Bobot penilaian lomba

Open Agent Hackathon 2026 — skor 100 poin:

| Kriteria | Bobot |
|---|---|
| **Impact** | **30** |
| Technical | 20 |
| Innovation | 15 |
| Demo | 15 |
| Product & UX | 10 |
| Sponsor tech | 10 |

**Implikasi praktis:** Impact dan Demo bersama bernilai **45 poin**. Kedalaman teknis yang tidak
terlihat di demo nilainya kecil. Setiap keputusan prioritas harus menjawab: *"apakah ini menaikkan
Impact atau Demo?"*

Konsekuensi yang sudah dipakai: UI tidak dibangun sebelum pipeline terbukti; demo 30 detik menjadi
syarat lulus setiap fase.

### Fakta aturan yang mengubah strategi (terverifikasi §07, §08, §03, §05)

| Fakta | Section | Konsekuensi |
|---|---|---|
| **Tie-break pakai Impact, lalu timestamp submission** | 7.3 | **Submit jauh sebelum tenggat.** Kalau Impact sama, yang lebih awal menang |
| Track boleh diganti kapan saja sebelum deadline | 3.3 | Track 03 tidak mengunci; bisa dinilai ulang sebelum submit |
| Hadiah dibagi rata kecuali tim menulis pembagian berbeda | 8.5 | Tim 3 orang perlu kesepakatan **tertulis** jika ingin pembagian lain |
| Kode hasil AI sah dan diharapkan | 5.5 | Tidak perlu menyembunyikan pemakaian AI; yang dinilai hasil dan tanggung jawab |
| Cross-track tidak dinilai dua kali | 3.4 | Jangan mencoba memainkan dua track sekaligus |

Transkripsi lengkap: `docs/RULES.md`.

### Hadiah in-kind (terpisah dari skor)

| Hadiah | Nilai | Relevan untuk kita? |
|---|---|---|
| Best use of NVIDIA Nemotron | NVIDIA DGX Spark (Founder's Edition), $4.699 | **Ya** — embedding dan jalur model memakai Nemotron |
| Best use of Cursor-built product | SpaceX Cursor API credits, $2.301 | **Tidak** — Cursor hanya dipakai untuk review, bukan membangun |

**Keputusan sadar:** hadiah Cursor **tidak dikejar** — lihat `docs/DECISIONS.md` ADR-014. Hadiah NVIDIA
tetap dalam jangkauan karena integrasinya sudah bagian dari rencana (embedding + jalur model gratis).

---

## 3. Batasan tim — paralelisasi tidak linear

Tim 3 orang, tapi **3 orang ≠ 3× lebih cepat**.

Alasannya: pekerjaan ini satu modul dengan tipe bersama dan kontrak presisi. Paralelisasi realistis
**±1,7×**, bukan 3×.

Contoh yang sudah dihitung: menulis ulang engine memori dari spesifikasi (±1.400 baris) akan menyerap
**2 dari 3 orang selama 1–1,5 hari**. Artinya Zetaris, agent loop, CLI, dan UI **tidak bergerak** di
periode itu.

**Jangan mengusulkan "kerjakan paralel semua" tanpa menghitung apa yang berhenti.**

---

## 4. Angka yang sudah diukur (jangan menebak ulang)

### Meterless H-MEM

| Item | Nilai |
|---|---|
| Ukuran engine referensi | ≈42,6 KB, 10 file, ~1.200–1.500 baris TS |
| Runtime dependencies | **nol** (hanya `tsx` + `vitest` sebagai devDeps) |
| Embedder bawaan | FNV-1a hash → vektor 64 dimensi, **tanpa makna semantik** |
| Storage bawaan | file JSON |
| Conformance suite | `conformance/runner.ts` (9,7 KB) + `vectors/` |
| Status engine | *"not a production library"* — pernyataan penulisnya sendiri |

### Formula ranking H-MEM

```
raw = 0.35·semantic + 0.20·keyword + 0.10·tag + 0.10·domain
    + 0.15·entity + 0.05·layer + 0.05·recency − 0.20·superseded
```

`semantic` = **0,35**, komponen terbesar. Karena itu penggantian embedder wajib, bukan opsional.

### NVIDIA Nemotron-3-Embed-1B

| Item | Nilai |
|---|---|
| ID model | `nemotron-3-embed-1b` |
| Dimensi | 2048 (dapat dipotong 1024/512, normalisasi L2 ulang) |
| Konteks | 32.768 token |
| Bahasa | 34, termasuk **Indonesia** |
| Lisensi | OpenMDW 1.1 |

---

## 5. Provider model gratis (terverifikasi 2026-10-18)
Angka berubah dari waktu ke waktu — **verifikasi ulang sebelum dipakai**.

| Provider | Limit gratis | Kartu kredit | Catatan |
|---|---|---|---|
| **NVIDIA NIM** | ~40 RPM (dari dokumentasi, **belum diukur**) | Tidak (verifikasi telepon) | Sponsor lomba; 132 model; endpoint kompatibel Chat Completions |
| Groq | 30 RPM / ~14.400 RPD | Tidak | Tercepat (LPU) |
| OpenRouter | 50–200 RPD (1.000 dengan top-up $10 sekali) | Tidak | 35+ model `:free` |
| GitHub Models | 150–1.000/hari | Tidak | Cukup akun GitHub |
| Google AI Studio | 5–15 RPM, 20–1.500 RPD | Tidak | Konteks 1 juta token |
| Cloudflare Workers AI | 10.000 neuron/hari | Tidak | Bisa sekaligus jadi host gateway |
| Ollama / LM Studio | tak terbatas | Tidak | Gratis sejati, butuh RAM |

**Keputusan:** gateway free tier hanya memegang key **NVIDIA NIM** (sponsor, jelas boleh untuk
prototipe). Provider lain lewat BYOK user.

---

## 6. Peringatan etis dan legal — jangan dilanggar

Ini bukan formalitas. Aturan lomba mensyaratkan submission sebagai *"original work product"* dan
*"solely owned by you"*.

| Jangan | Alasan |
|---|---|
| Menyalin kode/aset/ikon/teks pihak lain ke repo | Melanggar originalitas; risiko **diskualifikasi**, bukan pengurangan nilai |
| Meniru mekanisme fingerprint client OpenCode Zen | Mengakali pembatasan pihak lain; berisiko key diblokir |
| Membongkar binary produk closed source untuk dipakai | Legalitas abu-abu dan tidak diperlukan |
| Menyebut fitur sebagai "live" padahal belum jalan | Juri membandingkan video dengan repo |
| Menyimpan key berbayar di gateway publik | Biaya tak terkendali + pelanggaran ToS provider |

**Yang sah:** mempelajari pola arsitektur, memakai dependensi open source dengan atribusi, menulis
sendiri seluruh kode produk.

Catatan penting: **engine Meterless adalah dependensi Apache-2.0, bukan karya tim.** Ini sudah
dinyatakan terbuka di `docs/SPONSORS.md`. Jangan mengubahnya menjadi klaim kepemilikan.

---

## 7. Fakta teknis lingkungan

| Item | Status |
|---|---|
| Node | v24.16.0 |
| npm | 11.13.0 |
| pnpm | **tidak terpasang** |
| Rust / cargo | **tidak terpasang** → Tauri bukan jalur realistis |
| Java | 17 (Android build mungkin, tapi Android SDK belum diverifikasi) |
| MCP TypeScript SDK | 1.32.1 tersedia |
| Meterless di npm | **tidak ada** — harus di-vendor |

---

## 8. Keputusan yang sudah ditolak (jangan diusulkan ulang tanpa alasan baru)

| Diusulkan | Ditolak karena |
|---|---|
| Tauri sebagai target desktop | Butuh Rust + MSVC; Electron hanya butuh Node |
| Flutter | Memutus akses langsung ke engine Meterless (TypeScript) |
| PWA standalone tanpa runtime | Tidak bisa scheduler/filesystem/keychain — kelemahan yang justru ingin dihilangkan |
| Menulis ulang engine memori sekarang | Mempertaruhkan 55+ poin untuk menambah nilai di ±15 poin |
| Composio sebagai fondasi connector | Produk berbayar; bertentangan dengan posisi BYOK/gratis |
| Katalog model gaya Zen dengan bypass fingerprint | Tidak sah |
| Kuota gratis per IP sebagai fase wajib | Stretch; butuh gateway + pengujian |
| Native tampil di demo lomba | Memakan ±1 hari dari agent core |

---

## 9. Cara kerja yang disepakati

| Hal | Aturan |
|---|---|
| Fase | Gate hasil, bukan durasi. Tanpa timebox |
| **Penundaan** | **Berbasis dependensi, bukan tanggal.** Dilarang menulis "setelah lomba" sebagai alasan. Syarat mulai: dependensi + submission aman + izin user (AGENTS.md §8.1) |
| Task | ≤ 2 jam, kriteria selesai objektif, dicatat di `docs/phases/` |
| Keluar fase | 6 syarat: demo-able, CHECKPOINT, commit+tag, approval, laporan verifikasi, **log Cursor** |
| Subagent | Default implementer + reviewer read-only; **tanya user dulu** native atau subagent |
| Merge | Hanya `@MuhammadFaza-DU`; CI wajib hijau; review code owner wajib |
| Desain | Canvas penuh + HALT sebelum kode UI |
| Bahasa | Dokumen internal Indonesia, materi publik Inggris |
| Cursor | Dipakai untuk **review**, bukan menulis kode. Log diisi agent setiap fase |

---

## 10. Asumsi terbuka dan di mana ia dijawab

Semua asumsi di bawah **wajib diuji di P0**, bukan ditebak. Lihat `docs/phases/P0-preflight.md`.

| Asumsi | Dijawab di | Status |
|---|---|---|
| Apakah Zetaris bisa dipanggil dari browser, atau wajib lewat server | P0 · T0.3 | belum diuji |
| **Bagaimana ponsel/tablet mencapai runtime di `localhost`** | **P0 · T0.7** | **terjawab 2026-10-20 — ADR-016**: LAN bind + pairing token. Installability butuh secure context (tunnel) |
| Apakah conformance suite Meterless bisa jalan di lingkungan kita | P0 · T0.6 | belum diuji |
| Rate limit NVIDIA NIM yang sebenarnya (~40 RPM masih dari dokumentasi) | P0 · T0.4 | belum diukur |
| Apakah plan Cursor Free cukup untuk 6 hari kerja tim | P0 · T0.5 | belum diuji |
| Pembagian pemilik lapisan per orang | P1 awal, dicatat di `CHECKPOINT.md` | belum diputuskan |

**Fakta yang sudah terverifikasi (2026-10-18) — jangan diuji ulang:**

- Cursor plan Free **ada**: $0, tanpa kartu kredit, tidak kedaluwarsa. Isi: Agent + Chat + Tab dengan
  kuota terbatas yang **angkanya tidak dipublikasikan Cursor**. Model pihak ketiga tidak termasuk.
  Klaim bahwa MCP/skills tidak tersedia di Free **belum terverifikasi** — jangan dijadikan patokan.
- `nemotron-3-embed-1b`: 2048 dimensi, konteks 32.768 token, mendukung bahasa Indonesia.
- Engine Meterless referensi: ≈42,6 KB, 10 file, **zero runtime dependencies**.

Jika sebuah asumsi menjadi penghalang, **uji dulu**, jangan menebak.
