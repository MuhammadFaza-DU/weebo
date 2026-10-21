# Project — Open Agent Hackathon 2026

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status: pre-build](https://img.shields.io/badge/status-pre--build-orange.svg)](#project-status)

> **This repository has no product yet.** The product direction is being redefined as of 2026-10-21.
> Everything here is scaffolding: hackathon rules, working agreements, submission checklists, and one
> vendored third-party dependency. See [Project status](#project-status).

---

## Project status

Honest labels, no marketing:

| Area | Status |
|---|---|
| Repository scaffolding, CI, branch protection | Done |
| Hackathon rules transcribed and verified | Done |
| Submission checklist and eligibility declaration | Done |
| Sponsor access (Zetaris, NVIDIA) | Not verified |
| Meterless H-MEM engine vendored and conformance-tested | Done — 13/13 checks passed |
| Product definition | **Not defined** |
| Product code | **None** |

### What is in this repository

| Path | Contents |
|---|---|
| [`AGENTS.md`](AGENTS.md) | Binding rulebook for humans and AI agents working here |
| [`docs/RULES.md`](docs/RULES.md) | Verified transcription of the official hackathon rules (§01–§10) |
| [`docs/CONTEXT.md`](docs/CONTEXT.md) | Scoring weights, rule facts that change strategy, working method |
| [`docs/SUBMISSION.md`](docs/SUBMISSION.md) | Required deliverables and pre-submit audit |
| [`docs/PHASES.md`](docs/PHASES.md) | Official day-by-day timeline, phase framework, task-splitting guide |
| [`docs/SPONSORS.md`](docs/SPONSORS.md) | Sponsor integration obligations and verification evidence |
| [`docs/SETUP-SPONSORS.md`](docs/SETUP-SPONSORS.md) | How to obtain sponsor access, with verification checklists |
| [`docs/CURSOR-LOG.md`](docs/CURSOR-LOG.md) | Log of Cursor usage, required by the hackathon |
| [`CHECKPOINT.md`](CHECKPOINT.md) | Current status, blockers, next action |
| [`PREEXISTING.md`](PREEXISTING.md) | Eligibility declaration for pre-existing components |
| `vendor/hmem/` | Meterless H-MEM reference engine (Apache-2.0, third-party — do not edit) |
| `scripts/check-docs.mjs` | Documentation consistency checker, no dependencies |

## Quickstart

Not available. There is no runnable product in this repository yet, so no commands are published here.
This section will be replaced with real, executed instructions once product code exists.

## Hackathon context

| Item | Value |
|---|---|
| Event | Open Agent Hackathon 2026 (GenAI.Works) |
| Build window | 22 Oct 2026 00:00 UTC → 27 Oct 2026 23:45 UTC |
| Required sponsor integrations | Zetaris and Meterless, called at runtime |
| Required development tool | Cursor (this team uses it as a review surface — see `AGENTS.md` §20) |
| Track | Not selected yet — may change until the submission deadline |

Full rules: [`docs/RULES.md`](docs/RULES.md).

## Contributing

Read [`AGENTS.md`](AGENTS.md) first. Its §1.1 lists the required reading order for anyone (or any
agent) picking up this project; that list is the single source of truth for what to read and in what
order.

Then see [`CONTRIBUTING.md`](CONTRIBUTING.md).

Before committing anything that touches documentation, run `node scripts/check-docs.mjs` — see
`AGENTS.md` §21.

All changes land through pull requests against `main`. Direct pushes are not permitted.

## Third-party components

`vendor/hmem/` is the Meterless H-MEM reference engine, vendored at commit `1742dec` under
Apache-2.0. It is **not** our work and is not edited in place. Verification evidence:
[`docs/SPONSORS.md`](docs/SPONSORS.md) §2.

## License

MIT — see [`LICENSE`](LICENSE).
