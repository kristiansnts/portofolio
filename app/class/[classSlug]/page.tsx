import { notFound, redirect } from 'next/navigation'
import { getPublishedClassWithSessions } from '@/lib/queries'

type ClassIndexPageProps = {
  params: Promise<{
    classSlug: string
  }>
}

export default async function ClassIndexPage({ params }: ClassIndexPageProps) {
  const { classSlug } = await params
  const classData = await getPublishedClassWithSessions(classSlug)

  if (!classData) {
    notFound()
  }

  const firstSession = classData.sessions[0]

  if (!firstSession) {
    notFound()
  }

  redirect(`/class/${classSlug}/${firstSession.slug}`)
}
