import { NextResponse } from 'next/server'
import { requireSession } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const { error } = await requireSession()
  if (error) return error

  const email = await prisma.siteSetting.findUnique({
    where: { key: 'email' },
  })

  return NextResponse.json({ email: email?.value ?? '' })
}

export async function PUT(request: Request) {
  const { error } = await requireSession()
  if (error) return error

  try {
    const body = await request.json()
    const email = body.email?.trim()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    await prisma.siteSetting.upsert({
      where: { key: 'email' },
      update: { value: email },
      create: { key: 'email', value: email },
    })

    return NextResponse.json({ email })
  } catch (err) {
    console.error('[dashboard/settings PUT]', err)
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 },
    )
  }
}
