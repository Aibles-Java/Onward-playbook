---
title: "Bài 1 · Package và Access Modifier"
description: "Gói các class ngân hàng vào đúng package, dùng import đúng cách, và kiểm soát ai được nhìn thấy field/method bằng 4 mức truy cập."
order: 21
tags: [java, chặng-2, oop, package, access-modifier]
language: vi
profile: onward-java-course
classification: public-safe
source_repo: none
source_refs:
  - https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.3
  - https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.5
  - https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.5.1
  - https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.5.2
  - https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.5.3
  - https://docs.oracle.com/javase/specs/jls/se21/html/jls-6.html#jls-6.6
  - https://docs.oracle.com/javase/specs/jls/se21/html/jls-6.html#jls-6.6.1
  - https://docs.oracle.com/javase/tutorial/java/package/packages.html
  - https://docs.oracle.com/javase/tutorial/java/package/managingfiles.html
  - https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html
  - https://jenkov.com/tutorials/java/packages.html
  - https://jenkov.com/tutorials/java/access-modifiers.html
  - https://roadmap.sh/java
verified_with: "openjdk 21.0.9"
verification: ran-locally
verification_note: "Đã chạy mọi chương trình và mọi ví dụ lỗi biên dịch bằng javac/java của openjdk 21.0.9 (/opt/homebrew/opt/openjdk@21/bin), dán output thật. Không có phần nào chỉ mô tả mà chưa chạy."
contract_version: 1
---

# Bài 1 · Package và Access Modifier

> 🎯 **Sau bài này bạn sẽ:**
> 1. Viết được một class nằm trong package, đặt đúng thư mục tương ứng, biên dịch bằng
>    `javac -d` và chạy bằng `java -cp` với tên class đầy đủ.
> 2. Dùng được cả ba cách gọi class ở package khác (import đơn, import wildcard, tên đầy đủ) và
>    giải thích được khi nào **bắt buộc** phải dùng tên đầy đủ.
> 3. Chỉ ra được, với mỗi field/method, ai được phép nhìn thấy nó trong 4 mức truy cập: `private`,
>    *package-private* (không ghi gì), `protected`, `public`.
> 4. Đọc hiểu và sửa được các lỗi biên dịch thường gặp: truy cập sai phạm vi, thiếu package khi
>    chạy, xung đột tên giữa hai package.

## Tình huống

Ngân hàng của bạn lớn dần. Đội "Tài khoản" và đội "Báo cáo" giờ viết code riêng, mỗi đội có hàng
chục class. Một hôm cả hai đội cùng đặt tên class là `Account`, và chương trình không còn biên
dịch được — trình biên dịch không biết bạn đang nói tới `Account` nào. Thêm vào đó, một bạn mới
thử đọc thẳng field `balance` từ một class khác và bị chặn bởi một thông báo lỗi khó hiểu. Bài này
giải quyết đúng hai vấn đề đó: gói code theo **package**, và kiểm soát quyền nhìn thấy bằng
**access modifier**.

**Cần biết trước:** [Bài 6 Chặng 1 · Nhập môn OOP](/docs/learning/chang-1/nhap-mon-oop) (class,
object, field, method, `private` cơ bản, quy tắc một `public class` mỗi file, biên dịch nhiều
file bằng `javac -d out *.java`).

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| Package (gói) | "Phòng ban" chứa các class liên quan, ánh xạ sang thư mục | `package vn.onward.bank;` |
| Import | Khai báo "tôi sẽ dùng class này của phòng khác" | `import vn.onward.bank.Account;` |
| Fully-qualified name (tên đầy đủ) | Tên class kèm trọn đường dẫn package | `vn.onward.bank.Account` |
| Classpath (`-cp`) | Nơi JVM tìm file `.class` khi chạy | `java -cp out vn.onward.app.Main` |
| Access modifier | Từ khoá quyết định ai được nhìn thấy field/method | `private`, `protected`, `public` |
| Package-private | Mức mặc định: không ghi từ khoá nào cả | `String branchCode;` |

## 1. Package: gói class theo thư mục

**Ý tưởng nôm na.** Một chi nhánh ngân hàng có nhiều phòng: phòng Tài khoản, phòng Báo cáo, mỗi
phòng có tủ hồ sơ riêng. **Package** (gói) làm đúng việc đó cho code: nhóm các class liên quan vào
một "tủ", và tên package phải khớp **chính xác** với đường dẫn thư mục chứa file `.java` đó [1].

<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Khai báo package vn.onward.bank trong file Account.java tương ứng với cây thư mục src/vn/onward/bank/Account.java. Mỗi dấu chấm trong tên package là một cấp thư mục con: vn, rồi onward, rồi bank. Bên phải là cây thư mục thật: src chứa thư mục vn, bên trong là thư mục onward, bên trong là thư mục bank, chứa file Account.java.">
  <defs>
    <marker id="c2b1-pkg-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="20" width="330" height="90" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="175" y="44" text-anchor="middle" font-weight="bold" fill="#1D4ED8">Dòng đầu file Account.java</text>
    <text x="175" y="72" text-anchor="middle" font-family="monospace" font-size="13" fill="#0F172A">package vn.onward.bank;</text>
    <text x="175" y="94" text-anchor="middle" fill="#64748B">mỗi dấu chấm = một cấp thư mục con</text>
    <line x1="345" y1="65" x2="385" y2="65" stroke="#64748B" stroke-width="2" marker-end="url(#c2b1-pkg-arrow)"/>
    <rect x="392" y="10" width="318" height="240" rx="8" fill="#FFFBEB" stroke="#D97706" stroke-dasharray="6 4"/>
    <text x="551" y="32" text-anchor="middle" font-weight="bold" fill="#D97706">Cây thư mục trên đĩa</text>
    <text x="412" y="58" font-family="monospace" fill="#0F172A">src/</text>
    <text x="432" y="82" font-family="monospace" fill="#0F172A">vn/</text>
    <text x="452" y="106" font-family="monospace" fill="#0F172A">onward/</text>
    <rect x="468" y="118" width="210" height="100" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="478" y="140" font-family="monospace" fill="#1D4ED8">bank/</text>
    <text x="494" y="164" font-family="monospace" fill="#0F172A">Account.java</text>
    <text x="494" y="186" font-family="monospace" fill="#64748B">package vn.onward.bank;</text>
    <text x="478" y="208" font-family="monospace" fill="#0F172A">AccountPrinter.java</text>
    <line x1="454" y1="76" x2="412" y2="52" stroke="#94A3B8" stroke-dasharray="3 3"/>
    <text x="551" y="238" text-anchor="middle" fill="#64748B">vn → onward → bank: 3 cấp, khớp vn.onward.bank</text>
  </g>
</svg>

Quy ước: tên package viết thường, thường bắt đầu bằng tên miền đảo ngược (`vn.onward...`) để
tránh trùng tên với package của người khác [8]. Đây là chương trình thật của bài, package
`vn.onward.bank`:

```java
// File: src/vn/onward/bank/Account.java
package vn.onward.bank;

public class Account {
    private long balance;          // private: chỉ chính class Account thấy được
    String branchCode;             // không ghi gì = package-private: cả package vn.onward.bank thấy
    protected String auditNote;    // protected: package này + lớp con sau này (Bài 4) thấy

    public Account(String branchCode, long openingBalance) {
        this.branchCode = branchCode;
        this.balance = Math.max(openingBalance, 0);
        this.auditNote = "chưa kiểm toán";
    }

    public boolean deposit(long amount) {
        if (amount <= 0) {
            return false;
        }
        balance += amount;
        return true;
    }

    public long getBalance() {
        return balance;
    }

    // package-private method: chỉ class cùng package vn.onward.bank gọi được
    String branchSummary() {
        return branchCode + ": " + balance + " đồng";
    }
}
```

**Giải thích từng bước:**

1. `package vn.onward.bank;` **phải là câu lệnh đầu tiên** có ý nghĩa trong file (chỉ comment được
   đứng trước nó) [1]. File này phải nằm ở `src/vn/onward/bank/Account.java`: ba cấp thư mục khớp
   ba phần của tên package.
2. Bốn field/method ở trên cố ý dùng **bốn mức truy cập khác nhau** để làm ví dụ xuyên suốt bài
   này — phần 4 sẽ giải thích kỹ từng mức.
3. `Account` là `public`, nên theo quy tắc đã học ở Chặng 1 Bài 6, tên file phải là `Account.java`.

### ⚠️ Lỗi hay gặp

**Đặt `import` hoặc code trước `package`.** `package` luôn phải đứng đầu file [1]:

```java
import vn.onward.bank.Account;
package vn.onward.app;

public class BadOrder {
    public static void main(String[] args) {
    }
}
```

```text
BadOrder.java:2: error: class, interface, enum, or record expected
package vn.onward.app;
^
1 error
```

**Cách sửa:** chuyển dòng `package ...;` lên trên cùng, `import` nằm ngay sau nó.

## 2. import: dùng class ở package khác

**Ý tưởng nôm na.** Muốn gọi điện sang phòng ban khác, bạn cần số máy lẻ đầy đủ. **Import** giống
như lưu một số tắt để khỏi phải gõ số đầy đủ mỗi lần. Nhưng nếu hai phòng ban cùng có một cái tên
("Account"), bạn buộc phải nói rõ "Account **của phòng nào**" — đó là **fully-qualified name** (tên
đầy đủ kèm package) [4].

<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ba cách dùng class ở package khác. Hàng 1, import đơn: import vn.onward.bank.Account cho phép viết tắt Account, chỉ nạp đúng một tên. Hàng 2, import wildcard: import vn.onward.bank.* cho phép dùng mọi class public trong package đó, gồm Account và AccountPrinter. Hàng 3, xung đột tên: import cả vn.onward.bank.* và vn.onward.report.* mà cả hai package đều có class Account khiến trình biên dịch báo reference to Account is ambiguous; cách sửa là viết tên đầy đủ fully-qualified name vn.onward.bank.Account.">
  <defs>
    <marker id="c2b1-imp-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="8" width="700" height="80" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="24" y="30" font-weight="bold" fill="#1D4ED8">1. Import đơn</text>
    <text x="24" y="52" font-family="monospace" fill="#0F172A">import vn.onward.bank.Account;</text>
    <line x1="280" y1="46" x2="320" y2="46" stroke="#64748B" marker-end="url(#c2b1-imp-arrow)"/>
    <text x="330" y="52" font-family="monospace" fill="#047857">Account acc = ...</text>
    <text x="24" y="74" fill="#64748B">chỉ nạp đúng MỘT tên: Account</text>
    <rect x="10" y="98" width="700" height="80" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="24" y="120" font-weight="bold" fill="#047857">2. Import wildcard (on-demand)</text>
    <text x="24" y="142" font-family="monospace" fill="#0F172A">import vn.onward.bank.*;</text>
    <line x1="260" y1="136" x2="300" y2="136" stroke="#64748B" marker-end="url(#c2b1-imp-arrow)"/>
    <text x="310" y="142" font-family="monospace" fill="#047857">Account, AccountPrinter ...</text>
    <text x="24" y="164" fill="#64748B">nạp mọi class public đang khai báo trong package đó</text>
    <rect x="10" y="188" width="700" height="124" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="24" y="210" font-weight="bold" fill="#DC2626">3. Xung đột tên giữa hai package</text>
    <text x="24" y="232" font-family="monospace" fill="#0F172A">import vn.onward.bank.*;  import vn.onward.report.*;</text>
    <text x="24" y="252" fill="#64748B">cả hai package đều có class tên Account</text>
    <rect x="24" y="262" width="330" height="22" rx="4" fill="#FFFFFF" stroke="#DC2626"/>
    <text x="34" y="278" font-family="monospace" font-size="11" fill="#DC2626">error: reference to Account is ambiguous</text>
    <line x1="360" y1="273" x2="400" y2="273" stroke="#64748B" marker-end="url(#c2b1-imp-arrow)"/>
    <text x="408" y="270" fill="#64748B">sửa bằng tên đầy đủ:</text>
    <text x="408" y="288" font-family="monospace" fill="#047857">vn.onward.bank.Account acc = ...</text>
  </g>
</svg>

Đây là class thứ hai cùng package `vn.onward.bank`, dùng để demo import wildcard:

```java
// File: src/vn/onward/bank/AccountPrinter.java (CÙNG package với Account)
package vn.onward.bank;

public class AccountPrinter {
    public static void printSummary(Account account) {
        // Gọi được branchSummary() vì AccountPrinter cùng package với Account
        System.out.println(account.branchSummary());
    }
}
```

Và đây là `Main`, ở một package khác, dùng **import đơn**:

```java
// File: src/vn/onward/app/Main.java (khác package với Account)
package vn.onward.app;

import vn.onward.bank.Account;        // import đơn: chỉ nạp tên Account
import vn.onward.bank.AccountPrinter;

public class Main {
    public static void main(String[] args) {
        Account acc = new Account("HN01", 500_000);
        acc.deposit(200_000);

        System.out.println("Số dư: " + acc.getBalance()); // public: gọi được
        AccountPrinter.printSummary(acc);                  // public static method ở class khác cùng gọi được
    }
}
```

**Kết quả khi chạy** (lệnh biên dịch/chạy đầy đủ ở phần 3):

```text
Số dư: 700000
HN01: 700000 đồng
```

Thay hai dòng `import` bằng **wildcard** cũng chạy y hệt:

```java
package vn.onward.app;

import vn.onward.bank.*; // wildcard: nạp mọi class public của package vn.onward.bank

public class MainWildcard {
    public static void main(String[] args) {
        Account acc = new Account("HN01", 300_000); // dùng được Account nhờ import *
        AccountPrinter.printSummary(acc);            // dùng được AccountPrinter cũng nhờ import *
    }
}
```

```text
HN01: 300000 đồng
```

**Giải thích từng bước:**

1. `import vn.onward.bank.Account;` chỉ cho phép viết tắt **đúng một** tên: `Account` [3].
2. `import vn.onward.bank.*;` nạp **mọi** class `public` khai báo trực tiếp trong package đó —
   không đi sâu vào package con [4]. Không có phí hiệu năng khi biên dịch hay chạy; đây chỉ là
   cách viết tắt cho trình biên dịch tra cứu.
3. Bạn **không cần** `import` để dùng `String`, `System`, `Math`: mọi thứ trong package
   `java.lang` được tự động import vào mọi file [5].
4. Khi phòng Báo cáo cũng có class `Account` (package `vn.onward.report`) và bạn `import` cả hai
   bằng wildcard, tên trơn `Account` trở nên **mơ hồ** (phần "Lỗi hay gặp" dưới đây).

### ⚠️ Lỗi hay gặp

**Wildcard từ hai package cùng có một tên class.** Phòng Báo cáo có `vn.onward.report.Account`
riêng, không liên quan `vn.onward.bank.Account`:

```java
package vn.onward.app;

import vn.onward.bank.*;
import vn.onward.report.*; // hai package cùng có class tên Account

public class ErrConflict {
    public static void main(String[] args) {
        Account acc = new Account("HN01", 100_000); // Account nào đây?
    }
}
```

```text
ErrConflict.java:8: error: reference to Account is ambiguous
        Account acc = new Account("HN01", 100_000); // Account nào đây?
        ^
  both class vn.onward.report.Account in vn.onward.report and class vn.onward.bank.Account in vn.onward.bank match
ErrConflict.java:8: error: reference to Account is ambiguous
        Account acc = new Account("HN01", 100_000); // Account nào đây?
                          ^
  both class vn.onward.report.Account in vn.onward.report and class vn.onward.bank.Account in vn.onward.bank match
2 errors
```

javac báo **hai lần** lỗi tương tự cho cùng một dòng: một lần cho `Account` bên trái (khai báo
kiểu biến), một lần cho `Account` bên phải (`new Account(...)`). Cả hai đều vì cùng một lý do.

**Cách sửa:** dùng **fully-qualified name** để nói rõ `Account` nào:

```java
package vn.onward.app;

import vn.onward.bank.*;
import vn.onward.report.*;

public class FixConflict {
    public static void main(String[] args) {
        // Dùng tên đầy đủ để nói rõ muốn Account nào
        vn.onward.bank.Account acc = new vn.onward.bank.Account("HN01", 100_000);
        vn.onward.report.Account report = new vn.onward.report.Account();

        System.out.println("Số dư: " + acc.getBalance());
        System.out.println(report.summaryLine());
    }
}
```

```text
Số dư: 100000
Dòng báo cáo trống
```

Import wildcard **không gây** lỗi này một mình — lỗi chỉ xảy ra khi bạn **thật sự dùng** cái tên mơ
hồ đó trong code.

## 3. Biên dịch và chạy chương trình có package

**Ý tưởng nôm na.** JVM giống nhân viên bảo vệ cần địa chỉ phòng ban **đầy đủ** mới dẫn khách đúng
chỗ. Thư mục output cũng phải giữ nguyên cấu trúc "phòng ban" đó.

<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Biên dịch và chạy chương trình có package. Các file nguồn nằm trong src, theo cây thư mục khớp tên package: src/vn/onward/bank/Account.java và src/vn/onward/app/Main.java. Lệnh javac -d out rồi liệt kê các file .java biên dịch tất cả, ghi file .class vào thư mục out, giữ nguyên cấu trúc package: out/vn/onward/bank/Account.class và out/vn/onward/app/Main.class. Lệnh java -cp out vn.onward.app.Main chạy method main của class Main, dùng tên class đầy đủ kèm package, không phải chỉ Main.">
  <defs>
    <marker id="c2b1-compile-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="190" height="110" rx="8" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="105" y="30" text-anchor="middle" font-weight="bold" fill="#0F172A">src/ (mã nguồn)</text>
    <text x="22" y="52" font-family="monospace" font-size="11" fill="#64748B">vn/onward/bank/</text>
    <text x="34" y="70" font-family="monospace" font-size="11" fill="#0F172A">Account.java</text>
    <text x="22" y="90" font-family="monospace" font-size="11" fill="#64748B">vn/onward/app/</text>
    <text x="34" y="108" font-family="monospace" font-size="11" fill="#0F172A">Main.java</text>
    <rect x="218" y="40" width="190" height="50" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="313" y="60" text-anchor="middle" font-family="monospace" fill="#1D4ED8">javac -d out</text>
    <text x="313" y="78" text-anchor="middle" font-size="11" fill="#64748B">...*.java (cả 2 file)</text>
    <line x1="200" y1="65" x2="214" y2="65" stroke="#64748B" marker-end="url(#c2b1-compile-arrow)"/>
    <rect x="426" y="10" width="190" height="130" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="521" y="30" text-anchor="middle" font-weight="bold" fill="#D97706">out/ (giữ cấu trúc package)</text>
    <text x="438" y="52" font-family="monospace" font-size="11" fill="#64748B">vn/onward/bank/</text>
    <text x="450" y="70" font-family="monospace" font-size="11" fill="#0F172A">Account.class</text>
    <text x="438" y="90" font-family="monospace" font-size="11" fill="#64748B">vn/onward/app/</text>
    <text x="450" y="108" font-family="monospace" font-size="11" fill="#0F172A">Main.class</text>
    <line x1="412" y1="65" x2="422" y2="65" stroke="#64748B" marker-end="url(#c2b1-compile-arrow)"/>
    <rect x="200" y="166" width="320" height="70" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="360" y="192" text-anchor="middle" font-family="monospace" fill="#047857">java -cp out vn.onward.app.Main</text>
    <text x="360" y="214" text-anchor="middle" font-size="11" fill="#64748B">tên class ĐẦY ĐỦ kèm package, không chỉ "Main"</text>
    <line x1="521" y1="140" x2="440" y2="164" stroke="#64748B" marker-end="url(#c2b1-compile-arrow)"/>
    <text x="360" y="252" text-anchor="middle" fill="#DC2626">java -cp out Main (thiếu package) → Could not find or load main class Main</text>
  </g>
</svg>

Đặt hai file đúng cây thư mục trong phần 1, rồi chạy:

```text
$ javac -d out src/vn/onward/bank/Account.java src/vn/onward/bank/AccountPrinter.java src/vn/onward/app/Main.java
$ find out -type f
out/vn/onward/app/Main.class
out/vn/onward/bank/Account.class
out/vn/onward/bank/AccountPrinter.class
$ java -cp out vn.onward.app.Main
Số dư: 700000
HN01: 700000 đồng
```

**Giải thích từng bước:**

1. `javac -d out ...` biên dịch mọi file được liệt kê, rồi ghi `.class` vào `out`, **giữ nguyên**
   cấu trúc package (`out/vn/onward/bank/Account.class`, không phải `out/Account.class`).
2. `java -cp out vn.onward.app.Main`: `-cp out` bảo JVM tìm `.class` trong `out`;
   `vn.onward.app.Main` là **tên class đầy đủ kèm package**, không chỉ `Main`.
3. Vì đã có package, lệnh `java File.java` chạy trực tiếp từ nguồn (Chặng 1 chưa dùng tới) vẫn
   hoạt động nếu đường dẫn file khớp package, nhưng với nhiều file như ở đây, cách chắc chắn nhất
   vẫn là `javac` + `java -cp`.

### ⚠️ Lỗi hay gặp

**Quên ghi package khi chạy `java`.** JVM tìm đúng tên class, không tự "đoán" package:

```text
$ java -cp out Main
Error: Could not find or load main class Main
Caused by: java.lang.ClassNotFoundException: Main
```

**Cách sửa:** gõ đủ `java -cp out vn.onward.app.Main`. Thông báo `ClassNotFoundException` gần như
luôn có nghĩa là bạn thiếu package hoặc gõ sai `-cp`.

## 4. Access modifier: ai được nhìn thấy field/method

**Ý tưởng nôm na.** Một tài khoản có nhiều lớp bảo vệ, từ két sắt riêng tới quầy tiếp công khai.
Java có đúng **4 mức truy cập**, từ hẹp tới rộng: `private` (chỉ chính class), *package-private*
— không ghi từ khoá nào cả — (cùng package), `protected` (cùng package + lớp con ở package khác,
Bài 4 sẽ dùng), và `public` (ai cũng thấy) [6][7].

<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bốn vòng phạm vi truy cập, từ hẹp ra rộng. Vòng trong cùng, private, chỉ chính class Account thấy field balance. Vòng kế, không ghi gì tức package-private, cả package vn.onward.bank thấy field branchCode, ví dụ class AccountPrinter cùng package gọi được branchSummary. Vòng kế nữa, protected, thêm cả lớp con ở package khác thấy field auditNote, ví dụ SavingAccount ở Bài 4 sẽ kế thừa và thấy được. Vòng ngoài cùng, public, ai cũng thấy được method deposit và getBalance, kể cả class Main ở package vn.onward.app.">
  <defs>
    <marker id="c2b1-acc-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="440" height="300" rx="160" fill="#ECFDF5" stroke="#10B981"/>
    <text x="230" y="30" text-anchor="middle" font-weight="bold" fill="#047857">public: ai cũng thấy</text>
    <rect x="50" y="48" width="360" height="232" rx="120" fill="#FFFBEB" stroke="#D97706"/>
    <text x="230" y="66" text-anchor="middle" font-weight="bold" fill="#D97706">protected: package này + lớp con nơi khác</text>
    <rect x="90" y="86" width="280" height="166" rx="90" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="230" y="104" text-anchor="middle" font-weight="bold" fill="#1D4ED8">package-private: cả package vn.onward.bank</text>
    <rect x="140" y="122" width="180" height="92" rx="20" fill="#FFFFFF" stroke="#64748B"/>
    <text x="230" y="142" text-anchor="middle" font-weight="bold" fill="#0F172A">private</text>
    <text x="230" y="162" text-anchor="middle" font-family="monospace" font-size="11" fill="#0F172A">balance</text>
    <text x="230" y="180" text-anchor="middle" fill="#64748B" font-size="11">chỉ Account</text>
    <text x="230" y="196" text-anchor="middle" fill="#64748B" font-size="11">thấy được</text>
    <text x="230" y="232" text-anchor="middle" font-family="monospace" font-size="11" fill="#1D4ED8">branchCode, branchSummary()</text>
    <text x="230" y="250" text-anchor="middle" font-size="11" fill="#1D4ED8">AccountPrinter (cùng package) gọi được</text>
    <text x="230" y="275" text-anchor="middle" font-family="monospace" font-size="11" fill="#D97706">auditNote</text>
    <text x="230" y="293" text-anchor="middle" font-size="11" fill="#D97706">SavingAccount (Bài 4) sẽ thấy được</text>
    <text x="230" y="307" text-anchor="middle" font-family="monospace" font-size="11" fill="#047857">deposit(), getBalance()</text>
    <rect x="470" y="60" width="240" height="200" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="590" y="82" text-anchor="middle" font-weight="bold" fill="#0F172A">Main (package vn.onward.app)</text>
    <text x="482" y="108" font-family="monospace" font-size="11" fill="#047857">acc.deposit(...)  OK</text>
    <text x="482" y="130" font-family="monospace" font-size="10.5" fill="#DC2626">acc.balance → lỗi biên dịch</text>
    <text x="482" y="152" font-family="monospace" font-size="10.5" fill="#DC2626">acc.branchSummary() → lỗi</text>
    <text x="482" y="174" font-family="monospace" font-size="10.5" fill="#DC2626">acc.auditNote = ... → lỗi</text>
    <text x="482" y="200" font-size="11" fill="#64748B">khác package, không phải lớp con</text>
    <text x="482" y="218" font-size="11" fill="#64748B">nên chỉ vòng public lọt tới đây</text>
    <line x1="410" y1="160" x2="466" y2="160" stroke="#64748B" stroke-width="2" marker-end="url(#c2b1-acc-arrow)"/>
  </g>
</svg>

Bảng dưới là quy tắc chính xác theo JLS 6.6.1, áp cho field/method của class `Account` ở phần 1
[7]:

| Mức truy cập | Cùng class | Cùng package | Lớp con, khác package | Mọi nơi khác |
|---|---|---|---|---|
| `private` | ✓ | ✗ | ✗ | ✗ |
| *(không ghi gì)* | ✓ | ✓ | ✗ | ✗ |
| `protected` | ✓ | ✓ | ✓ | ✗ |
| `public` | ✓ | ✓ | ✓ | ✓ |

`Main` ở phần 2–3 nằm trong package `vn.onward.app`, **khác package** với `Account` và **không
phải lớp con**, nên chỉ cột `public` cho phép nó đi qua. Ba thí nghiệm dưới đây chứng minh đúng ba
dòng còn lại của bảng.

**Thí nghiệm 1 — chạm `private` từ ngoài:**

```java
package vn.onward.app;

import vn.onward.bank.Account;

public class ErrPrivate {
    public static void main(String[] args) {
        Account acc = new Account("HN01", 500_000);
        acc.balance = 1_000_000; // balance là private trong Account
    }
}
```

```text
ErrPrivate.java:8: error: balance has private access in Account
        acc.balance = 1_000_000; // balance là private trong Account
           ^
1 error
```

**Thí nghiệm 2 — chạm package-private từ khác package:**

```java
package vn.onward.app;

import vn.onward.bank.Account;

public class ErrPackage {
    public static void main(String[] args) {
        Account acc = new Account("HN01", 500_000);
        System.out.println(acc.branchSummary()); // branchSummary() package-private
    }
}
```

```text
ErrPackage.java:8: error: branchSummary() is not public in Account; cannot be accessed from outside package
        System.out.println(acc.branchSummary()); // branchSummary() package-private
                              ^
1 error
```

Nhưng gọi đúng từ **cùng package** (như `AccountPrinter` ở phần 2) thì chạy bình thường — đó là
lý do `AccountPrinter.printSummary(acc)` ở phần 2 in ra được `branchSummary()`.

**Thí nghiệm 3 — chạm `protected` từ khác package, không phải lớp con:**

```java
package vn.onward.app;

import vn.onward.bank.Account;

public class ErrProtected {
    public static void main(String[] args) {
        Account acc = new Account("HN01", 500_000);
        acc.auditNote = "đã kiểm tra"; // protected, khác package, không phải lớp con
    }
}
```

```text
ErrProtected.java:8: error: auditNote has protected access in Account
        acc.auditNote = "đã kiểm tra"; // protected, khác package, không phải lớp con
           ^
1 error
```

`protected` sẽ "mở khoá" đúng trong trường hợp `SavingAccount extends Account` ở package khác —
Bài 4 sẽ quay lại thí nghiệm này.

**Giải thích từng bước:**

1. Cả ba lỗi trên đều do **`Main`/`ErrPrivate`/... nằm khác package và không phải lớp con** của
   `Account`. Theo bảng, chỉ `public` mới lọt qua được tổ hợp này.
2. Thông báo lỗi của javac luôn nói rõ **mức truy cập** (`private access`, `protected access`,
   hoặc `is not public ... cannot be accessed from outside package`) — đọc đúng cụm này là biết
   ngay cần sửa gì.
3. Đổi một field/method lên mức rộng hơn (ví dụ `private` → `public`) sẽ hết lỗi, nhưng **không
   phải lúc nào cũng nên làm vậy** — mục đích của `private` chính là chặn truy cập tuỳ tiện
   (Chặng 1 Bài 6 đã nói tới encapsulation; Bài 2 học kỹ).

### ⚠️ Lỗi hay gặp

**Tưởng top-level class cũng dùng được `private`/`protected`.** Hai từ khoá này chỉ hợp lệ cho
field/method hoặc *nested class* (chặng 2 Bài 7 sẽ học); một class khai báo trực tiếp trong file
chỉ được `public` hoặc package-private:

```java
package vn.onward.bank;

private class ErrTopClass {
}
```

```text
ErrTopClass.java:3: error: modifier private not allowed here
private class ErrTopClass {
        ^
1 error
```

**Cách sửa:** bỏ `private`, để package-private (không ghi gì) hoặc `public`.

## Tóm tắt

- **Package** nhóm các class liên quan; tên package phải khớp **chính xác** đường dẫn thư mục
  chứa file. `package ...;` luôn là dòng đầu tiên có ý nghĩa của file.
- **import đơn** nạp một tên; **import wildcard** (`*`) nạp mọi class `public` trực tiếp trong
  package đó; `java.lang` được tự động import, không cần khai báo.
- Hai package cùng có một tên class → tên trơn bị **mơ hồ**; chỉ cần dùng tới mới lỗi; sửa bằng
  **fully-qualified name**.
- Biên dịch bằng `javac -d out ...`, chạy bằng `java -cp out <package>.<Class>` — thiếu package
  khi chạy sẽ ra `ClassNotFoundException`.
- Bốn mức truy cập theo thứ tự hẹp → rộng: `private` < package-private (không ghi gì) < `protected`
  < `public`. Thông báo lỗi của javac luôn nêu rõ mức truy cập đang chặn bạn.
- Top-level class chỉ được `public` hoặc package-private, không thể `private`/`protected`.

## Tự kiểm tra

**Câu 1.** (Mục tiêu 1) File khai báo `package vn.onward.bank;` thì phải nằm ở đường dẫn thư mục
nào, tính từ thư mục gốc `src`?

<details><summary>Đáp án</summary>

`src/vn/onward/bank/`. Mỗi dấu chấm trong tên package là một cấp thư mục con.

</details>

**Câu 2.** (Mục tiêu 1) Sau khi `javac -d out ...` thành công, lệnh nào chạy đúng class `Main` nằm
trong package `vn.onward.app`?

<details><summary>Đáp án</summary>

`java -cp out vn.onward.app.Main`. Phải dùng tên class **đầy đủ kèm package**; `java -cp out Main`
sẽ báo `Could not find or load main class Main`.

</details>

**Câu 3.** (Mục tiêu 2) `import vn.onward.bank.*;` khác `import vn.onward.bank.Account;` ở điểm
nào?

<details><summary>Đáp án</summary>

Import đơn chỉ nạp đúng một tên (`Account`). Import wildcard nạp mọi class `public` khai báo trực
tiếp trong package `vn.onward.bank` (ví dụ cả `Account` lẫn `AccountPrinter`), không ảnh hưởng tốc
độ biên dịch hay chạy.

</details>

**Câu 4.** (Mục tiêu 2) Hai package cùng có class tên `Report`. Bạn `import` cả hai bằng wildcard
rồi viết `Report r = new Report();`. Chuyện gì xảy ra, và sửa thế nào?

<details><summary>Đáp án</summary>

Biên dịch lỗi `reference to Report is ambiguous`, vì trình biên dịch không biết chọn `Report` của
package nào. Sửa bằng tên đầy đủ, ví dụ `vn.onward.bank.Report r = new vn.onward.bank.Report();`.

</details>

**Câu 5.** (Mục tiêu 3) Field không ghi access modifier nào (package-private) thì class nào được
phép đọc nó trực tiếp?

<details><summary>Đáp án</summary>

Mọi class nằm **cùng package** với class khai báo field đó — kể cả khi chúng không có quan hệ kế
thừa gì. Class ở package khác thì không, dù có là lớp con cũng không (muốn thế phải dùng
`protected`).

</details>

**Câu 6.** (Mục tiêu 4) Chạy `java -cp out Main` (thay vì `java -cp out vn.onward.app.Main`) cho
một chương trình có package thì xảy ra lỗi gì, và vì sao?

<details><summary>Đáp án</summary>

`Error: Could not find or load main class Main`, kèm `ClassNotFoundException: Main`. Vì sau khi
biên dịch, class thật sự tên là `vn.onward.app.Main`, không phải `Main` trơn; JVM tìm đúng cái tên
bạn gõ nên không thấy.

</details>

**Câu 7.** (Mục tiêu 4) Đoạn code `acc.auditNote = "x";` viết trong một class ở package khác,
không kế thừa `Account`, báo lỗi gì? Field `auditNote` đang khai báo mức truy cập nào?

<details><summary>Đáp án</summary>

Lỗi `auditNote has protected access in Account`. Field đó là `protected`: cho phép cùng package và
lớp con ở package khác, nhưng class trong tình huống này không thuộc cả hai nhóm đó nên bị chặn.

</details>

## Bài tập

**Bài 1 (dễ).** Tạo thêm package `vn.onward.notify` với một class `public class Notifier` có
method `public static void send(String message)` chỉ in `message` ra màn hình. Từ `Main`
(`vn.onward.app`), `import` và gọi `Notifier.send("Da nap tien")` sau khi `deposit` (dùng chuỗi
không dấu để tránh lệch mã hoá khi copy lệnh).

> 💡 Gợi ý: nhớ đặt file đúng thư mục `src/vn/onward/notify/Notifier.java`, rồi thêm file đó vào
> lệnh `javac -d out ...`.

**Bài 2 (vừa).** Thêm vào `Account` một method package-private
`boolean sameBranch(Account other)` so sánh `branchCode`. Viết một class thử nghiệm **cùng
package** `vn.onward.bank` gọi được method này, và một class **khác package** cố gọi để tự quan
sát lỗi biên dịch thật.

> 💡 Gợi ý: copy lại đúng cấu trúc của `ErrPackage.java` ở phần 4, chỉ đổi tên method.

**Bài 3 (khó hơn).** Tạo hai package `vn.onward.audit` và `vn.onward.legacy`, mỗi package có một
class tên `Report` với nội dung khác nhau. Viết một `Main` thứ ba import cả hai bằng wildcard, cố
tình gây ra lỗi `ambiguous`, chụp lại thông báo lỗi thật, rồi sửa bằng fully-qualified name cho cả
hai biến.

> 💡 Gợi ý: làm giống hệt cặp `ErrConflict.java` / `FixConflict.java` ở phần 2, chỉ đổi tên
> package và class.

## Nguồn tham khảo

1. JLS SE 21, §7.3 Compilation Units. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.3>
2. JLS SE 21, §7.5 Import Declarations. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.5>
3. JLS SE 21, §7.5.1 Single-Type-Import Declarations. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.5.1>
4. JLS SE 21, §7.5.2 Type-Import-on-Demand Declarations. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.5.2>
5. JLS SE 21, §7.5.3 Automatic Imports. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.5.3>
6. JLS SE 21, §6.6 Access Control. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-6.html#jls-6.6>
7. JLS SE 21, §6.6.1 Determining Accessibility. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-6.html#jls-6.6.1>
8. Oracle: Creating and Using Packages (The Java Tutorials). <https://docs.oracle.com/javase/tutorial/java/package/packages.html>
9. Oracle: Managing Source and Class Files (The Java Tutorials). <https://docs.oracle.com/javase/tutorial/java/package/managingfiles.html>
10. Oracle: Controlling Access to Members of a Class (The Java Tutorials). <https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html>
11. Jakob Jenkov: Java Packages. <https://jenkov.com/tutorials/java/packages.html>
12. Jakob Jenkov: Java Access Modifiers. <https://jenkov.com/tutorials/java/access-modifiers.html>
13. roadmap.sh: Java Developer Roadmap, mục *Basics of OOP* (Packages, Access Specifiers). <https://roadmap.sh/java>

**Bài tiếp theo:** [Bài 2 · Đóng gói và method](/docs/learning/chang-2/dong-goi-va-method)
