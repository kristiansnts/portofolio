import Link from 'next/link'
import { prisma } from '@/lib/db'
import { BackLink } from '../back-link'
import {
  DashboardPageHeader,
  DashboardSection,
  DashboardShell,
} from '../dashboard-ui'
import { ProjectList } from './project-list'

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      published: true,
      sortOrder: true,
    },
  })

  return (
    <DashboardShell>
      <DashboardSection>
        <BackLink href="/dashboard" label="Dashboard" />
        <DashboardPageHeader
          title="Projects"
          description="Create, edit, and manage portfolio projects."
          action={
            <Link
              href="/dashboard/projects/new"
              className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              New project
            </Link>
          }
        />
      </DashboardSection>

      <DashboardSection>
        <ProjectList projects={projects} />
      </DashboardSection>
    </DashboardShell>
  )
}
