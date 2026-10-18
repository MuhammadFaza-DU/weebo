# Referensi Pembanding

Dokumen ini mencatat produk yang dipelajari tim, **apa yang diambil**, dan **apa yang tidak diambil**.
Tujuannya agar keputusan desain punya jejak, bukan kesan.

Aturan (lihat `AGENTS.md` §3): referensi dipelajari sebagai pengetahuan. Tidak ada kode, aset, ikon,
atau teks milik pihak lain yang disalin ke repo ini. Catatan belajar disimpan di luar repo.

---

## Matriks referensi

| Produk | Lisensi / status | Yang diambil | Yang tidak diambil |
|---|---|---|---|
| **Hermes Agent** (Nous Research) | Open source, MIT | Kanal multi-platform, memory persisten, scheduling, subagent, struktur `cron/` `gateway/` `providers/` | Model "self-improving skills" penuh (terlalu besar untuk 6 hari) |
| **Grok Bot** (xAI) | Closed source | Prinsip UX: setup mudah, terasa seperti mengirim pesan ke kolega, agent yang punya "komputer sendiri" | Cloud VM per akun (butuh biaya besar) |
| **OpenCode** | Open source | Katalog model terkurasi, harness dengan permission, BYOK, registry provider | Mekanisme kuota gratis yang diikat ke fingerprint client resmi (tidak sah ditiru) |
| **Composio** | Closed source | Konsep connector all-in-one, registry tool terpadu | Skala katalog integrasi mereka (ratusan app) |
| **Meterless** | Open source, Apache-2.0 | H-MEM memory, Markovian reasoning compression, Scout Intent | Produk proprietary mereka (Gaia/Relay/Swarms) |
| **Zetaris** | Closed source | Data harness: query in-situ lintas sumber tanpa penyalinan, MCP server | Deployment cloud penuh (di luar scope) |

---

## Prinsip yang diadopsi

### Dari Hermes

1. **Satu agent, banyak permukaan.** Memory dan konteks sama di semua kanal.
2. **Scheduling sebagai fitur inti**, bukan tambahan — agent harus bisa bekerja tanpa disuruh.
3. **Pemisahan tegas antara agent core dan permukaan UI**, dihubungkan oleh gateway.

### Dari Grok Bot

1. **Setup harus selesai dalam hitungan detik**, bukan menit. User baru tidak boleh disuruh mencari
   API key sebelum melihat agent bekerja.
2. **Interaksi terasa seperti mengirim pesan**, bukan mengisi form konfigurasi.
3. **Agent boleh "punya ruang kerja"**, tetapi untuk Weebo ruang kerja itu adalah data milik user
   (lewat Zetaris), bukan VM baru yang kami kelola.

### Dari OpenCode

1. **Katalog model yang terkurasi**, bukan daftar mentah semua model.
2. **Permission eksplisit** untuk setiap tool, dengan jejak audit.
3. **BYOK sebagai hak dasar**, bukan fitur premium.

### Dari Composio

1. **Satu registry connector**, bukan integrasi ad-hoc per app.
2. **Tool punya deskripsi yang bisa dibaca model**, bukan hanya nama fungsi.

### Dari Meterless

1. **Memory yang bisa diaudit** — setiap fakta punya riwayat.
2. **Kompresi reasoning** agar konteks tidak membengkak seiring panjang tugas.
3. **Deteksi intent sebelum model besar dipanggil**, untuk menghemat biaya dan waktu.

### Dari Zetaris

1. **Data dibaca di tempatnya**, tidak disalin lebih dulu.
2. **Governance menyertai data**, bukan ditambahkan belakangan.

---

## Yang secara sadar tidak diambil

| Hal | Alasan |
|---|---|
| Cloud computer per user (Grok Bot) | Butuh biaya infrastruktur besar; bertentangan dengan prinsip gratis |
| Katalog ratusan connector (Composio) | Tidak realistis untuk enam hari; fokus ke MCP + Zetaris |
| Auto-generate skills dari pengalaman (Hermes) | Menarik, tapi risiko kualitas; masuk roadmap |
| Bypass pembatasan client pihak lain | Tidak sah, dan berisiko memblokir key |
| Menyalin aset visual/ikon produk lain | Melanggar originalitas submission |

---

## Catatan metodologi

Detail riset per produk disimpan di luar repo. Dokumen ini hanya merangkum kesimpulan yang relevan
untuk pengembangan Weebo.

Jika sebuah keputusan di `DECISIONS.md` berasal dari pengamatan produk lain, ADR terkait menyebut
alasannya — bukan menyalin implementasinya.
