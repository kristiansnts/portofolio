'use client'

import { useEffect, type CSSProperties } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Markdown } from '@tiptap/markdown'
import { cn } from '@/lib/utils'

const editorClassName =
  'tiptap prose prose-sm max-w-none dark:prose-invert w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900/10 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-100/10'

export type MarkdownEditorProps = {
  content?: string
  onChange?: (markdown: string) => void
  editable?: boolean
  placeholder?: string
  className?: string
}

export function MarkdownEditor({
  content = '',
  onChange,
  editable = true,
  placeholder = 'Start writing...',
  className,
}: MarkdownEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({
        markedOptions: {
          gfm: true,
        },
      }),
    ],
    content,
    contentType: 'markdown',
    editable,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: editorClassName,
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.(currentEditor.getMarkdown())
    },
  })

  useEffect(() => {
    if (!editor) {
      return
    }

    const currentMarkdown = editor.getMarkdown()
    if (content !== currentMarkdown) {
      editor.commands.setContent(content, {
        contentType: 'markdown',
        emitUpdate: false,
      })
    }
  }, [content, editor])

  useEffect(() => {
    if (!editor) {
      return
    }

    editor.setEditable(editable)
  }, [editable, editor])

  if (!editor) {
    return (
      <div
        className={cn(
          'min-h-48 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950',
          className,
        )}
      />
    )
  }

  return (
    <div
      className={cn('w-full', className)}
      style={{ '--markdown-editor-placeholder': `"${placeholder}"` } as CSSProperties}
    >
      <EditorContent editor={editor} />
    </div>
  )
}
