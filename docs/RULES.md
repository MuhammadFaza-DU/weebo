# Aturan Resmi Lomba — Transkripsi Terverifikasi

**Sumber:** tangkapan layar halaman resmi `hackathon.genai.works/event/open-agent-hackathon-2026`,
bagian "Official rules", diambil 2026-10-18.

**Status verifikasi:** teks di bawah adalah transkripsi dari tangkapan layar. Halaman resmi tetap
menjadi sumber otoritatif jika ada perubahan — §10.1 menyatakan penyelenggara boleh mengubah jadwal
dan perubahan diumumkan di halaman itu dan Discord.

**Kenapa file ini ada:** sebelumnya tiga kutipan aturan dipakai tanpa bisa diverifikasi. Sekarang
terverifikasi. Jangan mengutip aturan dari sumber sekunder (artikel, ringkasan AI, situs agregator) —
beberapa di antaranya memuat klaim yang salah.

---

## 01 Eligibility

- **1.1** Open worldwide to anyone aged 16 or older at the start of the build window.
- **1.2** Employees of the organizer and of judging sponsors may participate but are not eligible for
  cash prizes.
- **1.3** One account per participant. Duplicate accounts disqualify the whole team.

## 02 Teams

- **2.1** Teams of one to five people. Solo entries compete in the same pool as teams.
- **2.2** Team composition locks when your first submission is created; before that you may join,
  leave or merge freely.
- **2.3** A participant may belong to exactly one team. Mentors may advise any number of teams.

## 03 Tracks

- **3.1** There are three challenge tracks plus the Wildcard [Tinkerer] bonus track.
- **3.2** Every submission selects exactly one primary track, which determines the judging panel and
  the prizes it competes for.
- **3.3** You may change track any time before the submission deadline from your team workspace.
- **3.4** Cross-track relevance is welcome but is not scored twice.

## 04 Build window

- **4.1** Building starts 22 October 2026 at 00:00 UTC and ends 27 October 2026 at 23:45 UTC.
- **4.2** Work committed before the window opens is not eligible, except for clearly declared
  pre-existing components.
- **4.3** Time zones do not extend the window; all deadlines are UTC.

## 05 What you can use

- **5.1** Every submission must integrate Zetaris and Meterless, and teams must use Cursor for
  development.
- **5.2** Integrate NVIDIA technology wherever it contributes to your project, workflow or use case.
- **5.3** Any language, framework, model or cloud, including closed-source APIs and sponsor credits.
- **5.4** Pre-existing open-source libraries are fine. Pre-existing product code must be declared in
  the submission form.
- **5.5** Generated code is allowed and expected, you own the result and are accountable for it.

## 06 Submission requirements

- **6.1** A demo video of 1-4 minutes that shows the main workflow, how the agent solves the selected
  challenge, its key features, and how Zetaris and Meterless are integrated.
- **6.2** A slide deck covering the problem and target users, the solution, the agent workflow or
  architecture, the technical stack, how Zetaris and Meterless were used, what was unique about your
  use of the sponsor technologies, product visuals, and future enhancements.
- **6.3** A GitHub repository with all source code and a README covering setup, usage and
  dependencies. If your agents run in Google Colab, include the Colab links.
- **6.4** A clear explanation of how Zetaris and Meterless were integrated, how Cursor was used during
  development, where NVIDIA technology contributes, and what was unique about your use of the sponsor
  technologies.

## 07 Judging

- **7.1** Scoring out of 100: Impact 30, Technical 20, Innovation 15, Demo 15, Product & UX 10,
  Sponsor tech 10.
- **7.2** Each submission is reviewed by at least three judges.
- **7.3** Ties are resolved on the Impact score, then on submission timestamp.

## 08 Prizes

- **8.1** Up to $20,000 in total prize value: $13,000 in cash prizes and $7,000 in in-kind rewards for
  selected winners.
- **8.2** Cash prizes per track (1st / 2nd / 3rd): Solving Fragmented Intelligence $1,600 / $1,200 /
  $900; The Agent That Can Explain Why $1,600 / $1,200 / $900; Reasoning Architecture $1,500 / $1,200
  / $900; Wildcard [Tinkerer] $1,000 / $600 / $400.
- **8.3** In-kind rewards: Best use of NVIDIA Nemotron — NVIDIA DGX Spark AI Supercomputer (Founder's
  Edition), $4,699; Best use of Cursor-built product — SpaceX Cursor API credits, $2,301.
- **8.4** Cash prizes are paid by bank transfer within 30 days of the results announcement.
- **8.5** Cash prizes are split equally among team members unless the team submits a different split
  in writing.
- **8.6** Taxes and any local charges are the recipient's responsibility.

## 09 Intellectual property

- **9.1** You keep all rights to what you build. Nothing here transfers ownership to the organizer or
  sponsors.
- **9.2** By submitting you grant the organizer a license to show your demo, screenshots and
  description in event coverage.
- **9.3** Sponsor-track submissions grant that sponsor the same non-exclusive promotional license.

## 10 Schedule & changes

- **10.1** The organizer may adjust the schedule for technical reasons; changes are announced on this
  page and in Discord.
- **10.2** Disqualification decisions are final and are communicated with a reason to the team lead.
- **10.3** Questions go to `hackathons@genai.works` — expect a reply within one working day.

---

## Yang mengikat kita, diringkas

| Kewajiban | Section | Status di repo ini |
|---|---|---|
| Integrasi Zetaris | 5.1, 6.1, 6.2, 6.4 | Wajib — **belum diimplementasikan** |
| Integrasi Meterless | 5.1, 6.1, 6.2, 6.4 | Wajib — `vendor/hmem` sudah di-vendor, **belum diintegrasikan ke kode** |
| Memakai Cursor selama pengembangan | 5.1, 6.4 | Wajib — lihat catatan risiko di bawah |
| NVIDIA di tempat yang memberi nilai | 5.2 | Dianjurkan kuat — dinilai di Sponsor tech (10 poin) |
| Video 1–4 menit | 6.1 | Wajib |
| Slide deck | 6.2 | Wajib |
| Repo + README (setup, usage, dependencies) | 6.3 | Wajib |
| Penjelasan integrasi + pemakaian Cursor | 6.4 | Wajib |
| Deklarasi pre-existing | 4.2, 5.4 | Wajib — `PREEXISTING.md` |
| Satu track primer | 3.2 | **Belum dipilih** — bisa diganti sampai tenggat |

## Konsekuensi strategis yang wajib diingat

1. **Tie-break pakai timestamp (7.3).** Jika Impact sama, yang submit lebih awal menang. **Submit jauh
   sebelum tenggat**, jangan di menit terakhir.
2. **Track bisa diganti sampai deadline (3.3).** Pilihan track tidak mengunci kita selamanya — pilih
   saat tahu bentuk akhir produknya.
3. **Kode hasil AI sah (5.5).** Tidak perlu menyembunyikan pemakaian AI; yang dinilai adalah hasilnya
   dan tanggung jawab kita atasnya.
4. **Pembagian hadiah default rata (8.5).** Jika tim ingin pembagian berbeda, **harus tertulis**.
5. **Boleh ganti bahasa/framework/model/cloud (5.3)** — tidak ada batasan stack selain tiga kewajiban
   di 5.1.
6. **Jangan mencoba main di dua track (3.4).** Cross-track tidak dinilai dua kali.

## Risiko kepatuhan yang masih terbuka

**Pemakaian Cursor (§5.1, §6.4).** Aturan menyebut *"teams must use Cursor for development"*, dan
§6.4 meminta penjelasan *"how Cursor was used during development"*.

Posisi tim saat ini: Cursor dipakai untuk **review**, bukan menulis kode (`AGENTS.md` §20). Ini
defensibel — review adalah bagian dari pengembangan — tetapi lebih lemah daripada memakai Cursor untuk
menulis kode.

Mitigasi yang tersedia:

- Gunakan Cursor untuk sebagian pekerjaan nyata (refactor, perbaikan bug, penulisan satu modul), lalu
  catat di `docs/CURSOR-LOG.md`. Klaim jadi lebih kuat.
- Atau, jika tetap review-only, jelaskan secara eksplisit di submission bagaimana Cursor dipakai, dan
  jangan mengklaim lebih dari kenyataan.

**Keputusan ini belum diambil. Perlu keputusan user sebelum submission.**
