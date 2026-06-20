'use client'

import { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import { cn, slugify } from '@/lib/utils'
import { normalizeLessonMarkdown } from '@/lib/markdown-toc'

const viewerClassName =
  'tiptap prose prose-sm max-w-none dark:prose-invert prose-p:leading-relaxed prose-headings:group prose-headings:relative prose-headings:font-medium prose-headings:scroll-mt-24 prose-h2:mt-10 prose-h2:text-lg prose-h3:mt-6 prose-h3:text-base'

export type MarkdownViewerProps = {
  content: string
  className?: string
  normalizeSections?: boolean
  sectionBasePath?: string
}

function attachSectionAnchors(
  root: HTMLElement,
  sectionBasePath?: string,
) {
  root.querySelectorAll('h2, h3').forEach((heading) => {
    const text = heading.textContent ?? ''
    if (!text) {
      return
    }

    const id = slugify(text)
    heading.id = id

    if (heading.querySelector('.lesson-section-anchor')) {
      return
    }

    const anchor = document.createElement('a')
    anchor.href = sectionBasePath ? `${sectionBasePath}#${id}` : `#${id}`
    anchor.className =
      'lesson-section-anchor ml-2 text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400'
    anchor.setAttribute('aria-label', `Link to section: ${text}`)
    anchor.textContent = '#'

    heading.appendChild(anchor)
  })
}

export function MarkdownViewer({
  content,
  className,
  normalizeSections = false,
  sectionBasePath,
}: MarkdownViewerProps) {
  const displayContent = normalizeSections
    ? normalizeLessonMarkdown(content)
    : content

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({
        markedOptions: {
          gfm: true,
        },
      }),
    ],
    content: displayContent,
    contentType: 'markdown',
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: viewerClassName,
      },
    },
  })

  useEffect(() => {
    if (!editor) {
      return
    }

    const currentMarkdown = editor.getMarkdown()
    if (displayContent !== currentMarkdown) {
      editor.commands.setContent(displayContent, {
        contentType: 'markdown',
        emitUpdate: false,
      })
    }
  }, [displayContent, editor])

  useEffect(() => {
    if (!editor) {
      return
    }

    attachSectionAnchors(editor.view.dom, sectionBasePath)

    const hash = window.location.hash.slice(1)
    if (!hash) {
      return
    }

    const scrollToHash = () => {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' })
    }

    const timer = window.setTimeout(scrollToHash, 50)
    return () => window.clearTimeout(timer)
  }, [editor, displayContent, sectionBasePath])

  if (!editor) {
    return <div className={cn('min-h-24', className)} />
  }

  return (
    <div className={cn('w-full', className)}>
      <EditorContent editor={editor} />
    </div>
  )
}
