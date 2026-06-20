import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const { error } = await requireSession()
  if (error) return error

  const links = await prisma.socialLink.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json(links)
}

export async function POST(request: Request) {
  const { error } = await requireSession()
  if (error) return error

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

    const socialLink = await prisma.socialLink.create({
      data: {
        label,
        link,
        sortOrder: Number(body.sortOrder) || 0,
      },
    })

    return NextResponse.json(socialLink, { status: 201 })
  } catch (err) {
    console.error('[dashboard/social-links POST]', err)
    return NextResponse.json(
      { error: 'Failed to create social link' },
      { status: 500 },
    )
  }
}
