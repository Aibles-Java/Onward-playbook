---
title: "Bài 2 · Các khái niệm cốt lõi"
description: "Office, client, group, sản phẩm và tài khoản tiết kiệm, vòng đời tài khoản, sub-status và block, charge, hold, GL account, journal entry, financial activity mapping và business date."
order: 2
tags: [fineract, core-banking, khai-niem, savings, ledger]
language: vi
profile: onward-fineract-course
classification: public-safe
source_repo: none
source_refs:
  - https://fineract.apache.org/docs/current/
  - https://github.com/apache/fineract/tree/1.15.0
  - https://github.com/apache/fineract/blob/1.15.0/README.md
---

# Bài 2 · Các khái niệm cốt lõi

> Fineract có hàng trăm endpoint, nhưng mô hình tư duy để dùng nó cho tài khoản tiền gửi chỉ gồm
> khoảng một chục khái niệm. Bài này giới thiệu từng khái niệm theo cùng một nhịp: **hiểu nôm na**,
> **Fineract làm gì**, và **điều cần nhớ**.

## Sau bài này bạn sẽ

1. Phân biệt được **client** (người) với **savings account** (tài khoản), và **product** (mẫu) với **account** (thực thể).
2. Kể đúng thứ tự vòng đời tài khoản: Submitted → Approved → Active → Closed.
3. Giải thích được vì sao một tài khoản bị **block** vẫn có `status` là Active.
4. Phân biệt **hold** với **block**, và **GL account** với tài khoản của khách hàng.
5. Biết vì sao chuyển khoản cần một **financial activity mapping** trước khi chạy được.

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na |
|-----------|-------------|
| Office | Chi nhánh trong cây tổ chức của core |
| Client | Một người mà ngân hàng biết; không giữ tiền |
| Group | Một nhóm client cùng sở hữu tài khoản |
| Savings product | Mẫu sản phẩm: lãi suất, tiền tệ, quy tắc hạch toán |
| Savings account | Tài khoản của khách, mở trên một product |
| Sub-status / Block | Trục trạng thái thứ hai, dùng để "đóng băng" |
| Charge | Định nghĩa phí |
| Hold | Giữ (phong toả) một số tiền |
| GL account | Một "ngăn" trong sổ cái của chính ngân hàng |
| Journal entry | Một dòng ghi Nợ hoặc Có trong sổ cái |
| Financial activity mapping | Chỉ cho core biết một loại hoạt động hạch toán vào GL nào |
| Business date | "Ngày làm việc" logic của core |

> **Cách đọc ghi chú nguồn.** "kiểm chứng: FIN-XXX trên 1.15.0" nghĩa là hành vi đó đã được chạy
> lại bằng một bộ kiểm chứng tự động trên Apache Fineract 1.15.0 với một tenant trắng.
> "chưa kiểm chứng" nghĩa là chúng tôi chưa tự chạy lại; hãy coi đó là giả thuyết.

## Bức tranh tổng thể: năm thứ, nối thành chuỗi

<svg viewBox="0 0 730 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chuỗi năm khái niệm của Fineract: Client là người ngân hàng biết; Product là mẫu sản phẩm; Account được mở cho một client trên một product; Transaction là một lần nạp, rút hay giữ tiền; Journal entries là hai dòng trong sổ cái cho mỗi giao dịch. Mỗi khái niệm cần khái niệm đứng trước nó.">
  <defs>
    <marker id="fc2-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="10"  y="50" width="120" height="50" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="70"  y="72" fill="#0F172A">Client</text>
    <text x="70"  y="89" fill="#64748B" font-size="10">người ngân hàng biết</text>
    <rect x="160" y="50" width="120" height="50" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="220" y="72" fill="#0F172A">Product</text>
    <text x="220" y="89" fill="#64748B" font-size="10">mẫu sản phẩm</text>
    <rect x="310" y="50" width="120" height="50" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="370" y="72" fill="#1D4ED8">Account</text>
    <text x="370" y="89" fill="#64748B" font-size="10">client + product</text>
    <rect x="460" y="50" width="120" height="50" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="520" y="72" fill="#1D4ED8">Transaction</text>
    <text x="520" y="89" fill="#64748B" font-size="10">nạp · rút · giữ</text>
    <rect x="610" y="50" width="110" height="50" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="665" y="72" fill="#047857">Journal entries</text>
    <text x="665" y="89" fill="#64748B" font-size="10">2 dòng sổ cái</text>
    <line x1="130" y1="75" x2="156" y2="75" stroke="#64748B" marker-end="url(#fc2-arrow)"/>
    <line x1="280" y1="75" x2="306" y2="75" stroke="#64748B" marker-end="url(#fc2-arrow)"/>
    <line x1="430" y1="75" x2="456" y2="75" stroke="#64748B" marker-end="url(#fc2-arrow)"/>
    <line x1="580" y1="75" x2="606" y2="75" stroke="#64748B" marker-end="url(#fc2-arrow)"/>
    <text x="365" y="130" fill="#64748B" font-size="11">Mỗi khối cần khối đứng trước nó. Đây là toàn bộ mô hình tư duy.</text>
  </g>
</svg>

Phần còn lại của bài đi qua từng khối, rồi tới các khái niệm "bao quanh" chúng.

## 1. Office: chi nhánh, không phải ranh giới khách hàng

**Hiểu nôm na.** Cây chi nhánh của ngân hàng: Hội sở, chi nhánh A, chi nhánh B...

**Fineract làm gì.** Một tenant mới chỉ có đúng một office tên **Head Office** (id 1). Mọi client
đều thuộc về một office, và quyền của nhân viên trong Fineract được tổ chức xoay quanh office.

**Điều cần nhớ.** Office **không phải** tenant, và **không phải** ranh giới giữa các khách hàng.
Quyền trong Fineract gắn với *hành động* chứ không gắn với *khách hàng cụ thể*: một nhân viên ở một
chi nhánh trống vẫn đọc được tài khoản của bất kỳ ai nếu biết id (kiểm chứng: FIN-AUTHZ-03 trên
1.15.0). Bài 6 sẽ quay lại chuyện này.

## 2. Client: một người, không có tiền

**Hiểu nôm na.** Một người mà ngân hàng biết đến.

**Fineract làm gì.** `POST /clients` tạo một client với tên, office và `legalFormId`
(1 = cá nhân, 2 = pháp nhân). Nếu gửi kèm `"active": true` và `activationDate`, client được tạo và
kích hoạt luôn. Nếu bỏ qua, client ở trạng thái **Pending**, và **không mở được tài khoản nào** cho
nó (kiểm chứng: FIN-ONB-004-b trên 1.15.0).

Một client khi đọc lại chỉ có tên, trạng thái, office. **Không có số dư nào cả**:

```json
{"id": 1, "displayName": "Ada Lovelace", "status": "Active", "office": "Head Office"}
```

**Điều cần nhớ.** Tiền nằm ở **tài khoản**, không nằm ở client. Và client của Fineract không phải
"Customer" của nền tảng: theo thiết kế của Onward, Customer tồn tại trước và độc lập với bất kỳ bản
ghi nào trong core.

## 3. Group: nhiều người cùng sở hữu

**Hiểu nôm na.** Một nhóm client, ví dụ hai vợ chồng mở tài khoản chung.

**Fineract làm gì.** Một savings account mở với `groupId` thuộc về **cả nhóm**, không thuộc về
riêng ai (kiểm chứng: FIN-ACC-010-b trên 1.15.0). Core chấp nhận cách mở này dù tài liệu API của nó
không mô tả.

**Điều cần nhớ.** Core **không kiểm tra thành viên**: xoá một người khỏi nhóm không cần ai đồng ý,
và người đã bị xoá vẫn có thể được ghi là người trả tiền, tiền vẫn đi (kiểm chứng: FIN-ACC-010-e
trên 1.15.0). Khi rút tiền từ tài khoản chung, core ghi lại user API đã gọi, không ghi người đồng sở
hữu nào (kiểm chứng: FIN-ACC-010-j trên 1.15.0). Ai được phép làm gì trên tài khoản chung là việc
của nền tảng.

## 4. Savings product và savings account: cái khuôn và cái bánh

**Hiểu nôm na.** Product là **cái khuôn**: lãi suất, tiền tệ, cách hạch toán. Account là **cái
bánh** đúc từ khuôn đó và thuộc về một khách hàng. Không ai "sở hữu" một product; một product có thể
có rất nhiều account.

| | Savings product | Savings account |
|--|-----------------|-----------------|
| Là gì | Mẫu sản phẩm ngân hàng bán | Tài khoản cụ thể của một client (hoặc group) |
| Chứa gì | Lãi suất, tiền tệ, quy tắc hạch toán, GL nào nhận loại tiền nào | Số dư, giao dịch, trạng thái |
| Ai sở hữu | Không ai | Client hoặc group |
| Endpoint | `/savingsproducts` | `/savingsaccounts` |

**Fineract làm gì.** Một khách có thể có nhiều tài khoản đang hoạt động trên cùng một product
(kiểm chứng: FIN-ACC-005-a trên 1.15.0). Khi tài khoản đã Active, **không đổi được** product hay lãi
suất của nó nữa (kiểm chứng: FIN-LIFE-02 trên 1.15.0).

**Bất ngờ: "savings" không có nghĩa là tiết kiệm.** Module savings là bộ máy tài khoản tiền gửi
chung của core. Fineract **không có API tài khoản thanh toán (current account)** riêng; một tài
khoản thanh toán hằng ngày chính là một savings account. Product nào cho phép thấu chi thì số dư có
thể âm như tài khoản thanh toán (kiểm chứng: FIN-SAV-01 trên 1.15.0: không có path nào chứa
`currentaccount` trong tài liệu OpenAPI, và một tài khoản rút 60 trên product cho thấu chi 100 có số
dư `-60.000000`).

### Quy tắc hạch toán (accounting rule) của product

Mỗi product chọn một `accountingRule`: 1 none, 2 cash based, 3 periodic accrual, 4 upfront accrual.

| accountingRule | Kết quả |
|----------------|---------|
| 1 · None | Tiền vẫn chuyển động, nhưng **không có journal entry nào** được ghi (kiểm chứng: FIN-LEDGER-01 trên 1.15.0: nạp 77, số dư 77, sổ cái tăng 0 dòng) |
| 2 · Cash based | Mỗi giao dịch sinh ra các dòng sổ cái; product phải được nối với đủ 9 GL account |

**Vì sao?** Câu "Fineract giữ sổ sách" chỉ đúng nếu product bật hạch toán. Hãy kiểm tra
`accountingRule` trên **mọi** product.

## 5. Vòng đời tài khoản: một quyết định, không phải một dòng dữ liệu

**Hiểu nôm na.** Mở tài khoản ở ngân hàng là một **quyết định** có người duyệt, có ngày, chứ không
phải "chèn một dòng vào bảng". Fineract mô hình hoá đúng như vậy.

<svg viewBox="0 0 720 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vòng đời tài khoản savings trong Fineract: Submitted and pending approval (mã 100), sau lệnh approve thành Approved (mã 200), sau lệnh activate thành Active (mã 300), và sau lệnh close khi số dư bằng không thành Closed. Chỉ ở trạng thái Active tiền mới vào ra được.">
  <defs>
    <marker id="fc2-life" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="10"  y="40" width="150" height="56" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="85"  y="63" fill="#0F172A">Submitted</text>
    <text x="85"  y="81" fill="#64748B" font-size="10">100 · chờ duyệt</text>
    <rect x="200" y="40" width="140" height="56" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="270" y="63" fill="#0F172A">Approved</text>
    <text x="270" y="81" fill="#64748B" font-size="10">200 · đã duyệt</text>
    <rect x="380" y="40" width="140" height="56" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="450" y="63" fill="#047857">Active</text>
    <text x="450" y="81" fill="#64748B" font-size="10">300 · tiền vào ra được</text>
    <rect x="560" y="40" width="150" height="56" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="635" y="63" fill="#0F172A">Closed</text>
    <text x="635" y="81" fill="#64748B" font-size="10">chỉ khi số dư = 0</text>
    <line x1="160" y1="68" x2="196" y2="68" stroke="#64748B" marker-end="url(#fc2-life)"/>
    <line x1="340" y1="68" x2="376" y2="68" stroke="#64748B" marker-end="url(#fc2-life)"/>
    <line x1="520" y1="68" x2="556" y2="68" stroke="#64748B" marker-end="url(#fc2-life)"/>
    <text x="178" y="120" fill="#64748B" font-size="10">approve</text>
    <text x="358" y="120" fill="#64748B" font-size="10">activate</text>
    <text x="538" y="120" fill="#64748B" font-size="10">close</text>
  </g>
</svg>

| Bước | Lệnh | Trạng thái sau |
|------|------|----------------|
| Nộp hồ sơ | `POST /savingsaccounts` | `Submitted and pending approval` |
| Duyệt | `POST /savingsaccounts/{id}?command=approve` | `Approved` |
| Kích hoạt | `POST /savingsaccounts/{id}?command=activate` | `Active` |
| Đóng | `POST /savingsaccounts/{id}?command=close` | `Closed` |

**Fineract làm gì.**

- Nạp tiền vào tài khoản chưa Active bị từ chối với HTTP 400 và lý do
  `Transaction is not allowed. Account is not active.` (kiểm chứng: FIN-LIFE-01 trên 1.15.0).
- Mỗi lệnh chỉ chạy từ đúng trạng thái trước nó. Bỏ qua bước duyệt mà kích hoạt luôn sẽ nhận HTTP 400
  `not.in.approved.state` (theo ghi chép nội bộ của nhóm, chạy trên 1.15.0).
- Đóng tài khoản bị từ chối khi số dư khác 0, và thành công khi số dư bằng 0, trạng thái chuyển
  thành `Closed` (kiểm chứng: FIN-ACC-008-a trên 1.15.0).

**Điều cần nhớ.** Tạo xong tài khoản **chưa** có nghĩa là dùng được. Bốn lời gọi mới có một tài
khoản có tiền: submit, approve, activate, deposit.

## 6. Sub-status và block: trục trạng thái thứ hai

**Hiểu nôm na.** `status` cho biết tài khoản đang ở đâu trong vòng đời. `subStatus` là một trục
**riêng**, dùng để đánh dấu những thứ như "đang bị đóng băng".

**Fineract làm gì.** `subStatus.value` có các giá trị: `None` · `Inactive` · `Dormant` · `Escheat` ·
`Block` · `BlockCredit` · `BlockDebit`. Ba giá trị cuối là **block**:

| Lệnh | subStatus sau | Ý nghĩa |
|------|---------------|---------|
| `command=block` | `Block` | Chặn cả tiền vào lẫn tiền ra |
| `command=blockDebit` | `BlockDebit` | Chặn tiền ra |
| `command=blockCredit` | `BlockCredit` | Chặn tiền vào |
| `command=unblock` | `None` | Gỡ block toàn phần |

Block và unblock hoạt động; khi đang có block toàn phần thì lệnh block một chiều bị từ chối
(kiểm chứng: FIN-ACC-009-a trên 1.15.0: `blocked=Block partial=refused cleared=None`).

**Điều cần nhớ.** Khi block một tài khoản, `status` **vẫn là Active**. Code nào chỉ đọc `status`
sẽ coi một tài khoản bị đóng băng là bình thường. Luôn đọc cả `subStatus`. Core chỉ giữ **một**
trạng thái block tại một thời điểm; cách block kết hợp và thu hẹp được trình bày ở Bài 6.

## 7. Charge: định nghĩa phí

**Hiểu nôm na.** Biểu phí: "phí rút tiền 3 USD", "phí duy trì hằng tháng"...

**Fineract làm gì.** Một **charge** là một định nghĩa phí (`POST /charges`), được gắn vào tài khoản
(`POST /savingsaccounts/{id}/charges`). Core ghi phí mà ta bảo nó ghi, vào GL **Fee Income**.

- Có thể gắn phí **sau khi** tài khoản đã Active (kiểm chứng: FIN-ACC-019-a trên 1.15.0).
- Mỗi khoản phí trên tài khoản có `amount`, `amountPaid`, `amountOutstanding` và `dueDate`
  (kiểm chứng: FIN-ACC-022-b trên 1.15.0).
- Không có endpoint nào tổng hợp "bảng kê phí" theo kỳ (kiểm chứng: FIN-ACC-022-a trên 1.15.0).

**Điều cần nhớ.** Core lưu các lần **ghi phí**, không đếm "bạn đã dùng dịch vụ này 7 lần". Bảng kê
phí cho khách là việc nền tảng phải tự dựng.

## 8. Hold: giữ một số tiền, không phải đóng băng

**Hiểu nôm na.** Khi bạn quẹt thẻ ở khách sạn, ngân hàng "tạm giữ" một khoản: tiền vẫn của bạn
nhưng chưa tiêu được. Đó là **hold**.

**Fineract làm gì.**

- `POST /savingsaccounts/{id}/transactions?command=holdAmount` giữ một số tiền. Hold làm giảm
  **số dư khả dụng** (`availableBalance`) mà **không** làm thay đổi số dư sổ cái (`accountBalance`);
  lệnh `releaseAmount` trả lại sạch sẽ (kiểm chứng: FIN-TRF-002-c trên 1.15.0:
  `held_balance=0 held_available=-50 released_available=0`).
- Hold và lệnh nhả hold đều là **dòng giao dịch** trong lịch sử tài khoản (kiểm chứng: FIN-ACC-002-b
  trên 1.15.0).
- Nhiều hold cộng dồn; hold vượt quá số dư khả dụng bị từ chối (kiểm chứng: FIN-ACC-011-b trên 1.15.0).

| | Hold | Block |
|--|------|-------|
| Tác động | Giữ một **số tiền** cụ thể | Đóng băng **cả tài khoản** (một hoặc hai chiều) |
| Thấy ở đâu | Dòng giao dịch, `availableBalance` | `subStatus` |
| Ví dụ | Tiền dành cho một giao dịch thẻ | Tài khoản bị tạm đóng băng theo một quyết định nghiệp vụ |

## 9. GL account: sổ sách của chính ngân hàng

**Hiểu nôm na.** **Sổ cái** (general ledger, GL) là sổ sách của chính ngân hàng. Mỗi **GL account**
là một "ngăn" có nhãn trong sổ đó: Tiền mặt, Tiền gửi của khách...

**Fineract làm gì.** Core có đúng năm loại GL account (đọc từ `GET /glaccounts/template`):

| Mã | Loại | Nghĩa | Ví dụ trong ngân hàng thử nghiệm |
|----|------|-------|----------------------------------|
| 1 | ASSET | Thứ ngân hàng **có** | Cash, Overdraft Portfolio |
| 2 | LIABILITY | Thứ ngân hàng **nợ** | Savings Control, Transfers In Suspense |
| 3 | EQUITY | Vốn của chủ sở hữu | (không dùng ở đây) |
| 4 | INCOME | Thứ ngân hàng **kiếm được** | Fee Income, Penalty Income, Interest Income |
| 5 | EXPENSE | Thứ ngân hàng **chi ra** | Interest Expense, Write Off |

Mã `glCode` (ví dụ `10100`) là **nhãn do ta đặt**, không phải do Fineract sinh ra. Trường `usage`:
1 = detail (ghi tiền vào được), 2 = header (chỉ là tiêu đề nhóm).

**Điều cần nhớ: hai thứ cùng tên "account".**

| | Tài khoản của khách | GL account |
|--|---------------------|------------|
| Ví dụ | Tài khoản savings của Ada | "Cash", "Savings Control" |
| Của ai | Của khách | Sổ sách của ngân hàng |
| Ai thấy | Khách, trên app | Bộ phận tài chính, khách không bao giờ thấy |

Hàng nghìn tài khoản khách cùng ghi vào **một** ngăn Savings Control.

## 10. Journal entry: một dòng trong sổ cái

**Hiểu nôm na.** Mỗi lần tiền di chuyển, sổ cái ghi **hai** dòng: một Nợ (DEBIT), một Có (CREDIT).
Mỗi dòng là một **journal entry**. (Bài 5 giải thích kỹ vì sao luôn là hai.)

**Fineract làm gì.** Đây là journal entry đầu tiên sau khi nạp 500 vào một tenant trắng, đọc từ
`GET /journalentries` (đã rút gọn):

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
  "transactionId": "S1",
  "entityType": "SAVING",
  "manualEntry": false,
  "createdByUserName": "mifos"
}
```

| Trường | Đọc thế nào |
|--------|-------------|
| `entryType` · `amount` | Bên nào, bao nhiêu: DEBIT 500 |
| `glAccountName` / `glAccountCode` | Ngăn nào: Cash, 10100 |
| `transactionId` "S1" | Giao dịch savings đã sinh ra dòng này; cặp hai dòng dùng chung giá trị này |
| `entityType` SAVING | Đến từ một savings account |
| `createdByUserName` | User API đã gọi (ở đây là user dev mặc định), không phải khách hàng |

## 11. Financial activity mapping: "tiền đang đi đường thì nằm ở đâu?"

**Hiểu nôm na.** Một số hoạt động hạch toán không gắn với product nào mà áp dụng cho cả tenant. Core
cần được chỉ: "với loại hoạt động này, hãy dùng GL account kia".

**Fineract làm gì.** Chuyển khoản giữa hai tài khoản đi qua một GL trung gian ("suspense"). Hoạt
động tương ứng là `liabilityTransfer`, id **200**. Một tenant mới **chưa có** mapping này, và mọi
lệnh chuyển khoản sẽ thất bại với HTTP 404:

```
Financial Activity account with for the financial Activity with Id 200 does not exist
```

(Chữ "with for" lủng củng là nguyên văn của Fineract.) Sau khi map
`POST /financialactivityaccounts` với `financialActivityId: 200` vào GL Transfers In Suspense,
chuyển khoản chạy được (kiểm chứng: FIN-TRF-001-f trên 1.15.0). Bài 4 sẽ cho bạn tự gặp lỗi này rồi
sửa nó.

## 12. Business date: "hôm nay" của core là ngày nào?

**Hiểu nôm na.** Ngân hàng có khái niệm "ngày làm việc": một giao dịch lúc 23:55 có thể được tính
cho ngày hôm sau nếu ngày làm việc đã chốt sổ lúc 23:45.

**Fineract làm gì.** Theo tài liệu kiến trúc của Fineract (chương *Business Date*, đề xuất thiết kế
trong tài liệu dự án), **business date**
là một ngày **logic**, tách khỏi lịch thật của máy chủ, quản lý qua job hoặc API. Tài liệu OpenAPI
của bản 1.15.0 có endpoint `/v1/businessdate`. Ghi chú trong bộ kiểm chứng của Onward cho biết trên
một tenant trắng, business date **đang tắt**, nên các phép tính như tính lãi dùng ngày hiện tại thật
(đây là ghi chú đi kèm FIN-ACC-022-c, không phải một claim riêng; chi tiết bật/tắt: chưa kiểm chứng).

**Điều cần nhớ.** Khi thấy kết quả phụ thuộc vào "hôm nay" (lãi, các job định kỳ), hãy hỏi: core
đang dùng ngày thật hay business date?

## Tóm tắt bằng một bảng

| Khái niệm | Một câu |
|-----------|---------|
| Office | Cây chi nhánh; không phải tenant, không phải ranh giới khách hàng |
| Client | Người ngân hàng biết; không giữ tiền |
| Group | Sở hữu chung; core không kiểm tra thành viên |
| Product | Cái khuôn: lãi suất, tiền tệ, hạch toán |
| Account | Cái bánh: mở cho client trên product |
| Vòng đời | Submitted → Approved → Active → Closed |
| subStatus / Block | Trục đóng băng riêng; status vẫn Active |
| Charge | Định nghĩa phí; core ghi phí ta bảo nó ghi |
| Hold | Giữ một số tiền; giảm số dư khả dụng, không động vào sổ cái |
| GL account | Một ngăn trong sổ sách của ngân hàng |
| Journal entry | Một dòng Nợ hoặc Có |
| Financial activity mapping | GL cho hoạt động toàn tenant, ví dụ suspense cho chuyển khoản |
| Business date | Ngày logic của core |

## Checklist cuối bài

- [ ] Tôi giải thích được vì sao client **không có số dư**.
- [ ] Tôi phân biệt được product (khuôn) và account (bánh), và biết product không đổi được sau khi Active.
- [ ] Tôi kể được bốn trạng thái vòng đời và biết tiền chỉ vào ra được khi **Active**.
- [ ] Tôi biết phải đọc **`subStatus`**, không chỉ `status`, để phát hiện tài khoản bị block.
- [ ] Tôi phân biệt được hold (một số tiền) với block (cả tài khoản).
- [ ] Tôi phân biệt được tài khoản của khách với **GL account**.
- [ ] Tôi biết chuyển khoản cần mapping hoạt động **200 → suspense**.

## Nguồn tham khảo

1. Apache Fineract, tài liệu chính thức (Architecture: Business Date, Multi-tenanted). <https://fineract.apache.org/docs/current/>
2. Mã nguồn Apache Fineract tại tag 1.15.0. <https://github.com/apache/fineract/tree/1.15.0>
3. README tại tag 1.15.0. <https://github.com/apache/fineract/blob/1.15.0/README.md>
4. Bộ kiểm chứng hành vi Fineract của Onward (nội bộ, chạy trên 1.15.0 với tenant trắng); mã claim được ghi cạnh từng hành vi.

**Bài tiếp theo:** [Bài 3 · Chạy Fineract trên máy local](/docs/fineract/chay-fineract-local)
