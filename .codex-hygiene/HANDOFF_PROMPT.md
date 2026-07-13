# Handoff Prompt

## User Goal

Continue BlochCraft development.

## Current Task

Select the next roadmap feature after the validated v0.4 checkpoint.

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

## Files Touched

- `.codex-hygiene/*`

## Current Status

Validation and the initial checkpoint commit are complete. GitHub CLI auth is
invalid, so push and draft PR creation are pending re-authentication.

## Next Actions

1. Run `gh auth login -h github.com` and confirm `gh auth status` succeeds.
2. Push `agent/blochcraft-v0-4` and open a draft PR to `main`.
3. Preserve the tested v0.4 baseline while selecting the next roadmap feature.

## Do Not Assume

- Do not assume every roadmap item is complete merely because a related module exists.

## Quarantined / Unverified Claims

- Existing README and roadmap status are current.
