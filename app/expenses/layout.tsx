import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Navbar } from '@/components/layout/Navbar'

export default async function ExpenseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 'var(--container-xl)', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
        {children}
      </main>
    </>
  )
}
