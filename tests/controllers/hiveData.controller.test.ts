import {afterEach, beforeEach, describe, expect, test, afterAll, beforeAll} from 'vitest';
import request from 'supertest';
import {PrismaClient} from '@prisma/client';
import app from '../../src/app.js';

const prisma = new PrismaClient();
let userId: string;
let sessionCookie: string;
let hiveId: string;

beforeEach(async () => {
  const userRegister = await request(app).post('/api/auth/register').send({
    name: 'dataUser',
    email: 'dataUser@gmail.com',
    password: '1234',
  });
  expect(userRegister.status).toBe(200);
  expect(userRegister.headers['set-cookie']).toBeDefined();

  sessionCookie = userRegister.headers['set-cookie'];
  userId = userRegister.body.id;

  const hiveTest = await request(app).post('/api/hives').set('Cookie', sessionCookie).send({
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
  const logout = await request(app).post('/api/auth/logout').set('Cookie', sessionCookie);
  expect(logout.status).toBe(200);

  await prisma.$disconnect();
});

describe('HiveData: [POST] /api/hives/data', () => {
  test('should add data to a hive', async () => {
    const res = await request(app).post('/api/hives/data').set('Cookie', sessionCookie).send({
      hiveId,
      time: 232313132,
      tempBottomLeft: 25,
      tempTopRight: 30,
      tempOutside: 20,
      pressure: 1015,
      humidityBottomLeft: 55,
      humidityTopRight: 60,
      humidityOutside: 50,
      weight: 100,
      magnetic_x: 0.01,
      magnetic_y: 0.02,
      magnetic_z: 0.03,
    });

    expect(res.status).toBe(200);
    expect(res.body.hiveId).toBe(hiveId);
    expect(res.body.time).toBe(232313132);
    expect(res.body.tempBottomLeft).toBe(25);
    expect(res.body.tempTopRight).toBe(30);
    expect(res.body.tempOutside).toBe(20);
    expect(res.body.pressure).toBe(1015);
    expect(res.body.humidityBottomLeft).toBe(55);
    expect(res.body.humidityTopRight).toBe(60);
    expect(res.body.humidityOutside).toBe(50);
    expect(res.body.weight).toBe(100);
    expect(res.body.magnetic_x).toBe(0.01);
    expect(res.body.magnetic_y).toBe(0.02);
    expect(res.body.magnetic_z).toBe(0.03);
  });

  test('should not add data to a hive if false hive', async () => {
    const res = await request(app).post('/api/hives/data').set('Cookie', sessionCookie).send({
      hiveId: 'fakeId',
      time: 232313132,
      tempBottomLeft: 25,
      tempTopRight: 30,
      tempOutside: 20,
      pressure: 1015,
      humidityBottomLeft: 55,
      humidityTopRight: 60,
      humidityOutside: 50,
      weight: 100,
      magnetic_x: 0.01,
      magnetic_y: 0.02,
      magnetic_z: 0.03,
    });
    expect(res.status).toBe(400);
  });
});

describe('HiveData: [GET]one /api/hives/data/:id', () => {
  test('should get one data from a hive', async () => {
    const data = await request(app).post('/api/hives/data').set('Cookie', sessionCookie).send({
      hiveId,
      time: 232313132,
      tempBottomLeft: 25,
      tempTopRight: 30,
      tempOutside: 20,
      pressure: 1015,
      humidityBottomLeft: 55,
      humidityTopRight: 60,
      humidityOutside: 50,
      weight: 100,
      magnetic_x: 0.01,
      magnetic_y: 0.02,
      magnetic_z: 0.03,
    });
    const res = await request(app).get(`/api/hives/data/${data.body.id}`).set('Cookie', sessionCookie);
    expect(res.status).toBe(200);
    expect(res.body.hiveId).toBe(hiveId);
    expect(res.body.time).toBe(232313132);
    expect(res.body.tempBottomLeft).toBe(25);
    expect(res.body.tempTopRight).toBe(30);
    expect(res.body.tempOutside).toBe(20);
    expect(res.body.pressure).toBe(1015);
    expect(res.body.humidityBottomLeft).toBe(55);
  });

  test('should not get one data from a hive if false id', async () => {
    const res = await request(app).get('/api/hives/data/falseId').set('Cookie', sessionCookie);
    expect(res.status).toBe(404);
  });
});

describe('HiveData: [GET]all /api/hives/data/all/:hiveId', () => {
  test('should get all data from a hive', async () => {
    const data = await request(app).post('/api/hives/data').set('Cookie', sessionCookie).send({
      hiveId,
      time: 232313132,
      tempBottomLeft: 25,
      tempTopRight: 30,
      tempOutside: 20,
      pressure: 1015,
      humidityBottomLeft: 55,
      humidityTopRight: 60,
      humidityOutside: 50,
      weight: 100,
      magnetic_x: 0.01,
      magnetic_y: 0.02,
      magnetic_z: 0.03,
    });
    expect(data.status).toBe(200);

    const data2 = await request(app).post('/api/hives/data').set('Cookie', sessionCookie).send({
      hiveId,
      time: 232313132,
      tempBottomLeft: 25,
      tempTopRight: 30,
      tempOutside: 20,
      pressure: 1015,
      humidityBottomLeft: 55,
      humidityTopRight: 60,
      humidityOutside: 50,
      weight: 100,
      magnetic_x: 0.01,
      magnetic_y: 0.02,
      magnetic_z: 0.03,
      inclination: true,
    });
    expect(data2.status).toBe(200);

    const res = await request(app).get(`/api/hives/data/all/${hiveId}`).set('Cookie', sessionCookie);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(1);
  });

  test('should not get all data from a hive if false id', async () => {
    const res = await request(app).get('/api/hives/data/falseId').set('Cookie', sessionCookie);
    expect(res.status).toBe(404);
  });
});

describe('HiveData: [DELETE]one /api/hives/data/:id', () => {
  test('should delete data from a hive', async () => {
    const data = await request(app).post('/api/hives/data').set('Cookie', sessionCookie).send({
      hiveId,
      time: 232313132,
      tempBottomLeft: 25,
      tempTopRight: 30,
      tempOutside: 20,
      pressure: 1015,
      humidityBottomLeft: 55,
      humidityTopRight: 60,
      humidityOutside: 50,
      weight: 100,
      magnetic_x: 0.01,
      magnetic_y: 0.02,
      magnetic_z: 0.03,
    });
    expect(data.status).toBe(200);

    const res = await request(app).delete(`/api/hives/data/${data.body.id}`).set('Cookie', sessionCookie);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Hive data deleted.');
  });

  test('should not delete data from a hive if false id', async () => {
    const res = await request(app).delete(`/api/hives/data/${'falseId'}`).set('Cookie', sessionCookie);
    expect(res.status).toBe(400);
  });
});

describe('HiveData: [DELETE]all /api/hives/data/all/:hiveId', () => {
  test('should delete all data from a hive', async () => {
    const data = await request(app).post('/api/hives/data').set('Cookie', sessionCookie).send({
      hiveId,
      time: 232313132,
      tempBottomLeft: 25,
      tempTopRight: 30,
      tempOutside: 20,
      pressure: 1015,
      humidityBottomLeft: 55,
      humidityTopRight: 60,
      humidityOutside: 50,
      weight: 100,
      magnetic_x: 0.01,
      magnetic_y: 0.02,
      magnetic_z: 0.03,
    });
    expect(data.status).toBe(200);

    const data2 = await request(app).post('/api/hives/data').set('Cookie', sessionCookie).send({
      hiveId,
      time: 232313132,
      tempBottomLeft: 25,
      tempTopRight: 30,
      tempOutside: 20,
      pressure: 1015,
      humidityBottomLeft: 55,
      humidityTopRight: 60,
      humidityOutside: 50,
      weight: 100,
      magnetic_x: 0.01,
      magnetic_y: 0.02,
      magnetic_z: 0.03,
    });
    expect(data2.status).toBe(200);

    const res = await request(app).delete(`/api/hives/data/all/${hiveId}`).set('Cookie', sessionCookie);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('All hive data deleted.');
  });

  test('should not delete all data from a hive if false id', async () => {
    const res = await request(app).delete(`/api/hives/data/all/${'falseId'}`).set('Cookie', sessionCookie);
    expect(res.status).toBe(404);
  });

  test('should not delete all data if no id', async () => {
    const res = await request(app).delete(`/api/hives/data/all/${''}`).set('Cookie', sessionCookie);
    expect(res.status).toBe(400);
  });
});
