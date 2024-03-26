import {afterEach, beforeEach, describe, expect, test, afterAll, beforeAll} from 'vitest';
import request from 'supertest';
import {PrismaClient} from '@prisma/client';
import app from '../../src/app.js'

const prisma = new PrismaClient();
let userId: string;
let sessionCookie: string;
let hiveId: string;

beforeEach(async () => {
  const userRegister = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'dataUser',
      email: 'dataUser@gmail.com',
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
      name: 'dataHive',
      description: 'my hive description',
    });
  hiveId = hiveTest.body.id;

  expect(sessionCookie).toBeDefined();
});

afterEach(async () => {
  await prisma.hive.deleteMany({where: {userId}});
  await prisma.user.deleteMany({where: {id: userId}});
  const logout = await request(app)
    .post('/api/auth/logout')
    .set('Cookie', sessionCookie);
  expect(logout.status).toBe(200);

  await prisma.$disconnect();
});

describe('HiveData: [POST] /api/hives/data', () => {
  test('should add data to a hive', async () => {
    const res = await request(app)
      .post('/api/hives/data')
      .set('Cookie', sessionCookie)
      .send({
        hiveId,
        temperature: 30,
        humidity: 50,
        weight: 100,
      });
    expect(res.status).toBe(200);
    expect(res.body.hiveId).toBe(hiveId);
    expect(res.body.temperature).toBe(30);
    expect(res.body.humidity).toBe(50);
    expect(res.body.weight).toBe(100);
    expect(res.body.inclination).toBe(false);
  });

  test('should not add data to a hive if false hive', async () => {
    const res = await request(app)
      .post('/api/hives/data')
      .set('Cookie', sessionCookie)
      .send({
        hiveId: 'fakeId',
        temperature: 30,
        humidity: 50,
        weight: 100,
      });
    expect(res.status).toBe(400);
  });
});

describe('HiveData: [GET]one /api/hives/data/:id', () => {
  test('should get one data from a hive', async () => {
    const data = await request(app)
      .post('/api/hives/data')
      .set('Cookie', sessionCookie)
      .send({
        hiveId,
        temperature: 30,
        humidity: 50,
        weight: 100,
      });
    const res = await request(app)
      .get(`/api/hives/data/${data.body.id}`)
      .set('Cookie', sessionCookie);
    expect(res.status).toBe(200);
    expect(res.body.hiveId).toBe(hiveId);
    expect(res.body.temperature).toBe(30);
    expect(res.body.humidity).toBe(50);
    expect(res.body.weight).toBe(100);
    expect(res.body.inclination).toBe(false);
  });

  test('should not get one data from a hive if false id', async () => {
    const res = await request(app)
      .get('/api/hives/data/falseId')
      .set('Cookie', sessionCookie);
    expect(res.status).toBe(404);
  });
});

describe('HiveData: [GET]all /api/hives/data/all/:hiveId', () => {
  test('should get all data from a hive', async () => {
    const data = await request(app)
      .post('/api/hives/data')
      .set('Cookie', sessionCookie)
      .send({
        hiveId,
        temperature: 30,
        humidity: 50,
        weight: 100,
      });
    expect(data.status).toBe(200);

    const data2 = await request(app)
      .post('/api/hives/data')
      .set('Cookie', sessionCookie)
      .send({
        hiveId,
        temperature: 10,
        humidity: 20,
        weight: 100,
        inclination: true,
      });
    expect(data2.status).toBe(200);

    const res = await request(app)
      .get(`/api/hives/data/all/${hiveId}`)
      .set('Cookie', sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(1);
  });

  test('should not get all data from a hive if false id', async () => {
    const res = await request(app)
      .get('/api/hives/data/falseId')
      .set('Cookie', sessionCookie);
    expect(res.status).toBe(404);
  });
});

describe('HiveData: [DELETE]one /api/hives/data/:id', () => {
  test('should delete data from a hive', async () => {
    const data = await request(app)
      .post('/api/hives/data')
      .set('Cookie', sessionCookie)
      .send({
        hiveId,
        temperature: 30,
        humidity: 50,
        weight: 100,
      });
    expect(data.status).toBe(200);

    const res = await request(app)
      .delete(`/api/hives/data/${data.body.id}`)
      .set('Cookie', sessionCookie);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Hive data deleted.');
  });

  test('should not delete data from a hive if false id', async () => {
    const res = await request(app)
      .delete(`/api/hives/data/${'falseId'}`)
      .set('Cookie', sessionCookie);
    expect(res.status).toBe(400);
  });
});

describe('HiveData: [DELETE]all /api/hives/data/all/:hiveId', () => {
  test('should delete all data from a hive', async () => {
    const data = await request(app)
      .post('/api/hives/data')
      .set('Cookie', sessionCookie)
      .send({
        hiveId,
        temperature: 30,
        humidity: 50,
        weight: 100,
      });
    expect(data.status).toBe(200);

    const data2 = await request(app)
      .post('/api/hives/data')
      .set('Cookie', sessionCookie)
      .send({
        hiveId,
        temperature: 10,
        humidity: 20,
        weight: 100,
        inclination: true,
      });
    expect(data2.status).toBe(200);

    const res = await request(app)
      .delete(`/api/hives/data/all/${hiveId}`)
      .set('Cookie', sessionCookie);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('All hive data deleted.');
  });

  test('should not delete all data from a hive if false id', async () => {
    const res = await request(app)
      .delete(`/api/hives/data/all/${'falseId'}`)
      .set('Cookie', sessionCookie);
    expect(res.status).toBe(404);
  });

  test('should not delete all data if no id', async () => {
    const res = await request(app)
      .delete(`/api/hives/data/all/${''}`)
      .set('Cookie', sessionCookie);
    expect(res.status).toBe(400);
  });
});