"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const LEVELS = [
  { id: "kindergarten", label: "幼稚園", emoji: "🌱", desc: "やさしいことばで、絵本みたいに", color: "#FFB7C5", bg: "#2d1a1e" },
  { id: "elementary",   label: "小学生", emoji: "🚀", desc: "ぼうけんストーリーとして読む",   color: "#FFD700", bg: "#2d2a10" },
  { id: "middle",       label: "中学生", emoji: "⚡", desc: "歴史ドラマとして読む",           color: "#4FC3F7", bg: "#0d1e2d" },
  { id: "high",         label: "高校生", emoji: "🔥", desc: "哲学と社会問題の視点で読む",     color: "#FF7043", bg: "#2d1508" },
  { id: "university",   label: "大学生", emoji: "🎓", desc: "批評・論考スタイルで読む",       color: "#7C4DFF", bg: "#1a1028" },
];

const BOOK_META: Record<string, { title: string; subtitle: string }> = {
  "korean-epic": {
    title: "韓民族選民大叙事詩",
    subtitle: "The Great Epic of the Chosen Korean People",
  },
};

export default function BookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const meta = BOOK_META[slug] ?? { title: slug, subtitle: "" };

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
        <p className="mt-6 text-gray-400 text-base">あなたは誰ですか？</p>
      </motion.div>

      {/* 世代セレクター */}
      <div className="w-full max-w-4xl px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEVELS.map((level, i) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: "easeOut" }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link href={`/books/${slug}/${level.id}`}>
                <div
                  className="relative rounded-2xl p-6 cursor-pointer overflow-hidden group"
                  style={{
                    background: level.bg,
                    border: `1px solid ${level.color}30`,
                  }}
                >
                  {/* グロー効果 */}
                  <div
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ background: level.color, filter: "blur(20px)" }}
                  />

                  <div className="text-4xl mb-4">{level.emoji}</div>
                  <h3
                    className="text-xl font-light mb-1"
                    style={{ color: level.color }}
                  >
                    {level.label}
                  </h3>
                  <p className="text-gray-400 text-sm">{level.desc}</p>

                  <div
                    className="mt-4 text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: level.color }}
                  >
                    読む <span>→</span>
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
