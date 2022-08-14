import express, { Request, Response } from "express";
import { NotFoundError, requireAuth, validateRequest, OrderStatus, BadRequestError } from "@mpena/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => {
        mongoose.Types.ObjectId.isValid(input);
      })
      .withMessage("TicketId Must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    //find ticket in db user is trying to order
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // make sure ticket is not already reserved
    const existingOrder = await Order.findOne({
      ticket: ticket,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ]
      }
    });

    if (existingOrder) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration data for this order

    // build the order and save it to the db

    // publish an event - order was created

    res.send({});
  }
);

export { router as newOrderRouter };
