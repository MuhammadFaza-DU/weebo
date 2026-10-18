# PRD — Weebo

**Status:** v1, disusun sebelum build window dibuka. Dokumen kerja, berbahasa Indonesia.
Materi submission tetap wajib Bahasa Inggris (`AGENTS.md` §1.1).

**Untuk apa dokumen ini.** Menjawab **apa yang dibangun dan untuk siapa**. Tidak menjawab
bagaimana (itu `docs/PHASES.md` + file fase) dan tidak menjawab kenapa begitu (itu
`docs/DECISIONS.md`).

| Dokumen | Menjawab | Kalau bentrok |
|---|---|---|
| `docs/PRD.md` (ini) | Apa dan untuk siapa | PRD menang soal definisi user dan prioritas fitur |
| `docs/PHASES.md` + `docs/phases/` | Bagaimana dan kapan | File fase menang soal urutan dan pembagian task |
| `docs/DECISIONS.md` | Kenapa begitu | ADR menang soal pilihan teknis |
| `docs/RULES.md` | Kewajiban lomba | RULES menang atas semuanya soal kewajiban lomba |

**Larangan.** PRD tidak boleh memuat task, estimasi waktu, atau nama file kode. Kalau mulai memuat
itu, isinya sudah salah tempat.

---

## 1. Problem

Pertanyaan kerja tidak tinggal di dalam percakapan.

Seseorang perlu menjawab *"kenapa angka pengiriman bulan ini turun?"* — dan jawabannya tersebar di
tabel Postgres, satu spreadsheet, dan API partner yang tidak didokumentasikan. Untuk mendapatkannya
ia harus meminta ke tim data, menunggu, lalu menerima jawaban yang tidak bisa ia periksa sendiri.

Dua kerugian yang nyata:

1. **Waktu.** Satu pertanyaan lintas sistem berhenti menunggu manusia lain, bukan menunggu mesin.
2. **Kepercayaan.** Jawaban yang datang tanpa jejak sumber tidak bisa dipakai untuk mengambil
   keputusan. Yang tidak bisa diperiksa, tidak bisa dipertanggungjawabkan.

Agent percakapan tidak menyelesaikan ini. Ia bisa mengobrol, tetapi tidak bisa mencapai data yang
tersebar, tidak mengingat konteks antar sesi, dan tidak menjelaskan dari mana jawabannya berasal.

**Weebo menutup tiga celah itu sekaligus:** mencapai data, mengingat konteks, dan menjelaskan alasan.

## 2. User

Pembedaan ini mengikat dan sengaja dipisah, karena untuk produk open-source self-hosted
**yang memasang berbeda dari yang mendapat manfaat**.

### 2.1 User primer — knowledge worker di tim kecil

**Siapa:** analis, operations, atau product manager di tim 3–30 orang. Tidak menulis kode. Sudah
terbiasa dengan spreadsheet dan dashboard, tetapi tidak punya akses langsung ke database.

**Yang ia kerjakan:** menjawab pertanyaan operasional yang butuh data dari lebih dari satu sistem.

**Rasa sakitnya:** bergantung pada antrean tim data untuk pertanyaan yang seharusnya selesai dalam
hitungan menit. Dan ketika jawaban datang, ia tidak bisa memeriksa dari mana asalnya.

**Kenapa ia yang primer:** ia penerima manfaat sebenarnya, kerugiannya terukur, dan ia yang paling
membutuhkan penjelasan *"kenapa"* — sehingga selaras dengan track yang dipilih (Reasoning
Architecture).

### 2.2 Adopter — developer atau IT di tim yang sama

**Siapa:** orang teknis yang memasang dan merawat Weebo. Paham Node, API key, dan MCP.

**Yang ia pedulikan:** kendali. Data tidak keluar dari infrastruktur sendiri, model bisa diganti
(BYOK), setiap tool call tercatat, dan tidak ada tagihan per kursi.

**Kenapa ia bukan user primer:** ia bukan yang mendapat manfaat dari jawaban agent. Ia yang
memungkinkan user primer mendapatkannya. Kalau kita menyebut dia primer, narasi Impact jatuh ke
"alat untuk developer" — pasar yang sudah padat dan sulit dibedakan.

### 2.3 Bukan user

Sengaja dinyatakan supaya tidak menjadi scope creep:

- Tim enterprise dengan kebutuhan tata kelola formal (SOC 2, audit regulator).
- Pengguna yang ingin mengunggah data ke layanan hosted milik kami — Weebo self-hosted, tidak ada
  layanan hosted.
- Pengguna non-teknis yang tidak punya siapa pun untuk memasang runtime.

## 3. User story dan acceptance criteria

Prioritas: **Must** = submission tidak jujur tanpa ini. **Should** = sangat diinginkan.
**Could** = kalau waktu tersisa. Fase merujuk ke `docs/PHASES.md`.

### 3.1 Mencapai data (pilar *bertindak*)

| ID | Story | Prioritas | Fase |
|---|---|---|---|
| US-01 | Sebagai user primer, aku bertanya dalam bahasa natural dan mendapat jawaban yang menyebut sumber datanya | Must | P1 |
| US-02 | Sebagai user primer, aku bisa melihat langkah yang diambil agent sebelum menjawab | Must | P1, P2 |
| US-03 | Sebagai adopter, aku bisa membatasi tool apa yang boleh dipanggil agent | Must | P2 |
| US-04 | Sebagai adopter, aku bisa meninjau catatan setiap tool call yang terjadi | Must | P2 |
| US-05 | Sebagai user primer, aku bisa menghubungkan sumber data baru tanpa mengubah kode | Should | P2 |

**AC US-01**
- Jawaban mengutip minimal satu sumber nyata (nama tabel, file, atau endpoint).
- Jika sumber tidak dapat diakses, agent menyatakan tidak tahu. Tidak mengarang.
- Waktu jawab di bawah 30 detik pada dataset demo.

**AC US-02**
- Setiap jawaban menyertakan jejak: tool apa dipanggil, argumen apa, ringkasan hasil.
- Jejak dapat dibuka dan ditutup di PWA.
- Jejak tersimpan di audit log, bukan hanya ditampilkan lalu hilang.

**AC US-03**
- Tool yang tidak diizinkan ditolak sebelum dieksekusi, bukan setelah.
- Penolakan tercatat beserta alasannya.
- Tidak ada jalur yang melewati policy layer.

**AC US-04**
- Audit log memuat waktu, tool, argumen, hasil, dan keputusan allow/deny.
- Log dapat dibaca ulang setelah runtime restart.

**AC US-05**
- Connector baru dapat didaftarkan lewat konfigurasi, tanpa perubahan kode inti.
- Connector yang gagal terhubung melaporkan penyebabnya, bukan gagal diam-diam.

### 3.2 Mengingat (pilar *memory*)

| ID | Story | Prioritas | Fase |
|---|---|---|---|
| US-06 | Sebagai user primer, agent mengingat konteks dari sesi sebelumnya | Must | P3 |
| US-07 | Sebagai user primer, aku bisa melihat memori mana yang dipakai untuk sebuah jawaban | Must | P3 |
| US-08 | Sebagai user primer, aku bisa menghapus memori tertentu | Should | P3 |

**AC US-06**
- Fakta yang relevan dari sesi lama tersedia di sesi baru tanpa diulang oleh user.
- Memori tidak bocor antar workspace.

**AC US-07**
- Jawaban yang memakai memori menautkan entri memori yang dipakai.
- Entri dapat ditelusuri sampai ke sesi asalnya.

**AC US-08**
- Penghapusan bersifat permanen dan tidak muncul lagi di retrieval berikutnya.

### 3.3 Menjelaskan (pilar *reasoning*)

| ID | Story | Prioritas | Fase |
|---|---|---|---|
| US-09 | Sebagai user primer, aku bisa memahami mengapa agent mengambil kesimpulan tertentu | Must | P1, P3 |
| US-10 | Sebagai adopter, aku bisa mengganti model tanpa mengubah kode | Must | P2 |

**AC US-09**
- Penjelasan memuat urutan langkah, bukan hanya kesimpulan akhir.
- Penjelasan menyebut sumber data yang dipakai di setiap langkah yang mengutip data.

**AC US-10**
- Model dipilih lewat konfigurasi, bukan tertanam di kode.
- Mengganti model tidak memerlukan perubahan pada client.

### 3.4 Permukaan dan operasi

| ID | Story | Prioritas | Fase |
|---|---|---|---|
| US-11 | Sebagai adopter, aku bisa memasukkan API key sendiri dan key itu tidak bocor | Must | P5 |
| US-12 | Sebagai user primer, aku memakai Weebo di ponsel dan desktop dengan kemampuan setara | Must | P5 |
| US-13 | Sebagai user primer, tugas terjadwal berjalan tanpa client terhubung | Should | P6 |
| US-14 | Sebagai adopter, aku bisa menjalankan Weebo dari terminal untuk scripting | Should | P1 |
| US-15 | Sebagai adopter, aku mendapat aplikasi desktop dari codebase yang sama | Could | — |
| US-16 | Sebagai calon pengguna, aku memahami produk ini dari halaman publik | Could | P7 |

**AC US-11**
- Key tersimpan di keychain OS atau environment, tidak di client.
- Key tidak muncul di log, pesan error, atau bundle yang dikirim ke browser.
- Key dapat diganti tanpa restart penuh.

**AC US-12**
- Tata letak berfungsi pada lebar 375px dan 1440px.
- Tidak ada scroll horizontal pada kedua lebar itu.
- Target sentuh minimal 44px di ponsel.
- Fitur inti (bertanya, melihat jejak, melihat memori) tersedia di kedua ukuran.

**AC US-13**
- Tugas berjalan sesuai jadwal tanpa client terhubung.
- Hasil tugas dapat dilihat setelah client tersambung kembali.

**AC US-14**
- Alur utama dapat diselesaikan dari terminal tanpa membuka PWA.

## 4. Non-goals

Dinyatakan tegas supaya tidak menjadi perdebatan di tengah fase.

- **Bukan chatbot.** Setiap fitur harus lolos pertanyaan: apakah ini membuat agent melakukan pekerjaan
  nyata?
- **Bukan layanan hosted.** Tidak ada akun, langganan, atau tagihan per kursi.
- **Bukan platform tata kelola enterprise.** Zetaris menangani akses data; kita tidak membangun
  lapisan kepatuhan sendiri.
- **Bukan pelatihan atau fine-tuning model.** Kita memakai model yang ada.
- **Bukan alat kolaborasi tim.** Satu instalasi untuk satu pengguna atau satu workspace kecil.
- **Bukan pembangun workflow visual.** Tool dipilih oleh agent, bukan dirangkai manual oleh user.
- **Bukan aplikasi native lebih dulu.** PWA adalah jalur kirim utama; Electron dan Capacitor menyusul
  saat dependensinya terpenuhi (ADR-010).

## 5. Ukuran keberhasilan

**Jujur di depan:** dalam build window tidak akan ada data pemakaian nyata. Metrik adopsi tidak bisa
diklaim. Yang bisa dibuktikan hanya kemampuan yang didemokan.

| Tingkat | Ukuran | Bisa dibuktikan kapan |
|---|---|---|
| Kemampuan | Alur US-01 → US-02 berjalan ujung ke ujung di CLI dalam 30 detik | P1 |
| Kemampuan | Tool call yang ditolak tercatat dengan alasan | P2 |
| Kemampuan | Memori lintas sesi terbukti, dengan entri yang bisa ditelusuri | P3 |
| Kemampuan | PWA memenuhi AC US-12 di 375px dan 1440px | P5 |
| Submission | Video 1–4 menit memperlihatkan alur utama + integrasi Zetaris dan Meterless | P8 |
| Submission | Slide memuat problem, target user, arsitektur, dan integrasi sponsor | P8 |

Yang **tidak** akan diklaim: jumlah pengguna, retensi, penghematan waktu terukur, atau hasil
benchmark yang tidak dijalankan.

## 6. Asumsi yang belum terverifikasi

Wajib diselesaikan atau diturunkan klaimnya di P0. Jangan menulisnya sebagai fakta di submission
sebelum terbukti.

| # | Asumsi | Kalau salah |
|---|---|---|
| 1 | Zetaris menyediakan akses data ter-governance yang bisa didemokan | Kata "governed" diturunkan menjadi "akses data tersebar". Klaim Impact disesuaikan |
| 2 | Meterless H-MEM dapat di-vendor dan dijalankan dari Node | Cari jalur integrasi lain, atau turunkan pilar memory |
| 3 | NVIDIA Nemotron embedding dapat dipakai dalam kuota gratis | Pakai embedding alternatif; pilar memory tetap, kualitas turun |
| 4 | Transport ponsel → runtime dapat diselesaikan (P0 T0.7) | Demo US-12 hanya di desktop, dan itu dinyatakan jujur |

## 7. Rujukan

- Kewajiban lomba: `docs/RULES.md` §5.1 (Zetaris, Meterless, Cursor), §6.1–§6.4 (deliverable).
- Pilihan teknis: `docs/DECISIONS.md` ADR-001 … ADR-014.
- Urutan pengerjaan: `docs/PHASES.md` dan file fase di `docs/phases/`.
- Batasan tim dan bobot penilaian: `docs/CONTEXT.md`.
