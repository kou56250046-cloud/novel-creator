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

**通常の本（1ファイル完結）**

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

**シリーズ本（章ごとに分割）**

`chapters` 配列を追加するだけでシリーズモードになります：

```json
{
  "slug": "your-book-slug",
  "title": "本のタイトル",
  "subtitle": "サブタイトルまたは英題",
  "description": "短い説明文（100字程度）",
  "tags": ["歴史", "宗教", "文化"],
  "coverColor": "#1a1a2e",
  "publishedAt": "2024-01-01",
  "chapters": [
    { "id": "chapter-1", "title": "第一章　〇〇", "description": "章の説明（省略可）" },
    { "id": "chapter-2", "title": "第二章　〇〇", "description": "章の説明（省略可）" }
  ]
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
  urban-legend.md   ← 都市伝説系（若年層〜社会人向け）
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

## 3. シリーズ本のコンテンツ構造

シリーズ本は章ごとにフォルダを分けてMDファイルを配置します：

```
content/books/<slug>/
  _meta.json          ← chapters配列あり
  chapter-1/
    drama.md
    lightnovel.md
    ...
  chapter-2/
    drama.md
    lightnovel.md
    ...
```

- フォルダ名は `_meta.json` の `chapters[].id` と完全一致させる
- 各章に全ジャンルを用意する必要はない（あるファイルだけが公開される）
- 読書ページには「前の章 / 目次に戻る / 次の章」ナビが自動で付く

---

## 4. ファイル構成の更新について

ジャンルを追加・変更した場合は以下の4箇所を同時に更新してください：

1. `lib/books.ts` — `LEVELS` 配列にIDを追加
2. `app/books/[slug]/GenreSelectorClient.tsx` — セレクター画面にカードを追加
3. `app/books/[slug]/[segment]/ReadingClient.tsx` — `ALL_LEVELS` 配列に追加
4. 各本の `content/books/<slug>/` に `<id>.md` を追加

---

## 5. ファイル・ディレクトリ構成

```
novel-creator/
├── app/
│   ├── page.tsx                         ← トップページ（本棚）
│   ├── books/[slug]/
│   │   ├── page.tsx                     ← シリーズ判定（Server Component）
│   │   ├── GenreSelectorClient.tsx      ← 非シリーズ: ジャンル選択UI
│   │   ├── ChapterListClient.tsx        ← シリーズ: 章一覧（目次）UI
│   │   └── [segment]/
│   │       ├── page.tsx                 ← 非シリーズ読書 or 章内ジャンル選択
│   │       ├── ReadingClient.tsx        ← 非シリーズ読書UI
│   │       ├── ChapterGenreSelectorClient.tsx ← シリーズ章内ジャンル選択UI
│   │       └── [level]/
│   │           ├── page.tsx             ← シリーズ読書ページ（SSG）
│   │           └── SerialReadingClient.tsx ← 前章/次章ナビ付き読書UI
│   ├── globals.css
│   └── layout.tsx
│
├── content/books/
│   ├── <slug>/                          ← 非シリーズ本
│   │   ├── _meta.json
│   │   ├── drama.md
│   │   └── ...（各ジャンル）
│   └── <slug>/                          ← シリーズ本
│       ├── _meta.json                   ← chapters配列あり
│       ├── chapter-1/
│       │   ├── drama.md
│       │   └── ...
│       └── chapter-2/
│           ├── drama.md
│           └── ...
│
├── lib/
│   └── books.ts                         ← コンテンツ読み込みロジック
│
└── docs/
    └── USAGE.md                         ← このファイル
```

---

## 6. URL構造

**非シリーズ本**

| URL | 内容 |
|-----|------|
| `/` | 本棚トップ |
| `/books/<slug>` | ジャンル選択 |
| `/books/<slug>/folktale` | 昔話風 |
| `/books/<slug>/comedy-kids` | コメディ |
| `/books/<slug>/mystery` | ミステリー |
| `/books/<slug>/lightnovel` | ラノベ系 |
| `/books/<slug>/urban-legend` | 都市伝説系 |
| `/books/<slug>/social-comedy` | 社会あるあるコメディ |
| `/books/<slug>/drama` | ドラマ |
| `/books/<slug>/life-drama` | 人生ドラマ |
| `/books/<slug>/black-company` | ブラック企業系 |

**シリーズ本**

| URL | 内容 |
|-----|------|
| `/books/<slug>` | 章一覧（目次） |
| `/books/<slug>/chapter-1` | 第1章のジャンル選択 |
| `/books/<slug>/chapter-1/drama` | 第1章・ドラマで読む |
| `/books/<slug>/chapter-2/drama` | 第2章・ドラマで読む |

---

## 7. トラブルシューティング

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

## 8. 本番URL・リポジトリ

| 項目 | URL |
|-----|-----|
| 本番URL | https://novel-creator-rouge.vercel.app |
| GitHub | https://github.com/kou56250046-cloud/novel-creator |
| Vercel | https://vercel.com/kou56250046-clouds-projects/novel-creator |

---

## 9. コンテンツ依頼テンプレート

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

---

### シリーズ本を新規追加する場合

```
以下のシリーズ本を追加してください。

- slug（フォルダ名）: （例: world-history）
- タイトル: （例: 世界史大全）
- 章の構成:
  - chapter-1: 第一章　〇〇（説明: 〇〇）
  - chapter-2: 第二章　〇〇（説明: 〇〇）
  - （以降の章も同様に）
- 生成するジャンル: （例: drama, lightnovel のみ、またはすべて）

各章の原文テキスト:

【chapter-1】
（ここにPDFから抽出したテキストを貼り付ける）

【chapter-2】
（ここにPDFから抽出したテキストを貼り付ける）
```

> 章数が多い場合は1章ずつ依頼しても構いません。その際は slug・chapter-id・タイトルを毎回明記してください。

---

### シリーズ本の特定の章だけ追加・修正する場合

```
以下の章のコンテンツを生成（または修正）してください。

- slug: （例: world-history）
- chapter-id: （例: chapter-3）
- 章タイトル: （例: 第三章　〇〇）
- ジャンル: （例: drama / black-company など）
- 変更内容・要望:
（例: もっとテンポよく、感動シーンを増やしてほしい）

原文テキスト:
（ここにテキストを貼り付ける）
```
