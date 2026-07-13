# Task Ledger

| ID | Task | Status | Evidence | Notes |
|---|---|---|---|---|
| SERIES-01 | 連載専用フォルダーと再開可能な制作記録を作る | done_verified | `docs/series/quantum-circuit-ai/`のファイル内容とgit diff | 次は第1回構成の調整 |
| SERIES-02 | 第1回「可能性をプログラムする」の初稿を書く | done_verified | 約5,000字の原稿ファイル、`git diff --check`成功 | 内容はユーザーレビュー待ち |
| SERIES-03 | 第1回初稿をユーザーの語り口へ調整する | in_progress | `SERIES_STATE.md` | レビュー待ち |
| BC-01 | Existing automated test suite | done_verified | 5/5 Node test suites passed | Before documentation update |
| BC-02 | Browser smoke validation | done_verified | Headless Chrome DOM and screenshot | All five major UI sections rendered |
| BC-03 | Documentation reconciliation | done_verified | README/roadmap diff; post-edit tests pass | Unimplemented roadmap items remain open |
| BC-04 | Initial project checkpoint commit | done_verified | Commit `c554877`; post-commit tests pass | Final whitespace cleanup follows |
| BC-05 | Publish v0.4 checkpoint to GitHub | done_verified | Remote branch; draft PR #1 | `https://github.com/AwakeningOS/blochcraft/pull/1` |
| BC-06 | Separate-window intent-driven Quest prototype | abandoned | User explicitly rejected and requested full deletion | Removed from active app |
| BC-07 | Lab-first bottom purpose paths and common Quest window | abandoned | Superseded by user correction | Removed from active app |
| BC-08 | Calm explanatory copy structure | abandoned | User rejected overall design | Removed from active app |
| BC-09 | Three-qubit editor command audit | done_verified | `src/circuit.js` and `src/gates.js` inspected | Existing set was partial |
| BC-10 | Complex amplitudes and standard single-qubit gates | done_verified | 5/5 tests; automated browser H/S/RX(35°) | Includes measurement, relationship, codegen propagation |
| BC-11 | Synchronized rotation-angle controls | done_verified | Browser preset/slider/number/RZ/code check; 5/5 tests | −360°..360°, 1° step, 11 presets |
| BC-12 | Responsive rotation-control layout | done_verified | 1067px geometry: last preset inside card; no horizontal overflow | Fix from user screenshot |
| BC-13 | Circuit-to-sphere angle and start-state sync | done_verified | Browser RY137°; H->RY prestate east; manual slider restore | Manual start controls retained |
| BC-14 | Restore editor-to-Operation-select sync | done_verified | Browser exact buttons/select/badge including six CNOT directions | Regression reported by user |
| BC-15 | Variable circuit columns for three qubits | done_verified | Browser add/insert/delete; 16-column step+scroll; 5/5 tests | Initial 8, UI cap 64 |
