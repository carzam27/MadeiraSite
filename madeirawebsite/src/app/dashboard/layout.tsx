import { type PropsWithChildren } from 'react'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { DashboardClient } from './_components/DashboardClient'
import { authOptions } from '@/lib/auth/config'

export default async function DashboardLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(authOptions)
  //console.log("Session user:" + session?.user);
  console.log("Layout Server Session:", {
    exists: !!session,
    token: session?.user // veremos qué información tiene
  })
  
  if (!session) {
    redirect('/auth/login')
  }

  return (
    <DashboardClient user={session.user}>
      {children}
    </DashboardClient>
  )
}