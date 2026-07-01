import Link from "next/link";
import { getNav } from "@/lib/content";

export const metadata = { title: "Cẩm nang" };

export default function DocsIndexPage() {
  const nav = getNav();

  return (
    <div>
      <h1 className="text-h1 font-bold text-text">Cẩm nang Onward</h1>
      <p className="mt-2 text-slate-600">
        Chọn một chặng để bắt đầu. Nội dung được đồng bộ tự động từ repo.
      </p>

      <div className="mt-8 space-y-8">
        {nav.map((cat) => (
          <section key={cat.slug}>
            <h2 className="text-h2 font-semibold text-text">{cat.label}</h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {cat.docs.map((doc) => (
                <Link
                  key={doc.href}
                  href={doc.href}
                  className="card transition hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <h3 className="font-semibold text-text">{doc.title}</h3>
                  {doc.description && (
                    <p className="mt-1.5 text-sm leading-6 text-slate-600">
                      {doc.description}
                    </p>
                  )}
                  <p className="mt-3 text-caption text-text-muted">
                    ⏱ {doc.readingMinutes} phút đọc
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
