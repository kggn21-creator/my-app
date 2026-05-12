import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

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

  if (!expense) {
    return Response.json({ error: '신청을 찾을 수 없습니다.' }, { status: 404 })
  }

  const isOwner = expense.requesterId === session.user.id
  const isPrivileged =
    session.user.role === 'FINANCE_DIRECTOR' || session.user.role === 'ADMIN'

  if (!isOwner && !isPrivileged) {
    return Response.json({ error: '접근 권한이 없습니다.' }, { status: 403 })
  }

  return Response.json(expense)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const { id } = await params

  const expense = await prisma.expenseRequest.findUnique({ where: { id } })
  if (!expense) {
    return Response.json({ error: '신청을 찾을 수 없습니다.' }, { status: 404 })
  }

  if (expense.requesterId !== session.user.id) {
    return Response.json({ error: '접근 권한이 없습니다.' }, { status: 403 })
  }

  if (!expense.isDraft) {
    return Response.json({ error: '제출된 신청은 수정할 수 없습니다.' }, { status: 400 })
  }

  try {
    const body = await request.json()
    const { subcommittee, itemName, amount, purpose, plannedDate, isDraft } = body

    const updated = await prisma.expenseRequest.update({
      where: { id },
      data: {
        ...(subcommittee && { subcommittee }),
        ...(itemName && { itemName }),
        ...(amount && { amount: parseInt(amount) }),
        ...(purpose && { purpose }),
        ...(plannedDate && { plannedDate: new Date(plannedDate) }),
        ...(isDraft !== undefined && { isDraft }),
      },
    })

    if (isDraft === false) {
      await prisma.approvalHistory.create({
        data: {
          action: 'SUBMITTED',
          expenseRequestId: id,
          actorId: session.user.id,
        },
      })
    }

    return Response.json(updated)
  } catch (error) {
    console.error('[expenses PATCH]', error)
    return Response.json({ error: '일시적 오류가 발생했습니다.' }, { status: 500 })
  }
}
