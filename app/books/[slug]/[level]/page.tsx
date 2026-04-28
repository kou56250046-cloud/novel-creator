import { getBookContent, LEVELS, type LevelId } from "@/lib/books";
import ReadingClient from "./ReadingClient";
import { notFound } from "next/navigation";
import fs from "fs";
import path from "path";

export async function generateStaticParams() {
  const booksDir = path.join(process.cwd(), "content/books");
  const slugs = fs.readdirSync(booksDir);
  const params: { slug: string; level: string }[] = [];
  for (const slug of slugs) {
    for (const level of LEVELS) {
      const filePath = path.join(booksDir, slug, `${level.id}.md`);
      if (fs.existsSync(filePath)) {
        params.push({ slug, level: level.id });
      }
    }
  }
  return params;
}

export default async function ReadingPage({
  params,
}: {
  params: Promise<{ slug: string; level: string }>;
}) {
  const { slug, level } = await params;
  const levelIds = LEVELS.map((l) => l.id) as string[];
  if (!levelIds.includes(level)) notFound();

  const filePath = path.join(process.cwd(), "content/books", slug, `${level}.md`);
  if (!fs.existsSync(filePath)) notFound();

  const { meta, contentHtml, levelLabel } = await getBookContent(slug, level as LevelId);
  const levelInfo = LEVELS.find((l) => l.id === level)!;

  return (
    <ReadingClient
      meta={meta}
      contentHtml={contentHtml}
      levelLabel={levelLabel}
      levelColor={levelInfo.color}
      levelEmoji={levelInfo.emoji}
      slug={slug}
      level={level}
    />
  );
}
