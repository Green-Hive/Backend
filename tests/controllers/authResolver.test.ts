import {afterAll, afterEach, describe, expect, test} from 'vitest';
import request from 'supertest';
import {PrismaClient} from '@prisma/client';
import {Provider} from "@prisma/client";
import app from '../../src/app.js'

const prisma = new PrismaClient();
let sessionCookie: string;

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth register: [POST] /api/auth/register', () => {
  afterAll(async () => {
    await prisma.user.deleteMany({where: {email: 'authUser@gmail.com'}});
    await prisma.user.deleteMany({where: {email: 'googleUser@gmail.com'}});
  });

  test('register an user', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'authUser',
        email: 'authUser@gmail.com',
        password: '1234',
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');

    const setCookieHeader: any = response.headers['set-cookie'];
    sessionCookie = setCookieHeader.find((cookie: string) => cookie.startsWith('SESSION'));
    expect(sessionCookie).toBeDefined();

    const logout = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', sessionCookie);
    expect(logout.status).toBe(200);
  });

  test('register an user with no password', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'authUser2',
        email: 'authUser2@gmail.com',
        password: '',
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({error: 'Password must be at least 3 characters long.'});
  });

  test('register an user with no name', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: '',
        email: 'authUser3@gmail.com',
        password: '1234',
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({error: 'Name must be at least 3 characters long.'});
  });

  test('register an user with no email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'authUser4',
        email: '',
        password: '1234',
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({error: 'Email is required.'});
  });

  test('update user password if Google provider and no password', async () => {
    const googleUser = await prisma.user.create({
      data: {
        name: 'googleUser',
        email: 'googleUser@gmail.com',
        provider: Provider.GOOGLE,
      },
    });
    expect(googleUser).toBeDefined();

    const addPasswordResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'googleUser',
        email: 'googleUser@gmail.com',
        password: '1234',
      });

    expect(addPasswordResponse.status).toBe(200);
    expect(addPasswordResponse.body.password).toBeDefined();

    const setCookieHeader: any = addPasswordResponse.headers['set-cookie'];
    sessionCookie = setCookieHeader.find((cookie: string) => cookie.startsWith('SESSION'));
    expect(sessionCookie).toBeDefined();

    const logout = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', sessionCookie);
    expect(logout.status).toBe(200);
  });

  test('register an user with existing email', async () => {
    const sameUser = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'authUser',
        email: 'authUser@gmail.com',
        password: '1234',
    });
    expect(sameUser.status).toBe(400);
    expect(sameUser.body).toEqual({error: 'User already exists.'});
  });

});

describe('Auth login: [POST] /api/auth/login', () => {
  afterAll(async () => {
    await prisma.user.deleteMany({where: {email: 'userLogin@gmail.com'}});

  });

  test('login an user', async () => {
    const user = await request(app)
      .post('/api/users')
      .send({
        name: 'userLogin',
        email: 'userLogin@gmail.com',
        password: '1234',
      });
    console.log(user.body);
    expect(user.status).toBe(201);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'userLogin@gmail.com',
        password: '1234',
      });
    expect(loginResponse.status).toBe(200);

    const setCookieHeader: any = loginResponse.headers['set-cookie'];
    const sessionCookie = setCookieHeader.find((cookie: string) => cookie.startsWith('SESSION'));
    expect(sessionCookie).toBeDefined();

    const logout = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', sessionCookie);
    expect(logout.status).toBe(200);
  });

  test("login an user with wrong password", async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'userLogin@gmail.com',
        password: '12345',
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({error: 'Invalid credentials.'});
  });

  test("login an user with wrong password", async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'userincoLogin@gmail.com',
        password: '1234',
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({error: 'User not found.'});
  });

  test("login no email", async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: '',
        password: '1234',
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({error: 'Email and password are required.'});
  });
});



describe('Auth logout: [POST] /api/auth/logout', () => {

  test('not logged', async () => {
    const failLogoutResponse = await request(app)
      .post('/api/auth/logout')
      .send({
        email: 'user2@gmail.com',
        password: '1234',
      });
    expect(failLogoutResponse.status).toBe(404);
    expect(failLogoutResponse.body).toEqual({message: 'User is not logged in'});
  });
});






