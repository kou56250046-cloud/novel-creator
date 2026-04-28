# 文庫閣 — システム使用ガイド

## 概要

**文庫閣**は、スキャン済みPDFの内容をAIが複数のスタイルに変換し、Webで公開するプラットフォームです。

```
PDF（ローカル）
  → Pythonで抽出
  → このチャットでClaudeに貼り付け
  → スキルで変換方針を確認
  → MDファイルを生成
  → GitHubにコミット
  → Vercel自動デプロイ → URL公開
```

---

## 1. 新しい本を追加する手順

### Step 1｜PDFのテキストを抽出する

ターミナルで以下のPythonスクリプトを実行します（PyMuPDFが必要）：

```python
import fitz, re
from html import unescape

path = r"C:\path\to\your\book.pdf"
doc = fitz.open(path)
print(f"総ページ数: {len(doc)}")

all_text = []
for i in range(len(doc)):
    html = doc[i].get_text("html")
    text = re.sub(r"<[^>]+>", " ", html)
    text = unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    if text:
        all_text.append(f"=== P{i+1} ===\n{text}")

with open("extract.txt", "w", encoding="utf-8") as f:
    f.write("\n\n".join(all_text))
```

> **注意：** 抽出されたテキストを確認し、文字化けがないことを確かめてください。

### Step 2｜メタデータファイルを作成する

`content/books/<slug>/_meta.json` を作成します：

```json
{
  "slug": "your-book-slug",
  "title": "本のタイトル",
  "subtitle": "サブタイトルまたは英題",
  "description": "短い説明文（100字程度）",
  "tags": ["歴史", "宗教", "文化"],
  "coverColor": "#1a1a2e",
  "publishedAt": "2024-01-01"
}
```

`coverColor` はカードの背景色（暗めの色を推奨）。

### Step 3｜トップページに本を追加する

`app/page.tsx` の `BOOKS` 配列に追記します：

```typescript
const BOOKS = [
  // 既存の本...
  {
    slug: "your-book-slug",
    title: "本のタイトル",
    subtitle: "サブタイトル",
    tags: ["歴史", "文化"],
    color: "#1a1a2e",
    accent: "#c9a96e",
  },
];
```

### Step 4｜スキルを使ってコンテンツを生成する

このチャット（Claude Code）で以下を実行：

```
/generate-age-content your-book-slug 本のタイトル
```

→ 作成方針が表示されます。確認・調整後、「進めてください」と返信。

```
/generate-folktale-content your-book-slug 本のタイトル
```

→ 日本昔話風コンテンツを生成。

### Step 5｜GitHubにコミット＆デプロイ

```bash
git add content/books/your-book-slug/ app/page.tsx
git commit -m "〇〇を追加"
git push
```

GitHubにプッシュすると、Vercelが自動でデプロイします（約1〜2分）。

---

## 2. 既存コンテンツを修正する

生成されたMDファイルは直接編集できます。

```
content/books/<slug>/
  kindergarten.md   ← 幼稚園向け
  elementary.md     ← 小学生向け
  middle.md         ← 中学生向け
  high.md           ← 高校生向け
  university.md     ← 大学生向け
  folktale.md       ← 日本昔話風
```

MDファイルの先頭にはフロントマターが必要です：

```yaml
---
title: タイトル
level: elementary
---

本文をここに書く...
```

---

## 3. 新しいスタイルを追加する

`.claude/commands/skills.md` の「今後追加予定のスキル」を参照してください。

新スタイルを追加する際は：

1. `.claude/commands/generate-<style>-content.md` を作成（方針定義）
2. `lib/books.ts` の `LEVELS` に追加
3. `app/books/[slug]/page.tsx` のセレクターに追加
4. `app/books/[slug]/[level]/ReadingClient.tsx` の `ALL_LEVELS` に追加
5. 各本のコンテンツフォルダに `<style>.md` を作成

---

## 4. ファイル・ディレクトリ構成

```
novel-creator/
├── app/
│   ├── page.tsx                    ← トップページ（本棚）
│   ├── books/[slug]/
│   │   ├── page.tsx                ← スタイルセレクター
│   │   └── [level]/
│   │       ├── page.tsx            ← 静的ページ生成（SSG）
│   │       └── ReadingClient.tsx   ← 読書UI（クライアント）
│   ├── globals.css                 ← グローバルスタイル
│   └── layout.tsx                  ← ルートレイアウト
│
├── content/books/                  ← コンテンツ置き場
│   └── <slug>/
│       ├── _meta.json
│       ├── kindergarten.md
│       ├── elementary.md
│       ├── middle.md
│       ├── high.md
│       ├── university.md
│       └── folktale.md
│
├── lib/
│   └── books.ts                    ← コンテンツ読み込みロジック
│
├── .claude/
│   ├── CLAUDE.md                   ← プロジェクト設定・規約
│   └── commands/
│       ├── skills.md               ← スキル一覧
│       ├── generate-age-content.md ← 世代別生成スキル
│       └── generate-folktale-content.md ← 昔話風生成スキル
│
└── docs/
    └── USAGE.md                    ← このファイル
```

---

## 5. URL構造

| URL | 内容 |
|-----|------|
| `/` | 本棚トップ |
| `/books/<slug>` | スタイルセレクター |
| `/books/<slug>/kindergarten` | 幼稚園向け |
| `/books/<slug>/elementary` | 小学生向け |
| `/books/<slug>/middle` | 中学生向け |
| `/books/<slug>/high` | 高校生向け |
| `/books/<slug>/university` | 大学生向け |
| `/books/<slug>/folktale` | 日本昔話風 |

---

## 6. トラブルシューティング

### PDFが文字化けする

HTMLエクストラクション方式を使います：

```python
html = page.get_text("html")   # ← "html"を指定
text = re.sub(r"<[^>]+>", " ", html)
text = unescape(text)           # HTMLエンティティをデコード
```

### ビルドエラーが出る

```bash
npm run build
```

でローカルビルドを確認。エラーが出たら `TypeScript` のエラーメッセージを確認します。

### デプロイが反映されない

```bash
git log --oneline -3   # 最新コミットを確認
git push               # プッシュを確認
```

Vercelのダッシュボードでビルドログを確認してください。

---

## 7. 本番URL・リポジトリ

| 項目 | URL |
|-----|-----|
| 本番URL | https://novel-creator-rouge.vercel.app |
| GitHub | https://github.com/kou56250046-cloud/novel-creator |
| Vercel | https://vercel.com/kou56250046-clouds-projects/novel-creator |
