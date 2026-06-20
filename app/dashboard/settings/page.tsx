import { prisma } from '@/lib/db'
import { BackLink } from '../back-link'
import {
  DashboardPageHeader,
  DashboardSection,
  DashboardShell,
  SpotlightPanel,
} from '../dashboard-ui'
import {
  EmailSettings,
  SocialLinksManager,
  WorkExperienceManager,
} from './settings-forms'

export default async function SettingsPage() {
  const [emailSetting, socialLinks, workExperiences] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { key: 'email' } }),
    prisma.socialLink.findMany({ orderBy: { sortOrder: 'asc' } }),
    prisma.workExperience.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  return (
    <DashboardShell>
      <DashboardSection>
        <BackLink href="/dashboard" label="Dashboard" />
        <DashboardPageHeader
          title="Settings"
          description="Manage site profile, social links, and work experience."
        />
      </DashboardSection>

      <DashboardSection>
        <SpotlightPanel contentClassName="p-6">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            Contact
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Email shown on your portfolio site.
          </p>
          <div className="mt-4">
            <EmailSettings initialEmail={emailSetting?.value ?? ''} />
          </div>
        </SpotlightPanel>
      </DashboardSection>

      <DashboardSection>
        <SpotlightPanel contentClassName="p-6">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            Social links
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Links displayed in the footer and contact section.
          </p>
          <div className="mt-4">
            <SocialLinksManager initialLinks={socialLinks} />
          </div>
        </SpotlightPanel>
      </DashboardSection>

      <DashboardSection>
        <SpotlightPanel contentClassName="p-6">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            Work experience
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Employment history shown on the homepage.
          </p>
          <div className="mt-4">
            <WorkExperienceManager initialExperiences={workExperiences} />
          </div>
        </SpotlightPanel>
      </DashboardSection>
    </DashboardShell>
  )
}
