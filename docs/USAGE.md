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

### Step 4｜このチャットでコンテンツ生成を依頼する

下記「8. コンテンツ依頼テンプレート」のテンプレートをコピーして貼り付けます。

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
  folktale.md       ← 昔話風（幼児向け）
  comedy-kids.md    ← コメディ（子供向け）
  mystery.md        ← ミステリー（若年層向け）
  lightnovel.md     ← ラノベ系（若年層向け）
  isekai.md         ← 異世界転生系（若年層向け）
  social-comedy.md  ← 社会あるあるコメディ（社会人向け）
  drama.md          ← ドラマ（若手社会人向け）
  life-drama.md     ← 人生ドラマ（中年層向け）
  black-company.md  ← ブラック企業系（社会人向け）
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

## 3. ファイル構成の更新について

ジャンルを追加・変更した場合は以下の4箇所を同時に更新してください：

1. `lib/books.ts` — `LEVELS` 配列にIDを追加
2. `app/books/[slug]/page.tsx` — セレクター画面にカードを追加
3. `app/books/[slug]/[level]/ReadingClient.tsx` — `ALL_LEVELS` 配列に追加
4. 各本の `content/books/<slug>/` に `<id>.md` を追加

---

## 5. ファイル・ディレクトリ構成

```
novel-creator/
├── app/
│   ├── page.tsx                    ← トップページ（本棚）
│   ├── books/[slug]/
│   │   ├── page.tsx                ← ジャンルセレクター
│   │   └── [level]/
│   │       ├── page.tsx            ← 静的ページ生成（SSG）
│   │       └── ReadingClient.tsx   ← 読書UI（クライアント）
│   ├── globals.css                 ← グローバルスタイル
│   └── layout.tsx                  ← ルートレイアウト
│
├── content/books/                  ← コンテンツ置き場
│   └── <slug>/
│       ├── _meta.json
│       ├── folktale.md
│       ├── comedy-kids.md
│       ├── mystery.md
│       ├── lightnovel.md
│       ├── isekai.md
│       ├── social-comedy.md
│       ├── drama.md
│       ├── life-drama.md
│       └── black-company.md
│
├── lib/
│   └── books.ts                    ← コンテンツ読み込みロジック
│
├── .claude/
│   ├── CLAUDE.md                   ← プロジェクト設定・規約
│   └── commands/
│       └── skills.md               ← スキル一覧
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
| `/books/<slug>/folktale` | 昔話風 |
| `/books/<slug>/comedy-kids` | コメディ |
| `/books/<slug>/mystery` | ミステリー |
| `/books/<slug>/lightnovel` | ラノベ系 |
| `/books/<slug>/isekai` | 異世界転生系 |
| `/books/<slug>/social-comedy` | 社会あるあるコメディ |
| `/books/<slug>/drama` | ドラマ |
| `/books/<slug>/life-drama` | 人生ドラマ |
| `/books/<slug>/black-company` | ブラック企業系 |

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

---

## 8. コンテンツ依頼テンプレート

このチャットに以下をコピー＆ペーストして依頼してください。

### 新しい本を追加する場合

```
以下の本のコンテンツを全ジャンル分生成してください。

- slug（フォルダ名）: （例: my-book-slug）
- タイトル: （例: 書籍タイトル）
- 原文テキスト:
（ここにPDFから抽出したテキストを貼り付ける）
```

> `_meta.json` と `app/page.tsx` への追記もあわせて依頼できます。

---

### 特定ジャンルだけ追加・修正する場合

```
以下のジャンルのコンテンツを生成（または修正）してください。

- slug: （例: korean-epic）
- ジャンル: （例: isekai / drama / black-company など）
- 変更内容・要望:
（例: もっとコメディ要素を強くしてほしい、〇〇のシーンを追加してほしい）
```

---

### 新しいジャンルを追加する場合

```
新しいジャンルを追加してください。

- ジャンルID（半角英数ハイフン）: （例: horror）
- ジャンル名（日本語）: （例: ホラー）
- 対象読者: （例: 若年層）
- 文体・特徴: （例: 怖い雰囲気、謎が多い、ドキドキする展開）
- 絵文字: （例: 👻）

既存の本「korean-epic」にもこのジャンルのコンテンツを生成してください。
```
