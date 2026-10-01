---
title: "Bài 2 · Đóng gói và method"
description: "Field và biến cục bộ, chữ ký method, đóng gói bằng quy tắc bất biến của Account, nạp chồng method và gọi chuỗi bằng return this: những viên gạch để class ngân hàng của bạn khó dùng sai."
order: 22
tags: [java, chặng-2, oop, encapsulation, method, overloading, method-chaining]
language: vi
profile: onward-java-course
classification: public-safe
source_repo: none
source_refs:
  - https://roadmap.sh/java
  - https://github.com/kamranahmedse/developer-roadmap/tree/master/roadmaps/java/content
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.12.3
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.12.5
  - https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-2.html#jvms-2.5.3
  - https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-2.html#jvms-2.6
  - https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-6.html#jls-6.4.1
  - https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.2
  - https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html#jls-14.17
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html#jls-14.22
  - https://docs.oracle.com/javase/tutorial/java/concepts/object.html
  - https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html
  - https://docs.oracle.com/javase/8/docs/technotes/guides/language/assert.html
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/math/BigDecimal.html
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Arrays.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.9
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-5.html#jls-5.3
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/io/PrintStream.html
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/StringBuilder.html
  - https://martinfowler.com/bliki/FluentInterface.html
verified_with: "openjdk 21.0.9"
verification: ran-locally
verification_note: "20 chương trình đã chạy trên openjdk 21.0.9: 13 bằng `java File.java` (source-launch; 1 trong số đó cố ý ném NullPointerException) và 7 ví dụ lỗi biên dịch bằng `javac -d out File.java`. Output và thông báo lỗi trong bài là output thật. Chưa chạy lại trên JDK 25."
contract_version: 1
---

# Bài 2 · Đóng gói và method

> 🎯 **Sau bài này bạn sẽ:**
> 1. Phân biệt được field và biến cục bộ (nơi khai báo, nơi nằm trong bộ nhớ, thời gian sống, giá trị mặc định), và sửa được lỗi `might not have been initialized`.
> 2. Chỉ ra được chữ ký (*signature*) của một method, phân biệt tham số với đối số, và dùng `return` để thoát sớm khỏi method.
> 3. Viết được class `Account` giữ quy tắc "số dư không bao giờ âm": field `private`, có getter nhưng không có setter, mọi thay đổi đi qua `deposit`/`withdraw`.
> 4. Viết được các method nạp chồng `deposit(long)` / `deposit(BigDecimal)`, và giải thích được vì sao hai method chỉ khác kiểu trả về thì không cùng tồn tại được.
> 5. Viết được method chaining bằng `return this` (một `StatementBuilder`), và phân biệt nó với chuỗi gọi trên object không đổi được như `BigDecimal`.

## Tình huống

Bạn mở pull request thêm `setBalance(BigDecimal)` vào `Account` "cho test dễ viết". Reviewer để lại
đúng một câu: *"Quy tắc bất biến của `Account` là gì? Sau PR này nó còn đúng không?"*. Bạn sửa tiếp,
thêm một bản `void deposit(long)` bên cạnh `boolean deposit(long)` có sẵn, và javac báo ngay
`method deposit(long) is already defined`. Bài này giải thích cả hai chuyện, và cách viết method để
class ngân hàng của bạn **khó bị dùng sai**.

**Cần biết trước:**
[Chặng 1 · Bài 6 · Nhập môn OOP](/docs/learning/chang-1/nhap-mon-oop) (class, object, field, method,
constructor, `this`, `private`, getter),
[Chặng 1 · Bài 4 · Chuỗi và phép toán](/docs/learning/chang-1/chuoi-va-phep-toan) (`BigDecimal`,
object không đổi được),
[Chặng 2 · Bài 1 · Package và access modifier](/docs/learning/chang-2/package-va-access-modifier)
(`public`, `private`).

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| Field (thuộc tính, *attribute*) | Dữ liệu mỗi object tự giữ, sống cùng object | `private BigDecimal balance;` |
| Biến cục bộ (*local variable*) | Biến khai báo trong method, chỉ sống trong một lần gọi | `long fee = amount / 1_000;` |
| Giá trị mặc định | Giá trị Java tự gán cho field khi object được tạo | `0`, `false`, `null` |
| Chữ ký method (*signature*) | "Căn cước" của method: tên + kiểu các tham số | `deposit(BigDecimal)` |
| Tham số / đối số | Biến trong khai báo method / giá trị thật lúc gọi | `amount` / `500_000` |
| Quy tắc bất biến (*invariant*) | Điều luôn đúng với mọi object của class, ở mọi thời điểm | "số dư không bao giờ âm" |
| Đóng gói (*encapsulation*) | Giấu dữ liệu, chỉ cho đổi qua method có kiểm tra | `deposit`, `withdraw` |
| Nạp chồng (*overloading*) | Nhiều method cùng tên, khác danh sách tham số | `deposit(long)`, `deposit(BigDecimal)` |
| Gọi chuỗi (*method chaining*) | Gọi nhiều method nối nhau trong một câu lệnh | `sb.append("a").append("b")` |
| `return this` | Method trả về chính object đang chạy nó | `return this;` |

Bài này phủ bốn topic của roadmap Java: *Attributes and Methods*, *Encapsulation*, *Method
Overloading* và *Method Chaining* [1][2].

💡 **Hai chữ "bất biến".** Ở Chặng 1 Bài 4, "bất biến" (*immutable*) nghĩa là object **không đổi
được nội dung**, như `String`, `BigDecimal`. Bài này dùng thêm **quy tắc bất biến** (*invariant*):
một **điều kiện luôn đúng**, ví dụ "số dư ≥ 0". Số dư vẫn thay đổi, nhưng điều kiện thì không bao
giờ bị phá. Để khỏi nhầm, bài này viết "object không đổi được" cho nghĩa thứ nhất.

## 1. Field và biến cục bộ

**Ý tưởng nôm na.** Ở quầy giao dịch, **sổ tài khoản** của khách được cất lại sau mỗi lần giao
dịch: đó là **field**, sống cùng object. Còn **tờ giấy nháp** giao dịch viên dùng để tính phí thì
vứt đi ngay khi xong việc: đó là **biến cục bộ** (*local variable*), chỉ sống trong một lần gọi
method [3][7].

Chính xác hơn, theo JLS: mỗi object mới có một bản riêng của mọi field (*instance variable*), và
field được gán **giá trị mặc định** ngay khi object được tạo [3][4]. Biến cục bộ được tạo khi luồng
chạy đi vào khối code chứa nó, và **phải được gán rõ ràng trước khi đọc**; Java không tự gán mặc
định cho nó [3][4]. Trong JVM, mọi object nằm trên **heap** [5]; mỗi lần gọi method, JVM tạo một
**khung** (*frame*) mới chứa biến cục bộ, và xoá khung đó khi method kết thúc [6].

<svg viewBox="0 0 720 305" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Field và biến cục bộ trong bộ nhớ, lúc đang chạy acc.transferFee(2_000_000). Bên trái là stack. Khung main chứa biến acc, trỏ sang object Account trên heap. Khung transferFee, viền vàng nét đứt, chứa tham số amount bằng 2000000, biến cục bộ fee bằng 2000, và this trỏ về cùng object Account. Khung này được tạo khi gọi method và bị xoá khi return. Bên phải là heap chứa object Account với các field: id bằng null, feeCalls từ 0 thành 1, locked bằng false, balance bằng null; lưu ý BigDecimal mặc định là null, không phải 0. Chú thích: biến cục bộ tạo khi gọi method, mất khi return, không có giá trị mặc định; field sống cùng object và được gán giá trị mặc định khi object được tạo.">
  <defs>
    <marker id="c2b2-mem-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="300" height="240" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="160" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#0F172A">Stack</text>
    <rect x="25" y="46" width="270" height="72" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="35" y="64" fill="#64748B">khung main()</text>
    <text x="40" y="96" font-family="monospace" fill="#0F172A">acc</text>
    <rect x="150" y="80" width="60" height="24" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="180" cy="92" r="4" fill="#2563EB"/>
    <rect x="25" y="132" width="270" height="106" rx="6" fill="#FFFBEB" stroke="#D97706" stroke-dasharray="6 4"/>
    <text x="35" y="150" font-family="monospace" fill="#D97706">khung transferFee(2_000_000)</text>
    <text x="40" y="174" font-family="monospace" fill="#0F172A">amount = 2000000</text>
    <text x="40" y="198" font-family="monospace" fill="#0F172A">fee    = 2000</text>
    <text x="40" y="226" font-family="monospace" fill="#0F172A">this</text>
    <rect x="150" y="210" width="60" height="24" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="180" cy="222" r="4" fill="#2563EB"/>
    <rect x="400" y="10" width="310" height="240" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="555" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#047857">Heap</text>
    <rect x="420" y="56" width="270" height="156" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="432" y="78" font-weight="bold" fill="#1D4ED8">object Account (các field)</text>
    <line x1="420" y1="88" x2="690" y2="88" stroke="#94A3B8"/>
    <text x="432" y="110" font-family="monospace" fill="#0F172A">id       = null</text>
    <text x="432" y="132" font-family="monospace" fill="#0F172A">feeCalls = 0 → 1</text>
    <text x="432" y="154" font-family="monospace" fill="#0F172A">locked   = false</text>
    <text x="432" y="176" font-family="monospace" fill="#0F172A">balance  = null</text>
    <text x="432" y="200" font-size="11" fill="#DC2626">BigDecimal mặc định là null, không phải 0</text>
    <line x1="184" y1="92" x2="414" y2="100" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b2-mem-arrow)"/>
    <line x1="184" y1="222" x2="414" y2="160" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b2-mem-arrow)"/>
    <text x="555" y="236" text-anchor="middle" font-size="11" fill="#64748B">this và acc trỏ cùng một object</text>
    <text x="360" y="274" text-anchor="middle" fill="#D97706">Biến cục bộ (khung vàng): tạo khi gọi method, mất khi return, không có giá trị mặc định</text>
    <text x="360" y="295" text-anchor="middle" fill="#1D4ED8">Field (trong object): sống cùng object, được gán giá trị mặc định khi object được tạo</text>
  </g>
</svg>

Lưu thành `FieldVsLocal.java` rồi chạy `java FieldVsLocal.java`:

```java
import java.math.BigDecimal;

public class FieldVsLocal {
    public static void main(String[] args) {
        Account acc = new Account();
        acc.printFields();                       // field chưa gán: giá trị mặc định

        long fee1 = acc.transferFee(2_000_000);  // lần gọi 1
        long fee2 = acc.transferFee(300_000);    // lần gọi 2
        System.out.println("Phí lần 1: " + fee1 + ", phí lần 2: " + fee2);
        System.out.println("Đã tính phí " + acc.feeCalls + " lần");
    }
}

class Account {
    String id;            // kiểu tham chiếu: mặc định null
    int feeCalls;         // kiểu số: mặc định 0
    boolean locked;       // boolean: mặc định false
    BigDecimal balance;   // BigDecimal cũng là tham chiếu: mặc định null, KHÔNG phải 0

    void printFields() {
        System.out.println("id=" + id + ", feeCalls=" + feeCalls
                + ", locked=" + locked + ", balance=" + balance);
    }

    // Quy tắc phí giả định cho ví dụ: 0,1% số tiền, tối thiểu 1.000 đồng
    long transferFee(long amount) {
        long fee = amount / 1_000;    // biến cục bộ: sinh ra ở mỗi lần gọi
        if (fee < 1_000) {
            fee = 1_000;
        }
        feeCalls++;                   // field: giá trị còn lại sau khi method kết thúc
        return fee;
    }
}
```

**Kết quả khi chạy:**

```text
id=null, feeCalls=0, locked=false, balance=null
Phí lần 1: 2000, phí lần 2: 1000
Đã tính phí 2 lần
```

**Giải thích từng bước:**

1. `new Account()` tạo object trên heap. Bốn field chưa được gán gì nên mang giá trị mặc định:
   `null` cho kiểu tham chiếu (`String`, `BigDecimal`), `0` cho số, `false` cho `boolean` [4].
2. Lần gọi 1 `transferFee(2_000_000)`: JVM tạo một khung mới. Trong khung có tham số `amount` và
   biến cục bộ `fee = 2000` (phí 0,1% là quy tắc giả định của ví dụ). `feeCalls++` ghi vào
   **field** của object, nên `feeCalls` thành `1`.
3. Method `return fee;` xong thì khung bị xoá, `fee` biến mất [6].
4. Lần gọi 2 `transferFee(300_000)`: một khung **hoàn toàn mới**, `fee` bắt đầu lại từ đầu:
   `300` nhỏ hơn mức tối thiểu nên thành `1000`. Còn `feeCalls` vẫn nhớ giá trị cũ và tăng lên `2`.
5. Bài học: thứ gì cần **nhớ giữa các lần gọi** (số dư, bộ đếm) là field. Thứ chỉ dùng **trong một
   phép tính** là biến cục bộ. Biến cục bộ chỉ nhìn thấy được bên trong method khai báo nó [7].

### ⚠️ Lỗi hay gặp

**Lỗi 1: đọc biến cục bộ khi nó có thể chưa được gán.** Lưu thành `LocalNotInit.java` rồi chạy
`javac -d out LocalNotInit.java`:

```java
public class LocalNotInit {
    long transferFee(long amount) {
        long fee;                 // khai báo nhưng chưa gán
        if (amount > 0) {
            fee = amount / 1_000;
        }
        return fee;               // nếu amount <= 0 thì fee chưa có giá trị
    }
}
```

```text
LocalNotInit.java:7: error: variable fee might not have been initialized
        return fee;               // nếu amount <= 0 thì fee chưa có giá trị
               ^
1 error
```

javac kiểm tra **mọi** đường chạy. Nếu `amount <= 0`, `fee` chưa được gán mà vẫn bị đọc, nên bị
từ chối [4]. **Cách sửa:** gán giá trị ngay lúc khai báo (`long fee = 0;`), hoặc gán ở cả nhánh
`else`.

**Lỗi 2: field `BigDecimal` quên khởi tạo.** Field thì có mặc định, nhưng mặc định của `BigDecimal`
là `null`, không phải số `0`:

```java
import java.math.BigDecimal;

public class NullBalance {
    public static void main(String[] args) {
        Account acc = new Account();
        acc.deposit(new BigDecimal("500000"));
        System.out.println("Số dư: " + acc.balance);
    }
}

class Account {
    BigDecimal balance;   // quên khởi tạo: mặc định là null

    void deposit(BigDecimal amount) {
        balance = balance.add(amount);
    }
}
```

```text
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "java.math.BigDecimal.add(java.math.BigDecimal)" because "this.balance" is null
	at Account.deposit(NullBalance.java:15)
	at NullBalance.main(NullBalance.java:6)
```

`"this.balance" is null` nghĩa là field `balance` của object hiện tại đang `null`. **Cách sửa:**
khởi tạo ngay ở khai báo: `BigDecimal balance = BigDecimal.ZERO;`.

**Lỗi 3: khai báo lại tên field bên trong method.** Thêm chữ `long` phía trước là bạn đã tạo một
**biến cục bộ mới** trùng tên. Nó **che** (*shadow*) field: trong method, tên `balance` trơn giờ chỉ
tới biến cục bộ [8]. Code biên dịch được, nhưng field không đổi:

```java
public class ShadowField {
    public static void main(String[] args) {
        Account acc = new Account();
        acc.deposit(500_000);
        System.out.println("Số dư: " + acc.balance);
    }
}

class Account {
    long balance;

    void deposit(long amount) {
        long balance = this.balance + amount; // khai báo LẠI: tạo biến cục bộ mới
        System.out.println("Trong deposit: " + balance);
    }
}
```

```text
Trong deposit: 500000
Số dư: 0
```

**Cách sửa:** bỏ chữ `long`, viết `this.balance = this.balance + amount;` (hoặc
`balance += amount;`).

## 2. Method: chữ ký, tham số và `return`

**Ý tưởng nôm na.** Mỗi quầy giao dịch có **biển tên** ghi rõ "Rút tiền: cần mang theo số tiền".
Khách nhìn biển là biết đến đúng quầy. Với method, tấm biển đó là **chữ ký** (*signature*): **tên
method + kiểu của các tham số**, theo đúng thứ tự [9][10]. Kiểu trả về, tên tham số và các từ khoá
như `public` **không** nằm trong chữ ký.

Hai từ hay bị dùng lẫn: **tham số** (*parameter*) là biến khai báo trong ngoặc của method; **đối
số** (*argument*) là giá trị thật bạn đưa vào lúc gọi. Lúc gọi, đối số phải khớp tham số về kiểu và
thứ tự [11]. Ở Chặng 1 bạn đã gặp giải phẫu `long getBalance()`. Phần này đi thêm một bước: cái gì
làm nên "căn cước" của method.

<svg viewBox="0 0 720 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Giải phẫu khai báo method public boolean withdraw(BigDecimal amount). Bốn phần: public là modifier, boolean là kiểu trả về, withdraw là tên method, (BigDecimal amount) là danh sách tham số. Chữ ký của method là withdraw(BigDecimal), tức tên method cộng kiểu các tham số theo thứ tự. Không thuộc chữ ký: kiểu trả về boolean, tên tham số amount, modifier public. Phần dưới: lời gọi acc.withdraw(new BigDecimal(&quot;200000&quot;)) là đối số, giá trị thật lúc gọi; giá trị được chép vào tham số amount, là biến bên trong method, amount bằng 200000.">
  <defs>
    <marker id="c2b2-sig-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="40" y="14" width="70" height="32" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="75" y="35" text-anchor="middle" font-family="monospace" font-size="14" fill="#64748B">public</text>
    <rect x="118" y="14" width="80" height="32" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="158" y="35" text-anchor="middle" font-family="monospace" font-size="14" fill="#64748B">boolean</text>
    <rect x="206" y="14" width="92" height="32" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="252" y="35" text-anchor="middle" font-family="monospace" font-size="14" fill="#1D4ED8">withdraw</text>
    <rect x="306" y="14" width="180" height="32" rx="6" fill="#FFFBEB" stroke="#D97706"/>
    <text x="396" y="35" text-anchor="middle" font-family="monospace" font-size="14" fill="#D97706">(BigDecimal amount)</text>
    <text x="500" y="35" font-family="monospace" font-size="14" fill="#64748B">{ ... }</text>
    <text x="75" y="64" text-anchor="middle" fill="#64748B">modifier</text>
    <text x="158" y="64" text-anchor="middle" fill="#64748B">kiểu trả về</text>
    <text x="252" y="64" text-anchor="middle" fill="#1D4ED8">tên method</text>
    <text x="396" y="64" text-anchor="middle" fill="#D97706">danh sách tham số</text>
    <path d="M206,74 L206,82 L486,82 L486,74" fill="none" stroke="#10B981" stroke-width="2"/>
    <text x="346" y="102" text-anchor="middle" font-weight="bold" fill="#047857">chữ ký (signature): withdraw(BigDecimal)</text>
    <text x="346" y="120" text-anchor="middle" fill="#047857">= tên method + KIỂU các tham số, theo thứ tự</text>
    <rect x="40" y="134" width="640" height="34" rx="6" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="360" y="156" text-anchor="middle" fill="#DC2626">Không thuộc chữ ký: kiểu trả về (boolean), tên tham số (amount), modifier (public)</text>
    <line x1="10" y1="184" x2="710" y2="184" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <rect x="20" y="200" width="300" height="56" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="170" y="222" text-anchor="middle" font-family="monospace" fill="#0F172A">acc.withdraw(new BigDecimal("200000"))</text>
    <text x="170" y="244" text-anchor="middle" font-size="11" fill="#64748B">đối số (argument): giá trị thật lúc gọi</text>
    <line x1="320" y1="228" x2="396" y2="228" stroke="#64748B" stroke-width="2" marker-end="url(#c2b2-sig-arrow)"/>
    <text x="358" y="220" text-anchor="middle" font-size="11" fill="#64748B">chép vào</text>
    <rect x="400" y="200" width="300" height="56" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="550" y="222" text-anchor="middle" font-family="monospace" fill="#0F172A">amount = 200000</text>
    <text x="550" y="244" text-anchor="middle" font-size="11" fill="#64748B">tham số (parameter): biến bên trong method</text>
  </g>
</svg>

**`return` là cửa ra.** Câu lệnh `return` trả quyền điều khiển về nơi gọi; nếu có biểu thức thì giá
trị của nó thành kết quả của lời gọi [12]. Vì vậy `return` đặt giữa method là cách **thoát sớm**:
kiểm tra trường hợp xấu trước, gặp là trả về ngay, phần "đường thành công" để ở cuối.

<svg viewBox="0 0 720 325" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Luồng chạy của method check(balance, amount) với hai lần thoát sớm. Bước 1 kiểm tra amount nhỏ hơn hoặc bằng 0; nếu đúng thì return TỪ CHỐI số tiền phải lớn hơn 0 và dừng method. Nếu sai, bước 2 kiểm tra amount lớn hơn balance; nếu đúng thì return TỪ CHỐI không đủ số dư. Nếu sai, tính remaining bằng balance trừ amount rồi return OK còn remaining. Mỗi return dừng method ngay và trả giá trị cho nơi gọi; code đặt ngay sau return trong cùng khối khiến javac báo unreachable statement.">
  <defs>
    <marker id="c2b2-ret-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
    <marker id="c2b2-ret-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="20" y="12" width="240" height="38" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="140" y="36" text-anchor="middle" font-family="monospace" fill="#1D4ED8">check(balance, amount)</text>
    <line x1="140" y1="50" x2="140" y2="68" stroke="#64748B" marker-end="url(#c2b2-ret-arrow)"/>
    <rect x="20" y="72" width="240" height="40" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="140" y="97" text-anchor="middle" font-family="monospace" fill="#0F172A">amount &lt;= 0 ?</text>
    <line x1="260" y1="92" x2="420" y2="92" stroke="#DC2626" marker-end="url(#c2b2-ret-red)"/>
    <text x="340" y="84" text-anchor="middle" fill="#DC2626">đúng</text>
    <rect x="424" y="72" width="280" height="40" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="564" y="97" text-anchor="middle" font-family="monospace" fill="#DC2626">return "TỪ CHỐI: số tiền..."</text>
    <line x1="140" y1="112" x2="140" y2="138" stroke="#64748B" marker-end="url(#c2b2-ret-arrow)"/>
    <text x="150" y="130" fill="#64748B">sai</text>
    <rect x="20" y="142" width="240" height="40" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="140" y="167" text-anchor="middle" font-family="monospace" fill="#0F172A">amount &gt; balance ?</text>
    <line x1="260" y1="162" x2="420" y2="162" stroke="#DC2626" marker-end="url(#c2b2-ret-red)"/>
    <text x="340" y="154" text-anchor="middle" fill="#DC2626">đúng</text>
    <rect x="424" y="142" width="280" height="40" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="564" y="167" text-anchor="middle" font-family="monospace" fill="#DC2626">return "TỪ CHỐI: không đủ..."</text>
    <line x1="140" y1="182" x2="140" y2="208" stroke="#64748B" marker-end="url(#c2b2-ret-arrow)"/>
    <text x="150" y="200" fill="#64748B">sai</text>
    <rect x="20" y="212" width="240" height="40" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="140" y="237" text-anchor="middle" font-family="monospace" fill="#0F172A">remaining = balance - amount</text>
    <line x1="140" y1="252" x2="140" y2="268" stroke="#64748B" marker-end="url(#c2b2-ret-arrow)"/>
    <rect x="20" y="272" width="240" height="40" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="140" y="297" text-anchor="middle" font-family="monospace" fill="#047857">return "OK: còn " + ...</text>
    <text x="564" y="222" text-anchor="middle" fill="#64748B">Mỗi return: dừng method ngay,</text>
    <text x="564" y="242" text-anchor="middle" fill="#64748B">trả giá trị về cho nơi gọi</text>
    <text x="564" y="276" text-anchor="middle" fill="#DC2626">Code ngay sau return trong cùng khối:</text>
    <text x="564" y="296" text-anchor="middle" fill="#DC2626">javac báo "unreachable statement"</text>
  </g>
</svg>

```java
public class SignatureAndReturn {
    public static void main(String[] args) {
        WithdrawalPolicy policy = new WithdrawalPolicy();
        // 500_000 và -10 là ĐỐI SỐ (argument): giá trị thật lúc gọi
        System.out.println(policy.check(500_000, -10));
        System.out.println(policy.check(500_000, 800_000));
        System.out.println(policy.check(500_000, 200_000));
    }
}

class WithdrawalPolicy {
    // balance, amount là THAM SỐ (parameter). Chữ ký: check(long, long)
    String check(long balance, long amount) {
        if (amount <= 0) {
            return "TỪ CHỐI: số tiền phải lớn hơn 0";  // thoát sớm, bỏ qua phần dưới
        }
        if (amount > balance) {
            return "TỪ CHỐI: không đủ số dư";
        }
        long remaining = balance - amount;
        return "OK: còn " + remaining;                 // đường "thành công" ở cuối
    }
}
```

**Kết quả khi chạy:**

```text
TỪ CHỐI: số tiền phải lớn hơn 0
TỪ CHỐI: không đủ số dư
OK: còn 300000
```

**Giải thích từng bước:**

1. Chữ ký của method là `check(long, long)`: tên `check`, hai tham số kiểu `long`. Kiểu trả về
   `String` và tên `balance`, `amount` không thuộc chữ ký [9][10].
2. Lời gọi 1 `check(500_000, -10)`: đối số `500_000` vào tham số `balance`, `-10` vào `amount`, theo
   **thứ tự** [11]. `amount <= 0` đúng, `return` chạy, method dừng ngay. Hai lệnh `if` bên dưới không
   được chạy tới.
3. Lời gọi 2: `amount > balance` (`800000 > 500000`) đúng, method trả về chuỗi từ chối thứ hai.
4. Lời gọi 3: cả hai điều kiện đều sai, method đi tới cuối, tính `remaining` rồi trả về `"OK: còn 300000"`.

### ⚠️ Lỗi hay gặp

**Lỗi 1: tưởng đổi tên tham số là được method mới.** Tên tham số không thuộc chữ ký, nên hai method
dưới đây có **cùng** chữ ký `check(long, long)`. Một class không được có hai method trùng chữ ký
[10]:

```java
class WithdrawalPolicy {
    String check(long balance, long amount) {
        return "theo số dư";
    }

    String check(long limit, long value) {   // chỉ đổi TÊN tham số
        return "theo hạn mức";
    }
}
```

```text
DuplicateSignature.java:6: error: method check(long,long) is already defined in class WithdrawalPolicy
    String check(long limit, long value) {   // chỉ đổi TÊN tham số
           ^
1 error
```

Để ý: javac in chữ ký dạng `check(long,long)`, chỉ có tên và kiểu. **Cách sửa:** đặt tên method
khác (`checkByLimit`), hoặc đổi kiểu/số lượng tham số (phần 4).

**Lỗi 2: viết code sau `return`.** Lệnh nằm sau `return` trong cùng khối không bao giờ chạy tới, và
javac coi đó là lỗi biên dịch [13]:

```java
class WithdrawalPolicy {
    String check(long balance, long amount) {
        if (amount > balance) {
            return "TỪ CHỐI";
        }
        return "OK";
        System.out.println("Đã kiểm tra xong"); // nằm sau return
    }
}
```

```text
Unreachable.java:7: error: unreachable statement
        System.out.println("Đã kiểm tra xong"); // nằm sau return
        ^
1 error
```

**Cách sửa:** đặt lệnh in lên **trước** `return "OK";`.

**Lỗi 3: đảo thứ tự hai đối số cùng kiểu.** Cả hai tham số đều là `long`, nên javac không thể phát
hiện bạn đưa nhầm chỗ:

```java
public class SwappedArgs {
    public static void main(String[] args) {
        WithdrawalPolicy policy = new WithdrawalPolicy();
        long balance = 500_000;
        long amount = 200_000;
        System.out.println(policy.check(amount, balance)); // đảo thứ tự!
    }
}

class WithdrawalPolicy {
    String check(long balance, long amount) {
        if (amount > balance) {
            return "TỪ CHỐI: không đủ số dư";
        }
        return "OK: còn " + (balance - amount);
    }
}
```

```text
TỪ CHỐI: không đủ số dư
```

Có đủ tiền mà vẫn bị từ chối. **Cách sửa:** truyền đúng thứ tự `check(balance, amount)`. Về lâu dài,
hạn chế method có nhiều tham số cùng kiểu đứng cạnh nhau: đưa dữ liệu vào object (như phần 3, nơi số
dư nằm sẵn trong `Account`) để mỗi lời gọi chỉ cần một đối số.

## 3. Đóng gói đúng nghĩa: giữ quy tắc bất biến

**Ý tưởng nôm na.** Ngân hàng có một luật: **số dư không bao giờ âm**. Luật này được giữ không phải
nhờ khách tự giác, mà nhờ **két sắt chỉ mở qua quầy**: mở tài khoản, nạp tiền, rút tiền, xem số dư.
Quầy nào cũng kiểm tra trước khi đụng vào két. Không có quầy "ghi đè số dư theo ý khách".

Trong Java, **đóng gói** (*encapsulation*) là giấu trạng thái bên trong object và buộc mọi tương tác
đi qua method của nó [14]. Lời khuyên của Oracle: dùng mức truy cập chặt nhất có thể, **`private`
trừ khi có lý do chính đáng** [15]. Mục đích của việc giấu là giữ **quy tắc bất biến** (*class
invariant*): điều phải luôn đúng với **mọi** object của class [16]. Với `Account`, đó là
`balance ≥ 0`.

Chặng 1 Bài 6 đã có `private` và kiểm tra hợp lệ. Bài này thêm ba thói quen: (1) gọi tên quy tắc bất
biến, (2) kiểm tra **mọi** cửa vào, kể cả constructor, (3) chỉ có getter, **không** có setter; thay
đổi đi qua method mang tên **nghiệp vụ** (`deposit`, `withdraw`).

<svg viewBox="0 0 720 296" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Đóng gói Account để giữ quy tắc bất biến balance lớn hơn hoặc bằng 0. Code bên ngoài là Main chỉ đi được qua bốn cửa public: constructor Account(id, owner) mở với balance bằng 0; deposit(amount) chỉ nhận amount lớn hơn 0; withdraw(amount) chỉ nhận 0 nhỏ hơn amount và amount không vượt balance; getBalance() chỉ đọc và trả giá trị ra. Ba cửa đầu ghi vào két private BigDecimal balance, cửa getBalance đọc từ két. Đường setBalance từ bên ngoài bị gạch chéo: method này không tồn tại nên javac báo cannot find symbol.">
  <defs>
    <marker id="c2b2-inv-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
    <marker id="c2b2-inv-read" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#047857"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="110" width="150" height="60" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="85" y="135" text-anchor="middle" fill="#0F172A">Code bên ngoài</text>
    <text x="85" y="155" text-anchor="middle" font-family="monospace" fill="#64748B">Main.main()</text>
    <rect x="230" y="10" width="480" height="232" rx="12" fill="#F8FAFC" stroke="#2563EB" stroke-width="1.5"/>
    <text x="244" y="26" font-family="monospace" font-weight="bold" fill="#1D4ED8">class Account</text>
    <rect x="250" y="34" width="200" height="42" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="350" y="52" text-anchor="middle" font-family="monospace" fill="#047857">Account(id, owner)</text>
    <text x="350" y="69" text-anchor="middle" font-size="11" fill="#64748B">mở với balance = 0</text>
    <rect x="250" y="84" width="200" height="42" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="350" y="102" text-anchor="middle" font-family="monospace" fill="#047857">deposit(amount)</text>
    <text x="350" y="119" text-anchor="middle" font-size="11" fill="#64748B">chỉ nhận amount &gt; 0</text>
    <rect x="250" y="134" width="200" height="42" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="350" y="152" text-anchor="middle" font-family="monospace" fill="#047857">withdraw(amount)</text>
    <text x="350" y="169" text-anchor="middle" font-size="11" fill="#64748B">0 &lt; amount ≤ balance</text>
    <rect x="250" y="184" width="200" height="42" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="350" y="202" text-anchor="middle" font-family="monospace" fill="#1D4ED8">getBalance()</text>
    <text x="350" y="219" text-anchor="middle" font-size="11" fill="#64748B">chỉ đọc, trả giá trị ra</text>
    <rect x="500" y="80" width="190" height="96" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="595" y="104" text-anchor="middle" font-family="monospace" fill="#D97706">private</text>
    <text x="595" y="126" text-anchor="middle" font-family="monospace" fill="#0F172A">BigDecimal balance</text>
    <text x="595" y="156" text-anchor="middle" font-weight="bold" fill="#047857">bất biến: balance ≥ 0</text>
    <line x1="160" y1="132" x2="246" y2="56" stroke="#64748B" marker-end="url(#c2b2-inv-arrow)"/>
    <line x1="160" y1="136" x2="246" y2="106" stroke="#64748B" marker-end="url(#c2b2-inv-arrow)"/>
    <line x1="160" y1="144" x2="246" y2="154" stroke="#64748B" marker-end="url(#c2b2-inv-arrow)"/>
    <line x1="160" y1="150" x2="246" y2="200" stroke="#64748B" marker-end="url(#c2b2-inv-arrow)"/>
    <line x1="450" y1="56" x2="496" y2="96" stroke="#64748B" marker-end="url(#c2b2-inv-arrow)"/>
    <line x1="450" y1="106" x2="496" y2="118" stroke="#64748B" marker-end="url(#c2b2-inv-arrow)"/>
    <line x1="450" y1="154" x2="496" y2="142" stroke="#64748B" marker-end="url(#c2b2-inv-arrow)"/>
    <line x1="500" y1="170" x2="454" y2="200" stroke="#047857" marker-end="url(#c2b2-inv-read)"/>
    <polyline points="85,170 85,276 296,276" fill="none" stroke="#DC2626" stroke-dasharray="5 4"/>
    <line x1="298" y1="268" x2="314" y2="284" stroke="#DC2626" stroke-width="3"/>
    <line x1="314" y1="268" x2="298" y2="284" stroke="#DC2626" stroke-width="3"/>
    <text x="324" y="281" fill="#DC2626">setBalance(...) không tồn tại: javac báo "cannot find symbol"</text>
  </g>
</svg>

Lưu thành `EncapsulationDemo.java` rồi chạy `java EncapsulationDemo.java`:

```java
import java.math.BigDecimal;

public class EncapsulationDemo {
    public static void main(String[] args) {
        Account acc = new Account("ACC-001", "An");
        System.out.println("Nạp 500000:  " + acc.deposit(new BigDecimal("500000")));
        System.out.println("Nạp -50000:  " + acc.deposit(new BigDecimal("-50000")));
        System.out.println("Rút 800000:  " + acc.withdraw(new BigDecimal("800000")));
        System.out.println("Rút 200000:  " + acc.withdraw(new BigDecimal("200000")));
        System.out.println(acc.getId() + " | " + acc.getOwner() + " | " + acc.getBalance());
    }
}

class Account {
    // Bất biến (invariant): balance KHÔNG BAO GIỜ âm, ở mọi thời điểm
    private String id;
    private String owner;
    private BigDecimal balance = BigDecimal.ZERO;  // mở tài khoản: 0 đồng

    public Account(String id, String owner) {
        this.id = id;
        this.owner = owner;
    }

    public String getId() { return id; }
    public String getOwner() { return owner; }
    public BigDecimal getBalance() { return balance; }  // chỉ đọc, KHÔNG có setBalance

    public boolean deposit(BigDecimal amount) {
        if (amount == null || amount.signum() <= 0) {
            return false;                  // từ chối: số tiền phải dương
        }
        balance = balance.add(amount);
        return true;
    }

    public boolean withdraw(BigDecimal amount) {
        if (amount == null || amount.signum() <= 0) {
            return false;
        }
        if (balance.compareTo(amount) < 0) {
            return false;                  // từ chối: rút quá số dư
        }
        balance = balance.subtract(amount);
        return true;
    }
}
```

**Kết quả khi chạy:**

```text
Nạp 500000:  true
Nạp -50000:  false
Rút 800000:  false
Rút 200000:  true
ACC-001 | An | 300000
```

**Giải thích từng bước:**

1. Constructor chỉ nhận `id` và `owner`. Số dư khởi đầu luôn là `BigDecimal.ZERO`, nên quy tắc
   `balance ≥ 0` đúng **ngay từ lúc object ra đời**.
2. `deposit(500000)`: `amount.signum()` trả về `-1`, `0` hoặc `1` tuỳ số âm, bằng 0 hay dương [17].
   Ở đây là `1`, nên được cộng vào. Lưu ý `balance = balance.add(amount)`: `BigDecimal` không đổi
   được, `add` trả về object mới nên phải gán lại [17].
3. `deposit(-50000)`: `signum()` là `-1`, method trả `false` ngay, két không bị đụng tới.
4. `withdraw(800000)`: `balance.compareTo(amount)` trả về `-1`, `0` hoặc `1` khi `balance` nhỏ hơn,
   bằng hoặc lớn hơn `amount` [17]. `500000` nhỏ hơn `800000`, nên bị từ chối.
5. `withdraw(200000)` hợp lệ, số dư còn `300000`. Qua **mọi** lời gọi, `balance` chưa lần nào âm:
   quy tắc bất biến được giữ.
6. `getBalance()` trả thẳng field `balance` ra ngoài. An toàn, vì `BigDecimal` không đổi được [17]:
   người nhận không thể sửa object đó.

Nếu ai đó cố "đi cửa sau" bằng `acc.setBalance(new BigDecimal("-5000000"))`, chương trình **không
biên dịch được**, vì cửa đó không tồn tại:

```text
SetterAttempt.java:6: error: cannot find symbol
        acc.setBalance(new BigDecimal("-5000000"));   // không có cửa này
           ^
  symbol:   method setBalance(BigDecimal)
  location: variable acc of type Account
1 error
```

Đó là câu trả lời cho reviewer ở phần Tình huống: setter "mở toang" (như Chặng 1 Bài 6 đã cảnh báo)
phá quy tắc bất biến; method nghiệp vụ có kiểm tra thì giữ được nó.

### ⚠️ Lỗi hay gặp

**Lỗi 1: kiểm tra ở `deposit`/`withdraw` nhưng quên constructor.** Constructor cũng là một cửa vào.
Nếu nó gán thẳng số dư ban đầu, quy tắc bị phá ngay khi object ra đời:

```java
import java.math.BigDecimal;

public class ConstructorBypass {
    public static void main(String[] args) {
        Account acc = new Account("ACC-002", "Bình", new BigDecimal("-1000000"));
        System.out.println(acc.getId() + " mở với số dư " + acc.getBalance());
    }
}

class Account {
    private String id;
    private String owner;
    private BigDecimal balance;

    public Account(String id, String owner, BigDecimal openingBalance) {
        this.id = id;
        this.owner = owner;
        this.balance = openingBalance;     // gán thẳng, KHÔNG kiểm tra
    }

    public String getId() { return id; }
    public BigDecimal getBalance() { return balance; }
    // deposit/withdraw có kiểm tra đầy đủ như ví dụ trên (lược bớt)
}
```

```text
ACC-002 mở với số dư -1000000
```

**Cách sửa:** cho mọi khoản tiền đi qua **cùng một cửa kiểm tra**. Mở tài khoản với số dư `0`, rồi nạp
tiền ban đầu bằng `deposit`. Phần `main` của `ConstructorFixed.java` (class `Account` lấy từ ví dụ chính ở trên):

```java
Account acc = new Account("ACC-002", "Bình");      // luôn mở với 0 đồng
boolean ok = acc.deposit(new BigDecimal("-1000000")); // tiền ban đầu đi qua cửa kiểm tra
System.out.println("Nạp ban đầu hợp lệ? " + ok);
System.out.println(acc.getId() + " có số dư " + acc.getBalance());
```

```text
Nạp ban đầu hợp lệ? false
ACC-002 có số dư 0
```

Ở Chặng 3 bạn sẽ học cách chuẩn hơn: constructor ném **exception** khi dữ liệu sai.

**Lỗi 2: getter trả ra mảng bên trong.** Mảng (Chặng 1 Bài 5) **đổi được** nội dung. Getter trả
thẳng mảng là trao luôn "chìa khoá két": bên ngoài sửa được dữ liệu bên trong mà không qua kiểm tra
nào.

<svg viewBox="0 0 720 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Getter trả mảng gốc so với trả bản sao. Bên trái là khung main trên stack với ba biến tham chiếu acc, leaked và copy. Bên phải là heap. acc trỏ tới object Account, field history của Account trỏ tới mảng String gốc chứa phần tử 0 là NẠP 500000. Biến leaked, nhận từ getHistoryUnsafe(), trỏ vào CHÍNH mảng gốc đó, nên sửa leaked là sửa dữ liệu bên trong Account. Biến copy, nhận từ getHistory() dùng Arrays.copyOf, trỏ tới một mảng mới riêng biệt; sửa copy không ảnh hưởng mảng gốc.">
  <defs>
    <marker id="c2b2-leak-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
    <marker id="c2b2-leak-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/>
    </marker>
    <marker id="c2b2-leak-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#047857"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="200" height="230" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="110" y="32" text-anchor="middle" font-weight="bold" fill="#0F172A">Stack: main()</text>
    <text x="28" y="64" font-family="monospace" fill="#0F172A">acc</text>
    <rect x="110" y="46" width="70" height="26" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="145" cy="59" r="4" fill="#2563EB"/>
    <text x="28" y="124" font-family="monospace" fill="#0F172A">leaked</text>
    <rect x="110" y="106" width="70" height="26" rx="4" fill="#FEF2F2" stroke="#DC2626"/>
    <circle cx="145" cy="119" r="4" fill="#DC2626"/>
    <text x="28" y="184" font-family="monospace" fill="#0F172A">copy</text>
    <rect x="110" y="166" width="70" height="26" rx="4" fill="#ECFDF5" stroke="#10B981"/>
    <circle cx="145" cy="179" r="4" fill="#047857"/>
    <rect x="280" y="10" width="430" height="230" rx="10" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="495" y="28" text-anchor="middle" font-weight="bold" fill="#0F172A">Heap</text>
    <rect x="300" y="38" width="170" height="52" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="312" y="58" font-weight="bold" fill="#1D4ED8">object Account</text>
    <text x="312" y="80" font-family="monospace" fill="#0F172A">history</text>
    <circle cx="440" cy="76" r="4" fill="#2563EB"/>
    <rect x="520" y="38" width="175" height="62" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="532" y="58" fill="#DC2626" font-weight="bold">String[] gốc (bên trong)</text>
    <text x="532" y="84" font-family="monospace" fill="#0F172A">[0] = "NẠP 500000"</text>
    <rect x="520" y="156" width="175" height="62" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="532" y="176" fill="#047857" font-weight="bold">String[] bản sao (mới)</text>
    <text x="532" y="202" font-family="monospace" fill="#0F172A">[0] = "NẠP 500000"</text>
    <line x1="149" y1="59" x2="296" y2="62" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b2-leak-blue)"/>
    <line x1="444" y1="76" x2="516" y2="70" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b2-leak-blue)"/>
    <line x1="149" y1="119" x2="516" y2="94" stroke="#DC2626" stroke-width="1.5" marker-end="url(#c2b2-leak-red)"/>
    <text x="300" y="132" fill="#DC2626">getHistoryUnsafe(): CÙNG mảng gốc</text>
    <line x1="149" y1="179" x2="516" y2="187" stroke="#047857" stroke-width="1.5" marker-end="url(#c2b2-leak-green)"/>
    <text x="300" y="206" fill="#047857">getHistory(): mảng mới</text>
    <text x="360" y="262" text-anchor="middle" fill="#64748B">Trả mảng gốc = đưa chìa khoá két cho người ngoài. Trả bản sao thì két vẫn an toàn.</text>
  </g>
</svg>

```java
import java.util.Arrays;

public class LeakyArray {
    public static void main(String[] args) {
        Account acc = new Account();
        acc.deposit(500_000);

        String[] copy = acc.getHistory();
        copy[0] = "NẠP 1";                     // chỉ sửa bản sao
        System.out.println("Sau khi sửa bản sao:  " + acc.describe());

        String[] leaked = acc.getHistoryUnsafe();
        leaked[0] = "NẠP 999000000";            // sửa chính mảng bên trong!
        System.out.println("Sau khi sửa mảng gốc: " + acc.describe());
    }
}

class Account {
    private long balance;
    private String[] history = new String[10];
    private int count;

    public void deposit(long amount) {
        if (amount <= 0) {
            return;
        }
        balance += amount;
        history[count] = "NẠP " + amount;
        count++;
    }

    public String[] getHistoryUnsafe() { return history; }                    // trả "chìa khoá két"
    public String[] getHistory() { return Arrays.copyOf(history, count); }    // trả bản sao

    public String describe() { return "balance=" + balance + ", history[0]=" + history[0]; }
}
```

```text
Sau khi sửa bản sao:  balance=500000, history[0]=NẠP 500000
Sau khi sửa mảng gốc: balance=500000, history[0]=NẠP 999000000
```

Lịch sử giao dịch bị "viết lại" từ bên ngoài, dù field là `private`. **Cách sửa:** getter trả **bản
sao**. `Arrays.copyOf(history, count)` tạo một mảng mới chứa `count` phần tử đầu [18]. (Ví dụ này
dùng `long` cho gọn, và để mảng 10 ô cố định; Chặng 3 sẽ dùng `List`.)

## 4. Nạp chồng method (overloading)

**Ý tưởng nôm na.** Quầy "Nạp tiền" nhận nhiều loại giấy tờ: phiếu nộp tiền mặt ghi số nguyên,
phiếu điện tử ghi số chính xác kiểu `BigDecimal`, phiếu có thêm dòng ghi chú. Tên quầy vẫn là "Nạp
tiền", giao dịch viên nhìn **loại phiếu** để biết xử lý thế nào. **Nạp chồng** (*overloading*) là
có nhiều method **cùng tên** nhưng **khác danh sách tham số** (số lượng, kiểu, hoặc thứ tự kiểu)
trong cùng một class [9][19].

Bạn đã dùng overloading từ bài đầu tiên mà không để ý: `System.out.println` có các bản
`println(int)`, `println(long)`, `println(String)`, `println(Object)`... [21]. Constructor nạp chồng
ở Chặng 1 Bài 6 cũng là cùng ý tưởng.

<svg viewBox="0 0 720 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="javac chọn method nạp chồng theo đối số. Bên trái là bốn lời gọi, bên phải là ba method cùng tên deposit. Lời gọi acc.deposit(500_000) có đối số kiểu int, được nới thành long, khớp deposit(long). Lời gọi acc.deposit(new BigDecimal(...)) khớp deposit(BigDecimal). Lời gọi acc.deposit(bd, &quot;Lương&quot;) có hai đối số BigDecimal và String, khớp deposit(BigDecimal, String). Lời gọi acc.deposit(&quot;500000&quot;) với đối số String không khớp method nào, javac báo no suitable method found. Nét đứt: deposit(long) và deposit(BigDecimal, String) đều gọi lại bản gốc deposit(BigDecimal), nơi chứa logic kiểm tra.">
  <defs>
    <marker id="c2b2-ovl-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
    <marker id="c2b2-ovl-dash" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#D97706"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="160" y="20" text-anchor="middle" font-weight="bold" fill="#0F172A">Lời gọi (kiểu đối số)</text>
    <text x="545" y="20" text-anchor="middle" font-weight="bold" fill="#0F172A">Các method cùng tên deposit</text>
    <rect x="10" y="32" width="300" height="42" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="160" y="50" text-anchor="middle" font-family="monospace" fill="#0F172A">acc.deposit(500_000)</text>
    <text x="160" y="67" text-anchor="middle" font-size="11" fill="#64748B">int, được nới thành long</text>
    <rect x="10" y="92" width="300" height="42" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="160" y="110" text-anchor="middle" font-family="monospace" fill="#0F172A">acc.deposit(new BigDecimal(...))</text>
    <text x="160" y="127" text-anchor="middle" font-size="11" fill="#64748B">BigDecimal</text>
    <rect x="10" y="152" width="300" height="42" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="160" y="170" text-anchor="middle" font-family="monospace" fill="#0F172A">acc.deposit(bd, "Lương")</text>
    <text x="160" y="187" text-anchor="middle" font-size="11" fill="#64748B">BigDecimal, String</text>
    <rect x="10" y="212" width="300" height="42" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="160" y="230" text-anchor="middle" font-family="monospace" fill="#DC2626">acc.deposit("500000")</text>
    <text x="160" y="247" text-anchor="middle" font-size="11" fill="#DC2626">String</text>
    <rect x="420" y="32" width="250" height="42" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="545" y="58" text-anchor="middle" font-family="monospace" fill="#1D4ED8">deposit(long)</text>
    <rect x="420" y="92" width="250" height="42" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="545" y="110" text-anchor="middle" font-family="monospace" fill="#047857">deposit(BigDecimal)</text>
    <text x="545" y="127" text-anchor="middle" font-size="11" fill="#047857">bản gốc: chứa logic kiểm tra</text>
    <rect x="420" y="152" width="250" height="42" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="545" y="178" text-anchor="middle" font-family="monospace" fill="#1D4ED8">deposit(BigDecimal, String)</text>
    <line x1="310" y1="53" x2="416" y2="53" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b2-ovl-arrow)"/>
    <line x1="310" y1="113" x2="416" y2="113" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b2-ovl-arrow)"/>
    <line x1="310" y1="173" x2="416" y2="173" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b2-ovl-arrow)"/>
    <line x1="310" y1="233" x2="400" y2="233" stroke="#DC2626" stroke-dasharray="5 4"/>
    <line x1="404" y1="225" x2="420" y2="241" stroke="#DC2626" stroke-width="3"/>
    <line x1="420" y1="225" x2="404" y2="241" stroke="#DC2626" stroke-width="3"/>
    <text x="430" y="238" fill="#DC2626">"no suitable method found"</text>
    <path d="M670,53 L696,53 L696,105 L674,105" fill="none" stroke="#D97706" stroke-dasharray="5 4" marker-end="url(#c2b2-ovl-dash)"/>
    <path d="M670,173 L696,173 L696,121 L674,121" fill="none" stroke="#D97706" stroke-dasharray="5 4" marker-end="url(#c2b2-ovl-dash)"/>
    <text x="360" y="278" text-anchor="middle" fill="#64748B">javac khớp theo số lượng và kiểu đối số, lúc biên dịch. Nét đứt vàng: bản phụ gọi lại bản gốc.</text>
  </g>
</svg>

```java
import java.math.BigDecimal;

public class OverloadingDemo {
    public static void main(String[] args) {
        Account acc = new Account("ACC-001");
        acc.deposit(500_000);                           // đối số kiểu int -> nới thành long
        acc.deposit(new BigDecimal("1200000"));         // đối số kiểu BigDecimal
        acc.deposit(new BigDecimal("300000"), "Lương"); // 2 đối số
        System.out.println("Số dư: " + acc.getBalance());
    }
}

class Account {
    private String id;
    private BigDecimal balance = BigDecimal.ZERO;

    public Account(String id) { this.id = id; }

    public BigDecimal getBalance() { return balance; }

    // (1) Bản "gốc": chứa toàn bộ logic kiểm tra
    public boolean deposit(BigDecimal amount) {
        System.out.println("-> deposit(BigDecimal) với " + amount);
        if (amount == null || amount.signum() <= 0) {
            return false;
        }
        balance = balance.add(amount);
        return true;
    }

    // (2) Cùng tên, khác KIỂU tham số: đổi long sang BigDecimal rồi gọi bản gốc
    public boolean deposit(long amount) {
        System.out.println("-> deposit(long) với " + amount);
        return deposit(BigDecimal.valueOf(amount));
    }

    // (3) Cùng tên, khác SỐ LƯỢNG tham số
    public boolean deposit(BigDecimal amount, String note) {
        System.out.println("-> deposit(BigDecimal, String) ghi chú: " + note);
        return deposit(amount);
    }
}
```

**Kết quả khi chạy:**

```text
-> deposit(long) với 500000
-> deposit(BigDecimal) với 500000
-> deposit(BigDecimal) với 1200000
-> deposit(BigDecimal, String) ghi chú: Lương
-> deposit(BigDecimal) với 300000
Số dư: 2000000
```

**Giải thích từng bước:**

1. Ba method cùng tên `deposit` nhưng ba chữ ký khác nhau: `deposit(BigDecimal)`, `deposit(long)`,
   `deposit(BigDecimal, String)`. Vì chữ ký khác nhau nên chúng cùng tồn tại được [19].
2. `acc.deposit(500_000)`: literal `500_000` có kiểu `int`. Không có `deposit(int)`, nhưng `int` được
   **nới rộng** (*widening*) thành `long` khi truyền vào method [20], nên javac chọn
   `deposit(long)`. Dòng đầu output xác nhận điều đó.
3. `deposit(long)` không tự cộng tiền. Nó đổi sang `BigDecimal` bằng `BigDecimal.valueOf(amount)`
   rồi gọi lại **bản gốc** (dòng thứ hai của output). Logic kiểm tra chỉ viết **một lần**, quy tắc
   bất biến của phần 3 vẫn được giữ dù đi cửa nào.
4. `deposit(new BigDecimal("1200000"))` khớp thẳng bản gốc.
5. `deposit(..., "Lương")` có **hai** đối số nên khớp bản ba, bản này lại gọi về bản gốc.
6. Tổng `500000 + 1200000 + 300000 = 2000000`.

javac chọn bản nào dựa vào **số lượng** và **kiểu lúc biên dịch** của đối số, ngay **lúc biên
dịch** [19]. Quy tắc chọn chi tiết (khi nhiều bản cùng khớp) để dành cho Bài 6.

### ⚠️ Lỗi hay gặp

**Lỗi 1: chỉ khác kiểu trả về.** Kiểu trả về không thuộc chữ ký, nên hai method dưới đây trùng chữ
ký `deposit(long)`. javac không dùng kiểu trả về để phân biệt method [9][19]:

```java
import java.math.BigDecimal;

class Account {
    private BigDecimal balance = BigDecimal.ZERO;

    public boolean deposit(long amount) {
        return amount > 0;
    }

    public void deposit(long amount) {      // chỉ khác kiểu trả về
        balance = balance.add(BigDecimal.valueOf(amount));
    }
}
```

```text
ReturnTypeOnly.java:10: error: method deposit(long) is already defined in class Account
    public void deposit(long amount) {      // chỉ khác kiểu trả về
                ^
1 error
```

Đây chính là lỗi trong phần Tình huống. Hãy nghĩ theo cách của javac: khi gặp lời gọi
`acc.deposit(100);` đứng một mình, không gán vào đâu, nó không có cách nào biết bạn muốn bản nào.
**Cách sửa:** giữ một bản, hoặc đổi tên (ví dụ `tryDeposit`).

**Lỗi 2: truyền kiểu không khớp bản nào.** javac liệt kê mọi bản đã thử và lý do từng bản không khớp:

```java
import java.math.BigDecimal;

public class NoSuitable {
    public static void main(String[] args) {
        Account acc = new Account();
        acc.deposit("500000");                 // đối số là String
    }
}

class Account {
    public boolean deposit(BigDecimal amount) { return true; }
    public boolean deposit(long amount) { return true; }
}
```

```text
NoSuitable.java:6: error: no suitable method found for deposit(String)
        acc.deposit("500000");                 // đối số là String
           ^
    method Account.deposit(BigDecimal) is not applicable
      (argument mismatch; String cannot be converted to BigDecimal)
    method Account.deposit(long) is not applicable
      (argument mismatch; String cannot be converted to long)
1 error
```

**Cách sửa:** đổi dữ liệu sang đúng kiểu trước khi gọi: `acc.deposit(new BigDecimal("500000"))`.
Đừng vội thêm `deposit(String)`: mỗi bản nạp chồng là thêm một cửa phải kiểm tra. Oracle cũng khuyên
dùng overloading một cách tiết chế, vì quá nhiều bản làm code khó đọc [9].

## 5. Gọi chuỗi method (method chaining)

**Ý tưởng nôm na.** Khi làm **sao kê** cho khách, giao dịch viên cầm **một** tờ sao kê và lần lượt
ghi: tiêu đề, dòng 1, dòng 2, dòng tổng. Mỗi bước xong lại cầm **chính tờ đó** sang bước sau. **Gọi
chuỗi** (*method chaining*) là gọi nhiều method nối nhau trong một câu lệnh: mỗi method trả về một
object, và method tiếp theo được gọi trên object đó [2].

Kỹ thuật phổ biến nhất là method trả về **chính object đang chạy nó**: `return this;`. Đây đúng là cách
`StringBuilder` làm: tài liệu JDK ghi rằng `append` trả về "a reference to this object", một tham chiếu
tới chính object này [22]. Martin Fowler gọi kiểu API đọc trôi như câu văn này là **fluent
interface** [23].

<svg viewBox="0 0 720 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hai kiểu gọi chuỗi. Phần trên, builder: new StatementBuilder() rồi header(&quot;ACC-001&quot;), line(...), line(...), build(). Ba method header và line đều return this, nên cả chuỗi làm việc trên CÙNG một object StatementBuilder số 1; build() trả về String sao kê. Phần dưới, BigDecimal không đổi được: balance là object số 1 giá trị 1000000; .add(deposit) tạo object mới số 2 giá trị 1500000; .subtract(fee) tạo object mới số 3 giá trị 1489000. Nếu không gán lại thì số 2 và số 3 bị bỏ, balance vẫn trỏ số 1; viết balance = balance.add(...).subtract(...) thì balance trỏ số 3.">
  <defs>
    <marker id="c2b2-chain-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
    <marker id="c2b2-chain-this" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="700" height="150" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="360" y="30" text-anchor="middle" font-weight="bold" fill="#1D4ED8">Builder: mỗi method trả về this, CÙNG một object</text>
    <rect x="24" y="44" width="150" height="32" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="99" y="65" text-anchor="middle" font-family="monospace" fill="#0F172A">header("ACC-001")</text>
    <rect x="200" y="44" width="100" height="32" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="250" y="65" text-anchor="middle" font-family="monospace" fill="#0F172A">line(...)</text>
    <rect x="326" y="44" width="100" height="32" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="376" y="65" text-anchor="middle" font-family="monospace" fill="#0F172A">line(...)</text>
    <rect x="452" y="44" width="90" height="32" rx="6" fill="#FFFFFF" stroke="#10B981"/>
    <text x="497" y="65" text-anchor="middle" font-family="monospace" fill="#047857">build()</text>
    <rect x="570" y="44" width="126" height="32" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="633" y="65" text-anchor="middle" fill="#047857">String sao kê</text>
    <line x1="174" y1="60" x2="196" y2="60" stroke="#64748B" marker-end="url(#c2b2-chain-arrow)"/>
    <line x1="300" y1="60" x2="322" y2="60" stroke="#64748B" marker-end="url(#c2b2-chain-arrow)"/>
    <line x1="426" y1="60" x2="448" y2="60" stroke="#64748B" marker-end="url(#c2b2-chain-arrow)"/>
    <line x1="542" y1="60" x2="566" y2="60" stroke="#64748B" marker-end="url(#c2b2-chain-arrow)"/>
    <rect x="200" y="110" width="230" height="38" rx="8" fill="#FFFFFF" stroke="#2563EB" stroke-width="2"/>
    <text x="315" y="134" text-anchor="middle" font-family="monospace" fill="#1D4ED8">StatementBuilder #1</text>
    <line x1="99" y1="76" x2="236" y2="107" stroke="#2563EB" marker-end="url(#c2b2-chain-this)"/>
    <line x1="250" y1="76" x2="290" y2="107" stroke="#2563EB" marker-end="url(#c2b2-chain-this)"/>
    <line x1="376" y1="76" x2="340" y2="107" stroke="#2563EB" marker-end="url(#c2b2-chain-this)"/>
    <text x="442" y="128" fill="#1D4ED8">3 mũi tên "return this":</text>
    <text x="442" y="146" fill="#1D4ED8">đều trỏ về object #1</text>
    <rect x="10" y="172" width="700" height="150" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="360" y="192" text-anchor="middle" font-weight="bold" fill="#D97706">BigDecimal (không đổi được): mỗi method trả về object MỚI</text>
    <rect x="30" y="206" width="150" height="46" rx="8" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="105" y="226" text-anchor="middle" font-family="monospace" fill="#0F172A">#1: 1000000</text>
    <text x="105" y="243" text-anchor="middle" font-size="11" fill="#64748B">balance (không đổi)</text>
    <rect x="285" y="206" width="150" height="46" rx="8" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="360" y="226" text-anchor="middle" font-family="monospace" fill="#0F172A">#2: 1500000</text>
    <text x="360" y="243" text-anchor="middle" font-size="11" fill="#64748B">object mới</text>
    <rect x="540" y="206" width="150" height="46" rx="8" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="615" y="226" text-anchor="middle" font-family="monospace" fill="#0F172A">#3: 1489000</text>
    <text x="615" y="243" text-anchor="middle" font-size="11" fill="#64748B">object mới</text>
    <line x1="180" y1="229" x2="281" y2="229" stroke="#64748B" marker-end="url(#c2b2-chain-arrow)"/>
    <text x="232" y="221" text-anchor="middle" font-family="monospace" font-size="11" fill="#0F172A">.add(dep)</text>
    <line x1="435" y1="229" x2="536" y2="229" stroke="#64748B" marker-end="url(#c2b2-chain-arrow)"/>
    <text x="487" y="221" text-anchor="middle" font-family="monospace" font-size="11" fill="#0F172A">.subtract(fee)</text>
    <text x="360" y="280" text-anchor="middle" fill="#DC2626">Không gán lại: #2, #3 bị bỏ đi, balance vẫn trỏ #1</text>
    <text x="360" y="304" text-anchor="middle" font-family="monospace" fill="#047857">balance = balance.add(dep).subtract(fee);  → balance trỏ #3</text>
  </g>
</svg>

Trước hết, tự kiểm chứng `append` trả về chính nó:

```java
public class StringBuilderChain {
    public static void main(String[] args) {
        StringBuilder sb = new StringBuilder();
        StringBuilder returned = sb.append("ACC-001");   // append trả về gì?
        System.out.println("returned == sb ? " + (returned == sb));

        // Vì append trả về CHÍNH object đó, ta gọi nối tiếp được
        sb.append(" | ").append("An").append(" | ").append(500_000);
        System.out.println(sb.toString());
    }
}
```

**Kết quả khi chạy:**

```text
returned == sb ? true
ACC-001 | An | 500000
```

`returned == sb` là `true`: hai biến trỏ **cùng một object** (Chặng 1 Bài 6: `==` so sánh tham
chiếu). Giờ tự viết một builder cho sao kê, lưu thành `StatementDemo.java`:

```java
public class StatementDemo {
    public static void main(String[] args) {
        String statement = new StatementBuilder()
                .header("ACC-001")
                .line("Nạp lương", 15_000_000)
                .line("Rút ATM", -2_000_000)
                .line("Phí SMS", -11_000)
                .build();
        System.out.print(statement);
    }
}

class StatementBuilder {
    private StringBuilder text = new StringBuilder();
    private long total;      // tiền VND: long, đơn vị đồng (chỉ cộng trừ)

    public StatementBuilder header(String accountId) {
        text.append("SAO KÊ ").append(accountId).append('\n');
        return this;                     // trả về chính builder này
    }

    public StatementBuilder line(String description, long amount) {
        text.append("  ").append(description).append(": ").append(amount).append('\n');
        total += amount;
        return this;
    }

    public String build() {              // method cuối chuỗi: trả về kết quả
        return text.append("  Tổng thay đổi: ").append(total).append('\n').toString();
    }
}
```

**Kết quả khi chạy:**

```text
SAO KÊ ACC-001
  Nạp lương: 15000000
  Rút ATM: -2000000
  Phí SMS: -11000
  Tổng thay đổi: 12989000
```

**Giải thích từng bước:**

1. `new StatementBuilder()` tạo object #1. Hai field `text` và `total` là **field**, nên giữ được dữ
   liệu qua nhiều lần gọi (phần 1).
2. `.header("ACC-001")` ghi tiêu đề, rồi `return this;` trả về tham chiếu tới object #1.
3. `.line("Nạp lương", 15_000_000)` được gọi **trên giá trị vừa trả về**, tức vẫn là object #1. Nó ghi
   một dòng, cộng vào `total`, rồi lại `return this;`. Hai `.line(...)` sau cũng vậy.
4. `.build()` là method **cuối chuỗi**: nó không trả `this` mà trả về `String` kết quả. Sau `build()`,
   chuỗi kết thúc.
5. Kiểu trả về `StatementBuilder` trong khai báo `header`, `line` chính là điều cho phép gọi tiếp. Tiền
   ở đây là `long` (đơn vị đồng) vì builder chỉ cộng trừ, như cách Chặng 1 Bài 6 giải thích.

Fowler lưu ý một cái giá: method "đổi trạng thái" thường trả `void`, còn fluent interface phá lệ đó
để trả về object [23]. Vì vậy hãy dùng chaining cho việc **lắp ráp** (builder, sao kê, chuỗi), đừng
ép method nghiệp vụ như `withdraw` trả `this`: nó cần trả `true`/`false` để báo bị từ chối.

### ⚠️ Lỗi hay gặp

**Lỗi 1: một method trong chuỗi trả `void`.** `void` nghĩa là "không trả gì", nên không còn object
nào để gọi tiếp:

```java
public class VoidChain {
    public static void main(String[] args) {
        new StatementBuilder()
                .header("ACC-001")
                .line("Nạp lương", 15_000_000);
    }
}

class StatementBuilder {
    private StringBuilder text = new StringBuilder();

    public void header(String accountId) {          // quên: trả về void
        text.append("SAO KÊ ").append(accountId).append('\n');
    }

    public StatementBuilder line(String description, long amount) {
        text.append(description).append(": ").append(amount).append('\n');
        return this;
    }
}
```

```text
VoidChain.java:5: error: void cannot be dereferenced
                .line("Nạp lương", 15_000_000);
                ^
1 error
```

*Dereference* là "đi theo tham chiếu để gọi method". Không có tham chiếu thì không đi được. **Cách
sửa:** đổi kiểu trả về thành `StatementBuilder` và thêm `return this;`.

**Lỗi 2: gọi chuỗi trên object không đổi được rồi quên gán.** Chuỗi gọi trên `BigDecimal` trông giống
builder, nhưng **mỗi** bước tạo object mới (nửa dưới hình) [17]:

```java
import java.math.BigDecimal;

public class ImmutableChain {
    public static void main(String[] args) {
        BigDecimal balance = new BigDecimal("1000000");
        BigDecimal deposit = new BigDecimal("500000");
        BigDecimal fee = new BigDecimal("11000");

        balance.add(deposit).subtract(fee);             // kết quả bị bỏ đi!
        System.out.println("Quên gán:  " + balance);

        balance = balance.add(deposit).subtract(fee);   // gán object mới cuối chuỗi
        System.out.println("Có gán:    " + balance);
    }
}
```

```text
Quên gán:  1000000
Có gán:    1489000
```

Không có lỗi biên dịch nào, chỉ có số dư sai. **Cách sửa:** với object không đổi được, luôn gán kết
quả cuối chuỗi vào biến. Cách nhận biết: đọc tài liệu method. `StringBuilder.append` ghi "a reference
to this object" [22]; `BigDecimal` được mô tả là *immutable* [17].

## Nên / Không nên

| ✅ Nên | ❌ Không nên |
|--------|-------------|
| Khai báo field `private`, viết rõ quy tắc bất biến bằng comment | Để field `public` hoặc thêm `setBalance` "cho tiện" |
| Kiểm tra ở **mọi** cửa vào, kể cả constructor | Chỉ kiểm tra ở `deposit` rồi để constructor gán thẳng |
| Khởi tạo field `BigDecimal` bằng `BigDecimal.ZERO` | Để field `BigDecimal` mặc định `null` |
| Getter trả bản sao với mảng (`Arrays.copyOf`) | Getter trả thẳng mảng bên trong |
| Bản nạp chồng phụ gọi lại một bản gốc chứa logic | Chép logic kiểm tra vào từng bản nạp chồng |
| Dùng `return this` cho builder/sao kê, kết thúc bằng `build()` | Ép method nghiệp vụ có thể bị từ chối (`withdraw`) trả `this` |
| Gán lại kết quả khi gọi chuỗi trên `BigDecimal`, `String` | Gọi `balance.add(x)` rồi bỏ quên kết quả |

## Tóm tắt

- **Field** sống cùng object và có giá trị mặc định (`0`, `false`, `null`). **Biến cục bộ** sống
  trong một lần gọi method, nằm trong khung trên stack, và phải được gán trước khi đọc.
- Field `BigDecimal` mặc định là `null`, không phải `0`: hãy khởi tạo `BigDecimal.ZERO`. Khai báo lại
  tên field trong method sẽ tạo biến cục bộ che mất field.
- **Chữ ký** method = tên + kiểu các tham số theo thứ tự. Kiểu trả về, tên tham số, modifier không
  thuộc chữ ký. **Tham số** là biến trong khai báo; **đối số** là giá trị lúc gọi.
- `return` dừng method ngay. Dùng nó để thoát sớm ở các trường hợp xấu; code sau `return` trong cùng
  khối là `unreachable statement`.
- **Đóng gói** = giấu trạng thái + buộc mọi thay đổi đi qua method có kiểm tra, để giữ **quy tắc bất
  biến** (`balance ≥ 0`). Kiểm tra cả constructor; getter không trả ra object/mảng đổi được.
- **Nạp chồng**: cùng tên, khác danh sách tham số; javac chọn bản theo số lượng và kiểu đối số lúc
  biên dịch. Chỉ khác kiểu trả về thì là trùng chữ ký, không hợp lệ.
- **Gọi chuỗi**: method `return this` để gọi tiếp trên cùng object (builder, `StringBuilder`). Trên
  object không đổi được, mỗi bước tạo object mới, nhớ gán lại kết quả.

## Tự kiểm tra

**Câu 1.** (Mục tiêu 1) Trong class `Account` có field `int count;`. Trong method `report()` có biến
cục bộ `int total;`. Lệnh `System.out.println(count);` và `System.out.println(total);` (đặt trong
`report()`, chưa gán gì) có biên dịch được không?

<details><summary>Đáp án</summary>

`println(count)` biên dịch được và in `0`: field có giá trị mặc định. `println(total)` **không**
biên dịch được: javac báo `variable total might not have been initialized`, vì biến cục bộ không có
giá trị mặc định và phải được gán trước khi đọc.

</details>

**Câu 2.** (Mục tiêu 1) Sau khi `transferFee` chạy xong hai lần, vì sao `feeCalls` là `2` còn `fee`
của lần gọi đầu thì "biến mất"?

<details><summary>Đáp án</summary>

`feeCalls` là **field**, nằm trong object trên heap, sống cùng object, nên mỗi lần gọi đều tăng tiếp
từ giá trị cũ. `fee` là **biến cục bộ**, nằm trong khung của lần gọi đó; khung bị xoá khi method
`return`, lần gọi sau có khung mới với `fee` mới.

</details>

**Câu 3.** (Mục tiêu 2) Cặp method nào cùng tồn tại được trong một class?
(a) `boolean withdraw(BigDecimal amount)` và `void withdraw(BigDecimal value)`;
(b) `boolean withdraw(long amount)` và `boolean withdraw(BigDecimal amount)`.

<details><summary>Đáp án</summary>

Chỉ **(b)**. Cặp (a) có cùng chữ ký `withdraw(BigDecimal)`: kiểu trả về và tên tham số không thuộc
chữ ký, nên javac báo `is already defined`. Cặp (b) có hai chữ ký khác nhau `withdraw(long)` và
`withdraw(BigDecimal)`.

</details>

**Câu 4.** (Mục tiêu 2) Trong lời gọi `acc.deposit(fee)` với khai báo
`boolean deposit(BigDecimal amount)`, đâu là tham số, đâu là đối số? Nếu trong method có
`if (amount.signum() <= 0) { return false; }` và đối số là số âm, các dòng phía sau có chạy không?

<details><summary>Đáp án</summary>

`fee` (giá trị lúc gọi) là **đối số**; `amount` (biến trong khai báo) là **tham số**. Với số âm,
`return false;` chạy và method dừng ngay, các dòng phía sau **không** chạy.

</details>

**Câu 5.** (Mục tiêu 3) Một bạn viết `Account` có `private BigDecimal balance` kèm
`public void setBalance(BigDecimal b) { balance = b; }`. Bạn ấy nói "field private rồi, đóng gói
xong". Đúng không? Quy tắc bất biến nào bị đe doạ?

<details><summary>Đáp án</summary>

Không đúng. `private` chỉ chặn truy cập trực tiếp, còn setter mở toang mở ra một cửa **không kiểm
tra**: `setBalance(new BigDecimal("-5000000"))` làm số dư âm, phá quy tắc `balance ≥ 0`. Cách đúng:
bỏ setter, chỉ cho đổi số dư qua `deposit`/`withdraw` có kiểm tra.

</details>

**Câu 6.** (Mục tiêu 3) Vì sao `getBalance()` trả thẳng field `BigDecimal` thì an toàn, còn
`getHistory()` trả thẳng field `String[]` thì không?

<details><summary>Đáp án</summary>

`BigDecimal` không đổi được, người nhận không sửa được object đó. Mảng thì đổi được: người nhận viết
`h[0] = ...` là sửa luôn mảng bên trong `Account`. Vì vậy với mảng phải trả bản sao, ví dụ
`Arrays.copyOf(history, count)`.

</details>

**Câu 7.** (Mục tiêu 4) `Account` có `deposit(long)` và `deposit(BigDecimal)`. Lời gọi
`acc.deposit(200_000)` chạy bản nào? Còn `acc.deposit("200000")`?

<details><summary>Đáp án</summary>

`acc.deposit(200_000)`: đối số kiểu `int`, được nới thành `long`, nên chạy `deposit(long)`.
`acc.deposit("200000")`: không bản nào nhận `String`, javac báo `no suitable method found for
deposit(String)`.

</details>

**Câu 8.** (Mục tiêu 5) Đoạn `new StatementBuilder().header("ACC-001").line("Phí", -11_000)` báo
`void cannot be dereferenced`. Nguyên nhân? Và vì sao `balance.add(x);` (với `balance` kiểu
`BigDecimal`) không đổi số dư dù trông giống chaining?

<details><summary>Đáp án</summary>

`header` đang trả `void`, nên không có object nào để gọi `.line(...)` tiếp. Sửa: kiểu trả về
`StatementBuilder` và `return this;`. Còn `BigDecimal` không đổi được: `add` trả về **object mới**
chứ không phải `this`; không gán `balance = balance.add(x);` thì kết quả bị bỏ đi.

</details>

## Bài tập

**Bài 1 (dễ).** Thêm vào `Account` (phần 4) bản nạp chồng `boolean withdraw(long amount)`, gọi lại
`withdraw(BigDecimal)` của phần 3. Thử `withdraw(200_000)`, `withdraw(-1)` và
`withdraw(new BigDecimal("99000000"))`.

> 💡 Gợi ý: làm giống `deposit(long)`: `return withdraw(BigDecimal.valueOf(amount));`. Đừng chép lại
> logic kiểm tra.

**Bài 2 (vừa).** Viết `boolean transferTo(Account target, BigDecimal amount)`. Yêu cầu: sau mọi lời
gọi, **cả hai** tài khoản vẫn giữ quy tắc `balance ≥ 0`, và nếu chuyển thất bại thì không tài khoản
nào bị đổi. Thử: chuyển hợp lệ, chuyển quá số dư, chuyển số âm, `target` là `null`.

> 💡 Gợi ý: kiểm tra `target == null` và `target == this` trước. Gọi `this.withdraw(amount)`; nếu
> `false` thì `return false` ngay (thoát sớm). Chỉ khi rút thành công mới `target.deposit(amount)`.

**Bài 3 (khó hơn).** Mở rộng `StatementBuilder` (phần 5) để dùng `BigDecimal`: thêm
`opening(BigDecimal balance)` ghi số dư đầu kỳ, đổi `line(String, long)` thành
`line(String, BigDecimal)` và giữ thêm bản nạp chồng `line(String, long)` gọi lại nó. `build()` in
thêm dòng "Số dư cuối kỳ". Mọi method trừ `build()` phải gọi chuỗi được.

> 💡 Gợi ý: field `private BigDecimal total = BigDecimal.ZERO;` và nhớ `total = total.add(amount);`
> (lỗi 2 của phần 5). Số dư cuối kỳ = số dư đầu kỳ + tổng thay đổi.

## Nguồn tham khảo

1. roadmap.sh: Java Developer Roadmap. <https://roadmap.sh/java>
2. roadmap.sh, nội dung từng topic Java (Attributes and Methods, Encapsulation, Method Overloading, Method Chaining). <https://github.com/kamranahmedse/developer-roadmap/tree/master/roadmaps/java/content>
3. JLS SE 25, §4.12.3 Kinds of Variables. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.12.3>
4. JLS SE 25, §4.12.5 Initial Values of Variables. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-4.html#jls-4.12.5>
5. JVMS SE 25, §2.5.3 Heap. <https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-2.html#jvms-2.5.3>
6. JVMS SE 25, §2.6 Frames. <https://docs.oracle.com/javase/specs/jvms/se25/html/jvms-2.html#jvms-2.6>
7. Oracle Java Tutorials: Variables (fields và local variables). <https://docs.oracle.com/javase/tutorial/java/nutsandbolts/variables.html>
8. JLS SE 25, §6.4.1 Shadowing. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-6.html#jls-6.4.1>
9. Oracle Java Tutorials: Defining Methods (method signature, overloading). <https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html>
10. JLS SE 25, §8.4.2 Method Signature. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.2>
11. Oracle Java Tutorials: Passing Information to a Method or a Constructor (parameters và arguments). <https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html>
12. JLS SE 25, §14.17 The return Statement. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html#jls-14.17>
13. JLS SE 25, §14.22 Unreachable Statements. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-14.html#jls-14.22>
14. Oracle Java Tutorials: What Is an Object? (data encapsulation). <https://docs.oracle.com/javase/tutorial/java/concepts/object.html>
15. Oracle Java Tutorials: Controlling Access to Members of a Class. <https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html>
16. Oracle: Programming With Assertions (class invariants). <https://docs.oracle.com/javase/8/docs/technotes/guides/language/assert.html>
17. Java SE 25 API: `java.math.BigDecimal` (immutable, `signum`, `compareTo`, `add`). <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/math/BigDecimal.html>
18. Java SE 25 API: `java.util.Arrays.copyOf`. <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Arrays.html>
19. JLS SE 25, §8.4.9 Overloading. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.9>
20. JLS SE 25, §5.3 Invocation Contexts (widening khi truyền đối số). <https://docs.oracle.com/javase/specs/jls/se25/html/jls-5.html#jls-5.3>
21. Java SE 25 API: `java.io.PrintStream` (các bản `println`). <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/io/PrintStream.html>
22. Java SE 25 API: `java.lang.StringBuilder` (`append` trả về "a reference to this object"). <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/StringBuilder.html>
23. Martin Fowler: FluentInterface. <https://martinfowler.com/bliki/FluentInterface.html>

**Bài tiếp theo:** [Bài 3 · static, final và vòng đời object](/docs/learning/chang-2/static-final-vong-doi-object)
