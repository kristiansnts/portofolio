'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { getLessonSectionHref, type MarkdownHeading } from '@/lib/markdown-toc'

type ClassTocProps = {
  classSlug: string
  sessionSlug: string
  headings: MarkdownHeading[]
}

const SCROLL_OFFSET = 96

function getActiveHeadingId(headings: MarkdownHeading[]) {
  const scrollPosition = window.scrollY + SCROLL_OFFSET

  let activeId = headings[0]?.id ?? ''

  for (const heading of headings) {
    const element = document.getElementById(heading.id)
    if (element && element.offsetTop <= scrollPosition) {
      activeId = heading.id
    }
  }

  return activeId
}

export function ClassToc({ classSlug, sessionSlug, headings }: ClassTocProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) {
      return
    }

    const updateActiveId = () => {
      setActiveId(getActiveHeadingId(headings))
    }

    const hash = window.location.hash.slice(1)
    if (hash && headings.some((heading) => heading.id === hash)) {
      setActiveId(hash)
    } else {
      updateActiveId()
    }

    window.addEventListener('scroll', updateActiveId, { passive: true })
    window.addEventListener('hashchange', updateActiveId)

    return () => {
      window.removeEventListener('scroll', updateActiveId)
      window.removeEventListener('hashchange', updateActiveId)
    }
  }, [headings])

  if (headings.length === 0) {
    return null
  }

  return (
    <nav>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        On this page
      </p>
      <ul className="relative border-l border-zinc-200 dark:border-zinc-800">
        {headings.map((heading) => {
          const href = getLessonSectionHref(classSlug, sessionSlug, heading.id)
          const isActive = activeId === heading.id

          return (
            <li key={heading.id}>
              <a
                href={href}
                className={cn(
                  'block border-l-[3px] py-1.5 pl-3 text-sm transition-all duration-200 -ml-px',
                  heading.level === 3 && 'pl-5',
                  isActive
                    ? 'border-zinc-900 font-medium text-zinc-900 dark:border-zinc-50 dark:text-zinc-50'
                    : 'border-transparent text-zinc-500 hover:border-zinc-300 hover:text-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200',
                )}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
