---
title: "Bài 4 · Kế thừa và ghi đè method"
description: "Dùng extends để SavingAccount thừa hưởng Account, gọi super đúng chỗ, ghi đè method an toàn với @Override, và ghi đè đúng cặp equals/hashCode của Object."
order: 24
tags: [java, chặng-2, oop, inheritance, override, equals, hashcode]
language: vi
profile: onward-java-course
classification: public-safe
source_repo: none
source_refs:
  - https://roadmap.sh/java
  - https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.4
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.2
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.5
  - https://docs.oracle.com/javase/tutorial/java/IandI/super.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.8.7
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.8.9
  - https://openjdk.org/jeps/513
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-6.html#jls-6.6.2
  - https://docs.oracle.com/javase/tutorial/java/IandI/override.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8.1
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8.3
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html#jls-9.6.4.4
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.4.4
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.3.3
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.1.2
  - https://docs.oracle.com/javase/tutorial/java/IandI/final.html
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html
  - https://docs.oracle.com/javase/tutorial/java/IandI/objectclass.html
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Objects.html
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashSet.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.20.2
  - https://docs.oracle.com/javase/tutorial/java/IandI/multipleinheritance.html
  - https://jenkov.com/tutorials/java/inheritance.html
  - https://en.wikipedia.org/wiki/Composition_over_inheritance
verified_with: "openjdk 21.0.9"
verification: ran-locally
verification_note: "Đã chạy 6 chương trình chính + 1 ví dụ 3 package (javac -d out, java -cp out) + 18 thí nghiệm lỗi bằng /opt/homebrew/opt/openjdk@21/bin/java (source-launch) hoặc javac 21.0.9; output dán nguyên văn, StackOverflowError rút gọn. Không chạy trên JDK 25: ghi chú JEP 513 chỉ dựa trên tài liệu."
contract_version: 1
---

# Bài 4 · Kế thừa và ghi đè method

> 🎯 **Sau bài này bạn sẽ:**
> 1. Viết được class con `SavingAccount extends Account` có gọi `super(...)`, và kể đúng thứ tự các bước chạy khi `new` một object của class con.
> 2. Ghi đè được một method với `@Override`, và dùng `super.method()` để tái dùng logic của class cha thay vì chép lại.
> 3. Chỉ ra được lỗi compile khi vi phạm quy tắc ghi đè (chữ ký, quyền truy cập, kiểu trả về, `final`), và chọn đúng `private` hay `protected` cho thành viên của class cha.
> 4. Ghi đè đúng cặp `equals`/`hashCode`, và giải thích được vì sao thiếu `hashCode` làm `HashSet` tìm sai.
> 5. Phân biệt được quan hệ *is-a* với *has-a* để quyết định khi nào dùng kế thừa, khi nào dùng composition.

## Tình huống

Bạn được giao thêm loại **sổ tiết kiệm** vào hệ thống ngân hàng nhỏ. Cách nhanh nhất: chép nguyên
`Account.java` thành `SavingAccount.java`, đổi tên, thêm lãi suất. Hai tuần sau, team sửa lỗi kiểm tra
số tiền trong `Account.withdraw`, nhưng không ai nhớ còn một bản chép. Khách gửi tiết kiệm vẫn dính lỗi cũ,
và reviewer để lại đúng một dòng: *"Sao không `extends Account`?"*

Bài này trả lời câu hỏi đó, và chỉ ra những cái bẫy đi kèm khi kế thừa. Nó phủ hai topic *Inheritance* và
*Method Overriding* trong lộ trình Java của roadmap.sh [1].

**Cần biết trước:** [Bài 6 Chặng 1 · Nhập môn OOP](/docs/learning/chang-1/nhap-mon-oop) (class, object,
constructor, `this`, `toString()`), [Bài 1 · Package và access modifier](/docs/learning/chang-2/package-va-access-modifier),
[Bài 2 · Đóng gói và method](/docs/learning/chang-2/dong-goi-va-method),
[Bài 3 · static, final và vòng đời object](/docs/learning/chang-2/static-final-vong-doi-object).

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| Kế thừa (*inheritance*) | Class mới nhận lại field và method của một class có sẵn | `class SavingAccount extends Account` |
| Class cha / class con (*superclass* / *subclass*) | Class được kế thừa / class đi kế thừa | `Account` là cha, `SavingAccount` là con |
| `extends` | Từ khoá khai báo "class này là con của class kia" | `extends Account` |
| Quan hệ *is-a* | "là một loại" | sổ tiết kiệm **là một loại** tài khoản |
| `super` | "Phần của cha" bên trong object hiện tại | `super(owner, balance)`, `super.withdraw(x)` |
| `protected` | Mở cho class con (và class cùng package) | `protected void addInterest(long)` |
| Ghi đè (*override*) | Class con viết lại một method của cha, giữ nguyên chữ ký | `withdraw` riêng của `SavingAccount` |
| `@Override` | Nhãn nhờ compiler kiểm tra "đây đúng là ghi đè" | `@Override public String toString()` |
| `equals` / `hashCode` | So bằng nhau theo nội dung / con số dùng để chia ngăn khi tìm kiếm | `id.equals(other)` |
| Composition (*has-a*) | Ghép: class giữ object khác trong field | `Customer` có mảng `Account[]` |

💡 **Về cách lưu tiền trong bài này.** Giống Bài 6 Chặng 1, bài này dùng `long` với đơn vị **đồng**
để code ngắn: VND không có đơn vị nhỏ hơn đồng nên `long` biểu diễn chính xác mọi số tiền. Phép tính lãi ở
phần 3 dùng chia số nguyên (làm tròn xuống) cho đơn giản. Hệ thống thật nên tính lãi bằng `BigDecimal` với
quy tắc làm tròn rõ ràng, như ở [Bài 7 Chặng 1](/docs/learning/chang-1/checkpoint-lai-kep).

## 1. Kế thừa là gì: `extends` và quan hệ *is-a*

**Ý tưởng nôm na.** Ngân hàng có một bản **"Quy định chung về tài khoản"**: nạp tiền, rút tiền, xem số dư.
Hợp đồng sổ tiết kiệm không chép lại cả bản quy định đó. Nó chỉ ghi: *"Tuân theo Quy định chung, cộng thêm
các điều khoản sau: lãi suất 6%/năm..."*. Từ khoá `extends` trong Java chính là câu "tuân theo quy định
chung" ấy.

**Kế thừa** (*inheritance*) là khi một class mới nhận lại các field và method của một class có sẵn. Class
có sẵn gọi là **class cha** (*superclass*), class mới gọi là **class con** (*subclass*) [2]. Ta khai báo
bằng `class SavingAccount extends Account` [3]. Class nào **không** ghi `extends` thì cha của nó là
`java.lang.Object`, gốc của mọi class [3][2].

Ba điều cần nhớ ngay từ đầu:

- Thành viên `private` của cha **không được kế thừa**: code của class con không gọi thẳng tên được [4][2].
- Nhưng object của class con **vẫn chứa** các field đó. Khi tạo object, JVM cấp chỗ cho mọi field của class
  và của tất cả class cha [5].
- Constructor **không phải** thành viên, nên **không được kế thừa** [4][2]. Class con phải tự viết
  constructor (phần 2).

<svg viewBox="0 0 720 310" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bên trái là cây kế thừa: Object ở gốc; Account kế thừa ngầm từ Object; SavingAccount và CheckingAccount cùng extends Account. Mũi tên tam giác rỗng đọc là: là một loại, quan hệ is-a. Bên phải là bên trong object an kiểu SavingAccount trên heap: một object duy nhất gồm phần Account do super dựng, có owner bằng An và balance bằng 6000000, cả hai là private, và phần SavingAccount có annualRatePercent bằng 6. Field private của cha vẫn nằm trong object nhưng code của SavingAccount không truy cập trực tiếp.">
  <defs>
    <marker id="c2b4-tree-tri" markerWidth="14" markerHeight="14" refX="11" refY="6" orient="auto">
      <path d="M0,0 L11,6 L0,12 Z" fill="#FFFFFF" stroke="#1D4ED8"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="360" height="290" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="190" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#0F172A">Cây kế thừa (giữa các class)</text>
    <rect x="130" y="48" width="120" height="32" rx="6" fill="#FFFFFF" stroke="#64748B"/>
    <text x="190" y="69" text-anchor="middle" font-family="monospace" fill="#0F172A">Object</text>
    <rect x="110" y="130" width="160" height="32" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="190" y="151" text-anchor="middle" font-family="monospace" fill="#1D4ED8">Account</text>
    <rect x="25" y="220" width="150" height="32" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="100" y="241" text-anchor="middle" font-family="monospace" fill="#047857">SavingAccount</text>
    <rect x="205" y="220" width="150" height="32" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="280" y="241" text-anchor="middle" font-family="monospace" fill="#047857">CheckingAccount</text>
    <line x1="190" y1="130" x2="190" y2="82" stroke="#1D4ED8" stroke-width="1.5" marker-end="url(#c2b4-tree-tri)"/>
    <text x="200" y="110" fill="#64748B">extends (ngầm)</text>
    <line x1="100" y1="220" x2="160" y2="164" stroke="#1D4ED8" stroke-width="1.5" marker-end="url(#c2b4-tree-tri)"/>
    <line x1="280" y1="220" x2="220" y2="164" stroke="#1D4ED8" stroke-width="1.5" marker-end="url(#c2b4-tree-tri)"/>
    <text x="70" y="196" fill="#64748B">extends</text>
    <text x="262" y="196" fill="#64748B">extends</text>
    <text x="190" y="282" text-anchor="middle" fill="#0F172A">Mũi tên tam giác đọc là “là một loại” (is-a)</text>
    <rect x="390" y="10" width="320" height="290" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="550" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#0F172A">Bên trong object an (trên heap)</text>
    <rect x="405" y="46" width="290" height="180" rx="8" fill="#FFFFFF" stroke="#10B981" stroke-width="1.5"/>
    <text x="550" y="68" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#047857">an : SavingAccount</text>
    <rect x="420" y="80" width="260" height="78" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="430" y="99" fill="#1D4ED8" font-weight="bold">Phần Account (do super(...) dựng)</text>
    <text x="430" y="123" font-family="monospace" fill="#0F172A">owner = "An"</text>
    <text x="670" y="123" text-anchor="end" fill="#DC2626">private</text>
    <text x="430" y="145" font-family="monospace" fill="#0F172A">balance = 6000000</text>
    <text x="670" y="145" text-anchor="end" fill="#DC2626">private</text>
    <rect x="420" y="168" width="260" height="48" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="430" y="187" fill="#047857" font-weight="bold">Phần SavingAccount thêm vào</text>
    <text x="430" y="207" font-family="monospace" fill="#0F172A">annualRatePercent = 6</text>
    <text x="550" y="250" text-anchor="middle" fill="#0F172A">Một object duy nhất, chứa cả hai phần.</text>
    <text x="550" y="270" text-anchor="middle" fill="#DC2626">Field private của cha: có trong object, nhưng</text>
    <text x="550" y="287" text-anchor="middle" fill="#DC2626">SavingAccount không truy cập trực tiếp được</text>
  </g>
</svg>

Chương trình đầu tiên. Lưu thành `InheritanceBasics.java` rồi chạy `java InheritanceBasics.java`:

```java
public class InheritanceBasics {
    public static void main(String[] args) {
        SavingAccount an = new SavingAccount("An", 5_000_000, 6);

        // deposit, getOwner, getBalance KHÔNG viết trong SavingAccount: được thừa hưởng từ Account
        an.deposit(1_000_000);
        System.out.println(an.getOwner() + ": " + an.getBalance());

        // Thứ SavingAccount tự thêm
        System.out.println("Lãi suất: " + an.getAnnualRatePercent() + "%/năm");

        // SavingAccount LÀ MỘT Account, nên gán được vào biến kiểu Account
        Account general = an;
        System.out.println("Qua biến Account: " + general.getBalance());
    }
}

class Account {
    private final String owner;
    private long balance;              // đơn vị: đồng

    Account(String owner, long balance) {
        this.owner = owner;
        this.balance = balance;
    }

    public String getOwner() { return owner; }
    public long getBalance() { return balance; }

    public void deposit(long amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
}

// "SavingAccount mở rộng Account": có mọi thứ của Account, cộng thêm lãi suất
class SavingAccount extends Account {
    private final int annualRatePercent;  // lãi suất %/năm

    SavingAccount(String owner, long balance, int annualRatePercent) {
        super(owner, balance);            // nhờ Account dựng phần "Account" (phần 2)
        this.annualRatePercent = annualRatePercent;
    }

    public int getAnnualRatePercent() { return annualRatePercent; }
}
```

**Kết quả khi chạy:**

```text
An: 6000000
Lãi suất: 6%/năm
Qua biến Account: 6000000
```

**Giải thích từng bước:**

1. `new SavingAccount("An", 5_000_000, 6)` tạo **một** object. Dòng `super(owner, balance)` nhờ constructor
   của `Account` gán `owner` và `balance` (phần 2 học kỹ).
2. `an.deposit(1_000_000)`: `SavingAccount` không hề viết `deposit`, nhưng gọi được vì **thừa hưởng** từ
   `Account`. Số dư thành 6.000.000.
3. `getAnnualRatePercent()` là method chỉ `SavingAccount` có.
4. `Account general = an;` hợp lệ vì sổ tiết kiệm **là một loại** tài khoản (*is-a*). Biến kiểu cha trỏ
   tới object của con là nền móng của **đa hình** (*polymorphism*), Bài 5 và Bài 6 sẽ học kỹ.

Kiểm tra nhanh trước khi viết `extends`: đọc to câu **"X là một loại Y"**. "Sổ tiết kiệm là một loại tài
khoản" nghe đúng, nên kế thừa hợp lý. Phần 7 sẽ gặp một câu nghe sai.

### ⚠️ Lỗi hay gặp

**Gán ngược chiều.** Mọi `SavingAccount` đều là `Account`, nhưng không phải `Account` nào cũng là
`SavingAccount`:

```java
public class WrongDirection {
    public static void main(String[] args) {
        // Sai chiều: không phải Account nào cũng là SavingAccount
        SavingAccount binh = new Account("Bình", 0);
        System.out.println(binh.getAnnualRatePercent());
    }
}

class Account {
    private final String owner;
    private long balance;

    Account(String owner, long balance) {
        this.owner = owner;
        this.balance = balance;
    }
}

class SavingAccount extends Account {
    private final int annualRatePercent;

    SavingAccount(String owner, long balance, int annualRatePercent) {
        super(owner, balance);
        this.annualRatePercent = annualRatePercent;
    }

    public int getAnnualRatePercent() { return annualRatePercent; }
}
```

```text
WrongDirection.java:4: error: incompatible types: Account cannot be converted to SavingAccount
        SavingAccount binh = new Account("Bình", 0);
                             ^
1 error
error: compilation failed
```

**Cách sửa:** chọn đúng kiểu. Muốn sổ tiết kiệm thì `new SavingAccount("Bình", 0, 6)`. Chỉ cần tài khoản
thường thì khai báo `Account binh = new Account("Bình", 0);`.

## 2. Constructor của class con: `super(...)` và chuỗi khởi tạo

**Ý tưởng nôm na.** Ra quầy mở sổ tiết kiệm, giao dịch viên phải **mở phần tài khoản trước** (ghi tên chủ,
số dư ban đầu), xong mới **gắn điều khoản tiết kiệm** lên đó. Không ai gắn lãi suất vào một tài khoản chưa
tồn tại. Trong Java, "mở phần tài khoản trước" là lời gọi `super(...)`.

Lời gọi **`super(...)`** chạy constructor của class cha để dựng "phần cha" trong object [6][7]. Nếu bạn
không viết, javac **tự chèn** `super();` (constructor không tham số của cha) vào đầu constructor [7][6]. Class
con không viết constructor nào thì javac tạo **constructor mặc định**, bên trong cũng chỉ gọi `super();` [8].
Cứ thế đi ngược lên tới `Object()`. Oracle gọi đây là **chuỗi constructor** (*constructor chaining*) [6].

Ở [Bài 3](/docs/learning/chang-2/static-final-vong-doi-object) bạn đã thấy thứ tự trong **một** class: field
initializer chạy trước thân constructor. Khi có cha, JLS quy định: lời gọi `super(...)` chạy **trọn vẹn**
phần của cha trước, rồi mới tới field initializer và thân constructor của con [5].

<svg viewBox="0 0 720 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chuỗi constructor khi chạy new SavingAccount. Bốn cột từ trái sang phải: main, constructor SavingAccount, constructor Account, constructor Object; thời gian chạy từ trên xuống. main gọi new SavingAccount. SavingAccount gọi ngay super với owner và balance sang Account. Account gọi super rỗng ngầm sang Object. Object xong, quay về Account. Account chạy bước 1 field initializer của Account, rồi bước 2 thân constructor Account, rồi quay về SavingAccount. SavingAccount chạy bước 3 field initializer của SavingAccount, rồi bước 4 thân constructor SavingAccount, rồi trả object hoàn chỉnh về main. Cha luôn xong trước con.">
  <defs>
    <marker id="c2b4-chain-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#1D4ED8"/>
    </marker>
    <marker id="c2b4-chain-back" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="30" y="12" width="100" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="80" y="32" text-anchor="middle" font-family="monospace" fill="#0F172A">main</text>
    <rect x="185" y="12" width="170" height="30" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="270" y="32" text-anchor="middle" font-family="monospace" fill="#047857">SavingAccount(...)</text>
    <rect x="395" y="12" width="150" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="470" y="32" text-anchor="middle" font-family="monospace" fill="#1D4ED8">Account(...)</text>
    <rect x="580" y="12" width="120" height="30" rx="6" fill="#FFFFFF" stroke="#64748B"/>
    <text x="640" y="32" text-anchor="middle" font-family="monospace" fill="#0F172A">Object()</text>
    <line x1="80" y1="42" x2="80" y2="370" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <line x1="270" y1="42" x2="270" y2="370" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <line x1="470" y1="42" x2="470" y2="370" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <line x1="640" y1="42" x2="640" y2="370" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <line x1="80" y1="72" x2="264" y2="72" stroke="#1D4ED8" stroke-width="1.5" marker-end="url(#c2b4-chain-arrow)"/>
    <text x="175" y="65" text-anchor="middle" font-family="monospace" fill="#1D4ED8">new SavingAccount(...)</text>
    <line x1="270" y1="104" x2="464" y2="104" stroke="#1D4ED8" stroke-width="1.5" marker-end="url(#c2b4-chain-arrow)"/>
    <text x="370" y="97" text-anchor="middle" font-family="monospace" fill="#1D4ED8">super(owner, balance)</text>
    <line x1="470" y1="136" x2="634" y2="136" stroke="#1D4ED8" stroke-width="1.5" marker-end="url(#c2b4-chain-arrow)"/>
    <text x="555" y="129" text-anchor="middle" font-family="monospace" fill="#1D4ED8">super() ngầm</text>
    <line x1="640" y1="164" x2="476" y2="164" stroke="#64748B" stroke-dasharray="5 3" marker-end="url(#c2b4-chain-back)"/>
    <text x="555" y="157" text-anchor="middle" fill="#64748B">xong</text>
    <rect x="395" y="176" width="150" height="28" rx="5" fill="#FFFBEB" stroke="#D97706"/>
    <text x="470" y="195" text-anchor="middle" fill="#0F172A">(1) field initializer</text>
    <rect x="395" y="212" width="150" height="28" rx="5" fill="#FFFBEB" stroke="#D97706"/>
    <text x="470" y="231" text-anchor="middle" fill="#0F172A">(2) thân Account</text>
    <line x1="470" y1="258" x2="276" y2="258" stroke="#64748B" stroke-dasharray="5 3" marker-end="url(#c2b4-chain-back)"/>
    <text x="370" y="251" text-anchor="middle" fill="#64748B">phần Account đã xong</text>
    <rect x="195" y="270" width="150" height="28" rx="5" fill="#FFFBEB" stroke="#D97706"/>
    <text x="270" y="289" text-anchor="middle" fill="#0F172A">(3) field initializer</text>
    <rect x="195" y="306" width="150" height="28" rx="5" fill="#FFFBEB" stroke="#D97706"/>
    <text x="270" y="325" text-anchor="middle" fill="#0F172A">(4) thân SavingAccount</text>
    <line x1="270" y1="352" x2="86" y2="352" stroke="#64748B" stroke-dasharray="5 3" marker-end="url(#c2b4-chain-back)"/>
    <text x="175" y="345" text-anchor="middle" fill="#047857">object hoàn chỉnh</text>
    <rect x="572" y="232" width="140" height="110" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="640" y="250" text-anchor="middle" fill="#0F172A">Mũi tên liền:</text>
    <text x="640" y="268" text-anchor="middle" fill="#0F172A">gọi constructor cha</text>
    <text x="640" y="294" text-anchor="middle" fill="#0F172A">Mũi tên đứt: quay về,</text>
    <text x="640" y="312" text-anchor="middle" fill="#0F172A">phần cha xong rồi</text>
    <text x="640" y="330" text-anchor="middle" fill="#0F172A">mới tới phần con</text>
  </g>
</svg>

Chương trình in log từng bước. Hàm `trace` in một dòng rồi trả lại chuỗi, nhờ vậy ta "nhìn thấy" lúc field
initializer chạy:

```java
public class ConstructorChain {
    // In một dòng log rồi trả lại chuỗi, để dùng được trong field initializer
    static String trace(String message) {
        System.out.println(message);
        return message;
    }

    public static void main(String[] args) {
        System.out.println("main: gọi new SavingAccount(...)");
        SavingAccount an = new SavingAccount("An", 5_000_000, 6);
        System.out.println("main: nhận được object, số dư = " + an.getBalance());
    }
}

class Account {
    private final String owner;
    private long balance;
    private final String accountLog = ConstructorChain.trace("  (1) field initializer của Account");

    Account(String owner, long balance) {
        // Dòng ẩn ở đây: super();  -> gọi Object()
        ConstructorChain.trace("  (2) thân constructor Account");
        this.owner = owner;
        this.balance = balance;
    }

    public long getBalance() { return balance; }
}

class SavingAccount extends Account {
    private final int annualRatePercent;
    private final String savingLog = ConstructorChain.trace("  (3) field initializer của SavingAccount");

    SavingAccount(String owner, long balance, int annualRatePercent) {
        super(owner, balance);   // PHẢI chạy xong phần Account trước
        ConstructorChain.trace("  (4) thân constructor SavingAccount");
        this.annualRatePercent = annualRatePercent;
    }
}
```

**Kết quả khi chạy:**

```text
main: gọi new SavingAccount(...)
  (1) field initializer của Account
  (2) thân constructor Account
  (3) field initializer của SavingAccount
  (4) thân constructor SavingAccount
main: nhận được object, số dư = 5000000
```

**Giải thích từng bước:**

1. `main` gọi `new SavingAccount(...)`. Constructor `SavingAccount` bắt đầu bằng `super(owner, balance)`,
   nên chưa có dòng nào của nó chạy.
2. Constructor `Account` có `super();` ngầm, gọi `Object()`. `Object()` không in gì.
3. Quay về `Account`: field initializer của `Account` chạy (**(1)**), rồi thân constructor `Account` (**(2)**).
4. Phần `Account` xong, quay về `SavingAccount`: field initializer của nó (**(3)**), rồi phần thân còn lại
   sau `super(...)` (**(4)**).
5. Object hoàn chỉnh được trả về `main`. Quy luật: **cha luôn xong trước con** [5].

### ⚠️ Lỗi hay gặp

**Lỗi 1: quên `super(...)` khi cha không có constructor rỗng.** javac tự chèn `super();`, nhưng `Account`
chỉ có constructor 2 tham số:

```java
public class MissingSuper {
    public static void main(String[] args) {
        System.out.println(new SavingAccount(6));
    }
}

class Account {
    private long balance;

    Account(String owner, long balance) {   // chỉ có constructor 2 tham số
        this.balance = balance;
    }
}

class SavingAccount extends Account {
    private final int annualRatePercent;

    SavingAccount(int annualRatePercent) {
        // quên gọi super(...): javac tự chèn super(); nhưng Account() không tồn tại
        this.annualRatePercent = annualRatePercent;
    }
}
```

```text
MissingSuper.java:18: error: constructor Account in class Account cannot be applied to given types;
    SavingAccount(int annualRatePercent) {
                                         ^
  required: String,long
  found:    no arguments
  reason: actual and formal argument lists differ in length
1 error
error: compilation failed
```

Đọc thông báo: javac cần `String,long` (`required`) nhưng nhận "không tham số" (`found: no arguments`).
**Cách sửa:** gọi rõ `super(owner, balance)` với đúng tham số, như ở ví dụ chính.

**Lỗi 2: viết lệnh trước `super(...)`.** Gán field trước, gọi `super` sau:

```java
public class SuperNotFirst {
    public static void main(String[] args) {
        System.out.println(new SavingAccount("An", 0, 6).getBalance());
    }
}

class Account {
    private long balance;

    Account(String owner, long balance) {
        this.balance = balance;
    }

    public long getBalance() { return balance; }
}

class SavingAccount extends Account {
    private final int annualRatePercent;

    SavingAccount(String owner, long balance, int annualRatePercent) {
        this.annualRatePercent = annualRatePercent;  // gán field của mình trước...
        super(owner, balance);                       // ...rồi mới gọi super
    }
}
```

JDK 21 báo:

```text
SuperNotFirst.java:22: error: call to super must be first statement in constructor
        super(owner, balance);                       // ...rồi mới gọi super
             ^
1 error
error: compilation failed
```

**Cách sửa:** đặt `super(...)` ở **dòng đầu tiên** của constructor. Ghi chú phiên bản: Java 25 đã chính thức
nới quy tắc này (JEP 513), cho phép vài câu lệnh **trước** `super(...)`, ví dụ kiểm tra tham số, hoặc gán
giá trị cho field **chưa có giá trị khởi tạo**; ngoài việc gán đó thì không được dùng tới object đang
được tạo [9]. Bài này chạy trên JDK 21 (chưa thử trên JDK 25), nên giữ cách viết chạy được trên cả hai:
`super(...)` đứng đầu.

## 3. `protected`: cửa dành riêng cho class con

**Ý tưởng nôm na.** Trong chi nhánh có **két sắt** (`private`): chỉ thủ quỹ mở được. Có **quầy giao dịch**
(`public`): khách nào cũng tới được. Ở giữa có **cửa nội bộ "chỉ nhân viên"** (`protected`): người trong hệ
thống (class con) đi qua được, nhưng ở cửa vẫn có bảo vệ kiểm tra.

Bài 1 đã có bảng 4 mức truy cập. Ở đây ta xem chúng **trong thực tế kế thừa**, khi class con nằm ở package
khác cha:

- `private` không được kế thừa, class con không đụng tới được [4].
- Không ghi gì (*package-private*) chỉ được kế thừa bởi class con **cùng package** [4].
- `protected` và `public` được kế thừa cả ở package khác [4][10].
- Ở package khác, class con chỉ dùng member `protected` qua **chính nó** (`this`) hoặc qua biến có kiểu là
  class con đó (hay con của nó), **không** qua một biến kiểu `Account` bất kỳ [10].

<svg viewBox="0 0 720 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bảng ai gọi được thành viên của Account, với ba package khác nhau: Account nằm trong vn.onward.bank, SavingAccount là class con nằm trong vn.onward.bank.saving, Main nằm trong vn.onward.app. Thành viên private như field balance: chỉ Account dùng được. Không ghi gì, tức package-private: chỉ Account dùng được vì hai class kia khác package. protected như method addInterest: Account dùng được, SavingAccount dùng được nhưng chỉ qua this hoặc qua biến kiểu SavingAccount hay class con của nó, Main không dùng được. public như getBalance: cả ba dùng được.">
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="700" height="310" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="360" y="34" text-anchor="middle" font-size="13" font-weight="bold" fill="#0F172A">Ai gọi được thành viên của Account? (ba class ở ba package khác nhau)</text>
    <rect x="30" y="50" width="200" height="56" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="130" y="83" text-anchor="middle" font-weight="bold" fill="#0F172A">Mức truy cập</text>
    <rect x="230" y="50" width="150" height="56" fill="#EFF6FF" stroke="#94A3B8"/>
    <text x="305" y="74" text-anchor="middle" font-family="monospace" fill="#1D4ED8">Account</text>
    <text x="305" y="94" text-anchor="middle" fill="#64748B">chính nó</text>
    <rect x="380" y="50" width="170" height="56" fill="#ECFDF5" stroke="#94A3B8"/>
    <text x="465" y="74" text-anchor="middle" font-family="monospace" fill="#047857">SavingAccount</text>
    <text x="465" y="94" text-anchor="middle" fill="#64748B">class con, package khác</text>
    <rect x="550" y="50" width="140" height="56" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="620" y="74" text-anchor="middle" font-family="monospace" fill="#0F172A">Main</text>
    <text x="620" y="94" text-anchor="middle" fill="#64748B">không phải con</text>
    <rect x="30" y="106" width="200" height="44" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="42" y="126" font-family="monospace" fill="#0F172A">private</text>
    <text x="42" y="142" fill="#64748B">field balance</text>
    <rect x="230" y="106" width="150" height="44" fill="#ECFDF5" stroke="#94A3B8"/>
    <text x="305" y="133" text-anchor="middle" font-size="16" fill="#047857">✓</text>
    <rect x="380" y="106" width="170" height="44" fill="#FEF2F2" stroke="#94A3B8"/>
    <text x="465" y="133" text-anchor="middle" font-size="16" fill="#DC2626">✗</text>
    <rect x="550" y="106" width="140" height="44" fill="#FEF2F2" stroke="#94A3B8"/>
    <text x="620" y="133" text-anchor="middle" font-size="16" fill="#DC2626">✗</text>
    <rect x="30" y="150" width="200" height="44" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="42" y="170" fill="#0F172A">(không ghi gì)</text>
    <text x="42" y="186" fill="#64748B">package-private</text>
    <rect x="230" y="150" width="150" height="44" fill="#ECFDF5" stroke="#94A3B8"/>
    <text x="305" y="177" text-anchor="middle" font-size="16" fill="#047857">✓</text>
    <rect x="380" y="150" width="170" height="44" fill="#FEF2F2" stroke="#94A3B8"/>
    <text x="465" y="177" text-anchor="middle" font-size="16" fill="#DC2626">✗</text>
    <rect x="550" y="150" width="140" height="44" fill="#FEF2F2" stroke="#94A3B8"/>
    <text x="620" y="177" text-anchor="middle" font-size="16" fill="#DC2626">✗</text>
    <rect x="30" y="194" width="200" height="44" fill="#FFFBEB" stroke="#94A3B8"/>
    <text x="42" y="214" font-family="monospace" fill="#0F172A">protected</text>
    <text x="42" y="230" fill="#64748B">method addInterest</text>
    <rect x="230" y="194" width="150" height="44" fill="#ECFDF5" stroke="#94A3B8"/>
    <text x="305" y="221" text-anchor="middle" font-size="16" fill="#047857">✓</text>
    <rect x="380" y="194" width="170" height="44" fill="#FFFBEB" stroke="#D97706"/>
    <text x="465" y="214" text-anchor="middle" font-size="16" fill="#047857">✓ *</text>
    <text x="465" y="231" text-anchor="middle" font-size="11" fill="#D97706">trên chính nó</text>
    <rect x="550" y="194" width="140" height="44" fill="#FEF2F2" stroke="#94A3B8"/>
    <text x="620" y="221" text-anchor="middle" font-size="16" fill="#DC2626">✗</text>
    <rect x="30" y="238" width="200" height="44" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="42" y="258" font-family="monospace" fill="#0F172A">public</text>
    <text x="42" y="274" fill="#64748B">method getBalance</text>
    <rect x="230" y="238" width="150" height="44" fill="#ECFDF5" stroke="#94A3B8"/>
    <text x="305" y="265" text-anchor="middle" font-size="16" fill="#047857">✓</text>
    <rect x="380" y="238" width="170" height="44" fill="#ECFDF5" stroke="#94A3B8"/>
    <text x="465" y="265" text-anchor="middle" font-size="16" fill="#047857">✓</text>
    <rect x="550" y="238" width="140" height="44" fill="#ECFDF5" stroke="#94A3B8"/>
    <text x="620" y="265" text-anchor="middle" font-size="16" fill="#047857">✓</text>
    <text x="30" y="306" fill="#D97706">* Ở package khác: chỉ gọi qua this, hoặc qua biến kiểu SavingAccount (hay class con của nó).</text>
  </g>
</svg>

Ví dụ có ba package. Cây thư mục:

```text
b4-protected/
└── src/vn/onward/
    ├── bank/Account.java
    ├── bank/saving/SavingAccount.java
    └── app/Main.java
```

`src/vn/onward/bank/Account.java`:

```java
package vn.onward.bank;

public class Account {
    private final String owner;
    private long balance;                  // private: chỉ Account đụng trực tiếp

    public Account(String owner, long balance) {
        this.owner = owner;
        this.balance = balance;
    }

    public String getOwner() { return owner; }
    public long getBalance() { return balance; }

    public void deposit(long amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    // protected: "cửa riêng cho class con", vẫn có kiểm tra như mọi cửa khác
    protected void addInterest(long interest) {
        if (interest > 0) {
            balance += interest;
        }
    }
}
```

`src/vn/onward/bank/saving/SavingAccount.java`:

```java
package vn.onward.bank.saving;

import vn.onward.bank.Account;

public class SavingAccount extends Account {
    private final int annualRatePercent;

    public SavingAccount(String owner, long balance, int annualRatePercent) {
        super(owner, balance);
        this.annualRatePercent = annualRatePercent;
    }

    public void payYearlyInterest() {
        long interest = getBalance() * annualRatePercent / 100;  // chia nguyên, làm tròn xuống
        addInterest(interest);   // OK: method protected, gọi từ class con (khác package)
    }
}
```

`src/vn/onward/app/Main.java`:

```java
package vn.onward.app;

import vn.onward.bank.saving.SavingAccount;

public class Main {
    public static void main(String[] args) {
        SavingAccount an = new SavingAccount("An", 5_000_000, 6);
        System.out.println("Trước khi trả lãi: " + an.getBalance());

        an.payYearlyInterest();          // public: ai cũng gọi được
        System.out.println("Sau khi trả lãi:   " + an.getBalance());

        // an.addInterest(1_000_000);    // Main không phải class con: bị chặn (xem ⚠️)
    }
}
```

Biên dịch và chạy (đứng trong thư mục `b4-protected`):

```bash
javac -d out src/vn/onward/bank/Account.java src/vn/onward/bank/saving/SavingAccount.java src/vn/onward/app/Main.java
java -cp out vn.onward.app.Main
```

**Kết quả khi chạy:**

```text
Trước khi trả lãi: 5000000
Sau khi trả lãi:   5300000
```

**Giải thích từng bước:**

1. `balance` là `private`: chỉ code bên trong `Account` sửa được nó.
2. `addInterest` là `protected` và **vẫn kiểm tra** `interest > 0`. Đây là "cửa nội bộ có bảo vệ".
3. `SavingAccount` ở package `vn.onward.bank.saving`, khác package của cha, nhưng là class con nên gọi
   được `addInterest(interest)` trên chính nó.
4. Lãi = 5.000.000 × 6 / 100 = 300.000, số dư thành 5.300.000.
5. `Main` gọi được `payYearlyInterest()` vì nó `public`.

Khi thiết kế class cha, hãy theo bảng sau. Ý chính: giữ **bất biến** (*invariant*) "số dư không âm" của
[Bài 2](/docs/learning/chang-2/dong-goi-va-method) ở **một chỗ duy nhất** là class cha.

| ✓ Nên | ✗ Không nên |
|-------|-------------|
| Field `private`, mở method `protected` có kiểm tra (`addInterest`) | `protected long balance;` để mọi class con, ở mọi package, cộng trừ thẳng |
| Class con chỉ cần đọc thì dùng getter `public`/`protected` (`getBalance()`) | Chép logic kiểm tra của cha sang con |
| Chỉ mở `protected` đúng những gì class con thật sự cần | Đánh `protected` "cho chắc" lên mọi thứ |

### ⚠️ Lỗi hay gặp

**Lỗi 1: class con sửa thẳng field `private` của cha.** Trong `SavingAccount.payYearlyInterest()`, thay
`addInterest(interest);` bằng `balance += interest;`:

```text
src/vn/onward/bank/saving/SavingAccount.java:15: error: balance has private access in Account
        balance += interest;      // thử sửa thẳng field private của cha
        ^
1 error
```

**Cách sửa:** đi qua method cha cung cấp (`addInterest`), đừng đổi `balance` thành `protected`.

**Lỗi 2: class không phải con gọi method `protected`.** Trong `Main`, bỏ comment dòng `an.addInterest(1_000_000);`:

```text
src/vn/onward/app/Main.java:13: error: addInterest(long) has protected access in Account
        an.addInterest(1_000_000);    // Main không phải class con: bị chặn (xem ⚠️)
          ^
1 error
```

**Cách sửa:** `Main` chỉ dùng API `public` như `payYearlyInterest()` hay `deposit()`. Đó chính là mục đích
của `protected`: người ngoài không "bơm lãi" tuỳ ý được.

**Lỗi 3: gọi `protected` qua một biến kiểu cha, ở package khác.** Thêm method này vào `SavingAccount`, ngay sau
method `payYearlyInterest()` (sau dấu `}` đóng của nó, cách một dòng trống, trước dấu `}` đóng class):

```java
    // Thử "tặng lãi" vào một tài khoản Account bất kỳ khác
    public void giftInterest(Account other, long amount) {
        other.addInterest(amount);      // qua biến kiểu Account, ở package khác
    }
```

```text
src/vn/onward/bank/saving/SavingAccount.java:20: error: addInterest(long) has protected access in Account
        other.addInterest(amount);      // qua biến kiểu Account, ở package khác
             ^
1 error
```

Bất ngờ với nhiều người: `SavingAccount` là con của `Account` mà vẫn bị chặn. Lý do: `other` có thể là
**bất kỳ** tài khoản nào (của class con khác, chi nhánh khác), không phải "phần của chính nó" [10].
**Cách sửa:** việc cộng tiền vào tài khoản khác phải đi qua API `public` (như `deposit`), nơi có đủ kiểm tra.

## 4. Ghi đè method: `@Override` và `super.method()`

**Ý tưởng nôm na.** Quy định chung: *rút được nếu đủ số dư*. Sổ tiết kiệm có điều khoản riêng: *phải giữ lại
tối thiểu 50.000 đồng*. Giao dịch viên đọc **điều khoản riêng của sổ** trước. Nếu ổn, họ **áp tiếp quy định
chung**. Điều khoản riêng là **ghi đè**; "áp tiếp quy định chung" là `super.withdraw(...)`.

**Ghi đè** (*override*) là khi class con khai báo lại một method instance của cha với **cùng chữ ký** (cùng
tên, cùng danh sách kiểu tham số) để thay hành vi [11][12]. Bên trong bản ghi đè, `super.withdraw(amount)` gọi
**bản của cha** [6]. Annotation `@Override` (bạn đã gặp ở `toString()` Bài 6 Chặng 1) bảo compiler: "tôi định
ghi đè". Nếu thực ra không ghi đè gì, javac báo lỗi [14][11].

<svg viewBox="0 0 720 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Luồng một lời gọi method bị ghi đè. Trên stack, biến viaParent có kiểu khai báo Account, trỏ tới một object trên heap có kiểu thật là SavingAccount. Lời gọi viaParent.withdraw 60000 bắt đầu tìm withdraw từ class thật của object là SavingAccount: tìm thấy bản ghi đè, chạy bước 1 kiểm tra luật giữ tối thiểu 50000. Nếu qua được luật, bước 2 gọi super.withdraw đi lên bản withdraw của Account để kiểm tra số dư và trừ tiền, bước 3 trả kết quả về. Trong ví dụ, số dư 100000 trừ 60000 còn 40000, nhỏ hơn 50000, nên SavingAccount trả false ngay ở bước 1 và không gọi lên Account.">
  <defs>
    <marker id="c2b4-ovr-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#1D4ED8"/>
    </marker>
    <marker id="c2b4-ovr-ref" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="210" height="150" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="115" y="32" text-anchor="middle" font-weight="bold" fill="#0F172A">Stack</text>
    <rect x="25" y="48" width="180" height="48" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="35" y="67" font-family="monospace" fill="#1D4ED8">viaParent</text>
    <text x="35" y="86" fill="#64748B">kiểu khai báo: Account</text>
    <text x="115" y="124" text-anchor="middle" font-family="monospace" fill="#0F172A">viaParent</text>
    <text x="115" y="142" text-anchor="middle" font-family="monospace" fill="#0F172A">.withdraw(60_000)</text>
    <line x1="205" y1="72" x2="268" y2="72" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b4-ovr-ref)"/>
    <rect x="275" y="10" width="200" height="150" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="375" y="32" text-anchor="middle" font-weight="bold" fill="#0F172A">Heap</text>
    <rect x="290" y="48" width="170" height="70" rx="6" fill="#FFFFFF" stroke="#10B981"/>
    <text x="375" y="68" text-anchor="middle" fill="#047857" font-weight="bold">object an</text>
    <text x="375" y="88" text-anchor="middle" fill="#0F172A">kiểu thật:</text>
    <text x="375" y="106" text-anchor="middle" font-family="monospace" fill="#047857">SavingAccount</text>
    <text x="375" y="142" text-anchor="middle" fill="#64748B">balance = 100000</text>
    <line x1="460" y1="83" x2="528" y2="83" stroke="#1D4ED8" stroke-width="1.5" marker-end="url(#c2b4-ovr-arrow)"/>
    <text x="494" y="74" text-anchor="middle" fill="#1D4ED8">tìm từ</text>
    <text x="494" y="104" text-anchor="middle" fill="#1D4ED8">kiểu thật</text>
    <rect x="535" y="10" width="175" height="310" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="622" y="32" text-anchor="middle" font-weight="bold" fill="#0F172A">Code của class</text>
    <rect x="550" y="48" width="145" height="112" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="622" y="66" text-anchor="middle" font-family="monospace" fill="#047857">SavingAccount</text>
    <text x="560" y="88" font-family="monospace" fill="#0F172A">withdraw(long)</text>
    <text x="560" y="108" fill="#0F172A">① còn ≥ 50.000?</text>
    <text x="560" y="126" fill="#DC2626">không: return false</text>
    <text x="560" y="146" fill="#047857">có: ② super.withdraw</text>
    <line x1="622" y1="160" x2="622" y2="206" stroke="#1D4ED8" stroke-width="1.5" marker-end="url(#c2b4-ovr-arrow)"/>
    <text x="630" y="188" fill="#1D4ED8">②</text>
    <rect x="550" y="212" width="145" height="96" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="622" y="230" text-anchor="middle" font-family="monospace" fill="#1D4ED8">Account</text>
    <text x="560" y="252" font-family="monospace" fill="#0F172A">withdraw(long)</text>
    <text x="560" y="272" fill="#0F172A">đủ số dư? trừ tiền</text>
    <text x="560" y="292" fill="#047857">③ return true/false</text>
    <rect x="10" y="180" width="510" height="140" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="25" y="202" font-weight="bold" fill="#0F172A">Đọc hình theo thứ tự:</text>
    <text x="25" y="224" fill="#0F172A">• Biến có kiểu Account, nhưng object thật là SavingAccount.</text>
    <text x="25" y="246" fill="#0F172A">• JVM chạy bản withdraw của kiểu thật, tức bản đã ghi đè.</text>
    <text x="25" y="268" fill="#0F172A">• 100.000 − 60.000 = 40.000 &lt; 50.000 → dừng ở ①, trả false.</text>
    <text x="25" y="290" fill="#0F172A">• Khi qua được ①, super.withdraw (②) dùng lại logic của cha.</text>
    <text x="25" y="310" fill="#64748B">Vì sao JVM chọn theo kiểu thật lúc chạy: Bài 6 sẽ học kỹ.</text>
  </g>
</svg>

Lưu cả hai khối dưới đây vào **cùng một file** `OverrideDemo.java` (khối 1 rồi khối 2), chạy
`java OverrideDemo.java`:

```java
public class OverrideDemo {
    public static void main(String[] args) {
        Account binh = new Account("Bình", 200_000);
        SavingAccount an = new SavingAccount("An", 200_000, 6);

        System.out.println("Bình rút 180000: " + binh.withdraw(180_000));
        System.out.println("An rút 180000:   " + an.withdraw(180_000));
        System.out.println("An rút 100000:   " + an.withdraw(100_000));

        System.out.println(binh);
        System.out.println(an);

        // Biến kiểu Account, object thật là SavingAccount
        Account viaParent = an;
        System.out.println("Qua biến Account, rút 60000: " + viaParent.withdraw(60_000));
    }
}

class Account {
    private final String owner;
    private long balance;

    Account(String owner, long balance) {
        this.owner = owner;
        this.balance = balance;
    }

    public long getBalance() { return balance; }

    public boolean withdraw(long amount) {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }

    @Override
    public String toString() {
        return "Account[owner=" + owner + ", balance=" + balance + "]";
    }
}
```

```java
class SavingAccount extends Account {
    static final long MIN_BALANCE = 50_000;   // sổ tiết kiệm phải giữ tối thiểu 50.000 đồng
    private final int annualRatePercent;

    SavingAccount(String owner, long balance, int annualRatePercent) {
        super(owner, balance);
        this.annualRatePercent = annualRatePercent;
    }

    @Override
    public boolean withdraw(long amount) {
        if (getBalance() - amount < MIN_BALANCE) {
            return false;                    // luật riêng của sổ tiết kiệm
        }
        return super.withdraw(amount);       // phần còn lại: dùng lại bản của Account
    }

    @Override
    public String toString() {
        return "Saving" + super.toString() + " rate=" + annualRatePercent + "%";
    }
}
```

**Kết quả khi chạy:**

```text
Bình rút 180000: true
An rút 180000:   false
An rút 100000:   true
Account[owner=Bình, balance=20000]
SavingAccount[owner=An, balance=100000] rate=6%
Qua biến Account, rút 60000: false
```

**Giải thích từng bước:**

1. Bình (tài khoản thường) rút 180.000 từ 200.000: đủ số dư, `true`, còn 20.000.
2. An (sổ tiết kiệm) rút 180.000: 200.000 − 180.000 = 20.000 < 50.000, bản ghi đè trả `false` **ngay**,
   không gọi lên cha.
3. An rút 100.000: còn 100.000 ≥ 50.000, qua luật riêng, rồi `super.withdraw(amount)` chạy logic của `Account`
   để trừ tiền. Kết quả `true`.
4. `toString()` của `SavingAccount` dùng lại chuỗi của cha qua `super.toString()`, rồi nối thêm lãi suất.
5. Dòng cuối: biến `viaParent` có kiểu `Account`, nhưng object thật là `SavingAccount`. JVM chạy bản
   `withdraw` của **kiểu thật** của object, tức bản đã ghi đè, nên luật 50.000 vẫn được áp [15]. *Vì sao* JVM
   chọn như vậy lúc chạy là chủ đề của [Bài 6](/docs/learning/chang-2/binding-va-truyen-tham-so).

### ⚠️ Lỗi hay gặp

**Lỗi 1: tưởng ghi đè, thực ra là overload.** Viết nhầm kiểu tham số `int` thay vì `long` và không có
`@Override`. Code vẫn biên dịch:

```java
public class OverloadNotOverride {
    public static void main(String[] args) {
        Account an = new SavingAccount("An", 200_000);
        System.out.println("Rút 180000: " + an.withdraw(180_000));
        System.out.println(an.getBalance());
    }
}

class Account {
    private long balance;

    Account(String owner, long balance) {
        this.balance = balance;
    }

    public long getBalance() { return balance; }

    public boolean withdraw(long amount) {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }
}

class SavingAccount extends Account {
    SavingAccount(String owner, long balance) {
        super(owner, balance);
    }

    // Nhầm kiểu tham số: int thay vì long, và không ghi @Override
    public boolean withdraw(int amount) {
        if (getBalance() - amount < 50_000) {
            return false;
        }
        return super.withdraw(amount);
    }
}
```

```text
Rút 180000: true
20000
```

Luật 50.000 bị lách: số dư chỉ còn 20.000. `withdraw(int)` là một method **mới** (overload, Bài 2), còn
`withdraw(long)` của cha vẫn nguyên; gọi qua biến kiểu `Account` nên bản của cha chạy. Thêm `@Override` lên
`withdraw(int)` thì javac bắt lỗi ngay:

```text
OverloadWithAnnotation.java:32: error: method does not override or implement a method from a supertype
    @Override   // thêm vào để compiler kiểm tra
    ^
1 error
error: compilation failed
```

**Cách sửa:** luôn ghi `@Override` khi định ghi đè, rồi sửa tham số về đúng `long`.

**Lỗi 2: quên chữ `super.`** Trong bản ghi đè, viết `return withdraw(amount);` thay vì
`return super.withdraw(amount);`. Method tự gọi lại chính nó mãi:

```java
public class ForgotSuper {
    public static void main(String[] args) {
        SavingAccount an = new SavingAccount("An", 200_000);
        System.out.println(an.withdraw(10_000));
    }
}

class Account {
    private long balance;

    Account(String owner, long balance) {
        this.balance = balance;
    }

    public long getBalance() { return balance; }

    public boolean withdraw(long amount) {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }
}

class SavingAccount extends Account {
    SavingAccount(String owner, long balance) {
        super(owner, balance);
    }

    @Override
    public boolean withdraw(long amount) {
        if (getBalance() - amount < 50_000) {
            return false;
        }
        return withdraw(amount);   // quên "super." : tự gọi lại chính mình
    }
}
```

```text
Exception in thread "main" java.lang.StackOverflowError
	at SavingAccount.withdraw(ForgotSuper.java:36)
	at SavingAccount.withdraw(ForgotSuper.java:36)
...
```

(Rút gọn, thật ra có hàng nghìn dòng `at ...` giống nhau.) **Cách sửa:** gọi bản của cha bằng
`super.withdraw(amount)`.

## 5. Quy tắc ghi đè và `final`

**Ý tưởng nôm na.** Điều khoản riêng không được **lách** quy định chung: không được đổi tên dịch vụ (chữ
ký), không được **đóng bớt** quầy đang mở cho khách (thu hẹp quyền truy cập), và phải trả cho khách **đúng loại
giấy tờ** hoặc một loại cụ thể hơn (kiểu trả về). Có những điều khoản ngân hàng đóng dấu **"không được sửa
đổi"**: đó là `final`.

Bốn "cửa kiểm tra" javac áp cho mỗi method ghi đè:

1. **Chữ ký**: cùng tên, cùng danh sách kiểu tham số. Khác tham số là overload, không phải override [12].
2. **Quyền truy cập**: bản ghi đè phải cho phép **ít nhất bằng** bản của cha: cha `public` thì con phải
   `public`; cha `protected` thì con `protected` hoặc `public` [13][11]. Đây là lý do Bài 6 Chặng 1 bắt buộc
   viết `public String toString()`: `toString()` của `Object` là `public` [20].
3. **Kiểu trả về**: giống hệt; hoặc, với kiểu tham chiếu, được là **class con** của kiểu trả về gốc. Kiểu này
   gọi là **kiểu trả về hiệp biến** (*covariant return type*) [13][11].
4. **`final`**: method `final` không ghi đè được [16][18]; class `final` không kế thừa được [17][18]. Ví dụ
   có sẵn trong JDK: `String` là `final class` [19].

Thêm một ý: method `private` không được kế thừa nên cũng không "ghi đè" được [4][16]. Method `static` thì
có quy tắc riêng gọi là *hiding*, Bài 6 sẽ nói.

<svg viewBox="0 0 720 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bốn cửa kiểm tra mà javac áp cho một method ghi đè. Cửa 1, chữ ký: cùng tên và cùng danh sách kiểu tham số, ví dụ withdraw long; đổi sang withdraw int là overload chứ không phải override. Cửa 2, quyền truy cập: thang bốn bậc từ hẹp đến rộng là private, không ghi gì, protected, public; method ghi đè được giữ nguyên hoặc mở rộng sang phải, không được thu hẹp sang trái, ví dụ toString của Object là public nên bản ghi đè phải public. Cửa 3, kiểu trả về: giống hệt, hoặc với kiểu tham chiếu thì được là class con, gọi là covariant, ví dụ Account copy thành SavingAccount copy; đổi long thành int là lỗi. Cửa 4, final: method final không được ghi đè, class final không được kế thừa.">
  <defs>
    <marker id="c2b4-rules-ok" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#047857"/>
    </marker>
    <marker id="c2b4-rules-bad" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="345" height="160" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="25" y="34" font-size="13" font-weight="bold" fill="#1D4ED8">Cửa 1 · Chữ ký giống hệt</text>
    <text x="25" y="56" fill="#0F172A">Cùng tên + cùng danh sách kiểu tham số.</text>
    <text x="25" y="84" font-family="monospace" fill="#047857">✓ withdraw(long amount)</text>
    <text x="25" y="108" font-family="monospace" fill="#DC2626">✗ withdraw(int amount)</text>
    <text x="25" y="130" fill="#DC2626">→ thành overload (method mới),</text>
    <text x="25" y="150" fill="#DC2626">không phải override</text>
    <rect x="365" y="10" width="345" height="160" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="380" y="34" font-size="13" font-weight="bold" fill="#1D4ED8">Cửa 2 · Không thu hẹp quyền</text>
    <rect x="380" y="50" width="70" height="30" rx="4" fill="#FEF2F2" stroke="#94A3B8"/>
    <text x="415" y="70" text-anchor="middle" font-family="monospace" font-size="11" fill="#0F172A">private</text>
    <rect x="460" y="50" width="70" height="30" rx="4" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="495" y="70" text-anchor="middle" font-size="11" fill="#0F172A">(không ghi)</text>
    <rect x="540" y="50" width="76" height="30" rx="4" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="578" y="70" text-anchor="middle" font-family="monospace" font-size="11" fill="#0F172A">protected</text>
    <rect x="626" y="50" width="70" height="30" rx="4" fill="#ECFDF5" stroke="#94A3B8"/>
    <text x="661" y="70" text-anchor="middle" font-family="monospace" font-size="11" fill="#0F172A">public</text>
    <text x="380" y="98" fill="#64748B">hẹp</text>
    <text x="696" y="98" text-anchor="end" fill="#64748B">rộng</text>
    <line x1="470" y1="112" x2="640" y2="112" stroke="#047857" stroke-width="2" marker-end="url(#c2b4-rules-ok)"/>
    <text x="555" y="106" text-anchor="middle" fill="#047857">giữ nguyên hoặc mở rộng: ✓</text>
    <line x1="640" y1="130" x2="470" y2="130" stroke="#DC2626" stroke-width="2" marker-end="url(#c2b4-rules-bad)"/>
    <text x="555" y="148" text-anchor="middle" fill="#DC2626">thu hẹp: ✗ (weaker access)</text>
    <text x="380" y="164" fill="#0F172A">toString() của Object là public → bản ghi đè cũng public</text>
    <rect x="10" y="180" width="345" height="170" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="25" y="204" font-size="13" font-weight="bold" fill="#1D4ED8">Cửa 3 · Kiểu trả về tương thích</text>
    <text x="25" y="226" fill="#0F172A">Giống hệt, hoặc (với kiểu tham chiếu)</text>
    <text x="25" y="244" fill="#0F172A">là class con: “covariant”.</text>
    <text x="25" y="270" font-family="monospace" fill="#64748B">cha: Account copy()</text>
    <text x="25" y="290" font-family="monospace" fill="#047857">con: SavingAccount copy() ✓</text>
    <text x="25" y="314" font-family="monospace" fill="#64748B">cha: long getBalance()</text>
    <text x="25" y="334" font-family="monospace" fill="#DC2626">con: int getBalance()  ✗</text>
    <rect x="365" y="180" width="345" height="170" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="380" y="204" font-size="13" font-weight="bold" fill="#1D4ED8">Cửa 4 · Tôn trọng final</text>
    <rect x="380" y="218" width="315" height="54" rx="6" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="392" y="240" font-family="monospace" fill="#0F172A">public final String getOwner()</text>
    <text x="392" y="260" fill="#DC2626">→ class con không ghi đè được</text>
    <rect x="380" y="282" width="315" height="54" rx="6" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="392" y="304" font-family="monospace" fill="#0F172A">final class CheckingAccount</text>
    <text x="392" y="324" fill="#DC2626">→ không class nào extends được</text>
  </g>
</svg>

Ví dụ hợp lệ: `copy()` với kiểu trả về hiệp biến, và một method `final`:

```java
public class OverrideRules {
    public static void main(String[] args) {
        SavingAccount an = new SavingAccount("An", 1_000_000, 6);

        // copy() của SavingAccount trả về SavingAccount: không cần ép kiểu
        SavingAccount copied = an.copy();
        System.out.println(copied.getAnnualRatePercent() + "%");
        System.out.println(copied == an);          // hai object khác nhau

        System.out.println(an.getOwner());         // method final của Account
    }
}

class Account {
    private final String owner;
    private long balance;

    Account(String owner, long balance) {
        this.owner = owner;
        this.balance = balance;
    }

    // final: class con KHÔNG được ghi đè
    public final String getOwner() { return owner; }
    public long getBalance() { return balance; }

    public Account copy() {
        return new Account(owner, balance);
    }
}

class SavingAccount extends Account {
    private final int annualRatePercent;

    SavingAccount(String owner, long balance, int annualRatePercent) {
        super(owner, balance);
        this.annualRatePercent = annualRatePercent;
    }

    public int getAnnualRatePercent() { return annualRatePercent; }

    @Override
    public SavingAccount copy() {                  // kiểu trả về hẹp hơn: hợp lệ (covariant)
        return new SavingAccount(getOwner(), getBalance(), annualRatePercent);
    }
}
```

**Kết quả khi chạy:**

```text
6%
false
An
```

**Giải thích từng bước:**

1. `Account.copy()` trả về `Account`. `SavingAccount.copy()` ghi đè nó nhưng trả về `SavingAccount`, là
   class con của `Account`, nên hợp lệ (cửa 3).
2. Nhờ đó `SavingAccount copied = an.copy();` không cần ép kiểu, và gọi được ngay `getAnnualRatePercent()`.
3. `copied == an` là `false`: `copy()` tạo object mới bằng `new`.
4. `getOwner()` là `final`: mọi class con dùng chung **một** bản, không ai đổi được cách trả về chủ tài
   khoản.

### ⚠️ Lỗi hay gặp

Một file vi phạm cửa 2, 3 và 4 (cửa 1 đã gặp ở phần 4). Lưu hai khối vào cùng file
`BrokenRules.java`: dán khối 2 ngay sau khối 1, **cách nhau đúng một dòng trống** (để số dòng trong
thông báo lỗi khớp với bài). Rồi biên dịch bằng `javac -d out BrokenRules.java` (javac in đủ mọi lỗi một
lượt):

```java
public class BrokenRules {
    public static void main(String[] args) {
        System.out.println(new SavingAccount("An", 0));
    }
}

class Account {
    private final String owner;
    private long balance;

    Account(String owner, long balance) {
        this.owner = owner;
        this.balance = balance;
    }

    public final String getOwner() { return owner; }
    public long getBalance() { return balance; }
}
```

```java
class SavingAccount extends Account {
    SavingAccount(String owner, long balance) {
        super(owner, balance);
    }

    @Override
    protected String toString() {          // (1) thu hẹp quyền: public -> protected
        return "SavingAccount";
    }

    @Override
    public int getBalance() {              // (2) đổi kiểu trả về: long -> int
        return 0;
    }

    @Override
    public String getOwner() {             // (3) ghi đè method final
        return "?";
    }
}

final class CheckingAccount extends Account {
    CheckingAccount(String owner, long balance) {
        super(owner, balance);
    }
}

class VipCheckingAccount extends CheckingAccount {   // (4) kế thừa class final
    VipCheckingAccount(String owner, long balance) {
        super(owner, balance);
    }
}
```

```text
BrokenRules.java:47: error: cannot inherit from final CheckingAccount
class VipCheckingAccount extends CheckingAccount {   // (4) kế thừa class final
                                 ^
BrokenRules.java:26: error: toString() in SavingAccount cannot override toString() in Object
    protected String toString() {          // (1) thu hẹp quyền: public -> protected
                     ^
  attempting to assign weaker access privileges; was public
BrokenRules.java:31: error: getBalance() in SavingAccount cannot override getBalance() in Account
    public int getBalance() {              // (2) đổi kiểu trả về: long -> int
               ^
  return type int is not compatible with long
BrokenRules.java:30: error: method does not override or implement a method from a supertype
    @Override
    ^
BrokenRules.java:36: error: getOwner() in SavingAccount cannot override getOwner() in Account
    public String getOwner() {             // (3) ghi đè method final
                  ^
  overridden method is final
5 errors
```

Đọc từng lỗi:

- `attempting to assign weaker access privileges; was public`: cửa 2, thu hẹp `public` thành `protected`.
- `return type int is not compatible with long`: cửa 3. Kèm theo, `@Override` phía trên cũng báo
  `method does not override...` vì method sai kiểu trả về không ghi đè được gì.
- `overridden method is final`: cửa 4 với method.
- `cannot inherit from final CheckingAccount`: cửa 4 với class.

**Cách sửa:** giữ `public` cho `toString()`, giữ `long` cho `getBalance()`, bỏ bản ghi đè `getOwner()`, và
nếu thật sự cần class con thì bỏ `final` khỏi `CheckingAccount` (sau khi cân nhắc vì sao người viết đã khoá nó).
Tương tự, thử `class AccountCode extends String {}` sẽ nhận `error: cannot inherit from final String`.

## 6. Class `Object`: `toString`, `equals` và `hashCode`

**Ý tưởng nôm na.** Hai **phiếu chuyển tiền** cùng ghi "ACC-001" là hai tờ giấy khác nhau, nhưng cùng chỉ
**một** tài khoản. Phòng lưu trữ cất hồ sơ trong **tủ chia ngăn theo mã**: muốn tìm, mở đúng ngăn trước, rồi
so từng tờ trong ngăn. Nếu hai tờ cùng mã mà bị cất ở hai ngăn khác nhau, tìm mãi không thấy.

Mọi class đều thừa hưởng từ `Object` các method `toString()`, `equals(Object)`, `hashCode()` [20][21]:

- **`equals`** mặc định của `Object` chỉ trả `true` khi hai biến trỏ **cùng một object**, y như `==` [20].
  Muốn "bằng nhau theo nội dung" thì phải ghi đè [21].
- **`hashCode`** trả về một số nguyên, dùng cho bảng băm (*hash table*) như `HashMap`, `HashSet` [20][23].
- **Hợp đồng** (*contract*) trong tài liệu `Object` [20]: `equals` phải phản xạ, đối xứng, bắc cầu; và
  **hai object `equals` nhau thì `hashCode` phải bằng nhau** (ngược lại không bắt buộc). Vì vậy: ghi đè
  `equals` thì **phải** ghi đè cả `hashCode` [20][21].

<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="So sánh dấu bằng bằng và method equals. Trên stack có hai biến fromForm và fromDb, mỗi biến trỏ tới một object AccountId riêng trên heap, cả hai cùng có code bằng ACC-001. Phép fromForm bằng bằng fromDb so hai mũi tên tham chiếu: hai object khác nhau nên ra false. fromForm.equals fromDb, khi đã ghi đè, so nội dung field code: giống nhau nên ra true. Nếu không ghi đè, equals của Object cũng chỉ so tham chiếu như bằng bằng.">
  <defs>
    <marker id="c2b4-eq-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="170" height="160" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="95" y="32" text-anchor="middle" font-weight="bold" fill="#0F172A">Stack</text>
    <rect x="25" y="48" width="140" height="36" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="95" y="71" text-anchor="middle" font-family="monospace" fill="#1D4ED8">fromForm</text>
    <rect x="25" y="112" width="140" height="36" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="95" y="135" text-anchor="middle" font-family="monospace" fill="#1D4ED8">fromDb</text>
    <rect x="250" y="10" width="220" height="160" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="360" y="32" text-anchor="middle" font-weight="bold" fill="#0F172A">Heap</text>
    <rect x="270" y="44" width="180" height="44" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="360" y="62" text-anchor="middle" fill="#047857">object AccountId #1</text>
    <text x="360" y="80" text-anchor="middle" font-family="monospace" fill="#0F172A">code = "ACC-001"</text>
    <rect x="270" y="108" width="180" height="44" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="360" y="126" text-anchor="middle" fill="#047857">object AccountId #2</text>
    <text x="360" y="144" text-anchor="middle" font-family="monospace" fill="#0F172A">code = "ACC-001"</text>
    <line x1="165" y1="66" x2="264" y2="66" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b4-eq-arrow)"/>
    <line x1="165" y1="130" x2="264" y2="130" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b4-eq-arrow)"/>
    <rect x="490" y="10" width="220" height="74" rx="10" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="600" y="34" text-anchor="middle" font-family="monospace" fill="#0F172A">fromForm == fromDb</text>
    <text x="600" y="54" text-anchor="middle" fill="#0F172A">so hai mũi tên: khác object</text>
    <text x="600" y="74" text-anchor="middle" font-weight="bold" fill="#DC2626">false</text>
    <rect x="490" y="96" width="220" height="74" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="600" y="120" text-anchor="middle" font-family="monospace" fill="#0F172A">fromForm.equals(fromDb)</text>
    <text x="600" y="140" text-anchor="middle" fill="#0F172A">(đã ghi đè) so field code</text>
    <text x="600" y="160" text-anchor="middle" font-weight="bold" fill="#047857">true</text>
    <rect x="10" y="186" width="700" height="54" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="25" y="208" fill="#0F172A">Không ghi đè thì equals() của Object chỉ làm đúng việc của ==: so tham chiếu.</text>
    <text x="25" y="228" fill="#0F172A">Ghi đè equals() là tự định nghĩa “hai object này coi là một” theo nghiệp vụ.</text>
  </g>
</svg>

Ví dụ: danh sách tài khoản bị **phong toả** (*frozen*). `Set`/`HashSet` ở đây chỉ dùng như "tập hợp không
trùng", Chặng 3 học kỹ. Lưu thành `EqualsHashCodeDemo.java`:

```java
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class EqualsHashCodeDemo {
    public static void main(String[] args) {
        AccountId fromForm = new AccountId("ACC-001");    // mã khách điền trên phiếu
        AccountId fromDb = new AccountId("ACC-001");      // mã đọc từ sổ cái

        System.out.println(fromForm);                     // gọi toString()
        System.out.println(fromForm == fromDb);           // cùng một object?
        System.out.println(fromForm.equals(fromDb));      // cùng nội dung?
        System.out.println(fromForm.hashCode() == fromDb.hashCode());

        // Danh sách tài khoản bị phong toả (Set: tập hợp không trùng, chặng 3 học kỹ)
        Set<AccountId> frozen = new HashSet<>();
        frozen.add(fromDb);
        System.out.println("Bị phong toả? " + frozen.contains(fromForm));
    }
}

final class AccountId {
    private final String code;

    AccountId(String code) {
        this.code = code;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;                       // cùng object: chắc chắn bằng
        if (!(o instanceof AccountId)) return false;      // null hoặc khác loại: không bằng
        AccountId other = (AccountId) o;                  // ép kiểu tham chiếu về AccountId
        return code.equals(other.code);                   // so nội dung
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);                        // dùng ĐÚNG các field mà equals so
    }

    @Override
    public String toString() {
        return "AccountId[" + code + "]";
    }
}
```

**Kết quả khi chạy:**

```text
AccountId[ACC-001]
false
true
true
Bị phong toả? true
```

**Giải thích từng bước:**

1. `println(fromForm)` gọi `toString()` đã ghi đè: `AccountId[ACC-001]`.
2. `fromForm == fromDb` là `false`: hai lần `new`, hai object.
3. Trong `equals(Object o)`: nếu cùng object thì `true` luôn. `o instanceof AccountId` trả `false` khi `o` là
   `null` hoặc không phải `AccountId` [24]. Sau đó **ép kiểu tham chiếu** `(AccountId) o`: object không đổi,
   ta chỉ "nhìn" nó qua kiểu `AccountId` để đọc được `code`. Cuối cùng so nội dung `code`.
4. `hashCode()` dùng `Objects.hash(code)`, tính từ **đúng** field mà `equals` so sánh [22]. Hai object cùng mã
   nên cùng `hashCode`.
5. `HashSet` tìm theo hai bước (xem hình dưới), nên `contains(fromForm)` tìm thấy `fromDb`: `true`.
6. `AccountId` được đánh `final` (phần 5): đây là class giá trị nhỏ, không cần class con. Ở
   [Bài 7](/docs/learning/chang-2/enum-record-nested-class), `record` sẽ tự sinh cả ba method này.

Cơ chế tìm của `HashSet`, ở mức khái niệm (số ngăn trong hình chỉ để minh hoạ). `HashSet` được xây trên một
bảng băm [23]: `hashCode()` chọn ngăn, `equals()` so trong ngăn.

<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="HashSet tìm một phần tử qua hai bước, ở mức khái niệm. Bước 1: gọi hashCode để chọn ngăn, giống tủ hồ sơ chia ngăn. Bước 2: chỉ trong ngăn đó, gọi equals để so từng hồ sơ. Trường hợp đúng: ghi đè cả equals và hashCode, hai AccountId ACC-001 cho cùng hashCode nên rơi vào cùng ngăn, equals trả true, contains ra true. Trường hợp sai: chỉ ghi đè equals, hashCode vẫn là bản của Object nên hai object ACC-001 thường có hashCode khác nhau, HashSet tìm ở ngăn khác, không bao giờ gọi tới equals, contains ra false.">
  <defs>
    <marker id="c2b4-hash-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#1D4ED8"/>
    </marker>
    <marker id="c2b4-hash-bad" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="345" height="280" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="182" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#047857">✓ Ghi đè cả equals + hashCode</text>
    <rect x="25" y="46" width="160" height="30" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="105" y="66" text-anchor="middle" font-family="monospace" fill="#1D4ED8">contains(fromForm)</text>
    <line x1="105" y1="76" x2="105" y2="104" stroke="#1D4ED8" stroke-width="1.5" marker-end="url(#c2b4-hash-arrow)"/>
    <text x="115" y="95" fill="#1D4ED8">① hashCode() → ngăn 7</text>
    <rect x="25" y="110" width="70" height="120" rx="4" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="60" y="128" text-anchor="middle" fill="#64748B">ngăn 3</text>
    <rect x="105" y="110" width="110" height="120" rx="4" fill="#FFFFFF" stroke="#10B981" stroke-width="2"/>
    <text x="160" y="128" text-anchor="middle" fill="#047857" font-weight="bold">ngăn 7</text>
    <rect x="113" y="138" width="94" height="28" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="160" y="157" text-anchor="middle" font-family="monospace" font-size="11" fill="#0F172A">ACC-001</text>
    <rect x="225" y="110" width="70" height="120" rx="4" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="260" y="128" text-anchor="middle" fill="#64748B">ngăn 9</text>
    <text x="113" y="190" fill="#047857">② equals()</text>
    <text x="113" y="208" fill="#047857">→ true</text>
    <text x="25" y="256" fill="#0F172A">Cùng nội dung → cùng hashCode → đúng ngăn</text>
    <text x="25" y="276" font-weight="bold" fill="#047857">Kết quả: true</text>
    <rect x="365" y="10" width="345" height="280" rx="10" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="537" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#DC2626">✗ Chỉ ghi đè equals</text>
    <rect x="380" y="46" width="160" height="30" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="460" y="66" text-anchor="middle" font-family="monospace" fill="#1D4ED8">contains(fromForm)</text>
    <line x1="460" y1="76" x2="610" y2="104" stroke="#DC2626" stroke-width="1.5" marker-end="url(#c2b4-hash-bad)"/>
    <text x="550" y="70" fill="#DC2626">① hashCode() của Object</text>
    <rect x="380" y="110" width="110" height="120" rx="4" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="435" y="128" text-anchor="middle" fill="#64748B">ngăn 2</text>
    <rect x="388" y="138" width="94" height="28" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="435" y="157" text-anchor="middle" font-family="monospace" font-size="11" fill="#0F172A">ACC-001</text>
    <rect x="500" y="110" width="70" height="120" rx="4" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="535" y="128" text-anchor="middle" fill="#64748B">ngăn 4</text>
    <rect x="580" y="110" width="110" height="120" rx="4" fill="#FFFFFF" stroke="#DC2626" stroke-width="2"/>
    <text x="635" y="128" text-anchor="middle" fill="#DC2626" font-weight="bold">ngăn 6</text>
    <text x="635" y="170" text-anchor="middle" fill="#DC2626">trống:</text>
    <text x="635" y="188" text-anchor="middle" fill="#DC2626">equals() không</text>
    <text x="635" y="206" text-anchor="middle" fill="#DC2626">được gọi tới</text>
    <text x="380" y="256" fill="#0F172A">Hai object khác nhau → hashCode thường khác</text>
    <text x="380" y="276" font-weight="bold" fill="#DC2626">Kết quả: false (dù equals là true)</text>
  </g>
</svg>

### ⚠️ Lỗi hay gặp

**Lỗi 1: ghi đè `equals` mà quên `hashCode`.**

```java
import java.util.HashSet;
import java.util.Set;

public class EqualsWithoutHashCode {
    public static void main(String[] args) {
        AccountId fromForm = new AccountId("ACC-001");
        AccountId fromDb = new AccountId("ACC-001");

        System.out.println("equals: " + fromForm.equals(fromDb));

        Set<AccountId> frozen = new HashSet<>();
        frozen.add(fromDb);
        System.out.println("Bị phong toả? " + frozen.contains(fromForm));
    }
}

final class AccountId {
    private final String code;

    AccountId(String code) {
        this.code = code;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AccountId)) return false;
        AccountId other = (AccountId) o;
        return code.equals(other.code);
    }
    // QUÊN hashCode(): vẫn dùng bản của Object
}
```

```text
equals: true
Bị phong toả? false
```

`equals` nói "bằng nhau", nhưng `HashSet` không tìm thấy. `hashCode()` của `Object` cố trả số **khác nhau**
cho các object khác nhau "trong chừng mực thực tế" [20], nên hai object thường rơi vào hai ngăn khác nhau.
Khi soạn bài, chạy 5 lần đều ra `false`; nhưng kết quả này không được đảm bảo, nên đây là bug tiềm ẩn chứ không
phải hành vi để dựa vào.
**Cách sửa:** thêm `hashCode()` dùng đúng các field mà `equals` so.

**Lỗi 2: `equals(AccountId other)` thay vì `equals(Object o)`.**

```java
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

public class EqualsWrongParam {
    public static void main(String[] args) {
        AccountId fromForm = new AccountId("ACC-001");
        AccountId fromDb = new AccountId("ACC-001");

        System.out.println("equals: " + fromForm.equals(fromDb));

        Set<AccountId> frozen = new HashSet<>();
        frozen.add(fromDb);
        System.out.println("Bị phong toả? " + frozen.contains(fromForm));
    }
}

final class AccountId {
    private final String code;

    AccountId(String code) {
        this.code = code;
    }

    // Tham số là AccountId, không phải Object: đây là OVERLOAD, không phải override
    public boolean equals(AccountId other) {
        return other != null && code.equals(other.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(code);
    }
}
```

```text
equals: true
Bị phong toả? false
```

Gọi trực tiếp thì đúng, nhưng `HashSet` gọi `equals(Object)` của `Object`, nên vẫn `false`. Đây chính là ví dụ
kinh điển mà JLS dùng để giải thích vì sao có `@Override` [14]. Thêm `@Override` lên method này, javac báo
`error: method does not override or implement a method from a supertype`.
**Cách sửa:** tham số phải là `Object`, kèm `@Override`.

## 7. Java chỉ đơn kế thừa · ưu tiên composition

**Ý tưởng nôm na.** Một sổ tiết kiệm không thể cùng lúc tuân theo **hai bộ quy định chung** có thể mâu thuẫn
nhau (hai số dư, hai mức phí). Java chọn cách đơn giản: mỗi class có **đúng một cha trực tiếp**. Còn **khách
hàng** thì không phải là một tài khoản: khách hàng **có** tài khoản, giống một bìa hồ sơ khách kẹp nhiều sổ.

Trừ `Object`, mỗi class có **một và chỉ một** class cha trực tiếp: đó là **đơn kế thừa** (*single
inheritance*) [2][3]. Một lý do Java không cho `extends` nhiều class là tránh rắc rối khi kế thừa field (trạng
thái) từ nhiều cha [25][26]. Muốn một class mang nhiều "vai" thì dùng `interface` (Bài 5) [25].

**Composition** (ghép, quan hệ *has-a*) là khi một class **giữ object khác trong field** rồi nhờ chúng làm
việc, thay vì kế thừa chúng. Lời khuyên quen thuộc trong thiết kế hướng đối tượng là **ưu tiên composition hơn
kế thừa** khi mục đích chỉ là tái dùng code [27]. Kế thừa gắn chặt con với cha: cha đổi thì mọi
class con bị ảnh hưởng theo. Composition lỏng hơn và linh hoạt hơn [27]: `Customer` chỉ dựa vào việc `Account` có `getBalance()`, nên
ít bị kéo theo khi những phần khác của `Account` thay đổi.

<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bên trái: Java không cho một class extends hai class. SavingInsurance muốn extends cả Account và InsuranceProduct; cả hai cha đều có field balance và method fee, nên không rõ object nên có balance nào và fee của ai; javac báo lỗi. Bên phải: composition, quan hệ has-a. Customer không phải là một Account, Customer có một mảng Account, giữ tham chiếu tới object Account ACC-001 và object SavingAccount ACC-002; muốn tính tổng số dư thì Customer nhờ từng Account trả lời qua getBalance.">
  <defs>
    <marker id="c2b4-comp-tri" markerWidth="14" markerHeight="14" refX="11" refY="6" orient="auto">
      <path d="M0,0 L11,6 L0,12 Z" fill="#FFFFFF" stroke="#DC2626"/>
    </marker>
    <marker id="c2b4-comp-has" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#047857"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="345" height="280" rx="10" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="182" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#DC2626">✗ Hai cha: Java không cho phép</text>
    <rect x="25" y="48" width="140" height="66" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="95" y="68" text-anchor="middle" font-family="monospace" fill="#1D4ED8">Account</text>
    <text x="35" y="88" font-family="monospace" font-size="11" fill="#0F172A">long balance</text>
    <text x="35" y="104" font-family="monospace" font-size="11" fill="#0F172A">fee()</text>
    <rect x="200" y="48" width="140" height="66" rx="6" fill="#FFFFFF" stroke="#D97706"/>
    <text x="270" y="68" text-anchor="middle" font-family="monospace" font-size="11" fill="#D97706">InsuranceProduct</text>
    <text x="210" y="88" font-family="monospace" font-size="11" fill="#0F172A">long balance</text>
    <text x="210" y="104" font-family="monospace" font-size="11" fill="#0F172A">fee()</text>
    <rect x="105" y="176" width="155" height="34" rx="6" fill="#FFFFFF" stroke="#DC2626"/>
    <text x="182" y="198" text-anchor="middle" font-family="monospace" fill="#DC2626">SavingInsurance</text>
    <line x1="160" y1="176" x2="105" y2="117" stroke="#DC2626" stroke-width="1.5" marker-end="url(#c2b4-comp-tri)"/>
    <line x1="205" y1="176" x2="260" y2="117" stroke="#DC2626" stroke-width="1.5" marker-end="url(#c2b4-comp-tri)"/>
    <text x="182" y="150" text-anchor="middle" font-size="18" font-weight="bold" fill="#DC2626">?</text>
    <text x="182" y="236" text-anchor="middle" fill="#0F172A">balance nào? fee() của ai?</text>
    <text x="182" y="256" text-anchor="middle" fill="#0F172A">Mỗi class chỉ có một cha trực tiếp.</text>
    <text x="182" y="276" text-anchor="middle" font-family="monospace" fill="#DC2626">error: '{' expected</text>
    <rect x="365" y="10" width="345" height="280" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="537" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#047857">✓ Composition: Customer CÓ Account</text>
    <rect x="380" y="56" width="140" height="120" rx="6" fill="#FFFFFF" stroke="#10B981"/>
    <text x="450" y="76" text-anchor="middle" font-family="monospace" fill="#047857">Customer</text>
    <line x1="380" y1="86" x2="520" y2="86" stroke="#94A3B8"/>
    <text x="390" y="106" font-family="monospace" font-size="11" fill="#0F172A">name = "An"</text>
    <text x="390" y="126" font-family="monospace" font-size="11" fill="#0F172A">accounts[0] ●</text>
    <text x="390" y="146" font-family="monospace" font-size="11" fill="#0F172A">accounts[1] ●</text>
    <text x="390" y="166" font-family="monospace" font-size="11" fill="#64748B">totalBalance()</text>
    <rect x="565" y="62" width="130" height="50" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="630" y="82" text-anchor="middle" font-family="monospace" font-size="11" fill="#1D4ED8">Account</text>
    <text x="630" y="100" text-anchor="middle" font-family="monospace" font-size="11" fill="#0F172A">ACC-001</text>
    <rect x="565" y="126" width="130" height="50" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="630" y="146" text-anchor="middle" font-family="monospace" font-size="11" fill="#1D4ED8">SavingAccount</text>
    <text x="630" y="164" text-anchor="middle" font-family="monospace" font-size="11" fill="#0F172A">ACC-002</text>
    <line x1="490" y1="122" x2="559" y2="90" stroke="#047857" stroke-width="1.5" marker-end="url(#c2b4-comp-has)"/>
    <line x1="490" y1="142" x2="559" y2="150" stroke="#047857" stroke-width="1.5" marker-end="url(#c2b4-comp-has)"/>
    <text x="537" y="212" text-anchor="middle" fill="#0F172A">Customer giữ tham chiếu tới các Account</text>
    <text x="537" y="232" text-anchor="middle" fill="#0F172A">và nhờ chúng trả lời (getBalance).</text>
    <text x="537" y="262" text-anchor="middle" fill="#047857">“Khách hàng CÓ tài khoản” (has-a),</text>
    <text x="537" y="280" text-anchor="middle" fill="#047857">không phải “LÀ một tài khoản” (is-a)</text>
  </g>
</svg>

Thử `extends` hai class (hình bên trái chỉ minh hoạ vì sao, file thật để trống thân class):

```java
public class TwoParents {
    public static void main(String[] args) {
        System.out.println("không tới được đây");
    }
}

class Account {
}

class InsuranceProduct {
}

// Muốn vừa là tài khoản, vừa là sản phẩm bảo hiểm
class SavingInsurance extends Account, InsuranceProduct {
}
```

```text
TwoParents.java:14: error: '{' expected
class SavingInsurance extends Account, InsuranceProduct {
                                     ^
1 error
error: compilation failed
```

Còn đây là composition. Lưu hai khối vào cùng file `CompositionDemo.java`:

```java
public class CompositionDemo {
    public static void main(String[] args) {
        Customer an = new Customer("An");
        an.open(new Account("ACC-001", 2_000_000));
        an.open(new SavingAccount("ACC-002", 5_000_000, 6));

        System.out.println(an.getName() + " có " + an.countAccounts() + " tài khoản");
        System.out.println("Tổng số dư: " + an.totalBalance());
    }
}

// Customer CÓ tài khoản (has-a), chứ không LÀ một tài khoản
class Customer {
    private final String name;
    private final Account[] accounts = new Account[5];   // tối đa 5 tài khoản, cho gọn
    private int count = 0;

    Customer(String name) {
        this.name = name;
    }

    public String getName() { return name; }
    public int countAccounts() { return count; }

    public void open(Account account) {
        accounts[count] = account;   // giữ tham chiếu tới object Account
        count++;
    }

    public long totalBalance() {
        long total = 0;
        for (int i = 0; i < count; i++) {
            total += accounts[i].getBalance();   // nhờ từng Account trả lời
        }
        return total;
    }
}
```

```java
class Account {
    private final String id;
    private long balance;

    Account(String id, long balance) {
        this.id = id;
        this.balance = balance;
    }

    public long getBalance() { return balance; }
}

class SavingAccount extends Account {
    private final int annualRatePercent;

    SavingAccount(String id, long balance, int annualRatePercent) {
        super(id, balance);
        this.annualRatePercent = annualRatePercent;
    }
}
```

**Kết quả khi chạy:**

```text
An có 2 tài khoản
Tổng số dư: 7000000
```

**Giải thích từng bước:**

1. Ở bản `TwoParents`, javac dừng ngay ở dấu phẩy: cú pháp `extends` chỉ nhận **một** class.
2. `Customer` có field `accounts` là mảng `Account[]` (mảng ở Bài 5 Chặng 1). `open(...)` chỉ lưu
   **tham chiếu** tới object tài khoản.
3. `open(new SavingAccount(...))` hợp lệ vì sổ tiết kiệm **là một** `Account` (phần 1).
4. `totalBalance()` hỏi từng tài khoản `getBalance()` rồi cộng: 2.000.000 + 5.000.000 = 7.000.000.

Checklist trước khi gõ `extends`:

- [ ] Câu "X **là một loại** Y" nghe đúng theo nghiệp vụ, không chỉ đúng về code.
- [ ] Mọi method `public` của Y đều có nghĩa với X (rút tiền từ một *khách hàng* thì vô nghĩa).
- [ ] Bạn muốn X dùng được ở mọi chỗ đang dùng Y.
- [ ] Nếu chỉ muốn "mượn" vài method của Y: dùng composition.

### ⚠️ Lỗi hay gặp

**Kế thừa chỉ để mượn code.** `Customer extends Account` để có sẵn số dư và method `withdraw`. javac không báo
gì cả:

```java
public class CustomerExtendsAccount {
    public static void main(String[] args) {
        Customer an = new Customer("An", 2_000_000);
        an.withdraw(500_000);                  // "rút tiền từ khách hàng"?
        System.out.println(an.getName() + ": " + an.getBalance());
        // An mở thêm sổ tiết kiệm thì để số dư thứ hai ở đâu?
    }
}

class Account {
    private long balance;

    Account(long balance) {
        this.balance = balance;
    }

    public long getBalance() { return balance; }

    public boolean withdraw(long amount) {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }
}

// Kế thừa chỉ để "mượn" số dư và method withdraw
class Customer extends Account {
    private final String name;

    Customer(String name, long balance) {
        super(balance);
        this.name = name;
    }

    public String getName() { return name; }
}
```

```text
An: 1500000
```

Chạy được, nhưng mô hình sai: "rút 500.000 từ khách hàng An" là câu vô nghĩa, và khi An mở thêm sổ tiết kiệm
thì không có chỗ cho số dư thứ hai. **Cách sửa:** đổi sang composition như `CompositionDemo`: `Customer` **có**
mảng `Account`.

## Tóm tắt

- `class B extends A`: B thừa hưởng field/method không-`private` của A. Mỗi class có đúng một cha trực
  tiếp; không ghi `extends` thì cha là `Object`.
- Constructor không được kế thừa. Constructor của con gọi `super(...)`; không ghi thì javac chèn `super();`.
  Cha luôn được dựng xong trước con.
- Giữ field `private` ở cha, mở method `protected` có kiểm tra cho con. Ở package khác, `protected` chỉ dùng
  qua `this` hoặc biến kiểu class con.
- Ghi đè = cùng chữ ký, không thu hẹp quyền, kiểu trả về giống hoặc hiệp biến. Luôn ghi `@Override`.
- `super.method()` gọi bản của cha; quên `super.` dễ thành đệ quy vô hạn.
- `final` method không ghi đè được; `final` class không kế thừa được (ví dụ `String`).
- Ghi đè `equals(Object)` thì phải ghi đè `hashCode()` dùng cùng các field; nếu không, `HashSet` tìm sai.
- Kế thừa cho quan hệ *is-a*; quan hệ *has-a* thì dùng composition.

## Tự kiểm tra

**Câu 1.** (Mục tiêu 1) Chạy `new SavingAccount("An", 0, 6)` trong chương trình phần 2. Sắp xếp bốn dòng
log `(1)`…`(4)` theo đúng thứ tự in ra, và giải thích vì sao `(3)` không thể in trước `(2)`.

<details><summary>Đáp án</summary>

Thứ tự: `(1)` field initializer của `Account`, `(2)` thân constructor `Account`, `(3)` field initializer của
`SavingAccount`, `(4)` thân constructor `SavingAccount`. `super(...)` phải chạy **trọn** phần của cha (gồm
field initializer và thân constructor của cha) trước khi field initializer của con được chạy.

</details>

**Câu 2.** (Mục tiêu 1) `Account` chỉ có constructor `Account(String owner, long balance)`. Class
`CheckingAccount extends Account` **không viết constructor nào**. Có biên dịch được không? Vì sao?

<details><summary>Đáp án</summary>

**Không.** javac tạo constructor mặc định cho `CheckingAccount`, bên trong gọi `super();`. Nhưng `Account`
không có constructor không tham số, nên javac báo `constructor Account in class Account cannot be applied to
given types`. Sửa: viết constructor cho `CheckingAccount` và gọi `super(owner, balance)`.

</details>

**Câu 3.** (Mục tiêu 2) Trong `SavingAccount`, vì sao viết `return super.withdraw(amount);` mà không chép lại
đoạn kiểm tra `amount <= 0 || amount > balance` của `Account`?

<details><summary>Đáp án</summary>

Vì `balance` là `private` của `Account` (con không đụng tới được), và quan trọng hơn: logic kiểm tra chỉ
nên nằm **một chỗ**. Khi `Account.withdraw` được sửa lỗi, `SavingAccount` tự hưởng bản sửa. Đây chính là
bug trong phần Tình huống.

</details>

**Câu 4.** (Mục tiêu 2) Class con có `public boolean withdraw(int amount)` (không `@Override`), cha có
`withdraw(long)`. Gọi `Account a = new SavingAccount(...); a.withdraw(180_000);`: bản nào chạy? Thêm
`@Override` thì sao?

<details><summary>Đáp án</summary>

Bản `withdraw(long)` của **cha** chạy, vì `withdraw(int)` là overload, không ghi đè gì; luật riêng của con bị
bỏ qua. Thêm `@Override` thì javac báo `method does not override or implement a method from a supertype`,
bắt lỗi ngay lúc biên dịch.

</details>

**Câu 5.** (Mục tiêu 3) Mỗi bản ghi đè sau trong class con có hợp lệ không? Cha có `public Account copy()` và
`protected void addInterest(long)`.
(a) `public SavingAccount copy()`; (b) `void addInterest(long interest)` (không ghi gì);
(c) `public void addInterest(long interest)`.

<details><summary>Đáp án</summary>

(a) **Hợp lệ**: kiểu trả về hiệp biến (`SavingAccount` là con của `Account`). (b) **Lỗi**: thu hẹp từ
`protected` xuống package-private (`weaker access privileges`). (c) **Hợp lệ**: mở rộng từ `protected` lên
`public` được phép.

</details>

**Câu 6.** (Mục tiêu 3) Bạn cần cho `SavingAccount` (package khác) cộng lãi vào số dư. Chọn cách nào:
(a) đổi `balance` thành `protected`; (b) giữ `balance` `private`, thêm `protected void addInterest(long)`
có kiểm tra. Vì sao?

<details><summary>Đáp án</summary>

**(b).** Field `protected` cho **mọi** class con, ở mọi package, sửa thẳng số dư mà không qua kiểm tra nào,
phá bất biến "số dư không âm". Method `protected` chỉ mở một cửa hẹp, và cửa đó vẫn kiểm tra `interest > 0`.

</details>

**Câu 7.** (Mục tiêu 4) `AccountId` ghi đè `equals` (so `code`) nhưng không ghi đè `hashCode`. Thêm
`new AccountId("ACC-001")` vào `HashSet`, rồi `contains(new AccountId("ACC-001"))` thường trả gì? Giải thích
theo hai bước tìm của `HashSet`.

<details><summary>Đáp án</summary>

Thường là **`false`**. Bước 1, `HashSet` dùng `hashCode()` để chọn ngăn; `hashCode()` của `Object` thường
khác nhau cho hai object khác nhau, nên tìm ở ngăn khác. Bước 2 (`equals`) không bao giờ được gọi tới object
đã lưu. Vi phạm hợp đồng "`equals` nhau thì `hashCode` phải bằng nhau". Sửa: ghi đè `hashCode()` bằng
`Objects.hash(code)`.

</details>

**Câu 8.** (Mục tiêu 5) Với mỗi cặp, chọn `extends` hay composition: (a) `CheckingAccount` và `Account`;
(b) `Bank` và `Account`; (c) `Customer` và `Account`.

<details><summary>Đáp án</summary>

(a) `extends`: tài khoản thanh toán **là một loại** tài khoản. (b) Composition: ngân hàng **có** nhiều tài
khoản, ngân hàng không phải là một tài khoản. (c) Composition: khách hàng **có** tài khoản (như
`CompositionDemo`).

</details>

## Bài tập

**Bài 1 (dễ).** Viết `CheckingAccount extends Account` (dùng `Account` của phần 4) với field
`private final long overdraftLimit` (hạn mức thấu chi, ví dụ 1.000.000 đồng). Ghi đè `withdraw` cho phép số
dư âm tới `-overdraftLimit`, và ghi đè `toString()` có in hạn mức.

> 💡 Gợi ý: `balance` là `private` nên `super.withdraw` của `Account` sẽ từ chối khi rút quá số dư. Bạn cần một
> method `protected` trong `Account` để class con trừ tiền có kiểm tra (giống `addInterest` ở phần 3). Nhớ
> `@Override`.

**Bài 2 (vừa).** Thêm vào `Account` một method `public final String maskedOwner()` trả về chữ cái đầu của chủ
tài khoản kèm `***` (ví dụ `A***`). Thử ghi đè nó trong `SavingAccount` và đọc lỗi javac. Rồi giải thích bằng
lời: vì sao method này nên là `final`?

> 💡 Gợi ý: lỗi sẽ có cụm `overridden method is final`. Nghĩ về việc một class con "lỡ tay" in đầy đủ tên ra log.

**Bài 3 (khó hơn).** Viết class `Bank` dùng **composition**: giữ một `Set<AccountId>` (tạo bằng
`new HashSet<>()`) chứa các tài khoản bị phong toả, với hai method `void freeze(AccountId id)` và
`boolean isFrozen(AccountId id)`. Trong `main`, phong toả `new AccountId("ACC-007")`, rồi kiểm tra
`isFrozen` bằng một object `AccountId` **tạo mới** cùng mã (không phải object đã đưa vào set).

> 💡 Gợi ý: nếu kết quả kiểm tra phong toả luôn là "không bị phong toả", hãy xem lại `AccountId` đã ghi đè
> **cả** `equals` lẫn `hashCode` chưa (phần 6).

## Nguồn tham khảo

1. roadmap.sh: Java Developer Roadmap (Inheritance, Method Overriding). <https://roadmap.sh/java>
2. Oracle Java Tutorials: Inheritance. <https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html>
3. JLS SE 25, §8.1.4 Superclasses and Subclasses. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.4>
4. JLS SE 25, §8.2 Class Members. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.2>
5. JLS SE 25, §12.5 Creation of New Class Instances. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.5>
6. Oracle Java Tutorials: Using the Keyword super. <https://docs.oracle.com/javase/tutorial/java/IandI/super.html>
7. JLS SE 25, §8.8.7 Constructor Body. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.8.7>
8. JLS SE 25, §8.8.9 Default Constructor. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.8.9>
9. JEP 513: Flexible Constructor Bodies (Java 25). <https://openjdk.org/jeps/513>
10. JLS SE 25, §6.6.2 Details on protected Access. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-6.html#jls-6.6.2>
11. Oracle Java Tutorials: Overriding and Hiding Methods. <https://docs.oracle.com/javase/tutorial/java/IandI/override.html>
12. JLS SE 25, §8.4.8.1 Overriding (by Instance Methods). <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8.1>
13. JLS SE 25, §8.4.8.3 Requirements in Overriding and Hiding. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8.3>
14. JLS SE 25, §9.6.4.4 @Override. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html#jls-9.6.4.4>
15. JLS SE 25, §15.12.4.4 Locate Method to Invoke. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.4.4>
16. JLS SE 25, §8.4.3.3 final Methods. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.3.3>
17. JLS SE 25, §8.1.1.2 sealed, non-sealed, and final Classes. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.1.2>
18. Oracle Java Tutorials: Writing Final Classes and Methods. <https://docs.oracle.com/javase/tutorial/java/IandI/final.html>
19. Java SE 25 API: java.lang.String. <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/String.html>
20. Java SE 25 API: java.lang.Object (toString, equals, hashCode). <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html>
21. Oracle Java Tutorials: Object as a Superclass. <https://docs.oracle.com/javase/tutorial/java/IandI/objectclass.html>
22. Java SE 25 API: java.util.Objects (hash). <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Objects.html>
23. Java SE 25 API: java.util.HashSet. <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashSet.html>
24. JLS SE 25, §15.20.2 The instanceof Operator. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.20.2>
25. Oracle Java Tutorials: Multiple Inheritance of State, Implementation, and Type. <https://docs.oracle.com/javase/tutorial/java/IandI/multipleinheritance.html>
26. Jakob Jenkov: Java Inheritance. <https://jenkov.com/tutorials/java/inheritance.html>
27. Wikipedia: Composition over inheritance. <https://en.wikipedia.org/wiki/Composition_over_inheritance>

**Bài tiếp theo:** [Bài 5 · Trừu tượng và interface](/docs/learning/chang-2/truu-tuong-va-interface)
