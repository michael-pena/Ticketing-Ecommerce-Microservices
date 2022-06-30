import { app } from "../../app";

const request = require("supertest");

it("returns a 201 on successful signup", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "password" })
    .expect(201);
});

it("returns a 400 with an invalid email", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "asdfadwd", password: "password" })
    .expect(400);
});

it("returns a 400 with an invalid password", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "test@test.com", password: "s" })
    .expect(400);
});

it("missing email and password should result in 400", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({ email: "", password: "" })
    .expect(400);
});

it("disallows duplicate emails", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@email.com", password: "password" })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({ email: "test@email.com", password: "password" })
    .expect(400);
});

it("sets cookie after sucessful sign up", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({ email: "test@email.com", password: "password" })
    .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
});
