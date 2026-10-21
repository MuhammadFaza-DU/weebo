# Checklist Submission

Semua materi ditulis dalam **Bahasa Inggris** — keputusan tim, bukan syarat lomba (`AGENTS.md` §1.1).
Dokumen ini boleh berbahasa Indonesia karena internal.

Tenggat: **27 Okt 2026 23:45 UTC**. Jangan menunggu sampai jam terakhir.

> **§7.3: tie-break memakai timestamp submission.** Jika Impact sama, yang submit lebih awal menang.
> **Target internal: submit minimal 12 jam sebelum tenggat.** Transkripsi aturan: `docs/RULES.md`.

---

## Deliverable wajib

Sumber kewajiban: `docs/RULES.md` §6.1–§6.4 dan FAQ §7.

| # | Item | Status | Pemilik | Catatan |
|---|---|---|---|---|
| 1 | Repo GitHub publik + README (setup, usage, dependencies) | | **belum ditetapkan** | Harus bisa dijalankan dari clone bersih |
| 2 | Video demo **1–4 menit** (YouTube/Vimeo, publik) | | **belum ditetapkan** | Menunjukkan main workflow, cara agent menyelesaikan challenge, fitur kunci, dan **bagaimana Zetaris + Meterless diintegrasikan** |
| 3 | Slide deck | | **belum ditetapkan** | Masalah dan target user, solusi, workflow/arsitektur agent, stack teknis, pemakaian Zetaris + Meterless, keunikan pemakaian teknologi sponsor, visual produk, pengembangan selanjutnya |
| 4 | Penjelasan teknologi sponsor | | **belum ditetapkan** | Bagaimana Zetaris dan Meterless diintegrasikan, bagaimana Cursor dipakai, di mana NVIDIA berkontribusi, apa yang unik. Sumber: `docs/SPONSORS.md` |
| 5 | Pemilihan track primer | | **belum ditetapkan** | Bisa diganti sampai tenggat (`docs/RULES.md` §3.3) |
| 6 | Deklarasi pre-existing component | | **belum ditetapkan** | Lihat `PREEXISTING.md` |
| 7 | **Contoh input + output lebih dari satu kasus** | | **belum ditetapkan** | Hackathon Overview §12: *"Sample inputs and outputs — enough to show the system works on more than one case"*. Menopang Technical (20) dan Demo (15) |
| 8 | **Trace yang bisa dibaca juri** | | **belum ditetapkan** | Hackathon Overview §12: *"Logs or traces — evidence of how the agent reached its output"* |

> **Pemilik wajib ditetapkan sebelum fase submission.** Semua kolom pemilik masih kosong. Tanpa
> penanggung jawab, video dan slide deck — dua deliverable dengan bobot skor terbesar setelah produk —
> berisiko tidak dikerjakan.

---

## Aturan angka di materi submission

**Hanya angka yang sudah diukur boleh muncul di README, slide deck, dan video.**

| Situasi | Yang boleh ditulis |
|---|---|
| Belum ada pengukuran sama sekali | **Tidak menampilkan angka kualitas apa pun.** Tulis kemampuan yang bisa didemokan |
| Pengukuran skala kecil sudah jalan | Boleh menyebut cakupan kecil itu secara eksplisit, tanpa menyebutnya akurasi |
| Pengukuran penuh sudah jalan | Boleh mengutip angka **apa adanya**, termasuk yang tidak mencapai target |

**Dilarang:** menampilkan target sebagai kalimat tanpa penanda, karena pembaca akan mengiranya hasil.
Jika target ditampilkan, ia harus berdampingan dengan hasil dan berlabel jelas (*"target 90%, hasil
86%"*).

**Dilarang:** menyebut evaluasi internal sebagai *"benchmark"* bila jumlah sampelnya kecil dan
datasetnya sintetis.

---

## Isi video (1–4 menit)

Aturan lomba: harus menunjukkan **main workflow**, bagaimana agent menyelesaikan challenge, fitur
kunci, dan bagaimana Zetaris + Meterless diintegrasikan.

Struktur **belum ditetapkan** — bergantung pada arah produk. Yang sudah mengikat:

- **Jangan menampilkan fitur yang belum jalan.** Juri akan mencocokkan video dengan repo.
- Minimal satu skenario demo sebaiknya memaksa agent **berinteraksi lebih dari sekali** (bukan pipeline
  satu arah). Juri secara eksplisit menghindari *"single-agent systems presented as agent systems"*.
- Demo tidak boleh bergantung pada **jalur khusus demo** — juri menghindari *"hardcoded demo paths"*.
- Sertakan bagian yang menunjukkan integrasi Zetaris dan Meterless **secara nyata**, bukan sebagai
  klaim.

---

## Isi slide deck

Nomor 1–2 **wajib diambil dari dokumen produk**, bukan dikarang saat menyusun slide. Ini bagian yang
dinilai pada Impact (30 poin, kriteria terbesar).

| # | Slide | Sumber |
|---|---|---|
| 1 | Masalah dan siapa yang terdampak | Dokumen produk |
| 2 | Solusi dan posisi produk | Dokumen produk |
| 3 | Arsitektur dan alur agent | Dokumen arsitektur |
| 4 | Stack teknis | Dokumen arsitektur + ADR |
| 5 | Integrasi Zetaris — apa, di mana, bukti | `docs/SPONSORS.md` §1 |
| 6 | Integrasi Meterless — apa, di mana, bukti | `docs/SPONSORS.md` §2 |
| 7 | Di mana NVIDIA berkontribusi | `docs/SPONSORS.md` §3 |
| 8 | Yang unik dari penggunaan sponsor technology | `docs/SPONSORS.md` |
| 9 | Visual produk (tangkapan layar nyata) | Aplikasi yang berjalan |
| 10 | Bukti kualitas — angka apa adanya, termasuk yang gagal | Hasil pengukuran nyata |
| 11 | Pengembangan selanjutnya | Backlog di `docs/PHASES.md` |

Jika pengukuran final belum sempat dijalankan, **buang slide 10** — jangan diisi target sebagai
gantinya. Slide yang tidak ada lebih baik daripada slide yang menampilkan janji sebagai hasil.

---

## Audit sebelum submit

- [ ] Semua klaim di README sesuai kenyataan (tidak ada fitur yang diklaim jalan padahal belum)
- [ ] `docs/SPONSORS.md` berisi bukti nyata, bukan placeholder
- [ ] `PREEXISTING.md` sesuai riwayat commit
- [ ] **Repo bisa di-clone dan dijalankan mengikuti README, diuji di mesin bersih**
      — FAQ §7: *"A submission a judge cannot run cannot be scored properly"*
- [ ] **Fallback tanpa internet diuji** — FAQ §5: *"include a fallback mode so your solution still runs
      if an external API is unavailable"*
- [ ] Tidak ada secret di riwayat commit; ada `.env.example` berisi placeholder
- [ ] Lisensi MIT terdeteksi di halaman repo
- [ ] Video < 4 menit, publik, tanpa musik berhak cipta
- [ ] Slide deck selesai
- [ ] Tidak ada angka target yang ditampilkan tanpa pasangan hasilnya
- [ ] Track dipilih di platform
- [ ] Tim sudah dibentuk di platform
- [ ] Submission dikirim minimal 12 jam sebelum tenggat (tie-break §7.3 pakai timestamp)

---

## Kalimat deklarasi pre-existing (draf)

> Before the build window we created only repository scaffolding: documentation, project governance
> files, and one vendored third-party dependency. All product code was written during the build window.
> The Meterless H-MEM engine is a third-party Apache-2.0 dependency, not our work.

Perbarui jika kenyataan berbeda. Jangan kirim klaim yang tidak sesuai riwayat commit.
