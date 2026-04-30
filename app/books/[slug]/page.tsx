import { getBookMeta, isSeries } from "@/lib/books";
import GenreSelectorClient from "./GenreSelectorClient";
import ChapterListClient from "./ChapterListClient";

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = getBookMeta(slug);

  if (isSeries(meta)) {
    return <ChapterListClient meta={meta} slug={slug} />;
  }

  return <GenreSelectorClient meta={meta} slug={slug} />;
}
