import { getNav } from "@/lib/content";
import { DocsSidebar } from "@/components/DocsSidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nav = getNav();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <div className="flex gap-8 py-8 lg:py-10">
        <aside className="hidden w-64 flex-none lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2">
            <DocsSidebar nav={nav} />
          </div>
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
