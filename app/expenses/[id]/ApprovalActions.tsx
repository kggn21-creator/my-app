'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Input'
import styles from './ApprovalActions.module.css'

interface Props {
  expenseId: string
  canApprove: boolean
  canComplete: boolean
}

export function ApprovalActions({ expenseId, canApprove, canComplete }: Props) {
  const router = useRouter()
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectComment, setRejectComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleApprove() {
    setLoading(true)
    setError('')
    const res = await fetch(`/api/expenses/${expenseId}/approve`, { method: 'POST' })
    setLoading(false)
    if (res.ok) {
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || '승인에 실패했습니다.')
    }
  }

  async function handleReject() {
    if (!rejectComment.trim()) {
      setError('반려 사유를 입력해 주세요.')
      return
    }
    setLoading(true)
    setError('')
    const res = await fetch(`/api/expenses/${expenseId}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: rejectComment }),
    })
    setLoading(false)
    if (res.ok) {
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || '반려 처리에 실패했습니다.')
    }
  }

  async function handleComplete() {
    setLoading(true)
    setError('')
    const res = await fetch(`/api/expenses/${expenseId}/complete`, { method: 'POST' })
    setLoading(false)
    if (res.ok) {
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || '완료 처리에 실패했습니다.')
    }
  }

  return (
    <section className={styles.section} aria-label="승인 처리">
      <h2 className={styles.title}>처리 액션</h2>

      {error && (
        <div className={styles.errorAlert} role="alert">{error}</div>
      )}

      {canApprove && !showRejectForm && (
        <div className={styles.actions}>
          <Button variant="primary" onClick={handleApprove} loading={loading}>
            승인
          </Button>
          <Button
            variant="danger-outline"
            onClick={() => setShowRejectForm(true)}
            disabled={loading}
          >
            반려
          </Button>
        </div>
      )}

      {canApprove && showRejectForm && (
        <div className={styles.rejectForm}>
          <Textarea
            label="반려 사유"
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
            placeholder="반려 사유를 구체적으로 입력해 주세요."
            required
          />
          <div className={styles.rejectActions}>
            <Button
              variant="secondary"
              onClick={() => { setShowRejectForm(false); setRejectComment('') }}
              disabled={loading}
            >
              취소
            </Button>
            <Button variant="danger" onClick={handleReject} loading={loading}>
              반려 확인
            </Button>
          </div>
        </div>
      )}

      {canComplete && (
        <Button variant="primary" onClick={handleComplete} loading={loading}>
          지출 완료 처리
        </Button>
      )}
    </section>
  )
}
