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

Two layers make that possible:

- **A context layer.** Weebo integrates [Meterless](https://github.com/Meterless/Meterless) engines —
  hierarchical memory (H-MEM), world modelling, reasoning compression, and intent detection — so the
  agent carries durable context instead of re-deriving it every turn.
- **A data layer.** Weebo integrates [Zetaris](https://www.zetaris.com/) as a data harness, so the
  agent can query live, governed data across sources without those sources being copied or
  centralized first.

Weebo is the harness that binds the two: the agent loop, the tool policy, the scheduler, and the
surface you actually talk to.

## Why another agent?

Personal agents are good at conversations. Work rarely lives in conversations.

Most of what a person needs an agent to answer sits in scattered systems — a Postgres table here, a
parquet file there, a partner API nobody documented. An agent that can chat but cannot reach that
data is a clever toy. Weebo closes that gap by treating **data access as a first-class connector**
rather than an afterthought.

| Capability | Chat assistants | Personal agent apps | Weebo |
|---|---|---|---|
| Multi-channel reach (chat apps, CLI, web) | Partial | Yes | Planned |
| Persistent memory across sessions | Partial | Yes | Yes — via Meterless H-MEM |
| Scheduled, unattended work | No | Yes | Planned |
| Bring your own key (BYOK) | Rare | Rare | Yes |
| Governed access to scattered enterprise data | No | No | Yes — via Zetaris |
| Runs on desktop, tablet, and phone from one codebase | Rare | Rare | Planned (PWA first) |
| Self-hostable, open source | Rare | Rare | Yes — MIT |

## How it fits together

Weebo is one runtime with several clients. The runtime owns everything that needs a real machine —
scheduling, filesystem, secrets, MCP connectors. Clients are thin.

```
npx weebo serve          → local runtime (Node)
       │
       ├── npx weebo      → CLI, for developers and scripting
       ├── web app        → PWA, installable on phone and desktop
       └── desktop app    → Electron, after the hackathon
```

This is why a browser tab is enough to drive an agent that keeps working: the work happens in the
runtime, not in the tab.

## Project status

Honest labels, no marketing:

| Area | Status |
|---|---|
| Repository scaffolding, architecture, and decision records | Done |
| Sponsor technology accounts and access verification | In progress |
| Agent core (loop, tool registry, policy, audit) | Not started |
| Memory and reasoning (Meterless H-MEM, Markovian) | Not started |
| Data connector (Zetaris MCP/REST) | Not started |
| Application surface (PWA) | Not started |
| Scheduler, channels, free-tier gateway | Not started |
| Landing page | Not started |

See [`docs/PHASES.md`](docs/PHASES.md) for the phase framework and exit criteria.

## Architecture

Weebo is a TypeScript monorepo. The agent core is isomorphic so the same runtime can execute in a
Node host and in the browser.

```
apps/
  runtime/      Local server — agent loop, scheduler, MCP connectors, secrets
  cli/          Terminal client: `npx weebo` and `npx weebo serve`
  web/          PWA client — one surface for desktop, tablet, and phone
  landing/      Astro marketing site (public face of the project)
packages/
  core/         Isomorphic agent loop: intent → memory → plan → tool → verify
  protocol/     Versioned contract between the runtime and every client
  meterless/    Adapter over Meterless engines (vendored, never edited in place)
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
| **NVIDIA Nemotron** | Free-tier model path via NVIDIA NIM; the default zero-setup experience |
| **Cursor** | Development environment used to build Weebo |

Integration evidence, transcripts, and the exact call sites live in
[`docs/SPONSORS.md`](docs/SPONSORS.md). Account setup: [`docs/SETUP-SPONSORS.md`](docs/SETUP-SPONSORS.md).

## Quickstart

Not yet available — there is no product code in this repository yet. This section will be replaced
with real instructions once the walking skeleton lands. We will not publish commands that have not
been executed.

## Roadmap

Near term (hackathon window):

1. Walking skeleton — one thin end-to-end path, driven from the terminal
2. Agent core — tool registry, policy allow/deny, audit log, runtime protocol
3. Memory and reasoning — cross-session recall and explainable answers
4. Application surface — responsive PWA client
5. Autonomy — headless scheduling, channel bridges, free-tier gateway

Beyond the hackathon:

- Native desktop shell and Android build on the same monorepo
- Connector catalogue beyond MCP basics
- Cloud sync for user-chosen storage

## Contributing

Read [`AGENTS.md`](AGENTS.md) first — it is the binding rulebook for both humans and AI agents
working in this repository. Then see [`CONTRIBUTING.md`](CONTRIBUTING.md).

All changes land through pull requests against `main`. Direct pushes are not permitted.

## License

MIT — see [`LICENSE`](LICENSE).
