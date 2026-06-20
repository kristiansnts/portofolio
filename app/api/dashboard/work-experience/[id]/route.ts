import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

type RouteContext = { params: Promise<{ id: string }> }

export async function PUT(request: Request, context: RouteContext) {
  const { error } = await requireSession()
  if (error) return error

  const { id } = await context.params

  try {
    const body = await request.json()
    const company = body.company?.trim()
    const title = body.title?.trim()

    if (!company || !title) {
      return NextResponse.json(
        { error: 'Company and title are required' },
        { status: 400 },
      )
    }

    const experience = await prisma.workExperience.update({
      where: { id },
      data: {
        company,
        title,
        start: body.start?.trim() ?? '',
        end: body.end?.trim() ?? '',
        link: body.link?.trim() ?? '#',
        sortOrder: Number(body.sortOrder) || 0,
      },
    })

    return NextResponse.json(experience)
  } catch (err) {
    console.error('[dashboard/work-experience PUT]', err)
    return NextResponse.json(
      { error: 'Failed to update work experience' },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireSession()
  if (error) return error

  const { id } = await context.params

  try {
    await prisma.workExperience.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[dashboard/work-experience DELETE]', err)
    return NextResponse.json(
      { error: 'Failed to delete work experience' },
      { status: 500 },
    )
  }
}
