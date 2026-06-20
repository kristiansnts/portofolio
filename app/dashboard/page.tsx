import { prisma } from '@/lib/db'
import { DashboardOverview } from './dashboard-overview'
import { DashboardSection, DashboardShell } from './dashboard-ui'

export default async function DashboardPage() {
  const projectCount = await prisma.project.count()

  return (
    <DashboardShell>
      <DashboardSection>
        <DashboardOverview projectCount={projectCount} />
      </DashboardSection>
    </DashboardShell>
  )
}
