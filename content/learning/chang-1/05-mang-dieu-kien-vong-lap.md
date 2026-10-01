---
title: "Bài 5 · Mảng, điều kiện và vòng lặp"
description: "Dạy chương trình biết rẽ nhánh (if, switch), biết lặp lại (while, for) và biết giữ một dãy dữ liệu (mảng), rồi ghép lại thành một mini ATM chạy trên console."
order: 15
tags: [java, chặng-1, điều-kiện, vòng-lặp, mảng, scanner]
---

# Bài 5 · Mảng, điều kiện và vòng lặp

> 🎯 **Sau bài này bạn sẽ:**
> - Viết được điều kiện với `if / else if / else`, `switch` (cả kiểu cũ lẫn kiểu `->`) và toán tử `?:`.
> - Chọn đúng vòng lặp `while`, `do-while`, `for`, for-each cho từng bài toán, dùng được `break` và `continue`.
> - Tạo, duyệt, sắp xếp, sao chép mảng 1 chiều và 2 chiều, giải thích được vì sao gán mảng không tạo bản sao.
> - Đọc dữ liệu từ bàn phím bằng `Scanner` mà không dính bẫy `nextInt()` rồi `nextLine()`.
> - Tự viết một mini ATM có menu chạy trong vòng lặp.

**Cần biết trước:** [Bài 3 · Kiểu dữ liệu, biến và ép kiểu](/docs/learning/chang-1/kieu-du-lieu-bien-ep-kieu)
và [Bài 4 · Chuỗi và phép toán](/docs/learning/chang-1/chuoi-va-phep-toan). Bạn cần biết `int`, `long`,
`boolean`, `String`, các phép `+ - * / %`, `+=` và `++`.

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| Điều kiện (*condition*) | Một câu hỏi chỉ có đáp án đúng/sai | `amount <= balance` |
| Rẽ nhánh (*branching*) | Chọn một trong nhiều đường đi tuỳ điều kiện | `if`, `switch` |
| Đoản mạch (*short-circuit*) | Biết chắc kết quả rồi thì không xét vế còn lại | `note != null && note.length() > 0` |
| Vòng lặp (*loop*) | Lặp lại một khối lệnh khi điều kiện còn đúng | `while`, `for` |
| Lần lặp (*iteration*) | Một lượt chạy thân vòng lặp | "tháng 1", "tháng 2"... |
| Mảng (*array*) | Một dãy ô liền nhau, cùng kiểu, số ô cố định | `long[] history` |
| Chỉ số (*index*) | Số thứ tự của ô trong mảng, đếm từ 0 | `history[0]` |
| Tham chiếu (*reference*) | "Địa chỉ" trỏ tới dữ liệu, không phải bản thân dữ liệu | `long[] alias = original;` |
| `Scanner` | Công cụ đọc chữ/số người dùng gõ vào | `scanner.nextInt()` |

Ba chủ đề của bài này nằm trong nhánh **Learn the Basics** của roadmap Java: *Conditionals*, *Loops* và
*Arrays* [1].

---

## 1. Toán tử so sánh và toán tử logic

**Ý tưởng nôm na.** Trước khi cho rút tiền, ATM tự hỏi vài câu: "Thẻ có bị khoá không?", "Số tiền có
nhỏ hơn số dư không?". Mỗi câu hỏi chỉ có hai đáp án: đúng (`true`) hoặc sai (`false`). Trong Java,
câu hỏi đó gọi là **điều kiện** (*condition*), và kết quả của nó là một giá trị `boolean`.

Có hai nhóm toán tử để đặt câu hỏi [2]:

| Nhóm | Toán tử | Nghĩa |
|------|---------|-------|
| **So sánh** (*comparison*) | `==` `!=` | bằng, khác |
| | `<` `>` `<=` `>=` | nhỏ hơn, lớn hơn, nhỏ hơn hoặc bằng, lớn hơn hoặc bằng |
| **Logic** (*logical*) | `&&` | VÀ: cả hai vế đều đúng |
| | `\|\|` | HOẶC: ít nhất một vế đúng |
| | `!` | PHỦ ĐỊNH: đảo đúng thành sai và ngược lại |

`&&` và `||` có một tính chất quan trọng tên là **đoản mạch** (*short-circuit*): Java tính vế trái
trước. Nếu vế trái đã đủ để biết kết quả, Java **không tính vế phải** nữa [3]:

- `A && B`: nếu `A` là `false` thì cả biểu thức chắc chắn `false`, bỏ qua `B`.
- `A || B`: nếu `A` là `true` thì cả biểu thức chắc chắn `true`, bỏ qua `B`.

<svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Short-circuit của toán tử &amp;&amp;. Hàng trên: note bằng null, vế trái note != null cho false nên Java dừng ngay, vế phải note.length() > 0 bị bỏ qua, kết quả false. Hàng dưới: note có giá trị, vế trái true nên Java xét tiếp vế phải, kết quả true.">
  <defs>
    <marker id="b5-sc-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/></marker>
    <marker id="b5-sc-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/></marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <text x="6" y="70" text-anchor="start" fill="#0F172A" font-size="11">note = null</text>
    <rect x="100" y="48" width="150" height="44" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="175" y="66" fill="#1D4ED8" font-family="monospace">note != null</text>
    <text x="175" y="83" fill="#DC2626">→ false</text>
    <rect x="310" y="48" width="190" height="44" rx="8" fill="#F8FAFC" stroke="#94A3B8" stroke-dasharray="4 3"/>
    <text x="405" y="66" fill="#94A3B8" font-family="monospace">note.length() &gt; 0</text>
    <text x="405" y="83" fill="#64748B">không chạy (bỏ qua)</text>
    <rect x="560" y="48" width="150" height="44" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="635" y="75" fill="#DC2626">Kết quả: false</text>
    <path d="M175,48 Q405,-6 633,46" fill="none" stroke="#DC2626" marker-end="url(#b5-sc-red)"/>
    <text x="405" y="40" fill="#DC2626" font-size="11">vế trái false → &amp;&amp; dừng ngay</text>
    <text x="6" y="160" text-anchor="start" fill="#0F172A" font-size="11">note = "Lương"</text>
    <rect x="100" y="138" width="150" height="44" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="175" y="156" fill="#1D4ED8" font-family="monospace">note != null</text>
    <text x="175" y="173" fill="#047857">→ true</text>
    <rect x="310" y="138" width="190" height="44" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="405" y="156" fill="#1D4ED8" font-family="monospace">note.length() &gt; 0</text>
    <text x="405" y="173" fill="#047857">→ true</text>
    <rect x="560" y="138" width="150" height="44" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="635" y="165" fill="#047857">Kết quả: true</text>
    <line x1="250" y1="160" x2="306" y2="160" stroke="#64748B" marker-end="url(#b5-sc-arrow)"/>
    <line x1="500" y1="160" x2="556" y2="160" stroke="#64748B" marker-end="url(#b5-sc-arrow)"/>
    <text x="278" y="152" fill="#64748B" font-size="11">&amp;&amp;</text>
  </g>
</svg>

```java
public class Compare {
    public static void main(String[] args) {
        long balance = 5_000_000;   // số dư (đồng)
        long amount = 2_000_000;    // số tiền muốn rút
        boolean isLocked = false;   // tài khoản có bị khoá không

        // Toán tử so sánh: kết quả luôn là boolean (true/false)
        System.out.println("amount == 2000000 ? " + (amount == 2_000_000));
        System.out.println("amount != balance ? " + (amount != balance));
        System.out.println("amount <= balance ? " + (amount <= balance));

        // Toán tử logic: && (và), || (hoặc), ! (phủ định)
        boolean canWithdraw = !isLocked && amount <= balance;
        System.out.println("Được rút? " + canWithdraw);

        boolean needOtp = amount > 10_000_000 || isLocked;
        System.out.println("Cần OTP? " + needOtp);

        // Short-circuit: vế phải của && chỉ chạy khi vế trái là true
        String note = null;
        if (note != null && note.length() > 0) {
            System.out.println("Ghi chú: " + note);
        } else {
            System.out.println("Không có ghi chú");
        }

        int months = 0;
        // months == 0 nên vế phải (phép chia) không bao giờ chạy
        if (months != 0 && balance / months > 1_000_000) {
            System.out.println("Mỗi tháng hơn 1 triệu");
        } else {
            System.out.println("Bỏ qua phép chia vì months = 0");
        }
    }
}
```

**Kết quả khi chạy:**

```text
amount == 2000000 ? true
amount != balance ? true
amount <= balance ? true
Được rút? true
Cần OTP? false
Không có ghi chú
Bỏ qua phép chia vì months = 0
```

**Giải thích từng bước:**

1. `amount == 2_000_000` hỏi "có bằng không?", trả về `true`. Lưu ý: so sánh dùng **hai** dấu `=`.
2. `!isLocked && amount <= balance`: `!isLocked` là `true` (thẻ không khoá), `amount <= balance` cũng
   `true`, nên `canWithdraw` là `true`. Các phép so sánh được tính trước `&&`, nên không cần ngoặc.
3. `amount > 10_000_000 || isLocked`: cả hai vế đều `false`, nên `needOtp` là `false`.
4. `note` đang là `null`, nghĩa là biến chưa trỏ tới chuỗi nào cả. `note != null` là `false`, nên `&&`
   dừng ngay, **không gọi** `note.length()`. Nhờ vậy chương trình không bị lỗi.
5. Tương tự, `months != 0` là `false`, nên phép chia `balance / months` không bao giờ chạy. Nếu chạy,
   chia số nguyên cho 0 sẽ làm chương trình dừng với lỗi `ArithmeticException`.

> 💡 Quy tắc dễ nhớ: đặt **phép kiểm tra an toàn ở vế trái** của `&&`. "Kiểm tra trước, dùng sau."

### ⚠️ Lỗi hay gặp

**Lỗi 1: đặt sai thứ tự hai vế.** Đảo vế thì short-circuit không cứu được bạn nữa.

```java
public class NullBug {
    public static void main(String[] args) {
        String note = null;
        // Sai thứ tự: gọi note.length() trước khi kiểm tra null
        if (note.length() > 0 && note != null) {
            System.out.println(note);
        }
    }
}
```

```text
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.length()" because "<local1>" is null
    at NullBug.main(NullBug.java:5)
```

Đây là một **ngoại lệ** (*exception*): lỗi xảy ra **lúc chương trình đang chạy**, làm chương trình dừng
lại (chặng sau sẽ học kỹ). `NullPointerException` nghĩa là bạn gọi phương thức trên một biến đang
`null`. Chữ `<local1>` là cách JVM gọi tên biến `note` khi file được biên dịch không kèm thông tin
debug; nếu biên dịch bằng `javac -g`, bạn sẽ thấy đúng tên `"note"` [4].
**Cách sửa:** đặt `note != null` lên trước: `if (note != null && note.length() > 0)`.

**Lỗi 2: dùng `=` thay cho `==`.** Một dấu `=` là **gán**, không phải so sánh.

```java
public class AssignBug {
    public static void main(String[] args) {
        int pin = 1234;
        if (pin = 1234) {
            System.out.println("Đúng PIN");
        }
    }
}
```

```text
AssignBug.java:4: error: incompatible types: int cannot be converted to boolean
        if (pin = 1234) {
                ^
1 error
error: compilation failed
```

`pin = 1234` gán giá trị và cho ra một `int`, mà `if` chỉ nhận `boolean`. May là Java bắt lỗi ngay khi
biên dịch. **Cách sửa:** `if (pin == 1234)`.

---

## 2. Rẽ nhánh với `if / else if / else`

**Ý tưởng nôm na.** Giao dịch viên duyệt yêu cầu rút tiền theo một danh sách kiểm tra, từ trên xuống.
Gặp ô nào "trượt" thì từ chối ngay với lý do cụ thể. Qua hết các ô thì mới chi tiền. Đó chính là chuỗi
`if / else if / else`: Java xét từng điều kiện **theo thứ tự**, chạy **nhánh đầu tiên** có điều kiện
đúng, rồi bỏ qua toàn bộ các nhánh còn lại [2].

```java
if (điều_kiện_1) {
    // chạy khi điều_kiện_1 đúng
} else if (điều_kiện_2) {
    // chạy khi điều_kiện_1 sai VÀ điều_kiện_2 đúng
} else {
    // chạy khi tất cả điều kiện ở trên đều sai
}
```

`else if` và `else` là không bắt buộc. Một `if` đứng một mình cũng hợp lệ.

<svg viewBox="0 0 700 470" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Flowchart duyệt rút tiền. Bắt đầu, hỏi amount nhỏ hơn hoặc bằng 0: đúng thì báo số tiền không hợp lệ. Sai thì hỏi amount lớn hơn balance: đúng thì báo số dư không đủ. Sai thì hỏi đã rút trong ngày cộng amount có vượt hạn mức: đúng thì báo vượt hạn mức ngày. Sai thì trừ tiền, rút thành công. Mọi nhánh đều đi tới Kết thúc giao dịch.">
  <defs>
    <marker id="b5-if-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/></marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="130" y="10" width="140" height="34" rx="17" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="200" y="32" fill="#0F172A">Bắt đầu</text>
    <polygon points="90,100 200,64 310,100 200,136" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="200" y="104" fill="#1D4ED8" font-family="monospace">amount &lt;= 0 ?</text>
    <polygon points="80,190 200,154 320,190 200,226" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="200" y="194" fill="#1D4ED8" font-family="monospace">amount &gt; balance ?</text>
    <polygon points="60,280 200,240 340,280 200,320" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="200" y="276" fill="#1D4ED8" font-family="monospace">withdrawnToday + amount</text>
    <text x="200" y="292" fill="#1D4ED8" font-family="monospace">&gt; dailyLimit ?</text>
    <rect x="105" y="350" width="190" height="44" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="200" y="368" fill="#047857" font-family="monospace">balance -= amount</text>
    <text x="200" y="385" fill="#047857">Rút thành công</text>
    <rect x="420" y="80" width="200" height="40" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="520" y="104" fill="#DC2626">Số tiền không hợp lệ</text>
    <rect x="420" y="170" width="200" height="40" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="520" y="194" fill="#DC2626">Số dư không đủ</text>
    <rect x="420" y="260" width="200" height="40" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="520" y="284" fill="#D97706">Vượt hạn mức ngày</text>
    <rect x="120" y="422" width="160" height="34" rx="17" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="200" y="444" fill="#0F172A">Kết thúc giao dịch</text>
    <line x1="200" y1="44" x2="200" y2="62" stroke="#64748B" marker-end="url(#b5-if-arrow)"/>
    <line x1="200" y1="136" x2="200" y2="152" stroke="#64748B" marker-end="url(#b5-if-arrow)"/>
    <line x1="200" y1="226" x2="200" y2="238" stroke="#64748B" marker-end="url(#b5-if-arrow)"/>
    <line x1="200" y1="320" x2="200" y2="348" stroke="#64748B" marker-end="url(#b5-if-arrow)"/>
    <line x1="200" y1="394" x2="200" y2="420" stroke="#64748B" marker-end="url(#b5-if-arrow)"/>
    <text x="214" y="148" fill="#64748B" font-size="11" text-anchor="start">sai</text>
    <text x="214" y="236" fill="#64748B" font-size="11" text-anchor="start">sai</text>
    <text x="214" y="338" fill="#64748B" font-size="11" text-anchor="start">sai</text>
    <line x1="310" y1="100" x2="416" y2="100" stroke="#64748B" marker-end="url(#b5-if-arrow)"/>
    <line x1="320" y1="190" x2="416" y2="190" stroke="#64748B" marker-end="url(#b5-if-arrow)"/>
    <line x1="340" y1="280" x2="416" y2="280" stroke="#64748B" marker-end="url(#b5-if-arrow)"/>
    <text x="365" y="93" fill="#64748B" font-size="11">đúng</text>
    <text x="368" y="183" fill="#64748B" font-size="11">đúng</text>
    <text x="378" y="273" fill="#64748B" font-size="11">đúng</text>
    <path d="M620,100 H650 V439 H284" fill="none" stroke="#64748B" marker-end="url(#b5-if-arrow)"/>
    <line x1="620" y1="190" x2="650" y2="190" stroke="#64748B"/>
    <line x1="620" y1="280" x2="650" y2="280" stroke="#64748B"/>
  </g>
</svg>

```java
public class Withdraw {
    public static void main(String[] args) {
        long balance = 3_000_000;       // số dư hiện tại (đồng)
        long withdrawnToday = 18_000_000; // đã rút trong ngày
        long dailyLimit = 20_000_000;   // hạn mức rút mỗi ngày
        long amount = 2_500_000;        // số tiền khách muốn rút

        if (amount <= 0) {
            System.out.println("Số tiền không hợp lệ");
        } else if (amount > balance) {
            System.out.println("Số dư không đủ");
        } else if (withdrawnToday + amount > dailyLimit) {
            long remaining = dailyLimit - withdrawnToday;
            System.out.println("Vượt hạn mức ngày. Hôm nay chỉ rút thêm được " + remaining + " đồng");
        } else {
            balance = balance - amount;
            System.out.println("Rút thành công. Số dư còn " + balance + " đồng");
        }
        System.out.println("Kết thúc giao dịch");
    }
}
```

**Kết quả khi chạy:**

```text
Vượt hạn mức ngày. Hôm nay chỉ rút thêm được 2000000 đồng
Kết thúc giao dịch
```

**Giải thích từng bước:**

1. `amount <= 0`? `2_500_000 <= 0` là sai, đi tiếp.
2. `amount > balance`? `2_500_000 > 3_000_000` là sai, số dư đủ, đi tiếp.
3. `withdrawnToday + amount > dailyLimit`? `18_000_000 + 2_500_000 = 20_500_000`, lớn hơn
   `20_000_000`, **đúng**. Java chạy nhánh này: tính `remaining` rồi in thông báo.
4. Vì đã chạy một nhánh, khối `else` bị bỏ qua. `balance` không bị trừ.
5. Dòng `Kết thúc giao dịch` nằm **ngoài** chuỗi `if`, nên luôn chạy.

Biến `remaining` được khai báo **bên trong** cặp `{ }` của nhánh, nên chỉ dùng được trong nhánh đó.
Đây là quy tắc **phạm vi** (*scope*) bạn đã gặp ở bài 3.

> 💡 Ở bài này, tiền được lưu bằng `long` (đơn vị đồng) cho đơn giản. Cách chuẩn cho tiền là
> `BigDecimal` (xem bài 4).

### ⚠️ Lỗi hay gặp

**Lỗi 1: bỏ dấu `{ }` rồi tưởng thụt lề là đủ.** Không có ngoặc nhọn, `if` chỉ "quản" **đúng một lệnh**
ngay sau nó. Thụt lề chỉ để người đọc nhìn, Java không quan tâm.

```java
public class ElseBug {
    public static void main(String[] args) {
        long balance = 1_000_000;
        long amount = 5_000_000;
        // Thiếu ngoặc nhọn: chỉ dòng ngay sau if thuộc về if
        if (amount > balance)
            System.out.println("Số dư không đủ");
            System.out.println("Giao dịch bị huỷ");
        System.out.println("---");
        amount = 500_000;
        if (amount > balance)
            System.out.println("Số dư không đủ");
            System.out.println("Giao dịch bị huỷ");
    }
}
```

```text
Số dư không đủ
Giao dịch bị huỷ
---
Giao dịch bị huỷ
```

Lần thứ hai `amount` chỉ 500 nghìn, đủ tiền, nhưng vẫn in `Giao dịch bị huỷ`. **Cách sửa:** luôn dùng
`{ }` cho thân `if`, kể cả khi chỉ có một dòng.

**Lỗi 2: điều kiện rộng đứng trước điều kiện hẹp.** Java dừng ở nhánh đúng **đầu tiên**.

```java
public class FeeOrder {
    public static void main(String[] args) {
        long amount = 50_000_000;
        long fee;
        // Sai: điều kiện rộng (> 1 triệu) đứng trước, nhánh > 10 triệu không bao giờ tới
        if (amount > 1_000_000) {
            fee = 5_000;
        } else if (amount > 10_000_000) {
            fee = 10_000;
        } else {
            fee = 0;
        }
        System.out.println("Phí: " + fee);
    }
}
```

```text
Phí: 5000
```

50 triệu lớn hơn cả 1 triệu lẫn 10 triệu, nhưng nhánh `> 1_000_000` đứng trước nên "thắng". Nhánh
`> 10_000_000` không bao giờ được chạy. **Cách sửa:** xếp điều kiện từ hẹp đến rộng: kiểm tra
`> 10_000_000` trước, rồi mới `> 1_000_000`.

---

## 3. `switch` và toán tử ba ngôi `?:`

**Ý tưởng nôm na.** Menu ATM có các phím 1, 2, 3. Bạn bấm phím nào thì máy nhảy thẳng tới chức năng đó,
không cần hỏi lần lượt "có phải phím 1 không? có phải phím 2 không?". `switch` làm đúng việc này: so
**một giá trị** với nhiều **nhãn** (`case`) rồi nhảy tới nhãn khớp [5].

`switch` dùng được với `int`, `char`, `String` (từ Java 7) và một số kiểu khác. Không dùng được với
`long`, `double`, `boolean` [5].

### 3.1. `switch` cổ điển với `case ... :` và `break`

```java
public class SwitchClassic {
    public static void main(String[] args) {
        int option = 2;  // lựa chọn trên menu ATM

        switch (option) {
            case 1:
                System.out.println("Xem số dư");
                break;              // thoát khỏi switch
            case 2:
                System.out.println("Rút tiền");
                break;
            case 3:
                System.out.println("Chuyển khoản");
                break;
            default:                // không khớp case nào
                System.out.println("Lựa chọn không hợp lệ");
        }
    }
}
```

**Kết quả khi chạy:**

```text
Rút tiền
```

**Giải thích từng bước:**

1. Java tính `option`, được `2`, rồi nhảy tới `case 2:`.
2. Chạy `System.out.println("Rút tiền")`.
3. Gặp `break`: thoát khỏi `switch` ngay, xuống dòng sau dấu `}` của switch.
4. `default` là nhánh "không khớp case nào", giống `else` của `if`.

<svg viewBox="0 0 720 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="So sánh switch có break và quên break, với option bằng 2. Bên trái: Java nhảy vào case 2, chạy Rút tiền, gặp break thì ra khỏi switch. Bên phải: không có break, Java nhảy vào case 2 rồi rơi xuống chạy tiếp case 3 và default, in ra cả ba dòng.">
  <defs>
    <marker id="b5-sw-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/></marker>
    <marker id="b5-sw-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/></marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <text x="190" y="22" fill="#047857" font-size="13">Có break</text>
    <text x="560" y="22" fill="#DC2626" font-size="13">Quên break (fall-through)</text>
    <line x1="360" y1="10" x2="360" y2="290" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <rect x="12" y="116" width="84" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="54" y="135" fill="#0F172A" font-family="monospace">option=2</text>
    <rect x="110" y="70" width="190" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="205" y="89" fill="#64748B">case 1: Xem số dư</text>
    <rect x="110" y="116" width="190" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="205" y="135" fill="#1D4ED8">case 2: Rút tiền; break;</text>
    <rect x="110" y="162" width="190" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="205" y="181" fill="#64748B">case 3: Chuyển khoản</text>
    <rect x="110" y="208" width="190" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="205" y="227" fill="#64748B">default: Không hợp lệ</text>
    <rect x="110" y="256" width="190" height="30" rx="15" fill="#ECFDF5" stroke="#10B981"/>
    <text x="205" y="275" fill="#047857">Ra khỏi switch</text>
    <line x1="96" y1="131" x2="108" y2="131" stroke="#64748B" marker-end="url(#b5-sw-arrow)"/>
    <path d="M300,131 H330 V271 H304" fill="none" stroke="#10B981" marker-end="url(#b5-sw-arrow)"/>
    <text x="336" y="200" fill="#047857" font-size="11" text-anchor="start" transform="rotate(90 336 200)">break</text>
    <rect x="382" y="116" width="84" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="424" y="135" fill="#0F172A" font-family="monospace">option=2</text>
    <rect x="480" y="70" width="190" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="575" y="89" fill="#64748B">case 1: Xem số dư</text>
    <rect x="480" y="116" width="190" height="30" rx="6" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="575" y="135" fill="#DC2626">case 2: Rút tiền</text>
    <rect x="480" y="162" width="190" height="30" rx="6" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="575" y="181" fill="#DC2626">case 3: Chuyển khoản</text>
    <rect x="480" y="208" width="190" height="30" rx="6" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="575" y="227" fill="#DC2626">default: Không hợp lệ</text>
    <rect x="480" y="256" width="190" height="30" rx="15" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="575" y="275" fill="#64748B">Ra khỏi switch</text>
    <line x1="466" y1="131" x2="478" y2="131" stroke="#64748B" marker-end="url(#b5-sw-arrow)"/>
    <line x1="575" y1="146" x2="575" y2="160" stroke="#DC2626" marker-end="url(#b5-sw-red)"/>
    <line x1="575" y1="192" x2="575" y2="206" stroke="#DC2626" marker-end="url(#b5-sw-red)"/>
    <line x1="575" y1="238" x2="575" y2="254" stroke="#DC2626" marker-end="url(#b5-sw-red)"/>
    <text x="560" y="46" fill="#64748B" font-size="11">khớp case 2, rồi chạy tiếp mọi case bên dưới</text>
    <text x="190" y="46" fill="#64748B" font-size="11">khớp case 2, chạy xong thì thoát</text>
  </g>
</svg>

### ⚠️ Lỗi hay gặp: quên `break` (fall-through)

Với kiểu `case ... :`, `break` **không tự có**. Quên nó thì Java chạy tiếp xuống các case bên dưới, bất
kể nhãn có khớp hay không. Hiện tượng này gọi là **rơi xuống** (*fall-through*) [5].

```java
public class FallThrough {
    public static void main(String[] args) {
        int option = 2;
        switch (option) {
            case 1:
                System.out.println("Xem số dư");
            case 2:
                System.out.println("Rút tiền");     // quên break
            case 3:
                System.out.println("Chuyển khoản"); // quên break
            default:
                System.out.println("Lựa chọn không hợp lệ");
        }
    }
}
```

```text
Rút tiền
Chuyển khoản
Lựa chọn không hợp lệ
```

Khách chỉ chọn "Rút tiền", nhưng máy làm cả ba việc. Java biên dịch bình thường, không báo lỗi gì.
**Cách sửa:** thêm `break;` cuối mỗi case, hoặc tốt hơn là dùng switch kiểu `->` ở dưới.

### 3.2. Switch expression với `->` và `yield` (Java 14+)

Từ Java 14, `switch` có cú pháp mới với mũi tên `->` [6]:

- Mỗi nhánh `->` chỉ chạy đúng phần của mình, **không bao giờ rơi xuống**. Không cần `break`.
- Một `case` có thể gom nhiều nhãn: `case "LOAN", "CREDIT" ->`.
- `switch` có thể là một **biểu thức** (*expression*): nó **trả về một giá trị** để gán cho biến.
- Khi một nhánh cần nhiều lệnh, bọc trong `{ }` và dùng `yield giá_trị;` để trả kết quả.

**Toán tử ba ngôi** (*ternary operator*) `điều_kiện ? A : B` là phiên bản "mini" của `if/else`: điều
kiện đúng thì cho ra `A`, sai thì cho ra `B` [2]. Hợp khi chỉ cần chọn giữa hai giá trị.

```java
public class SwitchExpr {
    public static void main(String[] args) {
        String accountType = "SAVING";  // loại tài khoản
        int termMonths = 12;            // kỳ hạn gửi (tháng)

        // switch expression: trả về một giá trị, không cần break
        String label = switch (accountType) {
            case "PAYMENT" -> "Tài khoản thanh toán";
            case "SAVING" -> "Tài khoản tiết kiệm";
            case "LOAN", "CREDIT" -> "Tài khoản vay";  // nhiều nhãn một case
            default -> "Không rõ";
        };
        System.out.println(label);

        // Khi một nhánh cần nhiều lệnh: dùng khối { } và yield
        double rate = switch (termMonths) {
            case 1, 3 -> 3.0;
            case 6 -> 4.2;
            case 12 -> {
                System.out.println("Kỳ hạn 12 tháng có ưu đãi");
                yield 5.0;  // yield = "trả về giá trị này cho switch"
            }
            default -> 0.5;
        };
        System.out.println("Lãi suất: " + rate + "%/năm");

        // Toán tử ba ngôi: điều_kiện ? giá_trị_nếu_đúng : giá_trị_nếu_sai
        long balance = 0;
        String status = balance > 0 ? "Có tiền" : "Tài khoản trống";
        System.out.println(status);
    }
}
```

**Kết quả khi chạy:**

```text
Tài khoản tiết kiệm
Kỳ hạn 12 tháng có ưu đãi
Lãi suất: 5.0%/năm
Tài khoản trống
```

**Giải thích từng bước:**

1. `accountType` là `"SAVING"`, khớp nhánh `case "SAVING"`. Giá trị `"Tài khoản tiết kiệm"` được gán cho
   `label`. Dấu `;` sau `}` là bắt buộc, vì cả `switch` là vế phải của một lệnh gán.
2. `termMonths` là `12`, khớp nhánh có khối `{ }`. Java in dòng ưu đãi, rồi `yield 5.0` trả `5.0` cho
   `rate`.
3. `balance > 0` là sai, nên toán tử ba ngôi chọn giá trị sau dấu `:`, tức `"Tài khoản trống"`.

### ⚠️ Lỗi hay gặp: switch expression thiếu `default`

Một switch expression **phải trả về giá trị cho mọi trường hợp có thể** [6]. Với `int`, các `case` không
bao giờ phủ hết, nên bạn cần `default`.

```java
public class NoDefault {
    public static void main(String[] args) {
        int option = 2;
        String action = switch (option) {
            case 1 -> "Xem số dư";
            case 2 -> "Rút tiền";
        };
        System.out.println(action);
    }
}
```

```text
NoDefault.java:4: error: the switch expression does not cover all possible input values
        String action = switch (option) {
                        ^
1 error
error: compilation failed
```

**Cách sửa:** thêm `default -> "Không rõ";`.

---

## 4. Vòng lặp `while` và `do-while`

**Ý tưởng nôm na.** Bạn muốn tiết kiệm 10 triệu, mỗi tháng gửi 3 triệu. Cuối mỗi tháng bạn tự hỏi: "Đủ
chưa?". Chưa đủ thì gửi thêm tháng nữa. Đủ rồi thì dừng. Việc "hỏi, làm, rồi hỏi lại" chính là
**vòng lặp** (*loop*). Mỗi lượt chạy thân vòng lặp gọi là một **lần lặp** (*iteration*).

- `while (điều_kiện) { ... }`: **hỏi trước**. Điều kiện sai ngay từ đầu thì thân không chạy lần nào.
- `do { ... } while (điều_kiện);`: **làm trước, hỏi sau**. Thân **luôn chạy ít nhất một lần** [2].

<svg viewBox="0 0 720 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="So sánh while và do-while. Bên trái, while kiểm tra điều kiện saved nhỏ hơn goal trước: đúng thì chạy thân vòng lặp rồi quay lại kiểm tra, sai thì ra khỏi vòng lặp, nên thân có thể không chạy lần nào. Bên phải, do-while chạy thân trước rồi mới kiểm tra điều kiện: đúng thì quay lại chạy thân, sai thì ra khỏi vòng lặp, nên thân luôn chạy ít nhất một lần.">
  <defs>
    <marker id="b5-wh-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/></marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <text x="170" y="20" fill="#1D4ED8" font-size="13">while: kiểm tra TRƯỚC</text>
    <text x="540" y="20" fill="#047857" font-size="13">do-while: chạy TRƯỚC, kiểm tra SAU</text>
    <line x1="355" y1="8" x2="355" y2="272" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <line x1="170" y1="30" x2="170" y2="56" stroke="#64748B" marker-end="url(#b5-wh-arrow)"/>
    <polygon points="70,90 170,58 270,90 170,122" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="170" y="94" fill="#1D4ED8" font-family="monospace">saved &lt; goal ?</text>
    <rect x="95" y="150" width="150" height="44" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="170" y="168" fill="#047857" font-family="monospace">month++;</text>
    <text x="170" y="185" fill="#047857" font-family="monospace">saved += ...;</text>
    <rect x="105" y="230" width="130" height="34" rx="17" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="170" y="251" fill="#0F172A">Ra khỏi vòng lặp</text>
    <line x1="170" y1="122" x2="170" y2="148" stroke="#64748B" marker-end="url(#b5-wh-arrow)"/>
    <text x="180" y="140" fill="#64748B" font-size="11" text-anchor="start">đúng</text>
    <path d="M95,172 H40 V90 H68" fill="none" stroke="#64748B" marker-end="url(#b5-wh-arrow)"/>
    <text x="34" y="135" fill="#64748B" font-size="11" text-anchor="end" transform="rotate(-90 34 135)">lặp lại</text>
    <path d="M270,90 H310 V247 H237" fill="none" stroke="#64748B" marker-end="url(#b5-wh-arrow)"/>
    <text x="290" y="84" fill="#64748B" font-size="11">sai</text>
    <line x1="540" y1="30" x2="540" y2="44" stroke="#64748B" marker-end="url(#b5-wh-arrow)"/>
    <rect x="445" y="46" width="190" height="44" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="540" y="64" fill="#047857" font-family="monospace">extraMonths++;</text>
    <text x="540" y="81" fill="#047857" font-family="monospace">alreadySaved += ...;</text>
    <polygon points="430,150 540,118 650,150 540,182" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="540" y="154" fill="#1D4ED8" font-family="monospace">alreadySaved &lt; goal ?</text>
    <rect x="475" y="230" width="130" height="34" rx="17" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="540" y="251" fill="#0F172A">Ra khỏi vòng lặp</text>
    <line x1="540" y1="90" x2="540" y2="116" stroke="#64748B" marker-end="url(#b5-wh-arrow)"/>
    <path d="M430,150 H400 V68 H443" fill="none" stroke="#64748B" marker-end="url(#b5-wh-arrow)"/>
    <text x="394" y="110" fill="#64748B" font-size="11" text-anchor="end" transform="rotate(-90 394 110)">đúng</text>
    <line x1="540" y1="182" x2="540" y2="228" stroke="#64748B" marker-end="url(#b5-wh-arrow)"/>
    <text x="550" y="210" fill="#64748B" font-size="11" text-anchor="start">sai</text>
  </g>
</svg>

```java
public class SavingsGoal {
    public static void main(String[] args) {
        long goal = 10_000_000;      // mục tiêu: 10 triệu
        long monthlyDeposit = 3_000_000; // mỗi tháng gửi thêm 3 triệu
        long saved = 0;              // số tiền đã có
        int month = 0;               // đếm số tháng

        // while: kiểm tra điều kiện TRƯỚC, đúng thì mới chạy thân vòng lặp
        while (saved < goal) {
            month++;                  // sang tháng mới
            saved += monthlyDeposit;  // gửi thêm tiền
            System.out.println("Tháng " + month + ": " + saved + " đồng");
        }
        System.out.println("Cần " + month + " tháng để đạt mục tiêu");

        // do-while: chạy thân TRƯỚC, kiểm tra điều kiện SAU (luôn chạy ít nhất 1 lần)
        long alreadySaved = 12_000_000;
        int extraMonths = 0;
        do {
            extraMonths++;
            alreadySaved += monthlyDeposit;
        } while (alreadySaved < goal);
        System.out.println("do-while vẫn chạy " + extraMonths + " lần dù đã đủ tiền");
    }
}
```

**Kết quả khi chạy:**

```text
Tháng 1: 3000000 đồng
Tháng 2: 6000000 đồng
Tháng 3: 9000000 đồng
Tháng 4: 12000000 đồng
Cần 4 tháng để đạt mục tiêu
do-while vẫn chạy 1 lần dù đã đủ tiền
```

**Giải thích từng bước:**

1. Lúc đầu `saved = 0`. `0 < 10_000_000` đúng, vào thân: `month` thành 1, `saved` thành 3 triệu.
2. Quay lại hỏi: 3 triệu < 10 triệu, đúng. Lặp tiếp: tháng 2 (6 triệu), tháng 3 (9 triệu).
3. Tháng 4: `saved` thành 12 triệu. Quay lại hỏi: `12_000_000 < 10_000_000` sai. Thoát vòng lặp.
4. Phần `do-while`: `alreadySaved` đã là 12 triệu, vượt mục tiêu từ trước. Nhưng `do-while` chạy thân
   trước rồi mới hỏi, nên `extraMonths` vẫn thành 1.

Khi nào dùng cái nào? Dùng `while` khi có thể không cần làm lần nào. Dùng `do-while` khi chắc chắn phải
làm ít nhất một lần, ví dụ: in menu rồi mới hỏi người dùng có muốn tiếp tục không.

### Vòng lặp vô hạn có chủ đích: `while (true)` + `break`

Đôi khi bạn chưa biết trước lúc nào dừng. Khi đó có thể viết `while (true)` và dùng `break` để thoát
từ bên trong.

```java
public class WhileTrue {
    public static void main(String[] args) {
        int attempts = 0;
        // Vòng lặp vô hạn có chủ đích: thoát bằng break
        while (true) {
            attempts++;
            System.out.println("Nhập PIN lần " + attempts);
            if (attempts == 3) {
                System.out.println("Sai quá 3 lần, khoá thẻ");
                break;  // thoát khỏi vòng lặp ngay lập tức
            }
        }
    }
}
```

```text
Nhập PIN lần 1
Nhập PIN lần 2
Nhập PIN lần 3
Sai quá 3 lần, khoá thẻ
```

`break` thoát ngay khỏi vòng lặp gần nhất chứa nó (phần 5 sẽ nói kỹ hơn).

### ⚠️ Lỗi hay gặp

**Lỗi 1: vòng lặp vô hạn ngoài ý muốn.** Bạn quên cập nhật biến trong điều kiện.

```java
public class Infinite {
    public static void main(String[] args) {
        long goal = 10_000_000;
        long saved = 0;
        int month = 0;
        while (saved < goal) {
            month++;
            // quên cộng tiền: saved mãi là 0, điều kiện mãi đúng
            System.out.println("Tháng " + month + ": " + saved);
        }
    }
}
```

Kết quả chạy (in mãi không dừng, đây là 3 dòng đầu, phải bấm **Ctrl + C** để dừng):

```text
Tháng 1: 0
Tháng 2: 0
Tháng 3: 0
```

**Cách sửa:** mỗi lần lặp phải có ít nhất một lệnh đưa điều kiện tiến dần về `false`. Ở đây là
`saved += monthlyDeposit;`.

**Lỗi 2: dấu `;` thừa sau `while`.** Viết `while (saved < goal);` thì thân vòng lặp là một **lệnh rỗng**.
Khối `{ }` bên dưới không còn thuộc về `while`. Chương trình treo im lặng, không in gì. Mình đã chạy thử
và phải dừng nó sau 3 giây. **Cách sửa:** xoá dấu `;` ngay sau `)`. Lỗi tương tự cũng xảy ra với
`if (...);`.

---

## 5. Vòng lặp `for`, for-each, `break` và `continue`

**Ý tưởng nôm na.** `while` hợp với "lặp tới khi đủ". Còn khi bạn **biết trước số lần**, ví dụ "tính lãi
cho 3 năm", thì `for` gọn hơn: gom biến đếm, điều kiện và bước tăng vào **một dòng**. Giống sổ tiết
kiệm có sẵn 3 dòng, mỗi năm điền một dòng.

`for (khởi_tạo; điều_kiện; cập_nhật) { thân }` chạy theo thứ tự [2]:

1. **Khởi tạo** chạy đúng một lần.
2. Kiểm tra **điều kiện**. Sai thì thoát.
3. Chạy **thân**.
4. Chạy **cập nhật**, rồi quay lại bước 2.

Hai lệnh điều khiển dùng trong thân vòng lặp:

- `break`: thoát **hẳn** vòng lặp.
- `continue`: bỏ phần còn lại của **lần lặp hiện tại**, nhảy sang lần lặp kế tiếp (với `for` là nhảy tới
  bước cập nhật).

<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bốn phần của vòng lặp for (int year = 1; year &lt;= 3; year++). Bước 1 khởi tạo year = 1, chỉ chạy một lần. Bước 2 kiểm tra year &lt;= 3: sai thì thoát vòng lặp. Đúng thì chạy bước 3 là thân vòng lặp, rồi bước 4 cập nhật year++, rồi quay lại bước 2. Lệnh break trong thân nhảy thẳng ra ngoài vòng lặp. Lệnh continue bỏ phần còn lại của thân và nhảy tới bước cập nhật.">
  <defs>
    <marker id="b5-for-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/></marker>
    <marker id="b5-for-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/></marker>
    <marker id="b5-for-yellow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#D97706"/></marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <text x="360" y="22" fill="#0F172A" font-family="monospace" font-size="13">for (<tspan fill="#64748B">①</tspan>int year = 1; <tspan fill="#1D4ED8">②</tspan>year &lt;= 3; <tspan fill="#D97706">④</tspan>year++) { <tspan fill="#047857">③</tspan>thân }</text>
    <rect x="20" y="96" width="140" height="44" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="90" y="114" fill="#0F172A">① khởi tạo (1 lần)</text>
    <text x="90" y="131" fill="#0F172A" font-family="monospace">int year = 1</text>
    <polygon points="205,118 300,84 395,118 300,152" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="300" y="114" fill="#1D4ED8">② điều kiện</text>
    <text x="300" y="131" fill="#1D4ED8" font-family="monospace">year &lt;= 3 ?</text>
    <rect x="440" y="96" width="130" height="44" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="505" y="114" fill="#047857">③ thân vòng lặp</text>
    <text x="505" y="131" fill="#047857" font-family="monospace">println(...)</text>
    <rect x="440" y="190" width="130" height="44" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="505" y="208" fill="#D97706">④ cập nhật</text>
    <text x="505" y="225" fill="#D97706" font-family="monospace">year++</text>
    <rect x="600" y="40" width="110" height="34" rx="17" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="655" y="61" fill="#0F172A">Thoát vòng lặp</text>
    <line x1="160" y1="118" x2="203" y2="118" stroke="#64748B" marker-end="url(#b5-for-arrow)"/>
    <line x1="395" y1="118" x2="438" y2="118" stroke="#64748B" marker-end="url(#b5-for-arrow)"/>
    <text x="416" y="110" fill="#64748B" font-size="11">đúng</text>
    <line x1="505" y1="140" x2="505" y2="188" stroke="#64748B" marker-end="url(#b5-for-arrow)"/>
    <path d="M440,212 H300 V154" fill="none" stroke="#64748B" marker-end="url(#b5-for-arrow)"/>
    <text x="370" y="206" fill="#64748B" font-size="11">quay lại ②</text>
    <path d="M300,84 V57 H598" fill="none" stroke="#64748B" marker-end="url(#b5-for-arrow)"/>
    <text x="312" y="74" fill="#64748B" font-size="11" text-anchor="start">sai</text>
    <path d="M570,104 H655 V76" fill="none" stroke="#DC2626" stroke-dasharray="5 3" marker-end="url(#b5-for-red)"/>
    <text x="662" y="100" fill="#DC2626" font-size="11" text-anchor="start">break</text>
    <path d="M570,130 Q640,165 572,205" fill="none" stroke="#D97706" stroke-dasharray="5 3" marker-end="url(#b5-for-yellow)"/>
    <text x="615" y="172" fill="#D97706" font-size="11" text-anchor="start">continue</text>
  </g>
</svg>

Ngoài ra còn **for-each** (*enhanced for*): `for (kiểu phần_tử : mảng)`, đọc là "với mỗi phần tử trong
mảng". Ví dụ dưới dùng một **mảng** (*array*), tức một dãy giá trị cùng kiểu đặt cạnh nhau. Phần 6 sẽ
học kỹ về mảng, giờ bạn chỉ cần hiểu `{500_000, -200_000, ...}` là một danh sách 6 giao dịch.

```java
public class ForLoop {
    public static void main(String[] args) {
        long principal = 100_000_000;  // gửi 100 triệu
        // for (khởi tạo; điều kiện; cập nhật)
        for (int year = 1; year <= 3; year++) {
            principal = principal + principal * 6 / 100;  // lãi 6%/năm, nhập gốc
            System.out.println("Năm " + year + ": " + principal);
        }

        // for-each: duyệt từng phần tử, không cần chỉ số
        long[] transactions = {500_000, -200_000, 0, 1_500_000, -50_000_000, 300_000};
        long total = 0;
        for (long t : transactions) {
            if (t == 0) {
                continue;  // bỏ qua giao dịch 0 đồng, sang phần tử kế tiếp
            }
            if (t < -10_000_000) {
                System.out.println("Phát hiện giao dịch bất thường: " + t);
                break;     // dừng hẳn vòng lặp
            }
            total += t;
            System.out.println("Cộng " + t + " -> " + total);
        }
        System.out.println("Tổng trước khi dừng: " + total);
    }
}
```

**Kết quả khi chạy:**

```text
Năm 1: 106000000
Năm 2: 112360000
Năm 3: 119101600
Cộng 500000 -> 500000
Cộng -200000 -> 300000
Cộng 1500000 -> 1800000
Phát hiện giao dịch bất thường: -50000000
Tổng trước khi dừng: 1800000
```

**Giải thích từng bước:**

1. `int year = 1` chạy một lần. `1 <= 3` đúng, tính lãi, in `Năm 1`. `year++` thành 2. Lặp tới khi
   `year` thành 4 thì `4 <= 3` sai, thoát. Phép `principal * 6 / 100` là phép chia số nguyên, nên phần lẻ
   (nếu có) bị bỏ đi.
2. For-each lấy lần lượt từng phần tử của `transactions` gán vào `t`.
3. `t = 500_000` và `t = -200_000`: không rơi vào `if` nào, cộng vào `total`.
4. `t = 0`: gặp `continue`, bỏ qua phần dưới, sang phần tử tiếp. Không có dòng `Cộng 0`.
5. `t = 1_500_000`: cộng bình thường.
6. `t = -50_000_000`: nhỏ hơn `-10_000_000`, in cảnh báo rồi `break`. Phần tử cuối `300_000` **không
   bao giờ được xét**.

### ⚠️ Lỗi hay gặp

**Lỗi 1: lệch một** (*off-by-one*). Đây là lỗi kinh điển: vòng lặp chạy thừa hoặc thiếu đúng một lần, do
nhầm `<` với `<=`, hoặc bắt đầu từ 0 thay vì 1.

```java
public class OffByOne {
    public static void main(String[] args) {
        int installments = 12;  // trả góp 12 kỳ
        int count = 0;
        for (int i = 1; i < installments; i++) {  // sai: < thay vì <=
            count++;
        }
        System.out.println("Đã in " + count + " kỳ");
    }
}
```

```text
Đã in 11 kỳ
```

Đếm từ 1 thì dùng `i <= 12`. Đếm từ 0 thì dùng `i < 12`. Cả hai đều chạy 12 lần. Mẹo kiểm tra: thử
"chạy bằng tay" với số nhỏ, ví dụ chỉ 2 kỳ.

**Lỗi 2: dùng biến đếm bên ngoài vòng lặp.** Biến khai báo trong `for (...)` chỉ sống bên trong vòng
lặp.

```java
public class LoopScope {
    public static void main(String[] args) {
        for (int year = 1; year <= 3; year++) {
            System.out.println("Năm " + year);
        }
        System.out.println("Vòng lặp dừng ở năm " + year);
    }
}
```

```text
LoopScope.java:6: error: cannot find symbol
        System.out.println("Vòng lặp dừng ở năm " + year);
                                                    ^
  symbol:   variable year
  location: class LoopScope
1 error
error: compilation failed
```

**Cách sửa:** nếu cần giá trị sau vòng lặp, khai báo biến **trước** `for`: `int year = 1; for (; year <= 3; year++)`.

---

## 6. Mảng: một dãy ngăn kéo đánh số

**Ý tưởng nôm na.** Một tủ hồ sơ có 5 ngăn kéo, dán nhãn số 0, 1, 2, 3, 4. Mỗi ngăn chứa một giao
dịch. Số ngăn **cố định** từ lúc đóng tủ. Trong Java, tủ đó là **mảng** (*array*): một dãy ô liền
nhau, **cùng kiểu**, có **độ dài cố định** khi tạo [7]. Số thứ tự của mỗi ô gọi là **chỉ số** (*index*),
luôn bắt đầu từ **0** và kết thúc ở **độ dài - 1** [8].

Ba cách quen thuộc để có một mảng:

```java
long[] history;                          // 1. khai báo: biến history sẽ trỏ tới một mảng long
history = new long[5];                   // 2. tạo: xin bộ nhớ cho 5 ô (new = tạo mới)
long[] fees = {3_300, 5_500, 11_000};    // 3. khai báo + tạo + điền giá trị cùng lúc
```

Từ khoá `new` nghĩa là "tạo mới trong bộ nhớ" (bài OOP sẽ gặp lại). Mảng tạo bằng `new` mà chưa gán gì
thì mỗi ô tự có **giá trị mặc định** [9]:

| Kiểu phần tử | Giá trị mặc định |
|--------------|------------------|
| `int`, `long`, `short`, `byte` | `0` |
| `double`, `float` | `0.0` |
| `boolean` | `false` |
| `char` | ký tự mã số 0 (`'\u0000'`) |
| `String` và các kiểu tham chiếu khác | `null` |

```java
public class Defaults {
    public static void main(String[] args) {
        int[] counts = new int[2];
        double[] rates = new double[2];
        boolean[] flags = new boolean[2];
        char[] codes = new char[2];
        String[] names = new String[2];
        System.out.println(counts[0] + " | " + rates[0] + " | " + flags[0] + " | " + (int) codes[0] + " | " + names[0]);
    }
}
```

```text
0 | 0.0 | false | 0 | null
```

<svg viewBox="0 0 740 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mảng history kiểu long[] gồm 5 ô liền nhau, chỉ số từ 0 đến 4, lần lượt chứa 2000000, -500000, -150000, 3000000, -1200000. history.length bằng 5. Ô chỉ số 5 nằm ngoài mảng, truy cập sẽ gây ArrayIndexOutOfBoundsException.">
  <defs>
    <marker id="b5-arr-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/></marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="20" y="78" width="110" height="44" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="75" y="96" fill="#0F172A" font-family="monospace">history</text>
    <text x="75" y="113" fill="#64748B" font-size="11">kiểu long[]</text>
    <line x1="130" y1="100" x2="186" y2="100" stroke="#64748B" marker-end="url(#b5-arr-arrow)"/>
    <path d="M190,62 V52 H630 V62" fill="none" stroke="#2563EB"/>
    <text x="410" y="44" fill="#1D4ED8" font-family="monospace">history.length = 5</text>
    <rect x="190" y="78" width="88" height="44" fill="#EFF6FF" stroke="#2563EB"/>
    <rect x="278" y="78" width="88" height="44" fill="#EFF6FF" stroke="#2563EB"/>
    <rect x="366" y="78" width="88" height="44" fill="#EFF6FF" stroke="#2563EB"/>
    <rect x="454" y="78" width="88" height="44" fill="#EFF6FF" stroke="#2563EB"/>
    <rect x="542" y="78" width="88" height="44" fill="#EFF6FF" stroke="#2563EB"/>
    <rect x="636" y="78" width="88" height="44" fill="#FEF2F2" stroke="#DC2626" stroke-dasharray="4 3"/>
    <g font-family="monospace" fill="#0F172A">
      <text x="234" y="104">2000000</text>
      <text x="322" y="104">-500000</text>
      <text x="410" y="104">-150000</text>
      <text x="498" y="104">3000000</text>
      <text x="586" y="104">-1200000</text>
      <text x="680" y="104" fill="#DC2626">???</text>
    </g>
    <g font-family="monospace" fill="#1D4ED8">
      <text x="234" y="142">[0]</text>
      <text x="322" y="142">[1]</text>
      <text x="410" y="142">[2]</text>
      <text x="498" y="142">[3]</text>
      <text x="586" y="142">[4]</text>
      <text x="680" y="142" fill="#DC2626">[5]</text>
    </g>
    <text x="410" y="170" fill="#64748B">chỉ số (index) bắt đầu từ 0, ô cuối là length - 1 = 4</text>
    <text x="680" y="170" fill="#DC2626" font-size="11">ngoài mảng</text>
    <text x="680" y="186" fill="#DC2626" font-size="11">→ Exception</text>
  </g>
</svg>

### Duyệt mảng, tính tổng và giá trị lớn nhất

```java
public class ArrayBasics {
    public static void main(String[] args) {
        // Cách 1: khai báo + tạo mảng 5 phần tử, Java tự điền giá trị mặc định
        long[] history = new long[5];
        System.out.println("Phần tử đầu (mặc định): " + history[0]);

        // Gán giá trị qua chỉ số (index) bắt đầu từ 0
        history[0] = 2_000_000;   // nạp tiền
        history[1] = -500_000;    // rút
        history[2] = -150_000;    // thanh toán hoá đơn
        history[3] = 3_000_000;   // nhận lương
        history[4] = -1_200_000;  // chuyển khoản

        // Cách 2: khởi tạo trực tiếp bằng { }
        String[] types = {"NẠP", "RÚT", "HOÁ ĐƠN", "LƯƠNG", "CHUYỂN"};

        System.out.println("Số giao dịch: " + history.length);  // length không có ()

        long sum = 0;
        long max = history[0];  // giả sử phần tử đầu là lớn nhất
        for (int i = 0; i < history.length; i++) {
            System.out.println(i + ". " + types[i] + ": " + history[i]);
            sum += history[i];
            if (history[i] > max) {
                max = history[i];
            }
        }
        System.out.println("Tổng biến động: " + sum);
        System.out.println("Giao dịch lớn nhất: " + max);
    }
}
```

**Kết quả khi chạy:**

```text
Phần tử đầu (mặc định): 0
Số giao dịch: 5
0. NẠP: 2000000
1. RÚT: -500000
2. HOÁ ĐƠN: -150000
3. LƯƠNG: 3000000
4. CHUYỂN: -1200000
Tổng biến động: 3150000
Giao dịch lớn nhất: 3000000
```

**Giải thích từng bước:**

1. `new long[5]` tạo 5 ô, ô nào cũng là `0`, nên `history[0]` in ra `0`.
2. `history[0] = 2_000_000` ghi vào ô số 0. Tương tự cho ô 1 đến 4.
3. `types` được tạo bằng `{ }`, Java tự đếm được 5 phần tử.
4. `history.length` là **độ dài** mảng, bằng `5`. Chú ý: `length` của mảng **không có** `()`, khác với
   `length()` của `String` ở bài 4 [8].
5. Vòng `for` cho `i` chạy từ `0` đến `4` (`i < history.length`), đúng bằng các chỉ số hợp lệ.
6. Tìm max: giả sử ô đầu lớn nhất, gặp ô nào lớn hơn thì cập nhật `max`. Cuối cùng `max` là `3_000_000`.

> 💡 Cần chỉ số (in số thứ tự, sửa ô) thì dùng `for` có `i`. Chỉ cần đọc từng phần tử thì for-each
> gọn hơn.

### Lớp tiện ích `java.util.Arrays`

Java có sẵn lớp `Arrays` với nhiều hàm tiện cho mảng [10]. Dòng `import java.util.Arrays;` ở đầu file
báo cho Java biết bạn muốn dùng lớp này (nó nằm trong gói `java.util`).

| Hàm | Làm gì |
|-----|--------|
| `Arrays.toString(a)` | Trả về chuỗi `[a0, a1, ...]` để in |
| `Arrays.sort(a)` | Sắp xếp tăng dần, **sửa thẳng** mảng `a` |
| `Arrays.fill(a, v)` | Gán giá trị `v` cho mọi ô |
| `Arrays.copyOf(a, n)` | Tạo **mảng mới** dài `n`, chép phần tử từ `a` |

```java
import java.util.Arrays;  // lớp tiện ích làm việc với mảng

public class ArraysUtil {
    public static void main(String[] args) {
        long[] amounts = {300_000, 50_000, 1_200_000, 75_000};

        // In mảng trực tiếp chỉ ra "địa chỉ" khó đọc
        System.out.println(amounts);
        // Arrays.toString in đẹp từng phần tử
        System.out.println(Arrays.toString(amounts));

        Arrays.sort(amounts);  // sắp xếp tăng dần, sửa trực tiếp mảng gốc
        System.out.println("Sau sort: " + Arrays.toString(amounts));

        long[] bigger = Arrays.copyOf(amounts, 6);  // mảng MỚI dài 6, phần thừa = 0
        System.out.println("copyOf 6: " + Arrays.toString(bigger));

        long[] firstTwo = Arrays.copyOf(amounts, 2);  // cắt bớt còn 2 phần tử
        System.out.println("copyOf 2: " + Arrays.toString(firstTwo));

        long[] fees = new long[4];
        Arrays.fill(fees, 3_300);  // gán cùng một giá trị cho mọi ô
        System.out.println("fill: " + Arrays.toString(fees));
    }
}
```

**Kết quả khi chạy:**

```text
[J@212bf671
[300000, 50000, 1200000, 75000]
Sau sort: [50000, 75000, 300000, 1200000]
copyOf 6: [50000, 75000, 300000, 1200000, 0, 0]
copyOf 2: [50000, 75000]
fill: [3300, 3300, 3300, 3300]
```

Dòng đầu `[J@...` là cách Java in "tên kiểu + mã băm" của mảng (`[J` nghĩa là mảng `long`). Phần sau `@`
có thể khác mỗi lần chạy. Nó **không** phải nội dung mảng. Muốn xem nội dung, hãy dùng
`Arrays.toString`. `copyOf` với độ dài lớn hơn sẽ điền giá trị mặc định (`0`) vào các ô thừa [10].

### ⚠️ Lỗi hay gặp

**Lỗi 1: `ArrayIndexOutOfBoundsException`.** Truy cập chỉ số `< 0` hoặc `>= length`. Java kiểm tra
chỉ số **lúc chạy** và ném ngoại lệ này [8]. Thường gặp nhất là dùng `<=` thay vì `<`:

```java
public class OutOfBounds {
    public static void main(String[] args) {
        long[] history = {2_000_000, -500_000, 3_000_000};
        // Sai: dùng <= nên i chạy tới 3, mà chỉ số cuối là 2
        for (int i = 0; i <= history.length; i++) {
            System.out.println(history[i]);
        }
    }
}
```

```text
2000000
-500000
3000000
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 3 out of bounds for length 3
    at OutOfBounds.main(OutOfBounds.java:6)
```

Ba ô đầu in bình thường. Đến `i = 3` thì lỗi: `Index 3 out of bounds for length 3`, tức "chỉ số 3 vượt
ra ngoài mảng dài 3". **Cách sửa:** `i < history.length`.

**Lỗi 2: tạo mảng mà quên số ô.**

```java
public class NoSize {
    public static void main(String[] args) {
        long[] history = new long[];
    }
}
```

```text
NoSize.java:3: error: array dimension missing
        long[] history = new long[];
                                   ^
1 error
error: compilation failed
```

**Cách sửa:** `new long[5]`, hoặc dùng `{ ... }` để Java tự đếm. Muốn danh sách **tự dài ra** khi thêm
phần tử, bạn sẽ học `ArrayList` ở chặng 3.

---

## 7. Mảng là kiểu tham chiếu, và mảng 2 chiều

**Ý tưởng nôm na.** Biến mảng không chứa "cái tủ". Nó chỉ chứa **địa chỉ** của cái tủ, giống một tờ giấy
ghi "tủ số 12, tầng 3". Mảng là **kiểu tham chiếu** (*reference type*) [7]. Phô-tô tờ giấy (`alias =
original`) thì bạn có hai tờ giấy cùng chỉ về **một** cái tủ. Ai mở tủ ra sửa thì người kia cũng thấy.
Muốn có tủ riêng, bạn phải đóng một tủ mới và chép đồ sang (`Arrays.copyOf`).

<svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mảng là kiểu tham chiếu. Biến original và biến alias cùng giữ địa chỉ của một mảng duy nhất chứa 999, 200, 300, nên sửa qua alias thì original cũng thấy. Biến copy trỏ tới một mảng khác, được tạo mới bằng Arrays.copyOf, chứa 999, 0, 300.">
  <defs>
    <marker id="b5-ref-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/></marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <text x="80" y="18" fill="#64748B">Biến (giữ địa chỉ)</text>
    <text x="465" y="18" fill="#64748B">Vùng nhớ chứa mảng</text>
    <rect x="20" y="36" width="120" height="36" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="80" y="59" fill="#0F172A" font-family="monospace">original</text>
    <rect x="20" y="86" width="120" height="36" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="80" y="109" fill="#0F172A" font-family="monospace">alias</text>
    <rect x="20" y="166" width="120" height="36" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="80" y="189" fill="#0F172A" font-family="monospace">copy</text>
    <text x="465" y="44" fill="#1D4ED8">mảng A: original và alias dùng chung</text>
    <rect x="360" y="54" width="70" height="40" fill="#EFF6FF" stroke="#2563EB"/>
    <rect x="430" y="54" width="70" height="40" fill="#EFF6FF" stroke="#2563EB"/>
    <rect x="500" y="54" width="70" height="40" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="395" y="79" fill="#DC2626" font-family="monospace">999</text>
    <text x="465" y="79" fill="#0F172A" font-family="monospace">200</text>
    <text x="535" y="79" fill="#0F172A" font-family="monospace">300</text>
    <text x="465" y="154" fill="#047857">mảng B: bản sao mới (Arrays.copyOf)</text>
    <rect x="360" y="164" width="70" height="40" fill="#ECFDF5" stroke="#10B981"/>
    <rect x="430" y="164" width="70" height="40" fill="#ECFDF5" stroke="#10B981"/>
    <rect x="500" y="164" width="70" height="40" fill="#ECFDF5" stroke="#10B981"/>
    <text x="395" y="189" fill="#0F172A" font-family="monospace">999</text>
    <text x="465" y="189" fill="#DC2626" font-family="monospace">0</text>
    <text x="535" y="189" fill="#0F172A" font-family="monospace">300</text>
    <line x1="140" y1="54" x2="356" y2="68" stroke="#2563EB" marker-end="url(#b5-ref-arrow)"/>
    <line x1="140" y1="104" x2="356" y2="82" stroke="#2563EB" marker-end="url(#b5-ref-arrow)"/>
    <line x1="140" y1="184" x2="356" y2="184" stroke="#10B981" marker-end="url(#b5-ref-arrow)"/>
    <text x="590" y="70" fill="#64748B" font-size="11" text-anchor="start">alias[0] = 999</text>
    <text x="590" y="86" fill="#64748B" font-size="11" text-anchor="start">original thấy 999</text>
    <text x="590" y="180" fill="#64748B" font-size="11" text-anchor="start">copy[1] = 0</text>
    <text x="590" y="196" fill="#64748B" font-size="11" text-anchor="start">mảng A không đổi</text>
  </g>
</svg>

```java
import java.util.Arrays;

public class ArrayRef {
    public static void main(String[] args) {
        long[] original = {100, 200, 300};
        long[] alias = original;  // KHÔNG tạo mảng mới, chỉ copy "địa chỉ"

        alias[0] = 999;           // sửa qua alias...
        System.out.println("original: " + Arrays.toString(original));  // ...original cũng đổi

        // Muốn bản sao độc lập thì tạo mảng mới
        long[] copy = Arrays.copyOf(original, original.length);
        copy[1] = 0;
        System.out.println("original: " + Arrays.toString(original));
        System.out.println("copy:     " + Arrays.toString(copy));

        // So sánh mảng
        long[] a = {1, 2, 3};
        long[] b = {1, 2, 3};
        System.out.println("a == b: " + (a == b));                  // so sánh địa chỉ
        System.out.println("a == a: " + (a == a));
        System.out.println("Arrays.equals(a, b): " + Arrays.equals(a, b));  // so sánh nội dung
    }
}
```

**Kết quả khi chạy:**

```text
original: [999, 200, 300]
original: [999, 200, 300]
copy:     [999, 0, 300]
a == b: false
a == a: true
Arrays.equals(a, b): true
```

**Giải thích từng bước:**

1. `long[] alias = original;` chỉ chép **địa chỉ**. Vẫn chỉ có một mảng.
2. `alias[0] = 999` sửa ô 0 của mảng chung, nên in `original` thấy `999`.
3. `Arrays.copyOf` tạo mảng **mới**. Sửa `copy[1]` không ảnh hưởng `original`.
4. `a == b` so sánh **địa chỉ**. `a` và `b` là hai mảng khác nhau (dù nội dung giống), nên `false`.
5. `Arrays.equals(a, b)` so sánh **từng phần tử**, nên `true` [10].

> 💡 Quy tắc này giống với `String`: với kiểu tham chiếu, `==` hỏi "có phải **cùng một** vật không?",
> còn hàm `equals` hỏi "nội dung có **giống nhau** không?".

### Mảng 2 chiều: bảng số dư theo tháng × tài khoản

Mảng 2 chiều là **mảng của các mảng**. Hình dung bảng Excel: mỗi hàng là một tháng, mỗi cột là một tài
khoản. `balances[hàng][cột]` lấy ra một ô [8].

<svg viewBox="0 0 640 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mảng 2 chiều balances có 3 hàng là 3 tháng và 2 cột là 2 tài khoản. Hàng 0: 5000 và 20000. Hàng 1: 4200 và 21000. Hàng 2: 6100 và 22500. Ô balances[1][1] ở hàng 1 cột 1 có giá trị 21000 được tô đậm. Chỉ số đầu là hàng, chỉ số sau là cột.">
  <defs>
    <marker id="b5-2d-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/></marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <text x="235" y="20" fill="#64748B">chỉ số sau = cột (tài khoản)</text>
    <text x="235" y="48" fill="#1D4ED8">[0] Thanh toán</text>
    <text x="365" y="48" fill="#1D4ED8">[1] Tiết kiệm</text>
    <text x="20" y="20" fill="#64748B" text-anchor="start">chỉ số đầu = hàng</text>
    <text x="95" y="85" fill="#1D4ED8">[0] tháng 1</text>
    <text x="95" y="125" fill="#1D4ED8">[1] tháng 2</text>
    <text x="95" y="165" fill="#1D4ED8">[2] tháng 3</text>
    <rect x="170" y="60" width="130" height="40" fill="#F8FAFC" stroke="#94A3B8"/>
    <rect x="300" y="60" width="130" height="40" fill="#F8FAFC" stroke="#94A3B8"/>
    <rect x="170" y="100" width="130" height="40" fill="#F8FAFC" stroke="#94A3B8"/>
    <rect x="300" y="100" width="130" height="40" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.5"/>
    <rect x="170" y="140" width="130" height="40" fill="#F8FAFC" stroke="#94A3B8"/>
    <rect x="300" y="140" width="130" height="40" fill="#F8FAFC" stroke="#94A3B8"/>
    <g font-family="monospace" fill="#0F172A">
      <text x="235" y="85">5000</text>
      <text x="365" y="85">20000</text>
      <text x="235" y="125">4200</text>
      <text x="365" y="125" fill="#1D4ED8">21000</text>
      <text x="235" y="165">6100</text>
      <text x="365" y="165">22500</text>
    </g>
    <line x1="490" y1="120" x2="434" y2="120" stroke="#64748B" marker-end="url(#b5-2d-arrow)"/>
    <text x="495" y="116" fill="#1D4ED8" font-family="monospace" text-anchor="start">balances[1][1]</text>
    <text x="495" y="133" fill="#64748B" text-anchor="start">= 21000</text>
    <text x="300" y="202" fill="#64748B">balances.length = 3 hàng · balances[0].length = 2 cột</text>
  </g>
</svg>

```java
import java.util.Arrays;

public class Balance2D {
    public static void main(String[] args) {
        String[] accounts = {"Thanh toán", "Tiết kiệm"};
        // Mảng 2 chiều: 3 hàng (tháng) x 2 cột (tài khoản), đơn vị nghìn đồng
        long[][] balances = {
            {5_000, 20_000},   // tháng 1
            {4_200, 21_000},   // tháng 2
            {6_100, 22_500}    // tháng 3
        };

        System.out.println("Số tháng: " + balances.length);        // số hàng
        System.out.println("Số tài khoản: " + balances[0].length); // số cột
        System.out.println("Tiết kiệm, tháng 2: " + balances[1][1]);

        // Hai vòng for lồng nhau: ngoài duyệt hàng, trong duyệt cột
        for (int m = 0; m < balances.length; m++) {
            long total = 0;
            for (int acc = 0; acc < balances[m].length; acc++) {
                total += balances[m][acc];
            }
            System.out.println("Tháng " + (m + 1) + ": tổng " + total + " nghìn đồng");
        }

        // Tổng theo từng tài khoản (duyệt theo cột)
        for (int acc = 0; acc < accounts.length; acc++) {
            long sum = 0;
            for (long[] month : balances) {
                sum += month[acc];
            }
            System.out.println(accounts[acc] + ": cộng 3 tháng = " + sum);
        }
        System.out.println(Arrays.deepToString(balances));
    }
}
```

**Kết quả khi chạy:**

```text
Số tháng: 3
Số tài khoản: 2
Tiết kiệm, tháng 2: 21000
Tháng 1: tổng 25000 nghìn đồng
Tháng 2: tổng 25200 nghìn đồng
Tháng 3: tổng 28600 nghìn đồng
Thanh toán: cộng 3 tháng = 15300
Tiết kiệm: cộng 3 tháng = 63500
[[5000, 20000], [4200, 21000], [6100, 22500]]
```

**Giải thích từng bước:**

1. `balances.length` là số hàng (3). `balances[0]` là hàng đầu, một mảng `long[]` có 2 ô, nên
   `balances[0].length` là 2.
2. `balances[1][1]`: hàng 1 (tháng 2), cột 1 (Tiết kiệm), bằng `21000`.
3. Hai vòng `for` **lồng nhau**: vòng ngoài chọn tháng `m`, vòng trong đi qua từng tài khoản của tháng đó
   và cộng dồn.
4. Tính theo cột thì đảo lại: vòng ngoài chọn tài khoản, vòng trong (for-each) lấy từng hàng `month` rồi
   đọc `month[acc]`.
5. `Arrays.deepToString` in được mảng nhiều chiều [10].

### ⚠️ Lỗi hay gặp

**Lỗi 1: dùng `==` để so sánh nội dung hai mảng.** Như ví dụ trên, `a == b` ra `false` dù nội dung giống
hệt. **Cách sửa:** `Arrays.equals(a, b)` (mảng 1 chiều) hoặc `Arrays.deepEquals(a, b)` (nhiều chiều).

**Lỗi 2: tưởng gán là sao chép.** `long[] backup = history;` rồi sửa `history` thì `backup` cũng đổi theo,
vì chúng là một. **Cách sửa:** `long[] backup = Arrays.copyOf(history, history.length);`.

**Lỗi 3: in mảng 2 chiều bằng `Arrays.toString`.**

```java
import java.util.Arrays;

public class ToString2D {
    public static void main(String[] args) {
        long[][] balances = {{5_000, 20_000}, {4_200, 21_000}};
        System.out.println(Arrays.toString(balances));      // sai với mảng 2 chiều
        System.out.println(Arrays.deepToString(balances));  // đúng
    }
}
```

```text
[[J@120d6fe6, [J@4ba2ca36]
[[5000, 20000], [4200, 21000]]
```

`Arrays.toString` chỉ "mở" một lớp, nên in ra địa chỉ của từng hàng. **Cách sửa:** dùng
`Arrays.deepToString`.

---

## 8. Đọc dữ liệu từ bàn phím với `Scanner` và mini ATM

**Ý tưởng nôm na.** Tới giờ, mọi số liệu đều "viết cứng" trong code. ATM thật phải **hỏi** khách. Lớp
`Scanner` giống một nhân viên đứng ở quầy: chữ bạn gõ được xếp thành hàng đợi, nhân viên lấy ra từng phần
theo yêu cầu: "lấy cho tôi một số nguyên", "lấy cho tôi cả dòng" [11].

| Phương thức | Làm gì |
|-------------|--------|
| `nextLine()` | Lấy **cả dòng** tới dấu xuống dòng, trả về `String` (bỏ dấu xuống dòng) |
| `next()` | Lấy một **từ** (*token*): một cụm ký tự, ngăn cách bởi dấu cách hoặc xuống dòng |
| `nextInt()`, `nextLong()` | Lấy một từ và đổi thành `int`, `long` |
| `hasNextInt()` | Chỉ **nhìn trước** xem từ kế tiếp có phải `int` không, **không lấy ra** |

### 8.1. Đọc tên và số tháng, chống nhập sai

```java
import java.util.Scanner;

public class ScannerDemo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);  // đọc từ bàn phím (System.in)

        System.out.print("Nhập họ tên: ");
        String name = scanner.nextLine();           // đọc cả dòng, kể cả dấu cách

        System.out.print("Gửi tiết kiệm bao nhiêu tháng? ");
        // hasNextInt: hỏi "từ kế tiếp có phải số nguyên không?", KHÔNG lấy nó ra
        while (!scanner.hasNextInt()) {
            String bad = scanner.next();             // lấy bỏ từ sai
            System.out.print("'" + bad + "' không phải số. Nhập lại: ");
        }
        int months = scanner.nextInt();              // đọc một số nguyên
        System.out.println();
        System.out.println(name + " gửi kỳ hạn " + months + " tháng");
    }
}
```

Mình kiểm chứng bằng cách **đưa sẵn dữ liệu nhập qua pipe** (`|`), giả lập người dùng gõ 3 dòng:
`Nguyen Van An`, `muoi hai`, `12`:

```text
printf 'Nguyen Van An\nmuoi hai\n12\n' | java ScannerDemo.java
```

**Kết quả khi chạy:**

```text
Nhập họ tên: Gửi tiết kiệm bao nhiêu tháng? 'muoi' không phải số. Nhập lại: 'hai' không phải số. Nhập lại: 
Nguyen Van An gửi kỳ hạn 12 tháng
```

Vì dữ liệu đến từ pipe, phần "bạn gõ" không hiện lên màn hình, nên các lời nhắc nằm sát nhau trên một
dòng. Khi chạy thật và tự gõ, bạn sẽ thấy chữ mình gõ xen giữa.

**Giải thích từng bước:**

1. `new Scanner(System.in)` tạo một `Scanner` đọc từ **luồng nhập chuẩn** (*standard input*), mặc định
   là bàn phím.
2. `nextLine()` lấy cả dòng `Nguyen Van An`, kể cả dấu cách.
3. `hasNextInt()` nhìn từ kế tiếp: `muoi`, không phải số, nên trả về `false`. Vòng `while` chạy:
   `next()` lấy bỏ `muoi`, in nhắc nhở.
4. Lặp lại với `hai`. Đến `12` thì `hasNextInt()` là `true`, thoát vòng lặp.
5. `nextInt()` lấy `12`.

Nếu không có vòng kiểm tra `hasNextInt()`, gọi thẳng `nextInt()` khi người dùng gõ chữ sẽ gây ngoại
lệ [11]:

```text
$ printf 'abc\n' | java MismatchDemo.java      # MismatchDemo chỉ gọi scanner.nextInt()
Exception in thread "main" java.util.InputMismatchException
    at java.base/java.util.Scanner.throwFor(Scanner.java:947)
    at java.base/java.util.Scanner.next(Scanner.java:1602)
    at java.base/java.util.Scanner.nextInt(Scanner.java:2267)
    at java.base/java.util.Scanner.nextInt(Scanner.java:2221)
    at MismatchDemo.main(MismatchDemo.java:6)
```

### ⚠️ Lỗi hay gặp: bẫy `nextInt()` rồi `nextLine()`

`nextInt()` chỉ lấy **phần số**. Dấu xuống dòng (`\n`, sinh ra khi bạn bấm Enter) **vẫn nằm lại** trong
hàng đợi. `nextLine()` ngay sau đó thấy dấu xuống dòng, hiểu là "hết dòng", và trả về chuỗi rỗng.

<svg viewBox="0 0 640 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bẫy nextInt rồi nextLine. Dữ liệu nhập là 500000, ký tự xuống dòng, Tra tien nha, ký tự xuống dòng. Trường hợp sai: nextInt chỉ lấy 500000 và để lại ký tự xuống dòng, nextLine ngay sau đó đọc tới ký tự xuống dòng nên trả về chuỗi rỗng. Cách sửa: gọi thêm một nextLine để bỏ ký tự xuống dòng còn sót, rồi nextLine tiếp theo mới đọc được Tra tien nha.">
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <text x="20" y="22" fill="#64748B" text-anchor="start">Dữ liệu chờ trong luồng nhập (System.in):</text>
    <text x="20" y="74" fill="#DC2626" text-anchor="start">Sai</text>
    <text x="20" y="184" fill="#047857" text-anchor="start">Đúng</text>
    <g font-family="monospace">
      <rect x="80" y="50" width="110" height="36" fill="#EFF6FF" stroke="#2563EB"/>
      <text x="135" y="73" fill="#0F172A">500000</text>
      <rect x="190" y="50" width="50" height="36" fill="#FEF2F2" stroke="#DC2626"/>
      <text x="215" y="73" fill="#DC2626">\n</text>
      <rect x="240" y="50" width="150" height="36" fill="#F8FAFC" stroke="#94A3B8"/>
      <text x="315" y="73" fill="#64748B">Tra tien nha</text>
      <rect x="390" y="50" width="50" height="36" fill="#F8FAFC" stroke="#94A3B8"/>
      <text x="415" y="73" fill="#64748B">\n</text>
      <rect x="80" y="160" width="110" height="36" fill="#EFF6FF" stroke="#2563EB"/>
      <text x="135" y="183" fill="#0F172A">500000</text>
      <rect x="190" y="160" width="50" height="36" fill="#F8FAFC" stroke="#94A3B8"/>
      <text x="215" y="183" fill="#64748B">\n</text>
      <rect x="240" y="160" width="200" height="36" fill="#ECFDF5" stroke="#10B981"/>
      <text x="315" y="183" fill="#047857">Tra tien nha</text>
      <text x="415" y="183" fill="#047857">\n</text>
    </g>
    <path d="M82,94 V100 H188 V94" fill="none" stroke="#2563EB"/>
    <text x="135" y="116" fill="#1D4ED8" font-family="monospace">nextInt()</text>
    <text x="135" y="132" fill="#64748B" font-size="11">→ 500000</text>
    <path d="M192,94 V100 H238 V94" fill="none" stroke="#DC2626"/>
    <text x="215" y="116" fill="#DC2626" font-family="monospace">nextLine()</text>
    <text x="215" y="132" fill="#DC2626" font-size="11">→ "" (rỗng!)</text>
    <text x="460" y="73" fill="#64748B" font-size="11" text-anchor="start">← không ai đọc tới</text>
    <path d="M82,204 V210 H188 V204" fill="none" stroke="#2563EB"/>
    <text x="135" y="226" fill="#1D4ED8" font-family="monospace">nextInt()</text>
    <path d="M192,204 V210 H238 V204" fill="none" stroke="#64748B"/>
    <text x="215" y="226" fill="#64748B" font-family="monospace" font-size="11">nextLine()</text>
    <text x="215" y="242" fill="#64748B" font-size="11">bỏ đi</text>
    <path d="M242,204 V210 H438 V204" fill="none" stroke="#10B981"/>
    <text x="340" y="226" fill="#047857" font-family="monospace">nextLine()</text>
    <text x="340" y="242" fill="#047857" font-size="11">→ "Tra tien nha"</text>
  </g>
</svg>

```java
import java.util.Scanner;

public class NextLineTrap {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Số tiền: ");
        int amount = scanner.nextInt();     // đọc "500000", để lại ký tự xuống dòng
        System.out.print("Nội dung chuyển khoản: ");
        String note = scanner.nextLine();   // đọc phần còn lại của dòng cũ: chuỗi rỗng!
        System.out.println();
        System.out.println("amount = " + amount + ", note = [" + note + "]");
    }
}
```

Chạy với dữ liệu nhập `500000` rồi `Tra tien nha`:

```text
Số tiền: Nội dung chuyển khoản: 
amount = 500000, note = []
```

Nội dung chuyển khoản bị mất. **Cách sửa:** gọi thêm một `nextLine()` để "nuốt" dấu xuống dòng còn sót:

```java
import java.util.Scanner;

public class NextLineFix {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Số tiền: ");
        int amount = scanner.nextInt();
        scanner.nextLine();                 // "nuốt" ký tự xuống dòng còn sót
        System.out.print("Nội dung chuyển khoản: ");
        String note = scanner.nextLine();
        System.out.println();
        System.out.println("amount = " + amount + ", note = [" + note + "]");
    }
}
```

```text
Số tiền: Nội dung chuyển khoản: 
amount = 500000, note = [Tra tien nha]
```

### 8.2. Mini ATM: vòng lặp + switch + if

Giờ ghép mọi thứ của bài lại. Menu chạy trong `while`, lựa chọn đi vào `switch`, việc duyệt rút tiền
dùng `if / else if`, còn `?:` quyết định cộng hay trừ.

<svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Luồng mini ATM. Vòng lặp while in menu. Nếu hasNextInt sai thì bỏ từ sai và continue quay lại menu. Nếu đúng thì đọc option và đưa vào switch: 1 in số dư, 2 hoặc 3 nạp hoặc rút, 0 đặt running bằng false để thoát, giá trị khác báo không có chức năng. Sau mỗi lựa chọn, vòng lặp quay lại menu khi running còn true.">
  <defs>
    <marker id="b5-atm-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/></marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="15" y="92" width="110" height="40" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="70" y="109" fill="#0F172A">In menu</text>
    <text x="70" y="124" fill="#64748B" font-size="11">while (running)</text>
    <polygon points="160,112 235,82 310,112 235,142" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="235" y="116" fill="#1D4ED8" font-family="monospace">hasNextInt()?</text>
    <rect x="165" y="10" width="140" height="36" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="235" y="26" fill="#D97706">bỏ từ sai</text>
    <text x="235" y="40" fill="#D97706" font-family="monospace" font-size="11">continue</text>
    <rect x="345" y="90" width="120" height="44" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="405" y="109" fill="#1D4ED8" font-family="monospace">nextInt()</text>
    <text x="405" y="125" fill="#1D4ED8" font-family="monospace">switch</text>
    <rect x="510" y="8" width="200" height="34" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="610" y="29" fill="#047857">1 → in số dư</text>
    <rect x="510" y="54" width="200" height="34" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="610" y="75" fill="#047857">2, 3 → nạp / rút</text>
    <rect x="510" y="100" width="200" height="34" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="610" y="121" fill="#0F172A">0 → running = false</text>
    <rect x="510" y="146" width="200" height="34" rx="6" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="610" y="167" fill="#DC2626">khác → báo lỗi</text>
    <line x1="125" y1="112" x2="158" y2="112" stroke="#64748B" marker-end="url(#b5-atm-arrow)"/>
    <line x1="310" y1="112" x2="343" y2="112" stroke="#64748B" marker-end="url(#b5-atm-arrow)"/>
    <text x="326" y="105" fill="#64748B" font-size="11">đúng</text>
    <line x1="235" y1="82" x2="235" y2="48" stroke="#64748B" marker-end="url(#b5-atm-arrow)"/>
    <text x="245" y="68" fill="#64748B" font-size="11" text-anchor="start">sai</text>
    <path d="M165,28 H70 V90" fill="none" stroke="#D97706" marker-end="url(#b5-atm-arrow)"/>
    <line x1="465" y1="112" x2="508" y2="25" stroke="#64748B"/>
    <line x1="465" y1="112" x2="508" y2="71" stroke="#64748B"/>
    <line x1="465" y1="112" x2="508" y2="117" stroke="#64748B"/>
    <line x1="465" y1="112" x2="508" y2="163" stroke="#64748B"/>
    <path d="M610,180 V210 H70 V134" fill="none" stroke="#64748B" marker-end="url(#b5-atm-arrow)"/>
    <text x="340" y="204" fill="#64748B" font-size="11">hết switch → quay lại kiểm tra running (0 thì thoát)</text>
  </g>
</svg>

```java
import java.util.Scanner;

public class Atm {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        long balance = 5_000_000;   // số dư ban đầu (đồng)
        boolean running = true;     // còn chạy menu không

        while (running) {
            System.out.print("\n1.Số dư 2.Nạp 3.Rút 0.Thoát | Chọn: ");
            if (!scanner.hasNextInt()) {
                System.out.println("Vui lòng nhập số");
                scanner.next();      // bỏ từ không hợp lệ
                continue;            // quay lại đầu vòng lặp
            }
            int option = scanner.nextInt();
            switch (option) {
                case 1 -> System.out.println("Số dư: " + balance + " đồng");
                case 2, 3 -> {
                    System.out.print("Số tiền: ");
                    long amount = scanner.nextLong();  // tiền dùng long
                    if (amount <= 0) {
                        System.out.println("Số tiền phải lớn hơn 0");
                    } else if (option == 3 && amount > balance) {
                        System.out.println("Số dư không đủ");
                    } else {
                        balance += option == 2 ? amount : -amount;  // nạp cộng, rút trừ
                        System.out.println("Thành công. Số dư: " + balance + " đồng");
                    }
                }
                case 0 -> running = false;   // điều kiện vòng lặp thành false
                default -> System.out.println("Không có chức năng " + option);
            }
        }
        System.out.println("Cảm ơn bạn đã dùng Onward ATM");
        scanner.close();
    }
}
```

Mình chạy thử bằng một kịch bản: xem số dư, nạp 1,5 triệu, rút 10 triệu (không đủ), rút 2 triệu, gõ
nhầm `abc`, chọn số `9` không có trong menu, xem số dư, rồi thoát:

```text
printf '1\n2\n1500000\n3\n10000000\n3\n2000000\nabc\n9\n1\n0\n' | java Atm.java
```

**Kết quả khi chạy:**

```text

1.Số dư 2.Nạp 3.Rút 0.Thoát | Chọn: Số dư: 5000000 đồng

1.Số dư 2.Nạp 3.Rút 0.Thoát | Chọn: Số tiền: Thành công. Số dư: 6500000 đồng

1.Số dư 2.Nạp 3.Rút 0.Thoát | Chọn: Số tiền: Số dư không đủ

1.Số dư 2.Nạp 3.Rút 0.Thoát | Chọn: Số tiền: Thành công. Số dư: 4500000 đồng

1.Số dư 2.Nạp 3.Rút 0.Thoát | Chọn: Vui lòng nhập số

1.Số dư 2.Nạp 3.Rút 0.Thoát | Chọn: Không có chức năng 9

1.Số dư 2.Nạp 3.Rút 0.Thoát | Chọn: Số dư: 4500000 đồng

1.Số dư 2.Nạp 3.Rút 0.Thoát | Chọn: Cảm ơn bạn đã dùng Onward ATM
```

**Giải thích từng bước:**

1. `running = true`, nên `while (running)` vào lần lặp đầu, in menu. Chuỗi `"\n1.Số dư..."` bắt đầu bằng
   `\n` để in một dòng trống trước menu.
2. `hasNextInt()` kiểm tra lựa chọn. Gõ `abc` thì in `Vui lòng nhập số`, `next()` bỏ từ đó, rồi
   `continue` quay về đầu vòng lặp, **không** chạy `switch`.
3. Chọn `2` hoặc `3` thì vào cùng một nhánh. Các điều kiện kiểm tra theo thứ tự: số tiền dương, rồi
   (chỉ khi rút) số dư có đủ không.
4. `balance += option == 2 ? amount : -amount;`: nạp thì cộng `amount`, rút thì cộng `-amount` (tức là
   trừ).
5. Chọn `9`: không khớp nhãn nào, chạy `default`.
6. Chọn `0`: gán `running = false`. Hết `switch`, vòng lặp quay lại kiểm tra `running`, thấy `false`
   nên thoát, in lời cảm ơn.
7. `scanner.close()` đóng `Scanner` khi không dùng nữa.

> 💡 Đây là phiên bản tối giản để học. Nếu nhập chữ ở bước "Số tiền", `nextLong()` vẫn ném
> `InputMismatchException`. Bài tập 3 sẽ yêu cầu bạn vá chỗ này.

> 💡 Java 25 có lớp `IO` với `IO.readln("...")` để đọc một dòng gọn hơn trong các chương trình nhỏ
> (JEP 512) [12]. Bài này vẫn dùng `Scanner` vì nó chạy được trên mọi phiên bản Java và đọc được số
> trực tiếp.

---

## Tóm tắt

- Toán tử so sánh (`== != < > <= >=`) và logic (`&& || !`) tạo ra giá trị `boolean`. `&&` và `||`
  **đoản mạch**: đặt phép kiểm tra an toàn (`!= null`, `!= 0`) ở vế trái.
- `if / else if / else` xét điều kiện từ trên xuống, chạy **nhánh đúng đầu tiên**. Luôn dùng `{ }`.
- `switch` kiểu `case ... :` cần `break`, quên là bị **fall-through**. Kiểu `->` (Java 14+) không rơi
  xuống, trả được giá trị, dùng `yield` cho khối nhiều lệnh. `?:` chọn nhanh giữa hai giá trị.
- `while` hỏi trước, `do-while` làm trước (ít nhất 1 lần), `for` hợp khi biết số lần, for-each để đọc
  từng phần tử. `break` thoát vòng lặp, `continue` sang lần lặp kế.
- Mảng có độ dài cố định, chỉ số từ `0` đến `length - 1`. Vượt ra ngoài thì gặp
  `ArrayIndexOutOfBoundsException`. Ô chưa gán có giá trị mặc định (`0`, `false`, `null`...).
- `java.util.Arrays` có `toString`, `sort`, `fill`, `copyOf`, `equals`, `deepToString`.
- Mảng là kiểu tham chiếu: gán chỉ chép địa chỉ, `==` so địa chỉ, `Arrays.equals` so nội dung.
- `Scanner` đọc bàn phím. Dùng `hasNextInt()` để chống nhập sai, và nhớ "nuốt" dấu xuống dòng sau
  `nextInt()` trước khi gọi `nextLine()`.

## Tự kiểm tra

**1.** Đoạn sau có bị lỗi chia cho 0 không? Vì sao?

```java
int months = 0;
if (months != 0 && 1_000_000 / months > 100) { System.out.println("OK"); }
```

<details><summary>Đáp án</summary>

Không. `months != 0` là `false`, nên `&&` đoản mạch và không tính `1_000_000 / months`. Chương trình
không in gì và không lỗi.

</details>

**2.** Trong ví dụ `FallThrough` (thiếu `break`), nếu đổi `option = 1` thì in ra mấy dòng?

<details><summary>Đáp án</summary>

Bốn dòng: `Xem số dư`, `Rút tiền`, `Chuyển khoản`, `Lựa chọn không hợp lệ`. Java nhảy vào `case 1` rồi
rơi xuống chạy hết các case bên dưới, kể cả `default`.

</details>

**3.** Khác nhau cốt lõi giữa `while` và `do-while` là gì? Nếu điều kiện sai ngay từ đầu thì mỗi loại
chạy thân bao nhiêu lần?

<details><summary>Đáp án</summary>

`while` kiểm tra điều kiện trước khi chạy thân, `do-while` chạy thân trước rồi mới kiểm tra. Điều kiện
sai từ đầu: `while` chạy 0 lần, `do-while` chạy 1 lần.

</details>

**4.** Cho `int[] a = new int[3];`. `a[0]` bằng bao nhiêu? `a[3]` thì sao?

<details><summary>Đáp án</summary>

`a[0]` là `0` (giá trị mặc định của `int`). `a[3]` gây `ArrayIndexOutOfBoundsException` vì chỉ số hợp
lệ chỉ là `0`, `1`, `2`.

</details>

**5.** Sau đoạn sau, `a[0]` bằng bao nhiêu? `a == b` là gì?

```java
int[] a = {1, 2};
int[] b = a;
b[0] = 9;
```

<details><summary>Đáp án</summary>

`a[0]` là `9`, vì `a` và `b` trỏ cùng một mảng. `a == b` là `true` vì chúng giữ cùng một địa chỉ.

</details>

**6.** Vì sao `nextLine()` gọi ngay sau `nextInt()` lại trả về chuỗi rỗng? Sửa thế nào?

<details><summary>Đáp án</summary>

`nextInt()` chỉ lấy phần số, để lại dấu xuống dòng `\n` trong hàng đợi. `nextLine()` đọc tới `\n` đó
và trả về phần trước nó, tức chuỗi rỗng. Sửa: gọi thêm một `scanner.nextLine();` ngay sau `nextInt()`
để bỏ dấu xuống dòng.

</details>

## Bài tập

**Bài 1 (dễ): Phân hạng khách hàng.** Cho `long balance`. Dùng `if / else if / else` để in hạng:
từ 500 triệu trở lên là `PRIORITY`, từ 50 triệu là `GOLD`, còn lại là `STANDARD`. Sau đó dùng switch
expression trên chuỗi hạng để tính phí thường niên: `PRIORITY` 0 đồng, `GOLD` 200.000 đồng, `STANDARD`
100.000 đồng.

> Gợi ý: xếp điều kiện từ hẹp đến rộng (500 triệu trước). Switch expression trên `String` vẫn cần
> `default`.

**Bài 2 (vừa): Thống kê lịch sử giao dịch.** Cho
`long[] tx = {2_000_000, -500_000, -150_000, 3_000_000, -1_200_000, -80_000};`. In ra: số giao dịch
rút (số âm), tổng tiền đã rút, giao dịch rút **lớn nhất** (âm nhất), và mảng sau khi sắp xếp. Mảng `tx`
gốc phải giữ nguyên thứ tự.

> Gợi ý: dùng for-each và một biến đếm. Muốn sort mà không sửa `tx` thì sort trên
> `Arrays.copyOf(tx, tx.length)`.

**Bài 3 (khó): Nâng cấp mini ATM.** Từ `Atm.java` ở phần 8, thêm:

1. Chức năng `4. Lịch sử`: dùng `long[] history = new long[5]` và một biến `count` để lưu tối đa 5 giao
   dịch (nạp là số dương, rút là số âm), rồi in ra.
2. Hạn mức rút 20 triệu mỗi lần chạy chương trình (cộng dồn các lần rút).
3. Không còn crash khi nhập chữ ở bước "Số tiền".

> Gợi ý: hạn mức làm giống ví dụ `Withdraw` ở phần 2. Ý 3 dùng `hasNextLong()` giống cách menu dùng
> `hasNextInt()`. Kiểm chứng bằng `printf '...' | java Atm.java` như trong bài.

## Đọc thêm

1. roadmap.sh, *Java Developer Roadmap* (Conditionals, Loops, Arrays): <https://roadmap.sh/java>
2. dev.java, *Control Flow Statements*: <https://dev.java/learn/language-basics/controlling-flow/> và
   *Using Operators*: <https://dev.java/learn/language-basics/using-operators/>
3. JLS 21, §15.23 Conditional-And Operator và §15.24 Conditional-Or Operator:
   <https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.23>
4. JEP 358, *Helpful NullPointerExceptions*: <https://openjdk.org/jeps/358>
5. Oracle, *Switch Expressions and Statements* (Java 21):
   <https://docs.oracle.com/en/java/javase/21/language/switch-expressions-and-statements.html>
6. JEP 361, *Switch Expressions*: <https://openjdk.org/jeps/361>
7. dev.java, *Creating Arrays in Your Programs*: <https://dev.java/learn/language-basics/arrays/>
8. JLS 21, Chapter 10 *Arrays*: <https://docs.oracle.com/javase/specs/jls/se21/html/jls-10.html>
9. JLS 21, §4.12.5 *Initial Values of Variables*:
   <https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.12.5>
10. Java SE 21 API, `java.util.Arrays`:
    <https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Arrays.html>
11. Java SE 21 API, `java.util.Scanner`:
    <https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Scanner.html>
12. JEP 512, *Compact Source Files and Instance Main Methods*: <https://openjdk.org/jeps/512>
13. Jakob Jenkov, *Java Arrays*: <https://jenkov.com/tutorials/java/arrays.html> và
    *Java switch*: <https://jenkov.com/tutorials/java/switch.html>
14. Programiz, *Java for Loop*: <https://www.programiz.com/java-programming/for-loop>

---

**Bài tiếp theo:** [Bài 6 · Nhập môn lập trình hướng đối tượng](/docs/learning/chang-1/nhap-mon-oop)
