import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from "../../models/ticket";

it("returns an error if ticket doesnt exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    ticket,
    userId: "asdasdgrewv",
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

//success case
it("reserves a ticket", async () => {
  //create and save ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });

  await ticket.save();

  //save order
  await request(app)
  .post('/api/orders')
  .set('Cookie', global.signin())
  .send({ticketId: ticket.id})
  .expect(201);
  
  //get back 201
});


//fetching a user's orders - comeback and write
it('emits an order created event', async () => {

    //create and save ticket
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'concert',
      price: 20
    });
  
    await ticket.save();
  
    //save order
    await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(201);

    //look at nats publish function and make sure its invoked
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});