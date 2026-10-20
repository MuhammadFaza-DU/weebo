# Kerangka Fase

Fase adalah **gate hasil**, bukan durasi. Tidak ada timebox. Fase ditutup hanya jika deliverable dan
syarat lulusnya terpenuhi (lihat `AGENTS.md` §8).

Setiap fase punya file sendiri di `docs/phases/` berisi daftar task kecil (≤ 2 jam) dengan kriteria
selesai. Task dicentang satu per satu; agent mengeksekusi per task, bukan per fase.

---

## Ringkasan

| Fase | Deliverable | Syarat lulus | Bergantung pada | Story PRD |
|---|---|---|---|---|
| **P0 Preflight** | Semua akses terverifikasi + asumsi arsitektur terjawab + protokol evaluasi ditetapkan | Tidak ada blocker tersisa; setiap asumsi berstatus terjawab | — | — (pendukung) |
| P1 Walking Skeleton | Satu alur tipis end-to-end **lewat CLI** + dataset demo, golden set, dan runner eval; **pemisahan L1 vs L4(a)** agar K2 terukur | Bisa didemokan 30 detik di terminal; smoke eval 5 pertanyaan dijalankan | P0 | US-01, US-02, US-09, US-14, US-17 |
| P2 Agent Core | Loop, tool registry, policy, audit, protokol runtime–client **selesai**; **loop penalaran berbatas + tangga L0–L4 + trace terstruktur** (ADR-017) | Tool call tercatat dan bisa ditolak; CLI lewat protokol, bukan core langsung; **Evaluator mengembalikan Verdict tertutup dan trace menampilkan iterasi** | P1 | US-03, US-04, US-05, US-10 |
| P3 Memory & Reasoning | H-MEM (Store, Mining, Retrieval, TrustLedger), embedding nyata, jejak "kenapa" | Mengingat lintas sesi + menjelaskan sumber; **eval 30 penuh pertama + baseline; kalibrasi target KPI** | P1 | US-06, US-07, US-08, US-09, US-18 |
| P4 Design System | Token + komponen di canvas | HALT + approval eksplisit | — (bisa paralel) | — (pendukung) |
| P5 Surfaces | **PWA** sebagai client runtime, responsif | Jalan di layar HP dan desktop; **eval 30 penuh lewat PWA (paritas dengan CLI)** | P4, P2, P3 | US-11, US-12 |
| P6 Autonomy | Scheduler headless, channel, jalur model | Tugas berjalan tanpa client terhubung | P2, P3 | US-13 |
| P7 Landing Page | Astro site publik | Bisa dibuka publik, badge status akurat | — (bisa paralel) | US-16 |
| P8 Submission | Video jadi (1–4 menit), slide, README, audit | Semua deliverable lomba lengkap; **eval final 30 penuh, angka K1–K5 dikutip apa adanya** | P1-P7 | — (pendukung) |

Story berprioritas **Could** dan belum punya fase: US-15 (aplikasi desktop) — masuk backlog.

P4 dan P7 boleh berjalan paralel oleh orang berbeda dan tidak memblokir spine.

> **Batas nyata yang harus diingat — bukan gate tanggal.** Participant Journey Map §5.4 (HackOS)
> mengalokasikan hari secara eksplisit: 22 Okt untuk Zetaris+Meterless+loop dasar, 23–24 untuk
> evaluator/retry/memory/log, 25 untuk dataset/tool/retrieval, **26 untuk README+slide+rekam video**,
> 27 untuk final check dan submit. Dari tabel di atas, **P4, P5, P6, dan P7 tidak mendapat hari**.
> Ini bukan alasan membuang fase — P4 dan P7 memang paralel — tetapi rencana harus ditinjau sebelum
> 22 Okt, bukan ditemukan gagal di hari kelima. Aturan penundaan tetap `AGENTS.md` §8.1.

### Timeline hari-per-hari — versi paling rinci (Event Calendar §6)

Event Calendar memberi versi yang lebih tajam dari Journey Map. Dipakai sebagai acuan perencanaan:

| Tanggal | Prioritas resmi | Fase kita |
|---|---|---|
| 22 Okt | Build window buka 00:00. **Kunci arsitektur, peran agent, pendekatan data**, integrasikan Zetaris + Meterless | P1 |
| 23 Okt | **Bangun loop minimal yang jalan** | P1 → P2 |
| 24–25 Okt | **Perdalam perilaku agent**: retry, fallback, logging, uji dengan input realistis | P2 + P3 |
| 26 Okt | **Freeze fitur**, hardening, rekam video, selesaikan slide, kemas submission | P8 |
| 27 Okt | Submit sebelum 23:45 UTC | P8 |

**Checkpoint tengah resmi — 24 Okt.** Yang seharusnya sudah ada: track + use case terkonfirmasi;
peran agent dan alur interaksi terdefinisi; **versi end-to-end minimal yang jalan**; **Zetaris dan
Meterless terhubung dan teruji**; aktivitas agent tercatat di log; contoh input dan output awal.

Pertanyaan resmi yang dianjurkan: *"If the submission deadline were tomorrow, what would fail?"*

**Yang harus disadari dari tabel ini:** P4 (design system), P5 (PWA), P6 (autonomy), dan P7 (landing)
**tidak muncul di satu hari pun**. Bukan berarti harus dibuang — tetapi keputusan "dikerjakan atau
dipindah ke backlog" harus diambil sebelum 22 Okt.

---

## Panduan memecah fase menjadi task

Fase adalah gate hasil. **Task adalah unit eksekusi.** Tanpa pemecahan yang baik, fase akan dikerjakan
sebagai satu blok besar dan hasilnya tidak bisa diverifikasi.

**Dari mana task berasal.** Task diturunkan dari **user story berprioritas di `docs/PRD.md` §2.4**, bukan
dikarang. Setiap task yang menyentuh produk harus menunjuk ke satu ID story (mis. `US-03`) atau
menyatakan dirinya sebagai pekerjaan pendukung (mis. setup, CI). Task yang tidak bisa ditautkan ke
story mana pun adalah tanda scope creep — atau tanda PRD perlu diperbarui lebih dulu.

Prioritas story menentukan urutan: **Must** sebelum **Should**, **Should** sebelum **Could**. Story
berprioritas **Could** tidak boleh dikerjakan selama masih ada **Must** yang belum selesai di fase itu.

### Aturan ukuran

| Aturan | Nilai |
|---|---|
| Ukuran maksimum | ±2 jam kerja |
| Ukuran ideal | 30–90 menit |
| Satu task = satu perubahan | Bisa diverifikasi sendiri tanpa menunggu task lain |
| Jumlah per fase | 5–10 task. Lebih dari itu, fase terlalu besar dan perlu dipecah |

### Format wajib per task

```markdown
### Tn.m — Judul singkat

- [ ] Langkah konkret (diawali kata kerja: buat, tulis, jalankan, uji)
- [ ] Langkah konkret
- [ ] Verifikasi: perintah atau cek yang membuktikan task selesai

**Kriteria selesai:** pernyataan objektif yang bisa diperiksa orang lain.
```

### Kriteria selesai yang baik vs buruk

| ❌ Buruk | ✅ Baik |
|---|---|
| "UI sudah bagus" | "`npm run dev` menampilkan halaman chat; input teks mengirim dan jawaban muncul" |
| "Integrasi jalan" | "`npx weebo \"test\"` mengembalikan jawaban yang menyebut satu sumber data nyata" |
| "Test lulus" | "`npm test` hijau, 8 test, 0 gagal; output ditempel di PR" |
| "Sudah dioptimalkan" | "Query yang sama turun dari 3.200 ms ke 800 ms, diukur 3 kali" |

Aturan: kalau kriteria selesai tidak bisa diperiksa orang lain tanpa bertanya, itu bukan kriteria.

### Larangan

- Task yang tidak bisa diverifikasi sendiri (mis. "riset dulu", tanpa output jelas).
- Task yang mencampur dua hal berbeda (mis. "buat client Zetaris dan UI-nya").
- Task tanpa kriteria selesai.
- Menghapus task yang tidak selesai — pindahkan ke backlog dengan alasan.

### Urutan dalam satu fase

1. **Fondasi** — tipe, kontrak, konfigurasi.
2. **Jalur utama** — satu alur tipis yang membuktikan sesuatu berjalan.
3. **Penguatan** — error handling, test, tepi kasus.
4. **Bukti** — catat hasil di dokumen, perbarui CHECKPOINT, tawarkan commit + tag.

### Contoh pemecahan yang benar

Fase "P2 Agent Core" (contoh, belum ditulis):

| Task | Ukuran | Kriteria selesai |
|---|---|---|
| T2.1 Definisikan `ToolPolicy` | 30 mnt | Tipe ada, `npm run typecheck` hijau |
| T2.2 Implementasi registry | 90 mnt | Test: daftar tool, ambil berdasarkan nama |
| T2.3 Policy check sebelum eksekusi | 60 mnt | Test: tool ber-`requiresApproval` ditolak tanpa izin |
| T2.4 Audit log | 60 mnt | Test: setiap eksekusi menulis satu entri tanpa secret |
| T2.5 Wiring ke `runTurn` | 45 mnt | Satu perintah CLI memicu satu tool dan tercatat di audit |

### Catatan tentang fase yang belum punya file

Saat ini baru **P0** dan **P1** yang punya file task. P2–P8 **belum**.

Artinya: rencana fase ada di level tinggi (tabel di atas), tapi **task-level belum ada**. Jangan
menganggap fase tanpa file sudah punya rencana yang bisa dieksekusi.

File task dibuat **saat fase itu dimulai**, bukan sebelumnya. Alasannya: pemecahan task bergantung
pada apa yang dipelajari di fase sebelumnya. Menulis task P5 sekarang berarti menebak.

Aturan: **fase tidak boleh dimulai tanpa file task-nya dibuat lebih dulu.**

**Kewajiban yang sudah ditetapkan untuk file fase yang belum dibuat.** Ini bukan tebakan task — ini
syarat yang harus ada di file tersebut saat dibuat, karena ditetapkan oleh dokumen lain:

| Fase | Wajib memuat | Sumber kewajiban |
|---|---|---|
| **P3** | Task menjalankan eval **30 penuh dalam dua mode** (baseline tanpa memori + penuh), dan task **meninjau target KPI** berdasarkan hasilnya | `docs/PRD.md` §1.3 (kalibrasi), §3.2 (baseline) |
| P5 | Task menjalankan eval 30 penuh **lewat PWA**, dibandingkan dengan hasil CLI | `docs/PRD.md` §3.2 |
| P8 | Task menjalankan eval final dan mengutip angka K1–K5 apa adanya di submission | `docs/PRD.md` §1.3, `docs/SUBMISSION.md` |

**Kalibrasi target KPI tidak boleh dilewati di P3.** Jika file P3 dibuat tanpa task itu, target
`provisional` akan berubah status menjadi permanen tanpa pernah ditinjau — dan tidak ada yang
menyadarinya.

---

## Protokol keluar fase (wajib, keenam-enamnya)

1. Deliverable bisa didemokan.
2. `CHECKPOINT.md` diperbarui.
3. Commit dibuat dan tag `stable-YYYY-MM-DD-vN` ditawarkan ke user.
4. Approval eksplisit user diminta dan diterima.
5. Laporan verifikasi disampaikan, termasuk apa yang **belum** terverifikasi.
6. `docs/CURSOR-LOG.md` diperbarui — agent wajib menanyakan apakah ada review di Cursor pada fase ini,
   lalu mencatat jawabannya apa adanya, termasuk "tidak ada".

Jangan memulai fase berikutnya sebelum keenam hal ini selesai.

---

## Pembagian pemilik lapisan

Sengaja **belum ditetapkan**. Tim memilih di awal P1, lalu mencatatnya di `CHECKPOINT.md`.

Alasan tidak ditetapkan sekarang: pembagian bergantung pada kekuatan masing-masing orang dan pada
temuan P0 (misalnya, kalau Zetaris ternyata butuh proxy, beban `apps/runtime` naik).

**Aturan yang berlaku sampai pembagian ditetapkan:**

- `CODEOWNERS` menunjuk `@MuhammadFaza-DU` untuk semua path (ADR-005). Ini tidak berubah.
- Setiap orang wajib membuka PR; tidak ada push langsung ke `main`.
- Sebelum menyentuh folder yang belum jelas pemiliknya, tanyakan di PR atau chat tim.

### Tiga opsi yang bisa dipilih

| Opsi | Orang 1 | Orang 2 | Orang 3 | Cocok jika |
|---|---|---|---|---|
| **A — Per lapisan** | Agent core + Meterless | UI + design system | Runtime/connector + landing | Ada satu orang kuat di arsitektur, satu di visual |
| **B — Per lapisan (varian)** | Agent core + Zetaris | Connector + runtime | UI + design system + landing | Ada satu orang kuat di data/integrasi |
| **C — Per peran** | Koordinasi + integrasi sponsor + submission | Agent core + memory | UI + connector + landing | Ada satu orang yang mau pegang dokumen dan demo |

### Cara memilih (lakukan di awal P1)

1. Setiap orang tuliskan: paling nyaman di area apa, paling tidak nyaman di apa.
2. Cocokkan dengan tabel di atas.
3. Tulis hasilnya di `CHECKPOINT.md` bagian "Pembagian lapisan".
4. Perbarui `CODEOWNERS` hanya jika perlu pembatasan tambahan.

Aturan tambahan: **pemilik lapisan bukan pemilik mutlak.** Siapa pun boleh menyentuh folder lain,
asal lewat PR dan memberi tahu pemiliknya.

---

## Backlog lintas fase

Pekerjaan yang **belum dikerjakan sekarang**, bukan yang "dibuang" dan bukan yang "ditunda sampai
tanggal tertentu". Aturan: lihat `AGENTS.md` §8.1 — penundaan berbasis **dependensi**, bukan tanggal.

**Syarat mulai (ketiganya wajib):** dependensi terpenuhi · deliverable wajib lomba aman · user setuju.

| Prioritas | Item | Dependensi | Syarat mulai tambahan |
|---|---|---|---|
| 1 | **Live demo URL** (PWA ter-deploy) | P5 selesai | Deploy gratis; juri bisa mencoba langsung |
| 2 | **Desktop native — Electron** | P5 selesai + P2 selesai | Shell atas UI yang sama, tanpa Rust. ADR-010 |
| 3 | **Gateway kuota gratis per IP** | P1–P5 lulus | Cloudflare Worker + uji kuota. ADR-004 |
| 4 | **APK Android — Capacitor** | P5 selesai | Android SDK terpasang |
| 5 | **Implementasi engine memori sendiri** | P3 selesai + `MemoryPort` stabil | ADR-012 |
| 6 | **Landing page polish** | P7 selesai | Badge status sudah akurat |
| 7 | Connector katalog luas | MCP + Zetaris stabil | Minimal satu connector eksternal berjalan |
| 8 | Auto-generate skills | P3 selesai + evaluasi kualitas selesai | Butuh set data evaluasi |
| 9 | Cloud sync penyimpanan | P5 selesai + storage runtime stabil | Desain penyimpanan diputuskan lebih dulu |
| 10 | Pindah repo ke GitHub Organization | P8 selesai (semua pekerjaan sudah di `main`) | Hanya jika kontrol akses dirasa kurang |
| 11 | Domain kustom untuk landing page | P8 selesai | Butuh keputusan anggaran |

**Urutan prioritas berdasarkan dampak skor vs effort** (bobot: Impact 30, Demo 15, Product&UX 10,
Sponsor tech 10). Live demo URL mendahului Electron karena effort jauh lebih kecil dengan dampak skor
yang sebanding.

**Catatan:** tidak ada item yang boleh diberi dependensi `—`. Item tanpa dependensi berarti tidak
punya alasan ditunda, dan harus dikerjakan atau dihapus dari daftar.
