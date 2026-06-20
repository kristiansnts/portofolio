import Link from 'next/link'

type ClassHeaderProps = {
  courseName: string
  classSlug: string
}

export function ClassHeader({ courseName, classSlug }: ClassHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-900 dark:text-zinc-50"
          >
            Kristian Santoso
          </Link>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {courseName}
          </span>
        </div>
        <Link
          href={`/class/${classSlug}`}
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          All sessions
        </Link>
      </div>
    </header>
  )
}
