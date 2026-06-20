import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { DashboardNav } from './dashboard-nav'

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="mx-auto min-h-screen w-full max-w-4xl px-4 py-10">
      <DashboardNav email={session.email} role={session.role} />
      {children}
    </div>
  )
}
