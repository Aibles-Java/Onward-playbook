import Link from "next/link";
import { search } from "@/lib/search";

export const metadata = { title: "Tìm kiếm" };

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const results = q ? search(q) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-h1 font-bold text-text">Kết quả tìm kiếm</h1>
      {q ? (
        <p className="mt-1 text-text-muted">
          {results.length} kết quả cho{" "}
          <span className="font-semibold text-text">&ldquo;{q}&rdquo;</span>
        </p>
      ) : (
        <p className="mt-1 text-text-muted">
          Nhập từ khóa ở ô tìm kiếm phía trên để bắt đầu.
        </p>
      )}

      <div className="mt-8 space-y-3">
        {results.map((r, i) =>
          r.kind === "doc" ? (
            <Link
              key={`d${i}`}
              href={r.href}
              className="card block transition hover:shadow-card-hover"
            >
              <span className="badge bg-primary/10 text-primary">Tài liệu</span>
              <h2 className="mt-2 font-semibold text-text">{r.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{r.snippet}</p>
            </Link>
          ) : (
            <Link
              key={`t${i}`}
              href="/glossary"
              className="card block transition hover:shadow-card-hover"
            >
              <span className="badge bg-accent/10 text-accent">Thuật ngữ</span>
              <h2 className="mt-2 font-semibold text-text">
                {r.term.term}{" "}
                <span className="font-normal text-text-muted">
                  · {r.term.short}
                </span>
              </h2>
              <p className="mt-1 text-sm text-slate-600">{r.term.definition}</p>
            </Link>
          ),
        )}

        {q && results.length === 0 && (
          <div className="card text-center text-text-muted">
            Không tìm thấy kết quả nào. Thử từ khóa khác nhé.
          </div>
        )}
      </div>
    </div>
  );
}
