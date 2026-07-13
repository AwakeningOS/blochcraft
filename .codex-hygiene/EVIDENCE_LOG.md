# Evidence Log

## Evidence Entry

- Time: 2026-07-13 JST
- Action: Inspected repository state and ran the existing automated tests.
- Evidence: `git status -sb` showed all project files untracked; `node --test tests/*.test.mjs` passed 5/5 suites.
- Files: `README.md`, `docs/ROADMAP.md`, `index.html`, `src/*`, `tests/*`
- Result: Existing source is test-clean; browser behavior and documentation remain to be validated.

## Evidence Entry

- Time: 2026-07-13 JST
- Action: Served BlochCraft locally and rendered it with headless Chrome.
- Evidence: Generated DOM and `/tmp/blochcraft.png`; gate lab, circuit composer, relationship vault, measurement lab, and Qiskit code were populated.
- Files: `index.html`, `src/*`
- Result: Browser smoke validation passed by DOM and visual inspection.

## Evidence Entry

- Time: 2026-07-13 JST
- Action: Reconciled documentation and repeated validation.
- Evidence: `node --test tests/*.test.mjs` passed 5/5; `git diff --check` returned no errors; project size excluding `.git` is about 148 KB.
- Files: `README.md`, `docs/ROADMAP.md`
- Result: Documentation now matches verified v0.4 functionality while future items remain unchecked.

## Evidence Entry

- Time: 2026-07-13 JST
- Action: Created and checked the initial BlochCraft project checkpoint.
- Evidence: Commit `c554877`; subsequent 5/5 Node tests passed; three harmless end-of-file blank-line warnings were found and removed; `git diff --check` then returned no errors.
- Files: All v0.4 project files; `tests/circuit.test.mjs`, `tests/math3d.test.mjs`, `tests/relationship.test.mjs`
- Result: v0.4 checkpoint is committed and final cleanup is test-verified.

## Evidence Entry

- Time: 2026-07-13 JST
- Action: Checked GitHub publication prerequisites after the user named the final remote.
- Evidence: `origin` is `https://github.com/AwakeningOS/blochcraft.git`; `gh auth status` reports the AwakeningOS token is invalid.
- Files: Git remote configuration.
- Result: Local commits can continue, but push/PR publication is blocked until `gh auth login -h github.com` succeeds.

## Evidence Entry

- Time: 2026-07-13 JST
- Action: Completed GitHub CLI web authentication.
- Evidence: `gh auth login` reported `Authentication complete` and `Logged in as AwakeningOS`.
- Files: GitHub CLI authentication configuration.
- Result: Publication blocker cleared; push and draft PR are authorized.

## Evidence Entry

- Time: 2026-07-13 JST
- Action: Published the validated v0.4 checkpoint.
- Evidence: `git push` created remote branch `agent/blochcraft-v0-4`; `gh pr create --draft` returned `https://github.com/AwakeningOS/blochcraft/pull/1`.
- Files: Commits on `agent/blochcraft-v0-4`.
- Result: BlochCraft v0.4 is available on GitHub in draft PR #1 targeting `main`.

## Evidence Entry

- Time: 2026-07-13 JST
- Action: Implemented and browser-tested the first intent-driven separate-window Quest.
- Evidence: 6/6 Node tests passed. Chrome DevTools automation opened `quest.html`, clicked the Lab launcher, created H(A) then CNOT(A->B), and returned `{status: "MISSION COMPLETE", passed: 3}` from the Quest window.
- Files: `quest.html`, `src/quest.js`, `src/quest-engine.js`, `src/quest.css`, `src/app.js`, `index.html`, `tests/quest-engine.test.mjs`
- Result: Quest and Lab communicate in real time; the secret-signal mission detects its three outcome conditions without exposing the answer circuit upfront.

## Evidence Entry

- Time: 2026-07-13 JST
- Action: Reworked navigation from user feedback so Lab is first and purpose paths live at the bottom.
- Evidence: 6/6 tests passed. Browser automation reported Lab `paths: 3`, `topLink: false`, bottom heading `次は、何を起こしたい？`; clicking `open-choice` opened the common Quest URL with the matching title, three conditions, and `LABから観測中`.
- Files: `index.html`, `src/app.js`, `src/learning.css`, `quest.html`, `src/quest.js`, `src/quest-engine.js`, `tests/quest-engine.test.mjs`
- Result: The experiment window is the primary app; purpose selection at its bottom opens a reusable purpose window.
