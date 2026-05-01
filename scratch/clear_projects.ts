import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.project.deleteMany({})
  console.log('Deleted all projects')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())
