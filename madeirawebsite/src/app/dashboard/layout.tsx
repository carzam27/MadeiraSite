import { type PropsWithChildren } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { DashboardClient } from './_components/DashboardClient'
import { authOptions } from '@/lib/auth/config'

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/auth/login')
  }

  return (
    <DashboardClient user={session.user}>
      {children}
    </DashboardClient>
  )
}