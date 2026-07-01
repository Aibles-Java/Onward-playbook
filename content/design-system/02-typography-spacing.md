---
title: "Typography & Spacing"
description: "Font Be Vietnam Pro, thang chữ, hệ spacing 4/8 và bo góc."
order: 2
tags: [design, typography]
---

# Typography & Spacing

## Font: Be Vietnam Pro

Dự án dùng **một font duy nhất** — Be Vietnam Pro — vì nó hỗ trợ dấu tiếng Việt đầy
đủ và đẹp, tải nhanh và nhìn nhất quán. Phân cấp bằng **size/weight**, không cần font
thứ hai.

| Bậc | Size / Weight | Dùng cho |
|-----|---------------|----------|
| display | 32 / 700 | Số dư, con số quan trọng nhất |
| h1 | 24 / 700 | Tiêu đề trang |
| h2 | 20 / 600 | Tiêu đề mục |
| body | 16 / 400 | Nội dung |
| caption | 13 / 400 | Chú thích, timestamp |

## Spacing — hệ 4 / 8

Mọi khoảng cách là **bội số của 4** → layout đều tay, dev không phải đoán "16 hay 17px".

```
4 · 8 · 12 · 16 · 24 · 32
```

## Bo góc (radius)

| Token | Giá trị | Dùng cho |
|-------|---------|----------|
| `sm` | 8px | Nút, input |
| `md` | 12px | Thẻ nhỏ, nút CTA |
| `lg` | 16px | Card lớn |
| `full` | ∞ | Avatar, pill |

> Góc bo mềm vừa phải = thân thiện nhưng vẫn nghiêm túc, hợp tài chính. Vuông cứng
> quá lạnh; bo quá tròn thì trẻ con, giảm cảm giác tin cậy.
