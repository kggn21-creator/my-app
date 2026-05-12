'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input, Select } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import styles from '../auth.module.css'

export function RegisterForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const passwordConfirm = formData.get('passwordConfirm') as string
    const role = formData.get('role') as string
    const subcommittee = formData.get('subcommittee') as string

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      setLoading(false)
      return
    }

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role, subcommittee: subcommittee || undefined }),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || '회원가입에 실패했습니다.')
      setLoading(false)
      return
    }

    await signIn('credentials', { email, password, redirect: false })
    router.push('/expenses')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      {error && (
        <div className={styles.errorAlert} role="alert">
          {error}
        </div>
      )}
      <Input
        label="이름"
        type="text"
        name="name"
        id="name"
        placeholder="홍길동"
        required
        autoComplete="name"
      />
      <Input
        label="이메일"
        type="email"
        name="email"
        id="email"
        placeholder="example@email.com"
        required
        autoComplete="email"
      />
      <Input
        label="비밀번호"
        type="password"
        name="password"
        id="password"
        placeholder="8자 이상 입력해 주세요"
        required
        autoComplete="new-password"
      />
      <Input
        label="비밀번호 확인"
        type="password"
        name="passwordConfirm"
        id="passwordConfirm"
        placeholder="비밀번호를 다시 입력해 주세요"
        required
        autoComplete="new-password"
      />
      <Select label="역할" name="role" id="role" required>
        <option value="MEMBER">조합원</option>
        <option value="TEACHER">교사</option>
      </Select>
      <Select label="소속 소위원회 (선택)" name="subcommittee" id="subcommittee">
        <option value="">선택 안 함</option>
        <option value="PROMOTION_EDUCATION">홍보/교육소위</option>
        <option value="OPERATIONS">운영소위</option>
        <option value="FINANCE">재정소위</option>
        <option value="FACILITIES">시설소위</option>
      </Select>
      <Button type="submit" size="lg" loading={loading} className={styles.submitBtn}>
        회원가입
      </Button>
      <p className={styles.authLink}>
        이미 계정이 있으신가요?{' '}
        <Link href="/auth/login">로그인</Link>
      </p>
    </form>
  )
}
