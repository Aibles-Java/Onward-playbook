import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { SiteFooter } from "@/components/ui/SiteFooter";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Onward Playbook — Sổ tay onboarding cho dev",
    template: "%s · Onward Playbook",
  },
  description:
    "Playbook của hệ thống Onward Digital Banking — bản hướng dẫn dành cho dev mới, như cẩm nang nhập môn cho người lần đầu vào cuộc chơi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="flex min-h-screen flex-col bg-bg">
        <Navbar />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
