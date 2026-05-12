import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { StatusBadge } from '@/components/expense/StatusBadge'
import { SUBCOMMITTEE_LABELS } from '@/lib/constants'
import styles from './expenses.module.css'

export const metadata = { title: '내 신청 내역 | 공동육아 지출 관리' }

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await auth()
  const params = await searchParams
  const statusFilter = params.status

  const isAdmin =
    session?.user.role === 'FINANCE_DIRECTOR' || session?.user.role === 'ADMIN'

  const where: Record<string, unknown> = {}
  if (!isAdmin) where.requesterId = session?.user.id
  if (statusFilter) where.status = statusFilter

  const expenses = await prisma.expenseRequest.findMany({
    where,
    include: {
      requester: { select: { name: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const statusTabs = [
    { label: '전체', value: '' },
    { label: '대기 중', value: 'PENDING' },
    { label: '검토 중', value: 'REVIEWING' },
    { label: '승인 완료', value: 'APPROVED' },
    { label: '반려', value: 'REJECTED' },
  ]

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          {isAdmin ? '전체 지출 목록' : '내 신청 내역'}
        </h1>
        <Link href="/expenses/new" className={styles.newBtn}>
          + 새 지출 신청
        </Link>
      </div>

      <div className={styles.tabs} role="tablist" aria-label="상태 필터">
        {statusTabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.value ? `/expenses?status=${tab.value}` : '/expenses'}
            className={`${styles.tab} ${statusFilter === tab.value || (!statusFilter && !tab.value) ? styles.activeTab : ''}`}
            role="tab"
            aria-selected={statusFilter === tab.value || (!statusFilter && !tab.value)}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {expenses.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>지출 신청 내역이 없습니다.</p>
          <Link href="/expenses/new" className={styles.emptyLink}>
            첫 지출 신청하기 →
          </Link>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <caption className={styles.tableCaption}>지출 신청 목록</caption>
            <thead>
              <tr>
                <th scope="col" className={styles.th}>신청일</th>
                <th scope="col" className={styles.th}>소위</th>
                <th scope="col" className={styles.th}>항목명</th>
                <th scope="col" className={styles.th}>금액</th>
                {isAdmin && <th scope="col" className={styles.th}>신청자</th>}
                <th scope="col" className={styles.th}>상태</th>
                <th scope="col" className={styles.th}>상세</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} className={styles.tr}>
                  <td className={styles.td}>
                    {new Date(exp.createdAt).toLocaleDateString('ko-KR', {
                      year: 'numeric', month: '2-digit', day: '2-digit',
                      timeZone: 'Asia/Seoul',
                    })}
                  </td>
                  <td className={styles.td}>
                    <span className={styles.subcommitteeTag}>
                      {SUBCOMMITTEE_LABELS[exp.subcommittee] || exp.subcommittee}
                    </span>
                  </td>
                  <td className={styles.td}>{exp.itemName}</td>
                  <td className={styles.td}>
                    {exp.amount.toLocaleString('ko-KR')}원
                  </td>
                  {isAdmin && (
                    <td className={styles.td}>{exp.requester.name}</td>
                  )}
                  <td className={styles.td}>
                    <StatusBadge status={exp.status} />
                  </td>
                  <td className={styles.td}>
                    <Link href={`/expenses/${exp.id}`} className={styles.detailLink}>
                      보기
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
