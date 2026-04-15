'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'
import { useLanguage } from '@/lib/language-context'

export function Header() {
  const { language, setLanguage } = useLanguage()

  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link href="/" className="font-medium text-black dark:text-white">
          Kristian Santoso
        </Link>
        <TextEffect
          as="p"
          preset="fade"
          per="char"
          className="text-zinc-600 dark:text-zinc-500"
          delay={0.5}
        >
          Software Engineer
        </TextEffect>
      </div>
      <div className="flex items-center rounded-full bg-zinc-100 p-1 text-sm dark:bg-zinc-800">
        <button
          onClick={() => setLanguage('id')}
          className={`rounded-full px-3 py-1 transition-colors duration-200 ${
            language === 'id'
              ? 'bg-white font-medium text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50'
              : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          ID
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`rounded-full px-3 py-1 transition-colors duration-200 ${
            language === 'en'
              ? 'bg-white font-medium text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-50'
              : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          EN
        </button>
      </div>
    </header>
  )
}
