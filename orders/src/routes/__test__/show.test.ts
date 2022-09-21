import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("fetches the order", async () => {
  //create the ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });

  await ticket.save();

  const user = global.signin();
  //make request to build order with the ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id })
    .expect(201);

  //make request to fetch the order
  const { body: fetchOrder} = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);


    expect(fetchOrder.id).toEqual(order.id);
});

it("returns error if user tries to access another user's order", async () => {
    //create the ticket
    const ticket = Ticket.build({
      title: "concert",
      price: 20,
    });
  
    await ticket.save();
  
    const user = global.signin();
    //make request to build order with the ticket
    const { body: order } = await request(app)
      .post("/api/orders")
      .set("Cookie", global.signin())
      .send({ ticketId: ticket.id })
      .expect(201);
  
    //make request to fetch the order
    const { body: fetchOrder} = await request(app)
      .get(`/api/orders/${order.id}`)
      .set("Cookie", user)
      .send()
      .expect(401);
  });
  
