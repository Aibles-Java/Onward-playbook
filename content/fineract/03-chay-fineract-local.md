---
title: "Bài 3 · Chạy Fineract trên máy local"
description: "Build và chạy Apache Fineract 1.15.0 bằng Docker Compose, gọi API với header tenant và basic auth mặc định cho môi trường dev, kiểm tra sức khoẻ, reset về tenant trắng và tìm tài liệu OpenAPI."
order: 3
tags: [fineract, core-banking, docker, local-dev, openapi]
language: vi
profile: onward-fineract-course
classification: public-safe
source_repo: none
source_refs:
  - https://github.com/apache/fineract/blob/1.15.0/README.md
  - https://github.com/apache/fineract/blob/1.15.0/docker-compose-development.yml
  - https://github.com/apache/fineract/blob/1.15.0/docker-compose.yml
  - https://github.com/apache/fineract/tree/1.15.0
  - https://fineract.apache.org/docs/current/
---

# Bài 3 · Chạy Fineract trên máy local

> Bài này đưa bạn từ "chưa có gì" tới một Fineract 1.15.0 đang chạy trên máy, một tenant trắng, và
> một hàm shell nhỏ để mọi bài sau gõ lệnh ngắn gọn. Mất khoảng 20–30 phút, phần lớn là chờ build.

## Sau bài này bạn sẽ

1. Build được image Fineract 1.15.0 và khởi động nó bằng Docker Compose.
2. Gọi được API với đủ bốn thành phần: base URL, header tenant, basic auth, JSON.
3. Kiểm tra được Fineract đã sẵn sàng và đang ở tenant trắng.
4. Reset được về tenant trắng bất cứ lúc nào.
5. Tìm được tài liệu OpenAPI của chính bản đang chạy.

> ⚠️ **Chỉ dành cho máy local.** README của Fineract cảnh báo image Docker "NOT production-ready"
> (ví dụ profile `test` của Spring đang bật). Đừng mở cổng của bản cài này ra Internet.

## 0. Chuẩn bị

| Công cụ | Dùng để | Ghi chú |
|---------|---------|---------|
| Git | Lấy mã nguồn | |
| Java 21 | Chạy Gradle để build image | README 1.15.0 yêu cầu "Java 21 or higher" |
| Docker + Docker Compose | Chạy Fineract và PostgreSQL | |
| `curl` | Gọi API | |
| `jq` | Đọc JSON trả về | Không bắt buộc nhưng các bài sau dùng nhiều |

## 1. Lấy mã nguồn đúng phiên bản

```bash
git clone https://github.com/apache/fineract.git
cd fineract
git checkout 1.15.0
```

**Vì sao phải checkout tag?** Nhánh mặc định là bản đang phát triển, hành vi có thể khác 1.15.0.
Khóa học này chỉ cam kết những gì đã chạy lại trên **1.15.0**.

## 2. Build image Docker

File compose của Fineract dùng image `fineract:latest`. Image này **không** kéo về từ registry được:
bạn phải tự build nó trong Docker local trước (README gọi đây là cách chạy chuẩn):

```bash
./gradlew :fineract-provider:jibDockerBuild -x test
```

- `jibDockerBuild` build image và nạp thẳng vào Docker daemon trên máy bạn.
- `-x test` bỏ qua test để build nhanh hơn.
- Lần đầu khá lâu: trên máy của nhóm Onward mất khoảng 10 phút (đo trên một bản build phát triển, không
  phải con số cam kết).

Nếu chạy `docker compose up` **trước khi** build, lệnh sẽ thất bại vì không kéo được image `fineract:latest`.

## 3. Khởi động

README 1.15.0 hướng dẫn dùng `docker-compose-development.yml`. File này gửi log tới Loki, nên cần
cài Loki log driver một lần:

```bash
docker plugin install grafana/loki-docker-driver:latest \
  --alias loki --grant-all-permissions
```

Rồi khởi động, **từ trong thư mục `fineract`** (file compose dùng thư mục hiện tại để tìm cấu hình):

```bash
docker compose -f docker-compose-development.yml up -d
```

Sau khi lên, API nằm ở cổng **8443** (HTTPS, chứng chỉ tự ký). File này cũng mở PostgreSQL ở cổng
5432 và cổng debug 5000.

**Với bản cài stock, bạn không cần thêm gì:** nếu ba cổng 8443, 5432 và 5000 đều trống, lệnh trên là đủ
và mọi lệnh trong khoá học dùng `https://localhost:8443` như đã viết.

### Nếu bị trùng cổng

Nếu máy bạn đã có thứ khác chiếm cổng 5432 hoặc 5000 (trên macOS, AirPlay Receiver hay giữ cổng
5000), Compose sẽ báo kiểu `Bind for 0.0.0.0:5432 failed: port is already allocated`. Apache Fineract
không có sẵn cách đổi cổng. Nhóm Onward xử lý bằng một **file ghi đè tự viết**, không thuộc Apache
Fineract. Tạo file `docker-compose-local-ports.yml` **trong thư mục `fineract`**, cạnh
`docker-compose-development.yml`, với đúng nội dung này:

```yaml
# File ghi đè cục bộ. Không phải một phần của Apache Fineract.
services:
  db:
    ports: !override
      - "5442:5432"
  fineract:
    ports: !override
      - "8443:8443"
      - "5050:5000"
```

`!override` thay **toàn bộ** danh sách cổng của service thay vì cộng thêm vào. Vì vậy phải liệt kê lại
cả `8443:8443`, nếu không API sẽ không được mở ra máy bạn. Số bên trái là cổng trên máy bạn, số bên
phải là cổng trong container; chỉ đổi số bên trái.

`!override` cần Docker Compose v2 bản mới; nếu Compose báo lỗi cú pháp, hãy cập nhật Compose (phiên bản
tối thiểu: chưa kiểm chứng).

Rồi truyền **cả hai** file:

```bash
docker compose -f docker-compose-development.yml -f docker-compose-local-ports.yml up -d
```

API vẫn ở cổng 8443; chỉ PostgreSQL và cổng debug đổi chỗ.

**Nếu chính cổng 8443 bị chiếm**, đổi dòng `"8443:8443"` thành ví dụ `"9443:8443"`. Nhóm Onward đã chạy
thử cách này trên 1.15.0: `/actuator/health` trả `UP` ở `https://localhost:9443`. Khi đó, ở **mọi** lệnh
trong khoá học, thay `8443` bằng cổng của bạn: biến `FIN_BASE` ở bước 6, các lệnh `curl` gọi thẳng
`actuator` và `fineract.json` ở bước 4, 8 và 10, và biến `BASE` ở [Bài 8](/docs/fineract/checkpoint).

> 💡 Nếu gặp lỗi quyền ghi file khi chạy Compose, README gợi ý chỉnh `FINERACT_USER` và
> `FINERACT_GROUP` trong `config/docker/env/fineract-common.env` theo kết quả của `id -u` và `id -g`.

## 4. Chờ tới khi sẵn sàng

Fineract cần thời gian để khởi động; lần đầu còn phải tạo toàn bộ bảng trong database. Vòng lặp này
hỏi endpoint sức khoẻ mỗi 5 giây:

```bash
until [ "$(curl -sk -o /dev/null -w '%{http_code}' \
  https://localhost:8443/fineract-provider/actuator/health)" = 200 ]; \
  do sleep 5; echo -n .; done; echo " ready"
```

Khi xong, gọi trực tiếp endpoint sức khoẻ. Theo README, một bản cài mới trả về:

```bash
curl -k https://localhost:8443/fineract-provider/actuator/health
```

```json
{"status":"UP","groups":["liveness","readiness"]}
```

**Vì sao có `-k`?** Fineract dùng chứng chỉ HTTPS tự ký. `-k` (hay `--insecure`) bảo `curl` chấp
nhận nó. Chỉ làm vậy với máy local.

## 5. Hình dạng của mọi lời gọi API

Mọi request tới Fineract đều có bốn phần. Học một lần, dùng cho cả khoá:

| # | Thành phần | Giá trị trên máy local |
|---|-----------|------------------------|
| 1 | Base URL | `https://localhost:8443/fineract-provider/api/v1` |
| 2 | Tenant | Header `Fineract-Platform-TenantId: default` |
| 3 | Xác thực | Basic auth, **mặc định cho môi trường dev**: `mifos` / `password` |
| 4 | Thân request | JSON, header `Content-Type: application/json`; động từ nằm ở query string, ví dụ `?command=approve` |

> 🔐 **`mifos` / `password` là thông tin đăng nhập mặc định công khai của bản dev**, được ghi trong
> README của Fineract. Chúng chỉ dùng cho máy local. Bất kỳ môi trường nào khác phải đổi ngay, và
> không bao giờ được commit mật khẩu thật vào tài liệu hay mã nguồn.

**Thêm một quy tắc về ngày tháng.** Mọi request có trường ngày phải kèm `locale` và `dateFormat`.
Thiếu chúng, request bị từ chối với HTTP 400 (kiểm chứng: FIN-DATE-01 trên 1.15.0). Khóa học dùng:

```json
"locale": "en", "dateFormat": "dd MMMM yyyy"
```

để viết ngày dạng `01 August 2026`. Fineract nhận ngày dạng chữ như vậy nhưng trả về dạng mảng
`[2026, 8, 1]`.

## 6. Một hàm shell cho cả khoá học

Gõ đủ bốn thành phần ở mỗi lệnh rất mệt. Dán khối này vào terminal (mỗi cửa sổ terminal mới phải dán
lại):

```bash
FIN_BASE="https://localhost:8443/fineract-provider/api/v1"

# fin METHOD PATH [tham số curl khác...]
# In body JSON, rồi một dòng [HTTP xxx].
fin() {
  local method=$1 p=$2; shift 2
  curl -sk -u mifos:password \
    -H "Fineract-Platform-TenantId: default" \
    -H "Content-Type: application/json" \
    -X "$method" "$FIN_BASE$p" "$@" \
    -w '\n[HTTP %{http_code}]\n'
}

# j: bỏ dòng [HTTP ...] để jq đọc được JSON
j() { sed '/^\[HTTP/d'; }

# D: định dạng ngày dùng cho mọi request có ngày
D='"locale":"en","dateFormat":"dd MMMM yyyy"'
```

Khối này chạy được cả trong `bash` lẫn `zsh` (shell mặc định của macOS). Đừng đổi tên biến `p` thành
`path`: trong `zsh`, `path` là biến đặc biệt gắn với `PATH`, và hàm sẽ báo `command not found: curl`.

Thử ngay:

```bash
fin GET /offices | j | jq -r '.[].name'
```

Kết quả mong đợi trên một tenant mới:

```
Head Office
```

Nếu thấy dòng này, bạn đã gọi API thành công với đủ tenant và xác thực. README cũng gợi ý một phép
thử khác: `GET /clients` trên bản mới trả về `{"totalFilteredRecords":0,"pageItems":[]}`.

### Đọc một phản hồi

| Bạn thấy | Nghĩa là |
|----------|----------|
| `{"resourceId": 1}` rồi `[HTTP 200]` | Thành công. `resourceId` là id của thứ vừa tạo |
| `[HTTP 400]` | Thiếu hoặc sai trường. Không có gì được lưu |
| `[HTTP 403]` | Bị một quy tắc nghiệp vụ từ chối, hoặc thứ đó đã tồn tại. Không có gì được lưu |
| `[HTTP 404]` | Một thứ mà request phụ thuộc vào không tồn tại. Không có gì được lưu |
| `[HTTP 000]` | Fineract không chạy (máy ngủ, Docker dừng...). Quay lại bước 3 |

(Theo các lần chạy của nhóm Onward trên 1.15.0.)

**Khi lỗi, đọc `developerMessage`, đừng đọc `defaultUserMessage`.** Ví dụ khi nạp tiền vào tài khoản
chưa kích hoạt, `defaultUserMessage` chỉ là `"transactionDate"`, còn lý do thật nằm ở
`developerMessage`: `"Transaction is not allowed. Account is not active."` (kiểm chứng: FIN-ERR-01
trên 1.15.0). Lệnh in lý do:

```bash
... | j | jq -r '.errors[].developerMessage'
```

Và không bao giờ hiển thị thông báo của core trực tiếp cho khách hàng.

## 7. Bạn đang ở đâu? Hàm `state`

Hàm này đếm mọi thứ trong tenant. Chạy nó bất cứ khi nào không chắc mình đang ở trạng thái nào:

```bash
state() { echo "GL $(fin GET /glaccounts | j | jq length)" \
  "· products $(fin GET /savingsproducts | j | jq length)" \
  "· clients $(fin GET /clients | j | jq .totalFilteredRecords)" \
  "· accounts $(fin GET /savingsaccounts | j | jq .totalFilteredRecords)" \
  "· journal $(fin GET /journalentries | j | jq .totalFilteredRecords)"; }
state
```

Trên tenant trắng:

```
GL 0 · products 0 · clients 0 · accounts 0 · journal 0
```

## 8. Kiểm tra phiên bản

```bash
curl -sk https://localhost:8443/fineract-provider/actuator/info | jq -r '.git.build.version'
```

Bộ kiểm chứng của Onward đọc đúng trường này trước khi chạy, và cảnh báo nếu nó khác `1.15.0`. Nếu
bạn build từ tag `1.15.0`, đây là giá trị bạn nên thấy.

## 9. Reset về tenant trắng

Khi bị rối giữa chừng, cách nhanh nhất là bắt đầu lại từ đầu:

```bash
docker compose -f docker-compose-development.yml down -v
docker compose -f docker-compose-development.yml up -d
```

(Nếu bạn dùng file ghi đè cổng, thêm `-f docker-compose-local-ports.yml` vào **cả hai** lệnh.)

- **`-v` là thứ xoá dữ liệu.** Thiếu nó, `down` chỉ dừng container; database quay lại y nguyên.
- Sau khi `up -d`, chạy lại vòng lặp chờ ở bước 4, rồi `state` phải in toàn số 0.

**Vì sao cần tenant trắng?** Các bài sau so sánh kết quả của bạn với kết quả đã ghi lại. Id trong
Fineract đến từ một bộ đếm của database, và một lần chèn thất bại vẫn "ăn" mất một số. Bắt đầu từ
trắng giúp kết quả dễ đối chiếu hơn, nhưng ngay cả vậy, **đừng bao giờ hard-code một id mà bạn không
vừa nhận về**.

## 10. Tài liệu OpenAPI (Swagger)

Fineract mô tả toàn bộ API của nó bằng một tài liệu OpenAPI:

| Cái gì | Đường dẫn | Nguồn |
|--------|-----------|-------|
| Swagger UI (giao diện duyệt API) | `https://localhost:8443/fineract-provider/swagger-ui/index.html` | README 1.15.0 |
| Tài liệu OpenAPI dạng JSON | `https://localhost:8443/fineract-provider/fineract.json` | Bộ kiểm chứng của Onward tải file này từ bản 1.15.0 |

```bash
curl -sk https://localhost:8443/fineract-provider/fineract.json -o fineract-openapi.json
jq -r '.info.version, (.paths | length)' fineract-openapi.json
```

Trên bản 1.15.0 mà nhóm Onward chạy, tài liệu này báo `info.version` là `1.15.0` và có **600 paths**.

**Hai lưu ý khi đọc tài liệu này:**

1. Đường dẫn `/fineract-provider/api-docs` trả HTTP 200 nhưng **rỗng**: trên 1.15.0, nhóm Onward nhận
   về `"openapi":"3.1.0"`, `"version":"v0"` và `"paths":{}` (bản build phát triển 1.16.0-SNAPSHOT cũng
   vậy). Hãy dùng `fineract.json`.
2. Schema không phải lúc nào cũng nói đúng trường nào bắt buộc. Trên bản build phát triển, nhóm
   gặp nhiều trường schema ghi là tuỳ chọn nhưng thực tế bắt buộc (ví dụ `paymentTypeId` khi nạp
   tiền). Trên 1.15.0, nạp tiền thiếu `paymentTypeId` cũng bị từ chối; bạn sẽ gặp ở Bài 4. Chỉ một
   phản hồi 400 thật mới nói sự thật.

## Gặp sự cố?

| Triệu chứng | Nguyên nhân thường gặp | Cách xử lý |
|-------------|------------------------|------------|
| Mọi lệnh trả `[HTTP 000]` | Fineract không chạy (máy ngủ hoặc khởi động lại) | Chạy lại lệnh `up -d` ở bước 3; dữ liệu vẫn còn |
| `port is already allocated` | Trùng cổng | Tạo file ghi đè cổng ở bước 3 |
| Compose không kéo được `fineract:latest` | Chưa build image | Làm bước 2 |
| `state` không ra toàn số 0 | Tenant không trắng | Reset theo bước 9 |
| `command not found: fin` | Mở terminal mới | Dán lại khối ở bước 6 |

## Checklist cuối bài

- [ ] `curl -k .../actuator/health` trả `"status":"UP"`.
- [ ] `fin GET /offices` in ra `Head Office`.
- [ ] `state` in `GL 0 · products 0 · clients 0 · accounts 0 · journal 0`.
- [ ] Tôi nhớ bốn thành phần của một lời gọi: base URL, **tenant header**, **basic auth**, JSON.
- [ ] Tôi biết `mifos` / `password` chỉ là mặc định của môi trường dev.
- [ ] Tôi biết mọi request có ngày cần `locale` và `dateFormat`.
- [ ] Tôi reset được về tenant trắng bằng `down -v` rồi `up -d`.
- [ ] Tôi mở được tài liệu OpenAPI của bản đang chạy.

## Nguồn tham khảo

1. README của Apache Fineract tại tag 1.15.0 (yêu cầu Java 21, `jibDockerBuild`, Loki driver, health check, thông tin đăng nhập mặc định, Swagger UI, cảnh báo production). <https://github.com/apache/fineract/blob/1.15.0/README.md>
2. `docker-compose-development.yml` tại tag 1.15.0. <https://github.com/apache/fineract/blob/1.15.0/docker-compose-development.yml>
3. `docker-compose.yml` tại tag 1.15.0. <https://github.com/apache/fineract/blob/1.15.0/docker-compose.yml>
4. Apache Fineract, tài liệu chính thức. <https://fineract.apache.org/docs/current/>
5. Bộ kiểm chứng hành vi Fineract của Onward (nội bộ, chạy trên 1.15.0 với tenant trắng).

**Bài tiếp theo:** [Bài 4 · Gọi API từng bước](/docs/fineract/api-tung-buoc)
