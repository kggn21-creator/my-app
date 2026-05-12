'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/Button'
import styles from './AttachmentSection.module.css'

interface Attachment {
  id: string
  fileName: string
  filePath: string
  mimeType: string
  fileSize: number
  expenseRequestId: string
  uploadedAt: Date
}

interface Props {
  expenseId: string
  attachments: Attachment[]
  isOwner: boolean
  status: string
}

const EDITABLE_STATUSES = ['PENDING', 'DRAFT']

export function AttachmentSection({ expenseId, attachments: initial, isOwner, status }: Props) {
  const [attachments, setAttachments] = useState(initial)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const canUpload = isOwner && EDITABLE_STATUSES.includes(status)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    Array.from(files).forEach((file) => formData.append('files', file))

    const res = await fetch(`/api/expenses/${expenseId}/attachments`, {
      method: 'POST',
      body: formData,
    })

    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''

    if (res.ok) {
      const data = await res.json()
      const newItems = Array.isArray(data) ? data : data.attachments ?? [data]
      setAttachments((prev) => [...prev, ...newItems])
    } else {
      const d = await res.json()
      setError(d.error || '파일 업로드에 실패했습니다.')
    }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <section className={styles.section} aria-label="첨부 파일">
      <h2 className={styles.title}>첨부 파일</h2>

      {error && (
        <div className={styles.errorAlert} role="alert">{error}</div>
      )}

      {attachments.length === 0 ? (
        <p className={styles.empty}>첨부된 파일이 없습니다.</p>
      ) : (
        <ul className={styles.list}>
          {attachments.map((att) => (
            <li key={att.id} className={styles.item}>
              <span className={styles.icon} aria-hidden="true">📎</span>
              <div className={styles.info}>
                <a
                  href={att.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.filename}
                >
                  {att.fileName}
                </a>
                <span className={styles.size}>{formatSize(att.fileSize)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {canUpload && (
        <div className={styles.uploadArea}>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.gif,.pdf,.xlsx,.xls,.docx,.doc,.hwp"
            onChange={handleUpload}
            className={styles.fileInput}
            id="attachment-input"
            aria-label="파일 첨부"
          />
          <Button
            variant="secondary"
            size="sm"
            loading={uploading}
            onClick={() => inputRef.current?.click()}
            type="button"
          >
            파일 첨부
          </Button>
          <p className={styles.hint}>JPG, PNG, PDF, Excel, Word, HWP (최대 10MB)</p>
        </div>
      )}
    </section>
  )
}
