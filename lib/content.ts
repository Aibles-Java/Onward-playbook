import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Content layer (Docs-as-Code).
 * Đọc file Markdown trong /content theo cây thư mục → dựng nav + trang nội dung.
 * Cấu trúc thư mục = cấu trúc menu (FR-01, NFR-11, NFR-19).
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Doc = {
  slug: string[]; // ['getting-started','gioi-thieu']
  href: string; // /docs/getting-started/gioi-thieu
  title: string;
  description: string;
  category: string; // slug thư mục cấp 1
  order: number;
  tags: string[];
  content: string; // body markdown (đã bỏ front-matter)
  readingMinutes: number;
  sourcePath: string; // đường dẫn file gốc trong repo (truy vết — NFR-19)
};

export type NavCategory = {
  slug: string;
  label: string;
  order: number;
  docs: Doc[];
};

// Nhãn + thứ tự hiển thị cho từng nhóm (thư mục cấp 1).
const CATEGORY_META: Record<string, { label: string; order: number }> = {
  "getting-started": { label: "Bắt đầu", order: 1 },
  workflow: { label: "Quy trình làm việc", order: 2 },
  "design-system": { label: "Design System", order: 3 },
  architecture: { label: "Kiến trúc", order: 4 },
};

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}

// Bỏ tiền tố số thứ tự "01-" khỏi slug hiển thị trên URL.
function cleanSegment(seg: string): string {
  return seg.replace(/\.md$/, "").replace(/^\d+[-_]/, "");
}

function readingMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

let _cache: Doc[] | null = null;

export function getAllDocs(): Doc[] {
  if (_cache) return _cache;
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const docs = walk(CONTENT_DIR).map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const rel = path.relative(CONTENT_DIR, file);
    const parts = rel.split(path.sep);
    const slug = parts.map(cleanSegment);
    const category = parts[0];

    return {
      slug,
      href: "/docs/" + slug.join("/"),
      title: data.title ?? cleanSegment(parts[parts.length - 1]),
      description: data.description ?? "",
      category,
      order: data.order ?? 999,
      tags: Array.isArray(data.tags) ? data.tags : [],
      content,
      readingMinutes: readingMinutes(content),
      sourcePath: "content/" + rel.split(path.sep).join("/"),
    } satisfies Doc;
  });

  _cache = docs.sort((a, b) => a.order - b.order);
  return _cache;
}

export function getDocBySlug(slug: string[]): Doc | undefined {
  const target = slug.join("/");
  return getAllDocs().find((d) => d.slug.join("/") === target);
}

export function getNav(): NavCategory[] {
  const byCat = new Map<string, Doc[]>();
  for (const doc of getAllDocs()) {
    const list = byCat.get(doc.category) ?? [];
    list.push(doc);
    byCat.set(doc.category, list);
  }

  return [...byCat.entries()]
    .map(([slug, docs]) => ({
      slug,
      label: CATEGORY_META[slug]?.label ?? slug,
      order: CATEGORY_META[slug]?.order ?? 999,
      docs: docs.sort((a, b) => a.order - b.order),
    }))
    .sort((a, b) => a.order - b.order);
}
