#!/usr/bin/env node
// Pemeriksa konsistensi dokumen Weebo.
//
// Tujuan: menangkap inkonsistensi yang timbul saat satu dokumen berubah tetapi
// dokumen lain yang bergantung padanya tidak ikut diperbarui (AGENTS.md §21).
//
// Prinsip: HANYA gagal pada hal yang pasti salah. Hal yang bersifat heuristik
// dilaporkan sebagai peringatan dan tidak menggagalkan pemeriksaan.
//
// Tanpa dependensi. Jalankan: node scripts/check-docs.mjs

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, resolve, relative, sep } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = resolve(import.meta.dirname, "..");

const errors = [];
const warnings = [];

const fail = (check, file, line, message) =>
  errors.push({ check, file, line, message });
const warn = (check, file, line, message) =>
  warnings.push({ check, file, line, message });

const toPosix = (p) => p.split(sep).join("/");

function readText(absPath) {
  return readFileSync(absPath, "utf8");
}

// Semua file Markdown yang menjadi bagian repo, kecuali yang sengaja dikecualikan.
//
// Kenapa memakai git, bukan sekadar menelusuri disk: catatan riset lokal
// (`rea.md`, `rea/`) di-exclude lewat `.git/info/exclude` dan tidak pernah masuk
// repo. Kalau pemeriksa menelusuri disk apa adanya, hasil lokal berbeda dari CI
// (lokal 23 berkas, CI 22) dan lokal bisa gagal karena berkas yang tidak akan
// pernah di-commit. Itu alarm palsu yang membuat orang berhenti mempercayai
// pemeriksa.
//
// Yang diperiksa: berkas yang dilacak git + berkas baru yang belum di-ignore.
// Persis himpunan yang akan menjadi isi repo.
const SKIP_DIRS = new Set(["node_modules", ".git", "rea", ".cache", "vendor"]);

function listRepoMarkdownFiles() {
  try {
    const tracked = execFileSync("git", ["ls-files", "*.md"], {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const untracked = execFileSync(
      "git",
      ["ls-files", "--others", "--exclude-standard", "*.md"],
      { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    );

    const paths = new Set();
    for (const line of `${tracked}\n${untracked}`.split(/\r?\n/)) {
      const rel = line.trim();
      if (!rel) continue;
      const segments = rel.split("/");
      if (segments.some((s) => SKIP_DIRS.has(s))) continue;
      if (existsSync(join(ROOT, rel))) paths.add(rel);
    }
    return [...paths].sort();
  } catch {
    // git tidak tersedia (mis. arsip sumber tanpa .git). Jatuh ke penelusuran disk.
    const found = [];
    walkDisk(ROOT, found);
    return found.map((abs) => toPosix(relative(ROOT, abs))).sort();
  }
}

function walkDisk(dir, out) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const abs = join(dir, entry);
    const st = statSync(abs);
    if (st.isDirectory()) {
      walkDisk(abs, out);
    } else if (entry.endsWith(".md")) {
      out.push(abs);
    }
  }
}

const mdFiles = listRepoMarkdownFiles().map((rel) => join(ROOT, rel));

// ---------------------------------------------------------------------------
// Utilitas parsing
// ---------------------------------------------------------------------------

/** Buang isi blok kode berpagar, supaya `|` dan `§` di dalamnya tidak diperiksa. */
function stripFencedCode(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  let inside = false;
  for (const line of lines) {
    if (/^\s*(```|~~~)/.test(line)) {
      inside = !inside;
      out.push("");
      continue;
    }
    out.push(inside ? "" : line);
  }
  return out;
}

/** Normalisasi nomor section: "01" -> "1", "5.1" -> "5.1". */
function normalizeSection(raw) {
  return raw
    .split(".")
    .map((part) => String(parseInt(part, 10)))
    .join(".");
}

/**
 * Kumpulkan nomor section yang benar-benar ada di sebuah dokumen.
 * Mendukung dua bentuk yang dipakai repo ini:
 *   - heading bernomor:        `## 18. ...`, `### 1.1 ...`, `## 01 Eligibility`
 *   - butir tebal bernomor:    `- **5.1** Every submission ...`
 */
function collectSections(text) {
  const ids = new Set();
  for (const line of stripFencedCode(text)) {
    const heading = /^#{2,6}\s+(\d+(?:\.\d+)*)[.\s]/.exec(line);
    if (heading) ids.add(normalizeSection(heading[1]));
    const bold = /^\s*[-*]\s+\*\*(\d+(?:\.\d+)+)\*\*/.exec(line);
    if (bold) ids.add(normalizeSection(bold[1]));
  }
  return ids;
}

const sectionCache = new Map();
function sectionsOf(relPath) {
  if (!sectionCache.has(relPath)) {
    const abs = join(ROOT, relPath);
    sectionCache.set(relPath, existsSync(abs) ? collectSections(readText(abs)) : null);
  }
  return sectionCache.get(relPath);
}

const fileTextCache = new Map();
function textOf(relPath) {
  if (!fileTextCache.has(relPath)) {
    const abs = join(ROOT, relPath);
    fileTextCache.set(relPath, existsSync(abs) ? readText(abs) : null);
  }
  return fileTextCache.get(relPath);
}

// ---------------------------------------------------------------------------
// Pemeriksaan 1: karakter rusak (mojibake / pengganti)
// ---------------------------------------------------------------------------

for (const abs of mdFiles) {
  const rel = toPosix(relative(ROOT, abs));
  const lines = readText(abs).split(/\r?\n/);
  lines.forEach((line, i) => {
    if (line.includes("\uFFFD")) {
      fail("karakter-rusak", rel, i + 1, "mengandung U+FFFD (karakter pengganti)");
    }
    if (/Ã[\u0080-\u00BF\u00A2\u00A9]/.test(line)) {
      fail("karakter-rusak", rel, i + 1, "indikasi mojibake UTF-8 (Ã…)");
    }
  });
}

// ---------------------------------------------------------------------------
// Pemeriksaan 2: tautan internal harus menunjuk berkas yang ada
// ---------------------------------------------------------------------------

const LINK_RE = /\[[^\]]*\]\(([^)\s]+)\)/g;

for (const abs of mdFiles) {
  const rel = toPosix(relative(ROOT, abs));
  const dir = dirname(rel);
  const lines = stripFencedCode(readText(abs));

  lines.forEach((line, i) => {
    for (const match of line.matchAll(LINK_RE)) {
      const target = match[1];
      if (/^(https?:|mailto:|#)/.test(target)) continue;

      const pathPart = decodeURIComponent(target.split("#")[0]);
      if (!pathPart) continue;

      const resolved = pathPart.startsWith("/")
        ? join(ROOT, pathPart)
        : join(ROOT, dir, pathPart);

      if (!existsSync(resolved)) {
        fail("tautan-rusak", rel, i + 1, `tautan tidak menemukan berkas: ${target}`);
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Pemeriksaan 3: rujukan section — `docs/PRD.md` §3.2
// ---------------------------------------------------------------------------

const SECTION_REF_RE = /`([A-Za-z0-9_./-]+\.md)`\s*§\s*(\d+(?:\.\d+)*)/g;

for (const abs of mdFiles) {
  const rel = toPosix(relative(ROOT, abs));
  const lines = stripFencedCode(readText(abs));

  lines.forEach((line, i) => {
    for (const match of line.matchAll(SECTION_REF_RE)) {
      const targetFile = match[1].replace(/^\.\//, "");
      const rawSection = match[2];
      const section = normalizeSection(rawSection);

      if (!existsSync(join(ROOT, targetFile))) {
        fail("rujukan-section", rel, i + 1, `berkas rujukan tidak ada: ${targetFile}`);
        continue;
      }

      const sections = sectionsOf(targetFile);
      if (sections && !sections.has(section)) {
        fail(
          "rujukan-section",
          rel,
          i + 1,
          `§${rawSection} tidak ada di ${targetFile} (section tidak ditemukan)`,
        );
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Pemeriksaan 4: rujukan ADR, user story, dan KPI harus ada di sumbernya
// ---------------------------------------------------------------------------

function checkReferences({ check, pattern, sourceFile, collect }) {
  const source = textOf(sourceFile);
  if (source === null) {
    fail(check, sourceFile, 0, "berkas sumber tidak ditemukan");
    return;
  }
  const known = collect(source);

  for (const abs of mdFiles) {
    const rel = toPosix(relative(ROOT, abs));
    if (rel === sourceFile) continue;
    const lines = stripFencedCode(readText(abs));

    lines.forEach((line, i) => {
      for (const match of line.matchAll(pattern)) {
        const id = match[0];
        if (!known.has(id)) {
          fail(check, rel, i + 1, `${id} tidak ada di ${sourceFile}`);
        }
      }
    });
  }
}

// ADR: hanya rujukan tiga digit (ADR-014), bukan pola generik "ADR-001 … terbaru".
checkReferences({
  check: "rujukan-adr",
  pattern: /ADR-\d{3}/g,
  sourceFile: "docs/DECISIONS.md",
  collect: (text) => {
    const ids = new Set();
    for (const line of stripFencedCode(text)) {
      const m = /^#{2,6}\s+(ADR-\d{3})/.exec(line);
      if (m) ids.add(m[1]);
    }
    return ids;
  },
});

checkReferences({
  check: "rujukan-user-story",
  pattern: /US-\d{2}/g,
  sourceFile: "docs/PRD.md",
  collect: (text) => {
    const ids = new Set();
    for (const line of stripFencedCode(text)) {
      for (const m of line.matchAll(/\bUS-\d{2}\b/g)) ids.add(m[0]);
    }
    return ids;
  },
});

// ---------------------------------------------------------------------------
// Pemeriksaan 5: rujukan task (T0.8, T1.8) ke berkas fase
// ---------------------------------------------------------------------------

const PHASE_FILES = {
  0: "docs/phases/P0-preflight.md",
  1: "docs/phases/P1-walking-skeleton.md",
  2: "docs/phases/P2-agent-core.md",
  3: "docs/phases/P3-memory-reasoning.md",
  4: "docs/phases/P4-design-system.md",
  5: "docs/phases/P5-surfaces.md",
  6: "docs/phases/P6-autonomy.md",
  7: "docs/phases/P7-landing-page.md",
  8: "docs/phases/P8-submission.md",
};

const TASK_REF_RE = /\bT(\d)\.(\d{1,2})\b/g;

// Rujukan ke fase yang berkasnya belum dibuat tidak bisa diperiksa. Ini kondisi
// normal untuk P2-P8 (AGENTS.md §8: berkas fase dibuat saat fase dimulai).
// Dihitung lalu diringkas satu baris, supaya tidak jadi peringatan berulang
// yang membuat orang terbiasa mengabaikan keluaran pemeriksa.
const unverifiableTaskRefs = new Set();

for (const abs of mdFiles) {
  const rel = toPosix(relative(ROOT, abs));
  const lines = stripFencedCode(readText(abs));

  lines.forEach((line, i) => {
    for (const match of line.matchAll(TASK_REF_RE)) {
      const [, phase, num] = match;
      const phaseFile = PHASE_FILES[Number(phase)];
      if (!phaseFile) continue;

      const phaseText = textOf(phaseFile);
      if (phaseText === null) {
        unverifiableTaskRefs.add(phaseFile);
        continue;
      }

      const defined = new RegExp(`^#{2,6}\\s+T${phase}\\.${num}\\b`, "m").test(phaseText);
      if (!defined) {
        fail("rujukan-task", rel, i + 1, `${match[0]} tidak ada di ${phaseFile}`);
      }
    }
  });
}

// ---------------------------------------------------------------------------
// Pemeriksaan 6: integritas tabel Markdown
// ---------------------------------------------------------------------------

const isTableRow = (line) => /^\s*\|/.test(line);

for (const abs of mdFiles) {
  const rel = toPosix(relative(ROOT, abs));
  const lines = stripFencedCode(readText(abs));

  let headerPipes = null;
  let blockStart = 0;

  const closeBlock = (endLine) => {
    headerPipes = null;
    blockStart = endLine;
  };

  lines.forEach((line, i) => {
    if (!isTableRow(line)) {
      if (headerPipes !== null) closeBlock(i);
      return;
    }

    const pipes = (line.match(/\|/g) || []).length;

    if (headerPipes === null) {
      headerPipes = pipes;
      blockStart = i + 1;
      return;
    }

    if (pipes !== headerPipes) {
      fail(
        "tabel-rusak",
        rel,
        i + 1,
        `jumlah kolom ${pipes} berbeda dari header ${headerPipes} (tabel mulai baris ${blockStart})`,
      );
    }
  });
}

// ---------------------------------------------------------------------------
// Pemeriksaan 7: fakta turunan — jumlah urutan baca §1.1
// ---------------------------------------------------------------------------

const agentsText = textOf("AGENTS.md");
if (agentsText === null) {
  fail("fakta-turunan", "AGENTS.md", 0, "berkas tidak ditemukan");
} else {
  const agentsLines = stripFencedCode(agentsText);

  // Hitung butir daftar bernomor di dalam blok "Urutan baca wajib".
  let inReadingOrder = false;
  let readingOrderCount = 0;
  for (const line of agentsLines) {
    if (/^#{2,6}\s+1\.1\b/.test(line)) {
      inReadingOrder = true;
      continue;
    }
    if (inReadingOrder && /^#{2,6}\s/.test(line)) break;
    if (inReadingOrder && /^\d+\.\s+`/.test(line)) readingOrderCount += 1;
  }

  const NUMBER_WORDS = {
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
  };
  const ID_ORDINALS = {
    keenam: 6, ketujuh: 7, kedelapan: 8, kesembilan: 9, kesepuluh: 10,
  };

  const claims = [];

  for (const abs of mdFiles) {
    const rel = toPosix(relative(ROOT, abs));
    const lines = stripFencedCode(readText(abs));

    lines.forEach((line, i) => {
      // Bahasa Inggris: "nine documents"
      for (const m of line.matchAll(/\b(six|seven|eight|nine|ten|eleven|twelve)\s+documents\b/gi)) {
        claims.push({ rel, line: i + 1, claimed: NUMBER_WORDS[m[1].toLowerCase()], text: m[0] });
      }
      // Indonesia: "(9 dokumen)"
      for (const m of line.matchAll(/\((\d+)\s+dokumen\)/g)) {
        claims.push({ rel, line: i + 1, claimed: Number(m[1]), text: m[0] });
      }
      // Indonesia ordinal: "kesembilannya"
      for (const m of line.matchAll(/\b(keenam|ketujuh|kedelapan|kesembilan|kesepuluh)nya\b/gi)) {
        claims.push({
          rel,
          line: i + 1,
          claimed: ID_ORDINALS[m[1].toLowerCase()],
          text: m[0],
        });
      }
    });
  }

  for (const claim of claims) {
    if (claim.claimed !== readingOrderCount) {
      fail(
        "fakta-turunan",
        claim.rel,
        claim.line,
        `menyebut "${claim.text}" (${claim.claimed}) tetapi §1.1 AGENTS.md berisi ${readingOrderCount} butir`,
      );
    }
  }

  if (claims.length === 0 && readingOrderCount > 0) {
    warn(
      "fakta-turunan",
      "AGENTS.md",
      0,
      `§1.1 berisi ${readingOrderCount} butir, tetapi tidak ada dokumen yang menyebut jumlahnya (bukan masalah, hanya catatan)`,
    );
  }
}

// ---------------------------------------------------------------------------
// Pemeriksaan 8: kontradiksi klaim berisiko tinggi (wajib vs opsional)
// ---------------------------------------------------------------------------
//
// Kenapa ada: pemeriksa bentuk tidak bisa menangkap dua dokumen yang menyatakan
// hal BERLAWANAN dengan kata berbeda. Contoh nyata yang pernah lolos:
// `docs/RULES.md` §5.1 "teams must use Cursor for development" sementara
// dokumen lain menulis "Cursor opsional". Keduanya lolos semua pemeriksaan di
// atas, karena tidak ada satu pun aturan bentuk yang dilanggar.
//
// Ini heuristik, bukan pembacaan makna. Ruang lingkupnya sengaja sempit:
// hanya istilah sponsor yang kewajibannya bisa membuat submission gugur.
//
// Penanganan negasi: "tidak wajib" MENGANDUNG "wajib". Negasi harus dibuang
// lebih dulu, kalau tidak klaim yang sama terdeteksi sebagai wajib sekaligus
// opsional lalu saling meniadakan (bug ini benar-benar terjadi di prototipe).

const PROTECTED_TERMS = ["Zetaris", "Meterless", "Cursor", "NVIDIA"];

// `integrat` menangkap bentuk Inggris (integrate/integration).
// `integrasi` menangkap bentuk Indonesia (integrasi, diintegrasikan,
// mengintegrasikan). Keduanya wajib ada: tanpa `integrasi`, kalimat
// "NVIDIA wajib diintegrasikan" lolos tanpa terdeteksi — bug ini benar-benar
// terjadi dan hanya tertangkap oleh selftest.
const USAGE_RE =
  /(integrat|integrasi|mengintegrasikan|memakai|memakainya|\buse\b|\bused\b|digunakan|dipakai|development|pengembangan)/i;

// Filter konteks: hanya klaim tentang kewajiban bagi submission/tim.
// Tanpa filter ini, kalimat seperti "Zetaris wajib diakses lewat runtime"
// (soal transport, bukan soal kewajiban lomba) akan salah dianggap kontradiksi.
const CONTEXT_RE = /(submission|peserta|\btim\b|\bteam\b|lomba|hackathon|syarat|requirement)/i;

const NEGATED_REQUIRED_RE =
  /(tidak\s+wajib|tidak\s+diwajibkan|not\s+required|not\s+mandatory|tidak\s+harus)/gi;

const OPTIONAL_RE =
  /(\boptional\b|\bopsional\b|tidak\s+wajib|tidak\s+diwajibkan|not\s+required|\bnot\s+mandatory\b|tidak\s+harus)/i;

const REQUIRED_RE =
  /(\bmust\b|\bwajib\b|\bdiwajibkan\b|\brequired\b|\bmandatory\b|syarat\s+wajib)/i;

const claimFindings = [];

for (const abs of mdFiles) {
  const rel = toPosix(relative(ROOT, abs));
  const lines = stripFencedCode(readText(abs));

  lines.forEach((line, i) => {
    if (!CONTEXT_RE.test(line)) return;
    if (!USAGE_RE.test(line)) return;

    for (const term of PROTECTED_TERMS) {
      if (!line.includes(term)) continue;

      const stripped = line.replace(NEGATED_REQUIRED_RE, " ");
      const isOptional = OPTIONAL_RE.test(line);
      const isRequired = REQUIRED_RE.test(stripped) && !isOptional;

      if (isRequired) {
        claimFindings.push({ term, kind: "wajib", file: rel, line: i + 1, text: line.trim() });
      } else if (isOptional) {
        claimFindings.push({ term, kind: "opsional", file: rel, line: i + 1, text: line.trim() });
      }
    }
  });
}

for (const term of PROTECTED_TERMS) {
  const forTerm = claimFindings.filter((f) => f.term === term);
  const required = forTerm.filter((f) => f.kind === "wajib");
  const optional = forTerm.filter((f) => f.kind === "opsional");

  if (required.length > 0 && optional.length > 0) {
    const first = required[0];
    const second = optional[0];
    fail(
      "kontradiksi-klaim",
      second.file,
      second.line,
      `"${term}" dinyatakan OPSIONAL di sini, tetapi WAJIB di ${first.file}:${first.line}. ` +
        `Tinjau: ini kontradiksi nyata, atau dua klaim berbeda? Jika berbeda, perjelas cakupannya.`,
    );
  }
}


// ---------------------------------------------------------------------------
// Laporan
// ---------------------------------------------------------------------------

const group = (items) => {
  const map = new Map();
  for (const item of items) {
    const key = item.check;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
  }
  return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
};

const label = {
  "karakter-rusak": "Karakter rusak",
  "tautan-rusak": "Tautan internal",
  "rujukan-section": "Rujukan section",
  "rujukan-adr": "Rujukan ADR",
  "rujukan-user-story": "Rujukan user story",
  "rujukan-task": "Rujukan task fase",
  "tabel-rusak": "Integritas tabel",
  "fakta-turunan": "Fakta turunan",
  "kontradiksi-klaim": "Kontradiksi klaim (wajib vs opsional)",
};

console.log(`Memeriksa ${mdFiles.length} berkas Markdown.\n`);

if (unverifiableTaskRefs.size > 0) {
  const list = [...unverifiableTaskRefs].sort().join(", ");
  console.log(
    `Catatan: rujukan task ke fase yang berkasnya belum dibuat tidak diperiksa (${list}).`,
  );
  console.log("Itu normal untuk fase mendatang (AGENTS.md §8).\n");
}

if (warnings.length > 0) {
  console.log(`PERINGATAN (${warnings.length}) — tidak menggagalkan pemeriksaan:`);
  for (const [check, items] of group(warnings)) {
    console.log(`  ${label[check] ?? check}:`);
    for (const item of items) {
      console.log(`    ${item.file}:${item.line}  ${item.message}`);
    }
  }
  console.log("");
}

if (errors.length > 0) {
  console.log(`GAGAL (${errors.length} temuan):`);
  for (const [check, items] of group(errors)) {
    console.log(`  ${label[check] ?? check}:`);
    for (const item of items) {
      console.log(`    ${item.file}:${item.line}  ${item.message}`);
    }
  }
  console.log("\nPerbaiki temuan di atas sebelum commit (AGENTS.md §21).");
  process.exit(1);
}

console.log("LULUS — tidak ada kerusakan BENTUK yang terdeteksi.");
console.log("");
console.log("INI BUKAN PERNYATAAN BAHWA ISI DOKUMEN BENAR.");
console.log("Yang TIDAK diperiksa:");
console.log("  - apakah dua dokumen menyatakan hal yang saling bertentangan");
console.log("    dengan kata berbeda (mis. 'wajib' vs 'harus' vs 'must');");
console.log("  - apakah sebuah kalimat masih sesuai kenyataan;");
console.log("  - apakah angka dalam prosa masih benar (hanya bentuk terdaftar");
console.log("    yang diperiksa, mis. jumlah urutan baca §1.1);");
console.log("  - apakah tanggal atau nilai yang diulang di beberapa berkas cocok.");
console.log("");
console.log("Yang DIPERIKSA sebagian: kontradiksi 'wajib vs opsional' hanya untuk");
console.log(`  istilah ${PROTECTED_TERMS.join(", ")} — heuristik sempit, bukan pembacaan makna.`);
console.log("");
console.log("Keselarasan makna tetap tanggung jawab penulis (AGENTS.md §21.7).");
