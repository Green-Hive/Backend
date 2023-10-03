import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userData: any = {
    email: 'user@example.com',
    name: 'Jason',
  };

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: userData,
  });
  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
