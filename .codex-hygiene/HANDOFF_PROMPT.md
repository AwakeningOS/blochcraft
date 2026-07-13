# Handoff Prompt

## User Goal

Remove the rejected Quest prototype and make the three-qubit circuit editor
substantially more complete.

## Current Task

Audit and agree on the circuit editor command set before expanding it.

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
- Current editor supports only a partial gate set: RY fixed angles, X, Z, H,
  all six directed CNOT pairs, one fixed Toffoli, delete, and clear-all.
- Quest removal is verified by repository search; remaining tests pass 5/5.

## Files Touched

- `.codex-hygiene/*`

## Current Status

Validation and GitHub publication are complete. Draft PR #1 targets `main`:
`https://github.com/AwakeningOS/blochcraft/pull/1`.

## Next Actions

1. Verify the deletion and run the remaining tests.
2. Agree on the editor command categories and first expansion slice.
3. Do not restore Quest work unless explicitly requested.

## Do Not Assume

- Do not assume every roadmap item is complete merely because a related module exists.

## Quarantined / Unverified Claims

- Existing README and roadmap status are current.
