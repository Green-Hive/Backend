import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  const hashedPassword = await bcrypt.hash('1234', 10);
  const user = await prisma.user.create({
    data: {
      name: 'user',
      email: 'user@gmail.com',
      password: hashedPassword,
      provider: 'LOCAL',
    },
  });
  console.log({user});

  const user42 = await prisma.user.create({
    data: {
      name: 'user42',
      email: 'user42@gmail.com',
      password: hashedPassword,
      provider: 'LOCAL',
    },
  });
  console.log({user42});

  const hive1 = await prisma.hive.create({
    data: {
      name: 'hive1',
      description: 'Hive 1 description',
      userId: user.id,
      data: {
        'poids': [{'amt': 2400, 'name': 'Monday', 'morning': 32.5, 'afternoon': 34.3}, {
          'amt': 2210,
          'name': 'Tuesday',
          'morning': 32.9,
          'afternoon': 33.8,
        }, {'amt': 2290, 'name': 'Wednesday', 'morning': 33.1, 'afternoon': 34.3}, {
          'amt': 2000,
          'name': 'Thursday',
          'morning': 32.2,
          'afternoon': 32.9,
        }, {'amt': 2181, 'name': 'Friday', 'morning': 33.3, 'afternoon': 35}, {
          'amt': 2500,
          'name': 'Saturday',
          'morning': 33.4,
          'afternoon': 34.9,
        }, {'amt': 2100, 'name': 'Sunday', 'morning': 32.6, 'afternoon': 33.8}],
        'humidite': [{'amt': 2400, 'name': 'Monday', 'inside': 40, 'outside': 70}, {
          'amt': 2210,
          'name': 'Tuesday',
          'inside': 32,
          'outside': 80,
        }, {'amt': 2290, 'name': 'Wednesday', 'inside': 35, 'outside': 85}, {
          'amt': 2000,
          'name': 'Thursday',
          'inside': 23,
          'outside': 63,
        }, {'amt': 2181, 'name': 'Friday', 'inside': 35, 'outside': 78}, {
          'amt': 2500,
          'name': 'Saturday',
          'inside': 27,
          'outside': 67,
        }, {'amt': 2100, 'name': 'Sunday', 'inside': 19, 'outside': 57}],
        'pression': [{'amt': 2400, 'name': 'Monday', 'pression': 740}, {
          'amt': 2210,
          'name': 'Tuesday',
          'pression': 755,
        }, {'amt': 2290, 'name': 'Wednesday', 'pression': 765}, {
          'amt': 2000,
          'name': 'Thursday',
          'pression': 754,
        }, {'amt': 2181, 'name': 'Friday', 'pression': 720}, {
          'amt': 2500,
          'name': 'Saturday',
          'pression': 722,
        }, {'amt': 2100, 'name': 'Sunday', 'pression': 735}],
        'temperature': [{'amt': 2400, 'name': 'Monday', 'inside': 20, 'outside': 17}, {
          'amt': 2210,
          'name': 'Tuesday',
          'inside': 22,
          'outside': 19,
        }, {'amt': 2290, 'name': 'Wednesday', 'inside': 22, 'outside': 17}, {
          'amt': 2000,
          'name': 'Thursday',
          'inside': 20,
          'outside': 13,
        }, {'amt': 2181, 'name': 'Friday', 'inside': 21, 'outside': 16}, {
          'amt': 2500,
          'name': 'Saturday',
          'inside': 23,
          'outside': 18,
        }, {'amt': 2100, 'name': 'Sunday', 'inside': 21, 'outside': 17}],
      },
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
