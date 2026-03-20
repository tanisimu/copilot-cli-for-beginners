---
name: data-validator
description: |
  data.json 内のデータを検査し、欠落や形式不良を検出するエージェントです
---

# データバリデーター (data-validator) エージェント仕様

## 概要
データバリデーターは、プロジェクト内の JSON データ（デフォルト: data.json）を検査し、欠落や形式不良を検出する Copilot エージェントです。主なチェック対象は以下です：著者名が空欄、年(year) が 0 または不正、必須フィールドの欠落、型の不一致、配列・オブジェクトの構造異常。

## 目的
- data.json の品質を維持し、誤ったデータが流通するのを防ぐ
- Pull Request / CI で早期に問題を検出して修正を促す

## 入力パラメータ
- file: 検証対象 JSON ファイルのパス（デフォルト: ./data.json）
- schema: 任意の JSON Schema ファイル（指定があれば優先して適用）
- fail_on_warning: true/false（警告でも CI を失敗扱いにするか）

## 出力形式（JSON 推奨）
- valid: boolean
- errors: array of { path, message, severity }
- summary: "X errors, Y warnings"

例:
{
  "valid": false,
  "errors": [
    {"path":"[0].author","message":"author is empty","severity":"error"},
    {"path":"[2].year","message":"year must be > 0","severity":"error"}
  ],
  "summary":"2 errors, 0 warnings"
}

## デフォルト検証ルール
- 必須フィールド: title, author, year
- author: 非空文字列（空文字列は error）
- year: 正の整数 (> 0)。0 は error
- title: 非空文字列
- 型違いは warning（設定で error に昇格可能）
- 配列内は各要素を個別に検証

## 重大度
- error: 直ちに修正が必要（CI 失敗の対象）
- warning: 修正推奨（報告のみ）
- info: 情報提供

## 実行例
- ローカル（Python 実装例）:
  python tools/validate_data.py --file ./data.json --schema ./data.schema.json
- Node 実装例:
  node tools/validate-data.js --file ./data.json

## CI 統合の勧め
- Pull Request に対して data.json が変更されたときに実行
- error があればジョブを失敗させる
- warning はコメントで通知する設定が便利

## レポートの設計
- 各エラーに JSONPath または配列インデックスを付与
- 修正ヒントを短く添える（例: "author が空です — 著者名を追加してください"）

## テストケース（必須）
1. author が空文字列 → error
2. year = 0 → error
3. title 欠落 → error
4. year が文字列 "2020" → warning または error（プロジェクト方針による）

## 拡張候補
- JSON Schema による厳密検証サポート
- CSV/YAML 対応
- 自動修正（安全に変換できる場合のみ）

## 注意点
- 読み取り専用で動作すること（ファイルを破壊しない）
- 機密データを含む場合、CI ログに全データを吐き出さない

---
この仕様に基づき、実装スクリプト（tools/validate_data.py 等）や GitHub Actions ワークフローを追加すると CI に統合できます。
