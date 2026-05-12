import { ExpenseForm } from './ExpenseForm'
import styles from './new.module.css'

export const metadata = { title: '지출 신청 | 공동육아 지출 관리' }

export default function NewExpensePage() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>지출 신청서 작성</h1>
      <p className={styles.desc}>소위별 지출 신청을 위해 아래 양식을 작성해 주세요.</p>
      <div className={styles.formCard}>
        <ExpenseForm />
      </div>
    </div>
  )
}
