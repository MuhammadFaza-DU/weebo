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
  runtime/      Node host. **Server lokal**: menjalankan core, scheduler, stdio MCP,
                channel bridge. Mengekspos JSON-RPC + WebSocket di localhost.
  cli/          Client teks. `npx weebo` (chat) dan `npx weebo serve` (menjalankan runtime).
                Surface pertama untuk developer dan scripting.
  web/          Client web. React + Vite, PWA: installable, responsif.
  landing/      Astro. Situs publik: narasi produk, fitur + badge status, CTA.
packages/
  core/         Agent loop. Isomorphic. Tidak ada import Node-only.
  protocol/     Kontrak antara runtime dan semua client: tipe request/response,
                skema event, versi protokol.
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

## 2.1 Model client–server (ADR-011)

Satu runtime, banyak client. Runtime adalah satu-satunya tempat yang menyentuh kapabilitas platform.

```
                npx weebo serve
                      │
              apps/runtime (Node)
              ├─ packages/core
              ├─ scheduler
              ├─ MCP servers (stdio)
              └─ WebSocket + JSON-RPC @ localhost
                      │
      ┌───────────────┼───────────────┐
      ▼               ▼               ▼
   apps/cli       apps/web         apps/desktop
   (terminal)     (browser)        (Electron, nanti)
```

Konsekuensi yang harus dijaga:

- Client **tidak** memanggil `packages/core` secara langsung. Semua lewat `packages/protocol`.
- Client **tidak** menyimpan secret, tidak menjadwalkan tugas, tidak mengakses filesystem.
- Satu versi protokol, dideklarasikan di `packages/protocol`, agar client lama tidak rusak.
- Runtime harus bisa dijalankan tanpa client mana pun (headless), karena scheduler tetap bekerja.

## 3. Alur satu permintaan

```
User (CLI / PWA / channel)
   │  kirim pesan lewat packages/protocol
   ▼
apps/runtime (Node)
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
   ▼  stream event: token, tool call, bukti, selesai
Jawaban + bukti (evidence) + jejak langkah
```

Client menampilkan stream event apa adanya. Client tidak menyusun jawaban.

Tahap 8 adalah inti Track 03: jawaban harus bisa **menjelaskan dari mana ia berasal** — sumber data,
memori yang dipakai, dan langkah yang diambil.

## 4. Batas modul

| Modul | Boleh bergantung pada | Tidak boleh |
|---|---|---|
| `packages/core` | TypeScript stdlib, tipe dari modul lain | `fs`, `child_process`, `net`, DOM |
| `packages/protocol` | TypeScript stdlib, zod/skema validasi | `core`, `apps/*` |
| `packages/connectors` | `core` (tipe), MCP SDK | `apps/*` |
| `packages/meterless` | `core` (tipe), engine vendored | mengedit `vendor/` |
| `packages/zetaris` | `core` (tipe), HTTP client | `apps/*` |
| `apps/runtime` | semua `packages/*`, API Node | logika bisnis duplikat |
| `apps/cli` | `protocol`, client WebSocket | `core`, API Node langsung |
| `apps/web` | `protocol`, client WebSocket | `core`, API Node-only |

Kapabilitas platform masuk lewat interface adapter yang dideklarasikan di `core` dan diimplementasikan
di `apps/runtime`. Client tidak mengimplementasikan adapter.

### 4.1 Adapter platform (wajib sejak kode pertama)

Karena hanya `apps/runtime` yang menyentuh platform, adapter hidup di satu tempat. Ini menyederhanakan
tabel dibanding desain sebelumnya:

| Interface | Implementasi | Catatan |
|---|---|---|
| `Storage` | SQLite atau JSONL di direktori data | Dapat diganti tanpa menyentuh core |
| `Secrets` | env atau file terproteksi; keychain OS di Electron | Client tidak pernah menyimpan key |
| `Scheduler` | timer di proses runtime | Tetap jalan saat tidak ada client terhubung |
| `Process` | `child_process` | Untuk stdio MCP server |

Alasan aturan ini ketat: tanpa boundary ini, menambahkan Electron nanti berarti penulisan ulang,
bukan penambahan shell. Lihat ADR-010 dan ADR-011.

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

Meterless H-MEM menjadi lapisan memori. Engine resmi di-*vendor* ke `vendor/` (Apache-2.0, atribusi
dipertahankan) dan **tidak diedit**. Semua penyesuaian berada di `packages/meterless/src` (ADR-012).

### 6.1 Interface `MemoryPort`

`packages/core` hanya mengenal interface, bukan implementasi:

```ts
interface MemoryPort {
  remember(input: RememberInput): Promise<MemoryId>;
  recall(query: RecallQuery): Promise<RecalledMemory[]>;
  feedback(id: MemoryId, signal: "helpful" | "not_helpful" | "wrong"): Promise<void>;
  audit(id: MemoryId): Promise<AuditEntry[]>;
}
```

Alasan: implementasi dapat ditukar (engine vendored → implementasi sendiri) tanpa menyentuh core.

### 6.2 Service yang dipakai

| Service | Status | Peran |
|---|---|---|
| MemoryStore | Dipakai | Tiered storage, enrichment, relasi |
| MemoryMining | Dipakai | Ekstraksi fakta dari percakapan |
| MemoryRetrieval | Dipakai | Ranking hibrida + reinjection |
| TrustLedger | Dipakai | Audit append-only |
| ConflictDetection | Tersedia | Tidak didemokan |
| Dreaming | Tersedia | Tidak didemokan |
| SleepCycle | Tersedia | Tidak didemokan |

### 6.3 Embedding

Engine referensi memakai mock FNV-1a 64 dimensi yang **tidak punya makna semantik**. Ini diganti:

- Provider: NVIDIA Nemotron-3-Embed-1B (`nemotron-3-embed-1b`), endpoint [OI]-compatible NIM.
- Dimensi: 2048 (dapat dipotong ke 1024/512 dengan normalisasi L2 ulang).
- Konteks: 32.768 token. Mendukung bahasa Indonesia.
- Adapter wajib punya: batching, cache per teks, fallback saat provider gagal.

Signifikansi: dalam formula ranking H-MEM, `semantic` berbobot **0,35** — komponen terbesar. Dengan
mock, sepertiga penilaian relevansi menjadi derau.

### 6.4 Batas

- `packages/core` tidak boleh mengimpor `vendor/` secara langsung.
- `vendor/` tidak boleh dimodifikasi; patch dilakukan lewat adapter.
- Memori yang dipakai dalam jawaban harus dapat dirujuk lewat id agar bisa diaudit.

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

- Format penyimpanan runtime: SQLite vs JSONL.
- Format audit log di dalamnya.
- Apakah PWA menyimpan cache percakapan lokal untuk tampilan cepat (bukan sumber kebenaran).
- Strategi sinkronisasi antar perangkat (di luar scope lomba).
- Shell desktop dan build Android: ditunda sampai setelah lomba.

Yang sudah diputuskan dan tidak lagi terbuka: PWA tidak menyimpan state kanonik. Semua state ada di
runtime (ADR-011).

Setiap keputusan baru masuk `DECISIONS.md` sebelum diimplementasikan.
