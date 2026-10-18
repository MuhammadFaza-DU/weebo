# Arsitektur Weebo

Dokumen ini menjelaskan bagaimana Weebo disusun dan mengapa. Keputusan yang sudah disepakati dicatat
di [`DECISIONS.md`](DECISIONS.md); dokumen ini menjelaskan bentuk akhirnya.

Status: **rencana**. Belum ada kode produk. Bagian yang belum diimplementasikan ditandai jelas.

---

## 1. Prinsip

1. **Isomorphic core.** Logika agent tidak boleh bergantung pada runtime tertentu. Runtime Node
   memberi kapabilitas lebih (spawn proses, filesystem, cron); browser memberi portabilitas. Keduanya
   memakai core yang sama lewat adapter.
2. **Tool call selalu melewati policy.** Tidak ada jalur pintas. Setiap pemanggilan tool melewati
   registry → policy → executor → audit.
3. **Sponsor bukan tempelan.** Zetaris dan Meterless dipanggil dari kode produk, bukan dari skrip
   demo terpisah.
4. **Bisa dijalankan dari clone bersih.** `npm install && npm run dev` harus cukup. Kalau butuh
   langkah manual, langkah itu masuk README.
5. **Kejujuran status.** Fitur yang belum jalan ditandai `roadmap`, bukan disembunyikan.

## 2. Peta monorepo

```
apps/
  web/          React + Vite. PWA: installable, responsif, offline-tolerant.
  runtime/      Node host. Scheduler, stdio MCP server, channel bridge (Telegram dll).
                Dirancang agar juga bisa berjalan di dalam main process Electron.
  landing/      Astro. Situs publik: narasi produk, fitur + badge status, CTA.
packages/
  core/         Agent loop. Isomorphic. Tidak ada import Node-only.
  meterless/    Adapter atas engine Meterless. vendor/ tidak boleh diedit.
  zetaris/      Client Zetaris: MCP + REST fallback, typed, dengan error mapping.
  connectors/   Registry connector MCP + definisi tool.
  gateway/      Cloudflare Worker: kuota gratis per IP, hanya model gratis.
```

Shell native (setelah submission, lihat ADR-010):

```
apps/desktop/   Electron: membungkus apps/web, menjalankan apps/runtime di main process
apps/mobile/    Capacitor: membungkus apps/web
```

## 3. Alur satu permintaan

```
User (web / channel)
   │
   ▼
apps/web atau apps/runtime
   │  memanggil core.runTurn()
   ▼
packages/core
   1. Scout Intent   → apa yang user mau, entitas apa yang disebut
   2. Memory recall  → H-MEM: apa yang sudah kita tahu (packages/meterless)
   3. Plan           → langkah apa yang dibutuhkan
   4. Tool selection → connector mana yang relevan (packages/connectors)
   5. Policy check   → boleh atau tidak, perlu approval atau tidak
   6. Execute        → panggil tool (mis. Zetaris query)
   7. Verify         → apakah hasil cukup untuk menjawab
   8. Compose        → susun jawaban + jejak sumber
   9. Write memory   → simpan fakta baru, audit trail
   │
   ▼
Jawaban + bukti (evidence) + jejak langkah
```

Tahap 8 adalah inti Track 03: jawaban harus bisa **menjelaskan dari mana ia berasal** — sumber data,
memori yang dipakai, dan langkah yang diambil.

## 4. Batas modul

| Modul | Boleh bergantung pada | Tidak boleh |
|---|---|---|
| `packages/core` | TypeScript stdlib, tipe dari modul lain | `fs`, `child_process`, `net`, DOM |
| `packages/connectors` | `core` (tipe), MCP SDK | `apps/*` |
| `packages/meterless` | `core` (tipe), engine vendored | mengedit `vendor/` |
| `packages/zetaris` | `core` (tipe), HTTP client | `apps/*` |
| `apps/runtime` | semua `packages/*`, API Node | logika bisnis duplikat |
| `apps/web` | semua `packages/*` yang isomorphic | API Node-only |

Kapabilitas platform masuk lewat interface adapter yang dideklarasikan di `core` dan diimplementasikan
di `apps/*`.

### 4.1 Adapter platform (wajib sejak kode pertama)

`packages/core` tidak boleh menyentuh API platform. Setiap kapabilitas dideklarasikan sebagai
interface dan diimplementasikan per runtime:

| Interface | Browser (PWA) | Node (`apps/runtime`) | Electron (nanti) |
|---|---|---|---|
| `Storage` | IndexedDB / OPFS | SQLite atau JSONL | SQLite di userData |
| `Secrets` | IndexedDB terenkripsi (terbatas) | env / file terproteksi | keychain OS |
| `Scheduler` | saat tab terbuka | proses latar | main process, auto-start |
| `Process` | tidak tersedia | `child_process` | `child_process` |

Alasan aturan ini ketat: tanpa boundary ini, menambahkan Electron nanti berarti penulisan ulang,
bukan penambahan shell. Lihat ADR-010.

## 5. Policy dan audit

Setiap tool punya deklarasi:

```ts
interface ToolPolicy {
  name: string;
  sideEffect: "read" | "write" | "external";
  requiresApproval: boolean;
  scopes: string[];          // izin yang dibutuhkan
}
```

Aturan:

- `sideEffect: "write"` dan `"external"` memerlukan approval eksplisit kecuali user sudah memberi
  izin persisten untuk tool tersebut.
- Setiap eksekusi menulis entri audit: waktu, tool, argumen (disanitasi), hasil, durasi, keputusan
  policy.
- Audit log tidak boleh memuat secret.

## 6. Memory

Meterless H-MEM menjadi lapisan memori:

- **Mining** — fakta dari percakapan diekstrak dan disimpan.
- **Retrieval** — relevansi hibrida saat dibutuhkan.
- **Audit** — setiap memori punya riwayat append-only.
- **Sleep/consolidation** — preview dulu, baru diterapkan.

Weebo membungkus ini di `packages/meterless/src`, tidak memanggil engine langsung dari UI.

## 7. Data (Zetaris)

Zetaris dipakai sebagai data harness:

- Jalur utama: MCP server Zetaris.
- Jalur cadangan: REST API Zetaris, untuk lingkungan yang tidak mendukung MCP.
- Semua query melewati `packages/zetaris` sehingga error, retry, dan rate limit ditangani satu tempat.
- Hasil query dikembalikan bersama metadata sumber agar bisa dikutip di jawaban.

## 8. Model

Tiga jalur, dipilih user di settings:

| Jalur | Key | Catatan |
|---|---|---|
| Free tier | Tidak perlu | Lewat `packages/gateway`, key NVIDIA NIM milik project, kuota per IP |
| BYOK | Key user | Disimpan lokal (env atau keychain), tidak pernah dikirim ke server kami |
| Lokal | Tidak perlu | Ollama / LM Studio di mesin user |

Katalog model (`packages/core/src/models/catalog.ts`) memuat daftar model beserta tier, konteks, dan
label. Katalog tidak memerlukan server.

## 9. Yang belum diputuskan

Dicatat jujur supaya tidak jadi asumsi diam-diam:

- Penyimpanan state di PWA: IndexedDB vs OPFS.
- Format audit log: SQLite lokal vs JSONL.
- Strategi sinkronisasi antar perangkat (di luar scope lomba).
- Shell desktop dan build Android: ditunda sampai setelah lomba.

Setiap keputusan baru masuk `DECISIONS.md` sebelum diimplementasikan.
