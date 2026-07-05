"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function NavSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  // Placeholder ngắn ở mobile để không bị cắt chữ; dài ở md+ (fix #6).
  // Khởi tạo bản ngắn để khớp SSR, rồi cập nhật theo viewport sau khi mount.
  const [placeholder, setPlaceholder] = useState("Tìm kiếm…");

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () =>
      setPlaceholder(mq.matches ? "Tìm tài liệu, thuật ngữ…" : "Tìm kiếm…");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
        placeholder={placeholder}
        aria-label="Tìm kiếm"
        className="w-36 rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-text
                   placeholder:text-text-muted focus:border-primary/40 focus:outline-none
                   focus:ring-2 focus:ring-primary/15 sm:w-44 md:w-52 md:focus:w-64"
      />
    </form>
  );
}
