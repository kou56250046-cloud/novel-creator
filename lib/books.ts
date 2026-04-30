import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const booksDir = path.join(process.cwd(), "content/books");

export const LEVELS = [
  { id: "folktale",      label: "昔話風",             emoji: "🏮", color: "#C8A04A", bg: "#FAF3E0" },
  { id: "comedy-kids",   label: "コメディ",           emoji: "😄", color: "#FF6B9D", bg: "#FFF0F8" },
  { id: "mystery",       label: "ミステリー",         emoji: "🔍", color: "#78909C", bg: "#F0F4F8" },
  { id: "lightnovel",    label: "ラノベ系",           emoji: "⚔️", color: "#AB47BC", bg: "#F9F0FF" },
  { id: "social-comedy", label: "社会あるあるコメディ", emoji: "💼", color: "#66BB6A", bg: "#F0FFF4" },
  { id: "drama",         label: "ドラマ",             emoji: "🎭", color: "#EF5350", bg: "#FFF5F5" },
  { id: "life-drama",    label: "人生ドラマ",         emoji: "🌸", color: "#FF8A65", bg: "#FFF8F5" },
  { id: "urban-legend",  label: "都市伝説系",         emoji: "👁️", color: "#7C4DFF", bg: "#120a1a" },
  { id: "black-company", label: "ブラック企業系",     emoji: "💀", color: "#FF6B35", bg: "#FFF3EE" },
] as const;

export type LevelId = (typeof LEVELS)[number]["id"];

export interface ChapterMeta {
  id: string;
  title: string;
  description?: string;
}

export interface BookMeta {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  coverColor: string;
  publishedAt: string;
  chapters?: ChapterMeta[];
}

export interface BookContent {
  meta: BookMeta;
  contentHtml: string;
  levelLabel: string;
  chapterId?: string;
  chapterTitle?: string;
  prevChapterId?: string | null;
  nextChapterId?: string | null;
}

export function isSeries(meta: BookMeta): boolean {
  return Array.isArray(meta.chapters) && meta.chapters.length > 0;
}

export function getChapters(slug: string): ChapterMeta[] {
  return getBookMeta(slug).chapters ?? [];
}

export function getAdjacentChapters(
  meta: BookMeta,
  currentChapterId: string
): { prev: ChapterMeta | null; next: ChapterMeta | null } {
  const chapters = meta.chapters ?? [];
  const idx = chapters.findIndex((c) => c.id === currentChapterId);
  return {
    prev: idx > 0 ? chapters[idx - 1] : null,
    next: idx < chapters.length - 1 ? chapters[idx + 1] : null,
  };
}

export async function getChapterContent(
  slug: string,
  chapterId: string,
  level: LevelId
): Promise<BookContent> {
  const filePath = path.join(booksDir, slug, chapterId, `${level}.md`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(fileContents);
  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();
  const meta = getBookMeta(slug);
  const levelInfo = LEVELS.find((l) => l.id === level)!;
  const chapterMeta = (meta.chapters ?? []).find((c) => c.id === chapterId);
  const { prev, next } = getAdjacentChapters(meta, chapterId);
  return {
    meta,
    contentHtml,
    levelLabel: levelInfo.label,
    chapterId,
    chapterTitle: chapterMeta?.title,
    prevChapterId: prev?.id ?? null,
    nextChapterId: next?.id ?? null,
  };
}

export function getAllBooks(): BookMeta[] {
  const slugs = fs.readdirSync(booksDir);
  return slugs.map((slug) => {
    const metaPath = path.join(booksDir, slug, "_meta.json");
    return JSON.parse(fs.readFileSync(metaPath, "utf-8")) as BookMeta;
  });
}

export function getBookMeta(slug: string): BookMeta {
  const metaPath = path.join(booksDir, slug, "_meta.json");
  return JSON.parse(fs.readFileSync(metaPath, "utf-8")) as BookMeta;
}

export async function getBookContent(slug: string, level: LevelId): Promise<BookContent> {
  const filePath = path.join(booksDir, slug, `${level}.md`);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);
  const processed = await remark().use(html).process(content);
  const contentHtml = processed.toString();
  const meta = getBookMeta(slug);
  const levelInfo = LEVELS.find((l) => l.id === level)!;
  return { meta, contentHtml, levelLabel: levelInfo.label };
}
