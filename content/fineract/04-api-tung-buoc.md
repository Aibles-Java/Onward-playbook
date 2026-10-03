---
title: "Bài 4 · Gọi API từng bước"
description: "Từ một tenant trắng tới một giao dịch chuyển tiền: tạo GL account và product, tạo client, mở và kích hoạt tài khoản, nạp, chuyển, rút tiền và đọc lịch sử giao dịch bằng curl."
order: 4
tags: [fineract, core-banking, api, curl, savings, ledger]
language: vi
profile: onward-fineract-course
classification: public-safe
source_repo: none
source_refs:
  - https://github.com/apache/fineract/blob/1.15.0/README.md
  - https://github.com/apache/fineract/tree/1.15.0
  - https://fineract.apache.org/docs/current/
---

# Bài 4 · Gọi API từng bước

> Bạn sẽ dựng một "ngân hàng" nhỏ từ con số 0: chín ngăn sổ cái, một sản phẩm, hai khách hàng, hai
> tài khoản, rồi cho tiền chạy giữa họ và đọc lại từng dòng sổ cái. Mọi output trong bài là output
> thật, chép từ terminal khi nhóm Onward chạy trên Apache Fineract 1.15.0 với một
> tenant trắng.

## Sau bài này bạn sẽ

1. Tạo được GL account và một savings product có bật hạch toán.
2. Tạo client, rồi đưa một tài khoản qua đủ ba bước submit → approve → activate.
3. Nạp, chuyển và rút tiền, và đọc được các dòng sổ cái chúng sinh ra.
4. Tự gặp và tự sửa ba cái bẫy kinh điển: thiếu mapping GL, thiếu payment type, thiếu financial activity mapping.

## Trước khi bắt đầu

- Fineract 1.15.0 đang chạy và **tenant trắng** (Bài 3, bước 9).
- Đã dán khối hàm `fin`, `j`, `D` và `state` (Bài 3, bước 6–7). `state` phải in toàn số 0.
- Dán thêm hai hàm trợ giúp này:

```bash
# glid 20100 -> id của GL account có mã 20100
glid() { fin GET /glaccounts | j | jq -r --arg c "$1" '.[]|select(.glCode==$c).id'; }

# st 1 -> một dòng tóm tắt tài khoản savings số 1
st() { fin GET /savingsaccounts/$1 | j | jq -c \
  '{id,client:.clientName,status:.status.value,balance:.summary.accountBalance}'; }
```

> 💡 **Id không phải vị trí.** Id đến từ bộ đếm của database, và một lần chèn thất bại vẫn dùng mất
> một số. Bài này luôn tra id bằng `glid`, `PAY`, `SUSP` thay vì đoán. Id của bạn có thể khác; tên,
> mã, trạng thái và số dư thì không. **Đừng chạy lại một bước đã trả HTTP 200.**

> Từ bước 4 tới bước 9, lệnh dùng thẳng id `1`, `2` và `4` để dễ đọc: trên một tenant trắng chạy đúng
> thứ tự, đó chính là các id mà bước trước vừa trả về. Nếu output của bạn trả id khác, hãy thay bằng id của bạn.

Lộ trình:

| # | Bước | `state` sau bước |
|---|------|------------------|
| 1 | 9 GL account | GL 9 |
| 2 | Một savings product | products 1 |
| 3 | Một payment type | (không đổi) |
| 4 | Khách hàng Ada | clients 1 |
| 5–7 | Submit → approve → activate | accounts 1 |
| 8 | Nạp 500 | journal 2 |
| 9 | Khách thứ hai + chuyển 120 | clients 2 · accounts 2 · journal 6 |
| 10 | Rút tiền | journal 8 |
| 11 | Đọc lịch sử giao dịch | (không đổi) |

## Bước 1 · Sổ cái: chín GL account

Một product có hạch toán kiểu cash cần một GL cho mỗi loại chuyển động tiền: tiền mặt, tiền của
khách, lãi, phí, phạt, tiền đang chuyển, thấu chi, xoá nợ.

```bash
mk() { fin POST /glaccounts \
  -d "{\"name\":\"$1\",\"glCode\":\"$2\",\"type\":$3,\"usage\":1,\"manualEntriesAllowed\":true}"; }
mk "Cash" "10100" 1
mk "Savings Control" "20100" 2
mk "Interest Expense" "50100" 5
mk "Fee Income" "40100" 4
mk "Transfers In Suspense" "20200" 2
mk "Penalty Income" "40200" 4
mk "Overdraft Portfolio" "10200" 1
mk "Interest Income" "40300" 4
mk "Write Off" "50200" 5
```

Bạn sẽ thấy chín lần `{"resourceId":N}` kèm `[HTTP 200]`. Kiểm tra:

```bash
fin GET /glaccounts | j | jq -r '.[] | "\(.id) \(.glCode) \(.name) \(.type.value)"'
```

```
1 10100 Cash ASSET
7 10200 Overdraft Portfolio ASSET
2 20100 Savings Control LIABILITY
5 20200 Transfers In Suspense LIABILITY
4 40100 Fee Income INCOME
6 40200 Penalty Income INCOME
8 40300 Interest Income INCOME
3 50100 Interest Expense EXPENSE
9 50200 Write Off EXPENSE
```

| Trường | Ý nghĩa |
|--------|---------|
| `glCode` | Mã trong hệ thống tài khoản của bạn. Phải duy nhất; `glid` dùng nó để tìm lại |
| `type` | 1 asset · 2 liability · 3 equity · 4 income · 5 expense |
| `usage` | 1 detail (ghi tiền vào được) · 2 header (chỉ là tiêu đề nhóm) |
| `manualEntriesAllowed` | Cho phép nhân viên ghi sổ tay vào GL này. Bài này không dùng |

**Nếu lỡ chạy một dòng hai lần**, bạn nhận `[HTTP 403]` với `duplicate key value violates unique
constraint "acc_gl_account_gl_code_key"`. Không hỏng gì: GL đó đã tồn tại. Chạy lệnh kiểm tra; đủ
chín mã là được.

`state` → `GL 9 · products 0 · clients 0 · accounts 0 · journal 0`

## Bước 2 · Sản phẩm: "Everyday Current Account"

Tra chín id trước:

```bash
CASH=$(glid 10100) SAVCTL=$(glid 20100) INTEXP=$(glid 50100)
FEEINC=$(glid 40100) SUSP=$(glid 20200) PENINC=$(glid 40200)
OVD=$(glid 10200) INTINC=$(glid 40300) WOFF=$(glid 50200)
echo "CASH=$CASH SAVCTL=$SAVCTL INTEXP=$INTEXP FEEINC=$FEEINC SUSP=$SUSP PENINC=$PENINC OVD=$OVD INTINC=$INTINC WOFF=$WOFF"
```

Không biến nào được rỗng. Rồi tạo product:

```bash
fin POST /savingsproducts -d "{
  \"name\":\"Everyday Current Account\",\"shortName\":\"EVCA\",
  \"description\":\"Teaching product\",
  \"currencyCode\":\"USD\",\"digitsAfterDecimal\":2,\"inMultiplesOf\":1,
  \"nominalAnnualInterestRate\":2.5,
  \"interestCompoundingPeriodType\":1,\"interestPostingPeriodType\":4,
  \"interestCalculationType\":1,\"interestCalculationDaysInYearType\":365,
  \"accountingRule\":2,
  \"savingsReferenceAccountId\":$CASH,\"savingsControlAccountId\":$SAVCTL,
  \"interestOnSavingsAccountId\":$INTEXP,\"incomeFromFeeAccountId\":$FEEINC,
  \"transfersInSuspenseAccountId\":$SUSP,\"incomeFromPenaltyAccountId\":$PENINC,
  \"overdraftPortfolioControlId\":$OVD,\"incomeFromInterestId\":$INTINC,
  \"writeOffAccountId\":$WOFF,
  \"locale\":\"en\"}"
```

```
{"resourceId":1}
[HTTP 200]
```

Kiểm tra: mapping trả về **theo tên**, nên bạn đối chiếu được mà không cần tin vào id nào:

```bash
fin GET /savingsproducts/1 | j | jq '{id, name, accountingRule: .accountingRule.value,
  interest: .nominalAnnualInterestRate, mappings: (.accountingMappings | map_values(.name))}'
```

```json
{
  "id": 1,
  "name": "Everyday Current Account",
  "accountingRule": "CASH BASED",
  "interest": 2.500000,
  "mappings": {
    "savingsReferenceAccount": "Cash",
    "overdraftPortfolioControl": "Overdraft Portfolio",
    "incomeFromFeeAccount": "Fee Income",
    "incomeFromPenaltyAccount": "Penalty Income",
    "incomeFromInterest": "Interest Income",
    "interestOnSavingsAccount": "Interest Expense",
    "writeOffAccount": "Write Off",
    "savingsControlAccount": "Savings Control",
    "transfersInSuspenseAccount": "Transfers In Suspense"
  }
}
```

| Trường | Giá trị | Ý nghĩa |
|--------|---------|---------|
| `currencyCode` · `digitsAfterDecimal` | USD · 2 | Tiền tệ và số chữ số thập phân |
| `nominalAnnualInterestRate` | 2.5 | Lãi suất năm, tính theo % |
| `interestCompoundingPeriodType` | 1 | Kỳ nhập lãi: 1 ngày · 4 tháng · 5 quý · 6 nửa năm · 7 năm |
| `interestPostingPeriodType` | 4 | Kỳ trả lãi vào tài khoản: cùng bảng mã như trên |
| `interestCalculationType` | 1 | 1 số dư hằng ngày · 2 số dư bình quân ngày |
| `interestCalculationDaysInYearType` | 365 | Năm 360 hay 365 ngày |
| `accountingRule` | 2 | 1 none · 2 cash based · 3 periodic accrual · 4 upfront accrual |
| chín trường `…AccountId` / `…Id` | id của bạn | Mỗi loại chuyển động tiền ghi vào GL nào |

> 🪤 **Bẫy 1: chín mapping, không phải bốn.** Chỉ gửi bốn mapping "hiển nhiên"
> (`savingsReference`, `savingsControl`, `interestOnSavings`, `incomeFromFee`) thì request thất bại
> với `[HTTP 400]` và năm lỗi riêng, bắt đầu bằng
> ``The parameter `transfersInSuspenseAccountId` is mandatory.``

**Vì sao `accountingRule` quan trọng?** Với `accountingRule: 1` (none), mọi thứ vẫn chạy: tài khoản
mở được, tiền chuyển được, nhưng **không có journal entry nào** được ghi (kiểm chứng: FIN-LEDGER-01
trên 1.15.0). Sổ cái là tuỳ chọn trong Fineract.

`state` → `GL 9 · products 1 · clients 0 · accounts 0 · journal 0`

## Bước 3 · Tiền vào bằng cách nào: payment type

```bash
fin POST /paymenttypes -d '{"name":"Cash","description":"Cash at branch",
  "isCashPayment":true,"position":1}'
```

```
{"resourceId":4}
[HTTP 200]
```

Id là 4 vì một tenant mới đã có sẵn ba payment type:

```bash
fin GET /paymenttypes | j | jq -c '.[] | {id, name, isCashPayment}'
```

```
{"id":1,"name":"Money Transfer","isCashPayment":false}
{"id":2,"name":"Repayment Adjustment Chargeback","isCashPayment":false}
{"id":3,"name":"Repayment Adjustment Refund","isCashPayment":false}
{"id":4,"name":"Cash","isCashPayment":true}
```

> 🪤 **Bẫy 2: không có payment type tiền mặt sẵn.** Ba loại có sẵn đều không phải tiền mặt, và nạp
> tiền **bắt buộc** có `paymentTypeId`. Bạn sẽ thấy lỗi ở bước 8.

## Bước 4 · Một khách hàng

```bash
fin POST /clients -d "{\"officeId\":1,\"legalFormId\":1,
  \"firstname\":\"Ada\",\"lastname\":\"Lovelace\",
  \"activationDate\":\"01 August 2026\",\"active\":true,$D}"
```

```
{"officeId":1,"clientId":1,"resourceId":1}
[HTTP 200]
```

Kiểm tra:

```bash
fin GET /clients/1 | j | jq -c '{id, displayName, status: .status.value, office: .officeName, activationDate}'
```

```json
{"id":1,"displayName":"Ada Lovelace","status":"Active","office":"Head Office","activationDate":[2026,8,1]}
```

| Trường | Ý nghĩa |
|--------|---------|
| `officeId: 1` | Head Office, office duy nhất của tenant mới |
| `legalFormId: 1` | 1 cá nhân · 2 pháp nhân |
| `active` + `activationDate` | Tạo và kích hoạt luôn trong một lời gọi. Bỏ cả hai thì client ở trạng thái Pending |
| `$D` | Định dạng ngày, để `01 August 2026` đọc được |

Để ý: Fineract nhận ngày dạng chữ nhưng trả về dạng mảng `[2026,8,1]`. Và client **không có số dư**.

`state` → `GL 9 · products 1 · clients 1 · accounts 0 · journal 0`

## Bước 5–7 · Vòng đời tài khoản: ba bước, không phải một

### Bước 5 · Nộp hồ sơ (submit)

```bash
fin POST /savingsaccounts -d "{\"clientId\":1,\"productId\":1,
  \"submittedOnDate\":\"01 August 2026\",$D}"
st 1
```

```
{"officeId":1,"clientId":1,"savingsId":1,"resourceId":1,"gsimId":0}
[HTTP 200]
{"id":1,"client":"Ada Lovelace","status":"Submitted and pending approval","balance":0.000000}
```

**Thử ngay: nạp tiền vào tài khoản mới chỉ nộp hồ sơ.**

```bash
# 4 = resourceId mà bước 3 vừa trả về
fin POST "/savingsaccounts/1/transactions?command=deposit" \
  -d "{\"transactionDate\":\"01 August 2026\",\"transactionAmount\":500,\"paymentTypeId\":4,$D}" \
  | j | jq -r '.errors[].developerMessage'
```

```
Transaction is not allowed. Account is not active.
```

Bị từ chối (HTTP 400). Tài khoản tồn tại nhưng chưa giữ được tiền (kiểm chứng: FIN-LIFE-01 trên
1.15.0). `defaultUserMessage` của lỗi này chỉ là `"transactionDate"`, nên luôn đọc `developerMessage`.

### Bước 6 · Duyệt (approve)

```bash
fin POST "/savingsaccounts/1?command=approve" \
  -d "{\"approvedOnDate\":\"01 August 2026\",$D}"
st 1
```

Phản hồi dài; phần quan trọng là `"changes":{"status":{"id":200, ... "value":"Approved"}}` và
`[HTTP 200]`. Sau đó:

```
{"id":1,"client":"Ada Lovelace","status":"Approved","balance":0.000000}
```

### Bước 7 · Kích hoạt (activate)

```bash
fin POST "/savingsaccounts/1?command=activate" \
  -d "{\"activatedOnDate\":\"01 August 2026\",$D}"
st 1
```

Phản hồi chứa `"status":{"id":300, ... "value":"Active"}`. Sau đó:

```
{"id":1,"client":"Ada Lovelace","status":"Active","balance":0.000000}
```

**Nếu bị lỗi:** mỗi lệnh chỉ chạy từ đúng trạng thái trước nó. Bỏ qua approve mà activate luôn sẽ
nhận `[HTTP 400] Failed data validation due to: not.in.approved.state`. Nếu `st 1` đã hiện trạng thái
bạn muốn, bước đó đã chạy rồi, đi tiếp.

**Vì sao ba bước?** Một tài khoản là một **quyết định** của ngân hàng, có người quyết và ngày quyết,
không phải một dòng ai đó chèn vào bảng. Đó cũng là lý do product không đổi được sau khi tài khoản
rời trạng thái Submitted (kiểm chứng: FIN-LIFE-02 trên 1.15.0).

`state` → `GL 9 · products 1 · clients 1 · accounts 1 · journal 0`

## Bước 8 · Nạp tiền, và sổ cái thức dậy

**Thử trước: nạp tiền không có payment type.**

```bash
fin POST "/savingsaccounts/1/transactions?command=deposit" \
  -d "{\"transactionDate\":\"01 August 2026\",\"transactionAmount\":500,$D}" \
  | j | jq -r '.errors[].developerMessage'
st 1
```

```
The parameter `paymentTypeId` is mandatory.
{"id":1,"client":"Ada Lovelace","status":"Active","balance":0.000000}
```

Đó là bẫy 2: bị từ chối, số dư không đổi. Giờ tra payment type Cash rồi nạp:

```bash
PAY=$(fin GET /paymenttypes | j | jq -r '.[] | select(.name=="Cash").id'); echo "PAY=$PAY"
fin POST "/savingsaccounts/1/transactions?command=deposit" \
  -d "{\"transactionDate\":\"01 August 2026\",\"transactionAmount\":500,\"paymentTypeId\":$PAY,$D}"
```

```
PAY=4
{"officeId":1,"clientId":1,"savingsId":1,"resourceId":1,"changes":{"paymentTypeId":4}}
[HTTP 200]
```

Kiểm tra số dư, rồi sổ cái:

```bash
st 1
fin GET "/journalentries?limit=20" | j | jq -r \
  '.pageItems | sort_by(.id)[] | "\(.entryType.value)\t\(.amount)\t\(.glAccountName)\t\(.glAccountCode)"'
```

```
{"id":1,"client":"Ada Lovelace","status":"Active","balance":500.000000}
DEBIT	500.000000	Cash	10100
CREDIT	500.000000	Savings Control	20100
```

**Dừng lại và nhìn kỹ.** Bạn nạp **một** lần; sổ cái ghi **hai** dòng. Tiền mặt của ngân hàng tăng
500 (ghi Nợ một tài sản), và khoản ngân hàng nợ Ada cũng tăng 500 (ghi Có một khoản nợ). Không có gì
được "tạo ra"; giá trị chỉ đi từ chỗ này sang chỗ kia, và cả hai chỗ đều được ghi lại. Bài 5 giải
thích kỹ vì sao.

`state` → `GL 9 · products 1 · clients 1 · accounts 1 · journal 2`

## Bước 9 · Tiền đi giữa hai người

### 9a · Khách thứ hai: Grace

Cùng các lệnh của bước 4–7, cho client số 2:

```bash
fin POST /clients -d "{\"officeId\":1,\"legalFormId\":1,
  \"firstname\":\"Grace\",\"lastname\":\"Hopper\",
  \"activationDate\":\"01 August 2026\",\"active\":true,$D}"
fin POST /savingsaccounts -d "{\"clientId\":2,\"productId\":1,
  \"submittedOnDate\":\"01 August 2026\",$D}"
fin POST "/savingsaccounts/2?command=approve" -d "{\"approvedOnDate\":\"01 August 2026\",$D}" | tail -1
fin POST "/savingsaccounts/2?command=activate" -d "{\"activatedOnDate\":\"01 August 2026\",$D}" | tail -1
st 2
```

```
{"officeId":1,"clientId":2,"resourceId":2}
[HTTP 200]
{"officeId":1,"clientId":2,"savingsId":2,"resourceId":2,"gsimId":0}
[HTTP 200]
[HTTP 200]
[HTTP 200]
{"id":2,"client":"Grace Hopper","status":"Active","balance":0.000000}
```

### 9b · Thử chuyển khoản, trước khi sổ cái biết tiền "đi đường" nằm ở đâu

```bash
D2='"locale":"en","dateFormat":"dd MMMM yyyy","transferDescription":"Ada pays Grace"'
T="{\"fromOfficeId\":1,\"fromClientId\":1,\"fromAccountType\":2,\"fromAccountId\":1,
  \"toOfficeId\":1,\"toClientId\":2,\"toAccountType\":2,\"toAccountId\":2,
  \"transferAmount\":120,\"transferDate\":\"01 August 2026\",$D2}"
fin POST /accounttransfers -d "$T" | j | jq -r '.errors[].developerMessage'
st 1; st 2
```

```
Financial Activity account with for the financial Activity with Id 200 does not exist
{"id":1,"client":"Ada Lovelace","status":"Active","balance":500.000000}
{"id":2,"client":"Grace Hopper","status":"Active","balance":0.000000}
```

`[HTTP 404]` (dòng này bị `j` lọc đi; bỏ `| j | jq ...` để thấy nó), và **không** số dư nào đổi. Ada không bị trừ trong khi Grace không được cộng: một lệnh
chuyển thất bại không làm tiền di chuyển chút nào. (Chữ "with for" là nguyên văn của Fineract.)

| Trường trong `T` | Ý nghĩa |
|------------------|---------|
| `fromAccountType` · `toAccountType` | 1 loan · 2 savings |
| `from…` / `to…` Office, Client, Account | Ai trả, ai nhận. Tiền đi theo **id tài khoản** |
| `transferDescription` | Bắt buộc. Thiếu thì lệnh chuyển bị từ chối |

> ⚠️ Fineract **không kiểm tra** client id có thật sự sở hữu account id hay không. Một lệnh chuyển
> tự mâu thuẫn (`toClientId` là Ada, `toAccountId` là tài khoản của Grace) vẫn trả HTTP 200: Grace
> nhận tiền, còn bản ghi lại nói người nhận là Ada (kiểm chứng: FIN-OWN-01 trên 1.15.0). Bài 6 nói
> kỹ vì sao điều này buộc nền tảng phải tự xác minh quyền sở hữu.

> 🪤 **Bẫy 3: financial activity 200.** Hoạt động 200 là `liabilityTransfer`. Hạch toán kiểu cash
> phải biết GL nào giữ tiền đã rời khách này nhưng chưa tới khách kia. Mặc định không có gì được
> đặt cho nó.

### 9c · Map hoạt động 200 vào GL suspense

```bash
SUSP=$(glid 20200); echo "SUSP=$SUSP"
fin POST /financialactivityaccounts -d "{\"financialActivityId\":200,\"glAccountId\":$SUSP}"
```

```
SUSP=5
{"resourceId":1}
[HTTP 200]
```

Kiểm tra:

```bash
fin GET /financialactivityaccounts | j | jq -c \
  '.[] | {activity: .financialActivityData.name, id: .financialActivityData.id, gl: .glAccountData.name}'
```

```json
{"activity":"liabilityTransfer","id":200,"gl":"Transfers In Suspense"}
```

Mapping này là của **cả tenant**, không phải của một product. Gỡ nó đi thì mọi lệnh chuyển lại thất
bại với đúng lỗi 404 ở trên (kiểm chứng: FIN-TRF-001-f trên 1.15.0).

### 9d · Chuyển lại đúng lệnh đó

```bash
fin POST /accounttransfers -d "$T"
st 1; st 2
```

```
{"savingsId":1,"resourceId":1}
[HTTP 200]
{"id":1,"client":"Ada Lovelace","status":"Active","balance":380.000000}
{"id":2,"client":"Grace Hopper","status":"Active","balance":120.000000}
```

**Nếu bị lỗi:**

- `The referenced JSON data is invalid, validate date format as yyyy-MM-dd ...`: biến `$T` rỗng vì
  bạn đã mở terminal mới sau bước 9b. Dán lại các hàm, rồi dòng `D2=` và `T=`, rồi chạy 9d.
- Số dư là 260 và 240: bạn đã chạy 9d hai lần. Muốn sổ cái khớp với bài này, reset và làm lại.

### Phần thưởng: đọc toàn bộ sổ cái

```bash
fin GET "/journalentries?limit=20" | j | jq -r \
  '.pageItems | sort_by(.id)[] | "\(.id)\t\(.entryType.value)\t\(.amount)\t\(.glAccountName)\t\(.transactionId)"'
```

```
1	DEBIT	500.000000	Cash	S1
2	CREDIT	500.000000	Savings Control	S1
3	DEBIT	120.000000	Savings Control	S3
4	CREDIT	120.000000	Transfers In Suspense	S3
5	DEBIT	120.000000	Transfers In Suspense	S4
6	CREDIT	120.000000	Savings Control	S4
```

Tổng hai cột phải bằng nhau:

```bash
fin GET "/journalentries?limit=50" | j | jq '[.pageItems[] | select(.entryType.value=="DEBIT").amount] | add'
fin GET "/journalentries?limit=50" | j | jq '[.pageItems[] | select(.entryType.value=="CREDIT").amount] | add'
```

```
740
740
```

<svg viewBox="0 0 720 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Một lệnh chuyển 120 từ Ada sang Grace đi qua hai chân. Chân 1, giao dịch S3 trên tài khoản của Ada: ghi Nợ 120 Savings Control, ghi Có 120 Transfers In Suspense. Chân 2, giao dịch S4 trên tài khoản của Grace: ghi Nợ 120 Transfers In Suspense, ghi Có 120 Savings Control. Sau hai chân, số dư suspense trở về 0.">
  <defs>
    <marker id="fc4-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="10" y="45" width="160" height="70" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="90" y="72" fill="#1D4ED8">Tài khoản Ada</text>
    <text x="90" y="92" fill="#64748B" font-size="10">500 → 380</text>
    <rect x="280" y="45" width="160" height="70" rx="8" fill="#F8FAFC" stroke="#94A3B8" stroke-dasharray="5 3"/>
    <text x="360" y="72" fill="#0F172A">Transfers In Suspense</text>
    <text x="360" y="92" fill="#64748B" font-size="10">"hành lang" · về 0</text>
    <rect x="550" y="45" width="160" height="70" rx="8" fill="#ECFDF5" stroke="#10B981"/>
    <text x="630" y="72" fill="#047857">Tài khoản Grace</text>
    <text x="630" y="92" fill="#64748B" font-size="10">0 → 120</text>
    <line x1="170" y1="80" x2="276" y2="80" stroke="#64748B" marker-end="url(#fc4-arrow)"/>
    <line x1="440" y1="80" x2="546" y2="80" stroke="#64748B" marker-end="url(#fc4-arrow)"/>
    <text x="223" y="70" fill="#64748B" font-size="10">chân 1 · S3</text>
    <text x="493" y="70" fill="#64748B" font-size="10">chân 2 · S4</text>
    <text x="360" y="150" fill="#64748B" font-size="11">Mỗi chân tự cân Nợ = Có. Suspense khác 0 nghĩa là tiền bị kẹt giữa đường.</text>
  </g>
</svg>

**Điều đáng hiểu.** Lệnh chuyển không phải một chuyển động mà là **hai cặp** ghi sổ kép: tiền rời
Ada vào suspense, rồi rời suspense vào Grace. Vì sao không một cặp? Vì số dư của Ada và Grace đều nằm
trong cùng một ngăn Savings Control, nên một bút toán trực tiếp sẽ là "Savings Control sang Savings
Control" và chẳng ghi lại được gì hữu ích. Suspense đặt tên cho khoảnh khắc ở giữa. Bài 5 đi sâu vào
phép so sánh "hành lang" này.

`state` → `GL 9 · products 1 · clients 2 · accounts 2 · journal 6`

## Bước 10 · Rút tiền

Rút tiền là hình ảnh phản chiếu của nạp tiền: cùng dạng request, chỉ đổi `command`.

```bash
fin POST "/savingsaccounts/1/transactions?command=withdrawal" \
  -d "{\"transactionDate\":\"01 August 2026\",\"transactionAmount\":80,\"paymentTypeId\":$PAY,$D}"
st 1
```

```
{"officeId":1,"clientId":1,"savingsId":1,"resourceId":5,"changes":{"paymentTypeId":4}}
[HTTP 200]
{"id":1,"client":"Ada Lovelace","status":"Active","balance":300.000000}
```

`resourceId` là id của **dòng giao dịch** rút tiền (5), không phải id tài khoản. Số dư Ada: 380 − 80 = 300.
Đọc lại sổ cái bằng lệnh ở phần thưởng bên trên:

```
1	DEBIT	500.000000	Cash	S1
2	CREDIT	500.000000	Savings Control	S1
3	DEBIT	120.000000	Savings Control	S3
4	CREDIT	120.000000	Transfers In Suspense	S3
5	DEBIT	120.000000	Transfers In Suspense	S4
6	CREDIT	120.000000	Savings Control	S4
7	DEBIT	80.000000	Savings Control	S5
8	CREDIT	80.000000	Cash	S5
```

Hai dòng mới (7, 8) là **đảo** của lần nạp: ngân hàng nợ Ada ít hơn 80 (ghi Nợ Savings Control) và giữ ít
tiền mặt hơn 80 (ghi Có Cash). `S5` khớp với `resourceId` 5 ở trên: tiền tố `S` nghĩa là giao dịch savings.

> 💡 **Vì sao không có `S2`?** Lệnh chuyển thất bại ở bước 9b vẫn dùng mất một số trong bộ đếm giao
> dịch. Đây đúng là lý do bài này không bao giờ đoán id.

`state` → `GL 9 · products 1 · clients 2 · accounts 2 · journal 8`

## Bước 11 · Đọc lịch sử giao dịch

Lịch sử giao dịch của một tài khoản nằm trong chính tài khoản đó, khi bạn yêu cầu kèm
`associations=transactions`:

```bash
fin GET "/savingsaccounts/1?associations=transactions" | j | jq -c \
  '.transactions | sort_by(.id)[] | {id, date, type: .transactionType.code, amount, runningBalance, transfer: (.transfer.id // null)}'
```

```
{"id":1,"date":[2026,8,1],"type":"savingsAccountTransactionType.deposit","amount":500.000000,"runningBalance":500.000000,"transfer":null}
{"id":3,"date":[2026,8,1],"type":"savingsAccountTransactionType.withdrawal","amount":120.000000,"runningBalance":380.000000,"transfer":1}
{"id":5,"date":[2026,8,1],"type":"savingsAccountTransactionType.withdrawal","amount":80.000000,"runningBalance":300.000000,"transfer":null}
```

Ba dòng, đúng ba lần tiền di chuyển trên tài khoản của Ada. Vài điểm để soi:

- `id` của mỗi dòng chính là số sau chữ `S` trong sổ cái (`S1`, `S3`, `S5`). Từ một dòng lịch sử, bạn
  tìm được bút toán của nó, và ngược lại.
- `type` là mã ổn định (`transactionType.code`). Chân đi của lệnh chuyển **cũng** có mã
  `savingsAccountTransactionType.withdrawal`, giống hệt lần rút tiền mặt.
- Thứ duy nhất phân biệt hai dòng đó là `transfer`: dòng 3 có `transfer: 1` (id của lệnh chuyển ở bước
  9d), dòng 5 thì `null`. Bộ kiểm chứng của Onward dùng đúng trường này để tìm chân chuyển khoản trong
  lịch sử.
- `runningBalance` là số dư ngay sau dòng đó: 500 → 380 → 300.
- Ở các bài sau bạn sẽ gặp thêm những loại dòng khác cũng nằm trong lịch sử này: hold
  (`Amount on hold`), nhả hold (`Release Amount`), trả lãi (`Interest posting`).

## Ôn lại ba cái bẫy

| Bẫy | Triệu chứng | Cách sửa |
|-----|-------------|----------|
| 1 · Thiếu mapping GL trên product | HTTP 400, năm lỗi ``The parameter `...AccountId` is mandatory.`` | Gửi đủ chín mapping |
| 2 · Không có payment type tiền mặt | ``The parameter `paymentTypeId` is mandatory.`` | Tạo payment type Cash, tra id của nó |
| 3 · Thiếu financial activity 200 | HTTP 404 `Financial Activity account with for the financial Activity with Id 200 does not exist` | Map 200 vào GL Transfers In Suspense |

## Checklist cuối bài

- [ ] `state` của tôi in `GL 9 · products 1 · clients 2 · accounts 2` sau bước 9.
- [ ] Tôi đã thấy một lần nạp sinh ra **hai** dòng sổ cái.
- [ ] Tôi đã thấy tiền bị từ chối khi tài khoản chưa **Active**.
- [ ] Tôi đã tự gặp lỗi 404 của hoạt động 200, map nó, và chuyển thành công.
- [ ] Tổng Nợ bằng tổng Có (740 = 740 sau bước 9).
- [ ] Sau bước 10, số dư Ada là 300 và sổ cái có 8 dòng.
- [ ] Tôi đọc được lịch sử giao dịch bằng `associations=transactions`, và tìm được chân chuyển khoản nhờ trường `transfer`.
- [ ] Tôi không hard-code id nào mà mình không vừa nhận về.

## Nguồn tham khảo

1. README của Apache Fineract tại tag 1.15.0. <https://github.com/apache/fineract/blob/1.15.0/README.md>
2. Mã nguồn Apache Fineract tại tag 1.15.0 (enum `SavingsAccountTransactionType`, các bảng mã của product). <https://github.com/apache/fineract/tree/1.15.0>
3. Apache Fineract, tài liệu chính thức. <https://fineract.apache.org/docs/current/>
4. Ghi chép nội bộ của nhóm Onward (output đã ghi lại trên 1.15.0, tenant trắng).
5. Bộ kiểm chứng hành vi Fineract của Onward (nội bộ, chạy trên 1.15.0); mã claim ghi cạnh từng hành vi.

**Bài tiếp theo:** [Bài 5 · Ghi sổ kép và sổ cái](/docs/fineract/ghi-so-kep-va-so-cai)
