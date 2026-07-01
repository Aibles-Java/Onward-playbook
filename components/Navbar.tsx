import Link from "next/link";
import { Logo } from "./Logo";
import { NavSearch } from "./NavSearch";

const links = [
  { href: "/docs", label: "Cẩm nang" },
  { href: "/glossary", label: "Thuật ngữ" },
  { href: "/admin/users", label: "Quản trị" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-text-muted transition hover:bg-white hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <NavSearch />
          <Link href="/login" className="btn-ghost hidden py-2 sm:inline-flex">
            Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
}
