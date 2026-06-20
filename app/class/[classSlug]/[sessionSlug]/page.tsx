import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ClassDocsShell } from '@/components/class/class-docs-shell'
import { ClassSessionView } from '@/components/class/class-session-view'
import { extractMarkdownHeadings } from '@/lib/markdown-toc'
import {
  getPublishedClassSession,
  getPublishedClassWithSessions,
} from '@/lib/queries'

type ClassSessionPageProps = {
  params: Promise<{
    classSlug: string
    sessionSlug: string
  }>
}

export async function generateMetadata({
  params,
}: ClassSessionPageProps): Promise<Metadata> {
  const { classSlug, sessionSlug } = await params
  const session = await getPublishedClassSession(classSlug, sessionSlug)

  if (!session) {
    return {
      title: 'Session not found',
    }
  }

  return {
    title: `${session.title} — ${session.class.name}`,
    description: session.description,
  }
}

export default async function ClassSessionPage({ params }: ClassSessionPageProps) {
  const { classSlug, sessionSlug } = await params
  const [session, classData] = await Promise.all([
    getPublishedClassSession(classSlug, sessionSlug),
    getPublishedClassWithSessions(classSlug),
  ])

  if (!session || !classData) {
    notFound()
  }

  const headings = extractMarkdownHeadings(session.content)

  return (
    <ClassDocsShell
      classSlug={classSlug}
      sessionSlug={sessionSlug}
      courseName={classData.name}
      sessions={classData.sessions}
      activeSessionSlug={sessionSlug}
      headings={headings}
      wiki={session.wiki}
    >
      <ClassSessionView
        title={session.title}
        description={session.description}
        content={session.content}
        classSlug={classSlug}
        sessionSlug={sessionSlug}
      />
    </ClassDocsShell>
  )
}
