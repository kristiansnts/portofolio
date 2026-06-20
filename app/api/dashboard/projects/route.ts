import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'

export async function GET() {
  const { error } = await requireSession()
  if (error) return error

  const projects = await prisma.project.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json(projects)
}

export async function POST(request: Request) {
  const { error } = await requireSession()
  if (error) return error

  try {
    const body = await request.json()
    const name = body.name?.trim()
    const slug = body.slug?.trim() || (name ? slugify(name) : '')

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 },
      )
    }

    const project = await prisma.project.create({
      data: {
        slug,
        name,
        description: body.description?.trim() ?? '',
        descriptionEn: body.descriptionEn?.trim() ?? '',
        link: body.link?.trim() ?? '#',
        photos: Array.isArray(body.photos) ? body.photos : [],
        client: body.client?.trim() ?? '',
        totalUsers: body.totalUsers?.trim() ?? '',
        published: Boolean(body.published),
        sortOrder: Number(body.sortOrder) || 0,
      },
    })

    return NextResponse.json(project, { status: 201 })
  } catch (err) {
    console.error('[dashboard/projects POST]', err)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 },
    )
  }
}
