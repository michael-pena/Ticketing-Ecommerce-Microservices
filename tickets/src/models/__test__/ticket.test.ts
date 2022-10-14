import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  //create an instance of a ticket
  const ticket = Ticket.build({
    title: "concert",
    price: 5,
    userId: "123",
  });

  // save the ticket to the database
  await ticket.save();

  // fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // make two seperate changes to the ticket we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({price: 15});

  //save the first fetched ticket - should work
  await firstInstance!.save();

  //save the second fetched ticket - should bring error - out of date version number
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("should not reach this point");

});
