import { MarkdownViewer } from '@/components/editor/markdown-viewer'
import { cn } from '@/lib/utils'

export type ClassSessionViewProps = {
  title: string
  description: string
  content: string
  classSlug: string
  sessionSlug: string
  className?: string
}

export function ClassSessionView({
  title,
  description,
  content,
  classSlug,
  sessionSlug,
  className,
}: ClassSessionViewProps) {
  const sectionBasePath = `/class/${classSlug}/${sessionSlug}`

  return (
    <article className={cn('min-w-0', className)}>
      <header className="mb-8 space-y-3 border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        <p className="text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </header>

      <MarkdownViewer
        content={content}
        className="class-lesson-content"
        normalizeSections
        sectionBasePath={sectionBasePath}
      />
    </article>
  )
}
