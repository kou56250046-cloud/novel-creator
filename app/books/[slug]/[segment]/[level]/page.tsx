import { getChapterContent, getBookMeta, isSeries, LEVELS, type LevelId } from "@/lib/books";
import SerialReadingClient from "./SerialReadingClient";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

export async function generateStaticParams() {
  const booksDir = path.join(process.cwd(), "content/books");
  const slugs = fs.readdirSync(booksDir);
  const params: { slug: string; segment: string; level: string }[] = [];

  for (const slug of slugs) {
    const metaPath = path.join(booksDir, slug, "_meta.json");
    if (!fs.existsSync(metaPath)) continue;
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    if (!Array.isArray(meta.chapters) || meta.chapters.length === 0) continue;

    for (const chapter of meta.chapters) {
      for (const lvl of LEVELS) {
        const filePath = path.join(booksDir, slug, chapter.id, `${lvl.id}.md`);
        if (fs.existsSync(filePath)) {
          params.push({ slug, segment: chapter.id, level: lvl.id });
        }
      }
    }
  }
  return params;
}

export default async function SerialReadingPage({
  params,
}: {
  params: Promise<{ slug: string; segment: string; level: string }>;
}) {
  const { slug, segment, level } = await params;
  const meta = getBookMeta(slug);

  if (!isSeries(meta)) notFound();

  const chapter = (meta.chapters ?? []).find((c) => c.id === segment);
  if (!chapter) notFound();

  const levelIds = LEVELS.map((l) => l.id) as string[];
  if (!levelIds.includes(level)) notFound();

  const filePath = path.join(process.cwd(), "content/books", slug, segment, `${level}.md`);
  if (!fs.existsSync(filePath)) notFound();

  const bookContent = await getChapterContent(slug, segment, level as LevelId);
  const levelInfo = LEVELS.find((l) => l.id === level)!;

  return (
    <SerialReadingClient
      meta={meta}
      contentHtml={bookContent.contentHtml}
      levelLabel={bookContent.levelLabel}
      levelColor={levelInfo.color}
      levelEmoji={levelInfo.emoji}
      slug={slug}
      chapterId={segment}
      chapterTitle={chapter.title}
      level={level}
      prevChapterId={bookContent.prevChapterId ?? null}
      nextChapterId={bookContent.nextChapterId ?? null}
    />
  );
}
