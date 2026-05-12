import styles from './StatusBadge.module.css'
import { STATUS_LABELS } from '@/lib/constants'

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`${styles.badge} ${styles[status.toLowerCase()]}`}
      aria-label={`상태: ${STATUS_LABELS[status] || status}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  )
}
