'use client'

import { FormEvent, useState } from 'react'
import { slugify } from '@/lib/utils'

const inputClassName =
  'w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none ring-zinc-900/10 transition focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-100/10'

const labelClassName =
  'mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300'

export type ProjectFormData = {
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

type ProjectFormProps = {
  initial?: Partial<ProjectFormData & { photos: string[] }>
  submitLabel: string
  onSubmit: (data: ProjectFormData) => Promise<void>
}

export function ProjectForm({
  initial,
  submitLabel,
  onSubmit,
}: ProjectFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [descriptionEn, setDescriptionEn] = useState(
    initial?.descriptionEn ?? '',
  )
  const [link, setLink] = useState(initial?.link ?? '')
  const [photos, setPhotos] = useState(
    initial?.photos?.join('\n') ?? '',
  )
  const [client, setClient] = useState(initial?.client ?? '')
  const [totalUsers, setTotalUsers] = useState(initial?.totalUsers ?? '')
  const [published, setPublished] = useState(initial?.published ?? true)
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug))

  function handleNameChange(value: string) {
    setName(value)
    if (!slugTouched) {
      setSlug(slugify(value))
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await onSubmit({
        slug: slug.trim(),
        name: name.trim(),
        description: description.trim(),
        descriptionEn: descriptionEn.trim(),
        link: link.trim(),
        photos: photos
          .split('\n')
          .map((p) => p.trim())
          .filter(Boolean),
        client: client.trim(),
        totalUsers: totalUsers.trim(),
        published,
        sortOrder,
      })
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClassName}>
            Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClassName}
            required
          />
        </div>
        <div>
          <label htmlFor="slug" className={labelClassName}>
            Slug
          </label>
          <input
            id="slug"
            value={slug}
            onChange={(e) => {
              setSlugTouched(true)
              setSlug(e.target.value)
            }}
            className={inputClassName}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClassName}>
          Description (ID)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={inputClassName}
          required
        />
      </div>

      <div>
        <label htmlFor="descriptionEn" className={labelClassName}>
          Description (EN)
        </label>
        <textarea
          id="descriptionEn"
          value={descriptionEn}
          onChange={(e) => setDescriptionEn(e.target.value)}
          rows={3}
          className={inputClassName}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="link" className={labelClassName}>
            Link
          </label>
          <input
            id="link"
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="client" className={labelClassName}>
            Client
          </label>
          <input
            id="client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            className={inputClassName}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="totalUsers" className={labelClassName}>
            Total users
          </label>
          <input
            id="totalUsers"
            value={totalUsers}
            onChange={(e) => setTotalUsers(e.target.value)}
            className={inputClassName}
          />
        </div>
        <div>
          <label htmlFor="sortOrder" className={labelClassName}>
            Sort order
          </label>
          <input
            id="sortOrder"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className={inputClassName}
          />
        </div>
      </div>

      <div>
        <label htmlFor="photos" className={labelClassName}>
          Photos (one URL per line)
        </label>
        <textarea
          id="photos"
          value={photos}
          onChange={(e) => setPhotos(e.target.value)}
          rows={4}
          className={inputClassName}
          placeholder="/project/image.png"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="rounded border-zinc-300"
        />
        Published
      </label>

      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {loading ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
