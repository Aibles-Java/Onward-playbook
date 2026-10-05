---
title: "Bài 6 · Hành vi đã kiểm chứng và các cái bẫy"
description: "Những hành vi của Fineract 1.15.0 đã được chạy lại và xác nhận: block, hold, idempotency key, interest posting, dormancy job, standing instruction, đổi sản phẩm, giao dịch pending. Mỗi mục có lệnh gọi, kết quả và lý do nó quan trọng."
order: 6
tags: [fineract, core-banking, savings-account, block, hold, idempotency, dormancy, interest]
language: vi
profile: onward-fineract-course
classification: public-safe
source_repo: none
source_refs:
  - https://fineract.apache.org/docs/current/#_savings_account_management
  - https://fineract.apache.org/docs/current/#_savings_interest_posting
  - https://fineract.apache.org/docs/current/#_idempotency
  - https://github.com/apache/fineract/releases/tag/1.15.0
---

# Bài 6 · Hành vi đã kiểm chứng và các cái bẫy

> Tài liệu cho bạn biết một API **nhận** những gì. Nó hiếm khi cho bạn biết API **làm gì** khi gặp
> tình huống khó: tài khoản đang bị phong toả, một key bị gửi lại, một job chạy lúc nửa đêm. Bài này
> gom những hành vi như vậy của **Fineract 1.15.0** mà nhóm Onward đã chạy lại và xác nhận. Nhiều hành vi
> trong số đó là bẫy.

**Cần biết trước:** [Bài 2 · Khái niệm cốt lõi](/docs/fineract/khai-niem-cot-loi) (sub-status, block,
hold, charge), [Bài 3 · Chạy Fineract local](/docs/fineract/chay-fineract-local),
[Bài 4 · Gọi API từng bước](/docs/fineract/api-tung-buoc).

## Cách đọc bài này

Theo tài liệu thiết kế nội bộ của Onward, mỗi hành vi của core mà thiết kế dựa vào đều có một **claim**:
một mã như `FIN-ACC-009-c`, kèm một đoạn script gọi API thật trên một tenant trống rồi so kết quả với một
**chuỗi mong đợi**. Script được chạy lại mỗi khi nâng phiên bản core. Một claim thất bại nghĩa là core đã đổi
hành vi, không phải tài liệu cần sửa cho đẹp.

Mỗi mục dưới đây có ba phần:

- **Lệnh gọi:** endpoint và lệnh (`?command=...`) đã dùng.
- **Kết quả:** trích **nguyên văn** chuỗi mong đợi của claim, kèm mã claim. Chuỗi có dạng `tên=giá_trị`:
  `403/...` là HTTP status rồi đến mã lỗi; `moved=0/0` là số dư hai tài khoản thay đổi bao nhiêu;
  `sub=` là sub-status; `cleared=None` nghĩa là đã gỡ hết block khi dọn dẹp.
- **Vì sao quan trọng:** hệ quả cho người tích hợp.

Chỗ nào chưa có claim, bài ghi rõ **chưa kiểm chứng**.

Các lệnh dưới đây đều chạy trên `https://localhost:8443/fineract-provider/api/v1`, với header
`Fineract-Platform-TenantId: default` và basic auth mặc định của môi trường dev local (`mifos` / `password`),
như ở Bài 3. Mọi body có ngày tháng đều cần thêm `"locale":"en","dateFormat":"dd MMMM yyyy"`; các ví dụ bên dưới
viết tắt phần này thành `<locale>`.

## 1 · Block: block, blockDebit, unblockDebit

Fineract có một **sub-status** trên tài khoản tiết kiệm để phong toả. Các giá trị bạn sẽ gặp: `None`,
`Block` (phong toả toàn phần), `BlockDebit` (chặn tiền ra), `BlockCredit` (chặn tiền vào).

**Lệnh gọi:**

```bash
POST /savingsaccounts/{id}?command=block          # body: {"reasonForBlock":1,<locale>}
POST /savingsaccounts/{id}?command=unblock        # body: {<locale>}
POST /savingsaccounts/{id}?command=blockDebit     # body: {"reasonForBlock":1,<locale>}
POST /savingsaccounts/{id}?command=unblockDebit   # body: {<locale>}
POST /savingsaccounts/{id}?command=blockCredit    # body: {"reasonForBlock":1,<locale>}
POST /savingsaccounts/{id}?command=unblockCredit  # body: {<locale>}
```

**Kết quả:**

| Thí nghiệm | Chuỗi mong đợi | Claim |
|------------|----------------|-------|
| block / unblock chạy được; đang block toàn phần thì không đặt thêm block một chiều | `blocked=Block partial=refused cleared=None` | FIN-ACC-009-a |
| `blockDebit`: tiền vào vẫn ghi, tiền ra bị từ chối; `unblock` **không** gỡ được, chỉ `unblockDebit` gỡ được | `sub=BlockDebit deposit=200/+10 withdrawal=403/error.msg.savings.account.debit.transaction.not.allowed moved=0 unblock=400/validation.msg.savingsaccount.unblock.not.in.blocked.state cleared=None` | FIN-ACC-009-c |
| Dưới `blockDebit`: chuyển ra bị từ chối, chuyển vào vẫn ghi | `out=403/error.msg.savings.account.debit.transaction.not.allowed moved=0/0 in=200 moved=7/-7 cleared=None` | FIN-ACC-009-d |
| **Nới rộng:** đặt `block` lên trên `blockDebit` được chấp nhận trong một lệnh | `blockDebit=200 block=200/none sub=Block unblock=200 cleared=None` | FIN-ACC-009-b |
| **Gộp:** `blockDebit` rồi `blockCredit` thành block toàn phần | `blockDebit=200 blockCredit=200/none sub=Block unblock=200 cleared=None` | FIN-ACC-009-e |
| **Thu hẹp:** một lệnh unblock một chiều biến block toàn phần thành block chiều ngược lại | `block-unblockCredit=200/BlockDebit cleared=None combo-unblockCredit=200/BlockDebit cleared=None block-unblockDebit=200/BlockCredit cleared=None` | FIN-ACC-009-f |

(kiểm chứng: FIN-ACC-009-a, -b, -c, -d, -e, -f trên 1.15.0)

**Vì sao quan trọng:**

- Block toàn phần và block một chiều **không cộng dồn theo kiểu bạn đoán**. `unblock` trên một tài khoản đang
  `BlockDebit` trả **400**, không phải 200. Code gỡ block phải gọi đúng lệnh cho đúng sub-status hiện tại.
- Có đường đi một lệnh từ `Block` xuống `BlockDebit` (`unblockCredit`) và từ `BlockDebit` lên `Block` (`block`).
  Lưu ý: FIN-ACC-009-f chỉ chứng minh *một lệnh* làm được việc đó. Nó **không** chứng minh rằng bên trong core
  không có khoảnh khắc nào tài khoản ở trạng thái không block (**chưa kiểm chứng**).
- Mã lỗi của `BlockDebit` (`error.msg.savings.account.debit...`) khác mã lỗi của block toàn phần
  (`error.msg.saving.account.blocked...`, mục 2). Đừng so khớp chuỗi lỗi một cách cẩu thả.

## 2 · Block toàn phần từ chối cả tiền vào

**Lệnh gọi:** đặt `block` lên tài khoản B, rồi thử `POST /savingsaccounts/{B}/transactions?command=deposit`
và một `POST /accounttransfers` từ tài khoản khác **vào** B.

**Kết quả:**

```text
deposit=403/error.msg.saving.account.blocked.transaction.not.allowed xfer_in=403/error.msg.saving.account.blocked.transaction.not.allowed moved=0/0 cleared=None
```

(kiểm chứng: FIN-ACC-011-a trên 1.15.0)

**Vì sao quan trọng:** "phong toả" trong Fineract là **hai chiều**. Lương, tiền hoàn hay tiền người khác chuyển
đến một tài khoản bị `block` đều bị trả về **403**, và không có gì di chuyển. Nếu nghiệp vụ chỉ muốn chặn tiền
ra, hãy dùng `blockDebit` (mục 1), nơi tiền vào vẫn được ghi.

## 3 · Lệnh chi của chính ngân hàng bị từ chối, nhưng phí vẫn thu được

**Lệnh gọi:** gắn một charge vào tài khoản, đặt `block` (hoặc `blockDebit`), rồi thử:

```bash
POST /savingsaccounts/{id}/transactions?command=withdrawal
POST /accounttransfers                                  # chuyển ra từ tài khoản bị block
POST /savingsaccounts/{id}/charges/{chargeId}?command=paycharge
```

**Kết quả:**

```text
full: withdrawal=403/error.msg.saving.account.blocked.transaction.not.allowed xfer_out=403/error.msg.saving.account.blocked.transaction.not.allowed moved=0/0 paycharge=200/-10 paid=10 cleared=None debit: paycharge=200/-10 paid=10 cleared=None
```

(kiểm chứng: FIN-ACC-012-b trên 1.15.0)

**Vì sao quan trọng:**

- Core **không phân biệt** được một lệnh rút do ngân hàng thực hiện (ví dụ chi trả theo quyết định thu hồi,
  hay tất toán trả lại tiền cho khách) với một lệnh rút của khách. Dưới block toàn phần, cả hai đều bị từ chối.
  [Bài 7](/docs/fineract/onward-dung-fineract-the-nao) kể cách thiết kế của Onward xử lý chuyện này.
- Ngược lại, `paycharge` **vẫn trừ tiền** dưới cả `block` lẫn `blockDebit` (`paycharge=200/-10`). Một khoản phí
  tự động có thể làm giảm số dư một tài khoản mà bạn nghĩ là "đã đóng băng".

## 4 · Tài khoản đang bị block thì không đóng được

**Lệnh gọi:** `POST /savingsaccounts/{id}?command=close` với body
`{"closedOnDate":"...","withdrawBalance":false,<locale>}`, trên tài khoản có **số dư 0** nhưng đang bị block.

**Kết quả:**

```text
block: close=400/validation.msg.savingsaccount.account.is.in.blocked.state status=Active cleared=None then=Closed blockDebit: close=400/validation.msg.savingsaccount.account.is.in.blocked.state status=Active cleared=None then=Closed
```

(kiểm chứng: FIN-ACC-012-a trên 1.15.0)

Hai điều kiện đóng khác, cũng đã kiểm chứng trên 1.15.0:

| Tình huống | Chuỗi mong đợi | Claim |
|------------|----------------|-------|
| Số dư khác 0 thì không đóng được; về 0 thì đóng được | `refused then=Closed` | FIN-ACC-008-a |
| Tài khoản mới submitted thì không `close` được; phải dùng `reject` hoặc `withdrawnByApplicant` | `close=400/validation.msg.savingsaccount.close.not.in.active.state status=Submitted and pending approval reject=200/Rejected/closed=true withdrawn=200/Withdrawn by applicant/closed=true` | FIN-ACC-008-b |

**Vì sao quan trọng:** đóng tài khoản cần **gỡ block trước**, kể cả khi số dư đã về 0. Và "kết thúc một tài khoản"
không phải lúc nào cũng là `close`: ở trạng thái submitted, lệnh đúng là `reject` hoặc `withdrawnByApplicant`.

## 5 · Hold là một dòng giao dịch, và hold vẫn đặt được dưới blockDebit

**Hold** (tạm giữ) giữ một khoản tiền lại, ví dụ cho một giao dịch thẻ đang chờ, mà không trừ khỏi sổ.

**Lệnh gọi:**

```bash
POST /savingsaccounts/{id}/transactions?command=holdAmount
     # body: {"transactionDate":"...","transactionAmount":30,"reasonForBlock":1,<locale>}
POST /savingsaccounts/{id}/transactions/{holdTxnId}?command=releaseAmount
     # body: {<locale>}
GET  /savingsaccounts/{id}?associations=transactions
```

**Kết quả:**

| Thí nghiệm | Chuỗi mong đợi | Claim |
|------------|----------------|-------|
| Hold và lệnh nhả hold đều là **dòng giao dịch**; dòng hold trỏ tới dòng nhả; số dư sổ (ledger) không đổi | `hold=200 row=Amount on hold/running=70 release=200 row=Release Amount/original=0 hold_names_release=yes ledger=0/0 available=-30/0` | FIN-ACC-002-b |
| Hold cộng dồn và được nhả từng cái; hold lớn hơn số dư khả dụng bị từ chối; hold **vẫn đặt được dưới `blockDebit`** | `stack=-30/-50 over=400/validation.msg.savingsaccount.insufficient.balance moved=0 under_blockDebit=200/-10 cleared=None release_one=200/+30 available=70 ledger=0` | FIN-ACC-011-b |
| Hold chỉ giảm số dư **khả dụng**, không giảm số dư sổ, và nhả sạch | `held_balance=0 held_available=-50 released_available=0` | FIN-TRF-002-c |

(kiểm chứng: FIN-ACC-002-b, FIN-ACC-011-b, FIN-TRF-002-c trên 1.15.0)

**Vì sao quan trọng:**

- Có **hai** số dư: `accountBalance` (sổ) và `availableBalance` (khả dụng). Hold chỉ chạm vào số thứ hai. App
  hiển thị nhầm số sẽ làm khách tưởng tiền đã mất.
- Hold xuất hiện **trong lịch sử giao dịch** (`Amount on hold`, `Release Amount`). Nếu màn hình lịch sử liệt kê
  mọi dòng, khách sẽ thấy những dòng này. Liên kết chỉ có một chiều: dòng hold có `releaseTransactionId`, còn dòng
  nhả có `originalTransactionId` = `0`. Chú ý `runningBalance` của dòng hold là số **khả dụng** (70), không phải số sổ.
- `blockDebit` **không** chặn hold. Hold dưới block **toàn phần** thì chưa có claim: **chưa kiểm chứng**.

## 6 · Idempotency key: phát lại, bỏ qua trạng thái hiện tại, giữ cả kết quả lỗi

Fineract nhận header `Idempotency-Key` trên các lệnh ghi. Khi một key bị gửi lại, core trả lại **phản hồi đã lưu**
của lần đầu (kèm header `x-served-from-cache: true`) và **không chạy lại** lệnh.

**Lệnh gọi:**

```bash
curl -sk -u mifos:password \
  -H "Fineract-Platform-TenantId: default" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: demo-key-001" \
  -X POST "https://localhost:8443/fineract-provider/api/v1/accounttransfers" \
  -d '{ ...thân lệnh chuyển như ở Bài 4... }'
```

**Kết quả:**

| Thí nghiệm | Chuỗi mong đợi | Claim |
|------------|----------------|-------|
| Cùng key, cùng body: chỉ một lệnh chuyển | `id=$R1/$R1 moved=0` (`$R1` là id của lệnh chuyển đầu tiên: lần hai trả lại đúng id đó, không thêm tiền nào di chuyển) | FIN-IDEM-01 |
| Cùng key, **số tiền khác**: 200, không gì di chuyển, không cảnh báo | `200 moved=0` | FIN-IDEM-02 |
| **Key mới**, cùng body: lệnh chuyển xảy ra **lần nữa** | `new=yes moved=5` | FIN-IDEM-03 |
| approve / activate: key lặp lại thì phát lại mà không chạy, **bất kể body hay tài khoản**; key đã lỗi thì phát lại lỗi đó | `approve=200/fresh,200/replay changed=200/replay/01 August 2026 runs=1 other_account=200/replay/first_account_id other_status=Submitted and pending approval activate=200/fresh,200/replay changed=200/replay/01 August 2026 runs=1 status=Active failed_key=400/fresh,400/replay then=Approved` | FIN-ACC-005-b |
| Họ lệnh block: key lặp lại thì phát lại, **bất kể trạng thái hiện tại** của tài khoản | `... replay_block=200/replay/None replay_unblock=200/replay/Block ...` (trích; chuỗi đầy đủ lặp lại mẫu này cho `blockDebit` / `unblockDebit`) | FIN-ACC-009-g |
| Tạo client: cùng key, body khác trả lại **client cũ**; kho key không có cột hết hạn | `same=yes reused=yes 200 name=Alpha expiry_columns=0` | FIN-ONB-004-c |

(kiểm chứng: FIN-IDEM-01, -02, -03, FIN-ACC-005-b, FIN-ACC-009-g, FIN-ONB-004-c trên 1.15.0)

Đọc kỹ ba điều bất ngờ:

1. **Key khớp theo key, không theo nội dung.** Gửi lại key cũ với số tiền khác, hay thậm chí với **id tài khoản
   khác** trong URL, bạn nhận 200 và phản hồi của lần đầu. Tài khoản thứ hai **không** được duyệt
   (`other_status=Submitted and pending approval`), và không có cảnh báo nào.
2. **Phát lại không nhìn trạng thái hiện tại.** Key của lệnh `block` gửi lại sau khi tài khoản đã được gỡ block vẫn
   trả 200, nhưng tài khoản **vẫn không bị block** (`replay_block=200/replay/None`). Thấy 200 không có nghĩa là
   tài khoản đang ở trạng thái bạn muốn.
3. **Kết quả lỗi cũng được lưu.** Lệnh `activate` bị từ chối vì tài khoản chưa được duyệt. Sau khi đã duyệt, gửi
   lại cùng key vẫn nhận lại **400 cũ** (`failed_key=400/fresh,400/replay then=Approved`). Thử lại với key cũ sẽ
   không bao giờ thành công.

**Vì sao quan trọng:** idempotency key chỉ bảo vệ **một lần thử lại giống hệt nhau**, không hơn. Key mới thì trả tiền
hai lần (FIN-IDEM-03); key cũ cho việc khác thì âm thầm không làm gì (FIN-IDEM-02). Bên gọi phải tự quản lý vòng đời
của key: sinh key cho mỗi bước, chỉ dùng lại cho đúng lần thử lại đó, và sinh key mới sau khi một lần thử đã thất bại.
Kho key cũng không có cột hết hạn (FIN-ONB-004-c), nên một key đã dùng là đã dùng. Bài 7 kể quy ước key theo từng bước
của Onward.

## 7 · Interest posting: lãi là những dòng giao dịch có ngày

**Lệnh gọi:**

```bash
POST /savingsaccounts/{id}?command=calculateInterest   # body: {}
POST /savingsaccounts/{id}?command=postInterest        # body: {}
GET  /savingsaccounts/{id}?associations=transactions
```

**Kết quả** trên một tài khoản nạp 1000 vào ngày 01/08/2026, lãi suất danh nghĩa 2,5%/năm:

```text
calculate=200/rows=0 earned_positive=true post=200 first={"code":"savingsAccountTransactionType.interestPosting","typeId":3,"entry":"CREDIT","amount":2.13,"date":[2026,9,1]} posted_total_is_row_sum=true rate=2.5 ledger=20100/CREDIT/2.13,50100/DEBIT/2.13
```

(kiểm chứng: FIN-ACC-022-c trên 1.15.0)

Và lãi thấu chi, trên một tài khoản rút âm 1000, lãi thấu chi 12%/năm, sản phẩm không bật kế toán:

```text
post=200 first={"code":"savingsAccountTransactionType.overdraftInterest","typeId":17,"entry":"DEBIT","amount":10.24,"date":[2026,9,1]} overdraft_total_is_row_sum=true interest_posted=0 interest_earned_negative=true od_rate=12
```

(kiểm chứng: FIN-ACC-022-d trên 1.15.0)

**Vì sao quan trọng:**

- `calculateInterest` **chỉ tính**: `summary.totalInterestEarned` dương nhưng **chưa có dòng nào** (`rows=0`).
  Tiền lãi chỉ vào tài khoản khi `postInterest` ghi dòng `Interest posting`.
- Mỗi kỳ là **một dòng có ngày** (lãi tháng 8 ghi ngày 01/09), và tổng trong summary đúng bằng tổng các dòng.
  Muốn hiện "lãi đã nhận" cho khách, đọc các dòng này.
- Lãi thấu chi là dòng **DEBIT** riêng (`Overdraft Interest`), có tổng riêng, **tách khỏi** lãi đã trả
  (`interest_posted=0`).
- Cặp bút toán `20100/CREDIT` + `50100/DEBIT` chính là dòng "trả lãi" trong
  [bảng sáu sự kiện của Bài 5](/docs/fineract/ghi-so-kep-va-so-cai).
- Lưu ý khi tự chạy: trên tenant trống, business date tắt, nên core tính lãi đến **hôm nay**. Chỉ dòng đầu tiên là
  cố định; các dòng sau phụ thuộc ngày bạn chạy.

## 8 · Dormancy job: chuyển sang escheat và đóng tài khoản khi tracking bật

Fineract có cơ chế **ngủ đông** (dormancy) riêng: ngưỡng ngày nằm trên **sản phẩm**, một **job định kỳ** áp dụng chúng.

**Lệnh gọi:**

```bash
POST /savingsproducts          # ... "isDormancyTrackingActive":true,"daysToInactive":30,"daysToDormancy":60,"daysToEscheat":365 ...
GET  /jobs                     # tìm job "Update Savings Dormant Accounts"
POST /jobs/{jobId}?command=executeJob   # body: {}
```

**Kết quả:**

| Thí nghiệm | Chuỗi mong đợi | Claim |
|------------|----------------|-------|
| Ngưỡng là cấu hình của sản phẩm, có một job định kỳ | `{"t":true,"i":30,"d":60,"e":365} job=1` | FIN-ACC-006-a |
| Chạy job với bốn tài khoản (ngưỡng 1/2/3 ngày cho sản phẩm bật tracking) | `job=202 ran=success off=BlockDebit/Active control=BlockDebit/Active witness=Escheat/Closed off_plain=None/Active cleared=None/None` | FIN-ACC-006-b |
| Escheat chỉ là một cờ sub-status; không có lệnh hay endpoint escheat | `paths=0 cmd=unsupported` | FIN-ACC-013-a |

(kiểm chứng: FIN-ACC-006-a, FIN-ACC-006-b, FIN-ACC-013-a trên 1.15.0)

Đọc chuỗi FIN-ACC-006-b:

- `witness=Escheat/Closed`: tài khoản bật tracking, không bị block, quá ngưỡng. Trong **một lần chạy**, job đưa nó từ
  `None` sang `Escheat` và core **đóng luôn** tài khoản.
- `control=BlockDebit/Active`: tài khoản bật tracking nhưng đang `blockDebit`. Job **bỏ qua**, vì job chỉ chọn tài khoản
  có sub-status `None`.
- `off=...` và `off_plain=None/Active`: sản phẩm tắt tracking thì job không đụng vào, dù có block hay không.

**Vì sao quan trọng:** một job nền có thể **tự đóng tài khoản** của khách mà không ai trong hệ thống của bạn ra lệnh.
Escheat là một bước nghiệp vụ lớn; để core tự làm chỉ dựa trên một ngưỡng ngày, ngoài tầm nhìn của các service phía trên, là rủi ro lớn.
Theo tài liệu thiết kế nội bộ của Onward, tracking **tắt** trên mọi sản phẩm tiết kiệm (Bài 7).

## 9 · Standing instruction: tạo được, việc thực thi chưa kiểm chứng

**Lệnh gọi:**

```bash
POST /accounttransfers          # transferDate trong tương lai
POST /standinginstructions      # recurrenceType 1 (định kỳ), rồi thử 3; instructionType 1, rồi thử 2
GET  /jobs                      # job "Execute Standing Instruction"
```

**Kết quả:**

```text
future=Transaction date cannot be in the future. si=created recurrence=The parameter `recurrenceType` must be between 1 and 2. instruction=The parameter `instructionType` must be between 1 and 1. job_active=true
```

(kiểm chứng: FIN-TRF-004-a trên 1.15.0)

Nghĩa là:

- Một lệnh chuyển **hẹn ngày một lần** bị từ chối: `/accounttransfers` không nhận ngày tương lai.
- Đối tượng hẹn lịch duy nhất là **standing instruction định kỳ**. Tạo được (`si=created`), nhưng
  `recurrenceType` chỉ nhận 1–2 và `instructionType` chỉ nhận 1.
- Job `Execute Standing Instruction` đang **bật** trên tenant mới.

**Chưa kiểm chứng:** standing instruction có thực sự **chạy và chuyển tiền** hay không. Claim chỉ chứng minh việc
**tạo**. Một lần thử nội bộ (chạy job thủ công trên tenant mới với một instruction còn hiệu lực) thấy job báo thành
công nhưng không có lịch sử chạy và không có lệnh chuyển nào; chưa xác định được là do instruction chưa đến hạn
hay do job không hoạt động. Việc đọc, sửa hay dừng một standing instruction cũng chưa có claim.

**Vì sao quan trọng:** đừng dựa vào standing instruction của core cho lệnh chuyển định kỳ khi chưa chứng minh được nó
chạy. Theo tài liệu thiết kế nội bộ của Onward, lịch chuyển tiền nằm trên scheduler riêng, không dùng standing
instruction của core (Bài 7).

## 10 · Không đổi sản phẩm tại chỗ

**Lệnh gọi:** `PUT /savingsaccounts/{id}` trên một tài khoản **đang active**, lần lượt với
`{"productId":<sản phẩm khác>,"locale":"en"}` và `{"nominalAnnualInterestRate":9,"locale":"en"}`.

**Kết quả:** cả hai bị từ chối với `developerMessage` chứa `not.in.submittedandpendingapproval.state`. Chuỗi mong
đợi: `both-refused` (kiểm chứng: FIN-LIFE-02 trên 1.15.0).

Thứ **vẫn** thay đổi được sau khi active là phí: gắn một charge vào tài khoản đang active cho kết quả `200 attached=1`
(kiểm chứng: FIN-ACC-019-a trên 1.15.0).

**Vì sao quan trọng:** sau khi kích hoạt, endpoint cập nhật **đóng lại hoàn toàn**: không đổi được sản phẩm, cũng không
đổi được lãi suất. "Chuyển khách sang gói khác" trên core này không làm tại chỗ được; muốn làm thì phải là một quy trình
khác (mở tài khoản mới, chuyển tiền, đóng tài khoản cũ), với tất cả hệ quả của nó: số tài khoản mới, lịch sử tách đôi.

## 11 · Không có khái niệm giao dịch pending

**Lệnh gọi:** tìm trong tài liệu OpenAPI của chính bản build đang chạy (`/fineract-provider/fineract.json`) theo các mẫu
`unposted|uncleared|pendingTransaction|memoPost`.

**Kết quả:** `hits=0` (kiểm chứng: FIN-ACC-002-d trên 1.15.0).

**Vì sao quan trọng:** core không có bề mặt API cho giao dịch "đang chờ ghi sổ". Thứ gần nhất là **hold** (mục 5). Nếu
app cần hiện "giao dịch đang xử lý", dữ liệu đó phải đến từ service của bạn hoặc được dựng từ hold. Lưu ý giới hạn của
claim: nó là một **claim vắng mặt** (absence claim), chỉ chứng minh API không có bề mặt như vậy; nó **không** chứng minh
core không bao giờ tự đặt hold.

## Vài cái bẫy nhỏ khác, cũng đã kiểm chứng

| Bẫy | Chuỗi mong đợi | Claim |
|-----|----------------|-------|
| Một lệnh chuyển đã hoàn tất không undo hay reverse được, và lời từ chối vĩnh viễn lại mang mã **503**, mã mà thư viện HTTP thường tự thử lại | `undo=503/Savings account transaction:<id> update not allowed as it involves in account transfer reverse=501/Unsupported command: reverse reversed=false` | FIN-TRF-001-c |
| Request có ngày mà thiếu `locale` / `dateFormat` bị từ chối | `400` | FIN-DATE-01 |
| `defaultUserMessage` vô dụng; lý do thật nằm trong `developerMessage` | `user=transactionDate` | FIN-ERR-01 |
| Không có lệnh `reactivate` cho tài khoản tiết kiệm | `unsupported value of: reactivate` | FIN-ACC-007-a |

(kiểm chứng: FIN-TRF-001-c, FIN-DATE-01, FIN-ERR-01, FIN-ACC-007-a trên 1.15.0)

## Checklist cuối bài

- [ ] Phân biệt được `Block`, `BlockDebit`, `BlockCredit`, và biết lệnh nào gỡ được sub-status nào.
- [ ] Biết block toàn phần chặn **cả tiền vào**, còn `blockDebit` thì không.
- [ ] Biết `paycharge` vẫn trừ tiền dưới block, còn lệnh rút của chính ngân hàng thì bị từ chối.
- [ ] Gỡ block trước khi đóng tài khoản, kể cả khi số dư bằng 0.
- [ ] Phân biệt `accountBalance` và `availableBalance`, và biết hold hiện ra trong lịch sử giao dịch.
- [ ] Nói được ba điều bất ngờ của idempotency key: khớp theo key, bỏ qua trạng thái hiện tại, lưu cả lỗi.
- [ ] Biết `calculateInterest` không ghi dòng nào, chỉ `postInterest` mới ghi.
- [ ] Biết dormancy job có thể tự đóng tài khoản khi tracking bật.
- [ ] Phân biệt được điều đã kiểm chứng (tạo standing instruction) với điều **chưa kiểm chứng** (nó có chạy không).
- [ ] Muốn tự chạy lại các claim này? Xem [Bài 8 · Checkpoint](/docs/fineract/checkpoint).

## Nguồn tham khảo

1. Apache Fineract, tài liệu chính thức (mục Savings Account Management). <https://fineract.apache.org/docs/current/#_savings_account_management>
2. Apache Fineract, tài liệu chính thức (mục Savings Interest Posting). <https://fineract.apache.org/docs/current/#_savings_interest_posting>
3. Apache Fineract, tài liệu chính thức (mục Idempotency). <https://fineract.apache.org/docs/current/#_idempotency>
4. Apache Fineract 1.15.0, bản phát hành được dùng để kiểm chứng. <https://github.com/apache/fineract/releases/tag/1.15.0>
5. Bộ kiểm chứng nội bộ của Onward (không công khai).

**Bài tiếp theo:** [Bài 7 · Onward dùng Fineract thế nào](/docs/fineract/onward-dung-fineract-the-nao)
