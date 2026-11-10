import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis

// Tạo adapter với link Database Cloud của bạn
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})

// Truyền adapter vào khi khởi tạo PrismaClient
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma