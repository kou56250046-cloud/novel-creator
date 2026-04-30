import { getBookContent, getBookMeta, isSeries, LEVELS, type LevelId } from "@/lib/books";
import ReadingClient from "./ReadingClient";
import ChapterGenreSelectorClient from "./ChapterGenreSelectorClient";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

export async function generateStaticParams() {
  const booksDir = path.join(process.cwd(), "content/books");
  const slugs = fs.readdirSync(booksDir);
  const params: { slug: string; segment: string }[] = [];

  for (const slug of slugs) {
    const metaPath = path.join(booksDir, slug, "_meta.json");
    if (!fs.existsSync(metaPath)) continue;
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

    if (Array.isArray(meta.chapters) && meta.chapters.length > 0) {
      // シリーズ本: segment = chapter id
      for (const chapter of meta.chapters) {
        params.push({ slug, segment: chapter.id });
      }
    } else {
      // 非シリーズ本: segment = level id
      for (const level of LEVELS) {
        const filePath = path.join(booksDir, slug, `${level.id}.md`);
        if (fs.existsSync(filePath)) {
          params.push({ slug, segment: level.id });
        }
      }
    }
  }
  return params;
}

export default async function SegmentPage({
  params,
}: {
  params: Promise<{ slug: string; segment: string }>;
}) {
  const { slug, segment } = await params;
  const meta = getBookMeta(slug);

  if (isSeries(meta)) {
    const chapter = (meta.chapters ?? []).find((c) => c.id === segment);
    if (!chapter) notFound();
    return <ChapterGenreSelectorClient meta={meta} chapter={chapter} slug={slug} />;
  }

  // 非シリーズ: segment = level id
  const levelIds = LEVELS.map((l) => l.id) as string[];
  if (!levelIds.includes(segment)) notFound();

  const filePath = path.join(process.cwd(), "content/books", slug, `${segment}.md`);
  if (!fs.existsSync(filePath)) notFound();

  const { contentHtml, levelLabel } = await getBookContent(slug, segment as LevelId);
  const levelInfo = LEVELS.find((l) => l.id === segment)!;

  return (
    <ReadingClient
      meta={meta}
      contentHtml={contentHtml}
      levelLabel={levelLabel}
      levelColor={levelInfo.color}
      levelEmoji={levelInfo.emoji}
      slug={slug}
      level={segment}
    />
  );
}
