import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

jest.mock('../../nats-wrapper.ts');

it("has a router handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  //should get error code because we're not authenticated
  const response = await request(app).post("/api/tickets").send({}).expect(401);
});

it("returns a status other than 401 if user is signed in", async () => {
  //should get error code because we're not authenticated
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
});

it("returns an error if invalid price is provided", async () => {
  //negative price
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "adsas",
      price: -10,
    })
    .expect(400);

  //valid title with no price
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "adsas",
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  //check to see if ticket was added
  let tickets = await Ticket.find({}); // should be 0 tickets

  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "asldkfj",
      price: 20,
    })
    .expect(201);

    //check if record was added
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);

    
});
