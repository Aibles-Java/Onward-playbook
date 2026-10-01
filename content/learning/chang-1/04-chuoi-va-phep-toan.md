---
title: "Bài 4 · Chuỗi và phép toán"
description: "Làm việc với String (bất biến, so sánh, các method hay dùng, ghép và định dạng), phép toán số học, class Math và cách tính tiền đúng bằng BigDecimal."
order: 14
tags: [java, chặng-1, string, math, bigdecimal]
---

# Bài 4 · Chuỗi và phép toán

> 🎯 **Sau bài này bạn sẽ:**
> - Giải thích được vì sao `String` là **bất biến** và "sửa" một chuỗi thật ra là tạo chuỗi mới.
> - So sánh chuỗi đúng cách bằng `equals`, và nói được vì sao `==` cho kết quả sai.
> - Dùng thành thạo khoảng 15 method của `String` để chuẩn hoá tên, che số tài khoản.
> - Dự đoán đúng kết quả của `/`, `%`, `++` với số nguyên, và phát hiện tràn số.
> - Tính phí, tính lãi bằng `BigDecimal` với số chữ số lẻ và cách làm tròn rõ ràng.

**Cần biết trước:** [Bài 3 · Kiểu dữ liệu, biến và ép kiểu](/docs/learning/chang-1/kieu-du-lieu-bien-ep-kieu)
(kiểu `int`, `long`, `double`, khai báo biến, ép kiểu).

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| **String** (chuỗi) | Một dãy ký tự, như dòng chữ in trên thẻ | `"Onward"` |
| **Immutable** (bất biến) | Đã tạo thì không sửa được nội dung | `String`, `BigDecimal` |
| **String pool** | "Kho" chứa sẵn các chuỗi literal để dùng chung | `"VCB"` viết 2 lần vẫn là 1 object |
| **Method** (phương thức) | Một thao tác gọi trên dữ liệu bằng dấu chấm | `name.length()` |
| **Index** (chỉ số) | Số thứ tự ký tự, **bắt đầu từ 0** | `"An".charAt(0)` là `'A'` |
| **Overflow** (tràn số) | Kết quả vượt quá sức chứa của kiểu | `Integer.MAX_VALUE + 1` |
| **BigDecimal** | Kiểu số thập phân chính xác, dùng cho tiền | `new BigDecimal("0.1")` |
| **Scale** | Số chữ số sau dấu phẩy mà một `BigDecimal` giữ | `"2.50"` có scale 2 |
| **RoundingMode** | Quy tắc làm tròn | `HALF_UP`, `HALF_EVEN` |

💡 Tất cả ví dụ chạy được trên JDK 21 trở lên (kể cả Java 25). Lưu mỗi ví dụ thành file
cùng tên class rồi chạy bằng `java TenFile.java` như bạn đã làm ở bài 2.

---

## 1. String là gì: chuỗi bất biến

**Ý tưởng nôm na.** **Chuỗi** (*String*) là một dãy ký tự đặt trong dấu nháy kép. Nó giống
tờ sao kê ngân hàng đã in: bạn không tẩy xoá được. Muốn nội dung khác, ngân hàng in một tờ mới.
Trong Java, `String` là **bất biến** (*immutable*): đã tạo thì nội dung không bao giờ đổi [5].

Vài từ cần biết trước khi đọc code:

- **Đối tượng** (*object*): một khối dữ liệu nằm trong bộ nhớ. Một `String` là một object.
- **Tham chiếu** (*reference*): biến kiểu `String` không chứa chữ, mà chứa "địa chỉ" trỏ tới
  object. Hãy hình dung biến là tấm thẻ ghi số ngăn tủ, còn object là đồ trong ngăn.
  (Bài 6 về OOP sẽ học kỹ object.)
- **Literal**: giá trị viết thẳng trong code, như `"Onward"`.
- **String pool**: vùng nhớ đặc biệt chứa các chuỗi literal. Hai literal giống hệt nhau sẽ
  dùng chung **một** object trong pool [4].
- **Method** (*phương thức*): thao tác gọi bằng dấu chấm, ví dụ `bank.toUpperCase()`.

<svg viewBox="0 0 720 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chuỗi bất biến. Trước: biến bank và original cùng trỏ tới object Onward trong string pool. Sau lệnh bank = bank + Bank: Java tạo object mới Onward Bank, bank trỏ sang object mới, original vẫn trỏ object Onward cũ, không bị sửa.">
  <defs>
    <marker id="b4-immut-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
    <marker id="b4-immut-arrow-new" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#047857"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="20" y="24" fill="#0F172A" font-size="13" font-weight="bold">Trước</text>
    <text x="380" y="24" fill="#0F172A" font-size="13" font-weight="bold">Sau: bank = bank + " Bank";</text>
    <line x1="355" y1="10" x2="355" y2="250" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <rect x="20" y="60" width="90" height="34" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="65" y="82" fill="#0F172A" font-family="monospace" text-anchor="middle">bank</text>
    <rect x="20" y="140" width="90" height="34" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="65" y="162" fill="#0F172A" font-family="monospace" text-anchor="middle">original</text>
    <rect x="170" y="45" width="170" height="150" rx="10" fill="#EFF6FF" stroke="#2563EB" stroke-dasharray="5 3"/>
    <text x="255" y="64" fill="#1D4ED8" text-anchor="middle">String pool</text>
    <rect x="195" y="100" width="120" height="36" rx="6" fill="#FFFFFF" stroke="#2563EB"/>
    <text x="255" y="123" fill="#0F172A" font-family="monospace" text-anchor="middle">"Onward"</text>
    <line x1="110" y1="77" x2="190" y2="110" stroke="#64748B" stroke-width="1.5" marker-end="url(#b4-immut-arrow)"/>
    <line x1="110" y1="157" x2="190" y2="128" stroke="#64748B" stroke-width="1.5" marker-end="url(#b4-immut-arrow)"/>
    <rect x="380" y="60" width="90" height="34" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="425" y="82" fill="#0F172A" font-family="monospace" text-anchor="middle">bank</text>
    <rect x="380" y="140" width="90" height="34" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="425" y="162" fill="#0F172A" font-family="monospace" text-anchor="middle">original</text>
    <rect x="530" y="45" width="170" height="70" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="615" y="66" fill="#047857" text-anchor="middle">object MỚI</text>
    <text x="615" y="96" fill="#0F172A" font-family="monospace" text-anchor="middle">"Onward Bank"</text>
    <rect x="530" y="130" width="170" height="70" rx="10" fill="#EFF6FF" stroke="#2563EB" stroke-dasharray="5 3"/>
    <text x="615" y="151" fill="#1D4ED8" text-anchor="middle">object cũ, nguyên vẹn</text>
    <text x="615" y="181" fill="#0F172A" font-family="monospace" text-anchor="middle">"Onward"</text>
    <line x1="470" y1="77" x2="524" y2="80" stroke="#047857" stroke-width="2" marker-end="url(#b4-immut-arrow-new)"/>
    <line x1="470" y1="157" x2="524" y2="165" stroke="#64748B" stroke-width="1.5" marker-end="url(#b4-immut-arrow)"/>
    <text x="20" y="236" fill="#64748B">Không có lệnh nào sửa được nội dung của một String.</text>
    <text x="380" y="236" fill="#64748B">"Sửa" thật ra là tạo object mới rồi trỏ biến sang đó.</text>
  </g>
</svg>

```java
public class StringImmutable {
    public static void main(String[] args) {
        String bank = "Onward";            // literal: nằm trong string pool
        String sameBank = "Onward";        // literal giống hệt → dùng lại object cũ

        bank.toUpperCase();                // tạo String mới "ONWARD" rồi... bỏ đi
        System.out.println(bank);          // bank vẫn là "Onward"

        String upper = bank.toUpperCase(); // phải GÁN kết quả mới giữ được
        System.out.println(upper);

        String original = bank;            // giữ lại tham chiếu tới object cũ
        bank = bank + " Bank";             // tạo object MỚI, rồi trỏ bank sang đó
        System.out.println(bank);
        System.out.println(original);      // object cũ không hề bị sửa

        System.out.println(original == sameBank); // cùng một object trong pool?
    }
}
```

**Kết quả khi chạy:**

```text
Onward
ONWARD
Onward Bank
Onward
true
```

**Giải thích từng bước:**

1. `bank` và `sameBank` đều là literal `"Onward"`, nên cùng trỏ tới một object trong pool.
2. `bank.toUpperCase()` không sửa `bank`. Nó trả về một `String` **mới** là `"ONWARD"`.
   Vì không gán cho biến nào, chuỗi mới bị bỏ đi. In `bank` vẫn ra `Onward`.
3. `upper = bank.toUpperCase()` giữ lại chuỗi mới, in ra `ONWARD`.
4. `original = bank` chép **tham chiếu**, không chép chữ. Giờ hai biến cùng trỏ một object.
5. `bank = bank + " Bank"` tạo object mới `"Onward Bank"` rồi cho `bank` trỏ sang.
   `original` vẫn trỏ object cũ, nên in ra `Onward`.
6. `original == sameBank` ra `true`: cả hai vẫn trỏ cùng object `"Onward"` trong pool.

💡 Vì sao Java làm `String` bất biến? Vì chuỗi được dùng chung khắp nơi (pool, tên file, số
tài khoản...). Nếu một chỗ sửa được thì mọi chỗ khác đang dùng chung sẽ bị đổi theo, rất nguy hiểm.

### ⚠️ Lỗi hay gặp

**Gọi method "sửa chuỗi" mà quên gán lại.** Đây là lỗi số 1 của người mới:

```java
public class TrimStrip {
    public static void main(String[] args) {
        String name = " An ";               // em space: khoảng trắng Unicode
        System.out.println(name.trim().length());     // trim chỉ bỏ ký tự <= ' '
        System.out.println(name.strip().length());    // strip hiểu khoảng trắng Unicode

        String input = "  an  ";
        input.strip();                                // quên gán lại!
        System.out.println("[" + input + "]");
        input = input.strip();                        // đúng: gán kết quả
        System.out.println("[" + input + "]");
    }
}
```

```text
4
2
[  an  ]
[an]
```

Code không báo lỗi gì, nhưng `input` vẫn còn khoảng trắng. Cách sửa: luôn viết
`input = input.strip();`. Ví dụ này cũng cho thấy `trim()` không bỏ được khoảng trắng Unicode
như ` ` (chuỗi vẫn dài 4), còn `strip()` (Java 11+) thì bỏ được (còn 2) [5]. Với dữ liệu
người dùng gõ vào, hãy ưu tiên `strip()`.

---

## 2. So sánh chuỗi: `==` hay `equals`?

**Ý tưởng nôm na.** Hai cuốn sổ tiết kiệm in cùng nội dung vẫn là **hai cuốn khác nhau**.
`==` hỏi "có phải **cùng một cuốn** không?" (so sánh tham chiếu). `equals` hỏi "nội dung
**ghi giống nhau** không?". Với chuỗi, gần như lúc nào bạn cũng muốn hỏi câu thứ hai.

<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="So sánh chuỗi. Biến bankCode trỏ tới object VCB trong string pool. Biến fromForm trỏ tới một object VCB khác do new String tạo ra. Toán tử == so sánh hai mũi tên (địa chỉ) nên ra false. Method equals so sánh nội dung từng ký tự V C B nên ra true.">
  <defs>
    <marker id="b4-cmp-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="20" y="40" width="100" height="34" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="70" y="62" fill="#0F172A" font-family="monospace" text-anchor="middle">bankCode</text>
    <rect x="20" y="150" width="100" height="34" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="70" y="172" fill="#0F172A" font-family="monospace" text-anchor="middle">fromForm</text>
    <rect x="200" y="25" width="170" height="64" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="285" y="44" fill="#1D4ED8" text-anchor="middle">object #1 (pool)</text>
    <text x="285" y="74" fill="#0F172A" font-family="monospace" text-anchor="middle">"VCB"</text>
    <rect x="200" y="135" width="170" height="64" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="285" y="154" fill="#64748B" text-anchor="middle">object #2 (new String)</text>
    <text x="285" y="184" fill="#0F172A" font-family="monospace" text-anchor="middle">"VCB"</text>
    <line x1="120" y1="57" x2="194" y2="57" stroke="#64748B" stroke-width="1.5" marker-end="url(#b4-cmp-arrow)"/>
    <line x1="120" y1="167" x2="194" y2="167" stroke="#64748B" stroke-width="1.5" marker-end="url(#b4-cmp-arrow)"/>
    <rect x="420" y="25" width="280" height="80" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="560" y="48" fill="#DC2626" text-anchor="middle" font-family="monospace" font-size="13">bankCode == fromForm</text>
    <text x="560" y="70" fill="#0F172A" text-anchor="middle">So hai mũi tên: #1 khác #2</text>
    <text x="560" y="92" fill="#DC2626" text-anchor="middle" font-weight="bold">→ false</text>
    <rect x="420" y="125" width="280" height="80" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="560" y="148" fill="#047857" text-anchor="middle" font-family="monospace" font-size="13">bankCode.equals(fromForm)</text>
    <text x="560" y="170" fill="#0F172A" text-anchor="middle">So từng ký tự: V=V, C=C, B=B</text>
    <text x="560" y="192" fill="#047857" text-anchor="middle" font-weight="bold">→ true</text>
    <text x="20" y="235" fill="#64748B">Giống hai cuốn sổ tiết kiệm in cùng nội dung: là hai cuốn khác nhau, nhưng ghi giống nhau.</text>
  </g>
</svg>

Để thấy rõ khác biệt, ta cần hai object **khác nhau** có cùng nội dung. Hai literal giống nhau
thì luôn cùng một object trong pool (như phần 1), nên ở đây ta dùng `new String(...)` (ép tạo
object mới) và một chuỗi ghép lúc chương trình chạy.

```java
public class StringCompare {
    public static void main(String[] args) {
        String bankCode = "VCB";                  // literal trong pool
        String fromForm = new String("VCB");      // ép tạo object mới ngoài pool
        String prefix = "VC";
        String built = prefix + "B";              // ghép lúc chạy → object mới

        System.out.println(bankCode == fromForm);       // so sánh địa chỉ
        System.out.println(bankCode == built);          // so sánh địa chỉ
        System.out.println(bankCode.equals(fromForm));  // so sánh nội dung
        System.out.println(bankCode.equals(built));     // so sánh nội dung

        String typed = "vcb";                           // người dùng gõ chữ thường
        System.out.println(bankCode.equals(typed));
        System.out.println(bankCode.equalsIgnoreCase(typed));
    }
}
```

**Kết quả khi chạy:**

```text
false
false
true
true
false
true
```

**Giải thích từng bước:**

1. `bankCode` trỏ object `"VCB"` trong pool. `fromForm` trỏ một object `"VCB"` khác, do
   `new String` tạo ra.
2. `built` được ghép từ biến `prefix` lúc chạy, nên cũng là object mới.
3. `==` so sánh tham chiếu: khác object nên cả hai dòng đầu ra `false`, dù chữ giống hệt.
4. `equals` so sánh từng ký tự: giống nhau nên ra `true`.
5. `equals` phân biệt hoa thường: `"VCB"` khác `"vcb"`. Muốn bỏ qua hoa thường thì dùng
   `equalsIgnoreCase`.

💡 Ngoài đời, chuỗi đến từ bàn phím, file, database hay API đều là object tạo lúc chạy.
Chúng gần như không bao giờ `==` với literal của bạn. Vì vậy quy tắc rất đơn giản:
**so sánh nội dung chuỗi thì luôn dùng `equals`.**

### ⚠️ Lỗi hay gặp

**1. Dùng `==` vì "thử thấy chạy đúng".** Nếu bạn thử `"VCB" == "VCB"` hoặc `"VC" + "B" == "VCB"`
thì đều ra `true`, vì trình biên dịch tự ghép hai literal thành một literal trong pool [4].
Bạn tưởng `==` đúng, rồi lên production với dữ liệu thật thì sai. Đừng tin vào lần thử đó.

**2. Gọi `equals` trên một biến đang là `null`.** `null` nghĩa là biến chưa trỏ tới object nào.

```java
public class NullEquals {
    public static void main(String[] args) {
        String status = null;                        // chưa có dữ liệu
        System.out.println("ACTIVE".equals(status)); // an toàn: in false
        System.out.println(status.equals("ACTIVE")); // gọi method trên null!
    }
}
```

```text
false
Exception in thread "main" java.lang.NullPointerException: Cannot invoke "String.equals(Object)" because "<local1>" is null
	at NullEquals.main(NullEquals.java:5)
```

Chương trình dừng với một **exception** (*ngoại lệ*: lỗi xảy ra lúc chạy làm chương trình dừng;
chặng sau sẽ học cách xử lý). `<local1>` là biến cục bộ số 1, tức `status`. (Nếu biên dịch
bằng `javac -g`, thông báo sẽ ghi đúng tên `"status"`.) Cách sửa: đặt literal ở bên trái,
`"ACTIVE".equals(status)`, vì literal không bao giờ là `null`.

---

## 3. Các method hay dùng của String

**Ý tưởng nôm na.** Một `String` giống một dải ô gửi đồ đánh số, mỗi ô chứa một ký tự.
Ô đầu tiên là **số 0**, không phải số 1. Các method của `String` cho bạn đếm số ô, lấy một ô,
cắt một đoạn ô, tìm vị trí... Mọi method "biến đổi" đều trả về chuỗi **mới** (nhớ phần 1).

<svg viewBox="0 0 720 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chỉ số trong chuỗi accountNo = 1903582746. Mỗi ký tự có vị trí từ 0 đến 9, length bằng 10. charAt(0) là ký tự 1. substring(6) lấy từ vị trí 6 đến hết, được 2746. Ghép với **** thành **** 2746.">
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <text x="20" y="30" fill="#0F172A" text-anchor="start" font-family="monospace" font-size="13">accountNo = "1903582746"   length() = 10</text>
    <g font-family="monospace" font-size="14">
      <rect x="20"  y="55" width="50" height="40" fill="#F8FAFC" stroke="#94A3B8"/><text x="45" y="81" fill="#0F172A">1</text>
      <rect x="70"  y="55" width="50" height="40" fill="#F8FAFC" stroke="#94A3B8"/><text x="95" y="81" fill="#0F172A">9</text>
      <rect x="120" y="55" width="50" height="40" fill="#F8FAFC" stroke="#94A3B8"/><text x="145" y="81" fill="#0F172A">0</text>
      <rect x="170" y="55" width="50" height="40" fill="#F8FAFC" stroke="#94A3B8"/><text x="195" y="81" fill="#0F172A">3</text>
      <rect x="220" y="55" width="50" height="40" fill="#F8FAFC" stroke="#94A3B8"/><text x="245" y="81" fill="#0F172A">5</text>
      <rect x="270" y="55" width="50" height="40" fill="#F8FAFC" stroke="#94A3B8"/><text x="295" y="81" fill="#0F172A">8</text>
      <rect x="320" y="55" width="50" height="40" fill="#ECFDF5" stroke="#10B981"/><text x="345" y="81" fill="#047857">2</text>
      <rect x="370" y="55" width="50" height="40" fill="#ECFDF5" stroke="#10B981"/><text x="395" y="81" fill="#047857">7</text>
      <rect x="420" y="55" width="50" height="40" fill="#ECFDF5" stroke="#10B981"/><text x="445" y="81" fill="#047857">4</text>
      <rect x="470" y="55" width="50" height="40" fill="#ECFDF5" stroke="#10B981"/><text x="495" y="81" fill="#047857">6</text>
    </g>
    <text x="45"  y="114" fill="#64748B">0</text><text x="95"  y="114" fill="#64748B">1</text>
    <text x="145" y="114" fill="#64748B">2</text><text x="195" y="114" fill="#64748B">3</text>
    <text x="245" y="114" fill="#64748B">4</text><text x="295" y="114" fill="#64748B">5</text>
    <text x="345" y="114" fill="#047857">6</text><text x="395" y="114" fill="#047857">7</text>
    <text x="445" y="114" fill="#047857">8</text><text x="495" y="114" fill="#047857">9</text>
    <text x="580" y="114" fill="#64748B" text-anchor="start">← chỉ số (index)</text>
    <text x="20" y="140" fill="#2563EB" font-family="monospace" text-anchor="start">charAt(0) = '1'</text>
    <path d="M320,130 L320,140 L520,140 L520,130" fill="none" stroke="#047857" stroke-width="1.5"/>
    <text x="420" y="160" fill="#047857" font-family="monospace">substring(6) = "2746"</text>
    <rect x="540" y="160" width="160" height="38" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="620" y="184" fill="#1D4ED8" font-family="monospace" font-size="14">**** 2746</text>
    <text x="20" y="192" fill="#64748B" text-anchor="start">Chỉ số bắt đầu từ 0, nên ký tự cuối ở vị trí length() - 1.</text>
  </g>
</svg>

Ví dụ thật ở ngân hàng: chuẩn hoá tên chủ tài khoản người dùng gõ lộn xộn, và che số tài khoản
chỉ để lộ 4 số cuối.

```java
public class AccountFormatter {
    public static void main(String[] args) {
        String rawName = "   nguyễn   văn  an  ";    // người dùng gõ thừa khoảng trắng
        String accountNo = "1903582746";

        String trimmed = rawName.strip();            // bỏ khoảng trắng hai đầu
        String[] parts = trimmed.split("\\s+");      // tách theo 1+ khoảng trắng
        String joined = String.join(" ", parts);     // nối lại, mỗi chữ cách 1 dấu cách
        String holder = joined.toUpperCase();        // in hoa như trên thẻ
        System.out.println("[" + holder + "]");

        int len = accountNo.length();                // 10 ký tự
        String last4 = accountNo.substring(len - 4); // từ vị trí 6 đến hết
        String masked = "*".repeat(4) + " " + last4;
        System.out.println(masked);
    }
}
```

**Kết quả khi chạy:**

```text
[NGUYỄN VĂN AN]
**** 2746
```

**Giải thích từng bước:**

1. `strip()` bỏ khoảng trắng ở hai đầu: còn `"nguyễn   văn  an"`.
2. `split("\\s+")` cắt chuỗi thành nhiều mảnh tại mỗi cụm khoảng trắng. Tham số là một
   **biểu thức chính quy** (*regular expression*, gọi tắt *regex*): `\s` là "một khoảng trắng",
   `+` là "một hoặc nhiều". Trong code Java phải viết `\\s` vì `\` cần thoát. Kết quả là một
   **mảng** (*array*) gồm `nguyễn`, `văn`, `an` (bài 5 học kỹ mảng).
3. `String.join(" ", parts)` nối các mảnh, chèn đúng một dấu cách giữa chúng. Đây là method
   gọi qua tên class `String`, không cần object có sẵn.
4. `toUpperCase()` đổi sang chữ in hoa, kể cả chữ có dấu tiếng Việt.
5. `length()` trả về 10. `substring(6)` lấy từ chỉ số 6 đến hết: `"2746"`.
6. `"*".repeat(4)` (Java 11+) lặp chuỗi 4 lần thành `"****"`, ghép thêm dấu cách và 4 số cuối.

Còn nhiều method khác. Chạy thử đoạn này với một nội dung chuyển khoản:

```java
public class StringMethodsTour {
    public static void main(String[] args) {
        String memo = "CK tien nha thang 9";       // nội dung chuyển khoản

        System.out.println(memo.length());           // số ký tự
        System.out.println(memo.charAt(0));          // ký tự ở vị trí 0
        System.out.println(memo.indexOf("nha"));     // vị trí đầu tiên của "nha"
        System.out.println(memo.indexOf("xe"));      // không có → -1
        System.out.println(memo.contains("tien"));   // có chứa không?
        System.out.println(memo.startsWith("CK"));   // có bắt đầu bằng "CK"?
        System.out.println(memo.substring(3, 7));    // từ 3 đến TRƯỚC 7
        System.out.println(memo.replace(" ", "_"));  // thay mọi dấu cách

        String blank = "   ";
        System.out.println(blank.isEmpty());         // length() == 0?
        System.out.println(blank.isBlank());         // rỗng hoặc toàn khoảng trắng?
    }
}
```

**Kết quả khi chạy:**

```text
19
C
8
-1
true
true
tien
CK_tien_nha_thang_9
false
true
```

Bảng tra nhanh [5]:

| Method | Trả về | Ghi nhớ |
|--------|--------|---------|
| `length()` | `int` | số ký tự |
| `charAt(i)` | `char` | ký tự ở chỉ số `i` (từ 0) |
| `substring(a, b)` | `String` | từ `a` đến **trước** `b`; bỏ `b` thì lấy đến hết |
| `indexOf(s)` | `int` | vị trí đầu tiên, không thấy thì `-1` |
| `contains`, `startsWith` | `boolean` | có chứa / có bắt đầu bằng |
| `toUpperCase`, `strip`, `replace` | `String` | luôn là chuỗi **mới** |
| `isEmpty`, `isBlank` | `boolean` | rỗng / rỗng hoặc toàn khoảng trắng (Java 11+) |
| `split(regex)` | `String[]` | tham số là **regex** |
| `String.join(sep, ...)`, `repeat(n)` | `String` | nối có dấu ngăn / lặp `n` lần |

### ⚠️ Lỗi hay gặp

**1. Cắt chuỗi vượt giới hạn.** Dữ liệu thật đôi khi ngắn hơn bạn nghĩ:

```java
public class SubstringError {
    public static void main(String[] args) {
        String accountNo = "123";                       // dữ liệu ngắn bất thường
        String last4 = accountNo.substring(accountNo.length() - 4);
        System.out.println(last4);
    }
}
```

```text
Exception in thread "main" java.lang.StringIndexOutOfBoundsException: Range [-1, 3) out of bounds for length 3
	at java.base/jdk.internal.util.Preconditions$1.apply(Preconditions.java:55)
	...
	at java.base/java.lang.String.substring(String.java:2807)
	at SubstringError.main(SubstringError.java:4)
```

`3 - 4 = -1`, mà chỉ số không được âm. Cách sửa: kiểm tra `length()` trước khi cắt
(câu lệnh `if` học ở bài 5).

**2. `split(".")` ra mảng rỗng.** Vì tham số là regex, và trong regex dấu `.` nghĩa là
"**mọi** ký tự":

```java
public class SplitDot {
    public static void main(String[] args) {
        String ip = "10.0.0.1";
        System.out.println(ip.split(".").length);   // "." trong regex = mọi ký tự
        System.out.println(ip.split("\\.").length); // thoát dấu chấm → đúng 4 phần
    }
}
```

```text
0
4
```

Cách sửa: thoát dấu chấm thành `"\\."`. Các ký tự đặc biệt khác cũng cần thoát: `| + * ? ( ) [ ] $ ^`.

---

## 4. Ghép chuỗi và định dạng

**Ý tưởng nôm na.** Ghép vài chuỗi bằng `+` giống viết vài dòng lên giấy, rất tiện. Nhưng nếu
phải ghép hàng trăm lần (như in sao kê cả năm), mỗi lần `+` lại "in một tờ mới" và chép lại hết
nội dung cũ. **`StringBuilder`** thì như một bảng nháp: bạn cứ viết nối thêm vào cuối, xong
mới chép ra một tờ duy nhất [6].

<svg viewBox="0 0 720 250" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ghép chuỗi nhiều lần. Bên trái: dùng dấu cộng trong vòng lặp, mỗi vòng tạo một String mới và chép lại toàn bộ nội dung cũ: Sao kê:, Sao kê: T1, Sao kê: T1 T2, Sao kê: T1 T2 T3, các bản cũ thành rác. Bên phải: StringBuilder giữ một bộ đệm duy nhất, append nối thêm vào cuối, cuối cùng toString tạo đúng một String.">
  <defs>
    <marker id="b4-sb-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="20" y="24" fill="#DC2626" font-size="13" font-weight="bold">s = s + ...  (trong vòng lặp)</text>
    <text x="380" y="24" fill="#047857" font-size="13" font-weight="bold">StringBuilder.append(...)</text>
    <line x1="355" y1="10" x2="355" y2="240" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <g font-family="monospace">
      <rect x="20" y="40" width="300" height="30" rx="5" fill="#F8FAFC" stroke="#94A3B8" stroke-dasharray="4 3"/>
      <text x="32" y="60" fill="#94A3B8">"Sao kê:"</text>
      <rect x="20" y="80" width="300" height="30" rx="5" fill="#F8FAFC" stroke="#94A3B8" stroke-dasharray="4 3"/>
      <text x="32" y="100" fill="#94A3B8">"Sao kê: T1"</text>
      <rect x="20" y="120" width="300" height="30" rx="5" fill="#F8FAFC" stroke="#94A3B8" stroke-dasharray="4 3"/>
      <text x="32" y="140" fill="#94A3B8">"Sao kê: T1 T2"</text>
      <rect x="20" y="160" width="300" height="30" rx="5" fill="#FEF2F2" stroke="#DC2626"/>
      <text x="32" y="180" fill="#0F172A">"Sao kê: T1 T2 T3"</text>
    </g>
    <text x="310" y="60" fill="#94A3B8" text-anchor="end">rác</text>
    <text x="310" y="100" fill="#94A3B8" text-anchor="end">rác</text>
    <text x="310" y="140" fill="#94A3B8" text-anchor="end">rác</text>
    <text x="20" y="215" fill="#64748B">Mỗi vòng: tạo String mới + chép lại hết chữ cũ.</text>
    <text x="20" y="232" fill="#64748B">n vòng → n object, chép đi chép lại rất nhiều.</text>
    <rect x="380" y="50" width="320" height="56" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="392" y="68" fill="#047857">một bộ đệm duy nhất (sửa được)</text>
    <text x="392" y="94" fill="#0F172A" font-family="monospace">Sao kê: T1 T2 T3</text>
    <text x="590" y="94" fill="#047857" font-family="monospace">← append</text>
    <line x1="540" y1="106" x2="540" y2="150" stroke="#64748B" stroke-width="1.5" marker-end="url(#b4-sb-arrow)"/>
    <text x="550" y="133" fill="#64748B" font-family="monospace">toString()</text>
    <rect x="380" y="156" width="320" height="34" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="392" y="178" fill="#0F172A" font-family="monospace">"Sao kê: T1 T2 T3"</text>
    <text x="680" y="178" fill="#1D4ED8" text-anchor="end">1 String</text>
    <text x="380" y="215" fill="#64748B">Nối thêm vào cuối cùng một chỗ.</text>
    <text x="380" y="232" fill="#64748B">Chỉ tạo String khi gọi toString().</text>
  </g>
</svg>

```java
public class ConcatDemo {
    public static void main(String[] args) {
        String name = "An";
        long balance = 1500000;                       // số dư, tính bằng đồng
        String line = "Chào " + name + ", số dư: " + balance + " đ";
        System.out.println(line);

        StringBuilder sb = new StringBuilder();       // "bảng nháp" sửa được
        sb.append("Sao kê:");
        for (int month = 1; month <= 3; month++) {    // vòng lặp: bài 5 học kỹ
            sb.append(" T").append(month);            // nối thêm vào CÙNG một object
        }
        String statement = sb.toString();             // chốt lại thành String
        System.out.println(statement);
    }
}
```

**Kết quả khi chạy:**

```text
Chào An, số dư: 1500000 đ
Sao kê: T1 T2 T3
```

**Giải thích từng bước:**

1. Dấu `+` với một vế là `String` sẽ **ghép chuỗi**. Số `balance` tự đổi thành chữ `"1500000"`.
2. `new StringBuilder()` tạo một bảng nháp rỗng. Khác `String`, `StringBuilder` **sửa được**.
3. Vòng `for` chạy 3 lần với `month` = 1, 2, 3 (bài 5 học kỹ). Mỗi lần, `append` nối thêm
   `" T"` rồi nối số tháng vào cuối **cùng một** object. `append` trả về chính `sb`, nên ta
   gọi nối tiếp `.append(...).append(...)` được.
4. `toString()` tạo ra một `String` cuối cùng từ nội dung bảng nháp.

Quy tắc thực tế: ghép vài chuỗi trên một dòng thì dùng `+` cho dễ đọc. Ghép trong **vòng lặp**
thì dùng `StringBuilder`.

### Định dạng: `String.format`, `formatted`, `printf`, text block

Khi cần căn cột, thêm dấu ngăn nghìn, giữ 2 chữ số lẻ, hãy dùng **chuỗi định dạng** (*format
string*): một khuôn mẫu có các chỗ trống như `%d` (số nguyên), `%s` (chuỗi), `%.2f` (số thực
2 chữ số lẻ), `%n` (xuống dòng) [14]. **Text block** (Java 15+) là chuỗi nhiều dòng, mở và đóng
bằng ba dấu nháy `"""` [10].

```java
import java.util.Locale;

public class FormatDemo {
    public static void main(String[] args) {
        Locale vn = Locale.of("vi", "VN");             // định dạng kiểu Việt Nam
        long amount = 1500000;
        double rate = 5.5;

        String a = String.format(vn, "Số tiền: %,d đ", amount);
        System.out.println(a);

        String b = "Lãi suất: %.2f%%/năm".formatted(rate); // %% in ra dấu %
        System.out.println(b);

        System.out.printf("%-8s|%10s|%n", "Mã", "Trạng thái"); // căn trái/phải
        System.out.printf("%-8s|%10s|%n", "TX01", "OK");

        String receipt = """
                ONWARD BANK
                  Người nhận: %s
                  Số tiền:    %s
                """.formatted("NGUYEN VAN AN", "500.000 đ");
        System.out.print(receipt);
    }
}
```

**Kết quả khi chạy:**

```text
Số tiền: 1.500.000 đ
Lãi suất: 5.50%/năm
Mã      |Trạng thái|
TX01    |        OK|
ONWARD BANK
  Người nhận: NGUYEN VAN AN
  Số tiền:    500.000 đ
```

**Giải thích từng bước:**

1. `import java.util.Locale;` cho phép dùng class `Locale` ở thư viện chuẩn. **Locale** là
   "quy ước vùng miền": người Việt viết `1.500.000`, người Mỹ viết `1,500,000`.
   `Locale.of` có từ Java 19.
2. `%,d`: số nguyên có dấu ngăn nghìn theo locale `vn`, nên ra `1.500.000`.
3. `"...".formatted(rate)` (Java 15+) giống `String.format` nhưng gọi trên chính chuỗi khuôn.
   `%.2f` giữ 2 chữ số lẻ: `5.50`. Muốn in dấu `%` thật thì viết `%%`.
4. `printf` định dạng rồi in luôn. `%-8s` là chuỗi rộng 8 ô, căn trái; `%10s` rộng 10 ô, căn phải.
5. Text block: Java tự bỏ phần thụt lề chung của các dòng, giữ lại phần thụt thêm (2 dấu cách
   trước "Người nhận"). Text block kết thúc bằng một dấu xuống dòng, nên ta dùng `print`.

💡 Dòng 2 không truyền locale nên dùng locale của máy. Máy cài tiếng Việt có thể in `5,50`.
Khi cần kết quả cố định (báo cáo, file gửi đối tác), hãy truyền locale rõ ràng.

### ⚠️ Lỗi hay gặp

**1. Ghép chuỗi với số mà quên ngoặc.** Java tính `+` từ trái sang phải:

```java
public class ConcatOrder {
    public static void main(String[] args) {
        int fee = 1;
        int vat = 2;
        System.out.println("Tổng phí: " + fee + vat);   // ghép chuỗi từ trái sang phải
        System.out.println("Tổng phí: " + (fee + vat)); // ngoặc → cộng số trước
        System.out.println(fee + vat + " là tổng phí");  // số + số trước, rồi mới ghép
    }
}
```

```text
Tổng phí: 12
Tổng phí: 3
3 là tổng phí
```

Dòng đầu: `"Tổng phí: " + 1` thành chuỗi `"Tổng phí: 1"`, rồi ghép tiếp `2` thành `...12`.
Cách sửa: bọc phép cộng số trong ngoặc.

**2. Sai kiểu trong chuỗi định dạng.** `%d` chỉ nhận số nguyên:

```java
public class FormatWrong {
    public static void main(String[] args) {
        double rate = 5.5;
        System.out.println(String.format("Lãi: %d%%", rate)); // %d chỉ dành cho số nguyên
    }
}
```

```text
Exception in thread "main" java.util.IllegalFormatConversionException: d != java.lang.Double
	at java.base/java.util.Formatter$FormatSpecifier.failConversion(Formatter.java:4515)
	...
	at FormatWrong.main(FormatWrong.java:4)
```

Cách sửa: dùng `%f` hoặc `%.2f` cho `double`, `%d` cho `int`/`long`, `%s` cho chuỗi.

---

## 5. Toán tử số học

**Ý tưởng nôm na.** **Toán tử** (*operator*) là ký hiệu phép tính: `+ - * / %`. Phần lớn giống
toán phổ thông, trừ một điểm: khi **cả hai vế đều là số nguyên**, phép chia `/` giống máy ATM
chỉ nhả tờ chẵn: phần lẻ bị bỏ đi, không làm tròn. `%` (*modulo*, chia lấy dư) cho bạn biết
phần lẻ còn lại là bao nhiêu.

<svg viewBox="0 0 720 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Hai quy tắc của phép toán số nguyên. Bên trái: biểu thức 2 + 3 * 4, phép nhân 3 * 4 = 12 được tính trước, sau đó 2 + 12 = 14. Bên phải: trục số, -7 / 2 về mặt toán là -3.5; Java cắt bỏ phần lẻ về phía số 0 nên ra -3, không phải -4. Phần dư -7 % 2 = -1, vì -3 * 2 + (-1) = -7.">
  <defs>
    <marker id="b4-arith-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#047857"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <text x="20" y="24" fill="#0F172A" font-size="13" font-weight="bold" text-anchor="start">Thứ tự ưu tiên: 2 + 3 * 4</text>
    <rect x="125" y="40" width="60" height="34" rx="17" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="155" y="62" fill="#1D4ED8" font-family="monospace" font-size="14">+</text>
    <line x1="140" y1="74" x2="85" y2="110" stroke="#94A3B8"/>
    <line x1="170" y1="74" x2="225" y2="110" stroke="#94A3B8"/>
    <rect x="55" y="110" width="60" height="34" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="85" y="132" fill="#0F172A" font-family="monospace" font-size="14">2</text>
    <rect x="195" y="110" width="60" height="34" rx="17" fill="#ECFDF5" stroke="#10B981"/>
    <text x="225" y="132" fill="#047857" font-family="monospace" font-size="14">*</text>
    <line x1="210" y1="144" x2="175" y2="175" stroke="#94A3B8"/>
    <line x1="240" y1="144" x2="275" y2="175" stroke="#94A3B8"/>
    <rect x="150" y="175" width="50" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="175" y="195" fill="#0F172A" font-family="monospace" font-size="14">3</text>
    <rect x="250" y="175" width="50" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="275" y="195" fill="#0F172A" font-family="monospace" font-size="14">4</text>
    <text x="300" y="132" fill="#047857" text-anchor="start">① 12</text>
    <text x="200" y="62" fill="#1D4ED8" text-anchor="start">② 2 + 12 = 14</text>
    <text x="20" y="230" fill="#64748B" text-anchor="start">Nhánh sâu hơn được tính trước.</text>
    <line x1="355" y1="10" x2="355" y2="230" stroke="#94A3B8" stroke-dasharray="4 4"/>
    <text x="380" y="24" fill="#0F172A" font-size="13" font-weight="bold" text-anchor="start">Chia nguyên: -7 / 2</text>
    <line x1="390" y1="120" x2="700" y2="120" stroke="#64748B" stroke-width="1.5"/>
    <line x1="410" y1="114" x2="410" y2="126" stroke="#64748B"/><text x="410" y="144" fill="#64748B">-4</text>
    <line x1="480" y1="114" x2="480" y2="126" stroke="#64748B"/><text x="480" y="144" fill="#047857" font-weight="bold">-3</text>
    <line x1="550" y1="114" x2="550" y2="126" stroke="#64748B"/><text x="550" y="144" fill="#64748B">-2</text>
    <line x1="620" y1="114" x2="620" y2="126" stroke="#64748B"/><text x="620" y="144" fill="#64748B">-1</text>
    <line x1="690" y1="110" x2="690" y2="130" stroke="#0F172A" stroke-width="2"/><text x="690" y="144" fill="#0F172A" font-weight="bold">0</text>
    <circle cx="445" cy="120" r="6" fill="#D97706"/>
    <text x="445" y="166" fill="#D97706">-3.5 (toán học)</text>
    <path d="M451,112 Q462,80 476,112" fill="none" stroke="#047857" stroke-width="1.5" marker-end="url(#b4-arith-arrow)"/>
    <text x="490" y="100" fill="#047857" text-anchor="start">cắt về phía 0 → -3</text>
    <text x="380" y="192" fill="#0F172A" text-anchor="start" font-family="monospace">-7 / 2 = -3</text>
    <text x="530" y="192" fill="#0F172A" text-anchor="start" font-family="monospace">-7 % 2 = -1</text>
    <text x="380" y="211" fill="#64748B" text-anchor="start">Kiểm tra: (-3) * 2 + (-1) = -7</text>
    <text x="380" y="230" fill="#64748B" text-anchor="start">Dấu của % đi theo số bị chia (-7).</text>
  </g>
</svg>

```java
public class ArithmeticDemo {
    public static void main(String[] args) {
        System.out.println(7 / 2);          // int / int → chia nguyên, bỏ phần lẻ
        System.out.println(7 % 2);          // phần dư
        System.out.println(7.0 / 2);        // có một số double → chia thực
        System.out.println(-7 / 2);         // cắt về phía 0, không phải làm tròn xuống
        System.out.println(-7 % 2);         // dấu của kết quả theo số bị chia
        System.out.println(7 % -2);
        System.out.println(2 + 3 * 4);      // * làm trước +
        System.out.println((2 + 3) * 4);    // ngoặc làm trước

        long balance = 1000000;
        balance += 250000;                  // balance = balance + 250000
        balance -= 50000;
        System.out.println(balance);
    }
}
```

**Kết quả khi chạy:**

```text
3
1
3.5
-3
-1
1
14
20
1200000
```

**Giải thích từng bước:**

1. `7 / 2`: hai số `int` nên chia nguyên, ra `3`. `7 % 2` là phần dư `1`.
2. `7.0 / 2`: có một vế là `double` nên vế kia được nâng lên `double` (bài 3), ra `3.5`.
3. `-7 / 2`: toán học ra `-3.5`. Java **cắt về phía 0** thành `-3`, không phải `-4` [7].
4. `-7 % 2` ra `-1`, `7 % -2` ra `1`: dấu của phần dư luôn theo **số bị chia** (vế trái) [7].
   Luôn đúng đẳng thức `(a / b) * b + (a % b) == a`.
5. **Thứ tự ưu tiên** (*precedence*): `* / %` làm trước `+ -`. Cùng mức thì từ trái sang phải.
   Không chắc thì cứ thêm ngoặc cho rõ.
6. `balance += 250000` là cách viết gọn của `balance = balance + 250000`. Tương tự có
   `-=`, `*=`, `/=`, `%=`.

### Tăng/giảm 1: `++` tiền tố và hậu tố

`x++` và `++x` đều tăng `x` thêm 1. Khác nhau ở **giá trị của cả biểu thức**:

```java
public class IncrementDemo {
    public static void main(String[] args) {
        int a = 5;
        int b = a++;     // hậu tố: lấy giá trị CŨ (5) gán cho b, rồi mới tăng a
        System.out.println("a = " + a + ", b = " + b);

        int c = 5;
        int d = ++c;     // tiền tố: tăng c TRƯỚC, rồi lấy giá trị MỚI (6)
        System.out.println("c = " + c + ", d = " + d);
    }
}
```

```text
a = 6, b = 5
c = 6, d = 6
```

Khi `++` đứng một mình trên một dòng (`count++;`) thì hai cách như nhau. Đừng nhét `++` vào
giữa biểu thức phức tạp, vì người đọc sau rất dễ hiểu sai.

### ⚠️ Lỗi hay gặp

**1. Tính phần trăm bằng số nguyên ra 0.**

```java
public class IntPercentBug {
    public static void main(String[] args) {
        long amount = 2000000;
        long wrongFee = 5 / 100 * amount;   // 5 / 100 = 0 (chia nguyên) → 0 * amount
        long rightFee = amount * 5 / 100;   // nhân trước, chia sau
        System.out.println(wrongFee);
        System.out.println(rightFee);
    }
}
```

```text
0
100000
```

`5 / 100` là chia nguyên nên bằng `0`, nhân gì cũng ra `0`. Cách sửa tạm: nhân trước rồi
chia sau. Cách đúng cho tiền: dùng `BigDecimal` (phần 7).

**2. Chia số nguyên cho 0.**

```java
public class DivideByZero {
    public static void main(String[] args) {
        System.out.println(10.0 / 0);       // double: ra Infinity, không lỗi
        int months = 0;
        System.out.println(1200000 / months); // int: chia cho 0 → exception
    }
}
```

```text
Infinity
Exception in thread "main" java.lang.ArithmeticException: / by zero
	at DivideByZero.main(DivideByZero.java:5)
```

Số nguyên chia cho 0 ném `ArithmeticException`. Số `double` chia cho 0 thì **không** báo lỗi
mà ra `Infinity` (vô cực), còn nguy hiểm hơn vì lỗi bị giấu đi. Hãy kiểm tra số chia trước khi chia.

---

## 6. Class `Math` và tràn số

**Ý tưởng nôm na.** **`Math`** là "hộp máy tính" có sẵn trong Java: lấy trị tuyệt đối, so lớn
nhỏ, luỹ thừa, căn bậc hai, làm tròn [8]. Bạn gọi thẳng qua tên class, như `Math.max(a, b)`,
không cần tạo gì cả. Nhưng nhớ rằng mỗi kiểu số có **sức chứa** giới hạn, như đồng hồ
công-tơ-mét xe máy: chạy quá số lớn nhất thì quay về số nhỏ nhất.

<svg viewBox="0 0 720 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tràn số int. Kiểu int giữ được từ -2147483648 (Integer.MIN_VALUE) đến 2147483647 (Integer.MAX_VALUE). Cộng 1 vào MAX_VALUE thì giá trị vòng ngược về MIN_VALUE, giống đồng hồ công-tơ-mét quay về đầu, và Java không báo lỗi. Math.addExact thì ném ArithmeticException: integer overflow thay vì vòng lại.">
  <defs>
    <marker id="b4-ovf-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <text x="360" y="24" fill="#0F172A" font-size="13" font-weight="bold">Miền giá trị của int (32 bit)</text>
    <rect x="80" y="90" width="560" height="30" rx="4" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="360" y="110" fill="#1D4ED8">..., -1, 0, 1, ...</text>
    <text x="80" y="140" fill="#0F172A" font-family="monospace">-2147483648</text>
    <text x="80" y="156" fill="#64748B">MIN_VALUE</text>
    <text x="640" y="140" fill="#0F172A" font-family="monospace">2147483647</text>
    <text x="640" y="156" fill="#64748B">MAX_VALUE</text>
    <path d="M640,88 C640,62 80,62 80,86" fill="none" stroke="#DC2626" stroke-width="1.8" stroke-dasharray="6 4" marker-end="url(#b4-ovf-arrow)"/>
    <text x="360" y="50" fill="#DC2626">MAX_VALUE + 1 → vòng về MIN_VALUE, không báo lỗi</text>
    <rect x="80" y="178" width="270" height="40" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="215" y="196" fill="#DC2626" font-family="monospace">max + 1</text>
    <text x="215" y="211" fill="#0F172A">ra -2147483648 (sai lặng lẽ)</text>
    <rect x="370" y="178" width="270" height="40" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="505" y="196" fill="#047857" font-family="monospace">Math.addExact(max, 1)</text>
    <text x="505" y="211" fill="#0F172A">ném ArithmeticException (lỗi rõ ràng)</text>
  </g>
</svg>

```java
public class MathDemo {
    public static void main(String[] args) {
        System.out.println(Math.abs(-250000));      // giá trị tuyệt đối
        System.out.println(Math.max(300, 500));     // số lớn hơn
        System.out.println(Math.min(300, 500));     // số nhỏ hơn
        System.out.println(Math.pow(1.05, 2));      // 1.05 mũ 2, trả về double
        System.out.println(Math.sqrt(144));         // căn bậc hai, trả về double
        System.out.println(Math.round(2.5));        // làm tròn, trả về long
        System.out.println(Math.round(-2.5));       // chú ý số âm!
        System.out.println(Math.floor(2.7));        // làm tròn xuống
        System.out.println(Math.ceil(2.1));         // làm tròn lên
        System.out.println(Math.floor(-2.7));       // "xuống" là về phía âm vô cực
    }
}
```

**Kết quả khi chạy:**

```text
250000
500
300
1.1025
12.0
3
-2
2.0
3.0
-3.0
```

**Giải thích từng bước:**

1. `abs`, `max`, `min` giữ nguyên kiểu đầu vào: đưa `int` vào thì trả `int`.
2. `pow` và `sqrt` luôn trả về `double`, nên in `12.0` chứ không phải `12`.
3. `Math.round(2.5)` ra `3`, nhưng `Math.round(-2.5)` ra `-2`: khi đúng ở giữa, `round` làm
   tròn **về phía dương vô cực** [8]. Kết quả là `long` (với đầu vào `double`).
4. `floor` làm tròn xuống, `ceil` làm tròn lên, đều trả về `double`. "Xuống" nghĩa là về phía
   âm, nên `floor(-2.7)` là `-3.0`.

### Tràn số và `Math.addExact`

`int` chỉ chứa được từ `-2147483648` đến `2147483647`. Vượt quá thì Java **không** báo lỗi gì
mà âm thầm "quay vòng" [13]. Các method `Math.addExact`, `subtractExact`, `multiplyExact` thì
ném exception khi tràn, giúp lỗi lộ ra ngay [8].

```java
public class OverflowDemo {
    public static void main(String[] args) {
        int max = Integer.MAX_VALUE;                // 2147483647
        int silent = max + 1;                       // tràn số: KHÔNG báo lỗi
        System.out.println(silent);

        long big = 3_000_000_000L;
        System.out.println(Math.multiplyExact(big, 3)); // vừa trong long → OK
        System.out.println(Math.addExact(max, 1));      // tràn int → ném exception
    }
}
```

**Kết quả khi chạy:**

```text
-2147483648
9000000000
Exception in thread "main" java.lang.ArithmeticException: integer overflow
	at java.base/java.lang.Math.addExact(Math.java:911)
	at OverflowDemo.main(OverflowDemo.java:9)
```

**Giải thích từng bước:**

1. `max + 1` vượt sức chứa `int`, quay vòng thành số âm nhỏ nhất. Không có cảnh báo nào.
   Với số dư tài khoản, đây là lỗi cực kỳ nguy hiểm.
2. `Math.multiplyExact(big, 3)` với `long`: 9 tỷ vẫn vừa trong `long`, nên chạy bình thường.
3. `Math.addExact(max, 1)` phát hiện tràn và ném `ArithmeticException: integer overflow`.
   Chương trình dừng, nhưng thà dừng còn hơn ghi sai số tiền.

### ⚠️ Lỗi hay gặp

**1. Tin rằng `Math.abs` luôn trả về số dương.**

```java
public class AbsMin {
    public static void main(String[] args) {
        System.out.println(Math.abs(Integer.MIN_VALUE)); // -2147483648 không có số dương tương ứng
    }
}
```

```text
-2147483648
```

`int` có một số âm nhiều hơn số dương, nên `-2147483648` không có bản dương. `abs` trả lại
chính nó, vẫn âm [8]. Cần chắc chắn thì dùng `Math.absExact` (Java 15+), nó ném exception.

**2. Dùng `Math.round` để làm tròn tiền.** `round` chỉ làm tròn về số nguyên, đầu vào là
`double` (vốn đã sai số, xem phần 7) và quy tắc với số âm như trên. Tiền thì dùng `BigDecimal`
với `RoundingMode` rõ ràng.

---

## 7. Tiền tệ: vì sao dùng `BigDecimal` thay cho `double`

**Ý tưởng nôm na.** `double` lưu số bằng **hệ nhị phân** (cơ số 2). Có những số rất "tròn" trong
hệ 10 như `0.1` lại là số lặp vô hạn trong hệ 2, giống `1/3 = 0.333...` trong hệ 10. Máy phải
cắt bớt, nên `double` chỉ giữ giá trị **gần đúng**. Với tiền, lệch 1 đồng cũng là sai sổ sách.
**`BigDecimal`** lưu số theo hệ 10, nên `0.1` là đúng `0.1` [9].

<svg viewBox="0 0 720 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vì sao double sai với tiền. Số 0.1 trong hệ nhị phân là 0.000110011001100... lặp vô hạn. double chỉ có 52 bit phần lẻ nên phải cắt, giá trị thật được lưu là 0.1000000000000000055511151231257827021181583404541015625, nên 0.1 + 0.2 ra 0.30000000000000004. BigDecimal lưu một số nguyên 1 cùng scale 1, nghĩa là 1 nhân 10 mũ trừ 1, đúng bằng 0.1.">
  <g font-family="sans-serif" font-size="12">
    <rect x="20" y="15" width="680" height="135" rx="10" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="36" y="38" fill="#DC2626" font-size="13" font-weight="bold">double 0.1: lưu bằng hệ nhị phân (cơ số 2)</text>
    <text x="36" y="64" fill="#0F172A" font-family="monospace">0.1 (thập phân) = 0.0001100110011001100110011... (nhị phân)</text>
    <text x="36" y="84" fill="#64748B">Đuôi "0011" lặp mãi, như 1/3 = 0.333... trong hệ 10.</text>
    <text x="36" y="104" fill="#64748B">double chỉ có 52 bit phần lẻ → buộc phải cắt → lưu giá trị GẦN ĐÚNG:</text>
    <text x="36" y="128" fill="#DC2626" font-family="monospace">0.1000000000000000055511151231257827021181583404541015625</text>
    <rect x="20" y="165" width="680" height="95" rx="10" fill="#ECFDF5" stroke="#10B981"/>
    <text x="36" y="188" fill="#047857" font-size="13" font-weight="bold">BigDecimal "0.1": lưu số nguyên + vị trí dấu phẩy (cơ số 10)</text>
    <rect x="36" y="200" width="150" height="44" rx="6" fill="#FFFFFF" stroke="#10B981"/>
    <text x="111" y="218" fill="#64748B" text-anchor="middle">unscaled value</text>
    <text x="111" y="236" fill="#0F172A" font-family="monospace" text-anchor="middle">1</text>
    <rect x="200" y="200" width="110" height="44" rx="6" fill="#FFFFFF" stroke="#10B981"/>
    <text x="255" y="218" fill="#64748B" text-anchor="middle">scale</text>
    <text x="255" y="236" fill="#0F172A" font-family="monospace" text-anchor="middle">1</text>
    <text x="330" y="227" fill="#0F172A" font-family="monospace">→ 1 × 10^-1 = 0.1</text>
    <text x="520" y="227" fill="#047857" font-weight="bold">chính xác tuyệt đối</text>
  </g>
</svg>

```java
import java.math.BigDecimal;

public class DoubleMoney {
    public static void main(String[] args) {
        System.out.println(0.1 + 0.2);                  // mong đợi 0.3
        System.out.println(0.1 + 0.2 == 0.3);           // so sánh bằng
        System.out.println(1.10 - 1.00);                // mong đợi 0.1

        System.out.println(new BigDecimal(0.1));        // giá trị THẬT double 0.1 đang giữ
        System.out.println(new BigDecimal("0.1"));      // tạo từ String: đúng 0.1
        System.out.println(BigDecimal.valueOf(0.1));    // cũng ra 0.1
    }
}
```

**Kết quả khi chạy:**

```text
0.30000000000000004
false
0.10000000000000009
0.1000000000000000055511151231257827021181583404541015625
0.1
0.1
```

**Giải thích từng bước:**

1. `0.1 + 0.2` ra `0.30000000000000004`, và vì thế `== 0.3` ra `false`.
2. `new BigDecimal(0.1)` nhận vào một `double` đã sai sẵn, nên nó trung thực in ra giá trị thật
   mà `double` đang giữ. Javadoc gọi constructor này là "có phần khó đoán" [9].
3. `new BigDecimal("0.1")` đọc từ chuỗi chữ số, nên đúng `0.1`. Đây là cách nên dùng.
4. `BigDecimal.valueOf(0.1)` đổi `double` sang chuỗi bằng `Double.toString` (ra `"0.1"`) trước,
   nên cũng ra `0.1` [9]. Dùng khi bạn buộc phải bắt đầu từ một `double`.

### Tính phí giao dịch 0,05%

`BigDecimal` cũng bất biến như `String`. Mọi phép tính là **method trả về object mới**:
`add` (cộng), `subtract` (trừ), `multiply` (nhân), `divide` (chia). **Scale** là số chữ số sau
dấu phẩy; với VND, tiền thật có scale 0.

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class FeeCalculator {
    public static void main(String[] args) {
        BigDecimal amount = new BigDecimal("1234567");   // số tiền chuyển (đồng)
        BigDecimal feeRate = new BigDecimal("0.0005");   // 0,05%

        BigDecimal rawFee = amount.multiply(feeRate);    // nhân chính xác
        System.out.println("Phí thô:      " + rawFee);

        BigDecimal fee = rawFee.setScale(0, RoundingMode.HALF_UP); // VND: 0 chữ số lẻ
        System.out.println("Phí làm tròn: " + fee);

        BigDecimal total = amount.add(fee);              // tổng bị trừ khỏi tài khoản
        System.out.println("Tổng trừ:     " + total);

        BigDecimal balance = new BigDecimal("2000000");
        BigDecimal after = balance.subtract(total);      // số dư còn lại
        System.out.println("Số dư sau:    " + after);
    }
}
```

**Kết quả khi chạy:**

```text
Phí thô:      617.2835
Phí làm tròn: 617
Tổng trừ:     1235184
Số dư sau:    764816
```

**Giải thích từng bước:**

1. `0,05%` = `0.05 / 100` = `0.0005`. Tạo cả hai số từ `String`.
2. `multiply` cho kết quả chính xác `617.2835`. Scale của tích bằng tổng scale hai thừa số
   (0 + 4 = 4) [9].
3. `setScale(0, RoundingMode.HALF_UP)`: giữ 0 chữ số lẻ, làm tròn kiểu "từ 5 trở lên thì lên".
   `.2835` nhỏ hơn `.5` nên ra `617`.
4. `add`, `subtract` trả về object mới; ta gán vào biến mới `total`, `after`.

### Tính lãi và chọn cách làm tròn

Phép chia khác các phép còn lại: kết quả có thể dài vô hạn (`100000 / 3`). Vì vậy khi `divide`,
bạn nên luôn nói rõ **giữ mấy chữ số lẻ** và **làm tròn kiểu gì** (`RoundingMode`) [11].

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class InterestCalculator {
    public static void main(String[] args) {
        BigDecimal principal = new BigDecimal("50000000");  // tiền gửi: 50 triệu
        BigDecimal annualRate = new BigDecimal("0.055");     // lãi 5,5%/năm
        BigDecimal months = new BigDecimal("12");

        BigDecimal yearly = principal.multiply(annualRate);  // lãi cả năm
        System.out.println("Lãi 1 năm:   " + yearly);

        // chia: phải nói rõ giữ mấy chữ số lẻ (scale) và làm tròn kiểu gì
        BigDecimal monthly = yearly.divide(months, 0, RoundingMode.HALF_UP);
        System.out.println("Lãi 1 tháng: " + monthly);

        BigDecimal two = new BigDecimal("2.5");
        BigDecimal three = new BigDecimal("3.5");
        System.out.println(two.setScale(0, RoundingMode.HALF_UP) + " "
                + three.setScale(0, RoundingMode.HALF_UP));   // HALF_UP
        System.out.println(two.setScale(0, RoundingMode.HALF_EVEN) + " "
                + three.setScale(0, RoundingMode.HALF_EVEN)); // HALF_EVEN
    }
}
```

**Kết quả khi chạy:**

```text
Lãi 1 năm:   2750000.000
Lãi 1 tháng: 229167
3 4
2 4
```

**Giải thích từng bước:**

1. `50000000 × 0.055 = 2750000.000`: scale 3 vì `0.055` có 3 chữ số lẻ.
2. `divide(months, 0, RoundingMode.HALF_UP)`: `2750000 / 12 = 229166.666...`, giữ 0 chữ số lẻ,
   làm tròn lên thành `229167`.
3. **`HALF_UP`**: đúng ở giữa (`.5`) thì làm tròn ra xa số 0. `2.5 → 3`, `3.5 → 4`. Đây là cách
   làm tròn bạn học ở trường.
4. **`HALF_EVEN`**: đúng ở giữa thì về phía số **chẵn** gần nhất. `2.5 → 2`, `3.5 → 4`.
   Còn gọi là "làm tròn kiểu ngân hàng" (*banker's rounding*): khi cộng dồn rất nhiều giao dịch,
   lúc lên lúc xuống bù trừ nhau nên tổng ít bị lệch [11].

Chọn `HALF_UP` hay `HALF_EVEN` là **quy định nghiệp vụ**, không phải sở thích lập trình viên.
Ở dự án thật, hãy hỏi BA hoặc xem tài liệu sản phẩm.

### ⚠️ Lỗi hay gặp

**1. `divide` mà không nói làm tròn thế nào.**

```java
import java.math.BigDecimal;

public class DivideNoScale {
    public static void main(String[] args) {
        BigDecimal bill = new BigDecimal("100000");
        BigDecimal people = new BigDecimal("3");
        System.out.println(bill.divide(people));   // 33333.333... vô hạn → không biết dừng ở đâu
    }
}
```

```text
Exception in thread "main" java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.
	at java.base/java.math.BigDecimal.divide(BigDecimal.java:1783)
	at DivideNoScale.main(DivideNoScale.java:7)
```

`BigDecimal` không chịu tự ý cắt số. Cách sửa: `bill.divide(people, 0, RoundingMode.HALF_UP)`.

**2. So sánh bằng `equals` và quên gán kết quả.**

```java
import java.math.BigDecimal;

public class CompareBigDecimal {
    public static void main(String[] args) {
        BigDecimal a = new BigDecimal("2.0");
        BigDecimal b = new BigDecimal("2.00");

        System.out.println(a.equals(b));         // so cả giá trị LẪN scale
        System.out.println(a.compareTo(b));      // chỉ so giá trị: 0 nghĩa là bằng
        System.out.println(a.compareTo(b) == 0); // cách so sánh tiền đúng

        BigDecimal balance = new BigDecimal("100000");
        balance.add(new BigDecimal("50000"));    // quên gán: BigDecimal cũng bất biến!
        System.out.println(balance);
    }
}
```

```text
false
0
true
100000
```

- `equals` coi `2.0` và `2.00` là **khác nhau** vì scale khác nhau (1 và 2) [9]. Muốn so giá
  trị tiền thì dùng `compareTo`: trả về số âm nếu nhỏ hơn, `0` nếu bằng, số dương nếu lớn hơn.
- `balance.add(...)` không đổi `balance`, giống hệt lỗi quên gán ở phần 1. Cách sửa:
  `balance = balance.add(new BigDecimal("50000"));`.

**3. Tạo `BigDecimal` từ `double`.** `new BigDecimal(0.1)` mang theo sai số của `double` (xem
ví dụ đầu phần này). Luôn tạo từ `String`, hoặc dùng `BigDecimal.valueOf(...)` nếu bắt buộc
phải đi từ `double`.

---

## Tóm tắt

- `String` là **bất biến**: mọi method "sửa" đều trả về chuỗi mới, nhớ **gán lại** kết quả.
- Literal giống nhau dùng chung một object trong **string pool**; chuỗi tạo lúc chạy thì không.
- So sánh nội dung chuỗi luôn dùng `equals` / `equalsIgnoreCase`, không dùng `==`.
  Đặt literal bên trái (`"ACTIVE".equals(x)`) để tránh `NullPointerException`.
- Chỉ số chuỗi bắt đầu từ 0; `substring(a, b)` lấy đến **trước** `b`; `split` nhận **regex**.
- Ghép ít thì dùng `+`, ghép trong vòng lặp thì dùng `StringBuilder`; định dạng bằng
  `String.format` / `formatted` / `printf`; chuỗi nhiều dòng dùng text block `"""`.
- `int / int` là chia nguyên, cắt về phía 0; dấu của `%` theo số bị chia; `x++` trả giá trị cũ,
  `++x` trả giá trị mới.
- Số nguyên tràn **không báo lỗi**; dùng `Math.addExact`, `multiplyExact` để bắt tràn.
- Tiền dùng `BigDecimal` tạo từ `String`, `divide`/`setScale` luôn kèm `RoundingMode`,
  so sánh bằng `compareTo`.

## Tự kiểm tra

**1.** Đoạn code sau in ra gì? Vì sao?

```java
String code = "  vcb ";
code.strip().toUpperCase();
System.out.println("[" + code + "]");
```

<details><summary>Đáp án</summary>

In `[  vcb ]`. `String` bất biến: `strip()` và `toUpperCase()` tạo chuỗi mới nhưng không được
gán cho biến nào. Sửa thành `code = code.strip().toUpperCase();` sẽ in `[VCB]`.

</details>

**2.** Vì sao `"VCB" == "VCB"` ra `true`, nhưng không được dùng `==` để so sánh mã ngân hàng
người dùng nhập vào?

<details><summary>Đáp án</summary>

Hai literal giống nhau dùng chung một object trong string pool nên `==` (so sánh tham chiếu)
ra `true`. Chuỗi người dùng nhập được tạo lúc chạy, là object khác, nên `==` ra `false` dù nội
dung giống hệt. Phải dùng `equals`.

</details>

**3.** `"0901234567".substring(3, 6)` trả về gì?

<details><summary>Đáp án</summary>

`"123"`. Chỉ số 3, 4, 5 là `1`, `2`, `3`; vị trí 6 không được lấy.

</details>

**4.** Tính giá trị: `-17 / 5`, `-17 % 5`, `17 % -5`.

<details><summary>Đáp án</summary>

`-17 / 5 = -3` (toán học là -3.4, cắt về phía 0). `-17 % 5 = -2` (vì `-3 * 5 + (-2) = -17`).
`17 % -5 = 2` (dấu theo số bị chia `17`).

</details>

**5.** `new BigDecimal("1.50").equals(new BigDecimal("1.5"))` ra gì? Nên so sánh thế nào?

<details><summary>Đáp án</summary>

`false`, vì `equals` so cả scale (2 khác 1). Nên dùng
`new BigDecimal("1.50").compareTo(new BigDecimal("1.5")) == 0`, kết quả `true`.

</details>

**6.** Vì sao `bill.divide(people)` có thể ném `ArithmeticException`, còn `bill.add(people)` thì không?

<details><summary>Đáp án</summary>

Cộng, trừ, nhân hai số thập phân hữu hạn luôn ra số thập phân hữu hạn. Phép chia thì có thể ra
số lặp vô hạn (như `100000 / 3`). Khi không chỉ định scale và `RoundingMode`, `BigDecimal` không
biết dừng ở đâu nên ném exception.

</details>

## Bài tập

**Bài 1 (dễ): Che email.** Cho `String email = "nguyen.van.an@onward.vn";`. In ra
`n***@onward.vn` (giữ ký tự đầu, che phần còn lại trước `@`).

> Gợi ý: `indexOf("@")`, `charAt(0)`, `substring(...)`, `"*".repeat(3)`.

**Bài 2 (vừa): Chuẩn hoá và kiểm tra mã giao dịch.** Người dùng nhập `"  tx-2026-0042 "`.
Chuẩn hoá thành chữ in hoa, bỏ khoảng trắng. In ra: mã sau chuẩn hoá, có bắt đầu bằng `"TX-"`
không, năm (`2026`) lấy bằng `split("-")`, và so sánh với `"TX-2026-0042"` bằng `equals`.

> Gợi ý: `strip()`, `toUpperCase()`, `startsWith`, `split("-")` rồi lấy phần tử thứ 2 bằng
> `parts[1]` (bài 5 học kỹ mảng).

**Bài 3 (khó): Tính lãi tiết kiệm có kỳ hạn.** Tiền gửi `100.000.000 đ`, lãi suất `4,7%/năm`,
kỳ hạn `6 tháng`. Tính tiền lãi = gốc × lãi suất × số tháng / 12, làm tròn về đồng bằng
`HALF_UP`. Sau đó tính lại với `HALF_EVEN`. In cả hai bằng `String.format` với dấu ngăn nghìn
kiểu Việt Nam. Thử đổi lãi suất để tìm một trường hợp hai cách làm tròn cho kết quả khác nhau.

> Gợi ý: tạo mọi số bằng `new BigDecimal("...")`; nhân hết rồi mới chia một lần duy nhất bằng
> `divide(..., 0, RoundingMode.HALF_UP)`. `%,d` không nhận `BigDecimal`; hãy dùng `%,.0f` hoặc
> đổi bằng `longValueExact()`. Đáp số với `HALF_UP`: `2.350.000 đ`.

## Đọc thêm

1. roadmap.sh, *Java Developer Roadmap*: <https://roadmap.sh/java>
2. Jakob Jenkov, *Java Strings* (tài liệu roadmap.sh gợi ý cho Strings and Methods):
   <https://jenkov.com/tutorials/java/strings.html>
3. Jakob Jenkov, *Java Math Operators and Math Class* (tài liệu roadmap.sh gợi ý cho Math Operations):
   <https://jenkov.com/tutorials/java/math-operators-and-math-class.html>
4. JLS SE 21, §3.10.5 *String Literals*:
   <https://docs.oracle.com/javase/specs/jls/se21/html/jls-3.html#jls-3.10.5>
5. Java SE 21 API, *String*:
   <https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/String.html>
6. Java SE 21 API, *StringBuilder*:
   <https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/StringBuilder.html>
7. JLS SE 21, §15.17 *Multiplicative Operators* (chia nguyên, phần dư):
   <https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.17>
8. Java SE 21 API, *Math*:
   <https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Math.html>
9. Java SE 21 API, *BigDecimal*:
   <https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html>
10. JEP 378, *Text Blocks*: <https://openjdk.org/jeps/378>
11. Java SE 21 API, *RoundingMode*:
    <https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/RoundingMode.html>
12. dev.java, *Strings* và *String Builders*: <https://dev.java/learn/numbers-strings/strings/>,
    <https://dev.java/learn/numbers-strings/string-builders/>
13. JLS SE 21, §4.2.2 *Integer Operations* (tràn số không được báo):
    <https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.2.2>
14. Java SE 21 API, *Formatter* (cú pháp chuỗi định dạng):
    <https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Formatter.html>

---

**Bài tiếp theo:** [Bài 5 · Mảng, điều kiện và vòng lặp](/docs/learning/chang-1/mang-dieu-kien-vong-lap)
