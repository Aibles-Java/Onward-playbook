import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllDocs, getDocBySlug } from "@/lib/content";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export function generateMetadata({ params }: { params: { slug: string[] } }) {
  const doc = getDocBySlug(params.slug);
  return {
    title: doc?.title ?? "Không tìm thấy",
    description: doc?.description,
  };
}

const GITHUB_REPO = "https://github.com/Aibles-Java/Onward-playbook/blob/main/";

export default function DocPage({ params }: { params: { slug: string[] } }) {
  const doc = getDocBySlug(params.slug);
  if (!doc) notFound();

  // Điều hướng trước/sau trong cùng cẩm nang.
  const all = getAllDocs();
  const idx = all.findIndex((d) => d.href === doc.href);
  const prev = all[idx - 1];
  const next = all[idx + 1];

  return (
    <article>
      <nav className="mb-4 text-caption text-text-muted" aria-label="breadcrumb">
        <Link href="/docs" className="hover:text-primary">
          Cẩm nang
        </Link>{" "}
        / <span className="text-slate-600">{doc.title}</span>
      </nav>

      <header className="mb-8 border-b border-slate-200 pb-6">
        <h1 className="text-h1 font-bold text-text">{doc.title}</h1>
        {doc.description && (
          <p className="mt-2 text-lg text-slate-600">{doc.description}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-caption text-text-muted">
          <span>⏱ {doc.readingMinutes} phút đọc</span>
          {doc.tags.map((t) => (
            <span key={t} className="badge bg-slate-100 text-slate-600">
              #{t}
            </span>
          ))}
        </div>
      </header>

      <MarkdownRenderer content={doc.content} />

      {/* Truy vết nguồn (NFR-19) */}
      <p className="mt-10 border-t border-slate-200 pt-4 text-caption text-text-muted">
        Nguồn:{" "}
        <a
          href={GITHUB_REPO + doc.sourcePath}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary hover:underline"
        >
          {doc.sourcePath}
        </a>
      </p>

      {/* Prev / Next */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={prev.href}
            className="card text-left transition hover:shadow-card-hover"
          >
            <span className="text-caption text-text-muted">← Trước</span>
            <span className="mt-1 block font-semibold text-text">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={next.href}
            className="card text-right transition hover:shadow-card-hover sm:col-start-2"
          >
            <span className="text-caption text-text-muted">Tiếp →</span>
            <span className="mt-1 block font-semibold text-text">
              {next.title}
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}
