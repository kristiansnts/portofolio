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
    const label = body.label?.trim()
    const link = body.link?.trim()

    if (!label || !link) {
      return NextResponse.json(
        { error: 'Label and link are required' },
        { status: 400 },
      )
    }

    const socialLink = await prisma.socialLink.update({
      where: { id },
      data: {
        label,
        link,
        sortOrder: Number(body.sortOrder) || 0,
      },
    })

    return NextResponse.json(socialLink)
  } catch (err) {
    console.error('[dashboard/social-links PUT]', err)
    return NextResponse.json(
      { error: 'Failed to update social link' },
      { status: 500 },
    )
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { error } = await requireSession()
  if (error) return error

  const { id } = await context.params

  try {
    await prisma.socialLink.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[dashboard/social-links DELETE]', err)
    return NextResponse.json(
      { error: 'Failed to delete social link' },
      { status: 500 },
    )
  }
}
