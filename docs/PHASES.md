# Kerangka Fase

Fase adalah **gate hasil**, bukan durasi. Tidak ada timebox. Fase ditutup hanya jika deliverable dan
syarat lulusnya terpenuhi (lihat `AGENTS.md` §8).

Setiap fase punya file sendiri di `docs/phases/` berisi daftar task kecil (≤ 2 jam) dengan kriteria
selesai. Task dicentang satu per satu; agent mengeksekusi per task, bukan per fase.

---

## Ringkasan

| Fase | Deliverable | Syarat lulus | Bergantung pada |
|---|---|---|---|
| **P0 Preflight** | Semua akses terverifikasi + asumsi arsitektur terjawab | Tidak ada blocker tersisa; setiap asumsi berstatus terjawab | — |
| P1 Walking Skeleton | Satu alur tipis end-to-end **lewat CLI** | Bisa didemokan 30 detik di terminal | P0 |
| P2 Agent Core | Loop, tool registry, policy, audit, protokol runtime–client **selesai** | Tool call tercatat dan bisa ditolak; CLI lewat protokol, bukan core langsung | P1 |
| P3 Memory & Reasoning | H-MEM (Store, Mining, Retrieval, TrustLedger), embedding nyata, jejak "kenapa" | Mengingat lintas sesi + menjelaskan sumber | P1 |
| P4 Design System | Token + komponen di canvas | HALT + approval eksplisit | — (bisa paralel) |
| P5 Surfaces | **PWA** sebagai client runtime, responsif | Jalan di layar HP dan desktop | P4, P2, P3 |
| P6 Autonomy | Scheduler headless, channel, jalur model | Tugas berjalan tanpa client terhubung | P2, P3 |
| P7 Landing Page | Astro site publik | Bisa dibuka publik, badge status akurat | — (bisa paralel) |
| P8 Submission | Video jadi (1–4 menit), slide, README, audit | Semua deliverable lomba lengkap | P1-P7 |

P4 dan P7 boleh berjalan paralel oleh orang berbeda dan tidak memblokir spine.

---

## Panduan memecah fase menjadi task

Fase adalah gate hasil. **Task adalah unit eksekusi.** Tanpa pemecahan yang baik, fase akan dikerjakan
sebagai satu blok besar dan hasilnya tidak bisa diverifikasi.

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
