# Weebo

**Open-source agent harness that fuses governed enterprise data, persistent context, and any model — one agent, every device.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Status: scaffolding](https://img.shields.io/badge/status-scaffolding-orange.svg)](#project-status)

> Weebo is in active early development. The repository currently contains project scaffolding,
> architecture, and documentation. Product code lands during the build window described in
> [`PREEXISTING.md`](PREEXISTING.md).

---

## What Weebo is

Weebo is a self-hosted agent harness. You bring a model — or use the free tier — and get an agent
that remembers your context, runs work on a schedule, reaches your tools through MCP connectors,
and follows you from desktop to tablet to phone.

Weebo is designed around two layers:

- **A context layer.** [Meterless](https://github.com/Meterless/Meterless) engines — hierarchical
  memory (H-MEM) — so the agent carries durable context instead of re-deriving it every turn.
- **A data layer.** [Zetaris](https://www.zetaris.com/) as a data harness, so the agent can query
  live, governed data across sources without those sources being copied or centralized first.

Both integrations are **planned and not yet implemented** — see [Project status](#project-status).

Weebo is the harness that binds the two: the agent loop, the tool policy, the scheduler, and the
surface you actually talk to.

## Why another agent?

Personal agents are good at conversations. Work rarely lives in conversations.

Most of what a person needs an agent to answer sits in scattered systems — a Postgres table here, a
parquet file there, a partner API nobody documented. An agent that can chat but cannot reach that
data is a clever toy. Weebo closes that gap by treating **data access as a first-class connector**
rather than an afterthought.

| Capability | Chat assistants | Personal agent apps | Weebo (target) |
|---|---|---|---|
| Multi-channel reach (chat apps, CLI, web) | Partial | Yes | Planned |
| Persistent memory across sessions | Partial | Yes | Planned — via Meterless H-MEM |
| Scheduled, unattended work | No | Yes | Planned |
| Bring your own key (BYOK) | Rare | Rare | Planned |
| Governed access to scattered enterprise data | No | No | Planned — via Zetaris |
| Runs on desktop, tablet, and phone from one codebase | Rare | Rare | Planned (PWA first) |
| Self-hostable, open source | Rare | Rare | Yes — MIT |

This table describes the target product, not what is built. For what exists today, see
[Project status](#project-status).

## How it fits together

Weebo is one runtime with several clients. The runtime owns everything that needs a real machine —
scheduling, filesystem, secrets, MCP connectors. Clients are thin.

```
npx weebo serve          → local runtime (Node)
       │
       ├── npx weebo      → CLI, for developers and scripting
       ├── web app        → PWA, installable on phone and desktop
       └── desktop app    → Electron, once the PWA client exists (P5)
```

This is why a browser tab is enough to drive an agent that keeps working: the work happens in the
runtime, not in the tab.

## Project status

Honest labels, no marketing:

| Area | Status |
|---|---|
| Repository scaffolding, architecture, and decision records | Done |
| Sponsor technology accounts and access verification | Not started — P0 has not begun |
| Agent core (loop, tool registry, policy, audit) | Not started |
| Memory and reasoning (Meterless H-MEM, with a custom embedding adapter) | Not started |
| Data connector (Zetaris MCP/REST) | Not started |
| Application surface (PWA) | Not started |
| Scheduler, channels | Not started |
| Free-tier quota gateway | Not started — depends on P1–P5 being complete |
| Landing page | Not started |

See [`docs/PHASES.md`](docs/PHASES.md) for the phase framework and exit criteria.

## Architecture

Weebo is a TypeScript monorepo: one runtime, several clients. The runtime owns everything that needs
a real machine — agent loop, scheduling, filesystem, secrets, MCP connectors. The agent core is
isomorphic and free of platform APIs, so it can be exercised in tests without a host.

```
apps/
  runtime/      Local server — agent loop, scheduler, MCP connectors, secrets
  cli/          Terminal client: `npx weebo` and `npx weebo serve`
  web/          PWA client — one surface for desktop, tablet, and phone
  landing/      Astro marketing site (public face of the project)
packages/
  core/         Isomorphic agent loop: intent → memory → plan → tool → verify
  protocol/     Versioned contract between the runtime and every client
  meterless/    Adapter Meterless — our code. The third-party engine lives in vendor/hmem
  zetaris/      Typed Zetaris MCP/REST client with error mapping
  connectors/   MCP connector registry
  gateway/      Free-tier quota gateway (Cloudflare Worker)
docs/           Architecture, decisions, sponsor integration, phases
```

Full detail: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
Decisions and their rationale: [`docs/DECISIONS.md`](docs/DECISIONS.md).

## Sponsor technology

Weebo is built for the **Open Agent Hackathon 2026** and integrates sponsor technology at runtime,
not in the README.

| Technology | Role in Weebo |
|---|---|
| **Zetaris** | Data harness — live, governed queries across scattered sources via MCP/REST |
| **Meterless** | Context layer — H-MEM memory engine (vendored, Apache-2.0), with a custom embedding adapter replacing its reference mock |
| **NVIDIA Nemotron** | Free-tier model path via NVIDIA NIM. Not built yet — the quota gateway depends on P1–P5 |
| **Cursor** | Review surface — code is written in other agent harnesses, Cursor is used to review it |

Integration evidence, transcripts, and the exact call sites live in
[`docs/SPONSORS.md`](docs/SPONSORS.md). Account setup: [`docs/SETUP-SPONSORS.md`](docs/SETUP-SPONSORS.md).

## Quickstart

Not yet available — there is no product code in this repository yet. This section will be replaced
with real instructions once the walking skeleton lands. We will not publish commands that have not
been executed.

## Roadmap

The authoritative phase plan lives in [`docs/PHASES.md`](docs/PHASES.md). Summary:

| Phase | Deliverable |
|---|---|
| P0 Preflight | All sponsor access verified, architecture assumptions answered |
| P1 Walking skeleton | One thin end-to-end path, driven from the terminal |
| P2 Agent core | Tool registry, policy allow/deny, audit log, runtime protocol |
| P3 Memory and reasoning | H-MEM memory, real embeddings, explainable answers |
| P4 Design system | Tokens and components on canvas |
| P5 Application surface | Responsive PWA client |
| P6 Autonomy | Headless scheduling, channel bridges |
| P7 Landing page | Public Astro site |
| P8 Submission | Video, slide deck, README, eligibility audit |

Not in the current plan — each becomes available when its dependency is met (see `AGENTS.md` §8.1).
The authoritative list, with start conditions, is in [`docs/PHASES.md`](docs/PHASES.md).

| # | Item | Depends on |
|---|---|---|
| 1 | Live demo URL (deployed PWA) | P5 complete |
| 2 | Native desktop shell (Electron) | P5 client exists, P2 protocol exists |
| 3 | Free-tier quota gateway | P1–P5 complete |
| 4 | Android build (Capacitor) | P5 client exists, Android SDK installed |
| 5 | Own implementation of the memory engine, behind `MemoryPort` | P3 complete, `MemoryPort` stable |
| 6 | Landing page polish | P7 complete, status badges accurate |
| 7 | Connector catalogue beyond MCP basics | MCP and Zetaris stable |
| 8 | Auto-generated skills | P3 complete, quality evaluation done |
| 9 | Cloud sync for user-chosen storage | P5 complete, runtime storage stable |
| 10 | Move the repository to a GitHub Organization | P8 complete — only if access control feels insufficient |
| 11 | Custom domain for the landing page | P8 complete — needs a budget decision |

## Contributing

Read [`AGENTS.md`](AGENTS.md) first — it is the binding rulebook for both humans and AI agents
working in this repository. It lists the required reading order for anyone (or any agent) picking up
this project — seven documents, starting with `CHECKPOINT.md` and ending with `PREEXISTING.md`.

Then see [`CONTRIBUTING.md`](CONTRIBUTING.md).

All changes land through pull requests against `main`. Direct pushes are not permitted.

## License

MIT — see [`LICENSE`](LICENSE).
