# Handoff Prompt

## User Goal

Remove the rejected Quest prototype and make the three-qubit circuit editor
substantially more complete.

## Current Task

Continue expanding the verified complex-amplitude three-qubit editor.

## Hard Constraints

- Evidence over stale documentation.
- Do not claim browser validation until it is actually run.
- Final work must be published to `https://github.com/AwakeningOS/blochcraft`.

## Verified Facts

- Existing Node tests pass 5/5.
- Project files are untracked on `main`; only initial commit exists.
- The original README/roadmap descriptions conflicted with the v0.4 footer
  and modules; they have now been reconciled.
- Headless browser smoke validation rendered all five major sections.
- README and roadmap were reconciled with the source.
- Post-edit Node tests pass 5/5 and `git diff --check` is clean.
- Initial project checkpoint is commit `c554877`.
- Remote branch `agent/blochcraft-v0-4` and draft PR #1 are published.
- User explicitly rejected and deleted the Quest direction.
- Complex amplitudes are supported throughout simulation, measurement,
  relationship metrics, and display.
- Editor supports X/Y/Z/H/S/S†/T/T†, arbitrary-angle RX/RY/RZ, six directed
  CNOT pairs, one Toffoli, delete, and clear-all.
- Browser automation verified H/S/RX(35°), complex amplitude display, Bloch Y,
  and matching Qiskit output.
- RX/RY/RZ use synchronized number, −360°..360° slider, and 11 clickable
  representative-angle controls; browser synchronization is verified.
- Responsive angle layout is verified at 1067 px with no card/page overflow;
  this fixes a user-provided screenshot showing collapsed text and clipping.
- Editor rotation angle drives upper-sphere rotation; a selected circuit
  operation uses the target qubit's pre-column Bloch vector as its start.
- Manual start sliders clear the circuit-derived start and remain usable.
- Quest removal is verified by repository search; remaining tests pass 5/5.

## Files Touched

- `.codex-hygiene/*`

## Current Status

Validation and GitHub publication are complete. Draft PR #1 targets `main`:
`https://github.com/AwakeningOS/blochcraft/pull/1`.

## Next Actions

1. Push the synchronized rotation-angle controls.
2. Add CZ/SWAP or editor undo/move/copy based on the user's choice.
3. Do not restore Quest work unless explicitly requested.

## Do Not Assume

- Do not assume every roadmap item is complete merely because a related module exists.

## Quarantined / Unverified Claims

- Existing README and roadmap status are current.
