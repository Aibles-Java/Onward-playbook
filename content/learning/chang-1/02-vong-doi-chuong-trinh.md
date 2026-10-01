---
title: "Bài 2 · Vòng đời một chương trình Java"
description: "Đi theo một chương trình Java từ file .java, qua javac và bytecode, vào bên trong JVM, cho tới lúc nó kết thúc với một exit code."
order: 12
tags: [java, chặng-1, jvm, bytecode, javac, jdk]
---

# Bài 2 · Vòng đời một chương trình Java

> 🎯 **Sau bài này bạn sẽ:**
>
> - Vẽ lại được đường đi `.java` → `javac` → `.class` (bytecode) → JVM → mã máy.
> - Phân biệt được JDK, JRE và JVM, và biết máy mình cần cài cái gì.
> - Tự biên dịch bằng `javac -d out`, chạy bằng `java -cp out`, và phân biệt lỗi biên dịch với lỗi lúc chạy.
> - Đọc được vài dòng bytecode bằng `javap -c` và kể tên các bước JVM làm khi chạy chương trình.
> - Biết chương trình Java kết thúc khi nào và xem được exit code bằng `echo $?`.

**Cần biết trước:** [Bài 1 · Cú pháp cơ bản](/docs/learning/chang-1/cu-phap-co-ban). Bạn cần biết một
class có hàm `main` trông thế nào và đã từng chạy một chương trình "Hello".

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| Mã nguồn (*source code*) | Chữ bạn gõ, người đọc được | `Greeting.java` |
| Trình biên dịch (*compiler*) | Công cụ dịch mã nguồn sang bytecode | `javac` |
| Bytecode | "Ngôn ngữ chung" mà mọi JVM đều hiểu | `Greeting.class` |
| JVM (*Java Virtual Machine*) | Chương trình chạy bytecode trên máy thật | lệnh `java` |
| JRE / JDK | Bộ để **chạy** / bộ để **viết và chạy** Java | JDK 21 |
| Class loader | Bộ phận của JVM nạp file `.class` vào bộ nhớ | nạp `Account` khi cần |
| JIT (*Just-In-Time compiler*) | Dịch đoạn code chạy nhiều sang mã máy để chạy nhanh hơn | "mixed mode" |
| Garbage Collector (GC) | Bộ phận tự dọn vùng nhớ không còn dùng | G1 GC |
| Exit code | Con số chương trình trả về khi kết thúc. `0` là ổn | `echo $?` |

---

## 1. Bức tranh lớn: từ file `.java` tới mã máy

**Ý tưởng nôm na.** Hãy tưởng tượng Onward soạn **một bản hợp đồng mẫu** bằng tiếng Việt (mã nguồn).
Bản này được dịch một lần sang một thứ **"phiên âm chung"** mà phiên dịch viên ở nước nào cũng đọc được
(bytecode). Đến mỗi nước, một **phiên dịch viên tại chỗ** (JVM) đọc bản phiên âm chung và nói lại bằng
tiếng địa phương (mã máy của CPU đó). Soạn một lần, dùng ở mọi nơi.

Trong Java, đường đi đó gồm bốn chặng:

1. Bạn viết **mã nguồn** (*source code*) trong file `.java`.
2. **Trình biên dịch** (*compiler*) tên `javac` dịch nó thành **bytecode**, lưu trong file `.class` [3][6].
3. Lệnh `java` khởi động **máy ảo Java** (*Java Virtual Machine*, JVM).
4. JVM đọc bytecode và biến nó thành **mã máy** (*machine code*), tức các lệnh mà CPU thật hiểu được.

<svg viewBox="0 0 740 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sơ đồ bốn chặng: file Greeting.java (mã nguồn, người đọc được) đi qua javac (trình biên dịch, chạy một lần lúc build) thành Greeting.class (bytecode, mọi JVM đều hiểu), rồi lệnh java khởi động JVM (nạp, kiểm tra, chạy), JVM sinh ra mã máy cho CPU thật. Phần bên trái là thời điểm biên dịch, phần bên phải là thời điểm chạy.">
  <defs>
    <marker id="b2-big-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="10" y="20" width="300" height="24" rx="6" fill="#EFF6FF"/>
    <text x="160" y="37" fill="#1D4ED8">Lúc biên dịch (compile time)</text>
    <rect x="390" y="20" width="340" height="24" rx="6" fill="#ECFDF5"/>
    <text x="560" y="37" fill="#047857">Lúc chạy (runtime)</text>
    <rect x="10" y="70" width="120" height="60" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="70" y="94" fill="#0F172A" font-family="monospace">Greeting.java</text>
    <text x="70" y="114" fill="#64748B" font-size="11">mã nguồn</text>
    <rect x="165" y="70" width="90" height="60" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="210" y="94" fill="#1D4ED8" font-family="monospace">javac</text>
    <text x="210" y="114" fill="#64748B" font-size="11">trình biên dịch</text>
    <rect x="290" y="70" width="130" height="60" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="355" y="94" fill="#0F172A" font-family="monospace">Greeting.class</text>
    <text x="355" y="114" fill="#64748B" font-size="11">bytecode</text>
    <rect x="455" y="70" width="120" height="60" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="515" y="94" fill="#047857">JVM</text>
    <text x="515" y="114" fill="#64748B" font-size="11">lệnh java</text>
    <rect x="610" y="70" width="120" height="60" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="670" y="94" fill="#0F172A">Mã máy</text>
    <text x="670" y="114" fill="#64748B" font-size="11">CPU thật chạy</text>
    <line x1="130" y1="100" x2="161" y2="100" stroke="#64748B" marker-end="url(#b2-big-arrow)"/>
    <line x1="255" y1="100" x2="286" y2="100" stroke="#64748B" marker-end="url(#b2-big-arrow)"/>
    <line x1="420" y1="100" x2="451" y2="100" stroke="#64748B" marker-end="url(#b2-big-arrow)"/>
    <line x1="575" y1="100" x2="606" y2="100" stroke="#64748B" marker-end="url(#b2-big-arrow)"/>
    <text x="70" y="160" fill="#64748B" font-size="11">người đọc được</text>
    <text x="210" y="160" fill="#64748B" font-size="11">chạy 1 lần</text>
    <text x="355" y="160" fill="#64748B" font-size="11">mọi JVM đều hiểu</text>
    <text x="515" y="160" fill="#64748B" font-size="11">nạp, kiểm tra, chạy</text>
    <text x="670" y="160" fill="#64748B" font-size="11">riêng cho từng CPU</text>
    <text x="370" y="190" fill="#0F172A">hợp đồng mẫu → bản "phiên âm chung" → phiên dịch viên tại chỗ → tiếng địa phương</text>
  </g>
</svg>

**Ví dụ code.** Lưu file sau thành `src/Greeting.java`:

```java
public class Greeting {
    public static void main(String[] args) {
        // In lời chào ra màn hình (console)
        System.out.println("Chào mừng bạn đến với Onward Digital Banking!");
        // In thông tin phiên bản Java đang chạy chương trình
        System.out.println("Java version: " + System.getProperty("java.version"));
    }
}
```

Rồi chạy hai lệnh, mỗi lệnh ứng với một nửa của sơ đồ:

```bash
javac -d out src/Greeting.java   # nửa trái: biên dịch, tạo out/Greeting.class
java -cp out Greeting            # nửa phải: JVM chạy bytecode
```

**Kết quả khi chạy:**

```text
Chào mừng bạn đến với Onward Digital Banking!
Java version: 21.0.9
```

**Giải thích từng bước.**

1. `javac` đọc `src/Greeting.java`, kiểm tra cú pháp và kiểu dữ liệu. Không có lỗi thì nó ghi ra
   `out/Greeting.class`. Mỗi class trong mã nguồn thành một file `.class` riêng [6].
2. File `.class` không phải chữ. Nếu xem bằng công cụ đọc nhị phân, 4 byte đầu luôn là `CAFEBABE`.
   Đây là "con dấu" (*magic number*) nhận diện file class của Java [16].
3. `java -cp out Greeting` khởi động JVM, bảo nó tìm class tên `Greeting` trong thư mục `out`,
   rồi gọi hàm `main` [7].
4. JVM thực thi bytecode: chủ yếu **thông dịch** từng lệnh, và chỉ dịch phần code chạy nhiều ("code nóng")
   sang mã máy bằng JIT (mục 5 sẽ giải thích). Chương trình ngắn như `Greeting` gần như chỉ được thông
   dịch. Hai dòng chữ được in ra, `main` kết thúc, JVM tắt.

💡 Điểm mấu chốt: **biên dịch một lần, chạy bao nhiêu lần cũng được**. Lần chạy sau không cần `javac` nữa.

**⚠️ Lỗi hay gặp**

- **Thêm đuôi `.class` khi chạy.** Lệnh `java` nhận **tên class**, không nhận tên file:

  ```text
  $ java -cp out Greeting.class
  Error: Could not find or load main class Greeting.class
  Caused by: java.lang.ClassNotFoundException: Greeting.class
  ```

  Sửa: `java -cp out Greeting`.
- **Quên `.java` khi biên dịch.** Ngược lại, `javac` nhận **tên file**:

  ```text
  $ javac Greeting
  error: Class names, 'Greeting', are only accepted if annotation processing is explicitly requested
  1 error
  ```

  Sửa: `javac Greeting.java`. Mẹo nhớ: `javac` ăn **file**, `java` ăn **class**.

---

## 2. JDK, JRE và JVM: hộp lồng trong hộp

**Ý tưởng nôm na.** Hãy nghĩ tới một chi nhánh ngân hàng:

- **JVM** là **giao dịch viên**: người thực sự xử lý từng lệnh.
- **JRE** (*Java Runtime Environment*, môi trường chạy Java) là **quầy giao dịch hoàn chỉnh**:
  giao dịch viên cộng sổ tay quy trình, tức **thư viện chuẩn** (*standard library*) như `String`,
  `System`. Đủ để **chạy** chương trình.
- **JDK** (*Java Development Kit*, bộ công cụ phát triển Java) là **cả chi nhánh**: quầy giao dịch
  cộng phòng soạn thảo có `javac`, `javap`, `jshell`, `jlink`… Đủ để **viết và chạy**.

<svg viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ba hộp lồng nhau. Hộp ngoài cùng là JDK, chứa các công cụ phát triển javac, javap, jshell, jlink, jar. Bên trong JDK là JRE, gồm thư viện chuẩn như java.lang, java.util, java.io. Bên trong JRE là JVM, gồm class loader, execution engine và garbage collector. Ghi chú: từ Java 11, Oracle không còn phát hành JRE riêng, bạn cài JDK hoặc tự tạo runtime gọn bằng jlink.">
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="680" height="200" rx="12" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="30" y="36" fill="#1D4ED8" font-size="14" font-weight="bold">JDK: để viết và chạy</text>
    <text x="30" y="60" fill="#0F172A">Công cụ phát triển:</text>
    <text x="30" y="80" fill="#0F172A" font-family="monospace">javac  javap</text>
    <text x="30" y="100" fill="#0F172A" font-family="monospace">jshell jlink</text>
    <text x="30" y="120" fill="#0F172A" font-family="monospace">jar    jdb ...</text>
    <rect x="200" y="30" width="470" height="165" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="220" y="56" fill="#047857" font-size="14" font-weight="bold">JRE: đủ để chạy</text>
    <text x="220" y="80" fill="#0F172A">Thư viện chuẩn:</text>
    <text x="220" y="100" fill="#0F172A" font-family="monospace">java.lang</text>
    <text x="220" y="120" fill="#0F172A" font-family="monospace">java.util</text>
    <text x="220" y="140" fill="#0F172A" font-family="monospace">java.io ...</text>
    <rect x="370" y="50" width="285" height="130" rx="8" fill="#FFFFFF" stroke="#047857"/>
    <text x="390" y="76" fill="#0F172A" font-size="14" font-weight="bold">JVM: chạy bytecode</text>
    <text x="390" y="100" fill="#0F172A">• Class loader (nạp class)</text>
    <text x="390" y="122" fill="#0F172A">• Execution engine (thực thi)</text>
    <text x="390" y="144" fill="#0F172A">• Garbage collector (dọn bộ nhớ)</text>
    <text x="390" y="166" fill="#64748B" font-size="11">mỗi hệ điều hành có bản JVM riêng</text>
    <text x="10" y="235" fill="#D97706">Từ Java 11: Oracle không còn phát hành JRE riêng. Cài JDK, hoặc tạo runtime gọn bằng jlink.</text>
  </g>
</svg>

**Ví dụ lệnh.** Kiểm tra máy bạn đã có JDK chưa:

```bash
javac -version
java -version
```

**Kết quả khi chạy** (trên máy tác giả, JDK 21 cài qua Homebrew):

```text
javac 21.0.9
openjdk version "21.0.9" 2025-10-21
OpenJDK Runtime Environment Homebrew (build 21.0.9)
OpenJDK 64-Bit Server VM Homebrew (build 21.0.9, mixed mode, sharing)
```

Muốn tận mắt thấy "JRE chỉ để chạy", hãy dùng `jlink` tạo một runtime chỉ chứa module cơ bản
`java.base`, rồi chạy lại `Greeting` bằng runtime đó. Một **module** (*module*) là một gói thư viện có
tên. `java.base` là module lõi, chứa `java.lang`, `java.util`, `java.io`… (chặng sau sẽ học kỹ module):

```bash
jlink --add-modules java.base --output myjre   # tạo runtime gọn
ls myjre/bin                                    # trong đó có gì?
myjre/bin/java -cp out Greeting                 # chạy được không?
```

**Kết quả khi chạy:**

```text
java
keytool
Chào mừng bạn đến với Onward Digital Banking!
Java version: 21.0.9
```

**Giải thích từng bước.**

1. `javac -version` in ra được nghĩa là máy có **JDK**: chỉ JDK mới có `javac`.
2. Dòng cuối của `java -version` cho biết JVM đang dùng: "OpenJDK 64-Bit Server VM", tức JVM
   **HotSpot** (JVM phổ biến nhất, có trong mọi bản OpenJDK), chạy ở
   **mixed mode** (vừa thông dịch vừa JIT, mục 5 sẽ giải thích).
3. `jlink` gom JVM và module `java.base` thành thư mục `myjre`. Thư mục `bin` của nó chỉ có `java` và
   `keytool`, không có `javac`. Nó **chạy** được `Greeting.class` nhưng **không biên dịch** được. Đó đúng là vai trò của
   một JRE. Trên máy tác giả, `myjre` nặng khoảng 46 MB, còn cả JDK khoảng 331 MB.
4. Vì sao không tải JRE riêng cho nhanh? Từ JDK 11, Oracle bỏ bản JRE riêng [12]. Cách làm hiện đại
   là: dev cài JDK, còn khi đóng gói ứng dụng thì dùng `jlink` tạo runtime vừa đủ. Một số nhà phân phối
   (như Eclipse Temurin) vẫn đóng gói sẵn bản "JRE" cho tiện, nhưng người học cứ **cài JDK** là đủ.

**⚠️ Lỗi hay gặp**

- **Có `java` nhưng không có `javac`.** Máy cũ có thể chỉ cài JRE (thường là Java 8), nên gõ
  `javac` sẽ báo `command not found`. Sửa: cài JDK (bản 21 hoặc 25) và kiểm tra lại cả hai lệnh.
- **`java -version` và `javac -version` khác phiên bản.** Máy có nhiều JDK, biến `PATH` trỏ lộn.
  Hậu quả hay gặp là lỗi `UnsupportedClassVersionError` (xem mục 6). Sửa: đặt `JAVA_HOME` và `PATH`
  cùng trỏ vào một JDK.

---

## 3. Biên dịch với `javac`: lỗi lúc biên dịch và lỗi lúc chạy

**Ý tưởng nôm na.** `javac` giống **nhân viên soát hồ sơ tại quầy**: hồ sơ điền sai ô (chữ vào ô số
tiền) bị trả lại ngay, chưa được xử lý. Đó là **lỗi biên dịch** (*compile-time error*). Nhưng có hồ sơ
điền đúng mẫu mà xử lý mới lộ vấn đề, như chia hoá đơn cho 0 người. Đó là **lỗi lúc chạy**
(*runtime error*), JVM mới phát hiện.

<svg viewBox="0 0 740 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hai con đường. Trên: Balance.java gán chuỗi vào biến long, javac kiểm tra và báo lỗi incompatible types, không tạo file .class, chương trình chưa bao giờ chạy. Dưới: SplitBill.java đúng cú pháp, javac tạo SplitBill.class, JVM chạy, in dòng đầu tiên rồi gặp phép chia cho 0 và ném ArithmeticException, exit code 1.">
  <defs>
    <marker id="b2-err-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <text x="20" y="22" fill="#0F172A" text-anchor="start" font-weight="bold">Lỗi biên dịch: dừng ở javac</text>
    <rect x="10" y="35" width="140" height="50" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="80" y="57" fill="#0F172A" font-family="monospace">Balance.java</text>
    <text x="80" y="74" fill="#64748B" font-size="11">long = "500000"</text>
    <rect x="190" y="35" width="90" height="50" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="235" y="64" fill="#1D4ED8" font-family="monospace">javac</text>
    <rect x="320" y="35" width="410" height="50" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="525" y="57" fill="#DC2626">error: incompatible types</text>
    <text x="525" y="74" fill="#64748B" font-size="11">không có file .class, chương trình chưa hề chạy</text>
    <line x1="150" y1="60" x2="186" y2="60" stroke="#64748B" marker-end="url(#b2-err-arrow)"/>
    <line x1="280" y1="60" x2="316" y2="60" stroke="#64748B" marker-end="url(#b2-err-arrow)"/>
    <text x="20" y="127" fill="#0F172A" text-anchor="start" font-weight="bold">Lỗi lúc chạy: qua javac, vấp trong JVM</text>
    <rect x="10" y="140" width="140" height="50" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="80" y="162" fill="#0F172A" font-family="monospace">SplitBill.java</text>
    <text x="80" y="179" fill="#64748B" font-size="11">bill / people</text>
    <rect x="190" y="140" width="90" height="50" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="235" y="169" fill="#1D4ED8" font-family="monospace">javac</text>
    <rect x="320" y="140" width="130" height="50" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="385" y="162" fill="#0F172A" font-family="monospace">.class</text>
    <text x="385" y="179" fill="#64748B" font-size="11">biên dịch OK</text>
    <rect x="490" y="140" width="240" height="50" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="610" y="162" fill="#DC2626">JVM: ArithmeticException</text>
    <text x="610" y="179" fill="#64748B" font-size="11">đã in vài dòng rồi mới dừng</text>
    <line x1="150" y1="165" x2="186" y2="165" stroke="#64748B" marker-end="url(#b2-err-arrow)"/>
    <line x1="280" y1="165" x2="316" y2="165" stroke="#64748B" marker-end="url(#b2-err-arrow)"/>
    <line x1="450" y1="165" x2="486" y2="165" stroke="#64748B" marker-end="url(#b2-err-arrow)"/>
    <text x="370" y="220" fill="#047857">Lỗi bị bắt càng sớm (ở javac) càng rẻ: chưa có giao dịch nào chạy dở.</text>
  </g>
</svg>

**Ví dụ code: lỗi biên dịch.** File `ce/Balance.java`:

```java
public class Balance {
    public static void main(String[] args) {
        // Số dư tài khoản, tính bằng đồng (VND)
        long balance = "500000";
        System.out.println("Số dư: " + balance);
    }
}
```

**Kết quả khi biên dịch** (`javac -d ce/out ce/Balance.java`):

```text
ce/Balance.java:4: error: incompatible types: String cannot be converted to long
        long balance = "500000";
                       ^
1 error
```

Thư mục `ce/out` **không được tạo**: lỗi biên dịch thì không có bytecode, không có gì để chạy.
(`long` là kiểu số nguyên, `"500000"` có dấu nháy là chuỗi chữ. Bài 3 sẽ học kỹ các kiểu dữ liệu.)

**Ví dụ code: lỗi lúc chạy.** File `rt/SplitBill.java`:

```java
public class SplitBill {
    public static void main(String[] args) {
        long bill = 900000;   // Tổng hoá đơn (đồng)
        int people = 0;       // Số người chia tiền: lỡ nhập 0
        System.out.println("Bắt đầu chia hoá đơn...");
        // Chia cho 0: javac không phát hiện, JVM báo lỗi lúc chạy
        long each = bill / people;
        System.out.println("Mỗi người trả: " + each);
    }
}
```

```bash
javac -d rt/out rt/SplitBill.java   # không báo gì: biên dịch thành công
java -cp rt/out SplitBill
```

**Kết quả khi chạy:**

```text
Bắt đầu chia hoá đơn...
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at SplitBill.main(SplitBill.java:7)
```

**Giải thích từng bước.**

1. Với `Balance`, `javac` thấy bạn nhét chuỗi vào biến số. Nó chỉ ra **file, dòng 4**, và dấu `^`
   đánh dấu đúng chỗ sai. Không file `.class` nào được tạo.
2. Với `SplitBill`, mọi thứ đúng luật, nên `javac` im lặng tạo `SplitBill.class`. `javac` không
   "chạy thử" chương trình, nên không biết `people` đang bằng 0.
3. Khi chạy, JVM in dòng đầu tiên, rồi tới dòng 7 thì gặp phép chia số nguyên cho 0. JVM ném
   **ngoại lệ** (*exception*) `ArithmeticException`. Không ai xử lý nó, nên chương trình dừng và in ra
   **stack trace** (dấu vết lời gọi hàm): dòng `at SplitBill.main(SplitBill.java:7)` cho bạn biết lỗi
   nằm ở đâu. Dòng "Mỗi người trả" không bao giờ được in.

**Chạy thẳng file nguồn (source-file mode).** Từ Java 11, bạn có thể bỏ qua bước `javac` cho chương
trình nhỏ [9]:

```bash
java src/Greeting.java
```

**Kết quả khi chạy:**

```text
Chào mừng bạn đến với Onward Digital Banking!
Java version: 21.0.9
```

Lệnh này vẫn biên dịch, nhưng biên dịch **trong bộ nhớ** rồi chạy luôn: không có file `.class` nào được
ghi ra đĩa. Nếu code có lỗi biên dịch, bạn vẫn thấy lỗi như thường, kèm dòng cuối
`error: compilation failed`. Chế độ này tiện để học và thử nhanh. Dự án thật vẫn biên dịch ra `.class`
(sau này qua Maven/Gradle).

**⚠️ Lỗi hay gặp**

- **Tên file khác tên `public class`.** Một `public class` phải nằm trong file trùng tên:

  ```text
  $ javac -d nm/out nm/Bank.java
  nm/Bank.java:1: error: class BankApp is public, should be declared in a file named BankApp.java
  public class BankApp {
         ^
  1 error
  ```

  Sửa: đổi tên file thành `BankApp.java` (hoặc đổi tên class thành `Bank`).
- **Chạy sai thư mục, quên `-cp`.** Bạn đứng trong `src/` (nơi chỉ có `.java`) rồi gõ `java Greeting`:

  ```text
  Error: Could not find or load main class Greeting
  Caused by: java.lang.ClassNotFoundException: Greeting
  ```

  JVM tìm `.class` theo **classpath** (danh sách thư mục chứa class, mặc định là thư mục hiện tại).
  Sửa: chỉ đúng chỗ bằng `java -cp out Greeting`.
- **Nghĩ rằng "biên dịch được là chạy đúng".** `SplitBill` cho thấy điều ngược lại. Biên dịch chỉ
  kiểm tra **luật ngôn ngữ**, không kiểm tra **logic nghiệp vụ**. Vẫn cần chạy thử và viết test.

---

## 4. Bytecode: nhìn tận mắt "ngôn ngữ chung"

**Ý tưởng nôm na.** Bytecode giống **phiếu lệnh** viết cho giao dịch viên: mỗi dòng là một việc rất nhỏ
("lấy số này đặt lên khay", "cộng hai số trên cùng của khay"). JVM là một **máy dùng ngăn xếp**
(*stack machine*): nó làm việc với một chồng khay gọi là **operand stack** (ngăn xếp toán hạng) [4].
Lệnh đặt giá trị lên khay, lệnh khác lấy xuống để tính.

<svg viewBox="0 0 740 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bốn bước của hàm total(100, 5) trên operand stack. Bước 1 iload_0: đặt 100 lên ngăn xếp. Bước 2 iload_1: đặt 5 lên trên, ngăn xếp có 100 và 5. Bước 3 iadd: lấy hai số xuống, cộng, đặt 105 lên. Bước 4 ireturn: lấy 105 xuống và trả về cho nơi gọi. Bên dưới là biến cục bộ: ô 0 amount bằng 100, ô 1 fee bằng 5.">
  <defs>
    <marker id="b2-bc-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <text x="370" y="20" fill="#0F172A">Hàm total(100, 5): operand stack sau từng lệnh</text>
    <rect x="20" y="35" width="150" height="26" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="95" y="53" fill="#1D4ED8" font-family="monospace">1. iload_0</text>
    <rect x="200" y="35" width="150" height="26" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="275" y="53" fill="#1D4ED8" font-family="monospace">2. iload_1</text>
    <rect x="380" y="35" width="150" height="26" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="455" y="53" fill="#1D4ED8" font-family="monospace">3. iadd</text>
    <rect x="560" y="35" width="150" height="26" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="635" y="53" fill="#1D4ED8" font-family="monospace">4. ireturn</text>
    <polyline points="55,80 55,150 135,150 135,80" fill="none" stroke="#94A3B8"/>
    <rect x="60" y="120" width="70" height="26" rx="4" fill="#ECFDF5" stroke="#10B981"/>
    <text x="95" y="138" fill="#047857">100</text>
    <polyline points="235,80 235,150 315,150 315,80" fill="none" stroke="#94A3B8"/>
    <rect x="240" y="120" width="70" height="26" rx="4" fill="#ECFDF5" stroke="#10B981"/>
    <text x="275" y="138" fill="#047857">100</text>
    <rect x="240" y="90" width="70" height="26" rx="4" fill="#ECFDF5" stroke="#10B981"/>
    <text x="275" y="108" fill="#047857">5</text>
    <polyline points="415,80 415,150 495,150 495,80" fill="none" stroke="#94A3B8"/>
    <rect x="420" y="120" width="70" height="26" rx="4" fill="#FFFBEB" stroke="#D97706"/>
    <text x="455" y="138" fill="#0F172A">105</text>
    <polyline points="595,80 595,150 675,150 675,80" fill="none" stroke="#94A3B8"/>
    <text x="635" y="115" fill="#64748B" font-size="11">(trống)</text>
    <text x="635" y="170" fill="#047857" font-size="11">trả 105 về main</text>
    <line x1="170" y1="48" x2="196" y2="48" stroke="#64748B" marker-end="url(#b2-bc-arrow)"/>
    <line x1="350" y1="48" x2="376" y2="48" stroke="#64748B" marker-end="url(#b2-bc-arrow)"/>
    <line x1="530" y1="48" x2="556" y2="48" stroke="#64748B" marker-end="url(#b2-bc-arrow)"/>
    <rect x="20" y="190" width="700" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="370" y="210" fill="#0F172A">Biến cục bộ (local variables):  ô 0 = amount = 100   ·   ô 1 = fee = 5</text>
  </g>
</svg>

**Ví dụ code.** File `bc/Fee.java`:

```java
public class Fee {
    // Cộng số tiền chuyển với phí giao dịch (đơn vị: đồng)
    static int total(int amount, int fee) {
        return amount + fee;
    }

    public static void main(String[] args) {
        int sum = total(100, 5);
        System.out.println(sum);
    }
}
```

Biên dịch, chạy thử, rồi dùng `javap -c` để **dịch ngược** (*disassemble*) bytecode ra dạng đọc được [8]:

```bash
javac -d bc/out bc/Fee.java
java -cp bc/out Fee
javap -c -cp bc/out Fee
```

**Kết quả khi chạy:**

```text
105
Compiled from "Fee.java"
public class Fee {
  public Fee();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  static int total(int, int);
    Code:
       0: iload_0
       1: iload_1
       2: iadd
       3: ireturn

  public static void main(java.lang.String[]);
    Code:
       0: bipush        100
       2: iconst_5
       3: invokestatic  #7                  // Method total:(II)I
       6: istore_1
       7: getstatic     #13                 // Field java/lang/System.out:Ljava/io/PrintStream;
      10: iload_1
      11: invokevirtual #19                 // Method java/io/PrintStream.println:(I)V
      14: return
}
```

**Giải thích từng bước.** Chữ `i` đầu lệnh nghĩa là làm việc với `int`. Số bên trái là vị trí (byte) của
lệnh trong hàm [10].

1. `public Fee()`: bạn không viết **hàm khởi tạo** (*constructor*) nào, nên `javac` tự thêm một cái mặc
   định. Nó chỉ gọi constructor của class cha `Object` (`invokespecial`). Bài OOP sẽ học kỹ.
2. Hàm `main` chạy trước:
   - `bipush 100`: đặt hằng số 100 lên stack. `iconst_5`: đặt 5 lên stack. Số nhỏ từ -1 tới 5 có lệnh
     riêng ngắn gọn (`iconst_<n>`). Các số khác trong khoảng -128 tới 127 dùng `bipush`.
   - `invokestatic #7`: gọi hàm `static` tên `total`. `(II)I` nghĩa là "nhận hai `int`, trả về `int`".
3. Bên trong `total` (xem sơ đồ): `iload_0` và `iload_1` đặt `amount` và `fee` lên stack, `iadd` lấy
   hai số xuống và đặt tổng 105 lên, `ireturn` trả 105 về cho `main`.
4. Quay lại `main`: `istore_1` cất 105 vào biến cục bộ ô 1 (biến `sum`; ô 0 là `args`).
   `getstatic` lấy đối tượng `System.out`, `iload_1` đặt `sum` lên stack, rồi `invokevirtual` gọi hàm
   `println` của đối tượng đó. `return` kết thúc `main`.

Bạn **không cần** học thuộc bytecode để viết Java. Chỉ cần nhớ: `.class` là một danh sách lệnh nhỏ, đơn
giản, không phụ thuộc CPU, và `javap` giúp bạn nhìn vào khi tò mò.

**⚠️ Lỗi hay gặp**

- **Đưa file `.java` cho `javap`.** `javap` đọc **class đã biên dịch**, không đọc mã nguồn:

  ```text
  $ javap -c Fee.java
  Error: class not found: Fee.java
  ```

  Sửa: biên dịch trước, rồi `javap -c -cp bc/out Fee`.
- **Quên `-c`.** Gõ `javap -cp bc/out Fee` chỉ in danh sách hàm, không in bytecode. Muốn xem lệnh,
  thêm `-c`. Muốn xem cả **constant pool** (bảng hằng số và tên class, tên hàm mà các chỗ như `#7` trỏ tới) và số
  phiên bản class, dùng `-v`.

---

## 5. Bên trong JVM khi chương trình chạy

**Ý tưởng nôm na.** JVM vận hành như một chi nhánh ngân hàng trong giờ làm việc:

- **Lễ tân** nhận hồ sơ khi cần: **Class Loader** (bộ nạp class) đọc file `.class`.
- **Kiểm soát viên** soát hồ sơ hợp lệ: **Bytecode Verifier** (bộ kiểm tra bytecode).
- **Giao dịch viên** làm từng lệnh: **Interpreter** (bộ thông dịch). Việc nào lặp đi lặp lại nhiều thì
  giao cho **chuyên viên quen tay** làm nhanh hơn: **JIT compiler**.
- **Kho và bàn làm việc**: các **vùng nhớ lúc chạy** (*runtime data areas*).
- **Nhân viên dọn dẹp** cất bỏ giấy tờ không ai cần nữa: **Garbage Collector**.

<svg viewBox="0 0 740 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kiến trúc JVM. Các file .class đi vào Class Loader Subsystem gồm ba giai đoạn: Loading (nạp), Linking (gồm Verify kiểm tra bytecode, Prepare, Resolve), Initialization (chạy khởi tạo static). Sau đó là Runtime Data Areas: Method area (thông tin class, chia sẻ), Heap (đối tượng, chia sẻ), và mỗi thread có JVM stack, PC register, native stack. Execution Engine gồm Interpreter, JIT compiler và Garbage Collector, cùng đọc và ghi các vùng nhớ, sinh ra mã máy cho CPU.">
  <defs>
    <marker id="b2-jvm-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="10" y="20" width="90" height="44" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="55" y="47" fill="#0F172A" font-family="monospace">*.class</text>
    <line x1="100" y1="42" x2="126" y2="42" stroke="#64748B" marker-end="url(#b2-jvm-arrow)"/>
    <rect x="130" y="10" width="600" height="96" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="430" y="28" fill="#1D4ED8" font-weight="bold">1. Class Loader Subsystem</text>
    <rect x="145" y="40" width="120" height="54" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="205" y="62" fill="#0F172A">Loading</text>
    <text x="205" y="80" fill="#64748B" font-size="11">đọc .class</text>
    <rect x="285" y="40" width="270" height="54" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="420" y="62" fill="#0F172A">Linking</text>
    <text x="420" y="80" fill="#DC2626" font-size="11">Verify (kiểm tra) · Prepare · Resolve</text>
    <rect x="575" y="40" width="140" height="54" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="645" y="62" fill="#0F172A">Initialization</text>
    <text x="645" y="80" fill="#64748B" font-size="11">khởi tạo static</text>
    <line x1="265" y1="67" x2="281" y2="67" stroke="#64748B" marker-end="url(#b2-jvm-arrow)"/>
    <line x1="555" y1="67" x2="571" y2="67" stroke="#64748B" marker-end="url(#b2-jvm-arrow)"/>
    <line x1="430" y1="106" x2="430" y2="122" stroke="#64748B" marker-end="url(#b2-jvm-arrow)"/>
    <rect x="130" y="126" width="600" height="96" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="430" y="144" fill="#047857" font-weight="bold">2. Runtime Data Areas (vùng nhớ lúc chạy)</text>
    <rect x="145" y="156" width="130" height="54" rx="6" fill="#FFFFFF" stroke="#10B981"/>
    <text x="210" y="178" fill="#0F172A">Method area</text>
    <text x="210" y="196" fill="#64748B" font-size="11">thông tin class</text>
    <rect x="290" y="156" width="110" height="54" rx="6" fill="#FFFFFF" stroke="#10B981"/>
    <text x="345" y="178" fill="#0F172A">Heap</text>
    <text x="345" y="196" fill="#64748B" font-size="11">các đối tượng</text>
    <rect x="415" y="156" width="300" height="54" rx="6" fill="#FFFFFF" stroke="#10B981" stroke-dasharray="4 3"/>
    <text x="565" y="178" fill="#0F172A">Mỗi thread: JVM stack · PC · native stack</text>
    <text x="565" y="196" fill="#64748B" font-size="11">biến cục bộ, lời gọi hàm đang chạy</text>
    <line x1="430" y1="222" x2="430" y2="238" stroke="#64748B" marker-end="url(#b2-jvm-arrow)"/>
    <rect x="130" y="242" width="600" height="80" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="430" y="260" fill="#0F172A" font-weight="bold">3. Execution Engine (bộ máy thực thi)</text>
    <rect x="145" y="270" width="170" height="40" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="230" y="295" fill="#0F172A">Interpreter (thông dịch)</text>
    <rect x="330" y="270" width="200" height="40" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="430" y="295" fill="#0F172A">JIT: code nóng → mã máy</text>
    <rect x="545" y="270" width="170" height="40" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="630" y="295" fill="#0F172A">Garbage Collector</text>
    <rect x="10" y="270" width="90" height="40" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="55" y="295" fill="#0F172A">CPU</text>
    <line x1="130" y1="290" x2="104" y2="290" stroke="#64748B" marker-end="url(#b2-jvm-arrow)"/>
  </g>
</svg>

**Đi qua từng khối** (theo đặc tả JVM, JVMS [4][5]):

1. **Class Loader Subsystem**: nạp class **khi cần lần đầu**, không nạp tất cả từ đầu. Mỗi class đi qua:
   - **Loading** (nạp): tìm file `.class` và đọc vào. Java có ba class loader dựng sẵn: *bootstrap*
     (nạp lõi như `java.lang.Object`), *platform*, và *application* (nạp class của bạn từ classpath) [11].
   - **Linking** (liên kết), gồm ba bước con. **Verification**: kiểm tra bytecode có đúng luật không, ví
     dụ không lấy `int` ra dùng như đối tượng, không nhảy ra ngoài hàm. Đây là lớp bảo vệ nếu file
     `.class` bị sửa tay hoặc do công cụ lỗi sinh ra. **Preparation**: cấp chỗ cho biến `static` và gán
     giá trị mặc định (0, `null`…). **Resolution**: đổi các tên tham chiếu (như `#7` ở mục 4) thành địa
     chỉ thật.
   - **Initialization** (khởi tạo): chạy code khởi tạo `static` của class.
2. **Runtime Data Areas**: JVMS định nghĩa **heap** (nơi chứa đối tượng, dùng chung giữa các thread),
   **method area** (thông tin class và code của hàm, cũng dùng chung), và mỗi **thread** (luồng chạy) có
   **JVM stack** riêng (mỗi lần gọi hàm thêm một **frame** chứa biến cục bộ và operand stack), **PC
   register** (đang chạy tới lệnh nào), và **native method stack** [4]. Bài 6 sẽ học kỹ stack và heap.
3. **Execution Engine**: bộ **thông dịch** chạy từng lệnh bytecode. HotSpot đếm xem hàm nào chạy nhiều
   ("code nóng") rồi để **JIT** biên dịch hàm đó sang mã máy, lần sau chạy thẳng mã máy, nhanh hơn
   nhiều. Kết hợp cả hai gọi là **mixed mode**. **Garbage Collector** định kỳ tìm các đối tượng trên heap
   không còn ai trỏ tới và thu hồi vùng nhớ đó. Với JDK hiện đại, GC mặc định thường là **G1** [13].

**Ví dụ code: quan sát class được nạp lúc nào.** File `cl/LoadDemo.java`:

```java
public class LoadDemo {
    public static void main(String[] args) {
        System.out.println("main bắt đầu");
        // Lần đầu dùng tới class Account: JVM mới nạp nó
        Account acc = new Account();
        System.out.println("Số dư ban đầu: " + acc.balance);
    }
}

class Account {
    long balance = 0; // số dư (đồng)
}
```

Bật nhật ký nạp class bằng `-Xlog:class+load` (cách viết cũ `-verbose:class` vẫn dùng được) [7]. Nhật ký
có hơn 500 dòng, nên lọc lấy những dòng ta quan tâm:

```bash
javac -d cl/out cl/LoadDemo.java     # tạo ra LoadDemo.class và Account.class
java -Xlog:class+load -cp cl/out LoadDemo | grep -E "java.lang.Object |LoadDemo|Account|main bắt|Số dư"
```

**Kết quả khi chạy** (đường dẫn thư mục đã rút gọn thành `.../cl/out/`):

```text
[0.007s][info][class,load] java.lang.Object source: shared objects file
[0.015s][info][class,load] LoadDemo source: file:.../cl/out/
main bắt đầu
[0.016s][info][class,load] Account source: file:.../cl/out/
Số dư ban đầu: 0
```

Muốn xem JVM đang dùng chế độ nào, so sánh hai lệnh sau (chỉ trích dòng cuối):

```text
$ java -version
OpenJDK 64-Bit Server VM Homebrew (build 21.0.9, mixed mode, sharing)
$ java -Xint -version
OpenJDK 64-Bit Server VM Homebrew (build 21.0.9, interpreted mode, sharing)
```

**Giải thích từng bước.**

1. Rất nhiều class lõi như `java.lang.Object` được nạp trước cả code của bạn. Chữ `shared objects file`
   nghĩa là chúng được lấy từ một bản lưu sẵn (Class Data Sharing) để khởi động nhanh hơn.
2. `LoadDemo` được nạp từ thư mục `cl/out/`, rồi `main` chạy và in "main bắt đầu".
3. Chỉ khi chạy tới `new Account()`, JVM mới nạp `Account`. Dòng nạp nằm **sau** "main bắt đầu":
   bằng chứng class được nạp **lười** (*lazy*), đúng lúc cần.
4. `-Xint` tắt JIT, ép JVM chỉ thông dịch. Dòng "interpreted mode" xác nhận điều đó. Đừng dùng `-Xint`
   khi chạy thật: chương trình sẽ chậm đi nhiều.

**⚠️ Lỗi hay gặp**

- **Nghĩ rằng Java "chỉ là thông dịch nên chậm".** HotSpot dùng JIT, code nóng chạy bằng mã máy đã tối
  ưu. Chương trình Java thường chạy chậm ở vài giây đầu (đang "khởi động") rồi nhanh dần.
- **Nhầm "verify" với "kiểm tra logic".** Bytecode verifier chỉ đảm bảo bytecode **an toàn về kiểu và
  cấu trúc**. Nó không phát hiện chia cho 0 hay tính sai lãi suất.
- **Nghĩ rằng có GC thì không bao giờ hết bộ nhớ.** GC chỉ thu hồi đối tượng **không còn ai dùng**. Nếu
  code vẫn giữ tham chiếu (ví dụ cứ thêm vào một danh sách mà không xoá), heap vẫn đầy và bạn sẽ gặp
  `OutOfMemoryError`.

---

## 6. "Write once, run anywhere": một file `.class`, nhiều hệ điều hành

**Ý tưởng nôm na.** Onward chỉ soạn **một** bản hợp đồng phiên âm chung. Chi nhánh Hà Nội, Singapore hay
Tokyo đều có phiên dịch viên riêng đọc được nó. Với Java: bạn chỉ build **một** file `.class`. Mỗi hệ điều
hành và CPU có **bản JVM riêng**, và JVM đó lo phần dịch ra mã máy phù hợp. Khẩu hiệu của Java là
**"Write once, run anywhere"** (viết một lần, chạy mọi nơi) [3].

<svg viewBox="0 0 740 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Một file Hello.class duy nhất ở giữa bên trái, mũi tên tỏa ra ba JVM: JVM cho Windows trên x64, JVM cho macOS trên ARM, JVM cho Linux trên x64. Mỗi JVM sinh ra mã máy riêng cho CPU của nó. Chỉ JVM phụ thuộc nền tảng, file class thì không.">
  <defs>
    <marker id="b2-wora-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="20" y="90" width="150" height="60" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="95" y="115" fill="#0F172A" font-family="monospace">Hello.class</text>
    <text x="95" y="134" fill="#64748B" font-size="11">build 1 lần</text>
    <rect x="280" y="20" width="200" height="50" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="380" y="42" fill="#047857">JVM cho Windows</text>
    <text x="380" y="59" fill="#64748B" font-size="11">x64</text>
    <rect x="280" y="95" width="200" height="50" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="380" y="117" fill="#047857">JVM cho macOS</text>
    <text x="380" y="134" fill="#64748B" font-size="11">ARM (Apple Silicon)</text>
    <rect x="280" y="170" width="200" height="50" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="380" y="192" fill="#047857">JVM cho Linux</text>
    <text x="380" y="209" fill="#64748B" font-size="11">x64 (server, container)</text>
    <rect x="560" y="20" width="160" height="50" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="640" y="49" fill="#0F172A">Mã máy x64</text>
    <rect x="560" y="95" width="160" height="50" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="640" y="124" fill="#0F172A">Mã máy ARM</text>
    <rect x="560" y="170" width="160" height="50" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="640" y="199" fill="#0F172A">Mã máy x64</text>
    <line x1="170" y1="110" x2="276" y2="48" stroke="#64748B" marker-end="url(#b2-wora-arrow)"/>
    <line x1="170" y1="120" x2="276" y2="120" stroke="#64748B" marker-end="url(#b2-wora-arrow)"/>
    <line x1="170" y1="130" x2="276" y2="192" stroke="#64748B" marker-end="url(#b2-wora-arrow)"/>
    <line x1="480" y1="45" x2="556" y2="45" stroke="#64748B" marker-end="url(#b2-wora-arrow)"/>
    <line x1="480" y1="120" x2="556" y2="120" stroke="#64748B" marker-end="url(#b2-wora-arrow)"/>
    <line x1="480" y1="195" x2="556" y2="195" stroke="#64748B" marker-end="url(#b2-wora-arrow)"/>
    <text x="95" y="180" fill="#047857" font-size="11">không phụ thuộc nền tảng</text>
    <text x="380" y="236" fill="#D97706" font-size="11">phụ thuộc nền tảng: cài đúng bản cho máy</text>
  </g>
</svg>

**Ví dụ code.** File `wora/Hello.java`:

```java
public class Hello {
    public static void main(String[] args) {
        // In ra hệ điều hành và kiến trúc CPU mà JVM đang chạy trên đó
        System.out.println("OS  : " + System.getProperty("os.name"));
        System.out.println("CPU : " + System.getProperty("os.arch"));
        System.out.println("Java: " + System.getProperty("java.version"));
    }
}
```

Biên dịch **một lần** (với `--release 17` để JVM từ 17 trở lên đều chạy được), rồi chạy **cùng file
`.class`** đó trên hai JVM khác nhau đang cài trên máy:

```bash
javac --release 17 -d wora/out wora/Hello.java
java -cp wora/out Hello                         # JVM 21
/path/to/jdk-17/bin/java -cp wora/out Hello      # JVM 17
```

**Kết quả khi chạy** (máy macOS, chip Apple Silicon):

```text
OS  : Mac OS X
CPU : aarch64
Java: 21.0.9
OS  : Mac OS X
CPU : aarch64
Java: 17.0.15
```

**Giải thích từng bước.**

1. `javac --release 17` sinh bytecode theo chuẩn Java 17 và chỉ cho dùng **API** (*Application Programming Interface*: các class và hàm có
   sẵn trong thư viện chuẩn, như `System.getProperty`) có trong Java 17 [6].
2. Cùng một file `Hello.class` (không biên dịch lại) chạy được trên cả JVM 17 lẫn JVM 21.
3. Nếu bạn copy đúng file đó sang laptop Windows hay một server Linux có JVM 17+, nó cũng chạy, chỉ khác
   dòng `OS` và `CPU`. (Output trên đây chỉ là của máy macOS của tác giả.) Đây là lý do một ứng dụng Spring
   Boot build trên laptop có thể deploy thẳng lên server Linux của ngân hàng.
4. "Chạy mọi nơi" có một điều kiện: nơi đó phải có **JVM đủ mới**. File class mang số phiên bản: Java 17
   là 61, Java 21 là 65 (xem bằng `javap -v`, dòng `major version`).

**⚠️ Lỗi hay gặp**

- **Biên dịch bằng JDK mới, chạy bằng JVM cũ.** Đây là lỗi thật khi chạy `Greeting.class` (biên dịch
  bằng JDK 21, không có `--release`) trên JVM 17:

  ```text
  Error: LinkageError occurred while loading main class Greeting
  	java.lang.UnsupportedClassVersionError: Greeting has been compiled by a more recent version of the Java Runtime (class file version 65.0), this version of the Java Runtime only recognizes class file versions up to 61.0
  ```

  Sửa: nâng JVM ở nơi chạy, hoặc biên dịch với `--release <phiên bản thấp nhất cần hỗ trợ>`.
- **Nghĩ rằng "chạy mọi nơi" nghĩa là không cần cài gì.** Máy đích vẫn cần JVM (hoặc runtime tạo bằng
  `jlink` đóng gói kèm ứng dụng). Bản thân JVM thì phải đúng hệ điều hành và CPU.

---

## 7. Chương trình kết thúc khi nào?

**Ý tưởng nôm na.** Một ca làm việc ở chi nhánh kết thúc theo ba cách: **làm xong hết việc** rồi đóng cửa;
**quản lý ra lệnh đóng cửa ngay**; hoặc **có sự cố** không ai xử lý được nên phải dừng. Cuối ca, chi nhánh
gửi về hội sở một **mã báo cáo** (*exit code*): `0` là bình thường, khác `0` là có chuyện.

<svg viewBox="0 0 740 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Từ main bắt đầu chạy có ba lối ra. Lối 1: main chạy hết (và không còn thread thường nào khác), JVM tắt, exit code 0. Lối 2: gọi System.exit(n), JVM dừng ngay, exit code n, ví dụ 3. Lối 3: exception không ai bắt, JVM in stack trace, exit code 1.">
  <defs>
    <marker id="b2-exit-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="10" y="90" width="130" height="50" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="75" y="112" fill="#1D4ED8">main bắt đầu</text>
    <text x="75" y="129" fill="#64748B" font-size="11">JVM đang chạy</text>
    <rect x="210" y="15" width="290" height="50" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="355" y="37" fill="#047857">main chạy hết</text>
    <text x="355" y="54" fill="#64748B" font-size="11">và không còn thread thường nào chạy</text>
    <rect x="210" y="90" width="290" height="50" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="355" y="112" fill="#0F172A" font-family="monospace">System.exit(n)</text>
    <text x="355" y="129" fill="#64748B" font-size="11">dừng JVM ngay, code phía sau không chạy</text>
    <rect x="210" y="165" width="290" height="50" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="355" y="187" fill="#DC2626">Exception không ai bắt</text>
    <text x="355" y="204" fill="#64748B" font-size="11">in stack trace rồi dừng</text>
    <rect x="570" y="15" width="150" height="50" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="645" y="45" fill="#047857" font-family="monospace">exit code 0</text>
    <rect x="570" y="90" width="150" height="50" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="645" y="120" fill="#D97706" font-family="monospace">exit code n</text>
    <rect x="570" y="165" width="150" height="50" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="645" y="195" fill="#DC2626" font-family="monospace">exit code 1</text>
    <line x1="140" y1="105" x2="206" y2="42" stroke="#64748B" marker-end="url(#b2-exit-arrow)"/>
    <line x1="140" y1="115" x2="206" y2="115" stroke="#64748B" marker-end="url(#b2-exit-arrow)"/>
    <line x1="140" y1="125" x2="206" y2="188" stroke="#64748B" marker-end="url(#b2-exit-arrow)"/>
    <line x1="500" y1="40" x2="566" y2="40" stroke="#64748B" marker-end="url(#b2-exit-arrow)"/>
    <line x1="500" y1="115" x2="566" y2="115" stroke="#64748B" marker-end="url(#b2-exit-arrow)"/>
    <line x1="500" y1="190" x2="566" y2="190" stroke="#64748B" marker-end="url(#b2-exit-arrow)"/>
  </g>
</svg>

**Ví dụ code.** File `ex/ExitDemo.java` đi được cả ba lối, tuỳ tham số bạn truyền vào:

```java
public class ExitDemo {
    public static void main(String[] args) {
        // Đọc "chế độ" từ tham số dòng lệnh; không có thì dùng "ok"
        String mode = args.length > 0 ? args[0] : "ok";
        System.out.println("Chế độ: " + mode);

        if (mode.equals("exit")) {
            System.out.println("Gọi System.exit(3)");
            System.exit(3);           // Dừng JVM ngay, exit code = 3
        }
        if (mode.equals("crash")) {
            // Ném lỗi mà không ai bắt: JVM in stack trace, exit code = 1
            throw new IllegalStateException("Mất kết nối core banking");
        }
        System.out.println("main chạy hết, chương trình kết thúc bình thường");
    }
}
```

Chạy ba lần. Sau mỗi lần, `echo $?` in ra exit code của lệnh **vừa chạy xong** (trên macOS/Linux):

```bash
cd ex && javac -d out ExitDemo.java
java -cp out ExitDemo;        echo $?
java -cp out ExitDemo exit;   echo $?
java -cp out ExitDemo crash;  echo $?
```

**Kết quả khi chạy:**

```text
Chế độ: ok
main chạy hết, chương trình kết thúc bình thường
0
Chế độ: exit
Gọi System.exit(3)
3
Chế độ: crash
Exception in thread "main" java.lang.IllegalStateException: Mất kết nối core banking
	at ExitDemo.main(ExitDemo.java:13)
1
```

**Giải thích từng bước.**

1. `args` là mảng tham số dòng lệnh (bài 5 sẽ học kỹ mảng). `args.length > 0 ? args[0] : "ok"` nghĩa là
   "có tham số thì lấy tham số đầu, không thì dùng `ok`".
2. **Không tham số**: `main` chạy tới dấu `}` cuối. Chương trình chỉ có một **thread** (luồng chạy) là
   `main`, nên khi nó xong thì JVM tắt, exit code `0`. Chính xác hơn: JVM tắt khi **mọi thread không
   phải daemon** đã kết thúc [14]. Thread **daemon** là thread phụ chạy nền, JVM không chờ nó xong. Bài về concurrency ở chặng 4 sẽ học kỹ thread.
3. **`exit`**: `System.exit(3)` dừng JVM ngay lập tức với exit code 3. Dòng "main chạy hết…" không được
   in. (Chính xác hơn: trước khi tắt, JVM vẫn chạy các *shutdown hook* đã đăng ký [14]; bài sau mới cần tới.) Quy ước: `0` là thành công, khác `0` là lỗi. Bạn tự chọn số để phân biệt loại lỗi.
4. **`crash`**: exception không được bắt, JVM in stack trace ra **stderr** (luồng báo lỗi) và lệnh `java`
   trả về exit code `1`.

Exit code quan trọng hơn bạn nghĩ: script deploy, CI/CD và các job batch cuối ngày của ngân hàng đều nhìn
vào nó để biết bước trước thành công hay thất bại.

**⚠️ Lỗi hay gặp**

- **Đọc `$?` sau một lệnh khác.** `$?` là exit code của lệnh **gần nhất**. Nếu bạn nối qua pipe, bạn nhận
  exit code của lệnh cuối trong pipe:

  ```text
  $ java -cp out ExitDemo crash 2>/dev/null | cat; echo $?
  Chế độ: crash
  0
  ```

  `0` ở đây là của `cat`, không phải của `java`. Sửa: chạy `java` riêng rồi `echo $?` ngay sau.
- **Dùng số âm hoặc số lớn.** Trên macOS/Linux, exit code chỉ giữ 8 bit (0–255). `System.exit(-1)` sẽ
  hiện ra là `255`. Hãy dùng số từ 1 tới 125 cho dễ hiểu.
- **Dùng `echo $?` trên Windows.** Trong PowerShell hãy dùng `$LASTEXITCODE`, trong cmd dùng
  `echo %ERRORLEVEL%`.

---

## Tóm tắt

- Vòng đời Java: viết `.java` → `javac` biên dịch thành bytecode `.class` → `java` khởi động JVM →
  JVM biến bytecode thành mã máy.
- JDK ⊃ JRE ⊃ JVM. Dev cần **JDK**. Từ Java 11 không còn JRE riêng từ Oracle; dùng `jlink` nếu cần
  runtime gọn.
- `javac -d out` để biên dịch, `java -cp out TenClass` để chạy. `javac` nhận **file**, `java` nhận
  **class**. `java File.java` biên dịch trong bộ nhớ, chạy ngay.
- **Lỗi biên dịch** chặn từ `javac`, không có `.class`. **Lỗi lúc chạy** chỉ lộ ra khi JVM thực thi.
- Bytecode là các lệnh nhỏ trên operand stack (`iload`, `iadd`, `invokevirtual`…). Xem bằng `javap -c`.
- Bên trong JVM: Class Loader (loading → linking có verify → initialization), vùng nhớ (heap, method area,
  stack từng thread), Execution Engine (interpreter + JIT) và Garbage Collector.
- Cùng một `.class` chạy trên mọi hệ điều hành có JVM đủ mới: "Write once, run anywhere".
- Chương trình kết thúc khi `main` chạy hết (exit code 0), khi gọi `System.exit(n)` (exit code n), hoặc
  khi có exception không bắt (exit code 1).

## Tự kiểm tra

1. File nào được tạo ra sau khi chạy `javac -d out src/Greeting.java`, và nó nằm ở đâu?

   <details><summary>Đáp án</summary>

   File `out/Greeting.class`, chứa bytecode của class `Greeting`. Tuỳ chọn `-d out` chỉ định thư mục
   đích.

   </details>

2. Máy chỉ có JRE (không có JDK) thì làm được gì, không làm được gì?

   <details><summary>Đáp án</summary>

   Chạy được file `.class` có sẵn (có lệnh `java`), nhưng không biên dịch được vì không có `javac`.

   </details>

3. Vì sao `SplitBill` biên dịch thành công nhưng chạy thì lỗi?

   <details><summary>Đáp án</summary>

   `javac` chỉ kiểm tra luật ngôn ngữ (cú pháp, kiểu dữ liệu). Giá trị `people = 0` chỉ có ý nghĩa khi
   chạy, nên phép chia cho 0 chỉ bị JVM phát hiện lúc runtime và ném `ArithmeticException`.

   </details>

4. Trong bytecode của `total`, lệnh `iadd` làm gì với operand stack?

   <details><summary>Đáp án</summary>

   Lấy hai giá trị `int` trên cùng xuống (100 và 5), cộng lại, rồi đặt kết quả (105) lên stack.

   </details>

5. Trong ví dụ `LoadDemo`, vì sao dòng nạp `Account` xuất hiện **sau** "main bắt đầu"?

   <details><summary>Đáp án</summary>

   Vì JVM nạp class lười: chỉ khi code chạy tới chỗ cần `Account` (`new Account()`) thì class loader mới
   nạp nó.

   </details>

6. Lệnh `java -cp out ExitDemo crash; echo $?` in ra exit code bao nhiêu? Còn `System.exit(-1)`?

   <details><summary>Đáp án</summary>

   `1`, vì exception không được bắt. `System.exit(-1)` hiện ra là `255` trên macOS/Linux, vì exit code
   chỉ giữ 8 bit.

   </details>

## Bài tập

1. **(Dễ)** Viết `src/Receipt.java` in ra hai dòng: tên khách hàng và số tiền chuyển (dùng `long`, đơn vị
   đồng; bài 4 sẽ học cách chuẩn cho tiền). Biên dịch bằng `javac -d out`, chạy bằng `java -cp out`, rồi
   chạy lại bằng `java src/Receipt.java`. Kiểm tra: cách thứ hai có tạo thêm file `.class` nào không?
   *Gợi ý:* `ls out` trước và sau.
2. **(Vừa)** Thêm hàm `static int fee(int amount)` trả về `amount / 100` vào `Fee.java`. Chạy
   `javap -c` và tìm lệnh chia số nguyên. *Gợi ý:* lệnh cộng là `iadd`, đoán xem lệnh chia tên gì, rồi
   đối chiếu với bảng lệnh trong JVMS chương 6 [10].
3. **(Khó)** Viết `TransferCheck.java`: nếu không có tham số thì in "Thiếu số tiền" và thoát với exit code
   `2`; nếu có thì in "OK" và kết thúc bình thường. Viết một dòng shell chạy nó và in "Chuyển tiền thất
   bại" khi exit code khác 0. *Gợi ý:* `java TransferCheck.java || echo "Chuyển tiền thất bại"`.

## Đọc thêm

1. roadmap.sh, *Java Developer Roadmap*: <https://roadmap.sh/java>
2. Starter Tutorials, *Life Cycle of a Java Program* (tài liệu roadmap.sh gợi ý cho chủ đề này):
   <https://www.startertutorials.com/corejava/life-cycle-java-program.html>
3. dev.java, *Your First Java Code*: <https://dev.java/learn/first-steps/first-java-code/>
4. Oracle, *The Java Virtual Machine Specification, Java SE 21*, chương 2 "The Structure of the JVM":
   <https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html>
5. JVMS SE 21, chương 5 "Loading, Linking, and Initializing":
   <https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-5.html>
6. Oracle, *The javac Command* (JDK 21): <https://docs.oracle.com/en/java/javase/21/docs/specs/man/javac.html>
7. Oracle, *The java Command* (JDK 21): <https://docs.oracle.com/en/java/javase/21/docs/specs/man/java.html>
8. Oracle, *The javap Command* (JDK 21): <https://docs.oracle.com/en/java/javase/21/docs/specs/man/javap.html>
9. OpenJDK, *JEP 330: Launch Single-File Source-Code Programs*: <https://openjdk.org/jeps/330>
10. JVMS SE 21, chương 6 "The Java Virtual Machine Instruction Set":
    <https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-6.html>
11. Oracle, `java.lang.ClassLoader` (JDK 21 API):
    <https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/ClassLoader.html>
12. Oracle, *JDK 11 Release Notes* (mục "Removal of JRE" / JRE không còn được cài kèm):
    <https://www.oracle.com/java/technologies/javase/11-relnote-issues.html>
13. Oracle, *HotSpot Virtual Machine Garbage Collection Tuning Guide* (JDK 21):
    <https://docs.oracle.com/en/java/javase/21/gctuning/>
14. Oracle, *The Java Language Specification, Java SE 21*, §12.8 "Program Exit":
    <https://docs.oracle.com/javase/specs/jls/se21/html/jls-12.html#jls-12.8>
15. Baeldung, *Difference Between JVM, JRE, and JDK*: <https://www.baeldung.com/jvm-vs-jre-vs-jdk>
16. JVMS SE 21, chương 4 "The class File Format", §4.1:
    <https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-4.html#jvms-4.1>

**Bài tiếp theo:** [Bài 3 · Kiểu dữ liệu, biến và ép kiểu](/docs/learning/chang-1/kieu-du-lieu-bien-ep-kieu)
