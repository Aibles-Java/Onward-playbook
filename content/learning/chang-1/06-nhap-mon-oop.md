---
title: "Bài 6 · Nhập môn lập trình hướng đối tượng"
description: "Gom dữ liệu và hành vi vào một chỗ: class, object, field, method, constructor, tham chiếu và null, qua ví dụ tài khoản ngân hàng."
order: 16
tags: [java, chặng-1, oop, class, object, constructor]
---

# Bài 6 · Nhập môn lập trình hướng đối tượng

> 🎯 **Sau bài này bạn sẽ:**
> - Viết được một class `Account` có field, method và constructor, rồi tạo nhiều object từ nó.
> - Giải thích được khác biệt giữa class và object, giữa field `static` và field thường.
> - Vẽ được hình biến tham chiếu trên stack trỏ tới object trên heap, và đọc hiểu một `NullPointerException`.
> - Dùng `private` cùng kiểm tra hợp lệ để chặn số tiền âm hoặc rút quá số dư.
> - Tách chương trình thành `Account.java` và `Main.java`, biên dịch bằng `javac -d out *.java` rồi chạy.

**Cần biết trước:** [Bài 3 · Kiểu dữ liệu, biến và ép kiểu](/docs/learning/chang-1/kieu-du-lieu-bien-ep-kieu),
[Bài 4 · Chuỗi và phép toán](/docs/learning/chang-1/chuoi-va-phep-toan),
[Bài 5 · Mảng, điều kiện và vòng lặp](/docs/learning/chang-1/mang-dieu-kien-vong-lap).

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| Class (lớp) | Bản thiết kế, giống mẫu đơn mở tài khoản | `class Account { ... }` |
| Object (đối tượng) | Một "vật" cụ thể làm theo bản thiết kế | tài khoản của An |
| Field (thuộc tính) | Dữ liệu mỗi object tự giữ | `long balance;` |
| Method (phương thức) | Việc object làm được | `deposit(long amount)` |
| Constructor (hàm khởi tạo) | Đoạn code chạy khi object vừa được tạo | `Account(String owner) { ... }` |
| `new` | Từ khoá tạo object mới | `new Account("An", 0)` |
| `this` | "Chính object này" | `this.balance = balance;` |
| Reference (tham chiếu) | "Địa chỉ" trỏ tới object, không phải object | `Account alias = an;` |
| `null` | Tham chiếu chưa trỏ tới object nào | `Account savings = null;` |
| `static` | Thuộc về class, dùng chung, chỉ có một bản | `static int openedCount;` |

💡 **Về cách lưu tiền trong bài này.** Ở bài 4 bạn đã biết `BigDecimal` là cách chuẩn cho tiền
có phần lẻ. Bài này chọn `long` (đơn vị: **đồng**) vì hai lý do. Một: tiền VND không có đơn vị
nhỏ hơn đồng, nên số nguyên `long` biểu diễn **chính xác** mọi số tiền, không có sai số làm tròn.
Hai: bài này chỉ cộng trừ và so sánh, nên `long` giúp code ngắn, bạn tập trung vào OOP. Khi cần
nhân với lãi suất (số lẻ), như ở bài checkpoint, bạn sẽ quay lại `BigDecimal`.

## 1. Vì sao cần lập trình hướng đối tượng?

**Ý tưởng nôm na.** Hãy hình dung một chi nhánh ngân hàng ghi sổ bằng những tờ giấy rời: tờ
này ghi tên, tờ kia ghi số dư, không kẹp lại với nhau. Chỉ cần lấy nhầm một tờ là sai tiền của
khách. **Lập trình hướng đối tượng** (*Object-Oriented Programming*, viết tắt **OOP**) giống như
cho mỗi khách một **bìa hồ sơ**: tên, số dư và các thao tác nạp/rút nằm chung một chỗ [1][2].

<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="So sánh hai cách lưu dữ liệu khách hàng. Bên trái, không có OOP: sáu biến rời rạc owner1, balance1, owner2, balance2, owner3, balance3; thêm khách là thêm biến và chép lại code, dễ sửa nhầm balance1 với balance2. Bên phải, có OOP: mỗi khách là một object kiểu Account, gói cả dữ liệu owner, balance và hành vi deposit, withdraw trong cùng một chỗ.">
  <defs>
    <marker id="b6-why-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="330" height="230" rx="10" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="175" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#DC2626">Không có OOP: biến rời rạc</text>
    <g font-family="monospace" fill="#0F172A">
      <rect x="22" y="48" width="150" height="30" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
      <text x="32" y="68">owner1 = "An"</text>
      <rect x="180" y="48" width="150" height="30" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
      <text x="190" y="68">balance1 = 500000</text>
      <rect x="22" y="88" width="150" height="30" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
      <text x="32" y="108">owner2 = "Bình"</text>
      <rect x="180" y="88" width="150" height="30" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
      <text x="190" y="108">balance2 = 1200000</text>
      <rect x="22" y="128" width="150" height="30" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
      <text x="32" y="148">owner3 = "Chi"</text>
      <rect x="180" y="128" width="150" height="30" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
      <text x="190" y="148">balance3 = 0</text>
    </g>
    <text x="175" y="188" text-anchor="middle" fill="#0F172A">Thêm khách = thêm biến + chép lại code</text>
    <text x="175" y="210" text-anchor="middle" fill="#DC2626">Dễ sửa nhầm balance1 với balance2</text>
    <line x1="344" y1="125" x2="374" y2="125" stroke="#64748B" stroke-width="2" marker-end="url(#b6-why-arrow)"/>
    <rect x="380" y="10" width="330" height="230" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="545" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#047857">Có OOP: mỗi khách một object</text>
    <rect x="392" y="48" width="150" height="140" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <rect x="392" y="48" width="150" height="28" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="467" y="67" text-anchor="middle" font-family="monospace" fill="#1D4ED8">an : Account</text>
    <text x="402" y="98" font-family="monospace" fill="#0F172A">owner = "An"</text>
    <text x="402" y="118" font-family="monospace" fill="#0F172A">balance = 500000</text>
    <line x1="392" y1="130" x2="542" y2="130" stroke="#94A3B8"/>
    <text x="402" y="152" font-family="monospace" fill="#047857">deposit()</text>
    <text x="402" y="172" font-family="monospace" fill="#047857">withdraw()</text>
    <rect x="550" y="48" width="150" height="140" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <rect x="550" y="48" width="150" height="28" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="625" y="67" text-anchor="middle" font-family="monospace" fill="#1D4ED8">binh : Account</text>
    <text x="560" y="98" font-family="monospace" fill="#0F172A">owner = "Bình"</text>
    <text x="560" y="118" font-family="monospace" fill="#0F172A">balance = 1200000</text>
    <line x1="550" y1="130" x2="700" y2="130" stroke="#94A3B8"/>
    <text x="560" y="152" font-family="monospace" fill="#047857">deposit()</text>
    <text x="560" y="172" font-family="monospace" fill="#047857">withdraw()</text>
    <text x="545" y="215" text-anchor="middle" fill="#047857">Dữ liệu + hành vi đi cùng một chỗ</text>
  </g>
</svg>

Đây là cách viết khi chưa có OOP, chỉ dùng biến như ở bài 3:

```java
public class LooseVariables {
    public static void main(String[] args) {
        // Mỗi khách hàng cần 2 biến riêng, đặt tên bằng số thứ tự
        String owner1 = "An";
        long balance1 = 500_000;
        String owner2 = "Bình";
        long balance2 = 1_200_000;

        // Nạp 200.000 đồng cho khách 1: tự nhớ phải sửa đúng biến balance1
        balance1 = balance1 + 200_000;

        // Rút 300.000 đồng của khách 2: lại tự viết lại phép kiểm tra
        if (balance2 >= 300_000) {
            balance2 = balance2 - 300_000;
        }

        System.out.println(owner1 + ": " + balance1);
        System.out.println(owner2 + ": " + balance2);
    }
}
```

**Kết quả khi chạy:**

```text
An: 700000
Bình: 900000
```

Và đây là cùng chương trình đó khi mỗi khách là một **object** (đối tượng). Đừng lo nếu bạn chưa
hiểu hết cú pháp: các phần sau sẽ giải thích từng dòng. Tạm thời, hai class được đặt chung một
file cho gọn (phần 8 sẽ tách ra).

```java
public class WithObjects {
    public static void main(String[] args) {
        // Mỗi khách hàng là MỘT object, mang theo cả dữ liệu lẫn hành vi
        Account an = new Account("An", 500_000);
        Account binh = new Account("Bình", 1_200_000);

        an.deposit(200_000);   // "tài khoản An, hãy nạp 200.000"
        binh.withdraw(300_000); // "tài khoản Bình, hãy rút 300.000"

        System.out.println(an.owner + ": " + an.balance);
        System.out.println(binh.owner + ": " + binh.balance);
    }
}

class Account {
    String owner;
    long balance;

    Account(String owner, long balance) {
        this.owner = owner;
        this.balance = balance;
    }

    void deposit(long amount) {
        balance = balance + amount;
    }

    void withdraw(long amount) {
        if (balance >= amount) {
            balance = balance - amount;
        }
    }
}
```

**Kết quả khi chạy:**

```text
An: 700000
Bình: 900000
```

**Giải thích từng bước:**

1. Ở bản đầu, mỗi khách cần 2 biến. Có 1.000 khách thì cần 2.000 biến, và phép kiểm tra "đủ tiền
   mới cho rút" phải chép lại ở mọi chỗ rút tiền.
2. Ở bản sau, `new Account("An", 500_000)` tạo ra **một object** chứa cả tên lẫn số dư.
3. `an.deposit(200_000)` nghĩa là "object `an`, hãy tự nạp 200.000 đồng". Dấu chấm `.` dùng để
   gọi tới thứ bên trong object.
4. Logic "đủ tiền mới cho rút" chỉ viết **một lần** trong `withdraw`, mọi tài khoản dùng chung.

Kết quả hai bản giống hệt nhau. Khác biệt nằm ở chỗ: bản OOP dễ mở rộng và khó sai hơn.

### ⚠️ Lỗi hay gặp

**Chép code rồi quên sửa tên biến.** Với biến rời rạc, đây là lỗi kinh điển. Java không báo
lỗi gì cả, vì code hoàn toàn hợp lệ:

```java
public class CopyPasteBug {
    public static void main(String[] args) {
        String owner1 = "An";
        long balance1 = 500_000;
        String owner2 = "Bình";
        long balance2 = 1_200_000;

        // Copy dòng của khách 2 rồi quên sửa balance2 thành balance1
        balance1 = balance2 + 200_000;

        System.out.println(owner1 + ": " + balance1);
    }
}
```

```text
An: 1400000
```

An chỉ có 500.000 đồng, nạp thêm 200.000, mà số dư lại thành 1.400.000. **Cách sửa:** gom dữ liệu
vào object. Khi bạn viết `an.deposit(200_000)`, không có cách nào "lấy nhầm số dư của Bình".

## 2. Class và object

**Ý tưởng nôm na.** **Class** (lớp) là **mẫu đơn mở tài khoản** in sẵn: có ô "Họ tên", ô "Số
dư". Mỗi **object** (đối tượng) là **một tờ đơn đã điền** của một khách cụ thể. Một mẫu đơn có
thể in ra bao nhiêu tờ cũng được, và mỗi tờ ghi nội dung riêng [2][16].

<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Một class tạo ra nhiều object. Bên trái là class Account, giống mẫu đơn mở tài khoản, khai báo hai field: String owner và long balance. Ba mũi tên new Account() đi sang phải, tạo ba object độc lập: object an có owner An, balance 500000; object binh có owner Bình, balance 1200000; object chi có owner Chi, balance 0.">
  <defs>
    <marker id="b6-class-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="20" y="55" width="210" height="130" rx="10" fill="#FFFBEB" stroke="#D97706" stroke-dasharray="6 4"/>
    <text x="125" y="80" text-anchor="middle" font-family="monospace" font-size="13" font-weight="bold" fill="#0F172A">class Account</text>
    <text x="125" y="100" text-anchor="middle" fill="#D97706">bản thiết kế / mẫu đơn</text>
    <line x1="20" y1="112" x2="230" y2="112" stroke="#D97706"/>
    <text x="36" y="138" font-family="monospace" fill="#0F172A">String owner;</text>
    <text x="36" y="162" font-family="monospace" fill="#0F172A">long balance;</text>
    <line x1="232" y1="120" x2="462" y2="45" stroke="#64748B" marker-end="url(#b6-class-arrow)"/>
    <line x1="232" y1="120" x2="462" y2="120" stroke="#64748B" marker-end="url(#b6-class-arrow)"/>
    <line x1="232" y1="120" x2="462" y2="195" stroke="#64748B" marker-end="url(#b6-class-arrow)"/>
    <rect x="300" y="108" width="110" height="24" rx="5" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="355" y="124" text-anchor="middle" font-family="monospace" fill="#0F172A">new Account()</text>
    <rect x="470" y="20" width="240" height="50" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="480" y="40" fill="#1D4ED8" font-weight="bold">object an</text>
    <text x="480" y="59" font-family="monospace" fill="#0F172A">owner="An", balance=500000</text>
    <rect x="470" y="95" width="240" height="50" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="480" y="115" fill="#1D4ED8" font-weight="bold">object binh</text>
    <text x="480" y="134" font-family="monospace" fill="#0F172A">owner="Bình", balance=1200000</text>
    <rect x="470" y="170" width="240" height="50" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="480" y="190" fill="#1D4ED8" font-weight="bold">object chi</text>
    <text x="480" y="209" font-family="monospace" fill="#0F172A">owner="Chi", balance=0</text>
    <text x="360" y="250" text-anchor="middle" fill="#64748B">1 class (bản thiết kế) → nhiều object (từng tài khoản cụ thể, độc lập nhau)</text>
  </g>
</svg>

```java
public class ClassAndObject {
    public static void main(String[] args) {
        // Tạo object thứ nhất từ class Account
        Account an = new Account();
        an.owner = "An";
        an.balance = 500_000;

        // Tạo object thứ hai, hoàn toàn độc lập với object thứ nhất
        Account binh = new Account();
        binh.owner = "Bình";
        binh.balance = 1_200_000;

        System.out.println(an.owner + " có " + an.balance + " đồng");
        System.out.println(binh.owner + " có " + binh.balance + " đồng");

        // Object vừa tạo, chưa gán gì: field nhận giá trị mặc định
        Account empty = new Account();
        System.out.println(empty.owner + " có " + empty.balance + " đồng");
    }
}

// Class = bản thiết kế: mỗi tài khoản sẽ có tên chủ và số dư
class Account {
    String owner;   // tên chủ tài khoản
    long balance;   // số dư, đơn vị: đồng
}
```

**Kết quả khi chạy:**

```text
An có 500000 đồng
Bình có 1200000 đồng
null có 0 đồng
```

**Giải thích từng bước:**

1. `class Account { String owner; long balance; }` khai báo bản thiết kế. Bản thân dòng này
   **chưa tạo ra** tài khoản nào.
2. `Account an = new Account();` có hai nửa. Vế phải `new Account()` tạo một object mới. Vế trái
   khai báo biến `an` có kiểu `Account` để giữ object đó. Class bạn tự viết cũng là một kiểu dữ
   liệu, giống `String`.
3. `an.owner = "An";` ghi vào ô `owner` **của object `an`**. Object `binh` không bị ảnh hưởng.
4. Object `empty` chưa được gán gì, nên các field mang **giá trị mặc định**: `null` cho kiểu
   tham chiếu như `String`, `0` cho số, `false` cho `boolean` [5]. `null` sẽ được giải thích ở
   phần 5.

💡 Biến khai báo **bên trong method** (biến cục bộ, như ở bài 3) thì **không** có giá trị mặc
định. Chỉ field mới có.

### ⚠️ Lỗi hay gặp

**Lỗi 1: gán vào class thay vì vào object.** Class chỉ là mẫu đơn, không có "số dư" của riêng nó.

```java
public class StaticRef {
    public static void main(String[] args) {
        Account.balance = 500_000; // nhầm: gán vào class thay vì object
    }
}

class Account {
    String owner;
    long balance;
}
```

```text
StaticRef.java:3: error: non-static variable balance cannot be referenced from a static context
        Account.balance = 500_000; // nhầm: gán vào class thay vì object
               ^
1 error
```

Chữ *static* trong thông báo sẽ rõ nghĩa ở phần 6. **Cách sửa:** tạo object trước, rồi gán
`an.balance = 500_000;`.

**Lỗi 2: khai báo biến nhưng quên `new`.** Có biến chưa có nghĩa là có object.

```java
public class NoNew {
    public static void main(String[] args) {
        Account an;            // mới khai báo biến, chưa có object
        an.balance = 500_000;
    }
}

class Account {
    String owner;
    long balance;
}
```

```text
NoNew.java:4: error: variable an might not have been initialized
        an.balance = 500_000;
        ^
1 error
```

**Cách sửa:** `Account an = new Account();`.

## 3. Field và method: dữ liệu và hành vi

**Ý tưởng nôm na.** Một tài khoản ngân hàng vừa **có** thông tin (tên chủ, số dư), vừa **làm**
được việc (nhận tiền, cho rút, báo số dư). Phần "có" là **field** (thuộc tính, còn gọi là
*attribute*). Phần "làm" là **method** (phương thức). Method giống **quầy giao dịch**: bạn đưa
vào **tham số** (*parameter*), quầy xử lý và có thể trả lại một **giá trị trả về**
(*return value*) [2][4].

<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Giải phẫu một method và luồng gọi method. Phần trên: khai báo boolean canWithdraw(long amount) gồm ba phần: kiểu trả về boolean, tên method canWithdraw, và tham số long amount. Phần giữa: lời gọi an.deposit(500_000) truyền 500000 vào tham số amount, rồi field balance của object an đổi từ 0 thành 500000; deposit là void nên không trả gì. Phần dưới: lời gọi current = an.getBalance() chạy câu lệnh return balance, và giá trị 380000 (số dư sau khi rút 120000) được trả về gán vào biến current.">
  <defs>
    <marker id="b6-method-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
    <marker id="b6-method-ret" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#047857"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="110" y="14" width="100" height="32" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="160" y="35" text-anchor="middle" font-family="monospace" font-size="14" fill="#047857">boolean</text>
    <rect x="218" y="14" width="140" height="32" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="288" y="35" text-anchor="middle" font-family="monospace" font-size="14" fill="#1D4ED8">canWithdraw</text>
    <rect x="366" y="14" width="150" height="32" rx="6" fill="#FFFBEB" stroke="#D97706"/>
    <text x="441" y="35" text-anchor="middle" font-family="monospace" font-size="14" fill="#D97706">(long amount)</text>
    <text x="530" y="35" font-family="monospace" font-size="14" fill="#64748B">{ ... }</text>
    <text x="160" y="64" text-anchor="middle" fill="#047857">kiểu trả về</text>
    <text x="288" y="64" text-anchor="middle" fill="#1D4ED8">tên method</text>
    <text x="441" y="64" text-anchor="middle" fill="#D97706">tham số (đầu vào)</text>
    <line x1="10" y1="82" x2="710" y2="82" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <rect x="20" y="98" width="200" height="50" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="120" y="119" text-anchor="middle" font-family="monospace" fill="#0F172A">an.deposit(500_000)</text>
    <text x="120" y="137" text-anchor="middle" fill="#64748B">nơi gọi</text>
    <rect x="260" y="98" width="200" height="50" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="360" y="119" text-anchor="middle" font-family="monospace" fill="#0F172A">amount = 500000</text>
    <text x="360" y="137" text-anchor="middle" fill="#64748B">tham số nhận giá trị</text>
    <rect x="500" y="98" width="210" height="50" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="605" y="119" text-anchor="middle" font-family="monospace" fill="#0F172A">balance: 0 → 500000</text>
    <text x="605" y="137" text-anchor="middle" fill="#64748B">field của object an đổi</text>
    <line x1="220" y1="123" x2="256" y2="123" stroke="#64748B" marker-end="url(#b6-method-arrow)"/>
    <line x1="460" y1="123" x2="496" y2="123" stroke="#64748B" marker-end="url(#b6-method-arrow)"/>
    <text x="605" y="166" text-anchor="middle" fill="#64748B">void: không trả gì về</text>
    <line x1="10" y1="182" x2="710" y2="182" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <rect x="20" y="210" width="250" height="56" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="145" y="233" text-anchor="middle" font-family="monospace" fill="#0F172A">current = an.getBalance()</text>
    <text x="145" y="253" text-anchor="middle" fill="#64748B">nơi gọi, chờ nhận kết quả</text>
    <rect x="480" y="210" width="230" height="56" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="595" y="233" text-anchor="middle" font-family="monospace" fill="#0F172A">return balance;</text>
    <text x="595" y="253" text-anchor="middle" fill="#64748B">bên trong getBalance()</text>
    <line x1="270" y1="224" x2="476" y2="224" stroke="#64748B" marker-end="url(#b6-method-arrow)"/>
    <text x="375" y="217" text-anchor="middle" fill="#64748B">1. gọi method</text>
    <line x1="480" y1="254" x2="274" y2="254" stroke="#047857" marker-end="url(#b6-method-ret)"/>
    <text x="375" y="276" text-anchor="middle" fill="#047857">2. trả về 380000 → gán vào current</text>
  </g>
</svg>

```java
public class FieldsAndMethods {
    public static void main(String[] args) {
        Account an = new Account();
        an.owner = "An";

        an.deposit(500_000);                 // gọi method có tham số
        an.withdraw(120_000);
        long current = an.getBalance();      // nhận giá trị trả về

        System.out.println(an.owner + " còn " + current + " đồng");
        System.out.println("Rút thêm 1.000.000 được không? " + an.canWithdraw(1_000_000));
    }
}

class Account {
    // Field (thuộc tính): dữ liệu mỗi object tự giữ
    String owner;
    long balance;

    // void = không trả về gì; amount là tham số
    void deposit(long amount) {
        balance = balance + amount;
    }

    void withdraw(long amount) {
        balance = balance - amount;
    }

    // Trả về một giá trị kiểu long
    long getBalance() {
        return balance;
    }

    // Trả về boolean: có đủ tiền để rút hay không
    boolean canWithdraw(long amount) {
        return balance >= amount;
    }
}
```

**Kết quả khi chạy:**

```text
An còn 380000 đồng
Rút thêm 1.000.000 được không? false
```

**Giải thích từng bước:**

1. `an` được tạo, `balance` mặc định là `0`.
2. `an.deposit(500_000)`: giá trị `500_000` được chép vào tham số `amount`, rồi
   `balance = balance + amount` chạy. `balance` ở đây chính là field của object `an`.
3. `an.withdraw(120_000)`: số dư còn `380000`.
4. `long current = an.getBalance();`: method chạy tới `return balance;`, giá trị `380000` được
   "trả về" và gán vào biến `current`.
5. `canWithdraw(1_000_000)` trả về `false` vì `380000 >= 1000000` sai.

Đọc chữ ký `long getBalance()` từ trái sang: **kiểu trả về** `long`, **tên** `getBalance`, **danh
sách tham số** rỗng `()`. Kiểu trả về `void` nghĩa là method không trả gì cả.

⚠️ `withdraw` ở đây **chưa kiểm tra gì**, nên vẫn rút được quá số dư. Phần 7 sẽ sửa lỗ hổng này.

### ⚠️ Lỗi hay gặp

**Lỗi 1: khai báo kiểu trả về nhưng quên `return`.**

```java
class Account {
    long balance;

    long getBalance() {
        System.out.println(balance); // in ra nhưng quên return
    }
}
```

```text
MissingReturn.java:6: error: missing return statement
    }
    ^
1 error
```

`System.out.println` chỉ **in ra màn hình**, không phải **trả về**. **Cách sửa:** thêm
`return balance;`.

**Lỗi 2: lấy kết quả từ method `void`.**

```java
public class VoidValue {
    public static void main(String[] args) {
        Account an = new Account();
        long result = an.deposit(100_000); // deposit là void
    }
}

class Account {
    long balance;

    void deposit(long amount) {
        balance = balance + amount;
    }
}
```

```text
VoidValue.java:4: error: incompatible types: void cannot be converted to long
        long result = an.deposit(100_000); // deposit là void
                                ^
1 error
```

**Cách sửa:** gọi `an.deposit(100_000);` như một câu lệnh độc lập, hoặc đổi method để nó trả về
thứ bạn cần.

**Lỗi 3: gọi method mà quên dấu `()`.** Không có `()`, Java tưởng bạn đang tìm một field tên
`getBalance`.

```java
public class NoParens {
    public static void main(String[] args) {
        Account an = new Account();
        System.out.println(an.getBalance); // quên ()
    }
}

class Account {
    long balance;

    long getBalance() {
        return balance;
    }
}
```

```text
NoParens.java:4: error: cannot find symbol
        System.out.println(an.getBalance); // quên ()
                             ^
  symbol:   variable getBalance
  location: variable an of type Account
1 error
```

**Cách sửa:** `an.getBalance()`.

## 4. Constructor, `new` và `this`

**Ý tưởng nôm na.** Mở tài khoản ở quầy thì giao dịch viên điền luôn tên và số tiền nộp lần đầu,
chứ không đưa bạn một tờ đơn trắng. **Constructor** (hàm khởi tạo) chính là "thủ tục mở tài
khoản": nó chạy **đúng một lần**, ngay khi object vừa được tạo bằng `new`, để điền sẵn dữ liệu
ban đầu [4].

<svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ba bước khi chạy câu lệnh Account an = new Account(&quot;An&quot;, 500_000). Bước 1: new cấp vùng nhớ cho object mới, mọi field nhận giá trị mặc định, owner bằng null, balance bằng 0. Bước 2: constructor chạy, this.owner = owner và this.balance = balance, nên owner thành An, balance thành 500000. Bước 3: new trả về tham chiếu tới object, tham chiếu này được gán vào biến an.">
  <defs>
    <marker id="b6-ctor-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="360" y="26" text-anchor="middle" font-family="monospace" font-size="14" fill="#0F172A">Account an = new Account("An", 500_000);</text>
    <rect x="10" y="50" width="210" height="150" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="115" y="74" text-anchor="middle" font-weight="bold" fill="#0F172A">1. new cấp vùng nhớ</text>
    <text x="115" y="94" text-anchor="middle" fill="#64748B">field = giá trị mặc định</text>
    <rect x="35" y="110" width="160" height="62" rx="6" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="47" y="134" font-family="monospace" fill="#0F172A">owner   = null</text>
    <text x="47" y="156" font-family="monospace" fill="#0F172A">balance = 0</text>
    <line x1="222" y1="125" x2="252" y2="125" stroke="#64748B" stroke-width="2" marker-end="url(#b6-ctor-arrow)"/>
    <rect x="256" y="50" width="210" height="150" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="361" y="74" text-anchor="middle" font-weight="bold" fill="#1D4ED8">2. constructor chạy</text>
    <text x="361" y="94" text-anchor="middle" font-family="monospace" fill="#64748B">this.owner = owner; ...</text>
    <rect x="281" y="110" width="160" height="62" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="293" y="134" font-family="monospace" fill="#0F172A">owner   = "An"</text>
    <text x="293" y="156" font-family="monospace" fill="#0F172A">balance = 500000</text>
    <line x1="468" y1="125" x2="498" y2="125" stroke="#64748B" stroke-width="2" marker-end="url(#b6-ctor-arrow)"/>
    <rect x="502" y="50" width="208" height="150" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="606" y="74" text-anchor="middle" font-weight="bold" fill="#047857">3. gán tham chiếu</text>
    <text x="606" y="94" text-anchor="middle" fill="#64748B">new trả về "địa chỉ" object</text>
    <rect x="522" y="122" width="44" height="30" rx="4" fill="#FFFFFF" stroke="#10B981"/>
    <text x="544" y="142" text-anchor="middle" font-family="monospace" fill="#0F172A">an</text>
    <line x1="566" y1="137" x2="600" y2="137" stroke="#047857" stroke-width="2" marker-end="url(#b6-ctor-arrow)"/>
    <rect x="604" y="112" width="92" height="50" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="650" y="134" text-anchor="middle" fill="#1D4ED8">object</text>
    <text x="650" y="152" text-anchor="middle" font-family="monospace" fill="#0F172A">"An"</text>
  </g>
</svg>

```java
public class Constructors {
    public static void main(String[] args) {
        // new gọi constructor 2 tham số: mở tài khoản kèm số dư ban đầu
        Account an = new Account("An", 500_000);

        // new gọi constructor 1 tham số: mở tài khoản trống
        Account binh = new Account("Bình");

        System.out.println(an.owner + ": " + an.balance);
        System.out.println(binh.owner + ": " + binh.balance);
    }
}

class Account {
    String owner;
    long balance;

    // Constructor: cùng tên class, KHÔNG có kiểu trả về
    Account(String owner, long balance) {
        this.owner = owner;     // this.owner là field, owner là tham số
        this.balance = balance;
    }

    // Constructor thứ hai, số dư bắt đầu từ 0
    Account(String owner) {
        this(owner, 0);         // gọi constructor ở trên, tránh lặp code
    }
}
```

**Kết quả khi chạy:**

```text
An: 500000
Bình: 0
```

**Giải thích từng bước:**

1. `new Account("An", 500_000)`: Java cấp vùng nhớ cho object mới, các field nhận giá trị mặc
   định (`null`, `0`) [11].
2. Java chọn constructor có danh sách tham số khớp `(String, long)` và chạy nó. Trong constructor,
   tham số `owner` trùng tên với field `owner`. Viết `this.owner` để nói rõ "field `owner` **của
   object này**", còn `owner` trơn là tham số.
3. `new` trả về tham chiếu tới object, tham chiếu đó được gán vào biến `an`.
4. `new Account("Bình")` khớp constructor một tham số. Dòng `this(owner, 0);` gọi sang constructor
   hai tham số, nhờ vậy không phải viết lại hai dòng gán. Trên JDK 21, `this(...)` phải là câu
   lệnh đầu tiên của constructor [4].

Một class có thể có nhiều constructor, miễn danh sách tham số khác nhau. Constructor **cùng tên
với class** và **không có kiểu trả về**, kể cả `void`.

**Nếu không viết constructor nào thì sao?** javac tự thêm một **constructor mặc định** (*default
constructor*): không tham số, không làm gì [6]. Đó là lý do `new Account()` ở phần 2 chạy được.

```java
public class DefaultConstructor {
    public static void main(String[] args) {
        Card card = new Card(); // Card không khai báo constructor nào
        System.out.println(card.number + " | " + card.active);
    }
}

class Card {
    String number;
    boolean active;
    // Không viết constructor: javac tự thêm constructor mặc định Card() { }
}
```

```text
null | false
```

### ⚠️ Lỗi hay gặp

**Lỗi 1: đã viết constructor có tham số, vẫn gọi `new Account()`.** Constructor mặc định **chỉ**
được thêm khi class không có constructor nào. Bạn viết một cái là javac thôi không thêm nữa [6].

```java
public class NoArgCtor {
    public static void main(String[] args) {
        Account a = new Account(); // nhưng class chỉ có constructor 2 tham số
    }
}

class Account {
    String owner;
    long balance;

    Account(String owner, long balance) {
        this.owner = owner;
        this.balance = balance;
    }
}
```

```text
NoArgCtor.java:3: error: constructor Account in class Account cannot be applied to given types;
        Account a = new Account(); // nhưng class chỉ có constructor 2 tham số
                    ^
  required: String,long
  found:    no arguments
  reason: actual and formal argument lists differ in length
1 error
```

Đọc thông báo: `required: String,long` là thứ constructor cần, `found: no arguments` là thứ bạn
đưa. **Cách sửa:** truyền đủ tham số `new Account("An", 0)`, hoặc tự viết thêm constructor không
tham số.

**Lỗi 2: quên `this`, gán tham số cho chính nó.** Code biên dịch được, nhưng field không đổi.

```java
public class Shadow {
    public static void main(String[] args) {
        Account an = new Account("An", 500_000);
        System.out.println(an.owner + ": " + an.balance);
    }
}

class Account {
    String owner;
    long balance;

    Account(String owner, long balance) {
        owner = owner;      // gán tham số cho chính nó, field không đổi
        balance = balance;
    }
}
```

```text

```

Trong constructor, tên `owner` trơn chỉ tới **tham số** (tham số "che" field cùng tên). Dòng
`owner = owner;` gán tham số cho chính nó. **Cách sửa:** `this.owner = owner;`.

**Lỗi 3: thêm `void` trước constructor.** Có `void` thì nó thành một **method** bình thường
tên `Account`, không còn là constructor. Class lại không có constructor nào, nên javac thêm
constructor mặc định không tham số.

```java
public class VoidCtor {
    public static void main(String[] args) {
        Account an = new Account("An", 500_000);
    }
}

class Account {
    String owner;
    long balance;

    void Account(String owner, long balance) { // thêm void: thành method thường!
        this.owner = owner;
        this.balance = balance;
    }
}
```

```text
VoidCtor.java:3: error: constructor Account in class Account cannot be applied to given types;
        Account an = new Account("An", 500_000);
                     ^
  required: no arguments
  found:    String,int
  reason: actual and formal argument lists differ in length
1 error
```

**Cách sửa:** bỏ chữ `void`.

## 5. Object nằm ở đâu trong bộ nhớ?

**Ý tưởng nôm na.** Object giống **két sắt** đặt trong kho của ngân hàng. Biến kiểu `Account` của
bạn chỉ là **tấm thẻ ghi số két**, không phải cái két. Đưa thêm một tấm thẻ cùng số cho người
khác thì hai người cùng mở được **một** két. Thẻ chưa ghi số nào là `null`.

Nói chính xác hơn: biến cục bộ trong method nằm trong **stack** (ngăn xếp), mỗi lần gọi method có
một "khung" riêng. Mọi object được cấp phát trên **heap** (vùng nhớ đống) [12]. Biến kiểu class
chỉ giữ **tham chiếu** (*reference*) tới object. Biến kiểu nguyên thuỷ như `long` thì giữ ngay
giá trị.

<svg viewBox="0 0 720 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Biến và object trong bộ nhớ. Bên trái là stack, khung của method main, chứa các biến: an, alias, other là biến tham chiếu, chỉ giữ mũi tên trỏ tới object; x bằng 10 và y bằng 99 là kiểu nguyên thuỷ, giá trị nằm ngay trong biến; savings bằng null, không trỏ tới đâu. Bên phải là heap chứa hai object Account. Biến an và alias cùng trỏ tới object thứ nhất có owner An, balance 600000, nên an == alias là true. Biến other trỏ tới object thứ hai, dữ liệu giống hệt nhưng là object khác, nên an == other là false.">
  <defs>
    <marker id="b6-mem-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="260" height="300" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="140" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#0F172A">Stack: khung của main()</text>
    <g font-family="monospace" fill="#0F172A">
      <text x="28" y="69">an</text>
      <text x="28" y="109">alias</text>
      <text x="28" y="149">other</text>
      <text x="28" y="189">x</text>
      <text x="28" y="229">y</text>
      <text x="28" y="269">savings</text>
    </g>
    <rect x="150" y="50" width="90" height="28" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="195" cy="64" r="4" fill="#2563EB"/>
    <rect x="150" y="90" width="90" height="28" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="195" cy="104" r="4" fill="#2563EB"/>
    <rect x="150" y="130" width="90" height="28" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <circle cx="195" cy="144" r="4" fill="#2563EB"/>
    <rect x="150" y="170" width="90" height="28" rx="4" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="195" y="189" text-anchor="middle" font-family="monospace" fill="#0F172A">10</text>
    <rect x="150" y="210" width="90" height="28" rx="4" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="195" y="229" text-anchor="middle" font-family="monospace" fill="#0F172A">99</text>
    <rect x="150" y="250" width="90" height="28" rx="4" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="195" y="269" text-anchor="middle" font-family="monospace" fill="#DC2626">null</text>
    <text x="140" y="298" text-anchor="middle" fill="#64748B">x, y: giá trị nằm ngay trong biến</text>
    <rect x="400" y="10" width="310" height="300" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="555" y="32" text-anchor="middle" font-size="13" font-weight="bold" fill="#047857">Heap: nơi các object sống</text>
    <rect x="420" y="50" width="270" height="68" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="432" y="72" fill="#1D4ED8" font-weight="bold">Account (object #1)</text>
    <text x="432" y="100" font-family="monospace" fill="#0F172A">owner="An", balance=600000</text>
    <rect x="420" y="150" width="270" height="68" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="432" y="172" fill="#1D4ED8" font-weight="bold">Account (object #2)</text>
    <text x="432" y="200" font-family="monospace" fill="#0F172A">owner="An", balance=600000</text>
    <line x1="199" y1="64" x2="414" y2="76" stroke="#2563EB" stroke-width="1.5" marker-end="url(#b6-mem-arrow)"/>
    <line x1="199" y1="104" x2="414" y2="92" stroke="#2563EB" stroke-width="1.5" marker-end="url(#b6-mem-arrow)"/>
    <line x1="199" y1="144" x2="414" y2="182" stroke="#2563EB" stroke-width="1.5" marker-end="url(#b6-mem-arrow)"/>
    <text x="555" y="252" text-anchor="middle" font-family="monospace" fill="#047857">an == alias → true</text>
    <text x="555" y="274" text-anchor="middle" font-family="monospace" fill="#DC2626">an == other → false</text>
    <text x="555" y="296" text-anchor="middle" fill="#64748B">== so sánh "địa chỉ", không so dữ liệu</text>
  </g>
</svg>

```java
public class References {
    public static void main(String[] args) {
        Account an = new Account("An", 500_000);
        Account alias = an;   // KHÔNG tạo object mới, chỉ chép "địa chỉ"

        alias.deposit(100_000);
        System.out.println("an.balance    = " + an.balance);
        System.out.println("an == alias   = " + (an == alias));

        Account other = new Account("An", 600_000); // object mới, dữ liệu giống
        System.out.println("an == other   = " + (an == other));

        // Kiểu nguyên thuỷ thì khác: chép giá trị, không dính nhau
        long x = 10;
        long y = x;
        y = 99;
        System.out.println("x = " + x + ", y = " + y);

        Account savings = null; // biến tham chiếu chưa trỏ tới object nào
        System.out.println("savings       = " + savings);
    }
}

class Account {
    String owner;
    long balance;

    Account(String owner, long balance) {
        this.owner = owner;
        this.balance = balance;
    }

    void deposit(long amount) {
        balance = balance + amount;
    }
}
```

**Kết quả khi chạy:**

```text
an.balance    = 600000
an == alias   = true
an == other   = false
x = 10, y = 99
savings       = null
```

**Giải thích từng bước:**

1. `an` trỏ tới object #1 trên heap.
2. `Account alias = an;` **chép tham chiếu**, không chép object. Giờ `an` và `alias` là hai thẻ
   cùng mở một két.
3. Nạp tiền qua `alias`, rồi đọc qua `an` thấy `600000`: vì chỉ có một object.
4. `an == alias` là `true`. Với kiểu tham chiếu, `==` hỏi "có phải **cùng một object** không".
5. `other` là object #2 có dữ liệu giống hệt, nhưng `an == other` là `false`. Chính vì vậy ở bài 4
   bạn phải so sánh chuỗi bằng `equals`, không bằng `==`.
6. `x` và `y` là `long`: `y = x` chép **giá trị**, sửa `y` không ảnh hưởng `x`.
7. `savings` bằng `null`: biến có tồn tại, nhưng không trỏ tới object nào.

**Gọi method trên `null` thì sao?** Không có object để gọi, JVM ném ra **`NullPointerException`**
(viết tắt NPE), một **ngoại lệ** (*exception*, chặng 3 sẽ học kỹ) làm chương trình dừng ngay.

```java
public class NullDemo {
    public static void main(String[] args) {
        Account savings = null;   // biến tồn tại nhưng chưa trỏ tới object nào
        System.out.println("savings = " + savings);

        savings.deposit(100_000); // gọi method trên "không có gì"
        System.out.println("Dòng này không bao giờ chạy tới");
    }
}

class Account {
    long balance;

    void deposit(long amount) {
        balance = balance + amount;
    }
}
```

**Kết quả khi chạy** (`java NullDemo.java`):

```text
savings = null
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "Account.deposit(long)" because "<local1>" is null
	at NullDemo.main(NullDemo.java:6)
```

Từ JDK 14, thông báo NPE được viết "dễ hiểu" hơn, chỉ ra **cái gì** đang `null` (JEP 358, bật mặc
định từ JDK 15) [7]. Đọc thông báo trên:

- `Cannot invoke "Account.deposit(long)"`: không gọi được method `deposit` của `Account`.
- `because "<local1>" is null`: vì **biến cục bộ số 1** đang `null`. Biến số 0 là `args`, biến số 1
  là `savings`.
- `at NullDemo.main(NullDemo.java:6)`: lỗi xảy ra ở **dòng 6**.

JVM ghi `<local1>` thay vì `savings` vì mặc định file `.class` không lưu tên biến cục bộ. Biên dịch
với cờ `-g` (thêm thông tin debug) thì thấy tên thật:

```text
$ javac -g -d out NullDemo.java && java -cp out NullDemo
savings = null
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "Account.deposit(long)" because "savings" is null
	at NullDemo.main(NullDemo.java:6)
```

### ⚠️ Lỗi hay gặp

**Lỗi 1: tưởng `=` tạo ra bản sao.** `Account backup = an;` **không** sao lưu gì cả. Mọi thay đổi
qua `an` đều hiện ra ở `backup`, vì đó là cùng một object. Muốn có object riêng thì phải `new`.

**Lỗi 2: field kiểu tham chiếu chưa được gán.** Field `String` mặc định là `null` (phần 2). Gọi
method trên nó là NPE:

```java
public class NullField {
    public static void main(String[] args) {
        Account an = new Account();          // owner chưa được gán => null
        System.out.println(an.owner.toUpperCase());
    }
}

class Account {
    String owner;
    long balance;
}
```

```text
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.toUpperCase()" because "<local1>.owner" is null
	at NullField.main(NullField.java:4)
```

`"<local1>.owner" is null` nghĩa là field `owner` của biến số 1 (`an`) đang `null`. **Cách sửa:**
dùng constructor bắt buộc truyền `owner` (phần 4), để không object nào được tạo ra mà thiếu tên.

## 6. `static` và `toString()`

**Ý tưởng nôm na.** Mỗi sổ tài khoản ghi số dư **riêng** của khách. Nhưng tấm bảng "chi nhánh đã
mở bao nhiêu tài khoản" treo trên tường thì chỉ có **một**, ai cũng nhìn chung. Field thường là
**instance field** (thuộc tính của từng object). Field có từ khoá **`static`** thuộc về **class**:
chỉ có một bản, mọi object dùng chung [8].

<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Field static so với field instance. Phía trên là class Account với một bản duy nhất của field static openedCount bằng 2, truy cập bằng Account.openedCount. Phía dưới là hai object an và binh, mỗi object có bản riêng của field instance owner và balance: an có owner An, balance 500000; binh có owner Bình, balance 1200000. Cả hai object cùng dùng chung một openedCount.">
  <defs>
    <marker id="b6-static-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#D97706"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="200" y="10" width="320" height="76" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="360" y="32" text-anchor="middle" font-weight="bold" fill="#D97706">class Account: MỘT bản dùng chung</text>
    <text x="360" y="56" text-anchor="middle" font-family="monospace" font-size="13" fill="#0F172A">static int openedCount = 2</text>
    <text x="360" y="76" text-anchor="middle" fill="#64748B">gọi bằng: Account.openedCount</text>
    <rect x="60" y="140" width="250" height="90" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="185" y="162" text-anchor="middle" font-weight="bold" fill="#1D4ED8">object an (bản riêng)</text>
    <text x="80" y="190" font-family="monospace" fill="#0F172A">owner   = "An"</text>
    <text x="80" y="212" font-family="monospace" fill="#0F172A">balance = 500000</text>
    <rect x="410" y="140" width="250" height="90" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="535" y="162" text-anchor="middle" font-weight="bold" fill="#1D4ED8">object binh (bản riêng)</text>
    <text x="430" y="190" font-family="monospace" fill="#0F172A">owner   = "Bình"</text>
    <text x="430" y="212" font-family="monospace" fill="#0F172A">balance = 1200000</text>
    <line x1="185" y1="138" x2="270" y2="92" stroke="#D97706" stroke-dasharray="5 4" marker-end="url(#b6-static-arrow)"/>
    <line x1="535" y1="138" x2="450" y2="92" stroke="#D97706" stroke-dasharray="5 4" marker-end="url(#b6-static-arrow)"/>
    <text x="360" y="125" text-anchor="middle" fill="#D97706">cả hai cùng nhìn một bộ đếm</text>
  </g>
</svg>

```java
public class StaticAndToString {
    public static void main(String[] args) {
        System.out.println("Đã mở: " + Account.openedCount); // gọi qua tên class

        Account an = new Account("An", 500_000);
        Account binh = new Account("Bình", 1_200_000);

        System.out.println("Đã mở: " + Account.openedCount);
        System.out.println(an);      // println tự gọi an.toString()
        System.out.println(binh);
    }
}

class Account {
    static int openedCount = 0;  // static: MỘT bản duy nhất, dùng chung cho cả class
    String owner;                // instance: mỗi object một bản riêng
    long balance;

    Account(String owner, long balance) {
        this.owner = owner;
        this.balance = balance;
        openedCount++;           // mỗi lần mở tài khoản thì tăng bộ đếm chung
    }

    @Override
    public String toString() {
        return "Account[owner=" + owner + ", balance=" + balance + "]";
    }
}
```

**Kết quả khi chạy:**

```text
Đã mở: 0
Đã mở: 2
Account[owner=An, balance=500000]
Account[owner=Bình, balance=1200000]
```

**Giải thích từng bước:**

1. `Account.openedCount` được gọi qua **tên class**, chưa cần object nào. Lúc đầu là `0`.
2. Mỗi lần `new Account(...)`, constructor chạy `openedCount++`. Hai lần `new` thì bộ đếm thành `2`.
   Còn `owner`, `balance` thì mỗi object có bản riêng.
3. `System.out.println(an)` tự gọi method **`toString()`** của object để lấy chuỗi in ra.
4. Ta tự viết `toString()` để in đẹp. **`@Override`** là một **annotation** (chú thích cho
   compiler), nói rằng "method này **ghi đè** (*override*) một method có sẵn". Có sẵn ở đâu? Mọi
   class trong Java đều tự động có `toString()` thừa hưởng từ class gốc `Object` [9]. Chữ `public`
   bắt buộc ở đây, chặng 2 sẽ giải thích vì sao.

Bạn đã dùng `static` từ bài 1 mà chưa biết: `public static void main` là method static, nên JVM
gọi được nó mà không cần tạo object nào.

Nếu **không** viết `toString()`, bạn nhận bản mặc định của `Object`: tên class, ký tự `@`, rồi mã
băm (*hash code*) viết ở hệ 16 [9]. Con số này có thể khác trên máy bạn.

```java
public class NoToString {
    public static void main(String[] args) {
        Account an = new Account();
        an.owner = "An";
        System.out.println(an);   // chưa định nghĩa toString()
    }
}

class Account {
    String owner;
    long balance;
}
```

```text
Account@1188e820
```

### ⚠️ Lỗi hay gặp

**Lỗi 1: method static đọc field instance.** Method static thuộc về class, không gắn với object
nào, nên nó không biết "`balance` của ai".

```java
class Account {
    static int openedCount = 0;
    long balance;

    static void printReport() {
        System.out.println(openedCount + " tài khoản, số dư " + balance);
    }
}
```

```text
StaticToInstance.java:6: error: non-static variable balance cannot be referenced from a static context
        System.out.println(openedCount + " tài khoản, số dư " + balance);
                                                                ^
1 error
```

**Cách sửa:** bỏ `static` để nó thành method của từng object, hoặc truyền object vào làm tham số.

**Lỗi 2: gõ sai tên khi ghi đè.** `tostring` khác `toString` (Java phân biệt hoa thường).
`@Override` bắt được lỗi này ngay lúc biên dịch:

```java
class Account {
    String owner;

    @Override
    public String tostring() {   // gõ sai: s thường
        return "Account[owner=" + owner + "]";
    }
}
```

```text
TypoOverride.java:4: error: method does not override or implement a method from a supertype
    @Override
    ^
1 error
```

Nếu không có `@Override`, code vẫn biên dịch, nhưng `println` sẽ âm thầm in kiểu `Account@...`.
Đó là lý do nên **luôn** viết `@Override` khi ghi đè.

## 7. Bảo vệ dữ liệu bước đầu: `private` và kiểm tra hợp lệ

**Ý tưởng nôm na.** Khách không được tự mở két để sửa số dư. Mọi thay đổi phải qua **quầy giao
dịch**, nơi nhân viên kiểm tra: số tiền có dương không, có đủ tiền để rút không. Trong Java, từ
khoá **`private`** khoá field lại: chỉ code **bên trong class** mới chạm được. Bên ngoài phải đi
qua method, và method chính là quầy giao dịch.

Đây mới là **bản xem trước** của hai chủ đề ở chặng 2: **Access Specifiers** (các mức truy cập
`private`, `public`...) [13] và **Encapsulation** (đóng gói) [1].

<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bảo vệ dữ liệu bằng private và kiểm tra hợp lệ. Code bên ngoài trong Main chỉ có thể thay đổi số dư qua hai cửa là method deposit, kiểm tra amount lớn hơn 0, và method withdraw, kiểm tra 0 nhỏ hơn amount và amount không vượt quá balance. Hai method này mới được chạm vào field private long balance nằm trong class Account. Đường truy cập thẳng an.balance = ... từ bên ngoài bị javac chặn bằng lỗi has private access.">
  <defs>
    <marker id="b6-guard-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="60" width="180" height="60" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="100" y="85" text-anchor="middle" fill="#0F172A">Code bên ngoài</text>
    <text x="100" y="104" text-anchor="middle" font-family="monospace" fill="#64748B">Main.main()</text>
    <rect x="265" y="10" width="445" height="200" rx="12" fill="#F8FAFC" stroke="#2563EB" stroke-width="1.5"/>
    <text x="280" y="30" font-family="monospace" font-weight="bold" fill="#1D4ED8">class Account</text>
    <rect x="285" y="48" width="225" height="56" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="397" y="70" text-anchor="middle" font-family="monospace" fill="#047857">deposit(amount)</text>
    <text x="397" y="91" text-anchor="middle" font-size="11" fill="#64748B">kiểm tra: amount &gt; 0</text>
    <rect x="285" y="124" width="225" height="56" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="397" y="146" text-anchor="middle" font-family="monospace" fill="#047857">withdraw(amount)</text>
    <text x="397" y="167" text-anchor="middle" font-size="11" fill="#64748B">kiểm tra: 0 &lt; amount ≤ balance</text>
    <rect x="550" y="70" width="145" height="80" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="622" y="100" text-anchor="middle" font-family="monospace" fill="#D97706">private</text>
    <text x="622" y="122" text-anchor="middle" font-family="monospace" fill="#0F172A">long balance</text>
    <line x1="190" y1="82" x2="281" y2="76" stroke="#64748B" marker-end="url(#b6-guard-arrow)"/>
    <line x1="190" y1="100" x2="281" y2="150" stroke="#64748B" marker-end="url(#b6-guard-arrow)"/>
    <line x1="510" y1="76" x2="546" y2="96" stroke="#64748B" marker-end="url(#b6-guard-arrow)"/>
    <line x1="510" y1="152" x2="546" y2="128" stroke="#64748B" marker-end="url(#b6-guard-arrow)"/>
    <polyline points="100,120 100,192 250,192" fill="none" stroke="#DC2626" stroke-dasharray="5 4"/>
    <line x1="252" y1="184" x2="268" y2="200" stroke="#DC2626" stroke-width="3"/>
    <line x1="268" y1="184" x2="252" y2="200" stroke="#DC2626" stroke-width="3"/>
    <text x="110" y="183" font-family="monospace" fill="#DC2626">an.balance = ...</text>
    <text x="20" y="230" fill="#DC2626">Truy cập thẳng: javac báo lỗi "has private access"</text>
  </g>
</svg>

```java
public class SafeAccount {
    public static void main(String[] args) {
        Account an = new Account("An", 500_000);

        System.out.println("Nạp -50.000:  " + an.deposit(-50_000));  // số âm: từ chối
        System.out.println("Rút 800.000:  " + an.withdraw(800_000)); // quá số dư: từ chối
        System.out.println("Rút 200.000:  " + an.withdraw(200_000)); // hợp lệ
        System.out.println(an.getOwner() + " còn " + an.getBalance() + " đồng");
    }
}

class Account {
    private String owner;   // private: chỉ code bên trong class Account được đụng vào
    private long balance;

    Account(String owner, long openingBalance) {
        this.owner = owner;
        this.balance = Math.max(openingBalance, 0); // không cho số dư ban đầu âm
    }

    // Trả về true nếu nạp thành công, false nếu bị từ chối
    boolean deposit(long amount) {
        if (amount <= 0) {
            return false;
        }
        balance += amount;
        return true;
    }

    boolean withdraw(long amount) {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }

    long getBalance() { return balance; }
    String getOwner() { return owner; }
}
```

**Kết quả khi chạy:**

```text
Nạp -50.000:  false
Rút 800.000:  false
Rút 200.000:  true
An còn 300000 đồng
```

**Giải thích từng bước:**

1. `owner` và `balance` là `private`. Từ `main` (class khác), không có cách nào đọc hay sửa thẳng.
2. Constructor dùng `Math.max(openingBalance, 0)` để số dư ban đầu không bao giờ âm.
3. `deposit(-50_000)`: điều kiện `amount <= 0` đúng, method `return false` ngay, số dư giữ nguyên.
4. `withdraw(800_000)`: `800000 > 500000`, bị từ chối.
5. `withdraw(200_000)`: hợp lệ, số dư còn `300000`, trả về `true`.
6. Muốn **đọc** số dư thì gọi `getBalance()`. Method kiểu này gọi là **getter**.

Ở đây ta báo "thất bại" bằng `boolean` cho đơn giản. Ở chặng 3, bạn sẽ học cách chuẩn hơn là ném
**exception** (ví dụ `IllegalArgumentException`) khi dữ liệu không hợp lệ.

### ⚠️ Lỗi hay gặp

**Lỗi 1: cố sửa thẳng field `private` từ bên ngoài.** Đây là lỗi bạn **muốn** thấy: javac đang
bảo vệ dữ liệu giúp bạn.

```java
public class PrivateAccess {
    public static void main(String[] args) {
        Account an = new Account(500_000);
        an.balance = 999_999_999;   // cố sửa thẳng số dư
    }
}

class Account {
    private long balance;

    Account(long openingBalance) {
        this.balance = openingBalance;
    }
}
```

```text
PrivateAccess.java:4: error: balance has private access in Account
        an.balance = 999_999_999;   // cố sửa thẳng số dư
          ^
1 error
```

**Cách sửa:** gọi method `an.deposit(...)` hoặc `an.withdraw(...)`.

**Lỗi 2: bỏ qua kết quả `true`/`false`.** Method đã từ chối, nhưng nơi gọi không kiểm tra và vẫn
báo thành công. Với ngân hàng, đây là lỗi nghiêm trọng.

```java
public class IgnoredResult {
    public static void main(String[] args) {
        Account an = new Account(500_000);
        an.withdraw(800_000);                 // bỏ qua kết quả true/false
        System.out.println("Đã rút 800.000 thành công!");
        System.out.println("Số dư: " + an.getBalance());
    }
}

class Account {
    private long balance;

    Account(long openingBalance) {
        this.balance = openingBalance;
    }

    boolean withdraw(long amount) {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }

    long getBalance() { return balance; }
}
```

```text
Đã rút 800.000 thành công!
Số dư: 500000
```

**Cách sửa:** luôn kiểm tra kết quả:
`if (an.withdraw(800_000)) { ... } else { System.out.println("Không đủ số dư"); }`.

## 8. Nhiều class, nhiều file

**Ý tưởng nôm na.** Ngân hàng không nhét mọi giấy tờ vào một ngăn kéo. Mỗi loại hồ sơ có ngăn
riêng, có nhãn riêng. Chương trình Java thật cũng vậy: **mỗi class quan trọng một file**, và tên
file trùng tên class. Từ phần này, ta tách `Account` ra khỏi file chứa `main`.

Quy tắc: một file `.java` có **tối đa một** class `public` (công khai, ai cũng dùng được), và tên
file **phải trùng** tên class đó. javac bắt buộc quy tắc này [10].

<svg viewBox="0 0 720 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Biên dịch chương trình nhiều file. Hai file nguồn Account.java chứa public class Account và Main.java chứa public class Main. Lệnh javac -d out *.java biên dịch cả hai cùng lúc và ghi Account.class, Main.class vào thư mục out. Lệnh java -cp out Main tìm class trong thư mục out và chạy method main của class Main. Quy tắc: mỗi file .java có tối đa một public class, và tên file phải trùng tên public class đó.">
  <defs>
    <marker id="b6-files-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="30" width="145" height="50" rx="8" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="82" y="51" text-anchor="middle" font-family="monospace" fill="#0F172A">Account.java</text>
    <text x="82" y="69" text-anchor="middle" font-size="11" fill="#64748B">public class Account</text>
    <rect x="10" y="110" width="145" height="50" rx="8" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="82" y="131" text-anchor="middle" font-family="monospace" fill="#0F172A">Main.java</text>
    <text x="82" y="149" text-anchor="middle" font-size="11" fill="#64748B">public class Main</text>
    <rect x="190" y="70" width="170" height="50" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="275" y="91" text-anchor="middle" font-family="monospace" fill="#1D4ED8">javac -d out *.java</text>
    <text x="275" y="109" text-anchor="middle" font-size="11" fill="#64748B">biên dịch cả hai file</text>
    <line x1="155" y1="55" x2="186" y2="85" stroke="#64748B" marker-end="url(#b6-files-arrow)"/>
    <line x1="155" y1="135" x2="186" y2="105" stroke="#64748B" marker-end="url(#b6-files-arrow)"/>
    <rect x="395" y="20" width="140" height="150" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="465" y="42" text-anchor="middle" font-family="monospace" font-weight="bold" fill="#D97706">out/</text>
    <rect x="410" y="60" width="110" height="34" rx="6" fill="#FFFFFF" stroke="#D97706"/>
    <text x="465" y="82" text-anchor="middle" font-family="monospace" fill="#0F172A">Account.class</text>
    <rect x="410" y="110" width="110" height="34" rx="6" fill="#FFFFFF" stroke="#D97706"/>
    <text x="465" y="132" text-anchor="middle" font-family="monospace" fill="#0F172A">Main.class</text>
    <line x1="360" y1="95" x2="391" y2="95" stroke="#64748B" marker-end="url(#b6-files-arrow)"/>
    <rect x="565" y="70" width="145" height="50" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="637" y="91" text-anchor="middle" font-family="monospace" fill="#047857">java -cp out Main</text>
    <text x="637" y="109" text-anchor="middle" font-size="11" fill="#64748B">chạy Main.main()</text>
    <line x1="535" y1="95" x2="561" y2="95" stroke="#64748B" marker-end="url(#b6-files-arrow)"/>
    <text x="360" y="205" text-anchor="middle" fill="#0F172A">Quy tắc: mỗi file .java có tối đa 1 public class, và tên file = tên class đó</text>
  </g>
</svg>

**File `Account.java`:**

```java
// File Account.java: chứa đúng MỘT public class tên Account
public class Account {
    private static int openedCount = 0;

    private String owner;
    private long balance;

    Account(String owner, long openingBalance) {
        this.owner = owner;
        this.balance = Math.max(openingBalance, 0);
        openedCount++;
    }

    boolean deposit(long amount) {
        if (amount <= 0) {
            return false;
        }
        balance += amount;
        return true;
    }

    boolean withdraw(long amount) {
        if (amount <= 0 || amount > balance) {
            return false;
        }
        balance -= amount;
        return true;
    }

    long getBalance() { return balance; }

    static int getOpenedCount() { return openedCount; }

    @Override
    public String toString() {
        return "Account[owner=" + owner + ", balance=" + balance + "]";
    }
}
```

**File `Main.java`:**

```java
// File Main.java: điểm bắt đầu của chương trình
public class Main {
    public static void main(String[] args) {
        Account an = new Account("An", 500_000);
        Account binh = new Account("Bình", 0);

        an.deposit(200_000);
        boolean ok = binh.withdraw(50_000);   // Bình chưa có tiền

        System.out.println(an);
        System.out.println(binh);
        System.out.println("Bình rút được không? " + ok);
        System.out.println("Tổng số tài khoản: " + Account.getOpenedCount());
    }
}
```

Đặt hai file vào cùng một thư mục, rồi chạy:

```text
$ javac -d out *.java
$ ls out
Account.class
Main.class
$ java -cp out Main
Account[owner=An, balance=700000]
Account[owner=Bình, balance=0]
Bình rút được không? false
Tổng số tài khoản: 2
```

**Giải thích từng bước:**

1. `javac -d out *.java`: biên dịch **mọi** file `.java` trong thư mục. Cờ `-d out` bảo javac ghi
   file `.class` vào thư mục `out` (tự tạo nếu chưa có), không để lẫn với file nguồn.
2. Ta được `Account.class` và `Main.class`: **mỗi class một file `.class`**.
3. `java -cp out Main`: `-cp` (*classpath*) chỉ cho JVM chỗ tìm file `.class`. `Main` là **tên
   class** chứa `main`, không có đuôi `.class`.
4. Khi `Main` dùng tới `Account`, JVM tự tìm `Account.class` trong `out` và nạp vào.
5. `openedCount` giờ là `private static`, nên `Main` đọc nó qua method static
   `Account.getOpenedCount()`.

### ⚠️ Lỗi hay gặp

**Lỗi 1: tên file không khớp tên public class.** Ví dụ lưu `public class Account` vào file
`Bank.java`:

```text
Bank.java:1: error: class Account is public, should be declared in a file named Account.java
public class Account {
       ^
1 error
```

Đặt hai public class trong cùng một file cũng bị lỗi tương tự:

```text
Two.java:1: error: class Account is public, should be declared in a file named Account.java
public class Account {
       ^
Two.java:4: error: class Main is public, should be declared in a file named Main.java
public class Main {
       ^
2 errors
```

**Cách sửa:** đổi tên file cho trùng tên class, mỗi public class một file.

**Lỗi 2: chạy `java Main.java` khi chương trình có nhiều file (trên JDK 21).** Các bài trước, bạn có
thể đã chạy thẳng file nguồn bằng `java File.java`. Trên JDK 21, cách này **chỉ biên dịch đúng một file** đó,
nên không thấy `Account` (rút gọn):

```text
Main.java:4: error: cannot find symbol
        Account an = new Account("An", 500_000);
        ^
  symbol:   class Account
  location: class Main
...
5 errors
error: compilation failed
```

**Cách sửa:** dùng `javac -d out *.java` rồi `java -cp out Main`. Từ JDK 22, chế độ chạy file nguồn
đã biết tự tìm các file `.java` khác trong cùng thư mục (JEP 458) [14], nên trên Java 25 lệnh
`java Main.java` chạy được ví dụ này. Dù vậy, `javac` + `java` vẫn là cách bạn sẽ gặp trong mọi
dự án thật.

**Lỗi 3: chạy `java Main` ở sai chỗ.** Nếu quên `-cp out`, JVM tìm `Main.class` trong thư mục
hiện tại và không thấy:

```text
Error: Could not find or load main class Main
Caused by: java.lang.ClassNotFoundException: Main
```

**Cách sửa:** `java -cp out Main`, hoặc `cd` vào đúng thư mục chứa file `.class`.

## 9. Bản đồ chặng 2: bốn trụ cột của OOP

**Ý tưởng nôm na.** Bài này là phần **móng nhà**: class, object, field, method, constructor. Chặng
2 sẽ dựng **bốn trụ cột** lên trên móng đó. Bạn chưa cần hiểu sâu, chỉ cần biết tên và hình dung
chúng giải quyết việc gì [1][3].

<svg viewBox="0 0 720 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bốn trụ cột của lập trình hướng đối tượng, sẽ học ở chặng 2, dựng trên nền móng của bài này. Encapsulation, đóng gói: balance là private, chỉ đổi qua withdraw. Inheritance, kế thừa: SavingAccount là một loại Account. Polymorphism, đa hình: cùng lệnh tính lãi, mỗi loại tài khoản tính một cách. Abstraction, trừu tượng: chỉ cần gọi transfer, không cần biết chi tiết bên trong. Nền móng: class, object, field, method, constructor, đã học ở bài 6.">
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <polygon points="360,10 700,70 20,70" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="360" y="58" font-size="13" font-weight="bold" fill="#1D4ED8">Lập trình hướng đối tượng (Chặng 2)</text>
    <rect x="30" y="80" width="150" height="120" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="105" y="104" font-weight="bold" fill="#1D4ED8">Encapsulation</text>
    <text x="105" y="122" fill="#64748B">Đóng gói</text>
    <text x="105" y="156" font-size="11" fill="#0F172A">balance là private,</text>
    <text x="105" y="174" font-size="11" fill="#0F172A">chỉ đổi qua withdraw()</text>
    <rect x="200" y="80" width="150" height="120" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="275" y="104" font-weight="bold" fill="#1D4ED8">Inheritance</text>
    <text x="275" y="122" fill="#64748B">Kế thừa</text>
    <text x="275" y="156" font-size="11" fill="#0F172A">SavingAccount là</text>
    <text x="275" y="174" font-size="11" fill="#0F172A">một loại Account</text>
    <rect x="370" y="80" width="150" height="120" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="445" y="104" font-weight="bold" fill="#1D4ED8">Polymorphism</text>
    <text x="445" y="122" fill="#64748B">Đa hình</text>
    <text x="445" y="156" font-size="11" fill="#0F172A">cùng lệnh tính lãi,</text>
    <text x="445" y="174" font-size="11" fill="#0F172A">mỗi loại TK một kiểu</text>
    <rect x="540" y="80" width="150" height="120" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="615" y="104" font-weight="bold" fill="#1D4ED8">Abstraction</text>
    <text x="615" y="122" fill="#64748B">Trừu tượng</text>
    <text x="615" y="156" font-size="11" fill="#0F172A">chỉ cần gọi transfer(),</text>
    <text x="615" y="174" font-size="11" fill="#0F172A">ẩn chi tiết bên trong</text>
    <rect x="20" y="212" width="680" height="44" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="360" y="232" font-weight="bold" fill="#047857">Nền móng (bài này): class · object · field · method · constructor</text>
    <text x="360" y="249" font-size="11" fill="#64748B">vững nền móng thì bốn trụ cột mới đứng được</text>
  </g>
</svg>

| Trụ cột | Một câu nôm na | Ví dụ ngân hàng |
|---------|----------------|-----------------|
| **Encapsulation** (đóng gói) | Giấu dữ liệu, chỉ mở "quầy giao dịch" có kiểm tra | `balance` là `private`, chỉ đổi qua `deposit`/`withdraw` (bạn vừa làm ở phần 7) |
| **Inheritance** (kế thừa) | Class mới thừa hưởng field và method của class có sẵn | `SavingAccount` (tài khoản tiết kiệm) là một loại `Account`, có thêm lãi suất |
| **Polymorphism** (đa hình) | Cùng một lời gọi, mỗi loại object làm theo cách riêng | Gọi `calculateInterest()` trên mọi tài khoản: tiết kiệm tính kiểu này, thanh toán tính kiểu khác |
| **Abstraction** (trừu tượng) | Chỉ đưa ra "cái gì", giấu "làm thế nào" | Màn hình chuyển tiền chỉ gọi `transfer()`, không cần biết bên trong ghi sổ ra sao |

Thật ra, bạn đã chạm vào hai trụ cột rồi mà không để ý. Chương trình dưới đây chỉ dùng kiến thức
của bài này:

```java
public class PillarsPreview {
    public static void main(String[] args) {
        Account an = new Account("An", 500_000);

        // Inheritance: mọi class đều tự động "kế thừa" từ class Object
        System.out.println("Cha của Account: " + an.getClass().getSuperclass());

        // Polymorphism: biến kiểu Object, nhưng chạy toString() của Account
        Object something = an;
        System.out.println("In qua biến Object: " + something.toString());
    }
}

class Account {
    private String owner;
    private long balance;

    Account(String owner, long balance) {
        this.owner = owner;
        this.balance = balance;
    }

    @Override
    public String toString() {
        return "Account[owner=" + owner + ", balance=" + balance + "]";
    }
}
```

**Kết quả khi chạy:**

```text
Cha của Account: class java.lang.Object
In qua biến Object: Account[owner=An, balance=500000]
```

**Giải thích từng bước:**

1. `an.getClass().getSuperclass()` hỏi "class cha của `Account` là ai?". Câu trả lời là
   `java.lang.Object`. Class nào không ghi rõ cha thì cha là `Object` [15]. Đó là **kế thừa**, và
   là lý do mọi class đều có sẵn `toString()`.
2. Biến `something` có kiểu `Object`, nhưng `something.toString()` lại chạy bản `toString()` **của
   `Account`**. Java chọn method theo **object thật**, không theo kiểu của biến. Đó là **đa hình**.

Chặng 2 sẽ giải thích kỹ cả hai cơ chế này, cùng `extends`, `interface`, `abstract`...

### ⚠️ Lỗi hay gặp

**Lỗi 1: tưởng cứ `private` là đã "đóng gói".** Nếu bạn thêm một setter cho phép gán bất kỳ giá
trị nào, lớp bảo vệ coi như bị gỡ:

```java
public class FakeEncapsulation {
    public static void main(String[] args) {
        Account an = new Account();
        an.setBalance(-5_000_000);   // setter "mở cửa" cho mọi giá trị
        System.out.println("Số dư: " + an.getBalance());
    }
}

class Account {
    private long balance;            // private đấy, nhưng...

    void setBalance(long balance) {  // ...ai cũng gán được bất cứ số nào
        this.balance = balance;
    }

    long getBalance() { return balance; }
}
```

```text
Số dư: -5000000
```

**Cách sửa:** đừng viết setter "mở toang". Hãy đưa ra các method mang **nghiệp vụ** (`deposit`,
`withdraw`) có kiểm tra hợp lệ, như ở phần 7.

**Lỗi 2: học thuộc bốn từ khoá mà bỏ qua nền móng.** Inheritance hay Polymorphism đều dựa trên
class, object, tham chiếu và `null`. Nếu phần 4 và phần 5 còn mơ hồ, hãy làm lại các ví dụ đó
trước khi sang chặng 2.

## Tóm tắt

- **Class** là bản thiết kế, **object** là một "vật" cụ thể tạo từ class bằng `new`. Một class tạo
  được nhiều object độc lập.
- **Field** là dữ liệu mỗi object tự giữ. **Method** là việc object làm được, có thể nhận tham số
  và trả về giá trị (hoặc `void`).
- **Constructor** chạy một lần khi object được tạo. Nó cùng tên class, không có kiểu trả về. Đã
  viết constructor có tham số thì javac không còn tự thêm constructor mặc định.
- `this.x` là field `x` của chính object hiện tại, dùng để phân biệt với tham số trùng tên.
- Biến kiểu class giữ **tham chiếu** (trên stack) tới object (trên heap). `b = a` chép tham chiếu,
  không chép object. `==` so sánh "cùng object hay không".
- Gọi method trên `null` gây `NullPointerException`. Đọc phần `because "..." is null` để biết cái
  gì đang `null`.
- `static` thuộc về class, chỉ một bản dùng chung. Nên viết `toString()` kèm `@Override`.
- `private` + method có kiểm tra hợp lệ là bước đầu của Encapsulation. Mỗi public class nằm trong
  một file trùng tên. Biên dịch bằng `javac -d out *.java`, chạy bằng `java -cp out Main`.

## Tự kiểm tra

**Câu 1.** Đoạn code sau tạo ra bao nhiêu object `Account`?

```java
Account a = new Account("An", 0);
Account b = a;
Account c = new Account("An", 0);
Account d = null;
```

<details><summary>Đáp án</summary>

**2 object.** Chỉ có hai lần `new`. `b` trỏ tới cùng object với `a`. `d` không trỏ tới object nào.
Có 4 biến nhưng chỉ 2 object.

</details>

**Câu 2.** Class `Card` chỉ có constructor `Card(String number)`. Dòng `new Card()` có biên dịch
được không? Vì sao?

<details><summary>Đáp án</summary>

**Không.** javac chỉ tự thêm constructor mặc định khi class **không có constructor nào**. `Card` đã
có một constructor nên javac báo `constructor Card in class Card cannot be applied to given types`.

</details>

**Câu 3.** Sau đoạn code dưới, `a.getBalance()` trả về bao nhiêu? (Dùng class `Account` ở phần 7.)

```java
Account a = new Account("An", 100_000);
Account b = a;
b.withdraw(30_000);
b = new Account("Bình", 0);
b.deposit(50_000);
```

<details><summary>Đáp án</summary>

**70000.** `b.withdraw(30_000)` chạy trên object của An (vì lúc đó `b` và `a` cùng trỏ một object).
Sau đó `b` được trỏ sang object mới của Bình, nên `deposit(50_000)` không ảnh hưởng tới An.

</details>

**Câu 4.** Vì sao `static int openedCount` đếm được tổng số tài khoản, còn nếu bỏ `static` thì
không?

<details><summary>Đáp án</summary>

Field `static` chỉ có **một bản** cho cả class, nên mọi constructor cùng tăng một bộ đếm. Bỏ
`static`, mỗi object có `openedCount` riêng, bắt đầu từ `0` và chỉ tăng lên `1` trong constructor
của chính nó.

</details>

**Câu 5.** Thông báo sau cho bạn biết điều gì?
`Cannot invoke "String.length()" because "<local2>.owner" is null`

<details><summary>Đáp án</summary>

Chương trình gọi `length()` trên một `String` đang `null`. Chuỗi đó là field `owner` của object mà
**biến cục bộ số 2** trỏ tới. Biên dịch với `javac -g` để thấy tên thật của biến.

</details>

**Câu 6.** Tại sao `balance` nên là `private` và chỉ thay đổi qua `deposit`/`withdraw`?

<details><summary>Đáp án</summary>

Để mọi thay đổi số dư đều đi qua **một chỗ có kiểm tra** (số tiền dương, đủ số dư). Nếu ai cũng sửa
được `balance` trực tiếp, chỉ cần một dòng code sai ở bất kỳ đâu là số dư âm hoặc sai, và rất khó
tìm ra thủ phạm.

</details>

## Bài tập

**Bài 1 (dễ).** Thêm field `private String accountNumber` vào `Account` ở phần 8. Sửa constructor
để nhận thêm số tài khoản, và sửa `toString()` để in ra dạng
`Account[number=0123456789, owner=An, balance=700000]`.

> 💡 Gợi ý: constructor giờ có 3 tham số. Nhớ sửa luôn các lời gọi `new` trong `Main.java`, nếu
> không javac sẽ báo lỗi `cannot be applied to given types` như phần 4.

**Bài 2 (vừa).** Viết method `boolean transferTo(Account target, long amount)` trong `Account`:
rút `amount` từ tài khoản hiện tại và nạp vào `target`. Chuyển thất bại thì không tài khoản nào bị
thay đổi. Thử chuyển 300.000 từ An sang Bình, rồi thử chuyển một số tiền lớn hơn số dư.

> 💡 Gợi ý: tái sử dụng `withdraw`. Nếu `this.withdraw(amount)` trả về `false` thì `return false`
> ngay. Nếu thành công thì gọi `target.deposit(amount)`. Nên kiểm tra thêm `target == null` và
> `target == this`.

**Bài 3 (khó hơn).** Viết class `Bank` trong file `Bank.java`, giữ một mảng `Account[]` (bài 5).
Thêm các method:

- `long totalBalance()`: tổng số dư mọi tài khoản.
- `Account findByOwner(String owner)`: trả về tài khoản đầu tiên có tên chủ trùng khớp, không thấy
  thì trả về `null`.

Trong `Main`, tìm một tên không tồn tại và xử lý sao cho chương trình **không** bị
`NullPointerException`.

> 💡 Gợi ý: `Account` cần thêm getter `getOwner()`. So sánh chuỗi bằng `equals`, không bằng `==`
> (bài 4). Trước khi gọi method trên kết quả của `findByOwner`, hãy kiểm tra `if (found != null)`.

## Đọc thêm

1. roadmap.sh: Java Developer Roadmap, mục *Basics of OOP*. <https://roadmap.sh/java>
2. Jakob Jenkov: Java Classes. <https://jenkov.com/tutorials/java/classes.html>
3. Oracle: Object-Oriented Programming Concepts (The Java Tutorials). <https://docs.oracle.com/javase/tutorial/java/concepts/index.html>
4. Oracle: Classes and Objects (The Java Tutorials). <https://docs.oracle.com/javase/tutorial/java/javaOO/index.html>
5. JLS 21, §4.12.5 Initial Values of Variables. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.12.5>
6. JLS 21, §8.8.9 Default Constructor. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.8.9>
7. JEP 358: Helpful NullPointerExceptions. <https://openjdk.org/jeps/358>
8. Oracle: Understanding Class Members (static). <https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html>
9. Java SE 21 API: `Object.toString()`. <https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Object.html#toString()>
10. JLS 21, §7.6 Top Level Class and Interface Declarations. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-7.html#jls-7.6>
11. JLS 21, §12.5 Creation of New Class Instances. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-12.html#jls-12.5>
12. JVMS 21, §2.5 Run-Time Data Areas (stack và heap). <https://docs.oracle.com/javase/specs/jvms/se21/html/jvms-2.html#jvms-2.5>
13. Jakob Jenkov: Java Access Modifiers. <https://jenkov.com/tutorials/java/access-modifiers.html>
14. JEP 458: Launch Multi-File Source-Code Programs. <https://openjdk.org/jeps/458>
15. JLS 21, §8.1.4 Superclasses and Subclasses. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.1.4>
16. Programiz: Java Class and Objects. <https://www.programiz.com/java-programming/class-objects>

**Bài tiếp theo:** [Bài 7 · Checkpoint: CLI tính lãi kép](/docs/learning/chang-1/checkpoint-lai-kep)
