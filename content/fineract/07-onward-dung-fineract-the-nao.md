---
title: "Bài 7 · Onward dùng Fineract thế nào"
description: "Thiết kế module Accounts của Onward đặt Fineract sau một cổng theo năng lực: core giữ số dư và sổ cái, còn Onward giữ vòng đời, hạn chế, quyền sở hữu, lịch chạy và khoá idempotency."
order: 7
tags: [fineract, core-banking, onward, kiến-trúc, port, accounts]
language: vi
profile: onward-fineract-course
classification: public-safe
source_repo: none
source_refs:
  - https://fineract.apache.org/
  - https://github.com/apache/fineract
  - https://github.com/apache/fineract/releases/tag/1.15.0
  - https://fineract.apache.org/docs/current/
---

# Bài 7 · Onward dùng Fineract thế nào

> Sáu bài trước dạy bạn Fineract *làm được gì*. Bài này kể chuyện ngược lại: khi biết rõ core làm gì và
> **không** làm gì, đội Onward đã chia việc giữa "mình" và "core" ra sao. Mọi điều dưới đây lấy từ tài liệu
> thiết kế nội bộ của Onward (module Accounts và ranh giới với Transfers), kể lại bằng lời thường.

> 🎯 **Sau bài này bạn sẽ:**
> 1. Giải thích được vì sao Onward có **nhiều cổng nhỏ** tới core, mỗi cổng theo một năng lực, chứ không phải một cổng chung.
> 2. Nói được cái gì core giữ (số dư, sổ cái, hold) và cái gì Onward giữ (vòng đời, hạn chế, người nắm giữ).
> 3. Hiểu "khối chặn dẫn xuất" (*derived block*): nhiều hạn chế bên mình gộp lại thành **một** block trong core.
> 4. Biết quy trình "gỡ → chi → chặn lại" khi ngân hàng phải trả tiền ra từ một tài khoản đang bị chặn.
> 5. Kể được bốn quyết định "không dùng tính năng có sẵn của core" và lý do: dormancy, standing instruction, đổi sản phẩm, khoá idempotency dùng chung.

**Cần biết trước:** [Bài 2 · Khái niệm cốt lõi](/docs/fineract/khai-niem-cot-loi) (sub-status, block, hold),
[Bài 4 · API từng bước](/docs/fineract/api-tung-buoc) (chuyển tiền, `Idempotency-Key`) và nhất là
[Bài 6 · Hành vi đã kiểm chứng](/docs/fineract/hanh-vi-da-kiem-chung). Bài này dựa trên các hành vi ở Bài 6.

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| Port (cổng) | Một giao diện hẹp mà service của mình gọi; phía sau là core thật | "cổng tài khoản" của module Accounts |
| Adapter | Đoạn code dịch lời gọi qua port thành lời gọi REST tới Fineract | gọi `?command=blockDebit` |
| `accountRef` | Mã tài khoản **do Onward cấp**, không phải id của Fineract | khách hàng và app chỉ thấy mã này |
| AccountHolding (hồ sơ nắm giữ) | Bản ghi bên Onward cho mỗi tài khoản: ai là chủ, số tài khoản hiển thị, trạng thái vòng đời | chủ tài khoản chung, trạng thái Dormant |
| Restriction (hạn chế) | Một lý do bên Onward khiến tài khoản bị hạn chế | khách tự đóng băng, lệnh phong toả pháp lý |
| Derived block (khối chặn dẫn xuất) | Block duy nhất trong core, **tính ra** từ mọi hạn chế đang hiệu lực | freeze + sanctions (đều chặn chiều ra) → `BlockDebit`; chặn ra + chặn vào → `Block` |
| Fail closed | Khi không hỏi được thì **từ chối**, không cho qua | Accounts không trả lời → không chuyển tiền |

## 1. Một câu để nhớ: Fineract là sổ cái, không phải cả ngân hàng

Đội Onward tóm tắt Fineract bằng một câu: **Fineract là một sổ cái, không phải một nền tảng ngân hàng.** Nó
giữ tiền cho đúng: số dư, hold, bút toán kép, sản phẩm, phí, lãi. Còn đăng nhập của khách hàng, thẻ, thanh
toán hoá đơn, thông báo hay chuyển tiền liên ngân hàng thì nó không làm.

Từ câu đó, thiết kế chia việc như sau:

| Core (Fineract) giữ | Onward giữ |
|---|---|
| Tài khoản trong core và **số dư** của nó | Người nắm giữ tài khoản (một hay nhiều chủ), uỷ quyền, người thụ hưởng |
| Sổ cái và mọi bút toán | **Trạng thái vòng đời** theo nghĩa nghiệp vụ: Active, Dormant, Pending closure, Closed |
| Hold (tiền tạm giữ) và lịch sử giao dịch | **Lý do** của từng hold mà mình đặt, và các hạn chế (freeze, phong toả) |
| Sản phẩm và phí trong core | Số tài khoản hiển thị cho khách (IBAN ở thị trường dùng IBAN). Core không có trường IBAN |
| Block (một sub-status duy nhất) | Các "hồ sơ vụ việc": đóng tài khoản, chủ tài khoản qua đời, chuyển số dư vô chủ cho cơ quan quản lý tài sản vô chủ |
| | Xác thực khách hàng và **mọi** kiểm tra "khách này có quyền với tài khoản này không" |

💡 **Vì sao không chép số dư về bên mình cho nhanh?** Vì một bản sao không có thẩm quyền. Hai nơi cùng giữ
số dư thì sớm muộn sẽ lệch, và khi lệch không ai biết bên nào đúng. Thiết kế của Onward cấm lưu số dư, sản
phẩm hay trạng thái phía core. Thứ duy nhất được lưu là **mã định danh** cần để gọi tới tài khoản trong core.
Mỗi lần cần số dư thì đọc qua port.

Có một ngoại lệ có tên: trạng thái vòng đời (Active / Dormant / Pending closure / Closed) được lưu ở bên
Onward. Đây không phải bản sao của `status` trong core. Trạng thái này do **job và hồ sơ của chính Onward**
quyết định, nên Onward là chủ của nó. `status` và `subStatus` của core vẫn là của core, và Onward không đọc
chúng như trạng thái của mình.

## 2. Cổng theo năng lực, và chỉ có cổng khi có thứ để nối

Cách dễ nhất là làm **một** port "Core Banking" cho tất cả module. Onward không chọn cách đó. Mỗi module cần
core thì có một port **hẹp**, đặt tên theo năng lực nó cần: cổng tài khoản cho Accounts, và sau này cổng tiền
gửi có kỳ hạn hay cổng cho vay khi các module đó vào thiết kế.

<svg viewBox="0 0 740 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sơ đồ các cổng theo năng lực. Bên trong khung nền tảng Onward có các module. Module Accounts có cổng tài khoản nối tới Fineract. Module Transfers có cổng nối tới Fineract cho chuyển tiền trong ngân hàng, và nối ra Payment Switch cho chuyển tiền liên ngân hàng. Module Bill Pay không có cổng riêng, nó đi qua Transfers. Các module Auth, Cards và Notifications không có cổng tới core vì core không có gì cho chúng. Tiền gửi có kỳ hạn và cho vay sẽ có cổng riêng khi vào thiết kế.">
  <defs>
    <marker id="f7-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="10" y="10" width="470" height="310" rx="12" fill="#F8FAFC" stroke="#94A3B8" stroke-dasharray="6 4"/>
    <text x="245" y="32" fill="#0F172A" font-weight="bold">Nền tảng Onward</text>

    <rect x="30" y="50" width="200" height="50" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="130" y="71" fill="#1D4ED8">Accounts</text>
    <text x="130" y="88" fill="#64748B" font-size="10">cổng tài khoản</text>

    <rect x="30" y="115" width="200" height="50" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="130" y="136" fill="#1D4ED8">Transfers &amp; Payments</text>
    <text x="130" y="153" fill="#64748B" font-size="10">cổng chuyển tiền trong ngân hàng</text>

    <rect x="30" y="180" width="200" height="50" rx="8" fill="#FFFFFF" stroke="#94A3B8"/>
    <text x="130" y="201" fill="#0F172A">Bill Pay &amp; Top-up</text>
    <text x="130" y="218" fill="#64748B" font-size="10">không cổng riêng, đi qua Transfers</text>

    <rect x="30" y="245" width="200" height="60" rx="8" fill="#FFFFFF" stroke="#94A3B8" stroke-dasharray="4 3"/>
    <text x="130" y="267" fill="#0F172A">Tiền gửi có kỳ hạn · Cho vay</text>
    <text x="130" y="285" fill="#64748B" font-size="10">cổng riêng khi vào thiết kế</text>

    <rect x="260" y="245" width="200" height="60" rx="8" fill="#F1F5F9" stroke="#CBD5E1"/>
    <text x="360" y="267" fill="#475569">Auth · Cards · Notifications</text>
    <text x="360" y="285" fill="#64748B" font-size="10">không cổng: core không có gì cho chúng</text>

    <line x1="130" y1="180" x2="130" y2="169" stroke="#64748B" marker-end="url(#f7-arrow)"/>

    <circle cx="610" cy="105" r="55" fill="#ECFDF5" stroke="#10B981"/>
    <text x="610" y="100" fill="#047857">Fineract</text>
    <text x="610" y="117" fill="#64748B" font-size="10">core banking</text>

    <circle cx="610" cy="250" r="50" fill="#FFF7ED" stroke="#F59E0B"/>
    <text x="610" y="246" fill="#B45309">Payment Switch</text>
    <text x="610" y="262" fill="#64748B" font-size="10">liên ngân hàng</text>

    <line x1="230" y1="75" x2="551" y2="95" stroke="#64748B" marker-end="url(#f7-arrow)"/>
    <line x1="230" y1="140" x2="551" y2="115" stroke="#64748B" marker-end="url(#f7-arrow)"/>
    <line x1="230" y1="150" x2="556" y2="240" stroke="#64748B" stroke-dasharray="4 3" marker-end="url(#f7-arrow)"/>
  </g>
</svg>

Có ba ý trong sơ đồ:

- **Cổng nhỏ thì thay được từng cái.** Nếu một ngày Onward đổi phần tiền gửi sang core khác, phần cho vay
  không phải viết lại. Một port chung sẽ gom ngữ nghĩa của tài khoản, khoản vay, tiền gửi vào một chỗ, và
  "đổi core" khi đó nghĩa là viết lại tất cả cùng lúc.
- **Không có thứ để nối thì không có cổng.** Auth, Cards và Notifications không có gì trong Fineract để nối
  tới, nên chúng không có port tới core. Một port trỏ vào khoảng trống chỉ làm người đọc tưởng có một phụ
  thuộc không tồn tại. Bill Pay thì có trừ tiền tài khoản, nhưng việc đó đi **qua Transfers**, để mọi khoản
  trừ tiền đều qua cùng một chỗ kiểm tra.
- **Transfers có hai phụ thuộc bên ngoài.** Chuyển tiền trong ngân hàng đi qua Fineract. Chuyển tiền sang
  ngân hàng khác đi qua Payment Switch, vì API của core không có khái niệm liên ngân hàng nào: không IBAN,
  không BIC, không định dạng ISO 20022 (kiểm chứng: FIN-TRF-002-a trên 1.15.0).

Đứng sau mọi port hiện nay là cùng **một** instance Fineract 1.15.0. Quyết định "nhiều cổng" là về hình dạng
và phạm vi, không phải đổi công nghệ.

## 3. Mã của mình, quyền của mình

Hai quy tắc đi kèm port, và cả hai đến từ những gì đã đo được trên core:

**Core không bao giờ thấy mã của khách.** Onward cấp `accountRef` cho mỗi tài khoản, rồi tự ánh xạ sang id
tài khoản trong core. Ánh xạ này nằm trên AccountHolding. Id của core không xuất hiện trong API của Onward, và
id do client gửi lên không bao giờ được chuyển thẳng xuống core.

**Mọi kiểm tra quyền sở hữu là việc của Onward.** Lý do: core không làm việc này.

- Một lệnh chuyển ghi tên khách A nhưng chỉ vào tài khoản của khách B vẫn được core nhận. Tiền đi theo
  **tài khoản**, và bản ghi chuyển tiền ghi sai người nhận (kiểm chứng: FIN-OWN-01 trên 1.15.0).
- Một người dùng chỉ được xem chi nhánh của mình thấy 0 tài khoản khi liệt kê, nhưng vẫn đọc được bất kỳ
  tài khoản nào nếu biết id (kiểm chứng: FIN-AUTHZ-03 trên 1.15.0).

Vì vậy mỗi request đi theo thứ tự: tra `accountRef` trên AccountHolding, kiểm tra người gọi là chủ tài khoản
(hoặc có uỷ quyền), rồi mới gọi core bằng id core. Thiết kế coi đây là **nghĩa vụ thường trực** của mọi
service, không phải một lỗ hổng chờ core vá.

## 4. Khối chặn dẫn xuất: nhiều hạn chế, một block

Đây là ý quan trọng nhất của bài.

Phía Onward, một tài khoản có thể cùng lúc có nhiều lý do bị hạn chế. Ví dụ khách tự đóng băng tài khoản, ngân
hàng phong toả theo yêu cầu pháp lý, tài khoản đang Dormant, hay đang chờ đóng (Pending closure).
Nhưng Fineract chỉ có **một** ô sub-status cho block: `None`, `Block`, `BlockDebit` hoặc `BlockCredit`.

Không thể cứ có một hạn chế là gọi một lệnh block. Bài 6 đã cho thấy lý do: đặt block một chiều lên tài khoản
đang `Block` sẽ bị từ chối với lỗi `currently.set` (kiểm chứng: FIN-ACC-009-a trên 1.15.0). Một vòng lặp
"áp từng hạn chế" sẽ chạy thành công hay thất bại tuỳ thứ tự.

Cách của Onward: sau **mỗi** lần thêm hoặc gỡ một hạn chế, adapter tính lại **độ phủ tổng** của mọi hạn chế
đang hiệu lực, rồi đặt đúng một block khớp với độ phủ đó.

<svg viewBox="0 0 740 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Khối chặn dẫn xuất. Bên trái là các nguồn phía Onward: khách tự đóng băng góp chặn chiều ra, các phong toả pháp lý khác góp chặn một hay hai chiều tuỳ từng loại, phong toả sanctions góp chặn chiều ra, trạng thái Dormant hoặc Pending closure góp chặn chiều ra. Tất cả đi vào hộp tính độ phủ tổng ở giữa. Hộp đó đặt đúng một block trong Fineract ở bên phải: None, BlockDebit, BlockCredit hoặc Block.">
  <defs>
    <marker id="f7-arrow2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="10" y="10" width="245" height="40" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="132" font-size="11" y="34" fill="#0F172A">Khách tự đóng băng: chặn chiều ra</text>
    <rect x="10" y="62" width="245" height="40" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="132" font-size="11" y="86" fill="#0F172A">Phong toả pháp lý khác: tuỳ loại</text>
    <rect x="10" y="114" width="245" height="40" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="132" font-size="11" y="138" fill="#0F172A">Phong toả sanctions: chặn chiều ra</text>
    <rect x="10" y="166" width="245" height="40" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="132" font-size="11" y="190" fill="#0F172A">Dormant / Pending closure: chiều ra</text>

    <rect x="300" y="78" width="170" height="60" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="385" y="103" fill="#1D4ED8">Tính độ phủ tổng</text>
    <text x="385" y="120" fill="#64748B" font-size="10">sau mỗi lần thêm / gỡ</text>

    <rect x="530" y="78" width="200" height="60" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="630" y="103" fill="#047857">Một block trong core</text>
    <text x="630" y="120" fill="#64748B" font-size="10">None · BlockDebit · BlockCredit · Block</text>

    <line x1="255" y1="30" x2="296" y2="95" stroke="#64748B" marker-end="url(#f7-arrow2)"/>
    <line x1="255" y1="82" x2="296" y2="103" stroke="#64748B" marker-end="url(#f7-arrow2)"/>
    <line x1="255" y1="134" x2="296" y2="113" stroke="#64748B" marker-end="url(#f7-arrow2)"/>
    <line x1="255" y1="186" x2="296" y2="122" stroke="#64748B" marker-end="url(#f7-arrow2)"/>
    <line x1="470" y1="108" x2="526" y2="108" stroke="#64748B" marker-end="url(#f7-arrow2)"/>
  </g>
</svg>

Thiết kế dựa trên các hành vi sau của core:

| Hành vi của core | Thiết kế dùng nó thế nào | Kiểm chứng trên 1.15.0 |
|---|---|---|
| Độ phủ cộng dồn: `blockDebit` rồi `blockCredit` thành `Block` | Chặn chiều ra + chặn chiều vào = chặn hai chiều | FIN-ACC-009-e |
| Đặt `block` lên tài khoản đang `BlockDebit` được nhận trong **một** lệnh, kết quả `Block` | Mở rộng block không cần gỡ trước | FIN-ACC-009-b |
| Một lệnh gỡ một chiều thu hẹp `Block` thành block chiều ngược lại | Gỡ một hạn chế mà vẫn giữ phần còn lại | FIN-ACC-009-f |
| `unblock` bị từ chối trên `BlockDebit`; chỉ `unblockDebit` gỡ được | Adapter đọc `subStatus` hiện tại rồi chọn đúng lệnh gỡ | FIN-ACC-009-c |
| `BlockDebit` từ chối rút và chuyển đi, nhưng tiền **vào** vẫn ghi có | Khách tự đóng băng và phong toả sanctions dùng `blockDebit`: tiền vào vẫn nhận, tiền ra bị chặn | FIN-ACC-009-c, FIN-ACC-009-d |
| `Block` từ chối cả tiền vào (403, không có gì di chuyển) | Không dùng `Block` cho trường hợp "nhận rồi giữ" | FIN-ACC-011-a |

Phong toả sanctions luôn chỉ chặn chiều ra. Các loại phong toả pháp lý khác chặn một hay hai chiều tuỳ
**từng loại**; thiết kế quyết định theo từng trường hợp, không suy từ loại này sang loại khác.

💡 **Dormant và Pending closure cũng góp vào block.** Hai trạng thái này là trạng thái vòng đời, không phải
hạn chế. Nhưng khi tài khoản ở một trong hai trạng thái, block dẫn xuất có thêm phần chặn chiều ra. Nhờ vậy
một khoản trừ tiền không đi qua kiểm tra của Accounts (ví dụ một lệnh trừ tự động chạm tới core) vẫn bị
**core** từ chối. Có một điều cần biết: hold vẫn đặt được dưới `BlockDebit` (kiểm chứng: FIN-ACC-011-b trên
1.15.0), nên block chiều ra không chặn được hold.

⚠️ **Còn mở:** các probe chỉ chứng minh mở rộng hay thu hẹp block **mất một lệnh**. Chúng không quan sát
tài khoản ở *giữa* lệnh đó, nên chưa chứng minh được không có khoảnh khắc nào tài khoản "trống block". Phần
này **chưa kiểm chứng**.

## 5. Gỡ → chi → chặn lại

Có những lúc chính ngân hàng phải trả tiền ra từ một tài khoản đang bị chặn. Ví dụ: đóng tài khoản và trả
số dư còn lại, chuyển số dư vô chủ cho cơ quan quản lý tài sản vô chủ, hay trả cho người thừa kế. Bài 6 đã chỉ ra
hai cái bẫy:

- Core **không phân biệt** khoản chi của ngân hàng với khoản chi của khách. Dưới `Block`, nó từ chối cả lệnh
  rút lẫn lệnh chuyển đi của ngân hàng (kiểm chứng: FIN-ACC-012-b trên 1.15.0).
- Không đóng được tài khoản đang bị chặn, kể cả khi số dư bằng 0. Phải gỡ block trước (kiểm chứng:
  FIN-ACC-012-a trên 1.15.0).

(Ngược lại, thu phí bằng `paycharge` thì **vẫn** trừ được dưới cả `Block` lẫn `BlockDebit`, cũng theo
FIN-ACC-012-b.)

Nên hồ sơ vụ việc (đóng tài khoản, chủ tài khoản qua đời, số dư vô chủ) làm ba việc trong **một bước tuần tự**:

| Bước | Việc | Ghi chú |
|---|---|---|
| 1 | **Gỡ** block trong core | Gỡ toàn bộ block dẫn xuất. Các hạn chế bên Onward vẫn còn hiệu lực |
| 2 | **Chi** và/hoặc **đóng** | Khoản chi do module Transfers thực hiện, trong chính bước này |
| 3 | **Chặn lại** nếu tài khoản còn mở | Đặt lại đúng block dẫn xuất từ các hạn chế và trạng thái hiện tại |

Ba "lan can" giữ cho khoảng trống giữa bước 1 và 3 an toàn:

- **Tuần tự theo từng tài khoản.** Trong lúc bước này chạy, không có gì khác được đổi block của tài khoản đó.
- **Một cổng chặn phía Onward.** Trong khoảng trống, mọi lệnh trừ tiền **do khách khởi tạo** trên tài
  khoản đó bị Accounts từ chối (xem mục 8). Core đang không chặn, nhưng Onward vẫn chặn.
- **Khoảng trống luôn kết thúc.** Với khoản chi nội bộ, nó kết thúc khi khoản chi xong. Với khoản chi ra
  ngân hàng khác, nó kết thúc khi Transfers **nhận** khoản chi. Khi đó hồ sơ chặn lại ngay, rồi đóng tài
  khoản ở một bước "gỡ → đóng" sau, khi khoản chi đã **quyết toán**. Nếu thất bại trước khi được nhận thì
  chặn lại ngay, và lần thử lại là một bước gỡ mới.

Thiết kế gọi thẳng đây là một **ngoại lệ có giới hạn** của nguyên tắc "đổi block không bao giờ để tài khoản
trống block". Nó được viết ra rõ ràng, không giấu đi.

## 6. Tắt dormancy tracking của core

Fineract có sẵn dormancy: sản phẩm có ngưỡng ngày (inactive, dormant, escheat) và một job định kỳ *Update
Savings Dormant Accounts* (kiểm chứng: FIN-ACC-006-a trên 1.15.0). Nghe tiện, nhưng Bài 6 cho thấy job này đi
xa hơn đánh dấu: với tracking bật và tài khoản không bị block, chỉ một lần chạy là tài khoản thành `Escheat`
và **bị core đóng luôn** (kiểm chứng: FIN-ACC-006-b trên 1.15.0).

Đóng tài khoản của khách là một quyết định nghiệp vụ lớn. Onward không để một job trong core tự làm việc đó.
Vì vậy:

- **Mọi sản phẩm tiết kiệm của Onward tắt tracking** (`isDormancyTrackingActive=false`). Trong cùng probe
  FIN-ACC-006-b, tài khoản có tracking tắt không bị job đụng tới.
- **Dormancy là của Onward.** Job của chính Onward áp quy tắc "hoạt động đủ điều kiện" (là tham số theo thị
  trường), ghi trạng thái Dormant lên AccountHolding, rồi block dẫn xuất thêm phần chặn chiều ra.
- Kích hoạt lại tài khoản thì xoá trạng thái Dormant bên Onward và tính lại block. Core cũng không có lệnh
  `reactivate` cho tài khoản tiết kiệm (kiểm chứng: FIN-ACC-007-a trên 1.15.0).

## 7. Không dùng standing instruction của core

Fineract có đối tượng *standing instruction* và job *Execute Standing Instruction* đang bật sẵn trên tenant
mới. Nhưng những gì đã kiểm chứng chỉ có **tạo**: nó chỉ nhận lệnh định kỳ, từ chối lệnh một lần, và một
lệnh chuyển một lần đặt ngày tương lai bị từ chối với "Transaction date cannot be in the future."
(kiểm chứng: FIN-TRF-004-a trên 1.15.0). Việc lệnh có **thực sự chạy** đúng hạn hay không, dừng lệnh thế
nào, tạo lại có idempotent không thì **chưa kiểm chứng**.

Onward không xây trên thứ chưa chứng minh được. Bản v1 không tạo standing instruction nào trong core:

- Lệnh chuyển định kỳ, ngày chạy, quy tắc cuối tháng và ngày nghỉ, trạng thái lệnh đều nằm trong bản ghi
  của Transfers.
- **Bộ lập lịch của Onward** chạy lệnh. Mỗi lần chạy là một lệnh chuyển bình thường qua core.
- Mỗi lần chạy cũng hỏi Accounts như khách tự chuyển (mục 8). Nếu Accounts không trả lời được, lần chạy được
  thử lại trong ngày, rồi bị bỏ qua và khách được báo.

## 8. Transfers hỏi Accounts trước khi chuyển tiền

Accounts quyết định tài khoản **có được** chuyển tiền hay không. Transfers là bên **thực hiện** chuyển. Hai
vai này tách nhau, và nối với nhau bằng một lời gọi đồng bộ:

1. Trước mỗi lệnh chuyển do khách khởi tạo, Transfers gửi cho Accounts: ai đang làm, `accountRef` nào, thao
   tác gì.
2. Accounts kiểm tra người gọi có phải chủ (hoặc người được uỷ quyền) không, trạng thái vòng đời, các hạn
   chế đang hiệu lực, và khoảng trống "gỡ → chi" ở mục 5. Sau đó trả về **cho phép** hoặc **từ chối kèm lý
   do**.
3. Transfers hỏi **hai lần**: trước màn hình xác nhận, và ngay trước khi thực hiện.
4. Nếu Accounts lỗi hoặc quá thời gian, Transfers **fail closed**: không chuyển tiền, và khách thấy "tạm
   thời không thực hiện được, thử lại sau".

Lý do từ chối được phân loại để hiển thị cho đúng. Khách tự đóng băng hay tài khoản Dormant thì khách được
chỉ cách gỡ. Phong toả pháp lý thì chỉ hiện một thông báo trung tính, không được để lộ có điều tra hay báo
cáo nào.

💡 **Khoản chi của ngân hàng thì không hỏi.** Ở mục 5, Accounts tự gọi Transfers để chi, và chịu trách nhiệm
cho khoản chi đó. Đây không phải lệnh của khách, nên không đi qua bước hỏi ý kiến. Nhờ vậy nó chạy được
trong chính khoảng trống mà mọi lệnh của khách đang bị từ chối.

## 9. Khoá idempotency theo từng bước

Bài 6 đã cho thấy `Idempotency-Key` của Fineract hoạt động, nhưng có tính khí riêng:

| Hành vi của core | Hệ quả | Kiểm chứng trên 1.15.0 |
|---|---|---|
| Cùng khoá, cùng body: chỉ một lần chuyển | Thử lại an toàn | FIN-IDEM-01 |
| Cùng khoá, **khác** số tiền: HTTP 200, không gì xảy ra, không cảnh báo | Sửa request rồi gửi lại với khoá cũ thì bị "nuốt" im lặng | FIN-IDEM-02 |
| Khoá **mới**, cùng body: tiền chuyển **lần nữa** | Khoá mới cho một lần thử lại là chuyển hai lần | FIN-IDEM-03 |
| Khoá không gắn với tài khoản: cùng khoá trên tài khoản **khác** trả về phản hồi của tài khoản đầu | Khoá chung cho hai tài khoản làm tài khoản thứ hai không bao giờ được xử lý | FIN-ACC-005-b |
| Khoá của một lệnh **thất bại** trả lại thất bại mãi mãi | Thử lại bằng khoá cũ không bao giờ thành công | FIN-ACC-005-b |
| Phát lại khoá block/unblock bỏ qua trạng thái **hiện tại** của tài khoản | Khoá `unblock` cũ phát lại sau khi đã chặn lại thì trả 200 mà tài khoản vẫn `Block` | FIN-ACC-009-g |

Từ đó thiết kế đặt ra mấy quy tắc:

- **Mỗi bước có khoá riêng, sinh từ hồ sơ.** Mở tài khoản có ba lệnh (submit, approve, activate), và mỗi
  lệnh có khoá riêng kiểu `{caseId}:approve:{attempt}`. Khoá của hồ sơ đóng tài khoản cũng gắn tên bước, ví
  dụ `{caseId}:sweep`.
- **Khoá phải mang theo tài khoản** khi một hồ sơ tác động lên nhiều tài khoản, ví dụ
  `{caseId}:{accountRef}:cancel-orders`. Core không gắn khoá với tài khoản, nên mình phải tự làm.
- **Mỗi lần đổi block là một khoá mới.** Chặn lại sau khi gỡ là một lệnh mới, không phải phát lại lệnh cũ.
  Adapter vẫn đọc trạng thái hiện tại trước khi chọn lệnh.
- **Lệnh đã nhận lỗi thì sinh khoá mới** (còn lệnh chưa rõ kết quả, ví dụ timeout, thì thử lại bằng đúng khoá cũ),
  và đọc lại trạng thái tài khoản trước khi thử lại.
- **Phân biệt "phát lại" với "chạy thật" bằng header** `x-served-from-cache: true`, không bằng status code.
  Cả hai đều là 200.

## 10. Vài quyết định nhỏ hơn nhưng đáng nhớ

| Tình huống trong core | Onward làm gì |
|---|---|
| Sau khi kích hoạt, không đổi được sản phẩm hay lãi suất của tài khoản (FIN-LIFE-02) | Trên core này, chức năng đổi sản phẩm trả lời rõ là **"không khả dụng"**. Đóng rồi mở tài khoản mới bị loại, vì số tài khoản đổi sẽ làm hỏng lương và lệnh trừ tự động của khách |
| Không liệt kê được từng hold, chỉ có tổng tiền đang giữ | Adapter dựng lại danh sách hold từ các cặp giao dịch "hold" và "release" (FIN-ACC-002-b). **Lý do** của mỗi hold do bên đặt hold tự ghi lại |
| `defaultUserMessage` đôi khi vô nghĩa (FIN-ERR-01) | Adapter đọc `developerMessage`, và **không bao giờ** hiện thông báo của core cho khách |
| HTTP 503 có thể là một lời từ chối vĩnh viễn (FIN-TRF-001-c) | Phân loại lỗi theo nội dung thông báo, không tự động thử lại chỉ vì là 5xx. Lệnh chuyển đã xong thì không đảo được, nên hoàn tiền là một lệnh ghi có bù trừ **mới** |
| Sản phẩm không bật kế toán thì không có bút toán (FIN-LEDGER-01) | Mọi sản phẩm Onward tạo đều bật kế toán, và kiểm tra lại sau khi tạo |
| Webhook của core | Chỉ coi hook là **tín hiệu** để đọc lại trạng thái, không bao giờ là bằng chứng đã giao. Hành vi hook mới quan sát trên bản snapshot cũ, **chưa kiểm chứng** trên 1.15.0 |

## 11. Cách Onward giữ cho những điều trên luôn đúng

Mọi hành vi của core mà thiết kế dựa vào đều có một **claim** (mã `FIN-…`), và một script chạy lại toàn bộ
claim trên một Fineract 1.15.0 trắng. Mỗi claim in ra `PASS` hoặc `FAIL`. Quy tắc của đội rất thẳng:

1. Claim nào `FAIL` thì mục thiết kế dựa trên nó bị hạ xuống "chưa kiểm chứng" ngay trong cùng thay đổi.
2. Phần việc phụ thuộc vào nó **dừng lại**, cho tới khi claim đúng trở lại hoặc thiết kế đổi.
3. Khi đổi phiên bản Fineract, mọi claim chạy lại **trước** khi xây bất cứ module nào.

Một claim thất bại không phải lỗi tài liệu cần dọn cho gọn. Nó có nghĩa là core đã đổi hành vi, và đó đúng là
điều script này được viết ra để bắt. Ở [Bài 8 · Checkpoint](/docs/fineract/checkpoint), bạn sẽ tự chạy một
phần các claim đó trên máy mình.

## Tự kiểm tra

- [ ] Tôi giải thích được vì sao Onward **không** lưu số dư, và trạng thái vòng đời khác `status` của core ở điểm nào.
- [ ] Tôi kể được ba module **không** có port tới core và lý do.
- [ ] Tôi giải thích được vì sao không thể "mỗi hạn chế một lệnh block", và block dẫn xuất giải quyết thế nào.
- [ ] Tôi biết vì sao phong toả sanctions dùng `blockDebit` chứ không dùng `block`.
- [ ] Tôi mô tả được ba bước "gỡ → chi → chặn lại" và ba lan can giữ khoảng trống an toàn.
- [ ] Tôi nói được vì sao dormancy tracking và standing instruction của core bị tắt hoặc không dùng.
- [ ] Tôi biết khi nào Transfers hỏi Accounts, và nó làm gì khi Accounts không trả lời.
- [ ] Tôi viết được một khoá idempotency đúng cho một bước approve, và giải thích vì sao lệnh thất bại cần khoá mới.

## Nguồn tham khảo

1. Apache Fineract, trang chủ dự án. <https://fineract.apache.org/>
2. Apache Fineract, mã nguồn trên GitHub. <https://github.com/apache/fineract>
3. Apache Fineract 1.15.0, bản phát hành được dùng để kiểm chứng. <https://github.com/apache/fineract/releases/tag/1.15.0>
4. Apache Fineract, tài liệu chính thức. <https://fineract.apache.org/docs/current/>
5. Tài liệu thiết kế nội bộ của Onward (module Accounts, ranh giới Accounts và Transfers, bộ claim kiểm chứng
   Fineract). Không công khai. Các mã `FIN-…` trong bài là mã claim trong bộ đó.

**Bài tiếp theo:** [Bài 8 · Checkpoint: tự kiểm chứng trên Fineract của bạn](/docs/fineract/checkpoint)
