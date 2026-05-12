import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  if (session.user.role !== 'ADMIN') {
    return Response.json({ error: '접근 권한이 없습니다.' }, { status: 403 })
  }

  const { id } = await params

  const expense = await prisma.expenseRequest.findUnique({ where: { id } })
  if (!expense) {
    return Response.json({ error: '신청을 찾을 수 없습니다.' }, { status: 404 })
  }

  if (expense.status !== 'APPROVED') {
    return Response.json({ error: '승인된 신청만 완료 처리할 수 있습니다.' }, { status: 400 })
  }

  await prisma.$transaction([
    prisma.expenseRequest.update({
      where: { id },
      data: { status: 'COMPLETED' },
    }),
    prisma.approvalHistory.create({
      data: {
        action: 'COMPLETED',
        expenseRequestId: id,
        actorId: session.user.id,
      },
    }),
  ])

  return Response.json({ success: true })
}
