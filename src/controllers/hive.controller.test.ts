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

  expect(sessionCookie).toBeDefined();
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
    const validPost = await request(app)
      .post('/api/hives')
      .set('Cookie', sessionCookie)
      .send({
        userId,
        name: 'my hive3',
        description: 'my hive description',
      });
    expect(validPost.status).toBe(200);

    const validGet = await request(app)
      .get('/api/hives')
      .set('Cookie', sessionCookie);
    expect(validGet.status).toBe(200);
    expect(validGet.body.length).toBeGreaterThan(1)
  });
});

describe('Hives: [GET]one /api/hives/:id', () => {
  test('get a hive by id', async () => {
    const validGet = await request(app)
      .get(`/api/hives/${hiveId}`)
      .set('Cookie', sessionCookie);
    expect(validGet.status).toBe(200);
    expect(validGet.body.id).toBe(hiveId);
  });

  test('return 404 for invalid hive id', async () => {
    expect(sessionCookie).toBeDefined();

    const invalidGet = await request(app)
      .get(`/api/hives/${"1234"}`)
      .set('Cookie', sessionCookie);

    expect(invalidGet.status).toBe(404);
  });
});

describe('PATCH /api/hives/:id', () => {
  test('update a hive', async () => {
    const validPatch = await request(app)
      .patch(`/api/hives/${hiveId}`)
      .set('Cookie', sessionCookie)
      .send({
        name: 'new hive name',
        description: 'new hive description',
      });
    expect(validPatch.status).toBe(200);
    expect(validPatch.body.name).toBe('new hive name');
    expect(validPatch.body.description).toBe('new hive description');
  });

  test('return 400 if name taken', async () => {
    expect(sessionCookie).toBeDefined();

    const validPost = await request(app)
      .post('/api/hives')
      .set('Cookie', sessionCookie)
      .send({
        userId,
        name: 'my hive3',
        description: 'my hive description',
      });

    const invalidPatch = await request(app)
      .patch(`/api/hives/${hiveId}`)
      .set('Cookie', sessionCookie)
      .send({
        name: 'my hive3',
        description: 'new hive description',
      });
    expect(invalidPatch.status).toBe(400);
    expect(invalidPatch.body).toEqual({error: 'Name already taken.'});
  });

  test('return 400 for invalid hive id', async () => {
    expect(sessionCookie).toBeDefined();

    const invalidPatch = await request(app)
      .patch(`/api/hives/${"1234"}`)
      .set('Cookie', sessionCookie)
      .send({
        name: 'new hive name',
        description: 'new hive description',
      });

    expect(invalidPatch.status).toBe(400);
  });
});

describe('DELETE /api/hives/:id', () => {
  test('delete a hive', async () => {
    const validDelete = await request(app)
      .delete(`/api/hives/${hiveId}`)
      .set('Cookie', sessionCookie);
    expect(validDelete.status).toBe(200);
    expect(validDelete.body).toHaveProperty('id');
    expect(validDelete.body).toEqual({message: 'Hive deleted.', id: hiveId});
  });

  test('error deleted hive', async () => {
    const invalidDelete = await request(app)
      .delete(`/api/hives/${"1234"}`)
      .set('Cookie', sessionCookie);
    expect(invalidDelete.status).toBe(400);
  });
});
