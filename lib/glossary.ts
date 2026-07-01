/**
 * Từ điển thuật ngữ (glossary) — phục vụ UC_Search "tra cứu thuật ngữ".
 * Dữ liệu tĩnh cho learning project; có thể chuyển sang Markdown/DB sau này.
 */
export type Term = {
  term: string;
  short: string;
  definition: string;
  category: "Nghiệp vụ" | "Kỹ thuật" | "Onward";
};

export const GLOSSARY: Term[] = [
  {
    term: "Onboarding",
    short: "Nhập môn",
    definition:
      "Quá trình đưa một dev mới hòa nhập với dự án: cài môi trường, hiểu quy trình, nắm codebase và văn hóa team.",
    category: "Onward",
  },
  {
    term: "Docs-as-Code",
    short: "Tài liệu như mã nguồn",
    definition:
      "Mô hình viết tài liệu bằng Markdown, lưu trong Git repo và xuất bản tự động qua CI/CD — giống hệt cách quản lý code.",
    category: "Kỹ thuật",
  },
  {
    term: "CI/CD",
    short: "Tích hợp & triển khai liên tục",
    definition:
      "Continuous Integration / Continuous Deployment. Khi push code/tài liệu, pipeline tự động build, kiểm thử và triển khai bản mới.",
    category: "Kỹ thuật",
  },
  {
    term: "RBAC",
    short: "Phân quyền theo vai trò",
    definition:
      "Role-Based Access Control. Quyền truy cập gắn với vai trò (Viewer, Admin) thay vì từng người dùng riêng lẻ.",
    category: "Kỹ thuật",
  },
  {
    term: "Design Token",
    short: "Biến thiết kế",
    definition:
      "Giá trị nền tảng của hệ thống thiết kế (màu, spacing, radius, typography) được đặt tên và tái sử dụng, không hardcode.",
    category: "Kỹ thuật",
  },
  {
    term: "Primary",
    short: "Màu chủ đạo",
    definition:
      "Màu xanh dương #2563EB của Onward — dùng cho thương hiệu và nút hành động chính (CTA). 'Blue = ngân hàng đáng tin'.",
    category: "Onward",
  },
  {
    term: "Accent",
    short: "Màu nhấn",
    definition:
      "Màu xanh lá #10B981 — tín hiệu tích cực & tiến tới (tiền vào, số dư dương, mũi tên forward). Không dùng cho CTA.",
    category: "Onward",
  },
  {
    term: "Viewer",
    short: "Người đọc",
    definition:
      "Vai trò đọc, tìm kiếm và tra cứu nội dung trên Playbook. Không có quyền quản trị.",
    category: "Nghiệp vụ",
  },
  {
    term: "Admin",
    short: "Quản trị viên",
    definition:
      "Kế thừa toàn bộ quyền của Viewer, đồng thời quản lý người dùng và phân quyền.",
    category: "Nghiệp vụ",
  },
  {
    term: "Front-matter",
    short: "Metadata đầu file",
    definition:
      "Khối YAML ở đầu file Markdown (giữa hai dấu ---) chứa metadata như title, order, tags.",
    category: "Kỹ thuật",
  },
];

export function searchGlossary(query: string): Term[] {
  const q = query.trim().toLowerCase();
  if (!q) return GLOSSARY;
  return GLOSSARY.filter(
    (t) =>
      t.term.toLowerCase().includes(q) ||
      t.short.toLowerCase().includes(q) ||
      t.definition.toLowerCase().includes(q),
  );
}
