import { Publisher, OrderCreatedEvent, Subjects } from "@mpena/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}