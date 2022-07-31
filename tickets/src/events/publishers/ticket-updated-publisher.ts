import { Publisher, Subjects, TicketUpdatedEvent } from "@mpena/common";



export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
