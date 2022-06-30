import { app } from "../../app";

const request = require("supertest");

it("Fails when email does not exist is supplied to request", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("Fails when an incorrect password is supplied", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "xxxxxx",
    })
    .expect(400);
});

it('responds with a cookie when given valid credentials', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test1@test.com',
        password: 'password'
      })
      .expect(201);
  
    const response = await request(app)
      .post('/api/users/signin')
      .send({
        email: 'test1@test.com',
        password: 'password'
      })
      .expect(200);
  
    expect(response.get('Set-Cookie')).toBeDefined();
  });
  