---
title: "Bài 8 · Checkpoint: mô hình tài khoản ngân hàng"
description: "Bài tổng hợp Chặng 2: dựng một project Java nhiều file trong package vn.onward.bank gồm Account trừu tượng, SavingAccount, CheckingAccount, record Transaction và enum TransactionStatus, chạy nạp/rút/chuyển có lịch sử, rồi giải thích vì sao Java luôn pass-by-value."
order: 28
tags: [java, chặng-2, oop, checkpoint, abstract, record, enum, pass-by-value]
language: vi
profile: onward-java-course
classification: public-safe
source_repo: none
source_refs:
  - https://roadmap.sh/java
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/math/BigDecimal.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-7.html#jls-7.4
  - https://docs.oracle.com/en/java/javase/25/docs/specs/man/javac.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.9
  - https://docs.oracle.com/en/java/javase/25/docs/specs/man/java.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-7.html#jls-7.1
  - https://openjdk.org/jeps/395
  - https://docs.oracle.com/en/java/javase/25/docs/specs/man/javap.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.10
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Record.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.4.2
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.3.3
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.4.4
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-6.html#jls-6.6
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/List.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.1.1
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html#jls-9.6.4.4
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8
  - https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.1
  - https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.4.5
  - https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html
  - https://openjdk.org/jeps/394
verified_with: "openjdk 21.0.9"
verification: ran-locally
verification_note: "Đã chạy bằng JDK 21.0.9 (/opt/homebrew/opt/openjdk@21/bin): project 9 file trong package vn.onward.bank và vn.onward.bank.app, biên dịch javac -d out, chạy 4 chương trình (TransactionPreview, AccountTypesDemo, BankDemo, PassByValueLab) bằng java -cp out; 3 lần javap (-p Transaction, Account, -p Account); 13 ví dụ lỗi (7 lỗi biên dịch, 1 lỗi khởi chạy, 5 chương trình chạy ra exception hoặc kết quả sai) thêm từng file vào project rồi biên dịch lại; replay toàn bộ theo đúng thứ tự bài trong thư mục mới. Không chạy trên JDK 25; không dùng preview feature."
contract_version: 1
---

# Bài 8 · Checkpoint: mô hình tài khoản ngân hàng

Đây là bài cuối của Chặng 2. Bài này gần như không có kiến thức mới. Bạn sẽ **ghép** những gì đã học ở
Bài 1–7 thành một project nhỏ nhưng hoàn chỉnh, đúng như đề checkpoint của roadmap: mô hình hoá
`Account`, `SavingAccount`, `Transaction`, dùng `record` cho dữ liệu bất biến và `enum` cho trạng thái giao
dịch, rồi giải thích bằng lời vì sao Java luôn *pass-by-value* [1].

Cứ đi chậm từng phần. Mỗi phần có code chạy được và output thật để bạn đối chiếu.

> 🎯 **Sau bài này bạn sẽ:**
> 1. Dựng được project nhiều file trong hai package `vn.onward.bank` và `vn.onward.bank.app`, biên dịch bằng `javac -d out` và chạy bằng `java -cp out` với tên đầy đủ của class.
> 2. Viết được `TransactionStatus` là `enum` có field và `Transaction` là `record` có compact constructor kiểm tra hợp lệ; dùng `javap` chỉ ra được những gì compiler tự sinh cho record.
> 3. Viết được `Account` trừu tượng giữ số dư `BigDecimal` ở `private`, chỉ đổi qua `deposit`/`withdraw`/`transferTo`, cùng hai lớp con ghi đè `canWithdraw` và `monthlyInterest`.
> 4. Chạy được demo nạp/rút/chuyển, đọc được lịch sử giao dịch và giải thích được vì sao giao dịch thất bại vẫn có phiếu `FAILED` mà số dư không đổi.
> 5. Giải thích được bằng lời, kèm thí nghiệm có output thật, vì sao Java luôn pass-by-value kể cả khi truyền object.

## Tình huống

Buổi phỏng vấn thực tập Java, người phỏng vấn đưa đề: "Mô hình hoá tài khoản tiết kiệm và tài khoản thanh
toán. Mỗi lần nạp, rút, chuyển đều phải có lịch sử. Không ai được sửa số dư từ bên ngoài." Bạn vừa viết xong
thì nghe câu hỏi tiếp: "Java truyền object theo tham chiếu, đúng không?" Rất nhiều bạn trả lời "đúng" và mất
điểm ở đây. Bài này giúp bạn làm trọn cả hai phần: code chạy được và câu trả lời đúng.

**Cần biết trước:** toàn bộ Chặng 2:
[Bài 1 · Package và access modifier](/docs/learning/chang-2/package-va-access-modifier),
[Bài 2 · Đóng gói và method](/docs/learning/chang-2/dong-goi-va-method),
[Bài 3 · static, final, vòng đời object](/docs/learning/chang-2/static-final-vong-doi-object),
[Bài 4 · Kế thừa và ghi đè](/docs/learning/chang-2/ke-thua-va-ghi-de),
[Bài 5 · Trừu tượng và interface](/docs/learning/chang-2/truu-tuong-va-interface),
[Bài 6 · Binding và truyền tham số](/docs/learning/chang-2/binding-va-truyen-tham-so),
[Bài 7 · Enum, record, nested class](/docs/learning/chang-2/enum-record-nested-class).
Từ Chặng 1: `BigDecimal` ở [Bài 7 · Checkpoint lãi kép](/docs/learning/chang-1/checkpoint-lai-kep), `javap` ở
[Bài 2 · Vòng đời chương trình](/docs/learning/chang-1/vong-doi-chuong-trinh).

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| Checkpoint | Bài tổng hợp: tự ghép kiến thức cả chặng thành một sản phẩm chạy được | project `vn.onward.bank` |
| Tên đầy đủ (*fully qualified name*) | Tên package + dấu chấm + tên class | `vn.onward.bank.app.BankDemo` |
| Bất biến nghiệp vụ (*invariant*) | Luật luôn phải đúng với object, ở mọi thời điểm | "số dư chỉ đổi khi có phiếu giao dịch" |
| Phiếu giao dịch | Một bản ghi không sửa được về một lần nạp/rút/chuyển | một object `Transaction` |
| Thấu chi (*overdraft*) | Ngân hàng cho tiêu vượt số dư, tới một hạn mức đã thoả thuận | hạn mức 500.000 đ, số dư được âm tới -500.000 |
| Lịch sử giao dịch (*history*) | Danh sách các phiếu của một tài khoản, theo thứ tự | `getHistory()` |
| Bản sao chỉ đọc (*unmodifiable copy*) | Đưa ra ngoài một bản sao không sửa được, bản gốc vẫn an toàn | `List.copyOf(history)` |
| Pass-by-value (truyền theo giá trị) | Method nhận **bản sao** giá trị của đối số | bản sao "địa chỉ" của object |
| Pass-by-reference (truyền theo tham chiếu) | Method nhận **chính biến** của bên gọi. Java **không** có cơ chế này | (không có trong Java) |

💡 **Về tiền trong bài này.** Mọi số tiền là `BigDecimal` (Chặng 1 · Bài 7), đơn vị **đồng**. Số tiền nguyên
tạo bằng `BigDecimal.valueOf(long)`, viết có dấu `_` cho dễ đọc như `10_000_000`. Lãi suất tạo từ `String`
như `new BigDecimal("6")`. `BigDecimal` là kiểu **bất biến** (*immutable*): mọi phép tính như `add` trả về
một object mới [2].

## 1. Đề bài, bản thiết kế và cây thư mục

**Ý tưởng nôm na.** Trước khi mở một chi nhánh ngân hàng, người ta vẽ sơ đồ: quầy ở đâu, két ở đâu, sổ sách
lưu thế nào, ai được vào phòng nào. Phần này là "sơ đồ chi nhánh" của project: có những class nào, class nào
kế thừa class nào, file nằm ở thư mục nào.

**Đề bài** (mở rộng từ checkpoint của roadmap [1]):

- `Account` là lớp **trừu tượng** (*abstract*, Bài 5). Số dư `balance` là `BigDecimal`, để `private`.
- Số dư chỉ đổi qua ba "quầy": `deposit` (nạp), `withdraw` (rút), `transferTo` (chuyển).
- `SavingAccount` (tài khoản tiết kiệm) có lãi suất năm, không cho rút quá số dư.
- `CheckingAccount` (tài khoản thanh toán) có hạn mức thấu chi, không trả lãi.
- Mỗi lần nạp, rút, chuyển, cộng lãi tạo ra **một** phiếu `Transaction` (là `record`), có trạng thái
  `TransactionStatus` (là `enum`). Giao dịch bị từ chối vẫn có phiếu `FAILED`, và số dư không đổi.
- Chương trình demo nằm ở package **khác** (`vn.onward.bank.app`), để nó chỉ dùng được phần `public`.
  Nhờ vậy các access modifier của Bài 1 thật sự có tác dụng.

<svg viewBox="0 0 740 390" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bản thiết kế project trong package vn.onward.bank. Bên trái là cây kế thừa: class trừu tượng Account giữ số dư balance kiểu BigDecimal và lịch sử history ở mức private, có các method public final deposit, withdraw, transferTo, và hai method abstract canWithdraw (protected) và monthlyInterest (public). Hai lớp con SavingAccount và CheckingAccount kế thừa Account, mũi tên tam giác rỗng trỏ lên Account. SavingAccount có lãi suất annualRatePercent, chỉ cho rút tối đa bằng số dư, lãi tháng bằng số dư nhân lãi suất chia 1200. CheckingAccount có hạn mức thấu chi overdraftLimit, cho rút tối đa bằng số dư cộng hạn mức, lãi tháng bằng 0. Bên phải là dữ liệu: Account ghi ra nhiều phiếu Transaction; Transaction là record bất biến gồm id, accountId, type, amount, balanceAfter, status, note; trường status có kiểu enum TransactionStatus với bốn hằng PENDING, COMPLETED, FAILED, REVERSED. Chú thích: dấu cộng là public, dấu thăng là protected, dấu trừ là private.">
  <defs>
    <marker id="c2b8-design-inherit" markerWidth="14" markerHeight="14" refX="12" refY="7" orient="auto">
      <path d="M1,1 L12,7 L1,13 Z" fill="#FFFFFF" stroke="#1D4ED8"/>
    </marker>
    <marker id="c2b8-design-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="20" y="22" font-family="monospace" font-size="13" font-weight="bold" fill="#0F172A">package vn.onward.bank</text>
    <rect x="20" y="40" width="370" height="160" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="205" y="62" text-anchor="middle" font-style="italic" fill="#1D4ED8">«abstract»</text>
    <text x="205" y="80" text-anchor="middle" font-family="monospace" font-size="14" font-weight="bold" fill="#1D4ED8">Account</text>
    <line x1="20" y1="90" x2="390" y2="90" stroke="#2563EB"/>
    <g font-family="monospace" fill="#0F172A">
      <text x="32" y="110">- balance: BigDecimal</text>
      <text x="32" y="128">- history: List&lt;Transaction&gt;</text>
      <text x="32" y="150">+ deposit / withdraw / transferTo</text>
      <text x="32" y="168" fill="#D97706"># canWithdraw(amount)   abstract</text>
      <text x="32" y="186" fill="#D97706">+ monthlyInterest()     abstract</text>
    </g>
    <text x="372" y="150" text-anchor="end" fill="#047857">final</text>
    <rect x="20" y="260" width="180" height="96" rx="10" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="110" y="282" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#1D4ED8">SavingAccount</text>
    <line x1="20" y1="292" x2="200" y2="292" stroke="#2563EB"/>
    <text x="30" y="310" font-family="monospace" fill="#0F172A">- annualRatePercent</text>
    <text x="30" y="328" fill="#0F172A">rút tối đa = số dư</text>
    <text x="30" y="346" fill="#0F172A">lãi = dư × % / 1200</text>
    <rect x="210" y="260" width="180" height="96" rx="10" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="300" y="282" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#1D4ED8">CheckingAccount</text>
    <line x1="210" y1="292" x2="390" y2="292" stroke="#2563EB"/>
    <text x="220" y="310" font-family="monospace" fill="#0F172A">- overdraftLimit</text>
    <text x="220" y="328" fill="#0F172A">rút tối đa = dư + thấu chi</text>
    <text x="220" y="346" fill="#0F172A">lãi tháng = 0</text>
    <line x1="110" y1="258" x2="160" y2="203" stroke="#1D4ED8" stroke-width="1.5" marker-end="url(#c2b8-design-inherit)"/>
    <line x1="300" y1="258" x2="250" y2="203" stroke="#1D4ED8" stroke-width="1.5" marker-end="url(#c2b8-design-inherit)"/>
    <text x="205" y="240" text-anchor="middle" fill="#64748B">extends</text>
    <rect x="460" y="40" width="260" height="160" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="590" y="62" text-anchor="middle" font-style="italic" fill="#047857">«record» bất biến</text>
    <text x="590" y="80" text-anchor="middle" font-family="monospace" font-size="14" font-weight="bold" fill="#047857">Transaction</text>
    <line x1="460" y1="90" x2="720" y2="90" stroke="#10B981"/>
    <g font-family="monospace" fill="#0F172A">
      <text x="472" y="110">id, accountId, type</text>
      <text x="472" y="128">amount, balanceAfter</text>
      <text x="472" y="146">status, note</text>
    </g>
    <text x="472" y="172" fill="#64748B">chỉ có accessor: amount(), …</text>
    <text x="472" y="190" fill="#64748B">không có setter</text>
    <line x1="392" y1="120" x2="456" y2="120" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b8-design-arrow)"/>
    <text x="424" y="112" text-anchor="middle" fill="#64748B">ghi</text>
    <text x="424" y="138" text-anchor="middle" fill="#64748B">0..*</text>
    <rect x="460" y="260" width="260" height="96" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="590" y="280" text-anchor="middle" font-style="italic" fill="#D97706">«enum»</text>
    <text x="590" y="298" text-anchor="middle" font-family="monospace" font-size="14" font-weight="bold" fill="#D97706">TransactionStatus</text>
    <line x1="460" y1="308" x2="720" y2="308" stroke="#D97706"/>
    <text x="590" y="328" text-anchor="middle" font-family="monospace" fill="#0F172A">PENDING · COMPLETED</text>
    <text x="590" y="346" text-anchor="middle" font-family="monospace" fill="#0F172A">FAILED · REVERSED</text>
    <line x1="590" y1="202" x2="590" y2="256" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b8-design-arrow)"/>
    <text x="598" y="234" fill="#64748B">status</text>
    <text x="370" y="380" text-anchor="middle" fill="#64748B">Ký hiệu (Bài 1):  + public  ·  # protected  ·  - private</text>
  </g>
</svg>

**Cây thư mục của project** (gốc là thư mục `bank/`):

```text
bank/
├── src/
│   └── vn/onward/bank/
│       ├── Account.java
│       ├── CheckingAccount.java
│       ├── SavingAccount.java
│       ├── Transaction.java
│       ├── TransactionStatus.java
│       └── app/
│           ├── AccountTypesDemo.java
│           ├── BankDemo.java
│           ├── PassByValueLab.java
│           └── TransactionPreview.java
└── out/          ← javac tự tạo khi biên dịch
```

Bắt đầu bằng file nhỏ nhất: `enum` trạng thái giao dịch. Bạn đã học `enum` có field và constructor ở Bài 7,
nên ở đây chỉ dùng lại.

**File** `src/vn/onward/bank/TransactionStatus.java`:

```java
package vn.onward.bank;

// enum: tập hằng cố định. Mỗi hằng là MỘT object duy nhất của kiểu TransactionStatus
public enum TransactionStatus {
    PENDING("Đang xử lý"),
    COMPLETED("Thành công"),
    FAILED("Thất bại"),
    REVERSED("Đã hoàn tiền");

    private final String label;          // enum cũng có field, constructor, method

    TransactionStatus(String label) {    // constructor của enum luôn là private
        this.label = label;
    }

    public String label() {
        return label;
    }
}
```

Tạo thư mục, lưu file trên, rồi biên dịch thử một file này:

```bash
mkdir -p bank/src/vn/onward/bank/app
cd bank
javac -d out src/vn/onward/bank/TransactionStatus.java
ls out/vn/onward/bank
```

**Kết quả khi chạy:**

```text
TransactionStatus.class
```

<svg viewBox="0 0 740 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Từ mã nguồn tới chương trình chạy. Bên trái là thư mục src chứa cây vn/onward/bank với các file Account.java, SavingAccount.java, CheckingAccount.java, Transaction.java, TransactionStatus.java và thư mục con app chứa BankDemo.java. Tên thư mục trùng với tên package: package vn.onward.bank nằm ở vn/onward/bank, package vn.onward.bank.app nằm ở vn/onward/bank/app. Mũi tên javac -d out đi sang phải tới thư mục out, nơi javac tự tạo đúng cây thư mục theo package và đặt các file .class, kể cả Transaction&#36;Type.class cho enum lồng. Phía dưới: lệnh java -cp out vn.onward.bank.app.BankDemo chạy chương trình bằng tên đầy đủ gồm package cộng tên class.">
  <defs>
    <marker id="c2b8-build-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="300" height="210" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="160" y="32" text-anchor="middle" font-weight="bold" fill="#0F172A">src/  (mã nguồn bạn viết)</text>
    <g font-family="monospace" fill="#0F172A">
      <text x="24" y="58">vn/onward/bank/</text>
      <text x="44" y="78">Account.java</text>
      <text x="44" y="96">SavingAccount.java</text>
      <text x="44" y="114">CheckingAccount.java</text>
      <text x="44" y="132">Transaction.java</text>
      <text x="44" y="150">TransactionStatus.java</text>
      <text x="44" y="170">app/</text>
      <text x="64" y="188">BankDemo.java</text>
    </g>
    <text x="146" y="58" fill="#1D4ED8">← package vn.onward.bank</text>
    <text x="84" y="170" fill="#1D4ED8">← package vn.onward.bank.app</text>
    <line x1="314" y1="115" x2="420" y2="115" stroke="#64748B" stroke-width="2" marker-end="url(#c2b8-build-arrow)"/>
    <text x="367" y="104" text-anchor="middle" font-family="monospace" fill="#0F172A">javac -d out</text>
    <text x="367" y="134" text-anchor="middle" fill="#64748B">tự tạo thư mục</text>
    <rect x="426" y="10" width="304" height="210" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="578" y="32" text-anchor="middle" font-weight="bold" fill="#047857">out/  (bytecode do javac sinh)</text>
    <g font-family="monospace" fill="#0F172A">
      <text x="440" y="58">vn/onward/bank/</text>
      <text x="460" y="78">Account.class</text>
      <text x="460" y="96">SavingAccount.class</text>
      <text x="460" y="114">CheckingAccount.class</text>
      <text x="460" y="132">Transaction.class</text>
      <text x="460" y="150">Transaction&#36;Type.class</text>
      <text x="460" y="170">app/</text>
      <text x="480" y="188">BankDemo.class</text>
    </g>
    <text x="640" y="150" fill="#047857">← enum lồng</text>
    <rect x="10" y="236" width="720" height="54" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="370" y="258" text-anchor="middle" font-family="monospace" font-size="13" fill="#0F172A">java -cp out vn.onward.bank.app.BankDemo</text>
    <text x="370" y="280" text-anchor="middle" fill="#1D4ED8">-cp out: tìm file .class trong out/  ·  tên đầy đủ = package + "." + tên class</text>
  </g>
</svg>

**Giải thích từng bước:**

1. Dòng `package vn.onward.bank;` nói file này thuộc package nào. Tên trong khai báo package phải là tên
   **đầy đủ** của package [3]. Theo quy ước của javac, file nằm ở thư mục `vn/onward/bank/` cho khớp
   tên package (Bài 1).
2. `javac -d out` đặt file `.class` vào thư mục `out`. Class thuộc package nào thì javac đặt vào thư mục con
   đúng theo tên package, và tự tạo các thư mục còn thiếu [4]. Vì vậy `ls` thấy
   `out/vn/onward/bank/TransactionStatus.class`.
3. Trong enum, constructor không ghi access modifier thì mặc định là `private` [5]. Không ai ngoài
   enum tạo thêm được trạng thái thứ năm.
4. Khi chạy, `java -cp out <tên đầy đủ>` tìm class trong `out`. Tham số đầu tiên không phải tuỳ chọn của
   lệnh `java` là **tên đầy đủ** của class cần chạy [6]. Phần 5 sẽ chạy đúng cách này.

### ⚠️ Lỗi hay gặp

**Lỗi 1: chạy bằng tên ngắn.** Sau khi biên dịch cả project (phần 5), nếu gõ tên class không kèm package:

```bash
java -cp out BankDemo
```

```text
Error: Could not find or load main class BankDemo
Caused by: java.lang.ClassNotFoundException: BankDemo
```

JVM tìm `out/BankDemo.class` và không thấy. **Cách sửa:** `java -cp out vn.onward.bank.app.BankDemo`.

**Lỗi 2: quên `import` class ở package khác.** Class trong `vn.onward.bank.app` không tự thấy class của
`vn.onward.bank`, dù hai thư mục lồng nhau. Package "con" không có quyền gì đặc biệt với package "cha": cấu trúc
phân cấp của tên package chỉ để sắp xếp cho dễ, tự nó không mang ý nghĩa gì [7].

**File** `src/vn/onward/bank/app/NoImport.java`:

```java
package vn.onward.bank.app;

import java.math.BigDecimal;

public class NoImport {
    public static void main(String[] args) {
        // quên import vn.onward.bank.SavingAccount
        SavingAccount an = new SavingAccount("ACC-001", "An", new BigDecimal("6"));
    }
}
```

```text
src/vn/onward/bank/app/NoImport.java:8: error: cannot find symbol
        SavingAccount an = new SavingAccount("ACC-001", "An", new BigDecimal("6"));
        ^
  symbol:   class SavingAccount
  location: class NoImport
src/vn/onward/bank/app/NoImport.java:8: error: cannot find symbol
        SavingAccount an = new SavingAccount("ACC-001", "An", new BigDecimal("6"));
                               ^
  symbol:   class SavingAccount
  location: class NoImport
2 errors
```

**Cách sửa:** thêm `import vn.onward.bank.SavingAccount;`. Thử xong thì bỏ file này ra khỏi `src`, vì một file
lỗi sẽ làm cả lệnh `javac` thất bại.

## 2. `Transaction` là `record`: phiếu giao dịch không sửa được

**Ý tưởng nôm na.** Ở quầy, mỗi giao dịch in ra một **phiếu** có số phiếu, số tiền, số dư sau giao dịch và
trạng thái. Phiếu đã đóng dấu thì không ai tẩy xoá. Muốn "sửa" thì lập phiếu mới, ví dụ phiếu hoàn tiền.
`record` sinh ra cho đúng việc này: một class chỉ để **mang dữ liệu bất biến** [8].

<svg viewBox="0 0 740 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Record Transaction: bạn viết gì và compiler sinh thêm gì. Bên trái, phần bạn viết: phần đầu record Transaction với bảy thành phần id, accountId, type, amount, balanceAfter, status, note; một compact constructor chỉ chứa code kiểm tra; và method line tự viết. Bên phải, phần compiler tự sinh: class final kế thừa java.lang.Record; bảy field private final; constructor chính tắc nhận đủ bảy tham số; bảy accessor id(), amount(), status() và các accessor khác, không có tiền tố get; equals, hashCode, toString so sánh và in theo từng thành phần. Phía dưới là thứ tự chạy khi gọi new Transaction: bước 1 nhận bảy tham số; bước 2 chạy thân compact constructor, kiểm tra null và kiểm tra giao dịch COMPLETED phải có số tiền lớn hơn 0, nếu sai thì ném IllegalArgumentException và không có object nào được tạo; bước 3 chuẩn hoá note null thành chuỗi rỗng; bước 4 Java tự gán bảy field từ tham số; bước 5 object bất biến sẵn sàng.">
  <defs>
    <marker id="c2b8-record-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
    <marker id="c2b8-record-fail" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="330" height="190" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="175" y="32" text-anchor="middle" font-weight="bold" fill="#D97706">Bạn viết</text>
    <g font-family="monospace" fill="#0F172A">
      <text x="24" y="58">record Transaction(</text>
      <text x="40" y="76">id, accountId, type,</text>
      <text x="40" y="94">amount, balanceAfter,</text>
      <text x="40" y="112">status, note)</text>
      <text x="24" y="138">public Transaction { … }</text>
      <text x="24" y="174">public String line() { … }</text>
    </g>
    <text x="40" y="156" fill="#64748B">compact constructor: chỉ kiểm tra</text>
    <text x="40" y="192" fill="#64748B">method tự thêm, như class thường</text>
    <line x1="344" y1="105" x2="384" y2="105" stroke="#64748B" stroke-width="2" marker-end="url(#c2b8-record-arrow)"/>
    <text x="364" y="96" text-anchor="middle" fill="#64748B">javac</text>
    <rect x="390" y="10" width="340" height="190" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="560" y="32" text-anchor="middle" font-weight="bold" fill="#047857">Compiler tự sinh</text>
    <g font-family="monospace" fill="#0F172A">
      <text x="404" y="58">final class … extends Record</text>
      <text x="404" y="84">private final × 7 field</text>
      <text x="404" y="110">Transaction(7 tham số)</text>
      <text x="404" y="136">id(), amount(), status() …</text>
      <text x="404" y="162">equals · hashCode · toString</text>
    </g>
    <text x="404" y="186" fill="#64748B">accessor không có chữ "get"</text>
    <text x="370" y="226" text-anchor="middle" font-weight="bold" fill="#0F172A">Thứ tự chạy khi gọi new Transaction(…)</text>
    <rect x="10" y="240" width="130" height="52" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="75" y="262" text-anchor="middle" fill="#0F172A">1. nhận 7</text>
    <text x="75" y="280" text-anchor="middle" fill="#0F172A">tham số</text>
    <rect x="160" y="240" width="150" height="52" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="235" y="262" text-anchor="middle" fill="#0F172A">2. kiểm tra null,</text>
    <text x="235" y="280" text-anchor="middle" fill="#0F172A">COMPLETED ⇒ > 0</text>
    <rect x="330" y="240" width="130" height="52" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="395" y="262" text-anchor="middle" fill="#0F172A">3. note null</text>
    <text x="395" y="280" text-anchor="middle" fill="#0F172A">→ ""</text>
    <rect x="480" y="240" width="120" height="52" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="540" y="262" text-anchor="middle" fill="#0F172A">4. Java tự</text>
    <text x="540" y="280" text-anchor="middle" fill="#0F172A">gán 7 field</text>
    <rect x="620" y="240" width="110" height="52" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="675" y="262" text-anchor="middle" fill="#047857">5. object</text>
    <text x="675" y="280" text-anchor="middle" fill="#047857">bất biến</text>
    <line x1="140" y1="266" x2="156" y2="266" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b8-record-arrow)"/>
    <line x1="310" y1="266" x2="326" y2="266" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b8-record-arrow)"/>
    <line x1="460" y1="266" x2="476" y2="266" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b8-record-arrow)"/>
    <line x1="600" y1="266" x2="616" y2="266" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b8-record-arrow)"/>
    <line x1="235" y1="294" x2="235" y2="318" stroke="#DC2626" stroke-width="1.5" marker-end="url(#c2b8-record-fail)"/>
    <rect x="110" y="322" width="370" height="30" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="295" y="342" text-anchor="middle" fill="#DC2626">sai → ném IllegalArgumentException, không có object</text>
  </g>
</svg>

**File** `src/vn/onward/bank/Transaction.java`:

```java
package vn.onward.bank;

import java.math.BigDecimal;
import java.util.Objects;

// record: một "phiếu giao dịch" đã in ra thì không sửa được nữa
public record Transaction(String id, String accountId, Type type, BigDecimal amount,
                          BigDecimal balanceAfter, TransactionStatus status, String note) {

    // enum lồng trong record (nested type), ngầm là static
    public enum Type { DEPOSIT, WITHDRAWAL, TRANSFER_IN, TRANSFER_OUT, INTEREST }

    // compact constructor: chỉ viết phần kiểm tra, việc gán field Java tự làm ở cuối
    public Transaction {
        Objects.requireNonNull(id, "id");
        Objects.requireNonNull(type, "type");
        Objects.requireNonNull(amount, "amount");
        Objects.requireNonNull(balanceAfter, "balanceAfter");
        Objects.requireNonNull(status, "status");
        if (status == TransactionStatus.COMPLETED && amount.signum() <= 0) {
            throw new IllegalArgumentException("Giao dịch thành công phải có số tiền > 0");
        }
        note = (note == null) ? "" : note;   // gán lại THAM SỐ, trước khi field được gán
    }

    // record vẫn thêm được method như class thường: in một dòng sao kê
    public String line() {
        return String.format("%s %-12s %9s  %-10s số dư %9s  %s",
                id, type, amount.toPlainString(), status.label(),
                balanceAfter.toPlainString(), note).stripTrailing();
    }
}
```

Một chương trình nhỏ để thử record và enum (đặt ở package `app`):

**File** `src/vn/onward/bank/app/TransactionPreview.java`:

```java
package vn.onward.bank.app;

import java.math.BigDecimal;
import vn.onward.bank.Transaction;
import vn.onward.bank.TransactionStatus;

public class TransactionPreview {
    public static void main(String[] args) {
        BigDecimal amount = new BigDecimal("500000");
        // note = null: compact constructor sẽ đổi thành ""
        Transaction a = new Transaction("GD-901", "ACC-001", Transaction.Type.DEPOSIT,
                amount, amount, TransactionStatus.COMPLETED, null);
        Transaction b = new Transaction("GD-901", "ACC-001", Transaction.Type.DEPOSIT,
                amount, amount, TransactionStatus.COMPLETED, "");

        System.out.println(a);                    // toString() do compiler sinh
        System.out.println(a.amount());           // accessor: tên thành phần, không có "get"
        System.out.println(a.equals(b));          // equals() sinh sẵn: so từng thành phần
        System.out.println(a == b);               // hai object khác nhau
        System.out.println(a.line());             // method tự viết thêm

        for (TransactionStatus s : TransactionStatus.values()) {   // values(): mọi hằng, đúng thứ tự khai báo
            System.out.println(s + " = " + s.label());
        }
        System.out.println(TransactionStatus.valueOf("FAILED").label());   // tìm hằng theo tên
    }
}
```

Từ giờ, mọi phần đều biên dịch bằng **cùng một lệnh** (đứng ở thư mục `bank/`), rồi chạy class có `main`:

```bash
javac -d out src/vn/onward/bank/*.java src/vn/onward/bank/app/*.java
java -cp out vn.onward.bank.app.TransactionPreview
```

**Kết quả khi chạy:**

```text
Transaction[id=GD-901, accountId=ACC-001, type=DEPOSIT, amount=500000, balanceAfter=500000, status=COMPLETED, note=]
500000
true
false
GD-901 DEPOSIT         500000  Thành công số dư    500000
PENDING = Đang xử lý
COMPLETED = Thành công
FAILED = Thất bại
REVERSED = Đã hoàn tiền
Thất bại
```

Muốn thấy compiler đã sinh gì, dùng `javap` (Chặng 1 · Bài 2). Tuỳ chọn `-p` hiện cả thành phần `private`
[9]:

```bash
javap -p -cp out vn.onward.bank.Transaction
```

```text
Compiled from "Transaction.java"
public final class vn.onward.bank.Transaction extends java.lang.Record {
  private final java.lang.String id;
  private final java.lang.String accountId;
  private final vn.onward.bank.Transaction$Type type;
  private final java.math.BigDecimal amount;
  private final java.math.BigDecimal balanceAfter;
  private final vn.onward.bank.TransactionStatus status;
  private final java.lang.String note;
  public vn.onward.bank.Transaction(java.lang.String, java.lang.String, vn.onward.bank.Transaction$Type, java.math.BigDecimal, java.math.BigDecimal, vn.onward.bank.TransactionStatus, java.lang.String);
  public java.lang.String line();
  public final java.lang.String toString();
  public final int hashCode();
  public final boolean equals(java.lang.Object);
  public java.lang.String id();
  public java.lang.String accountId();
  public vn.onward.bank.Transaction$Type type();
  public java.math.BigDecimal amount();
  public java.math.BigDecimal balanceAfter();
  public vn.onward.bank.TransactionStatus status();
  public java.lang.String note();
}
```

**Giải thích từng bước:**

1. `new Transaction(...)` gọi **constructor chính tắc** (*canonical constructor*), nhận đủ 7 tham số theo
   thứ tự trong phần đầu record.
2. Thân **compact constructor** `public Transaction { ... }` chạy trước. Trong đó, tên `note` là **tham
   số**, chưa phải field. Gán `note = ""` là chuẩn hoá tham số. Sau câu lệnh cuối, Java mới tự gán từng field
   bằng giá trị tham số [10]. Vì vậy `a` (note `null`) và `b` (note `""`) bằng nhau.
3. Mỗi thành phần có một field `private final` [10]. `javap` xác nhận: 7 dòng `private final`.
4. Accessor trùng tên thành phần: `a.amount()`, không phải `getAmount()`.
5. `equals` sinh sẵn so **từng thành phần**. Thành phần kiểu tham chiếu được so bằng `Objects.equals`
   [11]. Nên `a.equals(b)` là `true`, còn `a == b` là `false` vì đó là hai object khác nhau.
6. Record ngầm là `final` và kế thừa `java.lang.Record` [10]: dòng đầu của `javap` ghi
   `public final class ... extends java.lang.Record`. Không class nào `extends` được `Transaction`.
7. `enum Type` khai báo bên trong record là một **nested type**. Enum lồng ngầm là `static` [5], nên
   bên ngoài gọi `Transaction.Type.DEPOSIT` mà không cần object `Transaction`. javac tạo file riêng
   `Transaction$Type.class`.
8. `values()` trả mảng các hằng **đúng thứ tự khai báo**. `valueOf("FAILED")` tìm hằng theo tên [5].

### ⚠️ Lỗi hay gặp

**Lỗi 1: sửa field của record.** Field là `private final` và record không có setter.

**File** `src/vn/onward/bank/app/EditRecord.java`:

```java
package vn.onward.bank.app;

import java.math.BigDecimal;
import vn.onward.bank.Transaction;
import vn.onward.bank.TransactionStatus;

public class EditRecord {
    public static void main(String[] args) {
        Transaction tx = new Transaction("GD-901", "ACC-001", Transaction.Type.DEPOSIT,
                new BigDecimal("500000"), new BigDecimal("500000"), TransactionStatus.COMPLETED, "");
        tx.amount = new BigDecimal("900000"); // muốn "sửa phiếu"
    }
}
```

```text
src/vn/onward/bank/app/EditRecord.java:11: error: amount has private access in Transaction
        tx.amount = new BigDecimal("900000"); // muốn "sửa phiếu"
          ^
1 error
```

**Cách sửa:** đừng sửa phiếu. Tạo một phiếu mới mang giá trị mới.

**Lỗi 2: tạo phiếu `COMPLETED` với số tiền 0.** Compact constructor chặn ngay, không object nào được tạo ra.

**File** `src/vn/onward/bank/app/ZeroDeposit.java`:

```java
package vn.onward.bank.app;

import java.math.BigDecimal;
import vn.onward.bank.Transaction;
import vn.onward.bank.TransactionStatus;

public class ZeroDeposit {
    public static void main(String[] args) {
        Transaction tx = new Transaction("GD-902", "ACC-001", Transaction.Type.DEPOSIT,
                BigDecimal.ZERO, BigDecimal.ZERO, TransactionStatus.COMPLETED, "");
        System.out.println("Dòng này không chạy tới");
    }
}
```

```text
Exception in thread "main" java.lang.IllegalArgumentException: Giao dịch thành công phải có số tiền > 0
	at vn.onward.bank.Transaction.<init>(Transaction.java:21)
	at vn.onward.bank.app.ZeroDeposit.main(ZeroDeposit.java:9)
```

Đây là một **exception** (ngoại lệ). Chặng 3 sẽ học cách bắt và xử lý nó. Ở checkpoint này, `Account` luôn
kiểm tra số tiền **trước** khi tạo phiếu, nên chương trình demo không bao giờ chạm vào lỗi này.

**Lỗi 3: record chứa `BigDecimal` và "cùng số tiền" mà không `equals`.** `BigDecimal.equals` so cả giá trị lẫn
**scale** (số chữ số sau dấu chấm), còn `compareTo` chỉ so giá trị [2].

**File** `src/vn/onward/bank/app/ScaleEquals.java`:

```java
package vn.onward.bank.app;

import java.math.BigDecimal;
import vn.onward.bank.Transaction;
import vn.onward.bank.TransactionStatus;

public class ScaleEquals {
    public static void main(String[] args) {
        BigDecimal a = new BigDecimal("500000");
        BigDecimal b = new BigDecimal("500000.00");   // cùng giá trị, khác scale
        Transaction t1 = new Transaction("GD-903", "ACC-001", Transaction.Type.DEPOSIT,
                a, a, TransactionStatus.COMPLETED, "");
        Transaction t2 = new Transaction("GD-903", "ACC-001", Transaction.Type.DEPOSIT,
                b, b, TransactionStatus.COMPLETED, "");
        System.out.println("t1.equals(t2)      = " + t1.equals(t2));
        System.out.println("a.equals(b)        = " + a.equals(b));
        System.out.println("a.compareTo(b) == 0 = " + (a.compareTo(b) == 0));
    }
}
```

```text
t1.equals(t2)      = false
a.equals(b)        = false
a.compareTo(b) == 0 = true
```

**Cách sửa:** so số tiền bằng `compareTo(...) == 0`. Nếu cần record so bằng nhau theo giá trị, hãy chuẩn hoá
số tiền về cùng một scale ngay trong compact constructor.

## 3. `Account`: lớp trừu tượng giữ chặt số dư

**Ý tưởng nôm na.** Số dư là tiền trong **két sắt**. Khách không bao giờ tự mở két. Khách đến **quầy**
(`deposit`, `withdraw`, `transferTo`), giao dịch viên làm theo quy trình, và mỗi lần đều in phiếu. Một quy tắc
riêng như "được rút bao nhiêu" thì quầy hỏi **chính sách của từng loại tài khoản**. Đó là method trừu tượng
`canWithdraw`, mỗi lớp con tự trả lời.

<svg viewBox="0 0 740 380" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Account như một két sắt và đường đi của lệnh rút tiền. Bên trái là object Account: bên trong két là balance và history, đều private. Cửa vào từ bên ngoài là ba method public final deposit, withdraw, transferTo. Cửa protected credit chỉ dành cho lớp con như SavingAccount cộng lãi. Cửa ra là getter: getBalance trả BigDecimal bất biến, getHistory trả bản sao chỉ đọc List.copyOf. Bên phải là luồng của withdraw(amount): bước 1 hỏi amount có lớn hơn 0 không, nếu không thì ghi phiếu FAILED với lý do số tiền phải lớn hơn 0; bước 2 gọi canWithdraw(amount), một method abstract mà lớp con trả lời, nếu sai thì ghi phiếu FAILED với lý do vượt hạn mức rút; bước 3 trừ balance; bước 4 log tạo một Transaction COMPLETED và thêm vào history. Mọi nhánh đều kết thúc bằng một phiếu Transaction được ghi vào lịch sử.">
  <defs>
    <marker id="c2b8-vault-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
    <marker id="c2b8-vault-fail" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="330" height="360" rx="12" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="175" y="32" text-anchor="middle" font-weight="bold" fill="#0F172A">object Account = két sắt</text>
    <rect x="130" y="50" width="196" height="126" rx="10" fill="#FEF2F2" stroke="#DC2626" stroke-width="2"/>
    <text x="228" y="72" text-anchor="middle" fill="#DC2626">private: trong két</text>
    <text x="146" y="100" font-family="monospace" fill="#0F172A">balance</text>
    <text x="146" y="124" font-family="monospace" fill="#0F172A">history</text>
    <text x="146" y="148" fill="#64748B">chỉ code của Account</text>
    <text x="146" y="164" fill="#64748B">chạm vào được</text>
    <g font-family="monospace">
      <rect x="20" y="50" width="98" height="26" rx="5" fill="#EFF6FF" stroke="#2563EB"/>
      <text x="69" y="68" text-anchor="middle" fill="#1D4ED8">deposit</text>
      <rect x="20" y="84" width="98" height="26" rx="5" fill="#EFF6FF" stroke="#2563EB"/>
      <text x="69" y="102" text-anchor="middle" fill="#1D4ED8">withdraw</text>
      <rect x="20" y="118" width="98" height="26" rx="5" fill="#EFF6FF" stroke="#2563EB"/>
      <text x="69" y="136" text-anchor="middle" fill="#1D4ED8">transferTo</text>
      <rect x="20" y="186" width="98" height="26" rx="5" fill="#FFFBEB" stroke="#D97706"/>
      <text x="69" y="204" text-anchor="middle" fill="#D97706">credit</text>
    </g>
    <text x="20" y="160" fill="#1D4ED8">public final: quầy</text>
    <text x="130" y="204" fill="#D97706">protected: cửa cho lớp con</text>
    <line x1="20" y1="232" x2="330" y2="232" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <text x="20" y="256" fill="#047857" font-weight="bold">Cửa ra (chỉ đọc)</text>
    <text x="20" y="280" font-family="monospace" fill="#0F172A">getBalance()</text>
    <text x="130" y="280" fill="#64748B">BigDecimal bất biến</text>
    <text x="20" y="304" font-family="monospace" fill="#0F172A">getHistory()</text>
    <text x="130" y="304" fill="#64748B">List.copyOf: bản sao</text>
    <text x="130" y="322" fill="#64748B">chỉ đọc, sửa là lỗi</text>
    <text x="175" y="356" text-anchor="middle" fill="#0F172A">Muốn đổi số dư: phải đi qua quầy</text>
    <text x="545" y="32" text-anchor="middle" font-weight="bold" fill="#0F172A">withdraw(amount) chạy thế nào</text>
    <rect x="370" y="48" width="230" height="40" rx="8" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="485" y="73" text-anchor="middle" fill="#0F172A">1. amount &gt; 0 ?</text>
    <rect x="370" y="118" width="230" height="52" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="485" y="140" text-anchor="middle" font-family="monospace" fill="#0F172A">2. canWithdraw(amount) ?</text>
    <text x="485" y="160" text-anchor="middle" fill="#D97706">abstract: lớp con trả lời</text>
    <rect x="370" y="200" width="230" height="40" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="485" y="225" text-anchor="middle" font-family="monospace" fill="#0F172A">3. balance = balance − amount</text>
    <rect x="370" y="270" width="230" height="52" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="485" y="292" text-anchor="middle" font-family="monospace" fill="#047857">4. log(... COMPLETED)</text>
    <text x="485" y="312" text-anchor="middle" fill="#047857">thêm phiếu vào history</text>
    <line x1="485" y1="88" x2="485" y2="114" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b8-vault-arrow)"/>
    <text x="492" y="106" fill="#047857">có</text>
    <line x1="485" y1="170" x2="485" y2="196" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b8-vault-arrow)"/>
    <text x="492" y="188" fill="#047857">có</text>
    <line x1="485" y1="240" x2="485" y2="266" stroke="#64748B" stroke-width="1.5" marker-end="url(#c2b8-vault-arrow)"/>
    <rect x="620" y="48" width="110" height="52" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="675" y="70" text-anchor="middle" fill="#DC2626">không: FAILED</text>
    <text x="675" y="88" text-anchor="middle" fill="#DC2626">"phải &gt; 0"</text>
    <rect x="620" y="118" width="110" height="52" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="675" y="140" text-anchor="middle" fill="#DC2626">không: FAILED</text>
    <text x="675" y="158" text-anchor="middle" fill="#DC2626">"vượt hạn mức"</text>
    <line x1="600" y1="68" x2="616" y2="68" stroke="#DC2626" stroke-width="1.5" marker-end="url(#c2b8-vault-fail)"/>
    <line x1="600" y1="144" x2="616" y2="144" stroke="#DC2626" stroke-width="1.5" marker-end="url(#c2b8-vault-fail)"/>
    <text x="545" y="350" text-anchor="middle" fill="#64748B">Nhánh nào cũng ra một phiếu Transaction;</text>
    <text x="545" y="366" text-anchor="middle" fill="#64748B">số dư chỉ đổi ở bước 3.</text>
  </g>
</svg>

Class `Account` dài khoảng 80 dòng nên được chia làm ba đoạn. Ba đoạn dưới đây **ghép liền nhau** thành một
file `src/vn/onward/bank/Account.java`.

**File** `src/vn/onward/bank/Account.java`, đoạn 1/3: field, constructor, method trừu tượng, getter:

```java
package vn.onward.bank;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public abstract class Account {
    private static int nextTxNo = 1;              // static: MỘT bộ đếm cho mọi tài khoản

    private final String id;                      // final: gán đúng 1 lần
    private final String owner;
    private BigDecimal balance = BigDecimal.ZERO; // private: chỉ Account được sửa
    private final List<Transaction> history = new ArrayList<>();

    protected Account(String id, String owner) {  // chỉ lớp con gọi qua super(...)
        this.id = id;
        this.owner = owner;
    }

    // Hai "ô trống" mà mỗi loại tài khoản BẮT BUỘC tự điền
    protected abstract boolean canWithdraw(BigDecimal amount);
    public abstract BigDecimal monthlyInterest();

    public String getId() { return id; }
    public String getOwner() { return owner; }
    public BigDecimal getBalance() { return balance; }   // BigDecimal bất biến: trả ra an toàn
    public List<Transaction> getHistory() { return List.copyOf(history); } // bản sao chỉ đọc
```

**Đoạn 2/3** (ghép tiếp ngay sau đoạn 1): ba "quầy" `public final`.

```java
    public final Transaction deposit(BigDecimal amount) {
        return credit(Transaction.Type.DEPOSIT, amount, "");
    }

    public final Transaction withdraw(BigDecimal amount) {
        return debit(Transaction.Type.WITHDRAWAL, amount, "");
    }

    public final boolean transferTo(Account target, BigDecimal amount) {
        if (target == null || target == this) {
            return false;                         // không chuyển cho "không ai" hay cho chính mình
        }
        String note = id + " -> " + target.id;    // target.id là private, nhưng cùng class nên đọc được
        Transaction out = debit(Transaction.Type.TRANSFER_OUT, amount, note);
        if (out.status() != TransactionStatus.COMPLETED) {
            return false;                         // bên chuyển bị từ chối: bên nhận không được cộng
        }
        target.credit(Transaction.Type.TRANSFER_IN, amount, note);
        return true;
    }
```

**Đoạn 3/3** (ghép tiếp ngay sau đoạn 2): phần bên trong két.

```java
    // protected: lớp con (SavingAccount cộng lãi) gọi được; class ở package khác mà không phải lớp con thì không
    protected final Transaction credit(Transaction.Type type, BigDecimal amount, String note) {
        if (amount.signum() <= 0) {
            return log(type, amount, TransactionStatus.FAILED, "số tiền phải > 0");
        }
        balance = balance.add(amount);
        return log(type, amount, TransactionStatus.COMPLETED, note);
    }

    private Transaction debit(Transaction.Type type, BigDecimal amount, String note) {
        if (amount.signum() <= 0) {
            return log(type, amount, TransactionStatus.FAILED, "số tiền phải > 0");
        }
        if (!canWithdraw(amount)) {               // method abstract: chạy bản của lớp con
            return log(type, amount, TransactionStatus.FAILED, "vượt hạn mức rút");
        }
        balance = balance.subtract(amount);
        return log(type, amount, TransactionStatus.COMPLETED, note);
    }

    private Transaction log(Transaction.Type type, BigDecimal amount,
                            TransactionStatus status, String note) {
        String txId = String.format("GD-%03d", nextTxNo++);
        Transaction tx = new Transaction(txId, id, type, amount, balance, status, note);
        history.add(tx);
        return tx;
    }

    @Override
    public String toString() {
        return getClass().getSimpleName() + "[" + id + ", " + owner
                + ", số dư " + balance.toPlainString() + "]";
    }
}
```

`Account` chưa có `main` để chạy. Hãy biên dịch, rồi dùng `javap` (không có `-p`) xem "mặt tiền" của class,
tức những gì code bên ngoài được thấy. Mặc định, `javap` chỉ hiện thành phần `public`, `protected` và
*package-private* [9]:

```bash
javac -d out src/vn/onward/bank/*.java src/vn/onward/bank/app/*.java
javap -cp out vn.onward.bank.Account
```

**Kết quả khi chạy:**

```text
Compiled from "Account.java"
public abstract class vn.onward.bank.Account {
  protected vn.onward.bank.Account(java.lang.String, java.lang.String);
  protected abstract boolean canWithdraw(java.math.BigDecimal);
  public abstract java.math.BigDecimal monthlyInterest();
  public java.lang.String getId();
  public java.lang.String getOwner();
  public java.math.BigDecimal getBalance();
  public java.util.List<vn.onward.bank.Transaction> getHistory();
  public final vn.onward.bank.Transaction deposit(java.math.BigDecimal);
  public final vn.onward.bank.Transaction withdraw(java.math.BigDecimal);
  public final boolean transferTo(vn.onward.bank.Account, java.math.BigDecimal);
  protected final vn.onward.bank.Transaction credit(vn.onward.bank.Transaction$Type, java.math.BigDecimal, java.lang.String);
  public java.lang.String toString();
  static {};
}
```

Không có `balance`, không có `history`, không có `debit` hay `log`. Đó chính là đóng gói. Dòng `static {};`
xuất hiện vì class có field static được gán giá trị ban đầu (`nextTxNo = 1`). Phép gán đó chạy một lần khi
class được khởi tạo [12] (Bài 3).

**Giải thích từng bước** (theo đường đi của một lệnh `withdraw`):

1. Code bên ngoài gọi `withdraw(amount)`. Method này `public final`: ai cũng gọi được, nhưng lớp con **không
   ghi đè** được [13]. Quy trình "mọi thay đổi số dư đều có phiếu" vì thế không thể bị lách.
2. `withdraw` chuyển sang `debit`, một method `private`. Bước đầu: số tiền phải lớn hơn 0 (`signum()` trả
   `-1`, `0` hoặc `1` theo dấu của số [2]). Sai thì ghi phiếu `FAILED` và dừng.
3. Bước hai: gọi `canWithdraw(amount)`. Đây là method `abstract`: `Account` biết **khi nào** cần hỏi, còn lớp
   con biết **trả lời ra sao**. Lúc chạy, JVM chọn bản `canWithdraw` theo kiểu thật của object
   [14] (Bài 6 học kỹ cơ chế này).
4. Chỉ khi cả hai bước đều qua, `balance` mới bị trừ. `BigDecimal` bất biến nên `subtract` trả object mới, và
   ta gán lại vào `balance`.
5. `log` tạo phiếu. Mã phiếu lấy từ `nextTxNo`, một field `static`: **một** bộ đếm dùng chung cho mọi tài
   khoản (Bài 3), nên mã `GD-001`, `GD-002`... không bao giờ trùng.
6. Trong `transferTo`, `target.id` và `target.credit(...)` đọc thành phần của **object khác**. Vẫn hợp lệ, vì
   quyền `private` tính theo **class**, không theo object: mọi code nằm trong thân class `Account` đều truy
   cập được [15].
7. `getHistory()` trả `List.copyOf(history)`, một **bản sao chỉ đọc**. Gọi method sửa danh sách trên bản sao
   này sẽ ném `UnsupportedOperationException` [16]. `getBalance()` trả thẳng `balance` vì `BigDecimal`
   bất biến, không ai sửa được nó qua tham chiếu [2].

💡 `List`/`ArrayList` ở đây chỉ dùng ở mức "danh sách có thứ tự" như Bài 5. Chặng 3 sẽ học kỹ collections.

**Nên và không nên khi đóng gói số dư:**

| ✓ Nên | ✗ Không nên |
|---|---|
| `private BigDecimal balance`, chỉ đổi trong method nghiệp vụ | `public BigDecimal balance` hoặc `setBalance(...)` |
| `public final` cho quy trình bắt buộc (`deposit`, `withdraw`) | Để lớp con ghi đè được cả quy trình ghi phiếu |
| `abstract` cho phần thật sự khác nhau (`canWithdraw`) | `if (this instanceof SavingAccount)` trong `Account` |
| Trả `List.copyOf(history)` | Trả thẳng `history` cho bên ngoài `add`/`clear` |
| So tiền bằng `compareTo` | So tiền bằng `equals` (lệch scale là sai) |

### ⚠️ Lỗi hay gặp

**Lỗi 1: `new Account(...)`.** Không thể tạo object từ class trừu tượng [17].

**File** `src/vn/onward/bank/app/NewAbstract.java`:

```java
package vn.onward.bank.app;

import vn.onward.bank.Account;

public class NewAbstract {
    public static void main(String[] args) {
        Account acc = new Account("ACC-003", "Chi");   // Account là abstract
    }
}
```

```text
src/vn/onward/bank/app/NewAbstract.java:7: error: Account is abstract; cannot be instantiated
        Account acc = new Account("ACC-003", "Chi");   // Account là abstract
                      ^
1 error
```

**Cách sửa:** tạo object của lớp con, ví dụ `new SavingAccount(...)` (phần 4).

**Lỗi 2: gọi `credit` từ chương trình demo để "cộng tiền cho nhanh".** `credit` là `protected`. `BankDemo`
nằm ở package khác và không phải lớp con của `Account`, nên không được gọi [15].

**File** `src/vn/onward/bank/app/CallCredit.java`:

```java
package vn.onward.bank.app;

import java.math.BigDecimal;
import vn.onward.bank.SavingAccount;
import vn.onward.bank.Transaction;

public class CallCredit {
    public static void main(String[] args) {
        SavingAccount an = new SavingAccount("ACC-001", "An", new BigDecimal("6"));
        an.credit(Transaction.Type.INTEREST, new BigDecimal("1000000"), "tự cộng lãi");
    }
}
```

```text
src/vn/onward/bank/app/CallCredit.java:10: error: credit(Type,BigDecimal,String) has protected access in Account
        an.credit(Transaction.Type.INTEREST, new BigDecimal("1000000"), "tự cộng lãi");
          ^
1 error
```

Đây chính là lý do đặt demo ở package riêng: compiler giúp bạn giữ luật. **Cách sửa:** dùng `deposit`.

**Lỗi 3: xoá lịch sử từ bên ngoài.** Biên dịch được, nhưng chạy thì văng lỗi, vì bạn đang cầm bản sao chỉ đọc:

**File** `src/vn/onward/bank/app/EditHistory.java`:

```java
package vn.onward.bank.app;

import java.math.BigDecimal;
import vn.onward.bank.SavingAccount;

public class EditHistory {
    public static void main(String[] args) {
        SavingAccount an = new SavingAccount("ACC-001", "An", new BigDecimal("6"));
        an.deposit(new BigDecimal("500000"));
        an.getHistory().clear();   // muốn xoá lịch sử từ bên ngoài
        System.out.println("Dòng này không chạy tới");
    }
}
```

```text
Exception in thread "main" java.lang.UnsupportedOperationException
	at java.base/java.util.ImmutableCollections.uoe(ImmutableCollections.java:142)
	at java.base/java.util.ImmutableCollections$AbstractImmutableCollection.clear(ImmutableCollections.java:149)
	at vn.onward.bank.app.EditHistory.main(EditHistory.java:10)
```

**Cách sửa:** lịch sử chỉ để đọc. Nếu nghiệp vụ cần "huỷ" một giao dịch, thêm một method trong `Account`
ghi **phiếu mới** (xem Bài tập 3).

## 4. `SavingAccount` và `CheckingAccount`: kế thừa và ghi đè

**Ý tưởng nôm na.** Ngân hàng có nhiều **sản phẩm** tài khoản. Chúng dùng chung một quầy, một quy trình in
phiếu. Chỉ **chính sách** là khác: sổ tiết kiệm không cho tiêu quá số dư nhưng có lãi; tài khoản thanh toán
cho thấu chi nhưng không có lãi. Mỗi lớp con chỉ viết phần chính sách của mình.

<svg viewBox="0 0 740 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bảng method của từng class và cách một lời gọi chọn đúng bản ghi đè. Ba cột: Account, SavingAccount, CheckingAccount. Hàng canWithdraw: Account để trống vì abstract; SavingAccount trả lời số dư lớn hơn hoặc bằng số tiền rút; CheckingAccount trả lời số dư cộng hạn mức thấu chi lớn hơn hoặc bằng số tiền rút. Hàng monthlyInterest: Account abstract; SavingAccount tính số dư nhân lãi suất chia 1200; CheckingAccount trả 0. Hàng deposit, withdraw, transferTo: viết một lần ở Account, đánh dấu final, hai lớp con kế thừa nguyên, không ghi đè được. Phía dưới: mảng Account[] có hai ô; ô 0 trỏ tới object SavingAccount của Chi, số dư 1000000, rút 1200000 thì canWithdraw trả false nên Thất bại; ô 1 trỏ tới object CheckingAccount của Dũng, số dư 1000000 cộng thấu chi 500000, rút 1200000 thì canWithdraw trả true nên Thành công. Cùng một dòng code acc.withdraw, JVM chọn canWithdraw theo kiểu thật của object lúc chạy.">
  <defs>
    <marker id="c2b8-over-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="160" height="34" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="90" y="32" text-anchor="middle" font-weight="bold" fill="#0F172A">method</text>
    <rect x="170" y="10" width="150" height="34" fill="#EFF6FF" stroke="#94A3B8"/>
    <text x="245" y="32" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#1D4ED8">Account</text>
    <rect x="320" y="10" width="210" height="34" fill="#EFF6FF" stroke="#94A3B8"/>
    <text x="425" y="32" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#1D4ED8">SavingAccount</text>
    <rect x="530" y="10" width="200" height="34" fill="#EFF6FF" stroke="#94A3B8"/>
    <text x="630" y="32" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#1D4ED8">CheckingAccount</text>
    <rect x="10" y="44" width="160" height="34" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="20" y="66" font-family="monospace" fill="#0F172A">canWithdraw(a)</text>
    <rect x="170" y="44" width="150" height="34" fill="#FFFBEB" stroke="#94A3B8"/>
    <text x="245" y="66" text-anchor="middle" fill="#D97706">abstract (trống)</text>
    <rect x="320" y="44" width="210" height="34" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="425" y="66" text-anchor="middle" fill="#0F172A">dư ≥ a</text>
    <rect x="530" y="44" width="200" height="34" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="630" y="66" text-anchor="middle" fill="#0F172A">dư + thấu chi ≥ a</text>
    <rect x="10" y="78" width="160" height="34" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="20" y="100" font-family="monospace" fill="#0F172A">monthlyInterest()</text>
    <rect x="170" y="78" width="150" height="34" fill="#FFFBEB" stroke="#94A3B8"/>
    <text x="245" y="100" text-anchor="middle" fill="#D97706">abstract (trống)</text>
    <rect x="320" y="78" width="210" height="34" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="425" y="100" text-anchor="middle" fill="#0F172A">dư × % / 1200</text>
    <rect x="530" y="78" width="200" height="34" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="630" y="100" text-anchor="middle" fill="#0F172A">0</text>
    <rect x="10" y="112" width="160" height="34" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="20" y="134" font-family="monospace" fill="#0F172A">deposit, withdraw…</text>
    <rect x="170" y="112" width="560" height="34" fill="#ECFDF5" stroke="#94A3B8"/>
    <text x="450" y="134" text-anchor="middle" fill="#047857">final: viết 1 lần ở Account, lớp con kế thừa nguyên, không ghi đè được</text>
    <text x="20" y="180" font-family="monospace" fill="#0F172A">Account[] accounts</text>
    <rect x="20" y="192" width="60" height="30" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="50" y="212" text-anchor="middle" font-family="monospace" fill="#0F172A">[0]</text>
    <rect x="20" y="222" width="60" height="30" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="50" y="242" text-anchor="middle" font-family="monospace" fill="#0F172A">[1]</text>
    <line x1="80" y1="207" x2="196" y2="207" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b8-over-arrow)"/>
    <line x1="80" y1="237" x2="196" y2="276" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b8-over-arrow)"/>
    <rect x="200" y="190" width="250" height="40" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="210" y="214" fill="#0F172A">SavingAccount · Chi · dư 1000000</text>
    <rect x="200" y="256" width="250" height="40" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="210" y="280" fill="#0F172A">CheckingAccount · Dũng · dư 1000000</text>
    <rect x="470" y="190" width="260" height="40" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="600" y="214" text-anchor="middle" fill="#DC2626">1000000 ≥ 1200000? sai → Thất bại</text>
    <rect x="470" y="256" width="260" height="40" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="600" y="280" text-anchor="middle" fill="#047857">1500000 ≥ 1200000? đúng → Thành công</text>
    <text x="370" y="320" text-anchor="middle" fill="#64748B">Cùng dòng acc.withdraw(1200000): JVM chọn canWithdraw theo kiểu THẬT của object lúc chạy</text>
  </g>
</svg>

**File** `src/vn/onward/bank/SavingAccount.java`:

```java
package vn.onward.bank;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class SavingAccount extends Account {
    // 12 tháng × 100 (vì lãi suất ghi theo %): lãi 1 tháng = số dư × lãi suất năm / 1200
    private static final BigDecimal MONTHS_TIMES_100 = new BigDecimal("1200");

    private final BigDecimal annualRatePercent;   // ví dụ 6 nghĩa là 6%/năm

    public SavingAccount(String id, String owner, BigDecimal annualRatePercent) {
        super(id, owner);                         // constructor của Account chạy trước
        this.annualRatePercent = annualRatePercent;
    }

    @Override
    protected boolean canWithdraw(BigDecimal amount) {
        return getBalance().compareTo(amount) >= 0;   // sổ tiết kiệm: không rút quá số dư
    }

    @Override
    public BigDecimal monthlyInterest() {
        return getBalance().multiply(annualRatePercent)
                .divide(MONTHS_TIMES_100, 0, RoundingMode.HALF_UP);   // làm tròn tới đồng
    }

    public Transaction addMonthlyInterest() {
        return credit(Transaction.Type.INTEREST, monthlyInterest(),
                "lãi " + annualRatePercent + "%/năm");
    }
}
```

**File** `src/vn/onward/bank/CheckingAccount.java`:

```java
package vn.onward.bank;

import java.math.BigDecimal;

public class CheckingAccount extends Account {
    private final BigDecimal overdraftLimit;   // hạn mức thấu chi: được tiêu quá số dư tối đa bao nhiêu

    public CheckingAccount(String id, String owner, BigDecimal overdraftLimit) {
        super(id, owner);
        this.overdraftLimit = overdraftLimit;
    }

    @Override
    protected boolean canWithdraw(BigDecimal amount) {
        // được rút tới (số dư + hạn mức thấu chi), nên số dư có thể âm
        return getBalance().add(overdraftLimit).compareTo(amount) >= 0;
    }

    @Override
    public BigDecimal monthlyInterest() {
        return BigDecimal.ZERO;   // tài khoản thanh toán: ví dụ này không trả lãi
    }
}
```

Thử hai loại tài khoản với **cùng một** lời gọi:

**File** `src/vn/onward/bank/app/AccountTypesDemo.java`:

```java
package vn.onward.bank.app;

import java.math.BigDecimal;
import vn.onward.bank.Account;
import vn.onward.bank.CheckingAccount;
import vn.onward.bank.SavingAccount;

public class AccountTypesDemo {
    public static void main(String[] args) {
        // Biến kiểu Account, object thật là hai lớp con khác nhau
        Account[] accounts = {
            new SavingAccount("ACC-101", "Chi", new BigDecimal("6")),
            new CheckingAccount("ACC-102", "Dũng", new BigDecimal("500000"))
        };

        for (Account acc : accounts) {
            acc.deposit(BigDecimal.valueOf(1_000_000));
            // Cùng một lời gọi withdraw(...), mỗi object áp luật canWithdraw của riêng nó
            String result = acc.withdraw(BigDecimal.valueOf(1_200_000)).status().label();
            System.out.println(acc + " | rút 1200000: " + result
                    + " | lãi tháng: " + acc.monthlyInterest());
        }
    }
}
```

```bash
javac -d out src/vn/onward/bank/*.java src/vn/onward/bank/app/*.java
java -cp out vn.onward.bank.app.AccountTypesDemo
```

**Kết quả khi chạy:**

```text
SavingAccount[ACC-101, Chi, số dư 1000000] | rút 1200000: Thất bại | lãi tháng: 5000
CheckingAccount[ACC-102, Dũng, số dư -200000] | rút 1200000: Thành công | lãi tháng: 0
```

**Giải thích từng bước:**

1. `new SavingAccount(...)` chạy constructor của `SavingAccount`. Dòng đầu `super(id, owner)` gọi constructor
   của `Account` trước, rồi mới gán `annualRatePercent` (Bài 4).
2. `acc.deposit(...)`: hai lớp con không viết `deposit`, chúng **kế thừa** nguyên bản `final` của `Account`.
3. `acc.withdraw(1_200_000)` đi vào `debit` của `Account`, rồi gọi `canWithdraw`. Object thật là
   `SavingAccount` nên chạy bản "dư ≥ số rút": 1.000.000 ≥ 1.200.000 sai, phiếu `FAILED`.
4. Ở vòng lặp thứ hai, object thật là `CheckingAccount`: 1.000.000 + 500.000 ≥ 1.200.000 đúng, rút thành công,
   số dư còn -200.000. Số âm ở đây là **hợp lệ**, vì nằm trong hạn mức thấu chi.
5. `monthlyInterest()` của sổ tiết kiệm: 1.000.000 × 6 / 1200 = 5.000 đ. `divide(..., 0, RoundingMode.HALF_UP)`
   làm tròn tới đồng [2]. Của tài khoản thanh toán là `0`.
6. `@Override` nhờ compiler kiểm tra rằng bạn **thật sự** ghi đè một method của lớp cha. Viết sai tên hay sai
   tham số, javac báo lỗi ngay thay vì âm thầm tạo method mới [18] (Bài 4).

### ⚠️ Lỗi hay gặp

Ba lỗi dưới đây là file **thêm vào** `src/vn/onward/bank/`. Thử từng file, xem lỗi, rồi bỏ file ra.

**Lỗi 1: lớp con quên một method `abstract`.** Lớp con không trừu tượng phải hiện thực mọi method `abstract`
của lớp cha [17].

**File** `src/vn/onward/bank/LazyAccount.java`:

```java
package vn.onward.bank;

import java.math.BigDecimal;

public class LazyAccount extends Account {
    public LazyAccount(String id, String owner) {
        super(id, owner);
    }

    @Override
    protected boolean canWithdraw(BigDecimal amount) {
        return false;
    }
    // quên monthlyInterest()
}
```

```text
src/vn/onward/bank/LazyAccount.java:5: error: LazyAccount is not abstract and does not override abstract method monthlyInterest() in Account
public class LazyAccount extends Account {
       ^
1 error
```

**Lỗi 2: ghi đè mà thu hẹp quyền truy cập.** Method cha là `protected` thì bản ghi đè phải là `protected`
hoặc `public` [19].

**File** `src/vn/onward/bank/StrictAccount.java`:

```java
package vn.onward.bank;

import java.math.BigDecimal;

public class StrictAccount extends Account {
    public StrictAccount(String id, String owner) {
        super(id, owner);
    }

    @Override
    private boolean canWithdraw(BigDecimal amount) {   // thu hẹp quyền truy cập
        return false;
    }

    @Override
    public BigDecimal monthlyInterest() {
        return BigDecimal.ZERO;
    }
}
```

```text
src/vn/onward/bank/StrictAccount.java:11: error: canWithdraw(BigDecimal) in StrictAccount cannot override canWithdraw(BigDecimal) in Account
    private boolean canWithdraw(BigDecimal amount) {   // thu hẹp quyền truy cập
                    ^
  attempting to assign weaker access privileges; was protected
1 error
```

**Lỗi 3: ghi đè method `final`.** Muốn "tặng 10.000 đ mỗi lần nạp" bằng cách ghi đè `deposit`? Không được,
vì ghi đè method `final` là lỗi biên dịch [13].

**File** `src/vn/onward/bank/BonusAccount.java`:

```java
package vn.onward.bank;

import java.math.BigDecimal;

public class BonusAccount extends SavingAccount {
    public BonusAccount(String id, String owner) {
        super(id, owner, new BigDecimal("6"));
    }

    @Override
    public Transaction deposit(BigDecimal amount) {    // deposit là final trong Account
        return super.deposit(amount.add(new BigDecimal("10000")));
    }
}
```

```text
src/vn/onward/bank/BonusAccount.java:11: error: deposit(BigDecimal) in BonusAccount cannot override deposit(BigDecimal) in Account
    public Transaction deposit(BigDecimal amount) {    // deposit là final trong Account
                       ^
  overridden method is final
1 error
```

**Cách sửa:** nếu tiền thưởng là nghiệp vụ thật, thêm một method riêng như `addBonus()` dùng `credit(...)`
(giống `addMonthlyInterest`). Khoản thưởng khi đó có **phiếu riêng**, nên vẫn kiểm toán được.

## 5. Chạy demo: nạp, rút, chuyển và lịch sử giao dịch

**Ý tưởng nôm na.** Một ngày làm việc ở quầy: An gửi tiền, rút tiền, chuyển cho Bình; Bình dùng thấu chi rồi
thử chuyển một khoản quá lớn. Cuối ngày, in **sao kê** của từng tài khoản và cộng tổng để đối chiếu.

<svg viewBox="0 0 740 370" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Luồng chuyển tiền an.transferTo(binh, 3000000) giữa hai object. Ba cột: BankDemo, object an kiểu SavingAccount, object binh kiểu CheckingAccount. Bước 1: BankDemo gọi transferTo trên an. Bước 2: an tự gọi debit loại TRANSFER_OUT, canWithdraw của SavingAccount trả đúng vì 8000000 lớn hơn 3000000, số dư an từ 8000000 còn 5000000, ghi phiếu GD-006 vào lịch sử của an. Bước 3: an gọi binh.credit loại TRANSFER_IN, số dư binh từ âm 300000 thành 2700000, ghi phiếu GD-007 vào lịch sử của binh. Bước 4: trả true về BankDemo. Khung đỏ phía dưới: lời gọi binh.transferTo(an, 9000000) thất bại ngay ở debit vì 2700000 cộng thấu chi 500000 nhỏ hơn 9000000, chỉ ghi phiếu GD-008 FAILED cho binh, trả false, và an không được cộng đồng nào.">
  <defs>
    <marker id="c2b8-transfer-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#1D4ED8"/>
    </marker>
    <marker id="c2b8-transfer-ret" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#047857"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="20" y="10" width="140" height="34" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="90" y="32" text-anchor="middle" font-family="monospace" fill="#0F172A">BankDemo</text>
    <rect x="250" y="10" width="200" height="34" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="350" y="32" text-anchor="middle" font-family="monospace" fill="#1D4ED8">an : SavingAccount</text>
    <rect x="520" y="10" width="200" height="34" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="620" y="32" text-anchor="middle" font-family="monospace" fill="#1D4ED8">binh : CheckingAccount</text>
    <line x1="90" y1="44" x2="90" y2="256" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <line x1="350" y1="44" x2="350" y2="256" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <line x1="620" y1="44" x2="620" y2="256" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <line x1="90" y1="72" x2="344" y2="72" stroke="#1D4ED8" stroke-width="1.5" marker-end="url(#c2b8-transfer-arrow)"/>
    <text x="100" y="66" font-family="monospace" fill="#0F172A">1. transferTo(binh, 3000000)</text>
    <rect x="200" y="86" width="300" height="56" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="210" y="104" fill="#0F172A">2. debit(TRANSFER_OUT): canWithdraw đúng</text>
    <text x="210" y="120" font-family="monospace" fill="#0F172A">8000000 → 5000000</text>
    <text x="210" y="136" fill="#047857">ghi GD-006 vào history của an</text>
    <line x1="350" y1="160" x2="614" y2="160" stroke="#1D4ED8" stroke-width="1.5" marker-end="url(#c2b8-transfer-arrow)"/>
    <text x="360" y="154" font-family="monospace" fill="#0F172A">3. binh.credit(TRANSFER_IN, …)</text>
    <rect x="490" y="172" width="240" height="56" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="500" y="190" fill="#0F172A">cộng tiền cho binh</text>
    <text x="500" y="206" font-family="monospace" fill="#0F172A">-300000 → 2700000</text>
    <text x="500" y="222" fill="#047857">ghi GD-007 vào history của binh</text>
    <line x1="350" y1="246" x2="96" y2="246" stroke="#047857" stroke-width="1.5" marker-end="url(#c2b8-transfer-ret)"/>
    <text x="220" y="240" text-anchor="middle" fill="#047857">4. return true</text>
    <rect x="20" y="272" width="710" height="88" rx="10" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="34" y="294" font-family="monospace" fill="#DC2626">binh.transferTo(an, 9000000)</text>
    <text x="34" y="314" fill="#0F172A">debit thất bại: 2700000 + thấu chi 500000 = 3200000 &lt; 9000000</text>
    <text x="34" y="334" fill="#0F172A">→ chỉ ghi GD-008 FAILED cho binh, return false</text>
    <text x="34" y="352" fill="#DC2626">→ bước 3 không chạy: an không được cộng đồng nào</text>
  </g>
</svg>

**File** `src/vn/onward/bank/app/BankDemo.java`:

```java
package vn.onward.bank.app;

import java.math.BigDecimal;
import vn.onward.bank.Account;
import vn.onward.bank.CheckingAccount;
import vn.onward.bank.SavingAccount;
import vn.onward.bank.Transaction;

public class BankDemo {
    public static void main(String[] args) {
        SavingAccount an = new SavingAccount("ACC-001", "An", new BigDecimal("6"));
        CheckingAccount binh = new CheckingAccount("ACC-002", "Bình", vnd(500_000));

        an.deposit(vnd(10_000_000));             // 1. nạp
        binh.deposit(vnd(1_000_000));
        an.withdraw(vnd(2_000_000));             // 2. rút hợp lệ
        an.withdraw(vnd(50_000_000));            // 3. rút quá số dư: FAILED
        binh.withdraw(vnd(1_300_000));           // 4. dùng thấu chi: số dư âm
        an.transferTo(binh, vnd(3_000_000));     // 5. chuyển An -> Bình
        binh.transferTo(an, vnd(9_000_000));     // 6. vượt hạn mức: FAILED
        an.addMonthlyInterest();                 // 7. cộng lãi tháng cho sổ tiết kiệm

        Account[] accounts = { an, binh };
        for (Account acc : accounts) {
            System.out.println(acc);
            for (Transaction tx : acc.getHistory()) {
                System.out.println("  " + tx.line());
            }
        }
        System.out.println("Tổng số dư: " + an.getBalance().add(binh.getBalance()));
    }

    // Đổi số đồng (long) sang BigDecimal; valueOf(long) chính xác tuyệt đối
    private static BigDecimal vnd(long dong) {
        return BigDecimal.valueOf(dong);
    }
}
```

```bash
javac -d out src/vn/onward/bank/*.java src/vn/onward/bank/app/*.java
java -cp out vn.onward.bank.app.BankDemo
```

**Kết quả khi chạy:**

```text
SavingAccount[ACC-001, An, số dư 5025000]
  GD-001 DEPOSIT       10000000  Thành công số dư  10000000
  GD-003 WITHDRAWAL     2000000  Thành công số dư   8000000
  GD-004 WITHDRAWAL    50000000  Thất bại   số dư   8000000  vượt hạn mức rút
  GD-006 TRANSFER_OUT   3000000  Thành công số dư   5000000  ACC-001 -> ACC-002
  GD-009 INTEREST         25000  Thành công số dư   5025000  lãi 6%/năm
CheckingAccount[ACC-002, Bình, số dư 2700000]
  GD-002 DEPOSIT        1000000  Thành công số dư   1000000
  GD-005 WITHDRAWAL     1300000  Thành công số dư   -300000
  GD-007 TRANSFER_IN    3000000  Thành công số dư   2700000  ACC-001 -> ACC-002
  GD-008 TRANSFER_OUT   9000000  Thất bại   số dư   2700000  vượt hạn mức rút
Tổng số dư: 7725000
```

**Giải thích từng bước** (theo mã phiếu, cũng là thứ tự thực thi):

1. `GD-001`, `GD-002`: An nạp 10.000.000, Bình nạp 1.000.000.
2. `GD-003`: An rút 2.000.000, còn 8.000.000.
3. `GD-004`: An rút 50.000.000. `SavingAccount.canWithdraw` trả `false`, phiếu `FAILED`. Cột "số dư" vẫn là
   8.000.000: **bị từ chối nhưng vẫn có dấu vết**.
4. `GD-005`: Bình rút 1.300.000. 1.000.000 + 500.000 thấu chi ≥ 1.300.000 nên được, số dư -300.000.
5. `GD-006`, `GD-007`: An chuyển 3.000.000 cho Bình. Một lần chuyển sinh **hai** phiếu: `TRANSFER_OUT` trong
   lịch sử của An, `TRANSFER_IN` trong lịch sử của Bình. An còn 5.000.000, Bình lên 2.700.000.
6. `GD-008`: Bình chuyển 9.000.000. 2.700.000 + 500.000 = 3.200.000 < 9.000.000, `debit` thất bại,
   `transferTo` trả `false` **trước khi** cộng cho An. An không có phiếu nào cho lần này.
7. `GD-009`: lãi tháng của An: 5.000.000 × 6 / 1200 = 25.000, số dư 5.025.000.
8. Đối chiếu: nạp 11.000.000, rút 3.300.000 (2.000.000 + 1.300.000), lãi 25.000. 11.000.000 − 3.300.000 +
   25.000 = 7.725.000, khớp dòng "Tổng số dư". Chuyển khoản không làm tiền tự sinh ra hay mất đi.
9. Vòng `for (Account acc : accounts)` gọi `acc.getHistory()` và `toString()` trên biến kiểu `Account`, nhưng
   dòng đầu in `SavingAccount[...]` hay `CheckingAccount[...]` theo object thật: `getClass()` trả về class **lúc
   chạy** của object [20], và `getSimpleName()` lấy tên ngắn của class đó.

### ⚠️ Lỗi hay gặp

**Lỗi 1: chuyển tiền sai thứ tự, không kiểm tra kết quả.** Viết chuyển khoản bằng hai lời gọi rời ở bên ngoài
rất dễ sai:

**File** `src/vn/onward/bank/app/WrongOrderTransfer.java`:

```java
package vn.onward.bank.app;

import java.math.BigDecimal;
import vn.onward.bank.Account;
import vn.onward.bank.SavingAccount;

public class WrongOrderTransfer {
    public static void main(String[] args) {
        Account an = new SavingAccount("ACC-001", "An", new BigDecimal("6"));
        Account binh = new SavingAccount("ACC-002", "Bình", new BigDecimal("6"));
        an.deposit(BigDecimal.valueOf(1_000_000));

        // SAI: cộng cho người nhận trước, rồi mới rút của người gửi, không kiểm tra kết quả
        BigDecimal amount = BigDecimal.valueOf(5_000_000);
        binh.deposit(amount);
        an.withdraw(amount);   // thất bại vì An chỉ có 1000000

        System.out.println(an);
        System.out.println(binh);
        System.out.println("Tổng số dư: " + an.getBalance().add(binh.getBalance()));
    }
}
```

```text
SavingAccount[ACC-001, An, số dư 1000000]
SavingAccount[ACC-002, Bình, số dư 5000000]
Tổng số dư: 6000000
```

Tiền thật đi vào hệ thống chỉ có 1.000.000 (lần nạp của An). Sau lần "chuyển khoản" lỗi, tổng số dư thành
6.000.000: Bình được cộng 5.000.000, trong khi lệnh rút của An thất bại. Tiền đã tự sinh ra. **Cách sửa:** dùng `transferTo`: rút trước, kiểm tra trạng thái, thành công mới cộng. Logic
này nằm **trong** `Account`, nên không ai phải nhớ viết lại cho đúng.

**Lỗi 2: tưởng lịch sử bị mất phiếu vì mã nhảy cóc.** Lịch sử của An là `GD-001, 003, 004, 006, 009`. Không
có phiếu nào mất: bộ đếm `nextTxNo` là `static`, dùng chung cho **mọi** tài khoản, nên các số còn lại nằm ở
lịch sử của Bình. Muốn đếm riêng từng tài khoản thì bộ đếm phải là field **instance**.

## 6. Giải thích bằng lời: vì sao Java luôn pass-by-value

**Ý tưởng nôm na.** Bạn có tờ giấy ghi **số két** của mình. Khi nhờ nhân viên làm việc, bạn đưa họ một **bản
photo** tờ giấy đó.

- Nhân viên dùng bản photo mở **đúng két** của bạn, bỏ tiền vào. Két của bạn đổi thật.
- Nhân viên tẩy số trên bản photo, ghi số một két khác. Tờ giấy **gốc** của bạn vẫn ghi số cũ.

Java luôn đưa bản photo. Với kiểu nguyên thuỷ, bản photo là con số. Với object, bản photo là **giá trị tham
chiếu** ("địa chỉ" của object). Khi method được gọi, giá trị của các đối số được dùng để khởi tạo **biến tham
số mới** [21], nằm trong một khung (*frame*) mới của method [22]. Tài liệu Oracle nói
thẳng: tham số kiểu tham chiếu, như object, **cũng** được truyền theo giá trị [23]. Bài 6 đã học kỹ
cơ chế này. Ở đây ta làm thí nghiệm trên chính các class của checkpoint.

<svg viewBox="0 0 740 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thí nghiệm 2 trong bộ nhớ: Java truyền bản sao giá trị tham chiếu. Bên trái là stack với hai khung. Khung main có biến an giữ tham chiếu tới object 1 trên heap là SavingAccount ACC-001 của An, số dư 1050000. Khi gọi replaceWithNew(an), Java tạo khung mới và chép giá trị của an, tức địa chỉ của object 1, vào tham số acc. Lúc đầu acc cũng trỏ tới object 1, vẽ bằng mũi tên nét đứt. Sau dòng acc = new SavingAccount(ACC-999...), chỉ ô acc đổi sang trỏ tới object 2 là ACC-999 số dư 9000000. Ô an trong khung main không hề bị chạm tới, vẫn trỏ object 1. Khi method kết thúc, khung replaceWithNew biến mất, object 2 không còn ai trỏ tới.">
  <defs>
    <marker id="c2b8-pbv-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
    <marker id="c2b8-pbv-old" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#94A3B8"/>
    </marker>
    <marker id="c2b8-pbv-new" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#D97706"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="150" y="22" text-anchor="middle" font-weight="bold" fill="#0F172A">Stack</text>
    <text x="560" y="22" text-anchor="middle" font-weight="bold" fill="#0F172A">Heap</text>
    <rect x="10" y="34" width="280" height="96" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="22" y="54" fill="#64748B">khung main()</text>
    <text x="30" y="92" font-family="monospace" fill="#0F172A">an</text>
    <rect x="80" y="74" width="110" height="30" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="116" y="94" text-anchor="middle" font-family="monospace" fill="#1D4ED8">#1</text>
    <circle cx="170" cy="89" r="4" fill="#2563EB"/>
    <text x="22" y="122" fill="#64748B">ô an chứa "địa chỉ" #1</text>
    <rect x="10" y="180" width="280" height="120" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="22" y="200" fill="#64748B">khung replaceWithNew(acc)</text>
    <text x="30" y="238" font-family="monospace" fill="#0F172A">acc</text>
    <rect x="80" y="220" width="110" height="30" rx="4" fill="#FFFFFF" stroke="#D97706"/>
    <text x="116" y="240" text-anchor="middle" font-family="monospace" fill="#D97706">#1 → #2</text>
    <circle cx="176" cy="235" r="4" fill="#D97706"/>
    <text x="22" y="272" fill="#0F172A">vào method: acc = BẢN SAO của #1</text>
    <text x="22" y="290" fill="#0F172A">acc = new …: chỉ ô acc đổi</text>
    <line x1="116" y1="132" x2="116" y2="174" stroke="#64748B" stroke-width="1.5" stroke-dasharray="5 3" marker-end="url(#c2b8-pbv-old)"/>
    <text x="126" y="158" fill="#64748B">chép giá trị #1</text>
    <rect x="430" y="50" width="290" height="70" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="442" y="72" fill="#1D4ED8" font-weight="bold">object #1 · SavingAccount</text>
    <text x="442" y="100" font-family="monospace" fill="#0F172A">ACC-001, An, 1050000</text>
    <rect x="430" y="210" width="290" height="70" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="442" y="232" fill="#D97706" font-weight="bold">object #2 · SavingAccount</text>
    <text x="442" y="260" font-family="monospace" fill="#0F172A">ACC-999, Người lạ, 9000000</text>
    <line x1="174" y1="89" x2="424" y2="85" stroke="#2563EB" stroke-width="2" marker-end="url(#c2b8-pbv-arrow)"/>
    <line x1="180" y1="232" x2="424" y2="104" stroke="#94A3B8" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#c2b8-pbv-old)"/>
    <text x="352" y="168" fill="#64748B">lúc vào</text>
    <line x1="180" y1="238" x2="424" y2="244" stroke="#D97706" stroke-width="2" marker-end="url(#c2b8-pbv-new)"/>
    <text x="300" y="258" fill="#D97706">sau acc = new …</text>
    <rect x="10" y="314" width="720" height="38" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="370" y="338" text-anchor="middle" fill="#047857">Method kết thúc: khung vàng biến mất, an vẫn trỏ #1 (1050000). Object #2 không còn ai trỏ tới.</text>
  </g>
</svg>

**File** `src/vn/onward/bank/app/PassByValueLab.java`, đoạn 1/2: main:

```java
package vn.onward.bank.app;

import java.math.BigDecimal;
import vn.onward.bank.Account;
import vn.onward.bank.CheckingAccount;
import vn.onward.bank.SavingAccount;

public class PassByValueLab {
    public static void main(String[] args) {
        Account an = new SavingAccount("ACC-001", "An", new BigDecimal("6"));
        an.deposit(BigDecimal.valueOf(1_000_000));

        depositBonus(an);                                   // Thí nghiệm 1
        System.out.println("1) main thấy: " + an);

        replaceWithNew(an);                                 // Thí nghiệm 2
        System.out.println("2) main thấy: " + an);

        Account binh = new CheckingAccount("ACC-002", "Bình", BigDecimal.ZERO);
        swap(an, binh);                                     // Thí nghiệm 3
        System.out.println("3) an = " + an.getId() + ", binh = " + binh.getId());

        BigDecimal fee = BigDecimal.valueOf(10_000);
        addFee(fee);                                        // Thí nghiệm 4
        System.out.println("4) fee = " + fee);
    }
```

**Đoạn 2/2** (ghép tiếp ngay sau đoạn 1): bốn method thí nghiệm.

```java
    static void depositBonus(Account acc) {                // acc: BẢN SAO tham chiếu
        acc.deposit(BigDecimal.valueOf(50_000));            // đi theo bản sao tới CÙNG object
    }

    static void replaceWithNew(Account acc) {
        acc = new SavingAccount("ACC-999", "Người lạ", BigDecimal.ONE);  // chỉ đổi bản sao
        acc.deposit(BigDecimal.valueOf(9_000_000));
        System.out.println("   trong replaceWithNew: " + acc);
    }

    static void swap(Account a, Account b) {               // đổi chỗ hai BẢN SAO
        Account tmp = a;
        a = b;
        b = tmp;
    }

    static void addFee(BigDecimal fee) {
        fee = fee.add(BigDecimal.valueOf(5_000));           // add() tạo object MỚI, gán vào bản sao
    }
}
```

```bash
javac -d out src/vn/onward/bank/*.java src/vn/onward/bank/app/*.java
java -cp out vn.onward.bank.app.PassByValueLab
```

**Kết quả khi chạy:**

```text
1) main thấy: SavingAccount[ACC-001, An, số dư 1050000]
   trong replaceWithNew: SavingAccount[ACC-999, Người lạ, số dư 9000000]
2) main thấy: SavingAccount[ACC-001, An, số dư 1050000]
3) an = ACC-001, binh = ACC-002
4) fee = 10000
```

**Giải thích từng bước:**

1. **Thí nghiệm 1** `depositBonus(an)`: `acc` nhận bản sao giá trị của `an`, tức cùng "địa chỉ" object #1.
   `acc.deposit(...)` đi theo địa chỉ đó và sửa **chính object** #1. `main` thấy 1.050.000. Sửa được object
   **không** chứng minh pass-by-reference: chỉ cần có bản sao địa chỉ là đủ.
2. **Thí nghiệm 2** `replaceWithNew(an)`: dòng `acc = new SavingAccount(...)` chỉ ghi đè **ô `acc`** trong khung
   của method. Ô `an` trong `main` không bị chạm tới, nên `main` vẫn thấy ACC-001 với 1.050.000. Nếu Java là
   pass-by-reference, `an` đã bị đổi thành ACC-999.
3. **Thí nghiệm 3** `swap(an, binh)`: đổi chỗ hai **bản sao**. Hai biến của `main` giữ nguyên. Trong Java,
   không viết được method `swap` đổi hai biến của bên gọi, vì method chỉ có trong tay các biến tham số mới
   [21].
4. **Thí nghiệm 4** `addFee(fee)`: `fee.add(...)` tạo một `BigDecimal` **mới** (vì bất biến [2]) và
   gán vào bản sao `fee`. Biến `fee` của `main` vẫn là 10000.

**Câu trả lời mẫu cho buổi phỏng vấn** (khoảng 30 giây):

> "Java luôn truyền theo giá trị. Với kiểu nguyên thuỷ, method nhận bản sao con số. Với object, biến chỉ giữ
> tham chiếu, và method nhận **bản sao của tham chiếu** đó. Vì cùng trỏ tới một object, method gọi
> `account.deposit()` thì bên gọi thấy số dư đổi. Nhưng nếu method gán tham số sang object khác, hay viết `swap`,
> thì biến của bên gọi không đổi. Đó là dấu hiệu của pass-by-value: Java không có cách nào để method thay
> chính biến của bên gọi."

### ⚠️ Lỗi hay gặp

**Lỗi 1: method "chỉ hỏi thử" mà sửa object thật.** Vì tham số trỏ tới **cùng** object, mọi method có tác dụng
phụ (*side effect*) gọi qua tham số đều tác động lên object của bên gọi:

**File** `src/vn/onward/bank/app/SideEffect.java`:

```java
package vn.onward.bank.app;

import java.math.BigDecimal;
import vn.onward.bank.Account;
import vn.onward.bank.SavingAccount;
import vn.onward.bank.TransactionStatus;

public class SideEffect {
    public static void main(String[] args) {
        Account an = new SavingAccount("ACC-001", "An", new BigDecimal("6"));
        an.deposit(BigDecimal.valueOf(1_000_000));

        boolean ok = canAfford(an, BigDecimal.valueOf(300_000));
        System.out.println("Đủ tiền? " + ok + " | " + an);
    }

    // Ý định: chỉ "hỏi thử" có rút được không
    static boolean canAfford(Account acc, BigDecimal amount) {
        return acc.withdraw(amount).status() == TransactionStatus.COMPLETED; // RÚT THẬT!
    }
}
```

```text
Đủ tiền? true | SavingAccount[ACC-001, An, số dư 700000]
```

Chỉ "hỏi" mà An mất 300.000. Tệ hơn, lịch sử của An có thêm một phiếu rút thật. **Cách sửa:** câu hỏi thì dùng
method chỉ đọc. Ví dụ: so `acc.getBalance().compareTo(amount) >= 0` cho tài khoản tiết kiệm, hoặc thêm một
method `public` chỉ đọc vào `Account` để gọi `canWithdraw` mà không đổi gì.

**Lỗi 2: "cộng dồn" vào tham số `BigDecimal` rồi mong bên gọi thấy.** Như thí nghiệm 4: `fee = fee.add(...)`
chỉ đổi bản sao. **Cách sửa:** trả kết quả về, ví dụ `static BigDecimal addFee(BigDecimal fee)` rồi ở `main`
viết `fee = addFee(fee);`.

## 7. Checklist tự đánh giá

**Ý tưởng nôm na.** Cuối ngày, kiểm soát viên rà một danh sách: két đã khoá chưa, phiếu đã đủ chưa, sổ có khớp
không. Trước khi sang Chặng 3, bạn cũng rà danh sách dưới đây. Ý nào chưa "có" thì quay lại bài tương ứng.

<svg viewBox="0 0 740 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Checkpoint dùng lại kiến thức của cả 7 bài Chặng 2. Bài 1, package và access modifier: package vn.onward.bank và vn.onward.bank.app, private, protected, public. Bài 2, đóng gói và method: balance private, chỉ đổi qua deposit, withdraw, transferTo. Bài 3, static, final, vòng đời: bộ đếm static nextTxNo, field final id và owner, hằng static final. Bài 4, kế thừa và ghi đè: extends Account, super(...), @Override, deposit final. Bài 5, trừu tượng và interface: abstract class Account với canWithdraw và monthlyInterest. Bài 6, binding và truyền tham số: canWithdraw được chọn lúc chạy, PassByValueLab. Bài 7, enum, record, nested class: enum TransactionStatus, record Transaction, enum Type lồng trong record. Cuối hình: qua checkpoint thì sang Chặng 3 với exception và collections.">
  <defs>
    <marker id="c2b8-check-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="130" y="20" text-anchor="middle" fill="#64748B">Bài đã học (Chặng 2)</text>
    <text x="520" y="20" text-anchor="middle" fill="#64748B">Dùng ở đâu trong project</text>
    <rect x="10" y="30" width="250" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="50" fill="#1D4ED8">Bài 1 · Package, access modifier</text>
    <line x1="260" y1="45" x2="306" y2="45" stroke="#64748B" marker-end="url(#c2b8-check-arrow)"/>
    <rect x="310" y="30" width="420" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="322" y="50" font-family="monospace" font-size="11" fill="#0F172A">vn.onward.bank + .app; private / protected / public</text>
    <rect x="10" y="68" width="250" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="88" fill="#1D4ED8">Bài 2 · Đóng gói và method</text>
    <line x1="260" y1="83" x2="306" y2="83" stroke="#64748B" marker-end="url(#c2b8-check-arrow)"/>
    <rect x="310" y="68" width="420" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="322" y="88" font-family="monospace" font-size="11" fill="#0F172A">balance private; chỉ đổi qua deposit/withdraw/transferTo</text>
    <rect x="10" y="106" width="250" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="126" fill="#1D4ED8">Bài 3 · static, final, vòng đời</text>
    <line x1="260" y1="121" x2="306" y2="121" stroke="#64748B" marker-end="url(#c2b8-check-arrow)"/>
    <rect x="310" y="106" width="420" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="322" y="126" font-family="monospace" font-size="11" fill="#0F172A">static nextTxNo; final id, owner; static final hằng</text>
    <rect x="10" y="144" width="250" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="164" fill="#1D4ED8">Bài 4 · Kế thừa và ghi đè</text>
    <line x1="260" y1="159" x2="306" y2="159" stroke="#64748B" marker-end="url(#c2b8-check-arrow)"/>
    <rect x="310" y="144" width="420" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="322" y="164" font-family="monospace" font-size="11" fill="#0F172A">extends Account; super(...); @Override; final deposit</text>
    <rect x="10" y="182" width="250" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="202" fill="#1D4ED8">Bài 5 · Trừu tượng, interface</text>
    <line x1="260" y1="197" x2="306" y2="197" stroke="#64748B" marker-end="url(#c2b8-check-arrow)"/>
    <rect x="310" y="182" width="420" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="322" y="202" font-family="monospace" font-size="11" fill="#0F172A">abstract Account: canWithdraw, monthlyInterest</text>
    <rect x="10" y="220" width="250" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="240" fill="#1D4ED8">Bài 6 · Binding, truyền tham số</text>
    <line x1="260" y1="235" x2="306" y2="235" stroke="#64748B" marker-end="url(#c2b8-check-arrow)"/>
    <rect x="310" y="220" width="420" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="322" y="240" font-family="monospace" font-size="11" fill="#0F172A">canWithdraw chọn lúc chạy; PassByValueLab</text>
    <rect x="10" y="258" width="250" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="278" fill="#1D4ED8">Bài 7 · Enum, record, nested</text>
    <line x1="260" y1="273" x2="306" y2="273" stroke="#64748B" marker-end="url(#c2b8-check-arrow)"/>
    <rect x="310" y="258" width="420" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="322" y="278" font-family="monospace" font-size="11" fill="#0F172A">TransactionStatus; record Transaction; enum Type lồng</text>
    <rect x="10" y="300" width="720" height="32" rx="16" fill="#ECFDF5" stroke="#10B981"/>
    <text x="370" y="321" text-anchor="middle" fill="#047857">Qua checkpoint → Chặng 3: exception thay cho FAILED âm thầm, collections cho lịch sử và tra cứu</text>
  </g>
</svg>

Có một phần kiểm tra mà máy làm giúp bạn: `javap -p` liệt kê **mọi** thành phần, kể cả `private` [9]. Dùng
nó để soát lại phần đóng gói của `Account`:

```bash
javap -p -cp out vn.onward.bank.Account
```

**Kết quả khi chạy:**

```text
Compiled from "Account.java"
public abstract class vn.onward.bank.Account {
  private static int nextTxNo;
  private final java.lang.String id;
  private final java.lang.String owner;
  private java.math.BigDecimal balance;
  private final java.util.List<vn.onward.bank.Transaction> history;
  protected vn.onward.bank.Account(java.lang.String, java.lang.String);
  protected abstract boolean canWithdraw(java.math.BigDecimal);
  public abstract java.math.BigDecimal monthlyInterest();
  public java.lang.String getId();
  public java.lang.String getOwner();
  public java.math.BigDecimal getBalance();
  public java.util.List<vn.onward.bank.Transaction> getHistory();
  public final vn.onward.bank.Transaction deposit(java.math.BigDecimal);
  public final vn.onward.bank.Transaction withdraw(java.math.BigDecimal);
  public final boolean transferTo(vn.onward.bank.Account, java.math.BigDecimal);
  protected final vn.onward.bank.Transaction credit(vn.onward.bank.Transaction$Type, java.math.BigDecimal, java.lang.String);
  private vn.onward.bank.Transaction debit(vn.onward.bank.Transaction$Type, java.math.BigDecimal, java.lang.String);
  private vn.onward.bank.Transaction log(vn.onward.bank.Transaction$Type, java.math.BigDecimal, vn.onward.bank.TransactionStatus, java.lang.String);
  public java.lang.String toString();
  static {};
}
```

**Giải thích từng bước** (đọc kết quả `javap` như đọc biên bản kiểm tra):

1. Năm dòng field đều bắt đầu bằng `private`. Không field nào lộ ra ngoài (Bài 2).
2. `id`, `owner`, `history` là `final`: gán một lần trong constructor hoặc tại chỗ khai báo (Bài 3). `balance`
   **không** `final` vì nó phải đổi, nhưng chỉ `debit` và `credit` gán lại nó.
3. `deposit`, `withdraw`, `transferTo` là `public final`. `credit` là `protected final`. `debit`, `log` là
   `private` (Bài 1, Bài 4).
4. `canWithdraw` là `protected abstract`, `monthlyInterest` là `public abstract`. Class là `public abstract`
   (Bài 5).

**Chương trình:**

- [ ] Cây thư mục khớp tên package; biên dịch sạch bằng `javac -d out src/vn/onward/bank/*.java src/vn/onward/bank/app/*.java` ([Bài 1](/docs/learning/chang-2/package-va-access-modifier)).
- [ ] Chạy bằng tên đầy đủ, ví dụ `java -cp out vn.onward.bank.app.BankDemo`.
- [ ] `BankDemo` in đúng 9 phiếu, tổng số dư 7725000.
- [ ] `javap -p` cho thấy mọi field của `Account` là `private` ([Bài 2](/docs/learning/chang-2/dong-goi-va-method)).
- [ ] Mã phiếu không trùng giữa các tài khoản nhờ bộ đếm `static` ([Bài 3](/docs/learning/chang-2/static-final-vong-doi-object)).
- [ ] Hai lớp con dùng `super(...)` và `@Override`; không ghi đè được `deposit` ([Bài 4](/docs/learning/chang-2/ke-thua-va-ghi-de)).
- [ ] `new Account(...)` báo lỗi biên dịch ([Bài 5](/docs/learning/chang-2/truu-tuong-va-interface)).
- [ ] `Transaction` là `record`, có compact constructor; `TransactionStatus` là `enum` có field ([Bài 7](/docs/learning/chang-2/enum-record-nested-class)).
- [ ] Không có `double` hay `float` nào dính tới tiền; so tiền bằng `compareTo`.

**Giải thích được bằng lời** (nói to cho một người bạn nghe):

- [ ] Vì sao `deposit` là `final` còn `canWithdraw` là `abstract`?
- [ ] Vì sao giao dịch bị từ chối vẫn cần phiếu `FAILED`?
- [ ] Vì sao `AccountTypesDemo` gọi cùng `withdraw` mà kết quả khác nhau ([Bài 6](/docs/learning/chang-2/binding-va-truyen-tham-so))?
- [ ] Vì sao Java luôn pass-by-value, kể cả khi truyền object? Dẫn được thí nghiệm 1 và 2 của phần 6.

### ⚠️ Lỗi hay gặp

**Lỗi 1: soát bằng `javap` mà quên `-p`.** Không có `-p`, `javap` ẩn mọi thành phần `private` (như kết quả ở
phần 3). Bạn sẽ tưởng `Account` "không có field nào" và bỏ sót việc kiểm tra. **Cách sửa:** dùng `javap -p`.

**Lỗi 2: tick checklist dựa trên thư mục `out` cũ.** File `.class` của lần biên dịch trước, ví dụ một
`LazyAccount.class` đã thử ở phần 4, vẫn còn nằm trong `out` dù bạn đã bỏ file `.java`. **Cách sửa:** trước khi
tick, biên dịch lại vào một thư mục mới, ví dụ `javac -d out2 ...` rồi `java -cp out2 ...`, để chắc rằng chỉ
code hiện tại được chạy.

## Hướng mở rộng sang Chặng 3

Project này cố ý dừng ở những gì Chặng 2 đã dạy. Ba chỗ "còn thô" sẽ được nâng cấp ở Chặng 3:

- **Exception thay cho `FAILED` âm thầm.** Hiện `withdraw` trả về phiếu `FAILED`, và người gọi có thể quên kiểm
  tra (như lỗi chuyển khoản ở phần 5). Chặng 3 sẽ dạy exception tự định nghĩa, ví dụ
  `InsufficientFundsException`, để lỗi không thể bị lờ đi. Số tiền `null` hiện làm chương trình văng
  `NullPointerException` ngay ở `amount.signum()` (đã chạy thử); exception có thông báo rõ ràng là cách xử lý
  chỗ này cho đàng hoàng.
- **Collections cho lịch sử và tra cứu.** Tìm tài khoản theo mã `ACC-001` bằng `Map`, gom phiếu theo ngày, lọc
  phiếu `FAILED`. Checkpoint Chặng 3 chính là một bộ xử lý sao kê như vậy, xem
  [Lộ trình Java Developer](/docs/learning/java-roadmap).
- **Lambda và `Optional`.** Lọc lịch sử bằng lambda, và trả về `Optional` thay vì `null` khi tìm không thấy tài
  khoản.

## Tóm tắt

- Project nhiều file: thư mục khớp tên package, biên dịch bằng `javac -d out`, chạy bằng `java -cp out` với
  **tên đầy đủ** của class.
- `TransactionStatus` là `enum` có field; `Transaction` là `record`: field `private final`, accessor, `equals`/
  `hashCode`/`toString` sinh sẵn, compact constructor để kiểm tra và chuẩn hoá dữ liệu.
- `Account` trừu tượng giữ `balance` ở `private`. Quy trình chung là `public final`, phần khác nhau là
  `abstract`, phần cho lớp con dùng là `protected`.
- `SavingAccount` và `CheckingAccount` gọi `super(...)` và ghi đè `canWithdraw`, `monthlyInterest`. Cùng một lời
  gọi, JVM chọn bản ghi đè theo kiểu thật của object.
- Mọi thay đổi số dư đều sinh phiếu; giao dịch bị từ chối có phiếu `FAILED` và số dư không đổi.
- So tiền bằng `compareTo`, không bằng `equals`. Trả lịch sử ra ngoài bằng `List.copyOf`.
- Java luôn pass-by-value: object được "truyền" bằng **bản sao tham chiếu**. Sửa object qua tham số thì bên gọi
  thấy; gán tham số sang object khác thì bên gọi không thấy.

## Tự kiểm tra

**Câu 1.** (Mục tiêu 1) File `BankDemo.java` nằm ở `src/vn/onward/bank/app/`. Dòng `package` đầu file phải
viết gì, và lệnh nào chạy nó sau khi biên dịch vào `out`?

<details><summary>Đáp án</summary>

`package vn.onward.bank.app;`. Chạy bằng `java -cp out vn.onward.bank.app.BankDemo`. Gõ `java -cp out BankDemo`
sẽ báo `ClassNotFoundException`, vì lệnh `java` cần **tên đầy đủ** của class.

</details>

**Câu 2.** (Mục tiêu 2) Kể bốn thứ compiler tự sinh cho `record Transaction` mà `javap -p` cho thấy.

<details><summary>Đáp án</summary>

Bất kỳ bốn trong số: class là `final` và `extends java.lang.Record`; 7 field `private final`; constructor chính
tắc nhận đủ 7 tham số; 7 accessor `id()`, `amount()`...; `equals`, `hashCode`, `toString`.

</details>

**Câu 3.** (Mục tiêu 2) Hai phiếu giống hệt nhau, chỉ khác `amount` là `new BigDecimal("500000")` và
`new BigDecimal("500000.00")`. `t1.equals(t2)` trả gì? Vì sao?

<details><summary>Đáp án</summary>

`false`. `equals` của record so từng thành phần bằng `Objects.equals`, tức gọi `BigDecimal.equals`. Hàm này so
cả **scale**: `500000` có scale 0, `500000.00` có scale 2. Muốn so theo giá trị thì dùng `compareTo(...) == 0`,
hoặc chuẩn hoá scale trong compact constructor.

</details>

**Câu 4.** (Mục tiêu 3) Vì sao `deposit`/`withdraw` là `final` còn `canWithdraw` là `abstract`?

<details><summary>Đáp án</summary>

`deposit`/`withdraw` chứa **quy trình bắt buộc**: kiểm tra số tiền, đổi số dư, ghi phiếu. Để `final` thì không
lớp con nào lách được quy trình. `canWithdraw` là phần **mỗi sản phẩm một khác** (theo số dư, hay số dư cộng
thấu chi), nên để `abstract` và bắt mỗi lớp con tự viết.

</details>

**Câu 5.** (Mục tiêu 3) Nếu `getHistory()` viết `return history;` thì chuyện gì có thể xảy ra?

<details><summary>Đáp án</summary>

Bên ngoài nhận **tham chiếu tới chính danh sách gốc**, nên có thể `clear()` hoặc `add(...)` phiếu giả. Lịch sử
khi đó không còn khớp với số dư, và bất biến "số dư chỉ đổi khi có phiếu" bị phá. `List.copyOf` trả bản sao
chỉ đọc, sửa vào là `UnsupportedOperationException`.

</details>

**Câu 6.** (Mục tiêu 4) Trong `BankDemo`, vì sao phiếu `GD-008` chỉ xuất hiện trong lịch sử của Bình, và số dư
của An sau lần đó là bao nhiêu?

<details><summary>Đáp án</summary>

`binh.transferTo(an, 9_000_000)` thất bại ngay ở `debit` của Bình (2.700.000 + 500.000 < 9.000.000), nên chỉ
Bình có phiếu `TRANSFER_OUT` trạng thái `FAILED`. `transferTo` trả `false` trước khi gọi `credit` cho An. Số dư
An vẫn là 5.000.000 (sau đó mới cộng lãi `GD-009` thành 5.025.000).

</details>

**Câu 7.** (Mục tiêu 5) Đoạn sau in ra gì?

```java
static void close(Account acc) {
    acc = null;
}
// trong main:
Account an = new SavingAccount("ACC-001", "An", new BigDecimal("6"));
close(an);
System.out.println(an.getId());
```

<details><summary>Đáp án</summary>

In `ACC-001`, không có `NullPointerException`. `acc = null` chỉ gán vào **bản sao** tham chiếu trong khung của
`close`. Biến `an` của `main` vẫn trỏ tới object cũ. Giống thí nghiệm 2 của phần 6.

</details>

**Câu 8.** (Mục tiêu 5) Một bạn nói: "`depositBonus(an)` sửa được số dư của `an`, vậy Java truyền object theo
tham chiếu." Bạn phản biện thế nào?

<details><summary>Đáp án</summary>

Sửa được object chỉ chứng tỏ method có **bản sao địa chỉ** của object đó. Phép thử đúng là gán tham số sang
object khác (thí nghiệm 2) hoặc `swap` (thí nghiệm 3): biến của bên gọi **không** đổi. Với pass-by-reference
thật, nó sẽ đổi. Vậy Java truyền theo giá trị, và giá trị ở đây là tham chiếu.

</details>

## Bài tập

**Bài 1 (dễ).** Ở cuối `BankDemo`, in thêm số phiếu `FAILED` của mỗi tài khoản. Kết quả đúng: An có 1, Bình
có 1.

> 💡 Gợi ý: duyệt `acc.getHistory()` bằng vòng `for`, so `tx.status() == TransactionStatus.FAILED`. So enum
> bằng `==` là an toàn, vì mỗi hằng enum chỉ có đúng một object [5]. Nhớ `import vn.onward.bank.TransactionStatus;`.

**Bài 2 (vừa).** Tách lãi suất ra một `interface InterestBearing` có `BigDecimal monthlyInterest()`
([Bài 5](/docs/learning/chang-2/truu-tuong-va-interface)). Chỉ `SavingAccount` implement nó; bỏ
`monthlyInterest` khỏi `Account` và `CheckingAccount`. Sửa `AccountTypesDemo` để chỉ in lãi cho tài khoản
có lãi.

> 💡 Gợi ý: `if (acc instanceof InterestBearing ib) { ... ib.monthlyInterest() ... }` (pattern matching cho
> `instanceof` chính thức có từ Java 16 [24]). Đây là thiết kế đúng hơn: tài khoản thanh toán không phải "trả lãi bằng 0", mà
> là "không có khái niệm lãi".

**Bài 3 (khó hơn).** Thêm hoàn tiền: method `public final Transaction reverse(String txId)` trong `Account`. Tìm
phiếu `DEPOSIT` có mã đó và trạng thái `COMPLETED`, trừ lại số tiền, ghi một phiếu **mới** trạng thái
`REVERSED`. Không tìm thấy, hoặc phiếu không phải nạp tiền, thì ghi phiếu `FAILED`.

> 💡 Gợi ý: record bất biến, nên **không sửa phiếu cũ**. Thêm loại `REVERSAL` vào `enum Type`. Để ghi phiếu
> với trạng thái `REVERSED`, bạn cần sửa `log` hoặc thêm một method `private` mới trong `Account`. Hãy tự hỏi:
> hoàn tiền có được phép làm số dư sổ tiết kiệm âm không? Nếu không, hãy gọi `canWithdraw` trước khi trừ.

## Nguồn tham khảo

1. roadmap.sh: Java Developer Roadmap (checkpoint OOP). <https://roadmap.sh/java>
2. Java SE 25 API: `java.math.BigDecimal`. <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/math/BigDecimal.html>
3. JLS 25, §7.4 Package Declarations. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-7.html#jls-7.4>
4. JDK 25 Tools: lệnh `javac` (tuỳ chọn `-d`). <https://docs.oracle.com/en/java/javase/25/docs/specs/man/javac.html>
5. JLS 25, §8.9 Enum Classes. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.9>
6. JDK 25 Tools: lệnh `java`. <https://docs.oracle.com/en/java/javase/25/docs/specs/man/java.html>
7. JLS 25, §7.1 Package Members. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-7.html#jls-7.1>
8. JEP 395: Records. <https://openjdk.org/jeps/395>
9. JDK 25 Tools: lệnh `javap`. <https://docs.oracle.com/en/java/javase/25/docs/specs/man/javap.html>
10. JLS 25, §8.10 Record Classes. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.10>
11. Java SE 25 API: `java.lang.Record`. <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Record.html>
12. JLS 25, §12.4.2 Detailed Initialization Procedure. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.4.2>
13. JLS 25, §8.4.3.3 final Methods. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.3.3>
14. JLS 25, §15.12.4.4 Locate Method to Invoke. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.4.4>
15. JLS 25, §6.6 Access Control. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-6.html#jls-6.6>
16. Java SE 25 API: `java.util.List` (Unmodifiable Lists, `copyOf`). <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/List.html>
17. JLS 25, §8.1.1.1 abstract Classes. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.1.1>
18. JLS 25, §9.6.4.4 @Override. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-9.html#jls-9.6.4.4>
19. JLS 25, §8.4.8 Inheritance, Overriding, and Hiding. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.8>
20. Java SE 25 API: `java.lang.Object` (`getClass`). <https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Object.html>
21. JLS 25, §8.4.1 Formal Parameters. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.4.1>
22. JLS 25, §15.12.4.5 Create Frame, Synchronize, Transfer Control. <https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12.4.5>
23. Oracle Java Tutorials: Passing Information to a Method or a Constructor. <https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html>
24. JEP 394: Pattern Matching for instanceof. <https://openjdk.org/jeps/394>

**Bài tiếp theo:** Chặng 2 kết thúc. Quay về [Lộ trình Java Developer](/docs/learning/java-roadmap) để sang Chặng 3 (Ngôn ngữ nâng cao và Collections).
