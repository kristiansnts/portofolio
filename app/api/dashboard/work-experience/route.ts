import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const { error } = await requireSession()
  if (error) return error

  const experiences = await prisma.workExperience.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return NextResponse.json(experiences)
}

export async function POST(request: Request) {
  const { error } = await requireSession()
  if (error) return error

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

    const experience = await prisma.workExperience.create({
      data: {
        company,
        title,
        start: body.start?.trim() ?? '',
        end: body.end?.trim() ?? '',
        link: body.link?.trim() ?? '#',
        sortOrder: Number(body.sortOrder) || 0,
      },
    })

    return NextResponse.json(experience, { status: 201 })
  } catch (err) {
    console.error('[dashboard/work-experience POST]', err)
    return NextResponse.json(
      { error: 'Failed to create work experience' },
      { status: 500 },
    )
  }
}
