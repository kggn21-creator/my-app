import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '../app/generated/prisma/client'
import bcrypt from 'bcryptjs'

const connectionString = process.env['DATABASE_URL']
if (!connectionString) throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.')
const adapter = new PrismaNeon({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@childcare.kr' },
    update: {},
    create: {
      email: 'admin@childcare.kr',
      name: '관리자',
      passwordHash,
      role: 'ADMIN',
    },
  })

  const financeDirector = await prisma.user.upsert({
    where: { email: 'finance@childcare.kr' },
    update: {},
    create: {
      email: 'finance@childcare.kr',
      name: '김재정',
      passwordHash,
      role: 'FINANCE_DIRECTOR',
    },
  })

  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@childcare.kr' },
    update: {},
    create: {
      email: 'teacher@childcare.kr',
      name: '이교사',
      passwordHash,
      role: 'TEACHER',
    },
  })

  const member = await prisma.user.upsert({
    where: { email: 'member@childcare.kr' },
    update: {},
    create: {
      email: 'member@childcare.kr',
      name: '박조합원',
      passwordHash,
      role: 'MEMBER',
    },
  })

  await prisma.expenseRequest.upsert({
    where: { id: 'seed-expense-1' },
    update: {},
    create: {
      id: 'seed-expense-1',
      requesterId: teacher.id,
      subcommittee: 'OPERATIONS',
      itemName: '청소 용품 구매',
      amount: 35000,
      purpose: '교실 청소를 위한 물걸레, 청소솔, 세제 등 소모품 구매',
      plannedDate: new Date('2026-05-01'),
      requestDate: new Date('2026-04-20'),
      status: 'PENDING',
    },
  })

  await prisma.expenseRequest.upsert({
    where: { id: 'seed-expense-2' },
    update: {},
    create: {
      id: 'seed-expense-2',
      requesterId: member.id,
      subcommittee: 'PROMOTION_EDUCATION',
      itemName: '봄 행사 현수막 제작',
      amount: 120000,
      purpose: '어린이날 행사 홍보를 위한 현수막 2장 제작 비용',
      plannedDate: new Date('2026-05-05'),
      requestDate: new Date('2026-04-21'),
      status: 'REVIEWING',
      approvals: {
        create: {
          actorId: financeDirector.id,
          action: 'REVIEWING',
          comment: '현수막 시안 확인 필요',
        },
      },
    },
  })

  console.log('✅ Seed data created successfully (NeonDB)')
  console.log('계정 정보 (비밀번호: password123):')
  console.log(`  관리자: admin@childcare.kr`)
  console.log(`  재정이사: finance@childcare.kr`)
  console.log(`  교사: teacher@childcare.kr`)
  console.log(`  조합원: member@childcare.kr`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
