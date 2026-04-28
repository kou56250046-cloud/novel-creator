"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const BOOKS = [
  {
    slug: "korean-epic",
    title: "韓民族選民大叙事詩",
    subtitle: "The Great Epic of the Chosen Korean People",
    tags: ["歴史", "宗教", "文化"],
    color: "#1a1a2e",
    accent: "#c9a96e",
  },
];

function StarField() {
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${((i * 137.5) % 100).toFixed(1)}%`,
    top: `${((i * 97.3) % 100).toFixed(1)}%`,
    delay: `${(i * 0.08) % 5}s`,
    duration: `${3 + (i % 4)}s`,
    size: i % 5 === 0 ? "2px" : "1px",
    opacity: 0.1 + (i % 7) * 0.1,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `float ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div
      className="relative min-h-screen flex flex-col items-center"
      style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #0d1a2e 100%)" }}
    >
      <StarField />

      {/* ヘッダー */}
      <motion.div
        className="relative z-10 text-center pt-20 pb-12 px-4"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <p className="text-xs tracking-[0.4em] text-yellow-400/60 uppercase mb-4">
          世代別読書プラットフォーム
        </p>
        <h1 className="text-5xl md:text-7xl font-thin mb-4" style={{ fontFamily: "Noto Serif JP, serif" }}>
          <span className="shimmer-text">文 庫 閣</span>
        </h1>
        <p className="text-gray-400 text-lg font-light tracking-wide">
          あらゆる知識を、あなたの世代の言葉で
        </p>

        <motion.div
          className="mt-6 flex justify-center flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {["幼稚園", "小学生", "中学生", "高校生", "大学生"].map((label) => (
            <span
              key={label}
              className="text-xs px-3 py-1 rounded-full border border-yellow-400/20 text-yellow-400/50"
            >
              {label}
            </span>
          ))}
        </motion.div>
      </motion.div>

      {/* 本棚 */}
      <motion.div
        className="relative z-10 w-full max-w-5xl px-6 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BOOKS.map((book, i) => (
            <motion.div
              key={book.slug}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.15, duration: 0.7, ease: "easeOut" }}
            >
              <Link href={`/books/${book.slug}`}>
                <div
                  className="book-card relative rounded-2xl overflow-hidden cursor-pointer group"
                  style={{
                    background: `linear-gradient(135deg, ${book.color} 0%, #0d0d1a 100%)`,
                    border: `1px solid ${book.accent}30`,
                    minHeight: "320px",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-5"
                    style={{
                      backgroundImage: `repeating-linear-gradient(45deg, ${book.accent} 0, ${book.accent} 1px, transparent 0, transparent 50%)`,
                      backgroundSize: "20px 20px",
                    }}
                  />

                  <div className="relative p-8 flex flex-col" style={{ minHeight: "320px" }}>
                    <div className="flex gap-2">
                      {book.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${book.accent}20`, color: book.accent }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-12">
                      <h2
                        className="text-xl font-light mb-2 leading-relaxed"
                        style={{ color: book.accent, fontFamily: "Noto Serif JP, serif" }}
                      >
                        {book.title}
                      </h2>
                      <p className="text-gray-500 text-xs tracking-widest">{book.subtitle}</p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-sm text-gray-400 group-hover:text-yellow-400 transition-colors">
                      <span>世代を選んで読む</span>
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* 追加予定プレースホルダー */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.7 }}
          >
            <div
              className="relative rounded-2xl flex items-center justify-center"
              style={{
                border: "1px dashed rgba(201,169,110,0.2)",
                minHeight: "320px",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div className="text-center text-gray-600">
                <div className="text-4xl mb-3">＋</div>
                <p className="text-sm">次の本を追加</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
