import { getAllDocs } from "@/features/docs/lib/content";
import { GLOSSARY } from "@/features/glossary/lib/glossary";
import { toPlainText, type SearchIndex } from "@/features/search/lib/search";
import { SearchClient } from "@/features/search/components/SearchClient";

export const metadata = { title: "Tìm kiếm" };

export default function SearchPage() {
  // Dựng index ở server (đọc filesystem lúc build) rồi truyền xuống client.
  const index: SearchIndex = {
    docs: getAllDocs().map((d) => ({
      title: d.title,
      href: d.href,
      description: d.description,
      category: d.category,
      tags: d.tags,
      content: toPlainText(d.content),
    })),
    terms: GLOSSARY,
  };

  return <SearchClient index={index} />;
}
