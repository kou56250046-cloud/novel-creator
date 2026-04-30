"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookMeta } from "@/lib/books";

interface Props {
  meta: BookMeta;
  slug: string;
}

export default function ChapterListClient({ meta, slug }: Props) {
  const chapters = meta.chapters ?? [];

  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 100%)" }}
    >
      {/* 戻るリンク */}
      <div className="w-full max-w-4xl px-6 pt-8">
        <Link href="/" className="text-gray-500 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2">
          ← 本棚に戻る
        </Link>
      </div>

      {/* タイトル */}
      <motion.div
        className="text-center pt-12 pb-10 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1
          className="text-3xl md:text-5xl font-thin mb-3"
          style={{ color: "#c9a96e", fontFamily: "Noto Serif JP, serif" }}
        >
          {meta.title}
        </h1>
        <p className="text-gray-500 text-sm tracking-widest">{meta.subtitle}</p>
        <div className="mt-6 w-16 h-px bg-yellow-600/30 mx-auto" />
        <p className="mt-6 text-gray-400 text-base">章を選んでください</p>
      </motion.div>

      {/* 章一覧 */}
      <div className="w-full max-w-2xl px-6 pb-20">
        <div className="flex flex-col gap-4">
          {chapters.map((chapter, i) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              whileHover={{ x: 6 }}
            >
              <Link href={`/books/${slug}/${chapter.id}`}>
                <div
                  className="rounded-xl p-5 cursor-pointer group"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="text-sm font-mono mt-0.5"
                      style={{ color: "#c9a96e", minWidth: "2rem" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <h3
                        className="text-lg font-thin group-hover:text-yellow-300 transition-colors"
                        style={{ color: "#e8e8f0", fontFamily: "Noto Serif JP, serif" }}
                      >
                        {chapter.title}
                      </h3>
                      {chapter.description && (
                        <p className="text-gray-500 text-sm mt-1">{chapter.description}</p>
                      )}
                    </div>
                    <span className="text-gray-600 group-hover:text-yellow-400 transition-colors text-sm mt-0.5">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
