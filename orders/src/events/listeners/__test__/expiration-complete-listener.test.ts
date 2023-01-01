import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteEvent, OrderStatus } from "@mpena/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";
import { Order } from "../../../models/order";

const setup = async () => {
    //create listener
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    //create ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    });
    await ticket.save();

    //create order
    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'asdgf',
        expiresAt: new Date(),
        ticket: ticket,
    });
    await order.save();

    //create data object
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    };

    // @ts-ignore
    const msg: Message = {
       ack: jest.fn(), 
    };

    return { listener, order, ticket, data, msg };

};