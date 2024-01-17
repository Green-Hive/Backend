import {expect, test} from 'vitest';
import request from 'supertest';
import app from '../app';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
let userId: string;

test('POST:user => /api/users', async () => {
  await prisma.user.deleteMany({where: {email: 'user1@gmail.com'}});

  const response = await request(app)
    .post('/api/users')
    .send({
      name: 'user1',
      email: 'user1@gmail.com',
      password: '1234',
    });
  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty('id');

  userId = response.body.id;
});

test('GETall:users => /api/users', async () => {
  const response = await request(app).get('/api/users');
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});

test('GET:user => /api/users/:id', async () => {
  const user = await prisma.user.findFirst({where: {id: userId}});
});