# Đặc tả Yêu cầu Chức năng (Functional Requirements)

> Mã tài liệu: `SRS-FR-02`
> Phiên bản: 1.0
> Dự án: Playbook
> Cập nhật: 2026-06-30

---

Tài liệu này đặc tả chi tiết các **yêu cầu chức năng** của hệ thống, bám sát theo
sơ đồ Use Case. Mỗi yêu cầu được gán mã `FR-xx` để truy vết.

## Bảng tổng hợp

| Mã | Tên chức năng | Use Case | Tác nhân | Ưu tiên |
|----|---------------|----------|----------|---------|
| FR-01 | Đồng bộ nội dung từ Markdown | UC_Sync | Content Writer, GitHub | Bắt buộc |
| FR-02 | Trigger CI/CD tự động | UC_Sync | GitHub repo | Bắt buộc |
| FR-03 | Hiển thị nội dung đã đồng bộ | UC_Sync | Viewer | Bắt buộc |
| FR-04 | Nhúng sơ đồ SVG & tài liệu đính kèm | UC_ImportAsset | Content Writer | Nên có |
| FR-05 | Tìm kiếm & tra cứu thuật ngữ | UC_Search | Viewer | Bắt buộc |
| FR-06 | Quản lý người dùng & phân quyền | UC_ManageUsers | Admin | Bắt buộc |
| FR-07 | Xác thực & đăng nhập | (chung) | Viewer, Admin | Bắt buộc |

---

## UC_Sync — Đồng bộ & hiển thị nội dung mới

### FR-01: Đồng bộ nội dung từ file Markdown
- **Mô tả:** Hệ thống đọc các file Markdown từ GitHub repo `playbook`, chuyển đổi
  (render) thành HTML và xuất bản lên Playbook.
- **Đầu vào:** File `.md` trong repo (kèm metadata/front-matter nếu có).
- **Đầu ra:** Trang nội dung được hiển thị trên Playbook.
- **Điều kiện tiên quyết:** Người viết content đã push tài liệu lên nhánh được cấu hình.
- **Quy tắc nghiệp vụ:**
  - Giữ nguyên cấu trúc thư mục/menu theo cây thư mục trong repo.
  - Khi file bị xóa khỏi repo, trang tương ứng phải được gỡ khỏi Playbook.

### FR-02: Trigger CI/CD tự động
- **Mô tả:** Khi GitHub repo nhận sự kiện `push`/`merge`, pipeline CI/CD tự động chạy
  để đồng bộ nội dung mà không cần thao tác thủ công (quan hệ `«trigger CI/CD»`).
- **Đầu vào:** Sự kiện webhook từ GitHub.
- **Đầu ra:** Tiến trình build & deploy nội dung được khởi chạy.
- **Quy tắc nghiệp vụ:**
  - Chỉ đồng bộ khi build thành công; nếu build lỗi phải giữ lại bản nội dung trước đó.
  - Ghi log kết quả mỗi lần đồng bộ (thành công / thất bại).

### FR-03: Hiển thị nội dung đã đồng bộ
- **Mô tả:** Viewer xem nội dung đã được xuất bản theo cây điều hướng.
- **Quy tắc nghiệp vụ:** Hiển thị phiên bản mới nhất đã đồng bộ thành công.

---

## UC_ImportAsset — Nhúng sơ đồ SVG & tài liệu đính kèm  «extend» UC_Sync

### FR-04: Nhúng sơ đồ SVG & tài liệu đính kèm
- **Mô tả:** Trong quá trình đồng bộ, nếu nội dung Markdown có tham chiếu tới tài nguyên
  (SVG, hình ảnh, file đính kèm PDF/DOCX...), hệ thống sẽ nhúng/hiển thị chúng kèm theo.
- **Quan hệ:** `«extend»` của UC_Sync — chỉ kích hoạt khi nội dung **có** tài nguyên đính kèm.
- **Quy tắc nghiệp vụ:**
  - Sơ đồ SVG hiển thị inline, hỗ trợ phóng to/thu nhỏ.
  - Tài liệu đính kèm cho phép tải xuống.
  - Nếu tài nguyên không tồn tại, hiển thị cảnh báo thay vì làm hỏng trang.

---

## UC_Search — Tìm kiếm & tra cứu thuật ngữ

### FR-05: Tìm kiếm & tra cứu thuật ngữ
- **Mô tả:** Viewer nhập từ khóa để tìm tài liệu và tra cứu định nghĩa thuật ngữ.
- **Đầu vào:** Chuỗi từ khóa tìm kiếm.
- **Đầu ra:** Danh sách kết quả khớp (tên tài liệu, đoạn trích, thuật ngữ).
- **Quy tắc nghiệp vụ:**
  - Hỗ trợ tìm kiếm theo tiêu đề và nội dung.
  - Sắp xếp kết quả theo độ liên quan.
  - Hỗ trợ tra cứu nhanh thuật ngữ (glossary).

---

## UC_ManageUsers — Quản lý người dùng & phân quyền

### FR-06: Quản lý người dùng & phân quyền
- **Mô tả:** Admin tạo/sửa/xóa tài khoản và gán vai trò (Viewer/Admin).
- **Tác nhân:** Admin (chỉ Admin được phép).
- **Quy tắc nghiệp vụ:**
  - Admin kế thừa toàn bộ quyền của Viewer.
  - Mỗi người dùng có ít nhất một vai trò.
  - Không cho phép Viewer truy cập chức năng quản trị.

### FR-07: Xác thực & đăng nhập
- **Mô tả:** Người dùng đăng nhập trước khi truy cập nội dung và chức năng theo vai trò.
- **Quy tắc nghiệp vụ:** Phân quyền theo vai trò (RBAC) sau khi xác thực thành công.

---

## Ma trận phân quyền (RBAC)

| Chức năng | Content Writer | Viewer | Admin |
|-----------|:--------------:|:------:|:-----:|
| Push & đồng bộ nội dung (qua repo) | ✅ | ❌ | ❌ |
| Xem nội dung đã xuất bản | ✅* | ✅ | ✅ |
| Tìm kiếm & tra cứu thuật ngữ | ✅* | ✅ | ✅ |
| Quản lý người dùng & phân quyền | ❌ | ❌ | ✅ |

> *Người viết content tương tác chủ yếu qua GitHub repo; nếu đồng thời là người dùng Playbook
> thì có quyền tương đương Viewer.
