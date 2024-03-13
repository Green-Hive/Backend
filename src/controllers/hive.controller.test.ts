import {afterEach, beforeEach, describe, expect, test, afterAll, beforeAll} from 'vitest';
import request from 'supertest';
import app from '../app';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
let userId: string;
let sessionCookie: string;
let hiveId: string;

beforeAll(async () => {
  const userRegister = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'userWithHive1',
      email: 'userWithHive1@gmail.com',
      password: '1234',
    });

  expect(userRegister.status).toBe(200);
  expect(userRegister.headers['set-cookie']).toBeDefined();

  sessionCookie = userRegister.headers['set-cookie'];
  userId = userRegister.body.id;
});

afterAll(async () => {
  await prisma.hive.deleteMany({where: {userId}});
  await prisma.user.deleteMany({where: {email: 'userWithHive1@gmail.com'}});
  await prisma.$disconnect(); // Close the Prisma client connection
});

describe('Hives: [POST] /api/hives', () => {

  test('create a new hives', async () => {
    expect(sessionCookie).toBeDefined();

    const validPost = await request(app)
      .post('/api/hives')
      .set('Cookie', sessionCookie)
      .send({
        userId,
        name: 'my hive',
        description: 'my hive description',
      });

    expect(validPost.status).toBe(200);
    expect(validPost.body).toHaveProperty('id');
    expect(validPost.body.name).toBe('my hive');
    expect(validPost.body.description).toBe('my hive description');

    hiveId = validPost.body.id;
  });

  test('return error if hive name already exists', async () => {
    expect(sessionCookie).toBeDefined();

    const validPost = await request(app)
        .post('/api/hives')
        .set('Cookie', sessionCookie)
        .send({
          userId,
          name: 'my hive2',
          description: 'my hive description',
        });
    expect(validPost.status).toBe(200);

    const invalidPost = await request(app)
      .post('/api/hives')
      .set('Cookie', sessionCookie)
      .send({
        userId,
        name: 'my hive2',
        description: 'another hive with the same name',
      });
    expect(invalidPost.status).toBe(400);
    expect(invalidPost.body).toEqual({error: 'Name already exists.'});
  });

  test('return error if false id', async () => {
    expect(sessionCookie).toBeDefined();

    const invalidPost = await request(app)
      .post('/api/hives')
      .set('Cookie', sessionCookie)
      .send({
        userId: 'falseId',
        name: 'hive2',
        description: 'another hive with false id',
      });
    expect(invalidPost.status).toBe(400);
  });
});

describe('Hives: [GET] /api/users', () => {
  test('get all hives', async () => {

    expect(sessionCookie).toBeDefined();

    const postHive1 = await request(app)
      .post('/api/hives')
      .set('Cookie', sessionCookie)
      .send({
        userId,
        name: 'hive1',
        description: 'my hive description',
      });
    expect(postHive1.status).toBe(200);

    const postHive2 = await request(app)
      .post('/api/hives')
      .set('Cookie', sessionCookie)
      .send({
        userId,
        name: 'hive2',
        description: 'my hive description',
      });
    expect(postHive2.status).toBe(200);

    const validGet = await request(app)
      .get('/api/hives')
      .set('Cookie', sessionCookie);
    expect(validGet.status).toBe(200);
    expect(validGet.body.length).toBe(4);
  });
});

// describe('GET /api/users/:id', () => {
//   test('should get a user by id', async () => {
//     // Test logic for getting a user by id
//   });
//
//   test('should return 404 for invalid user id', async () => {
//     // Test logic for invalid user id
//   });
// });
//
// describe('PATCH /api/users/:id', () => {
//   test('should update a user', async () => {
//     // Test logic for updating a user
//   });
//
//   test('should return an error for invalid data', async () => {
//     // Test logic for invalid data error
//   });
// });
//
// describe('DELETE /api/users/:id', () => {
//   test('should delete a user', async () => {
//     // Test logic for deleting a user
//   });
//
//   test('should return an error for invalid user id', async () => {
//     // Test logic for invalid user id error
//   });
// });
