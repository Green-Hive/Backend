import {PrismaClient} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      provider: 'LOCAL',
    },
  });
  console.log({user});
  return user;
}

async function createHive(name, description, userId) {
  const hive = await prisma.hive.create({
    data: {
      name,
      description,
      userId,
    },
  });
  console.log({hive});
  return hive;
}

async function createHiveData(hiveId) {
  const hiveData = await prisma.hiveData.create({
    data: {
      hiveId,
      temperature: Math.random() * 360,
      humidity: Math.random() * 100,
      weight: Math.random() * 1000,
      inclination: Math.random() > 0.5,
    },
  });
  console.log({hiveData});
  return hiveData;
}

async function main() {
  const user1 = await createUser('user', 'user@gmail.com', '1234');
  const user42 = await createUser('user42', 'user42@gmail.com', '1234');

  const hive1 = await createHive('hive1', 'Hive 1 description', user1.id);
  const hive2 = await createHive('hive2', 'Hive 2 description', user1.id);
  const hive3 = await createHive('hive3', 'Hive 3 description', user42.id);
  const hive4 = await createHive('hive4', 'Hive 4 description', user42.id);

  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive1.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive2.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive3.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
  await createHiveData(hive4.id);
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
