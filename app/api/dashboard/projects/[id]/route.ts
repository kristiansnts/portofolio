import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { error } = await requireSession()
  if (error) return error

  const { id } = await context.params
  const project = await prisma.project.findUnique({ where: { id } })

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  return NextResponse.json(project)
}

export async function PUT(request: Request, context: RouteContext) {
  const { error } = await requireSession()
  if (error) return error

  const { id } = await context.params

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

    const project = await prisma.project.update({
      where: { id },
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

    return NextResponse.json(project)
  } catch (err) {
    console.error('[dashboard/projects PUT]', err)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireSession()
  if (error) return error

  const { id } = await context.params

  try {
    await prisma.project.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[dashboard/projects DELETE]', err)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 },
    )
  }
}
