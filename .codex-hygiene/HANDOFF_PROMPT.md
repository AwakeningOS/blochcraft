# Handoff Prompt

## User Goal

Build an intent-driven BlochCraft learning experience where a learner starts
from what they want to cause and opens the free Lab in a separate window.

## Current Task

Have the user try Quest 01 and refine it from direct feedback.

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
- Quest 01 and Lab are separate windows connected with same-origin postMessage.
- Browser automation verified H(A), CNOT(A->B) produces MISSION COMPLETE.
- Node tests pass 6/6 including Quest evaluation.

## Files Touched

- `.codex-hygiene/*`

## Current Status

Validation and GitHub publication are complete. Draft PR #1 targets `main`:
`https://github.com/AwakeningOS/blochcraft/pull/1`.

## Next Actions

1. Push the Quest prototype to draft PR #1.
2. Ask the user to try it and follow their refinement direction.
3. Do not replace the purpose-first design with a conventional syllabus.

## Do Not Assume

- Do not assume every roadmap item is complete merely because a related module exists.

## Quarantined / Unverified Claims

- Existing README and roadmap status are current.
