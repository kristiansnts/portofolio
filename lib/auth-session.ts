import { SignJWT, jwtVerify } from 'jose'

export type UserRole = 'ADMIN' | 'EDITOR'

export type SessionUser = {
  id: string
  email: string
  username: string
  name: string | null
  role: UserRole
}

export const SESSION_COOKIE = 'session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET

  if (!secret) {
    throw new Error('AUTH_SECRET is not set')
  }

  return new TextEncoder().encode(secret)
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({
    id: user.id,
    email: user.email,
    username: user.username,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getAuthSecret())
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionUser | null> {
  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, getAuthSecret())

    return {
      id: payload.id as string,
      email: payload.email as string,
      username: payload.username as string,
      name: (payload.name as string | null) ?? null,
      role: payload.role as UserRole,
    }
  } catch {
    return null
  }
}
