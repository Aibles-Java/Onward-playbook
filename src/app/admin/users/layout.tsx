import type { Metadata } from "next";

// Trang quản trị là client component nên đặt title qua layout (fix #7).
export const metadata: Metadata = { title: "Quản trị người dùng" };

export default function AdminUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
