# スキル一覧

このプロジェクトで使えるカスタムスキル（`/コマンド`）の一覧です。

---

## `/generate-age-content`

**用途：** PDFの内容を5世代向け（幼稚園〜大学生）のMDファイルに変換する

**使い方：**
```
/generate-age-content <slug> <本のタイトル>
```

**出力ファイル：**
```
content/books/<slug>/kindergarten.md
content/books/<slug>/elementary.md
content/books/<slug>/middle.md
content/books/<slug>/high.md
content/books/<slug>/university.md
```

**方針ファイル：** `.claude/commands/generate-age-content.md`

---

## `/generate-folktale-content`

**用途：** PDFの内容を日本昔話風の語り口に変換する

**使い方：**
```
/generate-folktale-content <slug> <本のタイトル>
```

**出力ファイル：**
```
content/books/<slug>/folktale.md
```

**文体の特徴：**
- 「むかしむかし〜じゃったとさ」の語り口
- 歴史的人物を昔話キャラクターに置換
- 三段構成（困難→試練→解決）
- 全年齢が楽しめる普遍的な形式

**方針ファイル：** `.claude/commands/generate-folktale-content.md`

---

## 今後追加予定のスキル

| スキル名 | 内容 |
|---------|------|
| `/generate-manga-content` | マンガ風のセリフ・ト書き形式 |
| `/generate-poem-content` | 詩・俳句・短歌風 |
| `/generate-debate-content` | ディベート台本形式 |
| `/generate-summary-content` | 要約・箇条書き形式 |

---

## スキルの追加方法

新しいスキルを追加するには：

1. `.claude/commands/<skill-name>.md` を作成する
2. 以下の構成でファイルを書く：
   - スキルの用途・使い方
   - 作成方針（文体・語彙・構成・内容方針）
   - フロントマター形式
   - 分量の目安
3. `lib/books.ts` の `LEVELS` 配列に追加する
4. `app/books/[slug]/page.tsx` のセレクターに追加する
5. `app/books/[slug]/[level]/ReadingClient.tsx` の `ALL_LEVELS` に追加する
