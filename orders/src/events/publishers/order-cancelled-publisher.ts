import { Publisher, OrderCancelledEvent, Subjects } from "@mpena/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}