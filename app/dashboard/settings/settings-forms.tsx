'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PencilIcon, Trash2Icon, XIcon, CheckIcon } from 'lucide-react'

const inputClassName =
  'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900/10 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-100/10'

const labelClassName =
  'mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300'

type EmailSettingsProps = {
  initialEmail: string
}

export function EmailSettings({ initialEmail }: EmailSettingsProps) {
  const router = useRouter()
  const [email, setEmail] = useState(initialEmail)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    const response = await fetch('/api/dashboard/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    setLoading(false)

    if (!response.ok) {
      setMessage('Failed to save email')
      return
    }

    setMessage('Email saved')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="email" className={labelClassName}>
          Contact email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClassName}
          required
        />
      </div>
      {message ? (
        <p className="text-sm text-zinc-500">{message}</p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {loading ? 'Saving...' : 'Save email'}
      </button>
    </form>
  )
}

type SocialLink = {
  id: string
  label: string
  link: string
  sortOrder: number
}

type SocialLinksManagerProps = {
  initialLinks: SocialLink[]
}

export function SocialLinksManager({ initialLinks }: SocialLinksManagerProps) {
  const router = useRouter()
  const [links, setLinks] = useState(initialLinks)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ label: '', link: '', sortOrder: 0 })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLinks(initialLinks)
  }, [initialLinks])

  function resetForm() {
    setForm({ label: '', link: '', sortOrder: links.length })
    setEditingId(null)
  }

  function startEdit(link: SocialLink) {
    setEditingId(link.id)
    setForm({
      label: link.label,
      link: link.link,
      sortOrder: link.sortOrder,
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const isEditing = editingId !== null
    const url = isEditing
      ? `/api/dashboard/social-links/${editingId}`
      : '/api/dashboard/social-links'
    const method = isEditing ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (!response.ok) {
      alert('Failed to save social link')
      return
    }

    resetForm()
    router.refresh()
  }

  async function handleDelete(id: string, label: string) {
    if (!confirm(`Delete "${label}"?`)) return

    const response = await fetch(`/api/dashboard/social-links/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      alert('Failed to delete social link')
      return
    }

    if (editingId === id) resetForm()
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {links.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-zinc-500">
            No social links yet.
          </p>
        ) : (
          links.map((link) => (
            <div
              key={link.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {link.label}
                </p>
                <p className="truncate text-sm text-zinc-500">{link.link}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(link)}
                  className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label={`Edit ${link.label}`}
                >
                  <PencilIcon className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(link.id, link.label)}
                  className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                  aria-label={`Delete ${link.label}`}
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {editingId ? 'Edit link' : 'Add link'}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="social-label" className={labelClassName}>
              Label
            </label>
            <input
              id="social-label"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className={inputClassName}
              placeholder="Github"
              required
            />
          </div>
          <div>
            <label htmlFor="social-link" className={labelClassName}>
              URL
            </label>
            <input
              id="social-link"
              type="url"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className={inputClassName}
              placeholder="https://github.com/..."
              required
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <CheckIcon className="size-3.5" />
            {loading ? 'Saving...' : editingId ? 'Update' : 'Add'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <XIcon className="size-3.5" />
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </div>
  )
}

type WorkExperience = {
  id: string
  company: string
  title: string
  start: string
  end: string
  link: string
  sortOrder: number
}

type WorkExperienceManagerProps = {
  initialExperiences: WorkExperience[]
}

export function WorkExperienceManager({
  initialExperiences,
}: WorkExperienceManagerProps) {
  const router = useRouter()
  const [experiences, setExperiences] = useState(initialExperiences)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    company: '',
    title: '',
    start: '',
    end: '',
    link: '',
    sortOrder: 0,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setExperiences(initialExperiences)
  }, [initialExperiences])

  function resetForm() {
    setForm({
      company: '',
      title: '',
      start: '',
      end: '',
      link: '',
      sortOrder: experiences.length,
    })
    setEditingId(null)
  }

  function startEdit(exp: WorkExperience) {
    setEditingId(exp.id)
    setForm({
      company: exp.company,
      title: exp.title,
      start: exp.start,
      end: exp.end,
      link: exp.link,
      sortOrder: exp.sortOrder,
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    const isEditing = editingId !== null
    const url = isEditing
      ? `/api/dashboard/work-experience/${editingId}`
      : '/api/dashboard/work-experience'
    const method = isEditing ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (!response.ok) {
      alert('Failed to save work experience')
      return
    }

    resetForm()
    router.refresh()
  }

  async function handleDelete(id: string, company: string) {
    if (!confirm(`Delete "${company}"?`)) return

    const response = await fetch(`/api/dashboard/work-experience/${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      alert('Failed to delete work experience')
      return
    }

    if (editingId === id) resetForm()
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
        {experiences.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-zinc-500">
            No work experience yet.
          </p>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {exp.title} · {exp.company}
                </p>
                <p className="text-sm text-zinc-500">
                  {exp.start} – {exp.end}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => startEdit(exp)}
                  className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  aria-label={`Edit ${exp.company}`}
                >
                  <PencilIcon className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(exp.id, exp.company)}
                  className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
                  aria-label={`Delete ${exp.company}`}
                >
                  <Trash2Icon className="size-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800"
      >
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
          {editingId ? 'Edit experience' : 'Add experience'}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="exp-company" className={labelClassName}>
              Company
            </label>
            <input
              id="exp-company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className={inputClassName}
              required
            />
          </div>
          <div>
            <label htmlFor="exp-title" className={labelClassName}>
              Title
            </label>
            <input
              id="exp-title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClassName}
              required
            />
          </div>
          <div>
            <label htmlFor="exp-start" className={labelClassName}>
              Start
            </label>
            <input
              id="exp-start"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
              className={inputClassName}
              placeholder="Jan 2025"
            />
          </div>
          <div>
            <label htmlFor="exp-end" className={labelClassName}>
              End
            </label>
            <input
              id="exp-end"
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
              className={inputClassName}
              placeholder="Present"
            />
          </div>
        </div>
        <div>
          <label htmlFor="exp-link" className={labelClassName}>
            Link
          </label>
          <input
            id="exp-link"
            type="url"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className={inputClassName}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <CheckIcon className="size-3.5" />
            {loading ? 'Saving...' : editingId ? 'Update' : 'Add'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <XIcon className="size-3.5" />
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </div>
  )
}
