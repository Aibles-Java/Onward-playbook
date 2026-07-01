---
title: "Văn hóa Code Review"
description: "Review để cùng lớn lên — cách cho và nhận góp ý trong team Onward."
order: 2
tags: [review, văn-hóa]
---

# Văn hóa Code Review

> Mỗi người rời dự án này giỏi hơn lúc bắt đầu. Code review là để cùng lớn lên,
> không phải để chấm điểm.

## Khi bạn review

- Góp ý về **code**, không phải về **người**.
- Hỏi thay vì phán: *"Mình dùng cách này được không?"* hơn là *"Sai rồi"*.
- Khen điều làm tốt, không chỉ chỉ ra lỗi.
- Phân biệt **bắt buộc sửa** và **gợi ý** (prefix `nit:` cho gợi ý nhỏ).

## Khi bạn được review

- Đừng coi góp ý là công kích cá nhân.
- Trả lời mọi comment, kể cả chỉ là "đã sửa".
- Không đồng ý? Trao đổi thẳng thắn, dựa trên lý do kỹ thuật.

## Checklist trước khi xin review

- [ ] Code chạy được, không lỗi lint.
- [ ] Đặt tên biến/hàm rõ nghĩa.
- [ ] Có mô tả PR: *làm gì* và *tại sao*.
- [ ] Không để lại `console.log` / code chết.

## Tone khi comment

Áp dụng tone của Onward: **ngắn gọn, trấn an, chỉ rõ bước tiếp theo**.

| ✓ Nên | ✗ Tránh |
|-------|---------|
| "Chỗ này nên tách hàm cho dễ test, bạn thử nhé." | "Viết thế này không ổn." |
| "Đã ổn, chỉ còn nit về đặt tên." | "Còn nhiều lỗi lắm." |
