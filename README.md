# Onward Playbook

Sổ tay onboarding cho **dev** của hệ thống **Onward — Digital Banking**.
Giống như bản hướng dẫn trò chơi cho người lần đầu vào cuộc: cài môi trường → nắm
quy trình → hiểu design system → hiểu kiến trúc.

> "Your money, moving forward." · Onward, always.

## Công nghệ

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** với design token của Onward (màu, typography, spacing/radius)
- **Be Vietnam Pro** (font tiếng Việt) qua `next/font`
- Nội dung **Docs-as-Code**: Markdown trong `content/`, render bằng `react-markdown`
  (GFM + nhúng SVG inline)

## Chạy dự án

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build production
npm start        # chạy bản build
```

## Cấu trúc

```
app/            # routes (App Router)
  page.tsx        · trang chủ (game-guide intro)
  docs/           · cẩm nang (sidebar + render Markdown)
  search/         · tìm kiếm tài liệu + thuật ngữ (UC_Search)
  glossary/       · từ điển thuật ngữ
  admin/users/    · quản lý người dùng & phân quyền (UC_ManageUsers)
  login/          · đăng nhập
components/     # Navbar, Sidebar, Logo, MarkdownRenderer…
content/        # nội dung Markdown (nguồn Docs-as-Code)
lib/            # content, search, glossary, users
docs/           # đặc tả: mục tiêu, yêu cầu chức năng & phi chức năng
tailwind.config.ts  # design token Onward
```

## Ánh xạ use case → tính năng

| Use case | Nơi hiện thực |
|----------|---------------|
| UC_Sync — đồng bộ & hiển thị Markdown | `lib/content.ts`, `app/docs/**` |
| UC_ImportAsset — nhúng SVG & tài liệu đính kèm | `components/MarkdownRenderer.tsx` |
| UC_Search — tìm kiếm & tra cứu thuật ngữ | `lib/search.ts`, `app/search`, `app/glossary` |
| UC_ManageUsers — quản lý người dùng & phân quyền | `app/admin/users` |

Đặc tả chi tiết: xem thư mục [`docs/`](./docs).
