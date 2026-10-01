---
title: "Bài 1 · Cú pháp cơ bản"
description: "Viết, chạy và đọc hiểu chương trình Java đầu tiên: class, method main, câu lệnh, comment, cách đặt tên và in ra màn hình."
order: 11
tags: [java, chặng-1, cú-pháp, basic-syntax]
---

# Bài 1 · Cú pháp cơ bản

> 🎯 **Sau bài này bạn sẽ:**
>
> - Tự gõ và chạy được một chương trình Java hoàn chỉnh bằng một lệnh duy nhất.
> - Chỉ ra được từng phần của chương trình: class, method `main`, câu lệnh, khối lệnh.
> - Viết được 3 loại comment và biết khi nào dùng loại nào.
> - Đặt tên class, biến, method, hằng số đúng quy ước Java.
> - In được một biên lai đơn giản bằng `println`, `print`, `printf` và các ký tự đặc biệt như `\n`, `\t`.

Đây là bài mở đầu của chặng 1 trong [Lộ trình Java Developer](/docs/learning/java-roadmap),
ứng với chủ đề **Basic Syntax** của roadmap.sh [1]. Bạn chưa cần biết gì về lập trình.
Cứ gõ lại từng ví dụ, chạy thử, và đọc lỗi khi nó xuất hiện. Lỗi là chuyện bình thường.

## Trước khi bắt đầu

**Cần biết trước:** không cần gì. Nếu máy bạn chưa sẵn sàng cho các công cụ chung của
team (Git, Node), xem trang [Cài đặt môi trường](/docs/getting-started/cai-dat-moi-truong).
Phần dưới đây chỉ cài thêm Java.

### Từ khoá của bài

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| **terminal** (*cửa sổ dòng lệnh*) | Nơi gõ lệnh cho máy tính bằng chữ | Terminal (macOS), PowerShell (Windows) |
| **JDK** (*Java Development Kit*) | Bộ đồ nghề để viết và chạy Java | JDK 25 |
| **JVM** (*Java Virtual Machine*) | "Cỗ máy" chạy chương trình Java | lệnh `java` khởi động nó |
| **mã nguồn** (*source code*) | Chữ bạn gõ vào file `.java` | `HelloOnward.java` |
| **trình biên dịch** (*compiler*) | Chương trình dịch mã nguồn sang dạng máy chạy được | `javac` |
| **class** | Cái hộp chứa code | `public class HelloOnward` |
| **method** | Một nhóm câu lệnh có tên | `main`, `println` |
| **câu lệnh** (*statement*) | Một yêu cầu cho máy, kết thúc bằng `;` | `System.out.println("Hi");` |
| **định danh** (*identifier*) | Cái tên bạn đặt cho class, biến, method | `customerName` |
| **từ khoá** (*keyword*) | Từ Java giữ riêng, không được dùng làm tên | `class`, `public` |

### Chuẩn bị: cài JDK 25

Bạn cần **JDK** (*Java Development Kit*, bộ công cụ phát triển Java). Trong đó có lệnh
`java` để chạy chương trình, `javac` để biên dịch, và `jshell` để thử nhanh. Lộ trình
khuyên học Java **25**, bản hỗ trợ dài hạn (*LTS*) gần nhất.

Mọi lệnh trong bài được gõ vào **terminal** (*cửa sổ dòng lệnh*: app Terminal trên macOS/Linux,
PowerShell hoặc Windows Terminal trên Windows). Gõ xong một lệnh thì nhấn Enter. Chọn **một**
trong ba cách cài sau:

```bash
# Cách 1: macOS với Homebrew (trình cài phần mềm cho macOS), bản Eclipse Temurin
brew install --cask temurin@25

# Cách 2: macOS / Linux với SDKMAN (quản lý nhiều phiên bản JDK)
sdk list java                 # xem các bản có sẵn, tìm dòng 25.x của Temurin
sdk install java 25.0.x-tem   # thay 25.0.x bằng số bản bạn thấy trong danh sách

# Cách 3: Windows hoặc bất kỳ hệ điều hành nào
# Tải bộ cài JDK 25 tại https://adoptium.net/temurin/releases/ rồi cài như phần mềm bình thường
```

Kiểm tra lại bằng lệnh sau:

```bash
java -version
```

Dòng đầu tiên cho biết phiên bản, dạng `openjdk version "<số phiên bản>" ...`. Số phiên bản
phải bắt đầu bằng `25` (ví dụ `25.0.x`). Để bạn hình dung, đây là output thật trên một máy đang
cài JDK 21; máy bạn sẽ thấy số 25 ở vị trí `21.0.9`, và tên nhà phát hành có thể khác:

```text
openjdk version "21.0.9" 2025-10-21
OpenJDK Runtime Environment Homebrew (build 21.0.9)
OpenJDK 64-Bit Server VM Homebrew (build 21.0.9, mixed mode, sharing)
```

💡 Muốn thử một câu lệnh mà không cần tạo file? Gõ `jshell` (có từ JDK 9 [10]) rồi
gõ thẳng câu lệnh vào. Gõ `/exit` để thoát.

```text
jshell> System.out.println("Xin chào, Onward!")
Xin chào, Onward!
```

Mọi ví dụ trong bài đã được chạy thật trên JDK 21 và chỉ dùng cú pháp chuẩn, nên chạy
y hệt trên JDK 25.

## 1. Chương trình Java đầu tiên

**Ý tưởng nôm na.** Một chương trình Java giống một chi nhánh ngân hàng. Toà nhà là
**class** (*lớp*), chứa mọi thứ bên trong. Cửa chính là **method** (*phương thức*: một nhóm
câu lệnh có tên) tên `main`. **JVM** (*Java Virtual Machine*, máy ảo chạy chương trình Java)
luôn bắt đầu từ cửa này, như khách nào cũng phải vào từ cửa chính. Bên trong, nhân viên
làm từng việc theo thứ tự, mỗi việc là một **câu lệnh** (*statement*). Mỗi "phòng" được
bao bởi một cặp `{` `}`; phần nằm giữa một cặp như vậy gọi là **khối lệnh** (*block*),
phần 3 sẽ học kỹ.

<svg viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Giải phẫu chương trình HelloOnward. Bên trái là 5 dòng code: public class HelloOnward mở ngoặc nhọn; public static void main(String[] args) mở ngoặc nhọn; System.out.println(&quot;Xin chào!&quot;) chấm phẩy; đóng ngoặc; đóng ngoặc. Bên phải là chú thích: 1 class HelloOnward là hộp chứa code, tên phải trùng tên file HelloOnward.java; 2 method main là cửa chính, JVM bắt đầu chạy từ đây; 3 String[] args là dữ liệu gõ kèm lệnh chạy, bài này chưa dùng; 4 câu lệnh in một dòng chữ, kết thúc bằng dấu chấm phẩy; 5 cặp ngoặc nhọn mở và đóng một khối, khối class bọc ngoài khối main.">
  <g font-family="sans-serif">
    <text x="16" y="24" font-size="13" font-weight="bold" fill="#0F172A">HelloOnward.java</text>
    <rect x="16" y="36" width="404" height="218" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <rect x="93" y="62" width="135" height="20" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <rect x="218" y="98" width="33" height="20" rx="4" fill="#ECFDF5" stroke="#10B981"/>
    <rect x="257" y="98" width="104" height="20" rx="4" fill="#FFFBEB" stroke="#D97706"/>
    <rect x="101" y="134" width="254" height="20" rx="4" fill="#F8FAFC" stroke="#64748B" stroke-dasharray="4 3"/>
    <rect x="233" y="62" width="11" height="20" rx="3" fill="none" stroke="#1D4ED8" stroke-width="1.5"/>
    <rect x="38" y="206" width="11" height="20" rx="3" fill="none" stroke="#1D4ED8" stroke-width="1.5"/>
    <g font-family="monospace" font-size="13" fill="#0F172A">
      <text x="40" y="77">public class HelloOnward {</text>
      <text x="71.2" y="113">public static void main(String[] args) {</text>
      <text x="102.4" y="149">System.out.println("Xin chào!");</text>
      <text x="71.2" y="185">}</text>
      <text x="40" y="221">}</text>
    </g>
    <g font-size="11" font-weight="bold" fill="#FFFFFF" text-anchor="middle">
      <circle cx="160" cy="54" r="9" fill="#2563EB"/><text x="160" y="58">1</text>
      <circle cx="234" cy="90" r="9" fill="#047857"/><text x="234" y="94">2</text>
      <circle cx="309" cy="90" r="9" fill="#D97706"/><text x="309" y="94">3</text>
      <circle cx="223" cy="126" r="9" fill="#64748B"/><text x="223" y="130">4</text>
      <circle cx="256" cy="54" r="9" fill="#1D4ED8"/><text x="256" y="58">5</text>
      <circle cx="62" cy="206" r="9" fill="#1D4ED8"/><text x="62" y="210">5</text>
    </g>
    <g font-size="12" fill="#0F172A">
      <circle cx="450" cy="50" r="9" fill="#2563EB"/><text x="450" y="54" text-anchor="middle" font-size="11" font-weight="bold" fill="#FFFFFF">1</text>
      <text x="466" y="54"><tspan font-weight="bold">Class</tspan>: “hộp” chứa toàn bộ code.</text>
      <text x="466" y="71" fill="#64748B">Tên phải trùng tên file HelloOnward.java</text>
      <circle cx="450" cy="96" r="9" fill="#047857"/><text x="450" y="100" text-anchor="middle" font-size="11" font-weight="bold" fill="#FFFFFF">2</text>
      <text x="466" y="100"><tspan font-weight="bold">Method main</tspan>: cửa chính của chương trình.</text>
      <text x="466" y="117" fill="#64748B">JVM bắt đầu chạy từ dòng đầu của main</text>
      <circle cx="450" cy="142" r="9" fill="#D97706"/><text x="450" y="146" text-anchor="middle" font-size="11" font-weight="bold" fill="#FFFFFF">3</text>
      <text x="466" y="146"><tspan font-weight="bold">String[] args</tspan>: dữ liệu gõ kèm lệnh chạy.</text>
      <text x="466" y="163" fill="#64748B">Bài này chưa dùng tới</text>
      <circle cx="450" cy="188" r="9" fill="#64748B"/><text x="450" y="192" text-anchor="middle" font-size="11" font-weight="bold" fill="#FFFFFF">4</text>
      <text x="466" y="192"><tspan font-weight="bold">Câu lệnh</tspan>: in một dòng chữ ra màn hình.</text>
      <text x="466" y="209" fill="#64748B">Luôn kết thúc bằng dấu ;</text>
      <circle cx="450" cy="234" r="9" fill="#1D4ED8"/><text x="450" y="238" text-anchor="middle" font-size="11" font-weight="bold" fill="#FFFFFF">5</text>
      <text x="466" y="238"><tspan font-weight="bold">Cặp { }</tspan>: mở và đóng một khối lệnh.</text>
      <text x="466" y="255" fill="#64748B">Khối class bọc ngoài khối main</text>
    </g>
  </g>
</svg>

Tạo một file tên **`HelloOnward.java`** và gõ đúng nội dung sau:

```java
// Mỗi chương trình Java nằm trong ít nhất một class
public class HelloOnward {

    // main là "cửa chính": JVM bắt đầu chạy từ đây
    public static void main(String[] args) {
        // Một câu lệnh: in một dòng chữ ra màn hình
        System.out.println("Xin chào! Chào mừng bạn đến với Onward Digital Banking.");
    }
}
```

**Kết quả khi chạy** (phần 2 sẽ chỉ cách chạy):

```text
Xin chào! Chào mừng bạn đến với Onward Digital Banking.
```

**Giải thích từng bước:**

1. Các dòng bắt đầu bằng `//` là **comment** (*chú thích*): ghi chú cho người đọc, Java bỏ
   qua chúng. Phần 4 sẽ học kỹ.
2. `public class HelloOnward { ... }` khai báo một class tên `HelloOnward`. Chữ **`public`**
   (*công khai*) nghĩa là ai cũng dùng được class này. Vì class là `public`, tên file **bắt
   buộc** là `HelloOnward.java`: trùng từng chữ, kể cả chữ hoa [5]. Một file Java điển hình
   còn có thể chứa thêm `package`, `import`... (các bài sau sẽ gặp) [11].
   Cặp `{` `}` sau tên class tạo thành khối lệnh của class, bao lấy toàn bộ nội dung của nó.
3. `public static void main(String[] args)` là method đặc biệt. Khi chương trình chạy, JVM
   tìm đúng method này và bắt đầu từ dòng đầu tiên trong nó [6]. Các chữ `static`,
   `void` bạn tạm học thuộc; bài 6 và chặng 2 sẽ giải thích.
4. `String[] args` là danh sách chữ mà người dùng có thể gõ kèm khi chạy chương trình. Bài
   này chưa dùng tới, nhưng vẫn phải viết đủ.
5. `System.out.println("...");` là câu lệnh duy nhất. Nó in đoạn chữ trong dấu ngoặc kép
   ra màn hình. `System.out` là "đầu ra chuẩn", thường chính là màn hình terminal (phần 6
   nói kỹ). Đoạn chữ đặt trong `"..."` gọi là **chuỗi ký tự** (*String literal*).
6. Hết câu lệnh trong `main` thì chương trình kết thúc.

### ⚠️ Lỗi hay gặp

**Lỗi 1: tên file khác tên class.** Bạn lưu code trên vào file `Hello.java` rồi biên
dịch (*compile*: dịch code sang dạng máy chạy được, phần 2 nói rõ hơn) bằng lệnh `javac`
(bài 2 sẽ học kỹ lệnh này):

```text
Hello.java:2: error: class HelloOnward is public, should be declared in a file named HelloOnward.java
public class HelloOnward {
       ^
1 error
```

✅ Cách sửa: đổi tên file thành `HelloOnward.java`, hoặc đổi tên class cho trùng tên file.

**Lỗi 2: viết `Main` thay vì `main`.** Java phân biệt chữ hoa và thường, nên `Main` là một
method khác hẳn. JVM không tìm thấy cửa chính:

```java
public class HelloOnward {
    public static void Main(String[] args) {   // sai: M viết hoa
        System.out.println("Xin chào!");
    }
}
```

```text
error: can't find main(String[]) method in class: HelloOnward
```

✅ Cách sửa: viết đúng `main`, chữ thường hết. Trên JDK 25, câu thông báo có thể hơi khác
nhưng ý nghĩa giống hệt.

## 2. Chạy chương trình nhanh bằng một lệnh

**Ý tưởng nôm na.** Máy tính không đọc trực tiếp file `.java`. Code phải được **biên dịch**
(*compile*: dịch sang dạng máy hiểu) rồi mới **chạy** (*run*). Chương trình làm việc dịch đó
gọi là **trình biên dịch** (*compiler*); trong JDK, nó là `javac`. Giống như hồ sơ vay viết
tay phải được nhập vào hệ thống rồi mới xử lý. Từ JDK 11, lệnh `java` làm được cả hai
việc trong một bước nếu bạn đưa nó file `.java` [2].

<svg viewBox="0 0 760 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lệnh java HelloOnward.java làm hai việc liền nhau. Bước 1: file mã nguồn HelloOnward.java do bạn viết. Bước 2: biên dịch trong bộ nhớ, không tạo file .class. Bước 3: JVM chạy method main, từng câu lệnh một. Bước 4: màn hình hiện dòng chữ Xin chào. Bài 2 sẽ tách hai việc này ra thành lệnh javac để biên dịch và lệnh java để chạy.">
  <defs>
    <marker id="b1-run-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="200" y="12" width="360" height="34" rx="8" fill="#0F172A"/>
    <text x="380" y="34" font-family="monospace" font-size="14" fill="#F8FAFC">$ java HelloOnward.java</text>
    <path d="M220,56 L220,64 L540,64 L540,56" fill="none" stroke="#64748B"/>
    <text x="380" y="80" fill="#64748B">một lệnh làm cả hai việc: biên dịch rồi chạy</text>
    <rect x="10" y="100" width="150" height="70" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="85" y="128" font-family="monospace" fill="#0F172A">HelloOnward.java</text>
    <text x="85" y="148" fill="#64748B" font-size="11">mã nguồn bạn viết</text>
    <rect x="205" y="100" width="150" height="70" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="280" y="122" fill="#1D4ED8" font-weight="bold">Biên dịch</text>
    <text x="280" y="140" fill="#64748B" font-size="11">trong bộ nhớ</text>
    <text x="280" y="156" fill="#64748B" font-size="11">(không tạo file .class)</text>
    <rect x="400" y="100" width="150" height="70" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="475" y="128" fill="#047857" font-weight="bold">JVM chạy main()</text>
    <text x="475" y="148" fill="#64748B" font-size="11">từng câu lệnh một</text>
    <rect x="595" y="100" width="155" height="70" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="672" y="128" fill="#0F172A" font-weight="bold">Màn hình</text>
    <text x="672" y="148" fill="#64748B" font-family="monospace" font-size="11">Xin chào! ...</text>
    <line x1="160" y1="135" x2="200" y2="135" stroke="#64748B" marker-end="url(#b1-run-arrow)"/>
    <line x1="355" y1="135" x2="395" y2="135" stroke="#64748B" marker-end="url(#b1-run-arrow)"/>
    <line x1="550" y1="135" x2="590" y2="135" stroke="#64748B" marker-end="url(#b1-run-arrow)"/>
    <rect x="160" y="188" width="440" height="30" rx="6" fill="#FFFBEB" stroke="#D97706" stroke-dasharray="4 3"/>
    <text x="380" y="208" fill="#0F172A">Bài 2 sẽ tách ra: <tspan font-family="monospace">javac</tspan> (biên dịch) và <tspan font-family="monospace">java</tspan> (chạy)</text>
  </g>
</svg>

Mở terminal (cửa sổ dòng lệnh) tại thư mục chứa `HelloOnward.java` và gõ:

```bash
java HelloOnward.java
```

**Kết quả khi chạy:**

```text
Xin chào! Chào mừng bạn đến với Onward Digital Banking.
```

**Giải thích từng bước:**

1. Lệnh `java` thấy đuôi `.java`, nên hiểu đây là **chế độ chạy file nguồn** (*source-file
   mode*) [2].
2. Nó biên dịch file ngay trong bộ nhớ. Không có file `.class` (file chứa code đã biên dịch) nào được tạo ra trên ổ đĩa.
3. JVM tìm method `main` trong class đầu tiên của file, rồi chạy từng câu lệnh.
4. Câu lệnh `println` in chữ ra màn hình. Hết `main`, chương trình dừng.

Cách này rất tiện để học và thử nghiệm. Dự án thật (như các dịch vụ phần mềm của Onward) gồm
hàng trăm file, nên sẽ biên dịch bằng `javac` hoặc **công cụ build** (*build tool*: phần mềm tự
động biên dịch và đóng gói cả dự án, như Maven hay Gradle; chặng 5 sẽ học). **Bài 2** sẽ đi
kỹ con đường `javac` → **bytecode** (dạng code trung gian mà JVM hiểu) → JVM.

💡 **Ghi chú về Java 25.** Từ JDK 25, Java cho phép viết rút gọn, không cần khai báo class
và không cần `public static` (JEP 512; **JEP** là *JDK Enhancement Proposal*, bản đề xuất cải
tiến chính thức của JDK) [3]:

```java
void main() {
    IO.println("Xin chào!");
}
```

Ở đây `IO` là class mới `java.lang.IO` của Java 25, giúp in và đọc dữ liệu trên terminal gọn hơn mà
không cần dòng `import` (khai báo dùng class ở nơi khác, các bài sau sẽ gặp). Cách viết này hợp lệ, nhưng khoá học dùng dạng đầy đủ `public static void main(String[] args)`.
Lý do: code trong các dự án thật, tài liệu và thư viện bạn sẽ đọc đều viết theo dạng đầy đủ.

### ⚠️ Lỗi hay gặp

**Lỗi 1: quên đuôi `.java`.** Gõ `java HelloOnward` khi chưa biên dịch thì `java` đi tìm
file đã biên dịch `HelloOnward.class` và không thấy:

```text
Error: Could not find or load main class HelloOnward
Caused by: java.lang.ClassNotFoundException: HelloOnward
```

✅ Cách sửa: gõ đủ `java HelloOnward.java`.

**Lỗi 2: đứng sai thư mục.** Nếu terminal không ở thư mục chứa file, bạn nhận đúng kiểu lỗi
trên nhưng có đuôi `.java` (`Could not find or load main class HelloOnward.java`).

✅ Cách sửa: dùng `cd` để vào đúng thư mục, gõ `ls` (macOS/Linux) hoặc `dir` (Windows) để
thấy file `HelloOnward.java` rồi mới chạy.

**Lỗi 3: `java -version` báo bản cũ.** Máy có nhiều JDK và terminal đang dùng bản khác.

✅ Cách sửa: với SDKMAN, gõ `sdk use java <bản-25>`. Với bộ cài, mở terminal mới sau khi cài.

## 3. Câu lệnh, khối lệnh và chữ hoa / thường

**Ý tưởng nôm na.** Câu lệnh giống một dòng trong phiếu yêu cầu gửi giao dịch viên: mỗi
dòng một việc, kết thúc bằng dấu `;` như dấu chấm cuối câu. Các câu lệnh được gom vào
**khối lệnh** (*block*), nằm giữa cặp `{` `}`, giống các ngăn kéo lồng trong tủ hồ sơ.

<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Khối lệnh lồng nhau như hộp trong hộp. Hộp ngoài cùng là khối class WelcomeSteps. Bên trong là khối method main. Trong main có hai câu lệnh in Bước 1 và Bước 2, mỗi câu kết thúc bằng dấu chấm phẩy, và một khối lệnh nhỏ hơn chứa câu lệnh in - Chuyển tiền. Mỗi tầng lồng vào thì thụt lề thêm 4 dấu cách; trình biên dịch không cần thụt lề nhưng người đọc thì cần. Dấu chấm phẩy kết thúc một câu lệnh như dấu chấm cuối câu văn. Bên phải ghi chú: Java phân biệt chữ hoa chữ thường, System khác system, main khác Main, HelloOnward khác helloonward.">
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="470" height="280" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="24" y="32" font-family="monospace" font-size="13" fill="#1D4ED8">public class WelcomeSteps {</text>
    <text x="466" y="32" text-anchor="end" fill="#1D4ED8" font-size="11">khối class</text>
    <rect x="40" y="46" width="425" height="210" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="54" y="68" font-family="monospace" font-size="13" fill="#047857">public static void main(...) {</text>
    <text x="452" y="68" text-anchor="end" fill="#047857" font-size="11">khối main</text>
    <rect x="70" y="80" width="380" height="26" rx="5" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="82" y="98" font-family="monospace" fill="#0F172A">System.out.println("Bước 1...")<tspan fill="#DC2626" font-weight="bold">;</tspan></text>
    <rect x="70" y="112" width="380" height="26" rx="5" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="82" y="130" font-family="monospace" fill="#0F172A">System.out.println("Bước 2...")<tspan fill="#DC2626" font-weight="bold">;</tspan></text>
    <rect x="70" y="146" width="380" height="84" rx="8" fill="#F8FAFC" stroke="#64748B" stroke-dasharray="4 3"/>
    <text x="82" y="164" font-family="monospace" fill="#64748B">{</text>
    <text x="438" y="164" text-anchor="end" fill="#64748B" font-size="11">khối lồng bên trong</text>
    <rect x="100" y="172" width="335" height="24" rx="5" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="112" y="189" font-family="monospace" fill="#0F172A">System.out.println("- Chuyển tiền")<tspan fill="#DC2626" font-weight="bold">;</tspan></text>
    <text x="82" y="222" font-family="monospace" fill="#64748B">}</text>
    <text x="54" y="248" font-family="monospace" font-size="13" fill="#047857">}</text>
    <text x="24" y="280" font-family="monospace" font-size="13" fill="#1D4ED8">}</text>
    <text x="500" y="30" font-weight="bold" fill="#0F172A">Thụt lề: mỗi tầng thêm 4 dấu cách</text>
    <text x="500" y="50" fill="#64748B">Trình biên dịch không cần thụt lề,</text>
    <text x="500" y="66" fill="#64748B">nhưng người đọc code thì cần.</text>
    <text x="500" y="100" font-weight="bold" fill="#0F172A">Dấu <tspan fill="#DC2626">;</tspan> kết thúc một câu lệnh</text>
    <text x="500" y="120" fill="#64748B">Giống dấu chấm cuối câu văn.</text>
    <rect x="495" y="150" width="255" height="140" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="510" y="172" font-weight="bold" fill="#DC2626">Phân biệt hoa / thường</text>
    <g font-family="monospace" font-size="13" fill="#0F172A">
      <text x="510" y="200">System  ≠  system</text>
      <text x="510" y="226">main    ≠  Main</text>
      <text x="510" y="252">HelloOnward ≠ helloonward</text>
    </g>
    <text x="510" y="276" fill="#64748B" font-size="11">Sai một chữ hoa là chương trình lỗi</text>
  </g>
</svg>

```java
public class WelcomeSteps {
    public static void main(String[] args) {
        // Ba câu lệnh, mỗi câu kết thúc bằng dấu ;
        System.out.println("Bước 1: Xác thực khách hàng");
        System.out.println("Bước 2: Mở ứng dụng Onward");
        System.out.println("Bước 3: Chọn dịch vụ");

        { // Một khối lệnh lồng bên trong, gom hai câu lệnh lại
            System.out.println("  - Chuyển tiền");
            System.out.println("  - Xem số dư");
        }

        // Hai câu lệnh trên cùng một dòng: hợp lệ, nhưng khó đọc
        System.out.println("Cảm ơn"); System.out.println("quý khách!");
    }
}
```

**Kết quả khi chạy** (`java WelcomeSteps.java`):

```text
Bước 1: Xác thực khách hàng
Bước 2: Mở ứng dụng Onward
Bước 3: Chọn dịch vụ
  - Chuyển tiền
  - Xem số dư
Cảm ơn
quý khách!
```

**Giải thích từng bước:**

1. JVM vào `main` và chạy lần lượt từ trên xuống: Bước 1, 2, 3.
2. Gặp `{`, nó đi vào khối lồng bên trong, chạy hai câu lệnh, rồi ra ở `}`. Ở bài này khối
   lồng chỉ để minh hoạ; bài 5 sẽ dùng khối lệnh với `if` và vòng lặp.
3. Dòng cuối có hai câu lệnh. Java chỉ quan tâm dấu `;`, không quan tâm xuống dòng. Nhưng
   hãy viết **mỗi dòng một câu lệnh** cho dễ đọc.
4. **Thụt lề** (*indentation*): mỗi tầng khối lồng vào, lùi thêm 4 dấu cách. Trình biên dịch bỏ qua
   khoảng trắng này, nhưng đồng nghiệp review code của bạn thì không.

Java **phân biệt chữ hoa và chữ thường** (*case-sensitive*). `System` và `system` là hai
tên khác nhau, giống như số tài khoản sai một chữ số là chuyển nhầm người.

### ⚠️ Lỗi hay gặp

**Lỗi 1: quên dấu `;`.**

```java
System.out.println("Bước 1: Xác thực khách hàng")   // thiếu ;
System.out.println("Bước 2: Mở ứng dụng Onward");
```

```text
MissingSemicolon.java:3: error: ';' expected
        System.out.println("Bước 1: Xác thực khách hàng")
                                                         ^
1 error
```

✅ Cách sửa: thêm `;` đúng chỗ dấu `^` chỉ. javac luôn báo **số dòng** (ở đây là dòng 3);
hãy nhìn số đó trước tiên.

**Lỗi 2: viết `system` thay vì `System`.**

```text
LowerSystem.java:3: error: package system does not exist
        system.out.println("Xin chào!");
              ^
1 error
```

✅ Cách sửa: `System` viết hoa chữ `S`. Thông báo nghe lạ ("package" là gì?) nhưng nguyên
nhân chỉ là một chữ thường.

**Lỗi 3: thiếu dấu `}`.** Mỗi `{` phải có một `}` đi kèm. Thiếu một cái thì javac đọc
hết file vẫn chưa thấy khối đóng lại:

```text
MissingBrace.java:5: error: reached end of file while parsing
}
 ^
1 error
```

✅ Cách sửa: đếm cặp `{ }`. Thụt lề đúng giúp bạn thấy ngay khối nào chưa đóng.

## 4. Comment: ghi chú cho người đọc

**Ý tưởng nôm na.** **Comment** (*chú thích*) giống ghi chú bút chì bên lề hợp đồng: người
đọc thấy, còn hệ thống xử lý thì bỏ qua hoàn toàn. Java có 3 loại [4]:

| Loại | Cú pháp | Dùng khi |
|------|---------|----------|
| Một dòng | `// ...` | Giải thích ngắn, phổ biến nhất |
| Nhiều dòng | `/* ... */` | Giải thích dài, nhiều dòng |
| Javadoc | `/** ... */` | Mô tả class, method để sinh tài liệu |

<svg viewBox="0 0 760 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Compiler bỏ qua comment. Bên trái là file nguồn có ba loại comment được tô màu: comment Javadoc mở bằng gạch chéo hai sao, comment một dòng mở bằng hai gạch chéo, comment nhiều dòng nằm giữa gạch chéo sao và sao gạch chéo. Mũi tên javac đọc file. Bên phải là những gì trình biên dịch javac thực sự thấy: chỉ còn khai báo class, method main và hai câu lệnh println, mọi comment đã biến mất.">
  <defs>
    <marker id="b1-comment-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="10" y="18" font-weight="bold" fill="#0F172A">File bạn viết (người đọc)</text>
    <rect x="10" y="28" width="370" height="232" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <g font-family="monospace" font-size="12">
      <rect x="18" y="36" width="354" height="46" rx="4" fill="#FFFBEB"/>
      <text x="24" y="54" fill="#D97706">/** Chương trình chào khách.</text>
      <text x="24" y="72" fill="#D97706">    Javadoc: sinh tài liệu */</text>
      <text x="24" y="102" fill="#0F172A">public class CommentDemo {</text>
      <text x="40" y="122" fill="#0F172A">main(...) {</text>
      <rect x="52" y="130" width="300" height="22" rx="4" fill="#ECFDF5"/>
      <text x="56" y="146" fill="#047857">// Comment một dòng</text>
      <text x="56" y="168" fill="#0F172A">println("Xin chào...");</text>
      <rect x="52" y="176" width="300" height="42" rx="4" fill="#EFF6FF"/>
      <text x="56" y="192" fill="#1D4ED8">/* Comment nhiều dòng</text>
      <text x="56" y="210" fill="#1D4ED8">   giải thích dài hơn */</text>
      <text x="56" y="234" fill="#0F172A">println("Chúc...");</text>
      <text x="40" y="252" fill="#0F172A">} }</text>
    </g>
    <line x1="388" y1="144" x2="452" y2="144" stroke="#64748B" stroke-width="1.5" marker-end="url(#b1-comment-arrow)"/>
    <text x="420" y="134" text-anchor="middle" font-family="monospace" fill="#0F172A">javac</text>
    <text x="420" y="164" text-anchor="middle" fill="#64748B" font-size="11">bỏ qua</text>
    <text x="420" y="178" text-anchor="middle" fill="#64748B" font-size="11">comment</text>
    <text x="460" y="18" font-weight="bold" fill="#0F172A">Những gì trình biên dịch (javac) thấy</text>
    <rect x="460" y="28" width="290" height="232" rx="8" fill="#FFFFFF" stroke="#94A3B8"/>
    <g font-family="monospace" font-size="12" fill="#0F172A">
      <text x="474" y="102">public class CommentDemo {</text>
      <text x="490" y="122">main(...) {</text>
      <text x="506" y="168">println("Xin chào...");</text>
      <text x="506" y="234">println("Chúc...");</text>
      <text x="490" y="252">} }</text>
    </g>
    <g fill="#94A3B8" font-size="11" font-style="italic">
      <text x="474" y="62">(trống)</text>
      <text x="506" y="146">(trống)</text>
      <text x="506" y="200">(trống)</text>
    </g>
  </g>
</svg>

```java
/**
 * Chương trình chào khách hàng của Onward.
 * Đây là comment Javadoc: công cụ javadoc đọc nó để sinh tài liệu.
 */
public class CommentDemo {
    public static void main(String[] args) {
        // Comment một dòng: giải thích ngắn cho dòng bên dưới
        System.out.println("Xin chào quý khách!");

        /*
         * Comment nhiều dòng: dùng khi cần giải thích dài hơn.
         * Dòng in khuyến mãi bên dưới tạm tắt vì chương trình đã kết thúc.
         */
        // System.out.println("Ưu đãi: miễn phí chuyển khoản tháng 10");

        System.out.println("Chúc quý khách một ngày tốt lành."); // comment cuối dòng
    }
}
```

**Kết quả khi chạy:**

```text
Xin chào quý khách!
Chúc quý khách một ngày tốt lành.
```

**Giải thích từng bước:**

1. Khối `/** ... */` ở đầu là **Javadoc**. Công cụ `javadoc` trong JDK đọc loại comment này
   để sinh trang tài liệu HTML [9]. Chặng 6 sẽ học kỹ; giờ bạn chỉ cần nhận ra nó.
2. `// Comment một dòng`: mọi thứ từ `//` đến hết dòng bị bỏ qua.
3. Khối `/* ... */` bị bỏ qua toàn bộ, dù dài bao nhiêu dòng.
4. Dòng in khuyến mãi bắt đầu bằng `//`, nên **không chạy**. Đây là cách tạm tắt một câu
   lệnh mà không xoá nó.
5. Comment có thể đứng cuối dòng, sau câu lệnh. Câu lệnh vẫn chạy bình thường.

💡 Comment tốt giải thích **vì sao**, không nhắc lại **cái gì**. `// in lời chào` phía trên
`println("Xin chào")` là thừa. `// Theo quy định, phải chào bằng tên đầy đủ` thì có ích.

### ⚠️ Lỗi hay gặp

**Lỗi 1: lồng `/* */` vào trong `/* */`.** Comment nhiều dòng **không lồng nhau được** [4].
Dấu `*/` đầu tiên gặp được sẽ đóng comment, phần còn lại thành code lỗi:

```java
public class NestedComment {
    public static void main(String[] args) {
        /* Tạm tắt đoạn này
        System.out.println("Ưu đãi tháng 10"); /* in khuyến mãi */
        System.out.println("Ưu đãi tháng 11");
        */
    }
}
```

```text
NestedComment.java:6: error: illegal start of expression
        */
        ^
NestedComment.java:6: error: illegal start of expression
        */
         ^
NestedComment.java:7: error: illegal start of expression
    }
    ^
3 errors
```

✅ Cách sửa: khi tắt nhiều dòng code, dùng `//` ở đầu mỗi dòng. Hầu hết **IDE** (*môi trường lập trình*, phần mềm để viết code như IntelliJ IDEA hay VS Code) có phím tắt
cho việc này (`Cmd + /` hoặc `Ctrl + /`).

## 5. Định danh và quy ước đặt tên

**Ý tưởng nôm na.** **Định danh** (*identifier*) là cái tên bạn đặt cho class, biến, method.
Giống số tài khoản: phải đúng **quy tắc** của hệ thống thì mới hợp lệ, và nên theo
**quy ước** chung để ai nhìn cũng hiểu.

**Quy tắc bắt buộc** (sai là lỗi biên dịch) [4]:

- Chỉ gồm chữ cái, chữ số, dấu `_` và `$`.
- **Không** bắt đầu bằng chữ số.
- Không trùng **từ khoá** (*keyword*). Cũng không được dùng `true`, `false`, `null`.
- Phân biệt hoa/thường: `customerName` và `CustomerName` là hai tên khác nhau.

💡 "Chữ cái" ở đây gồm cả chữ Unicode, nên chữ tiếng Việt có dấu (ví dụ `soDư`) vẫn hợp lệ [4].
Nhưng quy ước là chỉ dùng chữ tiếng Anh không dấu. Riêng `_` đứng một mình là từ khoá, không
dùng làm tên được; `_` chỉ hợp lệ khi đi cùng ký tự khác, như `_temp`.

**Quy ước** (không bắt buộc, nhưng cả cộng đồng Java và team Onward đều theo) [7]:

<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ba kiểu đặt tên trong Java. PascalCase, viết hoa chữ cái đầu mỗi từ, dùng cho class, ví dụ HelloOnward, SimpleReceipt. camelCase, từ đầu viết thường, các từ sau viết hoa chữ đầu, dùng cho biến và method, ví dụ customerName, printWelcome. UPPER_SNAKE_CASE, toàn chữ hoa, nối bằng dấu gạch dưới, dùng cho hằng số, ví dụ BANK_NAME, MAX_TRANSFER_AMOUNT. Hàng dưới: tên hợp lệ gồm customerName, _temp, amount2, $total; tên không hợp lệ gồm 2ndCustomer vì bắt đầu bằng chữ số, class vì là từ khoá, so-du vì có dấu gạch ngang, customer name vì có dấu cách.">
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="10" y="10" width="236" height="140" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="128" y="38" font-family="monospace" font-size="15" font-weight="bold" fill="#1D4ED8">PascalCase</text>
    <text x="128" y="60" fill="#64748B">Hoa chữ đầu mỗi từ</text>
    <text x="128" y="88" fill="#0F172A" font-weight="bold">Dùng cho: class</text>
    <text x="128" y="114" font-family="monospace" fill="#0F172A">HelloOnward</text>
    <text x="128" y="134" font-family="monospace" fill="#0F172A">SimpleReceipt</text>
    <rect x="262" y="10" width="236" height="140" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="380" y="38" font-family="monospace" font-size="15" font-weight="bold" fill="#047857">camelCase</text>
    <text x="380" y="60" fill="#64748B">Từ đầu thường, từ sau hoa chữ đầu</text>
    <text x="380" y="88" fill="#0F172A" font-weight="bold">Dùng cho: biến, method</text>
    <text x="380" y="114" font-family="monospace" fill="#0F172A">customerName</text>
    <text x="380" y="134" font-family="monospace" fill="#0F172A">printWelcome</text>
    <rect x="514" y="10" width="236" height="140" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="632" y="38" font-family="monospace" font-size="15" font-weight="bold" fill="#D97706">UPPER_SNAKE_CASE</text>
    <text x="632" y="60" fill="#64748B">Toàn chữ hoa, nối bằng dấu _</text>
    <text x="632" y="88" fill="#0F172A" font-weight="bold">Dùng cho: hằng số</text>
    <text x="632" y="114" font-family="monospace" fill="#0F172A">BANK_NAME</text>
    <text x="632" y="134" font-family="monospace" fill="#0F172A">MAX_TRANSFER_AMOUNT</text>
    <rect x="10" y="166" width="365" height="124" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="192" y="190" font-weight="bold" fill="#047857">✓ Tên hợp lệ</text>
    <g text-anchor="start" fill="#0F172A">
      <text x="28" y="216" font-family="monospace">customerName</text><text x="170" y="216" fill="#64748B">chữ cái đứng đầu</text>
      <text x="28" y="240" font-family="monospace">amount2</text><text x="170" y="240" fill="#64748B">số ở giữa/cuối: được</text>
      <text x="28" y="264" font-family="monospace">_temp, $total</text><text x="170" y="264" fill="#64748B">_ và $ được, nhưng ít dùng</text>
    </g>
    <rect x="385" y="166" width="365" height="124" rx="10" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="567" y="190" font-weight="bold" fill="#DC2626">✗ Tên không hợp lệ</text>
    <g text-anchor="start" fill="#0F172A">
      <text x="403" y="212" font-family="monospace">2ndCustomer</text><text x="545" y="212" fill="#64748B">bắt đầu bằng chữ số</text>
      <text x="403" y="236" font-family="monospace">class</text><text x="545" y="236" fill="#64748B">trùng từ khoá</text>
      <text x="403" y="258" font-family="monospace">so-du</text><text x="545" y="258" fill="#64748B">có dấu gạch ngang</text>
      <text x="403" y="280" font-family="monospace">customer name</text><text x="545" y="280" fill="#64748B">có dấu cách</text>
    </g>
  </g>
</svg>

Ví dụ dưới đây có một hằng số, một **biến** (*variable*: chiếc hộp có tên để giữ một giá
trị, bài 3 sẽ học kỹ) và một method tự viết (bài 6 sẽ học kỹ). Bạn chỉ cần để ý **cách đặt
tên**:

```java
// Tên class: PascalCase (viết hoa chữ cái đầu mỗi từ)
public class NamingDemo {

    // Hằng số: UPPER_SNAKE_CASE (chữ hoa, nối các từ bằng dấu _)
    static final String BANK_NAME = "Onward Digital Banking";

    public static void main(String[] args) {
        // Biến: camelCase (từ đầu viết thường, các từ sau viết hoa chữ đầu)
        String customerName = "Lan";

        System.out.print("Khách hàng: ");
        System.out.println(customerName);
        printWelcome();
    }

    // Method: camelCase, thường bắt đầu bằng một động từ
    static void printWelcome() {
        System.out.print("Chào mừng đến với ");
        System.out.println(BANK_NAME);
    }
}
```

**Kết quả khi chạy:**

```text
Khách hàng: Lan
Chào mừng đến với Onward Digital Banking
```

**Giải thích từng bước:**

1. JVM vào `main`. Câu lệnh đầu tạo biến `customerName` giữ chữ `"Lan"`.
2. `print("Khách hàng: ")` in chữ mà không xuống dòng; `println(customerName)` in giá trị
   trong biến (`Lan`, không có ngoặc kép) rồi xuống dòng. Phần 6 nói kỹ `print` và `println`.
3. `printWelcome();` gọi method `printWelcome`. JVM nhảy xuống method đó, chạy hai câu lệnh
   bên trong, rồi quay về `main`.
4. `BANK_NAME` có chữ **`final`**: giá trị không bao giờ đổi, nên gọi là **hằng số**
   (*constant*). Hằng số viết toàn chữ hoa.

**Một số từ khoá phổ biến.** Java 25 có 51 từ khoá dành riêng [4]. Bạn không cần thuộc hết;
IDE sẽ tô màu chúng. Đây là những từ bạn sẽ gặp sớm nhất:

| Từ khoá | Ý nghĩa ngắn | Gặp lại ở |
|---------|--------------|-----------|
| `class` | Khai báo một class | Bài này |
| `public`, `static`, `void` | Đi kèm `main` | Bài 6, chặng 2 |
| `final` | Không được thay đổi | Bài 3 |
| `int`, `long`, `double`, `boolean` | Kiểu dữ liệu | Bài 3 |
| `if`, `else`, `for`, `while` | Rẽ nhánh và lặp | Bài 5 |
| `new`, `return` | Tạo object, trả kết quả | Bài 6 |

Ngoài ra có vài từ chỉ đặc biệt trong ngữ cảnh riêng, gọi là **từ khoá ngữ cảnh**
(*contextual keyword*), như `var`, `record`, `yield` [4]. Bạn sẽ gặp chúng ở các bài sau.

### ⚠️ Lỗi hay gặp

**Lỗi 1: tên bắt đầu bằng chữ số.**

```java
String 2ndCustomer = "Minh";
```

```text
BadNames.java:3: error: not a statement
        String 2ndCustomer = "Minh";
        ^
BadNames.java:3: error: ';' expected
        String 2ndCustomer = "Minh";
              ^
2 errors
```

✅ Cách sửa: `secondCustomer` hoặc `customer2`. Để ý: javac không nói thẳng "tên sai", mà báo
lỗi khó hiểu. Khi thấy lỗi lạ quanh một cái tên, hãy kiểm tra tên trước.

**Lỗi 2: dùng từ khoá làm tên.**

```text
KeywordName.java:3: error: not a statement
        String class = "VIP";
        ^
KeywordName.java:3: error: ';' expected
        String class = "VIP";
              ^
KeywordName.java:3: error: <identifier> expected
        String class = "VIP";
                    ^
3 errors
```

✅ Cách sửa: chọn tên khác, ví dụ `customerClass` hoặc `tier`.

**Lỗi 3: gọi sai hoa/thường.** Khai báo `customerName` nhưng gọi `CustomerName`:

```text
CaseName.java:4: error: cannot find symbol
        System.out.println(CustomerName);
                           ^
  symbol:   variable CustomerName
  location: class CaseName
1 error
```

✅ Cách sửa: gõ đúng y hệt tên lúc khai báo. `cannot find symbol` là lỗi bạn sẽ gặp nhiều
nhất trong đời dev Java; nó thường là gõ sai tên.

## 6. In ra màn hình: `println`, `print`, `printf`

**Ý tưởng nôm na.** `System.out` là "máy in biên lai" nối với màn hình. Bạn có ba nút bấm:
`println` in xong thì nhả giấy xuống dòng, `print` in xong đứng yên, còn `printf` điền số
vào một mẫu biên lai có sẵn chỗ trống.

<svg viewBox="0 0 760 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="So sánh ba cách in. Hàng 1, println: in Người nhận rồi đưa con trỏ xuống đầu dòng mới. Hàng 2, print: in Người nhận, con trỏ đứng ngay sau chữ, lần in tiếp theo nối vào cùng dòng thành Người nhận: Nguyễn Văn An. Hàng 3, printf: khuôn mẫu Số tiền: %d VND%n cùng giá trị 500000; %d được thay bằng 500000, %n là xuống dòng, kết quả Số tiền: 500000 VND rồi con trỏ xuống dòng mới. Con trỏ được vẽ là một vạch xanh lá.">
  <defs>
    <marker id="b1-print-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="20" y="20" font-weight="bold" fill="#0F172A">Câu lệnh</text>
    <text x="440" y="20" font-weight="bold" fill="#0F172A">Màn hình (vạch xanh lá = con trỏ)</text>
    <rect x="10" y="32" width="380" height="64" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="54" font-family="monospace" fill="#0F172A">println("Người nhận:");</text>
    <text x="22" y="80" fill="#1D4ED8">in xong thì xuống dòng</text>
    <line x1="392" y1="64" x2="426" y2="64" stroke="#64748B" marker-end="url(#b1-print-arrow)"/>
    <rect x="430" y="32" width="320" height="64" rx="8" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.5"/>
    <text x="444" y="56" font-family="monospace" fill="#0F172A">Người nhận:</text>
    <rect x="444" y="70" width="3" height="16" fill="#047857"/>
    <rect x="10" y="112" width="380" height="64" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="22" y="134" font-family="monospace" fill="#0F172A">print("Người nhận: ");</text>
    <text x="22" y="160" fill="#047857">in xong ĐỨNG YÊN, lần in sau nối tiếp</text>
    <line x1="392" y1="144" x2="426" y2="144" stroke="#64748B" marker-end="url(#b1-print-arrow)"/>
    <rect x="430" y="112" width="320" height="64" rx="8" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.5"/>
    <text x="444" y="136" font-family="monospace" fill="#0F172A">Người nhận: <tspan dx="8" fill="#94A3B8">Nguyễn Văn An</tspan></text>
    <rect x="531" y="122" width="3" height="18" fill="#047857"/>
    <text x="444" y="162" font-size="11" fill="#64748B">lần in sau (chữ xám) nối tiếp ngay sau con trỏ</text>
    <rect x="10" y="192" width="380" height="88" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="22" y="214" font-family="monospace" fill="#0F172A">printf("Số tiền: <tspan fill="#1D4ED8" font-weight="bold">%d</tspan> VND<tspan fill="#047857" font-weight="bold">%n</tspan>", <tspan fill="#1D4ED8" font-weight="bold">500000</tspan>);</text>
    <text x="22" y="240" fill="#0F172A"><tspan font-family="monospace" fill="#1D4ED8" font-weight="bold">%d</tspan> = chỗ trống cho một số nguyên</text>
    <text x="22" y="262" fill="#0F172A"><tspan font-family="monospace" fill="#047857" font-weight="bold">%n</tspan> = xuống dòng</text>
    <line x1="392" y1="236" x2="426" y2="236" stroke="#64748B" marker-end="url(#b1-print-arrow)"/>
    <rect x="430" y="192" width="320" height="88" rx="8" fill="#FFFFFF" stroke="#0F172A" stroke-width="1.5"/>
    <text x="444" y="222" font-family="monospace" fill="#0F172A">Số tiền: <tspan fill="#1D4ED8" font-weight="bold">500000</tspan> VND</text>
    <rect x="444" y="238" width="3" height="16" fill="#047857"/>
  </g>
</svg>

Muốn in những ký tự "khó gõ" vào chuỗi, như dấu ngoặc kép hay phím Tab, bạn dùng
**escape sequence** (*chuỗi thoát*): một dấu `\` theo sau là một ký tự [4].

| Escape | In ra | Ví dụ trong biên lai |
|--------|-------|----------------------|
| `\n` | Xuống dòng | Tách hai dòng trong một chuỗi |
| `\t` | Một khoảng Tab | Canh cột "Số tiền:", "Phí:" |
| `\"` | Dấu `"` | Nội dung `"Trả tiền nhà"` |
| `\\` | Dấu `\` | Đường dẫn `C:\Onward` |

Ví dụ: in một biên lai chuyển tiền. Số tiền tạm viết là số nguyên (đơn vị đồng); bài 4 sẽ
học cách xử lý tiền chuẩn bằng `BigDecimal`.

```java
public class SimpleReceipt {
    public static void main(String[] args) {
        // println: in xong thì xuống dòng
        System.out.println("===== BIÊN LAI CHUYỂN TIỀN =====");

        // print: in xong KHÔNG xuống dòng, chữ in sau nối tiếp ngay phía sau
        System.out.print("Người nhận: ");
        System.out.println("Nguyễn Văn An");

        // printf: in theo khuôn mẫu; %d được thay bằng số, %n là xuống dòng
        System.out.printf("Số tiền:\t%d VND%n", 500000);
        System.out.printf("Phí:\t\t%d VND%n", 0);

        // \" in ra dấu ngoặc kép, \t là một khoảng tab
        System.out.println("Nội dung:\t\"Trả tiền nhà tháng 10\"");

        // \\ in ra một dấu gạch chéo ngược
        System.out.println("Lưu tại:\tC:\\Onward\\bien-lai");

        // \n xuống dòng ngay giữa chuỗi
        System.out.println("================================\nCảm ơn quý khách!");
    }
}
```

**Kết quả khi chạy:**

```text
===== BIÊN LAI CHUYỂN TIỀN =====
Người nhận: Nguyễn Văn An
Số tiền:	500000 VND
Phí:		0 VND
Nội dung:	"Trả tiền nhà tháng 10"
Lưu tại:	C:\Onward\bien-lai
================================
Cảm ơn quý khách!
```

**Giải thích từng bước:**

1. `println` in tiêu đề rồi xuống dòng.
2. `print("Người nhận: ")` in xong **không** xuống dòng, nên `println("Nguyễn Văn An")` nối
   tiếp trên cùng dòng.
3. `printf` nhận một **chuỗi định dạng** (*format string*) và các giá trị. `%d` là chỗ trống
   cho một số nguyên, được thay bằng `500000`. `%n` là xuống dòng [8]. `\t` đẩy chữ sang cột
   Tab tiếp theo, nên "Phí:" (ngắn hơn) cần hai `\t` để thẳng cột với "Số tiền:".
4. `\"` cho phép đặt dấu `"` vào giữa chuỗi mà không làm chuỗi kết thúc sớm.
5. `\\` in ra một dấu `\`. Một dấu `\` đứng một mình sẽ bị hiểu là bắt đầu escape.
6. `\n` giữa chuỗi chia nó thành hai dòng.

💡 `%n` và `\n` đều xuống dòng. Trong `printf`, nên dùng `%n` vì nó tự chọn ký tự xuống
dòng đúng cho hệ điều hành (Windows khác macOS/Linux) [8].

### ⚠️ Lỗi hay gặp

**Lỗi 1: một dấu `\` đứng một mình.**

```java
System.out.println("Lưu tại: C:\Onward\bien-lai");
```

```text
BadEscape.java:3: error: illegal escape character
        System.out.println("Lưu tại: C:\Onward\bien-lai");
                                        ^
1 error
```

✅ Cách sửa: viết `\\` cho mỗi dấu gạch chéo ngược: `"C:\\Onward\\bien-lai"`.

**Lỗi 2: quên `%n` trong `printf`.** `printf` **không** tự xuống dòng như `println`:

```java
System.out.printf("Số tiền: %d VND", 500000);
System.out.printf("Phí: %d VND", 0);
```

```text
Số tiền: 500000 VNDPhí: 0 VND
```

✅ Cách sửa: thêm `%n` vào cuối mẫu: `"Số tiền: %d VND%n"`.

**Lỗi 3: `%d` nhưng đưa vào một chuỗi.** `"500000"` trong ngoặc kép là chữ, không phải số.
Lỗi này **không** bị javac bắt, mà chỉ nổ khi chạy:

```java
System.out.printf("Số tiền: %d VND%n", "500000");
```

```text
Số tiền: Exception in thread "main" java.util.IllegalFormatConversionException: d != java.lang.String
	at java.base/java.util.Formatter$FormatSpecifier.failConversion(Formatter.java:4515)
	...
	at WrongFormat.main(WrongFormat.java:3)
```

✅ Cách sửa: bỏ ngoặc kép để truyền số `500000`, hoặc đổi `%d` thành `%s` (chỗ trống cho
chuỗi). Dòng cuối của thông báo (`WrongFormat.java:3`) chỉ đúng dòng gây lỗi.

## Tóm tắt

- Một chương trình Java nằm trong **class**. Class `public` phải nằm trong file trùng tên,
  đuôi `.java`.
- Chương trình bắt đầu chạy từ `public static void main(String[] args)`.
- `java TenFile.java` biên dịch và chạy trong một bước (JDK 11+). Bài 2 sẽ tách ra `javac`
  và `java`.
- Mỗi **câu lệnh** kết thúc bằng `;`. **Khối lệnh** nằm trong `{ }`. Thụt lề 4 dấu cách mỗi tầng.
- Java phân biệt chữ hoa/thường: `System` ≠ `system`, `main` ≠ `Main`.
- Ba loại comment: `//`, `/* */`, `/** */` (Javadoc). Comment nhiều dòng không lồng nhau.
- Đặt tên: class `PascalCase`, biến và method `camelCase`, hằng số `UPPER_SNAKE_CASE`. Tên
  không bắt đầu bằng số, không trùng từ khoá.
- `println` in rồi xuống dòng, `print` in và đứng yên, `printf` điền giá trị vào mẫu (`%d`,
  `%s`, `%n`). Escape `\n \t \" \\` để in ký tự đặc biệt.

## Tự kiểm tra

**1.** File `Receipt.java` chứa `public class SimpleReceipt { ... }`. Biên dịch có được không?

<details><summary>Đáp án</summary>

Không. Class `public` phải nằm trong file trùng tên, nên file phải là `SimpleReceipt.java`.
javac báo `class SimpleReceipt is public, should be declared in a file named SimpleReceipt.java`.

</details>

**2.** Tên nào hợp lệ: `accountBalance`, `1stTransfer`, `_fee`, `new`, `total-amount`?

<details><summary>Đáp án</summary>

Hợp lệ: `accountBalance`, `_fee`. Không hợp lệ: `1stTransfer` (bắt đầu bằng số), `new` (từ
khoá), `total-amount` (có dấu `-`). Theo quy ước thì nên dùng `accountBalance`; `_fee` hợp
lệ nhưng ít dùng.

</details>

**3.** Đoạn sau in ra mấy dòng, nội dung gì?

```java
System.out.print("Số dư: ");
System.out.print("1.000.000 VND");
System.out.println();
System.out.println("Hết");
```

<details><summary>Đáp án</summary>

Hai dòng:

```text
Số dư: 1.000.000 VND
Hết
```

Hai lệnh `print` nối nhau trên cùng một dòng. `println()` không có gì bên trong chỉ để xuống dòng.

</details>

**4.** Bạn đặt tên hằng số mức chuyển tiền tối đa mỗi ngày như thế nào cho đúng quy ước?

<details><summary>Đáp án</summary>

`MAX_DAILY_TRANSFER` (hoặc tương tự): toàn chữ hoa, các từ nối bằng `_`.

</details>

**5.** Vì sao lệnh `System.out.printf("Phí: %d VND%n", "0");` biên dịch được nhưng chạy lại lỗi?

<details><summary>Đáp án</summary>

`"0"` là chuỗi, còn `%d` cần số nguyên. javac không kiểm tra sự khớp nhau này, nên lỗi chỉ
xuất hiện khi chạy: `IllegalFormatConversionException: d != java.lang.String`. Sửa bằng
cách truyền số `0`, hoặc dùng `%s`.

</details>

**6.** Muốn in đúng dòng `Nội dung: "Lương" \ tháng 10` thì chuỗi trong `println` phải viết thế nào?

<details><summary>Đáp án</summary>

```java
System.out.println("Nội dung: \"Lương\" \\ tháng 10");
```

Mỗi dấu `"` bên trong viết thành `\"`, dấu `\` viết thành `\\`.

</details>

## Bài tập

**Bài 1 (dễ): Lời chào cá nhân.** Viết class `GreetingCard` in ra ba dòng: lời chào, tên
bạn, và câu "Chúc bạn một ngày giao dịch suôn sẻ!". Chạy bằng `java GreetingCard.java`.

> Gợi ý: ba câu lệnh `println`. Nhớ tên file trùng tên class.

**Bài 2 (vừa): Sửa lỗi.** Đoạn code sau có **3 lỗi** làm chương trình không chạy được và
**1 chỗ sai quy ước** đặt tên. Lưu nó vào file `onwardNotice.java`, tìm và sửa hết:

```java
public class onwardNotice {
    public static void Main(String[] args) {
        system.out.println("Thông báo bảo trì hệ thống")
        System.out.println("Thời gian: 23:00 - 23:30");
    }
}
```

> Gợi ý: javac thường báo từng lỗi một; sửa xong lỗi này mới thấy lỗi tiếp theo. Kiểm tra
> dấu `;`, chữ hoa/thường của `System` và `main`. Cuối cùng đổi tên class theo `PascalCase`
> (nhớ đổi cả tên file cho khớp).

**Bài 3 (khó hơn): Sao kê mini.** In một bảng sao kê 3 giao dịch, canh cột bằng `\t` và
dùng `printf` với `%d` cho số tiền:

```text
===== SAO KÊ THÁNG 10 =====
Ngày	Nội dung		Số tiền (VND)
01/10	"Lương tháng 9"		15000000
05/10	Trả tiền điện		-850000
12/10	Chuyển cho mẹ		-2000000
```

> Gợi ý: mỗi dòng giao dịch là một `printf` có `%d` và `%n`. Nội dung có ngoặc kép cần `\"`.
> Số âm vẫn in được bằng `%d`. Thử thay `\t` bằng khoảng trắng để thấy vì sao Tab tiện hơn.

## Đọc thêm

1. roadmap.sh, *Java Developer Roadmap*, chủ đề Basic Syntax: <https://roadmap.sh/java>,
   tài liệu chính: dev.java, *Java Language Basics*: <https://dev.java/learn/language-basics/>
2. OpenJDK, *JEP 330: Launch Single-File Source-Code Programs* (JDK 11): <https://openjdk.org/jeps/330>
3. OpenJDK, *JEP 512: Compact Source Files and Instance Main Methods* (JDK 25): <https://openjdk.org/jeps/512>
4. *The Java Language Specification, Java SE 25*, Chương 3 (comment §3.7, định danh §3.8,
   từ khoá §3.9, escape sequence §3.10.7): <https://docs.oracle.com/javase/specs/jls/se25/html/jls-3.html>
5. *JLS Java SE 25*, §7.6 (khai báo class ở cấp cao nhất và tên file):
   <https://docs.oracle.com/javase/specs/jls/se25/html/jls-7.html#jls-7.6>
6. *JLS Java SE 25*, §12.1.4 (gọi method `main`):
   <https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.1.4>
7. Oracle, *Code Conventions for the Java Programming Language: Naming Conventions*:
   <https://www.oracle.com/java/technologies/javase/codeconventions-namingconventions.html>
8. Java SE 25 API, `java.util.Formatter` (cú pháp `%d`, `%s`, `%n` của `printf`):
   <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Formatter.html>
9. Java SE 25, *The javadoc Command*: <https://docs.oracle.com/en/java/javase/25/docs/specs/man/javadoc.html>
10. Oracle, *Java Platform, Standard Edition Java Shell User's Guide* (JShell, JEP 222):
    <https://docs.oracle.com/en/java/javase/25/jshell/introduction-jshell.html>
11. Jakob Jenkov, *Java Syntax*: <https://jenkov.com/tutorials/java/syntax.html>

---

**Bài tiếp theo:** [Vòng đời một chương trình Java](/docs/learning/chang-1/vong-doi-chuong-trinh)
