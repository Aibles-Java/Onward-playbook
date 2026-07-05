import type { Metadata } from "next";

// Trang glossary là client component nên đặt title qua layout (fix #7).
export const metadata: Metadata = { title: "Thuật ngữ" };

export default function GlossaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
