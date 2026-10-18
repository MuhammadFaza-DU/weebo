# Checklist Submission

Semua materi harus berbahasa **Inggris**. Dokumen ini boleh berbahasa Indonesia karena internal.

Tenggat: **27 Okt 2026 23:45 UTC**. Jangan menunggu sampai jam terakhir.

> **§07.3: tie-break memakai timestamp submission.** Jika Impact sama, yang submit lebih awal menang.
> **Target internal: submit minimal 12 jam sebelum tenggat.** Transkripsi aturan: `docs/RULES.md`.

---

## Deliverable wajib

| # | Item | Status | Pemilik | Catatan |
|---|---|---|---|---|
| 1 | Repo GitHub publik + README (setup, usage, dependencies) | | **belum ditetapkan** | Harus bisa dijalankan dari clone bersih |
| 2 | Video demo 1–4 menit (YouTube/Vimeo, publik) | | **belum ditetapkan** | Menunjukkan workflow utama + integrasi sponsor |
| 3 | Slide deck | | **belum ditetapkan** | Masalah, user, solusi, arsitektur, stack, sponsor, visual, future |
| 4 | Penjelasan Zetaris + Meterless + Cursor + NVIDIA | | **belum ditetapkan** | Ada di `docs/SPONSORS.md`, diringkas di submission. **Cursor: jelaskan sebagai alat review, bukan integrasi produk** — sumbernya `docs/CURSOR-LOG.md` |
| 5 | Pemilihan track (Track 03 — Reasoning Architecture) | | **belum ditetapkan** | |
| 6 | Deklarasi pre-existing component | | **belum ditetapkan** | Lihat `PREEXISTING.md` |

> **Pemilik wajib ditetapkan sebelum P8.** Semua kolom pemilik masih kosong. Tanpa penanggung jawab,
> video dan slide deck — dua deliverable dengan bobot skor terbesar setelah produk — berisiko tidak
> dikerjakan. Tetapkan bersamaan dengan pembagian lapisan di awal P1 (`docs/PHASES.md`).

---

## Isi video (1–4 menit)

Aturan lomba: harus menunjukkan **main workflow**, bagaimana agent menyelesaikan challenge, fitur
kunci, dan bagaimana Zetaris + Meterless diintegrasikan.

> **Catatan sumber:** struktur di bawah mengikuti §6.1 dan §6.2 di `docs/RULES.md` (terverifikasi dari
> tangkapan layar halaman resmi). Rencana isi tetap keputusan tim.

Struktur yang diusulkan:

| Waktu | Isi |
|---|---|
| 0:00–0:20 | Masalah: data kerja tersebar, asisten chat tidak bisa menjangkau |
| 0:20–0:40 | Weebo: satu agent, semua permukaan, BYOK, gratis untuk mulai |
| 0:40–2:00 | Workflow utama: pertanyaan → agent mencari data via Zetaris → memory dipakai → jawaban + sumber |
| 2:00–2:40 | Bukti integrasi: Meterless H-MEM (memori lintas sesi), Zetaris (query nyata), NVIDIA (model) |
| 2:40–3:10 | Tugas terjadwal berjalan tanpa disuruh (jika P6 selesai) |
| 3:10–3:30 | Tampilan di ponsel dan desktop, lalu penutup |

Jangan menampilkan fitur yang belum jalan. Juri akan mencocokkan video dengan repo.

**Sumber narasi masalah:** `docs/PRD.md` §1 dan §2.1. Jangan menyusun ulang dari nol — bagian 0:00–0:40
sudah ditulis di sana, dan penyimpangan dari PRD membuat slide dan video bercerita berbeda.

---

## Isi slide deck

Nomor 1–2 di bawah **wajib diambil dari `docs/PRD.md`**, bukan dikarang saat menyusun slide. Ini
bagian yang dinilai pada Impact (30 poin, kriteria terbesar).

| # | Slide | Sumber |
|---|---|---|
| 1 | Masalah dan siapa yang terdampak | `docs/PRD.md` §1, §2.1 |
| 2 | Solusi dan posisi produk | `docs/PRD.md` §2, §4 |
| 3 | Arsitektur dan alur agent | `docs/ARCHITECTURE.md` |
| 4 | Stack teknis | `docs/ARCHITECTURE.md`, `docs/DECISIONS.md` |
| 5 | Integrasi Zetaris — apa, di mana, bukti | `docs/SPONSORS.md` |
| 6 | Integrasi Meterless — apa, di mana, bukti | `docs/SPONSORS.md` |
| 7 | Di mana NVIDIA berkontribusi | `docs/SPONSORS.md` |
| 8 | Yang unik dari penggunaan sponsor technology | `docs/SPONSORS.md` |
| 9 | Visual produk (tangkapan layar nyata) | Aplikasi yang berjalan |
| 10 | Pengembangan selanjutnya | `docs/PRD.md` §4, `docs/PHASES.md` backlog |

---

## Audit sebelum submit

- [ ] Semua klaim di README sesuai kenyataan (tidak ada fitur yang diklaim jalan padahal belum)
- [ ] `docs/SPONSORS.md` berisi bukti nyata, bukan placeholder
- [ ] `PREEXISTING.md` sesuai riwayat commit
- [ ] Repo bisa di-clone dan dijalankan mengikuti README, diuji di mesin bersih
- [ ] Tidak ada secret di riwayat commit
- [ ] Lisensi MIT terdeteksi di halaman repo
- [ ] Video < 4 menit, publik, tanpa musik berhak cipta
- [ ] Slide deck selesai
- [ ] Track dipilih di platform
- [ ] Tim sudah dibentuk di platform dan terkunci
- [ ] Submission dikirim minimal 12 jam sebelum tenggat (tie-break §7.3 pakai timestamp)

---

## Kalimat deklarasi pre-existing (draf)

> Before the build window we created only repository scaffolding: documentation, architecture notes,
> decision records, and project governance files. All product code — the agent core, sponsor
> integrations, application surface, and landing page — was written during the build window.

Perbarui jika kenyataan berbeda. Jangan kirim klaim yang tidak sesuai riwayat commit.
