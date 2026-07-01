"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavCategory } from "@/lib/content";

export function DocsSidebar({ nav }: { nav: NavCategory[] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-6" aria-label="Điều hướng cẩm nang">
      {nav.map((cat) => (
        <div key={cat.slug}>
          <p className="mb-2 px-3 text-caption font-semibold uppercase tracking-wide text-text-muted">
            {cat.label}
          </p>
          <ul className="space-y-0.5">
            {cat.docs.map((doc) => {
              const active = pathname === doc.href;
              return (
                <li key={doc.href}>
                  <Link
                    href={doc.href}
                    className={`block rounded-md px-3 py-2 text-sm transition ${
                      active
                        ? "bg-primary/10 font-semibold text-primary-dark"
                        : "text-slate-600 hover:bg-white hover:text-text"
                    }`}
                  >
                    {doc.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
