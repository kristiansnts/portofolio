'use client'
import { motion } from 'motion/react'
import Link from 'next/link'
import { PROJECTS } from '../data'
import { useLanguage } from '@/lib/language-context'
import { translations } from '@/lib/translations'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const VARIANTS_ROW = {
  hidden: { opacity: 0, y: 12, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export default function ProjectsPage() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <motion.main
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← Back
        </Link>
        <h2 className="text-lg font-medium">{t.allProjects}</h2>
      </div>

      <div className="overflow-hidden rounded-2xl ring-1 ring-zinc-200/50 dark:ring-zinc-800/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200/50 bg-zinc-50/60 dark:border-zinc-800/50 dark:bg-zinc-900/40">
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                Project
              </th>
              <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">
                {t.client}
              </th>
              <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">
                {t.totalUsers}
              </th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((project, i) => (
              <motion.tr
                key={project.id}
                variants={VARIANTS_ROW}
                className={`group transition-colors hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 ${
                  i < PROJECTS.length - 1
                    ? 'border-b border-zinc-200/50 dark:border-zinc-800/50'
                    : ''
                }`}
              >
                <td className="px-4 py-3">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[450] text-zinc-900 underline-offset-2 hover:underline dark:text-zinc-50"
                  >
                    {project.name}
                  </a>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {language === 'en' ? project.descriptionEn : project.description}
                  </p>
                </td>
                <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                  {project.client}
                </td>
                <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                  {project.totalUsers}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.main>
  )
}
