"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";

/**
 * Render Markdown đã đồng bộ (FR-03) + nhúng SVG/HTML thô & link tải tài liệu (FR-04).
 * rehypeRaw cho phép nhúng <svg> inline; remarkGfm hỗ trợ bảng/checklist (GFM — NFR-18).
 */
export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose-onward">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          a: ({ href, children, node: _node, ...props }) => {
            // Link nội bộ (/docs/...) dùng next/link để áp dụng basePath, trailingSlash & điều hướng client-side.
            const isInternal = !!href && href.startsWith("/") && !href.startsWith("//");
            const isDownload = /\.(pdf|docx?|xlsx?|zip|svg)$/i.test(href ?? "");
            if (isInternal && !isDownload) {
              return (
                <Link href={href} {...props}>
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={href}
                {...(isDownload ? { download: true } : {})}
                {...(href?.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                {...props}
              >
                {children}
                {isDownload ? " ⤓" : ""}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
