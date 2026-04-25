import prisma from '../app/utils/prismaClient.js';

async function main() {
  const configs = await prisma.systemConfig.findMany();
  console.log('Current System Configs:', JSON.stringify(configs, null, 2));
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
