---
title: "Bài 5 · Ghi sổ kép và sổ cái"
description: "Vì sao mỗi giao dịch, Fineract ghi đúng hai dòng DEBIT và CREDIT; phương trình kế toán; bảng sáu sự kiện; và tài khoản suspense như một hành lang giữa hai phòng."
order: 5
tags: [fineract, core-banking, ke-toan, double-entry, general-ledger, journal-entry, suspense]
language: vi
profile: onward-fineract-course
classification: public-safe
source_repo: none
source_refs:
  - https://fineract.apache.org/docs/current/#_accounting
  - https://github.com/apache/fineract
  - https://github.com/apache/fineract/releases/tag/1.15.0
---

# Bài 5 · Ghi sổ kép và sổ cái

> Ở [Bài 4](/docs/fineract/api-tung-buoc) bạn đã nạp tiền, rút tiền và chuyển tiền bằng `curl`. Bài này
> nhìn vào mặt sau của các lệnh đó: **sổ cái** (general ledger) của ngân hàng. Mỗi giao dịch,
> Fineract ghi đúng **hai dòng**: một dòng DEBIT và một dòng CREDIT. Hiểu vì sao lại là hai dòng,
> bạn sẽ đọc được mọi bút toán mà core sinh ra.

**Cần biết trước:** [Bài 2 · Khái niệm cốt lõi](/docs/fineract/khai-niem-cot-loi) (GL account, journal entry,
financial activity mapping) và [Bài 4 · Gọi API từng bước](/docs/fineract/api-tung-buoc).

Mọi con số và dòng sổ trong bài này lấy từ một lần chạy thật trên **Apache Fineract 1.15.0**, tenant trống,
trong tài liệu nội bộ của nhóm Onward. Hai khách hàng trong ví dụ là nhân vật giả lập: *Ada* và *Grace*.
Chỗ nào là suy luận chứ không phải ghi nhận, bài sẽ nói rõ.

## Gửi tiền là một khoản nợ

Bắt đầu từ góc nhìn của ngân hàng. Ada mang 500 đến gửi:

- Ngân hàng có thêm **500 tiền mặt**.
- Ngân hàng **nợ Ada 500**.
- Ngân hàng **không kiếm được gì**. Tiền vẫn là của Ada.

> 💡 **Vì sao điều này quan trọng?** Mọi số dư bạn hiển thị cho khách trên app, nhìn từ phía ngân hàng,
> là **một khoản nợ** ngân hàng đang giữ cho khách. Đó là lý do tài khoản tiền gửi nằm bên *nợ phải trả*
> (liability) trong sổ cái, không phải bên *tài sản*.

## Sổ cái và năm loại tài khoản GL

**General ledger** (GL, sổ cái) là sổ sách riêng của ngân hàng. Mỗi **GL account** là một "ngăn" có dán
nhãn trong sổ đó. Fineract chỉ có đúng năm loại; gọi `GET /glaccounts/template` trên 1.15.0 sẽ thấy:

```json
[{"id":1,"value":"ASSET"},
 {"id":2,"value":"LIABILITY"},
 {"id":3,"value":"EQUITY"},
 {"id":4,"value":"INCOME"},
 {"id":5,"value":"EXPENSE"}]
```

| Loại | Nghĩa là | Trong ngân hàng thử nghiệm của bài |
|------|----------|------------------------------------|
| `ASSET` (tài sản) | Thứ ngân hàng **có** | Cash · Overdraft Portfolio |
| `LIABILITY` (nợ phải trả) | Thứ ngân hàng **nợ** | Savings Control · Transfers In Suspense |
| `EQUITY` (vốn chủ sở hữu) | Tiền của chủ ngân hàng | không dùng ở đây |
| `INCOME` (thu nhập) | Thứ ngân hàng **kiếm được** | Fee Income · Penalty Income · Interest Income |
| `EXPENSE` (chi phí) | Thứ ngân hàng **chi ra** | Interest Expense · Write Off |

Bộ GL dùng trong các buổi demo nội bộ của nhóm (và trong script kiểm chứng) gồm chín tài khoản. `glCode` là nhãn **do ta đặt**, Fineract không tự sinh:

| glCode | Tên | Loại |
|--------|-----|------|
| 10100 | Cash | ASSET |
| 10200 | Overdraft Portfolio | ASSET |
| 20100 | Savings Control | LIABILITY |
| 20200 | Transfers In Suspense | LIABILITY |
| 40100 | Fee Income | INCOME |
| 40200 | Penalty Income | INCOME |
| 40300 | Interest Income | INCOME |
| 50100 | Interest Expense | EXPENSE |
| 50200 | Write Off | EXPENSE |

> 💡 **Vì sao lại chín?** Một sản phẩm tiết kiệm dùng kế toán *cash based* cần một GL cho mỗi kiểu dịch
> chuyển: tiền mặt, tiền của khách, lãi, phí, phạt, tiền đang chuyển, thấu chi, xoá nợ.

### Hai thứ cùng tên "account"

Đây là chỗ người mới hay nhầm nhất:

| | Tài khoản của khách (customer account) | Tài khoản GL |
|---|---|---|
| Ví dụ | Tài khoản tiết kiệm của Ada | "Cash", "Savings Control" |
| Của ai | Của khách hàng | Sổ sách riêng của ngân hàng |
| Ai nhìn thấy | Khách, trong app | Bộ phận tài chính; khách không bao giờ thấy |

Hàng nghìn tài khoản của khách cùng ghi vào **một** ngăn Savings Control duy nhất.

## Ghi sổ kép: tiền không tự sinh ra, nó chỉ di chuyển

Ada nạp 500. Fineract ghi **hai dòng**:

```text
DEBIT  500  Cash             (10100)
CREDIT 500  Savings Control  (20100)
```

Một lần nạp, hai dòng. Quy tắc: **tổng DEBIT luôn bằng tổng CREDIT**. Nếu có lúc không bằng, tức là có
gì đó hỏng.

### DEBIT không có nghĩa là "trừ"

Cái bẫy kinh điển: nhiều người đọc DEBIT là "trừ tiền", CREDIT là "cộng tiền". Sai. Tác dụng của một bên
phụ thuộc vào **loại** tài khoản:

| | DEBIT | CREDIT |
|---|---|---|
| Tài sản (Cash) | **tăng** | giảm |
| Nợ phải trả (Savings Control) | giảm | **tăng** |

Nên khi Ada nạp tiền: DEBIT vào tiền mặt của ngân hàng (tiền mặt tăng) và CREDIT vào khoản ngân hàng nợ Ada
(khoản nợ tăng). **Cả hai đều tăng.**

## Phương trình kế toán

Sổ sách của ngân hàng phải luôn cân:

```text
Thứ ngân hàng có  =  Thứ ngân hàng nợ  +  Phần của chủ sở hữu
     tài sản      =    nợ phải trả      +      vốn chủ sở hữu
     (assets)     =    (liabilities)    +        (equity)
```

**Nếu chỉ ghi một dòng thì sao?** Ada nạp 500, ta chỉ ghi "Cash +500". Vế trái tăng mà vế phải không đổi,
trông như ngân hàng vừa *kiếm được* 500. Nhưng đó là tiền của Ada. Dòng thứ hai nói rõ tiền **của ai**:
ngân hàng giờ nợ Ada 500.

Vậy mỗi sự kiện chạm vào hai chỗ: một dòng ghi **tiền đã đi đâu**, dòng kia ghi **vì sao**, hay **của ai**.
DEBIT là cột trái, CREDIT là cột phải. Câu "tổng DEBIT bằng tổng CREDIT" chỉ là cách nói khác của
"phương trình vẫn cân".

## Bảng sáu sự kiện

Mọi sự kiện đều theo cùng một khuôn: hai dòng, một bên "tiền đi đâu", một bên "vì sao".

| Sự kiện | DEBIT (trái) | CREDIT (phải) | Nói nôm na | Nguồn |
|---------|--------------|---------------|------------|-------|
| Ada nạp 500 | Cash | Savings Control | Ta có thêm tiền mặt; ta nợ Ada nhiều hơn | ghi nhận trên 1.15.0 |
| Ada rút 80 | Savings Control | Cash | Ta nợ Ada ít hơn; ta có ít tiền mặt hơn | ghi nhận trên 1.15.0 ([Bài 4](/docs/fineract/api-tung-buoc), bước 10) |
| Thu phí 5 của Ada | Savings Control | Fee Income | Ta nợ Ada ít hơn; ngân hàng kiếm được 5 | suy ra theo cùng mapping, **chưa kiểm chứng** |
| Trả lãi cho Ada | Interest Expense | Savings Control | Ngân hàng tốn tiền lãi; ta nợ Ada nhiều hơn | kiểm chứng: FIN-ACC-022-c trên 1.15.0 |
| Ada → Grace 120 · chặng 1 | Savings Control | Transfers In Suspense | Ta nợ Ada ít hơn; tiền đang trên đường | ghi nhận trên 1.15.0 |
| Ada → Grace 120 · chặng 2 | Transfers In Suspense | Savings Control | Hết "trên đường"; ta nợ Grace nhiều hơn | ghi nhận trên 1.15.0 |

Với dòng trả lãi, lần chạy kiểm chứng FIN-ACC-022-c ra đúng cặp bút toán `20100/CREDIT/2.13` và
`50100/DEBIT/2.13`: Savings Control được ghi có, Interest Expense bị ghi nợ, cùng số tiền.

> 💡 **Nhìn vào dòng phí.** Số dư của Ada giảm 5, nhưng tiền không biến mất. Nó chuyển từ "nợ Ada" sang
> "ngân hàng kiếm được". Nếu chỉ có một dòng, ta sẽ mất dấu tiền đã đi đâu.

## Journal entry: một dòng thật trong sổ

**Journal entry** (bút toán) là **một vế** của cặp ghi sổ kép. Lần nạp 500 ở trên sinh ra hai journal entry.
Đây là dòng đầu tiên, đọc bằng `GET /journalentries` trên tenant trống, Fineract 1.15.0:

```json
{
  "id": 1,
  "officeName": "Head Office",
  "glAccountName": "Cash",
  "glAccountCode": "10100",
  "glAccountType": "ASSET",
  "entryType": "DEBIT",
  "amount": 500.000000,
  "currency": "USD",
  "transactionDate": [2026, 8, 1],
  "transactionId": "S1",
  "entityType": "SAVING",
  "entityId": 1,
  "manualEntry": false,
  "createdByUserName": "mifos"
}
```

| Trường | Đọc là |
|--------|--------|
| `entryType` · `amount` | Vế nào, bao nhiêu: DEBIT 500 |
| `glAccountName` / `glAccountCode` | Ngăn nào trong sổ: Cash, 10100 |
| `transactionId: "S1"` | Giao dịch tiết kiệm đã sinh ra dòng này. Hai vế của một cặp dùng chung mã này |
| `entityType: "SAVING"` | Dòng này đến từ một tài khoản tiết kiệm |
| `createdByUserName: "mifos"` | User API đã gọi lệnh, **không phải** khách hàng. `mifos` là user mặc định của môi trường dev local, không dùng ở môi trường thật |

Muốn tự xem, gọi (tenant header và basic auth như [Bài 3](/docs/fineract/chay-fineract-local)):

```bash
curl -sk -u mifos:password \
  -H "Fineract-Platform-TenantId: default" \
  "https://localhost:8443/fineract-provider/api/v1/journalentries?limit=20"
```

## Suspense: tiền đang trên đường

Số dư của Ada và Grace nằm trong **cùng một ngăn**: Savings Control. Vậy một lệnh chuyển tiền giữa hai người
được ghi thế nào?

### Một bút toán thì chẳng nói lên điều gì

Nếu ghi Ada → Grace thành một cặp duy nhất:

```text
DEBIT  120  Savings Control
CREDIT 120  Savings Control
```

Cùng một ngăn ở cả hai vế. Tổng số ngân hàng nợ khách không đổi, chỉ có *nợ ai* là thay đổi. Mà điều đó thì
cặp bút toán này không ghi được.

Thực tế Fineract chạy một lệnh chuyển thành **hai giao dịch**: `S3` trên tài khoản của Ada, `S4` trên tài khoản
của Grace, và **mỗi giao dịch phải tự cân**. Ngăn **suspense** (Transfers In Suspense, 20200) là chỗ giao dịch
này bàn giao cho giao dịch kia:

```text
Chặng 1 · S3 · tiền rời Ada
DEBIT  120  Savings Control
CREDIT 120  Transfers In Suspense

Chặng 2 · S4 · tiền đến Grace
DEBIT  120  Transfers In Suspense
CREDIT 120  Savings Control
```

### Hành lang giữa hai phòng

Hãy hình dung: phòng A → **hành lang** → phòng B. Một chiếc hộp được mang ra hành lang rồi mang vào phòng bên
kia. Khi xong việc, hành lang phải **trống**.

<svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Ẩn dụ hành lang cho tài khoản suspense. Bên trái là phòng A, tài khoản của Ada. Ở giữa là hành lang, tài khoản GL Transfers In Suspense. Bên phải là phòng B, tài khoản của Grace. Chặng 1, giao dịch S3: 120 đi từ phòng A ra hành lang, ghi DEBIT Savings Control, CREDIT Transfers In Suspense. Chặng 2, giao dịch S4: 120 đi từ hành lang vào phòng B, ghi DEBIT Transfers In Suspense, CREDIT Savings Control. Kết thúc, số dư suspense về 0: hành lang trống.">
  <defs>
    <marker id="f5a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="10" y="40" width="170" height="80" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="95" y="68" fill="#1D4ED8">Phòng A</text>
    <text x="95" y="86" fill="#0F172A">Tài khoản của Ada</text>
    <text x="95" y="104" fill="#64748B" font-size="10">trong Savings Control</text>
    <rect x="275" y="40" width="170" height="80" rx="10" fill="#F8FAFC" stroke="#94A3B8" stroke-dasharray="5 4"/>
    <text x="360" y="68" fill="#0F172A">Hành lang</text>
    <text x="360" y="86" fill="#0F172A">Transfers In Suspense</text>
    <text x="360" y="104" fill="#64748B" font-size="10">GL 20200 · phải về 0</text>
    <rect x="540" y="40" width="170" height="80" rx="10" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="625" y="68" fill="#1D4ED8">Phòng B</text>
    <text x="625" y="86" fill="#0F172A">Tài khoản của Grace</text>
    <text x="625" y="104" fill="#64748B" font-size="10">trong Savings Control</text>
    <line x1="180" y1="80" x2="271" y2="80" stroke="#64748B" marker-end="url(#f5a)"/>
    <line x1="445" y1="80" x2="536" y2="80" stroke="#64748B" marker-end="url(#f5a)"/>
    <text x="227" y="30" fill="#1D4ED8">Chặng 1 · S3</text>
    <text x="492" y="30" fill="#1D4ED8">Chặng 2 · S4</text>
    <text x="227" y="146" fill="#64748B" font-size="10">DEBIT Savings Control</text>
    <text x="227" y="162" fill="#64748B" font-size="10">CREDIT Suspense · 120</text>
    <text x="492" y="146" fill="#64748B" font-size="10">DEBIT Suspense</text>
    <text x="492" y="162" fill="#64748B" font-size="10">CREDIT Savings Control · 120</text>
    <text x="360" y="190" fill="#0F172A" font-size="11">Xong việc: hành lang trống. Suspense khác 0 = tiền kẹt giữa đường.</text>
  </g>
</svg>

Số dư từng thời điểm, tính từ các dòng journal đã ghi nhận:

| Thời điểm | Savings Control (nợ khách) | Transfers In Suspense (hành lang) | Ý nghĩa |
|-----------|----------------------------|-----------------------------------|---------|
| Trước | 500 | 0 | Ngân hàng nợ Ada 500 |
| Sau chặng 1 · S3 | 380 | 120 | Tiền đã rời Ada, đang trên đường |
| Sau chặng 2 · S4 | 500 | 0 | Tiền đã đến Grace: nợ Ada 380, nợ Grace 120 |

Sau cả hai chặng, sáu dòng journal của buổi demo (một lần nạp, một lần chuyển) cân đúng:

```text
1  DEBIT   500  Cash                   S1
2  CREDIT  500  Savings Control        S1
3  DEBIT   120  Savings Control        S3
4  CREDIT  120  Transfers In Suspense  S3
5  DEBIT   120  Transfers In Suspense  S4
6  CREDIT  120  Savings Control        S4
   tổng DEBIT 740 = tổng CREDIT 740
```

### Hành lang có thể bị kẹt không?

| Câu hỏi | Kết quả | Nguồn |
|---------|---------|-------|
| Một lần chuyển ghi gì vào suspense? | `suspense=+2 savingscontrol=+2 suspense_net=0`: hai dòng vào suspense, hai dòng vào Savings Control, suspense ròng về 0 | kiểm chứng: FIN-TRF-001-a trên 1.15.0 |
| Lệnh chuyển bị từ chối thì sao? | `moved=0/0 suspense=+0`: không tiền nào di chuyển, không dòng suspense nào được ghi. Hai chặng cùng thất bại | kiểm chứng: FIN-TRF-001-b trên 1.15.0 |
| Có thể kẹt giữa hai chặng không? | Không, giữa hai khách của cùng ngân hàng: cả hai chặng chạy trong **một transaction CSDL** (`create_is_transactional=1`) | kiểm chứng: FIN-TRF-001-h trên 1.15.0, **đọc từ mã nguồn, không quan sát trực tiếp** |

> 💡 **Vì sao điều này quan trọng?** Số dư suspense khác 0 là **chuông báo động**: có tiền mắc kẹt giữa
> đường. Đó là một chỉ số đáng theo dõi khi vận hành.

### Hành lang phải được "chỉ đường" trước

Fineract không tự biết GL nào là hành lang. Bạn phải map một lần cho cả tenant: **financial activity**
`liabilityTransfer` (id `200`) → GL Transfers In Suspense. Thiếu mapping này, mọi lệnh chuyển đều thất bại
với một lỗi 404 không nhắc đến tài khoản nào:

```text
404/Financial Activity account with for the financial Activity with Id 200 does not exist
```

(kiểm chứng: FIN-TRF-001-f trên 1.15.0.) Bài 4 đã đi qua câu chuyện 404 → map → 200 này.

## Công tắc tắt sổ cái

Ghi sổ kép chỉ xảy ra nếu **sản phẩm** bật kế toán. Trường `accountingRule` của savings product:

| `accountingRule` | Tên | Chuyện gì xảy ra |
|------------------|-----|------------------|
| `1` | None | Tài khoản vẫn mở, tiền vẫn di chuyển, nhưng **không ghi journal entry nào** |
| `2` | Cash based | Sản phẩm của bài này dùng chế độ này; mỗi dịch chuyển sinh cặp bút toán như trên |

Lần chạy kiểm chứng nạp 77 vào một tài khoản thuộc sản phẩm không có kế toán: `balance=77.000000 journal_delta=0`.
Số dư tăng, sổ cái **im lặng** (kiểm chứng: FIN-LEDGER-01 trên 1.15.0).

> ⚠️ **Bẫy:** câu "Fineract giữ sổ sách" chỉ đúng khi công tắc này được bật. Theo tài liệu thiết kế nội bộ
> của Onward, mọi sản phẩm ta tạo đều phải đặt kế toán cash based, và phải **đọc lại để kiểm tra** sau khi
> tạo, chứ không mặc định là đã đúng.

## Fineract giữ sổ, ta giữ lời hứa

Ghi sổ kép đảm bảo sổ sách **cộng lại khớp**. Nó **không** đảm bảo sổ sách **đúng**: đúng khách, đúng số
tiền, chỉ trả một lần. Một lệnh chuyển gửi nhầm người vẫn cân hoàn hảo. Phần "đúng" đó là việc của các
service phía trên core. [Bài 6](/docs/fineract/hanh-vi-da-kiem-chung) sẽ cho bạn thấy những chỗ core *không*
tự bảo vệ bạn.

## Checklist cuối bài

- [ ] Giải thích được vì sao tiền gửi của khách là **nợ phải trả** của ngân hàng.
- [ ] Kể được năm loại GL account và cho mỗi loại một ví dụ.
- [ ] Nói được vì sao DEBIT **không** có nghĩa là "trừ", với một ví dụ tài sản và một ví dụ nợ phải trả.
- [ ] Viết được phương trình kế toán và giải thích vì sao một dòng duy nhất sẽ làm nó lệch.
- [ ] Điền được cột DEBIT / CREDIT cho sáu sự kiện: nạp, rút, phí, lãi, hai chặng chuyển tiền.
- [ ] Đọc được một journal entry: vế nào, ngăn nào, giao dịch nào sinh ra nó.
- [ ] Giải thích ẩn dụ hành lang, và vì sao suspense khác 0 là chuông báo động.
- [ ] Biết mapping `liabilityTransfer` (id 200) cần có trước lệnh chuyển đầu tiên.
- [ ] Kiểm tra `accountingRule` của mọi sản phẩm bạn tạo.

## Nguồn tham khảo

1. Apache Fineract, tài liệu chính thức (mục Accounting). <https://fineract.apache.org/docs/current/#_accounting>
2. Mã nguồn `apache/fineract` trên GitHub. <https://github.com/apache/fineract>
3. Apache Fineract 1.15.0, bản phát hành được dùng để kiểm chứng. <https://github.com/apache/fineract/releases/tag/1.15.0>
4. Bộ kiểm chứng nội bộ của Onward (không công khai).

**Bài tiếp theo:** [Bài 6 · Hành vi đã kiểm chứng và các cái bẫy](/docs/fineract/hanh-vi-da-kiem-chung)
