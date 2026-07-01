import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 text-center">
      <div>
        <p className="text-display font-bold text-primary">404</p>
        <h1 className="mt-2 text-h1 font-bold text-text">
          Không tìm thấy trang
        </h1>
        <p className="mt-2 text-slate-600">
          Trang này có thể đã được gỡ khỏi repo hoặc đường dẫn chưa đúng.
        </p>
        <Link href="/docs" className="btn-primary mt-6">
          Về cẩm nang
        </Link>
      </div>
    </div>
  );
}
