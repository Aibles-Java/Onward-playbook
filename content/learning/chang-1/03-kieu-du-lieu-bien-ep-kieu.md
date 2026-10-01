---
title: "Bài 3 · Kiểu dữ liệu, biến và ép kiểu"
description: "Biến là hộp có nhãn và có loại: 8 kiểu nguyên thủy, kiểu tham chiếu, var, final, phạm vi biến và cách Java chuyển đổi giữa các kiểu số."
order: 13
tags: [java, chặng-1, kiểu-dữ-liệu, biến, ép-kiểu]
---

# Bài 3 · Kiểu dữ liệu, biến và ép kiểu

> 🎯 **Sau bài này bạn sẽ:**
> - Khai báo, khởi tạo và gán lại biến; giải thích được vì sao Java bắt biến cục bộ phải có giá trị trước khi dùng.
> - Kể tên đủ 8 kiểu nguyên thủy, biết kích thước và khoảng giá trị của chúng, viết đúng literal (`L`, `f`, `_`, `'A'`).
> - Phân biệt biến kiểu nguyên thủy (chứa giá trị) với biến kiểu tham chiếu (chứa "mũi tên" tới object).
> - Dùng đúng `var`, `final` và đọc được phạm vi (scope) của một biến.
> - Dự đoán đúng kết quả của ép kiểu mở rộng, ép kiểu thu hẹp và tràn số, ví dụ `(byte) 300`, `Integer.MAX_VALUE + 1`.

**Cần biết trước:** [Bài 1 · Cú pháp cơ bản](/docs/learning/chang-1/cu-phap-co-ban) (class, `main`,
`System.out.println`) và [Bài 2 · Vòng đời một chương trình Java](/docs/learning/chang-1/vong-doi-chuong-trinh)
(biên dịch bằng `javac`, chạy bằng `java`).

**Từ khoá của bài**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| Biến (*variable*) | Hộp có nhãn tên và có loại, đựng một giá trị | `long balance = 0;` |
| Kiểu dữ liệu (*data type*) | "Loại hộp": quyết định hộp đựng được gì, to cỡ nào | `int`, `double`, `String` |
| Kiểu nguyên thủy (*primitive type*) | 8 kiểu có sẵn, hộp chứa thẳng giá trị | `int`, `boolean` |
| Kiểu tham chiếu (*reference type*) | Hộp chứa mũi tên trỏ tới một object | `String`, mảng `long[]` |
| Literal | Giá trị viết thẳng trong code | `42`, `9_000L`, `'A'`, `true` |
| Phạm vi (*scope*) | Vùng code nhìn thấy được một biến | Bên trong cặp `{ }` |
| Ép kiểu (*type casting*) | Đổi giá trị từ kiểu này sang kiểu khác | `(int) 9.99` |
| Mở rộng / thu hẹp (*widening / narrowing*) | Đổ sang hộp to hơn (an toàn) / nhỏ hơn (có thể rơi vãi) | `int → long` / `long → int` |
| Tràn số (*overflow*) | Phép tính vượt khoảng của kiểu, số "vòng" sang đầu bên kia | `Integer.MAX_VALUE + 1` |

---

## 1. Biến là gì

**Ý tưởng nôm na.** **Biến** (*variable*) là một chiếc hộp có **nhãn tên** và có **loại**.
Giống ngăn két ở quầy giao dịch: mỗi ngăn có tên ("tiền mặt", "séc") và chỉ đựng đúng thứ được
quy định. Trong Java, loại hộp gọi là **kiểu dữ liệu** (*data type*). Hộp kiểu `long` chỉ đựng số
nguyên, không đựng được chữ.

Làm việc với biến có ba động tác:

- **Khai báo** (*declaration*): tạo hộp, ghi tên và loại. `long balance;`
- **Gán** (*assignment*): bỏ giá trị vào hộp bằng dấu `=`. `balance = 2_500_000;`
- **Khởi tạo** (*initialization*): khai báo và gán luôn lần đầu trên một dòng. `int transferCount = 0;`

Gán thêm lần nữa gọi là **gán lại**: giá trị cũ bị thay hẳn bằng giá trị mới.

<svg viewBox="0 0 720 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ba bước làm việc với biến balance kiểu long. Bước 1 khai báo long balance: hộp đã có nhãn balance và loại long nhưng chưa có giá trị. Bước 2 gán balance bằng 2_500_000: hộp chứa 2500000. Bước 3 gán lại balance bằng balance trừ 300_000: hộp chứa 2200000, giá trị cũ bị thay thế.">
  <defs>
    <marker id="b3-var-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="120" y="22" text-anchor="middle" fill="#0F172A" font-weight="bold">1. Khai báo</text>
    <text x="360" y="22" text-anchor="middle" fill="#0F172A" font-weight="bold">2. Gán</text>
    <text x="600" y="22" text-anchor="middle" fill="#0F172A" font-weight="bold">3. Gán lại</text>
    <text x="120" y="44" text-anchor="middle" fill="#1D4ED8" font-family="monospace" font-size="11">long balance;</text>
    <text x="360" y="44" text-anchor="middle" fill="#1D4ED8" font-family="monospace" font-size="11">balance = 2_500_000;</text>
    <text x="600" y="44" text-anchor="middle" fill="#1D4ED8" font-family="monospace" font-size="11">balance = balance - 300_000;</text>
    <rect x="40" y="62" width="80" height="20" rx="4" fill="#2563EB"/>
    <text x="80" y="76" text-anchor="middle" fill="#FFFFFF">balance</text>
    <rect x="140" y="62" width="60" height="20" rx="4" fill="#FFFBEB" stroke="#D97706"/>
    <text x="170" y="76" text-anchor="middle" fill="#D97706">long</text>
    <rect x="40" y="86" width="160" height="56" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="120" y="120" text-anchor="middle" fill="#DC2626" font-size="18">?</text>
    <rect x="280" y="62" width="80" height="20" rx="4" fill="#2563EB"/>
    <text x="320" y="76" text-anchor="middle" fill="#FFFFFF">balance</text>
    <rect x="380" y="62" width="60" height="20" rx="4" fill="#FFFBEB" stroke="#D97706"/>
    <text x="410" y="76" text-anchor="middle" fill="#D97706">long</text>
    <rect x="280" y="86" width="160" height="56" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="360" y="120" text-anchor="middle" fill="#1D4ED8" font-size="16" font-family="monospace">2500000</text>
    <rect x="520" y="62" width="80" height="20" rx="4" fill="#2563EB"/>
    <text x="560" y="76" text-anchor="middle" fill="#FFFFFF">balance</text>
    <rect x="620" y="62" width="60" height="20" rx="4" fill="#FFFBEB" stroke="#D97706"/>
    <text x="650" y="76" text-anchor="middle" fill="#D97706">long</text>
    <rect x="520" y="86" width="160" height="56" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="600" y="120" text-anchor="middle" fill="#047857" font-size="16" font-family="monospace">2200000</text>
    <line x1="205" y1="114" x2="274" y2="114" stroke="#64748B" marker-end="url(#b3-var-arrow)"/>
    <line x1="445" y1="114" x2="514" y2="114" stroke="#64748B" marker-end="url(#b3-var-arrow)"/>
    <text x="120" y="166" text-anchor="middle" fill="#64748B" font-size="11">hộp đã có, chưa có giá trị</text>
    <text x="360" y="166" text-anchor="middle" fill="#64748B" font-size="11">bỏ giá trị vào hộp</text>
    <text x="600" y="166" text-anchor="middle" fill="#64748B" font-size="11">giá trị cũ bị thay hẳn</text>
  </g>
</svg>

**Ví dụ code.** Tài khoản có 2.500.000 đồng, chuyển đi 300.000 đồng.

```java
public class VariableBasics {
    public static void main(String[] args) {
        long balance;                 // 1. Khai báo: tạo hộp tên balance, loại long
        balance = 2_500_000;          // 2. Gán: bỏ giá trị 2.500.000 vào hộp
        int transferCount = 0;        // 3. Khai báo + khởi tạo trên cùng một dòng
        System.out.println("Số dư ban đầu: " + balance + " đồng");

        balance = balance - 300_000;  // 4. Gán lại: lấy giá trị cũ trừ 300.000
        transferCount = transferCount + 1;
        System.out.println("Sau 1 lần chuyển: " + balance + " đồng");
        System.out.println("Số lần chuyển: " + transferCount);
    }
}
```

**Kết quả khi chạy** (`java VariableBasics.java`):

```text
Số dư ban đầu: 2500000 đồng
Sau 1 lần chuyển: 2200000 đồng
Số lần chuyển: 1
```

**Giải thích từng bước.**

1. `long balance;` tạo hộp tên `balance`, loại `long` (số nguyên lớn, phần 2 sẽ nói kỹ). Hộp chưa có giá trị.
2. `balance = 2_500_000;` bỏ số 2.500.000 vào hộp. Dấu `_` chỉ giúp mắt người dễ đọc, Java bỏ qua nó.
3. `int transferCount = 0;` vừa tạo hộp vừa bỏ số 0 vào. Đây là cách viết hay dùng nhất.
4. `balance = balance - 300_000;` được Java đọc **từ phải sang trái**: lấy giá trị hiện tại
   (2.500.000), trừ 300.000, rồi bỏ kết quả 2.200.000 vào lại hộp `balance`.
5. Dấu `+` giữa chữ và biến dùng để nối thành một dòng chữ. Bài 4 sẽ học kỹ phép nối chuỗi.

> 💡 Bài này lưu tiền bằng `long` theo đơn vị **đồng**. Đây là cách tạm thời để học. Ngân hàng
> thật dùng `BigDecimal`, bạn sẽ học ở [Bài 4](/docs/learning/chang-1/chuoi-va-phep-toan).

### ⚠️ Lỗi hay gặp

**Lỗi 1: dùng biến cục bộ khi chưa gán giá trị.** Biến khai báo bên trong method (như `main`)
gọi là **biến cục bộ** (*local variable*). Java không tự cho nó giá trị mặc định, và trình biên dịch
(*compiler*) kiểm tra chắc chắn biến đã được gán trước khi đọc [3].

```java
public class Uninit {
    public static void main(String[] args) {
        long fee;                     // khai báo nhưng chưa gán
        System.out.println(fee);      // dùng luôn
    }
}
```

```text
Uninit.java:4: error: variable fee might not have been initialized
        System.out.println(fee);      // dùng luôn
                           ^
1 error
```

✅ Cách sửa: gán giá trị trước khi dùng, ví dụ `long fee = 0;`.

**Lỗi 2: bỏ sai loại vào hộp.** Hộp `int` không đựng được chữ, kể cả chữ trông giống số.

```java
int age = "25";
```

```text
WrongTypeAssign.java:3: error: incompatible types: String cannot be converted to int
        int age = "25";
                  ^
1 error
```

✅ Cách sửa: bỏ dấu nháy kép, viết `int age = 25;`.

---

## 2. Tám kiểu nguyên thủy

**Ý tưởng nôm na.** Java có sẵn đúng **8 kiểu nguyên thủy** (*primitive types*) [1]. Hãy nghĩ tới
các loại phong bì ở ngân hàng: phong bì nhỏ chỉ đựng vài tờ, bao tải đựng được cả triệu tờ. Hộp càng
nhiều **bit** (đơn vị nhỏ nhất của bộ nhớ, giá trị 0 hoặc 1) thì đựng được số càng lớn, nhưng tốn chỗ hơn.

<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Biểu đồ thanh kích thước 8 kiểu nguyên thủy. Số nguyên: byte 8 bit, short 16 bit, int 32 bit, long 64 bit. Số thực: float 32 bit, double 64 bit. Ký tự: char 16 bit. Logic: boolean, JLS không quy định số bit, chỉ có true hoặc false.">
  <g font-family="sans-serif" font-size="12">
    <text x="20" y="20" fill="#0F172A" font-weight="bold">Kích thước mỗi kiểu (1 bit = 8px)</text>
    <text x="20" y="48" fill="#0F172A" font-family="monospace">byte</text>
    <rect x="100" y="34" width="64" height="20" rx="3" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="172" y="48" fill="#64748B">8 bit</text>
    <text x="20" y="78" fill="#0F172A" font-family="monospace">short</text>
    <rect x="100" y="64" width="128" height="20" rx="3" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="236" y="78" fill="#64748B">16 bit</text>
    <text x="20" y="108" fill="#0F172A" font-family="monospace">int</text>
    <rect x="100" y="94" width="256" height="20" rx="3" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="364" y="108" fill="#64748B">32 bit (mặc định cho số nguyên)</text>
    <text x="20" y="138" fill="#0F172A" font-family="monospace">long</text>
    <rect x="100" y="124" width="512" height="20" rx="3" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="620" y="138" fill="#64748B">64 bit</text>
    <text x="20" y="168" fill="#0F172A" font-family="monospace">float</text>
    <rect x="100" y="154" width="256" height="20" rx="3" fill="#ECFDF5" stroke="#10B981"/>
    <text x="364" y="168" fill="#64748B">32 bit</text>
    <text x="20" y="198" fill="#0F172A" font-family="monospace">double</text>
    <rect x="100" y="184" width="512" height="20" rx="3" fill="#ECFDF5" stroke="#10B981"/>
    <text x="620" y="198" fill="#64748B">64 bit</text>
    <text x="20" y="228" fill="#0F172A" font-family="monospace">char</text>
    <rect x="100" y="214" width="128" height="20" rx="3" fill="#FFFBEB" stroke="#D97706"/>
    <text x="236" y="228" fill="#64748B">16 bit, không âm</text>
    <text x="20" y="258" fill="#0F172A" font-family="monospace">boolean</text>
    <rect x="100" y="244" width="40" height="20" rx="3" fill="#F8FAFC" stroke="#94A3B8" stroke-dasharray="4 3"/>
    <text x="148" y="258" fill="#64748B">JLS không quy định số bit, chỉ có true / false</text>
    <rect x="20" y="278" width="12" height="12" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="38" y="289" fill="#0F172A" font-size="11">số nguyên</text>
    <rect x="120" y="278" width="12" height="12" fill="#ECFDF5" stroke="#10B981"/>
    <text x="138" y="289" fill="#0F172A" font-size="11">số thực</text>
    <rect x="210" y="278" width="12" height="12" fill="#FFFBEB" stroke="#D97706"/>
    <text x="228" y="289" fill="#0F172A" font-size="11">ký tự</text>
    <rect x="290" y="278" width="12" height="12" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="308" y="289" fill="#0F172A" font-size="11">logic</text>
  </g>
</svg>

Bảng dưới theo JLS §4.2 [1] và Oracle Java Tutorials [7]. Giá trị chính xác của `long` bạn sẽ thấy khi chạy ví dụ bên dưới. Cột "Mặc định" là giá trị Java tự gán cho
**field** (biến khai báo trong class, ngoài method; bài 6 học kỹ) [2]. Biến cục bộ **không** có mặc định.

| Kiểu | Kích thước | Khoảng giá trị | Mặc định (field) |
|------|-----------|----------------|------------------|
| `byte` | 8 bit | `-128` .. `127` | `0` |
| `short` | 16 bit | `-32_768` .. `32_767` | `0` |
| `int` | 32 bit | `-2_147_483_648` .. `2_147_483_647` (≈ ±2,1 tỷ) | `0` |
| `long` | 64 bit | `-2⁶³` .. `2⁶³ − 1` (≈ ±9,2 tỷ tỷ) | `0L` |
| `float` | 32 bit | ≈ ±3,4 × 10³⁸, khoảng 6–7 chữ số chính xác | `0.0f` |
| `double` | 64 bit | ≈ ±1,8 × 10³⁰⁸, khoảng 15–16 chữ số chính xác | `0.0d` |
| `char` | 16 bit, không dấu | `'\u0000'` .. `'\uffff'` (0 .. 65535) | `'\u0000'` |
| `boolean` | không quy định | `true` hoặc `false` | `false` |

**Literal** là giá trị bạn viết thẳng trong code. Vài quy tắc cần nhớ [1][8]:

- Số nguyên viết thẳng (`42`) có kiểu `int`. Muốn literal kiểu `long` thì thêm hậu tố **`L`**: `9_000_000_000L`.
  Nên dùng `L` hoa vì `l` thường dễ nhìn nhầm với số `1`.
- Số có dấu chấm (`5.5`) có kiểu `double`. Muốn `float` thì thêm **`f`**: `5.5f`. Hậu tố `d` cho `double` là tuỳ chọn.
- Dấu **`_`** được đặt giữa các chữ số để dễ đọc: `1_000_000`. Không đặt ở đầu, cuối, cạnh dấu chấm hay cạnh hậu tố: `1_000_L` và `5.5_f` đều bị javac báo `illegal underscore`.
- `char` dùng **nháy đơn** và chứa đúng **một** ký tự: `'A'`.
- **Unicode** là bảng mã chung cho chữ viết của cả thế giới: mỗi ký tự được gán một con số, ví dụ `A` là 65,
  `₫` là 8363. Bạn có thể viết một `char` bằng mã của nó theo cú pháp `'\uXXXX'`: dấu gạch chéo ngược,
  chữ `u`, rồi đúng 4 chữ số hệ 16 (*hexadecimal*, dùng 0–9 và A–F). Ví dụ `'\u0041'` là `'A'`,
  còn `'\u20AB'` là `'₫'` (20AB hệ 16 = 8363).
- `boolean` chỉ nhận `true` hoặc `false`. Không dùng `0`/`1` như một số ngôn ngữ khác.

```java
public class PrimitiveTypes {
    public static void main(String[] args) {
        byte   pinDigit    = 7;                  // số rất nhỏ: -128..127
        short  branchCode  = 1_024;              // mã chi nhánh
        int    customers   = 2_000_000;          // dấu _ chỉ để dễ đọc
        long   totalAssets = 9_000_000_000L;     // hậu tố L: literal kiểu long
        float  rateF       = 5.5f;               // hậu tố f: literal kiểu float
        double rateD       = 5.5;                // số thực mặc định là double
        char   grade       = 'A';                // một ký tự, nháy đơn
        char   dong        = '\u20AB';      // ký tự Unicode: dấu ₫
        boolean isActive   = true;               // chỉ có true hoặc false

        System.out.println(pinDigit + " " + branchCode + " " + customers);
        System.out.println(totalAssets);
        System.out.println(rateF + " " + rateD);
        System.out.println(grade + " " + dong + " " + isActive);
        System.out.println("int:  " + Integer.MIN_VALUE + " .. " + Integer.MAX_VALUE);
        System.out.println("long: " + Long.MIN_VALUE + " .. " + Long.MAX_VALUE);
    }
}
```

**Kết quả khi chạy:**

```text
7 1024 2000000
9000000000
5.5 5.5
A ₫ true
int:  -2147483648 .. 2147483647
long: -9223372036854775808 .. 9223372036854775807
```

**Giải thích từng bước.**

1. Mỗi dòng khai báo + khởi tạo một biến với một kiểu khác nhau. Comment ghi lý do chọn kiểu.
2. `9_000_000_000L` vượt khoảng `int` (≈ 2,1 tỷ) nên **bắt buộc** có `L`.
3. Khi in, dấu `_` không xuất hiện: nó chỉ tồn tại trong mã nguồn.
4. `'\u20AB'` được in ra là `₫`. `char` thực chất lưu một **mã số** 16 bit (phần 6 sẽ thấy rõ).
5. `Integer.MIN_VALUE`, `Long.MAX_VALUE`... là các hằng có sẵn trong JDK. Dùng chúng thay vì tự gõ số dài.

Muốn kiểm tra giá trị mặc định của field, bạn chạy thử đoạn sau (từ khoá `static` sẽ học ở bài 6):

```java
public class DefaultValues {
    static int count;        // field: không gán vẫn có giá trị mặc định
    static double rate;
    static boolean active;
    static char letter;
    static String name;      // kiểu tham chiếu

    public static void main(String[] args) {
        System.out.println(count + " " + rate + " " + active);
        System.out.println((letter == '\u0000') + " " + name);
    }
}
```

```text
0 0.0 false
true null
```

### ⚠️ Lỗi hay gặp

**Lỗi 1: quên hậu tố `L`.** Số dưới đây vừa với `long`, nhưng literal không có `L` là `int`, và nó vượt khoảng `int`.

```java
long totalAssets = 9_000_000_000;
```

```text
TooLarge.java:3: error: integer number too large
        long totalAssets = 9_000_000_000;
                           ^
1 error
```

✅ Cách sửa: `long totalAssets = 9_000_000_000L;`

**Lỗi 2: gán số có dấu chấm vào `float`.** `5.5` là `double` (64 bit), không tự nhét vừa `float` (32 bit).

```java
float rate = 5.5;
```

```text
FloatLiteral.java:3: error: incompatible types: possible lossy conversion from double to float
        float rate = 5.5;
                     ^
1 error
```

✅ Cách sửa: `float rate = 5.5f;`, hoặc dùng luôn `double` (lựa chọn mặc định cho số thực).

**Lỗi 3: dùng nháy kép cho `char`.** `"A"` là một chuỗi (`String`), `'A'` mới là ký tự.

```java
char grade = "A";
```

```text
CharQuote.java:3: error: incompatible types: String cannot be converted to char
        char grade = "A";
                     ^
1 error
```

✅ Cách sửa: `char grade = 'A';`

---

## 3. Kiểu tham chiếu và kiểu nguyên thủy

**Ý tưởng nôm na.** Biến kiểu nguyên thủy giống **ví tiền**: tiền nằm ngay trong ví. Biến **kiểu
tham chiếu** (*reference type*) giống **thẻ ATM**: thẻ không chứa tiền, nó chỉ "trỏ" tới tài khoản nằm
ở chỗ khác. Hai thẻ có thể trỏ cùng một tài khoản: rút bằng thẻ này thì thẻ kia cũng thấy số dư giảm.

Thứ mà biến tham chiếu trỏ tới gọi là **object** (đối tượng). `String` và mảng (*array*) là hai kiểu
tham chiếu bạn gặp sớm nhất. Ngoài 8 kiểu nguyên thủy, mọi kiểu khác trong Java đều là kiểu tham chiếu [1].
Ở đây bạn chỉ cần nắm khái niệm; [Bài 5](/docs/learning/chang-1/mang-dieu-kien-vong-lap) học mảng và
[Bài 6](/docs/learning/chang-1/nhap-mon-oop) học object kỹ hơn.

<svg viewBox="0 0 720 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="So sánh biến nguyên thủy và biến tham chiếu. Biến long a chứa 1000000, biến long b chứa 1500000, hai hộp độc lập. Biến balances và biến alias kiểu long[] đều chứa mũi tên trỏ tới cùng một mảng có phần tử 0 bằng 0 và phần tử 1 bằng 2000000. Biến owner kiểu String chứa mũi tên tới object chuỗi Nguyen Van A. Biến nobody chứa null, không trỏ đi đâu.">
  <defs>
    <marker id="b3-ref-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#047857"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="20" y="22" fill="#0F172A" font-weight="bold">Biến: chứa giá trị hoặc mũi tên</text>
    <text x="430" y="22" fill="#0F172A" font-weight="bold">Object (bài 6 học kỹ)</text>
    <rect x="20" y="34" width="130" height="30" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="28" y="54" fill="#0F172A" font-family="monospace">long a</text>
    <rect x="150" y="34" width="80" height="30" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="190" y="54" text-anchor="middle" fill="#1D4ED8" font-family="monospace">1000000</text>
    <rect x="20" y="72" width="130" height="30" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="28" y="92" fill="#0F172A" font-family="monospace">long b</text>
    <rect x="150" y="72" width="80" height="30" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="190" y="92" text-anchor="middle" fill="#1D4ED8" font-family="monospace">1500000</text>
    <text x="245" y="60" fill="#64748B" font-size="11">copy giá trị: hai hộp độc lập</text>
    <rect x="20" y="110" width="130" height="30" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="28" y="130" fill="#0F172A" font-family="monospace">long[] balances</text>
    <rect x="150" y="110" width="80" height="30" fill="#ECFDF5" stroke="#10B981"/>
    <circle cx="190" cy="125" r="4" fill="#047857"/>
    <rect x="20" y="148" width="130" height="30" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="28" y="168" fill="#0F172A" font-family="monospace">long[] alias</text>
    <rect x="150" y="148" width="80" height="30" fill="#ECFDF5" stroke="#10B981"/>
    <circle cx="190" cy="163" r="4" fill="#047857"/>
    <rect x="20" y="186" width="130" height="30" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="28" y="206" fill="#0F172A" font-family="monospace">String owner</text>
    <rect x="150" y="186" width="80" height="30" fill="#ECFDF5" stroke="#10B981"/>
    <circle cx="190" cy="201" r="4" fill="#047857"/>
    <rect x="20" y="224" width="130" height="30" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="28" y="244" fill="#0F172A" font-family="monospace">String nobody</text>
    <rect x="150" y="224" width="80" height="30" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="190" y="244" text-anchor="middle" fill="#64748B" font-family="monospace">null</text>
    <text x="430" y="96" fill="#64748B" font-size="11">mảng long[] (một object)</text>
    <rect x="430" y="104" width="120" height="34" fill="#ECFDF5" stroke="#10B981"/>
    <text x="490" y="126" text-anchor="middle" fill="#047857" font-family="monospace">[0] 0</text>
    <rect x="550" y="104" width="140" height="34" fill="#ECFDF5" stroke="#10B981"/>
    <text x="620" y="126" text-anchor="middle" fill="#047857" font-family="monospace">[1] 2000000</text>
    <text x="430" y="186" fill="#64748B" font-size="11">String (một object)</text>
    <rect x="430" y="194" width="200" height="34" fill="#ECFDF5" stroke="#10B981"/>
    <text x="530" y="216" text-anchor="middle" fill="#047857" font-family="monospace">"Nguyen Van A"</text>
    <line x1="194" y1="125" x2="424" y2="118" stroke="#047857" marker-end="url(#b3-ref-arrow)"/>
    <line x1="194" y1="163" x2="424" y2="128" stroke="#047857" marker-end="url(#b3-ref-arrow)"/>
    <line x1="194" y1="201" x2="424" y2="210" stroke="#047857" marker-end="url(#b3-ref-arrow)"/>
    <text x="245" y="244" fill="#64748B" font-size="11">null: mũi tên không trỏ đi đâu</text>
  </g>
</svg>

```java
public class ReferenceDemo {
    public static void main(String[] args) {
        // Kiểu nguyên thủy: copy GIÁ TRỊ
        long a = 1_000_000;
        long b = a;          // b nhận một bản sao của giá trị
        b = b + 500_000;     // chỉ b thay đổi
        System.out.println("a = " + a + ", b = " + b);

        // Kiểu tham chiếu: copy MŨI TÊN (địa chỉ object)
        long[] balances = {1_000_000, 2_000_000};  // mảng là object
        long[] alias = balances;   // alias trỏ tới CÙNG mảng
        alias[0] = 0;              // sửa qua alias...
        System.out.println("balances[0] = " + balances[0]);  // ...balances cũng thấy

        String owner = "Nguyen Van A";  // String cũng là kiểu tham chiếu
        String nobody = null;           // null: mũi tên không trỏ đi đâu
        System.out.println(owner + " | " + nobody);
    }
}
```

**Kết quả khi chạy:**

```text
a = 1000000, b = 1500000
balances[0] = 0
Nguyen Van A | null
```

**Giải thích từng bước.**

1. `long b = a;` chép **giá trị** 1.000.000 sang hộp `b`. Sau đó sửa `b` không ảnh hưởng `a`.
2. Cú pháp mảng: `long[]` đọc là "mảng các số `long`"; `{1_000_000, 2_000_000}` liệt kê sẵn các phần tử;
   `balances[0]` là phần tử ở vị trí 0, tức phần tử đầu tiên (Java đếm từ 0). Dòng này tạo mảng (một object)
   rồi đặt mũi tên tới nó vào biến `balances`.
3. `long[] alias = balances;` chép **mũi tên**, không chép mảng. Giờ có hai mũi tên cùng trỏ một mảng.
4. `alias[0] = 0;` sửa mảng qua `alias`, nên đọc qua `balances` cũng thấy `0`. Giống hai thẻ ATM cùng một tài khoản.
5. `null` là giá trị đặc biệt của kiểu tham chiếu, nghĩa là "chưa trỏ tới object nào".

### ⚠️ Lỗi hay gặp

**Gán `null` cho kiểu nguyên thủy.** `null` chỉ dành cho kiểu tham chiếu. Hộp nguyên thủy luôn phải có một giá trị thật.

```java
long balance = null;
```

```text
NullPrimitive.java:3: error: incompatible types: <null> cannot be converted to long
        long balance = null;
                       ^
1 error
```

✅ Cách sửa: dùng `0` nếu đó là giá trị khởi đầu hợp lý. Trường hợp cần "chưa có giá trị" sẽ có kỹ thuật riêng ở các chặng sau.

---

## 4. `var` và hằng `final`

**Ý tưởng nôm na.**

- **`var`** (Java 10+) giống nhờ giao dịch viên tự chọn loại phong bì: bạn đưa tiền, họ nhìn rồi chọn đúng loại.
  Trình biên dịch nhìn **vế phải** để **suy luận kiểu** (*type inference*) [5]. Kiểu được chốt lúc biên dịch
  và **không đổi** về sau. `var` không biến Java thành ngôn ngữ "kiểu động" như JavaScript.
- **`final`** giống con dấu niêm phong: gán đúng **một lần**, sau đó không ai gán lại được. Biến
  `final` thường được gọi là **hằng** (*constant*).

<svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bên trái: với var balance bằng 15_000_000L, compiler nhìn vế phải thấy hậu tố L nên chốt kiểu long, tương đương long balance bằng 15_000_000L. Bên phải: final long dailyLimit bằng 50_000_000L được niêm phong; câu lệnh gán lại dailyLimit bằng 100_000_000L bị javac báo lỗi cannot assign a value to final variable.">
  <defs>
    <marker id="b3-vf-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="185" y="22" text-anchor="middle" fill="#0F172A" font-weight="bold">var: compiler tự suy ra kiểu</text>
    <rect x="20" y="36" width="330" height="32" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="185" y="57" text-anchor="middle" fill="#1D4ED8" font-family="monospace">var balance = 15_000_000L;</text>
    <line x1="185" y1="68" x2="185" y2="88" stroke="#64748B" marker-end="url(#b3-vf-arrow)"/>
    <rect x="20" y="92" width="330" height="32" rx="6" fill="#FFFBEB" stroke="#D97706"/>
    <text x="185" y="113" text-anchor="middle" fill="#0F172A">nhìn vế phải: có hậu tố L → kiểu long</text>
    <line x1="185" y1="124" x2="185" y2="144" stroke="#64748B" marker-end="url(#b3-vf-arrow)"/>
    <rect x="20" y="148" width="330" height="32" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="185" y="169" text-anchor="middle" fill="#047857" font-family="monospace">long balance = 15_000_000L;</text>
    <text x="545" y="22" text-anchor="middle" fill="#0F172A" font-weight="bold">final: gán đúng một lần</text>
    <rect x="380" y="36" width="330" height="32" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="545" y="57" text-anchor="middle" fill="#047857" font-family="monospace">final long dailyLimit = 50_000_000L;</text>
    <text x="545" y="88" text-anchor="middle" fill="#64748B" font-size="11">đã niêm phong, thử gán lại:</text>
    <rect x="380" y="98" width="330" height="32" rx="6" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="545" y="119" text-anchor="middle" fill="#DC2626" font-family="monospace">dailyLimit = 100_000_000L;</text>
    <text x="545" y="152" text-anchor="middle" fill="#DC2626" font-size="11">javac: cannot assign a value to final variable</text>
    <text x="545" y="172" text-anchor="middle" fill="#64748B" font-size="11">bị chặn ngay lúc biên dịch, không đợi tới lúc chạy</text>
  </g>
</svg>

```java
public class VarFinalDemo {
    public static void main(String[] args) {
        var customerName = "Tran Thi B";   // compiler suy ra: String
        var accountCount = 3;              // suy ra: int
        var balance = 15_000_000L;         // có L nên suy ra: long
        var rate = 0.055;                  // suy ra: double

        final long dailyLimit = 50_000_000L;  // hằng: gán đúng một lần
        final int maxPinRetry = 5;

        System.out.println(customerName + " có " + accountCount + " tài khoản");
        System.out.println("Số dư: " + balance + ", lãi suất: " + rate);
        System.out.println("Hạn mức/ngày: " + dailyLimit);
        System.out.println("Nhập sai PIN tối đa: " + maxPinRetry + " lần");

        balance = balance + 1_000_000;     // var vẫn là biến bình thường, gán lại được
        System.out.println("Số dư mới: " + balance);
    }
}
```

**Kết quả khi chạy:**

```text
Tran Thi B có 3 tài khoản
Số dư: 15000000, lãi suất: 0.055
Hạn mức/ngày: 50000000
Nhập sai PIN tối đa: 5 lần
Số dư mới: 16000000
```

**Giải thích từng bước.**

1. Bốn dòng `var` đầu: compiler nhìn literal bên phải để chọn kiểu `String`, `int`, `long`, `double`.
2. `final long dailyLimit = 50_000_000L;` tạo hằng hạn mức. Từ đây không gán lại được.
3. Các dòng in kết quả dùng biến như bình thường.
4. `balance = balance + 1_000_000;` hợp lệ: `var` không phải `final`, nó chỉ để compiler đoán kiểu.

**Khi nào dùng?** Theo hướng dẫn phong cách của OpenJDK [12]:

- Dùng `var` khi vế phải đã **nói rõ kiểu** và tên biến đủ nghĩa, ví dụ `var customerName = "Tran Thi B";`.
- Viết kiểu tường minh khi kiểu quan trọng với người đọc, nhất là **số tiền**: `long balance = ...` rõ hơn `var balance = ...`.
- `var` chỉ dùng cho **biến cục bộ**, không dùng cho field hay tham số method [5].
- Dùng `final` cho giá trị không được đổi (hạn mức, số lần thử). Quy ước đặt tên `UPPER_SNAKE_CASE`
  (`DAILY_LIMIT`) dành cho hằng `static final` ở cấp class; bài 6 sẽ học.

### ⚠️ Lỗi hay gặp

**Lỗi 1: `var` không có giá trị khởi tạo, hoặc khởi tạo bằng `null`.** Không có vế phải thì compiler không có gì để đoán.

```java
var amount;
var nothing = null;
```

```text
VarNoInit.java:3: error: cannot infer type for local variable amount
        var amount;
            ^
  (cannot use 'var' on variable without initializer)
VarNoInit.java:4: error: cannot infer type for local variable nothing
        var nothing = null;
            ^
  (variable initializer is 'null')
2 errors
```

**Lỗi 2: nghĩ `var` đổi kiểu được.** `var amount = 100_000;` đã chốt `int`, gán `2.5` sẽ lỗi.

```java
var amount = 100_000;     // suy ra int
amount = 2.5;             // gán double vào int
```

```text
VarTypeFixed.java:4: error: incompatible types: possible lossy conversion from double to int
        amount = 2.5;             // gán double vào int
                 ^
1 error
```

**Lỗi 3: gán lại biến `final`.**

```java
final long dailyLimit = 50_000_000L;
dailyLimit = 100_000_000L;
```

```text
FinalReassign.java:4: error: cannot assign a value to final variable dailyLimit
        dailyLimit = 100_000_000L;
        ^
1 error
```

💡 Bẫy âm thầm hơn: `var total = 2_000_000_000;` suy ra `int` (vì thiếu `L`), nên
`total + 2_000_000_000` cho ra `-294967296` mà không có lỗi nào. Phần 7 sẽ giải thích hiện tượng tràn số này.

---

## 5. Phạm vi biến (scope)

**Ý tưởng nôm na.** **Phạm vi** (*scope*) là vùng code "nhìn thấy" được một biến. Giống thẻ ra vào
toà nhà ngân hàng: thẻ cấp ở tầng nào chỉ dùng trong tầng đó; người ở phòng con bên trong thì vẫn
dùng được đồ của tầng bao ngoài. Trong Java, mỗi cặp ngoặc nhọn `{ }` tạo một **block** (khối lệnh).
Biến cục bộ sống từ dòng khai báo đến dấu `}` đóng block chứa nó [4].

<svg viewBox="0 0 720 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Các vùng phạm vi lồng nhau trong class ScopeDemo. Method main chứa balance và amount. Bên trong main có block if chứa fee; block if nhìn thấy fee, balance và amount. Ra khỏi block if thì fee không còn. Method printReceipt là vùng riêng, chứa message và không nhìn thấy balance của main.">
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="700" height="270" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="24" y="30" fill="#64748B" font-family="monospace">class ScopeDemo { ... }</text>
    <rect x="30" y="42" width="410" height="224" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="44" y="62" fill="#1D4ED8" font-weight="bold">main() { ... }</text>
    <text x="44" y="84" fill="#0F172A" font-family="monospace">long balance</text>
    <text x="44" y="102" fill="#0F172A" font-family="monospace">long amount</text>
    <rect x="60" y="116" width="360" height="100" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="74" y="136" fill="#047857" font-weight="bold">block if { ... }</text>
    <text x="74" y="158" fill="#0F172A" font-family="monospace">long fee</text>
    <text x="74" y="182" fill="#047857" font-size="11">nhìn thấy: fee, balance, amount</text>
    <text x="74" y="202" fill="#64748B" font-size="11">fee sinh ra ở đây, chết ở dấu } của block</text>
    <text x="44" y="242" fill="#DC2626" font-size="11">sau block if: fee không còn, dùng fee là lỗi</text>
    <rect x="460" y="42" width="230" height="224" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="474" y="62" fill="#D97706" font-weight="bold">printReceipt() { ... }</text>
    <text x="474" y="84" fill="#0F172A" font-family="monospace">String message</text>
    <text x="474" y="118" fill="#DC2626" font-size="11">không thấy balance, amount</text>
    <text x="474" y="136" fill="#DC2626" font-size="11">(chúng thuộc vùng của main)</text>
    <text x="474" y="170" fill="#64748B" font-size="11">mỗi method là một vùng riêng</text>
  </g>
</svg>

Ví dụ dưới dùng lệnh `if` (bài 5 học kỹ). Lúc này bạn chỉ cần hiểu: nếu điều kiện trong ngoặc
đúng thì chạy các lệnh trong `{ }`. Nó cũng có thêm một method nhỏ `printReceipt()` để thấy hai
method là hai vùng riêng.

```java
public class ScopeDemo {
    public static void main(String[] args) {
        long balance = 5_000_000;              // scope: từ đây tới hết main
        long amount = 2_000_000;

        if (amount <= balance) {               // mở block mới
            long fee = 3_300;                  // scope: chỉ trong block if
            balance = balance - amount - fee;  // block con NHÌN THẤY biến của block cha
            System.out.println("Phí: " + fee);
        }                                      // fee "chết" tại đây

        System.out.println("Số dư còn: " + balance);
        printReceipt();
    }

    static void printReceipt() {
        // balance của main KHÔNG nhìn thấy ở đây
        String message = "Giao dịch thành công";   // biến cục bộ của printReceipt
        System.out.println(message);
    }
}
```

**Kết quả khi chạy:**

```text
Phí: 3300
Số dư còn: 2996700
Giao dịch thành công
```

**Giải thích từng bước.**

1. `balance` và `amount` khai báo đầu `main`, nên sống tới dấu `}` cuối `main`.
2. Vì 2.000.000 ≤ 5.000.000, Java vào block `if`. Biến `fee` được tạo trong block này.
3. Trong block `if` vẫn đọc và gán được `balance`: block con nhìn thấy biến của block bao ngoài.
4. Tới dấu `}` của `if`, `fee` hết phạm vi và không thể dùng được nữa.
5. `printReceipt()` là một method khác, có vùng riêng. Nó chỉ thấy `message` của chính nó.

> 💡 Ngoài biến cục bộ còn có **field**, biến khai báo trong class, sống cùng object hoặc class.
> Bạn đã thấy chúng ở `DefaultValues` phần 2. Bài 6 sẽ học kỹ.

### ⚠️ Lỗi hay gặp

**Lỗi 1: dùng biến ngoài phạm vi của nó.**

```java
if (true) {
    long fee = 3_300;
}
System.out.println(fee);
```

```text
ScopeOut.java:6: error: cannot find symbol
        System.out.println(fee);
                           ^
  symbol:   variable fee
  location: class ScopeOut
1 error
```

✅ Cách sửa: khai báo `fee` ở block ngoài nếu cần dùng sau `if`.

**Lỗi 2: khai báo trùng tên trong block lồng nhau.** Một số ngôn ngữ cho phép biến bên trong
"che" biến bên ngoài. Java **cấm** điều này với biến cục bộ [4].

```java
long balance = 5_000_000;
if (balance > 0) {
    long balance = 0;   // trùng tên với biến của block cha
}
```

```text
ScopeShadow.java:5: error: variable balance is already defined in method main(String[])
            long balance = 0;   // trùng tên với biến của block cha
                 ^
1 error
```

✅ Cách sửa: đặt tên khác (`newBalance`), hoặc bỏ chữ `long` nếu ý bạn là gán lại biến cũ.
Lưu ý: hai block **anh em** (đứng cạnh nhau, không lồng nhau) thì được dùng cùng tên, vì
biến thứ nhất đã chết trước khi biến thứ hai ra đời.

---

## 6. Ép kiểu mở rộng (widening): tự động

**Ý tưởng nôm na.** Đổ nước từ cốc nhỏ sang xô to: không rơi giọt nào, nên Java tự làm giúp bạn.
Đó là **ép kiểu mở rộng** (*widening primitive conversion*): chuyển từ kiểu hẹp sang kiểu rộng hơn,
bạn không cần viết gì thêm [6].

Các hướng mở rộng hợp lệ đi theo chiều mũi tên (và nối tiếp được, ví dụ `byte → long`):

<svg viewBox="0 0 720 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chuỗi ép kiểu mở rộng tự động: byte sang short sang int sang long sang float sang double, và char sang int. Các bước an toàn vẽ mũi tên xanh, gồm cả đường int sang double. Ba hướng tự động nhưng có thể mất độ chính xác vẽ nét đứt vàng: int sang float, long sang float, long sang double.">
  <defs>
    <marker id="b3-widen-ok" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#047857"/>
    </marker>
    <marker id="b3-widen-warn" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#D97706"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="20" y="20" fill="#0F172A" font-weight="bold">Tự động theo chiều mũi tên: kiểu hẹp → kiểu rộng</text>
    <g transform="translate(0,30)">
    <path d="M285,70 Q467,-10 650,70" fill="none" stroke="#047857" stroke-width="2" marker-end="url(#b3-widen-ok)"/>
    <text x="467" y="22" text-anchor="middle" fill="#047857" font-size="11">int → double: an toàn, double đủ chỗ cho mọi int</text>
    <path d="M418,70 Q523,22 628,70" fill="none" stroke="#D97706" stroke-dasharray="5 4" marker-end="url(#b3-widen-warn)"/>
    <rect x="20" y="72" width="86" height="40" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="63" y="89" text-anchor="middle" fill="#1D4ED8" font-family="monospace" font-size="13">byte</text>
    <text x="63" y="104" text-anchor="middle" fill="#64748B" font-size="11">8 bit</text>
    <rect x="136" y="72" width="86" height="40" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="179" y="89" text-anchor="middle" fill="#1D4ED8" font-family="monospace" font-size="13">short</text>
    <text x="179" y="104" text-anchor="middle" fill="#64748B" font-size="11">16 bit</text>
    <rect x="252" y="72" width="86" height="40" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="295" y="89" text-anchor="middle" fill="#1D4ED8" font-family="monospace" font-size="13">int</text>
    <text x="295" y="104" text-anchor="middle" fill="#64748B" font-size="11">32 bit</text>
    <rect x="368" y="72" width="86" height="40" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="411" y="89" text-anchor="middle" fill="#1D4ED8" font-family="monospace" font-size="13">long</text>
    <text x="411" y="104" text-anchor="middle" fill="#64748B" font-size="11">64 bit</text>
    <rect x="484" y="72" width="86" height="40" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="527" y="89" text-anchor="middle" fill="#047857" font-family="monospace" font-size="13">float</text>
    <text x="527" y="104" text-anchor="middle" fill="#64748B" font-size="11">32 bit</text>
    <rect x="600" y="72" width="86" height="40" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="643" y="89" text-anchor="middle" fill="#047857" font-family="monospace" font-size="13">double</text>
    <text x="643" y="104" text-anchor="middle" fill="#64748B" font-size="11">64 bit</text>
    <line x1="106" y1="92" x2="130" y2="92" stroke="#047857" stroke-width="2" marker-end="url(#b3-widen-ok)"/>
    <line x1="222" y1="92" x2="246" y2="92" stroke="#047857" stroke-width="2" marker-end="url(#b3-widen-ok)"/>
    <line x1="338" y1="92" x2="362" y2="92" stroke="#047857" stroke-width="2" marker-end="url(#b3-widen-ok)"/>
    <line x1="454" y1="92" x2="478" y2="92" stroke="#D97706" stroke-width="2" stroke-dasharray="4 3" marker-end="url(#b3-widen-warn)"/>
    <line x1="570" y1="92" x2="594" y2="92" stroke="#047857" stroke-width="2" marker-end="url(#b3-widen-ok)"/>
    <path d="M305,112 Q411,165 517,114" fill="none" stroke="#D97706" stroke-dasharray="5 4" marker-end="url(#b3-widen-warn)"/>
    <rect x="136" y="160" width="86" height="40" rx="6" fill="#FFFBEB" stroke="#D97706"/>
    <text x="179" y="177" text-anchor="middle" fill="#D97706" font-family="monospace" font-size="13">char</text>
    <text x="179" y="192" text-anchor="middle" fill="#64748B" font-size="11">16 bit</text>
    <line x1="222" y1="168" x2="268" y2="118" stroke="#047857" stroke-width="2" marker-end="url(#b3-widen-ok)"/>
    <line x1="400" y1="214" x2="430" y2="214" stroke="#047857" stroke-width="2"/>
    <text x="438" y="218" fill="#0F172A" font-size="11">an toàn tuyệt đối</text>
    <line x1="400" y1="232" x2="430" y2="232" stroke="#D97706" stroke-width="2" stroke-dasharray="4 3"/>
    <text x="438" y="236" fill="#0F172A" font-size="11">tự động nhưng có thể mất độ chính xác</text>
    </g>
  </g>
</svg>

Chú ý: `float` (32 bit) "rộng" hơn `long` (64 bit) vì nó chứa được số lớn hơn nhiều (≈ 10³⁸),
nhưng nó chỉ giữ được khoảng 6–7 chữ số chính xác. Vì vậy JLS ghi rõ ba hướng `int → float`,
`long → float`, `long → double` có thể **mất độ chính xác**, dù vẫn được làm tự động [6]. Ngược lại, `int → double` luôn chính xác: `double` giữ được 53 bit
phần định trị (*significand*), dư sức chứa mọi giá trị 32 bit của `int`.

```java
public class WideningDemo {
    public static void main(String[] args) {
        int dailyCount = 1_200;
        long total = dailyCount;          // int -> long: tự động, an toàn
        double average = total;           // long -> double: tự động
        System.out.println(total + " | " + average);

        char letter = 'A';
        int code = letter;                // char -> int: lấy mã Unicode
        System.out.println(letter + " có mã " + code);

        long accountNo = 123_456_789_123_456_789L;
        float asFloat = accountNo;        // long -> float: tự động nhưng MẤT chính xác
        long back = (long) asFloat;       // ép ngược để so sánh (phần 7)
        System.out.println("Gốc:      " + accountNo);
        System.out.println("Qua float: " + asFloat);
        System.out.println("Ép ngược: " + back);

        int big = 16_777_217;             // 2^24 + 1
        float f = big;                    // int -> float cũng có thể mất chính xác
        System.out.println(big + " -> " + f);
    }
}
```

**Kết quả khi chạy:**

```text
1200 | 1200.0
A có mã 65
Gốc:      123456789123456789
Qua float: 1.2345679E17
Ép ngược: 123456790519087104
16777217 -> 1.6777216E7
```

**Giải thích từng bước.**

1. `long total = dailyCount;` đổ `int` sang `long`. Giá trị giữ nguyên 1200.
2. `double average = total;` đổ sang `double`, in ra `1200.0` (có phần thập phân).
3. `int code = letter;` cho thấy `char` thực ra là một **mã số**: `'A'` có mã 65.
4. `float asFloat = accountNo;` không báo lỗi, nhưng `float` chỉ giữ ~7 chữ số đầu. Ép ngược lại
   ra `123456790519087104`, sai khác hẳn số gốc. Ký hiệu `E17` nghĩa là "× 10¹⁷".
5. `16_777_217` (2²⁴ + 1) là số nguyên dương nhỏ nhất mà `float` không biểu diễn chính xác được, nên thành `16777216`.

### ⚠️ Lỗi hay gặp

**Tin rằng "tự động" nghĩa là "luôn đúng".** Với số tài khoản, mã giao dịch hay số tiền lớn, đừng
bao giờ cho đi qua `float`/`double`. Hãy giữ ở `long` (hoặc `String` cho số tài khoản, vì không ai cộng trừ số tài khoản).

**Nghĩ rằng `byte → char` hay `short → char` là mở rộng.** Không phải: `char` không có số âm, nên
`byte`/`short` không tự đổ sang `char` được. Hướng duy nhất từ `char` là đi lên `int` trở lên [6].

---

## 7. Ép kiểu thu hẹp (narrowing): phải tự viết

**Ý tưởng nôm na.** Đổ xô to sang cốc nhỏ: nước có thể tràn ra ngoài. Java không tự làm việc rủi ro
này. Bạn phải ký xác nhận bằng cách viết **toán tử ép kiểu** (*cast operator*) `(kiểu)` trước giá trị,
gọi là **ép kiểu thu hẹp** (*narrowing primitive conversion*) [6]. Giống ký vào phiếu "tôi chấp nhận rủi ro".

Java xử lý thu hẹp theo quy tắc cố định:

- **Số thực → `int`/`long`:** bỏ phần thập phân, **cắt về phía 0**, không làm tròn. Quá lớn thì kẹp về
  `MAX_VALUE`, âm quá mức thì kẹp về `MIN_VALUE`. `NaN` (*Not a Number*, "không phải số", ví dụ kết quả của
  `0.0 / 0.0`) thành `0`.
- **Số thực → `byte`/`short`/`char`:** làm hai bước: đổi sang `int` theo quy tắc trên, **rồi** cắt bit như
  dòng dưới. Vì vậy `(byte) 1e20` ra `-1` và `(byte) 1000.0` ra `-24`.
- **Số nguyên → số nguyên nhỏ hơn:** chỉ giữ lại các bit thấp, **vứt các bit cao**. Kết quả có thể đổi cả dấu.

<svg viewBox="0 0 720 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ép int 300 sang byte. 300 ở dạng 32 bit là 00000000 00000000 00000001 00101100. Ba nhóm 8 bit cao gồm 24 bit bị cắt bỏ. Byte chỉ giữ 8 bit thấp 00101100, bằng 44. Vì 300 bằng 256 cộng 44, bit mang giá trị 256 bị mất nên còn 44.">
  <defs>
    <marker id="b3-narrow-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#047857"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="20" y="22" fill="#0F172A" font-weight="bold">(byte) 300: chỉ giữ 8 bit thấp</text>
    <text x="20" y="73" fill="#0F172A" font-family="monospace">int 300</text>
    <rect x="120" y="50" width="130" height="36" rx="4" fill="#FEF2F2" stroke="#DC2626" stroke-dasharray="4 3"/>
    <text x="185" y="73" text-anchor="middle" fill="#64748B" font-family="monospace" font-size="14">00000000</text>
    <rect x="260" y="50" width="130" height="36" rx="4" fill="#FEF2F2" stroke="#DC2626" stroke-dasharray="4 3"/>
    <text x="325" y="73" text-anchor="middle" fill="#64748B" font-family="monospace" font-size="14">00000000</text>
    <rect x="400" y="50" width="130" height="36" rx="4" fill="#FEF2F2" stroke="#DC2626" stroke-dasharray="4 3"/>
    <text x="465" y="73" text-anchor="middle" fill="#DC2626" font-family="monospace" font-size="14">00000001</text>
    <rect x="540" y="50" width="130" height="36" rx="4" fill="#ECFDF5" stroke="#10B981"/>
    <text x="605" y="73" text-anchor="middle" fill="#047857" font-family="monospace" font-size="14">00101100</text>
    <text x="325" y="106" text-anchor="middle" fill="#DC2626" font-size="11">24 bit cao: bị cắt bỏ (chứa bit giá trị 256)</text>
    <text x="605" y="106" text-anchor="middle" fill="#047857" font-size="11">8 bit thấp: giữ lại</text>
    <line x1="605" y1="112" x2="605" y2="128" stroke="#047857" stroke-width="2" marker-end="url(#b3-narrow-arrow)"/>
    <text x="20" y="155" fill="#0F172A" font-family="monospace">(byte) 300</text>
    <rect x="540" y="132" width="130" height="36" rx="4" fill="#ECFDF5" stroke="#10B981"/>
    <text x="605" y="155" text-anchor="middle" fill="#047857" font-family="monospace" font-size="14">00101100</text>
    <text x="605" y="190" text-anchor="middle" fill="#047857" font-weight="bold">= 44</text>
    <text x="20" y="190" fill="#64748B" font-size="11">300 = 256 + 44 → mất phần 256, chỉ còn 44</text>
  </g>
</svg>

```java
public class NarrowingDemo {
    public static void main(String[] args) {
        double interest = 9.99;
        int whole = (int) interest;       // bỏ phần thập phân, KHÔNG làm tròn
        int negative = (int) -9.99;       // cắt về phía 0
        System.out.println(whole + " | " + negative);

        int code = 300;
        byte small = (byte) code;         // chỉ giữ 8 bit thấp
        System.out.println("(byte) 300 = " + small);

        long hugeBalance = 3_000_000_000L;
        int truncated = (int) hugeBalance; // vượt khoảng int
        System.out.println("(int) 3 tỷ = " + truncated);

        // double -> int/long: quá lớn/quá nhỏ thì kẹp về MAX/MIN, NaN thành 0
        System.out.println((int) 1e20 + " | " + (int) -1e20 + " | " + (int) Double.NaN);
        // double -> byte: đổi sang int trước, rồi mới cắt bit
        System.out.println((byte) 1e20 + " | " + (byte) 1000.0);
    }
}
```

**Kết quả khi chạy:**

```text
9 | -9
(byte) 300 = 44
(int) 3 tỷ = -1294967296
2147483647 | -2147483648 | 0
-1 | -24
```

**Giải thích từng bước.**

1. `(int) 9.99` cho `9`, không phải `10`. `(int) -9.99` cho `-9` (cắt về phía 0), không phải `-10`.
2. `(byte) 300`: 300 cần 9 bit, `byte` chỉ có 8. Bit thứ 9 (giá trị 256) bị vứt, còn `44` (xem hình).
3. `(int) 3_000_000_000L`: số dư 3 tỷ đồng bị cắt còn 32 bit thấp, và bit cao nhất còn lại là 1 nên
   kết quả thành **số âm**. Một tài khoản 3 tỷ biến thành âm 1,29 tỷ.
4. `1e20` nghĩa là 10²⁰. `(int) 1e20` quá lớn nên kẹp về `Integer.MAX_VALUE`, `(int) -1e20` kẹp về
   `Integer.MIN_VALUE`, còn `(int) Double.NaN` ra `0` [6].
5. `(byte) 1e20`: bước 1 kẹp về `int` `2_147_483_647`, có 8 bit thấp là `11111111`; bước 2 giữ 8 bit đó,
   ra `-1`. `(byte) 1000.0`: bước 1 ra `int` 1000 (`1111101000`), bước 2 giữ `11101000` = 232 − 256 = `-24`.

### Tràn số: khi phép tính vượt khoảng

**Ý tưởng nôm na.** Mỗi kiểu số nguyên có một giới hạn cố định, vượt qua là "vòng" sang đầu bên kia. Với `int`, sau `2_147_483_647` là `-2_147_483_648`. Hiện tượng này là **tràn số**
(*overflow*). Java **không báo lỗi**, kết quả sai một cách âm thầm.

<svg viewBox="0 0 720 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Số dư 2 tỷ đồng cộng thêm 500 triệu. Lưu bằng int: kết quả -1_794_967_296, sai vì vượt MAX_VALUE khoảng 2,147 tỷ nên vòng sang âm. Lưu bằng long: kết quả 2_500_000_000, đúng vì long chứa được tới khoảng 9,2 tỷ tỷ.">
  <g font-family="sans-serif" font-size="12">
    <text x="20" y="22" fill="#0F172A" font-weight="bold">Số dư 2 tỷ đồng + nhận 500 triệu</text>
    <rect x="20" y="36" width="330" height="80" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="36" y="60" fill="#0F172A" font-family="monospace">int balance</text>
    <text x="36" y="84" fill="#DC2626" font-family="monospace" font-size="14">= -1_794_967_296  (sai)</text>
    <text x="36" y="104" fill="#64748B" font-size="11">vượt MAX_VALUE ≈ 2,147 tỷ nên vòng sang âm</text>
    <rect x="370" y="36" width="330" height="80" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="386" y="60" fill="#0F172A" font-family="monospace">long balance</text>
    <text x="386" y="84" fill="#047857" font-family="monospace" font-size="14">= 2_500_000_000  (đúng)</text>
    <text x="386" y="104" fill="#64748B" font-size="11">long chứa được tới ≈ 9,2 tỷ tỷ</text>
  </g>
</svg>

```java
public class OverflowDemo {
    public static void main(String[] args) {
        int max = Integer.MAX_VALUE;           // 2_147_483_647
        int next = max + 1;                    // tràn số: vòng sang âm
        System.out.println(max + " + 1 = " + next);

        // Số dư 2 tỷ đồng, nhận thêm 500 triệu
        int balanceInt = 2_000_000_000;
        balanceInt = balanceInt + 500_000_000;
        System.out.println("Dùng int:  " + balanceInt);

        long balanceLong = 2_000_000_000L;
        balanceLong = balanceLong + 500_000_000;
        System.out.println("Dùng long: " + balanceLong);
    }
}
```

**Kết quả khi chạy:**

```text
2147483647 + 1 = -2147483648
Dùng int:  -1794967296
Dùng long: 2500000000
```

**Giải thích từng bước.**

1. `max + 1` vượt `Integer.MAX_VALUE`, vòng sang `Integer.MIN_VALUE`. Không có lỗi nào.
2. Số dư `int` 2 tỷ + 500 triệu = 2,5 tỷ, vượt ≈ 2,147 tỷ, nên ra số âm. Một khách hàng doanh nghiệp
   có 2,5 tỷ đồng trong tài khoản là chuyện bình thường, nên **đừng bao giờ lưu số tiền (đồng) bằng `int`**.
3. Cùng phép tính với `long` cho kết quả đúng, vì `long` chứa được tới ≈ 9,2 tỷ tỷ.
4. Muốn chương trình báo lỗi ngay thay vì âm thầm ghi sai số dư, Java có `Math.addExact` [13];
   chi tiết ở [Bài 4](/docs/learning/chang-1/chuoi-va-phep-toan).

### Nâng kiểu khi tính toán: `byte + byte` ra `int`

**Ý tưởng nôm na.** Trước khi tính, Java đưa các số "nhỏ" (`byte`, `short`, `char`) lên bàn tính
cỡ `int`. Gọi là **nâng kiểu số** (*numeric promotion*) [6]. Nên `byte + byte` cho ra `int`, và bạn
không gán thẳng kết quả về `byte` được.

```java
public class PromotionDemo {
    public static void main(String[] args) {
        byte a = 10;
        byte b = 20;
        int sum = a + b;                 // cách 1: nhận kết quả bằng int
        byte sum2 = (byte) (a + b);      // cách 2: ép tường minh (bạn chịu trách nhiệm)
        a += 5;                          // += tự ép ngầm về byte
        System.out.println(sum + " " + sum2 + " " + a);

        char grade = 'A';
        System.out.println(grade + 1);           // char + int = int
        System.out.println((char) (grade + 1));  // ép lại thành char
        char next = 'A' + 1;                     // hằng số: compiler cho phép
        System.out.println(next);
        System.out.println('1' + '2');           // cộng MÃ ký tự, không phải nối chuỗi
    }
}
```

**Kết quả khi chạy:**

```text
30 30 15
66
B
B
99
```

**Giải thích từng bước.**

1. `a + b`: cả hai được nâng lên `int` rồi mới cộng. Kết quả `30` kiểu `int`.
2. `(byte) (a + b)`: ép cả biểu thức về `byte`. Nhớ ngoặc quanh `a + b`, nếu không thì chỉ `a` bị ép.
3. `a += 5;` là **phép gán kết hợp** (*compound assignment*), cách viết tắt của "cộng 5 vào `a`"
   (bài 4 học kỹ các toán tử). Với `byte`, Java hiểu nó là `a = (byte) (a + 5)` [6], nên không lỗi. Nhưng
   nó cũng tự cắt bit như phần trên nếu tràn, vì vậy hãy cẩn thận.
4. `grade + 1`: `'A'` (mã 65) được nâng lên `int`, cộng 1 ra `66`. Muốn ra chữ `B` thì ép lại `(char)`.
5. `char next = 'A' + 1;` được phép vì vế phải là **hằng số** compiler tính được ngay (66) và nó vừa với `char`.
6. `'1' + '2'` ra `99`: mã của `'1'` là 49, của `'2'` là 50. Đây không phải nối chữ thành `"12"`.

### ⚠️ Lỗi hay gặp

**Lỗi 1: gán `byte + byte` về `byte`.**

```java
byte a = 10;
byte b = 20;
byte sum = a + b;
```

```text
BytePromotion.java:5: error: incompatible types: possible lossy conversion from int to byte
        byte sum = a + b;
                     ^
1 error
```

✅ Cách sửa: dùng `int sum = a + b;`. Thực tế, bạn hiếm khi cần `byte`/`short` cho phép tính; cứ dùng `int`/`long`.

**Lỗi 2: tưởng `(int)` làm tròn.** `(int) 9.99` là `9`. Muốn làm tròn thì dùng `Math.round(9.99)` (ra `10`, kiểu `long`); bài 4 sẽ học các hàm của `Math`.

**Lỗi 3: ép kiểu để "chữa cháy" lỗi biên dịch.** Thấy `possible lossy conversion` rồi thêm `(int)` cho
hết lỗi là thói quen nguy hiểm: bạn vừa tắt cảnh báo của compiler. Hãy tự hỏi giá trị có chắc nằm
trong khoảng của kiểu đích không. Nếu không chắc, dùng kiểu rộng hơn.

---

## Tóm tắt

- Biến là hộp có **tên** và **kiểu**. Biến cục bộ phải được gán trước khi đọc, nếu không javac báo `might not have been initialized`.
- Java có 8 kiểu nguyên thủy: `byte`, `short`, `int`, `long` (số nguyên), `float`, `double` (số thực), `char` (ký tự 16 bit), `boolean`.
- Literal số nguyên mặc định là `int`, số thực mặc định là `double`. Dùng `L`, `f` và `_` cho đúng.
- Biến nguyên thủy chứa **giá trị**; biến tham chiếu (`String`, mảng) chứa **mũi tên** tới object, có thể là `null`.
- `var` để compiler suy kiểu một lần rồi chốt; `final` chỉ cho gán một lần.
- Phạm vi biến cục bộ là từ dòng khai báo tới `}` đóng block. Không khai báo trùng tên trong block lồng nhau.
- Mở rộng (`int → long`) là tự động; `int/long → float` và `long → double` có thể mất độ chính xác.
  Thu hẹp phải viết `(kiểu)` và có thể mất dữ liệu: `(byte) 300 == 44`, `(int) -9.99 == -9`.
- Số nguyên tràn thì vòng sang đầu kia mà không báo lỗi. Lưu tiền (đồng) bằng `long`, không bằng `int`; bài 4 sẽ học `BigDecimal`.

## Tự kiểm tra

1. Đoạn sau trong `main` có biên dịch được không? `int x; System.out.println(x);`

<details><summary>Đáp án</summary>

Không. `x` là biến cục bộ chưa được gán, javac báo `variable x might not have been initialized`.
Chỉ field mới có giá trị mặc định (`0`).

</details>

2. Vì sao `long total = 9_000_000_000;` lỗi dù `long` chứa được số này?

<details><summary>Đáp án</summary>

Vì literal `9_000_000_000` không có hậu tố nên có kiểu `int`, mà số này vượt khoảng `int`
(≈ 2,1 tỷ). javac báo `integer number too large`. Sửa: `9_000_000_000L`.

</details>

3. `(int) -7.8` và `(byte) 200` cho ra bao nhiêu?

<details><summary>Đáp án</summary>

`(int) -7.8` là `-7` (cắt về phía 0). `(byte) 200` là `-56`: giữ 8 bit thấp `11001000`, mà
với `byte` bit cao nhất bằng 1 nghĩa là số âm, 200 − 256 = −56.

</details>

4. Sau `long[] x = {5, 6}; long[] y = x; y[1] = 0;` thì `x[1]` bằng bao nhiêu? Vì sao?

<details><summary>Đáp án</summary>

`0`. `y = x` chép mũi tên chứ không chép mảng, nên `x` và `y` cùng trỏ một mảng.

</details>

5. `byte a = 1, b = 2; byte c = a + b;` lỗi gì? Nêu hai cách sửa.

<details><summary>Đáp án</summary>

`incompatible types: possible lossy conversion from int to byte`, vì `a + b` được nâng lên `int`.
Sửa: `int c = a + b;` hoặc `byte c = (byte) (a + b);`.

</details>

6. `var amount;` có hợp lệ không?

<details><summary>Đáp án</summary>

Không. `var` cần vế phải để suy kiểu: `cannot use 'var' on variable without initializer`.

</details>

## Bài tập

**Bài 1 (dễ): Hồ sơ tài khoản.** Viết class `AccountProfile` khai báo các biến: tên chủ tài khoản,
số dư (đồng), lãi suất năm (ví dụ 5,5%), trạng thái hoạt động, hạng khách hàng (`'A'`, `'B'`...),
số lần giao dịch trong tháng. Chọn kiểu phù hợp cho từng biến rồi in ra.

> 💡 Gợi ý: số dư → `long`; lãi suất → `double`; trạng thái → `boolean`; hạng → `char`. Số tài khoản
> (nếu có) nên là `String`, vì nó có thể bắt đầu bằng số 0 và không ai cộng trừ số tài khoản.

**Bài 2 (vừa): Bắt lỗi tràn số.** Một khách gửi 3 khoản tiết kiệm, mỗi khoản 1,5 tỷ đồng. Tính tổng
bằng `int`, rồi bằng `long`, in cả hai. Sau đó thay phép cộng `int` bằng `Math.addExact` và quan sát.

> 💡 Gợi ý: tổng đúng là `4500000000`. Bản `int` sẽ in ra `205032704`. Với `long`, nhớ hậu tố `L`
> ở ít nhất một toán hạng, ví dụ `1_500_000_000L * 3`.

**Bài 3 (khó): Thám tử bit.** Viết chương trình in `Byte.MIN_VALUE`, `Byte.MAX_VALUE`,
`Short.MIN_VALUE`, `Short.MAX_VALUE`, rồi in `(byte) 128`, `(byte) 255`, `(byte) 256`, `(byte) -129`.
Dự đoán kết quả **trước khi chạy** và giải thích bằng quy tắc "giữ 8 bit thấp".

> 💡 Gợi ý: kết quả lần lượt là `-128 127 -32768 32767` và `-128 -1 0 127`. Mẹo tính nhanh: cộng
> hoặc trừ 256 cho tới khi số rơi vào khoảng `-128..127`.

## Đọc thêm

1. JLS (Java SE 21), §4.2 *Primitive Types and Values*. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.2>
2. JLS, §4.12 *Variables* (§4.12.5 giá trị mặc định). <https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.12>
3. JLS, Chapter 16 *Definite Assignment*. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-16.html>
4. JLS, §6.3 *Scope of a Declaration* và §6.4 *Shadowing and Obscuring*. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-6.html#jls-6.3>
5. JLS, §14.4 *Local Variable Declarations*; JEP 286 *Local-Variable Type Inference*. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html#jls-14.4> · <https://openjdk.org/jeps/286>
6. JLS, Chapter 5 *Conversions and Contexts* (§5.1.2 widening, §5.1.3 narrowing, §5.6 numeric promotion); §15.26.2 *Compound Assignment Operators*. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-5.html>
7. Oracle Java Tutorials, *Primitive Data Types*. <https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html>
8. dev.java, *Primitive Types*. <https://dev.java/learn/language-basics/primitive-types/>
9. dev.java, *Creating Variables and Naming Them*. <https://dev.java/learn/language-basics/variables/>
10. Jakob Jenkov, *Java Variables* (tài liệu roadmap.sh gợi ý cho Data Types, Variables and Scopes). <https://jenkov.com/tutorials/java/variables.html>
11. Jakob Jenkov, *Java Data Types*. <https://jenkov.com/tutorials/java/data-types.html>
12. OpenJDK, *Local Variable Type Inference: Style Guidelines*. <https://openjdk.org/projects/amber/guides/lvti-style-guide>
13. Java SE 21 API, `java.lang.Math` (`addExact`). <https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Math.html#addExact(int,int)>
14. Simplilearn, *Type Casting in Java* (tài liệu roadmap.sh gợi ý cho Type Casting). <https://www.simplilearn.com/tutorials/java-tutorial/type-casting-in-java>
15. roadmap.sh, *Java Developer Roadmap*. <https://roadmap.sh/java>

**Bài tiếp theo:** [Bài 4 · Chuỗi và phép toán](/docs/learning/chang-1/chuoi-va-phep-toan)
