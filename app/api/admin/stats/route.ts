import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user) {
    return Response.json({ error: '인증이 필요합니다.' }, { status: 401 })
  }

  if (session.user.role !== 'FINANCE_DIRECTOR' && session.user.role !== 'ADMIN') {
    return Response.json({ error: '접근 권한이 없습니다.' }, { status: 403 })
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [monthlyTotal, statusCounts, pendingCount] = await Promise.all([
    prisma.expenseRequest.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        status: { in: ['APPROVED', 'COMPLETED'] },
      },
      _sum: { amount: true },
    }),
    prisma.expenseRequest.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.expenseRequest.count({
      where: { status: { in: ['PENDING', 'REVIEWING'] } },
    }),
  ])

  return Response.json({
    monthlyTotal: monthlyTotal._sum.amount || 0,
    statusCounts: statusCounts.reduce(
      (acc, item) => ({ ...acc, [item.status]: item._count.status }),
      {} as Record<string, number>
    ),
    pendingCount,
  })
}
