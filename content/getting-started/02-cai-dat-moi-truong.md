---
title: "Cài đặt môi trường"
description: "Chuẩn bị máy để chạy được Playbook và các dịch vụ Onward trong vài phút."
order: 2
tags: [setup, môi-trường]
---

# Cài đặt môi trường

Mục tiêu của màn này: từ máy trắng đến khi chạy được `npm run dev`.

## Yêu cầu

| Công cụ | Phiên bản | Ghi chú |
|---------|-----------|---------|
| Node.js | ≥ 18.18 | Nên dùng `nvm` để quản lý |
| npm | ≥ 10 | Đi kèm Node |
| Git | mới nhất | Cấu hình `user.name` & `user.email` |

## Các bước

```bash
# 1. Clone repo
git clone https://github.com/Aibles-Java/Onward-playbook.git
cd Onward-playbook

# 2. Cài dependencies
npm install

# 3. Chạy môi trường dev
npm run dev
```

Mở trình duyệt tại `http://localhost:3000` — nếu thấy trang chủ Playbook nghĩa là
bạn đã qua màn này. 🎉

## Gặp lỗi?

- **Sai phiên bản Node** → chạy `nvm use 18` rồi cài lại.
- **Port 3000 bận** → chạy `npm run dev -- -p 3001`.

> Số dư không đủ? Hãy nạp thêm để tiếp tục. — với lỗi cũng vậy: thông báo luôn nói
> rõ **bước tiếp theo**, không chỉ báo "có lỗi".
