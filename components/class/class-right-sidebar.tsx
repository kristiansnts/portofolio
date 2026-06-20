'use client'

import { MarkdownViewer } from '@/components/editor/markdown-viewer'
import { ClassToc } from '@/components/class/class-toc'
import type { MarkdownHeading } from '@/lib/markdown-toc'

type ClassRightSidebarProps = {
  classSlug: string
  sessionSlug: string
  headings: MarkdownHeading[]
  wiki: string
}

export function ClassRightSidebar({
  classSlug,
  sessionSlug,
  headings,
  wiki,
}: ClassRightSidebarProps) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-20 space-y-8">
        <ClassToc
          classSlug={classSlug}
          sessionSlug={sessionSlug}
          headings={headings}
        />

        {wiki.trim() ? (
          <section>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              Wiki
            </p>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
              <MarkdownViewer
                content={wiki}
                className="class-wiki-content text-sm"
              />
            </div>
          </section>
        ) : null}
      </div>
    </aside>
  )
}
