# Đặc tả Yêu cầu Phi chức năng (Non-Functional Requirements)

> Mã tài liệu: `SRS-NFR-03`
> Phiên bản: 1.0
> Dự án: Playbook
> Cập nhật: 2026-06-30

---

Tài liệu mô tả các **yêu cầu phi chức năng** (chất lượng) của hệ thống. Mỗi yêu cầu
được gán mã `NFR-xx`.

## 1. Hiệu năng (Performance)

| Mã | Yêu cầu |
|----|---------|
| NFR-01 | Thời gian tải một trang nội dung ≤ 2 giây ở điều kiện mạng nội bộ thông thường. |
| NFR-02 | Kết quả tìm kiếm trả về ≤ 1 giây với kho tài liệu cỡ vài nghìn trang. |
| NFR-03 | Pipeline đồng bộ hoàn tất và xuất bản nội dung mới trong vòng ≤ 5 phút sau khi push. |

## 2. Tính sẵn sàng & Độ tin cậy (Availability & Reliability)

| Mã | Yêu cầu |
|----|---------|
| NFR-04 | Độ sẵn sàng hệ thống ≥ 99.5% trong giờ làm việc. |
| NFR-05 | Nếu build CI/CD thất bại, hệ thống giữ nguyên bản nội dung ổn định trước đó (không downtime). |
| NFR-06 | Có cơ chế log và cảnh báo khi đồng bộ thất bại. |

## 3. Bảo mật (Security)

| Mã | Yêu cầu |
|----|---------|
| NFR-07 | Mọi truy cập phải qua xác thực; phân quyền theo vai trò (RBAC). |
| NFR-08 | Viewer không thể truy cập chức năng quản trị bằng bất kỳ cách nào (kể cả URL trực tiếp). |
| NFR-09 | Kết nối qua HTTPS/TLS; webhook GitHub được xác thực bằng secret/signature. |
| NFR-10 | Ghi nhật ký (audit log) cho thao tác quản trị người dùng. |

## 4. Khả năng sử dụng (Usability)

| Mã | Yêu cầu |
|----|---------|
| NFR-11 | Giao diện trực quan, điều hướng theo cây thư mục của repo. |
| NFR-12 | Hỗ trợ responsive trên desktop và tablet. |
| NFR-13 | Hỗ trợ tiếng Việt đầy đủ (Unicode), hiển thị đúng dấu và thuật ngữ. |

## 5. Khả năng bảo trì & Mở rộng (Maintainability & Scalability)

| Mã | Yêu cầu |
|----|---------|
| NFR-14 | Nội dung quản lý theo mô hình Docs-as-Code, dễ version control qua Git. |
| NFR-15 | Kiến trúc cho phép tăng số lượng tài liệu/người dùng mà không thay đổi lớn về thiết kế. |
| NFR-16 | Tách biệt nội dung (repo) và nền tảng hiển thị (Playbook) để dễ bảo trì độc lập. |

## 6. Tương thích (Compatibility)

| Mã | Yêu cầu |
|----|---------|
| NFR-17 | Hỗ trợ các trình duyệt hiện đại (Chrome, Edge, Firefox phiên bản mới nhất). |
| NFR-18 | Tương thích chuẩn Markdown phổ biến (CommonMark/GFM) và nhúng SVG. |

## 7. Khả năng tra cứu / Truy vết (Traceability)

| Mã | Yêu cầu |
|----|---------|
| NFR-19 | Mỗi trang nội dung truy vết được về file Markdown gốc trong repo. |
| NFR-20 | Lưu lịch sử các lần đồng bộ để phục vụ kiểm tra. |

---

> Liên kết: [Mục tiêu dự án](./01-muc-tieu-du-an.md) ·
> [Yêu cầu chức năng](./02-yeu-cau-chuc-nang.md)
