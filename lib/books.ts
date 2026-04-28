import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const booksDir = path.join(process.cwd(), "content/books");

export const LEVELS = [
  { id: "kindergarten", label: "幼稚園", emoji: "🌱", color: "#FFB7C5", bg: "#FFF0F3" },
  { id: "elementary",   label: "小学生", emoji: "🚀", color: "#FFD700", bg: "#FFFBEB" },
  { id: "middle",       label: "中学生", emoji: "⚡", color: "#4FC3F7", bg: "#E3F4FD" },
  { id: "high",         label: "高校生", emoji: "🔥", color: "#FF7043", bg: "#FFF3EF" },
  { id: "university",   label: "大学生", emoji: "🎓", color: "#7C4DFF", bg: "#F3EEFF" },
] as const;

export type LevelId = (typeof LEVELS)[number]["id"];

export interface BookMeta {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  coverColor: string;
  publishedAt: string;
}

export interface BookContent {
  meta: BookMeta;
  contentHtml: string;
  levelLabel: string;
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
