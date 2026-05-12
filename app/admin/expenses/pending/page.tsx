import Link from 'next/link'
import { prisma } from '@/lib/db'
import { StatusBadge } from '@/components/expense/StatusBadge'
import { SUBCOMMITTEE_LABELS, ROLE_LABELS } from '@/lib/constants'
import styles from './pending.module.css'

export const metadata = { title: '처리 대기 | 관리자' }

export default async function PendingExpensesPage() {
  const expenses = await prisma.expenseRequest.findMany({
    where: { status: { in: ['PENDING', 'REVIEWING'] } },
    include: { requester: { select: { name: true, role: true } } },
    orderBy: { createdAt: 'asc' },
  })

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>처리 대기 목록</h1>
          <p className={styles.subtitle}>승인 또는 반려가 필요한 지출 신청 목록입니다.</p>
        </div>
        <Link href="/admin/dashboard" className={styles.backLink}>← 대시보드</Link>
      </div>

      {expenses.length === 0 ? (
        <div className={styles.empty}>
          <p>처리 대기 중인 지출 신청이 없습니다.</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>항목명</th>
                <th className={styles.th}>소위원회</th>
                <th className={styles.th}>신청자</th>
                <th className={styles.th}>금액</th>
                <th className={styles.th}>상태</th>
                <th className={styles.th}>신청일</th>
                <th className={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} className={styles.tr}>
                  <td className={styles.td}>{exp.itemName}</td>
                  <td className={styles.td}>{SUBCOMMITTEE_LABELS[exp.subcommittee]}</td>
                  <td className={styles.td}>
                    {exp.requester.name}
                    <span className={styles.role}>({ROLE_LABELS[exp.requester.role]})</span>
                  </td>
                  <td className={styles.td}>{exp.amount.toLocaleString('ko-KR')}원</td>
                  <td className={styles.td}>
                    <StatusBadge status={exp.status} />
                  </td>
                  <td className={styles.td}>
                    {new Date(exp.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}
                  </td>
                  <td className={styles.td}>
                    <Link href={`/expenses/${exp.id}`} className={styles.actionLink}>
                      처리하기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
