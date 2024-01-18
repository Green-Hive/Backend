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
  expect(response.body.email).toBe('user1@gmail.com');
  expect(response.body.name).toBe('user1');

  userId = response.body.id;
});

test('GETall:users => /api/users', async () => {
  const response = await request(app).get('/api/users');
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});

test('GET:user => /api/users/:id', async () => {
  const response = await request(app).get(`/api/users/${userId}`);
  expect(response.status).toBe(200);
  expect(response.body.id).toBe(userId);
  expect(response.body.email).toBe('user1@gmail.com');
});

test('PATCH:user => /api/users/:id', async () => {
    await prisma.user.deleteMany({where: {email: 'user1NEW@gmail.com'}});

    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .send({
        name: 'user1NEW',
        email: 'user1NEW@gmail.com',
        password: '4321',
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('user1NEW@gmail.com');
    expect(response.body.name).toBe('user1NEW');
  },
);

test('DELETE:user => /api/users/:id', async () => {
    const response = await request(app).delete(`/api/users/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toEqual({message: 'User deleted', id: userId});
  },
);

