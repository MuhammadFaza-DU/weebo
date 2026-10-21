# Kerangka Fase

Fase adalah **gate hasil**, bukan durasi. Tidak ada timebox. Fase ditutup hanya jika deliverable dan
syarat lulusnya terpenuhi (lihat `AGENTS.md` §8).

Setiap fase punya file sendiri di `docs/phases/` berisi daftar task kecil (≤ 2 jam) dengan kriteria
selesai. Task dicentang satu per satu; agent mengeksekusi per task, bukan per fase.

**Status:** daftar fase **belum ada**. Fase ditentukan setelah arah produk disepakati. Dokumen ini
memuat kerangka dan panduan yang berlaku untuk fase apa pun.

---

## Timeline resmi lomba — ini yang mengikat

Sumber: Participant Journey Map §5.4 dan Event Calendar §6 (HackOS). Ini **bukan rencana kita**, ini
alokasi hari yang dianjurkan penyelenggara.

| Tanggal | Prioritas resmi |
|---|---|
| 22 Okt | Build window buka 00:00. **Kunci arsitektur, peran agent, pendekatan data**, integrasikan Zetaris + Meterless |
| 23 Okt | **Bangun loop minimal yang jalan** |
| 24–25 Okt | **Perdalam perilaku agent**: retry, fallback, logging, uji dengan input realistis |
| 26 Okt | **Freeze fitur**, hardening, rekam video, selesaikan slide, kemas submission |
| 27 Okt | Submit sebelum 23:45 UTC |

**Checkpoint tengah resmi — 24 Okt.** Yang seharusnya sudah ada: track + use case terkonfirmasi;
peran agent dan alur interaksi terdefinisi; **versi end-to-end minimal yang jalan**; **Zetaris dan
Meterless terhubung dan teruji**; aktivitas agent tercatat di log; contoh input dan output awal.

Pertanyaan resmi yang dianjurkan: *"If the submission deadline were tomorrow, what would fail?"*

**Konsekuensi yang harus disadari:** alokasi resmi di atas hanya memberi ruang untuk **satu jalur
utama yang jalan**. Apa pun di luar itu — UI tambahan, landing page, fitur otonomi — tidak mendapat
hari. Keputusan "dikerjakan atau dipindah ke backlog" harus diambil **sebelum 22 Okt**.

---

## Panduan memecah fase menjadi task

Fase adalah gate hasil. **Task adalah unit eksekusi.** Tanpa pemecahan yang baik, fase akan dikerjakan
sebagai satu blok besar dan hasilnya tidak bisa diverifikasi.

**Dari mana task berasal.** Task diturunkan dari user story berprioritas di dokumen produk, bukan
dikarang. Setiap task yang menyentuh produk harus menunjuk ke satu ID story atau menyatakan dirinya
sebagai pekerjaan pendukung (mis. setup, CI). Task yang tidak bisa ditautkan ke story mana pun adalah
tanda scope creep.

Prioritas story menentukan urutan: **Must** sebelum **Should**, **Should** sebelum **Could**.

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
| "UI sudah bagus" | "`npm run dev` menampilkan halaman; input teks mengirim dan jawaban muncul" |
| "Integrasi jalan" | "`npx <cli> \"test\"` mengembalikan jawaban yang menyebut satu sumber data nyata" |
| "Test lulus" | "`npm test` hijau, 8 test, 0 gagal; output ditempel di PR" |
| "Sudah dioptimalkan" | "Query yang sama turun dari 3.200 ms ke 800 ms, diukur 3 kali" |

Aturan: kalau kriteria selesai tidak bisa diperiksa orang lain tanpa bertanya, itu bukan kriteria.

### Larangan

- Task yang tidak bisa diverifikasi sendiri (mis. "riset dulu", tanpa output jelas).
- Task yang mencampur dua hal berbeda.
- Task tanpa kriteria selesai.
- Menghapus task yang tidak selesai — pindahkan ke backlog dengan alasan.

### Urutan dalam satu fase

1. **Fondasi** — tipe, kontrak, konfigurasi.
2. **Jalur utama** — satu alur tipis yang membuktikan sesuatu berjalan.
3. **Penguatan** — error handling, test, tepi kasus.
4. **Bukti** — catat hasil di dokumen, perbarui CHECKPOINT, tawarkan commit + tag.

### Catatan tentang fase yang belum punya file

**Saat ini tidak ada satu pun file fase.** File task dibuat **saat fase itu dimulai**, bukan
sebelumnya. Alasannya: pemecahan task bergantung pada apa yang dipelajari di fase sebelumnya. Menulis
task fase jauh di depan berarti menebak.

Aturan: **fase tidak boleh dimulai tanpa file task-nya dibuat lebih dulu.**

---

## Protokol keluar fase (wajib, keenam-enamnya)

Salinan yang mengikat ada di `AGENTS.md` §8.2. Ringkasnya:

1. Deliverable bisa didemokan.
2. `CHECKPOINT.md` diperbarui.
3. Commit dibuat dan tag `stable-YYYY-MM-DD-vN` ditawarkan ke user.
4. Approval eksplisit user diminta dan diterima.
5. Laporan verifikasi disampaikan, termasuk apa yang **belum** terverifikasi.
6. `docs/CURSOR-LOG.md` diperbarui — agent wajib menanyakan apakah ada review di Cursor pada fase ini,
   lalu mencatat jawabannya apa adanya, termasuk "tidak ada".

Jangan memulai fase berikutnya sebelum keenam hal ini selesai.

---

## Pembagian kerja

**Belum ditetapkan.** Lihat `CHECKPOINT.md` bagian "Realita tim".

Yang **sudah** mengikat:

- `CODEOWNERS` menunjuk `@MuhammadFaza-DU` untuk semua path.
- Setiap orang wajib membuka PR; tidak ada push langsung ke `main`.
- Rencana kerja harus **tidak gagal bila kontribusi anggota lain nol**.

---

## Backlog

**Kosong.** Backlog lama ikut terhapus bersama ide produk pada 2026-10-21.

Aturan untuk item backlog baru: lihat `AGENTS.md` §8.1 — penundaan berbasis **dependensi**, bukan
tanggal. Setiap item wajib punya **dependensi**, **syarat mulai**, dan **prioritas**. Item tanpa
dependensi berarti tidak punya alasan ditunda.
