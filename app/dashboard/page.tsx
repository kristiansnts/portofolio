import { prisma } from '@/lib/db'
import { getSession } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getSession()

  const [projectCount, blogCount, experienceCount, userCount] =
    await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.workExperience.count(),
      prisma.user.count(),
    ])

  return (
    <div>
      <h1 className="text-2xl font-medium text-zinc-900 dark:text-zinc-50">
        Welcome{session?.name ? `, ${session.name}` : ''}
      </h1>
      <p className="mt-2 text-zinc-500">
        Manage your portfolio content from here.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          { label: 'Projects', value: projectCount },
          { label: 'Blog posts', value: blogCount },
          { label: 'Work experience', value: experienceCount },
          { label: 'Users', value: userCount },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <p className="text-sm text-zinc-500">{item.label}</p>
            <p className="mt-1 text-3xl font-medium text-zinc-900 dark:text-zinc-50">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
