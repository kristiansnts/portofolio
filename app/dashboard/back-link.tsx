import Link from 'next/link'

type BackLinkProps = {
  href: string
  label?: string
}

export function BackLink({ href, label = 'Back' }: BackLinkProps) {
  return (
    <Link
      href={href}
      className="mb-6 inline-block text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      ← {label}
    </Link>
  )
}
