---
title: "Bài 7 · Enum, Record và Nested Class"
description: "Thay chuỗi và mảng dữ liệu rời bằng kiểu chuyên dụng: enum cho một tập trạng thái cố định, record cho dữ liệu bất biến, nested class để nhóm các class liên quan trong Account."
order: 27
tags: [java, chặng-2, oop, enum, record, nested-class]
language: vi
profile: onward-java-course
classification: public-safe
source_repo: none
source_refs:
  - https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.9
  - https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.10
  - https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.29
  - https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Record.html
  - https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Enum.html
  - https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html
  - https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html
  - https://openjdk.org/jeps/395
  - https://openjdk.org/jeps/361
verified_with: "openjdk 21.0.9"
verification: ran-locally
verification_note: "9 chương trình chạy bằng java <File>.java (source-launch) hoặc javac trên JDK 21: EnumBasics, EnumSwitch chạy và in output thật; EnumValueOfError chạy ra NullPointerException/IllegalArgumentException thật; EnumSwitchNotExhaustive, RecordExtendsError, InnerClassNoOuter, StaticNestedNoOuterField biên dịch ra lỗi javac thật, đã dán nguyên thông báo error:. RecordBasics, RecordCompactConstructor, RecordShallowImmutable, NestedClasses chạy và in output thật. 4 SVG đã tách file, render bằng rsvg-convert, Read PNG để nhìn (1 PNG bị PII-guard false-positive trên bytes nhị phân, đã nén lại bằng Pillow compress_level=1 rồi Read lại thành công)."
contract_version: 1
---

# Bài 7 · Enum, Record và Nested Class

> 🎯 **Sau bài này bạn sẽ:**
> 1. Viết được `enum TransactionStatus` có field/constructor/method riêng, và dùng `switch` expression trên nó.
> 2. Giải thích được vì sao không nên lưu `ordinal()` của enum xuống cơ sở dữ liệu.
> 3. Viết được `record Transaction` với compact constructor kiểm tra dữ liệu hợp lệ, và giải thích được record "bất biến nông" nghĩa là gì.
> 4. Phân biệt được 4 loại nested class (static nested, inner, local, anonymous) và chỉ ra loại nào cần một object lớp ngoài để tồn tại.
> 5. Sửa được lỗi compile thường gặp khi dùng enum/record/nested class sai cách.

## Tình huống

Bạn đang ghi lịch sử giao dịch bằng `String status = "PENDING";`. Một đồng nghiệp gõ nhầm
`"Pending"` (viết hoa chữ P), code vẫn biên dịch, và báo cáo cuối tháng đếm nhầm vì hai chuỗi này
không bằng nhau. Bạn cũng đang truyền 4 giá trị rời `(id, amount, status, timestamp)` qua nhiều
method, viết tay `equals`/`toString` cho một class chỉ để *chứa* dữ liệu, và nhóm vài class nhỏ
(`Statement`, `TransactionLog`) chỉ dùng nội bộ trong `Account` nhưng lại để lẫn ở ngoài, gây rối
thư mục. Java có ba công cụ giải quyết đúng ba vấn đề này: **enum** (một tập giá trị cố định,
không gõ nhầm được), **record** (một class chỉ-dữ-liệu, bất biến, tự sinh code lặp), và
**nested class** (gói một class vào bên trong class khác đúng chỗ nó thuộc về).

**Cần biết trước:** [Bài 6 Chặng 1 · Nhập môn OOP](/docs/learning/chang-1/nhap-mon-oop) (class,
object, constructor, `this`, `static`, `toString()`), [Bài 2 · Đóng gói và method](/docs/learning/chang-2/dong-goi-va-method)
(encapsulation, overloading), [Bài 4 · Kế thừa và ghi đè](/docs/learning/chang-2/ke-thua-va-ghi-de)
(`@Override`, `equals`/`hashCode`), [Bài 6 · Binding và truyền tham số](/docs/learning/chang-2/binding-va-truyen-tham-so)
(switch chọn theo kiểu khai báo lúc biên dịch).

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| Enum (kiểu liệt kê) | Một danh sách **cố định** các giá trị hợp lệ | `enum TransactionStatus { PENDING, COMPLETED }` |
| Hằng số enum (enum constant) | Mỗi giá trị trong danh sách đó, là MỘT object có sẵn | `TransactionStatus.PENDING` |
| `ordinal()` | Số thứ tự khai báo, đếm từ 0 | `PENDING.ordinal()` → `0` |
| `name()` | Tên chữ của hằng số, đúng như gõ trong code | `PENDING.name()` → `"PENDING"` |
| `valueOf(String)` | Tra ngược: từ chuỗi tên ra hằng số | `valueOf("PENDING")` → `PENDING` |
| Record | Class chỉ để **chứa dữ liệu**, trình biên dịch tự viết constructor/`equals`/`toString` | `record Transaction(String id, ...)` |
| Compact constructor | Constructor rút gọn của record, dùng để kiểm tra dữ liệu | `Transaction { if (...) throw ...; }` |
| Bất biến nông (shallow immutable) | Field không gán lại được, nhưng nội dung bên trong nó (như `List`) vẫn sửa được | field `List<String> tags` của record |
| Nested class | Một class khai báo bên trong class khác | `class Account { static class Statement {...} }` |
| Inner class | Nested class **không** `static`, luôn gắn với một object lớp ngoài | `Account.TransactionLog` |

💡 **Vì sao enum không phải là `int` được đặt tên?** Ở nhiều ngôn ngữ cũ, trạng thái hay được biểu
diễn bằng số nguyên (`0`, `1`, `2`...). Java không làm vậy: mỗi hằng số enum là **một object thật
sự**, có kiểu riêng (`TransactionStatus`), nên trình biên dịch bắt lỗi ngay nếu bạn lỡ gán nhầm
kiểu khác, điều `int` không làm được.

## 1. Enum: một tập giá trị cố định, không gõ nhầm được

**Ý tưởng nôm na.** Hãy nghĩ tới tấm bảng trạng thái hồ sơ ở quầy giao dịch: hồ sơ chỉ có thể ở
đúng một trong bốn ô "Đang chờ / Đã xong / Thất bại / Đã hoàn trả", không có ô thứ năm, và nhân
viên không thể tự bịa ra ô mới. **Enum** (kiểu liệt kê, *enumeration*) là cách Java khai báo đúng
tập giá trị cố định đó: khi class `TransactionStatus` được nạp, JVM tạo sẵn đúng 4 object — không
ai gọi `new TransactionStatus()` được nữa [1][7].

<svg viewBox="0 0 740 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Enum TransactionStatus khi class được nạp. JVM tạo sẵn đúng bốn object cố định, không dùng new: PENDING có ordinal 0, COMPLETED ordinal 1, FAILED ordinal 2, REVERSED ordinal 3, xếp theo đúng thứ tự khai báo. Gọi values() trả về một mảng chứa bốn tham chiếu này. Gọi valueOf(COMPLETED) tra theo tên và trả về đúng object COMPLETED. Gọi valueOf(completed) chữ thường không khớp tên nào, nên ném IllegalArgumentException.">
  <defs>
    <marker id="c2b7-basics-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
    <marker id="c2b7-basics-err" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="720" height="110" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="370" y="30" text-anchor="middle" font-weight="bold" fill="#1D4ED8">enum TransactionStatus đã nạp: 4 object cố định, không ai "new" thêm được</text>
    <g font-family="monospace">
      <rect x="30" y="46" width="160" height="56" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
      <text x="110" y="66" text-anchor="middle" fill="#0F172A">PENDING</text>
      <text x="110" y="86" text-anchor="middle" fill="#64748B">ordinal = 0</text>
      <rect x="205" y="46" width="160" height="56" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
      <text x="285" y="66" text-anchor="middle" fill="#0F172A">COMPLETED</text>
      <text x="285" y="86" text-anchor="middle" fill="#64748B">ordinal = 1</text>
      <rect x="380" y="46" width="160" height="56" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
      <text x="460" y="66" text-anchor="middle" fill="#0F172A">FAILED</text>
      <text x="460" y="86" text-anchor="middle" fill="#64748B">ordinal = 2</text>
      <rect x="555" y="46" width="160" height="56" rx="8" fill="#FFFFFF" stroke="#2563EB"/>
      <text x="635" y="66" text-anchor="middle" fill="#0F172A">REVERSED</text>
      <text x="635" y="86" text-anchor="middle" fill="#64748B">ordinal = 3</text>
    </g>
    <rect x="20" y="140" width="330" height="70" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="35" y="162" font-family="monospace" fill="#0F172A">values()</text>
    <text x="35" y="182" fill="#64748B">trả về mảng 4 phần tử,</text>
    <text x="35" y="198" fill="#64748B">đúng thứ tự ordinal 0 → 3</text>
    <line x1="100" y1="140" x2="110" y2="102" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b7-basics-arrow)"/>
    <line x1="150" y1="140" x2="285" y2="102" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b7-basics-arrow)"/>
    <line x1="220" y1="140" x2="460" y2="102" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b7-basics-arrow)"/>
    <line x1="280" y1="140" x2="635" y2="102" stroke="#2563EB" stroke-width="1.5" marker-end="url(#c2b7-basics-arrow)"/>
    <rect x="390" y="140" width="330" height="70" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="405" y="162" font-family="monospace" fill="#0F172A">valueOf("COMPLETED")</text>
    <text x="405" y="182" fill="#047857">tra theo đúng tên → trả về object</text>
    <text x="405" y="198" fill="#047857">COMPLETED (ordinal 1)</text>
    <line x1="500" y1="140" x2="285" y2="104" stroke="#047857" stroke-width="1.5" marker-end="url(#c2b7-basics-arrow)"/>
    <rect x="20" y="230" width="700" height="60" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="35" y="252" font-family="monospace" fill="#0F172A">valueOf("completed")</text>
    <text x="35" y="272" fill="#DC2626">chữ thường, không khớp tên hằng số nào → ném IllegalArgumentException</text>
    <line x1="200" y1="230" x2="197" y2="104" stroke="#DC2626" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#c2b7-basics-err)"/>
  </g>
</svg>

```java
public class EnumBasics {
    public static void main(String[] args) {
        TransactionStatus status = TransactionStatus.PENDING;
        System.out.println("status       = " + status);
        System.out.println("name()       = " + status.name());
        System.out.println("ordinal()    = " + status.ordinal());

        // values(): mảng chứa tất cả hằng số, đúng thứ tự khai báo
        for (TransactionStatus s : TransactionStatus.values()) {
            System.out.println(s.ordinal() + " -> " + s);
        }

        // valueOf: tra ngược từ tên chuỗi ra hằng số
        TransactionStatus parsed = TransactionStatus.valueOf("COMPLETED");
        System.out.println("parsed       = " + parsed + ", ordinal=" + parsed.ordinal());
    }
}

enum TransactionStatus {
    PENDING, COMPLETED, FAILED, REVERSED
}
```

**Kết quả khi chạy:**

```text
status       = PENDING
name()       = PENDING
ordinal()    = 0
0 -> PENDING
1 -> COMPLETED
2 -> FAILED
3 -> REVERSED
parsed       = COMPLETED, ordinal=1
```

**Giải thích từng bước:**

1. `enum TransactionStatus { PENDING, COMPLETED, FAILED, REVERSED }` khai báo đúng 4 giá trị hợp
   lệ. Mỗi tên (`PENDING`, ...) là một **hằng số enum** — bản thân nó đã là một object kiểu
   `TransactionStatus`, không cần (và không thể) `new` [1].
2. `println(status)` tự gọi `toString()` có sẵn, in ra đúng `name()` (`"PENDING"`).
3. `ordinal()` trả về vị trí khai báo, đếm từ 0. `values()` trả về một **mảng mới** mỗi lần gọi,
   chứa cả 4 hằng số theo đúng thứ tự đó [5].
4. `valueOf("COMPLETED")` tra theo đúng chuỗi tên (phân biệt hoa thường) và trả về chính object
   `COMPLETED` — không tạo object mới [5].

⚠️ **Đừng lưu `ordinal()` xuống cơ sở dữ liệu hay file.** Ordinal phụ thuộc **thứ tự khai báo**.
Javadoc của `Enum` khuyến cáo hầu hết lập trình viên không cần dùng `ordinal()` trực tiếp, nó dành
cho các cấu trúc dữ liệu nâng cao như `EnumSet`/`EnumMap` [5]. Nếu sau này bạn thêm `DISPUTED` vào
giữa danh sách, mọi `ordinal` cũ đều lệch sang nghĩa khác — một bản ghi `status=2` cũ đột nhiên
thành `DISPUTED` thay vì `FAILED`. Hãy lưu `name()` (chuỗi) hoặc dùng `valueOf` khi đọc lại.

### ⚠️ Lỗi hay gặp

**Gọi `valueOf` với chuỗi không khớp tên nào.** `valueOf` phân biệt hoa/thường tuyệt đối.

```java
public class EnumValueOfError {
    public static void main(String[] args) {
        TransactionStatus s = TransactionStatus.valueOf("completed"); // sai chữ hoa
        System.out.println(s);
    }
}

enum TransactionStatus {
    PENDING, COMPLETED, FAILED, REVERSED
}
```

```text
Exception in thread "main" java.lang.IllegalArgumentException: No enum constant TransactionStatus.completed
	at java.base/java.lang.Enum.valueOf(Enum.java:293)
	at TransactionStatus.valueOf(EnumValueOfError.java:8)
	at EnumValueOfError.main(EnumValueOfError.java:3)
```

**Cách sửa:** chuẩn hoá chuỗi trước khi tra (`input.trim().toUpperCase()`), hoặc bọc trong
`try/catch IllegalArgumentException` nếu dữ liệu có thể đến từ người dùng (chặng 3 học `try/catch`
kỹ hơn).

## 2. Enum có hành vi riêng: field, constructor, `switch` expression

**Ý tưởng nôm na.** Không chỉ là cái tên, mỗi trạng thái còn mang theo thông tin riêng: trạng thái
nào là "chốt sổ" (không đổi được nữa), trạng thái nào còn "sống". Giống như mỗi ô trên bảng trạng
thái có thêm một cái tem màu — đỏ (chốt) hay xanh (còn mở) — dán sẵn từ lúc in bảng. Enum cho phép
mỗi hằng số mang **field riêng**, được gán qua **constructor** chạy đúng một lần khi class nạp [1].

<svg viewBox="0 0 740 280" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Enum có field và constructor riêng. Khi class TransactionStatus được nạp, constructor TransactionStatus(boolean finalState) chạy đúng một lần cho mỗi hằng số, theo thứ tự khai báo: PENDING gọi constructor với false nên finalState bằng false, COMPLETED gọi với true nên finalState bằng true, tương tự FAILED và REVERSED đều true. Phía dưới là switch expression describe(status): mỗi nhánh case dùng mũi tên để trả về một chuỗi, không cần break hay fallthrough.">
  <defs>
    <marker id="c2b7-behavior-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#D97706"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="370" y="22" text-anchor="middle" font-weight="bold" fill="#0F172A">Mỗi hằng số gọi constructor MỘT lần khi class nạp, giống truyền tham số cho "new" ẩn</text>
    <rect x="10" y="36" width="170" height="70" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="95" y="56" text-anchor="middle" font-family="monospace" fill="#0F172A">PENDING(false)</text>
    <text x="95" y="76" text-anchor="middle" fill="#64748B">finalState = false</text>
    <rect x="195" y="36" width="170" height="70" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="280" y="56" text-anchor="middle" font-family="monospace" fill="#0F172A">COMPLETED(true)</text>
    <text x="280" y="76" text-anchor="middle" fill="#64748B">finalState = true</text>
    <rect x="380" y="36" width="170" height="70" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="465" y="56" text-anchor="middle" font-family="monospace" fill="#0F172A">FAILED(true)</text>
    <text x="465" y="76" text-anchor="middle" fill="#64748B">finalState = true</text>
    <rect x="565" y="36" width="170" height="70" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="650" y="56" text-anchor="middle" font-family="monospace" fill="#0F172A">REVERSED(true)</text>
    <text x="650" y="76" text-anchor="middle" fill="#64748B">finalState = true</text>
    <text x="370" y="130" text-anchor="middle" font-family="monospace" font-size="11" fill="#0F172A">switch (status) { case PENDING -&gt; ...; case COMPLETED -&gt; ...; case FAILED, REVERSED -&gt; ...; }</text>
    <rect x="20" y="150" width="150" height="46" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="95" y="178" text-anchor="middle" font-family="monospace" fill="#1D4ED8">PENDING</text>
    <rect x="195" y="150" width="150" height="46" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="270" y="178" text-anchor="middle" font-family="monospace" fill="#1D4ED8">COMPLETED</text>
    <rect x="370" y="150" width="340" height="46" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="540" y="178" text-anchor="middle" font-family="monospace" fill="#1D4ED8">FAILED, REVERSED (gộp 1 nhánh)</text>
    <line x1="95" y1="196" x2="95" y2="226" stroke="#D97706" stroke-width="1.5" marker-end="url(#c2b7-behavior-arrow)"/>
    <line x1="270" y1="196" x2="260" y2="226" stroke="#D97706" stroke-width="1.5" marker-end="url(#c2b7-behavior-arrow)"/>
    <line x1="540" y1="196" x2="470" y2="226" stroke="#D97706" stroke-width="1.5" marker-end="url(#c2b7-behavior-arrow)"/>
    <rect x="20" y="232" width="700" height="38" rx="6" fill="#FFFBEB" stroke="#D97706"/>
    <text x="35" y="256" font-family="monospace" fill="#0F172A">"đang chờ xử lý"      "đã hoàn tất"      "không thành công"</text>
  </g>
</svg>

```java
public class EnumSwitch {
    public static void main(String[] args) {
        for (TransactionStatus s : TransactionStatus.values()) {
            String note = describe(s);
            System.out.println(s + " -> " + note + " | isFinal=" + s.isFinal());
        }
    }

    // Switch expression (Java 14+): mỗi nhánh trả về một giá trị, không cần break
    static String describe(TransactionStatus status) {
        return switch (status) {
            case PENDING -> "đang chờ xử lý";
            case COMPLETED -> "đã hoàn tất";
            case FAILED, REVERSED -> "không thành công";
        };
    }
}

enum TransactionStatus {
    PENDING(false), COMPLETED(true), FAILED(true), REVERSED(true);

    // Field riêng của mỗi hằng số enum
    private final boolean finalState;

    // Constructor của enum: luôn private (ngầm định), chạy khi hằng số được tạo
    TransactionStatus(boolean finalState) {
        this.finalState = finalState;
    }

    boolean isFinal() {
        return finalState;
    }
}
```

**Kết quả khi chạy:**

```text
PENDING -> đang chờ xử lý | isFinal=false
COMPLETED -> đã hoàn tất | isFinal=true
FAILED -> không thành công | isFinal=true
REVERSED -> không thành công | isFinal=true
```

**Giải thích từng bước:**

1. Dòng khai báo hằng số `PENDING(false), COMPLETED(true), ...;` **kết thúc bằng dấu `;`** vì sau
   nó còn có field/constructor/method. Mỗi hằng số gọi constructor với đúng tham số của nó, một
   lần duy nhất, lúc class nạp.
2. `TransactionStatus(boolean finalState)` là constructor của enum. JLS quy định constructor của
   enum luôn `private`, kể cả khi bạn không ghi từ khoá đó [1].
3. `s.isFinal()` gọi method bình thường trên hằng số — lúc này `s` chính là object `COMPLETED` (hay
   `FAILED`...), mang theo field `finalState` riêng của nó.
4. `switch (status) { case PENDING -> ...; }` là **switch expression** (Java 14 trở thành chuẩn
   qua JEP 361): mỗi nhánh dùng `->` để trả thẳng một giá trị, không "rơi xuống" (fallthrough) như
   `switch` kiểu cũ, và không cần `break` [3][9]. `case FAILED, REVERSED ->` gộp hai nhãn dùng
   chung một kết quả.

### ⚠️ Lỗi hay gặp

**Switch expression thiếu nhánh cho một hằng số (không "bao phủ" hết).** Trình biên dịch kiểm tra
switch expression trên enum phải xử lý đủ mọi khả năng [3].

```java
public class EnumSwitchNotExhaustive {
    public static void main(String[] args) {
        TransactionStatus s = TransactionStatus.REVERSED;
        String note = switch (s) {
            case PENDING -> "đang chờ xử lý";
            case COMPLETED -> "đã hoàn tất";
            case FAILED -> "thất bại";
            // thiếu REVERSED
        };
        System.out.println(note);
    }
}

enum TransactionStatus {
    PENDING, COMPLETED, FAILED, REVERSED
}
```

```text
EnumSwitchNotExhaustive.java:4: error: the switch expression does not cover all possible input values
        String note = switch (s) {
                      ^
1 error
```

**Cách sửa:** thêm `case REVERSED -> ...;`, hoặc thêm nhánh `default ->` nếu cố ý muốn gộp các
trường hợp còn lại. Đây chính là lợi ích lớn nhất của switch expression trên enum: thêm một hằng số
mới mà quên cập nhật chỗ xử lý sẽ bị báo lỗi **ngay lúc biên dịch**, thay vì âm thầm sai lúc chạy.

## 3. Record: class chỉ để chứa dữ liệu, bất biến

**Ý tưởng nôm na.** Một **phiếu giao dịch** in sẵn chỉ có việc điền vào và đọc ra, không có "quầy
xử lý nghiệp vụ" nào gắn trên nó — khác với `Account` ở các bài trước, nơi `deposit`/`withdraw`
thay đổi trạng thái. **Record** là cách Java khai báo đúng loại class "chỉ chứa dữ liệu" đó trong
**một dòng**: bạn liệt kê các field cần có, trình biên dịch tự viết constructor, accessor,
`equals`, `hashCode`, `toString` [2][4]. Record trở thành tính năng chính thức từ Java 16, qua
JEP 395 [8].

<svg viewBox="0 0 740 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Khai báo record Transaction(String id, BigDecimal amount, TransactionStatus status) ở bên trái. Trình biên dịch tự sinh năm thành phần ở bên phải: constructor nhận đủ ba tham số và gán vào field; ba accessor id(), amount(), status() cùng tên field, không có tiền tố get; equals(Object) so hai object bằng nhau khi mọi field bằng nhau; hashCode() tính từ toàn bộ field; toString() in dạng Transaction[id=..., amount=..., status=...]. Phía dưới là compact constructor: chạy trước khi field được gán, dùng để kiểm tra id không rỗng và amount không âm, ném IllegalArgumentException nếu sai.">
  <defs>
    <marker id="c2b7-record-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="20" width="230" height="90" rx="10" fill="#FFFBEB" stroke="#D97706"/>
    <text x="125" y="42" text-anchor="middle" fill="#D97706" font-weight="bold">Bạn chỉ viết 1 dòng</text>
    <text x="22" y="66" font-family="monospace" font-size="11" fill="#0F172A">record Transaction(</text>
    <text x="22" y="82" font-family="monospace" font-size="11" fill="#0F172A">  String id, BigDecimal amount,</text>
    <text x="22" y="98" font-family="monospace" font-size="11" fill="#0F172A">  TransactionStatus status) {}</text>
    <line x1="240" y1="65" x2="280" y2="65" stroke="#2563EB" stroke-width="2" marker-end="url(#c2b7-record-arrow)"/>
    <text x="260" y="55" text-anchor="middle" fill="#64748B" font-size="11">compiler sinh ra</text>
    <rect x="290" y="10" width="440" height="190" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="510" y="30" text-anchor="middle" font-weight="bold" fill="#1D4ED8">5 thành phần tự sinh</text>
    <text x="305" y="52" font-family="monospace" font-size="11" fill="#0F172A">Transaction(String id, BigDecimal amount, ...)</text>
    <text x="305" y="68" fill="#64748B" font-size="11">constructor: gán đủ 3 field</text>
    <text x="305" y="92" font-family="monospace" font-size="11" fill="#0F172A">id()   amount()   status()</text>
    <text x="305" y="108" fill="#64748B" font-size="11">accessor: trùng tên field, không "get..."</text>
    <text x="305" y="132" font-family="monospace" font-size="11" fill="#0F172A">equals(Object o)</text>
    <text x="305" y="148" fill="#64748B" font-size="11">bằng nhau khi mọi field bằng nhau</text>
    <text x="305" y="172" font-family="monospace" font-size="11" fill="#0F172A">hashCode()        toString()</text>
    <text x="305" y="188" fill="#64748B" font-size="11">tính từ mọi field   "Transaction[id=.., amount=..]"</text>
    <rect x="10" y="225" width="720" height="85" rx="10" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="25" y="248" font-weight="bold" fill="#DC2626">Compact constructor: chạy TRƯỚC khi field được gán</text>
    <text x="25" y="270" font-family="monospace" font-size="11" fill="#0F172A">Transaction { if (id.isBlank()) throw ...; if (amount.signum() &lt; 0) throw ...; }</text>
    <text x="25" y="292" fill="#64748B" font-size="11">Không viết lại danh sách tham số; chỉ thêm điều kiện kiểm tra/chuẩn hoá trước khi gán.</text>
  </g>
</svg>

```java
import java.math.BigDecimal;

public class RecordBasics {
    public static void main(String[] args) {
        Transaction t1 = new Transaction("TXN-001", new BigDecimal("500000"), TransactionStatus.COMPLETED);
        Transaction t2 = new Transaction("TXN-001", new BigDecimal("500000"), TransactionStatus.COMPLETED);
        Transaction t3 = new Transaction("TXN-002", new BigDecimal("120000"), TransactionStatus.PENDING);

        System.out.println("t1           = " + t1);
        System.out.println("t1.id()      = " + t1.id());
        System.out.println("t1.amount()  = " + t1.amount());
        System.out.println("t1.equals(t2)= " + t1.equals(t2));
        System.out.println("t1 == t2     = " + (t1 == t2));
        System.out.println("t1.equals(t3)= " + t1.equals(t3));
        System.out.println("hashCode bằng nhau? " + (t1.hashCode() == t2.hashCode()));
    }
}

enum TransactionStatus { PENDING, COMPLETED, FAILED, REVERSED }

// record: khai báo 1 dòng, trình biên dịch tự sinh constructor, accessor, equals/hashCode/toString
record Transaction(String id, BigDecimal amount, TransactionStatus status) {
}
```

**Kết quả khi chạy:**

```text
t1           = Transaction[id=TXN-001, amount=500000, status=COMPLETED]
t1.id()      = TXN-001
t1.amount()  = 500000
t1.equals(t2)= true
t1 == t2     = false
t1.equals(t3)= false
hashCode bằng nhau? true
```

**Giải thích từng bước:**

1. Khai báo `record Transaction(String id, BigDecimal amount, TransactionStatus status) {}` liệt
   kê 3 **thành phần** (*component*) [2]. Trình biên dịch tự sinh ra field `private final` cho mỗi
   thành phần, một constructor nhận đủ 3 tham số, và các accessor `id()`, `amount()`, `status()`
   — **không** có tiền tố `get` như getter thường [4].
2. `toString()` tự sinh in dạng `Transaction[id=.., amount=.., status=..]`, không cần viết tay như
   Bài 4 Chặng 2.
3. `t1.equals(t2)` là `true`: hai record khác object (`t1 == t2` là `false`, giống Bài 6 Chặng 1)
   nhưng **mọi field bằng nhau**, nên `equals` tự sinh coi là bằng nhau [2]. `hashCode()` tự sinh
   cũng tính từ toàn bộ field, nên `t1` và `t2` cho cùng `hashCode()`.
4. `t1.equals(t3)` là `false` vì `id` khác nhau.

### Compact constructor: kiểm tra dữ liệu trước khi gán

**Thêm điều kiện hợp lệ bằng cách nào, nếu không được viết constructor bình thường?** Nếu bạn viết
hẳn `Transaction(String id, BigDecimal amount, TransactionStatus status) { ... }` với đủ 3 tham số,
Java chấp nhận — nhưng phải lặp lại cả 3 tham số dù chỉ muốn thêm 1 dòng kiểm tra. Cách gọn hơn là
**compact constructor**: không viết danh sách tham số, chạy **trước** khi field được gán.

```java
import java.math.BigDecimal;

public class RecordCompactConstructor {
    public static void main(String[] args) {
        Transaction ok = new Transaction("TXN-001", new BigDecimal("500000"), TransactionStatus.COMPLETED);
        System.out.println("ok = " + ok);

        try {
            new Transaction("TXN-002", new BigDecimal("-10000"), TransactionStatus.FAILED);
        } catch (IllegalArgumentException e) {
            System.out.println("Bắt được lỗi: " + e.getMessage());
        }

        try {
            new Transaction(" ", new BigDecimal("10000"), TransactionStatus.PENDING);
        } catch (IllegalArgumentException e) {
            System.out.println("Bắt được lỗi: " + e.getMessage());
        }
    }
}

enum TransactionStatus { PENDING, COMPLETED, FAILED, REVERSED }

record Transaction(String id, BigDecimal amount, TransactionStatus status) {
    // Compact constructor: không có danh sách tham số riêng, dùng lại tên field.
    // Chạy TRƯỚC khi field được gán, để kiểm tra/chuẩn hoá dữ liệu.
    Transaction {
        if (id == null || id.isBlank()) {
            throw new IllegalArgumentException("id không được rỗng");
        }
        if (amount == null || amount.signum() < 0) {
            throw new IllegalArgumentException("amount không được âm");
        }
    }
}
```

```text
ok = Transaction[id=TXN-001, amount=500000, status=COMPLETED]
Bắt được lỗi: amount không được âm
Bắt được lỗi: id không được rỗng
```

**Cách sửa thói quen cũ:** đừng tạo `Transaction` rồi mới gọi một method `validate()` riêng —
compact constructor đảm bảo **không có object `Transaction` nào tồn tại mà chưa qua kiểm tra**,
kể cả khi ai đó quên gọi hàm kiểm tra.

💡 **Record "bất biến nông" nghĩa là gì?** Field của record không gán lại được (giống `final`), nên
**bản thân tham chiếu** `tags` trong ví dụ dưới không đổi. Nhưng nếu thành phần đó là một kiểu có
thể sửa nội dung bên trong như `List`, `Map`, nội dung đó **vẫn sửa được từ bên ngoài** — đây là lý
do gọi là bất biến "nông" (*shallow*), không phải bất biến hoàn toàn [2].

```java
import java.util.ArrayList;
import java.util.List;

public class RecordShallowImmutable {
    public static void main(String[] args) {
        List<String> tags = new ArrayList<>();
        tags.add("the-nam");
        TransactionNote note = new TransactionNote("TXN-001", tags);

        System.out.println("note trước  = " + note);
        tags.add("khan-cap"); // sửa list gốc, record không hề hay biết
        System.out.println("note sau    = " + note);
    }
}

// record chỉ bất biến "nông": chính field tags không gán lại được,
// nhưng nếu tags là List thì nội dung bên trong List vẫn sửa được từ bên ngoài.
record TransactionNote(String transactionId, List<String> tags) {
}
```

```text
note trước  = TransactionNote[transactionId=TXN-001, tags=[the-nam]]
note sau    = TransactionNote[transactionId=TXN-001, tags=[the-nam, khan-cap]]
```

Muốn bất biến thật sự, bạn tự viết compact constructor để chép dữ liệu thành một bản không sửa
được, ví dụ `tags = List.copyOf(tags);` — chặng 3 sẽ học `List` kỹ hơn.

### ⚠️ Lỗi hay gặp

**Cố cho record `extends` một class khác.** Mọi record ngầm định `final` và
đã kế thừa sẵn `java.lang.Record`; Java chỉ cho đơn kế thừa một class cha (Bài 4 Chặng 2), nên
record không còn "suất" để `extends` thêm [2][4]:

```java
public class RecordExtendsError {
    public static void main(String[] args) {
        System.out.println("demo");
    }
}

record Transaction(String id) {
}

// record ngầm định là final và đã kế thừa java.lang.Record, không thể extends thêm
class SpecialTransaction extends Transaction {
    SpecialTransaction(String id) {
        super(id);
    }
}
```

```text
RecordExtendsError.java:11: error: cannot inherit from final Transaction
class SpecialTransaction extends Transaction {
                                 ^
1 error
```

Record **vẫn implement interface được** bình thường — chỉ không `extends` class.

## 4. Nested class: gói class nhỏ đúng chỗ nó thuộc về

**Ý tưởng nôm na.** Một chi nhánh ngân hàng có những "biểu mẫu phụ" chỉ dùng kèm một loại hồ sơ: tờ
sao kê in kèm `Account` không cần biết tài khoản *nào* khi vừa in tiêu đề, nhưng sổ nhật ký giao
dịch thì luôn phải kẹp đúng với **một** hồ sơ cụ thể. **Nested class** là class khai báo bên trong
class khác; Java chia làm 4 loại tuỳ nó có cần một object "hồ sơ ngoài" cụ thể để tồn tại hay
không [6].

<svg viewBox="0 0 740 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bốn loại nested class trong class Account. Static nested class Statement đứng tách biệt, không có mũi tên tới object Account nào, tạo được bằng new Account.Statement() ngay cả khi chưa có tài khoản nào. Inner class TransactionLog có mũi tên bắt buộc từ một object Account cụ thể, vì nó đọc trực tiếp field của object đó; tạo bằng an.new TransactionLog(). Local class HighValueFilter nằm bên trong một method, chỉ tồn tại và dùng được trong method đó. Anonymous class là một object cài đặt interface Greeter được tạo ngay tại chỗ gọi, không có tên class, dùng đúng một lần.">
  <defs>
    <marker id="c2b7-nested-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#2563EB"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="720" height="150" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="30" y="30" font-weight="bold" fill="#0F172A">class Account { ... }</text>
    <rect x="30" y="44" width="220" height="96" rx="8" fill="#FFFBEB" stroke="#D97706" stroke-dasharray="6 4"/>
    <text x="140" y="64" text-anchor="middle" font-family="monospace" fill="#0F172A">static class Statement</text>
    <text x="140" y="84" text-anchor="middle" fill="#D97706">static nested</text>
    <text x="140" y="104" text-anchor="middle" fill="#64748B" font-size="11">không cần object Account</text>
    <text x="140" y="126" text-anchor="middle" fill="#64748B" font-size="10" font-family="monospace">new Account.Statement("...")</text>
    <rect x="310" y="60" width="110" height="64" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="365" y="86" text-anchor="middle" font-family="monospace" fill="#047857">an : Account</text>
    <text x="365" y="106" text-anchor="middle" fill="#64748B" font-size="11">object ngoài</text>
    <rect x="490" y="44" width="220" height="96" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="600" y="64" text-anchor="middle" font-family="monospace" fill="#0F172A">class TransactionLog</text>
    <text x="600" y="84" text-anchor="middle" fill="#1D4ED8">inner class</text>
    <text x="600" y="104" text-anchor="middle" fill="#64748B" font-size="11">đọc thẳng field của object ngoài</text>
    <text x="600" y="126" text-anchor="middle" fill="#64748B" font-size="10" font-family="monospace">an.new TransactionLog()</text>
    <line x1="420" y1="92" x2="486" y2="92" stroke="#2563EB" stroke-width="2" marker-end="url(#c2b7-nested-arrow)"/>
    <rect x="10" y="175" width="350" height="100" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="30" y="197" font-weight="bold" fill="#0F172A">method main() { ... }</text>
    <rect x="30" y="208" width="310" height="54" rx="8" fill="#FFFFFF" stroke="#94A3B8" stroke-dasharray="4 3"/>
    <text x="185" y="230" text-anchor="middle" font-family="monospace" fill="#0F172A">class HighValueFilter { ... }</text>
    <text x="185" y="250" text-anchor="middle" fill="#64748B" font-size="11">local class: chỉ sống trong method này</text>
    <rect x="380" y="175" width="350" height="100" rx="10" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="400" y="197" font-weight="bold" fill="#0F172A">new Greeter() { ... }</text>
    <rect x="400" y="208" width="310" height="54" rx="8" fill="#FFFFFF" stroke="#94A3B8" stroke-dasharray="4 3"/>
    <text x="555" y="230" text-anchor="middle" font-family="monospace" fill="#0F172A">implements Greeter, không tên</text>
    <text x="555" y="250" text-anchor="middle" fill="#64748B" font-size="11">anonymous class: tạo ngay tại chỗ gọi</text>
    <rect x="10" y="295" width="720" height="95" rx="10" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="30" y="318" font-weight="bold" fill="#0F172A">Ai bắt buộc phải có object lớp ngoài để tồn tại?</text>
    <text x="30" y="342" fill="#64748B" font-size="11">static nested, local class, anonymous class: KHÔNG — chỉ cần class đã nạp, hoặc method đang chạy</text>
    <text x="30" y="364" fill="#64748B" font-size="11">inner class (non-static): CÓ — luôn gắn với đúng một object của class ngoài đang tồn tại</text>
  </g>
</svg>

```java
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class NestedClasses {
    public static void main(String[] args) {
        // 1) Static nested class: tạo được mà KHÔNG cần object Account nào
        Account.Statement header = new Account.Statement("Sao kê tháng 10");
        System.out.println(header.title());

        // 2) Inner class: phải có một object Account "ngoài" trước
        Account an = new Account("ACC-001", new BigDecimal("500000"));
        an.deposit(new BigDecimal("200000"));
        an.withdraw(new BigDecimal("50000"));

        Account.TransactionLog log = an.new TransactionLog();
        log.printAll();

        // 3) Local class: khai báo ngay trong method, chỉ dùng nội bộ ở đây
        class HighValueFilter {
            boolean isHighValue(BigDecimal amount) {
                return amount.compareTo(new BigDecimal("100000")) > 0;
            }
        }
        HighValueFilter filter = new HighValueFilter();
        System.out.println("200000 có phải giao dịch lớn? " + filter.isHighValue(new BigDecimal("200000")));

        // 4) Anonymous class: tạo một object cài đặt interface ngay tại chỗ, không đặt tên class
        Greeter greeter = new Greeter() {
            @Override
            public String greet(String owner) {
                return "Xin chào, " + owner + "!";
            }
        };
        System.out.println(greeter.greet("An"));
    }
}

interface Greeter {
    String greet(String owner);
}

class Account {
    private final String id;
    private BigDecimal balance;
    private final List<String> history = new ArrayList<>();

    Account(String id, BigDecimal balance) {
        this.id = id;
        this.balance = balance;
        history.add("Mở tài khoản: " + balance);
    }

    void deposit(BigDecimal amount) {
        balance = balance.add(amount);
        history.add("Nạp: +" + amount + " -> " + balance);
    }

    void withdraw(BigDecimal amount) {
        balance = balance.subtract(amount);
        history.add("Rút: -" + amount + " -> " + balance);
    }

    // Static nested class: không giữ tham chiếu tới object Account ngoài,
    // dùng khi lớp con chỉ liên quan tới Account về mặt TÊN, không cần dữ liệu instance.
    static class Statement {
        private final String title;

        Statement(String title) {
            this.title = title;
        }

        String title() {
            return title;
        }
    }

    // Inner class (non-static): mỗi object TransactionLog luôn gắn với
    // đúng MỘT object Account ngoài, và đọc thẳng field "history" của nó.
    class TransactionLog {
        void printAll() {
            System.out.println("Lịch sử của " + id + ":");
            for (String line : history) {
                System.out.println("  - " + line);
            }
        }
    }
}
```

**Kết quả khi chạy:**

```text
Sao kê tháng 10
Lịch sử của ACC-001:
  - Mở tài khoản: 500000
  - Nạp: +200000 -> 700000
  - Rút: -50000 -> 650000
200000 có phải giao dịch lớn? true
Xin chào, An!
```

**Giải thích từng bước:**

1. `Account.Statement` là **static nested class**: gọi `new Account.Statement(...)` trực tiếp,
   không cần object `Account` nào. Nó chỉ "ở nhờ" tên `Account` cho gọn namespace.
2. `an.new TransactionLog()` là **inner class**: cú pháp `an.new ...` bắt buộc phải có một object
   `an` đứng trước, vì bên trong `TransactionLog`, dòng `history` và `id` đọc thẳng field của
   **đúng object đó** — tương tự `this` ngầm định trỏ sang object `Account` ngoài [6].
3. `class HighValueFilter { ... }` khai báo **bên trong thân method** `main` là **local class**:
   chỉ tồn tại và dùng được trong phạm vi method đó, giống biến cục bộ.
4. `new Greeter() { @Override public String greet(...) {...} }` là **anonymous class**: tạo một
   object cài đặt `Greeter` ngay tại chỗ gọi, không đặt tên class, dùng cho đúng một lần. Chặng 3
   sẽ học `lambda` — cách viết gọn hơn cho đúng trường hợp interface chỉ có một method như
   `Greeter` [6].

### ⚠️ Lỗi hay gặp

**Tạo inner class mà thiếu object lớp ngoài.** Thiếu phần `an.new ...` (hoặc tương đương), trình
biên dịch báo ngay vì nó biết `TransactionLog` cần một `Account` đi kèm.

```java
public class InnerClassNoOuter {
    public static void main(String[] args) {
        Account.TransactionLog log = new Account.TransactionLog(); // thiếu object Account ngoài
    }
}

class Account {
    class TransactionLog {
    }
}
```

```text
InnerClassNoOuter.java:3: error: an enclosing instance that contains Account.TransactionLog is required
        Account.TransactionLog log = new Account.TransactionLog(); // thiếu object Account ngoài
                                     ^
1 error
```

**Cách sửa:** tạo một object `Account` trước, rồi gọi `accountInstance.new TransactionLog()`.

**Static nested class cố đọc field instance của class ngoài.** Static nested class không gắn với
object ngoài nào, nên không có "field instance của ai" để đọc — giống lỗi `static` ở Bài 3 Chặng 2.

```java
public class StaticNestedNoOuterField {
    public static void main(String[] args) {
        new Account.Statement().print();
    }
}

class Account {
    private String id = "ACC-001"; // field instance, thuộc về từng object Account

    static class Statement {
        void print() {
            System.out.println(id); // static nested class không có object Account nào để lấy id
        }
    }
}
```

```text
StaticNestedNoOuterField.java:12: error: non-static variable id cannot be referenced from a static context
            System.out.println(id); // static nested class không có object Account nào để lấy id
                               ^
1 error
```

**Cách sửa:** nếu `Statement` cần dữ liệu từ `Account`, hoặc đổi nó thành inner class (bỏ
`static`), hoặc truyền dữ liệu cần thiết qua tham số constructor của `Statement`.

## Nên dùng gì, khi nào?

| Tình huống | Chọn | Vì sao |
|---|---|---|
| Một tập giá trị cố định, biết trước, không đổi lúc chạy (trạng thái, loại tài khoản) | ✓ `enum` | Trình biên dịch chặn giá trị ngoài danh sách; `switch` được kiểm tra bao phủ đủ |
| Một gói dữ liệu chỉ để mang đi, không có hành vi nghiệp vụ riêng (DTO, bản ghi lịch sử) | ✓ `record` | Khỏi viết tay constructor/`equals`/`hashCode`/`toString`; ít chỗ để quên cập nhật khi thêm field |
| Một class nhỏ chỉ liên quan tên gọi tới class ngoài, không cần dữ liệu instance của nó | ✓ static nested class | Tạo được độc lập, không "kéo theo" một object ngoài không cần thiết |
| Một class luôn phải thao tác trên dữ liệu của đúng một object ngoài cụ thể | ✓ inner class | Truy cập thẳng field/method của object ngoài mà không cần truyền tham số |
| Field vừa có thể thay đổi bằng `deposit`/`withdraw`, vừa cần nghiệp vụ validate phức tạp, nhiều method | ✗ đừng ép thành `record` | Record hợp cho dữ liệu bất biến; `Account` cần trạng thái thay đổi, hợp với class thường (Bài 2–4) |
| Đọc lại trạng thái cũ (`ordinal` đã lưu) sau khi enum được sửa thứ tự | ✗ đừng dựa vào `ordinal()` | Ordinal đổi theo thứ tự khai báo; dùng `name()`/`valueOf()` để bền vững hơn |

## Tóm tắt

- **Enum** khai báo một tập giá trị cố định; mỗi hằng số là một object có sẵn, có `name()`,
  `ordinal()`, và tra ngược được bằng `valueOf()`. Đừng lưu `ordinal()` làm dữ liệu bền vững.
- Enum có thể mang **field riêng**, gán qua **constructor** (luôn `private`) chạy một lần khi class
  nạp cho mỗi hằng số, và có method như một class bình thường.
- **Switch expression** (`case X -> ...`) trả giá trị trực tiếp, không fallthrough; trên enum,
  trình biên dịch bắt lỗi nếu thiếu nhánh cho một hằng số.
- **Record** khai báo trong một dòng, tự sinh constructor, accessor (không tiền tố `get`),
  `equals`/`hashCode` (so theo mọi field), `toString`. Record ngầm định `final`, không `extends`
  được.
- **Compact constructor** của record chạy trước khi field được gán, dùng để validate/chuẩn hoá.
  Record chỉ **bất biến nông**: nội dung bên trong một field kiểu `List`/`Map` vẫn sửa được.
- 4 loại **nested class**: static nested (độc lập, không cần object ngoài), inner class (bắt buộc
  gắn với một object lớp ngoài, cú pháp `outer.new Inner()`), local class (sống trong một method),
  anonymous class (object ẩn danh tạo ngay tại chỗ gọi, tiền thân của lambda ở chặng 3).

## Tự kiểm tra

**Câu 1 (Mục tiêu 1).** Enum `TransactionStatus` có 4 hằng số với field `finalState` khai báo như
phần 2. `REVERSED.isFinal()` trả về gì, và dòng khai báo hằng số vì sao phải kết thúc bằng `;`?

<details><summary>Đáp án</summary>

`REVERSED.isFinal()` trả về `true`, vì `REVERSED(true)` gọi constructor với tham số `true`. Dấu
`;` sau danh sách hằng số bắt buộc khi class còn khai báo thêm field/constructor/method phía sau.

</details>

**Câu 2 (Mục tiêu 1).** Vì sao switch expression `return switch (status) { case PENDING -> ...; ... }`
thiếu một nhánh (ví dụ thiếu `REVERSED`) thì **không biên dịch được**, trong khi switch kiểu cũ
(`switch { case ...: ... break; }`) thiếu nhánh vẫn biên dịch bình thường?

<details><summary>Đáp án</summary>

Switch expression phải **trả về một giá trị** ở mọi nhánh có thể xảy ra; trên enum, trình biên dịch
biết chính xác tập hằng số nên kiểm tra được "bao phủ đủ" (exhaustiveness) ngay lúc biên dịch.
Switch kiểu cũ là câu lệnh (không bắt buộc trả giá trị), thiếu nhánh chỉ đơn giản là không làm gì,
nên không bị coi là lỗi.

</details>

**Câu 3 (Mục tiêu 2).** Vì sao không nên lưu `status.ordinal()` xuống file rồi đọc lại để biết
trạng thái cũ là gì?

<details><summary>Đáp án</summary>

`ordinal()` chỉ là số thứ tự khai báo. Nếu sau này có người thêm một hằng số mới ở giữa danh sách
(ví dụ thêm `DISPUTED` trước `FAILED`), mọi `ordinal` của `FAILED`/`REVERSED` cũ sẽ dịch sang giá
trị khác, khiến dữ liệu cũ đọc ra sai trạng thái. Nên lưu `name()` (chuỗi) và đọc lại bằng
`valueOf()`.

</details>

**Câu 4 (Mục tiêu 3).** `record Transaction(String id, BigDecimal amount, TransactionStatus status)`
với compact constructor kiểm tra `amount` không âm. `new Transaction("TXN-9", new BigDecimal("-1"), TransactionStatus.FAILED)`
có tạo ra object không? Vì sao?

<details><summary>Đáp án</summary>

Không. Compact constructor chạy **trước** khi field được gán, phát hiện `amount.signum() < 0` là
`true` và ném `IllegalArgumentException` ngay, nên object `Transaction` không bao giờ được tạo ra
ở trạng thái không hợp lệ.

</details>

**Câu 5 (Mục tiêu 3).** `record TransactionNote(String transactionId, List<String> tags)` có một
object `note`. Gọi `note.tags().add("mới")` (không tạo `note` mới) có làm `note` đổi không? Điều
này có mâu thuẫn với việc record "bất biến" không?

<details><summary>Đáp án</summary>

`tags()` trả về chính tham chiếu `List` bên trong `note`, nên gọi `add` trên nó **sửa được** nội
dung danh sách — `note` "đổi" theo nghĩa nội dung list thay đổi. Không mâu thuẫn, vì record chỉ
cam kết bất biến **nông**: field không gán lại được, nhưng không tự động làm bất biến nội dung bên
trong các kiểu có thể sửa như `List`.

</details>

**Câu 6 (Mục tiêu 4).** Vì sao `an.new TransactionLog()` cần có `an` đứng trước, còn
`new Account.Statement("...")` thì không?

<details><summary>Đáp án</summary>

`TransactionLog` là inner class (không `static`): bên trong nó truy cập thẳng field của một object
`Account` cụ thể, nên phải chỉ rõ object đó (`an.new ...`). `Statement` là static nested class,
không gắn với object `Account` nào, nên tạo độc lập bằng `new Account.Statement(...)`.

</details>

**Câu 7 (Mục tiêu 4).** Trong ví dụ `HighValueFilter` (local class) và lớp ẩn danh implement
`Greeter`, lớp nào có **tên** để gọi lại từ method khác, lớp nào không?

<details><summary>Đáp án</summary>

`HighValueFilter` có tên, nhưng chỉ dùng được bên trong method khai báo nó (local class). Lớp
implement `Greeter` ngay tại `new Greeter() { ... }` không có tên (anonymous class) — nó chỉ tồn
tại đúng tại biểu thức tạo ra nó, gán thẳng vào biến `greeter`.

</details>

**Câu 8 (Mục tiêu 5).** Bạn khai báo `static class Statement { void print() { System.out.println(id); } }`
bên trong `Account` (với `id` là field instance của `Account`), và javac báo:

```text
error: non-static variable id cannot be referenced from a static context
```

Nguyên nhân là gì, và có mấy cách sửa?

<details><summary>Đáp án</summary>

`Statement` là **static nested class**, không gắn với object `Account` nào, nên không có "`id` của
ai" để đọc — field instance chỉ tồn tại khi có một object cụ thể (phần 6 Chặng 1). Hai cách sửa:
(1) bỏ `static` để nó thành inner class, khi đó nó tự có quyền đọc field của object `Account` ngoài;
hoặc (2) giữ `static` nhưng truyền `id` vào qua tham số constructor của `Statement`.

</details>

## Bài tập

**Bài 1 (dễ).** Thêm hằng số `DISPUTED` (đang tranh chấp, chưa chốt) vào `enum TransactionStatus`
ở phần 2, với `finalState = false`. Thêm nhánh tương ứng vào `describe()`. Chạy lại chương trình và
kiểm tra `values()` in đủ 5 dòng.

> 💡 Gợi ý: thêm `DISPUTED(false)` vào đúng vị trí trong danh sách hằng số (nhớ dấu phẩy), rồi
> compiler sẽ báo lỗi "does not cover all possible input values" ở `switch` cho tới khi bạn thêm
> `case DISPUTED -> ...`.

**Bài 2 (vừa).** Viết `record Account(String id, BigDecimal openingBalance)` với compact
constructor kiểm tra `openingBalance` không âm và `id` không rỗng. Tạo thử 2 object cùng dữ liệu,
in `equals` và `toString` để thấy hành vi tự sinh.

> 💡 Gợi ý: đây là ví dụ để **so sánh**, không phải để dùng thay `Account` thật của các bài trước —
> tài khoản thật cần số dư thay đổi được (`deposit`/`withdraw`), không hợp để làm `record`.

**Bài 3 (khó hơn).** Trong class `Account` ở phần 4, viết thêm một **inner class**
`InterestCalculator` có method `BigDecimal monthlyInterest(BigDecimal rate)` tính
`balance.multiply(rate)` (đọc field `balance` của `Account` ngoài). So sánh với việc viết nó thành
**static nested class** nhận `balance` qua tham số — chỉ ra cách nào phải sửa chữ ký method.

> 💡 Gợi ý: inner class đọc thẳng `balance`, không cần tham số. Muốn đổi thành static nested class,
> method phải nhận thêm tham số `BigDecimal balance` vì không còn object `Account` ngoài để lấy.

## Nguồn tham khảo

1. JLS SE 21, §8.9 Enum Classes. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.9>
2. JLS SE 21, §8.10 Record Classes. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.10>
3. JLS SE 21, §15.29 Switch Expressions. <https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.29>
4. Java SE 21 API: `java.lang.Record`. <https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Record.html>
5. Java SE 21 API: `java.lang.Enum`. <https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Enum.html>
6. Oracle: Nested Classes (The Java Tutorials). <https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html>
7. Oracle: Enum Types (The Java Tutorials). <https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html>
8. JEP 395: Records. <https://openjdk.org/jeps/395>
9. JEP 361: Switch Expressions. <https://openjdk.org/jeps/361>

**Bài tiếp theo:** [Bài 8 · Checkpoint: mô hình hoá tài khoản ngân hàng](/docs/learning/chang-2/checkpoint-mo-hinh-tai-khoan)
