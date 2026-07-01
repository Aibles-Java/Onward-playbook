---
title: "Bảng màu thương hiệu"
description: "Color palette của Onward và quy tắc dùng blue vs green."
order: 1
tags: [design, màu-sắc]
---

# Bảng màu thương hiệu

Mọi màu đều là **design token** — dùng theo tên, không hardcode mã hex trong component.

<svg viewBox="0 0 660 90" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bảng màu Onward">
  <g font-family="sans-serif" font-size="11" text-anchor="middle" fill="#0F172A">
    <rect x="10"  y="10" width="70" height="50" rx="8" fill="#2563EB"/><text x="45"  y="78">primary</text>
    <rect x="90"  y="10" width="70" height="50" rx="8" fill="#1D4ED8"/><text x="125" y="78">primary-dark</text>
    <rect x="170" y="10" width="70" height="50" rx="8" fill="#10B981"/><text x="205" y="78">accent</text>
    <rect x="250" y="10" width="70" height="50" rx="8" fill="#16A34A"/><text x="285" y="78">success</text>
    <rect x="330" y="10" width="70" height="50" rx="8" fill="#F59E0B"/><text x="365" y="78">warning</text>
    <rect x="410" y="10" width="70" height="50" rx="8" fill="#DC2626"/><text x="445" y="78">error</text>
    <rect x="490" y="10" width="70" height="50" rx="8" fill="#0F172A"/><text x="525" y="78">text</text>
    <rect x="570" y="10" width="70" height="50" rx="8" fill="#F8FAFC" stroke="#CBD5E1"/><text x="605" y="78">bg</text>
  </g>
</svg>

## Token

| Token | Hex | Dùng cho |
|-------|-----|----------|
| `primary` | `#2563EB` | Thương hiệu & **nút hành động chính** |
| `primary-dark` | `#1D4ED8` | Trạng thái hover của primary |
| `accent` | `#10B981` | Tín hiệu tích cực & tiến tới |
| `bg` | `#F8FAFC` | Nền trang |
| `text` | `#0F172A` | Chữ chính |
| `text-muted` | `#64748B` | Chữ phụ |
| `success` / `warning` / `error` | `#16A34A` / `#F59E0B` / `#DC2626` | Trạng thái ngữ nghĩa |

## Blue hay Green?

- **Nút hành động chính = blue** (primary). Nút "Chuyển tiền" mặc định là blue,
  **không phải** green.
- **Green** dành cho tín hiệu **tích cực & tiến tới**: tiền vào, số dư dương,
  trạng thái success, mũi tên forward trong logo.

> Blue mượn niềm tin có sẵn của ngành tài chính ("blue = ngân hàng đáng tin").
> Khác biệt của Onward đến từ **chuyển động** (đường đi lên) + **accent xanh lá**,
> không từ việc phá vỡ kỳ vọng màu chủ đạo.
