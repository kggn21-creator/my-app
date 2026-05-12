import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const subcommittee = searchParams.get('subcommittee')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const isAdmin =
    session.user.role === 'FINANCE_DIRECTOR' || session.user.role === 'ADMIN'

  const where: Record<string, unknown> = {}

  if (!isAdmin) {
    where.requesterId = session.user.id
  }

  if (status) where.status = status
  if (subcommittee) where.subcommittee = subcommittee

  const [expenses, total] = await Promise.all([
    prisma.expenseRequest.findMany({
      where,
      include: {
        requester: { select: { id: true, name: true, role: true } },
        attachments: { select: { id: true, fileName: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.expenseRequest.count({ where }),
  ])

  return Response.json({ expenses, total, page, limit })
}

export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  const allowed = ['MEMBER', 'TEACHER']
  if (!allowed.includes(session.user.role)) {
    return Response.json({ error: '접근 권한이 없습니다.' }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { subcommittee, itemName, amount, purpose, plannedDate, isDraft } = body

    if (!isDraft && (!subcommittee || !itemName || !amount || !purpose || !plannedDate)) {
      return Response.json({ error: '필수 항목을 모두 입력해 주세요.' }, { status: 400 })
    }

    const expense = await prisma.expenseRequest.create({
      data: {
        subcommittee,
        itemName,
        amount: parseInt(amount),
        purpose,
        plannedDate: new Date(plannedDate),
        isDraft: isDraft || false,
        requesterId: session.user.id,
        status: 'PENDING',
      },
    })

    if (!isDraft) {
      await prisma.approvalHistory.create({
        data: {
          action: 'SUBMITTED',
          expenseRequestId: expense.id,
          actorId: session.user.id,
        },
      })
    }

    return Response.json(expense, { status: 201 })
  } catch (error) {
    console.error('[expenses POST]', error)
    return Response.json({ error: '일시적 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }, { status: 500 })
  }
}
