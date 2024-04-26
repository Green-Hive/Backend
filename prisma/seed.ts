import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const user = await prisma.user.create({
    data: {
      name: 'user',
      email: 'user@gmail.com',
      password: "password",
      provider: 'LOCAL',
    },
  });
  console.log({user});

  const user42 = await prisma.user.create({
    data: {
      name: 'user42',
      email: 'user42@gmail.com',
      password: "password",
      provider: 'LOCAL',
    },
  });
  console.log({user42});

  const hive1 = await prisma.hive.create({
    data: {
      name: 'hive1',
      description: 'Hive 1 description',
      userId: user.id,
    },
  });
  console.log({hive1});

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
