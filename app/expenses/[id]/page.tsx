import { notFound } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { StatusBadge } from '@/components/expense/StatusBadge'
import { ApprovalActions } from './ApprovalActions'
import { AttachmentSection } from './AttachmentSection'
import { SUBCOMMITTEE_LABELS, STATUS_LABELS, ROLE_LABELS } from '@/lib/constants'
import styles from './detail.module.css'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const expense = await prisma.expenseRequest.findUnique({ where: { id } })
  return { title: expense ? `${expense.itemName} | 지출 상세` : '지출 상세' }
}

export default async function ExpenseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params

  const expense = await prisma.expenseRequest.findUnique({
    where: { id },
    include: {
      requester: { select: { id: true, name: true, role: true } },
      attachments: true,
      approvals: {
        include: { actor: { select: { id: true, name: true, role: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!expense) notFound()

  const isOwner = expense.requesterId === session?.user.id
  const isPrivileged =
    session?.user.role === 'FINANCE_DIRECTOR' || session?.user.role === 'ADMIN'

  if (!isOwner && !isPrivileged) notFound()

  const canApprove =
    (session?.user.role === 'FINANCE_DIRECTOR' || session?.user.role === 'ADMIN') &&
    (expense.status === 'PENDING' || expense.status === 'REVIEWING')

  const canComplete =
    session?.user.role === 'ADMIN' && expense.status === 'APPROVED'

  return (
    <div className={styles.wrapper}>
      <div className={styles.breadcrumb}>
        <Link href="/expenses" className={styles.breadcrumbLink}>지출 목록</Link>
        <span className={styles.breadcrumbSep} aria-hidden="true">›</span>
        <span>지출 상세</span>
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{expense.itemName}</h1>
          <p className={styles.subtitle}>
            {SUBCOMMITTEE_LABELS[expense.subcommittee]} ·{' '}
            {expense.requester.name} ({ROLE_LABELS[expense.requester.role]})
          </p>
        </div>
        <StatusBadge status={expense.status} />
      </div>

      <div className={styles.grid}>
        <section className={styles.infoCard} aria-label="신청 정보">
          <h2 className={styles.sectionTitle}>신청 정보</h2>
          <dl className={styles.infoList}>
            <div className={styles.infoRow}>
              <dt className={styles.infoLabel}>신청일</dt>
              <dd className={styles.infoValue}>
                {new Date(expense.requestDate).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}
              </dd>
            </div>
            <div className={styles.infoRow}>
              <dt className={styles.infoLabel}>소위원회</dt>
              <dd className={styles.infoValue}>{SUBCOMMITTEE_LABELS[expense.subcommittee]}</dd>
            </div>
            <div className={styles.infoRow}>
              <dt className={styles.infoLabel}>항목명</dt>
              <dd className={styles.infoValue}>{expense.itemName}</dd>
            </div>
            <div className={styles.infoRow}>
              <dt className={styles.infoLabel}>금액</dt>
              <dd className={`${styles.infoValue} ${styles.amount}`}>
                {expense.amount.toLocaleString('ko-KR')}원
              </dd>
            </div>
            <div className={styles.infoRow}>
              <dt className={styles.infoLabel}>사용 예정일</dt>
              <dd className={styles.infoValue}>
                {new Date(expense.plannedDate).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}
              </dd>
            </div>
            <div className={styles.infoRowFull}>
              <dt className={styles.infoLabel}>지출 목적</dt>
              <dd className={styles.purposeValue}>{expense.purpose}</dd>
            </div>
          </dl>
        </section>

        <div className={styles.sideColumn}>
          <AttachmentSection
            expenseId={expense.id}
            attachments={expense.attachments}
            isOwner={isOwner}
            status={expense.status}
          />

          {(canApprove || canComplete) && (
            <ApprovalActions
              expenseId={expense.id}
              canApprove={canApprove}
              canComplete={canComplete}
            />
          )}
        </div>
      </div>

      {expense.approvals.length > 0 && (
        <section className={styles.timeline} aria-label="승인 이력">
          <h2 className={styles.sectionTitle}>처리 이력</h2>
          <ol className={styles.timelineList}>
            {expense.approvals.map((approval) => (
              <li key={approval.id} className={styles.timelineItem}>
                <div className={styles.timelineDot} aria-hidden="true" />
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.timelineAction}>
                      {STATUS_LABELS[approval.action] || approval.action}
                    </span>
                    <span className={styles.timelineActor}>
                      {approval.actor.name}
                    </span>
                    <time className={styles.timelineDate}>
                      {new Date(approval.createdAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
                    </time>
                  </div>
                  {approval.comment && (
                    <p className={styles.timelineComment}>{approval.comment}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
