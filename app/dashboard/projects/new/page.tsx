'use client'

import { useRouter } from 'next/navigation'
import { BackLink } from '../../back-link'
import {
  DashboardPageHeader,
  DashboardSection,
  DashboardShell,
  SpotlightPanel,
} from '../../dashboard-ui'
import { ProjectForm } from '../project-form'

export default function NewProjectPage() {
  const router = useRouter()

  async function handleSubmit(
    data: Parameters<Parameters<typeof ProjectForm>[0]['onSubmit']>[0],
  ) {
    const response = await fetch('/api/dashboard/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const result = await response.json()
      throw new Error(result.error ?? 'Failed to create project')
    }

    router.push('/dashboard/projects')
    router.refresh()
  }

  return (
    <DashboardShell>
      <DashboardSection>
        <BackLink href="/dashboard/projects" label="Projects" />
        <DashboardPageHeader
          title="New project"
          description="Add a new project to your portfolio."
        />
      </DashboardSection>

      <DashboardSection>
        <SpotlightPanel contentClassName="p-6">
          <ProjectForm submitLabel="Create project" onSubmit={handleSubmit} />
        </SpotlightPanel>
      </DashboardSection>
    </DashboardShell>
  )
}
