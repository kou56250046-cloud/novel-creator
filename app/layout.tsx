import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "世代別読書 — Book Reader",
  description: "あらゆる本を、あなたの世代に合わせた物語で読む",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
