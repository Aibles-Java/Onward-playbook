import type { Term } from "@/features/glossary/lib/glossary";

/**
 * Tìm kiếm & tra cứu (UC_Search / FR-05).
 * Tìm theo tiêu đề + nội dung tài liệu và thuật ngữ, xếp theo độ liên quan.
 *
 * Hàm search hoạt động trên một "index" đã dựng sẵn (serializable) để chạy
 * được ở client — không đọc filesystem. Index được build ở server lúc render
 * trang (xem src/app/search/page.tsx) rồi truyền xuống client component.
 */

export type DocEntry = {
  title: string;
  href: string;
  description: string;
  category: string;
  tags: string[];
  content: string;
};

export type SearchIndex = {
  docs: DocEntry[];
  terms: Term[];
};

export type DocHit = {
  kind: "doc";
  title: string;
  href: string;
  category: string;
  snippet: string;
  score: number;
};

export type TermHit = {
  kind: "term";
  term: Term;
  score: number;
};

export type SearchResult = DocHit | TermHit;

/**
 * Chuyển Markdown/HTML thô về plain-text để index & hiển thị snippet sạch (fix #2).
 * Bỏ code block, thẻ HTML/SVG (kèm nội dung svg/script/style), cú pháp Markdown
 * (**đậm**, #tiêu-đề, [link](url), ...) rồi gộp khoảng trắng.
 */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ") // khối code ```
    .replace(/<(svg|style|script)[\s\S]*?<\/\1>/gi, " ") // svg/script/style + nội dung
    .replace(/<[^>]+>/g, " ") // thẻ HTML còn lại
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1") // ảnh ![alt](url) → alt
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // link [text](url) → text
    .replace(/^[ \t]*#{1,6}[ \t]+/gm, "") // # tiêu đề
    .replace(/^[ \t]*>[ \t]?/gm, "") // > blockquote
    .replace(/^[ \t]*([-*+]|\d+\.)[ \t]+/gm, "") // bullet / số thứ tự
    .replace(/[*_`~]/g, "") // ký tự nhấn mạnh / inline code
    .replace(/\s+/g, " ")
    .trim();
}

function makeSnippet(body: string, q: string): string {
  const idx = body.toLowerCase().indexOf(q);
  if (idx === -1) return body.slice(0, 140).trim() + "…";
  const start = Math.max(0, idx - 60);
  return (start > 0 ? "…" : "") + body.slice(start, idx + 100).trim() + "…";
}

export function searchIndex(index: SearchIndex, query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const doc of index.docs) {
    const title = doc.title.toLowerCase();
    const body = doc.content.toLowerCase();
    let score = 0;
    if (title.includes(q)) score += 10; // khớp tiêu đề ưu tiên cao
    if (doc.description.toLowerCase().includes(q)) score += 4;
    if (doc.tags.some((t) => t.toLowerCase().includes(q))) score += 3;
    if (body.includes(q)) score += 2;
    if (score > 0) {
      results.push({
        kind: "doc",
        title: doc.title,
        href: doc.href,
        category: doc.category,
        snippet: makeSnippet(doc.content, q),
        score,
      });
    }
  }

  for (const term of index.terms) {
    let score = 0;
    if (term.term.toLowerCase().includes(q)) score += 12;
    if (term.short.toLowerCase().includes(q)) score += 5;
    if (term.definition.toLowerCase().includes(q)) score += 3;
    if (score > 0) results.push({ kind: "term", term, score });
  }

  return results.sort((a, b) => b.score - a.score);
}
