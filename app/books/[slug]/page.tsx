"use client";

import { use } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const LEVELS = [
  { id: "folktale",      label: "昔話風",             emoji: "🏮", desc: "むかしむかし…やさしい語り口で",     color: "#C8A04A", bg: "#2a2010" },
  { id: "comedy-kids",   label: "コメディ",           emoji: "😄", desc: "笑いながら楽しく読む",             color: "#FF6B9D", bg: "#2d1020" },
  { id: "mystery",       label: "ミステリー",         emoji: "🔍", desc: "謎解きとスリルで読む",             color: "#78909C", bg: "#161c22" },
  { id: "lightnovel",    label: "ラノベ系",           emoji: "⚔️", desc: "熱い展開とキャラクターで読む",     color: "#AB47BC", bg: "#1f1028" },
  { id: "social-comedy", label: "社会あるあるコメディ", emoji: "💼", desc: "あるある！と笑える社会人目線で",   color: "#66BB6A", bg: "#0f2010" },
  { id: "drama",         label: "ドラマ",             emoji: "🎭", desc: "感情を揺さぶる人間ドラマとして",   color: "#EF5350", bg: "#2d0f0f" },
  { id: "life-drama",    label: "人生ドラマ",         emoji: "🌸", desc: "人生の深みと重みで読む",           color: "#FF8A65", bg: "#2d1808" },
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
