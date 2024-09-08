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

it('updates the order status to cancelled', async () => {
    const { listener, order, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updateOrder = await Order.findById(order.id);

    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
    const { listener, order, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    //make sure the mock publish function is called
    const eventData = JSON.parse(
        (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
        );

    expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
    const { listener, order, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});