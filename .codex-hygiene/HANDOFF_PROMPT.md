# Handoff Prompt

## User Goal

BlochCraftを使った量子回路プログラミングの連載を書く。目的は既存アルゴリズムの暗記ではなく、一般の人が量子回路の本質を理解し、自分の用途を発想し、AIに実装を依頼できる判断力を得ること。

## Current Task

`docs/series/quantum-circuit-ai/`を起点に連載を制作する。第1回初稿のユーザーレビューを反映する。

## Hard Constraints

- 「ゲート一覧を順番に覚える」連載にしない。
- 何を作りたいか、可能性・位相・関係・測定をどう操作したいかから逆算する。
- 専門家の既存用途だけを正解として提示しない。
- 読者がコードを全部手書きすることをゴールにしない。
- AI出力を判断するための基礎理解をゴールにする。
- 説明過剰な注意書き、独自用語、意味の薄い抽象文を避ける。

## Verified Facts

- 公開アプリ: https://awakeningos.github.io/blochcraft/
- リポジトリ: https://github.com/AwakeningOS/blochcraft
- ユーザー自身が連載の思想を明示した。詳細は`docs/series/quantum-circuit-ai/SERIES_CHARTER.md`を読むこと。

## Files Touched

- `docs/series/quantum-circuit-ai/`
- `.codex-hygiene/`

## Current Status

第1回初稿は`articles/01-programming-possibilities.md`に存在し、約5,000字。内容はユーザーレビュー待ち。アプリの追加開発は、記事制作中に見つかった具体的な不便がある場合だけ行う。

## Next Actions

1. `SERIES_STATE.md`と第1回初稿を読む。
2. ユーザーの具体的な修正指示を優先する。
3. 修正後も中心思想と編集指針から外れていないか確認する。

## Do Not Assume

- 既存の教科書的カリキュラムがユーザーの望む構成だと仮定しない。
- 「量子を学べばAI時代に安泰」と断言しない。
- Bloch球だけで複数量子ビット全体を完全表示できると書かない。

## Quarantined / Unverified Claims

- 過去のアプリ機能追加計画は連載の現行計画ではない。
