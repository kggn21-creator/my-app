import { RegisterForm } from './RegisterForm'
import styles from '../auth.module.css'

export const metadata = {
  title: '회원가입 | 공동육아 지출 관리',
}

export default function RegisterPage() {
  return (
    <main className={styles.authMain}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>회원가입</h1>
          <p className={styles.authSubtitle}>공동육아 어린이집 지출 관리 시스템</p>
        </div>
        <RegisterForm />
      </div>
    </main>
  )
}
