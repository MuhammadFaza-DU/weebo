#!/usr/bin/env node
// Selftest untuk scripts/check-docs.mjs.
//
// Kenapa ada: pemeriksa yang diam-diam berhenti memeriksa lebih buruk daripada
// tidak ada pemeriksa. Selftest ini menyuntik satu kerusakan untuk SETIAP kelas
// pemeriksaan, lalu memastikan pemeriksa benar-benar menangkapnya.
//
// Fixture dibuat di .cache/ (di-gitignore), bukan di dalam repo.
// Jalankan: node scripts/check-docs.selftest.mjs

import { mkdirSync, writeFileSync, rmSync, cpSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = resolve(import.meta.dirname, "..");
const WORK = join(ROOT, ".cache", "check-docs-selftest");

let passed = 0;
const failures = [];

function reset() {
  rmSync(WORK, { recursive: true, force: true });
  mkdirSync(join(WORK, "scripts"), { recursive: true });
  mkdirSync(join(WORK, "docs", "phases"), { recursive: true });
  cpSync(
    join(ROOT, "scripts", "check-docs.mjs"),
    join(WORK, "scripts", "check-docs.mjs"),
  );

  // AGENTS.md minimal: §1.1 dengan 3 butir, supaya fakta turunan bisa diuji.
  writeFileSync(
    join(WORK, "AGENTS.md"),
    [
      "# AGENTS",
      "",
      "## 1. Otoritas",
      "",
      "### 1.1 Urutan baca",
      "",
      "1. `CHECKPOINT.md` — status.",
      "2. `docs/PRD.md` — produk.",
      "3. `docs/DECISIONS.md` — keputusan.",
      "",
      "Tanpa ketiganya, agent berisiko salah.",
      "",
      "## 2. Lain",
      "",
    ].join("\n"),
  );

  writeFileSync(
    join(WORK, "CHECKPOINT.md"),
    "# CHECKPOINT\n\nStatus.\n",
  );

  writeFileSync(
    join(WORK, "docs", "DECISIONS.md"),
    ["# ADR", "", "## ADR-001 - Pertama", "", "## ADR-002 - Kedua", ""].join("\n"),
  );

  writeFileSync(
    join(WORK, "docs", "PRD.md"),
    [
      "# PRD",
      "",
      "## 1. Ringkas",
      "",
      "### 1.1 Problem",
      "",
      "| ID | Story |",
      "|---|---|",
      "| US-01 | Pertama |",
      "| US-02 | Kedua |",
      "",
      "### 1.2 Solusi",
      "",
    ].join("\n"),
  );

  writeFileSync(
    join(WORK, "docs", "phases", "P1-walking-skeleton.md"),
    ["# P1", "", "### T1.1 — Satu", "", "### T1.2 — Dua", ""].join("\n"),
  );
}

function runChecker() {
  try {
    const out = execFileSync(process.execPath, [join(WORK, "scripts", "check-docs.mjs")], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, output: out };
  } catch (err) {
    return { code: err.status ?? 1, output: `${err.stdout ?? ""}${err.stderr ?? ""}` };
  }
}

function expectFail(name, fileContent, expectedFragment, targetFile = "suspect.md") {
  reset();
  writeFileSync(join(WORK, targetFile), fileContent);
  const { code, output } = runChecker();

  if (code !== 0 && output.includes(expectedFragment)) {
    passed += 1;
    console.log(`  OK    ${name}`);
  } else {
    failures.push({ name, expectedFragment, code, output });
    console.log(`  GAGAL ${name}`);
  }
}

function expectPass(name, extraFile) {
  reset();
  if (extraFile) writeFileSync(join(WORK, "suspect.md"), extraFile);
  const { code, output } = runChecker();

  if (code === 0) {
    passed += 1;
    console.log(`  OK    ${name}`);
  } else {
    failures.push({ name, expectedFragment: "(exit 0)", code, output });
    console.log(`  GAGAL ${name}`);
  }
}

console.log("Selftest pemeriksa konsistensi dokumen\n");

console.log("Harus LULUS (tanpa kerusakan):");
expectPass("repo bersih tanpa temuan");
expectPass("tabel sehat", "| A | B |\n|---|---|\n| 1 | 2 |\n");
expectPass(
  "rujukan valid",
  "Lihat `docs/PRD.md` §1.1 dan `AGENTS.md` §1.1, ADR-001, US-01, T1.1.\n",
);
expectPass(
  "jumlah urutan baca benar (ketiganya = 3)",
  "Ada tiga dokumen: three documents.\n",
);

console.log("\nHarus GAGAL (kerusakan disuntik):");

expectFail(
  "tautan internal rusak",
  "Lihat [hilang](./tidak-ada.md).\n",
  "tautan tidak menemukan berkas",
);

expectFail(
  "rujukan section tidak ada",
  "Lihat `docs/PRD.md` §9.9.\n",
  "§9.9 tidak ada di docs/PRD.md",
);

expectFail(
  "rujukan ADR tidak ada",
  "Menurut ADR-099.\n",
  "ADR-099 tidak ada di docs/DECISIONS.md",
);

expectFail(
  "rujukan user story tidak ada",
  "Memenuhi US-99.\n",
  "US-99 tidak ada di docs/PRD.md",
);

expectFail(
  "rujukan task tidak ada di berkas fase yang ADA",
  "Kerjakan T1.9.\n",
  "T1.9 tidak ada di docs/phases/P1-walking-skeleton.md",
);

expectFail(
  "tabel dengan kolom tidak konsisten (bug baris tergabung)",
  "| A | B | C |\n|---|---|---|\n| 1 | 2 | 3 |\n| 4 | 5 | 6 || 7 | 8 | 9 |\n",
  "jumlah kolom",
);

expectFail(
  "jumlah urutan baca salah",
  "Ada nine documents di sini.\n",
  "tetapi §1.1 AGENTS.md berisi 3 butir",
);

expectFail(
  "ordinal Indonesia salah",
  "Tanpa kesembilannya, agent salah.\n",
  "§1.1 AGENTS.md berisi 3 butir",
);

expectFail(
  "karakter rusak U+FFFD",
  "Baris rusak: \uFFFD\n",
  "U+FFFD",
);

expectFail(
  "mojibake UTF-8",
  "Kata: Ã©\n",
  "mojibake",
);

console.log("\nHarus PERINGATAN, bukan gagal (fase mendatang):");
reset();
writeFileSync(join(WORK, "suspect.md"), "Kerjakan T2.1 nanti.\n");
{
  const { code, output } = runChecker();
  if (code === 0 && output.includes("tidak diperiksa")) {
    passed += 1;
    console.log("  OK    rujukan ke fase tanpa berkas tidak menggagalkan");
  } else {
    failures.push({
      name: "rujukan ke fase tanpa berkas tidak menggagalkan",
      expectedFragment: "tidak diperiksa",
      code,
      output,
    });
    console.log("  GAGAL rujukan ke fase tanpa berkas tidak menggagalkan");
  }
}

rmSync(WORK, { recursive: true, force: true });

console.log(`\n${passed} lulus, ${failures.length} gagal.`);

if (failures.length > 0) {
  for (const f of failures) {
    console.log(`\n--- ${f.name} ---`);
    console.log(`diharapkan mengandung: ${f.expectedFragment}`);
    console.log(`exit: ${f.code}`);
    console.log(f.output.trim());
  }
  process.exit(1);
}
