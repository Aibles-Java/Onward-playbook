"use client";

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
          a: ({ href, children, ...props }) => {
            const isDownload = /\.(pdf|docx?|xlsx?|zip|svg)$/i.test(href ?? "");
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
