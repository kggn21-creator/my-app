import React from 'react'
import styles from './Input.module.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

export function Input({
  label,
  error,
  hint,
  required,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined)

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-label="필수">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`${styles.input} ${error ? styles.error : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className={styles.errorMsg} role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${inputId}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

export function Textarea({
  label,
  error,
  hint,
  required,
  id,
  className = '',
  ...props
}: TextareaProps) {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined)

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-label="필수">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        className={`${styles.textarea} ${error ? styles.error : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className={styles.errorMsg} role="alert">
          {error}
        </p>
      )}
      {!error && hint && (
        <p className={styles.hint}>{hint}</p>
      )}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  required?: boolean
  children: React.ReactNode
}

export function Select({
  label,
  error,
  required,
  id,
  children,
  className = '',
  ...props
}: SelectProps) {
  const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined)

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-label="필수">*</span>}
        </label>
      )}
      <div className={styles.selectWrapper}>
        <select
          id={inputId}
          className={`${styles.select} ${error ? styles.error : ''} ${className}`}
          aria-invalid={!!error}
          {...props}
        >
          {children}
        </select>
        <svg className={styles.chevron} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {error && (
        <p className={styles.errorMsg} role="alert">{error}</p>
      )}
    </div>
  )
}
