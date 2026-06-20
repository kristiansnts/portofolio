'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Trash2Icon } from 'lucide-react'
import { SpotlightPanel } from '../dashboard-ui'

type Project = {
  id: string
  name: string
  slug: string
  published: boolean
  sortOrder: number
}

type ProjectListProps = {
  projects: Project[]
}

export function ProjectList({ projects }: ProjectListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return

    setDeletingId(id)

    try {
      const response = await fetch(`/api/dashboard/projects/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        alert('Failed to delete project')
        return
      }

      router.refresh()
    } finally {
      setDeletingId(null)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl bg-zinc-50/40 p-8 text-center ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No projects yet.</p>
        <Link
          href="/dashboard/projects/new"
          className="font-base mt-3 inline-block text-sm font-[450] text-zinc-900 dark:text-zinc-50"
        >
          Create your first project →
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-2">
      {projects.map((project) => (
        <SpotlightPanel key={project.id}>
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate font-normal text-zinc-900 dark:text-zinc-100">
                {project.name}
              </p>
              <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                {project.slug} · order {project.sortOrder}
                {!project.published ? ' · draft' : ''}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link
                href={`/dashboard/projects/${project.id}/edit`}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(project.id, project.name)}
                disabled={deletingId === project.id}
                className="rounded-full bg-zinc-100 p-1.5 text-zinc-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:bg-zinc-800 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                aria-label={`Delete ${project.name}`}
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          </div>
        </SpotlightPanel>
      ))}
    </div>
  )
}
