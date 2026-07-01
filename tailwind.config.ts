import type { Config } from "tailwindcss";

/**
 * Design tokens của Onward — Brand Guide.
 * Mọi màu / spacing / radius đều lấy từ đây, không hardcode trong component.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: "#2563EB",
          dark: "#1D4ED8",
        },
        accent: "#10B981",
        // Surfaces & text
        bg: "#F8FAFC",
        text: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
        },
        // Semantic
        success: "#16A34A",
        warning: "#F59E0B",
        error: "#DC2626",
      },
      fontFamily: {
        sans: ["var(--font-be-vietnam-pro)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Thang typography theo brand guide (size / line-height)
        display: ["32px", { lineHeight: "40px", fontWeight: "700" }],
        h1: ["24px", { lineHeight: "32px", fontWeight: "700" }],
        h2: ["20px", { lineHeight: "28px", fontWeight: "600" }],
        body: ["16px", { lineHeight: "24px", fontWeight: "400" }],
        caption: ["13px", { lineHeight: "18px", fontWeight: "400" }],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
        "card-hover":
          "0 8px 24px rgba(37, 99, 235, 0.12), 0 2px 6px rgba(15, 23, 42, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
