"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookMeta, ChapterMeta } from "@/lib/books";

const LEVELS = [
  { id: "folktale",      label: "昔話風",             emoji: "🏮", desc: "むかしむかし…やさしい語り口で",     color: "#C8A04A", bg: "#2a2010" },
  { id: "comedy-kids",   label: "コメディ",           emoji: "😄", desc: "笑いながら楽しく読む",             color: "#FF6B9D", bg: "#2d1020" },
  { id: "mystery",       label: "ミステリー",         emoji: "🔍", desc: "謎解きとスリルで読む",             color: "#78909C", bg: "#161c22" },
  { id: "lightnovel",    label: "ラノベ系",           emoji: "⚔️", desc: "熱い展開とキャラクターで読む",     color: "#AB47BC", bg: "#1f1028" },
  { id: "social-comedy", label: "社会あるあるコメディ", emoji: "💼", desc: "あるある！と笑える社会人目線で",   color: "#66BB6A", bg: "#0f2010" },
  { id: "drama",         label: "ドラマ",             emoji: "🎭", desc: "感情を揺さぶる人間ドラマとして",   color: "#EF5350", bg: "#2d0f0f" },
  { id: "life-drama",    label: "人生ドラマ",         emoji: "🌸", desc: "人生の深みと重みで読む",           color: "#FF8A65", bg: "#2d1808" },
  { id: "urban-legend",  label: "都市伝説系",         emoji: "👁️", desc: "封印された歴史の断片を読む",     color: "#7C4DFF", bg: "#120a1a" },
  { id: "black-company", label: "ブラック企業系",     emoji: "💀", desc: "ブラック企業で最強メンタル爆笑録", color: "#FF6B35", bg: "#1a0d00" },
];

interface Props {
  meta: BookMeta;
  chapter: ChapterMeta;
  slug: string;
}

export default function ChapterGenreSelectorClient({ meta, chapter, slug }: Props) {
  return (
    <div
      className="min-h-screen flex flex-col items-center"
      style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 100%)" }}
    >
      {/* 戻るリンク */}
      <div className="w-full max-w-4xl px-6 pt-8">
        <Link href={`/books/${slug}`} className="text-gray-500 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2">
          ← 目次に戻る
        </Link>
      </div>

      {/* タイトル */}
      <motion.div
        className="text-center pt-12 pb-10 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="text-xs tracking-[0.3em] text-gray-500 mb-2 uppercase">{meta.title}</p>
        <h1
          className="text-3xl md:text-4xl font-thin mb-3"
          style={{ color: "#c9a96e", fontFamily: "Noto Serif JP, serif" }}
        >
          {chapter.title}
        </h1>
        {chapter.description && (
          <p className="text-gray-500 text-sm">{chapter.description}</p>
        )}
        <div className="mt-6 w-16 h-px bg-yellow-600/30 mx-auto" />
        <p className="mt-6 text-gray-400 text-base">どのジャンルで読みますか？</p>
      </motion.div>

      {/* ジャンルセレクター */}
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
              <Link href={`/books/${slug}/${chapter.id}/${level.id}`}>
                <div
                  className="relative rounded-2xl p-6 cursor-pointer overflow-hidden group"
                  style={{
                    background: level.bg,
                    border: `1px solid ${level.color}30`,
                  }}
                >
                  <div
                    className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ background: level.color, filter: "blur(20px)" }}
                  />
                  <div className="text-4xl mb-4">{level.emoji}</div>
                  <h3 className="text-xl font-light mb-1" style={{ color: level.color }}>
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
