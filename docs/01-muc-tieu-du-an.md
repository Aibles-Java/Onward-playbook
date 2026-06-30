# Tài liệu Mục tiêu Dự án — Playbook

> Mã tài liệu: `DOC-VISION-01`
> Phiên bản: 1.0
> Cập nhật: 2026-06-30

---

## 1. Giới thiệu chung

**Playbook** là một cổng thông tin nội bộ
dùng để **tập trung hóa, đồng bộ và tra cứu** toàn bộ tài liệu hướng dẫn (onboarding),
quy trình nghiệp vụ và thuật ngữ của hệ thống Playbook.

Điểm cốt lõi của hệ thống là mô hình **"Docs-as-Code"**: nội dung được viết dưới dạng
file **Markdown** và lưu trữ trong một **GitHub repository (`playbook`)**. Mỗi khi người
viết content push tài liệu lên repo, hệ thống CI/CD sẽ **tự động đồng bộ** và xuất bản
nội dung mới lên Playbook mà không cần thao tác thủ công.

---

## 2. Mục tiêu (Goals)

### 2.1. Mục tiêu nghiệp vụ

| # | Mục tiêu | Mô tả |
|---|----------|-------|
| G1 | Tập trung hóa tri thức | Trở thành nguồn tham chiếu duy nhất (single source of truth) cho tài liệu onboarding của Playbook. |
| G2 | Rút ngắn thời gian onboarding | Giúp nhân viên mới nhanh chóng tra cứu quy trình, thuật ngữ và tài liệu cần thiết. |
| G3 | Tự động hóa xuất bản nội dung | Loại bỏ thao tác thủ công khi cập nhật nội dung — viết Markdown, push, và nội dung tự lên Playbook. |
| G4 | Bảo đảm tính nhất quán | Nội dung trên Playbook luôn khớp với phiên bản mới nhất trong GitHub repo. |

### 2.2. Mục tiêu kỹ thuật

- Xây dựng pipeline **CI/CD** tự động trigger khi có thay đổi trên GitHub repo.
- Hỗ trợ **nhúng tài nguyên** (sơ đồ SVG, tài liệu đính kèm) trực tiếp trong nội dung.
- Cung cấp **chức năng tìm kiếm** nhanh theo từ khóa và thuật ngữ.
- Cung cấp cơ chế **quản lý người dùng & phân quyền** an toàn.

---

## 3. Phạm vi (Scope)

### 3.1. Trong phạm vi (In-scope)

- Đồng bộ và hiển thị nội dung Markdown từ GitHub repo.
- Nhúng sơ đồ SVG và tài liệu đính kèm vào nội dung.
- Tìm kiếm & tra cứu thuật ngữ.
- Quản lý người dùng và phân quyền (Admin / Viewer).

### 3.2. Ngoài phạm vi (Out-of-scope)

- Soạn thảo nội dung trực tiếp trên Playbook (nội dung được viết ở repo, không phải trên web).
- Tích hợp với hệ thống ngân hàng lõi (core banking).
- Bình luận, thảo luận trực tiếp trên từng tài liệu (giai đoạn sau).

---

## 4. Tác nhân (Actors)

| Tác nhân | Loại | Vai trò |
|----------|------|---------|
| **Người viết content** (Content Writer) | Người dùng | Viết tài liệu Markdown và push lên GitHub repo. |
| **Viewer** | Người dùng | Đọc, tìm kiếm và tra cứu nội dung trên Playbook. |
| **Admin** | Người dùng | Kế thừa toàn bộ quyền của Viewer, đồng thời quản lý người dùng & phân quyền. |
| **GitHub repo (playbook)** | Hệ thống ngoài | Lưu trữ nội dung và tự động trigger pipeline CI/CD khi có thay đổi. |

> **Ghi chú quan hệ kế thừa:** `Admin` kế thừa từ `Viewer` (Admin có thể làm mọi việc
> Viewer làm được, cộng thêm quyền quản trị).

---

## 5. Tổng quan Use Case

| Mã | Use Case | Tác nhân chính | Quan hệ |
|----|----------|----------------|---------|
| UC_Sync | Đồng bộ & hiển thị nội dung mới (từ Markdown) | Content Writer, GitHub repo | Use case gốc |
| UC_ImportAsset | Nhúng sơ đồ SVG & tài liệu đính kèm | — | `«extend»` → UC_Sync |
| UC_Search | Tìm kiếm & tra cứu thuật ngữ | Viewer | — |
| UC_ManageUsers | Quản lý người dùng & phân quyền | Admin | — |

> Chi tiết yêu cầu chức năng xem tại [`02-yeu-cau-chuc-nang.md`](./02-yeu-cau-chuc-nang.md).
> Yêu cầu phi chức năng xem tại [`03-yeu-cau-phi-chuc-nang.md`](./03-yeu-cau-phi-chuc-nang.md).

---

## 6. Tiêu chí thành công (Success Criteria)

- Nội dung mới được đồng bộ và hiển thị trên Playbook **trong vòng vài phút** sau khi push.
- Người dùng tìm thấy thuật ngữ/tài liệu cần thiết qua tìm kiếm với độ chính xác cao.
- Không xảy ra truy cập trái phép vào chức năng quản trị.
- Sơ đồ SVG và tài liệu đính kèm hiển thị đúng, không lỗi định dạng.
