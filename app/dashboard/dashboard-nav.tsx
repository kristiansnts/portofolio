'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { TextEffect } from '@/components/ui/text-effect'

type DashboardNavProps = {
  email: string
  role: string
}

export function DashboardNav({ email, role }: DashboardNavProps) {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const isSettings = pathname.startsWith('/dashboard/settings')

  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link href="/dashboard" className="font-medium text-black dark:text-white">
          Dashboard
        </Link>
      </div>
      <div className="flex items-center rounded-full bg-zinc-100 p-1 text-sm dark:bg-zinc-800">
        <Link
          href="/dashboard/settings"
          className={`rounded-full px-3 py-1 transition-colors duration-200 ${
            isSettings
              ? 'bg-white font-medium text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50'
              : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          Settings
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full px-3 py-1 text-zinc-500 transition-colors duration-200 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          Logout
        </button>
      </div>
    </header>
  )
}
