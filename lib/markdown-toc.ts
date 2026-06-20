import { slugify } from '@/lib/utils'

export type MarkdownHeading = {
  level: number
  text: string
  id: string
}

const BOLD_SECTION_PATTERN = /^\*\*(.+?)\*\*\s*$/
const MARKDOWN_HEADING_PATTERN = /^(#{2,3})\s+(.+)$/

export function normalizeLessonMarkdown(markdown: string): string {
  return markdown
    .split('\n')
    .map((line) => {
      const boldMatch = line.match(BOLD_SECTION_PATTERN)
      if (boldMatch) {
        return `## ${boldMatch[1].trim()}`
      }

      return line
    })
    .join('\n')
}

export function extractMarkdownHeadings(markdown: string): MarkdownHeading[] {
  const normalized = normalizeLessonMarkdown(markdown)
  const headings: MarkdownHeading[] = []

  for (const line of normalized.split('\n')) {
    const match = line.match(MARKDOWN_HEADING_PATTERN)
    if (!match) {
      continue
    }

    const text = match[2].replace(/\*\*/g, '').trim()
    headings.push({
      level: match[1].length,
      text,
      id: slugify(text),
    })
  }

  return headings
}

export function getLessonSectionHref(
  classSlug: string,
  sessionSlug: string,
  sectionId: string,
) {
  return `/class/${classSlug}/${sessionSlug}#${sectionId}`
}
