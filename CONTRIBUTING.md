# Contributing to Weebo

Thanks for wanting to help. Weebo is an open-source agent harness, and the rules below keep the
project honest and the repository runnable.

Before anything else, read [`AGENTS.md`](AGENTS.md). It is the binding rulebook for both humans and
AI agents working in this repository.

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
# make changes
git add -A
git commit -m "feat: short description"
git push -u origin feat/short-description
gh pr create --fill
```

- One pull request per concern. Small PRs get reviewed faster.
- A PR needs at least one approving review before it can merge.
- Only the maintainer merges to `main`.
- Do not force-push to `main`.

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
