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

## Evidence Entry

- Time: 2026-07-13 JST
- Action: Reworked the purpose-flow copy and information order after user discussion.
- Evidence: User chose a calm guide voice and authorized building the broad structure before detailed language refinement. 6/6 tests passed. Browser inspection found Lab heading `この実験台で作れる現象`, two continuity paragraphs, three cards; purpose window contained `進め方`, `成立条件`, `現在の確認結果`, `手がかりを見る`, live Lab status, and no `#open-lab` button.
- Files: `index.html`, `quest.html`, `src/learning.css`, `src/quest.css`, `src/quest.js`, `README.md`
- Result: The agreed information architecture is implemented; detailed Japanese wording remains intentionally open to user refinement.

## Evidence Entry

- Time: 2026-07-13 JST
- Action: User rejected the Quest direction and requested full deletion and a circuit-editor command audit.
- Evidence: Explicit user instruction: `全削除して。まず3量子ビット回路エディターを充実させようか`.
- Files: Removed `quest.html`, `src/quest.js`, `src/quest-engine.js`, `src/quest.css`, `tests/quest-engine.test.mjs`; removed Quest UI/communication/docs references.
- Result: Quest work is abandoned and quarantined; current work returns to the three-qubit editor.

## Evidence Entry

- Time: 2026-07-13 JST
- Action: Verified complete removal of the rejected Quest feature.
- Evidence: Repository-wide active-app search returned no Quest/purpose UI references; remaining Node suite passed 5/5; `git diff --check` returned no errors.
- Files: `index.html`, `src/app.js`, `src/learning.css`, `src/styles.css`, `README.md`, `docs/ROADMAP.md`; deleted Quest source and test files.
- Result: Active application is again the single BlochCraft Lab with no Quest entry point or runtime code.

## Evidence Entry

- Time: 2026-07-13 JST
- Action: Expanded the three-qubit editor to complex amplitudes and standard single-qubit gates.
- Evidence: Node tests passed for H/CNOT/GHZ, Y and S/S† phases, RX/RY/RZ, +i measurement, relationship Y component, Qiskit generation, and gate normalization. Browser automation placed H, S, RX(35°) and reported 20 commands, complex amplitudes, A Bloch `(X,Y,Z)=(0.00,0.82,0.57)`, and `qc.rx(35 * pi / 180, 0)`.
- Files: `src/complex.js`, `src/circuit.js`, `src/relationship.js`, `src/measurement.js`, `src/codegen.js`, `src/gates.js`, tests and docs.
- Result: Standard phase-sensitive single-qubit operations now propagate consistently across simulation, visualization, measurement, and generated code.

## Evidence Entry

- Time: 2026-07-13 JST
- Action: Added synchronized rotation-angle controls for RX/RY/RZ.
- Evidence: Browser automation reported range `{min:-360,max:360,step:1}`, 11 representative-angle buttons, preset −90° syncing number/slider/active state, slider 137° syncing number, number −22° syncing slider, placed label `RZ(−22°)`, and matching Qiskit code. Node tests passed 5/5.
- Files: `src/circuit.js`, `src/learning.css`, docs.
- Result: Learners can set coarse standard angles quickly or enter fine angles precisely without the controls drifting apart.
