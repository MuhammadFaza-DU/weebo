# Design — Loop Penalaran Weebo (menggantikan alur linear)

**Tanggal:** 2026-10-20
**Status:** **Disetujui user 2026-10-20.** Menunggu implementasi di P2. Belum ada kode yang mengikuti dokumen ini.
**Menggantikan:** `docs/ARCHITECTURE.md` §3 (alur 9 langkah linear) — setelah disetujui.
**Prasyarat:** `docs/phases/P0-preflight.md` T0.8 sudah ditutup (ADR-015).

---

## 1. Kenapa dokumen ini ada

`docs/ARCHITECTURE.md` §3 mendefinisikan satu permintaan sebagai urutan linear:

```text
1 Scout Intent → 2 Memory recall → 3 Plan → 4 Tool selection → 5 Policy check
→ 6 Execute → 7 Verify → 8 Compose → 9 Write memory
```

Welcome Guide HackOS §3 menyebut bentuk itu secara eksplisit sebagai **desain lemah**:

> *"User input → Planner → Writer → Summarizer → Final answer. This is a pipeline, not an agent
> system."* … *"There are no feedback loops."* … *"Nothing shows how the system reached its output."*

Yang diminta sebagai gantinya:

> *"Iterative loops such as: Planner ↔ Executor ↔ Evaluator"*, *"Agents that critique or validate
> outputs"*, *"Branching, retries, escalation, and recovery"*, *"Logs or traces showing how the system
> reasoned and refined its work."*

Penilaian yang terdampak: **Technical (20)**, **Innovation (15)**, **Demo (15)** — dan kecocokan dengan
Track 03 itu sendiri ("turn data, knowledge, memory, and reasoning into reliable decisions").

Sumber mentah: `.cache/platform-notes/01-welcome-guide.md` §3 (di luar repo, sengaja).

---

## 2. Tujuan

1. Mengubah alur satu permintaan dari **garis lurus** menjadi **loop berbatas** yang bisa gagal,
   mencoba lagi, dan berhenti dengan jujur.
2. Membuat perilaku saat data tidak tersedia **eksplisit dan terbedakan** — bukan satu jawaban "tidak
   tahu" untuk semua kegagalan.
3. Membuat jejak penalaran terlihat sebagai **bukti yang bisa diperiksa**, bukan log mentah.
4. Menjaga K2 (fabrikasi = 0) sebagai batas keras, bukan target.

## 3. Non-goals

- **Bukan multi-agent framework.** Tidak ada orkestrasi agen otonom yang saling mendelegasikan bebas.
  Alasan di §7.
- **Bukan penambahan fitur produk.** Ini perubahan bentuk inti; tidak menambah surface baru.
- **Bukan penulisan ulang `packages/core` dari nol.** Yang berubah adalah orkestrasi di dalam
  `runTurn`, bukan seluruh modul.
- **Bukan janji akurasi.** Dokumen ini mengubah **cara** agent bekerja, bukan mengklaim K1 naik.
  K1 tetap target `provisional` sampai diukur (ADR-015).

## 4. Anti-goals — ini yang membuat pekerjaan dinyatakan gagal

| Anti-goal | Kenapa fatal |
|---|---|
| Loop tanpa batas atas | Satu pertanyaan bisa menghabiskan seluruh anggaran sesi; user lain tidak kebagian |
| "Tidak tahu" generik untuk semua kegagalan | Menghapus informasi yang justru paling berguna bagi user (tingkat 2 dan 3) |
| Angka hasil analisis tampil tanpa label | Itu fabrikasi. Melanggar K2 dan aturan kejujuran `AGENTS.md` §3 |
| Bertanya ke user padahal tidak rancu | Agent jadi merepotkan; user kehilangan kepercayaan |
| Menebak padahal rancu | Bibit fabrikasi. Melanggar aturan user: "dilarang asumsi" |
| Trace yang hanya bisa dibaca mesin | Juri dan user tidak bisa memeriksa; nilainya nol untuk Demo |

---

## 5. Tangga pengetahuan — keputusan user

Setiap pertanyaan berakhir di **tepat satu** dari empat tingkat. Tingkat ditentukan oleh Evaluator,
bukan oleh Executor.

| Tingkat | Keadaan | Bentuk jawaban | Boleh mengutip sumber? |
|---|---|---|---|
| **L0** | Pertanyaan tidak menyentuh data sama sekali (sapaan, "kamu bisa apa", konfigurasi) | Jawab langsung. Loop evidence **tidak dijalankan** | **Tidak** — tidak ada data yang dikutip |
| **L1** | Data ketemu dan cukup | Jawab + sitasi sumber nyata | **Ya**, wajib |
| **L2** | Data ada, tapi butuh akses yang tidak dimiliki agent (login, izin, kredensial) | Sebut **di mana** datanya dan **apa** yang dibutuhkan. User yang bertindak | Boleh menyebut lokasi, **tidak** boleh mengarang isi |
| **L3** | Tidak ada di sumber ini, tapi ada petunjuk ke tempat lain | Sarankan tempat lain — **hanya jika dasar sarannya bisa dihitung** (mis. tabel lain punya kolom yang sama). Tanpa dasar → turun ke L4 | Menyebut tempat, bukan data |
| **L4** | Mentok setelah usaha maksimal | Dua pilihan sah: **(a)** menyatakan tidak punya datanya, atau **(b)** analisis mendalam **berlabel** | **Tidak.** Tidak boleh ada sitasi, tidak boleh ada angka yang disajikan sebagai fakta |

**L0 ada karena tangga tanpa L0 tidak total.** Tanpa L0, sapaan sederhana harus dipaksa menjadi "L1
cukup" (padahal L1 mewajibkan sitasi) atau "L4 mentok" (padahal tidak ada yang dicari). Keduanya
bohong. Ini **keputusan saya sebagai pembangun**, dicatat terbuka.

### 5.0 L2 bergantung pada hal yang belum diketahui

L2 mensyaratkan agent bisa membedakan *"tabel ada tapi izin kurang"* dari *"tabel tidak ada"*. Apakah
permukaan Zetaris mengembalikan error yang bisa dibedakan untuk itu **belum diketahui** — Zetaris belum
didaftarkan (`CHECKPOINT.md`), statusnya `belum terverifikasi`.

Rencana cadangan bila Zetaris **tidak** bisa membedakan: turunkan L2 dari kombinasi
`zetaris.schema` berhasil (tabel/kolom ada) + query gagal. Itu pendekatan yang lebih lemah tetapi
masih jujur. Keputusan final menunggu hasil **T0.2/T0.3**. **Keputusan saya sebagai pembangun**,
bergantung pada temuan P0.

### 5.1 Batas keras L4

Ini yang membedakan analisis dari fabrikasi. Analisis L4:

- **wajib** memakai penanda eksplisit (mis. `"estimate"`, `"analisis, bukan data"`);
- **wajib** menyebut dasar perhitungannya (mis. "dari pola Mei 3,1% dan Juni 3,4%");
- **dilarang** mengisi field sitasi;
- **dilarang** menyatakan angka sebagai hasil query.

Rubrik K2 (`docs/PRD.md` §3.2) menyatakan gagal bila jawaban *"mengutip sumber, atau menyatakan angka
sebagai fakta"*. Karena itu L4 **secara struktural** tidak boleh punya field sitasi — bukan sekadar
dilarang oleh instruksi prompt. Struktur yang memaksa, bukan niat baik.

---

## 6. Loop — bentuk yang diusulkan

### 6.1 Bentuk

```text
runTurn(input)
  ├─ Scout Intent + Memory recall        (sekali, di awal)
  └─ EVIDENCE LOOP  (maks N iterasi)     ← ini yang menggantikan garis lurus
       Plan → Execute → Evaluate
                ↑          │
                └──────────┘  verdict: perlu iterasi?
       berhenti bila: cukup | butuh-akses | mentok | anggaran habis
  └─ Compose (bentuk jawaban mengikuti tingkat L1..L4)
  └─ Write memory + Trace
```

Evaluator menghasilkan **verdict tertutup**, bukan teks bebas:

```ts
type Verdict =
  | { kind: "no_evidence_needed" }                            // L0 — loop tidak jalan
  | { kind: "sufficient" }                                    // L1
  | { kind: "needs_access"; where: string; what: string }      // L2
  | { kind: "found_elsewhere"; basis: string }                 // L3
  | { kind: "exhausted"; reason: string }                      // L4(a)
  | { kind: "budget_exhausted"; budget: BudgetKind }           // → L4(a), TIDAK PERNAH L4(b)
  | { kind: "retry"; gap: string };                            // → iterasi berikutnya

type BudgetKind = "iterations" | "tokens" | "time" | "session";
```

`retry` adalah satu-satunya verdict yang memutar loop. Sisanya mengakhiri loop.

### 6.1a Anggaran habis tidak boleh menjadi analisis berlabel

Builder check menemukan celah nyata: §6.1 menyebut "anggaran habis" sebagai kondisi berhenti, tetapi
`Verdict` tidak punya case untuk itu. Kalau dibiarkan, jalur termudah adalah menjadikannya L4(b) — dan
itu berarti **tekanan anggaran memproduksi tebakan berlabel**, persis yang K2 batasi.

**Keputusan saya sebagai pembangun:** `budget_exhausted` **selalu** memetakan ke **L4(a)** — menyatakan
tidak punya data, disertai alasan anggaran yang disebut apa adanya. Tidak pernah ke L4(b).

Definisi **sesi** = **satu percakapan**, ditegakkan di runtime dan di-reset saat percakapan baru dibuat.
Bukan per proses, bukan per hari. Alasan: percakapan adalah unit yang dipahami user, dan runtime sudah
memegang state percakapan (ADR-011).

Bila anggaran **sesi** habis, Weebo berhenti melayani pertanyaan baru dan mengatakannya terus terang —
ia **tidak** turun ke mode menebak, dan **tidak** diam-diam mengurangi kualitas.

### 6.2 Kenapa `Verdict` harus tertutup

Kalau Evaluator bebas menulis teks, tiga hal rusak: loop tidak punya kondisi berhenti yang bisa diuji,
Compose harus menebak maksud Evaluator, dan trace tidak bisa diverifikasi otomatis (K3). Dengan union
tertutup, setiap verdict bisa diuji unit test.

### 6.3 Definisi "iterasi" — dan kenapa ini menentukan segalanya

Builder check menemukan bahwa tanpa definisi ini, **seperlima golden set mustahil dijawab karena alasan
anggaran, bukan alasan penalaran**. Lima pertanyaan lintas-tabel di `docs/PRD.md` §3.2 secara struktural
butuh minimal: baca skema + dua query = **tiga panggilan tool**.

**Keputusan saya sebagai pembangun:**

| Istilah | Definisi |
|---|---|
| **Iterasi** | Satu putaran `Plan → Execute → Evaluate`. Satu iterasi boleh memuat **beberapa** panggilan tool |
| **Panggilan tool** | Satu eksekusi tool (mis. satu query Zetaris) |
| **Anggaran iterasi** | Maksimum putaran loop: **3** |
| **Anggaran tool per iterasi** | Maksimum **5** panggilan tool dalam satu iterasi |

Dengan pemisahan ini, pertanyaan lintas-tabel bisa diselesaikan dalam **satu** iterasi berisi tiga tool
call, dan loop masih punya dua iterasi cadangan untuk koreksi arah. Kalau "iterasi" dihitung sebagai
satu tool call, golden set gagal secara struktural — dan itu cacat desain, bukan temuan eval.

| Anggaran | Nilai usulan | Alasan |
|---|---|---|
| Iterasi evidence | 3 | Satu koreksi arah + satu percobaan ulang |
| Tool per iterasi | 5 | Cukup untuk skema + join dua tabel + verifikasi |
| Token per pertanyaan | konfigurabel | Rate limit NVIDIA NIM (~40 RPM) adalah batas nyata |
| Waktu per pertanyaan | konfigurabel | Menjaga AC US-01 (< 30 detik pada dataset demo) |

Angka 3 dan 5 adalah **usulan saya, bukan keputusan user.** Keduanya bisa diganti tanpa mengubah bentuk
loop. Yang **tidak** bisa diganti tanpa merusak desain: pemisahan iterasi dari panggilan tool.

### 6.3a Klarifikasi mengakhiri giliran

Builder check juga menemukan ini tidak terjawab, padahal ia menentukan bentuk protokol P2.

**Keputusan saya sebagai pembangun:** pertanyaan klarifikasi (§8) **mengakhiri giliran**. `runTurn`
kembali dengan status `awaiting_clarification` beserta pertanyaannya; client yang meneruskan jawaban user
memanggil `runTurn` lagi dengan referensi giliran tersebut.

Alasannya: alternatifnya adalah memblokir di dalam satu giliran, yang mustahil untuk client yang
terputus dan untuk runtime headless (ADR-011 mewajibkan runtime bisa jalan tanpa client).

**Konsekuensi yang harus dihormati — ini penting:**

| Konteks | Perilaku klarifikasi |
|---|---|
| Interaktif (CLI, PWA) | Bertanya seperti biasa |
| **Runtime headless** (P6 scheduler) | **Tidak boleh bertanya.** Rancu → berhenti dengan L4(a) + alasan "butuh keputusan manusia" |
| **Runner eval** (`npm run eval`) | **Klarifikasi dimatikan.** Rancu → L4(a), dicatat di hasil |

Untuk runner eval, ada dua pilihan dan keduanya harus diputuskan **sebelum golden set dibekukan**
(ADR-015): (a) matikan klarifikasi sepenuhnya, atau (b) tambahkan field `clarification_answer` opsional
di setiap entri golden. Saya mengusulkan **(a) untuk smoke P1, lalu (b) untuk run penuh P3** — supaya
pertanyaan yang memang dirancang ambigu bisa diuji secara deterministik.

### 6.4 Dua anggaran yang berbeda

Ini menjawab tegangan yang muncul saat brainstorming:

| Anggaran | Aturan | Sumber |
|---|---|---|
| **Per pertanyaan** | Maksimal, tidak malas. Cari sampai habis sebelum menyerah | Keputusan user |
| **Per sesi** | Dibagi. Jangan habis di satu pertanyaan yang mentok | Keputusan user |

Konsekuensi teknis: anggaran sesi harus **ditegakkan di runtime**, bukan diserahkan ke prompt. Kalau
hanya berupa instruksi prompt, agent yang gigih akan tetap menghabiskannya.

---

## 6.5 Kapan dibangun — P1 atau P2?

Builder check menanyakan apakah P1 membangun versi minimal, atau tetap linear lalu dibongkar di P2.

**Keputusan saya sebagai pembangun, berdasarkan dokumen yang sudah ada:** P1 membangun **versi minimal
tangga pengetahuan**, yaitu hanya **L0, L1, dan L4(a)** — tanpa loop penuh, tanpa L2/L3, tanpa L4(b).

Alasannya bukan selera. `docs/PRD.md` §1.3 menetapkan **K2 diukur di P1** (smoke 5 pertanyaan). K2
adalah *"dari pertanyaan yang datanya tidak ada, jumlah jawaban yang mengarang sumber atau angka"*. Untuk
mengukurnya, agent harus bisa **membedakan** "tidak ada data" dari "ada data". Tanpa pemisahan L1/L4(a)
di P1, K2 tidak bisa diukur sama sekali — dan smoke P1 kehilangan satu-satunya tujuannya.

| Fase | Yang dibangun | Kenapa |
|---|---|---|
| **P1** | L0, L1, L4(a). Jalur lurus, tanpa loop. | Supaya K2 bisa diukur di smoke P1 |
| **P2** | Loop penuh + L2, L3, L4(b) + trace terstruktur | Ini fase agent core |
| **P3** | Memori masuk ke recall; eval 30 penuh + baseline | Sesuai ADR-015 |

Biaya tambahan P1: kecil. Pemisahan L1/L4(a) hanya menambah satu keputusan di akhir `runTurn` — bukan
loop. Jadi P1 tetap "thin slice", dan P2 tidak perlu membongkar apa pun, hanya menambahkan.

## 7. Single loop sebagai default, fan-out sebagai opsi — keputusan user

Welcome Guide §3 menyebut *"Agents that delegate tasks dynamically"* sebagai ciri desain kuat.

**Keputusan user (2026-10-20):** *"tergantung kemauan user, tapi selalu disarankan ke single loop
dengan peran terpisah."*

Artinya: **single loop adalah default dan rekomendasi**, tetapi fan-out tersedia sebagai pilihan yang
diaktifkan user. Ini lebih baik daripada menolak multi-agent sepenuhnya, karena Welcome Guide memang
menghargai delegasi.

| Pertimbangan | Single loop + peran (default) | Fan-out (opt-in) |
|---|---|---|
| Kriteria Welcome Guide §3 | Terpenuhi: loop, critique, retry, branching, trace | Terpenuhi, delegasi lebih eksplisit |
| Biaya token | 1× per iterasi | 2–4× per iterasi |
| Rate limit NIM ~40 RPM | Aman | Berisiko 429 di tengah demo |
| Waktu P2 | ±1 hari | ±2–3 hari |

### 7.1 Yang dibangun di P2, dan yang ditunda

Ini pemisahan penting antara **menyiapkan jalan** dan **membangun jalurnya**. Aturan penundaan:
`AGENTS.md` §8.1 (berbasis dependensi, bukan tanggal).

| Fase | Yang dibangun |
|---|---|
| **P2** | Single loop penuh + **seam** `ExecutionStrategy` di `packages/core`. Hanya strategi `"single"` yang diimplementasikan |
| **Backlog** | Strategi `"fanout"`. Dependensi: **P2 selesai + single loop terbukti di eval** |

Alasannya: seam berbiaya hampir nol (satu interface + satu parameter), sedangkan fan-out berbiaya 1–2
hari tambahan. Membangun seam sekarang mencegah penulisan ulang nanti; membangun fan-out sekarang
mempertaruhkan P5–P8.

```ts
type ExecutionStrategy = "single" | "fanout";   // P2: hanya "single"
```

Peran (Planner / Executor / Evaluator) tetap **terpisah dan terlihat di trace** pada kedua strategi.
Juri melihat loop dan jejaknya, bukan jumlah proses.

---

## 8. Terbuka di tengah jalan — keputusan user

Kalau ada temuan sebagian, Weebo menyampaikannya dan menawarkan arah, bukan diam sampai akhir:

> *"Saya dapat Mei dan Juni, Juli tidak ada di sumber ini. Lanjut cari di sumber lain, atau jawab
> dengan data yang ada dulu?"*

Empat aturan pendamping (usulan saya + satu aturan user):

| # | Aturan | Asal |
|---|---|---|
| 1 | Bertanya hanya kalau arahnya **benar-benar bercabang** | Usulan saya |
| 2 | **Dilarang berasumsi. Kalau rancu, wajib bertanya** | **Keputusan user** |
| 3 | Tidak bertanya dua kali soal hal yang sama; jawaban diingat lintas sesi lewat H-MEM | Usulan saya |
| 4 | Satu pertanyaan per giliran, maksimal | Usulan saya |

### 8.1 Batas antara "rancu" dan "ada pilihan"

Ini penyelesaian tegangan antara aturan 1 dan aturan 2 — **dinyatakan eksplisit supaya tidak jadi
asumsi diam-diam**:

| Keadaan | Definisi | Tindakan |
|---|---|---|
| **Rancu** | Dua atau lebih tafsir menghasilkan **hasil berbeda**, dan salah pilih berarti jawabannya salah | **Wajib bertanya. Berhenti. Dilarang menebak** |
| **Bukan rancu** | Ada pilihan, tapi semua cabang hasilnya sama atau bisa dibalik tanpa biaya | Pilih sendiri, sebutkan pilihannya di trace |

Default-yang-jalan **hanya** berlaku untuk kategori kedua. Pada kategori pertama Weebo menunggu
jawaban; ia tidak mengisi kekosongan dengan tebakan.

Alasannya bukan sekadar kepatuhan: **menebak saat rancu adalah asal-mula fabrikasi**, dan K2 tidak
boleh dikalibrasi turun (`docs/PRD.md` §1.3).

---

## 9. Trace — bukti, bukan log

Trace harus bisa dibaca **juri dan user**, bukan hanya mesin. Isi minimum per giliran:

| Field | Isi | Untuk KPI |
|---|---|---|
| `iterations[]` | Setiap putaran loop: rencana, tool, argumen, ringkasan hasil | K3 |
| `verdicts[]` | Verdict Evaluator tiap iterasi + alasannya | K3, penjelasan "kenapa" |
| `sources[]` | Sumber yang dikutip (kosong pada L4) | K1, K2 |
| `level` | L1 / L2 / L3 / L4 | K2 |
| `budget_used` | Iterasi, token, waktu terpakai | anggaran sesi |
| `clarifications[]` | Pertanyaan yang diajukan ke user + jawabannya | §8 |

K3 (kelengkapan jejak = 100%) diperiksa otomatis dari field ini.

---

## 10. Batasan dari keputusan yang sudah ada

Dokumen ini tidak boleh melanggar:

- **ADR-011** — `packages/core` tetap isomorphic; tidak ada API Node-only.
- **ADR-013** — CLI boleh memanggil core langsung **hanya di P1**; berakhir di P2.
- **ADR-012** — `packages/core` tidak mengimpor `vendor/` langsung; lewat `MemoryPort`.
- **ADR-004** — rate limit NIM adalah batas nyata, bukan asumsi.
- **ADR-015** — K2 = 0 tidak boleh dikalibrasi turun; L4 wajib berlabel.
- **ADR-016** — transport tidak berubah karena dokumen ini.
- **`AGENTS.md` §5** — utamakan gratis; biaya per pertanyaan harus terukur.

---

## 11. Yang diserahkan ke pembangun

Saya **tidak** memutuskan hal-hal ini; pembangun boleh memilih:

- Nama modul dan lokasi file di dalam `packages/core`.
- Bentuk konkret skema `Verdict` di kode (union di §6.1 adalah bentuk logis, bukan nama final).
- Cara menyimpan trace (SQLite vs JSONL) — masih terbuka di `docs/ARCHITECTURE.md` §9.
- Strategi caching respons untuk menghadapi 429.
- Apakah Evaluator memakai model yang sama dengan Executor atau model lebih kecil (hemat biaya).

## 12. Pertanyaan terbuka — **nol**

Delapan temuan builder check sudah selesai semuanya. Q1 diputuskan user, Q2 diselesaikan dengan membaca
ulang rubrik yang sudah ada (tidak perlu amandemen).

### Q1 — Single loop atau multi-agent? → **TERJAWAB (keputusan user)**

*"Tergantung kemauan user, tapi selalu disarankan ke single loop dengan peran terpisah."*
Single loop = default. Fan-out = opsi opt-in, dibangun di backlog. Detail: §7.

### Q2 — Apakah L4(b) lulus K2? → **TERJAWAB: ya, dan rubrik tidak perlu diubah**

Saya awalnya mengira ini butuh amandemen rubrik. Setelah membaca ulang rubrik K2 kata per kata,
ternyata **tidak**.

Rubrik (`docs/PRD.md` §3.2) punya dua kondisi, dan keduanya harus dipenuhi untuk gagal:

| Kondisi | Bunyi rubrik | Status pada L4(b) yang benar |
|---|---|---|
| Gagal #1 | *"mengutip sumber"* | **Tidak terjadi** — L4 dilarang punya sitasi secara struktural (§5.1) |
| Gagal #2 | *"menyatakan angka sebagai fakta"* | **Tidak terjadi** — angka wajib berlabel estimasi |

Sementara kondisi **lulus** berbunyi *"menyatakan tidak punya datanya, dan tidak mengutip sumber apa
pun"*. L4(b) memenuhi keduanya — asalkan ia **selalu** memuat pernyataan tidak-punya-data.

**Keputusan saya sebagai pembangun:** L4(b) **lulus K2**, dengan tiga syarat struktural yang wajib:

1. Memuat pernyataan eksplisit bahwa data tidak tersedia.
2. Angka apa pun berlabel `estimate` / "analisis, bukan data".
3. Field sitasi kosong.

Ketiganya **ditegakkan di tipe**, bukan di prompt. Jawaban L4(b) yang tidak memuat poin 1 otomatis
ditolak oleh `Compose` sebelum keluar — jadi tidak mungkin lolos ke penilai.

### 12.1 Risiko yang tetap ada, dan cara menutupnya

**Risiko:** kalau L4(b) sering muncul, K2 bisa terlihat sempurna secara artifisial. Juri yang ketat bisa
membacanya sebagai "agent menjawab semua, tidak pernah mengaku tidak tahu".

**Mitigasi — aturan pelaporan, bukan perubahan rubrik:** hasil eval **wajib** melaporkan jumlah
jawaban per tingkat, terpisah dari skor K2:

```text
k2_violations: 0
level_breakdown: { L0: 0, L1: 9, L2: 1, L3: 2, L4a: 8, L4b: 2, budget: 0 }
```

Dengan begitu, K2 = 0 **dan** pembaca bisa melihat bahwa 2 dari 10 pertanyaan tak-terjawab dijawab
dengan analisis berlabel, bukan abstain murni. Angka jujur, tanpa menyembunyikan apa pun.

Aturan ini masuk ke field wajib file hasil eval (ADR-015) sebagai tambahan `level_breakdown`.

---

## 13. Dampak ke dokumen lain bila disetujui

| Dokumen | Perubahan |
|---|---|
| `docs/ARCHITECTURE.md` §3 | Alur linear → loop berbatas |
| `docs/DECISIONS.md` | ADR baru untuk bentuk loop + tangga pengetahuan |
| `docs/PRD.md` §3.1 | `zetaris.query` perlu field tingkat/verdict |
| `docs/PHASES.md` P2 | Syarat lulus perlu menyebut loop + trace terbaca |
| `docs/phases/P0-preflight.md` | Tidak berubah — ini pekerjaan P2, bukan P0 |
| `docs/SUBMISSION.md` | Slide "agent workflow" memakai bentuk baru |

---

## 14. Riwayat keputusan dalam brainstorming ini

Supaya jelas mana yang kamu putuskan dan mana usulan saya:

| # | Hal | Siapa | Isi |
|---|---|---|---|
| 1 | Kapan berhenti | **User** | Saat info butuh manusia/login |
| 2 | L2 vs L3 berbeda | **User** | L2 masih ada harapan; L3 beri saran tempat lain |
| 3 | Saran di L3 harus berdasar perhitungan | **User** | Tanpa dasar → jangan diteruskan |
| 4 | Jangan teruskan kalau mentok | **User** | "cuma buat pekerjaan lain ga selesai" |
| 5 | L4 boleh berasumsi | **User** | Tapi harus berdasarkan perhitungan matang, dan diberi label |
| 6 | Usaha maksimal, jangan malas | **User** | Berlaku untuk agent di repo ini |
| 7 | Maksimal tapi tidak memaksa | **User** | Kalau mentok: jujur, lalu analisis mendalam |
| 8 | Terbuka di tengah jalan | **User** | Sampaikan temuan sebagian + tawarkan arah |
| 9 | Dilarang asumsi, rancu wajib tanya | **User** | Aturan dari `AGENTS.md` global, diterapkan ke produk |
| 10 | L0 ditambahkan | Pembangun (saya) | Tangga tanpa L0 tidak total |
| 11 | `budget_exhausted` → selalu L4(a) | Pembangun | Anggaran habis tidak boleh jadi tebakan berlabel |
| 12 | Sesi = satu percakapan | Pembangun | Unit yang dipahami user |
| 13 | Iterasi ≠ panggilan tool | Pembangun | Tanpa ini, 5 pertanyaan lintas-tabel mustahil dijawab |
| 14 | Klarifikasi mengakhiri giliran | Pembangun | Alternatifnya memblokir, mustahil untuk headless |
| 15 | P1 = L0/L1/L4(a) saja | Pembangun | K2 diukur di P1; tanpa pemisahan, K2 tak terukur |
| 16 | Batas iterasi 3, tool/iterasi 5 | Usulan saya | Belum diukur |
| 17 | Single loop = default, fan-out = opt-in di backlog | **User** | "tergantung kemauan user, disarankan single loop" |
| 18 | L4(b) lulus K2 tanpa amandemen rubrik | Pembangun | Syarat struktural 3 poin + `level_breakdown` di hasil |
| 19 | Empat aturan "tidak merepotkan" | Usulan saya | Kecuali #2 yang dari user |
