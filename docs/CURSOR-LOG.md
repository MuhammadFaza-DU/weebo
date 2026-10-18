# Log Penggunaan Cursor

Aturan lomba mewajibkan tim memakai Cursor untuk pengembangan, dan submission harus menjelaskan
*"how Cursor was used during development"*.

**Cara tim memakai Cursor: untuk review, bukan menulis kode.** Seluruh penulisan kode dilakukan dengan
alat lain. Ini dicatat apa adanya — tidak diklaim lebih dari kenyataan.

**Siapa yang menulis log ini:** agent, bukan manusia. Manusia cenderung lupa. Agent wajib menanyakan
dan mencatat pada setiap penutupan fase.

**Cara mengisi:** agent bertanya di akhir fase — *"ada review di Cursor untuk fase ini?"*
Jawaban dicatat apa adanya, **termasuk "tidak ada"**. Jangan mengarang entri.

---

## Log

| Fase | Tanggal | Apa yang di-review di Cursor | Durasi | Catatan |
|---|---|---|---|---|
| — | — | *belum ada fase yang berjalan* | — | — |

---

## Aturan pengisian

1. Satu baris per fase, ditulis saat fase ditutup.
2. Isi kolom "apa yang di-review" harus spesifik: file atau modul apa, bukan "kode secara umum".
3. Kalau tidak ada review di Cursor pada fase itu, tulis **"tidak ada"** — jangan dikosongkan.
4. Kalau Cursor dipakai untuk hal lain (baca kode, telusuri arsitektur), catat juga.
5. Jangan menulis bahwa kode **ditulis** di Cursor. Kode ditulis di alat lain; Cursor dipakai untuk
   review.
6. Log ini boleh dipakai sebagai bahan Product Feedback di submission, termasuk bagian
   *"what needs work"*.

---

## Untuk submission

Kalimat yang akan dipakai, disesuaikan dengan isi log sebenarnya:

> Cursor was used for code review throughout the build. Code was written in other agent harnesses;
> Cursor served as the review surface where changes were inspected, navigated, and checked for
> consistency with the architecture. [Lengkapi dengan detail dari log di atas.]

Perbarui kalimat ini sesuai isi log. Jangan menulis klaim yang tidak didukung entri di tabel.
