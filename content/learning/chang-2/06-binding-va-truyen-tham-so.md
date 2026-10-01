---
title: "Bài 6 · Binding và truyền tham số"
description: "Java chọn method nào lúc compile, method nào lúc chạy, và vì sao Java luôn truyền tham số theo giá trị, kể cả khi bạn truyền một object Account."
order: 26
tags: [java, chặng-2, oop, binding, polymorphism, pass-by-value]
language: vi
profile: onward-java-course
classification: public-safe
source_repo: none
source_refs:
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.2
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.4.4
  - https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-6.html#jvms-6.5.invokevirtual
  - https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-6.html#jvms-6.5.invokestatic
  - https://docs.oracle.com/en/java/javase/21/docs/specs/man/javap.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.9
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.2.5
  - https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html
  - https://wiki.openjdk.org/display/HotSpot/VirtualCalls
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8.1
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.3
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.11.1
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.3.3
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8.2
  - https://docs.oracle.com/javase/tutorial/java/IandI/override.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.1
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.4.5
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.3.1
  - https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/StringBuilder.html
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/math/BigDecimal.html
verified_with: "openjdk 21.0.9"
verification: ran-locally
verification_note: "Đã chạy 19 chương trình đầy đủ trong bài, 3 chương trình phụ (biến thể thêm @Override ở phần 3, đáp án Câu 3, Câu 6) và 1 chương trình kiểm đáp án Câu 8, bằng openjdk 21.0.9 qua `java File.java`; output dán nguyên văn. Chạy thêm `javac -d out` + `javap -c` cho BindingIntro và NotPolymorphic. Không có phần nào không chạy."
contract_version: 1
---

# Bài 6 · Binding và truyền tham số

> 🎯 **Sau bài này bạn sẽ:**
> 1. Chỉ ra được một lời gọi method được chọn **lúc compile** (static binding) hay **lúc chạy** (dynamic binding), và tìm được dấu vết của lựa chọn đó bằng `javap -c`.
> 2. Dự đoán đúng output khi overload và override cùng xuất hiện trong một lời gọi.
> 3. Giải thích được vì sao field, method `static`, `private`, `final` không đa hình, và sửa được lỗi "tưởng là override nhưng thật ra là overload".
> 4. Vẽ được stack frame khi truyền `long` và khi truyền `Account` vào method, rồi giải thích được vì sao `deposit` qua tham số đổi được số dư còn `swap` thì không.
> 5. Trả lời được câu hỏi checkpoint "Java pass-by-value hay pass-by-reference?" bằng lời và bằng một thí nghiệm, kể cả với `String`.

## Tình huống

Bạn review code của đồng nghiệp. Hàm `swap(Account x, Account y)` chạy không lỗi, nhưng in ra thì `an` vẫn là `ACC-001`, `binh` vẫn là `ACC-002`. Trong khi đó, hàm `topUp(Account acc, long amount)` ngay bên dưới lại nạp tiền thành công. Cùng truyền `Account` vào method, sao một hàm "ăn", một hàm "không ăn"? Và khi gọi `printStatement(acc)`, vì sao Java lại chọn bản dành cho `Account` dù `acc` đang trỏ tới một `SavingAccount`? Bài này trả lời cả hai câu.

**Cần biết trước:** [Chặng 1 · Bài 6 · Nhập môn OOP](/docs/learning/chang-1/nhap-mon-oop) (stack, heap, tham chiếu),
[Bài 2 · Đóng gói và method](/docs/learning/chang-2/dong-goi-va-method) (overloading),
[Bài 3 · static, final và vòng đời object](/docs/learning/chang-2/static-final-vong-doi-object),
[Bài 4 · Kế thừa và ghi đè](/docs/learning/chang-2/ke-thua-va-ghi-de) (`extends`, `@Override`).

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| Binding (gắn kết) | Quyết định "lời gọi này chạy method nào" | `acc.describe()` → bản của `SavingAccount` |
| Static binding | Quyết định xong **lúc compile**, javac chốt luôn | chọn overload, method `static` |
| Dynamic binding | Quyết định **lúc chạy**, JVM nhìn object thật | method được override |
| Kiểu khai báo | Kiểu ghi ở biến, javac chỉ thấy kiểu này | `Account acc` |
| Kiểu thật | Class của object nằm trên heap | `new SavingAccount(...)` |
| Bảng tra method (vtable) | Mỗi class một bảng "tên method → bản sẽ chạy" | ô `monthlyFee` của `SavingAccount` |
| Hiding (che) | Lớp con khai báo trùng tên, nhưng **không** ghi đè | field `type`, method `static` |
| Stack frame (khung) | Vùng nhớ riêng của một lần gọi method | khung của `swap(x, y)` |
| Pass-by-value | Tham số nhận **bản sao giá trị** của đối số | `long`, cả địa chỉ object |
| Bất biến (*immutable*) | Object tạo ra rồi không sửa được nữa | `String`, `BigDecimal` |

💡 **Về cách lưu tiền.** Như Chặng 1 Bài 6, bài này dùng `long` (đơn vị: **đồng**) để code ngắn, vì chỉ cộng trừ số nguyên. Khi cần nhân lãi suất, hãy quay lại `BigDecimal`.

Ôn nhanh (không học lại): `SavingAccount extends Account` nghĩa là `SavingAccount` **là một** `Account`, nên biến `Account acc` trỏ được tới object `SavingAccount`. Ghi đè (*override*) và `@Override` đã học ở [Bài 4](/docs/learning/chang-2/ke-thua-va-ghi-de). Overloading (cùng tên, khác tham số) đã học ở [Bài 2](/docs/learning/chang-2/dong-goi-va-method).

## 1. Binding là gì? Hai thời điểm chọn method

**Ý tưởng nôm na.** Gửi tiền ở ngân hàng có hai bước. Ở sảnh, bạn bấm số theo **loại giấy tờ bạn cầm** ("Gửi tiết kiệm" hay "Giao dịch chung"): bước này chốt trước. Tới quầy, giao dịch viên mới mở **hồ sơ thật** của bạn và làm theo đúng loại tài khoản trong hồ sơ. Java cũng vậy. **Binding** (gắn kết) là việc quyết định một lời gọi method sẽ chạy đoạn code nào. Một phần quyết định xảy ra **lúc compile** (javac, chỉ thấy kiểu khai báo của biến), phần còn lại xảy ra **lúc chạy** (JVM, thấy object thật) [1][2].

<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hai thời điểm chọn method cho câu lệnh Account acc = new SavingAccount. Bước 1, lúc compile, javac chỉ biết kiểu khai báo của acc là Account. Với acc.describe(), javac kiểm tra Account có describe() và ghi vào file .class lệnh invokevirtual Account.describe. Với Account.bankName(), javac ghi lệnh invokestatic Account.bankName: method static đã chọn xong, đây là static binding. Bước 2, lúc chạy, JVM đọc file .class. Với invokestatic, JVM chạy ngay Account.bankName, không cần nhìn object. Với invokevirtual, JVM nhìn object thật là SavingAccount và chạy SavingAccount.describe: đây là dynamic binding.">
  <defs>
    <marker id="c2b6-bind-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="360" y="24" text-anchor="middle" font-family="monospace" font-size="13" fill="#0F172A">Account acc = new SavingAccount("ACC-002", 2_000_000);</text>
    <rect x="10" y="40" width="330" height="250" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="175" y="62" text-anchor="middle" font-size="13" font-weight="bold" fill="#1D4ED8">① Lúc compile (javac)</text>
    <text x="175" y="82" text-anchor="middle" fill="#64748B">chỉ biết KIỂU KHAI BÁO: acc là Account</text>
    <rect x="24" y="96" width="302" height="84" rx="8" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="36" y="116" font-family="monospace" fill="#0F172A">acc.describe()</text>
    <text x="36" y="136" fill="#0F172A">Account có describe()? ✓</text>
    <text x="36" y="156" fill="#64748B">ghi vào .class:</text>
    <text x="36" y="172" font-family="monospace" fill="#1D4ED8">invokevirtual Account.describe</text>
    <rect x="24" y="192" width="302" height="84" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="36" y="212" font-family="monospace" fill="#0F172A">Account.bankName()</text>
    <text x="36" y="232" fill="#0F172A">method static: chọn xong luôn</text>
    <text x="36" y="252" font-family="monospace" fill="#1D4ED8">invokestatic Account.bankName</text>
    <text x="36" y="269" font-weight="bold" fill="#D97706">→ static binding</text>
    <line x1="342" y1="165" x2="376" y2="165" stroke="#64748B" stroke-width="2" marker-end="url(#c2b6-bind-arrow)"/>
    <text x="359" y="155" text-anchor="middle" fill="#64748B">.class</text>
    <rect x="380" y="40" width="330" height="250" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="545" y="62" text-anchor="middle" font-size="13" font-weight="bold" fill="#047857">② Lúc chạy (JVM)</text>
    <text x="545" y="82" text-anchor="middle" fill="#64748B">object thật đã nằm trên heap</text>
    <rect x="394" y="96" width="302" height="84" rx="8" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="406" y="116" font-family="monospace" fill="#1D4ED8">invokevirtual Account.describe</text>
    <text x="406" y="136" fill="#0F172A">nhìn object thật: SavingAccount</text>
    <text x="406" y="156" fill="#0F172A">→ chạy SavingAccount.describe()</text>
    <text x="406" y="172" font-weight="bold" fill="#047857">→ dynamic binding</text>
    <rect x="394" y="192" width="302" height="84" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="406" y="212" font-family="monospace" fill="#1D4ED8">invokestatic Account.bankName</text>
    <text x="406" y="232" fill="#0F172A">không cần object</text>
    <text x="406" y="252" fill="#0F172A">→ chạy đúng Account.bankName()</text>
  </g>
</svg>

```java
public class BindingIntro {
    public static void main(String[] args) {
        // Biến khai báo kiểu Account, nhưng object thật là SavingAccount
        Account acc = new SavingAccount("ACC-002", 2_000_000);

        System.out.println(acc.describe());     // method instance thường
        System.out.println(Account.bankName()); // method static
    }
}

class Account {
    String id;
    long balance; // đơn vị: đồng

    Account(String id, long balance) {
        this.id = id;
        this.balance = balance;
    }

    static String bankName() {
        return "Onward Bank";
    }

    String describe() {
        return "Tài khoản thanh toán " + id;
    }
}

class SavingAccount extends Account {
    SavingAccount(String id, long balance) {
        super(id, balance);
    }

    @Override
    String describe() {
        return "Sổ tiết kiệm " + id;
    }
}
```

**Kết quả khi chạy** (`java BindingIntro.java`):

```text
Sổ tiết kiệm ACC-002
Onward Bank
```

**Giải thích từng bước:**

1. `Account acc = new SavingAccount(...)`: biến có **kiểu khai báo** (*declared type*, còn gọi là kiểu lúc compile) là `Account`. Object trên heap có **kiểu thật** (*runtime class*) là `SavingAccount`.
2. Gặp `acc.describe()`, javac chỉ tra trong `Account` (kiểu khai báo): có `describe()` không, nhận tham số gì. Nó chốt **chữ ký** method (tên + kiểu tham số) và ghi vào file `.class` [1].
3. Lúc chạy, với method instance không phải `private`, JVM bắt đầu tìm từ **class thật của object** (`SavingAccount`). Lớp này có bản ghi đè nên bản đó chạy, in `Sổ tiết kiệm ACC-002` [2]. Đây là **dynamic binding**.
4. `Account.bankName()` là method `static`, không cần object. Nó được chốt hẳn lúc compile, JVM chạy đúng `Account.bankName()` [2]. Đây là **static binding**.

**Nhìn tận mắt bằng `javap`.** Công cụ `javap -c` in ra bytecode trong file `.class` [5]:

```bash
javac -d out BindingIntro.java
javap -c -cp out BindingIntro
```

Hai dòng quan trọng (rút gọn, trích từ output thật):

```text
      17: invokevirtual #22                 // Method Account.describe:()Ljava/lang/String;
      26: invokestatic  #34                 // Method Account.bankName:()Ljava/lang/String;
```

javac ghi `Account.describe`, **không** ghi `SavingAccount.describe`: nó không biết object thật là gì. Lệnh `invokevirtual` bảo JVM "tìm bản phù hợp theo class của object lúc chạy" [3]. Lệnh `invokestatic` gọi thẳng method của class đã ghi, không cần object [4].

### ⚠️ Lỗi hay gặp

**Gọi method chỉ có ở lớp con qua biến kiểu lớp cha.** Lúc compile, javac chỉ thấy kiểu khai báo `Account`, nên không cho gọi `termMonths()`:

```java
public class OnlyInChild {
    public static void main(String[] args) {
        Account acc = new SavingAccount("ACC-002", 2_000_000);
        System.out.println(acc.termMonths()); // termMonths() chỉ có ở SavingAccount
    }
}

class Account {
    String id;
    long balance;

    Account(String id, long balance) {
        this.id = id;
        this.balance = balance;
    }
}

class SavingAccount extends Account {
    SavingAccount(String id, long balance) {
        super(id, balance);
    }

    int termMonths() {
        return 12; // kỳ hạn 12 tháng
    }
}
```

```text
OnlyInChild.java:4: error: cannot find symbol
        System.out.println(acc.termMonths()); // termMonths() chỉ có ở SavingAccount
                              ^
  symbol:   method termMonths()
  location: variable acc of type Account
1 error
error: compilation failed
```

`location: variable acc of type Account`: javac tìm trong `Account` và không thấy. **Cách sửa:** khai báo biến đúng kiểu (`SavingAccount sav = ...`), hoặc đưa method lên `Account` nếu mọi tài khoản đều cần nó.

## 2. Static binding: overload được chọn theo kiểu khai báo

**Ý tưởng nôm na.** Ở sảnh ngân hàng có hai nút lấy số: "Sao kê chung" và "Sao kê sổ tiết kiệm". Máy lấy số chỉ đọc **tờ giấy bạn đưa** (kiểu khai báo), không mở hồ sơ thật. Đưa tờ ghi "Account" thì ra số quầy chung, dù thật ra bạn có sổ tiết kiệm. Chọn **overload** (các method cùng tên, khác kiểu tham số) là việc của javac, làm **lúc compile**, dựa trên số lượng và **kiểu lúc compile** của đối số [1][6].

<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bảng tra overload của javac lúc compile. Có hai ứng viên: printStatement(Account) và printStatement(SavingAccount). Cột trái: lời gọi printStatement(sav), kiểu khai báo của đối số là SavingAccount; cả hai ứng viên đều nhận được, javac chọn ứng viên cụ thể nhất là printStatement(SavingAccount). Cột phải: lời gọi printStatement(acc), kiểu khai báo của đối số là Account; chỉ printStatement(Account) nhận được, ứng viên SavingAccount bị loại vì lúc compile javac không biết acc đang trỏ tới SavingAccount. Dù cả hai biến cùng trỏ tới một object SavingAccount, javac chỉ nhìn kiểu khai báo.">
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="700" height="44" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="22" y="30" font-weight="bold" fill="#0F172A">Ứng viên cùng tên (overload):</text>
    <text x="22" y="46" font-family="monospace" fill="#0F172A">printStatement(Account a)   |   printStatement(SavingAccount s)</text>
    <rect x="10" y="66" width="340" height="224" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="180" y="88" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="#047857">printStatement(sav)</text>
    <text x="180" y="108" text-anchor="middle" fill="#64748B">kiểu khai báo của sav: SavingAccount</text>
    <rect x="24" y="120" width="312" height="30" rx="6" fill="#FFFFFF" stroke="#10B981"/>
    <text x="36" y="140" font-family="monospace" fill="#0F172A">(Account a)</text>
    <text x="324" y="140" text-anchor="end" fill="#047857">✓ nhận được</text>
    <rect x="24" y="158" width="312" height="30" rx="6" fill="#FFFFFF" stroke="#10B981"/>
    <text x="36" y="178" font-family="monospace" fill="#0F172A">(SavingAccount s)</text>
    <text x="324" y="178" text-anchor="end" fill="#047857">✓ nhận được</text>
    <text x="180" y="214" text-anchor="middle" fill="#0F172A">Cả hai đều được → chọn cái CỤ THỂ NHẤT</text>
    <rect x="44" y="228" width="272" height="44" rx="8" fill="#FFFFFF" stroke="#047857" stroke-width="2"/>
    <text x="180" y="255" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#047857">printStatement(SavingAccount)</text>
    <rect x="370" y="66" width="340" height="224" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="540" y="88" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="#1D4ED8">printStatement(acc)</text>
    <text x="540" y="108" text-anchor="middle" fill="#64748B">kiểu khai báo của acc: Account</text>
    <rect x="384" y="120" width="312" height="30" rx="6" fill="#FFFFFF" stroke="#10B981"/>
    <text x="396" y="140" font-family="monospace" fill="#0F172A">(Account a)</text>
    <text x="684" y="140" text-anchor="end" fill="#047857">✓ nhận được</text>
    <rect x="384" y="158" width="312" height="30" rx="6" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="396" y="178" font-family="monospace" fill="#0F172A">(SavingAccount s)</text>
    <text x="684" y="178" text-anchor="end" fill="#DC2626">✗ không nhận</text>
    <text x="540" y="214" text-anchor="middle" fill="#0F172A">javac không biết acc trỏ tới object gì</text>
    <rect x="404" y="228" width="272" height="44" rx="8" fill="#FFFFFF" stroke="#2563EB" stroke-width="2"/>
    <text x="540" y="255" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#1D4ED8">printStatement(Account)</text>
  </g>
</svg>

```java
public class OverloadByDeclaredType {
    // Hai method cùng tên, khác kiểu tham số: overload
    static void printStatement(Account a) {
        System.out.println("Sao kê chung        : " + a.id);
    }

    static void printStatement(SavingAccount s) {
        System.out.println("Sao kê sổ tiết kiệm : " + s.id + ", kỳ hạn " + s.termMonths + " tháng");
    }

    public static void main(String[] args) {
        SavingAccount sav = new SavingAccount("ACC-002", 2_000_000, 12);
        Account acc = sav; // CÙNG một object, nhưng biến khai báo kiểu Account

        printStatement(sav);                  // kiểu khai báo: SavingAccount
        printStatement(acc);                  // kiểu khai báo: Account
        printStatement((SavingAccount) acc);  // ép kiểu: đổi kiểu lúc compile
    }
}

class Account {
    String id;
    long balance; // đơn vị: đồng

    Account(String id, long balance) {
        this.id = id;
        this.balance = balance;
    }
}

class SavingAccount extends Account {
    int termMonths;

    SavingAccount(String id, long balance, int termMonths) {
        super(id, balance);
        this.termMonths = termMonths;
    }
}
```

**Kết quả khi chạy:**

```text
Sao kê sổ tiết kiệm : ACC-002, kỳ hạn 12 tháng
Sao kê chung        : ACC-002
Sao kê sổ tiết kiệm : ACC-002, kỳ hạn 12 tháng
```

**Giải thích từng bước:**

1. `sav` và `acc` trỏ tới **cùng một** object `SavingAccount` (dòng `Account acc = sav;` chỉ chép địa chỉ).
2. `printStatement(sav)`: kiểu khai báo là `SavingAccount`, cả hai overload đều nhận được. javac chọn bản **cụ thể nhất** (*most specific*): `printStatement(SavingAccount)` [7].
3. `printStatement(acc)`: kiểu khai báo là `Account`. Bản nhận `SavingAccount` không dùng được, vì lúc compile javac không biết `acc` trỏ tới gì. Chỉ còn `printStatement(Account)`.
4. `printStatement((SavingAccount) acc)`: phép ép kiểu đổi **kiểu lúc compile** của biểu thức thành `SavingAccount`, nên javac chọn lại bản tiết kiệm. Object thì vẫn là object cũ.

Kết luận: overload **không** nhìn object thật. Đó là static binding.

### ⚠️ Lỗi hay gặp

**Truyền `null` khi có hai overload nhận hai kiểu không liên quan.** `null` hợp với cả `String` lẫn `Account`, mà không bản nào cụ thể hơn bản nào:

```java
public class AmbiguousNull {
    static void lookup(String id) {
        System.out.println("Tìm theo mã: " + id);
    }

    static void lookup(Account acc) {
        System.out.println("Tìm theo object: " + acc);
    }

    public static void main(String[] args) {
        lookup(null); // null hợp với cả String lẫn Account
    }
}

class Account {
}
```

```text
AmbiguousNull.java:11: error: reference to lookup is ambiguous
        lookup(null); // null hợp với cả String lẫn Account
        ^
  both method lookup(String) in AmbiguousNull and method lookup(Account) in AmbiguousNull match
1 error
error: compilation failed
```

**Cách sửa:** đặt tên khác nhau cho hai việc khác nhau (`lookupById(String)`, `lookupByAccount(Account)`), hoặc ép kiểu rõ ràng `lookup((String) null)`.

## 3. Dynamic binding: override được chọn theo kiểu thật

**Ý tưởng nôm na.** Cuối tháng, hệ thống chạy một lệnh chung "thu phí quản lý" cho mọi tài khoản. Giao dịch viên không cần biết trước loại nào: mở hồ sơ thật ra, **tra bảng phí của đúng loại tài khoản đó**. Tài khoản thanh toán thu 11.000 đồng, sổ tiết kiệm miễn phí. Với method được ghi đè, JVM làm y như vậy: chọn bản chạy theo **class thật của object**, không theo kiểu của biến [2][8].

<svg viewBox="0 0 720 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mô hình khái niệm bảng tra method (vtable). Bên trái là stack với hai biến a và b, cùng khai báo kiểu Account. a trỏ tới object ACC-001 trên heap, object này ghi class thật là Account. b trỏ tới object ACC-002, class thật là SavingAccount. Mỗi class có một bảng tra: bảng của Account có ô describe trỏ tới Account.describe và ô monthlyFee trỏ tới Account.monthlyFee. Bảng của SavingAccount có ô describe vẫn là Account.describe vì kế thừa, còn ô monthlyFee được thay bằng SavingAccount.monthlyFee vì ghi đè. Lời gọi acc.monthlyFee() lúc chạy đi theo object thật tới bảng của class đó, lấy ô monthlyFee, nên a cho phí 11000, b cho phí 0.">
  <defs>
    <marker id="c2b6-vt-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
    <marker id="c2b6-vt-arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="130" height="190" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="75" y="32" text-anchor="middle" font-weight="bold" fill="#0F172A">Stack</text>
    <text x="20" y="74" font-family="monospace" fill="#0F172A">Account a</text>
    <rect x="94" y="56" width="36" height="26" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="112" cy="69" r="4" fill="#2563EB"/>
    <text x="20" y="154" font-family="monospace" fill="#0F172A">Account b</text>
    <rect x="94" y="136" width="36" height="26" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="112" cy="149" r="4" fill="#2563EB"/>
    <rect x="170" y="40" width="168" height="58" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="182" y="60" fill="#1D4ED8" font-weight="bold">object ACC-001</text>
    <text x="182" y="84" fill="#64748B">class thật: Account</text>
    <rect x="170" y="120" width="168" height="58" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="182" y="140" fill="#1D4ED8" font-weight="bold">object ACC-002</text>
    <text x="182" y="164" fill="#64748B">class thật: SavingAccount</text>
    <line x1="116" y1="69" x2="166" y2="69" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b6-vt-arrow)"/>
    <line x1="116" y1="149" x2="166" y2="149" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b6-vt-arrow)"/>
    <rect x="380" y="10" width="330" height="88" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="545" y="30" text-anchor="middle" font-weight="bold" fill="#1D4ED8">Bảng tra của Account</text>
    <text x="390" y="56" font-family="monospace" font-size="11" fill="#0F172A">describe   → Account.describe</text>
    <text x="390" y="80" font-family="monospace" font-size="11" fill="#0F172A">monthlyFee → Account.monthlyFee</text>
    <rect x="380" y="112" width="330" height="88" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="545" y="132" text-anchor="middle" font-weight="bold" fill="#047857">Bảng tra của SavingAccount</text>
    <text x="390" y="158" font-family="monospace" font-size="11" fill="#64748B">describe   → Account.describe</text>
    <text x="702" y="158" text-anchor="end" font-size="11" fill="#64748B">kế thừa</text>
    <rect x="386" y="168" width="318" height="22" rx="4" fill="#FFFFFF" stroke="#047857"/>
    <text x="390" y="183" font-family="monospace" font-size="11" fill="#047857">monthlyFee → SavingAccount.monthlyFee</text>
    <text x="700" y="183" text-anchor="end" font-size="11" font-weight="bold" fill="#047857">ghi đè</text>
    <line x1="340" y1="69" x2="376" y2="60" stroke="#64748B" stroke-width="1.5" stroke-dasharray="5 3" marker-end="url(#c2b6-vt-arrow2)"/>
    <line x1="340" y1="149" x2="376" y2="156" stroke="#64748B" stroke-width="1.5" stroke-dasharray="5 3" marker-end="url(#c2b6-vt-arrow2)"/>
    <rect x="10" y="218" width="700" height="102" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="22" y="240" font-weight="bold" fill="#D97706">Lúc chạy, acc.monthlyFee() đi 3 bước:</text>
    <text x="22" y="262" fill="#0F172A">1. Theo tham chiếu tới object thật trên heap.</text>
    <text x="22" y="282" fill="#0F172A">2. Object cho biết class thật của nó → tới bảng tra của class đó.</text>
    <text x="22" y="302" fill="#0F172A">3. Lấy ô monthlyFee: object a → 11000, object b → 0 (bản ghi đè).</text>
    <text x="700" y="302" text-anchor="end" fill="#64748B">(mô hình khái niệm)</text>
  </g>
</svg>

Hình trên là **mô hình khái niệm**. JLS chỉ quy định *kết quả*: tìm từ class thật của object, đi dần lên lớp cha cho tới khi gặp bản ghi đè [2]. Cách cài đặt phổ biến, ví dụ trong HotSpot, là mỗi class có một **vtable** (*virtual method table*, bảng tra method ảo): ô nào lớp con ghi đè thì được thay bằng bản của lớp con [9].

```java
public class DynamicBinding {
    // MỘT dòng code gọi method, nhưng chạy method nào thì tuỳ object thật
    static void endOfMonth(Account acc) {
        System.out.println(acc.describe() + " | object thật: "
                + acc.getClass().getSimpleName() + " | phí: " + acc.monthlyFee());
    }

    public static void main(String[] args) {
        Account a = new Account("ACC-001", 500_000);
        Account b = new SavingAccount("ACC-002", 2_000_000);

        endOfMonth(a);
        endOfMonth(b);
    }
}

class Account {
    String id;
    long balance; // đơn vị: đồng

    Account(String id, long balance) { this.id = id; this.balance = balance; }

    String describe() {
        return "Tài khoản " + id;
    }

    long monthlyFee() {
        return 11_000; // phí quản lý tài khoản thanh toán
    }
}

class SavingAccount extends Account {
    SavingAccount(String id, long balance) {
        super(id, balance);
    }

    // Không ghi đè describe(): dùng lại bản của Account

    @Override
    long monthlyFee() {
        return 0; // sổ tiết kiệm không thu phí quản lý
    }
}
```

**Kết quả khi chạy:**

```text
Tài khoản ACC-001 | object thật: Account | phí: 11000
Tài khoản ACC-002 | object thật: SavingAccount | phí: 0
```

**Giải thích từng bước:**

1. `endOfMonth(Account acc)` chỉ có **một** dòng gọi `acc.monthlyFee()`. javac chốt chữ ký `monthlyFee()` của `Account`.
2. Lần gọi đầu, `acc` trỏ object `Account`: bảng tra của `Account` cho ra `Account.monthlyFee()`, phí `11000`.
3. Lần gọi sau, `acc` trỏ object `SavingAccount`: ô `monthlyFee` trong bảng của `SavingAccount` đã bị thay bằng bản ghi đè, phí `0`.
4. `describe()` không bị ghi đè, nên ô `describe` của `SavingAccount` vẫn trỏ về `Account.describe()`: cả hai dòng đều in `Tài khoản ...`.

Một method instance của lớp con **ghi đè** method của lớp cha khi có cùng chữ ký (tên và kiểu tham số), và method cha truy cập được [10]. Chỉ khi đó ô trong bảng mới bị thay.

### ⚠️ Lỗi hay gặp

**Tưởng là override, thật ra là overload.** Đổi kiểu tham số dù chỉ `long` → `int` là ra một method **mới**, không còn cùng chữ ký:

```java
public class OverloadNotOverride {
    public static void main(String[] args) {
        Account acc = new SavingAccount("ACC-002");
        System.out.println("Phí chuyển: " + acc.transferFee(500_000));
    }
}

class Account {
    String id;

    Account(String id) {
        this.id = id;
    }

    long transferFee(long amount) {
        return 3_300; // phí chuyển khoản thường
    }
}

class SavingAccount extends Account {
    SavingAccount(String id) {
        super(id);
    }

    // Định "ghi đè" để miễn phí, nhưng lỡ đổi long thành int:
    // đây là một method MỚI (overload), không phải override
    long transferFee(int amount) {
        return 0;
    }
}
```

```text
Phí chuyển: 3300
```

Sổ tiết kiệm lẽ ra miễn phí, nhưng vẫn bị thu `3300`. Lúc compile, `acc` có kiểu `Account`, javac chỉ thấy `transferFee(long)` và chốt chữ ký đó. Lúc chạy, `SavingAccount` không có bản ghi đè cho `transferFee(long)`, nên bản của `Account` chạy. **Cách sửa:** luôn đặt `@Override` (Bài 4). Thêm `@Override` ngay trên dòng `long transferFee(int amount)`, javac báo lỗi ngay:

```text
OverloadNotOverride.java:27: error: method does not override or implement a method from a supertype
    @Override
    ^
1 error
error: compilation failed
```

Sau đó đổi tham số về `long amount` cho khớp cha, lỗi biến mất và phí thành `0`.

## 4. Thí nghiệm kinh điển: overload và override trong cùng một lời gọi

**Ý tưởng nôm na.** Ghép hai bước ở ngân hàng: máy lấy số chọn **quầy** theo tờ giấy bạn cầm (overload, lúc compile). Tới quầy, giao dịch viên mở **hồ sơ thật** để làm việc (override, lúc chạy). Hai lựa chọn này độc lập: quầy đã chọn thì không đổi, dù hồ sơ thật là loại khác [6][2].

<svg viewBox="0 0 720 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hai pha của lời gọi teller.serve(a2), với a2 khai báo kiểu Account nhưng trỏ tới object SavingAccount. Pha 1 lúc compile: javac nhìn kiểu khai báo của a2 là Account, nên chọn quầy serve(Account) trong hai overload và ghi cố định vào file .class. Pha 2 lúc chạy: bên trong serve(Account), lời gọi a.kind() là method được ghi đè, JVM nhìn object thật là SavingAccount nên chạy SavingAccount.kind(). Kết quả in ra: quầy serve(Account), kind() = SavingAccount. Overload chọn theo kiểu khai báo, override chọn theo kiểu thật.">
  <defs>
    <marker id="c2b6-two-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="360" y="22" text-anchor="middle" font-family="monospace" font-size="13" fill="#0F172A">Account a2 = new SavingAccount();   teller.serve(a2);</text>
    <rect x="10" y="38" width="340" height="180" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="180" y="60" text-anchor="middle" font-size="13" font-weight="bold" fill="#1D4ED8">Pha 1 · compile: chọn OVERLOAD</text>
    <text x="180" y="80" text-anchor="middle" fill="#64748B">nhìn kiểu khai báo của a2: Account</text>
    <rect x="30" y="94" width="300" height="30" rx="6" fill="#FFFFFF" stroke="#2563EB" stroke-width="2"/>
    <text x="42" y="114" font-family="monospace" fill="#1D4ED8">serve(Account a)</text>
    <text x="318" y="114" text-anchor="end" fill="#047857">✓ được chọn</text>
    <rect x="30" y="132" width="300" height="30" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="42" y="152" font-family="monospace" fill="#64748B">serve(SavingAccount s)</text>
    <text x="318" y="152" text-anchor="end" fill="#DC2626">✗ không nhận</text>
    <text x="180" y="186" text-anchor="middle" fill="#0F172A">ghi cố định vào .class:</text>
    <text x="180" y="204" text-anchor="middle" font-family="monospace" fill="#1D4ED8">Teller.serve(Account)</text>
    <line x1="352" y1="128" x2="366" y2="128" stroke="#64748B" stroke-width="2" marker-end="url(#c2b6-two-arrow)"/>
    <rect x="370" y="38" width="340" height="180" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="540" y="60" text-anchor="middle" font-size="13" font-weight="bold" fill="#047857">Pha 2 · chạy: chọn OVERRIDE</text>
    <text x="540" y="80" text-anchor="middle" fill="#64748B">trong serve(Account): a.kind()</text>
    <rect x="390" y="94" width="300" height="30" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="402" y="114" fill="#0F172A">object thật mà a trỏ tới:</text>
    <text x="678" y="114" text-anchor="end" font-family="monospace" fill="#1D4ED8">SavingAccount</text>
    <rect x="390" y="132" width="300" height="30" rx="6" fill="#FFFFFF" stroke="#047857" stroke-width="2"/>
    <text x="402" y="152" font-family="monospace" fill="#047857">SavingAccount.kind()</text>
    <text x="678" y="152" text-anchor="end" fill="#047857">✓ được chạy</text>
    <text x="540" y="186" text-anchor="middle" fill="#0F172A">bảng tra của SavingAccount:</text>
    <text x="540" y="204" text-anchor="middle" font-family="monospace" fill="#047857">kind → SavingAccount.kind</text>
    <rect x="10" y="232" width="700" height="48" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="360" y="252" text-anchor="middle" font-family="monospace" fill="#0F172A">quầy serve(Account)       → kind() = SavingAccount</text>
    <text x="360" y="271" text-anchor="middle" fill="#D97706">Quầy chọn theo kiểu KHAI BÁO · việc làm trong quầy chọn theo kiểu THẬT</text>
  </g>
</svg>

```java
public class ClassicExperiment {
    public static void main(String[] args) {
        Teller teller = new Teller();

        Account a1 = new Account();          // khai báo Account, object Account
        Account a2 = new SavingAccount();    // khai báo Account, object SavingAccount
        SavingAccount s = new SavingAccount(); // khai báo SavingAccount, object SavingAccount

        teller.serve(a1);
        teller.serve(a2);
        teller.serve(s);
        teller.serve((Account) s);           // ép kiểu lên Account
    }
}

// Giao dịch viên có hai quầy (overload): chọn quầy theo KIỂU KHAI BÁO
class Teller {
    void serve(Account a) {
        System.out.println("quầy serve(Account)       → kind() = " + a.kind());
    }

    void serve(SavingAccount s) {
        System.out.println("quầy serve(SavingAccount) → kind() = " + s.kind());
    }
}

// kind() được ghi đè (override): chọn bản chạy theo OBJECT THẬT
class Account {
    String kind() {
        return "Account";
    }
}

class SavingAccount extends Account {
    @Override
    String kind() {
        return "SavingAccount";
    }
}
```

**Kết quả khi chạy:**

```text
quầy serve(Account)       → kind() = Account
quầy serve(Account)       → kind() = SavingAccount
quầy serve(SavingAccount) → kind() = SavingAccount
quầy serve(Account)       → kind() = SavingAccount
```

**Giải thích từng bước:**

1. `teller.serve(a1)`: `a1` khai báo `Account` → quầy `serve(Account)`. Object thật là `Account` → `kind()` của `Account`.
2. `teller.serve(a2)`: **dòng quan trọng nhất**. `a2` khai báo `Account` → vẫn quầy `serve(Account)` (pha 1). Nhưng bên trong, `a.kind()` nhìn object thật là `SavingAccount` → in `SavingAccount` (pha 2).
3. `teller.serve(s)`: `s` khai báo `SavingAccount` → quầy `serve(SavingAccount)`, cụ thể nhất [7].
4. `teller.serve((Account) s)`: ép kiểu lên `Account` đổi **quầy** (về `serve(Account)`), nhưng **không đổi object**: `kind()` vẫn là `SavingAccount`.

Ghi nhớ một câu: **overload chọn theo kiểu khai báo, override chọn theo kiểu thật.**

### ⚠️ Lỗi hay gặp

**Dùng overload để "phân loại" phần tử trong mảng.** Biến vòng lặp có kiểu khai báo `Account`, nên javac luôn chọn một overload duy nhất:

```java
public class LoopOverload {
    static String fee(Account a) {
        return "phí 11000";
    }

    static String fee(SavingAccount s) {
        return "miễn phí";
    }

    public static void main(String[] args) {
        Account[] accounts = { new Account(), new SavingAccount() };
        for (Account acc : accounts) {
            // acc có kiểu khai báo Account → javac luôn chọn fee(Account)
            System.out.println(acc.getClass().getSimpleName() + ": " + fee(acc));
        }
    }
}

class Account {
}

class SavingAccount extends Account {
}
```

```text
Account: phí 11000
SavingAccount: phí 11000
```

**Cách sửa:** chuyển phần "khác nhau theo loại" vào một method instance rồi ghi đè nó, để JVM chọn theo object thật:

```java
public class LoopOverride {
    public static void main(String[] args) {
        Account[] accounts = { new Account(), new SavingAccount() };
        for (Account acc : accounts) {
            // fee() là method instance được ghi đè → JVM chọn theo object thật
            System.out.println(acc.getClass().getSimpleName() + ": " + acc.fee());
        }
    }
}

class Account {
    String fee() {
        return "phí 11000";
    }
}

class SavingAccount extends Account {
    @Override
    String fee() {
        return "miễn phí";
    }
}
```

```text
Account: phí 11000
SavingAccount: miễn phí
```

## 5. Những thứ không đa hình: field, `static`, `private`, `final`

**Ý tưởng nôm na.** Bảng tra phí ở phần 3 chỉ áp dụng cho **dịch vụ có thể thay theo loại tài khoản** (method instance được ghi đè). Những thứ còn lại giống **thông tin in sẵn trên tờ giấy** bạn cầm: đọc tờ nào thì thấy chữ của tờ đó. Field, method `static`, method `private` đều được chốt lúc compile [11][12][2]. Method `final` thì không lớp con nào ghi đè được, nên luôn chỉ có một bản để chạy [13].

<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Field bị che, không đa hình. Bên trái: một object SavingAccount trên heap chứa HAI field tên type: phần thừa hưởng từ Account có type bằng ACCOUNT, phần riêng của SavingAccount có type bằng SAVING. Biến acc khai báo kiểu Account đọc field type của phần Account, ra ACCOUNT. Biến sav khai báo kiểu SavingAccount đọc phần SavingAccount, ra SAVING. Cả hai biến trỏ tới object cùng loại, nhưng field được chọn theo kiểu khai báo lúc compile. Bên phải: bảng phân loại. Chọn lúc compile, static binding: chọn overload, field, method static, method private, method final. Chọn lúc chạy, dynamic binding: method instance được ghi đè.">
  <defs>
    <marker id="c2b6-st-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="190" y="22" text-anchor="middle" font-weight="bold" fill="#0F172A">Một object SavingAccount có HAI field type</text>
    <text x="20" y="84" font-family="monospace" fill="#0F172A">Account acc</text>
    <rect x="112" y="68" width="30" height="24" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="127" cy="80" r="4" fill="#2563EB"/>
    <text x="20" y="194" font-family="monospace" fill="#0F172A">SavingAccount sav</text>
    <rect x="150" y="178" width="30" height="24" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="165" cy="190" r="4" fill="#2563EB"/>
    <rect x="200" y="40" width="160" height="190" rx="10" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="280" y="60" text-anchor="middle" fill="#1D4ED8" font-weight="bold">object SavingAccount</text>
    <rect x="212" y="70" width="136" height="64" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="220" y="88" fill="#64748B">phần Account</text>
    <text x="220" y="116" font-family="monospace" fill="#0F172A">type="ACCOUNT"</text>
    <rect x="212" y="146" width="136" height="64" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="220" y="164" fill="#64748B">phần SavingAccount</text>
    <text x="220" y="192" font-family="monospace" fill="#0F172A">type="SAVING"</text>
    <line x1="131" y1="80" x2="208" y2="104" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b6-st-arrow)"/>
    <line x1="169" y1="190" x2="208" y2="186" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b6-st-arrow)"/>
    <text x="20" y="258" font-family="monospace" fill="#1D4ED8">acc.type → "ACCOUNT"</text>
    <text x="200" y="258" font-family="monospace" fill="#047857">sav.type → "SAVING"</text>
    <text x="20" y="282" fill="#64748B">field: chọn theo KIỂU KHAI BÁO, không theo object</text>
    <rect x="390" y="10" width="320" height="200" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="550" y="32" text-anchor="middle" font-weight="bold" fill="#D97706">Chọn lúc compile (static binding)</text>
    <text x="406" y="58" fill="#0F172A">• chọn overload nào</text>
    <text x="406" y="82" fill="#0F172A">• field (kể cả field bị che)</text>
    <text x="406" y="106" fill="#0F172A">• method static (chỉ che, không ghi đè)</text>
    <text x="406" y="130" fill="#0F172A">• method private (lớp con không thấy)</text>
    <text x="406" y="154" fill="#0F172A">• method final (không ai ghi đè được,</text>
    <text x="418" y="174" fill="#0F172A">nên chỉ có một bản để chạy)</text>
    <rect x="390" y="222" width="320" height="68" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="550" y="244" text-anchor="middle" font-weight="bold" fill="#047857">Chọn lúc chạy (dynamic binding)</text>
    <text x="406" y="270" fill="#0F172A">• method instance được ghi đè (override)</text>
  </g>
</svg>

```java
public class NotPolymorphic {
    public static void main(String[] args) {
        SavingAccount sav = new SavingAccount();
        Account acc = sav; // CÙNG object, khác kiểu khai báo

        System.out.println("1. field     acc.type        = " + acc.type);
        System.out.println("2. field     sav.type        = " + sav.type);
        System.out.println("3. static    acc.bankName()  = " + acc.bankName());
        System.out.println("4. private   acc.report()    = " + acc.report());
        System.out.println("5. final     acc.currency()  = " + acc.currency());
        System.out.println("6. override  acc.describe()  = " + acc.describe());
    }
}

class Account {
    String type = "ACCOUNT";
    static String bankName() { return "Onward Bank"; }
    private String note() { return "ghi chú của Account"; }
    String report() { return note(); }     // gọi method private từ bên trong Account
    final String currency() { return "VND"; }
    String describe() { return "Account"; }
}

class SavingAccount extends Account {
    String type = "SAVING";                               // field trùng tên: CHE field cha
    static String bankName() { return "Onward Savings"; } // static trùng chữ ký: CHE, không ghi đè
    private String note() { return "ghi chú của SavingAccount"; } // method mới, không ghi đè
    @Override
    String describe() { return "SavingAccount"; }         // ghi đè thật sự
}
```

**Kết quả khi chạy:**

```text
1. field     acc.type        = ACCOUNT
2. field     sav.type        = SAVING
3. static    acc.bankName()  = Onward Bank
4. private   acc.report()    = ghi chú của Account
5. final     acc.currency()  = VND
6. override  acc.describe()  = SavingAccount
```

**Giải thích từng bước:**

1. **Field bị che** (*field hiding*): `SavingAccount` khai báo field `type` trùng tên, nên mỗi object `SavingAccount` có **hai** field `type`. Field được chọn theo kiểu khai báo của biểu thức, không theo object thật [11][12]: `acc.type` ra `ACCOUNT`, `sav.type` ra `SAVING`, dù là cùng một object. Dùng `javap -c` bạn sẽ thấy javac ghi thẳng `getfield ... Account.type` và `getfield ... SavingAccount.type`.
2. **Method `static` bị che, không bị ghi đè** [14][15]: `acc.bankName()` được javac đổi thành lời gọi `Account.bankName()` theo kiểu khai báo. Gọi method `static` qua biến dễ gây hiểu nhầm, nên luôn gọi bằng tên class.
3. **Method `private`**: `SavingAccount.note()` là method mới, không ghi đè được `Account.note()` vì lớp con không thấy method `private` của cha. Khi method được gọi là `private`, JLS nói chính nó là method sẽ chạy, không tra theo object [2][13]. Nên `report()` luôn gọi `note()` của `Account`.
4. **Method `final`**: không lớp con nào ghi đè được [13], nên `currency()` chỉ có một bản.
5. **Đối chứng**: `describe()` được ghi đè thật sự, nên chọn theo object thật, ra `SavingAccount`.

💡 Nếu xem bằng `javap -c`, bạn sẽ thấy lời gọi `report()`, `currency()` vẫn là `invokevirtual`. "Static binding" ở đây nói về **kết quả**: cái gì chạy đã chắc chắn từ lúc compile, vì quy tắc ngôn ngữ không cho bản nào khác thay vào [2][13].

### ⚠️ Lỗi hay gặp

**Lỗi 1: cố ghi đè method `final`.**

```java
public class OverrideFinal {
    public static void main(String[] args) {
        System.out.println(new SavingAccount().currency());
    }
}

class Account {
    final String currency() {
        return "VND";
    }
}

class SavingAccount extends Account {
    String currency() { // cố ghi đè method final
        return "USD";
    }
}
```

```text
OverrideFinal.java:14: error: currency() in SavingAccount cannot override currency() in Account
    String currency() { // cố ghi đè method final
           ^
  overridden method is final
1 error
error: compilation failed
```

**Cách sửa:** nếu lớp cha cố ý khoá (`final`), đừng ghi đè. Cần hành vi khác thì thêm method mới với tên khác.

**Lỗi 2: đặt `@Override` lên method `static`**, tưởng là ghi đè:

```java
public class OverrideStatic {
    public static void main(String[] args) {
        System.out.println(SavingAccount.bankName());
    }
}

class Account {
    static String bankName() {
        return "Onward Bank";
    }
}

class SavingAccount extends Account {
    @Override // tưởng là ghi đè method static
    static String bankName() {
        return "Onward Savings";
    }
}
```

```text
OverrideStatic.java:14: error: static methods cannot be annotated with @Override
    @Override // tưởng là ghi đè method static
    ^
1 error
error: compilation failed
```

**Cách sửa:** bỏ `@Override` và nhớ rằng đây chỉ là **che** (*hide*). Nếu bạn muốn đa hình thật, dùng method instance.

## 6. Truyền tham số: Java chép giá trị vào khung mới

**Ý tưởng nôm na.** Khi bạn đưa giao dịch viên một **bản photo** sổ tiết kiệm, họ gạch xoá trên bản photo thế nào thì cuốn sổ gốc trong túi bạn vẫn y nguyên. Mỗi lần gọi method, JVM tạo một **stack frame** (khung) mới, rồi **chép giá trị** của từng đối số vào các biến tham số mới tinh trong khung đó [16][17]. Cơ chế này gọi là **pass-by-value** (truyền theo giá trị). Với kiểu nguyên thuỷ như `long`, "giá trị" chính là con số [19].

<svg viewBox="0 0 720 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stack khi gọi addInterest(balance, 50_000). Khung của main chứa biến balance bằng 1000000. Khi gọi method, JVM tạo một khung mới cho addInterest, chứa hai tham số mới: balance nhận bản sao 1000000 và interest nhận 50000. Trong addInterest, balance đổi thành 1050000, nhưng đó là ô nhớ của khung addInterest. Khi method return, khung addInterest bị bỏ đi, balance trong main vẫn là 1000000.">
  <defs>
    <marker id="c2b6-prim-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#D97706"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="360" y="22" text-anchor="middle" font-family="monospace" font-size="13" fill="#0F172A">addInterest(balance, 50_000);</text>
    <rect x="10" y="40" width="300" height="200" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="160" y="62" text-anchor="middle" font-weight="bold" fill="#0F172A">Khung của main()</text>
    <text x="30" y="122" font-family="monospace" fill="#0F172A">balance</text>
    <rect x="130" y="102" width="150" height="30" rx="4" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="205" y="122" text-anchor="middle" font-family="monospace" fill="#0F172A">1000000</text>
    <text x="160" y="210" text-anchor="middle" fill="#047857">sau khi return: vẫn 1000000 ✓</text>
    <rect x="410" y="40" width="300" height="200" rx="10" fill="#FFFBEB" stroke="#D97706" stroke-dasharray="6 4"/>
    <text x="560" y="62" text-anchor="middle" font-weight="bold" fill="#D97706">Khung MỚI của addInterest()</text>
    <text x="430" y="122" font-family="monospace" fill="#0F172A">balance</text>
    <rect x="530" y="102" width="160" height="30" rx="4" fill="#FFFFFF" stroke="#D97706"/>
    <text x="610" y="122" text-anchor="middle" font-family="monospace" fill="#0F172A">1000000 → 1050000</text>
    <text x="430" y="166" font-family="monospace" fill="#0F172A">interest</text>
    <rect x="530" y="146" width="160" height="30" rx="4" fill="#FFFFFF" stroke="#D97706"/>
    <text x="610" y="166" text-anchor="middle" font-family="monospace" fill="#0F172A">50000</text>
    <text x="560" y="210" text-anchor="middle" fill="#64748B">return xong: cả khung bị bỏ đi</text>
    <path d="M205,100 V84 H610 V96" fill="none" stroke="#D97706" stroke-width="2" marker-end="url(#c2b6-prim-arrow)"/>
    <text x="360" y="78" text-anchor="middle" font-weight="bold" fill="#D97706">chép GIÁ TRỊ 1000000</text>
    <text x="360" y="268" text-anchor="middle" fill="#0F172A">Hai biến cùng tên balance, nhưng là HAI ô nhớ ở hai khung khác nhau.</text>
  </g>
</svg>

```java
public class PrimitiveByValue {
    // balance ở đây là biến MỚI của addInterest, nhận BẢN SAO giá trị
    static void addInterest(long balance, long interest) {
        balance = balance + interest;
        System.out.println("  trong addInterest: balance = " + balance);
    }

    // Cách đúng: trả kết quả về, để bên gọi tự gán
    static long withInterest(long balance, long interest) {
        return balance + interest;
    }

    public static void main(String[] args) {
        long balance = 1_000_000; // đơn vị: đồng

        System.out.println("trước khi gọi      : balance = " + balance);
        addInterest(balance, 50_000);
        System.out.println("sau addInterest    : balance = " + balance);

        balance = withInterest(balance, 50_000);
        System.out.println("sau withInterest   : balance = " + balance);
    }
}
```

**Kết quả khi chạy:**

```text
trước khi gọi      : balance = 1000000
  trong addInterest: balance = 1050000
sau addInterest    : balance = 1000000
sau withInterest   : balance = 1050000
```

**Giải thích từng bước:**

1. `main` có biến `balance = 1000000` trong khung của `main`.
2. Gọi `addInterest(balance, 50_000)`: JVM tạo khung mới. Tham số `balance` của `addInterest` là **biến khác**, chỉ nhận bản sao `1000000` [16].
3. `balance = balance + interest` sửa ô nhớ trong khung `addInterest` thành `1050000`.
4. Method kết thúc, khung bị bỏ đi. `balance` của `main` chưa từng bị đụng tới: vẫn `1000000` [19].
5. Muốn đổi biến của bên gọi, hãy **trả kết quả về** và để bên gọi tự gán: `balance = withInterest(balance, 50_000);`.

### ⚠️ Lỗi hay gặp

**Lỗi 1: viết method `void` "cộng lãi" cho một biến `long`.** Đó chính là `addInterest` ở trên: chạy không lỗi, nhưng số dư không đổi. **Cách sửa:** trả về giá trị mới như `withInterest`.

**Lỗi 2: vô tình gán lại tham số rồi tưởng đã sửa biến bên ngoài.** Đánh dấu tham số là `final` để javac chặn ngay [16]:

```java
public class FinalParam {
    static void addInterest(final long balance, long interest) {
        balance = balance + interest; // tham số final: không cho gán lại
    }

    public static void main(String[] args) {
        addInterest(1_000_000, 50_000);
    }
}
```

```text
FinalParam.java:3: error: final parameter balance may not be assigned
        balance = balance + interest; // tham số final: không cho gán lại
        ^
1 error
error: compilation failed
```

**Cách sửa:** dùng một biến cục bộ mới (`long newBalance = balance + interest;`) rồi `return newBalance;`.

## 7. Truyền reference: đổi được object, không đổi được biến của bên gọi

**Ý tưởng nôm na.** Biến kiểu `Account` giống **tấm thẻ ghi số két sắt** (Chặng 1 Bài 6). Truyền nó vào method là đưa giao dịch viên một **tấm thẻ photo** cùng số két. Họ mở két nạp thêm tiền thì bạn thấy ngay, vì chỉ có một két. Nhưng họ tẩy số trên tấm thẻ photo rồi ghi số két khác, thì thẻ gốc của bạn vẫn ghi số cũ. Giá trị của biến kiểu class là một **reference** (tham chiếu, có thể hình dung như địa chỉ) trỏ tới object [18]. Khi truyền vào method, Java chép **giá trị địa chỉ** đó, không chép object, và cũng không đưa chính biến của bên gọi [16][19].

<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Truyền reference vào method. Panel trái, topUp(an, 100_000): biến an trong khung main và tham số acc trong khung topUp giữ hai bản sao của cùng một địa chỉ, cùng trỏ tới object ACC-001 trên heap. acc.deposit sửa chính object đó, số dư từ 500000 thành 600000, nên bên gọi thấy thay đổi. Panel phải, replace(an): tham số acc lúc đầu trỏ tới ACC-001, sau lệnh acc = new Account thì acc trỏ sang object mới ACC-999 có số dư 1000. Biến an trong main không bị đụng tới, vẫn trỏ ACC-001 với số dư 600000.">
  <defs>
    <marker id="c2b6-ref-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
    <marker id="c2b6-ref-old" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#94A3B8"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="340" height="280" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="180" y="32" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="#047857">topUp(an, 100_000)</text>
    <rect x="22" y="48" width="122" height="170" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="83" y="66" text-anchor="middle" fill="#64748B">Stack</text>
    <text x="30" y="96" fill="#64748B">main</text>
    <text x="30" y="114" font-family="monospace" fill="#0F172A">an</text>
    <rect x="92" y="98" width="36" height="24" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="110" cy="110" r="4" fill="#2563EB"/>
    <text x="30" y="168" fill="#64748B">topUp</text>
    <text x="30" y="186" font-family="monospace" fill="#0F172A">acc</text>
    <rect x="92" y="170" width="36" height="24" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="110" cy="182" r="4" fill="#2563EB"/>
    <rect x="190" y="110" width="148" height="66" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="200" y="130" font-weight="bold" fill="#1D4ED8">ACC-001</text>
    <text x="200" y="150" fill="#64748B">balance</text>
    <text x="200" y="168" font-family="monospace" fill="#047857">500000 → 600000</text>
    <line x1="114" y1="110" x2="186" y2="130" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b6-ref-arrow)"/>
    <line x1="114" y1="182" x2="186" y2="160" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b6-ref-arrow)"/>
    <text x="180" y="244" text-anchor="middle" fill="#0F172A">Hai bản sao địa chỉ, cùng MỘT object.</text>
    <text x="180" y="264" text-anchor="middle" font-weight="bold" fill="#047857">Sửa object → bên gọi thấy ✓</text>
    <rect x="370" y="10" width="340" height="280" rx="10" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="540" y="32" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="#DC2626">replace(an)</text>
    <rect x="382" y="48" width="122" height="170" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="443" y="66" text-anchor="middle" fill="#64748B">Stack</text>
    <text x="390" y="96" fill="#64748B">main</text>
    <text x="390" y="114" font-family="monospace" fill="#0F172A">an</text>
    <rect x="452" y="98" width="36" height="24" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="470" cy="110" r="4" fill="#2563EB"/>
    <text x="390" y="168" fill="#64748B">replace</text>
    <text x="390" y="186" font-family="monospace" fill="#0F172A">acc</text>
    <rect x="452" y="170" width="36" height="24" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="470" cy="182" r="4" fill="#2563EB"/>
    <rect x="550" y="56" width="148" height="56" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="560" y="76" font-weight="bold" fill="#1D4ED8">ACC-001</text>
    <text x="560" y="98" font-family="monospace" fill="#0F172A">balance 600000</text>
    <rect x="550" y="150" width="148" height="56" rx="8" fill="#FFFFFF" stroke="#DC2626"/>
    <text x="560" y="170" font-weight="bold" fill="#DC2626">ACC-999 (mới)</text>
    <text x="560" y="192" font-family="monospace" fill="#0F172A">balance 1000</text>
    <line x1="474" y1="110" x2="546" y2="88" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b6-ref-arrow)"/>
    <line x1="474" y1="182" x2="546" y2="100" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#c2b6-ref-old)"/>
    <line x1="474" y1="182" x2="546" y2="178" stroke="#DC2626" stroke-width="1.5" marker-end="url(#c2b6-ref-arrow)"/>
    <text x="540" y="244" text-anchor="middle" fill="#0F172A">acc = new ... chỉ đổi BẢN SAO (nét đứt → nét liền).</text>
    <text x="540" y="264" text-anchor="middle" font-weight="bold" fill="#DC2626">Gán lại tham số → bên gọi không thấy ✗</text>
  </g>
</svg>

```java
public class ReferenceByValue {
    // 1. Gọi method trên object qua tham số: object bị đổi, bên gọi thấy
    static void topUp(Account acc, long amount) {
        acc.deposit(amount);
    }

    // 2. Gán lại tham số: chỉ đổi BẢN SAO địa chỉ, bên gọi không thấy
    static void replace(Account acc) {
        acc = new Account("ACC-999", 0);
        acc.deposit(1_000);
    }

    // 3. Đổi chỗ hai tham số: cũng chỉ đổi hai bản sao
    static void swap(Account x, Account y) {
        Account tmp = x;
        x = y;
        y = tmp;
        System.out.println("  trong swap: x = " + x + ", y = " + y);
    }

    public static void main(String[] args) {
        Account an = new Account("ACC-001", 500_000);
        Account binh = new Account("ACC-002", 2_000_000);

        topUp(an, 100_000);
        System.out.println("sau topUp  : an = " + an);
        replace(an);
        System.out.println("sau replace: an = " + an);
        swap(an, binh);
        System.out.println("sau swap   : an = " + an + ", binh = " + binh);
    }
}

class Account {
    String id;
    long balance; // đơn vị: đồng

    Account(String id, long balance) { this.id = id; this.balance = balance; }

    void deposit(long amount) { balance = balance + amount; }

    @Override
    public String toString() { return id + "(" + balance + ")"; }
}
```

**Kết quả khi chạy:**

```text
sau topUp  : an = ACC-001(600000)
sau replace: an = ACC-001(600000)
  trong swap: x = ACC-002(2000000), y = ACC-001(600000)
sau swap   : an = ACC-001(600000), binh = ACC-002(2000000)
```

**Giải thích từng bước:**

1. `topUp(an, 100_000)`: tham số `acc` nhận bản sao địa chỉ của `an`. Hai bản sao cùng trỏ object `ACC-001`, nên `acc.deposit(...)` sửa **chính object đó**: `600000` [19].
2. `replace(an)`: dòng `acc = new Account(...)` chỉ ghi địa chỉ mới vào **bản sao** `acc`. Object `ACC-999` được nạp `1000` rồi bị bỏ lại khi method kết thúc. `an` vẫn trỏ `ACC-001`.
3. `swap(an, binh)`: `x`, `y` là hai bản sao. Ba lệnh hoán đổi tráo hai bản sao (dòng in "trong swap" chứng minh), nhưng `an`, `binh` trong `main` không hề bị đụng tới.

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vì sao swap(an, binh) không đổi được. Khung main có hai biến an trỏ tới object ACC-001 và binh trỏ tới object ACC-002. Khi gọi swap, khung swap nhận hai bản sao: x trỏ ACC-001, y trỏ ACC-002. Ba lệnh tmp = x; x = y; y = tmp chỉ tráo hai bản sao, nên cuối cùng x trỏ ACC-002 và y trỏ ACC-001, vẽ bằng mũi tên đỏ chéo nhau. Hai mũi tên xanh của an và binh trong main vẫn y nguyên. Khi swap return, khung của nó bị bỏ đi, an vẫn là ACC-001 và binh vẫn là ACC-002.">
  <defs>
    <marker id="c2b6-swap-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
    <marker id="c2b6-swap-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="180" height="110" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="100" y="32" text-anchor="middle" font-weight="bold" fill="#0F172A">Khung main()</text>
    <text x="26" y="66" font-family="monospace" fill="#0F172A">an</text>
    <rect x="130" y="50" width="36" height="24" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="148" cy="62" r="4" fill="#2563EB"/>
    <text x="26" y="102" font-family="monospace" fill="#0F172A">binh</text>
    <rect x="130" y="86" width="36" height="24" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="148" cy="98" r="4" fill="#2563EB"/>
    <rect x="10" y="150" width="180" height="110" rx="10" fill="#FEF2F2" stroke="#DC2626" stroke-dasharray="6 4"/>
    <text x="100" y="172" text-anchor="middle" font-weight="bold" fill="#DC2626">Khung swap(x, y)</text>
    <text x="26" y="206" font-family="monospace" fill="#0F172A">x</text>
    <rect x="130" y="190" width="36" height="24" rx="4" fill="#FFFFFF" stroke="#DC2626"/>
    <circle cx="148" cy="202" r="4" fill="#DC2626"/>
    <text x="26" y="242" font-family="monospace" fill="#0F172A">y</text>
    <rect x="130" y="226" width="36" height="24" rx="4" fill="#FFFFFF" stroke="#DC2626"/>
    <circle cx="148" cy="238" r="4" fill="#DC2626"/>
    <rect x="400" y="40" width="170" height="60" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="412" y="62" font-weight="bold" fill="#1D4ED8">ACC-001</text>
    <text x="412" y="84" font-family="monospace" fill="#0F172A">balance 600000</text>
    <rect x="400" y="170" width="170" height="60" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="412" y="192" font-weight="bold" fill="#1D4ED8">ACC-002</text>
    <text x="412" y="214" font-family="monospace" fill="#0F172A">balance 2000000</text>
    <line x1="152" y1="62" x2="396" y2="62" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b6-swap-blue)"/>
    <line x1="152" y1="98" x2="396" y2="186" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b6-swap-blue)"/>
    <line x1="152" y1="202" x2="396" y2="208" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="6 3" marker-end="url(#c2b6-swap-red)"/>
    <line x1="152" y1="238" x2="396" y2="88" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="6 3" marker-end="url(#c2b6-swap-red)"/>
    <rect x="590" y="40" width="120" height="190" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="650" y="62" text-anchor="middle" font-weight="bold" fill="#D97706">Sau swap</text>
    <text x="602" y="90" font-family="monospace" fill="#DC2626">x → ACC-002</text>
    <text x="602" y="110" font-family="monospace" fill="#DC2626">y → ACC-001</text>
    <line x1="600" y1="124" x2="700" y2="124" stroke="#D97706"/>
    <text x="602" y="146" font-family="monospace" fill="#1D4ED8">an → ACC-001</text>
    <text x="602" y="166" font-family="monospace" fill="#1D4ED8">binh→ ACC-002</text>
    <text x="650" y="196" text-anchor="middle" fill="#0F172A">main không</text>
    <text x="650" y="214" text-anchor="middle" fill="#0F172A">bị ảnh hưởng</text>
    <text x="400" y="262" fill="#64748B">nét đứt đỏ: hai bản sao đã bị tráo trong khung swap</text>
  </g>
</svg>

Nhìn hình: mũi tên xanh (biến của `main`) không đổi. Chỉ mũi tên đỏ nét đứt (bản sao trong khung `swap`) bị tráo, rồi biến mất cùng khung khi method return [17].

### ⚠️ Lỗi hay gặp

**Lỗi 1: viết `swap(Account x, Account y)` để đổi chỗ hai tài khoản.** Như trên, không có tác dụng. **Cách sửa:** đổi chỗ hai **phần tử** của một object dùng chung, ví dụ một mảng. Mảng là object, hai bên cùng trỏ tới nó:

```java
public class SwapInArray {
    // Đổi chỗ hai PHẦN TỬ của một mảng: mảng là object dùng chung, nên bên gọi thấy
    static void swap(Account[] queue, int i, int j) {
        Account tmp = queue[i];
        queue[i] = queue[j];
        queue[j] = tmp;
    }

    public static void main(String[] args) {
        Account[] queue = { new Account("ACC-001"), new Account("ACC-002") };
        swap(queue, 0, 1);
        System.out.println(queue[0].id + ", " + queue[1].id);
    }
}

class Account {
    String id;

    Account(String id) { this.id = id; }
}
```

```text
ACC-002, ACC-001
```

**Lỗi 2: gán `null` cho tham số để "đóng" tài khoản.** Chỉ bản sao bị xoá:

```java
public class CloseByNull {
    // Ý định: "đóng" tài khoản bằng cách cho tham số trỏ về null
    static void close(Account acc) {
        acc = null;
    }

    public static void main(String[] args) {
        Account an = new Account("ACC-001");
        close(an);
        System.out.println("an vẫn còn: " + an.id);
    }
}

class Account {
    String id;

    Account(String id) { this.id = id; }
}
```

```text
an vẫn còn: ACC-001
```

**Cách sửa:** đổi **trạng thái** của object (ví dụ thêm field `boolean closed` và method `close()` đặt nó thành `true`), hoặc trả kết quả về cho bên gọi tự gán.

## 8. `String` bất biến và câu trả lời checkpoint

**Ý tưởng nôm na.** `String` giống **tờ sao kê đã đóng dấu**: không ai sửa được nội dung, muốn khác thì in tờ mới. Vì vậy truyền `String` vào method trông như truyền số: method không bao giờ sửa được chuỗi gốc. `String` là **bất biến** (*immutable*): tạo ra rồi thì giá trị không đổi được [20]. Ngược lại, `StringBuilder` là "cuốn sổ nháp" sửa được [21].

<svg viewBox="0 0 720 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="String so với StringBuilder khi truyền vào method. Panel trái, addPrefix(id): id trong main và tham số id trong addPrefix cùng trỏ tới String ACC-001. String bất biến nên lệnh id = VIP- cộng id tạo một String MỚI là VIP-ACC-001 và chỉ gán bản sao tham số sang đó. id trong main vẫn trỏ ACC-001. Panel phải, approve(note): note trong main và tham số note cùng trỏ một object StringBuilder. append sửa chính object đó thành Hồ sơ ACC-001 (đã duyệt), nên main thấy thay đổi.">
  <defs>
    <marker id="c2b6-str-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
    <marker id="c2b6-str-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="340" height="270" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="180" y="32" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="#0F172A">addPrefix(id): String</text>
    <text x="24" y="74" fill="#64748B">main</text>
    <text x="24" y="92" font-family="monospace" fill="#0F172A">id</text>
    <rect x="70" y="76" width="34" height="24" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="87" cy="88" r="4" fill="#2563EB"/>
    <text x="24" y="152" fill="#64748B">addPrefix</text>
    <text x="24" y="182" font-family="monospace" fill="#0F172A">id</text>
    <rect x="70" y="166" width="34" height="24" rx="4" fill="#FFFFFF" stroke="#DC2626"/>
    <circle cx="87" cy="178" r="4" fill="#DC2626"/>
    <rect x="186" y="66" width="150" height="44" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="261" y="93" text-anchor="middle" font-family="monospace" fill="#0F172A">"ACC-001"</text>
    <rect x="186" y="156" width="150" height="44" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="261" y="176" text-anchor="middle" font-family="monospace" fill="#0F172A">"VIP-ACC-001"</text>
    <text x="261" y="193" text-anchor="middle" fill="#DC2626">String MỚI</text>
    <line x1="91" y1="88" x2="182" y2="88" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b6-str-blue)"/>
    <line x1="91" y1="178" x2="182" y2="104" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="4 3"/>
    <line x1="91" y1="178" x2="182" y2="178" stroke="#DC2626" stroke-width="1.5" marker-end="url(#c2b6-str-red)"/>
    <text x="180" y="236" text-anchor="middle" fill="#0F172A">String bất biến: không sửa được "ACC-001",</text>
    <text x="180" y="256" text-anchor="middle" fill="#0F172A">chỉ tạo String mới rồi gán vào BẢN SAO.</text>
    <rect x="370" y="10" width="340" height="270" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="540" y="32" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="#047857">approve(note): StringBuilder</text>
    <text x="384" y="74" fill="#64748B">main</text>
    <text x="384" y="92" font-family="monospace" fill="#0F172A">note</text>
    <rect x="430" y="76" width="34" height="24" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="447" cy="88" r="4" fill="#2563EB"/>
    <text x="384" y="164" fill="#64748B">approve</text>
    <text x="384" y="182" font-family="monospace" fill="#0F172A">note</text>
    <rect x="430" y="166" width="34" height="24" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="447" cy="178" r="4" fill="#2563EB"/>
    <rect x="510" y="104" width="190" height="56" rx="8" fill="#FFFFFF" stroke="#047857"/>
    <text x="520" y="124" fill="#047857" font-weight="bold">StringBuilder (một object)</text>
    <text x="520" y="146" fill="#0F172A">Hồ sơ ACC-001 (đã duyệt)</text>
    <line x1="451" y1="88" x2="506" y2="120" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b6-str-blue)"/>
    <line x1="451" y1="178" x2="506" y2="146" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b6-str-blue)"/>
    <text x="540" y="236" text-anchor="middle" fill="#0F172A">append sửa CHÍNH object hai bên</text>
    <text x="540" y="256" text-anchor="middle" fill="#0F172A">cùng trỏ tới → main thấy thay đổi.</text>
  </g>
</svg>

```java
public class StringByValue {
    // String bất biến: "+" tạo String MỚI, rồi gán vào bản sao tham số
    static void addPrefix(String id) {
        id = "VIP-" + id;
        System.out.println("  trong addPrefix: id = " + id);
    }

    // StringBuilder đổi được: append sửa chính object mà hai bên cùng trỏ tới
    static void approve(StringBuilder note) {
        note.append(" (đã duyệt)");
    }

    public static void main(String[] args) {
        String id = "ACC-001";
        addPrefix(id);
        System.out.println("sau addPrefix : id = " + id);

        StringBuilder note = new StringBuilder("Hồ sơ ACC-001");
        approve(note);
        System.out.println("sau approve   : note = " + note);
    }
}
```

**Kết quả khi chạy:**

```text
  trong addPrefix: id = VIP-ACC-001
sau addPrefix : id = ACC-001
sau approve   : note = Hồ sơ ACC-001 (đã duyệt)
```

**Giải thích từng bước:**

1. `addPrefix(id)`: tham số `id` nhận bản sao địa chỉ của `"ACC-001"`.
2. `"VIP-" + id` **không sửa** `"ACC-001"` (không thể sửa). Nó tạo một `String` mới, rồi phép gán đưa địa chỉ mới vào bản sao `id`. Đây vẫn là tình huống "gán lại tham số" của phần 7.
3. `id` trong `main` vẫn trỏ `"ACC-001"`.
4. `approve(note)`: `append` sửa chính object `StringBuilder` mà hai bên cùng trỏ tới, nên `main` thấy `(đã duyệt)` [21].

**Câu trả lời checkpoint: vì sao Java luôn pass-by-value?**

Khi gọi method, giá trị của từng đối số được dùng để khởi tạo các biến tham số **mới tạo** [16][17]. Với kiểu nguyên thuỷ, giá trị là con số. Với kiểu class, giá trị là một **reference** [18], và reference đó cũng được **chép**. Java không có cách nào đưa *chính biến* của bên gọi vào method. Bằng chứng là `swap` ở phần 7: nếu Java truyền by reference, `an` và `binh` đã đổi chỗ, nhưng thực tế không [19]. Gọi `acc.deposit(...)` đổi được số dư là vì hai bản sao địa chỉ cùng trỏ **một object**, không phải vì object được "truyền by reference".

| Nên nói ✓ | Không nên nói ✗ |
|---|---|
| "Java luôn pass-by-value; với object thì giá trị được chép là reference." | "Primitive truyền by value, object truyền by reference." |
| "Method sửa được **object** qua tham số, nhưng không đổi được **biến** của bên gọi." | "Truyền object vào method là method sửa được biến của mình." |
| "Muốn đổi biến của bên gọi: `return` giá trị mới rồi gán." | "Viết `swap(a, b)` là đổi được hai biến." |
| "`String`, `BigDecimal` bất biến: phải dùng giá trị trả về." | "`s.toUpperCase();` là `s` đã thành chữ hoa." |

### ⚠️ Lỗi hay gặp

**Gọi method của object bất biến mà bỏ quên kết quả.** `toUpperCase()` của `String` và `add()` của `BigDecimal` đều trả về object **mới** [20][22]. Không gán lại thì kết quả mất luôn:

```java
import java.math.BigDecimal;

public class IgnoredResult {
    public static void main(String[] args) {
        String currency = "vnd";
        currency.toUpperCase();                    // kết quả bị bỏ đi
        System.out.println(currency);

        BigDecimal balance = new BigDecimal("500000");
        balance.add(new BigDecimal("100000"));     // kết quả bị bỏ đi
        System.out.println(balance);
    }
}
```

```text
vnd
500000
```

**Cách sửa:** gán lại: `currency = currency.toUpperCase();` và `balance = balance.add(new BigDecimal("100000"));`.

## Tóm tắt

- **Binding** là quyết định một lời gọi chạy method nào. javac quyết phần của nó lúc compile (chỉ thấy **kiểu khai báo**), JVM quyết phần còn lại lúc chạy (thấy **kiểu thật**).
- **Static binding**: chọn overload, field, method `static`, `private`, `final`. Kết quả đã chắc chắn từ lúc compile.
- **Dynamic binding**: method instance được ghi đè. JVM tra từ class thật của object, giống tra một bảng method (vtable) của class đó.
- **Overload chọn theo kiểu khai báo, override chọn theo kiểu thật.** Ép kiểu đổi overload được chọn, không đổi object.
- Đổi kiểu tham số khi "ghi đè" là tạo overload mới. Luôn đặt `@Override` để javac bắt lỗi.
- Java **luôn pass-by-value**: mỗi lần gọi có khung mới, tham số là biến mới nhận **bản sao** giá trị. Với object, bản sao đó là reference.
- Qua tham số, method **sửa được object** (`deposit`), nhưng **không đổi được biến** của bên gọi (`swap`, gán lại, gán `null`).
- `String`, `BigDecimal` bất biến: mọi "thay đổi" tạo object mới, hãy dùng giá trị trả về.

## Tự kiểm tra

**(Mục tiêu 1) Câu 1.** Với `Account acc = new SavingAccount(...)`, mỗi lời gọi sau được chọn lúc compile hay lúc chạy? a) `Account.bankName()`; b) `acc.monthlyFee()` (được `SavingAccount` ghi đè); c) `acc.type`; d) chọn giữa `printStatement(Account)` và `printStatement(SavingAccount)`.

<details><summary>Đáp án</summary>

a) Lúc compile (method `static`). b) Lúc chạy (method instance được ghi đè, chọn theo object thật). c) Lúc compile (field không đa hình, chọn theo kiểu khai báo `Account`). d) Lúc compile (chọn overload theo kiểu khai báo của đối số).

</details>

**(Mục tiêu 1) Câu 2.** `javap -c` cho thấy dòng `invokevirtual ... Method Account.describe`, nhưng chương trình in `Sổ tiết kiệm ACC-002`, là kết quả của `SavingAccount.describe()`. Có mâu thuẫn không?

<details><summary>Đáp án</summary>

Không. javac chỉ ghi **chữ ký** đã chọn lúc compile (`describe()` khai báo trong `Account`). `invokevirtual` bảo JVM tìm bản ghi đè bắt đầu từ class thật của object lúc chạy. Object thật là `SavingAccount`, nên bản ghi đè của nó chạy.

</details>

**(Mục tiêu 2) Câu 3.** Dùng `Teller`, `Account`, `SavingAccount` ở phần 4. Hai dòng sau in gì?

```java
Account a2 = new SavingAccount();
teller.serve((SavingAccount) a2);
teller.serve(new Account());
```

<details><summary>Đáp án</summary>

```text
quầy serve(SavingAccount) → kind() = SavingAccount
quầy serve(Account)       → kind() = Account
```

Dòng 1: ép kiểu làm kiểu lúc compile thành `SavingAccount`, nên chọn quầy `serve(SavingAccount)`; object thật là `SavingAccount`. Dòng 2: kiểu khai báo và object thật đều là `Account`.

</details>

**(Mục tiêu 3) Câu 4.** Vì sao `acc.type` in `ACCOUNT` dù `acc` trỏ tới một `SavingAccount`? Muốn mỗi loại tài khoản tự báo loại của nó theo object thật, bạn sửa thế nào?

<details><summary>Đáp án</summary>

Field không đa hình: javac chọn field theo kiểu khai báo của biểu thức (`Account`), và `SavingAccount` chỉ **che** field `type`, không ghi đè. Cách sửa: bỏ field trùng tên, viết method instance `String kind()` ở `Account` rồi ghi đè ở `SavingAccount` (như phần 4). Method được ghi đè thì chọn theo object thật.

</details>

**(Mục tiêu 3) Câu 5.** `SavingAccount` khai báo `long transferFee(int amount)` để "miễn phí", nhưng `acc.transferFee(500_000)` (với `acc` kiểu `Account`) vẫn trả `3300`. Vì sao, và làm sao để javac tự phát hiện lỗi này?

<details><summary>Đáp án</summary>

Đổi `long` thành `int` tạo ra một **overload** mới, không cùng chữ ký nên không ghi đè `transferFee(long)`. javac chốt chữ ký `transferFee(long)` theo kiểu `Account`; lúc chạy `SavingAccount` không có bản ghi đè cho chữ ký đó, nên bản của `Account` chạy. Đặt `@Override` lên method: javac báo `method does not override or implement a method from a supertype`.

</details>

**(Mục tiêu 4) Câu 6.** Với class `Account` ở phần 7, sau đoạn code dưới, `a` in ra gì?

```java
static void reset(Account acc) {
    acc.deposit(50_000);
    acc = new Account("ACC-009", 0);
    acc.deposit(70_000);
}
// trong main:
Account a = new Account("ACC-001", 100_000);
reset(a);
System.out.println(a);
```

<details><summary>Đáp án</summary>

```text
ACC-001(150000)
```

Lệnh `deposit(50_000)` đầu tiên chạy trên object mà `a` trỏ tới, nên số dư thành `150000`. Sau `acc = new Account(...)`, bản sao `acc` trỏ sang object khác, nên `deposit(70_000)` không đụng tới `ACC-001`.

</details>

**(Mục tiêu 5) Câu 7.** Một bạn nói: "Object trong Java được truyền by reference, bằng chứng là method nạp tiền được vào `Account`." Bạn trả lời thế nào, và dùng thí nghiệm nào để chứng minh?

<details><summary>Đáp án</summary>

Sai. Java luôn pass-by-value. Với object, giá trị được chép là **reference**, nên method và bên gọi cùng trỏ một object: sửa object thì bên gọi thấy. Nhưng method không đổi được **biến** của bên gọi. Thí nghiệm: viết `swap(Account x, Account y)` rồi in hai biến sau khi gọi. Nếu là pass-by-reference thật, hai biến đã đổi chỗ; thực tế chúng giữ nguyên.

</details>

**(Mục tiêu 5) Câu 8.** Sau `String name = "acc-001"; shout(name);` với `static void shout(String s) { s = s.toUpperCase(); }`, `name` là gì? Vì sao?

<details><summary>Đáp án</summary>

Vẫn là `"acc-001"`. `toUpperCase()` tạo `String` mới (`String` bất biến), rồi phép gán chỉ đổi bản sao `s` trong khung của `shout`. Biến `name` của bên gọi không bị đụng tới.

</details>

## Bài tập

**Bài 1 (dễ).** Viết `static long applyFee(long balance, long fee)` trả về số dư sau khi trừ phí. Trong `main`, áp phí `11_000` cho số dư `500_000` và in kết quả. Sau đó viết thử bản `static void applyFeeVoid(long balance, long fee)` và giải thích vì sao bản này không đổi được số dư.

> 💡 Gợi ý: xem lại phần 6. Bản đúng cần `balance = applyFee(balance, 11_000);`.

**Bài 2 (vừa).** Thêm `CheckingAccount extends Account`, ghi đè `monthlyFee()` trả `22_000`. Tạo mảng `Account[]` gồm ba loại tài khoản, gọi `endOfMonth` (phần 3) cho từng phần tử. **Viết dự đoán output ra giấy trước**, rồi mới chạy. Sau đó thêm overload `static void endOfMonth(CheckingAccount c)` in thêm chữ `[VIP]`, chạy lại vòng lặp: dòng `[VIP]` có xuất hiện không? Vì sao?

> 💡 Gợi ý: biến vòng lặp có kiểu khai báo gì? Xem lại phần 4.

**Bài 3 (khó hơn).** Viết hai method: `swapRefs(Account a, Account b)` (đổi chỗ hai tham số) và `swapBalances(Account a, Account b)` (đổi **số dư** của hai object). Chạy cả hai trên `ACC-001 (500000)` và `ACC-002 (2000000)`, in kết quả, rồi vẽ stack/heap cho từng trường hợp. Giải thích bằng 3–4 câu vì sao một hàm có tác dụng, một hàm không, mà vẫn khẳng định được "Java luôn pass-by-value".

> 💡 Gợi ý: `swapBalances` sửa field của **object**, `swapRefs` chỉ sửa **bản sao** reference. Dùng một biến tạm `long tmp = a.balance;`.

## Nguồn tham khảo

1. JLS SE 25, §15.12.2 Compile-Time Step 2: Determine Method Signature. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.2>
2. JLS SE 25, §15.12.4.4 Locate Method to Invoke. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.4.4>
3. JVMS SE 25, §6.5 lệnh invokevirtual. <https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-6.html#jvms-6.5.invokevirtual>
4. JVMS SE 25, §6.5 lệnh invokestatic. <https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-6.html#jvms-6.5.invokestatic>
5. JDK 21 Tool Specifications: javap. <https://docs.oracle.com/en/java/javase/21/docs/specs/man/javap.html>
6. JLS SE 25, §8.4.9 Overloading. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.9>
7. JLS SE 25, §15.12.2.5 Choosing the Most Specific Method. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.2.5>
8. Oracle Java Tutorials: Polymorphism (virtual method invocation). <https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html>
9. OpenJDK HotSpot Wiki: VirtualCalls (vtable). <https://wiki.openjdk.org/display/HotSpot/VirtualCalls>
10. JLS SE 25, §8.4.8.1 Overriding (by Instance Methods). <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8.1>
11. JLS SE 25, §8.3 Field Declarations (field hiding). <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.3>
12. JLS SE 25, §15.11.1 Field Access Using a Primary. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.11.1>
13. JLS SE 25, §8.4.3.3 final Methods. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.3.3>
14. JLS SE 25, §8.4.8.2 Hiding (by Class Methods). <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8.2>
15. Oracle Java Tutorials: Overriding and Hiding Methods. <https://docs.oracle.com/javase/tutorial/java/IandI/override.html>
16. JLS SE 25, §8.4.1 Formal Parameters. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.1>
17. JLS SE 25, §15.12.4.5 Create Frame, Synchronize, Transfer Control. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.4.5>
18. JLS SE 25, §4.3.1 Objects (reference values). <https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.3.1>
19. Oracle Java Tutorials: Passing Information to a Method or a Constructor. <https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html>
20. Java SE 25 API: java.lang.String. <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html>
21. Java SE 25 API: java.lang.StringBuilder. <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/StringBuilder.html>
22. Java SE 25 API: java.math.BigDecimal. <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/math/BigDecimal.html>

**Bài tiếp theo:** [Bài 7 · Enum, record và nested class](/docs/learning/chang-2/enum-record-nested-class)
