import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role, subcommittee } = body

    if (!email || !password || !name || !role) {
      return Response.json({ error: '필수 항목을 모두 입력해 주세요.' }, { status: 400 })
    }

    const validRoles = ['MEMBER', 'TEACHER']
    if (!validRoles.includes(role)) {
      return Response.json({ error: '유효하지 않은 역할입니다.' }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return Response.json({ error: '이미 사용 중인 이메일입니다.' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        subcommittee: subcommittee || null,
      },
    })

    return Response.json({ id: user.id, email: user.email, name: user.name }, { status: 201 })
  } catch (error) {
    console.error('[register]', error)
    return Response.json({ error: '일시적 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }, { status: 500 })
  }
}
