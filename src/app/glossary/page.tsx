"use client";

import { useMemo, useState } from "react";
import { GLOSSARY, searchGlossary } from "@/features/glossary/lib/glossary";

const CATEGORIES = ["Tất cả", "Onward", "Nghiệp vụ", "Kỹ thuật"] as const;

const CAT_STYLE: Record<string, string> = {
  Onward: "bg-primary/10 text-primary",
  "Nghiệp vụ": "bg-accent/10 text-accent",
  "Kỹ thuật": "bg-amber-100 text-amber-700",
};

export default function GlossaryPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Tất cả");

  const terms = useMemo(() => {
    let list = searchGlossary(q);
    if (cat !== "Tất cả") list = list.filter((t) => t.category === cat);
    return list.sort((a, b) => a.term.localeCompare(b.term));
  }, [q, cat]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-h1 font-bold text-text">Từ điển thuật ngữ</h1>
      <p className="mt-2 text-slate-600">
        Tra nhanh {GLOSSARY.length} thuật ngữ thường gặp khi làm việc với Onward.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Gõ để lọc thuật ngữ…"
          className="w-full rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm
                     focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
        />
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                cat === c
                  ? "bg-primary text-white"
                  : "bg-white text-text-muted hover:text-primary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {terms.map((t) => (
          <div key={t.term} className="card">
            <div className="flex items-center justify-between gap-2">
              <dt className="font-semibold text-text">{t.term}</dt>
              <span className={`badge ${CAT_STYLE[t.category]}`}>
                {t.category}
              </span>
            </div>
            <p className="mt-0.5 text-caption font-medium text-text-muted">
              {t.short}
            </p>
            <dd className="mt-2 text-sm leading-6 text-slate-600">
              {t.definition}
            </dd>
          </div>
        ))}
      </dl>

      {terms.length === 0 && (
        <div className="card mt-6 text-center text-text-muted">
          Không có thuật ngữ nào khớp.
        </div>
      )}
    </div>
  );
}
