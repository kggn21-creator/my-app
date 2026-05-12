import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  if (session.user.role !== 'FINANCE_DIRECTOR' && session.user.role !== 'ADMIN') {
    return Response.json({ error: '접근 권한이 없습니다.' }, { status: 403 })
  }

  const { id } = await params

  const expense = await prisma.expenseRequest.findUnique({ where: { id } })
  if (!expense) {
    return Response.json({ error: '신청을 찾을 수 없습니다.' }, { status: 404 })
  }

  if (expense.status !== 'PENDING' && expense.status !== 'REVIEWING') {
    return Response.json({ error: '이미 처리된 신청입니다.' }, { status: 400 })
  }

  const body = await request.json().catch(() => ({}))

  if (!body.comment?.trim()) {
    return Response.json({ error: '반려 사유를 입력해 주세요.' }, { status: 400 })
  }

  await prisma.$transaction([
    prisma.expenseRequest.update({
      where: { id },
      data: { status: 'REJECTED' },
    }),
    prisma.approvalHistory.create({
      data: {
        action: 'REJECTED',
        comment: body.comment,
        expenseRequestId: id,
        actorId: session.user.id,
      },
    }),
  ])

  return Response.json({ success: true })
}
