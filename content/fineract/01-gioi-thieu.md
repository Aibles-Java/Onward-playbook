---
title: "Bài 1 · Apache Fineract là gì?"
description: "Fineract là một core banking mã nguồn mở, chỉ có REST API, chạy nhiều tenant; Onward dùng bản 1.15.0 và đặt nó sau một port."
order: 1
tags: [fineract, core-banking, gioi-thieu, apache]
language: vi
profile: onward-fineract-course
classification: public-safe
source_repo: none
source_refs:
  - https://fineract.apache.org/
  - https://fineract.apache.org/docs/current/
  - https://github.com/apache/fineract
  - https://github.com/apache/fineract/releases/tag/1.15.0
  - https://github.com/apache/fineract/blob/1.15.0/README.md
  - https://github.com/apache/fineract/blob/1.15.0/APACHE_LICENSETEXT.md
  - https://www.apache.org/licenses/LICENSE-2.0
---

# Bài 1 · Apache Fineract là gì?

> Trước khi gõ lệnh `curl` đầu tiên, hãy nắm bức tranh lớn: Fineract là gì, ai làm ra nó, nó
> giỏi việc gì, và nó đứng ở đâu trong hệ thống của Onward. Bài này không cần cài đặt gì cả.

## Sau bài này bạn sẽ

1. Giải thích được "core banking" là gì và Fineract đóng vai trò đó ra sao.
2. Biết Fineract thuộc dự án nào, dùng giấy phép gì, và vì sao khoá học ghim đúng bản **1.15.0**.
3. Hiểu hai đặc điểm kỹ thuật chi phối mọi bài sau: **chỉ có REST API** và **multi-tenant**.
4. Vẽ lại được vị trí của Fineract trong Onward: một hệ thống bên ngoài, nằm sau một **port**.

## 1. Core banking là gì?

Một ngân hàng số có hai lớp việc rất khác nhau:

| Lớp | Lo việc gì | Ví dụ |
|-----|-----------|-------|
| Nền tảng của chúng ta | Hành trình khách hàng: màn hình, luồng, lời hứa với khách | Đăng ký, mở tài khoản, chuyển tiền trên app |
| **Core banking** | Giữ sổ sách: số dư, giao dịch, sổ cái kế toán | "Tài khoản A còn 380", "ghi Nợ 500 vào Tiền mặt" |

Đội Onward tóm gọn sự phân vai này bằng một câu, và cả khoá học xoay quanh nó:

> **Fineract giữ sổ sách. Chúng ta giữ lời hứa.**
> Core đảm bảo sổ cái cân. Nó **không** đảm bảo sổ cái đúng: đúng khách hàng, đúng số tiền, chỉ
> trả một lần. Phần đó là của chúng ta.

**Vì sao câu này quan trọng?** Vì rất nhiều lỗi nghiêm trọng xảy ra khi lập trình viên tưởng core
sẽ "tự chặn" giúp mình. Ở Bài 6 bạn sẽ thấy những trường hợp core chấp nhận một yêu cầu mà một
người bình thường sẽ coi là sai, và vì sao kiểm tra đó phải nằm ở phía chúng ta.

## 2. Apache Fineract: dự án và giấy phép

**Apache Fineract** là một nền tảng core banking mã nguồn mở. README chính thức mô tả nó là "an
open-source core banking platform providing a flexible, extensible foundation for a wide range of
financial services".

Một vài mốc lịch sử (theo chương *History* trong tài liệu kiến trúc của dự án):

| Năm | Sự kiện |
|-----|---------|
| 2006 | Grameen Foundation khởi động dự án, hướng tới tài chính vi mô (microfinance) |
| Cuối 2011 | Grameen Foundation chuyển toàn bộ trách nhiệm cho cộng đồng mã nguồn mở |
| 2012 | Nền tảng Mifos X ra đời |
| 2016 | Fineract 1.x bắt đầu ươm tạo (incubation) tại Apache Software Foundation |

Ngày nay Fineract là một dự án của **Apache Software Foundation**, mã nguồn trên GitHub tại
`apache/fineract`.

**Giấy phép: Apache License 2.0.** Đây là giấy phép mã nguồn mở dễ dãi (permissive): bạn được dùng,
sửa, tự triển khai, kể cả cho mục đích thương mại, miễn là giữ thông báo bản quyền và giấy phép.
Với một dự án học tập không có ngân sách, điều này rất quan trọng: Onward có thể **tự host** một
core thật mà không phải trả phí bản quyền.

> ⚠️ **Lưu ý từ chính dự án:** README nhấn mạnh image Docker của Fineract "NOT production-ready",
> và dự án không cung cấp hướng dẫn đầy đủ để triển khai production. Mọi thứ trong khoá học này là
> để **học và thử nghiệm trên máy local**.

### Vì sao ghim đúng bản 1.15.0?

Phần mềm thay đổi theo thời gian, và hành vi của core cũng vậy. Khóa học này chỉ nói về **Apache
Fineract 1.15.0** (bản phát hành chính thức, tag `1.15.0` trên GitHub). Khi bạn thấy ghi chú dạng
**"kiểm chứng: FIN-XXX trên 1.15.0"**, nghĩa là có một lệnh gọi API thật, chạy lại được, đứng sau câu đó.
Chỗ nào chưa chạy lại, bài ghi rõ **"chưa kiểm chứng"**.

Nếu bạn chạy một bản khác (ví dụ bản `develop` mới nhất), kết quả có thể khác. Khi đó đừng vội nghĩ
mình sai: hãy kiểm tra phiên bản trước.

## 3. Hai đặc điểm kỹ thuật cần nhớ

### 3.1. Chỉ có API, không có giao diện

README của dự án nói thẳng: *"Fineract does not provide a UI, but provides an API."* Mọi thao tác
(tạo khách hàng, mở tài khoản, nạp tiền, xem sổ cái) đều là một **HTTP request** tới REST API, trả
về JSON. Có những ứng dụng web riêng (ví dụ của cộng đồng Mifos) nói chuyện với API này, nhưng chúng
không phải là Fineract.

Mỗi lời gọi API có dạng chung như sau (Bài 3 sẽ giải thích từng phần):

```bash
curl -k -u <user>:<password> \
  -H "Fineract-Platform-TenantId: default" \
  -H "Content-Type: application/json" \
  https://localhost:8443/fineract-provider/api/v1/clients
```

### 3.2. Multi-tenant ngay từ thiết kế

Tài liệu kiến trúc của Fineract (mục *Multi-tenanted*) mô tả nền tảng được xây với **multi-tenancy**
làm trung tâm: một máy chủ Fineract có thể phục vụ nhiều tổ chức tài chính, và dữ liệu của mỗi tổ
chức được tách riêng theo database/schema.

Mỗi "tổ chức" như vậy gọi là một **tenant**. Đó là lý do mọi request phải mang header
`Fineract-Platform-TenantId`: nó cho Fineract biết bạn đang làm việc với sổ sách của tenant nào. Trên
bản cài local, tenant mặc định tên là `default`.

**Vì sao điều này quan trọng?** Vì "reset về trạng thái trắng" ở Bài 3 thực chất là xoá dữ liệu
của tenant, và vì tenant tách dữ liệu giữa các **tổ chức**, không tách giữa các khách hàng của cùng
một tổ chức. Việc tách dữ liệu giữa các khách hàng là việc của nền tảng (Bài 6, Bài 7).

## 4. Fineract nằm ở đâu trong Onward?

Theo tài liệu thiết kế nội bộ của Onward, Fineract được chọn làm core banking vì đây là lựa chọn
miễn phí, tự host được, còn được duy trì, và thực sự là một core (có sổ cái, sản phẩm, vòng đời tài
khoản). Nhưng nó được đặt **sau một port**:

<svg viewBox="0 0 720 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Vị trí của Fineract trong Onward: các service của Onward (hành trình khách hàng) gọi qua một port, port được hiện thực bởi một adapter, và chỉ adapter mới nói chuyện với Apache Fineract 1.15.0 qua REST API. Fineract nằm ngoài ranh giới hệ thống của Onward và được đối xử như hệ thống bên thứ ba.">
  <defs>
    <marker id="fc1-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L6,3 L0,6 Z" fill="#64748B"/>
    </marker>
  </defs>
  <g font-family="sans-serif" font-size="12" text-anchor="middle">
    <rect x="10" y="20" width="470" height="160" rx="10" fill="none" stroke="#94A3B8" stroke-dasharray="6 4"/>
    <text x="245" y="40" fill="#64748B" font-size="11">Nền tảng Onward</text>
    <rect x="30" y="70" width="130" height="60" rx="8" fill="#F8FAFC" stroke="#94A3B8"/>
    <text x="95" y="96" fill="#0F172A">Các service</text>
    <text x="95" y="114" fill="#64748B" font-size="10">hành trình khách hàng</text>
    <rect x="190" y="70" width="120" height="60" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="250" y="96" fill="#1D4ED8">Port</text>
    <text x="250" y="114" fill="#64748B" font-size="10">hợp đồng của ta</text>
    <rect x="340" y="70" width="120" height="60" rx="8" fill="#EFF6FF" stroke="#2563EB"/>
    <text x="400" y="96" fill="#1D4ED8">Adapter</text>
    <text x="400" y="114" fill="#64748B" font-size="10">code duy nhất gọi core</text>
    <rect x="540" y="60" width="170" height="80" rx="40" fill="#ECFDF5" stroke="#10B981"/>
    <text x="625" y="94" fill="#047857">Apache Fineract</text>
    <text x="625" y="112" fill="#64748B" font-size="10">1.15.0 · REST API</text>
    <line x1="160" y1="100" x2="186" y2="100" stroke="#64748B" marker-end="url(#fc1-arrow)"/>
    <line x1="310" y1="100" x2="336" y2="100" stroke="#64748B" marker-end="url(#fc1-arrow)"/>
    <line x1="460" y1="100" x2="536" y2="100" stroke="#64748B" marker-end="url(#fc1-arrow)"/>
    <text x="498" y="90" fill="#64748B" font-size="10">HTTPS</text>
  </g>
</svg>

Ba nguyên tắc rút ra từ tài liệu thiết kế, viết bằng lời thường:

1. **Core là hệ thống bên ngoài, đứng sau một port.** Code nghiệp vụ của Onward không gọi Fineract
   trực tiếp. Nó gọi một interface (port) do chúng ta định nghĩa; chỉ adapter mới biết đến URL, header
   và JSON của Fineract. Muốn đổi core thì viết lại adapter, không phải thiết kế lại hệ thống.
2. **Tự triển khai nhưng vẫn coi là bên thứ ba.** Dù Onward tự chạy Fineract, không ai được "lách"
   qua port: không join vào database của nó, không đọc thẳng bảng của nó để làm báo cáo.
3. **Port được chia theo năng lực.** Mỗi module có việc cần với core thì có một port hẹp, đặt tên
   theo năng lực nó cần (ví dụ port cho tài khoản), thay vì một interface khổng lồ dùng chung. Bài 7
   sẽ đi sâu vào phần này.

**Vì sao lại cẩn thận như vậy?** Vì lựa chọn core là quyết định **dễ đảo ngược nhất** nếu nó chỉ
nằm trong adapter, và khó đảo ngược nhất nếu chi tiết của nó rò rỉ khắp codebase.

## 5. Lộ trình của khoá học

| Bài | Nội dung |
|-----|----------|
| 1 | Fineract là gì (bài này) |
| 2 | Các khái niệm cốt lõi: office, client, product, account, block, hold, sổ cái |
| 3 | Chạy Fineract trên máy local |
| 4 | Gọi API từng bước: từ sổ cái trống tới một giao dịch chuyển tiền |
| 5 | Ghi sổ kép và sổ cái |
| 6 | Những hành vi đã kiểm chứng và các cái bẫy |
| 7 | Onward dùng Fineract thế nào |
| 8 | Checkpoint: tự tái hiện các hành vi trên máy của bạn |

## Checklist cuối bài

- [ ] Tôi phân biệt được việc của **core banking** (giữ sổ) và việc của **nền tảng** (giữ lời hứa).
- [ ] Tôi biết Fineract là dự án Apache, giấy phép **Apache-2.0**, và khoá học ghim bản **1.15.0**.
- [ ] Tôi biết Fineract **không có giao diện**: mọi thứ là REST API trả JSON.
- [ ] Tôi giải thích được **tenant** là gì và vì sao mọi request cần header `Fineract-Platform-TenantId`.
- [ ] Tôi vẽ lại được chuỗi: service → port → adapter → Fineract.

## Nguồn tham khảo

1. Apache Fineract, trang chủ dự án. <https://fineract.apache.org/>
2. Apache Fineract, tài liệu chính thức (mục Architecture: History, Multi-tenanted). <https://fineract.apache.org/docs/current/>
3. Mã nguồn `apache/fineract` trên GitHub. <https://github.com/apache/fineract>
4. Bản phát hành 1.15.0. <https://github.com/apache/fineract/releases/tag/1.15.0>
5. README tại tag 1.15.0 (mô tả dự án, "does not provide a UI", cảnh báo production). <https://github.com/apache/fineract/blob/1.15.0/README.md>
6. Apache License 2.0. <https://www.apache.org/licenses/LICENSE-2.0>

**Bài tiếp theo:** [Bài 2 · Các khái niệm cốt lõi](/docs/fineract/khai-niem-cot-loi)
