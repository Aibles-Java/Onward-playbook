import Link from "next/link";

/**
 * Logo Onward: đường đi lên + mũi tên xanh lá hướng tới (forward & growth).
 * Xanh lá = tín hiệu tiến tới (theo brand), wordmark dùng màu text/primary.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 font-bold tracking-tight ${className}`}
      aria-label="Onward Playbook — về trang chủ"
    >
      <span className="grid h-9 w-9 place-items-center rounded-md bg-primary shadow-card">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* đường đi lên */}
          <path
            d="M3 17 L9 11 L13 15 L21 7"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* mũi tên forward, xanh lá accent */}
          <path
            d="M15.5 7 H21 V12.5"
            stroke="#10B981"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-lg text-text">
        Onward<span className="text-text-muted"> Playbook</span>
      </span>
    </Link>
  );
}
