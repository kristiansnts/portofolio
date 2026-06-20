import 'server-only'

import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import {
  createSessionToken,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  verifySessionToken,
  type SessionUser,
} from '@/lib/auth-session'
import { prisma } from '@/lib/db'

export type { SessionUser, UserRole } from '@/lib/auth-session'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash)
}

export async function createSession(user: SessionUser) {
  const token = await createSessionToken(user)
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getSession() {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)
}

export async function authenticateUser(
  identifier: string,
  password: string,
): Promise<SessionUser | null> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  })

  if (!user) {
    return null
  }

  const valid = await verifyPassword(password, user.passwordHash)

  if (!valid) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
  }
}
