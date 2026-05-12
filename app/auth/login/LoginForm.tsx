'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import styles from '../auth.module.css'

export function LoginForm() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } else {
      router.push('/expenses')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
      {error && (
        <div className={styles.errorAlert} role="alert">
          {error}
        </div>
      )}
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
        placeholder="비밀번호를 입력해 주세요"
        required
        autoComplete="current-password"
      />
      <Button
        type="submit"
        size="lg"
        loading={loading}
        className={styles.submitBtn}
      >
        로그인
      </Button>
      <p className={styles.authLink}>
        계정이 없으신가요?{' '}
        <Link href="/auth/register">회원가입</Link>
      </p>
    </form>
  )
}
