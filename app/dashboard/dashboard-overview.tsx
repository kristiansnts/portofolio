'use client'

import { FolderKanbanIcon, SettingsIcon } from 'lucide-react'
import { DashboardPageHeader, SpotlightPanel } from './dashboard-ui'

type DashboardOverviewProps = {
  projectCount: number
}

export function DashboardOverview({ projectCount }: DashboardOverviewProps) {
  return (
    <div>
      <DashboardPageHeader
        title="Overview"
        description="Manage your portfolio content from here."
      />

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <SpotlightPanel href="/dashboard/projects">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-normal text-zinc-900 dark:text-zinc-100">
                Projects
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Create, edit, and publish portfolio projects.
              </p>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {projectCount} project{projectCount === 1 ? '' : 's'}
              </p>
            </div>
            <FolderKanbanIcon className="size-5 shrink-0 text-zinc-400" />
          </div>
        </SpotlightPanel>

        <SpotlightPanel href="/dashboard/settings">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-normal text-zinc-900 dark:text-zinc-100">
                Settings
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Update contact email, social links, and work experience.
              </p>
            </div>
            <SettingsIcon className="size-5 shrink-0 text-zinc-400" />
          </div>
        </SpotlightPanel>
      </div>
    </div>
  )
}
