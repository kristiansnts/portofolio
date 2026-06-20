import { ClassHeader } from '@/components/class/class-header'
import { ClassRightSidebar } from '@/components/class/class-right-sidebar'
import {
  ClassSidebar,
  type ClassSidebarSession,
} from '@/components/class/class-sidebar'
import type { MarkdownHeading } from '@/lib/markdown-toc'

type ClassDocsShellProps = {
  classSlug: string
  sessionSlug: string
  courseName: string
  sessions: ClassSidebarSession[]
  activeSessionSlug: string
  headings: MarkdownHeading[]
  wiki: string
  children: React.ReactNode
}

export function ClassDocsShell({
  classSlug,
  sessionSlug,
  courseName,
  sessions,
  activeSessionSlug,
  headings,
  wiki,
  children,
}: ClassDocsShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <ClassHeader courseName={courseName} classSlug={classSlug} />

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:py-10">
        <div className="grid grid-cols-1 gap-10 xl:grid-cols-[220px_minmax(0,1fr)_260px] xl:gap-12">
          <ClassSidebar
            classSlug={classSlug}
            courseName={courseName}
            sessions={sessions}
            activeSessionSlug={activeSessionSlug}
          />

          <main className="min-w-0">{children}</main>

          <ClassRightSidebar
            classSlug={classSlug}
            sessionSlug={sessionSlug}
            headings={headings}
            wiki={wiki}
          />
        </div>
      </div>
    </div>
  )
}
