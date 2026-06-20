import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { EditProjectForm } from './edit-project-form'

type EditProjectPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id } })

  if (!project) {
    notFound()
  }

  return <EditProjectForm project={project} />
}
