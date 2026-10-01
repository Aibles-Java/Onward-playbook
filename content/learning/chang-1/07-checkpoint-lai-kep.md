---
title: "Bài 7 · Checkpoint: CLI tính lãi kép"
description: "Bài tổng hợp Chặng 1: tự viết chương trình dòng lệnh tính lãi kép theo tháng, thấy tận mắt vì sao double làm lệch tiền và sửa bằng BigDecimal."
order: 17
tags: [java, chặng-1, checkpoint, bigdecimal, scanner, printf, lãi-kép]
---

# Bài 7 · Checkpoint: CLI tính lãi kép

Đây là bài cuối của Chặng 1. Bài này không có kiến thức mới lớn. Thay vào đó, bạn sẽ
**ghép** những gì đã học ở bài 1–6 thành một chương trình hoàn chỉnh, đúng kiểu một tính năng
nhỏ của ngân hàng: nhập số tiền gửi, tính lãi từng tháng, in bảng kết quả.

Cứ đi chậm từng phần. Mỗi phần đều có code chạy được và output thật để bạn đối chiếu.

> 🎯 **Sau bài này bạn sẽ:**
> - Viết được một CLI Java hoàn chỉnh: đọc 3 con số từ bàn phím, kiểm tra hợp lệ, in bảng lãi từng kỳ.
> - Tính tay được 2–3 kỳ lãi kép và dùng số tính tay để kiểm tra chương trình.
> - Chỉ ra được bằng output thật vì sao `double` làm lệch tiền, và sửa bằng `BigDecimal`.
> - Chia chương trình thành các class có trách nhiệm rõ ràng (nhập, tính, in).
> - Tự kiểm thử chương trình bằng input cố định qua pipe.

**Cần biết trước:** toàn bộ Chặng 1:
[Bài 1 · Cú pháp cơ bản](/docs/learning/chang-1/cu-phap-co-ban),
[Bài 2 · Vòng đời chương trình](/docs/learning/chang-1/vong-doi-chuong-trinh),
[Bài 3 · Kiểu dữ liệu, biến, ép kiểu](/docs/learning/chang-1/kieu-du-lieu-bien-ep-kieu),
[Bài 4 · Chuỗi và phép toán](/docs/learning/chang-1/chuoi-va-phep-toan),
[Bài 5 · Mảng, điều kiện, vòng lặp](/docs/learning/chang-1/mang-dieu-kien-vong-lap),
[Bài 6 · Nhập môn OOP](/docs/learning/chang-1/nhap-mon-oop).

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| Lãi kép (*compound interest*) | Lãi kỳ trước được cộng vào gốc, kỳ sau tính lãi trên số lớn hơn | 100 tr → 100,5 tr → lãi tháng 2 tính trên 100,5 tr |
| Kỳ hạn (*term*) | Số kỳ (ở bài này là số tháng) tiền nằm trong sổ | 12 tháng |
| CLI (*command-line interface*) | Chương trình chạy trong cửa sổ dòng lệnh, nói chuyện bằng chữ | `java -cp out Main` |
| Kiểm tra đầu vào (*input validation*) | Không tin người dùng, kiểm tra trước khi tính | gõ `abc` thì bắt nhập lại |
| Làm tròn `HALF_UP` (*rounding mode*) | Từ 0,5 trở lên thì làm tròn lên, dưới 0,5 thì xuống | 505.012,5 → 505.013 |
| Sai số dấu phẩy động (*floating-point error*) | `double` lưu số ở hệ nhị phân nên nhiều số thập phân bị lưu "gần đúng" | `0.1 + 0.2` ra `0.30000000000000004` |
| `scale` | Số chữ số sau dấu chấm mà một `BigDecimal` đang giữ | `512167.5` có scale 1 |
| `MathContext` | "Luật chia": giữ tối đa bao nhiêu chữ số, làm tròn ra sao | `MathContext.DECIMAL128` giữ 34 chữ số |
| Pipe (*đường ống*) | Dấu `\|` nối output của lệnh này vào input của lệnh kia | `printf '6\n' \| java ...` |

---

## 1. Đề bài và yêu cầu

**Ý tưởng nôm na:** bạn là dev của Onward. Khách hỏi: "Gửi 100 triệu, lãi 6%/năm, 12 tháng,
lãi nhập gốc hằng tháng thì cuối kỳ tôi có bao nhiêu?". Giống nhân viên quầy giao dịch, chương
trình hỏi 3 câu, rồi đưa khách một tờ bảng kê từng tháng.

<svg viewBox="0 0 740 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Đề bài: người dùng gõ tiền gốc 100000000 đồng, lãi suất năm r bằng 6 phần trăm, kỳ hạn 12 tháng. Chương trình CLI tính lãi nhập gốc hằng tháng theo công thức lãi bằng số dư nhân r chia 12, làm tròn HALF_UP về đồng, rồi in bảng gồm cột Kỳ, Lãi kỳ, Số dư; ví dụ kỳ 1 lãi 500.000 số dư 100.500.000, kỳ 12 lãi 528.198 số dư 106.167.783.">
  <defs>
    <marker id="b7-spec-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="115" y="18" text-anchor="middle" fill="#64748B">INPUT (bàn phím)</text>
    <rect x="10" y="30" width="210" height="170" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="25" y="62" fill="#0F172A">Tiền gốc (đồng)</text>
    <text x="25" y="80" fill="#1D4ED8" font-family="monospace">100000000</text>
    <text x="25" y="112" fill="#0F172A">Lãi suất năm r (%)</text>
    <text x="25" y="130" fill="#1D4ED8" font-family="monospace">6</text>
    <text x="25" y="162" fill="#0F172A">Kỳ hạn (tháng)</text>
    <text x="25" y="180" fill="#1D4ED8" font-family="monospace">12</text>
    <line x1="220" y1="115" x2="262" y2="115" stroke="#64748B" stroke-width="1.5" marker-end="url(#b7-spec-arrow)"/>
    <rect x="268" y="55" width="200" height="120" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="368" y="85" text-anchor="middle" fill="#1D4ED8" font-weight="bold">CLI tính lãi kép</text>
    <text x="368" y="110" text-anchor="middle" fill="#0F172A">lãi nhập gốc hằng tháng</text>
    <text x="368" y="130" text-anchor="middle" fill="#0F172A">lãi = số dư × r / 12</text>
    <text x="368" y="150" text-anchor="middle" fill="#0F172A">làm tròn HALF_UP về đồng</text>
    <line x1="468" y1="115" x2="510" y2="115" stroke="#64748B" stroke-width="1.5" marker-end="url(#b7-spec-arrow)"/>
    <text x="625" y="18" text-anchor="middle" fill="#64748B">OUTPUT (màn hình)</text>
    <rect x="516" y="30" width="214" height="170" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <g font-family="monospace" font-size="11" text-anchor="end">
      <text x="548" y="55" fill="#047857" font-weight="bold">Kỳ</text>
      <text x="625" y="55" fill="#047857" font-weight="bold">Lãi kỳ</text>
      <text x="718" y="55" fill="#047857" font-weight="bold">Số dư</text>
      <line x1="526" y1="63" x2="720" y2="63" stroke="#10B981"/>
      <text x="548" y="82" fill="#0F172A">1</text>
      <text x="625" y="82" fill="#0F172A">500.000</text>
      <text x="718" y="82" fill="#0F172A">100.500.000</text>
      <text x="548" y="102" fill="#0F172A">2</text>
      <text x="625" y="102" fill="#0F172A">502.500</text>
      <text x="718" y="102" fill="#0F172A">101.002.500</text>
      <text x="548" y="122" fill="#0F172A">3</text>
      <text x="625" y="122" fill="#0F172A">505.013</text>
      <text x="718" y="122" fill="#0F172A">101.507.513</text>
      <text x="548" y="145" fill="#64748B">…</text>
      <text x="625" y="145" fill="#64748B">…</text>
      <text x="718" y="145" fill="#64748B">…</text>
      <text x="548" y="168" fill="#0F172A">12</text>
      <text x="625" y="168" fill="#0F172A">528.198</text>
      <text x="718" y="168" fill="#0F172A">106.167.783</text>
    </g>
    <text x="370" y="222" text-anchor="middle" fill="#64748B" font-size="11">Quy ước đơn giản hoá để học, không phải công thức của một sản phẩm ngân hàng cụ thể</text>
  </g>
</svg>

**Yêu cầu chương trình:**

- **Input** (đọc từ bàn phím):
  1. Tiền gốc, đơn vị đồng (VND), là số nguyên dương.
  2. Lãi suất năm, đơn vị %, có thể có phần thập phân (ví dụ `5.1`).
  3. Kỳ hạn, đơn vị tháng, số nguyên từ 1 đến 360.
- **Output:** bảng từng tháng gồm 3 cột `Kỳ | Lãi kỳ | Số dư`, cuối bảng có tổng lãi.
- Nhập sai (chữ thay vì số, số âm, quá lớn) thì **báo lỗi và hỏi lại**, không được "chết" chương trình.

**Quy ước tính lãi của bài (đơn giản hoá):**

- **Lãi nhập gốc** (*capitalization*) hằng tháng: lãi tháng này cộng vào số dư, tháng sau tính lãi trên số dư mới.
- Lãi tháng = số dư × (lãi suất năm / 12).
- Lãi mỗi kỳ được **làm tròn `HALF_UP` về đồng** (0 chữ số thập phân) rồi mới cộng vào số dư.

> 💡 **Đây là bài học, không phải công thức của một sản phẩm thật.** Ngân hàng thật áp dụng quy
> tắc riêng cho từng sản phẩm: tính lãi theo số ngày thực tế, quy ước năm 365 ngày, cách làm tròn,
> thời điểm nhập gốc... Muốn tính đúng một sản phẩm, bạn phải đọc điều khoản của chính sản phẩm đó.
> Quy ước ở trên chỉ để bài toán gọn và kiểm tra được bằng tay.

Bước đầu tiên của mọi CLI: **đọc được input**. Chương trình dưới đây chỉ đọc 3 con số rồi in lại.
Chưa tính gì cả.

```java
import java.math.BigDecimal;
import java.util.Locale;
import java.util.Scanner;

public class ReadInputs {
    public static void main(String[] args) {
        // Đọc từ bàn phím; Locale.US để "5.1" được hiểu là năm phẩy một
        Scanner scanner = new Scanner(System.in).useLocale(Locale.US);

        System.out.print("Tiền gốc (đồng): ");
        long principal = scanner.nextLong();          // long: chứa được hàng nghìn tỷ

        System.out.print("Lãi suất năm (%): ");
        BigDecimal annualRate = scanner.nextBigDecimal();  // có phần thập phân

        System.out.print("Kỳ hạn (tháng): ");
        int months = scanner.nextInt();

        System.out.println();
        System.out.println("Gốc = " + principal + " đ, lãi suất = " + annualRate
                + "%/năm, kỳ hạn = " + months + " tháng");
    }
}
```

Chạy thử. Thay vì gõ tay, mình dùng lệnh `printf` để "gõ hộ" 3 dòng, rồi nối vào chương trình bằng
dấu `|`. Dấu này gọi là **pipe** (*đường ống*): output của lệnh bên trái trở thành input bàn phím
của lệnh bên phải. Mỗi `\n` là một lần bấm Enter. (Phần 7 sẽ dùng kỹ cách này.)

```bash
printf '100000000\n6\n12\n' | java ReadInputs.java
```

**Kết quả khi chạy:**

```text
Tiền gốc (đồng): Lãi suất năm (%): Kỳ hạn (tháng):
Gốc = 100000000 đ, lãi suất = 6%/năm, kỳ hạn = 12 tháng
```

Vì input đi qua pipe nên các con số không hiện ra sau dấu hai chấm như khi bạn gõ tay. Ba câu hỏi
vì thế nằm liền trên một dòng. Đó là bình thường.

**Giải thích từng bước:**

1. `new Scanner(System.in)` tạo một "người nghe" đọc từ bàn phím (bài 5).
2. `.useLocale(Locale.US)` dặn `Scanner` hiểu dấu chấm là dấu thập phân. Nhắc lại, `Locale` là bộ quy
   ước theo vùng: dấu thập phân, dấu ngăn cách hàng nghìn... (bài 4). Mặc định `Scanner` dùng `Locale`
   của máy [5].
3. `nextLong()` đọc tiền gốc vào kiểu `long` (64 bit, chứa thoải mái hàng nghìn tỷ đồng, bài 3).
4. `nextBigDecimal()` đọc lãi suất thành `BigDecimal` (bài 4), giữ đúng `6` hay `5.1` như bạn gõ.
5. `nextInt()` đọc kỳ hạn. 360 tháng thì `int` là đủ.

### ⚠️ Lỗi hay gặp

**1. Quên đặt `Locale`, máy cài tiếng Việt không hiểu `5.1`.** Với `Locale` tiếng Việt, dấu thập
phân là dấu phẩy. Giả lập máy tiếng Việt bằng `-Duser.language=vi -Duser.country=VN`:

```java
Scanner scanner = new Scanner(System.in);   // SAI: dùng Locale của máy
```

```text
Tiền gốc (đồng): Lãi suất năm (%): Exception in thread "main" java.util.InputMismatchException
	at java.base/java.util.Scanner.throwFor(Scanner.java:947)
	at java.base/java.util.Scanner.next(Scanner.java:1602)
	at java.base/java.util.Scanner.nextBigDecimal(Scanner.java:2749)
	at ReadInputs.main(ReadInputs.java:14)
```

`InputMismatchException` nghĩa là "token đọc được không khớp kiểu bạn đòi". Cùng chương trình đó
chạy trên máy của bạn có thể không lỗi, nên lỗi này rất khó đoán. **Cách sửa:** luôn gọi
`.useLocale(Locale.US)` để quy ước nhập không phụ thuộc máy.

**2. Đọc tiền gốc bằng `nextInt()`.** `int` chỉ chứa tới 2.147.483.647 (khoảng 2,1 tỷ, bài 3).
Khách gửi 10 tỷ là hỏng:

```java
int principal = scanner.nextInt();            // SAI: int tối đa ~2,1 tỷ
```

```text
Tiền gốc (đồng): Exception in thread "main" java.util.InputMismatchException: For input string: "10000000000"
	at java.base/java.util.Scanner.nextInt(Scanner.java:2273)
	at java.base/java.util.Scanner.nextInt(Scanner.java:2221)
	at ReadInputs.main(ReadInputs.java:11)
```

**Cách sửa:** tiền gốc dùng `long` và `nextLong()`.

---

## 2. Phân tích: công thức, tính tay, lưu đồ

**Ý tưởng nôm na:** trước khi viết code, hãy tự làm "kế toán" vài dòng bằng giấy bút. Số tính tay
chính là **đáp án** để sau này bạn chấm điểm chương trình.

**Công thức cho kỳ thứ k** (r là lãi suất năm, ví dụ 6% thì r = 0,06):

```text
lãi(k)   = làm_tròn_HALF_UP( số_dư(k-1) × r / 12 )
số_dư(k) = số_dư(k-1) + lãi(k)
số_dư(0) = tiền gốc
```

Viết theo đơn vị % (khách gõ `6` chứ không gõ `0.06`) thì r / 12 = lãi suất % / 100 / 12
= **lãi suất % / 1200**. Code của bài sẽ dùng con số 1200 này.

**Tính tay 3 kỳ** với gốc 100.000.000 đ, 6%/năm. Lãi suất tháng = 6 / 1200 = 0,5%.

| Kỳ | Số dư đầu kỳ × 0,5% | Lãi (làm tròn) | Số dư cuối kỳ |
|----|---------------------|----------------|---------------|
| 1 | 100.000.000 × 0,005 = 500.000 | 500.000 | 100.500.000 |
| 2 | 100.500.000 × 0,005 = 502.500 | 502.500 | 101.002.500 |
| 3 | 101.002.500 × 0,005 = 505.012,5 | **505.013** | 101.507.513 |

Kỳ 3 là chỗ đáng chú ý: lãi ra **505.012,5** đồng. Theo `HALF_UP`, phần lẻ đúng 0,5 thì làm tròn
lên, thành **505.013**. Chương trình đúng phải ra đúng con số này.

**Lưu đồ** (*flowchart*) của cả chương trình:

<svg viewBox="0 0 700 530" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lưu đồ chương trình: bắt đầu, hỏi một số theo thứ tự gốc, lãi suất, kỳ hạn. Nếu số đó không hợp lệ thì báo lỗi và hỏi lại chính số đó, các số đã nhập đúng được giữ nguyên. Nếu hợp lệ mà chưa đủ 3 số thì hỏi số tiếp theo. Đủ 3 số thì đặt số dư bằng gốc và k bằng 1. Khi k còn nhỏ hơn hoặc bằng kỳ hạn: lãi bằng làm tròn của số dư nhân r chia 12, cộng lãi vào số dư, lưu dòng k vào mảng, tăng k rồi quay lại kiểm tra. Khi k vượt kỳ hạn thì in bảng kết quả và kết thúc.">
  <defs>
    <marker id="b7-flow-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="220" y="10" width="120" height="34" rx="17" fill="#ECFDF5" stroke="#10B981"/>
    <text x="280" y="32" fill="#047857">Bắt đầu</text>
    <line x1="280" y1="44" x2="280" y2="66" stroke="#64748B" marker-end="url(#b7-flow-arrow)"/>
    <rect x="160" y="70" width="240" height="44" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="280" y="88" fill="#1D4ED8">Hỏi số tiếp theo</text>
    <text x="280" y="105" fill="#64748B" font-size="11">gốc → lãi suất → kỳ hạn</text>
    <line x1="280" y1="114" x2="280" y2="126" stroke="#64748B" marker-end="url(#b7-flow-arrow)"/>
    <polygon points="280,130 370,160 280,190 190,160" fill="#FFFBEB" stroke="#D97706"/>
    <text x="280" y="165" fill="#0F172A">Số này hợp lệ?</text>
    <line x1="370" y1="160" x2="466" y2="160" stroke="#64748B" marker-end="url(#b7-flow-arrow)"/>
    <text x="418" y="152" fill="#DC2626" font-size="11">Không</text>
    <rect x="470" y="140" width="210" height="40" rx="6" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="575" y="165" fill="#DC2626">Báo lỗi, hỏi lại đúng số đó</text>
    <path d="M575,140 V100 H404" fill="none" stroke="#64748B" marker-end="url(#b7-flow-arrow)"/>
    <line x1="280" y1="190" x2="280" y2="206" stroke="#64748B" marker-end="url(#b7-flow-arrow)"/>
    <text x="296" y="203" fill="#047857" font-size="11">Có</text>
    <polygon points="280,210 360,235 280,260 200,235" fill="#FFFBEB" stroke="#D97706"/>
    <text x="280" y="240" fill="#0F172A">Đủ 3 số?</text>
    <path d="M200,235 H120 V84 H156" fill="none" stroke="#64748B" marker-end="url(#b7-flow-arrow)"/>
    <text x="160" y="227" fill="#DC2626" font-size="11">Chưa</text>
    <line x1="280" y1="260" x2="280" y2="281" stroke="#64748B" marker-end="url(#b7-flow-arrow)"/>
    <text x="296" y="276" fill="#047857" font-size="11">Đủ</text>
    <rect x="160" y="285" width="240" height="40" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="280" y="310" fill="#1D4ED8">số dư = gốc;  k = 1</text>
    <line x1="280" y1="325" x2="280" y2="346" stroke="#64748B" marker-end="url(#b7-flow-arrow)"/>
    <polygon points="280,350 380,380 280,410 180,380" fill="#FFFBEB" stroke="#D97706"/>
    <text x="280" y="385" fill="#0F172A">k ≤ kỳ hạn?</text>
    <line x1="280" y1="410" x2="280" y2="436" stroke="#64748B" marker-end="url(#b7-flow-arrow)"/>
    <text x="296" y="428" fill="#047857" font-size="11">Có</text>
    <rect x="130" y="440" width="300" height="74" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="280" y="462" fill="#0F172A">lãi = làm tròn(số dư × r / 12)</text>
    <text x="280" y="481" fill="#0F172A">số dư = số dư + lãi</text>
    <text x="280" y="500" fill="#0F172A">lưu dòng k vào mảng;  k = k + 1</text>
    <path d="M130,477 H70 V380 H176" fill="none" stroke="#64748B" marker-end="url(#b7-flow-arrow)"/>
    <text x="52" y="430" fill="#64748B" font-size="11" transform="rotate(-90 52 430)">lặp lại</text>
    <line x1="380" y1="380" x2="466" y2="380" stroke="#64748B" marker-end="url(#b7-flow-arrow)"/>
    <text x="424" y="372" fill="#DC2626" font-size="11">Không</text>
    <rect x="470" y="360" width="200" height="40" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="570" y="385" fill="#047857">In bảng kết quả</text>
    <line x1="570" y1="400" x2="570" y2="446" stroke="#64748B" marker-end="url(#b7-flow-arrow)"/>
    <rect x="510" y="450" width="120" height="34" rx="17" fill="#ECFDF5" stroke="#10B981"/>
    <text x="570" y="472" fill="#047857">Kết thúc</text>
  </g>
</svg>

Thử chuyển ngay bảng tính tay thành code, dùng `long` (đồng) như các bài trước:

```java
public class HandCheckLong {
    public static void main(String[] args) {
        long balance = 100_000_000;   // tiền gốc (đồng)
        long annualRate = 6;          // 6%/năm (tạm dùng số nguyên cho dễ)

        for (int period = 1; period <= 3; period++) {
            // lãi = số dư × 6 / 1200; nhân TRƯỚC rồi mới chia
            long interest = balance * annualRate / 1200;
            balance = balance + interest;   // lãi nhập gốc
            System.out.println("Kỳ " + period + ": lãi = " + interest
                    + ", số dư = " + balance);
        }
    }
}
```

**Kết quả khi chạy:**

```text
Kỳ 1: lãi = 500000, số dư = 100500000
Kỳ 2: lãi = 502500, số dư = 101002500
Kỳ 3: lãi = 505012, số dư = 101507512
```

**Giải thích từng bước:**

1. `balance` giữ số dư, khởi đầu bằng tiền gốc.
2. Mỗi vòng `for` là một kỳ. `balance * annualRate / 1200` nhân trước rồi chia, đúng công thức.
3. Kỳ 1 và 2 khớp bảng tính tay. **Kỳ 3 ra 505.012, thiếu 1 đồng!** Phép chia hai số nguyên
   trong Java **cắt bỏ phần lẻ** (bài 4): 606.015.000 / 1200 = 505.012,5 bị cắt còn 505.012,
   không làm tròn.

Vậy `long` không làm tròn được, và cũng không chứa được lãi suất `5.1`. Ta cần một kiểu có phần
thập phân. Ứng viên đầu tiên ai cũng nghĩ tới là `double`. Phần 3 sẽ thử.

### ⚠️ Lỗi hay gặp

**Chia số nguyên trước khi nhân.** Viết `6 / 12` cho "gọn" thì kết quả bằng 0, vì 6 / 12 = 0,5 bị
cắt thành 0:

```java
        long interest = balance * (6 / 12) / 100;   // chia 6 cho 12 TRƯỚC
```

```text
Lãi kỳ 1 = 0
```

**Cách sửa:** với số nguyên, luôn **nhân trước, chia sau** (`balance * 6 / 1200`). Tốt hơn nữa là
dùng `BigDecimal` như phần 4.

---

## 3. Phiên bản 1: dùng `double` và cái giá phải trả

**Ý tưởng nôm na:** `double` giống một cái thước chỉ có vạch nhị phân (1/2, 1/4, 1/8...). Số 0,00425
không rơi đúng vào vạch nào, nên `double` ghi số **gần nhất** nó có. Hầu hết lúc lệch không ai
thấy. Nhưng ngân hàng làm tròn về đồng, và chỉ cần lệch đúng ở ranh giới làm tròn là mất 1 đồng.

Ví dụ: gốc 120.000.000 đ, lãi suất 5,1%/năm. Lần này làm tròn hẳn hoi bằng `Math.round`:

```java
public class CompoundDouble {
    public static void main(String[] args) {
        double balance = 120_000_000;      // tiền gốc 120 triệu đồng
        double annualRate = 5.1;           // lãi suất 5,1%/năm
        double monthlyRate = annualRate / 100 / 12;

        System.out.println("Lãi suất tháng: " + monthlyRate);
        for (int period = 1; period <= 3; period++) {
            double rawInterest = balance * monthlyRate;   // lãi "thô", chưa làm tròn
            long interest = Math.round(rawInterest);      // làm tròn về đồng
            balance = balance + interest;                 // lãi nhập gốc
            System.out.println("Kỳ " + period
                    + " | lãi thô = " + rawInterest
                    + " | làm tròn = " + interest
                    + " | số dư = " + balance);
        }
    }
}
```

**Kết quả khi chạy:**

```text
Lãi suất tháng: 0.0042499999999999994
Kỳ 1 | lãi thô = 509999.99999999994 | làm tròn = 510000 | số dư = 1.2051E8
Kỳ 2 | lãi thô = 512167.49999999994 | làm tròn = 512167 | số dư = 1.21022167E8
Kỳ 3 | lãi thô = 514344.2097499999 | làm tròn = 514344 | số dư = 1.21536511E8
```

<svg viewBox="0 0 740 270" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vì sao double làm lệch 1 đồng ở kỳ 2. Lãi suất tháng thật là 5,1 chia 1200 bằng 0,00425, nhưng double chỉ lưu được 0,0042499999999999994. Trên trục số phóng to từ 512.167 đến 512.168, ranh giới làm tròn nằm ở 512.167,5. Lãi thật bằng đúng 512.167,5 nên HALF_UP làm tròn lên 512.168. Lãi tính bằng double là 512.167,49999999994, nằm sát bên trái ranh giới, nên Math.round làm tròn xuống 512.167, thiếu 1 đồng.">
  <defs>
    <marker id="b7-dbl-arrow-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#DC2626"/>
    </marker>
    <marker id="b7-dbl-arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#047857"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="10" y="10" width="350" height="54" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="24" y="32" fill="#047857">Lãi suất tháng thật: 5,1 / 1200</text>
    <text x="24" y="52" fill="#047857" font-family="monospace">= 0.00425</text>
    <rect x="380" y="10" width="350" height="54" rx="8" fill="#FEF2F2" stroke="#DC2626"/>
    <text x="394" y="32" fill="#DC2626">double lưu được (gần đúng nhất):</text>
    <text x="394" y="52" fill="#DC2626" font-family="monospace">0.0042499999999999994</text>
    <text x="370" y="92" text-anchor="middle" fill="#64748B">Kỳ 2: số dư 120.510.000 × lãi suất tháng (trục số phóng to rất nhiều lần)</text>
    <rect x="80" y="120" width="290" height="26" fill="#FEF2F2"/>
    <rect x="370" y="120" width="290" height="26" fill="#ECFDF5"/>
    <text x="225" y="138" text-anchor="middle" fill="#DC2626" font-size="11">vùng làm tròn XUỐNG</text>
    <text x="515" y="138" text-anchor="middle" fill="#047857" font-size="11">vùng làm tròn LÊN (HALF_UP)</text>
    <line x1="80" y1="160" x2="660" y2="160" stroke="#0F172A" stroke-width="1.5"/>
    <line x1="80" y1="152" x2="80" y2="168" stroke="#0F172A" stroke-width="1.5"/>
    <line x1="660" y1="152" x2="660" y2="168" stroke="#0F172A" stroke-width="1.5"/>
    <line x1="370" y1="114" x2="370" y2="172" stroke="#D97706" stroke-width="1.5" stroke-dasharray="4 3"/>
    <text x="72" y="165" text-anchor="end" fill="#0F172A" font-family="monospace">512.167</text>
    <text x="668" y="165" text-anchor="start" fill="#0F172A" font-family="monospace">512.168</text>
    <circle cx="370" cy="160" r="6" fill="#10B981"/>
    <circle cx="350" cy="160" r="6" fill="#DC2626"/>
    <path d="M370,168 C390,215 560,215 652,170" fill="none" stroke="#047857" stroke-width="1.5" marker-end="url(#b7-dbl-arrow-green)"/>
    <path d="M350,168 C330,215 170,215 88,170" fill="none" stroke="#DC2626" stroke-width="1.5" marker-end="url(#b7-dbl-arrow-red)"/>
    <text x="548" y="232" text-anchor="middle" fill="#047857">BigDecimal: 512167.5 → 512.168 ✓</text>
    <text x="195" y="232" text-anchor="middle" fill="#DC2626">double: 512167.49999999994 → 512.167 ✗</text>
    <text x="370" y="258" text-anchor="middle" fill="#64748B" font-size="11">Sai số rất nhỏ, nhưng nằm đúng ranh giới làm tròn thì thành lệch hẳn 1 đồng</text>
  </g>
</svg>

**Giải thích từng bước:**

1. `5.1 / 100 / 12` lẽ ra là 0,00425. `double` không lưu được đúng số này nên lưu
   `0.0042499999999999994`. `double` là số dấu phẩy động nhị phân 64 bit theo chuẩn IEEE 754 [4]
   (chuẩn quốc tế quy định cách máy tính lưu số thực ở hệ nhị phân, gần như mọi ngôn ngữ đều dùng),
   và 0,00425 không có biểu diễn nhị phân hữu hạn. Giống như 1/3 không viết hết được ở hệ thập phân.
2. Kỳ 1: lãi thật là 510.000, `double` ra `509999.99999999994`. `Math.round` làm tròn về số nguyên
   gần nhất [8] nên vẫn ra 510.000. Lần này may mắn.
3. **Kỳ 2: lãi thật là đúng 512.167,5**, phải làm tròn lên 512.168. Nhưng `double` ra
   `512167.49999999994`, nằm *ngay dưới* ranh giới 0,5, nên `Math.round` làm tròn **xuống** 512.167.
   **Thiếu 1 đồng.**
4. Từ kỳ 2, số dư đã sai, và mọi kỳ sau tính lãi trên số dư sai. Chạy đủ 12 tháng, bản `double`
   ra số dư cuối 126.265.099 đ, còn đáp án đúng (phần 4) là **126.265.100 đ**.
5. Thêm một điểm khó chịu: số dư in ra dạng `1.2051E8` (nghĩa là 1,2051 × 10⁸). `Double.toString`
   tự chuyển sang dạng khoa học khi số từ 10⁷ trở lên [7]. Khách hàng không đọc kiểu đó.

1 đồng nghe có vẻ nhỏ. Nhưng nhân với hàng triệu tài khoản và mỗi ngày đối soát, đó là lệch sổ
sách: kế toán không khớp, kiểm toán hỏi, khách khiếu nại. **Quy tắc của nghề: tiền không dùng
`double` hay `float`.**

### ⚠️ Lỗi hay gặp

**"Làm tròn khi in" để giấu sai số.** In bằng `%.2f` trông đúng, nhưng giá trị bên trong vẫn lệch,
và mọi phép so sánh, cộng dồn sau đó vẫn dùng giá trị lệch:

```java
        double total = 0.1 + 0.2;            // ví dụ kinh điển
        System.out.println(total);           // in đủ chữ số
        System.out.printf("%.2f%n", total);  // làm tròn khi IN, trông có vẻ đúng
        System.out.println(total == 0.3);    // nhưng giá trị bên trong vẫn lệch
```

```text
0.30000000000000004
0.30
false
```

**Cách sửa:** đừng vá ở chỗ in. Đổi kiểu dữ liệu tính tiền sang `BigDecimal`.

---

## 4. Phiên bản 2: `BigDecimal`, đúng tới từng đồng

**Ý tưởng nôm na:** `BigDecimal` tính như kế toán viên cầm bút: lưu số ở **hệ thập phân**, giữ
từng chữ số, và chỉ làm tròn khi **bạn ra lệnh**, theo đúng luật **bạn chọn**.

Bên trong, một `BigDecimal` gồm một số nguyên (*unscaled value*) và một `scale`: số chữ số sau dấu
chấm [1]. Ví dụ `512167.5` là 5121675 với scale 1.

<svg viewBox="0 0 740 210" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kỳ 2 tính bằng BigDecimal qua 4 bước. Bắt đầu với số dư 120510000 và lãi suất 5.1. Bước 1 multiply annualRate cho 614601000.0, phép nhân luôn chính xác. Bước 2 divide cho 1200 với MathContext.DECIMAL128 cho 512167.5, giữ tối đa 34 chữ số có nghĩa. Bước 3 setScale 0 với HALF_UP cho 512168, làm tròn về đồng. Bước 4 balance.add cộng lãi vào số dư được 121022168. Scale, tức số chữ số sau dấu chấm, lần lượt là 1, 1, 0, 0.">
  <defs>
    <marker id="b7-bd-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <text x="370" y="22" fill="#0F172A">Kỳ 2: số dư = <tspan font-family="monospace" fill="#1D4ED8">120510000</tspan>, lãi suất năm = <tspan font-family="monospace" fill="#1D4ED8">"5.1"</tspan></text>
    <rect x="10" y="45" width="165" height="100" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="92" y="68" fill="#1D4ED8" font-family="monospace" font-size="11">multiply(annualRate)</text>
    <text x="92" y="100" fill="#0F172A" font-family="monospace" font-size="14" font-weight="bold">614601000.0</text>
    <text x="92" y="130" fill="#64748B" font-size="11">nhân: luôn chính xác</text>
    <line x1="175" y1="95" x2="191" y2="95" stroke="#64748B" stroke-width="1.5" marker-end="url(#b7-bd-arrow)"/>
    <rect x="195" y="45" width="175" height="100" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="282" y="68" fill="#1D4ED8" font-family="monospace" font-size="11">divide(1200, DECIMAL128)</text>
    <text x="282" y="100" fill="#0F172A" font-family="monospace" font-size="14" font-weight="bold">512167.5</text>
    <text x="282" y="130" fill="#64748B" font-size="11">chia: tối đa 34 chữ số</text>
    <line x1="370" y1="95" x2="386" y2="95" stroke="#64748B" stroke-width="1.5" marker-end="url(#b7-bd-arrow)"/>
    <rect x="390" y="45" width="165" height="100" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="472" y="68" fill="#D97706" font-family="monospace" font-size="11">setScale(0, HALF_UP)</text>
    <text x="472" y="100" fill="#0F172A" font-family="monospace" font-size="14" font-weight="bold">512168</text>
    <text x="472" y="130" fill="#64748B" font-size="11">làm tròn về đồng</text>
    <line x1="555" y1="95" x2="571" y2="95" stroke="#64748B" stroke-width="1.5" marker-end="url(#b7-bd-arrow)"/>
    <rect x="575" y="45" width="155" height="100" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="652" y="68" fill="#047857" font-family="monospace" font-size="11">balance.add(interest)</text>
    <text x="652" y="100" fill="#0F172A" font-family="monospace" font-size="14" font-weight="bold">121022168</text>
    <text x="652" y="130" fill="#64748B" font-size="11">lãi nhập gốc</text>
    <text x="40" y="180" text-anchor="start" fill="#64748B">scale (số chữ số sau dấu chấm):</text>
    <text x="92" y="200" fill="#0F172A" font-family="monospace">1</text>
    <text x="282" y="200" fill="#0F172A" font-family="monospace">1</text>
    <text x="472" y="200" fill="#0F172A" font-family="monospace">0</text>
    <text x="652" y="200" fill="#0F172A" font-family="monospace">0</text>
  </g>
</svg>

Cùng bài toán 120 triệu, 5,1%:

```java
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

public class CompoundBigDecimal {
    public static void main(String[] args) {
        BigDecimal balance = new BigDecimal("120000000");  // tiền gốc, tạo từ String
        BigDecimal annualRate = new BigDecimal("5.1");     // 5,1%/năm, tạo từ String
        BigDecimal divisor = new BigDecimal("1200");       // 100 (đổi % ra số) × 12 (tháng)

        for (int period = 1; period <= 3; period++) {
            // Lãi kỳ = số dư × lãi suất năm / 1200
            // MathContext.DECIMAL128: giữ tối đa 34 chữ số có nghĩa khi chia
            BigDecimal exactInterest = balance.multiply(annualRate)
                                              .divide(divisor, MathContext.DECIMAL128);
            // Làm tròn HALF_UP về 0 chữ số thập phân, tức là về đồng
            BigDecimal interest = exactInterest.setScale(0, RoundingMode.HALF_UP);
            balance = balance.add(interest);               // lãi nhập gốc
            System.out.println("Kỳ " + period
                    + " | lãi chính xác = " + exactInterest
                    + " | làm tròn = " + interest
                    + " | số dư = " + balance);
        }
    }
}
```

**Kết quả khi chạy:**

```text
Kỳ 1 | lãi chính xác = 510000.0 | làm tròn = 510000 | số dư = 120510000
Kỳ 2 | lãi chính xác = 512167.5 | làm tròn = 512168 | số dư = 121022168
Kỳ 3 | lãi chính xác = 514344.214 | làm tròn = 514344 | số dư = 121536512
```

**Đối chiếu ba cách tính** (gốc 120.000.000 đ, 5,1%/năm):

| Kỳ | Lãi thật (tính tay) | `double` + `Math.round` | `BigDecimal` + `HALF_UP` |
|----|---------------------|-------------------------|--------------------------|
| 1 | 510.000 | 510.000 | 510.000 ✅ |
| 2 | 512.167,5 → **512.168** | 512.167 ⚠️ | 512.168 ✅ |
| 3 | 514.344,214 → **514.344** | 514.344 | 514.344 ✅ |
| Số dư sau 12 kỳ | **126.265.100** | 126.265.099 ⚠️ | 126.265.100 ✅ |

(Kỳ 3 cùng ra 514.344, nhưng bản `double` cộng vào một số dư đã thiếu 1 đồng từ kỳ 2.)

**Giải thích từng bước:**

1. `new BigDecimal("120000000")`, `new BigDecimal("5.1")`: tạo **từ chuỗi** để giữ đúng con số
   bạn viết. Phần lỗi hay gặp bên dưới cho thấy vì sao không tạo từ `double`.
2. `balance.multiply(annualRate)`: phép nhân `BigDecimal` luôn chính xác tuyệt đối, kết quả có
   scale = tổng scale hai số (0 + 1 = 1), nên ra `614601000.0` ở kỳ 2.
3. `.divide(divisor, MathContext.DECIMAL128)`: phép chia có thể ra số thập phân vô hạn (như 7/1200),
   nên phải nói trước "giữ bao nhiêu chữ số". **`MathContext.DECIMAL128`** giữ tối đa 34 chữ số có
   nghĩa [3]. Kể cả khi phần nguyên dài tới 20 chữ số, vẫn còn 14 chữ số sau dấu chấm, quá đủ cho
   bước làm tròn về đồng ngay sau đó.
4. `.setScale(0, RoundingMode.HALF_UP)`: làm tròn về 0 chữ số thập phân, tức là về đồng.
   **`HALF_UP`** làm tròn ra xa số 0 nếu phần bỏ đi ≥ 0,5 [2]. Đây là bước làm tròn **duy nhất**
   quyết định tiền của khách.
5. `balance = balance.add(interest)`: `BigDecimal` là **bất biến** (*immutable*): `add` không sửa
   `balance` mà trả về một object mới [1]. Vì vậy phải **gán lại**.

> 💡 Còn một cách viết khác cũng đúng: chia một lần và làm tròn luôn,
> `balance.multiply(annualRate).divide(new BigDecimal("1200"), 0, RoundingMode.HALF_UP)`. Tham số
> thứ hai là scale của kết quả (0 = về đồng). Bài này dùng cách `MathContext` + `setScale` để bạn
> nhìn rõ hai bước "chia" và "làm tròn".

### ⚠️ Lỗi hay gặp

**1. Tạo `BigDecimal` từ `double`.** Con số đã lệch từ lúc là `double`, `BigDecimal` chỉ chép lại
nguyên vẹn cái lệch đó. Javadoc cũng khuyên dùng constructor nhận `String` [1]:

```java
        System.out.println(new BigDecimal(5.1));     // SAI: tạo từ double
        System.out.println(new BigDecimal("5.1"));   // ĐÚNG: tạo từ String
```

```text
5.0999999999999996447286321199499070644378662109375
5.1
```

**Cách sửa:** `new BigDecimal("5.1")`, hoặc `BigDecimal.valueOf(...)` cho số nguyên `long`.

**2. Chia mà không nói cách làm tròn.** `divide` một tham số đòi kết quả phải chính xác tuyệt đối.
Số thập phân vô hạn thì nó ném `ArithmeticException` [1]:

```java
        BigDecimal rate = new BigDecimal("7");                 // 7%/năm
        System.out.println(rate.divide(new BigDecimal("1200")));  // 7/1200 = 0,0058333...
```

```text
Exception in thread "main" java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.
	at java.base/java.math.BigDecimal.divide(BigDecimal.java:1783)
	at DivideNoContext.main(DivideNoContext.java:6)
```

**Cách sửa:** luôn truyền `MathContext` (như `divide(x, MathContext.DECIMAL128)`) hoặc scale +
`RoundingMode` (như `divide(x, 0, RoundingMode.HALF_UP)`). Ví dụ 5,1% ở trên tình cờ chia ra số
hữu hạn, nhưng đổi sang 7% là chương trình "chết" nếu bạn quên.

**3. Gọi `add` mà quên gán lại.**

```java
        BigDecimal balance = new BigDecimal("100000000");
        BigDecimal interest = new BigDecimal("500000");
        balance.add(interest);              // tưởng là cộng vào balance...
        System.out.println(balance);        // ...nhưng balance không đổi
        balance = balance.add(interest);    // đúng: gán kết quả mới lại
        System.out.println(balance);
```

```text
100000000
100500000
```

**Cách sửa:** `balance = balance.add(interest);`. Code biên dịch được, chạy không báo lỗi, chỉ có
lãi "biến mất". Đây là lỗi nguy hiểm nhất vì nó im lặng.

---

## 5. Thiết kế class: ai lo việc gì

**Ý tưởng nôm na:** ở chi nhánh ngân hàng, giao dịch viên nhận yêu cầu, bộ phận tính lãi tính
toán, còn tờ sao kê chỉ là giấy ghi kết quả. Không ai làm hộ việc của ai. Chương trình của mình
cũng chia như vậy, mỗi class một trách nhiệm (bài 6).

<svg viewBox="0 0 740 320" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sơ đồ 4 class và trách nhiệm, mọi field đều private. Main có main và printTable, lo điều phối. Main gọi ConsoleInput (field scanner, method readLong và readDecimal) để nhập và hỏi lại khi sai. Main gọi InterestCalculator (field principal, annualRate, months; method monthlyInterest và schedule trả về mảng PeriodRow) chỉ để tính toán, không in. InterestCalculator tạo ra các PeriodRow (field private period, interest, balance và getter getPeriod, getInterest, getBalance), mỗi object là một dòng bảng chỉ đọc. Main đọc mảng PeriodRow qua getter để in bảng.">
  <defs>
    <marker id="b7-cls-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <rect x="255" y="10" width="230" height="100" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="370" y="30" text-anchor="middle" fill="#1D4ED8" font-weight="bold">Main</text>
    <line x1="255" y1="38" x2="485" y2="38" stroke="#2563EB"/>
    <text x="268" y="56" fill="#0F172A" font-family="monospace" font-size="11">main(String[] args)</text>
    <text x="268" y="74" fill="#0F172A" font-family="monospace" font-size="11">printTable(rows, principal)</text>
    <text x="370" y="100" text-anchor="middle" fill="#64748B" font-size="11">điều phối + in bảng</text>
    <rect x="10" y="150" width="210" height="148" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="115" y="170" text-anchor="middle" fill="#0F172A" font-weight="bold">ConsoleInput</text>
    <line x1="10" y1="178" x2="220" y2="178" stroke="#94A3B8"/>
    <text x="20" y="196" fill="#0F172A" font-family="monospace" font-size="11">- scanner</text>
    <line x1="10" y1="204" x2="220" y2="204" stroke="#94A3B8"/>
    <text x="20" y="222" fill="#0F172A" font-family="monospace" font-size="11">readLong(prompt, min, max)</text>
    <text x="20" y="240" fill="#0F172A" font-family="monospace" font-size="11">readDecimal(prompt,min,max)</text>
    <line x1="10" y1="262" x2="220" y2="262" stroke="#94A3B8"/>
    <text x="115" y="284" text-anchor="middle" fill="#64748B" font-size="11">nhập + hỏi lại khi sai</text>
    <rect x="250" y="150" width="230" height="148" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="365" y="170" text-anchor="middle" fill="#047857" font-weight="bold">InterestCalculator</text>
    <line x1="250" y1="178" x2="480" y2="178" stroke="#10B981"/>
    <text x="260" y="196" fill="#0F172A" font-family="monospace" font-size="11">- principal, annualRate, months</text>
    <line x1="250" y1="204" x2="480" y2="204" stroke="#10B981"/>
    <text x="260" y="222" fill="#0F172A" font-family="monospace" font-size="11">monthlyInterest(balance)</text>
    <text x="260" y="240" fill="#0F172A" font-family="monospace" font-size="11">schedule(): PeriodRow[]</text>
    <line x1="250" y1="262" x2="480" y2="262" stroke="#10B981"/>
    <text x="365" y="284" text-anchor="middle" fill="#64748B" font-size="11">chỉ tính toán, không in</text>
    <rect x="530" y="150" width="200" height="148" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="630" y="170" text-anchor="middle" fill="#D97706" font-weight="bold">PeriodRow</text>
    <line x1="530" y1="178" x2="730" y2="178" stroke="#D97706"/>
    <text x="540" y="196" fill="#0F172A" font-family="monospace" font-size="11">- period, interest, balance</text>
    <line x1="530" y1="204" x2="730" y2="204" stroke="#D97706"/>
    <text x="540" y="222" fill="#0F172A" font-family="monospace" font-size="11">getPeriod()</text>
    <text x="540" y="238" fill="#0F172A" font-family="monospace" font-size="11">getInterest()</text>
    <text x="540" y="254" fill="#0F172A" font-family="monospace" font-size="11">getBalance()</text>
    <line x1="530" y1="262" x2="730" y2="262" stroke="#D97706"/>
    <text x="630" y="284" text-anchor="middle" fill="#64748B" font-size="11">một dòng bảng, chỉ đọc</text>
    <line x1="290" y1="110" x2="140" y2="146" stroke="#64748B" stroke-width="1.5" marker-end="url(#b7-cls-arrow)"/>
    <text x="150" y="128" fill="#64748B" font-size="11">1. hỏi input</text>
    <line x1="365" y1="110" x2="365" y2="146" stroke="#64748B" stroke-width="1.5" marker-end="url(#b7-cls-arrow)"/>
    <text x="372" y="134" fill="#64748B" font-size="11">2. tính</text>
    <line x1="450" y1="110" x2="600" y2="146" stroke="#64748B" stroke-width="1.5" stroke-dasharray="5 3" marker-end="url(#b7-cls-arrow)"/>
    <text x="548" y="128" fill="#64748B" font-size="11">3. đọc để in</text>
    <line x1="480" y1="218" x2="526" y2="218" stroke="#64748B" stroke-width="1.5" marker-end="url(#b7-cls-arrow)"/>
    <text x="505" y="210" text-anchor="middle" fill="#64748B" font-size="11">tạo</text>
    <text x="10" y="312" fill="#64748B" font-size="11">Dấu "-" = field private (chỉ code trong class đó chạm được). Bên ngoài đọc qua getter.</text>
  </g>
</svg>

| Class | Trách nhiệm | Không được làm |
|-------|-------------|----------------|
| `Main` | Điều phối: hỏi input, gọi tính, in bảng | Tự tính lãi |
| `ConsoleInput` | Đọc bàn phím, hỏi lại khi sai | Tính toán |
| `InterestCalculator` | Tính lãi từng kỳ, trả về mảng kết quả | In ra màn hình, đọc bàn phím |
| `PeriodRow` | Giữ dữ liệu một dòng: kỳ, lãi, số dư, cho đọc qua getter | Cho sửa dữ liệu |

Nhờ `InterestCalculator` không đụng tới bàn phím hay màn hình, bạn kiểm tra được nó bằng một
chương trình nhỏ, không cần gõ gì. Sau này đổi giao diện (web, app) cũng không phải sửa phần tính.

Cả 4 class đặt trong cùng một thư mục, mỗi class một file (bài 6). Không class nào có `package`
(Chặng 2 sẽ học).

Mọi field đều là **`private`**, đúng như bài 6 dạy: khách không được tự mở két, muốn đọc phải qua
quầy (getter). Thêm **`final`** (bài 3) cho field nghĩa là nó chỉ được gán **một lần**, trong
constructor, rồi không đổi nữa. `PeriodRow` là ví dụ rất hợp: dòng sao kê đã in ra thì không ai
được sửa. Vì vậy `PeriodRow` chỉ có getter, không có setter hay method nào thay đổi dữ liệu.

### 5.1. `PeriodRow` và `InterestCalculator`

```java
import java.math.BigDecimal;

// Một dòng của bảng kết quả = kết quả của một kỳ (một tháng)
class PeriodRow {
    // private: chỉ PeriodRow chạm được; final: gán một lần trong constructor rồi thôi
    private final int period;           // kỳ thứ mấy: 1, 2, 3...
    private final BigDecimal interest;  // lãi của kỳ này (đồng)
    private final BigDecimal balance;   // số dư cuối kỳ, đã cộng lãi (đồng)

    PeriodRow(int period, BigDecimal interest, BigDecimal balance) {
        this.period = period;
        this.interest = interest;
        this.balance = balance;
    }

    // Getter: bên ngoài chỉ được ĐỌC, không có cách nào sửa
    int getPeriod() {
        return period;
    }

    BigDecimal getInterest() {
        return interest;
    }

    BigDecimal getBalance() {
        return balance;
    }
}
```

```java
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

// Chỉ lo TÍNH TOÁN: không đọc bàn phím, không in ra màn hình
class InterestCalculator {
    private final BigDecimal principal;   // tiền gốc (đồng)
    private final BigDecimal annualRate;  // lãi suất năm, đơn vị %: 6 nghĩa là 6%/năm
    private final int months;             // kỳ hạn (số tháng)

    InterestCalculator(BigDecimal principal, BigDecimal annualRate, int months) {
        this.principal = principal;
        this.annualRate = annualRate;
        this.months = months;
    }

    // Lãi một kỳ = số dư × lãi suất năm / 100 / 12, làm tròn HALF_UP về đồng
    BigDecimal monthlyInterest(BigDecimal balance) {
        BigDecimal exact = balance.multiply(annualRate)
                                  .divide(new BigDecimal("1200"), MathContext.DECIMAL128);
        return exact.setScale(0, RoundingMode.HALF_UP);
    }

    // Tính cả lịch trả lãi: phần tử thứ i của mảng là kỳ thứ i + 1
    PeriodRow[] schedule() {
        PeriodRow[] rows = new PeriodRow[months];
        BigDecimal balance = principal;
        for (int i = 0; i < months; i++) {
            BigDecimal interest = monthlyInterest(balance);
            balance = balance.add(interest);              // lãi nhập gốc
            rows[i] = new PeriodRow(i + 1, interest, balance);
        }
        return rows;
    }
}
```

Chạy thử riêng phần tính bằng một class kiểm tra nhỏ, cùng thư mục:

```java
import java.math.BigDecimal;

// Chạy thử riêng phần tính toán, chưa cần bàn phím
public class CalculatorCheck {
    public static void main(String[] args) {
        InterestCalculator calculator = new InterestCalculator(
                new BigDecimal("100000000"), new BigDecimal("6"), 3);
        PeriodRow[] rows = calculator.schedule();

        for (PeriodRow row : rows) {
            System.out.println("Kỳ " + row.getPeriod() + " | lãi = " + row.getInterest()
                    + " | số dư = " + row.getBalance());
        }
        System.out.println("Số kỳ tính được: " + rows.length);
    }
}
```

```bash
javac -d out *.java
java -cp out CalculatorCheck
```

**Kết quả khi chạy:**

```text
Kỳ 1 | lãi = 500000 | số dư = 100500000
Kỳ 2 | lãi = 502500 | số dư = 101002500
Kỳ 3 | lãi = 505013 | số dư = 101507513
Số kỳ tính được: 3
```

Khớp từng đồng với bảng tính tay ở phần 2, kể cả 505.013 ở kỳ 3. ✅

**Giải thích từng bước:**

1. `javac -d out *.java` biên dịch mọi file `.java` trong thư mục, đặt file `.class` vào thư mục
   `out` (bài 2, bài 6). `java -cp out CalculatorCheck` chạy class có `main`, tìm các class khác trong `out`.
2. `new InterestCalculator(...)` gọi constructor, `this.principal = principal` gán tham số vào field
   (bài 6). Field là `private final` nên đây là lần gán duy nhất; gán lại ở method khác thì `javac`
   báo lỗi.
3. `schedule()` tạo mảng `PeriodRow[]` có đúng `months` phần tử (bài 5). Vòng `for` chạy `i` từ 0,
   nên kỳ thứ `i + 1` nằm ở ô `rows[i]`.
4. Mỗi vòng: gọi `monthlyInterest(balance)` lấy lãi đã làm tròn, cộng vào số dư, rồi tạo một
   `PeriodRow` mới để "chụp" lại trạng thái kỳ đó.
5. `for (PeriodRow row : rows)` là vòng lặp for-each: lần lượt lấy từng phần tử của mảng (bài 5).
   `CalculatorCheck` đọc dữ liệu qua `row.getPeriod()`, `row.getInterest()`, `row.getBalance()`.
   Viết `row.balance` sẽ bị `javac` chặn vì field là `private` (bài 6).

### 5.2. `ConsoleInput`: nhập liệu và hỏi lại khi sai

Đây là lớp "giao dịch viên kiên nhẫn": khách gõ sai thì nhắc lại, không bao giờ làm sập chương trình.
Class khá dài nên chia hai khối. Khối đầu là `readLong`:

```java
import java.math.BigDecimal;
import java.util.Scanner;

// Chỉ lo NHẬP LIỆU: hỏi đi hỏi lại tới khi người dùng gõ đúng
class ConsoleInput {
    private final Scanner scanner;

    ConsoleInput(Scanner scanner) {
        this.scanner = scanner;
    }

    long readLong(String prompt, long min, long max) {
        while (true) {
            System.out.print(prompt);
            if (!scanner.hasNext()) {                  // hết dữ liệu (Ctrl+D, hoặc pipe đã hết)
                System.out.println("\nKhông còn dữ liệu nhập. Thoát.");
                System.exit(1);
            }
            if (!scanner.hasNextLong()) {              // không phải số nguyên
                String wrong = scanner.next();         // BỎ token sai đi, nếu không sẽ lặp mãi
                System.out.println("  -> \"" + wrong + "\" không phải số nguyên hợp lệ (hoặc quá lớn). Nhập lại nhé.");
                continue;
            }
            long value = scanner.nextLong();
            if (value >= min && value <= max) {
                return value;                          // hợp lệ: trả về, thoát vòng lặp
            }
            System.out.println("  -> Cần từ " + min + " đến " + max + ". Nhập lại nhé.");
        }
    }
    // ... readDecimal ở khối tiếp theo ...
}
```

Khối thứ hai nằm tiếp trong cùng class `ConsoleInput`:

```java
    // (tiếp theo, vẫn bên trong class ConsoleInput)
    // Giống readLong, nhưng nhận số thập phân (ví dụ lãi suất 5.1)
    BigDecimal readDecimal(String prompt, BigDecimal min, BigDecimal max) {
        while (true) {
            System.out.print(prompt);
            if (!scanner.hasNext()) {
                System.out.println("\nKhông còn dữ liệu nhập. Thoát.");
                System.exit(1);
            }
            if (!scanner.hasNextBigDecimal()) {
                String wrong = scanner.next();
                System.out.println("  -> \"" + wrong + "\" không phải số. Nhập lại nhé.");
                continue;
            }
            BigDecimal value = scanner.nextBigDecimal();
            // compareTo trả về số âm / 0 / số dương: nhỏ hơn / bằng / lớn hơn
            if (value.compareTo(min) >= 0 && value.compareTo(max) <= 0) {
                return value;
            }
            System.out.println("  -> Cần từ " + min + " đến " + max + ". Nhập lại nhé.");
        }
    }
}
```

Output của class này sẽ được chạy thật ở phần 7 (ca kiểm thử nhập sai).

**Giải thích từng bước** (với `readLong`):

1. `while (true)` lặp mãi, chỉ thoát khi gặp `return` với giá trị hợp lệ (bài 5).
2. `hasNext()` hỏi "còn dữ liệu không?". Nếu input đã hết (bấm Ctrl+D, hoặc pipe hết dòng), ta báo
   rồi `System.exit(1)` kết thúc chương trình với exit code 1, tức là "kết thúc không bình thường" (bài 2).
3. `hasNextLong()` hỏi "token sắp tới có phải số `long` không?" mà **không lấy nó ra** [5]. Một
   **token** là một cụm ký tự liền nhau, ngăn cách bằng khoảng trắng hoặc xuống dòng.
4. Không phải số: `scanner.next()` **lấy token sai ra và bỏ đi**, in thông báo, rồi `continue`
   quay lại đầu vòng lặp hỏi tiếp.
5. Là số: `nextLong()` lấy ra, kiểm tra khoảng `[min, max]`. Đúng thì `return`, sai thì báo và hỏi lại.
6. `readDecimal` làm y hệt nhưng với `BigDecimal`. So sánh `BigDecimal` phải dùng `compareTo`, trả
   về số âm, 0, hoặc số dương khi nhỏ hơn, bằng, hoặc lớn hơn.

Nhờ `hasNextLong()`, bài này kiểm tra "chữ thay vì số" mà **không cần** `try/catch` (xử lý
exception là chủ đề của chặng sau).

### ⚠️ Lỗi hay gặp

**1. Quên `scanner.next()` ở nhánh sai: vòng lặp vô hạn.** `hasNextLong()` không lấy token ra,
nên token `abc` nằm đó mãi và lần nào hỏi cũng sai:

```java
        while (!scanner.hasNextLong()) {
            System.out.println("Không phải số nguyên. Nhập lại nhé.");
            // QUÊN scanner.next(): token "abc" vẫn nằm đó mãi
        }
```

```text
Không phải số nguyên. Nhập lại nhé.
Không phải số nguyên. Nhập lại nhé.
Không phải số nguyên. Nhập lại nhé.
Không phải số nguyên. Nhập lại nhé.
... (in mãi không dừng, phải bấm Ctrl+C)
```

**Cách sửa:** ở nhánh sai, luôn gọi `scanner.next()` để bỏ token đó đi.

**2. So sánh `BigDecimal` bằng `equals`.** `equals` so cả giá trị **lẫn scale**, nên `100.0` và
`100` bị coi là khác nhau [1]:

```java
        BigDecimal rate = new BigDecimal("100.0");  // người dùng gõ 100.0
        BigDecimal max = new BigDecimal("100");
        System.out.println(rate.equals(max));          // so cả scale: 1 chữ số lẻ khác 0
        System.out.println(rate.compareTo(max) == 0);  // chỉ so giá trị
```

```text
false
true
```

**Cách sửa:** so sánh giá trị tiền, lãi suất bằng `compareTo`.

---

## 6. In bảng đẹp bằng `printf`

**Ý tưởng nôm na:** `printf` giống mẫu sao kê in sẵn: mỗi cột có bề rộng cố định, bạn chỉ việc
điền số vào. Số nào cũng căn phải, hàng đơn vị thẳng hàng đơn vị, nhìn là so được ngay.

<svg viewBox="0 0 740 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Giải phẫu chuỗi định dạng printf phần trăm 4d, gạch đứng, phần trăm phẩy 15 chấm 0 f, gạch đứng, phần trăm phẩy 20 chấm 0 f, phần trăm n. Mỗi mã giữ một ô có độ rộng cố định và căn phải: ô 4 ký tự in kỳ 3, ô 15 ký tự in lãi 505.013, ô 20 ký tự in số dư 101.507.513, phần trăm n xuống dòng. Dấu phẩy bật ngăn cách hàng nghìn, chấm 0 nghĩa là không có chữ số thập phân. Với Locale vi-VN dấu ngăn cách là dấu chấm.">
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <text x="20" y="24" text-anchor="start" fill="#64748B">Chuỗi định dạng:</text>
    <rect x="40" y="36" width="70" height="34" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="75" y="58" fill="#1D4ED8" font-family="monospace" font-size="14">%4d</text>
    <rect x="115" y="36" width="40" height="34" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="135" y="58" fill="#64748B" font-family="monospace" font-size="14">|</text>
    <rect x="160" y="36" width="150" height="34" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="235" y="58" fill="#047857" font-family="monospace" font-size="14">%,15.0f</text>
    <rect x="315" y="36" width="40" height="34" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="335" y="58" fill="#64748B" font-family="monospace" font-size="14">|</text>
    <rect x="360" y="36" width="160" height="34" rx="6" fill="#ECFDF5" stroke="#10B981"/>
    <text x="440" y="58" fill="#047857" font-family="monospace" font-size="14">%,20.0f</text>
    <rect x="525" y="36" width="50" height="34" rx="6" fill="#FFFBEB" stroke="#D97706"/>
    <text x="550" y="58" fill="#D97706" font-family="monospace" font-size="14">%n</text>
    <text x="20" y="100" text-anchor="start" fill="#64748B">Kết quả (kỳ 3):</text>
    <rect x="40" y="110" width="70" height="34" fill="none" stroke="#2563EB" stroke-dasharray="4 3"/>
    <text x="104" y="132" text-anchor="end" fill="#0F172A" font-family="monospace" font-size="14">3</text>
    <text x="135" y="132" fill="#64748B" font-family="monospace" font-size="14">|</text>
    <rect x="160" y="110" width="150" height="34" fill="none" stroke="#10B981" stroke-dasharray="4 3"/>
    <text x="304" y="132" text-anchor="end" fill="#0F172A" font-family="monospace" font-size="14">505.013</text>
    <text x="335" y="132" fill="#64748B" font-family="monospace" font-size="14">|</text>
    <rect x="360" y="110" width="160" height="34" fill="none" stroke="#10B981" stroke-dasharray="4 3"/>
    <text x="514" y="132" text-anchor="end" fill="#0F172A" font-family="monospace" font-size="14">101.507.513</text>
    <text x="550" y="132" fill="#D97706" font-size="14">↵</text>
    <text x="75" y="164" fill="#1D4ED8" font-size="11">rộng 4</text>
    <text x="75" y="179" fill="#1D4ED8" font-size="11">căn phải</text>
    <text x="235" y="164" fill="#047857" font-size="11">rộng 15, căn phải</text>
    <text x="235" y="179" fill="#047857" font-size="11">, = ngăn cách nghìn</text>
    <text x="440" y="164" fill="#047857" font-size="11">rộng 20, căn phải</text>
    <text x="440" y="179" fill="#047857" font-size="11">.0 = không số lẻ</text>
    <text x="550" y="164" fill="#D97706" font-size="11">xuống</text>
    <text x="550" y="179" fill="#D97706" font-size="11">dòng</text>
    <rect x="590" y="36" width="140" height="108" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="660" y="62" fill="#0F172A">Locale vi-VN</text>
    <text x="660" y="86" fill="#0F172A" font-family="monospace">101.507.513</text>
    <text x="660" y="112" fill="#64748B" font-size="11">Không truyền Locale</text>
    <text x="660" y="130" fill="#64748B" font-size="11">thì tuỳ máy</text>
    <text x="370" y="215" fill="#64748B" font-size="11">Số rộng hơn ô thì Java vẫn in đủ, chỉ là cột bị xô lệch. Hãy chọn độ rộng đủ cho số lớn nhất.</text>
  </g>
</svg>

`Main` là nơi ghép mọi thứ: hỏi input bằng `ConsoleInput`, tính bằng `InterestCalculator`, rồi in:

```java
import java.math.BigDecimal;
import java.util.Locale;
import java.util.Scanner;

// Điều phối: nhập (ConsoleInput) → tính (InterestCalculator) → in bảng
public class Main {
    public static void main(String[] args) {
        // Locale.US: dấu chấm là dấu thập phân khi NHẬP (5.1), dù máy cài tiếng gì
        Scanner scanner = new Scanner(System.in).useLocale(Locale.US);
        ConsoleInput input = new ConsoleInput(scanner);

        System.out.println("=== TÍNH LÃI KÉP (lãi nhập gốc hằng tháng) ===");
        long principal = input.readLong("Tiền gốc (đồng): ", 1, 1_000_000_000_000L);
        BigDecimal rate = input.readDecimal("Lãi suất năm (%, ví dụ 5.1): ",
                BigDecimal.ZERO, new BigDecimal("100"));
        int months = (int) input.readLong("Kỳ hạn (tháng, 1-360): ", 1, 360);

        InterestCalculator calculator =
                new InterestCalculator(BigDecimal.valueOf(principal), rate, months);
        printTable(calculator.schedule(), BigDecimal.valueOf(principal));
    }

    // In bảng; vi-VN dùng dấu chấm ngăn cách hàng nghìn: 100.000.000
    static void printTable(PeriodRow[] rows, BigDecimal principal) {
        Locale vn = Locale.of("vi", "VN");
        String line = "-----+-----------------+----------------------";
        System.out.println();
        System.out.printf("%4s | %15s | %20s%n", "Kỳ", "Lãi kỳ (đ)", "Số dư (đ)");
        System.out.println(line);
        for (PeriodRow row : rows) {
            System.out.printf(vn, "%4d | %,15.0f | %,20.0f%n",
                    row.getPeriod(), row.getInterest(), row.getBalance());
        }
        System.out.println(line);
        BigDecimal last = rows[rows.length - 1].getBalance();
        System.out.printf(vn, "Tổng lãi: %,.0f đ | Nhận về: %,.0f đ%n",
                last.subtract(principal), last);
    }
}
```

```bash
javac -d out *.java
printf '100000000\n6\n12\n' | java -cp out Main
```

**Kết quả khi chạy:**

```text
=== TÍNH LÃI KÉP (lãi nhập gốc hằng tháng) ===
Tiền gốc (đồng): Lãi suất năm (%, ví dụ 5.1): Kỳ hạn (tháng, 1-360):
  Kỳ |      Lãi kỳ (đ) |            Số dư (đ)
-----+-----------------+----------------------
   1 |         500.000 |          100.500.000
   2 |         502.500 |          101.002.500
   3 |         505.013 |          101.507.513
   4 |         507.538 |          102.015.051
   5 |         510.075 |          102.525.126
   6 |         512.626 |          103.037.752
   7 |         515.189 |          103.552.941
   8 |         517.765 |          104.070.706
   9 |         520.354 |          104.591.060
  10 |         522.955 |          105.114.015
  11 |         525.570 |          105.639.585
  12 |         528.198 |          106.167.783
-----+-----------------+----------------------
Tổng lãi: 6.167.783 đ | Nhận về: 106.167.783 đ
```

**Giải thích từng bước:**

1. `main` tạo `Scanner` với `Locale.US` (để nhập `5.1`), bọc vào `ConsoleInput`, rồi hỏi 3 câu.
2. `(int) input.readLong(...)`: `readLong` trả về `long`, ta **ép kiểu** về `int` (bài 3). An toàn vì
   đã giới hạn 1–360.
3. `BigDecimal.valueOf(principal)` đổi `long` sang `BigDecimal` chính xác.
4. `printTable` dùng `Locale.of("vi", "VN")` khi **in**, giống cách bài 4 định dạng tiền: dấu ngăn
   cách hàng nghìn là dấu chấm, đúng thói quen đọc số của người Việt.
5. Chuỗi định dạng `"%4d | %,15.0f | %,20.0f%n"` [6]:
   - `%4d`: số nguyên, rộng 4 ký tự, căn phải.
   - `%,15.0f`: rộng 15, dấu `,` bật ngăn cách hàng nghìn theo `Locale`, `.0` là 0 chữ số thập phân.
     Với `BigDecimal`, `%f` làm việc thẳng trên giá trị thập phân; nếu phải bớt chữ số thì làm tròn
     `HALF_UP` [6].
   - `%n`: xuống dòng.
6. Tổng lãi = số dư kỳ cuối − tiền gốc. Mọi giá trị đều đọc qua getter (`row.getBalance()`...).
7. `printTable` là method `static` (bài 6): nó không cần object `Main` nào, `main` gọi thẳng được.

> 💡 Hãy để ý quy ước: **nhập** dùng dấu chấm thập phân (`5.1`), **in** dùng dấu chấm ngăn cách
> hàng nghìn (`100.500.000`). Hai việc này dùng hai `Locale` khác nhau, và chương trình ghi rõ ra
> trong câu hỏi `ví dụ 5.1` để người dùng không bối rối.

### ⚠️ Lỗi hay gặp

**1. Dùng `%d` cho `BigDecimal`.** `%d` chỉ nhận các kiểu số nguyên như `int`, `long` [6]:

```java
        System.out.printf("%,.0f%n", new BigDecimal("126265100"));
        System.out.printf("%,d%n", new BigDecimal("126265100"));
```

```text
126,265,100
Exception in thread "main" java.util.IllegalFormatConversionException: d != java.math.BigDecimal
	at java.base/java.util.Formatter$FormatSpecifier.failConversion(Formatter.java:4515)
	... (rút gọn)
```

Dòng đầu chạy được nhưng dùng dấu phẩy ngăn cách (vì không truyền `Locale`, máy này dùng quy ước
tiếng Anh). Dòng thứ hai ném `IllegalFormatConversionException`: "`d` không dùng được cho
`BigDecimal`". **Cách sửa:** dùng `%,.0f` cho `BigDecimal` và truyền `Locale` vi-VN vào `printf`.

**2. Cột quá hẹp.** Nếu số dài hơn bề rộng, Java vẫn in đủ số nhưng cột bị xô lệch. Ví dụ với cột
rộng 16, tiền gốc tối đa của chương trình là 1.000 tỷ (`1.000.000.000.000`, 17 ký tự) đã tràn cột.
**Cách sửa:** đếm số ký tự của số lớn nhất bạn muốn hỗ trợ, cộng cả dấu ngăn cách, rồi chọn bề
rộng. Vì vậy cột số dư ở đây rộng **20**, vừa với số tới 999.999.999.999.999 đ (19 ký tự), dư chỗ
cho tiền gốc 1.000 tỷ cộng lãi. Lãi suất và kỳ hạn cực lớn (ví dụ 100%/năm trong 360 tháng) vẫn có
thể làm số dư vượt cột; khi đó số vẫn in đủ, chỉ là cột lệch.

---

## 7. Chạy và tự kiểm thử

**Ý tưởng nôm na:** đối soát cuối ngày ở ngân hàng: so số của hệ thống với số tính độc lập. Mình
làm y vậy: chạy chương trình với input cố định, rồi so với đáp án tính tay hoặc tính bằng một công
cụ khác.

<svg viewBox="0 0 740 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Quy trình tự kiểm thử. Lệnh printf in ra chuỗi 100000000, xuống dòng, 6, xuống dòng, 12, xuống dòng; mỗi xuống dòng thay cho một lần bấm Enter. Dấu gạch đứng (pipe) nối chuỗi đó vào System.in của lệnh java -cp out Main, Scanner đọc từng token. Chương trình in bảng, dòng cuối là kỳ 12, lãi 528.198, số dư 106.167.783. Kết quả này được so với giá trị kỳ vọng tính độc lập bằng tay hoặc Python decimal là 106.167.783; hai bên khớp.">
  <defs>
    <marker id="b7-test-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="10" y="40" width="200" height="80" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="110" y="62" fill="#0F172A">printf (thay cho bàn phím)</text>
    <text x="110" y="86" fill="#1D4ED8" font-family="monospace">100000000\n6\n12\n</text>
    <text x="110" y="108" fill="#64748B" font-size="11">mỗi \n = một lần Enter</text>
    <line x1="210" y1="80" x2="256" y2="80" stroke="#64748B" stroke-width="1.5" marker-end="url(#b7-test-arrow)"/>
    <text x="233" y="56" fill="#D97706" font-size="11">pipe</text>
    <text x="233" y="74" fill="#D97706" font-family="monospace" font-size="16" font-weight="bold">|</text>
    <rect x="260" y="40" width="200" height="80" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="360" y="62" fill="#1D4ED8" font-family="monospace">java -cp out Main</text>
    <text x="360" y="86" fill="#0F172A" font-size="11">Scanner đọc từng token</text>
    <text x="360" y="104" fill="#0F172A" font-size="11">từ System.in</text>
    <line x1="460" y1="80" x2="506" y2="80" stroke="#64748B" stroke-width="1.5" marker-end="url(#b7-test-arrow)"/>
    <rect x="510" y="40" width="220" height="80" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="620" y="62" fill="#047857">Output thật (dòng cuối)</text>
    <text x="620" y="90" fill="#0F172A" font-family="monospace" font-size="11">12 | 528.198 | 106.167.783</text>
    <line x1="620" y1="120" x2="620" y2="156" stroke="#10B981" stroke-width="1.5" stroke-dasharray="4 3"/>
    <text x="660" y="143" fill="#047857" font-weight="bold">khớp ✓</text>
    <rect x="510" y="160" width="220" height="70" rx="8" fill="#FFFBEB" stroke="#D97706"/>
    <text x="620" y="182" fill="#0F172A">Kỳ vọng, tính độc lập</text>
    <text x="620" y="198" fill="#64748B" font-size="11">(tính tay / Python decimal)</text>
    <text x="620" y="219" fill="#0F172A" font-family="monospace">106.167.783</text>
    <text x="240" y="175" fill="#64748B">Không cần gõ tay mỗi lần chạy:</text>
    <text x="240" y="195" fill="#64748B">input cố định → output phải luôn giống nhau.</text>
  </g>
</svg>

**Cách chạy đầy đủ** (đứng trong thư mục chứa 4 file `PeriodRow.java`, `InterestCalculator.java`,
`ConsoleInput.java`, `Main.java`):

```bash
javac -d out *.java                                # biên dịch cả 4 class
java -cp out Main                                  # chạy, gõ tay từng số
printf '100000000\n6\n12\n' | java -cp out Main    # hoặc: input cố định qua pipe
```

**Bảng ca kiểm thử** (tự tính đáp án trước, rồi mới chạy):

| Ca | Input (gốc, %, tháng) | Kỳ vọng | Kiểm tra điều gì |
|----|----------------------|---------|------------------|
| 1 | 100.000.000; 6; 12 | Số dư cuối 106.167.783, tổng lãi 6.167.783 | Ca chuẩn, kỳ 3 = 505.013 |
| 2 | 120.000.000; 5.1; 12 | Số dư cuối 126.265.100 | Ca mà `double` sai 1 đồng |
| 3 | 100; 6; 3 | Lãi mỗi kỳ 1 đ, số dư 101, 102, 103 | Làm tròn `HALF_UP` ở 0,5 |
| 4 | 50.000.000; 0; 3 | Lãi 0, số dư không đổi | Biên dưới lãi suất |
| 5 | Nhập sai rồi nhập đúng | Báo lỗi, hỏi lại, cuối cùng ra bảng | Kiểm tra đầu vào |
| 6 | Thiếu kỳ hạn | Thông báo hết dữ liệu, mã thoát 1 | Hết input giữa chừng |

Ca 1 đã chạy ở phần 6 và khớp. Đáp án kỳ vọng ở bảng trên được tính độc lập bằng module `decimal`
của Python (làm tròn `ROUND_HALF_UP`), và khớp với chương trình Java ở từng kỳ.

**Ca 3** (100 đồng, 6%, 3 tháng): lãi mỗi kỳ 100 × 0,005 = 0,5 → `HALF_UP` lên 1; kỳ 2:
101 × 0,005 = 0,505 → 1; kỳ 3: 102 × 0,005 = 0,51 → 1.

```bash
printf '100\n6\n3\n' | java -cp out Main
```

```text
=== TÍNH LÃI KÉP (lãi nhập gốc hằng tháng) ===
Tiền gốc (đồng): Lãi suất năm (%, ví dụ 5.1): Kỳ hạn (tháng, 1-360):
  Kỳ |      Lãi kỳ (đ) |            Số dư (đ)
-----+-----------------+----------------------
   1 |               1 |                  101
   2 |               1 |                  102
   3 |               1 |                  103
-----+-----------------+----------------------
Tổng lãi: 3 đ | Nhận về: 103 đ
```

**Ca 4** (lãi suất 0%):

```bash
printf '50000000\n0\n3\n' | java -cp out Main
```

```text
=== TÍNH LÃI KÉP (lãi nhập gốc hằng tháng) ===
Tiền gốc (đồng): Lãi suất năm (%, ví dụ 5.1): Kỳ hạn (tháng, 1-360):
  Kỳ |      Lãi kỳ (đ) |            Số dư (đ)
-----+-----------------+----------------------
   1 |               0 |           50.000.000
   2 |               0 |           50.000.000
   3 |               0 |           50.000.000
-----+-----------------+----------------------
Tổng lãi: 0 đ | Nhận về: 50.000.000 đ
```

**Ca 2 + 5** (nhập sai nhiều kiểu, cuối cùng là 120 triệu, 5.1%, 12 tháng):

```bash
printf 'abc\n-5\n100.000.000\n120000000\n5,1\n150\n5.1\n0\n12\n' | java -cp out Main
```

```text
=== TÍNH LÃI KÉP (lãi nhập gốc hằng tháng) ===
Tiền gốc (đồng):   -> "abc" không phải số nguyên hợp lệ (hoặc quá lớn). Nhập lại nhé.
Tiền gốc (đồng):   -> Cần từ 1 đến 1000000000000. Nhập lại nhé.
Tiền gốc (đồng):   -> "100.000.000" không phải số nguyên hợp lệ (hoặc quá lớn). Nhập lại nhé.
Tiền gốc (đồng): Lãi suất năm (%, ví dụ 5.1):   -> "5,1" không phải số. Nhập lại nhé.
Lãi suất năm (%, ví dụ 5.1):   -> Cần từ 0 đến 100. Nhập lại nhé.
Lãi suất năm (%, ví dụ 5.1): Kỳ hạn (tháng, 1-360):   -> Cần từ 1 đến 360. Nhập lại nhé.
Kỳ hạn (tháng, 1-360):
  Kỳ |      Lãi kỳ (đ) |            Số dư (đ)
-----+-----------------+----------------------
   1 |         510.000 |          120.510.000
   2 |         512.168 |          121.022.168
   3 |         514.344 |          121.536.512
   4 |         516.530 |          122.053.042
   5 |         518.725 |          122.571.767
   6 |         520.930 |          123.092.697
   7 |         523.144 |          123.615.841
   8 |         525.367 |          124.141.208
   9 |         527.600 |          124.668.808
  10 |         529.842 |          125.198.650
  11 |         532.094 |          125.730.744
  12 |         534.356 |          126.265.100
-----+-----------------+----------------------
Tổng lãi: 6.265.100 đ | Nhận về: 126.265.100 đ
```

Đọc output theo thứ tự input: `abc` không phải số; `-5` ngoài khoảng; `100.000.000` (kiểu viết
Việt Nam) không phải số nguyên với `Locale.US`; `120000000` hợp lệ. Lãi suất `5,1` bị từ chối, `150`
quá 100, `5.1` hợp lệ. Kỳ hạn `0` bị từ chối, `12` hợp lệ. Số dư cuối **126.265.100**, đúng đáp án
mà bản `double` đã sai. ✅

**Ca 6** (thiếu kỳ hạn):

```bash
printf '100000000\n6\n' | java -cp out Main; echo "(mã thoát: $?)"
```

```text
=== TÍNH LÃI KÉP (lãi nhập gốc hằng tháng) ===
Tiền gốc (đồng): Lãi suất năm (%, ví dụ 5.1): Kỳ hạn (tháng, 1-360):
Không còn dữ liệu nhập. Thoát.
(mã thoát: 1)
```

**Giải thích từng bước:**

1. `printf '...'` in chuỗi ra, pipe `|` chuyển chuỗi đó thành input bàn phím của `java`.
2. `Scanner` đọc lần lượt từng token. Token sai bị `ConsoleInput` bỏ đi, token đúng được nhận.
3. Mỗi ca có **đáp án tính trước**. Output khớp thì ca đạt. Không khớp thì sửa code, **không** sửa
   đáp án cho khớp output.
4. Input cố định → output luôn giống nhau, nên sau mỗi lần sửa code bạn chạy lại cả bảng ca kiểm
   thử trong vài giây. Chặng 6 sẽ học tự động hoá việc này bằng JUnit.

### ⚠️ Lỗi hay gặp

**1. Nếu máy bạn dùng JDK 21: chạy `java Main.java` với chương trình nhiều file.** Với JDK 25 như
bài 1 hướng dẫn cài, lệnh này chạy bình thường. Nhưng chế độ chạy thẳng file nguồn của JDK 21 chỉ
biên dịch **một** file, nên không thấy các class khác. Output thật trên JDK 21:

```text
Main.java:24: error: cannot find symbol
    static void printTable(PeriodRow[] rows, BigDecimal principal) {
                           ^
  symbol:   class PeriodRow
  location: class Main
...
```

Từ JDK 22 (gồm cả JDK 25), `java Main.java` tự tìm các file nguồn khác trong cùng thư mục [9]. Để chạy được trên
mọi bản JDK, hãy dùng `javac -d out *.java` rồi `java -cp out Main`.

**2. Quên `-cp out`.** File `.class` nằm trong `out`, nhưng `java` mặc định tìm ở thư mục hiện tại:

```text
Error: Could not find or load main class Main
Caused by: java.lang.ClassNotFoundException: Main
```

**Cách sửa:** `java -cp out Main` (`-cp` là *classpath*: nơi `java` đi tìm class, bài 2).

---

## 8. Checklist tự đánh giá

**Ý tưởng nôm na:** trước khi đóng sổ cuối ngày, giao dịch viên rà một danh sách kiểm tra. Trước
khi sang Chặng 2, bạn cũng rà danh sách dưới đây. Mọi ý đều phải "có" thì mới coi là qua checkpoint.

<svg viewBox="0 0 740 312" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Bài checkpoint dùng lại kiến thức của cả 6 bài. Bài 1 · Cú pháp cơ bản dùng cho: class, main, khối { }, comment. Bài 2 · Vòng đời chương trình dùng cho: javac -d out *.java  →  java -cp out Main. Bài 3 · Kiểu, biến, ép kiểu dùng cho: long cho tiền gốc, int cho kỳ, ép (int). Bài 4 · Chuỗi và phép toán dùng cho: BigDecimal, HALF_UP, printf, String. Bài 5 · Mảng, điều kiện, vòng lặp dùng cho: Scanner, while (true), for, PeriodRow[]. Bài 6 · Nhập môn OOP dùng cho: 4 class, private + getter, static, this. Bước tiếp theo là Chặng 2: học sâu hơn về lập trình hướng đối tượng.">
  <defs>
    <marker id="b7-recap-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12">
    <text x="135" y="20" text-anchor="middle" fill="#64748B">Kiến thức đã học</text>
    <text x="530" y="20" text-anchor="middle" fill="#64748B">Dùng ở đâu trong CLI lãi kép</text>
    <rect x="10" y="32" width="250" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="52" fill="#1D4ED8">Bài 1 · Cú pháp cơ bản</text>
    <line x1="260" y1="47" x2="326" y2="47" stroke="#64748B" marker-end="url(#b7-recap-arrow)"/>
    <rect x="330" y="32" width="400" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="342" y="52" fill="#0F172A" font-family="monospace" font-size="11">class, main, khối { }, comment</text>
    <rect x="10" y="70" width="250" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="90" fill="#1D4ED8">Bài 2 · Vòng đời chương trình</text>
    <line x1="260" y1="85" x2="326" y2="85" stroke="#64748B" marker-end="url(#b7-recap-arrow)"/>
    <rect x="330" y="70" width="400" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="342" y="90" fill="#0F172A" font-family="monospace" font-size="11">javac -d out *.java  →  java -cp out Main</text>
    <rect x="10" y="108" width="250" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="128" fill="#1D4ED8">Bài 3 · Kiểu, biến, ép kiểu</text>
    <line x1="260" y1="123" x2="326" y2="123" stroke="#64748B" marker-end="url(#b7-recap-arrow)"/>
    <rect x="330" y="108" width="400" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="342" y="128" fill="#0F172A" font-family="monospace" font-size="11">long cho tiền gốc, int cho kỳ, ép (int)</text>
    <rect x="10" y="146" width="250" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="166" fill="#1D4ED8">Bài 4 · Chuỗi và phép toán</text>
    <line x1="260" y1="161" x2="326" y2="161" stroke="#64748B" marker-end="url(#b7-recap-arrow)"/>
    <rect x="330" y="146" width="400" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="342" y="166" fill="#0F172A" font-family="monospace" font-size="11">BigDecimal, HALF_UP, printf, String</text>
    <rect x="10" y="184" width="250" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="204" fill="#1D4ED8">Bài 5 · Mảng, điều kiện, vòng lặp</text>
    <line x1="260" y1="199" x2="326" y2="199" stroke="#64748B" marker-end="url(#b7-recap-arrow)"/>
    <rect x="330" y="184" width="400" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="342" y="204" fill="#0F172A" font-family="monospace" font-size="11">Scanner, while (true), for, PeriodRow[]</text>
    <rect x="10" y="222" width="250" height="30" rx="6" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="22" y="242" fill="#1D4ED8">Bài 6 · Nhập môn OOP</text>
    <line x1="260" y1="237" x2="326" y2="237" stroke="#64748B" marker-end="url(#b7-recap-arrow)"/>
    <rect x="330" y="222" width="400" height="30" rx="6" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="342" y="242" fill="#0F172A" font-family="monospace" font-size="11">4 class, private + getter, static, this</text>
    <rect x="10" y="268" width="720" height="34" rx="17" fill="#ECFDF5" stroke="#10B981"/>
    <text x="370" y="290" text-anchor="middle" fill="#047857">Qua checkpoint → Chặng 2: học sâu hơn OOP (đóng gói, access modifier, kế thừa, record, enum...)</text>
  </g>
</svg>

**Chương trình:**

- [ ] Biên dịch không lỗi bằng `javac -d out *.java`, chạy bằng `java -cp out Main`.
- [ ] Ca 1 ra đúng số dư cuối 106.167.783 đ, kỳ 3 lãi 505.013 đ.
- [ ] Ca 2 ra đúng 126.265.100 đ.
- [ ] Gõ chữ, số âm, số quá lớn đều được hỏi lại, chương trình không văng exception.
- [ ] Bảng căn cột thẳng hàng, số có dấu ngăn cách hàng nghìn.
- [ ] Không có `double` hay `float` nào dính tới tiền.
- [ ] `InterestCalculator` không có `System.out` hay `Scanner` nào.
- [ ] Mọi field đều `private`; class khác chỉ đọc dữ liệu qua getter.

**Giải thích được bằng lời** (nói to cho một người bạn nghe):

- [ ] Vì sao `double` làm lệch tiền? Dẫn được ví dụ 512.167,49999999994.
- [ ] Vì sao tạo `BigDecimal` từ `String` chứ không từ `double`?
- [ ] Vì sao `divide` cần `MathContext` hoặc scale + `RoundingMode`?
- [ ] Vì sao tách 4 class thay vì viết hết trong `main`?

Muốn thấy "lãi của lãi" lớn cỡ nào, đây là một chương trình nhỏ dùng lại `InterestCalculator` để
so với **lãi đơn** (*simple interest*: lãi chỉ tính trên gốc), **trả một lần cuối kỳ**. Đặt cùng thư
mục với `PeriodRow.java` và `InterestCalculator.java`:

```java
import java.math.BigDecimal;
import java.math.RoundingMode;

public class CompareMaturity {
    public static void main(String[] args) {
        BigDecimal principal = new BigDecimal("100000000");
        BigDecimal annualRate = new BigDecimal("6");
        int months = 12;

        // Lãi cuối kỳ (KHÔNG nhập gốc): gốc × lãi suất năm × số tháng / 1200
        BigDecimal simple = principal.multiply(annualRate)
                .multiply(BigDecimal.valueOf(months))
                .divide(new BigDecimal("1200"), 0, RoundingMode.HALF_UP);

        // Lãi nhập gốc hằng tháng: dùng lại InterestCalculator của bài này
        PeriodRow[] rows = new InterestCalculator(principal, annualRate, months).schedule();
        BigDecimal compound = rows[months - 1].getBalance().subtract(principal);

        System.out.println("Lãi cuối kỳ (không nhập gốc): " + simple);
        System.out.println("Lãi nhập gốc hằng tháng     : " + compound);
        System.out.println("Chênh lệch                  : " + compound.subtract(simple));
    }
}
```

```bash
javac -d out *.java && java -cp out CompareMaturity
```

**Kết quả khi chạy:**

```text
Lãi cuối kỳ (không nhập gốc): 6000000
Lãi nhập gốc hằng tháng     : 6167783
Chênh lệch                  : 167783
```

**Giải thích từng bước:**

1. Lãi đơn trả cuối kỳ = 100.000.000 × 6 × 12 / 1200 = 6.000.000 đ, tính một lần.
2. Lãi nhập gốc lấy từ số dư kỳ cuối của `schedule()`, trừ tiền gốc.
3. Chênh 167.783 đ là "lãi của lãi". Đó chính là ý nghĩa của chữ **kép**. Lưu ý: ví dụ này giả
   định **cùng một mức lãi suất** cho cả hai cách. Ngân hàng thật niêm yết lãi suất khác nhau cho từng
   phương thức trả lãi (lĩnh lãi hằng tháng, cuối kỳ...), nên so sánh này **không** có nghĩa là
   "nhận lãi hằng tháng luôn lợi hơn". Muốn so hai sản phẩm thật, phải dùng đúng lãi suất của từng sản phẩm.
4. `rows[months - 1]` là phần tử cuối mảng: mảng đánh số từ 0 nên kỳ 12 nằm ở ô 11 (bài 5). Số dư
   đọc qua getter `getBalance()` vì field của `PeriodRow` là `private`.

> 💡 Nếu dùng công thức gọn 100.000.000 × (1 + 0,005)¹² bạn sẽ được khoảng 106.167.781,19 đ. Con số
> này khác 106.167.783 của chương trình vì công thức gọn **không làm tròn từng kỳ**. Không bên nào
> "sai": chúng theo hai quy ước khác nhau. Đây là lý do mọi phép tính tiền phải ghi rõ quy ước làm tròn.

### ⚠️ Lỗi hay gặp

**Lấy phần tử cuối bằng `rows[months]`.** Mảng `months` phần tử có chỉ số từ 0 tới `months - 1`.
Viết `rows[months]` sẽ ném `ArrayIndexOutOfBoundsException` (bài 5). Ví dụ rút gọn với mảng `long`:

```java
        int months = 12;
        long[] balances = new long[months];   // 12 ô: chỉ số 0..11
        System.out.println(balances[months]); // SAI: ô số 12 không tồn tại
```

```text
Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 12 out of bounds for length 12
	at LastIndex.main(LastIndex.java:5)
```

**Cách sửa:** `rows[months - 1]` hoặc `rows[rows.length - 1]` như trong `Main`.

---

## Tóm tắt

- Một CLI hoàn chỉnh gồm 3 việc: **nhập** (có kiểm tra), **tính**, **in**. Tách mỗi việc vào một class,
  field để `private` (thêm `final` nếu không đổi), bên ngoài đọc qua getter.
- Luôn **tính tay** vài kỳ trước khi code. Số tính tay là đáp án để chấm chương trình.
- `long` chia nguyên bị **cắt** phần lẻ; `double` lưu số **gần đúng** ở hệ nhị phân. Cả hai đều có thể
  làm lệch tiền, ví dụ kỳ 2 của ca 120 triệu, 5,1%.
- Tiền dùng `BigDecimal`: tạo **từ `String`**, chia có **`MathContext`** hoặc scale, làm tròn bằng
  **`setScale(0, RoundingMode.HALF_UP)`**, nhớ **gán lại** kết quả của `add`.
- So sánh `BigDecimal` bằng `compareTo`, không bằng `equals`.
- `Scanner` + `hasNextLong()`/`hasNextBigDecimal()` + `while (true)` cho phép hỏi lại khi nhập sai mà
  không cần exception. Nhớ `scanner.next()` để bỏ token sai.
- `printf` với `%4d`, `%,15.0f` và `Locale` vi-VN cho bảng thẳng cột, số có dấu chấm ngăn cách.
- Kiểm thử bằng pipe với input cố định, so với đáp án tính độc lập.

## Tự kiểm tra

**1.** Vì sao chương trình dùng `double` ra số dư 126.265.099 đ thay vì 126.265.100 đ (gốc 120 triệu, 5,1%)?

<details><summary>Đáp án</summary>

Vì `double` không lưu được chính xác lãi suất tháng 0,00425 mà lưu 0,0042499999999999994. Ở kỳ 2,
lãi thật là đúng 512.167,5 (phải làm tròn lên 512.168), nhưng `double` tính ra 512.167,49999999994,
nằm ngay dưới ranh giới nên `Math.round` làm tròn xuống 512.167. Số dư thiếu 1 đồng từ kỳ 2 và
kéo theo tới kỳ cuối.

</details>

**2.** `new BigDecimal(5.1)` và `new BigDecimal("5.1")` khác nhau thế nào?

<details><summary>Đáp án</summary>

`5.1` viết không ngoặc là một `double`, đã lệch sẵn. `new BigDecimal(5.1)` chép nguyên giá trị lệch
đó: `5.0999999999999996447286321199499070644378662109375`. `new BigDecimal("5.1")` đọc từ chuỗi nên
đúng là 5.1.

</details>

**3.** Đoạn `new BigDecimal("7").divide(new BigDecimal("1200"))` bị lỗi gì, sửa ra sao?

<details><summary>Đáp án</summary>

7/1200 = 0,0058333... là số thập phân vô hạn, `divide` một tham số không biết dừng ở đâu nên ném
`ArithmeticException: Non-terminating decimal expansion`. Sửa: `divide(x, MathContext.DECIMAL128)`
hoặc `divide(x, scale, RoundingMode.HALF_UP)`.

</details>

**4.** Với quy ước `HALF_UP` về đồng: lãi 505.012,5 thành bao nhiêu? Còn 514.344,214?

<details><summary>Đáp án</summary>

505.012,5 → **505.013** (phần lẻ đúng 0,5 thì làm tròn lên). 514.344,214 → **514.344** (phần lẻ
nhỏ hơn 0,5 thì làm tròn xuống).

</details>

**5.** Nếu trong `readLong` bạn xoá dòng `String wrong = scanner.next();` thì chuyện gì xảy ra khi
người dùng gõ `abc`?

<details><summary>Đáp án</summary>

Vòng lặp vô hạn. `hasNextLong()` chỉ "nhìn" token chứ không lấy ra, nên `abc` nằm mãi ở đầu input.
Lần nào hỏi cũng thấy `abc`, in thông báo lỗi mãi không dừng.

</details>

**6.** Vì sao `InterestCalculator` không được gọi `System.out.println` hay dùng `Scanner`?

<details><summary>Đáp án</summary>

Để mỗi class chỉ có một trách nhiệm. Phần tính toán độc lập với giao diện nên kiểm tra được bằng một
`main` nhỏ (như `CalculatorCheck`), dùng lại được cho web/app sau này, và sửa phần in không làm hỏng
phần tính.

</details>

## Bài tập

**Bài 1 (dễ): Lãi cuối kỳ.** Thêm vào `InterestCalculator` một method `simpleInterest()` trả về lãi
cuối kỳ (không nhập gốc), rồi cho `Main` in thêm dòng so sánh với lãi kép.

> Gợi ý: dùng lại công thức trong `CompareMaturity`. Ca kiểm thử: 100.000.000 đ, 6%, 12 tháng → lãi
> cuối kỳ 6.000.000 đ, chênh lệch 167.783 đ.

**Bài 2 (vừa): Gửi thêm hằng tháng.** Hỏi thêm "Số tiền gửi thêm mỗi tháng (đồng)". Quy ước: cuối
mỗi kỳ, **sau khi** cộng lãi thì cộng thêm khoản gửi. Thêm cột `Gửi thêm` vào bảng.

> Gợi ý: thêm một field `monthlyDeposit` vào `InterestCalculator`, sửa vòng lặp trong `schedule()`.
> Ca kiểm thử: 100.000.000 đ, 6%, 3 tháng, gửi thêm 1.000.000 đ/tháng → lãi 500.000; 507.500;
> 515.038 và số dư 101.500.000; 103.007.500; 104.522.538. Tự tính tay kỳ 3 để thấy 515.037,5 được
> làm tròn lên.

**Bài 3 (khó hơn): Xuất CSV.** Thêm lựa chọn in bảng dạng **CSV** (*comma-separated values*: mỗi
dòng là các giá trị ngăn bằng dấu phẩy, mở được bằng Excel). Ví dụ dòng đầu `ky,lai,so_du`, dòng
sau `1,500000,100500000`. Lưu ra file bằng cách chuyển hướng output:
`printf '...' | java -cp out Main > lai-kep.csv`.

> Gợi ý: trong CSV **không** dùng dấu ngăn cách hàng nghìn (dấu chấm hay phẩy đều làm Excel hiểu
> sai). In `BigDecimal` bằng `toPlainString()`. Đặt phần in CSV trong một method riêng, cạnh
> `printTable`, để không đụng tới `InterestCalculator`.

## Đọc thêm

1. [BigDecimal (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/BigDecimal.html): constructor, `divide`, `equals` và `compareTo`, tính bất biến.
2. [RoundingMode (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/RoundingMode.html): bảng so sánh `HALF_UP`, `HALF_EVEN`, `DOWN`...
3. [MathContext (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/math/MathContext.html): `DECIMAL128` = 34 chữ số, `HALF_EVEN`.
4. [JLS §4.2.3 Floating-Point Types](https://docs.oracle.com/javase/specs/jls/se21/html/jls-4.html#jls-4.2.3): `float`/`double` theo chuẩn IEEE 754.
5. [Scanner (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Scanner.html): `hasNextLong`, `useLocale`, số theo `Locale`.
6. [Formatter (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Formatter.html): cú pháp `%d`, `%f`, cờ `,`, bề rộng.
7. [Double.toString (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Double.html#toString(double)): khi nào in dạng khoa học `1.2051E8`.
8. [Math.round (Java SE 21 API)](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Math.html#round(double)): làm tròn về số nguyên gần nhất.
9. [JEP 458: Launch Multi-File Source-Code Programs](https://openjdk.org/jeps/458): `java Main.java` chạy nhiều file từ JDK 22.
10. [BigDecimal and BigInteger in Java, Baeldung](https://www.baeldung.com/java-bigdecimal-biginteger): ví dụ thực hành với `BigDecimal`.
11. [Java Math Operators and Math Class, Jenkov](https://jenkov.com/tutorials/java/math-operators-and-math-class.html): phép chia nguyên, phép toán số học.
12. [Java Developer Roadmap, roadmap.sh](https://roadmap.sh/java): lộ trình gốc của khoá học.

---

✅ Bạn đã đi hết Chặng 1. Xong checklist ở phần 8 là bạn qua checkpoint.

**Bài tiếp theo:** Chặng 1 kết thúc tại đây. Quay về [Lộ trình Java Developer](/docs/learning/java-roadmap)
để bắt đầu **Chặng 2: Lập trình hướng đối tượng**. Ở đó bạn học **sâu hơn** những gì bài 6 mới mở
đầu (đóng gói, các access modifier, `static`, `final`), rồi sang kế thừa, `record`, `enum`... và mô
hình hoá `Account`, `SavingAccount`, `Transaction`.
