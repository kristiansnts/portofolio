'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { Spotlight } from '@/components/ui/spotlight'
import { cn } from '@/lib/utils'
import {
  TRANSITION_SECTION,
  VARIANTS_CONTAINER,
  VARIANTS_SECTION,
} from './motion'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      className="space-y-6"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.main>
  )
}

export function DashboardSection({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.section
      className={className}
      variants={VARIANTS_SECTION}
      transition={TRANSITION_SECTION}
    >
      {children}
    </motion.section>
  )
}

export function DashboardPageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  )
}

type SpotlightPanelProps = {
  children: React.ReactNode
  className?: string
  contentClassName?: string
  href?: string
  onClick?: () => void
}

export function SpotlightPanel({
  children,
  className,
  contentClassName,
  href,
  onClick,
}: SpotlightPanelProps) {
  const inner = (
    <>
      <Spotlight
        className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50"
        size={64}
      />
      <div
        className={cn(
          'relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950',
          contentClassName,
        )}
      >
        {children}
      </div>
    </>
  )

  const panelClassName = cn(
    'relative block overflow-hidden rounded-2xl bg-zinc-300/30 p-[2px] dark:bg-zinc-600/30',
    className,
  )

  if (href) {
    return (
      <Link href={href} className={panelClassName}>
        {inner}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={panelClassName}>
        {inner}
      </button>
    )
  }

  return <div className={panelClassName}>{inner}</div>
}
