"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/docs", label: "Cẩm nang" },
  { href: "/glossary", label: "Thuật ngữ" },
  { href: "/admin/users", label: "Quản trị" },
];

/**
 * Menu điều hướng cho mobile (< md) — fix #3.
 * Nút hamburger mở panel trượt xuống chứa toàn bộ link + nút Đăng nhập.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md text-text-muted transition hover:bg-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {open ? (
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          ) : (
            <path
              d="M4 7h16M4 12h16M4 17h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}
        </svg>
      </button>

      {open && (
        <>
          {/* Overlay để bấm ra ngoài đóng menu */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 top-16 z-30 cursor-default bg-slate-900/20"
          />
          <nav className="absolute inset-x-0 top-full z-40 border-b border-slate-200/80 bg-bg/95 px-4 py-3 shadow-card backdrop-blur sm:px-6">
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-2.5 text-sm font-medium text-text transition hover:bg-white hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-1 border-t border-slate-200 pt-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="btn-primary w-full py-2.5"
                >
                  Đăng nhập
                </Link>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
