import Link from 'next/link'
import { auth } from '@/lib/auth'
import styles from './Navbar.module.css'
import { NavbarClient } from './NavbarClient'

export async function Navbar() {
  const session = await auth()

  return (
    <header className={styles.navbar} role="banner">
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="공동육아 어린이집 지출 관리 홈">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className={styles.logoText}>지출관리</span>
        </Link>

        <nav className={styles.nav} aria-label="주요 메뉴">
          {session?.user ? (
            <NavbarClient user={session.user} />
          ) : (
            <div className={styles.authLinks}>
              <Link href="/auth/login" className={styles.loginLink}>로그인</Link>
              <Link href="/auth/register" className={styles.registerLink}>회원가입</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
