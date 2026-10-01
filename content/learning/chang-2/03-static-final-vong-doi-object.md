---
title: "Bài 3 · static, final và vòng đời object"
description: "Cái gì thuộc về cả class, cái gì thuộc về từng object, cái gì bị khoá sau khi gán, code khởi tạo chạy theo thứ tự nào, và object đi đâu khi không còn ai dùng."
order: 23
tags: [java, chặng-2, oop, static, final, initializer-block, garbage-collection]
language: vi
profile: onward-java-course
classification: public-safe
source_repo: none
source_refs:
  - "https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html"
  - "https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.3.1.1"
  - "https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.3.2"
  - "https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Formatter.html"
  - "https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.12.4"
  - "https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.3.1.2"
  - "https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.3.3"
  - "https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.1.2"
  - "https://docs.oracle.com/javase/tutorial/java/javaOO/initial.html"
  - "https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.6"
  - "https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.7"
  - "https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.4.1"
  - "https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.4.2"
  - "https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.5"
  - "https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.3.3"
  - "https://docs.oracle.com/javase/tutorial/java/javaOO/usingobject.html"
  - "https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.6"
  - "https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/System.html#gc()"
  - "https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/ref/WeakReference.html"
  - "https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/ref/Reference.html#get()"
  - "https://openjdk.org/jeps/421"
  - "https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/ref/Cleaner.html"
  - "https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html#finalize()"
  - "https://roadmap.sh/java"
  - "https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-2.html#jvms-2.9.2"
  - "https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.12.5"
verified_with: "openjdk 21.0.9"
verification: ran-locally
verification_note: "Đã chạy 19 chương trình (16 ví dụ trong bài + 3 câu Tự kiểm tra) bằng JDK 21.0.9: java File.java cho ví dụ chạy được, javac -d out File.java cho ví dụ lỗi biên dịch; output dán nguyên văn (ExceptionInInitializerError rút gọn các dòng at java.base). Kết quả GC ở phần 5 phụ thuộc JVM (System.gc() chỉ là gợi ý), đã chạy 5 lần cho cùng kết quả. Chưa chạy trên JDK 25."
contract_version: 1
---

# Bài 3 · static, final và vòng đời object

> 🎯 **Sau bài này bạn sẽ:**
>
> 1. Viết được field và method `static` để đếm số tài khoản và sinh mã `ACC-001`, và chỉ ra được vì sao method `static` không đọc trực tiếp được field của object.
> 2. Đặt đúng `final` cho biến, field, tham số và hằng `static final`, và giải thích được vì sao một tham chiếu `final` không làm object bên trong bất biến.
> 3. Viết được static block và instance block, rồi dự đoán đúng thứ tự in log khi class được khởi tạo và khi gọi `new`.
> 4. Mô tả được bốn chặng vòng đời của một object (tạo, dùng, không còn ai trỏ tới, GC thu hồi) và giải thích được vì sao không dùng `finalize()`.

## Tình huống

Bạn nộp class `Account` để review. Người review để lại ba bình luận: "Mã tài khoản phải tự tăng `ACC-001`, `ACC-002`..."; "Mã đã cấp thì không ai được sửa"; "Biểu phí chỉ nạp một lần, đừng nạp lại mỗi lần `new`". Bạn thử thêm `static` vào `balance` cho nhanh, và thế là nạp tiền cho An thì số dư của Bình cũng tăng theo. Bài này giúp bạn sửa cả ba bình luận một cách có lý do, không phải đoán. Nó phủ bốn topic của
roadmap.sh Java: *Static Keyword*, *Final Keyword*, *Initializer Block* và *Object Lifecycle* [24].

**Cần biết trước:**
[Chặng 1 · Bài 6 · Nhập môn OOP](/docs/learning/chang-1/nhap-mon-oop) (class, object, constructor, `this`, heap/stack, `static` mức giới thiệu),
[Chặng 1 · Bài 3 · Kiểu dữ liệu, biến và ép kiểu](/docs/learning/chang-1/kieu-du-lieu-bien-ep-kieu) (`final` cho biến cục bộ),
[Chặng 1 · Bài 2 · Vòng đời chương trình](/docs/learning/chang-1/vong-doi-chuong-trinh) (class loader, Garbage Collector),
[Chặng 2 · Bài 2 · Đóng gói và method](/docs/learning/chang-2/dong-goi-va-method) (field `private`, getter, `deposit`).

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| `static` (thuộc class) | Chỉ có một bản cho cả class, không nằm trong từng object | `static int openedCount;` |
| Class variable / instance variable | Field `static` (một bản chung) / field thường (mỗi object một bản) | `openedCount` / `owner` |
| Static context (ngữ cảnh static) | Đoạn code không gắn với object nào, nên không có `this` | thân một method `static` |
| `final` | Gán đúng một lần rồi khoá lại | `final long amount` |
| Blank final | Field `final` chưa gán lúc khai báo, phải gán trong constructor | `private final String id;` |
| Hằng `static final` | Giá trị chung, không đổi, tên viết HOA | `MIN_DEPOSIT = 10_000` |
| Static block | Khối `static { ... }`, chạy một lần khi class được khởi tạo | nạp biểu phí |
| Instance block | Khối `{ ... }`, chạy mỗi lần `new`, trước thân constructor | cấp mã tài khoản |
| Reachable / unreachable | Còn / không còn đường tham chiếu nào dẫn tới object | `an = null;` |
| Garbage Collector (GC) | Bộ phận của JVM tự thu hồi object không còn ai dùng | `System.gc()` chỉ là gợi ý |

💡 **Về tiền trong bài này.** Các ví dụ dùng `long` với đơn vị **đồng**, như Chặng 1 Bài 6: tiền VND
không có đơn vị nhỏ hơn đồng, và bài này chỉ cộng, so sánh. Khi cần nhân với lãi suất, hãy quay lại
`BigDecimal` như ở [Chặng 1 · Bài 7](/docs/learning/chang-1/checkpoint-lai-kep).

## 1. `static`: thứ dùng chung cho cả class

**Ý tưởng nôm na.** Ở sảnh ngân hàng có **một** máy cấp số thứ tự cho cả chi nhánh. Mỗi khách rút
một **phiếu riêng** in số của mình. Máy cấp số giống **field và method `static`**: chỉ có một, thuộc
về chi nhánh. Phiếu trong tay khách giống **field instance**: mỗi người một tờ. Nhân viên quầy đang
phục vụ một khách thì nhìn được cả phiếu của khách lẫn máy chung. Còn cái máy thì không biết ai đang
đứng trước nó, nếu không có ai đưa phiếu cho nó xem.

Nói chính xác: field `static` còn gọi là **class variable** (biến của class). Nó có **đúng một bản**,
dù bạn tạo bao nhiêu object, kể cả không tạo object nào [2]. Field không có `static` là **instance
variable**: mỗi object mới có một bản riêng [2]. Method `static` còn gọi là **class method**: nó được
gọi mà không gắn với object nào, thường gọi qua tên class [3][1]. Thân của nó là một **static context**
(ngữ cảnh static): ở đó không có `this`, nên không thể đọc trực tiếp field hay gọi trực tiếp method
instance [3][1].

<svg viewBox="0 0 720 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ai gọi trực tiếp được ai. Bên trái là vùng static của class Account, chỉ có một bản: field openedCount bằng 3 và các method static getOpenedCount, peekNextId, formatId, gọi qua tên class như Account.getOpenedCount(). Bên phải là ba object an, binh, chi, mỗi object có bản riêng của id và owner (ACC-001 An, ACC-002 Bình, ACC-003 Chi) và method instance describe. Mũi tên xanh từ object an và object chi sang vùng static: method instance đọc được static. Mũi tên đỏ từ vùng static đi ra dừng ở một dấu hỏi: method static không có this nên không biết đọc field của object nào.">
  <defs>
    <marker id="c2b3-static-ok" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#047857"/>
    </marker>
    <marker id="c2b3-static-no" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="155" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#D97706">static: thuộc class (MỘT bản)</text>
    <text x="590" y="24" text-anchor="middle" font-size="13" font-weight="bold" fill="#1D4ED8">instance: thuộc từng object</text>
    <rect x="10" y="36" width="290" height="284" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="155" y="60" text-anchor="middle" font-weight="bold" fill="#0F172A">class Account</text>
    <g font-family="monospace" fill="#0F172A">
      <text x="26" y="92">openedCount = 3</text>
      <text x="26" y="122">getOpenedCount()</text>
      <text x="26" y="152">peekNextId()</text>
      <text x="26" y="182">formatId(int)</text>
    </g>
    <line x1="26" y1="200" x2="284" y2="200" stroke="#D97706" stroke-dasharray="4 3"/>
    <text x="26" y="224" fill="#64748B">Gọi qua tên class:</text>
    <text x="26" y="246" font-family="monospace" fill="#0F172A">Account.getOpenedCount()</text>
    <text x="26" y="278" fill="#DC2626">Không có this: không biết</text>
    <text x="26" y="298" fill="#DC2626">đang làm việc với object nào</text>
    <rect x="470" y="36" width="240" height="88" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <rect x="470" y="36" width="240" height="26" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="590" y="54" text-anchor="middle" font-family="monospace" fill="#1D4ED8">an : Account</text>
    <text x="484" y="80" font-family="monospace" fill="#0F172A">id = "ACC-001"</text>
    <text x="484" y="98" font-family="monospace" fill="#0F172A">owner = "An"</text>
    <text x="484" y="116" font-family="monospace" fill="#047857">describe()</text>
    <rect x="470" y="134" width="240" height="88" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <rect x="470" y="134" width="240" height="26" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="590" y="152" text-anchor="middle" font-family="monospace" fill="#1D4ED8">binh : Account</text>
    <text x="484" y="178" font-family="monospace" fill="#0F172A">id = "ACC-002"</text>
    <text x="484" y="196" font-family="monospace" fill="#0F172A">owner = "Bình"</text>
    <text x="484" y="214" font-family="monospace" fill="#047857">describe()</text>
    <rect x="470" y="232" width="240" height="88" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <rect x="470" y="232" width="240" height="26" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="590" y="250" text-anchor="middle" font-family="monospace" fill="#1D4ED8">chi : Account</text>
    <text x="484" y="276" font-family="monospace" fill="#0F172A">id = "ACC-003"</text>
    <text x="484" y="294" font-family="monospace" fill="#0F172A">owner = "Chi"</text>
    <text x="484" y="312" font-family="monospace" fill="#047857">describe()</text>
    <line x1="468" y1="80" x2="306" y2="98" stroke="#047857" stroke-width="2" marker-end="url(#c2b3-static-ok)"/>
    <text x="385" y="74" text-anchor="middle" fill="#047857">✓ đọc được static</text>
    <line x1="468" y1="276" x2="306" y2="240" stroke="#047857" stroke-width="2" marker-end="url(#c2b3-static-ok)"/>
    <text x="385" y="284" text-anchor="middle" fill="#047857">✓ đọc được static</text>
    <line x1="304" y1="176" x2="404" y2="176" stroke="#DC2626" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#c2b3-static-no)"/>
    <text x="370" y="162" text-anchor="middle" fill="#DC2626">✗ static đọc instance</text>
    <text x="370" y="200" text-anchor="middle" fill="#DC2626">của object nào?</text>
    <text x="436" y="184" text-anchor="middle" font-size="24" font-weight="bold" fill="#DC2626">?</text>
  </g>
</svg>

Ví dụ sau dùng bộ đếm `static` để vừa đếm số tài khoản, vừa sinh mã `ACC-001`, `ACC-002`... Lưu thành
file `StaticCounter.java` rồi chạy `java StaticCounter.java`:

```java
public class StaticCounter {
    public static void main(String[] args) {
        // Gọi method static qua TÊN CLASS: chưa cần object nào
        System.out.println("Đã mở: " + Account.getOpenedCount());
        System.out.println("Mã kế tiếp: " + Account.peekNextId());

        Account an = new Account("An");
        Account binh = new Account("Bình");
        Account chi = new Account("Chi");

        System.out.println(an.describe());
        System.out.println(binh.describe());
        System.out.println(chi.describe());
        System.out.println("Đã mở: " + Account.getOpenedCount());
    }
}

class Account {
    private static int openedCount = 0;  // static: MỘT bản cho cả class

    private String id;                   // instance: mỗi object một bản
    private String owner;

    Account(String owner) {
        openedCount++;                   // tăng bộ đếm chung
        this.id = formatId(openedCount); // lấy số đếm làm mã riêng
        this.owner = owner;
    }

    static int getOpenedCount() { return openedCount; }   // static đọc static: được

    static String peekNextId() { return formatId(openedCount + 1); }

    // static "tiện ích": chỉ biến số thành mã, không cần object
    private static String formatId(int number) {
        return String.format("ACC-%03d", number);
    }

    String describe() {
        // instance đọc được cả field của mình lẫn field static
        return id + " | " + owner + " | tổng số tài khoản: " + openedCount;
    }
}
```

**Kết quả khi chạy:**

```text
Đã mở: 0
Mã kế tiếp: ACC-001
ACC-001 | An | tổng số tài khoản: 3
ACC-002 | Bình | tổng số tài khoản: 3
ACC-003 | Chi | tổng số tài khoản: 3
Đã mở: 3
```

**Giải thích từng bước:**

1. Dòng đầu của `main` gọi `Account.getOpenedCount()` qua **tên class**, lúc chưa có object nào. Bộ
   đếm đang là `0`. `peekNextId()` cũng là method `static`, và nó gọi tiếp `formatId(...)` cũng
   `static`: static gọi static thì thoải mái [1].
2. `String.format("ACC-%03d", number)` giống `printf` ở Chặng 1 Bài 1, chỉ khác là **trả về chuỗi**
   thay vì in ra. `%03d` nghĩa là: số nguyên, rộng 3 ký tự, thiếu thì đệm số `0` bên trái [4]. Số `1`
   thành `"001"`.
3. Mỗi lần `new Account(...)`, constructor tăng `openedCount` **chung** rồi lấy chính số đó làm `id`
   **riêng** của object. Ba lần `new` cho ra `ACC-001`, `ACC-002`, `ACC-003`.
4. `describe()` là method instance. Nó đọc `id`, `owner` của chính object, và đọc luôn `openedCount`
   dùng chung [1]. Cả ba object đều in `3`, vì cả ba cùng nhìn **một** bộ đếm.
5. `formatId` là `private static`: một "hàm tiện ích" chỉ biến số thành mã, không cần biết object nào.
   `private` giữ nó là chuyện nội bộ của `Account`.

Bảng dưới tóm tắt "ai gọi trực tiếp được ai" (không cần ghi `tênObject.` phía trước) [1][3]:

| Đang đứng trong... | Field/method `static` | Field/method instance |
|---|---|---|
| Method instance (có `this`) | ✓ được | ✓ được (của chính object đó) |
| Method `static` (không có `this`) | ✓ được | ✗ không, phải có object: `an.describe()` |

### ⚠️ Lỗi hay gặp

**Lỗi 1: dùng `this` trong method `static`.** Lưu thành file `StaticThis.java` rồi chạy
`javac StaticThis.java`:

```java
class Account {
    private String owner = "An";

    static String ownerName() {
        return this.owner;   // static không có "this"
    }
}
```

```text
StaticThis.java:5: error: non-static variable this cannot be referenced from a static context
        return this.owner;   // static không có "this"
               ^
1 error
```

Method `static` chạy mà không có object hiện tại, nên `this` không trỏ vào đâu cả [3]. **Cách sửa:**
bỏ `static` để nó thành method của từng object, hoặc nhận object qua tham số:
`static String ownerName(Account account)`.

**Lỗi 2: thêm `static` vào dữ liệu lẽ ra của từng object.** Đây chính là bug trong phần Tình huống.
Lưu thành `SharedBalance.java` rồi chạy `java SharedBalance.java`:

```java
public class SharedBalance {
    public static void main(String[] args) {
        Account an = new Account("An");
        Account binh = new Account("Bình");

        an.deposit(500_000);     // chỉ nạp cho An
        binh.deposit(200_000);   // chỉ nạp cho Bình

        System.out.println(an.owner + ": " + an.getBalance());
        System.out.println(binh.owner + ": " + binh.getBalance());
    }
}

class Account {
    String owner;
    static long balance;         // SAI: số dư bị dùng chung cho mọi tài khoản

    Account(String owner) {
        this.owner = owner;
    }

    void deposit(long amount) {
        balance += amount;
    }

    long getBalance() {
        return balance;
    }
}
```

```text
An: 700000
Bình: 700000
```

Chỉ có **một** `balance` cho cả class [2], nên hai lần nạp cộng dồn vào cùng một chỗ: 500.000 +
200.000 = 700.000, và cả hai người đều "thấy" con số đó. **Cách sửa:** bỏ `static` khỏi `balance`.
Trước khi gõ `static`, hãy tự hỏi: "cả ngân hàng có **đúng một** cái này không?". Bộ đếm, hằng số,
biểu phí: có. Số dư, chủ tài khoản: không.

## 2. `final`: gán một lần rồi khoá

**Ý tưởng nôm na.** Số tài khoản in trên bìa sổ tiết kiệm được cấp **một lần**, sau đó không ai sửa.
Đó là `final`. Nhưng hãy cẩn thận với **két sắt**: nếu bạn khoá **số két** ghi trên thẻ (tham chiếu
`final`), thẻ đó luôn chỉ tới đúng cái két ấy, còn **đồ bên trong két** thì vẫn thêm bớt được.

Ở Chặng 1 Bài 3 bạn đã dùng `final` cho biến cục bộ. Quy tắc chung: biến `final` chỉ được gán **một
lần** [5]. Bài này dùng nó ở ba chỗ mới:

- **Field `final`**: cả field `static` lẫn field instance đều khai báo `final` được [6]. Field `final`
  không gán ngay lúc khai báo gọi là **blank final**. Blank final instance phải được gán xong ở cuối
  **mọi** constructor; blank final `static` phải được gán trong static block (phần 3), nếu không
  javac báo lỗi [6].
- **Tham số `final`**: trong thân method, không gán lại được tham số đó [5].
- **Hằng `static final`**: `static` + `final` là cách khai báo **hằng số** (*constant*) của class [1],
  đặt tên kiểu `UPPER_SNAKE_CASE` như bạn đã học ở Chặng 1 Bài 1.

Điều quan trọng nhất: nếu biến `final` giữ một **tham chiếu**, thì biến đó luôn trỏ tới cùng một
object, nhưng **trạng thái của object vẫn đổi được**. Mảng cũng vậy, vì mảng là object [5].

<svg viewBox="0 0 720 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="final khoá cái gì. Ô thứ nhất, final kiểu nguyên thuỷ: MIN_DEPOSIT giữ giá trị 10000, giá trị bị khoá, lệnh MIN_DEPOSIT = 0 bị javac báo lỗi. Ô thứ hai, final tham chiếu: biến history trỏ tới một object StringBuilder; mũi tên bị khoá nên history = new StringBuilder() bị lỗi, nhưng history.append(...) vẫn chạy vì nội dung object vẫn đổi được. Ô thứ ba, mảng final: FEES trỏ tới mảng 0, 1100, 3300; FEES[2] = 0 vẫn chạy được và đổi phần tử cuối thành 0, còn FEES = new long[3] bị lỗi.">
  <defs>
    <marker id="c2b3-final-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#D97706"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="226" height="250" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="123" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#0F172A">final kiểu nguyên thuỷ</text>
    <rect x="30" y="50" width="186" height="60" rx="6" fill="#FFFBEB" stroke="#D97706" stroke-width="2"/>
    <text x="123" y="72" text-anchor="middle" font-family="monospace" fill="#0F172A">MIN_DEPOSIT</text>
    <text x="123" y="98" text-anchor="middle" font-family="monospace" font-size="14" font-weight="bold" fill="#0F172A">10000</text>
    <text x="123" y="132" text-anchor="middle" fill="#D97706">giá trị bị khoá</text>
    <text x="123" y="200" text-anchor="middle" font-family="monospace" fill="#DC2626">MIN_DEPOSIT = 0;</text>
    <text x="123" y="222" text-anchor="middle" fill="#DC2626">✗ lỗi biên dịch</text>
    <rect x="247" y="10" width="226" height="250" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="360" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#0F172A">final tham chiếu</text>
    <rect x="267" y="50" width="90" height="34" rx="6" fill="#FFFBEB" stroke="#D97706" stroke-width="2"/>
    <text x="312" y="72" text-anchor="middle" font-family="monospace" fill="#0F172A">history</text>
    <line x1="312" y1="84" x2="312" y2="116" stroke="#D97706" stroke-width="2.5" marker-end="url(#c2b3-final-arrow)"/>
    <text x="322" y="104" font-size="11" fill="#D97706">mũi tên bị khoá</text>
    <rect x="267" y="120" width="186" height="56" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="360" y="139" text-anchor="middle" fill="#047857">StringBuilder (object)</text>
    <text x="360" y="162" text-anchor="middle" font-family="monospace" fill="#0F172A">[+500000][từ chối…</text>
    <text x="360" y="200" text-anchor="middle" font-family="monospace" fill="#047857">history.append(..) ✓</text>
    <text x="360" y="222" text-anchor="middle" font-family="monospace" fill="#DC2626">history = new … ✗</text>
    <text x="360" y="248" text-anchor="middle" fill="#64748B">nội dung object vẫn đổi được</text>
    <rect x="484" y="10" width="226" height="250" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="597" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#0F172A">mảng final cũng vậy</text>
    <rect x="504" y="50" width="70" height="34" rx="6" fill="#FFFBEB" stroke="#D97706" stroke-width="2"/>
    <text x="539" y="72" text-anchor="middle" font-family="monospace" fill="#0F172A">FEES</text>
    <line x1="539" y1="84" x2="539" y2="116" stroke="#D97706" stroke-width="2.5" marker-end="url(#c2b3-final-arrow)"/>
    <rect x="504" y="120" width="62" height="34" fill="#ECFDF5" stroke="#10B981"/>
    <text x="535" y="142" text-anchor="middle" font-family="monospace" fill="#0F172A">0</text>
    <rect x="566" y="120" width="62" height="34" fill="#ECFDF5" stroke="#10B981"/>
    <text x="597" y="142" text-anchor="middle" font-family="monospace" fill="#0F172A">1100</text>
    <rect x="628" y="120" width="62" height="34" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="659" y="142" text-anchor="middle" font-family="monospace" fill="#DC2626">0</text>
    <text x="659" y="172" text-anchor="middle" font-size="11" fill="#64748B">trước là 3300</text>
    <text x="597" y="200" text-anchor="middle" font-family="monospace" fill="#047857">FEES[2] = 0; ✓ chạy!</text>
    <text x="597" y="222" text-anchor="middle" font-family="monospace" fill="#DC2626">FEES = new long[3]; ✗</text>
    <text x="597" y="248" text-anchor="middle" fill="#64748B">phần tử vẫn sửa được</text>
  </g>
</svg>

Lưu thành `FinalAccount.java` rồi chạy `java FinalAccount.java`:

```java
public class FinalAccount {
    public static void main(String[] args) {
        Account an = new Account("001");
        an.deposit(500_000);
        an.deposit(5_000);        // dưới mức tối thiểu: bị từ chối
        an.deposit(20_000);

        System.out.println("Mã: " + an.getId());
        System.out.println("Số dư: " + an.getBalance());
        System.out.println("Lịch sử: " + an.getHistory());
        System.out.println("Nạp tối thiểu: " + Account.MIN_DEPOSIT);
    }
}

class Account {
    // Hằng của cả class: static final, đặt tên UPPER_SNAKE_CASE
    static final long MIN_DEPOSIT = 10_000;
    static final String BANK_CODE = "ONW";

    private final String id;        // blank final: gán đúng 1 lần, trong constructor
    private final StringBuilder history = new StringBuilder(); // khoá tham chiếu
    private long balance;           // không final: còn đổi theo giao dịch

    Account(String number) {
        this.id = BANK_CODE + "-" + number;
    }

    void deposit(final long amount) {  // tham số final: không gán lại được
        if (amount < MIN_DEPOSIT) {
            history.append("[từ chối ").append(amount).append("]");
            return;
        }
        balance += amount;
        history.append("[+").append(amount).append("]"); // object vẫn đổi được
    }

    String getId() { return id; }
    long getBalance() { return balance; }
    String getHistory() { return history.toString(); }
}
```

**Kết quả khi chạy:**

```text
Mã: ONW-001
Số dư: 520000
Lịch sử: [+500000][từ chối 5000][+20000]
Nạp tối thiểu: 10000
```

**Giải thích từng bước:**

1. `MIN_DEPOSIT` và `BANK_CODE` là hằng `static final`: một bản cho cả class, không ai gán lại được.
   `main` đọc nó qua tên class: `Account.MIN_DEPOSIT`.
2. `id` là **blank final**. Constructor gán nó đúng một lần thành `"ONW-001"`. Từ đó trở đi, không
   method nào gán lại được, nên mã tài khoản là "sổ đã in".
3. `history` là `final` và được gán ngay lúc khai báo, nên nó luôn trỏ tới **cùng một**
   `StringBuilder` (bảng nháp nối chuỗi ở Chặng 1 Bài 4). Nhưng `append(...)` vẫn thay đổi **nội
   dung** của object đó: lịch sử dài thêm sau mỗi giao dịch.
4. `deposit(final long amount)`: trong method này, lỡ tay viết `amount = 0;` sẽ bị javac chặn. Lần
   nạp `5_000` nhỏ hơn `MIN_DEPOSIT` nên bị từ chối và chỉ ghi vào lịch sử.
5. `balance` **không** `final`, vì số dư phải đổi theo giao dịch. Không phải field nào cũng nên
   `final`, chỉ những thứ "cấp một lần là xong".

💡 `final` còn đặt được trước **method** (chặn class con ghi đè) và trước **class** (chặn kế thừa)
[7][8]. Hai cách dùng này cần biết kế thừa trước, nên [Bài 4](/docs/learning/chang-2/ke-thua-va-ghi-de)
sẽ học kỹ.

### ⚠️ Lỗi hay gặp

**Lỗi 1: gán lại field `final`, kể cả field tham chiếu.** Lưu thành `FinalReassign.java` rồi chạy
`javac FinalReassign.java`:

```java
class Account {
    private final String id;
    private final StringBuilder history = new StringBuilder();

    Account(String id) {
        this.id = id;
    }

    void rename(String newId) {
        this.id = newId;                  // gán lần thứ hai
    }

    void clearHistory() {
        history = new StringBuilder();    // trỏ sang object khác
    }
}
```

```text
FinalReassign.java:10: error: cannot assign a value to final variable id
        this.id = newId;                  // gán lần thứ hai
            ^
FinalReassign.java:14: error: cannot assign a value to final variable history
        history = new StringBuilder();    // trỏ sang object khác
        ^
2 errors
```

**Cách sửa:** nếu giá trị thật sự cần đổi thì đừng đặt `final`. Nếu chỉ muốn "xoá lịch sử" thì sửa
nội dung object thay vì trỏ sang object mới: `history.setLength(0);`.

**Lỗi 2: một constructor quên gán blank final.** Lưu thành `BlankFinal.java` rồi chạy
`javac BlankFinal.java`:

```java
class Account {
    private final String id;
    private String owner;

    Account(String id, String owner) {
        this.id = id;
        this.owner = owner;
    }

    Account(String owner) {       // constructor thứ hai quên gán id
        this.owner = owner;
    }
}
```

```text
BlankFinal.java:12: error: variable id might not have been initialized
    }
    ^
1 error
```

Dấu `^` chỉ vào dấu `}` cuối constructor thứ hai: tới đó mà `id` vẫn chưa được gán [6]. **Cách
sửa:** gán `id` trong mọi constructor (ví dụ sinh mã bằng bộ đếm `static` như phần 1).

**Lỗi 3: tưởng mảng `static final` là bất biến.** Lưu thành `FinalArray.java` rồi chạy
`java FinalArray.java`:

```java
public class FinalArray {
    // "Hằng" nhưng là mảng: tham chiếu bị khoá, phần tử thì không
    static final long[] FEES = {0, 1_100, 3_300};

    public static void main(String[] args) {
        System.out.println("Phí bậc 2 lúc đầu: " + FEES[2]);
        FEES[2] = 0;   // vẫn biên dịch và chạy được!
        System.out.println("Phí bậc 2 sau khi bị sửa: " + FEES[2]);
    }
}
```

```text
Phí bậc 2 lúc đầu: 3300
Phí bậc 2 sau khi bị sửa: 0
```

`final` chỉ khoá **tham chiếu** `FEES`, không khoá các phần tử [5]. Bất kỳ ai thấy `FEES` đều sửa
được biểu phí. **Cách sửa:** để mảng là `private` và chỉ cho bên ngoài **đọc** qua một method, như
`feeForTier(...)` ở phần 3.

## 3. Khối khởi tạo: static block và instance block

**Ý tưởng nôm na.** Sáng nào chi nhánh cũng dán biểu phí lên bảng **một lần** trước giờ mở cửa: đó là
**static block**. Còn mỗi khách mở tài khoản, dù làm hồ sơ ở quầy nào, đều phải qua bước "cấp mã"
giống nhau: đó là **instance block**. Quầy nào cũng tự động có bước này, không cần nhân viên nhớ.

- **Static initializer block** (khối khởi tạo static) viết là `static { ... }`. Nó chạy khi class
  **được khởi tạo** [11], tức là một lần, trước khi class được dùng lần đầu (phần 4 nói rõ "lần đầu"
  là khi nào). Nó dùng để khởi tạo field `static` khi một dòng `= ...` là không đủ, ví dụ cần vòng lặp
  [11][9]. Một class có thể có nhiều static block, chúng chạy theo thứ tự viết trong file [9]. Đây là
  một static context, nên không có `this` [11].
- **Instance initializer block** (khối khởi tạo instance) viết là `{ ... }`, không có tên, nằm trực
  tiếp trong thân class. Nó chạy **mỗi lần một object được tạo** [10]. javac chép nội dung khối này
  vào **mọi** constructor, nên đây là một cách dùng chung code giữa nhiều constructor [9].

<svg viewBox="0 0 720 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hai loại khối khởi tạo trong class Account. Static block, viết static { nạp FEE_TABLE }, chạy một lần khi class Account được khởi tạo. Instance block, viết { cấp mã ACC-00x }, được javac chép vào đầu mỗi constructor, ngay sau lời gọi ngầm tới constructor của Object: constructor Account(String owner) chạy Object(), rồi instance block, rồi this.owner = owner; constructor Account() chạy Object(), rồi instance block, rồi gán owner là khách vãng lai.">
  <defs>
    <marker id="c2b3-blocks-orange" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#D97706"/>
    </marker>
    <marker id="c2b3-blocks-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="320" height="310" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <rect x="18" y="46" width="304" height="62" rx="6" fill="#FFFBEB" stroke="#D97706"/>
    <rect x="18" y="118" width="304" height="62" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <g font-family="monospace" fill="#0F172A">
      <text x="26" y="36">class Account {</text>
      <text x="40" y="64">static {</text>
      <text x="58" y="82" fill="#64748B">nạp FEE_TABLE</text>
      <text x="40" y="100">}</text>
      <text x="40" y="136">{</text>
      <text x="58" y="154" fill="#64748B">cấp mã ACC-00x</text>
      <text x="40" y="172">}</text>
      <text x="40" y="204">Account(String owner) {…}</text>
      <text x="40" y="226">Account() {…}</text>
      <text x="26" y="248">}</text>
    </g>
    <text x="26" y="282" font-size="11" fill="#1D4ED8">Khối { … } không có tên được javac chép</text>
    <text x="26" y="300" font-size="11" fill="#1D4ED8">vào đầu MỖI constructor (sau Object()).</text>
    <rect x="420" y="30" width="290" height="76" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="565" y="54" text-anchor="middle" font-weight="bold" fill="#D97706">Chạy MỘT lần</text>
    <text x="565" y="76" text-anchor="middle" fill="#0F172A">khi class Account được khởi tạo</text>
    <text x="565" y="96" text-anchor="middle" font-size="11" fill="#64748B">(dù sau đó new bao nhiêu lần)</text>
    <line x1="322" y1="76" x2="416" y2="68" stroke="#D97706" stroke-width="2" marker-end="url(#c2b3-blocks-orange)"/>
    <rect x="420" y="126" width="290" height="92" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="565" y="146" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#1D4ED8">Account(String owner)</text>
    <text x="436" y="168" fill="#64748B">1. Object()  (ngầm)</text>
    <rect x="430" y="176" width="270" height="20" rx="4" fill="#EFF6FF"/>
    <text x="436" y="190" fill="#1D4ED8">2. [instance block]</text>
    <text x="436" y="210" font-family="monospace" fill="#0F172A">3. this.owner = owner</text>
    <rect x="420" y="228" width="290" height="92" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="565" y="248" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#1D4ED8">Account()</text>
    <text x="436" y="270" fill="#64748B">1. Object()  (ngầm)</text>
    <rect x="430" y="278" width="270" height="20" rx="4" fill="#EFF6FF"/>
    <text x="436" y="292" fill="#1D4ED8">2. [instance block]</text>
    <text x="436" y="312" fill="#0F172A">3. owner = "(khách vãng lai)"</text>
    <line x1="322" y1="150" x2="426" y2="186" stroke="#2563EB" stroke-width="2" marker-end="url(#c2b3-blocks-blue)"/>
    <line x1="322" y1="158" x2="426" y2="286" stroke="#2563EB" stroke-width="2" marker-end="url(#c2b3-blocks-blue)"/>
  </g>
</svg>

Lưu thành `InitBlocks.java` rồi chạy `java InitBlocks.java`:

```java
public class InitBlocks {
    public static void main(String[] args) {
        Account an = new Account("An");
        Account guest = new Account();   // constructor không tham số
        System.out.println(an);
        System.out.println(guest);
        System.out.println("Phí chuyển bậc 3: " + Account.feeForTier(3));
    }
}

class Account {
    private static final long[] FEE_TABLE = new long[4];
    private static int openedCount;

    // static block: chạy MỘT lần, khi class được khởi tạo
    static {
        for (int tier = 1; tier < FEE_TABLE.length; tier++) {
            FEE_TABLE[tier] = tier * 1_100L;  // bậc 1: 1100, bậc 2: 2200...
        }
        System.out.println("[static block] đã nạp biểu phí");
    }

    private String id;
    private String owner;

    // instance block: chạy MỖI lần new, trước thân constructor
    {
        openedCount++;
        id = String.format("ACC-%03d", openedCount);
        System.out.println("[instance block] cấp mã " + id);
    }

    Account(String owner) { this.owner = owner; }

    Account() { this.owner = "(khách vãng lai)"; }

    static long feeForTier(int tier) { return FEE_TABLE[tier]; }

    @Override
    public String toString() { return id + " | " + owner; }
}
```

**Kết quả khi chạy:**

```text
[static block] đã nạp biểu phí
[instance block] cấp mã ACC-001
[instance block] cấp mã ACC-002
ACC-001 | An
ACC-002 | (khách vãng lai)
Phí chuyển bậc 3: 3300
```

**Giải thích từng bước:**

1. `new Account("An")` là lần đầu `main` dùng `Account`, nên class được khởi tạo: static block chạy,
   điền `FEE_TABLE` bằng vòng lặp, rồi in `[static block] đã nạp biểu phí`. Dòng này chỉ in **một
   lần** dù có hai lần `new`.
2. Với mỗi `new`, instance block chạy **trước** thân constructor: tăng bộ đếm và cấp mã. Object tạo
   bằng `Account()` (không tham số) vẫn có mã `ACC-002`, vì javac đã chép khối này vào **cả hai**
   constructor [9].
3. `openedCount` không có `= 0` nhưng vẫn bắt đầu từ `0`: field `static` cũng như field instance,
   chưa gán thì mang giá trị mặc định, với `int` là `0` [26].
4. `FEE_TABLE` là `private static final`, bên ngoài chỉ **đọc** được qua `feeForTier(3)`, nên không
   ai sửa được biểu phí như lỗi 3 ở phần 2.

💡 Trong thực tế, instance block khá hiếm gặp. Nhiều đội thích đặt phần code chung vào một method
`private` rồi gọi nó từ các constructor cho dễ đọc. Bạn vẫn cần **nhận ra** nó khi đọc code người khác.

### ⚠️ Lỗi hay gặp

**Lỗi 1: dùng tham số của constructor trong instance block.** Lưu thành `BlockParam.java` rồi chạy
`javac BlockParam.java`:

```java
class Account {
    private String owner;

    {
        System.out.println("Mở tài khoản cho " + ownerName); // tham số của constructor
    }

    Account(String ownerName) {
        this.owner = ownerName;
    }
}
```

```text
BlockParam.java:5: error: cannot find symbol
        System.out.println("Mở tài khoản cho " + ownerName); // tham số của constructor
                                                 ^
  symbol:   variable ownerName
  location: class Account
1 error
```

Instance block không thuộc constructor nào, nên nó không thấy tham số `ownerName`. **Cách sửa:** việc
nào cần tham số thì viết trong thân constructor.

**Lỗi 2: instance block đọc field mà constructor mới gán.** Chương trình biên dịch được nhưng in sai.
Lưu thành `BlockTooEarly.java` rồi chạy `java BlockTooEarly.java`:

```java
public class BlockTooEarly {
    public static void main(String[] args) {
        new Account("An");
    }
}

class Account {
    private String owner;

    {
        System.out.println("Mở tài khoản cho " + owner); // owner chưa được gán
    }

    Account(String owner) {
        this.owner = owner;
        System.out.println("Constructor: owner = " + this.owner);
    }
}
```

```text
Mở tài khoản cho null
Constructor: owner = An
```

Instance block chạy **trước** thân constructor [14] (phần 4 nói kỹ), nên lúc đó `owner` vẫn là giá trị mặc
định `null`. **Cách sửa:** chuyển dòng in vào constructor, sau `this.owner = owner;`.

**Lỗi 3: static block ném lỗi.** Lưu thành `BrokenStatic.java` rồi chạy `java BrokenStatic.java`:

```java
public class BrokenStatic {
    public static void main(String[] args) {
        System.out.println("Bắt đầu");
        Account an = new Account();   // lần đầu dùng Account: static block chạy
        System.out.println("Không bao giờ in tới dòng này");
    }
}

class Account {
    static final long[] FEE_TABLE = new long[3];

    static {
        FEE_TABLE[3] = 3_300;          // mảng 3 phần tử chỉ có chỉ số 0..2
    }
}
```

Kết quả (rút gọn, bỏ các dòng `at java.base/...` phía dưới):

```text
Bắt đầu
Exception in thread "main" java.lang.ExceptionInInitializerError
	at BrokenStatic.main(BrokenStatic.java:4)
Caused by: java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
	at Account.<clinit>(BrokenStatic.java:13)
	at BrokenStatic.main(BrokenStatic.java:4)
```

Khi code khởi tạo `static` ném một exception, JVM bọc nó trong **`ExceptionInInitializerError`** [13].
Dòng `Caused by:` cho biết lỗi gốc: chỉ số `3` vượt khỏi mảng 3 phần tử (Chặng 1 Bài 5). `<clinit>` là
tên đặc biệt của "method khởi tạo class" mà JVM gọi để khởi tạo class [25], tức phần static của class. **Cách sửa:** sửa lỗi gốc, và giữ static block ngắn,
đơn giản, vì lỗi ở đây làm class không dùng được.

## 4. Thứ tự khởi tạo: ai chạy trước?

**Ý tưởng nôm na.** Ngày khai trương chi nhánh có hai loại việc. Việc **một lần**: treo bảng hiệu, dán
biểu phí (khởi tạo class). Việc **mỗi khách**: phát hồ sơ trắng, điền các ô mặc định của mẫu, đóng
dấu cấp mã, rồi mới ghi tên khách (tạo object). Không ai ghi tên khách lên hồ sơ chưa được phát.

Quy tắc, theo JLS:

1. **Khi nào class được khởi tạo?** Ngay trước lần đầu tiên xảy ra một trong các việc: tạo object của
   class, gọi method `static` của class, gán field `static`, hoặc đọc field `static` **không phải
   hằng** [12]. Không phải lúc chương trình vừa chạy. (Đây là bước *Initialization* của class loader ở
   Chặng 1 Bài 2.)
2. **Khởi tạo class làm gì?** Chạy các dòng gán field `static` và các static block, **theo thứ tự viết
   từ trên xuống**, đúng một lần [13][12].
3. **Mỗi lần `new` làm gì?** JVM cấp vùng nhớ, đặt mọi field về giá trị mặc định (`0`, `null`...) [14][26].
   Rồi constructor được xử lý: gọi constructor của class cha trước (ở đây là `Object()`, javac tự
   thêm), sau đó chạy các dòng gán field instance và các instance block **theo thứ tự viết**, cuối
   cùng mới chạy phần còn lại của thân constructor [14].

<svg viewBox="0 0 740 310" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thứ tự khởi tạo. Hàng trên, một lần cho cả class, ngay trước lần đầu dùng Account: bước 1 dòng gán field static openedCount = 0, rồi bước 2 static block, theo thứ tự viết từ trên xuống. Hàng dưới, mỗi lần new Account: cấp vùng nhớ và đặt field về giá trị mặc định, owner bằng null; gọi constructor cha Object() một cách ngầm; bước 3 dòng gán field instance owner bằng dấu hỏi; bước 4 instance block; bước 5 thân constructor gán owner thật. Bước 3 và 4 theo thứ tự viết trong file, bước 5 luôn sau cùng. Object thứ hai chỉ lặp lại hàng dưới, không chạy lại bước 1 và 2.">
  <defs>
    <marker id="c2b3-order-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="20" y="24" font-size="13" font-weight="bold" fill="#D97706">Một lần cho cả class (ngay trước lần đầu dùng Account)</text>
    <rect x="20" y="36" width="220" height="60" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="130" y="58" text-anchor="middle" font-weight="bold" fill="#0F172A">1. dòng gán field static</text>
    <text x="130" y="82" text-anchor="middle" font-family="monospace" fill="#0F172A">openedCount = 0</text>
    <line x1="242" y1="66" x2="276" y2="66" stroke="#64748B" stroke-width="2" marker-end="url(#c2b3-order-arrow)"/>
    <rect x="280" y="36" width="220" height="60" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="390" y="58" text-anchor="middle" font-weight="bold" fill="#0F172A">2. static block</text>
    <text x="390" y="82" text-anchor="middle" font-family="monospace" fill="#0F172A">static { … }</text>
    <rect x="540" y="36" width="180" height="60" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="630" y="60" text-anchor="middle" fill="#64748B">theo thứ tự viết,</text>
    <text x="630" y="80" text-anchor="middle" fill="#64748B">từ trên xuống</text>
    <line x1="390" y1="98" x2="390" y2="140" stroke="#64748B" stroke-width="2" stroke-dasharray="5 4" marker-end="url(#c2b3-order-arrow)"/>
    <text x="400" y="124" fill="#64748B" font-size="11">rồi mới tới object</text>
    <text x="20" y="134" font-size="13" font-weight="bold" fill="#1D4ED8">Mỗi lần new Account("An")</text>
    <rect x="20" y="146" width="128" height="74" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="84" y="168" text-anchor="middle" fill="#0F172A">cấp vùng nhớ,</text>
    <text x="84" y="186" text-anchor="middle" fill="#0F172A">field = mặc định</text>
    <text x="84" y="208" text-anchor="middle" font-family="monospace" fill="#64748B">owner = null</text>
    <rect x="162" y="146" width="128" height="74" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="226" y="168" text-anchor="middle" fill="#0F172A">constructor cha</text>
    <text x="226" y="190" text-anchor="middle" font-family="monospace" fill="#0F172A">Object()</text>
    <text x="226" y="208" text-anchor="middle" fill="#64748B">(ngầm)</text>
    <rect x="304" y="146" width="128" height="74" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="368" y="168" text-anchor="middle" font-weight="bold" fill="#1D4ED8">3. field instance</text>
    <text x="368" y="196" text-anchor="middle" font-family="monospace" fill="#0F172A">owner = "?"</text>
    <rect x="446" y="146" width="128" height="74" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="510" y="168" text-anchor="middle" font-weight="bold" fill="#1D4ED8">4. instance block</text>
    <text x="510" y="196" text-anchor="middle" font-family="monospace" fill="#0F172A">{ … }</text>
    <rect x="588" y="146" width="132" height="74" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="654" y="168" text-anchor="middle" font-weight="bold" fill="#047857">5. thân constructor</text>
    <text x="654" y="196" text-anchor="middle" font-family="monospace" fill="#0F172A">owner = "An"</text>
    <line x1="149" y1="183" x2="158" y2="183" stroke="#64748B" stroke-width="2" marker-end="url(#c2b3-order-arrow)"/>
    <line x1="291" y1="183" x2="300" y2="183" stroke="#64748B" stroke-width="2" marker-end="url(#c2b3-order-arrow)"/>
    <line x1="433" y1="183" x2="442" y2="183" stroke="#64748B" stroke-width="2" marker-end="url(#c2b3-order-arrow)"/>
    <line x1="575" y1="183" x2="584" y2="183" stroke="#64748B" stroke-width="2" marker-end="url(#c2b3-order-arrow)"/>
    <text x="20" y="252" fill="#0F172A">3 và 4 chạy theo thứ tự viết trong file. 5 luôn chạy sau cùng, kể cả khi instance block viết dưới constructor.</text>
    <text x="20" y="278" fill="#64748B">Object thứ hai: chỉ lặp lại hàng dưới. Bước 1 và 2 không chạy lại.</text>
  </g>
</svg>

Chương trình sau in log ở từng bước. Để ý: instance block được cố ý viết **sau** constructor. Lưu
thành `InitOrder.java` rồi chạy `java InitOrder.java`:

```java
public class InitOrder {
    public static void main(String[] args) {
        System.out.println("main bắt đầu");
        new Account("An");
        System.out.println("--- object thứ hai ---");
        new Account("Bình");
    }
}

class Account {
    static int openedCount = log("1. static field: openedCount = 0", 0);

    static {
        log("2. static block", 0);
    }

    String owner = logText("3. instance field: owner = \"?\"", "?");

    Account(String owner) {
        // (ẩn) gọi constructor của class cha Object trước tiên
        log("5. thân constructor: owner = " + owner, 0);
        this.owner = owner;
    }

    {   // instance block viết SAU constructor, nhưng vẫn chạy TRƯỚC thân constructor
        openedCount++;
        log("4. instance block: số thứ tự " + openedCount, 0);
    }

    static int log(String message, int value) {
        System.out.println("   " + message);
        return value;
    }

    static String logText(String message, String value) {
        System.out.println("   " + message);
        return value;
    }
}
```

**Kết quả khi chạy:**

```text
main bắt đầu
   1. static field: openedCount = 0
   2. static block
   3. instance field: owner = "?"
   4. instance block: số thứ tự 1
   5. thân constructor: owner = An
--- object thứ hai ---
   3. instance field: owner = "?"
   4. instance block: số thứ tự 2
   5. thân constructor: owner = Bình
```

**Giải thích từng bước:**

1. `main bắt đầu` in **trước** mọi thứ của `Account`: class chưa được khởi tạo cho tới khi `main` gọi
   `new Account("An")` [12].
2. Bước `1.` rồi `2.`: dòng gán `openedCount` viết trước static block, nên chạy trước [13]. Hàm `log`
   in ra rồi trả về giá trị để gán, nhờ vậy ta "nhìn thấy" được lúc dòng gán chạy.
3. Bước `3.` rồi `4.`: field `owner = "?"` và instance block chạy theo thứ tự viết. Instance block
   nằm **dưới** constructor trong file, nhưng vẫn chạy **trước** thân constructor [14].
4. Bước `5.`: thân constructor chạy sau cùng và gán `owner` thật.
5. Object thứ hai chỉ lặp lại `3.`, `4.`, `5.`. Bước `1.` và `2.` không chạy lại, vì class chỉ được
   khởi tạo một lần.

💡 Khi có class cha (Bài 4), "gọi constructor của class cha trước" sẽ in ra cả một chuỗi log của
class cha trước khi tới class con.

### ⚠️ Lỗi hay gặp

**Lỗi 1: static block dùng field khai báo phía dưới.** Lưu thành `ForwardRef.java` rồi chạy
`javac ForwardRef.java`:

```java
class Account {
    static {
        System.out.println("Mã ngân hàng: " + BANK_PREFIX); // dùng trước khi khai báo
    }

    static String BANK_PREFIX = "ONW";
}
```

```text
ForwardRef.java:3: error: illegal forward reference
        System.out.println("Mã ngân hàng: " + BANK_PREFIX); // dùng trước khi khai báo
                                              ^
1 error
```

Vì code khởi tạo chạy từ trên xuống, javac cấm đọc một field `static` trong static block **đứng trước**
chỗ khai báo field đó [15]. **Cách sửa:** đưa khai báo field lên trên static block.

**Lỗi 2: tưởng đọc hằng là "dùng class".** Lưu thành `ConstantNoInit.java` rồi chạy
`java ConstantNoInit.java`:

```java
public class ConstantNoInit {
    public static void main(String[] args) {
        System.out.println("Đọc hằng: " + Account.BANK_CODE);
        System.out.println("Đọc biến static: " + Account.openedCount);
    }
}

class Account {
    static final String BANK_CODE = "ONW"; // hằng lúc biên dịch (constant variable)
    static int openedCount = 0;            // biến static thường

    static {
        System.out.println("[static block] Account được khởi tạo");
    }
}
```

```text
Đọc hằng: ONW
[static block] Account được khởi tạo
Đọc biến static: 0
```

Đọc `Account.BANK_CODE` **không** làm static block chạy, đọc `Account.openedCount` thì có. Lý do:
`BANK_CODE` là **constant variable** (biến hằng): `final`, kiểu nguyên thuỷ hoặc `String`, và được gán
bằng một biểu thức hằng như `"ONW"` [5]. Đọc constant variable không kích hoạt khởi tạo class [12],
vì javac đã chép thẳng giá trị `"ONW"` vào chỗ dùng lúc biên dịch [1]. **Bài học:** đừng đặt việc quan
trọng vào static block rồi trông chờ nó chạy chỉ vì ai đó đọc một hằng.

## 5. Vòng đời object: từ `new` tới lúc GC thu hồi

**Ý tưởng nôm na.** Mỗi object như một két sắt trong kho. Biến tham chiếu là **thẻ ghi số két**. Chừng
nào còn ít nhất một tấm thẻ trỏ tới két, két còn đó. Khi không còn tấm thẻ nào, nhân viên dọn kho
(**Garbage Collector**) sẽ dọn nó đi **vào lúc họ chọn**, không phải lúc bạn chọn. Và bạn không có nút
"huỷ két" nào để bấm.

Bốn chặng của một object:

1. **Tạo**: `new` cấp vùng nhớ trên heap và chạy chuỗi khởi tạo ở phần 4.
2. **Dùng**: object **reachable** (còn với tới được): còn truy cập được từ code đang chạy qua một
   chuỗi tham chiếu nào đó [17].
3. **Unreachable** (không còn với tới được): không còn đường nào dẫn tới nó [17]. Theo Oracle, tham
   chiếu thường mất khi biến ra khỏi phạm vi (method kết thúc), hoặc khi bạn gán biến bằng `null` [16].
   Gán biến sang object khác cũng bỏ tham chiếu cũ, như bạn đã thấy với `b = new Account(...)` ở Chặng 1
   Bài 6. Một object có thể có nhiều tham chiếu, và **mọi** tham chiếu phải mất hết thì object mới đủ
   điều kiện bị thu hồi [16].
4. **GC thu hồi**: JVM tự xoá object không còn dùng, gọi là **garbage collection**. Java không bắt bạn
   tự huỷ object như một số ngôn ngữ khác [16].

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vòng đời của một object qua bốn chặng: Tạo bằng new Account; Đang dùng, tức reachable, còn tham chiếu trỏ tới; Unreachable, không còn đường nào dẫn tới; GC thu hồi, vào lúc JVM chọn. Ba cách làm mất tham chiếu: biến ra khỏi phạm vi khi method kết thúc, gán null, gán biến sang object khác; phải mất hết mọi tham chiếu, kể cả alias. Bên phải: Java không có destructor; finalize() đã deprecated để chờ xoá từ Java 18 theo JEP 421; thay bằng try-with-resources hoặc Cleaner.">
  <defs>
    <marker id="c2b3-life-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="15" y="20" width="150" height="80" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="90" y="44" text-anchor="middle" font-size="13" font-weight="bold" fill="#1D4ED8">1. Tạo</text>
    <text x="90" y="72" text-anchor="middle" font-family="monospace" fill="#0F172A">new Account(…)</text>
    <rect x="195" y="20" width="150" height="80" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="270" y="44" text-anchor="middle" font-size="13" font-weight="bold" fill="#047857">2. Đang dùng</text>
    <text x="270" y="66" text-anchor="middle" fill="#0F172A">reachable: còn</text>
    <text x="270" y="84" text-anchor="middle" fill="#0F172A">tham chiếu trỏ tới</text>
    <rect x="375" y="20" width="150" height="80" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="450" y="44" text-anchor="middle" font-size="13" font-weight="bold" fill="#D97706">3. Unreachable</text>
    <text x="450" y="66" text-anchor="middle" fill="#0F172A">không còn đường</text>
    <text x="450" y="84" text-anchor="middle" fill="#0F172A">nào dẫn tới</text>
    <rect x="555" y="20" width="150" height="80" rx="10" fill="#F8FAFC" stroke="#94A3B8" stroke-dasharray="5 4"/>
    <text x="630" y="44" text-anchor="middle" font-size="13" font-weight="bold" fill="#64748B">4. GC thu hồi</text>
    <text x="630" y="66" text-anchor="middle" fill="#0F172A">vào lúc JVM chọn,</text>
    <text x="630" y="84" text-anchor="middle" fill="#0F172A">không phải bạn</text>
    <line x1="167" y1="60" x2="191" y2="60" stroke="#64748B" stroke-width="2" marker-end="url(#c2b3-life-arrow)"/>
    <line x1="347" y1="60" x2="371" y2="60" stroke="#64748B" stroke-width="2" marker-end="url(#c2b3-life-arrow)"/>
    <line x1="527" y1="60" x2="551" y2="60" stroke="#64748B" stroke-width="2" marker-end="url(#c2b3-life-arrow)"/>
    <rect x="15" y="140" width="430" height="125" rx="10" fill="#FFFFFF" stroke="#D97706"/>
    <text x="30" y="164" font-weight="bold" fill="#D97706">Ba cách làm mất tham chiếu (từ 2 sang 3)</text>
    <text x="30" y="188" fill="#0F172A">• biến ra khỏi phạm vi (method kết thúc)</text>
    <text x="30" y="208" fill="#0F172A">• gán null:</text>
    <text x="110" y="208" font-family="monospace" fill="#0F172A">an = null;</text>
    <text x="30" y="228" fill="#0F172A">• gán sang object khác:</text>
    <text x="190" y="228" font-family="monospace" fill="#0F172A">an = new Account(…);</text>
    <text x="30" y="252" font-weight="bold" fill="#0F172A">Phải mất HẾT mọi tham chiếu, kể cả alias.</text>
    <line x1="420" y1="138" x2="440" y2="104" stroke="#D97706" stroke-width="2" marker-end="url(#c2b3-life-arrow)"/>
    <rect x="465" y="140" width="240" height="125" rx="10" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="585" y="164" text-anchor="middle" font-weight="bold" fill="#DC2626">Không có destructor</text>
    <text x="480" y="188" font-family="monospace" fill="#0F172A">finalize()</text>
    <text x="554" y="188" fill="#DC2626">: deprecated,</text>
    <text x="480" y="208" fill="#0F172A">chờ bị xoá (JEP 421, Java 18)</text>
    <text x="480" y="234" fill="#047857">Thay bằng: try-with-resources</text>
    <text x="480" y="254" fill="#047857">hoặc Cleaner</text>
  </g>
</svg>

Làm sao "nhìn thấy" GC? Ta dùng một **`WeakReference`** (tham chiếu yếu) làm "camera". Tham chiếu
bình thường (gọi là **tham chiếu mạnh**) giữ object sống. Tham chiếu yếu thì **không ngăn** GC thu hồi
object [19], và `camera.get()` trả về `null` khi object đã bị dọn [20]. Phần `<Account>` chỉ nói camera
này theo dõi object kiểu `Account` (Chặng 3 học kỹ cú pháp `<...>`). Lưu thành `Lifecycle.java` rồi chạy
`java Lifecycle.java`:

```java
import java.lang.ref.WeakReference;

public class Lifecycle {
    public static void main(String[] args) {
        Account an = new Account("ACC-001");   // 1. tạo
        an.deposit(100_000);                   // 2. dùng
        Account alias = an;                    // thêm một tham chiếu nữa

        // "Camera" quan sát: không giữ object sống
        WeakReference<Account> camera = new WeakReference<>(an);

        an = null;                             // bỏ một tham chiếu
        System.gc();                           // chỉ là GỢI Ý cho GC
        alias.deposit(50_000);                 // alias vẫn dùng được object
        System.out.println("Bỏ an, còn alias: " + status(camera));

        alias = null;                          // 3. không còn ai trỏ tới
        System.gc();
        System.out.println("Bỏ cả alias:      " + status(camera));
    }

    static String status(WeakReference<Account> camera) {
        Account seen = camera.get();           // null nếu GC đã thu hồi
        return seen == null ? "đã bị thu hồi" : "còn sống, số dư " + seen.getBalance();
    }
}

class Account {
    private final String id;
    private long balance;

    Account(String id) { this.id = id; }

    void deposit(long amount) { balance += amount; }

    long getBalance() { return balance; }
}
```

**Kết quả khi chạy** (JDK 21 trên máy tác giả, 5 lần chạy đều như nhau):

```text
Bỏ an, còn alias: còn sống, số dư 150000
Bỏ cả alias:      đã bị thu hồi
```

⚠️ `System.gc()` chỉ **gợi ý** JVM dọn dẹp, JVM không hứa sẽ dọn object nào hay dọn lúc nào [18]. Vì
vậy dòng thứ hai trên máy bạn **có thể** là `còn sống`. Ví dụ này chỉ để quan sát, đừng gọi
`System.gc()` trong code thật.

<svg viewBox="0 0 720 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hai ảnh chụp bộ nhớ của chương trình Lifecycle. Ảnh 1, sau an = null: biến an bằng null, biến alias vẫn trỏ tới object Account có balance 150000, biến camera trỏ tới một WeakReference, WeakReference trỏ yếu (nét đứt) tới object Account; vì còn alias nên object còn sống. Ảnh 2, sau alias = null và System.gc(): an và alias đều null, không còn tham chiếu mạnh nào, object Account đã bị GC thu hồi, camera vẫn trỏ tới WeakReference nhưng get() trả về null.">
  <defs>
    <marker id="c2b3-weak-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
    <marker id="c2b3-weak-grey" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="345" height="250" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="182" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#0F172A">1. Sau an = null (alias còn giữ)</text>
    <g font-family="monospace" fill="#0F172A">
      <text x="22" y="80">an</text>
      <text x="22" y="120">alias</text>
      <text x="22" y="160">camera</text>
    </g>
    <rect x="75" y="62" width="60" height="26" rx="4" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="105" y="80" text-anchor="middle" font-family="monospace" fill="#DC2626">null</text>
    <rect x="75" y="102" width="60" height="26" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="105" cy="115" r="4" fill="#2563EB"/>
    <rect x="75" y="142" width="60" height="26" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="105" cy="155" r="4" fill="#2563EB"/>
    <rect x="185" y="50" width="160" height="62" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="265" y="72" text-anchor="middle" font-weight="bold" fill="#1D4ED8">Account (object)</text>
    <text x="265" y="98" text-anchor="middle" font-family="monospace" fill="#0F172A">balance = 150000</text>
    <rect x="185" y="150" width="160" height="50" rx="8" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="265" y="170" text-anchor="middle" fill="#0F172A">WeakReference</text>
    <text x="265" y="190" text-anchor="middle" font-family="monospace" fill="#047857">get() → object</text>
    <line x1="109" y1="115" x2="181" y2="92" stroke="#2563EB" stroke-width="2" marker-end="url(#c2b3-weak-blue)"/>
    <line x1="109" y1="155" x2="181" y2="170" stroke="#2563EB" stroke-width="2" marker-end="url(#c2b3-weak-blue)"/>
    <line x1="265" y1="148" x2="265" y2="116" stroke="#64748B" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#c2b3-weak-grey)"/>
    <text x="272" y="136" font-size="11" fill="#64748B">yếu</text>
    <text x="182" y="236" text-anchor="middle" fill="#047857">Còn alias (tham chiếu mạnh) → object sống</text>
    <rect x="365" y="10" width="345" height="250" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="537" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#0F172A">2. Sau alias = null và System.gc()</text>
    <g font-family="monospace" fill="#0F172A">
      <text x="377" y="80">an</text>
      <text x="377" y="120">alias</text>
      <text x="377" y="160">camera</text>
    </g>
    <rect x="430" y="62" width="60" height="26" rx="4" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="460" y="80" text-anchor="middle" font-family="monospace" fill="#DC2626">null</text>
    <rect x="430" y="102" width="60" height="26" rx="4" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="460" y="120" text-anchor="middle" font-family="monospace" fill="#DC2626">null</text>
    <rect x="430" y="142" width="60" height="26" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="460" cy="155" r="4" fill="#2563EB"/>
    <rect x="540" y="50" width="160" height="62" rx="8" fill="#F8FAFC" stroke="#94A3B8" stroke-dasharray="5 4"/>
    <text x="620" y="78" text-anchor="middle" fill="#64748B">đã bị GC</text>
    <text x="620" y="96" text-anchor="middle" fill="#64748B">thu hồi</text>
    <rect x="540" y="150" width="160" height="50" rx="8" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="620" y="170" text-anchor="middle" fill="#0F172A">WeakReference</text>
    <text x="620" y="190" text-anchor="middle" font-family="monospace" fill="#DC2626">get() → null</text>
    <line x1="464" y1="155" x2="536" y2="170" stroke="#2563EB" stroke-width="2" marker-end="url(#c2b3-weak-blue)"/>
    <text x="537" y="236" text-anchor="middle" fill="#DC2626">Không còn tham chiếu mạnh → GC thu hồi</text>
  </g>
</svg>

**Giải thích từng bước:**

1. `new Account("ACC-001")` tạo object, `deposit(100_000)` dùng nó. `alias = an` tạo **tấm thẻ thứ
   hai** trỏ cùng object (không có object mới).
2. `camera` là tham chiếu yếu, nó "nhìn" object mà không giữ object sống [19].
3. `an = null`: bỏ một tấm thẻ. `alias` vẫn trỏ tới object, nên object vẫn reachable. `alias.deposit`
   vẫn chạy, số dư thành `150000`, và camera vẫn thấy object.
4. `alias = null`: tấm thẻ mạnh cuối cùng mất. Object thành unreachable. Sau `System.gc()`, lần chạy này
   GC đã dọn nó, nên `camera.get()` trả về `null` [20].

**Thế còn "destructor"?** Một số ngôn ngữ có hàm chạy khi object bị huỷ. Java từng có `finalize()` với
ý tương tự, nhưng nó đã bị **deprecated để chờ xoá** từ Java 18 (JEP 421), vì JVM không hứa khi nào nó
chạy, có chạy hay không, và chạy trên thread nào [21][17]. Thay vào đó, JEP 421 khuyên dùng:

- **try-with-resources** (Java 7): đóng tài nguyên (file, kết nối...) chắc chắn ngay khi xong việc, kể
  cả khi có lỗi [21]. Chặng 3 sẽ học kỹ cùng exception.
- **`Cleaner`** (Java 9): đăng ký một việc dọn dẹp chạy **sau khi** object thành unreachable [21][22].
  Nhưng việc này vẫn do GC lên lịch nên có thể trễ, không dùng cho việc cần làm ngay [21].

### ⚠️ Lỗi hay gặp

**Lỗi 1: viết `finalize()` như destructor.** Lưu thành `OldFinalize.java` rồi chạy
`javac OldFinalize.java`:

```java
class Account {
    @Override
    protected void finalize() {   // kiểu "destructor" cũ, đừng dùng
        System.out.println("Đóng sổ tài khoản");
    }
}
```

```text
OldFinalize.java:3: warning: [removal] finalize() in Object has been deprecated and marked for removal
    protected void finalize() {   // kiểu "destructor" cũ, đừng dùng
                   ^
1 warning
```

Đây là **warning** (cảnh báo), không phải lỗi: file vẫn biên dịch được. Nhưng `[removal]` nghĩa là API
này sẽ bị xoá ở một phiên bản sau [23]. **Cách sửa:** đưa việc dọn dẹp vào một method rõ ràng (ví dụ
`close()`) và gọi nó chủ động; Chặng 3 sẽ dùng try-with-resources để gọi tự động.

**Lỗi 2: tưởng `an = null` là "xoá object".** Như dòng đầu của `Lifecycle`: `an = null` nhưng `alias`
còn giữ, object vẫn sống. `null` chỉ xoá **một tấm thẻ**, không xoá két [16].

**Lỗi 3: gọi `System.gc()` để "dọn ngay cho nhẹ máy".** Đó chỉ là gợi ý, không có gì đảm bảo [18].
Thay vào đó, hãy để object hết phạm vi tự nhiên (biến cục bộ trong method), và đừng giữ tham chiếu lâu
hơn mức cần thiết.

## Nên / Không nên

| ✓ Nên | ✗ Không nên |
|---|---|
| Dùng `static` cho thứ cả class có đúng một bản: bộ đếm, hằng, biểu phí | Thêm `static` vào `balance`, `owner` cho "dễ gọi" |
| Gọi thành viên `static` qua tên class: `Account.getOpenedCount()` | Đọc field instance trong method `static` |
| Đặt `final` cho field "cấp một lần là xong" như `id` | Tin rằng `final` làm object hay mảng bất biến |
| Đặt tên hằng `static final` bằng `UPPER_SNAKE_CASE` | Để mảng `static final` là `public` cho ai cũng sửa |
| Giữ static block ngắn, chỉ để khởi tạo dữ liệu của class | Đặt việc quan trọng vào static block rồi trông chờ đọc hằng sẽ kích hoạt nó |
| Để GC tự làm việc, đóng tài nguyên chủ động | Viết `finalize()` hoặc gọi `System.gc()` trong code thật |

## Tóm tắt

- Field `static` có **đúng một bản** cho cả class; field instance thì mỗi object một bản. Method
  `static` không có `this`, nên không đọc trực tiếp được field instance.
- Bộ đếm `static` + `String.format("ACC-%03d", n)` là cách đơn giản để sinh mã tự tăng.
- `final` = gán đúng một lần. Blank final phải được gán ở cuối mọi constructor. Hằng = `static final`.
- `final` khoá **tham chiếu**, không khoá **object**: `StringBuilder`, mảng `final` vẫn sửa được nội dung.
- Static block chạy **một lần** khi class được khởi tạo; instance block chạy **mỗi lần `new`**, trước
  thân constructor.
- Thứ tự: khởi tạo class (field `static` và static block, theo thứ tự viết) → mỗi `new`: giá trị mặc
  định → constructor cha → field instance và instance block (theo thứ tự viết) → thân constructor.
- Đọc một constant variable không kích hoạt khởi tạo class.
- Vòng đời: tạo → dùng (reachable) → unreachable → GC thu hồi vào lúc JVM chọn. Không có destructor;
  `finalize()` đã deprecated để chờ xoá, dùng try-with-resources hoặc `Cleaner`.

## Tự kiểm tra

**Câu 1.** (Mục tiêu 1) Chương trình sau in ra gì?

```java
public class TellerQuiz {
    public static void main(String[] args) {
        Teller a = new Teller();
        Teller b = new Teller();
        a.serve();
        a.serve();
        b.serve();
        System.out.println(Teller.servedToday + " " + a.servedByMe + " " + b.servedByMe);
    }
}

class Teller {
    static int servedToday = 0;
    int servedByMe = 0;

    void serve() {
        servedToday++;
        servedByMe++;
    }
}
```

<details><summary>Đáp án</summary>

```text
3 2 1
```

`servedToday` là `static`: một bản chung, cả ba lần `serve()` cùng cộng vào nên được `3`.
`servedByMe` là field instance: `a` phục vụ 2 lần, `b` phục vụ 1 lần.

</details>

**Câu 2.** (Mục tiêu 1) Vì sao `static String ownerName() { return owner; }` trong class `Account`
(với `owner` là field instance) không biên dịch được? Nêu hai cách sửa.

<details><summary>Đáp án</summary>

Method `static` là static context, không gắn với object nào, nên không biết `owner` "của ai" [3]. Cách
sửa: (1) bỏ `static` để nó thành method instance; (2) giữ `static` nhưng nhận object qua tham số:
`static String ownerName(Account account) { return account.owner; }` (gọi được vì đang ở trong chính
class `Account`).

</details>

**Câu 3.** (Mục tiêu 2) Dòng nào dưới đây bị javac báo lỗi? Vì sao dòng còn lại thì không?

```java
public class NoteQuiz {
    public static void main(String[] args) {
        final StringBuilder note = new StringBuilder("A");
        note.append("B");
        note = new StringBuilder("C");
        System.out.println(note);
    }
}
```

<details><summary>Đáp án</summary>

Dòng `note = new StringBuilder("C");` (dòng 5):

```text
NoteQuiz.java:5: error: cannot assign a value to final variable note
        note = new StringBuilder("C");
        ^
1 error
```

`note.append("B")` không gán lại `note`, nó chỉ đổi **nội dung** object mà `note` trỏ tới, nên hợp lệ.
`final` khoá tham chiếu, không khoá object [5].

</details>

**Câu 4.** (Mục tiêu 2) Class `Transaction` có `private final String id;` (không gán lúc khai báo) và
hai constructor. Cần điều kiện gì để class biên dịch được?

<details><summary>Đáp án</summary>

`id` là blank final, nên **mỗi** constructor phải gán `id` đúng một lần trước khi kết thúc [6]. Chỉ một
constructor quên gán là javac báo `variable id might not have been initialized`, như lỗi 2 ở phần 2.

</details>

**Câu 5.** (Mục tiêu 3) Không chạy máy, hãy đoán chương trình sau in gì, mỗi chữ một dòng:

```java
public class OrderQuiz {
    public static void main(String[] args) {
        System.out.println("A");
        new Branch();
        new Branch();
    }
}

class Branch {
    Branch() { System.out.println("D"); }
    { System.out.println("C"); }
    static { System.out.println("B"); }
}
```

<details><summary>Đáp án</summary>

```text
A
B
C
D
C
D
```

`A` in trước vì `Branch` chưa được khởi tạo cho tới lần `new` đầu tiên [12]. `B` (static block) chỉ in
một lần. Mỗi `new` in `C` (instance block) rồi mới `D` (thân constructor), dù constructor được viết
phía trên instance block [14].

</details>

**Câu 6.** (Mục tiêu 3) Class `Account` có `static final String BANK_CODE = "ONW";`,
`static int openedCount = 0;` và một static block in một dòng log. `main` chỉ đọc
`Account.BANK_CODE`. Static block có chạy không? Nếu `main` đọc `Account.openedCount` thì sao?

<details><summary>Đáp án</summary>

Đọc `BANK_CODE` thì **không**: đó là constant variable, đọc nó không kích hoạt khởi tạo class [12][5].
Đọc `openedCount` thì **có**: đó là field `static` thường, lần đọc đầu tiên khiến class được khởi tạo,
static block chạy trước khi giá trị được trả về (xem lỗi 2 ở phần 4).

</details>

**Câu 7.** (Mục tiêu 4) Sau từng dòng, object `ACC-001` có còn reachable không?

```java
Account a = new Account("ACC-001");
Account b = a;
a = null;
b = new Account("ACC-002");
```

<details><summary>Đáp án</summary>

Sau dòng 1 và 2: reachable (qua `a`, rồi qua cả `a` lẫn `b`). Sau dòng 3: **vẫn reachable**, vì `b`
còn trỏ tới. Sau dòng 4: `b` trỏ sang object mới, không còn tham chiếu nào tới `ACC-001`, nên nó
**unreachable** và đủ điều kiện bị GC thu hồi [16]. Thu hồi lúc nào thì do JVM quyết định.

</details>

**Câu 8.** (Mục tiêu 4) Một bạn viết `finalize()` để "đóng sổ" khi object bị huỷ. Vì sao không nên,
và nên dùng gì?

<details><summary>Đáp án</summary>

`finalize()` đã bị deprecated để chờ xoá từ Java 18 (JEP 421) [21][23]. JVM không hứa khi nào nó chạy
hay có chạy không [17], nên việc "đóng sổ" có thể trễ hoặc không bao giờ xảy ra. Nên viết một method
rõ ràng như `close()` và gọi chủ động; với tài nguyên thì dùng try-with-resources (Chặng 3), còn
`Cleaner` dành cho trường hợp đặc biệt và vẫn có thể trễ [21][22].

</details>

## Bài tập

**Bài 1 (dễ).** Thêm hằng `static final long MAX_DEPOSIT = 500_000_000;` vào `Account` ở phần 2. Sửa
`deposit` để từ chối số tiền lớn hơn `MAX_DEPOSIT` và ghi `[vượt hạn mức ...]` vào lịch sử. Thử nạp
`600_000_000` rồi in lịch sử.

> 💡 Gợi ý: thêm một nhánh `if` nữa, giống nhánh kiểm tra `MIN_DEPOSIT`. Hằng đọc qua tên class:
> `Account.MAX_DEPOSIT`.

**Bài 2 (vừa).** Viết class `Transaction` có mã tự tăng dạng `TX-0001`, `TX-0002`... Mã là
`private final String id`, được cấp trong **instance block** từ một bộ đếm `private static`. Thêm
method `static int getIssuedCount()`. Tạo 3 giao dịch bằng hai constructor khác nhau
(`Transaction(long amount)` và `Transaction()`), in mã của từng cái và tổng số đã cấp.

> 💡 Gợi ý: `%04d` cho 4 chữ số. Một blank final đã gán trong instance block thì constructor không
> được gán lại nữa, nếu không javac báo `variable id might already have been assigned`.

**Bài 3 (khó hơn).** Viết class `Puzzle` có: một field `static` gán bằng hàm `log(...)`, hai static
block, một field instance gán bằng `log(...)`, hai instance block (một trên, một dưới constructor) và
một constructor in log. **Viết ra giấy** thứ tự bạn dự đoán, rồi tạo hai object và chạy để kiểm tra.
Sau đó thêm dòng `static Puzzle FIRST = new Puzzle();` lên **đầu** class và chạy lại. Giải thích vì sao
log của object `FIRST` xuất hiện **trước** cả static block.

> 💡 Gợi ý: khởi tạo class chạy các dòng gán `static` và static block theo thứ tự viết [13]. Dòng
> `FIRST = new Puzzle()` đứng đầu nên chạy đầu, và nó tạo một object ngay giữa lúc class còn đang
> khởi tạo dở.

## Nguồn tham khảo

1. Oracle, The Java Tutorials: Understanding Class Members (static, hằng). <https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html>
2. JLS 25, §8.3.1.1 static Fields. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.3.1.1>
3. JLS 25, §8.4.3.2 static Methods. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.3.2>
4. Java SE 25 API: `java.util.Formatter` (cú pháp `%03d`). <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Formatter.html>
5. JLS 25, §4.12.4 final Variables (gồm định nghĩa constant variable). <https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.12.4>
6. JLS 25, §8.3.1.2 final Fields. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.3.1.2>
7. JLS 25, §8.4.3.3 final Methods. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.3.3>
8. JLS 25, §8.1.1.2 final Classes. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.1.2>
9. Oracle, The Java Tutorials: Initializing Fields (static block, instance block). <https://docs.oracle.com/javase/tutorial/java/javaOO/initial.html>
10. JLS 25, §8.6 Instance Initializers. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.6>
11. JLS 25, §8.7 Static Initializers. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.7>
12. JLS 25, §12.4.1 When Initialization Occurs. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.4.1>
13. JLS 25, §12.4.2 Detailed Initialization Procedure. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.4.2>
14. JLS 25, §12.5 Creation of New Class Instances. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.5>
15. JLS 25, §8.3.3 Restrictions on Field References in Initializers. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.3.3>
16. Oracle, The Java Tutorials: Using Objects, mục The Garbage Collector. <https://docs.oracle.com/javase/tutorial/java/javaOO/usingobject.html>
17. JLS 25, §12.6 Finalization of Class Instances (§12.6.1: reachable, unreachable). <https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.6>
18. Java SE 25 API: `System.gc()`. <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/System.html#gc()>
19. Java SE 25 API: `java.lang.ref.WeakReference`. <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/ref/WeakReference.html>
20. Java SE 25 API: `Reference.get()`. <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/ref/Reference.html#get()>
21. JEP 421: Deprecate Finalization for Removal (Java 18). <https://openjdk.org/jeps/421>
22. Java SE 25 API: `java.lang.ref.Cleaner`. <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/ref/Cleaner.html>
23. Java SE 25 API: `Object.finalize()`. <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html#finalize()>
24. roadmap.sh: Java Developer Roadmap. <https://roadmap.sh/java>
25. JVMS 25, §2.9.2 Class Initialization Methods (`<clinit>`). <https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-2.html#jvms-2.9.2>
26. JLS 25, §4.12.5 Initial Values of Variables (giá trị mặc định). <https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.12.5>

**Bài tiếp theo:** [Bài 4 · Kế thừa và ghi đè method](/docs/learning/chang-2/ke-thua-va-ghi-de)
