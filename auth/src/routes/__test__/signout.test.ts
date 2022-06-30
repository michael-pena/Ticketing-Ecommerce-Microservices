import { app } from "../../app";

const request = require("supertest");

it("clears cookie after signing out", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test1@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post("/api/users/signout")
    .send({})
    .expect(200);

  console.log(response.get("Set-Cookie"));

  expect(
    response
      .get("Set-Cookie")[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
      );
});
