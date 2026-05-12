import { LoginForm } from './LoginForm'
import styles from '../auth.module.css'

export const metadata = {
  title: '로그인 | 공동육아 지출 관리',
}

export default function LoginPage() {
  return (
    <main className={styles.authMain}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>로그인</h1>
          <p className={styles.authSubtitle}>공동육아 어린이집 지출 관리 시스템</p>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
