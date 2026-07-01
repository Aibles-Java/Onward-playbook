import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Đăng nhập" };

export default function LoginPage() {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4">
      <div className="card w-full">
        <Logo />
        <h1 className="mt-6 text-h1 font-bold text-text">Đăng nhập Playbook</h1>
        <p className="mt-1 text-sm text-text-muted">
          Đăng nhập để truy cập nội dung theo vai trò của bạn.
        </p>

        <form className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-text">Email</span>
            <input
              type="email"
              placeholder="ban@onward.dev"
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-text">Mật khẩu</span>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-slate-200 px-3 py-2.5 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <button type="button" className="btn-primary w-full">
            Đăng nhập
          </button>
        </form>

        <p className="mt-4 text-center text-caption text-text-muted">
          Chỉ cần xem tài liệu công khai?{" "}
          <Link href="/docs" className="font-medium text-primary hover:underline">
            Vào cẩm nang
          </Link>
        </p>
      </div>
    </div>
  );
}
