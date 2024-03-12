import {afterEach, beforeEach, describe, expect, test, afterAll, beforeAll} from 'vitest';
import request from 'supertest';
import app from '../app';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
let userId: string;
let sessionCookie: string;
let hiveId: string;

describe('Hives: [POST] /api/hives', () => {

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
    await prisma.hive.deleteMany({where: {id: hiveId}});
    await prisma.user.deleteMany({where: {email: 'userWithHive1@gmail.com'}});
    await prisma.$disconnect(); // Close the Prisma client connection
  });

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
    console.log('validPost', validPost.body)
    expect(validPost.status).toBe(200);
    expect(validPost.body).toHaveProperty('id');
    expect(validPost.body.name).toBe('my hive');
    expect(validPost.body.description).toBe('my hive description');

    hiveId = validPost.body.id;
  });
  test('should return error if hive name already exists', async () => {
    expect(sessionCookie).toBeDefined();

    const validPost = await request(app)
        .post('/api/hives')
        .set('Cookie', sessionCookie)
        .send({
          userId,
          name: 'my hive',
          description: 'my hive description',
        });

    const invalidPost = await request(app)
      .post('/api/hives')
      .set('Cookie', sessionCookie)
      .send({
        userId,
        name: 'my hive',
        description: 'another hive with the same name',
      });

    expect(invalidPost.status).toBe(400);
    expect(invalidPost.body).toEqual({error: 'Name already exists.'});
  });

  test('should return error if false id', async () => {
    expect(sessionCookie).toBeDefined();

    const invalidPost = await request(app)
      .post('/api/hives')
      .set('Cookie', sessionCookie)
      .send({
        userId: 'falseId',
        name: 'my hive2',
        description: 'another hive with the same name',
      });

    expect(invalidPost.status).toBe(400);
  });
});

// describe('GET /api/users', () => {
//   test('should get all users', async () => {
//     // Test logic for getting all users
//   });
// });
//
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
