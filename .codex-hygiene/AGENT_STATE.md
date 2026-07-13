# Agent State

## Current User Goal

Remove the purpose/Quest prototype and focus on making the three-qubit circuit
editor substantially more complete.

## Current Task

Complete and verify the first circuit-editor expansion: complex amplitudes and
standard single-qubit gates.

## Hard Constraints

- Preserve the existing implementation and verify before claiming completion.
- Do not infer functionality from documentation when source or tests disagree.
- Publish final work to `https://github.com/AwakeningOS/blochcraft`.

## Current Repo / Directory

`/home/youthk/デスクトップ/blochcraft`

## Files Touched

- `.codex-hygiene/*`

## Known Verified Facts

- Branch `main` matches `origin/main` at initial commit `44cf6d9`.
- Project files are currently untracked.
- `node --test tests/*.test.mjs` passed 5/5 suites on 2026-07-13.
- `index.html` identifies the UI as BlochCraft v0.4.
- Headless Chrome rendered the gate lab, circuit composer, relationship vault,
  measurement lab, and Qiskit code bridge.
- README and roadmap now reflect verified implementation status.
- Post-documentation tests passed 5/5; `git diff --check` found no errors.
- Initial project checkpoint commit is `c554877`.
- Branch `agent/blochcraft-v0-4` is pushed and draft PR #1 is open.
- Quest 01 asks the learner to share a secret signal between A and B without
  presenting a gate syllabus first.
- Automated browser interaction verified Quest -> Lab opening, live circuit
  state transfer, and `MISSION COMPLETE` after H(A), CNOT(A->B).
- Node tests pass 6/6 including the quest evaluator.
- The Lab is again the initial screen; three purpose paths are at its bottom.
- All purpose buttons open one common Quest window whose content changes by
  query-selected purpose.
- Browser automation verified three bottom paths, no top Quest link, and the
  `open-choice` purpose loading in the shared Quest window.
- User selected a calm experimental-guide voice and asked to prioritize the
  overall structure before detailed Japanese copyediting.
- Purpose flow now explains continuity from Lab to the separate window.
- Shared purpose window order is: phenomenon, how to proceed, conditions,
  current result, optional clue.
- Game-like wording and the nonfunctional return-to-Lab button were removed.
- Browser inspection verified the new labels, no return button, three purpose
  cards, and live Lab connection.
- User rejected the Quest design and explicitly requested full deletion.
- Quest UI, state messaging, evaluator, styles, tests, README, and roadmap
  references have been removed from the active app.
- Repository-wide active-app search found no remaining Quest/purpose UI references.
- Remaining non-Quest test suite passes 5/5 and `git diff --check` is clean.
- State vectors now use complex amplitudes throughout circuit simulation,
  relationship metrics, arbitrary-basis measurement, and display.
- Editor now provides X/Y/Z/H/S/S†/T/T† and angle-input RX/RY/RZ while
  preserving six CNOT directions and Toffoli.
- Browser automation verified 20 commands, RX(35°) placement, complex
  amplitude display, Bloch Y component, and matching Qiskit output.
- Rotation editor now synchronizes a −360°..360° one-degree slider,
  fine-grained number input, and 11 clickable representative angles.
- Browser automation verified preset −90°, slider 137°, number −22°,
  placed `RZ(−22°)`, and matching Qiskit output.
- User screenshot exposed rotation-control overflow and vertically collapsed
  description text at a 1067 px viewport.
- Rotation tool layout now uses a two-row grid; browser geometry at 1067 px
  verifies all 11 presets inside the card and no page/card horizontal overflow.
- Editor rotation angle now drives the upper sphere's axis, trajectory, and
  endpoint without conflating it with the initial-state controls.
- Placing/selecting a circuit operation sends its pre-column target-qubit
  Bloch vector to the sphere as an automatic start position.
- Touching either manual start slider clears the circuit-derived start state.
- Browser verified RY 137° sync, H(A)->RY(A) start `(1,0,0)`, and manual
  slider restoration to 30°.
- A regression left the upper Operation select visually unchanged while the
  sphere itself followed editor selections; the user reported it immediately.
- Operation select synchronization is restored for every editor tool,
  including explicit RX/RY/RZ entries and all six directed CNOT entries.
- Browser verified X, S†, RX/RY/RZ, CNOT, Toffoli, RY 123°, and exact CNOT
  directions B->A and C->B across editor button, select, badge, and sphere.
- User chose three qubits as the natural fixed width while allowing circuit
  time/depth to grow beyond eight columns.
- Editor now starts at 8 columns and supports +1/+4, insert before/after,
  selected-column delete, column numbering, local horizontal scroll, and a
  64-column UI cap.
- Browser verified 8->12->13 insertion/deletion behavior and 8->16 expansion;
  step max/value follow 16, circuit scrolls locally, page does not overflow.

## Current Blockers

None.

## Next 1-3 Actions

1. Commit and push the three-qubit fixed-width, variable-column editor.
2. Let the user inspect column controls and depth display.
3. Next candidate: CZ/SWAP, then editor undo/move/copy operations.

## Last Updated

2026-07-13 JST
