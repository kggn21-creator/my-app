'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Textarea, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import styles from './ExpenseForm.module.css'

export function ExpenseForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [draftLoading, setDraftLoading] = useState(false)

  async function submit(isDraft: boolean) {
    const form = document.getElementById('expense-form') as HTMLFormElement
    if (!form) return

    const formData = new FormData(form)
    const data = {
      subcommittee: formData.get('subcommittee'),
      itemName: formData.get('itemName'),
      amount: formData.get('amount'),
      purpose: formData.get('purpose'),
      plannedDate: formData.get('plannedDate'),
      isDraft,
    }

    if (!isDraft) {
      if (!data.subcommittee || !data.itemName || !data.amount || !data.purpose || !data.plannedDate) {
        setError('필수 항목을 모두 입력해 주세요.')
        return
      }
    }

    setError('')
    if (isDraft) setDraftLoading(true)
    else setLoading(true)

    const res = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setLoading(false)
    setDraftLoading(false)

    if (!res.ok) {
      const d = await res.json()
      setError(d.error || '신청에 실패했습니다.')
      return
    }

    const expense = await res.json()
    router.push(`/expenses/${expense.id}`)
    router.refresh()
  }

  return (
    <form
      id="expense-form"
      onSubmit={(e) => { e.preventDefault(); submit(false) }}
      noValidate
      className={styles.form}
    >
      {error && (
        <div className={styles.errorAlert} role="alert">{error}</div>
      )}

      <Select label="소위원회" name="subcommittee" id="subcommittee" required>
        <option value="">소위원회를 선택해 주세요</option>
        <option value="PROMOTION_EDUCATION">홍보/교육소위</option>
        <option value="OPERATIONS">운영소위</option>
        <option value="FINANCE">재정소위</option>
        <option value="FACILITIES">시설소위</option>
      </Select>

      <Input
        label="항목명"
        type="text"
        name="itemName"
        id="itemName"
        placeholder="예: 행사 재료비, 청소 용품"
        required
      />

      <Input
        label="금액"
        type="number"
        name="amount"
        id="amount"
        placeholder="0"
        min="1"
        required
        hint="단위: 원(KRW)"
      />

      <Textarea
        label="지출 목적"
        name="purpose"
        id="purpose"
        placeholder="지출의 목적과 필요성을 구체적으로 설명해 주세요."
        required
      />

      <Input
        label="사용 예정일"
        type="date"
        name="plannedDate"
        id="plannedDate"
        required
      />

      <p className={styles.attachNote}>
        * 신청 후 상세 페이지에서 영수증 및 증빙 파일을 첨부할 수 있습니다.
      </p>

      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          loading={draftLoading}
          onClick={() => submit(true)}
        >
          임시저장
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
        >
          신청 제출
        </Button>
      </div>
    </form>
  )
}
