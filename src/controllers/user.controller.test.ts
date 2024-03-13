import {expect, test} from 'vitest';
import request from 'supertest';
import app from '../app';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
let userId: string;

test('POST:user => /api/users', async () => {
  await prisma.user.deleteMany({where: {email: 'user1@gmail.com'}});

  const noPassword = await request(app)
    .post('/api/users')
    .send({
      name: 'user1',
      email: 'user1@gmail.com',
    });
  expect(noPassword.status).toBe(400);
  expect(noPassword.body).toEqual({error: 'Password is required.'});

  const invalidPassword = await request(app)
    .post('/api/users')
    .send({
      name: 'user1',
      email: 'user1@gmail.com',
      password: '12',
    });
  expect(invalidPassword.status).toBe(400);
  expect(invalidPassword.body).toEqual({error: 'Password must be at least 3 characters long.'});

  const validPost = await request(app)
    .post('/api/users')
    .send({
      name: 'user1',
      email: 'user1@gmail.com',
      password: '1234',
    });
  expect(validPost.status).toBe(201);
  expect(validPost.body).toHaveProperty('id');
  expect(validPost.body.email).toBe('user1@gmail.com');
  expect(validPost.body.name).toBe('user1');

  userId = validPost.body.id;

  const alreadyExistPost = await request(app)
    .post('/api/users')
    .send({
      name: 'user1',
      email: 'user1@gmail.com',
      password: '1234',
    });
  expect(alreadyExistPost.status).toBe(400);
  expect(alreadyExistPost.body).toEqual({error: 'Email already exists.'});

  const otherError = await request(app)
    .post('/api/users')
    .send({
      email: 'user1@gmail.com',
      password: '1234',
    });
  expect(otherError.status).toBe(400);
});

test('GETall:users => /api/users', async () => {
  const response = await request(app).get('/api/users');
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
});

test('GET:user => /api/users/:id', async () => {
  const validUser = await request(app).get(`/api/users/${userId}`);
  expect(validUser.status).toBe(200);
  expect(validUser.body.id).toBe(userId);
  expect(validUser.body.email).toBe('user1@gmail.com');

  const invalidUser = await request(app).get(`/api/users/${"1234"}`);
  expect(invalidUser.status).toBe(404);
  expect(invalidUser.body).toEqual({error: 'User not found'});
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

  const errorResponse = await request(app)
    .patch(`/api/users/${userId}`)
    .send({
      name: 12,
    });
  expect(errorResponse.status).toBe(400);
});

test('DELETE:user => /api/users/:id', async () => {
  const response = await request(app).delete(`/api/users/${userId}`);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('id');
  expect(response.body).toEqual({message: 'User deleted', id: userId});

  const userId2 = '1234';
  const errorResponse = await request(app).delete(`/api/users/${userId2}`);
  expect(errorResponse.status).toBe(400);
});

