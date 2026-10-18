# Contributing to Weebo

Thanks for wanting to help. Weebo is an open-source agent harness, and the rules below keep the
project honest and the repository runnable.

Before anything else, read [`AGENTS.md`](AGENTS.md). It is the binding rulebook for both humans and
AI agents working in this repository.

Then read, in this order: [`CHECKPOINT.md`](CHECKPOINT.md) for current status,
[`docs/DECISIONS.md`](docs/DECISIONS.md) for binding decisions,
[`docs/CONTEXT.md`](docs/CONTEXT.md) for the constraints and measurements behind them,
[`docs/PRD.md`](docs/PRD.md) for what we build and for whom, and
[`docs/RULES.md`](docs/RULES.md) for the verified hackathon rules.

## Ground rules

1. **Original work only.** Everything committed here is written by a contributor. Do not copy code,
   visual assets, icons, or text from another product.
2. **Open-source dependencies are fine** — add them through the package manager so licensing and
   attribution stay automatic. Do not paste third-party source into our files.
3. **Do not claim what is not true.** If a feature is not working, it is not "done". README and
   landing-page status must match reality.
4. **Never commit secrets.** API keys, tokens, and credentials belong in `.env` (gitignored) or the
   OS keychain.

## Workflow

`main` is protected. Every change goes through a pull request.

```bash
git switch -c feat/short-description
# make changes — stage files explicitly, never `git add -A`
git add path/to/changed/file
git commit -m "feat: short description"
git push -u origin feat/short-description
gh pr create --fill
```

> **Do not use `git add -A` or `git add .`.** This working tree may contain local learning notes that
> are excluded only on the maintainer's machine. Staging everything can commit third-party material
> into a public repository. Stage files by name.

A pull request can only merge when **all** of these are true:

- At least one approving review, and that approval **must come from the code owner**
  (`@MuhammadFaza-DU`) — see `AGENTS.md` §12.
- CI is green (`Lint, typecheck, test`).
- All review conversations are resolved.
- No force-push to `main`, and `main` cannot be deleted.

Only the maintainer merges to `main`.

## Commit messages

Conventional commits:

| Prefix | Use for |
|---|---|
| `feat:` | new capability |
| `fix:` | bug fix |
| `docs:` | documentation only |
| `refactor:` | no behaviour change |
| `test:` | tests only |
| `chore:` | tooling, dependencies |
| `perf:` | performance |

## Before you open a PR

Run the checks that exist at that point in the project:

```bash
npm run lint
npm run typecheck
npm test
```

If a script does not exist yet, say so in the PR instead of pretending it passed. Report what you
ran and what you could not run.

## Reporting bugs

Open an issue using the bug template. Include:

- what you expected;
- what actually happened;
- steps to reproduce;
- your OS and Node version;
- the exact error text.

## Proposing features

Open an issue using the feature template. Answer one question first: **does this make the agent do
real work, or does it make the chat look nicer?** Weebo is a harness, not a chatbot skin.

## Code expectations

- TypeScript strict mode. Avoid `any`; if you must use it, leave a comment explaining why.
- The agent core (`packages/core`) must stay isomorphic — no direct Node-only APIs. Use an adapter.
- Every tool invocation passes through the policy layer (allow/deny + audit log).
- Do not edit files under `vendor/`. Wrap them instead.

## Questions

Open a discussion or an issue. There are no stupid questions, only undocumented assumptions.
