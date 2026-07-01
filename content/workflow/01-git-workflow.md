---
title: "Quy trình Git"
description: "Cách đặt tên nhánh, commit và mở Pull Request theo chuẩn của team."
order: 1
tags: [git, quy-trình]
---

# Quy trình Git

Không commit thẳng vào `main`. Mọi thay đổi đi qua một nhánh và một Pull Request.

## Vòng đời một thay đổi

<svg viewBox="0 0 640 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sơ đồ luồng Git: main → nhánh → commit → PR → review → merge">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B" />
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="13" text-anchor="middle">
    <rect x="8"   y="40" width="90" height="40" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="53"  y="65" fill="#1D4ED8">main</text>
    <rect x="140" y="40" width="110" height="40" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="195" y="65" fill="#0F172A">feat/nhánh</text>
    <rect x="292" y="40" width="90" height="40" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="337" y="65" fill="#0F172A">commit</text>
    <rect x="424" y="40" width="80" height="40" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="464" y="65" fill="#047857">PR</text>
    <rect x="546" y="40" width="86" height="40" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="589" y="65" fill="#1D4ED8">merge</text>
    <line x1="98"  y1="60" x2="136" y2="60" stroke="#64748B" marker-end="url(#arrow)"/>
    <line x1="250" y1="60" x2="288" y2="60" stroke="#64748B" marker-end="url(#arrow)"/>
    <line x1="382" y1="60" x2="420" y2="60" stroke="#64748B" marker-end="url(#arrow)"/>
    <line x1="504" y1="60" x2="542" y2="60" stroke="#64748B" marker-end="url(#arrow)"/>
  </g>
</svg>

## Đặt tên nhánh

| Tiền tố | Dùng khi |
|---------|----------|
| `feat/` | Thêm tính năng mới |
| `fix/` | Sửa lỗi |
| `docs/` | Thêm/sửa tài liệu |
| `chore/` | Việc cấu hình, lặt vặt |

```bash
git checkout -b feat/ten-tinh-nang
git add .
git commit -m "feat: mô tả ngắn gọn"
git push -u origin feat/ten-tinh-nang
```

## Commit message

Theo chuẩn **Conventional Commits**: `type: mô tả`. Ví dụ `fix: sửa lỗi tràn số dư`.

> Code review là để **cùng lớn lên**, không phải để chấm điểm. Xem tiếp
> [Văn hóa Code Review](/docs/workflow/code-review).
