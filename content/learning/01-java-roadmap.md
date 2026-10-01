---
title: "Lộ trình Java Developer"
description: "Roadmap học Java 6 chặng, dựng từ roadmap.sh/java và bổ sung cho bối cảnh Digital Banking của Onward."
order: 1
tags: [java, roadmap, học-tập, spring-boot]
---

# Lộ trình Java Developer

> Bản đồ có sẵn, việc của bạn là đi từng chặng. Mỗi chặng có **mục tiêu**, **chủ đề**
> và **checkpoint**. Xong checkpoint thì mới sang chặng tiếp theo.

Lộ trình này dựng từ roadmap **Java Developer** của roadmap.sh [1]. Các nhánh, chủ đề
và thứ tự được lấy từ dữ liệu gốc của roadmap (API chính thức [2], bản cập nhật
ngày 27/01/2026). Mô tả và tài liệu từng chủ đề lấy từ repo mã nguồn mở của
roadmap.sh [3]. Roadmap gốc có **88 chủ đề** (20 topic chính, 68 topic con).

Những phần **Onward bổ sung** không có trong roadmap.sh và được đánh dấu 🏦 để bạn
phân biệt.

## Bức tranh tổng thể

| Chặng | Nội dung (theo roadmap.sh) | Thời lượng gợi ý* |
|-------|----------------------------|-------------------|
| 1 | Learn the Basics | 3–4 tuần |
| 2 | Basics of OOP + More about OOP | 3–4 tuần |
| 3 | Ngôn ngữ nâng cao + Collections | 3–4 tuần |
| 4 | Concurrency, I/O, các API chuẩn | 3–4 tuần |
| 5 | Hệ sinh thái: Build Tools, Web Frameworks, Database Access, Functional Programming | 6–8 tuần |
| 6 | Logging, Documentation, Testing | 3–4 tuần |

\* Thời lượng do Onward ước lượng cho người học khoảng 10–15 giờ/tuần. Roadmap.sh
không đưa ra con số này.

**Phiên bản nên học (tính đến 10/2026):** Java **25** là bản LTS gần nhất [4].
JDK 27 ra mắt ngày 14/09/2026 nhưng không phải LTS, chỉ được hỗ trợ đến 03/2027 [5].
Spring Boot **4.0** (ra tháng 11/2025) yêu cầu tối thiểu Java 17, hỗ trợ đầy đủ
Java 25 và dùng Jakarta EE 11 [6].

---

## Chặng 1 — Learn the Basics

**Mục tiêu:** viết được chương trình console nhỏ, hiểu một file `.java` được biên
dịch rồi chạy trên JVM như thế nào.

| Chủ đề | Tài liệu chính |
|--------|----------------|
| Basic Syntax | Java Language Basics, dev.java [7] |
| Lifecycle of a Program (biên dịch → bytecode → JVM) | [3] `lifecycle-of-a-program` |
| Data Types, Variables and Scopes, Type Casting | Jenkov: Java Variables [8] |
| Strings and Methods, Math Operations | Jenkov: Java Strings [8] |
| Arrays, Conditionals, Loops | Jenkov: Java Arrays [8] |
| Basics of OOP (giới thiệu) | Jenkov: Java Classes [8] |

Khoá học được roadmap gợi ý cho cả nhánh: *Introduction to Java*, Hyperskill
(JetBrains Academy) [9].

**📚 Bài học chi tiết của chặng 1:**

1. [Cú pháp cơ bản](/docs/learning/chang-1/cu-phap-co-ban): Basic Syntax
2. [Vòng đời một chương trình Java](/docs/learning/chang-1/vong-doi-chuong-trinh): Lifecycle of a Program
3. [Kiểu dữ liệu, biến và ép kiểu](/docs/learning/chang-1/kieu-du-lieu-bien-ep-kieu): Data Types, Variables and Scopes, Type Casting
4. [Chuỗi và phép toán](/docs/learning/chang-1/chuoi-va-phep-toan): Strings and Methods, Math Operations
5. [Mảng, điều kiện và vòng lặp](/docs/learning/chang-1/mang-dieu-kien-vong-lap): Arrays, Conditionals, Loops
6. [Nhập môn lập trình hướng đối tượng](/docs/learning/chang-1/nhap-mon-oop): Basics of OOP
7. [Checkpoint: CLI tính lãi kép](/docs/learning/chang-1/checkpoint-lai-kep): bài tổng hợp

**✅ Checkpoint:** viết CLI tính lãi kép theo kỳ hạn, đọc input từ bàn phím và in ra
bảng kết quả. Giải thích được vì sao không nên dùng `double` cho tiền (gợi ý:
`BigDecimal`).

## Chặng 2 — Lập trình hướng đối tượng

Roadmap chia OOP làm hai khối [2].

**Basics of OOP:** Classes and Objects · Attributes and Methods · Access Specifiers ·
Static Keyword · Final Keyword · Nested Classes · Packages

**More about OOP:** Object Lifecycle · Inheritance · Abstraction · Method Chaining ·
Encapsulation · Interfaces · Enums · Record · Method Overloading / Overriding ·
Initializer Block · Static vs Dynamic Binding · Pass by Value / Pass by Reference

Tài liệu nổi bật:

- Bộ OOP của Jenkov (classes, inheritance, interfaces, enums, records) [8]
- Baeldung: *Java is Pass-by-Value* [10], *Static and Dynamic Binding* [11]

**📚 Bài học chi tiết của chặng 2:**

1. [Package và access modifier](/docs/learning/chang-2/package-va-access-modifier): Packages, Access Specifiers
2. [Đóng gói và method](/docs/learning/chang-2/dong-goi-va-method): Attributes and Methods, Encapsulation, Method Overloading, Method Chaining
3. [static, final và vòng đời object](/docs/learning/chang-2/static-final-vong-doi-object): Static Keyword, Final Keyword, Initializer Block, Object Lifecycle
4. [Kế thừa và ghi đè method](/docs/learning/chang-2/ke-thua-va-ghi-de): Inheritance, Method Overriding
5. [Trừu tượng và interface](/docs/learning/chang-2/truu-tuong-va-interface): Abstraction, Interfaces
6. [Binding và truyền tham số](/docs/learning/chang-2/binding-va-truyen-tham-so): Static vs Dynamic Binding, Pass by Value / Pass by Reference
7. [Enum, record và nested class](/docs/learning/chang-2/enum-record-nested-class): Enums, Record, Nested Classes
8. [Checkpoint: mô hình hoá tài khoản ngân hàng](/docs/learning/chang-2/checkpoint-mo-hinh-tai-khoan): bài tổng hợp

**✅ Checkpoint:** mô hình hoá `Account`, `SavingAccount`, `Transaction` (dùng `record`
cho dữ liệu bất biến và `enum` cho trạng thái giao dịch). Giải thích bằng lời: vì sao
Java luôn *pass-by-value*, kể cả khi truyền object?

## Chặng 3 — Ngôn ngữ nâng cao và Collections

**Các topic chính ở cột phải roadmap:** Exception Handling · Lambda Expressions ·
Annotations · Modules · Optionals [2]

**Collections:** Array vs ArrayList · Set · Map · Queue · Dequeue · Stack · Iterator ·
Generic Collections

Tài liệu nổi bật:

- Baeldung: *Guide To Optionals* [12]
- Jenkov: Lambda Expressions, Annotations, Modules, Java Collections [8]

**✅ Checkpoint:** viết một bộ xử lý sao kê. Gom giao dịch theo ngày bằng `Map`, lọc
bằng lambda, xử lý giao dịch lỗi bằng exception tự định nghĩa. Không được trả `null`
ra API công khai mà phải dùng `Optional`.

## Chặng 4 — Concurrency, I/O và các API chuẩn

**Concurrency:** Threads · volatile keyword · Java Memory Model · **Virtual Threads** [2]

**Các API chuẩn:** Cryptography · Date and Time · Networking · Regular Expressions ·
I/O Operations · File Operations · Dependency Injection

Tài liệu nổi bật:

- Jenkov: *Java Concurrency and Multithreading* và *Java Memory Model* [13]
- Netflix TechBlog: *Java 21 Virtual Threads — Dude, Where's My Lock?* [14], một case
  study thực tế về deadlock do virtual thread bị *pinning*
- Jenkov: *Java Cryptography* [15]
- Marco Behler: *How To Work With Files In Java* [16]

🏦 **Với Onward:** hai chủ đề **Cryptography** và **Date and Time** là bắt buộc nắm
chắc, không phải tùy chọn. Hãy luôn dùng `java.time` (`Instant`, `ZonedDateTime`)
và thống nhất múi giờ khi tính ngày giá trị giao dịch.

**✅ Checkpoint:** viết bộ chuyển tiền giữa hai tài khoản chạy song song 1.000 luồng.
Chứng minh bản chưa đồng bộ bị sai số dư, sửa lại để luôn đúng, rồi chạy lại bằng
virtual threads.

## Chặng 5 — Hệ sinh thái

Đây là chặng dài nhất. Roadmap.sh ghi rõ **"Spring Boot is recommended"** ở nhánh
Web Frameworks [2].

| Nhánh | Lựa chọn trong roadmap | Onward ưu tiên |
|-------|------------------------|----------------|
| Build Tools | Maven · Gradle · Bazel | Maven hoặc Gradle [17][18] |
| Web Frameworks | **Spring (Spring Boot)** · Quarkus · Javalin · Play Framework | Spring Boot [19] |
| Database Access | JDBC · EBean · Hibernate · Spring Data JPA | JDBC → Hibernate → Spring Data JPA [20][21] |
| Functional Programming | High Order Functions · Functional Interfaces · Functional Composition · Stream API | Cả bốn [22] |

Roadmap.sh có một roadmap riêng cho Spring Boot. Học xong chặng này thì nên đi
tiếp sang đó [23].

**Thứ tự học Database Access nên theo:** viết JDBC thuần trước để hiểu connection,
transaction và `PreparedStatement`. Sau đó mới học Hibernate/JPA. Hiểu tầng dưới thì
mới debug được vấn đề N+1 hay lazy loading.

**✅ Checkpoint:** viết REST API bằng Spring Boot cho tài khoản và giao dịch, chạy với
PostgreSQL và có transaction. Dùng Stream API cho các báo cáo tổng hợp.

## Chặng 6 — Logging, Documentation và Testing

**Logging Frameworks:** Logback · Log4j2 · SLF4J · TinyLog [24]
**Documentation:** Javadoc [25]
**Testing** [2]:

| Loại | Công cụ trong roadmap |
|------|------------------------|
| Unit Testing | JUnit [26] · TestNG [27] |
| Integration Testing | REST Assured [28] · JMeter [29] |
| Behavior Testing | Cucumber-JVM [30] |
| Mocking | Mockito [31] |

**✅ Checkpoint:** API của chặng 5 đạt test coverage ≥ 80% (theo chuẩn của team).
Log có cấu trúc qua SLF4J + Logback và **không log số tài khoản hay số thẻ đầy đủ**.

---

## 🏦 Phần Onward bổ sung (ngoài roadmap.sh)

Roadmap.sh dừng ở mức *Java developer*. Để làm được backend ngân hàng, bạn cần thêm
các mảng dưới đây. Phần này do Onward đề xuất, không trích từ [1]:

- **JVM tuning và GC:** heap, G1/ZGC, đọc thread dump và heap dump.
- **Bảo mật:** OWASP Top 10, Spring Security, quản lý secret.
- **Testcontainers:** chạy integration test với PostgreSQL thật.
- **Messaging:** Kafka cho kiến trúc event-driven.
- **Observability:** metrics, tracing (Spring Boot 4 có sẵn starter OpenTelemetry [6]).
- **Container:** Docker, cơ bản về Kubernetes.

## Cách dùng lộ trình

1. Học **theo chặng**. Bên trong một chặng có thể nhảy giữa các chủ đề.
2. Mỗi checkpoint là **một PR** và nhờ một người trong chapter review (xem
   [Văn hóa Code Review](/docs/workflow/code-review)).
3. Topic con nào roadmap liệt kê dưới dạng **lựa chọn thay thế** (Bazel, Javalin,
   Play, EBean, TinyLog) thì chỉ cần biết nó tồn tại, không cần học sâu.

## Nguồn tham khảo

1. roadmap.sh — *Java Developer Roadmap*. <https://roadmap.sh/java>
2. roadmap.sh — dữ liệu roadmap chính thức (nodes, bố cục, nhãn), cập nhật 2026-01-27. <https://roadmap.sh/api/v1-official-roadmap/java>
3. kamranahmedse/developer-roadmap — nội dung từng chủ đề của Java roadmap. <https://github.com/kamranahmedse/developer-roadmap/tree/master/roadmaps/java/content>
4. OpenJDK — JDK 25 (LTS). <https://openjdk.org/projects/jdk/25/>
5. InfoQ — *Java News Roundup*, 14/09/2026 (JDK 27 GA). <https://www.infoq.com/news/2026/09/java-news-roundup-sep14-2026/>
6. InfoQ — *Spring Framework 7 and Spring Boot 4*. <https://www.infoq.com/news/2025/11/spring-7-spring-boot-4>
7. dev.java — *Java Language Basics*. <https://dev.java/learn/language-basics>
8. Jakob Jenkov — *Java Tutorials*. <https://jenkov.com/tutorials/java/index.html>
9. Hyperskill — *Introduction to Java*. <https://hyperskill.org/tracks/8>
10. Baeldung — *Pass-By-Value as a Parameter Passing Mechanism in Java*. <https://www.baeldung.com/java-pass-by-value-or-pass-by-reference>
11. Baeldung — *Static and Dynamic Binding in Java*. <https://www.baeldung.com/java-static-dynamic-binding>
12. Baeldung — *Guide To Java Optional*. <https://www.baeldung.com/java-optional>
13. Jenkov — *Java Concurrency and Multithreading*. <https://jenkov.com/tutorials/java-concurrency/index.html>
14. Netflix TechBlog — *Java 21 Virtual Threads: Dude, Where's My Lock?* <https://netflixtechblog.com/java-21-virtual-threads-dude-wheres-my-lock-3052540e231d>
15. Jenkov — *Java Cryptography*. <https://jenkov.com/tutorials/java-cryptography/index.html>
16. Marco Behler — *How To Work With Files In Java*. <https://www.marcobehler.com/guides/java-files>
17. Apache Maven — *Getting Started Guide*. <https://maven.apache.org/guides/getting-started/>
18. Gradle. <https://gradle.org/>
19. Spring Boot. <https://spring.io/projects/spring-boot/>
20. Hibernate. <https://hibernate.org/>
21. Spring Data JPA. <https://spring.io/projects/spring-data-jpa>
22. Baeldung — *The Java Stream API Tutorial*. <https://www.baeldung.com/java-8-streams>
23. roadmap.sh — *Spring Boot Roadmap*. <https://roadmap.sh/spring-boot>
24. Baeldung — *Introduction to Java Logging*. <https://www.baeldung.com/java-logging-intro>
25. Oracle — *javadoc*. <https://docs.oracle.com/javase/8/docs/technotes/tools/windows/javadoc.html>
26. JUnit 5 User Guide. <https://junit.org/junit5/docs/current/user-guide/>
27. TestNG. <https://testng.org/>
28. REST Assured. <https://rest-assured.io/>
29. Apache JMeter. <https://jmeter.apache.org/>
30. Cucumber. <https://cucumber.io/docs/cucumber/>
31. Mockito. <https://site.mockito.org/>
