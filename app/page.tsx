import Link from "next/link";
import { getNav } from "@/lib/content";

export default function HomePage() {
  const nav = getNav();
  const firstDoc = nav[0]?.docs[0];

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden border-b border-slate-200/70">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/[0.06] to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
          <span className="badge bg-accent/10 text-accent">
            ● Learning Project · Digital Banking
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-text sm:text-5xl">
            Cẩm nang nhập môn cho <span className="text-primary">dev</span> của
            hệ thống Onward.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Giống như bản hướng dẫn trò chơi dành cho người lần đầu vào cuộc —
            Playbook dẫn bạn qua từng &ldquo;màn&rdquo;: cài môi trường, nắm quy
            trình, hiểu design system và kiến trúc. Mỗi commit là một bước tiến
            về phía trước.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={firstDoc?.href ?? "/docs"} className="btn-primary">
              Bắt đầu hành trình →
            </Link>
            <Link href="/glossary" className="btn-ghost">
              Tra cứu thuật ngữ
            </Link>
          </div>
          <p className="mt-6 text-caption italic text-text-muted">
            &ldquo;Chúng tôi không hỏi &lsquo;đã đủ tốt chưa?&rsquo; — chúng tôi
            hỏi &lsquo;bước tiếp theo là gì?&rsquo;. Onward, always.&rdquo;
          </p>
        </div>
      </section>

      {/* ---------- Tính năng chính (bám use case) ---------- */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <h2 className="text-h2 font-semibold text-text">Playbook giúp bạn gì?</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: "📖",
              title: "Nội dung luôn mới",
              desc: "Tài liệu viết bằng Markdown, push lên GitHub là tự đồng bộ lên Playbook qua CI/CD.",
            },
            {
              icon: "🗺️",
              title: "Sơ đồ & tài liệu đính kèm",
              desc: "Nhúng sơ đồ SVG trực quan và cho tải file đính kèm ngay trong bài hướng dẫn.",
            },
            {
              icon: "🔍",
              title: "Tìm kiếm & tra cứu",
              desc: "Gõ từ khóa để tìm bài viết và tra nghĩa thuật ngữ trong vài giây.",
            },
          ].map((f) => (
            <div key={f.title} className="card transition hover:shadow-card-hover">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 text-lg font-semibold text-text">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Lộ trình (quest list) ---------- */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="rounded-lg border border-slate-200/70 bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-h2 font-semibold text-text">
            Lộ trình gợi ý cho người mới
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Đi lần lượt từ trên xuống — mỗi nhóm là một chặng.
          </p>
          <ol className="mt-6 space-y-3">
            {nav.map((cat, i) => (
              <li key={cat.slug} className="flex items-start gap-4">
                <span className="grid h-8 w-8 flex-none place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <div>
                  <Link
                    href={cat.docs[0]?.href ?? "/docs"}
                    className="font-semibold text-text hover:text-primary"
                  >
                    {cat.label}
                  </Link>
                  <p className="text-sm text-text-muted">
                    {cat.docs.length} bài · {cat.docs.map((d) => d.title).join(" · ")}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
