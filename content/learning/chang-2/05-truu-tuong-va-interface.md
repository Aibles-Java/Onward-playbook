---
title: "Bài 5 · Trừu tượng và interface"
description: "Tách “làm được gì” khỏi “làm thế nào”: abstract class, interface, default/static method, đa hình qua danh sách tài khoản và sealed class, qua ví dụ ngân hàng."
order: 25
tags: [java, chặng-2, oop, abstraction, interface, abstract-class, sealed]
language: vi
profile: onward-java-course
classification: public-safe
source_repo: none
source_refs:
  - https://roadmap.sh/java
  - https://github.com/kamranahmedse/developer-roadmap/tree/master/roadmaps/java/content
  - https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.1.1
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.3.1
  - https://jenkov.com/tutorials/java/abstract-classes.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.8.7.1
  - https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html#jls-9.4
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.5
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8.3
  - https://dev.java/learn/language/oop/interfaces/interfaces-as-a-type/
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html#jls-9.3
  - https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html
  - https://www.oracle.com/java/technologies/javase/8-whats-new.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8.4
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html#jls-9.4.1.1
  - https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/List.html#unmodifiable
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Class.html
  - https://docs.oracle.com/javase/tutorial/java/IandI/multipleinheritance.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.4
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html#jls-9.1.5
  - https://openjdk.org/jeps/213
  - https://jenkov.com/tutorials/java/interfaces-vs-abstract-classes.html
  - https://openjdk.org/jeps/409
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.1.2
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.6
  - https://jenkov.com/tutorials/java/interfaces.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-6.html#jls-6.6.1
verified_with: "openjdk 21.0.9"
verification: ran-locally
verification_note: "Đã chạy 7 chương trình (AbstractDemo, InterfaceDemo, DefaultStaticDemo, PolymorphismDemo, OneObjectManyRoles, SealedDemo, TwoDefaultsFixed) bằng `java <File>.java` trên openjdk 21.0.9 và biên dịch 13 ví dụ lỗi bằng `javac`; mọi output và thông báo lỗi trong bài là output thật. Đáp án câu 6, câu 8 và lời giải mẫu gợi ý Bài tập 2 cũng đã chạy. Chưa chạy trên JDK 25 (không có sẵn); bài không dùng preview feature."
contract_version: 1
---

# Bài 5 · Trừu tượng và interface

> 🎯 **Sau bài này bạn sẽ:**
> 1. Viết được một `abstract class Account` có abstract method `monthlyInterest()`, và sửa được hai lỗi compile hay gặp: `new` một abstract class, lớp con quên viết method abstract.
> 2. Khai báo được interface `Transferable`, `InterestBearing` và viết được một class `implements` nhiều interface cùng lúc.
> 3. Dùng đúng `default` method, `static` method và hằng trong interface, và sửa được lỗi hai `default` method trùng tên.
> 4. Viết được vòng lặp trên `Account[]` hoặc `List<Account>` gọi chung `monthlyInterest()`, và giải thích được vì sao mỗi object cho một kết quả khác nhau.
> 5. Chọn được abstract class hay interface cho một tình huống cụ thể, và đọc được một khai báo `sealed ... permits`.

## Tình huống

Bạn vừa mở pull request thêm `SavingAccount` và `CheckingAccount` cho hệ thống ngân hàng nhỏ của nhóm.
Reviewer để lại hai comment. Một: "Đừng cho ai viết `new Account(...)` chung chung. Tài khoản thật thì phải là
tiết kiệm hoặc thanh toán." Hai: "Module chuyển tiền chỉ cần biết *thứ gì chuyển tiền được*, đừng bắt nó phụ
thuộc vào cả class `Account`." Bạn đồng ý, nhưng chưa biết Java có công cụ gì để làm đúng hai việc đó.
Bài này trả lời: `abstract class` cho comment một, `interface` cho comment hai.

**Cần biết trước:** [Chặng 1 · Bài 6 · Nhập môn OOP](/docs/learning/chang-1/nhap-mon-oop) (class, object,
tham chiếu, bốn trụ cột), [Chặng 1 · Bài 7 · Checkpoint lãi kép](/docs/learning/chang-1/checkpoint-lai-kep)
(`BigDecimal`, `RoundingMode.HALF_UP`), [Bài 2 · Đóng gói và method](/docs/learning/chang-2/dong-goi-va-method)
(chữ ký method, getter), [Bài 4 · Kế thừa và ghi đè](/docs/learning/chang-2/ke-thua-va-ghi-de) (`extends`,
`super(...)`, `@Override`, `protected`, `final`).

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| Abstraction (trừu tượng hoá) | Chỉ đưa ra "làm được gì", giấu "làm thế nào" | quầy giao dịch chỉ cần biết "rút tiền" |
| Abstract class (lớp trừu tượng) | Bản thiết kế dang dở, không tạo object trực tiếp được | `abstract class Account` |
| Abstract method (method trừu tượng) | Method chỉ có chữ ký, chưa có thân; lớp con phải viết | `abstract BigDecimal monthlyInterest();` |
| Concrete class (lớp cụ thể) | Class đầy đủ, `new` được | `SavingAccount` |
| Interface (giao diện, "hợp đồng") | Danh sách việc một class cam kết làm được | `interface Transferable` |
| `implements` | "Ký" hợp đồng interface | `class Loan implements InterestBearing` |
| Default method | Method có sẵn thân bên trong interface | `default BigDecimal monthlyInterestOn(...)` |
| Hằng (constant) trong interface | Giá trị cố định, ngầm `public static final` | `int MONTHS_PER_YEAR = 12;` |
| Polymorphism (đa hình) | Một lời gọi, mỗi loại object làm theo cách riêng | `acc.monthlyInterest()` trong vòng lặp |
| `sealed` / `permits` | Danh sách đóng: chỉ class được liệt kê mới được kế thừa | `sealed class Account permits ...` |

💡 **Về tiền trong bài này.** Số dư và tiền lãi dùng `BigDecimal` như Chặng 1 Bài 7, làm tròn về đồng. Mọi
lãi suất (6%/năm, 0,2%/năm, 13%/năm...) là **số minh hoạ** cho bài học, không phải biểu lãi suất của ngân hàng nào.

## 1. Abstract class: bản thiết kế còn dang dở

**Ý tưởng nôm na.** Ngân hàng có một **mẫu hồ sơ tài khoản chung**: ô "Mã tài khoản", ô "Số dư" đã in sẵn,
nhưng ô "Cách tính lãi" để trống, ghi "xem phụ lục theo loại tài khoản". Không ai mở được một tài khoản chỉ
bằng mẫu chung đó. Phải chọn phụ lục: sổ tiết kiệm hay tài khoản thanh toán. Trong Java, mẫu chung đó là
**abstract class** (*lớp trừu tượng*), còn ô để trống là **abstract method** (*method trừu tượng*) [1][3].

Đây chính là **trừu tượng hoá** (*abstraction*), trụ cột thứ tư bạn đã thấy ở Chặng 1: phần dùng chung chỉ
nói "mỗi tài khoản **có** lãi tháng", còn "tính **thế nào**" để lớp con quyết định [2][3].

<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cây kế thừa của abstract class Account. Ở giữa phía trên là abstract class Account, viền nét đứt màu vàng: bản thiết kế dang dở. Nó có dữ liệu chung id và balance, method printMonthlyReport đã có thân, và một ô trống màu đỏ: abstract monthlyInterest, chỉ có chữ ký, lớp con phải viết thân. Bên phải: không được viết new Account vì Account là abstract, javac báo lỗi. Bên trái: được viết new SavingAccount vì đó là lớp con cụ thể. Phía dưới là hai lớp con SavingAccount và CheckingAccount, mỗi lớp có mũi tên extends trỏ lên Account và tự điền vào ô trống: SavingAccount tính lãi 6% một năm, CheckingAccount tính lãi 0,2% một năm.">
  <defs>
    <marker id="c2b5-abs-tri" markerWidth="14" markerHeight="14" refX="11" refY="6" orient="auto">
      <path d="M0,0 L11,6 L0,12 Z" fill="#FFFFFF" stroke="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="170" y="10" width="380" height="170" rx="10" fill="#FFFBEB" stroke="#D97706" stroke-dasharray="6 4"/>
    <text x="360" y="34" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="#0F172A">abstract class Account</text>
    <text x="360" y="52" text-anchor="middle" fill="#D97706">bản thiết kế dang dở: không new trực tiếp được</text>
    <line x1="170" y1="62" x2="550" y2="62" stroke="#D97706"/>
    <text x="186" y="84" font-family="monospace" fill="#0F172A">id, balance</text>
    <text x="534" y="84" text-anchor="end" fill="#64748B">dữ liệu chung</text>
    <text x="186" y="108" font-family="monospace" fill="#047857">printMonthlyReport()</text>
    <text x="534" y="108" text-anchor="end" fill="#047857">đã có thân</text>
    <rect x="180" y="120" width="360" height="48" rx="6" fill="#FEF2F2" stroke="#DC2626" stroke-dasharray="4 3"/>
    <text x="192" y="139" font-family="monospace" fill="#DC2626">abstract monthlyInterest();</text>
    <text x="192" y="158" fill="#DC2626">ô trống: chỉ có chữ ký, lớp con phải viết thân</text>
    <rect x="575" y="20" width="135" height="104" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="642" y="42" text-anchor="middle" font-weight="bold" fill="#DC2626">✗ Không được</text>
    <text x="642" y="66" text-anchor="middle" font-family="monospace" font-size="11" fill="#0F172A">new Account(...)</text>
    <text x="642" y="90" text-anchor="middle" font-size="11" fill="#DC2626">javac báo lỗi:</text>
    <text x="642" y="108" text-anchor="middle" font-family="monospace" font-size="11" fill="#DC2626">is abstract</text>
    <rect x="10" y="20" width="145" height="104" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="82" y="42" text-anchor="middle" font-weight="bold" fill="#047857">✓ Được</text>
    <text x="82" y="66" text-anchor="middle" font-family="monospace" font-size="11" fill="#0F172A">new SavingAccount</text>
    <text x="82" y="82" text-anchor="middle" font-family="monospace" font-size="11" fill="#0F172A">(...)</text>
    <text x="82" y="108" text-anchor="middle" font-size="11" fill="#047857">lớp con cụ thể</text>
    <line x1="190" y1="228" x2="290" y2="184" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-abs-tri)"/>
    <line x1="530" y1="228" x2="430" y2="184" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-abs-tri)"/>
    <text x="360" y="214" text-anchor="middle" fill="#64748B">extends: lớp con điền vào ô trống</text>
    <rect x="40" y="230" width="300" height="100" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="190" y="254" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#1D4ED8">class SavingAccount</text>
    <text x="190" y="272" text-anchor="middle" fill="#64748B">sổ tiết kiệm</text>
    <rect x="52" y="284" width="276" height="34" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="190" y="306" text-anchor="middle" font-family="monospace" fill="#047857">monthlyInterest(): 6%/năm</text>
    <rect x="380" y="230" width="300" height="100" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="530" y="254" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#1D4ED8">class CheckingAccount</text>
    <text x="530" y="272" text-anchor="middle" fill="#64748B">tài khoản thanh toán</text>
    <rect x="392" y="284" width="276" height="34" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="530" y="306" text-anchor="middle" font-family="monospace" fill="#047857">monthlyInterest(): 0,2%/năm</text>
  </g>
</svg>

Quy tắc cốt lõi, theo đặc tả ngôn ngữ Java (*Java Language Specification*, viết tắt **JLS**):

- Thêm từ khoá `abstract` trước `class` thì class đó là abstract. Viết `new` cho một abstract class là **lỗi
  biên dịch** [4].
- **Abstract method** chỉ có chữ ký, kết thúc bằng dấu `;`, không có thân `{ }`. Class nào chứa abstract method
  thì bản thân class đó phải là abstract [5].
- Một **lớp cụ thể** (*concrete class*, class không có `abstract`) kế thừa từ abstract class thì phải viết thân
  cho **mọi** abstract method, nếu không cũng là lỗi biên dịch [4][3].

Tạo file `AbstractDemo.java`. File hơi dài nên được chia làm hai khối; hãy chép **cả hai khối** vào cùng một
file, theo đúng thứ tự.

**Khối 1:** `main` và abstract class `Account`.

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class AbstractDemo {
    public static void main(String[] args) {
        Account saving = new SavingAccount("ACC-001", new BigDecimal("12000000"));
        Account checking = new CheckingAccount("ACC-002", new BigDecimal("12000000"));
        saving.printMonthlyReport();
        checking.printMonthlyReport();
    }
}

abstract class Account {                 // abstract: không tạo object trực tiếp được
    private final String id;
    private final BigDecimal balance;

    protected Account(String id, BigDecimal balance) {  // vẫn có constructor
        this.id = id;
        this.balance = balance;
    }

    public BigDecimal getBalance() { return balance; }

    // Abstract method: chỉ có chữ ký, kết thúc bằng dấu ; và KHÔNG có thân
    public abstract BigDecimal monthlyInterest();

    // Method thường, dùng chung cho mọi loại tài khoản
    public void printMonthlyReport() {
        System.out.println(id + " | số dư " + balance + " | lãi tháng " + monthlyInterest());
    }
}
```

**Khối 2:** hai lớp con cụ thể (dán ngay sau khối 1).

```java
class SavingAccount extends Account {
    SavingAccount(String id, BigDecimal balance) { super(id, balance); }

    @Override
    public BigDecimal monthlyInterest() {    // sổ tiết kiệm: 6%/năm
        return getBalance().multiply(new BigDecimal("6"))
                .divide(new BigDecimal("1200"), 0, RoundingMode.HALF_UP);
    }
}

class CheckingAccount extends Account {
    CheckingAccount(String id, BigDecimal balance) { super(id, balance); }

    @Override
    public BigDecimal monthlyInterest() {    // tài khoản thanh toán: 0,2%/năm
        return getBalance().multiply(new BigDecimal("0.2"))
                .divide(new BigDecimal("1200"), 0, RoundingMode.HALF_UP);
    }
}
```

Chạy:

```bash
java AbstractDemo.java
```

**Kết quả khi chạy:**

```text
ACC-001 | số dư 12000000 | lãi tháng 60000
ACC-002 | số dư 12000000 | lãi tháng 2000
```

**Giải thích từng bước:**

1. `Account saving = new SavingAccount(...)`: biến có kiểu `Account`, object thật là `SavingAccount`. Bạn
   `new` lớp con cụ thể, không `new` `Account`.
2. `new SavingAccount(...)` chạy constructor của `SavingAccount`, dòng `super(id, balance)` gọi lên
   constructor của `Account` (Bài 4). Abstract class **vẫn có constructor**: nó không tạo object một mình được,
   nhưng nó khởi tạo phần dữ liệu chung khi lớp con được tạo [7]. Constructor để `protected` vì chỉ lớp con cần gọi.
3. `saving.printMonthlyReport()` chạy method thường của `Account`. Bên trong, nó gọi `monthlyInterest()`.
   `Account` không biết công thức, nhưng object thật là `SavingAccount`, nên Java chạy bản của `SavingAccount`:
   12.000.000 × 6 / 1200 = 60.000 đồng.
4. Với `checking`, cùng dòng code đó chạy bản của `CheckingAccount`: 12.000.000 × 0,2 / 1200 = 2.000 đồng.

Cách "lớp cha viết sẵn khung quy trình (`printMonthlyReport`), để lớp con điền một bước (`monthlyInterest`)"
có tên riêng: mẫu thiết kế **Template Method** [6]. Bạn sẽ gặp nó rất thường xuyên.

### ⚠️ Lỗi hay gặp

**Lỗi 1: cố `new` một abstract class.**

```java
import java.math.BigDecimal;

public class NewAbstract {
    public static void main(String[] args) {
        Account acc = new Account("ACC-009", BigDecimal.ZERO);   // thử tạo object từ class abstract
    }
}

abstract class Account {
    protected Account(String id, BigDecimal balance) { }
    public abstract BigDecimal monthlyInterest();
}
```

```bash
javac NewAbstract.java
```

```text
NewAbstract.java:5: error: Account is abstract; cannot be instantiated
        Account acc = new Account("ACC-009", BigDecimal.ZERO);   // thử tạo object từ class abstract
                      ^
1 error
```

**Cách sửa:** `new` một lớp con cụ thể, ví dụ `new SavingAccount(...)`. Biến vẫn có thể khai báo kiểu `Account`.

**Lỗi 2: lớp con quên viết method abstract.**

```java
import java.math.BigDecimal;

public class ForgotOverride {
    public static void main(String[] args) { }
}

abstract class Account {
    public abstract BigDecimal monthlyInterest();
}

class CheckingAccount extends Account {
    // quên viết monthlyInterest()
}
```

```text
ForgotOverride.java:11: error: CheckingAccount is not abstract and does not override abstract method monthlyInterest() in Account
class CheckingAccount extends Account {
^
1 error
```

**Cách sửa:** viết `@Override public BigDecimal monthlyInterest() { ... }` trong `CheckingAccount`. (Cách thứ hai:
đánh dấu chính `CheckingAccount` là `abstract`, để lớp con của nó viết. Chỉ chọn cách này khi bạn thật sự muốn
một tầng thiết kế dang dở nữa.)

**Lỗi 3: viết thân cho method abstract.** Thói quen gõ `{ }` sau mọi method:

```java
import java.math.BigDecimal;

public class AbstractBody {
    public static void main(String[] args) { }
}

abstract class Account {
    public abstract BigDecimal monthlyInterest() {
        return BigDecimal.ZERO;
    }
}
```

```text
AbstractBody.java:8: error: abstract methods cannot have a body
    public abstract BigDecimal monthlyInterest() {
                               ^
1 error
```

**Cách sửa:** hoặc bỏ thân, kết thúc bằng `;` (giữ là abstract), hoặc bỏ chữ `abstract` (thành method thường có
sẵn thân) [5].

## 2. Interface: bản hợp đồng năng lực

**Ý tưởng nôm na.** Ngân hàng ký **hợp đồng dịch vụ chuyển tiền** với nhiều đối tác. Hợp đồng chỉ ghi: "bên ký
phải làm được *chuyển đi* và *nhận về*". Hợp đồng không quan tâm bên ký là tài khoản thanh toán hay ví điện tử,
cũng không quy định họ ghi sổ thế nào. Trong Java, bản hợp đồng đó là **interface** (*giao diện*), và "ký hợp
đồng" là từ khoá **`implements`** [2][8][30].

Một interface khai báo bằng từ khoá `interface`. Method trong interface không ghi `default`, `static` hay
`private` thì **ngầm là `public abstract`**: chỉ có chữ ký, class ký hợp đồng phải viết thân [9]. Interface
cũng không `new` được [8]. Khác với `extends` (chỉ một class cha), một class được `implements` **nhiều**
interface, ngăn cách bằng dấu phẩy [10].

<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Interface là bản hợp đồng. Phía trên có hai interface. Interface Transferable, hợp đồng chuyển tiền được, yêu cầu hai method transferTo và receive. Interface InterestBearing, hợp đồng có lãi suất, yêu cầu method annualRatePercent. Phía dưới, class CheckingAccount có hai mũi tên nét đứt implements trỏ lên cả hai interface: nó ký hai hợp đồng và phải viết đủ ba method, đều public. Class Loan, khoản vay, không phải tài khoản, chỉ có một mũi tên implements trỏ lên InterestBearing. Hai class không liên quan gì nhau vẫn cùng ký một hợp đồng.">
  <defs>
    <marker id="c2b5-itf-tri" markerWidth="14" markerHeight="14" refX="11" refY="6" orient="auto">
      <path d="M0,0 L11,6 L0,12 Z" fill="#FFFFFF" stroke="#2563EB"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="30" y="10" width="300" height="110" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="180" y="32" text-anchor="middle" fill="#64748B">«interface»</text>
    <text x="180" y="50" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="#1D4ED8">Transferable</text>
    <text x="180" y="68" text-anchor="middle" fill="#0F172A">hợp đồng: "chuyển tiền được"</text>
    <line x1="30" y1="78" x2="330" y2="78" stroke="#2563EB"/>
    <text x="46" y="96" font-family="monospace" fill="#0F172A">transferTo(target, amount)</text>
    <text x="46" y="113" font-family="monospace" fill="#0F172A">receive(amount)</text>
    <rect x="390" y="10" width="300" height="110" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="540" y="32" text-anchor="middle" fill="#64748B">«interface»</text>
    <text x="540" y="50" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="#1D4ED8">InterestBearing</text>
    <text x="540" y="68" text-anchor="middle" fill="#0F172A">hợp đồng: "có lãi suất"</text>
    <line x1="390" y1="78" x2="690" y2="78" stroke="#2563EB"/>
    <text x="406" y="96" font-family="monospace" fill="#0F172A">annualRatePercent()</text>
    <line x1="200" y1="210" x2="180" y2="124" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="6 4" marker-end="url(#c2b5-itf-tri)"/>
    <line x1="290" y1="210" x2="470" y2="124" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="6 4" marker-end="url(#c2b5-itf-tri)"/>
    <line x1="590" y1="210" x2="590" y2="124" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="6 4" marker-end="url(#c2b5-itf-tri)"/>
    <text x="152" y="170" text-anchor="end" fill="#64748B">implements</text>
    <text x="602" y="170" fill="#64748B">implements</text>
    <rect x="90" y="210" width="280" height="100" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="230" y="234" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#047857">class CheckingAccount</text>
    <text x="230" y="256" text-anchor="middle" fill="#0F172A">ký 2 hợp đồng</text>
    <text x="230" y="276" text-anchor="middle" fill="#0F172A">phải viết đủ 3 method,</text>
    <text x="230" y="294" text-anchor="middle" fill="#0F172A">tất cả đều public</text>
    <rect x="470" y="210" width="240" height="100" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="590" y="234" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#047857">class Loan</text>
    <text x="590" y="256" text-anchor="middle" fill="#0F172A">khoản vay, KHÔNG phải</text>
    <text x="590" y="274" text-anchor="middle" fill="#0F172A">tài khoản, vẫn ký được</text>
    <text x="590" y="294" text-anchor="middle" fill="#0F172A">hợp đồng "có lãi suất"</text>
  </g>
</svg>

Tạo file `InterfaceDemo.java`, chép cả hai khối theo thứ tự.

**Khối 1:** `main` và hai interface.

```java
import java.math.BigDecimal;

public class InterfaceDemo {
    public static void main(String[] args) {
        CheckingAccount an = new CheckingAccount(new BigDecimal("5000000"));
        CheckingAccount binh = new CheckingAccount(new BigDecimal("1000000"));

        Transferable sender = an;   // nhìn object an qua "hợp đồng" Transferable
        boolean ok = sender.transferTo(binh, new BigDecimal("2000000"));
        System.out.println("Chuyển 2000000: " + ok);
        System.out.println("An còn " + an.getBalance() + ", Bình có " + binh.getBalance());

        InterestBearing loan = new Loan(new BigDecimal("12"));
        System.out.println("Lãi suất thanh toán: " + an.annualRatePercent() + "%/năm");
        System.out.println("Lãi suất khoản vay: " + loan.annualRatePercent() + "%/năm");
    }
}

interface Transferable {                       // hợp đồng "chuyển tiền được"
    boolean transferTo(Transferable target, BigDecimal amount);
    void receive(BigDecimal amount);
}

interface InterestBearing {                    // hợp đồng "có lãi suất"
    BigDecimal annualRatePercent();
}
```

**Khối 2:** hai class ký hợp đồng.

```java
class CheckingAccount implements Transferable, InterestBearing {  // ký 2 hợp đồng
    private BigDecimal balance;

    CheckingAccount(BigDecimal balance) { this.balance = balance; }

    BigDecimal getBalance() { return balance; }

    @Override
    public boolean transferTo(Transferable target, BigDecimal amount) {
        if (amount.compareTo(balance) > 0) return false;   // không đủ số dư
        balance = balance.subtract(amount);
        target.receive(amount);
        return true;
    }

    @Override
    public void receive(BigDecimal amount) { balance = balance.add(amount); }

    @Override
    public BigDecimal annualRatePercent() { return new BigDecimal("0.2"); }
}

class Loan implements InterestBearing {        // khoản vay: KHÔNG phải tài khoản
    private final BigDecimal ratePercent;
    Loan(BigDecimal ratePercent) { this.ratePercent = ratePercent; }

    @Override
    public BigDecimal annualRatePercent() { return ratePercent; }
}
```

```bash
java InterfaceDemo.java
```

**Kết quả khi chạy:**

```text
Chuyển 2000000: true
An còn 3000000, Bình có 3000000
Lãi suất thanh toán: 0.2%/năm
Lãi suất khoản vay: 12%/năm
```

**Giải thích từng bước:**

1. `Transferable sender = an;` hợp lệ vì `CheckingAccount` đã `implements Transferable`. Một biến có **kiểu là
   interface** chỉ nhận object của class đã ký hợp đồng đó [12].
2. `sender.transferTo(binh, ...)`: `transferTo` nhận tham số `target` kiểu `Transferable`. Nó không cần biết
   `binh` là class gì, chỉ cần biết `binh` "nhận tiền được" (`receive`). Đây đúng là comment thứ hai của reviewer.
3. Trong `transferTo`, `amount.compareTo(balance) > 0` nghĩa là "số tiền lớn hơn số dư" (cách so sánh
   `BigDecimal` ở Chặng 1). Đủ tiền thì trừ bên gửi, gọi `target.receive(amount)` để cộng bên nhận.
4. `CheckingAccount` ký **hai** hợp đồng, nên phải viết đủ ba method: `transferTo`, `receive`,
   `annualRatePercent`. Thiếu một method là lỗi biên dịch, giống Lỗi 2 ở phần 1.
5. `Loan` (khoản vay) không phải tài khoản, không có quan hệ kế thừa gì với `CheckingAccount`, nhưng vẫn ký được
   hợp đồng `InterestBearing`. Đây là sức mạnh lớn nhất của interface: **những class không cùng họ vẫn chia sẻ
   được một năng lực** [3].

### ⚠️ Lỗi hay gặp

**Lỗi 1: quên `public` khi viết method của interface.** Method trong interface ngầm là `public`. Khi viết thân ở
class, bạn không được thu hẹp quyền truy cập (quy tắc ghi đè ở Bài 4) [11]:

```java
import java.math.BigDecimal;

public class WeakerAccess {
    public static void main(String[] args) { }
}

interface InterestBearing {
    BigDecimal annualRatePercent();
}

class Loan implements InterestBearing {
    BigDecimal annualRatePercent() {        // quên chữ public
        return new BigDecimal("12");
    }
}
```

```text
WeakerAccess.java:12: error: annualRatePercent() in Loan cannot implement annualRatePercent() in InterestBearing
    BigDecimal annualRatePercent() {        // quên chữ public
               ^
  attempting to assign weaker access privileges; was public
1 error
```

**Cách sửa:** thêm `public`: `public BigDecimal annualRatePercent() { ... }`.

**Lỗi 2: gọi method của hợp đồng khác qua biến interface.** Biến kiểu `Transferable` chỉ "nhìn thấy" những gì
hợp đồng `Transferable` ghi, dù object thật có nhiều method hơn:

```java
import java.math.BigDecimal;

public class WrongView {
    public static void main(String[] args) {
        Transferable sender = new CheckingAccount();
        System.out.println(sender.annualRatePercent());   // gọi qua "cửa" Transferable
    }
}

interface Transferable { void receive(BigDecimal amount); }
interface InterestBearing { BigDecimal annualRatePercent(); }

class CheckingAccount implements Transferable, InterestBearing {
    public void receive(BigDecimal amount) { }
    public BigDecimal annualRatePercent() { return new BigDecimal("0.2"); }
}
```

```text
WrongView.java:6: error: cannot find symbol
        System.out.println(sender.annualRatePercent());   // gọi qua "cửa" Transferable
                                 ^
  symbol:   method annualRatePercent()
  location: variable sender of type Transferable
1 error
```

**Cách sửa:** dùng biến có kiểu phù hợp với việc cần làm: `InterestBearing product = new CheckingAccount();` rồi
gọi `product.annualRatePercent()`. Phần 5 vẽ rõ cơ chế "kiểu của biến quyết định nhìn thấy gì".

## 3. `default`, `static` và hằng trong interface

**Ý tưởng nôm na.** Hợp đồng "có lãi suất" ngoài điều khoản bắt buộc ("phải công bố lãi suất năm") còn có thể
kèm: một **điều khoản mẫu** bên ký dùng luôn hoặc tự sửa (cách quy ra lãi tháng), một **bảng tra** in sẵn (một
năm có 12 tháng) và một **quy định chung** của chính văn phòng hợp đồng (lãi suất bao nhiêu thì hợp lệ). Ba thứ
đó lần lượt là **default method**, **hằng** và **static method** trong interface.

- **Hằng** (*constant*): mọi field khai báo trong interface ngầm là `public static final`, tức là một bản dùng
  chung, gán đúng một lần [13]. Interface không có field riêng cho từng object.
- **Default method**: method có từ khoá `default` và có sẵn thân [9]. Class ký hợp đồng được dùng luôn hoặc ghi
  đè. Tính năng này có từ **Java 8**, để thêm method mới vào interface cũ mà không làm hỏng các class đã ký từ
  trước [14][15].
- **Static method** trong interface: thuộc về chính interface, gọi bằng `TênInterface.method(...)`. Class
  `implements` interface **không** kế thừa static method của nó [9][16].

<svg viewBox="0 0 720 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bốn loại thành viên trong interface InterestBearing. Hàng 1, hằng MONTHS_PER_YEAR bằng 12: ngầm public static final, không gán lại được. Hàng 2, abstract method annualRatePercent: không có thân, mọi class implement phải tự viết. Hàng 3, default method monthlyInterestOn: có sẵn thân, class được dùng luôn hoặc ghi đè. Hàng 4, static method isValidRate: thuộc về interface, chỉ gọi bằng InterestBearing.isValidRate. Bên phải, class SavingAccount trả lãi suất 6 và dùng luôn bản default; class Loan trả lãi suất 13 và ghi đè monthlyInterestOn để làm tròn lên. Dòng cảnh báo đỏ: gọi SavingAccount.isValidRate là sai, vì class không kế thừa static method của interface.">
  <defs>
    <marker id="c2b5-def-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="420" height="320" rx="10" fill="#F8FAFC" stroke="#2563EB"/>
    <text x="220" y="34" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="#1D4ED8">interface InterestBearing</text>
    <rect x="22" y="48" width="396" height="62" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="34" y="70" font-family="monospace" fill="#0F172A">int MONTHS_PER_YEAR = 12;</text>
    <text x="34" y="94" fill="#64748B">hằng: ngầm public static final, không gán lại</text>
    <rect x="22" y="118" width="396" height="62" rx="6" fill="#FEF2F2" stroke="#DC2626" stroke-dasharray="4 3"/>
    <text x="34" y="140" font-family="monospace" fill="#0F172A">BigDecimal annualRatePercent();</text>
    <text x="34" y="164" fill="#DC2626">abstract: không thân, class phải tự viết</text>
    <rect x="22" y="188" width="396" height="62" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="34" y="210" font-family="monospace" fill="#0F172A">default monthlyInterestOn(amount) {…}</text>
    <text x="34" y="234" fill="#047857">default: có sẵn thân, dùng luôn hoặc ghi đè</text>
    <rect x="22" y="258" width="396" height="62" rx="6" fill="#FFFBEB" stroke="#D97706"/>
    <text x="34" y="280" font-family="monospace" fill="#0F172A">static isValidRate(percent) {…}</text>
    <text x="34" y="304" fill="#D97706">static: gọi InterestBearing.isValidRate(...)</text>
    <rect x="480" y="40" width="230" height="96" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="595" y="62" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#1D4ED8">class SavingAccount</text>
    <text x="595" y="84" text-anchor="middle" font-family="monospace" fill="#0F172A">annualRatePercent() → 6</text>
    <text x="595" y="110" text-anchor="middle" fill="#047857">dùng luôn bản default</text>
    <rect x="480" y="160" width="230" height="96" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="595" y="182" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#1D4ED8">class Loan</text>
    <text x="595" y="204" text-anchor="middle" font-family="monospace" fill="#0F172A">annualRatePercent() → 13</text>
    <text x="595" y="226" text-anchor="middle" fill="#D97706">ghi đè monthlyInterestOn</text>
    <text x="595" y="244" text-anchor="middle" fill="#64748B">(làm tròn lên)</text>
    <line x1="420" y1="214" x2="474" y2="110" stroke="#10B981" stroke-width="1.5" marker-end="url(#c2b5-def-arrow)"/>
    <line x1="420" y1="222" x2="474" y2="222" stroke="#D97706" stroke-width="1.5" stroke-dasharray="5 3" marker-end="url(#c2b5-def-arrow)"/>
    <rect x="450" y="276" width="260" height="54" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="580" y="298" text-anchor="middle" font-family="monospace" font-size="11" fill="#DC2626">✗ SavingAccount.isValidRate()</text>
    <text x="580" y="318" text-anchor="middle" font-size="11" fill="#DC2626">class không kế thừa static của interface</text>
  </g>
</svg>

Tạo file `DefaultStaticDemo.java`, chép cả hai khối theo thứ tự.

**Khối 1:** `main` và interface có đủ bốn loại thành viên.

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class DefaultStaticDemo {
    public static void main(String[] args) {
        BigDecimal amount = new BigDecimal("10000000");
        InterestBearing saving = new SavingAccount();
        InterestBearing loan = new Loan();

        System.out.println("Số tháng một năm: " + InterestBearing.MONTHS_PER_YEAR);
        System.out.println("Lãi tháng sổ tiết kiệm: " + saving.monthlyInterestOn(amount));
        System.out.println("Lãi tháng khoản vay:    " + loan.monthlyInterestOn(amount));
        System.out.println("15% hợp lệ? " + InterestBearing.isValidRate(new BigDecimal("15")));
        System.out.println("35% hợp lệ? " + InterestBearing.isValidRate(new BigDecimal("35")));
    }
}

interface InterestBearing {
    int MONTHS_PER_YEAR = 12;                 // hằng: ngầm public static final

    BigDecimal annualRatePercent();            // abstract: lớp nào cũng phải viết

    default BigDecimal monthlyInterestOn(BigDecimal amount) {   // có sẵn thân
        return amount.multiply(annualRatePercent())
                .divide(BigDecimal.valueOf(MONTHS_PER_YEAR * 100), 0, RoundingMode.HALF_UP);
    }

    static boolean isValidRate(BigDecimal percent) {             // gọi qua tên interface
        return percent.compareTo(BigDecimal.ZERO) >= 0 && percent.compareTo(new BigDecimal("30")) <= 0;
    }
}
```

**Khối 2:** một class dùng bản default, một class ghi đè.

```java
class SavingAccount implements InterestBearing {
    @Override
    public BigDecimal annualRatePercent() { return new BigDecimal("6"); }
    // không viết monthlyInterestOn: dùng bản default của interface
}

class Loan implements InterestBearing {
    @Override
    public BigDecimal annualRatePercent() { return new BigDecimal("13"); }

    @Override
    public BigDecimal monthlyInterestOn(BigDecimal amount) {    // ghi đè bản default
        return amount.multiply(annualRatePercent())
                .divide(BigDecimal.valueOf(MONTHS_PER_YEAR * 100), 0, RoundingMode.UP);
    }
}
```

```bash
java DefaultStaticDemo.java
```

**Kết quả khi chạy:**

```text
Số tháng một năm: 12
Lãi tháng sổ tiết kiệm: 50000
Lãi tháng khoản vay:    108334
15% hợp lệ? true
35% hợp lệ? false
```

**Giải thích từng bước:**

1. `InterestBearing.MONTHS_PER_YEAR` đọc hằng qua tên interface, không cần object nào: in `12`.
2. `saving.monthlyInterestOn(amount)`: `SavingAccount` không viết method này, nên Java chạy bản `default` trong
   interface. Bản default gọi `annualRatePercent()`, và vì object thật là `SavingAccount` nên lãi suất là 6:
   10.000.000 × 6 / 1200 = 50.000.
3. `loan.monthlyInterestOn(amount)`: `Loan` đã ghi đè, nên chạy bản của `Loan`. 10.000.000 × 13 / 1200 =
   108.333,33... Bản của `Loan` dùng `RoundingMode.UP` (**làm tròn ra xa số 0**, với số dương là làm tròn lên)
   nên được 108.334. Nếu dùng bản default (`HALF_UP`) thì sẽ là 108.333. "Lãi vay làm tròn lên" ở đây chỉ là quy
   ước minh hoạ.
4. `InterestBearing.isValidRate(...)`: gọi static method qua tên interface. Ngưỡng 30% là quy tắc tự đặt cho ví dụ.

### ⚠️ Lỗi hay gặp

**Lỗi 1: tưởng hằng trong interface là biến thường.**

```java
public class ChangeConstant {
    public static void main(String[] args) {
        InterestBearing.MONTHS_PER_YEAR = 13;    // thử đổi hằng
    }
}

interface InterestBearing {
    int MONTHS_PER_YEAR = 12;
}
```

```text
ChangeConstant.java:3: error: cannot assign a value to static final variable MONTHS_PER_YEAR
        InterestBearing.MONTHS_PER_YEAR = 13;    // thử đổi hằng
                       ^
1 error
```

**Cách sửa:** hằng là `final`, không gán lại được [13]. Giá trị cần thay đổi theo từng object thì phải là field
của class (thường là abstract class, xem phần 5).

**Lỗi 2: gọi static method của interface qua tên class.**

```java
import java.math.BigDecimal;

public class StaticViaClass {
    public static void main(String[] args) {
        System.out.println(SavingAccount.isValidRate(new BigDecimal("6")));   // gọi qua tên class
    }
}

interface InterestBearing {
    static boolean isValidRate(BigDecimal percent) { return percent.compareTo(BigDecimal.ZERO) >= 0; }
}

class SavingAccount implements InterestBearing { }
```

```text
StaticViaClass.java:5: error: cannot find symbol
        System.out.println(SavingAccount.isValidRate(new BigDecimal("6")));   // gọi qua tên class
                                        ^
  symbol:   method isValidRate(BigDecimal)
  location: class SavingAccount
1 error
```

**Cách sửa:** gọi `InterestBearing.isValidRate(...)`. Class không kế thừa static method từ interface [16].

**Lỗi 3: ký hai hợp đồng có hai `default` method trùng tên.**

```java
public class TwoDefaults {
    public static void main(String[] args) {
        System.out.println(new CheckingAccount().label());
    }
}

interface Transferable {
    default String label() { return "chuyển tiền được"; }
}

interface InterestBearing {
    default String label() { return "có lãi suất"; }
}

class CheckingAccount implements Transferable, InterestBearing { }
```

```text
TwoDefaults.java:15: error: types Transferable and InterestBearing are incompatible;
class CheckingAccount implements Transferable, InterestBearing { }
^
  class CheckingAccount inherits unrelated defaults for label() from types Transferable and InterestBearing
1 error
```

Java không tự đoán bạn muốn bản nào [17]. **Cách sửa:** class tự ghi đè `label()` và quyết định. Muốn dùng lại
bản của một interface cụ thể thì gọi `TênInterface.super.label()` [18]:

```java
public class TwoDefaultsFixed {
    public static void main(String[] args) {
        System.out.println(new CheckingAccount().label());
    }
}

interface Transferable {
    default String label() { return "chuyển tiền được"; }
}

interface InterestBearing {
    default String label() { return "có lãi suất"; }
}

class CheckingAccount implements Transferable, InterestBearing {
    @Override
    public String label() {      // tự quyết định, gọi bản của interface bằng X.super
        return Transferable.super.label() + ", " + InterestBearing.super.label();
    }
}
```

```bash
java TwoDefaultsFixed.java
```

```text
chuyển tiền được, có lãi suất
```

## 4. Đa hình: một vòng lặp, nhiều cách tính lãi

**Ý tưởng nôm na.** Cuối tháng, phòng kế toán chạy **một lệnh duy nhất**: "mỗi tài khoản, hãy tính lãi tháng
của mình". Nhân viên không cần hỏi "đây là sổ tiết kiệm hay tài khoản thanh toán?" trước mỗi dòng. Mỗi tài khoản
tự biết cách tính. Đó là **đa hình** (*polymorphism*): cùng một lời gọi, mỗi loại object chạy phiên bản của
class nó [19].

Abstract class và interface làm cho đa hình trở nên **có chủ đích**: vì `Account` cam kết "mọi tài khoản có
`monthlyInterest()`", bạn gom mọi loại tài khoản vào một mảng `Account[]` và gọi chung một method.

<svg viewBox="0 0 720 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Đa hình qua mảng Account. Bên trái, vùng stack có biến accounts kiểu Account mảng, trỏ sang một object mảng trên heap gồm ba ô 0, 1, 2. Mỗi ô giữ một tham chiếu tới một object khác loại: ô 0 tới SavingAccount ACC-001 số dư 12000000, ô 1 tới CheckingAccount ACC-002 số dư 12000000, ô 2 tới SavingAccount ACC-003 số dư 3000000. Vòng lặp gọi cùng một lời gọi acc.monthlyInterest; mỗi object chạy phiên bản của chính class nó: 60000, 2000 và 15000. Tổng lãi 77000.">
  <defs>
    <marker id="c2b5-poly-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="80" y="24" text-anchor="middle" font-weight="bold" fill="#64748B">Stack</text>
    <rect x="10" y="34" width="140" height="210" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <rect x="22" y="110" width="116" height="48" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="80" y="130" text-anchor="middle" font-family="monospace" font-size="11" fill="#64748B">Account[]</text>
    <text x="80" y="148" text-anchor="middle" font-family="monospace" fill="#0F172A">accounts</text>
    <text x="440" y="24" text-anchor="middle" font-weight="bold" fill="#64748B">Heap</text>
    <rect x="170" y="34" width="540" height="210" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <line x1="138" y1="134" x2="196" y2="134" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-poly-arrow)"/>
    <rect x="200" y="58" width="90" height="162" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="245" y="76" text-anchor="middle" font-family="monospace" font-size="11" fill="#1D4ED8">mảng (3 ô)</text>
    <rect x="212" y="86" width="66" height="36" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="245" y="109" text-anchor="middle" font-family="monospace" fill="#0F172A">[0]</text>
    <rect x="212" y="128" width="66" height="36" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="245" y="151" text-anchor="middle" font-family="monospace" fill="#0F172A">[1]</text>
    <rect x="212" y="170" width="66" height="36" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="245" y="193" text-anchor="middle" font-family="monospace" fill="#0F172A">[2]</text>
    <line x1="278" y1="104" x2="356" y2="70" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-poly-arrow)"/>
    <line x1="278" y1="146" x2="356" y2="140" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-poly-arrow)"/>
    <line x1="278" y1="188" x2="356" y2="210" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-poly-arrow)"/>
    <rect x="360" y="44" width="340" height="56" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="372" y="64" font-family="monospace" font-weight="bold" fill="#047857">SavingAccount ACC-001</text>
    <text x="372" y="86" font-family="monospace" font-size="11" fill="#0F172A">12000000 × 6%/12</text>
    <text x="688" y="86" text-anchor="end" font-family="monospace" font-weight="bold" fill="#047857">→ 60000</text>
    <rect x="360" y="112" width="340" height="56" rx="6" fill="#FFFBEB" stroke="#D97706"/>
    <text x="372" y="132" font-family="monospace" font-weight="bold" fill="#D97706">CheckingAccount ACC-002</text>
    <text x="372" y="154" font-family="monospace" font-size="11" fill="#0F172A">12000000 × 0,2%/12</text>
    <text x="688" y="154" text-anchor="end" font-family="monospace" font-weight="bold" fill="#D97706">→ 2000</text>
    <rect x="360" y="180" width="340" height="56" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="372" y="200" font-family="monospace" font-weight="bold" fill="#047857">SavingAccount ACC-003</text>
    <text x="372" y="222" font-family="monospace" font-size="11" fill="#0F172A">3000000 × 6%/12</text>
    <text x="688" y="222" text-anchor="end" font-family="monospace" font-weight="bold" fill="#047857">→ 15000</text>
    <rect x="10" y="258" width="700" height="62" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="360" y="282" text-anchor="middle" font-family="monospace" fill="#0F172A">for (Account acc : accounts) { acc.monthlyInterest(); }</text>
    <text x="360" y="306" text-anchor="middle" fill="#1D4ED8">MỘT lời gọi, mỗi object tự chạy bản của class nó → tổng 77000</text>
  </g>
</svg>

Tạo file `PolymorphismDemo.java`, chép cả hai khối theo thứ tự. `Account` ở đây giống phần 1 nhưng gọn hơn:
công thức chung được đưa vào method `protected interestAt(...)` để lớp con dùng lại.

**Khối 1:** `main` với mảng và danh sách.

```java
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

public class PolymorphismDemo {
    public static void main(String[] args) {
        // Mảng kiểu Account, nhưng mỗi ô trỏ tới một loại tài khoản khác nhau
        Account[] accounts = {
            new SavingAccount("ACC-001", new BigDecimal("12000000")),
            new CheckingAccount("ACC-002", new BigDecimal("12000000")),
            new SavingAccount("ACC-003", new BigDecimal("3000000"))
        };
        BigDecimal total = BigDecimal.ZERO;
        for (Account acc : accounts) {
            BigDecimal interest = acc.monthlyInterest();   // MỘT lời gọi, nhiều cách tính
            System.out.println(acc.getId() + " (" + acc.getClass().getSimpleName() + "): " + interest);
            total = total.add(interest);
        }
        System.out.println("Tổng lãi phải trả tháng này: " + total);

        List<Account> vip = List.of(accounts[0], accounts[1]);  // "danh sách các Account"
        for (Account acc : vip) {
            System.out.println("VIP " + acc.getId() + ": " + acc.monthlyInterest());
        }
    }
}
```

**Khối 2:** các class tài khoản.

```java
abstract class Account {
    private final String id;
    private final BigDecimal balance;
    protected Account(String id, BigDecimal balance) { this.id = id; this.balance = balance; }
    public String getId() { return id; }
    public abstract BigDecimal monthlyInterest();

    protected BigDecimal interestAt(String annualPercent) {   // dùng chung cho lớp con
        return balance.multiply(new BigDecimal(annualPercent))
                .divide(new BigDecimal("1200"), 0, RoundingMode.HALF_UP);
    }
}

class SavingAccount extends Account {
    SavingAccount(String id, BigDecimal balance) { super(id, balance); }
    @Override public BigDecimal monthlyInterest() { return interestAt("6"); }
}

class CheckingAccount extends Account {
    CheckingAccount(String id, BigDecimal balance) { super(id, balance); }
    @Override public BigDecimal monthlyInterest() { return interestAt("0.2"); }
}
```

```bash
java PolymorphismDemo.java
```

**Kết quả khi chạy:**

```text
ACC-001 (SavingAccount): 60000
ACC-002 (CheckingAccount): 2000
ACC-003 (SavingAccount): 15000
Tổng lãi phải trả tháng này: 77000
VIP ACC-001: 60000
VIP ACC-002: 2000
```

**Giải thích từng bước:**

1. Mảng `accounts` có kiểu `Account[]`, nhưng ba ô trỏ tới ba object thuộc hai class khác nhau. Hợp lệ, vì
   `SavingAccount` và `CheckingAccount` đều **là một** `Account`.
2. Vòng lặp for-each (Chặng 1 Bài 5) lấy từng phần tử ra biến `acc` kiểu `Account`. Dòng
   `acc.monthlyInterest()` viết **một lần**, nhưng chạy ba phiên bản: Java gọi method của **object thật** mà
   biến đang trỏ tới [19].
3. `acc.getClass().getSimpleName()` trả về tên ngắn của class thật (`SavingAccount`, `CheckingAccount`), giúp
   bạn nhìn thấy object thật là gì [21].
4. `total = total.add(interest)` cộng dồn: 60.000 + 2.000 + 15.000 = 77.000.
5. `List<Account>` đọc là "danh sách các `Account`". `List.of(...)` tạo một danh sách **cố định**, không thêm bớt
   được phần tử [20]. Phần `<Account>` (gọi là *generic*) chặng 3 sẽ học kỹ; ở đây chỉ cần hiểu nó là "danh sách,
   mỗi phần tử là một `Account`". Duyệt `List` bằng for-each giống hệt duyệt mảng.

*Vì sao* Java chọn đúng method lúc chương trình chạy (chứ không phải lúc biên dịch) là chủ đề của
[Bài 6 · Binding và truyền tham số](/docs/learning/chang-2/binding-va-truyen-tham-so). Ở bài này, bạn chỉ cần
nắm hệ quả: **object thật quyết định code nào chạy**.

### ⚠️ Lỗi hay gặp

**Lỗi 1: gọi method chỉ lớp con có, qua biến kiểu lớp cha.**

```java
import java.math.BigDecimal;

public class SubclassOnly {
    public static void main(String[] args) {
        Account acc = new SavingAccount();
        System.out.println(acc.termMonths());   // method chỉ SavingAccount có
    }
}

abstract class Account {
    public abstract BigDecimal monthlyInterest();
}

class SavingAccount extends Account {
    @Override public BigDecimal monthlyInterest() { return BigDecimal.ZERO; }
    public int termMonths() { return 12; }       // kỳ hạn sổ tiết kiệm
}
```

```text
SubclassOnly.java:6: error: cannot find symbol
        System.out.println(acc.termMonths());   // method chỉ SavingAccount có
                              ^
  symbol:   method termMonths()
  location: variable acc of type Account
1 error
```

Biến kiểu `Account` chỉ cho gọi những gì `Account` khai báo. **Cách sửa:** nếu mọi tài khoản đều cần method đó,
đưa nó lên `Account` (có thể dưới dạng abstract). Nếu chỉ sổ tiết kiệm có, hãy giữ biến đúng kiểu
`SavingAccount` ở chỗ cần dùng.

**Lỗi 2: viết `if` dài để phân loại thay vì dùng đa hình.** Code kiểu "nếu là sổ tiết kiệm thì nhân 6, nếu là
thanh toán thì nhân 0,2" đặt ở chỗ gọi sẽ phải sửa mỗi khi thêm loại tài khoản mới. **Cách sửa:** để công thức
nằm trong chính lớp con, như `monthlyInterest()` ở trên. Thêm loại mới chỉ cần thêm một class.

## 5. Abstract class hay interface?

**Ý tưởng nôm na.** Abstract class giống **mẫu hồ sơ chung của một dòng sản phẩm**: các loại tài khoản cùng họ
dùng chung ô dữ liệu và thủ tục. Interface giống **hợp đồng năng lực**: ai cũng ký được, kể cả bên ngoài dòng
sản phẩm (khoản vay, ví điện tử). Một class chỉ thuộc **một** dòng sản phẩm (`extends` một class), nhưng ký được
**nhiều** hợp đồng (`implements` nhiều interface) [3][22][23].

<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Một object, ba vai. Bên trái là ba biến có ba kiểu khác nhau: asAccount kiểu Account chỉ thấy getId và getBalance; asSender kiểu Transferable chỉ thấy receive; asProduct kiểu InterestBearing chỉ thấy annualRatePercent. Cả ba mũi tên cùng trỏ tới một object duy nhất bên phải: object CheckingAccount có đủ bốn method getId, getBalance, receive và annualRatePercent. Kiểu của biến quyết định bạn được gọi method nào; object thật quyết định code nào chạy.">
  <defs>
    <marker id="c2b5-role-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="14" width="300" height="70" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="36" font-family="monospace" font-weight="bold" fill="#1D4ED8">Account asAccount</text>
    <text x="22" y="58" fill="#64748B">nhìn thấy:</text>
    <text x="22" y="76" font-family="monospace" fill="#0F172A">getId(), getBalance()</text>
    <rect x="10" y="104" width="300" height="70" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="126" font-family="monospace" font-weight="bold" fill="#1D4ED8">Transferable asSender</text>
    <text x="22" y="148" fill="#64748B">nhìn thấy:</text>
    <text x="22" y="166" font-family="monospace" fill="#0F172A">receive(amount)</text>
    <rect x="10" y="194" width="300" height="70" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="216" font-family="monospace" font-weight="bold" fill="#1D4ED8">InterestBearing asProduct</text>
    <text x="22" y="238" fill="#64748B">nhìn thấy:</text>
    <text x="22" y="256" font-family="monospace" fill="#0F172A">annualRatePercent()</text>
    <line x1="310" y1="49" x2="442" y2="110" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-role-arrow)"/>
    <line x1="310" y1="139" x2="442" y2="139" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-role-arrow)"/>
    <line x1="310" y1="229" x2="442" y2="170" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-role-arrow)"/>
    <rect x="446" y="40" width="264" height="200" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="578" y="64" text-anchor="middle" font-weight="bold" fill="#047857">MỘT object duy nhất</text>
    <text x="578" y="84" text-anchor="middle" font-family="monospace" fill="#047857">CheckingAccount</text>
    <line x1="446" y1="96" x2="710" y2="96" stroke="#10B981"/>
    <text x="462" y="120" font-family="monospace" fill="#0F172A">getId()</text>
    <text x="462" y="144" font-family="monospace" fill="#0F172A">getBalance()</text>
    <text x="462" y="168" font-family="monospace" fill="#0F172A">receive(amount)</text>
    <text x="462" y="192" font-family="monospace" fill="#0F172A">annualRatePercent()</text>
    <text x="578" y="224" text-anchor="middle" font-size="11" fill="#64748B">có đủ cả bốn method</text>
    <text x="360" y="290" text-anchor="middle" fill="#0F172A">Kiểu của biến quyết định gọi được method nào · object thật quyết định code nào chạy</text>
  </g>
</svg>

Hình trên là cơ chế bạn cần nhớ khi kết hợp cả hai: **một object có thể đóng nhiều vai**. Mỗi biến "nhìn" object
qua một kiểu, và kiểu đó quyết định bạn gọi được method nào.

```java
import java.math.BigDecimal;

public class OneObjectManyRoles {
    public static void main(String[] args) {
        CheckingAccount acc = new CheckingAccount("ACC-002", new BigDecimal("5000000"));

        Account asAccount = acc;              // vai "là một tài khoản" (extends)
        Transferable asSender = acc;          // vai "chuyển tiền được" (implements)
        InterestBearing asProduct = acc;      // vai "có lãi suất" (implements)

        asSender.receive(new BigDecimal("1000000"));
        System.out.println(asAccount.getId() + " số dư: " + asAccount.getBalance());
        System.out.println("Lãi suất: " + asProduct.annualRatePercent() + "%/năm");
        System.out.println("Cùng một object? " + (asAccount == asSender));
    }
}

interface Transferable { void receive(BigDecimal amount); }
interface InterestBearing { BigDecimal annualRatePercent(); }

abstract class Account {                       // khung chung: có trạng thái + constructor
    private final String id;
    private BigDecimal balance;
    protected Account(String id, BigDecimal balance) { this.id = id; this.balance = balance; }
    public String getId() { return id; }
    public BigDecimal getBalance() { return balance; }
    protected void addToBalance(BigDecimal amount) { balance = balance.add(amount); }
}

// extends đúng MỘT class, implements bao nhiêu interface cũng được
class CheckingAccount extends Account implements Transferable, InterestBearing {
    CheckingAccount(String id, BigDecimal balance) { super(id, balance); }
    @Override public void receive(BigDecimal amount) { addToBalance(amount); }
    @Override public BigDecimal annualRatePercent() { return new BigDecimal("0.2"); }
}
```

```bash
java OneObjectManyRoles.java
```

**Kết quả khi chạy:**

```text
ACC-002 số dư: 6000000
Lãi suất: 0.2%/năm
Cùng một object? true
```

**Giải thích từng bước:**

1. Một lần `new`, nên chỉ có **một** object `CheckingAccount`. Ba biến `asAccount`, `asSender`, `asProduct`
   giữ ba tham chiếu tới cùng object đó.
2. `asSender.receive(...)` cộng 1.000.000 vào số dư. `asAccount.getBalance()` đọc lại thấy 6.000.000, vì cùng
   một object.
3. `asAccount == asSender` so sánh tham chiếu (Chặng 1 Bài 6) và in `true`: đúng là một object.
4. `Account` giữ **trạng thái** (`id`, `balance`) và constructor. Interface không giữ được những thứ đó: thân
   interface chỉ chứa hằng, method và kiểu lồng nhau, không có constructor [24][13].

**Bảng so sánh** (đúng từ Java 9 trở đi):

| Tiêu chí | `abstract class` | `interface` |
|---|---|---|
| `new` trực tiếp | Không [4] | Không [8] |
| Field riêng mỗi object, constructor | Có [3][7] | Không: field nào cũng là hằng `public static final`, không có constructor [13][24] |
| Method có thân | Có, mọi mức truy cập (`public`, `protected`, `private`...) [3] | `default` và `static` (Java 8), `private` (Java 9) [9][15][25] |
| Method không ghi gì về truy cập | *package-private* (Bài 1) [31] | Ngầm `public` [9] |
| Một class dùng được bao nhiêu | `extends` đúng **1** [23] | `implements` **nhiều** [10][22] |
| Hợp với | Các class cùng họ, chia sẻ dữ liệu và code [3] | Một năng lực mà cả class không liên quan nhau cũng cần [3] |

<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sơ đồ chọn abstract class hay interface. Câu hỏi 1: các class có chung dữ liệu (field), constructor hoặc code dùng chung, và đều là một loại của cùng một thứ (is-a)? Nếu có: dùng abstract class, ví dụ abstract class Account. Nếu không: câu hỏi 2: đây là một năng lực mà cả những class không liên quan nhau cũng cần, như Account và Loan đều có lãi suất? Nếu có: dùng interface, ví dụ InterestBearing. Ghi chú cuối: hai thứ thường đi cùng nhau; một class extends đúng một abstract class và implements nhiều interface, như CheckingAccount extends Account implements Transferable, InterestBearing.">
  <defs>
    <marker id="c2b5-pick-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="14" width="420" height="64" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="220" y="38" text-anchor="middle" font-weight="bold" fill="#0F172A">Các class có chung field, constructor, code dùng chung,</text>
    <text x="220" y="58" text-anchor="middle" font-weight="bold" fill="#0F172A">và đều "là một" loại của cùng một thứ?</text>
    <line x1="430" y1="46" x2="496" y2="46" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-pick-arrow)"/>
    <text x="463" y="38" text-anchor="middle" fill="#047857">Có</text>
    <rect x="500" y="14" width="210" height="64" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="605" y="40" text-anchor="middle" font-weight="bold" fill="#D97706">abstract class</text>
    <text x="605" y="60" text-anchor="middle" font-family="monospace" fill="#0F172A">Account</text>
    <line x1="220" y1="78" x2="220" y2="118" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-pick-arrow)"/>
    <text x="232" y="104" fill="#DC2626">Không</text>
    <rect x="10" y="122" width="420" height="64" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="220" y="146" text-anchor="middle" font-weight="bold" fill="#0F172A">Đây là một năng lực mà cả class không liên quan</text>
    <text x="220" y="166" text-anchor="middle" font-weight="bold" fill="#0F172A">nhau cũng cần? (Account và Loan đều có lãi suất)</text>
    <line x1="430" y1="154" x2="496" y2="154" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-pick-arrow)"/>
    <text x="463" y="146" text-anchor="middle" fill="#047857">Có</text>
    <rect x="500" y="122" width="210" height="64" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="605" y="148" text-anchor="middle" font-weight="bold" fill="#1D4ED8">interface</text>
    <text x="605" y="168" text-anchor="middle" font-family="monospace" fill="#0F172A">InterestBearing</text>
    <rect x="10" y="212" width="700" height="76" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="360" y="236" text-anchor="middle" font-weight="bold" fill="#047857">Thường dùng CẢ HAI: extends đúng 1 class, implements nhiều interface</text>
    <text x="360" y="262" text-anchor="middle" font-family="monospace" fill="#0F172A">class CheckingAccount extends Account</text>
    <text x="360" y="280" text-anchor="middle" font-family="monospace" fill="#0F172A">implements Transferable, InterestBearing</text>
  </g>
</svg>

Trong thực tế hai thứ thường đi cùng nhau: interface mô tả năng lực, abstract class gom phần code chung của
một họ class [26]. Một số quy tắc gọn để chọn:

| | Nên ✓ | Không nên ✗ |
|---|---|---|
| Dữ liệu chung (`balance`, `id`) | Đặt trong abstract class, `private`, có constructor | Đặt "biến" trong interface (thật ra là hằng, không đổi được) |
| Năng lực dùng chéo nhiều họ class | Tách thành interface nhỏ: `Transferable`, `InterestBearing` | Nhét mọi method vào một interface khổng lồ |
| Tham số method | Khai báo kiểu interface nhỏ nhất đủ dùng (`Transferable target`) | Khai báo class cụ thể khi chỉ cần một năng lực |
| Thêm method vào interface đã có nhiều class ký | `default` method có thân hợp lý [14] | Thêm abstract method làm mọi class cũ lỗi biên dịch |
| Loại tài khoản cố định | `sealed` + `permits` (phần 6) | Để ai cũng `extends` được rồi kiểm tra bằng `if` |

### ⚠️ Lỗi hay gặp

**Lỗi 1: muốn kế thừa hai class.** Java chỉ cho một class cha [23]:

```java
public class TwoParents {
    public static void main(String[] args) { }
}

abstract class Account { }
abstract class Wallet { }

class CheckingAccount extends Account, Wallet { }   // thử kế thừa hai class
```

```text
TwoParents.java:8: error: '{' expected
class CheckingAccount extends Account, Wallet { }   // thử kế thừa hai class
                                     ^
1 error
```

Thông báo hơi khó hiểu: javac chờ `{` ngay sau tên class cha đầu tiên, vì sau `extends` chỉ được có một tên.
**Cách sửa:** giữ một class cha, biến phần còn lại thành interface rồi `implements`.

**Lỗi 2: cố để trạng thái trong interface.**

```java
import java.math.BigDecimal;

public class StateInInterface {
    public static void main(String[] args) { }
}

interface Transferable {
    BigDecimal balance;     // thử để "số dư" trong interface
}
```

```text
StateInInterface.java:8: error: = expected
    BigDecimal balance;     // thử để "số dư" trong interface
                      ^
1 error
```

Field trong interface là hằng nên bắt buộc có giá trị ngay (`= ...`) [13]. **Cách sửa:** số dư là trạng thái
riêng của mỗi tài khoản, hãy đặt nó trong abstract class `Account`.

## 6. `sealed`: khoanh vùng ai được kế thừa (Java 17)

**Ý tưởng nôm na.** Một buổi ký kết có **danh sách khách mời** in sẵn tên. Ai có tên thì vào, người lạ bị chặn
ở cửa, dù ăn mặc giống hệt khách mời. Từ **Java 17**, `sealed class` là danh sách khách mời của một class: chỉ
những class ghi sau `permits` mới được `extends` nó [27][28][29].

Với ngân hàng, điều này rất tự nhiên: hệ thống chỉ có đúng các loại tài khoản đã thiết kế, không ai được tự tạo
`FakeAccount extends Account` ở một góc nào đó của codebase.

<svg viewBox="0 0 720 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cây kế thừa của sealed class Account. Trên cùng: abstract sealed class Account permits SavingAccount, CheckingAccount, giống danh sách khách mời có tên. Nhánh 1: final class SavingAccount, có ổ khoá, không ai được kế thừa tiếp. Nhánh 2: non-sealed class CheckingAccount, mở lại cho lớp con; bên dưới nó class StudentAccount extends CheckingAccount là hợp lệ. Nhánh 3 bị chặn: class FakeAccount extends Account, viền đỏ nét đứt, không có tên trong permits nên javac báo lỗi class is not allowed to extend sealed class.">
  <defs>
    <marker id="c2b5-seal-tri" markerWidth="14" markerHeight="14" refX="11" refY="6" orient="auto">
      <path d="M0,0 L11,6 L0,12 Z" fill="#FFFFFF" stroke="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="160" y="10" width="400" height="72" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="360" y="34" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#0F172A">abstract sealed class Account</text>
    <text x="360" y="54" text-anchor="middle" font-family="monospace" fill="#D97706">permits SavingAccount, CheckingAccount</text>
    <text x="360" y="72" text-anchor="middle" font-size="11" fill="#64748B">như danh sách khách mời: chỉ ai có tên mới được vào</text>
    <line x1="130" y1="140" x2="250" y2="86" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-seal-tri)"/>
    <line x1="360" y1="140" x2="360" y2="86" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-seal-tri)"/>
    <line x1="590" y1="140" x2="470" y2="86" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="5 4"/>
    <text x="548" y="118" font-size="16" font-weight="bold" fill="#DC2626">✗</text>
    <rect x="20" y="140" width="220" height="80" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="130" y="164" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#1D4ED8">final class</text>
    <text x="130" y="182" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#1D4ED8">SavingAccount</text>
    <text x="130" y="206" text-anchor="middle" fill="#0F172A">không ai kế thừa tiếp</text>
    <rect x="250" y="140" width="220" height="80" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="360" y="164" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#047857">non-sealed class</text>
    <text x="360" y="182" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#047857">CheckingAccount</text>
    <text x="360" y="206" text-anchor="middle" fill="#0F172A">mở lại cho lớp con</text>
    <rect x="480" y="140" width="220" height="80" rx="10" fill="#FEF2F2" stroke="#DC2626" stroke-dasharray="6 4"/>
    <text x="590" y="164" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#DC2626">class FakeAccount</text>
    <text x="590" y="182" text-anchor="middle" font-family="monospace" fill="#DC2626">extends Account</text>
    <text x="590" y="206" text-anchor="middle" font-size="11" fill="#DC2626">không có tên trong permits</text>
    <line x1="360" y1="262" x2="360" y2="224" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b5-seal-tri)"/>
    <rect x="250" y="262" width="220" height="56" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="360" y="284" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#047857">class StudentAccount</text>
    <text x="360" y="304" text-anchor="middle" fill="#0F172A">✓ hợp lệ</text>
    <rect x="480" y="236" width="220" height="82" rx="10" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="590" y="258" text-anchor="middle" font-weight="bold" fill="#DC2626">javac báo lỗi:</text>
    <text x="590" y="278" text-anchor="middle" font-family="monospace" font-size="11" fill="#DC2626">class is not allowed</text>
    <text x="590" y="294" text-anchor="middle" font-family="monospace" font-size="11" fill="#DC2626">to extend sealed class</text>
    <text x="20" y="250" fill="#64748B">Lớp con trực tiếp phải chọn 1 trong 3:</text>
    <text x="20" y="270" font-family="monospace" fill="#0F172A">final</text>
    <text x="20" y="288" font-family="monospace" fill="#0F172A">sealed</text>
    <text x="20" y="306" font-family="monospace" fill="#0F172A">non-sealed</text>
  </g>
</svg>

Quy tắc chính [28][29]:

- `sealed class X permits A, B`: chỉ `A` và `B` được kế thừa trực tiếp `X`.
- Mỗi lớp con trực tiếp **phải tự khai báo** một trong ba: `final` (dừng, không ai kế thừa tiếp), `sealed` (lại
  có danh sách riêng) hoặc `non-sealed` (mở lại, ai cũng kế thừa được).
- Interface cũng có thể `sealed`, cùng cách viết `permits` [27].

```java
import java.math.BigDecimal;

public class SealedDemo {
    public static void main(String[] args) {
        Account[] accounts = { new SavingAccount(), new CheckingAccount(), new StudentAccount() };
        for (Account acc : accounts) {
            System.out.println(acc.getClass().getSimpleName() + ": " + acc.monthlyInterest());
        }
        // Hỏi Java lúc chạy: Account cho phép những class nào kế thừa?
        for (Class<?> c : Account.class.getPermittedSubclasses()) {
            System.out.println("Được phép: " + c.getSimpleName());
        }
    }
}

// số lãi cố định cho gọn, để tập trung vào sealed
// sealed: chỉ những class ghi sau permits mới được extends Account
abstract sealed class Account permits SavingAccount, CheckingAccount {
    public abstract BigDecimal monthlyInterest();
}

final class SavingAccount extends Account {          // final: dừng ở đây
    @Override public BigDecimal monthlyInterest() { return new BigDecimal("60000"); }
}

non-sealed class CheckingAccount extends Account {   // non-sealed: mở lại cho lớp con
    @Override public BigDecimal monthlyInterest() { return new BigDecimal("2000"); }
}

class StudentAccount extends CheckingAccount {        // hợp lệ vì CheckingAccount là non-sealed
    @Override public BigDecimal monthlyInterest() { return new BigDecimal("1000"); }
}
```

```bash
java SealedDemo.java
```

**Kết quả khi chạy:**

```text
SavingAccount: 60000
CheckingAccount: 2000
StudentAccount: 1000
Được phép: SavingAccount
Được phép: CheckingAccount
```

**Giải thích từng bước:**

1. `abstract sealed class Account permits SavingAccount, CheckingAccount`: `Account` vừa abstract (không `new`
   được) vừa sealed (chỉ hai lớp con được phép).
2. `SavingAccount` là `final`: không ai kế thừa tiếp. `CheckingAccount` là `non-sealed`: nhờ vậy
   `StudentAccount extends CheckingAccount` hợp lệ.
3. Vòng lặp đầu là đa hình như phần 4.
4. `Account.class.getPermittedSubclasses()` hỏi Java lúc chạy "những class nào được phép kế thừa `Account`"
   [21]. Kết quả liệt kê đúng danh sách `permits`, không có `StudentAccount` (vì nó là lớp con của
   `CheckingAccount`, không phải lớp con trực tiếp của `Account`). Kiểu `Class<?>` trong vòng lặp đọc là "một
   class bất kỳ"; dấu `<?>` là cú pháp generic, chặng 3 học kỹ.

### ⚠️ Lỗi hay gặp

**Lỗi 1: kế thừa một sealed class khi không có tên trong `permits`.**

```java
import java.math.BigDecimal;

public class NotPermitted {
    public static void main(String[] args) { }
}

abstract sealed class Account permits SavingAccount {
    public abstract BigDecimal monthlyInterest();
}

final class SavingAccount extends Account {
    @Override public BigDecimal monthlyInterest() { return BigDecimal.ZERO; }
}

final class FakeAccount extends Account {        // không có tên trong permits
    @Override public BigDecimal monthlyInterest() { return BigDecimal.ZERO; }
}
```

```text
NotPermitted.java:15: error: class is not allowed to extend sealed class: Account (as it is not listed in its 'permits' clause)
final class FakeAccount extends Account {        // không có tên trong permits
      ^
1 error
```

**Cách sửa:** nếu `FakeAccount` thật sự là một loại tài khoản hợp lệ, thêm nó vào `permits`. Nếu không, đó chính
là điều `sealed` muốn chặn.

**Lỗi 2: lớp con quên khai báo `final` / `sealed` / `non-sealed`.**

```java
import java.math.BigDecimal;

public class MissingModifier {
    public static void main(String[] args) { }
}

abstract sealed class Account permits SavingAccount {
    public abstract BigDecimal monthlyInterest();
}

class SavingAccount extends Account {            // quên final / sealed / non-sealed
    @Override public BigDecimal monthlyInterest() { return BigDecimal.ZERO; }
}
```

```text
MissingModifier.java:11: error: sealed, non-sealed or final modifiers expected
class SavingAccount extends Account {            // quên final / sealed / non-sealed
^
1 error
```

**Cách sửa:** thêm một trong ba từ khoá. Lời khuyên thực hành: chưa chắc thì chọn `final`, đóng chặt nhất;
sau này mở ra vẫn dễ hơn đóng lại.

## Tóm tắt

- **Abstract class** là bản thiết kế dang dở: có thể có field, constructor, method thường và **abstract method**
  (chỉ chữ ký, kết thúc bằng `;`). Không `new` được; lớp con cụ thể phải viết thân mọi abstract method.
- **Interface** là hợp đồng năng lực. Method không ghi gì ngầm là `public abstract`; class `implements` phải viết
  thân và giữ `public`.
- Một class `extends` đúng **một** class nhưng `implements` **nhiều** interface. Những class không cùng họ
  (`CheckingAccount`, `Loan`) vẫn ký chung một interface.
- Trong interface: field là hằng `public static final`; `default` method có sẵn thân (Java 8); `static` method
  gọi qua tên interface và không được class kế thừa. Hai `default` trùng tên thì class phải tự ghi đè,
  dùng `X.super.method()` nếu cần.
- **Đa hình**: một lời gọi `acc.monthlyInterest()` trên `Account[]` hay `List<Account>`, mỗi object chạy bản
  của class nó. Kiểu của biến quyết định gọi được method nào; object thật quyết định code nào chạy.
- Chọn **abstract class** khi các class cùng họ chia sẻ dữ liệu và code; chọn **interface** cho năng lực dùng
  chéo nhiều họ. Thường dùng cả hai.
- `sealed ... permits` (Java 17) giới hạn ai được kế thừa; mỗi lớp con trực tiếp phải là `final`, `sealed` hoặc
  `non-sealed`.

## Tự kiểm tra

**Câu 1.** (Mục tiêu 1) Dòng nào dưới đây biên dịch được? Vì sao dòng còn lại không?

```java
Account a = new Account("ACC-001", BigDecimal.ZERO);
Account b = new SavingAccount("ACC-001", BigDecimal.ZERO);
```

<details><summary>Đáp án</summary>

Chỉ dòng của `b` biên dịch được. `Account` là abstract class nên `new Account(...)` báo
`Account is abstract; cannot be instantiated`. Dòng `b` hợp lệ: `new` lớp con cụ thể `SavingAccount`, gán vào
biến kiểu `Account`.

</details>

**Câu 2.** (Mục tiêu 1) `CheckingAccount extends Account` nhưng không viết `monthlyInterest()`, và javac báo
`is not abstract and does not override abstract method`. Nêu hai cách sửa, và khi nào nên chọn mỗi cách.

<details><summary>Đáp án</summary>

Cách 1 (thường dùng): viết `@Override public BigDecimal monthlyInterest() { ... }` trong `CheckingAccount`.
Cách 2: khai báo `abstract class CheckingAccount`, đẩy việc viết thân xuống lớp con của nó. Chỉ chọn cách 2 khi
bạn thật sự muốn `CheckingAccount` cũng là một bản thiết kế dang dở, không `new` được.

</details>

**Câu 3.** (Mục tiêu 2) Viết dòng khai báo class `PremiumAccount` vừa kế thừa `Account`, vừa ký cả hai hợp
đồng `Transferable` và `InterestBearing`. Thứ tự `extends` / `implements` thế nào?

<details><summary>Đáp án</summary>

`class PremiumAccount extends Account implements Transferable, InterestBearing { ... }`. `extends` đứng trước
và chỉ có một tên; `implements` đứng sau, các interface cách nhau bằng dấu phẩy. Class này phải viết đủ mọi
abstract method của `Account` và của cả hai interface, với `public`.

</details>

**Câu 4.** (Mục tiêu 3) Trong `interface InterestBearing`, dòng `int MONTHS_PER_YEAR = 12;` thực chất mang những
modifier nào? Gọi nó thế nào, và gán `InterestBearing.MONTHS_PER_YEAR = 13;` thì sao?

<details><summary>Đáp án</summary>

Ngầm là `public static final`. Gọi qua tên interface: `InterestBearing.MONTHS_PER_YEAR`. Gán lại là lỗi biên
dịch `cannot assign a value to static final variable MONTHS_PER_YEAR`, vì hằng chỉ được gán một lần.

</details>

**Câu 5.** (Mục tiêu 3) `CheckingAccount implements Transferable, InterestBearing`, và cả hai interface đều có
`default String label()`. Chuyện gì xảy ra, sửa thế nào?

<details><summary>Đáp án</summary>

Lỗi biên dịch: `CheckingAccount inherits unrelated defaults for label()`. Sửa: trong `CheckingAccount`, viết
`@Override public String label()` và tự quyết định nội dung. Muốn dùng lại bản của một interface, gọi
`Transferable.super.label()` hoặc `InterestBearing.super.label()`.

</details>

**Câu 6.** (Mục tiêu 4) Dùng các class ở phần 4. Chương trình in ra số nào?

```java
Account[] accounts = {
    new SavingAccount("ACC-010", new BigDecimal("2400000")),
    new CheckingAccount("ACC-011", new BigDecimal("6000000"))
};
BigDecimal total = BigDecimal.ZERO;
for (Account acc : accounts) {
    total = total.add(acc.monthlyInterest());
}
System.out.println(total);
```

<details><summary>Đáp án</summary>

**13000.** `SavingAccount`: 2.400.000 × 6 / 1200 = 12.000. `CheckingAccount`: 6.000.000 × 0,2 / 1200 = 1.000.
Cùng lời gọi `acc.monthlyInterest()`, mỗi object chạy bản của class nó (đa hình).

</details>

**Câu 7.** (Mục tiêu 5) Hệ thống cần thêm `Bill` (hoá đơn điện nước) và cho cả `Bill` lẫn `CheckingAccount` có
method `printStatement()` (in sao kê). `Bill` không phải tài khoản. Bạn dùng abstract class hay interface? Vì sao?

<details><summary>Đáp án</summary>

**Interface**, ví dụ `interface Printable { void printStatement(); }`. `Bill` và `CheckingAccount` không cùng họ,
nên không chung được một class cha (và `CheckingAccount` đã `extends Account` rồi). Interface là năng lực mà
class không liên quan nhau cùng ký được.

</details>

**Câu 8.** (Mục tiêu 5) Đọc khai báo sau. Class nào được phép `extends Account`? `class GoldAccount extends
CheckingAccount` có hợp lệ không?

```java
abstract sealed class Account permits SavingAccount, CheckingAccount { }
final class SavingAccount extends Account { }
non-sealed class CheckingAccount extends Account { }
```

<details><summary>Đáp án</summary>

Chỉ `SavingAccount` và `CheckingAccount` được kế thừa trực tiếp `Account`. `GoldAccount extends CheckingAccount`
**hợp lệ**, vì `CheckingAccount` là `non-sealed` (mở lại). Nếu `CheckingAccount` là `final` thì không.

</details>

## Bài tập

**Bài 1 (dễ).** Thêm class `FixedDepositAccount` (tiền gửi có kỳ hạn) kế thừa `Account` ở phần 1, lãi 7%/năm.
Trong `main`, tạo một tài khoản 12.000.000 đồng và gọi `printMonthlyReport()`.

> 💡 Gợi ý: chép cấu trúc của `SavingAccount`, đổi `"6"` thành `"7"`. Kết quả mong đợi: lãi tháng 70000. Thử xoá
> method `monthlyInterest()` để thấy lại lỗi biên dịch ở phần 1.

**Bài 2 (vừa).** Viết interface `MonthlyFee` có `BigDecimal monthlyFee()` và `default boolean isFree()` (trả về
`true` khi phí bằng 0). Cho `CheckingAccount` phí 11.000 đồng/tháng, `SavingAccount` miễn phí. Duyệt một
`Account[]` và in phí của từng tài khoản.

> 💡 Gợi ý: biến kiểu `Account` chỉ thấy method của `Account` (phần 4, Lỗi 1). Cách gọn nhất là
> `abstract class Account implements MonthlyFee`: abstract class được phép ký hợp đồng mà chưa viết thân, việc
> viết thân dồn cho lớp con cụ thể [4]. So sánh `BigDecimal` với 0 bằng `compareTo` (Chặng 1).

**Bài 3 (khó hơn).** Biến `Account` ở phần 4 thành `sealed` với ba lớp con: `SavingAccount`, `CheckingAccount`,
`FixedDepositAccount`. Viết class `Bank` giữ một `List<Account>` và method `BigDecimal totalMonthlyInterest()`.
Cuối cùng, thử thêm `class FakeAccount extends Account` để thấy javac chặn.

> 💡 Gợi ý: nhớ `final` hoặc `non-sealed` cho từng lớp con. `Bank` nhận danh sách qua constructor:
> `new Bank(List.of(...))`. Kiểm tra: với ba tài khoản 12.000.000 đồng, tổng lãi phải bằng 60.000 + 2.000 + 70.000.

## Nguồn tham khảo

1. roadmap.sh: Java Developer Roadmap, mục *More about OOP*. <https://roadmap.sh/java>
2. roadmap.sh Java content (GitHub): mục *Abstraction*, *Interfaces* ("think of it as a contract"). <https://github.com/kamranahmedse/developer-roadmap/tree/master/roadmaps/java/content>
3. Oracle: Abstract Methods and Classes (The Java Tutorials), gồm mục *Abstract Classes Compared to Interfaces*. <https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html>
4. JLS 25, §8.1.1.1 `abstract` Classes. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.1.1>
5. JLS 25, §8.4.3.1 `abstract` Methods. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.3.1>
6. Jakob Jenkov: Java Abstract Classes (mục *Template Method Design Pattern*). <https://jenkov.com/tutorials/java/abstract-classes.html>
7. JLS 25, §8.8.7.1 Explicit Constructor Invocations. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.8.7.1>
8. Oracle: Defining an Interface (The Java Tutorials). <https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html>
9. JLS 25, §9.4 Method Declarations (interface). <https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html#jls-9.4>
10. JLS 25, §8.1.5 Superinterfaces. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.5>
11. JLS 25, §8.4.8.3 Requirements in Overriding and Hiding. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8.3>
12. dev.java: Using an Interface as a Type. <https://dev.java/learn/language/oop/interfaces/interfaces-as-a-type/>
13. JLS 25, §9.3 Field (Constant) Declarations. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html#jls-9.3>
14. Oracle: Default Methods (The Java Tutorials). <https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html>
15. Oracle: What's New in JDK 8 (mục *Default methods*). <https://www.oracle.com/java/technologies/javase/8-whats-new.html>
16. JLS 25, §8.4.8 Inheritance, Overriding, and Hiding. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8>
17. JLS 25, §8.4.8.4 Inheriting Methods with Override-Equivalent Signatures. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8.4>
18. JLS 25, §9.4.1.1 Overriding (by Instance Methods). <https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html#jls-9.4.1.1>
19. Oracle: Polymorphism (The Java Tutorials). <https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html>
20. Java SE 25 API: `List`, mục *Unmodifiable Lists*. <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/List.html#unmodifiable>
21. Java SE 25 API: `Class` (`getSimpleName()`, `getPermittedSubclasses()`). <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Class.html>
22. Oracle: Multiple Inheritance of State, Implementation, and Type (The Java Tutorials). <https://docs.oracle.com/javase/tutorial/java/IandI/multipleinheritance.html>
23. JLS 25, §8.1.4 Superclasses and Subclasses. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.4>
24. JLS 25, §9.1.5 Interface Body and Member Declarations. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html#jls-9.1.5>
25. JEP 213: Milling Project Coin (private interface methods, Java 9). <https://openjdk.org/jeps/213>
26. Jakob Jenkov: Java Interfaces vs. Abstract Classes. <https://jenkov.com/tutorials/java/interfaces-vs-abstract-classes.html>
27. JEP 409: Sealed Classes (Java 17). <https://openjdk.org/jeps/409>
28. JLS 25, §8.1.1.2 `sealed`, `non-sealed`, and `final` Classes. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.1.2>
29. JLS 25, §8.1.6 Permitted Direct Subclasses. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.6>
30. Jakob Jenkov: Java Interfaces. <https://jenkov.com/tutorials/java/interfaces.html>
31. JLS 25, §6.6.1 Determining Accessibility. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-6.html#jls-6.6.1>

**Bài tiếp theo:** [Bài 6 · Binding và truyền tham số](/docs/learning/chang-2/binding-va-truyen-tham-so)
