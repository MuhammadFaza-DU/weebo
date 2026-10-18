# Kerangka Fase

Fase adalah **gate hasil**, bukan durasi. Tidak ada timebox. Fase ditutup hanya jika deliverable dan
syarat lulusnya terpenuhi (lihat `AGENTS.md` §8).

Setiap fase punya file sendiri di `docs/phases/` berisi daftar task kecil (≤ 2 jam) dengan kriteria
selesai. Task dicentang satu per satu; agent mengeksekusi per task, bukan per fase.

---

## Ringkasan

| Fase | Deliverable | Syarat lulus | Bergantung pada |
|---|---|---|---|
| P1 Walking Skeleton | Satu alur tipis end-to-end | Bisa didemokan 30 detik | Akses Zetaris + NIM |
| P2 Agent Core | Loop, tool registry, policy, audit | Tool call tercatat dan bisa ditolak | P1 |
| P3 Memory & Reasoning | H-MEM, Markovian, jejak "kenapa" | Mengingat lintas sesi + menjelaskan sumber | P1 |
| P4 Design System | Token + komponen di canvas | HALT + approval eksplisit | — (bisa paralel) |
| P5 Surfaces | UI app responsif | Jalan di layar HP dan desktop | P4, P2, P3 |
| P6 Autonomy | Scheduler, channel, jalur model | Tugas berjalan tanpa disuruh | P2, P3 |
| P7 Landing Page | Astro site publik | Bisa dibuka publik, badge status akurat | — (bisa paralel) |
| P8 Submission | Video script, slide, README, audit | Semua deliverable lomba lengkap | P1–P7 |

P4 dan P7 boleh berjalan paralel oleh orang berbeda dan tidak memblokir spine.

---

## Protokol keluar fase (wajib, lima-limanya)

1. Deliverable bisa didemokan.
2. `CHECKPOINT.md` diperbarui.
3. Commit dibuat dan tag `stable-YYYY-MM-DD-vN` ditawarkan ke user.
4. Approval eksplisit user diminta dan diterima.
5. Laporan verifikasi disampaikan, termasuk apa yang **belum** terverifikasi.

Jangan memulai fase berikutnya sebelum kelima hal ini selesai.

---

## Prinsip memecah task

- Satu task = satu perubahan yang bisa diverifikasi sendiri.
- Ukuran maksimum ± 2 jam kerja.
- Setiap task menuliskan **kriteria selesai** yang objektif ("`npm test` hijau dan endpoint
  mengembalikan 200"), bukan subjektif ("terlihat bagus").
- Task yang tidak selesai dipindahkan ke backlog dengan alasan, bukan dihapus.

---

## Backlog lintas fase

Hal yang sengaja ditunda. Bukan dibuang.

| Item | Alasan ditunda |
|---|---|
| Pindah repo ke GitHub Organization | Diperlukan jika ingin membatasi siapa yang boleh dismiss review (repo personal ditolak API 422). URL git tetap sama. Pindahkan hanya jika benar-benar butuh |
| Desktop native — **Electron** | Tanpa Rust, shell atas UI yang sama. Fase pertama setelah submission (ADR-010) |
| APK Android — Capacitor | Butuh Android SDK; setelah submission |
| Gateway kuota gratis per IP | Stretch setelah spine; butuh Cloudflare Worker + pengujian kuota |
| Live demo URL (PWA ter-deploy) | Opsional; dikerjakan hanya jika ada sisa waktu |
| Cloud sync penyimpanan | Di luar scope lomba |
| Connector katalog luas | Setelah MCP + Zetaris stabil |
| Auto-generate skills | Risiko kualitas; setelah lomba |
