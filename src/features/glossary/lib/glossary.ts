/**
 * Từ điển thuật ngữ (glossary) — phục vụ UC_Search "tra cứu thuật ngữ".
 * Dữ liệu tĩnh cho learning project; có thể chuyển sang Markdown/DB sau này.
 */
export type Term = {
  term: string;
  short: string;
  definition: string;
  category: "Nghiệp vụ" | "Kỹ thuật" | "Onward" | "Java";
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
  {
    term: "JDK",
    short: "Bộ công cụ phát triển Java",
    definition:
      "Java Development Kit. Bộ đồ nghề để viết và chạy Java: gồm trình biên dịch javac, JVM, thư viện chuẩn và các công cụ như jshell, javap.",
    category: "Java",
  },
  {
    term: "JRE",
    short: "Môi trường chạy Java",
    definition:
      "Java Runtime Environment. Phần cần có để chạy chương trình Java (JVM + thư viện chuẩn), không gồm công cụ biên dịch. Từ Java 11 không còn phát hành riêng; dùng JDK.",
    category: "Java",
  },
  {
    term: "JVM",
    short: "Máy ảo Java",
    definition:
      "Java Virtual Machine. Chương trình đọc bytecode trong file .class rồi thực thi trên máy thật. Nhờ JVM, cùng một file .class chạy được trên Windows, macOS, Linux.",
    category: "Java",
  },
  {
    term: "Bytecode",
    short: "Mã trung gian",
    definition:
      "Dạng lệnh mà javac sinh ra (file .class). Không phải mã máy của CPU; JVM thông dịch hoặc biên dịch JIT nó thành mã máy lúc chạy.",
    category: "Java",
  },
  {
    term: "javac",
    short: "Trình biên dịch Java",
    definition:
      "Công cụ trong JDK dịch file nguồn .java thành file bytecode .class. Báo lỗi cú pháp và lỗi kiểu trước khi chương trình chạy.",
    category: "Java",
  },
  {
    term: "JIT",
    short: "Biên dịch tức thời",
    definition:
      "Just-In-Time compiler. Thành phần của JVM theo dõi đoạn code chạy nhiều ('nóng') và dịch nó sang mã máy để chạy nhanh hơn.",
    category: "Java",
  },
  {
    term: "Garbage Collector",
    short: "Bộ thu gom rác",
    definition:
      "Thành phần của JVM tự động giải phóng vùng nhớ của các object không còn ai tham chiếu tới. Lập trình viên Java không cần tự free bộ nhớ.",
    category: "Java",
  },
  {
    term: "Primitive type",
    short: "Kiểu nguyên thủy",
    definition:
      "8 kiểu dữ liệu cơ bản của Java: byte, short, int, long, float, double, char, boolean. Biến kiểu này chứa trực tiếp giá trị.",
    category: "Java",
  },
  {
    term: "Reference type",
    short: "Kiểu tham chiếu",
    definition:
      "Mọi kiểu không phải primitive (String, mảng, class...). Biến kiểu này chứa 'địa chỉ' trỏ tới object nằm trên heap, không chứa object.",
    category: "Java",
  },
  {
    term: "Scope",
    short: "Phạm vi biến",
    definition:
      "Vùng code mà một biến còn 'nhìn thấy' được. Biến khai báo trong cặp { } chỉ dùng được bên trong cặp ngoặc đó.",
    category: "Java",
  },
  {
    term: "Type casting",
    short: "Ép kiểu",
    definition:
      "Chuyển giá trị từ kiểu này sang kiểu khác. Widening (int → long) tự động và an toàn; narrowing (double → int) phải viết rõ (int) và có thể mất dữ liệu.",
    category: "Java",
  },
  {
    term: "String",
    short: "Chuỗi ký tự",
    definition:
      "Kiểu tham chiếu biểu diễn văn bản. String trong Java là bất biến (immutable): mọi thao tác 'sửa' đều tạo ra String mới.",
    category: "Java",
  },
  {
    term: "BigDecimal",
    short: "Số thập phân chính xác",
    definition:
      "Class trong java.math biểu diễn số thập phân không sai số làm tròn nhị phân. Bắt buộc dùng cho tiền tệ thay vì double.",
    category: "Java",
  },
  {
    term: "Array",
    short: "Mảng",
    definition:
      "Dãy có độ dài cố định gồm các phần tử cùng kiểu, truy cập theo chỉ số bắt đầu từ 0.",
    category: "Java",
  },
  {
    term: "Class",
    short: "Lớp",
    definition:
      "Bản thiết kế mô tả dữ liệu (field) và hành vi (method) của một loại đối tượng. Ví dụ: class Account mô tả mọi tài khoản.",
    category: "Java",
  },
  {
    term: "Object",
    short: "Đối tượng",
    definition:
      "Một thực thể cụ thể được tạo từ class bằng từ khóa new. Ví dụ: tài khoản của anh A là một object của class Account.",
    category: "Java",
  },
  {
    term: "Method",
    short: "Phương thức",
    definition:
      "Khối lệnh có tên nằm trong class, nhận tham số và có thể trả về kết quả. Tương đương 'hàm' ở ngôn ngữ khác.",
    category: "Java",
  },
  {
    term: "Constructor",
    short: "Hàm khởi tạo",
    definition:
      "Method đặc biệt trùng tên class, chạy khi gọi new để gán giá trị ban đầu cho object.",
    category: "Java",
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
