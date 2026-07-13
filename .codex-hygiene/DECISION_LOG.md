# Decision Log

## Decision: 連載のシリーズ名と題名形式

- Context: ユーザーが第1回の正式題名とシリーズ名の方向を指定した。
- Options considered: AI時代を前面に出す総題、量子回路プログラミング講座。
- Decision: シリーズ名を「量子回路プログラミング講座」とし、`【第○回】量子回路プログラミング講座：今回の問い？`形式にする。
- Reason: 連載内容が直接伝わり、各回の問いも題名で明確になる。
- Evidence: 2026-07-13のユーザー指定。
- Reversible: Yes。ユーザーの明示指示で変更可能。

## Decision: 連載をリポジトリ内で管理する

- Context: ユーザーが、次のエージェントも現在地を理解できる連載用フォルダーと記録を求めた。
- Options considered: 会話履歴だけに残す、別リポジトリを作る、BlochCraft内の`docs/series/`で管理する。
- Decision: `docs/series/quantum-circuit-ai/`で思想・状態・記事一覧・原稿を分離管理する。
- Reason: アプリ、公開URL、記事内の操作説明を同じ履歴で同期でき、追加の外部リポジトリを必要としない。
- Evidence: 2026-07-13のユーザー指示。作成されたフォルダーとファイル。
- Reversible: Yes。将来、記事専用リポジトリへ移動可能。

## Decision: 記事は問いと目的から構成する

- Context: ユーザーはAIや専門家が既存の常識的用途へ偏ることを問題視した。
- Options considered: ゲート順、数式順、既存アルゴリズム順、問いと目的順。
- Decision: 「何を起こしたいか」からBlochCraft実験、意味、コード、AI実装へ進む。
- Reason: ユーザーが明示した連載の中心思想に一致する。
- Evidence: 2026-07-13のユーザー発言。
- Reversible: Yes。ただし変更にはユーザー確認が必要。

## Decision

- Context: README says v0.3, footer says v0.4, and roadmap checkboxes lag source.
- Options considered: Update docs immediately; validate source behavior first.
- Decision: Validate browser behavior before reconciling documentation.
- Reason: Documentation must reflect observed functionality.
- Evidence: File inspection and passing unit tests.
- Reversible: Yes.
