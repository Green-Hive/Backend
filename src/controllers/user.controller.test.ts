import {afterAll, afterEach, beforeEach, describe, expect, test} from 'vitest';
import request from 'supertest';
import app from '../app';
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
let userId: string;
let sessionCookie: string;

beforeEach(async () => {
  const userRegister = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'user',
      email: 'user@gmail.com',
      password: '1234',
    });
  expect(userRegister.status).toBe(200);
  expect(userRegister.headers['set-cookie']).toBeDefined();

  sessionCookie = userRegister.headers['set-cookie'];
  userId = userRegister.body.id;

  expect(sessionCookie).toBeDefined();
});

afterEach(async () => {
  await prisma.user.deleteMany({where: {email: 'user@gmail.com'}});

  const logout = await request(app)
    .post('/api/auth/logout')
    .set('Cookie', sessionCookie);
  expect(logout.status).toBe(200);

  await prisma.$disconnect();
});

describe('Users: [POST] /api/users', () => {
  afterAll(async () => {
    await prisma.user.deleteMany({where: {email: 'user1@gmail.com'}});
    await prisma.user.deleteMany({where: {email: 'userExist@gmail.com'}});
  });

  test('create an user', async () => {
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
  });

  test('create an user with no password', async () => {
    const noPassword = await request(app)
      .post('/api/users')
      .send({
        name: 'user1',
        email: 'user1@gmail.com',
      });
    expect(noPassword.status).toBe(400);
    expect(noPassword.body).toEqual({error: 'Password is required.'});
  });

  test('create an user with invalid password', async () => {
    const invalidPassword = await request(app)
      .post('/api/users')
      .send({
        name: 'user1',
        email: 'user1@gmail.com',
        password: '12',
      });
    expect(invalidPassword.status).toBe(400);
    expect(invalidPassword.body).toEqual({error: 'Password must be at least 3 characters long.'});
  });

  test('create an user already exist', async () => {
    const postUser = await request(app)
      .post('/api/users')
      .send({
        name: 'userExist',
        email: 'userExist@gmail.com',
        password: '1234',
      });
    expect(postUser.status).toBe(201);

    const alreadyExistPost = await request(app)
      .post('/api/users')
      .send({
        name: 'userExist',
        email: 'userExist@gmail.com',
        password: '1234',
      });
    expect(alreadyExistPost.status).toBe(400);
    expect(alreadyExistPost.body).toEqual({error: 'Email already exists.'});
  });

  test('create an user with missing name', async () => {
    const otherError = await request(app)
      .post('/api/users')
      .send({
        email: 'user1@gmail.com',
        password: '1234',
      });
    expect(otherError.status).toBe(400);
  });

});

describe('Users: [GET]all /api/users', () => {
  afterAll(async () => {
    await prisma.user.deleteMany({where: {email: 'user2@gmail.com'}});
  });

  test('GETall:users => /api/users', async () => {
    const validPost = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'user2',
        email: 'user2@gmail.com',
        password: '1234',
      });
    expect(validPost.status).toBe(200);

    const validGet = await request(app).get('/api/users');
    expect(validGet.status).toBe(200);
    expect(validGet.body.length).toBe(2);
  });
});

describe('Users: [GET]one /api/users/:id', () => {
  test('get valid user', async () => {
    const validUser = await request(app).get(`/api/users/${userId}`);
    expect(validUser.status).toBe(200);
    expect(validUser.body.id).toBe(userId);
    expect(validUser.body.email).toBe('user@gmail.com');
  });

  test('get invalid user', async () => {
    const invalidUser = await request(app).get(`/api/users/${"1234"}`);
    expect(invalidUser.status).toBe(404);
    expect(invalidUser.body).toEqual({error: 'User not found'});
  });
});

describe('Users: [PATCH] /api/users/:id', () => {
  afterAll(async () => {
    await prisma.user.deleteMany({where: {email: 'newUserEmail@gmail.com'}});
  });

  test('update user', async () => {
    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .send({
        name: 'new user name',
        email: 'newUserEmail@gmail.com',
        password: '4321',
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('newUserEmail@gmail.com');
    expect(response.body.name).toBe('new user name');
  });
  test('error update', async () => {
    const response = await request(app)
      .patch(`/api/users/${userId}`)
      .send({
        name: 12,
      });
    expect(response.status).toBe(400);
  });
});

describe('Users: [DELETE] /api/users/:id', () => {
  test('delete user', async () => {
    const validDelete = await request(app).delete(`/api/users/${userId}`);
    expect(validDelete.status).toBe(200);
    expect(validDelete.body).toHaveProperty('id');
    expect(validDelete.body).toEqual({message: 'User deleted', id: userId});
  });

  test('delete invalid user', async () => {
    const invalidDelete = await request(app).delete(`/api/users/${"1234"}`);
    expect(invalidDelete.status).toBe(400);
  });
});

