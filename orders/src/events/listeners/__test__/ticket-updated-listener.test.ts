import { TicketUpdatedListener } from "../ticket-updated-listener";
import { TicketUpdatedEvent } from "@mpena/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";
import mongoose from "mongoose";

const setup = async () => {
  // create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });

  await ticket.save();

  // create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "new concert",
    price: 999,
    userId: "avasdlk",
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all
  return { msg, data, ticket, listener };
};

it("finds, updates, and saves ticket", async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("ack the message", async () => {
  const { msg, data, ticket, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});


it('does not call ack if event has a skipped version number - out of order', async () => {
    const { msg, data, ticket, listener } = await setup();

    //update the version to be out of order
    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (error) {
        
    }

    expect(msg.ack).not.toHaveBeenCalled();
});
