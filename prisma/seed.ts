import {PrismaClient} from '@prisma/client';


const prisma = new PrismaClient();

async function main() {

  const user = await prisma.user.create({
    data: {
      name: 'Hive 1',
      email: 'Hive 1 description',
      password: '123',
      provider: 'LOCAL',
    },
  });
  console.log({user});

  const hive = await prisma.hive.create({
    data: {
      name: 'Hive 1',
      description: 'Hive 1 description',
      userId: user.id,
    },
  });
  console.log({hive});
}


main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
