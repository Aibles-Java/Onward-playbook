---
title: "Bài 8 · Checkpoint: tự kiểm chứng trên Fineract của bạn"
description: "Bài thực hành tổng hợp: dựng fixture trên một Fineract 1.15.0 trắng, chạy lại 12 nhóm hành vi bằng curl (vòng đời, sổ cái, chuyển tiền, idempotency, block, hold, dormancy) và so kết quả với chuỗi mong đợi."
order: 8
tags: [fineract, core-banking, checkpoint, curl, thực-hành, idempotency, block, hold]
language: vi
profile: onward-fineract-course
classification: public-safe
source_repo: none
source_refs:
  - https://fineract.apache.org/
  - https://github.com/apache/fineract/releases/tag/1.15.0
  - https://github.com/apache/fineract/blob/1.15.0/docker-compose-development.yml
  - https://fineract.apache.org/docs/current/
---

# Bài 8 · Checkpoint: tự kiểm chứng trên Fineract của bạn

> Đọc rằng "core từ chối rút tiền dưới block" là một chuyện. Tự gõ lệnh và thấy `403` hiện ra là chuyện
> khác. Ở bài cuối này, bạn sẽ dựng một bộ dữ liệu mẫu trên Fineract chạy ở máy mình, rồi tự tái hiện
> những hành vi mà cả khoá học dựa vào. Mỗi bài tập có lệnh `curl` và một dòng kết quả mong đợi để bạn so.

> 🎯 **Sau bài này bạn sẽ:**
> 1. Dựng được fixture đầy đủ: tài khoản GL, sản phẩm có kế toán, payment type, financial activity mapping, hai client, các tài khoản đã kích hoạt.
> 2. Tự tái hiện được 12 nhóm hành vi đã kiểm chứng trên Fineract 1.15.0, và đọc được kết quả từ status code, `subStatus`, số dư và bút toán.
> 3. Phân biệt được một lần "phát lại" (*replay*) idempotency với một lần chạy thật bằng header `x-served-from-cache`.
> 4. Biết phải làm gì khi kết quả của bạn **khác** kết quả mong đợi.

**Cần biết trước:** cả khoá, nhất là [Bài 3 · Chạy Fineract local](/docs/fineract/chay-fineract-local) (để có
một Fineract chạy được), [Bài 4 · API từng bước](/docs/fineract/api-tung-buoc) và
[Bài 6 · Hành vi đã kiểm chứng](/docs/fineract/hanh-vi-da-kiem-chung).

**Từ khoá của bài:**

| Thuật ngữ | Hiểu nôm na | Ví dụ |
|-----------|-------------|-------|
| Fixture | Bộ dữ liệu mẫu dựng sẵn trước khi thử | 2 client, 2 tài khoản, 1 sản phẩm |
| Claim | Một câu khẳng định về hành vi của core, kèm cách chứng minh chạy lại được | FIN-ACC-009-c: "`blockDebit` chặn rút, vẫn cho nạp" |
| Chuỗi mong đợi | Đoạn chữ mà dòng in ra của bạn phải **chứa** | `sub=BlockDebit deposit=200/+10 ...` |
| Tenant trắng | Tenant chưa có client nào. Fixture cần bắt đầu từ đây | `totalFilteredRecords` = 0 |
| Replay | Core trả lại phản hồi cũ cho cùng `Idempotency-Key`, không chạy lại lệnh | header `x-served-from-cache: true` |

## Nguồn gốc của bài này

Mọi lệnh và mọi kết quả mong đợi trong bài được chép từ **bộ script kiểm chứng nội bộ của Onward**. Script
này chạy lại từng claim `FIN-…` trên Fineract **1.15.0** và in `PASS` hoặc `FAIL`. Lệnh trong bài có thể
gọn hơn script (ví dụ đổi tên biến), nhưng thứ tự gọi và chuỗi mong đợi giữ nguyên. Một vài chỗ in ra số
(như id tài khoản) sẽ khác trên máy bạn. Những chỗ đó được ghi chú ngay bên dưới kết quả.

⚠️ **Hai điều kiện để kết quả khớp:**

1. **Đúng phiên bản 1.15.0.** Phiên bản khác có thể cho kết quả khác. Khi đó dòng in ra mô tả phiên bản
   *của bạn*, không phải 1.15.0.
2. **Tenant trắng, và chạy theo đúng thứ tự.** Fixture tạo GL code cố định (`10100`, `20100`, …) và nhiều bài
   tập đếm bút toán trên toàn tenant. Chạy trên tenant đã có dữ liệu thì lệnh tạo sẽ lỗi hoặc các con số
   lệch. Cách reset tenant về trắng có trong [Bài 3](/docs/fineract/chay-fineract-local). **Chỉ làm trên
   Fineract dùng để học, không bao giờ trên máy chủ thật.**

## 0. Chuẩn bị terminal

Bạn cần `bash`, `curl`, `jq` và `awk`. Mở **một** terminal và chạy hết bài trong terminal đó, vì các bài tập
dùng lại biến của nhau.

```bash
export BASE="https://localhost:8443/fineract-provider/api/v1"   # chỉ đổi 8443 nếu bạn đã đổi cổng API ở Bài 3, bước 3
export AUTH="mifos:password"   # mặc định dev công khai của Fineract, CHỈ dùng trên máy local
export TENANT="default"

# api METHOD PATH [tham số curl...] -> in body; status code lưu vào file, đọc bằng st
api() {
  local m=$1 p=$2; shift 2
  curl -sk -u "$AUTH" -H "Fineract-Platform-TenantId: $TENANT" \
    -H 'Content-Type: application/json' -X "$m" "${BASE}${p}" "$@" \
    -o /tmp/fc-body.json -w '%{http_code}' > /tmp/fc-status
  cat /tmp/fc-body.json
}
st() { cat /tmp/fc-status; }

D='"locale":"en","dateFormat":"dd MMMM yyyy"'
DATE='01 August 2026'
```

💡 **Vì sao status code lại ghi ra file?** Các bài tập hay viết `R=$(api ...)`. Lệnh trong `$( )` chạy ở một
shell con, nên một biến gán bên trong sẽ không về được shell của bạn. Ghi ra file thì shell nào cũng đọc được.

Kiểm tra phiên bản và tenant:

```bash
curl -sk "${BASE%/api/v1}/actuator/info" | jq -r '.git.build.version'
api GET /clients | jq -r '.totalFilteredRecords'
```

**Kết quả mong đợi:** dòng 1 là `1.15.0`, dòng 2 là `0`. Nếu dòng 2 khác `0`, hãy reset tenant trước khi đi
tiếp.

## 1. Dựng fixture

Fixture gồm 9 tài khoản GL, hai sản phẩm (một có kế toán tiền mặt, một không), một payment type, mapping
cho tài khoản suspense của chuyển tiền, hai client và bốn tài khoản tiết kiệm.

```bash
mkgl() { api POST /glaccounts -d "{\"name\":\"$1\",\"glCode\":\"$2\",\"type\":$3,\"usage\":1,\"manualEntriesAllowed\":true}" >/dev/null; }
mkgl "Cash" "10100" 1;                 mkgl "Savings Control" "20100" 2
mkgl "Interest Expense" "50100" 5;     mkgl "Fee Income" "40100" 4
mkgl "Transfers In Suspense" "20200" 2; mkgl "Penalty Income" "40200" 4
mkgl "Overdraft Portfolio" "10200" 1;  mkgl "Interest Income" "40300" 4
mkgl "Write Off" "50200" 5
glid() { api GET /glaccounts | jq -r --arg c "$1" '.[]|select(.glCode==$c).id'; }
CASH=$(glid 10100) SAVCTL=$(glid 20100) INTEXP=$(glid 50100) FEEINC=$(glid 40100)
SUSP=$(glid 20200) PENINC=$(glid 40200) OVD=$(glid 10200) INTINC=$(glid 40300) WOFF=$(glid 50200)

# sản phẩm có kế toán tiền mặt (accountingRule 2)
PROD=$(api POST /savingsproducts -d "{\"name\":\"Verify Current\",\"shortName\":\"VRFY\",
 \"currencyCode\":\"USD\",\"digitsAfterDecimal\":2,\"inMultiplesOf\":1,\"nominalAnnualInterestRate\":2.5,
 \"interestCompoundingPeriodType\":1,\"interestPostingPeriodType\":4,\"interestCalculationType\":1,
 \"interestCalculationDaysInYearType\":365,\"accountingRule\":2,
 \"savingsReferenceAccountId\":$CASH,\"savingsControlAccountId\":$SAVCTL,
 \"interestOnSavingsAccountId\":$INTEXP,\"incomeFromFeeAccountId\":$FEEINC,
 \"transfersInSuspenseAccountId\":$SUSP,\"incomeFromPenaltyAccountId\":$PENINC,
 \"overdraftPortfolioControlId\":$OVD,\"incomeFromInterestId\":$INTINC,
 \"writeOffAccountId\":$WOFF,\"locale\":\"en\"}" | jq -r .resourceId)

# sản phẩm KHÔNG có kế toán (accountingRule 1), dùng ở bài tập 3
PROD_NOACC=$(api POST /savingsproducts -d "{\"name\":\"Verify NoAccounting\",\"shortName\":\"VRNA\",
 \"currencyCode\":\"USD\",\"digitsAfterDecimal\":2,\"inMultiplesOf\":1,\"nominalAnnualInterestRate\":2.5,
 \"interestCompoundingPeriodType\":1,\"interestPostingPeriodType\":4,\"interestCalculationType\":1,
 \"interestCalculationDaysInYearType\":365,\"accountingRule\":1,\"locale\":\"en\"}" | jq -r .resourceId)

PAY=$(api POST /paymenttypes -d '{"name":"Cash","description":"Cash at branch","isCashPayment":true,"position":1}' | jq -r .resourceId)
# mapping hoạt động tài chính 200 -> GL suspense; thiếu nó thì mọi lệnh chuyển đều lỗi (bài tập 4)
api POST /financialactivityaccounts -d "{\"financialActivityId\":200,\"glAccountId\":$SUSP}" >/dev/null

mkclient() { api POST /clients -d "{\"officeId\":1,\"legalFormId\":1,\"firstname\":\"$1\",\"lastname\":\"$2\",\"activationDate\":\"$DATE\",\"active\":true,$D}" | jq -r .clientId; }
C1=$(mkclient Ada Lovelace); C2=$(mkclient Grace Hopper)

mkacct() { api POST /savingsaccounts -d "{\"clientId\":$1,\"productId\":$2,\"submittedOnDate\":\"$DATE\",$D}" | jq -r .savingsId; }
activate() { api POST "/savingsaccounts/$1?command=approve" -d "{\"approvedOnDate\":\"$DATE\",$D}" >/dev/null
             api POST "/savingsaccounts/$1?command=activate" -d "{\"activatedOnDate\":\"$DATE\",$D}" >/dev/null; }
A1=$(mkacct $C1 $PROD); activate $A1
A2=$(mkacct $C2 $PROD); activate $A2
A3=$(mkacct $C2 $PROD)                      # để ở trạng thái submitted
A4=$(mkacct $C1 $PROD_NOACC); activate $A4  # sản phẩm không kế toán

api POST "/savingsaccounts/$A1/transactions?command=deposit" \
  -d "{\"transactionDate\":\"$DATE\",\"transactionAmount\":500,\"paymentTypeId\":$PAY,$D}" >/dev/null
```

Thêm vài hàm nhỏ dùng suốt bài:

```bash
bal()   { api GET "/savingsaccounts/$1" | jq -r '.summary.accountBalance // 0'; }     # số dư sổ cái
avail() { api GET "/savingsaccounts/$1" | jq -r '.summary.availableBalance // 0'; }   # số dư khả dụng
sub()   { api GET "/savingsaccounts/$1" | jq -r '.subStatus.value'; }                 # block hiện tại
acst()  { api GET "/savingsaccounts/$1" | jq -r '.status.value'; }                    # trạng thái
dlt()   { awk -v a="$1" -v b="$2" 'BEGIN{printf "%g", a-b}'; }                       # a - b, gọn số 0
dep()   { api POST "/savingsaccounts/$1/transactions?command=deposit" \
            -d "{\"transactionDate\":\"$DATE\",\"transactionAmount\":$2,\"paymentTypeId\":$PAY,$D}"; }
wd()    { api POST "/savingsaccounts/$1/transactions?command=withdrawal" \
            -d "{\"transactionDate\":\"$DATE\",\"transactionAmount\":$2,\"paymentTypeId\":$PAY,$D}"; }
xfer()  { # xfer CLIENT_GUI TK_GUI CLIENT_NHAN TK_NHAN SO_TIEN MO_TA
  api POST /accounttransfers -d "{\"fromOfficeId\":1,\"fromClientId\":$1,\"fromAccountType\":2,\"fromAccountId\":$2,
    \"toOfficeId\":1,\"toClientId\":$3,\"toAccountType\":2,\"toAccountId\":$4,\"transferAmount\":$5,
    \"transferDate\":\"$DATE\",\"transferDescription\":\"$6\",$D}"; }
hold()  { api POST "/savingsaccounts/$1/transactions?command=holdAmount" \
            -d "{\"transactionDate\":\"$DATE\",\"transactionAmount\":$2,\"reasonForBlock\":1,$D}"; }
code()  { jq -r '.errors[0].userMessageGlobalisationCode // ""' /tmp/fc-body.json; }   # mã lỗi của lần gọi vừa rồi

echo "product=$PROD clients=$C1,$C2 accounts=$A1,$A2,$A3,$A4 balance(A1)=$(bal $A1)"
```

**Kết quả mong đợi:** mọi biến đều có số (không có `null`), và `balance(A1)=500.000000`.

💡 **Vì sao `dlt` dùng `awk`?** Số dư trả về dạng `100.000000`. `printf "%g"` in hiệu số gọn như `10`, `-30`
hay `0`, khớp với chuỗi mong đợi.

## 2. Mười hai bài tập

Mỗi bài tập in ra **một dòng**. Dòng đó phải **chứa** chuỗi mong đợi (giống cách script kiểm chứng so:
"chứa", không cần bằng tuyệt đối).

### Bài tập 1 · Tiền không vào được tài khoản chưa kích hoạt

`A3` mới được submit, chưa approve và activate.

```bash
R=$(dep $A3 10)
echo "$(st) $(printf '%s' "$R" | jq -r '.errors[0].developerMessage')"
echo "user=$(printf '%s' "$R" | jq -r '.errors[0].defaultUserMessage')"
```

**Kết quả mong đợi** (kiểm chứng: FIN-LIFE-01, FIN-ERR-01 trên 1.15.0):

```text
400 Transaction is not allowed. Account is not active.
user=transactionDate
```

Dòng 2 là lý do Onward đọc `developerMessage`: thông báo "cho người dùng" ở đây chỉ là tên một tham số.

### Bài tập 2 · Ngày tháng phải kèm `locale` và `dateFormat`

```bash
api POST "/savingsaccounts/$A1/transactions?command=deposit" \
  -d "{\"transactionDate\":\"$DATE\",\"transactionAmount\":1,\"paymentTypeId\":$PAY}" >/dev/null; st; echo
```

**Kết quả mong đợi** (kiểm chứng: FIN-DATE-01 trên 1.15.0): `400`.

### Bài tập 3 · Sổ cái chỉ có khi sản phẩm bật kế toán, và sản phẩm không đổi được sau kích hoạt

```bash
BEFORE=$(api GET "/journalentries?limit=1" | jq -r .totalFilteredRecords)
dep $A4 77 >/dev/null
AFTER=$(api GET "/journalentries?limit=1" | jq -r .totalFilteredRecords)
echo "balance=$(bal $A4) journal_delta=$((AFTER-BEFORE))"

M1=$(api PUT "/savingsaccounts/$A1" -d "{\"productId\":$PROD_NOACC,\"locale\":\"en\"}" | jq -r '.errors[0].developerMessage // ""')
M2=$(api PUT "/savingsaccounts/$A1" -d '{"nominalAnnualInterestRate":9,"locale":"en"}' | jq -r '.errors[0].developerMessage // ""')
[[ "$M1" == *not.in.submittedandpendingapproval.state* && "$M2" == *not.in.submittedandpendingapproval.state* ]] && echo both-refused
```

**Kết quả mong đợi** (kiểm chứng: FIN-LEDGER-01, FIN-LIFE-02 trên 1.15.0):

```text
balance=77.000000 journal_delta=0
both-refused
```

Tiền vào tài khoản `A4` thật, nhưng **không** có bút toán nào. Còn tài khoản đã kích hoạt thì không đổi
được cả sản phẩm lẫn lãi suất.

### Bài tập 4 · Chuyển tiền đi qua suspense, và phụ thuộc một mapping

```bash
jecount() { api GET "/journalentries?glAccountId=$1&limit=500" | jq -r '.totalFilteredRecords'; }
jenet()   { api GET "/journalentries?glAccountId=$1&limit=500" \
            | jq -r '[.pageItems[]|(if .entryType.value=="DEBIT" then .amount else -.amount end)]|add // 0'; }
SE0=$(jecount $SUSP); SC0=$(jecount $SAVCTL)
xfer $C1 $A1 $C2 $A2 7 "trf-suspense" >/dev/null
echo "suspense=+$(( $(jecount $SUSP) - SE0 )) savingscontrol=+$(( $(jecount $SAVCTL) - SC0 )) suspense_net=$(jenet $SUSP)"

# gỡ mapping 200, thử chuyển, rồi đặt lại
FAID=$(api GET /financialactivityaccounts | jq -r '[.[]|select(.financialActivityData.id==200)]|.[0].id')
api DELETE "/financialactivityaccounts/$FAID" >/dev/null
R=$(xfer $C1 $A1 $C2 $A2 1 "trf-nomapping"); S=$(st)
api POST /financialactivityaccounts -d "{\"financialActivityId\":200,\"glAccountId\":$SUSP}" >/dev/null
echo "$S/$(printf '%s' "$R" | jq -r '.errors[0].developerMessage') restored=$(api GET /financialactivityaccounts | jq -r '[.[]|select(.financialActivityData.id==200)]|length')"
```

**Kết quả mong đợi** (kiểm chứng: FIN-TRF-001-a, FIN-TRF-001-f trên 1.15.0):

```text
suspense=+2 savingscontrol=+2 suspense_net=0
404/Financial Activity account with for the financial Activity with Id 200 does not exist restored=1
```

Đây đúng là câu chuyện "404 → map → 200" ở [Bài 4](/docs/fineract/api-tung-buoc). Lỗi 404 không nêu tên
tài khoản nào, nên nhìn vào rất dễ tưởng là sai id tài khoản.

### Bài tập 5 · Core không kiểm tra ai là chủ tài khoản

Lệnh chuyển ghi người nhận là client `C1` (Ada) nhưng tài khoản nhận là `A2` (của Grace).

```bash
R=$(api POST /accounttransfers -d "{\"fromOfficeId\":1,\"fromClientId\":$C1,\"fromAccountType\":2,\"fromAccountId\":$A1,
  \"toOfficeId\":1,\"toClientId\":$C1,\"toAccountType\":2,\"toAccountId\":$A2,
  \"transferAmount\":1,\"transferDate\":\"$DATE\",\"transferDescription\":\"contradictory\",$D}"); S=$(st)
TID=$(printf '%s' "$R" | jq -r '.resourceId // empty')
echo "$S $(api GET "/accounttransfers/${TID:-0}" | jq -c '{to:.toClient.displayName,toAccount:.toAccount.id}')"
```

**Kết quả mong đợi** (kiểm chứng: FIN-OWN-01 trên 1.15.0):

```text
200 {"to":"Ada Lovelace","toAccount":<id của A2>}
```

Lệnh tự mâu thuẫn mà vẫn được nhận. Tiền vào `A2`, còn bản ghi ghi người nhận là Ada. Đó là lý do mọi kiểm
tra quyền sở hữu phải nằm ở phía Onward ([Bài 7](/docs/fineract/onward-dung-fineract-the-nao)).

### Bài tập 6 · `Idempotency-Key` và ba tính khí của nó

```bash
K="checkpoint-$RANDOM"
IB="{\"fromOfficeId\":1,\"fromClientId\":$C1,\"fromAccountType\":2,\"fromAccountId\":$A1,
  \"toOfficeId\":1,\"toClientId\":$C2,\"toAccountType\":2,\"toAccountId\":$A2,
  \"transferDate\":\"$DATE\",\"transferDescription\":\"idem\",$D"
B1=$(bal $A2); R1=$(api POST /accounttransfers -H "Idempotency-Key: $K" -d "$IB,\"transferAmount\":5}" | jq -r .resourceId)
B2=$(bal $A2); R2=$(api POST /accounttransfers -H "Idempotency-Key: $K" -d "$IB,\"transferAmount\":5}" | jq -r .resourceId)
B3=$(bal $A2); echo "id=$R2/$R1 moved=$(dlt "$B3" "$B2")"

api POST /accounttransfers -H "Idempotency-Key: $K" -d "$IB,\"transferAmount\":999}" >/dev/null; S=$(st)
B4=$(bal $A2); echo "$S moved=$(dlt "$B4" "$B3")"

R4=$(api POST /accounttransfers -H "Idempotency-Key: $K-fresh" -d "$IB,\"transferAmount\":5}" | jq -r .resourceId)
echo "new=$([[ "$R4" != "$R1" ]] && echo yes || echo no) moved=$(dlt "$(bal $A2)" "$B4")"
```

**Kết quả mong đợi** (kiểm chứng: FIN-IDEM-01, FIN-IDEM-02, FIN-IDEM-03 trên 1.15.0):

```text
id=<R1>/<R1> moved=0
200 moved=0
new=yes moved=5
```

Dòng 1 in cùng một id hai lần, và lần gửi thứ hai không chuyển thêm đồng nào. Dòng 2: cùng khoá mà **khác**
số tiền vẫn được 200, không có gì chuyển và không có cảnh báo. Dòng 3: khoá mới với cùng body là chuyển
**lần nữa**.

### Bài tập 7 · Block một chiều: `blockDebit`

Dùng tài khoản mới để không để lại block trên `A1`, `A2`.

```bash
B=$(mkacct $C1 $PROD); activate $B; dep $B 100 >/dev/null
api POST "/savingsaccounts/$B?command=blockDebit" -d "{\"reasonForBlock\":1,$D}" >/dev/null
SUB=$(sub $B); B0=$(bal $B)
dep $B 10 >/dev/null; DS=$(st); B1=$(bal $B)
wd $B 1 >/dev/null; WS=$(st); WMSG=$(code)
api POST "/savingsaccounts/$B?command=unblock" -d "{$D}" >/dev/null; US=$(st); UMSG=$(code)
api POST "/savingsaccounts/$B?command=unblockDebit" -d "{$D}" >/dev/null
echo "sub=$SUB deposit=$DS/+$(dlt "$B1" "$B0") withdrawal=$WS/$WMSG moved=$(dlt "$(bal $B)" "$B1") unblock=$US/$UMSG cleared=$(sub $B)"
```

**Kết quả mong đợi** (kiểm chứng: FIN-ACC-009-c trên 1.15.0):

```text
sub=BlockDebit deposit=200/+10 withdrawal=403/error.msg.savings.account.debit.transaction.not.allowed moved=0 unblock=400/validation.msg.savingsaccount.unblock.not.in.blocked.state cleared=None
```

Tiền vào vẫn ghi có, tiền ra bị chặn. Lệnh `unblock` "toàn phần" **không** gỡ được `BlockDebit`. Chỉ
`unblockDebit` gỡ được.

### Bài tập 8 · Block toàn phần chặn cả tiền vào; block cộng dồn và thu hẹp

```bash
# 8a. block toàn phần từ chối nạp và chuyển vào
B=$(mkacct $C1 $PROD); activate $B; O=$(mkacct $C2 $PROD); activate $O; dep $O 100 >/dev/null
api POST "/savingsaccounts/$B?command=block" -d "{\"reasonForBlock\":1,$D}" >/dev/null
B0=$(bal $B); O0=$(bal $O)
dep $B 10 >/dev/null; DS=$(st); DMSG=$(code)
xfer $C2 $O $C1 $B 7 "block-in" >/dev/null; XS=$(st); XMSG=$(code)
MOVED="$(dlt "$(bal $B)" "$B0")/$(dlt "$(bal $O)" "$O0")"
api POST "/savingsaccounts/$B?command=unblock" -d "{$D}" >/dev/null
echo "deposit=$DS/$DMSG xfer_in=$XS/$XMSG moved=$MOVED cleared=$(sub $B)"

# 8b. blockDebit + blockCredit = Block
B=$(mkacct $C1 $PROD); activate $B
api POST "/savingsaccounts/$B?command=blockDebit" -d "{\"reasonForBlock\":1,$D}" >/dev/null; S1=$(st)
api POST "/savingsaccounts/$B?command=blockCredit" -d "{\"reasonForBlock\":1,$D}" >/dev/null; S2=$(st)
MSG=$(jq -r '.errors[0].userMessageGlobalisationCode // "none"' /tmp/fc-body.json)
SB=$(sub $B); api POST "/savingsaccounts/$B?command=unblock" -d "{$D}" >/dev/null; US=$(st)
echo "blockDebit=$S1 blockCredit=$S2/$MSG sub=$SB unblock=$US cleared=$(sub $B)"

# 8c. một lệnh gỡ một chiều thu hẹp Block thành block chiều ngược lại
B=$(mkacct $C1 $PROD); activate $B
api POST "/savingsaccounts/$B?command=block" -d "{\"reasonForBlock\":1,$D}" >/dev/null
api POST "/savingsaccounts/$B?command=unblockCredit" -d "{$D}" >/dev/null; N1=$(st); S1=$(sub $B)
api POST "/savingsaccounts/$B?command=unblockDebit" -d "{$D}" >/dev/null
echo "block-unblockCredit=$N1/$S1 cleared=$(sub $B)"
```

**Kết quả mong đợi** (kiểm chứng: FIN-ACC-011-a, FIN-ACC-009-e, FIN-ACC-009-f trên 1.15.0):

```text
deposit=403/error.msg.saving.account.blocked.transaction.not.allowed xfer_in=403/error.msg.saving.account.blocked.transaction.not.allowed moved=0/0 cleared=None
blockDebit=200 blockCredit=200/none sub=Block unblock=200 cleared=None
block-unblockCredit=200/BlockDebit cleared=None
```

Đây là ba viên gạch của "khối chặn dẫn xuất" ở [Bài 7](/docs/fineract/onward-dung-fineract-the-nao): độ phủ
cộng dồn, thu hẹp trong một lệnh, và `Block` không dùng được cho trường hợp "nhận tiền vào rồi giữ".

### Bài tập 9 · Dưới block, khoản chi của chính ngân hàng bị từ chối, phí thì vẫn trừ, và không đóng được

```bash
# 9a. block toàn phần: rút và chuyển đi bị từ chối; paycharge vẫn trừ 10
CH=$(api POST /charges -d '{"name":"Checkpoint block fee","chargeAppliesTo":2,"chargeTimeType":2,
    "chargeCalculationType":1,"amount":10,"currencyCode":"USD","active":true,"penalty":false,"locale":"en"}' | jq -r .resourceId)
O=$(mkacct $C2 $PROD); activate $O
B=$(mkacct $C1 $PROD); activate $B; dep $B 100 >/dev/null
SC=$(api POST "/savingsaccounts/$B/charges" -d "{\"chargeId\":$CH,\"amount\":10,\"dueDate\":\"02 August 2026\",$D}" | jq -r .resourceId)
api POST "/savingsaccounts/$B?command=block" -d "{\"reasonForBlock\":1,$D}" >/dev/null
B0=$(bal $B); O0=$(bal $O)
wd $B 1 >/dev/null; WS=$(st); WMSG=$(code)
xfer $C1 $B $C2 $O 5 "block-out" >/dev/null; XS=$(st); XMSG=$(code)
OUT="full: withdrawal=$WS/$WMSG xfer_out=$XS/$XMSG moved=$(dlt "$(bal $B)" "$B0")/$(dlt "$(bal $O)" "$O0")"
B0=$(bal $B)
api POST "/savingsaccounts/$B/charges/$SC?command=paycharge" -d "{\"amount\":10,\"dueDate\":\"02 August 2026\",$D}" >/dev/null; PS=$(st)
PAID=$(api GET "/savingsaccounts/$B/charges/$SC" | jq -r '.amountPaid // "none"' | awk '{printf "%g", $1}')
api POST "/savingsaccounts/$B?command=unblock" -d "{$D}" >/dev/null
echo "$OUT paycharge=$PS/$(dlt "$(bal $B)" "$B0") paid=$PAID cleared=$(sub $B)"

# 9b. tài khoản số dư 0 đang bị block: không đóng được; gỡ block rồi thì đóng được
B=$(mkacct $C1 $PROD); activate $B
api POST "/savingsaccounts/$B?command=block" -d "{\"reasonForBlock\":1,$D}" >/dev/null
api POST "/savingsaccounts/$B?command=close" -d "{\"closedOnDate\":\"$DATE\",\"withdrawBalance\":false,$D}" >/dev/null; CS=$(st); CMSG=$(code)
STA=$(acst $B)
api POST "/savingsaccounts/$B?command=unblock" -d "{$D}" >/dev/null; CLR=$(sub $B)
api POST "/savingsaccounts/$B?command=close" -d "{\"closedOnDate\":\"$DATE\",\"withdrawBalance\":false,$D}" >/dev/null
echo "block: close=$CS/$CMSG status=$STA cleared=$CLR then=$(acst $B)"
```

**Kết quả mong đợi** (kiểm chứng: FIN-ACC-012-b, FIN-ACC-012-a trên 1.15.0):

```text
full: withdrawal=403/error.msg.saving.account.blocked.transaction.not.allowed xfer_out=403/error.msg.saving.account.blocked.transaction.not.allowed moved=0/0 paycharge=200/-10 paid=10 cleared=None
block: close=400/validation.msg.savingsaccount.account.is.in.blocked.state status=Active cleared=None then=Closed
```

Core không phân biệt lệnh chi của ngân hàng với lệnh của khách. Vì thế mới có quy trình "gỡ → chi → chặn
lại" ở Bài 7. Script gốc còn chạy cùng hai phép thử này dưới `blockDebit`, và kết quả giống hệt: `paycharge`
vẫn trừ 10, và lệnh đóng vẫn bị từ chối với cùng mã lỗi.

### Bài tập 10 · Hold là một dòng giao dịch, không đụng tới số dư sổ cái

```bash
B=$(mkacct $C1 $PROD); activate $B; dep $B 100 >/dev/null
B0=$(bal $B); V0=$(avail $B)
H=$(hold $B 30 | jq -r '.resourceId // "none"'); HS=$(st)
B1=$(bal $B); V1=$(avail $B)
HROW=$(api GET "/savingsaccounts/$B?associations=transactions" | jq -r --arg h "$H" \
  '[.transactions[]|select((.id|tostring)==$h)]|.[0]|"\(.transactionType.value)/running=\(.runningBalance)"' | sed 's/\.000000//')
R=$(api POST "/savingsaccounts/$B/transactions/$H?command=releaseAmount" -d "{$D}" | jq -r '.resourceId // "none"'); RS=$(st)
TX=$(api GET "/savingsaccounts/$B?associations=transactions")
RROW=$(printf '%s' "$TX" | jq -r --arg r "$R" '[.transactions[]|select((.id|tostring)==$r)]|.[0]|"\(.transactionType.value)/original=\(.originalTransactionId)"')
HLINK=$(printf '%s' "$TX" | jq -r --arg h "$H" '[.transactions[]|select((.id|tostring)==$h)]|.[0].releaseTransactionId|tostring')
echo "hold=$HS row=$HROW release=$RS row=$RROW hold_names_release=$([[ "$HLINK" == "$R" ]] && echo yes || echo no) ledger=$(dlt "$B1" "$B0")/$(dlt "$(bal $B)" "$B0") available=$(dlt "$V1" "$V0")/$(dlt "$(avail $B)" "$V0")"

# hold cộng dồn; hold vượt số dư khả dụng bị từ chối; hold vẫn đặt được dưới blockDebit; gỡ từng hold
B=$(mkacct $C1 $PROD); activate $B; dep $B 100 >/dev/null
B0=$(bal $B); V0=$(avail $B)
H1=$(hold $B 30 | jq -r '.resourceId // "none"'); V1=$(avail $B)
hold $B 20 >/dev/null; V2=$(avail $B)
R=$(hold $B 60); OS=$(st); V3=$(avail $B)     # 60 > 50 còn khả dụng, < 100 sổ cái
OMSG=$(printf '%s' "$R" | jq -r '[.errors[]?.userMessageGlobalisationCode]|join(",")')
api POST "/savingsaccounts/$B?command=blockDebit" -d "{\"reasonForBlock\":1,$D}" >/dev/null
hold $B 10 >/dev/null; BS=$(st); V4=$(avail $B)
api POST "/savingsaccounts/$B?command=unblockDebit" -d "{$D}" >/dev/null; CLR=$(sub $B)
api POST "/savingsaccounts/$B/transactions/$H1?command=releaseAmount" -d "{$D}" >/dev/null; RS=$(st)
echo "stack=$(dlt "$V1" "$V0")/$(dlt "$V2" "$V0") over=$OS/$OMSG moved=$(dlt "$V3" "$V2") under_blockDebit=$BS/$(dlt "$V4" "$V3") cleared=$CLR release_one=$RS/+$(dlt "$(avail $B)" "$V4") available=$(avail $B | awk '{printf "%g", $1}') ledger=$(dlt "$(bal $B)" "$B0")"
```

**Kết quả mong đợi** (kiểm chứng: FIN-ACC-002-b, FIN-ACC-011-b trên 1.15.0):

```text
hold=200 row=Amount on hold/running=70 release=200 row=Release Amount/original=0 hold_names_release=yes ledger=0/0 available=-30/0
stack=-30/-50 over=400/validation.msg.savingsaccount.insufficient.balance moved=0 under_blockDebit=200/-10 cleared=None release_one=200/+30 available=70 ledger=0
```

💡 Mã lỗi của hold 60 được đọc từ `$R`, không phải từ `/tmp/fc-body.json`: lệnh `avail` ngay sau đó
gọi API lần nữa và ghi đè file đó. Đọc từ file thì `over=` chỉ còn `400/`.

Hold và release đều là dòng giao dịch. Liên kết chỉ chạy một chiều: dòng **hold** ghi id của lệnh release,
còn dòng release có `originalTransactionId` bằng 0. Số dư sổ cái không đổi, chỉ số dư khả dụng giảm. Ở dòng 2,
hai hold 30 và 20 cộng dồn, hold 60 bị từ chối vì chỉ còn 50 khả dụng (dù sổ cái vẫn là 100), dưới
`blockDebit` hold vẫn đặt được, và gỡ một hold trả lại đúng phần của nó.

### Bài tập 11 · Phát lại khoá trên lệnh block bỏ qua trạng thái hiện tại

Bài này cần đọc **header** của phản hồi, nên dùng một hàm riêng. Hàm `runs` đếm số lần core thật sự xử lý
lệnh, dựa trên audit trail của chính core (một lần replay không ghi audit).

```bash
keyed() { # keyed KEY PATH BODY -> "STATUS/replay" hoặc "STATUS/fresh"
  local s
  s=$(curl -sk -u "$AUTH" -H "Fineract-Platform-TenantId: $TENANT" -H 'Content-Type: application/json' \
      -H "Idempotency-Key: $1" -X POST "${BASE}$2" -d "$3" -D /tmp/fc-hdr -o /tmp/fc-body.json -w '%{http_code}')
  if grep -qi '^x-served-from-cache: *true' /tmp/fc-hdr; then echo "$s/replay"; else echo "$s/fresh"; fi; }
runs() { api GET "/audits?resourceId=$1&entityName=SAVINGSACCOUNT&actionName=$2" \
  | jq -r '[.[]|select(.processingResult=="Processed")]|length'; }

B=$(mkacct $C1 $PROD); activate $B; K="checkpoint-blk-$RANDOM"
BB="{\"reasonForBlock\":1,$D}"; BB2="{\"reasonForBlock\":2,$D}"
UB="{$D}"; UB2="{\"locale\":\"en\",\"dateFormat\":\"dd MM yyyy\"}"
b1=$(keyed "$K-block" "/savingsaccounts/$B?command=block" "$BB"); b2=$(keyed "$K-block" "/savingsaccounts/$B?command=block" "$BB")
b3=$(keyed "$K-block" "/savingsaccounts/$B?command=block" "$BB2"); s1=$(sub $B); rb=$(runs $B BLOCK)
u1=$(keyed "$K-unblock" "/savingsaccounts/$B?command=unblock" "$UB"); u2=$(keyed "$K-unblock" "/savingsaccounts/$B?command=unblock" "$UB")
u3=$(keyed "$K-unblock" "/savingsaccounts/$B?command=unblock" "$UB2"); s2=$(sub $B); ru=$(runs $B UNBLOCK)
rb2=$(keyed "$K-block" "/savingsaccounts/$B?command=block" "$BB"); s3=$(sub $B)        # khoá block phát lại trên tài khoản đã gỡ
api POST "/savingsaccounts/$B?command=block" -d "$BB" >/dev/null                          # chặn lại, không dùng khoá
ru2=$(keyed "$K-unblock" "/savingsaccounts/$B?command=unblock" "$UB"); s4=$(sub $B)    # khoá unblock phát lại trên tài khoản đang chặn
api POST "/savingsaccounts/$B?command=unblock" -d "$UB" >/dev/null                        # dọn dẹp
echo "block=$b1,$b2,$b3 sub=$s1 runs=$rb unblock=$u1,$u2,$u3 sub=$s2 runs=$ru replay_block=$rb2/$s3 replay_unblock=$ru2/$s4 cleared=$(sub $B)"
```

**Kết quả mong đợi** (kiểm chứng: FIN-ACC-009-g trên 1.15.0, nửa `block`/`unblock`):

```text
block=200/fresh,200/replay,200/replay sub=Block runs=1 unblock=200/fresh,200/replay,200/replay sub=None runs=1 replay_block=200/replay/None replay_unblock=200/replay/Block cleared=None
```

Đọc kỹ hai mục cuối. Khoá `block` phát lại trên tài khoản **đã gỡ** trả 200, nhưng tài khoản vẫn `None`.
Khoá `unblock` phát lại trên tài khoản **đang chặn** trả 200, nhưng tài khoản vẫn `Block`. Status code giống
hệt lần chạy thật. Chỉ header cho bạn biết sự thật. Vì vậy Onward dùng một khoá mới cho **mỗi** lần đổi block.

### Bài tập 12 · Job dormancy của core: escheat và đóng tài khoản

Bài này tạo hai sản phẩm: một tắt tracking, một bật tracking với ngưỡng rất ngắn (1/2/3 ngày). Hoạt động cuối
của tài khoản là ngày `$DATE`, trước hôm nay nhiều tuần. Sau đó bài chạy job *Update Savings Dormant Accounts*
bằng tay.

```bash
dprod() { api POST /savingsproducts -d "{\"name\":\"$1\",\"shortName\":\"$2\",\"currencyCode\":\"USD\",
  \"digitsAfterDecimal\":2,\"inMultiplesOf\":1,\"nominalAnnualInterestRate\":0,\"interestCompoundingPeriodType\":1,
  \"interestPostingPeriodType\":4,\"interestCalculationType\":1,\"interestCalculationDaysInYearType\":365,
  \"accountingRule\":1,$3\"locale\":\"en\"}" | jq -r .resourceId; }
POFF=$(dprod "Dormancy Off Checkpoint" DOFF '"isDormancyTrackingActive":false,')
PON=$(dprod "Dormancy On Checkpoint" DONV '"isDormancyTrackingActive":true,"daysToInactive":1,"daysToDormancy":2,"daysToEscheat":3,')
dacct() { local a; a=$(mkacct $C1 $1); activate $a; dep $a 20 >/dev/null; echo "$a"; }
AOFF=$(dacct $POFF); ACTL=$(dacct $PON); AWIT=$(dacct $PON); APLN=$(dacct $POFF)
for X in $AOFF $ACTL; do api POST "/savingsaccounts/$X?command=blockDebit" -d "{\"reasonForBlock\":1,$D}" >/dev/null; done

JID=$(api GET /jobs | jq -r '[.[]|select(.displayName=="Update Savings Dormant Accounts")]|.[0].jobId')
N0=$(api GET "/jobs/$JID/runhistory" | jq -r '.totalFilteredRecords // 0')
api POST "/jobs/$JID?command=executeJob" -d '{}' >/dev/null; JS=$(st)
RAN=none
for _ in $(seq 1 60); do   # chờ tối đa khoảng 60 giây cho job chạy xong
  J=$(api GET "/jobs/$JID")
  if [[ "$(printf '%s' "$J" | jq -r .currentlyRunning)" == false && \
        "$(api GET "/jobs/$JID/runhistory" | jq -r '.totalFilteredRecords // 0')" -gt "$N0" ]]; then
    RAN=$(printf '%s' "$J" | jq -r '.lastRunHistory.status // "none"'); break; fi
  sleep 1
done
stt() { api GET "/savingsaccounts/$1" | jq -r '"\(.subStatus.value)/\(.status.value)"'; }
OFF=$(stt $AOFF); CTL=$(stt $ACTL); WIT=$(stt $AWIT); PLN=$(stt $APLN)
for X in $AOFF $ACTL; do api POST "/savingsaccounts/$X?command=unblockDebit" -d "{$D}" >/dev/null; done
echo "job=$JS ran=$RAN off=$OFF control=$CTL witness=$WIT off_plain=$PLN cleared=$(sub $AOFF)/$(sub $ACTL)"
```

**Kết quả mong đợi** (kiểm chứng: FIN-ACC-006-b trên 1.15.0):

```text
job=202 ran=success off=BlockDebit/Active control=BlockDebit/Active witness=Escheat/Closed off_plain=None/Active cleared=None/None
```

Tài khoản "witness" (tracking bật, không block) bị đưa thẳng sang `Escheat` và **core tự đóng** nó chỉ sau một
lần chạy. Hai tài khoản đang `BlockDebit` thì job để yên, dù tracking bật hay tắt. Tài khoản tracking tắt và
không block cũng được để yên. Đây là lý do Onward tắt tracking trên mọi sản phẩm và tự làm dormancy.

## 3. Thử thách thêm (tự viết lệnh)

Hai claim dưới đây có trong bộ kiểm chứng. Hãy tự viết lệnh dựa trên các hàm ở trên, rồi so với kết quả mong
đợi.

**Thử thách A · Lệnh chuyển đã xong thì không đảo được.** Chuyển 3 từ `A1` sang `A2`. Tìm dòng giao dịch
bên `A2` có `transfer.id` bằng id lệnh chuyển, rồi gọi
`POST /savingsaccounts/$A2/transactions/<id dòng>?command=undo`. Sau đó gọi
`POST /accounttransfers/<id lệnh chuyển>?command=reverse`. Mong đợi (kiểm chứng: FIN-TRF-001-c trên 1.15.0):
`undo` trả **503** với developerMessage "Savings account transaction:&lt;id&gt; update not allowed as it involves in
account transfer", `reverse` trả **501** "Unsupported command: reverse", và trường `reversed` của lệnh chuyển
vẫn là `false`. 503 là status mà thư viện HTTP hay tự thử lại, nhưng ở đây đó là một lời từ chối vĩnh viễn.

**Thử thách B · Lãi được ghi thành dòng giao dịch.** Tạo tài khoản mới trên `$PROD`, nạp 1000 vào ngày
`$DATE`, rồi gọi lần lượt `?command=calculateInterest` và `?command=postInterest`, cả hai với body `{}`. Mong đợi (kiểm chứng: FIN-ACC-022-c trên 1.15.0): dòng
"Interest posting" **sớm nhất theo ngày** có `entryType` là `CREDIT`, số tiền `2.13`, ngày `[2026,9,1]`. Bút toán của
dòng đó là `20100/CREDIT/2.13` và `50100/DEBIT/2.13`. Gợi ý: tra bút toán bằng
`GET /journalentries?transactionId=S<id dòng>`. Chỉ dòng đầu tiên là cố định. Các dòng sau tăng theo ngày bạn
chạy. Sắp xếp theo `date`, **không** theo `id`: trên 1.15.0, nhóm Onward thấy dòng ngày `[2026,10,1]`
nhận id nhỏ hơn dòng ngày `[2026,9,1]`, nên lấy dòng có id nhỏ nhất sẽ ra số tiền của tháng khác.

## 4. Khi kết quả của bạn khác

Đừng vội nghĩ mình gõ sai. Hãy đi theo thứ tự:

1. **Phiên bản có đúng 1.15.0 không?** Nếu không, bạn vừa phát hiện một hành vi của phiên bản khác. Đó là kết
   quả có giá trị, nhưng là về phiên bản đó.
2. **Tenant có trắng lúc bắt đầu không, và bạn có chạy đúng thứ tự không?** Bài tập 3 và 4 đếm bút toán trên
   toàn tenant, và nhiều bài dùng `A1`, `A2` từ fixture.
3. **Đọc body lỗi.** `cat /tmp/fc-body.json | jq` thường nói rõ vì sao. Nhớ đọc `developerMessage`, không phải
   `defaultUserMessage` (bài tập 1).
4. Nếu cả ba đều ổn mà kết quả vẫn khác, thì core đang hành xử khác điều khoá học mô tả. Với đội Onward, đó là
   tín hiệu **dừng**: mục thiết kế dựa trên claim đó bị hạ xuống "chưa kiểm chứng" cho tới khi làm rõ.

## Tự kiểm tra

Đánh dấu khi dòng in ra của bạn chứa đúng chuỗi mong đợi:

| # | Hành vi | Claim | Đạt |
|---|---|---|---|
| 1 | Không nạp được vào tài khoản chưa kích hoạt; `defaultUserMessage` vô nghĩa | FIN-LIFE-01, FIN-ERR-01 | ☐ |
| 2 | Thiếu `locale`/`dateFormat` thì 400 | FIN-DATE-01 | ☐ |
| 3 | Không kế toán thì không bút toán; không đổi sản phẩm/lãi suất sau kích hoạt | FIN-LEDGER-01, FIN-LIFE-02 | ☐ |
| 4 | Chuyển tiền đi qua suspense; thiếu mapping 200 thì 404 | FIN-TRF-001-a, FIN-TRF-001-f | ☐ |
| 5 | Core không kiểm tra chủ tài khoản | FIN-OWN-01 | ☐ |
| 6 | Ba tính khí của `Idempotency-Key` | FIN-IDEM-01, -02, -03 | ☐ |
| 7 | `blockDebit` chặn ra, cho vào; chỉ `unblockDebit` gỡ được | FIN-ACC-009-c | ☐ |
| 8 | Block toàn phần chặn tiền vào; cộng dồn; thu hẹp | FIN-ACC-011-a, FIN-ACC-009-e, FIN-ACC-009-f | ☐ |
| 9 | Khoản chi của ngân hàng bị chặn, phí vẫn trừ; không đóng được khi bị block | FIN-ACC-012-b, FIN-ACC-012-a | ☐ |
| 10 | Hold là dòng giao dịch; hold quá khả dụng bị từ chối; hold đặt được dưới `blockDebit` | FIN-ACC-002-b, FIN-ACC-011-b | ☐ |
| 11 | Replay khoá block bỏ qua trạng thái hiện tại | FIN-ACC-009-g | ☐ |
| 12 | Job dormancy escheat và đóng tài khoản khi tracking bật | FIN-ACC-006-b | ☐ |

Và vài câu hỏi để tự trả lời bằng lời:

- [ ] Vì sao bài tập 6 cho thấy *không được* sinh khoá mới khi thử lại một lệnh chuyển mà bạn **chưa biết kết quả**
  (ví dụ bị timeout), trong khi Bài 7 lại bảo sinh khoá mới sau một lệnh **đã nhận lỗi**?
- [ ] Bài tập 7 và 8a cho thấy gì về việc chọn `blockDebit` hay `block` cho một lệnh phong toả kiểu "nhận rồi giữ"?
- [ ] Từ bài tập 9, giải thích vì sao Onward cần quy trình "gỡ → chi → chặn lại".
- [ ] Từ bài tập 11, vì sao không thể dựa vào status code để biết một lệnh block có thật sự chạy?

## Nguồn tham khảo

1. Apache Fineract, trang chủ dự án. <https://fineract.apache.org/>
2. Apache Fineract 1.15.0, bản phát hành được dùng để kiểm chứng. <https://github.com/apache/fineract/releases/tag/1.15.0>
3. Apache Fineract 1.15.0, file `docker-compose-development.yml`. <https://github.com/apache/fineract/blob/1.15.0/docker-compose-development.yml>
4. Apache Fineract, tài liệu chính thức. <https://fineract.apache.org/docs/current/>
5. Bộ script kiểm chứng claim Fineract nội bộ của Onward. Không công khai. Mọi lệnh và chuỗi mong đợi trong bài
   chép từ đó.

**Hết khoá.** Quay lại [Bài 1 · Giới thiệu Apache Fineract](/docs/fineract/gioi-thieu) hoặc xem lại
[Bài 7 · Onward dùng Fineract thế nào](/docs/fineract/onward-dung-fineract-the-nao).
