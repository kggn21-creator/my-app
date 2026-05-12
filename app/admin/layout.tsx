import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect('/auth/login')
  }

  if (session.user.role !== 'FINANCE_DIRECTOR' && session.user.role !== 'ADMIN') {
    redirect('/expenses')
  }

  return <>{children}</>
}
