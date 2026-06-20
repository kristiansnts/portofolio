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
    <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20 pb-20">
      <DashboardNav email={session.email} role={session.role} />
      {children}
    </div>
  )
}
