import { Publisher, Subjects, TicketCreatedEvent } from "@mpena/common";



export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
