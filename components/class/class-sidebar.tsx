import Link from 'next/link'
import { cn } from '@/lib/utils'

export type ClassSidebarSession = {
  slug: string
  title: string
}

type ClassSidebarProps = {
  classSlug: string
  courseName: string
  sessions: ClassSidebarSession[]
  activeSessionSlug: string
}

export function ClassSidebar({
  classSlug,
  courseName,
  sessions,
  activeSessionSlug,
}: ClassSidebarProps) {
  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-20 space-y-6">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            {courseName}
          </p>
          <ul className="space-y-0.5">
            {sessions.map((session) => {
              const isActive = session.slug === activeSessionSlug
              const label = session.title.replace(/^\*\*|\*\*$/g, '')

              return (
                <li key={session.slug}>
                  <Link
                    href={`/class/${classSlug}/${session.slug}`}
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50',
                    )}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
    </aside>
  )
}
