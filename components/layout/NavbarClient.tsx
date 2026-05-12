'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import styles from './Navbar.module.css'
import { ROLE_LABELS } from '@/lib/constants'

interface NavbarClientProps {
  user: {
    name: string
    email: string
    role: string
  }
}

export function NavbarClient({ user }: NavbarClientProps) {
  const isAdmin = user.role === 'FINANCE_DIRECTOR' || user.role === 'ADMIN'

  return (
    <div className={styles.userArea}>
      <span className={styles.userName}>
        {user.name}
        <span className={styles.userRole}>({ROLE_LABELS[user.role] || user.role})</span>
      </span>
      {isAdmin && (
        <Link href="/admin/dashboard" className={styles.navLink}>관리</Link>
      )}
      <Link href="/expenses" className={styles.navLink}>내 신청</Link>
      <Link href="/expenses/new" className={styles.navLink}>지출 신청</Link>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className={styles.logoutBtn}
        aria-label="로그아웃"
      >
        로그아웃
      </button>
    </div>
  )
}
