export const SUBCOMMITTEE_LABELS: Record<string, string> = {
  PROMOTION_EDUCATION: '홍보/교육소위',
  OPERATIONS: '운영소위',
  FINANCE: '재정소위',
  FACILITIES: '시설소위',
}

export const STATUS_LABELS: Record<string, string> = {
  PENDING: '대기 중',
  REVIEWING: '검토 중',
  APPROVED: '승인 완료',
  COMPLETED: '지출 완료',
  REJECTED: '반려',
}

export const ROLE_LABELS: Record<string, string> = {
  MEMBER: '조합원',
  TEACHER: '교사',
  FINANCE_DIRECTOR: '재정이사',
  ADMIN: '관리자',
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
