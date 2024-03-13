import {afterAll, expect, test} from 'vitest';
import request from 'supertest';
import app from '../app';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
let sessionCookie: string;

afterAll(async () => {
  const logout = await request(app)
    .post('/api/auth/logout')
    .set('Cookie', sessionCookie);
  expect(logout.status).toBe(200);

  await prisma.$disconnect(); // Close the Prisma client connection
});

test('GET /me when not logged', async () => {
  const response = await request(app).get('/me');

  expect(response.status).toBe(404);
  expect(response.body).toEqual({message: 'User is not logged', userInfo: null});
});

test('POST:register /api/auth/register', async () => {
  await prisma.user.deleteMany({where: {email: 'user2@gmail.com'}});

  const response = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'user2',
      email: 'user2@gmail.com',
      password: '1234',
    });
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('id');

  const setCookieHeader: any = response.headers['set-cookie'];
  expect(setCookieHeader).toBeDefined();

  sessionCookie = setCookieHeader.find((cookie: string) => cookie.startsWith('SESSION'));
  expect(sessionCookie).toBeDefined();
});

test('POST:login && logout => /api/auth/login && /logout', async () => {
  const failLogoutResponse = await request(app)
    .post('/api/auth/logout')
    .send({
      email: 'user2@gmail.com',
      password: '1234',
    });
  expect(failLogoutResponse.status).toBe(404);
  expect(failLogoutResponse.body).toEqual({message: 'User is not logged in'});

  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'user2@gmail.com',
      password: '1234',
    });
  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body).toHaveProperty('id');

  const setCookieHeader: any = loginResponse.headers['set-cookie'];
  const sessionCookie = setCookieHeader.find((cookie: string) => cookie.startsWith('SESSION'));
  expect(sessionCookie).toBeDefined();

  await prisma.user.deleteMany({where: {email: 'user2@gmail.com'}});
  // const logoutResponse = await request(app)
  //   .post('/api/auth/logout');
  // expect(logoutResponse.status).toBe(200);
  // expect(logoutResponse.body).toEqual({message: 'Logout successful'});
});

test.todo(
  'Check if session is saved in database + logout',
);



