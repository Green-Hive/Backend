import {afterEach, beforeEach, describe, expect, test, afterAll, beforeAll} from 'vitest';
import request from 'supertest';
import app from '../app';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
let userId: string;
let sessionCookie: string;
let hiveId: string;

beforeEach(async () => {
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

  const hiveTest = await request(app)
    .post('/api/hives')
    .set('Cookie', sessionCookie)
    .send({
      userId,
      name: 'testHive',
      description: 'my hive description',
    });
  hiveId = hiveTest.body.id;
});

afterEach(async () => {
  await prisma.hive.deleteMany({where: {userId}});
  await prisma.user.deleteMany({where: {email: 'userWithHive1@gmail.com'}});

  const logout = await request(app)
    .post('/api/auth/logout')
    .set('Cookie', sessionCookie);
  expect(logout.status).toBe(200);

  await prisma.$disconnect();
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

describe('Hives: [GET]all /api/hives', () => {
  test('get all hives', async () => {
    expect(sessionCookie).toBeDefined();

    const validPost = await request(app)
      .post('/api/hives')
      .set('Cookie', sessionCookie)
      .send({
        userId,
        name: 'my hive3',
        description: 'my hive description',
      });
    expect(validPost.status).toBe(200);

    const validPost2 = await request(app)
      .post('/api/hives')
      .set('Cookie', sessionCookie)
      .send({
        userId,
        name: 'my hive4',
        description: 'my hive2 description',
      });
    expect(validPost2.status).toBe(200);

    const validGet = await request(app)
      .get('/api/hives')
      .set('Cookie', sessionCookie);
    expect(validGet.status).toBe(200);
    expect(validGet.body.length).toBe(3);
  });
});

describe('Hives: [GET]one /api/hives/:id', () => {
  test('get a hive by id', async () => {
    expect(sessionCookie).toBeDefined();

    const validGet = await request(app)
      .get(`/api/hives/${hiveId}`)
      .set('Cookie', sessionCookie);
    expect(validGet.status).toBe(200);
    expect(validGet.body.id).toBe(hiveId);
  });

  test('should return 400 for invalid hive id', async () => {
    expect(sessionCookie).toBeDefined();

    const invalidGet = await request(app)
      .get(`/api/hives/${"1234"}`)
      .set('Cookie', sessionCookie);

    expect(invalidGet.status).toBe(404);
  });
});

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
