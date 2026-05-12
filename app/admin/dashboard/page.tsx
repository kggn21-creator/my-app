import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import styles from './dashboard.module.css'

export const metadata = { title: '관리자 대시보드 | 지출관리' }

export default async function AdminDashboardPage() {
  const session = await auth()

  const [pending, reviewing, approved, completed, rejected, recentExpenses] = await Promise.all([
    prisma.expenseRequest.count({ where: { status: 'PENDING' } }),
    prisma.expenseRequest.count({ where: { status: 'REVIEWING' } }),
    prisma.expenseRequest.count({ where: { status: 'APPROVED' } }),
    prisma.expenseRequest.count({ where: { status: 'COMPLETED' } }),
    prisma.expenseRequest.count({ where: { status: 'REJECTED' } }),
    prisma.expenseRequest.findMany({
      where: { status: { in: ['PENDING', 'REVIEWING'] } },
      include: { requester: { select: { name: true, role: true } } },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const totalAmount = await prisma.expenseRequest.aggregate({
    _sum: { amount: true },
    where: { status: { in: ['APPROVED', 'COMPLETED'] } },
  })

  const STATUS_LABELS: Record<string, string> = {
    PENDING: '검토 대기',
    REVIEWING: '검토 중',
    APPROVED: '승인됨',
    COMPLETED: '완료',
    REJECTED: '반려',
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>관리자 대시보드</h1>
          <p className={styles.subtitle}>안녕하세요, {session?.user.name}님</p>
        </div>
        <Link href="/admin/expenses/pending" className={styles.actionLink}>
          대기 건 처리 →
        </Link>
      </div>

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statPending}`}>
          <span className={styles.statLabel}>검토 대기</span>
          <span className={styles.statValue}>{pending}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statReviewing}`}>
          <span className={styles.statLabel}>검토 중</span>
          <span className={styles.statValue}>{reviewing}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statApproved}`}>
          <span className={styles.statLabel}>승인됨</span>
          <span className={styles.statValue}>{approved}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statCompleted}`}>
          <span className={styles.statLabel}>완료</span>
          <span className={styles.statValue}>{completed}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statRejected}`}>
          <span className={styles.statLabel}>반려</span>
          <span className={styles.statValue}>{rejected}</span>
        </div>
        <div className={`${styles.statCard} ${styles.statAmount}`}>
          <span className={styles.statLabel}>승인·완료 총액</span>
          <span className={styles.statValue}>
            {(totalAmount._sum.amount ?? 0).toLocaleString('ko-KR')}원
          </span>
        </div>
      </div>

      {recentExpenses.length > 0 && (
        <section className={styles.recentSection}>
          <h2 className={styles.sectionTitle}>처리 대기 목록</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>항목명</th>
                  <th className={styles.th}>신청자</th>
                  <th className={styles.th}>금액</th>
                  <th className={styles.th}>상태</th>
                  <th className={styles.th}>신청일</th>
                  <th className={styles.th}></th>
                </tr>
              </thead>
              <tbody>
                {recentExpenses.map((exp) => (
                  <tr key={exp.id} className={styles.tr}>
                    <td className={styles.td}>{exp.itemName}</td>
                    <td className={styles.td}>{exp.requester.name}</td>
                    <td className={styles.td}>
                      {exp.amount.toLocaleString('ko-KR')}원
                    </td>
                    <td className={styles.td}>
                      {STATUS_LABELS[exp.status] || exp.status}
                    </td>
                    <td className={styles.td}>
                      {new Date(exp.createdAt).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}
                    </td>
                    <td className={styles.td}>
                      <Link href={`/expenses/${exp.id}`} className={styles.detailLink}>
                        처리
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}
