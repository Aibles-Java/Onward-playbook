"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function NavSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
      }}
      className="relative"
      role="search"
    >
      <svg
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path
          d="m20 20-3.5-3.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm tài liệu, thuật ngữ…"
        aria-label="Tìm kiếm"
        className="w-40 rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-text
                   placeholder:text-text-muted focus:w-56 focus:border-primary/40 focus:outline-none
                   focus:ring-2 focus:ring-primary/15 md:w-52"
      />
    </form>
  );
}
