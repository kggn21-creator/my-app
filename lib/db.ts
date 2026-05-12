import { PrismaNeon } from '@prisma/adapter-neon'
import { PrismaClient } from '@/app/generated/prisma/client'

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.')
  const adapter = new PrismaNeon({ connectionString })
  return new PrismaClient({ adapter })
}

// Next.js dev 모드 hot reload 시 연결 풀 누수 방지 (globalThis 캐싱)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
