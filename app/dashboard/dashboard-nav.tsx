'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

type DashboardNavProps = {
  email: string
  role: string
}

export function DashboardNav({ email, role }: DashboardNavProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header className="mb-8 flex items-center justify-between border-b border-zinc-200 pb-6 dark:border-zinc-800">
      <div>
        <Link
          href="/dashboard"
          className="text-lg font-medium text-zinc-900 dark:text-zinc-50"
        >
          Dashboard
        </Link>
        <p className="text-sm text-zinc-500">
          {email} · {role}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          View site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
