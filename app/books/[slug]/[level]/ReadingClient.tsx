"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookMeta } from "@/lib/books";

const ALL_LEVELS = [
  { id: "folktale",      label: "昔話風",             emoji: "🏮", color: "#C8A04A" },
  { id: "comedy-kids",   label: "コメディ",           emoji: "😄", color: "#FF6B9D" },
  { id: "mystery",       label: "ミステリー",         emoji: "🔍", color: "#78909C" },
  { id: "lightnovel",    label: "ラノベ系",           emoji: "⚔️", color: "#AB47BC" },
  { id: "social-comedy", label: "社会あるあるコメディ", emoji: "💼", color: "#66BB6A" },
  { id: "drama",         label: "ドラマ",             emoji: "🎭", color: "#EF5350" },
  { id: "life-drama",    label: "人生ドラマ",         emoji: "🌸", color: "#FF8A65" },
];

interface Props {
  meta: BookMeta;
  contentHtml: string;
  levelLabel: string;
  levelColor: string;
  levelEmoji: string;
  slug: string;
  level: string;
}

export default function ReadingClient({
  meta,
  contentHtml,
  levelLabel,
  levelColor,
  levelEmoji,
  slug,
  level,
}: Props) {
  return (
    <div
      className="min-h-screen"
      style={{ background: "linear-gradient(180deg, #0d0d1a 0%, #1a1a2e 100%)" }}
    >
      {/* トップバー */}
      <div
        className="sticky top-0 z-50 px-6 py-3 flex items-center justify-between"
        style={{ background: "rgba(13,13,26,0.9)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <Link
          href={`/books/${slug}`}
          className="text-gray-500 hover:text-yellow-400 transition-colors text-sm flex items-center gap-2"
        >
          ← 世代を変える
        </Link>

        {/* 世代切り替えタブ */}
        <div className="hidden md:flex gap-1">
          {ALL_LEVELS.map((l) => (
            <Link key={l.id} href={`/books/${slug}/${l.id}`}>
              <div
                className="px-3 py-1.5 rounded-full text-xs transition-all"
                style={
                  l.id === level
                    ? { background: `${l.color}25`, color: l.color, border: `1px solid ${l.color}50` }
                    : { color: "#555", border: "1px solid transparent" }
                }
              >
                {l.emoji} {l.label}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-xs text-gray-600 hidden sm:block">{meta.title}</div>
      </div>

      {/* コンテンツ */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* 章タイトル */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-5xl mb-4">{levelEmoji}</div>
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: levelColor }}>
            {levelLabel}向け
          </p>
          <h1
            className="text-2xl md:text-3xl font-thin"
            style={{ color: "#e8e8f0", fontFamily: "Noto Serif JP, serif" }}
          >
            {meta.title}
          </h1>
          <div className="mt-6 w-24 h-px mx-auto" style={{ background: `${levelColor}50` }} />
        </motion.div>

        {/* 本文 */}
        <motion.article
          className="prose-reading text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          style={{ fontFamily: "Noto Serif JP, serif" }}
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* フッター */}
        <motion.div
          className="mt-20 pt-10 border-t border-white/5 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-gray-600 text-sm mb-6">他の世代でも読んでみる</p>
          <div className="flex justify-center flex-wrap gap-3">
            {ALL_LEVELS.filter((l) => l.id !== level).map((l) => (
              <Link key={l.id} href={`/books/${slug}/${l.id}`}>
                <motion.div
                  className="px-4 py-2 rounded-full text-sm cursor-pointer"
                  style={{ background: `${l.color}15`, color: l.color, border: `1px solid ${l.color}30` }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {l.emoji} {l.label}
                </motion.div>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <Link href="/" className="text-gray-600 hover:text-yellow-400 transition-colors text-sm">
              ← 本棚に戻る
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
