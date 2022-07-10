import request from "supertest";
import { app } from "../../app";
import mongoose, { mongo } from "mongoose";

it("returns a 404 ticket id does not exist ", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({ title: "asdf", price: 20 })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)    
    .send({ title: "asdf", price: 20 })
    .expect(401);
});

it("returns a 401 if a user does not own a ticket", async () => {});

it("returns a 400 if user provides an invalid title or price", async () => {});

it("it updates the ticket provided valid inputs", async () => {});
