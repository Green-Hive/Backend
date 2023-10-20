import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: {email: 'clem.loiseau@gmail.com'},
    update: {},
    create: {
      email: 'clem.loiseau@gmail.com',
      name: 'Clem',
      password: 'password',
    },
  });
  console.log({user});

  const hive = await prisma.hive.create({
    data: {
      title: 'Hive 1',
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
