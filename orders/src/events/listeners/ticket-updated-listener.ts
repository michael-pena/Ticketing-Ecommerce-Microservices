import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent, TicketUpdatedEvent } from "@mpena/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;

   async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
       //find ticket being updated in 'data' object
        const ticket = await Ticket.findById(data.id);

        if (!ticket) {
            throw new Error('Ticket not found');
        }        
       
        //update data - price and title
        const {title, price} = data;
        ticket.set({title, price});

       //save data
       await ticket.save();

       //tells nats streaming server we processed the update
       msg.ack();
   }

}