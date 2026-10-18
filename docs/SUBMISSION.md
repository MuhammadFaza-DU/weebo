# Checklist Submission

Semua materi harus berbahasa **Inggris**. Dokumen ini boleh berbahasa Indonesia karena internal.

Tenggat: **27 Okt 2026 23:45 UTC**. Jangan menunggu sampai jam terakhir.

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

> **Catatan sumber:** teks aturan resmi berada di halaman event yang dirender sebagai accordion
> (§06 Submission requirements) dan tidak terbaca oleh fetch teks. Struktur di bawah adalah rencana
> tim, bukan kutipan aturan. **Simpan tangkapan layar §04–§07 ke `docs/rules/` sebelum submission**,
> lalu cocokkan struktur ini dengan teks aslinya.

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

---

## Isi slide deck

1. Masalah dan siapa yang terdampak
2. Solusi dan posisi produk
3. Arsitektur dan alur agent
4. Stack teknis
5. Integrasi Zetaris — apa, di mana, bukti
6. Integrasi Meterless — apa, di mana, bukti
7. Di mana NVIDIA berkontribusi
8. Yang unik dari penggunaan sponsor technology
9. Visual produk (tangkapan layar nyata)
10. Pengembangan selanjutnya

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
- [ ] Submission dikirim sebelum tenggat, bukan pada menit terakhir

---

## Kalimat deklarasi pre-existing (draf)

> Before the build window we created only repository scaffolding: documentation, architecture notes,
> decision records, and project governance files. All product code — the agent core, sponsor
> integrations, application surface, and landing page — was written during the build window.

Perbarui jika kenyataan berbeda. Jangan kirim klaim yang tidak sesuai riwayat commit.
