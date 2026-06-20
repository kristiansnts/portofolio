'use client'

import { useRouter } from 'next/navigation'
import { BackLink } from '../../../back-link'
import {
  DashboardPageHeader,
  DashboardSection,
  DashboardShell,
  SpotlightPanel,
} from '../../../dashboard-ui'
import { ProjectForm } from '../../project-form'

type EditProjectFormProps = {
  project: {
    id: string
    slug: string
    name: string
    description: string
    descriptionEn: string
    link: string
    photos: string[]
    client: string
    totalUsers: string
    published: boolean
    sortOrder: number
  }
}

export function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter()

  async function handleSubmit(
    data: Parameters<Parameters<typeof ProjectForm>[0]['onSubmit']>[0],
  ) {
    const response = await fetch(`/api/dashboard/projects/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error ?? 'Failed to update project')
    }

    router.push('/dashboard/projects')
    router.refresh()
  }

  return (
    <DashboardShell>
      <DashboardSection>
        <BackLink href="/dashboard/projects" label="Projects" />
        <DashboardPageHeader title="Edit project" description={project.name} />
      </DashboardSection>

      <DashboardSection>
        <SpotlightPanel contentClassName="p-6">
          <ProjectForm
            initial={project}
            submitLabel="Save changes"
            onSubmit={handleSubmit}
          />
        </SpotlightPanel>
      </DashboardSection>
    </DashboardShell>
  )
}
