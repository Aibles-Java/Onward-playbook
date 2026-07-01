---
title: "Tổng quan kiến trúc Playbook"
description: "Docs-as-Code: từ file Markdown trong repo đến trang hiển thị trên Playbook."
order: 1
tags: [kiến-trúc, ci-cd]
---

# Tổng quan kiến trúc Playbook

Playbook theo mô hình **Docs-as-Code**: nội dung tách khỏi nền tảng hiển thị để dễ
bảo trì độc lập.

<svg viewBox="0 0 640 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Luồng Docs-as-Code: viết Markdown → push GitHub → CI/CD build → Playbook → người đọc">
  <defs>
    <marker id="a2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="10"  y="55" width="110" height="44" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="65"  y="73" fill="#0F172A">Content Writer</text>
    <text x="65"  y="89" fill="#64748B" font-size="10">viết Markdown</text>

    <rect x="160" y="55" width="110" height="44" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="215" y="73" fill="#1D4ED8">GitHub repo</text>
    <text x="215" y="89" fill="#64748B" font-size="10">push / merge</text>

    <rect x="310" y="55" width="110" height="44" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="365" y="73" fill="#047857">CI/CD build</text>
    <text x="365" y="89" fill="#64748B" font-size="10">trigger tự động</text>

    <rect x="460" y="55" width="110" height="44" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="515" y="73" fill="#1D4ED8">Playbook</text>
    <text x="515" y="89" fill="#64748B" font-size="10">trang đã render</text>

    <line x1="120" y1="77" x2="156" y2="77" stroke="#64748B" marker-end="url(#a2)"/>
    <line x1="270" y1="77" x2="306" y2="77" stroke="#64748B" marker-end="url(#a2)"/>
    <line x1="420" y1="77" x2="456" y2="77" stroke="#64748B" marker-end="url(#a2)"/>
  </g>
</svg>

## Các thành phần

1. **Content (repo)** — file `.md` với front-matter, cấu trúc thư mục = cấu trúc menu.
2. **CI/CD** — mỗi lần push, pipeline build lại site. Build lỗi thì **giữ bản cũ**,
   không downtime.
3. **Playbook (Next.js)** — đọc Markdown, render ra trang, kèm tìm kiếm & tra cứu.

## Nguyên tắc

- **Tách nội dung khỏi nền tảng** → mỗi bên bảo trì độc lập.
- **Truy vết** → mỗi trang link về đúng file Markdown gốc trong repo.
- **Nhất quán** → nội dung trên Playbook luôn khớp bản mới nhất đã build thành công.

Xem cách nội dung được viết ở [Quy trình Git](/docs/workflow/git-workflow).
